/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AppendUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    AppendUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    AppendUnitCommand.prototype.constructor = AppendUnitCommand;

    AppendUnitCommand.prototype.execute = function () {
        var newFunctions = this.options.newParent.param ? this.options.newParent.param.functions : this.options.newParent.functions;
        var oldFunctions = this.options.oldParent.param ? this.options.oldParent.param.functions : this.options.oldParent.functions;

        this.options.oldIndex = oldFunctions.indexOf(this.options.unit);
        oldFunctions.splice(this.options.oldIndex, 1);

        if (this.options.newIndex !== -1) {
            newFunctions.splice(this.options.newIndex, 0, this.options.unit);
        } else {
            newFunctions.push(this.options.unit);
            this.options.newIndex = newFunctions.indexOf(this.options.unit);
        }
    };

    AppendUnitCommand.prototype.undo = function () {
        var newFunctions = this.options.newParent.param ? this.options.newParent.param.functions : this.options.newParent.functions;
        var oldFunctions = this.options.oldParent.param ? this.options.oldParent.param.functions : this.options.oldParent.functions;

        newFunctions.splice(this.options.newIndex, 1);
        oldFunctions.splice(this.options.oldIndex, 0, this.options.unit);
    };

    AppendUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.appendunitcommand';
    };

    AppendUnitCommand.prototype.getLabel = function () {
        return 'Move Unit';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.AppendUnitCommand = AppendUnitCommand;

}).call(this);