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
    function BindVariableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    BindVariableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    BindVariableCommand.prototype.constructor = BindVariableCommand;

    BindVariableCommand.prototype.canUndo = function () {
        return true;
    };

    BindVariableCommand.prototype.canRedo = function () {
        return true;
    };

    BindVariableCommand.prototype.execute = function () {
        var variable = this.getMainModel().getVariable(this.options.fid, this.options.paramKey);
        if (variable) {
            this.old.variable = variable;
            this.getMainModel().setVariable(this.options.fid, this.options.paramKey, this.options.variable);
        }
        else this.getMainModel().addVariable(this.options.fid, this.options.paramKey, this.options.variable);
    };

    BindVariableCommand.prototype.undo = function () {
        if (this.old.variable) this.getMainModel().setVariable(this.options.fid, this.options.paramKey, this.old.variable);
        else this.getMainModel().removeVariable(this.options.fid, this.options.paramKey);
    };

    BindVariableCommand.prototype.redo = function () {
        this.execute();
    };

    BindVariableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.bindvariablecommand';
    };

    BindVariableCommand.prototype.getLabel = function () {
        return 'Bind Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.BindVariableCommand = BindVariableCommand;

}).call(this);