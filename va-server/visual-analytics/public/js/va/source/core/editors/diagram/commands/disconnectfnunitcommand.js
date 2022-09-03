/**
 * Created by daewon.park on 2016-03-05.
 */

/* global _, IN_DATA, OUT_DATA, SOURCE_FID, TARGET_FID, FUNCTION_NAME */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');
    var INNER_MODEL_FUNC = ['If', 'ForLoop', 'WhileLoop'];

    /**
     * options : {
     *      kid : ''
     * }
     * @param options
     * @constructor
     */
    function DisconnectFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    DisconnectFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    DisconnectFnUnitCommand.prototype.constructor = DisconnectFnUnitCommand;

    DisconnectFnUnitCommand.prototype.canUndo = function () {
        return true;
    };

    DisconnectFnUnitCommand.prototype.canRedo = function () {
        return true;
    };

    DisconnectFnUnitCommand.prototype.execute = function () {
        this.old.linkUnit = this.options.analyticsModel.getLinkUnitById(this.options.kid);
        var i;
        var links = this.options.analyticsModel.links;
        links.splice(links.indexOf(this.old.linkUnit), 1);

        var sourceFnUnits = this.getSourceUnits(this.old.linkUnit[SOURCE_FID]);
        var targetFnUnits = this.getTargetUnits(this.old.linkUnit[TARGET_FID]);

        // model.getPrevious(fnUnit.fid).length
        // this.options.analyticsModel.getPrevious(this.old.linkUnit[TARGET_FID]).length === 1

        this.old['target-fnunit-in-table'] = {};
        this.old['additional-in-table'] = {};
        var _this = this;

        _.forEach(targetFnUnits, function (targetFnUnit) {
            _.forEach(sourceFnUnits, function (sourceFnUnit) {
                if (FnUnitUtils.isProcessFunction(sourceFnUnit)) return;
                if (_.find(INNER_MODEL_FUNC, _.matches(targetFnUnit[FUNCTION_NAME]))) {
                    _this.processInnerModel(sourceFnUnit, targetFnUnit);
                }
                if (FnUnitUtils.getInData(targetFnUnit)) {
                    for (i in FnUnitUtils.getOutData(sourceFnUnit)) {
                        if (_this.hasToRemove(sourceFnUnit, targetFnUnit, FnUnitUtils.getOutData(sourceFnUnit)[i])) {
                            var idx = FnUnitUtils.getInData(targetFnUnit).indexOf(FnUnitUtils.getOutData(sourceFnUnit)[i]);
                            if (idx > -1) {
                                var inputs = FnUnitUtils.wrapInputs(FnUnitUtils.getInputs(targetFnUnit));
                                _this.old['target-fnunit-in-table'][targetFnUnit.fid] =
                                    _this.old['target-fnunit-in-table'][targetFnUnit.fid] ||
                                    $.extend(true, {}, inputs);

                                FnUnitUtils.disconnect(sourceFnUnit, targetFnUnit);

                                if (targetFnUnit.func === 'unload' && !targetFnUnit.context) {
                                    targetFnUnit.param['df-names'].splice(idx, 1);
                                }
                            }
                        }
                    }

                    //fnUnit테스트필요???? 이거 뭡니까?
                    // targetFnUnit[IN_DATA]이 비어있고 targetFnUnit link가 한개일 때, Push 'inData'
                    /*
                    var prevFnUnitIds = _this.getTargetModel().getAllPreviousFnUnitIds(targetFnUnit.fid);
                    if (targetFnUnit.getInData().length === 0 && prevFnUnitIds.length === 1) {
                        var prevFnUnit = _this.getTargetModel().getFnUnitById(prevFnUnitIds[0]);
                        if (prevFnUnit.getOutData().length > 0) {

                            // targetFnUnit[IN_DATA].push(prevFnUnit[OUT_DATA][0]);
                            _this.old['additional-in-table'][targetFnUnit.fid] = [prevFnUnit[OUT_DATA][0]];
                        }
                    }
                    */

                    if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                        targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], targetFnUnit[IN_DATA]);
                        if (targetFnUnit.param.functions[0].func === 'unload') {
                            targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
                        }
                    } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
                        targetFnUnit.param['df-names'] = $.extend(true, [], targetFnUnit[IN_DATA]);
                    }
                }
            });
        });
    };

    DisconnectFnUnitCommand.prototype.undo = function () {
        var links = this.options.analyticsModel.links;
        links.push(this.old.linkUnit);

        var _this = this;
        var targetFnUnits = this.getTargetUnits(this.old.linkUnit[TARGET_FID]);
        _.forEach(targetFnUnits, function (targetFnUnit) {
            if (FnUnitUtils.getInData(targetFnUnit)) {
                if (_this.old['additional-in-table'][targetFnUnit.fid] &&
                _this.old['additional-in-table'][targetFnUnit.fid].length > 0) {
                    //fnUnit테스트필요???? 이거 뭡니까?
                    // var idx = targetFnUnit[IN_DATA].indexOf(_this.old['additional-in-table'][targetFnUnit.fid][0]);
                    // if (idx > -1) {
                    //     targetFnUnit[IN_DATA].splice(idx, 1);
                    // }
                }

                if (_this.old['target-fnunit-in-table'][targetFnUnit.fid]) {
                    // targetFnUnit[IN_DATA] = _this.old['target-fnunit-in-table'][targetFnUnit.fid];
                    $.extend(true, targetFnUnit, _this.old['target-fnunit-in-table'][targetFnUnit.fid]);
                }


                if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                    targetFnUnit.param.functions[0][IN_DATA] =
                        $.extend(true, [], targetFnUnit[IN_DATA]);
                    if (targetFnUnit.param.functions[0].func === 'unload') {
                        targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
                    }
                } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
                    targetFnUnit.param['df-names'] = $.extend(true, [], targetFnUnit[IN_DATA]);
                }
            }
        });

        if (this.removedTables) {
            this.cancelProcessInnerModel();
        }
    };

    DisconnectFnUnitCommand.prototype.redo = function () {
        this.execute();
    };

    DisconnectFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.disconnectfnunitcommand';
    };

    DisconnectFnUnitCommand.prototype.getLabel = function () {
        return 'Disconnect a function';
    };

    DisconnectFnUnitCommand.prototype.processInnerModel = function (sourceFnUnit, targetFnUnit) {
        var mainModel = this.options.mainModel;
        var models = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, targetFnUnit);

        var i;
        var j;

        this.removedTables = this.removedTables || {};

        for (i = 0; i < models.length; i++) {
            var model = models[i];
            this.removedTables[model.mid] = this.removedTables[model.mid] || [];
            for (j = model[IN_DATA].length - 1; j >= 0; --j) {
                if (_.indexOf(FnUnitUtils.getOutData(sourceFnUnit), model[IN_DATA][j]) > -1 &&
                    this.hasToRemove(sourceFnUnit, targetFnUnit, model[IN_DATA][j])) {
                    this.removedTables[model.mid].push({ index: j, id: model[IN_DATA][j] });
                    model[IN_DATA].splice(j, 1);
                }
            }
        }
    };

    DisconnectFnUnitCommand.prototype.cancelProcessInnerModel = function () {
        var j;
        var _this = this;
        _.forIn(this.removedTables, function (tables, mid) {
            var model = _this.getMainModel().getInnerModel(mid);
            if (model) {
                for (j = tables.length - 1; j >= 0; --j) {
                    model[IN_DATA].splice(tables[j].index, 0, tables[j].id);
                }
            }
        });
    };

    DisconnectFnUnitCommand.prototype.getSourceUnits = function (fid) {
        return this.getTargetModel().getLinkSourceFnUnits(fid);
    };

    DisconnectFnUnitCommand.prototype.getTargetUnits = function (fid) {
        return this.getTargetModel().getLinkTargetFnUnits(fid);
    };

    DisconnectFnUnitCommand.prototype.hasToRemove = function (source, target, tid) {
        var _this = this;
        var prvFnUnits = this.getTargetModel().getLinkSourceFnUnits(target.fid);
        return _.every(prvFnUnits, function (fnUnit) {
            return FnUnitUtils.isProcessFunction(fnUnit) ||
                fnUnit.fid === source.fid ||
                _.indexOf(FnUnitUtils.getOutData(fnUnit), tid) === -1;
        });
    };

    Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand = DisconnectFnUnitCommand;
}).call(this);
