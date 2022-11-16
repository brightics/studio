/**
 * Created by sungjin1.kim on 2016-01-28.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');

    function ModelEditor(parentId, options) {
        Brightics.VA.Core.Editors.Editor.call(this, parentId, options);

        this.activeModelChangeListeners = [];
        this.initModelLayoutManager();
        this.registerCommandCallback();
    }

    ModelEditor.prototype = Object.create(Brightics.VA.Core.Editors.Editor.prototype);
    ModelEditor.prototype.constructor = ModelEditor;

    ModelEditor.prototype.init = function () {
        Brightics.VA.Core.Editors.Editor.prototype.init.call(this);
        this.setActiveModel(this.getModel().mid);
    };

    ModelEditor.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-modeleditor brtc-va-editor">' +
            '   <div class="brtc-style-editor-toolbar-area brtc-style-s-editor-toolbar-area"></div>' +
            '   <div class="brtc-va-editors-modeleditor-header"></div>' +
            '   <div class="brtc-va-editors-side-tab-bar brtc-va-editors-left-tab-bar"></div>' +
            '   <div class="brtc-va-editors-side-tab-bar brtc-va-editors-right-tab-bar"></div>' +
            '   <div class="brtc-va-editors-modeleditor-splitter">' +
            '      <div class="brtc-va-editors-modeleditor-diagram"></div>' +
            '      <div class="brtc-va-editors-modeleditor-sheet"></div>' +
            '   </div>' +
            '   <div class="brtc-va-editors-modeleditor-notification-container"></div>' +
            '   <div class="brtc-va-editors-modeleditor-notification">' +
            '       <div class="brtc-va-editors-modeleditor-notification-content"></div>' +
            '   </div>' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });

        this.$parent.append(this.$mainControl);
        this.initEditorState();

        Brightics.VA.Core.Utils.WidgetUtils.putModelEditorRef(this.$mainControl, this);

        this.createEditorSplitter();
        this.createHeader();
        this.getHeaderArea().hide();
        this.createDiagramEditorPage();
        this.createDiagramEditorWrapper();
        this.createToolbar();
        this.createSheetEditorPage();

        this.createNotification();
        this.createChartSettingDialog();
    };

    ModelEditor.prototype.initModelLayoutManager = function () {
        this.modelLayoutManager.registerConditionHeader(this.conditionHeader);
        this.modelLayoutManager.registerLoopHeader(this.loopHeader);
    };

    ModelEditor.prototype.createDiagramEditorPage = function () {
        var $diagram = this.getDiagramEditorPageArea();

        this.diagramEditorPage = new Brightics.VA.Implementation.DataFlow.Editors.Diagram.EditorPage($diagram, {
            width: '100%',
            height: '100%',
            editor: this
        });
        this._createEventListener();
    };

    ModelEditor.prototype.getColorSet = function () {
        return {
            READY: '#E5E9EF',
            DEPRECATED: '#D3D3D3',
            PROCESSING: 'blue',
            SUCCESS: '#58bd7c',
            FAIL: 'red'
        }
    };

    ModelEditor.prototype.updateStatus = function (event) {
        this.addStatus(event)
        this.diagramEditorPage.updateStatus(event);
        this.sideBarManager.updateStatus(event);
    };

    ModelEditor.prototype.getDiagramEditorPage = function () {
        return this.diagramEditorPage;
    };

    ModelEditor.prototype.createSheetEditorPage = function () {
        var $sheet = this.getSheetEditorPageArea();
        this.sheetEditorPage = new Brightics.VA.Core.Editors.Sheet.SheetEditorPage($sheet, {
            width: '100%',
            height: '100%',
            panelFactory: this.getPanelFactory()
        });
    };

    ModelEditor.prototype.getSheetEditorPage = function () {
        return this.sheetEditorPage;
    };

    ModelEditor.prototype._createEventListener = function () {
        var $diagram = this.$mainControl.find('.brtc-va-editors-modeleditor-diagram');
        this._createFnUnitSelectEventListener($diagram);
        this._createFnUnitDoubleClickEventListener($diagram);
        this._createFnUnitMoveEventListener($diagram);
    };

    ModelEditor.prototype._createFnUnitSelectEventListener = function ($diagram) {
        var _this = this;
        $diagram.bind('fnUnit:select', function (event, eventData) {
            var fnUnits = $.map(eventData, function (value, key) {
                return _this.getActiveModel().getFnUnitById(value);
            });

            if (!_this.getEditorState('move-mode-enabled') && fnUnits.length === 1) {
                if (FnUnitUtils.isDustNode(fnUnits[0])) return;
                if (!FnUnitUtils.isAvailable(fnUnits[0])) {
                    var message = 'This function is not available.';
                    _this.notification('error', message);
                    return;
                }

                if (FnUnitUtils.isProcessFunction(fnUnits[0])) {
                    _this.resetSheetEditorPage();
                    _this.openPopupDialog(fnUnits[0]);
                } else {
                    _this.$editorSplitter.jqxSplitter('expand');
                    _this.renderSheetEditorPage(fnUnits);
                }
            } else {
                _this.resetSheetEditorPage();
            }
        });
    };

    ModelEditor.prototype._createFnUnitMoveEventListener = function ($diagram) {
        var _this = this;
        $diagram.bind('fnUnit:move', function () {
            _this.resetSheetEditorPage();
        });
    };

    ModelEditor.prototype.getFunctionDef = function (fnUnit) {
        var clazz = this.getModel().type;
        return Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func);
    };

    ModelEditor.prototype._createFnUnitDoubleClickEventListener = function ($diagram) {
        var _this = this;
        $diagram.bind('fnUnit:dbclick', function (event, eventData) {
            if (_this.getEditorState('move-mode-enabled')) return;
            var fnUnits = $.map(eventData, function (value, key) {
                return _this.getActiveModel().getFnUnitById(value);
            });
            if (fnUnits.length === 1) {
                if (fnUnits[0][FUNCTION_NAME] === 'If' ||
                    fnUnits[0][FUNCTION_NAME] === 'ForLoop' ||
                    fnUnits[0][FUNCTION_NAME] === 'WhileLoop') {
                    var mid = fnUnits[0][FUNCTION_NAME] == 'If' ?
                        fnUnits[0].param.if.mid :
                        fnUnits[0].param.mid;

                    _this.modelLayoutManager.openActivity(mid, fnUnits[0]);
                // } else if (fnUnits[0][FUNCTION_NAME] === 'Flow') {
                //     var projectId = _this.getEditorInput().getProjectId();
                //     var fileId = fnUnits[0].param.mid;

                //     var fileInput = Studio.getResourceManager().getFile(projectId, fileId);
                //     if (fileInput) Studio.getLayoutManager().openEditor(fileInput);
                //     else Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('File not found.');
                } else {
                    _this.resetSheetEditorPage();
                }
            }
        });
    };

    ModelEditor.prototype.destroy = function () {
        this.modelLayoutManager.destroy();
    };

    ModelEditor.prototype.createChartSettingDialog = function () {
        var _this = this;
        // TODO In/Out Panel 에서 동시에 사용할 Dialog 인데,
        // TODO DataWorksheet 에서 구현하자니 복잡도가 올라가서 일단 여기다 구현함.
        // TODO Dialog Open 은 DataWorksheet 에서 하고 있음 by daewon.park since 20170523
        var $dialog = $('' +
            '<div class="brtc-va-dialog brtc-va-chart-settings">' +
            '   <div class="brtc-va-dialog-header">' +
            '       <div class="brtc-va-dialog-title">Chart Settings</div>' +
            '       <div class="brtc-va-dialog-button" action="close"></div>' +
            '   </div>' +
            '   <div class="brtc-va-dialog-contents"></div>' +
            '</div>');
        this.$mainControl.append($dialog);
        $dialog.draggable({
            handle: $dialog.find('.brtc-va-dialog-header > .brtc-va-dialog-title'),
            containment: 'parent'
        });

        $dialog.find('.brtc-va-dialog-header > .brtc-va-dialog-button[action="close"]').click(function () {
            $(this).closest('.brtc-va-dialog.brtc-va-chart-settings').hide();
        });
        $dialog.hide();

        return $dialog;
    };

    ModelEditor.prototype.showChartSettingDialog = function () {
        this.$mainControl.children('.brtc-va-dialog.brtc-va-chart-settings').show();
    };

    ModelEditor.prototype.hideChartSettingDialog = function () {
        this.$mainControl.children('.brtc-va-dialog.brtc-va-chart-settings').hide();
    };

    ModelEditor.prototype.createNotification = function () {
        var $notificationContainer = this.$mainControl.children(".brtc-va-editors-modeleditor-notification-container");
        this.$notification = this.$mainControl.children(".brtc-va-editors-modeleditor-notification");
        this.$notification.jqxNotification({
            theme: Brightics.VA.Env.Theme,
            appendContainer: $notificationContainer,
            autoOpen: false, animationOpenDelay: 800,
            autoClose: true, autoCloseDelay: 3000,
            template: "info"
        });
    };

    ModelEditor.prototype.notification = function (template, message) {
        this.$mainControl.children(".brtc-va-editors-modeleditor-notification-container").html('');
        var $notificationContent = this.$notification.find(".brtc-va-editors-modeleditor-notification-content");
        $notificationContent.html(message);
        this.$notification.jqxNotification({template: template});
        this.$notification.jqxNotification("open");
    };

    ModelEditor.prototype.getDiagramEditorPageArea = function () {
        return this.$mainControl.find('.brtc-va-editors-modeleditor-diagram');
    };

    ModelEditor.prototype.getSheetEditorPageArea = function () {
        return this.$mainControl.find('.brtc-va-editors-modeleditor-sheet');
    };

    ModelEditor.prototype.createEditorSplitter = function () {
        var _this = this;

        _this.$editorSplitter = _this.$mainControl.find('.brtc-va-editors-modeleditor-splitter');
        _this.expandedSize = 180;

        _this.$editorSplitter.jqxSplitter({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 'calc(100% - 40px)',
            orientation: 'horizontal',
            panels: [
                {size: _this.expandedSize, min: 90, collapsible: false},
                {min: 400, collapsible: true, collapsed: true}
            ],
            splitBarSize: 8
        });

        _this.$editorSplitter.on('resize', function (event) {
            if (event.args && event.args.panels) {
                if (event.args.panels[0].size == event.args.panels[0].min) {
                    // if (_this.$chevron.hasClass('fa-chevron-down') === false) {
                    //     _this.$chevron.addClass('fa-chevron-down');
                    // }
                } else {
                    // if (_this.$chevron.hasClass('fa-chevron-down')) {
                    //     _this.$chevron.removeClass('fa-chevron-down');
                    // }
                    _this.expandedSize = event.args.panels[0].size;
                }
                _this.getModelLayoutManager().handleFitToContent();
            }
        });
    };

    ModelEditor.prototype.onActivated = function () {
        $(window).trigger('resize');
        this.getModelLayoutManager().handleOnActivate();
    };

    ModelEditor.prototype.callFunction = function (fnUnit) {
        return Studio.getInstance().callFunction(this.getModel(), fnUnit);
    };

    ModelEditor.prototype.handleDebugEvent = function (eventData) {
    };

    ModelEditor.prototype.selectFunction = function (fid) {
        this.getModelLayoutManager().handleSelectFunction(fid);
    };

    ModelEditor.prototype.showFunctionProperty = function (fid) {
        if (!fid) return;
        var _this = this;
        var fnUnit = _this.getActiveModel().getFnUnitById(fid);
        if (fnUnit) {
            if (FnUnitUtils.isProcessFunction(fnUnit)) {
                _this.openPopupDiaog(fnUnit);
                _this.renderSheetEditorPage([fnUnit]);
            } else {
                _this.selectFunction(fid);
            }
        }
    };

    ModelEditor.prototype.getMainArea = function () {
        return this.$mainControl;
    };

    ModelEditor.prototype.getHeaderArea = function () {
        return this.$mainControl.find('.brtc-va-editors-modeleditor-header');
    };

    ModelEditor.prototype.getLeftTabBarArea = function () {
        return this.$mainControl.find('.brtc-va-editors-left-tab-bar');
    };

    ModelEditor.prototype.getRightTabBarArea = function () {
        return this.$mainControl.find('.brtc-va-editors-right-tab-bar');
    };

    ModelEditor.prototype.createHeader = function () {
        var $header = this.getHeaderArea();
        var Header = Brightics.VA.Implementation.DataFlow.Editors.Header;
        this.loopHeader = new Header.LoopHeader($header);
        this.conditionHeader = new Header.ConditionHeader($header);
    };

    ModelEditor.prototype.createDiagramEditorWrapper = function () {
        var DiagramEditorWrapper =
            Brightics.VA.Implementation.DataFlow.Editors.Diagram.DiagramEditorWrapper;
        this.diagramEditorWrapper = new DiagramEditorWrapper(null, {
            conditionHeader: this.conditionHeader,
            loopHeader: this.loopHeader,
            editor: this
        });
    };

    ModelEditor.prototype.renderSheetEditorPage = function (fnUnits) {
        this.sheetEditorPage.render(fnUnits);
        this.setActiveFnUnitOnProp(fnUnits[0]);
        if (fnUnits.length === 1) this.getDiagramEditorPage().ensureCenterByFnUnit(fnUnits[0]);
    };

    ModelEditor.prototype.resetSheetEditorPage = function () {
        this.$editorSplitter.jqxSplitter('collapse');
        this.sheetEditorPage.render();
        this.hideChartSettingDialog();
        this.setActiveFnUnitOnProp();
    };

    ModelEditor.prototype.getReportManager = function () {
        this.reportManager = this.reportManager || new Brightics.VA.Core.ReportManager(this.getEditorInput());
        return this.reportManager;
    };

    ModelEditor.prototype.getPanelFactory = function () {
        this.panelFactory = this.panelFactory || new Brightics.VA.Core.Editors.Sheet.PanelFactory();
        return this.panelFactory;
    };

    ModelEditor.prototype.getActiveModel = function () {
        return this.activeModel;
    };

    ModelEditor.prototype.getModelByMid = function (mid) {
        if (mid == this.getModel().mid) return this.getModel();
        return this.getModel().getInnerModel(mid);
    };

    ModelEditor.prototype.getFunctionByFid = function (fid) {
        var fnUnit = this.getModel().getFnUnitById(fid);
        if (fnUnit) return fnUnit;

        var models = this.getModel().getInnerModels();
        for (var mid in models) {
            var model = models[mid];
            fnUnit = model.getFnUnitById(fid);
            if (fnUnit) return fnUnit;
        }
        return undefined;
    };

    ModelEditor.prototype.setActiveModel = function (mid) {
        this.activeModel = this.getModelByMid(mid);
        this.handleActiveModelChange(this.activeModel);
    };

    ModelEditor.prototype.getActiveFnUnit = function () {
        return this.getModelLayoutManager().getFnUnit();
    };

    ModelEditor.prototype.getActiveFnUnitOnProp = function () {
        return this.activeFnUnitOnProp;
    };

    ModelEditor.prototype.getDiagramArea = function () {
        return this.$editorSplitter;
    };

    ModelEditor.prototype.setActiveFnUnitOnProp = function (val) {
        this.activeFnUnitOnProp = val;
        this.getSideBarManager().onFnUnitSelect(val);
    };

    ModelEditor.prototype.setHistorySelector = function (hs) {
        this.historySelector = hs;
    };

    ModelEditor.prototype.getDiagramEditorWrapper = function () {
        return this.diagramEditorWrapper;
    };

    ModelEditor.prototype.addActiveModelChangeListener = function (lis) {
        this.activeModelChangeListeners.push(lis);
    };

    ModelEditor.prototype.removeActiveModelChangeListener = function (lis) {
        this.activeModelChangeListeners =
            _.remove(this.activeModelChangeListeners, lis);
    };

    ModelEditor.prototype.handleActiveModelChange = function (model) {
        _.forEach(this.activeModelChangeListeners, function (lis) {
            if (_.isFunction(lis)) {
                lis(model);
            }
        });
    };

    ModelEditor.prototype.openPopupDialog = function (fnUnit) {
        if (FnUnitUtils.isBluffNode(fnUnit)) return;
        var clonedFnUnit = $.extend(true, {}, fnUnit);
        var func = fnUnit.func;
        var _this = this;

        var TargetDialogMap = {
            'setValue': 'SetValueSettingDialog',
            'import': 'ImportDataSettingDialog',
            'export': 'ExportDataSettingDialog',
            'unloadModel': 'UnloadModelSettingDialog'
        };
        var TargetDialog = Brightics.VA.Core.Dialogs[TargetDialogMap[func]];

        new TargetDialog(this.getDiagramEditorPage(), {
            event: event,
            editor: this,
            fnUnit: clonedFnUnit,
            param: clonedFnUnit.param,
            title: 'Setting Configuration',
            close: function (dialogResult) {
                if (dialogResult.OK && dialogResult.results) {
                    _this.createSetDialogFnUnitCommand(dialogResult.results.fnUnit, fnUnit);
                }
            }
        });
    };

    ModelEditor.prototype.createSetDialogFnUnitCommand = function (newFnUnit, oldFnUnit) {
        var commands = new Brightics.VA.Core.CompoundCommand(this, {label: 'Change a Function'});

        var inputsCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand(this, {
            fnUnit: oldFnUnit,
            ref: {
                inputs: _.isEmpty(newFnUnit.inputs)? oldFnUnit.inputs : newFnUnit.inputs
            }
        })

        var metaCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ChangeMetaCommand(this, {
            fnUnit: oldFnUnit,
            ref: {
                meta: _.isEmpty(newFnUnit.meta)? oldFnUnit.meta : newFnUnit.meta
            }
        })

        var paramCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDialogFnUnitCommand(this, {
            fnUnit: oldFnUnit,
            ref: {param: newFnUnit.param}
        });

        var renameCommand = new Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand(this, {
            fid: newFnUnit.fid,
            name: newFnUnit.display.label,
            description: newFnUnit.display.description
        });

        commands.add(inputsCommand);
        commands.add(metaCommand);
        commands.add(paramCommand);
        commands.add(renameCommand);
        this.getCommandManager().execute(commands);
    };

    ModelEditor.prototype.getEditorState = function (key) {
        if (_.has(this.editorState, key)) {
            return this.editorState[key];
        } else {
            throw new Error('invalid editor state');
        }
    };

    ModelEditor.prototype.setEditorState = function (key, val) {
        if (_.has(this.editorState, key)) {
            this.editorState[key] = val;
            if (_.has(this.handleEditorStateChange, key)) {
                this.handleEditorStateChange[key](val);
            }
        } else {
            throw new Error('invalid editor state');
        }
    };

    ModelEditor.prototype.initEditorState = function () {
        var _this = this;

        this.editorState = {
            'tooltip-enabled': false,
            'move-mode-enabled': false,
            'readonly-figure-selected': false
        };

        this.handleEditorStateChange = {
            'move-mode-enabled': function (enabled) {
                if (enabled) {
                    _this.resetSheetEditorPage();
                    _this.$mainControl.addClass('brtc-va-editors-move-mode-enabled');
                } else {
                    _this.$mainControl.removeClass('brtc-va-editors-move-mode-enabled');
                }
            }
        };
    };
    
    ModelEditor.prototype.changeEditorContext = function (mid, fnUnit) {
        this.modelLayoutManager.openActivity(mid, fnUnit);
    };

    ModelEditor.prototype.prepareLaunch = function () {
        this.StatusBoard.refresh();
    };

    ModelEditor.prototype.addStatus = function (event) {
        if (event.status === 'FAIL') {
            var id = event.fid;
            var message = event.originalResponse.errorInfo[0].message;
            this.StatusBoard.add(id, event.status, message);
        } else if (event.status === 'SUCCESS') {
            var id = event.fid;
            this.StatusBoard.add(id, event.status,'');
        } 
    };

    ModelEditor.prototype.getStatus = function (id) {
        return this.StatusBoard.get(id);
    };

    ModelEditor.prototype.showStatus = function (id, $target) {
        this.StatusBoard.show(id, $target);
    };

    Brightics.VA.Core.Editors.ModelEditor = ModelEditor;
}).call(this);
