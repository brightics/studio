/**
 * Created by daewon.park on 2016-03-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');
    var ObjectUtils = root.__module__.ObjectUtils;

    /**
     * options : {
     *      kid : '',
     *      source-fid : '',
     *      target-fid : ''
     * }
     * @param options
     * @constructor
     */
    function ReconnectFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    ReconnectFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ReconnectFnUnitCommand.prototype.constructor = ReconnectFnUnitCommand;

    ReconnectFnUnitCommand.prototype.canUndo = function () {
        return true;
    };

    ReconnectFnUnitCommand.prototype.canRedo = function () {
        return true;
    };

    ReconnectFnUnitCommand.prototype.execute = function () {
        var currLink = this.options.analyticsModel.getLinkUnitById(this.options.kid);
        var i;
        this.old[SOURCE_FID] = currLink[SOURCE_FID];
        this.old[TARGET_FID] = currLink[TARGET_FID];

        // remove in-table of target fnUnit
        var sourceFnUnit = this.options.analyticsModel.getFnUnitById(currLink[SOURCE_FID]);
        var targetFnUnit = this.options.analyticsModel.getFnUnitById(currLink[TARGET_FID]);

        this.old['target-fnunit-in-table'] = [];
        this.old['additional-in-table'] = [];

        if (targetFnUnit[FUNCTION_NAME] === 'If' ||
                targetFnUnit[FUNCTION_NAME] === 'ForLoop' ||
                targetFnUnit[FUNCTION_NAME] === 'WhileLoop') {
            this.processInnerModel(sourceFnUnit, targetFnUnit);
        }

        //reconnect가 사용되는 경우 : switch, 링크 reconnect
        //1. 먼저 링크가 끊어진 함수부터 링크를 끊는 작업을 한다. (tid 뺀다)
        //새로 바뀐 함수에 input이 허용되는 경우
        if (FnUnitUtils.hasInput(targetFnUnit)) {
            if (FnUnitUtils.hasOutput(sourceFnUnit)) {
                // 소스에 있는것 중에서 target에 있는거는 따로 챙겨둔다.
                for (i in FnUnitUtils.getOutData(sourceFnUnit)) {
                    var idx = FnUnitUtils.getInData(targetFnUnit).indexOf(FnUnitUtils.getOutData(sourceFnUnit)[i]);
                    if (idx > -1) {
                        this.old['target-fnunit-in-table'].push(FnUnitUtils.getOutData(sourceFnUnit)[i]);
                    }
                }
                // target함수에서 source함수에 있는 tid를 뺀다.
                FnUnitUtils.disconnect(sourceFnUnit, targetFnUnit);

                //fix me!
                //targetFnUnit[IN_DATA]이 비어있고 targetFnUnit link가 한개일 때, Push 'inData'
                // if (currLink[TARGET_FID] != this.options[TARGET_FID]) {
                //     var prevFnUnitFidList = this.options.analyticsModel.getPrevious(currLink[TARGET_FID]);
                //     var index = prevFnUnitFidList.indexOf(this.options[SOURCE_FID]);
                //     if (index > -1) {
                //         prevFnUnitFidList.splice(index, 1);
                //     }
                //     if (targetFnUnit[IN_DATA].length === 0 && prevFnUnitFidList.length === 1) {
                //         var prevFnUnit = this.options.analyticsModel.getFnUnitById(prevFnUnitFidList[0]);
                //         targetFnUnit[IN_DATA].push(prevFnUnit[OUT_DATA][0]);
                //         this.old['additional-in-table'].push(prevFnUnit[OUT_DATA][0]);
                //     }
                // }

                if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                    targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], targetFnUnit[IN_DATA]);
                    if (targetFnUnit.param.functions[0].func === 'unload') {
                        targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
                    }
                } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
                    targetFnUnit.param['df-names'] = $.extend(true, [], targetFnUnit[IN_DATA]);
                }
            }

        }

        // change link
        currLink[SOURCE_FID] = this.options[SOURCE_FID];
        currLink[TARGET_FID] = this.options[TARGET_FID];

        // add in-table of target fnUnit
        //2. 새로운 함수에 tid를 넣는다.
        sourceFnUnit = this.options.analyticsModel.getFnUnitById(currLink[SOURCE_FID]);
        targetFnUnit = this.options.analyticsModel.getFnUnitById(currLink[TARGET_FID]);

        if (FnUnitUtils.hasOutput(sourceFnUnit) && FnUnitUtils.getOutData(sourceFnUnit).length > 0 && FnUnitUtils.hasInput(targetFnUnit)) {
            FnUnitUtils.connect(sourceFnUnit, targetFnUnit);

            if (targetFnUnit.func === 'unload' && !targetFnUnit.context) {
                targetFnUnit.param['df-names'] = targetFnUnit[IN_DATA];
            }

            if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], targetFnUnit[IN_DATA]);
                if (targetFnUnit.param.functions[0].func === 'unload') {
                    targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
                }
            }
        }
    };

    // ReconnectFnUnitCommand.prototype.execute = function () {
    //     var currLink = this.options.analyticsModel.getLinkUnitById(this.options.kid);
    //     var i;
    //     this.old[SOURCE_FID] = currLink[SOURCE_FID];
    //     this.old[TARGET_FID] = currLink[TARGET_FID];

    //     // remove in-table of target fnUnit
    //     var sourceFnUnit = this.options.analyticsModel.getFnUnitById(currLink[SOURCE_FID]);
    //     var targetFnUnit = this.options.analyticsModel.getFnUnitById(currLink[TARGET_FID]);
    //     var clazz = targetFnUnit.parent().type;

    //     this.old['target-fnunit-in-table'] = [];
    //     this.old['additional-in-table'] = [];

    //     if (targetFnUnit[FUNCTION_NAME] === 'If' ||
    //             targetFnUnit[FUNCTION_NAME] === 'ForLoop' ||
    //             targetFnUnit[FUNCTION_NAME] === 'WhileLoop') {
    //         this.processInnerModel(sourceFnUnit, targetFnUnit);
    //     }

    //     if (targetFnUnit[IN_DATA]) {
    //         for (i in sourceFnUnit[OUT_DATA]) {
    //             var idx = targetFnUnit[IN_DATA].indexOf(sourceFnUnit[OUT_DATA][i]);
    //             if (idx > -1) {
    //                 this.old['target-fnunit-in-table'].push(sourceFnUnit[OUT_DATA][i]);
    //                 targetFnUnit[IN_DATA].splice(idx, 1);
    //             }
    //         }

    //         //targetFnUnit[IN_DATA]이 비어있고 targetFnUnit link가 한개일 때, Push 'inData'
    //         if (currLink[TARGET_FID] != this.options[TARGET_FID]) {
    //             var prevFnUnitFidList = this.options.analyticsModel.getPrevious(currLink[TARGET_FID]);
    //             var index = prevFnUnitFidList.indexOf(this.options[SOURCE_FID]);
    //             if (index > -1) {
    //                 prevFnUnitFidList.splice(index, 1);
    //             }
    //             if (targetFnUnit[IN_DATA].length === 0 && prevFnUnitFidList.length === 1) {
    //                 var prevFnUnit = this.options.analyticsModel.getFnUnitById(prevFnUnitFidList[0]);
    //                 targetFnUnit[IN_DATA].push(prevFnUnit[OUT_DATA][0]);
    //                 this.old['additional-in-table'].push(prevFnUnit[OUT_DATA][0]);
    //             }
    //         }

    //         if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
    //             targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], targetFnUnit[IN_DATA]);
    //             if (targetFnUnit.param.functions[0].func === 'unload') {
    //                 targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
    //             }
    //         } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
    //             targetFnUnit.param['df-names'] = $.extend(true, [], targetFnUnit[IN_DATA]);
    //         }
    //     }

    //     // change link
    //     currLink[SOURCE_FID] = this.options[SOURCE_FID];
    //     currLink[TARGET_FID] = this.options[TARGET_FID];

    //     // add in-table of target fnUnit
    //     sourceFnUnit = this.options.analyticsModel.getFnUnitById(currLink[SOURCE_FID]);
    //     targetFnUnit = this.options.analyticsModel.getFnUnitById(currLink[TARGET_FID]);

    //     if (sourceFnUnit[OUT_DATA] && sourceFnUnit[OUT_DATA].length > 0 && targetFnUnit[IN_DATA]) {
    //         var inTableMaxLength = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, targetFnUnit.func)['in-range'].max;
    //         inTableMaxLength = inTableMaxLength === '*' ? Number.MAX_VALUE : inTableMaxLength;
    //         if (targetFnUnit[IN_DATA].length < inTableMaxLength) {
    //             targetFnUnit[IN_DATA].push(sourceFnUnit[OUT_DATA][0]);
    //         }

    //         if (targetFnUnit.func === 'unload') {
    //             targetFnUnit.param['df-names'] = targetFnUnit[IN_DATA];
    //         }

    //         if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
    //             targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], targetFnUnit[IN_DATA]);
    //             if (targetFnUnit.param.functions[0].func === 'unload') {
    //                 targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
    //             }
    //         }
    //     }
    // };

    ReconnectFnUnitCommand.prototype.undo = function () {
        var currLink = this.options.analyticsModel.getLinkUnitById(this.options.kid);
        var i;
        // remove in-table of target fnUnit
        var sourceFnUnit = this.options.analyticsModel.getFnUnitById(currLink[SOURCE_FID]);
        var targetFnUnit = this.options.analyticsModel.getFnUnitById(currLink[TARGET_FID]);

        // if (sourceFnUnit[OUT_DATA] && sourceFnUnit[OUT_DATA].length > 0) {
        if (FnUnitUtils.hasOutput(sourceFnUnit) && FnUnitUtils.getOutData(sourceFnUnit).length > 0) {
            // var inTables = targetFnUnit[IN_DATA];
            var inTables = FnUnitUtils.getInData(targetFnUnit);
            if (inTables) {
                for (i in FnUnitUtils.getOutData(sourceFnUnit)) {
                    var idx = inTables.indexOf(FnUnitUtils.getOutData(sourceFnUnit)[i]);
                    if (idx > -1) {
                        inTables.splice(idx, 1);
                    }
                }
            }

            if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], inTables);
                if (targetFnUnit.param.functions[0].func === 'unload') {
                    targetFnUnit.param.functions[0].param['df-names'] = inTables;
                }
            } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
                targetFnUnit.param['df-names'] = $.extend(true, [], inTables);
            }
        }

        // change link
        currLink[SOURCE_FID] = this.old[SOURCE_FID];
        currLink[TARGET_FID] = this.old[TARGET_FID];

        // add in-table of target fnUnit
        sourceFnUnit = this.options.analyticsModel.getFnUnitById(currLink[SOURCE_FID]);
        targetFnUnit = this.options.analyticsModel.getFnUnitById(currLink[TARGET_FID]);

        if (FnUnitUtils.hasInput(targetFnUnit)) {
            //????
            // if (this.old['additional-in-table'].length > 0) {
            //     var idx = FnUnitUtils.getInData(targetFnUnit).indexOf(this.old['additional-in-table'][0]);
            //     if (idx > -1) {
            //         targetFnUnit[IN_DATA].splice(idx, 1);
            //     }
            // }
            var clazz = targetFnUnit.parent().type;
            var inTableMaxLength = '';
            //3.6 이전 함수만 적용
            if (!FnUnitUtils.hasMeta(targetFnUnit)) inTableMaxLength = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, targetFnUnit.func)['in-range'].max;

            for (i in this.old['target-fnunit-in-table']) {
                if (inTableMaxLength === '*') {
                    targetFnUnit[IN_DATA].push(this.old['target-fnunit-in-table'][i]);
                }
                else {
                    //sourceFnUnit은 위아래 같다.
                    var type = FnUnitUtils.getTypeByTableId(sourceFnUnit, this.old['target-fnunit-in-table'][i]);
                    FnUnitUtils.addInData(targetFnUnit, type, [this.old['target-fnunit-in-table'][i]]);
                }
            }

            if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], targetFnUnit[IN_DATA]);
                if (targetFnUnit.param.functions[0].func === 'unload') {
                    targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
                }
            } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
                targetFnUnit.param['df-names'] = $.extend(true, [], targetFnUnit[IN_DATA]);
            }
        }

        if (this.ops) {
            this.cancelProcessInnerModel(sourceFnUnit, targetFnUnit);
        }
    };

    ReconnectFnUnitCommand.prototype.redo = function () {
        this.execute();
    };

    ReconnectFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.reconnectfnunitcommand';
    };

    ReconnectFnUnitCommand.prototype.getLabel = function () {
        return 'Reconnect a function';
    };

    ReconnectFnUnitCommand.prototype.processInnerModel = function (sourceFnUnit, targetFnUnit) {
        var mainModel = this.options.mainModel;
        var models = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, targetFnUnit);

        var i;
        var j;
        var k;

        this.ops = [];

        var desc = function (a, b) {
            return b - a;
        };

        for (i = 0; i < models.length; i++) {
            var model = models[i];
            var functions = model.functions;
            for (j = 0; j < functions.length; j++) {
                var fn = functions[j];
                var indices = [];
                if (!fn[IN_DATA]) continue;
                for (k = 0; k < sourceFnUnit[OUT_DATA].length; k++) {
                    var index = _.indexOf(fn[IN_DATA], sourceFnUnit[OUT_DATA][k]);
                    if (index >= 0) {
                        indices.push(index);
                    }
                }
                indices.sort(desc);

                var olds = [];
                for (k = 0; k < indices.length; k++) {
                    olds.push(fn[IN_DATA][indices[k]]);
                }

                this.ops.push({
                    fnUnit: fn,
                    indices: indices,
                    olds: olds
                });

                if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                    targetFnUnit.param.functions[0][IN_DATA] =
                        $.extend(true, [], targetFnUnit[IN_DATA]);
                    if (targetFnUnit.param.functions[0].func === 'unload') {
                        targetFnUnit.param.functions[0].param['df-names'] =
                            targetFnUnit[IN_DATA];
                    }
                } else if (targetFnUnit[FUNCTION_NAME] === 'OutData') {
                    targetFnUnit.param['df-names'] = $.extend(true, [], targetFnUnit[IN_DATA]);
                }
            }
        }

        for (i = 0; i < this.ops.length; i++) {
            var fnUnit = this.ops[i].fnUnit;
            for (j = 0; j < this.ops[i].indices.length; j++) {
                var path = [IN_DATA, this.ops[i].indices[j]];
                ObjectUtils.removeProp(fnUnit, path);

                if (fnUnit[FUNCTION_NAME] === 'Subflow') {
                    fnUnit.param.functions[0][IN_DATA] =
                        $.extend(true, [], fnUnit[IN_DATA]);
                    if (fnUnit.param.functions[0].func === 'unload') {
                        fnUnit.param.functions[0].param['df-names'] = fnUnit[IN_DATA];
                    }
                } else if (fnUnit[FUNCTION_NAME] === 'OutData') {
                    fnUnit.param['df-names'] = $.extend(true, [], fnUnit[IN_DATA]);
                }
            }
        }
    };

    ReconnectFnUnitCommand.prototype.cancelProcessInnerModel = function (
            sourceFnUnit,
            targetFnUnit) {
        var i;
        var j;
        for (i = 0; i < this.ops.length; i++) {
            var fnUnit = this.ops[i].fnUnit;
            for (j = this.ops[i].indices.length; j >= 0; j--) {
                var path = [IN_DATA, this.ops[i].indices[j]];
                ObjectUtils.addProp(fnUnit, path, this.ops[i].olds[j]);
                if (fnUnit[FUNCTION_NAME] === 'Subflow') {
                    fnUnit.param.functions[0][IN_DATA] =
                        $.extend(true, [], fnUnit[IN_DATA]);
                    if (fnUnit.param.functions[0].func === 'unload') {
                        fnUnit.param.functions[0].param['df-names'] = fnUnit[IN_DATA];
                    }
                } else if (fnUnit[FUNCTION_NAME] === 'OutData') {
                    fnUnit.param['df-names'] = $.extend(true, [], fnUnit[IN_DATA]);
                }
            }
        }
    };


    Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand = ReconnectFnUnitCommand;

}).call(this);
