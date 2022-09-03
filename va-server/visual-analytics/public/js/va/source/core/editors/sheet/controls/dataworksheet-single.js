/**
 * Created by ng1123.kim on 2016-02-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options: {
     *      panel: [],
     *      layout: {},
     *      data: {},
     * }
     *
     * dataInfo: {
     *      mid: {String},
     *      fid: {String},
     *      fnUnitLabel: {String}
     * }
     * @param parentId
     * @param options
     * @param {object} dataInfo - for Report
     * @constructor
     */
    function SingleDataWorksheet(parentId, options, dataInfo) {
        this.parentId = parentId;
        this.options = options;
        this.dataInfo = dataInfo;
        this.controls = {};

        this.retrieveParent();
        this.createControls();
        this.bindEventHandlers();
    }

    SingleDataWorksheet.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SingleDataWorksheet.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-dataworksheet"></div>');
        this.$mainControl.css({
            width: '100%',
            height: '100%'
        });
        this.$parent.append(this.$mainControl);


        this.chartOptions = {};

        this.options.worksheet.$panelSelectionGroup = _this.$mainControl.closest('.brtc-va-editors-sheet-fnunitviewer');
        this.options.worksheet.onAddChart = this.onAddChart.bind(this);
        this.options.worksheet.onRemoveChart = this.onRemoveChart.bind(this);
        this.options.worksheet.onChangeLayout = this.onChangeLayout.bind(this);
        this.options.worksheet.onChangeChart = this.onChangeChart.bind(this);
        this.options.worksheet.onSelectChart = this.onSelectChart.bind(this);

        if (this.options.worksheet.panel.length === 0) {
            this.options.worksheet.panel.push({
                id: 'default-' + Date.now(),
                chartOption: {
                    chart: {
                        type: 'table'
                    },
                    plotOptions: {
                        table: {
                            formatter: []
                        }
                    }
                }
            });
        }

        var source = {
            dataType: 'lazy',
            lazyData: [{
                columns: function () {
                    return _this.options.dataSet.columns;
                },
                data: function (prepare) {
                    setTimeout(function () {
                        prepare.done({
                            dataType: 'rawdata',
                            columns: _this.options.dataSet.columns,
                            data: _this.options.dataSet.data,
                            count: _this.options.dataSet.count,
                            offset: _this.options.dataSet.offset
                        });
                    }, 100);
                }
            }]
        };
        for (var i in this.options.worksheet.panel) {
            this.options.worksheet.panel[i].chartOption.source = source;
        }

        this.options.worksheet.toolbar = {
            menu: {
                //multichart: {
                //    title: 'MultiChart',
                //    click: function () {
                //        var panel = this;
                //        _this._handleOpenMultiChart(panel);
                //    }
                //},
                report: {
                    title: Brightics.locale.common.addToReport,
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
                },
                duplicate: {},
                close: {}
            }
        };

        this.$mainControl.bchartsAdonis(this.options);
    };

    SingleDataWorksheet.prototype._handleChartSettings = function (panel) {
        this._openChartSettingsDialog();
        this.onSelectChart();
    };

    SingleDataWorksheet.prototype._attachChartOptionPanelToDialog = function ($chartOptionPanel) {
        $chartOptionPanel.data('original-parent', $chartOptionPanel.parent());
        $chartOptionPanel.detach();

        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');
        $dialog.find('.brtc-va-dialog-contents').append($chartOptionPanel);
    };

    SingleDataWorksheet.prototype._detachChartOptionPanel = function () {
        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');
        $dialog.find('.bcharts-option-panel').each(function (index, element) {
            var $chartOptionPanel = $(element);
            var $parent = $chartOptionPanel.data('original-parent');
            $chartOptionPanel.detach().appendTo($parent);
        });
    };

    SingleDataWorksheet.prototype._openChartSettingsDialog = function () {
        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');

        var visible = $dialog.is(':visible');
        if (visible) {
            let clientWidth = $dialog.parent().width();
            let clientHeight = $dialog.parent().height();
            let offset = $dialog.offset();
            let width = $dialog.outerWidth();
            let height = $dialog.outerHeight();
            if (offset.left + width > clientWidth) {
                visible = false;
            }
            if (offset.top + height > clientHeight) {
                visible = false;
            }
        }
        if (visible == false) {
            let offset = this.$mainControl.offset();
            offset.right = offset.left + this.$mainControl.outerWidth();
            offset.bottom = offset.top + this.$mainControl.outerHeight();
            let width = $dialog.outerWidth();
            let height = $dialog.outerHeight();
            offset.top -= 50;
            if (offset.top + height > offset.bottom) {
                offset.top = offset.bottom - height - 20;
            }
            offset.left = offset.right - width;
            $dialog.css({
                left: offset.left,
                top: offset.top
            });

            $dialog.show();
        }
    };

    SingleDataWorksheet.prototype.arrange = function (direction) {
        this.$mainControl.bchartsAdonis('layout', direction);
    };

    SingleDataWorksheet.prototype.onAddChart = function (panelOption, layout) {
        var existPanels = $.grep(this.options.worksheet.panel, function (element, index) {
            return element.id == panelOption.id;
        });
        if (existPanels.length === 0) {
            var compoundCommand = new Brightics.VA.Core.CompoundCommand(this, {
                id: 'brightics.va.editors.diagram.commands.addchartcommand'
            });
            compoundCommand.add(this.createNewChartCommand(panelOption));
            compoundCommand.add(this.createSetDataWorksheetLayoutCommand(layout));

            this.executeCommand(compoundCommand);
        }
    };

    SingleDataWorksheet.prototype.onRemoveChart = function (panelOption, layout) {
        var existPanels = $.grep(this.options.worksheet.panel, function (element, index) {
            return element.id == panelOption.id;
        });
        if (existPanels.length > 0) {
            var compoundCommand = new Brightics.VA.Core.CompoundCommand(this, {
                id: 'brightics.va.editors.diagram.commands.removechartcommand'
            });
            compoundCommand.add(this.createRemoveChartCommand(panelOption));
            compoundCommand.add(this.createSetDataWorksheetLayoutCommand(layout));

            this.executeCommand(compoundCommand);
        }
        ;
    };

    SingleDataWorksheet.prototype.onChangeLayout = function (layout) {
        if (JSON.stringify(this.options.worksheet.layout) !== JSON.stringify(layout)) {
            this.executeCommand(this.createSetDataWorksheetLayoutCommand(layout));
        }
    };

    SingleDataWorksheet.prototype._assignArray = function (targetObject, sourceObject) {
        for (var key in sourceObject) {
            if ($.isPlainObject(sourceObject[key])) {
                this._assignArray(targetObject[key], sourceObject[key]);
            } else if ($.isArray(sourceObject[key])) {
                targetObject[key] = $.extend(true, [], sourceObject[key]);
            }
        }
    };

    SingleDataWorksheet.prototype._mergeArraySafely = function (targetObject, sourceObject) {
        var merged = $.extend(true, {}, targetObject, sourceObject);
        this._assignArray(merged, sourceObject);
        return merged;
    };

    SingleDataWorksheet.prototype.onChangeChart = function (panelOption, changedOption) {
        var original = this.chartOptions[panelOption.id];
        var changed = this._mergeArraySafely(this.chartOptions[panelOption.id], changedOption);
        if (JSON.stringify(original) !== JSON.stringify(changed)) {
            // TODO Chart Option Panel ?�서 clone ?��? ?�고 event �?발생?�키�??�문??Command ?�우기전??clone ?�줘???�다.
            var changing = $.extend(true, {}, changedOption);
            delete changing.source;
            var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetContentsPanelCommand(this, {
                panelOption: panelOption,
                ref: {
                    chartOption: changing
                }
            });
            this.executeCommand(command);
        }
    };

    SingleDataWorksheet.prototype.onSelectChart = function () {
        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');
        if ($dialog.is(':visible')) {
            this.$chartOptionPanel = this.$mainControl.find('.bcharts-option-panel');
            if (this.$chartOptionPanel.length > 0) {
                this._detachChartOptionPanel();
                this._attachChartOptionPanelToDialog(this.$chartOptionPanel);
            }
        }
    };

    SingleDataWorksheet.prototype.bindEventHandlers = function () {
        var _this = this;
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        if (modelEditor) {
            this.commandListener = function (command) {
                if (command.event.source.dataInfo
                    && command.event.source.dataInfo.fid === _this.dataInfo.fid
                    && command.event.source.dataInfo.table === _this.dataInfo.table
                    && !(command.event.source instanceof Brightics.VA.Core.Editors.Sheet.Controls.BigDataWorksheet)) {
                    if (command.event.type == 'REDO') _this.redo(command);
                    else if (command.event.type == 'UNDO') _this.undo(command);
                }
            };
            modelEditor.addCommandListener(this.commandListener);
        }
    };

    SingleDataWorksheet.prototype.unbindEventHandlers = function () {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        if (modelEditor && this.commandListener) {
            modelEditor.removeCommandListener(this.commandListener);
            this.commandListener = null;
        }
    };

    SingleDataWorksheet.prototype.redo = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) {
            if (command.getId() === 'brightics.va.editors.diagram.commands.addchartcommand') this.onNewChartCommand(command);
            else if (command.getId() === 'brightics.va.editors.diagram.commands.removechartcommand') this.onRemoveChartCommand(command);
            else for (var i in command.commandList) this.redo(command.commandList[i]);
        }
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewChartCommand) this.onNewChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveChartCommand) this.onRemoveChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand) this.onSetDataWorksheetLayoutCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetContentsPanelCommand) this.onSetContentsPanelCommand(command);
    };

    SingleDataWorksheet.prototype.undo = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) {
            if (command.getId() === 'brightics.va.editors.diagram.commands.addchartcommand') this.onNewChartCommand(command);
            else if (command.getId() === 'brightics.va.editors.diagram.commands.removechartcommand') this.onRemoveChartCommand(command);
            else for (var i = command.commandList.length - 1; i >= 0; i--) this.undo(command.commandList[i]);
        }
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewChartCommand) this.onNewChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveChartCommand) this.onRemoveChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand) this.onSetDataWorksheetLayoutCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetContentsPanelCommand) this.onSetContentsPanelCommand(command);
    };

    SingleDataWorksheet.prototype.onNewChartCommand = function (command) {
        if (command.event.type == 'REDO') {
            this.$mainControl.bchartsAdonis('addChartPanel', command.options.panelOption);
        } else {
            this.$mainControl.bchartsAdonis('removeChartPanel', command.options.panelOption.id);
        }
    };

    SingleDataWorksheet.prototype.onRemoveChartCommand = function (command) {
        if (command.event.type == 'REDO') {
            this.$mainControl.bchartsAdonis('removeChartPanel', command.options.panelOption.id);
        } else {
            this.$mainControl.bchartsAdonis('addChartPanel', command.options.panelOption);
        }
    };

    SingleDataWorksheet.prototype.onSetDataWorksheetLayoutCommand = function (command) {
        this.$mainControl.bchartsAdonis('layout', command.options.layout);
    };

    SingleDataWorksheet.prototype.onSetContentsPanelCommand = function (command) {
        this.chartOptions[command.options.panelOption.id] = command.options.panelOption.chartOption;
        this.$mainControl.bchartsAdonis('setChartOptions', command.options.panelOption.id, command.options.panelOption.chartOption);
    };

    SingleDataWorksheet.prototype.createNewChartCommand = function (panelOption) {
        var newChartCommand = new Brightics.VA.Core.Editors.Diagram.Commands.NewChartCommand(this, {
            panel: this.options.worksheet.panel,
            panelOption: panelOption
        });

        return newChartCommand;
    };

    SingleDataWorksheet.prototype.createRemoveChartCommand = function (panelOption) {
        var removeChartCommand = new Brightics.VA.Core.Editors.Diagram.Commands.RemoveChartCommand(this, {
            panel: this.options.worksheet.panel,
            panelOption: panelOption
        });

        return removeChartCommand;
    };

    SingleDataWorksheet.prototype.createSetDataWorksheetLayoutCommand = function (newLayout) {
        var setDataWorksheetLayoutCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand(this, {
            layout: this.options.worksheet.layout,
            newLayout: newLayout
        });

        return setDataWorksheetLayoutCommand;
    };

    SingleDataWorksheet.prototype.executeCommand = function (command) {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        modelEditor.getCommandManager().execute(command);
    };

    SingleDataWorksheet.prototype._handleOpenMultiChart = function (panel) {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        var param = {
            user: Brightics.VA.Env.Session.userId,
            pid: modelEditor.options.editorInput.getProjectId(),
            mid: this.dataInfo.mid,
            fid: this.dataInfo.fid,
            tid: this.dataInfo.table,
            cid: panel.getOptions().id
        };
        var params = $.map(param, function (value, key) {
            return key + '=' + value;
        }).join('&');
        window.open('multichart?' + params, 'multiChart');
    };

    SingleDataWorksheet.prototype._handleAddToReport = function (panel) {
        var _this = this;

        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
        var panelTitle = this.$mainControl.closest('.brtc-va-editors-sheet-panels-basepanel').find('.brtc-va-editors-sheet-panels-basepanel-header-title').text();

        if (Brightics.VA.Implementation.Visual) {
            var resourceManager = Studio.getResourceManager();
            var projectId = modelEditor.options.editorInput.getProjectId();
            var projectLabel = resourceManager.getProject(projectId).getLabel();
            var visualModels = resourceManager.getFilesByModelType(projectId, Brightics.VA.Implementation.Visual.Clazz);

            var modelLabel = modelEditor.options.editorInput.getLabel();
            var functionLabel = _this.dataInfo.fnUnitLabel;
            if (visualModels.length) {
                new Brightics.VA.Implementation.Visual.Dialogs.SelectVisualModelDialog(_this.$mainControl, {
                    projectId: projectId,
                    projectLabel: projectLabel,
                    visualModels: visualModels,
                    modelId: _this.dataInfo.mid,
                    tableId: _this.dataInfo.table,
                    defaultDataSourceLabel: modelLabel + '-' + functionLabel + '-' + panelTitle,
                    close: function (dialogResult) {
                        if (dialogResult.OK) {
                            Brightics.VA.Implementation.Visual.Utils.ModelUtils.addChartContentToSelectedVisualModel({
                                resourceManager: resourceManager,
                                dataSourceLabel: (dialogResult.dataSourceLabel) ?
                                    (dialogResult.dataSourceLabel) :
                                    (modelLabel + '-' + functionLabel + '-' + panelTitle),
                                selectedModels: dialogResult.selectedModels,
                                projectId: projectId,
                                modelId: _this.dataInfo.mid,
                                tableId: _this.dataInfo.table,
                                chartOptions: $.extend(true, {}, panel.getOptions().chartOption),
                                columns: $.extend(true, [], Brightics.VA.Core.DataQueryTemplate.getSchema(_this.dataInfo.mid, _this.dataInfo.table)),
                                changeLabel: dialogResult.changeLabel
                            });
                            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Successfully Added To The Report.');
                        }
                    },
                    resizable: true,
                    title: 'Select Reports to Add'
                });
            }
            else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('No report in this project. Create a report in this project.');
            }
        }
    };

    SingleDataWorksheet.prototype.destroy = function () {
        this.unbindEventHandlers();
        this.$mainControl.bchartsAdonis('destroy');
    };

    SingleDataWorksheet.prototype.setDataSet = function (dataSet) {
        this.options.dataSet = dataSet;
        this.$mainControl.bchartsAdonis('refreshChartPanel');
    };

    Brightics.VA.Core.Editors.Sheet.Controls.SingleDataWorksheet = SingleDataWorksheet;

}).call(this);
