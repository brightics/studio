(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function GaussianMixtureTrainRule() {
    }

    GaussianMixtureTrainRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['columns'] === 'undefined') {
            param['columns'] = [[]];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.gaussianMixtureTrain = GaussianMixtureTrainRule;

}).call(this);