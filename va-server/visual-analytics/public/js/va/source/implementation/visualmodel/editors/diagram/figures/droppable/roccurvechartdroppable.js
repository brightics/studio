/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ROCCurveChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['roccurve'].call(this, parentId, options);
    }

    ROCCurveChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['roccurve'].prototype);
    ROCCurveChartDroppable.prototype.constructor = ROCCurveChartDroppable;

    ROCCurveChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['roccurve'] = ROCCurveChartDroppable;

}).call(this);