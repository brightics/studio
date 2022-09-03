/**
 * Created by ji_sung.park on 2017-07-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    const DUMMY_FNUNIT = {
        'func': 'dummy',
        'name': 'BigDataDummy',
        'inData': [],
        'outData': [],
        'param': {},
        'label': 'Big Data Dummy',
        'display': {
            'label': 'Big Data Dummy',
            'diagram': {
                'position': {
                    'x': 20,
                    'y': 10
                }
            },
            'sheet': {
                'out': [
                    {
                        'panel': [],
                        'layout': {}
                    }
                ]
            }
        },
        'mandatory': []
    };
    const CHART_TYPE_FUNCS = {
        "scatter": "bigDataScatter",
        "line": "bigDataLine",
        "area": "bigDataLine",
        "area-stacked": "bigDataColumn",
        "area-stacked-100": "bigDataColumn",
        "roccurve": "bigDataLine",
        "pie": "bigDataPie",
        "column": "bigDataColumn",
        "column-stacked": "bigDataColumn",
        "column-stacked-100": "bigDataColumn",
        "bar": "bigDataColumn",
        "bar-stacked": "bigDataColumn",
        "bar-stacked-100": "bigDataColumn",
        "histogram": "bigDataHistogram",
        "boxplot": "bigDataBoxPlot",
        'bubble': 'bigDataBubble',
        'card': 'bigDataCard',
        'heatmap': 'bigDataHeatmap',
        'heatmap-matrix': 'bigDataHeatmapMatrix',
        'treemap': 'bigDataTreemap',
        'donut': "bigDataPie"
    };

    function FnUnitGenerator(options) {
        this.options = options || {};
    }

    FnUnitGenerator.prototype.initFnUnit = function () {
        var chartOptions = this.options.chartOptions;
        var chartType = chartOptions.chart.type;
        var func = CHART_TYPE_FUNCS[chartType];
        var fnUnit = Brightics.VA.Core.Functions.Library.getFunction(func).defaultFnUnit;
        if (!fnUnit) fnUnit = $.extend(true, {}, DUMMY_FNUNIT);
        fnUnit.fid = Brightics.VA.Core.Utils.IDGenerator.func.id();
        this.fnUnit = fnUnit;
    };

    FnUnitGenerator.prototype.inputParams = function () {
        // abstract function
    };

    FnUnitGenerator.prototype.setColorByParam = function () {
        var chartOptions = this.options.chartOptions;
        var param = this.fnUnit.param;

        if (chartOptions.colorBy && chartOptions.colorBy[0] && chartOptions.colorBy[0].selected) {
            for (var i in chartOptions.colorBy[0].selected) {
                if (chartOptions.colorBy[0].selected[i] && chartOptions.colorBy[0].selected[i].name) {
                    if (_.isEmpty(param['color-by'])) param['color-by'] = [];
                    param['color-by'].push(chartOptions.colorBy[0].selected[i].name);
                }
            }
        }
    };

    FnUnitGenerator.prototype.setAggregationParam = function () {
        var param = this.fnUnit.param;

        var agg = this.aggregation;

        if (!agg || agg == '') {
            delete param['aggregation'];
            return;
        }
        if (agg == 'average') agg = 'avg';
        if (agg == 'unique_count') agg = 'ucount';
        param['aggregation'] = agg;
    };

    FnUnitGenerator.prototype.generate = function () {
        this.initFnUnit();
        this.inputParams();
        return $.extend(true, {}, this.fnUnit);
    };


    Brightics.VA.Core.Utils.FnUnitGenerator = FnUnitGenerator;

}).call(this);