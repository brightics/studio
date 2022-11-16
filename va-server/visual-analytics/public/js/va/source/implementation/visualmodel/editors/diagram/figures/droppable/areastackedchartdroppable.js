/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AreaStackedChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['area-stacked'].call(this, parentId, options);
    }

    AreaStackedChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['area-stacked'].prototype);
    AreaStackedChartDroppable.prototype.constructor = AreaStackedChartDroppable;

    AreaStackedChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };
    
    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['area-stacked'] = AreaStackedChartDroppable;

}).call(this);