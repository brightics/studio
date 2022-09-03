/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ColumnStackedChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['column-stacked'].call(this, parentId, options);
    }

    ColumnStackedChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['column-stacked'].prototype);
    ColumnStackedChartDroppable.prototype.constructor = ColumnStackedChartDroppable;

    ColumnStackedChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['column-stacked'] = ColumnStackedChartDroppable;

}).call(this);