/**
 * Created by daewon.park on 2016-02-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    // width: 225, height: 58
    Brightics.VA.Core.Shapes.FnUnitFigure = joint.shapes.basic.Generic.extend({

        markup: '' +
        '<g class="brtc-va-rotatable">' +
        '   <g class="brtc-va-scalable">' +
        '       <rect class="brtc-va-bounds"/>' +
        '       <rect class="brtc-va-outer"/>' +
        '       <image class="brtc-va-icon"/>' +
        '       <text class="brtc-va-label"/>' +
        '       <text class="brtc-va-last-runtime"/>' +
        '       <circle class="brtc-va-inner"/>' +
        '       <circle class="brtc-va-tooltip"/>' +
        '       <image class="brtc-va-tooltip-icon"/>' +
        '       <title/>' +
        '   </g>' +
        '</g>',
        resource: {
            'scala': {
                'classification':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-classification-20-scala.png',
                        'selected-image':
                            'css/va/images/func-classification-w-20.png'
                    }
                ,
                'evaluation':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-evaluation-20-scala.png',
                        'selected-image':
                            'css/va/images/func-evaluation-w-20.png'
                    }
                ,
                'extraction':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-extraction-20-scala.png',
                        'selected-image':
                            'css/va/images/func-extraction-w-20.png'
                    }
                ,
                'io':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-io-20-scala.png',
                        'selected-image':
                            'css/va/images/func-io-w-20.png'
                    }
                ,
                'brightics':
                    {
                        "opacity":
                            "0.3",
                        "stroke-dasharray":
                            "2,5",
                        "fill":
                            "green",
                        "image":
                            "css/va/images/func-script-20-scala.png",
                        "selected-image":
                            "css/va/images/func-script-w-20.png"
                    }
                ,
                'control':
                    {
                        fill: '#36968B',
                        image:
                            'css/va/images/func-control-20.png',
                        'selected-image':
                            'css/va/images/func-control-w-20.png'
                    }
                ,
                'process':
                    {
                        fill: '#9966FF',
                        image:
                            'css/va/images/func-process-20.png',
                        'selected-image':
                            'css/va/images/func-process-w-20.png'
                    }
                ,
                'manipulation':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-manipulation-20-scala.png',
                        'selected-image':
                            'css/va/images/func-manipulation-w-20.png'
                    }
                ,
                'regression':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-regression-20-scala.png',
                        'selected-image':
                            'css/va/images/func-regression-w-20.png'
                    }
                ,
                'statistics':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-statistics-20-scala.png',
                        'selected-image':
                            'css/va/images/func-statistics-w-20.png'
                    }
                ,
                'transform':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-transform-20-scala.png',
                        'selected-image':
                            'css/va/images/func-transform-w-20.png'
                    }
                ,
                // 'validation'    : {fill: '#57BAB1', image: 'css/va/images/func-validation-20.png', 'selected-image': 'css/va/images/func-validation-w-20.png'},
                'script':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-script-20-scala.png',
                        'selected-image':
                            'css/va/images/func-script-w-20.png'
                    }
                ,
                'streaming':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-streaming-20.png',
                        'selected-image':
                            'css/va/images/func-streaming-w-20.png'
                    }
                ,
                'deeplearning':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-deeplearning-20-scala.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'bigdata':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-bigdata-20.png',
                        'selected-image':
                            'css/va/images/func-bigdata-w-20.png'
                    }
                ,
                'udf':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-udf-normal.png',
                        'selected-image':
                            'css/va/images/func-udf-select.png'
                    }
                ,
                'clustering':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-clustering-20-scala.png',
                        'selected-image':
                            'css/va/images/func-clustering-w-20.png'
                    }
                ,
                'recommendation':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-recommendation-20-scala.png',
                        'selected-image':
                            'css/va/images/func-recommendation-w-20.png'
                    }
                ,
                'timeseries':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-timeseries-20-scala.png',
                        'selected-image':
                            'css/va/images/func-timeseries-w-20.png'
                    }
                ,
                'autonomousanalytics':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-autonomousanalytics-20-scala.png',
                        'selected-image':
                            'css/va/images/func-autonomousanalytics-w-20.png'
                    }
                ,
                'opt':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-opt-20-scala.png',
                        'selected-image':
                            'css/va/images/func-opt-w-20.png'
                    }
                ,
                'ad':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-ad-20-scala.png',
                        'selected-image':
                            'css/va/images/func-ad-w-20.png'
                    }
                ,
                'unknown':
                    {
                        fill: 'red',
                        image:
                            'css/va/images/func-unknown-20.png',
                        'selected-image':
                            'css/va/images/func-unknown-w-20.png'
                    }
                ,
                'core-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'convolutional-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'pooling-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'application':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'recurrent-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'merge-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'normalization-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'advanced-activations-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'textanalytics':
                    {
                        fill: '#E45A00',
                        image:
                            'css/va/images/func-textanalytics-20.png',
                        'selected-image':
                            'css/va/images/func-textanalytics-w-20.png'
                    }
            },
            'python': {
                'classification':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-classification-20-python.png',
                        'selected-image':
                            'css/va/images/func-classification-w-20.png'
                    }
                ,
                'evaluation':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-evaluation-20-python.png',
                        'selected-image':
                            'css/va/images/func-evaluation-w-20.png'
                    }
                ,
                'extraction':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-extraction-20-python.png',
                        'selected-image':
                            'css/va/images/func-extraction-w-20.png'
                    }
                ,
                'io':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-io-20-python.png',
                        'selected-image':
                            'css/va/images/func-io-w-20.png'
                    }
                ,
                'brightics':
                    {
                        "opacity":
                            "0.3",
                        "stroke-dasharray":
                            "2,5",
                        "fill":
                            "green",
                        "image":
                            "css/va/images/func-script-20-python.png",
                        "selected-image":
                            "css/va/images/func-script-w-20.png"
                    }
                ,
                'control':
                    {
                        fill: '#36968B',
                        image:
                            'css/va/images/func-control-20.png',
                        'selected-image':
                            'css/va/images/func-control-w-20.png'
                    }
                ,
                'process':
                    {
                        fill: '#9966FF',
                        image:
                            'css/va/images/func-process-20.png',
                        'selected-image':
                            'css/va/images/func-process-w-20.png'
                    }
                ,
                'manipulation':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-manipulation-20-python.png',
                        'selected-image':
                            'css/va/images/func-manipulation-w-20.png'
                    }
                ,
                'regression':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-regression-20-python.png',
                        'selected-image':
                            'css/va/images/func-regression-w-20.png'
                    }
                ,
                'statistics':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-statistics-20-python.png',
                        'selected-image':
                            'css/va/images/func-statistics-w-20.png'
                    }
                ,
                'transform':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-transform-20-python.png',
                        'selected-image':
                            'css/va/images/func-transform-w-20.png'
                    }
                ,
                // 'validation'    : {fill: '#57BAB1', image: 'css/va/images/func-validation-20.png', 'selected-image': 'css/va/images/func-validation-w-20.png'},
                'script':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-script-20-python.png',
                        'selected-image':
                            'css/va/images/func-script-w-20.png'
                    }
                ,
                'streaming':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-streaming-20-python.png',
                        'selected-image':
                            'css/va/images/func-streaming-w-20.png'
                    }
                ,
                'deeplearning':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-deeplearning-20-python.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'bigdata':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-bigdata-20.png',
                        'selected-image':
                            'css/va/images/func-bigdata-w-20.png'
                    }
                ,
                'udf':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-udf-normal.png',
                        'selected-image':
                            'css/va/images/func-udf-select.png'
                    }
                ,
                'clustering':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-clustering-20-python.png',
                        'selected-image':
                            'css/va/images/func-clustering-w-20.png'
                    }
                ,
                'recommendation':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-recommendation-20-python.png',
                        'selected-image':
                            'css/va/images/func-recommendation-w-20.png'
                    }
                ,
                'timeseries':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-timeseries-20-python.png',
                        'selected-image':
                            'css/va/images/func-timeseries-w-20.png'
                    }
                ,
                'autonomousanalytics':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-autonomousanalytics-20-python.png',
                        'selected-image':
                            'css/va/images/func-autonomousanalytics-w-20.png'
                    }
                ,
                'opt':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-opt-20-python.png',
                        'selected-image':
                            'css/va/images/func-opt-w-20.png'
                    }
                ,
                'ad':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-ad-20-python.png',
                        'selected-image':
                            'css/va/images/func-ad-w-20.png'
                    }
                ,
                'unknown':
                    {
                        fill: 'red',
                        image:
                            'css/va/images/func-unknown-20.png',
                        'selected-image':
                            'css/va/images/func-unknown-w-20.png'
                    }
                ,
                'core-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'convolutional-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'pooling-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'application':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'recurrent-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'advanced-activations-layer':
                    {
                        fill: '#4CB87D',
                        image:
                            'css/va/images/func-deeplearning-20.png',
                        'selected-image':
                            'css/va/images/func-deeplearning-w-20.png'
                    }
                ,
                'textanalytics':
                    {
                        fill: '#366E9D',
                        image:
                            'css/va/images/func-textanalytics-20-python.png',
                        'selected-image':
                            'css/va/images/func-textanalytics-w-20.png'
                    }
            },
            'sql': {
                'udf': {
                    fill: '#d771eb',
                    image:
                        'css/va/images/func-udf-normal.png',
                    'selected-image':
                        'css/va/images/func-udf-select.png'
                }
            }
        },
        getColor: function () {
            var category = this.attributes.attrs['category'];
            var context = this.attributes.attrs['context'];
            var resource = this.resource[context][category] || this.resource[context].io;
            return resource.fill;
        },
        select: function () {
            var category = this.attributes.attrs['category'];
            var context = this.attributes.attrs['context'];
            var resource = this.resource[context][category] || this.resource[context].io;
            if (category && resource && resource.fill) {
                this.attr('.brtc-va-outer/opacity', resource.opacity || 1);
                this.attr('.brtc-va-outer/fill', resource.fill);
                this.attr('.brtc-va-inner/stroke', resource.fill);
                this.attr('.brtc-va-icon/xlink:href', resource['selected-image']);
            }

            if (this.attributes.attrs.deprecated) {
                this.attr('.brtc-va-outer/fill', this.attributes.colorSet.DEPRECATED);
                this.attr('.brtc-va-inner/stroke', this.attributes.colorSet.DEPRECATED);
            }

            this.attr('.brtc-va-label/fill', "#FFFFFF");
        },
        unselect: function () {
            var category = this.attributes.attrs['category'];
            var context = this.attributes.attrs['context'];
            var customCategoryList = ['unknown', 'brightics'];

            var resource = this.resource[context][category] || this.resource[context].io;
            this.attr('.brtc-va-outer/opacity', resource.opacity || 1);
            this.attr('.brtc-va-outer/fill', customCategoryList.indexOf(category) > -1 ? resource.fill : "#FFFFFF");
            this.attr('.brtc-va-inner/stroke', customCategoryList.indexOf(category) > -1 ? resource.fill : "#FFFFFF");
            this.attr('.brtc-va-label/fill', customCategoryList.indexOf(category) > -1 ? "#FFFFFF" : "#667185");

            if (this.attributes.attrs.deprecated) {
                this.attr('.brtc-va-outer/fill', this.attributes.colorSet.DEPRECATED);
                this.attr('.brtc-va-inner/stroke', this.attributes.colorSet.DEPRECATED);
            }

            if (category && resource.image) {
                this.attr('.brtc-va-icon/xlink:href', resource.image);
            }
        },
        changeScale: function (scale) {
            this.label(this.originalLabel, scale);
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
                    this.attr('text.brtc-va-label/text', text);
                    this.attr('text.brtc-va-label/ref', '.brtc-va-outer');
                    this.attr('text.brtc-va-label/ref-x', 50);
                    this.attr('text.brtc-va-label/ref-y', 27);
                    this.attr('text.brtc-va-label/y-alignment', 'middle');
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
                    this.attr('text.brtc-va-label/text', text);
                    this.attr('text.brtc-va-label/ref', '.brtc-va-outer');
                    this.attr('text.brtc-va-label/ref-x', 50);
                    this.attr('text.brtc-va-label/ref-y', 25);
                    this.attr('text.brtc-va-label/y-alignment', 'middle');
                }
            } else {
                console.log('label is undefined !!!');
            }
        },
        lastRuntime: function (time) {
            this.attr('text.brtc-va-last-runtime/text', time);
        },
        resetRuntime: function () {
            this.attr('text.brtc-va-last-runtime/text', '- -:- -:- -.- - -');
        },
        tooltip: function (tooltip) {
            // this.attr('title/text', tooltip);
        },
        category: function (fnUnitDef) {
            var category = fnUnitDef.category;
            var context = fnUnitDef.defaultFnUnit.context || 'scala';
            this.attr('category', category);
            this.attr('context', context);
            var image = this.resource[context][category] ? this.resource[context][category].image : this.resource[context].io.image;
            if (category === 'unknown') {
                this.attr('.brtc-va-outer/fill', this.resource[context][category].fill);
                this.attr('.brtc-va-inner/stroke', this.resource[context][category].fill);
                this.attr('.brtc-va-icon/xlink:href', this.resource[context][category]['selected-image']);
                this.attr('.brtc-va-label/fill', "#FFFFFF");
            } else if (category === 'brightics') {
                this.attr('.brtc-va-outer/fill', this.resource[context][category].fill);
                this.attr('.brtc-va-outer/opacity', this.resource[context][category].opacity);
            } else {
                this.attr('.brtc-va-icon/xlink:href', image);
            }
        },
        updateStatus: function (status) {
            this.attr('.brtc-va-inner/fill', this.attributes.colorSet[status]);
            if (status === 'FAIL') this.showError();
            if (status === 'SUCCESS') this.hideError();
        },
        refresh: function () {
            this.attr('.brtc-va-outer/stroke', this.attributes.colorSet.READY);
            this.attr('.brtc-va-inner/fill', this.attributes.colorSet.READY);
        },
        showError: function () {
            this.attr('.brtc-va-outer/stroke', this.attributes.colorSet['FAIL']);
        },
        hideError: function () {
            this.attr('.brtc-va-outer/stroke', this.attributes.colorSet['READY']);
        },
        showToolTipIcon: function () {
            this.attr('.brtc-va-tooltip/display', 'block');
            this.attr('.brtc-va-tooltip-icon/display', 'block');
        },
        hideToolTipIcon: function () {
            this.attr('.brtc-va-tooltip/display', 'none');
            this.attr('.brtc-va-tooltip-icon/display', 'none');
        },
        setOnShade: function () {
            this.attr('text.brtc-va-label/opacity', '.25');
            this.attr('.brtc-va-icon/opacity', '.25');
        },
        setOffShade: function () {
            this.attr('text.brtc-va-label/opacity', '1');
            this.attr('.brtc-va-icon/opacity', '1');
        },
        setCursorType: function (cursorType) {
            this.attr('.brtc-va-scalable/cursor', cursorType);
        },
        setDeprecated: function (message) {
            this.attr('deprecated', true);
            // this.attr('.brtc-va-outer/title', message);
            this.attr('title/text', 'Deprecated: ' + message);
            this.attr('.brtc-va-label/text-decoration', 'line-through');
            this.attr('.brtc-va-outer/fill', this.attributes.colorSet.DEPRECATED);
            this.attr('.brtc-va-inner/stroke', this.attributes.colorSet.DEPRECATED);
        },
        defaults: joint.util.deepSupplement({
            inPorts: ['in1', 'in2'],
            outPorts: ['out'],
            type: 'brtc.va.shapes.FnUnit',
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
                    text: '- -:- -:- -.- - -',
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

        }, joint.shapes.basic.Generic.prototype.defaults)
    });

}).call(this);