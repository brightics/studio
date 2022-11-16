(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function AutoArimaTrainRule() {
    }

    AutoArimaTrainRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['columns'] === 'undefined') {
            param['columns'] = param['column'] || [[]];
        }
        if (typeof param['maxP'] === 'undefined') {
            param['maxP'] = '';
        }
        if (typeof param['maxD'] === 'undefined') {
            param['maxD'] = '';
        }
        if (typeof param['maxQ'] === 'undefined') {
            param['maxQ'] = '';
        }

        delete param['column'];
        delete param['tolerance'];
        delete param['iteration'];
        delete param['groupby'];

        //change label: Auto Arima Train -> Auto ARIMA Train 170321/mk90.kim
        func.display.label = (func.display.label=== "Auto Arima Train")? "Auto ARIMA Train" : func.display.label;

        if (func['outData'].length == 1) {
            func['outData'].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.autoArimaTrain = AutoArimaTrainRule;

}).call(this);