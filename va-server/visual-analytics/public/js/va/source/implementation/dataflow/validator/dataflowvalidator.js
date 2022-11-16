/**
 * Created by ng1123.kim on 2016-03-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataFlowValidator(options) {
        this.validator = {};
        this.options = options || {};
    }

    DataFlowValidator.prototype.validate = function (analyticsModel) {
        var problems = [];
        for (var i in analyticsModel.functions) {
            var fnUnit = analyticsModel.functions[i];

            try {
                var problem
                    , validator = this.createValidator(fnUnit.func);

                if (validator) problem = validator.validate(fnUnit, analyticsModel);
                if (problem) problems = problems.concat(problem);
            } catch (err) {
                console.log(err);
            }
        }
        problems = problems.filter(function (problem) {
            return typeof problem !== 'undefined' && problem != null;
        });
        analyticsModel.problemList = problems;
        return analyticsModel.problemList;
    };

    DataFlowValidator.prototype.createValidator = function (func) {
        var clazz = typeof root.Brightics.VA.Implementation.DataFlow.Functions[func] === 'undefined' ? root.Brightics.VA.Implementation.DataFlow.Functions.unknownFunction.validator : root.Brightics.VA.Implementation.DataFlow.Functions[func].validator;
        if (this.validator[func]) {
            return this.validator[func];
        } else {
            return this.validator[func] = clazz ? new clazz() : new Brightics.VA.Core.Validator.BaseValidator();
        }
    };

    Brightics.VA.Implementation.DataFlow.Validator = DataFlowValidator;

}).call(this);