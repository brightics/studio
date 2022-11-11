/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 719);
/******/ })
/************************************************************************/
/******/ ({

/***/ 719:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bchartDecisiontreeForBrightics = __webpack_require__(720);

var _bchartDecisiontreeForBrightics2 = _interopRequireDefault(_bchartDecisiontreeForBrightics);

var _d3DecisiontreeForBrightics = __webpack_require__(721);

var _d3DecisiontreeForBrightics2 = _interopRequireDefault(_d3DecisiontreeForBrightics);

var _chartValidatorDecisiontreeForBrightics = __webpack_require__(724);

var _chartValidatorDecisiontreeForBrightics2 = _interopRequireDefault(_chartValidatorDecisiontreeForBrightics);

var _chartOptionDecisiontree = __webpack_require__(725);

var _chartOptionDecisiontree2 = _interopRequireDefault(_chartOptionDecisiontree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-03-20.
 */
Brightics.Chart.API.registerChart({ Key: _bchartDecisiontreeForBrightics2.default.Attr.Key, Func: _bchartDecisiontreeForBrightics2.default });
Brightics.Chart.API.registerChartWrapper({ Key: _bchartDecisiontreeForBrightics2.default.Attr.Key, Func: _d3DecisiontreeForBrightics2.default });
Brightics.Chart.API.registerChartValidator({ Key: _bchartDecisiontreeForBrightics2.default.Attr.Key, Func: _chartValidatorDecisiontreeForBrightics2.default });
Brightics.Chart.Adonis.API.registerChartOption({ Key: _bchartDecisiontreeForBrightics2.default.Attr.Key, Func: _chartOptionDecisiontree2.default });

/***/ }),

/***/ 720:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: bchart-decisiontree-for-brightics.js
 * Created by daewon.park on 2017-03-28.
 */

var BDecisionTree = Brightics.Chart.Registry['decisionTree'];
var DefaultOptions = Brightics.Chart.DefaultOption;
var createChartWrapper = Brightics.Chart.Wrapper.createChartWrapper;

// import BDecisionTree from '../../../bcharts/source/types/implement/bchart-decisiontree';
// import DefaultOptions from '../../../bcharts/source/env/default-options';
// import * as Wrapper from '../../../bcharts/source/wrapper/wrapper-register';


var _super = BDecisionTree;
function BDecisionTreeForBrighticsCharts(parentId, options) {
    _super.call(this, parentId, options);
}

BDecisionTreeForBrighticsCharts.prototype = Object.create(_super.prototype);
BDecisionTreeForBrighticsCharts.prototype.constructor = BDecisionTreeForBrighticsCharts;

BDecisionTreeForBrighticsCharts.prototype._createChart = function () {
    // this.chart = new D3DecisionTreeForBrightics(this.$parent, this.options);
    this.chart = createChartWrapper(BDecisionTreeForBrighticsCharts.Attr.Key, this.$parent, this.options);
};

BDecisionTreeForBrighticsCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            decisionTree: {}
        }
    });

    var reload = this.isReload(options);
    this._changeOptions(options);
    this.render(reload);
};

BDecisionTreeForBrighticsCharts.Attr = {
    Key: 'decisionTreeForBrightics',
    Label: 'Decision Tree For Brightics',
    Order: 63,
    ColumnConf: {
        nodeLabelColumn: {
            label: 'Node Label',
            aggregationEnabled: false,
            multiple: true
        }
    },
    DefaultOptions: DefaultOptions.extend({
        toolbar: {
            show: false
        },
        plotOptions: {
            decisionTree: {
                nodeLabelColumn: [{
                    selected: []
                }],
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#000',
                            fontSize: 18,
                            fontFamily: '',
                            fontStyle: 'normal',
                            fontWeight: 'normal'
                        }
                    }
                },
                linkLabel: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#000',
                            fontSize: 18,
                            fontFamily: '',
                            fontStyle: 'normal',
                            fontWeight: 'normal'
                        }
                    }
                },
                style: {
                    node: {
                        shape: 'circle',
                        size: 2,
                        color: '#4682B8',
                        opacity: 1
                    },
                    link: {
                        showArrow: true,
                        width: 2,
                        color: '#FD026C',
                        opacity: 1
                    }
                }
            }
        }
    })
};

exports.default = BDecisionTreeForBrighticsCharts;

/***/ }),

/***/ 721:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d3DecisiontreeForBrighticsOptionBuilder = __webpack_require__(722);

