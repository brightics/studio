/**
 * Created by daewon77.park on 2016-02-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InteractivePredictionOutPanel(parentId, options) {
        this.relationFunctionTable = [];
        this.coefficientFunctionTable = [];
        this.summaryTable = [];
        this.summaryKey = {};
        this.values = {};
        this.ycolumnSummaryData = [];
        this.xcolumnsSummaryData = [];

        Brightics.VA.Core.Editors.Sheet.Panels.DataPanel.call(this, parentId, options);
        this._queryTable();
    }

    InteractivePredictionOutPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.DataPanel.prototype);
    InteractivePredictionOutPanel.prototype.constructor = InteractivePredictionOutPanel;

    InteractivePredictionOutPanel.prototype.registerCommandListener = function () {
        var _this = this;
        this.commandListener = function (command) {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetPanelCommand) {
                if (_this.options.fnUnit.fid === command.event.source.options.fnUnit.fid) {
                    _this.handleSetDataWorksheetPanelCommand(command);
                }
            }
        };
        this.options.modelEditor.addCommandListener(this.commandListener);
    };

    InteractivePredictionOutPanel.prototype.handleSetDataWorksheetPanelCommand = function (command) {
        this._initSlideBarData();
        this._setAllSliderControlsValue();
        if (command.event.type == 'UNDO') {
            this._updateChartControls(command.options.oldPanel[0].data[0].label, command.options.oldPanel[0].data[0].value);
        } else if (command.event.type == 'REDO') {
            this._updateChartControls(command.options.newPanel[0].data[0].label, command.options.newPanel[0].data[0].value);
        }
    };

    InteractivePredictionOutPanel.prototype.createSetDataWorksheetPanelCommand = function (newPanel) {
        var setDataWorksheetPanelCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetPanelCommand(this, {
            panel: this.options.fnUnit.display.sheet[this.display.panelType].partial[0].panel,
            newPanel: newPanel
        });

        return setDataWorksheetPanelCommand;
    };

    InteractivePredictionOutPanel.prototype.destroy = function () {
        if (this.pagination) {
            this.pagination.destroy();
        }
        if (this.dataWorksheet) {
            this.dataWorksheet.destroy();
        }
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.destroy.call(this);
        this.options.modelEditor.removeCommandListener(this.commandListener);
    };

    InteractivePredictionOutPanel.prototype.createTopAreaHeaderTitle = function ($parent) {
        this.$header = $('' +
            '<div class="brtc-va-editors-sheet-panels-basepanel-header brtc-va-editors-sheet-panels-datapanel-header">' +
            '   <div class="brtc-va-editors-sheet-panels-basepanel-header-container brtc-interactive-prediction-out-panel">' +
            '       <div class="brtc-va-editors-sheet-panels-basepanel-header-title" />' +
            '   </div>' +
            '</div>');
        $parent.append(this.$header);
    };

    InteractivePredictionOutPanel.prototype.refreshHeaderTitle = function () {
        var $title = this.$mainControl.find('.brtc-va-editors-sheet-panels-basepanel-header-title');
        if (this.display.panelType === 'out') {
            $title.text(this.options.title);
            $title.attr('title', this.options.title);
        }
    };

    InteractivePredictionOutPanel.prototype.createTopAreaHeaderToolbar = function () {
        var $toolbar = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolbar"/>');
        this.$header.append($toolbar);
        this.createMinMaxToolItem($toolbar);
    };

    InteractivePredictionOutPanel.prototype.createBottomArea = function () {
        this.$bottomArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-bottom-area"></div>');
        this.$mainControl.append(this.$bottomArea);
    };

    InteractivePredictionOutPanel.prototype.createBottomAreaControls = function ($parent) {
    };

    InteractivePredictionOutPanel.prototype._queryTable = function () {
        var _this = this, tableList = this.display.tableList;
        var errorCallback = function (err) {
            _this.$contentsArea.empty();
            var $dataworkSheetArea = $('<div class="brtc-va-editors-sheet-controls-dataworksheet brtc-style-interactive-prediction-out-panel"></div>');
            _this.$contentsArea.append($dataworkSheetArea);
            $dataworkSheetArea.empty();
            var $messageArea = $('' +
                '<div class="brtc-va-interactive-prediction-message-wrapper brtc-style-interactive-prediction-message-wrapper">' +
                '   <div class="brtc-va-interactive-prediction-message brtc-style-interactive-prediction-message">Please run the function for results.</div>' +
                '</div>');
            $dataworkSheetArea.append($messageArea);
        };

        var dataArray = [];
        if (tableList.length === 3) {
            _this.options.dataProxy.requestData(tableList[0], function (data) {
                dataArray.push(data);
                _this.options.dataProxy.requestData(tableList[1], function (data) {
                    dataArray.push(data);
                    _this.options.dataProxy.requestData(tableList[2], function (data) {
                        dataArray.push(data);
                        if (_this._isDisposed() === false) {
                            _this.createDataWorksheet(dataArray);
                            _this.$topArea.attr('has-data', 'true');
                        }
                    }, errorCallback);
                }, errorCallback);
            }, errorCallback);
        }
    };

    InteractivePredictionOutPanel.prototype.createDataWorksheet = function (dataArray) {
        var _this = this;
        _this.$contentsArea.empty();

        var dataFlag = (dataArray !== undefined);
        for (var i in dataArray) {
            if (dataArray[i].data.length === 0 && dataArray[i].columns.length === 0) {
                dataFlag = false;
                break;
            }
        }

        var $dataworkSheetArea = $('' +
            '<div class="brtc-va-editors-sheet-controls-dataworksheet brtc-style-interactive-prediction-out-panel">' +
            '   <div class="brtc-va-editors-sheet-controls-dataworksheet-slider-area brtc-style-editors-sheet-controls-dataworksheet-slider-area"></div>' +
            '   <div class="brtc-va-editors-sheet-controls-dataworksheet-chart-area brtc-style-editors-sheet-controls-dataworksheet-chart-area">' +
            '       <div class="brtc-va-editors-sheet-controls-dataworksheet-chart brtc-style-editors-sheet-controls-dataworksheet-chart">' +
            '   </div>' +
            '</div>');
        _this.$contentsArea.append($dataworkSheetArea);
        if (dataFlag) {
            $dataworkSheetArea.find('.brtc-va-interactive-prediction-message-wrapper').remove();
            this._initDataArray(dataArray);

            this._initChartData();
            this._initSlideBarData();

            this._createSliderControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-slider-area'));
            this._createChartControls($dataworkSheetArea.find('.brtc-va-editors-sheet-controls-dataworksheet-chart'));
        } else {
            $dataworkSheetArea.empty();
            var $messageArea = $('' +
                '<div class="brtc-va-interactive-prediction-message-wrapper brtc-style-interactive-prediction-message-wrapper">' +
                '   <div class="brtc-va-interactive-prediction-message brtc-style-interactive-prediction-message">Please run the function for results.</div>' +
                '</div>');
            $dataworkSheetArea.append($messageArea);
        }
    };

    InteractivePredictionOutPanel.prototype._initDataArray = function (dataArray) {
        if (dataArray && dataArray.length) {
            this.relationFunctionTable = dataArray[0];
            this.coefficientFunctionTable = dataArray[1];
            this.summaryTable = dataArray[2];
            this.summaryKey = {};

            for (var i in this.summaryTable.columns) {
                // count, mean, stddev, min, max로 들어오는데 순서를 저장해서 나중에 사용
                this.summaryKey[this.summaryTable.columns[i].name] = i;
            }

            this.values = {};
            this.ycolumnSummaryData = [];
            this.xcolumnsSummaryData = [];

            this._initValuesObject();
        }
    };

    InteractivePredictionOutPanel.prototype._initValuesObject = function () {
        var ycolumnLabel = this.summaryTable.data[0][0];
        for (var i in this.summaryTable.data) {
            var columnLabel = this.summaryTable.data[i][0];
            if (columnLabel == ycolumnLabel) {
                this.ycolumnSummaryData = this.summaryTable.data[i];
            } else {
                this.xcolumnsSummaryData.push(this.summaryTable.data[i]);
            }
            this.values[columnLabel] = null;
        }
    };

    InteractivePredictionOutPanel.prototype._initChartData = function () {
        this.chartData = {};

        for (let xcolumnsSummary of this.xcolumnsSummaryData) {
            var xcolumnLabel = xcolumnsSummary[0];
            var min = xcolumnsSummary[this.summaryKey['min']];
            var max = xcolumnsSummary[this.summaryKey['max']];

            this.chartData[xcolumnLabel] = [];
            for (var k = (min * 10000); k < (max * 10000); k += 100) {
                var x = k / 10000;
                this._changeXColumnValue(xcolumnLabel, x);
                this._calcYColumnValue();
                this.chartData[xcolumnLabel].push([x, this.values[this.summaryTable.data[0][0]]]);
            }
        }
    };

    InteractivePredictionOutPanel.prototype._getLastChangedXColumnLabel = function () {
        var lastChangedXColumnLabel;
        if (this.options.fnUnit.display.sheet.out.partial[0].panel.length && this.options.fnUnit.display.sheet.out.partial[0].panel[0]) {
            lastChangedXColumnLabel = this.options.fnUnit.display.sheet.out.partial[0].panel[0].data[0].label;
        }
        return (lastChangedXColumnLabel || this.xcolumnsSummaryData[0][0]);
    };

    InteractivePredictionOutPanel.prototype._getLastChangedXColumnValue = function () {
        var lastChangedXColumnValue;
        if (this.options.fnUnit.display.sheet.out.partial[0].panel.length && this.options.fnUnit.display.sheet.out.partial[0].panel[0]) {
            lastChangedXColumnValue = this.options.fnUnit.display.sheet.out.partial[0].panel[0].data[0].value;
        }
        return (lastChangedXColumnValue || this.xcolumnsSummaryData[0][this.summaryKey['mean']]);
    };

    InteractivePredictionOutPanel.prototype._initSlideBarData = function () {
        var changedXColumn = this._getLastChangedXColumnLabel();
        var changedValue = this._getLastChangedXColumnValue();
        this._changeXColumnValue(changedXColumn, changedValue); // 0번쨰 data로 모든 xcolumn 초기화가 필요함.   var mean = this.summaryTable.data[0][3];
        this._calcYColumnValue(); // 위에서 초기화한 데이터로 초기 ycolumn 값 계산
    };

    InteractivePredictionOutPanel.prototype._changeXColumnValue = function (changedXColumn, value) {
        if (value) {
            this.values[changedXColumn] = Number(value);
        }

        var x = this.values[changedXColumn];
        for (var i in this.relationFunctionTable.data) {
            var row = this.relationFunctionTable.data[i];
            var fxLabel = row[0], xLabel = row[1];
            if (fxLabel !== xLabel && xLabel === changedXColumn) {
                var a = Number(row[2]), b = Number(row[3]), c = Number(row[4]), d = Number(row[5]);
                this.values[fxLabel] = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
            }
        }
    };

    InteractivePredictionOutPanel.prototype._calcYColumnValue = function () {
        var ycolumn = this.summaryTable.data[0][0];
        var _intercept;
        for (var k in this.coefficientFunctionTable.data) {
            if (this.coefficientFunctionTable.data[k][0] == '_intercept' && this.coefficientFunctionTable.data[k][1] == '_') {
                _intercept = this.coefficientFunctionTable.data[k][2];
                break;
            }
        }

        this.values[ycolumn] = Number(_intercept);
        for (var i = 0; i < this.coefficientFunctionTable.data.length; i++) {
            var x1Label = this.coefficientFunctionTable.data[i][0], x2Label = this.coefficientFunctionTable.data[i][1];
            if (x1Label !== '_intercept' && x2Label !== '_') {
                var x1 = this.values[x1Label] || 1;
                var x2 = this.values[x2Label] || 1;
                var coefficient = Number(this.coefficientFunctionTable.data[i][2]);
                this.values[ycolumn] += coefficient * x1 * x2;
            }
        }
    };

    InteractivePredictionOutPanel.prototype._createSliderControls = function ($parent) {
        var ycolumnLabel = this.summaryTable.data[0][0];
        var ycolumnMin = this.ycolumnSummaryData[this.summaryKey['min']];
        var ycolumnMax = this.ycolumnSummaryData[this.summaryKey['max']];
        this._createSliderBar($parent, ycolumnLabel, ycolumnMin, ycolumnMax, this.values[ycolumnLabel], true);

        for (var i in this.xcolumnsSummaryData) {
            var xcolumnLabel = this.xcolumnsSummaryData[i][0];
            var min = this.xcolumnsSummaryData[i][this.summaryKey['min']];
            var max = this.xcolumnsSummaryData[i][this.summaryKey['max']];
            this._createSliderBar($parent, xcolumnLabel, min, max, this.values[xcolumnLabel]);
        }
    };

    InteractivePredictionOutPanel.prototype._createSliderBar = function ($parent, label, min, max, value, disabled) {
        var _this = this;
        var $sliderItem = $('' +
            '<div class="brtc-va-slider-item brtc-style-slider-item">' +
            '   <div class="brtc-va-slider-item-info-row brtc-style-slider-item-info-row">' +
            '       <div class="brtc-va-slider-label brtc-style-slider-label"></div>' +
            '       <div class="brtc-va-slider-value-wrapper brtc-style-slider-value-wrapper">' +
            '           <div class="brtc-va-slider-value-viewer brtc-style-slider-value-viewer"></div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="brtc-va-interactive-prediction-slider-element brtc-style-interactive-prediction-slider-element">' +
            '       <div class="brtc-va-slider-min brtc-style-slider-min"></div>' +
            '       <div class="brtc-va-interactive-prediction-slider-wrapper brtc-style-interactive-prediction-slider-wrapper">' +
            '           <div class="brtc-va-interactive-prediction-slider"></div>' +
            '       </div>' +
            '       <div class="brtc-va-slider-max brtc-style-slider-max"></div>' +
            '   </div>' +
            '</div>');
        $parent.append($sliderItem);

        $sliderItem.find('.brtc-va-slider-label').attr('title', label);
        $sliderItem.find('.brtc-va-slider-label').text(label);
        $sliderItem.find('.brtc-va-slider-min').text(min);
        $sliderItem.find('.brtc-va-slider-max').text(max);
        $sliderItem.find('.brtc-va-slider-value-viewer').text(Number(value).toFixed(4));

        var $slider = $sliderItem.find('.brtc-va-interactive-prediction-slider');
        $slider.jqxSlider({
            theme: Brightics.VA.Env.Theme,
            showTicks: false,
            showTickLabels: false,
            tooltip: false,
            showButtons: false,
            mode: 'default',
            height: 20,
            width: '100%',
            step: 0.05,
            min: Number(min),
            max: Number(max),
            value: Number(value),
            disabled: disabled
        });

        $slider.on('slideStart', function (event) {
            $slider.on('slide', function (event) {
                var label = $sliderItem.find('.brtc-va-slider-label').text();
                var value = event.args.value;
                _this._changeXColumnValue(label, value);
                _this._calcYColumnValue();
                _this._setSliderControlsValue($sliderItem);

                _this._updateChartControls(label, value);
            });
        });

        $slider.on('slideEnd', function (event) {
            var label = $sliderItem.find('.brtc-va-slider-label').text();
            var value = event.args.value;
            $slider.off('slide');

            var setDataWorksheetPanelCommand = _this.createSetDataWorksheetPanelCommand([{
                data: [{
                    label: label,
                    value: value
                }]
            }]);
            _this.executeCommand(setDataWorksheetPanelCommand);
        });
    };

    InteractivePredictionOutPanel.prototype._setSliderControlsValue = function ($currentHandler) {
        var _this = this;
        var $sliderItems = this.$contentsArea.find('.brtc-va-slider-item');
        $sliderItems.each(function (index, element) {
            var label = $(element).find('.brtc-va-slider-label').text();
            $(element).find('.brtc-va-slider-value-viewer').text(Number(_this.values[label]).toFixed(4));

            if ($currentHandler && !$currentHandler.is($(element))) {
                var $slider = $(element).find('.brtc-va-interactive-prediction-slider');
                $slider.jqxSlider('setValue', _this.values[label]);
            }
        });
    };

    InteractivePredictionOutPanel.prototype._setAllSliderControlsValue = function () {
        var _this = this;
        var $sliderItems = this.$contentsArea.find('.brtc-va-slider-item');
        $sliderItems.each(function (index, element) {
            var label = $(element).find('.brtc-va-slider-label').text();
            $(element).find('.brtc-va-slider-value-viewer').text(Number(_this.values[label]).toFixed(4));

            var $slider = $(element).find('.brtc-va-interactive-prediction-slider');
            $slider.jqxSlider('setValue', _this.values[label]);
        });
    };

    InteractivePredictionOutPanel.prototype._createChartControls = function ($parent) {
        var options = this._createChartOptions(this._getLastChangedXColumnLabel(), this._getLastChangedXColumnValue(), true);
        $parent.bcharts(options);
        this.chart = $parent.bcharts();
    };

    InteractivePredictionOutPanel.prototype._updateChartControls = function (selectedColumn, value) {
        var options = this._createChartOptions(selectedColumn, value, (this.chart.getOptions().xAxis[0].selected[0].name !== selectedColumn));
        this.chart.setOptions(options);
    };

    InteractivePredictionOutPanel.prototype._createChartOptions = function (selectedColumn, value, selectedChanged) {
        var xcolumnLabel = selectedColumn;
        var xcolumnValue = value;

        var ycolumnLabel = this.summaryTable.data[0][0];

        var options = {
            colorSet: [
                '#FD026C', '#4682B8', '#A5D22D', '#F5CC0A', '#FE8C01', '#6B9494', '#B97C46',
                '#84ACD0', '#C2E173', '#F9DD5B', '#FE569D', '#FEB356', '#9CB8B8', '#D0A884',
                '#2E6072', '#6D8C1E', '#A48806', '#A90148', '#A95E01', '#476363', '#7B532F'
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }
            },
            xAxis: [{
                selected: [{name: xcolumnLabel}],
                title: {
                    visible: true,
                    left: '50%',
                    bottom: '8px'
                },
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    formatter: function (val) {
                        return Number(val).toFixed(2);
                    }
                }
            }],
            yAxis: [{
                selected: [{name: ycolumnLabel}],
                title: {
                    left: '8px',
                    top: '50%',
                    rotate: -90
                },
                axisLabel: {
                    formatter: function (val) {
                        return Number(val).toFixed(2);
                    }
                }
            }],
            plotOptions: {
                line: {
                    smooth: true,
                    marker: {
                        symbol: 'none'
                    },
                    markLine: {
                        data: [
                            {
                                xAxis: xcolumnValue,
                                lineStyle: {
                                    normal: {
                                        color: "#000",
                                        type: "solid"
                                    }
                                }
                            },
                            {type: 'max', name: 'max'},
                            {type: 'average', name: 'average'},
                            {type: 'min', name: 'min'}
                        ]
                    }
                }
            }
        };

        if (selectedChanged) {
            options.chart = {
                type: 'line',
                border: 'solid 1px #d3d3d3',
                padding: '0',
                background: '#efefef',
                height: '100%'
            };

            options.source = {
                dataType: 'local',
                localData: [{
                    dataType: 'rawdata',
                    columns: [
                        {name: xcolumnLabel, 'type': 'number'},
                        {name: ycolumnLabel, 'type': 'number'}
                    ],
                    data: $.extend(true, [], this.chartData[xcolumnLabel])
                }]
            };
        }

        return options;
    };

    if (Brightics.VA.Implementation.DataFlow.Functions.interactivePrediction) {
        Brightics.VA.Implementation.DataFlow.Functions.interactivePrediction.DataPanel = InteractivePredictionOutPanel;
    }

}).call(this);
