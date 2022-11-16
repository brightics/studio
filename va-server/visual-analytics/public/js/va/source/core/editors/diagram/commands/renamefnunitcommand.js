/**
 * Created by daewon.park on 2016-03-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      fid : '',
     *      name : ''
     * }
     * @param options
     * @constructor
     */
    function RenameFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || Brightics.locale.common.editFunction;
    }

    RenameFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RenameFnUnitCommand.prototype.constructor = RenameFnUnitCommand;

    RenameFnUnitCommand.prototype.execute = function () {
        var fnUnit = this.options.analyticsModel.getFnUnitById(this.options.fid);
        this.old.name = fnUnit.display.label;
        this.old.description = fnUnit.display.description;
        fnUnit.display.label = this.options.name;
        fnUnit.display.description = this.options.description;
    };

    RenameFnUnitCommand.prototype.undo = function () {
        var fnUnit = this.options.analyticsModel.getFnUnitById(this.options.fid);
        fnUnit.display.label = this.old.name;
        fnUnit.display.description = this.old.description || '';
    };

    RenameFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.renamefnunitcommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand = RenameFnUnitCommand;

}).call(this);