var _d3DecisiontreeForBrighticsOptionBuilder2 = _interopRequireDefault(_d3DecisiontreeForBrighticsOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _super = Brightics.Chart.Wrapper.getChartWrapper('decisionTree'); /**
                                                                       * Source: D3-network.js
                                                                       * Created by daewon.park on 2017-03-30.
                                                                       */
// import D3DecisionTree from '../../../bcharts/source/wrapper/d3/optionbuilder/decisiontree/d3-decisiontree';


function D3DecisionTreeForBrightics(parentId, options) {
    _super.call(this, parentId, options);
}

D3DecisionTreeForBrightics.prototype = Object.create(_super.prototype);
D3DecisionTreeForBrightics.prototype.constructor = D3DecisionTreeForBrightics;

D3DecisionTreeForBrightics.prototype._init = function () {
    _super.prototype._init.call(this);
    this.seriesHelper = new _d3DecisiontreeForBrighticsOptionBuilder2.default();
};

D3DecisionTreeForBrightics.prototype._chartInit = function ($parent) {

    var _this = this;

    var div_w = this.d3chart.getMainContainer().clientWidth;
    var div_h = this.d3chart.getMainContainer().clientHeight;
    //OPTION Margin top=40, right=10, bottom=40, left=20
    this.margin = { top: 100, right: 10, bottom: 40, left: 10 };
    var width = div_w - this.margin.right - this.margin.left,
        height = div_h - this.margin.top - this.margin.bottom;

    this.svg = this.d3chart.svg.attr("width", width + this.margin.right + this.margin.left).attr("viewBox", "0 0 " + div_w + " " + div_h).attr("height", height + this.margin.top + this.margin.bottom);

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.top + "," + this.margin.left + ")").call(this.d3chart.nodeTooltip).call(this.d3chart.linkTooltip);

    this.nodeFigure = {
        width: 180,
        height: 180,
        hDistance: 100,
        vDistance: 60
    };

    this.decisionTree = d3.tree()
    // .size([width, height])
    .nodeSize([this.nodeFigure.width + this.nodeFigure.hDistance, this.nodeFigure.height + this.nodeFigure.vDistance]).separation(function (a, b) {
        return a.parent == b.parent ? 1 : 1;
    });
    this.d3chart.component = this.decisionTree;

    //OPTION LINK Arrow
    this.svg.append("svg:defs").selectAll("marker").data(["end"]) // Different link/path types can be defined here
    .enter().append("svg:marker") // This section adds in the arrows
    .attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", -10).attr("refY", 0).attr("markerWidth", 10).attr("markerHeight", 10).attr("orient", "auto").attr("stroke", "#000").attr("fill", "blue").append("svg:path").attr("d", "M0,-5L10,0L0,5").style("stroke-width", "0.3px").attr("transform", "rotate(180,5, 0)").attr("markerUnits", "strokeWidth");

    this.svg.on('click', function (e) {
        d3.event.stopImmediatePropagation();

        if ($(this).closest('.bcharts-ws-panel').hasClass('ui-selected')) {
            return;
        }
        if ($(this).closest('.brtc-va-editors-sheet-fnunitviewer')) {
            $(this).closest('.brtc-va-editors-sheet-fnunitviewer').find('.bcharts-ws-panel.ui-selected').removeClass('ui-selected');
        } else {
            $(this).closest('.bcharts-ws-panel.ui-selected').removeClass('ui-selected');
        }
        $(this).closest('.bcharts-ws-panel').addClass('ui-selected');

        $(this).closest('.bcharts-worksheet').trigger('selectPanel', [$(this).closest('.bcharts-ws-panel').data('chartPanel')]);
        $(this).closest('.brtc-va-visual-content-wrapper').trigger('mousedown', []);
        // $(this).closest('.bcharts-ws-panel').data('chartPanel')
        // alert('click')
    });

    this.svg.on('mousedown', function (e) {
        $(this).closest('.bcharts-ws-panel').trigger('mousedown', []);
    });
};

D3DecisionTreeForBrightics.prototype._wrap = function (text) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(','),
            lineNumber = 0,
            lineHeight = 1.1,
            // ems
        y = text.attr("y"),
            dy = parseFloat(text.attr("dy"));
        var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        for (var i in words) {
            if (words[i] != '') {
                if (words[i].length > 20) words[i] = words[i].substring(0, 17) + '...';
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(words[i]);
                lineNumber++;
            }
        }
    });
};

D3DecisionTreeForBrightics.prototype.diagonal = function (s, d) {
    return "M " + s.x + " " + s.y + "C " + d.x + " " + d.y + "," + d.x + " " + d.y + "," + d.x + " " + d.y;
};

D3DecisionTreeForBrightics.prototype.computedGroupByTextLength = function (element, data) {
    if (data.depth == 1) {
        var text = d3.select(element);
        var words = text.text().split(',');
        var lineNumber = 0;
        var lineHeight = 1.1; // ems
        var y = text.attr("y");
        var dy = parseFloat(text.attr("dy"));
        var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        var maxWidth = 0;
        for (var i in words) {
            if (words[i] != '') {
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(words[i]);
                maxWidth = Math.max(maxWidth, tspan.node().getComputedTextLength());
                lineNumber++;
            }
        }
        data.rectWidth = maxWidth + 20;
        data.rectHeight = text.node().getBBox().height;
    }
};

