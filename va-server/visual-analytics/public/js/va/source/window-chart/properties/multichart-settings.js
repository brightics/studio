/**
 * Created by sds on 2017-07-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /*
     multi chart option expander가 포함된 chart option property
     */
    function MultiChartSettingsProperty(parentId, options) {
        this.savedOption = _.clone(options.propOpt);
        Brightics.VA.Window.Property.ChartSettings.call(this, parentId, options);
    }

    MultiChartSettingsProperty.prototype = Object.create(Brightics.VA.Window.Property.ChartSettings.prototype);
    MultiChartSettingsProperty.prototype.constructor = MultiChartSettingsProperty;

    MultiChartSettingsProperty.prototype._init = function () {
        var _this = this;
        this.options.propOpt = _.assign({
            width: '33%',
            height: '350px',
            error: [],
            orderBy: {
                columns: [],
                sortMode: {}
            },
            title: []
        }, this.savedOption);

        var ControlContainer = Brightics.Chart.Adonis.Component.ControlContainer;

        Brightics.Chart.Adonis.Component.ControlContainer.Preview.MultiChartOption = function () {
            return '';
        };

        Brightics.Chart.Adonis.Component.ControlContainer.Factory.MultiChartOption = function (previewText) {
            return new ControlContainer({
                headerKey: 'MultiChartOption',
                headerLabel: 'Multi Chart Option',
                headerPreviewText: previewText,
                $parent: this.$parent,
                contentInit: function ($contentsArea, headerKey, option, controlList) {
                    controlList.push(new Brightics.Chart.Adonis.Component.Controls.GroupByControl($contentsArea, _this.options, headerKey));
                    var titleControl = new Brightics.Chart.Adonis.Component.Controls.MultiChartTitleControl($contentsArea, _this.options, headerKey);

                    _this.options.propOpt.orderChanged = function (changedInfo) {
                        titleControl.orderChanged(changedInfo);
                    };

                    var orderByControl = new Brightics.Chart.Adonis.Component.Controls.OrderByControl($contentsArea, _this.options, headerKey);

                    _this.options.propOpt.columnChanged = function (columns) {
                        var columnNames = columns.filter(function (column) {
                            return column;
                        }).map(function (column) {
                            return column.name;
                        });
                        titleControl.columnChanged(columnNames);
                        orderByControl.columnChanged(columnNames);
                    };

                    controlList.push(titleControl);
                    controlList.push(orderByControl);
                },
                optionRef: this.options,
                expanderStatus: {
                    'Multi Chart Option': true     //default expand되도록 수정
                }
            });
        };
    };

    MultiChartSettingsProperty.prototype._getPropertyType = function () {
        return 'multichartoption'
    };

    MultiChartSettingsProperty.prototype.getTitle = function () {
        return 'Properties';
    };


    MultiChartSettingsProperty.prototype._getChartOptionParameters = function () {
        var propertyOptions = Brightics.VA.Window.Property.ChartSettings.prototype._getChartOptionParameters.call(this);
        propertyOptions.chartTypeList = Object.keys(Brightics.Chart.Registry).filter(function (chartStr) {
            return !['table', 'dendrogram', 'biplot', 'decisionTree', 'decisionTreeForBrightics'].includes(chartStr)
        });
        propertyOptions.columnConf = {
            scatter: {
                xAxis: {
                    axisTypeList: []
                }
            },
            line: {
                xAxis: {
                    axisTypeList: []
                }
            },
            boxplot: {
                xAxis: {
                    axisTypeList: []
                }
            }
        };
        propertyOptions.getControlContainerList = function (defaultControls) {
            defaultControls.unshift('MultiChartOption');
            return defaultControls;
        };
        return propertyOptions;
    };

    MultiChartSettingsProperty.prototype.getPropertyOption = function () {
        var _this = this;
        var validColumnList = this.chartOption.chartOptionControl.options.setting.columnSelector;
        var rtnPropOpt = {
            width: _this.options.propOpt.width,
            height: _this.options.propOpt.height,
            groupBy: _this.options.propOpt.groupBy,
            orderBy: _this.options.propOpt.orderBy,
            title: _this.options.propOpt.title,
            layoutColumn: {},
            error: []
        };

        validColumnList.forEach(function (dataSetColumnLayouts) {
            dataSetColumnLayouts.forEach(function (layoutColumn) {
                rtnPropOpt.layoutColumn[layoutColumn.key] = layoutColumn.ref;
                if (layoutColumn.mandatory && (!rtnPropOpt.layoutColumn[layoutColumn.key] || !rtnPropOpt.layoutColumn[layoutColumn.key].selected[0])) {
                    rtnPropOpt.error.push('Select ' + layoutColumn.key + ' Column');
                }
            });
        });

        if (rtnPropOpt.title.length === 0) {
            rtnPropOpt.error.push('Select title column at least one.');
        }

        return rtnPropOpt;
    };

    root.Brightics.VA.Window.Property.MultiChartSettings = MultiChartSettingsProperty;
}).call(this);