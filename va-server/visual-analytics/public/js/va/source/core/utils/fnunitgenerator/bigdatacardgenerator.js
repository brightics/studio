/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataCardGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataCardGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataCardGenerator.prototype.constructor = BigDataCardGenerator;

    BigDataCardGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.plotOptions.card && chartOptions.plotOptions.card.valueBy && chartOptions.plotOptions.card.valueBy[0] && chartOptions.plotOptions.card.valueBy[0].selected[0]) {
            param['value'] = [[chartOptions.plotOptions.card.valueBy[0].selected[0].name]];
            this.aggregation = chartOptions.plotOptions.card.valueBy[0].selected[0].aggregation;
        }

        this.setAggregationParam();
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.card = BigDataCardGenerator;

}).call(this);