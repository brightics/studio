/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BarChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['bar'].call(this, parentId, options);
    }

    BarChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['bar'].prototype);
    BarChartDroppable.prototype.constructor = BarChartDroppable;

    BarChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['bar'] = BarChartDroppable;

}).call(this);