(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function AutoArimaPredictRule() {
    }

    AutoArimaPredictRule.prototype.migrate = function (func) {
        var param = func.param;
        delete param['groupby'];

        //change label: Auto Arima Train -> Auto ARIMA Train 170321/mk90.kim
        func.display.label = (func.display.label=== "Auto Arima Predict")? "Auto ARIMA Predict" : func.display.label;
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.autoArimaPredict = AutoArimaPredictRule;

}).call(this);