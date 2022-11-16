/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TableChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['table'].call(this, parentId, options);
    }

    TableChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['table'].prototype);
    TableChartDroppable.prototype.constructor = TableChartDroppable;

    TableChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['table'] = TableChartDroppable;

}).call(this);