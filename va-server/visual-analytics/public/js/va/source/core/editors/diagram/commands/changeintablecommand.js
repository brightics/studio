/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');
    var ObjectUtils = root.__module__.ObjectUtils;

    function ChangeIntableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit In-Table Properties';
    }

    ChangeIntableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ChangeIntableCommand.prototype.constructor = ChangeIntableCommand;

    ChangeIntableCommand.prototype.execute = function () {
        // this.old = $.extend(true, [], this.options.fnUnit[IN_DATA]);
        this.old = $.extend(true, [], FnUnitUtils.getInputs(this.options.fnUnit));

        // this.options.fnUnit[IN_DATA] = $.extend(true, [], this.options.ref[IN_DATA]);
        var meta = FnUnitUtils.getMeta(this.options.fnUnit);
        if (meta) {
            var key = FnUnitUtils.getKeyByType(this.options.fnUnit, 'table', 'in');
            this.options.fnUnit.inputs[key] = this.options.ref[0] || '';
        } else {
            this.options.fnUnit[IN_DATA] = this.options.ref;
        }

        if (this.options.fnUnit[FUNCTION_NAME] === 'Subflow') {
            this.options.fnUnit.param.functions[0][IN_DATA] = $.extend(true, [], this.options.fnUnit[IN_DATA]);
        } else if (this.options.fnUnit[FUNCTION_NAME] === 'If' ||
                this.options.fnUnit[FUNCTION_NAME] === 'ForLoop' ||
                this.options.fnUnit[FUNCTION_NAME] === 'WhileLoop') {
            this.processInnerModel();
        }
    };

    ChangeIntableCommand.prototype.undo = function () {
        // $.extend(true, this.options.fnUnit[IN_DATA], this.old);

        var meta = FnUnitUtils.getMeta(this.options.fnUnit);
        if (meta) {
            var key = FnUnitUtils.getKeyByType(this.options.fnUnit, 'table', 'in');
            this.options.fnUnit.inputs[key] = this.old[key];

        } else {
            this.options.fnUnit[IN_DATA] = this.old;
        }

        if (FnUnitUtils.getInData(this.options.fnUnit) && this.options.fnUnit[FUNCTION_NAME] === 'Subflow') {
            this.options.fnUnit.param.functions[0][IN_DATA] = $.extend(true, [], this.options.fnUnit[IN_DATA]);
        } else if (this.options.fnUnit[FUNCTION_NAME] === 'If' ||
            this.options.fnUnit[FUNCTION_NAME] === 'ForLoop' ||
            this.options.fnUnit[FUNCTION_NAME] === 'WhileLoop') {
            this.cancelInnerModel();
        }
    };

    ChangeIntableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.changeintablecommand';
    };

    //처리해야함
    ChangeIntableCommand.prototype.processInnerModel = function () {
        var mainModel = this.options.mainModel;
        var fnUnit = this.options.fnUnit;
        var models = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, fnUnit);
        var i;
        var j;
        var k;
        this.ops = [];
        this.oldByMid = {};
        for (i = 0; i < models.length; i++) {
            var model = models[i];
            var functions = model.functions;
            this.oldByMid[model.mid] = _.clone(model[IN_DATA]);
            model[IN_DATA] = FnUnitUtils.getInData(fnUnit);//fnUnit[IN_DATA];
            for (j = 0; j < functions.length; j++) {
                var fn = functions[j];
                if (!FnUnitUtils.getInData(fn)) continue;
                for (k = FnUnitUtils.getInData(fn).length - 1; k >= 0; k--) {
                    var tableId = FnUnitUtils.getInData(fn)[k];
                    var index = _.indexOf(FnUnitUtils.getInData(fnUnit), tableId);

                    //처리해야함
                    if (index === -1) {
                        this.ops.push({
                            fnUnit: fn,
                            path: [IN_DATA, k],
                            old: tableId
                        });
                    }
                }
            }
        }

        for (i = 0; i < this.ops.length; i++) {
            var op = this.ops[i];
            ObjectUtils.removeProp(op.fnUnit, op.path);
            if (op.fnUnit[FUNCTION_NAME] === 'Subflow') {
                op.fnUnit.param.functions[0][IN_DATA] =
                    $.extend(true, [], op.fnUnit[IN_DATA]);
            }
        }
    };

    //처리해야함
    ChangeIntableCommand.prototype.cancelInnerModel = function () {
        for (var i = this.ops.length - 1; i >= 0; --i) {
            var op = this.ops[i];
            ObjectUtils.addProp(op.fnUnit, op.path, op.old);
            if (op.fnUnit[FUNCTION_NAME] === 'Subflow') {
                op.fnUnit.param.functions[0][IN_DATA] =
                    $.extend(true, [], op.fnUnit[IN_DATA]);
            }
        }

        var _this = this;
        _.forIn(this.oldByMid, function (inData, mid) {
            var model = _this.getMainModel().getInnerModel(mid);
            if (model) {
                model[IN_DATA] = _.clone(inData);
            }
        });
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand = ChangeIntableCommand;

}).call(this);