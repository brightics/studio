/**
 * Created by SDS on 2018-08-10.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AutoLogisticRegressionTrainRule() {
    }

    AutoLogisticRegressionTrainRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['search-method'] === 'undefined') {
            param['search-method'] = 'random';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.autoLogisticRegressionTrain = AutoLogisticRegressionTrainRule;

}).call(this);