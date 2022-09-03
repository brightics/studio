/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataBoxPlotGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataBoxPlotGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataBoxPlotGenerator.prototype.constructor = BigDataBoxPlotGenerator;

    BigDataBoxPlotGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;

        if (chartOptions.xAxis && chartOptions.xAxis[0] && chartOptions.xAxis[0].selected && chartOptions.xAxis[0].selected[0]) {
            param['xcolumn'] = [[this.options.chartOptions.xAxis[0].selected[0].name]];
        }

        if (chartOptions.yAxis && chartOptions.yAxis[0] && chartOptions.yAxis[0].selected && chartOptions.yAxis[0].selected[0]) {
            param['ycolumn'] = [[this.options.chartOptions.yAxis[0].selected[0].name]];
        }

        //this.setColorByParam();
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.boxplot = BigDataBoxPlotGenerator;

}).call(this);