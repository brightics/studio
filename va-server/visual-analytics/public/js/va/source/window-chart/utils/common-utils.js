/**
 * Created by sds on 2017-07-26.
 */
(function () {
    'use strict';

    var root = this;

    root.Brightics.VA.Window.Utils.CommonUtils = {
        getParameterByName: function (name, url) {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        retrieveFile: function (params) {
            this.showProgress();
            var _this = this;
            var option = {
                url: 'api/va/v2/ws/projects/' + params.pid + '/files/' + params.mid,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                blocking: true
            };
            return $.ajax(option).done(function (data) {
                var migrator = new Brightics.VA.Core.Tools.ModelMigrator.Executor();
                _this.hideProgress();
                var file = data[0];
                if (!file) {
                    alert('Could not found model.');
                    return;
                }
                migrator.migrate(file.contents);
                _this.retrieveChartOptions(params, file.contents);
            }).fail(function (err) {
                _this.showMessage('Cannot get data. Table not found.');
            });
        },
        retrieveChartOptions: function (params, fileContents) {
            var funcList = fileContents.functions;
            if ($.isArray(funcList) && funcList.length > 0) {
                var foundFunc = funcList.find(function (funcElem) {
                    return funcElem.fid == params.fid
                });
                for (var inOutKey in foundFunc.display.sheet) {
                    var modeSheet = foundFunc.display.sheet[inOutKey];
                    for (var modeKey in modeSheet) {
                        var chartPanel = modeSheet[modeKey][0].panel.find(function (modePanel) {
                            return modePanel.id == params.cid;
                        });
                        if (typeof chartPanel != 'undefined') {
                            params.chartOption = chartPanel.chartOption;
                            _.assign(params, {
                                propOpt: chartPanel.multiChartOption
                            });
                            return;
                        } else {
                            continue;
                        }
                    }
                }
            }
        },
        retrieveDataSource: function (params) {
            this.showProgress();
            var arg = {
                user: params.user,
                mid: params.mid,
                tab: params.tid,
                offset: 0,
                limit: 1
            };
            var args = $.map(arg, function (value, key) {
                return key + '=' + value;
            }).join('&');

            var _this = this;
            var option = {
                url: 'api/va/v2/data/staging/query?' + args,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                blocking: true
            };
            return $.ajax(option).done(function (data) {
                _this.hideProgress();
                params.datasource = data;
            }).fail(function (err) {
                _this.showMessage('Cannot get data. Table not found.');
            });
        }
        , showProgress: function (message) {
            $('.brtc-mc-progress > span').text(message);
            $('.brtc-mc-progress').show();
        }
        , hideProgress: function () {
            $('.brtc-dim').hide();
            $('.brtc-mc-progress').hide();
        }
        , showMessage: function (message) {
            $('.brtc-mc-message > span').text(message);
            $('.brtc-mc-message').show();
        }
        , hideMessage: function (message) {
            $('.brtc-mc-message').hide();
        }
    };

}).call(this);