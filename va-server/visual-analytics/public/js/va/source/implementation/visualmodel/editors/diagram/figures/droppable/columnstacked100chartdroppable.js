/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ColumnStacked100ChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['column-stacked-100'].call(this, parentId, options);
    }

    ColumnStacked100ChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['column-stacked-100'].prototype);
    ColumnStacked100ChartDroppable.prototype.constructor = ColumnStacked100ChartDroppable;

    ColumnStacked100ChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['column-stacked-100'] = ColumnStacked100ChartDroppable;

}).call(this);