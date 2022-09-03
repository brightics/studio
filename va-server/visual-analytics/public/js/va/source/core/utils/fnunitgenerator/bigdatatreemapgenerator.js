/**
 * Created by ji_sung.park on 2017-07-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataTreemapGenerator(options) {
        Brightics.VA.Core.Utils.FnUnitGenerator.call(this, options);
    }

    BigDataTreemapGenerator.prototype = Object.create(Brightics.VA.Core.Utils.FnUnitGenerator.prototype);
    BigDataTreemapGenerator.prototype.constructor = BigDataTreemapGenerator;

    BigDataTreemapGenerator.prototype.inputParams = function () {
        var param = this.fnUnit.param;
        var chartOptions = this.options.chartOptions;
        this.aggregation = '';

        if (chartOptions.plotOptions.treemap && chartOptions.plotOptions.treemap.hierarchyCol && chartOptions.plotOptions.treemap.hierarchyCol[0]) {
            param['hierarchy'] = [];
            for (var i in chartOptions.plotOptions.treemap.hierarchyCol[0].selected) {
                if (chartOptions.plotOptions.treemap.hierarchyCol[0].selected[i] && chartOptions.plotOptions.treemap.hierarchyCol[0].selected[i].name) {
                    param['hierarchy'].push([chartOptions.plotOptions.treemap.hierarchyCol[0].selected[i].name]);
                }
            }
        }
        
        if (chartOptions.plotOptions.treemap && chartOptions.plotOptions.treemap.sizeBy && chartOptions.plotOptions.treemap.sizeBy[0] && chartOptions.plotOptions.treemap.sizeBy[0].selected[0]) {
            param['size-by'] = [chartOptions.plotOptions.treemap.sizeBy[0].selected[0].name];
            this.aggregation = chartOptions.plotOptions.treemap.sizeBy[0].selected[0].aggregation;
        }

        this.setAggregationParam();
    };

    Brightics.VA.Core.Utils.FnUnitGenerator.treemap = BigDataTreemapGenerator;

}).call(this);