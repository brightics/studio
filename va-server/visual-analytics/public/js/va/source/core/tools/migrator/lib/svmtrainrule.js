(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function SVMTrainRule() {
    }

    SVMTrainRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['reg-param'] === 'undefined') {
            param['reg-param'] = param['reg-parm'] || '';
        }
        delete param['reg-parm'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.svmTrain = SVMTrainRule;

}).call(this);