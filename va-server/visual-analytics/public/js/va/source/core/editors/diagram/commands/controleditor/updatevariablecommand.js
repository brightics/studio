/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpdateVariableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    UpdateVariableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UpdateVariableCommand.prototype.constructor = UpdateVariableCommand;

    UpdateVariableCommand.prototype.execute = function () {
        this.old.index = this.options.analyticsModel.variables.indexOf(this.options.variable);
        this.old.variable = $.extend(true, {}, this.options.analyticsModel.variables[this.old.index]);

        var originType = this.options.analyticsModel.variables[this.old.index].type;
        var changedType = this.options.ref.type || this.options.analyticsModel.variables[this.old.index].type;
        if (originType !== changedType) {
            if (originType === 'array') {
                if (changedType === 'number') {
                    this.options.ref.value = "";
                } else {
                    this.options.ref.value = String(this.options.analyticsModel.variables[this.old.index].value[0]);
                }
            } else if (changedType === 'number') {
                this.options.ref.value = "";
            } else if (changedType === 'array') {
                this.options.ref.value = [this.options.analyticsModel.variables[this.old.index].value];
            }
        }

        this.options.analyticsModel.variables[this.old.index].name = this.options.ref.name || this.old.variable.name;
        this.options.analyticsModel.variables[this.old.index].type = this.options.ref.type || this.old.variable.type;
        this.options.analyticsModel.variables[this.old.index].value = this.options.ref.value !== '' ? this.options.ref.value || this.old.variable.value : this.options.ref.value;
    };

    UpdateVariableCommand.prototype.undo = function () {
        this.options.analyticsModel.variables[this.old.index].name = this.old.variable.name;
        this.options.analyticsModel.variables[this.old.index].type = this.old.variable.type;
        this.options.analyticsModel.variables[this.old.index].value = this.old.variable.value;
    };

    UpdateVariableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.updatevariablecommand';
    };

    UpdateVariableCommand.prototype.getLabel = function () {
        return 'Update Control Flow Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.UpdateVariableCommand = UpdateVariableCommand;

}).call(this);