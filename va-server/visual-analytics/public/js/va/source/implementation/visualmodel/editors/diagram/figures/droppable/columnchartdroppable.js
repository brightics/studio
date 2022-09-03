/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ColumnChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['column'].call(this, parentId, options);
    }

    ColumnChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['column'].prototype);
    ColumnChartDroppable.prototype.constructor = ColumnChartDroppable;

    ColumnChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['column'] = ColumnChartDroppable;

}).call(this);