/**
 * Created by SDS on 2017-06-10.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function IsotonicRegressionTrainRule() {
    }

    IsotonicRegressionTrainRule.prototype.migrate = function (func) {
        var param = func.param;

        if (typeof param['mode'] === 'undefined') {
            param['mode'] = '';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.isotonicRegressionTrain = IsotonicRegressionTrainRule;

}).call(this);