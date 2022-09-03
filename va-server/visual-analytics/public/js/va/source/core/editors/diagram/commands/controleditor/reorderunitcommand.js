/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ReorderUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    ReorderUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ReorderUnitCommand.prototype.constructor = ReorderUnitCommand;

    ReorderUnitCommand.prototype.execute = function () {
        var functions = this.options.parent.param.functions;
        this.options.oldIndex = functions.indexOf(this.options.unit);
        functions.splice(this.options.newIndex, 0, functions.splice(this.options.oldIndex, 1)[0]);
    };

    ReorderUnitCommand.prototype.undo = function () {
        var functions = this.options.parent.param.functions;
        functions.splice(this.options.oldIndex, 0, functions.splice(this.options.newIndex, 1)[0]);
    };

    ReorderUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.reorderunitcommand';
    };

    ReorderUnitCommand.prototype.getLabel = function () {
        return 'Reorder Unit';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.ReorderUnitCommand = ReorderUnitCommand;

}).call(this);