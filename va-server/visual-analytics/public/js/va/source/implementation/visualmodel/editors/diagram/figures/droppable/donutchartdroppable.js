/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DonutChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['donut'].call(this, parentId, options);
    }

    DonutChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['donut'].prototype);
    DonutChartDroppable.prototype.constructor = DonutChartDroppable;

    DonutChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['donut'] = DonutChartDroppable;

}).call(this);