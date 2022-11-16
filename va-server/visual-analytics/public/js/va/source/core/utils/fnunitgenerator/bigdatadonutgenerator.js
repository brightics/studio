/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataDonutGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataDonutGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataDonutGenerator.prototype.constructor = BigDataDonutGenerator;

    BigDataDonutGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.plotOptions.donut && chartOptions.plotOptions.donut.sizeBy && chartOptions.plotOptions.donut.sizeBy[0] && chartOptions.plotOptions.donut.sizeBy[0].selected[0]) {
            param['size-by'] = [chartOptions.plotOptions.donut.sizeBy[0].selected[0].name];
            this.aggregation = chartOptions.plotOptions.donut.sizeBy[0].selected[0].aggregation;
        }else{
            param['size-by'] = [[]];
        }

        this.setAggregationParam();
        this.setColorByParam();
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.donut = BigDataDonutGenerator;

}).call(this);