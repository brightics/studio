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
    function ShiftLeftCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.changed = [];
        this.old = {};
    }

    ShiftLeftCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ShiftLeftCommand.prototype.constructor = ShiftLeftCommand;

    ShiftLeftCommand.prototype.canUndo = function () {
        return true;
    };

    ShiftLeftCommand.prototype.canRedo = function () {
        return true;
    };

    ShiftLeftCommand.prototype.execute = function () {
        this.old = {};
        this.options.changed = [];

        var fnUnit = this.options.analyticsModel.getFnUnitById(this.options.fid);
        if (this.shiftLeft(fnUnit) === false) {
            this.old = {};
            this.options.changed = [];

            return false;
        }
    };

    ShiftLeftCommand.prototype.canShift = function (fnUnit) {
        var i;
        for (i in this.options.analyticsModel.functions) {
            var fn = this.options.analyticsModel.functions[i];
            if (fn.fid != fnUnit.fid &&
                fn.display.diagram.position.x == fnUnit.display.diagram.position.x - (Brightics.VA.Env.Diagram.FIGURE_WIDTH + Brightics.VA.Env.Diagram.GAP_WIDTH) &&
                fn.display.diagram.position.y == fnUnit.display.diagram.position.y) {
                return false;
            }
        }

        var prevIds = this.options.analyticsModel.getPrevious(fnUnit.fid);
        for (i in prevIds) {
            var prev = this.options.analyticsModel.getFnUnitById(prevIds[i]);
            if (prev.display.diagram.position.x == fnUnit.display.diagram.position.x - (Brightics.VA.Env.Diagram.FIGURE_WIDTH + Brightics.VA.Env.Diagram.GAP_WIDTH)) {
                return false;
            }
        }

        return true;
    };

    ShiftLeftCommand.prototype.shiftLeft = function (fnUnit) {
        if (this.old[fnUnit.fid]) {
            // do nothing
        } else {
            if (fnUnit.display.diagram.position.x - (Brightics.VA.Env.Diagram.FIGURE_WIDTH + Brightics.VA.Env.Diagram.GAP_WIDTH) < Brightics.VA.Env.Diagram.PAPER_MARGIN_LEFT) {
                this.message = 'Unable to shift further left.';
                return false;
            }

            if (this.canShift(fnUnit) === false) {
                this.message = 'Unable to shift left.';
                return false;
            }

            this.options.changed.push(fnUnit.fid);

            this.old[fnUnit.fid] = {
                x: fnUnit.display.diagram.position.x,
                y: fnUnit.display.diagram.position.y
            };
            fnUnit.display.diagram.position.x -= (Brightics.VA.Env.Diagram.FIGURE_WIDTH + Brightics.VA.Env.Diagram.GAP_WIDTH);

            var nextIds = this.options.analyticsModel.getNext(fnUnit.fid);
            for (var i in nextIds) {
                var next = this.options.analyticsModel.getFnUnitById(nextIds[i]);
                this.shiftLeft(next);
            }
        }

        return true;
    };

    ShiftLeftCommand.prototype.undo = function () {
        for (var fid in this.old) {
            var fnUnit = this.options.analyticsModel.getFnUnitById(fid);
            fnUnit.display.diagram.position.x = this.old[fid].x;
            fnUnit.display.diagram.position.y = this.old[fid].y;
        }
    };

    ShiftLeftCommand.prototype.redo = function () {
        this.execute();
    };

    ShiftLeftCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.shiftleftcommand';
    };

    ShiftLeftCommand.prototype.getLabel = function () {
        return 'Shift Left';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ShiftLeftCommand = ShiftLeftCommand;

}).call(this);