const locations = {
    js: ['./public/js/va/functions/',
        './public/js/va/addonfunctions/']
    // json: [ './public/js/va/functions/json/',
    //     './public/js/va/addonfunctions/json/'],
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
};

const DBLoadPromise = (req, palette) => new Promise((resolve, reject) => {
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
                    const item = {func: name, visible: true, deletable: fn.creator === req.user.id ? true : false}
                    const category = JSON.parse(fn.contents).category
                    const list = palette.filter(p => p.key === category)
                    if(list.reduce((s, i) => s || !i.functions.some(obj => obj.func === name), false)) {
                        list.map(obj => obj.functions.push(item));
                    }
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
            if(list.reduce((s, i) => s || !i.functions.some(obj => obj.func === name), false)) {
                list.map(obj => obj.functions.push(item));
            }
        });
};
const getFileContentsViaCorePromise = (req) => new Promise((resolve, reject) => {
    const options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v3/function/meta');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response) {
        if (error) {
            reject(response);
        } else {
            if (response.statusCode === 200) {
                const list = JSON.parse(response.body);
                resolve(Object.values(list));
            } else {
                reject(response.statusCode);
            }
        }
    })
});

const JSONLoader = async (req) => {
    return await getFileContentsViaCorePromise(req);
}

const getFileContentViaCorePromise = (req) => new Promise((resolve, reject) => {
    const options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v3/function/meta/' + req.params.func);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response) {
        if (error) {
            reject(response);
        } else {
            if (response.statusCode == 200) {
                if(response.body != "") {
                    resolve(JSON.parse(response.body));
                } else {
                    resolve({});
                }
            } else {
                reject(response.statusCode);
            }
        }
    })
});

const JSONLoaderbyFunction = async (req) => {
    return await getFileContentViaCorePromise(req);
}

// returning value : Promise
const makeCustomPalette = async (req, palette) => {
    const list = Object
        .entries(locations)
        .map(entry => getFileListbyType(entry[1], entry[0]))
    const [js_chunks] = await Promise.all(list)
    // done[0]은 js묶음, done[1]은 json묶음
    JSLoader(palette, js_chunks);
    const [fileContents, dbContents] = await Promise.all([JSONLoader(req), DBLoadPromise(req, palette)])
    return {
        palette,
        fileContents: fileContents || [],
        dbContents: dbContents || []
    };
}

// returning value : Promise
exports.makePalette = async (req, res, palette = [], type = 'data') => {
    if (type === 'data') {
        const result = await makeCustomPalette(req, palette)
        return result;
    }
    return undefined;
}

// returning value : Promise
exports.getPaletteModelType = (req, res, modelType = '') =>
    new Promise((resolve, reject) => {
        const palette = getPaletteByModelType(modelType)
        resolve({palette})
    });

// returning value : Promise
exports.getPalette = function (req, res) {
    const palette = getPaletteByModelType('data')
    return makeCustomPalette(req, palette)
};

// router function for express
// TODO: express에서는 비동기 router function을 이루기위해 asyncnify가 필요하다.
//       다른 async지원을 충분히 가능하도록 express에서 지원을 할때 전환 필요 or
//       자체 asyncnify나 promisify을 구현 할 필요가 있다.
exports.listFunctions = function (req, res) {
    Promise.resolve(JSONLoader(req))
        .then(s => {
            res.send(s.map(e => e.specJson))
        })
};

exports.getFunctionbyFunc = function (req, res) {
    Promise.resolve(JSONLoaderbyFunction(req))
        .then(s => {
            res.send(s.specJson)
        })
}