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
/******/ 	return __webpack_require__(__webpack_require__.s = 200);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Decorator(builder, options) {
    this.builder = builder;
    this.options = options;
    this.eOptions = this.builder.eOptions;
    this.bOptions = this.builder.bOptions;
    this.plotOptions = this.builder.plotOptions;
}

Decorator.prototype.decorate = function () {};

Decorator.prototype._getColumnNamesCategories = function () {
    var categories = [];
    var yAxis = this.bOptions.yAxis[0].selected;

    for (var i = 0; i < yAxis.length; i++) {
        if (!yAxis[i]) continue;
        categories.push(_optionUtils2.default.getColumnLabel(yAxis[i]));
    }
    return categories;
};

exports.default = Decorator;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: option-utils.js
 * Created by daewon.park on 2017-03-30.
 */

var numberFmtRgx = /{(0*[\,\.]0*)}|{(0*\,0*\.0*)}/g;

exports.default = {
    hasAggregation: function hasAggregation(selectedColumn) {
        return selectedColumn.aggregation && selectedColumn.aggregation !== 'none';
    },
    getColumnList: function getColumnList(dataSource, sourceIndex) {
        sourceIndex = sourceIndex || 0;
        var columnList;
        if (dataSource.dataType === 'lazy') {
            if (typeof dataSource.lazyData[sourceIndex].columns === 'function') {
                columnList = dataSource.lazyData[sourceIndex].columns();
            } else {
                columnList = dataSource.lazyData[sourceIndex].columns;
            }
        } else {
            columnList = dataSource.localData[sourceIndex].columns;
        }
        return columnList;
    },
    getColumnLabel: function getColumnLabel(selectedColumn) {
        if (!selectedColumn) return;
        var labels = {
            'max': 'Max({0})',
            'min': 'Min({0})',
            'sum': 'Sum({0})',
            'average': 'Average({0})',
            'count': 'Count({0})',
            'unique_count': 'Unique Count({0})'
        };
        if (labels[selectedColumn.aggregation]) {
            return labels[selectedColumn.aggregation].replace(/\{(\d+)\}/g, selectedColumn.name);
        } else {
            return selectedColumn.name;
        }
    },
    getColumnSet: function getColumnSet(options) {
        return options.source.localData[0].columns;
    },
    getXColumns: function getXColumns(options) {
        if (options.xAxis[0].axisType) {
            return [{
                type: 'string',
                axisType: options.xAxis[0].axisType
            }];
        } else {
            for (var s in options.xAxis[0].selected) {
                options.xAxis[0].selected[s].type = this.getColumnType(options.xAxis[0].selected[s].name, this.getColumnSet(options));
            }
            return options.xAxis[0].selected;
        }
    },
    // 18.01.11 axisType을 selected 안으로 spec 변경(axisType과 일반 column을  multi 개로 입력 가능
    getXAxisType: function getXAxisType(options) {
        return options.xAxis[0].axisType || options.xAxis[0].selected[0].axisType || 'default';
    },
    getYColumns: function getYColumns(options) {
        for (var s in options.yAxis[0].selected) {
            if (!options.yAxis[0].selected[s]) continue;
            options.yAxis[0].selected[s].type = this.getColumnType(options.yAxis[0].selected[s].name, this.getColumnSet(options));
        }
        return options.yAxis[0].selected;
    },
    getYAxisType: function getYAxisType(options) {
        return options.yAxis[0].axisType || 'default';
    },
    getColumnType: function getColumnType(columnName, columnSet) {
        for (var c in columnSet) {
            if (columnSet[c].name == columnName) {
                return columnSet[c].type;
            }
        }
    },
    leastSquares: function leastSquares(xData, yData) {
        var xDataLen = xData.length;
        var xSum = xData.reduce(function (prev, curr) {
            return prev + curr;
        });
        var c = xSum;
        var xSumOfSquare = xData.map(function (value, index) {
            return value * value;
        }).reduce(function (prev, curr) {
            return prev + curr;
        });
        var det = xDataLen * xSumOfSquare - xSum * c;
        var ySum = yData.reduce(function (prev, curr) {
            return prev + curr;
        });
        var f = function () {
            var sum = 0;
            for (var i = 0; i < xDataLen; i++) {
                sum = sum + xData[i] * yData[i];
            }
            return sum;
        }();
        var x = det !== 0 ? [(xSumOfSquare * ySum - xSum * f) / det, (xDataLen * f - xSum * ySum) / det] : [Number.NaN, Number.NaN];
        var xMin = Math.min.apply(null, xData);
        var xMax = Math.max.apply(null, xData);
        return [xMin, x[0] + x[1] * xMin, xMax, x[0] + x[1] * xMax];
    },
    getSelectedColumnCount: function getSelectedColumnCount(arr) {
        var cnt = 0;
        for (var a in arr) {
            if (arr[a].selected) {
                for (var s in arr[a].selected) {
                    if (arr[a].selected[s].name) {
                        cnt++;
                    }
                }
            }
        }
        return cnt;
    },
    getColumnIndex: function getColumnIndex(column, allColumns) {
        var indexes = this.getColumnIndexes([column], allColumns);
        return indexes.length > 0 ? indexes[0] : -1;
    },
    getColumnIndexes: function getColumnIndexes(columns, allColumns) {
        var indexes = [];
        for (var i in columns) {
            // if (!columns.name) continue;
            var idx = -1;
            for (var j in allColumns) {
                if (columns[i] && columns[i].axisType) {
                    idx = columns[i].axisType;
                    break;
                }
                if (columns[i] && columns[i].name == allColumns[j].name) {
                    idx = parseInt(j);
                    break;
                }
            }
            indexes.push(idx);
        }
        return indexes;
    },
    getAxisType: function getAxisType(axis) {
        var type;
        var axisTmp = axis;
        if (Array.isArray(axisTmp)) {
            if (axisTmp.length > 1) return 'category';else axisTmp = axis[0];
        }
        if (axisTmp && axisTmp.type.toLowerCase() === 'string' && (typeof axisTmp.aggregation === 'undefined' || axisTmp.aggregation === 'none')) {
            type = 'category';
        } else if (axisTmp && axisTmp.type.toLowerCase() === 'date') {
            type = 'time';
        } else {
            type = 'value';
        }
        return type;
    },
    /**
     * parse format string to type, digits.
     * ex)
     * 0.00e+0 -> exponential, 2
     * 0.00000 -> number, 5
     * @param fmtStr
     */
    parseFmtStrToObj: function parseFmtStrToObj(fmtStr) {
        var type, digit;
        if (fmtStr.includes('e') && fmtStr.includes('.')) {
            type = 'exponential';
            digit = fmtStr.indexOf('e') - fmtStr.indexOf('.') - 1;
        } else if (fmtStr.includes('.')) {
            type = 'number';
            digit = fmtStr.length - fmtStr.indexOf('.') - 1;
        } else {
            type = 'custom';
            digit = -1;
        }
        return { type: type, digit: digit };
    },
    parseFmtObjToStr: function parseFmtObjToStr(fmtObj) {
        var _zeroLoop = function _zeroLoop(target, repeatCnt) {
            for (var idx = 0; idx < repeatCnt; idx++) {
                target += '0';
            }
            return target;
        };

        var rtnStr = '';
        if (fmtObj.type === 'exponential') {
            rtnStr += '0.' + _zeroLoop('', fmtObj.digit) + 'e+0';
        } else if (['number', 'double', 'integer'].includes(fmtObj.type)) {
            rtnStr += '0.' + _zeroLoop('', fmtObj.digit);
        } else {
            rtnStr = fmtObj.digit;
        }
        return rtnStr;
    },
    numericSortRule: function numericSortRule(a, b) {
        if (!isFinite(a - b)) {
            return !isFinite(a) ? 1 : -1;
        } else if (typeof a === 'string') {
            return Number(a) - Number(b);
        } else {
            return a - b;
        }
    },
    timeSortRule: function timeSortRule(a, b) {
        var timeA = Date.parse(a);
        var timeB = Date.parse(b);
        if (!isFinite(timeA - timeB)) {
            return !isFinite(timeA) ? 1 : -1;
        } else {
            return timeA - timeB;
        }
    },
    stringSortRule: function stringSortRule(a, b) {
        if (typeof a !== 'string' || typeof b !== 'string') {
            return typeof a !== 'string' ? 1 : -1;
        } else if (a < b) {
            return -1;
        } else if (a == b) {
            return 0;
        } else return 1;
    },
    dateFormatString: function dateFormatString(data, format) {
        var dateVal = new Date(data);

        /*
         * Date Format 1.2.3
         * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
         * MIT license
         *
         * Includes enhancements by Scott Trenda <scott.trenda.net>
         * and Kris Kowal <cixar.com/~kris.kowal/>
         *
         * Accepts a date, a mask, or a date and a mask.
         * Returns a formatted version of the given date.
         * The date defaults to the current date/time.
         * The mask defaults to dateFormat.masks.default.
         */
        var dateFormat = function () {
            var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                timezoneClip = /[^-+\dA-Z]/g,
                pad = function pad(val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = '0' + val;
                }return val;
            };

            // Regexes and supporting functions are cached through closure
            return function (date, mask, utc) {
                var dF = dateFormat;

                // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
                if (arguments.length == 1 && Object.prototype.toString.call(date) == '[object String]' && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }

                // Passing date through Date applies Date.parse, if necessary
                date = date ? new Date(date) : new Date();
                if (isNaN(date)) throw SyntaxError('invalid date');

                mask = String(dF.masks[mask] || mask || dF.masks.default);

                // Allow setting the utc argument via the mask
                if (mask.slice(0, 4) == 'UTC:') {
                    mask = mask.slice(4);
                    utc = true;
                }

                var _ = utc ? 'getUTC' : 'get',
                    d = date[_ + 'Date'](),
                    D = date[_ + 'Day'](),
                    m = date[_ + 'Month'](),
                    y = date[_ + 'FullYear'](),
                    H = date[_ + 'Hours'](),
                    M = date[_ + 'Minutes'](),
                    s = date[_ + 'Seconds'](),
                    L = date[_ + 'Milliseconds'](),
                    o = utc ? 0 : date.getTimezoneOffset(),
                    flags = {
                    d: d,
                    dd: pad(d),
                    ddd: dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? 'a' : 'p',
                    tt: H < 12 ? 'am' : 'pm',
                    T: H < 12 ? 'A' : 'P',
                    TT: H < 12 ? 'AM' : 'PM',
                    Z: utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                    o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

                return mask.replace(token, function ($0) {
                    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                });
            };
        }();

        // Some common format strings
        dateFormat.masks = {
            'default': 'ddd mmm dd yyyy HH:MM:ss',
            shortDate: 'm/d/yy',
            mediumDate: 'mmm d, yyyy',
            longDate: 'mmmm d, yyyy',
            fullDate: 'dddd, mmmm d, yyyy',
            shortTime: 'h:MM TT',
            mediumTime: 'h:MM:ss TT',
            longTime: 'h:MM:ss TT Z',
            isoDate: 'yyyy-mm-dd',
            isoTime: 'HH:MM:ss',
            isoDateTime: 'yyyy-mm-dd\'T\'HH:MM:ss',
            isoUtcDateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\''
        };

        // Internationalization strings
        dateFormat.i18n = {
            dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        };
        return dateFormat(dateVal, format);
    },
    /**
     * returns label formatter function
     * @param formatter
     * ex) '${value}' or '{0,0.000}'...
     * @returns {Function}
     */
    formatLabel: function formatLabel(formatter) {
        return function (value, index) {
            if ((Number(value) === 0 || Boolean(Number(value))) && numberFmtRgx.test(formatter)) {
                var resultFmt = numberFmtRgx.exec(formatter) || numberFmtRgx.exec(formatter);
                return formatter.replace(numberFmtRgx, value != null ? numeral(value).format(resultFmt[1] || resultFmt[2]) : '');
            } else {
                return formatter.replace('{value}', value != null ? value : '');
            }
        };
    }
};

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerChartWrapper = registerChartWrapper;
exports.getChartWrapper = getChartWrapper;
exports.createChartWrapper = createChartWrapper;

var _bchartIndex = __webpack_require__(44);

var Charts = _interopRequireWildcard(_bchartIndex);

var _wrapperIndex = __webpack_require__(238);

var Wrapper = _interopRequireWildcard(_wrapperIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Created by sds on 2018-03-20.
 */
var chartWrapper = {};

//private
function _init() {
    var chartTypeList = Object.keys(Charts);
    chartTypeList.forEach(function (chartType) {
        chartWrapper[Charts[chartType].Attr.Key] = Wrapper[chartType];
    });
}

exports.default = chartWrapper;
function registerChartWrapper(option) {
    if ($.isEmptyObject(chartWrapper)) {
        _init();
        console.log('chart wrapper register is empty');
    }
    chartWrapper[option.Key] = option.Func;
}

function getChartWrapper(chartType) {
    if ($.isEmptyObject(chartWrapper)) {
        _init();
    }
    return chartWrapper[chartType];
}

function createChartWrapper(chartType, parentId, options) {
    if ($.isEmptyObject(chartWrapper)) {
        _init();
    }
    if (!chartWrapper[chartType] || !parentId || !options) {
        throw new Error('Cannot create chart wrapper. ' + chartType);
    }
    return new chartWrapper[chartType](parentId, options);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipDecorator(builder) {
    _decorator2.default.call(this, builder);
}

TooltipDecorator.prototype = Object.create(_decorator2.default.prototype);
TooltipDecorator.prototype.constructor = TooltipDecorator;

TooltipDecorator.prototype.decorate = function () {
    if (this.eOptions.tooltip.formatter) {
        var _builder = $.extend(true, {}, this.builder);
        this.eOptions.tooltip.formatter = this.eOptions.tooltip.formatter.bind(_builder);
    } else if (this.eOptions.tooltip.trigger == 'item') {
        this._buildItemTooltip();
    } else if (this.eOptions.tooltip.trigger == 'axis') {
        this._buildAxisTooltip();
    }
};

TooltipDecorator.prototype._buildItemTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var dataColumns = builder.getTooltipDataColumns();
    _this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var series = builder.series;
        var seriesIndex = params.seriesIndex;
        var toolItems = [];

        if (params.seriesName) {
            toolItems = toolItems.concat(_this._getItemKeyTooltip(params, keyColumns));
        }
        if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
            toolItems.push(params.name + ' : ' + params.value);
        } else if (_this._hasTooltipHeaders(series[seriesIndex])) {
            var tooltipHeaders = series[seriesIndex].tooltipHeaders;
            for (var i = 0; i < tooltipHeaders.length; i++) {
                toolItems.push(tooltipHeaders[i] + ' : ' + params.value[i]);
            }
        } else {
            toolItems.push(_this._getItemXTooltip(params, dataColumns));
            toolItems.push(_this._getItemYTooltip(params, dataColumns));
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipDecorator.prototype._getItemKeyTooltip = function (params, keyColumns) {
    var keyItems = [];
    var extractor = this.builder._internalOptions().series[params.seriesIndex].extractor;
    for (var k = 0; k < keyColumns.length; k++) {
        keyItems.push(keyColumns[k].name + ' : ' + extractor.keys[k]);
    }
    return keyItems;
};

TooltipDecorator.prototype._getItemXTooltip = function (params, dataColumns) {
    var builder = this.builder;

    var value = params.value[0];
    if (builder._internalOptions().xAxis[0].type === 'value' || builder._internalOptions().xAxis[0].type === 'time') {
        if (builder._internalOptions().xAxis[0].type === 'time') value = _optionUtils2.default.dateFormatString(value, 'yyyy-mm-dd HH:MM:ss');
        if (builder._internalOptions().xAxis[0].data) {
            return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + builder._internalOptions().xAxis[0].data[value - 1];
        } else {
            return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + value;
        }
    } else {
        return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + value;
    }
};

TooltipDecorator.prototype._getItemYTooltip = function (params, dataColumns) {
    return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + params.value[1];
};

TooltipDecorator.prototype._buildAxisTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var dataColumns = builder.getTooltipDataColumns();
    var seriesIndex;
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];
        if (Array.isArray(params)) {
            var series = builder.series;
            for (var p in params) {
                if (builder._internalOptions().series[params[p].seriesIndex].virtualSeries) continue;

                var axisNameTooltip = _this._getAxisNameTooltip(params[p], dataColumns);
                if (!axisNameTooltip) continue;
                toolItems.push(axisNameTooltip);

                var division = function division(text) {
                    return '<div title="' + text + '">' + text + '</div>';
                };
                if (params[p].seriesName || params[p].seriesType === 'line') {
                    division = function division(text) {
                        return '<div title="' + text + '" style="color: ' + params[p].color + ';" series-name:"' + params[p].seriesName + '">' + text + '</div>';
                    };
                    toolItems = toolItems.concat(_this._getAxisKeyTooltip(params[p], division, keyColumns));
                }
                seriesIndex = params[p].seriesIndex;
                if (_this._hasTooltipHeaders(series[seriesIndex])) {
                    toolItems.push(division(series[seriesIndex].tooltipHeaders[1] + ':' + params[p].value[1]));
                } else {
                    // Y 컬럼
                    toolItems.push(division(_this._getAxisValueTooltip(params[p], dataColumns)));
                }
            }
        } else {
            if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
                toolItems.push(params.name + ' : ' + params.value);
            }
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('');
    };
};

TooltipDecorator.prototype._getAxisNameTooltip = function (param, dataColumns) {
    var builder = this.builder;
    var name = param.value[0];

    if (builder._internalOptions().xAxis[0].type === 'value' || builder._internalOptions().xAxis[0].type === 'time') {
        if (typeof param.value === 'undefined') return;
        if (builder._internalOptions().xAxis[0].type === 'time') name = _optionUtils2.default.dateFormatString(name, 'yyyy-mm-dd HH:MM:ss');
        return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + name;
    } else {
        return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + name;
    }
};

TooltipDecorator.prototype._getAxisKeyTooltip = function (param, division, keyColumns) {
    var builder = this.builder;
    var keyItems = [];
    if (builder._internalOptions().series[param.seriesIndex]) {
        var extractor = builder._internalOptions().series[param.seriesIndex].extractor;
        if (extractor) {
            for (var k = 0; k < keyColumns.length; k++) {
                keyItems.push(division(keyColumns[k].name + ' : ' + extractor.keys[k]));
            }
        }
    } else {
        keyItems.push(division(param.seriesName));
    }

    return keyItems;
};

TooltipDecorator.prototype._hasTooltipHeaders = function (series) {
    return series && series.tooltipHeaders;
};

TooltipDecorator.prototype._getAxisValueTooltip = function (param, dataColumns) {
    return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + param.value[1];
};

exports.default = TooltipDecorator;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: default-options.js
 * Created by ng1123.kim on 2017-05-22.
 */
exports.default = {
    ColorSet: ['#FD026C', '#4682B8', '#A5D22D', '#F5CC0A', '#FE8C01', '#6B9494', '#B97C46', '#84ACD0', '#C2E173', '#F9DD5B', '#FE569D', '#FEB356', '#9CB8B8', '#D0A884', '#2E6072', '#6D8C1E', '#A48806', '#A90148', '#A95E01', '#476363', '#7B532F'],
    VisualMapColorSet: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
    Grid: {
        left: '10%',
        right: '10%',
        top: '60px',
        bottom: '60px',
        width: 'auto',
        height: 'auto'
    },
    AxisLabel: {
        show: true,
        rotate: 0,
        textStyle: {
            color: '#000000',
            fontSize: 12,
            fontFamily: ''
        }
    },
    Title: {
        show: true,
        text: '',
        subtext: '',
        rotate: 0,
        textStyle: {
            color: '#000000',
            fontSize: 12,
            fontFamily: ''
        },
        subtextStyle: {
            color: '#000000',
            fontSize: 12,
            fontFamily: ''
        }
    },
    Legend: {
        show: true,
        orientation: 'horizontal',
        left: '50%',
        right: 'auto',
        top: '10px',
        bottom: 'auto',
        textStyle: {
            color: '#000000',
            fontSize: 12,
            fontFamily: '',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontDecoration: 'none'
        }
    },
    VisualMap: {
        show: true,
        left: 0,
        right: 'auto',
        top: '10px',
        bottom: 'auto',
        colorSet: ["#313695", "#a50026"], //min, max
        textStyle: {
            color: '#000000',
            fontSize: 12,
            fontFamily: '',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontDecoration: 'none'
        }
    },
    Marker: {
        symbolSize: 1,
        itemStyle: {
            normal: {
                opacity: 1
            }
        }
    },
    MarkLine: {
        lineStyle: {
            normal: {
                color: '#000000',
                type: 'solid',
                width: 1
            }
        },
        data: [{}]
    },
    StripLine: {
        lineStyle: {
            normal: {
                color: '#000000',
                type: 'solid',
                width: 1
            }
        },
        data: [{}]
    },
    TrendLine: {
        lineStyle: {
            normal: {
                color: '#000000',
                type: 'solid',
                width: 1
            }
        },
        data: [{}]
    },
    extend: function extend(options) {
        return $.extend(true, {}, {
            colorSet: this.ColorSet,
            title: $.extend(true, {}, this.Title, { left: '50%', top: '0px' }),
            toolbar: {
                show: false,
                right: '8px',
                top: '8px',
                orientation: 'horizontal',
                //todo: 2017 pvr zoom 라이브러리 버그(filter mode)로 인한 줌기능 제거
                menu: {
                    // zoom: {}
                }
            },
            chart: {
                border: '1px #000000 none',
                background: 'rgba(255, 255, 255,1)',
                animationDuration: 1000
            },
            tooltip: {
                triggerOn: 'mousemove' //'click'
            },
            grid: this.Grid,
            xAxis: [{
                selected: [],
                title: $.extend(true, {}, this.Title, { left: '50%', bottom: '5px' }),
                axisTick: { show: true },
                axisLine: {
                    onZero: false
                },
                scale: true,
                axisLabel: this.AxisLabel,
                zlevel: 1
            }],
            yAxis: [{
                selected: [],
                title: $.extend(true, {}, this.Title, { left: '8px', top: '50%', rotate: -90 }),
                axisTick: { show: true },
                axisLine: {
                    onZero: false
                },
                scale: true,
                axisLabel: this.AxisLabel,
                zlevel: 1
            }],
            colorBy: [{
                selected: []
            }],
            legend: this.Legend,
            noDataMessage: ''
        }, options);
    }
};

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _columnHelper2 = __webpack_require__(66);

var _columnHelper3 = _interopRequireDefault(_columnHelper2);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _problemLibrary = __webpack_require__(45);

var _problemLibrary2 = _interopRequireDefault(_problemLibrary);

var _problem = __webpack_require__(203);

var _problem2 = _interopRequireDefault(_problem);

var _warning = __webpack_require__(204);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */
function ChartValidatorBase(options) {
    this.options = options;
    this.problemList = [];
    this.warningList = [];
    this._isValidDataSource = false;
    this._columnList = [];
    this.setColumnHelper(this.options);
}

ChartValidatorBase.prototype.validate = function () {
    this.validateDataSource();

    this.configureAxis();
    this.validateAxis();

    this._validateAxisViewRange();
    this._validateAxisFramePadding();
    this.validateStripLineType();
    this.validateScale();
    this._validateImplement();
};

ChartValidatorBase.prototype.setColumnHelper = function (helperOption) {
    var _columnHelper = new _columnHelper3.default({
        type: helperOption.chart.type,
        columnConf: helperOption.columnConf
    });
    this._columnConf = _columnHelper.getColumnConf();
};

ChartValidatorBase.prototype.validateDataSource = function () {
    var _this = this;
    this._validateDataSourceIsExist(this.options.source);
    if (this._isValidDataSource) {
        if (this.options.source.dataType !== 'lazy') {
            this.getDataSrcOptions().forEach(function (dataSrcOpt, dsIdx) {
                _this._validateData(dataSrcOpt.label, _this.options.source.localData, dsIdx);
            });
        } else {
            this.getDataSrcOptions().forEach(function (dataSrcOpt, dsIdx) {
                _this._validateData(dataSrcOpt.label, _this.options.source.lazyData, dsIdx);
            });
        }
    }
};

//@implement
ChartValidatorBase.prototype.getDataSrcOptions = function () {
    return [{
        label: 'Data Source'
    }];
};

//@implement
ChartValidatorBase.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }, {
        key: 'colorBy'
    }];
};

ChartValidatorBase.prototype._getAxisColumnConf = function (columnSpec) {
    if (typeof columnSpec.chartIdx != 'undefined') {
        var chartType = this.options.complex[columnSpec.chartIdx].chart.type;
        return this._columnConf[columnSpec.key][chartType];
    } else {
        return this._columnConf[columnSpec.key];
    }
};

/**
 * configure: configure logic에 따라 option에 default값을 강제로 세팅함.
 * - setting available aggregation or unset aggregation
 * - slice columns when it is not allowed multiple
 */
ChartValidatorBase.prototype.configureAxis = function () {
    var _this = this;
    var chartType = this.options.chart.type;
    var funcList, valueRef, dataSetIdx, columnConf;

    var columnList = this.getAxisOptions();
    if (!columnList || columnList.length < 1) {
        return;
    }
    columnList.forEach(function (colSpec) {
        funcList = [];
        dataSetIdx = colSpec.dataSetIndex || 0;
        columnConf = _this._getAxisColumnConf(colSpec);
        if (columnConf) {
            if (colSpec.value) {
                //biplot, complex
                valueRef = colSpec.value;
            } else {
                if (typeof _this.options[colSpec.key] !== 'undefined') {
                    valueRef = _this.options[colSpec.key];
                } else {
                    valueRef = _chartUtils2.default.getPlotOptions(_this.options, chartType)[colSpec.key];
                }

                if (dataSetIdx == 0 && _this.getDataSrcOptions().length == 1) {
                    valueRef.splice(1, 1);
                    valueRef = valueRef[0];
                } else {
                    valueRef = valueRef[dataSetIdx];
                }
            }

            if (!columnConf.multiple) {
                valueRef.selected = valueRef.selected.slice(0, 1);
            }

            valueRef.selected.forEach(function (axisSelectedObj) {
                if (columnConf.aggregationEnabled) {
                    _this._setValidAggr(columnConf, axisSelectedObj, dataSetIdx);
                } else {
                    _this._unsetAggr(axisSelectedObj);
                }
            });
        }
    });
};

ChartValidatorBase.prototype._setValidAggr = function (columnConf, selectedColumn, dataSetIndex) {
    if (selectedColumn) {
        var columnType = this._getColumnTypeByName(selectedColumn.name, dataSetIndex);
        if (columnConf.aggregationMap[columnType]) {
            var aggrMapVal = columnConf.aggregationMap[columnType].map(function (elem) {
                return elem.value;
            });
            if ($.inArray(selectedColumn.aggregation, aggrMapVal) == -1) {
                selectedColumn.aggregation = columnConf.aggregationMap[columnType][0].value;
            }
        }
    }
};

ChartValidatorBase.prototype._unsetAggr = function (selectedColumn) {
    if (selectedColumn && selectedColumn.aggregation) {
        selectedColumn.aggregation = 'none';
    }
};

/**
 * validator: validation logic 조건에 맞지 않는경우 chart 그리지않음. 에러발생
 * _validateAxisExists
 *   - 선택된 칼럼이 있는지 체크.
 *   - 필수선택 칼럼일 경우 체크필요.(ex. scatter의 경우 x축, y축이 해당)
 *   - multiple의 경우 _validateEachAxisExists
 * _validateColumnExistsInColumnList
 *   - 선택한 칼럼이 column list에 존재하는지 체크
 *   - multiple의 경우 _validateEachColumnExistsInColumnList
 * _validateSelectableType
 *   - 선택한 칼럼이 선택가능한 타입(string, number, ...)인지 체크
 *   - multiple의 경우 _validateEachColumnSelectableType
 */

ChartValidatorBase.prototype.validateAxis = function () {
    var _this = this;
    var chartType = this.options.chart.type;
    var funcList, valueRef, dataSetIdx, columnConf;

    var columnList = this.getAxisOptions();
    if (!columnList || columnList.length < 1) {
        return;
    }
    columnList.forEach(function (colSpec) {
        funcList = [];
        dataSetIdx = colSpec.dataSetIndex || 0;
        columnConf = _this._getAxisColumnConf(colSpec);
        if (columnConf) {
            if (colSpec.value) {
                //biplot, complex
                valueRef = colSpec.value;
            } else if (typeof _this.options[colSpec.key] !== 'undefined') {
                valueRef = _this.options[colSpec.key][dataSetIdx];
            } else {
                valueRef = _chartUtils2.default.getPlotOptions(_this.options, chartType)[colSpec.key][dataSetIdx];
            }

            var isRequired = columnConf.mandatory;
            if (columnConf.multiple) {
                if (isRequired) {
                    funcList.push(_this._validateEachAxisExists);
                }
                funcList = funcList.concat([_this._validateEachColumnExistsInColumnList, _this._validateEachColumnSelectableType]);
                valueRef = valueRef.selected ? valueRef.selected : valueRef;
            } else {
                var isSchema = columnConf.axisTypeList && valueRef.axisType;
                if (isRequired) {
                    funcList.push(_this._validateAxisExists);
                }
                funcList = funcList.concat([_this._validateColumnExistsInColumnList, _this._validateSelectableType]);
                valueRef = isSchema ? valueRef.axisType : valueRef.selected[0];
            }
            _this.validateInOrder(funcList, {
                key: colSpec.key,
                value: valueRef,
                chartIdx: colSpec.chartIdx, //complex chart
                dataSetIndex: dataSetIdx //biplot chart
            });
        }
    });
};

/**
 * funcList에 있는 validation function을 순차적으로 실행하며, fail의 경우 이후 validation수행하지 않음.
 * @param validateFuncList ( [this._validateAxisExists, this._validateColumnExistsInColumnList])
 * @param validateOpts = {}
 */
ChartValidatorBase.prototype.validateInOrder = function (validateFuncList, validateOpts) {
    if (!$.isArray(validateFuncList)) {
        return;
    }
    for (var funcIdx = 0; funcIdx < validateFuncList.length; funcIdx++) {
        if (validateFuncList[funcIdx].call(this, validateOpts) === false) {
            break;
        }
    }
};

ChartValidatorBase.prototype._validateAxisViewRange = function () {
    this._validateLessValue('X Axis', {
        value1: this.options.xAxis[0].min,
        value2: this.options.xAxis[0].max
    }, ['X Axis View Range', 'Min', 'Max']);
    this._validateLessValue('Y Axis', {
        value1: this.options.yAxis[0].min,
        value2: this.options.yAxis[0].max
    }, ['Y Axis View Range', 'Min', 'Max']);
};

ChartValidatorBase.prototype._validateAxisFramePadding = function () {
    var position = ['left', 'top', 'right', 'bottom'];

    var _this = this;
    position.forEach(function (positionStr) {
        var checkVal = _this.options.grid[positionStr] + '';
        if (checkVal && checkVal.indexOf('%') >= 0) {
            _this._validateLessEqualValue(positionStr, {
                value1: Number(_this.options.grid[positionStr].replace('%', '')),
                value2: 100
            }, ['Chart Position', positionStr, '100%']);
            _this._validateGreaterEqualValue(positionStr, {
                value1: Number(_this.options.grid[positionStr].replace('%', '')),
                value2: 0
            }, ['Chart Position', positionStr, '0%']);
        }
    });
};

ChartValidatorBase.prototype._validateDataSourceIsExist = function (dataSource) {
    if (ChartValidatorBase.isEmpty(dataSource)) {
        this._createProblem('datasource-001');
    } else {
        this._isValidDataSource = true;
    }
};

ChartValidatorBase.prototype._validateData = function (target, dataSetList, dataIndex) {
    var noDataMsgId, noColumnMsgId;
    if (dataSetList && dataSetList.length > 1) {
        noDataMsgId = 'datasource-002-01';
        noColumnMsgId = 'datasource-003-01';
    } else {
        noDataMsgId = 'datasource-002';
        noColumnMsgId = 'datasource-003';
    }
    var dataSet = dataSetList[dataIndex];
    var targetObj = { target: target };
    if (ChartValidatorBase.isEmpty(dataSet)) {
        this._createProblem(noDataMsgId, [target], targetObj);
    } else if (dataSet.id && dataSet.id.value === '') {
        this._createProblem(noDataMsgId, [target], targetObj);
        this._isValidDataSource = false;
    } else if (ChartValidatorBase.isEmpty(dataSet.columns)) {
        this._createProblem(noColumnMsgId, [target], targetObj);
    } else if (typeof dataSet.columns === 'function') {
        var columns = dataSet.columns();
        if (typeof columns === 'undefined' || columns.length === 0) {
            this._createProblem(noColumnMsgId, [target], targetObj);
        } else {
            this._columnList[dataIndex] = columns;
        }
    } else if (dataSet.columns.length === 0) {
        this._createProblem(noColumnMsgId, [target], targetObj);
    } else {
        this._columnList[dataIndex] = dataSet.columns;
    }

    if (!this._columnList[dataIndex]) {
        this._columnList[dataIndex] = [];
    }
};

ChartValidatorBase.prototype._validateAxisExists = function (options) {
    if (ChartValidatorBase.isEmpty(options.value)) {
        this._createProblem('axis-001', [this._getAxisColumnConf(options).label], {
            target: this._getAxisColumnConf(options).label
        });
        return false;
    }
};

ChartValidatorBase.prototype.validateStripLineType = function (dataIdx) {
    if (!this._isValueType(this.options.xAxis[0], dataIdx)) {
        this._createWarning('axis-001', ['X-axis'], {
            target: 'xAxis'
        });
    }
};

ChartValidatorBase.prototype.validateScale = function (dataIdx) {
    if (!this._isValueType(this.options.xAxis[0], dataIdx)) {
        this._createWarning('axis-002', ['X-axis'], {
            target: 'xaxis'
        });
    }
};

ChartValidatorBase.prototype._isValueType = function (axis, idx) {
    var dataIdx = typeof idx != 'undefined' ? idx : 0;
    if (axis.axisType) {
        return false;
    } else {
        var xAxisCol = this._columnList[dataIdx].find(function (columnObj) {
            return axis.selected[0] && columnObj.name == axis.selected[0].name;
        });
        return _optionUtils2.default.getAxisType(xAxisCol) == 'value';
    }
};

ChartValidatorBase.prototype._validateColumnExistsInColumnList = function (options, targetIndex) {
    var refValue = options.value;
    var dataSetIndex = ChartValidatorBase.isEmpty(options.dataSetIndex) ? 0 : options.dataSetIndex;
    if (!$.isEmptyObject(refValue)) {
        var existedCol;
        if (typeof refValue === 'string') {
            existedCol = $.inArray(refValue, this._getAxisColumnConf(options).axisTypeList) > -1;
        } else {
            var refValueLabel = refValue.name || refValue.column;
            if (!refValueLabel) {
                return;
            }
            existedCol = this._columnList[dataSetIndex].some(function (column) {
                return column.name === refValueLabel;
            });
        }
        if (!existedCol) {
            var targetObj = { target: this._getAxisColumnConf(options).label, index: targetIndex };
            this._createProblem('axis-004', [this._getAxisColumnConf(options).label, refValueLabel], targetObj);
            return false;
        }
    }
};

/**
 * 1) chart 별 ColumnConf에 columnType이 정의되어 있는 경우: 선택한 칼럼이 ColumnConf columnType에 해당하는지 체크(ex. boxplot의 yAxis)
 * 2) 정의되어있지 않는 경우: ValidatorConst.selectableColumnType 에 정의되어있는 타입인지 체크
 * @param options
 * @param targetIndex
 * @returns {boolean}
 * @private
 */
ChartValidatorBase.prototype._validateSelectableType = function (options, targetIndex) {
    if ($.isEmptyObject(options.value)) {
        return;
    }
    var dataSetIndex = ChartValidatorBase.isEmpty(options.dataSetIndex) ? 0 : options.dataSetIndex;
    var typeOfSelectedColumn = this._getColumnTypeByName(options.value.name, dataSetIndex);
    if (!ChartValidatorBase.isEmpty(typeOfSelectedColumn)) {
        var columnConfTypeList = this._getAxisColumnConf(options).columnType || _problemLibrary2.default.selectableColumnType;
        if ($.inArray(typeOfSelectedColumn, columnConfTypeList) < 0) {
            this._createProblem('axis-005', [this._getAxisColumnConf(options).label, columnConfTypeList], { target: this._getAxisColumnConf(options).label, index: targetIndex });
            return false;
        }
    }
};

ChartValidatorBase.prototype._validateEachColumn = function (execFunc, options) {
    if (!$.isArray(options.value)) {
        console.warn(options.label + ' is not array type.');
        return;
    }
    if (options.value.length === 0) {
        return execFunc.call(this, options, 0);
    } else {
        var singleColumnOpts = $.extend(true, {}, options);
        var result = true;
        for (var i = 0; i < options.value.length; i++) {
            singleColumnOpts.value = options.value[i];
            if (execFunc.call(this, singleColumnOpts, i) === false) {
                result = false;
                // return false;
            }
        }
        return result;
    }
};

ChartValidatorBase.prototype._validateEachAxisExists = function (options) {
    if (!$.isArray(options.value)) {
        console.warn(options.label + ' is not array type.');
        return;
    }
    var isValid = options.value.some(function (value) {
        return value && value.name;
    });
    if (options.value.length === 0 || !isValid) {
        this._createProblem('axis-001', [this._getAxisColumnConf(options).label], {
            target: this._getAxisColumnConf(options).label
        });
        return false;
    }
};

ChartValidatorBase.prototype._validateEachColumnExistsInColumnList = function (options) {
    this._validateEachColumn(this._validateColumnExistsInColumnList, options);
};

ChartValidatorBase.prototype._validateEachColumnSelectableType = function (options) {
    this._validateEachColumn(this._validateSelectableType, options);
};

ChartValidatorBase.prototype._validateNumberType = function (refValue) {
    if (typeof refValue.value1 === 'number' && typeof refValue.value2 === 'number') {
        return true;
    } else if (!ChartValidatorBase.isEmpty(refValue.value1) && !ChartValidatorBase.isEmpty(refValue.value2)) {
        console.warn('Comparing values are not both number.');
        return false;
    }
};

//refValue1 must be smaller than refValue2
ChartValidatorBase.prototype._validateLessValue = function (targetLabel, refValue, msgParam) {
    if (this._validateNumberType(refValue) && refValue.value1 >= refValue.value2) {
        this._createProblem('value-001', msgParam, { target: targetLabel });
    }
};

//refValue1 must be greater than refValue2
ChartValidatorBase.prototype._validateGreaterValue = function (targetLabel, refValue, msgParam) {
    if (this._validateNumberType(refValue) && refValue.value1 <= refValue.value2) {
        this._createProblem('value-002', msgParam, { target: targetLabel });
    }
};

//refValue1 must be smaller than or equal to refValue2
ChartValidatorBase.prototype._validateLessEqualValue = function (targetLabel, refValue, msgParam) {
    if (this._validateNumberType(refValue) && refValue.value1 > refValue.value2) {
        this._createProblem('value-003', msgParam, { target: targetLabel });
    }
};

//refValue1 must be greater than equal to refValue2
ChartValidatorBase.prototype._validateGreaterEqualValue = function (targetLabel, refValue, msgParam) {
    if (this._validateNumberType(refValue) && refValue.value1 < refValue.value2) {
        this._createProblem('value-004', msgParam, { target: targetLabel });
    }
};

//chart validator util
ChartValidatorBase.isEmpty = function (target) {
    if (target === null || typeof target === 'undefined') {
        return true;
    } else {
        return false;
    }
};

ChartValidatorBase.prototype._getColumnTypeByName = function (colName, dataSetIndex) {
    var columnList = this._columnList[dataSetIndex] || [];
    if (!$.isArray(columnList)) {
        return;
    }

    var foundCol = columnList.find(function (columnList) {
        return columnList.name === colName;
    });
    if (foundCol) {
        return foundCol.type;
    } else {
        return undefined;
    }
};

ChartValidatorBase.prototype._validateImplement = function () {};

ChartValidatorBase.prototype._createProblem = function (key, param, target) {
    this.problemList.push(new _problem2.default(key, param, target));
};

ChartValidatorBase.prototype._createWarning = function (key, param, target) {
    this.warningList.push(new _warning2.default(key, param, target));
};

exports.default = ChartValidatorBase;

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _chartOptionBuilder = __webpack_require__(34);

var _chartOptionBuilder2 = _interopRequireDefault(_chartOptionBuilder);

var _decoratorRegister = __webpack_require__(74);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsOptionBuilder() {
    _chartOptionBuilder2.default.call(this);
}

EChartsOptionBuilder.prototype = Object.create(_chartOptionBuilder2.default.prototype);
EChartsOptionBuilder.prototype.constructor = EChartsOptionBuilder;

EChartsOptionBuilder.prototype.buildOptions = function (options) {
    this.bOptions = options;
    this.plotOptions = this.getPlotOptions();
    this.eOptions = this._defaultOptions();
    this._setUpOptions();
    this._buildSeries();
    this._decorate();
    this._configureChartOptions();
    this._setSeriesLargeThreshold();
    return this.eOptions;
};

EChartsOptionBuilder.prototype._defaultOptions = function () {
    var opt = {
        tooltip: {
            trigger: 'item',
            showDelay: 0
        },
        toolbox: {
            show: false
        },
        legend: {
            show: false
        },
        xAxis: [{
            type: 'value',
            scale: true,
            splitLine: { show: false },
            axisLine: { onZero: false }
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            splitLine: { show: false },
            axisLine: { onZero: false }
        }]
        // brush: {
        //     xAxisIndex: 0,
        //     yAxisIndex: 0
        // }
    };

    opt.color = this.bOptions.colorSet;
    opt.grid = this.bOptions.grid;
    $.extend(true, opt.tooltip, this.bOptions.tooltip, this.plotOptions.tooltip);
    $.extend(true, opt.xAxis, this.bOptions.xAxis);
    $.extend(true, opt.yAxis, this.bOptions.yAxis);
    // $.extend(true, opt.toolbox, this.bOptions.toolbox);

    return opt;
};

EChartsOptionBuilder.prototype._setUpOptions = function () {
    this.optionDecoratorKeys = [];
};

EChartsOptionBuilder.prototype._decorate = function () {
    for (var k in this._decoratorList) {
        if (!this._decoratorList[k]) continue;
        this._decoratorList[k].decorate(this.eOptions);
    }
};

EChartsOptionBuilder.prototype._configureChartOptions = function () {};

EChartsOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData(0);
    var keyIndexes = this.getSeriesKeyColumnIndexes(0);

    var i, row, seriesName, seriesItem;
    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes);
        seriesItem = this._getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = this._newSeriesExtractor();
            seriesItem.extractor.keys = this.getCellText(row, keyIndexes);
            seriesItem.keys = seriesItem.extractor.keys;
        }
        seriesItem.extractor.push(row, i);
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsOptionBuilder.prototype._registerDecorator = function (type, options) {
    this._decoratorList = this._decoratorList || [];
    this._decoratorList.push((0, _decoratorRegister.createDecorator)(type, this, options));
};

EChartsOptionBuilder.prototype.buildSeries = function () {};

EChartsOptionBuilder.prototype._getSeriesItem = function (series, name) {
    var seriesItem = series[name];
    if (!seriesItem) {
        seriesItem = this._newSeriesItem();
        seriesItem.name = name;
    }
    return seriesItem;
};

EChartsOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: this.bOptions.chart.type,
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    return seriesItem;
};

//todo : to decorator
EChartsOptionBuilder.prototype._applySeriesOptions = function (seriesItem, plotOptions, attributes) {
    var tmp = {};
    for (var i in attributes) {
        var attr = attributes[i];
        if (typeof plotOptions[attr] !== 'undefined') {
            tmp[attr] = plotOptions[attr];
        }
    }
    $.extend(true, seriesItem, tmp);
};

EChartsOptionBuilder.prototype._setSeries = function (series) {
    this.series = function () {
        var answer = [];
        for (var s in series) {
            answer.push(series[s]);
        }
        answer.sort(function (a, b) {
            if (typeof a.sortOrder === 'undefined' || a.sortOrder === b.sortOrder) {
                if (a.name == b.name) return 0;else if (a.name > b.name) return 1;else return -1;
            } else {
                if (a.sortOrder > b.sortOrder) return 1;else return -1;
            }
        });
        return answer;
    }();
};

EChartsOptionBuilder.prototype._buildSeriesData = function () {
    for (var s in this.series) {
        this.series[s].data = this.series[s].extractor.extract();
    }
};

//todo : to decorator
EChartsOptionBuilder.prototype._sortSeriesData = function () {
    var builder = this.builder;
    var dataColumns = builder.getSeriesDataColumns();
    var xAxisType = _optionUtils2.default.getAxisType(builder.filterNullColumn(this.bOptions.xAxis[0].selected));
    var yAxisType = _optionUtils2.default.getAxisType(builder.filterNullColumn(this.bOptions.yAxis[0].selected));

    var sortRule = function sortRule(a, b) {
        var xComp;
        if (xAxisType === 'category') xComp = _optionUtils2.default.stringSortRule(a[0], b[0]);else if (xAxisType === 'time') xComp = _optionUtils2.default.timeSortRule(a[0], b[0]);else xComp = _optionUtils2.default.numericSortRule(a[0], b[0]);

        if (xComp === 0) {
            var yComp;
            if (yAxisType === 'category') yComp = _optionUtils2.default.stringSortRule(a[1], b[1]);else if (yAxisType === 'time') yComp = _optionUtils2.default.timeSortRule(a[1], b[1]);else yComp = _optionUtils2.default.numericSortRule(a[1], b[1]);
            return yComp;
        } else {
            return xComp;
        }
    };

    for (var s in this.series) {
        this.series[s].data.sort(sortRule);
    }
    return this.series;
};

EChartsOptionBuilder.prototype._newSeriesExtractor = function () {};

EChartsOptionBuilder.prototype.hasLegendData = function () {

    var series,
        seriesMap = {};

    for (var i = 0; i < this.eOptions.series.length; i++) {
        series = this.eOptions.series[i];
        if (series.virtualSeries) continue;
        seriesMap[series.name] = true;
    }

    var keyColumns = this.getSeriesKeyColumns();
    if (keyColumns.length > 0) return true;else if (Object.keys(seriesMap).length > 1) return true;else false;
};

EChartsOptionBuilder.prototype._getColumnDataType = function (column) {
    var localData = this.getLocalData();
    var indexes = _optionUtils2.default.getColumnIndexes(column, localData.columns);
    return _optionUtils2.default.getAxisType(localData.columns[indexes[0]]);
};

EChartsOptionBuilder.prototype._setSeriesLargeThreshold = function () {
    var series;

    for (var i = 0; i < this.eOptions.series.length; i++) {
        series = this.eOptions.series[i];
        if (series.virtualSeries) continue;
        if (series.data && series.data.length > 5000) {
            series.largeThreshold = parseInt(series.data.length * 1.1);
        }
    }
};

exports.default = EChartsOptionBuilder;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsExtractor = __webpack_require__(29);

var _echartsExtractor2 = _interopRequireDefault(_echartsExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PointExtractor() {
    _echartsExtractor2.default.call(this);
    this._keyPointMap = {};
}

PointExtractor.prototype = Object.create(_echartsExtractor2.default.prototype);
PointExtractor.prototype.constructor = PointExtractor;

PointExtractor.prototype.push = function (row, rowIndex) {
    var pointer = this._getKeyPointer(row, rowIndex);
    var index = Number(rowIndex);
    var value;
    var point = [];
    var prePointList = [];
    var currentPointList = [];
    var indexes;

    for (var i = 0; i < this._columnIndices.length; i++) {
        indexes = this._columnIndices[i];
        prePointList = currentPointList.concat([]);
        currentPointList = [];
        for (var j = 0; j < indexes.length; j++) {
            value = this._getPointValue(row, indexes[j], index);
            if (this._typeList[i] === 'category') {
                this._setCategory(i, value);
            }
            if (prePointList.length === 0) {
                currentPointList.push([value]);
            } else {
                for (var k = 0; k < prePointList.length; k++) {
                    currentPointList.push(prePointList[k].concat([value]));
                }
            }
        }
    }

    pointer.point = pointer.point.concat(currentPointList);
    pointer.indexList.push(index);
};

PointExtractor.prototype._getPointValue = function (row, columnIndex, rowIndex) {
    return row[columnIndex];
};

PointExtractor.prototype._getKeyPointer = function (row, rowIndex) {
    var keys = this._getKeyList(row, rowIndex);

    var keyStr = keys.join('|');
    this._keyPointMap[keyStr] = this._keyPointMap[keyStr] || { value: keys, point: [], indexList: [] };

    return this._keyPointMap[keyStr];
};

PointExtractor.prototype._setCategory = function (targetId, value) {
    this._categoryMap[targetId] = this._categoryMap[targetId] || {};
    this._categoryMap[targetId][value] = true;
};

PointExtractor.prototype.getCategory = function (targetId) {
    return Object.keys(this._categoryMap[targetId]);
};

PointExtractor.prototype.getCategoryMap = function (targetId) {
    return this._categoryMap[targetId];
};

PointExtractor.prototype.setExtractOperator = function (extractOperator) {
    this._extractOperator = extractOperator;
};

PointExtractor.prototype._getKeyList = function (row, rowIndex) {
    if (!this._hasKey) return [rowIndex];
    var keys = [];
    for (var i = 0; i < this._keys.length; i++) {
        keys.push(row[this._keys[i]]);
    }
    return keys;
};

PointExtractor.prototype.extract = function (extractOperator) {
    if (typeof extractOperator === 'function') {
        return extractOperator(this._keyPointMap);
    } else {
        var answer = [];
        var pointObject;
        for (var i in this._keyPointMap) {
            pointObject = this._keyPointMap[i];
            answer = answer.concat(this._extract(pointObject));
        }
        return answer;
    }
};

PointExtractor.prototype._extract = function (pointObject) {
    if (this._extractOperator) {
        return this._extractOperator(pointObject);
    } else if (pointObject.point.length === 1) {
        return { value: pointObject.point[0], dataIndexes: pointObject.indexList };
    } else {
        return { value: pointObject.point, dataIndexes: pointObject.indexList };
    }
};

exports.default = PointExtractor;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _chartValidator = __webpack_require__(65);

var _chartValidator2 = _interopRequireDefault(_chartValidator);

var _chartComponent = __webpack_require__(32);

var _validationError = __webpack_require__(25);

var _validationError2 = _interopRequireDefault(_validationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//reload 1 : lazy data load & render chart. (ex.changed column or datasource...)
//reload 0 : render chart only. (ex.changed other chart options...)
//relaod -1 : render nothing. (ex.changed datasource label)
/**
 * Source: bchart-base.js
 * Created by daewon.park on 2017-03-23.
 */
var CONST_RELOAD_ALL = 1,
    CONST_RELOAD_CHART = 0,
    CONST_RELOAD_NOTHING = -1;
// var lazyLoadCompleted, currentJob;

// import * as ChartComponent from '../component/chart-component'
function BBaseCharts(parentId, options) {
    this.lazyLoadCompleted = false;
    this.currentJob = {};

    options = this._configureOptions(options);

    _widget2.default.call(this, parentId, options);
}

BBaseCharts.prototype = Object.create(_widget2.default.prototype);
BBaseCharts.prototype.constructor = BBaseCharts;

BBaseCharts.prototype.destroy = function () {
    this._destroyChart();
    this._destroyTitle();
    this._destroyAxisTitle();
    this._destroyToolbar();
};

BBaseCharts.prototype._configureOptions = function (options) {
    return options;
};

BBaseCharts.prototype._destroyChart = function () {
    if (this.chart) {
        this.chart.destroy();
        this.chart = null;
    }
};

BBaseCharts.prototype.bindEvent = function (eventName, callback) {
    this.$parent.bind(eventName, callback);
};

BBaseCharts.prototype.triggerEvent = function (eventName, params) {
    this.$parent.trigger(eventName, params);
};

BBaseCharts.prototype._createContents = function () {
    this._createChartComponent();
    this._createFrameComponent();
    this._bindRenderedCompleteCallback();

    this.render();
};

BBaseCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createAxisTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BBaseCharts.prototype._createChartComponent = function () {
    this._createChart();
    this._createLegend();
    this.bindEvent('bindingComplete', this._lazyRenderChart.bind(this));
};

BBaseCharts.prototype._bindRenderedCompleteCallback = function () {
    if (this.options.rendered) this.bindEvent('bindingComplete', this.options.rendered.bind(this.options));
};

BBaseCharts.prototype._lazyRenderChart = function () {
    try {
        if (this.chart) {
            this._showChart();
            this.chart.render();
            if (typeof this.chart.redrawLayout === 'function') {
                this.chart.redrawLayout();
            }
            if (this.legend) {
                this.legend.render(this.chart.getLegendData());
            }
        }
    } catch (ex) {
        if (ex instanceof _validationError2.default) {
            this._renderError(ex.message);
        } else {
            throw ex;
        }
    }
};

BBaseCharts.prototype._lazyRenderTitle = function () {
    if (this.title) {
        this.title.render(this.options.title.text, this.options.source.localData);
    }
};

BBaseCharts.prototype._createChart = function () {};

BBaseCharts.prototype._createLegend = function () {
    var _this = this;
    _this.options.legend.selected = function (name) {
        _this.chart.toggleLegend(name);
    };
    this.legend = new _chartComponent.Legend(this.$parent, function () {
        return _this.options.legend;
    });
};

BBaseCharts.prototype._createTitle = function () {
    // TODO options 를 callback 함수로 넘겨주는 이유는 setOptions 를 통해 this.options 를 변경할 때
    // TODO this.options 하위의 field 의 reference 가 유실된다. 이를 방지하기 위해 callback 함수를 이용 by daewon.park since 2017-05-24
    if ($.isEmptyObject(this.options.title)) {
        return;
    }

    var _this = this;
    this.title = new _chartComponent.Title(this.$parent, function () {
        return _this.options.title;
    });

    this.bindEvent('bindingComplete', this._lazyRenderTitle.bind(this));
};

BBaseCharts.prototype._destroyTitle = function () {
    if (this.title) {
        this.title.destroy();
        this.title = null;
    }
};

BBaseCharts.prototype._createAxisTitle = function () {
    var _this = this;
    this.xAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.xAxis[0].title;
    });
    this.yAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.yAxis[0].title;
    });
};

BBaseCharts.prototype._destroyAxisTitle = function () {
    if (this.xAxisTitle) {
        this.xAxisTitle.destroy();
        this.xAxisTitle = null;
    }
    if (this.yAxisTitle) {
        this.yAxisTitle.destroy();
        this.yAxisTitle = null;
    }
};

BBaseCharts.prototype._createToolbar = function () {
    var _this = this;
    if (!this.options.toolbar.show) {
        return;
    }

    this.toolbar = new _chartComponent.Toolbar(this.$parent, function () {
        _this.options.toolbar.selected = function (action) {
            if (action === 'toggle-brush-type' || action === 'toggle-brush-mode') {
                var opt = {
                    brushType: _this.toolbar.getSelectedBrushType(),
                    brushMode: _this.toolbar.getSelectedBrushMode()
                };
                _this.chart.setBrushType(opt);
            } else if (action === 'btn-clear-selection') {
                _this.chart.clearBrushArea();
            } else if (action === 'toggle-zoom-slider') {
                var zoom = _this.toolbar.getZoomMode();
                _this.$parent.attr('zoom', zoom);
                var zoomType = _this._getZoomType(); // ZoomType을 가져오도록 함.
                // _this.chart.setZoomMode(zoom);
                zoomType.zoom = zoom; // zoom : true||false
                _this.chart.setZoomMode(zoomType, _this._getZoomFilterMode());
            }
        };
        return _this.options.toolbar;
    });
};

BBaseCharts.prototype.setBrushType = function (opt) {
    this.chart.setBrushType(opt);
};

BBaseCharts.prototype.setBrushStyle = function (opt) {
    if (this.chart.setBrushStyle) {
        this.chart.setBrushStyle(opt);
    }
};

BBaseCharts.prototype._getZoomType = function () {
    return this.options.toolbar.menu.zoom;
};

BBaseCharts.prototype._getZoomFilterMode = function () {
    // default: filter
    return 'filter';
};

BBaseCharts.prototype._destroyToolbar = function () {
    if (this.toolbar) {
        this.toolbar.destroy();
        this.toolbar = null;
    }
};

BBaseCharts.prototype._createLoadingPanel = function () {
    this.$parent.append('<div class="bcharts-loading"><i class="fa fa-circle-o-notch fa-spin fa-5x fa-fw"></i></div>');
};

BBaseCharts.prototype._createErrorPanel = function () {
    this.$parent.append('' + '<div class="bcharts-error">' + '<div class="bcharts-error-text"></div>' + '</div>');

    if (this.options.guide) {
        var $guide = $('' + '<div class="bcharts-error-guide">' + '   <div class="bcharts-error-guide-message">' + this.options.guide.message + '</div>' + '   <div class="bcharts-error-guide-icon"></div>' + '</div>');

        this.$parent.find('.bcharts-error').append($guide);
    }
};

BBaseCharts.prototype.showLoading = function () {
    this.$parent.children('.bcharts-loading').show();
};

BBaseCharts.prototype.hideLoading = function () {
    this.$parent.children('.bcharts-loading').hide();
};

BBaseCharts.prototype._stopCurrentJob = function () {
    for (var i in this.currentJob) {
        if (typeof this.currentJob[i].aborted === 'function') {
            this.currentJob[i].aborted();
        }
        delete this.currentJob[i];
    }
};

BBaseCharts.prototype._lazyLoad = function (doneCallback, failCallback) {
    var _this = this;
    _this.chartInstanceId = _this.chartInstanceId || Date.now();
    _this.options.source.localData = [];
    _this._stopCurrentJob();
    _this._initFilter();

    for (var i = 0; i < _this.options.source.lazyData.length; i++) {
        if (typeof _this.options.source.lazyData[i].data === 'function') {
            var prepare = {
                chartInstanceId: _this.chartInstanceId + '-' + i,
                uid: Date.now(),
                filters: _this._selectedFilters,
                index: i,
                options: {
                    chart: $.extend(true, {}, _this.options.chart),
                    xAxis: $.extend(true, {}, _this.options.xAxis),
                    yAxis: $.extend(true, {}, _this.options.yAxis),
                    colorBy: $.extend(true, {}, _this.options.colorBy),
                    plotOptions: $.extend(true, {}, _this.options.plotOptions)
                },
                fail: function fail(err) {
                    if (failCallback) failCallback(err);
                    delete _this.currentJob[this.uid];
                },
                done: function done(result) {
                    _this.options.source.localData[this.index] = _this.options.source.localData[this.index] || {};

                    _this.options.source.localData[this.index].dataType = result.dataType;
                    _this.options.source.localData[this.index].chartColumns = result.columns;

                    _this.options.source.localData[this.index].count = result.count;
                    _this.options.source.localData[this.index].offset = result.offset;

                    _this.options.source.localData[this.index].columns = _optionUtils2.default.getColumnList(_this.options.source, this.index);

                    _this.options.source.localData[this.index].data = result.data;

                    if (result.data.length === 0) {
                        failCallback(_this.options.noDataMessage != '' ? [_this.options.noDataMessage] : ['No data to display']);
                    } else if (doneCallback) {
                        try {
                            doneCallback();
                        } catch (ex) {
                            failCallback(ex.message);
                            if (!(ex instanceof _validationError2.default)) {
                                var errObj = new Error('Failed to Load Chart');
                                errObj.stack += '\n' + ex.stack;
                                console.error(errObj); //TEMP
                                throw errObj;
                            }
                        }
                    }
                    delete _this.currentJob[this.uid];
                }
            };
            _this.currentJob[prepare.uid] = prepare;
            _this.options.source.lazyData[i].data(prepare);
        } else {
            throw new Error('Callback function for data loading is not defined.');
        }
    }
};

BBaseCharts.prototype._initFilter = function () {
    if (this.options.filter && !this._selectedFilters) {
        this._selectedFilters = this.options.filter;
    }
};

BBaseCharts.prototype._verifyOptions = function () {
    var validator = new _chartValidator2.default(this.options);
    this._reloadColumnConf(); //validation시 columnConf 봄.
    var problems = validator.doValidate();
    var messges = [];
    problems.forEach(function (problem) {
        messges.push(problem.message);
    });
    if (messges.length > 0) return messges;
};

BBaseCharts.prototype.render = function (reloadData) {
    if (reloadData > 0) {
        this.lazyLoadCompleted = false;
    } else if (reloadData < 0) {
        return;
    }
    this.hideLoading();

    var message = this._verifyOptions();
    if (message) {
        this._renderError(message);
    } else {
        this._renderFrame();
        this._hideErrorPanel();
        this._renderChart();
        // this._showChart();
    }
};

BBaseCharts.prototype._renderError = function (message) {
    this._stopCurrentJob();
    this._showErrorPanel(message);
    this._hideChart();
};

BBaseCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }
    if (this.xAxisTitle) {
        this.xAxisTitle.render(this.options.xAxis[0]);
    }
    if (this.yAxisTitle) {
        this.yAxisTitle.render(this.options.yAxis[0]);
    }
    if (this.toolbar) {
        this.toolbar.render();
        this._configureToolbar();
    }
};

BBaseCharts.prototype._showErrorPanel = function (error) {
    var cvtError = function () {
        if ($.isArray(error)) {
            return error.map(function (errObj) {
                return Brightics.Chart.Helper.ChartUtils.convertHTMLSpecialChar(errObj);
            }).join('<br>');
        } else {
            return Brightics.Chart.Helper.ChartUtils.convertHTMLSpecialChar(error);
        }
    }();
    this.$parent.find('.bcharts-error-text').html(cvtError);
    this.$parent.find('.bcharts-error').attr('title', $.isArray(error) ? error.join('\n') : error);
    this.$parent.find('.bcharts-error').show();
    this.$parent.attr('status', 'error');
};

BBaseCharts.prototype._hideErrorPanel = function () {
    this.$parent.find('.bcharts-error-text').text();
    this.$parent.find('.bcharts-error').hide();
    this.$parent.attr('status', '');
};

BBaseCharts.prototype._renderChart = function (reloadData) {
    var _this = this;

    try {
        _this.showLoading();
        if (_this.options.source.dataType === 'lazy' && _this.lazyLoadCompleted == false) {
            this._lazyLoad(function () {
                if (_this.options.source.lazyData.length == _this.options.source.localData.length) {
                    if (!_this.chart) return;
                    _this.chart.clear();
                    _this.triggerEvent('bindingComplete');
                    _this.hideLoading();
                    _this.lazyLoadCompleted = true;
                }
            }, function (err) {
                _this._showErrorPanel(err);
                _this._hideChart();
                _this.hideLoading();
                _this.triggerEvent('bindingError');
                _this.lazyLoadCompleted = false;
            });
        } else {
            _this.triggerEvent('bindingComplete');
            _this.hideLoading();
        }
    } catch (ex) {
        if (ex instanceof _validationError2.default) {
            _this.hideLoading();
            _this._renderError(ex.message);
        } else {
            var errObj = new Error('Failed to Load Chart');
            errObj.stack += '\n' + ex.stack;
            console.error(errObj); //TEMP
            throw errObj;
        }
    }
};

BBaseCharts.prototype._showChart = function () {
    if (this.chart) {
        this.chart.show();
    }
    if (this.legend) {
        this.legend.show();
    }
};

BBaseCharts.prototype._hideChart = function () {
    if (this.chart) {
        this.chart.hide();
    }
    if (this.legend) {
        this.legend.hide();
    }
};

BBaseCharts.prototype._isChanged = function (original, changing) {
    if (typeof changing === 'undefined') return false;
    return JSON.stringify(original) !== JSON.stringify(changing);
};

BBaseCharts.prototype._isSelectionChanged = function (original, changing) {
    var selectionChanged = this._isChanged(this._retrieveSelected(original), this._retrieveSelected(changing));
    var axisTypeChanged = this._isChanged(this._retrieveAxisType(original), this._retrieveAxisType(changing));
    return selectionChanged || axisTypeChanged;
};

/**
 * selected 정보만 추출
 * @param arr [ { selected: [ {name: 'Species', aggregation: 'count', type: 'string'} ], title: {} } ]
 * @private
 * @return [ { selected: [ {name: 'Species', aggregation: 'count'} ] } ]
 */
BBaseCharts.prototype._retrieveSelected = function (arr) {
    if (arr && $.isArray(arr)) {
        var answer = $.map(arr, function (element) {
            if (element) {
                return {
                    selected: $.map(element.selected, function (selection) {
                        if (selection) {
                            return {
                                name: selection.name,
                                aggregation: selection.aggregation
                            };
                        } else {
                            return selection;
                        }
                    })
                };
            }
        });
        return answer;
    } else {
        return arr;
    }
};

BBaseCharts.prototype._retrieveAxisType = function (arr) {
    if (arr && $.isArray(arr)) {
        var answer = $.map(arr, function (element) {
            if (element) {
                return element.axisType;
            }
        });
        return answer;
    } else {
        return arr;
    }
};

BBaseCharts.prototype._changeOptions = function (options) {
    $.extend(true, this.options, options);
    _chartUtils2.default.assignArray(this.options, options);
};

BBaseCharts.prototype.setOptions = function (options) {
    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    this._changeOptions(options);
    this.render(reload);
};

BBaseCharts.prototype.isReload = function (options) {
    var result = CONST_RELOAD_CHART;
    if (options.source) {
        result = CONST_RELOAD_ALL;
        if (options.source.dataType === 'local') {
            this.chart.clear();
            this.options.source = options.source;
        } else if (options.source.dataType === 'lazy' && !options.source.lazyData[0].data) {
            result = CONST_RELOAD_NOTHING;
        }
    } else if (this._selectedFilters) {
        result = CONST_RELOAD_ALL;
    }
    return result;
};

BBaseCharts.prototype.selectRange = function (args) {
    if (this.toolbar) {
        this.toolbar.unselectAllItems();
    }
    if (this.chart) {
        this.chart.selectRange(args);
    }
};

BBaseCharts.prototype.setFilter = function (filters) {
    if (this.chart && filters) {
        this._selectedFilters = filters;
        this.render(CONST_RELOAD_ALL);
    }
};

BBaseCharts.prototype.initFilter = function (filters) {
    if (this.chart) {
        this._selectedFilters = filters;
    }
};

BBaseCharts.prototype.getFilter = function () {
    return this._selectedFilters;
};

BBaseCharts.prototype.getSelectedRange = function () {
    if (this.chart) {
        return this.chart.getSelectedRange();
    }
};

BBaseCharts.prototype.getDataURL = function (options) {
    if (this.chart) {
        return this.chart.getDataURL(options);
    }
};

BBaseCharts.prototype._reloadColumnConf = function () {};

BBaseCharts.prototype._configureToolbar = function () {};
BBaseCharts.prototype.dispatchAction = function (action) {
    if (this.chart && this.chart.dispatchAction) {
        this.chart.dispatchAction(action);
    }
};
BBaseCharts.prototype.zoom = function (range) {
    if (this.chart && this.chart.zoom) {
        this.chart.zoom(range);
    }
};
BBaseCharts.prototype.resetZoom = function () {
    if (this.chart && this.chart.resetZoom) {
        this.chart.resetZoom();
    }
};
BBaseCharts.prototype.onCellPointClick = function (callback) {
    if (this.chart && this.chart.onCellPointClick) {
        this.chart.onCellPointClick(callback);
    }
};
BBaseCharts.prototype.offCellPointClick = function (callback) {
    if (this.chart && this.chart.offCellPointClick) {
        this.chart.offCellPointClick(callback);
    }
};
BBaseCharts.prototype.offCellPointClick = function (callback) {
    if (this.chart && this.chart.offCellPointClick) {
        this.chart.offCellPointClick(callback);
    }
};
BBaseCharts.prototype.onBrush = function (callback) {
    if (this.chart && this.chart.onBrush) {
        this.chart.onBrush(callback);
    }
};
BBaseCharts.prototype.offBrush = function (callback) {
    if (this.chart && this.chart.offBrush) {
        this.chart.offBrush(callback);
    }
};
BBaseCharts.prototype.onBrushSelected = function (callback) {
    if (this.chart && this.chart.onBrushSelected) {
        this.chart.onBrushSelected(callback);
    }
};
BBaseCharts.prototype.offBrushSelected = function (callback) {
    if (this.chart && this.chart.offBrushSelected) {
        this.chart.offBrushSelected(callback);
    }
};

exports.default = BBaseCharts;

/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsWrapper(parentId, options) {
    _widget2.default.call(this, parentId, options);
    this._triggerClearBrushSelected();
    this._echartOptionCache = null;
} /**
   * Source: echarts.wrapper.js
   * Created by daewon.park on 2017-03-23.
   */


EChartsWrapper.prototype = Object.create(_widget2.default.prototype);
EChartsWrapper.prototype.constructor = EChartsWrapper;

EChartsWrapper.prototype.parseComplex = function (isComplex) {
    this.isComplex = isComplex;
    return this;
};

EChartsWrapper.prototype.destroy = function () {
    if (this.echart) {
        $(window).off('resize', this.resizeHandler);

        if (this._brushSelected) {
            this._triggerClearBrushSelected();
        }

        this.echart.clear();
        this.echart.dispose();
        echarts.dispose(this.echart);
        echarts.dispose(this.$mainControl[0]);
        this.echart = null;
    }
};

EChartsWrapper.prototype._setEChartOption = function (opt) {
    this._initEchartOption = opt;
    if (opt.color && this.echart.getOption() && this.echart.getOption().color && opt.color.length !== this.echart.getOption().color.length) {
        this.echart.setOption(opt, true);
    } else {
        this.echart.setOption(opt);
    }
    this._echartOptionCache = null;
};

EChartsWrapper.prototype._getEChartOption = function (opt) {
    if (!this._echartOptionCache) {
        this._echartOptionCache = this.echart.getOption();
    }
    return this._echartOptionCache;
};

EChartsWrapper.prototype._extractSeriesSelection = function (batch, series, keyColumns) {
    var selected = [];
    if (keyColumns.length > 0) {
        for (var s in batch.selected) {
            var seriesIndex = batch.selected[s].seriesIndex;
            var selection = {};
            for (var k in keyColumns) {
                var seriesKey = keyColumns[k].name;
                var seriesValue = series[seriesIndex].keys[k];
                selection[seriesKey] = seriesValue;
            }
            selected.push(selection);
        }
    } else {
        selected.push({});
    }
    return selected;
};

EChartsWrapper.prototype._convertToSelection = function (axis, columnName, range) {
    if (axis.type === 'value' || axis.type === 'time') {
        return {
            min: range[0],
            max: range[1]
        };
    } else {
        return {
            min: axis.data[range[0]],
            max: axis.data[range[1]]
        };
    }
};

EChartsWrapper.prototype.createBrushSelectedHandler = function () {
    var _this = this;
    this.brushSelectedHandler = function (eventData) {
        if (_this.dataSelected) {
            _this._restoreItemStyles();
            _this.dataSelected = false;
        }
        _this._triggerPendingBrushSelected(eventData);
    };
};

EChartsWrapper.prototype._createSelectedRange = function (eventData) {
    var _this = this;
    var keyColumns = _this.seriesHelper.getSeriesKeyColumns();
    var selectedRangeList = [];
    for (var b in eventData.batch) {
        var batch = eventData.batch[b];
        batch.selected = batch.selected.filter(function (range) {
            return range.dataIndex.length > 0;
        });
        var cnt = batch.selected.length;
        if (cnt === 0) continue;

        var selectedSeries = _this._extractSeriesSelection(batch, this._getEChartOption().series, keyColumns);

        for (var a in batch.areas) {
            var selection = this._getSelectionFromArea(batch.areas[a]);

            var selectionArray = [];
            if (Array.isArray(selection)) {
                selection.forEach(function (selectionItem) {
                    selectedSeries.map(function (item) {
                        selectionArray.push($.extend(true, {}, item, selectionItem));
                    });
                });
            } else {
                selectedSeries.map(function (item) {
                    selectionArray.push($.extend(true, {}, item, selection));
                });
            }
            selectedRangeList = selectedRangeList.concat(selectionArray);
        }
    }
    return selectedRangeList;
};

EChartsWrapper.prototype._getDataSourceKeys = function () {
    var dataSourceKeys = [];
    if (this.options.source.lazyData) {
        for (var i in this.options.source.lazyData) {
            if (this.options.source.lazyData[i] && this.options.source.lazyData[i].id && this.options.source.lazyData[i].id.value) {
                dataSourceKeys.push(this.options.source.lazyData[i].id.value);
            }
        }
    }
    return dataSourceKeys;
};

EChartsWrapper.prototype._createSelectedRowIndexMap = function (eventData) {

    var _this = this;
    var selectedRowIndexMap = {};
    selectedRowIndexMap.dataSourceKeys = this._getDataSourceKeys();
    var series = _this.seriesHelper.series;
    for (var b in eventData.batch) {
        var batch = eventData.batch[b];
        batch.selected = batch.selected.filter(function (range) {
            return range.dataIndex.length > 0;
        });
        var cnt = batch.selected.length;
        if (cnt === 0) continue;

        for (var s in batch.selected) {
            var selected = batch.selected[s];
            var seriesIndex = selected.seriesIndex;
            var selectedDataIndex = selected.dataIndex;
            for (var i in selectedDataIndex) {
                var dataInSeries = series[seriesIndex].data[selectedDataIndex[i]];
                for (var j in dataInSeries.dataIndexes) {
                    selectedRowIndexMap[dataInSeries.dataIndexes[j]] = true;
                }
            }
        }
    }
    return selectedRowIndexMap;
};

EChartsWrapper.prototype._getSelectionFromArea = function (batchArea) {
    var selection = {};
    var _this = this;
    var dataColumns = _this.seriesHelper.getSeriesDataColumns();
    var xAxis = this._getEChartOption().xAxis[0];
    var yAxis = this._getEChartOption().yAxis[0];
    if (batchArea.brushType === 'lineX') {
        selection[dataColumns[0].name] = _this._convertToSelection(xAxis, dataColumns[0].name, batchArea.coordRange);
    } else if (batchArea.brushType === 'lineY') {
        if (yAxis.type === 'category' || !dataColumns[1].aggregation || dataColumns[1].aggregation === 'none') {
            selection[dataColumns[1].name] = _this._convertToSelection(yAxis, dataColumns[1].name, batchArea.coordRange);
        }
    } else {
        selection[dataColumns[0].name] = _this._convertToSelection(xAxis, dataColumns[0].name, batchArea.coordRange[0]);
        if (yAxis.type === 'category' || !dataColumns[1].aggregation || dataColumns[1].aggregation === 'none') {
            selection[dataColumns[1].name] = _this._convertToSelection(yAxis, dataColumns[1].name, batchArea.coordRange[1]);
        }
    }
    return selection;
};

EChartsWrapper.prototype._bindBrushSelected = function () {
    this.createBrushSelectedHandler();
    this.echart.on('brushSelected', this.brushSelectedHandler);
};

EChartsWrapper.prototype.onCellPointClick = function (callback) {
    if (this.echart) {
        this.echart.on('click', callback);
    }
};

EChartsWrapper.prototype.offCellPointClick = function (callback) {
    if (this.echart) {
        this.echart.off('click', callback);
    }
};

EChartsWrapper.prototype.onBrush = function (callback) {
    if (this.echart) {
        this.echart.on('brush', callback);
    }
};

EChartsWrapper.prototype.offBrush = function (callback) {
    if (this.echart) {
        this.echart.off('brush', callback);
    }
};

EChartsWrapper.prototype.onBrushSelected = function (callback) {
    if (this.echart) {
        this.echart.on('brushSelected', callback);
    }
};

EChartsWrapper.prototype.offBrushSelected = function (callback) {
    if (this.echart) {
        this.echart.off('brushSelected', callback);
    }
};

EChartsWrapper.prototype._triggerPendingBrushSelected = function (eventData) {
    var _this = this;
    if (_this._pendingBrushSelected) {
        clearTimeout(_this._pendingBrushSelected);
        _this._pendingBrushSelected = null;
    }
    _this._pendingBrushSelected = setTimeout(function () {
        var params = _this._createBrushSelectedData(eventData);
        _this.$parent.trigger('brushSelected', params);
    }, 1000);
};

EChartsWrapper.prototype._createBrushSelectedData = function (eventData) {
    var params = {
        type: 'brushSelected',
        originalEvent: eventData,
        selected: []
    };
    if (eventData.batch.length === 1 && eventData.batch[0].areas.length === 0) {
        params.type = 'brushCleared';
    } else {
        params.type = 'brushSelected';
        params.selected = this._createSelectedRange(eventData);
        params.rowIndexMap = this._createSelectedRowIndexMap(eventData);
    }
    this._selectedRange = params.selected;
    this._setBrushSelected(params.type);
    return params;
};

EChartsWrapper.prototype._setBrushSelected = function (selected) {
    if (selected === true || selected === 'brushSelected') {
        this._brushSelected = true;
    } else {
        this._brushSelected = false;
    }
};

EChartsWrapper.prototype._triggerClearBrushSelected = function () {
    var _this = this;
    var params = {
        type: 'brushCleared',
        selected: []
    };
    _this.$parent.trigger('brushSelected', params);
    _this._setBrushSelected(false);

    if (_this.dataSelected) {
        _this._restoreItemStyles();
        _this.dataSelected = false;
    }
};

EChartsWrapper.prototype._unbindBrushSelected = function () {
    var _this = this;
    this.echart.off('brushSelected', this.brushSelectedHandler);
};

EChartsWrapper.prototype._createContents = function ($parent) {
    var _this = this;
    this.$mainControl = $('<div class="bcharts-chart" chart-vendor="echarts"></div>');
    $parent.append(this.$mainControl);

    this.echart = echarts.init(this.$mainControl[0]);
    this.echart.clear();
    if (this.options.toolbar && this.options.toolbar.menu.brush) {
        this._bindBrushSelected();
    }

    this.resizeHandler = function () {
        _this.redrawLayout();
    };
    $(window).resize(this.resizeHandler);
};

EChartsWrapper.prototype._backupItemStyles = function () {
    this._backupStyles = [];
    var series = this._getEChartOption().series;
    for (var i in series) {
        this._backupStyles.push(series[i].itemStyle);
    }
    this._backupStyles = this._backupStyles.map(function (el) {
        if (el && (typeof el.normal === 'undefined' || typeof el.normal.color === 'undefined')) {
            el.normal = el.normal || {};
            el.normal.color = null;
        }
        return el;
    });
};

EChartsWrapper.prototype._restoreItemStyles = function () {
    if (this._backupStyles) {
        var series = this._getEChartOption().series;
        var seriesStyles = [];
        for (var s in series) {
            seriesStyles.push({
                itemStyle: this._backupStyles[s]
            });
        }
        this._setEChartOption({
            series: seriesStyles
        });
    }
};

EChartsWrapper.prototype._checkSameDataSource = function (interactedParams) {
    var result = true;
    var currentDataSourceKeys = this._getDataSourceKeys();
    if (interactedParams.rowIndexMap && interactedParams.rowIndexMap.dataSourceKeys) {
        var interactedDataSourceKeys = interactedParams.rowIndexMap.dataSourceKeys;
        result = false;
        for (var i in currentDataSourceKeys) {
            for (var j in interactedDataSourceKeys) {
                if (currentDataSourceKeys[i] === interactedDataSourceKeys[j]) return true;
            }
        }
    }
    return result;
};

EChartsWrapper.prototype.selectRange = function (args) {
    var _this = this;

    if (!this.options.toolbar.menu.brush) {
        return;
    }

    if (args.type == 'brushCleared') {
        if (this.dataSelected) {
            this._restoreItemStyles();
            this.dataSelected = false;
        } else if (this._brushSelected) {
            this._unbindBrushSelected();
            this.clearBrushArea();
            this._bindBrushSelected();
        }
    } else if (this._checkSameDataSource(args) === true) {
        this._unbindBrushSelected();
        this.clearBrushArea();
        this._bindBrushSelected();

        var series = this._getEChartOption().series;
        var seriesStyles = [];

        for (var s in series) {
            seriesStyles.push({
                itemStyle: {
                    normal: {
                        color: function color(params) {
                            var intersection = _this._interacted(args, params);
                            if (intersection) {
                                return _this.options.colorSet[params.seriesIndex];
                            } else {
                                return '#ddd';
                            }
                        }
                    }
                }
            });
        }
        this._setEChartOption({
            series: seriesStyles
        });
        this.dataSelected = true;
    }
};

EChartsWrapper.prototype.getSelectedRange = function () {
    return this._selectedRange;
};

EChartsWrapper.prototype._interactedSelection = function (selection, columns, row) {
    for (var col in selection) {
        var indexes = this.seriesHelper.getColumnIndexes([{ name: col }], columns);
        var values = this.seriesHelper.getCellValues(row, indexes);
        var index;
        if ($.isPlainObject(selection[col])) {
            for (var i in indexes) {
                index = indexes[i];
                var value = values[0];
                var min = selection[col].min;
                var max = selection[col].max;
                if (index >= 0 && columns[index].type === 'date') {
                    value = new Date(value).getTime();
                    min = new Date(min).getTime();
                    max = new Date(max).getTime();
                }
                if (value >= min && value <= max) {
                    // 적합
                } else {
                    return false;
                }
            }
        } else {
            if (values[0] != selection[col]) {
                return false;
            }
        }
    }
    return true;
};

EChartsWrapper.prototype._interacted = function (interactedParams, pointParams) {
    if (interactedParams.rowIndexMap) {
        var dataIndexes = pointParams.data.dataIndexes;
        var rowIndexMap = interactedParams.rowIndexMap;
        for (var i in dataIndexes) {
            if (rowIndexMap[dataIndexes[i]]) return true;
        }
    } else {
        var localData = this.seriesHelper.getLocalData();
        for (var i in pointParams.data.dataIndexes) {
            var row = localData.data[pointParams.data.dataIndexes[i]];
            for (var s in interactedParams.selected) {
                var selection = interactedParams.selected[s];
                if (this._interactedSelection(selection, localData.columns, row)) {
                    return true;
                }
            }
        }
    }
    return false;
};

EChartsWrapper.prototype.clear = function () {
    this._triggerClearBrushSelected();
    this.echart.clear();

    // TODO tooltip 을 위한 div 가 render 할 때 마다 생성됨, 강제로 삭제 by daewon.park since 2017-05-23
    this.$mainControl.children('div:nth-child(2)').remove();
};

EChartsWrapper.prototype._bindInternalOptions = function (opt) {
    var _this = this;
    opt._internalOptions = function () {
        return _this._getEChartOption();
    };
};

EChartsWrapper.prototype.getDataURL = function (options) {
    if (this.echart) {
        return this.echart.getDataURL(options);
    }
};

EChartsWrapper.prototype.render = function () {};

EChartsWrapper.prototype.redrawLayout = function () {
    var _this = this;

    clearTimeout(this._redrawLayoutJob);
    this._redrawLayoutJob = setTimeout(function () {
        if (_this.echart && _this.echart._dom) {
            if (_this.echart._dom.parentElement.getAttribute('status') !== 'error') {
                _this.echart._dom.style.display = 'block';
                if (_this.echart._dom.offsetWidth != 0 && _this.echart._dom.offsetHeight != 0) {
                    _this.echart.resize();
                } else if (_this.echart._dom.offsetWidth == 0 || _this.echart._dom.offsetHeight == 0) {
                    _this.echart._dom.style.display = 'none';
                }
            }
        }
    }, 300);
};

EChartsWrapper.prototype.setBrushType = function (opt) {
    this._unbindBrushSelected();

    this.echart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'brush',
        brushOption: {
            brushType: opt.brushType,
            brushMode: opt.brushMode
        }
    });

    this._bindBrushSelected();
};

EChartsWrapper.prototype.setBrushStyle = function (brushOption) {
    this._setEChartOption({
        brush: brushOption
    });
};

EChartsWrapper.prototype.setZoomMode = function (zoomType, filterMode) {
    var xZoom = false,
        yZoom = false;

    if (zoomType.zoomAxis === 'all') {
        xZoom = true;
        yZoom = true;
    } else if (zoomType.zoomAxis === 'xAxis') {
        xZoom = true;
    } else if (zoomType.zoomAxis === 'yAxis') {
        yZoom = true;
    }

    var dataZoom = function (x, y, f) {
        var xf = x ? f : 'none';
        var yf = y ? f : 'none';
        return [{
            id: 'insideZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: xf,
            disabled: !xZoom
        }, {
            id: 'insideZoomY',
            type: 'inside',
            yAxisIndex: [0],
            filterMode: yf,
            disabled: !yZoom
        }, {
            type: 'slider',
            xAxisIndex: [0],
            height: 20,
            handleSize: 24,
            show: xZoom,
            filterMode: xf
        }, {
            type: 'slider',
            yAxisIndex: [0],
            width: 20,
            handleSize: 24,
            show: yZoom,
            filterMode: yf
        }];
    }(xZoom, yZoom, filterMode);

    if (zoomType.zoom) {
        this._setEChartOption({
            dataZoom: dataZoom
        });
    } else {
        this._setEChartOption({
            dataZoom: [{
                type: 'slider',
                show: false
            }, {
                type: 'slider',
                show: false
            }, {
                id: 'insideZoomX',
                type: 'inside',
                disabled: true
            }, {
                id: 'insideZoomY',
                type: 'inside',
                disabled: true
            }]
        });
        this.echart.dispatchAction({
            type: 'dataZoom',
            start: 0,
            end: 100
        });
    }
};

EChartsWrapper.prototype.toggleLegend = function (name) {
    this.echart.dispatchAction({
        type: 'legendToggleSelect',
        name: name
    });
};

EChartsWrapper.prototype.dispatchAction = function (action) {
    this.echart.dispatchAction(action);
};

EChartsWrapper.prototype.zoom = function (range) {
    var options = {};
    for (var i = 0; i < range.length; i++) {
        range[i].disabled = false;
    }
    options.dataZoom = range;

    this._setEChartOption(options);
};

EChartsWrapper.prototype.resetZoom = function () {
    var options = {};
    options.dataZoom = [{
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100,
        disabled: true
    }, {
        type: 'inside',
        yAxisIndex: [0],
        start: 0,
        end: 100,
        disabled: true
    }];

    this._setEChartOption(options);
};

EChartsWrapper.prototype.clearBrushArea = function () {
    this.echart.dispatchAction({
        type: 'restore'
    });
};

EChartsWrapper.prototype.getLegendData = function () {
    var legendData = [];

    if (this._getEChartOption().legend && this._getEChartOption().legend[0]) {
        var legendSelection = this._getEChartOption().legend[0].selected;
        var hasLegend = this.seriesHelper.hasLegendData();

        if (hasLegend) {
            var opt = this.seriesHelper._internalOptions();
            for (var i in opt.series) {
                if (opt.series[i].virtualSeries) {
                    // true 일 경우만 skip
                } else {
                    var item = {
                        name: opt.series[i].name,
                        symbol: opt.series[i].symbol || 'circle',
                        symbolSize: opt.series[i].symbolSize || 10,
                        color: opt.color[parseFloat(i) % opt.color.length]
                    };
                    if (typeof legendSelection[item.name] === 'undefined') {
                        item.selected = true;
                    } else {
                        item.selected = legendSelection[item.name];
                    }
                    legendData.push(item);
                }
            }
        }
    }
    return legendData;
};

exports.default = EChartsWrapper;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _axisRangeDecorator = __webpack_require__(42);

var _axisRangeDecorator2 = _interopRequireDefault(_axisRangeDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _super = _echartsOptionBuilder2.default.prototype;

function EChartsAxisTypeOptionBuilder() {
    _super.constructor.call(this);
}

EChartsAxisTypeOptionBuilder.prototype = Object.create(_super);
EChartsAxisTypeOptionBuilder.prototype.constructor = EChartsAxisTypeOptionBuilder;

EChartsAxisTypeOptionBuilder.prototype._defaultOptions = function () {
    var opt = _super._defaultOptions.call(this);
    $.extend(true, opt, {
        dataZoom: [{
            id: 'insideZoomX',
            type: 'inside',
            filterMode: 'none',
            xAxisIndex: [0],
            disabled: true
        }, {
            id: 'insideZoomY',
            type: 'inside',
            filterMode: 'none',
            yAxisIndex: [0],
            disabled: true
        }]
    });
    return opt;
};

EChartsAxisTypeOptionBuilder.prototype._newSeriesExtractor = function (option) {
    option = option || {};
    var xAxisIndex = option.xAxisIndex || 0;
    var yAxisIndex = option.yAxisIndex || 0;

    var localData = this.getLocalData(0);
    var dataColumns = this.getSeriesDataColumns(0);
    var aggregation = dataColumns[1 + yAxisIndex].aggregation;
    var hasAggregation = aggregation && aggregation !== 'none';
    var xIndexes = this.getColumnIndexes(this.bOptions.xAxis[0].selected, localData.columns);
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: [xIndexes[xAxisIndex]],
        type: _optionUtils2.default.getAxisType(localData.columns[xIndexes[0]]),
        isKey: hasAggregation ? true : false
    });

    extractor.setTarget({
        index: [yIndexes[yAxisIndex]],
        type: aggregation ? 'value' : _optionUtils2.default.getAxisType(localData.columns[yIndexes[0]]),
        isKey: false
    });

    if (hasAggregation) {
        extractor.setExtractOperator(function (pointObject) {
            var operator = new _aggregationOperator2.default(pointObject.value);
            for (var i = 0; i < pointObject.indexList.length; i++) {
                operator.add(pointObject.indexList[i], pointObject.point[i][1]);
            }
            return [{ value: pointObject.value.concat(operator.calc(aggregation)), dataIndexes: pointObject.indexList }];
        });
    }
    return extractor;
};

EChartsAxisTypeOptionBuilder.prototype._buildSeriesData = function () {
    var aggregation = this.filterNullColumn(this.bOptions.yAxis[0].selected)[0].aggregation;

    for (var s in this.series) {
        this.series[s].data = this.series[s].extractor.extract(aggregation);
        if (this._seriesDataSortRule) {
            this.series[s].data = this.series[s].data.sort(this._seriesDataSortRule);
        }
    }
};

EChartsAxisTypeOptionBuilder.prototype.getDistinctColorByList = function () {
    var colorByList = [];
    var colorByName;
    for (var s in this.eOptions.series) {
        if (this.eOptions.series[s].virtualSeries) continue;
        colorByName = this.eOptions.series[s].name;
        if (colorByList.indexOf(colorByName) === -1) colorByList.push(colorByName);
    }
    return colorByList.sort();
};

EChartsAxisTypeOptionBuilder.prototype._setSeriesDataSortRule = function () {
    var xAxisType = this._getColumnDataType(this.filterNullColumn(this.bOptions.xAxis[0].selected));
    var yAxisType = this._getColumnDataType(this.filterNullColumn(this.bOptions.yAxis[0].selected));

    var sortRule = function sortRule(a, b) {
        var xComp;
        if (xAxisType === 'category') xComp = _optionUtils2.default.stringSortRule(a.value[0], b.value[0]);else if (xAxisType === 'time') xComp = _optionUtils2.default.timeSortRule(a.value[0], b.value[0]);else xComp = _optionUtils2.default.numericSortRule(a.value[0], b.value[0]);

        if (xComp === 0) {
            var yComp;
            if (yAxisType === 'category') yComp = _optionUtils2.default.stringSortRule(a.value[1], b.value[1]);else if (yAxisType === 'time') yComp = _optionUtils2.default.timeSortRule(a.value[1], b.value[1]);else yComp = _optionUtils2.default.numericSortRule(a.value[1], b.value[1]);
            return yComp;
        } else {
            return xComp;
        }
    };

    this._seriesDataSortRule = sortRule;
};

EChartsAxisTypeOptionBuilder.prototype._decorate = function () {
    new _axisRangeDecorator2.default(this).decorate();
    _super._decorate.call(this);
};

exports.default = EChartsAxisTypeOptionBuilder;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validationError = __webpack_require__(25);

var _validationError2 = _interopRequireDefault(_validationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AggregationOperator(x) {
    this.x = x;
    this.dataIndexes = [];
    this.nonNumericValues = [];
    this.values = [];
    this.sumValue = 0;
} /**
   * Source: aggregation-operator.js
   * Created by daewon.park on 2017-03-22.
   */


AggregationOperator.prototype.add = function (index, value) {
    this.dataIndexes.push(parseInt(index));
    this.values.push(value);
    this.sumValue += value;
    if (!Number.isFinite(value)) {
        this.nonNumericValues.push(value + '');
    }
};

AggregationOperator.prototype._toFixed = function (val) {
    if (typeof val !== 'number' || !Number.isFinite(val)) {
        throw new _validationError2.default(['This Chart Contains None Numeric Data.', '   [' + this.nonNumericValues.join(', ') + ']']);
    }
    return Number(val.toFixed(14));
};

AggregationOperator.prototype.sum = function () {
    return this._toFixed(this.sumValue);
};

AggregationOperator.prototype.average = function () {
    return this._toFixed(this.dataIndexes.length ? this.sumValue / this.dataIndexes.length : 0);
};

AggregationOperator.prototype.count = function () {
    return this.dataIndexes.length;
};

AggregationOperator.prototype.uniqueCount = function () {
    var counts = {};
    for (var i = 0; i < this.values.length; i++) {
        counts[this.values[i]] = 1 + (counts[this.values[i]] || 0);
    }
    return Object.keys(counts).length;
};

AggregationOperator.prototype.min = function () {
    var min = this._toFixed(Math.min.apply(null, this.values));
    return Number.isFinite(min) ? min : 0;
};

AggregationOperator.prototype.max = function () {
    var max = this._toFixed(Math.max.apply(null, this.values));
    return Number.isFinite(max) ? max : 0;
};

AggregationOperator.prototype.calc = function (operator) {
    switch (operator) {
        case 'sum':
            return this.sum();
        case 'average':
            return this.average();
        case 'count':
            return this.count();
        case 'unique_count':
            return this.uniqueCount();
        case 'min':
            return this.min();
        case 'max':
            return this.max();
    }
    return this.sum();
};

exports.default = AggregationOperator;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: aggregation-env.js
 * Created by ng1123.kim on 2017-06-07.
 */

exports.default = {
    AggregationMap: {
        NONE: { label: "(None)", value: "none" },
        SUM: { label: "Sum", value: "sum" },
        AVG: { label: "Average", value: "average" },
        COUNT: { label: "Count", value: "count" },
        UNIQUE_COUNT: { label: "Unique Count", value: "unique_count" },
        MIN: { label: "Min", value: "min" },
        MAX: { label: "Max", value: "max" }
    },
    DistributionMap: {
        NONE: { label: "(None)", value: "none" },
        NORMAL: { label: "Normal Distribution", value: "normal" },
        EXP: { label: "Exponential Distribution", value: "exponential" },
        GAMMA: { label: "Gamma Distribution", value: "gamma" },
        LOGNORMAL: { label: "Log-normal Distribution", value: "lognormal" },
        BETA: { label: "Beta Distribution", value: "beta" }
    },
    extendAggregation: function extendAggregation(list) {
        var aggregationList = [];
        for (var key in this.AggregationMap) {
            if (list.indexOf(key) >= 0) {
                aggregationList.push(this.AggregationMap[key]);
            }
        }
        return aggregationList;
    },
    extendDistribution: function extendDistribution(list) {
        var distributionList = [];
        for (var key in this.DistributionMap) {
            if (list.indexOf(key) >= 0) {
                distributionList.push(this.DistributionMap[key]);
            }
        }
        return distributionList;
    },
    Key: {
        SCATTER: 'scatter',
        TABLE: 'table'
    }
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Source: chart-utils.js
                                                                                                                                                                                                                                                                               * Created by daewon.park on 2017-04-25.
                                                                                                                                                                                                                                                                               */

var _validationError = __webpack_require__(25);

var _validationError2 = _interopRequireDefault(_validationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chartPlotOptionKey = {
    'area-stacked': 'area',
    'area-stacked-100': 'area',
    'bar-stacked': 'bar',
    'bar-stacked-100': 'bar',
    'biplot': 'component',
    'column-stacked': 'column',
    'column-stacked-100': 'column',
    'heatmap-matrix': 'heatmap',
    'histogram': 'column',
    'pairwise-scatter': 'scatter'
};

exports.default = {
    assignArray: function assignArray(targetObject, sourceObject) {
        for (var key in sourceObject) {
            if ($.isPlainObject(sourceObject[key])) {
                this.assignArray(targetObject[key], sourceObject[key]);
            } else if ($.isArray(sourceObject[key])) {
                targetObject[key] = $.extend(true, [], sourceObject[key]);
            }
        }
    },
    getChartContainerSize: function getChartContainerSize($widget) {
        var chartContainer = $widget.closest('.bcharts-container');
        return {
            width: chartContainer.width(),
            height: chartContainer.height()
        };
    },
    extendChartOptionsWithDefaultOptions: function extendChartOptionsWithDefaultOptions(options, defaultOptions) {
        var colorSet = (options.colorSet || defaultOptions.colorSet).slice();
        options = this.deleteNullOrUndefinedOptions(options, defaultOptions);
        options = this.resetToolbarOption(options, defaultOptions);

        var ret = $.extend(true, {}, defaultOptions, options);
        ret.colorSet = colorSet;
        return ret;
    },
    deleteNullOrUndefinedOptions: function deleteNullOrUndefinedOptions(options, defaultOptions) {
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && !Array.isArray(options)) {
            for (var key in options) {

                if (defaultOptions[key] === null || typeof defaultOptions[key] === 'undefined') continue;

                if (options[key] === null || typeof options[key] === 'undefined') {
                    delete options[key];
                } else if (_typeof(options[key]) === 'object' && !Array.isArray(options[key])) {
                    options[key] = this.deleteNullOrUndefinedOptions(options[key], defaultOptions[key]);
                }
            }
        }
        return options;
    },
    resetToolbarOption: function resetToolbarOption(options, defaultOptions) {
        if (options && options.toolbar && options.toolbar.type !== 'custom') {
            options.toolbar.show = defaultOptions.toolbar.show;
            options.toolbar.menu = defaultOptions.toolbar.menu;
        }
        return options;
    },
    limitMaxSeriesSize: function limitMaxSeriesSize(series) {
        var totalCount = 0;
        for (var i = 0; i < series.length; i++) {
            totalCount = totalCount + series[i].data.length;
        }

        if (totalCount > 3000) {
            throw new _validationError2.default('Too many category. Recommend other chart type or Change Column options.');
        }
    },
    getPlotOptions: function getPlotOptions(optionRef, chartType) {
        var parentChartType = chartPlotOptionKey[chartType] || chartType;
        return optionRef.plotOptions[parentChartType] || {};
    },
    convertHTMLSpecialChar: function convertHTMLSpecialChar(str) {
        if (str && typeof str === 'string') {
            str = str.replace(/&/g, '&amp;');
            str = str.replace(/</g, '&lt;');
            str = str.replace(/>/g, '&gt;');
            str = str.replace(/"/g, '&quot;');
            str = str.replace(/\s/g, '&nbsp;');
            return str;
        }
        return str;
    },
    parseString: function parseString(inptStr, isMultiLine) {
        if (inptStr) {
            if (isMultiLine) {
                return JSON.stringify(inptStr, null, '\t').replace(/\\"/g, '"');
            } else {
                return JSON.stringify(inptStr).replace(/\\"/g, '"');
            }
        } else {
            return JSON.stringify(inptStr);
        }
    },
    /**
     * colormap의 value, color값의 간격을 파악하여 color array 100개를 리턴함.
     * @param range, colorMap
     var range = {
            min: 0,
            max: 1000
         }
     var colorMap = [
     {
         "color": "#FD026C",
         "value": 124
     },
     {
         "color": "#4682B8",
         "value": 432
     },
     {
         "color": "#F5CC0A",
         "value": -64
     },
     {
         "color": "#1CED42",
         "value": 120
     },
     defaultColorSet: [ "#4682b8", "#5086ad"]   //min, max color
     ]
     * @returns {Array}
     [ "#4682b8", "#5086ad", "#5a8aa3", "#648f99", "#6f938f", ... (생략) ]
     * @private
     */
    genColorList: function genColorList(range, colorMap, defaultColorSet) {
        var _this = this;
        var defaultColorMap = {
            min: {
                color: defaultColorSet[0]
            },
            max: {
                color: defaultColorSet.slice(-1)[0]
            }
        };

        var colorValue = colorMap.filter(function (mapObj, pos) {
            return !Number.isNaN(mapObj.value) && mapObj.value >= range.min && mapObj.value <= range.max;
        });
        if (colorValue.length == 0) {
            return [];
            // } else if (colorValue.length == 1) {
            //     return [defaultColorMap.min.color, colorValue[0].color, defaultColorMap.max.color];
        } else {
            defaultColorMap.min.value = range.min;
            defaultColorMap.max.value = range.max;
            colorValue.push(defaultColorMap.min);
            colorValue.push(defaultColorMap.max);
        }

        var intervalArr = [0],
            genColorList = [];
        var uniqueColorMap = colorValue.slice().sort(function (prev, curr) {
            return prev.value > curr.value;
        }).reduce(function (prev, curr) {
            // slice(-1)[0] means last item in array without removing it (like .pop())
            if (!prev.slice(-1)[0] || prev.slice(-1)[0].value !== curr.value) {
                prev.push(curr);
            } else {
                prev[prev.length - 1] = curr;
            }
            return prev;
        }, []);

        // defaultColorMap.min.value = range.min;
        // defaultColorMap.max.value = range.max;
        // uniqueColorMap.unshift(defaultColorMap.min);
        // uniqueColorMap.push(defaultColorMap.max);

        for (var idx = 1; idx < uniqueColorMap.length; idx++) {
            intervalArr.push(uniqueColorMap[idx].value - uniqueColorMap[idx - 1].value);
        }
        if (intervalArr.length != 1) {

            var sum = intervalArr.reduce(function (prev, curr) {
                return prev + Math.abs(curr);
            });
            var numOfColorArr = intervalArr.map(function (elem) {
                return Math.abs(Math.round(elem / sum * 100));
            });

            numOfColorArr.forEach(function (numOfColor, index) {
                if (index > 0) {
                    genColorList = genColorList.concat(generateColor(uniqueColorMap[index - 1].color, uniqueColorMap[index].color, numOfColor));
                }
            });
        } else {
            //같은 값으로만 이루어진경우(ex. value가 모두 0)
            genColorList = [uniqueColorMap.slice(-1)[0].color];
        }
        return genColorList;

        function hex(c) {
            var s = "0123456789abcdef";
            var i = parseInt(c);
            if (i == 0 || isNaN(c)) return "00";
            i = Math.round(Math.min(Math.max(0, i), 255));
            return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
        }

        /* Convert an RGB triplet to a hex string */
        function convertToHex(rgb) {
            return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
        }

        /* Remove '#' in color hex string */
        function trim(s) {
            return s.charAt(0) == '#' ? s.substring(1, 7) : s;
        }

        /* Convert a hex string to an RGB triplet */
        function convertToRGB(hex) {
            var color = [];
            color[0] = parseInt(trim(hex).substring(0, 2), 16);
            color[1] = parseInt(trim(hex).substring(2, 4), 16);
            color[2] = parseInt(trim(hex).substring(4, 6), 16);
            return color;
        }

        function generateColor(colorStart, colorEnd, colorCount) {

            // The beginning of your gradient
            var start = convertToRGB(colorStart);

            // The end of your gradient
            var end = convertToRGB(colorEnd);

            // The number of colors to compute
            var len = colorCount;

            //Alpha blending amount
            var alpha = 0.0;

            var saida = [];

            for (var i = 0; i < len; i++) {
                var c = [];
                alpha += 1.0 / len;

                c[0] = start[0] * alpha + (1 - alpha) * end[0];
                c[1] = start[1] * alpha + (1 - alpha) * end[1];
                c[2] = start[2] * alpha + (1 - alpha) * end[2];

                saida.push('#' + convertToHex(c));
            }
            return saida.reverse();
        }
    }
};

/***/ }),
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PointWithCategoryKeyExtractor() {
    _echartsPointExtractor2.default.call(this);
}

PointWithCategoryKeyExtractor.prototype = Object.create(_echartsPointExtractor2.default.prototype);
PointWithCategoryKeyExtractor.prototype.constructor = PointWithCategoryKeyExtractor;

PointWithCategoryKeyExtractor.prototype.push = function (row, rowIndex) {
    var pointer = this._getKeyPointer(row, rowIndex);
    var index = Number(rowIndex);
    var value;
    var point = [];
    var prePointList = [];
    var currentPointList = [];
    var indexes;

    for (var i = 0; i < this._columnIndices.length; i++) {
        indexes = this._columnIndices[i];
        prePointList = currentPointList.concat([]);
        currentPointList = [];
        for (var j = 0; j < indexes.length; j++) {
            value = this._getPointValue(row, indexes[j], index);
            if (this._typeList[i] === 'category') {
                value += '';
                this._setCategory(i, value);
            }
            if (prePointList.length === 0) {
                currentPointList.push([value]);
            } else {
                for (var k = 0; k < prePointList.length; k++) {
                    currentPointList.push(prePointList[k].concat([value]));
                }
            }
        }
    }

    pointer.point = pointer.point.concat(currentPointList);
    pointer.indexList.push(index);
};

PointWithCategoryKeyExtractor.prototype._getKeyList = function (row, rowIndex) {
    if (!this._hasKey) return [rowIndex];
    var keys = [];
    for (var i = 0; i < this._keys.length; i++) {
        var key = row[this._keys[i]] + '';
        keys.push(key);
    }
    return keys;
};

exports.default = PointWithCategoryKeyExtractor;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: widget.js
 * Created by daewon.park on 2017-03-22.
 */

function Widget(parentId, options) {
    this.parentId = parentId;
    this.options = options;
    this._init();
    this._createContents(this.$parent);
}

Widget.prototype._init = function () {
    this._retrieveParent();

    $.extend(true, this.options, {
        style: {}
    });
};

Widget.prototype._retrieveParent = function () {
    this.$parent = typeof this.parentId === 'string' ? $(this.parentId) : this.parentId;
};

Widget.prototype._createContents = function ($parent) {};

Widget.prototype.getOptions = function () {
    if (typeof this.options === 'function') {
        return this.options();
    } else {
        return this.options;
    }
};

Widget.prototype.show = function () {
    if (this.$mainControl) {
        this.$mainControl.show();
    }
};

Widget.prototype.hide = function () {
    if (this.$mainControl) {
        this.$mainControl.hide();
    }
};

Widget.prototype.destroy = function () {};

Widget.prototype.uuid = function (length) {
    var ALPHABET = '23456789abcdefghijkmnpqrstuvwxyz';
    var size = length | 8;
    var rtn = '';
    for (var i = 0; i < size; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
};

exports.default = Widget;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAxisTypeCalculatedOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsAxisTypeCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsAxisTypeCalculatedOptionBuilder.prototype.constructor = EChartsAxisTypeCalculatedOptionBuilder;

EChartsAxisTypeCalculatedOptionBuilder.prototype._buildSeriesData = function () {
    var aggregation = this.getSeriesDataColumns(0)[1].aggregation;

    for (var s in this.series) {
        this.series[s].data = this.series[s].extractor.extract(aggregation);
        if (this._seriesDataSortRule) {
            this.series[s].data = this.series[s].data.sort(this._seriesDataSortRule);
        }
    }
};

EChartsAxisTypeCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: _optionUtils2.default.getAxisType(localData.chartColumns[xIndexes[0]]),
        isKey: false
    });

    extractor.setTarget({
        index: yIndexes,
        type: _optionUtils2.default.getAxisType(localData.chartColumns[yIndexes[0]]),
        isKey: false
    });

    return extractor;
};

EChartsAxisTypeCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    return [{ name: 'colorBy' }];
};

EChartsAxisTypeCalculatedOptionBuilder.prototype.getSeriesKeyColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getSeriesKeyColumns(dataIndex);
    return this.getColumnIndexes(keyColumns, localData.chartColumns);
};

exports.default = EChartsAxisTypeCalculatedOptionBuilder;

/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseError = __webpack_require__(64);

var _baseError2 = _interopRequireDefault(_baseError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _super = _baseError2.default.prototype; /**
                                             * Created by sds on 2018-03-05.
                                             */

function ValidationError(message) {
  _super.constructor.call(this, message);
  // this.name = 'ValidationError';
}

ValidationError.prototype = Object.create(_super);
ValidationError.prototype.constructor = ValidationError;

exports.default = ValidationError;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerChart = registerChart;
exports.getChartTypeList = getChartTypeList;
exports.isRegisteredChart = isRegisteredChart;
exports.getChartAttr = getChartAttr;
exports.createChart = createChart;

var _bchartIndex = __webpack_require__(44);

var Charts = _interopRequireWildcard(_bchartIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var chartRegistry = {}; /**
                         * Created by sds on 2017-12-19.
                         */

_init();

//private
function _init() {
    if ($.isEmptyObject(chartRegistry)) {
        console.log('register chart init');
    } else {
        console.log('chart already registered');
        return;
    }
    var chartTypeList = Object.keys(Charts);
    chartTypeList.forEach(function (chartType) {
        //FIXME: to delete
        Charts[chartType].DefaultOptions = Charts[chartType].Attr.DefaultOptions;
        Charts[chartType].ColumnConf = Charts[chartType].Attr.ColumnConf;
        Charts[chartType].Label = Charts[chartType].Attr.Label;
        Charts[chartType].Order = Charts[chartType].Attr.Order;

        chartRegistry[Charts[chartType].Attr.Key] = Charts[chartType];
    });
}

// export default function getChartRegistry(){
//     return chartRegistry;
// }
exports.default = chartRegistry;
function registerChart(option) {
    if ($.isEmptyObject(chartRegistry)) {
        console.log('chart register is empty');
    }
    //FIXME: to delete
    option.Func.DefaultOptions = option.Func.Attr.DefaultOptions;
    option.Func.ColumnConf = option.Func.Attr.ColumnConf;
    option.Func.Label = option.Func.Attr.Label;
    option.Func.Order = option.Func.Attr.Order;

    chartRegistry[option.Key] = option.Func;
}

function getChartTypeList() {
    return Object.keys(chartRegistry);
}

function isRegisteredChart(chartType) {
    return Object.keys(chartRegistry).includes(chartType);
}

function getChartAttr(chartType) {
    if (!chartRegistry[chartType]) {
        return;
    }
    return chartRegistry[chartType].Attr;
}

function createChart(chartType, parentId, options) {
    if (!chartRegistry[chartType] || !parentId || !options) {
        throw new Error('Cannot create chart. ' + chartType);
    }
    return new chartRegistry[chartType](parentId, options);
}

/***/ }),
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeDecorator(builder, options) {
    _decorator2.default.call(this, builder, options);
}

AxisTypeDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisTypeDecorator.prototype.constructor = AxisTypeDecorator;

AxisTypeDecorator.prototype.decorate = function () {
    this.setAxisType();

    var xCategoryMap = {};
    var yCategoryMap = {};

    for (var s in this.eOptions.series) {
        if (!this.eOptions.series[s].extractor) continue;
        if (this.eOptions.xAxis[0].type === 'category') {
            $.extend(xCategoryMap, this.eOptions.series[s].extractor.getCategoryMap(0));
        }
        if (this.eOptions.yAxis[0].type === 'category') {
            $.extend(yCategoryMap, this.eOptions.series[s].extractor.getCategoryMap(1));
        }
    }

    if (this.eOptions.xAxis[0].type === 'category') {
        var xCategories = Object.keys(xCategoryMap);
        var sortRule = this._getSortRule(this.bOptions.xAxis[0].selected);
        xCategories.sort(sortRule);
        this.eOptions.xAxis[0].data = xCategories;
    }
    if (this.eOptions.yAxis[0].type === 'category') {
        var yCategories = Object.keys(yCategoryMap);
        var sortRule = this._getSortRule(this.bOptions.yAxis[0].selected);

        yCategories.sort(sortRule);
        this.eOptions.yAxis[0].data = yCategories;
    }
};

AxisTypeDecorator.prototype.setAxisType = function () {
    if (typeof this.options === 'undefined' || this.options.setAxisByColumn !== false) {
        var builder = this.builder;
        var localData = builder.getLocalData();
        var columnIndexes = builder.getSeriesDataColumnIndexes();
        var dataColumns = builder.getSeriesDataColumns();
        var xColumn = $.extend(true, {}, localData.columns[columnIndexes[0]], dataColumns[0]);
        var yColumn = $.extend(true, {}, localData.columns[columnIndexes[1]], dataColumns[1]);

        this.eOptions.xAxis[0].type = _optionUtils2.default.getAxisType(xColumn);
        this.eOptions.yAxis[0].type = _optionUtils2.default.getAxisType(yColumn);
    }
};

AxisTypeDecorator.prototype._getSortRule = function (target) {
    var builder = this.builder;
    var axisType = builder._getColumnDataType(builder.filterNullColumn(target));
    var sortRule = function sortRule(a, b) {
        var comp;
        if (axisType === 'category') comp = _optionUtils2.default.stringSortRule(a, b);else if (axisType === 'time') comp = _optionUtils2.default.timeSortRule(a, b);else comp = _optionUtils2.default.numericSortRule(a * 1, b * 1);

        return comp;
    };
    return sortRule;
};

exports.default = AxisTypeDecorator;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function Extractor() {
    this._keys = [];
    this._typeList = [];
    this._columnIndices = [];
    this._aggregationList = [];
    this._categoryMap = {};
}

/**
 * @param target
 *  {
     *      index: [1],
     *      type: 'number', 'category' or 'date'
     *      aggregation: 'none', 'sum' ...
     *      isKey: true or false
     *  }
 *
 */

Extractor.prototype.setTarget = function (target) {
    this._columnIndices.push(target.index);
    this._typeList.push(target.type || 'category');
    this._categoryMap[target.index] = {};
    this._aggregationList.push(target.aggregation || 'none');
    if (target.isKey) {
        this._keys = this._keys.concat(target.index);
        this._hasKey = true;
    }
};

Extractor.prototype.setTargets = function (targets) {
    for (var i = 0; i < targets.length; i++) {
        this.setTarget(targets[i]);
    }
};

Extractor.prototype.push = function (row, rowIndex) {};

Extractor.prototype.extract = function () {};

exports.default = Extractor;

/***/ }),
/* 30 */,
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axisTitle = __webpack_require__(235);

Object.keys(_axisTitle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _axisTitle[key];
    }
  });
});

var _legend = __webpack_require__(236);

Object.keys(_legend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _legend[key];
    }
  });
});

var _pagination = __webpack_require__(72);

Object.keys(_pagination).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pagination[key];
    }
  });
});

var _title = __webpack_require__(71);

Object.keys(_title).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _title[key];
    }
  });
});

var _toolbar = __webpack_require__(237);

Object.keys(_toolbar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toolbar[key];
    }
  });
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _echartsLineOptionBuilder = __webpack_require__(46);

var _echartsLineOptionBuilder2 = _interopRequireDefault(_echartsLineOptionBuilder);

var _echartsLineByrowindexOptionBuilder = __webpack_require__(239);

var _echartsLineByrowindexOptionBuilder2 = _interopRequireDefault(_echartsLineByrowindexOptionBuilder);

var _echartsLineComplexOptionBuilder = __webpack_require__(240);

var _echartsLineComplexOptionBuilder2 = _interopRequireDefault(_echartsLineComplexOptionBuilder);

var _echartsLineCalculatedOptionBuilder = __webpack_require__(142);

var _echartsLineCalculatedOptionBuilder2 = _interopRequireDefault(_echartsLineCalculatedOptionBuilder);

var _echartsLineBycolumnnamesOptionBuilder = __webpack_require__(241);

var _echartsLineBycolumnnamesOptionBuilder2 = _interopRequireDefault(_echartsLineBycolumnnamesOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsLine(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Source: echarts.wrapper.js
   * Created by daewon.park on 2017-03-23.
   */

EChartsLine.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsLine.prototype.constructor = EChartsLine;

EChartsLine.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsLine.prototype.getLegendData = function () {
    var legendData = [];

    if (this._getEChartOption().legend && this._getEChartOption().legend[0]) {
        var legendSelection = this._getEChartOption().legend[0].selected;
        var colorByColumns = this.seriesHelper.getColorByColumns();
        if (colorByColumns.length > 0 || this.seriesHelper.hasLegendData()) {
            var opt = this.seriesHelper.eOptions;

            var colorByNames = this.seriesHelper.getDistinctColorByList();
            for (var i in colorByNames) {
                var item = {
                    name: colorByNames[i],
                    symbol: opt.series[0].symbol || 'circle',
                    symbolSize: opt.series[i].symbolSize || 10,
                    color: opt.color[i % opt.color.length]
                };
                if (typeof legendSelection[item.name] === 'undefined') {
                    item.selected = true;
                } else {
                    item.selected = legendSelection[item.name];
                }
                legendData.push(item);
            }
        }
    }

    return legendData;
};

EChartsLine.prototype.getSeriesHelper = function () {
    var xAxisType = _optionUtils2.default.getXAxisType(this.options);
    if (this.isComplex) {
        return new _echartsLineComplexOptionBuilder2.default();
    } else if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsLineCalculatedOptionBuilder2.default();
    } else if (xAxisType === 'byColumnNames') {
        return new _echartsLineBycolumnnamesOptionBuilder2.default();
    } else if (xAxisType === 'byRowIndex') {
        return new _echartsLineByrowindexOptionBuilder2.default();
    } else {
        return new _echartsLineOptionBuilder2.default();
    }
};

// Alias['line'] = EChartsLine;

exports.default = EChartsLine;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _validationError = __webpack_require__(25);

var _validationError2 = _interopRequireDefault(_validationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: chart-option-builder.js
 * Created by daewon.park on 2017-03-22.
 */
var chartPlotOptionKey = {
    'area-stacked': 'area',
    'area-stacked-100': 'area',
    'bar-stacked': 'bar',
    'bar-stacked-100': 'bar',
    'biplot': 'component',
    'column-stacked': 'column',
    'column-stacked-100': 'column',
    'heatmap-matrix': 'heatmap',
    'histogram': 'column',
    'pairwise-scatter': 'scatter'
};
// import * as ChartRegistry from '../types/bchart-register'


function ChartOptionBuilder() {}

ChartOptionBuilder.prototype._buildOptions = function (options) {
    this.bOptions = options;
};

ChartOptionBuilder.prototype.getColumnIndexes = function (columns, allColumns) {
    return _optionUtils2.default.getColumnIndexes(columns, allColumns);
};

ChartOptionBuilder.prototype.getCellText = function (row, columnIndexes, preFix) {
    var values = [];
    if (preFix) {
        values.push(preFix);
    }
    for (var i in columnIndexes) {
        var idx = columnIndexes[i];
        if (row[idx] || row[idx] === 0) {
            if ($.isArray(row[idx])) {
                values.push(row[idx]);
            } else {
                values.push('' + row[idx]);
            }
        } else {
            values.push('(empty)');
        }
    }
    return values;
};

ChartOptionBuilder.prototype.getCellValues = function (row, columnIndexes) {
    var values = [];
    for (var i in columnIndexes) {
        var idx = columnIndexes[i];
        values.push(row[idx]);
    }
    return values;
};

ChartOptionBuilder.prototype.getSeriesName = function (row, columnIndexes) {
    return this.getCellText(row, columnIndexes).join(' ');
};

ChartOptionBuilder.prototype.getSeriesItem = function (series, name) {
    var seriesItem = series[name];
    if (!seriesItem) {
        seriesItem = this._newSeriesItem();
        seriesItem.name = name;
    }
    return seriesItem;
};

ChartOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: this.bOptions.chart.type,
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    return seriesItem;
};

ChartOptionBuilder.prototype.filterNullColumn = function (columns) {
    return columns.filter(function (col) {
        return col && col.name;
    });
};

ChartOptionBuilder.prototype.setSeriesKeyColumns = function (columns, dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    columns = this.filterNullColumn(columns);
    this._seriesKsyColumsList = this._seriesKsyColumsList || [];
    this._seriesKsyColumsList[dataIndex] = this._seriesKsyColumsList[dataIndex] || [];
    this._seriesKsyColumsList[dataIndex] = this._seriesKsyColumsList[dataIndex].concat(columns);
};

ChartOptionBuilder.prototype.getSeriesKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    if (this._seriesKsyColumsList && this._seriesKsyColumsList[dataIndex]) {
        return this._seriesKsyColumsList[dataIndex];
    } else {
        return this.bOptions.colorBy.length > 0 ? this.filterNullColumn(this.bOptions.colorBy[dataIndex].selected) : [];
    }
};

ChartOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.bOptions.colorBy.length > 0 ? this.filterNullColumn(this.bOptions.colorBy[dataIndex].selected) : [];
};

ChartOptionBuilder.prototype.setSeriesDataColumns = function (seriesDataColumns, dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    seriesDataColumns = this.filterNullColumn(seriesDataColumns);
    this.seriesDataColumns = this.seriesDataColumns || [];
    this.seriesDataColumns[dataIndex] = this.seriesDataColumns[dataIndex] || [];
    this.seriesDataColumns[dataIndex] = this.seriesDataColumns[dataIndex].concat(seriesDataColumns);
};

ChartOptionBuilder.prototype.getSeriesDataColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    this.seriesDataColumns = this.seriesDataColumns || [];
    this.seriesDataColumns[dataIndex] = this.seriesDataColumns[dataIndex] || [];
    return this.seriesDataColumns[dataIndex];
};

ChartOptionBuilder.prototype.setTooltipDataColumns = function (tooltipDataColumns, dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    tooltipDataColumns = this.filterNullColumn(tooltipDataColumns);
    this.tooltipDataColumns = this.tooltipDataColumns || [];
    this.tooltipDataColumns[dataIndex] = this.tooltipDataColumns[dataIndex] || [];
    this.tooltipDataColumns[dataIndex] = this.tooltipDataColumns[dataIndex].concat(tooltipDataColumns);
};

ChartOptionBuilder.prototype.getTooltipDataColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    this.tooltipDataColumns = this.tooltipDataColumns || [];
    this.tooltipDataColumns[dataIndex] = this.tooltipDataColumns[dataIndex] || [];
    return this.tooltipDataColumns[dataIndex];
};

ChartOptionBuilder.prototype.getLocalData = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.bOptions.source.localData[dataIndex];
};

ChartOptionBuilder.prototype.getAllColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    if (this.bOptions.source.localData[dataIndex]) {
        return this.bOptions.source.localData[dataIndex].columns;
    } else {
        return [];
    }
};

ChartOptionBuilder.prototype.getColorByColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.bOptions.colorBy && this.bOptions.colorBy.length > 0 ? this.filterNullColumn(this.bOptions.colorBy[dataIndex].selected) : [];
};

ChartOptionBuilder.prototype.getSeriesKeyColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getSeriesKeyColumns(dataIndex);
    return this.getColumnIndexes(keyColumns, localData.columns);
};

ChartOptionBuilder.prototype.getTooltipKeyColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getTooltipKeyColumns(dataIndex);
    return this.getColumnIndexes(keyColumns, localData.columns);
};

ChartOptionBuilder.prototype.getSeriesDataColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var dataColumns = this.getSeriesDataColumns(dataIndex);
    return this.getColumnIndexes(dataColumns, localData.columns);
};

ChartOptionBuilder.prototype.getTooltipDataColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getTooltipDataColumns(dataIndex);
    return this.getColumnIndexes(keyColumns, localData.columns);
};

ChartOptionBuilder.prototype.getColorByColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getColorByColumns(dataIndex);
    return this.getColumnIndexes(keyColumns, localData.columns);
};

ChartOptionBuilder.prototype.getColumnType = function (column) {
    var localData = this.getLocalData();
    for (var i in localData.columns) {
        if (localData.columns[i].name == column.name) {
            return localData.columns[i].type;
        }
    }
};

ChartOptionBuilder.prototype.getPlotOptions = function () {
    var chartType = this.bOptions.chart.type;
    if (this.bOptions.plotOptions) {
        //FIXME: parent chart type사용하지말고 차트별로 쪼개야함.
        var parentChartType = chartPlotOptionKey[chartType] || chartType;
        return this.bOptions.plotOptions[parentChartType] || {};
    } else {
        return {};
    }
};

ChartOptionBuilder.prototype._throwValidation = function (message) {
    throw new _validationError2.default(message);
};

exports.default = ChartOptionBuilder;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAxisTypeComplexOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
} /**
   * Created by sds on 2018-01-24.
   */

EChartsAxisTypeComplexOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsAxisTypeComplexOptionBuilder.prototype.constructor = EChartsAxisTypeComplexOptionBuilder;

EChartsAxisTypeComplexOptionBuilder.prototype.parseCategory = function (isCategoryKey) {
    this._categoryKey = isCategoryKey;
    return this;
};

/**
 * @param keyColumnObj =  {
     *  complexKey : {name: 'SepalWidth', aggregation: 'none'},
     *  seriesNameIdx: 1
     * }
 */
EChartsAxisTypeComplexOptionBuilder.prototype.setComplexOption = function (complexOption) {
    this.complexKey = complexOption.column;
    this.seriesNameIdx = complexOption.idx;
    return this;
};

EChartsAxisTypeComplexOptionBuilder.prototype.getSeriesName = function (row, columnIndexes) {
    var resultStr = _echartsAxisTypeOptionBuilder2.default.prototype.getSeriesName.call(this, row, columnIndexes);
    if (resultStr) {
        return _optionUtils2.default.getColumnLabel(this.complexKey) + ' ' + resultStr;
    } else {
        return _optionUtils2.default.getColumnLabel(this.complexKey);
    }
};

EChartsAxisTypeComplexOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var dataColumns = this.getSeriesDataColumns(0);
    var aggregation = dataColumns[1].aggregation;
    var hasAggregation = aggregation && aggregation !== 'none';
    var xIndexes = this.getColumnIndexes(this.bOptions.xAxis[0].selected, localData.columns);
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = this._categoryKey ? new _echartsPointWithCategorykeyExtractor2.default() : new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: this._categoryKey ? 'category' : _optionUtils2.default.getAxisType(localData.columns[xIndexes[0]]),
        isKey: hasAggregation ? true : false
    });

    extractor.setTarget({
        index: yIndexes,
        type: this._categoryKey || aggregation ? 'value' : _optionUtils2.default.getAxisType(localData.columns[yIndexes[0]]),
        isKey: false
    });

    if (hasAggregation) {
        extractor.setExtractOperator(function (pointObject) {
            var operator = new _aggregationOperator2.default(pointObject.value);
            for (var i = 0; i < pointObject.indexList.length; i++) {
                operator.add(pointObject.indexList[i], pointObject.point[i][1]);
            }
            return [{ value: pointObject.value.concat(operator.calc(aggregation)) }];
        });
    }
    return extractor;
};

EChartsAxisTypeComplexOptionBuilder.prototype._setUpOptions = function () {
    if (this._categoryKey) {
        this._registerDecorator('axisTypeWithCategoryX');
        this._registerDecorator('yAxisMin0', { aggr: ['count'] });
    } else {
        this._registerDecorator('axisType');
    }
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('tooltip'); //, {complexIdx: this.complexIdx});
    this._registerDecorator('seriesNameSet');
    this._registerDecorator('lineBy');
};
exports.default = EChartsAxisTypeComplexOptionBuilder;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PointByColumnNamesDataExtractor() {
    _echartsPointExtractor2.default.call(this);
    this._points = [];
}

PointByColumnNamesDataExtractor.prototype = Object.create(_echartsPointExtractor2.default.prototype);
PointByColumnNamesDataExtractor.prototype.constructor = PointByColumnNamesDataExtractor;

PointByColumnNamesDataExtractor.prototype.push = function (row, rowIndex) {
    var columnIndices = this._columnIndices[0].filter(function (columnIdx) {
        return columnIdx != -1;
    });

    for (var i = 0; i < columnIndices.length; i++) {
        var pointData = {
            value: [],
            categoryIndex: i,
            dataIndexes: [parseInt(rowIndex)] // point 에 해당하는 원본 데이터 인덱스
        };

        pointData.value = [i, row[columnIndices[i]]];
        this._points.push(pointData);
    }
};

// PointByColumnNamesDataExtractor.prototype.extract = function () {
//     return this._points;
// };
//
// PointExtractor.prototype.extract = function (extractOperator) {
//     if (typeof extractOperator === 'function') {
//         return extractOperator(this._keyPointMap);
//     } else {
//         var answer = [];
//         var pointObject;
//         for (var i in this._keyPointMap) {
//             pointObject = this._keyPointMap[i];
//             answer = answer.concat(this._extract(pointObject));
//         }
//         return answer;
//     }
// };

PointByColumnNamesDataExtractor.prototype.extract = function () {
    if (this._extractOperator) {
        return this._extractOperator(this._points);
    } else {
        return this._points;
    }
};

exports.default = PointByColumnNamesDataExtractor;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _echartsColumnOptionBuilder = __webpack_require__(152);

var _echartsColumnOptionBuilder2 = _interopRequireDefault(_echartsColumnOptionBuilder);

var _echartsColumnCalculatedOptionBuilder = __webpack_require__(263);

var _echartsColumnCalculatedOptionBuilder2 = _interopRequireDefault(_echartsColumnCalculatedOptionBuilder);

var _echartsColumnComplexOptionBuilder = __webpack_require__(264);

var _echartsColumnComplexOptionBuilder2 = _interopRequireDefault(_echartsColumnComplexOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumn(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Source: echarts-column.js
   * Created by daewon.park on 2017-03-29.
   */


EChartsColumn.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsColumn.prototype.constructor = EChartsColumn;

EChartsColumn.prototype.render = function () {

    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsColumn.prototype._doDataValidation = function (opt) {
    _chartUtils2.default.limitMaxSeriesSize(opt.series);
};

EChartsColumn.prototype._createSelectedRange = function (eventData) {
    var _this = this;
    var keyColumns = _this.seriesHelper.getSeriesKeyColumns();
    var dataColumns = _this.seriesHelper.getSeriesDataColumns();
    var selectedRangeList = [];
    var series = this.seriesHelper.series;
    for (var b in eventData.batch) {
        var batch = eventData.batch[b];
        for (var s in batch.selected) {
            if (batch.selected[s].dataIndex.length === 0) continue;
            var seriesIndex = batch.selected[s].seriesIndex;
            var template = {};
            for (var k in keyColumns) {
                var seriesKey = keyColumns[k].name;
                var seriesValue = series[seriesIndex].keys[k];
                template[seriesKey] = seriesValue;
            }
            for (var d in batch.selected[s].dataIndex) {
                var idx = batch.selected[s].dataIndex[d];
                var col = dataColumns[0].name;
                var val = series[seriesIndex].data[idx].value[0];
                if (_this.seriesHelper.getColumnType(dataColumns[0]) === 'number') {
                    val = Number(val);
                }
                var item = {};
                item[col] = val;
                $.extend(true, item, template);
                selectedRangeList.push(item);
            }
        }
    }
    return selectedRangeList;
};

EChartsColumn.prototype.getLegendData = function () {
    var legendData = _echartsWrapper2.default.prototype.getLegendData.call(this);
    for (var i in legendData) {
        legendData[i].symbol = 'square';
    }
    return legendData;
};

EChartsColumn.prototype.getSeriesHelper = function () {
    if (this.isComplex) {
        return new _echartsColumnComplexOptionBuilder2.default();
    } else if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsColumnCalculatedOptionBuilder2.default();
    } else {
        return new _echartsColumnOptionBuilder2.default();
    }
};

//complex용..  repository 만들어야할듯
// Alias['column'] = EChartsColumn;

exports.default = EChartsColumn;

/***/ }),
/* 38 */,
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipTriggerAxisDecorator(builder) {
    _decorator2.default.call(this, builder);
}

TooltipTriggerAxisDecorator.prototype = Object.create(_decorator2.default.prototype);
TooltipTriggerAxisDecorator.prototype.constructor = TooltipTriggerAxisDecorator;

TooltipTriggerAxisDecorator.prototype.decorate = function () {
    if (this.plotOptions.hasOwnProperty('tooltip')) {
        if (!this.plotOptions.tooltip.hasOwnProperty('trigger')) {
            this.eOptions.tooltip.trigger = 'axis';
        }
    } else {
        this.eOptions.tooltip.trigger = 'axis';
    }
};

exports.default = TooltipTriggerAxisDecorator;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipPieDecorator(builder) {
    _decorator2.default.call(this, builder);
}

TooltipPieDecorator.prototype = Object.create(_decorator2.default.prototype);
TooltipPieDecorator.prototype.constructor = TooltipPieDecorator;

TooltipPieDecorator.prototype.decorate = function () {
    var _this = this;
    var builder = this.builder;
    var dataColumns = builder.getTooltipDataColumns();
    var colorByColumns = builder.getColorByColumns();
    var sizeByColumns = dataColumns.slice(colorByColumns.length);

    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];

        toolItems = toolItems.concat(_this._getItemKeyTooltip(params, colorByColumns));
        if (params.data.minusValue) {
            params.value = params.value * -1;
        }

        if (sizeByColumns.length > 0 && sizeByColumns[0]) {
            toolItems.push(_optionUtils2.default.getColumnLabel(sizeByColumns[0]) + ' : ' + params.value);
        } else {
            toolItems.push('Count : ' + params.value);
        }
        toolItems.push('Percent : '.concat(params.percent, '%'));

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipPieDecorator.prototype._getItemKeyTooltip = function (params, keyColumns) {
    var keyItems = [];
    for (var i in keyColumns) {
        keyItems.push(_optionUtils2.default.getColumnLabel(keyColumns[i]) + ' : ' + params.data.keys[i]);
    }
    return keyItems;
};

exports.default = TooltipPieDecorator;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipYAxisDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipYAxisDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipYAxisDecorator.prototype.constructor = TooltipYAxisDecorator;

TooltipYAxisDecorator.prototype._getAxisNameTooltip = function (param, dataColumns) {
    var builder = this.builder;
    var name = param.value[1];

    if (builder._internalOptions().yAxis[0].type === 'value' || builder._internalOptions().yAxis[0].type === 'time') {
        if (typeof param.value === 'undefined') return;
        if (builder._internalOptions().yAxis[0].type === 'time') name = _optionUtils2.default.dateFormatString(name, 'yyyy-mm-dd HH:MM:ss');
        return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + name;
    } else {
        return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + name;
    }
};

TooltipYAxisDecorator.prototype._getAxisValueTooltip = function (param, dataColumns) {
    return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + param.value[0];
};

exports.default = TooltipYAxisDecorator;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* -----------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  axis-range-decorator.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  Created by hyunseok.oh@samsung.com on 2018-08-17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * ---------------------------------------------------- */

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _utils = __webpack_require__(47);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisRangeDecorator(builder, options) {
    _decorator2.default.call(this, builder, options);
}

AxisRangeDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisRangeDecorator.prototype.constructor = AxisRangeDecorator;

AxisRangeDecorator.prototype.decorate = function () {
    var _this = this;

    var mergeRange = function mergeRange(a, b) {
        var defaultTo = function defaultTo(x, y) {
            return (0, _utils.isUndefined)(x) ? y : x;
        };
        return {
            min: defaultTo(b.min, a.min),
            max: defaultTo(b.max, a.max)
        };
    };

    var mergeAxis = function mergeAxis(a, b, hasRange) {
        return (0, _utils.zip)(a, b).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            var opt = Object.assign({}, x, hasRange ? mergeRange(x, y) : y);
            if ((0, _utils.isUndefined)(opt.min)) {
                delete opt.min;
            }
            if ((0, _utils.isUndefined)(opt.max)) {
                delete opt.max;
            }
            return opt;
        });
    };

    var half = function half(x) {
        return parseInt(x / 2, 10);
    };

    var upperBound = function upperBound(a, d, cmp) {
        if ((0, _utils.isNull)(d) || (0, _utils.isUndefined)(d)) return undefined;
        var res = undefined;
        var l = 0;
        var r = a.length - 1;
        while (l <= r) {
            var m = half(l + r);
            if (cmp(a[m], d) <= 0) {
                l = m + 1;
                res = m;
            } else {
                r = m - 1;
            }
        }

        return res;
    };

    var lowerBound = function lowerBound(a, d, cmp) {
        if ((0, _utils.isNull)(d) || (0, _utils.isUndefined)(d)) return undefined;
        var res = undefined;
        var l = 0;
        var r = a.length - 1;
        while (l <= r) {
            var m = half(l + r);
            if (cmp(a[m], d) >= 0) {
                r = m - 1;
                res = m;
            } else {
                l = m + 1;
            }
        }
        return res;
    };

    var toNumber = function toNumber(x) {
        return x ? Number(x) : x;
    };

    var convertByAxisType = function convertByAxisType(ea, ba) {
        var each = function each(e, b) {
            if (e.type !== 'category') {
                if (e.type === 'value') return { min: toNumber(b.min), max: toNumber(b.max) };
                return { min: b.min, max: b.max };
            }
            var sortRule = _this._getSortRule(e.selected);
            return {
                min: lowerBound(e.data, b.min, sortRule),
                max: upperBound(e.data, b.max, sortRule)
            };
        };
        return (0, _utils.zip)(ea, ba).map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                e = _ref4[0],
                b = _ref4[1];

            return each(e, b);
        });
    };

    var hasRange = ['line', 'scatter'].indexOf(this.bOptions.chart.type) >= 0;
    var clearRange = function clearRange(_) {
        return { min: undefined, max: undefined };
    };

    ['xAxis', 'yAxis'].forEach(function (axis) {
        if (_this.eOptions[axis]) {
            _this.eOptions[axis] = mergeAxis(_this.eOptions[axis], hasRange ? convertByAxisType(_this.eOptions[axis], _this.bOptions[axis]) : (0, _utils.range)(_this.bOptions[axis].length).map(clearRange), hasRange);
        }
    });
};

AxisRangeDecorator.prototype._getSortRule = function (target) {
    var builder = this.builder;
    var axisType = builder._getColumnDataType(builder.filterNullColumn(target));
    var sortRule = function sortRule(a, b) {
        var comp;
        if (axisType === 'category') comp = _optionUtils2.default.stringSortRule(a, b);else if (axisType === 'time') comp = _optionUtils2.default.timeSortRule(a, b);else comp = _optionUtils2.default.numericSortRule(a * 1, b * 1);

        return comp;
    };
    return sortRule;
};

exports.default = AxisRangeDecorator;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsPointByrowindexExtractor = __webpack_require__(48);

var _echartsPointByrowindexExtractor2 = _interopRequireDefault(_echartsPointByrowindexExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsScatterByRowIndexOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsScatterByRowIndexOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsScatterByRowIndexOptionBuilder.prototype.constructor = EChartsScatterByRowIndexOptionBuilder;

EChartsScatterByRowIndexOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine'];
    this._registerDecorator('axisTypeByRowIndex');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipByRowIndex');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsScatterByRowIndexOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData();
    var keyIndexes = this.getSeriesKeyColumnIndexes();
    var yAxisSelected = this.filterNullColumn(this.bOptions.yAxis[0].selected);

    var i, row, seriesName, seriesItem, yAxisIndex, seriesNameList;

    for (i in localData.data) {
        row = localData.data[i];

        for (yAxisIndex = 0; yAxisIndex < yAxisSelected.length; yAxisIndex++) {

            seriesNameList = [];
            seriesNameList.push(yAxisSelected[yAxisIndex].name);
            seriesNameList.push(this.getSeriesName(row, keyIndexes));
            seriesName = seriesNameList.join(' ');

            seriesItem = this._getSeriesItem(series, seriesName);
            series[seriesName] = seriesItem;

            if (!seriesItem.extractor) {
                seriesItem.extractor = this._newSeriesExtractor(yAxisIndex);
                seriesItem.extractor.keys = this.getCellText(yAxisSelected[yAxisIndex].name, row, keyIndexes);
                seriesItem.keys = seriesItem.extractor.keys;
            }
            seriesItem.extractor.push(row, i);
        }
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsScatterByRowIndexOptionBuilder.prototype.getCellText = function (row, columnIndexes, colName) {
    var values = [];
    if (colName) {
        values.push(colName);
    }
    for (var i in columnIndexes) {
        var idx = columnIndexes[i];
        if (row[idx] || row[idx] === 0) {
            if ($.isArray(row[idx])) {
                values.push(row[idx]);
            } else {
                values.push('' + row[idx]);
            }
        } else {
            values.push('(empty)');
        }
    }
    return values;
};

EChartsScatterByRowIndexOptionBuilder.prototype._newSeriesExtractor = function (yAxisIndex) {
    var localData = this.getLocalData();
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointByrowindexExtractor2.default();

    extractor.setTarget({
        index: [yIndexes[yAxisIndex]],
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsScatterByRowIndexOptionBuilder.prototype.hasLegendData = function () {
    return true;
};

exports.default = EChartsScatterByRowIndexOptionBuilder;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.donut = exports.map = exports.treemap = exports.table = exports.scatter = exports.roccurve = exports.qqplot = exports.pie = exports.pairwiseScatter = exports.network = exports.line = exports.histogram = exports.heatmapMatrix = exports.heatmap = exports.dendrogram = exports.decisiontree = exports.complex = exports.columnStacked100 = exports.columnStacked = exports.column = exports.card = exports.bubble = exports.boxplot = exports.biplot = exports.barStacked100 = exports.barStacked = exports.bar = exports.areaStacked100 = exports.areaStacked = exports.area = undefined;

var _bchartArea = __webpack_require__(63);

var _bchartArea2 = _interopRequireDefault(_bchartArea);

var _bchartAreaStacked = __webpack_require__(166);

var _bchartAreaStacked2 = _interopRequireDefault(_bchartAreaStacked);

var _bchartAreaStacked3 = __webpack_require__(314);

var _bchartAreaStacked4 = _interopRequireDefault(_bchartAreaStacked3);

var _bchartBar = __webpack_require__(167);

var _bchartBar2 = _interopRequireDefault(_bchartBar);

var _bchartBarStacked = __webpack_require__(168);

var _bchartBarStacked2 = _interopRequireDefault(_bchartBarStacked);

var _bchartBarStacked3 = __webpack_require__(315);

var _bchartBarStacked4 = _interopRequireDefault(_bchartBarStacked3);

var _bchartBiplot = __webpack_require__(316);

var _bchartBiplot2 = _interopRequireDefault(_bchartBiplot);

var _bchartBoxplot = __webpack_require__(317);

var _bchartBoxplot2 = _interopRequireDefault(_bchartBoxplot);

var _bchartBubble = __webpack_require__(318);

var _bchartBubble2 = _interopRequireDefault(_bchartBubble);

var _bchartCard = __webpack_require__(319);

var _bchartCard2 = _interopRequireDefault(_bchartCard);

var _bchartColumn = __webpack_require__(55);

var _bchartColumn2 = _interopRequireDefault(_bchartColumn);

var _bchartColumnStacked = __webpack_require__(169);

var _bchartColumnStacked2 = _interopRequireDefault(_bchartColumnStacked);

var _bchartColumnStacked3 = __webpack_require__(320);

var _bchartColumnStacked4 = _interopRequireDefault(_bchartColumnStacked3);

var _bchartComplex = __webpack_require__(321);

var _bchartComplex2 = _interopRequireDefault(_bchartComplex);

var _bchartDecisiontree = __webpack_require__(322);

var _bchartDecisiontree2 = _interopRequireDefault(_bchartDecisiontree);

var _bchartDendrogram = __webpack_require__(323);

var _bchartDendrogram2 = _interopRequireDefault(_bchartDendrogram);

var _bchartHeatmap = __webpack_require__(170);

var _bchartHeatmap2 = _interopRequireDefault(_bchartHeatmap);

var _bchartHeatmapMatrix = __webpack_require__(324);

var _bchartHeatmapMatrix2 = _interopRequireDefault(_bchartHeatmapMatrix);

var _bchartHistogram = __webpack_require__(325);

var _bchartHistogram2 = _interopRequireDefault(_bchartHistogram);

var _bchartLine = __webpack_require__(326);

var _bchartLine2 = _interopRequireDefault(_bchartLine);

var _bchartNetwork = __webpack_require__(327);

var _bchartNetwork2 = _interopRequireDefault(_bchartNetwork);

var _bchartPairwiseScatter = __webpack_require__(328);

var _bchartPairwiseScatter2 = _interopRequireDefault(_bchartPairwiseScatter);

var _bchartPie = __webpack_require__(171);

var _bchartPie2 = _interopRequireDefault(_bchartPie);

var _bchartQqplot = __webpack_require__(329);

var _bchartQqplot2 = _interopRequireDefault(_bchartQqplot);

var _bchartRadar = __webpack_require__(330);

var _bchartRadar2 = _interopRequireDefault(_bchartRadar);

var _bchartRoccurve = __webpack_require__(331);

var _bchartRoccurve2 = _interopRequireDefault(_bchartRoccurve);

var _bchartScatter = __webpack_require__(332);

var _bchartScatter2 = _interopRequireDefault(_bchartScatter);

var _bchartScattermap = __webpack_require__(333);

var _bchartScattermap2 = _interopRequireDefault(_bchartScattermap);

var _bchartTable = __webpack_require__(334);

var _bchartTable2 = _interopRequireDefault(_bchartTable);

var _bchartTreemap = __webpack_require__(335);

var _bchartTreemap2 = _interopRequireDefault(_bchartTreemap);

var _bchartMap = __webpack_require__(336);

var _bchartMap2 = _interopRequireDefault(_bchartMap);

var _bchartDonut = __webpack_require__(337);

var _bchartDonut2 = _interopRequireDefault(_bchartDonut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-03-14.
 */

exports.area = _bchartArea2.default;
exports.areaStacked = _bchartAreaStacked2.default;
exports.areaStacked100 = _bchartAreaStacked4.default;
exports.bar = _bchartBar2.default;
exports.barStacked = _bchartBarStacked2.default;
exports.barStacked100 = _bchartBarStacked4.default;
exports.biplot = _bchartBiplot2.default;
exports.boxplot = _bchartBoxplot2.default;
exports.bubble = _bchartBubble2.default;
exports.card = _bchartCard2.default;
exports.column = _bchartColumn2.default;
exports.columnStacked = _bchartColumnStacked2.default;
exports.columnStacked100 = _bchartColumnStacked4.default;
exports.complex = _bchartComplex2.default;
exports.decisiontree = _bchartDecisiontree2.default;
exports.dendrogram = _bchartDendrogram2.default;
exports.heatmap = _bchartHeatmap2.default;
exports.heatmapMatrix = _bchartHeatmapMatrix2.default;
exports.histogram = _bchartHistogram2.default;
exports.line = _bchartLine2.default;
exports.network = _bchartNetwork2.default;
exports.pairwiseScatter = _bchartPairwiseScatter2.default;
exports.pie = _bchartPie2.default;
exports.qqplot = _bchartQqplot2.default;
exports.roccurve = _bchartRoccurve2.default;
exports.scatter = _bchartScatter2.default;
exports.table = _bchartTable2.default;
exports.treemap = _bchartTreemap2.default;
exports.map = _bchartMap2.default;
exports.donut = _bchartDonut2.default;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by SDS on 2017-05-10.
 */
exports.default = {
    selectableColumnType: ['string', 'number', 'date'],
    selectableColumnInternalType: ['string', 'boolean', 'double', 'integer', 'long'],
    Problems: {
        'datasource-001': {
            message: 'There is no datasource.'
        },
        'datasource-002': {
            message: 'There is no chart data.'
        },
        'datasource-002-01': {
            message: 'There is no chart data [{0}].'
        },
        'datasource-003': {
            message: 'There is no column.'
        },
        'datasource-003-01': {
            message: 'There is no column [{0}].'
        },
        'axis-001': {
            message: '{0} Column is required.'
        },
        // 'axis-002': {
        //     message: '{0} Column does not allow number type.'
        // },
        // 'axis-003': {
        //     message: '{0} Column allows only number type.'
        // },
        'axis-004': {
            message: '{0} : {1} Column does not exist!'
        },
        'axis-005': {
            message: '{0} Column allows only [{1}] type.'
        },
        'value-001': {
            message: '{0}: [{1}] must be less than [{2}].'
        },
        'value-002': {
            message: '{0}: [{1}] must be greater than [{2}].'
        },
        'value-003': {
            message: '{0}: [{1}] must be less than or equal to [{2}].'
        },
        'value-004': {
            message: '{0}: [{1}] must be greater than or equal to [{2}].'
        },
        'value-005': {
            message: '{0} is required.'
        }
    }
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsLineOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsLineOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsLineOptionBuilder.prototype.constructor = EChartsLineOptionBuilder;

EChartsLineOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltip');
    this._registerDecorator('marker');
    this._registerDecorator('lineStyle');
    this._registerDecorator('plotOptions');
    this._registerDecorator('lineBy');
    this._registerDecorator('axisRange');
    this._setSeriesDataSortRule();
    this._registerDecorator('brush');
    this.setSeriesSubKeyColumns(this.plotOptions.lineBy[0].selected);
    this.setSeriesKeyColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsLineOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    return this.getSeriesKeyColumns(dataIndex).concat(this.getSeriesSubKeyColumns(dataIndex));
};

EChartsLineOptionBuilder.prototype.setSeriesSubKeyColumns = function (columns, dataIndex) {
    dataIndex = dataIndex || 0;
    columns = this.filterNullColumn(columns);
    this._seriesSubKeyColumsList = this._seriesSubKeyColumsList || [];
    this._seriesSubKeyColumsList[dataIndex] = this._seriesSubKeyColumsList[dataIndex] || [];
    this._seriesSubKeyColumsList[dataIndex] = this._seriesSubKeyColumsList[dataIndex].concat(columns);
};

EChartsLineOptionBuilder.prototype.getSeriesSubKeyColumns = function (dataIndex) {
    dataIndex = dataIndex || 0;
    this._seriesSubKeyColumsList = this._seriesSubKeyColumsList || [];
    return this._seriesSubKeyColumsList[dataIndex] || [];
};

EChartsLineOptionBuilder.prototype.getSeriesSubKeyColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getSeriesSubKeyColumns(dataIndex);
    return this.getColumnIndexes(keyColumns, localData.columns);
};

EChartsLineOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData();
    var keyIndexes = this.getSeriesKeyColumnIndexes();
    var subKeyIndexes = this.getSeriesSubKeyColumnIndexes();
    var allKeyIndexes = keyIndexes.concat(subKeyIndexes);
    var yAxisSelected = this.filterNullColumn(this.bOptions.yAxis[0].selected);
    var xAxisName = _optionUtils2.default.getColumnLabel(this.bOptions.xAxis[0].selected[0]);
    var isMultiAxis = yAxisSelected.length > 1 ? true : false;

    var i, row, seriesName, seriesItem, yAxisIndex, seriesNameList, seriesNameList, seriesKey, seriesKeyList, yAxisName, multiSeriesMap;

    for (i in localData.data) {
        row = localData.data[i];
        multiSeriesMap = {};

        for (yAxisIndex = 0; yAxisIndex < yAxisSelected.length; yAxisIndex++) {
            seriesNameList = [];
            yAxisName = _optionUtils2.default.getColumnLabel(yAxisSelected[yAxisIndex]);
            if (isMultiAxis) {
                seriesNameList = this.getCellText(row, keyIndexes, yAxisName);
                seriesKeyList = this.getCellText(row, allKeyIndexes, yAxisName);
            } else {
                seriesNameList = this.getCellText(row, keyIndexes);
                seriesKeyList = this.getCellText(row, allKeyIndexes);
            }

            if (multiSeriesMap[yAxisName]) continue;

            seriesName = seriesNameList.join(' ');
            seriesKey = seriesKeyList.join(' ');
            seriesItem = this._getSeriesItem(series, seriesKey);
            series[seriesKey] = seriesItem;

            if (!seriesItem.extractor) {
                seriesItem.extractor = this._newSeriesExtractor({
                    yAxisIndex: yAxisIndex
                });
                seriesItem.extractor.keys = seriesKeyList;
                seriesItem.name = seriesName;
                seriesItem.keys = seriesItem.extractor.keys;

                seriesItem.tooltipHeaders = [xAxisName, yAxisName];
            }
            seriesItem.extractor.push(row, i);
            multiSeriesMap[yAxisName] = true;
        }
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

exports.default = EChartsLineOptionBuilder;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.range = range;
exports.zip = zip;
exports.isUndefined = isUndefined;
exports.negate = negate;
exports.compact = compact;
exports.first = first;
exports.isNull = isNull;
/* -----------------------------------------------------
 *  utils.js
 *  Created by hyunseok.oh@samsung.com on 2018-08-17.
 * ---------------------------------------------------- */

function _range(from, to) {
    var res = [];
    for (var i = from; i < to; ++i) {
        res.push(i);
    }
    return res;
}

function range(a, b) {
    if (arguments.length > 1) return _range(a, b);
    return _range(0, a);
}

function zip(a, b) {
    return range(parseInt(Math.max(a.length, b.length))).map(function (i) {
        return [a[i], b[i]];
    });
}

function isUndefined(a) {
    return typeof a === 'undefined';
}

function negate(a) {
    return function () {
        return !a.apply(undefined, arguments);
    };
}

function compact(a) {
    return a.filter(negate(isUndefined));
}

function first(a) {
    return a[0];
}

function isNull(a) {
    return !a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object';
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsExtractor = __webpack_require__(29);

var _echartsExtractor2 = _interopRequireDefault(_echartsExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PointByRowIndexDataExtractor() {
    _echartsExtractor2.default.call(this);
    this._points = [];
}

PointByRowIndexDataExtractor.prototype = Object.create(_echartsExtractor2.default.prototype);
PointByRowIndexDataExtractor.prototype.constructor = PointByRowIndexDataExtractor;

PointByRowIndexDataExtractor.prototype.push = function (row, rowIndex) {
    rowIndex = parseInt(rowIndex);
    var columnIndices = this._columnIndices[0].filter(function (columnIdx) {
        return columnIdx != -1;
    });

    for (var i = 0; i < columnIndices.length; i++) {
        var pointData = {
            value: [],
            categoryIndex: columnIndices[i],
            dataIndexes: [rowIndex]
        };

        pointData.value = [rowIndex, row[columnIndices[i]]];
        this._points.push(pointData);
    }
};

PointByRowIndexDataExtractor.prototype.extract = function () {
    return this._points;
};

exports.default = PointByRowIndexDataExtractor;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAxisTypeWithCategoryKeyOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsAxisTypeWithCategoryKeyOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsAxisTypeWithCategoryKeyOptionBuilder.prototype.constructor = EChartsAxisTypeWithCategoryKeyOptionBuilder;

EChartsAxisTypeWithCategoryKeyOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var dataColumns = this.getSeriesDataColumns();
    var aggregation = dataColumns[1].aggregation;
    var hasAggregation = aggregation && aggregation !== 'none';
    var xIndexes = this.getColumnIndexes(this.bOptions.xAxis[0].selected, localData.columns);
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    if (hasAggregation) {
        extractor.setExtractOperator(function (pointObject) {
            var operator = new _aggregationOperator2.default(pointObject.value);
            for (var i = 0; i < pointObject.indexList.length; i++) {
                operator.add(pointObject.indexList[i], pointObject.point[i][1]);
            }
            return [{ value: pointObject.value.concat(operator.calc(aggregation)), dataIndexes: pointObject.indexList }];
        });
    }
    return extractor;
};
exports.default = EChartsAxisTypeWithCategoryKeyOptionBuilder;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeWithCategorykeyCalculatedOptionBuilder = __webpack_require__(242);

var _echartsAxisTypeWithCategorykeyCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeWithCategorykeyCalculatedOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaCalculatedOptionBuilder() {
    _echartsAxisTypeWithCategorykeyCalculatedOptionBuilder2.default.call(this);
}

EChartsAreaCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeWithCategorykeyCalculatedOptionBuilder2.default.prototype);
EChartsAreaCalculatedOptionBuilder.prototype.constructor = EChartsAreaCalculatedOptionBuilder;

EChartsAreaCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'areaStyle', 'sampling', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('xAxisBoundaryGapFalse');
    this._registerDecorator('fillXCategoryValues');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._setSeriesDataSortRule();
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsAreaCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'line';
    seriesItem.areaStyle = {
        normal: {}
    };
    return seriesItem;
};

EChartsAreaCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var keyColumns = this.filterNullColumn(this.bOptions.colorBy[0].selected);
    if (keyColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsAreaCalculatedOptionBuilder;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarCalculatedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsBarCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsBarCalculatedOptionBuilder.prototype.constructor = EChartsBarCalculatedOptionBuilder;

EChartsBarCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeWithCategoryY');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipItemCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('brush');
    this._registerDecorator('axisLineOnZeroTrue');
    this._registerDecorator('xAxisMin0', { aggr: ['count'] });
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsBarCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'category',
        isKey: true
    });

    return extractor;
};

EChartsBarCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var keyColumns = this.filterNullColumn(this.bOptions.colorBy[0].selected);
    if (keyColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsBarCalculatedOptionBuilder;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsScatterCalculatedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsScatterCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsScatterCalculatedOptionBuilder.prototype.constructor = EChartsScatterCalculatedOptionBuilder;

EChartsScatterCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipItemCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsScatterCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var keyColumns = this.filterNullColumn(this.bOptions.colorBy[0].selected);
    if (keyColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsScatterCalculatedOptionBuilder;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _echartsScatterOptionBuilder = __webpack_require__(155);

var _echartsScatterOptionBuilder2 = _interopRequireDefault(_echartsScatterOptionBuilder);

var _echartsScatterBycolumnnamesOptionBuilder = __webpack_require__(156);

var _echartsScatterBycolumnnamesOptionBuilder2 = _interopRequireDefault(_echartsScatterBycolumnnamesOptionBuilder);

var _echartsScatterByrowindexOptionBuilder = __webpack_require__(43);

var _echartsScatterByrowindexOptionBuilder2 = _interopRequireDefault(_echartsScatterByrowindexOptionBuilder);

var _echartsScatterCalculatedOptionBuilder = __webpack_require__(52);

var _echartsScatterCalculatedOptionBuilder2 = _interopRequireDefault(_echartsScatterCalculatedOptionBuilder);

var _echartsScatterComplexOptionBuilder = __webpack_require__(157);

var _echartsScatterComplexOptionBuilder2 = _interopRequireDefault(_echartsScatterComplexOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsScatter
 * @param parentId
 * @param options
 * @constructor
 */
function EChartsScatter(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Source: echarts-scatter.js
   * Created by daewon.park on 2017-03-23.
   */


EChartsScatter.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsScatter.prototype.constructor = EChartsScatter;

EChartsScatter.prototype.render = function () {

    this.seriesHelper = this.getSeriesHelper();

    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsScatter.prototype._getSelectionFromArea = function (batchArea) {
    var _this = this;
    var xAxis = this._getEChartOption().xAxis[0];
    if (xAxis.axisType === 'byColumnNames') {
        var selection = [];
        var yAxis = this._getEChartOption().yAxis[0];
        for (var columnIdx = batchArea.coordRange[0][0]; columnIdx < batchArea.coordRange[0][1] + 1; columnIdx++) {
            var columnName = xAxis.data[columnIdx];
            var selectionItem = {};
            selectionItem[columnName] = _this._convertToSelection(yAxis, columnName, batchArea.coordRange[1]);
            selection.push(selectionItem);
        }
        return selection;
    } else {
        return _echartsWrapper2.default.prototype._getSelectionFromArea.call(this, batchArea);
    }
};

EChartsScatter.prototype.getSeriesHelper = function () {
    if (this.isComplex) {
        return new _echartsScatterComplexOptionBuilder2.default();
    } else if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsScatterCalculatedOptionBuilder2.default();
    }

    var xAxisType = _optionUtils2.default.getXAxisType(this.options);
    if (xAxisType === 'byColumnNames') {
        return new _echartsScatterBycolumnnamesOptionBuilder2.default();
    } else if (xAxisType === 'byRowIndex') {
        return new _echartsScatterByrowindexOptionBuilder2.default();
    } else {
        return new _echartsScatterOptionBuilder2.default();
    }
};

exports.default = EChartsScatter;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d3SeriesExtractor = __webpack_require__(160);

var _d3SeriesExtractor2 = _interopRequireDefault(_d3SeriesExtractor);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-03-19.
 */
/**
 * X 축의 값이 value, Y 축의 값이 aggregation 된 형태의 Series Data 를 생성
 * @param columnIndexes
 * @constructor
 */

function AggregationDataExtractor(columnIndexes) {
    _d3SeriesExtractor2.default.call(this, columnIndexes);
    this.operators = {};
    this.categories = [];
}

AggregationDataExtractor.prototype = Object.create(_d3SeriesExtractor2.default.prototype);
AggregationDataExtractor.prototype.constructor = AggregationDataExtractor;

AggregationDataExtractor.prototype.push = function (row, rowIndex) {
    var x = row[this.columnIndexes[0]];
    var y = row[this.columnIndexes[1]];
    var operator = this.operators[x];
    if (!operator) {
        operator = new _aggregationOperator2.default(x);
        this.operators[x] = operator;
        this.categories.push(x);
    }
    operator.add(rowIndex, y);
};

AggregationDataExtractor.prototype.getCategories = function () {
    return this.categories;
};

AggregationDataExtractor.prototype.extract = function (operator) {
    var answer = [];
    for (var i in this.operators) {
        var pointData = {
            value: [this.operators[i].x, this.operators[i].calc(operator)],
            dataIndexes: this.operators[i].dataIndexes // point 에 해당하는 원본 데이터 인덱스
        };
        answer.push(pointData);
    }
    return answer;
};

exports.default = AggregationDataExtractor;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-column.js
 * Created by daewon.park on 2017-03-29.
 */
function BColumnCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BColumnCharts.prototype = Object.create(_bchartBase2.default.prototype);
BColumnCharts.prototype.constructor = BColumnCharts;

BColumnCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BColumnCharts.Attr.Key, this.$parent, this.options);
};

//todo: 2017 pvr zoom 라이브러리 버그(filter mode)로 인한 줌기능 제거
BColumnCharts.Attr = {
    Key: 'column',
    Label: 'Column',
    Order: 10,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                brush: {},
                zoom: { zoomAxis: 'xAxis' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            column: {
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                tooltip: { trigger: 'item' }
            }
        }
    })
};

exports.default = BColumnCharts;

/***/ }),
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartRegister = __webpack_require__(26);

var ChartRegistry = _interopRequireWildcard(_bchartRegister);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function BCharts(parentId, options) {
    //if chart type is not registered in Brightics.Chart.Registry, set 'table' chart.
    options.chart.type = ChartRegistry.getChartAttr(options.chart.type) ? options.chart.type : 'table';

    var optionsClone = $.extend(true, {}, options);

    optionsClone = _chartUtils2.default.extendChartOptionsWithDefaultOptions(optionsClone, ChartRegistry.getChartAttr(options.chart.type).DefaultOptions);

    _widget2.default.call(this, parentId, optionsClone);

    this._registerAPI();
    this._createBrushSelectedHandler();
    this._createParentBrushSelectedHandler();
} /**
   * Source: bcharts.js
   * Created by daewon.park on 2017-03-22.
   */

BCharts.prototype = Object.create(_widget2.default.prototype);
BCharts.prototype.constructor = BCharts;

BCharts.prototype.destroy = function () {
    this.disconnect();

    if (this.chart) {
        this.chart.destroy();
    }
};

BCharts.prototype._createContents = function ($parent) {
    var _this = this;
    this.$mainControl = $('<div class="bcharts-container"></div>');
    $parent.append(this.$mainControl);

    _this._bcharts_instance = 'bc_' + Date.now();
    this.$mainControl.attr('_bcharts_instance_', _this._bcharts_instance);

    this._applyChartStyle();

    this.$mainControl.bind('brushSelected', function (eventType, eventData) {
        if (_this.group) {
            eventData._bcharts_instance = _this._bcharts_instance;
            $('body').trigger('bcharts-group:brushSelected[group=' + _this.group + ']', eventData);
        }
    });

    this.chart = new ChartRegistry.createChart(this.options.chart.type, this.$mainControl, this.options);
};

BCharts.prototype._applyChartStyle = function () {
    var styles = ['background', 'border', 'padding', 'width', 'height', 'borderRadius'];
    for (var i in styles) {
        if (typeof this.options.chart[styles[i]] !== 'undefined') this.$mainControl.css(styles[i], this.options.chart[styles[i]]);
    }
};

BCharts.prototype.getOptions = function () {
    return this.options;
};

BCharts.prototype.setOptions = function (options) {
    if (options.chart && options.chart.type && options.chart.type !== this.options.chart.type) {
        var filter = this.chart.getFilter();
        this.chart.destroy();
        this.$mainControl.empty();
        $.extend(true, this.options, options);
        this.options = _chartUtils2.default.extendChartOptionsWithDefaultOptions(this.options, ChartRegistry.getChartAttr(options.chart.type).DefaultOptions);
        this.chart = new ChartRegistry.createChart(this.options.chart.type, this.$mainControl, this.options);
        this.chart.setFilter(filter);
    } else {
        var optionsClone = $.extend(true, {}, options);
        optionsClone = _chartUtils2.default.deleteNullOrUndefinedOptions(optionsClone, ChartRegistry.getChartAttr(this.options.chart.type).DefaultOptions);
        this.chart.setOptions(optionsClone);
    }
    this._applyChartStyle();
};

BCharts.prototype.reloadColumnConf = function (options) {
    this.chart._reloadColumnConf();
};

BCharts.prototype.render = function (reload) {
    if (this.chart) {
        this.chart.render(reload);
    }
};

BCharts.prototype.getDataURL = function (options) {
    if (this.chart && typeof this.chart.getDataURL === 'function') {
        return this.chart.getDataURL(options);
    }
};

BCharts.prototype.getGroup = function () {
    return this.group;
};

BCharts.prototype.setGroup = function (group) {
    this.group = group;
};

BCharts.prototype.connect = function (group) {
    this.disconnect();
    this.group = group;

    $('body').bind('bcharts-group:brushSelected[group=' + this.group + ']', this._brushSelectedHandler);

    var idx = this.group.lastIndexOf('/');
    if (idx > -1) {
        var parentGroup = this.group.substring(0, idx);
        $('body').bind('bcharts-group:brushSelected[group=' + parentGroup + ']', this._parentBrushSelectedHandler);
        this.chart.initFilter([]);
    }
};

BCharts.prototype.getSelectedRange = function () {
    if (this.chart) {
        return this.chart.getSelectedRange() || [];
    }
};

BCharts.prototype._createBrushSelectedHandler = function () {
    this._brushSelectedHandler = function (eventType, eventData) {
        if (eventData._bcharts_instance !== this._bcharts_instance) {
            if (this.chart) {
                this.chart.selectRange(eventData);
            }
        }
    }.bind(this);
};
BCharts.prototype._createParentBrushSelectedHandler = function () {
    this._parentBrushSelectedHandler = function (eventType, eventData) {
        if (eventData._bcharts_instance !== this._bcharts_instance) {
            if (this.chart) {
                var selected = eventData.selected || [];
                this.chart.setFilter(selected);
            }
        }
    }.bind(this);
};

BCharts.prototype.disconnect = function () {
    if (this.group) {
        $('body').unbind('bcharts-group:brushSelected[group=' + this.group + ']', this._brushSelectedHandler);

        var idx = this.group.lastIndexOf('/');
        if (idx > -1) {
            var parentGroup = this.group.substring(0, idx);
            $('body').unbind('bcharts-group:brushSelected[group=' + parentGroup + ']', this._parentBrushSelectedHandler);
        }

        this.group = null;
    }
};

BCharts.prototype.getFilter = function () {
    if (this.chart) {
        return this.chart.getFilter();
    }
};

BCharts.prototype.setFilter = function (filter) {
    if (this.chart) {
        this.chart.setFilter(filter);
    }
};

BCharts.prototype._registerAPI = function () {
    if (this.chart) {
        this.setBrushType = this.chart.setBrushType;
        this.zoom = this.chart.zoom;
        this.resetZoom = this.chart.resetZoom;
        this.dispatchAction = this.chart.dispatchAction;
        this.setBrushStyle = this.chart.setBrushStyle;
        this.onBrush = this.chart.onBrush;
        this.offBrush = this.chart.offBrush;
        this.onBrushSelected = this.chart.onBrushSelected;
        this.offBrushSelected = this.chart.offBrushSelected;
        this.onCellPointClick = this.chart.onCellPointClick;
        this.offCellPointClick = this.chart.offCellPointClick;
    }
};

exports.default = BCharts;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-area.js
 * Created by daewon.park on 2017-03-28.
 */

function BAreaCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BAreaCharts.prototype = Object.create(_bchartBase2.default.prototype);
BAreaCharts.prototype.constructor = BAreaCharts;

BAreaCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BAreaCharts.Attr.Key, this.$parent, this.options);
};

BAreaCharts.Attr = {
    Key: 'area',
    Label: 'Area',
    Order: 30,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        // toolbar 추가함
        toolbar: {
            show: true,
            menu: {
                // brush: {},
                zoom: { zoomAxis: 'xAxis' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            area: {
                smooth: true,
                marker: _defaultOptions2.default.Marker,
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                tooltip: { trigger: 'axis' }
            }
        }
    })
};

exports.default = BAreaCharts;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by sds on 2018-03-05.
 */
// import Error;

var _super = Error;

function BaseError(message) {
    _super.constructor.call(this);
    // this.name = 'BaseError';
    this.message = message || '';
    this.stack = _super.stack;
}

BaseError.prototype = Object.create(_super);
BaseError.prototype.constructor = BaseError;

exports.default = BaseError;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

var _chartValidatorRegister = __webpack_require__(67);

var ChartValidatorRegister = _interopRequireWildcard(_chartValidatorRegister);

var _bchartRegister = __webpack_require__(26);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ChartValidator(options) {
    if ((0, _bchartRegister.isRegisteredChart)(options.chart.type)) {
        this.chartValidator = ChartValidatorRegister.createChartValidator(options.chart.type, options);
    } else {
        console.warn('[' + options.chart.type + '] validator is not yet developed');
        this.chartValidator = new _chartValidatorBase2.default(options);
    }
} /**
   * Created by SDS on 2017-05-10.
   */


ChartValidator.prototype.doValidate = function () {
    this.chartValidator.validate();
    return this.chartValidator.problemList;
};

ChartValidator.prototype.getWarning = function () {
    return this.chartValidator.warningList;
};

exports.default = ChartValidator;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartRegister = __webpack_require__(26);

var ChartRegister = _interopRequireWildcard(_bchartRegister);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * options = {
     *      type: 'scatter'
     *  }
 * @param options
 * @constructor
 */
/**
 * Source: column-helper.js
 * Created by ng.kim on 2017-06-07.
 */
function ColumnHelper(options) {
    this.options = options;
}

ColumnHelper.prototype.getColumnConf = function () {
    var chartType = this.options.type;
    if (this.options.columnConf && this.options.columnConf[chartType]) {
        var defaultColumnConf = $.extend(true, {}, ChartRegister.getChartAttr(chartType).ColumnConf);
        _chartUtils2.default.assignArray(defaultColumnConf, this.options.columnConf[chartType]);
        return defaultColumnConf;
    } else {
        return ChartRegister.getChartAttr(chartType).ColumnConf;
    }
};

exports.default = ColumnHelper;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerChartValidator = registerChartValidator;
exports.getChartValidator = getChartValidator;
exports.createChartValidator = createChartValidator;

var _bchartIndex = __webpack_require__(44);

var Charts = _interopRequireWildcard(_bchartIndex);

var _chartValidatorIndex = __webpack_require__(206);

var Validator = _interopRequireWildcard(_chartValidatorIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Created by sds on 2017-12-19.
 */

var chartValidator = {};

//private
function _init() {
    var chartTypeList = Object.keys(Charts);
    chartTypeList.forEach(function (chartType) {
        chartValidator[Charts[chartType].Attr.Key] = Validator[chartType];
    });
}

exports.default = chartValidator;
function registerChartValidator(option) {
    if ($.isEmptyObject(chartValidator)) {
        console.log('chart validator register is empty.');
        _init();
    }
    chartValidator[option.Key] = option.Func;
}

function getChartValidator(chartType) {
    return chartValidator[chartType];
}

function createChartValidator(chartType, options) {
    if ($.isEmptyObject(chartValidator)) {
        _init();
    }
    if (!chartValidator[chartType] || !options) {
        throw new Error('Cannot create chart validator. ' + chartType);
    }
    return new chartValidator[chartType](options);
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AreaStackedChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


AreaStackedChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
AreaStackedChartValidator.prototype.constructor = AreaStackedChartValidator;

AreaStackedChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }, {
        key: 'stackBy'
    }];
};

AreaStackedChartValidator.prototype.validateStripLineType = function (dataIdx) {
    this._createWarning('axis-001', ['X-axis'], {
        target: 'xAxis'
    });
};

exports.default = AreaStackedChartValidator;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BarStackedChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


BarStackedChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
BarStackedChartValidator.prototype.constructor = BarStackedChartValidator;

BarStackedChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }, {
        key: 'stackBy'
    }];
};

BarStackedChartValidator.prototype.validateStripLineType = function (dataIdx) {
    this._createWarning('axis-001', ['Y-axis'], {
        target: 'yAxis'
    });
};

BarStackedChartValidator.prototype.validateScale = function (dataIdx) {
    this._createWarning('axis-002', ['Y-axis'], {
        target: 'yaxis'
    });
};

exports.default = BarStackedChartValidator;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ColumnStackedChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


ColumnStackedChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
ColumnStackedChartValidator.prototype.constructor = ColumnStackedChartValidator;

ColumnStackedChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }, {
        key: 'stackBy'
    }];
};
ColumnStackedChartValidator.prototype.validateStripLineType = function (dataIdx) {
    this._createWarning('axis-001', ['X-axis'], {
        target: 'xAxis'
    });
};

ColumnStackedChartValidator.prototype.validateScale = function (dataIdx) {
    this._createWarning('axis-002', ['X-axis'], {
        target: 'xaxis'
    });
};

exports.default = ColumnStackedChartValidator;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Title = undefined;

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param parentId
 * @param options {  }
 * @constructor
 */
function Title(parentId, options) {
    _widget2.default.call(this, parentId, options);
} /**
   * Source: title.js
   * Created by daewon.park on 2017-04-07.
   */


Title.prototype = Object.create(_widget2.default.prototype);
Title.prototype.constructor = Title;

Title.prototype.destroy = function () {
    if (this.resizeHandler) {
        $(window).off('resize', this.resizeHandler);
        this.resizeHandler = null;
    }
};

Title.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-title"></div>');
    $parent.append(this.$mainControl);

    var _this = this;
    this.resizeHandler = function () {
        _this.redrawLayout();
    };
    $(window).resize(this.resizeHandler);
};

Title.prototype.redrawLayout = function () {
    var _this = this;

    clearTimeout(this._redrawLayoutJob);
    this._redrawLayoutJob = setTimeout(function () {
        _this._adjustLayout();
    }, 300);
};

Title.prototype._getDataValue = function (valueIndex, localData) {
    if (typeof this.getOptions().value === 'undefined' || valueIndex >= this.getOptions().value.size) {
        return 'null';
    }
    var expr = this.getOptions().value[valueIndex];
    // ex) expr = { selected: [{name: 'SepalWidth', aggregation: 'sum', format: '0.000' }] }
    if (expr.selected && expr.selected.length > 0) {
        var columnIndex = -1;
        for (var c = 0; c < localData.columns.length; c++) {
            if (localData.columns[c].name == expr.selected[0].name) {
                columnIndex = c;
                break;
            }
        }
        var operator = new _aggregationOperator2.default(expr.selected[0].name);
        for (var r = 0; r < localData.data.length; r++) {
            operator.add(r, localData.data[r][columnIndex]);
        }
        var val = operator.calc(expr.selected[0].aggregation);
        return expr.selected[0].format ? numeral(val).format(expr.selected[0].format) : val;
    }
    return 'null';
};

Title.prototype._substitute = function (text, localData) {
    // ex) text = 'Sum: ${value[1]}, Avg: ${value[0]}'
    var message = text;
    var matches = message.match(/\$\{value\[(\d)\]\}/g);
    if (localData && matches && matches.length > 0) {
        var replacer = {};
        for (var m in matches) {
            // ex) match = '${value[0]}'
            var match = matches[m];
            if (typeof replacer[match] === 'undefined') {
                var valueIndex = match.match(/\d/);
                var value = this._getDataValue(valueIndex, localData[0]);
                replacer[match] = value;
            }
        }
        message = message.replace(/\$\{value\[(\d)\]\}/g, function (match) {
            return replacer[match];
        });
    }
    return message;
};

Title.prototype.render = function (text, localData) {
    var _this = this;

    var message = this._substitute(text || '', localData);
    this.$mainControl.empty();

    var $title = $('<div class="bcharts-text-overflow-hidden"></div>');
    $title.css('max-width', 'inherit');
    $title.css('max-height', 'inherit');

    $title.text(message);
    $title.attr('title', message);

    this.$mainControl.append($title);

    var styles = ['background', 'border'];
    for (var i in styles) {
        if (typeof this.getOptions()[styles[i]] !== 'undefined') this.$mainControl.css(styles[i], this.getOptions()[styles[i]]);
    }

    if (this.getOptions().textStyle) {
        styles = ['color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textDecoration'];
        for (var i in styles) {
            if (typeof this.getOptions().textStyle[styles[i]] !== 'undefined') this.$mainControl.find('.bcharts-text-overflow-hidden').css(styles[i], this.getOptions().textStyle[styles[i]]);
        }
    }

    if (this.getOptions().subtext) {
        var $subtext = $('<div class="bcharts-subtext-overflow-hidden"></div>');

        $subtext.text(this.getOptions().subtext);
        $subtext.attr('title', this.getOptions().subtext);

        //$subtext.css('width', '100%');
        $subtext.css('max-width', 'inherit');
        $subtext.css('max-height', 'inherit');

        this.$mainControl.append($subtext);

        if (this.getOptions().subtextStyle) {
            styles = ['color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textDecoration'];
            for (var i in styles) {
                if (typeof this.getOptions().subtextStyle[styles[i]] !== 'undefined') this.$mainControl.find('.bcharts-subtext-overflow-hidden').css(styles[i], this.getOptions().subtextStyle[styles[i]]);
            }
        }
    }

    this._adjustLayout();

    if (this.getOptions().visible == false || this.getOptions().show == false) this.$mainControl.hide();else this.$mainControl.show();
};

Title.prototype._adjustLayout = function () {
    var _this = this;
    var chartContainerSize = _chartUtils2.default.getChartContainerSize(this.$mainControl);

    // TODO 회전 각도에 따라 max 값을 지정해야 하지만 일단 0도와 90도에 대해서만 처리함. by daewon.park
    if (this.getOptions().rotate == 0) {
        this.$mainControl.css('max-width', chartContainerSize.width - 10);
        this.$mainControl.css('max-height', chartContainerSize.height - 10);
    } else {
        // 90도 일 경우
        this.$mainControl.css('max-width', chartContainerSize.height - 10);
        this.$mainControl.css('max-height', chartContainerSize.width - 10);
    }

    if (this.getOptions().rotate < 0 || this.getOptions().rotate > 0) {
        var translateX = this.$mainControl.height() / 2 - this.$mainControl.width() / 2;
        this.$mainControl.css('transform', 'translateX(' + translateX + 'px) rotate(' + this.getOptions().rotate + 'deg)');
    } else {
        this.$mainControl.css('transform', 'rotate(0)');
    }

    if (typeof _this.getOptions().left !== 'undefined') {
        // FIXME: 제목 정렬에서는 꼭 필요한 로직인데, y2차트 축 제목 정렬에서 문제가 생기지 않는지 확인 후 수정 필요
        _this.$mainControl.css('left', _this._adjustPosition(_this.getOptions().left, _this.$mainControl.outerWidth()));
        if (this.getOptions().subtext) _this.$mainControl.find('.bcharts-subtext-overflow-hidden').css('left', _this._adjustPosition(_this.getOptions().left, _this.$mainControl.find('.bcharts-subtext-overflow-hidden').outerWidth()));
    }
    if (typeof _this.getOptions().right !== 'undefined') {
        if (this.getOptions().rotate == 0) {
            _this.$mainControl.css('right', _this._adjustPosition(_this.getOptions().right, _this.$mainControl.outerWidth()));
        } else {
            //90도일 경우
            _this.$mainControl.css('right', _this._adjustPosition(_this.getOptions().right, _this.$mainControl.outerWidth(), _this.$mainControl.outerHeight()));
        }
        if (this.getOptions().subtext) _this.$mainControl.find('.bcharts-subtext-overflow-hidden').css('right', _this._adjustPosition(_this.getOptions().right, _this.$mainControl.find('.bcharts-subtext-overflow-hidden').outerWidth()));
    }
    if (typeof _this.getOptions().bottom !== 'undefined') _this.$mainControl.css('bottom', _this._adjustPosition(_this.getOptions().bottom, _this.$mainControl.outerHeight()));
    if (typeof _this.getOptions().top !== 'undefined') _this.$mainControl.css('top', _this._adjustPosition(_this.getOptions().top, _this.$mainControl.outerHeight()));
};

Title.prototype._getRotationDegrees = function ($el) {
    var angle = 0;
    var matrix = $el.css("-webkit-transform") || $el.css("-moz-transform") || $el.css("-ms-transform") || $el.css("-o-transform") || $el.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
    return angle;
};

Title.prototype._adjustPosition = function (position, outerWidth, outerHeight) {
    if (outerHeight) {
        position = position.replace(/px/, '');
        if (Number.isNaN(Number(position)) === false) return Number(position - outerWidth + outerHeight);
        return position.replace(/(\d+%)/, 'calc($1 - ' + outerWidth / 2 + 'px)');
    } else {
        if (Number.isNaN(Number(position)) === false) return Number(position);
        if (position == null) return 'initial';
        return position.replace(/(\d+%)/, 'calc($1 - ' + outerWidth / 2 + 'px)');
    }
};

exports.Title = Title;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pagination = undefined;

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Pagination(parentId, options) {
    _widget2.default.call(this, parentId, options);
} /**
   * Source: pagination.js
   * Created by daewon.park on 2017-05-14.
   */

Pagination.prototype = Object.create(_widget2.default.prototype);
Pagination.prototype.constructor = Pagination;

Pagination.prototype._init = function () {
    _widget2.default.prototype._init.call(this);
    this.pageInfo = $.extend(true, {
        pageNum: 1,
        pageSize: 1000,
        totalCount: -1,
        columnCount: -1
    }, this.getOptions());
};

Pagination.prototype.destroy = function () {
    $(window).off('resize', this.resizeHandler);

    if (this.$contextMenu) {
        this.$contextMenu.jqxMenu('destroy');
    }
};

Pagination.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bcharts-pagination">' + '   <div class="bcharts-pagination-navigator">' + '       <div>Go to page:</div>' + '       <div class="bcharts-pagination-navigator-button" action="prev"><i class="fa fa-caret-left" aria-hidden="true"></i></div>' + '       <div class="bcharts-pagination-navigator-page"></div>' + '       <div class="bcharts-pagination-navigator-button" action="next"><i class="fa fa-caret-right" aria-hidden="true"></i></div>' + '   </div>' + '   <div class="bcharts-pagination-size">' + '       <div>Show rows:</div>' + '       <div class="bcharts-pagination-size-input"></div>' + '       <div class="bcharts-pagination-size-input-menu">' + '           <ul>' + '               <li>1,000</li>' + '               <li>3,000</li>' + '               <li>5,000</li>' + '               <li>10,000</li>' + '               <li>30,000</li>' + '               <li>50,000</li>' + '           </ul>' + '       </div>' + '   </div>' + '   <div class="bcharts-pagination-showing">' + '       <div>Showing Columns:</div>' + '       <div class="bcharts-pagination-showing-column">?</div>' + '       <div>/ Rows:</div>' + '       <div class="bcharts-pagination-showing-begin" type="detail">?</div>' + '       <div type="detail">~</div>' + '       <div class="bcharts-pagination-showing-end" type="detail">?</div>' + '       <div type="detail">of</div>' + '       <div class="bcharts-pagination-showing-total">?</div>' + '   </div>' + '</div>' + '');
    $parent.append(this.$mainControl);
    this._createNavigator(this.$mainControl);
    this._createPageSize(this.$mainControl);
};

Pagination.prototype._createNavigator = function ($parent) {
    var _this = this;

    $parent.find('.bcharts-pagination-navigator-button').click(function (event) {
        if ($(this).attr('action') === 'prev') {
            var pageNum = _this.$pageNumControl.val();
            if (pageNum - 1 !== _this.pageInfo.pageNum) {
                _this.setPageNumber(pageNum - 1);
                _this._fireChanged();
            }
        } else if ($(this).attr('action') === 'next') {
            var pageNum = _this.$pageNumControl.val();
            if (pageNum + 1 !== _this.pageInfo.pageNum) {
                _this.setPageNumber(pageNum + 1);
                _this._fireChanged();
            }
        }
    });

    this.$pageNumControl = $parent.find('.bcharts-pagination-navigator-page');
    this.$pageNumControl.jqxNumberInput({
        theme: 'office',
        width: 40,
        height: 24,
        spinButtons: false,
        min: 1,
        decimalDigits: 0,
        inputMode: 'simple',
        textAlign: 'center'
    });
    this.$pageNumControl.on('change', function (event) {
        var pageNum = event.args.value;
        if (pageNum !== _this.pageInfo.pageNum) {
            _this.setPageNumber(pageNum);
            _this._fireChanged();
        }
    });
    this.setPageNumber(this.pageInfo.pageNum);
};

Pagination.prototype._createPageSize = function ($parent) {
    var _this = this;

    this.$pageSizeControl = $parent.find('.bcharts-pagination-size-input');
    _this.$pageSizeControl.text(numeral(_this.pageInfo.pageSize).format('0,0'));
    this.$pageSizeControl.on('mousedown', function (event) {
        var menuHeight = _this.$contextMenu.height();
        var anchorOffset = $(this).offset();
        if (_this.$contextMenu.is(':visible') === false) {
            _this.$contextMenu.jqxMenu('open', anchorOffset.left, anchorOffset.top - menuHeight - 1);
        }
    });

    this.$contextMenu = $parent.find('.bcharts-pagination-size-input-menu');
    this.$contextMenu.jqxMenu({
        theme: 'office',
        autoOpenPopup: false,
        mode: 'popup',
        width: 88,
        animationShowDuration: 0,
        animationHideDuration: 0
    });
    this.$contextMenu.on('itemclick', function (event) {
        var element = event.args;
        _this.$pageSizeControl.text($(element).text());
        var pageSize = numeral(_this.$pageSizeControl.text());
        if (pageSize.value() !== _this.pageInfo.pageSize) {
            _this.pageInfo.pageSize = pageSize.value();
            _this.setPageNumber(_this.pageInfo.pageNum);
            _this._fireChanged();
        }
    });
    this.resizeHandler = function () {
        _this.$contextMenu.jqxMenu('close');
    };
    $(window).resize(this.resizeHandler);
};

Pagination.prototype._fireChanged = function () {
    if (typeof this.getOptions().changed === 'function') {
        this.getOptions().changed(this.pageInfo);
    }
};

Pagination.prototype._updateButtons = function () {
    if (this.pageInfo.totalCount < 1) {
        this.$mainControl.find('.bcharts-pagination-navigator-button[action="prev"]').addClass('bcharts-non-editable');
        this.$mainControl.find('.bcharts-pagination-navigator-button[action="next"]').addClass('bcharts-non-editable');
        this.$mainControl.find('.bcharts-pagination-navigator-page').addClass('bcharts-non-editable');
        this.$pageNumControl.jqxNumberInput({ max: 1 });
    } else {
        if (Number(this.pageInfo.pageNum) === 1) {
            this.$mainControl.find('.bcharts-pagination-navigator-button[action="prev"]').addClass('bcharts-non-editable');
        } else {
            this.$mainControl.find('.bcharts-pagination-navigator-button[action="prev"]').removeClass('bcharts-non-editable');
        }

        if (Number(this.pageInfo.pageNum) * this.pageInfo.pageSize < this.pageInfo.totalCount) {
            this.$mainControl.find('.bcharts-pagination-navigator-button[action="next"]').removeClass('bcharts-non-editable');
        } else {
            this.$mainControl.find('.bcharts-pagination-navigator-button[action="next"]').addClass('bcharts-non-editable');
        }

        this.$mainControl.find('.bcharts-pagination-navigator-page').removeClass('bcharts-non-editable');

        var max = Math.ceil(this.pageInfo.totalCount / this.pageInfo.pageSize);
        this.$pageNumControl.jqxNumberInput({ max: max });
    }
};

Pagination.prototype.setPageNumber = function (num) {
    var min = 1;
    var max = this.pageInfo.totalCount > -1 ? Math.ceil(this.pageInfo.totalCount / this.pageInfo.pageSize) : Number.MAX_SAFE_INTEGER;

    if (num < min) {
        this.pageInfo.pageNum = min;
    } else if (num > max) {
        this.pageInfo.pageNum = max;
    } else {
        this.pageInfo.pageNum = num;
    }
    this.$pageNumControl.jqxNumberInput({ max: max });
    this.$pageNumControl.val(this.pageInfo.pageNum);

    this._updateButtons();
};

Pagination.prototype.setPageRows = function (begin, end) {
    this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-begin').text(numeral(begin).format('0,0'));
    this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-end').text(numeral(end).format('0,0'));
};

Pagination.prototype.setPageSize = function (pageSize) {
    this.$pageSizeControl.text(pageSize);
    this.pageInfo.pageSize = pageSize;
};

Pagination.prototype.setTotalCount = function (total) {
    this.pageInfo.totalCount = total;
    if (this.pageInfo.totalCount < 0) {
        this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-total').text('?');
    } else {
        this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-total').text(numeral(this.pageInfo.totalCount).format('0,0'));
    }

    this._updateButtons();
};

Pagination.prototype.setColumnCount = function (total) {
    this.pageInfo.columnCount = total;
    if (this.pageInfo.columnCount < 0) {
        this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-column').text('?');
    } else {
        this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-column').text(numeral(this.pageInfo.columnCount).format('0,0'));
    }

    this._updateButtons();
};

Pagination.prototype._showTotalCountOnly = function (total) {
    this.pageInfo.totalCount = total;
    if (this.pageInfo.totalCount < 0) {
        this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-total').text('?');
    } else {
        this.$mainControl.find('.bcharts-pagination-showing .bcharts-pagination-showing-total').text(numeral(this.pageInfo.totalCount).format('0,0'));
    }
};

Pagination.prototype.showOnlyCount = function () {
    this.$mainControl.show();
    this.$mainControl.find('.bcharts-pagination-showing div[type="detail"]').hide();
    this.$mainControl.find('.bcharts-pagination-navigator').hide();
    this.$mainControl.find('.bcharts-pagination-size').hide();
};

Pagination.prototype.show = function () {
    this.$mainControl.show();
    this.$mainControl.find('.bcharts-pagination-showing div[type="detail"]').show();
    this.$mainControl.find('.bcharts-pagination-navigator').show();
    this.$mainControl.find('.bcharts-pagination-size').show();
};

Pagination.prototype.update = function (pageInfo) {
    $.extend(true, this.pageInfo, pageInfo);
    this.setPageNumber(this.pageInfo.pageNum);
    this.setColumnCount(this.pageInfo.columnCount);
    this.setTotalCount(this.pageInfo.totalCount);
    this.setPageSize(this.pageInfo.pageSize);

    var begin = this.pageInfo.pageSize * (this.pageInfo.pageNum - 1) + 1;
    var end;
    if (this.pageInfo.totalCount < 0) {
        end = this.pageInfo.pageSize * this.pageInfo.pageNum;
    } else {
        end = Math.min(this.pageInfo.pageSize * this.pageInfo.pageNum, this.pageInfo.totalCount);
    }
    this.setPageRows(begin, end);
};

Pagination.prototype.hide = function () {
    this.$mainControl.hide();
};

exports.Pagination = Pagination;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsLine = __webpack_require__(33);

var _echartsLine2 = _interopRequireDefault(_echartsLine);

var _echartsAreaOptionBuilder = __webpack_require__(143);

var _echartsAreaOptionBuilder2 = _interopRequireDefault(_echartsAreaOptionBuilder);

var _echartsAreaCalculatedOptionBuilder = __webpack_require__(50);

var _echartsAreaCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAreaCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsArea
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Source: echarts-area.js
 * Created by daewon.park on 2017-03-23.
 */
function EChartsArea(parentId, options) {
    _echartsLine2.default.call(this, parentId, options);
}

EChartsArea.prototype = Object.create(_echartsLine2.default.prototype);
EChartsArea.prototype.constructor = EChartsArea;

EChartsArea.prototype.render = function () {
    if (this.options.source.localData[0].dataType === 'chartdata') {
        this.seriesHelper = new _echartsAreaCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsAreaOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsArea.prototype.getLegendData = function () {
    return _echartsWrapper2.default.prototype.getLegendData.call(this);
};

exports.default = EChartsArea;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDecorator = getDecorator;
exports.createDecorator = createDecorator;

var _decoratorIndex = __webpack_require__(75);

var DecoratorFunc = _interopRequireWildcard(_decoratorIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Decorator = {};

//private
/**
 * Created by sds on 2018-03-14.
 */

function _registerDecorator(decoratorType) {
    if (!DecoratorFunc[decoratorType]) {
        console.warn('Cannot create decorator: ' + decoratorType);
        return false;
    }
    Decorator[decoratorType] = DecoratorFunc[decoratorType];
    return true;
}

function getDecorator(decoratorType) {
    return Decorator[decoratorType];
}

function createDecorator(decoratorType, builder, options) {
    if (_registerDecorator(decoratorType)) {
        return new Decorator[decoratorType](builder, options);
    }
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TooltipTriggerForceItemDecorator = exports.tooltipBubbleCalculated = exports.trendline = exports.axisRange = exports.yAxisScaleFalse = exports.yAxisMin0Max100 = exports.yAxisMin0 = exports.xAxisScaleFalse = exports.xAxisRangeForHistogram = exports.xAxisMin0Max100 = exports.xAxisMin0 = exports.xAxisBoundaryGapFalse = exports.visualMap = exports.tooltipYAxisPercent = exports.tooltipYAxis = exports.tooltipXAxisPercent = exports.tooltipTriggerAxis = exports.tooltipMap = exports.tooltipTreemap = exports.tooltipQQPlot = exports.tooltipPie = exports.tooltipPieCalculated = exports.tooltipPairwiseScatter = exports.tooltipItemCalculated = exports.tooltipHistogram = exports.tooltipHeatmapMatrix = exports.tooltipHeatmap = exports.tooltipDendrogram = exports.tooltip = exports.tooltipComplex = exports.tooltipByRowIndex = exports.tooltipByColumnNames = exports.tooltipBubble = exports.tooltipBoxPlot = exports.tooltipBoxPlotByColumnNames = exports.tooltipAxisPointerShadow = exports.tooltipAxisPointerY = exports.tooltipAxisCalculated = exports.stripline = exports.seriesStacked = exports.seriesStacked100 = exports.seriesNameSet = exports.plotOptions = exports.pairwiseGrid = exports.pairwiseAxis = exports.mapStyle = exports.marker = exports.markerByType = exports.lineStyle = exports.lineBy = exports.itemOpacity7 = exports.dataZoom = exports.fillXCategoryValues = exports.xAxisFilterZoomMode = exports.bubbleSize = exports.brushRemoval = exports.brush = exports.boxPlotSeparateColorDecorator = exports.boxPlotByColumnNamesAxisDecorator = exports.axisLineOnZeroTrue = exports.axisLineOnZeroFalse = exports.axisTypeWithCategoryY = exports.axisTypeWithCategoryX = exports.axisTypeWithCategoryXY = exports.axisTypeValue = exports.axisTypeForDendrogram = exports.axisType = exports.axisTypeByRowIndex = exports.axisTypeByColumnNames = exports.axisRemoval = exports.axisLabelFormatter = exports.axisHidden = undefined;

var _axisHiddenDecorator = __webpack_require__(76);

var _axisHiddenDecorator2 = _interopRequireDefault(_axisHiddenDecorator);

var _axisLabelFormatterDecorator = __webpack_require__(77);

var _axisLabelFormatterDecorator2 = _interopRequireDefault(_axisLabelFormatterDecorator);

var _axisRemovalDecorator = __webpack_require__(78);

var _axisRemovalDecorator2 = _interopRequireDefault(_axisRemovalDecorator);

var _axisTypeBycolumnnamesDecorator = __webpack_require__(79);

var _axisTypeBycolumnnamesDecorator2 = _interopRequireDefault(_axisTypeBycolumnnamesDecorator);

var _axisTypeByrowindexDecorator = __webpack_require__(80);

var _axisTypeByrowindexDecorator2 = _interopRequireDefault(_axisTypeByrowindexDecorator);

var _axisTypeDecorator = __webpack_require__(28);

var _axisTypeDecorator2 = _interopRequireDefault(_axisTypeDecorator);

var _axisTypeForDendrogramDecorator = __webpack_require__(81);

var _axisTypeForDendrogramDecorator2 = _interopRequireDefault(_axisTypeForDendrogramDecorator);

var _axisTypeValueDecorator = __webpack_require__(82);

var _axisTypeValueDecorator2 = _interopRequireDefault(_axisTypeValueDecorator);

var _axisTypeWithCategoryDecorator = __webpack_require__(83);

var _axisTypeWithCategoryDecorator2 = _interopRequireDefault(_axisTypeWithCategoryDecorator);

var _axisTypeWithCategoryXDecorator = __webpack_require__(84);

var _axisTypeWithCategoryXDecorator2 = _interopRequireDefault(_axisTypeWithCategoryXDecorator);

var _axisTypeWithCategoryYDecorator = __webpack_require__(85);

var _axisTypeWithCategoryYDecorator2 = _interopRequireDefault(_axisTypeWithCategoryYDecorator);

var _axislineOnzeroFalseDecorator = __webpack_require__(86);

var _axislineOnzeroFalseDecorator2 = _interopRequireDefault(_axislineOnzeroFalseDecorator);

var _axislineOnzeroTrueDecorator = __webpack_require__(87);

var _axislineOnzeroTrueDecorator2 = _interopRequireDefault(_axislineOnzeroTrueDecorator);

var _boxplotBycolumnnamesAxisDecorator = __webpack_require__(88);

var _boxplotBycolumnnamesAxisDecorator2 = _interopRequireDefault(_boxplotBycolumnnamesAxisDecorator);

var _boxplotSeparateColorDecorator = __webpack_require__(89);

var _boxplotSeparateColorDecorator2 = _interopRequireDefault(_boxplotSeparateColorDecorator);

var _brushDecorator = __webpack_require__(90);

var _brushDecorator2 = _interopRequireDefault(_brushDecorator);

var _brushRemovalDecorator = __webpack_require__(91);

var _brushRemovalDecorator2 = _interopRequireDefault(_brushRemovalDecorator);

var _bubbleSizeDecorator = __webpack_require__(92);

var _bubbleSizeDecorator2 = _interopRequireDefault(_bubbleSizeDecorator);

var _complexDatazoomDecorator = __webpack_require__(93);

var _complexDatazoomDecorator2 = _interopRequireDefault(_complexDatazoomDecorator);

var _fillXCategoryValuesDecorator = __webpack_require__(94);

var _fillXCategoryValuesDecorator2 = _interopRequireDefault(_fillXCategoryValuesDecorator);

var _heatmapDatazoomDecorator = __webpack_require__(95);

var _heatmapDatazoomDecorator2 = _interopRequireDefault(_heatmapDatazoomDecorator);

var _itemOpacity = __webpack_require__(96);

var _itemOpacity2 = _interopRequireDefault(_itemOpacity);

var _lineByDecorator = __webpack_require__(97);

var _lineByDecorator2 = _interopRequireDefault(_lineByDecorator);

var _lineStyleDecorator = __webpack_require__(98);

var _lineStyleDecorator2 = _interopRequireDefault(_lineStyleDecorator);

var _markerByTypeDecorator = __webpack_require__(99);

var _markerByTypeDecorator2 = _interopRequireDefault(_markerByTypeDecorator);

var _markerDecorator = __webpack_require__(100);

var _markerDecorator2 = _interopRequireDefault(_markerDecorator);

var _mapStyleDecorator = __webpack_require__(101);

var _mapStyleDecorator2 = _interopRequireDefault(_mapStyleDecorator);

var _pairwiseAxisDecorator = __webpack_require__(102);

var _pairwiseAxisDecorator2 = _interopRequireDefault(_pairwiseAxisDecorator);

var _pairwiseGridDecorator = __webpack_require__(103);

var _pairwiseGridDecorator2 = _interopRequireDefault(_pairwiseGridDecorator);

var _plotOptionsDecorator = __webpack_require__(104);

var _plotOptionsDecorator2 = _interopRequireDefault(_plotOptionsDecorator);

var _seriesNameSetDecorator = __webpack_require__(105);

var _seriesNameSetDecorator2 = _interopRequireDefault(_seriesNameSetDecorator);

var _seriesStacked100Decorator = __webpack_require__(106);

var _seriesStacked100Decorator2 = _interopRequireDefault(_seriesStacked100Decorator);

var _seriesStackedDecorator = __webpack_require__(107);

var _seriesStackedDecorator2 = _interopRequireDefault(_seriesStackedDecorator);

var _striplineDecorator = __webpack_require__(108);

var _striplineDecorator2 = _interopRequireDefault(_striplineDecorator);

var _tooltipAxisCalculatedDecorator = __webpack_require__(109);

var _tooltipAxisCalculatedDecorator2 = _interopRequireDefault(_tooltipAxisCalculatedDecorator);

var _tooltipAxisPointerYDecorator = __webpack_require__(110);

var _tooltipAxisPointerYDecorator2 = _interopRequireDefault(_tooltipAxisPointerYDecorator);

var _tooltipAxispointerShadowDecorator = __webpack_require__(111);

var _tooltipAxispointerShadowDecorator2 = _interopRequireDefault(_tooltipAxispointerShadowDecorator);

var _tooltipBoxplotBycolumnnamesDecorator = __webpack_require__(112);

var _tooltipBoxplotBycolumnnamesDecorator2 = _interopRequireDefault(_tooltipBoxplotBycolumnnamesDecorator);

var _tooltipBoxplotDecorator = __webpack_require__(113);

var _tooltipBoxplotDecorator2 = _interopRequireDefault(_tooltipBoxplotDecorator);

var _tooltipBubbleDecorator = __webpack_require__(114);

var _tooltipBubbleDecorator2 = _interopRequireDefault(_tooltipBubbleDecorator);

var _tooltipBycolumnnamesDecorator = __webpack_require__(115);

var _tooltipBycolumnnamesDecorator2 = _interopRequireDefault(_tooltipBycolumnnamesDecorator);

var _tooltipByrowindexDecorator = __webpack_require__(116);

var _tooltipByrowindexDecorator2 = _interopRequireDefault(_tooltipByrowindexDecorator);

var _tooltipComplexDecorator = __webpack_require__(117);

var _tooltipComplexDecorator2 = _interopRequireDefault(_tooltipComplexDecorator);

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _tooltipDendrogramDecorator = __webpack_require__(118);

var _tooltipDendrogramDecorator2 = _interopRequireDefault(_tooltipDendrogramDecorator);

var _tooltipHeatmapDecorator = __webpack_require__(119);

var _tooltipHeatmapDecorator2 = _interopRequireDefault(_tooltipHeatmapDecorator);

var _tooltipHeatmapMatrixDecorator = __webpack_require__(120);

var _tooltipHeatmapMatrixDecorator2 = _interopRequireDefault(_tooltipHeatmapMatrixDecorator);

var _tooltipHistogramDecorator = __webpack_require__(121);

var _tooltipHistogramDecorator2 = _interopRequireDefault(_tooltipHistogramDecorator);

var _tooltipItemCalculatedDecorator = __webpack_require__(122);

var _tooltipItemCalculatedDecorator2 = _interopRequireDefault(_tooltipItemCalculatedDecorator);

var _tooltipPairwiseScatterDecorator = __webpack_require__(123);

var _tooltipPairwiseScatterDecorator2 = _interopRequireDefault(_tooltipPairwiseScatterDecorator);

var _tooltipPieCalculatedDecorator = __webpack_require__(124);

var _tooltipPieCalculatedDecorator2 = _interopRequireDefault(_tooltipPieCalculatedDecorator);

var _tooltipPieDecorator = __webpack_require__(40);

var _tooltipPieDecorator2 = _interopRequireDefault(_tooltipPieDecorator);

var _tooltipQqplotDecorator = __webpack_require__(125);

var _tooltipQqplotDecorator2 = _interopRequireDefault(_tooltipQqplotDecorator);

var _tooltipTreemapDecorator = __webpack_require__(126);

var _tooltipTreemapDecorator2 = _interopRequireDefault(_tooltipTreemapDecorator);

var _tooltipMapDecorator = __webpack_require__(127);

var _tooltipMapDecorator2 = _interopRequireDefault(_tooltipMapDecorator);

var _tooltipTriggerAxisDecorator = __webpack_require__(39);

var _tooltipTriggerAxisDecorator2 = _interopRequireDefault(_tooltipTriggerAxisDecorator);

var _tooltipXaxisPercentDecorator = __webpack_require__(128);

var _tooltipXaxisPercentDecorator2 = _interopRequireDefault(_tooltipXaxisPercentDecorator);

var _tooltipYaxisDecorator = __webpack_require__(41);

var _tooltipYaxisDecorator2 = _interopRequireDefault(_tooltipYaxisDecorator);

var _tooltipYaxisPercentDecorator = __webpack_require__(129);

var _tooltipYaxisPercentDecorator2 = _interopRequireDefault(_tooltipYaxisPercentDecorator);

var _visualmapDecorator = __webpack_require__(130);

var _visualmapDecorator2 = _interopRequireDefault(_visualmapDecorator);

var _xaxisBoundarygapFalseDecorator = __webpack_require__(131);

var _xaxisBoundarygapFalseDecorator2 = _interopRequireDefault(_xaxisBoundarygapFalseDecorator);

var _xaxisMin0Decorator = __webpack_require__(132);

var _xaxisMin0Decorator2 = _interopRequireDefault(_xaxisMin0Decorator);

var _xaxisMin0Max100Decorator = __webpack_require__(133);

var _xaxisMin0Max100Decorator2 = _interopRequireDefault(_xaxisMin0Max100Decorator);

var _xaxisRangeForHistogramDecorator = __webpack_require__(134);

var _xaxisRangeForHistogramDecorator2 = _interopRequireDefault(_xaxisRangeForHistogramDecorator);

var _xaxisScaleFalseDecorator = __webpack_require__(135);

var _xaxisScaleFalseDecorator2 = _interopRequireDefault(_xaxisScaleFalseDecorator);

var _yaxisMin0Decorator = __webpack_require__(136);

var _yaxisMin0Decorator2 = _interopRequireDefault(_yaxisMin0Decorator);

var _yaxisMin0Max100Decorator = __webpack_require__(137);

var _yaxisMin0Max100Decorator2 = _interopRequireDefault(_yaxisMin0Max100Decorator);

var _yaxisScaleFalseDecorator = __webpack_require__(138);

var _yaxisScaleFalseDecorator2 = _interopRequireDefault(_yaxisScaleFalseDecorator);

var _axisRangeDecorator = __webpack_require__(42);

var _axisRangeDecorator2 = _interopRequireDefault(_axisRangeDecorator);

var _trendlineDecorator = __webpack_require__(139);

var _trendlineDecorator2 = _interopRequireDefault(_trendlineDecorator);

var _tooltipBubbleCalculatedDecorator = __webpack_require__(140);

var _tooltipBubbleCalculatedDecorator2 = _interopRequireDefault(_tooltipBubbleCalculatedDecorator);

var _tooltipTriggerForceItemDecorator = __webpack_require__(141);

var _tooltipTriggerForceItemDecorator2 = _interopRequireDefault(_tooltipTriggerForceItemDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-03-14.
 */
exports.axisHidden = _axisHiddenDecorator2.default;
exports.axisLabelFormatter = _axisLabelFormatterDecorator2.default;
exports.axisRemoval = _axisRemovalDecorator2.default;
exports.axisTypeByColumnNames = _axisTypeBycolumnnamesDecorator2.default;
exports.axisTypeByRowIndex = _axisTypeByrowindexDecorator2.default;
exports.axisType = _axisTypeDecorator2.default;
exports.axisTypeForDendrogram = _axisTypeForDendrogramDecorator2.default;
exports.axisTypeValue = _axisTypeValueDecorator2.default;
exports.axisTypeWithCategoryXY = _axisTypeWithCategoryDecorator2.default;
exports.axisTypeWithCategoryX = _axisTypeWithCategoryXDecorator2.default;
exports.axisTypeWithCategoryY = _axisTypeWithCategoryYDecorator2.default;
exports.axisLineOnZeroFalse = _axislineOnzeroFalseDecorator2.default;
exports.axisLineOnZeroTrue = _axislineOnzeroTrueDecorator2.default;
exports.boxPlotByColumnNamesAxisDecorator = _boxplotBycolumnnamesAxisDecorator2.default;
exports.boxPlotSeparateColorDecorator = _boxplotSeparateColorDecorator2.default;
exports.brush = _brushDecorator2.default;
exports.brushRemoval = _brushRemovalDecorator2.default;
exports.bubbleSize = _bubbleSizeDecorator2.default;
exports.xAxisFilterZoomMode = _complexDatazoomDecorator2.default;
exports.fillXCategoryValues = _fillXCategoryValuesDecorator2.default;
exports.dataZoom = _heatmapDatazoomDecorator2.default;
exports.itemOpacity7 = _itemOpacity2.default;
exports.lineBy = _lineByDecorator2.default;
exports.lineStyle = _lineStyleDecorator2.default;
exports.markerByType = _markerByTypeDecorator2.default;
exports.marker = _markerDecorator2.default;
exports.mapStyle = _mapStyleDecorator2.default;
exports.pairwiseAxis = _pairwiseAxisDecorator2.default;
exports.pairwiseGrid = _pairwiseGridDecorator2.default;
exports.plotOptions = _plotOptionsDecorator2.default;
exports.seriesNameSet = _seriesNameSetDecorator2.default;
exports.seriesStacked100 = _seriesStacked100Decorator2.default;
exports.seriesStacked = _seriesStackedDecorator2.default;
exports.stripline = _striplineDecorator2.default;
exports.tooltipAxisCalculated = _tooltipAxisCalculatedDecorator2.default;
exports.tooltipAxisPointerY = _tooltipAxisPointerYDecorator2.default;
exports.tooltipAxisPointerShadow = _tooltipAxispointerShadowDecorator2.default;
exports.tooltipBoxPlotByColumnNames = _tooltipBoxplotBycolumnnamesDecorator2.default;
exports.tooltipBoxPlot = _tooltipBoxplotDecorator2.default;
exports.tooltipBubble = _tooltipBubbleDecorator2.default;
exports.tooltipByColumnNames = _tooltipBycolumnnamesDecorator2.default;
exports.tooltipByRowIndex = _tooltipByrowindexDecorator2.default;
exports.tooltipComplex = _tooltipComplexDecorator2.default;
exports.tooltip = _tooltipDecorator2.default;
exports.tooltipDendrogram = _tooltipDendrogramDecorator2.default;
exports.tooltipHeatmap = _tooltipHeatmapDecorator2.default;
exports.tooltipHeatmapMatrix = _tooltipHeatmapMatrixDecorator2.default;
exports.tooltipHistogram = _tooltipHistogramDecorator2.default;
exports.tooltipItemCalculated = _tooltipItemCalculatedDecorator2.default;
exports.tooltipPairwiseScatter = _tooltipPairwiseScatterDecorator2.default;
exports.tooltipPieCalculated = _tooltipPieCalculatedDecorator2.default;
exports.tooltipPie = _tooltipPieDecorator2.default;
exports.tooltipQQPlot = _tooltipQqplotDecorator2.default;
exports.tooltipTreemap = _tooltipTreemapDecorator2.default;
exports.tooltipMap = _tooltipMapDecorator2.default;
exports.tooltipTriggerAxis = _tooltipTriggerAxisDecorator2.default;
exports.tooltipXAxisPercent = _tooltipXaxisPercentDecorator2.default;
exports.tooltipYAxis = _tooltipYaxisDecorator2.default;
exports.tooltipYAxisPercent = _tooltipYaxisPercentDecorator2.default;
exports.visualMap = _visualmapDecorator2.default;
exports.xAxisBoundaryGapFalse = _xaxisBoundarygapFalseDecorator2.default;
exports.xAxisMin0 = _xaxisMin0Decorator2.default;
exports.xAxisMin0Max100 = _xaxisMin0Max100Decorator2.default;
exports.xAxisRangeForHistogram = _xaxisRangeForHistogramDecorator2.default;
exports.xAxisScaleFalse = _xaxisScaleFalseDecorator2.default;
exports.yAxisMin0 = _yaxisMin0Decorator2.default;
exports.yAxisMin0Max100 = _yaxisMin0Max100Decorator2.default;
exports.yAxisScaleFalse = _yaxisScaleFalseDecorator2.default;
exports.axisRange = _axisRangeDecorator2.default;
exports.trendline = _trendlineDecorator2.default;
exports.tooltipBubbleCalculated = _tooltipBubbleCalculatedDecorator2.default;
exports.TooltipTriggerForceItemDecorator = _tooltipTriggerForceItemDecorator2.default;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisHiddenDecorator(builder) {
    _decorator2.default.call(this, builder);
} /**
   * Created by sds on 2018-03-26.
   */

AxisHiddenDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisHiddenDecorator.prototype.constructor = AxisHiddenDecorator;

AxisHiddenDecorator.prototype.decorate = function () {
    var hiddenSpec = {
        splitLine: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        scale: false
    };
    if (this.eOptions.xAxis) {
        this.eOptions.xAxis.forEach(function (axisObj) {
            $.extend(true, axisObj, hiddenSpec);
        });
    }
    if (this.eOptions.yAxis) {
        this.eOptions.yAxis.forEach(function (axisObj) {
            $.extend(true, axisObj, hiddenSpec);
        });
    }
};

exports.default = AxisHiddenDecorator;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-04-11.
 */

function AxisLabelFormatterDecorator(builder) {
    _decorator2.default.call(this, builder);
}

AxisLabelFormatterDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisLabelFormatterDecorator.prototype.constructor = AxisLabelFormatterDecorator;

AxisLabelFormatterDecorator.prototype.decorate = function () {
    this._setFmtFunc('xAxis');
    this._setFmtFunc('yAxis');
};

AxisLabelFormatterDecorator.prototype._setFmtFunc = function (axisNm) {
    if (this.eOptions[axisNm][0].axisLabel && this.eOptions[axisNm][0].axisLabel.formatter) {
        var fmtStr = this.eOptions[axisNm][0].axisLabel.formatter;
        this.eOptions[axisNm][0].axisLabel.formatter = _optionUtils2.default.formatLabel(fmtStr);
    }
};

exports.default = AxisLabelFormatterDecorator;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisRemovalDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

AxisRemovalDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
AxisRemovalDecorator.prototype.constructor = AxisRemovalDecorator;

AxisRemovalDecorator.prototype.decorate = function () {
    delete this.eOptions.xAxis;
    delete this.eOptions.yAxis;
};

exports.default = AxisRemovalDecorator;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeByColumnNamesDecorator(builder) {
    _decorator2.default.call(this, builder);
}

AxisTypeByColumnNamesDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisTypeByColumnNamesDecorator.prototype.constructor = AxisTypeByColumnNamesDecorator;

AxisTypeByColumnNamesDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].type = 'category';

    this.eOptions.xAxis[0].data = this._getColumnNamesCategories();
};

exports.default = AxisTypeByColumnNamesDecorator;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeByRowIndexDecorator(builder) {
    _decorator2.default.call(this, builder);
}

AxisTypeByRowIndexDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisTypeByRowIndexDecorator.prototype.constructor = AxisTypeByRowIndexDecorator;

AxisTypeByRowIndexDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].type = 'value';
};

exports.default = AxisTypeByRowIndexDecorator;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeForDendrogram(builder) {
    _decorator2.default.call(this, builder);
}

AxisTypeForDendrogram.prototype = Object.create(_decorator2.default.prototype);
AxisTypeForDendrogram.prototype.constructor = AxisTypeForDendrogram;

AxisTypeForDendrogram.prototype.decorate = function () {
    this.eOptions.xAxis[0].type = 'category';
    this.eOptions.xAxis[0].data = this.builder.categoryList;
};

exports.default = AxisTypeForDendrogram;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeValueDecorator(builder) {
    _decorator2.default.call(this, builder);
}

AxisTypeValueDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisTypeValueDecorator.prototype.constructor = AxisTypeValueDecorator;

AxisTypeValueDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].type = 'value';
    this.eOptions.yAxis[0].type = 'value';
};

exports.default = AxisTypeValueDecorator;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _axisTypeDecorator = __webpack_require__(28);

var _axisTypeDecorator2 = _interopRequireDefault(_axisTypeDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeWithCategoryDecorator(builder) {
    _axisTypeDecorator2.default.call(this, builder);
}

AxisTypeWithCategoryDecorator.prototype = Object.create(_axisTypeDecorator2.default.prototype);
AxisTypeWithCategoryDecorator.prototype.constructor = AxisTypeWithCategoryDecorator;

// var sortRule = function (a, b) {
//     var xComp;
//     if (xAxisType === 'category') xComp = OptionUtils.stringSortRule(a.value[0], b.value[0]);
//     else if(xAxisType === 'time') xComp = OptionUtils.timeSortRule(a.value[0], b.value[0]);
//     else xComp = OptionUtils.numericSortRule(a.value[0], b.value[0]);
//
//     if (xComp === 0) {
//         var yComp;
//         if (yAxisType === 'category') yComp = OptionUtils.stringSortRule(a.value[1], b.value[1]);
//         else if(yAxisType === 'time') yComp = OptionUtils.timeSortRule(a.value[1], b.value[1]);
//         else yComp = OptionUtils.numericSortRule(a.value[1], b.value[1]);
//         return yComp;
//     } else {
//         return xComp;
//     }
// };

AxisTypeWithCategoryDecorator.prototype.decorate = function () {
    _axisTypeDecorator2.default.prototype.decorate.call(this);
    var builder = this.builder;
    var xAxisType = builder._getColumnDataType(builder.filterNullColumn(this.bOptions.xAxis[0].selected));
    var yAxisType = builder._getColumnDataType(builder.filterNullColumn(this.bOptions.yAxis[0].selected));

    var sortRuleX = function sortRuleX(a, b) {
        var comp;
        if (xAxisType === 'category') comp = _optionUtils2.default.stringSortRule(a, b);else if (xAxisType === 'time') comp = _optionUtils2.default.timeSortRule(a, b);else comp = _optionUtils2.default.numericSortRule(a * 1, b * 1);

        return comp;
    };

    var sortRuleY = function sortRuleY(a, b) {
        var comp;
        if (yAxisType === 'category') comp = _optionUtils2.default.stringSortRule(a, b);else if (yAxisType === 'time') comp = _optionUtils2.default.timeSortRule(a, b);else comp = _optionUtils2.default.numericSortRule(a * 1, b * 1);

        return comp;
    };

    this.eOptions.xAxis[0].data.sort(sortRuleX);
    this.eOptions.yAxis[0].data.sort(sortRuleY);
};

AxisTypeWithCategoryDecorator.prototype.setAxisType = function () {
    this.eOptions.xAxis[0].type = 'category';
    this.eOptions.yAxis[0].type = 'category';
};

exports.default = AxisTypeWithCategoryDecorator;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axisTypeDecorator = __webpack_require__(28);

var _axisTypeDecorator2 = _interopRequireDefault(_axisTypeDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeWithCategoryXDecorator(builder) {
    _axisTypeDecorator2.default.call(this, builder);
}

AxisTypeWithCategoryXDecorator.prototype = Object.create(_axisTypeDecorator2.default.prototype);
AxisTypeWithCategoryXDecorator.prototype.constructor = AxisTypeWithCategoryXDecorator;

AxisTypeWithCategoryXDecorator.prototype.decorate = function () {
    _axisTypeDecorator2.default.prototype.decorate.call(this);
    var sortRule = this._getSortRule(this.bOptions.xAxis[0].selected);
    this.eOptions.xAxis[0].data.sort(sortRule);
};

AxisTypeWithCategoryXDecorator.prototype.setAxisType = function () {
    this.eOptions.xAxis[0].type = 'category';
    this.eOptions.yAxis[0].type = 'value';
};

exports.default = AxisTypeWithCategoryXDecorator;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axisTypeDecorator = __webpack_require__(28);

var _axisTypeDecorator2 = _interopRequireDefault(_axisTypeDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisTypeWithCategoryYDecorator(builder) {
    _axisTypeDecorator2.default.call(this, builder);
}

AxisTypeWithCategoryYDecorator.prototype = Object.create(_axisTypeDecorator2.default.prototype);
AxisTypeWithCategoryYDecorator.prototype.constructor = AxisTypeWithCategoryYDecorator;

AxisTypeWithCategoryYDecorator.prototype.decorate = function () {
    _axisTypeDecorator2.default.prototype.decorate.call(this);
    if (this.bOptions.yAxis[0].selected && this.bOptions.yAxis[0].selected.length > 0) {
        var sortRule = this._getSortRule(this.bOptions.yAxis[0].selected);
        this.eOptions.yAxis[0].data.sort(sortRule);
    }
};

AxisTypeWithCategoryYDecorator.prototype.setAxisType = function () {
    this.eOptions.xAxis[0].type = 'value';
    this.eOptions.yAxis[0].type = 'category';
};

exports.default = AxisTypeWithCategoryYDecorator;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisLineOnZeroFalseDecorator(builder) {
    _decorator2.default.call(this, builder);
}

AxisLineOnZeroFalseDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisLineOnZeroFalseDecorator.prototype.constructor = AxisLineOnZeroFalseDecorator;

AxisLineOnZeroFalseDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].axisLine.onZero = false;
    this.eOptions.yAxis[0].axisLine.onZero = false;
};

exports.default = AxisLineOnZeroFalseDecorator;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisLineOnZeroTrueDecorator(builder) {
    _decorator2.default.call(this, builder);
}

AxisLineOnZeroTrueDecorator.prototype = Object.create(_decorator2.default.prototype);
AxisLineOnZeroTrueDecorator.prototype.constructor = AxisLineOnZeroTrueDecorator;

AxisLineOnZeroTrueDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].axisLine.onZero = true;
    this.eOptions.yAxis[0].axisLine.onZero = true;
};

exports.default = AxisLineOnZeroTrueDecorator;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BoxPlotByColumnNamesAxisDecorator(builder) {
    _decorator2.default.call(this, builder);
}

BoxPlotByColumnNamesAxisDecorator.prototype = Object.create(_decorator2.default.prototype);
BoxPlotByColumnNamesAxisDecorator.prototype.constructor = BoxPlotByColumnNamesAxisDecorator;

BoxPlotByColumnNamesAxisDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].type = 'category';
    this.eOptions.xAxis[0].data = [];

    var localData = this.builder.getLocalData();
    var yIndexes = this.builder.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    for (var i = 0; i < yIndexes.length; i++) {
        if (localData.columns[yIndexes[i]]) {
            this.eOptions.xAxis[0].data.push(localData.columns[yIndexes[i]].name);
        }
    }
};

exports.default = BoxPlotByColumnNamesAxisDecorator;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BoxPlotSeparateColorDecorator(builder) {
    _decorator2.default.call(this, builder);
}

BoxPlotSeparateColorDecorator.prototype = Object.create(_decorator2.default.prototype);
BoxPlotSeparateColorDecorator.prototype.constructor = BoxPlotSeparateColorDecorator;

BoxPlotSeparateColorDecorator.prototype.decorate = function () {
    var colorSet = {};
    var separateColor = this.plotOptions.separateColor;
    var categories = this.eOptions.xAxis[0].data;
    if (separateColor) {
        for (var c in categories) {
            colorSet[categories[c]] = this.eOptions.color[parseInt(c) % this.eOptions.color.length];
        }
    }
    for (var s in this.eOptions.series) {
        if (separateColor) {
            if (this.eOptions.series[s].type === 'boxplot') {
                this._separateBoxColor(this.eOptions.series[s], colorSet);
            } else {
                this._separateOutlierColor(this.eOptions.series[s], colorSet);
            }
        }
    }
};

BoxPlotSeparateColorDecorator.prototype._separateBoxColor = function (seriesItem, colorSet) {
    for (var d in seriesItem.data) {
        seriesItem.data[d].itemStyle = {
            normal: {
                borderColor: colorSet[seriesItem.data[d].name],
                color: '#fff'
            }
        };
    }
};

BoxPlotSeparateColorDecorator.prototype._separateOutlierColor = function (seriesItem, colorSet) {
    for (var d in seriesItem.data) {
        seriesItem.data[d].itemStyle = {
            normal: {
                color: colorSet[seriesItem.data[d].name]
            }
        };
    }
};

exports.default = BoxPlotSeparateColorDecorator;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BrushDecorator(builder) {
    _decorator2.default.call(this, builder);
}

BrushDecorator.prototype = Object.create(_decorator2.default.prototype);
BrushDecorator.prototype.constructor = BrushDecorator;

BrushDecorator.prototype.decorate = function () {
    this.eOptions.brush = {
        xAxisIndex: 0
        // throttleType: 'debounce',
        // throttleDelay: 1000
    };

    if (this.bOptions.toolbar.type === 'custom') {
        $.extend(true, this.eOptions.brush, this.bOptions.toolbar.menu.brush);
    }
};

exports.default = BrushDecorator;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BrushRemovalDecorator(builder) {
    _decorator2.default.call(this, builder);
}

BrushRemovalDecorator.prototype = Object.create(_decorator2.default.prototype);
BrushRemovalDecorator.prototype.constructor = BrushRemovalDecorator;

BrushRemovalDecorator.prototype.decorate = function () {
    delete this.eOptions.brush;
};

exports.default = BrushRemovalDecorator;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BubbleSizeDecorator(builder) {
    _decorator2.default.call(this, builder);
}

BubbleSizeDecorator.prototype = Object.create(_decorator2.default.prototype);
BubbleSizeDecorator.prototype.constructor = BubbleSizeDecorator;

BubbleSizeDecorator.prototype.decorate = function () {
    var series = this.eOptions.series;

    var max = -Infinity;
    var min = Infinity;

    for (var s in series) {
        var seriesItem = series[s];
        if (seriesItem.type !== 'scatter') continue;
        for (var d in seriesItem.data) {
            var data = seriesItem.data[d];
            if (data.value.length <= 2) continue;
            var sizeData = data.value[2];
            min = Math.min(min, sizeData);
            max = Math.max(max, sizeData);
        }
    }

    var diff = Math.abs(max - min);
    var prop = max / min;

    for (var s in series) {
        series[s].symbolSize = function (data) {
            if (prop > 0 && prop < 4) {
                return Math.abs(data[2]) * (10 / min);
            }
            return (Math.abs(data[2]) - Math.abs(min)) * (30 / diff) + 10;
        };
    }
};

exports.default = BubbleSizeDecorator;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ComplexDataZoomDecorator(builder, options) {
    _decorator2.default.call(this, builder, options);
}

ComplexDataZoomDecorator.prototype = Object.create(_decorator2.default.prototype);
ComplexDataZoomDecorator.prototype.constructor = ComplexDataZoomDecorator;

ComplexDataZoomDecorator.prototype.decorate = function () {
    this.eOptions.dataZoom = [{
        type: 'inside',
        filterMode: 'filter',
        xAxisIndex: [0],
        disabled: true
    }];
};

exports.default = ComplexDataZoomDecorator;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FillXCategoryValuesDecorator(builder) {
    _decorator2.default.call(this, builder);
}

FillXCategoryValuesDecorator.prototype = Object.create(_decorator2.default.prototype);
FillXCategoryValuesDecorator.prototype.constructor = FillXCategoryValuesDecorator;

FillXCategoryValuesDecorator.prototype.decorate = function () {
    var builder = this.builder;
    for (var s in this.eOptions.series) {
        var seriesData = this.eOptions.series[s].data;
        var categories = $.extend(true, [], this.eOptions.xAxis[0].data);
        for (var i in seriesData) {
            var data = seriesData[i];
            categories.splice(categories.indexOf(data.value[0]), 1);
        }
        for (var c in categories) {
            seriesData.push({ value: [categories[c], 0] });
        }
        var axisType = builder._getColumnDataType(builder.filterNullColumn(this.bOptions.xAxis[0].selected));
        var sortRule = function sortRule(a, b) {
            var comp;
            if (axisType === 'category') comp = _optionUtils2.default.stringSortRule(a.value[0], b.value[0]);else if (axisType === 'time') comp = _optionUtils2.default.timeSortRule(a.value[0], b.value[0]);else comp = _optionUtils2.default.numericSortRule(a.value[0] * 1, b.value[0] * 1);

            return comp;
        };
        seriesData.sort(sortRule);
    }
};

exports.default = FillXCategoryValuesDecorator;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HeatmapDataZoomDecorator(builder) {
    _decorator2.default.call(this, builder);
} /**
   * Created by SDS on 2018-01-24.
   */

HeatmapDataZoomDecorator.prototype = Object.create(_decorator2.default.prototype);
HeatmapDataZoomDecorator.prototype.constructor = HeatmapDataZoomDecorator;

HeatmapDataZoomDecorator.prototype.decorate = function () {

    var defaultVisualMap = {
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    };

    for (var s in this.eOptions.series) {
        this.eOptions.series[s].dataZoom = $.extend(true, this.eOptions.series[s].dataZoom, { visualMap: { right: 0, top: 40, calculable: true } }, { visualMap: defaultVisualMap }, { visualMap: this.bOptions.visualMap });
    }
};

exports.default = HeatmapDataZoomDecorator;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ItemOpacity7Decorator(builder) {
    _decorator2.default.call(this, builder);
}

ItemOpacity7Decorator.prototype = Object.create(_decorator2.default.prototype);
ItemOpacity7Decorator.prototype.constructor = ItemOpacity7Decorator;

ItemOpacity7Decorator.prototype.decorate = function () {
    for (var s in this.eOptions.series) {
        this.eOptions.series[s].itemStyle.normal.opacity = 0.7;
    }
};

exports.default = ItemOpacity7Decorator;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LineByDecorator(builder) {
    _decorator2.default.call(this, builder);
}

LineByDecorator.prototype = Object.create(_decorator2.default.prototype);
LineByDecorator.prototype.constructor = LineByDecorator;

LineByDecorator.prototype.decorate = function () {
    var builder = this.builder;
    var lineByOffset = this.plotOptions.lineBy ? this.plotOptions.lineBy[0].selected.length : 0;
    if (lineByOffset === 0 && !builder.complexKey) return;

    var colorByList = builder.getDistinctColorByList();
    var seriesNameIdx = builder.seriesNameIdx || 0;
    var seriesColor;

    var eOptionSeries = this.eOptions.series;
    for (var s in eOptionSeries) {
        if (eOptionSeries[s].virtualSeries) continue;
        var colorByKeyName = eOptionSeries[s].name;
        var colorIndex = colorByList.indexOf(colorByKeyName);
        if (colorIndex !== -1) {
            seriesColor = this.bOptions.colorSet[seriesNameIdx + colorIndex];
            eOptionSeries[s].itemStyle = $.extend(true, {}, eOptionSeries[s].itemStyle, { normal: { color: seriesColor } });
            eOptionSeries[s].lineStyle = $.extend(true, {}, eOptionSeries[s].lineStyle, { normal: { color: seriesColor } });
        }
    }
};

exports.default = LineByDecorator;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LineStyleDecorator(builder) {
    _decorator2.default.call(this, builder);
}

LineStyleDecorator.prototype = Object.create(_decorator2.default.prototype);
LineStyleDecorator.prototype.constructor = LineStyleDecorator;

LineStyleDecorator.prototype.decorate = function () {
    for (var s in this.eOptions.series) {
        var seriesItem = this.eOptions.series[s];
        if (seriesItem.virtualSeries || seriesItem.itemStyle) continue;
        seriesItem.lineStyle = { normal: { opacity: seriesItem.itemStyle.normal.opacity } };
    }
};

exports.default = LineStyleDecorator;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MarkerByTypeDecorator(builder, options) {
    _decorator2.default.call(this, builder, options);
} /**
   *
   * @param builder : OptionBuilder
   * @param options : { seriesType1 : plotOptionsType1, .... }
   * ex)
   *  {
       *      'scatter' : 'projection'
       *      'line' : 'component'
       *  }
   */


MarkerByTypeDecorator.prototype = Object.create(_decorator2.default.prototype);
MarkerByTypeDecorator.prototype.constructor = MarkerByTypeDecorator;

MarkerByTypeDecorator.prototype.decorate = function () {
    for (var s in this.eOptions.series) {
        var seriesItem = this.eOptions.series[s];
        if (seriesItem.virtualSeries) continue;
        var plotOptions = this.plotOptions;
        if (plotOptions && typeof plotOptions.marker !== 'undefined') {
            for (var attrName in plotOptions.marker) {
                seriesItem[attrName] = plotOptions.marker[attrName];
            }
        }
    }
};

exports.default = MarkerByTypeDecorator;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MarkerDecorator(builder, options) {
    _decorator2.default.call(this, builder, options);
}

MarkerDecorator.prototype = Object.create(_decorator2.default.prototype);
MarkerDecorator.prototype.constructor = MarkerDecorator;

MarkerDecorator.prototype.decorate = function () {
    for (var s in this.eOptions.series) {
        var seriesItem = this.eOptions.series[s];
        if (seriesItem.virtualSeries) continue;
        var plotOptions = this.plotOptions;
        if (plotOptions && typeof plotOptions.marker !== 'undefined') {
            for (var attrName in plotOptions.marker) {
                if (typeof this.options != 'undefined' && typeof this.options.isKey != 'undefined' && this.options.isKey[s] == true && attrName == 'symbolSize') continue;
                //$.extend(true, seriesItem[attrName], plotOptions.marker[attrName]);
                if (_typeof(seriesItem[attrName]) === 'object') {
                    $.extend(true, seriesItem[attrName], plotOptions.marker[attrName]);
                } else {
                    seriesItem[attrName] = plotOptions.marker[attrName];
                }
            }
        }
    }
};

exports.default = MarkerDecorator;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MapStyleDecorator(builder) {
    _decorator2.default.call(this, builder);
}

MapStyleDecorator.prototype = Object.create(_decorator2.default.prototype);
MapStyleDecorator.prototype.constructor = MapStyleDecorator;

MapStyleDecorator.prototype.decorate = function () {
    $.extend(true, this.eOptions.geo, this.builder.plotOptions.mapStyle);
};

exports.default = MapStyleDecorator;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2018-01-24.
 */
function PairwiseAxisDecorator(builder) {
    _decorator2.default.call(this, builder);
}

PairwiseAxisDecorator.prototype = Object.create(_decorator2.default.prototype);
PairwiseAxisDecorator.prototype.constructor = PairwiseAxisDecorator;

PairwiseAxisDecorator.prototype.decorate = function () {
    var localData = this.builder.getLocalData();
    var axisIndexes = _optionUtils2.default.getColumnIndexes(this.builder.getSeriesDataColumns(), localData.columns);
    var i, secondAxisIndex;
    this.eOptions.xAxis;
    this.eOptions.xAxis;

    for (i = 0; i < axisIndexes.length * axisIndexes.length; i++) {
        this.eOptions.xAxis[i] = $.extend(true, {}, this.eOptions.xAxis[0]);
        this.eOptions.xAxis[i].gridIndex = i;
        this.eOptions.xAxis[i].splitNumber = 3;
        this.eOptions.xAxis[i].position = 'bottom';
        this.eOptions.xAxis[i].axisLine = {
            show: i % axisIndexes.length === axisIndexes.length - 1
        };
        this.eOptions.xAxis[i].axisLabel = {
            show: i % axisIndexes.length === axisIndexes.length - 1
        };
        this.eOptions.xAxis[i].splitLine = { show: true };
        this.eOptions.xAxis[i].axisTick = {
            show: i % axisIndexes.length === axisIndexes.length - 1,
            inside: true
        };

        this.eOptions.yAxis[i] = $.extend(true, {}, this.eOptions.yAxis[0]);
        this.eOptions.yAxis[i].gridIndex = i;
        this.eOptions.yAxis[i].splitNumber = 3;
        this.eOptions.yAxis[i].position = 'left';
        this.eOptions.yAxis[i].axisLine = {
            show: i < axisIndexes.length
        };
        this.eOptions.yAxis[i].axisLabel = {
            show: i < axisIndexes.length
        };
        this.eOptions.yAxis[i].splitLine = { show: true };
        this.eOptions.yAxis[i].axisTick = {
            show: i < axisIndexes.length,
            inside: true
        };
    }
};

exports.default = PairwiseAxisDecorator;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2018-01-24.
 */
function PairwiseGridDecorator(builder) {
    _decorator2.default.call(this, builder);
}

PairwiseGridDecorator.prototype = Object.create(_decorator2.default.prototype);
PairwiseGridDecorator.prototype.constructor = PairwiseGridDecorator;

PairwiseGridDecorator.prototype.decorate = function () {
    var localData = this.builder.getLocalData();
    var axisIndexes = _optionUtils2.default.getColumnIndexes(this.builder.getSeriesDataColumns(), localData.columns);
    var firstAxisIndex, secondAxisIndex;
    var grid = this.bOptions.grid;
    var percentToNumber = function percentToNumber(percent) {
        if (String(percent).indexOf('%') < 0) return 5;
        return String(percent).replace('%', '') * 1;
    };
    this.eOptions.grid = [];

    var CATEGORY_DIM_COUNT = axisIndexes.length;
    var GAP = 2;
    var BASE_LEFT = percentToNumber(grid.left);
    var BASE_RIGHT = percentToNumber(grid.right);
    var BASE_TOP = percentToNumber(grid.top);
    var BASE_BOTTOM = percentToNumber(grid.bottom);
    var GRID_WIDTH = (100 - BASE_LEFT - BASE_RIGHT - GAP) / CATEGORY_DIM_COUNT - GAP;
    var GRID_HEIGHT = (100 - BASE_TOP - GAP - BASE_BOTTOM) / CATEGORY_DIM_COUNT - GAP;

    for (firstAxisIndex = 0; firstAxisIndex < axisIndexes.length; firstAxisIndex++) {
        for (secondAxisIndex = 0; secondAxisIndex < axisIndexes.length; secondAxisIndex++) {
            this.eOptions.grid.push({
                left: BASE_LEFT + firstAxisIndex * (GRID_WIDTH + GAP) + '%',
                top: BASE_TOP + secondAxisIndex * (GRID_HEIGHT + GAP) + '%',
                width: GRID_WIDTH + '%',
                height: GRID_HEIGHT + '%'
            });
        }
    }
};

exports.default = PairwiseGridDecorator;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PlotOptionsDecorator(builder) {
    _decorator2.default.call(this, builder);
}

PlotOptionsDecorator.prototype = Object.create(_decorator2.default.prototype);
PlotOptionsDecorator.prototype.constructor = PlotOptionsDecorator;

PlotOptionsDecorator.prototype.decorate = function () {
    for (var s in this.eOptions.series) {
        var seriesItem = this.eOptions.series[s];
        if (seriesItem.virtualSeries) continue;
        var plotOptions = this.plotOptions;
        var plotOptionAttributes = this.builder.plotOptionAttributes;
        var tmp = {};
        for (var i in plotOptionAttributes) {
            var attr = plotOptionAttributes[i];
            if (typeof plotOptions[attr] !== 'undefined') {
                tmp[attr] = plotOptions[attr];
            }
        }
        $.extend(true, seriesItem, tmp);
    }
};

exports.default = PlotOptionsDecorator;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SeriesNameSetDecorator(builder) {
    _decorator2.default.call(this, builder);
} /**
   * Created by sds on 2018-01-30.
   */


SeriesNameSetDecorator.prototype = Object.create(_decorator2.default.prototype);
SeriesNameSetDecorator.prototype.constructor = SeriesNameSetDecorator;

SeriesNameSetDecorator.prototype.decorate = function () {

    var builder = this.builder;

    var eOptionSeries = builder.series;
    var seriesName = {};
    //FIXME: decorator 내에서 series loop 한번만 돌게 리펙토링 필요
    for (var s in eOptionSeries) {
        if (eOptionSeries[s].virtualSeries) continue;
        var colorByKeyName = eOptionSeries[s].name;
        seriesName[colorByKeyName] = null;
    }
    builder.seriesNameSet = Object.keys(seriesName);
};

exports.default = SeriesNameSetDecorator;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SeriesStacked100Decorator(builder, options) {
    _decorator2.default.call(this, builder, options);
}

SeriesStacked100Decorator.prototype = Object.create(_decorator2.default.prototype);
SeriesStacked100Decorator.prototype.constructor = SeriesStacked100Decorator;

SeriesStacked100Decorator.prototype.decorate = function () {
    var series = this.eOptions.series;
    // var categories = this.eOptions.xAxis[0].data;
    var categories = this.eOptions[this.options.column][0].data;
    var valueIndex = this.options.valueIndex;

    for (var categoryIdx = 0; categoryIdx < categories.length; categoryIdx++) {
        var categorySum = 0;

        for (var seriesIdx = 0; seriesIdx < series.length; seriesIdx++) {
            if (series[seriesIdx].virtualSeries) continue;
            categorySum += Math.abs(series[seriesIdx].data[categoryIdx].value[valueIndex]);
        }
        for (var seriesIdx = 0; seriesIdx < series.length; seriesIdx++) {
            if (series[seriesIdx].virtualSeries) continue;
            series[seriesIdx].data[categoryIdx].actualValue = series[seriesIdx].data[categoryIdx].value[valueIndex];
            if (categorySum == 0) {
                series[seriesIdx].data[categoryIdx].value[valueIndex] = 0;
            } else {
                series[seriesIdx].data[categoryIdx].value[valueIndex] = Math.abs(series[seriesIdx].data[categoryIdx].value[valueIndex] / categorySum * 100);
            }
        }
    }

    this.eOptions.series = series;
};

exports.default = SeriesStacked100Decorator;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SeriesStackedDecorator(builder, options) {
    _decorator2.default.call(this, builder, options);
}

SeriesStackedDecorator.prototype = Object.create(_decorator2.default.prototype);
SeriesStackedDecorator.prototype.constructor = SeriesStackedDecorator;

SeriesStackedDecorator.prototype.decorate = function () {
    var series = this.eOptions.series;
    var categoryTarget, categories, categoryValue;
    if (this.eOptions.xAxis[0].type === 'category') {
        categoryTarget = 0;
        categories = this.eOptions.xAxis[0].data;
    } else {
        categoryTarget = 1;
        categories = this.eOptions.yAxis[0].data;
    }

    for (var seriesIdx = 0; seriesIdx < series.length; seriesIdx++) {
        if (series[seriesIdx].virtualSeries) continue;

        var categoryMap = series[seriesIdx].extractor.getCategoryMap(categoryTarget);

        for (var categoryIdx = 0; categoryIdx < categories.length; categoryIdx++) {
            categoryValue = categories[categoryIdx];
            if (categoryMap[categoryValue]) continue;

            var data;
            if (categoryTarget === 0) {
                data = { value: [categoryValue, 0] };
            } else {
                data = { value: [0, categoryValue] };
            }
            series[seriesIdx].data.push(data);
        }

        series[seriesIdx].data.sort(function (dataA, dataB) {
            var a = dataA.value[categoryTarget],
                b = dataB.value[categoryTarget];
            if (typeof a !== 'string' || typeof b !== 'string') return typeof a !== 'string' ? 1 : -1;else if (a < b) return -1;else if (a == b) return 0;else return 1;
        });
    }

    this.eOptions.series = series;
};

exports.default = SeriesStackedDecorator;

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StripLineDecorator(builder) {
    _decorator2.default.call(this, builder);
}

StripLineDecorator.prototype = Object.create(_decorator2.default.prototype);
StripLineDecorator.prototype.constructor = StripLineDecorator;

StripLineDecorator.prototype.decorate = function () {
    this._buildLineSeries('strip', this.plotOptions.stripLine);
    //this._buildLineSeries('trend', this.plotOptions.trendLine);
};

StripLineDecorator.prototype._buildLineSeries = function (type, lineObj) {
    if (!lineObj) {
        return;
    }
    var additionalLine = {
        virtualSeries: true,
        type: 'line',
        itemStyle: {
            normal: {}
        },
        data: []
    };

    if (!(lineObj && lineObj.data) || $.isEmptyObject(lineObj.data[0])) {
        this.eOptions.series.push(additionalLine);
        return;
    }

    var lineDataArr = [];
    var lineOption = $.extend(true, {}, lineObj);
    if (type === 'trend') {
        //trend line
        lineDataArr = lineObj.data;
    } else if (type === 'strip') {
        //strip line
        var tempDataObj;
        lineOption = $.extend(true, {}, lineObj);
        for (var axis in lineOption.data[0]) {
            if (this.eOptions[axis][0].type !== 'value' || this.eOptions[axis][0].axisType === 'byRowIndex') {
                continue;
            }
            var axisDataArr = lineOption.data[0][axis];
            for (var dataIdx = 0; dataIdx < axisDataArr.length; dataIdx++) {
                tempDataObj = {};
                tempDataObj[axis] = axisDataArr[dataIdx].value || 0;
                if (axisDataArr[dataIdx].lineStyle) {
                    tempDataObj.lineStyle = axisDataArr[dataIdx].lineStyle;
                }
                lineDataArr.push(tempDataObj);
            }
        }
    } else {
        console.log('line type is not specified.');
        return;
    }
    delete lineOption.data;

    additionalLine.markLine = $.extend(true, {
        animation: false,
        silent: true,
        symbol: 'circle',
        symbolSize: 0
    }, lineOption, { data: lineDataArr });

    this.eOptions.series.push(additionalLine);
};

exports.default = StripLineDecorator;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipAxisCalculatedDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipAxisCalculatedDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipAxisCalculatedDecorator.prototype.constructor = TooltipAxisCalculatedDecorator;

TooltipAxisCalculatedDecorator.prototype._getAxisKeyTooltip = function (param, division, keyColumns) {
    var builder = this.builder;
    var keyItems = [];
    if (param.seriesName) {
        if (builder._internalOptions().series[param.seriesIndex]) {
            var extractor = builder._internalOptions().series[param.seriesIndex].extractor;
            if (extractor) {
                var keyColumnsNames = keyColumns.map(function (item) {
                    return item.name;
                });
                keyItems.push(division(keyColumnsNames.join(',') + ' : ' + extractor.keys.join(',')));
            }
        } else {
            keyItems.push(division(param.seriesName));
        }
    }

    return keyItems;
};

exports.default = TooltipAxisCalculatedDecorator;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipAxisPointerYDecorator(builder) {
    _decorator2.default.call(this, builder);
}

TooltipAxisPointerYDecorator.prototype = Object.create(_decorator2.default.prototype);
TooltipAxisPointerYDecorator.prototype.constructor = TooltipAxisPointerYDecorator;

TooltipAxisPointerYDecorator.prototype.decorate = function () {
    if (this.plotOptions.hasOwnProperty('tooltip')) {
        if (!this.plotOptions.tooltip.hasOwnProperty('axisPointer')) {
            this.eOptions.tooltip.axisPointer = {
                axis: 'y'
            };
        }
    } else {
        this.eOptions.tooltip.axisPointer = {
            axis: 'y'
        };
    }
};

exports.default = TooltipAxisPointerYDecorator;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipAxisPointerShadowDecorator(builder) {
    _decorator2.default.call(this, builder);
}

TooltipAxisPointerShadowDecorator.prototype = Object.create(_decorator2.default.prototype);
TooltipAxisPointerShadowDecorator.prototype.constructor = TooltipAxisPointerShadowDecorator;

TooltipAxisPointerShadowDecorator.prototype.decorate = function () {
    if (this.plotOptions.hasOwnProperty('tooltip')) {
        if (!this.plotOptions.tooltip.hasOwnProperty('axisPointer')) {
            this.eOptions.tooltip.axisPointer = {
                type: 'shadow'
            };
        }
    } else {
        this.eOptions.tooltip.axisPointer = {
            type: 'shadow'
        };
    }
};

exports.default = TooltipAxisPointerShadowDecorator;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipBoxPlotByColumnNamesDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipBoxPlotByColumnNamesDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipBoxPlotByColumnNamesDecorator.prototype.constructor = TooltipBoxPlotByColumnNamesDecorator;

TooltipBoxPlotByColumnNamesDecorator.prototype.decorate = function () {
    var _this = this;
    var builder = this.builder;
    var dataColumns = builder.getSeriesDataColumns();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        if (params.seriesType === 'scatter') {
            return _this._getOutlierTooltip(params, dataColumns);
        } else if ($.isPlainObject(params.data)) {
            return _this._getCalculatedTooltip(dataColumns[0].name, params.name, params.data);
        } else {
            return _this._getCalculatedTooltip(dataColumns[0].name, params.name, params);
        }
    };
};

TooltipBoxPlotByColumnNamesDecorator.prototype._getOutlierTooltip = function (params, dataColumns) {
    return [dataColumns[params.data.value[0]].name + ': ' + params.data.value[1]].join('<br/>');
};

TooltipBoxPlotByColumnNamesDecorator.prototype._getCalculatedTooltip = function (colName, actualVal, calcValList) {
    return [actualVal, 'Maximum: ' + calcValList.value[5], 'Upper quartile: ' + calcValList.value[4], 'Median: ' + calcValList.value[3], 'Lower quartile: ' + calcValList.value[2], 'Minimum: ' + calcValList.value[1]].join('<br/>');
};

exports.default = TooltipBoxPlotByColumnNamesDecorator;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipBoxPlotDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipBoxPlotDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipBoxPlotDecorator.prototype.constructor = TooltipBoxPlotDecorator;

TooltipBoxPlotDecorator.prototype.decorate = function () {
    var _this = this;
    var builder = this.builder;
    var dataColumns = builder.getSeriesDataColumns();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        if (params.seriesType === 'scatter') {
            return _this._getOutlierTooltip(params, dataColumns);
        } else if ($.isPlainObject(params.data)) {
            return _this._getCalculatedTooltip(dataColumns[0].name, params.name, params.data);
        } else {
            return _this._getCalculatedTooltip(dataColumns[0].name, params.name, params);
        }
    };
};

TooltipBoxPlotDecorator.prototype._getOutlierTooltip = function (params, dataColumns) {
    return [dataColumns[0].name + ': ' + (params.data.value ? params.data.value[0] : params.data[0]), dataColumns[1].name + ': ' + (params.data.value ? params.data.value[1] : params.data[1])].join('<br/>');
};

TooltipBoxPlotDecorator.prototype._getCalculatedTooltip = function (colName, actualVal, calcValList) {
    return [colName + ': ' + actualVal, 'Maximum: ' + calcValList.value[5], 'Upper quartile: ' + calcValList.value[4], 'Median: ' + calcValList.value[3], 'Lower quartile: ' + calcValList.value[2], 'Minimum: ' + calcValList.value[1]].join('<br/>');
};

exports.default = TooltipBoxPlotDecorator;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipBubbleDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipBubbleDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipBubbleDecorator.prototype.constructor = TooltipBubbleDecorator;

TooltipBubbleDecorator.prototype._buildItemTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var keyColumnIndexes = builder.getTooltipKeyColumnIndexes();
    var dataColumns = builder.getTooltipDataColumns();
    var dataColumnIndexes = builder.getTooltipDataColumnIndexes();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];

        if (params.seriesName) {
            toolItems = toolItems.concat(_this._getItemKeyTooltip(params, keyColumns));
        }
        if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
            toolItems.push(params.name + ' : ' + params.value);
        } else {
            toolItems.push(_this._getItemXTooltip(params, dataColumns));
            toolItems.push(_this._getItemYTooltip(params, dataColumns));
            toolItems.push(_this._getItemSizeByTooltip(params, dataColumns));
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipBubbleDecorator.prototype._getItemSizeByTooltip = function (params, dataColumns) {
    var columnName = dataColumns[2] ? _optionUtils2.default.getColumnLabel(dataColumns[2]) : 'Count';
    return columnName + ' : ' + params.value[2];
};

exports.default = TooltipBubbleDecorator;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipByColumnNamesDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipByColumnNamesDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipByColumnNamesDecorator.prototype.constructor = TooltipByColumnNamesDecorator;

TooltipByColumnNamesDecorator.prototype._buildItemTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var keyColumnIndexes = builder.getTooltipKeyColumnIndexes();
    var categories = this._getColumnNamesCategories();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];

        if (params.seriesName) {
            var extractor = builder._internalOptions().series[params.seriesIndex].extractor;
            for (var k = 0; k < keyColumnIndexes.length; k++) {
                toolItems.push(keyColumns[k].name + ' : ' + extractor.keys[k]);
            }
        }
        toolItems.push(_this._getItemByColumnNamesTooltip(params, categories));

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipByColumnNamesDecorator.prototype._getItemByColumnNamesTooltip = function (params, categories) {
    return categories[params.data.categoryIndex] + ' : ' + params.value[1];
};

TooltipByColumnNamesDecorator.prototype._buildAxisTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var categories = this._getColumnNamesCategories();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];
        if (Array.isArray(params)) {
            var series = builder.series;
            for (var p in params) {
                if (builder._internalOptions().series[params[p].seriesIndex].virtualSeries) continue;

                var axisNameTooltip = 'Column Name : ' + params[p].name;
                if (!axisNameTooltip) continue;
                toolItems.push(axisNameTooltip);

                var division = function division(text) {
                    return '<div title="' + text + '">' + text + '</div>';
                };
                if (params[p].seriesName || params[p].seriesType === 'line') {
                    division = function division(text) {
                        return '<div title="' + text + '" style="color: ' + params[p].color + ';" series-name:"' + params[p].seriesName + '">' + text + '</div>';
                    };
                    toolItems = toolItems.concat(_this._getAxisKeyTooltip(params[p], division, keyColumns));
                }
                toolItems.push(division(categories[params[p].value[0]] + ' : ' + params[p].value[1]));
            }
        } else {
            if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
                toolItems.push(params.name + ' : ' + params.value);
            }
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('');
    };
};

exports.default = TooltipByColumnNamesDecorator;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipByRowIndexDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipByRowIndexDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipByRowIndexDecorator.prototype.constructor = TooltipByRowIndexDecorator;

TooltipByRowIndexDecorator.prototype._buildItemTooltip = function () {
    var _this = this;
    var builder = this.builder;
    var columns = builder.getAllColumns();

    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];

        toolItems.push('Row Index : ' + params.value[0]);
        toolItems.push(columns[params.data.categoryIndex].name + ' : ' + params.value[1]);

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipByRowIndexDecorator.prototype._buildAxisTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var dataColumns = builder.getTooltipDataColumns();
    var seriesIndex;
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];
        if (Array.isArray(params)) {
            var series = builder.series;

            for (var p in params) {
                if (builder._internalOptions().series[params[p].seriesIndex].virtualSeries) continue;
                seriesIndex = params[p].seriesIndex;

                if (toolItems.length === 0) {
                    toolItems.push('Row Index : ' + params[p].value[0]);
                }

                var division = function division(text) {
                    return '<div title="' + text + '">' + text + '</div>';
                };
                if (params[p].seriesName) {
                    division = function division(text) {
                        return '<div title="' + text + '" style="color: ' + params[p].color + ';" series-name:"' + params[p].seriesName + '">' + text + '</div>';
                    };
                    toolItems = toolItems.concat(_this._getAxisKeyTooltip(params[p], division, keyColumns));
                }
                seriesIndex = params[p].seriesIndex;
                if (_this._hasTooltipHeaders(series[seriesIndex])) {
                    toolItems.push(division(series[seriesIndex].tooltipHeaders[1] + ': ' + params[p].value[1]));
                } else {
                    toolItems.push(division(_this._getAxisValueTooltip(params[p], dataColumns)));
                }
            }
        } else {
            if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
                toolItems.push(params.name + ' : ' + params.value);
            }
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('');
    };
};

TooltipByRowIndexDecorator.prototype._getAxisKeyTooltip = function (param, division, keyColumns) {
    var builder = this.builder;
    var keyItems = [];
    if (builder._internalOptions().series[param.seriesIndex]) {
        var extractor = builder._internalOptions().series[param.seriesIndex].extractor;
        if (extractor) {
            for (var k = 0; k < keyColumns.length; k++) {
                keyItems.push(division(keyColumns[k].name + ' : ' + extractor.keys[k + 1]));
            }
        }
    } else {
        keyItems.push(division(param.seriesName));
    }

    return keyItems;
};

exports.default = TooltipByRowIndexDecorator;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipComplexDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipComplexDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipComplexDecorator.prototype.constructor = TooltipComplexDecorator;

exports.default = TooltipComplexDecorator;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipDendrogramDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipDendrogramDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipDendrogramDecorator.prototype.constructor = TooltipDendrogramDecorator;

TooltipDendrogramDecorator.prototype._buildAxisTooltip = function () {
    var _this = this;
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {

        var toolTipMap = {};
        var series, height;
        for (var i in params) {
            series = params[i];
            height = series.axisValue;
            var clusterGroup = series.seriesName;
            if (!toolTipMap[clusterGroup]) {
                toolTipMap[clusterGroup] = {
                    clusterGroup: clusterGroup,
                    childCluster: _this.builder.parentNodeMap[clusterGroup].join(', '),
                    seriesIndex: i
                };
            }
        }

        var toolItems = [];

        var division = function division(text) {
            return '<div title="' + text + '">' + text + '</div>';
        };
        var colorDivision = function colorDivision(text, seriesIndex) {
            return '<div title="' + text + '" style="color: ' + params[seriesIndex].color + ';">' + text + '</div>';
        };
        toolItems.push(division('Height : ' + height));

        for (var t in toolTipMap) {
            toolItems.push(colorDivision('Cluster Group : ' + t, toolTipMap[t].seriesIndex));
            toolItems.push(colorDivision('Child Cluster: ' + toolTipMap[t].childCluster, toolTipMap[t].seriesIndex));
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('');
    };
};

exports.default = TooltipDendrogramDecorator;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipHeatmapDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipHeatmapDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipHeatmapDecorator.prototype.constructor = TooltipHeatmapDecorator;

TooltipHeatmapDecorator.prototype._buildItemTooltip = function () {
    var dataColumns = this.builder.getSeriesDataColumns();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        if (params.seriesType === 'heatmap') {
            return [_optionUtils2.default.getColumnLabel(dataColumns[0]) + ': ' + params.data.value[0], _optionUtils2.default.getColumnLabel(dataColumns[1]) + ': ' + params.data.value[1], _optionUtils2.default.getColumnLabel(dataColumns[2]) + ': ' + params.data.value[2]].join('<br/>');
        }
    };
};

exports.default = TooltipHeatmapDecorator;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipHeatmapMatrixDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipHeatmapMatrixDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipHeatmapMatrixDecorator.prototype.constructor = TooltipHeatmapMatrixDecorator;

TooltipHeatmapMatrixDecorator.prototype._buildItemTooltip = function () {
    var xAxisCategories = this.builder._getCategories(this.bOptions.xAxis[0].selected);
    var yAxisCategories = this.eOptions.series[0].extractor.yCategories();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        if (params.seriesType === 'heatmap') {
            return ['X-Axis : ' + xAxisCategories[params.data[0]], 'Y-Axis : ' + yAxisCategories[params.data[1]], 'Value: ' + params.data[2]].join('<br/>');
        }
    };
};

exports.default = TooltipHeatmapMatrixDecorator;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _tooltipTriggerAxisDecorator = __webpack_require__(39);

var _tooltipTriggerAxisDecorator2 = _interopRequireDefault(_tooltipTriggerAxisDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipHistogramDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipHistogramDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipHistogramDecorator.prototype.constructor = TooltipHistogramDecorator;

TooltipHistogramDecorator.prototype._getItemXTooltip = function (params, dataColumns) {
    return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + params.value[0] + ' ~ ' + params.value[1];
};

TooltipHistogramDecorator.prototype._getItemYTooltip = function (params, dataColumns) {
    return 'Count : ' + params.value[2];
};

exports.default = TooltipHistogramDecorator;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipItemCalculatedDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipItemCalculatedDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipItemCalculatedDecorator.prototype.constructor = TooltipItemCalculatedDecorator;

TooltipItemCalculatedDecorator.prototype._getItemKeyTooltip = function (params, keyColumns) {
    var keyItems = [];
    var extractor = this.builder._internalOptions().series[params.seriesIndex].extractor;
    var keyColumnNames = keyColumns.map(function (item) {
        return item.name;
    });
    keyItems.push(keyColumnNames.join(',') + ' : ' + extractor.keys.join(','));
    return keyItems;
};

exports.default = TooltipItemCalculatedDecorator;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipPairwiseScatterDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipPairwiseScatterDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipPairwiseScatterDecorator.prototype.constructor = TooltipPairwiseScatterDecorator;

TooltipPairwiseScatterDecorator.prototype._buildItemTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    _this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];

        if (params.seriesName) {
            toolItems = toolItems.concat(_this._getItemKeyTooltip(params, keyColumns));
        }

        toolItems = toolItems.concat(_this._getItemDataTooltip(params));

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipPairwiseScatterDecorator.prototype._getItemDataTooltip = function (params) {
    var keyItems = [];

    var dataColumns = this.builder.getSeriesDataColumns();
    var series = this.builder._internalOptions().series[params.seriesIndex];

    keyItems.push(dataColumns[series.xAxisColumnIndex].name + ' : ' + params.value[0]);
    keyItems.push(dataColumns[series.yAxisColumnIndex].name + ' : ' + params.value[1]);
    return keyItems;
};

exports.default = TooltipPairwiseScatterDecorator;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipPieDecorator = __webpack_require__(40);

var _tooltipPieDecorator2 = _interopRequireDefault(_tooltipPieDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipPieCalculatedDecorator(builder) {
    _tooltipPieDecorator2.default.call(this, builder);
}

TooltipPieCalculatedDecorator.prototype = Object.create(_tooltipPieDecorator2.default.prototype);
TooltipPieCalculatedDecorator.prototype.constructor = TooltipPieCalculatedDecorator;

TooltipPieCalculatedDecorator.prototype._getItemKeyTooltip = function (params, keyColumns) {
    var keyItems = [];
    var keyColumnNames = keyColumns.map(function (item) {
        return _optionUtils2.default.getColumnLabel(item);
    }).join(',');
    keyItems.push(keyColumnNames + ' : ' + params.data.keys.join(','));
    return keyItems;
};

exports.default = TooltipPieCalculatedDecorator;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipQQPlotDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipQQPlotDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipQQPlotDecorator.prototype.constructor = TooltipQQPlotDecorator;

TooltipQQPlotDecorator.prototype._getItemXTooltip = function (params, dataColumns) {
    return 'Theoretical Quantile' + ' : ' + params.value[0];
};

TooltipQQPlotDecorator.prototype._getItemYTooltip = function (params, dataColumns) {
    return 'Sample Quantile : ' + params.value[1];
};

exports.default = TooltipQQPlotDecorator;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipTreemapDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipTreemapDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipTreemapDecorator.prototype.constructor = TooltipTreemapDecorator;

TooltipTreemapDecorator.prototype._buildItemTooltip = function () {
    var dataColumn = this.builder.plotOptions.sizeBy[0].selected[0];
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        if (params.seriesType === 'treemap') {
            var treePath = [];
            for (var i = 1; i < params.treePathInfo.length; i++) {
                treePath.push(params.treePathInfo[i].name);
            }
            return [treePath.join('&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>&nbsp;'), _optionUtils2.default.getColumnLabel(dataColumn) + ': ' + params.value].join('<br/>');
        }
    };
};

exports.default = TooltipTreemapDecorator;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipMapDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipMapDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipMapDecorator.prototype.constructor = TooltipMapDecorator;

TooltipMapDecorator.prototype._buildItemTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var keyColumnIndexes = builder.getTooltipKeyColumnIndexes();
    var dataColumns = builder.getTooltipDataColumns();
    var dataColumnIndexes = builder.getTooltipDataColumnIndexes();
    this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];

        toolItems.push(_this._getItemKeyTooltip(params, dataColumns));
        toolItems.push(_this._getItemSizeByTooltip(params, dataColumns));

        return function () {
            var result = [];
            for (var t in toolItems) {
                if ($.isArray(toolItems[t])) {
                    for (var tit in toolItems[t]) {
                        if (result.indexOf(toolItems[t][tit]) === -1) {
                            result.push(toolItems[t][tit]);
                        }
                    }
                } else {
                    if (result.indexOf(toolItems[t]) === -1) {
                        result.push(toolItems[t]);
                    }
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipMapDecorator.prototype._getItemKeyTooltip = function (params, keyColumns) {
    var keyItems = [];
    if (typeof params.data.value != 'undefined' && typeof params.seriesIndex != 'undefined') {
        var latitudeName = params.data.layer.latitude[0].selected[0].name;
        var longitudeName = params.data.layer.longitude[0].selected[0].name;
        keyItems.push(latitudeName + ' : ' + params.data.value[1]);
        keyItems.push(longitudeName + ' : ' + params.data.value[0]);
    }
    return keyItems;
};

TooltipMapDecorator.prototype._getItemSizeByTooltip = function (params, dataColumns) {
    if (typeof params.value == 'undefined' || typeof params.value[2] == 'undefined') return '';else var columnName = _optionUtils2.default.getColumnLabel(params.data.layer.sizeBy[0].selected[0]) || 'Size';
    return columnName + ' : ' + params.value[2];
};

exports.default = TooltipMapDecorator;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipXAxisPercentDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipXAxisPercentDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipXAxisPercentDecorator.prototype.constructor = TooltipXAxisPercentDecorator;

TooltipXAxisPercentDecorator.prototype._getAxisValueTooltip = function (param, dataColumns) {
    return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + param.data.actualValue + ' (' + numeral(param.data.value[1]).format('0') + '%)';
};

exports.default = TooltipXAxisPercentDecorator;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _tooltipYaxisDecorator = __webpack_require__(41);

var _tooltipYaxisDecorator2 = _interopRequireDefault(_tooltipYaxisDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipYAxisPercentDecorator(builder) {
    _tooltipYaxisDecorator2.default.call(this, builder);
}

TooltipYAxisPercentDecorator.prototype = Object.create(_tooltipYaxisDecorator2.default.prototype);
TooltipYAxisPercentDecorator.prototype.constructor = TooltipYAxisPercentDecorator;

TooltipYAxisPercentDecorator.prototype._getAxisValueTooltip = function (param, dataColumns) {
    return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + param.data.actualValue + ' (' + numeral(param.data.value[0]).format('0') + '%)';
};

exports.default = TooltipYAxisPercentDecorator;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function VisualMapDecorator(builder) {
    _decorator2.default.call(this, builder);
} /**
   * Created by SDS on 2018-01-24.
   */


VisualMapDecorator.prototype = Object.create(_decorator2.default.prototype);
VisualMapDecorator.prototype.constructor = VisualMapDecorator;

VisualMapDecorator.prototype.decorate = function () {
    var builder = this.builder;
    var copyBOptVisualMap = this.bOptions.visualMap;

    var _this = this;
    var eOptColorArr = function () {
        var resultArr = [];
        if (copyBOptVisualMap.colorMap) {
            resultArr = _chartUtils2.default.genColorList(_this.eOptions.visualMap, copyBOptVisualMap.colorMap, copyBOptVisualMap.colorSet);
        }
        if (resultArr.length < 1) {
            resultArr = _this.bOptions.VisualMapColorSet || _defaultOptions2.default.VisualMapColorSet;
        }
        return resultArr;
    }();

    $.extend(true, this.eOptions, {
        visualMap: {
            calculable: true,
            inRange: {}
        }
    }, { visualMap: copyBOptVisualMap });
    this.eOptions.visualMap.inRange.color = eOptColorArr;
    delete this.eOptions.visualMap.colorMap;
};

exports.default = VisualMapDecorator;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function XAxisBoundaryGapFalseDecorator(builder) {
    _decorator2.default.call(this, builder);
}

XAxisBoundaryGapFalseDecorator.prototype = Object.create(_decorator2.default.prototype);
XAxisBoundaryGapFalseDecorator.prototype.constructor = XAxisBoundaryGapFalseDecorator;

XAxisBoundaryGapFalseDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].boundaryGap = false;
};

exports.default = XAxisBoundaryGapFalseDecorator;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function XAxisMin0Decorator(builder, options) {
    _decorator2.default.call(this, builder, options);
} /**
   * Created by sds on 2018-04-12.
   */

XAxisMin0Decorator.prototype = Object.create(_decorator2.default.prototype);
XAxisMin0Decorator.prototype.constructor = XAxisMin0Decorator;

XAxisMin0Decorator.prototype.decorate = function () {

    for (var i in this.eOptions.xAxis) {
        if (!this.options || $.isArray(this.options.aggr) && this.options.aggr.includes(this.bOptions.xAxis[i].selected[0].aggregation)) {
            this.eOptions.xAxis[i].min = 0;
        }
    }
};

exports.default = XAxisMin0Decorator;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function XAxisMin0Max100Decorator(builder) {
    _decorator2.default.call(this, builder);
}

XAxisMin0Max100Decorator.prototype = Object.create(_decorator2.default.prototype);
XAxisMin0Max100Decorator.prototype.constructor = XAxisMin0Max100Decorator;

XAxisMin0Max100Decorator.prototype.decorate = function () {
    for (var i in this.eOptions.xAxis) {
        this.eOptions.xAxis[i].min = 0;
        this.eOptions.xAxis[i].max = 100;
    }
};

exports.default = XAxisMin0Max100Decorator;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function XAxisRangeForHistogramDecorator(builder) {
    _decorator2.default.call(this, builder);
}

XAxisRangeForHistogramDecorator.prototype = Object.create(_decorator2.default.prototype);
XAxisRangeForHistogramDecorator.prototype.constructor = XAxisRangeForHistogramDecorator;

XAxisRangeForHistogramDecorator.prototype.decorate = function () {
    var min = Infinity;
    var max = -Infinity;
    var interval;
    for (var b in this.eOptions.series[0].extractor.bins) {
        var bin = this.eOptions.series[0].extractor.bins[b];
        min = Math.min(min, bin.x0);
        max = Math.max(max, bin.x1);
        if (!interval) interval = bin.x1 - bin.x0;
    }
    this.eOptions.xAxis[0].min = min;
    this.eOptions.xAxis[0].max = max;
    this.eOptions.xAxis[0].interval = Number(interval.toFixed(14));
};

exports.default = XAxisRangeForHistogramDecorator;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function XAxisScaleFalseDecorator(builder) {
    _decorator2.default.call(this, builder);
}

XAxisScaleFalseDecorator.prototype = Object.create(_decorator2.default.prototype);
XAxisScaleFalseDecorator.prototype.constructor = XAxisScaleFalseDecorator;

XAxisScaleFalseDecorator.prototype.decorate = function () {
    this.eOptions.xAxis[0].scale = false;
};

exports.default = XAxisScaleFalseDecorator;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param builder
 * @param options = {
     *     aggr: ['count', 'sum'] //나열된 aggregation이 들어왔을때 axis min 0로 설정.
     * }
 */
function YAxisMin0Decorator(builder, options) {
    _decorator2.default.call(this, builder, options);
} /**
   * Created by sds on 2018-04-12.
   */


YAxisMin0Decorator.prototype = Object.create(_decorator2.default.prototype);
YAxisMin0Decorator.prototype.constructor = YAxisMin0Decorator;

YAxisMin0Decorator.prototype.decorate = function () {
    for (var i in this.eOptions.yAxis) {
        if (!this.options || $.isArray(this.options.aggr) && this.options.aggr.includes(this.bOptions.yAxis[i].selected[0].aggregation)) {
            this.eOptions.yAxis[i].min = 0;
        }
    }
};

exports.default = YAxisMin0Decorator;

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function YAxisMin0Max100Decorator(builder) {
    _decorator2.default.call(this, builder);
}

YAxisMin0Max100Decorator.prototype = Object.create(_decorator2.default.prototype);
YAxisMin0Max100Decorator.prototype.constructor = YAxisMin0Max100Decorator;

YAxisMin0Max100Decorator.prototype.decorate = function () {
    for (var i in this.eOptions.yAxis) {
        this.eOptions.yAxis[i].min = 0;
        this.eOptions.yAxis[i].max = 100;
    }
};

exports.default = YAxisMin0Max100Decorator;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function YAxisScaleFalseDecorator(builder) {
    _decorator2.default.call(this, builder);
}

YAxisScaleFalseDecorator.prototype = Object.create(_decorator2.default.prototype);
YAxisScaleFalseDecorator.prototype.constructor = YAxisScaleFalseDecorator;

YAxisScaleFalseDecorator.prototype.decorate = function () {
    this.eOptions.yAxis[0].scale = false;
};

exports.default = YAxisScaleFalseDecorator;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TrendLineDecorator(builder) {
    _decorator2.default.call(this, builder);
}

TrendLineDecorator.prototype = Object.create(_decorator2.default.prototype);
TrendLineDecorator.prototype.constructor = TrendLineDecorator;

TrendLineDecorator.prototype.decorate = function () {
    this._buildLineSeries('trend', this.plotOptions.trendLine);
};

TrendLineDecorator.prototype._buildLineSeries = function (type, lineObj) {
    if (!(lineObj && lineObj.data) || $.isEmptyObject(lineObj.data[0])) {
        return;
    }

    // trendLine 값 구하기 - 현재는 Line 만 가능        
    var data = [[], []];
    var builder = this.builder;
    var seriesList = builder.series;

    for (var series in seriesList) {
        if (seriesList[series].virtualSeries) continue;

        for (var i in seriesList[series].data) {
            data[0].push(seriesList[series].data[i].value[0]);
            data[1].push(seriesList[series].data[i].value[1]);
        }
    }
    var leastSquares = Brightics.Chart.Helper.OptionUtils.leastSquares(data[0], data[1]);
    var result = [[leastSquares[0], leastSquares[1]], [leastSquares[2], leastSquares[3]]];

    // trendLine 용 series 추가
    var lineDataArr = [];
    var lineOption = $.extend(true, {}, lineObj);
    var additionalLine;
    for (var axis in lineOption.data[0]) {
        var axisDataArr = lineOption.data[0][axis];
        for (var dataIdx = 0; dataIdx < axisDataArr.length; dataIdx++) {
            additionalLine = {
                virtualSeries: true,
                type: 'line',
                lineStyle: {
                    normal: {}
                },
                symbol: 'none',
                data: []
            };

            additionalLine.data = result;
            if (axisDataArr[dataIdx].lineStyle) {
                additionalLine.lineStyle = axisDataArr[dataIdx].lineStyle;
                this.eOptions.series.push(additionalLine);
            }
        }
    }
};

exports.default = TrendLineDecorator;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tooltipDecorator = __webpack_require__(4);

var _tooltipDecorator2 = _interopRequireDefault(_tooltipDecorator);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipBubbleCalculatedDecorator(builder) {
    _tooltipDecorator2.default.call(this, builder);
}

TooltipBubbleCalculatedDecorator.prototype = Object.create(_tooltipDecorator2.default.prototype);
TooltipBubbleCalculatedDecorator.prototype.constructor = TooltipBubbleCalculatedDecorator;

TooltipBubbleCalculatedDecorator.prototype._buildItemTooltip = function () {
    var builder = this.builder;
    var _this = this;

    var keyColumns = builder.getTooltipKeyColumns();
    var dataColumns = builder.getTooltipDataColumns();
    _this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        var series = builder.series;
        var seriesIndex = params.seriesIndex;
        var toolItems = [];

        if (params.seriesName) {
            toolItems = toolItems.concat(_this._getItemKeyTooltip(params, keyColumns));
        }
        if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
            toolItems.push(params.name + ' : ' + params.value);
        } else if (_this._hasTooltipHeaders(series[seriesIndex])) {
            var tooltipHeaders = series[seriesIndex].tooltipHeaders;
            for (var i = 0; i < tooltipHeaders.length; i++) {
                toolItems.push(tooltipHeaders[i] + ' : ' + params.value[i]);
            }
        } else {
            toolItems.push(_this._getItemXTooltip(params, dataColumns));
            toolItems.push(_this._getItemYTooltip(params, dataColumns));
            toolItems.push(_this._getItemSizeByTooltip(params, dataColumns));
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('<br>');
    };
};

TooltipBubbleCalculatedDecorator.prototype._getItemKeyTooltip = function (params, keyColumns) {
    var keyItems = [];
    var extractor = this.builder._internalOptions().series[params.seriesIndex].extractor;
    var keyColumnNames = keyColumns.map(function (item) {
        return item.name;
    });
    keyItems.push(keyColumnNames.join(',') + ' : ' + extractor.keys.join(','));
    return keyItems;
};

TooltipBubbleCalculatedDecorator.prototype._getItemSizeByTooltip = function (params, dataColumns) {
    var columnName = dataColumns[2] ? _optionUtils2.default.getColumnLabel(dataColumns[2]) : 'Count';
    return columnName + ' : ' + params.value[2];
};

exports.default = TooltipBubbleCalculatedDecorator;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decorator = __webpack_require__(0);

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TooltipTriggerForceItemDecorator(builder) {
    _decorator2.default.call(this, builder);
}

TooltipTriggerForceItemDecorator.prototype = Object.create(_decorator2.default.prototype);
TooltipTriggerForceItemDecorator.prototype.constructor = TooltipTriggerForceItemDecorator;

TooltipTriggerForceItemDecorator.prototype.decorate = function () {
    this.eOptions.tooltip.trigger = 'item';
};

exports.default = TooltipTriggerForceItemDecorator;

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsLineCalculatedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsLineCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsLineCalculatedOptionBuilder.prototype.constructor = EChartsLineCalculatedOptionBuilder;

EChartsLineCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('lineStyle');
    this._registerDecorator('plotOptions');
    this._registerDecorator('lineBy');
    this._setSeriesDataSortRule();
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsLineCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var keyColumns = [];
    if (this.bOptions.plotOptions.line && this.bOptions.plotOptions.line.lineBy && this.bOptions.plotOptions.line.lineBy.length > 0) {
        var lineBy = this.filterNullColumn(this.bOptions.plotOptions.line.lineBy[dataIndex].selected);
        if (lineBy.length > 0) keyColumns = keyColumns.concat([{ name: 'lineBy' }]);
    }
    if (this.bOptions.colorBy.length > 0) {
        var colorBy = this.filterNullColumn(this.bOptions.colorBy[dataIndex].selected);
        if (colorBy.length > 0) keyColumns = keyColumns.concat([{ name: 'colorBy' }]);
    }
    return keyColumns;
};

EChartsLineCalculatedOptionBuilder.prototype.getColorByColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    return this.getColumnIndexes([{ name: 'colorBy' }], localData.chartColumns);
};

EChartsLineCalculatedOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var keyColumns = [];
    var columns = [];
    if (this.bOptions.plotOptions.line && this.bOptions.plotOptions.line.lineBy && this.bOptions.plotOptions.line.lineBy.length > 0) {
        var lineBy = this.filterNullColumn(this.bOptions.plotOptions.line.lineBy[dataIndex].selected);
        for (var i in lineBy) {
            columns.push(lineBy[i].name);
        }keyColumns = keyColumns.concat(lineBy);
    }
    //if(this.bOptions.colorBy.length > 0) keyColumns = keyColumns.concat(this.filterNullColumn(this.bOptions.colorBy[dataIndex].selected));
    if (this.bOptions.colorBy.length > 0) {
        var colorBy = this.filterNullColumn(this.bOptions.colorBy[dataIndex].selected);
        for (var i in colorBy) {
            if (columns.indexOf(colorBy[i].name) === -1) {
                columns.push(colorBy[i].name);
                keyColumns.push(colorBy[i]);
            }
        }
    }
    return keyColumns;
};

exports.default = EChartsLineCalculatedOptionBuilder;

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeWithCategorykeyOptionBuilder = __webpack_require__(49);

var _echartsAxisTypeWithCategorykeyOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeWithCategorykeyOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaOptionBuilder() {
    _echartsAxisTypeWithCategorykeyOptionBuilder2.default.call(this);
}

EChartsAreaOptionBuilder.prototype = Object.create(_echartsAxisTypeWithCategorykeyOptionBuilder2.default.prototype);
EChartsAreaOptionBuilder.prototype.constructor = EChartsAreaOptionBuilder;

EChartsAreaOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'areaStyle', 'sampling', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('xAxisBoundaryGapFalse');
    this._registerDecorator('fillXCategoryValues');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltip');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._setSeriesDataSortRule();
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsAreaOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'line';
    seriesItem.areaStyle = {
        normal: {}
    };

    return seriesItem;
};

exports.default = EChartsAreaOptionBuilder;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsArea = __webpack_require__(73);

var _echartsArea2 = _interopRequireDefault(_echartsArea);

var _echartsAreaStackedOptionBuilder = __webpack_require__(145);

var _echartsAreaStackedOptionBuilder2 = _interopRequireDefault(_echartsAreaStackedOptionBuilder);

var _echartsAreaCalculatedStackedOptionBuilder = __webpack_require__(243);

var _echartsAreaCalculatedStackedOptionBuilder2 = _interopRequireDefault(_echartsAreaCalculatedStackedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaStacked(parentId, options) {
    _echartsArea2.default.call(this, parentId, options);
} /**
   * Source: echarts-area-stacked.js
   * Created by daewon.park on 2017-04-12.
   */

EChartsAreaStacked.prototype = Object.create(_echartsArea2.default.prototype);
EChartsAreaStacked.prototype.constructor = EChartsAreaStacked;

EChartsAreaStacked.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsAreaStacked.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsAreaCalculatedStackedOptionBuilder2.default();
    } else {
        return new _echartsAreaStackedOptionBuilder2.default();
    }
};

exports.default = EChartsAreaStacked;

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAreaOptionBuilder = __webpack_require__(143);

var _echartsAreaOptionBuilder2 = _interopRequireDefault(_echartsAreaOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaStackedOptionBuilder() {
    _echartsAreaOptionBuilder2.default.call(this);
}

EChartsAreaStackedOptionBuilder.prototype = Object.create(_echartsAreaOptionBuilder2.default.prototype);
EChartsAreaStackedOptionBuilder.prototype.constructor = EChartsAreaStackedOptionBuilder;

EChartsAreaStackedOptionBuilder.prototype._setUpOptions = function () {
    _echartsAreaOptionBuilder2.default.prototype._setUpOptions.call(this);
    this.setSeriesKeyColumns(this.plotOptions.stackBy[0].selected);
};

EChartsAreaStackedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsAreaOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    return seriesItem;
};

EChartsAreaStackedOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

exports.default = EChartsAreaStackedOptionBuilder;

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _echartsBarOptionBuilder = __webpack_require__(147);

var _echartsBarOptionBuilder2 = _interopRequireDefault(_echartsBarOptionBuilder);

var _echartsBarCalculatedOptionBuilder = __webpack_require__(51);

var _echartsBarCalculatedOptionBuilder2 = _interopRequireDefault(_echartsBarCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: echarts-bar.js
 * Created by daewon.park on 2017-04-16.
 */

function EChartsBar(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsBar.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsBar.prototype.constructor = EChartsBar;

EChartsBar.prototype.render = function () {

    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsBar.prototype._doDataValidation = function (opt) {
    _chartUtils2.default.limitMaxSeriesSize(opt.series);
};

EChartsBar.prototype._createSelectedRange = function (eventData) {
    var _this = this;
    var keyColumns = _this.seriesHelper.getSeriesKeyColumns();
    var dataColumns = _this.seriesHelper.getSeriesDataColumns();
    var selectedRangeList = [];
    var series = this.seriesHelper.series;
    for (var b in eventData.batch) {
        var batch = eventData.batch[b];
        for (var s in batch.selected) {
            if (batch.selected[s].dataIndex.length === 0) continue;
            var seriesIndex = batch.selected[s].seriesIndex;
            var template = {};
            for (var k in keyColumns) {
                var seriesKey = keyColumns[k].name;
                var seriesValue = series[seriesIndex].keys[k];
                template[seriesKey] = seriesValue;
            }
            for (var d in batch.selected[s].dataIndex) {
                var idx = batch.selected[s].dataIndex[d];
                var col = dataColumns[1].name;
                var val = series[seriesIndex].data[idx].value[1];
                if (_this.seriesHelper.getColumnType(dataColumns[1]) === 'number') {
                    val = Number(val);
                }
                var item = {};
                item[col] = val;
                $.extend(true, item, template);
                selectedRangeList.push(item);
            }
        }
    }
    return selectedRangeList;
};

EChartsBar.prototype.getLegendData = function () {
    var legendData = _echartsWrapper2.default.prototype.getLegendData.call(this);
    for (var i in legendData) {
        legendData[i].symbol = 'square';
    }
    return legendData;
};

EChartsBar.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsBarCalculatedOptionBuilder2.default();
    } else {
        return new _echartsBarOptionBuilder2.default();
    }
};

exports.default = EChartsBar;

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeWithCategorykeyOptionBuilder = __webpack_require__(49);

var _echartsAxisTypeWithCategorykeyOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeWithCategorykeyOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarOptionBuilder() {
    _echartsAxisTypeWithCategorykeyOptionBuilder2.default.call(this);
}

EChartsBarOptionBuilder.prototype = Object.create(_echartsAxisTypeWithCategorykeyOptionBuilder2.default.prototype);
EChartsBarOptionBuilder.prototype.constructor = EChartsBarOptionBuilder;

EChartsBarOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeWithCategoryY');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltip');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this._registerDecorator('axisLineOnZeroTrue');
    this._registerDecorator('xAxisMin0', { aggr: ['count'] });
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsBarOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'bar';

    return seriesItem;
};

EChartsBarOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var dataColumns = this.getSeriesDataColumns();
    var aggregation = dataColumns[0].aggregation;
    var hasAggregation = aggregation && aggregation !== 'none';
    var xIndexes = this.getColumnIndexes(this.bOptions.xAxis[0].selected, localData.columns);
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'category',
        isKey: true
    });

    if (hasAggregation) {
        extractor.setExtractOperator(function (pointObject) {
            var operator = new _aggregationOperator2.default(pointObject.value);
            for (var i = 0; i < pointObject.indexList.length; i++) {
                operator.add(pointObject.indexList[i], pointObject.point[i][0]);
            }
            return [{ value: [operator.calc(aggregation)].concat(pointObject.value), dataIndexes: pointObject.indexList }];
        });
    }
    return extractor;
};

exports.default = EChartsBarOptionBuilder;

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsBar = __webpack_require__(146);

var _echartsBar2 = _interopRequireDefault(_echartsBar);

var _echartsBarStackedOptionBuilder = __webpack_require__(149);

var _echartsBarStackedOptionBuilder2 = _interopRequireDefault(_echartsBarStackedOptionBuilder);

var _echartsBarCalculatedStackedOptionBuilder = __webpack_require__(247);

var _echartsBarCalculatedStackedOptionBuilder2 = _interopRequireDefault(_echartsBarCalculatedStackedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarStacked(parentId, options) {
    _echartsBar2.default.call(this, parentId, options);
} /**
   * Source: echarts-bar-stacked.js
   * Created by daewon.park on 2017-04-16.
   */

EChartsBarStacked.prototype = Object.create(_echartsBar2.default.prototype);
EChartsBarStacked.prototype.constructor = EChartsBarStacked;

EChartsBarStacked.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsBarStacked.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsBarCalculatedStackedOptionBuilder2.default();
    } else {
        return new _echartsBarStackedOptionBuilder2.default();
    }
};

exports.default = EChartsBarStacked;

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsBarOptionBuilder = __webpack_require__(147);

var _echartsBarOptionBuilder2 = _interopRequireDefault(_echartsBarOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarStackedOptionBuilder() {
    _echartsBarOptionBuilder2.default.call(this);
}

EChartsBarStackedOptionBuilder.prototype = Object.create(_echartsBarOptionBuilder2.default.prototype);
EChartsBarStackedOptionBuilder.prototype.constructor = EChartsBarStackedOptionBuilder;

EChartsBarStackedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipYAxis');
    this._registerDecorator('tooltipAxisPointerShadow');
    this._registerDecorator('xAxisScaleFalse');
    _echartsBarOptionBuilder2.default.prototype._setUpOptions.call(this);
    this._registerDecorator('seriesStacked');
    this.setSeriesKeyColumns(this.plotOptions.stackBy[0].selected);
};

EChartsBarStackedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsBarOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    return seriesItem;
};

EChartsBarStackedOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

exports.default = EChartsBarStackedOptionBuilder;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _boxplotOperator = __webpack_require__(151);

var _boxplotOperator2 = _interopRequireDefault(_boxplotOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBoxPlotOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsBoxPlotOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsBoxPlotOptionBuilder.prototype.constructor = EChartsBoxPlotOptionBuilder;

EChartsBoxPlotOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['boxWidth'];
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('tooltipBoxPlot');
    this._registerDecorator('plotOptions');
    this._registerDecorator('boxPlotSeparateColorDecorator');
    this._registerDecorator('brush');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    // this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    // this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsBoxPlotOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes(this.bOptions.xAxis[0].selected, localData.columns);
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var operator = new _boxplotOperator2.default(pointObject.value);
        for (var i = 0; i < pointObject.indexList.length; i++) {
            operator.add(pointObject.indexList[i], pointObject.point[i][1]);
        }
        return operator.calc();
    });

    return extractor;
};

EChartsBoxPlotOptionBuilder.prototype._buildSeriesData = function () {
    var outliers = [];

    for (var s in this.series) {
        var boxplotData = this.series[s].extractor.extract();

        var axisType = this._getColumnDataType(this.filterNullColumn(this.bOptions.xAxis[0].selected));
        var sortRule = function sortRule(a, b) {
            var comp;
            if (axisType === 'category') comp = _optionUtils2.default.stringSortRule(a.x, b.x);else if (axisType === 'time') comp = _optionUtils2.default.timeSortRule(a.x, b.x);else comp = _optionUtils2.default.numericSortRule(a.x * 1, b.x * 1);

            return comp;
        };

        boxplotData.sort(sortRule);

        var seriesItemData = {
            boxData: [],
            outliers: []
        };

        for (var d in boxplotData) {
            var boxData = boxplotData[d].boxData;
            boxData.name = boxplotData[d].x;
            seriesItemData.boxData.push(boxData);

            var out = boxplotData[d].outliers;
            out = out.map(function (item) {
                return {
                    name: boxplotData[d].x,
                    value: item.value,
                    dataIndexes: item.dataIndexes
                };
            });
            seriesItemData.outliers = seriesItemData.outliers.concat(out);
        }

        // boxplot series data
        this.series[s].data = seriesItemData.boxData;

        // TODO 3.6.2 에서 series.data = [{ value: {...}, itemStyle: {} }, { value: {...}, itemStyle: {} }] 형태를 인식하지 못하는 bug 가 있음. by daewon.park
        this.series[s]._originalData = this.series[s].data;

        // outlier series data
        if (seriesItemData.outliers.length > 0) {
            var outlierSeriesItem = {
                name: this.series[s].name,
                type: 'scatter',
                data: seriesItemData.outliers
            };
            outliers.push(outlierSeriesItem);
        }
    }
    for (var o in outliers) {
        this.series.push(outliers[o]);
    }
};

exports.default = EChartsBoxPlotOptionBuilder;

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: aggregation-operator.js
 * Created by daewon.park on 2017-03-22.
 */

function BoxPlotOperator(x) {
    this.x = x;
    this.values = [];
}

BoxPlotOperator.prototype.add = function (index, value) {
    if (!Number.isFinite(value)) return;
    this.values.push({
        dataIndex: parseInt(index),
        value: value
    });
};

BoxPlotOperator.prototype.calc = function () {
    var boxPlotData = {
        x: this.x[0],
        boxData: {
            value: [],
            dataIndexes: []
        },
        outliers: []
    };
    if (this.values.length > 2) {
        this.values.sort(function (a, b) {
            return a.value - b.value;
        });

        var q1 = this._calculatePercentile(this.values, 0.25);
        var median = this._calculatePercentile(this.values, 0.5);
        var q3 = this._calculatePercentile(this.values, 0.75);
        var interQuartileRange = q3 - q1;
        var lowerFence = q1 - 1.5 * interQuartileRange;
        var upperFence = q3 + 1.5 * interQuartileRange;
        var min = median;
        var max = median;
        for (var i = 0; i < this.values.length; i++) {
            if (this.values[i].value > lowerFence && this.values[i].value < upperFence) {
                min = Math.min(min, this.values[i].value);
                max = Math.max(max, this.values[i].value);
                boxPlotData.boxData.dataIndexes.push(this.values[i].dataIndex);
            } else {
                boxPlotData.outliers.push({
                    value: ['' + this.x, this.values[i].value],
                    dataIndexes: [this.values[i].dataIndex]
                });
            }
        }
        boxPlotData.boxData.value = [min, q1, median, q3, max];
    } else if (this.values.length === 1) {
        boxPlotData.boxData.value = [this.values[0].value, this.values[0].value, this.values[0].value, this.values[0].value, this.values[0].value];
    } else {
        boxPlotData.boxData.value = [0, 0, 0, 0, 0];
    }
    return boxPlotData;
};

BoxPlotOperator.prototype._calculatePercentile = function (values, percentile) {
    var offset = (values.length - 1) * percentile;
    var j = Math.floor(offset);
    var g = offset - j;

    return values[j].value * (1 - g) + values[j + 1].value * g;
};

exports.default = BoxPlotOperator;

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeWithCategorykeyOptionBuilder = __webpack_require__(49);

var _echartsAxisTypeWithCategorykeyOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeWithCategorykeyOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnOptionBuilder() {
    _echartsAxisTypeWithCategorykeyOptionBuilder2.default.call(this);
}

EChartsColumnOptionBuilder.prototype = Object.create(_echartsAxisTypeWithCategorykeyOptionBuilder2.default.prototype);
EChartsColumnOptionBuilder.prototype.constructor = EChartsColumnOptionBuilder;

EChartsColumnOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltip');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this._registerDecorator('yAxisMin0', { aggr: ['count'] });
    this._registerDecorator('axisLineOnZeroTrue');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsColumnOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'bar';

    return seriesItem;
};

EChartsColumnOptionBuilder.prototype._setSeriesDataSortRule = function (sortRule) {
    this._seriesDataSortRule = sortRule;
};

exports.default = EChartsColumnOptionBuilder;

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsColumn = __webpack_require__(37);

var _echartsColumn2 = _interopRequireDefault(_echartsColumn);

var _echartsColumnStackedOptionBuilder = __webpack_require__(154);

var _echartsColumnStackedOptionBuilder2 = _interopRequireDefault(_echartsColumnStackedOptionBuilder);

var _echartsColumnCalculatedStackedOptionBuilder = __webpack_require__(265);

var _echartsColumnCalculatedStackedOptionBuilder2 = _interopRequireDefault(_echartsColumnCalculatedStackedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnStacked(parentId, options) {
    _echartsColumn2.default.call(this, parentId, options);
} /**
   * Source: echarts-column-stacked.js
   * Created by daewon.park on 2017-03-29.
   */

EChartsColumnStacked.prototype = Object.create(_echartsColumn2.default.prototype);
EChartsColumnStacked.prototype.constructor = EChartsColumnStacked;

EChartsColumnStacked.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
};

EChartsColumnStacked.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsColumnCalculatedStackedOptionBuilder2.default();
    } else {
        return new _echartsColumnStackedOptionBuilder2.default();
    }
};

exports.default = EChartsColumnStacked;

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsColumnOptionBuilder = __webpack_require__(152);

var _echartsColumnOptionBuilder2 = _interopRequireDefault(_echartsColumnOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnStackedOptionBuilder() {
    _echartsColumnOptionBuilder2.default.call(this);
}

EChartsColumnStackedOptionBuilder.prototype = Object.create(_echartsColumnOptionBuilder2.default.prototype);
EChartsColumnStackedOptionBuilder.prototype.constructor = EChartsColumnStackedOptionBuilder;

EChartsColumnStackedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisPointerShadow');
    _echartsColumnOptionBuilder2.default.prototype._setUpOptions.call(this);
    this._registerDecorator('yAxisScaleFalse');
    this._registerDecorator('seriesStacked');
    this._registerDecorator('axisLineOnZeroTrue');
    this.setSeriesKeyColumns(this.plotOptions.stackBy[0].selected);
};

EChartsColumnStackedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsColumnOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    return seriesItem;
};

EChartsColumnStackedOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

exports.default = EChartsColumnStackedOptionBuilder;

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsScatterOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsScatterOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsScatterOptionBuilder.prototype.constructor = EChartsScatterOptionBuilder;

EChartsScatterOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsAxisTypeOptionBuilder2.default.prototype._defaultOptions.call(this);
    $.extend(true, opt, {
        dataZoom: [{
            id: 'insideZoomX',
            type: 'inside',
            filterMode: 'filter',
            xAxisIndex: [0],
            disabled: true
        }, {
            id: 'insideZoomY',
            type: 'inside',
            filterMode: 'filter',
            yAxisIndex: [0],
            disabled: true
        }]
    });
    return opt;
};

EChartsScatterOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'trendLine'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltip');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this._registerDecorator('axisRange');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsScatterOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData();
    var keyIndexes = this.getSeriesKeyColumnIndexes(0);
    var yAxisSelected = this.filterNullColumn(this.bOptions.yAxis[0].selected);
    var xAxisName = _optionUtils2.default.getColumnLabel(this.bOptions.xAxis[0].selected[0]);
    var isMultiAxis = yAxisSelected.length > 1 ? true : false;
    var i, row, seriesItem, yAxisIndex, seriesKey, seriesKeyList, yAxisName, multiSeriesMap;

    for (i in localData.data) {
        row = localData.data[i];
        multiSeriesMap = {};

        for (yAxisIndex = 0; yAxisIndex < yAxisSelected.length; yAxisIndex++) {
            seriesKeyList = [];
            yAxisName = _optionUtils2.default.getColumnLabel(yAxisSelected[yAxisIndex]);
            if (isMultiAxis) {
                seriesKeyList = this.getCellText(row, keyIndexes, yAxisName);
            } else {
                seriesKeyList = this.getCellText(row, keyIndexes);
            }

            if (multiSeriesMap[yAxisName]) continue;

            seriesKey = seriesKeyList.join(' ');
            seriesItem = this._getSeriesItem(series, seriesKey);
            series[seriesKey] = seriesItem;

            if (!seriesItem.extractor) {
                seriesItem.extractor = this._newSeriesExtractor({
                    yAxisIndex: yAxisIndex
                });
                seriesItem.extractor.keys = seriesKeyList;
                seriesItem.name = seriesKey;
                seriesItem.keys = seriesItem.extractor.keys;

                seriesItem.sortOrder = yAxisIndex;

                seriesItem.tooltipHeaders = [xAxisName, yAxisName];
            }
            seriesItem.extractor.push(row, i);
            multiSeriesMap[yAxisName] = true;
        }
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

exports.default = EChartsScatterOptionBuilder;

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsPointBycolumnnamesExtractor = __webpack_require__(36);

var _echartsPointBycolumnnamesExtractor2 = _interopRequireDefault(_echartsPointBycolumnnamesExtractor);

var _echartsScatterByrowindexOptionBuilder = __webpack_require__(43);

var _echartsScatterByrowindexOptionBuilder2 = _interopRequireDefault(_echartsScatterByrowindexOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsScatterByColumnNamesOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsScatterByColumnNamesOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsScatterByColumnNamesOptionBuilder.prototype.constructor = EChartsScatterByColumnNamesOptionBuilder;

EChartsScatterByColumnNamesOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine'];
    this._registerDecorator('axisTypeByColumnNames');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipByColumnNames');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsScatterByColumnNamesOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointBycolumnnamesExtractor2.default();

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

exports.default = EChartsScatterByColumnNamesOptionBuilder;

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeComplexOptionBuilder = __webpack_require__(35);

var _echartsAxisTypeComplexOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeComplexOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsScatterComplexOptionBuilder() {
    _echartsAxisTypeComplexOptionBuilder2.default.call(this);
} /**
   * Created by sds on 2018-01-24.
   */


EChartsScatterComplexOptionBuilder.prototype = Object.create(_echartsAxisTypeComplexOptionBuilder2.default.prototype);
EChartsScatterComplexOptionBuilder.prototype.constructor = EChartsScatterComplexOptionBuilder;

EChartsScatterComplexOptionBuilder.prototype._setUpOptions = function () {
    _echartsAxisTypeComplexOptionBuilder2.default.prototype._setUpOptions.call(this);
    this._registerDecorator('marker');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};
exports.default = EChartsScatterComplexOptionBuilder;

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _d3Wrapper = __webpack_require__(271);

var _d3Wrapper2 = _interopRequireDefault(_d3Wrapper);

var _d3DecisiontreeOptionBuilder = __webpack_require__(159);

var _d3DecisiontreeOptionBuilder2 = _interopRequireDefault(_d3DecisiontreeOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function D3DecisionTree(parentId, options) {
    _d3Wrapper2.default.call(this, parentId, options);
} /**
   * Source: D3-network.js
   * Created by daewon.park on 2017-03-30.
   */


D3DecisionTree.prototype = Object.create(_d3Wrapper2.default.prototype);
D3DecisionTree.prototype.constructor = D3DecisionTree;

D3DecisionTree.prototype._init = function () {
    _d3Wrapper2.default.prototype._init.call(this);
    this.seriesHelper = new _d3DecisiontreeOptionBuilder2.default();
};

D3DecisionTree.prototype._chartInit = function ($parent) {

    var _this = this;

    var div_w = this.d3chart.getMainContainer().clientWidth;
    var div_h = this.d3chart.getMainContainer().clientHeight;
    //OPTION Margin top=40, right=10, bottom=40, left=20
    this.margin = { top: 100, right: 10, bottom: 40, left: 10 };
    var width = div_w - this.margin.right - this.margin.left,
        height = div_h - this.margin.top - this.margin.bottom;

    this.svg = this.d3chart.svg.attr("width", width + this.margin.right + this.margin.left).attr("viewBox", "0 0 " + div_w + " " + div_h).attr("height", height + this.margin.top + this.margin.bottom);

    // this.d3chart.nodeTooltip.html(function (d, l) {
    //     var nodeLabels = [];
    //
    //     for (var i in d.data.nodeLabel) {
    //         if (d.data.nodeLabel[i] != '')
    //             nodeLabels.push(d.data.nodeLabel[i])
    //     }
    //     var linkLabels = '', lastNodeLabel = '';
    //     if (d.parent.data.nodeLabel) {
    //         lastNodeLabel = d.parent.data.nodeLabel[d.parent.data.nodeLabel.length - 1] ? d.parent.data.nodeLabel[d.parent.data.nodeLabel.length - 1] : '';
    //     }
    //     if (lastNodeLabel != '') {
    //         if ($.inArray(d.data.id, d.parent.data.leaf) == 0) {
    //             if (d.parent.data.linkLabel)
    //                 linkLabels = lastNodeLabel + '<=' + d.parent.data.linkLabel;
    //         } else if ($.inArray(d.data.id, d.parent.data.leaf) == 1) {
    //             if (d.parent.data.linkLabel)
    //                 linkLabels = lastNodeLabel + '>' + d.parent.data.linkLabel;
    //         } else {
    //             linkLabels = ''
    //         }
    //     }
    //
    //     return "<span>Node Info : " + nodeLabels.join('<br/>') + "</span></br>" +
    //         "<span style='color: red '>Link Info : " + linkLabels + "</span>";
    // });

    // this.d3chart.linkTooltip.html(function (d, l) {
    //     var linkLabels = '';
    //     var lastNodeLabel = '';
    //     if (d.parent.data.nodeLabel) {
    //         lastNodeLabel = d.parent.data.nodeLabel[d.parent.data.nodeLabel.length - 1] ? d.parent.data.nodeLabel[d.parent.data.nodeLabel.length - 1] : '';
    //         ;
    //     }
    //     if (lastNodeLabel != '') {
    //         if ($.inArray(d.data.id, d.parent.data.leaf) == 0) {
    //             if (d.parent.data.linkLabel)
    //                 linkLabels = lastNodeLabel + '<=' + d.parent.data.linkLabel;
    //         } else if ($.inArray(d.data.id, d.parent.data.leaf) == 1) {
    //             if (d.parent.data.linkLabel)
    //                 linkLabels = lastNodeLabel + '>' + d.parent.data.linkLabel;
    //         } else {
    //
    //         }
    //     }
    //     return "<span>" + linkLabels + "</span>";
    // });

    this.svg = this.d3chart.svg.attr("width", width + this.margin.right + this.margin.left).attr("viewBox", "0 0 " + div_w + " " + div_h).attr("height", height + this.margin.top + this.margin.bottom);

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.top + "," + this.margin.left + ")").call(this.d3chart.nodeTooltip);
    // .call(this.d3chart.linkTooltip);

    // Moving tooltips
    // this.d3chart.parent.append(this.d3chart.nodeTooltip);
    // this.d3chart.parent.append(this.d3chart.linkTooltip);
    // document.getElementById('outlineParent').appendChild(
    //     document.getElementById('d3-tip')
    // );
    // document.getElementById('outlineParent').appendChild(
    //     document.getElementById('d3-tip2')
    // );

    this.nodeFigure = {
        width: 50,
        height: 150,
        hDistance: 100,
        vDistance: 60
    };
    var nodeWidth = 50;
    var nodeHeight = 150;
    var horizontalSeparationBetweenNodes = 50;
    var verticalSeparationBetweenNodes = 60;

    this.decisionTree = d3.tree()
    // .size([width, height])
    .nodeSize([this.nodeFigure.width + this.nodeFigure.hDistance, this.nodeFigure.height + this.nodeFigure.vDistance]).separation(function (a, b) {
        return a.parent == b.parent ? 1.5 : 1;
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

D3DecisionTree.prototype._wrap = function (text) {
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
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(words[i]);
                lineNumber++;
            }
        }
    });
};

D3DecisionTree.prototype.diagonal = function (s, d) {
    return "M " + s.x + " " + s.y + "C " + d.x + " " + d.y + "," + d.x + " " + d.y + "," + d.x + " " + d.y;
};

D3DecisionTree.prototype.updateScale = function (nodes) {

    var _this = this;

    if (!nodes) {
        nodes = this.nodes;
    }
    if (nodes.length == 0) return;
    var minX = d3.min(nodes, function (d) {
        return d.x;
    });
    var minY = d3.min(nodes, function (d) {
        return d.y;
    });

    var maxX = d3.max(nodes, function (d) {
        // return d.x + 100;
        return d.x + _this.nodeFigure.width + _this.nodeFigure.hDistance;
    });
    var maxY = d3.max(nodes, function (d) {
        return d.y + _this.nodeFigure.height + _this.nodeFigure.vDistance;
    });
    var maxDepth = d3.max(nodes, function (d) {
        return d.depth;
    });

    var xWidth = maxX - minX;
    var yHeight = maxY - minY;

    // var xScale = 1 / ((xWidth / (this.d3chart.getMainContainer().clientWidth - 10 - 10)) == 0 ? 1 : (xWidth / (this.d3chart.getMainContainer().clientWidth - 10 - 10)));
    var xScale = 1 / (xWidth / this.d3chart.getMainContainer().clientWidth == 0 ? 1 : xWidth / this.d3chart.getMainContainer().clientWidth);
    // var yScale = 1 / ((yHeight / (this.d3chart.getMainContainer().clientHeight - 100 - 40)) == 0 ? 1 : (yHeight / (this.d3chart.getMainContainer().clientHeight - 100 - 40)));
    var yScale = 1 / (yHeight / this.d3chart.getMainContainer().clientHeight == 0 ? 1 : yHeight / this.d3chart.getMainContainer().clientHeight);
    this.minScale = Math.min(xScale, yScale);
    if (this.minScale > 1) this.minScale = 1;
    // var nodeHeight = ((this.d3chart.getMainContainer().clientHeight - 100 - 40) / maxDepth) / yScale;
    var nodeHeight = this.d3chart.getMainContainer().clientHeight / maxDepth / yScale;

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        if (minX < 0) {
            if (d.x == minX) {}
            d.x = d.x - minX;
        }
        if (d.depth == 1) {}
        return d.y = d.depth * nodeHeight;
    });

    this.zoom = d3.zoom().scaleExtent([this.minScale / 10, 5]).on("zoom", _this.redraw.bind(this));
    this.svg.call(this.zoom);
    this.zoom.scaleTo(this.svg, this.minScale);
    // this.zoom.translateBy(this.svg, -(parseInt(d3.zoomTransform(this.svg.node()).x) - 10) / this.minScale + (this.d3chart.getMainContainer().clientWidth / 2) * this.minScale, -(parseInt(d3.zoomTransform(this.svg.node()).y) - 20) / this.minScale);

    var svgTranslateX = parseInt(d3.zoomTransform(this.svg.node()).x);
    var svgTranslateY = parseInt(d3.zoomTransform(this.svg.node()).y);
    var mainContainerX = this.d3chart.getMainContainer().clientWidth / 2 - this.margin.left;
    var mainContainerY = (this.d3chart.getMainContainer().clientHeight + 50) / 2;
    var x = svgTranslateX / this.minScale - mainContainerX * this.minScale;
    var y = svgTranslateY / this.minScale;

    this.zoom.translateBy(this.svg, -x, -y);
    // this.zoom.translateTo(this.svg, x, y);
};

D3DecisionTree.prototype.getAllNodes = function (source) {
    var root = d3.hierarchy(source, function (d) {
        return d.children;
    });
    var treeData = this.decisionTree(root);
    var nodes = treeData.descendants();
    nodes = nodes.filter(function (d) {
        return d.depth != 0;
    });

    return nodes;
};

D3DecisionTree.prototype.computedGroupByTextLength = function (element, data) {
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

D3DecisionTree.prototype.update = function (options) {
    this.g.selectAll('*').remove();
    // this.svg.attr("viewBox", "0 0 " + this.d3chart.getMainContainer().clientWidth + " " + this.d3chart.getMainContainer().clientHeight)
    //     .attr("width", this.d3chart.getMainContainer().clientWidth)
    //     .attr("height", this.d3chart.getMainContainer().clientHeight);
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

    var source = options.series[0].data;

    var root = d3.hierarchy(source, function (d) {
        return d.children;
    });

    var treeData = this.decisionTree(root);
    this.nodes = treeData.descendants();
    var links = treeData.descendants().slice(1);
    // root.x0 = (parseInt(this.d3chart.getMainContainer().clientWidth) - 10 - 10) / 2;


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
    .attr('r', function (d) {
        if (d.depth === 1) {
            return symbolSize * 10 + 50;
        }
        return symbolSize * 10;
    }).style("stroke-width", "0.3px").style('stroke', '#000').style("fill", function (d) {
        if (d.depth === 1) {
            return symbolColor ? symbolColor : "steelblue";
        }
        // return d.children ? "lightsteelblue" : "steelblue";
        return symbolColor ? symbolColor : "steelblue";
    });

    nodeEnter.append('rect').attr('class', 'rootNode').attr("width", 0).attr("height", 0).attr("y", 0).attr("x", 0).style("stroke-width", "0.3px").style('stroke', '#000').style("fill", '#FDF5E6');

    nodeEnter.append("text").attr('class', 'rootNode').attr("dy", ".35em").style("stroke-width", 1).attr("fill", nodeFontColor).attr("font-family", nodeFontFamily ? nodeFontFamily : "Arial, Helvetica, sans-serif").style("font-style", nodeFontStyle).style("font-size", nodeFontSize + 'px').style("font-weight", nodeFontWeight)
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
    var text = nodeEnter.append('text').attr('class', 'nodeText').attr("dy", ".35em").attr("fill", nodeFontColor).attr("font-family", nodeFontFamily ? nodeFontFamily : "Arial, Helvetica, sans-serif").style("font-style", nodeFontStyle).style("font-size", nodeFontSize + 'px').style("font-weight", nodeFontWeight)
    //.attr("x", function(d) {
    //return d.children || d._children ? 18 : 13;
    //})
    .attr("y", function (d) {
        var y = 15;
        if (d.rectHeight) {
            y = d.rectHeight / 2;
        }
        return d.children || d.children ? -y : -y;
    }).attr("text-anchor", 'middle').text(function (d) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            var nodeLabel = [];
            for (var i in d.data.nodeLabel) {
                nodeLabel.push(d.data.nodeLabel[i]);
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
    nodeUpdate.select('circle.node').attr('r', function (d) {
        if (d.depth === 1) {
            return symbolSize * 10 * 2;
        }
        return symbolSize * 10;
    }).attr('opacity', symbolOpacity ? symbolOpacity : 1).style("fill", function (d) {
        if (d.depth === 1) {
            return symbolColor ? symbolColor : "steelblue";
        }
        return symbolColor ? symbolColor : "steelblue";
    }).attr('cursor', 'pointer');

    nodeUpdate.select("text.nodeText").attr("fill", nodeFontColor).attr("font-family", nodeFontFamily ? nodeFontFamily : "Arial, Helvetica, sans-serif").style("font-style", nodeFontStyle).style("font-size", nodeFontSize + 'px').style("font-weight", nodeFontWeight).text(function (d) {
        if (_this.options.plotOptions.decisionTree.label.normal.show) {
            var nodeLabel = [];
            for (var i in d.data.nodeLabel) {
                nodeLabel.push(d.data.nodeLabel[i]);
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
    }).attr("marker-start", "url(#end)");

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition().attr('d', function (d) {
        if (d.depth == 1) {
            d.parent.y = -180;
        }
        return _this.diagonal(d, d.parent);
    }).style("stroke-width", linkWidth + 'px').style('stroke', linkColor);

    // if (this.options.tooltip.triggerOn === 'mousemove') {
    //     linkUpdate
    //         .on('mouseover', this.d3chart.linkTooltip.show)
    //         .on('click', null)
    //         .on('mouseout', this.d3chart.linkTooltip.hide);
    // } else {
    //     linkUpdate
    //         .on('click', this.d3chart.linkTooltip.show)
    //         .on('mouseover', null)
    //         .on('mouseout', this.d3chart.linkTooltip.hide);
    // }
    link.exit().transition().remove();

    var linktext = this.g.selectAll('g.link').data(links, function (d) {
        return d.id;
    });

    linktext.enter().append("g").attr('class', 'linktext').attr("transform", function (d) {
        return "translate(" + (d.x + d.parent.x) / 2 + "," + (d.y + d.parent.y) / 2 + ")";
    }).attr('d', function (d) {
        var o = { y: d.y, x: d.x };
        if (d.depth == 1) {
            o.y = -180;
        }
        return _this.diagonal(o, o);
    }).attr("class", "link").append("text").attr("dy", ".35em").attr("text-anchor", "middle").attr("fill", linkFontColor).attr("font-family", linkFontFamily ? linkFontFamily : "Arial, Helvetica, sans-serif").style("font-style", linkFontStyle).style("font-size", linkFontSize + 'px').style("font-weight", linkFontWeight).text(function (d) {
        if (_this.options.plotOptions.decisionTree.linkLabel.normal.show) {
            if (d.parent.data.linkLabel && d.parent.data.linkLabel.length > 0) {
                if ($.inArray(d.data.id, d.parent.data.leaf) == 0) {
                    return '<=' + d.parent.data.linkLabel;
                }
                return '>' + d.parent.data.linkLabel;
            }
        }
    });
    linktext.transition().attr('d', function (d) {
        var o = { y: d.y, x: d.x };
        if (d.depth == 1) {
            o.y = -180;
        }
        return _this.diagonal(o, o);
    });

    linktext.transition().select('text').attr("fill", linkFontColor).attr("font-family", linkFontFamily ? linkFontFamily : "Arial, Helvetica, sans-serif").style("font-style", linkFontStyle).style("font-size", linkFontSize + 'px').style("font-weight", linkFontWeight).text(function (d) {
        if (_this.options.plotOptions.decisionTree.linkLabel.normal.show) {
            if (d.parent.data.linkLabel && d.parent.data.linkLabel.length > 0) {
                if ($.inArray(d.data.id, d.parent.data.leaf) == 0) {
                    return '<=' + d.parent.data.linkLabel;
                }
                return '>' + d.parent.data.linkLabel;
            }
        }
    });

    // if (this.options.tooltip.triggerOn === 'mousemove') {
    //     linktext.select('text')
    //         .on('mouseover', this.d3chart.linkTooltip.show)
    //         .on('click', null)
    //         .on('mouseout', this.d3chart.linkTooltip.hide);
    // } else {
    //     linktext.select('text')
    //         .on('click', this.d3chart.linkTooltip.show)
    //         .on('mouseover', null)
    //         .on('mouseout', this.d3chart.linkTooltip.hide);
    // }


    linktext.exit().transition().remove();

    this.nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
};

D3DecisionTree.prototype.redraw = function () {
    var currentTransform = d3.event.transform;
    this.g.attr("transform", currentTransform);
};

D3DecisionTree.prototype.render = function () {
    var opt = this.seriesHelper.buildOptions(this.options);

    opt.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];
        var fromColLabel = _optionUtils2.default.getColumnLabel(this.seriesHelper.getFromColumn()[0]);
        toolItems.push(''.concat(fromColLabel, ' : ', params.data.from));
        if (params.parent.data.from) {
            toolItems.push(''.concat('Link', ' : ', params.parent.data.from, ' -> ', params.data.from));
        }
        for (var i in this.seriesHelper.getNodeLabelColumn()) {
            var nodeLabel = _optionUtils2.default.getColumnLabel(this.seriesHelper.getNodeLabelColumn()[i]);
            var nodeColor = this.options.plotOptions.decisionTree.style.node.color[0];
            toolItems.push(''.concat('<span style="color: ', nodeColor, '">', nodeLabel, ' : ', params.data.nodeLabel[i], '</span>'));
        }
        for (var i in this.seriesHelper.getLinkLabelColumn()) {
            var previousNodeLabel = '';
            if (params.parent.data.nodeLabel) {
                previousNodeLabel = params.parent.data.nodeLabel[params.parent.data.nodeLabel.length - 1] ? params.parent.data.nodeLabel[params.parent.data.nodeLabel.length - 1] : '';
            }
            if (previousNodeLabel != '') {
                var linkColor = this.options.plotOptions.decisionTree.style.link.color[0];
                if ($.inArray(params.data.id, params.parent.data.leaf) == 0) {
                    toolItems.push(''.concat('<span style="color: ', linkColor, '">', previousNodeLabel, ' <= ', params.parent.data.linkLabel[i]), '</span>');
                } else if ($.inArray(params.data.id, params.parent.data.leaf) == 1) {
                    toolItems.push(''.concat('<span style="color: ', linkColor, '">', previousNodeLabel, ' > ', params.parent.data.linkLabel[i]), '</span>');
                }
            }
        }
        return toolItems.join('<br>');
    };
    this._bindInternalOptions(this.seriesHelper);
    this.update(opt);
};

D3DecisionTree.prototype.getLegendData = function () {
    var legendData = [];
    return legendData;
};

exports.default = D3DecisionTree;

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d3OptionBuilder = __webpack_require__(273);

var _d3OptionBuilder2 = _interopRequireDefault(_d3OptionBuilder);

var _d3DecisiontreeExtractor = __webpack_require__(161);

var _d3DecisiontreeExtractor2 = _interopRequireDefault(_d3DecisiontreeExtractor);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function D3DecisionTreeOptionBuilder(parentId, options) {
    _d3OptionBuilder2.default.call(this, parentId, options);
} /**
   * Created by sds on 2018-03-19.
   */

/**
 * DecitionTree Option Builder
 * @param parentId
 * @param options
 * @constructor
 */


D3DecisionTreeOptionBuilder.prototype = Object.create(_d3OptionBuilder2.default.prototype);
D3DecisionTreeOptionBuilder.prototype.constructor = D3DecisionTreeOptionBuilder;

D3DecisionTreeOptionBuilder.prototype._defaultOptions = function () {
    var opt = _d3OptionBuilder2.default.prototype._defaultOptions.call(this);
    // opt.color.splice(0,1);
    delete opt.xAxis;
    delete opt.yAxis;
    delete opt.brush;
    return opt;
};

D3DecisionTreeOptionBuilder.prototype._newSeriesItem = function () {
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

D3DecisionTreeOptionBuilder.prototype.getFromColumn = function () {
    return this.bOptions.plotOptions.decisionTree.fromColumn[0].selected;
};

D3DecisionTreeOptionBuilder.prototype.getToColumn = function () {
    return this.bOptions.plotOptions.decisionTree.toColumn[0].selected;
};

D3DecisionTreeOptionBuilder.prototype.getGroupByColumn = function () {
    return this.bOptions.plotOptions.decisionTree.groupByColumn[0].selected;
};

D3DecisionTreeOptionBuilder.prototype.getNodeLabelColumn = function () {
    return this.bOptions.plotOptions.decisionTree.nodeLabelColumn[0].selected;
};

D3DecisionTreeOptionBuilder.prototype.getLinkLabelColumn = function () {
    return this.bOptions.plotOptions.decisionTree.linkLabelColumn[0].selected;
};

D3DecisionTreeOptionBuilder.prototype.getSeriesKeyColumns = function () {
    return [];
};

D3DecisionTreeOptionBuilder.prototype.getSeriesDataColumns = function () {
    return [];
};

D3DecisionTreeOptionBuilder.prototype._buildCategory = function () {};

D3DecisionTreeOptionBuilder.prototype.getColumnIndexes = function (column, allColumns) {
    return _optionUtils2.default.getColumnIndexes(column.length > 0 ? this.filterNullColumn(column) : [], allColumns);
};

D3DecisionTreeOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.bOptions.source.localData[0];

    var fromColumn = this.getFromColumn();
    var fromColumnIndex = this.getColumnIndexes(fromColumn, localData.columns);

    var toColumn = this.getToColumn();
    var toColumnIndex = this.getColumnIndexes(toColumn, localData.columns);

    var groupByColumn = this.getGroupByColumn();
    var groupByColumnIndex = this.getColumnIndexes(groupByColumn, localData.columns);

    var nodeLabelColumn = this.getNodeLabelColumn();
    var nodeLabelColumnIndex = this.getColumnIndexes(nodeLabelColumn, localData.columns);

    var linkLabelColumn = this.getLinkLabelColumn();
    var linkLabelColumnIndex = this.getColumnIndexes(linkLabelColumn, localData.columns);

    if ($.inArray(fromColumnIndex[0], toColumnIndex) > -1) {
        this._throwValidation('The same column name exists in from and to column.');
    }

    return new _d3DecisiontreeExtractor2.default(groupByColumnIndex, fromColumnIndex, toColumnIndex, nodeLabelColumnIndex, linkLabelColumnIndex);
};

D3DecisionTreeOptionBuilder.prototype._buildSeriesData = function () {

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

D3DecisionTreeOptionBuilder.prototype._setParentId = function (source) {
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

exports.default = D3DecisionTreeOptionBuilder;

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by sds on 2018-03-19.
 */
/**
 * D3 의 Series Data 를 생성
 * @param columnIndexes
 * @constructor
 */
function SeriesDataExtractor(columnIndexes) {
  this.columnIndexes = columnIndexes;
  this.points = [];
}

SeriesDataExtractor.prototype.push = function (row, rowIndex) {};

SeriesDataExtractor.prototype.extract = function () {
  return this.points;
};

exports.default = SeriesDataExtractor;

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _d3AggregationExtractor = __webpack_require__(54);

var _d3AggregationExtractor2 = _interopRequireDefault(_d3AggregationExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-03-19.
 */

/**
 * X 축의 값이 category, Y 축의 값이 aggregation 된 형태의 Series Data 를 생성
 * @param columnIndexes
 * @constructor
 */
function DecisionTreeDataExtractor(groupByColumnIndex, fromColumnIndex, toColumnIndex, nodeLabelColumnIndex, linkLabelColumnIndex) {
    _d3AggregationExtractor2.default.call(this, []);
    this.fromColumnIndex = fromColumnIndex;
    this.toColumnIndex = toColumnIndex;
    this.groupByColumnIndex = groupByColumnIndex;
    this.nodeLabelColumnIndex = nodeLabelColumnIndex;
    this.linkLabelColumnIndex = linkLabelColumnIndex;
    this._nodeOperators = {};
    this._targetNodeOperators = {};
    this._nodes = {};
    this._targetNodes = {};
}

DecisionTreeDataExtractor.prototype = Object.create(_d3AggregationExtractor2.default.prototype);
DecisionTreeDataExtractor.prototype.constructor = DecisionTreeDataExtractor;

DecisionTreeDataExtractor.prototype._pushTargetNodes = function (row, rowIndex) {
    this._targetNodes[row[this.toColumnIndex]] = this._targetNodes[row[this.toColumnIndex]] || {};
    var targetNode = this._targetNodes[row[this.toColumnIndex]];
    targetNode.name = targetNode.name || row[this.toColumnIndex];

    var targetNodeOperator = this._targetNodeOperators[targetNode.name];
    if (!targetNodeOperator) {
        targetNodeOperator = new _aggregationOperator2.default(targetNode.name);
        this._targetNodeOperators[targetNode.name] = targetNodeOperator;
    }

    targetNodeOperator.add(rowIndex, 1);
    if (this.groupByColumnIndex) {
        targetNodeOperator.parent = row[this.groupByColumnIndex] + '::' + row[this.fromColumnIndex];
    } else {
        targetNodeOperator.parent = row[this.fromColumnIndex];
    }
};

DecisionTreeDataExtractor.prototype._getLabels = function (row, indexes) {
    var linkLabels = [];
    for (var i in indexes) {
        linkLabels.push(row[indexes[i]]);
    }
    return linkLabels;
};

DecisionTreeDataExtractor.prototype._pushNodes = function (row, rowIndex) {
    if (this.groupByColumnIndex) {
        var groupKeys = [];
        for (var i in this.groupByColumnIndex) {
            groupKeys.push(row[this.groupByColumnIndex[i]]);
        }

        this._nodes[groupKeys.join('::') + '::' + row[this.fromColumnIndex]] = this._nodes[groupKeys.join('::') + '::' + row[this.fromColumnIndex]] || {};
        var node = this._nodes[groupKeys.join('::') + '::' + row[this.fromColumnIndex]];
        node.name = node.name || groupKeys.join('::') + '::' + row[this.fromColumnIndex];
        node.leaf = [];
        for (var j in this.toColumnIndex) {
            if (row[this.toColumnIndex[j]] != -1) {
                node.leaf.push(groupKeys.join('::') + '::' + row[this.toColumnIndex[j]]);
            }
        }
        var nodeOperator = this._nodeOperators[node.name];
        if (!nodeOperator) {
            nodeOperator = new _aggregationOperator2.default(node.name);
            nodeOperator.leaf = node.leaf;
            nodeOperator.nodeLabel = this._getLabels(row, this.nodeLabelColumnIndex);
            nodeOperator.linkLabel = this._getLabels(row, this.linkLabelColumnIndex);
            nodeOperator.groupByLabel = this._getLabels(row, this.groupByColumnIndex);
            nodeOperator.from = row[this.fromColumnIndex];
            this._nodeOperators[node.name] = nodeOperator;
        }
    } else {
        this._nodes[row[this.fromColumnIndex]] = this._nodes[row[this.fromColumnIndex]] || {};
        var node = this._nodes[row[this.fromColumnIndex]];
        node.name = node.name || row[this.fromColumnIndex];
        node.leaf = [];
        for (var j in this.toColumnIndex) {
            if (row[this.toColumnIndex[j]] != -1) node.leaf.push(row[this.fromColumnIndex] + '::' + row[this.toColumnIndex[j]]);
        }
        var nodeOperator = this._nodeOperators[node.name];
        if (!nodeOperator) {
            nodeOperator = new _aggregationOperator2.default(node.name);
            nodeOperator.leaf = node.leaf;
            nodeOperator.nodeLabel = this._getLabels(row, this.nodeLabelColumnIndex);
            nodeOperator.linkLabel = this._getLabels(row, this.linkLabelColumnIndex);
            nodeOperator.groupByLabel = this._getLabels(row, this.groupByColumnIndex);
            nodeOperator.from = row[this.fromColumnIndex];
            this._nodeOperators[node.name] = nodeOperator;
        }
    }
};

DecisionTreeDataExtractor.prototype.push = function (row, rowIndex) {
    //
    this._pushNodes(row, rowIndex);
};

DecisionTreeDataExtractor.prototype.nodeExtract = function (operator) {
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

exports.default = DecisionTreeDataExtractor;

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsHeatmapMatrixCalculatedExtoractor = __webpack_require__(281);

var _echartsHeatmapMatrixCalculatedExtoractor2 = _interopRequireDefault(_echartsHeatmapMatrixCalculatedExtoractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsHeatmapMatrixCalculatedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsHeatmapMatrixCalculatedOptionBuilder.prototype.constructor = EChartsHeatmapMatrixCalculatedOptionBuilder;

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsOptionBuilder2.default.prototype._defaultOptions.call(this);
    opt.xAxis[0].type = 'category';
    opt.xAxis[0].data = [];
    opt.yAxis[0].type = 'category';
    opt.yAxis[0].data = [];
    opt.dataZoom = this.bOptions.dataZoom;
    opt.visualMap = {};
    return opt;
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('brushRemoval');
    this._registerDecorator('tooltipHeatmapMatrix');
    this._registerDecorator('visualMap');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype._buildSeriesData = function () {
    for (var s in this.series) {
        this.series[s].type = 'heatmap';
        this.series[s].data = this.series[s].extractor.extract();
        this.series[s].largeThreshold = this.series[s].data.length + 10;
        this.eOptions.xAxis[0].data = this._getCategories(this.bOptions.xAxis[0].selected);
        this.eOptions.yAxis[0].data = this.series[s].extractor.yCategories();
        this.eOptions.visualMap.min = Math.floor(this.series[s].extractor.min);
        this.eOptions.visualMap.max = Math.ceil(this.series[s].extractor.max);
    }
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype.getSeriesDataColumns = function () {
    return this.bOptions.xAxis[0].selected;
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype._newSeriesExtractor = function (dataLength) {
    var allColumns = this.getAllColumns();
    var yAxisIndex = this.getColumnIndexes(this.bOptions.yAxis[0].selected, allColumns);
    var columnIndexes = this.getSeriesDataColumnIndexes();
    return new _echartsHeatmapMatrixCalculatedExtoractor2.default(columnIndexes, yAxisIndex, dataLength);
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype._getCategories = function (axis) {
    var categories = [];
    for (var i in axis) {
        if (axis[i] && axis[i].name) {
            categories.push(axis[i].name);
        }
    }
    return categories;
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);

    var heatmapOptions = this.bOptions.plotOptions.heatmap;
    var attributes = [];
    this._applySeriesOptions(seriesItem, heatmapOptions, attributes);

    return seriesItem;
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype._buildTooltip = function () {
    var _this = this;
    var xAxisCategories = this._getCategories(this.bOptions.xAxis[0].selected);
    var yAxisCategories = this.eOptions.series[0].extractor.yCategories();
    _this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        if (params.seriesType === 'heatmap') {
            return ['X-Axis : ' + xAxisCategories[params.data[0]], 'Y-Axis : ' + yAxisCategories[params.data[1]], 'Value: ' + params.data[2]].join('<br/>');
        }
    };
};

EChartsHeatmapMatrixCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    return [];
};

exports.default = EChartsHeatmapMatrixCalculatedOptionBuilder;

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsHistogramExtractor = __webpack_require__(164);

var _echartsHistogramExtractor2 = _interopRequireDefault(_echartsHistogramExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsHistogramOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsHistogramOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsHistogramOptionBuilder.prototype.constructor = EChartsHistogramOptionBuilder;

EChartsHistogramOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeValue');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('axisLineOnZeroFalse');
    this._registerDecorator('xAxisBoundaryGapFalse');
    this._registerDecorator('yAxisScaleFalse');
    this._registerDecorator('xAxisRangeForHistogram');
    this._registerDecorator('TooltipTriggerForceItemDecorator');
    this._registerDecorator('tooltipHistogram');

    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
};

EChartsHistogramOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsAxisTypeOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'custom';
    seriesItem.encode = {
        x: [0, 1],
        y: 2,
        tooltip: 2,
        label: 2
    };
    seriesItem.itemStyle = {
        normal: {}
    };
    seriesItem.renderItem = function (params, api) {
        var yValue = api.value(2);
        var start = api.coord([api.value(0), yValue]);
        var size = api.size([api.value(1) - api.value(0), yValue]);
        var style = api.style();

        return {
            type: 'rect',
            shape: echarts.graphic.clipRectByRect({
                x: start[0] + 1,
                y: start[1],
                width: size[0] - 1,
                height: size[1]
            }, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            }),
            style: style
        };
    };

    return seriesItem;
};

EChartsHistogramOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var columnIndexes = this.getSeriesDataColumnIndexes(0);

    var extractor = new _echartsHistogramExtractor2.default();

    extractor.setTarget({
        index: columnIndexes,
        type: 'value',
        isKey: true
    });

    var xIndex = columnIndexes[0];
    var xData = localData.data.map(function (row) {
        return row[xIndex];
    });

    var min = Math.min.apply(null, xData);
    var max = Math.max.apply(null, xData);
    if (min === max) {
        // this._throwValidation('The maximum and minimum values of this data are same.');
        xData.push(min + min / 10);
    }

    var bins = ecStat.histogram(xData, this.bOptions.plotOptions.column.binMethod);
    extractor.setBins(bins.bins);

    return extractor;
};

EChartsHistogramOptionBuilder.prototype._buildSeriesData = function () {
    this.series[0].data = this.series[0].extractor.extract();
};

exports.default = EChartsHistogramOptionBuilder;

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HistogramExtractor() {
    _echartsPointExtractor2.default.call(this);
    this._keyPointMap = {};
    this.valueList = [];
    this.min = Infinity;
    this.max = -Infinity;
}

HistogramExtractor.prototype = Object.create(_echartsPointExtractor2.default.prototype);
HistogramExtractor.prototype.constructor = HistogramExtractor;

HistogramExtractor.prototype.push = function (row, rowIndex) {
    _echartsPointExtractor2.default.prototype.push.call(this, row, rowIndex);

    var value = this._getKeyList(row, rowIndex)[0];
    this.valueList.push(value);
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
};

HistogramExtractor.prototype._getKeyPointer = function (row, rowIndex) {
    var keys = this._getKeyList(row, rowIndex);
    var bin = this._findBin(keys[0]);

    this._keyPointMap[bin] = this._keyPointMap[bin] || { value: [bin], point: [], indexList: [] };

    return this._keyPointMap[bin];
};

HistogramExtractor.prototype.setBins = function (bins) {
    this.bins = bins.map(function (bin) {
        bin.x0 = Number(bin.x0.toFixed(14));
        bin.x1 = Number(bin.x1.toFixed(14));
        bin.x = bin.x0 + (bin.x1 - bin.x0) / 2;
        bin.x = Number(bin.x.toFixed(14));
        return bin;
    });
};

HistogramExtractor.prototype._findBin = function (x) {
    for (var b in this.bins) {
        if (this.bins[b].x0 <= x && x < this.bins[b].x1) {
            return this.bins[b].x;
        }
    }
};

HistogramExtractor.prototype.extract = function () {
    var answer = [];
    for (var b in this.bins) {
        var bin = this.bins[b];
        var pointObject = this._keyPointMap[bin.x];
        if (pointObject) {
            var operator = new _aggregationOperator2.default(pointObject.value);
            for (var i = 0; i < pointObject.indexList.length; i++) {
                operator.add(pointObject.indexList[i], pointObject.point[i][1]);
            }
            answer.push({ value: [bin.x0, bin.x1, operator.calc('count')] });
        }
    }
    return answer;
};

exports.default = HistogramExtractor;

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _preferenceOptions = __webpack_require__(303);

var _preferenceOptions2 = _interopRequireDefault(_preferenceOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * Created by sds on 2017-11-07.
                                                                                                                                                                                                                   */


function PreferenceUtils() {}

/**
 * @param prefOptArr = [{
     *      type: number,
     *      digit: 3
     * },{
     * // (number 또는 exponential 하나만 가능)
     *      type: exponential,
     *      digit: 4
     * },{
     *      type: string,
     *      detail: '$'
     * }]
 */
PreferenceUtils.setTableFormatter = function (prefOptArr) {
    if (!prefOptArr || !Array.isArray(prefOptArr)) {
        return;
    }
    prefOptArr.forEach(function (prefOption) {
        if (['number', 'exponential', 'double', 'integer'].includes(prefOption.type)) {
            var parsedStr = _optionUtils2.default.parseFmtObjToStr(prefOption);
            $.extend(true, _preferenceOptions2.default.table.formatter, _defineProperty({}, prefOption.type === 'exponential' ? 'number' : prefOption.type, parsedStr));
        } else {
            console.warn('String type formatter is not implemented yet.');
            // TODO: implement type == string, jQWidgetsTableOptionBuilder.prototype._createStringRenderer
        }

        if (prefOption.pivot) {
            $.extend(true, _preferenceOptions2.default.table.formatter, { pivot: prefOption.pivot });
        }
    });
};

PreferenceUtils.getTableFormatter = function (type) {
    if (!type) {
        return _preferenceOptions2.default.table.formatter;
    } else {
        return _preferenceOptions2.default.table.formatter[type];
    }
};

PreferenceUtils.clearTableFormatter = function () {
    _preferenceOptions2.default.table.formatter = {};
};

// PreferenceUtils.setValue = function (prefOpts) {
//     PrefOptions.extend(prefOpts);
// };
//
// PreferenceUtils.getValue = function () {
//     return PrefOptions;
// };

exports.default = PreferenceUtils;

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartArea = __webpack_require__(63);

var _bchartArea2 = _interopRequireDefault(_bchartArea);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-area-stacked.js
 * Created by daewon.park on 2017-04-12.
 */
function BAreaStackedCharts(parentId, options) {
    _bchartArea2.default.call(this, parentId, options);
}

BAreaStackedCharts.prototype = Object.create(_bchartArea2.default.prototype);
BAreaStackedCharts.prototype.constructor = BAreaStackedCharts;

BAreaStackedCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BAreaStackedCharts.Attr.Key, this.$parent, this.options);
};

BAreaStackedCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            area: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.area.stackBy, options.plotOptions.area.stackBy);
    this._changeOptions(options);
    this.render(reload);
};

BAreaStackedCharts.Attr = $.extend(true, {}, _bchartArea2.default.Attr, {
    Key: 'area-stacked',
    Label: 'Stacked Area',
    Order: 31,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            mandatory: true
        },
        stackBy: {
            label: 'Stack By',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                // brush: {},
                zoom: { zoomAxis: 'xAxis' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            area: {
                smooth: true,
                stackBy: [{
                    selected: []
                }],
                marker: _defaultOptions2.default.Marker,
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                tooltip: { trigger: 'axis' }
            }
        }
    })
});

exports.default = BAreaStackedCharts;

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-bar.js
 * Created by daewon.park on 2017-04-16.
 */
function BBarCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BBarCharts.prototype = Object.create(_bchartBase2.default.prototype);
BBarCharts.prototype.constructor = BBarCharts;

BBarCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BBarCharts.Attr.Key, this.$parent, this.options);
};

BBarCharts.Attr = {
    Key: 'bar',
    Label: 'Bar',
    Order: 20,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: false,
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true
        }
    },
    //todo: 2017 pvr zoom 라이브러리 버그(filter mode)로 인한 줌기능 제거
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                brush: {},
                zoom: { zoomAxis: 'yAxis' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            bar: {
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                tooltip: { trigger: 'item' }
            }
        }
    })
};

exports.default = BBarCharts;

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBar = __webpack_require__(167);

var _bchartBar2 = _interopRequireDefault(_bchartBar);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-bar-stacked.js
 * Created by daewon.park on 2017-04-16.
 */
function BBarStackedCharts(parentId, options) {
    _bchartBar2.default.call(this, parentId, options);
}

BBarStackedCharts.prototype = Object.create(_bchartBar2.default.prototype);
BBarStackedCharts.prototype.constructor = BBarStackedCharts;

BBarStackedCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BBarStackedCharts.Attr.Key, this.$parent, this.options);
};

BBarStackedCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            bar: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.bar.stackBy, options.plotOptions.bar.stackBy);
    this._changeOptions(options);
    this.render(reload);
};

BBarStackedCharts.Attr = $.extend(true, {}, _bchartBar2.default.Attr, {
    Key: 'bar-stacked',
    Label: 'Stacked Bar',
    Order: 21,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        stackBy: {
            label: 'Stack By',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number']
        }
    },
    //todo: 2017 pvr zoom 라이브러리 버그(filter mode)로 인한 줌기능 제거
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                brush: {},
                zoom: { zoomAxis: 'yAxis' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            bar: {
                stackBy: [{
                    selected: []
                }],
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                tooltip: { trigger: 'axis' }
            }
        }
    })
});

exports.default = BBarStackedCharts;

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartColumn = __webpack_require__(55);

var _bchartColumn2 = _interopRequireDefault(_bchartColumn);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-column-stacked.js
 * Created by daewon.park on 2017-04-11.
 */
function BColumnStackedCharts(parentId, options) {
    _bchartColumn2.default.call(this, parentId, options);
}

BColumnStackedCharts.prototype = Object.create(_bchartColumn2.default.prototype);
BColumnStackedCharts.prototype.constructor = BColumnStackedCharts;

BColumnStackedCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BColumnStackedCharts.Attr.Key, this.$parent, this.options);
};

BColumnStackedCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            column: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.column.stackBy, options.plotOptions.column.stackBy);
    this._changeOptions(options);
    this.render(reload);
};

BColumnStackedCharts.Attr = {
    Key: 'column-stacked',
    Label: 'Stacked Column',
    Order: 11,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            mandatory: true
        },
        stackBy: {
            label: 'Stack By',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number']
        }
    },
    //todo: 2017 pvr zoom 라이브러리 버그(filter mode)로 인한 줌기능 제거
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                brush: {},
                zoom: { zoomAxis: 'xAxis' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            column: {
                stackBy: [{
                    selected: []
                }],
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                tooltip: { trigger: 'axis' }
            }
        }
    })
};

exports.default = BColumnStackedCharts;

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-heatmap.js
 * Created by daewon.park on 2017-04-16.
 */
function BHeatmapCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BHeatmapCharts.prototype = Object.create(_bchartBase2.default.prototype);
BHeatmapCharts.prototype.constructor = BHeatmapCharts;

BHeatmapCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BHeatmapCharts.Attr.Key, this.$parent, this.options);
};

BHeatmapCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            heatmap: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.heatmap.valueBy, options.plotOptions.heatmap.valueBy);
    this._changeOptions(options);
    this.render(reload);
};

BHeatmapCharts.Attr = {
    Key: 'heatmap',
    Label: 'Heat map',
    Order: 40,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        valueBy: {
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            label: 'Value By',
            mandatory: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        visualMap: _defaultOptions2.default.VisualMap,
        plotOptions: {
            heatmap: {
                valueBy: [{
                    selected: []
                }]
            }
        }
    })
};

exports.default = BHeatmapCharts;

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-pie.js
 * Created by daewon.park on 2017-03-30.
 */
function BPieCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BPieCharts.prototype = Object.create(_bchartBase2.default.prototype);
BPieCharts.prototype.constructor = BPieCharts;

BPieCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BPieCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BPieCharts.Attr.Key, this.$parent, this.options);
};

BPieCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }

    if (this.toolbar) {
        this.toolbar.render();
    }
};

BPieCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            pie: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.pie.sizeBy, options.plotOptions.pie.sizeBy);
    this._changeOptions(options);
    this.render(reload);
};

BPieCharts.Attr = {
    Key: 'pie',
    Label: 'Pie',
    Order: 13,
    ColumnConf: {
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true,
            mandatory: true
        },
        sizeBy: {
            label: 'Size By',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            }
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false
        },
        plotOptions: {
            pie: {
                radius: '75%',
                center: ['50%', '50%'],
                sizeBy: [{
                    selected: []
                }]
            }
        }
    })
};

exports.default = BPieCharts;

/***/ }),
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(201);

var _bcharts = __webpack_require__(62);

var _bcharts2 = _interopRequireDefault(_bcharts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bcharts-jquery.js
 * Created by daewon.park on 2017-04-13.
 */

(function ($, window, document, undefined) {

    $.fn.bcharts = function (options, propertyName, propertyValue) {
        var $el = this.first();
        try {
            if (options) {
                if (typeof options === 'string') {
                    var method = options;
                    var chart = $el.children('.bcharts-container').data('BChartsRef');
                    if (chart && typeof chart[method] === 'function') {
                        return chart[method](propertyName, propertyValue);
                    }
                } else {
                    var chart = new _bcharts2.default($el, options);
                    $el.children('.bcharts-container').data('BChartsRef', chart);
                    return this;
                }
            } else {
                return $el.children('.bcharts-container').data('BChartsRef');
            }
        } catch (e) {
            throw new Error(e.stack);
        }
    };
})(jQuery, window, document);

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _package = __webpack_require__(202);

var _package2 = _interopRequireDefault(_package);

var _bcharts = __webpack_require__(62);

var _bcharts2 = _interopRequireDefault(_bcharts);

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

var _bchartRegister = __webpack_require__(26);

var Chart = _interopRequireWildcard(_bchartRegister);

var _pagination = __webpack_require__(72);

var _columnHelper = __webpack_require__(66);

var _columnHelper2 = _interopRequireDefault(_columnHelper);

var _filterHelper = __webpack_require__(338);

var _filterHelper2 = _interopRequireDefault(_filterHelper);

var _preferenceUtils = __webpack_require__(165);

var _preferenceUtils2 = _interopRequireDefault(_preferenceUtils);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _chartValidator = __webpack_require__(65);

var _chartValidator2 = _interopRequireDefault(_chartValidator);

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

var _problemLibrary = __webpack_require__(45);

var _problemLibrary2 = _interopRequireDefault(_problemLibrary);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _chartValidatorRegister = __webpack_require__(67);

var Validator = _interopRequireWildcard(_chartValidatorRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _d3Decisiontree = __webpack_require__(158);

var _d3Decisiontree2 = _interopRequireDefault(_d3Decisiontree);

var _d3DecisiontreeOptionBuilder = __webpack_require__(159);

var _d3DecisiontreeOptionBuilder2 = _interopRequireDefault(_d3DecisiontreeOptionBuilder);

var _d3DecisiontreeExtractor = __webpack_require__(161);

var _d3DecisiontreeExtractor2 = _interopRequireDefault(_d3DecisiontreeExtractor);

var _d3AggregationExtractor = __webpack_require__(54);

var _d3AggregationExtractor2 = _interopRequireDefault(_d3AggregationExtractor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_package2.default.Chart.BCharts = _bcharts2.default; /**
                                                      * Created by sds on 2018-03-21.
                                                      */

_package2.default.Chart.Widget = _widget2.default;
_package2.default.Chart.Registry = Chart.default;
_package2.default.Chart.Component.Pagination = _pagination.Pagination;
_package2.default.Chart.Helper.ColumnHelper = _columnHelper2.default;
_package2.default.Chart.Helper.SelectionFilterHelper = _filterHelper2.default;
_package2.default.Chart.Helper.PreferenceUtils = _preferenceUtils2.default;
_package2.default.Chart.Helper.OptionUtils = _optionUtils2.default;
_package2.default.Chart.Helper.ChartUtils = _chartUtils2.default;
_package2.default.Chart.Helper.AggregationOperator = _aggregationOperator2.default;
_package2.default.Chart.Validator.ChartValidator = _chartValidator2.default;
_package2.default.Chart.Validator.selectableColumnType = _problemLibrary2.default.selectableColumnType;

//module
_package2.default.Chart.API.registerChart = Chart.registerChart;
_package2.default.Chart.API.registerChartWrapper = Wrapper.registerChartWrapper;
_package2.default.Chart.API.registerChartValidator = Validator.registerChartValidator;

_package2.default.Chart.getChartTypeList = Chart.getChartTypeList;
_package2.default.Chart.getChartAttr = Chart.getChartAttr;

_package2.default.Chart.Wrapper.getChartWrapper = Wrapper.getChartWrapper;
_package2.default.Chart.Wrapper.createChartWrapper = Wrapper.createChartWrapper;
_package2.default.Chart.WrapperRegistry = Wrapper.default;
_package2.default.Chart.Validator.ChartValidator.Base = _chartValidatorBase2.default;

_package2.default.Chart.Validator.Register = Validator;
_package2.default.Chart.Validator.Base = _chartValidatorBase2.default;
_package2.default.Chart.Validator.getChartValidator = Validator.getChartValidator;
// BChartPackage.Chart.Validator.ChartValidator.Base = ChartValidatorBase;

//ㅠㅠ

_package2.default.Chart.Wrapper.OptionBuilder = {};
_package2.default.Chart.Wrapper.OptionBuilder['decisionTree'] = _d3DecisiontreeOptionBuilder2.default;
_package2.default.Chart.Wrapper.Extractor = {};
_package2.default.Chart.Wrapper.Extractor['decisionTree'] = _d3DecisiontreeExtractor2.default;
_package2.default.Chart.Wrapper.Extractor['d3-aggregation'] = _d3AggregationExtractor2.default;

_package2.default.Chart.DefaultOption = _defaultOptions2.default;

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: package.js
 * Created by daewon.park on 2017-03-22.
 */
var root = window;

if (typeof root.Brightics == 'undefined') {
    root.Brightics = {};
}

$.extend(true, root.Brightics, {
    Chart: {
        BCharts: {},
        Component: {},
        Helper: {},
        Registry: {},
        Wrapper: {},
        Env: {
            DefaultOptions: {},
            PrefOptions: {}
        },
        Validator: {},
        Error: {},
        API: {}
    }
});

exports.default = root.Brightics;

window.Brightics = root.Brightics;

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _problemLibrary = __webpack_require__(45);

var _problemLibrary2 = _interopRequireDefault(_problemLibrary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Problem(key, param, targetObj) {
    var problemTemplate = _problemLibrary2.default.Problems[key];

    if (typeof param === 'undefined') param = [];

    var problem = {
        key: key,
        message: this._getMessage(problemTemplate.message, param)
    };

    if (targetObj) {
        problem.target = targetObj.target;
        if (typeof targetObj.index !== 'undefined') {
            problem.index = targetObj.index;
        }
    }
    return problem;
} /**
   * Created by SDS on 2017-05-10.
   */


Problem.prototype._getMessage = function (messageFormat, param) {
    return messageFormat.replace(/{(\d+)}/g, function (match, number) {
        return typeof param[number] !== 'undefined' ? param[number] : match;
    });
};

exports.default = Problem;

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _warningLibrary = __webpack_require__(205);

var _warningLibrary2 = _interopRequireDefault(_warningLibrary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Warning(key, param, targetObj) {
    var warningTemplate = _warningLibrary2.default[key];

    if (typeof param === 'undefined') param = [];

    var warning = {
        key: key,
        message: this._getMessage(warningTemplate.message, param)
    };

    if (targetObj) {
        warning.target = targetObj.target;
        if (typeof targetObj.index !== 'undefined') {
            warning.index = targetObj.index;
        }
    }
    return warning;
} /**
   * Created by SDS on 2017-05-10.
   */


Warning.prototype._getMessage = function (messageFormat, param) {
    return messageFormat.replace(/{(\d+)}/g, function (match, number) {
        return typeof param[number] !== 'undefined' ? param[number] : match;
    });
};

exports.default = Warning;

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by SDS on 2017-05-10.
 */
exports.default = {
    'axis-001': {
        message: '{0} Strip Line is not available.'
    },
    'axis-002': {
        message: '{0} Scale is not available.'
    }
};

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.donut = exports.map = exports.treemap = exports.table = exports.scatter = exports.roccurve = exports.qqplot = exports.pie = exports.pairwiseScatter = exports.network = exports.line = exports.histogram = exports.heatmapMatrix = exports.heatmap = exports.dendrogram = exports.decisiontree = exports.complex = exports.columnStacked100 = exports.columnStacked = exports.column = exports.card = exports.bubble = exports.boxplot = exports.biplot = exports.barStacked100 = exports.barStacked = exports.bar = exports.areaStacked100 = exports.areaStacked = exports.area = undefined;

var _chartValidatorArea = __webpack_require__(207);

var _chartValidatorArea2 = _interopRequireDefault(_chartValidatorArea);

var _chartValidatorAreaStacked = __webpack_require__(68);

var _chartValidatorAreaStacked2 = _interopRequireDefault(_chartValidatorAreaStacked);

var _chartValidatorAreaStacked3 = __webpack_require__(208);

var _chartValidatorAreaStacked4 = _interopRequireDefault(_chartValidatorAreaStacked3);

var _chartValidatorBar = __webpack_require__(209);

var _chartValidatorBar2 = _interopRequireDefault(_chartValidatorBar);

var _chartValidatorBarStacked = __webpack_require__(69);

var _chartValidatorBarStacked2 = _interopRequireDefault(_chartValidatorBarStacked);

var _chartValidatorBarStacked3 = __webpack_require__(210);

var _chartValidatorBarStacked4 = _interopRequireDefault(_chartValidatorBarStacked3);

var _chartValidatorBiplot = __webpack_require__(211);

var _chartValidatorBiplot2 = _interopRequireDefault(_chartValidatorBiplot);

var _chartValidatorBoxplot = __webpack_require__(212);

var _chartValidatorBoxplot2 = _interopRequireDefault(_chartValidatorBoxplot);

var _chartValidatorBubble = __webpack_require__(213);

var _chartValidatorBubble2 = _interopRequireDefault(_chartValidatorBubble);

var _chartValidatorCard = __webpack_require__(214);

var _chartValidatorCard2 = _interopRequireDefault(_chartValidatorCard);

var _chartValidatorColumn = __webpack_require__(215);

var _chartValidatorColumn2 = _interopRequireDefault(_chartValidatorColumn);

var _chartValidatorColumnStacked = __webpack_require__(70);

var _chartValidatorColumnStacked2 = _interopRequireDefault(_chartValidatorColumnStacked);

var _chartValidatorColumnStacked3 = __webpack_require__(216);

var _chartValidatorColumnStacked4 = _interopRequireDefault(_chartValidatorColumnStacked3);

var _chartValidatorComplex = __webpack_require__(217);

var _chartValidatorComplex2 = _interopRequireDefault(_chartValidatorComplex);

var _chartValidatorDecisiontree = __webpack_require__(218);

var _chartValidatorDecisiontree2 = _interopRequireDefault(_chartValidatorDecisiontree);

var _chartValidatorDendrogram = __webpack_require__(219);

var _chartValidatorDendrogram2 = _interopRequireDefault(_chartValidatorDendrogram);

var _chartValidatorHeatmap = __webpack_require__(220);

var _chartValidatorHeatmap2 = _interopRequireDefault(_chartValidatorHeatmap);

var _chartValidatorHeatmapMatrix = __webpack_require__(221);

var _chartValidatorHeatmapMatrix2 = _interopRequireDefault(_chartValidatorHeatmapMatrix);

var _chartValidatorHistogram = __webpack_require__(222);

var _chartValidatorHistogram2 = _interopRequireDefault(_chartValidatorHistogram);

var _chartValidatorLine = __webpack_require__(223);

var _chartValidatorLine2 = _interopRequireDefault(_chartValidatorLine);

var _chartValidatorNetwork = __webpack_require__(224);

var _chartValidatorNetwork2 = _interopRequireDefault(_chartValidatorNetwork);

var _chartValidatorPairwiseScatter = __webpack_require__(225);

var _chartValidatorPairwiseScatter2 = _interopRequireDefault(_chartValidatorPairwiseScatter);

var _chartValidatorPie = __webpack_require__(226);

var _chartValidatorPie2 = _interopRequireDefault(_chartValidatorPie);

var _chartValidatorQqplot = __webpack_require__(227);

var _chartValidatorQqplot2 = _interopRequireDefault(_chartValidatorQqplot);

var _chartValidatorRadar = __webpack_require__(228);

var _chartValidatorRadar2 = _interopRequireDefault(_chartValidatorRadar);

var _chartValidatorRoccurve = __webpack_require__(229);

var _chartValidatorRoccurve2 = _interopRequireDefault(_chartValidatorRoccurve);

var _chartValidatorScatter = __webpack_require__(230);

var _chartValidatorScatter2 = _interopRequireDefault(_chartValidatorScatter);

var _chartValidatorTable = __webpack_require__(231);

var _chartValidatorTable2 = _interopRequireDefault(_chartValidatorTable);

var _chartValidatorTreemap = __webpack_require__(232);

var _chartValidatorTreemap2 = _interopRequireDefault(_chartValidatorTreemap);

var _chartValidatorMap = __webpack_require__(233);

var _chartValidatorMap2 = _interopRequireDefault(_chartValidatorMap);

var _chartValidatorDonut = __webpack_require__(234);

var _chartValidatorDonut2 = _interopRequireDefault(_chartValidatorDonut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import scattermap from './implement/chart-validator-scattermap';
exports.area = _chartValidatorArea2.default;
exports.areaStacked = _chartValidatorAreaStacked2.default;
exports.areaStacked100 = _chartValidatorAreaStacked4.default;
exports.bar = _chartValidatorBar2.default;
exports.barStacked = _chartValidatorBarStacked2.default;
exports.barStacked100 = _chartValidatorBarStacked4.default;
exports.biplot = _chartValidatorBiplot2.default;
exports.boxplot = _chartValidatorBoxplot2.default;
exports.bubble = _chartValidatorBubble2.default;
exports.card = _chartValidatorCard2.default;
exports.column = _chartValidatorColumn2.default;
exports.columnStacked = _chartValidatorColumnStacked2.default;
exports.columnStacked100 = _chartValidatorColumnStacked4.default;
exports.complex = _chartValidatorComplex2.default;
exports.decisiontree = _chartValidatorDecisiontree2.default;
exports.dendrogram = _chartValidatorDendrogram2.default;
exports.heatmap = _chartValidatorHeatmap2.default;
exports.heatmapMatrix = _chartValidatorHeatmapMatrix2.default;
exports.histogram = _chartValidatorHistogram2.default;
exports.line = _chartValidatorLine2.default;
exports.network = _chartValidatorNetwork2.default;
exports.pairwiseScatter = _chartValidatorPairwiseScatter2.default;
exports.pie = _chartValidatorPie2.default;
exports.qqplot = _chartValidatorQqplot2.default;
exports.roccurve = _chartValidatorRoccurve2.default;
exports.scatter = _chartValidatorScatter2.default;
exports.table = _chartValidatorTable2.default;
exports.treemap = _chartValidatorTreemap2.default;
exports.map = _chartValidatorMap2.default;
exports.donut = _chartValidatorDonut2.default; /**
                                                * Source: chart-validator-index.js
                                                * Created by sds on 2018-03-14.
                                                */

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AreaChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


AreaChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
AreaChartValidator.prototype.constructor = AreaChartValidator;

AreaChartValidator.prototype.validateStripLineType = function (dataIdx) {
    this._createWarning('axis-001', ['X-axis'], {
        target: 'xAxis'
    });
};

exports.default = AreaChartValidator;

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartValidatorAreaStacked = __webpack_require__(68);

var _chartValidatorAreaStacked2 = _interopRequireDefault(_chartValidatorAreaStacked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AreaStacked100ChartValidator(options) {
  _chartValidatorAreaStacked2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


AreaStacked100ChartValidator.prototype = Object.create(_chartValidatorAreaStacked2.default.prototype);
AreaStacked100ChartValidator.prototype.constructor = AreaStacked100ChartValidator;

exports.default = AreaStacked100ChartValidator;

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BarChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


BarChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
BarChartValidator.prototype.constructor = BarChartValidator;

BarChartValidator.prototype.validateStripLineType = function (dataIdx) {
    this._createWarning('axis-001', ['Y-axis'], {
        target: 'yAxis'
    });
};

BarChartValidator.prototype.validateScale = function (dataIdx) {
    this._createWarning('axis-002', ['Y-axis'], {
        target: 'yaxis'
    });
};

exports.default = BarChartValidator;

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartValidatorBarStacked = __webpack_require__(69);

var _chartValidatorBarStacked2 = _interopRequireDefault(_chartValidatorBarStacked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BarStacked100ChartValidator(options) {
  _chartValidatorBarStacked2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


BarStacked100ChartValidator.prototype = Object.create(_chartValidatorBarStacked2.default.prototype);
BarStacked100ChartValidator.prototype.constructor = BarStacked100ChartValidator;

exports.default = BarStacked100ChartValidator;

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BiplotChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by sds on 2017-09-11.
   */


BiplotChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
BiplotChartValidator.prototype.constructor = BiplotChartValidator;

BiplotChartValidator.prototype.getDataSrcOptions = function () {
    return [{
        label: 'Data Source #1'
    }, {
        label: 'Data Source #2'
    }];
};

BiplotChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'lineXAxis',
        value: this.options.xAxis[0]
    }, {
        key: 'lineYAxis',
        value: this.options.yAxis[0]
    }, {
        key: 'lineLabelBy',
        value: this.options.plotOptions.component.labelBy[0]
    }, {
        key: 'scatterXAxis',
        value: this.options.xAxis[1],
        dataSetIndex: 1
    }, {
        key: 'scatterYAxis',
        value: this.options.yAxis[1],
        dataSetIndex: 1
    }, {
        key: 'scatterLabelBy',
        value: this.options.plotOptions.projection.labelBy[0],
        dataSetIndex: 1
    }];
};

exports.default = BiplotChartValidator;

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BoxPlotChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


BoxPlotChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
BoxPlotChartValidator.prototype.constructor = BoxPlotChartValidator;

BoxPlotChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }];
};

exports.default = BoxPlotChartValidator;

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BubbleChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


BubbleChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
BubbleChartValidator.prototype.constructor = BubbleChartValidator;

BubbleChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }, {
        key: 'stackBy'
    }, {
        key: 'sizeBy'
    }];
};

exports.default = BubbleChartValidator;

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CardChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by sds on 2018-03-26.
   */


CardChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
CardChartValidator.prototype.constructor = CardChartValidator;

//@implement
CardChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'valueBy'
    }];
};

CardChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

CardChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

CardChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = CardChartValidator;

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ColumnChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


ColumnChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
ColumnChartValidator.prototype.constructor = ColumnChartValidator;

ColumnChartValidator.prototype.validateStripLineType = function (dataIdx) {
    this._createWarning('axis-001', ['X-axis'], {
        target: 'xAxis'
    });
};

ColumnChartValidator.prototype.validateScale = function (dataIdx) {
    this._createWarning('axis-002', ['X-axis'], {
        target: 'xaxis'
    });
};

exports.default = ColumnChartValidator;

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartValidatorColumnStacked = __webpack_require__(70);

var _chartValidatorColumnStacked2 = _interopRequireDefault(_chartValidatorColumnStacked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ColumnStacked100ChartValidator(options) {
  _chartValidatorColumnStacked2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


ColumnStacked100ChartValidator.prototype = Object.create(_chartValidatorColumnStacked2.default.prototype);
ColumnStacked100ChartValidator.prototype.constructor = ColumnStacked100ChartValidator;

exports.default = ColumnStacked100ChartValidator;

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ComplexChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


ComplexChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
ComplexChartValidator.prototype.constructor = ComplexChartValidator;

ComplexChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis',
        chartIdx: 0,
        value: this.options.complex[0].yAxis[0]
    }, {
        key: 'yAxis',
        chartIdx: 1,
        value: this.options.complex[1].yAxis[0]
    }, {
        key: 'colorBy',
        chartIdx: 0,
        value: this.options.complex[0].colorBy[0]
    }, {
        key: 'colorBy',
        chartIdx: 1,
        value: this.options.complex[1].colorBy[0]
    }, {
        key: 'lineBy',
        chartIdx: 0,
        value: this.options.complex[0].plotOptions.line.lineBy[0]
    }, {
        key: 'lineBy',
        chartIdx: 1,
        value: this.options.complex[1].plotOptions.line.lineBy[0]
    }];
};

ComplexChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

ComplexChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

ComplexChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = ComplexChartValidator;

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DecisionTreeChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


DecisionTreeChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
DecisionTreeChartValidator.prototype.constructor = DecisionTreeChartValidator;

DecisionTreeChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'fromColumn'
    }, {
        key: 'toColumn'
    }, {
        key: 'nodeLabelColumn'
    }, {
        key: 'linkLabelColumn'
    }];
};

DecisionTreeChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

DecisionTreeChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

DecisionTreeChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = DecisionTreeChartValidator;

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DendrogramChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


DendrogramChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
DendrogramChartValidator.prototype.constructor = DendrogramChartValidator;

DendrogramChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'clusterGroupColumn'
    }, {
        key: 'clusterColumn'
    }, {
        key: 'heightColumn'
    }];
};

DendrogramChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

DendrogramChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

DendrogramChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = DendrogramChartValidator;

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HeatmapChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


HeatmapChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
HeatmapChartValidator.prototype.constructor = HeatmapChartValidator;

HeatmapChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }, {
        key: 'valueBy'
    }];
};

HeatmapChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

HeatmapChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

HeatmapChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = HeatmapChartValidator;

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HeatmapMatrixChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


HeatmapMatrixChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
HeatmapMatrixChartValidator.prototype.constructor = HeatmapMatrixChartValidator;

HeatmapMatrixChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }];
};

HeatmapMatrixChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

HeatmapMatrixChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

HeatmapMatrixChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = HeatmapMatrixChartValidator;

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HisogramChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by sds on 2017-07-27.
   */


HisogramChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
HisogramChartValidator.prototype.constructor = HisogramChartValidator;

HisogramChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }];
};

exports.default = HisogramChartValidator;

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LineChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


LineChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
LineChartValidator.prototype.constructor = LineChartValidator;

LineChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'yAxis'
    }, {
        key: 'colorBy'
    }, {
        key: 'lineBy'
    }];
};

exports.default = LineChartValidator;

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */
function NetworkChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
}

NetworkChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
NetworkChartValidator.prototype.constructor = NetworkChartValidator;

NetworkChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'fromColumn'
    }, {
        key: 'toColumn'
    }, {
        key: 'nodeSizeBy'
    }];
};

NetworkChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};
NetworkChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

NetworkChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = NetworkChartValidator;

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PairwiseScatterChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


PairwiseScatterChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
PairwiseScatterChartValidator.prototype.constructor = PairwiseScatterChartValidator;

PairwiseScatterChartValidator.prototype._configureAxis = function () {
    _chartValidatorBase2.default.prototype._configureAxis.call(this);
};

PairwiseScatterChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'xAxis'
    }, {
        key: 'colorBy'
    }];
};

exports.default = PairwiseScatterChartValidator;

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PieChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


PieChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
PieChartValidator.prototype.constructor = PieChartValidator;

PieChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'colorBy'
    }, {
        key: 'sizeBy'
    }];
};

PieChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

PieChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

PieChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = PieChartValidator;

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function QQPlotValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


QQPlotValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
QQPlotValidator.prototype.constructor = QQPlotValidator;

QQPlotValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'values'
    }];
};

QQPlotValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

QQPlotValidator.prototype.validateStripLineType = function () {
    // do nothing
};

QQPlotValidator.prototype._validateImplement = function () {
    var distribution = this.options.plotOptions.qqplot.distribution[0].selected;
    if (!distribution || distribution === '') {
        var distTarget = { target: 'Distribution Type', index: 0 };
        this._createProblem('value-005', ['Distribution Type'], distTarget);
    }
    var confidence = this.options.plotOptions.qqplot.confidence[0].selected;
    if (!confidence || confidence === '') {
        var confTarget = { target: 'Confidence Level', index: 0 };
        this._createProblem('value-005', ['Confidence Level'], confTarget);
    }
};

QQPlotValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = QQPlotValidator;

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RadarChartValidator(options) {
  _chartValidatorBase2.default.call(this, options);
} /**
   * Created by sds on 2017-09-05.
   */


RadarChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
RadarChartValidator.prototype.constructor = RadarChartValidator;

exports.default = RadarChartValidator;

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BROCCurveChartValidator(options) {
  _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


BROCCurveChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
BROCCurveChartValidator.prototype.constructor = BROCCurveChartValidator;

exports.default = BROCCurveChartValidator;

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ScatterChartValidator(options) {
  _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


ScatterChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
ScatterChartValidator.prototype.constructor = ScatterChartValidator;

exports.default = ScatterChartValidator;

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TableChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


TableChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
TableChartValidator.prototype.constructor = TableChartValidator;

TableChartValidator.prototype.validate = function () {
    this.validateDataSource();
    this.validateAxis();
};

TableChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'formatter',
        value: this.options.plotOptions.table.formatter
    }];
};

exports.default = TableChartValidator;

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TreemapValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


TreemapValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
TreemapValidator.prototype.constructor = TreemapValidator;

TreemapValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'hierarchyCol'
    }, {
        key: 'sizeBy'
    }];
};

TreemapValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

TreemapValidator.prototype.validateStripLineType = function () {
    // do nothing
};

TreemapValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = TreemapValidator;

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MapChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by sds on 2018-03-26.
   */


MapChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
MapChartValidator.prototype.constructor = MapChartValidator;

MapChartValidator.prototype.getAxisOptions = function () {
    return [];
};

MapChartValidator.prototype._configureAxis = function () {
    // do nothing
};

MapChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

MapChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

exports.default = MapChartValidator;

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartValidatorBase = __webpack_require__(7);

var _chartValidatorBase2 = _interopRequireDefault(_chartValidatorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DonutChartValidator(options) {
    _chartValidatorBase2.default.call(this, options);
} /**
   * Created by SDS on 2017-05-10.
   */


DonutChartValidator.prototype = Object.create(_chartValidatorBase2.default.prototype);
DonutChartValidator.prototype.constructor = DonutChartValidator;

DonutChartValidator.prototype.getAxisOptions = function () {
    return [{
        key: 'colorBy'
    }, {
        key: 'sizeBy'
    }];
};

DonutChartValidator.prototype._validateAxisViewRange = function () {
    // do nothing
};

DonutChartValidator.prototype.validateStripLineType = function () {
    // do nothing
};

DonutChartValidator.prototype.validateScale = function () {
    // do nothing
};

exports.default = DonutChartValidator;

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AxisTitle = undefined;

var _title = __webpack_require__(71);

/**
 *
 * @param parentId
 * @param options {  }
 * @constructor
 */
function AxisTitle(parentId, options) {
    this._showAggregation = true;
    _title.Title.call(this, parentId, options);
} /**
   * Source: axis-title.js
   * Created by daewon.park on 2017-03-27.
   */


AxisTitle.prototype = Object.create(_title.Title.prototype);
AxisTitle.prototype.constructor = AxisTitle;

AxisTitle.prototype._createContents = function ($parent) {
    _title.Title.prototype._createContents.call(this, $parent);
    this.$mainControl.addClass('bcharts-axis');
};

AxisTitle.prototype.showAggregation = function (show) {
    this._showAggregation = show;
};

AxisTitle.prototype.render = function (axis) {
    var text = '';

    if (typeof axis === 'string') {
        text = axis;
    } else if (axis) {
        if (axis.title && axis.title.text) {
            text = axis.title.text;
        } else if (axis.axisType === 'byColumnNames') {
            text = 'Column Names';
        } else if (axis.selected && axis.selected.length > 0) {
            if (this._showAggregation) {
                var labels = {
                    'max': 'Max({0})',
                    'min': 'Min({0})',
                    'sum': 'Sum({0})',
                    'average': 'Average({0})',
                    'count': 'Count({0})',
                    'unique_count': 'Unique Count({0})'
                };

                var textList = [];

                for (var i in axis.selected) {
                    if (axis.selected[i]) {
                        if (labels[axis.selected[i].aggregation]) {
                            textList.push(labels[axis.selected[i].aggregation].replace(/\{(\d+)\}/g, axis.selected[i].name));
                        } else {
                            textList.push(axis.selected[i].name);
                        }
                    }
                }

                text = textList.join(', ');
            } else {
                text = axis.selected[0].name;
            }
        }
    }

    _title.Title.prototype.render.call(this, text);
};

exports.AxisTitle = AxisTitle;

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Legend = undefined;

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param parentId
 * @param options { orientation: 'horizontal', background:{}, right: 0, top: 0 }
 * @constructor
 */
function Legend(parentId, options) {
    _widget2.default.call(this, parentId, options);
} /**
   * Source: legend.js
   * Created by daewon.park on 2017-03-27.
   */


Legend.prototype = Object.create(_widget2.default.prototype);
Legend.prototype.constructor = Legend;

Legend.prototype.destroy = function () {
    if (this.resizeHandler) {
        $(window).off('resize', this.resizeHandler);
        this.resizeHandler = null;
    }
};

Legend.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-legend"></div>');
    $parent.append(this.$mainControl);
    this.$mainControl.perfectScrollbar();

    var _this = this;
    this.resizeHandler = function () {
        _this.redrawLayout();
    };
    $(window).resize(this.resizeHandler);
};

Legend.prototype.redrawLayout = function () {
    var _this = this;

    clearTimeout(this._redrawLayoutJob);
    this._redrawLayoutJob = setTimeout(function () {
        _this._adjustLayout();
    }, 300);
};

/**
 * render
 * @param legendData [{ name: 'species', symbol: 'circle', symbolSize: 10, color: '#FD026C' }]
 */
Legend.prototype.render = function (legendData) {
    var _this = this;
    this.$mainControl.empty();

    _this._setMaxSize();

    if (this.getOptions().orientation === 'horizontal') {
        this.$mainControl.css('display', 'flex');
    } else {
        this.$mainControl.css('display', 'block');
    }

    for (var i in legendData) {
        var $item = $('' + '<div class="bcharts-legend-item">' + '   <div class="bcharts-legend-symbol"></div>' + '   <div class="bcharts-legend-label"></div>' + '</div>');
        $item.children('.bcharts-legend-symbol').append(this._generateSymbol(legendData[i]));
        $item.children('.bcharts-legend-label').text(legendData[i].name);
        if (legendData[i].selected === false) {
            $item.addClass('bcharts-legend-hide');
        }
        $item.click(function () {
            $(this).toggleClass('bcharts-legend-hide');
            if (_this.getOptions().selected) {
                _this.getOptions().selected($(this).find('.bcharts-legend-label').text());
            }
        });

        this.$mainControl.append($item);
    }

    var styles = ['background', 'border'];
    for (var i in styles) {
        if (typeof this.getOptions()[styles[i]] !== 'undefined') this.$mainControl.css(styles[i], this.getOptions()[styles[i]]);
    }

    if (this.getOptions().textStyle) {
        styles = ['color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textDecoration'];
        for (var i in styles) {
            if (typeof this.getOptions().textStyle[styles[i]] !== 'undefined') this.$mainControl.css(styles[i], this.getOptions().textStyle[styles[i]]);
        }
    }

    _this._adjustLayout();

    if (this.getOptions().show) {
        this.$mainControl.show();
        this.$mainControl.perfectScrollbar('update');
    } else {
        this.$mainControl.hide();
    }
};

Legend.prototype.show = function () {
    if (this.$mainControl && this.getOptions().show && this.$mainControl.find('.bcharts-legend-item').length > 0) {
        this.$mainControl.show();
        // this.$mainControl.perfectScrollbar('update');
    }
};

Legend.prototype._adjustLayout = function () {
    var _this = this;

    _this._setMaxSize();
    if (typeof _this.getOptions().left !== 'undefined') _this.$mainControl.css('left', _this._adjustPosition(_this.getOptions().left, _this.$mainControl.outerWidth()));
    if (typeof _this.getOptions().right !== 'undefined') _this.$mainControl.css('right', _this._adjustPosition(_this.getOptions().right, _this.$mainControl.outerWidth()));
    if (typeof _this.getOptions().bottom !== 'undefined') _this.$mainControl.css('bottom', _this._adjustPosition(_this.getOptions().bottom, _this.$mainControl.outerHeight()));
    if (typeof _this.getOptions().top !== 'undefined') _this.$mainControl.css('top', _this._adjustPosition(_this.getOptions().top, _this.$mainControl.outerHeight()));
};

Legend.prototype._adjustPosition = function (position, size) {
    if (Number.isNaN(Number(position)) === false) return Number(position);
    if (position == null) return 'initial';
    return position.replace(/(\d+%)/, 'calc($1 - ' + size / 2 + 'px)');
};

Legend.prototype._generateSymbol = function (data) {
    if (data.symbol == 'square') {
        return $('<svg height="20" width="20"><rect x="5" y="5" width="10" height="10" fill="' + data.color + '"></rect></svg>');
    } else if (data.symbol == 'triangle') {
        return $('<svg height="20" width="20"><polygon points="10,5 5,15 15,15" fill="' + data.color + '"></polygon></svg>');
    } else {
        return $('<svg height="20" width="20"><circle cx="10" cy="10" r="5" fill="' + data.color + '"></circle></svg>');
    }
};

Legend.prototype._setMaxSize = function () {
    var parentsWidth = this.$parent.width() - 10;
    var parentsHeight = this.$parent.height() - 10;
    this.$mainControl.css('max-width', parentsWidth + 'px');
    this.$mainControl.css('max-height', parentsHeight + 'px');
};

exports.Legend = Legend;

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Toolbar = undefined;

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param parentId
 * @param options {  }
 * @constructor
 */

// Sample Option
/**
 toolbar: {
        right: '10px',
        top: '10px',
        orientation: 'horizontal',
        feature: {
            changeType: {},
            brush: {},
            setting: {
                click: function (param) {

                }
            }
        }
    },
 **/
function Toolbar(parentId, options) {
    _widget2.default.call(this, parentId, options);
} /**
   * Source: toolbar.js
   * Created by daewon.park on 2017-03-27.
   */


Toolbar.prototype = Object.create(_widget2.default.prototype);
Toolbar.prototype.constructor = Toolbar;

Toolbar.prototype.destroy = function () {};

Toolbar.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bcharts-toolbar"></div>');
    $parent.append(this.$mainControl);
};

/**
 * render
 */
Toolbar.prototype.render = function () {
    var _this = this;
    this.$mainControl.empty();

    this.$mainControl.append('' + '<div class="bcharts-toolbar-handler"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></div>' + '<div class="bcharts-toolitem-dropdown" toolbar-menu-type="brush">' + '   <div class="bcharts-toolitem" action="toggle-brush-type" brushType="rect" title="Select Rect"></div>' + '   <div class="bcharts-toolitem" action="toggle-brush-type" brushType="lineX" title="Select X Axis"></div>' + '   <div class="bcharts-toolitem" action="toggle-brush-type" brushType="lineY" title="Select Y Axis"></div>' + '   <div class="bcharts-toolitem" action="toggle-brush-type" brushType="polygon"></div>' + '</div>' + '<div class="bcharts-toolitem" action="toggle-brush-mode" title="Toggle Single / Multi Selection" toolbar-menu-type="brush"></div>' + '<div class="bcharts-toolitem" action="btn-clear-selection" title="Clear Selection" toolbar-menu-type="brush"></div>' + '<div class="bcharts-toolitem" action="toggle-zoom-slider" title="Zoom" toolbar-menu-type="zoom"></div>' + '<div class="bcharts-toolitem" action="open-chart-option" style="display: none;"></div>' + '');

    this._adjustLayout();

    var styles = ['background', 'border'];
    for (var i in styles) {
        if (typeof this.getOptions()[styles[i]] !== 'undefined') this.$mainControl.css(styles[i], this.getOptions()[styles[i]]);
    }

    if (this.getOptions().orientation !== 'vertical') {
        this.$mainControl.css('display', 'flex');
        this.$mainControl.css('align-items', 'center');
    }

    this.$mainControl.draggable({
        handle: '.bcharts-toolbar-handler',
        containment: 'parent',
        start: function start() {
            $(this).css('right', 'initial');
        },
        stop: function stop() {
            var position = $(this).position();
            if (position.left > $(this).parent().width() / 2) {
                $(this).css('left', 'initial');
                $(this).css('right', $(this).parent().width() - position.left - $(this).width());
            }
        }
    });

    if (this.getOptions().show !== true || this.getOptions().visible == false) this.$mainControl.hide();

    this._createBrushContents();
    this._createZoomContents();

    this.$mainControl.find('.bcharts-toolitem[action="open-chart-option"]').click(function () {
        var $chartPanelArea = $('<div class="chart-option-panel-area" style="width:200px;height:800px;background-color:white; z-index:1000000; position:absolute; top:0;"><div>');
        if (_this.$parent.find('.chart-option-panel-area').length) {
            _this.$parent.find('.chart-option-panel-area').remove();
        }
        _this.$parent.append($chartPanelArea);

        _this.chartOptionContainer = new Brightics.Modules.ChartOption($chartPanelArea, {
            // trigger: 'chartOptionChanged',
            popup: false,
            // popup: true,
            changed: function changed(changedChartOpt) {
                var drawingChartOpt = {};
                $.extend(drawingChartOpt, changedChartOpt.chartOptions, { columns: changedChartOpt.columns });
            }
        });

        if (_this.getOptions().selected) {
            _this.getOptions().selected($(this).attr('action'));
        }
    });
};

Toolbar.prototype.unselectAllItems = function () {
    this.$mainControl.find('.bcharts-toolitem-selected').removeClass('bcharts-toolitem-selected');
};

Toolbar.prototype._createBrushContents = function () {

    if (typeof this.getOptions().menu.brush === 'undefined') {
        this.$mainControl.find('div[toolbar-menu-type="brush"]').css('display', 'none');
        return;
    }

    var _this = this;

    this.$mainControl.find('.bcharts-toolitem[action="toggle-brush-type"]').click(function () {
        if ($(this).hasClass('bcharts-toolitem-selected')) {
            $(this).removeClass('bcharts-toolitem-selected');
        } else {
            _this.$mainControl.find('.bcharts-toolitem[action="toggle-brush-type"]').removeClass('bcharts-toolitem-selected');
            $(this).addClass('bcharts-toolitem-selected');
        }
        var $parent = $(this).parent();
        $(this).detach().prependTo($parent);

        if (_this.getOptions().selected) {
            _this.getOptions().selected($(this).attr('action'));
        }
    });

    this.$mainControl.find('.bcharts-toolitem[action="toggle-brush-mode"]').click(function () {
        $(this).toggleClass('bcharts-toolitem-selected');

        if (_this.getOptions().selected) {
            _this.getOptions().selected($(this).attr('action'));
        }
    });

    this.$mainControl.find('.bcharts-toolitem[action="btn-clear-selection"]').click(function () {
        if (_this.getOptions().selected) {
            _this.getOptions().selected($(this).attr('action'));
        }
    });
};

Toolbar.prototype._createZoomContents = function () {

    if (typeof this.getOptions().menu.zoom === 'undefined') {
        this.$mainControl.find('.bcharts-toolitem[toolbar-menu-type="zoom"]').css('display', 'none');
        return;
    }

    var _this = this;

    this.$mainControl.find('.bcharts-toolitem[action="toggle-zoom-slider"]').click(function () {
        $(this).toggleClass('bcharts-toolitem-selected');

        if (_this.getOptions().selected) {
            _this.getOptions().selected($(this).attr('action'));
        }
    });
};

Toolbar.prototype.getSelectedBrushType = function () {
    return this.$mainControl.find('.bcharts-toolitem.bcharts-toolitem-selected[action="toggle-brush-type"]').attr('brushType');
};

Toolbar.prototype.getSelectedBrushMode = function () {
    if (this.$mainControl.find('.bcharts-toolitem[action="toggle-brush-mode"]').hasClass('bcharts-toolitem-selected')) {
        return 'multiple';
    } else {
        return 'single';
    }
};

Toolbar.prototype.getZoomMode = function () {
    if (this.$mainControl.find('.bcharts-toolitem[action="toggle-zoom-slider"]').hasClass('bcharts-toolitem-selected')) {
        return true;
    } else {
        return false;
    }
};

// ['rect', 'lineX', 'lineY']
Toolbar.prototype.setBrushTypeList = function (typeList) {
    var _this = this;
    typeList = ['rect', 'lineX', 'lineY'];
    this.$mainControl.find('.bcharts-toolitem[action="toggle-brush-type"]').hide();
    typeList.forEach(function (type) {
        _this.$mainControl.find('.bcharts-toolitem[brushType="' + type + '"]').show();
    });
};

Toolbar.prototype.setSelectedBrushTypeList = function (type) {};

Toolbar.prototype.show = function () {
    this.$mainControl.show();
};

Toolbar.prototype.hide = function () {
    this.$mainControl.hide();
};

Toolbar.prototype._adjustLayout = function () {
    var _this = this;

    if (typeof _this.getOptions().left !== 'undefined') _this.$mainControl.css('left', _this._adjustPosition(_this.getOptions().left, _this.$mainControl.outerWidth()));else if (typeof _this.getOptions().right !== 'undefined') _this.$mainControl.css('right', _this._adjustPosition(_this.getOptions().right, _this.$mainControl.outerWidth()));
    if (typeof _this.getOptions().top !== 'undefined') _this.$mainControl.css('top', _this._adjustPosition(_this.getOptions().top, _this.$mainControl.outerHeight()));else if (typeof _this.getOptions().bottom !== 'undefined') _this.$mainControl.css('bottom', _this._adjustPosition(_this.getOptions().bottom, _this.$mainControl.outerHeight()));
};

Toolbar.prototype._adjustPosition = function (position, size) {
    if (Number.isNaN(Number(position)) === false) return Number(position);
    return position.replace(/(\d+%)/, 'calc($1 - ' + size / 2 + 'px)');
};

exports.Toolbar = Toolbar;

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.donut = exports.map = exports.treemap = exports.table = exports.scatter = exports.roccurve = exports.qqplot = exports.pie = exports.pairwiseScatter = exports.network = exports.line = exports.histogram = exports.heatmapMatrix = exports.heatmap = exports.dendrogram = exports.decisiontree = exports.complex = exports.columnStacked100 = exports.columnStacked = exports.column = exports.card = exports.bubble = exports.boxplot = exports.biplot = exports.barStacked100 = exports.barStacked = exports.bar = exports.areaStacked100 = exports.areaStacked = exports.area = undefined;

var _echartsArea = __webpack_require__(73);

var _echartsArea2 = _interopRequireDefault(_echartsArea);

var _echartsAreaStacked = __webpack_require__(144);

var _echartsAreaStacked2 = _interopRequireDefault(_echartsAreaStacked);

var _echartsAreaStacked3 = __webpack_require__(244);

var _echartsAreaStacked4 = _interopRequireDefault(_echartsAreaStacked3);

var _echartsBar = __webpack_require__(146);

var _echartsBar2 = _interopRequireDefault(_echartsBar);

var _echartsBarStacked = __webpack_require__(148);

var _echartsBarStacked2 = _interopRequireDefault(_echartsBarStacked);

var _echartsBarStacked3 = __webpack_require__(248);

var _echartsBarStacked4 = _interopRequireDefault(_echartsBarStacked3);

var _echartsBiplot = __webpack_require__(251);

var _echartsBiplot2 = _interopRequireDefault(_echartsBiplot);

var _echartsBoxplot = __webpack_require__(254);

var _echartsBoxplot2 = _interopRequireDefault(_echartsBoxplot);

var _echartsBubble = __webpack_require__(257);

var _echartsBubble2 = _interopRequireDefault(_echartsBubble);

var _echartsCard = __webpack_require__(260);

var _echartsCard2 = _interopRequireDefault(_echartsCard);

var _echartsColumn = __webpack_require__(37);

var _echartsColumn2 = _interopRequireDefault(_echartsColumn);

var _echartsColumnStacked = __webpack_require__(153);

var _echartsColumnStacked2 = _interopRequireDefault(_echartsColumnStacked);

var _echartsColumnStacked3 = __webpack_require__(266);

var _echartsColumnStacked4 = _interopRequireDefault(_echartsColumnStacked3);

var _echartsComplex = __webpack_require__(269);

var _echartsComplex2 = _interopRequireDefault(_echartsComplex);

var _d3Decisiontree = __webpack_require__(158);

var _d3Decisiontree2 = _interopRequireDefault(_d3Decisiontree);

var _echartsDendrogram = __webpack_require__(275);

var _echartsDendrogram2 = _interopRequireDefault(_echartsDendrogram);

var _echartsHeatmap = __webpack_require__(278);

var _echartsHeatmap2 = _interopRequireDefault(_echartsHeatmap);

var _echartsHeatmapMatrix = __webpack_require__(282);

var _echartsHeatmapMatrix2 = _interopRequireDefault(_echartsHeatmapMatrix);

var _echartsHistogram = __webpack_require__(285);

var _echartsHistogram2 = _interopRequireDefault(_echartsHistogram);

var _echartsLine = __webpack_require__(33);

var _echartsLine2 = _interopRequireDefault(_echartsLine);

var _echartsNetwork = __webpack_require__(287);

var _echartsNetwork2 = _interopRequireDefault(_echartsNetwork);

var _echartsPairwiseScatter = __webpack_require__(290);

var _echartsPairwiseScatter2 = _interopRequireDefault(_echartsPairwiseScatter);

var _echartsPie = __webpack_require__(292);

var _echartsPie2 = _interopRequireDefault(_echartsPie);

var _echartsQqplot = __webpack_require__(295);

var _echartsQqplot2 = _interopRequireDefault(_echartsQqplot);

var _echartsRadar = __webpack_require__(298);

var _echartsRadar2 = _interopRequireDefault(_echartsRadar);

var _echartsRoccurve = __webpack_require__(299);

var _echartsRoccurve2 = _interopRequireDefault(_echartsRoccurve);

var _echartsScatter = __webpack_require__(53);

var _echartsScatter2 = _interopRequireDefault(_echartsScatter);

var _handsontableTable = __webpack_require__(302);

var _handsontableTable2 = _interopRequireDefault(_handsontableTable);

var _echartsTreemap = __webpack_require__(304);

var _echartsTreemap2 = _interopRequireDefault(_echartsTreemap);

var _echartsMap = __webpack_require__(308);

var _echartsMap2 = _interopRequireDefault(_echartsMap);

var _echartsDonut = __webpack_require__(311);

var _echartsDonut2 = _interopRequireDefault(_echartsDonut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import scattermap from '../wrapper/echarts/types/echarts-scattermap';
//import table from '../wrapper/jqwidgets/jqwidgets-table'
exports.area = _echartsArea2.default;
exports.areaStacked = _echartsAreaStacked2.default;
exports.areaStacked100 = _echartsAreaStacked4.default;
exports.bar = _echartsBar2.default;
exports.barStacked = _echartsBarStacked2.default;
exports.barStacked100 = _echartsBarStacked4.default;
exports.biplot = _echartsBiplot2.default;
exports.boxplot = _echartsBoxplot2.default;
exports.bubble = _echartsBubble2.default;
exports.card = _echartsCard2.default;
exports.column = _echartsColumn2.default;
exports.columnStacked = _echartsColumnStacked2.default;
exports.columnStacked100 = _echartsColumnStacked4.default;
exports.complex = _echartsComplex2.default;
exports.decisiontree = _d3Decisiontree2.default;
exports.dendrogram = _echartsDendrogram2.default;
exports.heatmap = _echartsHeatmap2.default;
exports.heatmapMatrix = _echartsHeatmapMatrix2.default;
exports.histogram = _echartsHistogram2.default;
exports.line = _echartsLine2.default;
exports.network = _echartsNetwork2.default;
exports.pairwiseScatter = _echartsPairwiseScatter2.default;
exports.pie = _echartsPie2.default;
exports.qqplot = _echartsQqplot2.default;
exports.roccurve = _echartsRoccurve2.default;
exports.scatter = _echartsScatter2.default;
exports.table = _handsontableTable2.default;
exports.treemap = _echartsTreemap2.default;
exports.map = _echartsMap2.default;
exports.donut = _echartsDonut2.default; /**
                                         * Created by sds on 2018-03-20.
                                         */

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointByrowindexExtractor = __webpack_require__(48);

var _echartsPointByrowindexExtractor2 = _interopRequireDefault(_echartsPointByrowindexExtractor);

var _echartsLineOptionBuilder = __webpack_require__(46);

var _echartsLineOptionBuilder2 = _interopRequireDefault(_echartsLineOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import EChartsLineOptionBuilder, * as OptionBuilder  from './echarts-line-option-builder';


function EChartsLineByRowIndexOptionBuilder() {
    _echartsLineOptionBuilder2.default.call(this);
}

EChartsLineByRowIndexOptionBuilder.prototype = Object.create(_echartsLineOptionBuilder2.default.prototype);
EChartsLineByRowIndexOptionBuilder.prototype.constructor = EChartsLineByRowIndexOptionBuilder;

EChartsLineByRowIndexOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisTypeByRowIndex');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipByRowIndex');
    this._registerDecorator('marker');
    this._registerDecorator('lineStyle');
    this._registerDecorator('plotOptions');
    this._registerDecorator('lineBy');
    this.setSeriesSubKeyColumns(this.plotOptions.lineBy[0].selected);
    this.setSeriesKeyColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsLineByRowIndexOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData();
    var keyIndexes = this.getSeriesKeyColumnIndexes();
    var subKeyIndexes = this.getSeriesSubKeyColumnIndexes();
    var allKeyIndexes = keyIndexes.concat(subKeyIndexes);
    var yAxisSelected = this.filterNullColumn(this.bOptions.yAxis[0].selected);

    var i, row, seriesName, seriesItem, yAxisIndex, seriesNameList, yAxisName;

    for (i in localData.data) {
        row = localData.data[i];

        for (yAxisIndex = 0; yAxisIndex < yAxisSelected.length; yAxisIndex++) {

            yAxisName = Brightics.Chart.Helper.OptionUtils.getColumnLabel(yAxisSelected[yAxisIndex]);
            seriesNameList = [];
            seriesNameList.push(yAxisSelected[yAxisIndex].name);
            seriesNameList.push(this.getSeriesName(row, allKeyIndexes));
            seriesName = seriesNameList.join(' ');

            seriesItem = this._getSeriesItem(series, seriesName);
            series[seriesName] = seriesItem;

            if (!seriesItem.extractor) {
                seriesItem.extractor = this._newSeriesExtractor(yAxisIndex);
                seriesItem.extractor.keys = this.getCellText(row, allKeyIndexes, yAxisSelected[yAxisIndex].name);
                seriesItem.name = this.getCellText(row, keyIndexes, yAxisSelected[yAxisIndex].name).join(' ');
                seriesItem.keys = seriesItem.extractor.keys;

                seriesItem.tooltipHeaders = ['Row Index', yAxisName];
            }
            seriesItem.extractor.push(row, i);
        }
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsLineByRowIndexOptionBuilder.prototype._newSeriesExtractor = function (yAxisIndex) {
    var localData = this.getLocalData();
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointByrowindexExtractor2.default();

    extractor.setTarget({
        index: [yIndexes[yAxisIndex]],
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsLineByRowIndexOptionBuilder.prototype.hasLegendData = function () {
    return true;
};

exports.default = EChartsLineByRowIndexOptionBuilder;

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeComplexOptionBuilder = __webpack_require__(35);

var _echartsAxisTypeComplexOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeComplexOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsLineComplexOptionBuilder() {
    _echartsAxisTypeComplexOptionBuilder2.default.call(this);
} /**
   * Created by sds on 2018-01-24.
   */


EChartsLineComplexOptionBuilder.prototype = Object.create(_echartsAxisTypeComplexOptionBuilder2.default.prototype);
EChartsLineComplexOptionBuilder.prototype.constructor = EChartsLineComplexOptionBuilder;

EChartsLineComplexOptionBuilder.prototype._setUpOptions = function () {
    _echartsAxisTypeComplexOptionBuilder2.default.prototype._setUpOptions.call(this);
    this.plotOptionAttributes = ['markPoint', 'markLine', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('stripline');
    this._registerDecorator('marker');
    this._registerDecorator('lineStyle');
    this._registerDecorator('plotOptions');
    this._registerDecorator('lineBy');
    this._setSeriesDataSortRule();
    this.setSeriesSubKeyColumns(this.plotOptions.lineBy[0].selected);
    this.setSeriesKeyColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsLineComplexOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    return this.getSeriesKeyColumns(dataIndex).concat(this.getSeriesSubKeyColumns(dataIndex));
};

EChartsLineComplexOptionBuilder.prototype.setSeriesSubKeyColumns = function (columns, dataIndex) {
    dataIndex = dataIndex || 0;
    columns = this.filterNullColumn(columns);
    this._seriesSubKeyColumsList = this._seriesSubKeyColumsList || [];
    this._seriesSubKeyColumsList[dataIndex] = this._seriesSubKeyColumsList[dataIndex] || [];
    this._seriesSubKeyColumsList[dataIndex] = this._seriesSubKeyColumsList[dataIndex].concat(columns);
};

EChartsLineComplexOptionBuilder.prototype.getSeriesSubKeyColumns = function (dataIndex) {
    dataIndex = dataIndex || 0;
    return this._seriesSubKeyColumsList[dataIndex] || [];
};

EChartsLineComplexOptionBuilder.prototype.getSeriesSubKeyColumnIndexes = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getSeriesSubKeyColumns(dataIndex);
    return this.getColumnIndexes(keyColumns, localData.columns);
};

EChartsLineComplexOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData();
    var keyIndexes = this.getSeriesKeyColumnIndexes();
    var subKeyIndexes = this.getSeriesSubKeyColumnIndexes();
    var allKeyIndexes = keyIndexes.concat(subKeyIndexes);

    var i, row, seriesName, seriesItem;
    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, allKeyIndexes);
        seriesItem = this._getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = this._newSeriesExtractor();
            seriesItem.extractor.keys = this.getCellText(row, allKeyIndexes);
            seriesItem.keys = seriesItem.extractor.keys;
            seriesItem.name = this.getSeriesName(row, keyIndexes);
        }
        seriesItem.extractor.push(row, i);
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

exports.default = EChartsLineComplexOptionBuilder;

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsPointBycolumnnamesExtractor = __webpack_require__(36);

var _echartsPointBycolumnnamesExtractor2 = _interopRequireDefault(_echartsPointBycolumnnamesExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsLineByColumnNamesOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsLineByColumnNamesOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsLineByColumnNamesOptionBuilder.prototype.constructor = EChartsLineByColumnNamesOptionBuilder;

EChartsLineByColumnNamesOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine'];
    this._registerDecorator('axisTypeByColumnNames');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipByColumnNames');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this._registerDecorator('trendline');
};

EChartsLineByColumnNamesOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointBycolumnnamesExtractor2.default();

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

exports.default = EChartsLineByColumnNamesOptionBuilder;

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAxisTypeWithCategoryKeyCalculatedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsAxisTypeWithCategoryKeyCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsAxisTypeWithCategoryKeyCalculatedOptionBuilder.prototype.constructor = EChartsAxisTypeWithCategoryKeyCalculatedOptionBuilder;

EChartsAxisTypeWithCategoryKeyCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

exports.default = EChartsAxisTypeWithCategoryKeyCalculatedOptionBuilder;

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _echartsAreaCalculatedOptionBuilder = __webpack_require__(50);

var _echartsAreaCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAreaCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaCalculatedStackedOptionBuilder() {
    _echartsAreaCalculatedOptionBuilder2.default.call(this);
}

EChartsAreaCalculatedStackedOptionBuilder.prototype = Object.create(_echartsAreaCalculatedOptionBuilder2.default.prototype);
EChartsAreaCalculatedStackedOptionBuilder.prototype.constructor = EChartsAreaCalculatedStackedOptionBuilder;

EChartsAreaCalculatedStackedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'areaStyle', 'sampling', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('xAxisBoundaryGapFalse');
    this._registerDecorator('fillXCategoryValues');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._setSeriesDataSortRule();
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesKeyColumns(this.plotOptions.stackBy[0].selected);
};

EChartsAreaCalculatedStackedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsAreaCalculatedStackedOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

EChartsAreaCalculatedStackedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsAreaCalculatedOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    return seriesItem;
};

EChartsAreaCalculatedStackedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var stackByColumns = this.filterNullColumn(this.plotOptions.stackBy[0].selected);
    if (stackByColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsAreaCalculatedStackedOptionBuilder;

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAreaStacked = __webpack_require__(144);

var _echartsAreaStacked2 = _interopRequireDefault(_echartsAreaStacked);

var _echartsAreaStacked100OptionBuilder = __webpack_require__(245);

var _echartsAreaStacked100OptionBuilder2 = _interopRequireDefault(_echartsAreaStacked100OptionBuilder);

var _echartsAreaCalculatedStacked100OptionBuilder = __webpack_require__(246);

var _echartsAreaCalculatedStacked100OptionBuilder2 = _interopRequireDefault(_echartsAreaCalculatedStacked100OptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaStacked100(parentId, options) {
    _echartsAreaStacked2.default.call(this, parentId, options);
} /**
   * Source: echarts-area-stacked100.js
   * Created by daewon.park on 2017-04-19.
   */

EChartsAreaStacked100.prototype = Object.create(_echartsAreaStacked2.default.prototype);
EChartsAreaStacked100.prototype.constructor = EChartsAreaStacked100;

EChartsAreaStacked100.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsAreaStacked100.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsAreaCalculatedStacked100OptionBuilder2.default();
    } else {
        return new _echartsAreaStacked100OptionBuilder2.default();
    }
};

exports.default = EChartsAreaStacked100;

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAreaStackedOptionBuilder = __webpack_require__(145);

var _echartsAreaStackedOptionBuilder2 = _interopRequireDefault(_echartsAreaStackedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaStacked100OptionBuilder() {
    _echartsAreaStackedOptionBuilder2.default.call(this);
}

EChartsAreaStacked100OptionBuilder.prototype = Object.create(_echartsAreaStackedOptionBuilder2.default.prototype);
EChartsAreaStacked100OptionBuilder.prototype.constructor = EChartsAreaStacked100OptionBuilder;

EChartsAreaStacked100OptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipXAxisPercent');
    _echartsAreaStackedOptionBuilder2.default.prototype._setUpOptions.call(this);
    this._registerDecorator('yAxisMin0Max100');
    this._registerDecorator('seriesStacked100', { column: 'xAxis', valueIndex: 1 });
};

EChartsAreaStacked100OptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsAreaStackedOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    return seriesItem;
};

exports.default = EChartsAreaStacked100OptionBuilder;

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _echartsAreaCalculatedOptionBuilder = __webpack_require__(50);

var _echartsAreaCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAreaCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsAreaCalculatedStacked100OptionBuilder() {
    _echartsAreaCalculatedOptionBuilder2.default.call(this);
}

EChartsAreaCalculatedStacked100OptionBuilder.prototype = Object.create(_echartsAreaCalculatedOptionBuilder2.default.prototype);
EChartsAreaCalculatedStacked100OptionBuilder.prototype.constructor = EChartsAreaCalculatedStacked100OptionBuilder;

EChartsAreaCalculatedStacked100OptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'areaStyle', 'sampling', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('xAxisBoundaryGapFalse');
    this._registerDecorator('fillXCategoryValues');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('seriesStacked100', { column: 'xAxis', valueIndex: 1 });
    this._setSeriesDataSortRule();
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesKeyColumns(this.plotOptions.stackBy[0].selected);
};

EChartsAreaCalculatedStacked100OptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsAreaCalculatedStacked100OptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsAreaCalculatedOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    return seriesItem;
};

EChartsAreaCalculatedStacked100OptionBuilder.prototype.getSeriesKeyColumns = function () {
    var stackByColumns = this.filterNullColumn(this.plotOptions.stackBy[0].selected);
    if (stackByColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

EChartsAreaCalculatedStacked100OptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

exports.default = EChartsAreaCalculatedStacked100OptionBuilder;

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsBarCalculatedOptionBuilder = __webpack_require__(51);

var _echartsBarCalculatedOptionBuilder2 = _interopRequireDefault(_echartsBarCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarCalculatedStackedOptionBuilder() {
    _echartsBarCalculatedOptionBuilder2.default.call(this);
}

EChartsBarCalculatedStackedOptionBuilder.prototype = Object.create(_echartsBarCalculatedOptionBuilder2.default.prototype);
EChartsBarCalculatedStackedOptionBuilder.prototype.constructor = EChartsBarCalculatedStackedOptionBuilder;

EChartsBarCalculatedStackedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeWithCategoryY');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('plotOptions');
    this._registerDecorator('brush');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipYAxis');
    this._registerDecorator('tooltipAxisPointerShadow');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('axisLineOnZeroTrue');
    this._registerDecorator('seriesStacked');
    this._registerDecorator('xAxisScaleFalse');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsBarCalculatedStackedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsBarCalculatedOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    seriesItem.type = 'bar';
    return seriesItem;
};

EChartsBarCalculatedStackedOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

EChartsBarCalculatedStackedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var stackByColumns = this.filterNullColumn(this.plotOptions.stackBy[0].selected);
    if (stackByColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsBarCalculatedStackedOptionBuilder;

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsBarStacked = __webpack_require__(148);

var _echartsBarStacked2 = _interopRequireDefault(_echartsBarStacked);

var _echartsBarStacked100OptionBuilder = __webpack_require__(249);

var _echartsBarStacked100OptionBuilder2 = _interopRequireDefault(_echartsBarStacked100OptionBuilder);

var _echartsBarCalculatedStacked100OptionBuilder = __webpack_require__(250);

var _echartsBarCalculatedStacked100OptionBuilder2 = _interopRequireDefault(_echartsBarCalculatedStacked100OptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarStacked100(parentId, options) {
    _echartsBarStacked2.default.call(this, parentId, options);
} /**
   * Source: echarts-bar-stacked100.js
   * Created by daewon.park on 2017-04-19.
   */

EChartsBarStacked100.prototype = Object.create(_echartsBarStacked2.default.prototype);
EChartsBarStacked100.prototype.constructor = EChartsBarStacked100;

EChartsBarStacked100.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsBarStacked100.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsBarCalculatedStacked100OptionBuilder2.default();
    } else {
        return new _echartsBarStacked100OptionBuilder2.default();
    }
};

exports.default = EChartsBarStacked100;

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsBarStackedOptionBuilder = __webpack_require__(149);

var _echartsBarStackedOptionBuilder2 = _interopRequireDefault(_echartsBarStackedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarStacked100OptionBuilder() {
    _echartsBarStackedOptionBuilder2.default.call(this);
}

EChartsBarStacked100OptionBuilder.prototype = Object.create(_echartsBarStackedOptionBuilder2.default.prototype);
EChartsBarStacked100OptionBuilder.prototype.constructor = EChartsBarStacked100OptionBuilder;

EChartsBarStacked100OptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipYAxisPercent');
    _echartsBarStackedOptionBuilder2.default.prototype._setUpOptions.call(this);
    this._registerDecorator('xAxisMin0Max100');
    this._registerDecorator('seriesStacked100', { column: 'yAxis', valueIndex: 0 });
};

exports.default = EChartsBarStacked100OptionBuilder;

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsBarCalculatedOptionBuilder = __webpack_require__(51);

var _echartsBarCalculatedOptionBuilder2 = _interopRequireDefault(_echartsBarCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBarCalculatedStacked100OptionBuilder() {
    _echartsBarCalculatedOptionBuilder2.default.call(this);
}

EChartsBarCalculatedStacked100OptionBuilder.prototype = Object.create(_echartsBarCalculatedOptionBuilder2.default.prototype);
EChartsBarCalculatedStacked100OptionBuilder.prototype.constructor = EChartsBarCalculatedStacked100OptionBuilder;

EChartsBarCalculatedStacked100OptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('axisTypeWithCategoryY');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('marker');
    this._registerDecorator('brush');
    this._registerDecorator('xAxisScaleFalse');
    this._registerDecorator('seriesStacked');
    this._registerDecorator('axisLineOnZeroTrue');
    this._registerDecorator('xAxisMin0Max100');
    this._registerDecorator('seriesStacked100', { column: 'yAxis', valueIndex: 0 });
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsBarCalculatedStacked100OptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsBarCalculatedOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.stack = 'stacked';
    seriesItem.type = 'bar';
    return seriesItem;
};

EChartsBarCalculatedStacked100OptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

EChartsBarCalculatedStacked100OptionBuilder.prototype.getSeriesKeyColumns = function () {
    var stackByColumns = this.filterNullColumn(this.plotOptions.stackBy[0].selected);
    if (stackByColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsBarCalculatedStacked100OptionBuilder;

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsBiplotOptionBuilder = __webpack_require__(252);

var _echartsBiplotOptionBuilder2 = _interopRequireDefault(_echartsBiplotOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsBiplot
 * @param parentId
 * @param options
 */
/**
 * Source: echarts-biplot.js
 * Created by daewon.park on 2017-04-24.
 */

function EChartsBiplot(parentId, options) {
  _echartsWrapper2.default.call(this, parentId, options);
}

EChartsBiplot.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsBiplot.prototype.constructor = EChartsBiplot;

EChartsBiplot.prototype.render = function () {
  this.seriesHelper = new _echartsBiplotOptionBuilder2.default();
  var opt = this.seriesHelper.buildOptions(this.options);
  this._bindInternalOptions(this.seriesHelper);
  this._setEChartOption(opt);
  //series itemStyle이 line일때는 없다. 왜지?
  // this._backupItemStyles();
};

exports.default = EChartsBiplot;

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsBiplotExtractor = __webpack_require__(253);

var _echartsBiplotExtractor2 = _interopRequireDefault(_echartsBiplotExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsBiplotOptionBuilder
 * @constructor
 */
/**
 * Created by sds on 2018-03-15.
 */
function EChartsBiplotOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsBiplotOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsBiplotOptionBuilder.prototype.constructor = EChartsBiplotOptionBuilder;

EChartsBiplotOptionBuilder.prototype.buildOptions = function (options) {
    this.bOptions = options;
    this.plotOptions = this.getPlotOptions(); //FIXME: component만 받아올텐데?
    this.eOptions = this._defaultOptions();
    this._setUpOptions();
    this.buildSeries();
    this._buildTooltip();
    this._setAxisRange();
    return this.eOptions;
};

EChartsBiplotOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsOptionBuilder2.default.prototype._defaultOptions.call(this);
    opt.dataZoom = this.bOptions.dataZoom;
    opt.xAxis = [{
        //line
        type: 'value',
        scale: false,
        splitLine: { show: false },
        axisLine: { onZero: true }
    }, {
        //scatter
        type: 'value',
        scale: false,
        splitLine: { show: false },
        axisLine: { onZero: true }
    }];
    opt.yAxis = [{
        type: 'value',
        scale: false,
        splitLine: { show: false },
        axisLine: { onZero: true }
    }, {
        type: 'value',
        scale: false,
        splitLine: { show: false },
        axisLine: { onZero: true }
    }];
    $.extend(true, opt.xAxis, this.bOptions.xAxis);
    $.extend(true, opt.yAxis, this.bOptions.yAxis);
    return opt;
};

//FIXME: color by 구현되면 지워야함.
EChartsBiplotOptionBuilder.prototype.getSeriesKeyColumns = function () {
    return [];
};

EChartsBiplotOptionBuilder.prototype._buildTooltip = function () {};
EChartsBiplotOptionBuilder.prototype._setUpOptions = function () {
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected, 0);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected, 0);
    this.setSeriesDataColumns(this.bOptions.xAxis[1].selected, 1);
    this.setSeriesDataColumns(this.bOptions.yAxis[1].selected, 1);
};
EChartsBiplotOptionBuilder.prototype.buildSeries = function () {
    this.eOptions.series = [];
    this._buildComponentSeries(); //line chart
    this._buildProjectionSeries(); //scatter chart
    this._buildSeriesData();
};

EChartsBiplotOptionBuilder.prototype._buildComponentSeries = function () {
    var datasourceIndex = 0;
    var seriesType = 'component';

    var localData = this.getLocalData(datasourceIndex);
    var keyIndexes = this.getSeriesKeyColumnIndexes(datasourceIndex);
    var dataColumnIndexes = this.getSeriesDataColumnIndexes(datasourceIndex);
    var labelColumnIndexes = this.getLabelColumnIndexes(seriesType, datasourceIndex);

    var series = {};
    var seriesLabel = this._getSeriesLabel(seriesType, labelColumnIndexes);
    var i, row, seriesName, seriesItem;
    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes); //key가되는 colorby 값이 없으면 ""임
        seriesItem = this.getSeriesItem(seriesType, series, seriesName);
        seriesItem.label = seriesLabel;
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = new _echartsBiplotExtractor2.default(dataColumnIndexes);
            seriesItem.extractor.initAxisRange();
            // seriesItem.extractor.keys = this.getCellText(row, dataColumnIndexes);
            // seriesItem.keys = seriesItem.extractor.keys;
        }
        // (0, 0) 원점 추가
        var center = [];
        for (var c = 0; c < localData.columns.length; c++) {
            center.push(0);
        }
        seriesItem.extractor.push(center, -1);
        seriesItem.extractor.push(row, i);
    }
    // this._setSeries(series);
    seriesItem.data = seriesItem.extractor.extract();
    this.eOptions.series.push(seriesItem);
};

EChartsBiplotOptionBuilder.prototype._buildProjectionSeries = function () {
    var datasourceIndex = 1;
    var seriesType = 'projection';

    var localData = this.getLocalData(datasourceIndex);
    var keyIndexes = this.getSeriesKeyColumnIndexes(datasourceIndex);
    var dataColumnIndexes = this.getSeriesDataColumnIndexes(datasourceIndex);
    var labelColumnIndexes = this.getLabelColumnIndexes(seriesType, datasourceIndex);

    var series = {};
    var seriesLabel = this._getSeriesLabel(seriesType, labelColumnIndexes);
    var i, row, seriesName, seriesItem;
    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes); //key가되는 colorby 값이 없으면 ""임
        seriesItem = this.getSeriesItem(seriesType, series, seriesName);
        seriesItem.label = seriesLabel;
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = new _echartsBiplotExtractor2.default(dataColumnIndexes);
            seriesItem.extractor.initAxisRange();
            // seriesItem.extractor.keys = this.getCellText(row, dataColumnIndexes);
            // seriesItem.keys = seriesItem.extractor.keys;
        }
        seriesItem.extractor.push(row, i);
    }
    // this._setSeries(series);
    seriesItem.data = seriesItem.extractor.extract();
    this.eOptions.series.push(seriesItem);
};

/**
 *
 * @param specOptions : 'projection' || 'component'
 * @returns {Array}
 */
EChartsBiplotOptionBuilder.prototype.getLabelColumns = function (seriesName) {
    var specOptions = this.bOptions.plotOptions[seriesName];
    return specOptions.labelBy && specOptions.labelBy.length > 0 ? this.filterNullColumn(specOptions.labelBy[0].selected) : [];
};

EChartsBiplotOptionBuilder.prototype.getLabelColumnIndexes = function (biplotChartType, dataIndex) {
    var localData = this.getLocalData(dataIndex);
    var keyColumns = this.getLabelColumns(biplotChartType);
    return this.getColumnIndexes(keyColumns, localData.columns);
};

EChartsBiplotOptionBuilder.prototype.getSeriesItem = function (biplotChartType, series, seriesName) {
    var seriesItem = series[seriesName];
    if (!seriesItem) {
        seriesItem = this._newSeriesItem(biplotChartType);
    }
    return seriesItem;
};

EChartsBiplotOptionBuilder.prototype._newSeriesItem = function (seriesName) {
    var datasourceIndex = seriesName == 'component' ? 0 : 1;
    var seriesItem = {
        type: seriesName == 'component' ? 'line' : 'scatter',
        xAxisIndex: datasourceIndex,
        yAxisIndex: datasourceIndex,
        name: seriesName,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    var specOptions = this.bOptions.plotOptions[seriesName];

    //Marker
    if (typeof specOptions.marker !== 'undefined') {
        for (var attrName in specOptions.marker) {
            seriesItem[attrName] = specOptions.marker[attrName];
        }
    }

    return seriesItem;
};

EChartsBiplotOptionBuilder.prototype._getSeriesLabel = function (seriesName, labelColumnIndexes) {
    var specOptions = this.bOptions.plotOptions[seriesName];
    var datasourceIndex = seriesName == 'component' ? 0 : 1;

    var localData = this.getLocalData(datasourceIndex);
    var label;
    // Label
    if (labelColumnIndexes.length > 0) {
        label = specOptions.label || { normal: { show: true } };
        $.extend(true, label, {
            normal: {
                formatter: function formatter(params) {
                    var dataIndex = params.data.dataIndexes[0];
                    if (dataIndex === -1) return '';
                    return localData.data[dataIndex][labelColumnIndexes[0]];
                },
                textStyle: {
                    // color: this.bOptions.colorSet[datasourceIndex] //FIXME: colorby 들어가면 이걸로 수정해야할듯
                    color: datasourceIndex == 0 ? this.bOptions.colorSet[datasourceIndex] : 'black'
                }
            }
        });
    }
    return label;
};

EChartsBiplotOptionBuilder.prototype._buildSeriesData = function () {
    for (var s in this.eOptions.series) {
        this.eOptions.series[s].data = this.eOptions.series[s].extractor.extract();
    }
};

EChartsBiplotOptionBuilder.prototype._setAxisRange = function () {
    for (var s in this.eOptions.series) {
        var axisRange = this.eOptions.series[s].extractor.getAxisRange();
        this.eOptions.xAxis[s].min = -Number(axisRange.maxAbsX);
        this.eOptions.xAxis[s].max = Number(axisRange.maxAbsX);
        this.eOptions.yAxis[s].min = -Number(axisRange.maxAbsY);
        this.eOptions.yAxis[s].max = Number(axisRange.maxAbsY);
    }
};

exports.default = EChartsBiplotOptionBuilder;

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by sds on 2018-03-15.
 */

//todo: fix
function BiplotPointDataExtractor(columnIndexes) {
    // PointExtractor.call(this, columnIndexes);
    this.columnIndexes = columnIndexes;
    this.points = [];
    this.xCategories = {};
}

// BiplotPointDataExtractor.prototype = Object.create(PointExtractor.prototype);
// BiplotPointDataExtractor.prototype.constructor = BiplotPointDataExtractor;

BiplotPointDataExtractor.prototype.push = function (row, rowIndex) {
    var isFinite = true;
    var pointData = {
        value: [],
        dataIndexes: [parseInt(rowIndex)] // point 에 해당하는 원본 데이터 인덱스
    };
    for (var d in this.columnIndexes) {
        if (!isFinite) break;
        var idxValue = row[this.columnIndexes[d]];
        isFinite = Number.isFinite(idxValue);
        if (isFinite && this.axisRange) {
            var absCeilValue = Math.abs(idxValue);
            if (d == 0) {
                this.axisRange.maxAbsX = Math.max(this.axisRange.maxAbsX, absCeilValue);
            } else if (d == 1) {
                this.axisRange.maxAbsY = Math.max(this.axisRange.maxAbsY, absCeilValue);
            }
        }
        pointData.value.push(idxValue);
    }
    if (isFinite) this.points.push(pointData);
};

BiplotPointDataExtractor.prototype.extract = function () {
    return this.points;
};

BiplotPointDataExtractor.prototype.initAxisRange = function () {
    this.axisRange = {
        maxAbsX: Number.MIN_VALUE,
        maxAbsY: Number.MIN_VALUE
    };
};

BiplotPointDataExtractor.prototype.getAxisRange = function () {
    return this.axisRange;
};

exports.default = BiplotPointDataExtractor;

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _echartsBoxplotOptionBuilder = __webpack_require__(150);

var _echartsBoxplotOptionBuilder2 = _interopRequireDefault(_echartsBoxplotOptionBuilder);

var _echartsBoxplotCalculatedOptionBuilder = __webpack_require__(255);

var _echartsBoxplotCalculatedOptionBuilder2 = _interopRequireDefault(_echartsBoxplotCalculatedOptionBuilder);

var _echartsBoxplotBycolumnnamesOptionBuilder = __webpack_require__(256);

var _echartsBoxplotBycolumnnamesOptionBuilder2 = _interopRequireDefault(_echartsBoxplotBycolumnnamesOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBoxPlot(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Source: echarts-boxplot.js
   * Created by daewon.park on 2017-03-31.
   */

EChartsBoxPlot.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsBoxPlot.prototype.constructor = EChartsBoxPlot;

EChartsBoxPlot.prototype._init = function () {
    _echartsWrapper2.default.prototype._init.call(this);
};

EChartsBoxPlot.prototype.render = function () {
    var xAxisType = _optionUtils2.default.getXAxisType(this.options);

    if (xAxisType === 'byColumnNames') {
        this.seriesHelper = new _echartsBoxplotBycolumnnamesOptionBuilder2.default();
    } else if (this.options.source.localData[0].dataType === 'chartdata') {
        this.seriesHelper = new _echartsBoxplotCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsBoxplotOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsBoxPlot.prototype.getLegendData = function () {
    var legendData = _echartsWrapper2.default.prototype.getLegendData.call(this);
    for (var i in legendData) {
        legendData[i].symbol = 'square';
    }
    return legendData;
};

exports.default = EChartsBoxPlot;

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsBoxplotOptionBuilder = __webpack_require__(150);

var _echartsBoxplotOptionBuilder2 = _interopRequireDefault(_echartsBoxplotOptionBuilder);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBoxPlotCalculatedOptionBuilder() {
    _echartsBoxplotOptionBuilder2.default.call(this);
}

EChartsBoxPlotCalculatedOptionBuilder.prototype = Object.create(_echartsBoxplotOptionBuilder2.default.prototype);
EChartsBoxPlotCalculatedOptionBuilder.prototype.constructor = EChartsBoxPlotCalculatedOptionBuilder;

EChartsBoxPlotCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: false
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: true
    });

    return extractor;
};

EChartsBoxPlotCalculatedOptionBuilder.prototype._buildSeriesData = function () {
    var outliers = [];

    for (var s in this.series) {
        var boxplotData = this.series[s].extractor.extract()[0].value;

        var axisType = this._getColumnDataType(this.filterNullColumn(this.bOptions.xAxis[0].selected));
        var sortRule = function sortRule(a, b) {
            var comp;
            if (axisType === 'category') comp = _optionUtils2.default.stringSortRule(a[0], b[0]);else if (axisType === 'time') comp = _optionUtils2.default.timeSortRule(a[0], b[0]);else comp = _optionUtils2.default.numericSortRule(a[0] * 1, b[0] * 1);

            return comp;
        };

        boxplotData.sort(sortRule);

        var seriesItemData = {
            boxData: [],
            outliers: []
        };

        for (var d in boxplotData) {
            var boxData = {
                name: boxplotData[d][0],
                value: boxplotData[d][1].box
            };
            seriesItemData.boxData.push(boxData);

            //Spec 확인 필요사항임.
            var out = boxplotData[d][1].outliers.split(',');
            out = out.map(function (item) {
                return {
                    name: boxplotData[d][0],
                    value: [boxplotData[d][0], item]
                };
            });
            seriesItemData.outliers = seriesItemData.outliers.concat(out);
        }

        this.series[s].data = seriesItemData.boxData;

        // TODO 3.6.2 에서 series.data = [{ value: {...}, itemStyle: {} }, { value: {...}, itemStyle: {} }] 형태를 인식하지 못하는 bug 가 있음. by daewon.park
        this.series[s]._originalData = this.series[s].data;

        // outlier series data
        if (seriesItemData.outliers.length > 0) {
            var outlierSeriesItem = {
                name: this.series[s].name,
                type: 'scatter',
                data: seriesItemData.outliers
            };
            outliers.push(outlierSeriesItem);
        }
    }
    for (var o in outliers) {
        this.series.push(outliers[o]);
    }
};

exports.default = EChartsBoxPlotCalculatedOptionBuilder;

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointBycolumnnamesExtractor = __webpack_require__(36);

var _echartsPointBycolumnnamesExtractor2 = _interopRequireDefault(_echartsPointBycolumnnamesExtractor);

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _boxplotOperator = __webpack_require__(151);

var _boxplotOperator2 = _interopRequireDefault(_boxplotOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBoxPlotByColumnNamesOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsBoxPlotByColumnNamesOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsBoxPlotByColumnNamesOptionBuilder.prototype.constructor = EChartsBoxPlotByColumnNamesOptionBuilder;

EChartsBoxPlotByColumnNamesOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['boxWidth'];
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('boxPlotByColumnNamesAxisDecorator');
    this._registerDecorator('tooltipBoxPlotByColumnNames');
    this._registerDecorator('plotOptions');
    this._registerDecorator('boxPlotSeparateColorDecorator');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsBoxPlotByColumnNamesOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);

    var extractor = new _echartsPointBycolumnnamesExtractor2.default();

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (points) {
        var operatorMap = {};
        var point, categoryIndex, operator;
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            categoryIndex = point.categoryIndex;
            var x = point.value[0];
            if (!operatorMap[x]) {
                operatorMap[x] = new _boxplotOperator2.default([x]);
            }
            operator = operatorMap[x];
            operator.add(point.dataIndexes[0], point.value[1]);
        }
        var answer = [];
        for (var i in operatorMap) {
            answer.push(operatorMap[i].calc());
        }
        return answer;
    });

    return extractor;
};

EChartsBoxPlotByColumnNamesOptionBuilder.prototype._buildSeriesData = function () {
    var outliers = [];
    var datacolumns = this.getSeriesDataColumns();

    for (var s in this.series) {
        var boxplotData = this.series[s].extractor.extract();

        var seriesItemData = {
            boxData: [],
            outliers: []
        };

        for (var d in boxplotData) {
            var boxData = boxplotData[d].boxData;
            boxData.name = datacolumns[boxplotData[d].x].name;
            seriesItemData.boxData.push(boxData);

            var out = boxplotData[d].outliers;
            out = out.map(function (item) {
                return {
                    name: datacolumns[boxplotData[d].x].name,
                    value: item.value,
                    dataIndexes: item.dataIndexes
                };
            });
            seriesItemData.outliers = seriesItemData.outliers.concat(out);
        }

        // boxplot series data
        this.series[s].data = seriesItemData.boxData;

        // TODO 3.6.2 에서 series.data = [{ value: {...}, itemStyle: {} }, { value: {...}, itemStyle: {} }] 형태를 인식하지 못하는 bug 가 있음. by daewon.park
        this.series[s]._originalData = this.series[s].data;

        seriesItemData.outliers.map(function (value) {
            value.value[0] *= 1;
        });

        // outlier series data
        if (seriesItemData.outliers.length > 0) {
            var outlierSeriesItem = {
                name: this.series[s].name,
                type: 'scatter',
                data: seriesItemData.outliers
            };
            outliers.push(outlierSeriesItem);
        }
    }
    for (var o in outliers) {
        this.series.push(outliers[o]);
    }
};

exports.default = EChartsBoxPlotByColumnNamesOptionBuilder;

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsBubbleOptionBuilder = __webpack_require__(258);

var _echartsBubbleOptionBuilder2 = _interopRequireDefault(_echartsBubbleOptionBuilder);

var _echartsBubbleCalculatedOptionBuilder = __webpack_require__(259);

var _echartsBubbleCalculatedOptionBuilder2 = _interopRequireDefault(_echartsBubbleCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsBubble
 * @param parentId
 * @param options
 * @constructor
 */
function EChartsBubble(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Created by ji_sung.park on 2017-09-05.
   */

EChartsBubble.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsBubble.prototype.constructor = EChartsBubble;

EChartsBubble.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();

    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsBubble.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsBubbleCalculatedOptionBuilder2.default();
    } else {
        return new _echartsBubbleOptionBuilder2.default();
    }
};

exports.default = EChartsBubble;

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBubbleOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsBubbleOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsBubbleOptionBuilder.prototype.constructor = EChartsBubbleOptionBuilder;

EChartsBubbleOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipBubble');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('itemOpacity7');
    this._registerDecorator('bubbleSize');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.plotOptions.bubble.sizeBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.bubble.sizeBy[0].selected);
};

EChartsBubbleOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var dataColumns = this.getSeriesDataColumns();
    var aggregation = 'count';
    if (dataColumns[2]) aggregation = dataColumns[2].aggregation;
    var xIndexes = this.getColumnIndexes(this.bOptions.xAxis[0].selected, localData.columns);
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);
    var sizeByIndexes = this.getColumnIndexes(this.bOptions.plotOptions.bubble.sizeBy[0].selected, localData.columns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: _optionUtils2.default.getAxisType(localData.columns[xIndexes[0]]),
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: _optionUtils2.default.getAxisType(localData.columns[yIndexes[0]]),
        isKey: true
    });

    extractor.setTarget({
        index: sizeByIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var operator = new _aggregationOperator2.default(pointObject.value);
        for (var i = 0; i < pointObject.indexList.length; i++) {
            operator.add(pointObject.indexList[i], pointObject.point[i] ? pointObject.point[i][2] : 1);
        }
        return [{ value: pointObject.value.concat(operator.calc(aggregation)), dataIndexes: pointObject.indexList }];
    });

    return extractor;
};

EChartsBubbleOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'scatter';
    return seriesItem;
};

exports.default = EChartsBubbleOptionBuilder;

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsScatterCalculatedOptionBuilder = __webpack_require__(52);

var _echartsScatterCalculatedOptionBuilder2 = _interopRequireDefault(_echartsScatterCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsBubbleCalculatedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsBubbleCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsBubbleCalculatedOptionBuilder.prototype.constructor = EChartsBubbleCalculatedOptionBuilder;

EChartsBubbleCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipBubbleCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._registerDecorator('itemOpacity7');
    this._registerDecorator('bubbleSize');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.plotOptions.bubble.sizeBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.bubble.sizeBy[0].selected);
};

EChartsBubbleCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);
    var sizeByIndexes = this.getColumnIndexes([{ name: 'sizeBy' }], localData.chartColumns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: _optionUtils2.default.getAxisType(localData.columns[xIndexes[0]]),
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: _optionUtils2.default.getAxisType(localData.columns[yIndexes[0]]),
        isKey: true
    });

    extractor.setTarget({
        index: sizeByIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsBubbleCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'scatter';
    return seriesItem;
};

EChartsBubbleCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var keyColumns = this.filterNullColumn(this.bOptions.colorBy[0].selected);
    if (keyColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsBubbleCalculatedOptionBuilder;

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsCardOptionBuilder = __webpack_require__(261);

var _echartsCardOptionBuilder2 = _interopRequireDefault(_echartsCardOptionBuilder);

var _echartsCardCalculatedOptionBuilder = __webpack_require__(262);

var _echartsCardCalculatedOptionBuilder2 = _interopRequireDefault(_echartsCardCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsCard(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Created by sds on 2018-03-26.
   */


EChartsCard.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsCard.prototype.constructor = EChartsCard;

EChartsCard.prototype.render = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        this.seriesHelper = new _echartsCardCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsCardOptionBuilder2.default();
    }

    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsCard.prototype.getLegendData = function () {};

exports.default = EChartsCard;

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsCardOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
} /**
   * Created by sds on 2018-03-26.
   */


EChartsCardOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsCardOptionBuilder.prototype.constructor = EChartsCardOptionBuilder;

EChartsCardOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['label', 'symbolRepeat', 'symbolSize'];
    this._registerDecorator('plotOptions');
    this._registerDecorator('axisTypeWithCategoryY');
    this._registerDecorator('axisHidden');
    this._registerDecorator('brushRemoval');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.plotOptions.card.valueBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.card.valueBy[0].selected);
};

EChartsCardOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    var leng = 0;
    if (this.getPlotOptions().leng && this.getPlotOptions().leng[0] && this.getPlotOptions().leng[0].selected) {
        leng = this.getPlotOptions().leng[0].selected;
    }
    $.extend(true, seriesItem, {
        type: 'custom',
        renderItem: function renderItem(params, api) {
            return {
                type: 'text',
                style: {
                    text: parseFloat(api.value(0)).toFixed(leng),
                    x: params.coordSys.x + params.coordSys.width / 2,
                    y: params.coordSys.y + params.coordSys.height / 2,
                    textAlign: 'center',
                    textVerticalAlign: 'center',
                    font: api.font(api.style()),
                    fill: api.style().textFill
                }
            };
        }
    });

    return seriesItem;
};

EChartsCardOptionBuilder.prototype._buildSeriesData = function () {
    var aggregation = this.getSeriesDataColumns(0)[0].aggregation;
    var fixed = parseInt(this.plotOptions.leng[0].selected);

    for (var s in this.series) {
        //series length is 1
        this.series[s].data = this.series[s].extractor.extract(function (pointMap) {
            if (aggregation === 'none') {
                return [parseFloat(pointMap[0].point[0][0])];
            } else {
                var operator = new _aggregationOperator2.default();
                for (var i in pointMap) {
                    if (pointMap[i].point[0].length > 1) {
                        console.warn('Not expected case');
                    }
                    operator.add(i, pointMap[i].point[0][0]);
                }
                return [operator.calc(aggregation)];
            }
        });
    }
};

EChartsCardOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var dataColumns = this.getSeriesDataColumns(0);
    var aggregation = 'count';
    if (dataColumns[dataColumns.length - 1] !== null && dataColumns[dataColumns.length - 1].aggregation && dataColumns[dataColumns.length - 1].aggregation !== 'none') aggregation = dataColumns[dataColumns.length - 1].aggregation;
    var valueByIndexes = this.getColumnIndexes(this.bOptions.plotOptions.card.valueBy[0].selected, localData.columns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: valueByIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

exports.default = EChartsCardOptionBuilder;

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsCardCalculatedOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsCardCalculatedOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsCardCalculatedOptionBuilder.prototype.constructor = EChartsCardCalculatedOptionBuilder;

EChartsCardCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['label', 'symbolRepeat', 'symbolSize'];
    this._registerDecorator('plotOptions');
    this._registerDecorator('axisTypeWithCategoryY');
    this._registerDecorator('axisHidden');
    this._registerDecorator('brushRemoval');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.plotOptions.card.valueBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.card.valueBy[0].selected);
};

EChartsCardCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    var leng = 0;
    if (this.getPlotOptions().leng && this.getPlotOptions().leng[0] && this.getPlotOptions().leng[0].selected) {
        leng = this.getPlotOptions().leng[0].selected;
    }
    $.extend(true, seriesItem, {
        type: 'custom',
        renderItem: function renderItem(params, api) {
            return {
                type: 'text',
                style: {
                    text: parseFloat(api.value(0)).toFixed(leng),
                    x: params.coordSys.x + params.coordSys.width / 2,
                    y: params.coordSys.y + params.coordSys.height / 2,
                    textAlign: 'center',
                    textVerticalAlign: 'center',
                    font: api.font(api.style()),
                    fill: api.style().textFill
                }
            };
        }
    });

    return seriesItem;
};

EChartsCardCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var valueByIndexes = this.getColumnIndexes([{ name: 'value' }], localData.chartColumns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: valueByIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

exports.default = EChartsCardCalculatedOptionBuilder;

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnCalculatedOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsColumnCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsColumnCalculatedOptionBuilder.prototype.constructor = EChartsColumnCalculatedOptionBuilder;

EChartsColumnCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipItemCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('brush');
    this._registerDecorator('yAxisMin0', { aggr: ['count'] });
    this._registerDecorator('axisLineOnZeroTrue');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsColumnCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsColumnCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'bar',
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    return seriesItem;
};

EChartsColumnCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var keyColumns = this.filterNullColumn(this.bOptions.colorBy[0].selected);
    if (keyColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsColumnCalculatedOptionBuilder;

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeComplexOptionBuilder = __webpack_require__(35);

var _echartsAxisTypeComplexOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeComplexOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-01-24.
 */

function EChartsColumnComplexOptionBuilder() {
    _echartsAxisTypeComplexOptionBuilder2.default.call(this);
}

EChartsColumnComplexOptionBuilder.prototype = Object.create(_echartsAxisTypeComplexOptionBuilder2.default.prototype);
EChartsColumnComplexOptionBuilder.prototype.constructor = EChartsColumnComplexOptionBuilder;

EChartsColumnComplexOptionBuilder.prototype._setUpOptions = function () {
    _echartsAxisTypeComplexOptionBuilder2.default.prototype._setUpOptions.call(this);
    this._registerDecorator('stripline');
    this._registerDecorator('plotOptions');
    this._registerDecorator('xAxisScaleFalse');
    this._registerDecorator('yAxisMin0', { aggr: ['count'] });
    this._registerDecorator('axisLineOnZeroTrue');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsColumnComplexOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'bar';
    return seriesItem;
};

exports.default = EChartsColumnComplexOptionBuilder;

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnCalculatedStackedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsColumnCalculatedStackedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsColumnCalculatedStackedOptionBuilder.prototype.constructor = EChartsColumnCalculatedStackedOptionBuilder;

EChartsColumnCalculatedStackedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisPointerShadow');
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('marker');
    this._registerDecorator('brush');
    this._registerDecorator('yAxisScaleFalse');
    this._registerDecorator('seriesStacked');
    this._registerDecorator('axisLineOnZeroTrue');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesKeyColumns(this.plotOptions.stackBy[0].selected);
};

EChartsColumnCalculatedStackedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsColumnCalculatedStackedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'bar',
        stack: 'stacked',
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    return seriesItem;
};

EChartsColumnCalculatedStackedOptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

EChartsColumnCalculatedStackedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var stackByColumns = this.filterNullColumn(this.plotOptions.stackBy[0].selected);
    if (stackByColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsColumnCalculatedStackedOptionBuilder;

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsColumnStacked = __webpack_require__(153);

var _echartsColumnStacked2 = _interopRequireDefault(_echartsColumnStacked);

var _echartsColumnStacked100OptionBuilder = __webpack_require__(267);

var _echartsColumnStacked100OptionBuilder2 = _interopRequireDefault(_echartsColumnStacked100OptionBuilder);

var _echartsColumnCalculatedStacked100OptionBuilder = __webpack_require__(268);

var _echartsColumnCalculatedStacked100OptionBuilder2 = _interopRequireDefault(_echartsColumnCalculatedStacked100OptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnStacked100(parentId, options) {
    _echartsColumnStacked2.default.call(this, parentId, options);
} /**
   * Source: echarts-column-stacked100.js
   * Created by daewon.park on 2017-04-19.
   */

EChartsColumnStacked100.prototype = Object.create(_echartsColumnStacked2.default.prototype);
EChartsColumnStacked100.prototype.constructor = EChartsColumnStacked100;

EChartsColumnStacked100.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
};

EChartsColumnStacked100.prototype.getSeriesHelper = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        return new _echartsColumnCalculatedStacked100OptionBuilder2.default();
    } else {
        return new _echartsColumnStacked100OptionBuilder2.default();
    }
};

exports.default = EChartsColumnStacked100;

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsColumnStackedOptionBuilder = __webpack_require__(154);

var _echartsColumnStackedOptionBuilder2 = _interopRequireDefault(_echartsColumnStackedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnStacked100OptionBuilder() {
    _echartsColumnStackedOptionBuilder2.default.call(this);
}

EChartsColumnStacked100OptionBuilder.prototype = Object.create(_echartsColumnStackedOptionBuilder2.default.prototype);
EChartsColumnStacked100OptionBuilder.prototype.constructor = EChartsColumnStacked100OptionBuilder;

EChartsColumnStacked100OptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipXAxisPercent');
    _echartsColumnStackedOptionBuilder2.default.prototype._setUpOptions.call(this);
    this._registerDecorator('yAxisMin0Max100');
    this._registerDecorator('seriesStacked100', { column: 'xAxis', valueIndex: 1 });
};

exports.default = EChartsColumnStacked100OptionBuilder;

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsColumnCalculatedStacked100OptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsColumnCalculatedStacked100OptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsColumnCalculatedStacked100OptionBuilder.prototype.constructor = EChartsColumnCalculatedStacked100OptionBuilder;

EChartsColumnCalculatedStacked100OptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisCalculated');
    this._registerDecorator('axisTypeWithCategoryX');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('marker');
    this._registerDecorator('brush');
    this._registerDecorator('yAxisScaleFalse');
    this._registerDecorator('seriesStacked');
    this._registerDecorator('axisLineOnZeroTrue');
    this._registerDecorator('yAxisMin0Max100');
    this._registerDecorator('seriesStacked100', { column: 'xAxis', valueIndex: 1 });
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesKeyColumns(this.plotOptions.stackBy[0].selected);
};

EChartsColumnCalculatedStacked100OptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData();
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsColumnCalculatedStacked100OptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'bar',
        stack: 'stacked',
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    return seriesItem;
};

EChartsColumnCalculatedStacked100OptionBuilder.prototype.getTooltipKeyColumns = function (dataIndex) {
    dataIndex = dataIndex ? dataIndex : 0;
    return this.plotOptions.stackBy.length > 0 ? this.filterNullColumn(this.plotOptions.stackBy[dataIndex].selected) : [];
};

EChartsColumnCalculatedStacked100OptionBuilder.prototype.getSeriesKeyColumns = function () {
    var stackByColumns = this.filterNullColumn(this.plotOptions.stackBy[0].selected);
    if (stackByColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

exports.default = EChartsColumnCalculatedStacked100OptionBuilder;

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsComplexOptionBuilder = __webpack_require__(270);

var _echartsComplexOptionBuilder2 = _interopRequireDefault(_echartsComplexOptionBuilder);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _echartsLine = __webpack_require__(33);

var _echartsLine2 = _interopRequireDefault(_echartsLine);

var _echartsColumn = __webpack_require__(37);

var _echartsColumn2 = _interopRequireDefault(_echartsColumn);

var _echartsScatter = __webpack_require__(53);

var _echartsScatter2 = _interopRequireDefault(_echartsScatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: echarts-scatter.js
 * Created by daewon.park on 2017-03-23.
 */

var complexChart = { line: _echartsLine2.default, column: _echartsColumn2.default, scatter: _echartsScatter2.default };

/**
 * EChartsComplex
 * @param parentId
 * @param options
 * @constructor
 */
function EChartsComplex(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsComplex.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsComplex.prototype.constructor = EChartsComplex;

EChartsComplex.prototype.render = function () {
    var optionsList = this._getChartOptionList(this.options);

    this.seriesHelper = new _echartsComplexOptionBuilder2.default();
    var opt = this.seriesHelper.buildOptions(optionsList);
    opt.tooltip = this.options.tooltip;

    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsComplex.prototype._getChartOptionList = function (options) {
    var optionsList = [];

    var isCategory = options.complex.some(function (chartOption) {
        return chartOption.chart.type === 'column';
    });

    var complexOption, complexChartType, singleBOptions, singleECharts, eChartOptionBuilder, singleChartOpt;
    var seriesIdx = 0;
    for (var chartIdx = 0; chartIdx < options.complex.length; chartIdx++) {
        complexOption = options.complex[chartIdx];
        complexChartType = complexOption.chart.type;
        delete complexOption.source;
        singleBOptions = $.extend(true, {}, options, complexOption);
        _chartUtils2.default.assignArray(singleBOptions, complexOption);

        if (!complexChart[complexChartType]) {
            throw '[' + complexChartType + '] chart cannot use to complex chart.';
        }

        singleECharts = new complexChart[complexChartType](this.parentId, singleBOptions);
        singleECharts.parseComplex(true);
        // var eChartOptionBuilder = singleECharts.getSeriesHelper().setComplexKey(singleBOptions.yAxis[0].selected[0]);
        eChartOptionBuilder = singleECharts.getSeriesHelper().setComplexOption({
            column: singleBOptions.yAxis[0].selected[0],
            idx: seriesIdx
        });
        if (isCategory) {
            //column chart가 포함돼있으면 x축을 category로 변경해야함.
            eChartOptionBuilder = eChartOptionBuilder.parseCategory(true);
        }

        this._bindInternalOptions(eChartOptionBuilder);
        singleChartOpt = eChartOptionBuilder.buildOptions(singleBOptions);
        seriesIdx = seriesIdx + eChartOptionBuilder.seriesNameSet.length;
        optionsList.push(singleChartOpt);

        singleECharts.destroy();
        singleECharts.$mainControl.remove();
    }
    return optionsList;
};

EChartsComplex.prototype._bindInternalOptions = function (opt) {
    var _this = this;
    opt._internalOptions = function () {
        return _this._getEChartOption();
    };
};

EChartsComplex.prototype.getLegendData = function () {
    var legendData = {};

    if (this._getEChartOption().legend && this._getEChartOption().legend[0]) {
        var legendSelection = this._getEChartOption().legend[0].selected;
        var hasLegend = this.seriesHelper.hasLegendData();

        if (hasLegend) {
            //무조건 true
            var opt = this.seriesHelper._internalOptions();
            for (var i in opt.series) {
                if (opt.series[i].virtualSeries) {
                    // true 일 경우만 skip
                } else {
                    var item = {
                        name: opt.series[i].name,
                        symbol: opt.series[i].symbol || 'circle',
                        symbolSize: opt.series[i].symbolSize || 10,
                        color: opt.series[i].itemStyle.color || opt.color[parseFloat(i) % opt.color.length]
                    };
                    if (typeof legendSelection[item.name] === 'undefined') {
                        item.selected = true;
                    } else {
                        item.selected = legendSelection[item.name];
                    }
                    // legendData.push(item);
                    legendData[item.color] = item;
                }
            }
        }
    }
    return Object.values(legendData);
};

exports.default = EChartsComplex;

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsComplexOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
} /**
   * Created by sds on 2018-01-23.
   */


EChartsComplexOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsComplexOptionBuilder.prototype.constructor = EChartsComplexOptionBuilder;

EChartsComplexOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('xAxisFilterZoomMode');
};

EChartsComplexOptionBuilder.prototype.buildOptions = function (chartOptions) {
    this.eOptions = this._buildSeries(chartOptions);
    this._setUpOptions();
    this._decorate();
    return this.eOptions;
};

EChartsComplexOptionBuilder.prototype._buildSeries = function (chartOptionList) {
    var mergedOption;
    for (var idx = 0; idx < chartOptionList.length; idx++) {
        if (idx == 0) {
            mergedOption = $.extend(true, {}, chartOptionList[idx]);
            mergedOption.series = [];
            mergedOption.tooltip = {};
            mergedOption.yAxis = [];
        }

        var chartSeries = chartOptionList[idx].series; //.slice();
        for (var seriesIdx = 0; seriesIdx < chartSeries.length; seriesIdx++) {
            if (chartSeries[seriesIdx].virtualSeries) {
                //POLICY: complex chart는 stripline 제외.(임시)
                chartSeries[seriesIdx] = null;
                continue;
            } else {
                chartSeries[seriesIdx].yAxisIndex = idx;
                chartSeries[seriesIdx].tooltip = chartOptionList[idx].tooltip;
            }
        }
        mergedOption.series = mergedOption.series.concat(chartSeries.filter(function (singleSeries) {
            return singleSeries;
        }));
        mergedOption.yAxis = mergedOption.yAxis.concat(chartOptionList[idx].yAxis);
    }
    return mergedOption;
};

EChartsComplexOptionBuilder.prototype.hasLegendData = function () {
    return true;
};

EChartsComplexOptionBuilder.prototype._decorate = function () {
    for (var k in this._decoratorList) {
        if (!this._decoratorList[k]) continue;
        this._decoratorList[k].decorate(this.eOptions);
    }
};

exports.default = EChartsComplexOptionBuilder;

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

var _d3Wrap = __webpack_require__(272);

var _d3Wrap2 = _interopRequireDefault(_d3Wrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: d3.wrapper.js
 * Created by daewon.park on 2017-03-23.
 */
function D3Wrapper(parentId, options) {
    _widget2.default.call(this, parentId, options);
}

D3Wrapper.prototype = Object.create(_widget2.default.prototype);
D3Wrapper.prototype.constructor = D3Wrapper;
D3Wrapper.prototype.destroy = function () {

    if (this.d3chart) {
        $(window).off('resize', this.resizeHandler);

        this.d3chart.clear();
        this.d3chart.dispose();
        this.d3chart.destroy();
        // d3chart.dispose(this.d3chart);
        // d3chart.dispose(this.$mainControl[0]);
        this.d3chart = null;
    }
};

D3Wrapper.prototype._extractSeriesSelection = function (batch, series, keyColumns) {
    var selected = [];
    if (keyColumns.length > 0) {
        for (var s in batch.selected) {
            var seriesIndex = batch.selected[s].seriesIndex;
            var selection = {};
            for (var k in keyColumns) {
                var seriesKey = keyColumns[k].name;
                var seriesValue = series[seriesIndex].keys[k];
                selection[seriesKey] = seriesValue;
            }
            selected.push(selection);
        }
    } else {
        selected.push({});
    }
    return selected;
};

D3Wrapper.prototype._convertToSelection = function (axis, columnName, range) {
    if (axis.type === 'value') {
        return {
            min: range[0],
            max: range[1]
        };
    } else {
        return {
            min: axis.data[range[0]],
            max: axis.data[range[1]]
        };
    }
};

D3Wrapper.prototype._createContents = function ($parent) {
    var _this = this;
    this.$mainControl = $('<div class="bcharts-chart" chart-vendor="d3"></div>');
    $parent.append(this.$mainControl);

    this.d3chart = new _d3Wrap2.default();
    this.d3chart.init(this.$mainControl, this.options);

    this._chartInit();

    this._bindMouseOut();

    this.resizeHandler = function () {
        _this.redrawLayout();
        // _this.render();
    };
    $(window).resize(this.resizeHandler);
};

D3Wrapper.prototype._chartInit = function ($parent) {};

D3Wrapper.prototype._bindMouseOut = function () {
    var _this = this;
    this.$mainControl.mouseout(function (event) {
        if (_this.d3chart && _this.d3chart.nodeTooltip && event.toElement !== _this.$mainControl[0] && $(event.toElement).closest('.bcharts-chart')[0] !== _this.$mainControl[0] && !$(event.toElement).hasClass('d3-node-tooltip')) {
            _this.d3chart.nodeTooltip.hide();
        }
    });
};

D3Wrapper.prototype.selectRange = function (args) {};

D3Wrapper.prototype.clear = function () {
    this.d3chart.clear();

    // TODO tooltip 을 위한 div 가 render 할 때 마다 생성됨, 강제로 삭제 by daewon.park since 2017-05-23
    this.$mainControl.children('div:nth-child(2)').remove();
};

D3Wrapper.prototype._bindInternalOptions = function (opt) {
    var _this = this;
    opt._internalOptions = function () {
        return _this.d3chart.getOption();
    };
};

D3Wrapper.prototype.getDataURL = function (options) {
    // if (this.d3chart) {
    // return this.d3chart.getDataURL(options);
    // }
};

D3Wrapper.prototype.render = function () {};

D3Wrapper.prototype.redrawLayout = function () {
    var _this = this;

    clearTimeout(this._redrawLayoutJob);
    this._redrawLayoutJob = setTimeout(function () {
        if (_this.d3chart) {
            _this.d3chart.resize();
        }
    }, 300);
};

D3Wrapper.prototype.setBrushType = function (opt) {};

D3Wrapper.prototype.setZoomMode = function (zoom) {};

D3Wrapper.prototype.toggleLegend = function (name) {
    this.d3chart.dispatchAction({
        type: 'legendToggleSelect',
        name: name
    });
};

D3Wrapper.prototype.getLegendData = function () {
    var legendData = [];

    if (this.d3chart.getOption().legend && this.d3chart.getOption().legend[0]) {
        var legendSelection = this.d3chart.getOption().legend[0].selected;
        var keyColumns = this.seriesHelper.getSeriesKeyColumns(this.options);
        if (keyColumns.length > 0) {
            var opt = this.seriesHelper.d3Options;
            for (var i in opt.series) {
                if (opt.series[i].virtualSeries) {
                    // true 일 경우만 skip
                } else {
                    var item = {
                        name: opt.series[i].name,
                        symbol: opt.series[i].symbol || 'circle',
                        symbolSize: opt.series[i].symbolSize || 10,
                        color: opt.color[parseFloat(i) % opt.color.length]
                    };
                    if (typeof legendSelection[item.name] === 'undefined') {
                        item.selected = true;
                    } else {
                        item.selected = legendSelection[item.name];
                    }
                    legendData.push(item);
                }
            }
        }
    }

    return legendData;
};

exports.default = D3Wrapper;

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by jhoon80.park on 2017-09-17.
 */

function D3Wrap() {};

D3Wrap.prototype.init = function ($parent, options) {
    this.parent = $parent;
    this.options = options;
    this.d3 = d3;
    this.mainContainer = d3.select($parent.get(0));
    this.svg = this.mainContainer.append('svg');
    this.bchartInstance = this.parent.parent().attr('_bcharts_instance_');
    this.nodeTooltip = this.d3.tip().attr('class', 'd3-node-tooltip' + ' ' + this.bchartInstance).direction('se');
    // this.linkTooltip = this.d3.tip().attr('class', 'd3-link-tooltip' + ' ' + this.bchartInstance)
    // .offset(
    //     // [0, 0]
    //     function () {
    //         return [this.getBBox().height / 2, this.getBBox().width / 2]
    //     }
    // )
    //     .direction('se');
};

D3Wrap.prototype.destroy = function () {
    this.parent.remove();
    this.d3.select('.d3-node-tooltip' + '.' + this.bchartInstance).remove();
    // this.d3.select('.d3-link-tooltip' + '.' + this.bchartInstance).remove();
};
D3Wrap.prototype.clear = function () {
    this.svg.selectAll('*').empty();
};
D3Wrap.prototype.setOption = function (option) {
    console.log("SETOPTION");
};
D3Wrap.prototype.getOptions = function () {
    return this.options;
};
D3Wrap.prototype.resize = function () {
    this.svg.attr('width', '100%').attr('height', '100%').attr("viewBox", "0 0 " + this.getMainContainer().clientWidth + " " + this.getMainContainer().clientHeight);
};
D3Wrap.prototype.dispatchAction = function () {};
D3Wrap.prototype.dispose = function () {};
D3Wrap.prototype.brushSelected = function () {};
D3Wrap.prototype.getMainContainer = function () {
    return this.mainContainer.node();
};
D3Wrap.prototype.selectRange = function () {};
D3Wrap.prototype.on = function (eventKey, callBack) {
    this.svg.on(eventKey, callBack);
};
D3Wrap.prototype.off = function (eventKey) {
    this.svg.on(eventKey, null);
};

exports.default = D3Wrap;

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _chartOptionBuilder = __webpack_require__(34);

var _chartOptionBuilder2 = _interopRequireDefault(_chartOptionBuilder);

var _validationError = __webpack_require__(25);

var _validationError2 = _interopRequireDefault(_validationError);

var _d3PointExtractor = __webpack_require__(274);

var _d3PointExtractor2 = _interopRequireDefault(_d3PointExtractor);

var _d3AggregationExtractor = __webpack_require__(54);

var _d3AggregationExtractor2 = _interopRequireDefault(_d3AggregationExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function D3OptionBuilder() {
    _chartOptionBuilder2.default.call(this);
} /**
   * Created by sds on 2018-03-19.
   */
/**
 * BChart 의 옵션 포맷
 * var options = {
     *     chart: {
     *         type: 'scatter'
     *     },
     *     xAxis: [ {
     *         selected: [{name: 'SepalLength', aggregation: 'none'}]
     *     } ],
     *     yAxis: [ {
     *         selected: [{name: 'SepalWidth', aggregation: 'none'}]
     *     } ],
     *     colorBy: [ {
     *         selected: [{name: 'Species'}]
     *     } ],
     *     source: {
     *         dataType: 'local',
     *         localData: [ {
     *             dataType: 'rawData',
     *             columns: [],
     *             data: []
     *         } ]
     *     }
     * }
 * d3chart 의 옵션 포맷
 * var option = {
     *      legend: {},
     *      grid: {},
     *      xAxis: [],
     *      yAxis: [],
     *      series: [ {name: '', type: 'scatter', data: []} ]
     * }
 */

D3OptionBuilder.prototype = Object.create(_chartOptionBuilder2.default.prototype);
D3OptionBuilder.prototype.constructor = D3OptionBuilder;

D3OptionBuilder.prototype.buildOptions = function (options) {
    this.bOptions = options;
    this.d3Options = this._defaultOptions();
    this._buildSeries();
    this._buildTooltip();
    return this.d3Options;
};

D3OptionBuilder.prototype._defaultOptions = function () {
    var opt = {
        tooltip: {
            trigger: 'item',
            showDelay: 0
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    title: {
                        zoom: 'Area Zooming',
                        back: 'Restore Area Zooming'
                    }
                },
                restore: {
                    show: false
                },
                magicType: {
                    show: false
                },
                brush: {
                    show: false
                }
            }
        },
        legend: {},
        xAxis: [{
            type: 'value',
            scale: true,
            splitLine: { show: false },
            axisLine: { onZero: true }
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            splitLine: { show: false },
            axisLine: { onZero: true }
        }],
        brush: {
            xAxisIndex: 0,
            yAxisIndex: 0
        }
    };

    opt.visualMap = this.bOptions.visualMap;
    opt.color = this.bOptions.colorSet;
    opt.grid = this.bOptions.grid;
    $.extend(true, opt.tooltip, this.bOptions.tooltip);
    $.extend(true, opt.xAxis, this.bOptions.xAxis);
    $.extend(true, opt.yAxis, this.bOptions.yAxis);
    $.extend(true, opt.toolbox, this.bOptions.toolbox);
    return opt;
};

D3OptionBuilder.prototype._newSeriesExtractor = function () {
    var dataColumns = this.getSeriesDataColumns();
    var aggregation = dataColumns[1].aggregation;

    var columnIndexes = this.getSeriesDataColumnIndexes();

    if (aggregation === 'none') {
        return new _d3PointExtractor2.default(columnIndexes);
    } else {
        return new _d3AggregationExtractor2.default(columnIndexes);
    }
};

D3OptionBuilder.prototype._buildSeriesData = function () {
    var aggregation = this.getSeriesDataColumns()[1].aggregation;
    for (var s in this.d3Options.series) {
        this.d3Options.series[s].data = this.d3Options.series[s].extractor.extract(aggregation);
    }
};

D3OptionBuilder.prototype._buildMarkLine = function () {
    var _this = this;
    for (var s in _this.d3Options.series) {
        var markLine = _this.d3Options.series[s].markLine;
        if (markLine && markLine.data) {
            markLine.data = markLine.data.map(function (item) {
                if (item.type === 'trend-line') {
                    var xData = [];
                    var yData = [];
                    for (var r in _this.d3Options.series[s].data) {
                        xData.push(_this.d3Options.series[s].data[r].value[0]);
                        yData.push(_this.d3Options.series[s].data[r].value[1]);
                    }
                    var squares = _optionUtils2.default.leastSquares(xData, yData);
                    return [{
                        name: item.name,
                        coord: [squares[0], squares[1]]
                    }, {
                        coord: [squares[2], squares[3]]
                    }];
                } else {
                    return item;
                }
            });
        }
    }
};

D3OptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData();
    var keyIndexes = this.getSeriesKeyColumnIndexes();

    var i, row, seriesName, seriesItem;

    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes);
        seriesItem = this.getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = this._newSeriesExtractor();
            seriesItem.extractor.keys = this.getCellText(row, keyIndexes);
            seriesItem.keys = seriesItem.extractor.keys;
        }
        seriesItem.extractor.push(row, i);
    }

    this._setSeries(series);
    this._buildSeriesData();
    this._buildMarkLine();
};

D3OptionBuilder.prototype._setSeries = function (series) {
    this.d3Options.series = function () {
        var answer = [];
        for (var s in series) {
            answer.push(series[s]);
        }
        answer.sort(function (a, b) {
            if (a.name == b.name) return 0;else if (a.name > b.name) return 1;else return -1;
        });
        return answer;
    }();

    if (this.d3Options.series.length > 30) {
        throw new _validationError2.default('The number of series exceeded 30 pieces. Please change your settings.');
    }
};

D3OptionBuilder.prototype._buildTooltip = function () {
    if (this.d3Options.tooltip.trigger == 'item') {
        this._buildItemTooltip();
    } else if (this.d3Options.tooltip.trigger == 'axis') {
        this._buildAxisTooltip();
    }
};

D3OptionBuilder.prototype._getItemXTooltip = function (params, dataColumns) {
    if (this._internalOptions().xAxis[0].type === 'value') {
        if (this._internalOptions().xAxis[0].data) {
            return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + this._internalOptions().xAxis[0].data[params.value[0] - 1];
        } else {
            return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + params.value[0];
        }
    } else {
        return _optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + params.name;
    }
};

D3OptionBuilder.prototype._getItemYTooltip = function (params, dataColumns) {
    if (this._internalOptions().xAxis[0].type === 'value') {
        return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + params.value[1];
    } else {
        return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + params.value;
    }
};

D3OptionBuilder.prototype._buildItemTooltip = function () {
    var _this = this;
    var keyColumns = _this.getSeriesKeyColumns();
    var keyColumnIndexes = _this.getSeriesKeyColumnIndexes();
    var dataColumns = _this.getSeriesDataColumns();
    var dataColumnIndexes = _this.getSeriesDataColumnIndexes();
    _this.d3Options.tooltip.formatter = function (params, ticket, callback) {
        // var toolItems = [];
        //
        // if (params.seriesName) {
        //     var extractor = _this._internalOptions().series[params.seriesIndex].extractor;
        //     for (var k = 0; k < keyColumnIndexes.length; k++) {
        //         toolItems.push(keyColumns[k].name + ' : ' + extractor.keys[k]);
        //     }
        // }
        // if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
        //     toolItems.push(params.name + ' : ' + params.value);
        // } else {
        //     toolItems.push(_this._getItemXTooltip(params, dataColumns));
        //     toolItems.push(_this._getItemYTooltip(params, dataColumns));
        // }
        //
        // return function () {
        //     var result = [];
        //     for (var t in toolItems) {
        //         if (result.indexOf(toolItems[t]) === -1) {
        //             result.push(toolItems[t]);
        //         }
        //     }
        //     return result;
        // }().join('<br>');
    };
};

D3OptionBuilder.prototype._getAxisYTooltip = function (param, dataColumns) {
    return _optionUtils2.default.getColumnLabel(dataColumns[1]) + ' : ' + param.value;
};

D3OptionBuilder.prototype._buildAxisTooltip = function () {
    var _this = this;
    var keyColumns = this.getSeriesKeyColumns();
    var keyColumnIndexes = this.getSeriesKeyColumnIndexes();
    var dataColumns = this.getSeriesDataColumns();
    this.d3Options.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];
        if (Array.isArray(params)) {
            for (var p in params) {
                if (_this._internalOptions().series[params[p].seriesIndex].virtualSeries) continue;

                // X 컬럼
                if (_this._internalOptions().xAxis[0].type === 'value') {
                    if (typeof params[p].value === 'undefined') continue;
                    toolItems.push(_optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + params[p].value[0]);
                } else {
                    toolItems.push(_optionUtils2.default.getColumnLabel(dataColumns[0]) + ' : ' + params[p].name);
                }

                // Series
                var division = function division(text) {
                    return '<div title="' + text + '">' + text + '</div>';
                };
                if (params[p].seriesName) {
                    division = function division(text) {
                        return '<div title="' + text + '" style="color: ' + params[p].color + ';">' + text + '</div>';
                    };

                    if (_this._internalOptions().series[params[p].seriesIndex]) {
                        var extractor = _this._internalOptions().series[params[p].seriesIndex].extractor;
                        if (extractor) {
                            for (var k = 0; k < keyColumnIndexes.length; k++) {
                                toolItems.push(division(keyColumns[k].name + ' : ' + extractor.keys[k]));
                            }
                        }
                    } else {
                        toolItems.push(division(params[p].seriesName));
                    }
                }

                // Y 컬럼
                toolItems.push(division(_this._getAxisYTooltip(params[p], dataColumns)));
            }
        } else {
            if (params.componentType === 'markLine' || params.componentType === 'markPoint') {
                toolItems.push(params.name + ' : ' + params.value);
            }
        }

        return function () {
            var result = [];
            for (var t in toolItems) {
                if (result.indexOf(toolItems[t]) === -1) {
                    result.push(toolItems[t]);
                }
            }
            return result;
        }().join('');
    };
};

D3OptionBuilder.prototype._applySeriesOptions = function (seriesItem, plotOptions, attributes) {
    var tmp = {};
    for (var i in attributes) {
        var attr = attributes[i];
        if (typeof plotOptions[attr] !== 'undefined') {
            tmp[attr] = plotOptions[attr];
        }
    }
    $.extend(true, seriesItem, tmp);
};

exports.default = D3OptionBuilder;

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d3SeriesExtractor = __webpack_require__(160);

var _d3SeriesExtractor2 = _interopRequireDefault(_d3SeriesExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PointDataExtractor(columnIndexes) {
    _d3SeriesExtractor2.default.call(this, columnIndexes);
} /**
   * Created by sds on 2018-03-19.
   */
/**
 * X, Y 축의 값이 value 인 형태의 Series Data 를 생성
 * @param columnIndexes
 * @constructor
 */


PointDataExtractor.prototype = Object.create(_d3SeriesExtractor2.default.prototype);
PointDataExtractor.prototype.constructor = PointDataExtractor;

PointDataExtractor.prototype.push = function (row, rowIndex) {
    var pointData = {
        value: [],
        dataIndexes: [parseInt(rowIndex)] // point 에 해당하는 원본 데이터 인덱스
    };
    for (var d in this.columnIndexes) {
        pointData.value.push(row[this.columnIndexes[d]]);
    }
    this.points.push(pointData);
};

exports.default = PointDataExtractor;

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsDendrogramOptionBuilder = __webpack_require__(276);

var _echartsDendrogramOptionBuilder2 = _interopRequireDefault(_echartsDendrogramOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsDendrogram
 * @param parentId
 * @param options
 * @constructor
 */
function EChartsDendrogram(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsDendrogram.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsDendrogram.prototype.constructor = EChartsDendrogram;

EChartsDendrogram.prototype.render = function () {
    this.seriesHelper = new _echartsDendrogramOptionBuilder2.default();
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

exports.default = EChartsDendrogram;

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsDendrogramExtractor = __webpack_require__(277);

var _echartsDendrogramExtractor2 = _interopRequireDefault(_echartsDendrogramExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsDendrogramOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsDendrogramOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsDendrogramOptionBuilder.prototype.constructor = EChartsDendrogramOptionBuilder;

EChartsDendrogramOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeForDendrogram');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltipAxisPointerY');
    this._registerDecorator('tooltipDendrogram');
    this._registerDecorator('brushRemoval');
};

EChartsDendrogramOptionBuilder.prototype._buildSeriesData = function () {
    for (var s in this.series) {
        this.series[s].data = this.series[s].extractor.extract(this.series[s].parentNodeId);
    }
};

EChartsDendrogramOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var clusterNameIndex = this.getColumnIndexes(this.bOptions.plotOptions.dendrogram.clusterGroupColumn[0].selected, localData.columns);
    var clusterColumnIndexes = this.getColumnIndexes(this.bOptions.plotOptions.dendrogram.clusterColumn[0].selected, localData.columns);
    var heightIndex = this.getColumnIndexes(this.bOptions.plotOptions.dendrogram.heightColumn[0].selected, localData.columns);

    var extractor = new _echartsDendrogramExtractor2.default();

    extractor.setTarget({
        index: clusterNameIndex,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: clusterColumnIndexes,
        type: 'category',
        isKey: false
    });

    extractor.setTarget({
        index: heightIndex,
        type: 'value',
        isKey: false
    });

    return extractor;
};

EChartsDendrogramOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData(0);
    var keyIndexes = this.getColumnIndexes(this.bOptions.plotOptions.dendrogram.clusterGroupColumn[0].selected, localData.columns);

    var i, row, seriesName, seriesItem;

    var extractor = this._newSeriesExtractor();

    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes);
        seriesItem = this._getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
        series[seriesName].parentNodeId = seriesName;
        if (!series[seriesName].extractor) series[seriesName].extractor = extractor;
        seriesItem.extractor.push(row, i);
    }

    this.parentNodeMap = extractor.parentNodeMap;
    this.childNodeMap = extractor.childNodeMap;

    var rootNode = this._getRootNode();
    this.categoryList = this._createCategoryList(rootNode, []);
    var categoryIndexMap = {};
    $.map(this.categoryList, function (val, i) {
        categoryIndexMap[val] = i;
    });
    extractor.setCategoryIndexMap(categoryIndexMap);

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsDendrogramOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'line',
        data: [],
        showSymbol: false
    };

    return seriesItem;
};

EChartsDendrogramOptionBuilder.prototype._getRootNode = function () {
    var rootNode, nodeId;
    var countOfRootNode = 0;
    for (nodeId in this.parentNodeMap) {
        if (!this.childNodeMap[nodeId]) {
            rootNode = nodeId;
            countOfRootNode++;
        }
    }

    if (countOfRootNode > 1) {
        this._throwValidation('This Data has more than 2 Root Cluster Group.');
    }

    if (typeof rootNode === 'undefined') {
        this._throwValidation('This data has no Root Cluster Group.');
    }

    return rootNode;
};

EChartsDendrogramOptionBuilder.prototype._createCategoryList = function (key, categoryList) {
    var parentNodeMap = this.parentNodeMap;
    var childNodeId;

    for (var i in parentNodeMap[key]) {
        childNodeId = parentNodeMap[key][i];
        if (parentNodeMap[childNodeId]) {
            categoryList = this._createCategoryList(childNodeId, categoryList);
        } else {
            categoryList.push(childNodeId);
        }
    }
    return categoryList;
};

exports.default = EChartsDendrogramOptionBuilder;

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DendrogramExtractor() {
    _echartsPointExtractor2.default.call(this);
    this._keyPointMap = {};
    this.parentNodeMap = {};
    this.childNodeMap = {};
    this.heightMap = {};
    this.pointMap = {};
}

DendrogramExtractor.prototype = Object.create(_echartsPointExtractor2.default.prototype);
DendrogramExtractor.prototype.constructor = DendrogramExtractor;

DendrogramExtractor.prototype.push = function (row, rowIndex) {
    var pointer = this._getKeyPointer(row, rowIndex);
    this.parentNodeMap[pointer.value] = [];
    var index = Number(rowIndex);
    var value;
    var indexes;

    for (var i = 0; i < this._columnIndices.length; i++) {
        indexes = this._columnIndices[i];
        for (var j = 0; j < indexes.length; j++) {
            value = this._getPointValue(row, indexes[j], index);

            if (i > 0 && i < this._columnIndices.length - 1) {
                this.parentNodeMap[pointer.value].push(value);
                this.childNodeMap[value] = pointer.value;
            }
        }
        if (i == this._columnIndices.length - 1) {
            this.heightMap[pointer.value] = row[indexes[0]];
        }
    }
};

DendrogramExtractor.prototype.extract = function (nodeId) {
    var answer = [];
    var pointObject = this._getPointObject(nodeId);
    answer.push([pointObject.x1, pointObject.y1]);
    answer.push([pointObject.x1, pointObject.height]);
    answer.push([pointObject.x2, pointObject.height]);
    answer.push([pointObject.x2, pointObject.y2]);

    return answer;
};

DendrogramExtractor.prototype._getPointObject = function (nodeId) {
    var childPointObj, pointObj;

    var parentNodeMap = this.parentNodeMap;
    var pointMap = this.pointMap;
    var heightMap = this.heightMap;
    var categoryIndexMap = this.categoryIndexMap;

    for (var i in parentNodeMap[nodeId]) {
        var childNodeId = parentNodeMap[nodeId][i];
        if (parentNodeMap[childNodeId]) {
            // isCluster

            if (!pointMap[childNodeId]) {
                // child pointMap does not exist
                pointMap[childNodeId] = this._getPointObject(childNodeId);
            }
            childPointObj = pointMap[childNodeId];
            pointObj = pointMap[nodeId] = pointMap[nodeId] || {};
            if (i == 0) {
                pointObj.x1 = (childPointObj.x1 + childPointObj.x2) / 2;
                pointObj.y1 = childPointObj.height;
                pointObj.height = heightMap[nodeId];
            } else {
                pointObj.x2 = (childPointObj.x1 + childPointObj.x2) / 2;
                pointObj.y2 = childPointObj.height;
                pointObj.height = heightMap[nodeId];
            }
        } else if (!parentNodeMap[childNodeId]) {
            // isColumn
            pointObj = pointMap[nodeId] = pointMap[nodeId] || {};
            if (i == 0) {
                pointObj.x1 = categoryIndexMap[childNodeId];
                pointObj.y1 = 0;
                pointObj.height = heightMap[nodeId];
            } else {
                pointObj.x2 = categoryIndexMap[childNodeId];
                pointObj.y2 = 0;
                pointObj.height = heightMap[nodeId];
            }
        }
    }
    return pointObj;
};

DendrogramExtractor.prototype.setCategoryIndexMap = function (categoryIndexMap) {
    this.categoryIndexMap = categoryIndexMap;
};

exports.default = DendrogramExtractor;

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsHeatmapOptionBuilder = __webpack_require__(279);

var _echartsHeatmapOptionBuilder2 = _interopRequireDefault(_echartsHeatmapOptionBuilder);

var _echartsHeatmapCalculatedOptionBuilder = __webpack_require__(280);

var _echartsHeatmapCalculatedOptionBuilder2 = _interopRequireDefault(_echartsHeatmapCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsHeatmap
 * @param parentId
 * @param options
 * @constructor
 */
function EChartsHeatmap(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Source: echarts-heatmap.js
   * Created by daewon.park on 2017-04-16.
   */

EChartsHeatmap.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsHeatmap.prototype.constructor = EChartsHeatmap;

EChartsHeatmap.prototype.render = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        this.seriesHelper = new _echartsHeatmapCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsHeatmapOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

exports.default = EChartsHeatmap;

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsHeatmapOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsHeatmapOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsHeatmapOptionBuilder.prototype.constructor = EChartsHeatmapOptionBuilder;

EChartsHeatmapOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('brushRemoval');
    this._registerDecorator('tooltipHeatmap');
    this._registerDecorator('axisType', {
        setAxisByColumn: false
    });
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('visualMap');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesDataColumns(this.plotOptions.valueBy[0].selected);
};

EChartsHeatmapOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var dataColumns = this.getSeriesDataColumns(0);
    var aggregation = dataColumns[2].aggregation;
    var xIndexes = this.getColumnIndexes(this.bOptions.xAxis[0].selected, localData.columns);
    var yIndexes = this.getColumnIndexes(this.bOptions.yAxis[0].selected, localData.columns);
    var valueByIndexes = this.getColumnIndexes(this.plotOptions.valueBy[0].selected, localData.columns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();
    extractor._min = null;
    extractor._max = null;

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'category',
        isKey: true
    });
    extractor.setTarget({
        index: valueByIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var operator = new _aggregationOperator2.default(pointObject.value);
        for (var i = 0; i < pointObject.indexList.length; i++) {
            operator.add(pointObject.indexList[i], pointObject.point[i][2]);
        }

        var val = operator.calc(aggregation);

        extractor._min = extractor._min == null ? val : Math.min(extractor._min, val);
        extractor._max = extractor._max == null ? val : Math.max(extractor._max, val);

        return [{ value: pointObject.value.concat(val) }];
    });
    return extractor;
};

EChartsHeatmapOptionBuilder.prototype._buildSeries = function () {
    _echartsAxisTypeOptionBuilder2.default.prototype._buildSeries.call(this);
    for (var s in this.eOptions.series) {
        this.eOptions.visualMap.min = Math.floor(this.eOptions.series[s].extractor._min);
        this.eOptions.visualMap.max = Math.ceil(this.eOptions.series[s].extractor._max);
    }
};

EChartsHeatmapOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsAxisTypeOptionBuilder2.default.prototype._defaultOptions.call(this);
    opt.xAxis[0].type = 'category';
    opt.xAxis[0].data = [];
    opt.yAxis[0].type = 'category';
    opt.yAxis[0].data = [];
    opt.dataZoom = this.bOptions.dataZoom;
    opt.visualMap = {};
    return opt;
};

EChartsHeatmapOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);

    var heatmapOptions = this.bOptions.plotOptions.heatmap;
    var attributes = [];
    this._applySeriesOptions(seriesItem, heatmapOptions, attributes);

    return seriesItem;
};

exports.default = EChartsHeatmapOptionBuilder;

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeCalculatedOptionBuilder = __webpack_require__(21);

var _echartsAxisTypeCalculatedOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeCalculatedOptionBuilder);

var _echartsPointWithCategorykeyExtractor = __webpack_require__(19);

var _echartsPointWithCategorykeyExtractor2 = _interopRequireDefault(_echartsPointWithCategorykeyExtractor);

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsHeatmapMatrixCalculatedOptionBuilder = __webpack_require__(162);

var _echartsHeatmapMatrixCalculatedOptionBuilder2 = _interopRequireDefault(_echartsHeatmapMatrixCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsHeatmapCalculatedOptionBuilder() {
    _echartsAxisTypeCalculatedOptionBuilder2.default.call(this);
}

EChartsHeatmapCalculatedOptionBuilder.prototype = Object.create(_echartsAxisTypeCalculatedOptionBuilder2.default.prototype);
EChartsHeatmapCalculatedOptionBuilder.prototype.constructor = EChartsHeatmapCalculatedOptionBuilder;

EChartsHeatmapCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('brushRemoval');
    this._registerDecorator('tooltipHeatmap');
    this._registerDecorator('axisType', { setAxisByColumn: false });
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('visualMap');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesDataColumns(this.plotOptions.valueBy[0].selected);
};

EChartsHeatmapCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var xIndexes = this.getColumnIndexes([{ name: 'xAxis' }], localData.chartColumns);
    var yIndexes = this.getColumnIndexes([{ name: 'yAxis' }], localData.chartColumns);
    var valueByIndexes = this.getColumnIndexes([{ name: 'valueBy' }], localData.chartColumns);

    var extractor = new _echartsPointWithCategorykeyExtractor2.default();
    extractor._min = null;
    extractor._max = null;

    extractor.setTarget({
        index: xIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: yIndexes,
        type: 'category',
        isKey: true
    });
    extractor.setTarget({
        index: valueByIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var val = pointObject.point[0][2];

        extractor._min = extractor._min == null ? val : Math.min(extractor._min, val);
        extractor._max = extractor._max == null ? val : Math.max(extractor._max, val);

        return [{ value: pointObject.value.concat(val) }];
    });
    return extractor;
};

EChartsHeatmapCalculatedOptionBuilder.prototype._buildSeries = function () {
    _echartsAxisTypeOptionBuilder2.default.prototype._buildSeries.call(this);
    for (var s in this.eOptions.series) {
        this.eOptions.visualMap.min = Math.floor(this.eOptions.series[s].extractor._min);
        this.eOptions.visualMap.max = Math.ceil(this.eOptions.series[s].extractor._max);
    }
};

EChartsHeatmapCalculatedOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsAxisTypeOptionBuilder2.default.prototype._defaultOptions.call(this);
    opt.xAxis[0].type = 'category';
    opt.xAxis[0].data = [];
    opt.yAxis[0].type = 'category';
    opt.yAxis[0].data = [];
    opt.dataZoom = this.bOptions.dataZoom;
    opt.visualMap = {};
    return opt;
};

EChartsHeatmapCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);

    var heatmapOptions = this.bOptions.plotOptions.heatmap;
    var attributes = [];
    this._applySeriesOptions(seriesItem, heatmapOptions, attributes);

    return seriesItem;
};

EChartsHeatmapCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    return [];
};

exports.default = EChartsHeatmapCalculatedOptionBuilder;

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HeatmapMatrixCalculatedDataExtractor(columnIndexes, yAxisIndex, dataLength) {
    _echartsPointExtractor2.default.call(this);
    this.columnIndexes = columnIndexes;
    this.yAxisIndex = yAxisIndex;
    this._dataLength = dataLength;
    this._data = [];
    this._xCategories = [];
    this._yCategories = [];
    this._yCategoriesIndex = {};
    this.operators = {};
    this.min = null;
    this.max = null;
}

HeatmapMatrixCalculatedDataExtractor.prototype = Object.create(_echartsPointExtractor2.default.prototype);
HeatmapMatrixCalculatedDataExtractor.prototype.constructor = HeatmapMatrixCalculatedDataExtractor;

HeatmapMatrixCalculatedDataExtractor.prototype.push = function (row, rowIndex) {
    rowIndex = Number(rowIndex);

    this._data.push([row[0], row[1], row[2]]);
    this.min = this.min == null ? row[2] : Math.min(this.min, row[2]);
    this.max = this.max == null ? row[2] : Math.max(this.max, row[2]);

    if (!this._yCategoriesIndex[row[1]]) {
        this._yCategoriesIndex[row[1]] = true;
        this._yCategories.push(row[3]);
    }
};

HeatmapMatrixCalculatedDataExtractor.prototype.yCategories = function () {
    return this._yCategories;
};

HeatmapMatrixCalculatedDataExtractor.prototype.extract = function () {
    return this._data;
};

exports.default = HeatmapMatrixCalculatedDataExtractor;

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsHeatmapMatrixOptionBuilder = __webpack_require__(283);

var _echartsHeatmapMatrixOptionBuilder2 = _interopRequireDefault(_echartsHeatmapMatrixOptionBuilder);

var _echartsHeatmapMatrixCalculatedOptionBuilder = __webpack_require__(162);

var _echartsHeatmapMatrixCalculatedOptionBuilder2 = _interopRequireDefault(_echartsHeatmapMatrixCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsHeatmapMatrix
 * @param parentId
 * @param options
 * @constructor
 */
function EChartsHeatmapMatrix(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsHeatmapMatrix.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsHeatmapMatrix.prototype.constructor = EChartsHeatmapMatrix;

EChartsHeatmapMatrix.prototype.render = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        this.seriesHelper = new _echartsHeatmapMatrixCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsHeatmapMatrixOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

exports.default = EChartsHeatmapMatrix;

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsHeatmapMatrixExtoractor = __webpack_require__(284);

var _echartsHeatmapMatrixExtoractor2 = _interopRequireDefault(_echartsHeatmapMatrixExtoractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsHeatmapMatrixOptionBuilder() {
    _echartsAxisTypeOptionBuilder2.default.call(this);
}

EChartsHeatmapMatrixOptionBuilder.prototype = Object.create(_echartsAxisTypeOptionBuilder2.default.prototype);
EChartsHeatmapMatrixOptionBuilder.prototype.constructor = EChartsHeatmapMatrixOptionBuilder;

EChartsHeatmapMatrixOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('brushRemoval');
    this._registerDecorator('tooltipHeatmapMatrix');
    this._registerDecorator('visualMap');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsHeatmapMatrixOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsOptionBuilder2.default.prototype._defaultOptions.call(this);
    opt.xAxis[0].type = 'category';
    opt.xAxis[0].data = [];
    opt.yAxis[0].type = 'category';
    opt.yAxis[0].data = [];
    opt.dataZoom = this.bOptions.dataZoom;
    opt.visualMap = {};
    return opt;
};

EChartsHeatmapMatrixOptionBuilder.prototype.getSeriesDataColumns = function () {
    return this.bOptions.xAxis[0].selected;
};

EChartsHeatmapMatrixOptionBuilder.prototype._newSeriesExtractor = function (dataLength) {
    var allColumns = this.getAllColumns();
    var yAxisIndex = this.getColumnIndexes(this.bOptions.yAxis[0].selected, allColumns);
    var columnIndexes = this.getSeriesDataColumnIndexes();
    return new _echartsHeatmapMatrixExtoractor2.default(columnIndexes, yAxisIndex, dataLength);
};

EChartsHeatmapMatrixOptionBuilder.prototype._getCategories = function (axis) {
    var categories = [];
    for (var i in axis) {
        if (axis[i] && axis[i].name) {
            categories.push(axis[i].name);
        }
    }
    return categories;
};

EChartsHeatmapMatrixOptionBuilder.prototype._buildSeriesData = function () {
    for (var s in this.series) {
        this.series[s].type = 'heatmap';
        this.series[s].data = this.series[s].extractor.extract();
        this.eOptions.xAxis[0].data = this._getCategories(this.bOptions.xAxis[0].selected);
        this.eOptions.yAxis[0].data = this.series[s].extractor.yCategories();
        this.eOptions.visualMap.min = Math.floor(this.series[s].extractor.min);
        this.eOptions.visualMap.max = Math.ceil(this.series[s].extractor.max);
    }
};

EChartsHeatmapMatrixOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);

    var heatmapOptions = this.bOptions.plotOptions.heatmap;
    var attributes = [];
    this._applySeriesOptions(seriesItem, heatmapOptions, attributes);

    return seriesItem;
};

EChartsHeatmapMatrixOptionBuilder.prototype._buildTooltip = function () {
    var _this = this;
    var xAxisCategories = this._getCategories(this.bOptions.xAxis[0].selected);
    var yAxisCategories = this.eOptions.series[0].extractor.yCategories();
    _this.eOptions.tooltip.formatter = function (params, ticket, callback) {
        if (params.seriesType === 'heatmap') {
            return ['X-Axis : ' + xAxisCategories[params.data[0]], 'Y-Axis : ' + yAxisCategories[params.data[1]], 'Value: ' + params.data[2]].join('<br/>');
        }
    };
};

EChartsHeatmapMatrixOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData();
    var keyIndexes = this.getSeriesKeyColumnIndexes();

    var i, row, seriesName, seriesItem;
    for (i = localData.data.length - 1; i >= 0; i--) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes);
        seriesItem = this._getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = this._newSeriesExtractor(localData.data.length);
            seriesItem.extractor.keys = this.getCellText(row, keyIndexes);
            seriesItem.keys = seriesItem.extractor.keys;
        }
        seriesItem.extractor.push(row, i);
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

exports.default = EChartsHeatmapMatrixOptionBuilder;

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HeatmapMatrixDataExtractor(columnIndexes, yAxisIndex, dataLength) {
    _echartsPointExtractor2.default.call(this);
    this.columnIndexes = columnIndexes;
    this.yAxisIndex = yAxisIndex;
    this._dataLength = dataLength;
    this._data = [];
    this._xCategories = [];
    this._yCategories = [];
    this.operators = {};
    this.min = null;
    this.max = null;
}

HeatmapMatrixDataExtractor.prototype = Object.create(_echartsPointExtractor2.default.prototype);
HeatmapMatrixDataExtractor.prototype.constructor = HeatmapMatrixDataExtractor;

HeatmapMatrixDataExtractor.prototype.push = function (row, rowIndex) {
    rowIndex = Number(rowIndex);
    var xIndex = 0;
    for (var i = 0; i < this.columnIndexes.length; i++) {
        if (this.columnIndexes[i] < 0) continue;
        var currentVal = row[this.columnIndexes[i]];
        if (typeof currentVal === 'number') {
            this._data.push([xIndex, this._dataLength - rowIndex - 1, currentVal]);
            xIndex++;
            this.min = this.min == null ? currentVal : Math.min(this.min, currentVal);
            this.max = this.max == null ? currentVal : Math.max(this.max, currentVal);
        } else {
            this._data.push([xIndex, rowIndex, NaN]);
        }
    }

    if (this.yAxisIndex && this.yAxisIndex.length > 0 && this.yAxisIndex[0] !== -1) {
        this._yCategories.push(row[this.yAxisIndex]);
    } else {
        this._yCategories.push(rowIndex + 1);
    }
};

HeatmapMatrixDataExtractor.prototype.yCategories = function () {
    return this._yCategories;
};

HeatmapMatrixDataExtractor.prototype.extract = function () {
    return this._data;
};

exports.default = HeatmapMatrixDataExtractor;

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsColumn = __webpack_require__(37);

var _echartsColumn2 = _interopRequireDefault(_echartsColumn);

var _echartsHistogramOptionBuilder = __webpack_require__(163);

var _echartsHistogramOptionBuilder2 = _interopRequireDefault(_echartsHistogramOptionBuilder);

var _echartsHistogramCalculatedOptionBuilder = __webpack_require__(286);

var _echartsHistogramCalculatedOptionBuilder2 = _interopRequireDefault(_echartsHistogramCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsHistogram(parentId, options) {
    _echartsColumn2.default.call(this, parentId, options);
} /**
   * Source: echarts-histogram.js
   * Created by daewon.park on 2017-07-26.
   */


EChartsHistogram.prototype = Object.create(_echartsColumn2.default.prototype);
EChartsHistogram.prototype.constructor = EChartsHistogram;

EChartsHistogram.prototype.render = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        this.seriesHelper = new _echartsHistogramCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsHistogramOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

exports.default = EChartsHistogram;

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsHistogramOptionBuilder = __webpack_require__(163);

var _echartsHistogramOptionBuilder2 = _interopRequireDefault(_echartsHistogramOptionBuilder);

var _echartsHistogramExtractor = __webpack_require__(164);

var _echartsHistogramExtractor2 = _interopRequireDefault(_echartsHistogramExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsHistogramCalculatedOptionBuilder() {
    _echartsHistogramOptionBuilder2.default.call(this);
}

EChartsHistogramCalculatedOptionBuilder.prototype = Object.create(_echartsHistogramOptionBuilder2.default.prototype);
EChartsHistogramCalculatedOptionBuilder.prototype.constructor = EChartsHistogramCalculatedOptionBuilder;

EChartsHistogramCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var extractor = new _echartsHistogramExtractor2.default();

    var localData = this.getLocalData();
    var bins = [];
    for (var d in localData.data) {
        var data = localData.data[d];
        var bin = {
            x0: data[0],
            x1: data[1]
        };
        bins.push(bin);
    }
    extractor.setBins(bins);

    return extractor;
};

EChartsHistogramCalculatedOptionBuilder.prototype._buildSeriesData = function () {
    var data = this.getLocalData().data;
    this.series[0].data = data;
};

exports.default = EChartsHistogramCalculatedOptionBuilder;

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _echartsNetworkOptionBuilder = __webpack_require__(288);

var _echartsNetworkOptionBuilder2 = _interopRequireDefault(_echartsNetworkOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsNetwork(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Source: echarts-network.js
   * Created by daewon.park on 2017-03-30.
   */

EChartsNetwork.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsNetwork.prototype.constructor = EChartsNetwork;

EChartsNetwork.prototype._init = function () {
    _echartsWrapper2.default.prototype._init.call(this);
    this.seriesHelper = new _echartsNetworkOptionBuilder2.default();
};

EChartsNetwork.prototype._getSizeByLabel = function () {
    var sizeByLabel = 'Count';
    var dataColumns = this.seriesHelper.getNodeSizeByColumn();
    if (dataColumns.length > 0) {
        sizeByLabel = _optionUtils2.default.getColumnLabel(dataColumns[0]);
    }
    return sizeByLabel;
};

EChartsNetwork.prototype.render = function () {
    var opt = this.seriesHelper.buildOptions(this.options);

    this.setChartStyle();

    var sizeByLabel = this._getSizeByLabel();
    opt.tooltip.formatter = function (params, ticket, callback) {
        var toolItems = [];
        toolItems.push(params.name);
        if (typeof params.value !== 'undefined') {
            toolItems.push(''.concat(sizeByLabel, ' : ', params.value));
        }
        return toolItems.join('<br>');
    };
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsNetwork.prototype.setChartStyle = function () {
    var networkOpt = this.options.plotOptions.network;
    if (networkOpt.style) {
        this.seriesHelper.setChartStyle(networkOpt);
    }
};

EChartsNetwork.prototype.getLegendData = function () {
    var legendData = [];
    return legendData;
};

exports.default = EChartsNetwork;

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsNetworkExtractor = __webpack_require__(289);

var _echartsNetworkExtractor2 = _interopRequireDefault(_echartsNetworkExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsNetworkOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsNetworkOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsNetworkOptionBuilder.prototype.constructor = EChartsNetworkOptionBuilder;

EChartsNetworkOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('brushRemoval');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns([]);
};

EChartsNetworkOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.bOptions.source.localData[0];

    var colorByColumns = this.getColorByColumns();
    var colorByIndexes = this.getColumnIndexes(colorByColumns, localData.columns);

    var nodeSizeByColumn = this.getNodeSizeByColumn();
    var nodeSizeByIndex = this.getColumnIndexes(nodeSizeByColumn, localData.columns);

    var fromColumn = this.getFromColumn();
    var fromColumnIndex = this.getColumnIndexes(fromColumn, localData.columns);

    var toColumn = this.getToColumn();
    var toColumnIndex = this.getColumnIndexes(toColumn, localData.columns);

    return new _echartsNetworkExtractor2.default(fromColumnIndex, toColumnIndex, nodeSizeByIndex, colorByIndexes);
};

EChartsNetworkOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData(0);
    var keyIndexes = this.getSeriesKeyColumnIndexes(0);

    var i, row, seriesName, seriesItem;
    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes);
        seriesItem = this._getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = this._newSeriesExtractor();
        }
        seriesItem.extractor.push(row, i);
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsNetworkOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsOptionBuilder2.default.prototype._defaultOptions.call(this);
    delete opt.xAxis;
    delete opt.yAxis;
    delete opt.brush;
    return opt;
};

EChartsNetworkOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'graph',
        large: true,
        largeThreshold: 5000,
        label: this.bOptions.plotOptions.network.label,
        data: [],
        force: {
            repulsion: 100
        },
        layout: 'force',
        roam: true,
        edgeSymbol: this.bOptions.plotOptions.network.style.edge.symbol,
        edgeSymbolSize: this.bOptions.plotOptions.network.style.edge.size
    };
    var networkOptions = this.bOptions.plotOptions.network;
    var attributes = ['label'];
    this._applySeriesOptions(seriesItem, networkOptions, attributes);

    return seriesItem;
};

EChartsNetworkOptionBuilder.prototype.getNodeSizeByColumn = function () {
    return this.bOptions.plotOptions.network.nodeSizeBy[0].selected;
};

EChartsNetworkOptionBuilder.prototype.getFromColumn = function () {
    return this.bOptions.plotOptions.network.fromColumn[0].selected;
};

EChartsNetworkOptionBuilder.prototype.getToColumn = function () {
    return this.bOptions.plotOptions.network.toColumn[0].selected;
};

EChartsNetworkOptionBuilder.prototype.setChartStyle = function (networkOption) {
    var styleOption = networkOption.style;
    //TODO: there is no input for min, max
    var maxNodeSize = styleOption.node.size.max || 30;
    var minNodeSize = styleOption.node.size.min || 10;
    var data, links;
    var dataValueList = [];
    for (var s in this.series) {
        this.series[s].data.map(function (dataObj) {
            if (dataObj.value) {
                dataValueList.push(dataObj.value);
            }
        });
    }
    var maxValue = Math.max.apply(null, dataValueList);
    var minValue = Math.min.apply(null, dataValueList);

    var x = (maxNodeSize - minNodeSize) / (maxValue - minValue);
    var y = minNodeSize - x * minValue;

    for (var s in this.series) {
        data = this.series[s].data;
        for (var dataIdx = 0; dataIdx < data.length; dataIdx++) {
            data[dataIdx].itemStyle = {
                normal: {
                    color: styleOption.node.color
                }
            };
            if (typeof data[dataIdx].value === 'undefined') {
                data[dataIdx].symbolSize = styleOption.node.size + 10;
            } else {
                data[dataIdx].symbolSize = data[dataIdx].value * x + y;
            }
        }
        0;
        links = this.series[s].links;
        for (var linkIdx = 0; linkIdx < links.length; linkIdx++) {
            links[linkIdx].lineStyle = {
                normal: styleOption.link
            };
        }
    }
};

EChartsNetworkOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.bOptions.source.localData[0];

    var colorByColumns = this.getColorByColumns();
    var colorByIndexes = this.getColumnIndexes(colorByColumns, localData.columns);

    var nodeSizeByColumn = this.getNodeSizeByColumn();
    var nodeSizeByIndex = this.getColumnIndexes(nodeSizeByColumn, localData.columns);

    var fromColumn = this.getFromColumn();
    var fromColumnIndex = this.getColumnIndexes(fromColumn, localData.columns);

    var toColumn = this.getToColumn();
    var toColumnIndex = this.getColumnIndexes(toColumn, localData.columns);

    return new _echartsNetworkExtractor2.default(fromColumnIndex, toColumnIndex, nodeSizeByIndex, colorByIndexes);
};

EChartsNetworkOptionBuilder.prototype._buildSeriesData = function () {
    var sizeByColumns = this.getNodeSizeByColumn();
    var aggregation;
    if (sizeByColumns.length > 0 && sizeByColumns[0]) {
        aggregation = sizeByColumns[0].aggregation;
    }
    for (var s in this.series) {

        this.series[s].categories = this.series[s].extractor.categoryExtract(aggregation);
        this.series[s].data = this.series[s].extractor.nodeExtract(aggregation);
        this.series[s].links = this.series[s].extractor.linkExtract(aggregation);
    }
};

exports.default = EChartsNetworkOptionBuilder;

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsExtractor = __webpack_require__(29);

var _echartsExtractor2 = _interopRequireDefault(_echartsExtractor);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NetworkDataExtractor(fromColumnIndex, toColumnIndex, nodeSizeByIndex, colorByIndex) {
    _echartsExtractor2.default.call(this, []);
    this.fromColumnIndex = fromColumnIndex;
    this.toColumnIndex = toColumnIndex;
    this.nodeSizeByIndex = nodeSizeByIndex;
    this.colorByIndex = colorByIndex;
    this._nodeOperators = {};
    this._targetNodeOperators = {};
    this._linkOperators = {};
    this._nodes = {};
    this._targetNodes = {};
    this._links = {};
    this._categoryMap = {};
}

NetworkDataExtractor.prototype = Object.create(_echartsExtractor2.default.prototype);
NetworkDataExtractor.prototype.constructor = NetworkDataExtractor;

NetworkDataExtractor.prototype._pushNodes = function (row, rowIndex) {
    this._nodes[row[this.fromColumnIndex]] = this._nodes[row[this.fromColumnIndex]] || {};
    var node = this._nodes[row[this.fromColumnIndex]];
    node.name = node.name || row[this.fromColumnIndex];

    var nodeOperator = this._nodeOperators[node.name];
    if (!nodeOperator) {
        nodeOperator = new _aggregationOperator2.default(node.name);
        this._nodeOperators[node.name] = nodeOperator;
    }

    if (this.nodeSizeByIndex.length === 0) {
        nodeOperator.add(rowIndex, 1);
    } else {
        var value = row[this.nodeSizeByIndex[0]];
        nodeOperator.add(rowIndex, value);
    }
};

NetworkDataExtractor.prototype._pushTargetNodes = function (row, rowIndex) {
    this._targetNodes[row[this.toColumnIndex]] = this._targetNodes[row[this.toColumnIndex]] || {};
    var targetNode = this._targetNodes[row[this.toColumnIndex]];
    targetNode.name = targetNode.name || row[this.toColumnIndex];

    var targetNodeOperator = this._targetNodeOperators[targetNode.name];
    if (!targetNodeOperator) {
        targetNodeOperator = new _aggregationOperator2.default(targetNode.name);
        this._targetNodeOperators[targetNode.name] = targetNodeOperator;
    }

    targetNodeOperator.add(rowIndex, 1);
    targetNodeOperator.fromNode = row[this.fromColumnIndex];
};

NetworkDataExtractor.prototype._pushLinks = function (row, rowIndex) {
    var linkName = row[this.fromColumnIndex] + ' > ' + row[this.toColumnIndex];
    this._links[linkName] = this._links[linkName] || {};
    var link = this._links[linkName];
    link.name = link.name || linkName;

    var linkOperator = this._linkOperators[link.name];
    if (!linkOperator) {
        linkOperator = new _aggregationOperator2.default(link.name);
        this._linkOperators[link.name] = linkOperator;
    }
    linkOperator.source = row[this.fromColumnIndex] + '';
    linkOperator.target = row[this.toColumnIndex] + '';
};

NetworkDataExtractor.prototype._createCategoryMap = function (row, rowIndex) {
    var nodeName = row[this.fromColumnIndex];
    this._categoryMap[nodeName] = this._categoryMap[nodeName] || {};
    var categoryMap = this._categoryMap[nodeName];
    categoryMap[row[this.colorByIndex]] = categoryMap[row[this.colorByIndex]] || 1;
};

NetworkDataExtractor.prototype.push = function (row, rowIndex) {

    this._pushNodes(row, rowIndex);
    this._pushTargetNodes(row, rowIndex);
    this._pushLinks(row, rowIndex);
    this._createCategoryMap(row, rowIndex);
};

NetworkDataExtractor.prototype.nodeExtract = function (operator) {
    var answer = [];
    for (var name in this._nodeOperators) {
        var pointData = {
            id: name,
            name: name,
            draggable: true,
            dataIndexes: this._nodeOperators[name].dataIndexes
            // category: this._categoryMap[name].index
        };

        if (operator) {
            pointData.value = this._nodeOperators[name].calc(operator);
        }

        answer.push(pointData);
    }
    for (var targetName in this._targetNodeOperators) {
        if (!this._nodeOperators[targetName]) {
            var targetPointData = {
                id: targetName,
                name: targetName,
                draggable: true,
                dataIndexes: this._targetNodeOperators[targetName].dataIndexes
                // category: this._categoryList[this._categoryList.length]
            };
            answer.push(targetPointData);
        }
    }
    return answer;
};

NetworkDataExtractor.prototype.linkExtract = function (operator) {
    var answer = [];
    for (var name in this._linkOperators) {
        var pointData = {
            id: name,
            name: name,
            source: this._linkOperators[name].source,
            target: this._linkOperators[name].target,
            dataIndexes: this._linkOperators[name].dataIndexes // point 에 해당하는 원본 데이터 인덱스
        };
        answer.push(pointData);
    }
    return answer;
};

NetworkDataExtractor.prototype.categoryExtract = function () {

    this._categoryList = [];
    if (this.colorByIndex.length === 0) {
        this._categoryMap = {};
        return [];
    } else {
        for (var key in this._categoryMap) {
            var categoryKeyList = Object.keys(this._categoryMap[key]);
            if (categoryKeyList.length > 1) {
                delete this._categoryMap[key];
            }
        }
        this._categoryList = Object.keys(this._categoryMap).sort();

        for (var key in this._categoryMap) {
            this._categoryMap[key].index = this._categoryList.indexOf(key);
        }
        this._categoryList.push('ETC');

        return this._categoryList;
    }
};

exports.default = NetworkDataExtractor;

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsPairwiseScatterOptionBuilder = __webpack_require__(291);

var _echartsPairwiseScatterOptionBuilder2 = _interopRequireDefault(_echartsPairwiseScatterOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsPairwiseScatter
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Source: echarts-scatter.js
 * Created by daewon.park on 2017-03-23.
 */

function EChartsPairwiseScatter(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsPairwiseScatter.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsPairwiseScatter.prototype.constructor = EChartsPairwiseScatter;

EChartsPairwiseScatter.prototype.render = function () {

    this.seriesHelper = this.getSeriesHelper();

    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

EChartsPairwiseScatter.prototype.getSeriesHelper = function () {
    return new _echartsPairwiseScatterOptionBuilder2.default();
};

EChartsPairwiseScatter.prototype.getLegendData = function () {
    var legendData = [],
        legendMap = {};

    if (this._getEChartOption().legend && this._getEChartOption().legend[0]) {
        var legendSelection = this._getEChartOption().legend[0].selected;
        var hasLegend = this.seriesHelper.hasLegendData();

        if (hasLegend) {
            var opt = this.seriesHelper._internalOptions();
            for (var i in opt.series) {
                if (opt.series[i].virtualSeries) {
                    // true 일 경우만 skip
                } else {
                    var item = {
                        name: opt.series[i].name,
                        symbol: opt.series[i].symbol || 'circle',
                        symbolSize: opt.series[i].symbolSize || 10
                        // color: opt.color[parseFloat(i) % opt.color.length]
                    };
                    if (typeof legendSelection[item.name] === 'undefined') {
                        item.selected = true;
                    } else {
                        item.selected = legendSelection[item.name];
                    }

                    if (typeof legendMap[item.name] === 'undefined') {
                        legendMap[item.name] = true;
                        item.color = opt.color[legendData.length % opt.color.length];
                        legendData.push(item);
                    }
                }
            }
        }
    }
    return legendData;
};

exports.default = EChartsPairwiseScatter;

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _super = _echartsOptionBuilder2.default.prototype;

function EChartsPairwiseScatterOptionBuilder() {
    _super.constructor.call(this);
}

EChartsPairwiseScatterOptionBuilder.prototype = Object.create(_super);
EChartsPairwiseScatterOptionBuilder.prototype.constructor = EChartsPairwiseScatterOptionBuilder;

EChartsPairwiseScatterOptionBuilder.prototype._defaultOptions = function () {
    var opt = _super._defaultOptions.call(this);
    $.extend(true, opt, {
        dataZoom: [{
            type: 'inside',
            filterMode: 'filter',
            xAxisIndex: [0],
            disabled: true
        }]
    });
    return opt;
};

EChartsPairwiseScatterOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine'];
    this._registerDecorator('pairwiseGrid');
    this._registerDecorator('pairwiseAxis');
    this._registerDecorator('tooltipPairwiseScatter');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesKeyColumns(this.bOptions.colorBy[0].selected);
};

EChartsPairwiseScatterOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var grid = {};
    var localData = this.getLocalData();
    var colorByIndexes = this.getSeriesKeyColumnIndexes();
    var axisIndexes = _optionUtils2.default.getColumnIndexes(this.getSeriesDataColumns(), localData.columns);

    var i, row, seriesName, seriesItem, firstAxisIndex, secondAxisIndex, xAxisIndex, yAxisIndex, gridId;
    var axisIndex = 0;
    for (i in localData.data) {
        row = localData.data[i];

        for (firstAxisIndex = 0; firstAxisIndex < axisIndexes.length; firstAxisIndex++) {
            xAxisIndex = axisIndexes[firstAxisIndex];
            for (secondAxisIndex = 0; secondAxisIndex < axisIndexes.length; secondAxisIndex++) {
                yAxisIndex = axisIndexes[secondAxisIndex];
                seriesName = this.getSeriesName(row, colorByIndexes);
                gridId = firstAxisIndex + 'X' + secondAxisIndex;
                seriesItem = this._getSeriesItem(series, seriesName, gridId);
                grid[gridId] = typeof grid[gridId] === 'undefined' ? Object.keys(grid).length : grid[gridId];
                series[seriesName + gridId] = seriesItem;
                if (!seriesItem.extractor) {
                    seriesItem.extractor = this._newSeriesExtractor(xAxisIndex, yAxisIndex);
                    seriesItem.extractor.keys = this.getCellText(row, colorByIndexes);
                    seriesItem.keys = seriesItem.extractor.keys;

                    seriesItem.xAxisIndex = grid[gridId];
                    seriesItem.yAxisIndex = grid[gridId];

                    seriesItem.xAxisColumnIndex = firstAxisIndex;
                    seriesItem.yAxisColumnIndex = secondAxisIndex;

                    axisIndex++;
                }
                seriesItem.extractor.push(row, i);
            }
        }
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsPairwiseScatterOptionBuilder.prototype._getSeriesItem = function (series, name, gridId) {
    var seriesItem = series[name + gridId];
    if (!seriesItem) {
        seriesItem = this._newSeriesItem();
        seriesItem.name = name || 'default';
    }
    return seriesItem;
};

EChartsPairwiseScatterOptionBuilder.prototype._newSeriesExtractor = function (xAxisIndex, yAxisIndex) {
    var extractor = new _echartsPointExtractor2.default();
    extractor.setTarget({
        index: [xAxisIndex],
        type: 'value',
        isKey: false
    });
    extractor.setTarget({
        index: [yAxisIndex],
        type: 'value',
        isKey: false
    });
    return extractor;
};

EChartsPairwiseScatterOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'scatter',
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 200,
        data: []
    };
    return seriesItem;
};

exports.default = EChartsPairwiseScatterOptionBuilder;

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _echartsPieOptionBuilder = __webpack_require__(293);

var _echartsPieOptionBuilder2 = _interopRequireDefault(_echartsPieOptionBuilder);

var _echartsPieCalculatedOptionBuilder = __webpack_require__(294);

var _echartsPieCalculatedOptionBuilder2 = _interopRequireDefault(_echartsPieCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: echarts-pie.js
 * Created by daewon.park on 2017-03-30.
 */

function EChartsPie(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsPie.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsPie.prototype.constructor = EChartsPie;

EChartsPie.prototype.objectWithKeySorted = function (object) {
    var sortable = [];
    var newObj = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) sortable.push([key, object[key]]);
    }sortable.sort(function (a, b) {
        var x = a[1].name,
            y = b[1].name;
        if (Number(x)) x = Number(x);
        if (Number(y)) y = Number(y);
        return x < y ? -1 : x > y ? 1 : 0;
    });

    for (var i in sortable) {
        newObj.push(sortable[i][1]);
    }
    return newObj;
};

EChartsPie.prototype.render = function () {
    if (this.options.source.localData[0].dataType === 'chartdata') {
        this.seriesHelper = new _echartsPieCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsPieOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    opt.series[0].data = this.objectWithKeySorted(opt.series[0].data);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsPie.prototype._doDataValidation = function (opt) {
    _chartUtils2.default.limitMaxSeriesSize(opt.series);
};

EChartsPie.prototype.getLegendData = function () {
    var legendData = [];

    var legendSelection = this._getEChartOption().legend[0].selected;
    var keyColumns = this.seriesHelper.getColorByColumns();
    if (keyColumns.length > 0) {
        var opt = this.seriesHelper.eOptions;
        if (opt.series.length > 0) {
            for (var i in opt.series[0].data) {
                var item = {
                    name: opt.series[0].data[i].name,
                    symbol: 'square',
                    color: opt.color[parseFloat(i) % opt.color.length]
                };
                if (typeof legendSelection[item.name] === 'undefined') {
                    item.selected = true;
                } else {
                    item.selected = legendSelection[item.name];
                }
                legendData.push(item);
            }
        }
    }

    return legendData;
};

exports.default = EChartsPie;

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsPieOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsPieOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsPieOptionBuilder.prototype.constructor = EChartsPieOptionBuilder;

EChartsPieOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['radius', 'itemStyle', 'label', 'silent', 'center'];
    this._registerDecorator('tooltipPie');
    this._registerDecorator('plotOptions');
    this._registerDecorator('axisRemoval');
    this._registerDecorator('brushRemoval');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.plotOptions.pie.sizeBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.colorBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.pie.sizeBy[0].selected);
};

EChartsPieOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var dataColumns = this.getSeriesDataColumns(0);
    var aggregation = 'count';
    if (dataColumns[dataColumns.length - 1] !== null && dataColumns[dataColumns.length - 1].aggregation && dataColumns[dataColumns.length - 1].aggregation !== 'none') aggregation = dataColumns[dataColumns.length - 1].aggregation;
    var colorByIndexes = this.getColumnIndexes(this.bOptions.colorBy[0].selected, localData.columns);
    var sizeByIndexes = this.getColumnIndexes(this.bOptions.plotOptions.pie.sizeBy[0].selected, localData.columns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: colorByIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: sizeByIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var operator = new _aggregationOperator2.default(pointObject.value);
        for (var i = 0; i < pointObject.indexList.length; i++) {
            operator.add(pointObject.indexList[i], pointObject.point[i] ? pointObject.point[i][pointObject.point[i].length - 1] : 1);
        }
        return [{
            keys: pointObject.value,
            name: pointObject.value.join(' '),
            value: Math.abs(operator.calc(aggregation)),
            dataIndexes: pointObject.indexList,
            minusValue: operator.calc(aggregation) < 0 ? true : false
        }];
    });

    return extractor;
};

exports.default = EChartsPieOptionBuilder;

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsPieCalculatedOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsPieCalculatedOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsPieCalculatedOptionBuilder.prototype.constructor = EChartsPieCalculatedOptionBuilder;

EChartsPieCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['radius', 'itemStyle', 'label', 'silent', 'center'];
    this._registerDecorator('tooltipPieCalculated');
    this._registerDecorator('plotOptions');
    this._registerDecorator('axisRemoval');
    this._registerDecorator('brushRemoval');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.plotOptions.pie.sizeBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.colorBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.pie.sizeBy[0].selected);
};

EChartsPieCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var colorByIndexes = this.getColumnIndexes([{ name: 'colorBy' }], localData.chartColumns);
    var sizeByIndexes = this.getColumnIndexes([{ name: 'sizeBy' }], localData.chartColumns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: colorByIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: sizeByIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var pointValue = pointObject.value;
        var names = [];
        for (var i in pointValue) {
            if ($.isArray(pointValue[i])) {
                for (var v in pointValue[i]) {
                    names.push(pointValue[i][v]);
                }
            } else {
                names.push(pointValue[i]);
            }
        }

        return [{
            keys: pointObject.value,
            name: names.join(' '),
            value: Math.abs(pointObject.point[0][1]),
            dataIndexes: pointObject.indexList,
            minusValue: pointObject.point[0][1] < 0 ? true : false
        }];
    });

    return extractor;
};

exports.default = EChartsPieCalculatedOptionBuilder;

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsQqplotOptionBuilder = __webpack_require__(296);

var _echartsQqplotOptionBuilder2 = _interopRequireDefault(_echartsQqplotOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsQQPlot
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Source: echarts-qqplot.js
 * Created by ji_sung.park on 2018-02-06.
 */

function EChartsQQPlot(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsQQPlot.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsQQPlot.prototype.constructor = EChartsQQPlot;

EChartsQQPlot.prototype.render = function () {

    this.seriesHelper = new _echartsQqplotOptionBuilder2.default();

    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

// Alias['qqplot'] = EChartsQQPlot;

exports.default = EChartsQQPlot;

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _qqplotOperator = __webpack_require__(297);

var _qqplotOperator2 = _interopRequireDefault(_qqplotOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsQQPlotOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsQQPlotOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsQQPlotOptionBuilder.prototype.constructor = EChartsQQPlotOptionBuilder;

EChartsQQPlotOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('axisTypeValue');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('markerByType', { 'scatter': 'qqplot' });
    this._registerDecorator('tooltipQQPlot');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.plotOptions.qqplot.values[0].selected);
};

EChartsQQPlotOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'scatter';

    return seriesItem;
};

EChartsQQPlotOptionBuilder.prototype._newSeriesExtractor = function () {
    var valueIndexes = this.getSeriesDataColumnIndexes(0);
    var distribution = this.bOptions.plotOptions.qqplot.distribution[0].selected;

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: -1,
        type: 'value',
        isKey: true
    });

    extractor.setTarget({
        index: valueIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var operator = new _qqplotOperator2.default(pointObject.value);
        for (var i = 0; i < pointObject.indexList.length; i++) {
            operator.add(pointObject.indexList[i], pointObject.point[i][0]);
        }

        return operator.calc(distribution);
    });

    return extractor;
};

EChartsQQPlotOptionBuilder.prototype._buildSeriesData = function () {
    var qqplotData;
    for (var s in this.series) {
        qqplotData = this.series[s].extractor.extract()[0];
        var values = [];
        for (var i in qqplotData.values) {
            values.push({
                value: qqplotData.values[i]
            });
        }
        this.series[s].data = values;
    }
    this._addReferenceLine(qqplotData);
    this._addPercentileLines(qqplotData);
};

EChartsQQPlotOptionBuilder.prototype._addReferenceLine = function (qqplotData) {
    var lineSeries = {
        virtualSeries: true,
        type: 'line',
        showSymbol: false,
        lineStyle: {
            normal: {
                color: this.bOptions.colorSet[1]
            }
        },
        data: []
    };

    var values = this._getVirtualSeriesValues(qqplotData);

    for (var i in values) {
        lineSeries.data.push({
            value: [values[i], values[i]]
        });
    }

    this.series.push(lineSeries);
};

EChartsQQPlotOptionBuilder.prototype._addPercentileLines = function (qqplotData) {
    var confidenceLine = {
        virtualSeries: true,
        type: 'line',
        showSymbol: false,
        smooth: true,
        lineStyle: {
            normal: {
                color: this.bOptions.colorSet[2]
            }
        },
        data: []
    };

    var upperConfidenceLine = $.extend(true, {}, confidenceLine);
    var lowerConfidenceLine = $.extend(true, {}, confidenceLine);

    var dist = qqplotData.dist;
    var n = qqplotData.values.length;

    var confidence = this.bOptions.plotOptions.qqplot.confidence[0].selected;
    var jstat = window.jStat();
    var stdNormal = jstat.normal(0, 1);
    var limitConst = stdNormal.inv(1 - (1 - confidence) / 2);

    var values = this._getVirtualSeriesValues(qqplotData);

    for (var i in values) {
        var q = values[i];
        var cdf = dist.cdf(q);
        var pdf = dist.pdf(q);
        var confidenceLimit = limitConst * Math.sqrt(cdf * (1 - cdf) / (n * pdf * pdf));
        var upperConf = q + confidenceLimit;
        upperConfidenceLine.data.push({
            value: [q, upperConf]
        });
        var lowerConf = q - confidenceLimit;
        lowerConfidenceLine.data.push({
            value: [q, lowerConf]
        });
    }

    this.series.push(upperConfidenceLine);
    this.series.push(lowerConfidenceLine);
};

EChartsQQPlotOptionBuilder.prototype._getVirtualSeriesValues = function (plotData) {
    var values = plotData.values.map(function (value) {
        return value[0];
    });
    values.sort(_optionUtils2.default.numericSortRule);

    var distribution = this.bOptions.plotOptions.qqplot.distribution[0].selected;

    var diff = (values[values.length - 1] - values[0]) * 0.1;

    var length = values.length;
    values = values.map(function (value, index) {
        var offset = -diff + diff * 2 / length * index;
        var calcVal = value + offset;
        if (distribution !== 'normal' && calcVal < 0) calcVal = 0;
        return calcVal;
    });

    values = values.filter(function (value) {
        var pdf = plotData.dist.pdf(value);
        return pdf !== 0 && (distribution !== 'lognormal' || distribution === 'lognormal' && value >= 0.025);
    });

    return values;
};

exports.default = EChartsQQPlotOptionBuilder;

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _validationError = __webpack_require__(25);

var _validationError2 = _interopRequireDefault(_validationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: qqplot-operator.js
 * Created by ji_sung.park on 2018-02-06.
 */
var DISTRIBUTION_VALIDATOR_LIST = {
    'normal': [],
    'exponential': ['GreaterThanOrEqualToZero', 'MeanIsZero'],
    'gamma': ['GreaterThanZero', 'VarianceIsZero', 'MeanIsZero'],
    'lognormal': ['GreaterThanZero', 'MeanIsZero'],
    'beta': ['ZeroToOne', 'VarianceIsZero']
};
var VALIDATION_MESSAGE = {
    'GreaterThanOrEqualToZero': 'All values must be greater than or equal to 0.',
    'GreaterThanZero': 'All values must be greater than 0.',
    'ZeroToOne': 'All values must be 0 to 1.',
    'MeanIsZero': 'Cannot calculate distribution parameter. (Mean is 0)',
    'VarianceIsZero': 'Cannot calculate distribution parameter. (Variance is 0)'
};

function QQPlotOperator(x) {
    this.x = x;
    this.dataIndexes = [];
    this.values = [];
    this.sumValue = 0;
}

QQPlotOperator.prototype.add = function (index, value) {
    // if(Number.isFinite(value)){
    this.dataIndexes.push(parseInt(index));
    this.values.push(value);
    this.sumValue += value;
    // }
};

QQPlotOperator.prototype._toFixed = function (val) {
    return Number(val.toFixed(14));
};

QQPlotOperator.prototype._validate = function (distribution, m, v) {
    var errors = [];

    if (this.values.filter(function (value) {
        return value < 0;
    }).length > 0) {
        errors.push('GreaterThanOrEqualToZero');
    }
    if (this.values.filter(function (value) {
        return value <= 0;
    }).length > 0) {
        errors.push('GreaterThanZero');
    }
    if (this.values.filter(function (value) {
        return value < 0 || value > 1;
    }).length > 0) {
        errors.push('ZeroToOne');
    }
    if (m === 0) {
        errors.push('MeanIsZero');
    }
    if (v === 0) {
        errors.push('VarianceIsZero');
    }

    errors = errors.filter(function (value) {
        return DISTRIBUTION_VALIDATOR_LIST[distribution].indexOf(value) !== -1;
    });

    return errors;
};

QQPlotOperator.prototype._getDistribution = function (distribution) {
    var jStat = window.jStat(this.values);

    var m = jStat.mean();
    var v = jStat.variance();

    var errors = this._validate(distribution, m, v);

    if (errors.length > 0) {
        var message = errors.map(function (value) {
            return VALIDATION_MESSAGE[value];
        }).join('<br>');
        throw new _validationError2.default(message);
    }

    var firstParam, secondParam;

    switch (distribution) {
        case 'normal':
            firstParam = m;
            secondParam = jStat.stdev();
            break;
        case 'exponential':
            var rate = 1 / m;
            firstParam = rate;
            break;
        case 'gamma':
            var shape = m * m / v;
            var scale = v / m;
            firstParam = shape;
            secondParam = scale;
            break;
        case 'lognormal':
            var sigma = Math.sqrt(Math.log(1 + v / (m * m)));
            var mu = Math.log(m) - sigma * sigma / 2;
            firstParam = mu;
            secondParam = sigma;
            break;
        case 'beta':
            var aux = m * (1 - m) / v - 1;
            var alpha = m * aux;
            var beta = (1 - m) * aux;
            firstParam = alpha;
            secondParam = beta;
            break;
        default:
            break;
    }

    if (firstParam && secondParam) {
        return jStat[distribution](firstParam, secondParam);
    } else if (firstParam) {
        return jStat[distribution](firstParam);
    } else {
        throw new _validationError2.default('This distribution is not supported.');
    }
};

QQPlotOperator.prototype.calc = function (distribution) {
    var _this = this;
    this.values.sort(_optionUtils2.default.numericSortRule);
    var n = this.values.length;
    var p = this.values.map(function (value, index) {
        if (!Number.isFinite(value)) {
            throw new _validationError2.default('Selected column has one or more invalid value(s)');
        }
        return (index + 1) / (n + 1);
    });

    var dist = this._getDistribution(distribution);

    var q = p.map(function (value) {
        return dist.inv(value);
    });

    var values = q.map(function (value, index) {
        return [value, _this.values[index]];
    });

    return {
        p: p,
        q: q,
        dist: dist,
        values: values
    };
};

exports.default = QQPlotOperator;

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// /**
//  * Source: echarts.wrapper.js
//  * Created by daewon.park on 2017-03-23.
//  */
// 
// 
//
// 
// 
//
//     function EChartsRadar(parentId, options) {
//         EChartsWrapper.call(this, parentId, options);
//     }
//
//     EChartsRadar.prototype = Object.create(EChartsWrapper.prototype);
//     EChartsRadar.prototype.constructor = EChartsRadar;
//
//     EChartsRadar.prototype.render = function () {
//         var _this = this;
//         this.seriesHelper = new EChartsRadarOptionBuilder();
//         var opt = this.seriesHelper.buildOptions(this.options);
//         this._bindInternalOptions(this.seriesHelper);
//         this._setEChartOption(opt);
//     };
//
//     EChartsRadar.prototype.getLegendData = function () {
//         var legendData = [];
//
//         var keyColumns = this.seriesHelper.getColorByColumns(this.options);
//         var legendKeyMap = {};
//         if (keyColumns.length > 0) {
//             var opt = this.seriesHelper.eOptions;
//             if (opt.series.length > 0) {
//                 for (var i in opt.series[0].data) {
//                     if (opt.series[0].data[i] instanceof Array) {
//                         legendKeyMap = {};
//                         break;
//                     }
//                     else {
//                         //legend 중복을 막기 위해 로직 추가
//                         if (!legendKeyMap[opt.series[0].data[i].name]) {
//                             legendKeyMap[opt.series[0].data[i].name] = {
//                                 name: opt.series[0].data[i].name,
//                                 symbol: opt.series[0].symbol,
//                                 symbolSize: opt.series[0].symbolSize,
//                                 color: opt.color[parseFloat(i) % opt.color.length]
//                             };
//                         }
//                     }
//                 }
//             }
//         }
//
//         for (var key in legendKeyMap) {
//             legendData.push(legendKeyMap[key]);
//         }
//
//         return legendData;
//     };
//
//     EChartsRadar = EChartsRadar;
//
//     /**
//      * BChart 의 옵션 포맷
//      var options = {
//           colorSet: [
//               '#FD026C', '#4682B8', '#A5D22D', '#F5CC0A', '#FE8C01', '#6B9494', '#B97C46',
//               '#84ACD0', '#C2E173', '#F9DD5B', '#FE569D', '#FEB356', '#9CB8B8', '#D0A884',
//               '#2E6072', '#6D8C1E', '#A48806', '#A90148', '#A95E01', '#476363', '#7B532F'
//           ],
//           chart: {
//               type: 'radar'
//           },
//           title: {
//               text: "레이더 차트 예제"
//           },
//           legend: {
//               visible: true,
//               orientation: 'horizontal',
//               top: '0px',
//               left: '50%',
//               background: 'transparent'
//           },
//           colorBy: [ {
//               selected: [{name: '영어'}]
//           } ],
//           plotOptions: {
//               radar: {
//                   indicator: [{ name: '영어', max: 100}, { name: '수학', max: 100}, { name: '국어', max: 100}],
//                   shape: 'circle', // 'rect'
//                   startAngle: 90,
//                   splitNumber: 5
//               }
//           },
//           source: {
//               dataType: 'local',
//               localData: [ {
//                   dataType: 'rawData',
//                   columns: [{ name: '영어', 'type': 'number'}, { name: '수학', 'type': 'number'}, { name: '국어', 'type': 'number'}],  //'string'
//                   data: [[100, 100, 95], [90, 90, 90], [100, 40, 50]]
//               } ]
//           }
//       }
//      *
//      * EChart 의 옵션 포맷
//      var option = {
//           title: {
//               text: '레이더 차트 예제'
//           },
//           tooltip: {},
//           color: ['red', 'blue'],
//           legend: {
//               data: ['영어-100', '영어-90'],
//               selectedMode: 'multi'
//           },
//           radar: {
//               indicator: [{ name: '영어', max: 100}, { name: '수학', max: 100}, { name: '국어', max: 100}],
//               shape: 'circle', // 'rect'
//               startAngle: 90,
//               splitNumber: 5
//           },
//           series: [{
//               type: 'radar',
//               data: [{
//                   value: [100, 100, 95],
//                   name: '영어-100'
//               }, {
//                   value: [90, 90, 90],
//                   name: '영어-90'
//               }, {
//                   value: [100, 40, 50],
//                   name: '영어-100'
//               }]
//           }]
//      }
//      */
//     function EChartsRadarOptionBuilder(parentId, options) {
//         EChartsOptionBuilder.call(this, parentId, options);
//     }
//
//     EChartsRadarOptionBuilder.prototype = Object.create(EChartsOptionBuilder.prototype);
//     EChartsRadarOptionBuilder.prototype.constructor = EChartsRadarOptionBuilder;
//
//     EChartsRadarOptionBuilder.prototype._defaultOptions = function () {
//         var opt = {
//             tooltip: {
//                 trigger: 'item',
//                 showDelay: 0
//             },
//             toolbox: {
//                 show: false
//             },
//             legend: {
//                 data: [],
//                 selectedMode: 'multi',   //중요: 현재 class 구조에서는 legend 옵션에 selectedMode를 추가할 수가 없어서 여기서 추가.
//                 show: false             //중요: default legend는 hide
//             },
//             radar: {
//                indicator: [{name: '영어', max: 100}, {name: '수학', max: 100}, {name: '국어', max: 100}],
//                shape: 'circle', // 'rect'
//                startAngle: 90,
//                splitNumber: 5
//             },
//             series: [{
//                type: 'radar',
//                data: [{
//                    value: [100, 100, 95],
//                    name: '국어-95'
//                }, {
//                    value: [90, 90, 90],
//                    name: '국어-90'
//                }]
//             }]
//         };
//
//         opt.visualMap = this.bOptions.visualMap;
//         opt.color = (this.bOptions.colorBy && this.bOptions.colorBy.length) ? (this.bOptions.colorSet) : ((this.bOptions.colorSet) ? ([this.bOptions.colorSet[0]]) : (['#FD026C']));
//         $.extend(true, opt.tooltip, this.plotOptions.tooltip);
//         return opt;
//     };
//
//
//     EChartsRadarOptionBuilder.prototype.buildOptions = function (options) {
//         this.bOptions = options;
//         this.plotOptions = this.getPlotOptions();
//         this.eOptions = this._defaultOptions();
//         this._buildRadar();
//         this._buildSeries();
//         this._buildTooltip();
//         return this.eOptions;
//     };
//
//
//     EChartsRadarOptionBuilder.prototype._buildRadar = function () {
//         var options = this.bOptions;
//         this.eOptions.radar = $.extend(true, {}, options.plotOptions.radar);
//     };
//
//     EChartsRadarOptionBuilder.prototype._buildSeries = function () {
//         var options = this.bOptions;
//
//         var localData = options.source.localData[0];
//         var data;
//         if (options.colorBy && options.colorBy.length) {
//             var columnsNameIndexKeyMap = {};
//             for (var i in localData.columns) {
//                 columnsNameIndexKeyMap[localData.columns[i].name] = i;
//             }
//
//             var colorBy = options.colorBy[0].selected[0].name;
//             data = [];
//             for (var k in localData.data) {
//                 var val = localData.data[k][columnsNameIndexKeyMap[colorBy]];
//                 data.push({
//                     value: localData.data[k],
//                     name: colorBy + '_' + val
//                 })
//             }
//             this.eOptions.series = [{
//                 type: options.chart.type,
//                 data: data
//             }];
//         } else {
//             data = $.extend(true, [], localData.data);
//             this.eOptions.series = [{
//                 type: options.chart.type,
//                 data: data
//             }];
//         }
//     };
//
//     EChartsRadarOptionBuilder.prototype._buildTooltip = function () {
//         //TODO
//     };
//
//     EChartsRadarOptionBuilder = EChartsRadarOptionBuilder;
//
// export default 


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsLine = __webpack_require__(33);

var _echartsLine2 = _interopRequireDefault(_echartsLine);

var _echartsRoccurveOptionBuilder = __webpack_require__(300);

var _echartsRoccurveOptionBuilder2 = _interopRequireDefault(_echartsRoccurveOptionBuilder);

var _echartsRoccurveCalculatedOptionBuilder = __webpack_require__(301);

var _echartsRoccurveCalculatedOptionBuilder2 = _interopRequireDefault(_echartsRoccurveCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsROCCurve(parentId, options) {
    _echartsLine2.default.call(this, parentId, options);
} /**
   * Source: echarts-roccurve.js
   * Created by daewon.park on 2017-04-19.
   */

EChartsROCCurve.prototype = Object.create(_echartsLine2.default.prototype);
EChartsROCCurve.prototype.constructor = EChartsROCCurve;

EChartsROCCurve.prototype.render = function () {
    if (this.options.source.localData[0].dataType === 'chartdata') {
        this.seriesHelper = new _echartsRoccurveCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsRoccurveOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

exports.default = EChartsROCCurve;

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsLineOptionBuilder = __webpack_require__(46);

var _echartsLineOptionBuilder2 = _interopRequireDefault(_echartsLineOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsROCCurveOptionBuilder() {
    _echartsLineOptionBuilder2.default.call(this);
}

EChartsROCCurveOptionBuilder.prototype = Object.create(_echartsLineOptionBuilder2.default.prototype);
EChartsROCCurveOptionBuilder.prototype.constructor = EChartsROCCurveOptionBuilder;

EChartsROCCurveOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'smooth', 'smoothMonotone', 'step', 'label'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltip');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._setSeriesDataSortRule();
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.auroc[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsROCCurveOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsLineOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'line';

    return seriesItem;
};

EChartsROCCurveOptionBuilder.prototype._buildSeriesData = function () {
    _echartsLineOptionBuilder2.default.prototype._buildSeriesData.call(this);

    var minX, maxX;
    for (var s in this.series) {
        var data = this.series[s].data;
        if (data && data.length > 0) {
            if (typeof minX === 'undefined') minX = data[0].value[0];else minX = Math.min(minX, data[0].value[0]);

            if (typeof maxX === 'undefined') maxX = data[data.length - 1].value[0];else maxX = Math.max(maxX, data[data.length - 1].value[0]);
        }
    }

    if (typeof minX !== 'undefined' && typeof maxX !== 'undefined') {
        var baseSeries = {
            type: 'scatter',
            virtualSeries: true,
            showSymbol: false,
            symbolSize: 0,
            data: [[minX, minX], [maxX, maxX]],
            markLine: {
                silent: true,
                data: [[{
                    coord: [minX, minX],
                    symbol: 'none'
                }, {
                    coord: [maxX, maxX],
                    symbol: 'none'
                }]]
            }
        };
        $.extend(true, baseSeries.markLine, this.bOptions.plotOptions.roccurve.baseLine);
        this.series.push(baseSeries);
    }
    if (this.bOptions.auroc && this.bOptions.auroc[0].selected[0]) {
        this._addAuroc(minX, maxX);
    }
};

EChartsROCCurveOptionBuilder.prototype._addAuroc = function (minX, maxX) {
    var localData = this.getLocalData();
    var aurocIndex = this.getColumnIndexes(this.bOptions.auroc[0].selected, localData.columns);
    var aurocValue = this.getCellText(localData.data[0], aurocIndex);
    var centerPosition = (maxX + minX) / 2.0;

    var aurocSeries = {
        virtualSeries: true,
        type: 'scatter',
        data: [[centerPosition, centerPosition, aurocValue]],
        cursor: 'default',
        symbol: 'circle',
        symbolSize: 0.1,
        hoverAnimation: false,
        label: {
            normal: {
                formatter: function formatter(params) {
                    return 'auc : ' + Number(parseFloat(params.value[2]).toFixed(3));
                },
                show: true,
                position: "right",
                textStyle: {
                    color: "black",
                    fontSize: 18
                }
            }
        },
        itemStyle: {
            color: "white"
        }
    };

    this.series.push(aurocSeries);
};

exports.default = EChartsROCCurveOptionBuilder;

/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsLineCalculatedOptionBuilder = __webpack_require__(142);

var _echartsLineCalculatedOptionBuilder2 = _interopRequireDefault(_echartsLineCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsROCCurveCalculatedOptionBuilder() {
    _echartsLineCalculatedOptionBuilder2.default.call(this);
}

EChartsROCCurveCalculatedOptionBuilder.prototype = Object.create(_echartsLineCalculatedOptionBuilder2.default.prototype);
EChartsROCCurveCalculatedOptionBuilder.prototype.constructor = EChartsROCCurveCalculatedOptionBuilder;

EChartsROCCurveCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['markPoint', 'markLine', 'smooth', 'smoothMonotone', 'step'];
    this._registerDecorator('axisType');
    this._registerDecorator('axisLabelFormatter');
    this._registerDecorator('stripline');
    this._registerDecorator('tooltipTriggerAxis');
    this._registerDecorator('tooltip');
    this._registerDecorator('marker');
    this._registerDecorator('plotOptions');
    this._setSeriesDataSortRule();
    this.setSeriesKeyColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.xAxis[0].selected);
    this.setSeriesDataColumns(this.bOptions.yAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.xAxis[0].selected);
    this.setTooltipDataColumns(this.bOptions.yAxis[0].selected);
};

EChartsROCCurveCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = _echartsLineCalculatedOptionBuilder2.default.prototype._newSeriesItem.call(this);
    seriesItem.type = 'line';

    return seriesItem;
};

EChartsROCCurveCalculatedOptionBuilder.prototype.getSeriesKeyColumns = function () {
    var keyColumns = this.filterNullColumn(this.bOptions.colorBy[0].selected);
    if (keyColumns.length > 0) {
        return [{ name: 'colorBy' }];
    } else {
        return [];
    }
};

EChartsROCCurveCalculatedOptionBuilder.prototype._buildSeriesData = function () {
    _echartsLineCalculatedOptionBuilder2.default.prototype._buildSeriesData.call(this);

    var minX, maxX;
    for (var s in this.series) {
        var data = this.series[s].data;
        if (data && data.length > 0) {
            if (typeof minX === 'undefined') minX = data[0].value[0];else minX = Math.min(minX, data[0].value[0]);

            if (typeof maxX === 'undefined') maxX = data[data.length - 1].value[0];else maxX = Math.max(maxX, data[data.length - 1].value[0]);
        }
    }

    if (typeof minX !== 'undefined' && typeof maxX !== 'undefined') {
        var baseSeries = {
            type: 'scatter',
            virtualSeries: true,
            showSymbol: false,
            symbolSize: 0,
            data: [[minX, minX], [maxX, maxX]],
            markLine: {
                silent: true,
                data: [[{
                    coord: [minX, minX],
                    symbol: 'none'
                }, {
                    coord: [maxX, maxX],
                    symbol: 'none'
                }]]
            }
        };
        $.extend(true, baseSeries.markLine, this.bOptions.plotOptions.roccurve.baseLine);
        this.series.push(baseSeries);
    }
};

exports.default = EChartsROCCurveCalculatedOptionBuilder;

/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _widget = __webpack_require__(20);

var _widget2 = _interopRequireDefault(_widget);

var _validationError = __webpack_require__(25);

var _validationError2 = _interopRequireDefault(_validationError);

var _chartOptionBuilder = __webpack_require__(34);

var _chartOptionBuilder2 = _interopRequireDefault(_chartOptionBuilder);

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _preferenceUtils = __webpack_require__(165);

var _preferenceUtils2 = _interopRequireDefault(_preferenceUtils);

var _utils = __webpack_require__(47);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handsontableTable(parentId, options) {
    _widget2.default.call(this, parentId, options);
}

handsontableTable.prototype = Object.create(_widget2.default.prototype);
handsontableTable.prototype.constructor = handsontableTable;

handsontableTable.prototype.destroy = function () {
    try {
        $(window).off('resize', this.resizeHandler);
        this.table.destroy();
        delete this.table;
    } catch (ex) {
        // ignore exception
    }
};

handsontableTable.prototype._createContents = function ($parent) {
    var _this = this;

    this.$mainControl = $('<div class="bcharts-chart"></div>');
    $parent.append(this.$mainControl);

    this.$mainControl.hide();

    this.resizeHandler = function () {
        _this.redrawLayout();
    };
    $(window).resize(this.resizeHandler);
};

handsontableTable.prototype.clear = function () {
    if (this.table) {
        $(window).off('resize', this.resizeHandler);
        this.table.destroy();
        delete this.table;
    }
};

handsontableTable.prototype.render = function () {
    var _this = this;
    if (this.options.source.localData[0].data.length == 0) {
        throw new _validationError2.default('No data to display');
    }

    if (this.options.plotOptions.table.border) {
        this.$mainControl.css('border', this.options.plotOptions.table.border);
    }

    this.builder = new handsontableTableOptionBuilder();

    var opt = this.builder.buildOptions(this.options, this.$parent.width(), this.$parent.height(), this._makeContextMenu());

    // 있으면 update 없으면 생성.. 다른 좋은 방법이 필요한...
    if (this.table) {
        this.table.updateSettings(opt);
    } else {
        this.table = new Handsontable(this.$mainControl[0], opt);
    }

    this.$mainControl.show();
};

handsontableTable.prototype.redrawLayout = function () {
    var _this = this;

    clearTimeout(this._redrawLayoutJob);
    this._redrawLayoutJob = setTimeout(function () {
        if (_this.table && _this.$parent.attr('status') !== 'error') {
            var updateOption = _this.table.getSettings();
            updateOption.width = _this.$parent.width();
            updateOption.height = _this.$parent.height();
            _this.table.updateSettings(updateOption);
        }
    }, 300);
};

handsontableTable.prototype.selectRange = function () {
    // do nothing, interaction 추후 개발 필요 시 구현
};

handsontableTable.prototype.getSelectedRange = function () {
    // do nothing, interaction 추후 개발 필요 시 구현
};

handsontableTable.prototype._makeContextMenu = function () {
    // OptionBuilder에 넣어야 되는데 사정상...
    var _this = this;
    var contextMenu = {
        items: {
            "option_1": {
                name: 'View cell',
                callback: function callback(key, selection, clickEvent) {
                    _this._openCellViewDialog(this.getValue());
                }
            },
            "option_2": {
                name: 'Auto resize this column',
                callback: function callback(key, selection, clickEvent) {
                    var colHeaders = this.getColHeader();
                    var plugin = this.getPlugin('manualColumnResize');
                    var selectedCol = selection[0].start.col;
                    plugin.setManualSize(selectedCol, colHeaders[selectedCol].length * 10 > 80 ? colHeaders[selectedCol].length * 10 : 80);
                    this.updateSettings({});
                }
            },
            "option_3": {
                name: 'Auto resize all columns',
                callback: function callback() {
                    var colHeaders = this.getColHeader();
                    var plugin = this.getPlugin('manualColumnResize');

                    for (var i = 0; i < colHeaders.length; i++) {
                        plugin.setManualSize(i, colHeaders[i].length * 10 > 80 ? colHeaders[i].length * 10 : 80);
                    }
                    // plugin.updatePlugin();
                    // manual에서는 위에걸로 하라고 하는데 안먹어서 그냥 이걸로....
                    this.updateSettings({});
                }
            },
            "option_4": {
                name: 'Copy columns to clipboard',
                callback: function callback() {
                    var columns = this.getColHeader();
                    var isChrome = !!window.chrome && !!window.chrome.webstore;
                    var isIE = /* @cc_on!@*/false || !!document.documentMode;

                    if (isChrome) {
                        var textField = document.createElement('textarea');
                        textField.innerText = columns.join(', ');
                        document.body.appendChild(textField);
                        textField.select();
                        document.execCommand('copy');
                        textField.remove();
                    } else if (isIE) {
                        window.clipboardData.setData('Text', columns.join(', '));
                    }
                }
            }
        }
    };

    return contextMenu;
};

handsontableTable.prototype._openCellViewDialog = function (cellValue) {
    var $dialog = $('<div class="bcharts-dialog">' + '   <div class="bcharts-dialog-header">Cell Viewer</div>' + '   <div class="bcharts-dialog-contents-wrapper">' + '       <div class="bcharts-dialog-contents cellviewer"></div>' + '   </div>' + '</div>');
    var dialogWidth = 300;
    var dialogHeight = 300;
    if (cellValue) {
        try {
            var jsonObj = $.parseJSON(cellValue);
            if ((typeof jsonObj === 'undefined' ? 'undefined' : _typeof(jsonObj)) === 'object') {
                $dialog.find('.bcharts-dialog-contents').append('<div class="bcharts-cell-viewer">' + JSON.stringify(jsonObj, null, 4) + '</div>');
                dialogWidth = 800;
                dialogHeight = 800;
            } else {
                this._setContents($dialog, cellValue);
            }
        } catch (err) {
            this._setContents($dialog, cellValue);
        }
    } else {
        $dialog.find('.bcharts-dialog-contents').append('<span style="color: #ff3333">' + cellValue + '</span>');
    }

    // TODO : AUI Widget 입니다. popup 만들면 변경 요망
    this.$parent.append($dialog);
    $dialog.find('.bcharts-dialog-contents').perfectScrollbar();
    $dialog.jqxWindow({
        theme: 'office',
        isModal: true,
        width: dialogWidth,
        height: dialogHeight,
        minWidth: 300,
        minHeight: 200,
        autoOpen: true
        // resizable: false
    });
    $dialog.on('close', function () {
        $dialog.jqxWindow('destroy');
    });
    $dialog.jqxWindow('focus');
};

handsontableTable.prototype._setContents = function ($dialog, contents) {
    if ($.isPlainObject(contents)) {
        $dialog.find('.bcharts-dialog-contents').append('<div class="bcharts-cell-viewer">' + JSON.stringify(contents, null, 4) + '</div>');
    } else if ($.isArray(contents)) {
        $dialog.find('.bcharts-dialog-contents').append('<div class="bcharts-cell-viewer">' + JSON.stringify(contents) + '</div>');
    } else {
        $dialog.find('.bcharts-dialog-contents').text(contents);
    }
};

exports.default = handsontableTable;


function handsontableTableOptionBuilder() {
    _chartOptionBuilder2.default.call(this);
}

handsontableTableOptionBuilder.prototype = Object.create(_chartOptionBuilder2.default.prototype);
handsontableTableOptionBuilder.prototype.constructor = handsontableTableOptionBuilder;

handsontableTableOptionBuilder.prototype.buildOptions = function (options, width, height, contextMenu) {
    this.bOptions = options;
    this.handsontableTableOptions = this._defaultOptions(width, height);

    this._buildData();
    this._buildColumns();
    this._buildMenu(contextMenu);

    return this.handsontableTableOptions;
};

handsontableTableOptionBuilder.prototype._defaultOptions = function (width, height) {
    var _this = this;
    var opt = {
        readOnly: true,
        rowHeaders: true,
        filters: false,
        dropdownMenu: false,
        manualColumnResize: true,
        columnSorting: true,
        width: width,
        height: height
    };
    return opt;
};

handsontableTableOptionBuilder.prototype._buildData = function () {
    var _this = this;
    var tableData = _this.bOptions.source.localData[0].data;

    this.handsontableTableOptions.data = tableData;
};

handsontableTableOptionBuilder.prototype._buildColumns = function () {
    var _this = this;
    var colHeaders = [];
    var colWidths = [];
    var columns = [];

    for (var i = 0; i < _this.bOptions.source.localData[0].columns.length; i++) {
        var column = _this.bOptions.source.localData[0].columns[i];

        // header 설정
        colHeaders.push(column.name);

        // header Width 설정
        colWidths.push(column.name.length * 10 > 80 ? column.name.length * 10 : 80);

        // column value 설정
        var columnSetting = {};
        if (column.type == 'date') {
            columnSetting = {
                type: 'time',
                timeFormat: 'yyyy-MM-dd HH:mm:ss:fff',
                correctFormat: true,
                renderer: function renderer(hotInstance, TD, row, col, prop, value, cellProperties) {
                    $(TD).attr('title', value);
                    $(TD).text(value);
                }
            };
        } else if (column.type == 'string') {
            columnSetting = _this._createStringColumnSetting(column);
        } else if (column.type == 'number') {
            columnSetting = _this._createNumberColumnSetting(column, _this._getColumnFormat(column.type, column.name, column.internalType));
        } else if (column.type == 'map') {
            columnSetting = _this._createMapColumnSetting(column);
        } else if (column.type.indexOf('[]') > -1) {
            columnSetting = _this._createArrayColumnSetting(column);
        }
        columns.push(columnSetting);
    }

    this.handsontableTableOptions.colHeaders = colHeaders;
    this.handsontableTableOptions.colWidths = colWidths;
    this.handsontableTableOptions.columns = columns;
};

handsontableTableOptionBuilder.prototype._getColumnFormat = function (type, name, internalType) {
    for (var i in this.bOptions.plotOptions.table.formatter) {
        var formatter = this.bOptions.plotOptions.table.formatter[i];
        if (formatter.column === name) {
            return formatter.format;
        }
    }
    var prefFormatter = _preferenceUtils2.default.getTableFormatter();
    var mappedInternalType = Object.entries({
        'double': ['Double', 'Float'],
        'integer': ['Integer', 'Long', 'Short']
    }).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            foo = _ref2[0],
            target = _ref2[1];

        return target.includes(internalType);
    }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            foo = _ref4[0];

        return foo;
    })[0];
    if (prefFormatter) {
        return (0, _utils.first)((0, _utils.compact)([prefFormatter[type], prefFormatter[mappedInternalType]]));
    }
};

handsontableTableOptionBuilder.prototype._createStringColumnSetting = function (column) {
    var renderer = function renderer(hotInstance, TD, row, col, prop, value, cellProperties) {
        if (typeof value === 'boolean') {
            value = value + '';
        }

        if (value) {
            $(TD).attr('title', value);
        } else if (value == null) {
            value = 'null';
            $(TD).attr('title', 'null');
            $(TD).css('color', '#ff3333');
        } else {
            $(TD).attr('title', value);
            $(TD).css('color', '#ff3333');
        }
        $(TD).text(value);
    };
    return { type: 'text', renderer: renderer };
};

handsontableTableOptionBuilder.prototype._createNumberColumnSetting = function (column, pattern) {
    var renderer = function renderer(hotInstance, TD, row, col, prop, value, cellProperties) {
        if (isNaN(value) || typeof value === 'undefined' || value === '' || value === null) {
            value = '' + value;
            $(TD).attr('title', value);
            $(TD).css('color', '#ff3333');
        } else if (pattern) {
            var useFormat = Brightics.Chart.Helper.OptionUtils.parseFmtStrToObj(pattern);
            if (useFormat.type === 'number') {
                $(TD).attr('title', value);
                value = parseFloat(value).toFixed(useFormat.digit);
            } else if (useFormat.type === 'exponential') {
                $(TD).attr('title', value);
                value = parseFloat(value).toExponential(useFormat.digit);
            }
        } else {
            if (value.toString().indexOf('e') !== -1) {
                $(TD).css('color', '#626fdb');
            }
            $(TD).attr('title', value);
        }
        $(TD).text(value);
        $(TD).css('text-align', 'right');
    };

    return { type: 'numeric', renderer: renderer };
};

handsontableTableOptionBuilder.prototype._createMapColumnSetting = function (column) {
    var renderer = function renderer(hotInstance, TD, row, col, prop, value, cellProperties) {
        if (!value) {
            $(TD).css('color', '#ff3333');
        }
        value = JSON.stringify(value);
        $(TD).attr('title', value);
        $(TD).text(value);
    };
    return { type: 'text', renderer: renderer };
};

handsontableTableOptionBuilder.prototype._createArrayColumnSetting = function (column) {
    var renderer = function renderer(hotInstance, TD, row, col, prop, value, cellProperties) {
        if (!value) {
            $(TD).css('color', '#ff3333');
        }
        $(TD).attr('title', value);
        $(TD).text(JSON.stringify(value));
    };
    return { type: 'text', renderer: renderer };
};

handsontableTableOptionBuilder.prototype._buildMenu = function (contextMenu) {
    // 여기서 만드는게 구조상 맞는데 사정상 밖에서 만들고 끌고 들어옴
    this.handsontableTableOptions.contextMenu = contextMenu;
};

//headerwidth = event.args.columntext.length * 7

/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by sds on 2017-11-07.
 */
exports.default = {
    table: {
        formatter: {
            // string: '$',
            // number: '0.0'
        }
    },
    extend: function extend(options) {
        return $.extend(true, {}, options);
    }
};

/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsTreemapOptionBuilder = __webpack_require__(305);

var _echartsTreemapOptionBuilder2 = _interopRequireDefault(_echartsTreemapOptionBuilder);

var _echartsTreemapCalculatedOptionBuilder = __webpack_require__(307);

var _echartsTreemapCalculatedOptionBuilder2 = _interopRequireDefault(_echartsTreemapCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsTreemap
 * @param parentId
 * @param options
 * @constructor
 */
function EChartsTreemap(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
} /**
   * Source: echarts-treemap.js
   * Created by daewon.park on 2017-04-16.
   */


EChartsTreemap.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsTreemap.prototype.constructor = EChartsTreemap;

EChartsTreemap.prototype.render = function () {
    if (this.options.source.localData[0].dataType == 'chartdata') {
        this.seriesHelper = new _echartsTreemapCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsTreemapOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    this._bindInternalOptions(this.seriesHelper);
    this._setEChartOption(opt);
};

exports.default = EChartsTreemap;

/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsTreemapExtractor = __webpack_require__(306);

var _echartsTreemapExtractor2 = _interopRequireDefault(_echartsTreemapExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: echarts-treemap.js
 * Created by daewon.park on 2017-04-16.
 */
function EChartsTreemapOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsTreemapOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsTreemapOptionBuilder.prototype.constructor = EChartsTreemapOptionBuilder;

EChartsTreemapOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('brushRemoval');
    this._registerDecorator('tooltipTreemap');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.plotOptions.hierarchyCol[0].selected);
};

EChartsTreemapOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsOptionBuilder2.default.prototype._defaultOptions.call(this);
    delete opt.xAxis;
    delete opt.yAxis;
    return opt;
};

EChartsTreemapOptionBuilder.prototype._newSeriesExtractor = function () {
    var columnIndexes = this.getSeriesDataColumnIndexes();
    var sizeIndex = this.getColumnIndexes(this.plotOptions.sizeBy[0].selected, this.getLocalData().columns);
    return new _echartsTreemapExtractor2.default(columnIndexes, sizeIndex[0]);
};

EChartsTreemapOptionBuilder.prototype._buildSeriesData = function () {
    var aggregation = this.plotOptions.sizeBy[0].selected[0].aggregation;
    for (var s in this.series) {
        this.series[s].data = this.series[s].extractor.extract(aggregation);
    }
};

EChartsTreemapOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData(0);
    var keyIndexes = this.getSeriesKeyColumnIndexes(0);

    var i, row, seriesName, seriesItem;
    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes);
        seriesItem = this._getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
        if (!seriesItem.extractor) {
            seriesItem.extractor = this._newSeriesExtractor();
        }
        seriesItem.extractor.push(row, i);
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsTreemapOptionBuilder.prototype.getSeriesName = function (row, columnIndexes) {
    return this.plotOptions.name || 'Root';
};

EChartsTreemapOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: this.bOptions.chart.type,
        label: {
            formatter: '{b}'
        },
        leafDepth: 3,
        levels: [{
            itemStyle: {
                normal: {
                    borderColor: '#777',
                    borderWidth: 0,
                    gapWidth: 1
                }
            }
        }, {
            itemStyle: {
                normal: {
                    borderColor: '#555',
                    borderWidth: 5,
                    gapWidth: 1
                },
                emphasis: {
                    borderColor: '#ddd'
                }
            },
            upperLabel: {
                normal: {
                    show: true
                }
            },
            colorSaturation: [0.3, 0.5]
        }, {
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    gapWidth: 1,
                    borderColorSaturation: 0.6
                }
            },
            upperLabel: {
                normal: {
                    show: true
                }
            },
            colorSaturation: [0.3, 0.5]
        }],
        data: []
    };

    var treemapOptions = this.plotOptions;
    var attributes = ['visibleMin', 'visibleMax', 'label', 'itemStyle', 'levels'];
    this._applySeriesOptions(seriesItem, treemapOptions, attributes);

    return seriesItem;
};

exports.default = EChartsTreemapOptionBuilder;

/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsExtractor = __webpack_require__(29);

var _echartsExtractor2 = _interopRequireDefault(_echartsExtractor);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: echarts-treemap.js
 * Created by daewon.park on 2017-04-16.
 */
function TreemapDataExtractor(columnIndexes, sizeIndex) {
    _echartsExtractor2.default.call(this);

    columnIndexes = columnIndexes.filter(function (value) {
        return value > -1;
    });

    this.columnIndexes = columnIndexes;
    this._sizeIndex = sizeIndex;
    this._nodes = {};
    this.operators = {};
}

TreemapDataExtractor.prototype = Object.create(_echartsExtractor2.default.prototype);
TreemapDataExtractor.prototype.constructor = TreemapDataExtractor;

TreemapDataExtractor.prototype.push = function (row, rowIndex) {

    var maxLength = this.columnIndexes.length;
    var hierarchyIndex, currentNodeKey, path;

    var nodes = this._nodes;
    for (var i = 0; i < maxLength; i++) {
        hierarchyIndex = this.columnIndexes[i];
        currentNodeKey = row[hierarchyIndex];

        path = path ? path + '/' + currentNodeKey : currentNodeKey;
        nodes[currentNodeKey] = nodes[currentNodeKey] || {
            name: currentNodeKey,
            path: path,
            operator: new _aggregationOperator2.default(currentNodeKey)
        };
        nodes[currentNodeKey].operator.add(rowIndex, row[this._sizeIndex]);
        if (i !== maxLength - 1) {
            nodes[currentNodeKey].children = nodes[currentNodeKey].children || {};
            nodes = nodes[currentNodeKey].children;
        }
    }
};

TreemapDataExtractor.prototype.extract = function (operator) {
    return this._convertMapToList(this._nodes, operator);
};

TreemapDataExtractor.prototype._convertMapToList = function (map, operator) {
    var answerList = [];
    for (var key in map) {
        var answer = {};
        answer.name = key;
        answer.path = map[key].path;
        answer.value = map[key].operator.calc(operator);

        if (map[key].children) {
            answer.children = this._convertMapToList(map[key].children, operator);
        }
        answerList.push(answer);
    }
    return answerList;
};

exports.default = TreemapDataExtractor;

/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsTreemapCalculatedOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EChartsTreemapCalculatedOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsTreemapCalculatedOptionBuilder.prototype.constructor = EChartsTreemapCalculatedOptionBuilder;

EChartsTreemapCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this._registerDecorator('brushRemoval');
    this._registerDecorator('tooltipTreemap');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.plotOptions.hierarchyCol[0].selected);
};

EChartsTreemapCalculatedOptionBuilder.prototype._defaultOptions = function () {
    var opt = _echartsOptionBuilder2.default.prototype._defaultOptions.call(this);
    delete opt.xAxis;
    delete opt.yAxis;
    return opt;
};

EChartsTreemapCalculatedOptionBuilder.prototype._buildSeriesData = function () {
    var localData = this.getLocalData(0);
    this.chartDataLocal = localData.data;
    var dataByDepth = {};
    var chartData = [];

    for (var s in this.series) {
        var depth = 0;
        for (var i in localData.data) {
            depth++;
            if (!dataByDepth[localData.data[i][0]]) {
                dataByDepth[localData.data[i][0]] = {};
            }
            dataByDepth[localData.data[i][0]]['' + localData.data[i][3]] = { index: i, parent: localData.data[i][2] };
        }

        for (var _i = depth - 1; _i > 0; _i--) {
            for (var name in dataByDepth[_i]) {
                if (!dataByDepth[_i - 1]['' + dataByDepth[_i][name].parent].children) {
                    dataByDepth[_i - 1]['' + dataByDepth[_i][name].parent].children = [];
                }
                dataByDepth[_i - 1]['' + dataByDepth[_i][name].parent].children.push(dataByDepth[_i][name]);
            }
        }

        for (var _name in dataByDepth[0]) {
            chartData.push(this._buildSeriesDataCustom(dataByDepth[0][_name]));
        }

        console.log(chartData);

        this.series[s].data = chartData;
    }
};

EChartsTreemapCalculatedOptionBuilder.prototype._buildSeriesDataCustom = function (input) {
    var data = {};
    var children = [];

    if (input.children && input.children.length > 0) {
        for (var i in input.children) {
            children.push(this._buildSeriesDataCustom(input.children[i]));
        }
        data = {
            name: this.chartDataLocal[input.index][1],
            path: this.chartDataLocal[input.index][3],
            value: this.chartDataLocal[input.index][4],
            children: children
        };
    } else {
        data = {
            name: this.chartDataLocal[input.index][1],
            path: this.chartDataLocal[input.index][3],
            value: this.chartDataLocal[input.index][4] };
    }
    return data;
};

EChartsTreemapCalculatedOptionBuilder.prototype._buildSeries = function () {
    var series = {};
    var localData = this.getLocalData(0);
    var keyIndexes = this.getSeriesKeyColumnIndexes(0);

    var i, row, seriesName, seriesItem;
    for (i in localData.data) {
        row = localData.data[i];
        seriesName = this.getSeriesName(row, keyIndexes);
        seriesItem = this._getSeriesItem(series, seriesName);
        series[seriesName] = seriesItem;
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsTreemapCalculatedOptionBuilder.prototype.getSeriesName = function (row, columnIndexes) {
    return this.plotOptions.name || 'Root';
};

EChartsTreemapCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: this.bOptions.chart.type,
        label: {
            formatter: '{b}'
        },
        leafDepth: 3,
        levels: [{
            itemStyle: {
                normal: {
                    borderColor: '#777',
                    borderWidth: 0,
                    gapWidth: 1
                }
            }
        }, {
            itemStyle: {
                normal: {
                    borderColor: '#555',
                    borderWidth: 5,
                    gapWidth: 1
                },
                emphasis: {
                    borderColor: '#ddd'
                }
            },
            upperLabel: {
                normal: {
                    show: true
                }
            },
            colorSaturation: [0.3, 0.5]
        }, {
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    gapWidth: 1,
                    borderColorSaturation: 0.6
                }
            },
            upperLabel: {
                normal: {
                    show: true
                }
            },
            colorSaturation: [0.3, 0.5]
        }],
        data: []
    };

    var treemapOptions = this.plotOptions;
    var attributes = ['visibleMin', 'visibleMax', 'label', 'itemStyle', 'levels'];
    this._applySeriesOptions(seriesItem, treemapOptions, attributes);

    return seriesItem;
};

exports.default = EChartsTreemapCalculatedOptionBuilder;

/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _echartsMapOptionBuilder = __webpack_require__(309);

var _echartsMapOptionBuilder2 = _interopRequireDefault(_echartsMapOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * EChartsMap
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Source: echarts-scatter.js
 * Created by daewon.park on 2017-03-23.
 */
function EChartsMap(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsMap.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsMap.prototype.constructor = EChartsMap;

var virtualSeries = [{
    virtualSeries: true, type: "lines", data: []
}, {
    virtualSeries: true, type: "scatter", data: [],
    coordinateSystem: "geo"
}];

EChartsMap.prototype.render = function () {
    this.seriesHelper = this.getSeriesHelper();
    this._buildedOptions = this.seriesHelper.buildOptions(this.options);

    var plotOptions = this.seriesHelper.plotOptions;
    var mapName = plotOptions.mapName;
    if (this._getRegisteredMap(mapName)) {
        this._render();
    } else {
        this._setCustomGeoData(plotOptions);
    }
};

EChartsMap.prototype._render = function () {
    var opt = this._buildedOptions;
    this._bindInternalOptions(this.seriesHelper);
    this._clearChart();
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsMap.prototype._clearChart = function () {
    if (this.echart) {
        this.echart.clear();
    }
};

EChartsMap.prototype.getSeriesHelper = function () {
    return new _echartsMapOptionBuilder2.default();
};

EChartsMap.prototype._setCustomGeoData = function (plotOptions) {
    var _this = this;

    if (plotOptions.geoData && plotOptions.geoData.url) {
        var url;
        if (typeof plotOptions.geoData.url === 'function') {
            url = plotOptions.geoData.url(plotOptions.mapName);
        } else {
            url = plotOptions.geoData.url;
        }
        $.ajax({
            url: url,
            async: false
        }).done(function (result) {
            _this._lazyGeoData(result);
        }).fail(function (e) {
            _this._failToLoadGeoData();
        });
    } else {
        this._failToLoadGeoData();
    }
};

EChartsMap.prototype._failToLoadGeoData = function () {
    var plotOptions = this.seriesHelper.plotOptions;
    var mapName = plotOptions.mapName;
    if (mapName == '') this.seriesHelper._throwValidation('Map Type is required.');else this.seriesHelper._throwValidation('This Map(' + mapName + ') is not exist.');
};

EChartsMap.prototype._lazyGeoData = function (geoJSON, specialAreas) {
    this._registerGeoData(geoJSON, specialAreas);
    this._render();
};

EChartsMap.prototype._registerGeoData = function (geoJSON, specialAreas) {
    var plotOptions = this.seriesHelper.plotOptions;
    var mapName = plotOptions.mapName;
    echarts.registerMap(mapName, geoJSON, specialAreas);
};

EChartsMap.prototype._getRegisteredMap = function (mapName) {
    if (mapName == '') this._failToLoadGeoData();else return echarts.getMap(mapName);
};

exports.default = EChartsMap;

/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

var _echartsMapLinesExtractor = __webpack_require__(310);

var _echartsMapLinesExtractor2 = _interopRequireDefault(_echartsMapLinesExtractor);

var _echartsAxisTypeOptionBuilder = __webpack_require__(14);

var _echartsAxisTypeOptionBuilder2 = _interopRequireDefault(_echartsAxisTypeOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EChartsMapOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

// EChartsMapOptionBuilder.prototype.buildOptions = function (options) {
//     this.bOptions = options;
//     this.plotOptions = this.getPlotOptions();
//     this.eOptions = this._defaultOptions();
//     this._setUpOptions();
//     this._buildSeries();
//     this._decorate();
//     this._configureChartOptions();
//     return this.eOptions;
// };

EChartsMapOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EChartsMapOptionBuilder.prototype.constructor = EChartsMapOptionBuilder;

EChartsMapOptionBuilder.prototype._setUpOptions = function () {
    var isSizeByExistArr = this.plotOptions.layers.map(function (layerObj) {
        if (typeof layerObj.sizeBy == 'undefined' || typeof layerObj.sizeBy[0].selected == 'undefined') return false;
        if ($.isArray(layerObj.sizeBy[0].selected)) {
            if (layerObj.sizeBy[0].selected[0] == null) return false;else return layerObj.sizeBy[0].selected.length > 0;
        } else return false;
    });
    this._registerDecorator('markerByType');
    this._registerDecorator('mapStyle');
    this._registerDecorator('tooltipMap');
    this._registerDecorator('marker', { isKey: isSizeByExistArr });
    this._registerDecorator('bubbleSize');
    for (var i in this.plotOptions.layers) {
        this.setTooltipDataColumns(this.plotOptions.layers[i].latitude[0].selected);
        this.setTooltipDataColumns(this.plotOptions.layers[i].longitude[0].selected);
    }
};

EChartsMapOptionBuilder.prototype._buildSeries = function (layerIndex) {
    return this.getColumnIndexes(this.plotOptions.layers[layerIndex].colorBy[0].selected, localData.columns);
};

EChartsMapOptionBuilder.prototype._buildSeries = function () {
    var layers = this.plotOptions.layers;

    var series = {};
    var localData = this.getLocalData();

    var i, row, seriesName, seriesItem, seriesKeyList, seriesKey;

    for (var l = 0; l < layers.length; l++) {
        var layer = layers[l];
        var layerType = layer.type;
        var layerName = layers.length >= 1 ? 'Layer ' + (l + 1) : '';

        var keyIndexes = this.getSeriesKeyColumnIndexes(l);

        var latitudeIndex = this.getColumnIndexes(layer.latitude[0].selected, localData.columns)[0];
        var longitudeIndex = this.getColumnIndexes(layer.longitude[0].selected, localData.columns)[0];

        if (!(latitudeIndex >= 0 && longitudeIndex >= 0)) continue;

        for (i in localData.data) {
            row = localData.data[i];

            if (layerName) {
                seriesKeyList = this.getCellText(row, keyIndexes, layerName);
            } else {
                seriesKeyList = this.getCellText(row, keyIndexes);
            }

            seriesKey = seriesKeyList.join(' ');
            seriesItem = this._getSeriesItem(series, seriesKey, layerType);

            series[seriesKey] = seriesItem;
            if (!seriesItem.extractor) {
                seriesItem.extractor = this._newSeriesExtractor(l);
                seriesItem.extractor.keys = this.getCellText(row, keyIndexes);
                seriesItem.keys = seriesItem.extractor.keys;
            }
            seriesItem.extractor.push(row, i);
        }
    }

    this._setSeries(series);
    this._buildSeriesData();
    this.eOptions.series = this.series;
};

EChartsMapOptionBuilder.prototype.getSeriesKeyColumnIndexes = function (layerIndex) {
    var layers = this.plotOptions.layers;
    var localData = this.getLocalData();
    var keyColumns = layers[layerIndex].colorBy.length > 0 ? this.filterNullColumn(layers[layerIndex].colorBy[0].selected) : [];

    return this.getColumnIndexes(keyColumns, localData.columns);
};

EChartsMapOptionBuilder.prototype._newSeriesExtractor = function (layerIndex) {
    var layers = this.plotOptions.layers;
    var layer = layers[layerIndex];
    var layerType = layer.type;

    var extractor;
    if (layerType === 'lines') {
        extractor = this._createMapLinesExtractor(layer);
    } else {
        extractor = this._createPointExtractor(layer);
    }

    return extractor;
};

EChartsMapOptionBuilder.prototype._createMapLinesExtractor = function (layer) {
    var localData = this.getLocalData();
    var latitudeIndexes = this.getColumnIndexes(layer.latitude[0].selected, localData.columns);
    var longitudeIndexes = this.getColumnIndexes(layer.longitude[0].selected, localData.columns);
    var sortByIndexes = this.getColumnIndexes(this.filterNullColumn(layer.sortBy[0].selected), localData.columns);
    var extractor = new _echartsMapLinesExtractor2.default();

    extractor.setTarget({
        index: longitudeIndexes,
        type: 'value',
        isKey: false
    });
    extractor.setTarget({
        index: latitudeIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setSortIndexes(sortByIndexes);
    return extractor;
};

EChartsMapOptionBuilder.prototype._createPointExtractor = function (layer) {
    var localData = this.getLocalData();
    var latitudeIndexes = this.getColumnIndexes(layer.latitude[0].selected, localData.columns);
    var longitudeIndexes = this.getColumnIndexes(layer.longitude[0].selected, localData.columns);
    var sizeByIndexes = this.getColumnIndexes(layer.sizeBy[0].selected, localData.columns);
    var extractor = new _echartsPointExtractor2.default();

    var isKey = sizeByIndexes.length > 0 ? true : false;

    extractor.setTarget({
        index: longitudeIndexes,
        type: 'value',
        isKey: isKey
    });

    extractor.setTarget({
        index: latitudeIndexes,
        type: 'value',
        isKey: isKey
    });

    if (sizeByIndexes.length > 0 && sizeByIndexes[0] >= 0) {

        var aggregation = layer.sizeBy[0].selected[0].aggregation || 'count';

        extractor.setTarget({
            index: sizeByIndexes,
            type: 'value',
            isKey: false
        });

        extractor.setExtractOperator(function (pointObject) {
            var operator = new _aggregationOperator2.default(pointObject.value);
            for (var i = 0; i < pointObject.indexList.length; i++) {
                operator.add(pointObject.indexList[i], pointObject.point[i] ? pointObject.point[i][2] : 1);
            }
            return [{
                value: pointObject.value.concat(operator.calc(aggregation)),
                dataIndexes: pointObject.indexList,
                layer: layer
            }];
        });
    } else {
        extractor.setExtractOperator(function (pointObject) {
            return [{
                value: pointObject.point[0],
                dataIndexes: pointObject.indexList,
                layer: layer
            }];
        });
    }
    return extractor;
};

EChartsMapOptionBuilder.prototype._defaultOptions = function () {
    var opt = {
        tooltip: {
            trigger: 'item',
            showDelay: 0
        },
        toolbox: {
            show: false
        },
        legend: {
            show: false
        }
    };

    $.extend(true, opt.tooltip, this.bOptions.tooltip);
    opt.color = this.bOptions.colorSet;
    opt.grid = this.bOptions.grid;
    opt.geo = this._createGeoOptions();

    return opt;
};

EChartsMapOptionBuilder.prototype._createGeoOptions = function () {
    var mapName = this.plotOptions.mapName;
    var geoOptions = {
        type: 'map',
        map: mapName,
        roam: true
        // label: {
        //     emphasis: {
        //         show: false
        //     }
        // },
        // itemStyle: {
        //     normal: {
        //         borderColor: '#404a59',
        //         areaColor: '#eee'
        //     },
        //     emphasis: {
        //         areaColor: '#eee'
        //     }
        // }
    };
    $.extend(true, geoOptions, this.plotOptions.mapStyle);

    return geoOptions;
};

EChartsMapOptionBuilder.prototype._getSeriesItem = function (series, name, layerType) {
    var seriesItem = series[name];
    if (!seriesItem) {
        seriesItem = this._newSeriesItem(layerType);
        seriesItem.name = name;
    }
    return seriesItem;
};

EChartsMapOptionBuilder.prototype._newSeriesItem = function (layerType) {
    var seriesItem = _echartsOptionBuilder2.default.prototype._newSeriesItem.call(this);
    if (layerType === 'lines') {
        seriesItem.type = 'lines';
    } else {
        seriesItem.type = 'scatter';
        seriesItem.coordinateSystem = "geo";
    }
    return seriesItem;
};

EChartsMapOptionBuilder.prototype._setSeriesDataSortRule = function () {
    var xAxisType = this._getColumnDataType(this.filterNullColumn(this.bOptions.xAxis[0].selected));
    var yAxisType = this._getColumnDataType(this.filterNullColumn(this.bOptions.yAxis[0].selected));

    var sortRule = function sortRule(a, b) {
        var xComp;
        if (xAxisType === 'category') xComp = _optionUtils2.default.stringSortRule(a.value[0], b.value[0]);else if (xAxisType === 'time') xComp = _optionUtils2.default.timeSortRule(a.value[0], b.value[0]);else xComp = _optionUtils2.default.numericSortRule(a.value[0], b.value[0]);

        if (xComp === 0) {
            var yComp;
            if (yAxisType === 'category') yComp = _optionUtils2.default.stringSortRule(a.value[1], b.value[1]);else if (yAxisType === 'time') yComp = _optionUtils2.default.timeSortRule(a.value[1], b.value[1]);else yComp = _optionUtils2.default.numericSortRule(a.value[1], b.value[1]);
            return yComp;
        } else {
            return xComp;
        }
    };

    this._seriesDataSortRule = sortRule;
};

exports.default = EChartsMapOptionBuilder;

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsExtractor = __webpack_require__(29);

var _echartsExtractor2 = _interopRequireDefault(_echartsExtractor);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MapLinesExtractor() {
    _echartsExtractor2.default.call(this);
    this._pointerList = [];
    this._sortIndexes = [];
}

MapLinesExtractor.prototype = Object.create(_echartsExtractor2.default.prototype);
MapLinesExtractor.prototype.constructor = MapLinesExtractor;

MapLinesExtractor.prototype.setSortIndexes = function (sortIndexes) {
    this._sortIndexes = sortIndexes;
};

MapLinesExtractor.prototype.push = function (row, rowIndex) {
    var pointer = { point: [], indexList: [], sortList: [] };
    var index = Number(rowIndex);
    var value;
    var prePointList = [];
    var currentPointList = [];
    var indexes;

    for (var i = 0; i < this._columnIndices.length; i++) {
        indexes = this._columnIndices[i];
        prePointList = currentPointList.concat([]);
        currentPointList = [];
        for (var j = 0; j < indexes.length; j++) {
            value = this._getPointValue(row, indexes[j], index);
            if (prePointList.length === 0) {
                currentPointList.push([value]);
            } else {
                for (var k = 0; k < prePointList.length; k++) {
                    currentPointList.push(prePointList[k].concat([value]));
                }
            }
        }
    }

    for (var s = 0; s < this._sortIndexes.length; s++) {
        pointer.sortList.push(row[this._sortIndexes[s]]);
    }

    pointer.point = currentPointList;
    pointer.indexList.push(index);
    this._pointerList.push(pointer);
};

MapLinesExtractor.prototype._getPointValue = function (row, columnIndex) {
    return row[columnIndex];
};

MapLinesExtractor.prototype.extract = function () {
    var _this = this;
    var answer = [];

    if (this._pointerList.length <= 1) return answer;

    if (this._sortIndexes.length > 0) {
        this._pointerList.sort(function (a, b) {
            for (var sortIndex = 0; sortIndex < a.sortList.length; sortIndex++) {
                if (a.sortList[sortIndex] > b.sortList[sortIndex]) {
                    return 1;
                } else if (a.sortList[sortIndex] < b.sortList[sortIndex]) {
                    return -1;
                } else if (sortIndex + 1 === a.sortList.length) {
                    return 1;
                }
            }
        });
    }

    for (var i = 1; i < this._pointerList.length; i++) {
        var fromPointer = this._pointerList[i].point[0];
        var toPointer = this._pointerList[i - 1].point[0];
        answer.push({
            coords: [[fromPointer[0], fromPointer[1]], [toPointer[0], toPointer[1]]]
        });
    }
    return answer;
};

exports.default = MapLinesExtractor;

/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsWrapper = __webpack_require__(13);

var _echartsWrapper2 = _interopRequireDefault(_echartsWrapper);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

var _echartsDonutOptionBuilder = __webpack_require__(312);

var _echartsDonutOptionBuilder2 = _interopRequireDefault(_echartsDonutOptionBuilder);

var _echartsDonutCalculatedOptionBuilder = __webpack_require__(313);

var _echartsDonutCalculatedOptionBuilder2 = _interopRequireDefault(_echartsDonutCalculatedOptionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: echarts-donut.js
 * Created by daewon.park on 2017-03-30.
 */

function EChartsDonut(parentId, options) {
    _echartsWrapper2.default.call(this, parentId, options);
}

EChartsDonut.prototype = Object.create(_echartsWrapper2.default.prototype);
EChartsDonut.prototype.constructor = EChartsDonut;

EChartsDonut.prototype.objectWithKeySorted = function (object) {
    var sortable = [];
    var newObj = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) sortable.push([key, object[key]]);
    }sortable.sort(function (a, b) {
        var x = a[1].name,
            y = b[1].name;
        if (Number(x)) x = Number(x);
        if (Number(y)) y = Number(y);
        return x < y ? -1 : x > y ? 1 : 0;
    });

    for (var i in sortable) {
        newObj.push(sortable[i][1]);
    }
    return newObj;
};

EChartsDonut.prototype.render = function () {
    if (this.options.source.localData[0].dataType === 'chartdata') {
        this.seriesHelper = new _echartsDonutCalculatedOptionBuilder2.default();
    } else {
        this.seriesHelper = new _echartsDonutOptionBuilder2.default();
    }
    var opt = this.seriesHelper.buildOptions(this.options);
    opt.series[0].data = this.objectWithKeySorted(opt.series[0].data);
    this._bindInternalOptions(this.seriesHelper);
    this._doDataValidation(opt);
    this._setEChartOption(opt);
    this._backupItemStyles();
};

EChartsDonut.prototype._doDataValidation = function (opt) {
    _chartUtils2.default.limitMaxSeriesSize(opt.series);
};

EChartsDonut.prototype.getLegendData = function () {
    var legendData = [];

    var legendSelection = this._getEChartOption().legend[0].selected;
    var keyColumns = this.seriesHelper.getColorByColumns();
    if (keyColumns.length > 0) {
        var opt = this.seriesHelper.eOptions;
        if (opt.series.length > 0) {
            for (var i in opt.series[0].data) {
                var item = {
                    name: opt.series[0].data[i].name,
                    symbol: 'square',
                    color: opt.color[parseFloat(i) % opt.color.length]
                };
                if (typeof legendSelection[item.name] === 'undefined') {
                    item.selected = true;
                } else {
                    item.selected = legendSelection[item.name];
                }
                legendData.push(item);
            }
        }
    }

    return legendData;
};

exports.default = EChartsDonut;

/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _aggregationOperator = __webpack_require__(15);

var _aggregationOperator2 = _interopRequireDefault(_aggregationOperator);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EchartsDonutOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EchartsDonutOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EchartsDonutOptionBuilder.prototype.constructor = EchartsDonutOptionBuilder;

EchartsDonutOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['radius', 'itemStyle', 'label', 'silent', 'center'];
    this._registerDecorator('tooltipPie');
    this._registerDecorator('plotOptions');
    this._registerDecorator('axisRemoval');
    this._registerDecorator('brushRemoval');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.plotOptions.donut.sizeBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.colorBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.donut.sizeBy[0].selected);
};

EchartsDonutOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var dataColumns = this.getSeriesDataColumns(0);
    var aggregation = 'count';
    if (dataColumns[dataColumns.length - 1] !== null && dataColumns[dataColumns.length - 1].aggregation && dataColumns[dataColumns.length - 1].aggregation !== 'none') aggregation = dataColumns[dataColumns.length - 1].aggregation;
    var colorByIndexes = this.getColumnIndexes(this.bOptions.colorBy[0].selected, localData.columns);
    var sizeByIndexes = this.getColumnIndexes(this.bOptions.plotOptions.donut.sizeBy[0].selected, localData.columns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: colorByIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: sizeByIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var operator = new _aggregationOperator2.default(pointObject.value);
        for (var i = 0; i < pointObject.indexList.length; i++) {
            operator.add(pointObject.indexList[i], pointObject.point[i] ? pointObject.point[i][pointObject.point[i].length - 1] : 1);
        }
        return [{
            keys: pointObject.value,
            name: pointObject.value.join(' '),
            value: Math.abs(operator.calc(aggregation)),
            dataIndexes: pointObject.indexList,
            minusValue: operator.calc(aggregation) < 0 ? true : false
        }];
    });

    return extractor;
};

EchartsDonutOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'pie',
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    return seriesItem;
};

exports.default = EchartsDonutOptionBuilder;

/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echartsOptionBuilder = __webpack_require__(9);

var _echartsOptionBuilder2 = _interopRequireDefault(_echartsOptionBuilder);

var _echartsPointExtractor = __webpack_require__(10);

var _echartsPointExtractor2 = _interopRequireDefault(_echartsPointExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EchartsDonutCalculatedOptionBuilder() {
    _echartsOptionBuilder2.default.call(this);
}

EchartsDonutCalculatedOptionBuilder.prototype = Object.create(_echartsOptionBuilder2.default.prototype);
EchartsDonutCalculatedOptionBuilder.prototype.constructor = EchartsDonutCalculatedOptionBuilder;

EchartsDonutCalculatedOptionBuilder.prototype._setUpOptions = function () {
    this.plotOptionAttributes = ['radius', 'itemStyle', 'label', 'silent', 'center'];
    this._registerDecorator('tooltipPieCalculated');
    this._registerDecorator('plotOptions');
    this._registerDecorator('axisRemoval');
    this._registerDecorator('brushRemoval');
    this.setSeriesKeyColumns([]);
    this.setSeriesDataColumns(this.bOptions.colorBy[0].selected);
    this.setSeriesDataColumns(this.bOptions.plotOptions.donut.sizeBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.colorBy[0].selected);
    this.setTooltipDataColumns(this.bOptions.plotOptions.donut.sizeBy[0].selected);
};

EchartsDonutCalculatedOptionBuilder.prototype._newSeriesExtractor = function () {
    var localData = this.getLocalData(0);
    var colorByIndexes = this.getColumnIndexes([{ name: 'colorBy' }], localData.chartColumns);
    var sizeByIndexes = this.getColumnIndexes([{ name: 'sizeBy' }], localData.chartColumns);

    var extractor = new _echartsPointExtractor2.default();

    extractor.setTarget({
        index: colorByIndexes,
        type: 'category',
        isKey: true
    });

    extractor.setTarget({
        index: sizeByIndexes,
        type: 'value',
        isKey: false
    });

    extractor.setExtractOperator(function (pointObject) {
        var pointValue = pointObject.value;
        var names = [];
        for (var i in pointValue) {
            if ($.isArray(pointValue[i])) {
                for (var v in pointValue[i]) {
                    names.push(pointValue[i][v]);
                }
            } else {
                names.push(pointValue[i]);
            }
        }

        return [{
            keys: pointObject.value,
            name: names.join(' '),
            value: Math.abs(pointObject.point[0][1]),
            dataIndexes: pointObject.indexList,
            minusValue: pointObject.point[0][1] < 0 ? true : false
        }];
    });

    return extractor;
};

EchartsDonutCalculatedOptionBuilder.prototype._newSeriesItem = function () {
    var seriesItem = {
        type: 'pie',
        animationDuration: this.bOptions.chart.animationDuration,
        large: true,
        largeThreshold: 5000,
        data: []
    };

    return seriesItem;
};

exports.default = EchartsDonutCalculatedOptionBuilder;

/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartAreaStacked = __webpack_require__(166);

var _bchartAreaStacked2 = _interopRequireDefault(_bchartAreaStacked);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-area-stacked100.js
 * Created by daewon.park on 2017-04-12.
 */
function BAreaStacked100Charts(parentId, options) {
    _bchartAreaStacked2.default.call(this, parentId, options);
}

BAreaStacked100Charts.prototype = Object.create(_bchartAreaStacked2.default.prototype);
BAreaStacked100Charts.prototype.constructor = BAreaStacked100Charts;

BAreaStacked100Charts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BAreaStacked100Charts.Attr.Key, this.$parent, this.options);
};

BAreaStacked100Charts.Attr = Object.assign({}, _bchartAreaStacked2.default.Attr, {
    Key: 'area-stacked-100',
    Label: '100% Stacked Area',
    Order: 32
});

exports.default = BAreaStacked100Charts;

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBarStacked = __webpack_require__(168);

var _bchartBarStacked2 = _interopRequireDefault(_bchartBarStacked);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-bar-stacked100.js
 * Created by daewon.park on 2017-04-19.
 */
function BBarStacked100Charts(parentId, options) {
    _bchartBarStacked2.default.call(this, parentId, options);
}

BBarStacked100Charts.prototype = Object.create(_bchartBarStacked2.default.prototype);
BBarStacked100Charts.prototype.constructor = BBarStacked100Charts;

BBarStacked100Charts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BBarStacked100Charts.Attr.Key, this.$parent, this.options);
};

BBarStacked100Charts.Attr = Object.assign({}, _bchartBarStacked2.default.Attr, {
    Key: 'bar-stacked-100',
    Label: '100% Stacked Bar',
    Order: 22
});

exports.default = BBarStacked100Charts;

/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-biplot.js
 * Created by daewon.park on 2017-04-24.
 */
function BBiplotCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BBiplotCharts.prototype = Object.create(_bchartBase2.default.prototype);
BBiplotCharts.prototype.constructor = BBiplotCharts;

BBiplotCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BBiplotCharts.Attr.Key, this.$parent, this.options);
};

//TODO: Biplot에서는 filter가 적용되지 않도록 하는 꽁수, 이후에 수정이 필요함
BBiplotCharts.prototype._lazyLoad = function (doneCallback, failCallback) {
    var _this = this;
    _this.chartInstanceId = _this.chartInstanceId || Date.now();
    _this.options.source.localData = [];
    _this._stopCurrentJob();
    _this._initFilter();

    for (var i = 0; i < _this.options.source.lazyData.length; i++) {
        if (typeof _this.options.source.lazyData[i].data === 'function') {
            var prepare = {
                chartInstanceId: _this.chartInstanceId + '-' + i,
                uid: Date.now(),
                index: i,
                options: {
                    chart: $.extend(true, {}, _this.options.chart),
                    xAxis: $.extend(true, {}, _this.options.xAxis),
                    yAxis: $.extend(true, {}, _this.options.yAxis),
                    colorBy: $.extend(true, {}, _this.options.colorBy),
                    plotOptions: $.extend(true, {}, _this.options.plotOptions)
                },
                fail: function fail(err) {
                    if (failCallback) failCallback(err);
                    delete _this.currentJob[this.uid];
                },
                done: function done(result) {
                    _this.options.source.localData[this.index] = _this.options.source.localData[this.index] || {};

                    _this.options.source.localData[this.index].dataType = result.dataType;
                    _this.options.source.localData[this.index].chartColumns = result.columns;

                    _this.options.source.localData[this.index].count = result.count;
                    _this.options.source.localData[this.index].offset = result.offset;

                    _this.options.source.localData[this.index].columns = _optionUtils2.default.getColumnList(_this.options.source, this.index);

                    _this.options.source.localData[this.index].data = result.data;

                    if (result.data.length === 0) {
                        failCallback(_this.options.noDataMessage != '' ? [_this.options.noDataMessage] : ['No data to display']);
                    } else if (doneCallback) doneCallback();
                    delete _this.currentJob[this.uid];
                }
            };
            _this.currentJob[prepare.uid] = prepare;
            _this.options.source.lazyData[i].data(prepare);
        } else {
            throw 'Callback function for data loading is not defined.';
        }
    }
};

//TODO: axis chart option control 구현 후 주석 해제 mk90.kim
// BBiplotCharts.prototype._createAxisTitle = function () {
//     BBaseCharts.prototype._createAxisTitle.export default
//     var _this = this;
//     this.x2AxisTitle = new Component.AxisTitle(this.$parent, function () {
//         return _this.options.xAxis[1].title
//     });
//     this.y2AxisTitle = new Component.AxisTitle(this.$parent, function () {
//         return _this.options.yAxis[1].title;
//     });
// };
//
// BBiplotCharts.prototype._destroyAxisTitle = function () {
//     BBaseCharts.prototype._destroyAxisTitle.export default
//     if (this.x2AxisTitle) {
//         this.x2AxisTitle.destroy();
//         this.x2AxisTitle = null;
//     }
//     if (this.y2AxisTitle) {
//         this.y2AxisTitle.destroy();
//         this.y2AxisTitle = null;
//     }
// };
//
//
// BBiplotCharts.prototype._renderFrame = function () {
//     BBaseCharts.prototype._renderFrame.export default
//     if (this.x2AxisTitle) {
//         this.x2AxisTitle.render(this.options.xAxis[1]);
//     }
//     if (this.y2AxisTitle) {
//         this.y2AxisTitle.render(this.options.yAxis[1]);
//     }
// };


BBiplotCharts.Attr = {
    Key: 'biplot',
    Label: 'Biplot',
    Order: 33,
    ColumnConf: {
        //FIXME: default axis 합의후 수정필요
        lineXAxis: {
            label: 'Line X-axis',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        },
        lineYAxis: {
            label: 'Line Y-axis',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        },
        //TODO: color by 구현필요
        // lineColorBy: {
        //     aggregationEnabled: false,
        //     multiple: true
        // },
        lineLabelBy: {
            label: 'Line Label By',
            aggregationEnabled: false
        },
        scatterXAxis: {
            label: 'Scatter X-axis',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        },
        scatterYAxis: {
            label: 'Scatter Y-axis',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        },
        //TODO: color by 구현필요
        // scatterColorBy: {
        //     aggregationEnabled: false,
        //     multiple: true
        // },
        scatterLabelBy: {
            label: 'Scatter Label By',
            aggregationEnabled: false
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false
        },
        xAxis: [{
            selected: [] //line
            // axisTick: {show: false}
        }, {
            selected: [], //scatter
            // axisTick: {show: false},
            title: $.extend(true, {}, _defaultOptions2.default.Title, { left: '50%', top: '18px' }),
            axisLabel: {
                textStyle: {
                    color: 'red'
                }
            }
        }],
        yAxis: [{
            selected: [] //line
            // axisTick: {show: false}
        }, {
            selected: [], //scatter
            // axisTick: {show: false},
            title: $.extend(true, {}, _defaultOptions2.default.Title, { right: '-40px', top: '50%', rotate: 90 }),
            axisLabel: {
                textStyle: {
                    color: 'red'
                }
            }
        }],
        // colorBy: [{
        //     selected: []    //not use
        // }, {
        //     selected: []
        // }],
        plotOptions: {
            component: {
                labelBy: [{
                    selected: []
                }]
            },
            projection: {
                labelBy: [{
                    selected: []
                }]
            }
        }
    })
};

BBiplotCharts.prototype.setOptions = function (options) {
    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    this._changeOptions(options);
    this.render(reload);
};

BBiplotCharts.prototype.isReload = function (options) {
    var result = false;
    if (options.source) {
        result = true;
        if (options.source.dataType === 'local') {
            this.chart.clear();
            this.options.source = options.source;
        } else if (options.source.dataType === 'lazy' && !this.options.source.lazyData[0].data && !this.options.source.lazyData[1].data) {
            result = false;
        }
    }
    return result;
};

exports.default = BBiplotCharts;

/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _bchartRegister = __webpack_require__(26);

var ChartRegistry = _interopRequireWildcard(_bchartRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-boxplot.js
 * Created by daewon.park on 2017-03-30.
 */
function BBoxPlotCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BBoxPlotCharts.prototype = Object.create(_bchartBase2.default.prototype);
BBoxPlotCharts.prototype.constructor = BBoxPlotCharts;

BBoxPlotCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BBoxPlotCharts.Attr.Key, this.$parent, this.options);
};

BBoxPlotCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            boxplot: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isChanged(this.options.plotOptions.boxplot.separateColor, options.plotOptions.boxplot.separateColor);
    this._changeOptions(options);
    this.render(reload);
};

BBoxPlotCharts.prototype._reloadColumnConf = function () {
    var columnConf = ChartRegistry.getChartAttr('boxplot').ColumnConf;
    if (this.options.xAxis[0].axisType) {
        columnConf.yAxis.multiple = true;
    } else {
        columnConf.yAxis.multiple = false;
    }
};

BBoxPlotCharts.Attr = {
    Key: 'boxplot',
    Label: 'Box plot',
    Order: 2,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            axisTypeList: ['byColumnNames'],
            columnType: ['string', 'number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        plotOptions: {
            boxplot: {
                separateColor: false
            }
        }
    })
};

exports.default = BBoxPlotCharts;

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-bubble.js
 * Created by ji_sung.park on 2017-09-05
 */
function BBubbleCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BBubbleCharts.prototype = Object.create(_bchartBase2.default.prototype);
BBubbleCharts.prototype.constructor = BBubbleCharts;

BBubbleCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BBubbleCharts.Attr.Key, this.$parent, this.options);
};

BBubbleCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            bubble: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.bubble.sizeBy, options.plotOptions.bubble.sizeBy);
    this._changeOptions(options);
    this.render(reload);
};

BBubbleCharts.Attr = {
    Key: 'bubble',
    Label: 'Bubble Chart',
    Order: 51,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: false,
            columnType: ['number', 'string'],
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true
        },
        sizeBy: {
            label: 'Size By',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            multiple: false,
            columnType: ['number', 'string']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                // brush: {},
                zoom: { zoomAxis: 'all' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            bubble: {
                marker: _defaultOptions2.default.Marker,
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                sizeBy: [{
                    selected: []
                }]
            }
        },
        xAxis: [{
            scale: true
        }],
        yAxis: [{
            scale: true
        }]
    })
};

exports.default = BBubbleCharts;

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BCardCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Created by sds on 2018-03-26.
   */


BCardCharts.prototype = Object.create(_bchartBase2.default.prototype);
BCardCharts.prototype.constructor = BCardCharts;

BCardCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createAxisTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BCardCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BCardCharts.Attr.Key, this.$parent, this.options);
};

BCardCharts.prototype._renderFrame = function () {
    if (this.title) {

        this.title.render(this.options.title.text);
    }

    if (this.toolbar) {
        this.toolbar.render();
    }
};

BCardCharts.prototype._lazyRenderTitle = function () {
    if (this.title) {
        var valueTitle = this.options.title.text ? this.options.title.text : _optionUtils2.default.getColumnLabel(this.options.plotOptions.card.valueBy[0].selected[0]);
        this.title.render(valueTitle, this.options.source.localData);
    }
};

BCardCharts.prototype.setOptions = function (options) {
    var reload = this.isReload(options);
    if (options.plotOptions) {
        if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.card.valueBy, options.plotOptions.card.valueBy);
        if (!reload) reload |= this._isChanged(this.options.plotOptions.card.label, options.plotOptions.card.label);
        if (!reload) reload |= this._isChanged(this.options.plotOptions.card.leng, options.plotOptions.card.leng);
    }
    this._changeOptions(options);
    this.render(reload);
};

exports.default = BCardCharts;


BCardCharts.Attr = {
    Key: 'card',
    Label: 'Card',
    Order: 74,
    ColumnConf: {
        valueBy: {
            label: 'Value',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['NONE', 'SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX'])
            },
            columnType: ['number'],
            mandatory: true
        },
        leng: {
            source: [{ label: "0", value: "0" }, { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" }, { label: "5", value: "5" }]
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false
        },
        plotOptions: {
            card: {
                label: {
                    normal: {
                        formatter: function formatter(params) {
                            return params.value;
                        },
                        show: true,
                        position: 'inside',
                        textStyle: {
                            color: 'black',
                            fontSize: 24
                        }
                    }
                },
                valueBy: [{
                    selected: []
                }],
                leng: [{
                    selected: "0"
                }]
            }
        }
    })
};

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartColumnStacked = __webpack_require__(169);

var _bchartColumnStacked2 = _interopRequireDefault(_bchartColumnStacked);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-column-stacked100.js
 * Created by daewon.park on 2017-04-19.
 */
function BColumnStacked100Charts(parentId, options) {
    _bchartColumnStacked2.default.call(this, parentId, options);
}

BColumnStacked100Charts.prototype = Object.create(_bchartColumnStacked2.default.prototype);
BColumnStacked100Charts.prototype.constructor = BColumnStacked100Charts;

BColumnStacked100Charts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BColumnStacked100Charts.Attr.Key, this.$parent, this.options);
};

BColumnStacked100Charts.Attr = Object.assign({}, _bchartColumnStacked2.default.Attr, {
    Key: 'column-stacked-100',
    Label: '100% Stacked Column',
    Order: 12
});

exports.default = BColumnStacked100Charts;

/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _chartComponent = __webpack_require__(32);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BComplexCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-complex.js
   * Created by daewon.park on 2017-12-07.
   */

BComplexCharts.prototype = Object.create(_bchartBase2.default.prototype);
BComplexCharts.prototype.constructor = BComplexCharts;

BComplexCharts.prototype._createAxisTitle = function () {
    var _this = this;
    this.xAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.xAxis[0].title;
    });
    this.yAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.complex[0].yAxis[0].title;
    });
    this.y2AxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.complex[1].yAxis[0].title;
    });
};

BComplexCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BComplexCharts.Attr.Key, this.$parent, this.options);
};

BComplexCharts.prototype.setOptions = function (options) {
    //todo : setOption 조건에 따라 Render 여부 로직 추가 필요
    // var reload = 0;
    // if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    // if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    // if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    this._changeOptions(options);
    this.render(1);
};

BComplexCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }
    if (this.xAxisTitle) {
        this.xAxisTitle.render(this.options.xAxis[0]);
    }
    if (this.yAxisTitle) {
        this.yAxisTitle.render(this.options.complex[0].yAxis[0]);
    }
    if (this.y2AxisTitle) {
        this.y2AxisTitle.render(this.options.complex[1].yAxis[0]);
    }
    if (this.toolbar) {
        this.toolbar.render();
        this._configureToolbar();
    }
};

BComplexCharts.prototype._configureToolbar = function () {};

BComplexCharts.Attr = {
    Key: 'complex',
    Label: 'Complex Chart',
    Order: 63,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            multiple: false,
            mandatory: true
        },
        yAxis: {
            scatter: {
                label: 'Y-axis',
                aggregationEnabled: true,
                multiple: false,
                aggregationMap: {
                    number: _const2.default.extendAggregation(['NONE', 'SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                    string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
                },
                mandatory: true
            },
            line: {
                label: 'Y-axis',
                aggregationEnabled: true,
                multiple: false,
                aggregationMap: {
                    number: _const2.default.extendAggregation(['NONE', 'SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                    string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
                },
                mandatory: true
            },
            column: {
                label: 'Y-axis',
                aggregationEnabled: true,
                multiple: false,
                aggregationMap: {
                    number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                    string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
                },
                mandatory: true
            }
        },
        colorBy: {
            scatter: {
                label: 'Color By',
                multiple: true
            },
            line: {
                label: 'Color By',
                multiple: true
            },
            column: {
                label: 'Color By',
                multiple: true
            }
        },
        lineBy: {
            line: {
                label: 'Line By',
                aggregationEnabled: false,
                multiple: true
            }
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        // toolbar: {
        //     show: true,
        //     menu: {
        //         // brush: {},
        //         // zoom: {}
        //     }
        // },
        complex: [{
            chart: {
                type: 'scatter'
            },
            yAxis: [{
                selected: [],
                title: $.extend(true, {}, _defaultOptions2.default.Title, { left: '8px', top: '50%', rotate: -90 }),
                axisTick: { show: true },
                axisLabel: _defaultOptions2.default.AxisLabel,
                zlevel: 1
            }],
            colorBy: [{
                selected: []
            }],
            plotOptions: {
                line: {
                    lineBy: [{
                        selected: []
                    }]
                }
            }
        }, {
            chart: {
                type: 'scatter'
            },
            yAxis: [{
                selected: [],
                title: $.extend(true, {}, _defaultOptions2.default.Title, { right: '8px', top: '50%', rotate: 90 }),
                axisTick: { show: true },
                axisLabel: _defaultOptions2.default.AxisLabel,
                zlevel: 1
            }],
            colorBy: [{
                selected: []
            }],
            plotOptions: {
                line: {
                    lineBy: [{
                        selected: []
                    }]
                }
            }
        }],
        plotOptions: {
            line: {
                marker: _defaultOptions2.default.Marker,
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine
            },
            scatter: {
                marker: $.extend({}, _defaultOptions2.default.Marker, { symbolSize: 10 }),
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine
            },
            column: {
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine
            }
        }
    })
};

exports.default = BComplexCharts;

/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BDecisionTreeCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-area.js
   * Created by daewon.park on 2017-03-28.
   */


BDecisionTreeCharts.prototype = Object.create(_bchartBase2.default.prototype);
BDecisionTreeCharts.prototype.constructor = BDecisionTreeCharts;

BDecisionTreeCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BDecisionTreeCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BDecisionTreeCharts.Attr.Key, this.$parent, this.options);
};

BDecisionTreeCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }

    if (this.toolbar) {
        this.toolbar.render();
    }
};

BDecisionTreeCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            decisionTree: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.decisionTree.fromColumn, options.plotOptions.decisionTree.fromColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.decisionTree.toColumn, options.plotOptions.decisionTree.toColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.decisionTree.groupByColumn, options.plotOptions.decisionTree.groupByColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.decisionTree.nodeLabelColumn, options.plotOptions.decisionTree.nodeLabelColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.decisionTree.linkLabelColumn, options.plotOptions.decisionTree.linkLabelColumn);
    this._changeOptions(options);
    this.render(reload);
};

BDecisionTreeCharts.Attr = {
    Key: 'decisionTree',
    Label: 'Decision Tree',
    Order: 52,
    ColumnConf: {
        fromColumn: {
            aggregationEnabled: false,
            label: 'From Column',
            mandatory: true
        },
        toColumn: {
            label: 'To Column',
            aggregationEnabled: false,
            multiple: true,
            multipleMaxCnt: 2,
            mandatory: true
        },
        groupByColumn: {
            label: 'GroupBy Column',
            aggregationEnabled: false,
            multiple: true
        },
        nodeLabelColumn: {
            label: 'Node Label',
            aggregationEnabled: false,
            multiple: true
        },
        linkLabelColumn: {
            label: 'Link Label',
            aggregationEnabled: false,
            multiple: false
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false
        },
        plotOptions: {
            decisionTree: {
                fromColumn: [{
                    selected: []
                }],
                toColumn: [{
                    selected: []
                }],
                groupByColumn: [{
                    selected: []
                }],
                nodeLabelColumn: [{
                    selected: []
                }],
                linkLabelColumn: [{
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

exports.default = BDecisionTreeCharts;

/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _chartComponent = __webpack_require__(32);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BDendrogramCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BDendrogramCharts.prototype = Object.create(_bchartBase2.default.prototype);
BDendrogramCharts.prototype.constructor = BDendrogramCharts;

BDendrogramCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BDendrogramCharts.Attr.Key, this.$parent, this.options);
};

BDendrogramCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            dendrogram: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.dendrogram.clusterGroupColumn, options.plotOptions.dendrogram.clusterGroupColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.dendrogram.clusterColumn, options.plotOptions.dendrogram.clusterColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.dendrogram.heightColumn, options.plotOptions.dendrogram.heightColumn);
    this._changeOptions(options);
    this.render(reload);
};

BDendrogramCharts.prototype._createAxisTitle = function () {
    var _this = this;
    this.xAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.plotOptions.dendrogram.clusterGroupColumn[0].title;
    });
    this.yAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.plotOptions.dendrogram.heightColumn[0].title;
    });
};

BDendrogramCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }
    if (this.xAxisTitle) {
        this.xAxisTitle.render(this.options.plotOptions.dendrogram.clusterGroupColumn[0]);
    }
    if (this.yAxisTitle) {
        this.yAxisTitle.render(this.options.plotOptions.dendrogram.heightColumn[0]);
    }
    if (this.toolbar) {
        this.toolbar.render();
    }
};

BDendrogramCharts.Attr = {
    Key: 'dendrogram',
    Label: 'Dendrogram',
    Order: 53,
    ColumnConf: {
        clusterGroupColumn: {
            label: 'Cluster Group',
            aggregationEnabled: false,
            mandatory: true
        },
        clusterColumn: {
            label: 'Clusters',
            aggregationEnabled: false,
            multiple: true,
            mandatory: true
        },
        heightColumn: {
            label: 'Height',
            aggregationEnabled: false,
            mandatory: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        plotOptions: {
            dendrogram: {
                clusterGroupColumn: [{
                    selected: [],
                    title: $.extend(true, {}, _defaultOptions2.default.Title, { left: '50%', bottom: '8px' }),
                    axisLabel: {
                        show: true,
                        rotate: 0,
                        textStyle: {
                            color: '#000000',
                            fontSize: 12,
                            fontFamily: ''
                        }
                    }
                }],
                clusterColumn: [{
                    selected: []
                }],
                heightColumn: [{
                    selected: [],
                    title: $.extend(true, {}, _defaultOptions2.default.Title, { left: '8px', top: '50%', rotate: -90 }),
                    axisLabel: {
                        show: true,
                        rotate: 0,
                        textStyle: {
                            color: '#000000',
                            fontSize: 12,
                            fontFamily: ''
                        }
                    }
                }],
                tooltip: { trigger: 'axis' }
            }
        }
    })
};

exports.default = BDendrogramCharts;

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartHeatmap = __webpack_require__(170);

var _bchartHeatmap2 = _interopRequireDefault(_bchartHeatmap);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BHeatmapMatrixCharts(parentId, options) {
    _bchartHeatmap2.default.call(this, parentId, options);
} /**
   * Source: bchart-heatmap.js
   * Created by daewon.park on 2017-04-16.
   */


BHeatmapMatrixCharts.prototype = Object.create(_bchartHeatmap2.default.prototype);
BHeatmapMatrixCharts.prototype.constructor = BHeatmapMatrixCharts;

BHeatmapMatrixCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BHeatmapMatrixCharts.Attr.Key, this.$parent, this.options);
};

BHeatmapMatrixCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            heatmap: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    this._changeOptions(options);
    this.render(reload);
};

BHeatmapMatrixCharts.Attr = {
    Key: 'heatmap-matrix',
    Label: 'Heat map(Matrix)',
    Order: 41,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: false,
            columnType: ['string', 'number']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        visualMap: _defaultOptions2.default.VisualMap,
        plotOptions: {
            heatmap: {}
        }
    })
};

exports.default = BHeatmapMatrixCharts;

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartColumn = __webpack_require__(55);

var _bchartColumn2 = _interopRequireDefault(_bchartColumn);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _chartComponent = __webpack_require__(32);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-histogram.js
 * Created by daewon.park on 2017-07-26.
 */
function BHistogramCharts(parentId, options) {
    _bchartColumn2.default.call(this, parentId, options);
}

BHistogramCharts.prototype = Object.create(_bchartColumn2.default.prototype);
BHistogramCharts.prototype.constructor = BHistogramCharts;

BHistogramCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BHistogramCharts.Attr.Key, this.$parent, this.options);
};

BHistogramCharts.prototype._createAxisTitle = function () {
    var _this = this;
    this.xAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.xAxis[0].title;
    });

    this.yAxisTitle = new _chartComponent.AxisTitle(this.$parent, function () {
        return _this.options.yAxis[0].title;
    });
};

BHistogramCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }
    if (this.xAxisTitle) {
        this.xAxisTitle.render(this.options.xAxis[0]);
    }
    if (this.yAxisTitle) {
        var title;
        if (this.options.yAxis[0] && this.options.yAxis[0].title && this.options.yAxis[0].title.text) {
            title = this.options.yAxis[0].title.text;
        } else {
            title = 'Count';
        }

        this.yAxisTitle.render(title);
    }
    if (this.toolbar) {
        this.toolbar.render();
    }
};

BHistogramCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            column: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.column.binMethod, options.plotOptions.column.binMethod);
    this._changeOptions(options);
    this.render(reload);
};

BHistogramCharts.Attr = {
    Key: 'histogram',
    Label: 'Histogram',
    Order: 1,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        plotOptions: {
            column: {
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine
            }
        }
    })
};

exports.default = BHistogramCharts;

/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _bchartRegister = __webpack_require__(26);

var ChartRegistry = _interopRequireWildcard(_bchartRegister);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BLineCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-line.js
   * Created by daewon.park on 2017-03-28.
   */


BLineCharts.prototype = Object.create(_bchartBase2.default.prototype);
BLineCharts.prototype.constructor = BLineCharts;

BLineCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BLineCharts.Attr.Key, this.$parent, this.options);
};

BLineCharts.prototype._reloadColumnConf = function () {
    var columnConf = ChartRegistry.getChartAttr('line').ColumnConf;
    if (this.options.xAxis[0].axisType) {
        columnConf.yAxis.aggregationEnabled = false;
        columnConf.yAxis.columnType = ['number'];
    } else {
        columnConf.yAxis.aggregationEnabled = true;
        columnConf.yAxis.columnType = ['number', 'string'];
    }
};

BLineCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            line: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.line.lineBy, options.plotOptions.line.lineBy);
    if (!reload) reload |= this._isChanged(this.options.plotOptions.line.trendLine, options.plotOptions.line.trendLine);
    this._changeOptions(options);
    this.render(reload);
};

BLineCharts.Attr = {
    Key: 'line',
    Label: 'Line',
    Order: 3,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            axisTypeList: ['byColumnNames', 'byRowIndex'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: true,
            multiple: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['NONE', 'SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true
        },
        lineBy: {
            label: 'Line By',
            aggregationEnabled: false,
            multiple: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                // brush: {},
                zoom: { zoomAxis: 'xAxis' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            line: {
                marker: _defaultOptions2.default.Marker,
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                lineBy: [{
                    selected: []
                }],
                tooltip: { trigger: 'axis' }
            }
        },
        xAxis: [{
            scale: true
        }],
        yAxis: [{
            scale: true
        }]
    })
};

exports.default = BLineCharts;

/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-area.js
 * Created by daewon.park on 2017-03-28.
 */
function BNetworkCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BNetworkCharts.prototype = Object.create(_bchartBase2.default.prototype);
BNetworkCharts.prototype.constructor = BNetworkCharts;

BNetworkCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BNetworkCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BNetworkCharts.Attr.Key, this.$parent, this.options);
};

BNetworkCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }

    if (this.toolbar) {
        this.toolbar.render();
    }
};

BNetworkCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            network: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.network.fromColumn, options.plotOptions.network.fromColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.network.toColumn, options.plotOptions.network.toColumn);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.network.nodeSizeBy, options.plotOptions.network.nodeSizeBy);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.network.style, options.plotOptions.network.style);
    this._changeOptions(options);
    this.render(reload);
};

BNetworkCharts.Attr = {
    Key: 'network',
    Label: 'Network',
    Order: 43,
    ColumnConf: {
        fromColumn: {
            label: 'From Column',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        toColumn: {
            label: 'To Column',
            aggregationEnabled: false,
            columnType: ['string', 'number'],
            mandatory: true
        },
        nodeSizeBy: {
            label: 'Node Size By',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false
        },
        plotOptions: {
            network: {
                fromColumn: [{
                    selected: []
                }],
                toColumn: [{
                    selected: []
                }],
                nodeSizeBy: [{
                    selected: []
                }],
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#000000',
                            fontSize: 12,
                            fontFamily: '',
                            fontStyle: 'normal',
                            fontWeight: 'normal'
                        }
                    }
                },
                style: {
                    node: {
                        size: 1,
                        color: _defaultOptions2.default.ColorSet[1]
                    },
                    link: {
                        color: _defaultOptions2.default.ColorSet[0],
                        opacity: 1,
                        width: 1
                    },
                    edge: {
                        symbol: ['none', 'none'],
                        size: [10, 10]
                    }
                }
            }
        }
    })
};
exports.default = BNetworkCharts;

/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BPairwiseScatterCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-scatter.js
   * Created by daewon.park on 2017-03-23.
   */


BPairwiseScatterCharts.prototype = Object.create(_bchartBase2.default.prototype);
BPairwiseScatterCharts.prototype.constructor = BPairwiseScatterCharts;

BPairwiseScatterCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BPairwiseScatterCharts.Attr.Key, this.$parent, this.options);
};

BPairwiseScatterCharts.prototype._configureOptions = function (options) {
    for (var position in options.grid) {
        if (options.grid[position] && String(options.grid[position]).indexOf('%') < 0) {
            options.grid[position] = '5%';
        }
    }
    return options;
};
BPairwiseScatterCharts.Attr = {
    Key: 'pairwise-scatter',
    Label: 'Pairwise Scatter plot',
    Order: 62,
    ColumnConf: {
        xAxis: {
            label: 'Axis',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['number'],
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        grid: {
            left: '5%',
            right: '5%',
            top: '5%',
            bottom: '5%'
        },
        toolbar: {
            show: false
        },
        plotOptions: {
            scatter: {
                marker: $.extend({}, _defaultOptions2.default.Marker, { symbolSize: 5 })
                // stripLine: DefaultOptions.StripLine,
                // trendLine: DefaultOptions.TrendLine
            }
        }
    })
};

BPairwiseScatterCharts.prototype._createAxisTitle = function () {
    // var _this = this;
    // this.xAxisTitle = new Component.AxisTitle(this.$parent, function () {
    //     return _this.options.xAxis[0].title
    // });
};

exports.default = BPairwiseScatterCharts;

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-qqplot.js
 * Created by ji_sung.park on 2018-02-06.
 */
function BQQPlotCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BQQPlotCharts.prototype = Object.create(_bchartBase2.default.prototype);
BQQPlotCharts.prototype.constructor = BQQPlotCharts;

BQQPlotCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BQQPlotCharts.Attr.Key, this.$parent, this.options);
};

BQQPlotCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            qqplot: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.qqplot.values, options.plotOptions.qqplot.values);
    if (!reload) reload |= this._isChanged(this.options.plotOptions.qqplot.distribution, options.plotOptions.qqplot.distribution);
    if (!reload) reload |= this._isChanged(this.options.plotOptions.qqplot.confidence, options.plotOptions.qqplot.confidence);
    this._changeOptions(options);
    this.render(reload);
};

BQQPlotCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }
    if (this.xAxisTitle) {
        var xAxis = $.extend(true, {}, this.options.xAxis[0]);
        if (!xAxis.title.text) xAxis.title.text = 'Theoretical Quantiles';
        this.xAxisTitle.render(xAxis);
    }
    if (this.yAxisTitle) {
        var yAxis = $.extend(true, {}, this.options.yAxis[0]);
        if (!yAxis.title.text) yAxis.title.text = 'Sample Quantiles';
        this.yAxisTitle.render(yAxis);
    }
    if (this.toolbar) {
        this.toolbar.render();
        this._configureToolbar();
    }
};

BQQPlotCharts.Attr = {
    Key: 'qqplot',
    Label: 'Q-Q Plot',
    Order: 61,
    ColumnConf: {
        values: {
            label: 'Values',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        },
        confidence: {
            label: 'Confidence Level',
            source: [{ label: "95%", value: "0.95" }, { label: "99%", value: "0.99" }]
        },
        distribution: {
            label: 'Distribution Type',
            source: _const2.default.extendDistribution(['NORMAL', 'EXP', 'GAMMA', 'LOGNORMAL', 'BETA'])
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        xAxis: [{
            title: {
                text: 'Theoretical Quantiles'
            }
        }],
        yAxis: [{
            title: {
                text: 'Sample Quantiles'
            }
        }],
        toolbar: {
            show: false,
            menu: {
                //brush: {},
                // zoom: {}
            }
        },
        plotOptions: {
            qqplot: {
                values: [{
                    selected: []
                }],
                distribution: [{}],
                confidence: [{
                    selected: '0.95'
                }],
                marker: $.extend({}, _defaultOptions2.default.Marker, { symbolSize: 4 })
            }
        }
    })
};

exports.default = BQQPlotCharts;

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BRadarCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-pie.js
   * Created by daewon.park on 2017-03-30.
   */


BRadarCharts.prototype = Object.create(_bchartBase2.default.prototype);
BRadarCharts.prototype.constructor = BRadarCharts;

BRadarCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BRadarCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BRadarCharts.Attr.Key, this.$parent, this.options);
};

BRadarCharts.Attr = {
    Key: 'radar',
    Label: 'Radar',
    Order: 60,

    DefaultOptions: _defaultOptions2.default.extend({
        plotOptions: {
            radar: {}
        }
    })
};

exports.default = BRadarCharts;

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-line.js
 * Created by daewon.park on 2017-03-28.
 */
function BROCCurveCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BROCCurveCharts.prototype = Object.create(_bchartBase2.default.prototype);
BROCCurveCharts.prototype.constructor = BROCCurveCharts;

BROCCurveCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BROCCurveCharts.Attr.Key, this.$parent, this.options);
};

BROCCurveCharts.Attr = {
    Key: 'roccurve',
    Label: 'ROC Curve',
    Order: 42,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            columnType: ['number'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['NONE', 'SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number']
        },
        auroc: {
            label: 'AUC',
            aggregationEnabled: false,
            columnType: ['number']
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        plotOptions: {
            roccurve: {
                marker: _defaultOptions2.default.Marker,
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine,
                baseLine: {},
                tooltip: { trigger: 'axis' }
            }
        },
        auroc: [{
            selected: []
        }]
    })
};

exports.default = BROCCurveCharts;

/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _bchartRegister = __webpack_require__(26);

var ChartRegistry = _interopRequireWildcard(_bchartRegister);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BScatterCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-scatter.js
   * Created by daewon.park on 2017-03-23.
   */


BScatterCharts.prototype = Object.create(_bchartBase2.default.prototype);
BScatterCharts.prototype.constructor = BScatterCharts;

BScatterCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BScatterCharts.Attr.Key, this.$parent, this.options);
};

BScatterCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            scatter: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.xAxis, options.xAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.yAxis, options.yAxis);
    if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    if (!reload) reload |= this._isChanged(this.options.plotOptions.scatter.trendLine, options.plotOptions.scatter.trendLine);
    this._changeOptions(options);
    this.render(reload);
};

BScatterCharts.prototype._reloadColumnConf = function () {
    var columnConf = ChartRegistry.getChartAttr('scatter').ColumnConf;
    if (this.options.xAxis[0].axisType) {
        columnConf.yAxis.aggregationEnabled = false;
        columnConf.yAxis.columnType = ['number'];
    } else {
        columnConf.yAxis.aggregationEnabled = true;
        columnConf.yAxis.columnType = ['number', 'string'];
    }
};

BScatterCharts.prototype._configureToolbar = function () {
    if (this.options.xAxis[0] && this.options.xAxis[0].axisType === 'byColumnNames') {
        this.toolbar.setBrushTypeList(['rect']);
    } else if (this.options.xAxis[0] && this.options.xAxis[0].axisType === 'byRowIndex') {
        this.toolbar.hide();
    } else if (this.options.yAxis[0].selected[0] && this.options.yAxis[0].selected[0].aggregation !== 'none') {
        this.toolbar.setBrushTypeList(['lineX']);
    }
};

BScatterCharts.Attr = {
    Key: 'scatter',
    Label: 'Scatter plot',
    Order: 23,
    ColumnConf: {
        xAxis: {
            label: 'X-axis',
            aggregationEnabled: false,
            axisTypeList: ['byColumnNames', 'byRowIndex'],
            mandatory: true
        },
        yAxis: {
            label: 'Y-axis',
            aggregationEnabled: true,
            multiple: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['NONE', 'SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            mandatory: true
        },
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: true,
            menu: {
                brush: {},
                zoom: { zoomAxis: 'all' // zoomAxis : all || xAxis || yAxis
                } }
        },
        plotOptions: {
            scatter: {
                marker: $.extend({}, _defaultOptions2.default.Marker, { symbolSize: 10 }),
                stripLine: _defaultOptions2.default.StripLine,
                trendLine: _defaultOptions2.default.TrendLine
            }
        }
    })
};

exports.default = BScatterCharts;

/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// /**
//  * Source: bchart-scattermap.js
//  * Created by daewon.park on 2017-03-23.
//  */
// import BBaseCharts from '../bchart-base';
// import * as Wrapper from '../../wrapper/wrapper-register';
// import DefaultOptions from '../../env/default-options';
//
//
// function BScatterMapCharts(parentId, options) {
//     BBaseCharts.call(this, parentId, options);
// }
//
// BScatterMapCharts.prototype = Object.create(BBaseCharts.prototype);
// BScatterMapCharts.prototype.constructor = BScatterMapCharts;
//
// BScatterMapCharts.prototype._createFrameComponent = function () {
//     this._createTitle();
//     this._createToolbar();
//     this._createLoadingPanel();
//     this._createErrorPanel();
// };
//
// BScatterMapCharts.prototype._createChart = function () {
//     this.chart = Wrapper.createChartWrapper(BScatterMapCharts.Attr.Key,this.$parent, this.options);
// };
//
// BScatterMapCharts.prototype._renderFrame = function () {
//     if (this.title) {
//         this.title.render(this.options.title.text);
//     }
//
//     if (this.toolbar) {
//         this.toolbar.render();
//     }
// };
//
// BScatterMapCharts.prototype.setOptions = function (options) {
//     $.extend(true, options, {
//         plotOptions: {
//             scattermap: {}
//         }
//     });
//
//     var reload = this.isReload(options);
//     if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.scattermap.latitude, options.plotOptions.scattermap.latitude);
//     if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.scattermap.longitude, options.plotOptions.scattermap.longitude);
//     if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.scattermap.value, options.plotOptions.scattermap.value);
//     if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.scattermap.label, options.plotOptions.scattermap.label);
//     this._changeOptions(options);
//     this.render(reload);
// };
//
// BScatterMapCharts.Attr = {
//     Key: 'scatter-map',
//     Label: 'Scatter map',
//     Order: 61,
//     DefaultOptions: DefaultOptions.extend({
//         plotOptions: {
//             'scatter-map': {
//                 latitude: [{
//                     selected: []
//                 }],
//                 longitude: [{
//                     selected: []
//                 }],
//                 value: [{
//                     selected: []
//                 }],
//                 label: [{
//                     selected: []
//                 }],
//                 marker: $.extend({}, DefaultOptions.Marker, {symbolSize: 1}),
//                 stripLine: DefaultOptions.StripLine,
//                 trendLine: DefaultOptions.TrendLine
//             }
//         }
//     })
// };
//
// export default BScatterMapCharts


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BTableCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-table.js
   * Created by daewon.park on 2017-04-23.
   */


BTableCharts.prototype = Object.create(_bchartBase2.default.prototype);
BTableCharts.prototype.constructor = BTableCharts;

BTableCharts.prototype._createFrameComponent = function () {
    // this._createTitle(); //TODO: table title 개발완료 후 주석해제할것. mk.kim
    this._createLoadingPanel();
    this._createErrorPanel();
};

BTableCharts.prototype._createChartComponent = function () {
    this._createChart();
    this.bindEvent('bindingComplete', this._lazyRenderChart.bind(this));
};

BTableCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BTableCharts.Attr.Key, this.$parent, this.options);
};

BTableCharts.prototype.setOptions = function (options) {
    var reload = this.isReload(options);
    this._changeOptions(options);
    this.render(reload);
};

BTableCharts.Attr = {
    Key: 'table',
    Label: 'Table',
    Order: 0,
    ColumnConf: {
        formatter: {
            label: 'Formatter',
            multiple: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        plotOptions: {
            table: {
                formatter: []
            }
        }
    })
};

exports.default = BTableCharts;

/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-treemap.js
 * Created by daewon.park on 2017-04-16.
 */
function BTreemapCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BTreemapCharts.prototype = Object.create(_bchartBase2.default.prototype);
BTreemapCharts.prototype.constructor = BTreemapCharts;

BTreemapCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BTreemapCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BTreemapCharts.Attr.Key, this.$parent, this.options);
};

BTreemapCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }

    if (this.toolbar) {
        this.toolbar.render();
    }
};

BTreemapCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            treemap: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.treemap.hierarchyCol, options.plotOptions.treemap.hierarchyCol);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.treemap.sizeBy, options.plotOptions.treemap.sizeBy);
    this._changeOptions(options);
    this.render(reload);
};

BTreemapCharts.Attr = {
    Key: 'treemap',
    Label: 'Tree map',
    Order: 50,
    ColumnConf: {
        hierarchyCol: {
            label: 'Hierarchy',
            aggregationEnabled: false,
            multiple: true,
            columnType: ['string', 'number'],
            mandatory: true
        },
        sizeBy: {
            label: 'Size By',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            },
            columnType: ['string', 'number'],
            mandatory: true
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false
        },
        plotOptions: {
            treemap: {
                hierarchyCol: [{
                    selected: []
                }],
                sizeBy: [{
                    selected: []
                }]
            }
        }
    })
};

exports.default = BTreemapCharts;

/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _bchartRegister = __webpack_require__(26);

var ChartRegistry = _interopRequireWildcard(_bchartRegister);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

var _bchartPie = __webpack_require__(171);

var _bchartPie2 = _interopRequireDefault(_bchartPie);

var _chartUtils = __webpack_require__(17);

var _chartUtils2 = _interopRequireDefault(_chartUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BMapCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
} /**
   * Source: bchart-scatter.js
   * Created by daewon.park on 2017-03-23.
   */


BMapCharts.prototype = Object.create(_bchartBase2.default.prototype);
BMapCharts.prototype.constructor = BMapCharts;

BMapCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BMapCharts.Attr.Key, this.$parent, this.options);
};

BMapCharts.prototype._reloadColumnConf = function () {};

BMapCharts.prototype._createAxisTitle = function () {
    // do nothing
};
BMapCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            map: {}
        }
    });

    var reload = this.isReload(options);
    this._changeOptions(options);
    this.render(reload);
};

BMapCharts.Attr = {
    Key: 'map',
    Label: 'Map',
    Order: 80,
    ColumnConf: {
        lines: {
            type: 'lines',
            latitude: {
                aggregationEnabled: false,
                columnType: ['number']
            },
            longitude: {
                aggregationEnabled: false,
                columnType: ['number']
            },
            colorBy: {
                aggregationEnabled: false,
                multiple: true
            },
            sortBy: {
                aggregationEnabled: false,
                multiple: true
            }
        },
        point: {
            type: 'point',
            latitude: {
                aggregationEnabled: false,
                columnType: ['number']
            },
            longitude: {
                aggregationEnabled: false,
                columnType: ['number']
            },
            colorBy: {
                aggregationEnabled: false,
                multiple: true
            },
            sizeBy: {
                aggregationEnabled: true,
                multiple: false,
                aggregationMap: {
                    number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                    string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
                },
                columnType: ['number', 'string']
            }
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false,
            menu: {
                brush: {}
            }
        },
        plotOptions: {
            map: {
                marker: $.extend(true, {}, _defaultOptions2.default.Marker, { symbolSize: 8 }),
                mapName: '',
                layers: [],
                mapStyle: {
                    label: {
                        emphasis: {
                            show: true,
                            textStyle: {
                                color: '#000000',
                                fontSize: 12,
                                fontFamily: '',
                                fontStyle: 'normal',
                                fontWeight: 'normal'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 1,
                            areaColor: '#eee',
                            borderColor: '#000',
                            borderWidth: 1,
                            borderType: 'solid'
                        },
                        emphasis: {
                            areaColor: '#eee'
                        }
                    }
                }
            }
        }
    }),
    Layers: {
        lines: {
            type: 'lines',
            latitude: [{ selected: [] }],
            longitude: [{ selected: [] }],
            colorBy: [{ selected: [] }],
            sortBy: [{ selected: [] }]
        },
        point: {
            type: 'point',
            latitude: [{ selected: [] }],
            longitude: [{ selected: [] }],
            colorBy: [{ selected: [] }],
            sizeBy: [{ selected: [] }]
        }
    }
};

exports.default = BMapCharts;

/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bchartBase = __webpack_require__(11);

var _bchartBase2 = _interopRequireDefault(_bchartBase);

var _wrapperRegister = __webpack_require__(3);

var Wrapper = _interopRequireWildcard(_wrapperRegister);

var _defaultOptions = __webpack_require__(5);

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _const = __webpack_require__(16);

var _const2 = _interopRequireDefault(_const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bchart-donut.js
 * Created by daewon.park on 2017-03-30.
 */
function BDonutCharts(parentId, options) {
    _bchartBase2.default.call(this, parentId, options);
}

BDonutCharts.prototype = Object.create(_bchartBase2.default.prototype);
BDonutCharts.prototype.constructor = BDonutCharts;

BDonutCharts.prototype._createFrameComponent = function () {
    this._createTitle();
    this._createToolbar();
    this._createLoadingPanel();
    this._createErrorPanel();
};

BDonutCharts.prototype._createChart = function () {
    this.chart = Wrapper.createChartWrapper(BDonutCharts.Attr.Key, this.$parent, this.options);
};

BDonutCharts.prototype._renderFrame = function () {
    if (this.title) {
        this.title.render(this.options.title.text);
    }

    if (this.toolbar) {
        this.toolbar.render();
    }
};

BDonutCharts.prototype.setOptions = function (options) {
    $.extend(true, options, {
        plotOptions: {
            donut: {}
        }
    });

    var reload = this.isReload(options);
    if (!reload) reload |= this._isSelectionChanged(this.options.colorBy, options.colorBy);
    if (!reload) reload |= this._isSelectionChanged(this.options.plotOptions.donut.sizeBy, options.plotOptions.donut.sizeBy);
    this._changeOptions(options);
    this.render(reload);
};

BDonutCharts.Attr = {
    Key: 'donut',
    Label: 'Donut',
    Order: 81,
    ColumnConf: {
        colorBy: {
            label: 'Color By',
            aggregationEnabled: false,
            multiple: true,
            mandatory: true
        },
        sizeBy: {
            label: 'Size By',
            aggregationEnabled: true,
            aggregationMap: {
                number: _const2.default.extendAggregation(['SUM', 'AVG', 'COUNT', 'UNIQUE_COUNT', 'MIN', 'MAX']),
                string: _const2.default.extendAggregation(['COUNT', 'UNIQUE_COUNT'])
            }
        }
    },
    DefaultOptions: _defaultOptions2.default.extend({
        toolbar: {
            show: false
        },
        plotOptions: {
            donut: {
                radius: ['25%', '75%'],
                center: ['50%', '50%'],
                sizeBy: [{
                    selected: []
                }]
            }
        }
    })
};

exports.default = BDonutCharts;

/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _optionUtils = __webpack_require__(1);

var _optionUtils2 = _interopRequireDefault(_optionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SelectionFilterHelper(filters) {
    this._filters = filters;
} /**
   * Source: filter-helper.js
   * Created by daewon.park on 2017-07-21.
   */

SelectionFilterHelper.prototype._getValue = function (columns, row, col) {
    var idx = _optionUtils2.default.getColumnIndex({ name: col }, columns);
    if (idx > -1) return row[idx];
};

SelectionFilterHelper.prototype._isMatched = function (selectionValue, targetValue) {
    if ($.isPlainObject(selectionValue)) {
        // {min: ?, max: ?}
        if (targetValue >= selectionValue.min && targetValue <= selectionValue.max) {
            // 적합
        } else {
            return false;
        }
    } else if (Array.isArray(selectionValue)) {
        if (selectionValue.indexOf(targetValue) > -1) {} else {
            return false;
        }
    } else if (Number.isNaN(selectionValue) || selectionValue === null) {
        if (selectionValue + '' !== targetValue + '') {
            return false;
        }
    } else {
        if (targetValue != selectionValue) {
            return false;
        }
    }
    return true;
};

SelectionFilterHelper.prototype._filterRow = function (columns, row) {
    for (var s in this._filters) {
        var matched = true;
        for (var col in this._filters[s]) {
            var selectedValue = this._filters[s][col];
            var targetValue = this._getValue(columns, row, col);
            if (!targetValue || targetValue && !this._isMatched(selectedValue, targetValue)) {
                matched = false;
                break;
            }
        }
        if (matched) return true;
    }
};

SelectionFilterHelper.prototype.filter = function (columns, data) {
    if (!this._filters) {
        return data;
    } else if (this._filters.length === 0) {
        return [];
    } else {
        var _this = this;
        return data.filter(function (row) {
            return _this._filterRow(columns, row);
        });
    }
};

exports.default = SelectionFilterHelper;

/***/ })
/******/ ]);