D3DecisionTreeForBrightics.prototype.update = function (options) {
    this.g.selectAll('*').remove();
    var _this = this;

    var i = 0;

    var nodeLabelTextStyle = this.options.plotOptions.decisionTree.label.normal.textStyle;
    var nodeFontFamily = nodeLabelTextStyle.fontFamily;
    var nodeFontColor = nodeLabelTextStyle.color;
    var nodeFontStyle = nodeLabelTextStyle.fontStyle;
    var nodeFontWeight = nodeLabelTextStyle.fontWeight;
    var nodeFontSize = nodeLabelTextStyle.fontSize;

    var linkLabelTextStyle = this.options.plotOptions.decisionTree.linkLabel.normal.textStyle;
    var linkFontFamily = linkLabelTextStyle.fontFamily;
    var linkFontColor = linkLabelTextStyle.color;
    var linkFontStyle = linkLabelTextStyle.fontStyle;
    var linkFontWeight = linkLabelTextStyle.fontWeight;
    var linkFontSize = linkLabelTextStyle.fontSize;

    var symbolSize = this.options.plotOptions.decisionTree.style.node.size;
    var symbolColor = this.options.plotOptions.decisionTree.style.node.color;
    var symbolOpacity = this.options.plotOptions.decisionTree.style.node.opacity;

    var linkWidth = this.options.plotOptions.decisionTree.style.link.width;
    var linkColor = this.options.plotOptions.decisionTree.style.link.color;
    var linkOpacity = this.options.plotOptions.decisionTree.style.link.opacity;
    this.d3chart.nodeTooltip.html(options.tooltip.formatter.bind(this));
    this.d3chart.linkTooltip.html(this.linkTooltipFormatter.bind(this));

    var source = options.series[0].data;

    var root = d3.hierarchy(source, function (d) {
        return d.children;
    });

    var treeData = this.decisionTree(root);
    this.nodes = treeData.descendants();
    var links = treeData.descendants().slice(1);

    this.nodes = this.nodes.filter(function (d) {
        return d.depth != 0;
    });
    links = links.filter(function (d) {
        return d.depth != 1;
    });
    root.x0 = parseInt(this.d3chart.getMainContainer().clientWidth) / 2;
    root.y0 = 0;

    this.updateScale(this.nodes);

    // ****************** Nodes section ***************************
    // Update the nodes...
    var node = this.g.selectAll('g.node').data(this.nodes, function (d) {
        return d.id || (d.id = ++i);
    });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g').attr('class', 'node').attr("transform", function (d) {
        if (d.depth == 1) return "translate(" + d.x + "," + d.y + ")";
        return "translate(" + d.x + "," + d.y + ")";
    });

    if (this.options.tooltip.triggerOn === 'mousemove') {
        nodeEnter.on('mouseover', this.d3chart.nodeTooltip.show).on('click', null).on('mouseout', this.d3chart.nodeTooltip.hide);
    } else {
        nodeEnter.on('click', this.d3chart.nodeTooltip.show).on('mouseover', null).on('mouseout', null);
    }

    // Add Circle for the nodes
    nodeEnter.append('circle').attr('class', 'node').attr('opacity', symbolOpacity ? symbolOpacity : 1)
    // .attr('r', 1e-6)
    .attr('r', 0).style("stroke-width", "0.3px").style('stroke', '#000').style("fill", function (d) {
        if (d.depth === 1) {
            return symbolColor ? symbolColor : "steelblue";
        }
        // return d.children ? "lightsteelblue" : "steelblue";
        return symbolColor ? symbolColor : "steelblue";
    });

    var nodeRect = nodeEnter.append('rect').attr('class', 'rootNode').attr("width", 0).attr("height", 0).attr("y", 0).attr("x", 0).attr('opacity', symbolOpacity ? symbolOpacity : 1).style("stroke-width", "0.3px").style('stroke', '#000').style("fill", function (d) {
        if (d.depth === 1) {
            return symbolColor ? symbolColor : "steelblue";
        }
        // return d.children ? "lightsteelblue" : "steelblue";
        return symbolColor ? symbolColor : "steelblue";
    });

    var rootNodeText = nodeEnter.append("text").attr('class', 'rootNode').attr("dy", ".35em").style("stroke-width", 1).attr("fill", nodeFontColor).attr("font-family", nodeFontFamily ? nodeFontFamily : "Arial, Helvetica, sans-serif").style("font-style", nodeFontStyle).style("font-size", nodeFontSize + 'px').style("font-weight", nodeFontWeight)
    // .style("font", "normal 20px consolas")
    .style("text-anchor", "middle").attr("y", function (d) {
        var y = -35;
        if (d.rectHeight) {
            y = y - d.rectHeight;
        }
        return d.children || d.children ? y : y;
    }).text(function (d) {
        if (d.depth == 1) {
            return d.data.groupByLabel.join(',');
        }
    }).each(function (d) {
        _this.computedGroupByTextLength(this, d);
    }).call(_this._wrap.bind(this));

    // Add labels for the nodes
    var nodeText = nodeEnter.append('text').attr('class', 'nodeText').attr("dy", ".35em").attr("fill", nodeFontColor).attr("font-family", nodeFontFamily ? nodeFontFamily : "Arial, Helvetica, sans-serif").style("font-style", nodeFontStyle).style("font-size", nodeFontSize + 'px').style("font-weight", nodeFontWeight).attr("y", function (d) {
        var y = 15;
        if (d.rectHeight) {
            y = d.rectHeight / 2;
        }
        return d.children || d.children ? -y : -y;
    }).attr("text-anchor", 'middle').text(function (d) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            var nodeLabel = [];
            if (typeof d.data.nodeLabel === 'function') {
                nodeLabel = d.data.nodeLabel();
            } else {
                for (var i in d.data.nodeLabel) {
                    nodeLabel.push(d.data.nodeLabel[i]);
                }
            }

            return nodeLabel.join(',');
        }
    }).call(_this._wrap.bind(this));

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition().attr("transform", function (d) {
        if (d.depth == 1) return "translate(" + d.x + "," + d.y + ")";
        return "translate(" + d.x + "," + d.y + ")";
    });

    if (this.options.tooltip.triggerOn === 'mousemove') {
        nodeUpdate.on('mouseover', this.d3chart.nodeTooltip.show).on('click', null).on('mouseout', this.d3chart.nodeTooltip.hide);
    } else {
        nodeUpdate.on('click', this.d3chart.nodeTooltip.show).on('mouseover', null).on('mouseout', null);
    }

    // Update the node attributes and style
    nodeUpdate.select('circle.node').attr('cursor', 'pointer');

    nodeUpdate.select("text.nodeText").attr("fill", nodeFontColor).attr("font-family", nodeFontFamily ? nodeFontFamily : "Arial, Helvetica, sans-serif").style("font-style", nodeFontStyle).style("font-size", nodeFontSize + 'px').style("font-weight", nodeFontWeight).text(function (d) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            var nodeLabel = [];
            if (typeof d.data.nodeLabel === 'function') {
                nodeLabel = d.data.nodeLabel();
            } else {
                for (var i in d.data.nodeLabel) {
                    nodeLabel.push(d.data.nodeLabel[i]);
                }
            }
            return nodeLabel.join(',');
        }
    }).call(_this._wrap.bind(this));

    var root_text_element = nodeUpdate.select("text.nodeText");
    var root_textWidth = root_text_element.node() ? root_text_element.node().getComputedTextLength() + 10 : 0;

    nodeUpdate.select('rect.rootNode').attr("width", function (d, i) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            if (d.data.groupByLabel && d.data.groupByLabel.length == 0) return 0;
            // if (d.data.groupByLabel.length == 0) return 0;
            if (d.depth == 1) {
                return d.rectWidth;
                // return root_textWidth;
            }
        }
    }).attr("height", function (d, i) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            if (d.data.groupByLabel && d.data.groupByLabel.length == 0) return 0;
            // if (d.data.groupByLabel.length == 0) return 0;
            if (d.depth == 1) {
                return d.rectHeight;
                // return 20;
            }
        }
    }).attr("y", function (d, i) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            if (d.data.groupByLabel && d.data.groupByLabel.length == 0) return 0;
            // if (d.data.groupByLabel.length == 0) return 0;
            if (d.depth == 1) {
                return -(45 + d.rectHeight);
            }
        }
    }).attr("x", function (d, i) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            if (d.data.groupByLabel && d.data.groupByLabel.length == 0) return 0;
            // if (d.data.groupByLabel.length == 0) return 0;
            if (d.depth == 1) {
                return -(d.rectWidth / 2);
                // return -(root_textWidth / 2);
            }
        }
    });

    nodeUpdate.select("text.rootNode")
    // .attr('class', 'rootNode')
    .attr("dy", ".35em").style("stroke-width", 1).attr("fill", nodeFontColor).attr("font-family", nodeFontFamily ? nodeFontFamily : "Arial, Helvetica, sans-serif").style("font-style", nodeFontStyle).style("font-size", nodeFontSize + 'px').style("font-weight", nodeFontWeight).style("text-anchor", "middle").attr("y", function (d) {
        var y = -35;
        if (d.rectHeight) {
            y = y - d.rectHeight;
        }
        return d.children || d.children ? y : y;
    }).text(function (d) {
        if (d.depth == 1) {
            if (_this.options.plotOptions.decisionTree.label.normal.show) {
                return d.data.groupByLabel.join(',');
            }
        }
    }).call(_this._wrap.bind(this));
    // d3.tree().nodeSize([symbolSize * 10 * 2, symbolSize * 10 * 2])
    //     .separation(function (a, b) {
    //         return a.parent == b.parent ? 1.5 : 1;
    //     });
    node.exit().remove();

    var textBox = nodeText.node().getBBox();
    nodeRect.attr("width", textBox.width).attr("height", textBox.height + 10).attr("y", textBox.y).attr("x", textBox.x).attr("rx", 15).attr("ry", 15);
    // ****************** links section ***************************

    // Update the links...
    var link = this.g.selectAll('.link').data(links, function (d) {
        return d.id;
    });

    this.svg.selectAll("marker").attr('refX', -(symbolSize * 10 / linkWidth)).attr("fill", linkColor).attr("markerUnits", "strokeWidth").style('stroke', linkColor);

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', 'g').attr("class", "link").style("stroke-width", linkWidth + 'px').style('stroke', linkColor).attr('d', function (d) {
        var o = { y: d.y, x: d.x };
        if (d.depth == 1) {
            o.y = -180;
        }
        return _this.diagonal(o, o);
    });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition().attr('d', function (d) {
        if (d.depth == 1) {
            d.parent.y = -180;
        }
        return _this.diagonal(d, d.parent);
    }).style("stroke-width", linkWidth + 'px').style('stroke', linkColor);

    link.exit().transition().remove();

    var linktext = this.g.selectAll('g.link').data(links, function (d) {
        return d.id;
    });

    var linkTTT = linktext.enter().append("g").attr('class', 'linktext').attr("transform", function (d) {
        var portion = d.x < d.parent.x ? 4 / 5 : 3 / 5;

        return "translate(" + d.x + "," + (d.y - 50) + ")";
    }).attr('d', function (d) {
        var o = { y: d.y, x: d.x };
        if (d.depth == 1) {
            o.y = -180;
        }
        return _this.diagonal(o, o);
    }).attr("class", "link").append("text").attr("dy", ".35em").attr("text-anchor", "middle").attr("fill", linkFontColor).attr("font-family", linkFontFamily ? linkFontFamily : "Arial, Helvetica, sans-serif").style("font-style", linkFontStyle).style("font-size", linkFontSize + 'px').style("font-weight", linkFontWeight).text(function (d) {
        if (_this.options.plotOptions.decisionTree.linkLabel.normal.show) {
            if (typeof d.parent.data.linkLabel === 'function') {
                return d.parent.data.linkLabel($.inArray(d.data.id, d.parent.data.leaf));
            } else if (d.parent.data.linkLabel && d.parent.data.linkLabel.length > 0) {
                if ($.inArray(d.data.id, d.parent.data.leaf) == 0) {
                    return '<=' + d.parent.data.linkLabel;
                }
                return '>' + d.parent.data.linkLabel;
            }
        }
    }).call(_this._wrap.bind(this));

    if (this.options.tooltip.triggerOn === 'mousemove') {
        linkTTT.on('mouseover', this.d3chart.linkTooltip.show).on('click', null).on('mouseout', this.d3chart.linkTooltip.hide);
    } else {
        linkTTT.on('click', this.d3chart.linkTooltip.show).on('mouseover', null).on('mouseout', null);
    }

    linktext.transition().attr('d', function (d) {
        var o = { y: d.y, x: d.x };
        if (d.depth == 1) {
            o.y = -180;
        }
        return _this.diagonal(o, o);
    });

    linktext.transition().select('text').attr("fill", linkFontColor).attr("font-family", linkFontFamily ? linkFontFamily : "Arial, Helvetica, sans-serif").style("font-style", linkFontStyle).style("font-size", linkFontSize + 'px').style("font-weight", linkFontWeight).text(function (d) {
        if (_this.options.plotOptions.decisionTree.linkLabel.normal.show) {
            if (typeof d.parent.data.linkLabel === 'function') {
                return d.parent.data.linkLabel($.inArray(d.data.id, d.parent.data.leaf));
            } else if (d.parent.data.linkLabel && d.parent.data.linkLabel.length > 0) {
                if ($.inArray(d.data.id, d.parent.data.leaf) == 0) {
                    return '<=' + d.parent.data.linkLabel;
                }
                return '>' + d.parent.data.linkLabel;
            }
        }
    });

    linktext.exit().transition().remove();

    this.nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
};

