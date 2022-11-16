/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;

    root.Brightics.VA.Extentsion = {
        // 다 감싸야함  //지금은 싸그리 다 있지만 모델별로? 프로젝트별로?
        getActiveEditor: function () {
            return Studio.getEditorContainer().getActiveModelEditor();
        },
        openClipboard: function () {
            Studio.getClipboardManager().openClipboard();
        },
        openFunctionhelp: function () {
            var w = window.open('api/va/v2/help/function?type=data', 'Brightics Help');
            w.blur();
        },
        openHistoryDialog: function (e) {
            var activeEditor = this.getActiveEditor();

            activeEditor.getModelLayoutManager().handleOpenHistoryDialog(e);
        },
        openIndexDialog: function (e) {
            var activeEditor = this.getActiveEditor();

            activeEditor.getModelLayoutManager().handleOpenIndexDialog(e);
        },
        openScheduleManagementDialog: function () {
            var activeEditor = this.getActiveEditor();

            activeEditor.getModelLayoutManager().handleOpenScheduleManagementDialog();
        },
        redo: function () {
            var activeEditor = this.getActiveEditor();

            activeEditor.getCommandManager().redo();
        },
        undo: function () {
            var activeEditor = this.getActiveEditor();

            activeEditor.getCommandManager().undo();
        },
        setLastSelectedScale: function (scale) {
            var activeEditor = this.getActiveEditor();

            activeEditor.options.lastSelectedScale = scale;
        },
        getLastSelectedScale: function () {
            var activeEditor = this.getActiveEditor();

            return activeEditor.options.lastSelectedScale;
        },
        changeScale: function (scale) {
            var activeEditor = this.getActiveEditor();

            activeEditor.getModelLayoutManager().handleChangeScale(scale);
        },
        changeTooltipEnabled: function (enable) {
            var activeEditor = this.getActiveEditor();

            activeEditor.getModelLayoutManager().handleChangeTooltipEnabled(enable);
        },
        sidebarExpandStatusChanged: function (sidebarName, isExpand) {
            var activeEditor = this.getActiveEditor();

            activeEditor.getSideBarManager().expandStatusChanged(sidebarName, isExpand);
        }
    }
}).call(this);