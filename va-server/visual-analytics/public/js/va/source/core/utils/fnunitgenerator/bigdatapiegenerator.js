/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataPieGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataPieGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataPieGenerator.prototype.constructor = BigDataPieGenerator;

    BigDataPieGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.plotOptions.pie && chartOptions.plotOptions.pie.sizeBy && chartOptions.plotOptions.pie.sizeBy[0] && chartOptions.plotOptions.pie.sizeBy[0].selected[0]) {
            param['size-by'] = [chartOptions.plotOptions.pie.sizeBy[0].selected[0].name];
            this.aggregation = chartOptions.plotOptions.pie.sizeBy[0].selected[0].aggregation;
        }else{
            param['size-by'] = [[]];
        }

        this.setAggregationParam();
        this.setColorByParam();
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.pie = BigDataPieGenerator;

}).call(this);