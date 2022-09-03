/**
 * Created by ty0314.kim on 2016-03-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DistributedJdbcLoaderValidator(fnUnit) {
        Brightics.VA.Core.Validator.BaseValidator.call(this, fnUnit);
    }

    DistributedJdbcLoaderValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    DistributedJdbcLoaderValidator.prototype.constructor = DistributedJdbcLoaderValidator;

    DistributedJdbcLoaderValidator.prototype.initRules = function () {

    };

    DistributedJdbcLoaderValidator.prototype.addEmptyInputRule = function (param, label) {
        var _this = this;
        this.addRule(function (fnUnit) {
            var msg = {
                errorCode: 'EE001',
                param: param,
                messageParam: [label]
            };
            return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param.sql.condition[param]);
        });
    };

    DistributedJdbcLoaderValidator.prototype.addDataSourceParamEmptyInputRule = function (param, label) {
        var _this = this;
        this.addRule(function (fnUnit) {
            var msg = {
                errorCode: 'EE001',
                param: param,
                messageParam: [label]
            };
            return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param.datasource[param]);
        });
    };

    DistributedJdbcLoaderValidator.prototype.addEmptyArrayRule = function (param, label) {
        var _this = this;
        this.addRule(function (fnUnit) {
            return _this._checkArrayIsEmpty({
                errorCode: 'EE001',
                param: param,
                messageParam: [label]
            }, fnUnit, fnUnit.param.sql.condition[param]);
        });
    };

    DistributedJdbcLoaderValidator.prototype.addDataSourceParamEmptyArrayRule = function (param, label) {
        var _this = this;
        this.addRule(function (fnUnit) {
            var msg = {
                errorCode: 'EE001',
                param: param,
                messageParam: [label]
            };
            return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param.datasource[param]);
        });
    };

    Brightics.VA.Core.Validator.DistributedJdbcLoaderValidator = DistributedJdbcLoaderValidator;

}).call(this);