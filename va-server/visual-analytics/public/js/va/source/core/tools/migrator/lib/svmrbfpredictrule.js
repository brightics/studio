(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function SVMRBFPredictRule() {
    }

    SVMRBFPredictRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['hold-columns'] === 'undefined') {
            param['hold-columns'] = [];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.sVMRBFPredict = SVMRBFPredictRule;

}).call(this);