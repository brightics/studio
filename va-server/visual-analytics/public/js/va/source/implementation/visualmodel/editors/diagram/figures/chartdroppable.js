/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChartDroppable(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.init();

        this.retrieveParent();
        this.createControls();
    }

    ChartDroppable.prototype.init = function () {
    };

    ChartDroppable.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ChartDroppable.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-va-visual-droppable">' +
            '   <div class="brtc-va-visual-droppable-contents"></div>' +
            '</div>');

        if(_this.options.chartOption.chart.type !== 'map') {
            this.$mainControl.css({
                width: this.options.width,
                height: this.options.height
            });
            this.$parent.append(this.$mainControl);
            this.$contents = this.$mainControl.find('.brtc-va-visual-droppable-contents');

            var defaultChartOptions = Brightics.Chart.Registry[this.options.chartOption.chart.type].DefaultOptions;
            this.chartOption = new Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable[this.options.chartOption.chart.type](this.$mainControl, $.extend(true, {}, {
                chartOption: defaultChartOptions,
                dataSource: {},
                setting: {},
                contentsFactory: {
                    createContents: function (contentsOption) {
                        for (var chartIdx = 0; chartIdx < contentsOption.length; chartIdx++) {
                            contentsOption[chartIdx].forEach(function (columnSettings) {
                                var widgetOptions = {
                                    selected: $.extend(true, [], columnSettings.ref.selected),
                                    multiple: columnSettings.multiple || false,
                                    aggregation: columnSettings.aggregation || false,
                                    label: columnSettings.label,
                                    columns: [],
                                    onChanged: function (changedColumnInfo) {
                                        delete columnSettings.ref.axisType
                                        columnSettings.ref.selected = changedColumnInfo;

                                        var callbackParam;
                                        if (typeof columnSettings.getColumnChangedOption === 'function') callbackParam = columnSettings.getColumnChangedOption(changedColumnInfo);
                                        else {
                                            callbackParam = {};
                                            callbackParam[columnSettings.key] = [];
                                            callbackParam[columnSettings.key][0] = columnSettings.ref;
                                        }

                                        _this.options.onChartOptionChanged(callbackParam);
                                    }
                                };
                                if (columnSettings.mandatory) Brightics.Chart.Adonis.Component.Widgets.Factory.createColumnSelectorDroppableWidget(_this.$contents, widgetOptions);
                            });
                        }
                    }
                }
            }, this.options));
        }
        
        this.$mainControl.find('.ui-droppable').on('drop', function (event, ui) {
            event.stopPropagation();
        });
    };

    ChartDroppable.prototype.dispose = function () {
        this.$mainControl.remove();
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.ChartDroppable = ChartDroppable;
}).call(this);