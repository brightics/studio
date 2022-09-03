/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function HeatmapMatrixChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['heatmap-matrix'].call(this, parentId, options);
    }

    HeatmapMatrixChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['heatmap-matrix'].prototype);
    HeatmapMatrixChartDroppable.prototype.constructor = HeatmapMatrixChartDroppable;

    HeatmapMatrixChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['heatmap-matrix'] = HeatmapMatrixChartDroppable;

}).call(this);