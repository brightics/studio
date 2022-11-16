/**
 * Created by SDS on 2017-06-16.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function ArimaTrainRule() {
    }

    ArimaTrainRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['intercept'] === 'undefined') {
            param['intercept'] = 'true';
        }

        delete param['groupby'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.arimaTrain = ArimaTrainRule;

}).call(this);