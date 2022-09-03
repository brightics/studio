/**
 * Created by ji_sung.park on 2017-07-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataHeatmapMatrixGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataHeatmapMatrixGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataHeatmapMatrixGenerator.prototype.constructor = BigDataHeatmapMatrixGenerator;

    BigDataHeatmapMatrixGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.xAxis && chartOptions.xAxis[0] && chartOptions.xAxis[0].selected) {
            param['xcolumn'] = [];
            for (var i in chartOptions.xAxis[0].selected) {
                if (chartOptions.xAxis[0].selected[i] && chartOptions.xAxis[0].selected[i].name) {
                    param['xcolumn'].push([chartOptions.xAxis[0].selected[i].name]);
                }
            }
        }

        if (chartOptions.yAxis && chartOptions.yAxis[0] && chartOptions.yAxis[0].selected && chartOptions.yAxis[0].selected[0]) {
            param['ycolumn'] = [[chartOptions.yAxis[0].selected[0].name]];
        }
    };

    Brightics.VA.Core.Utils.FnUnitGenerator['heatmap-matrix'] = BigDataHeatmapMatrixGenerator;

}).call(this);