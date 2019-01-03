const locations = {
    js: [   './public/js/va/functions/',
        './public/js/va/addonfunctions/'],
    json: [ './public/js/va/functions/json/',
        './public/js/va/addonfunctions/json/'],
};
const request = require('request');
const getPaletteByModelType = require('../../../../lib/merge-palette');

const getFileListPromise = (dir = '', type = '') => new Promise((resolve, reject) => {
    if (!__REQ_fs.existsSync(dir)) {
        __REQ_fs.mkdirSync(dir);
    }

    __REQ_fs.readdir(dir, (err, files) => {
        if (err) {
            if (err.code !== 'ENOENT') console.error(err)
            reject()
        } else {
            resolve(files.map(n => n.trim()).filter(n => n.endsWith(type)));
        }
    })
})

const getFileListbyType = async (dirs = [], type = '') => {
    let list = dirs.map(dir => getFileListPromise(dir, type));
    let files = await Promise.all(list);
    return files
}

const getFilePromise = (filename = '', type = '') => new Promise( (resolve, reject) => {
    __REQ_fs.readFile(filename, (err, file) => {
        if (err) {
            if (err.code !== 'ENOENT') console.error(err)
            reject()
        } else {
            resolve(file);
        }
    })
})

const DBLoadPromise = (req, res, palette) => new Promise((resolve, reject) => {
    const options = __BRTC_API_SERVER.createRequestOptions('GET', '/api/vastudio/v3/udfs');
    __BRTC_API_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response) {
        if (error) {
            reject(response);
        } else {
            if (response.statusCode === 200) {
                const list = JSON.parse(response.body);
                list.forEach(fn => {
                    const name = fn.id
                    const item = {func: name, visible: true, deletable: fn.creator === req.user.id? true: false}
                    const category = JSON.parse(fn.contents).category
                    const list = palette.filter(p => p.key === category)
                    // const action =
                        list.reduce((s, i) => s || !i.functions.some(obj => obj.func === name), false) ?
                            list.map(obj => obj.functions.push(item)) && `success ${name}` :
                            `fail ${name}`;
                })
                resolve(list);
            } else {
                reject(response);
            }
        }
    })
});

const JSLoader = (palette, list) => {
    list.reduce((statement, element) => [...statement, ...element], [])
        .forEach(file => {
            const fileName = file.substring(0, file.length - 3).split('_');
            const category = fileName[0].trim();
            const name = fileName[1];
            const item = {func: name, visible: true};
            const list = palette.filter(p => p.key === category)
            // const action =
                list.reduce((s, i) => s || !i.functions.some(obj => obj.func === name), false) ?
                    list.map(obj => obj.functions.push(item)) && `success ${name}` :
                    `fail ${name}`;
            // console.log(action)
        });
};
const JSONLoader = async (palette, list) => {
    const target = 'json';
    const fullFilePath = list.map((item, index) =>
        item.map(filename => locations[target][index] + filename))
        .reduce((statement, element) => [...statement, ...element], []);
    const FileLoadPromise = fullFilePath
        .map(file => getFilePromise(file))
    const loading = await Promise.all(FileLoadPromise)
    const fileContents = loading.filter(item => {
        try {
            JSON.parse(item)
            return true
        } catch (e) {
            return false
        }
    })
        .map(JSON.parse)
    fileContents.forEach(file => {
        const category = file.specJson.category;
        const name = file.specJson.func;
        const item = {func: name, visible: true};
        const list = palette.filter(p => p.key === category)
        // const action =
            list.reduce((s, i) => s || !i.functions.some(obj => obj.func === name), false) ?
                list.map(obj => obj.functions.push(item)) && `success ${name}` :
                `fail ${name}`;
    })
    return fileContents;
}

const makeCustomPalette = async (req, res, palette) => {
    const list = Object
        .entries(locations)
        .map(entry => getFileListbyType(entry[1], entry[0]))
    const [js_chunks, json_chunks] = await Promise.all(list)
    // done[0]은 js묶음, done[1]은 json묶음
    JSLoader(palette, js_chunks);
    const [fileContents, dbContents] = await Promise.all([JSONLoader(palette, json_chunks), DBLoadPromise(req, res, palette)])
    return {
        palette,
        fileContents: fileContents || [],
        dbContents: dbContents || []
    };
}


exports.makePalette = async (req, res, palette = [], type = 'data') => {
    if (type === 'data') {
        const result = await makeCustomPalette(req, res, palette)
        return result;
    }
    return undefined;
}

exports.getPaletteModelType = (req, res, modelType = '') =>
    new Promise((resolve, reject) => {
        const palette = getPaletteByModelType(modelType)
        resolve({palette})
    });

exports.getPalette = function (req, res) {
    const palette = getPaletteByModelType('data')
    return makeCustomPalette(req, res, palette)
};

exports.listFunctions = function (req, res) {
    const palette = getPaletteByModelType('data')
    makeCustomPalette(req, res, palette)
        .then(s => {
            res.send(s.fileContents.map(e => e.specJson))
        })
};