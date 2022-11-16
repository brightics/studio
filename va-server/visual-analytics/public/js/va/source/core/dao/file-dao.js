import { ajaxGet, ajaxPost, ajaxPostSync } from '../../../../../../src/utils/ajax2promise';
import { File } from '../vomodels/file';
import hash from 'object-hash';

/* global _ */

const { map, compact, first, flow } = _;

const toFileVo = (json) => {
    try {
        var file = new File(json);
        return file;
    } catch (e) {
        console.warn('Some files are ignored.');
        return undefined;
    }
};

const toFileVoEach = (jsonArray) => compact(map(jsonArray, toFileVo));
const getFirstFile = flow(first, toFileVo);

/**
 * 프로젝트 리스트 가져옴
 * @return {Promise<Array<File>>}
 */
function getFiles(projectId) {
    const url = `api/va/v2/ws/projects/${projectId}/files`;
    return ajaxGet(url).then(toFileVoEach);
}

function getFile(projectId, fileId) {
    const url = `api/va/v2/ws/projects/${projectId}/files/${fileId}`;
    return ajaxGet(url).then((file) => file.length ? getFirstFile(file) : null);
}

function addFile(projectId, file) {
    const url = `api/va/v2/ws/projects/${projectId}/files`;
    return ajaxPost(url, file.toJSON());
}

function updateFile(projectId, file) {
    const url = `api/va/v2/ws/projects/${projectId}/files/${file.getFileId()}/update`;
    return ajaxPost(url, file.toJSON()).then(getFirstFile);
}

function updateFileSync(projectId, file) {
    const url = `api/va/v2/ws/projects/${projectId}/files/${file.getFileId()}/update`;
    return ajaxPostSync(url, file.toJSON()).then(getFirstFile);
}

function deleteFile(projectId, fileId) {
    const url = `api/va/v2/ws/projects/${projectId}/files/${fileId}/delete`;
    return ajaxPost(url);
}

function saveFileSync(projectId, file, modelDiff) {
    const url = `api/va/v2/ws/projects/${projectId}/files/${file.getFileId()}/save`;

    const normalize = (x) => JSON.parse(JSON.stringify(x));
    const contents = normalize(file.getContents());
    const opt = Object.assign(_.omit(file.toJSON(), 'contents'), {
        modelDiff,
        hash: hash(contents, {
            respectFunctionProperties: false,
            respectFunctionNames: false,
            respectType: false,
        }),
    });

    return ajaxPostSync(url, opt).then(first);
}

const FileDao = {
    getFiles: getFiles,
    getFile: getFile,
    addFile: addFile,
    updateFile: updateFile,
    updateFileSync: updateFileSync,
    deleteFile: deleteFile,
    saveFileSync: saveFileSync,
};

export { FileDao };
