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
    function RemovePageCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemovePageCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemovePageCommand.prototype.constructor = RemovePageCommand;

    RemovePageCommand.prototype.canUndo = function () {
        return true;
    };

    RemovePageCommand.prototype.canRedo = function () {
        return true;
    };

    RemovePageCommand.prototype.execute = function () {
        this.old.pageIndex = this.options.analyticsModel.getPageIndex(this.options.pageId);
        this.old.page = this.options.analyticsModel.removePage(this.options.pageId);
    };

    RemovePageCommand.prototype.undo = function () {
        this.options.analyticsModel.addPage(this.old.page, this.old.pageIndex);
    };

    RemovePageCommand.prototype.redo = function () {
        this.execute();
    };

    RemovePageCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.removepagecommand';
    };

    RemovePageCommand.prototype.getLabel = function () {
        return 'Remove a Page';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemovePageCommand = RemovePageCommand;

}).call(this);