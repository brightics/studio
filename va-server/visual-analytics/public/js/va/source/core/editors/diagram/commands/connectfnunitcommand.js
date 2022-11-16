/**
 * Created by ty_tree.kim on 2016-02-11.
 */

/* global _, IN_DATA, OUT_DATA, SOURCE_FID, TARGET_FID, FUNCTION_NAME */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var INNER_MODEL_FUNC = ['If', 'ForLoop', 'WhileLoop'];

    /**
     * options : {
     *      kid : '',
     *      source-fid : '',
     *      target-fid : ''
     * }
     * @param options
     * @constructor
     */
    function ConnectFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    ConnectFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ConnectFnUnitCommand.prototype.constructor = ConnectFnUnitCommand;

    ConnectFnUnitCommand.prototype.canUndo = function () {
        return true;
    };

    ConnectFnUnitCommand.prototype.canRedo = function () {
        return true;
    };

    ConnectFnUnitCommand.prototype.execute = function () {
        var i;
        for (i in this.options.analyticsModel.links) {
            if (this.options.analyticsModel.links[i][SOURCE_FID] === this.options[SOURCE_FID] &&
                this.options.analyticsModel.links[i][TARGET_FID] === this.options[TARGET_FID]) {
                // Already Linked
                return false;
            }
        }

        this.linkUnit = {
            'kid': this.options.kid,
            'sourceFid': this.options[SOURCE_FID],
            'targetFid': this.options[TARGET_FID]
        };
        this.options.analyticsModel.links.push(this.linkUnit);

        var sourceFnUnits = this.getSourceUnits(this.options[SOURCE_FID]);
        var targetFnUnits = this.getTargetUnits(this.options[TARGET_FID]);

        var _this = this;
        var valid = true;
        _.forEach(targetFnUnits, function (targetFnUnit) {
            _.forEach(sourceFnUnits, function (sourceFnUnit) {
                // if (!(!_this.isProcessFunction(sourceFnUnit) &&
                //     sourceFnUnit[OUT_DATA] &&
                //     sourceFnUnit[OUT_DATA].length > 0 &&
                //     targetFnUnit.hasOwnProperty(IN_DATA) &&
                //     _.indexOf(targetFnUnit[IN_DATA], sourceFnUnit[OUT_DATA][0]) === -1)) {
                //     return true;
                // }
                var sourceOutData = _this.FnUnitUtils.getOutData(sourceFnUnit);
                var targetInData = _this.FnUnitUtils.getInData(targetFnUnit);

                // !(process 함수가 아니다 && 소스데이터가 있다 && 소스데이터 1개이상 && 타겟에 인풋이 필요 && 타겟에 소스[0]이 없다)
                // process함수거나, 소스데이터 없거나, 타겟에 인풋필요없거나, 타겟에 소스[0] 이미 있거나
                if (!(!_this.FnUnitUtils.isProcessFunction(sourceFnUnit) &&
                    sourceOutData &&
                    sourceOutData.length > 0 &&
                    _this.FnUnitUtils.hasInput(targetFnUnit) &&
                    !_this.FnUnitUtils.isExist(sourceFnUnit, targetFnUnit))) {
                    return true;
                }

                var inTableMaxLength = _this.FnUnitUtils.getTotalInRangeCount(targetFnUnit).max;
                // var clazz = targetFnUnit.parent().type;
                // var inTableMaxLength = Brightics.VA.Core.Interface
                //     .Functions[clazz][targetFnUnit.func]['in-range'].max;

                if (_this.FnUnitUtils.isProcessFunction(targetFnUnit)) {
                    var diff = _.difference(sourceOutData, targetInData);
                    if (diff.length + targetInData.length > inTableMaxLength) {
                        valid = false;
                        return;
                    }
                    _this.FnUnitUtils.connect(sourceFnUnit, targetFnUnit);

                } else if (targetInData &&
                    _this.FnUnitUtils.isConnectable(sourceFnUnit, targetFnUnit) &&
                    _this.options.isMaintainIntable !== true) {
                        _this.FnUnitUtils.connect(sourceFnUnit, targetFnUnit);

                        if (_.find(INNER_MODEL_FUNC, _.matches(targetFnUnit[FUNCTION_NAME]))) {
                            var tid = sourceOutData[0];
                            _this.addTidsInnerModel(targetFnUnit, [tid]);
                        }
                }

                if (targetFnUnit.func === 'unload') {
                    targetFnUnit.param['df-names'] = targetFnUnit[IN_DATA];
                }

                if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                    targetFnUnit.param.functions[0][IN_DATA] =
                        $.extend(true, [], targetFnUnit[IN_DATA]);
                    if (targetFnUnit.param.functions[0].func === 'unload') {
                        targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
                    }
                }
                // return false = break in _.forEach
                // return false 왜 넣었는지 기억 안나서 주석처리
                // return false;
            });
        });
        if (!valid) return false;
    };

    ConnectFnUnitCommand.prototype.undo = function () {
        var links = this.options.analyticsModel.links;
        links.splice(links.indexOf(this.linkUnit), 1);

        var sourceFnUnits = this.getSourceUnits(this.options[SOURCE_FID]);
        var targetFnUnits = this.getTargetUnits(this.options[TARGET_FID]);

        var _this = this;
        _.forEach(targetFnUnits, function (targetFnUnit) {
            _.forEach(sourceFnUnits, function (sourceFnUnit) {

                var sourceOutData = _this.FnUnitUtils.getOutData(sourceFnUnit);
                var targetInData = _this.FnUnitUtils.getInData(targetFnUnit);

                if (!(sourceOutData &&
                    sourceOutData.length > 0 &&
                    !_this.FnUnitUtils.isProcessFunction(sourceFnUnit))) return;

                var inTables = targetInData;
                if (inTables && _this.options.isMaintainIntable !== true) {
                    _this.FnUnitUtils.disconnect(sourceFnUnit, targetFnUnit);

                    if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                        targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], inTables);
                        if (targetFnUnit.param.functions[0].func === 'unload') {
                            targetFnUnit.param.functions[0].param['df-names'] = inTables;
                        }
                    } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
                        targetFnUnit.param['df-names'] = $.extend(true, [], inTables);
                    }
                }

                if (_.find(INNER_MODEL_FUNC, _.matches(targetFnUnit[FUNCTION_NAME]))) {
                    _this.removeTidsInnerModel(sourceFnUnit, targetFnUnit);
                }
            });
        });
    };

    ConnectFnUnitCommand.prototype.redo = function () {
        this.execute();
    };

    ConnectFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.connectfnunitcommand';
    };

    ConnectFnUnitCommand.prototype.getLabel = function () {
        return 'Connect a function';
    };

    ConnectFnUnitCommand.prototype.addTidsInnerModel = function (fnUnit, tids) {
        var subModels = Brightics.VA.Core.Utils.NestedFlowUtils
            .getSubModels(this.getMainModel(), fnUnit);
        _.forEach(tids, function (tid) {
            _.forEach(subModels, function (model) {
                if (_.indexOf(model[IN_DATA], tid) === -1) {
                    model[IN_DATA].push(tid);
                }
            });
        });
    };

    ConnectFnUnitCommand.prototype.removeTidsInnerModel = function (sourceFnUnit, targetFnUnit) {
        var _this = this;

        var tids = this.FnUnitUtils.getOutData(sourceFnUnit);;
        var subModels = Brightics.VA.Core.Utils.NestedFlowUtils
            .getSubModels(this.getMainModel(), targetFnUnit);
        _.forEach(tids, function (tid) {
            if (_this.hasToRemove(sourceFnUnit, targetFnUnit, tid)) {
                _.forEach(subModels, function (model) {
                    var idx = _.indexOf(model[IN_DATA], tid);
                    if (idx > -1) {
                        model[IN_DATA].splice(idx, 1);
                    }
                });
            }
        });
    };

    ConnectFnUnitCommand.prototype.getSourceUnits = function (fid) {
        return this.getTargetModel().getLinkSourceFnUnits(fid);
    };

    ConnectFnUnitCommand.prototype.getTargetUnits = function (fid) {
        return this.getTargetModel().getLinkTargetFnUnits(fid);
    };

    ConnectFnUnitCommand.prototype.hasToRemove = function (source, target, tid) {
        var _this = this;
        var prvFnUnits = this.getTargetModel().getLinkSourceFnUnits(target.fid);
        return _.every(prvFnUnits, function (fnUnit) {
            return _this.FnUnitUtils.isProcessFunction(fnUnit) ||
                fnUnit.fid === source.fid ||
                _.indexOf(_this.FnUnitUtils.getOutData(fnUnit), tid) === -1;
        });
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand = ConnectFnUnitCommand;

    /* eslint-disable no-invalid-this */
}).call(this);
