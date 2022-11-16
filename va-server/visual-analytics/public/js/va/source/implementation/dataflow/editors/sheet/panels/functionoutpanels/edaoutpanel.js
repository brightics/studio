/**
 * Created by SDS on 2017-10-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EDAOutPanel(parentId, options) {
        this.colorSet = [
            '#FD026C', '#4682B8', '#A5D22D', '#F5CC0A', '#FE8C01', '#6B9494', '#B97C46',
            '#84ACD0', '#C2E173', '#F9DD5B', '#FE569D', '#FEB356', '#9CB8B8', '#D0A884',
            '#2E6072', '#6D8C1E', '#A48806', '#A90148', '#A95E01', '#476363', '#7B532F'
        ];

        Brightics.VA.Core.Editors.Sheet.Panels.DataPanel.call(this, parentId, options);
        this._queryTable();
    }

    EDAOutPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.DataPanel.prototype);
    EDAOutPanel.prototype.constructor = EDAOutPanel;

    EDAOutPanel.prototype.destroy = function () {
        if (this.pagination) {
            this.pagination.destroy();
        }
        if (this.dataWorksheet) {
            this.dataWorksheet.destroy();
        }
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.destroy.call(this);
        this.options.modelEditor.removeCommandListener(this.commandListener);
    };

    // EDAOutPanel.prototype.createTopAreaHeaderTitle = function ($parent) {
    //     this.$header = $('' +
    //         '<div class="brtc-va-editors-sheet-panels-basepanel-header brtc-va-editors-sheet-panels-datapanel-header">' +
    //         '   <div class="brtc-va-editors-sheet-panels-basepanel-header-container brtc-interactive-prediction-out-panel">' +
    //         '       <div class="brtc-va-editors-sheet-panels-basepanel-header-title" />' +
    //         '   </div>' +
    //         '</div>');
    //     $parent.append(this.$header);
    // };

    // EDAOutPanel.prototype.refreshHeaderTitle = function () {
    //     var $title = this.$mainControl.find('.brtc-va-editors-sheet-panels-basepanel-header-title');
    //     if (this.display.panelType === 'out') {
    //         $title.text(this.options.title);
    //         $title.attr('title', this.options.title);
    //     }
    // };

    // EDAOutPanel.prototype.createTopAreaHeaderToolbar = function () {
    //     this.$toolbar = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolbar"/>');
    //     this.$header.append(this.$toolbar);
    //     this.createMinMaxToolItem(this.$toolbar);
    // };

    // EDAOutPanel.prototype.createBottomArea = function () {
    //     this.$bottomArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-bottom-area"></div>');
    //     this.$mainControl.append(this.$bottomArea);
    // };

    // EDAOutPanel.prototype.createBottomAreaControls = function ($parent) {
    // };

    EDAOutPanel.prototype._queryTable = function () {
        var _this = this, tableList = this.display.tableList;
        var errorCallback = function (err) {
            if (dataArray.length === 0) {
                _this.$contentsArea.empty();
                var $dataworkSheetArea = $('<div class="brtc-va-editors-sheet-controls-dataworksheet brtc-style-interactive-prediction-out-panel"></div>');
                _this.$contentsArea.append($dataworkSheetArea);
                $dataworkSheetArea.empty();
                var $messageArea = $('' +
                    '<div class="brtc-va-interactive-prediction-message-wrapper brtc-style-interactive-prediction-message-wrapper">' +
                    '   <div class="brtc-va-interactive-prediction-message brtc-style-interactive-prediction-message">Please run the function for results.</div>' +
                    '</div>');
                $dataworkSheetArea.append($messageArea);
            } else {
                if (_this._isDisposed() === false) {
                    _this.createDataWorksheet(dataArray);
                    _this.$topArea.attr('has-data', 'true');
                }
            }
        };

        var dataArray = [];
        if (tableList.length === 9) {
            _this.options.dataProxy.requestDataForEDA(tableList[0], function (data) {
                dataArray.push(data);
                _this.options.dataProxy.requestDataForEDA(tableList[1], function (data) {
                    dataArray.push(data);
                    _this.options.dataProxy.requestDataForEDA(tableList[2], function (data) {
                        dataArray.push(data);
                        _this.options.dataProxy.requestDataForEDA(tableList[3], function (data) {
                            dataArray.push(data);
                            _this.options.dataProxy.requestDataForEDA(tableList[4], function (data) {
                                dataArray.push(data);
                                _this.options.dataProxy.requestDataForEDA(tableList[5], function (data) {
                                    dataArray.push(data);
                                    _this.options.dataProxy.requestDataForEDA(tableList[6], function (data) {
                                        dataArray.push(data);
                                        _this.options.dataProxy.requestDataForEDA(tableList[7], function (data) {
                                            dataArray.push(data);
                                            _this.options.dataProxy.requestDataForEDA(tableList[8], function (data) {
                                                dataArray.push(data);
                                                if (_this._isDisposed() === false) {
                                                    _this.createDataWorksheet(dataArray);
                                                    _this.$topArea.attr('has-data', 'true');
                                                }
                                            }, errorCallback);
                                        }, errorCallback);
                                    }, errorCallback);
                                }, errorCallback);
                            }, errorCallback);
                        }, errorCallback);
                    }, errorCallback);
                }, errorCallback);
            }, errorCallback);
        }
    };

    EDAOutPanel.prototype.createDataWorksheet = function (dataArray) {
        var _this = this;
        _this.$contentsArea.empty();

        var dataFlag = (dataArray !== undefined);

        var $dataworkSheetArea = $('' +
            '<div class="brtc-va-editors-sheet-controls-dataworksheet brtc-style-interactive-prediction-out-panel" style="overflow-y: auto">' +
            '   <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-area brtc-style-editors-sheet-controls-dataworksheet-chart-area">' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-scatter brtc-style-editors-sheet-controls-dataworksheet-chart-title">Scatter Matrix</div>' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-scatter brtc-style-editors-sheet-controls-dataworksheet-chart" style="height: 500px"/>' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-pie brtc-style-editors-sheet-controls-dataworksheet-chart-title">Summary of Label</div>' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-pie brtc-style-editors-sheet-controls-dataworksheet-chart" style="height: 400px"/>' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-pietable brtc-style-editors-sheet-controls-dataworksheet-chart" style="height: 100px"/>' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-histogram-title brtc-style-editors-sheet-controls-dataworksheet-chart-title">Summary of Continuous Features</div>' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-histogram brtc-style-editors-sheet-controls-dataworksheet-chart"/>' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-histogramtable brtc-style-editors-sheet-controls-dataworksheet-chart" style="height: 150px"/>' +
            '   </div>' +
            '</div>');
        _this.$contentsArea.append($dataworkSheetArea);
        if (dataFlag) {
            $dataworkSheetArea.find('.brtc-va-interactive-prediction-message-wrapper').remove();

            this._createScatterChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-scatter'), dataArray);
            this._createPieChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-pie'), dataArray[3]);
            this._createTableChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-pietable'), dataArray[4]);
            this._createHistogramChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-histogram'), dataArray[5]);
            this._createTableChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-histogram'), dataArray[6]);

            if (dataArray[7] !== undefined && dataArray[8] !== undefined) {
                if (dataArray[7].count !== 0 && dataArray[8].count !== 0) {
                    var $categoryFeaturesArea = $('' +
                        '<div class="brtc-va-editors-sheet-controls-dataworksheet-chart-pie2-title brtc-style-editors-sheet-controls-dataworksheet-chart-title">Summary of Category Features</div>' +
                        '<div class="brtc-va-editors-sheet-controls-dataworksheet-chart-pie2 brtc-style-editors-sheet-controls-dataworksheet-chart"/>' +
                        '<div class="brtc-va-editors-sheet-controls-dataworksheet-chart-pie2table brtc-style-editors-sheet-controls-dataworksheet-chart" style="height: 100px"/>');
                    $dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-histogram').append($categoryFeaturesArea);

                    this._createCategoryPieChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-pie2'), dataArray[7]);
                    this._createTableChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart-pie2'), dataArray[8]);
                }
            }
        } else {
            $dataworkSheetArea.empty();
            var $messageArea = $('' +
                '<div class="brtc-va-interactive-prediction-message-wrapper brtc-style-interactive-prediction-message-wrapper">' +
                '   <div class="brtc-va-interactive-prediction-message brtc-style-interactive-prediction-message">Please run the function for results.</div>' +
                '</div>');
            $dataworkSheetArea.append($messageArea);
        }
    };

    EDAOutPanel.prototype._createScatterChartControls = function ($parent, dataArray) {
        var myChart = echarts.init($parent[1]);

        this.resizeHandler = function () {
            myChart.resize();
        };
        $(window).resize(this.resizeHandler);

        var schartChartData = dataArray[0].data;
        var chartCategories = dataArray[1].data;
        var chartDatas = dataArray[2].data;

        if (_.isEmpty(schartChartData)|| 
            _.isEmpty(chartCategories)||
            _.isEmpty(chartDatas)) return;


        for (var i in chartCategories) {
            if (chartCategories[i][1] === 'category') {
                for (var j in chartCategories[i][2]) {
                    if (chartCategories[i][2][j] == null) {
                        chartCategories[i][2][j] = '(empty)';
                    }
                }
                if (chartCategories[i][schartChartData[0][4]] == null) {
                    chartDatas[i][schartChartData[0][4]] = '(empty)';
                }
            }
        }

        for (var i in chartDatas) {
            if (chartDatas[i][schartChartData[0][4]] == null) {
                chartDatas[i][schartChartData[0][4]] = '(empty)';
            }
        }

        var CATEGORY_DIM_COUNT = schartChartData[0][1];
        var GAP = 2;
        var BASE_LEFT = 5;
        var BASE_TOP = 10;
        // var GRID_WIDTH = 220;
        // var GRID_HEIGHT = 220;
        var GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
        var GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
        var CATEGORY_DIM = schartChartData[0][4];
        var SYMBOL_SIZE = 3;

        function retrieveScatterData(data, dimX, dimY) {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var item = [data[i][dimX], data[i][dimY]];
                item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
                result.push(item);
            }
            return result;
        }

        function generateGrids(option) {
            var index = 0;

            for (var i = 0; i < CATEGORY_DIM_COUNT; i++) {
                for (var j = 0; j < CATEGORY_DIM_COUNT; j++) {
                    if (CATEGORY_DIM_COUNT - i + j >= CATEGORY_DIM_COUNT) {
                        continue;
                    }

                    option.grid.push({
                        left: BASE_LEFT + i * (GRID_WIDTH + GAP) + '%',
                        top: BASE_TOP + j * (GRID_HEIGHT + GAP) + '%',
                        width: GRID_WIDTH + '%',
                        height: GRID_HEIGHT + '%'
                    });

                    option.xAxis.push({
                        splitNumber: 3,
                        position: 'top',
                        axisLine: {
                            show: j === 0,
                            onZero: false
                        },
                        axisTick: {
                            show: j === 0,
                            inside: true
                        },
                        axisLabel: {
                            show: j === 0
                        },
                        type: 'value',
                        gridIndex: index,
                        scale: true
                    });

                    option.yAxis.push({
                        splitNumber: 3,
                        position: 'right',
                        axisLine: {
                            show: i === CATEGORY_DIM_COUNT - 1,
                            onZero: false
                        },
                        axisTick: {
                            show: i === CATEGORY_DIM_COUNT - 1,
                            inside: true
                        },
                        axisLabel: {
                            show: i === CATEGORY_DIM_COUNT - 1
                        },
                        type: 'value',
                        gridIndex: index,
                        scale: true
                    });

                    option.series.push({
                        type: 'scatter',
                        symbolSize: SYMBOL_SIZE,
                        xAxisIndex: index,
                        yAxisIndex: index,
                        data: retrieveScatterData(chartDatas, i, j)
                    });

                    option.visualMap.seriesIndex.push(option.series.length - 1);

                    index++;
                }
            }
        }

        var color = [];

        for (var i = 0; i < chartCategories[schartChartData[0][4]][2].length; i++) {
            color.push(this.colorSet[i % this.colorSet.length]);
        }

        var option = {
            animation: false,
            visualMap: {
                type: 'piecewise',
                categories: chartCategories[schartChartData[0][4]][2],
                dimension: CATEGORY_DIM,
                orient: 'horizontal',
                top: 0,
                left: 'center',
                inRange: {
                    color: color
                },
                outOfRange: {
                    color: '#ddd'
                },
                seriesIndex: [0]
            },
            tooltip: {
                trigger: 'item'
            },
            grid: [],
            xAxis: [],
            yAxis: [],
            series: [
                {
                    name: 'parallel',
                    type: 'parallel',
                    data: chartDatas
                }
            ]
        };

        generateGrids(option);

        myChart.setOption(option);
    };

    EDAOutPanel.prototype._createPieChartControls = function ($parent, dataArray) {
        var myChart = echarts.init($parent[1]);

        this.resizeHandler = function () {
            myChart.resize();
        };
        $(window).resize(this.resizeHandler);

        var chartDatas = dataArray.data;
        var chartColumns = dataArray.columns;

        var legendData = [];
        var seriesDatas = [];

        for (var i in chartDatas) {
            if (chartDatas[i][0] == null) {
                chartDatas[i][0] = '(empty)';
            }

            legendData.push(chartDatas[i][0]);

            var seriesData = {
                name: chartDatas[i][0],
                value: chartDatas[i][1]
            }
            seriesDatas.push(seriesData);
        }

        var seriesName = chartColumns[0].name;

        var color = [];

        for (var i = 0; i < seriesDatas.length; i++) {
            color.push(this.colorSet[i % this.colorSet.length]);
        }

        var option = {
            color: color,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: 'center',
                data: legendData
            },
            series: [
                {
                    name: seriesName,
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '45%'],
                    data: seriesDatas,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);

    };

    EDAOutPanel.prototype._createCategoryPieChartControls = function ($parent, dataArray) {
        var chartDatas = dataArray.data;

        this.PieChartData = [];
        this.colArray = [];

        for (var i = 1; i < chartDatas.length; i++) {
            if ($.inArray(chartDatas[i][0], this.colArray) != -1) {
                continue;
            } else {
                this.colArray.push(chartDatas[i][0]);
            }
        }

        for (var i = 0; i < this.colArray.length; i++) {
            this.PieChartData[this.colArray[i]] = [];
            for (var j = 0; j < chartDatas.length; j++) {
                if (chartDatas[j][0] === this.colArray[i]) {
                    var data = [];
                    data.push(chartDatas[j][1]);
                    data.push(chartDatas[j][2]);

                    this.PieChartData[this.colArray[i]].push(data);
                }
            }
        }

        for (var i in this.PieChartData) {
            var $pie = $('' +
                '<div class="brtc-va-editors-sheet-controls-dataworksheet-chart-pie-sub brtc-style-editors-sheet-controls-dataworksheet-chart" style="height: 400px;"/>');
            $parent.append($pie);

            var myChart = echarts.init($pie[0]);

            this.resizeHandler = function () {
                myChart.resize();
            };
            $(window).resize(this.resizeHandler);

            var legendData = [];
            var seriesDatas = [];

            for (var j in this.PieChartData[i]) {
                if (this.PieChartData[i][j][0] == null) {
                    this.PieChartData[i][j][0] = '(empty)';
                }
                legendData.push(this.PieChartData[i][j][0]);

                var seriesData = {
                    name: this.PieChartData[i][j][0],
                    value: this.PieChartData[i][j][1]
                }
                seriesDatas.push(seriesData);
            }

            var seriesName = i; //chartColumns[0].name;

            var color = [];

            for (var i = 0; i < seriesDatas.length; i++) {
                color.push(this.colorSet[i % this.colorSet.length]);
            }

            var option = {
                color: color,
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    left: 'center',
                    data: legendData
                },
                series: [
                    {
                        name: seriesName,
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '45%'],
                        data: seriesDatas,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            myChart.setOption(option);
        }
    };

    EDAOutPanel.prototype._createTableChartControls = function ($parent, dataArray) {
        var chartDatas = dataArray.data;
        var chartColumns = dataArray.columns;

        var columnsDatas = [];

        for (var i in chartColumns) {
            var columnData = {
                name: chartColumns[i].name,
                type: chartColumns[i].type
            }
            columnsDatas.push(columnData);
        }

        var options = {
            chart: {
                type: 'table',
                // border: 'solid 1px #d3d3d3',
                padding: '0',
                // background: '#efefef',
                height: '100%'
            },
            source: {
                dataType: 'local',
                localData: [{
                    dataType: 'rawdata',
                    columns: columnsDatas,
                    data: chartDatas,
                    chartColumns:[]
                }]
            }
        };

        $parent.bcharts(options);
        this.chart = $parent.bcharts();
    };

    EDAOutPanel.prototype._createHistogramChartControls = function ($parent, dataArray) {
        var chartDatas = dataArray.data;

        this.HistogramChartData = [];
        this.colArray = [];

        for (var i = 0; i < chartDatas.length; i++) {
            if ($.inArray(chartDatas[i][0], this.colArray) != -1) {
                continue;
            } else {
                this.colArray.push(chartDatas[i][0]);
            }
        }

        for (var i = 0; i < this.colArray.length; i++) {
            this.HistogramChartData[this.colArray[i]] = [];
            for (var j = 0; j < chartDatas.length; j++) {
                if (chartDatas[j][0] === this.colArray[i]) {
                    var data = [];
                    data.push((chartDatas[j][1] + chartDatas[j][2]) / 2);
                    data.push(chartDatas[j][3]);

                    this.HistogramChartData[this.colArray[i]].push(data);
                }
            }
        }

        for (var i in this.HistogramChartData) {
            var $histogram = $('' +
                '<div class="brtc-va-editors-sheet-controls-dataworksheet-chart-histogram-sub brtc-style-editors-sheet-controls-dataworksheet-chart" style="height: 250px;"/>');
            $parent.append($histogram);

            var myChart = echarts.init($histogram[0]);

            this.resizeHandler = function () {
                myChart.resize();
            };
            $(window).resize(this.resizeHandler);

            var option = {
                title: {
                    text: i,
                    left: 'center',
                    top: 10
                },
                color: ['rgb(25, 183, 207)'],
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value',
                    scale: true,
                    // name: i,
                    nameLocation: 'center',
                }],
                yAxis: [{
                    type: 'value',
                    // name: 'Count(' + i + ')',
                }],
                series: [{
                    name: 'height',
                    type: 'bar',
                    barWidth: '99.3%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                return params.value[1];
                            }
                        }
                    },
                    data: this.HistogramChartData[i]
                }]
            };

            myChart.setOption(option);
        }
    };

    if (Brightics.VA.Implementation.DataFlow.Functions.eDA) {
        Brightics.VA.Implementation.DataFlow.Functions.eDA.DataPanel = EDAOutPanel;
    }

}).call(this);
