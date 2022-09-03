/**
 * Created by sungjin1.kim on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VisualEditor(parentId, options) {
        Brightics.VA.Core.Editors.Editor.call(this, parentId, options);

        this.registerCommandCallback();
        this.registerResourceChangedListener();
    }

    VisualEditor.prototype = Object.create(Brightics.VA.Core.Editors.Editor.prototype);
    VisualEditor.prototype.constructor = VisualEditor;

    VisualEditor.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-visualeditor brtc-va-editor brtc-style-editor">' +
            '   <div class="brtc-style-editor-toolbar-area brtc-style-s-editor-toolbar-area" />' +
            '   <div class="brtc-va-editors-side-tab-bar brtc-va-editors-left-tab-bar" />' +
            '   <div class="brtc-va-editors-side-tab-bar brtc-va-editors-right-tab-bar" />' +
            '   <div class="brtc-style-editor-diagram-area" />' +
            '   <div class="brtc-va-editors-visualeditor-notification-container" />' +
            '   <div class="brtc-va-editors-visualeditor-notification">' +
            '       <div class="brtc-va-editors-visualeditor-notification-content" />' +
            '   </div>' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);
        Brightics.VA.Core.Utils.WidgetUtils.putEditorRef(this.$mainControl, this);

        this.createToolbar();
        this.createDiagramEditorPage();
        this.createEditorLayoutManager();
        this.createNotification();
    };

    VisualEditor.prototype.createNotification = function () {
        var $notificationContainer = this.$mainControl.children(".brtc-va-editors-visualeditor-notification-container");
        this.$notification = this.$mainControl.children(".brtc-va-editors-visualeditor-notification");
        this.$notification.jqxNotification({
            theme: Brightics.VA.Env.Theme,
            appendContainer: $notificationContainer,
            autoOpen: false, animationOpenDelay: 800,
            autoClose: true, autoCloseDelay: 3000,
            template: "info"
        });
    };

    VisualEditor.prototype.notification = function (template, message) {
        this.$mainControl.children(".brtc-va-editors-visualeditor-notification-container").html('');
        var $notificationContent = this.$notification.find(".brtc-va-editors-visualeditor-notification-content");
        $notificationContent.html(message);
        this.$notification.jqxNotification({template: template});
        this.$notification.jqxNotification("open");
    };

    VisualEditor.prototype.registerResourceChangedListener = function () {
        this.onResourceChanged = function (event, eventData) {
            if (eventData.resource.id == this.options.editorInput.id) {
                // var contents = eventData.resource.contents;
                this.options.editorInput = $.extend(true, this.options.editorInput, eventData.resource);
            }
        };
        Studio.getInstance().addResourceChangedListener(this.onResourceChanged.bind(this));
    };

    VisualEditor.prototype.destroy = function () {
        if (this.diagramEditorPage) this.diagramEditorPage.destroy();
        Studio.getInstance().removeResourceChangedListener(this.onResourceChanged);
    };

    VisualEditor.prototype.createPageToolbar = function ($parent) {
        this.$pageToolbar = $('' +
            '<div class="brtc-va-editors-visualeditor-toolbar brtc-style-editors-toolbar brtc-style-position-center">' +
            '</div>');
        $parent.append(this.$pageToolbar);
    };

    VisualEditor.prototype.onActivated = function () {
        this.diagramEditorPage.onActivated();
        this.sideBarManager.onActivated();
    };
    VisualEditor.prototype.createDiagramEditorPage = function () {
        this.diagramEditorPage = new Brightics.VA.Implementation.Visual.Editors.Diagram.EditorPage(this.$mainControl.find('.brtc-style-editor-diagram-area'), {
            width: '100%',
            height: '100%',
            editor: this
        });
    };

    VisualEditor.prototype.getPageContainer = function () {
        return this.diagramEditorPage;
    };

    VisualEditor.prototype.getModel = function () {
        return this.options.editorInput.getContents();
    };

    VisualEditor.prototype.getPage = function (pageId) {
        return this.diagramEditorPage.controls[pageId];
    };

    VisualEditor.prototype.getPages = function () {
        return this.diagramEditorPage.controls;
    };

    VisualEditor.prototype.getVisualEditorContent = function (contentId) {
        for (var pageId in this.diagramEditorPage.controls) {
            var page = this.diagramEditorPage.controls[pageId];
            for (var i in page.contentList) {
                var content = this.diagramEditorPage.controls[pageId].contentList[i];
                if (content.contentId === contentId) {
                    return content
                }
            }
        }
    };

    VisualEditor.prototype.getContentOutlineStatus = function () {
        if (typeof this.contentOutlineStatus === 'undefined')
            this.contentOutlineStatus = true;
        return this.contentOutlineStatus;
    };

    VisualEditor.prototype.showContentOutline = function () {
        this.contentOutlineStatus = true;
        this.diagramEditorPage.changeContentOutline(true);
    };

    VisualEditor.prototype.hideContentOutline = function () {
        this.contentOutlineStatus = false;
        this.diagramEditorPage.changeContentOutline(false);
    };

    VisualEditor.prototype.getDiagramEditorPage = function () {
        return this.diagramEditorPage;
    };

    VisualEditor.prototype.createEditorLayoutManager = function () {
        this.editorLayoutManager = new Brightics.VA.Core.Tools.Manager.EditorLayoutManager(this.$mainControl.find('.brtc-style-editor-visualeditorpage'));
    };

    VisualEditor.prototype.getMainArea = function () {
        return this.$mainControl;
    };

    VisualEditor.prototype.getHeaderArea = function () {
        return this.$mainControl.find('.brtc-va-editors-visualeditor-header');
    };

    VisualEditor.prototype.getLeftTabBarArea = function () {
        return this.$mainControl.find('.brtc-va-editors-left-tab-bar');
    };

    VisualEditor.prototype.getRightTabBarArea = function () {
        return this.$mainControl.find('.brtc-va-editors-right-tab-bar');
    };

    VisualEditor.prototype.getSelectedObjects = function () {
        return this.diagramEditorPage.getSelectedObjects();
    };

    VisualEditor.prototype.pasteObjects = function (objects) {
        return this.diagramEditorPage.pasteObjects(objects);
    };

    VisualEditor.prototype.removeObjects = function (objects) {
        return this.diagramEditorPage.removeObjects(objects);
    };

    VisualEditor.prototype.handleSelectionChanged = function (selection) {
        this.toolbar.handleOnSelectionChanged(selection);
    };

    VisualEditor.prototype.handleOnCopy = function () {
        this.toolbar.handleOnCopy();
    };

    Brightics.VA.Implementation.Visual.Editor = VisualEditor;

}).call(this);
