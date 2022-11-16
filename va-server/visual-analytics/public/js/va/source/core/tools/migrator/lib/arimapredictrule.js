/**
 * Created by sds on 2017-11-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function ArimaPredictRule() {
    }

    ArimaPredictRule.prototype.migrate = function (func) {
        var param = func.param;
        delete param['groupby'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.arimaPredict = ArimaPredictRule;

}).call(this);