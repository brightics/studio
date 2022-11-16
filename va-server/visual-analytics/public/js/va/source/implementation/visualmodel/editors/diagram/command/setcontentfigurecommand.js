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
    function SetContentFigureCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetContentFigureCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetContentFigureCommand.prototype.constructor = SetContentFigureCommand;

    SetContentFigureCommand.prototype.canUndo = function () {
        return true;
    };

    SetContentFigureCommand.prototype.canRedo = function () {
        return true;
    };

    SetContentFigureCommand.prototype.execute = function () {
        this.old.figure = {
            size: this.options.content.size,
            position: this.options.content.position
        };
        this.options.content.size = this.options.figure.size;
        this.options.content.position = this.options.figure.position;
    };

    SetContentFigureCommand.prototype.undo = function () {
        this.options.content.size = this.old.figure.size;
        this.options.content.position = this.old.figure.position;
    };

    SetContentFigureCommand.prototype.redo = function () {
        this.execute();
    };

    SetContentFigureCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.setcontentfigurecommand';
    };

    SetContentFigureCommand.prototype.getLabel = function () {
        return 'Change a Content Figure';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentFigureCommand = SetContentFigureCommand;

}).call(this);