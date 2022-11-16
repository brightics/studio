/**
 * hyunseok.oh@samsung.com
 * 2017-12-20
 *
 * 의존모듈 : jQuery
 */


/**
 * JSDoc 테스트 해보려고 넣어봤음
 */
(function () {
    'use strict';

    var root = this;
    // Utils 말고 다른데 있어야 할 것 같아요.
    root.Brightics.VA.Core.Utils.FileVersionDao = (function () {
        var sendAjax = function (option, doneCallback, failCallback) {
            // var ajaxRequest = $.ajax(option);
            // if (!doneCallback && !failCallback) {
            //     return Promise.resolve(ajaxRequest);
            // }
            return new Promise(function (resolve, reject) {
                $.ajax(option)
                    .done(function (result) {
                        if (doneCallback && typeof doneCallback === 'function') {
                            doneCallback(result);
                        }
                        resolve(result);
                    }).fail(function (err) {
                        if (failCallback && typeof failCallback === 'function') {
                            failCallback(err);
                        }
                        reject(err);
                    });
            });
        };

        /**
         * File Version 리스트 contents 없이 가져옴
         * @param {String} mid 파일(모델) ID
         * @param {function=} doneCallback
         * @param {function=} failCallback
         * @return {Promise<FileVersion[]>|undefined}
         */
        var getFileVersions = function (projectId, mid, doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + mid + '/versions',
                type: 'GET',
                contentType: 'application/json; charset=utf-8'
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        /**
         * File Version contents 없이 가져옴
         * @param {String} mid 파일(모델) ID
         * @param {String} versionId 파일 버젼 ID
         * @param {function=} doneCallback
         * @param {function=} failCallback
         * @return {Promise<FileVersion>|undefined}
         */
        var getFileVersion = function (projectId, mid, versionId, doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + mid + '/versions/' + versionId,
                type: 'GET',
                contentType: 'application/json; charset=utf-8'
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        var addFileVersion = function (projectId, mid, versionContents, doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + mid + '/versions',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: false,
                data: JSON.stringify(versionContents)
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        var addFileVersionSync = function (projectId, mid, versionContents, doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + mid + '/versions',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: true,
                data: JSON.stringify(versionContents)
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        var deleteFileVersion = function (projectId, mid, versionId, doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + mid + '/versions/'+ versionId + '/delete',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: false
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        var updateFileVersion = function (projectId, mid, versionId, versionContents,
                doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + mid + '/versions/' + versionId + '/update',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: false,
                data: JSON.stringify(versionContents)
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        var loadFileVersion = function (projectId, mid, versionId, doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + mid + '/versions/'+ versionId + '/load',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: false
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        // public
        return {
            getFileVersions: getFileVersions,
            getFileVersion: getFileVersion,
            addFileVersion: addFileVersion,
            addFileVersionSync: addFileVersionSync,
            deleteFileVersion: deleteFileVersion,
            updateFileVersion: updateFileVersion,
            loadFileVersion: loadFileVersion
        };
    }());
}).call(this);
