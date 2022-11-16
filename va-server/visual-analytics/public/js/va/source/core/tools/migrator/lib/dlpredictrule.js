/**
 * Created by SDS on 2017-06-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function DLPredictRule() {
    }

    DLPredictRule.prototype.migrate = function (func) {
        if (!func['inData']) {
            func['inData'] = [];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.dlPredict = DLPredictRule;

}).call(this);