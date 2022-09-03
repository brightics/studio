/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CardChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['card'].call(this, parentId, options);
    }

    CardChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['card'].prototype);
    CardChartDroppable.prototype.constructor = CardChartDroppable;

    CardChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['card'] = CardChartDroppable;

}).call(this);