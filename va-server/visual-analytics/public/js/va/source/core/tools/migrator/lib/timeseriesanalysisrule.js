(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function TimeSeriesAnalysisRule() {
    }

    TimeSeriesAnalysisRule.prototype.migrate = function (func) {
        func.display.label = (func.display.label === "Time Series Autonomous") ? "Autonomous Time Series" : func.display.label;

        if (func['outData'].length > 2) {
            func['outData'].splice(2, func['outData'].length - 2);
        }

        var param = func.param;
        if (typeof param['score'] === 'undefined') {
            param['score'] = 'trainRank';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.timeSeriesAnalysis = TimeSeriesAnalysisRule;

}).call(this);