D3DecisionTreeForBrightics.prototype.redraw = function () {
    var currentTransform = d3.event.transform;
    this.g.attr("transform", currentTransform);
};

D3DecisionTreeForBrightics.prototype.linkTooltipFormatter = function (params) {
    var toolItems = [];
    if (params.parent.data.linkLabel) {
        var linkLabel = params.parent.data.linkLabel();
        if (linkLabel) toolItems.push(linkLabel);
    }
    return toolItems;
};

D3DecisionTreeForBrightics.prototype.render = function () {
    var opt = this.seriesHelper.buildOptions(this.options);

    opt.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];
        if (params.parent.data.linkLabel) {
            var linkLabel = params.parent.data.linkLabel();
            if (linkLabel) toolItems.push(linkLabel);
        }
        toolItems = toolItems.concat(params.data.nodeLabel());
        return toolItems.join('<br>');
    };

    this._bindInternalOptions(this.seriesHelper);
    this.update(opt);
};

D3DecisionTreeForBrightics.prototype.getLegendData = function () {
    var legendData = [];
    return legendData;
};

exports.default = D3DecisionTreeForBrightics;

/***/ }),

/***/ 722:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decisiontreeForBrighticsExtractor = __webpack_require__(723);

var _decisiontreeForBrighticsExtractor2 = _interopRequireDefault(_decisiontreeForBrighticsExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import OptionUtils from '../../../bcharts/source/helper/option-utils';
// import D3OptionBuilder from '../../../bcharts/source/wrapper/d3/optionbuilder/d3-option-builder';

var OptionUtils = Brightics.Chart.Helper.OptionUtils;
// var DecisionTreeForBrighticsDataExtractor  = Brightics.Chart.Wrapper.Extractor['decisionTree'];

/**
 * Created by sds on 2018-03-20.
 */

var _super = Brightics.Chart.Wrapper.OptionBuilder['decisionTree'];

/**
 * DecitionTree Option Builder
 * @param parentId
 * @param options
 * @constructor
 */
function D3DecisionTreeForBrighticsOptionBuilder(parentId, options) {
    _super.call(this, parentId, options);
}

D3DecisionTreeForBrighticsOptionBuilder.prototype = Object.create(_super.prototype);
D3DecisionTreeForBrighticsOptionBuilder.prototype.constructor = D3DecisionTreeForBrighticsOptionBuilder;

D3DecisionTreeForBrighticsOptionBuilder.prototype._defaultOptions = function () {
    var opt = _super.prototype._defaultOptions.call(this);
    // opt.color.splice(0,1);
    delete opt.xAxis;
    delete opt.yAxis;
    delete opt.brush;
    return opt;
};

D3DecisionTreeForBrighticsOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'decisionTree',
        large: true,
        largeThreshold: 5000,
        label: this.bOptions.plotOptions.decisionTree.label,
        data: [],
        force: {
            repulsion: 100
        },
        layout: 'force',
        roam: true
    };
    var decisionTreeOptions = this.bOptions.plotOptions.decisionTree;
    var attributes = ['label'];
    this._applySeriesOptions(seriesItem, decisionTreeOptions, attributes);

    return seriesItem;
};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getFromColumn = function () {
    return this.bOptions.plotOptions.decisionTree.fromColumn[0].selected;
};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getToColumn = function () {
    return this.bOptions.plotOptions.decisionTree.toColumn[0].selected;
};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getGroupByColumn = function () {
    return this.bOptions.plotOptions.decisionTree.groupByColumn[0].selected;
};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getNodeLabelColumn = function () {
    return this.bOptions.plotOptions.decisionTree.nodeLabelColumn[0].selected;
};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getLinkLabelColumn = function () {
    return this.bOptions.plotOptions.decisionTree.linkLabelColumn[0].selected;
};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getSeriesKeyColumns = function () {
    return [];
};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getSeriesDataColumns = function () {
    return [];
};

