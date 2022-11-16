/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    root.Brightics.VA.Core.Utils.DownLoader = {
        run: function (userId, mid, table, fileName, delimiters, callback, failCallback) {
            var _this = this;
            var dataPath = '/' + userId + '/' + mid + '/' + table;
            _this.runStartWithExport(fileName, dataPath, delimiters, callback, failCallback);
        },
        runStartWithExport: function (fileName, inputPath, delimiters, callback, failCallback) {
            var _this = this;
            _this.export(fileName, inputPath, delimiters, callback, failCallback);
        },
        doDownload: function (dataPath, fileName, tempFile, callback, failCallback, additionalOpt) {
            this.download(dataPath, fileName).always(function () {
                var opt = {
                    url: 'api/v1/repo/alluxio/datas/' + tempFile + '/destroy',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    blocking: false,
                    data: JSON.stringify({'type': 'tmp', 'data': tempFile})
                };
                $.extend(true, opt, additionalOpt);
                $.ajax(opt);
                opt = {
                    url: 'api/v1/repo/alluxio/datas/' + tempFile + '.csv/destroy',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    blocking: false,
                    data: JSON.stringify({'type': 'tmp', 'data': tempFile + '.csv'})
                };
                $.extend(true, opt, additionalOpt);
                $.ajax(opt);
            }).done(function () {
                if (typeof callback == 'function') callback();
            }).fail(failCallback);
        },
        progress: function (userId, jobId, additionalOpt) {
            var rep = {
                fail: function (callback) {
                    this.failCallback = callback;
                    return this;
                },
                done: function (callback) {
                    this.doneCallback = callback;
                    return this;
                }
            };

            var checkStatus = function () {
                var opt = {
                    url: 'api/va/v2/analytics/jobs/' + jobId,
                    type: 'GET',
                    blocking: false
                };
                $.extend(true, opt, additionalOpt);
                $.ajax(opt).done(function (res) {
                    if (res.status === 'FAIL' || res.status === 'ABORT') {
                        var error = {
                            status: 400,
                            responseJSON: {
                                'errors': [
                                    {'code': 400, 'message': 'Failed to export data.'}
                                ]
                            }
                        };

                        try {
                            var params = Brightics.VA.Core.Utils.MessageUtils.getFunctionLabels('unload', res.errorInfo[0].parameter);
                            error.responseJSON.errors[0].message = Brightics.VA.Core.Utils.MessageUtils.getMessage(res.errorInfo[0].errorCode, params);

                            if (rep.failCallback) rep.failCallback(error);
                        } catch (err) {
                            if (rep.failCallback) rep.failCallback(error);
                        }
                    }
                    else if (res.status === 'SUCCESS') {
                        if (rep.doneCallback) rep.doneCallback();
                    }
                    else {
                        setTimeout(checkStatus, 3000);
                    }
                }).fail(function (err) {
                    if (rep.failCallback) rep.failCallback(err);
                });
            };
            setTimeout(checkStatus, 3000);

            return rep;
        },
        unload: function (userId, mid, inTable, outPath, delimiters, additionalOpt) {
            var _this = this;
            var rep = {
                fail: function (callback) {
                    this.failCallback = callback;
                    return this;
                },
                done: function (callback) {
                    this.doneCallback = callback;
                    return this;
                }
            };
            var jobId = 'va_' + Date.now();

            if (delimiters) {
                if (!delimiters.delimiter) delimiters.delimiter = ',';
                if (!delimiters['array-delimiter']) delimiters['array-delimiter'] = ';';
                if (!delimiters['key-value-delimiter']) delimiters['key-value-delimiter'] = ':';
                if (!delimiters['quote-delimiter']) delimiters['quote-delimiter'] = '"';
            } else {
                delimiters = {
                    delimiter: ',',
                    'array-delimiter': ';',
                    'key-value-delimiter': ':',
                    'quote-delimiter': '"'
                }
            }

            var option = {
                'user': userId,
                'jid': jobId,
                'main': mid,
                'args': {},
                'models': {}
            };
            option.models[mid] = {
                'mid': mid,
                'type': "data",
                'functions': [
                    {
                        'fid': 'f-unload',
                        'func': 'unload',
                        'inData': [inTable],
                        'name': 'OutData',
                        'param': {
                            'io-mode': 'write',
                            'fs-type': 'alluxiocsv',
                            'df-names': [inTable],
                            'fs-paths': [outPath],
                            'delimiter': delimiters.delimiter,
                            'array-delimiter': delimiters['array-delimiter'],
                            'key-value-delimiter': delimiters['key-value-delimiter'],
                            'quote': delimiters['quote-delimiter']
                        }
                    }
                ],
                'links': [],
                'entries': ['f-unload']
            };

            var opt = {
                url: 'api/va/v2/analytics/jobs',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(option),
                blocking: false
            };
            $.extend(true, opt, additionalOpt);
            $.ajax(opt).done(function () {

                _this.progress(userId, jobId).done(rep.doneCallback).fail(rep.failCallback);

            }).fail(function () {
                if (rep.failCallback) rep.failCallback();
            });

            return rep;
        },
        export: function (fileName, dataPath, delimiters, callback, failCallback, additionalOpt) {
            var delimiter = delimiters.delimiter || ',';
            var path = dataPath;
            var opt = {
                url: 'api/va/v2/data/download',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    // localFileName: fileName,
                    delimiter: delimiter,
                    remotePath: path,
                    filename: fileName
                }),
                blocking: false,
                timeout: 30 * 60 * 1000
            };
            $.extend(true, opt, additionalOpt);

            var encodedKey = encodeURIComponent(path);
            var encodedDelimiter = encodeURIComponent(delimiter);
            var encodedFilename = encodeURIComponent(fileName);

            $.ajax(opt).done(function (result) {
                // var blob = new Blob(sb, {type: 'text/csv'});
                if (window.navigator.msSaveBlob) {
                    Promise.resolve($.get('api/va/v2/data/download/files/?' +
                        Brightics.VA.Core.Utils.CommonUtils.getQueryString({
                            key: encodedKey,
                            delimiter: encodedDelimiter,
                            filename: encodedFilename
                        }))
                    )
                        .then(function (file) {
                            console.log(file);
                            window.navigator.msSaveBlob(new Blob([file]), fileName);
                        });
                } else {
                    var anchor = document.createElement('a');
                    anchor.setAttribute("href", encodeURI('api/va/v2/data/download/files/?key=' + encodeURIComponent(path) + '&delimiter=' + encodeURIComponent(delimiter) + '&filename=' + encodeURIComponent(fileName)));
                    anchor.setAttribute("download", fileName);
                    anchor.setAttribute('id', 'downloadfile');
                    anchor.setAttribute('target', '_blank');
                    $(anchor)[0].click();

                    setTimeout(function () {
                        $('#downloadfile').remove()
                    }, 10000);
                }

                callback();
            }).fail(function (error) {
                failCallback(error);
            });
        },
        download: function (remotePath, localFileName, additionalOpt) {
            var option = {
                'remotePath': remotePath,
                'localFileName': localFileName
            };
            var opt = {
                url: 'api/va/v2/data/download',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: false,
                data: JSON.stringify(option)
            };
            $.extend(true, opt, additionalOpt);
            return $.ajax(opt).done(function (result) {
                $('<object>', {
                    id: 'downloadfile',
                    data: 'api/va/v2/repo/download/files/' + result.file,
                    target: '_top',
                    type: "text/html", title: "Title"
                }).hide().appendTo('body');
                setTimeout(function () {
                    $('#downloadfile').remove()
                }, 10000);
            }).fail(function (err) {
                console.log(err)
            });
        }
    };

}).call(this);