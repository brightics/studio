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
    function SetContentStyleCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetContentStyleCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetContentStyleCommand.prototype.constructor = SetContentStyleCommand;

    SetContentStyleCommand.prototype.canUndo = function () {
        return true;
    };

    SetContentStyleCommand.prototype.canRedo = function () {
        return true;
    };

    SetContentStyleCommand.prototype.execute = function () {
        var content = this.options.content;
        var id = content.id;
        var targetContent = this.options.analyticsModel.getContent(id);

        this.old.style = content.style || {};
        targetContent.style = this.options.changedStyle;
    };

    SetContentStyleCommand.prototype.undo = function () {
        var content = this.options.content;
        var id = content.id;
        var targetContent = this.options.analyticsModel.getContent(id);

        targetContent.style = this.old.style;
    };

    SetContentStyleCommand.prototype.redo = function () {
        this.execute();
    };

    SetContentStyleCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.setcontentstylecommand';
    };

    SetContentStyleCommand.prototype.getLabel = function () {
        return 'Update a Content Style';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentStyleCommand = SetContentStyleCommand;

}).call(this);