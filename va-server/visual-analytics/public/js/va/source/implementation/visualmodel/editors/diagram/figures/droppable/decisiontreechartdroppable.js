/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DecisionTreeChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['decisionTree'].call(this, parentId, options);
    }

    DecisionTreeChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['decisionTree'].prototype);
    DecisionTreeChartDroppable.prototype.constructor = DecisionTreeChartDroppable;

    DecisionTreeChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['decisionTree'] = DecisionTreeChartDroppable;

}).call(this);