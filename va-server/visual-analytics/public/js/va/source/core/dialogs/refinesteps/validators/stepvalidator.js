/**
 * Created by SDS on 2016-09-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function StepValidator() {
        Brightics.VA.Core.Validator.BaseValidator.call(this);
    }


    StepValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    StepValidator.prototype.constructor = StepValidator;

    StepValidator.prototype.initRules = function () {

    };

    StepValidator.prototype.createProblem = function (checkResult) {
        var _this = this;
        return {
            level: _this.problemFactory.rule[checkResult.errorCode].level,
            param: checkResult.param,
            paramIndex: checkResult.paramIndex,
            code: checkResult.errorCode,
            message: _this.problemFactory.makeMessage(checkResult)
        };
    };

    StepValidator.prototype.getSchema = function (fnUnit) {
        var columns = [];
        this.options.dataProxy.requestSchema(fnUnit[IN_DATA][0],
            function (result) {
                columns = result.columns;
            });
        return columns;
    };


    Brightics.VA.Core.Validator.StepValidator = StepValidator;

}).call(this);