D3DecisionTreeForBrighticsOptionBuilder.prototype._buildCategory = function () {};

D3DecisionTreeForBrighticsOptionBuilder.prototype.getColumnIndexes = function (column, allColumns) {
    return OptionUtils.getColumnIndexes(column.length > 0 ? this.filterNullColumn(column) : [], allColumns);
};

D3DecisionTreeForBrighticsOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.bOptions.source.localData[0];

    var nodeLabelIndexes = this.getColumnIndexes(this.getNodeLabelColumn(), localData.columns);

    return new _decisiontreeForBrighticsExtractor2.default(localData.columns, nodeLabelIndexes);
};

D3DecisionTreeForBrighticsOptionBuilder.prototype._buildSeriesData = function () {

    for (var s in this.d3Options.series) {
        var sourceData = this.d3Options.series[s].extractor.nodeExtract();
        if (sourceData.length > 500) {
            this._throwValidation('This Data has more than 500 nodes.');
        }

        var dataMap = sourceData.reduce(function (map, node) {
            map[node.id] = node;
            return map;
        }, {});
        // var treeData = [];
        var treeData = {
            name: 'mainRoot',
            children: []
        };

        var sourceDataWidthParent = this._setParentId(sourceData);
        sourceDataWidthParent.forEach(function (node) {
            var parent = dataMap[node.parent];
            if (parent) {
                (parent.children || (parent.children = [])).push(node);
            } else {
                node.parent = 'mainRoot';
                treeData.children.push(node);
            }
        });

        this.d3Options.series[s].data = treeData;
    }
};

