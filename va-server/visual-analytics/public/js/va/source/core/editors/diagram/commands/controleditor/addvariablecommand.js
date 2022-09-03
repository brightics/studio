/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AddVariableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    AddVariableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    AddVariableCommand.prototype.constructor = AddVariableCommand;

    AddVariableCommand.prototype.execute = function () {
        // this.old.variables = JSON.parse(JSON.stringify(this.options.analyticsModel.variables));
        this.options.analyticsModel.variables.push(this.options.variable);
    };

    AddVariableCommand.prototype.undo = function () {
        // this.options.analyticsModel.variables = JSON.parse(JSON.stringify(this.old.variables));
        this.options.analyticsModel.variables.splice(this.options.analyticsModel.variables.length - 1, 1);
    };

    AddVariableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.addvariablecommand';
    };

    AddVariableCommand.prototype.getLabel = function () {
        return 'Add Control Flow Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.AddVariableCommand = AddVariableCommand;

}).call(this);