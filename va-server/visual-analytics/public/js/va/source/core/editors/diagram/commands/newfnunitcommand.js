/**
 * Created by ty_tree.kim on 2016-02-11.
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
    function NewFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Create a Function';
    }

    NewFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewFnUnitCommand.prototype.constructor = NewFnUnitCommand;

    NewFnUnitCommand.prototype.execute = function () {
        this.options.analyticsModel.addFnUnit(this.options.fnUnit);
    };

    NewFnUnitCommand.prototype.undo = function () {
        this.options.analyticsModel.removeFnUnit(this.options.fnUnit.fid);
    };

    NewFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.newfnunitcommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.NewFnUnitCommand = NewFnUnitCommand;

}).call(this);