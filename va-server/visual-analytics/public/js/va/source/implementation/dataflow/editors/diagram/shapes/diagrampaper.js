/**
 * Created by daewon.park on 2016-03-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.DiagramPaper = joint.dia.Paper.extend({
        sortViews: _.noop,
        initialize: function () {
            joint.dia.Paper.prototype.initialize.apply(this, arguments);
        }
    });

}).call(this);