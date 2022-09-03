/**
 * Created by sds on 2017-07-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChartSettingsProperty(parentId, options) {
        Brightics.VA.Window.Property.call(this, parentId, options);
    }

    ChartSettingsProperty.prototype = Object.create(Brightics.VA.Window.Property.prototype);
    ChartSettingsProperty.prototype.constructor = ChartSettingsProperty;

    ChartSettingsProperty.prototype._getPropertyType = function () {
        return 'chart-settings'
    };

    ChartSettingsProperty.prototype.getTitle = function () {
        return 'Chart Settings';
    };

    ChartSettingsProperty.prototype.createBody = function ($container) {
        var propertyOptions = this._getChartOptionParameters();
        this.chartOption = new Brightics.Chart.Adonis.Component.ChartOption($container, propertyOptions);

    };

    ChartSettingsProperty.prototype._getChartOptionParameters = function () {
        var chartOption = $.extend(true, this.options.chartOption, {
            source: {
                dataType: 'lazy',
                lazyData: [{
                    columns: this.options.datasource.columns,
                    data: function (prepare) {
                    }
                }]
            },
            plotOptions:{
                map: {
                    geoData: {
                        url: function(mapName){
                            return 'api/va/v2/map/' + mapName
                        }
                    }
                }
            }
        });
        var _this = this;
        var propertyOptions = {
            chartOption: chartOption,
            chartTypeSelectable: true,
            callBack: {
                onChartOptionChanged: function (chartOptions) {
                    for (var key in chartOptions) {
                        _this.options.chartOption[key] = chartOptions[key];
                    }
                },
                onChartTypeChanged: function (chartOptions) {
                    for (var key in chartOptions) {
                        _this.options.chartOption[key] = chartOptions[key];
                    }
                }
            }
        };

        return propertyOptions;
    };

    root.Brightics.VA.Window.Property.ChartSettings = ChartSettingsProperty;

}).call(this);