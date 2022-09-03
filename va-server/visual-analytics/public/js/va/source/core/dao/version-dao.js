import { ajaxGet, ajaxPost } from '../../../../../../src/utils/ajax2promise';
import { File } from '../vomodels/file';
import { Version } from '../vomodels/version';

/* global _ */

var toVersionVo = function (json) {
    var version = new Version(json);
    return version;
};

var toFileVo = function (json) {
    var file = new File(json);
    return file;
};

var toVersionVoEach = function (jsonArray) {
    return _.map(jsonArray, toVersionVo);
};

// var extendModel = function (version) {
//     version.contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(version.contents);
//     var supportModelList = Object.keys(Brightics.VA.Core.Interface.Clazz);
//     if (typeof file !== 'undefined') {
//         if (supportModelList.indexOf(version.contents.type) < 0) return;
//     }
//     version.contents.title = version.label;
//     version.contents.mid = version.file_id;
//     version.contents.adjustLinks();
// };

/**
 * 프로젝트 리스트 가져옴
 * @return {Promise<Array<File>>}
 */
var getVersions = function (projectId, fileId) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/files/' + fileId + '/versions';
    return ajaxGet(url).then(toVersionVoEach);
};

var getVersion = function (projectId, fileId, versionId) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/files/' + fileId + '/versions/' + versionId;
    return ajaxGet(url).then(toVersionVo);
};

var addVersion = function (projectId, fileId, version) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/files/' + fileId + '/versions';
    return ajaxPost(url, version.toJSON(true)).then(toVersionVo);
};

var updateVersion = function (projectId, fileId, version) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/files/' +
        fileId + '/versions/' + version.getVersionId() + '/update';
        // fileId + '/versions/' + version.getVersionId() + '/update';
    return ajaxPost(url, version);
};

// var deleteVersion = function (projectId, fileId, versionId) {
//     var url = 'api/va/v2/ws/projects/' + projectId + '/files/' +
//         fileId + '/versions/' + versionId + '/delete';
//     return ajaxPost(url);
// };

var loadVersion = function (projectId, fileId, versionId) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/files/' +
        fileId + '/versions/' + versionId + '/load';
    return ajaxPost(url).then(function (fileJSONs) {
        if (fileJSONs.length) {
            return toFileVo(fileJSONs[0]);
        }
        return undefined;
    });
};

var getVersionsForced = function (projectId, fileId, cb, fail) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/files/' + fileId + '/versions';
    var opt = {
        type: 'GET',
        blocking: true,
        async: false,
        url: url,
        contentType: 'application/json; charset=utf-8'
    };
    return $.ajax(opt)
        .done(function (data) {
            if (cb && typeof cb === 'function') {
                return cb(toVersionVoEach(data));
            }
        })
        .fail(function (error) {
            if (fail && typeof fail === 'function') {
                return fail(error);
            }
        });
};

var getVersionForced = function (projectId, fileId, versionId, cb, fail) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/files/' + fileId + '/versions/' + versionId;
    var opt = {
        type: 'GET',
        blocking: true,
        async: false,
        url: url,
        contentType: 'application/json; charset=utf-8'
    };
    return $.ajax(opt)
        .done(function (data) {
            if (cb && typeof cb === 'function') {
                return cb(toVersionVo(data));
            }
        })
        .fail(function (error) {
            if (fail && typeof fail === 'function') {
                return fail(error);
            }
        });
};

var VersionDao = {
    getVersions: getVersions,
    getVersion: getVersion,
    addVersion: addVersion,
    updateVersion: updateVersion,
    loadVersion: loadVersion,
    getVersionsForced: getVersionsForced,
    getVersionForced: getVersionForced
    // deleteVersion: deleteVersion
};

export { VersionDao };
