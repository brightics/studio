/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RemoveVariableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemoveVariableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveVariableCommand.prototype.constructor = RemoveVariableCommand;

    RemoveVariableCommand.prototype.execute = function () {
        this.old.index = this.options.analyticsModel.variables.indexOf(this.options.variable);
        this.options.analyticsModel.variables.splice(this.old.index, 1);
    };

    RemoveVariableCommand.prototype.undo = function () {
        this.options.analyticsModel.variables.splice(this.old.index, 0, this.options.variable);
    };

    RemoveVariableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.removevariablecommand';
    };

    RemoveVariableCommand.prototype.getLabel = function () {
        return 'Remove Control Flow Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.RemoveVariableCommand = RemoveVariableCommand;

}).call(this);