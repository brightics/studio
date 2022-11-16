/**
 * Created by ng1123.kim on 2016-03-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BaseValidator(options) {
        this.options = options || {};
        this.FnUnitUtils = brtc_require('FnUnitUtils');
        this.init();
    }

    BaseValidator.prototype.init = function () {
        this.problemFactory = new Brightics.VA.Core.Validator.ProblemFactory();
        this.rule = [];

        this.initRules();
    };

    BaseValidator.prototype.validate = function (fnUnit, model) {
        var problemList = [];
        this.options.model = model;
        this.problemFactory.mid = model.mid;

        for (var i in this.rule) {
            var checkFunc = (this.rule[i]).bind(this);
            var problem = checkFunc(fnUnit);
            if (problem) problemList = problemList.concat(problem);
        }

        return problemList;
    };

    BaseValidator.prototype.isEmptyForObject = function (object) {
        var keys = Object.keys(object || {});
        return Boolean(keys.length === 0);
    };


    BaseValidator.prototype.isEmptyForArray = function (arrayValue) {
        if (arrayValue[0]) {
            if (arrayValue[0].constructor == Array) {
                if ((arrayValue[0])[0]) return false;
                return true;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };

    BaseValidator.prototype.isEmptyForString = function (stringValue) {
        if (stringValue) return false;
        return true;
    };

    BaseValidator.prototype.isConnectedWithPrev = function (fnUnit, inputCount) {
        var count = 1;
        if (inputCount) count = inputCount;
        var model = fnUnit.parent();

        if (model.getPrevious(fnUnit.fid).length === count) return true;
        return false;
    };

    BaseValidator.prototype.initRules = function () {

    };

    BaseValidator.prototype.addRule = function (func) {
        if (func) this.rule.push(func);
    };

    BaseValidator.prototype.isUndefinedForArray = function (arrayValue) {
        if (typeof arrayValue[0] !== 'undefined') {
            if (arrayValue[0].constructor == Array) {
                if (typeof  (arrayValue[0])[0] === 'undefined') return true;
            }
        } else {
            return true;
        }
        return false;
    };

    BaseValidator.prototype.checkLinkIsConnected = function (fnUnit) {
        if (this.FnUnitUtils.hasMeta(fnUnit)) {
            if (!this.FnUnitUtils.hasInput(fnUnit)) return;

            var hasProblem = false;
            var inputs = this.FnUnitUtils.getInputs(fnUnit);
            let messageInfo;
            for (var key in inputs) {
                if (_.isEmpty(inputs[key])) {
                    messageInfo = {
                        errorCode: 'BR-0059',
                        messageParam: ['Inputs', this.FnUnitUtils.getTotalInRangeCount(fnUnit).min]
                    };
                }
            }

            if (!_.isEmpty(messageInfo)) {
                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        } else {
            if (!this.FnUnitUtils.getInTable(fnUnit)) return;

            var clazz = fnUnit.parent().type;
            var defFuncInRange = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func)['in-range'];
            var inTableLength = this.FnUnitUtils.getInTable(fnUnit).length;
    
            let messageInfo;
            if (defFuncInRange.min === defFuncInRange.max && defFuncInRange.min != inTableLength) {
                messageInfo = {
                    errorCode: 'BR-0059',
                    messageParam: ['Inputs', defFuncInRange.min]
                };
            } else if (defFuncInRange.min !== defFuncInRange.max) {
                if (inTableLength < defFuncInRange.min) {
                    messageInfo = {
                        errorCode: 'BR-0024',
                        messageParam: ['Inputs', defFuncInRange.min]
                    };
                } else if (inTableLength > defFuncInRange.max) {
                    messageInfo = {
                        errorCode: 'BR-0022',
                        messageParam: ['Inputs', defFuncInRange.max]
                    };
                }
            }
    
            if (messageInfo) {
                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        }
    };
    /**
     * @deprecated use emptyLinkRule
     */
    BaseValidator.prototype.inputLinkRule = function () {
        this.addRule(function (fnUnit) {
            var messageInfo = {
                errorCode: 'EL001',
                messageParam: [fnUnit.display.label]
            };
            if (!this._hasPrevious(fnUnit)) return this.problemFactory.createProblem(messageInfo, fnUnit);
        });
    };

    BaseValidator.prototype.emptyColumnsRule = function (paramKey, label) {
        this.addRule(function (fnUnit) {
            var checkInfo = {
                errorCode: 'BR-0033',
                param: paramKey,
                messageParam: [label]
            };

            if (this.isEmptyForArray(fnUnit.param[paramKey])) return this.problemFactory.createProblem(checkInfo, fnUnit);
        });
    };

    BaseValidator.prototype.notExistColumnRule = function (paramKey) {
        this.addRule(function (fnUnit) {
            var schema = Brightics.VA.Core.DataQueryTemplate.getSchema(fnUnit.parent().mid, this.FnUnitUtils.getInTable(fnUnit));
            if (typeof schema === 'undefined') return;

            var checkInfo = {
                errorCode: 'EI001',
                param: paramKey,
                messageParam: []
            };

            var massageParamsLabel = [];
            var columns = fnUnit.param[paramKey][0];
            if (columns.length === 0) return;
            for (var i in columns) {
                var column = columns[i];
                var contains = false;

                for (var j in schema) {
                    if (schema[j].name == column) {
                        contains = true;
                        break;
                    }
                }
                if (!contains) {
                    massageParamsLabel.push('[' + column + ']');
                }

            }
            if (massageParamsLabel.length > 0) {
                checkInfo.messageParam = [massageParamsLabel];
                return this.problemFactory.createProblem(checkInfo, fnUnit);
            }


        });
    };

    BaseValidator.prototype.invalidColumnTypeRule = function (paramKey, type, label) {
        this.addRule(function (fnUnit) {
            var checkInfo = {
                errorCode: 'ET002',
                param: paramKey,
                messageParam: [label]
            };

            var invalidColumnProblems = [];

            var schema = Brightics.VA.Core.DataQueryTemplate.getSchema(fnUnit.parent().mid, this.FnUnitUtils.getInTable(fnUnit));

            var columns = fnUnit.param[paramKey][0];
            if (columns.length === 0) return;

            for (var i in columns) {
                var isValidColumn = false;

                if (schema === undefined) return;
                else {
                    for (var j in schema) {
                        if (columns[i] === schema[j].name && type === schema[j].type) {
                            isValidColumn = true;
                            break;
                        }
                    }
                }
                if (!isValidColumn) invalidColumnProblems.push(this.problemFactory.createProblem(checkInfo, fnUnit));
            }

            return invalidColumnProblems;
        });
    };

    BaseValidator.prototype.emptyProblemMessage = function (fnUnit, paramKey, checkData, label) {
        var checkInfo = {
            errorCode: 'BR-0033',
            param: paramKey,
            messageParam: [label ? label : paramKey]
        };
        if (this.isEmptyForString(checkData)) return this.problemFactory.createProblem(checkInfo, fnUnit);
    };

    BaseValidator.prototype.emptyNumberRule = function (paramKey, checkData) {
        var _this = this;
        this.addRule(function (fnUnit) {
            _this.emptyProblemMessage(fnUnit, paramKey, checkData);
        });
    };

    BaseValidator.prototype.emptyStringRule = function (paramKey, checkData) {
        var _this = this;
        this.addRule(function (fnUnit) {
            _this.emptyProblemMessage(fnUnit, paramKey, checkData);
        });
    };

    BaseValidator.prototype.emptyComboBoxRule = function (paramKey, checkData) {
        var _this = this;
        this.addRule(function (fnUnit) {
            _this.emptyProblemMessage(fnUnit, paramKey, checkData);
        });
    };

    BaseValidator.prototype.equalColumnInDataRule = function (paramKey, label) {
        this.addRule(function (fnUnit) {
            var checkInfo = {
                errorCode: 'EE007',
                param: paramKey,
                messageParam: [label]
            };

            var equalColumnProblems = [];

            var schema = Brightics.VA.Core.DataQueryTemplate.getSchema(fnUnit.parent().mid, this.FnUnitUtils.getInTable(fnUnit));

            var columns = fnUnit.param[paramKey][0];
            if (columns.length === 0) return;

            for (var i in columns) {
                var isEqualColumn = false;

                for (var j in schema) {
                    if (columns[i] === schema[j].name) {
                        isEqualColumn = true;
                        break;
                    }
                }
                if (!isEqualColumn) equalColumnProblems.push(this.problemFactory.createProblem(checkInfo, fnUnit));
            }

            return equalColumnProblems;
        });
    };

    BaseValidator.prototype.addNewColumnNameRule = function (paramKey) {
        var _this = this;
        this.addRule(function (fnUnit) {
            if (_this._hasPrevious(fnUnit)) {
                if (!fnUnit.param[paramKey]) return;

                var messageInfo = {
                    errorCode: 'BR-0045',
                    param: paramKey,
                    messageParam: [fnUnit.param[paramKey]]
                };

                if (fnUnit.param[paramKey].constructor == Array) {
                    var problems = [];
                    for (var k in fnUnit.param[paramKey]) {
                        if (!fnUnit.param[paramKey][k]) continue;
                        if (!(Brightics.VA.Core.Utils.InputValidator.isValid.columnNameType(fnUnit.param[paramKey][k]))) {
                            messageInfo.paramIndex = k;
                            problems.push(this.problemFactory.createProblem(messageInfo, fnUnit));
                        }
                    }
                    return problems;
                } else {
                    if (!(Brightics.VA.Core.Utils.InputValidator.isValid.columnNameType(fnUnit.param[paramKey]))) {
                        return this.problemFactory.createProblem(messageInfo, fnUnit);
                    }
                }
            }
        });
    };

    BaseValidator.prototype.addBaseGroupByRule = function (columnsParam, columnsLabel, groupbyParam) {
        var _this = this;
        if (!columnsParam) return;
        groupbyParam = groupbyParam || 'groupby';

        this.addRule(function (fnUnit) {
            var schema = Brightics.VA.Core.DataQueryTemplate.getSchema(fnUnit.parent().mid, this.FnUnitUtils.getInTable(fnUnit)[0]);
            if (typeof schema === 'undefined') return;

            var overlappedColumns = [], targetColumns;
            var groupbyColumns = fnUnit.param[groupbyParam];

            if (fnUnit.param[columnsParam].constructor === Array) {
                targetColumns = fnUnit.param[columnsParam][0];
                if (targetColumns && targetColumns.length) {
                    for (var i in groupbyColumns) {
                        if (targetColumns.indexOf(groupbyColumns[i]) > -1) {
                            overlappedColumns.push(groupbyColumns[i]);
                        }
                    }
                }
            } else if (fnUnit.param[columnsParam].constructor === String) {
                targetColumns = fnUnit.param[columnsParam];
                if (targetColumns) {
                    for (var j in groupbyColumns) {
                        if (targetColumns === groupbyColumns[j]) {
                            overlappedColumns.push(groupbyColumns[j]);
                        }
                    }
                }
            }

            if (overlappedColumns.length) {
                var messageInfo = {
                    errorCode: 'BR-0057',
                    param: groupbyParam
                };

                if (overlappedColumns.length == 1) messageInfo.messageParam = [overlappedColumns[0], columnsLabel, 'Group By'];
                else messageInfo.messageParam = [JSON.stringify(overlappedColumns), columnsLabel, 'Group By'];

                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        });
    };

    BaseValidator.prototype._isEmptyArray = function (value) {
        return !value[0];
    };

    BaseValidator.prototype._isEmptyString = function (value) {
        return !value;
    };

    BaseValidator.prototype._hasPrevious = function (fnUnit) {
        return fnUnit.parent().getPrevious(fnUnit.fid).length !== 0;
    };

    BaseValidator.prototype._hasIntables = function (fnUnit) {
        if (this.FnUnitUtils.getInTable(fnUnit) && this.FnUnitUtils.getInTable(fnUnit).length > 0) {
            return true;
        } else {
            return false;
        }
    };

    BaseValidator.prototype._checkStringIsEmpty = function (messageInfo, fnUnit, value) {
        if (this._isEmptyString(value)) return this.problemFactory.createProblem(messageInfo, fnUnit);
    };

    BaseValidator.prototype._checkArrayIsEmpty = function (messageInfo, fnUnit, value) {
        if (!value || this._isEmptyArray(value)) return this.problemFactory.createProblem(messageInfo, fnUnit);
    };

    BaseValidator.prototype._checkArrayIsCompact = function (messageInfo, fnUnit, value,
            label, type) {
        const isValid = (v) => {
            if (type === 'String') return !!v;
            // Integer or Double ??
            return !_.isNull(v) && !_.isUndefined(v);
        };
        if (!value ||
                !Array.isArray(value) ||
                !value.every(isValid)) {
            return this.problemFactory.createProblem(messageInfo, fnUnit);
        }
    };

    BaseValidator.prototype.getArrayConflicted = function (base /*, array2, array3, ... */) {
        var comparisonTarget = [];
        for (var i = 1; i < arguments.length; i++) {
            if ($.isArray(arguments[i])) comparisonTarget = comparisonTarget.concat(arguments[i]);
        }
        $.unique(comparisonTarget);

        return $.grep(base, function (value, index) {
            return (value !== '') ? ($.inArray(value, comparisonTarget) !== -1) : (false);
        });
    };

    BaseValidator.prototype.createProblemForConflicted = function (conflicted, param, label1, label2, fnUnit) {
        if ($.isArray(conflicted) && conflicted.length) {
            var messageInfo;
            if (conflicted.length == 1) {
                messageInfo = {
                    errorCode: 'BR-0057',
                    param: param,
                    messageParam: [conflicted[0], label1, label2]
                };
            } else {
                messageInfo = {
                    errorCode: 'BR-0057',
                    param: param,
                    messageParam: [JSON.stringify(conflicted), label1, label2]
                };
            }
            return this.problemFactory.createProblem(messageInfo, fnUnit);
        }
    };

    Brightics.VA.Core.Validator.BaseValidator = BaseValidator;

}).call(this);