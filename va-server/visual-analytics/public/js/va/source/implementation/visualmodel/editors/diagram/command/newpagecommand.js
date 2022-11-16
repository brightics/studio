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
    function NewPageCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    NewPageCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewPageCommand.prototype.constructor = NewPageCommand;

    NewPageCommand.prototype.canUndo = function () {
        return true;
    };

    NewPageCommand.prototype.canRedo = function () {
        return true;
    };

    NewPageCommand.prototype.execute = function () {
        this.options.pageIndex = (this.options.pageIndex) ? (Number(this.options.pageIndex)) : (undefined);
        this.options.analyticsModel.addPage(this.options.page, this.options.pageIndex);
    };

    NewPageCommand.prototype.undo = function () {
        this.options.analyticsModel.removePage(this.options.page.id);
    };

    NewPageCommand.prototype.redo = function () {
        this.execute();
    };

    NewPageCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.newpagecommand';
    };

    NewPageCommand.prototype.getLabel = function () {
        return 'Create a Page';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewPageCommand = NewPageCommand;

}).call(this);