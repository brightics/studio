/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EditorContainer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
        this.registerDebugListener();
    }

    EditorContainer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    EditorContainer.prototype.registerDebugListener = function () {
        var _this = this;
        Studio.getInstance().addDebugListener(function (event, eventData) {
            var clazz = eventData.launchOptions.clazz;

            if (eventData.eventType == 'BEGIN-JOB') {
                var LaunchProgressDialog = 
                Brightics.VA.Core.Interface.LauncherDialog[clazz] || Brightics.VA.Core.Dialogs.LaunchProgressDialog;
                
                _this.launchProgressDialog = new LaunchProgressDialog(_this.$mainControl, {
                    jobId: eventData.launchOptions.runnable.jid,
                    close: function (event) {
                        _this.launchProgressDialog = null;
                    },
                    title: Brightics.locale.common.runProgress
                });
            }

            var editor = _this.getActiveModelEditor();

            if (_this.launchProgressDialog) {
                _this.launchProgressDialog.progress(eventData);
                //if (editor) editor.debug(eventData);
            }

            if (clazz === 'deeplearning') {
                if (editor.dialog && editor.dialog['run']) {
                    editor.dialog['run'].progress(eventData);
                }
            }
        });
    };

    EditorContainer.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('<div class="brtc-va-editors-editorcontainer"></div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });

        this.$parent.append(this.$mainControl);
    };

    EditorContainer.prototype.closeEditor = function (editorInput) {
        var $editors = this.$mainControl.find('.brtc-va-editor-wrapper');
        for (var i = 0; i < $editors.length; i++) {
            var editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef($editors.eq(i).children());
            if (editor.options.editorInput.getFileId() == editorInput.getFileId()) {
                if (editor.$ctxMenu) editor.$ctxMenu.jqxMenu('destroy');
                if (editor.sideBarManager) editor.sideBarManager.destroy();
                editor.destroy();
                $editors.eq(i).remove();
                return;
            }
        }
    };

    EditorContainer.prototype.openEditor = function (editorInput) {
        var _this = this;
        var $menubarCenter = $('.brtc-va-studio-top-area').find('.brtc-va-tools-menubar-center-area');
        if($menubarCenter.find('.brtc-va-tools-menubar-editor-tab.newmodel').css('display') == 'none'){
            $menubarCenter.find('.brtc-va-tools-menubar-editor-tab.newmodel').css('display', 'block');
        }

        var $editors = this.$mainControl.find('.brtc-va-editor-wrapper');
        var editor;
        for (var i = 0; i < $editors.length; i++) {
            editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef($editors.eq(i).children());
            if (editor.options.editorInput.getFileId() == editorInput.getFileId()) {
                $editors.removeClass('selected');
                $editors.eq(i).addClass('selected');
                $editors.eq(i).trigger('selected');
                return editor;
            }
        }

        var $content = $('<div class="brtc-va-editor-wrapper"></div>');

        $editors.removeClass('selected');
        $content.addClass('selected');

        this.$mainControl.append($content);

        var clazz = editorInput.getContents().type || 'data';
        var Editor = Brightics.VA.Core.Interface.Editor[clazz];

        editor = new Editor($content, {
            width: '100%',
            height: '100%',
            editorInput: editorInput,
            clazz: clazz
        });

        $content.on('selected', function () {
            var editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef($content.children());
            if (editor && editor.onActivated) {
                editor.onActivated();
            }
        });

        Studio.getInstance().doValidate(editorInput.getContents());
        return editor;
    };

    EditorContainer.prototype.getActiveModelEditor = function () {
        var $activeEditor = this.$mainControl.find('.brtc-va-editor-wrapper.selected').children();
        return Brightics.VA.Core.Utils.WidgetUtils.getEditorRef($activeEditor);
    };

    EditorContainer.prototype.getEditors = function () {
        var editors = [];
        var $editors = this.$mainControl.find('.brtc-va-editor-wrapper');
        for (var i = 0; i < $editors.length; i++) {
            var editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef($editors.eq(i).children());
            editors.push(editor);
        }
        return editors;
    };

    EditorContainer.prototype.findEditorsByProjectId = function (projectId) {
        var editors = [];
        var $editors = this.$mainControl.find('.brtc-va-editor-wrapper');
        for (var i = 0; i < $editors.length; i++) {
            var editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef($editors.eq(i).children());
            if (editor.options.editorInput.getProjectId() == projectId) {
                editors.push(editor);
            }
        }
        return editors;
    };

    EditorContainer.prototype.findEditorById = function (projectId, fileId) {
        var $editors = this.$mainControl.find('.brtc-va-editor-wrapper');
        for (var i = 0; i < $editors.length; i++) {
            var editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef($editors.eq(i).children());
            if (editor.options.editorInput.getProjectId() == projectId &&
                    editor.options.editorInput.getFileId() == fileId) {
                return editor;
            }
        }
    };

    Brightics.VA.Core.Editors.EditorContainer = EditorContainer;

}).call(this);