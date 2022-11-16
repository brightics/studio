(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function ChartMigrator() {
    }

    ChartMigrator.prototype.migrate = function (sheet) {
        if (typeof sheet === 'undefined') return;
        if (sheet.in && sheet.in.length > 0) {
            this.sliceChartOpion(sheet.in);
            sheet.in = this.migrateSheetOption(sheet.in);
        } else if (sheet.in && sheet.in.full && sheet.in.full.length == 0) {
            sheet.in.full = [{'panel': [], 'layout': {}}];
        }

        if (sheet.out && sheet.out.length > 0) {
            this.sliceChartOpion(sheet.out);
            sheet.out = this.migrateSheetOption(sheet.out);
        } else if (sheet.out && sheet.out.full && sheet.out.full.length == 0) {
            sheet.out.full = [{'panel': [], 'layout': {}}];
        }

        this.doMigrationSource(sheet);
    };

    ChartMigrator.prototype.doMigrationSource = function (sheet) {
        for (var inOutKey in sheet) {
            for (var fpKey in sheet[inOutKey]) {
                var fpSheet = sheet[inOutKey][fpKey];
                for (var sheetIndex in fpSheet) {
                    var panels = fpSheet[sheetIndex].panel;
                    for (var panelIndex in panels) {
                        if (!(panels[panelIndex] && panels[panelIndex].chartOption)) continue;
                        if (panels[panelIndex].chartOption.source && panels[panelIndex].chartOption.source.localData) panels[panelIndex].chartOption.source.localData = [];
                        if (panels[panelIndex].chartOption.source && panels[panelIndex].chartOption.source.lazyData) panels[panelIndex].chartOption.source.lazyData = [];
                    }
                }
            }
        }
    };

    ChartMigrator.prototype.sliceChartOpion = function (sheetList) {
        var _this = this;
        if (typeof sheetList === 'undefined' || sheetList.length === 0) return;
        sheetList.forEach(function (sheet) {
            if (sheet.panel && sheet.panel.length > 0) {
                sheet.panel.forEach(function (chartPanel) {
                    if (chartPanel) _this.doMigration(chartPanel.chartOption);
                })
            }
        });

    };

    ChartMigrator.prototype.doMigration = function (chartOption) {
        if (typeof chartOption === 'undefined' || typeof chartOption.chart === 'undefined' || typeof chartOption.chart.type === 'undefined') return;
        if (typeof chartOption['xAxis'] === 'undefined' || chartOption['xAxis'].constructor === Array) return;

        this.doMigrationAxis(chartOption, 'xAxis');
        this.doMigrationAxis(chartOption, 'yAxis');
        this.doMigrationAxis(chartOption, 'colorBy');

        this.configurePreVersionOptions(chartOption);
    };

    ChartMigrator.prototype.doMigrationAxis = function (chartOption, axisName) {
        if (chartOption[axisName].constructor === Object) {
            chartOption[axisName] = [chartOption[axisName]];
        }
    };

    ChartMigrator.prototype.configurePreVersionOptions = function (chartOption) {
        this.changePreVersionChartToTable(chartOption);
        this.configurePreVersionChartOptions(chartOption);
        this.deletePreVersionChartOptions(chartOption)
    };

    ChartMigrator.prototype.changePreVersionChartToTable = function (chartOption) {
        var deletedChartTypes = ['treediagram', 'mcc', 'dendrogram', 'treemap', 'correlation-matrix'];
        if (deletedChartTypes.indexOf(chartOption.chart.type) >= 0) {
            chartOption.chart = {
                type: 'table'
            };
        }

    };


    ChartMigrator.prototype.configurePreVersionChartOptions = function (chartOption) {

        if (chartOption.chart.type === 'heatmap') {
            chartOption.plotOptions = {
                heatmap: {
                    valueBy: [chartOption.valueBy]
                }
            }
        }

        if (chartOption.chart.type === 'pie') {
            chartOption.plotOptions = {
                pie: {
                    sizeBy: [chartOption.sizeBy]
                }
            }
        }

        if (chartOption.chart.type === 'network') {
            chartOption.plotOptions = {
                network: {
                    fromColumn: [chartOption.fromCol],
                    toColumn: [chartOption.toCol]
                }
            }
        }

        if (chartOption.chart.type === 'roc') {
            chartOption.chart.type = 'roccurve';
        }

    };


    ChartMigrator.prototype.deletePreVersionChartOptions = function (chartOption) {
        var preVersionKeys = ['stripLines', 'trendLines', 'groupBy', 'lineBy', 'valueBy', 'sizeBy', 'shapeBy', 'fromCol', 'toCol', 'conditionCol',
            'nodeLabelCol', 'edgeLabelCol', 'parentCol', 'childCol', 'valueCol', 'clusterCol', 'clusterGroupCol', 'heightCol', 'typeCol', 'columnFormatters'];

        for (const key of preVersionKeys) {
            delete chartOption[key];
        }
    };

    ChartMigrator.prototype.migrateSheetOption = function (sheet) {
        return {
            partial: sheet,
            full: [{'panel': [], 'layout': {}}]
        };
    };

    Brightics.VA.Core.Tools.ChartMigrator = ChartMigrator;

}).call(this);