D3DecisionTreeForBrighticsOptionBuilder.prototype._setParentId = function (source) {
    var sourceDataWidthParent = source;
    for (var i in sourceDataWidthParent) {
        for (var j in sourceDataWidthParent) {
            if ($.inArray(sourceDataWidthParent[i].id, sourceDataWidthParent[j].leaf) != -1) {
                sourceDataWidthParent[i].parent = sourceDataWidthParent[j].id;
            }
        }
    }
    return sourceDataWidthParent;
};

exports.default = D3DecisionTreeForBrighticsOptionBuilder;

/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by sds on 2018-03-20.
 */

// import AggregationDataExtractor from '../../../bcharts/source/wrapper/d3/extractor/d3-aggregation-extractor';
// import AggregationOperator from '../../../bcharts/source/helper/aggregation-operator';

var AggregationDataExtractor = Brightics.Chart.Wrapper.Extractor['d3-aggregation'];
var AggregationOperator = Brightics.Chart.Helper.AggregationOperator;

/**
 * X 축의 값이 category, Y 축의 값이 aggregation 된 형태의 Series Data 를 생성
 * @param columnIndexes
 * @constructor
 */
var TREE_ID = 'tree_id',
    NODE_ID = 'node_id',
    IS_LEAF = 'is_leaf',
    SPLIT_FEATURE_NAME = 'split_feature_name',
    SPLIT_THRESHOLD = 'split_threshold',
    SPLIT_LEFT_CATEGORIES_VALUES = 'split_left_categories_values',
    SPLIT_RIGHT_CATEGORIES_VALUES = 'split_right_categories_values',
    PREDICT = 'predict',
    PROB = 'prob',
    STATS = 'stats',
    IMPURITY = 'impurity',
    GAIN = 'gain';

