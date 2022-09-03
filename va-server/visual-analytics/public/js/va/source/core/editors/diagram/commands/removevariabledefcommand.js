/**
 * Created by sungjin1.kim on 2016-04-24.
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
    function RemoveVariableDefCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemoveVariableDefCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveVariableDefCommand.prototype.constructor = RemoveVariableDefCommand;

    RemoveVariableDefCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveVariableDefCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveVariableDefCommand.prototype.execute = function () {
        var analyticsModel = this.getMainModel();
        this.options.old = analyticsModel.variables[this.options.name];
        analyticsModel.removeVariableDef(this.options.name);
    };

    RemoveVariableDefCommand.prototype.undo = function () {
        var analyticsModel = this.getMainModel();
        analyticsModel.addVariableDef(this.options.name, this.options.old);
    };

    RemoveVariableDefCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveVariableDefCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.removevariabledefcommand';
    };

    RemoveVariableDefCommand.prototype.getLabel = function () {
        return 'Remove Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RemoveVariableDefCommand = RemoveVariableDefCommand;

}).call(this);