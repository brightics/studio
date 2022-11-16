/**
 * Created by SDS on 2018-07-10.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InvokeValidator() {
        this._functionContents = this._getContents();
        this._validatorParams = this._functionContents.params || [];

        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    InvokeValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    InvokeValidator.prototype.constructor = InvokeValidator;

    InvokeValidator.prototype.initRules = function () {
        // fix me: 기존 validator 로직이 처리가 안되어 있고 하나로 묶여있음 
        // (무조건 SingleInputValidator 하나 상속)
        // link 가 안되어 있으면 다른 validation을 안한다거나...
        // 동작이 안되는 것도 있음
        this.addLinkRule();
        this.addInTableRule();

        this.addRulesFromParams();
        this._createCustomValidation()

    };

    InvokeValidator.prototype.addLinkRule = function () {
        var _this = this;
        var inRange = this.FnUnitUtils.getTotalInRangeCount(this._functionContents);
        if (typeof inRange === 'undefined' || inRange.min == 0) return;
        this.addRule(function (fnUnit) {
            return _this.checkLinkIsConnected(fnUnit);
        });
    };

    InvokeValidator.prototype.addInTableRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            if (_this.FnUnitUtils.hasMeta(fnUnit) && !_this.FnUnitUtils.hasTable(fnUnit)) return; 
            return _this.checkInTableIsEmpty(fnUnit);
        });
    };

    InvokeValidator.prototype._createCustomValidation = function () {
        var param;
        for (var i = 0; i < this._validatorParams.length; i++) {
            param = this._validatorParams[i];
            if (param.validation && param.validation.length > 0) {
                this._addCustomRule(param);
            }
        }
    };


    InvokeValidator.prototype.addColumnsRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            if (_this.checkLinkIsConnected(fnUnit)) return;
            return _this.checkColumnIsEmpty(fnUnit, 'columns', fnUnit.param['columns'][0], 'Columns');
        });
        this.addRule(function (fnUnit) {
            if (_this.checkLinkIsConnected(fnUnit)) return;
            return _this.checkColumnExists(fnUnit, 'columns', fnUnit.param['columns'][0]);
        });
    };

    InvokeValidator.prototype._addCustomRule = function (spec) {
        var _this = this;

        var validationList = spec.validation;
        var validation;
        var id = spec.id;

        for (var i = 0; i < validationList.length; i++) {
            validation = validationList[i];
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                var checkLogic = new Function('value', 'fnUnit', validation.validationCode);

                var clonFnUnit = $.extend(true, {}, fnUnit);
                if (fnUnit.param[id] && checkLogic.call(_this, fnUnit.param[id], clonFnUnit) === false) {
                    var messageInfo = {
                        errorCode: validation.messageCode || 'BR-0100',
                        param: id,
                        messageParam: validation.messageParam
                    };
                    return _this.problemFactory.createProblem(messageInfo, fnUnit);
                }
            });
        }
    };

    InvokeValidator.prototype.addRulesFromParams = function () {
        var param;

        for (var i = 0; i < this._validatorParams.length; i++) {
            param = this._validatorParams[i];
            if (param.mandatory === true) {
                this._createMandatoryRule(param);
            }
        }
    };

    InvokeValidator.prototype._createMandatoryRule = function (spec) {
        const _this = this;
        const { id, label, type } = spec;
        if (spec.control === 'ColumnSelector') {
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                return _this.checkColumnIsEmpty(fnUnit, id, fnUnit.param[id], label);
            });
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                return _this.checkColumnExists(fnUnit, id, fnUnit.param[id]);
            });
        } else if (spec.control === 'InputBox') {
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                return _this.emptyProblemMessage(fnUnit, id, fnUnit.param[id], label);
            });
        } else if (spec.control === 'DropDownList') {
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                return _this.emptyProblemMessage(fnUnit, id, fnUnit.param[id], label);
            });
        } else if (spec.control === 'CheckBox') {
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                var checkInfo = {
                    errorCode: 'BR-0033',
                    param: id,
                    messageParam: [label]
                };
                return _this._checkArrayIsEmpty(checkInfo, fnUnit, fnUnit.param[id]);
            });
        } else if (spec.control === 'Expression') {
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                return _this.emptyProblemMessage(fnUnit, id, fnUnit.param[id], label);
            });
        } else if (spec.control === 'ArrayInput') {
            this.addRule(function (fnUnit) {
                if (_this.checkLinkIsConnected(fnUnit)) return;
                var checkInfo = {
                    errorCode: 'BR-0033',
                    param: id,
                    messageParam: [label]
                };
                return _this._checkArrayIsCompact(checkInfo, fnUnit, fnUnit.param[id], label, type);
            });
        }
    };


    Brightics.VA.Implementation.DataFlow.Functions.InvokeValidator = InvokeValidator;
}).call(this);