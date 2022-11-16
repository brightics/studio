/**
 * Created by SDS on 2017-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NetworkChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['network'].call(this, parentId, options);
    }

    NetworkChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['network'].prototype);
    NetworkChartDroppable.prototype.constructor = NetworkChartDroppable;

    NetworkChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['network'] = NetworkChartDroppable;

}).call(this);