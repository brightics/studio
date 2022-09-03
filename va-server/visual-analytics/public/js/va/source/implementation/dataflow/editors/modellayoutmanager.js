/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * context spec
     * status : 'normal' or 'if' or 'loop'
     * context: fid, mid
     */

    function ModelLayoutManager(editor, options) {
        Brightics.VA.Core.Editors.ModelLayoutManager.call(this, editor, options);
        this.registerCommandManagerListener();
        this.getToolbar().navigator.registerOpenNavigatorDialog(this.openNavigatorDialog.bind(this));
    }

    ModelLayoutManager.prototype = Object.create(Brightics.VA.Core.Editors.ModelLayoutManager.prototype);
    ModelLayoutManager.prototype.constructor = ModelLayoutManager;

    ModelLayoutManager.prototype.registerConditionHeader = function (conditionHeader) {
        this.conditionHeader = conditionHeader;
        this.conditionHeader.on('tab-click', function (evt) {
            this.changeEditorModel(evt.data.getId());
        }.bind(this));
    };

    ModelLayoutManager.prototype.registerLoopHeader = function (loopHeader) {
        this.loopHeader = loopHeader;
    };

    // TODO -------------------------------------------------
    ModelLayoutManager.prototype.changeEditorModel = function (mid) {
        this.getEditor().setActiveModel(mid);
        this.getDiagramEditorWrapper().setModel(this.getEditor().getActiveModel(), this.fnUnit);
        this.getToolbar().navigator.buildNavigator(mid, this.fnUnit.fid);
        this.getEditor().resetSheetEditorPage();
        this.getSideBarManager().onModelChange();
        this.getDiagramEditorPage().createExpressionControl();

        this.adjustLayout();
    };

    // TODO -------------------------------------------------
    ModelLayoutManager.prototype.openActivity = function (mid, fnUnit) {
        this.fnUnit = fnUnit;
        this.getToolbar().navigator.buildNavigator(mid, fnUnit ? fnUnit.fid : undefined);
        this.getEditor().setActiveModel(mid);

        /*
        1. 네비게이터 변경
        2. Header 보여줌
        3. DiagramEditorPage 변경
        4. 사이드바 변경
        5. SheetEditorPage 숨김 (내용 초기화?)
        */

        this.getDiagramEditorWrapper().setModel(this.getEditor().getActiveModel(), fnUnit);
        this.getEditor().resetSheetEditorPage();
        this.getSideBarManager().onModelChange();
        this.getDiagramEditorPage().createExpressionControl();
        // if (fnUnit) {this.getToolbar().showItem('expression')}
        // else this.getToolbar().hideItem('expression');

        this.adjustLayout();
    };

    ModelLayoutManager.prototype.setDiagramHeight = function () {
        var $diagramArea = this.getEditor().getDiagramArea();

        var originHeight = this.$editor.height() - this.getToolbar().getHeight();

        var $headerArea = this.getEditor().getHeaderArea();
        var headerHeight = $headerArea.css('display') !== 'none' ?
            $headerArea.height() : 0;
        // var headerHeight = this.getDiagramEditorWrapper().getHeaderHeight();

        $diagramArea.height(originHeight - headerHeight);

        this.handleExpandStatusChanged();
    };

    ModelLayoutManager.prototype.handleAppendTemplate = function (opt) {
        this.getSideBarManager().getSideBars()['palette'].appendTemplate(opt);
    };

    ModelLayoutManager.prototype.handleSelectFunction = function (fid) {
        this.getDiagramEditorPage().selectFunction(fid);
    };

    ModelLayoutManager.prototype.handleChangeScale = function (scale) {
        this.getDiagramEditorPage().changeScale(scale);
    };

    ModelLayoutManager.prototype.handleChangeTooltipEnabled = function (enable) {
        this.getDiagramEditorPage().changeTooltipEnabled(enable);
    };

    ModelLayoutManager.prototype.handleFitToContent = function () {
        this.getDiagramEditorPage().fitToContent();
    };

    ModelLayoutManager.prototype.handleOpenHistoryDialog = function (event) {
        var _this = this;

        var anchorOffset = $(event.target).offset();
        var pos = {
            x: anchorOffset.left - 402 + 26,
            y: anchorOffset.top - 10 + 40
        };

        var stacks = this.getEditor().getCommandManager().getStacks();
        var source = [];
        var description;
        for (var i in stacks) {
            if (stacks[i].option && stacks[i].option.fnUnit) {
                description = stacks[i].getLabel() + ' - ' + stacks[i].options.fnUnit.display.label;
            } else {
                description = stacks[i].getLabel();
            }

            source.push({
                name: stacks[i].getLabel(),
                description: description
            });
        }
        var goHistoryHandler = function (dialogResult) {
            if (dialogResult.OK) {
                _this.getEditor().getCommandManager().go(dialogResult.goHistory);
                _this.getEditor().setEnableRedoUndoButton();
                _this.getEditor().refreshRedoUndoLabel();
            }
        };
        this.getEditor().setHistorySelector(new Brightics.VA.Core.Dialogs.HistorySelector(this.getEditor().$mainControl, {
            selectHistory: goHistoryHandler,
            stackIndex: _this.getEditor().getCommandManager().getIndex(),
            pos: pos,
            source: source,
            editor: _this.getEditor()
        }));
    };

    ModelLayoutManager.prototype.handleOpenIndexDialog = function (event) {
        var _this = this;

        var anchorOffset = $(event.target).offset();
        var pos = {
            x: anchorOffset.left - 402 + 26,
            y: anchorOffset.top - 10 + 40
        };

        this.getEditor().indexDialog = new Brightics.VA.Core.Dialogs.IndexDialog(this.getEditor().$mainControl, {
            editor: _this.getEditor(),
            window: {
                position: pos
            },
            appendTo: _this.getEditor().$mainControl
        });
    };

    ModelLayoutManager.prototype.openNavigatorDialog = function (pos, data, opt) {
        var _this = this;

        if (this.getEditor().navigatorDialog) this.getEditor().navigatorDialog.close();
        this.getEditor().navigatorDialog = new Brightics.VA.Core.Dialogs
            .NavigatorDialog(this.getEditor().$mainControl, _.merge({
                editor: _this.getEditor(),
                window: {
                    position: pos
                },
                appendTo: _this.getEditor().$mainControl
            }, opt));
    };

    ModelLayoutManager.prototype.handleOpenScheduleManagementDialog = function () {
        new Brightics.VA.Core.Dialogs.ScheduleManagementDialog(this.getEditor().$mainControl, {
            editorInput: this.getEditor().getModel(),
            appendTo: this.getEditor().$parent,
            title: 'Schedule list'
        });
    };

    ModelLayoutManager.prototype.handleExpandStatusChanged = function () {
        this.setEditorWidth();
    };

    ModelLayoutManager.prototype.setEditorWidth = function () {
        var sideBarManager = this.getSideBarManager();

        if (!sideBarManager) return;

        var $splitter = this.getEditor().getMainArea().find('.brtc-va-editors-modeleditor-splitter');
        var tabBarWidth = this.editor.getLeftTabBarArea().height();
        var sideBarWidth = sideBarManager.getLeftSideBarWidth() + sideBarManager.getRightSideBarWidth();
        if (sideBarManager.isOpen('left')) sideBarWidth += tabBarWidth;
        if (sideBarManager.isOpen('right')) sideBarWidth += tabBarWidth;

        var marginLeft = (sideBarManager.isOpen('left')) ? sideBarManager.getLeftSideBarWidth() + tabBarWidth : tabBarWidth;
        $splitter.css('width', 'calc(100% - ' + sideBarWidth + 'px)').css('margin-left', marginLeft);

        var $header = this.getEditor().getHeaderArea();
        var splitterHeight = 40 + $header.outerHeight();
        $splitter.css('height', 'calc(100% - ' + splitterHeight + 'px)');
        $header.css('width', 'calc(100% - ' + sideBarWidth + 'px)').css('margin-left', marginLeft);

        this.getSheetEditorPage().getFnUnitViewer().updatePanelWidth();
    };

    ModelLayoutManager.prototype.getFnUnit = function () {
        return this.fnUnit;
    };

    ModelLayoutManager.prototype.registerCommandManagerListener = function () {
        var _this = this;

        var commandManager = this.getEditor().getCommandManager();
        commandManager.registerCallbackLeft(function (command) {
            var fnUnit = command.options.editorContext.fnUnit;
            var mid = command.options.editorContext.mid;

            if (command.options.label === 'Remove Condition' &&
                mid === command.options.mid) {
                mid = fnUnit.param.if.mid;
            }
            if (_this.fnUnit !== fnUnit || mid !== _this.getEditor().getActiveModel().mid) {
                _this.openActivity(mid, fnUnit);
            }
            _this.getSideBarManager().onModelChange(command);
        });

        commandManager.registerGoHistoryCallbackLeft(function (command) {
            var commandList = command.options.commands;
            var lastCommand = commandList[commandList.length - 1];
            var fnUnit = lastCommand.options.editorContext.fnUnit;
            var mid = lastCommand.options.editorContext.mid;

            if (lastCommand.options.label === 'Remove Condition' &&
                mid === lastCommand.options.mid) {
                mid = fnUnit.param.if.mid;
            }
            if (_this.fnUnit !== fnUnit || mid !== _this.getEditor().getActiveModel().mid) {
                _this.openActivity(mid, fnUnit);
            }
            _this.getSideBarManager().onModelChange();
        });
    };

    ModelLayoutManager.prototype.getDiagramEditorPage = function () {
        return this.editor.getDiagramEditorPage();
    };

    ModelLayoutManager.prototype.getSheetEditorPage = function () {
        return this.editor.getSheetEditorPage();
    };

    ModelLayoutManager.prototype.getDiagramEditorWrapper = function () {
        return this.editor.getDiagramEditorWrapper();
    };

    ModelLayoutManager.prototype.handleOnActivate = function () {
        this.getDiagramEditorPage().onActivated();
        this.getSideBarManager().onActivated();
        this.getSheetEditorPage().onActivated();
    };

    ModelLayoutManager.prototype.destroy = function () {
        this.getSheetEditorPage().destroy();
        this.getDiagramEditorPage().destroy();
    };

    Brightics.VA.Implementation.DataFlow.ModelLayoutManager = ModelLayoutManager;
}).call(this);
