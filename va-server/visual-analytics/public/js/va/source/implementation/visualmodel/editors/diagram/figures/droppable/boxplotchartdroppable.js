/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BoxPlotChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['boxplot'].call(this, parentId, options);
    }

    BoxPlotChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['boxplot'].prototype);
    BoxPlotChartDroppable.prototype.constructor = BoxPlotChartDroppable;

    BoxPlotChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['boxplot'] = BoxPlotChartDroppable;

}).call(this);