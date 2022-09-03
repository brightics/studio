/**
 * Created by daewon.park on 2016-03-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Core.Shapes.LinkFigure = joint.dia.Link.extend({
        showRemoveButton: function () {
            this.attr('.link-tools/display', 'block');
            this.attr('.marker-arrowheads/display', 'block');
            this.attr('.connection/stroke-width', '4');
            this.attr('.connection/style', 'stroke: #656EEA');
            this.attr('.marker-target/style', 'stroke: #656EEA; fill: #656EEA');
        },
        hideRemoveButton: function () {
            this.attr('.link-tools/display', 'none');
            this.attr('.marker-arrowheads/display', 'none');
            this.attr('.connection/stroke-width', '2');
            this.attr('.connection/style', 'stroke: #9FA7A2');
            this.attr('.marker-target/style', 'stroke: #9FA7A2; fill: #9FA7A2');
        },
        defaults: joint.util.deepSupplement({
            type: 'brtc.va.shapes.Link',
            router: {name: 'metro'},
            connector: {name: 'rounded'},
            attrs: {
                '.connection': {stroke: '#9FA7A2', 'stroke-width': 2},
                '.marker-target': {fill: '#9FA7A2', stroke: '#9FA7A2', d: 'M 8 0 L 0 4 L 8 8 z'},
                '.marker-arrowhead': {fill: '#9FA7A2', stroke: '#9FA7A2', d: 'M-8,0a8,8 0 1,0 16,0a8,8 0 1,0 -16,0'},
                '.link-tools': {display: 'none'},
                '.marker-arrowheads': {display: 'none'}
            }
        })
    });

}).call(this);