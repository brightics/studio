/**
 * Created by SDS on 2017-06-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function NaiveBayesPredictRule() {
    }

    NaiveBayesPredictRule.prototype.migrate = function (func) {

        var param = func.param;

        delete param['out-col-name'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.naiveBayesPredict = NaiveBayesPredictRule;

}).call(this);