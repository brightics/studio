/**
 * Created by daewon.park on 2016-03-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.LinkFigure = joint.dia.Link.define('brtc.va.shapes.Link',
        {
            z: 1,
            router: {
                name: 'metro',
            },
            connector: {name: 'rounded'},
            attrs: {
                wrapper: {
                    connection: true,
                    strokeWidth: 10,
                    strokeLinejoin: 'round'
                },
                line: {
                    connection: true,
                    stroke: '#9FA7A2',
                    strokeWidth: 2,
                    strokeLinejoin: 'round',
                    targetMarker: {
                        'type': 'path',
                        'd': 'M 10 -5 0 0 10 5 z'
                    }
                }
            },
            kid: undefined,
            sourceFid: undefined,
            targetFid: undefined,
        },
        {
            markup: [
                {
                    tagName: 'path',
                    selector: 'wrapper',
                    className: 'connection-wrap',
                    attributes: {
                        'fill': 'none',
                        'cursor': 'pointer',
                        'stroke': 'transparent'
                    }
                },
                {
                    tagName: 'path',
                    selector: 'line',
                    attributes: {
                        'fill': 'none',
                        'pointer-events': 'none'
                    }
                }
            ],
            renderLabels: function () {
                return this;
            },
            renderTools: function () {
                return this;
            },
            renderVertexMarkers: function () {
                return this;
            },
            renderArrowheadMarkers: function () {
                return this;
            },
            select: function () {
                this.prop('selected', true);
                this.attr({
                    line: {
                        stroke: '#8993DE',
                        strokeWidth: 4
                    }
                });
            },
            unselect: function () {
                this.prop('selected', false);
                this.attr({
                    line: {
                        stroke: '#9FA7A2',
                        strokeWidth: 2
                    }
                });
            }
        }
    );

}).call(this);