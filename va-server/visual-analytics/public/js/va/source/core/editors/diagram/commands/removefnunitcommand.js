/**
 * Created by daewon.park on 2016-03-05.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var ObjectUtils = root.__module__.ObjectUtils;

    /**
     * options : {
     *      fid : ''
     * }
     *
     * @param eventSource
     * @param options
     * @constructor
     */
    function RemoveFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    RemoveFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveFnUnitCommand.prototype.constructor = RemoveFnUnitCommand;

    RemoveFnUnitCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveFnUnitCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveFnUnitCommand.prototype.execute = function () {
        this.processMainModelInput();
        this.old.fnUnit = this.options.analyticsModel.removeFnUnit(this.options.fid);
        Brightics.VA.Core.GarbageCollector.addList(this.options.analyticsModel.mid, this.options.fid);
    };

    RemoveFnUnitCommand.prototype.undo = function () {
        this.options.analyticsModel.addFnUnit(this.old.fnUnit);
        Brightics.VA.Core.GarbageCollector.removeList(this.options.analyticsModel.mid, this.options.fid);
        this.cancelMainModelInput();
    };

    RemoveFnUnitCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.removefnunitcommand';
    };

    RemoveFnUnitCommand.prototype.getLabel = function () {
        return 'Remove a Function';
    };

    RemoveFnUnitCommand.prototype.processMainModelInput = function () {
        var fnUnit = this.options.analyticsModel.getFnUnitById(this.options.fid);
        var model = this.options.mainModel;
        var i;

        this.ops = [];

        if (!model[IN_DATA]) return;

        for (i = model[IN_DATA].length - 1; i >= 0; --i) {
            var outs = this.FnUnitUtils.getOutTable(fnUnit);
            if (outs) {
                var index = _.indexOf(outs, model[IN_DATA][i]);
                if (index > -1) {
                    this.ops.push({
                        path: [i],
                        old: model[IN_DATA][i]
                    });
                }
            }
        }

        for (i = 0; i < this.ops.length; i++) {
            var op = this.ops[i];
            ObjectUtils.removeProp(model[IN_DATA], op.path);
        }
    };

    RemoveFnUnitCommand.prototype.cancelMainModelInput = function () {
        var model = this.options.mainModel;
        if (!model[IN_DATA]) return;
        for (var i = this.ops.length - 1; i >= 0; --i) {
            var op = this.ops[i];
            ObjectUtils.addProp(model[IN_DATA], op.path, op.old);
        }
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitCommand = RemoveFnUnitCommand;

}).call(this);