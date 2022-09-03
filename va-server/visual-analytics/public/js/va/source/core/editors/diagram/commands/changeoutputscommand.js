/**
 * Created by jhoon80.park on 2017-04-25.
 */
(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;
    function ChangeOutputsCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }
    ChangeOutputsCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ChangeOutputsCommand.prototype.constructor = ChangeOutputsCommand;
    ChangeOutputsCommand.prototype.canUndo = function () {
        return true;
    };
    ChangeOutputsCommand.prototype.canRedo = function () {
        return true;
    };

    ChangeOutputsCommand.prototype.findTypeChangedData = function () {
        var rt = [];

        var oldKeys = Object.keys(this.old['outputs']);
        var newOutputs = this.options.ref['outputs'];
        var oldMeta = this.FnUnitUtils.getMeta(this.options.fnUnit);
        var newMeta = this.options.ref['meta'];

        _.forEach(oldKeys, function (key) {
            var oldType = oldMeta[key].type;
            var newType = newMeta[key]? newMeta[key].type : oldType;

            if (oldType != newType) rt.push(newOutputs[key]);
        });

        return rt;
    };

    ChangeOutputsCommand.prototype.findDeletedData = function () {
        var _this = this;
        var oldKeys = Object.keys(this.old['outputs']);
        var newKeys = Object.keys(this.options.ref['outputs']);

        return _.difference(oldKeys, newKeys).map(function (key) {
            return _this.old['outputs'][key];
        });
    };

    ChangeOutputsCommand.prototype.findAddedData = function () {
        var _this = this;
        var oldKeys = Object.keys(this.old['outputs']);
        var newKeys = Object.keys(this.options.ref['outputs']);

        return _.difference(newKeys, oldKeys).map(function (key) {
            return _this.options.ref['outputs'][key];
        });
    };

    ChangeOutputsCommand.prototype.execute = function () {
        var _this = this;

        this.old['outputs'] = $.extend(true, {}, this.options.fnUnit['outputs']);
        
        var addedOutData = this.findAddedData();
        var deletedOutData = this.findDeletedData();
        var typeChangedData = this.findTypeChangedData();

        //fnUnit의 Out을 바꾼다.
        this.options.fnUnit['outputs'] = this.options.ref['outputs'];
        this.options.fnUnit['meta'] = this.options.ref['meta'];
        
        var nextFnUnits = this.options.analyticsModel.getNext(this.options.fnUnit.fid);
        var changedFnUnits = [];

        _.forEach(addedOutData, function (addedTid) {
            _.forEach(nextFnUnits, function (fid) {
                var nextFn = _this.options.analyticsModel.getFnUnitById(fid);
                var nextInData = _this.FnUnitUtils.getInData(nextFn);
                if (nextInData.indexOf(addedTid) < 0) {
                    if (_this.FnUnitUtils.hasMeta(nextFn)) {
                        changedFnUnits.push({fid: nextFn.fid, 'inputs': _.extend({}, nextFn['inputs'])});
                    } else {
                        changedFnUnits.push({fid: nextFn.fid, 'inData': _.extend([], nextFn[IN_DATA])});
                    }

                    var type = _this.FnUnitUtils.getTypeByTableId(_this.options.fnUnit, addedTid);
                    _this.FnUnitUtils.addInData(nextFn, type, [addedTid]); 
                };
            });
        });

        _.forEach(deletedOutData, function (deletedTid) {
            _.forEach(nextFnUnits, function (fid) {
                var nextFn = _this.options.analyticsModel.getFnUnitById(fid);
                var nextInData = _this.FnUnitUtils.getInData(nextFn);
                if (nextInData.indexOf(deletedTid) > -1) {
                    if (_this.FnUnitUtils.hasMeta(nextFn)) {
                        changedFnUnits.push({fid: nextFn.fid, 'inputs': _.extend({}, nextFn['inputs'])});
                    } else {
                        changedFnUnits.push({fid: nextFn.fid, 'inData': _.extend([], nextFn[IN_DATA])});
                    }

                    var type = _this.FnUnitUtils.getTypeByTableId(nextFn, deletedTid);
                    _this.FnUnitUtils.removeInData(nextFn, type, deletedTid); 
                };
            });
        });

        _.forEach(typeChangedData, function (changedTid) {
            _.forEach(nextFnUnits, function (fid) {
                var nextFn = _this.options.analyticsModel.getFnUnitById(fid);
                var nextInData = _this.FnUnitUtils.getInData(nextFn);
                var currentType = _this.FnUnitUtils.getTypeByTableId(_this.options.fnUnit, changedTid);
                var nextType = _this.FnUnitUtils.getTypeByTableId(nextFn, changedTid);

                if (nextInData.indexOf(changedTid) > -1 && currentType != nextType) {
                    if (_this.FnUnitUtils.hasMeta(nextFn)) {
                        changedFnUnits.push({fid: nextFn.fid, 'inputs': _.extend({}, nextFn['inputs'])});
                    } else {
                        changedFnUnits.push({fid: nextFn.fid, 'inData': _.extend([], nextFn[IN_DATA])});
                    }

                    _this.FnUnitUtils.removeInData(nextFn, nextType, changedTid); 
                };
            });
        });

        this.old.changedNextFnUnit = _.extend([], changedFnUnits);
    };
    ChangeOutputsCommand.prototype.undo = function () {
        var _this = this;
        this.options.fnUnit['outputs'] = this.old['outputs'];
        var nextFnUnits = this.options.analyticsModel.getNext(this.options.fnUnit.fid);

        for (var i in nextFnUnits) {
            for (var j in this.old.changedNextFnUnit) {
                var oldFnUnit = this.old.changedNextFnUnit[j];
                var nextFnUnit = this.options.analyticsModel.getFnUnitById(nextFnUnits[i]);
                if (nextFnUnit.fid === oldFnUnit.fid) {
                    if (this.FnUnitUtils.hasMeta(nextFnUnit)) {
                        nextFnUnit['inputs'] = oldFnUnit['inputs'];
                    } else {
                        nextFnUnit[IN_DATA] = oldFnUnit[IN_DATA];
                    }
                    break;
                }
            }
        }
    };
    ChangeOutputsCommand.prototype.redo = function () {
        this.execute();
    };
    ChangeOutputsCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.changeoutputscommand';
    };
    ChangeOutputsCommand.prototype.getLabel = function () {
        return 'Delete Output';
    };
    Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutputsCommand = ChangeOutputsCommand;
    
}).call(this);
