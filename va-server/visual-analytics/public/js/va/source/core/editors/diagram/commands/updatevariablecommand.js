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
    function UpdateVariableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    UpdateVariableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UpdateVariableCommand.prototype.constructor = UpdateVariableCommand;

    UpdateVariableCommand.prototype.canUndo = function () {
        return true;
    };

    UpdateVariableCommand.prototype.canRedo = function () {
        return true;
    };

    UpdateVariableCommand.prototype.execute = function () {
        this.options.old = this.getMainModel().getVariable(this.options.fid, this.options.paramKey);
        this.getMainModel().setVariable(this.options.fid, this.options.paramKey, this.options.ref);
    };

    UpdateVariableCommand.prototype.undo = function () {
        this.getMainModel().setVariable(this.options.fid, this.options.paramKey, this.options.old);
    };

    UpdateVariableCommand.prototype.redo = function () {
        this.execute();
    };

    UpdateVariableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.updatevariablecommand';
    };

    UpdateVariableCommand.prototype.getLabel = function () {
        return 'Update Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.UpdateVariableCommand = UpdateVariableCommand;

}).call(this);