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
/******/ 	return __webpack_require__(__webpack_require__.s = 459);
/******/ })
/************************************************************************/
/******/ ({

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseLayout = __webpack_require__(199);

var _baseLayout2 = _interopRequireDefault(_baseLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ITEM_CLASS = 'bcharts-tethys-layout-item';

function FlexLayout(parentId, options) {
    _baseLayout2.default.call(this, parentId, $.extend(true, {}, options));
}

FlexLayout.prototype = Object.create(_baseLayout2.default.prototype);
FlexLayout.prototype.constructor = FlexLayout;

FlexLayout.prototype.createContents = function () {
    this.$mainControl = $('' + '<div class="bcharts-tethys">' + '   <div class="bcharts-tethys-layout" layout="flex">' + '   </div>' + '</div>');

    return this.$mainControl;
};

FlexLayout.prototype.createLayout = function () {
    var $parent = this.$mainControl.children('.bcharts-tethys-layout');
    this._createFlexLayout($parent, this.options.keys(), this.options.layout.flexData);
    this._perfectScrollbar($parent);
};

FlexLayout.prototype._createFlexLayout = function ($parent, items, flexData) {
    for (var i in items) {
        var chartUid = this._uuid + i;

        var $el = $('' + '<div class="' + ITEM_CLASS + '" status="ready" id="' + chartUid + '">' + '   <div class="bcharts-tethys-loading"></div>' + '</div>');
        if (flexData.width) $el.css('width', flexData.width);
        if (flexData.height) $el.css('height', flexData.height);
        $el.find('.bcharts-tethys-loading').text(items[i]);
        $el.data('ItemKey', items[i]);
        $el.data('chartUid', chartUid);
        $el.attr('groupByKeyName', 'bcharts-' + i + '-' + this.genGroupByKeyName(items[i]));

        $parent.append($el);
    }
};

FlexLayout.prototype._perfectScrollbar = function ($target) {
    $target.perfectScrollbar();
    $target.on('ps-scroll-x', function () {
        $(window).scroll();
    });
    $target.on('ps-scroll-y', function () {
        $(window).scroll();
    });
};

FlexLayout.prototype.hasAutoEvent = function () {
    return false;
};
FlexLayout.prototype.doAutoEvent = function () {
    var $target = this.$mainControl.find('.bcharts-tethys-layout');
    var currentY = $target.scrollTop();
    $target.scrollTop(currentY + parseInt(this.options.layout.flexData.height.replace('px', '')));
};

FlexLayout.prototype.getAppearItems = function () {
    return this.$mainControl.find(this.getAppearItemSelector());
};

FlexLayout.prototype.getAppearItemSelector = function () {
    return '.' + ITEM_CLASS;
};

FlexLayout.prototype.destroy = function () {
    this.$mainControl.remove();
};

exports.default = FlexLayout;

/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var ChartWidget = Brightics.Chart.Widget;

function Layout(parentId, options) {
    ChartWidget.call(this, parentId, $.extend(true, {}, options));
    this._uuid = this.createUUID();
}

Layout.prototype = Object.create(ChartWidget.prototype);
Layout.prototype.constructor = Layout;

Layout.prototype.createContents = function () {};
Layout.prototype.createLayout = function () {};
Layout.prototype.getAppearItems = function () {};
Layout.prototype.getAppearItemSelector = function () {};
Layout.prototype.getLayoutContainer = function () {};
Layout.prototype.hasAutoEvent = function () {};
Layout.prototype.doAutoEvent = function () {};
Layout.prototype.destroy = function () {};
Layout.prototype.createUUID = function () {
    var ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

    var nextChar = function nextChar(str) {
        return str.charAt(Math.floor(Math.random() * str.length));
    };

    var nextId = function nextId() {
        var size = 10;
        var rtn = '';
        for (var i = 0; i < size; i++) {
            rtn += nextChar(ALPHABET);
        }
        return rtn;
    };

    return nextId();
};

Layout.prototype.genGroupByKeyName = function (keyStr) {
    if (typeof keyStr !== 'string') keyStr = JSON.stringify(keyStr);
    return keyStr.replace(/[.]/gi, '-').replace(/["]/gi, '\\"');
};

exports.default = Layout;

/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bchartsTethys = __webpack_require__(460);

var _bchartsTethys2 = _interopRequireDefault(_bchartsTethys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$.fn.bchartsTethys = function (options, propertyName, propertyValue) {
    var $el = this.first();
    if (options) {
        if (typeof options === 'string') {
            var method = options;
            var adonis = $el.children('.bcharts-tethys').data('BChartsTethysRef');
            if (adonis && typeof adonis[method] === 'function') return adonis[method](propertyName, propertyValue);
        } else {
            var adonis = new _bchartsTethys2.default($el, options);
            $el.children('.bcharts-tethys').data('BChartsTethysRef', adonis);
            return this;
        }
    } else {
        return $el.children('.bcharts-tethys').data('BChartsTethysRef');
    }
}; /**
    * Source: bcharts-tethys-jquery.js
    * Created by daewon.park on 2017-04-127.
    */

/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _flexLayout = __webpack_require__(198);

var _flexLayout2 = _interopRequireDefault(_flexLayout);

var _chartCache = __webpack_require__(461);

var _chartCache2 = _interopRequireDefault(_chartCache);

var _layoutRegister = __webpack_require__(462);

var LayoutRegistry = _interopRequireWildcard(_layoutRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bcharts-tethys.js
 * Created by daewon.park on 2017-06-09.
 */

var ChartWidget = Brightics.Chart.Widget;

function BChartsTethys(parentId, options) {
    ChartWidget.call(this, parentId, $.extend(true, {}, options));
    this._putTethysRef();
}

BChartsTethys.prototype = Object.create(ChartWidget.prototype);
BChartsTethys.prototype.constructor = BChartsTethys;

BChartsTethys.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    if (this._getTethysRef()) {
        this._getTethysRef().destroy();
    }
    this.chartCache = new _chartCache2.default(this.options.cache);
    this.layoutManager = this._createLayoutManager();
    this.currentRenderJobCount = 0;
};

BChartsTethys.prototype.destroy = function () {
    this._clearAppearEvent();
    this.chartCache.destroy();
    this.layoutManager.destroy();
    this.currentRenderJobCount = 0;
    clearInterval(this.chartRenderIntervalId);
};

BChartsTethys.prototype._createLayoutManager = function () {
    if (this.options.layout && this.options.layout.type) {
        return LayoutRegistry.createLayout(this.options.layout.type, this.parentId, this.options);
    } else {
        return new _flexLayout2.default(this.parentId, this.options);
    }
};

BChartsTethys.prototype._createContents = function ($parent) {
    var _this = this;
    this.$mainControl = this.layoutManager.createContents();

    if (this.$mainControl) {
        $parent.append(this.$mainControl);
    }
    this._applyStyle();

    this.layoutManager.createLayout();

    this._bindAppearEvent();

    this._doLayoutAutoEvent();

    this.chartRenderIntervalId = setInterval(function () {
        _this._renderChart();
    }, 300);
};

BChartsTethys.prototype._applyStyle = function () {
    var styles = ['background', 'border', 'padding', 'width', 'height', 'borderRadius'];
    for (var i in styles) {
        if (typeof this.options.style[styles[i]] !== 'undefined' && this.$mainControl) this.$mainControl.css(styles[i], this.options.style[styles[i]]);
    }
};

BChartsTethys.prototype._bindAppearEvent = function () {
    var _this = this;

    var $items = this.layoutManager.getAppearItems();
    var selector = this.layoutManager.getAppearItemSelector();
    var $container = this.layoutManager.getLayoutContainer() || this.$parent;

    $items.appear({
        interval: 250,
        force_process: true
    });

    this._appearFunction = function (e, $affected) {
        if ($(e.target).attr('status') === 'ready') {
            var chartId = $(e.target).attr('id');
            _this.chartCache.appeared([chartId]);
        }
    };

    $items.on('appear', this._appearFunction);

    this._disappearFunction = function (e, $affected) {
        var chartId = $(e.target).attr('id');
        _this.chartCache.disappeared(chartId);
    };
    $items.on('disappear', this._disappearFunction);
};

BChartsTethys.prototype._clearAppearEvent = function () {
    var $items = this.layoutManager.getAppearItems();

    $items.off('appear', this._appearFunction);
    $items.off('disappear', this._disappearFunction);
};

BChartsTethys.prototype._doLayoutAutoEvent = function () {
    var _this = this;

    if (!this.layoutManager.hasAutoEvent()) return;

    setTimeout(function () {
        _this._doLayoutAutoEvent();
    }, 1000);

    if (this._isStarted && _this._isIdle()) {
        this.layoutManager.doAutoEvent();
    }
};

BChartsTethys.prototype._renderChart = function () {
    if (this.currentRenderJobCount > 0) return;

    var _this = this;
    this._isStarted = true;

    var $container = this.layoutManager.getLayoutContainer() || this.$parent;

    var chartId = this.chartCache.shift();
    if (chartId) {
        _this.currentRenderJobCount++;
        var $el = $container.find('#' + chartId);
        $el.find('.bcharts-container').remove();
        $el.attr('status', 'loaded');
        var itemKey = $el.data('ItemKey');
        var chartOptions = this.options.chart(itemKey);
        $el.bcharts(chartOptions);
        $el.find('.bcharts-container').on('bindingComplete', function () {
            _this.currentRenderJobCount--;
        });
        $el.find('.bcharts-container').on('bindingError', function () {
            _this.currentRenderJobCount--;
        });
    }
    this._gc();
};

BChartsTethys.prototype._destroyChart = function (chartId) {
    var _this = this;
    var $el = this.$parent.find('[groupByKeyName="' + CSS.escape(chartId) + '"]');

    // create cache element
    var $cached = $el.children('.bcharts-container').clone();
    if (typeof $cached[0] != 'undefined') {
        var img = new Image();
        img.src = $el.bcharts('getDataURL', { pixelRatio: 2 });
        $cached.find('.bcharts-chart').empty();
        $cached.find('.bcharts-chart').append(img);
        $cached.mouseover(function () {
            // mouse over 되었을 경우에 real chart 로 복원
            _this.chartCache.appeared([$(this).parent().attr('groupByKeyName')]);
        });

        // destory original element
        $el.bcharts('destroy');
        $el.children('.bcharts-container').remove();

        $el.append($cached);
        $el.attr('status', 'cached');
    }
};

BChartsTethys.prototype._isIdle = function () {
    return this.chartCache.loadingList.length == 0 && this.currentRenderJobCount == 0;
};

BChartsTethys.prototype._gc = function () {
    var garbage = this.chartCache.gc();
    for (var i in garbage) {
        this._destroyChart(garbage[i]);
    }
};

BChartsTethys.prototype._putTethysRef = function () {
    this.$parent.data('bcharts-tethys-ref', this);
};

BChartsTethys.prototype._getTethysRef = function () {
    return this.$parent.data('bcharts-tethys-ref');
};

exports.default = BChartsTethys;

/***/ }),

/***/ 461:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: chart-cache.js
 * Created by daewon.park on 2017-06-09.
 */

function ChartCache(parameters) {
    var maxLimit = parameters.maxLimit;
    var evictionCount = parameters.evictionCount;
    this.loadingList = []; // 아직 Load 되지 않은 대기중인 Chart 리스트
    this.loadedList = []; // Load 완료된 Chart 리스트(최근에 Load 된 Chart 일 수록 마지막에 추가됨)

    this.maxLimit = maxLimit; // loaded 에 보관 가능한 최대 Chart 개수
    this.evictionCount = evictionCount; // loaded 에서 오래된 Chart 를 삭제할 때 한번에 삭제 가능한 최대 Chart 개수
}

/**
 * Chart 가 화면에 나타났을 때, - loaded 에 있을 경우 loaded 의 마지막으로 위치 변경 - loaded 에 없고, loading 에도 없을 경우에만 loading 의 처음에 추가
 */
ChartCache.prototype.appeared = function (chartIds) {
    for (var i = 0; i < chartIds.length; i++) {
        var index = $.inArray(chartIds[i], this.loadedList);
        if (index > -1) {
            this.loadedList.splice(index, 1);
            this.loadedList.push(chartIds[i]);
        } else {
            index = $.inArray(chartIds[i], this.loadingList);
            if (index < 0) {
                this.loadingList.push(chartIds[i]);
                // console.log('BChartsTethys: Add to loading list ' + chartIds[i] + ' (' + this.loadingList.length + ')');
            }
        }
    }
};

/**
 * Chart 가 화면에서 사라졌을 때, - loading 에 있을 경우만 loading 에서 삭제(불필요한 Chart 생성 방지)
 */
ChartCache.prototype.disappeared = function (chartId) {

    var index = $.inArray(chartId, this.loadingList);
    if (index > -1) {
        this.loadingList.splice(index, 1);
        // console.log('BChartsTethys: Remove from loading list ' + chartId + ' (' + this.loadingList.length + ')');
    }
};

/**
 * Chart 가 생성되었으므로 loading 에서 삭제하고 loaded 에 추가
 */
ChartCache.prototype.shift = function () {

    var chartId = this.loadingList.shift();
    if (typeof chartId != 'undefined') {
        this.loadedList.push(chartId);
    }
    return chartId;
};

/**
 * maxLimit 을 초과한 Chart 삭제
 */
ChartCache.prototype.gc = function () {

    var garbages = [];
    if (this.loadedList.length > this.maxLimit) {
        for (var i = 0; i < this.evictionCount; i++) {
            garbages.push(this.loadedList.shift());
        }
    }

    return garbages;
};

ChartCache.prototype.destroy = function () {
    this.loadingList = []; // 아직 Load 되지 않은 대기중인 Chart 리스트
    this.loadedList = []; // Load 완료된 Chart 리스트(최근에 Load 된 Chart 일 수록 마지막에 추가됨)
};

exports.default = ChartCache;

/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerLayout = registerLayout;
exports.createLayout = createLayout;

var _layoutIndex = __webpack_require__(463);

var Layout = _interopRequireWildcard(_layoutIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var layout = {}; /**
                  * Source: layout-register.js
                  * Created by ji_sung.park on 2018-05-30
                  */

_init();

function _init() {
    var layoutList = Object.keys(Layout);
    layoutList.forEach(function (layoutType) {
        layout[layoutType] = Layout[layoutType];
    });
}

exports.default = layout;
function registerLayout(option) {
    if ($.isEmptyObject(layout)) {
        console.log('chart layout register is empty');
    }
    layout[option.Key] = option.Func;
}

function createLayout(layoutType, parentId, options) {
    if (!layout[layoutType] || !parentId || !options) {
        throw new Error('Cannot create chart layout. ' + layoutType);
    }
    return new layout[layoutType](parentId, options);
}

/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.each = exports.flex = undefined;

var _flexLayout = __webpack_require__(198);

var _flexLayout2 = _interopRequireDefault(_flexLayout);

var _eachLayout = __webpack_require__(464);

var _eachLayout2 = _interopRequireDefault(_eachLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: layout-index.js
 * Created by ji_sung.park on 2018-05-30
 */

exports.flex = _flexLayout2.default;
exports.each = _eachLayout2.default;

/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseLayout = __webpack_require__(199);

var _baseLayout2 = _interopRequireDefault(_baseLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ITEM_CLASS = 'bcharts-tethys-layout-item';

function EachLayout(parentId, options) {
    _baseLayout2.default.call(this, parentId, $.extend(true, {}, options));
}

EachLayout.prototype = Object.create(_baseLayout2.default.prototype);
EachLayout.prototype.constructor = EachLayout;

EachLayout.prototype._init = function () {
    this.$items = this.parentId.prevObject;
};

EachLayout.prototype.createLayout = function () {

    var items = this.$items;
    var keys = this.options.keys();

    for (var i = 0; i < items.length; i++) {

        var key = this.genGroupByKeyName(keys[i]);
        var chartUid = this._uuid + i;

        var $el = $('' + '<div class="' + ITEM_CLASS + '" status="ready" layout="each" id="' + chartUid + '">' + '   <div class="bcharts-tethys-loading"></div>' + '</div>');
        $el.find('.bcharts-tethys-loading').text(keys[i]);
        $el.data('ItemKey', key);
        $el.data('chartUid', chartUid);
        $el.attr('groupByKeyName', 'bcharts-' + i + '-' + key);

        $(items[i]).append($el);
    }
};

EachLayout.prototype.getAppearItems = function () {
    return this.$items.find('.' + ITEM_CLASS);
};

EachLayout.prototype.getLayoutContainer = function () {
    return $(document.body);
};

EachLayout.prototype.getAppearItemSelector = function () {
    return '.' + ITEM_CLASS;
};

EachLayout.prototype.destroy = function () {
    this.getAppearItems().remove();
};

exports.default = EachLayout;

/***/ })

/******/ });