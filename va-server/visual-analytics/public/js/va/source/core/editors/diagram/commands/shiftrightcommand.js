/**
 * Created by daewon.park on 2016-03-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      fid : ''
     * }
     * @param options
     * @constructor
     */
    function ShiftRightCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.changed = [];
        this.old = {};
    }

    ShiftRightCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ShiftRightCommand.prototype.constructor = ShiftRightCommand;

    ShiftRightCommand.prototype.canUndo = function () {
        return true;
    };

    ShiftRightCommand.prototype.canRedo = function () {
        return true;
    };

    ShiftRightCommand.prototype.execute = function () {
        this.old = {};
        this.options.changed = [];

        var fnUnit = this.options.analyticsModel.getFnUnitById(this.options.fid);
        this.shiftRight(fnUnit);
        this.options.changed.reverse();
    };

    ShiftRightCommand.prototype.shiftRight = function (fnUnit) {
        if (this.old[fnUnit.fid]) {
            // do nothing
        } else {
            var i, next;

            this.options.changed.push(fnUnit.fid);
            this.old[fnUnit.fid] = {
                x: fnUnit.display.diagram.position.x,
                y: fnUnit.display.diagram.position.y
            };
            fnUnit.display.diagram.position.x += Brightics.VA.Env.Diagram.FIGURE_WIDTH + Brightics.VA.Env.Diagram.GAP_WIDTH;

            for (i in this.options.analyticsModel.functions) {
                next = this.options.analyticsModel.functions[i];
                if (next.display.diagram.position.x == fnUnit.display.diagram.position.x &&
                    next.display.diagram.position.y == fnUnit.display.diagram.position.y) {
                    this.shiftRight(next);
                }
            }

            var nextIds = this.options.analyticsModel.getNext(fnUnit.fid);
            for (i in nextIds) {
                next = this.options.analyticsModel.getFnUnitById(nextIds[i]);
                if (next.display.diagram.position.x == fnUnit.display.diagram.position.x) {
                    this.shiftRight(next);
                }
            }
        }
    };

    ShiftRightCommand.prototype.undo = function () {
        for (var fid in this.old) {
            var fnUnit = this.options.analyticsModel.getFnUnitById(fid);
            fnUnit.display.diagram.position.x = this.old[fid].x;
            fnUnit.display.diagram.position.y = this.old[fid].y;
        }
    };

    ShiftRightCommand.prototype.redo = function () {
        this.execute();
    };

    ShiftRightCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.shiftrightcommand';
    };

    ShiftRightCommand.prototype.getLabel = function () {
        return 'Shift Right';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ShiftRightCommand = ShiftRightCommand;

}).call(this);