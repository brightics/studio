/**
 * Created by ji_sung.park on 2017-04-10.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function ChartRule() {
    }

    ChartRule.prototype.migrate = function (func) {
        func.func = 'bigDataScatter';
        func.name = 'BigDataScatter';
        var param = func.param;
        if (typeof param['color-by'] === 'undefined'){
            param['color-by'] = [];
        }

        /*var param = func.param;
        if (typeof param['flag'] === 'undefined') {
            param['flag'] = 'true';
        }*/
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.chart = ChartRule;

}).call(this);