/**
 * Created by gy84.bae on 2016-11-16.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VisualValidator(options) {
        this.validator = {};
        this.options = options || {};
    }

    VisualValidator.prototype.validate = function (analyticsModel) {
        //var problems = [];
        //for (var i in analyticsModel.functions) {
        //    var fnUnit = analyticsModel.functions[i];
        //
        //    try {
        //        var problem = this.createValidator(fnUnit.func).validate(fnUnit, analyticsModel);
        //        if (problem) problems = problems.concat(problem);
        //    } catch (err) {
        //    }
        //}
        //problems = problems.filter(function (problem) {
        //    return typeof problem !== 'undefined' && problem != null;
        //});
        //analyticsModel.problemList = problems;
        //return analyticsModel.problemList;
        return [];
    };

    VisualValidator.prototype.createValidator = function (func) {
        //var clazz = root.Brightics.VA.Implementation.Script.Functions[func].validator;
        //if (this.validator[func]) {
        //    return this.validator[func];
        //} else {
        //    return this.validator[func] = clazz ? new clazz() : new Brightics.VA.Core.Validator.BaseValidator();
        //}
    };

    Brightics.VA.Implementation.Visual.Validator = VisualValidator;

}).call(this);