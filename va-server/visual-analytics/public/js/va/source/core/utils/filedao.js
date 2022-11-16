/**
 * hyunseok.oh@samsung.com
 * 2018-01-02
 *
 * 의존모듈 : jQuery
 */

(function () {
    'use strict';

    var root = this;

    root.Brightics.VA.Core.Utils.FileDao = (function () {
        var sendAjax = function (option, doneCallback, failCallback) {
            return new Promise(function (resolve, reject) {
                $.ajax(option)
                    .done(function (result) {
                        if (doneCallback && typeof doneCallback === 'function') {
                            if (result && result.length) {
                                doneCallback(result[0]);
                            } else if (result) {
                                doneCallback(result);
                            } else {
                                doneCallback(null);
                            }
                        }

                        if (result && result.length) {
                            resolve(result[0]);
                        } else if (result) {
                            resolve(result);
                        } else {
                            resolve(null);
                        }
                    }).fail(function (err) {
                        if (failCallback && typeof failCallback === 'function') {
                            failCallback(err);
                        }
                        reject(err);
                    });
            });
        };

        var getFile = function (projectId, fileId, doneCallback, failCallback) {
            var option = {
                url: 'api/va/v2/ws/projects/' + projectId + '/files/' + fileId,
                type: 'GET',
                contentType: 'application/json; charset=utf-8'
            };
            return sendAjax(option, doneCallback, failCallback);
        };

        // public
        return {
            getFile: getFile
        };
    }());
}).call(this);
