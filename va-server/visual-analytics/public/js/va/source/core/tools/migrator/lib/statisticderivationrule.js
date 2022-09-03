/**
 * Created by SDS on 2017-06-15.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function StatisticDerivationRule() {
    }

    StatisticDerivationRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['percentile-amounts'] === 'undefined') {
            param['percentile-amounts'] = [];
        }
        if (typeof param['trimmed-mean-amounts'] === 'undefined') {
            param['trimmed-mean-amounts'] = [];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.statisticDerivation = StatisticDerivationRule;

}).call(this);