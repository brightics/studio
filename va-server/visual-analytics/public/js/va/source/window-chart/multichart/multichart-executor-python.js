/**
 * Created by sds on 2017-08-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var WindowCommonUtils = Brightics.VA.Window.Utils.CommonUtils;
    var IDGenerator = Brightics.VA.Core.Utils.IDGenerator;

    function MultiChartExecutor() {
    }

    MultiChartExecutor.prototype.setTarget = function ($resultTarget) {
        this.$resultTarget = $resultTarget;
    };

    MultiChartExecutor.prototype.execute = function (options, doneCallBack) {
        this.options = options;
        var _this = this;

        //preprocessing
        if (!this.$resultTarget) {
            return;
        }
        WindowCommonUtils.hideMessage();
        this.$resultTarget.bchartsTethys('destroy');
        this.$resultTarget.empty();

        //execute main process
        this._executeGroupBy(options).then(function (result) {
            WindowCommonUtils.hideMessage();

            var keyColumns = result.columns;

            var multichartOption = {
                autoScroll: false,
                style: {
                    width: '100%',
                    height: '100%'
                },
                cache: {
                    maxLimit: 8,
                    evictionCount: 4
                },
                layout: {
                    type: 'flex',
                    flexData: {
                        width: options.width,
                        height: options.height
                    }
                },
                keys: function () {
                    return result.data;
                },
                chart: function (key) {
                    var chartOptions = $.extend(true, {}, options.chartOption, {
                        title: {},
                        toolbar: {
                            show: false,
                            type: 'custom'
                        },
                        source: {
                            lazyData: [{
                                data: function (prepare) {
                                    var source = this;
                                    _this._fetchSmallData(prepare, key, keyColumns, source);
                                }
                            }]
                        }
                    });
                    var keyColumn = $.extend(true, [], key);
                    keyColumn.pop();

                    var titleKey = result.columns.map(function (column, index) {
                        if (options.title.indexOf(column['name']) === -1) return -1;
                        else return index;
                    }).filter(function (value) {
                        if (value === -1) return false;
                        return true;
                    }).map(function (index) {
                        return keyColumn[index];
                    });

                    chartOptions.title.text = titleKey.join(' ');
                    return chartOptions;
                }
            };
            _this._renderMultichart(multichartOption);
            doneCallBack();
        }, function (errorMsg) {
            WindowCommonUtils.hideProgress();
            if (typeof errorMsg === 'string') {
                WindowCommonUtils.showMessage(errorMsg);
            } else {
                WindowCommonUtils.showMessage('Cannot get data. Table not found.\nRun current Function and Try again.');
            }
            doneCallBack();

            console.error(errorMsg);
        });
    };

    MultiChartExecutor.prototype._fetchSmallData = function (prepare, key, keyColumns, source) {
        var _this = this;
        var options = this.options;
        var sql = _this._createSelectSqlForFetchData(keyColumns, key);
        var jid = 'va_' + options.fid + '_' + moment().format('YYYYMMDDHHmmss');
        var fid = options.fid + '_' + moment().format('YYYYMMDDHHmmss');
        var tid = IDGenerator.table.id();

        _this._executeSqlJob(jid, fid, sql, tid).then(function (executeResponse) {
            var jobId = JSON.parse(executeResponse).result;

            var checkTimer = function () {
                _this._check(jobId).done(function (res) {
                    if (res.status === 'FAIL') {
                        WindowCommonUtils.showProgress(res.responseText);
                    } else if (res.status === 'SUCCESS') {
                        var url = 'api/va/v2/data/staging/query?user=' + options.user + '&mid=' + options.mid + '&tab=' + tid + '&offset=' + 0 + '&limit=' + 1000000;

                        $.get(url).done(
                            function (result) {
                                source.columns = result.columns;
                                prepare.done(result);
                            }
                        ).fail(
                            function () {
                                prepare.fail('Failed to get data.\nSorry! An unexpected error occurred. Please contact administrator.');
                            }
                        );
                    } else {
                        setTimeout(checkTimer, 500);
                    }
                }).fail(function (err) {
                    WindowCommonUtils.showProgress(err.responseText);
                });
            };
            setTimeout(checkTimer, 1000);
        }).catch(function (error) {
            WindowCommonUtils.showProgress(err.responseText);
        });
    };

    MultiChartExecutor.prototype._createSelectSqlForFetchData = function (keyColumns, dataList, table) {
        var columns = this._getUsedColumnNames();
        var conditions = [];

        for (var i = 0; i < keyColumns.length - 1; i++) {
            if (keyColumns[i]['type'] === 'number') {
                conditions.push(keyColumns[i]['name'] + ' = ' + dataList[i]);
            } else {
                conditions.push(keyColumns[i]['name'] + ' = "' + dataList[i] + '"');
            }
        }

        var sql = 'SELECT ';
        sql += columns.join(', ');
        sql += ' FROM ' + 'data';
        sql += ' WHERE ' + conditions.join(' AND ');

        return sql;
    };

    MultiChartExecutor.prototype._getUsedColumnNames = function () {
        var options = this.options;
        var columns = options.datasource.columns;

        var usedColumnNames = [];

        if (options.layoutColumn && Object.keys(options.layoutColumn).length > 0) {
            for (var key in options.layoutColumn) {
                //필요한 Column Group by
                for (var j in options.layoutColumn[key].selected) {
                    if (options.layoutColumn[key].selected[j]) {
                        var columnName = options.layoutColumn[key].selected[j].name;
                        if (!usedColumnNames.includes(columnName)) usedColumnNames.push(columnName);
                    }
                }
            }
        } else {
            //Table All Column group by
            for (const column of columns) {
                let columnName = column.name;
                if (!usedColumnNames.includes(columnName)) usedColumnNames.push(columnName);
            }
        }

        return usedColumnNames;
    };

    MultiChartExecutor.prototype._filterNullColumn = function (columnList) {
        if (!columnList || !$.isArray(columnList)) {
            return [];
        } else {
            return columnList.filter(function (column) {
                return column != null;
            });
        }
    };

    MultiChartExecutor.prototype._executeGroupBy = function (options) {
        var _this = this;
        WindowCommonUtils.showProgress();
        return new Promise(function (resolve, reject) {
            var groupByColumns = _this._filterNullColumn(options.groupBy);
            if ($.isEmptyObject(groupByColumns)) {
                reject('Select group by Columns');
                return;
            }
            if (options.error && options.error.length > 0) {
                reject(options.error.join(', '));
                return;
            }

            var orderByColumns = options.orderBy;

            var sql = 'SELECT ' + orderByColumns.columns.join(', ');
            sql += ', count(1) as CountByGroup';
            // sql += ' FROM ' + options.tid;

            sql += ' FROM ' + 'data';
            sql += ' GROUP BY ' + groupByColumns.map(function (value) {
                return value.name;
            }).join(', ');
            sql += ' ORDER BY ' + orderByColumns.columns.map(function (value) {
                return value + ' ' + orderByColumns.sortMode[value];
            }).join(', ');

            var jid = 'va_' + options.fid + '_' + moment().format('YYYYMMDDHHmmss');
            var fid = options.fid;
            var tid = IDGenerator.table.id();

            _this._executeSqlJob(jid, fid, sql, tid)
                .done(function (executeResponse) {
                    var jobId = JSON.parse(executeResponse).result;

                    var checkTimer = function () {
                        _this._check(jobId).done(function (res) {
                            if (res.status === 'FAIL') {
                                WindowCommonUtils.showProgress(res.responseText);
                            } else if (res.status === 'SUCCESS') {
                                var url = 'api/va/v2/data/staging/query?user=' + options.user + '&mid=' + options.mid + '&tab=' + tid + '&offset=' + 0 + '&limit=' + 1000000;
                                $.get(url).done(
                                    function (res) {
                                        WindowCommonUtils.hideProgress();
                                        resolve(res);
                                    }
                                ).fail(function (err) {
                                    WindowCommonUtils.showProgress(err.responseText);
                                    reject(err);
                                });
                            } else {
                                setTimeout(checkTimer, 500);
                            }
                        }).fail(function (err) {
                            WindowCommonUtils.showProgress(err.responseText);
                        });

                    };
                    setTimeout(checkTimer, 1000);
                })
                .fail(function (err) {
                    WindowCommonUtils.showProgress(err.responseText);
                    reject(err);
                });
        });
    };

    MultiChartExecutor.prototype._executeSqlJob = function (jid, fid, sql, outTid) {
        var options = this.options;
        var runnable = {
            jid: jid,
            user: options.user,
            main: options.mid,
            models: {},
            version: Brightics.VA.Env.CoreVersion
        };

        runnable.models[options.mid] = {
            "entries": [
                fid
            ],
            functions: [{
                "'context": "python",
                "fid": fid,
                "func": "multichart",
                "inputs":{inputs:[options.tid], models:[], images:[]},
                "label": "Multi Chart",
                "meta":{
                    images: {type: "image", range: {min: 1, max: 10}},
                    inputs: {type: "table", range: {min: 1, max: 10}},
                    models: {type: "model", range: {min: 1, max: 10}},
                    result: {type: "table"}
                    },
                "name": "PythonScript",
                "outputs": {result: outTid},
                "param": {
                    "script": "from pandasql import sqldf\n" +
                        "pysqldf = lambda q: sqldf(q, globals())\n" +
                        "data = inputs[0]\n" +
                        "result = pysqldf('" +
                        sql + "')"
                },
                "persist": true,
                "persist-mode": "auto",
                "skip": false,
                "version": "3.6"

            }],
            "inData": [],
            "innerModels": {},
            "links": [],
            "mid": options.mid,
            "optModels": {},
            "outData": [],
            "param": {},
            "persist-mode": "auto",
            "title": "Multi Chart",
            "type": "data",
            "variableRef": [],
            "variables": {}
        };

        var requestOptions = {
            url: 'api/va/v2/analytics/jobs/execute',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(runnable),
            blocking: true
        };
        return $.ajax(requestOptions);
    };

    MultiChartExecutor.prototype._check = function (jobId) {
        var option = {
            url: 'api/va/v2/analytics/jobs/' + jobId,
            type: 'GET',
            blocking: false
        };
        return $.ajax(option);
    };

    MultiChartExecutor.prototype._renderMultichart = function (chartOption) {
        this.$resultTarget.bchartsTethys('destroy');
        this.$resultTarget.empty();
        this.$resultTarget.bchartsTethys(chartOption);
    };

    root.Brightics.VA.Window.MultiChartExecutor = MultiChartExecutor;

}).call(this);
