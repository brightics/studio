(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function GaussianMixturePredictRule() {
    }

    GaussianMixturePredictRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['columns'] === 'undefined') {
            param['columns'] = [[]];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.gaussianMixturePredict = GaussianMixturePredictRule;

}).call(this);