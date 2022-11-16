/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function HeatmapChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['heatmap'].call(this, parentId, options);
    }

    HeatmapChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['heatmap'].prototype);
    HeatmapChartDroppable.prototype.constructor = HeatmapChartDroppable;

    HeatmapChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['heatmap'] = HeatmapChartDroppable;

}).call(this);