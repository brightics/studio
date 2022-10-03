/**
 * Created by ng1123.kim on 2016-02-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var FnUnitUtils = brtc_require('FnUnitUtils');
    var Logger = new Brightics.VA.Log('DataWorksheet');

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
     * @constructor
     */
    function DataWorksheet(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.controls = {};

        this.retrieveParent();
        this._init();
        this._setDataInfo();
        this.renderDataWorksheet();
    }

    DataWorksheet.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataWorksheet.prototype.renderDataWorksheet = function () {
        var _this = this;
        this._prepareTables();
        this._queryTables(function () {
            _this.createControls();
        });
    };


    DataWorksheet.prototype._init = function () {
        var wsOption = this.getDataWorksheetOption('partial');

        this.options.style = {
            width: '100%',
            height: '100%'
        };
        this.options.worksheet = {
            panel: wsOption.panel,
            layout: wsOption.layout
        };

        this.chartOptions = {};
    };

    DataWorksheet.prototype.getDataWorksheetOption = function (mode) {
        if (this.options.fnUnit.display.sheet
            && this.options.fnUnit.display.sheet[this.options.panelType]
            && this.options.fnUnit.display.sheet[this.options.panelType][mode]
            && this.options.fnUnit.display.sheet[this.options.panelType][mode][0]) {
            return this.options.fnUnit.display.sheet[this.options.panelType][mode][0];
        }
        return {'panel': [], 'layout': {}};
    };

    DataWorksheet.prototype._setDataInfo = function () {
        this.dataInfo = {
            mid: this.options.fnUnit.parent().mid,
            fid: this.options.fnUnit.fid,
            fnUnitLabel: this.options.fnUnit.display.label,
            panelType: this.options.panelType,
            tableList: FnUnitUtils.getTable(this.options.fnUnit, this.options.panelType)
        }
    };

    DataWorksheet.prototype._updateDataInfoTableList = function () {
        this.dataInfo.tableList = FnUnitUtils.getTable(this.options.fnUnit, this.options.panelType);
        // this.dataInfo.tableList = this.options.fnUnit[this.options.panelType + DATA_POST_FIX];
    };

    DataWorksheet.prototype.getDataTable = function () {
        return FnUnitUtils.getTable(this.options.fnUnit, this.options.panelType);
    };

    DataWorksheet.prototype._prepareTables = function () {

        this._updateDataInfoTableList();
        var tableList = this.getDataTable();
        this._tableMap = {};

        if (this.options.worksheet.panel.length === 0) {
            this.options.worksheet.panel.push({
                id: 'default-' + Date.now(),
                chartOption: {
                    chart: {
                        type: 'table'
                    }
                }
            });
        } else if (this.options.worksheet.panel.length === 1 && this.options.selectedChart !== 'table') {
            this.options.worksheet.panel[0].chartOption.chart.type = this.options.selectedChart;
        }

        for (var panelIdx in this.options.worksheet.panel) {
            var panel = this.options.worksheet.panel[panelIdx];
            var defaultRegistry = Brightics.Chart.Registry[panel.chartOption.chart.type] || Brightics.Chart.Registry['table'];
            var opt = $.extend(true, {}, defaultRegistry.DefaultOptions, panel.chartOption);
            opt.colorSet = panel.chartOption.colorSet || defaultRegistry.DefaultOptions.colorSet;
            panel.chartOption = opt;
            var tableIndexes = this.options.worksheet.panel[panelIdx].tableIndexes || [0];
            for (var index = 0; index < tableIndexes.length; index++) {
                var tableId = tableList[tableIndexes[index]] || tableList[0];
                if (typeof tableId === 'undefined') continue;
                this._tableMap[tableId] = this._tableMap[tableId] || {};
            }
        }
    };


    DataWorksheet.prototype._queryTables = function (doneCallback) {
        var _this = this;
        var _finishedJobCount = 0;
        var tableList = Object.keys(this._tableMap);

        if (tableList.length === 0) {
            var callBack = this._getCallBackFunction('createRecommendedChartSheet');
            if (callBack) callBack();
        } else {
            for (var i = 0; i < tableList.length; i++) {
                var table = tableList[i];
                var tableObj = this._tableMap[table] || {};
                var _page = tableObj.page || 1;
                var _pageSize = tableObj.pageSize || Brightics.VA.SettingStorage.getValue('editor.datapanel.defaultrowcount') * 1;
                var columnOption = this.options.fnUnit.display.columns ? this.options.fnUnit.display.columns[table] : null;
                this.options.dataProxy.requestPageData(tableList[i], function (data, tableId) {

                    _this._tableMap[tableId] = data;
                    _this._tableMap[tableId].page = _page;
                    _this._tableMap[tableId].pageSize = _pageSize;
                    _this._tableMap[tableId].count = data.count;
                    _this._tableMap[tableId].offset = (_page - 1) * _pageSize;


                    _finishedJobCount = _finishedJobCount + 1;
                    if (tableList.length === _finishedJobCount) {
                        doneCallback();
                    }
                }, function (result) {
                    _finishedJobCount = _finishedJobCount + 1;
                    if (tableList.length !== _finishedJobCount) return;
                    if (_this.options.worksheet.panel.length <= 1 && result && result.columns && result.columns.length === 0) {
                        var callBack = _this._getCallBackFunction('createRecommendedChartSheet');
                        if (callBack) callBack();
                    } else {
                        doneCallback();
                    }
                }, _page, _pageSize, { columns: columnOption });
            }
        }
    };


    DataWorksheet.prototype.createControls = function () {
        var _this = this;
        this.$parent.empty();

        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-dataworksheet"></div>');
        this.$mainControl.css({
            width: '100%',
            height: '100%'
        });
        this.$parent.append(this.$mainControl);

        // this.options.worksheet.$panelSelectionGroup = _this.$mainControl.closest('.brtc-va-editors-sheet-fnunitviewer');
        this.options.worksheet.onAddChart = this.onAddChart.bind(this);
        this.options.worksheet.onRemoveChart = this.onRemoveChart.bind(this);
        this.options.worksheet.onChangeLayout = this.onChangeLayout.bind(this);
        this.options.worksheet.onChangeChart = this.onChangeChart.bind(this);
        this.options.worksheet.onSelectChart = this.onSelectChart.bind(this);

        for (var i in this.options.worksheet.panel) {
            this.options.worksheet.panel[i].chartOption.source = this._getPanelSource(this.options.worksheet.panel[i]);
            $.extend(true, this.options.worksheet.panel[i].chartOption,{
                plotOptions:{
                    map: {
                        geoData: {
                            url: function(mapName){
                                //if( typeof mapName =='undefined' || mapName == '')
                                return 'api/va/v2/map/' + mapName
                            }
                        }
                    }
                }
            });
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
                details: {},
                close: {}
            }
        };

        this.$mainControl.bchartsAdonis(this.options);

        this.bindEventHandlers();

        this._initDataWorkSheet();
    };

    DataWorksheet.prototype._getGuideOption = function () {
        var callback = function () {
            console.log('clicked validation Message');
        };

        var guide = {
            message: 'Set data options using Chart Setting Button.',
            onClick: callback    
        };
        return guide;
    };

    DataWorksheet.prototype._handleChartSettings = function (panel) {
        this._openChartSettingsDialog();
        this.onSelectChart(panel.getOptions());
    };

    DataWorksheet.prototype._attachChartOptionPanelToDialog = function ($chartOptionPanel) {
        $chartOptionPanel.data('original-parent', $chartOptionPanel.parent());
        $chartOptionPanel.detach();

        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');
        $dialog.find('.brtc-va-dialog-contents').append($chartOptionPanel);
    };

    DataWorksheet.prototype._detachChartOptionPanel = function () {
        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');
        $dialog.find('.bcharts-option-panel').each(function (index, element) {
            var $chartOptionPanel = $(element);
            var $parent = $chartOptionPanel.data('original-parent');
            $chartOptionPanel.detach().appendTo($parent);
        });
    };

    DataWorksheet.prototype._openChartSettingsDialog = function () {
        var $dialog = this.$mainControl.closest('.brtc-va-editors-modeleditor').children('.brtc-va-dialog.brtc-va-chart-settings');

        var parentOffset = this.$mainControl.offset(),
            parentWidth = this.$mainControl.width(),
            studioHeaderWidth = 50,
            editorHeaderWidth = 50,
            splitterHeight = 5,
            footerHeight = 30,
            windowWidth = $(window).width();

        var getRightPosition = function (parentOffset, parentWidth) {
            return (windowWidth < (parentWidth + parentOffset.left)) ? 0 : (windowWidth - (parentWidth + parentOffset.left));
        };

        if ($dialog.height() > ( this.$mainControl.height() + footerHeight)) {
            $dialog.css({
                left: '',
                right: getRightPosition(parentOffset, parentWidth),
                top: '',
                bottom: 0
            });
        } else {
            $dialog.css({
                left: '',
                right: getRightPosition(parentOffset, parentWidth),
                top: studioHeaderWidth + editorHeaderWidth + splitterHeight
                + this.$mainControl.parents('.brtc-va-editors-modeleditor-sheet').siblings('.brtc-va-editors-modeleditor-diagram').height(),
                bottom: ''
            });
        }

        $dialog.show();
    };

    DataWorksheet.prototype.arrange = function (direction) {
        if (this.$mainControl) {
            this.$mainControl.bchartsAdonis('layout', direction);
        }
    };

    DataWorksheet.prototype.onAddChart = function (panelOption, layout) {
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

    DataWorksheet.prototype.onRemoveChart = function (panelOption, layout) {
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
    };

    DataWorksheet.prototype.onChangeLayout = function (layout) {
        if (JSON.stringify(this.options.worksheet.layout) !== JSON.stringify(layout)) {
            this.executeCommand(this.createSetDataWorksheetLayoutCommand(layout));
        }
    };

    DataWorksheet.prototype._assignArray = function (targetObject, sourceObject) {
        for (var key in sourceObject) {
            if ($.isPlainObject(sourceObject[key])) {
                this._assignArray(targetObject[key], sourceObject[key]);
            } else if ($.isArray(sourceObject[key])) {
                targetObject[key] = $.extend(true, [], sourceObject[key]);
            }
        }
    };

    DataWorksheet.prototype._mergeArraySafely = function (targetObject, sourceObject) {
        var merged = $.extend(true, {}, targetObject, sourceObject);
        this._assignArray(merged, sourceObject);
        return merged;
    };

    DataWorksheet.prototype.onChangeChart = function (panelOption, changedOption) {
        var original = this.chartOptions[panelOption.id];
        var changed = this._mergeArraySafely(this.chartOptions[panelOption.id], changedOption);
        if (JSON.stringify(original) !== JSON.stringify(changed)) {
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

    DataWorksheet.prototype.onSelectChart = function (panelOptions) {
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

        var pageInfo = this.getPaginationInfoByTableIndex(tableIndex);
        this.options.callback.setPaginationInfo(pageInfo);

        if ($($('.bo-control-container-contents')[0]).css('display') == 'block') {
            $('#complexTab').css({'display': 'block'});
        } else {
            $('#complexTab').css({'display': 'none'});
        }
    };

    DataWorksheet.prototype.getPaginationInfoByTableIndex = function (tableIndex) {
        var tableId = this.dataInfo.tableList[tableIndex];
        var tableObj = this._tableMap[tableId] || {};
        if (this._tableMap[tableId] && this._tableMap[tableId].data) {
            tableObj.page = tableObj.page || 1;
            tableObj.pageSize = tableObj.pageSize || Brightics.VA.SettingStorage.getValue('editor.datapanel.defaultrowcount') * 1;
            tableObj.totalCount = tableObj.count;
            tableObj.tableId = tableId;
        }
        return tableObj;
    };

    DataWorksheet.prototype.updataPageInfo = function (tableId, pageInfo) {
        var tableObj = this._tableMap[tableId] || {};
        tableObj.page = pageInfo.page;
        tableObj.pageSize = pageInfo.pageSize;
        tableObj.offset = (tableObj.page - 1) * pageInfo.pageSize;
    };

    DataWorksheet.prototype.bindEventHandlers = function () {
        var _this = this;
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        if (modelEditor) {
            this.commandListener = function (command) {
                if (command.event.source.dataInfo
                    && command.event.source.dataInfo.fid === _this.dataInfo.fid
                    && command.event.source.dataInfo.panelType === _this.dataInfo.panelType
                    && !(command.event.source instanceof Brightics.VA.Core.Editors.Sheet.Controls.BigDataWorksheet)) {
                    if (command.event.type == 'REDO') _this.redo(command);
                    else if (command.event.type == 'UNDO') _this.undo(command);
                    else if (command.event.type == 'EXECUTE') _this.execute(command);
                }
            };
            modelEditor.addCommandListener(this.commandListener);
        }
    };

    DataWorksheet.prototype.unbindEventHandlers = function () {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        if (modelEditor && this.commandListener) {
            modelEditor.removeCommandListener(this.commandListener);
            this.commandListener = null;
        }
    };

    DataWorksheet.prototype.redo = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) {
            if (command.getId() === 'brightics.va.editors.diagram.commands.addchartcommand') this.onNewChartCommand(command);
            else if (command.getId() === 'brightics.va.editors.diagram.commands.removechartcommand') this.onRemoveChartCommand(command);
            else for (var i in command.commandList) this.redo(command.commandList[i]);
        }
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewChartCommand) this.onNewChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveChartCommand) this.onRemoveChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand) this.onSetDataWorksheetLayoutCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetContentsPanelCommand) this.onSetContentsPanelCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeDataSourceCommand) this._onChangeDataSourceCommand(command);
    };

    DataWorksheet.prototype.undo = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) {
            if (command.getId() === 'brightics.va.editors.diagram.commands.addchartcommand') this.onNewChartCommand(command);
            else if (command.getId() === 'brightics.va.editors.diagram.commands.removechartcommand') this.onRemoveChartCommand(command);
            else for (var i = command.commandList.length - 1; i >= 0; i--) this.undo(command.commandList[i]);
        }
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewChartCommand) this.onNewChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveChartCommand) this.onRemoveChartCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand) this.onSetDataWorksheetLayoutCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetContentsPanelCommand) this.onSetContentsPanelCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeDataSourceCommand) this._onChangeDataSourceCommand(command);
    };

    DataWorksheet.prototype.execute = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) {
            if (command.getId() === 'brightics.va.editors.diagram.commands.addchartcommand') this.configureSheetLayout();
        }
    };

    DataWorksheet.prototype.onNewChartCommand = function (command) {
        if (command.event.type == 'REDO') {
            command.options.panelOption.chartOption.source = this._getPanelSource(command.options.panelOption);
            command.options.panelOption.dataSource = this._setPanelDataSource();
            this.$mainControl.bchartsAdonis('addChartPanel', command.options.panelOption);
            this.configureSheetLayout();
        } else {
            this.$mainControl.bchartsAdonis('removeChartPanel', command.options.panelOption.id);
        }
    };

    DataWorksheet.prototype.onRemoveChartCommand = function (command) {
        if (command.event.type == 'REDO') {
            this.$mainControl.bchartsAdonis('removeChartPanel', command.options.panelOption.id);
        } else {
            this.$mainControl.bchartsAdonis('addChartPanel', command.options.panelOption);
            this.configureSheetLayout();
        }
    };

    DataWorksheet.prototype.onSetDataWorksheetLayoutCommand = function (command) {
        this.$mainControl.bchartsAdonis('layout', command.options.layout);
    };

    DataWorksheet.prototype.configureSheetLayout = function () {
    };

    DataWorksheet.prototype.onSetContentsPanelCommand = function (command) {
        this.chartOptions[command.options.panelOption.id] = command.options.panelOption.chartOption;
        this.$mainControl.bchartsAdonis('setChartOptions', command.options.panelOption.id, command.options.panelOption.chartOption);
    };

    DataWorksheet.prototype.createNewChartCommand = function (panelOption) {
        var newChartCommand = new Brightics.VA.Core.Editors.Diagram.Commands.NewChartCommand(this, {
            panel: this.options.worksheet.panel,
            panelOption: panelOption
        });

        return newChartCommand;
    };

    DataWorksheet.prototype.createRemoveChartCommand = function (panelOption) {
        var removeChartCommand = new Brightics.VA.Core.Editors.Diagram.Commands.RemoveChartCommand(this, {
            panel: this.options.worksheet.panel,
            panelOption: panelOption
        });

        return removeChartCommand;
    };

    DataWorksheet.prototype.createSetDataWorksheetLayoutCommand = function (newLayout) {
        var setDataWorksheetLayoutCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand(this, {
            layout: this.options.worksheet.layout,
            newLayout: newLayout
        });

        return setDataWorksheetLayoutCommand;
    };

    DataWorksheet.prototype.executeCommand = function (command) {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        modelEditor.getCommandManager().execute(command);
    };

    DataWorksheet.prototype._handleOpenMultiChart = function (panel) {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$mainControl);
        var param = {
            user: Brightics.VA.Env.Session.userId,
            pid: modelEditor.options.editorInput.getProjectId(),
            mid: this.dataInfo.mid,
            fid: this.dataInfo.fid,
            tid: this.dataInfo.tableList[this._getSelectedPanelTableIndex()],
            cid: panel.getOptions().id,
            ch: modelEditor.getConnectionKey()
        };
        var params = $.map(param, function (value, key) {
            return key + '=' + value;
        }).join('&');
        window.open('multichart?' + params, 'multiChart');
    };

    DataWorksheet.prototype._handleAddToReport = function (panel) {
        var _this = this;

        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
        var panelTitle = this.$mainControl.closest('.brtc-va-editors-sheet-panels-basepanel').find('.brtc-va-editors-sheet-panels-basepanel-header-title').text();
        modelEditor.getReportManager().addReportData({
            options: {
                id: panel.getOptions().id,
                chartOption: $.extend(true, {}, panel.getOptions().chartOption)
            },
            data: {
                mid: _this.dataInfo.mid,
                fid: _this.dataInfo.fid,
                table: _this.dataInfo.tableList[panel.options.tableIndexes || 0],
            },
            title: {
                fnUnitLabel: _this.dataInfo.fnUnitLabel,
                panelTitle: panelTitle
            }
        }).then(function (dataIndex) {
            var fnUnit = modelEditor.options.editorInput.getContents().getFnUnitById(_this.dataInfo.fid);
            Brightics.VA.Core.Utils.ModelUtils.carvePersist(fnUnit, true);

            modelEditor.save();
        }, function (err) {
            modelEditor.notification('error', err);
        });

        if (Brightics.VA.Implementation.Visual) {
            var projectId = modelEditor.options.editorInput.getProjectId();
            var projectLabel = Studio.getResourceManager().getProject(projectId).getLabel();
            var visualModels = Studio.getResourceManager().getFilesByModelType(projectId, Brightics.VA.Implementation.Visual.Clazz);

            var modelLabel = modelEditor.options.editorInput.getLabel();
            var functionLabel = _this.dataInfo.fnUnitLabel;
            if (visualModels.length) {
                new Brightics.VA.Implementation.Visual.Dialogs.SelectVisualModelDialog(_this.$mainControl, {
                    projectId: projectId,
                    projectLabel: projectLabel,
                    visualModels: visualModels,
                    modelId: _this.dataInfo.mid,
                    tableId: _this.dataInfo.tableList[panel.options.tableIndexes || 0],
                    defaultDataSourceLabel: modelLabel + '-' + functionLabel + '-' + panelTitle,
                    close: function (dialogResult) {
                        if (dialogResult.OK) {
                            Brightics.VA.Implementation.Visual.Utils.ModelUtils.addChartContentToSelectedVisualModel({
                                resourceManager: Studio.getResourceManager(),
                                dataSourceLabel: (dialogResult.dataSourceLabel) ? (dialogResult.dataSourceLabel) : (modelLabel + '-' + functionLabel + '-' + panelTitle),
                                dataSourceTag: (dialogResult.dataSourceTag) ? (dialogResult.dataSourceTag) : (''),
                                selectedModels: dialogResult.selectedModels,
                                projectId: projectId,
                                modelId: _this.dataInfo.mid,
                                tableId: _this.dataInfo.tableList[panel.options.tableIndexes || 0],
                                chartOptions: $.extend(true, {}, panel.getOptions().chartOption),
                                columns: $.extend(true, [], Brightics.VA.Core.DataQueryTemplate.getSchema(_this.dataInfo.mid, _this.dataInfo.tableList[panel.options.tableIndexes || 0])),
                                changeLabel: dialogResult.changeLabel
                            });
                            var selectedReports = dialogResult.selectedModels;
                            // Studio.setChartContentAddedReport(selectedReports);
                            Studio.getInstance().setChartContentAddedReport(selectedReports);
                            var option = {
                                type: 'info',
                                isCancel: true,
                                contentText: 'Successfully Added To The Report.',
                                okLabel: 'Open Report',
                                cancelLabel: 'Close',
                                close: function (result) {
                                    if (result.OK) {
                                        for (var i in selectedReports) {
                                            var projectId = selectedReports[i].getProjectId();
                                            var fileId = selectedReports[i].getFileId();
                                            var fileInput = Studio.getResourceManager().getFile(projectId, fileId);
                                            if (fileInput) Studio.getLayoutManager().openEditor(fileInput);
                                            else Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('File not found.');
                                        }
                                    }
                                }
                            };
                            Brightics.VA.Core.Utils.WidgetUtils.createCommonConfirmDialog(_this.$mainControl, option);
                        }
                    },
                    resizable: true,
                    title: 'Select Reports to Add'
                });
            }
            else {
                var option = {
                    type: 'info',
                    isCancel: true,
                    contentText: 'No report in this project. Do you want to create a report?',
                    okLabel: 'Create Report',
                    cancelLabel: 'Close',
                    close: function (result) {
                        if (result.OK) {
                            Studio.getInstance().projectViewer.openNewFileDialog(projectId, 'Report');
                        }
                    }
                };
                Brightics.VA.Core.Utils.WidgetUtils.createCommonConfirmDialog(_this.$mainControl, option);
            }
        }
    };

    DataWorksheet.prototype.destroy = function () {
        if (!this.$mainControl) return;
        this._cleanTableMap();
        this.unbindEventHandlers();
        this.$mainControl.bchartsAdonis('destroy');
    };

    DataWorksheet.prototype._cleanTableMap = function () {
        for (var tableId in this._tableMap) {
            delete this._tableMap[tableId];
        }
    };


    DataWorksheet.prototype.setDataSet = function (tableId, data) {
        this._tableMap[tableId].columns = data.columns;
        this._tableMap[tableId].data = data.data;
        this.$mainControl.bchartsAdonis('refreshChartPanel');
    };

    DataWorksheet.prototype._getDataSourceList = function () {
        var fnUnit = this.options.fnUnit;
        var panelType = this.dataInfo.panelType;
        // var tableList = fnUnit[panelType + DATA_POST_FIX];
        var tableList = FnUnitUtils.getTable(fnUnit, panelType);
        var list = [];
        for (var i = 0; i < tableList.length; i++) {
            list.push({
                value: tableList[i],
                label: this._getDataSourceLabel(i)
            })
        }
        return list;
    };


    DataWorksheet.prototype._getPanelSource = function (panel) {
        var tableIndexes = panel.tableIndexes || [0];
        return this._getSourceByTableIndexes(tableIndexes);
    };


    DataWorksheet.prototype._getSourceByTableIndexes = function (tableIndexes) {
        var source = {
            dataType: 'lazy',
            lazyData: []
        };

        for (var i = 0; i < tableIndexes.length; i++) {
            source.lazyData.push(this._getLazyData(tableIndexes[i]));
        }

        return source;
    };
    DataWorksheet.prototype._getDataSourceLabel = function (tableIndex) {
        var panelType = this.dataInfo.panelType;
        // var tableList = this.options.fnUnit[panelType + DATA_POST_FIX];
        var tableList = FnUnitUtils.getTable(this.options.fnUnit, panelType);
        var tableId = tableList[tableIndex];
        var model = this.options.fnUnit.parent();
        var preFnUnit = model.getFnUnitByOutTable(tableId);
        var label = preFnUnit.display.label || '';

        var output = FnUnitUtils.getOutputsToObject(preFnUnit)[tableId];
        if (output && tableList.length > 1) {
            label = `${label} (${output})`
        }else if(tableList.length > 1) {
            label = `${label}-${tableIndex+1}`;
        }
        // if (panelType === PANEL_TYPE_OUT && tableList.length > 1) {
        //     label = label + '-' + (tableIndex + 1);
        // }
        return label;
    };


    DataWorksheet.prototype._getTableSchema = function (tableId) {
        if (this._tableMap[tableId] && this._tableMap[tableId].columns) {
            return this._tableMap[tableId].columns
        } else {
            var mid = this.options.fnUnit.parent().mid;
            return Brightics.VA.Core.DataQueryTemplate.getSchema(mid, tableId);
        }
    };

    DataWorksheet.prototype._setTableMapFromCache = function (tableId) {
        if (this._tableMap[tableId] && this._tableMap[tableId].data) {
            return this._tableMap[tableId].data
        } else {
            var mid = this.options.fnUnit.parent().mid;
            return Brightics.VA.Core.DataQueryTemplate.getTable(mid, tableId);
        }
    };

    DataWorksheet.prototype._getTableMap = function (tableId) {
        if (!this._tableMap[tableId]) {
            var mid = this.options.fnUnit.parent().mid;
            this._tableMap[tableId] = Brightics.VA.Core.DataQueryTemplate.getTable(mid, tableId);
        }
        return this._tableMap[tableId];
    };

    DataWorksheet.prototype._getLazyData = function (tableIndex) {
        var _this = this;
        var fnUnit = this.options.fnUnit;
        var panelType = this.dataInfo.panelType;
        // var tableList = fnUnit[panelType + DATA_POST_FIX];
        var tableList = FnUnitUtils.getTable(fnUnit, panelType);
        var tableId = tableList[tableIndex];

        if (tableId) {
            return {
                id: {
                    value: tableId,
                    label: this._getDataSourceLabel(tableIndex)
                },
                columns: function () {
                    return _this._getTableSchema(tableId)
                },
                data: function (prepare) {
                    _this._prepareCache = _this._prepareCache || {};
                    var _prepare = prepare;

                    if (_this._prepareCache[_prepare.chartInstanceId]) {
                        clearTimeout(_this._prepareCache[_prepare.chartInstanceId]);
                        delete _this._prepareCache[_prepare.chartInstanceId];
                    }

                    _this._prepareCache[_prepare.chartInstanceId] = setTimeout(function () {
                        if (!_this._getTableMap(tableId)) return;
                        try {
                            _prepare.done({
                                dataType: 'rawdata',
                                columns: _this._tableMap[tableId].columns,
                                data: _this._getData(tableId, prepare),
                                count: _this._tableMap[tableId].count,
                                offset: _this._tableMap[tableId].offset,
                            })
                        } catch (e) {
                            Logger.error(e.stack, {category: 'Chart'});
                        }
                    }, 300);
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
                            offset: 0,
                        });

                    }, 100);
                }
            }
        }
    };

    DataWorksheet.prototype._getData = function (tableId, prepare) {
        var data;
        var filters = prepare.filters;
        if (filters && filters.length > 0) {
            var filterHelper = new Brightics.Chart.Helper.SelectionFilterHelper(filters);
            data = filterHelper.filter(this._tableMap[tableId].columns, this._tableMap[tableId].data);
        } else if (filters && filters.length === 0) {
            data = [];
        } else {
            data = this._tableMap[tableId].data;
        }
        return data;
    };


    DataWorksheet.prototype._setPanelDataSource = function (panelIndex) {
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
                    var panel = _this._getPanelByPanelId(panelId);
                    var command = new Brightics.VA.Core.Editors.Diagram.Commands.ChangeDataSourceCommand(_this, {
                        panel: panel,
                        ref: {
                            panel: {
                                tableIndexes: _this._getTableIndexes(idList)
                            }
                        }
                    });
                    _this.executeCommand(command);

                    // var newSourceOption = {
                    //     source: _this._getPanelSource(panel)
                    // };

                    _this.$mainControl.bchartsAdonis('setDataSource', panelId, _this._getPanelSource(panel));

                    var tableIndex = _this._getSelectedPanelTableIndex();
                    var pageInfo = _this.getPaginationInfoByTableIndex(tableIndex);
                    if (_this.options.callback && typeof _this.options.callback.setPaginationInfo === 'function') {
                        _this.options.callback.setPaginationInfo(pageInfo);
                    }
                });

            }
        };
        return dataSource
    };

    DataWorksheet.prototype._getSelectedPanelTableIndex = function () {
        var panelOptions = this._selectedPanelOptions;
        var tableIndex = 0;
        if (panelOptions && panelOptions.tableIndexes && panelOptions.tableIndexes[0]) tableIndex = panelOptions.tableIndexes[0];
        return tableIndex;
    };


    DataWorksheet.prototype._getPanelByPanelId = function (panelId) {

        var panel;
        for (var i = 0; i < this.options.worksheet.panel.length; i++) {
            if (this.options.worksheet.panel[i].id === panelId) {
                panel = this.options.worksheet.panel[i];
                break;
            }
        }
        return panel;
    };


    DataWorksheet.prototype._getTableIndexes = function (tableIdList) {
        var fnUnit = this.options.fnUnit;
        var panelType = this.dataInfo.panelType;
        var tableList = FnUnitUtils.getTable(fnUnit, panelType);
        var tableIndexes = [];
        tableIdList.forEach(function (tableId) {
            tableIndexes.push(tableList.indexOf(tableId))
        });
        return tableIndexes;
    };

    DataWorksheet.prototype._onChangeDataSourceCommand = function (command) {
        this.$mainControl.bchartsAdonis('setDataSource', command.options.panel.id, this._getSourceByTableIndexes(command.options.panel.tableIndexes));
    };


    DataWorksheet.prototype._getCallBackFunction = function (callBackFunction) {
        if (this.options.callback[callBackFunction]) {
            return this.options.callback[callBackFunction];
        }
    };

    DataWorksheet.prototype._initDataWorkSheet = function () {
        if (this.options.worksheet.panel.length > 0) {
            this.$mainControl.bchartsAdonis('selectChartPanel', this.options.worksheet.panel[0].id)
        }
    };

    Brightics.VA.Core.Editors.Sheet.Controls.DataWorksheet = DataWorksheet;

}).call(this);
