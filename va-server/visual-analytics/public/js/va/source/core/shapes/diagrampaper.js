/**
 * Created by daewon.park on 2016-03-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Core.Shapes.DiagramPaper = joint.dia.Paper.extend({
        initialize: function () {
            joint.dia.Paper.prototype.initialize.apply(this, arguments);
        }
    });

}).call(this);