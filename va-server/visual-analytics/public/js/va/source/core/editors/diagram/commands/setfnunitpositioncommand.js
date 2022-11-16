/**
 * Created by daewon.park on 2016-03-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      fid : '',
     *      position : {
     *          x: 0,
     *          y: 0
     *      }
     * }
     *
     * @param options
     * @constructor
     */
    function SetFnUnitPositionCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    SetFnUnitPositionCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetFnUnitPositionCommand.prototype.constructor = SetFnUnitPositionCommand;

    SetFnUnitPositionCommand.prototype.canUndo = function () {
        return true;
    };

    SetFnUnitPositionCommand.prototype.canRedo = function () {
        return true;
    };

    SetFnUnitPositionCommand.prototype.execute = function () {
        var fnUnit = this.options.analyticsModel.getFnUnitById(this.options.fid);

        this.old.position = {
            x : fnUnit.display.diagram.position.x,
            y : fnUnit.display.diagram.position.y
        };

        fnUnit.display.diagram.position.x = this.options.position.x;
        fnUnit.display.diagram.position.y = this.options.position.y;
    };

    SetFnUnitPositionCommand.prototype.undo = function () {
        var fnUnit = this.options.analyticsModel.getFnUnitById(this.options.fid);

        fnUnit.display.diagram.position.x = this.old.position.x;
        fnUnit.display.diagram.position.y = this.old.position.y;
    };

    SetFnUnitPositionCommand.prototype.redo = function () {
        this.execute();
    };

    SetFnUnitPositionCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setfnunitpositioncommand';
    };

    SetFnUnitPositionCommand.prototype.getLabel = function () {
        return 'Change Position';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitPositionCommand = SetFnUnitPositionCommand;

}).call(this);