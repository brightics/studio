/**
 * Created by SDS on 2017-10-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AutoCorrelationRule() {
    }

    AutoCorrelationRule.prototype.migrate = function (func) {
        if (func.display.label === 'Auto Correlation') {
            func.display.label = 'AutoCorrelation'
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.autoCorrelation = AutoCorrelationRule;

}).call(this);