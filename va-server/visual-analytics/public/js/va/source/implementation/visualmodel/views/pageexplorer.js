/**
 * Created by ng1123.kim on 2016-05-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PageExplorer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();

        this.init();
    }

    PageExplorer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    PageExplorer.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-views-pageexplorer brtc-style-tab-contents">' +
            '   <div class="brtc-va-views-pageexplorer-area brtc-style-tab-contents-area"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.pageListViewer = new Brightics.VA.Implementation.Visual.Views.PageListViewer(
            this.$mainControl.find('.brtc-va-views-pageexplorer-area'),
            {pageExplorer: this}
        );
    };

    PageExplorer.prototype.init = function () {
        var _this = this;
        this.commandListener = function (command) {
            _this.handleCommand(command);
        };

        this.resourceManager = Studio.getResourceManager();
    };

    PageExplorer.prototype.destroy = function () {

    };

    PageExplorer.prototype.editorChanged = function (editor) {
        if (editor) {
            if (this.activeEditor) {
                this.activeEditor.removeCommandListener(this.commandListener);
                this.activeEditor.removeGoHistoryListener(this.commandListener);
            }
            this.activeEditor = editor;

            this.activeEditor.addCommandListener(this.commandListener);
            this.activeEditor.addGoHistoryListener(this.commandListener);

            var editorInput = editor.options.editorInput;
            this.pageListViewer.setSource(editorInput.getContents().getPages());
        }
        else {
            this.activeEditor = null;
        }
    };

    PageExplorer.prototype.handleCommand = function (command) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand) {
            for (var i in command.options.commands) {
                this.handleCommand(command.options.commands[i]);
            }
        }
        else if (command instanceof Brightics.VA.Core.CompoundCommand) this.handleCompoundCommand(command);
        else if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewPageCommand) this.handleNewPageCommand(command);
        else if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemovePageCommand) this.handleRemovePageCommand(command);
    };

    PageExplorer.prototype.handleCompoundCommand = function (command) {
        var i;
        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            for (i in command.commandList) {
                this.handleCommand(command.commandList[i]);
            }
        } else if (command.event.type == 'UNDO') {
            for (i = command.commandList.length - 1; i > -1; i--) {
                this.handleCommand(command.commandList[i]);
            }
        }
    };

    PageExplorer.prototype.handleNewPageCommand = function (command) {
        if (command.event.type === 'REDO' || command.event.type == 'EXECUTE') {
            //this.pageListViewer.addPage(command.options.page, command.options.pageIndex);
        } else if (command.event.type === 'UNDO') {
            //this.pageListViewer.removePage(command.options.page.id);
        }

        this.pageListViewer.setSource(command.options.analyticsModel.getPages());
    };

    PageExplorer.prototype.handleRemovePageCommand = function (command) {
        if (command.event.type === 'REDO' || command.event.type == 'EXECUTE') {
            //this.pageListViewer.removePage(command.options.pageId);
        } else if (command.event.type === 'UNDO') {
            //this.pageListViewer.addPage(command.old.page, command.old.pageIndex);
        }
        this.pageListViewer.setSource(command.options.analyticsModel.getPages());
    };

    Brightics.VA.Implementation.Visual.Views.PageExplorer = PageExplorer;

}).call(this);