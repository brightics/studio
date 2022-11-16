/**
 * Created by SDS on 2017-06-15.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function StratifiedSamplingRule() {
    }

    StratifiedSamplingRule.prototype.migrate = function (func) {

        var param = func.param;

        delete param['accuracy'];
        delete param['groups'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.stratifiedSampling = StratifiedSamplingRule;

}).call(this);