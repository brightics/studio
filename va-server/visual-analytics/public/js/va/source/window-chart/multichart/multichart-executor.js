/**
 * Created by sds on 2017-08-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var WindowCommonUtils = Brightics.VA.Window.Utils.CommonUtils;
    var TABLE_ALIAS = '#{DF_MULTI_CHART}';

    function MultiChartExecutor() {
    }

    MultiChartExecutor.prototype.setTarget = function ($resultTarget) {
        this.$resultTarget = $resultTarget;
    };

    MultiChartExecutor.prototype.execute = function (options, doneCallBack) {
        this.options = options;
        var _this = this;
        var bigDataChartTypeList = ['scatter', 'line', 'pie', 'column', 'column-stacked', 'column-stacked-100', 'bar', 'bar-stacked', 'bar-stacked-100', 'boxplot', 'area', 'area-stacked', 'area-stacked-100', 'histogram', 'roccurve', 'bubble', 'card', 'heatmap', 'heatmap-matrix', 'treemap', 'donut'];
        var currentChartType = options.chartOption.chart.type;

        var isBigChartType = bigDataChartTypeList.indexOf(currentChartType) < 0 ? false : true;

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

            var keyColumns = result.schema;

            var hasByColumnNames = _this._hasByColumnNames();

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

                                    var totalCount = key[key.length - 1];
                                    if (!isBigChartType || totalCount <= 50000) {
                                        _this._fetchSmallData(prepare, key, keyColumns, source);
                                    } else if (totalCount > 50000) {
                                        if (hasByColumnNames === true) {
                                            setTimeout(function () {
                                                prepare.fail('This Chart dose not support "Column Names"');
                                            }, 500);
                                        } else {
                                            _this._fetchBigData(prepare, key, keyColumns, totalCount, source);
                                        }

                                    }
                                }
                            }]
                        }
                    });
                    var keyColumn = $.extend(true, [], key);
                    keyColumn.pop();

                    var titleKey = result.schema.map(function (column, index){
                        if (options.title.indexOf(column['column-name']) === -1) return -1;
                        else return index;
                    }).filter(function (value){
                        if (value === -1) return false;
                        return true;
                    }).map(function (index){
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

        _this._executeSqlJob(jid, fid, sql).then(function (executeResponse) {
            var jobId = JSON.parse(executeResponse).result;

            var checkTimer = function () {
                _this._executeFetchSqlData(jobId, fid)
                .done(function (res) {
                    if (res.status === 'FAIL') {
                        WindowCommonUtils.showProgress(res.responseText);
                    } else if (res.status === 'SUCCESS') {
                        var messageData = _this.convertMessageData(res.message);
                        
                        source.columns = messageData.schema;
                        var chartData = {
                            columns: messageData.schema,
                            data: messageData.data
                        };

                        prepare.done(chartData);
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
    
    MultiChartExecutor.prototype.convertMessageData = function(data){        
        if(typeof data === "string"){
            var convertData = JSON.parse(data).data;
            for(var i in convertData.schema){
                convertData.schema[i]['name'] = convertData.schema[i]['column-name'];
                convertData.schema[i]['type'] = convertData.schema[i]['column-type']; 
            }
            return convertData;
        }else {
            return data;
        }
    }

    MultiChartExecutor.prototype._createFilterFnUnit = function (sql, fid, outTable) {
        return {
            "persist-mode": "false",
            "func": "queryExecutor",
            "name": "SQLExecutor",
            "label": 'SQL Query Executor',
            'inData': [this.options.tid],
            'outData': [outTable],
            "param": {
                "mode": "full",
                "full-query": sql,
                "alias-names": ["#{DF(0)}"]
            },
            "fid": fid,
            "persist": false
        }
    };

    MultiChartExecutor.prototype._createChartFnUnit = function (fid, inTable, outTable) {
        var chartFnUnit = Brightics.VA.Core.Utils.FullRenderingUtils.getFnUnit(this.options.chartOption);
        chartFnUnit.fid = fid;
        chartFnUnit.label = chartFnUnit.name;
        chartFnUnit[IN_DATA] = [inTable];
        chartFnUnit[OUT_DATA] = [outTable];

        if(chartFnUnit.param['color-by'] && chartFnUnit.param['color-by'].length === 0){
            delete chartFnUnit.param['color-by'];
        }
        
        delete chartFnUnit.display;
        delete chartFnUnit.param['x-max'];
        delete chartFnUnit.param['x-min'];
        delete chartFnUnit.param['y-max'];
        delete chartFnUnit.param['y-min'];

        return chartFnUnit;
    };


    MultiChartExecutor.prototype._fetchBigData = function (prepare, key, keyColumns, totalCount, source) {
        var _this = this;
        var options = this.options;

        var sql = _this._createSelectSqlForFetchData(keyColumns, key, '#{DF(0)}');
        var filterFid = options.fid + '_' + moment().format('YYYYMMDDHHmmss') + '_filter';
        var filterTable = options.fid + '_' + moment().format('YYYYMMDDHHmmss') + '_filter_table';

        var chartFid = options.fid + '_' + moment().format('YYYYMMDDHHmmss') + '_chart';
        var chartTable = options.fid + '_' + moment().format('YYYYMMDDHHmmss') + '_chart_table';

        var filterFnUnit = this._createFilterFnUnit(sql, filterFid, filterTable);
        var chartFnUnit = this._createChartFnUnit(chartFid, filterTable, chartTable);

        var jid = 'va_' + options.fid + '_' + moment().format('YYYYMMDDHHmmss');
        var mid = options.mid;

        var runnable = {
            jid: jid,
            user: options.user,
            main: mid,
            args: {},
            models: {},
            version: Brightics.VA.Env.CoreVersion
        };

        runnable.models[mid] = {
            mid: mid,
            type: 'data',
            gv: [],
            functions: [filterFnUnit, chartFnUnit],
            links: [{
                'sourceFid': filterFid,
                'targetFid': chartFid
            }],
            'entries': [filterFid]
        };

        var requestOptions = {
            url: 'api/va/v2/analytics/jobs/execute',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(runnable),
            blocking: true
        };


        $.ajax(requestOptions).done(function (executeResponse) {
            var jobId = JSON.parse(executeResponse).result;
            var checkTimer = function () {
                _this._checkBigDataJob(jobId).done(function (res) {
                    if (res.status === 'FAIL') {
                        prepare.fail('Failed to get data.\nSorry! An unexpected error occurred. Please contact administrator.');
                    }
                    else if (res.status === 'SUCCESS') {
                        var url = 'api/va/v2/data/staging/query?user=' + options.user + '&mid=' + mid + '&tab=' + chartTable + '&offset=' + 0 + '&limit=' + 1000000;
                        $.get(url).done(
                            function (result) {
                                var chartData = Brightics.VA.Core.Utils.FullRenderingUtils.convertToChartSource(options.chartOption.chart.type, result);
                                prepare.done(chartData);
                            }
                        ).fail(
                            function () {
                                prepare.fail('Failed to get data.\nSorry! An unexpected error occurred. Please contact administrator.');
                            }
                        );

                    }
                    else {
                        setTimeout(checkTimer, 500);
                    }
                }).fail(
                    function () {
                        prepare.fail('Failed to get data.\nSorry! An unexpected error occurred. Please contact administrator.');
                    }
                );
            };
            setTimeout(checkTimer, 500);
        });
    };

    MultiChartExecutor.prototype._checkBigDataJob = function (jobId) {
        var option = {
            url: 'api/va/v2/analytics/jobs/' + jobId,
            type: 'GET',
            blocking: false
        };
        return $.ajax(option);
    };


    MultiChartExecutor.prototype._createSelectSqlForFetchData = function (keyColumns, dataList, table) {
        var columns = this._getUsedColumnNames();
        var conditions = [];
        var fromTable = table || TABLE_ALIAS; //options.tid;

        for (var i = 0; i < keyColumns.length - 1; i++) {
            if (keyColumns[i]['column-type'] === 'number') {
                conditions.push(keyColumns[i]['column-name'] + ' = ' + dataList[i]);
            } else {
                conditions.push(keyColumns[i]['column-name'] + ' = "' + dataList[i] + '"');
            }
        }

        var sql = 'SELECT ';
        sql += columns.join(', ');
        sql += ' FROM ' + fromTable;
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
                    if (options.layoutColumn[key].selected[j])
                        usedColumnNames.push(options.layoutColumn[key].selected[j].name)
                }
            }
        } else {
            //Table All Column group by
            for (var i in  columns) {
                usedColumnNames.push(columns[i].name);
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

            sql += ' FROM ' + TABLE_ALIAS;
            sql += ' GROUP BY ' + groupByColumns.map(function (value) {
                    return value.name;
                }).join(', ');
            sql += ' ORDER BY ' + orderByColumns.columns.map(function (value) {
                    return value + ' ' + orderByColumns.sortMode[value];
                }).join(', ');

            var jid = 'va_' + options.fid + '_' + moment().format('YYYYMMDDHHmmss');
            var fid = options.fid;

            _this._executeSqlJob(jid, fid, sql)
            .done(function (executeResponse) {
                var jobId = JSON.parse(executeResponse).result;

                var checkTimer = function () {
                    _this._executeFetchSqlData(jobId, fid).done(function (res) {
                        if (res.status === 'FAIL') {
                            WindowCommonUtils.showProgress(res.responseText);
                            reject(res);
                        } else if (res.status === 'SUCCESS') {
                            WindowCommonUtils.hideProgress();
                            if(typeof res.message === "string"){
                                resolve(JSON.parse(res.message).data);
                            }else {
                                resolve(res.message);
                            }
                        } else {
                            setTimeout(checkTimer, 500);
                        }
                    }).fail(function (err) {
                        WindowCommonUtils.showProgress(err.responseText);
                        reject(err);
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

    MultiChartExecutor.prototype._executeSqlJob = function (jid, fid, sql) {
        var options = this.options;
        var runnable = {
            jid: jid,
            user: options.user,
            main: options.mid,
            models: {},
            version: Brightics.VA.Env.CoreVersion
        };

        runnable.models[options.mid] = {
            mid: options.mid,
            type: 'script',
            functions: [{
                'func': 'sql',
                'name': 'SQL',
                'label': 'SQL Query Executor', // label이 없으면 안 돌아간다.
                'param': {
                    'script': sql,
                    'limit': '50000',
                    'alias': {
                        '#{DF_MULTI_CHART}': '/' + options.user + '/' + options.mid + '/' + options.tid
                    }
                },
                'fid': fid
            }]
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

    MultiChartExecutor.prototype._executeFetchSqlData = function (jid, fid) {
        return $.ajax({
            url: 'api/va/v2/analytics/jobs/' + jid + '/tasks/' + fid,
            type: 'GET',
            blocking: true
        });
    };

    MultiChartExecutor.prototype._hasByColumnNames = function () {
        var options = this.options;

        if (options.layoutColumn && Object.keys(options.layoutColumn).length > 0) {
            for (var key in options.layoutColumn) {
                if (options.layoutColumn[key].axisType === 'byColumnNames') return true;
            }
        }
    };


    MultiChartExecutor.prototype._renderMultichart = function (chartOption) {
        this.$resultTarget.bchartsTethys('destroy');
        this.$resultTarget.empty();
        this.$resultTarget.bchartsTethys(chartOption);
    };

    root.Brightics.VA.Window.MultiChartExecutor = MultiChartExecutor;

}).call(this);