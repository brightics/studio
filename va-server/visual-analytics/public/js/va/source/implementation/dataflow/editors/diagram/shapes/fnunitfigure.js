/**
 * Created by daewon.park on 2016-02-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    // width: 225, height: 58
    Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.FnUnitFigure = joint.dia.Element.define('brtc.va.shapes.FnUnit',
        {
            fid: undefined,
            inputtable: undefined,
            outputtable: undefined,
            connectableFunctions: undefined,
            acceptableFunctions: undefined,
            z: 2,
            size: {
                width: Brightics.VA.Env.Diagram.FIGURE_WIDTH,
                height: Brightics.VA.Env.Diagram.FIGURE_HEIGHT
            },
            colorSet: {
                READY: '#E5E9EF',
                DEPRECATED: '#D3D3D3',
                PROCESSING: 'blue',
                SUCCESS: '#58bd7c',
                FAIL: 'red'
            },
            ports: {
                groups: {
                    'in:l': {
                        z: 2,
                        size: 0,
                        position: {
                            name: 'left',
                        },
                        attrs: {
                            magnet: true
                        }
                    },
                    'out:r': {
                        z: 2,
                        size: 0,
                        position: {
                            name: 'right',
                        },
                        attrs: {
                            magnet: true
                        }
                    }
                },
                items: [{
                    id: 'in-left',
                    group: 'in:l'
                }, {
                    id: 'out-right',
                    group: 'out:r'
                }]
            },
            attrs: {
                '.brtc-va-bounds': {
                    fill: '#DFDFEF',
                    'fill-opacity': 0,
                    width: Brightics.VA.Env.Diagram.FIGURE_WIDTH,
                    height: Brightics.VA.Env.Diagram.FIGURE_HEIGHT
                },
                '.brtc-va-outer': {
                    fill: '#FFFFFF',
                    ref: '.brtc-va-bounds',
                    'ref-y': 6,
                    width: Brightics.VA.Env.Diagram.FIGURE_WIDTH - 5,
                    height: Brightics.VA.Env.Diagram.FIGURE_HEIGHT - 12,
                    rx: (Brightics.VA.Env.Diagram.FIGURE_HEIGHT - 12) / 2,
                    ry: (Brightics.VA.Env.Diagram.FIGURE_HEIGHT - 12) / 2
                },
                '.brtc-va-icon': {
                    width: 16, height: 16,
                    'xlink:href': 'css/va/images/func-io-20.png',
                    ref: '.brtc-va-outer',
                    'ref-x': 25,
                    'ref-y': 16
                },
                '.brtc-va-label': {
                    fill: '#667185',
                    text: '',
                    ref: '.brtc-va-outer',
                    'ref-x': 50,
                    'ref-y': (Brightics.VA.Env.Diagram.FIGURE_HEIGHT - 8) / 2,
                    'y-alignment': 'middle',
                    'font-size': '12px',
                    'font-family': 'Arial, Dotum, Tahoma, sans-serif',
                    'font-weight': 'bold'
                },
                '.brtc-va-last-runtime': {
                    fill: '#667185',
                    text: '- -:- -:- -(-)',
                    ref: '.brtc-va-outer',
                    'ref-x': 120,
                    'ref-y': 50,
                    'font-size': 10,
                    'font-family': 'Arial, Dotum, Tahoma, sans-serif',
                    'font-weight': 'normal'
                },
                '.brtc-va-inner': {
                    fill: '#E5E9EF',
                    ref: '.brtc-va-bounds',
                    'ref-x': Brightics.VA.Env.Diagram.FIGURE_WIDTH - 6,
                    'ref-y': Brightics.VA.Env.Diagram.FIGURE_HEIGHT / 2,
                    'stroke-width': 2,
                    'stroke': '#FFFFFF',
                    r: 5
                },
                '.brtc-va-tooltip': {
                    fill: '#FFFFFF',
                    ref: '.brtc-va-bounds',
                    'ref-x': 8,
                    'ref-y': Brightics.VA.Env.Diagram.FIGURE_HEIGHT / 2 - 15,
                    'stroke-width': 2,
                    'stroke': '#E5E9EF',
                    r: 10,
                    // 'xlink:href': 'css/va/images/func-memo-s-11.png',
                    display: 'none'
                },
                '.brtc-va-tooltip-icon': {
                    width: 18,
                    height: 18,
                    'xlink:href': 'css/va/images/func-memo-18x18.png',
                    ref: '.brtc-va-tooltip',
                    'ref-x': 1,
                    'ref-y': 1,
                    display: 'none'
                }
            }
        },
        {
            markup: '' +
            '<g class="brtc-va-fnunit-wrapper">' +
            '    <rect class="brtc-va-bounds"/>' +
            '    <rect class="brtc-va-outer"/>' +
            '    <image class="brtc-va-icon"/>' +
            '    <text class="brtc-va-label"/>' +
            '    <text class="brtc-va-last-runtime"/>' +
            '    <circle class="brtc-va-inner"/>' +
            '    <circle class="brtc-va-tooltip"/>' +
            '    <image class="brtc-va-tooltip-icon"/>' +
            '    <title/>' +
            '</g>',
            portMarkup: '<circle class="fnunit-port" r="0"/>',
            portLabelMarkup: '<text/>',
            resource: {
                'scala': {
                    'classification': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-classification-20-scala.png',
                        'selected-image': 'css/va/images/func-classification-w-20.png'
                    },
                    'evaluation': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-evaluation-20-scala.png',
                        'selected-image': 'css/va/images/func-evaluation-w-20.png'
                    },
                    'extraction': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-extraction-20-scala.png',
                        'selected-image': 'css/va/images/func-extraction-w-20.png'
                    },
                    'io': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-io-20-scala.png',
                        'selected-image': 'css/va/images/func-io-w-20.png'
                    },
                    'brightics': {
                        "opacity": "0.3",
                        "stroke-dasharray": "2,5",
                        "fill": "green",
                        "image": "css/va/images/func-script-20-scala.png",
                        "selected-image": "css/va/images/func-script-w-20.png"
                    },
                    'control': {
                        fill: '#36968B',
                        image: 'css/va/images/func-control-20.png',
                        'selected-image': 'css/va/images/func-control-w-20.png'
                    },
                    'process': {
                        fill: '#9966FF',
                        image: 'css/va/images/func-process-20.png',
                        'selected-image': 'css/va/images/func-process-w-20.png'
                    },
                    'manipulation': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-manipulation-20-scala.png',
                        'selected-image': 'css/va/images/func-manipulation-w-20.png'
                    },
                    'regression': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-regression-20-scala.png',
                        'selected-image': 'css/va/images/func-regression-w-20.png'
                    },
                    'statistics': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-statistics-20-scala.png',
                        'selected-image': 'css/va/images/func-statistics-w-20.png'
                    },
                    'transform': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-transform-20-scala.png',
                        'selected-image': 'css/va/images/func-transform-w-20.png'
                    },
                    // 'validation'    : {fill: '#57BAB1', image: 'css/va/images/func-validation-20.png', 'selected-image': 'css/va/images/func-validation-w-20.png'},
                    'textanalytics': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-textanalytics-20.png',
                        'selected-image': 'css/va/images/func-textanalytics-w-20.png'
                    },
                    'script': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-script-20-scala.png',
                        'selected-image': 'css/va/images/func-script-w-20.png'
                    },
                    'streaming': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-streaming-20.png',
                        'selected-image': 'css/va/images/func-streaming-w-20.png'
                    },
                    'deeplearning': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-deeplearning-20-scala.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'bigdata': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-bigdata-20.png',
                        'selected-image': 'css/va/images/func-bigdata-w-20.png'
                    },
                    'udf': {
                        fill: '#DD92EC',
                        image: 'css/va/images/func-udf-normal.png',
                        'selected-image': 'css/va/images/func-udf-select.png'
                    },
                    'clustering': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-clustering-20-scala.png',
                        'selected-image': 'css/va/images/func-clustering-w-20.png'
                    },
                    'recommendation': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-recommendation-20-scala.png',
                        'selected-image': 'css/va/images/func-recommendation-w-20.png'
                    },
                    'timeseries': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-timeseries-20-scala.png',
                        'selected-image': 'css/va/images/func-timeseries-w-20.png'
                    },
                    'autonomousanalytics': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-autonomousanalytics-20-scala.png',
                        'selected-image': 'css/va/images/func-autonomousanalytics-w-20.png'
                    },
                    'opt': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-opt-20-scala.png',
                        'selected-image': 'css/va/images/func-opt-w-20.png'
                    },
                    'ad': {
                        fill: '#E45A00',
                        image: 'css/va/images/func-ad-20-scala.png',
                        'selected-image': 'css/va/images/func-ad-w-20.png'
                    },
                    'unknown': {
                        fill: 'red',
                        image: 'css/va/images/func-unknown-20.png',
                        'selected-image': 'css/va/images/func-unknown-w-20.png'
                    },
                    'core-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'convolutional-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'pooling-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'application': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'recurrent-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'merge-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'normalization-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'advanced-activations-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    }
                },
                'python': {
                    'classification': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-classification-20-python.png',
                        'selected-image': 'css/va/images/func-classification-w-20.png'
                    },
                    'evaluation': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-evaluation-20-python.png',
                        'selected-image': 'css/va/images/func-evaluation-w-20.png'
                    },
                    'extraction': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-extraction-20-python.png',
                        'selected-image': 'css/va/images/func-extraction-w-20.png'
                    },
                    'io': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-io-20-python.png',
                        'selected-image': 'css/va/images/func-io-w-20.png'
                    },
                    'brightics': {
                        "opacity": "0.3",
                        "stroke-dasharray": "2,5",
                        "fill": "green",
                        "image": "css/va/images/func-script-20-python.png",
                        "selected-image": "css/va/images/func-script-w-20.png"
                    },
                    'control': {
                        fill: '#36968B',
                        image: 'css/va/images/func-control-20.png',
                        'selected-image': 'css/va/images/func-control-w-20.png'
                    },
                    'process': {
                        fill: '#9966FF',
                        image: 'css/va/images/func-process-20.png',
                        'selected-image': 'css/va/images/func-process-w-20.png'
                    },
                    'manipulation': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-manipulation-20-python.png',
                        'selected-image': 'css/va/images/func-manipulation-w-20.png'
                    },
                    'regression': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-regression-20-python.png',
                        'selected-image': 'css/va/images/func-regression-w-20.png'
                    },
                    'statistics': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-statistics-20-python.png',
                        'selected-image': 'css/va/images/func-statistics-w-20.png'
                    },
                    'transform': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-transform-20-python.png',
                        'selected-image': 'css/va/images/func-transform-w-20.png'
                    },
                    // 'validation'    : {fill: '#57BAB1', image: 'css/va/images/func-validation-20.png', 'selected-image': 'css/va/images/func-validation-w-20.png'},
                    'textanalytics': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-textanalytics-20-python.png',
                        'selected-image': 'css/va/images/func-textanalytics-w-20.png'
                    },
                    'script': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-script-20-python.png',
                        'selected-image': 'css/va/images/func-script-w-20.png'
                    },
                    'streaming': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-streaming-20-python.png',
                        'selected-image': 'css/va/images/func-streaming-w-20.png'
                    },
                    'deeplearning': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-deeplearning-20-python.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'bigdata': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-bigdata-20.png',
                        'selected-image': 'css/va/images/func-bigdata-w-20.png'
                    },
                    'udf': {
                        fill: '#DD92EC',
                        image: 'css/va/images/func-udf-normal.png',
                        'selected-image': 'css/va/images/func-udf-select.png'
                    },
                    'clustering': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-clustering-20-python.png',
                        'selected-image': 'css/va/images/func-clustering-w-20.png'
                    },
                    'recommendation': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-recommendation-20-python.png',
                        'selected-image': 'css/va/images/func-recommendation-w-20.png'
                    },
                    'timeseries': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-timeseries-20-python.png',
                        'selected-image': 'css/va/images/func-timeseries-w-20.png'
                    },
                    'autonomousanalytics': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-autonomousanalytics-20-python.png',
                        'selected-image': 'css/va/images/func-autonomousanalytics-w-20.png'
                    },
                    'opt': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-opt-20-python.png',
                        'selected-image': 'css/va/images/func-opt-w-20.png'
                    },
                    'ad': {
                        fill: '#366E9D',
                        image: 'css/va/images/func-ad-20-python.png',
                        'selected-image': 'css/va/images/func-ad-w-20.png'
                    },
                    'unknown': {
                        fill: 'red',
                        image: 'css/va/images/func-unknown-20.png',
                        'selected-image': 'css/va/images/func-unknown-w-20.png'
                    },
                    'core-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'convolutional-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'pooling-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'application': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'recurrent-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    },
                    'advanced-activations-layer': {
                        fill: '#4CB87D',
                        image: 'css/va/images/func-deeplearning-20.png',
                        'selected-image': 'css/va/images/func-deeplearning-w-20.png'
                    }
                },
                'sql': {
                    'udf': {
                        fill: '#d771eb',
                        image: 'css/va/images/func-udf-normal.png',
                        'selected-image': 'css/va/images/func-udf-select.png'
                    }
                }
            },
            getColor: function () {
                var category = this.prop('category');
                var context = this.prop('context');
                var resource = this.resource[context][category] || this.resource[context].io;
                return resource.fill;
            },
            select: function () {
                this.prop('selected', true);
                var category = this.prop('category');
                var context = this.prop('context');

                var attrObj = {};

                var resource = this.resource[context][category] || this.resource[context].io;
                if (category && resource && resource.fill) {
                    attrObj['.brtc-va-outer'] = {opacity: resource.opacity || 1};
                    attrObj['.brtc-va-outer'] = {fill: resource.fill};
                    attrObj['.brtc-va-inner'] = {stroke: resource.fill};
                    attrObj['.brtc-va-icon'] = {"xlink:href": resource['selected-image']};
                }

                if (this.prop('deprecated')) {
                    var color = this.prop(['colorSet', 'DEPRECATED']);

                    attrObj['.brtc-va-outer'] = {fill: color};
                    attrObj['.brtc-va-inner'] = {stroke: color};
                }

                attrObj['.brtc-va-label'] = {fill: "#FFFFFF"};

                this.attr(attrObj);
            },
            unselect: function () {
                this.prop('selected', false);
                var category = this.prop('category');
                var context = this.prop('context');
                var customCategoryList = ['unknown', 'brightics'];
                var resource = this.resource[context][category] || this.resource[context].io;

                var attrObj = {
                    ".brtc-va-outer": {
                        opacity: resource.opacity || 1,
                        fill: customCategoryList.indexOf(category) > -1 ? resource.fill : "#FFFFFF"
                    },
                    ".brtc-va-label": {fill: customCategoryList.indexOf(category) > -1 ? "#FFFFFF" : "#667185"},
                    ".brtc-va-inner": {stroke: customCategoryList.indexOf(category) > -1 ? resource.fill : "#FFFFFF"}
                };

                if (this.prop('deprecated')) {
                    var color = this.prop(['colorSet', 'DEPRECATED']);

                    $.extend(true, attrObj, {
                        ".brtc-va-outer": {fill: color},
                        ".brtc-va-inner": {stroke: color}
                    });
                }

                if (category && resource.image) {
                    $.extend(true, attrObj, {".brtc-va-icon": {"xlink:href": resource.image}});
                }

                this.attr(attrObj);
            },
            label: function (label, scale) {
                if (label) {
                    this.originalLabel = label;

                    var scaleValue = scale || 1;
                    var text = label;
                    var lines;

                    if (scaleValue < 0.7) {
                        text = label.replace(/\s/g, '\u0006');
                        text = joint.util.breakText(text,
                            {width: (Brightics.VA.Env.Diagram.FIGURE_WIDTH - 80) * scaleValue},
                            {
                                'font-size': 12 * scaleValue,
                                'font-family': 'Arial, Dotum, Tahoma, sans-serif',
                                'font-weight': 'bold'
                            });
                        lines = text.split('\n');
                        if (lines.length > 1) {
                            text = lines[0] + '...';
                        } else {
                            text = lines[0];
                        }
                        text = text.replace(/\u0006/g, ' ');

                        let attrObj = {
                            "text.brtc-va-label": {
                                text: text,
                                ref: '.brtc-va-outer',
                                "ref-x": 50,
                                "ref-y": 27,
                                "y-alignment": 'middle'
                            }
                        };
                        this.attr(attrObj);
                    } else {
                        text = joint.util.breakText(text,
                            {width: (Brightics.VA.Env.Diagram.FIGURE_WIDTH - 80) * scaleValue},
                            {
                                'font-size': 12 * scaleValue,
                                'font-family': 'Arial, Dotum, Tahoma, sans-serif',
                                'font-weight': 'bold'
                            });
                        lines = text.split('\n');
                        if (lines.length > 2) {
                            text = lines[0] + '\n' + lines[1] + '...';
                        }

                        let attrObj = {
                            "text.brtc-va-label": {
                                text: text,
                                ref: '.brtc-va-outer',
                                "ref-x": 50,
                                "ref-y": 25,
                                "y-alignment": 'middle'
                            }
                        };
                        this.attr(attrObj);
                    }
                } else {
                    console.log('label is undefined !!!');
                }
            },
            lastRuntime: function (time) {
                this.attr('text.brtc-va-last-runtime/text', time);
            },
            resetRuntime: function () {
                this.attr('text.brtc-va-last-runtime/text', '- -:- -:- -(-)');
            },
            tooltip: function (tooltip) {
                // this.attr('title/text', tooltip);
            },
            category: function (fnUnitDef) {
                var category = fnUnitDef.category;
                var context = fnUnitDef.defaultFnUnit.context || 'scala';
                let attrObj;
                this.prop('category', category);
                this.prop('context', context);
                var image = this.resource[context][category] ? this.resource[context][category].image : this.resource[context].io.image;
                if (category === 'unknown') {
                    attrObj = {
                        ".brtc-va-outer": {fill: this.resource[context][category].fill},
                        ".brtc-va-inner": {stroke: this.resource[context][category].fill},
                        ".brtc-va-icon": {"xlink:href": this.resource[context][category]['selected-image']},
                        ".brtc-va-label": {fill: "#FFFFFF"},
                    }
                } else if (category === 'brightics') {
                    attrObj = {
                        ".brtc-va-outer": {
                            fill: this.resource[context][category].fill,
                            opacity: this.resource[context][category].opacity
                        }
                    }
                } else {
                    this.attr('.brtc-va-icon/xlink:href', image);
                    attrObj = {".brtc-va-icon": {"xlink:href": image},}
                }
                this.attr(attrObj);
            },
            updateStatus: function (status) {
                this.attr('.brtc-va-inner/fill', this.prop(['colorSet', status]));
                if (status === 'FAIL') this.showError();
                if (status === 'SUCCESS') this.hideError();
            },
            refresh: function () {
                var color = this.prop(['colorSet', 'READY']);

                this.attr({
                    ".brtc-va-outer": {stroke: color},
                    ".brtc-va-inner": {fill: color}
                });
            },
            showError: function () {
                var color = this.prop(['colorSet', 'FAIL']);
                this.attr('.brtc-va-outer/stroke', color);
            },
            hideError: function () {
                var color = this.prop(['colorSet', 'READY']);
                this.attr('.brtc-va-outer/stroke', color);
            },
            showToolTipIcon: function () {
                this.attr({
                    ".brtc-va-tooltip": {display: 'block'},
                    ".brtc-va-tooltip-icon": {display: 'block'}
                });
            },
            hideToolTipIcon: function () {
                this.attr({
                    ".brtc-va-tooltip": {display: 'none'},
                    ".brtc-va-tooltip-icon": {display: 'none'}
                });
            },
            setOnShade: function () {
                this.attr({
                    "text.brtc-va-label": {opacity: '.25'},
                    ".brtc-va-icon": {opacity: '.25'},
                    "shade-type": "on"
                });
            },
            setOffShade: function () {
                if(this.attr("shade-type") === "on"){
                    this.attr({
                        "text.brtc-va-label": {opacity: '1'},
                        ".brtc-va-icon": {opacity: '1'},
                        "shade-type": "off"
                    });
                }

            },
            setCursorType: function (cursorType) {
                this.attr('.brtc-va-fnunit-wrapper/cursor', cursorType);
            },
            setDeprecated: function (message) {
                var color = this.prop(['colorSet', 'DEPRECATED']);
                this.prop('deprecated', true);

                this.attr({
                    "title": {text: 'Deprecated: ' + message},
                    ".brtc-va-label": {"text-decoration": "line-through"},
                    ".brtc-va-outer": {fill: color},
                    ".brtc-va-inner": {stroke: color},
                });
            }
        }
    );

}).call(this);