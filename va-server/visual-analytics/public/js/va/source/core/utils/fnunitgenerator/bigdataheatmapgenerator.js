/**
 * Created by ji_sung.park on 2017-07-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataHeatmapGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataHeatmapGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataHeatmapGenerator.prototype.constructor = BigDataHeatmapGenerator;

    BigDataHeatmapGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.xAxis && chartOptions.xAxis[0] && chartOptions.xAxis[0].selected && chartOptions.xAxis[0].selected[0]) {
            param['xcolumn'] = [[this.options.chartOptions.xAxis[0].selected[0].name]];
        }

        if (chartOptions.yAxis && chartOptions.yAxis[0] && chartOptions.yAxis[0].selected && chartOptions.yAxis[0].selected[0]) {
            param['ycolumn'] = [[this.options.chartOptions.yAxis[0].selected[0].name]];
        }

        this.setValueByParam();
        this.setAggregationParam();
    };

    BigDataHeatmapGenerator.prototype.setValueByParam = function () {
        var chartOptions = this.options.chartOptions.plotOptions.heatmap;
        var param = this.fnUnit.param;

        if (chartOptions.valueBy && chartOptions.valueBy[0] && chartOptions.valueBy[0].selected) {
            for (var i in chartOptions.valueBy[0].selected) {
                if (chartOptions.valueBy[0].selected[i] && chartOptions.valueBy[0].selected[i].name) {
                    param['value-by'].push(chartOptions.valueBy[0].selected[i].name);
                    this.aggregation = chartOptions.valueBy[0].selected[0].aggregation;
                }
            }
        }else{
            param['value-by'] = [];
        }
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.heatmap = BigDataHeatmapGenerator;

}).call(this);