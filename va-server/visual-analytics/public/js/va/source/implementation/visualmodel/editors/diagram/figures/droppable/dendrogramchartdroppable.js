/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DendrogramChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['histogram'].call(this, parentId, options);
    }

    DendrogramChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['dendrogram'].prototype);
    DendrogramChartDroppable.prototype.constructor = DendrogramChartDroppable;

    DendrogramChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['dendrogram'] = DendrogramChartDroppable;

}).call(this);