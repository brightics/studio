/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataBarGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataBarGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataBarGenerator.prototype.constructor = BigDataBarGenerator;

    BigDataBarGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.xAxis && chartOptions.xAxis[0] && chartOptions.xAxis[0].selected && chartOptions.xAxis[0].selected[0]) {
            param['ycolumn'] = [[this.options.chartOptions.xAxis[0].selected[0].name]];
            this.aggregation = chartOptions.xAxis[0].selected[0].aggregation;
        }

        if (chartOptions.yAxis && chartOptions.yAxis[0] && chartOptions.yAxis[0].selected && chartOptions.yAxis[0].selected[0]) {
            param['xcolumn'] = [[this.options.chartOptions.yAxis[0].selected[0].name]];
        }

        this.setAggregationParam();
        this.setColorByParam();
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.bar = BigDataBarGenerator;

}).call(this);