/**
 * Created by jhoon80.park on 2017-04-25.
 */
(function () {
        'use strict';
        var root = this;
        var Brightics = root.Brightics;
        function ChangeOutTableCommand(eventSource, options) {
            Brightics.VA.Core.Command.call(this, eventSource, options);
        }
        ChangeOutTableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
        ChangeOutTableCommand.prototype.constructor = ChangeOutTableCommand;
        ChangeOutTableCommand.prototype.canUndo = function () {
            return true;
        };
        ChangeOutTableCommand.prototype.canRedo = function () {
            return true;
        };
        ChangeOutTableCommand.prototype.execute = function () {
            this.old[OUT_DATA] = $.extend(true, [], this.options.fnUnit[OUT_DATA]);
            //삭제된 Out-Table 목록으로 작업한다.
            var deletedOutTables = [];
            //out table이 추가 된 경우는 처리하지 않는다.
            //out table이 삭제된 경우
            for (var i in this.options.fnUnit[OUT_DATA]) {
                if (this.options.ref[OUT_DATA].indexOf(this.options.fnUnit[OUT_DATA][i]) == -1) {
                    deletedOutTables.push(this.options.fnUnit[OUT_DATA][i]);
                }
            }
            var nextFnUnits = this.options.analyticsModel.getNext(this.options.fnUnit.fid);
            var changedFnUnits = [];
            for (let deletedOutTable of deletedOutTables) {
                for (var j in nextFnUnits) {
                    let nextFnUnit = this.options.analyticsModel.getFnUnitById(nextFnUnits[j]);
                    //삭제할 out-table이 nextFnUnit의 In-table로 존재하는 경우
                    let nextFnUnitInTable = this.FnUnitUtils.getInTable(nextFnUnit);
                    if ($.inArray(deletedOutTable, nextFnUnitInTable) > -1) {
                        var fidList = changedFnUnits.map(function (fnUnit) {
                            return fnUnit.fid;
                        });
                        if (fidList.indexOf(nextFnUnit.fid) == -1) {
                            if (this.FnUnitUtils.hasMeta(nextFnUnit)) {
                                changedFnUnits.push({fid: nextFnUnit.fid, 'inputs': nextFnUnit['inputs']});
                            } else {
                                changedFnUnits.push({fid: nextFnUnit.fid, 'inData': nextFnUnit[IN_DATA]});
                            }
                        }
                    }
                }
            }
            this.old.changedNextFnUnit = $.extend(true, [], changedFnUnits);
            this.options.fnUnit[OUT_DATA] = this.options.ref[OUT_DATA];
            for (let deletedOutTable of deletedOutTables) {
                //나와 연결된 FnUnit들의 In-Table에서 하나씩 삭제한다.
                for (var j in nextFnUnits) {
                    let nextFnUnit = this.options.analyticsModel.getFnUnitById(nextFnUnits[j]);
                    let nextFnUnitInTable = this.FnUnitUtils.getInTable(nextFnUnit);
                    if ($.inArray(deletedOutTable, nextFnUnitInTable) > -1) {
                        this.FnUnitUtils.removeInData(nextFnUnit, 'table', deletedOutTable);
                    }
                }
            }
        };
        ChangeOutTableCommand.prototype.undo = function () {
            this.options.fnUnit[OUT_DATA] = this.old[OUT_DATA];
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

        ChangeOutTableCommand.prototype.redo = function () {
            this.execute();
        };
        ChangeOutTableCommand.prototype.getId = function () {
            return 'brightics.va.editors.diagram.commands.deleteouttablecommand';
        };
        ChangeOutTableCommand.prototype.getLabel = function () {
            return 'Delete Output';
        };
        Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutTableCommand = ChangeOutTableCommand;
    }
).call(this);
