/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function MapChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['map'].call(this, parentId, options);
    }

    MapChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['map'].prototype);
    MapChartDroppable.prototype.constructor = MapChartDroppable;

    MapChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents([]);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['map'] = MapChartDroppable;

}).call(this);