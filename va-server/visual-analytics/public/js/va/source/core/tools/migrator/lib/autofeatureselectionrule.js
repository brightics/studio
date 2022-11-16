/**
 * Created by SDS on 2017-12-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function AutoFeatureSelectionRule() {
    }

    AutoFeatureSelectionRule.prototype.migrate = function (func) {
        var param = func.param;

        if (typeof param['max-num-features'] === 'undefined') {
            param['max-num-features'] = param['num-top-features'];
        }

        delete param['method-arr'];
        delete param['num-top-features'];
        delete param['on-exhaustive'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.autoFeatureSelection = AutoFeatureSelectionRule;

}).call(this);