/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function HistogramChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['histogram'].call(this, parentId, options);
    }

    HistogramChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['histogram'].prototype);
    HistogramChartDroppable.prototype.constructor = HistogramChartDroppable;

    HistogramChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['histogram'] = HistogramChartDroppable;

}).call(this);