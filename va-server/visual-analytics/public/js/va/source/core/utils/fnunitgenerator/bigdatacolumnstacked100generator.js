/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataColumnStacked100Generator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataColumnStacked100Generator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataColumnStacked100Generator.prototype.constructor = BigDataColumnStacked100Generator;

    BigDataColumnStacked100Generator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.xAxis && chartOptions.xAxis[0] && chartOptions.xAxis[0].selected && chartOptions.xAxis[0].selected[0]) {
            param['xcolumn'] = [[this.options.chartOptions.xAxis[0].selected[0].name]];
        }

        if (chartOptions.yAxis && chartOptions.yAxis[0] && chartOptions.yAxis[0].selected && chartOptions.yAxis[0].selected[0]) {
            param['ycolumn'] = [[this.options.chartOptions.yAxis[0].selected[0].name]];
            this.aggregation = chartOptions.yAxis[0].selected[0].aggregation;
        }

        this.setAggregationParam();
        this.setStackByParam();
    };

    BigDataColumnStacked100Generator.prototype.setStackByParam = function () {
        var chartOptions = this.options.chartOptions.plotOptions.column;
        var param = this.fnUnit.param;

        if (chartOptions.stackBy && chartOptions.stackBy[0] && chartOptions.stackBy[0].selected) {
            for (var i in chartOptions.stackBy[0].selected) {
                if (chartOptions.stackBy[0].selected[i] && chartOptions.stackBy[0].selected[i].name) {
                    param['color-by'].push(chartOptions.stackBy[0].selected[i].name);
                }
            }
        }
    };

    Brightics.VA.Core.Utils.FnUnitGenerator['column-stacked-100'] = BigDataColumnStacked100Generator;

}).call(this);