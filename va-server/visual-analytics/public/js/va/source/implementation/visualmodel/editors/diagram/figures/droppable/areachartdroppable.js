/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AreaChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['area'].call(this, parentId, options);
    }

    AreaChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['area'].prototype);
    AreaChartDroppable.prototype.constructor = AreaChartDroppable;

    AreaChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['area'] = AreaChartDroppable;

}).call(this);