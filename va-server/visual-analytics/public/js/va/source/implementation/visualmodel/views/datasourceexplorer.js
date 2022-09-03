/**
 * Created by ng1123.kim on 2016-05-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataSourceExplorer(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.init();
        this.retrieveParent();
        this.createControls();
    }

    DataSourceExplorer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataSourceExplorer.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-views-datasourceexplorer brtc-style-tab-contents">' +
            '   <div class="brtc-va-views-datasourceexplorer-area brtc-style-tab-contents-area">' +
            '       <div class="brtc-va-views-databoxcontrol-area"></div>' +
            '       <div class="brtc-va-views-datasourcepanel-area"></div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this._createDataBoxControl(this.$mainControl.find('.brtc-va-views-databoxcontrol-area'));
        this._createDataSourcePanel(this.$mainControl.find('.brtc-va-views-datasourcepanel-area'));
    };

    DataSourceExplorer.prototype._createDataBoxControl = function ($parent) {
        var _this = this;
        this.$dataBoxControl = $('' +
            '<div class="brtc-va-views-databoxcontrol">' +
            '   <div class="brtc-va-views-databoxcontrol-body">' +
            '       <div class="brtc-va-views-databoxcontrol-new-data-button brtc-style-views-databoxcontrol-button">' +
            '           <div class="brtc-va-views-databoxcontrol-new-data-button-image brtc-style-views-databoxcontrol-button-image">' +
            '               <div class="brtc-va-views-databoxcontrol-new-data-button-image-element brtc-styele-views-databoxcontrol-image-element"></div>' +
            '           </div>' +
            '           <div class="brtc-va-views-databoxcontrol-new-data-button-text">'+Brightics.locale.common.newData+'</div>' +
            '       </div>' +
            '       <div class="brtc-va-views-databoxcontrol-connect-schedule-button brtc-style-views-databoxcontrol-button">' +
            '           <div class="brtc-va-views-databoxcontrol-connect-schedule-button-image brtc-style-views-databoxcontrol-button-image">' +
            '               <div class="brtc-va-views-databoxcontrol-connect-schedule-button-image-element brtc-styele-views-databoxcontrol-image-element"></div>' +
            '           </div>' +
            '           <div class="brtc-va-views-databoxcontrol-connect-schedule-button-text">CONNECT SCHEDULE</div>' +
            '       </div>' +
            '   </div>' +
            '</div>');
        $parent.append(this.$dataBoxControl);
        this.$dataBoxControl.find('.brtc-va-views-databoxcontrol-new-data-button').click(function (event) {
            _this._handleNewDataButtonClick(event);
        });
        this.$dataBoxControl.find('.brtc-va-views-databoxcontrol-connect-schedule-button').click(function (event) {
            _this._handleConnectScheduleButtonClick(event);
        });
    };

    DataSourceExplorer.prototype._handleNewDataButtonClick = function (event) {
        var _this = this;
        new Brightics.VA.Implementation.Visual.Wizards.DataAdditionWizard(_this.$mainControl, {
            mode: 'open',
            visualModel: _this.options.editor.options.editorInput.getContents(),
            close: function (result) {
                if (result.fileName) {
                    var targetVisualModel = _this.options.editor.getModel();
                    var fileLabel = result.fileAlias || result.fileName;
                    var fileName = result.fileName;
                    var dataSource = targetVisualModel.newDataSource(result.type, fileLabel, fileName);

                    var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewDataSourceCommand(_this, {
                        dataSource: dataSource
                    });
                    var commandManager = _this.options.editor.getCommandManager();
                    commandManager.execute(command);

                    var listener = {
                        'success': function (res) {
                            _this.getActivePanel().addDataSource(dataSource);
                            _this.getActivePanel().renderColumns(dataSource.fid);
                        },
                        'fail': function (res) {
                            _this.getActivePanel().addDataSource(dataSource);
                            _this.getActivePanel().renderColumns(dataSource.fid);
                        },
                        'abort': function (res) {
                            _this.getActivePanel().addDataSource(dataSource);
                            _this.getActivePanel().renderColumns(dataSource.fid);
                        }
                    };
                    Studio.getJobExecutor().launchUnit(dataSource, {}, {persist: true}, listener);
                }
            }
        });
    };

    DataSourceExplorer.prototype._handleConnectScheduleButtonClick = function (event) {
        var _this = this;

        var editorInput = this.options.editor.getEditorInput();

        new Brightics.VA.Implementation.Visual.Dialogs.ModelScheduleDialog(this.$mainControl, {
            resourceManager: Studio.getResourceManager(),
            visualModel: editorInput,
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    var compoundCommand = new Brightics.VA.Core.CompoundCommand(this);

                    for (var i in dialogResult.connectInfo) {
                        var dataSourceId = dialogResult.connectInfo[i].dataSourceId,
                            newScheduleId = dialogResult.connectInfo[i].scheduleId;

                        var scheduleCommand = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.ChangeScheduleCommand(this, {
                            dataSourceId: dataSourceId,
                            scheduleId: newScheduleId
                        });

                        var funcCommand = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.ChangeFuncCommand(this, {
                            dataSourceId: dataSourceId,
                            // func: (newScheduleId)? 'loadFromSchedule' : 'loadFromStaging'
                            func: 'loadFromStaging'
                        });


                        compoundCommand.add(scheduleCommand);
                        compoundCommand.add(funcCommand);
                    }

                    var commandManager = _this.options.editor.getCommandManager();
                    commandManager.execute(compoundCommand);
                }
            },
            title: 'Connect Schedule'
        });
    };

    DataSourceExplorer.prototype.init = function () {
        this.dataSourcePanel = {};
    };

    DataSourceExplorer.prototype.destroy = function (editor) {
        if (editor) {
            var id = editor.id;
            if (this.dataSourcePanel[id]) {
                this.dataSourcePanel[id].destroy();
                this.dataSourcePanel[id] = null;
            }
        } else {
            for (var key in this.dataSourcePanel) {
                this.dataSourcePanel[key].destroy();
                this.dataSourcePanel[key] = null;
            }
        }
    };

    DataSourceExplorer.prototype.editorChanged = function (editor) {
        if (editor) {
            var editorInput = editor.options.editorInput;
            if (this.activeEditor) {
                if (this.dataSourcePanel[this.activeEditor.options.editorInput.id]) this.dataSourcePanel[this.activeEditor.options.editorInput.id].hide();
            }
            this.activeEditor = editor;

            if (!this.dataSourcePanel[editorInput.id]) this._createDataSourcePanel(this.$mainControl.find('.brtc-va-views-datasourcepanel-area'));
            else this.dataSourcePanel[editorInput.id].show();
        } else {
            this.activeEditor = null;
        }
    };

    DataSourceExplorer.prototype._createDataSourcePanel = function ($parent) {
        var editorInput = this.options.editor.options.editorInput;
        this.dataSourcePanel[editorInput.id] = new Brightics.VA.Implementation.Visual.Views.Units.DataSourcePanel($parent, {
            width: '100%',
            height: '100%',
            editor: this.options.editor,
            editorInput: editorInput
        });
    };

    DataSourceExplorer.prototype.getActivePanel = function () {
        return this.dataSourcePanel[this.options.editor.getEditorInput().id];
    };

    Brightics.VA.Implementation.Visual.Views.DataSourceExplorer = DataSourceExplorer;
}).call(this);