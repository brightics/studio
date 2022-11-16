/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BarStackedChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['bar-stacked'].call(this, parentId, options);
    }

    BarStackedChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['bar-stacked'].prototype);
    BarStackedChartDroppable.prototype.constructor = BarStackedChartDroppable;

    BarStackedChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['bar-stacked'] = BarStackedChartDroppable;

}).call(this);