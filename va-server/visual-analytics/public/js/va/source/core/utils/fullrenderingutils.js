/**
 * Created by ji_sung.park on 2017-05-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const BIG_DATA_LIMIT = 30000;
    function getBigDataTargetTid(contentUnit, dataSource) {
        if (typeof dataSource === 'string') {
            return contentUnit.id + dataSource;
        }
        return contentUnit.id + dataSource[OUT_DATA][0];
    }

    function isBigData(_opt) {
        var opt = _opt;
        var modelId = opt.modelId;
        var tableId = opt.tableId;
        var user = opt.user;
        var isPublish = opt.isPublish;

        var __assert = function (name, x) {
            if (typeof x === 'undefined') throw new Error(name + ' is required');
        };

        __assert('modelId', modelId);
        __assert('tableId', tableId);
        __assert('user', user);
        __assert('isPublish', isPublish);

        return new Promise(function (resolve, reject) {
            Brightics.VA.Core.DataQueryTemplate.queryTable(
                modelId,
                tableId,
                function (data, table) {
                    return resolve(data.count >= BIG_DATA_LIMIT);
                },
                function (data, table, err) {
                    return reject(err);
                },
                true,
                {
                    offset: 0,
                    limit: BIG_DATA_LIMIT,
                    user: user,
                    publish: isPublish
                }
            );
        });
    }

    Brightics.VA.Core.Utils.FullRenderingUtils = {
        getFnUnit: function (chartOptions) {
            var chartType = chartOptions.chart.type;
            var options = {
                chartOptions: chartOptions
            };

            var generator = Brightics.VA.Core.Utils.FnUnitGenerator[chartType] ?
                new Brightics.VA.Core.Utils.FnUnitGenerator[chartType](options) :
                new Brightics.VA.Core.Utils.FnUnitGenerator(options);
            return generator.generate();
        },
        convertToChartSource: function (renderingType, result) {
            var source = result;
            if (renderingType === 'bigDataBoxPlot' || renderingType === 'boxplot') {
                /**
                 *  xAxis ^ yAxis
                 *  setosa  ^ {box: "2.9, 3.2, 3.4, 3.6, 4.2", outliers; "2.3, 4.4"}
                 */
                for (var i in source.data) {
                    source.data[i][1].box = source.data[i][1].box.split(",").map(function (item) {
                        return parseFloat(item)
                    });
                }
            }
            source.dataType = 'chartdata';
            return source;
        },
        getRenderedData: function (
                fnUnit,
                modelLauncher,
                launchOptions,
                _successCallback,
                _failCallback,
                _jobIdCallback) {
            var _this = this;

            var EMPTY_DATA = {
                dataType: 'rawdata',
                columns: [],
                data: []
            };

            var toFunc = function (fn) {
                return fn && typeof fn === 'function' ? fn : function () { };
            };

            var successCallback = toFunc(_successCallback);
            var failCallback = toFunc(_failCallback);
            var jobIdCallback = toFunc(_jobIdCallback);

            var getQueryOption = function (limit) {
                return {
                    offset: 0,
                    limit: limit,
                    user: launchOptions.user,
                    publish: launchOptions.publish
                };
            };

            var modelId = launchOptions.mid || fnUnit.parent().mid;

            var queryOriginalTable = function (modelId, tableId) {
                Brightics.VA.Core.DataQueryTemplate.queryTable(
                    modelId,
                    tableId,
                    function (data, tableId) {
                        data.dataType = 'rawdata';
                        successCallback(data, tableId);
                    },
                    function (data, tableId, err) {
                        failCallback(data, tableId, err);
                    },
                    true,
                    getQueryOption(10000)
                );
            };

            var tableId = fnUnit[IN_DATA];
            if (fnUnit.func === 'dummy') {
                queryOriginalTable(modelId, tableId);
            } else {
                Brightics.VA.Core.DataQueryTemplate.queryTable(
                    modelId,
                    tableId,
                    function (data, tableId) {
                        if (data.count >= 0 && data.count < BIG_DATA_LIMIT) {
                            data.dataType = 'rawdata';
                            successCallback(data, tableId);
                        } else {
                            // BIG
                            var getCachedData = new Promise(function (resolve, reject) {
                                try {
                                    if (launchOptions.publish) {
                                        Brightics.VA.Core.DataQueryTemplate.queryTable(
                                            modelId,
                                            getBigDataTargetTid(launchOptions.contentUnit.content, fnUnit[IN_DATA][0]),
                                            function (data, table) {
                                                return resolve([
                                                    data,
                                                    table
                                                ]);
                                            },
                                            function (data, table, err) {
                                                return reject(err);
                                            },
                                            true,
                                            getQueryOption(100000)
                                        );
                                    } else {
                                        return reject();
                                    }
                                } catch (e) {
                                    return reject(e);
                                }
                            });

                            getCachedData
                                .then(function (tmp) {
                                    var data = tmp[0];
                                    var table = tmp[1];
                                    var source = _this.convertToChartSource(fnUnit.func, data);
                                    successCallback(source, table);
                                })
                                .catch(function () {
                                    var listeners = {
                                        'success': function (res) {
                                            var outTable = fnUnit[OUT_DATA];
                                            Brightics.VA.Core.DataQueryTemplate.queryTable(
                                                modelId,
                                                outTable,
                                                function (data, tableId) {
                                                    var source = _this.convertToChartSource(fnUnit.func, data);
                                                    successCallback(source, tableId);
                                                },
                                                function (data, tableId, err) {
                                                    failCallback(data, tableId, err);
                                                },
                                                true,
                                                getQueryOption(100000)
                                            );

                                            jobIdCallback(res.result);
                                        },
                                        'fail': function (err) {
                                            failCallback(EMPTY_DATA, tableId, err);
                                        },
                                        'catch': function (err) {
                                            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                                            failCallback(EMPTY_DATA, tableId, err);
                                        }
                                    };
                                    modelLauncher.launchUnit(Object.assign({}, fnUnit, {
                                        persist: true,
                                    }), {}, launchOptions, listeners);
                                });
                        }
                    }, function (data, tableId, err) {
                        failCallback(data, tableId, err);
                    },
                    true,
                    getQueryOption(BIG_DATA_LIMIT)
                );
            }
        },
        getBigDataTargetTid: getBigDataTargetTid,
        isBigData: isBigData
    };

}).call(this);