function DecisionTreeForBrighticsDataExtractor(columns, nodeLabelIndexes) {
    AggregationDataExtractor.call(this, []);
    this.columns = columns;
    this.nodeLabelIndexes = nodeLabelIndexes;

    this.nodeIdIndex = this._getColumnIndex(NODE_ID);
    this.groupByColumnIndex = this._getColumnIndex(TREE_ID);
    this.isLeafIndex = this._getColumnIndex(IS_LEAF);
    this.splitFeatureNameIndex = this._getColumnIndex(SPLIT_FEATURE_NAME);
    this.splitThresholdIndex = this._getColumnIndex(SPLIT_THRESHOLD);
    this.splitLeftCategoriesValuesIndex = this._getColumnIndex(SPLIT_LEFT_CATEGORIES_VALUES);
    this.splitRightCategoriesValuesIndex = this._getColumnIndex(SPLIT_RIGHT_CATEGORIES_VALUES);

    this.predictIndex = this._getColumnIndex(PREDICT);
    this.probIndex = this._getColumnIndex(PROB);
    this.statsIndex = this._getColumnIndex(STATS);
    this.impurityIndex = this._getColumnIndex(IMPURITY);
    this.gainIndex = this._getColumnIndex(GAIN);

    this._nodeOperators = {};
    this._targetNodeOperators = {};
    this._nodes = {};
    this._targetNodes = {};
}

DecisionTreeForBrighticsDataExtractor.prototype = Object.create(AggregationDataExtractor.prototype);
DecisionTreeForBrighticsDataExtractor.prototype.constructor = DecisionTreeForBrighticsDataExtractor;

DecisionTreeForBrighticsDataExtractor.prototype._getLabels = function (row, indexes) {
    var linkLabels = [];
    for (var i in indexes) {
        linkLabels.push(row[indexes[i]]);
    }
    return linkLabels;
};

DecisionTreeForBrighticsDataExtractor.prototype._pushNodes = function (row, rowIndex) {
    var id = Number.parseInt(row[this.nodeIdIndex]);
    if (this.groupByColumnIndex !== -1) {
        var groupKeys = [];
        for (var i in this.groupByColumnIndex) {
            groupKeys.push(row[this.groupByColumnIndex[i]]);
        }

        var groupKey = row[this.groupByColumnIndex];

        var nodeId = groupKey + '::' + id;

        this._nodes[nodeId] = {};
        var node = this._nodes[nodeId];
        node.name = nodeId;
        if (row[this.isLeafIndex] == false) {
            node.leaf = [groupKey + '::' + id * 2, groupKey + '::' + (id * 2 + 1)];
        } else {
            node.leaf = [];
        }
    } else {
        this._nodes[id] = {};
        var node = this._nodes[id];
        node.name = id;

        if (row[this.isLeafIndex] == false) {
            node.leaf = [id * 2 + '', id * 2 + 1 + ''];
        } else {
            node.leaf = [];
        }
    }

    var nodeOperator = new AggregationOperator(node.name);
    nodeOperator.leaf = node.leaf;
    nodeOperator.nodeLabel = this._getNodeLabel.bind(this, row);
    nodeOperator.linkLabel = this._getLinkLabel.bind(this, row);
    nodeOperator.groupByLabel = this._getLabels(row, this.groupByColumnIndex);
    nodeOperator.from = id;
    this._nodeOperators[node.name] = nodeOperator;
};

DecisionTreeForBrighticsDataExtractor.prototype._getNodeLabel = function (row, index) {
    var labelList = [];
    var isAvailable = function isAvailable(columnIndex) {
        if (columnIndex !== -1 && row[columnIndex] !== -1 && row[columnIndex] != 'NaN') return true;else return false;
    };

    var nodeLabelIndex;
    for (var i = 0; i < this.nodeLabelIndexes.length; i++) {
        nodeLabelIndex = this.nodeLabelIndexes[i];
        if (nodeLabelIndex === -1) continue;
        labelList.push(this.columns[nodeLabelIndex].name + ' : ' + +row[nodeLabelIndex]);
    }

    if (labelList.length === 0) {
        labelList.push(NODE_ID + ' : ' + row[this.nodeIdIndex]);
        if (isAvailable(this.predictIndex)) {
            labelList.push(PREDICT + ' : ' + row[this.predictIndex]);
        }
        if (isAvailable(this.probIndex)) {
            labelList.push(PROB + ' : ' + row[this.probIndex]);
        }
        if (isAvailable(this.statsIndex)) {
            labelList.push(STATS + ' : ' + row[this.statsIndex].join(':'));
        }
        if (isAvailable(this.impurityIndex)) {
            labelList.push(IMPURITY + ' : ' + row[this.impurityIndex]);
        }
        if (isAvailable(this.gainIndex)) {
            labelList.push(GAIN + ' : ' + row[this.gainIndex]);
        }
    }
    return labelList;
};

DecisionTreeForBrighticsDataExtractor.prototype._getLinkLabel = function (row, index) {
    if (row[this.splitFeatureNameIndex] && row[this.splitThresholdIndex] != 'NaN') {
        if (index == 0) {
            return row[this.splitFeatureNameIndex] + '<=' + row[this.splitThresholdIndex];
        } else {
            return row[this.splitFeatureNameIndex] + '>' + row[this.splitThresholdIndex];
        }
    } else if (row[this.splitFeatureNameIndex] && row[this.splitThresholdIndex] == 'NaN') {
        if (index == 0 && this.splitLeftCategoriesValuesIndex != -1) {
            return row[this.splitFeatureNameIndex] + '=' + row[this.splitLeftCategoriesValuesIndex];
        } else if (index == 1 && this.splitRightCategoriesValuesIndex != -1) {
            return row[this.splitFeatureNameIndex] + '=' + row[this.splitRightCategoriesValuesIndex];
        }
    }
};

