(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ImageGridChartDroppable(parentId, options) {
        Brightics.Chart.Adonis.Component.ChartOption['image-grid'].call(this, parentId, options);
    }

    ImageGridChartDroppable.prototype = Object.create(Brightics.Chart.Adonis.Component.ChartOption['image-grid'].prototype);
    ImageGridChartDroppable.prototype.constructor = ImageGridChartDroppable;

    ImageGridChartDroppable.prototype._createContents = function () {
        this.options.contentsFactory.createContents(this.options.setting.columnSelector);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.Droppable['image-grid'] = ImageGridChartDroppable;
}).call(this);