/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataBarStacked100Generator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataBarStacked100Generator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataBarStacked100Generator.prototype.constructor = BigDataBarStacked100Generator;

    BigDataBarStacked100Generator.prototype.inputParams = function () {
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
        this.setStackByParam();
    };

    BigDataBarStacked100Generator.prototype.setStackByParam = function () {
        var chartOptions = this.options.chartOptions.plotOptions.bar;
        var param = this.fnUnit.param;

        if (chartOptions.stackBy && chartOptions.stackBy[0] && chartOptions.stackBy[0].selected) {
            for (var i in chartOptions.stackBy[0].selected) {
                if (chartOptions.stackBy[0].selected[i] && chartOptions.stackBy[0].selected[i].name) {
                    param['color-by'].push(chartOptions.stackBy[0].selected[i].name);
                }
            }
        }else{
            param['color-by'] = [];
        }
    };

    Brightics.VA.Core.Utils.FnUnitGenerator['bar-stacked-100'] = BigDataBarStacked100Generator;

}).call(this);