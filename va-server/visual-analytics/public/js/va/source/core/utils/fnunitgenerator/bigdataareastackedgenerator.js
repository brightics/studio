/**
 * Created by ji_sung.park on 2017-07-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataAreaStackedGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataAreaStackedGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataAreaStackedGenerator.prototype.constructor = BigDataAreaStackedGenerator;

    BigDataAreaStackedGenerator.prototype.inputParams = function () {
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

    BigDataAreaStackedGenerator.prototype.setStackByParam = function () {
        var chartOptions = this.options.chartOptions.plotOptions.area;
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

    Brightics.VA.Core.Utils.FnUnitGenerator['area-stacked'] = BigDataAreaStackedGenerator;

}).call(this);