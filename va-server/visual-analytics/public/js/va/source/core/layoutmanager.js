/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function LayoutManager() {
    }

    Brightics.VA.ClassUtils.inherits(LayoutManager, Brightics.VA.EventEmitter);

    LayoutManager.prototype.registerEditorTab = function (editorTab) {
        this.editorTab = editorTab;
    };

    LayoutManager.prototype.registerProjectViewer = function (projectViewer) {
        this.projectViewer = projectViewer;
    };

    LayoutManager.prototype.initLayout = function () {
        this.editorTab.hideNewEditorButton();
        this.editorTab.unselectAll();
        this.projectViewer.show();
    };

    LayoutManager.prototype.openEditor = function (editorInput) {
        this.projectViewer.hide();
        this.editorTab.showNewEditorButton();
        
        if (this.editorTab.openTab(editorInput)) {
            Studio.getEditorContainer().openEditor(editorInput);
            Studio.getClipboardManager().setEditorType(editorInput.getType());
        } 
        
    };

    LayoutManager.prototype.closeEditor = function (editorInput) {
        var nextEditorInput = this.editorTab.closeTab(editorInput);

        Studio.getEditorContainer().closeEditor(editorInput);

        if (nextEditorInput) {
            Studio.getEditorContainer().openEditor(nextEditorInput);
        }
    };

    LayoutManager.prototype.showProjectViewer = function () {
        this.editorTab.hideNewEditorButton();
        this.editorTab.unselectAll();

        this.projectViewer.fillProjectList();
        this.projectViewer.show();
    };

    LayoutManager.prototype.refreshProjectViewer = function () {
        this.projectViewer.fillProjectList();
    };

    LayoutManager.prototype.showProjectViewerPopup = function () {
        this.projectViewer.showPopup();
    };

    LayoutManager.prototype.hideProjectViewer = function () {
        this.projectViewer.hide();
    };

    LayoutManager.prototype.handleProjectDelete = function (event) {
        var editors = Studio.getEditorContainer().findEditorsByProjectId(event.getProjectId());
        for (var i in editors) {
            this.closeEditor(editors[i].options.editorInput);
        }
    };

    LayoutManager.prototype.handleProjectChange = function (event) {
        var editors = Studio.getEditorContainer().findEditorsByProjectId(event.getProjectId());
        for (var i in editors) {
            // TODO: editor에 wrapper function 만들지 
            // 직접 editor의 modellayoutmanager의 refreshModelInfo 사용할지 고민 필요
            editors[i].getModelLayoutManager().refreshModelInfo();
        }
    };

    LayoutManager.prototype.handleFileDelete = function (event) {
        var editor = Studio.getEditorContainer().findEditorById(event.getProjectId(), event.getFileId());
        if (editor) {
            this.closeEditor(editor.options.editorInput);
        }
    };

    LayoutManager.prototype.handleFileChange = function (event) {
        var editor = Studio.getEditorContainer().findEditorById(event.getProjectId(), event.getFileId());
        if (editor) {
            editor.options.editorInput = event;
            this.editorTab.updateTab(editor.options.editorInput);

            // TODO: editor에 wrapper function 만들지 
            // 직접 editor의 modellayoutmanager의 refreshModelInfo 사용할지 고민 필요
            editor.getModelLayoutManager().refreshModelInfo();
        }
    };

    // for commonjs
    if (typeof module !== 'undefined') {
        module.exports = LayoutManager;
    }

    // for browser
    if (typeof window !== 'undefined') {
        Brightics.VA.LayoutManager = LayoutManager;
    }

}).call(this);
