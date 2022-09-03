/**
 * Source:
 * Created by daewon.park on 2017-05-24.
 */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');

    const PANEL_TYPE_IN = 'in';
    const PANEL_TYPE_OUT = 'out';
    const CHART_TYPE_LIST = ['scatter', 'line', 'pie', 'column', 'column-stacked', 'column-stacked-100', 'bar', 'bar-stacked', 'bar-stacked-100', 'boxplot', 'area', 'area-stacked', 'area-stacked-100', 'histogram', 'roccurve', 'bubble', 'card', 'heatmap', 'heatmap-matrix', 'treemap', 'donut'];

    function BigDataWorksheet(parentId, options, dataInfo) {
        Brightics.VA.Core.Editors.Sheet.Controls.DataWorksheet.call(this, parentId, options, dataInfo);
    }

    BigDataWorksheet.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Controls.DataWorksheet.prototype);
    BigDataWorksheet.prototype.constructor = BigDataWorksheet;

    BigDataWorksheet.prototype._init = function () {
        var wsOption = this.getDataWorksheetOption('full');
        this.chartOptions = {};
        var hideToolbarOpt = {type: 'custom', show: 'false'};

        if (wsOption.panel.length === 0) {
            wsOption.panel.push({
                id: 'default-chart' + Date.now(),
                chartOption: {
                    chart: {
                        type: 'scatter'
                    },
                    toolbar: hideToolbarOpt
                },
                chartTypeList: CHART_TYPE_LIST
            });
            wsOption.panel.push({
                id: 'default-table' + Date.now(),
                chartOption: {
                    chart: {
                        type: 'table'
                    }
                },
                chartTypeSelectable: false
            });

            for (var i in wsOption.panel) {
                var panel = wsOption.panel[i];
                panel.chartOption = $.extend(true, {}, Brightics.Chart.Registry[panel.chartOption.chart.type || 'table'].DefaultOptions, panel.chartOption);
            }
            wsOption.layout = {
                type: 'splitter',
                direction: 'horizontal',
                ratio: '60%',
                items: [{
                    'id': wsOption.panel[0].id,
                    'type': 'panel'
                }, {
                    'id': wsOption.panel[1].id,
                    'type': 'panel'
                }]
            }
        } else {
            for (var i = 0; i < wsOption.panel.length; i++) {
                if (wsOption.panel[i].chartTypeList) {
                    wsOption.panel[i].chartTypeList = CHART_TYPE_LIST;
                }
                if (wsOption.panel[i].chartOption) {
                    wsOption.panel[i].chartOption.toolbar = $.extend(true, {}, wsOption.panel[i].chartOption.toolbar, hideToolbarOpt);
                }
            }
        }

        this.options.style = {
            width: '100%',
            height: '100%'
        };
        this.options.worksheet = {
            panel: wsOption.panel,
            layout: wsOption.layout
        };
    };


    BigDataWorksheet.prototype.createControls = function () {
        var _this = this;
        this.$parent.empty();

        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-dataworksheet brtc-va-editors-sheet-controls-big-dataworksheet"></div>');
        this.$mainControl.css({
            width: '100%',
            height: '100%'
        });
        this.$parent.append(this.$mainControl);

        // this.options.worksheet.$panelSelectionGroup = _this.$mainControl.closest('.brtc-va-editors-sheet-fnunitviewer');
        this.options.worksheet.onChangeLayout = this.onChangeLayout.bind(this);
        this.options.worksheet.onChangeChart = this.onChangeChart.bind(this);
        this.options.worksheet.onSelectChart = this.onSelectChart.bind(this);
        this.options.columnConf = {
            scatter: {
                xAxis: {
                    aggregationEnabled: false,
                    axisTypeList: []
                },
                yAxis: {
                    aggregationEnabled: true
                },
                colorBy: {
                    aggregationEnabled: false,
                    multiple: true
                }
            },
            line: {
                xAxis: {
                    aggregationEnabled: false,
                    axisTypeList: []
                },
                yAxis: {
                    aggregationEnabled: true
                },
                colorBy: {
                    aggregationEnabled: false,
                    multiple: true
                }
            },
            boxplot: {
                xAxis: {
                    axisTypeList: []
                }
            }
        };

        for (var i in this.options.worksheet.panel) {
            this.options.worksheet.panel[i].chartOption.source = this._getPanelSource(this.options.worksheet.panel[i]);
            this.options.worksheet.panel[i].chartOption.guide = this._getGuideOption();
            this.options.worksheet.panel[i].dataSource = this._setPanelDataSource(i);
        }

        this.options.component = {
            right: {
                chartOption: true
            }
        };

        this.options.worksheet.toolbar = {
            menu: {
                multichart: {
                    title: 'MultiChart',
                    click: function () {
                        var panel = this;
                        _this._handleOpenMultiChart(panel);
                    }
                },
                report: {
                    title: 'Add to Report',
                    click: function () {
                        var panel = this;
                        _this._handleAddToReport(panel);
                    }
                },
                setting: {
                    click: function () {
                        var panel = this;
                        _this._handleChartSettings(panel);
                    }
                }
            }
        };

        this.$mainControl.bchartsAdonis(this.options);

        this.$mainControl.find('.bcharts-ws-panel-chart-selector[chart="table"]').css({
            "background-image": "none",
            "pointer-events": "none"
        });

        this.bindEventHandlers();

        this._initDataWorkSheet();

        
        // this.removeAddReport();
    };


    BigDataWorksheet.prototype._getLazyData = function (tableIndex) {
        var _this = this;
        var fnUnit = this.options.fnUnit;
        var model = fnUnit.parent();
        var panelType = this.dataInfo.panelType;
        var tableList = FnUnitUtils.getTable(fnUnit, panelType);
        var tableId = tableList[tableIndex];
        var preFnUnit = model.getFnUnitByOutTable(tableId);

        if (tableId) {
            return {
                id: {
                    value: tableId,
                    label: preFnUnit.display.label
                },
                columns: function () {
                    return _this._tableMap[tableId].columns
                },
                data: function (prepare) {
                    if (prepare.options.chart.type === 'table') {
                        setTimeout(function () {
                            try {
                                prepare.done({
                                    dataType: 'rawdata',
                                    columns: _this._tableMap[tableId].columns,
                                    data: _this._tableMap[tableId].data,
                                    count: _this._tableMap[tableId].count,
                                    offset: _this._tableMap[tableId].offset,
                                });
                            } catch (e) {
                                Logger.error(e.stack, {category: 'Chart'});
                            }
                        }, 100);
                    } else {
                        _this._executeBigDataRendering(prepare, tableId);
                    }

                }
            }
        } else {
            return {
                id: {
                    value: ''
                },
                columns: function () {
                    return [];
                },
                data: function (prepare) {
                    setTimeout(function () {
                        prepare.done({
                            dataType: 'rawdata',
                            columns: [],
                            data: [],
                            count: 0,
                            offset: _this._tableMap[tableId].offset,
                        });

                    }, 100);
                }
            }
        }
    };

    BigDataWorksheet.prototype._executeBigDataRendering = function (prepare, tableId) {
        var _this = this;

        var options = prepare.options;
        var outTable = Brightics.VA.Core.Utils.IDGenerator.table.id();
        var fnUnit = Brightics.VA.Core.Utils.FullRenderingUtils.getFnUnit(options);
        fnUnit[IN_DATA].push(tableId);
        fnUnit[OUT_DATA].push(outTable);
        fnUnit.persist = false;

        var model = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl).getModel();
        Brightics.VA.Core.Utils.ModelUtils.extendParent(model, fnUnit);

        var launchOptions = {hideDialog: true};

        prepare.aborted = function () {
            if (this.jid) {
                Studio.getJobExecutor().terminate(this.jid);
            }
        };

        /** getRenderedData(function, launcher, launchoptions, successCallback, failCallback, jobIdCallback) **/
        Brightics.VA.Core.Utils.FullRenderingUtils.getRenderedData(fnUnit, Studio.getJobExecutor(), launchOptions,
            function (data, tableId) {
                prepare.done(data);
            }, function (data, tableId, err) {
                if (err && err.message) {
                    prepare.fail(err.message);
                } else if (err && err.errorInfo.length > 0) {
                    var messages = err.errorInfo.map(function (item) {
                        return item.message;
                    });
                    prepare.fail(messages);
                } else {
                    prepare.fail('Failed to get data.');
                }
            }, function (jid) {
                prepare.jid = jid;
            }
        );
    };

    BigDataWorksheet.prototype.bindEventHandlers = function () {
        var _this = this;
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        if (modelEditor) {
            this.commandListener = function (command) {
                if (command.event.source.dataInfo
                    && command.event.source.dataInfo.fid === _this.dataInfo.fid
                    && command.event.source.dataInfo.table === _this.dataInfo.table
                    && command.event.source instanceof Brightics.VA.Core.Editors.Sheet.Controls.BigDataWorksheet) {
                    if (command.event.type == 'REDO') _this.redo(command);
                    else if (command.event.type == 'UNDO') _this.undo(command);
                }
            };
            modelEditor.addCommandListener(this.commandListener);
        }
    };

    BigDataWorksheet.prototype.onAddChart = function (panelOption, layout) {
    };

    BigDataWorksheet.prototype.onRemoveChart = function (panelOption, layout) {
    };

    BigDataWorksheet.prototype.setDataSet = function (tableId, data) {
        for (var i in this.options.worksheet.panel) {
            if (this.options.worksheet.panel[i].chartOption.chart.type === 'table') {
                this._tableMap[tableId].columns = data.columns;
                this._tableMap[tableId].data = data.data;
                this.$mainControl.bchartsAdonis('refreshChartPanel', this.options.worksheet.panel[i].id);
            }
        }
    };

    BigDataWorksheet.prototype.onSelectChart = function (panelOptions) {
        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');
        if ($dialog.is(':visible')) {
            this.$chartOptionPanel = this.$mainControl.find('.bcharts-option-panel');
            if (this.$chartOptionPanel.length > 0) {
                this._detachChartOptionPanel();
                this._attachChartOptionPanelToDialog(this.$chartOptionPanel);
            }
        }

        var tableIndex = 0;
        this._selectedPanelOptions = panelOptions;
        if (panelOptions && panelOptions.tableIndexes && panelOptions.tableIndexes[0]) tableIndex = panelOptions.tableIndexes[0];

        var showPageSelector = true;
        if (panelOptions && panelOptions.chartOption && panelOptions.chartOption.chart.type !== 'table') showPageSelector = false;

        var pageInfo = this.getPaginationInfoByTableIndex(tableIndex);
        pageInfo.showPageSelector = showPageSelector;
        this.options.callback.setPaginationInfo(pageInfo);
    };


    BigDataWorksheet.prototype._setPanelDataSource = function (panelIndex) {
        var _this = this;
        var dataSource = {
            selectable: true,
            getDataSourceList: function () {
                return _this._getDataSourceList();
            },
            getDataSourceColumnList: function (id) {
                return _this._tableMap[id].columns
            },
            onDataSourceChangedCallBack: function (panelId, idList) {
                idList.forEach(function (id) {
                    _this._tableMap[id] = _this._tableMap[id] || {};
                });
                _this._queryTables(function () {
                    var compoundCommand = new Brightics.VA.Core.CompoundCommand(_this, {label: 'Change DataSource In Big Data WorkSheet'});
                    for (var i in _this.options.worksheet.panel) {
                        let panel = _this.options.worksheet.panel[i];
                        var command = new Brightics.VA.Core.Editors.Diagram.Commands.ChangeDataSourceCommand(_this, {
                            panel: panel,
                            ref: {
                                panel: {
                                    tableIndexes: _this._getTableIndexes(idList)
                                }
                            }
                        });

                        compoundCommand.add(command);
                    }
                    _this.executeCommand(compoundCommand);
                    for (var i in _this.options.worksheet.panel) {
                        let panel = _this.options.worksheet.panel[i];
                        _this.$mainControl.bchartsAdonis('setDataSource', panel.id, _this._getPanelSource(panel));
                    }

                    var panelOptions = _this.options.worksheet.panel[1];
                    var tableIndex = 0;
                    if (panelOptions && panelOptions.tableIndexes && panelOptions.tableIndexes[0]) tableIndex = panelOptions.tableIndexes[0];
                    var pageInfo = _this.getPaginationInfoByTableIndex(tableIndex);
                    if (_this.options.callback && typeof _this.options.callback.setPaginationInfo === 'function') {
                        _this.options.callback.setPaginationInfo(pageInfo);
                    }
                });

            }
        };
        return dataSource
    };

    BigDataWorksheet.prototype._initDataWorkSheet = function () {
        if (this.options.worksheet.panel.length > 0) {
            this.$mainControl.bchartsAdonis('selectChartPanel', this.options.worksheet.panel[1].id)
        }
    };


    BigDataWorksheet.prototype._onChangeDataSourceCommand = function (command) {
        this.$mainControl.bchartsAdonis('setDataSource', command.options.panel.id, this._getSourceByTableIndexes(command.options.panel.tableIndexes));
    };

    BigDataWorksheet.prototype.removeAddReport = function () {
        var panelType = this.dataInfo.panelType;
        if (panelType === PANEL_TYPE_IN) {
            var inTableList = FnUnitUtils.getInTable(this.options.fnUnit);
            for (var i in inTableList) {
                var preFnUnit = this.options.fnUnit.parent().getPreFnUnitByCondition(this.options.fnUnit.fid, function (fnUnit) {
                    return $.inArray(inTableList[i], FnUnitUtils.getOutTable(fnUnit)) > -1;
                });
                if (preFnUnit.func === 'load') {
                    this.$mainControl.find('.bcharts-ws-panel-toolbar .bcharts-ws-panel-toolitem[action="report"]').css({display: 'none'})
                }
            }
        } else if (panelType === PANEL_TYPE_OUT && this.options.fnUnit.func === 'load') {
            this.$mainControl.find('.bcharts-ws-panel-toolbar .bcharts-ws-panel-toolitem[action="report"]').css({display: 'none'})
        }
    };

    Brightics.VA.Core.Editors.Sheet.Controls.BigDataWorksheet = BigDataWorksheet;

}).call(this);    