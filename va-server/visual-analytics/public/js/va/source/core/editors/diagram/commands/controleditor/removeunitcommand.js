/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RemoveUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemoveUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveUnitCommand.prototype.constructor = RemoveUnitCommand;

    RemoveUnitCommand.prototype.execute = function () {
        var functions = this.options.parent.param ? this.options.parent.param.functions : this.options.parent.functions;

        this.options.index = -1;
        for (var i in functions) {
            var func = functions[i];
            if (func.fid == this.options.unit.fid) {
                this.options.index = i;
            }
        }
        functions.splice(this.options.index, 1);
    };

    RemoveUnitCommand.prototype.undo = function () {
        var functions = this.options.parent.param ? this.options.parent.param.functions : this.options.parent.functions;

        functions.splice(this.options.index, 0, this.options.unit);
    };

    RemoveUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.removeunitcommand';
    };

    RemoveUnitCommand.prototype.getLabel = function () {
        return 'Remove Unit';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.RemoveUnitCommand = RemoveUnitCommand;

}).call(this);