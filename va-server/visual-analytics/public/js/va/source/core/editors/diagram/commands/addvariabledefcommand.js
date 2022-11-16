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
    function AddVariableDefCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    AddVariableDefCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    AddVariableDefCommand.prototype.constructor = AddVariableDefCommand;

    AddVariableDefCommand.prototype.canUndo = function () {
        return true;
    };

    AddVariableDefCommand.prototype.canRedo = function () {
        return true;
    };

    AddVariableDefCommand.prototype.execute = function () {
        var analyticsModel = this.getMainModel();
        analyticsModel.addVariableDef(this.options.name, this.options.ref);
    };

    AddVariableDefCommand.prototype.undo = function () {
        var analyticsModel = this.getMainModel();
        analyticsModel.removeVariableDef(this.options.name);
    };

    AddVariableDefCommand.prototype.redo = function () {
        this.execute();
    };

    AddVariableDefCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.addvariabledefcommand';
    };

    AddVariableDefCommand.prototype.getLabel = function () {
        return 'Add Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.AddVariableDefCommand = AddVariableDefCommand;

}).call(this);