DecisionTreeForBrighticsDataExtractor.prototype.push = function (row, rowIndex) {
    this._pushNodes(row, rowIndex);
};

DecisionTreeForBrighticsDataExtractor.prototype.nodeExtract = function (operator) {
    var answer = [];
    for (var name in this._nodeOperators) {
        var pointData = {
            id: name,
            nodeLabel: this._nodeOperators[name].nodeLabel,
            linkLabel: this._nodeOperators[name].linkLabel,
            groupByLabel: this._nodeOperators[name].groupByLabel,
            leaf: this._nodeOperators[name].leaf,
            from: this._nodeOperators[name].from
        };

        if (operator) {
            pointData.value = this._nodeOperators[name].calc(operator);
        }

        answer.push(pointData);
    }
    return answer;
};

DecisionTreeForBrighticsDataExtractor.prototype._getColumnIndex = function (columnName) {
    for (var i = 0; i < this.columns.length; i++) {
        if (this.columns[i].name === columnName) {
            return i;
        }
    }
    return -1;
};

exports.default = DecisionTreeForBrighticsDataExtractor;

/***/ }),

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by SDS on 2017-05-10.
 */
// import ValidatorBase from '../../../bcharts/source/validator/types/chart-validator-base';

var _super = Brightics.Chart.Validator.Base;

var MANDATORY_COLUMNS = ['node_id', 'is_leaf', 'split_feature_name', 'split_threshold'];

function DecisionTreeForBrighticsChartValidator(options) {
    _super.call(this, options);
}

DecisionTreeForBrighticsChartValidator.prototype = Object.create(_super.prototype);
DecisionTreeForBrighticsChartValidator.prototype.constructor = DecisionTreeForBrighticsChartValidator;

DecisionTreeForBrighticsChartValidator.prototype.getAxisOptions = function () {
    return [];
};

DecisionTreeForBrighticsChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

DecisionTreeForBrighticsChartValidator.prototype._validateData = function (target, dataSetList, dataIndex) {
    _super.prototype._validateData.call(this, target, dataSetList, dataIndex);
    var columnList = this._columnList[dataIndex];

    var mandatoryColumnMessage = 'value-005';
    var targetObj;
    var mandatoryColumnName, columnName, isExist;
    for (var i = 0; i < MANDATORY_COLUMNS.length; i++) {
        mandatoryColumnName = MANDATORY_COLUMNS[i];
        isExist = false;
        for (var j = 0; j < columnList.length; j++) {
            columnName = columnList[j].name;
            if (columnName === mandatoryColumnName) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            targetObj = { target: columnName };
            this._createProblem(mandatoryColumnMessage, ['Schema (' + mandatoryColumnName + ')'], targetObj);
        }
    }
};

// Brightics.Chart.Validator['decisionTreeForBrightics'] = DecisionTreeForBrighticsChartValidator;

exports.default = DecisionTreeForBrighticsChartValidator;

/***/ }),

/***/ 725:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by SDS on 2017-05-10.
 */

var _super = Brightics.Chart.Adonis.Component.ChartOption.Base;

function DecisionTreeForBrighticsChartOption(parentId, options) {
    _super.call(this, parentId, options);
}

DecisionTreeForBrighticsChartOption.prototype = Object.create(_super.prototype);
DecisionTreeForBrighticsChartOption.prototype.constructor = DecisionTreeForBrighticsChartOption;

DecisionTreeForBrighticsChartOption.prototype._init = function () {
    _super.prototype._init.call(this);
    var _this = this;

    var labelSettings = [{
        showBtn: false,
        ref: _this.options.chartOption.plotOptions.decisionTree.label.normal,
        getLabelChangedOption: function getLabelChangedOption(value) {
            var decisionTree = $.extend(true, {}, _this.options.chartOption.plotOptions.decisionTree);
            decisionTree.label.normal = value;
            return {
                plotOptions: {
                    decisionTree: decisionTree
                }
            };
        },
        label: 'Node Label'
    }, {
        showBtn: false,
        ref: _this.options.chartOption.plotOptions.decisionTree.linkLabel.normal,
        getLabelChangedOption: function getLabelChangedOption(value) {

            var decisionTree = $.extend(true, {}, _this.options.chartOption.plotOptions.decisionTree);
            decisionTree.linkLabel.normal = value;
            return {
                plotOptions: {
                    decisionTree: decisionTree
                }
            };
        },
        label: 'Link Label'
    }];

    this.options.setting.columnSelector = [[]];
    this.options.setting.labelSettings = labelSettings;
    this.options.setting.figureStyle = this.options.chartOption.plotOptions.decisionTree.style;
    this.options.setting.figureStyle.node.autoSize = true;
};

DecisionTreeForBrighticsChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Label', 'Figure', 'FrameStyle'];
};

exports.default = DecisionTreeForBrighticsChartOption;

/***/ })

/******/ });