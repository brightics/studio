/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ScatterChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['scatter'].call(this, parentId, options);
    }

    ScatterChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['scatter'].prototype);
    ScatterChartDroppable.prototype.constructor = ScatterChartDroppable;

    ScatterChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['scatter'] = ScatterChartDroppable;

}).call(this);