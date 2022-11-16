(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EditorTab(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};
        this.listeners = {};
        this.opened = [];
        this.maxTabCount = this.options.maxTabCount || 6;

        this.retrieveParent();
        this.createControls();
    }

    EditorTab.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    EditorTab.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-tools-menubar-editor-title-container">' +
            '   <ul>' +
            '       <li class="brtc-va-tools-menubar-editor-tab newmodel" title="'+Brightics.locale.common.openModelReport+'">' +
            '           <div class="brtc-va-tools-menubar-editor-title-new-button"></div>' +
            '       </li>' +
            '   </ul>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.createNewEditorButton(this.$mainControl.find('.brtc-va-tools-menubar-editor-tab.newmodel'));
    };

    EditorTab.prototype.createNewEditorButton = function ($element) {
        this.newEditorButton = $element;
        $element.on('click', this.handleNewEditorButtonClicked.bind(this));
    };

    EditorTab.prototype.showNewEditorButton = function () {
        this.newEditorButton.css('display', 'block');
    };

    EditorTab.prototype.hideNewEditorButton = function () {
        this.newEditorButton.css('display', 'none');
    };

    EditorTab.prototype.handleNewEditorButtonClicked = function () {
        Studio.getLayoutManager().showProjectViewerPopup();
    };

    EditorTab.prototype.openTab = function (editorInput) {
        var pid = this.getIdFromEditorInput(editorInput).pid;
        var fid = this.getIdFromEditorInput(editorInput).fid;

        var targetTabIndex = this.getTargetTabIndex(pid, fid);
        if (targetTabIndex > -1) {
            this.selectTabIndex(targetTabIndex);
        } else {
            if (this.isOverMaxTabCount()) {
                this.showErrorMessage();

                return false;
            } else {
                this.createTab(editorInput);
                this.selectTab(pid, fid);
            }
        }

        return true;
    };

    EditorTab.prototype.updateTab = function (editorInput) {
        var pid = this.getIdFromEditorInput(editorInput).pid;
        var fid = this.getIdFromEditorInput(editorInput).fid;

        var targetTabIndex = this.getTargetTabIndex(pid, fid);
        if (targetTabIndex > -1) {
            var $tabTemplate = this.$mainControl.find('li:eq(' + targetTabIndex + ')');
            this.setTabTemplateData($tabTemplate, editorInput);
        }
    };

    EditorTab.prototype.closeTab = function (editorInput) {
        var pid = this.getIdFromEditorInput(editorInput).pid;
        var fid = this.getIdFromEditorInput(editorInput).fid;

        var selectedIndex = this.getSelectedTabIndex();
        var targetTabIndex = this.getTargetTabIndex(pid, fid);
        if (targetTabIndex > -1) {
            this.closeTabIndex(targetTabIndex);

            if (selectedIndex === targetTabIndex && this.getOpenedTabs().length) {
                var nextIndex = (targetTabIndex === 0) ? (0) : (targetTabIndex - 1);
                this.selectTabIndex(nextIndex);
                return this.getEditorInputByIndex(nextIndex);
            }
        }
    };

    EditorTab.prototype.unselectAll = function () {
        this.$mainControl.find('li').removeClass('selected');
    };

    EditorTab.prototype.getSelectedTabIndex = function () {
        if (this.$mainControl.find('li.selected').length) {
            return this.$mainControl.find('li.selected').prevAll().length;
        } else {
            return -1;
        }
    };

    EditorTab.prototype.getOpenedTabs = function () {
        return this.opened;
    };

    EditorTab.prototype.getTargetTabIndex = function (pid, fid) {
        var index = -1;
        for (var i = 0; i < this.opened.length; i++) {
            if (this.opened[i].pid === pid && this.opened[i].fid === fid) {
                index = i;
                break;
            }
        }
        return index;
    };

    EditorTab.prototype.getEditorInputByIndex = function (index) {
        if (0 <= index && index < this.opened.length) {
            var pid = this.opened[index].pid;
            var fid = this.opened[index].fid;
            return this.getEditorInput(pid, fid);
        }
        return undefined;
    };

    EditorTab.prototype.selectTab = function (pid, fid) {
        for (var i = 0; i < this.opened.length; i++) {
            if (this.opened[i].pid === pid && this.opened[i].fid === fid) {
                this.selectTabIndex(i);
                break;
            }
        }
    };

    EditorTab.prototype.selectTabIndex = function (tabIndex) {
        this.$mainControl.find('li').removeClass('selected');
        if (tabIndex > -1) {
            this.$mainControl.find('li:eq(' + tabIndex + ')').addClass('selected');
        }
    };

    EditorTab.prototype.closeTabIndex = function (tabIndex) {
        if (tabIndex > -1) {
            this.opened.splice(tabIndex, 1);
            this.$mainControl.find('li:eq(' + tabIndex + ')').remove();
        }
    };

    EditorTab.prototype.isOverMaxTabCount = function () {
        return (this.opened.length >= this.maxTabCount);
    };

    EditorTab.prototype.showErrorMessage = function () {
        return Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog(
            'You can not open more than ' + this.maxTabCount + ' editors.');
    };

    EditorTab.prototype.createTab = function (editorInput) {
        var pid = this.getIdFromEditorInput(editorInput).pid;
        var fid = this.getIdFromEditorInput(editorInput).fid;

        this.opened.push({ pid: pid, fid: fid });
        this.createTabTemplate(editorInput);
    };

    EditorTab.prototype.createTabTemplate = function (editorInput) {
        var $template = $('' +
            '<li class="brtc-va-tools-menubar-editor-tab">' +
            '   <div class="brtc-va-tools-menubar-editor-title">' +
            '      <div class="brtc-va-tools-menubar-editor-title-icon"></div>' +
            '      <div class="brtc-va-tools-menubar-editor-title-text"></div>' +
            '   </div>' +
            '   <div class="brtc-va-tools-menubar-editor-close-button"></div>' +
            '</li>');
        this.$mainControl.find('.brtc-va-tools-menubar-editor-tab.newmodel').before($template);
        this.setTabTemplateData($template, editorInput);
        this.createTabCloseHandler($template.find('.brtc-va-tools-menubar-editor-close-button'));
        this.createTabClickHandler($template);
    };

    EditorTab.prototype.setTabTemplateData = function ($target, editorInput) {
        var pid = this.getIdFromEditorInput(editorInput).pid;
        var fid = this.getIdFromEditorInput(editorInput).fid;

        var label = editorInput.getLabel();
        var type = editorInput.getContents().type;

        $target.data({ 'pid': pid, 'fid': fid });
        $target.find('.brtc-va-tools-menubar-editor-title-icon').addClass(type);
        $target.find('.brtc-va-tools-menubar-editor-title-text').text(label);
        $target.attr('title', label);
    };

    EditorTab.prototype.createTabCloseHandler = function ($control) {
        $control.on('click', this.handleTabClosed.bind(this));
    };

    EditorTab.prototype.getTabTemplateFromEventTarget = function (event) {
        var $tabTemplate;
        if ($(event.target).hasClass('brtc-va-tools-menubar-editor-tab')) {
            $tabTemplate = $(event.target);
        } else {
            $tabTemplate = $(event.target).parents('.brtc-va-tools-menubar-editor-tab');
        }
        return $tabTemplate;
    };

    EditorTab.prototype.handleTabClosed = function (event) {
        var $tabTemplate = this.getTabTemplateFromEventTarget(event);
        var pid = $tabTemplate.data('pid');
        var fid = $tabTemplate.data('fid');

        // TODO 여기 해결 필요.
        Studio.getLayoutManager().closeEditor(this.getEditorInput(pid, fid));
        event.stopPropagation();
    };

    EditorTab.prototype.createTabClickHandler = function ($control) {
        $control.on('click', this.handleTabClicked.bind(this));
    };

    EditorTab.prototype.handleTabClicked = function (event) {
        var $tabTemplate = this.getTabTemplateFromEventTarget(event);
        var pid = $tabTemplate.data('pid');
        var fid = $tabTemplate.data('fid');

        // TODO 여기 해결 필요.
        Studio.getLayoutManager().openEditor(this.getEditorInput(pid, fid));
    };

    EditorTab.prototype.getIdFromEditorInput = function (editorInput) {
        return {
            pid: editorInput.getProjectId(),
            fid: editorInput.getFileId()
        };
    };

    EditorTab.prototype.getEditorInput = function (projectId, fileId) {
        return Studio.getResourceManager().getFile(projectId, fileId);
    };

    Brightics.VA.Core.Views.EditorTab = EditorTab;
}).call(this);
