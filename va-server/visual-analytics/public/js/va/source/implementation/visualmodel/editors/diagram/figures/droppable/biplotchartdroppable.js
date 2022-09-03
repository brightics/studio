/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BiPlotChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['biplot'].call(this, parentId, options);
    }

    BiPlotChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['biplot'].prototype);
    BiPlotChartDroppable.prototype.constructor = BiPlotChartDroppable;

    BiPlotChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['biplot'] = BiPlotChartDroppable;

}).call(this);