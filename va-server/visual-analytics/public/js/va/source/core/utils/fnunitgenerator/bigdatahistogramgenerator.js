/**
 * Created by ji_sung.park on 2017-07-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataHistogramGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataHistogramGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataHistogramGenerator.prototype.constructor = BigDataHistogramGenerator;

    BigDataHistogramGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;

        if (chartOptions.xAxis && chartOptions.xAxis[0] && chartOptions.xAxis[0].selected && chartOptions.xAxis[0].selected[0]) {
            param['column'] = this.options.chartOptions.xAxis[0].selected[0].name;
        }
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.histogram = BigDataHistogramGenerator;

}).call(this);