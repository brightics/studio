/**
 * Created by SDS on 2017-05-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataSourcePanel(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.init();

        this.retrieveParent();
        this.createControls();

        this.bindEventListeners();
    }

    DataSourcePanel.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataSourcePanel.prototype.init = function () {
        this.dataSourceControls = {};
    };

    DataSourcePanel.prototype.bindEventListeners = function () {
        this.options.editor.addCommandListener(this.handleCommand.bind(this));
        this.options.editor.addGoHistoryListener(this.handleCommand.bind(this));
    };

    DataSourcePanel.prototype.createControls = function () {
        this.$mainControl = $('<div class="bcharts-ds-panel"></div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);
        this.$mainControl.perfectScrollbar();

        this.createDataSourceControls();

        var tabs = this.$mainControl.find('.jqx-tabs');
        if (tabs.length > 0) tabs.jqxTabs('render');
    };

    DataSourcePanel.prototype.createDataSourceControls = function () {
        var dataSources = this.options.editor.options.editorInput.getContents().getDataSources();
        if (dataSources.length > 0) {
            var progressBar = Brightics.VA.Core.Utils.WidgetUtils.createProgressDialog($('body'), {
                title: 'Loading...'
            });

            var index = 1, _this = this;
            var done = function () {
                if (index++ < dataSources.length) return;

                progressBar.dialog('close');
                _this.options.editor.getDiagramEditorPage().render();
            };

            for (var i in dataSources) {
                var dataSource = dataSources[i];
                var dataSourceControl = this.addDataSource(dataSource);
                dataSourceControl.renderColumns(done);
            }
        }

        this.$mainControl.perfectScrollbar('update');
    };

    DataSourcePanel.prototype.updateDataSourceControls = function () {
        var dataSources = this.options.editor.options.editorInput.getContents().getDataSources();
        if ((dataSources.length > 0) && (Object.keys(this.dataSourceControls).length !== dataSources.length)) {
            //데이터소스가 Dataflow에서 추가된 경우임.
            var progressBar = Brightics.VA.Core.Utils.WidgetUtils.createProgressDialog($('body'), {
                title: 'Preparing workspace....'
            });

            var index = 1, _this = this;
            var done = function () {
                if (index++ < dataSources.length) return;

                progressBar.dialog('close');

                setTimeout(function () {
                    _this.options.editor.getDiagramEditorPage().render();
                }, 500);

            };

            for (var i in dataSources) {
                var dataSource = dataSources[i];
                if (!this.dataSourceControls[dataSource.fid]) {
                    var dataSourceControl = this.addDataSource(dataSource);
                    dataSourceControl.renderColumns(done);
                } else {
                    done();
                }
            }
        }

        for (var j in dataSources) {
            var charts = dataSources[j].display.charts;
            var targetDataSourceControl = this.dataSourceControls[dataSources[j].fid];
            if (charts && charts.length !== targetDataSourceControl.options.charts.length) {
                targetDataSourceControl.setOptions({charts: charts});
                targetDataSourceControl.fillChartTab();
            }

            targetDataSourceControl.setName(dataSources[j].display.label);
            targetDataSourceControl.fillName();
            targetDataSourceControl.renderColumns();

            targetDataSourceControl.renderScheduleIcon();
        }

        this.$mainControl.perfectScrollbar('update');
    };

    DataSourcePanel.prototype.destroy = function () {
        for (var i in this.dataSourceControls) {
            this.dataSourceControls[i].destroy();
        }
        this.$mainControl.remove();
        this.options.editor.removeCommandListener(this.commandListener);
        this.options.editor.removeGoHistoryListener(this.commandListener);
    };

    DataSourcePanel.prototype.show = function () {
        this.$mainControl.show();
        this.updateDataSourceControls();
        var tabs = this.$mainControl.find('.jqx-tabs');
        if (tabs.length > 0) tabs.jqxTabs('render');
    };

    DataSourcePanel.prototype.hide = function () {
        this.$mainControl.hide();
    };

    DataSourcePanel.prototype.handleCommand = function (command) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand) {
            for (var i in command.options.commands) {
                this.handleCommand(command.options.commands[i]);
            }
        }
        else if (command instanceof Brightics.VA.Core.CompoundCommand) this.handleCompoundCommand(command);
        else if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewDataSourceCommand) this.handleNewDataSourceCommand(command);
        else if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveDataSourceCommand) this.handleRemoveDataSourceCommand(command);
        else if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RenameDataSourceCommand) this.handleRenameDataSourceCommand(command);
        else if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveDataSourceChartsCommand) this.handleRemoveDataSourceChartsCommand(command);
        else if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.ChangeScheduleCommand) this.handleChangeScheduleCommand(command);
    };

    DataSourcePanel.prototype.handleCompoundCommand = function (command) {
        var i;
        if (command.event.type == 'EXECUTE' || command.event.type === 'REDO') {
            for (i in command.commandList) {
                this.handleCommand(command.commandList[i]);
            }
        } else if (command.event.type == 'UNDO') {
            for (i = command.commandList.length - 1; i > -1; i--) {
                this.handleCommand(command.commandList[i]);
            }
        }
    };

    DataSourcePanel.prototype.handleNewDataSourceCommand = function (command) {
        var _this = this;
        if (command.event.type === 'REDO') {
            this.addDataSource(command.options.dataSource);
            this.renderColumns(command.options.dataSource.fid);
        } else if (command.event.type === 'UNDO') {
            this.removeDataSource(command.options.dataSource.fid);
        }
    };

    DataSourcePanel.prototype.handleRemoveDataSourceCommand = function (command) {
        var _this = this;
        if (command.event.type == 'EXECUTE' || command.event.type === 'REDO') {
            this.removeDataSource(command.options.dataSourceId);
        } else if (command.event.type === 'UNDO') {
            this.addDataSource(command.old.dataSource);
            this.renderColumns(command.old.dataSource.fid);
            var dsCount = this.$mainControl.find('.bcharts-ds').length;
            if (dsCount > 1 && (Number(command.old.dataSourceIndex) + 1) !== Number(dsCount)) {
                this.$mainControl.find('.bcharts-ds').eq(dsCount - 1).detach().insertBefore(this.$mainControl.find('.bcharts-ds').eq(command.old.dataSourceIndex));
            }
        }
    };

    DataSourcePanel.prototype.handleRenameDataSourceCommand = function (command) {
        if (command.event.type == 'EXECUTE' || command.event.type === 'REDO') {
            this.renameDataSource(command.options.dataSourceId, command.options.label);
        } else if (command.event.type === 'UNDO') {
            this.renameDataSource(command.options.dataSourceId, command.old.label);
        }
    };

    DataSourcePanel.prototype.handleRemoveDataSourceChartsCommand = function (command) {
        if (command.event.type == 'EXECUTE' || command.event.type === 'REDO') {
            this.dataSourceControls[command.options.dataSourceId].removeChart(command.options.chartIndex);
        } else if (command.event.type === 'UNDO') {
            this.dataSourceControls[command.options.dataSourceId].addChart(command.old.chart, command.options.chartIndex);
        }
    };

    DataSourcePanel.prototype.handleChangeScheduleCommand = function (command) {
        this.dataSourceControls[command.options.dataSourceId].renderScheduleIcon();
    };

    DataSourcePanel.prototype.renameDataSource = function (dataSourceId, label) {
        this.dataSourceControls[dataSourceId].setName(label);
        this.dataSourceControls[dataSourceId].fillName();
    };

    DataSourcePanel.prototype.addDataSource = function (dataSource) {
        this.dataSourceControls[dataSource.fid] = new Brightics.VA.Implementation.Visual.Views.Units.DataSourceUnit(this.$mainControl, {
            dataSource: dataSource
        });

        return this.dataSourceControls[dataSource.fid];
    };

    DataSourcePanel.prototype.removeDataSource = function (dataSourceId) {
        this.dataSourceControls[dataSourceId].destroy();
        delete this.dataSourceControls[dataSourceId];
    };

    DataSourcePanel.prototype.renderColumns = function (dataSourceId) {
        this.dataSourceControls[dataSourceId].renderColumns();
    };

    Brightics.VA.Implementation.Visual.Views.Units.DataSourcePanel = DataSourcePanel;

}).call(this);