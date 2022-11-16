/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TreemapChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['treemap'].call(this, parentId, options);
    }

    TreemapChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['treemap'].prototype);
    TreemapChartDroppable.prototype.constructor = TreemapChartDroppable;

    TreemapChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['treemap'] = TreemapChartDroppable;

}).call(this);