/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BarStacked100ChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['bar-stacked-100'].call(this, parentId, options);
    }

    BarStacked100ChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['bar-stacked-100'].prototype);
    BarStacked100ChartDroppable.prototype.constructor = BarStacked100ChartDroppable;

    BarStacked100ChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['bar-stacked-100'] = BarStacked100ChartDroppable;

}).call(this);