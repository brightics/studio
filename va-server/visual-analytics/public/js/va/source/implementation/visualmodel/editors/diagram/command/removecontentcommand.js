/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function RemoveContentCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemoveContentCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveContentCommand.prototype.constructor = RemoveContentCommand;

    RemoveContentCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveContentCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveContentCommand.prototype.execute = function () {
        this.old.pageId = this.options.analyticsModel.getPageIdOfContent(this.options.contentId);
        this.old.pageIndex = this.options.analyticsModel.getPageIndex(this.old.pageId);
        this.old.content = this.options.analyticsModel.removeContent(this.options.contentId);
    };

    RemoveContentCommand.prototype.undo = function () {
        this.options.analyticsModel.addContentToSpecificPage(this.old.content, this.old.pageId);
    };

    RemoveContentCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveContentCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.removecontentcommand';
    };

    RemoveContentCommand.prototype.getLabel = function () {
        return 'Remove a Page';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveContentCommand = RemoveContentCommand;

}).call(this);