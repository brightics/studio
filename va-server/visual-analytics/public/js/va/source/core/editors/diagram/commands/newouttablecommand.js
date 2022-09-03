/**
 * Created by jhoon80.park on 2017-04-25.
 */

/* global _, IN_DATA, OUT_DATA */
(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;
    function NewOutTableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }
    NewOutTableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewOutTableCommand.prototype.constructor = NewOutTableCommand;
    NewOutTableCommand.prototype.canUndo = function () {
        return true;
    };
    NewOutTableCommand.prototype.canRedo = function () {
        return true;
    };
    NewOutTableCommand.prototype.execute = function () {
        var _this = this;
        this.old[OUT_DATA] = $.extend(true, [], this.options.fnUnit[OUT_DATA]);

        var removed = _.difference(this.options.fnUnit[OUT_DATA], this.options.ref[OUT_DATA]);
        var added = _.difference(this.options.ref[OUT_DATA], this.options.fnUnit[OUT_DATA]);

        this.options.fnUnit[OUT_DATA] = this.options.ref[OUT_DATA];

        var nextFnUnits =
            _.unique(this.getTargetModel().getNext(this.options.fnUnit.fid)
                .reduce(function (acc, fid) {
                    return acc.concat(_this.getTargetModel().getLinkTargetFnUnits(fid));
                }, []), 'fid');
        this.oldFnUnitInData = {};
        this.oldModelOutData = _.clone(_this.getTargetModel()[OUT_DATA]);
        nextFnUnits.forEach(function (fn) {
            var clazz = fn.parent().type;
            var maxTableSize = Brightics.VA.Core.Interface
                .Functions[clazz][fn.func]['in-range'].max;

            if (fn[IN_DATA]) {
                _this.oldFnUnitInData[fn.fid] = _.clone(fn[IN_DATA]);
                fn[IN_DATA] = _.chain(fn[IN_DATA])
                    .difference(removed)
                    .concat(added)
                    .take(maxTableSize)
                    .value();
            }
        });

        this.getTargetModel()[OUT_DATA] = _.difference(this.getTargetModel()[OUT_DATA], removed);
    };
    NewOutTableCommand.prototype.undo = function () {
        var _this = this;
        this.options.fnUnit[OUT_DATA] = this.old[OUT_DATA];

        _.forIn(_this.oldFnUnitInData, function (inData, fid) {
            var fn = _this.getTargetModel().getFnUnitById(fid);
            fn[IN_DATA] = inData;
        });

        this.getTargetModel()[OUT_DATA] = this.oldModelOutData;
    };
    NewOutTableCommand.prototype.redo = function () {
        this.execute();
    };
    NewOutTableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.newouttablecommand';
    };
    NewOutTableCommand.prototype.getLabel = function () {
        return 'New Out Data';
    };
    Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand = NewOutTableCommand;
/* eslint-disable no-invalid-this */
}).call(this);
