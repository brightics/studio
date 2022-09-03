/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AreaStacked100ChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['area-stacked-100'].call(this, parentId, options);
    }

    AreaStacked100ChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['area-stacked-100'].prototype);
    AreaStacked100ChartDroppable.prototype.constructor = AreaStacked100ChartDroppable;

    AreaStacked100ChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['area-stacked-100'] = AreaStacked100ChartDroppable;

}).call(this);