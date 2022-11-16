/**
 * Created by SDS on 2017-10-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function TimeSeriesDecompositionRule() {
    }

    TimeSeriesDecompositionRule.prototype.migrate = function (func) {
        var param = func.param;

        if (Array.isArray(param['column'][0]) == true){
            param['column'] = param['column'][0];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.timeSeriesDecomposition = TimeSeriesDecompositionRule;

}).call(this);