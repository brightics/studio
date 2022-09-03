/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BubbleChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['histogram'].call(this, parentId, options);
    }

    BubbleChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['bubble'].prototype);
    BubbleChartDroppable.prototype.constructor = BubbleChartDroppable;

    BubbleChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['bubble'] = BubbleChartDroppable;

}).call(this);