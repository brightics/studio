/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PieChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['pie'].call(this, parentId, options);
    }

    PieChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['pie'].prototype);
    PieChartDroppable.prototype.constructor = PieChartDroppable;

    PieChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['pie'] = PieChartDroppable;

}).call(this);