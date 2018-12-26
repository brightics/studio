const fs = require('fs');
const util = require('util');

function dirsToTags(dirs) {
    const readDir = (dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        const read = util.promisify(__REQ_fs.readdir);
        return read(dirPath).then((files) => [dirPath, files]);
    };

    const pad4 = (s) => '    ' + s;
    const mapToTag = (dir) => (f) => {
        const srcDir = dir.substring(dir.lastIndexOf('public/') + 7, dir.length);
        if (f.endsWith('.js')) {
            return pad4(`<script src="${srcDir}/${f}"></script>`);
        }
        if (f.endsWith('.css')) {
            return pad4(`<link type="text/css" rel="stylesheet" href="${srcDir}/${f}"/>`);
        }
        return undefined;
    };

    return Promise.all(dirs.map(readDir))
        .then((filesArray) => filesArray.reduce((acc, [dir, files]) => {
            const files2Tags = files.map(mapToTag(dir.split('\\').join('/')));
            const validTags = files2Tags.filter((x) => x);
            return acc.concat(validTags);
        }, []))
        .then((tags) => tags.join('\n'));
}

module.exports = dirsToTags;
