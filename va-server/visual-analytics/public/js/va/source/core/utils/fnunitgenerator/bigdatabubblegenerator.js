/**
 * Created by ji_sung.park on 2017-07-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataBubbleGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataBubbleGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataBubbleGenerator.prototype.constructor = BigDataBubbleGenerator;

    BigDataBubbleGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;

        if (chartOptions.xAxis && chartOptions.xAxis[0] && chartOptions.xAxis[0].selected && chartOptions.xAxis[0].selected[0]) {
            param['xcolumn'] = [[this.options.chartOptions.xAxis[0].selected[0].name]];
        }

        if (chartOptions.yAxis && chartOptions.yAxis[0] && chartOptions.yAxis[0].selected && chartOptions.yAxis[0].selected[0]) {
            param['ycolumn'] = [[this.options.chartOptions.yAxis[0].selected[0].name]];
        }

        this.setColorByParam();
        this.setSizeByParam();
    };

    BigDataBubbleGenerator.prototype.setSizeByParam = function () {
        var chartOptions = this.options.chartOptions.plotOptions.bubble;
        var param = this.fnUnit.param;

        if (chartOptions.sizeBy && chartOptions.sizeBy[0] && chartOptions.sizeBy[0].selected) {
            for (var i in chartOptions.sizeBy[0].selected) {
                if (chartOptions.sizeBy[0].selected[i] && chartOptions.sizeBy[0].selected[i].name) {
                    param['size-by'].push(chartOptions.sizeBy[0].selected[i].name);
                    param['aggregation'] = chartOptions.sizeBy[0].selected[0].aggregation;
                }
            }
        }else{
            param['size-by'] = [];
        }
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.bubble = BigDataBubbleGenerator;

}).call(this);