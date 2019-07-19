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
/******/ 	return __webpack_require__(__webpack_require__.s = 559);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createShowButtonWidget = createShowButtonWidget;
exports.createInputWidget = createInputWidget;
exports.createNumberInputWidget = createNumberInputWidget;
exports.createMultiInputWidget = createMultiInputWidget;
exports.createMultiLabelWidget = createMultiLabelWidget;
exports.createCheckedMultiInputWidget = createCheckedMultiInputWidget;
exports.createMultiColorWidget = createMultiColorWidget;
exports.createColorPickerWidget = createColorPickerWidget;
exports.createColorInputWidget = createColorInputWidget;
exports.createColorThemesSelectorWidget = createColorThemesSelectorWidget;
exports.createColorPaletteWidget = createColorPaletteWidget;
exports.createColumnSelectorWidget = createColumnSelectorWidget;
exports.createColumnSelectorDroppableWidget = createColumnSelectorDroppableWidget;
exports.createFontSelectorWidget = createFontSelectorWidget;
exports.createFontSizeSelectorWidget = createFontSizeSelectorWidget;
exports.createFontStyleWidget = createFontStyleWidget;
exports.createOpacitySelectorWidget = createOpacitySelectorWidget;
exports.createMarkerSizeSelectorWidget = createMarkerSizeSelectorWidget;
exports.createMarkerShowSelectorWidget = createMarkerShowSelectorWidget;
exports.createMarkerLineSelectorWidget = createMarkerLineSelectorWidget;
exports.createDashTypeSelectorWidget = createDashTypeSelectorWidget;
exports.createLineWidthSelectorWidget = createLineWidthSelectorWidget;
exports.createLineStyleWidget = createLineStyleWidget;
exports.createLineComponentWidget = createLineComponentWidget;
exports.createHorizontalAlignRadioButtonWidget = createHorizontalAlignRadioButtonWidget;
exports.createVerticalAlignRadioButtonWidget = createVerticalAlignRadioButtonWidget;
exports.createCustomHorizontalAlignRadioButtonWidget = createCustomHorizontalAlignRadioButtonWidget;
exports.createCustomVerticalAlignRadioButtonWidget = createCustomVerticalAlignRadioButtonWidget;
exports.createFontStyleButtonWidget = createFontStyleButtonWidget;
exports.createDirectionRadioButtonWidget = createDirectionRadioButtonWidget;
exports.createToolTipBehaviorRadioButtonWidget = createToolTipBehaviorRadioButtonWidget;
exports.createDataSourceSelectorWidget = createDataSourceSelectorWidget;
exports.createChartTypeSelectorWidget = createChartTypeSelectorWidget;
exports.createSwitchButtonWidget = createSwitchButtonWidget;
exports.createPositionWidget = createPositionWidget;
exports.createColumnFormatterWidget = createColumnFormatterWidget;
exports.createFormatTypeSelectorWidget = createFormatTypeSelectorWidget;
exports.createFormatDigitSelectorWidget = createFormatDigitSelectorWidget;
exports.createItemSelectorWidget = createItemSelectorWidget;
exports.createOnOffSwitchWidget = createOnOffSwitchWidget;
exports.createAxisToggleButtonWidget = createAxisToggleButtonWidget;
exports.createCenterPositionWidget = createCenterPositionWidget;
exports.createCenterPositionNumberWidget = createCenterPositionNumberWidget;
exports.createToolTipTriggerRadioButtonWidget = createToolTipTriggerRadioButtonWidget;
exports.createEdgeTypeSelectorWidget = createEdgeTypeSelectorWidget;
exports.createLabelWidget = createLabelWidget;

var _widgetIndex = __webpack_require__(564);

var Widgets = _interopRequireWildcard(_widgetIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createShowButtonWidget(parentId, options) {
    return new Widgets.ShowButtonWidget(parentId, options);
} /**
   * Created by mk90.kim on 2017-05-11.
   */

function createInputWidget(parentId, options) {
    return new Widgets.InputWidget(parentId, options);
}

function createNumberInputWidget(parentId, options) {
    return new Widgets.NumberInputWidget(parentId, options);
}

function createMultiInputWidget(parentId, options) {
    return new Widgets.MultiInputWidget(parentId, options);
}

function createMultiLabelWidget(parentId, options) {
    return new Widgets.MultiLabelWidget(parentId, options);
}

function createCheckedMultiInputWidget(parentId, options) {
    return new Widgets.CheckedMultiInputWidget(parentId, options);
}

function createMultiColorWidget(parentId, options) {
    return new Widgets.MultiColorWidget(parentId, options);
}

function createColorPickerWidget(parentId, options) {
    return new Widgets.ColorPickerWidget(parentId, options);
}

function createColorInputWidget(parentId, options) {
    return new Widgets.ColorInputWidget(parentId, options);
}

function createColorThemesSelectorWidget(parentId, options) {
    return new Widgets.ColorThemesSelectorWidget(parentId, options);
}

function createColorPaletteWidget(parentId, options) {
    return new Widgets.ColorPaletteWidget(parentId, options);
}

function createColumnSelectorWidget(parentId, options) {
    return new Widgets.ColumnSelectorWidget(parentId, options);
}

function createColumnSelectorDroppableWidget(parentId, options) {
    return new Widgets.ColumnSelectorWidgetDroppable(parentId, options);
}

function createFontSelectorWidget(parentId, options) {
    return new Widgets.FontSelectorWidget(parentId, options);
}

function createFontSizeSelectorWidget(parentId, options) {
    return new Widgets.FontSizeSelectorWidget(parentId, options);
}
function createFontStyleWidget(parentId, options) {
    return new Widgets.FontStyleWidget(parentId, options);
}

function createOpacitySelectorWidget(parentId, options) {
    return new Widgets.OpacitySelectorWidget(parentId, options);
}

function createMarkerSizeSelectorWidget(parentId, options) {
    return new Widgets.MarkerSizeSelectorWidget(parentId, options);
}

function createMarkerShowSelectorWidget(parentId, options) {
    return new Widgets.MarkerShowSelectorWidget(parentId, options);
}

function createMarkerLineSelectorWidget(parentId, options) {
    return new Widgets.MarkerLineSelectorWidget(parentId, options);
}

function createDashTypeSelectorWidget(parentId, options) {
    return new Widgets.DashTypeSelectorWidget(parentId, options);
}

function createLineWidthSelectorWidget(parentId, options) {
    return new Widgets.LineWidthSelectorWidget(parentId, options);
}

function createLineStyleWidget(parentId, options) {
    return new Widgets.LineStyleWidget(parentId, options);
}

function createLineComponentWidget(parentId, options) {
    return new Widgets.LineComponentWidget(parentId, options);
}

function createHorizontalAlignRadioButtonWidget(parentId, options) {
    return new Widgets.HorizontalAlignRadioButtonWidget(parentId, options);
}

function createVerticalAlignRadioButtonWidget(parentId, options) {
    return new Widgets.VerticalAlignRadioButtonWidget(parentId, options);
}

function createCustomHorizontalAlignRadioButtonWidget(parentId, options) {
    return new Widgets.CustomHorizontalAlignRadioButtonWidget(parentId, options);
}

function createCustomVerticalAlignRadioButtonWidget(parentId, options) {
    return new Widgets.CustomVerticalAlignRadioButtonWidget(parentId, options);
}

function createFontStyleButtonWidget(parentId, options) {
    return new Widgets.FontStyleButtonWidget(parentId, options);
}

function createDirectionRadioButtonWidget(parentId, options) {
    return new Widgets.DirectionRadioButtonWidget(parentId, options);
}

function createToolTipBehaviorRadioButtonWidget(parentId, options) {
    return new Widgets.ToolTipBehaviorRadioButtonWidget(parentId, options);
}

function createDataSourceSelectorWidget(parentId, options) {
    return new Widgets.DataSourceSelectorWidget(parentId, options);
}

function createChartTypeSelectorWidget(parentId, options) {
    return new Widgets.ChartTypeSelectorWidget(parentId, options);
}

function createSwitchButtonWidget(parentId, options) {
    return new Widgets.SwitchButtonWidget(parentId, options);
}

function createPositionWidget(parentId, options) {
    return new Widgets.PositionWidget(parentId, options);
}

function createColumnFormatterWidget(parentId, options) {
    return new Widgets.ColumnFormatterWidget(parentId, options);
}

function createFormatTypeSelectorWidget(parentId, options) {
    return new Widgets.FormatTypeSelectorWidget(parentId, options);
}

function createFormatDigitSelectorWidget(parentId, options) {
    return new Widgets.FormatDigitSelectorWidget(parentId, options);
}

function createItemSelectorWidget(parentId, options) {
    return new Widgets.ItemSelectorWidget(parentId, options);
}

function createOnOffSwitchWidget(parentId, options) {
    return new Widgets.OnOffSwitchWidget(parentId, options);
}

function createAxisToggleButtonWidget(parentId, options) {
    return new Widgets.AxisToggleButtonWidget(parentId, options);
}

function createCenterPositionWidget(parentId, options) {
    return new Widgets.CenterPositionWidget(parentId, options);
}

function createCenterPositionNumberWidget(parentId, options) {
    return new Widgets.CenterPositionNumberWidget(parentId, options);
}

function createToolTipTriggerRadioButtonWidget(parentId, options) {
    return new Widgets.ToolTipTriggerRadioButtonWidget(parentId, options);
}

function createEdgeTypeSelectorWidget(parentId, options) {
    return new Widgets.EdgeTypeSelectorWidget(parentId, options);
}

function createLabelWidget(parentId, options) {
    return new Widgets.LabelWidget(parentId, options);
}

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _controlContainerPreview = __webpack_require__(119);

var ControlContainerPreview = _interopRequireWildcard(_controlContainerPreview);

var _controlContainerFactory = __webpack_require__(272);

var ControlContainerFactory = _interopRequireWildcard(_controlContainerFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Created by SDS on 2017-05-10.
 */

var ChartWidget = Brightics.Chart.Widget;


var ColumnHelper = Brightics.Chart.Helper.ColumnHelper;
var ChartValidator = Brightics.Chart.Validator.ChartValidator;

/**
 *
 * @param parentId
 * @param options = {
       chartOption: {
            chart: {
                type: 'area',
                ...
            },
            ...
       },
       setting:{
            columnSelector
       },
       onChanged: function (chartOption) {
       }
  }
 * @constructor
 */

function ChartOptionBase(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

ChartOptionBase.prototype = Object.create(ChartWidget.prototype);
ChartOptionBase.prototype.constructor = ChartOptionBase;

ChartOptionBase.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this._expanderMap = {};
    this.options.setting = {
        datasourceSelector: [{ label: 'Data Source' }],
        columnSelector: []
    };
    this._columnHelper = new ColumnHelper({
        type: this.options.chartOption.chart.type,
        columnConf: this.options.columnConf
    });
};

ChartOptionBase.prototype._createContents = function ($parent) {
    var _this = this;
    this.doValidate();
    this._getControlContainerList().forEach(function (controlNm) {
        var expanderPreview = ControlContainerPreview[controlNm].call(_this);
        _this._expanderMap[controlNm] = ControlContainerFactory[controlNm].call(_this, expanderPreview);
    });
};

ChartOptionBase.prototype._getControlContainerList = function () {
    var defaultControls = this.getDefaultControlContainerList();
    if (typeof this.options.getControlContainerList === 'function') {
        return this.options.getControlContainerList(defaultControls);
    } else {
        return defaultControls;
    }
};

ChartOptionBase.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

ChartOptionBase.prototype.render = function () {
    for (var controlKey in this._expanderMap) {
        this._expanderMap[controlKey].render();
    }
};

ChartOptionBase.prototype.reloadColumnSelectorSetting = function () {
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
};

ChartOptionBase.prototype.destroy = function () {
    for (var controlKey in this._expanderMap) {
        this._expanderMap[controlKey].destroy();
    }
    this._expanderMap = null;
};

ChartOptionBase.prototype.doValidate = function () {
    var validator = new ChartValidator(this.options.chartOption);
    if (this.options.columnConf) {
        validator.chartValidator.setColumnHelper({
            chart: {
                type: this.options.chartOption.chart.type
            },
            columnConf: this.options.columnConf
        });
    }
    this.options.problemList = validator.doValidate() || [];
    this.options.warningList = validator.getWarning() || [];
};

ChartOptionBase.prototype.renderProblem = function () {
    var _this = this;
    for (var controlKey in this._expanderMap) {
        _this._expanderMap[controlKey]._controlList.forEach(function (control) {
            control.renderProblem(_this.options.problemList);
        });
    }
};

ChartOptionBase.prototype.renderWarning = function () {
    var _this = this;
    for (var controlKey in this._expanderMap) {
        _this._expanderMap[controlKey]._controlList.forEach(function (control) {
            control.renderWarning();
        });
    }
};

ChartOptionBase.prototype.close = function () {
    for (var controlKey in this._expanderMap) {
        this._expanderMap[controlKey].close();
    }
};

ChartOptionBase.prototype.getChartOption = function (options) {
    var defaultChartOptions = Brightics.Chart.getChartAttr(options.chart.type).DefaultOptions;
    var colorSet = (options.colorSet || defaultChartOptions.colorSet).slice();
    var returnOption = $.extend(true, {}, defaultChartOptions, { source: this.options.chartOption.source }, options);
    returnOption.colorSet = colorSet;
    return returnOption;
    //return $.extend(true, {}, defaultChartOptions, {source: this.options.chartOption.source}, options);
};

ChartOptionBase.prototype._configureColumnConf = function (columnSelectorSetting) {
    var columnConf = this._columnHelper.getColumnConf();

    columnSelectorSetting.forEach(function (dataSet) {
        dataSet.forEach(function (columnSetting) {
            var key = columnSetting.key;
            for (var confParam in columnConf[key]) {
                columnSetting[confParam] = columnConf[key][confParam];
            }
        });
    });

    return columnSelectorSetting;
};

ChartOptionBase.prototype._configureItemConf = function (itemSelectorSetting) {
    var columnConf = this._columnHelper.getColumnConf();

    itemSelectorSetting.forEach(function (dataSet) {
        dataSet.forEach(function (itemSetting) {
            var key = itemSetting.key;
            for (var confParam in columnConf[key]) {
                itemSetting[confParam] = columnConf[key][confParam];
            }
        });
    });

    return itemSelectorSetting;
};

ChartOptionBase.prototype._configureSwitchConf = function (switchSetting) {
    var columnConf = this._columnHelper.getColumnConf();

    switchSetting.forEach(function (dataSet) {
        dataSet.forEach(function (switchSetting) {
            var key = switchSetting.key;
            for (var confParam in columnConf[key]) {
                switchSetting[confParam] = columnConf[key][confParam];
            }
        });
    });

    return switchSetting;
};

exports.default = ChartOptionBase;

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _controlContainerPreview = __webpack_require__(119);

var ControlContainerPreview = _interopRequireWildcard(_controlContainerPreview);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Created by mk90.kim on 2017-05-10.
 */

var ChartWidget = Brightics.Chart.Widget;


function BaseControl(parentId, options, headerKey) {
    if (headerKey) {
        this.headerKey = headerKey;
    }

    ChartWidget.call(this, parentId, options);
    this.renderProblem();
    this.renderWarning();
}

BaseControl.prototype = Object.create(ChartWidget.prototype);
BaseControl.prototype.constructor = BaseControl;

BaseControl.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this._widgetList = [];
};

BaseControl.prototype._createContents = function ($parent) {
    if (this.$controlMain) {
        this.destroy();
    }
    this.$controlMain = $('<div class="bo-control bos-control" controlType="' + this.headerKey + '"></div>');
    $parent.append(this.$controlMain);
};

/**
 var headerOption = {
    label: 'View Range',
    showBtn: {
        defaultVal: false,
        clickfunc: function () {
            console.log('show btn clicked');
        }
    },
     showBtn: {
        clickfunc: function () {
            console.log('show btn clicked');
        }
    }
};
 */
BaseControl.prototype.createComponentHeader = function (headerOption) {
    var _this = this;

    var $controlHeader = $('<div class="bo-control-header bos-control-header bos-display-flex bos-flex-space-between"></div>');

    this.$controlMain.append($controlHeader);

    if (!headerOption) {
        return;
    }
    if (headerOption.additionalType) {
        $controlHeader.attr('type', headerOption.additionalType);
    }

    if (headerOption.label) {
        var $controlHeaderLabel = $('<div class="bo-control-header-label bos-control-header-label"></div>');
        $controlHeader.append($controlHeaderLabel);
        $controlHeaderLabel.text(headerOption.label);
    }

    if (headerOption.showBtn) {
        this.headerShowBtn = WidgetFactory.createShowButtonWidget($controlHeader, headerOption.showBtn);
    }

    if (headerOption.addBtn) {
        if (!headerOption.label && !headerOption.showBtn) {
            $controlHeader.removeClass('bos-flex-space-between').addClass('bos-flex-center');
        }
        var $panelHeaderAddBtn = $('<div class="bo-control-header-add-button bos-control-header-add-button"></div>');
        $controlHeader.append($panelHeaderAddBtn);
        if (typeof headerOption.addBtn.clickfunc === 'function') {
            $panelHeaderAddBtn.click(headerOption.addBtn.clickfunc);
        } else {
            console.error('Header [' + headerOption.label + '] add button: click event function is not existed.');
        }
    }
};

BaseControl.prototype.createComponentContents = function () {
    this.$controlContents = $('<div class = "bo-control-contents bos-control-contents"></div>');
    this.$controlMain.append(this.$controlContents);
};

BaseControl.setTemplate = function (template, refData) {
    var copiedData = $.extend(true, {}, refData);
    $.extend(true, refData, template, copiedData);
};

BaseControl.prototype.setComponentShow = function () {
    if (this.headerShowBtn && !this.headerShowBtn.getValue()) {
        this.toggleDisableComponent(false);
    }
};

BaseControl.prototype.toggleDisableComponent = function (checkedVal) {
    this._widgetList.forEach(function (widget) {
        widget.toggleDisable(!checkedVal);
    });
};

BaseControl.prototype.render = function () {};

BaseControl.prototype.destroy = function () {
    this._widgetList.forEach(function (widget) {
        widget.destroy();
    });
    this.$controlMain.remove();
};

BaseControl.prototype.close = function () {
    this._widgetList.forEach(function (widget) {
        widget.close();
    });
};

BaseControl.prototype.renderProblem = function () {};

BaseControl.prototype.renderWarning = function (warningList) {};

BaseControl.prototype.setExpanderPreview = function () {
    var $previewTarget = this.$parent.closest('.bo-control-container-expander').find('.bo-control-container-header-preview');
    this.options.expanderCallBack(ControlContainerPreview[this.headerKey].call(this), $previewTarget);
};

exports.default = BaseControl;

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: chart-option-const
 * Created by SDS on 2018-05-29
 */

var ChartOptionConst = {
    Theme: 'office',
    EXTRA_AXIS_TYPE: 'SCHEMA',
    EXTRA_AXIS_TYPE_LIST: [{
        name: '(Column Names)',
        type: 'SCHEMA',
        value: 'byColumnNames'
    }, {
        name: '(Row Index)',
        type: 'SCHEMA',
        value: 'byRowIndex'
    }],
    AggregationMap: {
        NONE: { label: "(None)", value: "none" },
        SUM: { label: "Sum", value: "sum" },
        AVG: { label: "Average", value: "average" },
        COUNT: { label: "Count", value: "count" },
        UNIQUE_COUNT: { label: "Unique Count", value: "unique_count" },
        MIN: { label: "Min", value: "min" },
        MAX: { label: "Max", value: "max" }
    },
    LineStyleList: [{ label: 'Solid', value: 'solid' }, { label: 'Dashed', value: 'dashed' }, { label: 'Dotted', value: 'dotted' }, { label: 'None', value: 'none' }],
    OpacityList: [{ label: '0%', value: 0 }, { label: '10%', value: 0.1 }, { label: '20%', value: 0.2 }, { label: '30%', value: 0.3 }, { label: '40%', value: 0.4 }, { label: '50%', value: 0.5 }, { label: '60%', value: 0.6 }, { label: '70%', value: 0.7 }, { label: '80%', value: 0.8 }, { label: '90%', value: 0.9 }, { label: '100%', value: 1 }],
    FontList: [{ label: 'Arial', value: 'Arial' }, { label: 'Arial Black', value: 'Arial Black' }, { label: 'Comic Sans MS', value: 'Comic Sans MS' }, { label: 'Courier New', value: 'Courier New' }, { label: 'Impact', value: 'Impact' }, { label: 'Tahoma', value: 'Tahoma' }, { label: 'Times New Roman', value: 'Times New Roman' }, { label: 'Verdana', value: 'Verdana' }],
    FormatList: [{ label: 'Numbers', value: 'number' },
    //     {label: 'Time', value: 'time'},
    { label: 'Exponential', value: 'exponential' }],
    // @deprecated
    ColorPaletteList: {
        Brightics: ['#FD026C', '#4682B8', '#A5D221', '#F5CC0A', '#FE8C01', '#6B9494', '#B97C46', '#84ACD0', '#C2E173', '#F9DD5B', '#FE569D', '#FEB356', '#9CB8B8', '#D0A884', '#2E6072', '#6D8C1E', '#A48806', '#A90148', '#A95E01', '#476363', '#7B532F'],
        RainBow: ['#FF0000', '#FF9D00', '#EEFF00', '#34B545', '#3E6DC4', '#863DCC']
    },
    edgeStyle: [{ label: 'Arrow', value: 'arrow' }, { label: 'Triangle', value: 'triangle' }, { label: 'Circle', value: 'circle' }, { label: 'Rect', value: 'rect' }, { label: 'None', value: 'none' }],
    chartLineStyleList: [{ label: 'Solid', value: 'solid' }, { label: 'Dashed', value: 'dashed' }, { label: 'Dotted', value: 'dotted' }]
};

exports.default = ChartOptionConst;

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by mk90.kim on 2017-05-10.
 */

var ChartWidget = Brightics.Chart.Widget;

function BaseWidget(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

BaseWidget.prototype = Object.create(ChartWidget.prototype);
BaseWidget.prototype.constructor = BaseWidget;

BaseWidget.prototype._fireEvent = function (eventName, eventParam) {
    this.$mainControl.closest('.bo-container').trigger(eventName, eventParam);
};

BaseWidget.prototype._setPreValue = function (preVal) {
    this._preValue = JSON.stringify(preVal);
};

BaseWidget.prototype._isChanged = function (currentVal) {
    if (this._preValue !== JSON.stringify(currentVal)) {
        this._setPreValue(currentVal);
        return true;
    } else {
        return false;
    }
};

BaseWidget.prototype.toggleDisable = function () {};

BaseWidget.prototype.renderProblem = function () {};

BaseWidget.prototype.destroy = function () {};

BaseWidget.prototype.close = function () {};

exports.default = BaseWidget;

/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAggregationLabelByValue = getAggregationLabelByValue;
exports.getColumnInternalType = getColumnInternalType;
exports.getAllColumnList = getAllColumnList;
exports.isEmpty = isEmpty;
exports.mergeChartOption = mergeChartOption;

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAggregationLabelByValue(value) {
    for (var key in _chartOptionConst2.default.AggregationMap) {
        if (value === _chartOptionConst2.default.AggregationMap[key].value) return _chartOptionConst2.default.AggregationMap[key].label;
    }
} /**
   * Created by SDS on 2017-05-10.
   */

function getColumnInternalType(column, columnList) {

    if (!column || !$.isArray(columnList)) {
        return '';
    }
    var internalList = _chartOptionConst2.default.EXTRA_AXIS_TYPE_LIST.concat(columnList);
    var foundColumn = internalList.find(function (columnObj) {
        return columnObj.name === column.name;
    });
    if (foundColumn) {
        return foundColumn.internalType || foundColumn.type;
    } else {
        return '';
    }
}

function getAllColumnList(chartOpt, sourceIndex) {
    var columnList;
    var idx = typeof sourceIndex != 'undefined' ? sourceIndex : 0;
    if (chartOpt.source.dataType === 'lazy') {
        if (!chartOpt.source.lazyData[idx]) {
            console.warn('Not yet loaded lazy data.');
            return [];
        }
        if (typeof chartOpt.source.lazyData[idx].columns === 'function') {
            columnList = chartOpt.source.lazyData[idx].columns();
        } else {
            columnList = chartOpt.source.lazyData[idx].columns;
        }
    } else {
        columnList = chartOpt.source.localData[idx].columns;
    }
    return columnList;
}

function isEmpty(target) {
    //$.isEmptyObject 를 사용하지못하는경우 사용할것.
    // - function type ($.isEmptyObject export function무조건 empty로 체크함)
    // - number type ($.isEmptyObject: 0을 empty로 체크함)
    if (target === null || typeof target === 'undefined') {
        return true;
    } else {
        return false;
    }
}

function mergeChartOption(a, b) {
    var colorSet = (b.colorSet || a.colorSet).slice();
    var opt = $.extend(true, {}, a, b);
    opt.colorSet = colorSet;
    return opt;
}

/***/ }),
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      original: {},
 *      key: '',
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value:
 *      onChanged: function(){]
 * }
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function BaseSelectorWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

BaseSelectorWidget.prototype = Object.create(_baseWidget2.default.prototype);
BaseSelectorWidget.prototype.constructor = BaseSelectorWidget;

BaseSelectorWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-widget-contents">' + '</div>');

    this._createIconArea();
    this._createSelectorArea(this.$mainControl);
    $parent.append(this.$mainControl);
};

BaseSelectorWidget.prototype._createIconArea = function () {};

BaseSelectorWidget.prototype._createSelectorArea = function ($parent) {
    this.$selectorControl = $('<div class="bo-widget-selector bos-widget-selector"></div>'); //bos-border-only-bottom
    $parent.append(this.$selectorControl);
    var source = this._createListSource();
    var option = {
        width: this.options.width || '100%',
        height: this.options.height || '30px',
        scrollBarSize: 8,
        source: source,
        placeHolder: this.options.placeHolder || ' ',
        animationType: 'none',
        enableBrowserBoundsDetection: true,
        autoDropDownHeight: true,
        theme: _chartOptionConst2.default.Theme,
        disabled: this.options.disabled || false
    };
    var selectorOption = this._createSelectorOption();
    $.extend(true, option, selectorOption);
    this.$selectorControl.jqxDropDownList(option);

    this._bindCallbackFunc();
};

BaseSelectorWidget.prototype._createListSource = function () {
    return [];
};

BaseSelectorWidget.prototype._createSelectorOption = function () {
    if (this.options.type && this.options.type === 'number') {
        this.options.value = Number(this.options.value);
    }
    var selectedIdx = this._getItemIndexInSource(this.options.value);
    return { selectedIndex: selectedIdx };
};

BaseSelectorWidget.prototype._getItemIndexInSource = function (item) {
    return $.inArray(item, this._createListSource());
};

BaseSelectorWidget.prototype._bindCallbackFunc = function () {
    if (typeof this.options.onChanged === 'function') {
        var _this = this;
        var callbackFunc = this.options.onChanged;
        if (this.options.type && this.options.type === 'number') {
            this.$selectorControl.on('change', function (event) {
                callbackFunc.bind(_this)(Number(event.args.item.value));
            });
        } else {
            this.$selectorControl.on('change', function (event) {
                callbackFunc.bind(_this)(event.args.item.value);
            });
        }
    }
};

BaseSelectorWidget.prototype.clearSelection = function () {
    this.$selectorControl.jqxDropDownList('clearSelection');
};

BaseSelectorWidget.prototype.toggleDisable = function (disabled) {
    this.$selectorControl.jqxDropDownList({ disabled: disabled });
};

BaseSelectorWidget.prototype.render = function (changedValue) {
    var selectedIdx = this._getItemIndexInSource(changedValue);
    this.$selectorControl.jqxDropDownList({ selectedIndex: selectedIdx });
};

BaseSelectorWidget.prototype.close = function () {
    this.$selectorControl.jqxDropDownList('close');
};

BaseSelectorWidget.prototype.destroy = function () {
    this.$selectorControl.jqxDropDownList('destroy');
};

exports.default = BaseSelectorWidget;

/***/ }),
/* 34 */,
/* 35 */,
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BaseComplexWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
    this.renderProblem();
} /**
   * Created by mk90.kim on 2017-05-10.
   */

BaseComplexWidget.prototype = Object.create(_baseWidget2.default.prototype);
BaseComplexWidget.prototype.constructor = BaseComplexWidget;

BaseComplexWidget.prototype._init = function (preVal) {
    _baseWidget2.default.prototype._init.call(this);
    this._widgetList = [];
};

BaseComplexWidget.prototype.toggleDisable = function (disabled) {
    this._widgetList.forEach(function (widget) {
        widget.toggleDisable(disabled);
    });
};

BaseComplexWidget.prototype.render = function (changedValueList) {
    if (this._widgetList.length !== changedValueList.length) {
        console.warn('Widget cannot render');
        return;
    }

    this._widgetList.forEach(function (widget, index) {
        widget.render(changedValueList[index]);
    });
};

BaseComplexWidget.prototype.renderProblem = function (problems) {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(problems || _this.options.problemList);
    });
};

BaseComplexWidget.prototype.close = function () {
    this._widgetList.forEach(function (widget) {
        widget.close();
    });
};

BaseComplexWidget.prototype.destroy = function () {
    this._widgetList.forEach(function (widget) {
        widget.destroy();
    });
};

exports.default = BaseComplexWidget;

/***/ }),
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by daewon77.park on 2016-08-20.
 */

var ChartWidget = Brightics.Chart.Widget;

function Dialog(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

/**
 * options = {
     *      windowPosition: 'left' or 'right' or 'top' or 'bottom' default 는 화면 중앙(화면 중앙을 제외한 나머지는 parent를 기준으로 함)
     *      showHeader: false (header 표시여부)
     * }
 */
Dialog.prototype = Object.create(ChartWidget.prototype);
Dialog.prototype.constructor = Dialog;

Dialog.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this.options.showHeader = true;
};

Dialog.prototype._createContents = function () {
    this.$mainControl = $('' + '<div class="">' + '   <div class="bo-dialogs-header bos-dialogs-header"></div>' + '   <div class="bo-dialogs-body bos-dialogs-body">' + '       <div class="bos-full bo-dialogs-contents">' + '       </div>' + '   </div>' + '</div>');
    this.$parent.append(this.$mainControl);
    this._setDialogsHeader();

    var defaults = this._getDefaultWindowOption();
    var opts = $.extend(defaults, this.options.window);
    this.$mainControl.jqxWindow(opts);
    this._createDialogsBody();
};

Dialog.prototype._setDialogsHeader = function () {
    var header = this.$mainControl.find('.bo-dialogs-header');
    if (this.options.showHeader) {
        header.text(this._getTitle());
    } else {
        header.css({ display: 'none', padding: '0', 'border-width': '0' });
    }
};

Dialog.prototype._getTitle = function () {
    return this.options.title;
};

Dialog.prototype._createDialogsBody = function () {
    this._setFocus();
    this._createCloseHandler();
    this.$mainControl.on('close', this._destroy.bind(this));
};

Dialog.prototype._getDefaultWindowOption = function () {
    var _this = this;
    return {
        theme: ChartOptionConst.Theme,
        width: '600px',
        height: '500px',
        maxWidth: '600px',
        maxHeight: '500px',
        resizable: false,
        initContent: function initContent() {
            _this._configurePosition(_this.options.windowPosition);
            _this._createDialogContentsArea(_this.$mainControl.find('.bo-dialogs-contents'));
        }
    };
};

Dialog.prototype._createCloseHandler = function () {
    var _this = this;
    this._closeHandler = function (event) {
        if (!event || _this.$mainControl.has(event.target).length === 0) {
            _this.$mainControl.jqxWindow('close');
        }
    };
    $(window).on('mousedown', this._closeHandler);
};

Dialog.prototype._configurePosition = function (position, isSwitch) {
    position = position || this.options.windowPosition;
    if (!position) return;
    var $window = this.$mainControl;
    var anchorOffset = this.$parent.offset(),
        anchorWidth = this.$parent.width(),
        anchorHeight = this.$parent.height(),
        windowOffset = this.$mainControl.offset(),
        windowWidth = this.$mainControl.width(),
        windowHeight = this.$mainControl.height(),
        windowLeft,
        windowTop,
        isChanged = false;

    switch (position) {
        case 'left':
            windowLeft = anchorOffset.left - windowWidth - 3;
            windowTop = anchorOffset.top;
            break;
        case 'right':
            windowLeft = anchorOffset.left + anchorWidth + 3;
            windowTop = anchorOffset.top;
            break;
        case 'top':
            windowLeft = anchorOffset.left;
            windowTop = anchorOffset.top - windowHeight - 3;
            break;
        case 'top-left':
            windowLeft = anchorOffset.left - (windowWidth - anchorWidth) - 3;
            windowTop = anchorOffset.top - windowHeight - 3;
            break;
        case 'bottom':
            windowLeft = anchorOffset.left;
            windowTop = anchorOffset.top + anchorHeight + 3;
            break;
        case 'bottom-left':
            windowLeft = anchorOffset.left - (windowWidth - anchorWidth) - 3;
            windowTop = anchorOffset.top + anchorHeight + 3;
            break;
    }

    if (windowLeft + windowWidth > window.innerWidth) windowLeft = window.innerWidth - windowWidth - 5, isChanged = true;
    if (windowTop + windowHeight > window.innerHeight) windowTop = window.innerHeight - windowHeight - 5, isChanged = true;
    if (windowLeft < 0) windowLeft = 5, isChanged = true;
    if (windowTop < 0) windowTop = 5, isChanged = true;

    if (isChanged === true && this.options.switchPosition && isSwitch !== true) {
        this._configurePosition(this.options.switchPosition, true);
    } else {
        $window.css('left', windowLeft);
        $window.css('top', windowTop);
    }
};

Dialog.prototype._setPosition = function (posititon) {};

Dialog.prototype._setFocus = function () {
    this.$mainControl.jqxWindow('focus');
};

Dialog.prototype._close = function () {
    this.$mainControl.jqxWindow('close');
};

Dialog.prototype._destroy = function () {
    if (typeof this.options.close === 'function') {
        this.options.close(this._getDialogResult());
    }

    $(window).off('mousedown', this._closeHandler);
    this.$mainControl.jqxWindow('destroy');
    this.$mainControl.remove();
};

Dialog.prototype._setDialogResult = function () {};

Dialog.prototype._getDialogResult = function () {
    return this.dialogResult || {};
};

Dialog.prototype._createDialogContentsArea = function ($parent) {};

exports.default = Dialog;

/***/ }),
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

var _columnSelectorDialog = __webpack_require__(120);

var _columnSelectorDialog2 = _interopRequireDefault(_columnSelectorDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      column : [
            {name:'SepalLength','type':'number'},
            {name:'SepalWidth','type':'number'},
            {name:'PetalLength','type':'number'},
            {name:'PetalWidth','type':'number'},
            {name:'Species','type':'string'},
            {name:'Class','type':'string'},
        ],
        selected: [{name: 'SepalLength', aggregation: 'none' }],
        axisType: 'byColumnNames' ( or 'rownum' ...),
        multiple: true (default : false),
        multipleMaxCnt: 2,
        aggregationEnabled: true (default : false),
        label: 'X-axis' (mandantory: validation check시 사용),
        hideLabel: false,(optional)
        getColumns: //column list in dialog,
        getAllColumns: //column list to render column type
        onChanged: function(){]
 * }
 */
function ColumnSelectorWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

ColumnSelectorWidget.prototype = Object.create(_baseWidget2.default.prototype);
ColumnSelectorWidget.prototype.constructor = ColumnSelectorWidget;

ColumnSelectorWidget.prototype._init = function () {
    _baseWidget2.default.prototype._init.call(this);
    this.options.selected = $.extend(true, [], this.options.selected);
    this.showMultiple = this.options.multiple;
    this.hasType = true;
    this.defaultMsg = 'Select Column';
};

ColumnSelectorWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bos-widget-header bo-widget-header"></div>' + '   <div class="bos-display-flex bos-flex-direction-column bos-widget-contents bo-widget-contents"></div>' + '</div>');
    $parent.append(this.$mainControl);

    if (this.options.hideLabel) {
        this.$mainControl.find('.bo-widget-header').remove();
    } else {
        this.$mainControl.find('.bo-widget-header').text(this.options.label);
    }

    this._createColumnControlUnit();
    if (this.showMultiple === true) {
        for (var i = 1; i < this.options.selected.length; i++) {
            this._createColumnControlUnit();
        }
    }

    this._fillColumnControlUnit();
    this._setPreValue(this.options.selected);
};

ColumnSelectorWidget.prototype._createColumnControlUnit = function (index) {
    var _this = this;
    var $parent = this.$mainControl.find('.bo-widget-contents');
    var $unitWrapper = this._createNewUnitWrapper();
    var $columnUnit = this._createNewColumnUnit();
    if (this.hasType) {
        $parent.addClass('bos-widget-column-contents');
        $columnUnit.find('.bo-widget-column-unit-type').css({ display: 'none' });
    }

    if (ChartOptionUtil.isEmpty(index)) {
        $parent.append($unitWrapper);
    } else {
        $($parent.children()[index]).after($unitWrapper);
    }
    $unitWrapper.append($columnUnit);

    this._bindColumnControlUnitEvent($columnUnit, $unitWrapper);
};

ColumnSelectorWidget.prototype._bindColumnControlUnitEvent = function ($target, $targetWrapper) {
    var _this = this;

    $target.click(function () {
        var dialogOption = {
            selectedIndex: $targetWrapper.index(),
            selected: $.extend(true, [], _this.options.selected),
            axisType: _this.options.axisType || '',
            windowPosition: _this.options.windowPosition || 'right',
            switchPosition: 'left',
            aggregationEnabled: _this.options.aggregationEnabled || false,
            aggregationMap: _this.options.aggregationMap,
            getColumns: _this.options.getColumns,
            onChanged: function onChanged(selectedColumn) {
                _this._renderColumnControlUnit($targetWrapper.index(), selectedColumn);
            },
            close: function close(changedValue) {
                _this.options.selected = changedValue;
                _this._fireColumnChanged(changedValue);
                _this._renderColumnControlUnit($targetWrapper.index());
            },
            label: _this.options.label
        };

        _this.columnSelectorDialog = new _columnSelectorDialog2.default($target, dialogOption);
    });

    var $removeButton = $target.find('.bo-widget-column-unit-remove');
    $removeButton.click(function (event) {
        event.stopPropagation();
        _this._triggerDeleteColumn($targetWrapper);
    });

    if (this.options.multiple === true) {
        var $additionalButton = this._createNewAdditionalButton();
        var multipleCnt = _this.options.multipleMaxCnt;
        $targetWrapper.append($additionalButton);
        $additionalButton.click(function () {
            var insertAt = $targetWrapper.index();
            if (multipleCnt && _this.options.selected.length >= multipleCnt) {
                return;
            }

            _this._createColumnControlUnit(insertAt);
            if (_this.options.selected.length === 0) {
                _this.options.selected = [null];
            }
            _this.options.selected.splice(insertAt + 1, 0, null);
            if (multipleCnt && _this.options.selected.length == multipleCnt) {
                $targetWrapper.parent().find('.bo-add-column-btn').css('display', 'none');
            }
            _this._fireColumnChanged(_this.options.selected);
        });
    }
};

ColumnSelectorWidget.prototype._triggerDeleteColumn = function ($unitWrapper) {
    var $parent = this.$mainControl.find('.bo-widget-contents');
    $parent.find('.bo-add-column-btn').css('display', 'block');
    var unitIndex = $unitWrapper.index();

    if ($parent.children().length > 1) {
        this.options.selected.splice(unitIndex, 1);
        $unitWrapper.remove();
    } else {
        this.options.selected[0] = null;
        this._renderColumnControlUnit(0);
    }
    this._fireColumnChanged(this.options.selected);
};

ColumnSelectorWidget.prototype._fireColumnChanged = function (selected) {
    if (!ChartOptionUtil.isEmpty(this.options.onChanged) && this._isChanged(selected)) {
        this.options.onChanged(selected);
    }
};

ColumnSelectorWidget.prototype._createNewUnitWrapper = function () {
    return $('<div class="bos-widget-column-unit-wrapper bo-widget-column-unit-wrapper"></div>');
};

ColumnSelectorWidget.prototype._createNewColumnUnit = function () {
    if (this.hasType) {
        return $('<div class="bo-widget-column-unit bos-widget-column-unit">' + '   <div class="bo-widget-column-unit-type bos-column-unit-type"></div>' + '   <div class="bo-widget-column-unit-label bos-widget-column-unit-label">' + this.defaultMsg + '</div>' + '   <div class="bo-widget-column-unit-remove bos-remove-circle-17"></div>' + '</div>');
    } else {
        return $('' + '<div class="bos-widget-column-unit bo-widget-column-unit">' + '   <div class="bos-widget-column-unit-label bo-widget-column-unit-label">' + this.defaultMsg + '</div>' + '</div>');
    }
};

ColumnSelectorWidget.prototype._createNewAdditionalButton = function () {
    return $('<div class="bo-add-column-btn bos-plus-circle-17 bos-margin-left-5"></div>');
};

ColumnSelectorWidget.prototype._fillColumnControlUnit = function (index) {
    if (ChartOptionUtil.isEmpty(index)) {
        var unitList = this.$mainControl.find('.bo-widget-column-unit-wrapper');
        for (var i = 0; i < unitList.length; i++) {
            this._renderColumnControlUnit(i);
        }
        if (this.options.multiple && this.options.multipleMaxCnt && unitList.length == this.options.multipleMaxCnt) {
            unitList.find('.bo-add-column-btn').css('display', 'none');
        }
    } else {
        console.log('invalid logic...............');
        this._renderColumnControlUnit(index);
    }
};

ColumnSelectorWidget.prototype._renderColumnControlUnit = function (index, inputTarget) {
    var unitList = this.$mainControl.find('.bo-widget-column-unit-wrapper');
    var $unit = $(unitList[index]);

    var targetColumn = inputTarget || this.options.selected[index];
    if (!targetColumn) {
        $unit.find('.bo-widget-column-unit-type').css({ display: 'none' });
    } else {
        $unit.find('.bo-widget-column-unit-type').css({ display: 'flex' });
        var columnInternalType = ChartOptionUtil.getColumnInternalType(targetColumn, this.options.getAllColumns());
        if (columnInternalType === '') {
            this._renderProblem('red', index);
        }
        $unit.find('.bo-widget-column-unit-type').text(columnInternalType);
    }

    $unit.find('.bo-widget-column-unit-label').text(this._getColumnLabel(targetColumn) || '');
    $unit.find('.bo-widget-column-unit-label').attr('title', this._getColumnLabel(targetColumn));
};

ColumnSelectorWidget.prototype._getColumnLabel = function (selectedColumn) {
    var columnLabel;
    if (!selectedColumn) {
        columnLabel = this.defaultMsg;
    } else if ($.isEmptyObject(selectedColumn.aggregation) || selectedColumn.aggregation === 'none') {
        columnLabel = selectedColumn.name;
    } else {
        columnLabel = ChartOptionUtil.getAggregationLabelByValue(selectedColumn.aggregation) + '(' + selectedColumn.name + ')';
    }

    return columnLabel;
};

ColumnSelectorWidget.prototype.renderProblem = function (problems, $wrapper) {
    var _this = this;
    this.$mainControl.find('.bo-widget-column-unit').removeClass('bos-border-color-red');
    this.$mainControl.find('.bo-widget-column-unit').removeClass('bos-border-color-blue');

    if ($.isEmptyObject(problems) || !$.isArray(problems)) {
        return;
    }
    problems.forEach(function (problem) {
        _this.options.problemKeyList.some(function (problemKey) {
            if (problem.key === problemKey && problem.target === _this.options.label) {
                var color;
                if (problem.key === 'axis-001') {
                    color = 'blue';
                } else {
                    color = 'red';
                }
                _this._renderProblem(color, problem.index, $wrapper);
                return true;
            }
        });
    });
};

ColumnSelectorWidget.prototype._clearProblem = function (index, $wrapper) {
    if (ChartOptionUtil.isEmpty(index)) {
        this.$mainControl.find('.bo-widget-column-unit').removeClass('bos-border-color-red');
        this.$mainControl.find('.bo-widget-column-unit').removeClass('bos-border-color-blue');
    } else {
        if ($wrapper) {
            $($wrapper.find('.bo-control-contents-component')[index]).find('.bo-widget-column-unit').removeClass('bos-border-color-red');
            $($wrapper.find('.bo-control-contents-component')[index]).find('.bo-widget-column-unit').removeClass('bos-border-color-blue');
        } else {
            $(this.$mainControl.find('.bos-widget-column-unit-wrapper')[index]).find('.bo-widget-column-unit').removeClass('bos-border-color-red');
            $(this.$mainControl.find('.bos-widget-column-unit-wrapper')[index]).find('.bo-widget-column-unit').removeClass('bos-border-color-blue');
        }
    }
};

ColumnSelectorWidget.prototype._renderProblem = function (color, index, $wrapper) {
    if (ChartOptionUtil.isEmpty(index)) {
        this.$mainControl.find('.bo-widget-column-unit').addClass('bos-border-color-' + color);
    } else {
        if ($wrapper) {
            $($wrapper.find('.bo-control-contents-component')[index]).find('.bo-widget-column-unit').addClass('bos-border-color-' + color);
        } else {
            $(this.$mainControl.find('.bos-widget-column-unit-wrapper')[index]).find('.bo-widget-column-unit').addClass('bos-border-color-' + color);
        }
    }
};

ColumnSelectorWidget.prototype.close = function () {
    if (this.columnSelectorDialog) {
        this.columnSelectorDialog._closeHandler();
    }
};

exports.default = ColumnSelectorWidget;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 30px,
 *      value: ''
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function BaseRadioButtonGroupWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

BaseRadioButtonGroupWidget.prototype = Object.create(_baseWidget2.default.prototype);
BaseRadioButtonGroupWidget.prototype.constructor = BaseRadioButtonGroupWidget;

BaseRadioButtonGroupWidget.prototype._init = function () {
    _baseWidget2.default.prototype._init.call(this);
    this._buttonList = [];
    this._setRadioButtonList();
    this.$buttonObjList = [];
};

BaseRadioButtonGroupWidget.prototype._setRadioButtonList = function () {
    //implement
};

BaseRadioButtonGroupWidget.prototype._createContents = function ($parent) {
    this._isRendered = false;
    this.$radioButtonControl = $('' + '<div class="bos-display-flex bos-widget-button-group-container"/>' + '');
    $parent.append(this.$radioButtonControl);
    this._createRadioBtnGrpUnits();
    this._renderButtonSelected(this.options.value);
    this._setPreValue(this.options.value);
    this._isRendered = true;
};

BaseRadioButtonGroupWidget.prototype._renderButtonSelected = function (selectedValue) {
    var selectedBtn = this.$buttonObjList.find(function (btn) {
        return btn.attr('id') === selectedValue;
    });
    if (selectedBtn) {
        selectedBtn.jqxToggleButton('check');
    } else {
        this.$buttonObjList.forEach(function ($el) {
            return $el.jqxToggleButton('unCheck');
        });
    }
};

BaseRadioButtonGroupWidget.prototype._createRadioBtnGrpUnits = function () {
    var btnSetList = this._buttonList;

    for (var btnSetIdx = 0; btnSetIdx < btnSetList.length; btnSetIdx++) {
        var $radioButton = $('<input type="button" class="bos-flex-1 bos-background-image"></div>');
        this.$radioButtonControl.append($radioButton);

        if (btnSetList[btnSetIdx].imageClass) {
            $radioButton.addClass(btnSetList[btnSetIdx].imageClass);
        }

        if (btnSetList[btnSetIdx].label) {
            $radioButton.attr('value', btnSetList[btnSetIdx].label);
        }

        $radioButton.attr('id', btnSetList[btnSetIdx].value);

        $radioButton.jqxToggleButton({
            theme: _chartOptionConst2.default.Theme,
            height: this.options.height || '30px'
        });

        this.$buttonObjList.push($radioButton);
        this._createClickEvent($radioButton);
    }
};

BaseRadioButtonGroupWidget.prototype._createClickEvent = function ($radioButton) {
    var _this = this;
    $radioButton.on('click', function (event) {
        var selectedBtnId = $(event.target).attr('id');
        //set another buttons disabled.
        _this.$buttonObjList.forEach(function (btn) {
            if (btn.attr('id') !== selectedBtnId) {
                btn.jqxToggleButton('unCheck');
            } else {
                btn.jqxToggleButton('check');
            }
        });

        //call onChanged function
        if (ChartOptionUtil.isEmpty(_this.options.onChanged) || _this._isRendered === false) return;
        if (!_this._isChanged(selectedBtnId)) return;
        _this.options.onChanged(selectedBtnId);
    });
};

BaseRadioButtonGroupWidget.prototype.toggleDisable = function (disabledVal) {
    this.$buttonObjList.forEach(function ($btn) {
        $btn.jqxToggleButton({ disabled: disabledVal });
        $btn.addClass('jqx-fill-state-disabled jqx-fill-state-disabled-office');
    });
};

BaseRadioButtonGroupWidget.prototype.unselect = function () {
    this.options.value = null;
    this._setPreValue(null);
    this.render(null);
};

BaseRadioButtonGroupWidget.prototype.render = function (changedValue) {
    this._renderButtonSelected(changedValue);
};

exports.default = BaseRadioButtonGroupWidget;

/***/ }),
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dialog = __webpack_require__(42);

var _dialog2 = _interopRequireDefault(_dialog);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChartWidget = Brightics.Chart.Widget; /**
                                           * Created by sds on 2018-04-09.
                                           */

/**
 *  options = {
 *      value: '',
 *      chartTypeList: [],
 *      onChanged: function(){]
 *  }
 *
 */

function FormatHelperDialog(parentId, options) {
    _dialog2.default.call(this, parentId, options);
}

FormatHelperDialog.prototype = Object.create(_dialog2.default.prototype);
FormatHelperDialog.prototype.constructor = FormatHelperDialog;

FormatHelperDialog.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this.options.showHeader = false;
};

// FormatHelperDialog.prototype._getTitle = function () {
//     return 'Format Example';
// };

FormatHelperDialog.prototype._getDefaultWindowOption = function () {
    var _this = this;

    return {
        theme: _chartOptionConst2.default.Theme,
        width: '170px',
        height: '110px',
        maxWidth: '200px',
        resizable: false,
        initContent: function initContent() {
            _this._configurePosition(_this.options.windowPosition);
            _this._createDialogContentsArea(_this.$mainControl.find('.bo-dialogs-contents'));
        }
    };
};

FormatHelperDialog.prototype._createDialogContentsArea = function ($parent) {
    var $exampleText = $('<div>' + '   <div class="bos-font-bold">All Types</div>' + '   <div class="bos-margin-left-5">${value}: 13.25 > $13.25<br></div>' + '   <div class="bos-font-bold">Number Type</div>' + '   <div class="bos-margin-left-5">' + '       {0,0}: 145000 > 145,000<br>' + '       {0.00}: 130.4721 > 130.47<br>' + '   </div>' + '</div>');

    $exampleText.css('line-height', '1.6');
    $parent.append($exampleText);
};

FormatHelperDialog.prototype._destroy = function () {
    $(window).off('mousedown', this._closeHandler);
    this.$mainControl.jqxWindow('destroy');
    this.$mainControl.remove();
};

FormatHelperDialog.prototype._getItemList = function () {
    if (this.options.itemList) {
        return this.options.itemList;
    } else {
        return [];
    }
};

FormatHelperDialog.prototype._getDialogResult = function () {
    return this.$itemListContainer.find('.selected .bo-widget-item-selector-item').attr('item-value');
};

exports.default = FormatHelperDialog;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filterControlFactory = __webpack_require__(123);

var FilterControlFactory = _interopRequireWildcard(_filterControlFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function FilterControl(parentId, options) {
    this.parentId = parentId;
    this.options = options;
    this.retrieveParent();
    this.createContents();
} /**
   * Source: filter-control-base.js
   * Created by ji_sung.park on 2017-09-25.
   */

FilterControl.prototype.retrieveParent = function () {
    this.$parent = typeof this.parentId === 'string' ? $(this.parentId) : this.parentId;
};

FilterControl.prototype.createContents = function () {
    this.$mainContent = $('' + '<div>' + '   <div class="bf-control-content-header-area bfs-control-content-header-area bfs-display-flex bfs-flex-space-between">' + '       <div>Condition</div>' + '       <div class="bf-control-change-filter-button bfs-control-change-filter-button"></div>' + '   </div>' + '   <div class="bf-control-content-control-area bfs-control-content-control-area"></div>' + '</div>' + '');

    this.$parent.append(this.$mainContent);

    this.$changeFilterButton = this.$mainContent.find('.bf-control-change-filter-button');
    this.$controlArea = this.$mainContent.find('.bf-control-content-control-area');

    this.bindChangeFilterButtonClickEvent(this.$changeFilterButton);
    this.createControlArea(this.$controlArea);
    if (this.options.getFilteredValues()) this.setSelected(this.options.getFilteredValues());
};

FilterControl.prototype.createControlArea = function ($parent) {};

FilterControl.prototype.bindChangeFilterButtonClickEvent = function ($parent) {
    var _this = this;
    $parent.on('click', function (event) {
        var filterId = _this.options.filterId;

        var $contextMenu = $("#bf-context-menu"),
            point,
            menuPoint;

        $contextMenu.jqxMenu('close');
        var scrollTop = $(window).scrollTop();
        var scrollLeft = $(window).scrollLeft();
        point = {
            x: parseInt(event.clientX) + scrollLeft,
            y: parseInt(event.clientY) + scrollTop
        };

        if (point) {
            $.each(FilterControlFactory.getFilterTypes(), function (index, type) {
                var id = 'bfs-context-menu-switch-item-' + type;
                $contextMenu.jqxMenu('disable', id, _this.getType() === type);
            });

            var isContinuous = _this._isContinuous();

            if (_this.options.values.length < 2 || !isContinuous) {
                var id = 'bfs-context-menu-switch-item-RangeSlider';
                $contextMenu.jqxMenu('disable', id, true);
            } else if (_this.options.values.length > 5) {
                var id = 'bfs-context-menu-switch-item-CheckBox';
                $contextMenu.jqxMenu('disable', id, true);
            } else if (_this.options.values.length > 50) {
                var id = 'bfs-context-menu-switch-item-ListBox';
                $contextMenu.jqxMenu('disable', id, true);
            }

            menuPoint = _this.getContextMenuPoint($contextMenu.width(), $contextMenu.height(), point.x, point.y);
            $contextMenu.data('filterId', _this.options.filterId);
            $contextMenu.data('chartId', _this.options.chartId);
            $contextMenu.jqxMenu('open', menuPoint.x, menuPoint.y);
            $contextMenu.on('shown', function () {
                $.each($('div.jqx-menu-popup.jqx-menu-popup'), function (index, menuDiv) {
                    if ($(menuDiv).css('display') == 'block') {
                        if (menuDiv.offsetHeight + menuDiv.offsetTop > $(window).height()) {
                            menuDiv.style.top = $(window).height() - menuDiv.offsetHeight + 'px';
                        }
                        if (menuDiv.offsetLeft + menuDiv.offsetWidth > $(window).width()) {
                            menuDiv.style.left = menuDiv.offsetLeft - menuDiv.offsetWidth - $contextMenu.width() + 5 + 'px';
                        }
                    }
                });
            });
        }
    });
};

FilterControl.prototype._isContinuous = function () {
    if (!this.options.getFilteredValues()) return true;else {
        if ($.isPlainObject(this.options.getFilteredValues())) return true;else {
            var minIndex = this.options.values.indexOf(this.options.getFilteredValues()[0]);
            var maxIndex = this.options.values.indexOf(this.options.getFilteredValues()[this.options.getFilteredValues().length - 1]);
            if (maxIndex + 1 - minIndex === this.options.getFilteredValues().length) return true;
        }
    }
    return false;
};

FilterControl.prototype.getType = function () {
    return 'NONE';
};

FilterControl.prototype.getContextMenuPoint = function (menuWidth, menuHeight, pointX, pointY) {
    var openPoint = {};

    var winWidth = $(window).width();
    var winHeight = $(window).height();
    if (winWidth < menuWidth + pointX + 3) {
        openPoint.x = pointX - menuWidth - 3;
    } else {
        openPoint.x = pointX + 3;
    }

    if (winHeight < menuHeight + pointY + 3) {
        openPoint.y = pointY - menuHeight - 3;
    } else {
        openPoint.y = pointY + 3;
    }

    return openPoint;
};

FilterControl.prototype.getSelected = function () {
    return this._isSelected;
};

FilterControl.prototype.setSelected = function () {};

FilterControl.prototype.destroy = function () {
    this.$mainContent.remove();
    this._isSelected = null;
};

exports.default = FilterControl;

/***/ }),
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionRegister = __webpack_require__(117);

var ChartOptionRegistry = _interopRequireWildcard(_chartOptionRegister);

var _chartOptionUtil = __webpack_require__(30);

var _autoOptionSelector = __webpack_require__(295);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Created by SDS on 2017-05-10.
 */

var ChartWidget = Brightics.Chart.Widget;


/**
 *
 * @param parentId
 * @param options = {
       chartOption: {
            chart: {
                type: 'area',
                ...
            },
            ...
       },
       onChanged: function (chartOption) {
       },
       dataSource: {
            selectable: true (default: false),
            getDataSourceList: function(){
            }
            getDataSourceColumnList: function(dataSourceId){
            }
       },
       chartTypeSelectable: false (default: true),
       getControlContainerList: function(defaultControls){
           return defaultControls;
       }
  }
 */

/**
 * @constructor
 */
function ChartOption(parentId, options) {
    var defaultChartOptions = Brightics.Chart.getChartAttr(options.chartOption.chart.type).DefaultOptions;

    var chartOption = (0, _chartOptionUtil.mergeChartOption)(defaultChartOptions, options.chartOption);

    var opt = $.extend(true, {}, {
        dataSource: {},
        setting: {},
        chartTypeSelectable: true,
        chartOptionAPI: {
            setChartOptions: this.setChartOptions.bind(this),
            reloadColumnSelectorSetting: this.reloadColumnSelectorSetting.bind(this)
        }
    }, options);
    opt.chartOption = chartOption;
    ChartWidget.call(this, parentId, opt);
}

ChartOption.prototype = Object.create(ChartWidget.prototype);
ChartOption.prototype.constructor = ChartOption;

ChartOption.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this.options.onChanged = this._onChanged.bind(this);
    this._validateChartOption();
};

ChartOption.prototype._validateChartOption = function ($parent) {
    if (this.options.dataSource.selectable) {
        if (!(this.options.dataSource.getDataSourceList && this.options.dataSource.getDataSourceColumnList)) {
            this._setDataSourceOption();
        }
    }
};

ChartOption.prototype._setDataSourceOption = function () {
    var sourceList;
    var dataSrcOption = this.options.dataSource;
    if (this.options.chartOption.source.dataType === 'lazy') {
        sourceList = this.options.chartOption.source.lazyData;
    } else {
        sourceList = this.options.chartOption.source.localData;
    }
    dataSrcOption.getDataSourceList = function () {
        var dataSourceList = [];
        for (var dataIdx = 0; dataIdx < sourceList.length; dataIdx++) {
            dataSourceList.push({
                value: sourceList[dataIdx].id.value,
                label: sourceList[dataIdx].id.label,
                dataSourceIndex: dataIdx
            });
        }
        return dataSourceList;
    };
    dataSrcOption.getDataSourceColumnList = function (id) {
        var dataSrcColumn = [];
        return sourceList.find(function (dataSrc) {
            return dataSrc.id.value == id;
        }).columns();
    };
};

ChartOption.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bo-container bos-container bos-relative-full"></div>');
    $parent.append(this.$mainControl);

    this.$controlWrapper = $('<div/>');
    this.$mainControl.append(this.$controlWrapper);

    try {
        this.chartOptionControl = ChartOptionRegistry.createChartOptionControl(this.options.chartOption.chart.type, this.$controlWrapper, this.options);
    } catch (err) {
        this.chartOptionControl = null;
        this._createErrContents();
        console.error(err);
    }

    this.$mainControl.perfectScrollbar();
    var _this = this;

    this.$mainControl.parents('.ps-container').on('scroll', function () {
        if (_this.chartOptionControl != null) {
            _this.chartOptionControl.close();
        }
    });
    this.$mainControl.on('scroll', function () {
        if (_this.chartOptionControl != null) {
            _this.chartOptionControl.close();
        }
    });
    this.resizeHandler = function () {
        if (_this.chartOptionControl != null) {
            _this.chartOptionControl.close();
        }
    };
    $(window).resize(this.resizeHandler);
};

ChartOption.prototype._createErrContents = function () {};

ChartOption.prototype._onChanged = function (chartOptionAPI, param, forced) {
    if (!this.options.callBack) return;

    if (typeof this.options.callBack[chartOptionAPI] === 'function') {
        this.options.callBack[chartOptionAPI](param || this.options.chartOption, forced);
    }
    //FIXME: 수정필요
    if (chartOptionAPI !== 'onChartTypeChanged') {
        this.chartOptionControl.doValidate();
    }
    this.chartOptionControl.renderProblem();
    this.chartOptionControl.renderWarning();
};

ChartOption.prototype.destroy = function () {
    ChartWidget.prototype.destroy.call(this);

    if (this.resizeHandler) {
        $(window).off('resize', this.resizeHandler);
        this.resizeHandler = null;
    }
    this.chartOptionControl.destroy();
    this.chartOptionControl = null;
    this.$mainControl.remove();
};

/*
 * @param options = {
 chart: {
 type: 'area',
 ...
 },
 }
 */
//Control Container 전체 render
ChartOption.prototype.setChartOptions = function (options) {
    // if (options.chart.type && options.chart.type !== this.options.chartOption.chart.type) {
    //     this.chartOptionControl.destroy();
    //     this.chartOptionControl = ChartOptionRegistry.createChartOptionControl(options.chart.type, this.$controlWrapper, this.options);
    // }
    var defaultChartOptions = Brightics.Chart.getChartAttr(options.chart.type).DefaultOptions;
    var colorSet = (options.colorSet || defaultChartOptions.colorSet).slice();
    this.options.chartOption = $.extend(true, {}, defaultChartOptions, { source: this.options.chartOption.source }, options);
    this.options.chartOption.colorSet = colorSet;
    // this.chartOptionControl.render();

    //FIXME: 무조건 destroy 후 redraw(render완성되면 삭제하고 위 코드 사용)
    if (this.chartOptionControl) this.chartOptionControl.destroy();
    this.chartOptionControl = ChartOptionRegistry.createChartOptionControl(options.chart.type, this.$controlWrapper, this.options);

    return this.options.chartOption; //FIXME: getChartOptions로 구분해야할듯
};

ChartOption.prototype.show = function () {
    ChartWidget.prototype.show.call(this);
    this.$mainControl.perfectScrollbar('update');
};

ChartOption.prototype.hide = function () {
    ChartWidget.prototype.hide.call(this);
};

//특정 Control Container만 render
ChartOption.prototype.reloadColumnSelectorSetting = function () {
    this.chartOptionControl.reloadColumnSelectorSetting();
};

ChartOption.prototype.getColumnSelectorSetting = function () {
    //TODO MAP Chart인 경우 처리 어떻게 해야 하는지 확인 필요
    if (this.chartOptionControl.options.setting.columnSelector.constructor !== Array) {
        return [];
    }
    return this.chartOptionControl.options.setting.columnSelector;
};

ChartOption.prototype.getOptions = function () {
    return this.options;
};

exports.default = ChartOption;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerChartOptionControl = registerChartOptionControl;
exports.getChartOptionControlList = getChartOptionControlList;
exports.getChartOptionControl = getChartOptionControl;
exports.createChartOptionControl = createChartOptionControl;

var _chartOptionIndex = __webpack_require__(562);

var _chartOptionIndex2 = _interopRequireDefault(_chartOptionIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chartOption = {}; /**
                       * Source: chart-option-register.js
                       * Created by ji_sung.park on 2018-05-30
                       */

_init();

function _init() {
    var chartTypeList = Object.keys(_chartOptionIndex2.default);
    chartTypeList.forEach(function (chartType) {
        chartOption[chartType] = _chartOptionIndex2.default[chartType];
    });
}

exports.default = chartOption;
function registerChartOptionControl(option) {
    if ($.isEmptyObject(chartOption)) {
        console.log('chart option register is empty');
    }
    chartOption[option.Key] = option.Func;
}

function getChartOptionControlList() {
    return chartOption;
}

function getChartOptionControl(chartType) {
    return chartOption[chartType];
}

function createChartOptionControl(chartType, parentId, options) {
    if (!chartOption[chartType] || !parentId || !options) {
        throw new Error('Cannot create chart option control. ' + chartType);
    }
    return new chartOption[chartType](parentId, options);
}

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionAreaStacked = __webpack_require__(291);

var _chartOptionAreaStacked2 = _interopRequireDefault(_chartOptionAreaStacked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

function AreaChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

AreaChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
AreaChartOption.prototype.constructor = AreaChartOption;

AreaChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: _this.options.chartOption.colorBy[0]
    }]];

    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);

    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.marker = this.options.chartOption.plotOptions.area.marker;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.area.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.area.tooltip;
    this.options.setting.showSymbol = this.options.chartOption.plotOptions.area.showSymbol;
};

AreaChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = AreaChartOption;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Data = Data;
exports.ComplexData = ComplexData;
exports.Format = Format;
exports.FormatCard = FormatCard;
exports.Title = Title;
exports.Axis = Axis;
exports.AxisR = AxisR;
exports.AxisEach = AxisEach;
exports.AxisRadar = AxisRadar;
exports.Legend = Legend;
exports.CustomLegend = CustomLegend;
exports.VisualMap = VisualMap;
exports.Marker = Marker;
exports.MarkerLine = MarkerLine;
exports.Lines = Lines;
exports.LinesWithTrend = LinesWithTrend;
exports.Frame = Frame;
exports.FrameStyle = FrameStyle;
exports.FramePie = FramePie;
exports.FrameDonut = FrameDonut;
exports.ToolTip = ToolTip;
exports.Label = Label;
exports.Figure = Figure;
exports.MapData = MapData;
exports.MapStyle = MapStyle;
exports.Layers = Layers;
exports.ToolTipTrigger = ToolTipTrigger;
exports.Grid = Grid;
/**
 * Source: control-container-preview.js
 * Created by SDS on 2018-05-30
 */

var _axisTypePreview = function _axisTypePreview() {
    var preViewText = '',
        axisAttrUsed = false;
    if (this.options.chartOption.xAxis[0].min || this.options.chartOption.xAxis[0].max || this.options.chartOption.yAxis[0].min || this.options.chartOption.yAxis[0].max) {
        preViewText += 'Range';
        axisAttrUsed = true;
    }
    if (this.options.chartOption.xAxis[0].title.show || this.options.chartOption.yAxis[0].title.show) {
        preViewText = preViewText === '' ? 'Title' : preViewText += ', Title';
        axisAttrUsed = true;
    }
    if (this.options.chartOption.xAxis[0].axisLabel.show || this.options.chartOption.yAxis[0].axisLabel.show) {
        preViewText = preViewText === '' ? 'Label' : preViewText += ', Label';
        axisAttrUsed = true;
    }
    return axisAttrUsed ? preViewText + ' ON' : 'OFF';
};

function Data() {
    //TODO: multichart 고려안됨
    var preViewText = '';
    var columnList = this.options.setting.columnSelector[0];
    if (columnList && columnList.length > 0) {
        columnList.forEach(function (columnInfo) {
            if (columnInfo.ref.selected && columnInfo.ref.selected.length > 0 && columnInfo.ref.selected[0] !== null) {
                preViewText = preViewText === '' ? columnInfo.label : preViewText += ', ' + columnInfo.label;
            }
        });
    }

    var itemSelector = this.options.setting.itemSelector;
    if (itemSelector && itemSelector.length > 0) {
        itemSelector[0].forEach(function (itemInfo) {
            if (itemInfo.ref.selected && itemInfo.ref.selected !== '') {
                preViewText = preViewText === '' ? itemInfo.label : preViewText += ', ' + itemInfo.label;
            }
        });
    }

    var onOffSwitch = this.options.setting.onOffSwitch;
    if (onOffSwitch && onOffSwitch.length > 0) {
        onOffSwitch[0].forEach(function (switchInfo) {
            if (switchInfo.ref && switchInfo.ref !== '') {
                preViewText = preViewText === '' ? switchInfo.label : preViewText += ', ' + switchInfo.label;
            }
        });
    }

    return preViewText;
}

function ComplexData() {
    //TODO: multichart 고려안됨
    var preViewText = '';
    var columnList = this.options.setting.columnSelector[0];
    if (columnList && columnList.length > 0) {
        columnList.forEach(function (columnInfo) {
            if (columnInfo.ref.selected && columnInfo.ref.selected.length > 0 && columnInfo.ref.selected[0] !== null) {
                preViewText = preViewText === '' ? columnInfo.label : preViewText += ', ' + columnInfo.label;
            }
        });
    }

    var itemSelector = this.options.setting.itemSelector;
    if (itemSelector && itemSelector.length > 0) {
        itemSelector[0].forEach(function (itemInfo) {
            if (itemInfo.ref.selected && itemInfo.ref.selected !== '') {
                preViewText = preViewText === '' ? itemInfo.label : preViewText += ', ' + itemInfo.label;
            }
        });
    }
    return preViewText;
}

function Format() {
    return '';
}

function FormatCard() {
    return '';
}

function Title() {
    var preViewText = '';
    if (this.options.chartOption.title.show) {
        preViewText = preViewText + this.options.chartOption.title.text;
        if (this.options.chartOption.title.subtext !== '') {
            preViewText = preViewText + ' / ' + this.options.chartOption.title.subtext;
        }
    }
    return preViewText && preViewText !== '' ? preViewText : 'OFF';
}

function Axis() {
    return _axisTypePreview.call(this);
}

function AxisR() {
    return _axisTypePreview.call(this);
}

function AxisEach() {
    return _axisTypePreview.call(this);
}

function AxisRadar() {
    var preViewText = [];
    var axisAttrUsed = false;
    var min = this.options.chartOption.plotOptions.radar.min;
    var max = this.options.chartOption.plotOptions.radar.max;
    var show = this.options.chartOption.plotOptions.radar.name.show;

    if (min || max) {
        preViewText.push('Range');
        axisAttrUsed = true;
    }
    if (show) {
        preViewText.push('Label');
        axisAttrUsed = true;
    }
    return axisAttrUsed ? preViewText.join(', ') + ' ON' : 'OFF';
}

function Legend() {
    return this.options.chartOption.legend.show ? 'ON' : 'OFF';
}

function CustomLegend() {
    return Legend.call(this);
}

function VisualMap() {
    return this.options.chartOption.legend.show ? 'ON' : 'OFF';
}

function Marker() {
    var $previewDiv = $('<div class="bos-simple-square bos-display-flex bos-flex-wrap"></div>');
    var border = '1px solid rgba(0, 0, 0, 0.6)';
    $previewDiv.css({
        border: border
    });
    for (var colorSetIdx = 0; colorSetIdx < 4; colorSetIdx++) {
        var $miniDiv = $('<div></div>');
        if (colorSetIdx === 0) {
            $miniDiv.css({
                'border-right': border,
                'border-bottom': border
            });
        } else if (colorSetIdx === 1) {
            $miniDiv.css({
                'border-bottom': border
            });
        } else if (colorSetIdx === 2) {
            $miniDiv.css({
                'border-right': border
            });
        }
        $miniDiv.css({
            width: '8.5px',
            height: '8.5px',
            background: this.options.chartOption.colorSet[colorSetIdx] || 'transparent'
        });
        $previewDiv.append($miniDiv);
    }
    return $previewDiv;
}

function MarkerLine() {
    var $previewDiv = $('<div class="bos-simple-square bos-display-flex bos-flex-wrap"></div>');
    var border = '1px solid rgba(0, 0, 0, 0.6)';
    $previewDiv.css({
        border: border
    });
    for (var colorSetIdx = 0; colorSetIdx < 4; colorSetIdx++) {
        var $miniDiv = $('<div></div>');
        if (colorSetIdx === 0) {
            $miniDiv.css({
                'border-right': border,
                'border-bottom': border
            });
        } else if (colorSetIdx === 1) {
            $miniDiv.css({
                'border-bottom': border
            });
        } else if (colorSetIdx === 2) {
            $miniDiv.css({
                'border-right': border
            });
        }
        $miniDiv.css({
            width: '8.5px',
            height: '8.5px',
            background: this.options.chartOption.colorSet[colorSetIdx] || 'transparent'
        });
        $previewDiv.append($miniDiv);
    }
    return $previewDiv;
}

function Lines() {
    var $previeDivParent = $('<div/>');
    var stripLineList = this.options.setting.stripLine.data[0];
    var defaultLineStyle = this.options.setting.stripLine.lineStyle || {
        'normal': {
            'color': '#000000',
            'type': 'solid'
        }
    };
    var maxLinePreviewCnt = 6,
        totalCnt = 0;
    for (var axisKey in stripLineList) {
        if (stripLineList[axisKey] && stripLineList[axisKey].length > 0) {
            for (var linePreviewCnt = 0; linePreviewCnt < stripLineList[axisKey].length; linePreviewCnt++) {
                var lineInfo = stripLineList[axisKey][linePreviewCnt];
                if ($.isEmptyObject(lineInfo) || lineInfo.display == false) continue;
                var $previeDiv = $('<div class="bos-simple-square"></div>');
                var slashDiv = $('<div class="bos-slash"></div>');
                $previeDiv.css({
                    border: '1px solid rgba(0, 0, 0, 0.6)',
                    'margin-right': '2px'
                });
                var borderStyle = '2px' + (lineInfo.lineStyle && lineInfo.lineStyle.normal.color ? ' ' + lineInfo.lineStyle.normal.color : ' ' + defaultLineStyle.normal.color) + (lineInfo.lineStyle && lineInfo.lineStyle.normal.type ? ' ' + lineInfo.lineStyle.normal.type : ' ' + defaultLineStyle.normal.type);
                slashDiv.css({
                    'border-top': borderStyle
                });
                $previeDiv.append(slashDiv);
                $previeDivParent.append($previeDiv);
                totalCnt++;
            }
        }
    }

    if (totalCnt === 0) {
        return 'OFF';
    } else {
        return $previeDivParent.children();
    }
}

function LinesWithTrend() {
    var $previeDivParent = $('<div/>');
    var stripLineList = this.options.setting.stripLine.data[0];
    var defaultLineStyle = this.options.setting.stripLine.lineStyle || {
        'normal': {
            'color': '#000000',
            'type': 'solid'
        }
    };
    var maxLinePreviewCnt = 6,
        totalCnt = 0;
    for (var axisKey in stripLineList) {
        if (stripLineList[axisKey] && stripLineList[axisKey].length > 0) {
            for (var linePreviewCnt = 0; linePreviewCnt < stripLineList[axisKey].length; linePreviewCnt++) {
                var lineInfo = stripLineList[axisKey][linePreviewCnt];
                if ($.isEmptyObject(lineInfo) || lineInfo.display == false) continue;
                var $previeDiv = $('<div class="bos-simple-square"></div>');
                var slashDiv = $('<div class="bos-slash"></div>');
                $previeDiv.css({
                    border: '1px solid rgba(0, 0, 0, 0.6)',
                    'margin-right': '2px'
                });
                var borderStyle = '2px' + (lineInfo.lineStyle && lineInfo.lineStyle.normal.color ? ' ' + lineInfo.lineStyle.normal.color : ' ' + defaultLineStyle.normal.color) + (lineInfo.lineStyle && lineInfo.lineStyle.normal.type ? ' ' + lineInfo.lineStyle.normal.type : ' ' + defaultLineStyle.normal.type);
                slashDiv.css({
                    'border-top': borderStyle
                });
                $previeDiv.append(slashDiv);
                $previeDivParent.append($previeDiv);
                totalCnt++;
            }
        }
    }
    if (this.options.setting.trendLine && this.options.setting.trendLine.data[0]) {
        var trendLineList = this.options.setting.trendLine.data[0];
        for (var axisKey in trendLineList) {
            if (trendLineList[axisKey] && trendLineList[axisKey].length > 0) {
                for (var linePreviewCnt = 0; linePreviewCnt < trendLineList[axisKey].length; linePreviewCnt++) {
                    var lineInfo = trendLineList[axisKey][linePreviewCnt];
                    if ($.isEmptyObject(lineInfo) || lineInfo.display == false) continue;
                    var $previeDiv = $('<div class="bos-simple-square"></div>');
                    var slashDiv = $('<div class="bos-slash"></div>');
                    $previeDiv.css({
                        border: '1px solid rgba(0, 0, 0, 0.6)',
                        'margin-right': '2px'
                    });
                    var borderStyle = '2px' + (lineInfo.lineStyle && lineInfo.lineStyle.normal.color ? ' ' + lineInfo.lineStyle.normal.color : ' ' + defaultLineStyle.normal.color) + (lineInfo.lineStyle && lineInfo.lineStyle.normal.type ? ' ' + lineInfo.lineStyle.normal.type : ' ' + defaultLineStyle.normal.type);
                    slashDiv.css({
                        'border-top': borderStyle
                    });
                    $previeDiv.append(slashDiv);
                    $previeDivParent.append($previeDiv);
                    totalCnt++;
                }
            }
        }
    }

    if (totalCnt === 0) {
        return 'OFF';
    } else {
        return $previeDivParent.children();
    }
}

function Frame() {
    var $previewDiv = $('<div class="bos-simple-square"></div>');
    $previewDiv.css({
        border: this.options.chartOption.chart.border,
        background: this.options.chartOption.chart.background
    });
    return $previewDiv;
}

function FrameStyle() {
    var $previewDiv = $('<div class="bos-simple-square"></div>');
    $previewDiv.css({
        border: this.options.chartOption.chart.border,
        background: this.options.chartOption.chart.background
    });
    return $previewDiv;
}

function FramePie() {
    var $previewDiv = $('<div class="bos-simple-square"></div>');
    $previewDiv.css({
        border: this.options.chartOption.chart.border,
        background: this.options.chartOption.chart.background
    });
    return $previewDiv;
}

function FrameDonut() {
    var $previewDiv = $('<div class="bos-simple-square"></div>');
    $previewDiv.css({
        border: this.options.chartOption.chart.border,
        background: this.options.chartOption.chart.background
    });
    return $previewDiv;
}

function ToolTip() {
    var preViewText = '';
    if (this.options.chartOption.tooltip.triggerOn === 'click') preViewText = 'Click';else preViewText = 'Mouse Move';
    return preViewText;
}

function Label() {
    var labelShow = this.options.setting.labelSettings.some(function (setting) {
        return setting.ref.show;
    });
    return labelShow ? 'ON' : 'OFF';
}

function Figure() {
    if (this.options.chartOption.chart.type != 'decisionTree') {
        return;
    }
    var $previeDiv = $('<div class="bos-simple-circle bos-display-flex bos-flex-wrap"></div>');
    var border = '3px solid ' + this.options.chartOption.plotOptions.decisionTree.style.link.color[0];
    $previeDiv.css({
        border: border,
        'background-color': this.options.chartOption.plotOptions.decisionTree.style.node.color[0]
    });
    return $previeDiv;
}

function MapData() {
    var preViewText = this.options.chartOption.plotOptions.map.mapName || '';
    return preViewText;
}

function MapStyle() {
    var $previewbackDiv = $('<div class="bos-simple-square"></div>');
    $previewbackDiv.css({
        border: this.options.chartOption.chart.border,
        background: this.options.chartOption.chart.background
    });
    var $previewareaDiv = $('<div class="bos-simple-square"></div>');
    $previewareaDiv.css({
        border: this.options.chartOption.plotOptions.map.mapStyle.itemStyle.normal.borderColor,
        background: this.options.chartOption.plotOptions.map.mapStyle.itemStyle.normal.areaColor
    });
    return $previewareaDiv; //$previewbackDiv;//+$previewareaDiv;
}

function Layers() {
    var cntScatter = 0;
    var cntLine = 0;
    if (this.options.chartOption.plotOptions.map.layers.length > 0) {
        for (var ele in this.options.chartOption.plotOptions.map.layers) {
            if (this.options.chartOption.plotOptions.map.layers[ele].type == 'lines') {
                cntLine++;
            } else {
                cntScatter++;
            }
        }
        var previewText = '';
        if (cntScatter > 0) previewText += 'Point: ' + cntScatter;
        if (cntLine > 0) previewText += ' Line: ' + cntLine;
        return previewText;
    } else return '';
}

function ToolTipTrigger() {
    var preViewText = '';
    if (this.options.chartOption.tooltip.triggerOn === 'click') {
        preViewText += 'Click';
    } else {
        preViewText += 'Mouse Move';
    }
    if (this.options.setting.tooltip.trigger === 'axis') {
        preViewText += ', Axis';
    } else {
        preViewText += ', Item';
    }
    return preViewText;
}

function Grid() {
    return '';
}

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dialog = __webpack_require__(42);

var _dialog2 = _interopRequireDefault(_dialog);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2016-08-20.
 */

var selectableColumnType = Brightics.Chart.Validator.selectableColumnType;

/**
 * options = {
 *      column : [
            {name:'SepalLength','type':'number'},
            {name:'SepalWidth','type':'number'},
            {name:'PetalLength','type':'number'},
            {name:'PetalWidth','type':'number'},
            {name:'Species','type':'string'},
            {name:'Class','type':'string'},
        ],
        selected: [{name: 'SepalLength', aggregation: 'none' }],
        selectedIndex: 0,
        unique: true, (default: false)
        aggregation: true (default : false),
        aggregationMandatory: false (aggregation이 true 일 경우만 사용 가능 default : false),
        label: 'X-axis' (mandantory),
        onChanged: function(){],
        close: function(){}
 * }
 */
var aggregationMap = _chartOptionConst2.default.AggregationMap;

function ColumnSelectorDialog(parentId, options) {
    _dialog2.default.call(this, parentId, options);
}

ColumnSelectorDialog.prototype = Object.create(_dialog2.default.prototype);
ColumnSelectorDialog.prototype.constructor = ColumnSelectorDialog;

ColumnSelectorDialog.prototype._getTitle = function () {
    return 'Select Column' + (this.options.label ? '(' + this.options.label + ')' : '');
};

ColumnSelectorDialog.prototype._getDefaultWindowOption = function () {
    var _this = this;
    var defaultOption = {
        theme: _chartOptionConst2.default.Theme,
        width: '300px',
        height: '400px',
        maxWidth: '300px',
        maxHeight: '400px',
        resizable: false,
        initContent: function initContent() {
            _this._configurePosition();
            _this._createDialogContentsArea(_this.$mainControl.find('.bo-dialogs-contents'));
        }
    };
    if (this.options.aggregationEnabled === true) {
        defaultOption.width = '600px';
        defaultOption.maxWidth = '600px';
    }
    return defaultOption;
};

ColumnSelectorDialog.prototype._createDialogContentsArea = function ($parent) {
    this.$mainContainer = $('<div class="bos-display-flex bos-full"></div>');
    this.$columnArea = $('<div class="bos-display-flex bos-flex-1 bos-flex-direction-column"></div>');
    $parent.append(this.$mainContainer);
    this.$mainContainer.append(this.$columnArea);

    this._createFilterContents(this.$columnArea);
    this._createColumnListContents(this.$columnArea);
    this._createAggregationListContents(this.$mainContainer);
    this._render();
};

ColumnSelectorDialog.prototype._createFilterContents = function ($parent) {
    var _this = this;
    var $container = $('<div class="bos-dialog-filter-container"></div>');
    $parent.append($container);

    this.$filterControl = $('<input type="search" placeholder="Search Column" />');
    $container.append(this.$filterControl);

    this.$filterControl.jqxInput({
        theme: _chartOptionConst2.default.Theme,
        placeHolder: "Search Column",
        height: 31,
        minLength: 1
    });

    this.$filterControl.on('keyup search', function (event) {
        var colList = _this.$columnListBox.find('.bo-dialog-column-item-wrapper');
        var searchText = _this.$filterControl.val().toLowerCase();
        for (var i = 0; i < colList.length; i++) {
            var colName = $(colList[i]).attr('value').toLowerCase();
            if (colName.indexOf(searchText) < 0) {
                $(colList[i]).hide();
            } else {
                $(colList[i]).show();
            }
        }
    });
};

ColumnSelectorDialog.prototype._createColumnListContents = function ($parent) {
    var _this = this;
    var $container = $('<div class="bos-widget-column-selector-container"></div>');
    this.$columnListBox = $('<div class="bos-widget-column-selector-list"></div>');
    $parent.append($container);
    $container.append(this.$columnListBox);

    var columns = this._getColumns() || [];

    // this._createAxisTypeList(this.$columnListBox);

    for (var i = 0; i < columns.length; i++) {
        var columnType = this._getColumnType(columns, columns[i].name);
        this._createColumnItem(columnType, columns[i]);
    }
    this.$columnListBox.perfectScrollbar();
};

ColumnSelectorDialog.prototype._createColumnItem = function (columnType, column) {
    var _this = this;
    var $column;

    if (columnType === 'SCHEMA') {
        $column = $('<div class="bos-dialog-column-item-wrapper bo-dialog-column-item-wrapper" value="' + column.name + '" type="' + columnType + '">' + '   <div class="bos-dialog-column-item-type bos-dialog-column-item-type-schema">' + columnType + '</div>' + '   <div class="bos-dialog-column-item-label bos-text-overflow-hidden has-type" title="' + column.name + '"></div>' + '</div>');
    } else {
        $column = $('<div class="bos-dialog-column-item-wrapper bo-dialog-column-item-wrapper" value="' + column.name + '" type="' + columnType + '">' + '   <div class="bos-dialog-column-item-type">' + columnType + '</div>' + '   <div class="bos-dialog-column-item-label bos-text-overflow-hidden has-type" title="' + column.name + '"></div>' + '</div>');
    }

    $column.find('.bos-dialog-column-item-label').text(column.name);
    this.$columnListBox.append($column);

    $column.click(function () {
        var selected = _this.options.selected,
            selectedIndex = _this.options.selectedIndex;
        selected[selectedIndex] = selected[selectedIndex] || {};
        selected[selectedIndex].value = column.name;
        selected[selectedIndex].name = column.name; //$(this).attr('value');
        selected[selectedIndex].type = $(this).attr('type');

        _this._fillAggregationList();
        _this._setAggregation();
        _this._render();
        _this._bindColumnSelectOnChanged();
    });
};

ColumnSelectorDialog.prototype._getColumnType = function (columnList, columnName) {
    var columnType = '';
    columnList.forEach(function (column) {
        if (columnName === column.name) {
            columnType = column.internalType || column.type;
        }
    });
    return columnType;
};

ColumnSelectorDialog.prototype._bindColumnSelectOnChanged = function () {
    if (typeof this.options.onChanged === 'function') {
        this.options.onChanged(this.options.selected[this.options.selectedIndex]);
    }
};

ColumnSelectorDialog.prototype._createAggregationListContents = function ($parent) {
    if (this.options.aggregationEnabled !== true) return;
    this.$aggregationArea = $('<div class="bos-aggregation-list-box" selectable="false"></div>');
    $parent.append(this.$aggregationArea);
    this._fillAggregationList();
};

ColumnSelectorDialog.prototype._getCurrentColumnType = function () {
    var selected = this.options.selected,
        selectedIndex = this.options.selectedIndex;
    var colName = selected[selectedIndex].name;
    var columns = this._getColumns();

    var foundCol = columns.find(function (columnObj) {
        return columnObj.name === colName;
    });

    if (!foundCol || $.inArray(foundCol.type, selectableColumnType) < 0) {
        return;
    } else {
        return foundCol.type;
    }
};

ColumnSelectorDialog.prototype._getColumns = function () {
    if (typeof this.options.getColumns === 'function') {
        return this.options.getColumns();
    } else {
        return this.options.getColumns;
    }
};

ColumnSelectorDialog.prototype._fillAggregationList = function () {
    var _this = this;
    if (!this.$aggregationArea) return;
    var selected = this.options.selected,
        selectedIndex = this.options.selectedIndex,
        aggregationList = [];
    this.$aggregationArea.empty();
    if ($.isEmptyObject(selected[selectedIndex])) {
        aggregationList = this.options.aggregationMap.number;
        this.$aggregationArea.attr('selectable', 'false');
    } else {

        var colType = this._getCurrentColumnType();
        if ($.isEmptyObject(colType)) {
            this.$aggregationArea.attr('selectable', 'false');
        } else {
            aggregationList = this.options.aggregationMap[colType];
            this.$aggregationArea.attr('selectable', 'true');
        }
    }
    for (var i = 0; i < aggregationList.length; i++) {
        var aggrObj = aggregationList[i];
        var $column = $('<div class="bo-dialog-column-item-wrapper bos-dialog-column-item-wrapper" value="' + aggrObj.value + '">' + aggrObj.label + '</div>');
        this.$aggregationArea.append($column);

        $column.click(function () {
            var selected = _this.options.selected,
                selectedIndex = _this.options.selectedIndex;
            selected[selectedIndex] = selected[selectedIndex] || {};
            selected[selectedIndex].aggregation = $(this).attr('value');
            _this._renderAggregationList();
            _this._bindColumnSelectOnChanged();
        });
    }

    this._setAggregation();
};

ColumnSelectorDialog.prototype._getCurrentAggregationList = function () {
    if (!this.$aggregationArea) return;
    var aggregationItemList = this.$aggregationArea.find('.bo-dialog-column-item-wrapper');
    var currentAggregationList = [];
    for (var i = 0; i < aggregationItemList.length; i++) {
        currentAggregationList.push($(aggregationItemList[i]).attr('value'));
    }
    return currentAggregationList;
};

ColumnSelectorDialog.prototype._setAggregation = function () {
    if (!this.$aggregationArea) return;
    var selected = this.options.selected,
        selectedIndex = this.options.selectedIndex;
    if ($.isEmptyObject(selected[selectedIndex])) return;
    var currentAggregationList = this._getCurrentAggregationList();
    if ($.isEmptyObject(selected[selectedIndex].aggregation) || currentAggregationList.indexOf(selected[selectedIndex].aggregation) < 0) {
        selected[selectedIndex].aggregation = currentAggregationList[0];
    }
};

ColumnSelectorDialog.prototype._render = function () {
    this._renderColumnList();
    this._renderAggregationList();
};

ColumnSelectorDialog.prototype._renderColumnList = function () {
    var selected = this.options.selected,
        selectedIndex = this.options.selectedIndex;
    if ($.isEmptyObject(selected[selectedIndex]) || $.isEmptyObject(selected[selectedIndex].name)) return;

    this.$columnListBox.find('.selected').removeClass('selected');
    this.$columnListBox.find('.bo-dialog-column-item-wrapper[value="' + selected[selectedIndex].name + '"]').addClass('selected');
};
ColumnSelectorDialog.prototype._renderAggregationList = function () {
    var selected = this.options.selected,
        selectedIndex = this.options.selectedIndex;
    if (!this.$aggregationArea) return;
    if ($.isEmptyObject(selected[selectedIndex]) || $.isEmptyObject(selected[selectedIndex].aggregation)) return;
    this.$aggregationArea.find('.selected').removeClass('selected');
    this.$aggregationArea.find('.bo-dialog-column-item-wrapper[value="' + selected[selectedIndex].aggregation + '"]').addClass('selected');
};

ColumnSelectorDialog.prototype._getDialogResult = function () {
    return this.options.selected;
};

exports.default = ColumnSelectorDialog;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value:
 *          {
 *              left: 'px',
 *              right: 'px',
 *              top: 'px',
 *              bottom: 'px',
 *          }, (all value is px)
 *      position: ['left', 'top', 'right', 'bottom'],
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90 on 2017-05-27.
 */

function CenterPositionWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
    this.renderProblem();
}

CenterPositionWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
CenterPositionWidget.prototype.constructor = CenterPositionWidget;

CenterPositionWidget.prototype._init = function () {
    _baseComplexWidget2.default.prototype._init.call(this);
    this.baseIconAppended = false;
    this.inputValue = {};
    this.selectedUnit = {};
    if (typeof this.options.getValue === 'function') {
        for (var i in this.options.value) {
            this.options.value[i] = this.options.getValue(this.options.value[i]);
        }
    }
};

CenterPositionWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bo-component-frame-contents">' + '   <div class="bo-component-frame-center bos-display-flex">' + '   </div>' + '</div>');

    $parent.append(this.$mainControl);

    var _this = this;
    this.options.position.forEach(function (position) {
        _this._createPositionContent(position);
    });
};

CenterPositionWidget.prototype._createPositionContent = function (position) {
    var $targetArea, positionInputControl, defaultValue, tempDom;

    tempDom = $('<div class="bo-component-frame-center-' + position + ' bos-flex-1 bos-row-multi-div"></div>');
    this.$mainControl.find('.bo-component-frame-center').append(tempDom);
    this._createPositionInputContent(tempDom, position);
};

CenterPositionWidget.prototype._createPositionInputContent = function ($parent, position) {
    var value = this.options.value && this.options.value[position] ? this.options.value[position] + '' : '';

    var postFix = value.indexOf('%') >= 0 ? '%' : 'px';
    var numberValue = value.replace(postFix, '');

    var _this = this;
    this.inputValue[position] = numberValue;
    this.selectedUnit[position] = postFix;
    var numberInput = WidgetFactory.createNumberInputWidget($parent, {
        labelPosition: 'row',
        label: position.toLocaleString(),
        labelWidth: '40px',
        width: this.options.width || '50px',
        height: this.options.height || '25px',
        value: numberValue,
        problemKeyList: this.options.problemKeyList,
        onChanged: function onChanged(value) {
            _this.inputValue[position] = value;
            _this.options.onChanged[position](value || value === 0 ? value + _this.selectedUnit[position] : '');
        }
    });

    var unitSwitchButton = WidgetFactory.createSwitchButtonWidget($parent, {
        value: postFix,
        width: '20px',
        height: this.options.height || '25px',
        margin: '2.5px 20px 2.5px 0px',
        itemList: this.options.itemList || [{ value: 'px', label: 'Px' }, { value: '%', label: '%' }],
        onChanged: function onChanged(changedUnit) {
            _this.selectedUnit[position] = changedUnit;
            _this.options.onChanged[position](_this.inputValue[position] ? _this.inputValue[position] + changedUnit : '');
        }
    });
    unitSwitchButton.addCSSInMainControl({
        'border-left': 'none'
    });

    this._widgetList.push(numberInput);
    this._widgetList.push(unitSwitchButton);
};

CenterPositionWidget.prototype.renderProblem = function (problems) {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(problems);
    });
};

exports.default = CenterPositionWidget;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ColumnChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

ColumnChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
ColumnChartOption.prototype.constructor = ColumnChartOption;

ColumnChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var columnSelectorSetting = this._createColumnSelectorSetting();
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.column.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.column.tooltip;
    this.options.setting.scaleOpt = ['yaxis'];
};

ColumnChartOption.prototype._createColumnSelectorSetting = function () {
    return [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: this.options.chartOption.colorBy[0]
    }]];
};

ColumnChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = ColumnChartOption;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createFilter = createFilter;
exports.getFilterTypes = getFilterTypes;

var _filterControlBase = __webpack_require__(76);

var _filterControlBase2 = _interopRequireDefault(_filterControlBase);

var _filterControlIndex = __webpack_require__(298);

var FilterControl = _interopRequireWildcard(_filterControlIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: filter-control-factory.js
 * Created by ji_sung.park on 2017-09-25.
 */

function createFilter(parentId, type, options) {
    var types = this.getFilterTypes();
    if (types.indexOf(type) === -1) return new _filterControlBase2.default(parentId, options);else return new FilterControl[type](parentId, options);
}

function getFilterTypes() {
    return Object.keys(FilterControl);
}

/***/ }),
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
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
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Data = Data;
exports.ComplexData = ComplexData;
exports.Format = Format;
exports.FormatCard = FormatCard;
exports.Title = Title;
exports.Axis = Axis;
exports.AxisR = AxisR;
exports.AxisEach = AxisEach;
exports.AxisRadar = AxisRadar;
exports.Legend = Legend;
exports.VisualMap = VisualMap;
exports.Marker = Marker;
exports.MarkerLine = MarkerLine;
exports.Lines = Lines;
exports.LinesWithTrend = LinesWithTrend;
exports.Frame = Frame;
exports.FrameStyle = FrameStyle;
exports.FramePie = FramePie;
exports.FrameDonut = FrameDonut;
exports.ToolTip = ToolTip;
exports.Label = Label;
exports.Figure = Figure;
exports.MapData = MapData;
exports.Layers = Layers;
exports.MapStyle = MapStyle;
exports.ToolTipTrigger = ToolTipTrigger;
exports.Grid = Grid;

var _controlContainer = __webpack_require__(273);

var _controlContainer2 = _interopRequireDefault(_controlContainer);

var _controlFactory = __webpack_require__(563);

var ControlFactory = _interopRequireWildcard(_controlFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

var expanderStatus = {};

function Data(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Data',
        headerLabel: 'Data',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createColumnSelectControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function ComplexData(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Data',
        headerLabel: 'Chart Type',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createColumnSelectControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Format(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Format',
        headerLabel: 'Formatter',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createFormatControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function FormatCard(previewText) {
    return new _controlContainer2.default({
        headerKey: 'FormatCard',
        headerLabel: 'Formatter',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createFormatCardControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Title(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Title',
        headerLabel: 'Title',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createTitleControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Axis(previewText) {
    var _this = this;
    return new _controlContainer2.default({
        headerKey: 'Axis',
        headerLabel: 'Axis Label',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            //TODO: chart-validator-base()에 _validateAxisViewRange 주석도 같이해제할것.
            //TODO: 2017 하반기 PVR 기능 검증 문제로 주석처리함
            // controlList.push(ControlFactory.createAxisViewRangeControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisTitleControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisLabelControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisScaleControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function AxisR(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Axis',
        headerLabel: 'Axis Label',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createAxisViewRangeControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisTitleControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisLabelControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisScaleControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function AxisEach(previewText) {
    var _this = this;
    return new _controlContainer2.default({
        headerKey: 'Axis',
        headerLabel: 'Axis Label',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            //TODO: chart-validator-base()에 _validateAxisViewRange 주석도 같이해제할것.
            //TODO: 2017 하반기 PVR 기능 검증 문제로 주석처리함
            // controlList.push(ControlFactory.createAxisViewRangeControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisTitleSeparatedControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisLabelSeparatedControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function AxisRadar(previewText) {
    return new _controlContainer2.default({
        headerKey: 'AxisRadar',
        headerLabel: 'Axis Label',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createAxisRadarViewRangeControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAxisRadarLabelControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Legend(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Legend',
        headerLabel: 'Legend',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createCustomLegendControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function VisualMap(previewText) {
    return new _controlContainer2.default({
        headerKey: 'VisualMap',
        headerLabel: 'Legend',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            // controlList.push(ControlFactory.createVisualMapControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createVisualMapAlignControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createVisualMapValueControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Marker(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Marker',
        headerLabel: 'Style',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createMarkerControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function MarkerLine(previewText) {
    return new _controlContainer2.default({
        headerKey: 'MarkerLine',
        headerLabel: 'Style',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createMarkerLineControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Lines(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Lines',
        headerLabel: 'Lines',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createStripLineControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function LinesWithTrend(previewText) {
    return new _controlContainer2.default({
        headerKey: 'LinesWithTrend',
        headerLabel: 'Lines',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createStripLineControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createTrendLineControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Frame(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Frame',
        headerLabel: 'Frame',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createFrameControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function FrameStyle(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Frame',
        headerLabel: 'Frame',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createFrameStyleControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function FramePie(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Frame',
        headerLabel: 'Frame',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createFramePieControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function FrameDonut(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Frame',
        headerLabel: 'Frame',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createFrameDonutControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function ToolTip(previewText) {
    return new _controlContainer2.default({
        headerKey: 'ToolTip',
        headerLabel: 'ToolTip',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createToolTipControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Label(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Label',
        headerLabel: 'Label',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createLabelControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Figure(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Figure',
        headerLabel: 'Style',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createFigureControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function MapData(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Data',
        headerLabel: 'Data',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createMapSelectControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Layers(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Layers',
        headerLabel: 'Layers',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createLayersControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function MapStyle(previewText) {
    return new _controlContainer2.default({
        headerKey: 'MapStyle',
        headerLabel: 'Map Style',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            //TODO: make new Control about headerKey('MapStyle')
            controlList.push(ControlFactory.createFrameMapControl($contentsArea, option, headerKey));
            controlList.push(ControlFactory.createAreaControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function ToolTipTrigger(previewText) {
    return new _controlContainer2.default({
        headerKey: 'ToolTipTrigger',
        headerLabel: 'ToolTip',
        headerPreviewText: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createToolTipTriggerControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

function Grid(previewText) {
    return new _controlContainer2.default({
        headerKey: 'Grid',
        headerLabel: 'Grid',
        headerPreviewTExt: previewText,
        $parent: this.$parent,
        contentInit: function contentInit($contentsArea, headerKey, option, controlList) {
            controlList.push(ControlFactory.createGridControl($contentsArea, option, headerKey));
        },
        optionRef: this.options,
        expanderStatus: expanderStatus
    });
}

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var containerOption = {
//     headerLabel: '',    //expander header label
//     headerPreviewText: '',  //expander header preview text
//     $parent: '',
//     contentInitCallback: function () {},    // create control function
//     optionRef: this.options  // content parameter when init(ex.chart option)
// };
function ControlContainer(containerOption) {
    this._init();
    this._createExpander(containerOption);
} /**
   * Created by SDS on 2017-05-10.
   */

ControlContainer.prototype._init = function () {
    this._controlList = []; //render
};

ControlContainer.prototype._createExpander = function (containerOption) {
    var _this = this;

    this.$propertyControl = $('' + '<div class="bo-control-container-expander bos-control-container-expander bos-control-container-expander-collapsed">' + '   <div class="bo-control-container-label bos-control-container-label"></div>' + '   <div class="bo-control-container-contents bos-control-container-contents"></div>' + '</div>');

    var $contentsArea = this.$propertyControl.find('.bo-control-container-contents');
    containerOption.$parent.append(this.$propertyControl);

    var callback = containerOption.contentInit;
    var chartOption = containerOption.optionRef;
    chartOption.expanderCallBack = _this.headerContentPreviewChanged.bind(_this);

    this.$propertyControl.jqxExpander({
        theme: _chartOptionConst2.default.Theme,
        animationType: 'none',
        arrowPosition: "left",
        expanded: false,
        initContent: function initContent() {
            if (typeof callback === 'function') {
                $contentsArea.css('height', 'auto');
                callback.call(_this, $contentsArea, containerOption.headerKey, chartOption, _this._controlList);
                containerOption.$parent.parent().perfectScrollbar('update');
            }
        }
    });

    this.$propertyControl.jqxExpander('setHeaderContent', '<div class="bo-control-container-head-contents bos-display-flex bos-flex-space-between bos-flex-align-center"/>');
    this._createHeaderContent(this.$propertyControl.find('.bo-control-container-head-contents'), containerOption.headerLabel, containerOption.headerPreviewText);

    this.$propertyControl.jqxExpander({
        expanded: containerOption.expanderStatus[containerOption.headerLabel] || chartOption.expanded || false
    });
    this.$propertyControl.on('collapsed', function () {
        $(this).removeClass('bos-control-container-expander-expanded').addClass('bos-control-container-expander-collapsed');
        containerOption.$parent.parent().perfectScrollbar('update');
        containerOption.expanderStatus[containerOption.headerLabel] = false;
    });
    this.$propertyControl.on('expanded', function () {
        $(this).removeClass('bos-control-container-expander-collapsed').addClass('bos-control-container-expander-expanded');
        containerOption.$parent.parent().perfectScrollbar('update');
        containerOption.expanderStatus[containerOption.headerLabel] = true;
    });
};

ControlContainer.prototype._createHeaderContent = function ($target, label, previewValue) {
    $target.append($('<div class="">' + label + '</div>'));
    $target.append($('<div class="bo-control-container-header-preview bos-text-blur"/>'));

    this.$headerPreview = $target.find('.bo-control-container-header-preview');
    this.$headerPreview.css({ 'max-width': '160px' });

    this.headerContentPreviewChanged(previewValue, this.$headerPreview);
};

ControlContainer.prototype.headerContentPreviewChanged = function (previewValue, $previewTarget) {
    // this.setHeaderContentPreviewSize();
    if ((previewValue || previewValue === '') && typeof previewValue === "string") {
        $previewTarget.addClass('bos-text-overflow-hidden');
        $previewTarget.removeClass('bos-display-flex');
        $previewTarget.attr('title', previewValue);
        $previewTarget.text(previewValue);
    } else if (previewValue instanceof jQuery) {
        $previewTarget.addClass('bos-display-flex');
        $previewTarget.removeClass('bos-text-overflow-hidden');
        $previewTarget.text('');
        $previewTarget.removeAttr('title');
        $previewTarget.children().remove();
        $previewTarget.append(previewValue);
    }
};

// ControlContainer.prototype.setHeaderContentPreviewSize = function () {
// overflow bug 해결되면 추가해야함. 지금은 그냥 고정해야겠다
//     if (this.$propertyControl.width() > 0 && !this.$headerPreview.css('max-width')) {
//         this.$headerPreview.css({'max-width': this.$propertyControl.width() / 2});
//     }
// };


ControlContainer.prototype.getControlList = function () {
    return this._controlList;
};

ControlContainer.prototype.render = function () {
    if (!this._controlList) {
        return;
    }
    this._controlList.forEach(function (control) {
        control.render();
    });
};

ControlContainer.prototype.close = function () {
    if (!this._controlList) {
        return;
    }
    this._controlList.forEach(function (control) {
        control.close();
    });
};

ControlContainer.prototype.destroy = function () {
    this._controlList.forEach(function (control) {
        control.destroy();
    });
    this.$propertyControl.remove(); //껍데기도 지워줘야함 ㅜㅜ
};

exports.default = ControlContainer;

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

var _columnSelectorWidget = __webpack_require__(58);

var _columnSelectorWidget2 = _interopRequireDefault(_columnSelectorWidget);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ColumnSelectControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

ColumnSelectControl.prototype = Object.create(_baseControl2.default.prototype);
ColumnSelectControl.prototype.constructor = ColumnSelectControl;

ColumnSelectControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this._widgetList = [];
};

ColumnSelectControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);
    var selectorSettings = {};
    selectorSettings.columnSelector = this.options.setting.columnSelector;
    selectorSettings.datasourceSelector = this.options.setting.datasourceSelector;
    selectorSettings.itemSelector = this.options.setting.itemSelector;
    selectorSettings.onOffSwitch = this.options.setting.onOffSwitch;
    this.createComponentContents(selectorSettings);
};

ColumnSelectControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this);
    var _this = this;
    this._createChartTypeSelectorContent();

    if (!contentsOption || !contentsOption.columnSelector) {
        return;
    }
    for (var chartIdx = 0; chartIdx < contentsOption.columnSelector.length; chartIdx++) {
        this._createDataSourceSelectorContent(contentsOption.datasourceSelector[chartIdx], chartIdx);
        if (contentsOption.columnSelector[chartIdx].length > 0 && (this.options.dataSource.selectable || this.options.chartTypeSelectable)) {
            this.$controlContents.append($('<div class="bos-widget-row-separator"/>'));
        }

        contentsOption.columnSelector[chartIdx].forEach(function (columnSettings) {
            if (!columnSettings.ref.selected && !columnSettings.ref.axisType) return;
            // _this._configureDefaultSelectedAggregation(columnSettings, chartIdx);
            _this._createColumnSelectorContent(columnSettings, chartIdx);
        });

        if (contentsOption.itemSelector) {
            contentsOption.itemSelector[chartIdx].forEach(function (itemSettings) {
                _this._createItemSelectorContent(itemSettings, chartIdx);
            });
        }

        if (contentsOption.onOffSwitch) {
            contentsOption.onOffSwitch[chartIdx].forEach(function (switchSettings) {
                _this._createOnOffSwitchContent(switchSettings, chartIdx);
            });
        }
    }
};

ColumnSelectControl.prototype._createChartTypeSelectorContent = function () {
    var _this = this;
    var chartTypeSelectorWidget = WidgetFactory.createChartTypeSelectorWidget(_this.$controlContents, {
        label: 'Chart Type',
        value: this.options.chartOption.chart.type,
        chartTypeList: this.options.chartTypeList,
        chartTypeSelectable: this.options.chartTypeSelectable,
        onChanged: function onChanged(inputVal) {
            _this.options.chartOption.chart.type = inputVal;
            var newOptions = _this.options.chartOptionAPI.setChartOptions(_this.options.chartOption);
            _this.options.onChanged('onChartTypeChanged', newOptions);
        }
    });
    this._widgetList.push(chartTypeSelectorWidget);
};

ColumnSelectControl.prototype._createDataSourceSelectorContent = function (setting, chartIdx) {

    if (this.options.dataSource.selectable) {
        this.$controlContents.append($('<div class="bos-widget-row-separator"/>'));
        this._createDataSourceContent(this.$controlContents, this._createDataSourceSelectorContentOption(setting, chartIdx));
    }
};

ColumnSelectControl.prototype._createDataSourceSelectorContentOption = function (setting, chartIdx) {
    var _this = this;
    var dataSourceList = this._getDataSourceList();
    var dataSourceOptions = {
        dataSource: this.options.dataSource,
        id: dataSourceList[chartIdx] ? dataSourceList[chartIdx].id : null,
        label: setting.label,
        problemKeyList: ['datasource-001', 'datasource-002', 'datasource-002-01', 'datasource-003', 'datasource-003-01'],
        onChanged: function onChanged(changedDataSource) {
            var callBackParam = {};
            if (typeof _this.options.dataSource.onDataSourceChangedCallBack === 'function') {
                var dataSourceValueList = _this._getDataSourceValueList();
                dataSourceValueList[chartIdx] = changedDataSource.value;
                callBackParam.dataSourceValueList = dataSourceValueList;
                _this.options.onChanged('onDataSourceChanged', callBackParam);
            } else if (typeof _this.options.dataSource.getDataSourceColumnList === 'function') {
                var newColumnList = _this.options.dataSource.getDataSourceColumnList(changedDataSource.value);
                callBackParam.changedDataSource = changedDataSource;
                callBackParam.changedDataSource.targetIdx = chartIdx;
                callBackParam.newColumnList = newColumnList;
                // _this._updateChangedDatasource(chartIdx, changedDataSource, newColumnList);
                _this._updateChangedDatasource(callBackParam);
            }
        }
    };
    return dataSourceOptions;
};

ColumnSelectControl.prototype._updateChangedDatasource = function (dataSource) {
    var chartIdx = dataSource.changedDataSource.targetIdx,
        changedDataSource = dataSource.changedDataSource,
        newColumnList = dataSource.newColumnList;

    this._initDataSource(chartIdx);
    this._setColumnList(chartIdx, newColumnList);
    this._setDataSource(chartIdx, changedDataSource);

    this.options.onChanged('onDataSourceChanged', changedDataSource);
    this.setExpanderPreview.call(this);
};

ColumnSelectControl.prototype._getSelectedColumns = function (columnSettings) {
    if (columnSettings.ref.axisType && columnSettings.axisTypeList) {
        return [_chartOptionConst2.default.EXTRA_AXIS_TYPE_LIST.find(function (column) {
            return column.value == columnSettings.ref.axisType;
        })];
    } else {
        return columnSettings.ref.selected;
    }
};

ColumnSelectControl.prototype._createColumnSelectorContent = function (columnSettings, sourceIndex) {
    var _this = this;
    var widgetOptions = {
        selected: this._getSelectedColumns(columnSettings), //[{name: 'SepalLength', aggregation: 'none' }],
        multiple: columnSettings.multiple ? columnSettings.multiple : false,
        multipleMaxCnt: columnSettings.multipleMaxCnt,
        aggregationEnabled: columnSettings.aggregationEnabled ? columnSettings.aggregationEnabled : false,
        aggregationMap: columnSettings.aggregationMap ? columnSettings.aggregationMap : {},
        label: columnSettings.label,
        getColumns: this._getColumnList.bind(this, columnSettings, sourceIndex),
        getAllColumns: this._getAllColumnList.bind(this, sourceIndex),
        problemKeyList: ['axis-001', 'axis-002', 'axis-003', 'axis-004', 'axis-005'],
        chartOption: this.options.chartOption,
        onChanged: function onChanged(changedColumnInfo) {
            if (changedColumnInfo[0] && changedColumnInfo[0].type == _chartOptionConst2.default.EXTRA_AXIS_TYPE) {
                columnSettings.ref.axisType = _chartOptionConst2.default.EXTRA_AXIS_TYPE_LIST.find(function (column) {
                    return column.name == changedColumnInfo[0].name;
                }).value;
                columnSettings.ref.selected = [];
            } else {
                columnSettings.ref.selected = changedColumnInfo;
                columnSettings.ref.axisType = null;
            }

            _this.setExpanderPreview.call(_this);
            var callbackParam;
            if (typeof columnSettings.getColumnChangedOption === 'function') callbackParam = columnSettings.getColumnChangedOption(changedColumnInfo);else {
                callbackParam = {};
                callbackParam[columnSettings.key] = _this.options.chartOption[columnSettings.key];
                callbackParam[columnSettings.key][sourceIndex] = columnSettings.ref;
            }
            _this.options.onChanged('onChartOptionChanged', callbackParam);

            if (columnSettings.axisTypeList) {
                _this.options.chartOptionAPI.reloadColumnSelectorSetting();
                _this._createContents(_this.$parent);
                _this.renderProblem();
            }
        }
    };
    var columnSelectorWidget = WidgetFactory.createColumnSelectorWidget(this.$controlContents, widgetOptions);
    this._widgetList.push(columnSelectorWidget);
};

ColumnSelectControl.prototype._getDataSourceList = function () {
    var sourceList;
    if (this.options.chartOption.source.dataType === 'lazy') {
        sourceList = this.options.chartOption.source.lazyData;
    } else {
        sourceList = this.options.chartOption.source.localData;
    }
    return sourceList;
};

ColumnSelectControl.prototype._getDataSourceValueList = function () {
    var sourceValueList = [];
    var dataSourceList = this._getDataSourceList();
    dataSourceList.forEach(function (dataSource) {
        sourceValueList.push(dataSource.id.value);
    });

    return sourceValueList;
};

ColumnSelectControl.prototype._createDataSourceContent = function ($parent, options) {
    var dataSourceSelectorWidget = WidgetFactory.createDataSourceSelectorWidget($parent, options);
    this._widgetList.push(dataSourceSelectorWidget);
};

ColumnSelectControl.prototype._initDataSource = function (chartIdx) {
    if (this.options.chartOption.source.dataType === 'lazy') {
        this.options.chartOption.source.lazyData[chartIdx] = this.options.chartOption.source.lazyData[chartIdx] || { id: {} };
    } else {
        this.options.chartOption.source.localData[chartIdx] = this.options.chartOption.source.localData[chartIdx] || { id: {} };
    }
};

ColumnSelectControl.prototype._setColumnList = function (chartIdx, newColumnList) {
    if (this.options.chartOption.source.dataType === 'lazy') {
        this.options.chartOption.source.lazyData[chartIdx].columns = newColumnList;
    } else {
        this.options.chartOption.source.localData[chartIdx].columns = newColumnList;
    }

    for (var i in this._widgetList) {
        var widget = this._widgetList[i];
        if (widget instanceof _columnSelectorWidget2.default) {
            widget._fillColumnControlUnit();
        }
    }
};

ColumnSelectControl.prototype._setDataSource = function (chartIdx, dataSource) {
    if (this.options.chartOption.source.dataType === 'lazy') {
        this.options.chartOption.source.lazyData[chartIdx].id.value = dataSource.value;
        this.options.chartOption.source.lazyData[chartIdx].id.label = dataSource.label;
    } else {
        this.options.chartOption.source.localData[chartIdx].id.value = dataSource.value;
        this.options.chartOption.source.localData[chartIdx].id.label = dataSource.label;
    }
};

//column list filtered by type
ColumnSelectControl.prototype._getColumnList = function (columnSettings, sourceIndex) {
    var columnList = this._getAllColumnList(sourceIndex);

    if (columnList && columnSettings.columnType) {
        columnList = columnList.filter(function (column) {
            return columnSettings.columnType.indexOf(column.type) > -1;
        });
    }

    if (columnSettings.axisTypeList && $.isArray(columnSettings.axisTypeList)) {
        columnList = $.merge(_chartOptionConst2.default.EXTRA_AXIS_TYPE_LIST.filter(function (defAxisType) {
            return $.inArray(defAxisType.value, columnSettings.axisTypeList) > -1;
        }), columnList);
    }

    return columnList;
};

ColumnSelectControl.prototype._getAllColumnList = function (sourceIndex) {
    return ChartOptionUtil.getAllColumnList(this.options.chartOption, sourceIndex);
};

ColumnSelectControl.prototype._createItemSelectorContent = function (itemSettings, sourceIndex) {
    var _this = this;
    var options = {
        label: itemSettings.label,
        value: itemSettings.ref.selected,
        source: itemSettings.source,
        placeHolder: 'Select ' + itemSettings.label,
        problemKeyList: ['value-001', 'value-002', 'value-003', 'value-004', 'value-005'],
        onChanged: function onChanged(inputVal) {
            itemSettings.ref.selected = inputVal;
            _this.setExpanderPreview.call(_this);
            var callbackParam;
            if (typeof itemSettings.getItemChangedOption === 'function') callbackParam = itemSettings.getItemChangedOption(inputVal);
            _this.options.onChanged('onChartOptionChanged', callbackParam);
        }
    };
    var itemSelectorWidget = WidgetFactory.createItemSelectorWidget(this.$controlContents, options);
    this._widgetList.push(itemSelectorWidget);
};

ColumnSelectControl.prototype._createOnOffSwitchContent = function (switchSettings, sourceIndex) {
    var _this = this;
    var options = {
        label: switchSettings.label,
        value: switchSettings.ref,
        onChanged: function onChanged(value) {
            switchSettings.ref = value;
            _this.setExpanderPreview.call(_this);
            var callbackParam;
            if (typeof switchSettings.getValueChangedOption === 'function') callbackParam = switchSettings.getValueChangedOption(value);
            _this.options.onChanged('onChartOptionChanged', callbackParam);
        }
    };
    var onOffSwitchWidget = WidgetFactory.createOnOffSwitchWidget(this.$controlContents, options);
    this._widgetList.push(onOffSwitchWidget);
};

ColumnSelectControl.prototype.renderProblem = function (problems) {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(problems || _this.options.problemList);
    });
};

exports.default = ColumnSelectControl;

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : String ( default: Value )
 *      labelPosition : row or column, (default: row)
 *      internalLabel: (default: label) //use as validation target.
 *      inputStyle : line or box,
 *      placeHolder: '',
 *      value: ''   // default value
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function InputWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

InputWidget.prototype = Object.create(_baseWidget2.default.prototype);
InputWidget.prototype.constructor = InputWidget;

InputWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bo-widget-header bos-widget-header"></div>' + '   <div class="bo-widget-contents bos-widget-contents"></div>' + '</div>');

    $parent.append(this.$mainControl);
    if (this.options.labelPosition === 'column') {
        this.$mainControl.addClass('bos-flex-direction-column');
    }

    this._createHeader(this.$mainControl.find('.bo-widget-header'));

    this._createInputBox(this.$mainControl.find('.bo-widget-contents'));

    this._setPreValue(this.options.value || '');
};

InputWidget.prototype._createHeader = function ($parent) {
    if (!this.options.label) $parent.remove();else {
        var label = this.options.label || 'Value';
        $parent.text(label);
        if (this.options.labelWidth) {
            $parent.css({ width: this.options.labelWidth });
        }
    }
};

InputWidget.prototype._createInputBox = function ($parent) {
    this.$inputControl = $('<input type="text" class="bos-widget-inputbox"/>');
    $parent.append(this.$inputControl);
    var options = {
        theme: _chartOptionConst2.default.Theme,
        height: this.options.height || '25px',
        placeHolder: this.options.placeHolder || '',
        value: this.options.value || this.options.value == 0 ? this.options.value : ''
    };
    this.$inputControl.jqxInput(options);
    this._setDefaultStatus(this.$inputControl, options.value);

    if (this.options.inputStyle === 'line') {
        this.$inputControl.addClass('bos-widget-line-inputbox');
    }

    this.$inputControl.css('width', this.options.width ? this.options.width : '100%');

    this._bindOnChangedFunc();
};

InputWidget.prototype._bindOnChangedFunc = function ($parent) {
    var _this = this;
    if (typeof this.options.onChanged === 'function') {
        var callbackFunc = this.options.onChanged;
        this.$inputControl.on('blur', function () {
            if (!_this._isChanged(_this.$inputControl.val())) return;
            callbackFunc.bind(_this)(_this.$inputControl.val());
        });
        this.$inputControl.keydown(function _OnNumericInputKeyDown(e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                if (!_this._isChanged(_this.$inputControl.val())) return;
                callbackFunc.bind(_this)(_this.$inputControl.val());
            }
        });
    }
};

//default value가 function type일 경우 disable처리
//TODO: function type일 경우 dialog 띄워서 수정가능하게 변경해야함.(ex. axis label formatter)
InputWidget.prototype._setDefaultStatus = function (target, defaultValue) {
    if (typeof defaultValue === 'function') {
        target.jqxInput({ disabled: true, value: '[Custom function]' });
    }
};

InputWidget.prototype.toggleDisable = function (disabled) {
    this.$inputControl.jqxInput({ disabled: disabled });
};

InputWidget.prototype.render = function (changedValue) {
    this.$inputControl.jqxInput({ value: changedValue });
};

InputWidget.prototype.renderProblem = function (problems) {
    var _this = this;
    if (!problems || !this.options.problemKeyList) return;

    var targetLabel = _this.options.internalLabel || _this.options.label;
    this.$mainControl.find('input').removeClass('bos-border-color-red');
    problems.forEach(function (problem) {
        _this.options.problemKeyList.forEach(function (problemKey) {
            if (problem.key === problemKey && problem.target === targetLabel) {
                _this._renderProblem();
            }
        });
    });
};

InputWidget.prototype._renderProblem = function () {
    this.$mainControl.find('input').addClass('bos-border-color-red');
};

exports.default = InputWidget;

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : String ( default: Value )
 *      labelPosition : row or column
 *      inputStyle : line or box,
 *      placeHolder: ['','',''],
 *      value: ['','',''],
 *      numberOfInput: 3 (default: 2)
 *      onChanged: [function(){}, function(){}, function(){}]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function MultiInputWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

MultiInputWidget.prototype = Object.create(_baseWidget2.default.prototype);
MultiInputWidget.prototype.constructor = MultiInputWidget;

MultiInputWidget.prototype._init = function () {
    _baseWidget2.default.prototype._init.call(this);
    this.inputBoxIdx = 0;
    this.inputControlList = [];
};

MultiInputWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bo-widget-header bos-widget-header"></div>' + '   <div class="bo-widget-contents bos-widget-contents bos-display-flex"></div>' + '</div>');

    $parent.append(this.$mainControl);
    if (this.options.labelPosition === 'column') {
        this.$mainControl.addClass('bos-flex-direction-column');
    }

    this._createHeader(this.$mainControl.find('.bo-widget-header'));
    this._createMultiInput(this.$mainControl.find('.bo-widget-contents'));

    this._setPreValue(this.options.value);
};

MultiInputWidget.prototype._createHeader = function ($parent) {
    if (!this.options.label) $parent.remove();else {
        var label = this.options.label || 'Value';
        $parent.text(label);
    }
    $parent.addClass('bos-widget-column-separator');
};

MultiInputWidget.prototype._createMultiInput = function ($parent) {
    var numberOfInput = this.options.numOfComponent ? this.options.numOfComponent : 2;
    var callbackList = $.extend({}, this.options.onChanged);
    var Widget, defaultValue;
    for (var idx = 0; idx < numberOfInput; idx++) {
        this.inputBoxIdx = idx;

        if (this.options.inputType && this.options.inputType[idx] === 'number') {
            Widget = WidgetFactory.createNumberInputWidget;
            defaultValue = this.options.value && this.options.value[idx] !== 0 ? this.options.value[idx] : '';
        } else {
            Widget = WidgetFactory.createInputWidget;
            defaultValue = this.options.value && this.options.value[idx] ? this.options.value[idx] : '';
        }

        var inputControl = Widget($parent, {
            labelPosition: this.options.labelPosition,
            inputStyle: this.options.inputStyle,
            placeHolder: this.options.placeHolder && this.options.placeHolder[idx] ? this.options.placeHolder[idx] : '',
            value: defaultValue,
            onChanged: this.options.onChanged[idx]
        });
        inputControl.$mainControl.css({ 'flex-grow': 1 });
        if (idx != numberOfInput - 1) {
            inputControl.$mainControl.addClass('bos-widget-column-separator');
        }
        this.inputControlList.push(inputControl);
    }
};

MultiInputWidget.prototype.toggleDisable = function (disabled) {
    this.inputControlList.forEach(function (inputControl) {
        // $inputControl.jqxInput({disabled: disabled});
        inputControl.toggleDisable(disabled);
    });
};

MultiInputWidget.prototype.renderProblem = function (problems) {
    var _this = this;

    this.$mainControl.find('input').removeClass('bos-border-color-red');
    problems.forEach(function (problem) {
        _this.options.problemKeyList.forEach(function (problemKey) {
            if (problem.key === problemKey && problem.target === _this.options.label) {
                _this._renderProblem();
            }
        });
    });
};

MultiInputWidget.prototype._renderProblem = function () {
    this.$mainControl.find('input').addClass('bos-border-color-red');
};

exports.default = MultiInputWidget;

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dialog = __webpack_require__(42);

var _dialog2 = _interopRequireDefault(_dialog);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  options = {
 *      close: function(color){
 *          // color: {}
 *      },
 *      onChanged: function(){]
 *  }
 *
 */

/**
 * Created by daewon77.park on 2016-08-20.
 */

function ColorPickerDialog(parentId, options) {
    _dialog2.default.call(this, parentId, options);
}

ColorPickerDialog.prototype = Object.create(_dialog2.default.prototype);
ColorPickerDialog.prototype.constructor = ColorPickerDialog;

ColorPickerDialog.prototype._getTitle = function () {
    return 'Color Picker';
};

ColorPickerDialog.prototype._getDefaultWindowOption = function () {
    var _this = this;
    return {
        theme: _chartOptionConst2.default.Theme,
        width: '300px',
        height: '320px',
        maxWidth: '300px',
        maxHeight: '320px',
        resizable: false,
        initContent: function initContent() {
            _this._configurePosition();
            _this._createDialogContentsArea(_this.$mainControl.find('.bo-dialogs-contents'));
        }
    };
};

ColorPickerDialog.prototype._createDialogContentsArea = function ($parent) {

    var _this = this;

    this.$colorPickerControl = $('<div class="bos-color-picker-control"></div>');
    $parent.append(this.$colorPickerControl);

    this.$colorPickerControl.jqxColorPicker({
        width: 275,
        height: 230,
        colorMode: 'hue'
    });

    if (this.options.color) {
        this.$colorPickerControl.jqxColorPicker('setColor', this.options.color);
        var backupColor = this.options.color;
    }

    if (typeof this.options.onChanged === 'function') {
        // var _this = this;
        this.$colorPickerControl.bind('colorchange', function (event) {
            _this.options.onChanged('#' + event.args.color.hex);
        });
    }

    this.$bottomArea = $('' + '<div class="bos-widget-color-picker-button-area">' + '       <div class="bos-widget-color-picker-reset-button">Reset</div>' + '</div>');

    $parent.append(this.$bottomArea);

    this.$bottomArea.on('click', function () {
        _this.$colorPickerControl.jqxColorPicker('setColor', backupColor);
    });
};

ColorPickerDialog.prototype._getDialogResult = function () {
    return this.$colorPickerControl.jqxColorPicker('getColor');
};

exports.default = ColorPickerDialog;

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getColorPalette = exports.setColorPalette = undefined;

var _defaultPreference = __webpack_require__(574);

var _defaultPreference2 = _interopRequireDefault(_defaultPreference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selected = undefined; /* -----------------------------------------------------
                           *  preference.js
                           *  Created by hyunseok.oh@samsung.com on 2018-09-10.
                           * ---------------------------------------------------- */

var colorSet = _defaultPreference2.default.colorPalette;

function setColorPalette(_selected, _colorSet) {
    selected = _selected;
    colorSet = _colorSet.slice();
}

function getColorPalette() {
    return colorSet;
}

exports.setColorPalette = setColorPalette;
exports.getColorPalette = getColorPalette;

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseRadioButtonGroupWidget = __webpack_require__(59);

var _baseRadioButtonGroupWidget2 = _interopRequireDefault(_baseRadioButtonGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HorizontalAlignRadioButtonWidget(parentId, options) {
    _baseRadioButtonGroupWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

HorizontalAlignRadioButtonWidget.prototype = Object.create(_baseRadioButtonGroupWidget2.default.prototype);
HorizontalAlignRadioButtonWidget.prototype.constructor = HorizontalAlignRadioButtonWidget;

HorizontalAlignRadioButtonWidget.prototype._setRadioButtonList = function () {
    this._buttonList = [{
        imageClass: 'bos-horizontal-align-left',
        value: 'left'
    }, {
        imageClass: 'bos-horizontal-align-center',
        value: 'center'
    }, {
        imageClass: 'bos-horizontal-align-right',
        value: 'right'
    }];
};

exports.default = HorizontalAlignRadioButtonWidget;

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseRadioButtonGroupWidget = __webpack_require__(59);

var _baseRadioButtonGroupWidget2 = _interopRequireDefault(_baseRadioButtonGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function VerticalAlignRadioButtonWidget(parentId, options) {
    _baseRadioButtonGroupWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

VerticalAlignRadioButtonWidget.prototype = Object.create(_baseRadioButtonGroupWidget2.default.prototype);
VerticalAlignRadioButtonWidget.prototype.constructor = VerticalAlignRadioButtonWidget;

VerticalAlignRadioButtonWidget.prototype._setRadioButtonList = function () {
    this._buttonList = [{
        imageClass: 'bos-vertical-align-up',
        value: 'top'
    }, {
        imageClass: 'bos-vertical-align-middle',
        value: 'center'
    }, {
        imageClass: 'bos-vertical-align-down',
        value: 'bottom'
    }];
};

exports.default = VerticalAlignRadioButtonWidget;

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 30px,
 *      value: ''
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function BaseCheckButtonGroupWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

BaseCheckButtonGroupWidget.prototype = Object.create(_baseWidget2.default.prototype);
BaseCheckButtonGroupWidget.prototype.constructor = BaseCheckButtonGroupWidget;

BaseCheckButtonGroupWidget.prototype._init = function () {
    _baseWidget2.default.prototype._init.call(this);
    this._buttonList = [];
    this._setCheckBtnList();
    this.$buttonObjList = [];
};

BaseCheckButtonGroupWidget.prototype._setCheckBtnList = function () {
    //implement
};

BaseCheckButtonGroupWidget.prototype._createContents = function ($parent) {
    this._isRendered = false;
    this.$checkButtonGroupControl = $('' + '<div class="bos-display-flex bos-widget-button-group-container"/>' + '');
    $parent.append(this.$checkButtonGroupControl);
    this._createChkBtnGrpUnits();
    this._renderButtonSelected(this.options.value);
    this._setPreValue(this.options.value);
    this._isRendered = true;
};

BaseCheckButtonGroupWidget.prototype._renderButtonSelected = function (selectedValueList) {
    this.$buttonObjList.forEach(function (btn) {
        if ($.inArray(btn.attr('id'), selectedValueList) > -1) {
            btn.jqxToggleButton('check');
        }
    });
};

BaseCheckButtonGroupWidget.prototype._createChkBtnGrpUnits = function () {
    var btnSetList = this._buttonList;

    for (var btnSetIdx = 0; btnSetIdx < btnSetList.length; btnSetIdx++) {
        var $checkButton = $('<input type="button" class="bos-flex-1 bos-background-image"></div>');
        this.$checkButtonGroupControl.append($checkButton);

        if (btnSetList[btnSetIdx].imageClass) {
            $checkButton.addClass(btnSetList[btnSetIdx].imageClass);
        }

        if (btnSetList[btnSetIdx].label) {
            $checkButton.attr('value', btnSetList[btnSetIdx].label);
        }

        $checkButton.attr('id', btnSetList[btnSetIdx].value);

        $checkButton.jqxToggleButton({
            theme: _chartOptionConst2.default.Theme,
            height: this.options.height || '30px'
        });

        this.$buttonObjList.push($checkButton);
        this._createClickEvent($checkButton);
    }
};

BaseCheckButtonGroupWidget.prototype._createClickEvent = function ($checkButton) {
    var _this = this;
    $checkButton.on('click', function (event) {
        var selectedBtnId = $(event.target).attr('id');
        //get selected button list
        var selectedValue = [];
        _this.$buttonObjList.forEach(function (btn) {
            if (btn.jqxToggleButton('toggled')) {
                selectedValue.push(btn.attr('id'));
            }
        });

        //call onChanged function
        if (ChartOptionUtil.isEmpty(_this.options.onChanged) || _this._isRendered === false) return;
        if (!_this._isChanged(selectedValue)) return;
        _this.options.onChanged(selectedValue);
    });
};

BaseCheckButtonGroupWidget.prototype.toggleDisable = function (disabledVal) {
    this.$buttonObjList.forEach(function ($btn) {
        $btn.jqxToggleButton({ disabled: disabledVal });
        //TODO: jqx bug인지 직접 add class 해주지않으면 disabled가 안먹힘
        $btn.addClass('jqx-fill-state-disabled jqx-fill-state-disabled-' + _chartOptionConst2.default.Theme);
    });
};

BaseCheckButtonGroupWidget.prototype.render = function (changedValue) {
    this._renderButtonSelected(changedValue);
};

exports.default = BaseCheckButtonGroupWidget;

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dialog = __webpack_require__(42);

var _dialog2 = _interopRequireDefault(_dialog);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2016-08-20.
 */

function DataSourceSelectorDialog(parentId, options) {
    _dialog2.default.call(this, parentId, options);
}

DataSourceSelectorDialog.prototype = Object.create(_dialog2.default.prototype);
DataSourceSelectorDialog.prototype.constructor = DataSourceSelectorDialog;

DataSourceSelectorDialog.prototype._getTitle = function () {
    return 'Select DataSource';
};

DataSourceSelectorDialog.prototype._getDefaultWindowOption = function () {
    var _this = this;
    var defaultOption = {
        theme: _chartOptionConst2.default.Theme,
        width: '300px',
        height: '400px',
        maxWidth: '300px',
        maxHeight: '400px',
        resizable: false,
        initContent: function initContent() {
            _this._configurePosition();
            _this._dataSourceList = _this._getDataSourceList() || [];
            _this._createDialogContentsArea(_this.$mainControl.find('.bo-dialogs-contents'));
            _this.dialogResult = _this.options.id;
        }
    };
    return defaultOption;
};

DataSourceSelectorDialog.prototype._getDataSourceList = function () {
    if (typeof this.options.dataSource.getDataSourceList === 'function') {
        return this.options.dataSource.getDataSourceList();
    }
};

DataSourceSelectorDialog.prototype._createDialogContentsArea = function ($parent) {
    this.$mainContainer = $('<div class="bos-display-flex bos-full"></div>');
    this.$datasourceArea = $('<div class="bos-display-flex bos-flex-1 bos-flex-direction-column"></div>');
    $parent.append(this.$mainContainer);
    this.$mainContainer.append(this.$datasourceArea);

    this._createColumnListContents(this.$datasourceArea);
};

DataSourceSelectorDialog.prototype._createColumnListContents = function ($parent) {
    var _this = this;
    var $container = $('<div class="bos-widget-column-selector-container"></div>');
    this.$datasourceListBox = $('<div class="bos-widget-column-selector-list"></div>');
    $parent.append($container);
    $container.append(this.$datasourceListBox);

    for (var i = 0; i < this._dataSourceList.length; i++) {

        var $datasource = $('' + '<div class="bos-dialog-column-item-wrapper bo-dialog-column-item-wrapper">' + '   <div class="bo-dialog-column-item-label bos-dialog-column-item-label bos-text-overflow-hidden"></div>' + '</div>');
        $datasource.attr('value', this._dataSourceList[i].value);
        $datasource.attr('label', this._dataSourceList[i].label);
        $datasource.attr('dsIdx', this._dataSourceList[i].dataSourceIndex);
        $datasource.find('.bo-dialog-column-item-label').text(this._dataSourceList[i].label);
        this.$datasourceListBox.append($datasource);

        if (this.options.id && this.options.id.value === this._dataSourceList[i].value) {
            $datasource.addClass('selected');
        }

        $datasource.click(function () {
            _this.$datasourceListBox.find('.selected').removeClass('selected');
            $(this).addClass('selected');
            _this.dialogResult = {
                value: $(this).attr('value'),
                label: $(this).attr('label'),
                dataSourceIndex: Number($(this).attr('dsIdx'))
            };
        });
    }
};

exports.default = DataSourceSelectorDialog;

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dialog = __webpack_require__(42);

var _dialog2 = _interopRequireDefault(_dialog);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  options = {
 *      value: '',
 *      chartTypeList: [],
 *      onChanged: function(){]
 *  }
 *
 */

/**
 * Created by daewon77.park on 2016-08-20.
 */

function ChartTypeSelectorDialog(parentId, options) {
    _dialog2.default.call(this, parentId, options);
}

ChartTypeSelectorDialog.prototype = Object.create(_dialog2.default.prototype);
ChartTypeSelectorDialog.prototype.constructor = ChartTypeSelectorDialog;

ChartTypeSelectorDialog.prototype._init = function () {
    _dialog2.default.prototype._init.call(this);
    this.options.showHeader = false;
};

ChartTypeSelectorDialog.prototype._createDialogsBody = function () {
    this._setFocus();
    this._createCloseHandler();
    this.$mainControl.on('close', this._destroy.bind(this));

    var $body = this.$mainControl.find('.bo-dialogs-body');

    $body.css({
        width: '100%',
        height: '100%',
        'box-sizing': 'border-box'
    });
    $body.perfectScrollbar();
};

ChartTypeSelectorDialog.prototype._getDefaultWindowOption = function () {
    var _this = this;
    var windowHeight = (parseInt(this._getChartTypeList().length / 4) + 1) * 66 + 10;

    return {
        theme: _chartOptionConst2.default.Theme,
        width: '282px',
        height: windowHeight + 'px',
        maxWidth: '300px',
        maxHeight: '345px',
        resizable: false,
        initContent: function initContent() {
            _this._configurePosition();
            _this._createDialogContentsArea(_this.$mainControl.find('.bo-dialogs-contents'));
        }
    };
};

ChartTypeSelectorDialog.prototype._createDialogContentsArea = function ($parent) {
    var _this = this;
    this.$chartListContainer = $('<div class="bos-widget-chart-selector-container"></div>');
    $parent.append(this.$chartListContainer);

    var chartList = this._getChartTypeList().sort(function (a, b) {
        return Brightics.Chart.getChartAttr(a).Order - Brightics.Chart.getChartAttr(b).Order;
    });
    // if(chartList.length < 8){
    this.$chartListContainer.closest('div[role="dialog"]').css({ height: '144px' });
    // }


    for (var i = 0; i < chartList.length; i++) {
        var chartLabel = Brightics.Chart.getChartAttr(chartList[i]).Label;
        var $addChart = $('' + '<div class="bos-widget-chart-item-wrapper" title="' + chartLabel + '">' + '   <div class="bcharts-adonis-chart-selector list" chart="' + chartList[i] + '"></div>' + '   <div class="bos-text-overflow-hidden bos-widget-chart-item-title ">' + chartLabel + '</div>' + '</div>');

        if (this.options.value === chartList[i]) {
            $addChart.addClass('selected');
        }

        this.$chartListContainer.append($addChart);

        $addChart.click(function () {
            _this.$chartListContainer.find('.selected').removeClass('selected');
            $(this).addClass('selected');
            _this._close();

            if (typeof _this.options.close === 'function') {
                _this.options.close(_this._getDialogResult());
            }
        });
    }
};

ChartTypeSelectorDialog.prototype._destroy = function () {
    $(window).off('mousedown', this._closeHandler);
    this.$mainControl.jqxWindow('destroy');
    this.$mainControl.remove();
};

ChartTypeSelectorDialog.prototype._getChartTypeList = function () {
    if (this.options.chartTypeList) {
        return this.options.chartTypeList;
    } else {
        return Brightics.Chart.getChartTypeList();
    }
};

ChartTypeSelectorDialog.prototype._getDialogResult = function () {
    return this.$chartListContainer.find('.selected .bcharts-adonis-chart-selector').attr('chart');
};

exports.default = ChartTypeSelectorDialog;

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value:
 *          {
 *              left: 'px',
 *              right: 'px',
 *              top: 'px',
 *              bottom: 'px',
 *          }, (all value is px)
 *      position: ['left', 'top', 'right', 'bottom'],
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90 on 2017-05-27.
 */

function PositionWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
    this.renderProblem();
}

PositionWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
PositionWidget.prototype.constructor = PositionWidget;

PositionWidget.prototype._init = function () {
    _baseComplexWidget2.default.prototype._init.call(this);
    this.baseIconAppended = false;
    this.inputValue = {};
    this.selectedUnit = {};
    if (typeof this.options.getValue === 'function') {
        for (var i in this.options.value) {
            this.options.value[i] = this.options.getValue(this.options.value[i]);
        }
    }
};

PositionWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex bos-flex-direction-column">' + '   <div class="bo-widget-position-top bos-display-flex-center"></div>' + '   <div class="bo-widget-position-middle bos-display-flex-center"></div>' + '   <div class="bo-widget-position-bottom bos-display-flex-center"></div>' + '</div>');

    $parent.append(this.$mainControl);

    var _this = this;
    this.options.position.forEach(function (position) {
        _this._createPositionContent(position);
    });
};

PositionWidget.prototype._createPositionContent = function (position) {
    var $targetArea, positionInputControl, defaultValue;
    if (position === 'left') {
        $targetArea = this.$mainControl.find('.bo-widget-position-middle');
        this._createPositionInputContent($targetArea, position);
        this._createBaseIcon();
    }
    if (position === 'right') {
        $targetArea = this.$mainControl.find('.bo-widget-position-middle');
        this._createPositionInputContent($targetArea, position);
    }
    if (position === 'top') {
        $targetArea = this.$mainControl.find('.bo-widget-position-top');
        this._createPositionInputContent($targetArea, position);
        this._createBaseIcon();
    }
    if (position === 'bottom') {
        $targetArea = this.$mainControl.find('.bo-widget-position-bottom');
        this._createBaseIcon();
        this._createPositionInputContent($targetArea, position);
    }
};

PositionWidget.prototype._createBaseIcon = function () {
    if (!this.baseIconAppended) {
        var $targetArea = this.$mainControl.find('.bo-widget-position-middle');
        var $baseIcon = $('<div class="bos-simple-square"/>');
        $baseIcon.css({
            border: 'dashed 1px #000000',
            background: '#d3d3d3',
            // width: '30px',
            // height: '20px',
            margin: '0 5px'
        });

        $targetArea.append($baseIcon);
        this.baseIconAppended = true;
    }
};

PositionWidget.prototype._createPositionInputContent = function ($parent, position) {
    var value = this.options.value && this.options.value[position] ? this.options.value[position] + '' : '';

    var postFix = value.indexOf('%') >= 0 ? '%' : 'px';
    var numberValue = value.replace(postFix, '');

    var _this = this;
    this.inputValue[position] = numberValue;
    this.selectedUnit[position] = postFix;
    var numberInput = WidgetFactory.createNumberInputWidget($parent, {
        width: '80px',
        value: numberValue,
        internalLabel: position,
        problemKeyList: this.options.problemKeyList,
        onChanged: function onChanged(value) {
            _this.inputValue[position] = value;
            _this.options.onChanged[position](value || value === 0 ? value + _this.selectedUnit[position] : '');
        }
    });

    var unitSwitchButton = WidgetFactory.createSwitchButtonWidget($parent, {
        value: postFix,
        width: '20px',
        height: '27px',
        itemList: this.options.itemList || [{ value: 'px', label: 'Px' }, { value: '%', label: '%' }],
        onChanged: function onChanged(changedUnit) {
            _this.selectedUnit[position] = changedUnit;
            _this.options.onChanged[position](_this.inputValue[position] ? _this.inputValue[position] + changedUnit : '');
        }
    });
    unitSwitchButton.addCSSInMainControl({
        'border-left': 'none'
    });

    this._widgetList.push(numberInput);
    this._widgetList.push(unitSwitchButton);
};

PositionWidget.prototype.renderProblem = function (problems) {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(problems);
    });
};

exports.default = PositionWidget;

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dialog = __webpack_require__(42);

var _dialog2 = _interopRequireDefault(_dialog);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  options = {
 *      value: '',
 *      chartTypeList: [],
 *      onChanged: function(){]
 *  }
 *
 */

/**
 * Created by daewon77.park on 2016-08-20.
 */

function ItemSelectorDialog(parentId, options) {
    _dialog2.default.call(this, parentId, options);
}

ItemSelectorDialog.prototype = Object.create(_dialog2.default.prototype);
ItemSelectorDialog.prototype.constructor = ItemSelectorDialog;

ItemSelectorDialog.prototype._init = function () {
    _dialog2.default.prototype._init.call(this);
    this.options.showHeader = false;
};

ItemSelectorDialog.prototype._createDialogsBody = function () {
    this._setFocus();
    this._createCloseHandler();
    this.$mainControl.on('close', this._destroy.bind(this));

    var $body = this.$mainControl.find('.bo-dialogs-body');

    $body.css({
        width: '100%',
        height: '100%',
        'box-sizing': 'border-box'
    });
    $body.perfectScrollbar();
};

ItemSelectorDialog.prototype._getDefaultWindowOption = function () {
    var _this = this;

    var windowHeight = this.options.itemList.length * 22 + 10;

    return {
        theme: _chartOptionConst2.default.Theme,
        width: this.options.width || '285px',
        height: windowHeight + 'px',
        minHeight: '32px',
        maxWidth: '300px',
        maxHeight: '120px',
        resizable: false,
        initContent: function initContent() {
            _this._configurePosition();
            _this._createDialogContentsArea(_this.$mainControl.find('.bo-dialogs-contents'));
        }
    };
};

ItemSelectorDialog.prototype._configurePosition = function (position, isSwitch) {
    position = position || this.options.windowPosition;
    if (!position) return;
    var $window = this.$mainControl;
    var anchorOffset = this.$parent.offset(),
        anchorWidth = this.$parent.width(),
        anchorHeight = this.$parent.height(),
        windowOffset = this.$mainControl.offset(),
        windowWidth = this.$mainControl.width(),
        windowHeight = this.$mainControl.height(),
        windowLeft,
        windowTop,
        isChanged = false;

    switch (position) {
        case 'left':
            windowLeft = anchorOffset.left - windowWidth - 3;
            windowTop = anchorOffset.top;
            break;
        case 'right':
            windowLeft = anchorOffset.left + anchorWidth + 3;
            windowTop = anchorOffset.top;
            break;
        case 'top':
            windowLeft = anchorOffset.left;
            windowTop = anchorOffset.top - windowHeight;
            break;
        case 'bottom':
            windowLeft = anchorOffset.left;
            windowTop = anchorOffset.top + anchorHeight - 1;
            break;
        case 'bottom-left':
            windowLeft = anchorOffset.left - (windowWidth - anchorWidth) - 2;
            windowTop = anchorOffset.top + anchorHeight - 1;
            break;
    }

    if (windowLeft + windowWidth > window.innerWidth) windowLeft = window.innerWidth - windowWidth - 5, isChanged = true;
    if (windowTop + windowHeight > window.innerHeight) windowTop = window.innerHeight - windowHeight - 5, isChanged = true;
    if (windowLeft < 0) windowLeft = 5, isChanged = true;
    if (windowTop < 0) windowTop = 5, isChanged = true;

    if (isChanged === true && this.options.switchPosition && isSwitch !== true) {
        this._configurePosition(this.options.switchPosition, true);
    } else {
        $window.css('left', windowLeft);
        $window.css('top', windowTop);
    }
};

ItemSelectorDialog.prototype._createDialogContentsArea = function ($parent) {
    var _this = this;
    this.$itemListContainer = $('<div class="bos-widget-item-selector-container"></div>');
    $parent.append(this.$itemListContainer);

    var itemList = this._getItemList();
    // if(chartList.length < 8){
    this.$itemListContainer.closest('div[role="dialog"]').css({ height: '144px' });
    // }


    for (var i = 0; i < itemList.length; i++) {
        var itemLabel = itemList[i].label;
        var $addItem = $('<div class="bos-widget-item-selector-item-wrapper" title="' + itemLabel + '">' + '   <div class="bos-text-overflow-hidden bo-widget-item-selector-item bos-widget-item-selector-item" item-value="' + itemList[i].value + '">' + itemLabel + '</div>' + '</div>');

        if (this.options.value === itemList[i].value) {
            $addItem.addClass('selected');
        }

        this.$itemListContainer.append($addItem);

        $addItem.click(function () {
            _this.$itemListContainer.find('.selected').removeClass('selected');
            $(this).addClass('selected');
            _this._close();

            if (typeof _this.options.close === 'function') {
                _this.options.close(_this._getDialogResult());
            }
        });
    }
};

ItemSelectorDialog.prototype._destroy = function () {
    $(window).off('mousedown', this._closeHandler);
    this.$mainControl.jqxWindow('destroy');
    this.$mainControl.remove();
};

ItemSelectorDialog.prototype._getItemList = function () {
    if (this.options.itemList) {
        return this.options.itemList;
    } else {
        return [];
    }
};

ItemSelectorDialog.prototype._getDialogResult = function () {
    return this.$itemListContainer.find('.selected .bo-widget-item-selector-item').attr('item-value');
};

exports.default = ItemSelectorDialog;

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _centerPositionWidget = __webpack_require__(121);

var _centerPositionWidget2 = _interopRequireDefault(_centerPositionWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

var _customAlignInputWidget = __webpack_require__(602);

var _customAlignInputWidget2 = _interopRequireDefault(_customAlignInputWidget);

var _columnSelectorDialog = __webpack_require__(120);

var _columnSelectorDialog2 = _interopRequireDefault(_columnSelectorDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 30px,
 *      value: ''
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function CustomAlignRadioButtonWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

CustomAlignRadioButtonWidget.prototype = Object.create(_baseWidget2.default.prototype);
CustomAlignRadioButtonWidget.prototype.constructor = CustomAlignRadioButtonWidget;

CustomAlignRadioButtonWidget.prototype._init = function () {
    _baseWidget2.default.prototype._init.call(this);
};

CustomAlignRadioButtonWidget.prototype._createAlignWidget = function ($el, options) {
    throw new Error('not implemented');
};

CustomAlignRadioButtonWidget.prototype._createContents = function ($parent) {
    this._isRendered = false;
    this.$widgetWrapper = $('\n        <div style="flex-direction: column;" class="bos-display-flex bos-widget-button-group-container-wrapper">\n            <div class="bos-widget-button-group-container__row" id="1"/>\n            <div class="bos-display-flex bos-widget-button-group-container__row" id="2"/>\n        </div>\n    ');

    $parent.append(this.$widgetWrapper);

    this.widgets = [];
    this._createWidgetGrpUnits();
    this.render(this.options.value);
    this._setPreValue(this.options.value);
    this._isRendered = true;
};

CustomAlignRadioButtonWidget.prototype.toggleDisable = function (disabledVal) {
    this.align.toggleDisable(disabledVal);
    this.input.toggleDisable(disabledVal);
};

CustomAlignRadioButtonWidget.prototype._createWidgetGrpUnits = function () {
    var _this = this;

    var $alignComponent = this.$widgetWrapper.find('.bos-widget-button-group-container__row[id="1"]');
    var $inputComponent = this.$widgetWrapper.find('.bos-widget-button-group-container__row[id="2"]');

    this.$alignComponent = $alignComponent;
    this.$inputComponent = $inputComponent;

    this.align = this._createAlignWidget($alignComponent, {
        // value: !this.options.value.custom && this.options.value.align,
        value: this.options.value.align,
        onChanged: function onChanged(selectedValue) {
            _this.options.value.align = selectedValue;
            _this.render(_this.options.value);
            _this._triggerChangeEvent(_this.options.value);
        }
    });

    this.input = new _customAlignInputWidget2.default($inputComponent, {
        value: {
            custom: !!this.options.value.custom,
            value: this.options.value.value
        },
        label: this._getLabel(),
        onChanged: function onChanged(value) {
            _this.options.value.value = value.value;
            _this._triggerChangeEvent(_this.options.value);
        }
    });
};

CustomAlignRadioButtonWidget.prototype._triggerChangeEvent = function (value) {
    if (typeof this.options.onChanged === 'function') {
        this.options.onChanged(value);
    } else {
        console.warn('CustomAlignRadioButtonWidget: onChanged is not specified');
    }
};

CustomAlignRadioButtonWidget.prototype.render = function (value) {
    this.align.render(value.align);
    this.input.render({ value: value.value });
    this.input.toggleDisable(value.align === 'center');
};

exports.default = CustomAlignRadioButtonWidget;

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function AxisTitleControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

AxisTitleControl.prototype = Object.create(_baseControl2.default.prototype);
AxisTitleControl.prototype.constructor = AxisTitleControl;

AxisTitleControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.xAxisOption = this.options.chartOption.xAxis;
    this.yAxisOption = this.options.chartOption.yAxis;
};

AxisTitleControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        label: 'Title',
        showBtn: {
            //POLICY: xAxis값을 기준으로 함
            defaultVal: this.xAxisOption[0].title.show | this.yAxisOption[0].title.show,
            clickfunc: function clickfunc(event) {
                var checkedVal = event.args.checked;
                _this.toggleDisableComponent(checkedVal);
                _this.xAxisOption[0].title.show = checkedVal;
                _this.yAxisOption[0].title.show = checkedVal;
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', {
                    xAxis: _this.xAxisOption,
                    yAxis: _this.yAxisOption
                });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

AxisTitleControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createValueComponent();
    this._createStyleComponent();
};

AxisTitleControl.prototype._createValueComponent = function () {

    var $valueComponent = $('<div class="bos-widget-row-separator"></div>');
    this.$controlContents.append($valueComponent);

    var multiLabelWidget = WidgetFactory.createMultiLabelWidget($valueComponent, {
        label: 'Axis',
        numOfComponent: 1,
        value: ['Value']
    });

    var _this = this;
    this.xAxisValueInput = WidgetFactory.createCheckedMultiInputWidget($valueComponent, {
        label: 'X Axis',
        labelPosition: 'row',
        labelWidth: '40px',
        inputStyle: 'box',
        numOfComponent: 1,
        value: [this.xAxisOption[0].title.text],
        inputType: [''],
        onChanged: [function (inputVal) {
            _this.xAxisOption[0].title.text = inputVal;
            _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption });
        }],
        showBtn: {
            defaultVal: this.xAxisOption[0].title.show,
            clickfunc: function clickfunc(event) {
                _this.xAxisOption[0].title.show = event.args.checked;
                _this.xAxisValueInput.toggleDisable(!event.args.checked, true);
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption });
            }
        }
    });

    this._widgetList.push(this.xAxisValueInput);

    this.yAxisValueInput = WidgetFactory.createCheckedMultiInputWidget($valueComponent, {
        label: 'Y Axis',
        labelPosition: 'row',
        labelWidth: '40px',
        inputStyle: 'box',
        numOfComponent: 1,
        value: [this.yAxisOption[0].title.text],
        inputType: [''],
        placeHolder: [''],
        onChanged: [function (inputVal) {
            _this.yAxisOption[0].title.text = inputVal;
            _this.options.onChanged('onChartOptionChanged', { yAxis: _this.yAxisOption });
        }],
        showBtn: {
            defaultVal: this.yAxisOption[0].title.show,
            clickfunc: function clickfunc(event) {
                _this.yAxisOption[0].title.show = event.args.checked;
                _this.yAxisValueInput.toggleDisable(!event.args.checked, true);
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { yAxis: _this.yAxisOption });
            }
        }
    });

    this._widgetList.push(this.yAxisValueInput);
};

AxisTitleControl.prototype._createStyleComponent = function () {
    var _this = this;

    //POLICY: xAxis값을 기준으로 함
    this.fontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        value: [this.xAxisOption[0].title.textStyle.fontFamily, this.xAxisOption[0].title.textStyle.fontSize, this.xAxisOption[0].title.textStyle.color, [this.xAxisOption[0].title.textStyle.fontWeight, this.xAxisOption[0].title.textStyle.fontStyle, this.xAxisOption[0].title.textStyle.textDecoration]],
        onChanged: [function (inputVal) {
            _this.xAxisOption[0].title.textStyle.fontFamily = inputVal;
            _this.yAxisOption[0].title.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].title.textStyle.fontSize = inputVal;
            _this.yAxisOption[0].title.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].title.textStyle.color = inputVal;
            _this.yAxisOption[0].title.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }, function (selectedVals) {
            _this.xAxisOption[0].title.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.xAxisOption[0].title.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.xAxisOption[0].title.textStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.yAxisOption[0].title.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.yAxisOption[0].title.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.yAxisOption[0].title.textStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }]
    });

    this._widgetList.push(this.fontStyle);
};

exports.default = AxisTitleControl;

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _formatHelperDialog = __webpack_require__(75);

var _formatHelperDialog2 = _interopRequireDefault(_formatHelperDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisLabelControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

AxisLabelControl.prototype = Object.create(_baseControl2.default.prototype);
AxisLabelControl.prototype.constructor = AxisLabelControl;

AxisLabelControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.xAxisOption = this.options.chartOption.xAxis;
    this.yAxisOption = this.options.chartOption.yAxis;
};

AxisLabelControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        label: 'Label',
        showBtn: {
            defaultVal: this.xAxisOption[0].axisLabel.show | this.yAxisOption[0].axisLabel.show,
            clickfunc: function clickfunc(event) {
                var checkedVal = event.args.checked;
                _this.toggleDisableComponent(checkedVal);
                _this.xAxisOption[0].axisLabel.show = checkedVal;
                _this.yAxisOption[0].axisLabel.show = checkedVal;
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', {
                    xAxis: _this.xAxisOption,
                    yAxis: _this.yAxisOption
                });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

AxisLabelControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createValueComponent();
    this._createFontStyleComponent();
};

AxisLabelControl.prototype._createValueComponent = function () {

    var $valueComponent = $('<div class="bos-widget-row-separator"></div>');
    this.$controlContents.append($valueComponent);
    var _this = this;

    var multiLabelWidget = WidgetFactory.createMultiLabelWidget($valueComponent, {
        label: 'Axis',
        numOfComponent: 2,
        value: ['Formatter', 'Angle'],
        helper: [_formatHelperDialog2.default, false]
    });

    this._widgetList.push(multiLabelWidget);

    this.xAxisFormatInput = WidgetFactory.createCheckedMultiInputWidget($valueComponent, {
        label: 'X Axis',
        labelPosition: 'row',
        labelWidth: '40px',
        inputStyle: 'box',
        numOfComponent: 2,
        placeHolder: ['{value}', ''],
        value: [this.xAxisOption[0].axisLabel.formatter, this.xAxisOption[0].axisLabel.rotate],
        inputType: ['', 'number'],
        onChanged: [function (inputVal) {
            _this.xAxisOption[0].axisLabel.formatter = inputVal ? inputVal : null;
            _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption });
        }, function (inputVal) {
            _this.xAxisOption[0].axisLabel.rotate = inputVal;
            _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption });
        }],
        showBtn: {
            defaultVal: this.xAxisOption[0].axisLabel.show,
            clickfunc: function clickfunc(event) {
                _this.xAxisOption[0].axisLabel.show = event.args.checked;
                _this.xAxisFormatInput.toggleDisable(!event.args.checked, true);
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption });
            }
        }
    });

    this._widgetList.push(this.xAxisFormatInput);

    this.yAxisFormatInput = WidgetFactory.createCheckedMultiInputWidget($valueComponent, {
        label: 'Y Axis',
        labelPosition: 'row',
        labelWidth: '40px',
        inputStyle: 'box',
        numOfComponent: 2,
        placeHolder: ['{value}', ''],
        value: [this.yAxisOption[0].axisLabel.formatter, this.yAxisOption[0].axisLabel.rotate],
        inputType: ['', 'number'],
        onChanged: [function (inputVal) {
            _this.yAxisOption[0].axisLabel.formatter = inputVal ? inputVal : null;
            _this.options.onChanged('onChartOptionChanged', { yAxis: _this.yAxisOption });
        }, function (inputVal) {
            _this.yAxisOption[0].axisLabel.rotate = inputVal;
            _this.options.onChanged('onChartOptionChanged', { yAxis: _this.yAxisOption });
        }],
        showBtn: {
            defaultVal: this.yAxisOption[0].axisLabel.show,
            clickfunc: function clickfunc(event) {
                _this.yAxisOption[0].axisLabel.show = event.args.checked;
                _this.yAxisFormatInput.toggleDisable(!event.args.checked, true);
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { yAxis: _this.yAxisOption });
            }
        }
    });

    this._widgetList.push(this.yAxisFormatInput);
};

AxisLabelControl.prototype._createFontStyleComponent = function () {
    var _this = this;
    this.fontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        fontStyleBtnList: ['bold', 'italic'],
        value: [this.xAxisOption[0].axisLabel.textStyle.fontFamily, this.xAxisOption[0].axisLabel.textStyle.fontSize, this.xAxisOption[0].axisLabel.textStyle.color, [this.xAxisOption[0].axisLabel.textStyle.fontWeight, this.xAxisOption[0].axisLabel.textStyle.fontStyle]],
        onChanged: [function (inputVal) {
            _this.xAxisOption[0].axisLabel.textStyle.fontFamily = inputVal;
            _this.yAxisOption[0].axisLabel.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].axisLabel.textStyle.fontSize = inputVal;
            _this.yAxisOption[0].axisLabel.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].axisLabel.textStyle.color = inputVal;
            _this.yAxisOption[0].axisLabel.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }, function (selectedVals) {
            _this.xAxisOption[0].axisLabel.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.xAxisOption[0].axisLabel.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.yAxisOption[0].axisLabel.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.yAxisOption[0].axisLabel.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption
            });
        }]
    });

    this._widgetList.push(this.fontStyle);
};

exports.default = AxisLabelControl;

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function MarkerControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

MarkerControl.prototype = Object.create(_baseControl2.default.prototype);
MarkerControl.prototype.constructor = MarkerControl;

MarkerControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.markerOption = this.options.setting.marker;
    this.showSymbol = this.options.setting.showSymbol;
};

MarkerControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);
    this.createComponentContents();
};

MarkerControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createSizeOpacityComponent();
    this._createColorPaletteComponent();
};

MarkerControl.prototype._createSizeOpacityComponent = function () {
    if (!this.markerOption) return;

    var $sizeOpacityComponent;
    if (this.showSymbol) {
        $sizeOpacityComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Size / Opacity / Show All</div>' + '   <div class="bo-component-marker-contents bos-display-flex">' + '       <div class="bo-component-marker-size bos-flex-1"></div>' + '       <div class="bo-component-marker-opacity bos-flex-1"></div>' + '       <div class="bo-component-marker-show bos-flex-1"></div>' + '   </div>' + '</div>');
    } else {
        $sizeOpacityComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Size / Opacity</div>' + '   <div class="bo-component-marker-contents bos-display-flex">' + '       <div class="bo-component-marker-size bos-flex-1"></div>' + '       <div class="bo-component-marker-opacity bos-flex-1"></div>' + '   </div>' + '</div>');
    }

    this.$controlContents.append($sizeOpacityComponent);
    var $sizeOpacityComponentContents = $sizeOpacityComponent.find('.bo-component-marker-contents');

    var _this = this;
    var markerSizeSelectorWidget = WidgetFactory.createMarkerSizeSelectorWidget($sizeOpacityComponentContents.find('.bo-component-marker-size'), {
        type: 'number',
        value: this.markerOption.symbolSize,
        onChanged: function onChanged(inputVal) {
            _this.markerOption.symbolSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(markerSizeSelectorWidget);

    var opacitySelectorWidget = WidgetFactory.createOpacitySelectorWidget($sizeOpacityComponentContents.find('.bo-component-marker-opacity'), {
        value: this.markerOption.itemStyle.normal.opacity,
        onChanged: function onChanged(inputVal) {
            _this.markerOption.itemStyle.normal.opacity = inputVal;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(opacitySelectorWidget);

    if (this.showSymbol) {
        var showAllSelectorWidget = WidgetFactory.createMarkerShowSelectorWidget($sizeOpacityComponentContents.find('.bo-component-marker-show'), {
            value: this.showSymbol.all,
            onChanged: function onChanged(inputVal) {
                _this.showSymbol.all = inputVal;
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        });
        this._widgetList.push(showAllSelectorWidget);
    }
};

MarkerControl.prototype._createColorPaletteComponent = function () {

    var $colorPaletteComponent = $('<div class="">Color Palette</div>');
    this.$controlContents.append($colorPaletteComponent);

    var _this = this;
    var colorPaletteWidget = WidgetFactory.createColorPaletteWidget($colorPaletteComponent, {
        value: this.options.chartOption.colorSet,
        onChanged: function onChanged(inputVal) {
            _this.options.chartOption.colorSet = inputVal;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { colorSet: _this.options.chartOption.colorSet });
        }
    });
    this._widgetList.push(colorPaletteWidget);
};

exports.default = MarkerControl;

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function FramePieControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

FramePieControl.prototype = Object.create(_baseControl2.default.prototype);
FramePieControl.prototype.constructor = FramePieControl;

FramePieControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.styleOption = this.options.chartOption.chart;
    this.gridOption = this.options.chartOption.grid;
    this.display = this.options.setting.display;
    if (!this.display.center) this.display.center = [];
};

FramePieControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

FramePieControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createChartPositionComponent();
    this._createChartSizeComponent();
    this._createBackgroundComponent();
    this._createBorderComponent();
};

FramePieControl.prototype._createChartPositionComponent = function (contentsOption) {
    var $chartPositionComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Center Position</div>' + '   <div class="bo-component-chart-position-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartPositionComponent);
    var $chartPositionComponentContents = $chartPositionComponent.find('.bo-component-chart-position-contents');

    var _this = this;

    var positionOptions = {
        width: '50px',
        height: '30px',
        value: {
            left: this.display.center[0],
            top: this.display.center[1]
        },
        position: ['left', 'top'],
        problemKeyList: ['value-003'],
        onChanged: {
            left: function left(value) {
                _this.display.center[0] = value ? value : '50%';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            },
            top: function top(value) {
                _this.display.center[1] = value ? value : '50%';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };

    if (this.options.setting.display) {
        $.extend(true, positionOptions, this.options.setting.display);
    }

    var positionWidget = WidgetFactory.createCenterPositionWidget($chartPositionComponentContents, positionOptions);

    this._widgetList.push(positionWidget);
};

FramePieControl.prototype._createChartSizeComponent = function (contentsOption) {
    var $chartSizeComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Chart Size</div>' + '   <div class="bo-component-chart-size-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartSizeComponent);
    var $chartSizeComponentContents = $chartSizeComponent.find('.bo-component-chart-size-contents');

    var _this = this;

    var sizeOptions = {
        width: '50px',
        height: '30px',
        value: {
            size: this.display.radius
        },
        position: ['size'],
        problemKeyList: ['value-003'],
        onChanged: {
            size: function size(value) {
                _this.display.radius = value ? value : '75%';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };

    if (this.options.setting.display) {
        $.extend(true, sizeOptions, this.options.setting.display);
    }

    var sizeWidget = WidgetFactory.createCenterPositionWidget($chartSizeComponentContents, sizeOptions);

    this._widgetList.push(sizeWidget);
};

FramePieControl.prototype._createBackgroundComponent = function (contentsOption) {
    var $backgroundComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Background</div>' + '   <div class="bo-component-frame-contents bos-display-flex">' + '       <div class="bo-component-frame-background-color bos-flex-1"></div>' + '       <div class="bo-component-frame-background-opacity bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($backgroundComponent);
    var $backgroundComponentContents = $backgroundComponent.find('.bo-component-frame-contents');

    var _this = this;
    this.opacity = function () {
        if (_this.styleOption.background == 'transparent') {
            return 0;
        } else {
            return _this.styleOption.background.replace(/^(.*,)(.+)\)/, '$2');
        }
    }();

    var colorPickerWidget = WidgetFactory.createColorPickerWidget($backgroundComponentContents.find('.bo-component-frame-background-color'), {
        width: '50px',
        height: '30px',
        hasOpacity: true,
        value: this.styleOption.background,
        onChanged: function onChanged(color) {
            _this.styleOption.background = color.replace(/^(.*,).+\)/, '$1') + _this.opacity + ')';
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(colorPickerWidget);

    var opacitySelectorWidget = WidgetFactory.createOpacitySelectorWidget($backgroundComponentContents.find('.bo-component-frame-background-opacity'), {
        value: this.opacity,
        onChanged: function onChanged(opacity) {
            _this.opacity = opacity;
            var resultRgba = _this.styleOption.background.replace(/^(.*,).+\)/, '$1');
            resultRgba = resultRgba + opacity + ')';
            _this.styleOption.background = resultRgba;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(opacitySelectorWidget);
};

FramePieControl.prototype._createBorderComponent = function (contentsOption) {

    var _this = this;

    var _getBorderStr2Obj = function _getBorderStr2Obj(inptOption) {
        var emptyDiv = $('<div/>').css({ border: inptOption });
        return {
            borderColor: emptyDiv.css('border-color'),
            // 5px -> 5
            borderWidth: emptyDiv.css('border-width').replace('px', ''),
            borderType: emptyDiv.css('border-style')
        };
    };
    var _getBorderObj2Str = function _getBorderObj2Str(borderObj) {
        var borderStr = '';
        borderStr += borderObj.borderColor ? borderObj.borderColor + ' ' : '';
        borderStr += borderObj.borderWidth ? borderObj.borderWidth + 'px ' : '';
        borderStr += borderObj.borderType ? borderObj.borderType : '';
        return borderStr;
    };

    this.borderAttrObj = _getBorderStr2Obj(this.styleOption.border);
    var lineStyleWidget = WidgetFactory.createLineStyleWidget(this.$controlContents, {
        label: 'Border',
        value: [this.borderAttrObj.borderWidth, this.borderAttrObj.borderColor, this.borderAttrObj.borderType],
        onChanged: [function (inputVal) {
            _this.borderAttrObj.borderWidth = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (changedColor) {
            _this.borderAttrObj.borderColor = changedColor;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (inputVal) {
            _this.borderAttrObj.borderType = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }]
    });

    this._widgetList.push(lineStyleWidget);
};

FramePieControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = FramePieControl;

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionAreaStacked = __webpack_require__(292);

var _chartOptionAreaStacked2 = _interopRequireDefault(_chartOptionAreaStacked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

function AreaStacked100ChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

AreaStacked100ChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
AreaStacked100ChartOption.prototype.constructor = AreaStacked100ChartOption;

AreaStacked100ChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }, {
        key: 'stackBy',
        ref: _this.options.chartOption.plotOptions.area.stackBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    area: $.extend(true, {}, _this.options.chartOption.plotOptions.area, {
                        stackBy: [{ selected: value }]
                    })
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.marker = this.options.chartOption.plotOptions.area.marker;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.area.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.area.tooltip;
    this.options.setting.showSymbol = this.options.chartOption.plotOptions.area.showSymbol;
};

AreaStacked100ChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = AreaStacked100ChartOption;

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AreaStackedChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

AreaStackedChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
AreaStackedChartOption.prototype.constructor = AreaStackedChartOption;

AreaStackedChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }, {
        key: 'stackBy',
        ref: this.options.chartOption.plotOptions.area.stackBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    area: $.extend(true, {}, _this.options.chartOption.plotOptions.area, {
                        stackBy: [{ selected: value }]
                    })
                }
            };
        }
    }]];

    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.marker = this.options.chartOption.plotOptions.area.marker;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.area.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.area.tooltip;
    this.options.setting.showSymbol = this.options.chartOption.plotOptions.area.showSymbol;
};

AreaStackedChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = AreaStackedChartOption;

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionArea = __webpack_require__(118);

var _chartOptionArea2 = _interopRequireDefault(_chartOptionArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

function BarStacked100ChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

BarStacked100ChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
BarStacked100ChartOption.prototype.constructor = BarStacked100ChartOption;

BarStacked100ChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }, {
        key: 'stackBy',
        ref: _this.options.chartOption.plotOptions.bar.stackBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    bar: $.extend(true, {}, _this.options.chartOption.plotOptions.bar, {
                        stackBy: [{ selected: value }]
                    })
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.bar.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.bar.tooltip;
};

BarStacked100ChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = BarStacked100ChartOption;

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.set = set;
exports.get = get;

var setupReg = {};

function set(key, value) {
    setupReg[key] = value;
}

function get(key) {
    return setupReg[key];
}

exports.default = setupReg;

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildAutoOptionSelector = buildAutoOptionSelector;

var _resolvers = __webpack_require__(663);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /* -----------------------------------------------------
                                                                               *  auto-option-selector.js
                                                                               *  Created by hyunseok.oh@samsung.com on 2018-08-31.
                                                                               * ---------------------------------------------------- */


function buildAutoOptionSelector(_config) {
    var config = _config || {};
    var map = {};

    // --------------------------------------------------------------------------------------------
    var xyResolver = function xyResolver(a, b) {
        return (0, _resolvers.andResolver)([(0, _resolvers.xResolver)({ type: a }), (0, _resolvers.yResolver)({ type: b })]);
    };

    var nnCol = xyResolver(_resolvers.COL_TYPE.NUMERIC, _resolvers.COL_TYPE.NUMERIC);
    var ncCol = xyResolver(_resolvers.COL_TYPE.NUMERIC, _resolvers.COL_TYPE.CATEGORICAL);
    var cnCol = xyResolver(_resolvers.COL_TYPE.CATEGORICAL, _resolvers.COL_TYPE.NUMERIC);

    Object.assign(map, {
        'histogram': [(0, _resolvers.xResolver)({ type: _resolvers.COL_TYPE.NUMERIC })],
        'boxplot': [cnCol],
        'line': [nnCol],
        'line-stacked': [nnCol],
        'line-stacked-100': [nnCol],
        'bar': [ncCol],
        'bar-stacked': [ncCol],
        'bar-stacked-100': [ncCol],
        'column': [cnCol],
        'column-stacked': [cnCol],
        'column-stacked-100': [cnCol],
        'scatter': [nnCol],
        'area': [cnCol],
        'area-stacked': [cnCol],
        'area-stacked-100': [cnCol],
        'biplot': [],
        'heatmap': [],
        'heatmap-matrix': [],
        'roccurve': [],
        'network': [],
        'decisionTree': [],
        'dendrogram': [],
        'treemap': [],
        'bubble': [],
        'qqplot': [],
        'pairwise-scatter': [],
        'complex': [],
        'card': [],
        'image-grid': [(0, _resolvers.imageColumnResolver)()]
    });
    // --------------------------------------------------------------------------------------------

    // validate resolvers
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.values(map)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            v.forEach(function (e) {
                if (!e.pre) {
                    throw new Error('resolver must implement a "pre". see option-selector.js');
                }
                if (!e.resolve) {
                    throw new Error('resolver must implement a "resolve". see option-selector.js');
                }
            });
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return function (type, chartOption, cols) {
        if (!map[type] || typeof config[type] !== 'undefined' && !config[type] || typeof config.default !== 'undefined' && !config.default) {
            return chartOption;
        }
        var resolverList = map[type];
        return resolverList.reduce(function (_ref, r) {
            var _ref2 = _toArray(_ref),
                p = _ref2.slice(0);

            if (r.pre.apply(r, _toConsumableArray(p))) return r.resolve.apply(r, _toConsumableArray(p));
            return p;
        }, [chartOption, cols])[0];
    };
}

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeutils = __webpack_require__(664);

var TypeUtils = _interopRequireWildcard(_typeutils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Source: datasource.js
 * Created by daewon.park on 2017-04-28.
 */

var ChartWidget = Brightics.Chart.Widget;


/**
 options =
 {
    id: 'asdf',
    name: 'Data Source #1', //데이터 소스 Title,
    updateTime: '2017-03-30T01:33:50.304Z',
    chartTab: {
        show: true
    },
    columnDraggable: true (default: false),
    headerDraggable: true (default: false),
    drawer: {
        show: true, //false
        menu: {
            edit: {
                show: true,
                title: 'Edit',
                click: function (event, index, options) {

                }
            },
            connect: {
                show: true,
                title: 'Connect Schedule',
                click: function (event, index, options) {

                }
            },
            delete: {
                show: true,
                title: 'Delete',
                click: function (event, index, options) {

                }
            }
        }
    },
    charts: [],
    columns: [{
        name: 'sepal_length',
        type: 'number',
        internalType: 'Double'
    }, {
        name: 'sepal_width',
        type: 'number',
        internalType: 'Double'
    }, {
        name: 'petal_length',
        type: 'number',
        internalType: 'Double'
    }, {
        name: 'petal_width',
        type: 'number',
        internalType: 'Double'
    }, {
        name: 'species',
        type: 'string',
        internalType: 'String'
    }]
 }
 **/

function DataSource(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

DataSource.prototype = Object.create(ChartWidget.prototype);
DataSource.prototype.constructor = DataSource;

DataSource.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this.setOptions(this.options);
};

// Draggable To Other Object
// drag-type: 'dataSource', 'column', 'chartTemplate'
// $helper.data('data', dataSource)
DataSource.prototype.setOptions = function (options) {
    this.options = $.extend(true, this.options || {}, options, {
        drawer: {
            menu: {}
        }
    });
};

DataSource.prototype.setName = function (name) {
    this.options.name = name;
};

DataSource.prototype.destroy = function () {
    if (this.$drawerMenu) {
        this.$drawerMenu.jqxMenu('destroy');
        this.$drawerMenu = null;
    }

    var $parent = this.$mainControl.parents('.bcharts-ds-panel');
    this.$mainControl.remove();
    $parent.perfectScrollbar('update');
};

DataSource.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-ds bcharts-ds-expanded"></div>');
    $parent.append(this.$mainControl);
    this._createDataSourceHeader(this.$mainControl);
    this._createDrawerMenu(this.$mainControl);
    this._createDataSourceContents(this.$mainControl);
    this.render();
};

DataSource.prototype._createDataSourceHeader = function ($parent) {
    this.$headerControl = $('' + '<div class="bcharts-ds-header bcharts-ds-draggable">' + '   <div class="bcharts-expander-arrow bcharts-icon-arrow-up"><div class="bcharts-expander-arrow-element"></div></div>' + '   <div class="bcharts-ds-title"><div class="bcharts-ds-title-ellipsis"></div></div>' + '   <div class="bcharts-ds-icon"><div class="bcharts-ds-icon-schedule-clock"></div></div>' + '   <div class="bcharts-ds-drawer"><div class="bcharts-ds-drawer-button"></div></div>' + '</div>');
    $parent.append(this.$headerControl);
    this._applyExpander();
    this._applyDrawer();
    if (this.options.headerDraggable) {
        this._bindDraggableEventToDataSourceHeader();
    }
};

DataSource.prototype._applyExpander = function () {
    // DataSource Content (bcharts-ds-contents) 접고 펴는 기능입니다.
    // UX 디자인 나오는거 보고, jqxExpander를 적용할지 결정할 예정.
    var _this = this;
    this.$headerControl.click(function (event) {
        if (!($(event.target).hasClass('bcharts-ds-drawer') || $(event.target).hasClass('bcharts-ds-drawer-button'))) {
            var $arrow = $(this).find('.bcharts-expander-arrow');
            if ($arrow.hasClass('bcharts-icon-arrow-up')) {
                $arrow.removeClass('bcharts-icon-arrow-up').addClass('bcharts-icon-arrow-down');
                _this.$mainControl.addClass('bcharts-ds-collapsed').removeClass('bcharts-ds-expanded');
                _this.$mainControl.find('.bcharts-ds-contents').hide();
            } else {
                $arrow.removeClass('bcharts-icon-arrow-down').addClass('bcharts-icon-arrow-up');
                _this.$mainControl.removeClass('bcharts-ds-collapsed').addClass('bcharts-ds-expanded');
                _this.$mainControl.find('.bcharts-ds-contents').show();
            }

            // 접고 펼 때 상위 div의 perfectScrollbar를 업데이트한다.
            _this.$mainControl.parents('.bcharts-ds-panel').perfectScrollbar('update');
        }
    });
};

DataSource.prototype._applyDrawer = function () {
    var _this = this;
    if (!this.options.drawer || !this.options.drawer.show) {
        this.$headerControl.find('.bcharts-ds-drawer').hide();
    }

    // Click하면 Context Menu가 popup으로 생성
    this.$headerControl.find('.bcharts-ds-drawer').click(function () {
        var anchorWidth = $(this).width();
        var anchorHeight = $(this).height();
        var anchorOffset = $(this).offset();
        var menuWidth = _this.$drawerMenu.width();
        if (_this.$drawerMenu.css('display') === 'none') {
            _this.$drawerMenu.jqxMenu('open', anchorOffset.left + anchorWidth - menuWidth - 4, anchorOffset.top + anchorHeight);
        }
    });
};

DataSource.prototype._bindDraggableEventToDataSourceHeader = function () {
    var _this = this;
    this.$headerControl.draggable({
        appendTo: 'body',
        helper: function helper(event) {
            var $helper = $(this).clone();
            var width = $(this).width();
            var height = $(this).height();
            $helper.css({
                'z-index': 5100,
                'width': width,
                'height': height,
                'overflow': 'hidden',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis'
            }); //.ui-draggable-dragging
            $helper.attr('drag-type', 'dataSource');
            $helper.data('datasource', $.extend(true, {}, _this.options));
            return $helper;
        }
    });
};

DataSource.prototype._createDrawerMenu = function ($parent) {
    var $ul = $('<ul></ul>');
    for (var key in this.options.drawer.menu) {
        if (this.options.drawer.menu[key].show) {
            var $li = $('<li></li>');
            $li.attr('action', key);
            $li.text(this.options.drawer.menu[key].title);
            $ul.append($li);
        }
    }

    this.$drawerMenu = $('<div class="bcharts-ds-panel-drawer-menu"></div>').append($ul);
    $parent.append(this.$drawerMenu);
    this.$drawerMenu.jqxMenu({
        theme: 'office',
        autoOpenPopup: false,
        mode: 'popup',
        width: 140 //jqxMenu - li tag의 text에 space key가 들어있으면 space 부분까지만 width가 적용됨..
    });
    this._bindItemClickEventToDrawer();
};

DataSource.prototype._bindItemClickEventToDrawer = function () {
    var _this = this;
    this.$drawerMenu.on('itemclick', function (event) {
        var element = event.args;
        var menuKey = $(element).attr('action');
        var dataSourceIndex = _this.$mainControl.prevAll('.bcharts-ds').length;
        /* menu 옵션에 사용자가 설정한 click 함수 실행 로직
         * drawer: { menu: { '사용자가 정한 기능': click: function(){}}}
         * drawer: { menu: { '사용자가 정한 기능': click: [function(){}, function(){}]}}  function Array도 가능
         * drawer: { menu: { '사용자가 정한 기능': action: function(){}}}  click이 아니라 action이나 다른 이름으로 함수를 지정해도 실행할 수 있도록 하였음.
         *
         *   부연설명
         *   click: function(){} 만 사용하면 아래 3줄로 표현할 수 있지만
         *   사실 여기서 click() 이렇게 함수를 실행하니까 jquery click 함수와 매우 헷갈렸습니다.
         *      if (typeof _this.options.drawer.menu[menuKey].click === 'function') {
         *         _this.options.drawer.menu[menuKey].click();
         *      }
         */
        // Logic Start
        if (_this.options.drawer.menu[menuKey]) {
            var targetMenu = _this.options.drawer.menu[menuKey];
            for (var key in targetMenu) {
                // click이나 action같은 key가 function인 경우 함수 실행
                if (typeof targetMenu[key] === 'function') {
                    targetMenu[key](event, dataSourceIndex, _this.options);
                }
                // function Array인 경우
                else if (targetMenu[key] instanceof Array && targetMenu[key].length) {
                        for (var i in targetMenu[key]) {
                            // 함수 실행
                            if (typeof targetMenu[key][i] === 'function') {
                                targetMenu[key][i](event, dataSourceIndex, _this.options);
                            }
                        }
                    }
            }
        }
        // Logic End
    });
};

DataSource.prototype._createDataSourceContents = function ($parent) {
    var _this = this;
    this.$contentsControl = $('' + '<div class="bcharts-ds-contents">' + '   <ul class="bcharts-ds-contents-tabs"></ul>' + '</div>');
    $parent.append(this.$contentsControl);
    this._createTabs(this.$contentsControl);

    if (this.$contentsControl.find('li').length) {
        this.$contentsControl.jqxTabs({
            theme: 'office',
            scrollable: false
        });

        this.$contentsControl.on('selected', function (event) {
            //var clickedItem = event.args.item;
            _this._handleJqxTabsSelectedClick();
        });
    }
};

DataSource.prototype._handleJqxTabsSelectedClick = function () {
    // tab이 선택될 때 상위 div의 perfectScrollbar를 업데이트한다.
    this.$mainControl.parents('.bcharts-ds-panel').perfectScrollbar('update');
};

// DataSource 상속 받는 Class의 경우 여기서 Tab 갯수와 기능 등등을 override 할 수 있다.
DataSource.prototype._createTabs = function ($parent) {
    this._createColumnsTab($parent);
};

DataSource.prototype._createColumnsTab = function ($parent) {
    var $columnsTab = $('<li><div class="bcharts-ds-contents-tab-columns">Columns</div><div class="bcharts-ds-contents-columns-count">0</div></li>');
    $parent.find('.bcharts-ds-contents-tabs').append($columnsTab);
    $parent.append($('<div style="min-height: 100px"></div>'));
};

DataSource.prototype._updateColumnsCount = function (number) {
    // Columns Tab에 표시되는 숫자 변경
    this.$contentsControl.find('.bcharts-ds-contents-columns-count').text(number);
};

DataSource.prototype.fillColumnsTab = function (columns) {
    var $container = $('<div><div class="bcharts-ds-columns-container"></div></div>');
    this.$contentsControl.jqxTabs('setContentAt', this.$contentsControl.jqxTabs('length') - 1, $container.html());

    $container = this.$contentsControl.find('.bcharts-ds-columns-container');
    this._createColumns($container, columns);

    this.$contentsControl.find('.bcharts-ds-columns').perfectScrollbar();
    // Columns Tab에 표시되는 숫자 변경
    if (columns && columns instanceof Array) this._updateColumnsCount(columns.length);
    this._createUtilToolsArea();
};

DataSource.prototype._createUtilToolsArea = function () {
    var $container = this.$contentsControl.find('.bcharts-ds-columns-container');
    var $utilToolsArea = $('<div class="bcharts-ds-columns-util-tools-area"></div>');
    $container.prepend($utilToolsArea);

    this._createFilterControl($utilToolsArea);
};

DataSource.prototype._createFilterControl = function ($parent) {
    var _this = this;
    var $searchArea = $('<div class="bcharts-ds-columns-searcharea"></div>');
    $parent.append($searchArea);

    var $filterInput = $('<input type="search" class="bcharts-ds-columns-filter-input searchinput"/>');
    $searchArea.append($filterInput);

    $filterInput.jqxInput({
        placeHolder: 'Search Column',
        theme: 'office'
    });
    var applyFilter = function applyFilter(event) {
        var filterValue = event.target.value.toLowerCase();
        var $columns = _this.$contentsControl.find('.bcharts-ds-columns-container .bcharts-ds-columns');
        $.each($columns.find('.bcharts-ds-column'), function (index, column) {
            var columnName = $(column).find('.bcharts-ds-column-name').attr('title').toLowerCase();
            if (columnName.indexOf(filterValue) != -1) {
                $(column).css('display', 'flex');
            } else {
                $(column).css('display', 'none');
            }
        });

        _this.$contentsControl.find('.bcharts-ds-columns').perfectScrollbar('update');
        _this.$mainControl.parents('.bcharts-ds-panel').perfectScrollbar('update');
    };
    $filterInput.keyup(function (event) {
        applyFilter(event);
    });

    $filterInput.on('search', function (event) {
        applyFilter(event);
    });
};

DataSource.prototype._createColumns = function ($parent, columns) {
    var $columns = $('<div class="bcharts-ds-columns"></div>');
    $parent.append($columns);

    for (var i in columns) {
        var $col = $('<div class="bcharts-ds-column bcharts-ds-draggable"><div class="bcharts-ds-column-type"></div><div class="bcharts-ds-column-name"><div class="bcharts-ds-column-name-ellipsis"></div></div></div>');
        var dataTypeTitle = TypeUtils.convertDataTypeForTitle(columns[i].type, columns[i].internalType);
        var dataTypeText = TypeUtils.convertDataTypeForText(columns[i].type, columns[i].internalType);
        $col.find('.bcharts-ds-column-type').attr('title', dataTypeTitle);
        $col.find('.bcharts-ds-column-type').text(dataTypeText);
        $col.find('.bcharts-ds-column-name').attr('title', columns[i].name);
        $col.find('.bcharts-ds-column-name .bcharts-ds-column-name-ellipsis').text(columns[i].name);
        $columns.append($col);
        if (this.options.columnDraggable) this._bindDraggableEventToDataSourceColumns($col, i);
    }
};

DataSource.prototype._bindDraggableEventToDataSourceColumns = function ($target, index) {
    var _this = this;
    $target.draggable({
        appendTo: 'body',
        scroll: false,
        cursor: 'move',
        helper: function helper(event) {
            var $helper = $(this).clone();
            var width = $(this).width();
            var height = $(this).height();
            $helper.css({
                'z-index': 5100,
                'width': width,
                'height': height,
                'overflow': 'hidden',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis'
            }); //.ui-draggable-dragging
            $helper.attr('drag-type', 'column');
            var helperData = $.extend(true, {}, _this.options);
            // if (helperData.columns && helperData.columns.length) {
            //     //console.log(JSON.stringify(helperData.columns[index]));
            //     helperData.columns = [helperData.columns[index]];
            // } else {
            //     helperData.columns = [];
            // }

            $helper.data('datasource', helperData);
            $helper.data('column', helperData.columns[index]);
            return $helper;
        }
    });
};

DataSource.prototype.render = function () {
    this.fillName();
    this.fillContents();
};

DataSource.prototype.fillName = function () {
    this.$headerControl.find('.bcharts-ds-title').attr('title', this.options.name);
    this.$headerControl.find('.bcharts-ds-title .bcharts-ds-title-ellipsis').text(this.options.name);
};

DataSource.prototype.fillContents = function () {
    this.fillColumnsTab(this.options.columns);
};

exports.default = DataSource;

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Source: chart-panel.js
 * Created by daewon.park on 2017-05-10.
 */

var ChartWidget = Brightics.Chart.Widget;
var ChartUtil = Brightics.Chart.Helper.ChartUtils;

function ChartPanel(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

ChartPanel.prototype = Object.create(ChartWidget.prototype);
ChartPanel.prototype.constructor = ChartPanel;

ChartPanel.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
};

ChartPanel.prototype.destroy = function () {
    if (this.$contextMenu) {
        this.$contextMenu.jqxMenu('destroy');
    }
    if (this.$contentsControl) {
        this.$contentsControl.bcharts('destroy');
    }
    $(window).off('resize', this.__resizeHandler);
};

ChartPanel.prototype.getOptions = function () {
    return this.options;
};

ChartPanel.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-ws-panel"></div>');
    this.$mainControl.css(this.options.style);
    this.$mainControl.attr('id', this.options.id);
    this.$mainControl.attr('chart', this.options.chartOption.chart.type);
    $parent.append(this.$mainControl);

    this._createPanelHeader(this.$mainControl);
    this._createPanelContents(this.$mainControl);
    this._createDroppable(this.$mainControl);

    this._configureChartOptions();
    this._createChart();
    // this._connectGroup();
};

ChartPanel.prototype._configureChartOptions = function () {};

ChartPanel.prototype._createPanelHeader = function ($parent) {
    var _this2 = this;

    var _this = this;

    this.$headerControl = $('' + '<div class="bcharts-ws-panel-header">' + '   <div class="bcharts-ws-panel-chart-selector"></div>' + '   <div class="bcharts-ws-panel-title bcharts-ws-panel-draggable"></div>' + '   <div class="bcharts-ws-panel-toolbar"></div>' + '</div>');
    $parent.append(this.$headerControl);
    this.$headerControl.perfectScrollbar();
    this.$headerControl.perfectScrollbar('update');
    this.__resizeHandler = function (e) {
        return _this2.$headerControl.perfectScrollbar('update');
    };
    $(window).on('resize', this.__resizeHandler);
    this._createChartSelector();
    this._createDraggable();
};

ChartPanel.prototype._createDraggable = function () {
    var _this = this;

    this.$headerControl.find('.bcharts-ws-panel-draggable').draggable({
        appendTo: 'body',
        scroll: false,
        cursor: 'move',
        cursorAt: { left: 90, top: 20 },
        helper: function helper(event) {
            var $helper = $('<div class="bcharts-ws-panel-drag-helper"></div>');
            _this.$headerControl.find('.bcharts-ws-panel-chart-selector').clone().addClass('bcharts-non-editable').appendTo($helper);
            $helper.data('bcharts-ws-panel', $(this).closest('.bcharts-ws-panel'));
            return $helper;
        },
        start: function start(event, ui) {
            _this.$mainControl.closest('.bcharts-worksheet').find('.bcharts-ws-panel-droppable').show();
            _this.$mainControl.find('.bcharts-ws-panel-droppable').hide();
        },
        stop: function stop(event, ui) {
            _this.$mainControl.closest('.bcharts-worksheet').find('.bcharts-ws-panel-droppable').hide();
        }
    });
};

ChartPanel.prototype._createChartSelector = function () {
    var _this = this;
    this.chartTypeSelector = WidgetFactory.createChartTypeSelectorWidget(this.$headerControl.find('.bcharts-ws-panel-chart-selector'), {
        chartTypeList: this.options.chartTypeList,
        chartTypeSelectable: this.options.chartTypeSelectable,
        onChanged: function onChanged(type) {
            if (typeof _this.options.chartTypeChanged === 'function') {
                _this.options.chartTypeChanged(_this.options.id, type);
            }
        }
    });
};

ChartPanel.prototype._createPanelContents = function ($parent) {
    this.$contentsControl = $('' + '<div class="bcharts-ws-panel-contents">' + '</div>');
    $parent.append(this.$contentsControl);
};

ChartPanel.prototype._createDroppable = function ($parent) {
    var _this = this;

    $parent.append('' + '<div class="bcharts-ws-panel-droppable" anchor="top"><i class="fa fa-angle-double-up fa-2x"></i></div>' + '<div class="bcharts-ws-panel-droppable" anchor="bottom"><i class="fa fa-angle-double-down fa-2x"></i></div>' + '<div class="bcharts-ws-panel-droppable" anchor="left"><i class="fa fa-angle-double-left fa-2x"></i></div>' + '<div class="bcharts-ws-panel-droppable" anchor="right"><i class="fa fa-angle-double-right fa-2x"></i></div>' + '');

    $parent.find('.bcharts-ws-panel-droppable').droppable({
        accept: '.bcharts-ws-panel-draggable',
        activeClass: 'bcharts-droppable-state-active',
        hoverClass: 'bcharts-droppable-state-hover',
        over: function over(event, ui) {
            var $dropLocation = $('<div class="bcharts-ws-panel-droppable-location brtc-adonis-fill-state-hover"></div>');
            if ($(this).attr('anchor') === 'left') $dropLocation.css({
                width: '50%',
                height: '100%',
                top: 0
            });else if ($(this).attr('anchor') === 'right') $dropLocation.css({
                width: '50%',
                height: '100%',
                right: 0,
                top: 0
            });else if ($(this).attr('anchor') === 'top') $dropLocation.css({
                width: '100%',
                height: '50%',
                top: 0
            });else if ($(this).attr('anchor') === 'bottom') $dropLocation.css({
                width: '100%',
                height: '50%',
                bottom: 0
            });

            _this.$mainControl.find('.bcharts-ws-panel-droppable-location').remove();
            _this.$mainControl.append($dropLocation);
        },
        out: function out(event, ui) {
            _this.$mainControl.find('.bcharts-ws-panel-droppable-location').remove();
        },
        drop: function drop(event, ui) {
            _this.$mainControl.find('.bcharts-ws-panel-droppable-location').remove();
            var movePanel = ui.helper.data('bcharts-ws-panel');
            var targetPanel = $(this).closest('.bcharts-ws-panel');
            var anchor = $(this).attr('anchor');

            _this._fireEvent('movePanel', [movePanel, targetPanel, anchor]);
        }
    });
};

ChartPanel.prototype._fireEvent = function (eventName, eventParam) {
    this.$mainControl.closest('.bcharts-worksheet').trigger(eventName, eventParam);
};

ChartPanel.prototype.createToolbar = function (toolbar) {
    var _this = this;
    var $toolbar = this.$headerControl.find('.bcharts-ws-panel-toolbar');
    for (var key in toolbar.menu) {
        var $item = $('<div class="bcharts-ws-panel-toolitem"></div>');
        $item.attr('action', key);
        $item.attr('title', toolbar.menu[key].title);
        $toolbar.append($item);

        if (typeof toolbar.menu[key].init === 'function') {
            toolbar.menu[key].init($item);
        }
        if (typeof toolbar.menu[key].click === 'function') {
            $item.click(toolbar.menu[key].click.bind(_this));
        }
    }
};

ChartPanel.prototype._createChart = function () {
    this.$contentsControl.bcharts(this.options.chartOption);
    this._renderChartSelector();
};

ChartPanel.prototype.getGroup = function () {
    return this.$contentsControl.bcharts('getGroup');
};

ChartPanel.prototype._connectGroup = function () {
    if (this.options.group) {
        this.connect(this.options.group);
    }
};

ChartPanel.prototype.connect = function (group) {
    this.$contentsControl.bcharts('connect', group);
};

ChartPanel.prototype.disconnect = function () {
    this.$contentsControl.bcharts('disconnect');
};

/*
 * @param options = {
 chart: {
 type: 'area',
 ...
 },
 }
 */
ChartPanel.prototype.setChartOptions = function (chartOption) {
    this._renderChart(chartOption);
    if (chartOption.chart && chartOption.chart.type) {
        this.$mainControl.attr('chart', chartOption.chart.type);
        this._renderChartSelector(chartOption.chart.type);
    }
    this._fireEvent('changeChart', [this, chartOption]);

    $.extend(true, this.options.chartOption, chartOption);
};

ChartPanel.prototype.setDataSource = function (dataSource) {
    $.extend(true, this.options.chartOption.source, dataSource);
    ChartUtil.assignArray(this.options.chartOption.source, dataSource);
    this._renderChart(this.options.chartOption);
};

ChartPanel.prototype.refresh = function () {
    this.$contentsControl.bcharts('render', true);
    this._renderChartSelector();
};

ChartPanel.prototype.getFilter = function () {
    return this.$contentsControl.bcharts('getFilter');
};

ChartPanel.prototype.setFilter = function (filter) {
    return this.$contentsControl.bcharts('setFilter', filter);
};

ChartPanel.prototype.getSelectedRange = function () {
    return this.$contentsControl.bcharts('getSelectedRange');
};

ChartPanel.prototype._renderChart = function (chartOption) {
    this.$contentsControl.bcharts('setOptions', chartOption);
};

ChartPanel.prototype._renderChartSelector = function (type) {
    var chartType = type || (this.options.chartOption.chart ? this.options.chartOption.chart.type : this.options.chartOption.chart);
    if (chartType) {
        this.chartTypeSelector.render(chartType);
    }
};

exports.default = ChartPanel;

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RangeSlider = exports.ListBox = exports.CheckBox = undefined;

var _filterControlCheckbox = __webpack_require__(674);

var _filterControlCheckbox2 = _interopRequireDefault(_filterControlCheckbox);

var _filterControlListbox = __webpack_require__(675);

var _filterControlListbox2 = _interopRequireDefault(_filterControlListbox);

var _filterControlRangeslider = __webpack_require__(676);

var _filterControlRangeslider2 = _interopRequireDefault(_filterControlRangeslider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CheckBox = _filterControlCheckbox2.default;
exports.ListBox = _filterControlListbox2.default;
exports.RangeSlider = _filterControlRangeslider2.default; /**
                                                           * Source: filter-control-index
                                                           * Created by ji_sung.park on 2018-05-29
                                                           */

/***/ }),
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */,
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */,
/* 530 */,
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */,
/* 535 */,
/* 536 */,
/* 537 */,
/* 538 */,
/* 539 */,
/* 540 */,
/* 541 */,
/* 542 */,
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */,
/* 551 */,
/* 552 */,
/* 553 */,
/* 554 */,
/* 555 */,
/* 556 */,
/* 557 */,
/* 558 */,
/* 559 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(560);

var _bchartsAdonis = __webpack_require__(666);

var _bchartsAdonis2 = _interopRequireDefault(_bchartsAdonis);

var _chartOption = __webpack_require__(116);

var _chartOption2 = _interopRequireDefault(_chartOption);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($, window, document, undefined) {

    $.fn.bchartsAdonis = function (options, propertyName, propertyValue) {
        var $el = this.first();
        if (options) {
            if (typeof options === 'string') {
                var method = options;
                var adonis = $el.children('.bcharts-adonis').data('BChartAdonisRef');
                if (adonis && typeof adonis[method] === 'function') return adonis[method](propertyName, propertyValue);
            } else {
                var adonis = new _bchartsAdonis2.default($el, options);
                $el.children('.bcharts-adonis').data('BChartAdonisRef', adonis);
                return this;
            }
        } else {
            return $el.children('.bcharts-adonis').data('BChartAdonisRef');
        }
    };

    $.fn.bchartsOption = function (options, propertyName, propertyValue) {
        var $el = this.first();
        if (options) {
            if (typeof options === 'string') {
                var method = options;
                var chartOption = $el.children('.bo-container').data('BChartOptionsRef');
                return chartOption[method](propertyName, propertyValue);
            } else {
                var chartOption = new _chartOption2.default($el, options);
                $el.children('.bo-container').data('BChartOptionsRef', chartOption);
                return this;
            }
        } else {
            return $el.children('.bo-container').data('BChartOptionsRef');
        }
    };
})(jQuery, window, document); /**
                               * Source: bcharts-adonis-jquery.js
                               * Created by daewon.park on 2017-04-127.
                               */

/***/ }),
/* 560 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _package = __webpack_require__(561);

var _package2 = _interopRequireDefault(_package);

var _chartOption = __webpack_require__(116);

var _chartOption2 = _interopRequireDefault(_chartOption);

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionRegister = __webpack_require__(117);

var ChartOptionRegistry = _interopRequireWildcard(_chartOptionRegister);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _datasource = __webpack_require__(296);

var _datasource2 = _interopRequireDefault(_datasource);

var _controlContainer = __webpack_require__(273);

var _controlContainer2 = _interopRequireDefault(_controlContainer);

var _controlContainerFactory = __webpack_require__(272);

var ControlContainerFactory = _interopRequireWildcard(_controlContainerFactory);

var _controlContainerPreview = __webpack_require__(119);

var ControlContainerPreview = _interopRequireWildcard(_controlContainerPreview);

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _index = __webpack_require__(665);

var Dialogs = _interopRequireWildcard(_index);

var _preference = __webpack_require__(278);

var Preference = _interopRequireWildcard(_preference);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bcharts-adonis-api.js
 * Created by ji_sung.park on 2018-05-30
 */

_package2.default.Chart.Adonis.Component.ChartOptionRegistry = ChartOptionRegistry;
_package2.default.Chart.Adonis.Component.ChartOption = Object.assign(_chartOption2.default, ChartOptionRegistry.getChartOptionControlList());
_package2.default.Chart.Adonis.Component.ChartOption.Base = _chartOptionBase2.default;
_package2.default.Chart.Adonis.Component.Widgets.Factory = WidgetFactory;
_package2.default.Chart.Adonis.Component.Controls.BaseControl = _baseControl2.default;
_package2.default.Chart.Adonis.Component.DataSource = _datasource2.default;
_package2.default.Chart.Adonis.Component.ControlContainer = _controlContainer2.default;
_package2.default.Chart.Adonis.Component.ControlContainer.Preview = ControlContainerPreview;
_package2.default.Chart.Adonis.Component.ControlContainer.Factory = ControlContainerFactory;
Object.assign(_package2.default.Chart.Adonis.Component.Dialogs, Dialogs);
_package2.default.Chart.Adonis.Preference = Preference;

_package2.default.Chart.Adonis.API.registerChartOption = ChartOptionRegistry.registerChartOptionControl;

/***/ }),
/* 561 */
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
        Adonis: {
            Component: {
                ChartOption: {},
                ChartOptionUtil: {},
                Widgets: {},
                Controls: {},
                Dialogs: {},
                Utils: {}
            },
            Validator: {},
            Setup: {},
            API: {}
        }
    }
});

exports.default = root.Brightics;

window.Brightics = root.Brightics;

/***/ }),
/* 562 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionArea = __webpack_require__(118);

var _chartOptionArea2 = _interopRequireDefault(_chartOptionArea);

var _chartOptionAreaStacked = __webpack_require__(292);

var _chartOptionAreaStacked2 = _interopRequireDefault(_chartOptionAreaStacked);

var _chartOptionAreaStacked3 = __webpack_require__(291);

var _chartOptionAreaStacked4 = _interopRequireDefault(_chartOptionAreaStacked3);

var _chartOptionBar = __webpack_require__(635);

var _chartOptionBar2 = _interopRequireDefault(_chartOptionBar);

var _chartOptionBarStacked = __webpack_require__(636);

var _chartOptionBarStacked2 = _interopRequireDefault(_chartOptionBarStacked);

var _chartOptionBarStacked3 = __webpack_require__(293);

var _chartOptionBarStacked4 = _interopRequireDefault(_chartOptionBarStacked3);

var _chartOptionBiplot = __webpack_require__(637);

var _chartOptionBiplot2 = _interopRequireDefault(_chartOptionBiplot);

var _chartOptionBoxplot = __webpack_require__(638);

var _chartOptionBoxplot2 = _interopRequireDefault(_chartOptionBoxplot);

var _chartOptionBubble = __webpack_require__(639);

var _chartOptionBubble2 = _interopRequireDefault(_chartOptionBubble);

var _chartOptionCard = __webpack_require__(640);

var _chartOptionCard2 = _interopRequireDefault(_chartOptionCard);

var _chartOptionColumn = __webpack_require__(122);

var _chartOptionColumn2 = _interopRequireDefault(_chartOptionColumn);

var _chartOptionColumnStacked = __webpack_require__(641);

var _chartOptionColumnStacked2 = _interopRequireDefault(_chartOptionColumnStacked);

var _chartOptionColumnStacked3 = __webpack_require__(642);

var _chartOptionColumnStacked4 = _interopRequireDefault(_chartOptionColumnStacked3);

var _chartOptionComplex = __webpack_require__(643);

var _chartOptionComplex2 = _interopRequireDefault(_chartOptionComplex);

var _chartOptionDecisiontree = __webpack_require__(644);

var _chartOptionDecisiontree2 = _interopRequireDefault(_chartOptionDecisiontree);

var _chartOptionDendrogram = __webpack_require__(645);

var _chartOptionDendrogram2 = _interopRequireDefault(_chartOptionDendrogram);

var _chartOptionHeatmap = __webpack_require__(646);

var _chartOptionHeatmap2 = _interopRequireDefault(_chartOptionHeatmap);

var _chartOptionHeatmapMatrix = __webpack_require__(647);

var _chartOptionHeatmapMatrix2 = _interopRequireDefault(_chartOptionHeatmapMatrix);

var _chartOptionHistogram = __webpack_require__(648);

var _chartOptionHistogram2 = _interopRequireDefault(_chartOptionHistogram);

var _chartOptionLine = __webpack_require__(649);

var _chartOptionLine2 = _interopRequireDefault(_chartOptionLine);

var _chartOptionNetwork = __webpack_require__(650);

var _chartOptionNetwork2 = _interopRequireDefault(_chartOptionNetwork);

var _chartOptionPairwiseScatter = __webpack_require__(651);

var _chartOptionPairwiseScatter2 = _interopRequireDefault(_chartOptionPairwiseScatter);

var _chartOptionPie = __webpack_require__(652);

var _chartOptionPie2 = _interopRequireDefault(_chartOptionPie);

var _chartOptionQqplot = __webpack_require__(653);

var _chartOptionQqplot2 = _interopRequireDefault(_chartOptionQqplot);

var _chartOptionRadar = __webpack_require__(654);

var _chartOptionRadar2 = _interopRequireDefault(_chartOptionRadar);

var _chartOptionRoccurve = __webpack_require__(655);

var _chartOptionRoccurve2 = _interopRequireDefault(_chartOptionRoccurve);

var _chartOptionScatter = __webpack_require__(656);

var _chartOptionScatter2 = _interopRequireDefault(_chartOptionScatter);

var _chartOptionScattermap = __webpack_require__(657);

var _chartOptionScattermap2 = _interopRequireDefault(_chartOptionScattermap);

var _chartOptionTable = __webpack_require__(658);

var _chartOptionTable2 = _interopRequireDefault(_chartOptionTable);

var _chartOptionTreemap = __webpack_require__(659);

var _chartOptionTreemap2 = _interopRequireDefault(_chartOptionTreemap);

var _chartOptionMap = __webpack_require__(660);

var _chartOptionMap2 = _interopRequireDefault(_chartOptionMap);

var _chartOptionDonut = __webpack_require__(661);

var _chartOptionDonut2 = _interopRequireDefault(_chartOptionDonut);

var _chartOptionImageGrid = __webpack_require__(662);

var _chartOptionImageGrid2 = _interopRequireDefault(_chartOptionImageGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = {
    'area': _chartOptionArea2.default,
    'area-stacked': _chartOptionAreaStacked2.default,
    'area-stacked-100': _chartOptionAreaStacked4.default,
    'bar': _chartOptionBar2.default,
    'bar-stacked': _chartOptionBarStacked2.default,
    'bar-stacked-100': _chartOptionBarStacked4.default,
    'biplot': _chartOptionBiplot2.default,
    'boxplot': _chartOptionBoxplot2.default,
    'bubble': _chartOptionBubble2.default,
    'card': _chartOptionCard2.default,
    'column': _chartOptionColumn2.default,
    'column-stacked': _chartOptionColumnStacked2.default,
    'column-stacked-100': _chartOptionColumnStacked4.default,
    'complex': _chartOptionComplex2.default,
    'decisionTree': _chartOptionDecisiontree2.default,
    'dendrogram': _chartOptionDendrogram2.default,
    'heatmap': _chartOptionHeatmap2.default,
    'heatmap-matrix': _chartOptionHeatmapMatrix2.default,
    'histogram': _chartOptionHistogram2.default,
    'line': _chartOptionLine2.default,
    'network': _chartOptionNetwork2.default,
    'pairwise-scatter': _chartOptionPairwiseScatter2.default,
    'pie': _chartOptionPie2.default,
    'qqplot': _chartOptionQqplot2.default,
    'roccurve': _chartOptionRoccurve2.default,
    'scatter': _chartOptionScatter2.default,
    'table': _chartOptionTable2.default,
    'treemap': _chartOptionTreemap2.default,
    'map': _chartOptionMap2.default,
    'donut': _chartOptionDonut2.default,
    'image-grid': _chartOptionImageGrid2.default,
    //개발 완료되면 주석 해제할것
    'radar': _chartOptionRadar2.default
    //'scatter-map': scattermap
}; /**
    * Source: chart-option-index.js
    * Created by ji_sung.park on 2018-05-30
    */

exports.default = index;

/***/ }),
/* 563 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createColumnSelectControl = createColumnSelectControl;
exports.createMapSelectControl = createMapSelectControl;
exports.createComplexColumnSelectControl = createComplexColumnSelectControl;
exports.createFormatControl = createFormatControl;
exports.createFormatCardControl = createFormatCardControl;
exports.createTitleControl = createTitleControl;
exports.createAxisViewRangeControl = createAxisViewRangeControl;
exports.createAxisRadarViewRangeControl = createAxisRadarViewRangeControl;
exports.createAxisTitleControl = createAxisTitleControl;
exports.createAxisTitleSeparatedControl = createAxisTitleSeparatedControl;
exports.createAxisLabelControl = createAxisLabelControl;
exports.createAxisRadarLabelControl = createAxisRadarLabelControl;
exports.createAxisLabelSeparatedControl = createAxisLabelSeparatedControl;
exports.createLegendControl = createLegendControl;
exports.createCustomLegendControl = createCustomLegendControl;
exports.createVisualMapValueControl = createVisualMapValueControl;
exports.createVisualMapAlignControl = createVisualMapAlignControl;
exports.createMarkerControl = createMarkerControl;
exports.createMarkerLineControl = createMarkerLineControl;
exports.createStripLineControl = createStripLineControl;
exports.createTrendLineControl = createTrendLineControl;
exports.createFrameControl = createFrameControl;
exports.createFrameStyleControl = createFrameStyleControl;
exports.createFramePieControl = createFramePieControl;
exports.createFrameMapControl = createFrameMapControl;
exports.createFrameDonutControl = createFrameDonutControl;
exports.createToolTipControl = createToolTipControl;
exports.createLabelControl = createLabelControl;
exports.createFigureControl = createFigureControl;
exports.createAreaControl = createAreaControl;
exports.createLayersControl = createLayersControl;
exports.createAxisScaleControl = createAxisScaleControl;
exports.createToolTipTriggerControl = createToolTipTriggerControl;
exports.createGridControl = createGridControl;

var _columnSelectControl = __webpack_require__(274);

var _columnSelectControl2 = _interopRequireDefault(_columnSelectControl);

var _complexColumnSelectControl = __webpack_require__(606);

var _complexColumnSelectControl2 = _interopRequireDefault(_complexColumnSelectControl);

var _formatControl = __webpack_require__(607);

var _formatControl2 = _interopRequireDefault(_formatControl);

var _formatCardControl = __webpack_require__(608);

var _formatCardControl2 = _interopRequireDefault(_formatCardControl);

var _axisViewRangeControl = __webpack_require__(609);

var _axisViewRangeControl2 = _interopRequireDefault(_axisViewRangeControl);

var _axisTitleSeparatedControl = __webpack_require__(610);

var _axisTitleSeparatedControl2 = _interopRequireDefault(_axisTitleSeparatedControl);

var _axisLabelSeparatedControl = __webpack_require__(611);

var _axisLabelSeparatedControl2 = _interopRequireDefault(_axisLabelSeparatedControl);

var _legendControl = __webpack_require__(612);

var _legendControl2 = _interopRequireDefault(_legendControl);

var _visualmapValueControl = __webpack_require__(613);

var _visualmapValueControl2 = _interopRequireDefault(_visualmapValueControl);

var _visualmapAlignControl = __webpack_require__(614);

var _visualmapAlignControl2 = _interopRequireDefault(_visualmapAlignControl);

var _markerControl = __webpack_require__(289);

var _markerControl2 = _interopRequireDefault(_markerControl);

var _markerLineControl = __webpack_require__(615);

var _markerLineControl2 = _interopRequireDefault(_markerLineControl);

var _striplineControl = __webpack_require__(616);

var _striplineControl2 = _interopRequireDefault(_striplineControl);

var _trendlineControl = __webpack_require__(617);

var _trendlineControl2 = _interopRequireDefault(_trendlineControl);

var _frameStyleControl = __webpack_require__(618);

var _frameStyleControl2 = _interopRequireDefault(_frameStyleControl);

var _frameControl = __webpack_require__(619);

var _frameControl2 = _interopRequireDefault(_frameControl);

var _framePieControl = __webpack_require__(290);

var _framePieControl2 = _interopRequireDefault(_framePieControl);

var _frameMapControl = __webpack_require__(620);

var _frameMapControl2 = _interopRequireDefault(_frameMapControl);

var _frameDonutControl = __webpack_require__(621);

var _frameDonutControl2 = _interopRequireDefault(_frameDonutControl);

var _tooltipControl = __webpack_require__(622);

var _tooltipControl2 = _interopRequireDefault(_tooltipControl);

var _figureControl = __webpack_require__(623);

var _figureControl2 = _interopRequireDefault(_figureControl);

var _titleControl = __webpack_require__(624);

var _titleControl2 = _interopRequireDefault(_titleControl);

var _axisTitleControl = __webpack_require__(287);

var _axisTitleControl2 = _interopRequireDefault(_axisTitleControl);

var _axisLabelControl = __webpack_require__(288);

var _axisLabelControl2 = _interopRequireDefault(_axisLabelControl);

var _mapSelectControl = __webpack_require__(625);

var _mapSelectControl2 = _interopRequireDefault(_mapSelectControl);

var _areaControl = __webpack_require__(626);

var _areaControl2 = _interopRequireDefault(_areaControl);

var _layersControl = __webpack_require__(627);

var _layersControl2 = _interopRequireDefault(_layersControl);

var _labelControl = __webpack_require__(628);

var _labelControl2 = _interopRequireDefault(_labelControl);

var _axisScaleControl = __webpack_require__(629);

var _axisScaleControl2 = _interopRequireDefault(_axisScaleControl);

var _tooltipTriggerControl = __webpack_require__(630);

var _tooltipTriggerControl2 = _interopRequireDefault(_tooltipTriggerControl);

var _gridControl = __webpack_require__(631);

var _gridControl2 = _interopRequireDefault(_gridControl);

var _customLegendControl = __webpack_require__(632);

var _customLegendControl2 = _interopRequireDefault(_customLegendControl);

var _axisRadarViewRangeControl = __webpack_require__(633);

var _axisRadarViewRangeControl2 = _interopRequireDefault(_axisRadarViewRangeControl);

var _axisRadarLabelControl = __webpack_require__(634);

var _axisRadarLabelControl2 = _interopRequireDefault(_axisRadarLabelControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-11.
 */
function createColumnSelectControl(parentId, options, headerKey) {
    return new _columnSelectControl2.default(parentId, options, headerKey);
}

function createMapSelectControl(parentId, options, headerKey) {
    return new _mapSelectControl2.default(parentId, options, headerKey);
}

function createComplexColumnSelectControl(parentId, options, headerKey) {
    return new _complexColumnSelectControl2.default(parentId, options, headerKey);
}

function createFormatControl(parentId, options, headerKey) {
    return new _formatControl2.default(parentId, options, headerKey);
}

function createFormatCardControl(parentId, options, headerKey) {
    return new _formatCardControl2.default(parentId, options, headerKey);
}

function createTitleControl(parentId, options, headerKey) {
    return new _titleControl2.default(parentId, options, headerKey);
}

function createAxisViewRangeControl(parentId, options, headerKey) {
    return new _axisViewRangeControl2.default(parentId, options, headerKey);
}

function createAxisRadarViewRangeControl(parentId, options, headerKey) {
    return new _axisRadarViewRangeControl2.default(parentId, options, headerKey);
}

function createAxisTitleControl(parentId, options, headerKey) {
    return new _axisTitleControl2.default(parentId, options, headerKey);
}

function createAxisTitleSeparatedControl(parentId, options, headerKey) {
    return new _axisTitleSeparatedControl2.default(parentId, options, headerKey);
}

function createAxisLabelControl(parentId, options, headerKey) {
    return new _axisLabelControl2.default(parentId, options, headerKey);
}

function createAxisRadarLabelControl(parentId, options, headerKey) {
    return new _axisRadarLabelControl2.default(parentId, options, headerKey);
}

function createAxisLabelSeparatedControl(parentId, options, headerKey) {
    return new _axisLabelSeparatedControl2.default(parentId, options, headerKey);
}

function createLegendControl(parentId, options, headerKey) {
    return new _legendControl2.default(parentId, options, headerKey);
}

function createCustomLegendControl(parentId, options, headerKey) {
    return new _customLegendControl2.default(parentId, options, headerKey);
}

function createVisualMapValueControl(parentId, options, headerKey) {
    return new _visualmapValueControl2.default(parentId, options, headerKey);
}

function createVisualMapAlignControl(parentId, options, headerKey) {
    return new _visualmapAlignControl2.default(parentId, options, headerKey);
}

function createMarkerControl(parentId, options, headerKey) {
    return new _markerControl2.default(parentId, options, headerKey);
}

function createMarkerLineControl(parentId, options, headerKey) {
    return new _markerLineControl2.default(parentId, options, headerKey);
}

function createStripLineControl(parentId, options, headerKey) {
    return new _striplineControl2.default(parentId, options, headerKey);
}

function createTrendLineControl(parentId, options, headerKey) {
    return new _trendlineControl2.default(parentId, options, headerKey);
}

function createFrameControl(parentId, options, headerKey) {
    return new _frameControl2.default(parentId, options, headerKey);
}

function createFrameStyleControl(parentId, options, headerKey) {
    return new _frameStyleControl2.default(parentId, options, headerKey);
}

function createFramePieControl(parentId, options, headerKey) {
    return new _framePieControl2.default(parentId, options, headerKey);
}

function createFrameMapControl(parentId, options, headerKey) {
    return new _frameMapControl2.default(parentId, options, headerKey);
}

function createFrameDonutControl(parentId, options, headerKey) {
    return new _frameDonutControl2.default(parentId, options, headerKey);
}

function createToolTipControl(parentId, options, headerKey) {
    return new _tooltipControl2.default(parentId, options, headerKey);
}

function createLabelControl(parentId, options, headerKey) {
    return new _labelControl2.default(parentId, options, headerKey);
}

function createFigureControl(parentId, options, headerKey) {
    return new _figureControl2.default(parentId, options, headerKey);
}

function createAreaControl(parentId, options, headerKey) {
    return new _areaControl2.default(parentId, options, headerKey);
}

function createLayersControl(parentId, options, headerKey) {
    return new _layersControl2.default(parentId, options, headerKey);
}

function createAxisScaleControl(parentId, options, headerKey) {
    return new _axisScaleControl2.default(parentId, options, headerKey);
}

function createToolTipTriggerControl(parentId, options, headerKey) {
    return new _tooltipTriggerControl2.default(parentId, options, headerKey);
}

function createGridControl(parentId, options, headerKey) {
    return new _gridControl2.default(parentId, options, headerKey);
}

/***/ }),
/* 564 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LabelWidget = exports.MarkerShowSelectorWidget = exports.EdgeTypeSelectorWidget = exports.ToolTipTriggerRadioButtonWidget = exports.CustomVerticalAlignRadioButtonWidget = exports.CustomHorizontalAlignRadioButtonWidget = exports.CenterPositionNumberWidget = exports.CenterPositionWidget = exports.AxisToggleButtonWidget = exports.OnOffSwitchWidget = exports.ItemSelectorWidget = exports.FormatDigitSelectorWidget = exports.FormatTypeSelectorWidget = exports.ColumnFormatterWidget = exports.PositionWidget = exports.SwitchButtonWidget = exports.ChartTypeSelectorWidget = exports.DataSourceSelectorWidget = exports.ToolTipBehaviorRadioButtonWidget = exports.DirectionRadioButtonWidget = exports.FontStyleButtonWidget = exports.VerticalAlignRadioButtonWidget = exports.HorizontalAlignRadioButtonWidget = exports.LineComponentWidget = exports.LineStyleWidget = exports.LineWidthSelectorWidget = exports.DashTypeSelectorWidget = exports.MarkerLineSelectorWidget = exports.MarkerSizeSelectorWidget = exports.OpacitySelectorWidget = exports.FontStyleWidget = exports.FontSizeSelectorWidget = exports.FontSelectorWidget = exports.ColumnSelectorWidgetDroppable = exports.ColumnSelectorWidget = exports.ColorPaletteWidget = exports.ColorThemesSelectorWidget = exports.ColorInputWidget = exports.ColorPickerWidget = exports.MultiColorWidget = exports.CheckedMultiInputWidget = exports.MultiLabelWidget = exports.MultiInputWidget = exports.NumberInputWidget = exports.InputWidget = exports.ShowButtonWidget = undefined;

var _showButtonWidget = __webpack_require__(565);

var _showButtonWidget2 = _interopRequireDefault(_showButtonWidget);

var _inputWidget = __webpack_require__(275);

var _inputWidget2 = _interopRequireDefault(_inputWidget);

var _numberInputWidget = __webpack_require__(566);

var _numberInputWidget2 = _interopRequireDefault(_numberInputWidget);

var _multiInputWidget = __webpack_require__(276);

var _multiInputWidget2 = _interopRequireDefault(_multiInputWidget);

var _multiLabelWidget = __webpack_require__(567);

var _multiLabelWidget2 = _interopRequireDefault(_multiLabelWidget);

var _checkedMultiInputWidget = __webpack_require__(568);

var _checkedMultiInputWidget2 = _interopRequireDefault(_checkedMultiInputWidget);

var _multiColorWidget = __webpack_require__(569);

var _multiColorWidget2 = _interopRequireDefault(_multiColorWidget);

var _colorPickerWidget = __webpack_require__(570);

var _colorPickerWidget2 = _interopRequireDefault(_colorPickerWidget);

var _colorInputWidget = __webpack_require__(571);

var _colorInputWidget2 = _interopRequireDefault(_colorInputWidget);

var _colorThemesSelectorWidget = __webpack_require__(572);

var _colorThemesSelectorWidget2 = _interopRequireDefault(_colorThemesSelectorWidget);

var _colorPaletteWidget = __webpack_require__(573);

var _colorPaletteWidget2 = _interopRequireDefault(_colorPaletteWidget);

var _columnSelectorWidget = __webpack_require__(58);

var _columnSelectorWidget2 = _interopRequireDefault(_columnSelectorWidget);

var _columnSelectorWidgetDroppable = __webpack_require__(575);

var _columnSelectorWidgetDroppable2 = _interopRequireDefault(_columnSelectorWidgetDroppable);

var _fontSelectorWidget = __webpack_require__(576);

var _fontSelectorWidget2 = _interopRequireDefault(_fontSelectorWidget);

var _fontSizeSelectorWidget = __webpack_require__(577);

var _fontSizeSelectorWidget2 = _interopRequireDefault(_fontSizeSelectorWidget);

var _fontStyleWidget = __webpack_require__(578);

var _fontStyleWidget2 = _interopRequireDefault(_fontStyleWidget);

var _opacitySelectorWidget = __webpack_require__(579);

var _opacitySelectorWidget2 = _interopRequireDefault(_opacitySelectorWidget);

var _markerSizeSelectorWidget = __webpack_require__(580);

var _markerSizeSelectorWidget2 = _interopRequireDefault(_markerSizeSelectorWidget);

var _markerLineSelectorWidget = __webpack_require__(581);

var _markerLineSelectorWidget2 = _interopRequireDefault(_markerLineSelectorWidget);

var _dashTypeSelectorWidget = __webpack_require__(582);

var _dashTypeSelectorWidget2 = _interopRequireDefault(_dashTypeSelectorWidget);

var _lineWidthSelectorWidget = __webpack_require__(583);

var _lineWidthSelectorWidget2 = _interopRequireDefault(_lineWidthSelectorWidget);

var _lineStyleWidget = __webpack_require__(584);

var _lineStyleWidget2 = _interopRequireDefault(_lineStyleWidget);

var _lineComponentWidget = __webpack_require__(585);

var _lineComponentWidget2 = _interopRequireDefault(_lineComponentWidget);

var _horizontalAlignRadioButtonWidget = __webpack_require__(279);

var _horizontalAlignRadioButtonWidget2 = _interopRequireDefault(_horizontalAlignRadioButtonWidget);

var _verticalAlignRadioButtonWidget = __webpack_require__(280);

var _verticalAlignRadioButtonWidget2 = _interopRequireDefault(_verticalAlignRadioButtonWidget);

var _fontStyleButtonWidget = __webpack_require__(586);

var _fontStyleButtonWidget2 = _interopRequireDefault(_fontStyleButtonWidget);

var _directionRadioButtonWidget = __webpack_require__(587);

var _directionRadioButtonWidget2 = _interopRequireDefault(_directionRadioButtonWidget);

var _tooltipBehaviorRadioButtonWidget = __webpack_require__(588);

var _tooltipBehaviorRadioButtonWidget2 = _interopRequireDefault(_tooltipBehaviorRadioButtonWidget);

var _datasourceSelectorWidget = __webpack_require__(589);

var _datasourceSelectorWidget2 = _interopRequireDefault(_datasourceSelectorWidget);

var _chartTypeSelectorWidget = __webpack_require__(590);

var _chartTypeSelectorWidget2 = _interopRequireDefault(_chartTypeSelectorWidget);

var _switchButtonWidget = __webpack_require__(591);

var _switchButtonWidget2 = _interopRequireDefault(_switchButtonWidget);

var _positionWidget = __webpack_require__(284);

var _positionWidget2 = _interopRequireDefault(_positionWidget);

var _columnFormatterWidget = __webpack_require__(592);

var _columnFormatterWidget2 = _interopRequireDefault(_columnFormatterWidget);

var _formatTypeWidget = __webpack_require__(593);

var _formatTypeWidget2 = _interopRequireDefault(_formatTypeWidget);

var _formatDigitWidget = __webpack_require__(594);

var _formatDigitWidget2 = _interopRequireDefault(_formatDigitWidget);

var _itemSelectorWidget = __webpack_require__(595);

var _itemSelectorWidget2 = _interopRequireDefault(_itemSelectorWidget);

var _onoffSwitchWidget = __webpack_require__(596);

var _onoffSwitchWidget2 = _interopRequireDefault(_onoffSwitchWidget);

var _axisToggleButtonWidget = __webpack_require__(597);

var _axisToggleButtonWidget2 = _interopRequireDefault(_axisToggleButtonWidget);

var _centerPositionWidget = __webpack_require__(121);

var _centerPositionWidget2 = _interopRequireDefault(_centerPositionWidget);

var _centerPositionNumberWidget = __webpack_require__(598);

var _centerPositionNumberWidget2 = _interopRequireDefault(_centerPositionNumberWidget);

var _tooltipTriggerRadioButtonWidget = __webpack_require__(599);

var _tooltipTriggerRadioButtonWidget2 = _interopRequireDefault(_tooltipTriggerRadioButtonWidget);

var _edgeTypeWidget = __webpack_require__(600);

var _edgeTypeWidget2 = _interopRequireDefault(_edgeTypeWidget);

var _customHorizontalAlignRadioButtonWidget = __webpack_require__(601);

var _customHorizontalAlignRadioButtonWidget2 = _interopRequireDefault(_customHorizontalAlignRadioButtonWidget);

var _customVerticalAlignRadioButtonWidget = __webpack_require__(603);

var _customVerticalAlignRadioButtonWidget2 = _interopRequireDefault(_customVerticalAlignRadioButtonWidget);

var _markerShowSelectorWidget = __webpack_require__(604);

var _markerShowSelectorWidget2 = _interopRequireDefault(_markerShowSelectorWidget);

var _labelWidget = __webpack_require__(605);

var _labelWidget2 = _interopRequireDefault(_labelWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: widget-index.js
 * Created by ji_sung.park on 2018-05-29
 */

exports.ShowButtonWidget = _showButtonWidget2.default;
exports.InputWidget = _inputWidget2.default;
exports.NumberInputWidget = _numberInputWidget2.default;
exports.MultiInputWidget = _multiInputWidget2.default;
exports.MultiLabelWidget = _multiLabelWidget2.default;
exports.CheckedMultiInputWidget = _checkedMultiInputWidget2.default;
exports.MultiColorWidget = _multiColorWidget2.default;
exports.ColorPickerWidget = _colorPickerWidget2.default;
exports.ColorInputWidget = _colorInputWidget2.default;
exports.ColorThemesSelectorWidget = _colorThemesSelectorWidget2.default;
exports.ColorPaletteWidget = _colorPaletteWidget2.default;
exports.ColumnSelectorWidget = _columnSelectorWidget2.default;
exports.ColumnSelectorWidgetDroppable = _columnSelectorWidgetDroppable2.default;
exports.FontSelectorWidget = _fontSelectorWidget2.default;
exports.FontSizeSelectorWidget = _fontSizeSelectorWidget2.default;
exports.FontStyleWidget = _fontStyleWidget2.default;
exports.OpacitySelectorWidget = _opacitySelectorWidget2.default;
exports.MarkerSizeSelectorWidget = _markerSizeSelectorWidget2.default;
exports.MarkerLineSelectorWidget = _markerLineSelectorWidget2.default;
exports.DashTypeSelectorWidget = _dashTypeSelectorWidget2.default;
exports.LineWidthSelectorWidget = _lineWidthSelectorWidget2.default;
exports.LineStyleWidget = _lineStyleWidget2.default;
exports.LineComponentWidget = _lineComponentWidget2.default;
exports.HorizontalAlignRadioButtonWidget = _horizontalAlignRadioButtonWidget2.default;
exports.VerticalAlignRadioButtonWidget = _verticalAlignRadioButtonWidget2.default;
exports.FontStyleButtonWidget = _fontStyleButtonWidget2.default;
exports.DirectionRadioButtonWidget = _directionRadioButtonWidget2.default;
exports.ToolTipBehaviorRadioButtonWidget = _tooltipBehaviorRadioButtonWidget2.default;
exports.DataSourceSelectorWidget = _datasourceSelectorWidget2.default;
exports.ChartTypeSelectorWidget = _chartTypeSelectorWidget2.default;
exports.SwitchButtonWidget = _switchButtonWidget2.default;
exports.PositionWidget = _positionWidget2.default;
exports.ColumnFormatterWidget = _columnFormatterWidget2.default;
exports.FormatTypeSelectorWidget = _formatTypeWidget2.default;
exports.FormatDigitSelectorWidget = _formatDigitWidget2.default;
exports.ItemSelectorWidget = _itemSelectorWidget2.default;
exports.OnOffSwitchWidget = _onoffSwitchWidget2.default;
exports.AxisToggleButtonWidget = _axisToggleButtonWidget2.default;
exports.CenterPositionWidget = _centerPositionWidget2.default;
exports.CenterPositionNumberWidget = _centerPositionNumberWidget2.default;
exports.CustomHorizontalAlignRadioButtonWidget = _customHorizontalAlignRadioButtonWidget2.default;
exports.CustomVerticalAlignRadioButtonWidget = _customVerticalAlignRadioButtonWidget2.default;
exports.ToolTipTriggerRadioButtonWidget = _tooltipTriggerRadioButtonWidget2.default;
exports.EdgeTypeSelectorWidget = _edgeTypeWidget2.default;
exports.MarkerShowSelectorWidget = _markerShowSelectorWidget2.default;
exports.LabelWidget = _labelWidget2.default;

/***/ }),
/* 565 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function ShowButtonWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

ShowButtonWidget.prototype = Object.create(_baseWidget2.default.prototype);
ShowButtonWidget.prototype.constructor = ShowButtonWidget;

ShowButtonWidget.prototype._createContents = function ($parent) {

    this.$showBtn = $('<div class="bo-control-header-show-button"></div>');
    this.$showBtn.text(this.options.defaultLabel ? this.options.defaultLabel : 'Show');
    this.$showBtn.jqxCheckBox({
        boxSize: '15px',
        theme: _chartOptionConst2.default.Theme,
        checked: this.options.defaultVal ? this.options.defaultVal : false
    });
    $parent.append(this.$showBtn);

    if (typeof this.options.clickfunc === 'function') {
        this.$showBtn.on('change', this.options.clickfunc);
    } else {
        console.error('Header show button: click event function is not existed.');
    }
};

ShowButtonWidget.prototype.getValue = function () {
    return this.$showBtn.val();
};

ShowButtonWidget.prototype.toggleDisable = function (disabled) {
    // this.$showBtn.jqxCheckBox({disabled: disabled});
};

ShowButtonWidget.prototype.render = function (changedValue) {
    this.$showBtn.jqxCheckBox({ checked: changedValue });
};

exports.default = ShowButtonWidget;

/***/ }),
/* 566 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _inputWidget = __webpack_require__(275);

var _inputWidget2 = _interopRequireDefault(_inputWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : String ( default: Value )
 *      labelPosition : row or column
 *      inputStyle : line or box,
 *      value: ''   // default value
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function NumberInputWidget(parentId, options) {
    _inputWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

NumberInputWidget.prototype = Object.create(_inputWidget2.default.prototype);
NumberInputWidget.prototype.constructor = NumberInputWidget;

NumberInputWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bo-widget-header bos-widget-header"></div>' + '   <div class="bo-widget-contents bos-widget-contents"></div>' + '</div>');

    $parent.append(this.$mainControl);
    if (this.options.labelPosition === 'column') {
        this.$mainControl.addClass('bos-flex-direction-column');
    }

    this._createHeader(this.$mainControl.find('.bo-widget-header'));

    this._createInputBox(this.$mainControl.find('.bo-widget-contents'));

    this._setPreValue(this.options.value);

    this._addKeyEventListener();

    this.$inputControl.addClass('bos-widget-number-input');
    if (this.options.width) this.$inputControl.css('width', this.options.width);
    if (this.options.height) this.$inputControl.css('height', this.options.height);
};

NumberInputWidget.prototype._bindOnChangedFunc = function ($parent) {
    var _this = this;
    if (typeof this.options.onChanged === 'function') {
        var callbackFunc = this.options.onChanged;
        this.$inputControl.on('blur', function () {
            if (!_this._isChanged(_this.$inputControl.val())) return;
            callbackFunc.bind(_this)(_this._getNumberTypeValue(_this.$inputControl.val()));
        });
        this.$inputControl.keydown(function _OnNumericInputKeyDown(e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                if (!_this._isChanged(_this.$inputControl.val())) return;
                callbackFunc.bind(_this)(_this.$inputControl.val());
            }
        });
    }
};

NumberInputWidget.prototype._getNumberTypeValue = function (numberTypeValue) {
    if (numberTypeValue === '') {
        return '';
    } else {
        return Number(numberTypeValue);
    }
};

NumberInputWidget.prototype._setPreValue = function (preVal) {
    this._preValue = preVal;
};

NumberInputWidget.prototype._isChanged = function (currentVal) {
    if (this._preValue !== currentVal) {
        this._setPreValue(currentVal);
        return true;
    } else {
        return false;
    }
};

NumberInputWidget.prototype._addKeyEventListener = function () {
    var _this = this;

    this.$inputControl.keydown(function _OnNumericInputKeyDown(e) {
        //!important : 20150613 - max 값 처리에서 callback 실행이 되지 않는 버그가 있어서 주석 처리하였음. ex) max가 설정되어 있을 때 0을 계속입력하면 callback 실행이 되지 않음.
        //_this.preValue = _this.$mainControl.val();

        var key = e.which || e.keyCode; // http://keycode.info/

        if (key === 13) {
            e.preventDefault();
            return false;
        }

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
        // alphabet
        key >= 65 && key <= 90 ||
        // spacebar
        key == 32 ||
        // enter
        key == 13) {
            e.preventDefault();
            return false;
        }

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
        // numbers
        key >= 48 && key <= 57 ||
        // Numeric keypad
        key >= 96 && key <= 105 ||

        // Allow: Ctrl+A
        e.keyCode == 65 && e.ctrlKey === true ||
        // Allow: Ctrl+C
        key == 67 && e.ctrlKey === true ||
        // Allow: Ctrl+X
        key == 88 && e.ctrlKey === true ||

        // Allow: home, end, left, right
        key >= 35 && key <= 39 ||
        // Backspace and Tab and Enter
        key == 8 || key == 9 || key == 13 ||
        // Del and Ins
        key == 46 || key == 45) {
            return true;
        }

        var v = _this.$inputControl.val(); // v can be null, in case textbox is number and does not valid
        if (
        //  minus, dash
        key == 109 || key == 189) {

            // if already has -, ignore the new one
            if (v[0] === '-') {
                //console.log('return, already has - in the beginning');
                return false;
            }
        }

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
        // comma, period and dot on keypad
        key == 190 || key == 188 || key == 110) {
            // already having comma, period, dot
            if (/[\.,]/.test(v)) {
                //console.log('return, already has , . somewhere');
                return false;
            }
        }
    });

    this.$inputControl.keyup(function _OnNumericInputKeyUp(e) {
        var v = _this.$inputControl.val();

        if (+v) {// convert to number success, let it be
            //                      "1000"  "10.9"  "1,000.9"   "011"   "10c"   "$10"
            //+str, str*1, str-0    1000    10.9    NaN         11      NaN     NaN

        } else if (v) {
            // refine the value
            v = (v[0] === '-' ? '-' : '') + v.replace(/[^0-9\.]/g, ''); // this replace also remove the -, we add it again if needed
            v = v.replace(/\.(?=(.*)\.)+/g, ''); // remove all dot that have other dot following. After this processing, only the last dot is kept.

            _this.$inputControl.val(v); // update value only if we changed it
        }
    });
};

exports.default = NumberInputWidget;

/***/ }),
/* 567 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : String ( default: Value )
 *      labelPosition : row or column
 *      inputStyle : line or box,
 *      value: ''   // default value
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function MultiLabelWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

MultiLabelWidget.prototype = Object.create(_baseWidget2.default.prototype);
MultiLabelWidget.prototype.constructor = MultiLabelWidget;

MultiLabelWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bo-widget-header bos-widget-header bos-widget-label"></div>' + '   <div class="bo-widget-contents bos-widget-contents bos-display-flex"></div>' + '</div>');

    $parent.append(this.$mainControl);

    this._createHeader(this.$mainControl.find('.bo-widget-header'));

    var numberOfLabel = this.options.numOfComponent ? this.options.numOfComponent : 2;
    for (var idx = 0; idx < numberOfLabel; idx++) {

        this._createLabel(this.$mainControl.find('.bo-widget-contents'), idx);
    }
};

MultiLabelWidget.prototype._createHeader = function ($parent) {
    var label = this.options.label || 'Value';
    $parent.text(label);
};

MultiLabelWidget.prototype._createLabel = function ($parent, inputBoxIdx) {
    var $label = $('<div class="bos-widget-label">' + this.options.value[inputBoxIdx] + '</div>');
    $parent.append($label);
    if (this.options.helper && this.options.helper[inputBoxIdx]) {
        var _this = this;
        var $iconDiv = $('<div class="bos-icon-help"></div>');
        $iconDiv.hover(function () {
            _this.helperDialog = new _this.options.helper[inputBoxIdx]($iconDiv, {
                windowPosition: 'bottom-left',
                switchPosition: 'top-left'
            });
        }, function () {
            _this.helperDialog._closeHandler();
        });
        $label.append($iconDiv);
    }
    $label.css('width', '100%');
};

exports.default = MultiLabelWidget;

/***/ }),
/* 568 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _multiInputWidget = __webpack_require__(276);

var _multiInputWidget2 = _interopRequireDefault(_multiInputWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : String ( default: Value )
 *      labelPosition : row or column
 *      inputStyle : line or box,
 *      value: ['','',''],
 *      inputType: ['number', '','number'],
 *      numberOfInput: 3 (default: 2)
 *      onChanged: [function(){}, function(){}, function(){}],
 *      showBtn:{
 *          defaultVal: false
 *          clickfunc: function(){}
 *      }
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function CheckedMultiInputWidget(parentId, options) {
    _multiInputWidget2.default.call(this, parentId, options);
}

CheckedMultiInputWidget.prototype = Object.create(_multiInputWidget2.default.prototype);
CheckedMultiInputWidget.prototype.constructor = CheckedMultiInputWidget;

CheckedMultiInputWidget.prototype._createContents = function ($parent) {
    _multiInputWidget2.default.prototype._createContents.call(this, $parent);
    this._setComponentShow();
};

CheckedMultiInputWidget.prototype._createHeader = function ($parent) {
    var $headerControl = $('' + '<div class="bo-widget-header-show-button"></div>' + '<div class="bo-widget-header-label"></div>');
    $parent.append($headerControl);

    var label = this.options.label || 'Value';

    this.$chkButton = $parent.find('.bo-widget-header-show-button');
    this.$chkButton.jqxCheckBox({
        boxSize: '15px',
        theme: _chartOptionConst2.default.Theme,
        checked: this.options.showBtn.defaultVal ? this.options.showBtn.defaultVal : false
    });

    if (typeof this.options.showBtn.clickfunc === 'function') {
        this.$chkButton.on('change', this.options.showBtn.clickfunc);
    } else {
        console.error('Header [' + label + '] show button: click event function is not existed.');
    }

    $parent.find('.bo-widget-header-label').text(label);

    if (this.options.labelWidth) {
        $parent.find('.bo-widget-header-label').css('width', this.options.labelWidth);
        $parent[0].style.width = '130px';
    }
};

CheckedMultiInputWidget.prototype._setComponentShow = function ($parent) {
    if (!this.$chkButton.val()) {
        this.toggleDisable(true, true);
    }
};

CheckedMultiInputWidget.prototype.toggleDisable = function (disabled, exceptCheckBoxDisable) {
    this.inputControlList.forEach(function (inputControl) {
        // $inputControl.jqxInput({disabled: disabled});
        inputControl.toggleDisable(disabled);
    });
    if (!exceptCheckBoxDisable) {
        this.$chkButton.jqxCheckBox({ checked: !disabled, disabled: disabled });
    }
};

exports.default = CheckedMultiInputWidget;

/***/ }),
/* 569 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : ['','',''],
 *      value: ['','',''],
 *      numberOfInput: 3 (default: 2)
 *      onChanged: [function(){}, function(){}, function(){}]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by sds on 2018-01-03.
 */

function MultiColorWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
}

MultiColorWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
MultiColorWidget.prototype.constructor = MultiColorWidget;

MultiColorWidget.prototype._createContents = function ($parent) {
    var numberOfWidget = this.options.numOfComponent ? this.options.numOfComponent : 2;
    for (var idx = 0; idx < numberOfWidget; idx++) {
        var $mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bo-widget-header bos-widget-header half"></div>' + '   <div class="bo-widget-contents bos-widget-contents bos-display-flex"></div>' + '</div>');

        $parent.append($mainControl);
        this._createHeader($mainControl.find('.bo-widget-header'), idx);
        this._createMultiColor($mainControl.find('.bo-widget-contents'), idx);
        if (idx != numberOfWidget - 1) {
            $mainControl.addClass('bos-widget-column-separator');
        }
    }
};

MultiColorWidget.prototype._createHeader = function ($parent, idx) {
    if (!this.options.label) $parent.remove();else {
        var label = this.options.label[idx];
        $parent.text(label);
    }
    // $parent.addClass('bos-widget-column-separator');
};

MultiColorWidget.prototype._createMultiColor = function ($parent, idx) {
    var colorWidget = WidgetFactory.createColorPickerWidget($parent, {
        value: this.options.value[idx],
        onChanged: this.options.onChanged[idx]
    });
    this._widgetList.push(colorWidget);
};

exports.default = MultiColorWidget;

/***/ }),
/* 570 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _colorPickerDialog = __webpack_require__(277);

var _colorPickerDialog2 = _interopRequireDefault(_colorPickerDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

var DEFAULT_HEX_COLOR = '#000000';
var DEFAULT_RGBA_COLOR = 'rgba(0,0,0,0)';

/**
 * options = {
 *      label: 'color',
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value: '#000000',  //default color
 *      hasOpacity: false,   //true || false
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function ColorPickerWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

ColorPickerWidget.prototype = Object.create(_baseWidget2.default.prototype);
ColorPickerWidget.prototype.constructor = ColorPickerWidget;

ColorPickerWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-widget-color-picker-container">' + '</div>');

    $parent.append(this.$mainControl);

    this._configureMainControlSize();
    this._createColorBox();
    this._createColorPickerDialogButton();
};
ColorPickerWidget.prototype._configureMainControlSize = function () {
    this.$mainControl.css('width', this.options.width ? this.options.width : '50px');
    this.$mainControl.css('height', this.options.height ? this.options.height : '30px');
};

ColorPickerWidget.prototype._createColorBox = function () {

    // var mainControlWidth = this.$mainControl.width();
    // var mainControlHeight = this.$mainControl.height();

    var $boxWrapper = $('<div class="bos-color-picker-box-wrapper"></div>');

    this.$colorBox = $('<div class="bos-full"></div>');
    this._setColor(this._getDefaultColorString(this.options.value, this.options.hasOpacity));
    this.$mainControl.append($boxWrapper);
    // $boxWrapper.css('width', mainControlHeight);
    // $boxWrapper.css('height', mainControlHeight);

    $boxWrapper.append(this.$colorBox);
};

ColorPickerWidget.prototype._getDefaultColorString = function (inputValue, hasOpacity) {
    var defaultColor;
    if (hasOpacity) {
        if (inputValue && inputValue != 'transparent') {
            defaultColor = inputValue;
        } else {
            defaultColor = DEFAULT_RGBA_COLOR;
        }
    } else {
        defaultColor = inputValue ? inputValue : DEFAULT_HEX_COLOR;
    }
    return defaultColor;
};

ColorPickerWidget.prototype._setColor = function (colorString) {
    //rgba
    // var colorSet;
    if (colorString.includes('rgba')) {
        colorString = this._rgba2hex(colorString);
    } else if (colorString.includes('rgb')) {
        colorString = this._rgb2hex(colorString);
    }

    this.color = colorString; //hex (ex. 'red' or '#fff')
    this.$colorBox.css('background-color', this.color);
};

//Function to convert hex format to a rgb color
ColorPickerWidget.prototype._rgb2hex = function (rgb) {
    rgb = rgb.match(/^rgb?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
};

ColorPickerWidget.prototype._rgba2hex = function (rgba) {
    rgba = rgba.match(/^^rgba[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d?\.?\d+)[\s+]?/i);
    if (rgba && rgba.length === 5) {
        this.opacity = rgba[4];
        return "#" + ("0" + parseInt(rgba[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgba[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgba[3], 10).toString(16)).slice(-2);
    } else {
        this.opacity = 1;
        return '';
    }
};

ColorPickerWidget.prototype._hexToRgb = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

ColorPickerWidget.prototype._createColorPickerDialogButton = function () {
    var _this = this;
    var $buttonArea = $('<div class="bos-widget-right-button-area"></div>');
    this.$mainControl.append($buttonArea);

    $buttonArea.click(function () {
        _this.colorPickerDialog = new _colorPickerDialog2.default(_this.$mainControl, {
            windowPosition: _this.options.windowPosition || 'bottom',
            close: function close() {
                if (typeof _this.options.onChanged === 'function') {
                    if (_this.options.hasOpacity) {
                        _this.options.onChanged.bind(_this)(function () {
                            var colorSet = _this._hexToRgb(_this.color);
                            return 'rgba(' + colorSet.r + ', ' + colorSet.g + ', ' + colorSet.b + ', ' + _this.opacity + ')';
                        }());
                    } else {
                        _this.options.onChanged.bind(_this)(_this.color);
                    }
                }
            },
            color: _this.color || '#FFFFFF',
            onChanged: _this._setColor.bind(_this)
        });
    });
};

ColorPickerWidget.prototype.toggleDisable = function (disabled) {
    if (this.$mainControl.find('.bo-widget-disable-cover').length > 0) this.$mainControl.find('.bo-widget-disable-cover').remove();
    this.$mainControl.removeClass('bos-widget-disable');
    if (disabled) {
        var $disabledCover = $('<div class="bos-widget-disable-cover bo-widget-disable-cover"></div>');
        this.$mainControl.append($disabledCover);
        this.$mainControl.addClass('bos-widget-disable');
    }
};

ColorPickerWidget.prototype.render = function (changedValue, hasOpacity) {
    this._setColor(this._getDefaultColorString(changedValue, hasOpacity));
};

ColorPickerWidget.prototype.close = function () {
    if (this.colorPickerDialog) {
        this.colorPickerDialog._closeHandler();
    }
};

exports.default = ColorPickerWidget;

/***/ }),
/* 571 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : String ( default: Value )
 *      labelPosition : row or column,
 *      internalLabel: (default: label) //use as validation target.
 *      inputStyle : line or box,
 *      placeHolder: '',
 *      value: ''   // default value
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90.kim on 2017-12-28.
 */

function ColorInputWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
}

ColorInputWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
ColorInputWidget.prototype.constructor = ColorInputWidget;

ColorInputWidget.prototype._createContents = function ($parent) {
    this._createValueComponent($parent);
    this._createColorPickerComponent($parent);
};

ColorInputWidget.prototype._createValueComponent = function ($component, lineData, lineIndex) {
    var _this = this;
    var numberInputWidget = WidgetFactory.createNumberInputWidget($component, {
        label: 'Color Point',
        labelPosition: 'row',
        inputStyle: 'box',
        value: this.options.value[0],
        onChanged: this.options.onChanged[0]
    });
    numberInputWidget.$mainControl.addClass('bos-flex-1');
    this._widgetList.push(numberInputWidget);
};

ColorInputWidget.prototype._createColorPickerComponent = function ($component, lineData, lineIndex) {
    var colorSelector = WidgetFactory.createColorPickerWidget($component, {
        width: '50px',
        height: '30px',
        windowPosition: 'left',
        value: this.options.value[1],
        onChanged: this.options.onChanged[1]
    });

    this._widgetList.push(colorSelector);
};

exports.default = ColorInputWidget;

/***/ }),
/* 572 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ColorThemesSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

ColorThemesSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
ColorThemesSelectorWidget.prototype.constructor = ColorThemesSelectorWidget;

ColorThemesSelectorWidget.prototype._createListSource = function () {
    return this.options.source;
};

exports.default = ColorThemesSelectorWidget;

/***/ }),
/* 573 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _preference = __webpack_require__(278);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * Created by mk90.kim on 2017-05-10.
                                                                                                                                                                                                                   */

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value: {
 *          hex:'#000000'  //default color
 *          r: '',
 *          g: '',
 *          b: ''
 *      }
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function ColorPaletteWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
}

ColorPaletteWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
ColorPaletteWidget.prototype.constructor = ColorPaletteWidget;

ColorPaletteWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-widget-color-palette-container">' + '</div>');

    $parent.append(this.$mainControl);

    // var defaultColorSet = (this.options.value.length > 0) ? this.options.value : ChartOptionConst.ColorPaletteList['Brightics'];
    //TODO: 이번스프린트때 template제외(UX에서 color set 오면 시작)
    this._createColorThemesSelectorWidget();
    this._createColorPickers(this.options.value);
};

ColorPaletteWidget.prototype._createColorThemesSelectorWidget = function () {
    var _this = this;
    var $themesSelectorPanel = $('<div class="bo-widget-color-themes-selector"/>');
    this.$mainControl.append($themesSelectorPanel);

    var colorPalette = (0, _preference.getColorPalette)();
    var names = colorPalette.map(function (c) {
        return _.escape(c.name);
    });
    var paletteMap = colorPalette.map(function (c) {
        return _defineProperty({}, _.escape(c.name), c.colors);
    }).reduce(Object.assign, {});
    this.themesSelector = WidgetFactory.createColorThemesSelectorWidget(this.$mainControl.find('.bo-widget-color-themes-selector'), {
        placeHolder: 'Select a Color Palette Theme',
        source: names,
        onChanged: function onChanged(theme) {
            _this.$mainControl.find('.bo-widget-color-picker-wrapper').remove();
            _this._createColorPickers(paletteMap[theme]);
            _this.options.onChanged.call(_this, paletteMap[theme]);
        }
    });
};

ColorPaletteWidget.prototype._createColorPickers = function (colorSet) {
    var $colorPickerPanel = $('<div class="bo-widget-color-picker-wrapper bos-display-flex bos-flex-wrap bos-flex-space-between"/>');
    this.$mainControl.append($colorPickerPanel);

    var _this = this;
    var modifiedColorSet = $.extend([], colorSet);
    modifiedColorSet.forEach(function (defaultColor, index) {
        _this._widgetList.push(WidgetFactory.createColorPickerWidget($colorPickerPanel, {
            value: defaultColor,
            onChanged: function onChanged(changedColor) {
                modifiedColorSet[index] = changedColor;
                _this.options.onChanged.bind(_this)(modifiedColorSet);
                // _this.themesSelector.clearSelection();
            }
        }));
    });
};

exports.default = ColorPaletteWidget;

/***/ }),
/* 574 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* -----------------------------------------------------
 *  default-preference.js
 *  Created by hyunseok.oh@samsung.com on 2018-09-10.
 * ---------------------------------------------------- */

var DefaultPreference = {
    colorPalette: [{
        name: 'Brightics',
        colors: ['#FD026C', '#4682B8', '#A5D221', '#F5CC0A', '#FE8C01', '#6B9494', '#B97C46', '#84ACD0', '#C2E173', '#F9DD5B', '#FE569D', '#FEB356', '#9CB8B8', '#D0A884', '#2E6072', '#6D8C1E', '#A48806', '#A90148', '#A95E01', '#476363', '#7B532F']
    }, {
        name: 'Rainbow',
        colors: ['#FF0000', '#FF9D00', '#EEFF00', '#34B545', '#3E6DC4', '#4B0082', '#863DCC']
    }]
};

exports.default = DefaultPreference;

/***/ }),
/* 575 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _columnSelectorWidget = __webpack_require__(58);

var _columnSelectorWidget2 = _interopRequireDefault(_columnSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      column : [
            {name:'SepalLength','type':'number'},
            {name:'SepalWidth','type':'number'},
            {name:'PetalLength','type':'number'},
            {name:'PetalWidth','type':'number'},
            {name:'Species','type':'string'},
            {name:'Class','type':'string'},
        ],
        selected: [{name: 'SepalLength', aggregation: 'none' }],
        label: 'X-axis' (mandantory)
        onChanged: function(){]
 * }
 */
function ColumnSelectorWidgetDroppable(parentId, options) {
    _columnSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

ColumnSelectorWidgetDroppable.prototype = Object.create(_columnSelectorWidget2.default.prototype);
ColumnSelectorWidgetDroppable.prototype.constructor = ColumnSelectorWidgetDroppable;

ColumnSelectorWidgetDroppable.prototype._init = function () {
    _columnSelectorWidget2.default.prototype._init.call(this);
    this.options.selected = $.extend(true, [], this.options.selected);
    this.showMultiple = false;
    this.hasType = false; //column selector에 type이 있는지
    this.defaultMsg = 'Drop Column';
};

ColumnSelectorWidgetDroppable.prototype._bindColumnControlUnitEvent = function ($target) {
    var _this = this;
    $target.droppable({
        hoverClass: 'status-drop-hover',
        accept: '.bcharts-ds-draggable',
        drop: function drop(event, ui) {
            var $helper = ui.helper,
                draggableType = $helper.attr('drag-type');

            if (draggableType != 'column') return;

            if ($helper.attr('dropped')) {
                return;
            }

            $helper.attr('dropped', true);

            var source = $helper.data(draggableType);

            //policy: aggregation유지하지않음.
            // chart type별로 aggregation Map을 정의하고있어서 default aggregation을 알수없다.
            if (_this.options.multiple && _this.options.selected.length > 0 && !$.isEmptyObject(_this.options.selected[0])) {
                _this.options.selected.push(source);
            } else {
                _this.options.selected[0] = source;
            }

            _this._fireColumnChanged(_this.options.selected);
        }
    });
};

ColumnSelectorWidgetDroppable.prototype._fillColumnControlUnit = function () {
    this._renderColumnControlUnit();
};

ColumnSelectorWidgetDroppable.prototype._renderColumnControlUnit = function () {
    var unitList = this.$mainControl.find('.bo-widget-column-unit-wrapper');

    var targetColumn = this.options.selected[0];
    unitList.find('.bo-widget-column-unit-label').text(this._getColumnLabel(targetColumn));
};

exports.default = ColumnSelectorWidgetDroppable;

/***/ }),
/* 576 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value: ''   // default value
 *      onChanged: function(){]
 * }
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function FontSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
}

FontSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
FontSelectorWidget.prototype.constructor = FontSelectorWidget;

FontSelectorWidget.prototype._createContents = function ($parent) {
    _baseSelectorWidget2.default.prototype._createContents.call(this, $parent);
    this.$mainControl.addClass('font');
};

FontSelectorWidget.prototype._createListSource = function () {
    return _chartOptionConst2.default.FontList;
};

FontSelectorWidget.prototype._createSelectorOption = function () {
    var selectedIdx = this._getItemIndexInSource(this.options.value);
    return {
        // dropDownWidth: 130, //FIXME: dynamic하게 수정하려면?
        selectedIndex: selectedIdx,
        selectionRenderer: this._selectionRenderer.bind(this),
        renderer: this._renderer.bind(this)
    };
};

// FontSelectorWidget.prototype._getMaxLengthOfList = function () {
//     return this._createListSource().reduce(function (prev, cur) {
//         return (prev.label.length > cur.label.length) ? prev : cur;
//     }).label.length;
// };

FontSelectorWidget.prototype._getItemIndexInSource = function (item) {
    return this._createListSource().findIndex(function (source) {
        return source.value === item;
    });
};

FontSelectorWidget.prototype._selectionRenderer = function () {
    var item = this.$selectorControl.jqxDropDownList('getSelectedItem');
    if (!item) return '<span class="bos-widget-font-selector-unit">Select Font</span>';
    return '<span class="bos-widget-font-selector-unit" style="font-family:' + item.value + '">' + item.label + '</span>';
};

FontSelectorWidget.prototype._renderer = function (index, label, value) {
    return '<span class="bos-widget-font-selector-unit" style="font-family:' + value + '">' + label + '</span>';
};

exports.default = FontSelectorWidget;

/***/ }),
/* 577 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FontSizeSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

FontSizeSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
FontSizeSelectorWidget.prototype.constructor = FontSizeSelectorWidget;

FontSizeSelectorWidget.prototype._init = function () {
    _baseSelectorWidget2.default.prototype._init.call(this);
    this.options.type = 'number';
};

FontSizeSelectorWidget.prototype._createListSource = function () {
    return [10, 11, 12, 14, 18, 24, 36, 50];
};

exports.default = FontSizeSelectorWidget;

/***/ }),
/* 578 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 options = {
    value: ['font_ref', 'font_size_ref', 'font_color_ref',
        ['font_bold_ref', 'font_italic_ref', 'font_underline_ref']
    ],   //Default value: font, font size, font color, font style
    onChanged: [function () {}, function () {}, function () {},
        [function () {}, function () {}, function () {}]
    ]
}
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function FontStyleWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
}

FontStyleWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
FontStyleWidget.prototype.constructor = FontStyleWidget;

FontStyleWidget.prototype._createContents = function ($parent) {

    var header = this.options.header || 'Font Style';

    var $styleComponent = $('' + '<div class="bos-display-flex bos-flex-direction-column">' + '   <div class="bo-widget-header">' + header + '</div>' + '   <div class="bo-component-style-contents bos-display-flex">' + '       <div class="bo-component-style-font-family bos-widget-column-separator bos-flex-2"></div>' + '       <div class="bo-component-style-font-size bos-widget-column-separator bos-flex-1"></div>' + '       <div class="bo-component-style-font-color  bos-col-50px"></div>' + '   </div>' + '   <div class="bo-component-style-font-style"></div>' + '</div>');

    $parent.append($styleComponent);
    var $styleComponentContents = $styleComponent.find('.bo-component-style-contents');

    this.fontSelector = WidgetFactory.createFontSelectorWidget($styleComponentContents.find('.bo-component-style-font-family'), {
        value: this.options.value[0] || 'Arial',
        onChanged: this.options.onChanged[0]
    });

    this.fontSizeSelector = WidgetFactory.createFontSizeSelectorWidget($styleComponentContents.find('.bo-component-style-font-size'), {
        value: Number(this.options.value[1]),
        onChanged: this.options.onChanged[1]
    });

    this.fontColorSelector = WidgetFactory.createColorPickerWidget($styleComponentContents.find('.bo-component-style-font-color'), {
        width: '50px',
        height: '30px',
        windowPosition: 'left',
        value: this.options.value[2],
        onChanged: this.options.onChanged[2]
    });

    var $styleComponentButton = $styleComponent.find('.bo-component-style-font-style');
    this.fontStyleSelector = WidgetFactory.createFontStyleButtonWidget($styleComponentButton, {
        fontStyleBtnList: this.options.fontStyleBtnList,
        value: this.options.value[3],
        onChanged: this.options.onChanged[3]
    });

    this._widgetList.push(this.fontSelector);
    this._widgetList.push(this.fontSizeSelector);
    this._widgetList.push(this.fontColorSelector);
    this._widgetList.push(this.fontStyleSelector);
};

exports.default = FontStyleWidget;

/***/ }),
/* 579 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function OpacitySelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
}

OpacitySelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
OpacitySelectorWidget.prototype.constructor = OpacitySelectorWidget;

OpacitySelectorWidget.prototype._init = function () {
    _baseSelectorWidget2.default.prototype._init.call(this);
    this.options.type = 'number';
};

OpacitySelectorWidget.prototype._createListSource = function () {
    return _chartOptionConst2.default.OpacityList;
};

OpacitySelectorWidget.prototype._getItemIndexInSource = function (item) {
    return this._createListSource().findIndex(function (source) {
        return source.value === item;
    });
};

exports.default = OpacitySelectorWidget;

/***/ }),
/* 580 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MarkerSizeSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

MarkerSizeSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
MarkerSizeSelectorWidget.prototype.constructor = MarkerSizeSelectorWidget;

MarkerSizeSelectorWidget.prototype._createSelectorOption = function () {
    if (this.options.autoSize) {
        return {
            selectedIndex: 0,
            disabled: true
        };
    }
    return _baseSelectorWidget2.default.prototype._createSelectorOption.call(this);
};

MarkerSizeSelectorWidget.prototype._createListSource = function () {
    if (this.options.autoSize) {
        return ['Auto'];
    } else {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    }
};

exports.default = MarkerSizeSelectorWidget;

/***/ }),
/* 581 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MarkerLineSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

MarkerLineSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
MarkerLineSelectorWidget.prototype.constructor = MarkerLineSelectorWidget;

MarkerLineSelectorWidget.prototype._createListSource = function () {
    return ['flat', 'smooth'];
};

exports.default = MarkerLineSelectorWidget;

/***/ }),
/* 582 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function DashTypeSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
}

DashTypeSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
DashTypeSelectorWidget.prototype.constructor = DashTypeSelectorWidget;

DashTypeSelectorWidget.prototype._createListSource = function () {
    if (this.options && this.options.chartLine) {
        return _chartOptionConst2.default.chartLineStyleList;
    } else {
        return _chartOptionConst2.default.LineStyleList;
    }
};
DashTypeSelectorWidget.prototype._createSelectorOption = function () {
    var selectedIdx = this._getItemIndexInSource(this.options.value);
    return {
        selectedIndex: selectedIdx,
        selectionRenderer: this._selectionRenderer.bind(this),
        renderer: this._renderer.bind(this)
    };
};

DashTypeSelectorWidget.prototype._getItemIndexInSource = function (item) {
    return this._createListSource().findIndex(function (source) {
        return source.value === item;
    });
};

DashTypeSelectorWidget.prototype._selectionRenderer = function () {
    var item = this.$selectorControl.jqxDropDownList('getSelectedItem');
    if (!item) return '<div class="bos-display-flex-center"><hr class="bos-widget-dash-selector-unit" value="none"/></div>';
    return '<div class="bos-display-flex-center"><hr class="bos-widget-dash-selector-unit" value="' + item.value + '"/></div>';
};

DashTypeSelectorWidget.prototype._renderer = function (index, label, value) {
    return '<hr class="bos-widget-dash-selector-unit" value="' + value + '"/>';
};

exports.default = DashTypeSelectorWidget;

/***/ }),
/* 583 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LineWidthSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */


LineWidthSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
LineWidthSelectorWidget.prototype.constructor = LineWidthSelectorWidget;

LineWidthSelectorWidget.prototype._init = function () {
    _baseSelectorWidget2.default.prototype._init.call(this);
    this.options.type = 'number';
};

LineWidthSelectorWidget.prototype._createListSource = function () {
    return [1, 2, 3, 4, 5, 6];
};

exports.default = LineWidthSelectorWidget;

/***/ }),
/* 584 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function LineStyleWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
}

LineStyleWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
LineStyleWidget.prototype.constructor = LineStyleWidget;

LineStyleWidget.prototype._createContents = function ($parent) {

    var $styleComponent = $('' + '<div class="bos-display-flex bos-flex-direction-column">' + '   <div class="bo-widget-header"></div>' + '   <div class="bo-component-style-contents bos-display-flex">' + '       <div class="bo-component-style-line-width bos-widget-column-separator  bos-flex-1"></div>' + '       <div class="bo-component-style-line-color bos-widget-column-separator "></div>' + '       <div class="bo-component-style-line-type  bos-flex-1"></div>' + '   </div>' + '</div>');

    $parent.append($styleComponent);

    this._createHeader($styleComponent.find('.bo-widget-header'));
    this._createComponent($styleComponent.find('.bo-component-style-contents'));
};

LineStyleWidget.prototype._createHeader = function ($header) {
    var label = this.options.label || 'Line Style';
    $header.text(label);
};

LineStyleWidget.prototype._createComponent = function ($styleComponentContents) {
    this.lineWidthSelector = WidgetFactory.createLineWidthSelectorWidget($styleComponentContents.find('.bo-component-style-line-width'), {
        value: this.options.value[0],
        onChanged: this.options.onChanged[0]
    });

    this.lineColorSelector = WidgetFactory.createColorPickerWidget($styleComponentContents.find('.bo-component-style-line-color'), {
        width: '50px',
        height: '30px',
        //windowPosition: 'left',
        value: this.options.value[1],
        onChanged: this.options.onChanged[1]
    });

    this.dashTypeSelector = WidgetFactory.createDashTypeSelectorWidget($styleComponentContents.find('.bo-component-style-line-type'), {
        value: this.options.value[2],
        onChanged: this.options.onChanged[2],
        chartLine: this.options.chartLine
    });

    this._widgetList.push(this.lineWidthSelector);
    this._widgetList.push(this.lineColorSelector);
    this._widgetList.push(this.dashTypeSelector);
};

exports.default = LineStyleWidget;

/***/ }),
/* 585 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Value + LineStyleWidget(stripline, markline control에서 사용하기위함)
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by sds on 2017-12-06.
 */

function LineComponentWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
}

LineComponentWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
LineComponentWidget.prototype.constructor = LineComponentWidget;

LineComponentWidget.prototype._createContents = function ($parent) {
    if (!this.options.trendLine) {
        this._createValueComponent($parent);
        $parent.append($('<div class="bos-widget-row-separator"/>'));
    }
    this._createStyleComponent($parent);
};

LineComponentWidget.prototype._createValueComponent = function ($component, lineData, lineIndex) {
    var _this = this;
    var numberInputWidget = WidgetFactory.createNumberInputWidget($component, {
        labelPosition: 'row',
        inputStyle: 'box',
        value: this.options.value[0],
        onChanged: this.options.onChanged[0]
    });
    this._widgetList.push(numberInputWidget);
};

LineComponentWidget.prototype._createStyleComponent = function ($component) {
    var _this = this;
    var lineStyleData = this.options.value[1];
    var lineStyleWidget = WidgetFactory.createLineStyleWidget($component, {
        value: [lineStyleData.width, lineStyleData.color, lineStyleData.type],
        onChanged: this.options.onChanged[1],
        chartLine: this.options.chartLine
    });
    this._widgetList.push(lineStyleWidget);
};

exports.default = LineComponentWidget;

/***/ }),
/* 586 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseCheckButtonGroupWidget = __webpack_require__(281);

var _baseCheckButtonGroupWidget2 = _interopRequireDefault(_baseCheckButtonGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 30px,
 *      fontStyleBtnList: ['bold', 'italic'], //default: ['bold', 'italic', 'underline']
 *      value: ''
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function FontStyleButtonWidget(parentId, options) {
    _baseCheckButtonGroupWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

FontStyleButtonWidget.prototype = Object.create(_baseCheckButtonGroupWidget2.default.prototype);
FontStyleButtonWidget.prototype.constructor = FontStyleButtonWidget;

FontStyleButtonWidget.prototype._setCheckBtnList = function () {

    this._buttonList = [{
        imgPosition: 'left',
        imageClass: 'bos-font-style-bold',
        value: 'bold'
    }, {
        imgPosition: 'center',
        imageClass: 'bos-font-style-italic',
        value: 'italic'
    }, {
        imageClass: 'bos-font-style-underline',
        value: 'underline'
    }];
    var _this = this;
    var controlUsedBtnList = this.options.fontStyleBtnList || ['bold', 'italic', 'underline'];
    if (controlUsedBtnList) {
        this._buttonList = this._buttonList.filter(function (button) {
            return $.inArray(button.value, controlUsedBtnList) > -1;
        });
    }
};

exports.default = FontStyleButtonWidget;

/***/ }),
/* 587 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseRadioButtonGroupWidget = __webpack_require__(59);

var _baseRadioButtonGroupWidget2 = _interopRequireDefault(_baseRadioButtonGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DirectionRadioButtonWidget(parentId, options) {
    _baseRadioButtonGroupWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

DirectionRadioButtonWidget.prototype = Object.create(_baseRadioButtonGroupWidget2.default.prototype);
DirectionRadioButtonWidget.prototype.constructor = DirectionRadioButtonWidget;

DirectionRadioButtonWidget.prototype._setRadioButtonList = function () {
    this._buttonList = [{
        imageClass: 'bos-direction-align-horizontal',
        value: 'horizontal'
    }, {
        imageClass: 'bos-direction-align-vertical',
        value: 'vertical'
    }];
};

exports.default = DirectionRadioButtonWidget;

/***/ }),
/* 588 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseRadioButtonGroupWidget = __webpack_require__(59);

var _baseRadioButtonGroupWidget2 = _interopRequireDefault(_baseRadioButtonGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ToolTipBehaviorRadioButtonWidget(parentId, options) {
    _baseRadioButtonGroupWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

ToolTipBehaviorRadioButtonWidget.prototype = Object.create(_baseRadioButtonGroupWidget2.default.prototype);
ToolTipBehaviorRadioButtonWidget.prototype.constructor = ToolTipBehaviorRadioButtonWidget;

ToolTipBehaviorRadioButtonWidget.prototype._setRadioButtonList = function () {
    this._buttonList = [{
        label: 'Mouse Move',
        value: 'mousemove'
    }, {
        label: 'Click',
        value: 'click'
    }];
};

exports.default = ToolTipBehaviorRadioButtonWidget;

/***/ }),
/* 589 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _datasourceSelectorDialog = __webpack_require__(282);

var _datasourceSelectorDialog2 = _interopRequireDefault(_datasourceSelectorDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {

 * }
 */
/**
 * Created by mk90.kim on 2017-05-10.
 */

function DataSourceSelectorWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

DataSourceSelectorWidget.prototype = Object.create(_baseWidget2.default.prototype);
DataSourceSelectorWidget.prototype.constructor = DataSourceSelectorWidget;

DataSourceSelectorWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bos-widget-header bo-widget-header"></div>' + '   <div class="bos-display-flex bos-flex-direction-column bos-widget-contents bos-widget-column-contents bo-widget-contents"></div>' + '</div>');
    $parent.append(this.$mainControl);

    var label = this.options.label || 'Data Source';
    this.$mainControl.find('.bo-widget-header').text(label);

    this._createDataSourceControlUnit();
    this._fillDataSourceControlUnit();
    this._setPreValue(this.options.selected);
};

DataSourceSelectorWidget.prototype._createDataSourceControlUnit = function (index) {
    var _this = this;
    var $parent = this.$mainControl.find('.bo-widget-contents');
    var $dataSourceUnit = this._createNewDataSourceUnit();

    $parent.append($dataSourceUnit);

    $dataSourceUnit.click(function () {
        var dialogOption = $.extend(true, _this.options, {
            windowPosition: _this.options.windowPosition || 'left',
            switchPosition: 'left',
            close: function close(dataSource) {
                if (_this._isChanged(dataSource)) {
                    _this.options.id = dataSource;
                    _this._fillDataSourceControlUnit(dataSource.label);
                    _this.options.onChanged(dataSource);
                }
            }
        });
        new _datasourceSelectorDialog2.default($dataSourceUnit, dialogOption);
    });
};

DataSourceSelectorWidget.prototype._createNewDataSourceUnit = function () {
    return $('<div class="bos-widget-column-unit-wrapper">' + '   <div class="bos-widget-column-unit bo-widget-column-unit">' + '       <div class="bos-widget-datasource-unit-label bo-widget-datasource-unit-label">Select DataSource</div>' + '   </div>' + '</div>');
};

DataSourceSelectorWidget.prototype._isChanged = function (changed) {
    if (this.options.id == null || this.options.id.value !== changed.value) return true;else return false;
};

DataSourceSelectorWidget.prototype._fillDataSourceControlUnit = function (label) {
    var $dataSourceUnit = this.$mainControl.find('.bo-widget-datasource-unit-label');

    if (this.options.id) {
        $dataSourceUnit.text(label || this.options.id.label || 'Select Data Source');
        $dataSourceUnit.attr('title', label || this.options.id.label);
    }
};

DataSourceSelectorWidget.prototype.renderProblem = function (problems) {
    var _this = this;

    this.$mainControl.find('.bo-widget-column-unit').removeClass('bos-border-color-red');
    this.$mainControl.find('.bo-widget-column-unit').removeClass('bos-border-color-blue');
    problems.forEach(function (problem) {
        _this.options.problemKeyList.forEach(function (problemKey) {
            if (problem.key === problemKey && problem.target === _this.options.label) {
                var color;
                if (problem.key === 'datasource-001' || problem.key === 'datasource-002' || problem.key === 'datasource-002-01') {
                    color = 'blue';
                } else {
                    color = 'red';
                }
                _this._renderProblem(color);
            }
        });
    });
};
DataSourceSelectorWidget.prototype._renderProblem = function (color) {
    this.$mainControl.find('.bo-widget-column-unit').addClass('bos-border-color-' + color);
};

exports.default = DataSourceSelectorWidget;

/***/ }),
/* 590 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _chartTypeSelectorDialog = __webpack_require__(283);

var _chartTypeSelectorDialog2 = _interopRequireDefault(_chartTypeSelectorDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function ChartTypeSelectorWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

ChartTypeSelectorWidget.prototype = Object.create(_baseWidget2.default.prototype);
ChartTypeSelectorWidget.prototype.constructor = ChartTypeSelectorWidget;

ChartTypeSelectorWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex bos-position-relative">' + '   <div class="bo-widget-header bos-widget-header"></div>' + '   <div class="bo-widget-contents bos-widget-contents bos-widget-chart-selector">' + '       <div class="bo-chart-type-icon bcharts-adonis-chart-selector-16 bos-text-overflow-hidden bos-widget-except-right-button-area list"></div>' + '       <div class="bos-widget-right-button-area border"/>' + '   </div>' + '   <div class="bo-widget-chart-popup-contents bos-widget-chart-popup-contents"></div>' + '</div>');

    $parent.append(this.$mainControl);

    this._createHeader();
    this.$chartSelector = this.$mainControl.find('.bo-widget-contents');
    this.render(this.options.value);

    if (this.options.chartTypeSelectable !== false) {
        this._createChartSelectEvent();
    } else {
        this.$chartSelector.addClass('bos-widget-chart-selector-readonly');
    }
};

ChartTypeSelectorWidget.prototype._createHeader = function () {
    var label = this.options.label;
    if (this.options.label) {
        this.$mainControl.find('.bo-widget-header').text(this.options.label);
        this.$mainControl.find('.bo-widget-header').css({ display: 'flex' });
    } else {
        this.$mainControl.find('.bo-widget-header').css({ display: 'none' });
    }
};

ChartTypeSelectorWidget.prototype._createChartSelectEvent = function () {
    var _this = this;
    this.$chartSelector.click(function () {

        var selectedChartType = $(this).find('.bo-chart-type-icon').attr('chart');

        var dialogOption = {
            value: selectedChartType,
            windowPosition: 'bottom-left',
            chartTypeList: _this._getChartTypeList(),
            close: function close(changedValue) {
                if (_this.options.value !== changedValue) {
                    _this.render(changedValue);
                    _this.options.onChanged(changedValue);
                    _this.options.value = changedValue;
                }
            }
        };

        _this.chartTypeDialog = new _chartTypeSelectorDialog2.default(_this.$mainControl, dialogOption);
    });
};

ChartTypeSelectorWidget.prototype._showChartSelectorPopup = function () {
    var $popup = this.$mainControl.find('.bo-widget-chart-popup-contents');
    $popup.css('display', 'flex');
};

ChartTypeSelectorWidget.prototype._getChartTypeList = function () {
    if (this.options.chartTypeList) {
        return this.options.chartTypeList;
    } else {
        return Brightics.Chart.getChartTypeList().sort();
    }
};

ChartTypeSelectorWidget.prototype._getItemIndexInSource = function (chart) {
    return {
        value: chart,
        label: Brightics.Chart.getChartAttr(chart).Label //TODO: chartTypeList일경우 case추가
    };
};

ChartTypeSelectorWidget.prototype.render = function (chart) {
    var $chartSelectorIcon = this.$chartSelector.find('.bo-chart-type-icon');
    if (chart) {
        var item = this._getItemIndexInSource(chart);
        $chartSelectorIcon.attr('chart', item.value);
        $chartSelectorIcon.attr('title', item.label);
        $chartSelectorIcon.text(item.label);
    }
};

ChartTypeSelectorWidget.prototype.close = function () {
    if (this.chartTypeDialog) {
        this.chartTypeDialog._closeHandler();
    }
};

exports.default = ChartTypeSelectorWidget;

/***/ }),
/* 591 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 30px,
 *      height:% or px default 25px,
 *      value: ''
 *      itemList: [{
 *              value: '',
 *              label: ''
 *          }
 *      ]
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function SwitchButtonWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

SwitchButtonWidget.prototype = Object.create(_baseWidget2.default.prototype);
SwitchButtonWidget.prototype.constructor = SwitchButtonWidget;

SwitchButtonWidget.prototype._createContents = function ($parent) {
    var _this = this;
    this.$mainControl = $('' + '<div class="bos-widget-button">' + '</div>');
    $parent.append(this.$mainControl);

    this.$mainControl.css({
        width: this.options.width ? this.options.width : '50px',
        height: this.options.height ? this.options.height : '30px'
    });
    if (this.options.margin) {
        this.$mainControl.css({
            margin: this.options.margin
        });
    }

    this._fillValue(this.options.value);

    this.$mainControl.click(function () {
        var nextItem = _this._getNextItemByValue($(this).attr('value'));
        _this._fillValue(nextItem.value);
        _this.options.onChanged(nextItem.value);
    });

    if (this.options.itemList.length <= 1) {
        this.$mainControl.addClass('bos-widget-button-disable');
    }

    this._configureSize();
};

SwitchButtonWidget.prototype.addCSSInMainControl = function (cssObj) {
    this.$mainControl.css(cssObj);
};

SwitchButtonWidget.prototype._fillValue = function (value) {
    var selectedItem = this._getItemByValue(value);
    this.$mainControl.attr('value', selectedItem.value);
    this.$mainControl.text(selectedItem.label);
};

SwitchButtonWidget.prototype._getItemByValue = function (value) {
    var selectedItem;
    this.options.itemList.forEach(function (item) {
        if (item.value === value) selectedItem = item;
    });
    return selectedItem;
};

SwitchButtonWidget.prototype._getNextItemByValue = function (value) {
    var currentIndex = this.options.itemList.findIndex(function (item) {
        return item.value === value;
    });

    if (currentIndex + 1 === this.options.itemList.length) {
        return this.options.itemList[0];
    } else {
        return this.options.itemList[currentIndex + 1];
    }
};

SwitchButtonWidget.prototype.toggleDisable = function (disabledValue) {
    this.$mainControl.toggleClass('bos-widget-button-disable', disabledValue);
};

SwitchButtonWidget.prototype._configureSize = function () {
    if (this.options.width) this.$mainControl.css('width', this.options.width);
    if (this.options.height) this.$mainControl.css('height', this.options.height);
};

exports.default = SwitchButtonWidget;

/***/ }),
/* 592 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _columnSelectorWidget = __webpack_require__(58);

var _columnSelectorWidget2 = _interopRequireDefault(_columnSelectorWidget);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OptionUtils = Brightics.Chart.Helper.OptionUtils; /**
                                                       * Created by sds on 2017-10-19.
                                                       */
/**
 * Created by mk90.kim on 2017-05-10.
 */


function ColumnFormatterWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
}

ColumnFormatterWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
ColumnFormatterWidget.prototype.constructor = ColumnFormatterWidget;

ColumnFormatterWidget.prototype._createContents = function ($parent) {
    var $styleComponent = $('' + '<div class="bos-display-flex bos-flex-direction-column">' + '   <div class="bo-component-style-contents bos-flex-direction-column bos-display-flex">' + '       <div class="bo-component-style-column-selector bos-display-flex bos-flex-direction-column"></div>' + '       <div class="bo-component-style-fmt bos-display-flex">' + '           <div class="bo-component-style-fmt-type bos-widget-column-separator bos-flex-1"></div>' + '           <div class="bo-component-style-fmt-detail bos-flex-1"></div>' + '      </div>' + '   </div>' + '</div>');

    $parent.append($styleComponent);
    this._createComponent($styleComponent.find('.bo-component-style-contents'));
};

ColumnFormatterWidget.prototype._createNewUnitWrapper = function () {
    return $('<div class="bos-widget-column-unit-wrapper bo-widget-column-unit-wrapper"></div>');
};

ColumnFormatterWidget.prototype._createComponent = function ($styleComponentContents) {
    this.columnSelector = WidgetFactory.createColumnSelectorWidget($styleComponentContents.find('.bo-component-style-column-selector'), {
        selected: this.options.value[0] ? [{ name: this.options.value[0] }] : [],
        label: 'Formatter',
        hideLabel: true,
        problemKeyList: ['axis-001', 'axis-002', 'axis-003', 'axis-004', 'axis-005'],
        getColumns: this.options.getColumns, //FIXME: 이미 선택한 칼럼은 filtering
        getAllColumns: this.options.getAllColumns,
        onChanged: this.options.onChanged[0]
    });

    var _this = this;
    // var fmtObj = {
    //     type: this.options.value[1],
    //     digit: this.options.value[2]
    // };
    var fmtObj = OptionUtils.parseFmtStrToObj(this.options.value[1]);

    this.formatTypeSelector = WidgetFactory.createFormatTypeSelectorWidget($styleComponentContents.find('.bo-component-style-fmt-type'), {
        value: fmtObj.type,
        onChanged: function onChanged(changedType) {
            fmtObj.type = changedType;
            _this.formatDetailSelector = _this._renderFmtDetailSelector($styleComponentContents.find('.bo-component-style-fmt-detail'), fmtObj);
            _this.options.onChanged[1](OptionUtils.parseFmtObjToStr(fmtObj));
        }
    });

    this.formatDetailSelector = this._renderFmtDetailSelector($styleComponentContents.find('.bo-component-style-fmt-detail'), fmtObj);

    this._widgetList.push(this.columnSelector);
    this._widgetList.push(this.formatTypeSelector);
    this._widgetList.push(this.formatDetailSelector);
};

ColumnFormatterWidget.prototype._renderFmtDetailSelector = function ($target, fmtObj) {
    if ($target.children()) {
        $target.children().remove();
    }

    var _this = this;
    if (fmtObj.type === 'custom') {
        return WidgetFactory.createInputWidget($target, {
            value: fmtObj.digit,
            onChanged: function onChanged(changedDetail) {
                fmtObj.digit = changedDetail;
                _this.options.onChanged[2](OptionUtils.parseFmtObjToStr(fmtObj));
            }
        });
    } else {
        return WidgetFactory.createFormatDigitSelectorWidget($target, {
            value: fmtObj.digit,
            onChanged: function onChanged(changedDetail) {
                fmtObj.digit = changedDetail;
                _this.options.onChanged[2](OptionUtils.parseFmtObjToStr(fmtObj));
            }
        });
    }
};

ColumnFormatterWidget.prototype.renderProblem = function (problems) {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        if (widget instanceof _columnSelectorWidget2.default) {
            widget.renderProblem(problems || _this.options.problemList, _this.options.$wrapper);
        } else {
            widget.renderProblem(problems || _this.options.problemList);
        }
    });
};

exports.default = ColumnFormatterWidget;

/***/ }),
/* 593 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2017-10-19.
 */

function FormatTypeSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
}

FormatTypeSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
FormatTypeSelectorWidget.prototype.constructor = FormatTypeSelectorWidget;

FormatTypeSelectorWidget.prototype._createListSource = function () {
    return _chartOptionConst2.default.FormatList;
};

FormatTypeSelectorWidget.prototype._getItemIndexInSource = function (item) {
    return this._createListSource().findIndex(function (source) {
        return source.value === item;
    });
};

exports.default = FormatTypeSelectorWidget;

/***/ }),
/* 594 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormatDigitSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by sds on 2017-10-23.
   */

FormatDigitSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
FormatDigitSelectorWidget.prototype.constructor = FormatDigitSelectorWidget;

FormatDigitSelectorWidget.prototype._init = function () {
    _baseSelectorWidget2.default.prototype._init.call(this);
    this.options.type = 'number';
};

FormatDigitSelectorWidget.prototype._createListSource = function () {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
};

exports.default = FormatDigitSelectorWidget;

/***/ }),
/* 595 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

var _itemSelectorDialog = __webpack_require__(285);

var _itemSelectorDialog2 = _interopRequireDefault(_itemSelectorDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label: ''
 *      source: []
 *      placeHolder: ''
 *      problemKeyList: ''
 *      value: ''   // default value
 *      onChanged: function(){]
 * }
 */
function ItemSelectorWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by ji_sung.park on 2018-02-06.
   */

ItemSelectorWidget.prototype = Object.create(Object.create(_baseWidget2.default.prototype));
ItemSelectorWidget.prototype.constructor = ItemSelectorWidget;

ItemSelectorWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bos-display-flex bos-position-relative">' + '   <div class="bo-widget-header bos-widget-header"></div>' + '   <div class="bo-widget-contents bos-widget-contents">' + '       <div class="bo-widget-item-selector bos-widget-item-selector">' + '           <div class="bo-item-selected bos-item-selected bos-text-overflow-hidden bos-widget-except-right-button-area list"></div>' + '           <div class="bos-widget-right-button-area border"/>' + '       </div>' + '   </div>' + '</div>');
    $parent.append(this.$mainControl);

    this._createHeader();
    this.$itemSelector = this.$mainControl.find('.bo-widget-contents');
    this.render(this.options.value);
    this._createItemSelectEvent();
};

ItemSelectorWidget.prototype._createHeader = function () {
    var label = this.options.label;
    if (label) {
        this.$mainControl.find('.bo-widget-header').text(label);
        this.$mainControl.find('.bo-widget-header').css({ display: 'flex' });
    } else {
        this.$mainControl.find('.bo-widget-header').css({ display: 'none' });
    }
};

ItemSelectorWidget.prototype.render = function (value) {
    var $itemSelector = this.$itemSelector.find('.bo-item-selected');
    if (value) {
        $itemSelector.removeClass('placeholder');
        var item = this._getItemIndexInSource(value);
        if (item && item.value) {
            $itemSelector.attr('item', item.value);
            $itemSelector.text(item.label);
        } else {
            $itemSelector.addClass('placeholder');
            $itemSelector.text(this.options.placeHolder);
        }
    } else {
        $itemSelector.addClass('placeholder');
        $itemSelector.text(this.options.placeHolder);
    }
};

ItemSelectorWidget.prototype._getItemIndexInSource = function (value) {
    return this._createListSource().find(function (source) {
        return source.value === value;
    });
};

ItemSelectorWidget.prototype._createListSource = function () {
    return this.options.source;
};

ItemSelectorWidget.prototype._createItemSelectEvent = function () {
    var _this = this;
    this.$itemSelector.click(function () {

        var selectedItem = $(this).find('.bo-item-selected').attr('item');

        var dialogOption = {
            width: _this.$mainControl.find('.bo-widget-contents').width() - 2 + 'px',
            value: selectedItem,
            windowPosition: 'bottom-left',
            itemList: _this._createListSource(),
            close: function close(changedValue) {
                if (_this.options.value !== changedValue) {
                    _this.render(changedValue);
                    _this.options.onChanged(changedValue);
                    _this.options.value = changedValue;
                }
            }
        };

        _this.itemSelectorDialog = new _itemSelectorDialog2.default(_this.$mainControl, dialogOption);
    });
};

ItemSelectorWidget.prototype.renderProblem = function (problems, $wrapper) {
    var _this = this;
    this.$mainControl.find('.bo-widget-item-selector').removeClass('bos-border-color-red');

    if ($.isEmptyObject(problems) || !$.isArray(problems)) {
        return;
    }
    problems.forEach(function (problem) {
        _this.options.problemKeyList.some(function (problemKey) {
            if (problem.key === problemKey && problem.target === _this.options.label) {
                _this._renderProblem(problem.index, $wrapper);
                return true;
            }
        });
    });
};

ItemSelectorWidget.prototype._renderProblem = function (index, $wrapper) {
    if (ChartOptionUtil.isEmpty(index)) {
        this.$mainControl.find('.bo-widget-item-selector').addClass('bos-border-color-red');
    } else {
        if ($wrapper) {
            $($wrapper.find('.bo-control-contents-component')[index]).find('.bo-widget-item-selector').addClass('bos-border-color-red');
        } else {
            this.$mainControl.find('.bo-widget-item-selector').addClass('bos-border-color-red');
        }
    }
};

ItemSelectorWidget.prototype.close = function () {
    if (this.itemSelectorDialog) {
        this.itemSelectorDialog._closeHandler();
    }
};

ItemSelectorWidget.prototype.destroy = function () {
    if (this.itemSelectorDialog) {
        this.itemSelectorDialog._destroy();
    }
};

exports.default = ItemSelectorWidget;

/***/ }),
/* 596 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      value: '',
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function OnOffSwitchWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by ji_sung.park on 2018-03-21.
   */

OnOffSwitchWidget.prototype = Object.create(_baseWidget2.default.prototype);
OnOffSwitchWidget.prototype.constructor = OnOffSwitchWidget;

OnOffSwitchWidget.prototype._createContents = function ($parent) {
    var _this = this;
    this.$mainControl = $('' + '<div class="bos-display-flex">' + '   <div class="bo-widget-header bos-widget-header"></div>' + '   <div class="bos-display-flex bos-flex-direction-column bos-widget-column-contents bo-widget-contents bos-widget-contents">' + '       <label class="bo-widget-onoff-switch bos-widget-onoff-switch">' + '           <input type="checkbox">' + '           <span class="bos-widget-onoff-switch-slider">' + '               <span class="bos-widget-onoff-switch-inner on">ON</span><span class="bos-widget-onoff-switch-inner off">OFF</span>' + '           </span>' + '       </label>' + '   </div>' + '</div>');
    $parent.append(this.$mainControl);

    this._createHeader();
    this.render(this.options.value);
    this._createToggleSwitchEvent();
};

OnOffSwitchWidget.prototype._createHeader = function () {
    var label = this.options.label;
    if (label) {
        this.$mainControl.find('.bo-widget-header').text(label);
        this.$mainControl.find('.bo-widget-header').css({ display: 'flex' });
    } else {
        this.$mainControl.find('.bo-widget-header').css({ display: 'none' });
    }
};

OnOffSwitchWidget.prototype.render = function (value) {
    var $check = this.$mainControl.find('input[type="checkbox"]');
    $check.attr('checked', value);
};

OnOffSwitchWidget.prototype._createToggleSwitchEvent = function () {
    var _this = this;
    var $check = this.$mainControl.find('input[type="checkbox"]');
    $check.on('change', function () {
        var changedValue = $check.is(':checked');
        _this.options.onChanged(changedValue);
        _this.options.value = changedValue;
    });
};

exports.default = OnOffSwitchWidget;

/***/ }),
/* 597 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseCheckButtonGroupWidget = __webpack_require__(281);

var _baseCheckButtonGroupWidget2 = _interopRequireDefault(_baseCheckButtonGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 30px,
 *      value: ''
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function AxisToggleButtonWidget(parentId, options) {
    _baseCheckButtonGroupWidget2.default.call(this, parentId, options);
}

AxisToggleButtonWidget.prototype = Object.create(_baseCheckButtonGroupWidget2.default.prototype);
AxisToggleButtonWidget.prototype.constructor = AxisToggleButtonWidget;

AxisToggleButtonWidget.prototype._init = function () {
    _baseCheckButtonGroupWidget2.default.prototype._init.call(this);
    this._buttonList = [];
    this._setCheckBtnList();
    this.$buttonObjList = [];
};

AxisToggleButtonWidget.prototype._setCheckBtnList = function () {
    this._buttonList = [{
        label: "X-Axis",
        value: 'xaxis'
    }, {
        label: "Y-Axis",
        value: 'yaxis'
    }];
};

AxisToggleButtonWidget.prototype._createContents = function ($parent) {
    this._isRendered = false;
    this.$checkButtonHeaderControl = $('' + '<div class="bos-widget-header"/>' + this.options.header + '</div>' + '');
    this.$checkButtonGroupControl = $('' + '<div class="bos-display-flex bos-widget-button-group-container"/>' + '');
    this._buttonList = typeof this.options._buttonList == 'undefined' ? this._buttonList : this.options._buttonList;
    $parent.append(this.$checkButtonHeaderControl);
    $parent.append(this.$checkButtonGroupControl);

    this._createChkBtnGrpUnits();
    this._renderButtonSelected(this.options.value);
    this._setPreValue(this.options.value);
    this._isRendered = true;
};

AxisToggleButtonWidget.prototype.renderWarning = function (warnings) {
    var _this = this;
    if (!this.options.warningKeyList) return;

    var _conceal = function _conceal(axis) {
        _this.$checkButtonGroupControl.find('input#' + axis).css({ display: 'none' });
    };

    var _show = function _show(axis) {
        _this.$checkButtonGroupControl.find('input#' + axis).css({ display: 'block' });
    };

    var chkAxis = ['xaxis', 'yaxis'];
    for (var i = 0; i < chkAxis.length; i++) {
        if (warnings && warnings.length > 0) {
            warnings.forEach(function (problem) {
                _this.options.warningKeyList.forEach(function (problemKey) {
                    if (problem.key === problemKey && problem.target === chkAxis[i]) {
                        _conceal(chkAxis[i]);
                    }
                });
            });
        } else {
            _show(chkAxis[i]);
        }
    }
};

exports.default = AxisToggleButtonWidget;

/***/ }),
/* 598 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseComplexWidget = __webpack_require__(36);

var _baseComplexWidget2 = _interopRequireDefault(_baseComplexWidget);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value:
 *          {
 *              left: 'px',
 *              right: 'px',
 *              top: 'px',
 *              bottom: 'px',
 *          }, (all value is px)
 *      position: ['left', 'top', 'right', 'bottom'],
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90 on 2017-05-27.
 */

function CenterPositionWidget(parentId, options) {
    _baseComplexWidget2.default.call(this, parentId, options);
    this.renderProblem();
}

CenterPositionWidget.prototype = Object.create(_baseComplexWidget2.default.prototype);
CenterPositionWidget.prototype.constructor = CenterPositionWidget;

CenterPositionWidget.prototype._init = function () {
    _baseComplexWidget2.default.prototype._init.call(this);
    this.baseIconAppended = false;
    this.inputValue = {};
    this.selectedUnit = {};
    if (typeof this.options.getValue === 'function') {
        for (var i in this.options.value) {
            this.options.value[i] = this.options.getValue(this.options.value[i]);
        }
    }
};

CenterPositionWidget.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bo-component-frame-contents">' + '   <div class="bo-component-frame-center bos-display-flex">' + '   </div>' + '</div>');

    $parent.append(this.$mainControl);

    var _this = this;
    this.options.position.forEach(function (position) {
        _this._createPositionContent(position);
    });
};

CenterPositionWidget.prototype._createPositionContent = function (position) {
    var $targetArea, positionInputControl, defaultValue, tempDom;

    tempDom = $('<div class="bo-component-frame-center-' + position + ' bos-flex-1 bos-row-multi-div"></div>');
    this.$mainControl.find('.bo-component-frame-center').append(tempDom);
    this._createPositionInputContent(tempDom, position);
};

CenterPositionWidget.prototype._createPositionInputContent = function ($parent, position) {
    var value = this.options.value && this.options.value[position] ? this.options.value[position] + '' : '';

    var _this = this;
    this.inputValue[position] = value;
    var numberInput = WidgetFactory.createNumberInputWidget($parent, {
        labelPosition: 'row',
        label: position.toLocaleString(),
        labelWidth: '55px',
        width: '55px',
        value: value,
        problemKeyList: this.options.problemKeyList,
        onChanged: function onChanged(value) {
            _this.inputValue[position] = value;
            _this.options.onChanged[position](value || value === 0 ? value : '');
        }
    });

    this._widgetList.push(numberInput);
};

CenterPositionWidget.prototype.renderProblem = function (problems) {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(problems);
    });
};

exports.default = CenterPositionWidget;

/***/ }),
/* 599 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseRadioButtonGroupWidget = __webpack_require__(59);

var _baseRadioButtonGroupWidget2 = _interopRequireDefault(_baseRadioButtonGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ToolTipTriggerRadioButtonWidget(parentId, options) {
    _baseRadioButtonGroupWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

ToolTipTriggerRadioButtonWidget.prototype = Object.create(_baseRadioButtonGroupWidget2.default.prototype);
ToolTipTriggerRadioButtonWidget.prototype.constructor = ToolTipTriggerRadioButtonWidget;

ToolTipTriggerRadioButtonWidget.prototype._setRadioButtonList = function () {
    this._buttonList = [{
        label: 'Axis',
        value: 'axis'
    }, {
        label: 'Item',
        value: 'item'
    }];
};

exports.default = ToolTipTriggerRadioButtonWidget;

/***/ }),
/* 600 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2017-10-19.
 */

function EdgeTypeSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
}

EdgeTypeSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
EdgeTypeSelectorWidget.prototype.constructor = EdgeTypeSelectorWidget;

EdgeTypeSelectorWidget.prototype._createListSource = function () {
    return _chartOptionConst2.default.edgeStyle;
};

EdgeTypeSelectorWidget.prototype._getItemIndexInSource = function (item) {
    return this._createListSource().findIndex(function (source) {
        return source.value === item;
    });
};

exports.default = EdgeTypeSelectorWidget;

/***/ }),
/* 601 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _customAlignRadioButtonWidget = __webpack_require__(286);

var _customAlignRadioButtonWidget2 = _interopRequireDefault(_customAlignRadioButtonWidget);

var _horizontalAlignRadioButtonWidget = __webpack_require__(279);

var _horizontalAlignRadioButtonWidget2 = _interopRequireDefault(_horizontalAlignRadioButtonWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function CustomHorizontalAlignRadioButtonWidget(parentId, options) {
    _customAlignRadioButtonWidget2.default.call(this, parentId, options);
}

CustomHorizontalAlignRadioButtonWidget.prototype = Object.create(_customAlignRadioButtonWidget2.default.prototype);
CustomHorizontalAlignRadioButtonWidget.prototype.constructor = _customAlignRadioButtonWidget2.default;

CustomHorizontalAlignRadioButtonWidget.prototype._createAlignWidget = function ($el, options) {
    return new _horizontalAlignRadioButtonWidget2.default($el, options);
};

CustomHorizontalAlignRadioButtonWidget.prototype._getLabel = function () {
    return 'Horizontal Margin';
};

exports.default = CustomHorizontalAlignRadioButtonWidget;

/***/ }),
/* 602 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _centerPositionWidget = __webpack_require__(121);

var _centerPositionWidget2 = _interopRequireDefault(_centerPositionWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      width: % or px default 100%,
 *      height:% or px default 100%,
 *      value:
 *          {
 *              left: 'px',
 *              right: 'px',
 *              top: 'px',
 *              bottom: 'px',
 *          }, (all value is px)
 *      position: ['left', 'top', 'right', 'bottom'],
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
/**
 * Created by mk90 on 2017-05-27.
 */

function CustomAlignInputWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
}

CustomAlignInputWidget.prototype = Object.create(_baseWidget2.default.prototype);
CustomAlignInputWidget.prototype.constructor = CustomAlignInputWidget;

CustomAlignInputWidget.prototype._init = function () {
    _baseWidget2.default.prototype._init.call(this);
    this.baseIconAppended = false;
    this.inputValue = {};
    this.selectedUnit = {};
    if (typeof this.options.getValue === 'function') {
        for (var i in this.options.value) {
            this.options.value[i] = this.options.getValue(this.options.value[i]);
        }
    }
};

CustomAlignInputWidget.prototype._getLabel = function () {
    return null;
};

CustomAlignInputWidget.prototype._createContents = function ($parent) {
    var _this = this;

    this.$control = $('\n    <div class="bos-display-flex bcharts-adonis-flex-1-1-auto bo-custom-align-input-widget">\n        <div\n            style="height: 30px; width: 80px;"\n            class="bo-custom-align-input__toggle-widget">' + this.options.label + '</div>\n        <div class="bo-custom-align-input__position-input-widget bcharts-adonis-flex-1-1-auto"/>\n    </div>\n    ');
    $parent.append(this.$control);

    var $input = this.$control.find('.bo-custom-align-input__position-input-widget');

    this.positionInput = new _centerPositionWidget2.default($input, {
        height: '30px',
        width: '60px',
        value: {
            '': this.options.value.value
        },
        position: [''],
        onChanged: {
            '': function _(value) {
                _this.options.value.value = value;
                _this._triggerChangeEvent(_this.options.value);
            }
        }
    });
};

CustomAlignInputWidget.prototype.toggleDisable = function (disabledVal) {
    this.positionInput.toggleDisable(disabledVal);
};

CustomAlignInputWidget.prototype._triggerChangeEvent = function (value) {
    this.options.onChanged(value);
};

CustomAlignInputWidget.prototype.unselect = function () {
    this._triggerChangeEvent(this.options.value);
};

CustomAlignInputWidget.prototype.render = function (value) {
    // this.toggleButton.render(value && value.custom ? 'custom' : null);
};

CustomAlignInputWidget.prototype.toggleAlignMode = function (value) {
    this.render(this.options.value);
};

exports.default = CustomAlignInputWidget;

/***/ }),
/* 603 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _customAlignRadioButtonWidget = __webpack_require__(286);

var _customAlignRadioButtonWidget2 = _interopRequireDefault(_customAlignRadioButtonWidget);

var _verticalAlignRadioButtonWidget = __webpack_require__(280);

var _verticalAlignRadioButtonWidget2 = _interopRequireDefault(_verticalAlignRadioButtonWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function CustomVerticalAlignRadioButtonWidget(parentId, options) {
    _customAlignRadioButtonWidget2.default.call(this, parentId, options);
}

CustomVerticalAlignRadioButtonWidget.prototype = Object.create(_customAlignRadioButtonWidget2.default.prototype);
CustomVerticalAlignRadioButtonWidget.prototype.constructor = CustomVerticalAlignRadioButtonWidget;

CustomVerticalAlignRadioButtonWidget.prototype._createAlignWidget = function ($el, options) {
    return new _verticalAlignRadioButtonWidget2.default($el, options);
};

CustomVerticalAlignRadioButtonWidget.prototype._getLabel = function () {
    return 'Verticial Margin';
};

exports.default = CustomVerticalAlignRadioButtonWidget;

/***/ }),
/* 604 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseSelectorWidget = __webpack_require__(33);

var _baseSelectorWidget2 = _interopRequireDefault(_baseSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MarkerShowSelectorWidget(parentId, options) {
    _baseSelectorWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

MarkerShowSelectorWidget.prototype = Object.create(_baseSelectorWidget2.default.prototype);
MarkerShowSelectorWidget.prototype.constructor = MarkerShowSelectorWidget;

MarkerShowSelectorWidget.prototype._createListSource = function () {
    return ['auto', 'true', 'false'];
};

exports.default = MarkerShowSelectorWidget;

/***/ }),
/* 605 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseWidget = __webpack_require__(23);

var _baseWidget2 = _interopRequireDefault(_baseWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * options = {
 *      label : String ( default: Value )
 *      labelPosition : row or column
 *      inputStyle : line or box,
 *      value: ''   // default value
 *      onChanged: function(){]
 * }
 * @param parentId
 * @param options
 * @constructor
 */
function LabelWidget(parentId, options) {
    _baseWidget2.default.call(this, parentId, options);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

LabelWidget.prototype = Object.create(_baseWidget2.default.prototype);
LabelWidget.prototype.constructor = LabelWidget;

LabelWidget.prototype._createContents = function ($parent) {
    var $label = $('<div class="bos-widget-header bo-widget-header">' + this.options.value + '</div>');
    $parent.append($label);
    if (this.options.helper) {
        var _this = this;
        var $iconDiv = $('<div class="bos-icon-help"></div>');
        $iconDiv.hover(function () {
            _this.helperDialog = new _this.options.helper($iconDiv, {
                windowPosition: 'bottom-left',
                switchPosition: 'top-left'
            });
        }, function () {
            _this.helperDialog._closeHandler();
        });
        $label.append($iconDiv);
    }
    $label.css('width', '100%');
    $label.css('height', '100%');
};

exports.default = LabelWidget;

/***/ }),
/* 606 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

var _columnSelectorWidget = __webpack_require__(58);

var _columnSelectorWidget2 = _interopRequireDefault(_columnSelectorWidget);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ComplexColumnSelectControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

ComplexColumnSelectControl.prototype = Object.create(_baseControl2.default.prototype);
ComplexColumnSelectControl.prototype.constructor = ComplexColumnSelectControl;

ComplexColumnSelectControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);
    var selectorSettings = {};
    selectorSettings.columnSelector = this.options.setting.columnSelector;
    selectorSettings.datasourceSelector = this.options.setting.datasourceSelector;
    selectorSettings.complexColumnSelector = this.options.setting.complexColumnSelector;
    this.createComponentContents(selectorSettings);
};

ComplexColumnSelectControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this);

    for (var chartIdx = 0; chartIdx < contentsOption.complexColumnSelector.length; chartIdx++) {

        this._createComplexChartTypeSelectorContent(this.$controlMain, contentsOption.complexColumnSelector[chartIdx]);
    }
};

ComplexColumnSelectControl.prototype._createComplexChartTypeSelectorContent = function ($parent, options) {
    var _this = this;
    var chartTypeSelectorWidget = WidgetFactory.createChartTypeSelectorWidget($parent, {
        label: 'Chart Type',
        value: options.chartOption.chart.type,
        chartTypeList: ['scatter', 'line', 'column'],
        chartTypeSelectable: true,
        onChanged: function onChanged(inputVal) {
            options.chartOption.chart.type = inputVal;
            var newOptions = _this.options.chartOptionAPI.setChartOptions(_this.options.chartOption);
            _this.options.onChanged('onChartTypeChanged', newOptions);
        }
    });
    this._widgetList.push(chartTypeSelectorWidget);
};

ComplexColumnSelectControl.prototype._getSelectedColumns = function (columnSettings) {
    if (columnSettings.ref.axisType && columnSettings.axisTypeList) {
        return [_chartOptionConst2.default.EXTRA_AXIS_TYPE_LIST.find(function (column) {
            return column.value == columnSettings.ref.axisType;
        })];
    } else {
        return columnSettings.ref.selected;
    }
};

ComplexColumnSelectControl.prototype._createColumnSelectorContent = function (columnSettings, sourceIndex) {
    var _this = this;
    var widgetOptions = {
        selected: this._getSelectedColumns(columnSettings), //[{name: 'SepalLength', aggregation: 'none' }],
        multiple: columnSettings.multiple ? columnSettings.multiple : false,
        multipleMaxCnt: columnSettings.multipleMaxCnt,
        aggregationEnabled: columnSettings.aggregationEnabled ? columnSettings.aggregationEnabled : false,
        aggregationMap: columnSettings.aggregationMap ? columnSettings.aggregationMap : {},
        label: columnSettings.label,
        getColumns: this._getColumnList.bind(this, columnSettings, sourceIndex),
        getAllColumns: this._getAllColumnList.bind(this, sourceIndex),
        problemKeyList: ['axis-001', 'axis-002', 'axis-003', 'axis-004', 'axis-005'],
        chartOption: this.options.chartOption,
        onChanged: function onChanged(changedColumnInfo) {
            if (changedColumnInfo[0] && changedColumnInfo[0].type == _chartOptionConst2.default.EXTRA_AXIS_TYPE) {
                columnSettings.ref.axisType = _chartOptionConst2.default.EXTRA_AXIS_TYPE_LIST.find(function (column) {
                    return column.value == changedColumnInfo[0].value;
                }).value;
                columnSettings.ref.selected = [];
            } else {
                columnSettings.ref.selected = changedColumnInfo;
                columnSettings.ref.axisType = null;
            }

            _this.setExpanderPreview.call(_this);
            var callbackParam;
            if (typeof columnSettings.getColumnChangedOption === 'function') callbackParam = columnSettings.getColumnChangedOption(changedColumnInfo);else {
                callbackParam = {};
                callbackParam[columnSettings.key] = _this.options.chartOption[columnSettings.key];
                callbackParam[columnSettings.key][sourceIndex] = columnSettings.ref;
            }
            _this.options.onChanged('onChartOptionChanged', callbackParam);

            if (columnSettings.axisTypeList) {
                _this.options.chartOptionAPI.reloadColumnSelectorSetting();
                _this._createContents(_this.$parent);
                _this.renderProblem();
            }
        }
    };
    var columnSelectorWidget = WidgetFactory.createColumnSelectorWidget(this.$controlContents, widgetOptions);
    this._widgetList.push(columnSelectorWidget);
};

ComplexColumnSelectControl.prototype._setColumnList = function (chartIdx, newColumnList) {
    if (this.options.chartOption.source.dataType === 'lazy') {
        this.options.chartOption.source.lazyData[chartIdx].columns = newColumnList;
    } else {
        this.options.chartOption.source.localData[chartIdx].columns = newColumnList;
    }

    for (var i in this._widgetList) {
        var widget = this._widgetList[i];
        if (widget instanceof _columnSelectorWidget2.default) {
            widget._fillColumnControlUnit();
        }
    }
};

//column list filtered by type
ComplexColumnSelectControl.prototype._getColumnList = function (columnSettings, sourceIndex) {
    var columnList = this._getAllColumnList(sourceIndex);

    if (columnList && columnSettings.columnType) {
        columnList = columnList.filter(function (column) {
            return columnSettings.columnType.indexOf(column.type) > -1;
        });
    }
    // if (columnSettings.axisTypeList && $.isArray(columnSettings.axisTypeList)) {
    //     columnList = $.merge(ChartOptionConst.EXTRA_AXIS_TYPE_LIST.filter(function (defAxisType) {
    //         return $.inArray(defAxisType.value, columnSettings.axisTypeList) > -1;
    //     }), columnList);
    // }

    return columnList;
};

ComplexColumnSelectControl.prototype._getAllColumnList = function (sourceIndex) {
    return ChartOptionUtil.getAllColumnList(this.options.chartOption, sourceIndex);
};

ComplexColumnSelectControl.prototype.renderProblem = function (problems) {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(problems || _this.options.problemList);
    });
};

exports.default = ComplexColumnSelectControl;

/***/ }),
/* 607 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormatControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
} /**
   * Created by mk90.kim on 2017-10-20
   */

FormatControl.prototype = Object.create(_baseControl2.default.prototype);
FormatControl.prototype.constructor = FormatControl;

FormatControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.formatter = this.options.setting.formatter;
};

FormatControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);
    var _this = this;
    var headerOption = {
        addBtn: {
            clickfunc: function clickfunc() {
                _this._createFormatterComponent({}, 0, _this.formatter[0].ref);
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents(this.formatter);
};

FormatControl.prototype.createComponentContents = function (setting) {
    _baseControl2.default.prototype.createComponentContents.call(this);
    this.$controlContents.removeClass('bos-control-contents');

    var _this = this;
    if (!setting) {
        return;
    }
    //FIXME: multidatasource일경우 구현안됨
    var dataSrcIdx = 0;
    // for (var chartIdx = 0; chartIdx < setting.length; chartIdx++) {
    setting[dataSrcIdx].ref.forEach(function (fmtData, idx, refArray) {
        _this._createFormatterComponent(fmtData, dataSrcIdx, refArray);
    });
    // }
};

FormatControl.prototype._createFormatterComponent = function (formatData, sourceIndex, refArray) {
    var $component = $('<div class = "bo-control-contents-component bos-control-contents bos-deletable-component"></div>');
    this.$controlContents.append($component);

    if (!(formatData && formatData.column && formatData.format)) {
        formatData = {
            column: null,
            format: '0.0'
        };
        refArray[$component.index()] = formatData;
    }

    this._createDeleteButton($component, refArray);
    this._createValueComponent($component, formatData, sourceIndex, refArray);
};

FormatControl.prototype._createDeleteButton = function ($component, refArray) {
    var $deleteButton = $('<div class="bos-delete-btn"></div>');
    $component.append($deleteButton);

    var _this = this;
    $deleteButton.click(function () {
        refArray.splice($component.index(), 1);
        _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        $component.remove();
    });
};
FormatControl.prototype._createValueComponent = function ($component, formatData, sourceIndex, refArray) {
    var _this = this;
    var fmtWidget = WidgetFactory.createColumnFormatterWidget($component, {
        $wrapper: this.$controlContents.removeClass('bo-control-contents'),
        problemList: this.options.problemList,
        getColumns: this._getFilteredColumnList.bind(this, sourceIndex, refArray), //FIXME: 이미 선택한 칼럼은 filtering
        getAllColumns: ChartOptionUtil.getAllColumnList.bind(this, this.options.chartOption, sourceIndex),
        value: [formatData.column, formatData.format],
        onChanged: [function (changedColumn) {
            refArray[$component.index()].column = changedColumn[0] ? changedColumn[0].value : null;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (changedFmtStr) {
            refArray[$component.index()].format = changedFmtStr;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (changedFmtStr) {
            refArray[$component.index()].format = changedFmtStr;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }]
    });
    this._widgetList.push(fmtWidget);
};

FormatControl.prototype._getFilteredColumnList = function (sourceIndex, refArray) {
    var columnList = ChartOptionUtil.getAllColumnList(this.options.chartOption, sourceIndex);
    var selectedColumnList = refArray.map(function (selectedCol) {
        return selectedCol.column;
    });
    return columnList.filter(function (columnInfo) {
        return columnInfo.type == 'number' && $.inArray(columnInfo.name, selectedColumnList) < 0;
    });
};

FormatControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList, _this.$controlContents.removeClass('bo-control-contents'));
    });
};

exports.default = FormatControl;

/***/ }),
/* 608 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _formatHelperDialog = __webpack_require__(75);

var _formatHelperDialog2 = _interopRequireDefault(_formatHelperDialog);

var _chartOptionUtil = __webpack_require__(30);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function FormatCardControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

FormatCardControl.prototype = Object.create(_baseControl2.default.prototype);
FormatCardControl.prototype.constructor = FormatCardControl;

FormatCardControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.numberLength = this.options.setting.numberLength[0];
    this.numberFormart = this.options.setting.numberFormat;
};

FormatCardControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

FormatCardControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createNumberFormatComponent(this.$controlContents);
};

FormatCardControl.prototype._createNumberFormatComponent = function ($component) {
    var $numberFormatComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header"></div>' + '   <div class="bo-component-number-format-length bos-display-flex">' + '       <div class="bo-component-number-format-length-header bos-flex-2"></div>' + '       <div class="bo-component-number-format-length-contents bos-flex-3"></div>' + '   </div>' + '   <div class="bo-component-number-format-value bos-display-flex">' + '       <div class="bo-component-number-format-value-header bos-flex-2"></div>' + '       <div class="bo-component-number-format-value-contents bos-flex-3"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($numberFormatComponent);

    var _this = this;

    var $numberFormatLengthComponent = $numberFormatComponent.find('.bo-component-number-format-length');
    var numberFormatLengthHeader = WidgetFactory.createLabelWidget($numberFormatLengthComponent.find('.bo-component-number-format-length-header'), {
        value: 'Decimal places'
    });
    var numberFormatLengthSelector = WidgetFactory.createFormatDigitSelectorWidget($numberFormatComponent.find('.bo-component-number-format-length-contents'), {
        width: '100%',
        height: '25px',
        value: _this.numberLength.ref.selected,
        disabled: !(0, _chartOptionUtil.isEmpty)(_this.numberFormart.use) && _this.numberFormart.use !== '',
        onChanged: function onChanged(changedDetail) {
            _this.numberLength.ref.selected = changedDetail;
            _this.options.onChanged('onChartOptionChanged', _this.numberLength.getLengthChangedOption(_this.numberLength.ref.selected));
        }
    });
    this._widgetList.push(numberFormatLengthHeader);
    this._widgetList.push(numberFormatLengthSelector);

    var $numberFormatValueComponent = $numberFormatComponent.find('.bo-component-number-format-value');
    var numberFormatValueHeader = WidgetFactory.createLabelWidget($numberFormatValueComponent.find('.bo-component-number-format-value-header'), {
        value: 'Formatter',
        helper: _formatHelperDialog2.default
    });
    var numberFormatValueSelector = WidgetFactory.createInputWidget($numberFormatValueComponent.find('.bo-component-number-format-value-contents'), {
        value: _this.numberFormart.use,
        placeHolder: '{value}',
        onChanged: function onChanged(inputVal) {
            if (inputVal === null || inputVal === undefined || inputVal === '') {
                numberFormatLengthSelector.toggleDisable(false);
            } else {
                numberFormatLengthSelector.toggleDisable(true);
            }
            _this.numberFormart.use = inputVal;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(numberFormatValueHeader);
    this._widgetList.push(numberFormatValueSelector);
};

FormatCardControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = FormatCardControl;

/***/ }),
/* 609 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function AxisViewRangeControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

AxisViewRangeControl.prototype = Object.create(_baseControl2.default.prototype);
AxisViewRangeControl.prototype.constructor = AxisViewRangeControl;

AxisViewRangeControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.xAxisOption = this.options.chartOption.xAxis;
    this.yAxisOption = this.options.chartOption.yAxis;
};

AxisViewRangeControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var headerOption = {
        label: 'View Range'
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents($parent);
};

AxisViewRangeControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    var multiLabelWidget = WidgetFactory.createMultiLabelWidget(this.$controlContents, {
        label: 'Axis',
        numOfComponent: 2,
        value: ['Min', 'Max']
    });

    this._widgetList.push(multiLabelWidget);

    var _this = this;
    var xAxisValueInput = WidgetFactory.createMultiInputWidget(this.$controlContents, {
        label: 'X Axis',
        labelPosition: 'row',
        inputStyle: 'box',
        numOfComponent: 2,
        value: [this.xAxisOption[0].min, this.xAxisOption[0].max],
        inputType: ['string', 'string'],
        problemKeyList: ['value-001'],
        onChanged: [function (inputVal) {
            _this.xAxisOption[0].min = inputVal || inputVal === 0 ? inputVal : null;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption });
        }, function (inputVal) {
            _this.xAxisOption[0].max = inputVal || inputVal === 0 ? inputVal : null;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption });
        }]
    });
    this._widgetList.push(xAxisValueInput);

    var yAxisValueInput = WidgetFactory.createMultiInputWidget(this.$controlContents, {
        label: 'Y Axis',
        labelPosition: 'row',
        inputStyle: 'box',
        numOfComponent: 2,
        value: [this.yAxisOption[0].min, this.yAxisOption[0].max],
        inputType: ['string', 'string'],
        problemKeyList: ['value-001'],
        onChanged: [function (inputVal) {
            _this.yAxisOption[0].min = inputVal || inputVal === 0 ? inputVal : null;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { yAxis: _this.yAxisOption });
        }, function (inputVal) {
            _this.yAxisOption[0].max = inputVal || inputVal === 0 ? inputVal : null;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { yAxis: _this.yAxisOption });
        }]
    });
    this._widgetList.push(yAxisValueInput);
};

AxisViewRangeControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = AxisViewRangeControl;

/***/ }),
/* 610 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axisTitleControl = __webpack_require__(287);

var _axisTitleControl2 = _interopRequireDefault(_axisTitleControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function AxisTitleSeparatedControl(parentId, options, headerKey) {
    _axisTitleControl2.default.call(this, parentId, options, headerKey);
}

AxisTitleSeparatedControl.prototype = Object.create(_axisTitleControl2.default.prototype);
AxisTitleSeparatedControl.prototype.constructor = AxisTitleSeparatedControl;

AxisTitleSeparatedControl.prototype._createStyleComponent = function () {
    var _this = this;

    this.xAxisFontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        header: 'X Axis Font Style',
        value: [this.xAxisOption[0].title.textStyle.fontFamily, this.xAxisOption[0].title.textStyle.fontSize, this.xAxisOption[0].title.textStyle.color, [this.xAxisOption[0].title.textStyle.fontWeight, this.xAxisOption[0].title.textStyle.fontStyle, this.xAxisOption[0].title.textStyle.textDecoration]],
        onChanged: [function (inputVal) {
            _this.xAxisOption[0].title.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].title.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].title.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }, function (selectedVals) {
            _this.xAxisOption[0].title.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.xAxisOption[0].title.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.xAxisOption[0].title.textStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }]
    });

    this._widgetList.push(this.xAxisFontStyle);

    this.yAxisFontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        header: 'Y Axis Font Style',
        value: [this.yAxisOption[0].title.textStyle.fontFamily, this.yAxisOption[0].title.textStyle.fontSize, this.yAxisOption[0].title.textStyle.color, [this.yAxisOption[0].title.textStyle.fontWeight, this.yAxisOption[0].title.textStyle.fontStyle, this.yAxisOption[0].title.textStyle.textDecoration]],
        onChanged: [function (inputVal) {
            _this.yAxisOption[0].title.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.yAxisOption[0].title.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.yAxisOption[0].title.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }, function (selectedVals) {
            _this.yAxisOption[0].title.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.yAxisOption[0].title.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.yAxisOption[0].title.textStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }]
    });
    this._widgetList.push(this.yAxisFontStyle);
};

exports.default = AxisTitleSeparatedControl;

/***/ }),
/* 611 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axisLabelControl = __webpack_require__(288);

var _axisLabelControl2 = _interopRequireDefault(_axisLabelControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function AxisLabelSeparatedControl(parentId, options, headerKey) {
    _axisLabelControl2.default.call(this, parentId, options, headerKey);
}

AxisLabelSeparatedControl.prototype = Object.create(_axisLabelControl2.default.prototype);
AxisLabelSeparatedControl.prototype.constructor = AxisLabelSeparatedControl;

AxisLabelSeparatedControl.prototype._createFontStyleComponent = function () {
    var _this = this;
    this.xAxisfontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        header: 'X Axis Font Style',
        fontStyleBtnList: ['bold', 'italic'],
        value: [this.xAxisOption[0].axisLabel.textStyle.fontFamily, this.xAxisOption[0].axisLabel.textStyle.fontSize, this.xAxisOption[0].axisLabel.textStyle.color, [this.xAxisOption[0].axisLabel.textStyle.fontWeight, this.xAxisOption[0].axisLabel.textStyle.fontStyle]],
        onChanged: [function (inputVal) {
            _this.xAxisOption[0].axisLabel.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].axisLabel.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }, function (inputVal) {
            _this.xAxisOption[0].axisLabel.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }, function (selectedVals) {
            _this.xAxisOption[0].axisLabel.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.xAxisOption[0].axisLabel.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.options.onChanged('onChartOptionChanged', {
                xAxis: _this.xAxisOption
            });
        }]
    });

    this._widgetList.push(this.xAxisfontStyle);

    this.yAxisfontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        header: 'Y Axis Font Style',
        fontStyleBtnList: ['bold', 'italic'],
        value: [this.yAxisOption[0].axisLabel.textStyle.fontFamily, this.yAxisOption[0].axisLabel.textStyle.fontSize, this.yAxisOption[0].axisLabel.textStyle.color, [this.yAxisOption[0].axisLabel.textStyle.fontWeight, this.yAxisOption[0].axisLabel.textStyle.fontStyle]],
        onChanged: [function (inputVal) {
            _this.yAxisOption[0].axisLabel.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.yAxisOption[0].axisLabel.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }, function (inputVal) {
            _this.yAxisOption[0].axisLabel.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }, function (selectedVals) {
            _this.yAxisOption[0].axisLabel.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.yAxisOption[0].axisLabel.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.options.onChanged('onChartOptionChanged', {
                yAxis: _this.yAxisOption
            });
        }]
    });

    this._widgetList.push(this.yAxisfontStyle);
};

exports.default = AxisLabelSeparatedControl;

/***/ }),
/* 612 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function LegendControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

LegendControl.prototype = Object.create(_baseControl2.default.prototype);
LegendControl.prototype.constructor = LegendControl;

LegendControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.legendOption = this.options.chartOption.legend;
};

LegendControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        showBtn: {
            defaultVal: this.legendOption.show,
            clickfunc: function clickfunc(event) {
                var checkedVal = event.args.checked;
                _this.toggleDisableComponent(checkedVal);
                _this.legendOption.show = checkedVal;
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

LegendControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createAlignComponent();
    this._createDirectionComponent();
    this._createFontStyleComponent();
};

LegendControl.prototype._createAlignComponent = function () {
    var _this = this;

    var $alignComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Align</div>' + '   <div class="bo-component-legend-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($alignComponent);
    var $alignComponentContents = $alignComponent.find('.bo-component-legend-contents');

    //POLICY: left가 right보다 우선순위가 높다.
    //POLICY: top이 bottom보다 우선순위가 높다.
    var horizontalAlignValue = function () {
        if (_this.legendOption.left == 0 || _this.legendOption.left === '0px') {
            return 'left';
        } else if (_this.legendOption.left === '50%') {
            return 'center';
        } else if (_this.legendOption.right == 0 || _this.legendOption.right === '0px') {
            return 'right';
        } else {
            _this.legendOption.left = 0;
            return 'center';
        }
    }();
    var verticalAlignValue = function () {
        if (_this.legendOption.top == 10 || _this.legendOption.top === '10px') {
            return 'top';
        } else if (_this.legendOption.top === '50%') {
            return 'center';
        } else if (_this.legendOption.bottom == 0 || _this.legendOption.bottom === '0px') {
            return 'bottom';
        } else {
            _this.legendOption.top = 10;
            return 'top';
        }
    }();

    this.horizontalAlign = WidgetFactory.createHorizontalAlignRadioButtonWidget($alignComponentContents, {
        value: horizontalAlignValue,
        onChanged: function onChanged(selectedValue) {
            if (selectedValue === 'left') {
                _this.legendOption.left = 0;
                _this.legendOption.right = 'auto';
            } else if (selectedValue === 'center') {
                _this.legendOption.left = '50%';
                _this.legendOption.right = 'auto';
            } else if (selectedValue === 'right') {
                _this.legendOption.left = 'auto';
                _this.legendOption.right = 0;
            }
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }
    });
    this._widgetList.push(this.horizontalAlign);

    this.verticalAlign = WidgetFactory.createVerticalAlignRadioButtonWidget($alignComponentContents, {
        value: verticalAlignValue,
        onChanged: function onChanged(selectedValue) {
            if (selectedValue === 'top') {
                _this.legendOption.top = 10;
                _this.legendOption.bottom = 'auto';
            } else if (selectedValue === 'center') {
                _this.legendOption.top = '50%';
                _this.legendOption.bottom = 'auto';
            } else if (selectedValue === 'bottom') {
                _this.legendOption.top = 'auto';
                _this.legendOption.bottom = 0;
            }
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }
    });
    this._widgetList.push(this.verticalAlign);
};

LegendControl.prototype._createDirectionComponent = function () {
    var _this = this;

    var $directionComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Direction</div>' + '   <div class="bo-component-legend-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($directionComponent);
    var $directionComponentContents = $directionComponent.find('.bo-component-legend-contents');

    this.direction = WidgetFactory.createDirectionRadioButtonWidget($directionComponentContents, {
        value: this.legendOption.orientation,
        onChanged: function onChanged(inptValue) {
            _this.legendOption.orientation = inptValue;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }
    });
    this._widgetList.push(this.direction);
};

LegendControl.prototype._createFontStyleComponent = function () {
    var _this = this;
    this.$controlContents.append($('<div class="bos-widget-row-separator"/>'));
    this.fontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        value: [this.legendOption.textStyle.fontFamily, this.legendOption.textStyle.fontSize, this.legendOption.textStyle.color, [this.legendOption.textStyle.fontWeight, this.legendOption.textStyle.fontStyle, this.legendOption.textStyle.textDecoration]],
        onChanged: [function (inputVal) {
            _this.legendOption.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }, function (inputVal) {
            _this.legendOption.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }, function (inputVal) {
            _this.legendOption.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }, function (selectedVals) {
            _this.legendOption.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.legendOption.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.legendOption.textStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }]
    });
    this._widgetList.push(this.fontStyle);
};

LegendControl.prototype.toggleDisableComponent = function (checkedVal) {
    this.horizontalAlign.toggleDisable(!checkedVal);
    this.verticalAlign.toggleDisable(!checkedVal);
    this.direction.toggleDisable(!checkedVal);
    this.fontStyle.toggleDisable(!checkedVal);
};

exports.default = LegendControl;

/***/ }),
/* 613 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2017-12-28.
 */

var MAX_COUNT_OF_COLORMAP = 11;

function VisualMapValueControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

VisualMapValueControl.prototype = Object.create(_baseControl2.default.prototype);
VisualMapValueControl.prototype.constructor = VisualMapValueControl;

VisualMapValueControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.visualmapOption = this.options.chartOption.visualMap;
    if (!this.visualmapOption.colorMap) {
        this.visualmapOption.colorMap = [];
    }
};

VisualMapValueControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        label: 'Color Picker',
        addBtn: {
            clickfunc: function clickfunc() {
                var colorLength = _this.visualmapOption.colorMap.length;
                if (colorLength >= MAX_COUNT_OF_COLORMAP) {
                    return;
                }
                _this.visualmapOption.colorMap.push({ value: 0, color: '#FFFFFF' });
                _this.createColorPickerUnit(colorLength);
                _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

VisualMapValueControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    // this.$controlContents.addClass('continuous');

    this._createColorPickerComponent();
};

VisualMapValueControl.prototype._createColorPickerComponent = function () {
    var _this = this;
    this.$controlContents.removeClass('bos-control-contents');
    this.visualmapOption.colorMap.forEach(function (mapObj, colorIdx) {
        _this.createColorPickerUnit(colorIdx);
    });
};

VisualMapValueControl.prototype.createColorPickerUnit = function (colorIdx) {
    if (colorIdx >= MAX_COUNT_OF_COLORMAP) {
        return;
    }
    if (colorIdx == 0) {
        this.createColorPickerDefaultUnit();
    }

    var $component = $('<div class = "bo-control-contents-component bos-control-contents bos-deletable-component bos-display-flex bos-flex-align-center"></div>');
    this.$controlContents.append($component);

    this._createDeleteButton($component);
    this._createColorInputWidget($component, colorIdx);
};

VisualMapValueControl.prototype.createColorPickerDefaultUnit = function () {
    var _this = this;

    var $component = $('<div class = "bo-control-contents-component bos-control-contents bos-display-flex bos-flex-space-evenly"></div>');
    this.$controlContents.append($component);

    var colorSet = this.visualmapOption.colorSet;
    var defaultColorWidget = WidgetFactory.createMultiColorWidget($component, {
        label: ['Min', 'Max'],
        value: [colorSet[0], colorSet[1]],
        onChanged: [function (changedColor) {
            colorSet[0] = changedColor;
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }, function (changedColor) {
            colorSet[1] = changedColor;
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }]
    });
    this._widgetList.push(defaultColorWidget);

    this.multiColorWidget = $component;
};

VisualMapValueControl.prototype._createColorInputWidget = function ($component, colorIdx) {
    var _this = this;

    var mapObj = this.visualmapOption.colorMap[colorIdx];
    var colorInputWidget = WidgetFactory.createColorInputWidget($component, {
        value: [mapObj.value || 0, mapObj.color],
        onChanged: [function (inputVal) {
            mapObj.value = Number(inputVal);
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }, function (changedColor) {
            mapObj.color = changedColor;
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }]
    });
    this._widgetList.push(colorInputWidget);
};

VisualMapValueControl.prototype._createDeleteButton = function ($component) {
    var $deleteButton = $('<div class="bos-delete-btn"></div>');
    $component.append($deleteButton);

    var _this = this;
    $deleteButton.click(function () {
        event.stopPropagation();
        var colorArr = _this.visualmapOption.colorMap;
        var deleteIdx = $component.index() - 1;
        _this.visualmapOption.colorMap.splice(deleteIdx, 1);
        _this.setExpanderPreview.call(_this);
        _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        if (_this.visualmapOption.colorMap.length === 0) {
            _this.multiColorWidget.remove();
        }
        $component.remove();
    });
};

exports.default = VisualMapValueControl;

/***/ }),
/* 614 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2017-12-28.
 */

function VisualMapAlignControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

VisualMapAlignControl.prototype = Object.create(_baseControl2.default.prototype);
VisualMapAlignControl.prototype.constructor = VisualMapAlignControl;

VisualMapAlignControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.visualmapOption = this.options.chartOption.visualMap;
};

VisualMapAlignControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);
    var _this = this;
    var headerOption = {
        showBtn: {
            defaultVal: this.visualmapOption.show,
            clickfunc: function clickfunc(event) {
                var checkedVal = event.args.checked;
                _this.toggleDisableComponent(checkedVal);
                _this.visualmapOption.show = checkedVal;
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

VisualMapAlignControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createAlignComponent();
    // this._createFontStyleComponent();
};

VisualMapAlignControl.prototype._createAlignComponent = function () {
    var _this = this;

    var $alignComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Align</div>' + '   <div class="bo-component-visualmap-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($alignComponent);
    var $alignComponentContents = $alignComponent.find('.bo-component-visualmap-contents');

    //POLICY: left가 right보다 우선순위가 높다.
    //POLICY: top이 bottom보다 우선순위가 높다.
    var horizontalAlignValue = function () {
        if (_this.visualmapOption.left == 0 || _this.visualmapOption.left === '0px') {
            return 'left';
            // } else if (_this.visualmapOption.left === '50%') {
            //     return 'center';
        } else if (_this.visualmapOption.right == 0 || _this.visualmapOption.right === '0px') {
            return 'right';
        } else {
            _this.visualmapOption.left = 0;
            return 'center';
        }
    }();
    var verticalAlignValue = function () {
        if (_this.visualmapOption.top == 10 || _this.visualmapOption.top === '10px') {
            return 'top';
            // } else if (_this.visualmapOption.top === '50%') {
            //     return 'center';
        } else if (_this.visualmapOption.bottom == 0 || _this.visualmapOption.bottom === '0px') {
            return 'bottom';
        } else {
            _this.visualmapOption.top = 10;
            return 'top';
        }
    }();

    this.horizontalAlign = WidgetFactory.createHorizontalAlignRadioButtonWidget($alignComponentContents, {
        value: horizontalAlignValue,
        onChanged: function onChanged(selectedValue) {
            if (selectedValue === 'left') {
                _this.visualmapOption.left = 0;
                _this.visualmapOption.right = 'auto';
            } else if (selectedValue === 'center') {
                _this.visualmapOption.left = 'center';
                _this.visualmapOption.right = 'auto';
            } else if (selectedValue === 'right') {
                _this.visualmapOption.left = 'auto';
                _this.visualmapOption.right = 0;
            }
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }
    });
    this._widgetList.push(this.horizontalAlign);

    this.verticalAlign = WidgetFactory.createVerticalAlignRadioButtonWidget($alignComponentContents, {
        value: verticalAlignValue,
        onChanged: function onChanged(selectedValue) {
            if (selectedValue === 'top') {
                _this.visualmapOption.top = 10;
                _this.visualmapOption.bottom = 'auto';
            } else if (selectedValue === 'center') {
                _this.visualmapOption.top = 'middle';
                _this.visualmapOption.bottom = 'auto';
            } else if (selectedValue === 'bottom') {
                _this.visualmapOption.top = 'auto';
                _this.visualmapOption.bottom = 0;
            }
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }
    });
    this._widgetList.push(this.verticalAlign);
};

VisualMapAlignControl.prototype._createFontStyleComponent = function () {
    var _this = this;

    this.fontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        fontStyleBtnList: ['bold', 'italic'],
        value: [this.visualmapOption.textStyle.fontFamily, this.visualmapOption.textStyle.fontSize, this.visualmapOption.textStyle.color, [this.visualmapOption.textStyle.fontWeight, this.visualmapOption.textStyle.fontStyle]],
        onChanged: [function (inputVal) {
            _this.visualmapOption.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }, function (inputVal) {
            _this.visualmapOption.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }, function (inputVal) {
            _this.visualmapOption.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }, function (selectedVals) {
            _this.visualmapOption.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.visualmapOption.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.options.onChanged('onChartOptionChanged', { visualMap: _this.visualmapOption });
        }]
    });
    this.$controlContents.append($('<div class="bos-widget-row-separator"/>'));
    this._widgetList.push(this.fontStyle);
};

exports.default = VisualMapAlignControl;

/***/ }),
/* 615 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _markerControl = __webpack_require__(289);

var _markerControl2 = _interopRequireDefault(_markerControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MarkerLineControl(parentId, options, headerKey) {
    _markerControl2.default.call(this, parentId, options, headerKey);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

MarkerLineControl.prototype = Object.create(_markerControl2.default.prototype);
MarkerLineControl.prototype.constructor = MarkerLineControl;

MarkerLineControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createSizeOpacityComponent();
    this._createLineStyleComponent();
    this._createColorPaletteComponent();
};

MarkerLineControl.prototype._createLineStyleComponent = function () {
    if (!this.markerOption) return;

    var $lineStyleComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Line Style</div>' + '   <div class="bo-component-line-style-contents bos-display-flex">' + '       <div class="bo-component-line-style bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($lineStyleComponent);
    var $lineStyleComponentContents = $lineStyleComponent.find('.bo-component-line-style-contents');

    var _this = this;
    var markerLineSelectorWidget = WidgetFactory.createMarkerLineSelectorWidget($lineStyleComponentContents.find('.bo-component-line-style'), {
        type: 'boolean',
        value: _this.markerOption.lineStyle ? 'smooth' : 'flat',
        onChanged: function onChanged(inputVal) {
            _this.markerOption.lineStyle = inputVal === 'smooth';
            if (_this.markerOption.plotOptionType) {
                _this.options.chartOption.plotOptions[_this.markerOption.plotOptionType].smooth = _this.markerOption.lineStyle;
            } else {
                _this.options.chartOption.plotOptions.line.smooth = _this.markerOption.lineStyle;
            }
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(markerLineSelectorWidget);
};

exports.default = MarkerLineControl;

/***/ }),
/* 616 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function StripLineControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

StripLineControl.prototype = Object.create(_baseControl2.default.prototype);
StripLineControl.prototype.constructor = StripLineControl;

StripLineControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.layoutSetting = [{
        key: 'xAxis',
        label: 'X-axis'
    }, {
        key: 'yAxis',
        label: 'Y-axis'
    }];
    this.stripLineData = this.options.setting.stripLine.data[0];
};

StripLineControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    if (!this.options.setting.stripLine) {
        console.error('[options.setting.stripLine] is not defined');
        return;
    }

    this.layoutSetting.forEach(function (axisSetting, index) {
        if (!_this.stripLineData[axisSetting.key]) {
            _this.stripLineData[axisSetting.key] = [];
        }
        _this.createComponent(axisSetting);
        if (index !== _this.layoutSetting.length - 1) {
            _this.$controlMain.append($('<div class="bos-widget-row-separator"/>'));
        }
    });
};

StripLineControl.prototype.createComponent = function (axisSetting) {
    var _this = this;
    var headerOption = {
        label: axisSetting.label + ' Strip Line',
        additionalType: axisSetting.key,
        addBtn: {
            clickfunc: function clickfunc() {
                var newContentsOpt = {};
                var $axisControlContents = $(this).closest('.bo-control').find('.bo-control-contents[type=' + axisSetting.key + ']');
                _this._createComponent($axisControlContents, axisSetting.key, newContentsOpt);

                _this.stripLineData[axisSetting.key].push(newContentsOpt);

                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };
    this.createComponentHeader(headerOption);

    var axisFilteredData = [];
    this.createComponentContents(axisSetting.key);
};

StripLineControl.prototype.createComponentContents = function (axisKey) {
    _baseControl2.default.prototype.createComponentContents.call(this);
    this.$controlContents.removeClass('bos-control-contents');
    this.$controlContents.attr('type', axisKey);
    var $axisControlContents = this.$controlContents;

    var _this = this;
    this.stripLineData[axisKey].forEach(function (lineData) {
        _this._createComponent($axisControlContents, axisKey, lineData);
    });
};

StripLineControl.prototype._createComponent = function ($control, axisKey, lineData) {
    var $component = $('<div class = "bo-control-contents-component bos-control-contents bos-deletable-component"></div>');
    $control.append($component);

    this._createDeleteButton($component, axisKey);
    this._createLineComponent($component, axisKey, lineData);
};

StripLineControl.prototype._createDeleteButton = function ($component, axisKey) {
    var $deleteButton = $('<div class="bos-delete-btn"></div>');
    $component.append($deleteButton);

    var _this = this;
    $deleteButton.click(function (event) {
        event.stopPropagation();
        var deleteIdx = $component.index();
        _this.stripLineData[axisKey].splice(deleteIdx, 1);
        _this.setExpanderPreview.call(_this);
        _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        $component.remove();
    });
};

StripLineControl.prototype._createLineComponent = function ($component, axisKey, lineData) {
    var _this = this;
    var componentTemplate = {
        lineStyle: {
            normal: {
                color: '#000000',
                type: 'solid',
                width: 1
            }
        }
    };
    _baseControl2.default.setTemplate(componentTemplate, lineData);

    var widgetOptions = {
        value: [lineData.value || 0, lineData.lineStyle.normal],
        chartLine: true,
        onChanged: [function (inputVal) {
            lineData.value = inputVal;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, [function (inputVal) {
            lineData.lineStyle.normal.width = inputVal;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (changedColor) {
            lineData.lineStyle.normal.color = changedColor;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (inputVal) {
            lineData.lineStyle.normal.type = inputVal;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }]]
    };
    var lineComponentWidget = WidgetFactory.createLineComponentWidget($component, widgetOptions);
    this._widgetList.push(lineComponentWidget);
};

StripLineControl.prototype.renderWarning = function () {
    var _this = this;
    var _conceal = function _conceal(axis) {
        _this.$controlMain.find('.bo-control-header[type="' + axis + '"]').css({ display: 'none' });
        _this.$controlMain.find('.bo-control-contents[type="' + axis + '"]').css({ display: 'none' });
        _this.$controlMain.find('.bos-widget-row-separator').css({ display: 'none' });

        for (var i = 0; i < _this.stripLineData[axis].length; i++) {
            _this.stripLineData[axis][i].display = false;
        }
    };
    var _show = function _show(axis) {
        _this.$controlMain.find('.bo-control-header[type="' + axis + '"]').css({ display: 'flex' });
        _this.$controlMain.find('.bo-control-contents[type="' + axis + '"]').css({ display: 'block' });
        _this.$controlMain.find('.bos-widget-row-separator').css({ display: 'block' });
        for (var i = 0; i < _this.stripLineData[axis].length; i++) {
            _this.stripLineData[axis][i].display = true;
        }
    };

    var chkAxis = ['xAxis', 'yAxis'];
    var warning = this.options.warningList;
    for (var i = 0; i < chkAxis.length; i++) {
        if (warning && warning.length > 0 && warning[0].target == chkAxis[i]) {
            _conceal(chkAxis[i]);
        } else {
            _show(chkAxis[i]);
        }
    }
    this.setExpanderPreview();
};

exports.default = StripLineControl;

/***/ }),
/* 617 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function TrendLineControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

TrendLineControl.prototype = Object.create(_baseControl2.default.prototype);
TrendLineControl.prototype.constructor = TrendLineControl;

TrendLineControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.layoutSetting = [{
        key: 'trend',
        label: 'Trend'
    }];
    this.trendLineData = this.options.setting.trendLine.data[0];
};

TrendLineControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    if (!this.options.setting.trendLine) {
        console.error('[options.setting.trendLine] is not defined');
        return;
    }

    this.layoutSetting.forEach(function (layout, index) {
        if (!_this.trendLineData[layout.key]) {
            _this.trendLineData[layout.key] = [];
        }
        _this.createComponent(layout);
        if (index !== _this.layoutSetting.length - 1) {
            _this.$controlMain.append($('<div class="bos-widget-row-separator"/>'));
        }
    });
};

TrendLineControl.prototype.createComponent = function (layout) {
    var _this = this;
    var headerOption = {
        label: layout.label + ' Line',
        additionalType: layout.key,
        showBtn: {
            defaultVal: this.trendLineData[layout.key].length > 0,
            clickfunc: function clickfunc(event) {
                if (event.args.checked) {
                    var newContentsOpt = {};
                    var $layoutControlContents = $(this).closest('.bo-control').find('.bo-control-contents[type=' + layout.key + ']');
                    _this._createComponent($layoutControlContents, layout.key, newContentsOpt);

                    _this.trendLineData[layout.key].push(newContentsOpt);

                    _this.setExpanderPreview.call(_this);
                    _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
                } else {
                    event.stopPropagation();
                    var $layoutControlContents = $(this).closest('.bo-control').find('.bo-control-contents[type=' + layout.key + ']');

                    _this.trendLineData[layout.key].splice(0, 1);
                    _this.setExpanderPreview.call(_this);
                    _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
                    _this._dropComponent($layoutControlContents, layout.key, newContentsOpt);
                }
            }

            // TODO: 추후에 여러개 입력할때 살릴거임
            /*
            addBtn: {
                clickfunc: function () {
                    var newContentsOpt = {};
                    var $layoutControlContents = $(this).closest('.bo-control').find('.bo-control-contents[type=' + layout.key + ']');
                    _this._createComponent($layoutControlContents, layout.key, newContentsOpt);
                    _this.trendLineData[layout.key].push(newContentsOpt);
                    _this.setExpanderPreview.call(_this);
                    _this.options.onChanged('onChartOptionChanged', {plotOptions: _this.options.chartOption.plotOptions});
                }
            }
            */
        } };
    this.createComponentHeader(headerOption);
    this.createComponentContents(layout.key);
};

TrendLineControl.prototype.createComponentContents = function (layoutKey) {
    _baseControl2.default.prototype.createComponentContents.call(this);

    this.$controlContents.removeClass('bos-control-contents');
    this.$controlContents.attr('type', layoutKey);
    var $layoutControlContents = this.$controlContents;

    var _this = this;
    this.trendLineData[layoutKey].forEach(function (lineData) {
        _this._createComponent($layoutControlContents, layoutKey, lineData);
    });
};

TrendLineControl.prototype._createComponent = function ($control, layoutKey, lineData) {
    var $component = $('<div class = "bo-control-contents-component bos-control-contents bos-deletable-component"></div>');
    $control.append($component);

    // TODO: 추후에 여러개 입력할때 살릴거임
    //this._createDeleteButton($component, layoutKey);
    this._createLineComponent($component, layoutKey, lineData);
};

TrendLineControl.prototype._dropComponent = function ($control, layoutKey, lineData) {
    var $component = $control.find('.bos-deletable-component');
    $component.remove();
};

TrendLineControl.prototype._createDeleteButton = function ($component, layoutKey) {
    var $deleteButton = $('<div class="bos-delete-btn"></div>');
    $component.append($deleteButton);

    var _this = this;
    $deleteButton.click(function (event) {
        event.stopPropagation();
        var deleteIdx = $component.index();
        _this.trendLineData[layoutKey].splice(deleteIdx, 1);
        _this.setExpanderPreview.call(_this);
        _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        $component.remove();
    });
};

TrendLineControl.prototype._createLineComponent = function ($component, layoutKey, lineData) {
    var _this = this;
    var componentTemplate = {
        lineStyle: {
            normal: {
                color: '#000000',
                type: 'solid',
                width: 1
            }
        }
    };
    _baseControl2.default.setTemplate(componentTemplate, lineData);

    var widgetOptions = {
        value: [lineData.value || 0, lineData.lineStyle.normal],
        chartLine: true,
        trendLine: true,
        onChanged: [function (inputVal) {
            lineData.value = inputVal;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, [function (inputVal) {
            lineData.lineStyle.normal.width = inputVal;
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (changedColor) {
            lineData.lineStyle.normal.color = changedColor;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (inputVal) {
            lineData.lineStyle.normal.type = inputVal;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }]]
    };
    var lineComponentWidget = WidgetFactory.createLineComponentWidget($component, widgetOptions);
    this._widgetList.push(lineComponentWidget);
};

exports.default = TrendLineControl;

/***/ }),
/* 618 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function FrameStyleControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

FrameStyleControl.prototype = Object.create(_baseControl2.default.prototype);
FrameStyleControl.prototype.constructor = FrameStyleControl;

FrameStyleControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.styleOption = this.options.chartOption.chart;
    this.gridOption = this.options.chartOption.grid;
};

FrameStyleControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

FrameStyleControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createBackgroundComponent();
    this._createBorderComponent();
};

FrameStyleControl.prototype._createBackgroundComponent = function (contentsOption) {
    var $backgroundComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Background</div>' + '   <div class="bo-component-frame-contents bos-display-flex">' + '       <div class="bo-component-frame-background-color bos-flex-1"></div>' + '       <div class="bo-component-frame-background-opacity bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($backgroundComponent);
    var $backgroundComponentContents = $backgroundComponent.find('.bo-component-frame-contents');

    var _this = this;
    this.opacity = function () {
        if (_this.styleOption.background == 'transparent') {
            return 0;
        } else {
            return _this.styleOption.background.replace(/^(.*,)(.+)\)/, '$2');
        }
    }();

    var colorPickerWidget = WidgetFactory.createColorPickerWidget($backgroundComponentContents.find('.bo-component-frame-background-color'), {
        width: '50px',
        height: '30px',
        hasOpacity: true,
        value: this.styleOption.background,
        onChanged: function onChanged(color) {
            _this.styleOption.background = color.replace(/^(.*,).+\)/, '$1') + _this.opacity + ')';
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(colorPickerWidget);

    var opacitySelectorWidget = WidgetFactory.createOpacitySelectorWidget($backgroundComponentContents.find('.bo-component-frame-background-opacity'), {
        value: this.opacity,
        onChanged: function onChanged(opacity) {
            _this.opacity = opacity;
            var resultRgba = _this.styleOption.background.replace(/^(.*,).+\)/, '$1');
            resultRgba = resultRgba + opacity + ')';
            _this.styleOption.background = resultRgba;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(opacitySelectorWidget);
};

FrameStyleControl.prototype._createBorderComponent = function (contentsOption) {

    var _this = this;

    var _getBorderStr2Obj = function _getBorderStr2Obj(inptOption) {
        var emptyDiv = $('<div/>').css({ border: inptOption });
        return {
            borderColor: emptyDiv.css('border-color'),
            // 5px -> 5
            borderWidth: emptyDiv.css('border-width').replace('px', ''),
            borderType: emptyDiv.css('border-style')
        };
    };
    var _getBorderObj2Str = function _getBorderObj2Str(borderObj) {
        var borderStr = '';
        borderStr += borderObj.borderColor ? borderObj.borderColor + ' ' : '';
        borderStr += borderObj.borderWidth ? borderObj.borderWidth + 'px ' : '';
        borderStr += borderObj.borderType ? borderObj.borderType : '';
        return borderStr;
    };

    this.borderAttrObj = _getBorderStr2Obj(this.styleOption.border);
    var lineStyleWidget = WidgetFactory.createLineStyleWidget(this.$controlContents, {
        label: 'Border',
        value: [this.borderAttrObj.borderWidth, this.borderAttrObj.borderColor, this.borderAttrObj.borderType],
        onChanged: [function (inputVal) {
            _this.borderAttrObj.borderWidth = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (changedColor) {
            _this.borderAttrObj.borderColor = changedColor;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (inputVal) {
            _this.borderAttrObj.borderType = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }]
    });

    this._widgetList.push(lineStyleWidget);
};

FrameStyleControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = FrameStyleControl;

/***/ }),
/* 619 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _framePieControl = __webpack_require__(290);

var _framePieControl2 = _interopRequireDefault(_framePieControl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultOptions = Brightics.Chart.DefaultOption; /**
                                                     * Created by mk90.kim on 2017-05-10.
                                                     */

function FrameControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

FrameControl.prototype = Object.create(_baseControl2.default.prototype);
FrameControl.prototype.constructor = FrameControl;

FrameControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.styleOption = this.options.chartOption.chart;
    this.gridOption = this.options.chartOption.grid;
};

FrameControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

FrameControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createChartPositionComponent();
    this._createChartSizeComponent();
    this._createBackgroundComponent();
    this._createBorderComponent();
};

FrameControl.prototype._createChartPositionComponent = function (contentsOption) {
    var $chartPositionComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Chart Position</div>' + '   <div class="bo-component-chart-position-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartPositionComponent);
    var $chartPositionComponentContents = $chartPositionComponent.find('.bo-component-chart-position-contents');

    var _this = this;

    var positionOptions = {
        width: '50px',
        height: '30px',
        value: {
            left: this.gridOption.left,
            right: this.gridOption.right,
            top: this.gridOption.top,
            bottom: this.gridOption.bottom
        },
        position: ['left', 'top', 'right', 'bottom'],
        problemKeyList: ['value-003'],
        onChanged: {
            left: function left(value) {
                _this.gridOption.left = value ? value : DefaultOptions.Grid.left;
                _this.options.onChanged('onChartOptionChanged', { grid: _this.gridOption });
            },
            right: function right(value) {
                _this.gridOption.right = value ? value : DefaultOptions.Grid.right;
                _this.options.onChanged('onChartOptionChanged', { grid: _this.gridOption });
            },
            top: function top(value) {
                _this.gridOption.top = value ? value : DefaultOptions.Grid.top;
                _this.options.onChanged('onChartOptionChanged', { grid: _this.gridOption });
            },
            bottom: function bottom(value) {
                _this.gridOption.bottom = value ? value : DefaultOptions.Grid.bottom;
                _this.options.onChanged('onChartOptionChanged', { grid: _this.gridOption });
            }
        }
    };

    if (this.options.setting.grid) {
        $.extend(true, positionOptions, this.options.setting.grid);
    }

    var positionWidget = WidgetFactory.createPositionWidget($chartPositionComponentContents, positionOptions);

    this._widgetList.push(positionWidget);
};

FrameControl.prototype._createChartSizeComponent = function (contentsOption) {
    var $chartSizeComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Chart Size</div>' + '   <div class="bo-component-chart-size-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartSizeComponent);
    var $chartSizeComponentContents = $chartSizeComponent.find('.bo-component-chart-size-contents');

    var _this = this;

    var sizeOptions = {
        width: '50px',
        height: '30px',
        value: {
            width: this.gridOption.width,
            height: this.gridOption.height
        },
        position: ['width', 'height'],
        problemKeyList: ['value-003'],
        onChanged: {
            width: function width(value) {
                _this.gridOption.width = value ? value : DefaultOptions.Grid.width;
                _this.options.onChanged('onChartOptionChanged', { grid: _this.gridOption });
            },
            height: function height(value) {
                _this.gridOption.height = value ? value : DefaultOptions.Grid.height;
                _this.options.onChanged('onChartOptionChanged', { grid: _this.gridOption });
            }
        }
    };

    if (this.options.setting.grid) {
        $.extend(true, sizeOptions, this.options.setting.grid);
    }

    var sizeWidget = WidgetFactory.createCenterPositionWidget($chartSizeComponentContents, sizeOptions);

    this._widgetList.push(sizeWidget);
};

FrameControl.prototype._createBackgroundComponent = function (contentsOption) {
    var $backgroundComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Background</div>' + '   <div class="bo-component-frame-contents bos-display-flex">' + '       <div class="bo-component-frame-background-color bos-flex-1"></div>' + '       <div class="bo-component-frame-background-opacity bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($backgroundComponent);
    var $backgroundComponentContents = $backgroundComponent.find('.bo-component-frame-contents');

    var _this = this;
    this.opacity = function () {
        if (_this.styleOption.background == 'transparent') {
            return 0;
        } else {
            return _this.styleOption.background.replace(/^(.*,)(.+)\)/, '$2');
        }
    }();

    var colorPickerWidget = WidgetFactory.createColorPickerWidget($backgroundComponentContents.find('.bo-component-frame-background-color'), {
        width: '50px',
        height: '30px',
        hasOpacity: true,
        value: this.styleOption.background,
        onChanged: function onChanged(color) {
            _this.styleOption.background = color.replace(/^(.*,).+\)/, '$1') + _this.opacity + ')';
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(colorPickerWidget);

    var opacitySelectorWidget = WidgetFactory.createOpacitySelectorWidget($backgroundComponentContents.find('.bo-component-frame-background-opacity'), {
        value: this.opacity,
        onChanged: function onChanged(opacity) {
            _this.opacity = opacity;
            var resultRgba = _this.styleOption.background.replace(/^(.*,).+\)/, '$1');
            resultRgba = resultRgba + opacity + ')';
            _this.styleOption.background = resultRgba;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(opacitySelectorWidget);
};

FrameControl.prototype._createBorderComponent = function (contentsOption) {

    var _this = this;

    var _getBorderStr2Obj = function _getBorderStr2Obj(inptOption) {
        var emptyDiv = $('<div/>').css({ border: inptOption });
        return {
            borderColor: emptyDiv.css('border-color'),
            // 5px -> 5
            borderWidth: emptyDiv.css('border-width').replace('px', ''),
            borderType: emptyDiv.css('border-style')
        };
    };
    var _getBorderObj2Str = function _getBorderObj2Str(borderObj) {
        var borderStr = '';
        borderStr += borderObj.borderColor ? borderObj.borderColor + ' ' : '';
        borderStr += borderObj.borderWidth ? borderObj.borderWidth + 'px ' : '';
        borderStr += borderObj.borderType ? borderObj.borderType : '';
        return borderStr;
    };

    this.borderAttrObj = _getBorderStr2Obj(this.styleOption.border);
    var lineStyleWidget = WidgetFactory.createLineStyleWidget(this.$controlContents, {
        label: 'Border',
        value: [this.borderAttrObj.borderWidth, this.borderAttrObj.borderColor, this.borderAttrObj.borderType],
        onChanged: [function (inputVal) {
            _this.borderAttrObj.borderWidth = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (changedColor) {
            _this.borderAttrObj.borderColor = changedColor;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (inputVal) {
            _this.borderAttrObj.borderType = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }]
    });

    this._widgetList.push(lineStyleWidget);
};

FrameControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = FrameControl;

/***/ }),
/* 620 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _positionWidget = __webpack_require__(284);

var _positionWidget2 = _interopRequireDefault(_positionWidget);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FrameMapControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

FrameMapControl.prototype = Object.create(_baseControl2.default.prototype);
FrameMapControl.prototype.constructor = FrameMapControl;

FrameMapControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.styleOption = this.options.chartOption.chart;
    this.gridOption = this.options.chartOption.grid;
    this.display = this.options.setting.display;
    if (!this.display.center) this.display.center = [];
};

FrameMapControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

FrameMapControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createChartPositionComponent();
    this._createChartSizeComponent();
    this._createBackgroundComponent();
    this._createBorderComponent();
};

FrameMapControl.prototype._createChartPositionComponent = function (contentsOption) {
    var $chartPositionComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Center View-Port</div>' + '   <div class="bo-component-chart-position-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartPositionComponent);
    var $chartPositionComponentContents = $chartPositionComponent.find('.bo-component-chart-position-contents');

    var _this = this;

    var positionOptions = {
        width: '50px',
        height: '30px',
        value: {
            longitude: this.display.center[0],
            latitude: this.display.center[1]
        },
        position: ['longitude', 'latitude'],
        problemKeyList: ['value-003'],
        onChanged: {
            longitude: function longitude(value) {
                _this.display.center[0] = value ? value : '';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            },
            latitude: function latitude(value) {
                _this.display.center[1] = value ? value : '';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };

    if (this.options.setting.display) {
        $.extend(true, positionOptions, this.options.setting.display);
    }

    var positionWidget = WidgetFactory.createCenterPositionNumberWidget($chartPositionComponentContents, positionOptions);

    this._widgetList.push(positionWidget);
};

FrameMapControl.prototype._createChartSizeComponent = function (contentsOption) {
    var $chartSizeComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Chart Zoom</div>' + '   <div class="bo-component-chart-size-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartSizeComponent);
    var $chartSizeComponentContents = $chartSizeComponent.find('.bo-component-chart-size-contents');

    var _this = this;

    var sizeOptions = {
        width: '50px',
        height: '30px',
        value: {
            size: this.display.zoom
        },
        position: ['size'],
        problemKeyList: ['value-003'],
        onChanged: {
            size: function size(value) {
                _this.display.zoom = value ? value : '1';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };

    if (this.options.setting.display) {
        $.extend(true, sizeOptions, this.options.setting.display);
    }

    var sizeWidget = WidgetFactory.createCenterPositionNumberWidget($chartSizeComponentContents, sizeOptions);

    this._widgetList.push(sizeWidget);
};

FrameMapControl.prototype._createBackgroundComponent = function (contentsOption) {
    var $backgroundComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Background</div>' + '   <div class="bo-component-frame-contents bos-display-flex">' + '       <div class="bo-component-frame-background-color bos-flex-1"></div>' + '       <div class="bo-component-frame-background-opacity bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($backgroundComponent);
    var $backgroundComponentContents = $backgroundComponent.find('.bo-component-frame-contents');

    var _this = this;
    this.opacity = function () {
        if (_this.styleOption.background == 'transparent') {
            return 0;
        } else {
            return _this.styleOption.background.replace(/^(.*,)(.+)\)/, '$2');
        }
    }();

    var colorPickerWidget = WidgetFactory.createColorPickerWidget($backgroundComponentContents.find('.bo-component-frame-background-color'), {
        width: '50px',
        height: '30px',
        hasOpacity: true,
        value: this.styleOption.background,
        onChanged: function onChanged(color) {
            _this.styleOption.background = color.replace(/^(.*,).+\)/, '$1') + _this.opacity + ')';
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(colorPickerWidget);

    var opacitySelectorWidget = WidgetFactory.createOpacitySelectorWidget($backgroundComponentContents.find('.bo-component-frame-background-opacity'), {
        value: this.opacity,
        onChanged: function onChanged(opacity) {
            _this.opacity = opacity;
            var resultRgba = _this.styleOption.background.replace(/^(.*,).+\)/, '$1');
            resultRgba = resultRgba + opacity + ')';
            _this.styleOption.background = resultRgba;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(opacitySelectorWidget);
};

FrameMapControl.prototype._createBorderComponent = function (contentsOption) {

    var _this = this;

    var _getBorderStr2Obj = function _getBorderStr2Obj(inptOption) {
        var emptyDiv = $('<div/>').css({ border: inptOption });
        return {
            borderColor: emptyDiv.css('border-color'),
            // 5px -> 5
            borderWidth: emptyDiv.css('border-width').replace('px', ''),
            borderType: emptyDiv.css('border-style')
        };
    };
    var _getBorderObj2Str = function _getBorderObj2Str(borderObj) {
        var borderStr = '';
        borderStr += borderObj.borderColor ? borderObj.borderColor + ' ' : '';
        borderStr += borderObj.borderWidth ? borderObj.borderWidth + 'px ' : '';
        borderStr += borderObj.borderType ? borderObj.borderType : '';
        return borderStr;
    };

    this.borderAttrObj = _getBorderStr2Obj(this.styleOption.border);
    var lineStyleWidget = WidgetFactory.createLineStyleWidget(this.$controlContents, {
        label: 'Border',
        value: [this.borderAttrObj.borderWidth, this.borderAttrObj.borderColor, this.borderAttrObj.borderType],
        onChanged: [function (inputVal) {
            _this.borderAttrObj.borderWidth = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (changedColor) {
            _this.borderAttrObj.borderColor = changedColor;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (inputVal) {
            _this.borderAttrObj.borderType = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }]
    });

    this._widgetList.push(lineStyleWidget);
};

FrameMapControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = FrameMapControl;

/***/ }),
/* 621 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function FrameDonutControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

FrameDonutControl.prototype = Object.create(_baseControl2.default.prototype);
FrameDonutControl.prototype.constructor = FrameDonutControl;

FrameDonutControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.styleOption = this.options.chartOption.chart;
    this.gridOption = this.options.chartOption.grid;
    this.display = this.options.setting.display;
    if (!this.display.center) this.display.center = [];
};

FrameDonutControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

FrameDonutControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createChartPositionComponent();
    this._createChartSizeComponent();
    this._createBackgroundComponent();
    this._createBorderComponent();
};

FrameDonutControl.prototype._createChartPositionComponent = function (contentsOption) {
    var $chartPositionComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Center Position</div>' + '   <div class="bo-component-chart-position-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartPositionComponent);
    var $chartPositionComponentContents = $chartPositionComponent.find('.bo-component-chart-position-contents');

    var _this = this;

    var positionOptions = {
        width: '50px',
        height: '30px',
        value: {
            left: this.display.center[0],
            top: this.display.center[1]
        },
        position: ['left', 'top'],
        problemKeyList: ['value-003'],
        onChanged: {
            left: function left(value) {
                _this.display.center[0] = value ? value : '50%';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            },
            top: function top(value) {
                _this.display.center[1] = value ? value : '50%';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };

    if (this.options.setting.display) {
        $.extend(true, positionOptions, this.options.setting.display);
    }

    var positionWidget = WidgetFactory.createCenterPositionWidget($chartPositionComponentContents, positionOptions);

    this._widgetList.push(positionWidget);
};

FrameDonutControl.prototype._createChartSizeComponent = function (contentsOption) {
    var $chartSizeComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Radius</div>' + '   <div class="bo-component-chart-size-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($chartSizeComponent);
    var $chartSizeComponentContents = $chartSizeComponent.find('.bo-component-chart-size-contents');

    var _this = this;

    var sizeOptions = {
        width: '50px',
        height: '30px',
        value: {
            in: this.display.radius[0],
            out: this.display.radius[1]
        },
        position: ['in', 'out'],
        problemKeyList: ['value-003'],
        onChanged: {
            in: function _in(value) {
                _this.display.radius[0] = value ? value : '25%';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            },
            out: function out(value) {
                _this.display.radius[1] = value ? value : '75%';
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        }
    };

    if (this.options.setting.display) {
        $.extend(true, sizeOptions, this.options.setting.display);
    }

    var sizeWidget = WidgetFactory.createCenterPositionWidget($chartSizeComponentContents, sizeOptions);

    this._widgetList.push(sizeWidget);
};

FrameDonutControl.prototype._createBackgroundComponent = function (contentsOption) {
    var $backgroundComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Background</div>' + '   <div class="bo-component-frame-contents bos-display-flex">' + '       <div class="bo-component-frame-background-color bos-flex-1"></div>' + '       <div class="bo-component-frame-background-opacity bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($backgroundComponent);
    var $backgroundComponentContents = $backgroundComponent.find('.bo-component-frame-contents');

    var _this = this;
    this.opacity = function () {
        if (_this.styleOption.background == 'transparent') {
            return 0;
        } else {
            return _this.styleOption.background.replace(/^(.*,)(.+)\)/, '$2');
        }
    }();

    var colorPickerWidget = WidgetFactory.createColorPickerWidget($backgroundComponentContents.find('.bo-component-frame-background-color'), {
        width: '50px',
        height: '30px',
        hasOpacity: true,
        value: this.styleOption.background,
        onChanged: function onChanged(color) {
            _this.styleOption.background = color.replace(/^(.*,).+\)/, '$1') + _this.opacity + ')';
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(colorPickerWidget);

    var opacitySelectorWidget = WidgetFactory.createOpacitySelectorWidget($backgroundComponentContents.find('.bo-component-frame-background-opacity'), {
        value: this.opacity,
        onChanged: function onChanged(opacity) {
            _this.opacity = opacity;
            var resultRgba = _this.styleOption.background.replace(/^(.*,).+\)/, '$1');
            resultRgba = resultRgba + opacity + ')';
            _this.styleOption.background = resultRgba;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }
    });
    this._widgetList.push(opacitySelectorWidget);
};

FrameDonutControl.prototype._createBorderComponent = function (contentsOption) {

    var _this = this;

    var _getBorderStr2Obj = function _getBorderStr2Obj(inptOption) {
        var emptyDiv = $('<div/>').css({ border: inptOption });
        return {
            borderColor: emptyDiv.css('border-color'),
            // 5px -> 5
            borderWidth: emptyDiv.css('border-width').replace('px', ''),
            borderType: emptyDiv.css('border-style')
        };
    };
    var _getBorderObj2Str = function _getBorderObj2Str(borderObj) {
        var borderStr = '';
        borderStr += borderObj.borderColor ? borderObj.borderColor + ' ' : '';
        borderStr += borderObj.borderWidth ? borderObj.borderWidth + 'px ' : '';
        borderStr += borderObj.borderType ? borderObj.borderType : '';
        return borderStr;
    };

    this.borderAttrObj = _getBorderStr2Obj(this.styleOption.border);
    var lineStyleWidget = WidgetFactory.createLineStyleWidget(this.$controlContents, {
        label: 'Border',
        value: [this.borderAttrObj.borderWidth, this.borderAttrObj.borderColor, this.borderAttrObj.borderType],
        onChanged: [function (inputVal) {
            _this.borderAttrObj.borderWidth = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (changedColor) {
            _this.borderAttrObj.borderColor = changedColor;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }, function (inputVal) {
            _this.borderAttrObj.borderType = inputVal;
            _this.styleOption.border = _getBorderObj2Str(_this.borderAttrObj);
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { chart: _this.styleOption });
        }]
    });

    this._widgetList.push(lineStyleWidget);
};

FrameDonutControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = FrameDonutControl;

/***/ }),
/* 622 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function ToolTipControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

ToolTipControl.prototype = Object.create(_baseControl2.default.prototype);
ToolTipControl.prototype.constructor = ToolTipControl;

ToolTipControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
};

ToolTipControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

ToolTipControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createBehaviorComponent();
};

ToolTipControl.prototype._createBehaviorComponent = function () {
    var _this = this;

    var $directionComponent = $('' + '<div>' + '   <div class="bo-component-header">ToolTip Show</div>' + '   <div class="bo-component-legend-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($directionComponent);
    var $directionComponentContents = $directionComponent.find('.bo-component-legend-contents');

    this.tooltipBehavior = WidgetFactory.createToolTipBehaviorRadioButtonWidget($directionComponentContents, {
        value: this.options.chartOption.tooltip.triggerOn,
        onChanged: function onChanged(inputValue) {
            _this.options.chartOption.tooltip.triggerOn = inputValue;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { tooltip: { triggerOn: inputValue } });
        }
    });
    this._widgetList.push(this.tooltipBehavior);
};

ToolTipControl.prototype.render = function () {
    var changedTitleOption = this.options.chartOption.tooltip;
    this.tooltipBehavior.render(changedTitleOption.triggerOn);
};

exports.default = ToolTipControl;

/***/ }),
/* 623 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function FigureControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

FigureControl.prototype = Object.create(_baseControl2.default.prototype);
FigureControl.prototype.constructor = FigureControl;

FigureControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.figureStyle = this.options.setting.figureStyle;
};

FigureControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);
    this.createComponentContents();
};

FigureControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createNodeFigureComponent();
    this._createLinkFigureComponent();
    this._createEdgeFigureComponent();
};

FigureControl.prototype._createNodeFigureComponent = function () {
    if (!this.figureStyle.node) return;

    var $sizeOpacityComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Node Size / Color</div>' + //Figure
    '   <div class="bo-component-figure-node-contents bos-display-flex">' + '       <div class="bo-component-figure-node-size bos-flex-4"></div>' + '       <div class="bo-component-figure-node-color bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($sizeOpacityComponent);
    var $sizeOpacityComponentContents = $sizeOpacityComponent.find('.bo-component-figure-node-contents');

    var _this = this;
    if (this.figureStyle.node.size) {
        var nodeSizeSelectorWidget = WidgetFactory.createMarkerSizeSelectorWidget($sizeOpacityComponentContents.find('.bo-component-figure-node-size'), {
            type: 'number',
            value: this.figureStyle.node.size,
            autoSize: this.figureStyle.node.autoSize,
            onChanged: function onChanged(inputVal) {
                _this.figureStyle.node.size = inputVal;
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        });
        this._widgetList.push(nodeSizeSelectorWidget);
    }

    var nodeColorPickerWidget = WidgetFactory.createColorPickerWidget($sizeOpacityComponentContents.find('.bo-component-figure-node-color'), {
        value: this.figureStyle.node.color,
        onChanged: function onChanged(inputVal) {
            _this.figureStyle.node.color = inputVal;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(nodeColorPickerWidget);
};

FigureControl.prototype._createLinkFigureComponent = function () {
    if (!this.figureStyle.link) return;

    var $sizeOpacityComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Link Width / Color</div>' + //Figure
    '   <div class="bo-component-figure-link-contents bos-display-flex">' + '       <div class="bo-component-figure-link-width bos-flex-4"></div>' + '       <div class="bo-component-figure-link-color bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($sizeOpacityComponent);
    var $sizeOpacityComponentContents = $sizeOpacityComponent.find('.bo-component-figure-link-contents');

    var _this = this;
    if (this.figureStyle.link.width) {
        var linkWidthSelectorWidget = WidgetFactory.createMarkerSizeSelectorWidget($sizeOpacityComponentContents.find('.bo-component-figure-link-width'), {
            type: 'number',
            value: this.figureStyle.link.width,
            onChanged: function onChanged(inputVal) {
                _this.figureStyle.link.width = inputVal;
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        });
        this._widgetList.push(linkWidthSelectorWidget);
    }

    var linkColorPickerWidget = WidgetFactory.createColorPickerWidget($sizeOpacityComponentContents.find('.bo-component-figure-link-color'), {
        value: this.figureStyle.link.color,
        onChanged: function onChanged(inputVal) {
            _this.figureStyle.link.color = inputVal;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(linkColorPickerWidget);
};

FigureControl.prototype._createEdgeFigureComponent = function () {
    if (!this.figureStyle.edge) return;

    var $edgeComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Edge Style/Size</div>' + //Figure
    '   <div class="bo-component-figure-edge-contents bos-display-flex">' + '       <div class="bos-widget-header bo-widget-header">From</div>' + '       <div class="bo-component-figure-edge-style-from bos-flex-1"></div>' + '       <div class="bo-component-figure-edge-size-from bos-flex-1"></div>' + '   </div>' + '   <div class="bo-component-figure-edge-contents bos-display-flex">' + '       <div class="bos-widget-header bo-widget-header">To</div>' + '       <div class="bo-component-figure-edge-style-to bos-flex-1"></div>' + '       <div class="bo-component-figure-edge-size-to bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($edgeComponent);
    var $edgeComponentContents = $edgeComponent.find('.bo-component-figure-edge-contents');

    var _this = this;
    if (this.figureStyle.edge.symbol) {
        var edgeStyleFromSelectorWidget = WidgetFactory.createEdgeTypeSelectorWidget($edgeComponentContents.find('.bo-component-figure-edge-style-from'), {
            value: this.figureStyle.edge.symbol[0],
            onChanged: function onChanged(inputVal) {
                _this.figureStyle.edge.symbol[0] = inputVal;
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        });
        this._widgetList.push(edgeStyleFromSelectorWidget);
    }
    if (this.figureStyle.edge.size) {
        var edgeSizeFromSelectorWidget = WidgetFactory.createMarkerSizeSelectorWidget($edgeComponentContents.find('.bo-component-figure-edge-size-from'), {
            type: 'number',
            value: this.figureStyle.edge.size[0] - 9,
            onChanged: function onChanged(inputVal) {
                _this.figureStyle.edge.size[0] = inputVal + 9;
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        });
        this._widgetList.push(edgeSizeFromSelectorWidget);
    }
    if (this.figureStyle.edge.symbol) {
        var edgeStyleToSelectorWidget = WidgetFactory.createEdgeTypeSelectorWidget($edgeComponentContents.find('.bo-component-figure-edge-style-to'), {
            value: this.figureStyle.edge.symbol[1],
            onChanged: function onChanged(inputVal) {
                _this.figureStyle.edge.symbol[1] = inputVal;
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        });
        this._widgetList.push(edgeStyleToSelectorWidget);
    }
    if (this.figureStyle.edge.size) {
        var edgeSizeToSelectorWidget = WidgetFactory.createMarkerSizeSelectorWidget($edgeComponentContents.find('.bo-component-figure-edge-size-to'), {
            type: 'number',
            value: this.figureStyle.edge.size[1] - 9,
            onChanged: function onChanged(inputVal) {
                _this.figureStyle.edge.size[1] = inputVal + 9;
                _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
            }
        });
        this._widgetList.push(edgeSizeToSelectorWidget);
    }
};

exports.default = FigureControl;

/***/ }),
/* 624 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function TitleControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

TitleControl.prototype = Object.create(_baseControl2.default.prototype);
TitleControl.prototype.constructor = TitleControl;

TitleControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.titleOption = this.options.chartOption.title;
};

TitleControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        showBtn: {
            defaultVal: this.titleOption.show,
            clickfunc: function clickfunc(event) {
                var checkedVal = event.args.checked;
                _this.toggleDisableComponent(checkedVal);
                _this.titleOption.show = checkedVal;
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

TitleControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createValueComponent();
    this._createFontStyleComponent();
    this._createAlignComponent();
    this._createSubtitleComponent();
    this._createSubtitleFontStyleComponent();
};

TitleControl.prototype._createValueComponent = function () {
    var _this = this;
    this.titleInput = WidgetFactory.createInputWidget(this.$controlContents, {
        labelPosition: 'column',
        inputStyle: 'line',
        value: this.titleOption.text,
        label: 'Value',
        onChanged: function onChanged(inputVal) {
            _this.titleOption.text = inputVal;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }
    });
    this._widgetList.push(this.titleInput);
};

TitleControl.prototype._createFontStyleComponent = function () {
    var _this = this;
    this.$controlContents.append($('<div class="bos-widget-row-separator"/>'));
    this.fontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        value: [this.titleOption.textStyle.fontFamily, this.titleOption.textStyle.fontSize, this.titleOption.textStyle.color, [this.titleOption.textStyle.fontWeight, this.titleOption.textStyle.fontStyle, this.titleOption.textStyle.textDecoration]],
        onChanged: [function (inputVal) {
            _this.titleOption.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }, function (inputVal) {
            _this.titleOption.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }, function (inputVal) {
            _this.titleOption.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }, function (selectedVals) {
            _this.titleOption.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.titleOption.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.titleOption.textStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }]
    });
    this._widgetList.push(this.fontStyle);
};

TitleControl.prototype._createAlignComponent = function () {
    var _this = this;

    var $alignComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Align</div>' + '   <div class="bo-component-title-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($alignComponent);
    var $alignComponentContents = $alignComponent.find('.bo-component-title-contents');

    this.horizontalAlign = WidgetFactory.createHorizontalAlignRadioButtonWidget($alignComponentContents, {
        value: this._getHorizontalAlignValue(this.titleOption),
        onChanged: function onChanged(selectedValue) {
            if (selectedValue === 'left') {
                _this.titleOption.left = 0;
                _this.titleOption.right = 'auto';
            } else if (selectedValue === 'center') {
                _this.titleOption.left = '50%';
                _this.titleOption.right = 'auto';
            } else if (selectedValue === 'right') {
                _this.titleOption.left = 'auto';
                _this.titleOption.right = 0;
            }
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }
    });
    this._widgetList.push(this.horizontalAlign);
};

TitleControl.prototype._getHorizontalAlignValue = function (titleOption) {
    //POLICY: left가 right보다 우선순위가 높다.
    if (titleOption.left == 0 || titleOption.left === '0px') {
        return 'left';
    } else if (titleOption.left === '50%') {
        return 'center';
    } else if (titleOption.right == 0 || titleOption.right === '0px') {
        return 'right';
    }
    return 'center';
};

TitleControl.prototype.toggleDisableComponent = function (checkedVal) {
    this.titleInput.toggleDisable(!checkedVal);
    this.fontStyle.toggleDisable(!checkedVal);
    this.horizontalAlign.toggleDisable(!checkedVal);
    this.subtitleInput.toggleDisable(!checkedVal);
    this.subtitlefontStyle.toggleDisable(!checkedVal);
};

TitleControl.prototype._createSubtitleComponent = function () {
    var _this = this;
    this.$controlContents.append($('<div class="bos-widget-row-separator"/>'));
    this.$controlContents.append($('<div class="bo-widget-header bos-widget-header">Subtitle</div>'));
    var $subTitleContent = $('<div class="bo-control-subcontents bos-control-subcontents"></div>');
    this.subtitleInput = WidgetFactory.createInputWidget($subTitleContent, {
        labelPosition: 'column',
        inputStyle: 'line',
        value: this.titleOption.subtext,
        label: 'Value',
        onChanged: function onChanged(inputVal) {
            _this.titleOption.subtext = inputVal;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }
    });
    this._widgetList.push(this.subtitleInput);

    $subTitleContent.append($('<div class="bos-widget-row-separator"/>'));
    this.subtitlefontStyle = WidgetFactory.createFontStyleWidget($subTitleContent, {
        value: [this.titleOption.subtextStyle.fontFamily, this.titleOption.subtextStyle.fontSize, this.titleOption.subtextStyle.color, [this.titleOption.subtextStyle.fontWeight, this.titleOption.subtextStyle.fontStyle, this.titleOption.subtextStyle.textDecoration]],
        onChanged: [function (inputVal) {
            _this.titleOption.subtextStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }, function (inputVal) {
            _this.titleOption.subtextStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }, function (inputVal) {
            _this.titleOption.subtextStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }, function (selectedVals) {
            _this.titleOption.subtextStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.titleOption.subtextStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.titleOption.subtextStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.options.onChanged('onChartOptionChanged', { title: _this.titleOption });
        }]
    });
    this._widgetList.push(this.subtitlefontStyle);

    this.$controlContents.append($subTitleContent);
};

TitleControl.prototype._createSubtitleFontStyleComponent = function () {
    var _this = this;
};

TitleControl.prototype.render = function () {
    var changedTitleOption = this.options.chartOption.title;

    this.headerShowBtn.render(changedTitleOption.show);
    this.titleInput.render(changedTitleOption.text);
    this.fontStyle.render([changedTitleOption.textStyle.fontFamily, changedTitleOption.textStyle.fontSize, changedTitleOption.textStyle.color, [changedTitleOption.textStyle.fontWeight, changedTitleOption.textStyle.fontStyle, changedTitleOption.textStyle.textDecoration]]);
    this.horizontalAlign.render(this._getHorizontalAlignValue(changedTitleOption));
    this.subtitleInput.render(changedTitleOption.subtext);
    this.subtitlefontStyle.render([changedTitleOption.subtextStyle.fontFamily, changedTitleOption.subtextStyle.fontSize, changedTitleOption.subtextStyle.color, [changedTitleOption.subtextStyle.fontWeight, changedTitleOption.subtextStyle.fontStyle, changedTitleOption.subtextStyle.textDecoration]]);
};

exports.default = TitleControl;

/***/ }),
/* 625 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _columnSelectControl = __webpack_require__(274);

var _columnSelectControl2 = _interopRequireDefault(_columnSelectControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function MapSelectControl(parentId, options, headerKey) {
    _columnSelectControl2.default.call(this, parentId, options, headerKey);
}

MapSelectControl.prototype = Object.create(_columnSelectControl2.default.prototype);
MapSelectControl.prototype.constructor = MapSelectControl;

MapSelectControl.prototype.createComponentContents = function (contentsOption) {
    _columnSelectControl2.default.prototype.createComponentContents.call(this);
    var _this = this;
    //todo select map
    this._createMapTypeSelectorContent();
};

MapSelectControl.prototype._createMapTypeSelectorContent = function () {
    var _this = this;
    var chartTypeSelectorWidget = WidgetFactory.createItemSelectorWidget(_this.$controlContents, {
        label: 'Map Type',
        value: this.options.chartOption.plotOptions.map.mapName,
        placeHolder: 'Select Map',
        source: this.options.setting.mapList,
        onChanged: function onChanged(inputVal) {
            _this.options.chartOption.plotOptions.map.mapName = inputVal;
            var newOptions = _this.options.chartOptionAPI.setChartOptions(_this.options.chartOption);
            _this.options.onChanged('onChartOptionChanged', newOptions);
        }
    });
    this._widgetList.push(chartTypeSelectorWidget);
};

exports.default = MapSelectControl;

/***/ }),
/* 626 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function AreaControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

AreaControl.prototype = Object.create(_baseControl2.default.prototype);
AreaControl.prototype.constructor = AreaControl;

AreaControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);

    //TODO: area 여러개 되면 하드코딩 삭제할것.
    this.areaSetting = this.options.setting.areaSettings[0];
    var areaRef = this.areaSetting.ref;
    this.normalStyle = areaRef.itemStyle.normal;
    this.hoverStyle = areaRef.itemStyle.emphasis;
};

AreaControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var headerOption = {
        label: this.areaSetting.label
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
};

AreaControl.prototype.createComponentContents = function () {
    _baseControl2.default.prototype.createComponentContents.call(this);
    this._createAreaColorComponent();
    this._createBorderComponent();
};

AreaControl.prototype._createAreaColorComponent = function () {
    var $areaColorComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Color</div>' + '   <div class="bo-component-frame-contents bos-display-flex">' + '       <div class="bo-component-frame-background-color bos-flex-1"></div>' + '       <div class="bo-component-frame-background-opacity bos-flex-1"></div>' + '   </div>' + '</div>');

    this.$controlContents.append($areaColorComponent);
    var $areaColorComponentContents = $areaColorComponent.find('.bo-component-frame-contents');

    var _this = this;

    var colorPickerWidget = WidgetFactory.createColorPickerWidget($areaColorComponentContents.find('.bo-component-frame-background-color'), {
        width: '50px',
        height: '30px',
        value: this.normalStyle.areaColor,
        onChanged: function onChanged(color) {
            _this.normalStyle.areaColor = color;
            _this.hoverStyle.areaColor = color;
            // _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(colorPickerWidget);

    var opacitySelectorWidget = WidgetFactory.createOpacitySelectorWidget($areaColorComponentContents.find('.bo-component-frame-background-opacity'), {
        value: this.normalStyle.opacity,
        onChanged: function onChanged(opacity) {
            _this.normalStyle.opacity = opacity;
            // _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(opacitySelectorWidget);
};

AreaControl.prototype._createBorderComponent = function () {
    var _this = this;
    var lineStyleWidget = WidgetFactory.createLineStyleWidget(this.$controlContents, {
        label: 'Border',
        value: [this.normalStyle.borderWidth, this.normalStyle.borderColor, this.normalStyle.borderType],
        onChanged: [function (inputVal) {
            _this.normalStyle.borderWidth = inputVal;
            // _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (changedColor) {
            _this.normalStyle.borderColor = changedColor;
            // _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }, function (inputVal) {
            _this.normalStyle.borderType = inputVal;
            // _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }]
    });

    this._widgetList.push(lineStyleWidget);
};

exports.default = AreaControl;

/***/ }),
/* 627 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

var _chartOptionConst = __webpack_require__(17);

var _chartOptionConst2 = _interopRequireDefault(_chartOptionConst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */
function LayersControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

LayersControl.prototype = Object.create(_baseControl2.default.prototype);
LayersControl.prototype.constructor = LayersControl;

LayersControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.layoutSetting = [{
        key: 'point',
        label: 'Point'
    }, {
        key: 'lines',
        label: 'Line'
    }];
    this.layers = this.options.chartOption.plotOptions.map.layers;
};

LayersControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;

    this.layoutSetting.forEach(function (layersSetting, index) {
        _this.createComponent(layersSetting);
        if (index !== _this.layoutSetting.length - 1) {
            _this.$controlMain.append($('<div class="bos-widget-row-separator"/>'));
        }
    });
};

LayersControl.prototype.createComponent = function (layersSetting) {
    var _this = this;
    var headerOption = {
        label: layersSetting.label + ' Layers',
        additionalType: layersSetting.key,
        addBtn: {
            clickfunc: function clickfunc() {
                var newContentsOpt = _this.options.setting.getDefaultColumnOption(layersSetting.key);
                _this.layers.push(newContentsOpt);
                var $axisControlContents = $(this).closest('.bo-control').find('.bo-control-contents[type=' + layersSetting.key + ']');
                _this._createComponent($axisControlContents, layersSetting.key, _this.layers.length - 1);

                _this.setExpanderPreview.call(_this);
                // _this.options.onChanged('onChartOptionChanged', {plotOptions: _this.options.chartOption.plotOptions});
            }
        }
    };
    this.createComponentHeader(headerOption);

    this.createComponentContents(layersSetting.key);
};

LayersControl.prototype.createComponentContents = function (layersKey) {
    _baseControl2.default.prototype.createComponentContents.call(this);
    this.$controlContents.removeClass('bos-control-contents');
    this.$controlContents.attr('type', layersKey);
    var $layersControlContents = this.$controlContents;

    var _this = this;

    for (var i = 0; i < this.layers.length; i++) {
        var layer = this.layers[i];
        if (layer.type === layersKey) {
            _this._createComponent($layersControlContents, layersKey, i);
        }
    }
};

LayersControl.prototype._createComponent = function ($control, layersKey, layerIndex) {
    var $component = $('<div class = "bo-control-contents-component bos-control-contents bos-deletable-component"></div>');
    $control.append($component);

    this._createDeleteButton($component, layerIndex);
    this._createColumnSelectorComponent($component, layersKey, layerIndex);
};

LayersControl.prototype._createDeleteButton = function ($component, layerIndex) {
    var $deleteButton = $('<div class="bos-delete-btn"></div>');
    $component.append($deleteButton);

    $deleteButton.data('_refLayer', this.layers[layerIndex]);

    var _this = this;
    $deleteButton.click(function (event) {
        event.stopPropagation();
        for (var e in _this.layers) {
            if ($(this).data('_refLayer') == _this.layers[e]) layerIndex = e;
        }
        _this.layers.splice(layerIndex, 1);
        _this.setExpanderPreview.call(_this);
        $component.remove();
        var callbackParam = {
            plotOptions: {
                map: {
                    layers: _this.layers
                }
            }
        };

        _this.options.onChanged('onChartOptionChanged', callbackParam);
    });
};

LayersControl.prototype._createColumnSelectorComponent = function ($component, layersKey, layerIndex) {
    var _this = this;
    var columnSelector = this.options.setting.columnSelector(layerIndex);
    for (var chartIdx = 0; chartIdx < columnSelector.length; chartIdx++) {

        columnSelector[chartIdx].forEach(function (columnSettings) {
            _this._createColumnSelectorContent($component, columnSettings, chartIdx);
        });
    }
};

LayersControl.prototype._createColumnSelectorContent = function ($component, columnSettings, sourceIndex) {
    var _this = this;
    var widgetOptions = {
        selected: columnSettings.ref.selected, //[{name: 'SepalLength', aggregation: 'none' }],
        multiple: columnSettings.multiple ? columnSettings.multiple : false,
        multipleMaxCnt: columnSettings.multipleMaxCnt,
        aggregationEnabled: columnSettings.aggregationEnabled ? columnSettings.aggregationEnabled : false,
        aggregationMap: columnSettings.aggregationMap ? columnSettings.aggregationMap : {},
        label: columnSettings.label,
        getColumns: this._getColumnList.bind(this, columnSettings, sourceIndex),
        getAllColumns: this._getAllColumnList.bind(this, sourceIndex),
        problemKeyList: ['axis-001', 'axis-002', 'axis-003', 'axis-004', 'axis-005'],
        chartOption: this.options.chartOption,
        onChanged: function onChanged(changedColumnInfo) {
            columnSettings.ref.selected = changedColumnInfo;
            // _this.setExpanderPreview.call(_this);

            var callbackParam = {
                plotOptions: {
                    map: {
                        layers: _this.layers
                    }
                }
            };

            _this.options.onChanged('onChartOptionChanged', callbackParam);
        }
    };
    var columnSelectorWidget = WidgetFactory.createColumnSelectorWidget($component, widgetOptions);
    this._widgetList.push(columnSelectorWidget);
};

//column list filtered by type
LayersControl.prototype._getColumnList = function (columnSettings, sourceIndex) {
    var columnList = this._getAllColumnList(sourceIndex);

    if (columnList && columnSettings.columnType) {
        columnList = columnList.filter(function (column) {
            return columnSettings.columnType.indexOf(column.type) > -1;
        });
    }

    if (columnSettings.axisTypeList && $.isArray(columnSettings.axisTypeList)) {
        columnList = $.merge(_chartOptionConst2.default.EXTRA_AXIS_TYPE_LIST.filter(function (defAxisType) {
            return $.inArray(defAxisType.value, columnSettings.axisTypeList) > -1;
        }), columnList);
    }

    return columnList;
};

LayersControl.prototype._getAllColumnList = function (sourceIndex) {
    return ChartOptionUtil.getAllColumnList(this.options.chartOption, sourceIndex);
};

LayersControl.prototype.renderWarning = function () {
    var _this = this;
    // var _conceal = function (axis) {
    //     _this.$controlMain.find('.bo-control-header[type="' + axis + '"]').css({display: 'none'});
    //     _this.$controlMain.find('.bo-control-contents[type="' + axis + '"]').css({display: 'none'});
    //     _this.$controlMain.find('.bos-widget-row-separator').css({display: 'none'});
    //
    //     for (var i = 0; i < _this.stripLineData[axis].length; i++) {
    //         _this.stripLineData[axis][i].display = false;
    //     }
    // };
    // var _show = function (axis) {
    //     _this.$controlMain.find('.bo-control-header[type="' + axis + '"]').css({display: 'flex'});
    //     _this.$controlMain.find('.bo-control-contents[type="' + axis + '"]').css({display: 'block'});
    //     _this.$controlMain.find('.bos-widget-row-separator').css({display: 'block'});
    //     for (var i = 0; i < _this.stripLineData[axis].length; i++) {
    //         _this.stripLineData[axis][i].display = true;
    //     }
    // };
    //
    // var chkAxis = ['xAxis', 'yAxis'];
    // var warning = this.options.warningList;
    // for (var i = 0; i < chkAxis.length; i++) {
    //     if (warning && warning.length > 0 && warning[0].target == chkAxis[i]) {
    //         _conceal(chkAxis[i]);
    //     } else {
    //         _show(chkAxis[i])
    //     }
    // }
    // this.setExpanderPreview();
};

exports.default = LayersControl;

/***/ }),
/* 628 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function LabelControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

LabelControl.prototype = Object.create(_baseControl2.default.prototype);
LabelControl.prototype.constructor = LabelControl;

LabelControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.labelOption = this.options.setting.labelSettings;
};

LabelControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);
    var _this = this;
    for (var labelSettingIdx = 0; labelSettingIdx < this.labelOption.length; labelSettingIdx++) {
        var labelSetting = this.labelOption[labelSettingIdx];
        this._createLabelContents($parent, labelSetting, labelSettingIdx);
    }
};

LabelControl.prototype._createLabelContents = function ($parent, labelSetting, labelSettingIdx) {
    var _this = this;
    var headerOption = {
        label: labelSetting.label
    };

    if (labelSetting.showBtn) {
        headerOption.showBtn = {
            defaultVal: labelSetting.ref.show,
            clickfunc: function clickfunc(event) {
                var checkedVal = event.args.checked;
                _this.toggleDisableComponent(checkedVal, labelSettingIdx);
                labelSetting.ref.show = checkedVal;
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', labelSetting.getLabelChangedOption(labelSetting.ref));
            }
        };
    }

    this.createComponentHeader(headerOption);
    this.createComponentContents(labelSetting);
    this.setComponentShow(labelSettingIdx);
};

LabelControl.prototype.createComponentContents = function (labelSetting) {
    _baseControl2.default.prototype.createComponentContents.call(this, labelSetting);

    this._createFontStyleComponent(labelSetting);
};

LabelControl.prototype._createFontStyleComponent = function (labelSetting) {
    var _this = this;
    var fontStyleWidget = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        fontStyleBtnList: ['bold', 'italic'],
        value: [labelSetting.ref.textStyle.fontFamily, labelSetting.ref.textStyle.fontSize, labelSetting.ref.textStyle.color, [labelSetting.ref.textStyle.fontWeight, labelSetting.ref.textStyle.fontStyle]],
        onChanged: [function (inputVal) {
            labelSetting.ref.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', labelSetting.getLabelChangedOption(labelSetting.ref));
        }, function (inputVal) {
            labelSetting.ref.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', labelSetting.getLabelChangedOption(labelSetting.ref));
        }, function (inputVal) {
            labelSetting.ref.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', labelSetting.getLabelChangedOption(labelSetting.ref));
        }, function (selectedVals) {
            labelSetting.ref.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            labelSetting.ref.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.options.onChanged('onChartOptionChanged', labelSetting.getLabelChangedOption(labelSetting.ref));
        }]
    });

    this._widgetList.push(fontStyleWidget);
};

LabelControl.prototype.setComponentShow = function (labelSettingIdx) {
    if (this.headerShowBtn && !this.headerShowBtn.getValue()) {
        this.toggleDisableComponent(false, labelSettingIdx);
    }
};

//header show버튼이 각 component별로 작동해야함. 특이한 경우라서 overriding해줌
LabelControl.prototype.toggleDisableComponent = function (checkedVal, labelSettingIdx) {
    this._widgetList[labelSettingIdx].toggleDisable(!checkedVal);
};

exports.default = LabelControl;

/***/ }),
/* 629 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by koha.son on 2018-05-23.
 */

function AxisScaleControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

AxisScaleControl.prototype = Object.create(_baseControl2.default.prototype);
AxisScaleControl.prototype.constructor = AxisScaleControl;

AxisScaleControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.xAxisOption = this.options.chartOption.xAxis;
    this.yAxisOption = this.options.chartOption.yAxis;
    this.scaleOpt = this.options.setting.scaleOpt;
    this.onZeroOpt = this.options.setting.onZeroOpt;
};

AxisScaleControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        label: 'Scale & Axis on Zero'
    };
    if (typeof this.scaleOpt == 'undefined' && typeof this.onZeroOpt == 'undefined') return;
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

AxisScaleControl.prototype.createComponentContents = function (contentsOption) {

    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);
    this._createValueComponent();
};

AxisScaleControl.prototype._createValueComponent = function () {
    var _this = this;
    var $valueComponent = $('');
    this.$controlContents.append($valueComponent);
    var opt_scale = {
        header: 'Scale',
        warningKeyList: ['axis-002'],
        value: function () {
            var list = [];
            if (_this.xAxisOption[0].scale) list.push('xaxis');
            if (_this.yAxisOption[0].scale) list.push('yaxis');
            return list;
        }.call(this),
        _buttonList: function () {
            var list = [];
            for (var element in _this.scaleOpt) {
                if (_this.scaleOpt[element] == 'xaxis') list.push({
                    label: 'X-Axis',
                    value: 'xaxis'
                });
                if (_this.scaleOpt[element] == 'yaxis') list.push({
                    label: 'Y-Axis',
                    value: 'yaxis'
                });
            }
            return list;
        }.call(this),
        onChanged: function onChanged(inputVal) {
            _this.xAxisOption[0].scale = false;
            _this.yAxisOption[0].scale = false;
            for (var element in inputVal) {
                if (inputVal[element] == 'xaxis') _this.xAxisOption[0].scale = true;else if (inputVal[element] == 'yaxis') _this.yAxisOption[0].scale = true;
            }
            _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption });
        }
    };

    if (_this.scaleOpt != undefined && _this.scaleOpt.length > 0) {
        var scaleCheckWidget = WidgetFactory.createAxisToggleButtonWidget(this.$controlContents, opt_scale);
        this._widgetList.push(scaleCheckWidget);
    }

    var opt_onzero = {
        header: 'OnZero',
        warningKeyList: ['axis-002'],
        _buttonList: function () {
            var list = [];
            for (var element in _this.onZeroOpt) {
                if (_this.onZeroOpt[element] == 'xaxis') list.push({
                    label: 'X-Axis',
                    value: 'xaxis'
                });
                if (_this.onZeroOpt[element] == 'yaxis') list.push({
                    label: 'Y-Axis',
                    value: 'yaxis'
                });
            }
            return list;
        }.call(this),
        value: function () {
            var list = [];
            if (_this.xAxisOption[0].axisLine.onZero) list.push('xaxis');
            if (_this.yAxisOption[0].axisLine.onZero) list.push('yaxis');
            return list;
        }.call(this),
        onChanged: function onChanged(inputVal) {
            //['yaxis','xaxis']
            _this.xAxisOption[0].axisLine.onZero = false;
            _this.yAxisOption[0].axisLine.onZero = false;
            for (var element in inputVal) {
                if (inputVal[element] == 'xaxis') _this.xAxisOption[0].axisLine.onZero = true;else if (inputVal[element] == 'yaxis') _this.yAxisOption[0].axisLine.onZero = true;
            }
            _this.options.onChanged('onChartOptionChanged', { xAxis: _this.xAxisOption,
                yAxis: _this.yAxisOption });
        }
    };
    if (_this.onZeroOpt != undefined && _this.onZeroOpt.length > 0) {
        var onZeroCheckWidget = WidgetFactory.createAxisToggleButtonWidget(this.$controlContents, opt_onzero);
        this._widgetList.push(onZeroCheckWidget);
    }
};

AxisScaleControl.prototype.renderWarning = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderWarning(_this.options.warningList);
    });
};

exports.default = AxisScaleControl;

/***/ }),
/* 630 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function ToolTipTriggerControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

ToolTipTriggerControl.prototype = Object.create(_baseControl2.default.prototype);
ToolTipTriggerControl.prototype.constructor = ToolTipTriggerControl;

ToolTipTriggerControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
};

ToolTipTriggerControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    this.createComponentContents();
};

ToolTipTriggerControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createBehaviorComponent();
    this._createTriggerComponent();
};

ToolTipTriggerControl.prototype._createBehaviorComponent = function () {
    var _this = this;

    var $directionComponent = $('' + '<div>' + '   <div class="bo-component-header">ToolTip Show</div>' + '   <div class="bo-component-legend-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($directionComponent);
    var $directionComponentContents = $directionComponent.find('.bo-component-legend-contents');

    this.tooltipBehavior = WidgetFactory.createToolTipBehaviorRadioButtonWidget($directionComponentContents, {
        value: this.options.chartOption.tooltip.triggerOn,
        onChanged: function onChanged(inputValue) {
            _this.options.chartOption.tooltip.triggerOn = inputValue;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { tooltip: { triggerOn: inputValue } });
        }
    });
    this._widgetList.push(this.tooltipBehavior);
};

ToolTipTriggerControl.prototype._createTriggerComponent = function () {
    var _this = this;

    var $directionComponent = $('' + '<div>' + '   <div class="bo-component-header">ToolTip Target</div>' + '   <div class="bo-component-legend-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($directionComponent);
    var $directionComponentContents = $directionComponent.find('.bo-component-legend-contents');

    this.tooltipTrigger = Brightics.Chart.Adonis.Component.Widgets.Factory.createToolTipTriggerRadioButtonWidget($directionComponentContents, {
        value: this.options.setting.tooltip.trigger,
        onChanged: function onChanged(inputValue) {
            _this.options.setting.tooltip.trigger = inputValue;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: _this.options.chartOption.plotOptions });
        }
    });
    this._widgetList.push(this.tooltipTrigger);
};

ToolTipTriggerControl.prototype.render = function () {
    var changedTitleOption = this.options.chartOption.tooltip;
};

exports.default = ToolTipTriggerControl;

/***/ }),
/* 631 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by mk90.kim on 2017-05-10.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var GridControl = function (_BaseControl) {
    _inherits(GridControl, _BaseControl);

    function GridControl(parentId, options, headerKey) {
        _classCallCheck(this, GridControl);

        return _possibleConstructorReturn(this, (GridControl.__proto__ || Object.getPrototypeOf(GridControl)).call(this, parentId, options, headerKey));
    }

    _createClass(GridControl, [{
        key: '_init',
        value: function _init() {
            _get(GridControl.prototype.__proto__ || Object.getPrototypeOf(GridControl.prototype), '_init', this).call(this, this);
            this.gridOption = this.options.chartOption.grid;
        }
    }, {
        key: '_createContents',
        value: function _createContents($parent) {
            _get(GridControl.prototype.__proto__ || Object.getPrototypeOf(GridControl.prototype), '_createContents', this).call(this, $parent);
            // this.createComponentHeader(headerOption);
            this.createComponentContents();
        }
    }, {
        key: 'createComponentContents',
        value: function createComponentContents(contentsOption) {
            _get(GridControl.prototype.__proto__ || Object.getPrototypeOf(GridControl.prototype), 'createComponentContents', this).call(this, contentsOption);
            this._createRowColumnComponents(contentsOption);
            this._createCellComponents(contentsOption);
        }
    }, {
        key: '_createRowColumnComponents',
        value: function _createRowColumnComponents(contentsOption) {
            var _this2 = this;

            var $valueComponent = $('<div class="bos-widget-row-separator"></div>');
            var self = this;
            this.$controlContents.append($valueComponent);
            this._widgetList = this._widgetList.concat([WidgetFactory.createMultiLabelWidget($valueComponent, {
                label: ' ',
                numOfComponent: 1,
                value: ['Value'],
                helper: [false]
            }), WidgetFactory.createNumberInputWidget($valueComponent, {
                label: 'Row',
                value: this.gridOption.row,
                onChanged: function onChanged(value) {
                    self.gridOption.row = value;
                    self.options.onChanged('onChartOptionChanged', {
                        grid: _this2.gridOption
                    });
                }
            }), WidgetFactory.createNumberInputWidget($valueComponent, {
                label: 'Column',
                value: this.gridOption.column,
                onChanged: function onChanged(value) {
                    self.gridOption.column = value;
                    self.options.onChanged('onChartOptionChanged', {
                        grid: _this2.gridOption
                    });
                }
            })]);
        }
    }, {
        key: '_createCellComponents',
        value: function _createCellComponents(contentsOption) {
            var _this3 = this;

            var $valueComponent = $('<div class="bos-widget-row-separator"></div>');
            var self = this;
            this.$controlContents.append($valueComponent);
            this._widgetList = this._widgetList.concat([WidgetFactory.createMultiLabelWidget($valueComponent, {
                label: ' ',
                numOfComponent: 1,
                value: ['Value'],
                helper: [false]
            })]);

            this.useCellWidth = WidgetFactory.createCheckedMultiInputWidget($valueComponent, {
                label: 'Width',
                labelPosition: 'row',
                labelWidth: '40px',
                inputStyle: 'box',
                numOfComponent: 1,
                placeHolder: [''],
                value: [this.gridOption.cellWidth],
                inputType: ['number'],
                onChanged: [function (val) {
                    self.gridOption.cellWidth = val;
                    self.options.onChanged('onChartOptionChanged', {
                        grid: _this3.gridOption
                    });
                }],
                showBtn: {
                    defaultVal: this.gridOption.useCellWidth,
                    clickfunc: function clickfunc(e) {
                        var checkedVal = e.args.checked;
                        self.gridOption.useCellWidth = checkedVal;
                        self.useCellWidth.toggleDisable(!checkedVal, true);
                        self.options.onChanged('onChartOptionChanged', {
                            grid: self.gridOption
                        });
                    }
                }
            });

            this.useCellHeight = WidgetFactory.createCheckedMultiInputWidget($valueComponent, {
                label: 'Heigh',
                labelPosition: 'row',
                labelWidth: '40px',
                inputStyle: 'box',
                numOfComponent: 1,
                placeHolder: [''],
                value: [this.gridOption.cellWidth],
                inputType: ['number'],
                onChanged: [function (val) {
                    self.gridOption.cellHeight = val;
                    self.options.onChanged('onChartOptionChanged', {
                        grid: _this3.gridOption
                    });
                }],
                showBtn: {
                    defaultVal: this.gridOption.useCellHeight,
                    clickfunc: function clickfunc(e) {
                        var checkedVal = e.args.checked;
                        self.gridOption.useCellHeight = checkedVal;
                        self.useCellHeight.toggleDisable(!checkedVal, true);
                        self.options.onChanged('onChartOptionChanged', {
                            grid: self.gridOption
                        });
                    }
                }
            });

            this.gridShow = WidgetFactory.createOnOffSwitchWidget($valueComponent, {
                label: 'Show Grid',
                value: self.gridOption.showImageGrid,
                onChanged: function onChanged(val) {
                    self.gridOption.showImageGrid = val;
                    self.options.onChanged('onChartOptionChanged', {
                        grid: self.gridOption
                    });
                }
            });

            this._widgetList = this._widgetList.concat(this.useCellWidth, this.useCellHeight, this.gridShow);
        }
    }]);

    return GridControl;
}(_baseControl2.default);

exports.default = GridControl;

/***/ }),
/* 632 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by mk90.kim on 2017-05-10.
 */

function CustomLegendControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

CustomLegendControl.prototype = Object.create(_baseControl2.default.prototype);
CustomLegendControl.prototype.constructor = CustomLegendControl;

CustomLegendControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.legendOption = this.options.chartOption.legend;
};

CustomLegendControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        showBtn: {
            defaultVal: this.legendOption.show,
            clickfunc: function clickfunc(event) {
                var checkedVal = event.args.checked;
                _this.toggleDisableComponent(checkedVal);
                _this.legendOption.show = checkedVal;
                _this.setExpanderPreview.call(_this);
                _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
            }
        }
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

CustomLegendControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createAlignComponent();
    this._createDirectionComponent();
    this._createFontStyleComponent();
};

CustomLegendControl.prototype._createAlignComponent = function () {
    var _this = this;

    var $alignComponent = $('\n        <div class="bos-widget-row-separator">\n          <div class="bo-component-header">\n            Align\n          </div>\n          <div class="bo-component-legend-contents">\n          </div>\n        </div>\n    ');

    this.$controlContents.append($alignComponent);
    var $alignComponentContents = $alignComponent.find('.bo-component-legend-contents');

    //POLICY: left가 right보다 우선순위가 높다.
    //POLICY: top이 bottom보다 우선순위가 높다.
    var horizontalAlignValue = function () {
        if (_this.legendOption.left == 0 || _this.legendOption.left === '0px') {
            return 'left';
        } else if (_this.legendOption.left === '50%') {
            return 'center';
        } else if (_this.legendOption.right == 0 || _this.legendOption.right === '0px') {
            return 'right';
        } else {
            _this.legendOption.left = 0;
            return 'center';
        }
    }();
    var verticalAlignValue = function () {
        if (_this.legendOption.top == 10 || _this.legendOption.top === '10px') {
            return 'top';
        } else if (_this.legendOption.top === '50%') {
            return 'center';
        } else if (_this.legendOption.bottom == 0 || _this.legendOption.bottom === '0px') {
            return 'bottom';
        } else {
            _this.legendOption.top = 10;
            return 'top';
        }
    }();

    this.horizontalAlign = WidgetFactory.createCustomHorizontalAlignRadioButtonWidget($alignComponentContents, {
        value: {
            align: horizontalAlignValue,
            value: this.legendOption.horizontalMargin !== 'auto' && this.legendOption.horizontalMargin || '0'
        },
        onChanged: function onChanged(val) {
            var selectedValue = val.align;
            _this.legendOption.horizontalMargin = val.value;
            if (selectedValue === 'left') {
                _this.legendOption.left = 0;
                _this.legendOption.right = 'auto';
            } else if (selectedValue === 'center') {
                _this.legendOption.left = '50%';
                _this.legendOption.right = 'auto';
            } else if (selectedValue === 'right') {
                _this.legendOption.left = 'auto';
                _this.legendOption.right = 0;
            }
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }
    });
    this._widgetList.push(this.horizontalAlign);

    this.verticalAlign = WidgetFactory.createCustomVerticalAlignRadioButtonWidget($alignComponentContents, {
        value: {
            align: verticalAlignValue,
            value: this.legendOption.verticalMargin !== 'auto' && this.legendOption.verticalMargin || '0'
        },
        onChanged: function onChanged(val) {
            var selectedValue = val.align;
            _this.legendOption.verticalMargin = val.value;
            if (selectedValue === 'top') {
                _this.legendOption.top = 10;
                _this.legendOption.bottom = 'auto';
            } else if (selectedValue === 'center') {
                _this.legendOption.top = '50%';
                _this.legendOption.bottom = 'auto';
            } else if (selectedValue === 'bottom') {
                _this.legendOption.top = 'auto';
                _this.legendOption.bottom = 0;
            }
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }
    });
    this._widgetList.push(this.verticalAlign);
};

CustomLegendControl.prototype._createDirectionComponent = function () {
    var _this = this;

    var $directionComponent = $('' + '<div class="bos-widget-row-separator">' + '   <div class="bo-component-header">Direction</div>' + '   <div class="bo-component-legend-contents">' + '   </div>' + '</div>');

    this.$controlContents.append($directionComponent);
    var $directionComponentContents = $directionComponent.find('.bo-component-legend-contents');

    this.direction = WidgetFactory.createDirectionRadioButtonWidget($directionComponentContents, {
        value: this.legendOption.orientation,
        onChanged: function onChanged(inptValue) {
            _this.legendOption.orientation = inptValue;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }
    });
    this._widgetList.push(this.direction);
};

CustomLegendControl.prototype._createFontStyleComponent = function () {
    var _this = this;
    this.$controlContents.append($('<div class="bos-widget-row-separator"/>'));
    this.fontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        value: [this.legendOption.textStyle.fontFamily, this.legendOption.textStyle.fontSize, this.legendOption.textStyle.color, [this.legendOption.textStyle.fontWeight, this.legendOption.textStyle.fontStyle, this.legendOption.textStyle.textDecoration]],
        onChanged: [function (inputVal) {
            _this.legendOption.textStyle.fontFamily = inputVal;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }, function (inputVal) {
            _this.legendOption.textStyle.fontSize = inputVal;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }, function (inputVal) {
            _this.legendOption.textStyle.color = inputVal;
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }, function (selectedVals) {
            _this.legendOption.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.legendOption.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.legendOption.textStyle.textDecoration = $.inArray('underline', selectedVals) > -1 ? 'underline' : 'none';
            _this.options.onChanged('onChartOptionChanged', { legend: _this.legendOption });
        }]
    });
    this._widgetList.push(this.fontStyle);
};

CustomLegendControl.prototype.toggleDisableComponent = function (checkedVal) {
    this.horizontalAlign.toggleDisable(!checkedVal);
    this.verticalAlign.toggleDisable(!checkedVal);
    this.direction.toggleDisable(!checkedVal);
    this.fontStyle.toggleDisable(!checkedVal);
};

exports.default = CustomLegendControl;

/***/ }),
/* 633 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisRadarViewRangeControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
}

AxisRadarViewRangeControl.prototype = Object.create(_baseControl2.default.prototype);
AxisRadarViewRangeControl.prototype.constructor = AxisRadarViewRangeControl;

AxisRadarViewRangeControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.range = this.options.chartOption.plotOptions.radar;
};

AxisRadarViewRangeControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var headerOption = {
        label: 'View Range'
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents($parent);
};

AxisRadarViewRangeControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    var multiLabelWidget = WidgetFactory.createMultiLabelWidget(this.$controlContents, {
        label: ' ',
        numOfComponent: 1,
        value: ['Value']
    });

    this._widgetList.push(multiLabelWidget);

    var _this = this;
    var viewRangeInputMin = WidgetFactory.createMultiInputWidget(this.$controlContents, {
        label: 'Min',
        labelPosition: 'row',
        inputStyle: 'box',
        numOfComponent: 1,
        value: [this.range.min],
        inputType: ['number'],
        problemKeyList: ['value-001'],
        onChanged: [function (inputVal) {
            _this.range.min = inputVal || inputVal === 0 ? inputVal : null;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: {
                    radar: _this.range
                } });
        }]
    });
    this._widgetList.push(viewRangeInputMin);

    var viewRangeInputMax = WidgetFactory.createMultiInputWidget(this.$controlContents, {
        label: 'Max',
        labelPosition: 'row',
        inputStyle: 'box',
        numOfComponent: 1,
        value: [this.range.max],
        inputType: ['number'],
        problemKeyList: ['value-001'],
        onChanged: [function (inputVal) {
            _this.range.max = inputVal || inputVal === 0 ? inputVal : null;
            _this.setExpanderPreview.call(_this);
            _this.options.onChanged('onChartOptionChanged', { plotOptions: {
                    radar: _this.range
                } });
        }]
    });
    this._widgetList.push(viewRangeInputMax);
};

AxisRadarViewRangeControl.prototype.renderProblem = function () {
    var _this = this;
    this._widgetList.forEach(function (widget) {
        widget.renderProblem(_this.options.problemList);
    });
};

exports.default = AxisRadarViewRangeControl;

/***/ }),
/* 634 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseControl = __webpack_require__(9);

var _baseControl2 = _interopRequireDefault(_baseControl);

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _formatHelperDialog = __webpack_require__(75);

var _formatHelperDialog2 = _interopRequireDefault(_formatHelperDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AxisRadarLabelControl(parentId, options, headerKey) {
    _baseControl2.default.call(this, parentId, options, headerKey);
} /**
   * Created by mk90.kim on 2017-05-10.
   */

AxisRadarLabelControl.prototype = Object.create(_baseControl2.default.prototype);
AxisRadarLabelControl.prototype.constructor = AxisRadarLabelControl;

AxisRadarLabelControl.prototype._init = function () {
    _baseControl2.default.prototype._init.call(this);
    this.name = this.options.chartOption.plotOptions.radar.name;
};

AxisRadarLabelControl.prototype._createContents = function ($parent) {
    _baseControl2.default.prototype._createContents.call(this, $parent);

    var _this = this;
    var headerOption = {
        label: 'Label'
    };
    this.createComponentHeader(headerOption);
    this.createComponentContents();
    this.setComponentShow();
};

AxisRadarLabelControl.prototype.createComponentContents = function (contentsOption) {
    _baseControl2.default.prototype.createComponentContents.call(this, contentsOption);

    this._createFontStyleComponent();
};

AxisRadarLabelControl.prototype._triggerChartOptionChanged = function () {
    this.options.onChanged('onChartOptionChanged', {
        plotOptions: {
            radar: {
                name: this.name
            }
        }
    });
};

AxisRadarLabelControl.prototype._createFontStyleComponent = function () {
    var _this = this;
    this.fontStyle = WidgetFactory.createFontStyleWidget(this.$controlContents, {
        fontStyleBtnList: ['bold', 'italic'],
        value: [this.name.textStyle.fontFamily, this.name.textStyle.fontSize, this.name.textStyle.color, [this.name.textStyle.fontWeight, this.name.textStyle.fontStyle]],
        onChanged: [function (inputVal) {
            _this.name.textStyle.fontFamily = inputVal;
            _this._triggerChartOptionChanged();
        }, function (inputVal) {
            _this.name.textStyle.fontSize = inputVal;
            _this._triggerChartOptionChanged();
        }, function (inputVal) {
            _this.name.textStyle.color = inputVal;
            _this._triggerChartOptionChanged();
        }, function (selectedVals) {
            _this.name.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.name.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this.name.textStyle.fontWeight = $.inArray('bold', selectedVals) > -1 ? 'bold' : 'normal';
            _this.name.textStyle.fontStyle = $.inArray('italic', selectedVals) > -1 ? 'italic' : 'normal';
            _this._triggerChartOptionChanged();
        }]
    });

    this._widgetList.push(this.fontStyle);
};

exports.default = AxisRadarLabelControl;

/***/ }),
/* 635 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BarChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

BarChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
BarChartOption.prototype.constructor = BarChartOption;

BarChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: _this.options.chartOption.colorBy[0]
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.bar.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.bar.tooltip;
    this.options.setting.scaleOpt = ['xaxis'];
};

BarChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = BarChartOption;

/***/ }),
/* 636 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionArea = __webpack_require__(118);

var _chartOptionArea2 = _interopRequireDefault(_chartOptionArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

function BarStackedChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

BarStackedChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
BarStackedChartOption.prototype.constructor = BarStackedChartOption;

BarStackedChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }, {
        key: 'stackBy',
        ref: _this.options.chartOption.plotOptions.bar.stackBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    bar: $.extend(true, {}, _this.options.chartOption.plotOptions.bar, {
                        stackBy: [{ selected: value }]
                    })
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.bar.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.bar.tooltip;
};

BarStackedChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = BarStackedChartOption;

/***/ }),
/* 637 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BiplotChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

BiplotChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
BiplotChartOption.prototype.constructor = BiplotChartOption;

BiplotChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.datasourceSelector = this._getDatasourceSelectorSetting();
};

BiplotChartOption.prototype._getDatasourceSelectorSetting = function () {
    var dsSelectorSetting = [{
        label: 'Data Source #1'
    }, {
        label: 'Data Source #2'
    }];
    return dsSelectorSetting;
};

BiplotChartOption.prototype._getColumnSelectorSetting = function () {
    var _this = this;
    var columnSelectorSetting = [[
    //line
    {
        key: 'lineXAxis', //chartOption에서 찾을때 key값
        ref: _this.options.chartOption.xAxis[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            _this.options.chartOption.xAxis[0].selected = value;
            return {
                xAxis: _this.options.chartOption.xAxis
            };
        }
    }, {
        key: 'lineYAxis',
        ref: _this.options.chartOption.yAxis[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            _this.options.chartOption.yAxis[0].selected = value;
            return {
                yAxis: _this.options.chartOption.yAxis
            };
        }
    }, {
        key: 'lineLabelBy',
        ref: _this.options.chartOption.plotOptions.component.labelBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    component: {
                        labelBy: [{ selected: value }]
                    },
                    projection: $.extend(true, {}, _this.options.chartOption.plotOptions.projection)
                }
            };
        }
    }], [
    //scatter
    {
        key: 'scatterXAxis', //chartOption에서 찾을때 key값
        ref: _this.options.chartOption.xAxis[1],
        getColumnChangedOption: function getColumnChangedOption(value) {
            _this.options.chartOption.xAxis[1].selected = value;
            return {
                xAxis: _this.options.chartOption.xAxis
            };
        }
    }, {
        key: 'scatterYAxis',
        ref: _this.options.chartOption.yAxis[1],
        getColumnChangedOption: function getColumnChangedOption(value) {
            _this.options.chartOption.yAxis[1].selected = value;
            return {
                yAxis: _this.options.chartOption.yAxis
            };
        }
    },
    // {
    //     key: 'colorBy',
    //     ref: _this.options.chartOption.colorBy[0],
    //     multiple: true,
    //     label: 'Color By'
    // },
    {
        key: 'scatterLabelBy',
        ref: _this.options.chartOption.plotOptions.projection.labelBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    component: $.extend(true, {}, _this.options.chartOption.plotOptions.component),
                    projection: {
                        labelBy: [{ selected: value }]
                    }
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

BiplotChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Frame'];
};

exports.default = BiplotChartOption;

/***/ }),
/* 638 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BoxPlotChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

BoxPlotChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
BoxPlotChartOption.prototype.constructor = BoxPlotChartOption;

BoxPlotChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.onOffSwitch = this._getOnOffSwitchSetting();
    this.options.setting.stripLine = this.options.chartOption.plotOptions.boxplot.stripLine;
};

BoxPlotChartOption.prototype._getColumnSelectorSetting = function () {
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

BoxPlotChartOption.prototype._getOnOffSwitchSetting = function () {
    var _this = this;
    var onOffSwitchSetting = [[{
        key: 'separateColor',
        ref: this.options.chartOption.plotOptions.boxplot.separateColor,
        label: 'Separate Color',
        getValueChangedOption: function getValueChangedOption(value) {
            return {
                plotOptions: {
                    boxplot: $.extend(true, {}, _this.options.chartOption.plotOptions.boxplot, {
                        separateColor: value
                    })
                }
            };
        }
    }]];
    onOffSwitchSetting = this._configureSwitchConf(onOffSwitchSetting);
    return onOffSwitchSetting;
};

BoxPlotChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Axis', 'Marker', 'Frame'];
};

exports.default = BoxPlotChartOption;

/***/ }),
/* 639 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BubbleChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by ji_sung.park on 2017-10-23.
   */

BubbleChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
BubbleChartOption.prototype.constructor = BubbleChartOption;

BubbleChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.stripLine = this.options.chartOption.plotOptions.bubble.stripLine;
    this.options.setting.scaleOpt = ['xaxis', 'yaxis'];
    this.options.setting.onZeroOpt = ['xaxis', 'yaxis'];
};

BubbleChartOption.prototype._getColumnSelectorSetting = function () {
    var _this = this;
    var columnSelectorSetting;
    columnSelectorSetting = [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: this.options.chartOption.colorBy[0]
    }, {
        key: 'sizeBy',
        ref: this.options.chartOption.plotOptions.bubble.sizeBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var selected = [];
            if (value.length > 0 && value[0] !== null) {
                selected = value;
            }
            return {
                plotOptions: {
                    bubble: $.extend(true, {}, _this.options.chartOption.plotOptions.bubble, {
                        sizeBy: [{ selected: selected }]
                    })
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

// BubbleChartOption.prototype.getDefaultControlContainerList = function () {
//     return ['Data', 'ToolTip', 'Title', 'Axis', 'Legend', 'Lines', 'Frame'];
// };


exports.default = BubbleChartOption;

/***/ }),
/* 640 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CardChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by sds on 2018-03-26.
   */

CardChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
CardChartOption.prototype.constructor = CardChartOption;

CardChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'valueBy',
        ref: _this.options.chartOption.plotOptions.card.valueBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    card: $.extend(true, {}, _this.options.chartOption.plotOptions.card, {
                        valueBy: [{ selected: value }]
                    })
                }
            };
        }
    }]];

    var labelSettings = [{
        ref: _this.options.chartOption.plotOptions.card.label.normal,
        getLabelChangedOption: function getLabelChangedOption(value) {
            var cardOpt = $.extend(true, {}, _this.options.chartOption.plotOptions.card);
            cardOpt.label.normal = value;
            return {
                plotOptions: {
                    card: cardOpt
                }
            };
        }
    }];

    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.labelSettings = labelSettings;
    this.options.setting.numberLength = this._getNumberLengthSetting();
    this.options.setting.numberFormat = this.options.chartOption.plotOptions.card.numberFormat;
};

CardChartOption.prototype._getNumberLengthSetting = function () {
    var _this = this;
    var numberLengthSettings = [{
        ref: this.options.chartOption.plotOptions.card.leng[0],
        getLengthChangedOption: function getLengthChangedOption(value) {
            var cardOpt = $.extend(true, {}, _this.options.chartOption.plotOptions.card);
            cardOpt.leng = [{ selected: value }];
            return {
                plotOptions: {
                    card: cardOpt
                }
            };
        }
    }];

    return numberLengthSettings;
};

CardChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'FormatCard', 'Title', 'Label', 'Frame'];
};

exports.default = CardChartOption;

/***/ }),
/* 641 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionColumn = __webpack_require__(122);

var _chartOptionColumn2 = _interopRequireDefault(_chartOptionColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

function ColumnStackedChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

ColumnStackedChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
ColumnStackedChartOption.prototype.constructor = ColumnStackedChartOption;

ColumnStackedChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }, {
        key: 'stackBy',
        ref: _this.options.chartOption.plotOptions.column.stackBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    column: $.extend(true, {}, _this.options.chartOption.plotOptions.column, {
                        stackBy: [{ selected: value }]
                    })
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.column.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.column.tooltip;
};

ColumnStackedChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = ColumnStackedChartOption;

/***/ }),
/* 642 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionColumn = __webpack_require__(122);

var _chartOptionColumn2 = _interopRequireDefault(_chartOptionColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

function ColumnStacked100ChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

ColumnStacked100ChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
ColumnStacked100ChartOption.prototype.constructor = ColumnStacked100ChartOption;

ColumnStacked100ChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0],
        label: 'X-axis',
        mandatory: true
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0],
        label: 'Y-axis',
        mandatory: true
    }, {
        key: 'stackBy',
        ref: _this.options.chartOption.plotOptions.column.stackBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    column: $.extend(true, {}, _this.options.chartOption.plotOptions.column, {
                        stackBy: [{ selected: value }]
                    })
                }
            };
        },
        label: 'Stack By'
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.column.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.column.tooltip;
};

ColumnStacked100ChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = ColumnStacked100ChartOption;

/***/ }),
/* 643 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionRegister = __webpack_require__(117);

var ChartOptionRegistry = _interopRequireWildcard(_chartOptionRegister);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by sds on 2018-01-20.
 */

var commonParamList = ['xAxis', 'title', 'colorSet', 'grid', 'legend', 'tooltip', 'source'];

function ComplexChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

ComplexChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
ComplexChartOption.prototype.constructor = ComplexChartOption;

ComplexChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.chartOptionColtrolMap = {};
    this.chartOptionList = [];
};

ComplexChartOption.prototype._createContents = function () {
    _chartOptionBase2.default.prototype._createContents.call(this);

    this._createTabContainer();
    this._initChildOption();
    for (var i = 0; i < this.chartOptionList.length; i++) {
        this._createChildOptionControl(i);
    }
};

ComplexChartOption.prototype._createChildOptionControl = function (index) {
    if (this.chartOptionColtrolMap[index]) this.chartOptionColtrolMap[index].destroy();
    var $complexPanel = this.$tabContainer.find('.bo-complex-tab[complex-index=' + index + ']');
    var childChartOption = this.chartOptionList[index];

    this.chartOptionColtrolMap[index] = ChartOptionRegistry.createChartOptionControl(this.chartOptionList[index].chartOption.chart.type, $complexPanel, childChartOption);
};

ComplexChartOption.prototype._initChildOption = function () {
    var _this = this;
    this.combinedChartOption = this.options.chartOption;
    var complexOptionList = this.options.chartOption.complex;

    var xAxis = $.extend(true, [], this.options.chartOption.xAxis);

    for (var i = 0; i < complexOptionList.length; i++) {
        var yAxis = complexOptionList[i].yAxis;
        delete complexOptionList[i].source;
        var childOption = $.extend(true, {}, this.options, { chartOption: complexOptionList[i] });
        childOption.complexIndex = i;
        childOption.chartOption.xAxis = xAxis;
        childOption.chartOption.yAxis = yAxis;

        childOption.chartOptionAPI.setChartOptions = function (options) {
            // do nothing
        };

        childOption.onChanged = function (changedColumnInfo, param) {
            if (changedColumnInfo === 'onDataSourceChanged') {
                _this.options.callBack[changedColumnInfo](param);
            } else {
                $.extend(true, this.chartOption, param);
                _this._combineChartOption(this.complexIndex);
                if (changedColumnInfo === 'onChartTypeChanged') {
                    _this._createChildOptionControl(this.complexIndex);
                }
            }
        };

        childOption.chartTypeList = ['column', 'column-stacked', 'column-stacked-100', 'line', 'area', 'area-stacked', 'area-stacked-100', 'scatter', 'bubble'];

        childOption.getControlContainerList = function () {
            return ['Data', 'ToolTip', 'Title', 'AxisEach', 'Legend', 'Marker', 'Frame'];
        };

        childOption.columnConf = {
            scatter: {
                xAxis: {
                    axisTypeList: []
                }
            },
            line: {
                xAxis: {
                    axisTypeList: []
                }
            }
        };

        this.chartOptionList[i] = childOption;
    }
};

ComplexChartOption.prototype._configureOption = function (targetIndex) {
    var fromIndex = targetIndex === 0 ? 1 : 0;
    var mainChartOption = this.options.chartOption;
    var childChartOption = this.chartOptionList[fromIndex].chartOption;
    var otherChildChartOption = this.chartOptionList[targetIndex].chartOption;

    for (var i = 0; i < commonParamList.length; i++) {
        mainChartOption[commonParamList[i]] = childChartOption[commonParamList[i]];
        otherChildChartOption[commonParamList[i]] = childChartOption[commonParamList[i]];
    }
};

ComplexChartOption.prototype._combineChartOption = function (complexIndex) {

    var originalChartOption = this.options.chartOption;
    for (var i in commonParamList) {
        originalChartOption[commonParamList[i]] = this.chartOptionList[complexIndex].chartOption[commonParamList[i]];
    }
    originalChartOption.chart.background = this.chartOptionList[complexIndex].chartOption.chart.background;
    originalChartOption.chart.border = this.chartOptionList[complexIndex].chartOption.chart.border;

    for (var i = 0; i < this.chartOptionList.length; i++) {
        originalChartOption.complex[i] = this.chartOptionList[i].chartOption;
        for (var j in commonParamList) {
            this.chartOptionList[i].chartOption[commonParamList[j]] = originalChartOption[commonParamList[j]];
        }
        this.chartOptionList[i].chartOption.xAxis = originalChartOption.xAxis;
        this.chartOptionList[i].chartOption.source = originalChartOption.source;
        this.chartOptionList[i].chartOption.legend = originalChartOption.legend;
        this.chartOptionList[i].chartOption.chart.background = originalChartOption.chart.background;
        this.chartOptionList[i].chartOption.chart.border = originalChartOption.chart.border;
        delete this.chartOptionList[i].chartOption.complex;
    }

    this.combinedChartOption = originalChartOption;

    this.options.onChanged('onChartOptionChanged', originalChartOption, true);
};

ComplexChartOption.prototype.reloadColumnSelectorSetting = function () {};

ComplexChartOption.prototype._createTabContainer = function () {
    var _this = this;
    this.$tabContainer = $('' + '<div class="bos-complex-tab-container">' + '   <ul class="bos-complex-tab-header">' + '       <li><div class="bos-complex-tab-items" >Chart 1</div></li>' + '       <li><div class="bos-complex-tab-items" >Chart 2</div></li>' + '   </ul>' + '   <div class="bo-complex-tab bos-complex-tab" complex-index="0"></div>' + '   <div class="bo-complex-tab bos-complex-tab" complex-index="1"></div>' + '</div>' + '');

    this.parentId.append(this.$tabContainer);
    // FIXME: display none 상태일때 jqxTab이 깨지는데 다른방법으로 수정필요.
    var $adonisRightPanel = this.$tabContainer.parents('.bcharts-adonis-right');
    if ($adonisRightPanel && $adonisRightPanel.css('display') == 'none') {
        $adonisRightPanel.css('display', 'block');
        this.$tabContainer.jqxTabs({ position: 'top', theme: 'office', scrollable: false });
        $adonisRightPanel.css('display', 'none');
    } else {
        this.$tabContainer.jqxTabs({ position: 'top', theme: 'office', scrollable: false });
    }

    this.$tabContainer.on('selected', function (event) {
        var index = event.args.item;

        _this._configureOption(index);
        _this._createChildOptionControl(index);
    });
};

ComplexChartOption.prototype.renderProblem = function () {
    for (var i in this.chartOptionColtrolMap) {
        this.chartOptionColtrolMap[i].renderProblem();
    }
};

ComplexChartOption.prototype.doValidate = function () {
    for (var i in this.chartOptionColtrolMap) {
        this.chartOptionColtrolMap[i].doValidate();
    }
};

ComplexChartOption.prototype.destroy = function () {
    for (var i in this.chartOptionColtrolMap) {
        this.chartOptionColtrolMap[i].destroy();
    }
    this.parentId.empty();
};

ComplexChartOption.prototype.getDefaultControlContainerList = function () {
    return ['ComplexData'];
};

exports.default = ComplexChartOption;

/***/ }),
/* 644 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DecisionTreeChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

DecisionTreeChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
DecisionTreeChartOption.prototype.constructor = DecisionTreeChartOption;

DecisionTreeChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'groupByColumn',
        ref: _this.options.chartOption.plotOptions.decisionTree.groupByColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var decisionTree = $.extend(true, {}, _this.options.chartOption.plotOptions.decisionTree);
            decisionTree.groupByColumn = [{ selected: value }];
            return {
                plotOptions: {
                    decisionTree: decisionTree
                }
            };
        }
    }, {
        key: 'fromColumn',
        ref: _this.options.chartOption.plotOptions.decisionTree.fromColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var decisionTree = $.extend(true, {}, _this.options.chartOption.plotOptions.decisionTree);
            decisionTree.fromColumn = [{ selected: value }];
            return {
                plotOptions: {
                    decisionTree: decisionTree
                }
            };
        }
    }, {
        key: 'toColumn',
        ref: _this.options.chartOption.plotOptions.decisionTree.toColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var decisionTree = $.extend(true, {}, _this.options.chartOption.plotOptions.decisionTree);
            decisionTree.toColumn = [{ selected: value }];
            return {
                plotOptions: {
                    decisionTree: decisionTree
                }
            };
        }
    }, {
        key: 'nodeLabelColumn',
        ref: _this.options.chartOption.plotOptions.decisionTree.nodeLabelColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var decisionTree = $.extend(true, {}, _this.options.chartOption.plotOptions.decisionTree);
            decisionTree.nodeLabelColumn = [{ selected: value }];
            return {
                plotOptions: {
                    decisionTree: decisionTree
                }
            };
        }
    }, {
        key: 'linkLabelColumn',
        ref: _this.options.chartOption.plotOptions.decisionTree.linkLabelColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var decisionTree = $.extend(true, {}, _this.options.chartOption.plotOptions.decisionTree);
            decisionTree.linkLabelColumn = [{ selected: value }];
            return {
                plotOptions: {
                    decisionTree: decisionTree
                }
            };
        }
    }]];

    var labelSettings = [{
        showBtn: true,
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
        showBtn: true,
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

    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.labelSettings = labelSettings;
    this.options.setting.figureStyle = this.options.chartOption.plotOptions.decisionTree.style;
};

DecisionTreeChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Label', 'Figure', 'FrameStyle'];
};

exports.default = DecisionTreeChartOption;

/***/ }),
/* 645 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DendrogramChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

DendrogramChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
DendrogramChartOption.prototype.constructor = DendrogramChartOption;

DendrogramChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'clusterGroupColumn',
        ref: _this.options.chartOption.plotOptions.dendrogram.clusterGroupColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var dendrogram = $.extend(true, {}, _this.options.chartOption.plotOptions.dendrogram);
            dendrogram.clusterGroupColumn = [$.extend({}, Brightics.Chart.getChartAttr('dendrogram').DefaultOptions.plotOptions.dendrogram.clusterGroupColumn[0], { selected: value })];
            return {
                plotOptions: {
                    dendrogram: dendrogram
                }
            };
        }
    }, {
        key: 'clusterColumn',
        ref: _this.options.chartOption.plotOptions.dendrogram.clusterColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var dendrogram = $.extend(true, {}, _this.options.chartOption.plotOptions.dendrogram);
            dendrogram.clusterColumn = [{ selected: value }];
            return {
                plotOptions: {
                    dendrogram: dendrogram
                }
            };
        }
    }, {
        key: 'heightColumn',
        ref: _this.options.chartOption.plotOptions.dendrogram.heightColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var dendrogram = $.extend(true, {}, _this.options.chartOption.plotOptions.dendrogram);
            dendrogram.heightColumn = [$.extend({}, Brightics.Chart.getChartAttr('dendrogram').DefaultOptions.plotOptions.dendrogram.heightColumn[0], { selected: value })];
            return {
                plotOptions: {
                    dendrogram: dendrogram
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
};

DendrogramChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Frame'];
};

exports.default = DendrogramChartOption;

/***/ }),
/* 646 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HeatmapChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

HeatmapChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
HeatmapChartOption.prototype.constructor = HeatmapChartOption;

HeatmapChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }, {
        key: 'valueBy',
        ref: _this.options.chartOption.plotOptions.heatmap.valueBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    heatmap: {
                        valueBy: [{ selected: value }]
                    }
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.heatmap.stripLine;
};

HeatmapChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Axis', 'VisualMap', 'Frame'];
};

exports.default = HeatmapChartOption;

/***/ }),
/* 647 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HeatmapMatrixChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

HeatmapMatrixChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
HeatmapMatrixChartOption.prototype.constructor = HeatmapMatrixChartOption;

HeatmapMatrixChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: _this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: _this.options.chartOption.yAxis[0]
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.heatmap.stripLine;
};

HeatmapMatrixChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Axis', 'VisualMap', 'Frame'];
};

exports.default = HeatmapMatrixChartOption;

/***/ }),
/* 648 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HistogramChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by sds on 2017-07-27.
   */

HistogramChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
HistogramChartOption.prototype.constructor = HistogramChartOption;

HistogramChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.stripLine = this.options.chartOption.plotOptions.column.stripLine;
};

HistogramChartOption.prototype._getColumnSelectorSetting = function () {
    var columnSelectorSetting;
    columnSelectorSetting = [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

HistogramChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Marker', 'Frame'];
};

exports.default = HistogramChartOption;

/***/ }),
/* 649 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LineChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

LineChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
LineChartOption.prototype.constructor = LineChartOption;

LineChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.marker = this.options.chartOption.plotOptions.line.marker;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.line.stripLine;
    this.options.setting.trendLine = this.options.chartOption.plotOptions.line.trendLine;
    this.options.setting.scaleOpt = ['xaxis', 'yaxis'];
    this.options.setting.onZeroOpt = ['xaxis', 'yaxis'];
    this.options.setting.tooltip = this.options.chartOption.plotOptions.line.tooltip;
    this.options.setting.showSymbol = this.options.chartOption.plotOptions.line.showSymbol;
};

LineChartOption.prototype._getColumnSelectorSetting = function () {
    var columnSelectorSetting = this._createColumnSelectorSetting();
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

LineChartOption.prototype._createColumnSelectorSetting = function () {
    var _this = this;
    return [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: this.options.chartOption.colorBy[0]
    }, {
        key: 'lineBy',
        ref: this.options.chartOption.plotOptions.line.lineBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    line: $.extend(true, {}, _this.options.chartOption.plotOptions.line, {
                        lineBy: [{ selected: value }]
                    })
                }
            };
        }
    }]];
};

LineChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'AxisR', 'Legend', 'MarkerLine', 'LinesWithTrend', 'Frame'];
};

exports.default = LineChartOption;

/***/ }),
/* 650 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NetworkChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

NetworkChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
NetworkChartOption.prototype.constructor = NetworkChartOption;

NetworkChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'fromColumn',
        ref: _this.options.chartOption.plotOptions.network.fromColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var network = $.extend(true, {}, _this.options.chartOption.plotOptions.network);
            network.fromColumn = [{ selected: value }];
            return {
                plotOptions: {
                    network: network
                }
            };
        }
    }, {
        key: 'toColumn',
        ref: _this.options.chartOption.plotOptions.network.toColumn[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var network = $.extend(true, {}, _this.options.chartOption.plotOptions.network);
            network.toColumn = [{ selected: value }];
            return {
                plotOptions: {
                    network: network
                }
            };
        }
    }, {
        key: 'nodeSizeBy',
        ref: _this.options.chartOption.plotOptions.network.nodeSizeBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var network = $.extend(true, {}, _this.options.chartOption.plotOptions.network);
            network.nodeSizeBy = [{ selected: value }];
            return {
                plotOptions: {
                    network: network
                }
            };
        }
    }]];

    var labelSettings = [{
        showBtn: true,
        ref: _this.options.chartOption.plotOptions.network.label.normal,
        getLabelChangedOption: function getLabelChangedOption(value) {
            var network = $.extend(true, {}, _this.options.chartOption.plotOptions.network);
            network.label.normal = value;
            return {
                plotOptions: {
                    network: network
                }
            };
        },
        label: 'Node Label'
    }];

    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.labelSettings = labelSettings;
    this.options.setting.figureStyle = this.options.chartOption.plotOptions.network.style;
};

NetworkChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Label', 'Figure', 'FrameStyle'];
};

exports.default = NetworkChartOption;

/***/ }),
/* 651 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PairwiseScatterChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

PairwiseScatterChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
PairwiseScatterChartOption.prototype.constructor = PairwiseScatterChartOption;

PairwiseScatterChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.marker = this.options.chartOption.plotOptions.scatter.marker;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.scatter.stripLine;
    this.options.setting.grid = {
        itemList: [{ value: '%', label: '%' }],
        getValue: function getValue(value) {
            if (value && String(value).indexOf('%') < 0) return '5%';else return value;
        }
    };
};

PairwiseScatterChartOption.prototype._getColumnSelectorSetting = function () {
    var columnSelectorSetting = this._createColumnSelectorSetting();
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

PairwiseScatterChartOption.prototype._createColumnSelectorSetting = function () {
    return [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'colorBy',
        ref: this.options.chartOption.colorBy[0]
    }]];
};

PairwiseScatterChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Legend', 'Marker', 'Frame'];
};

exports.default = PairwiseScatterChartOption;

/***/ }),
/* 652 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PieChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

PieChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
PieChartOption.prototype.constructor = PieChartOption;

PieChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'colorBy',
        ref: _this.options.chartOption.colorBy[0]
    }, {
        key: 'sizeBy',
        ref: _this.options.chartOption.plotOptions.pie.sizeBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    pie: {
                        sizeBy: [{ selected: value }]
                    }
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.display = this.options.chartOption.plotOptions.pie;
};

PieChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Legend', 'Marker', 'FramePie'];
};

exports.default = PieChartOption;

/***/ }),
/* 653 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function QQPlotOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

QQPlotOption.prototype = Object.create(_chartOptionBase2.default.prototype);
QQPlotOption.prototype.constructor = QQPlotOption;

QQPlotOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;

    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.itemSelector = this._getItemSelectorSetting();
    this.options.setting.marker = this.options.chartOption.plotOptions.qqplot.marker;
    this.options.setting.onZeroOpt = ['xaxis', 'yaxis'];
};

QQPlotOption.prototype._getColumnSelectorSetting = function () {
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'values',
        ref: this.options.chartOption.plotOptions.qqplot.values[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var selected = [];
            if (value.length > 0 && value[0] !== null) {
                selected = value;
            }
            return {
                plotOptions: {
                    qqplot: $.extend(true, {}, _this.options.chartOption.plotOptions.qqplot, {
                        values: [{ selected: selected }]
                    })
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);

    return columnSelectorSetting;
};

QQPlotOption.prototype._getItemSelectorSetting = function () {
    var _this = this;
    var itemSelectorSetting = [[{
        key: 'confidence',
        ref: this.options.chartOption.plotOptions.qqplot.confidence[0],
        getItemChangedOption: function getItemChangedOption(value) {
            return {
                plotOptions: {
                    qqplot: $.extend(true, {}, _this.options.chartOption.plotOptions.qqplot, {
                        confidence: [{ selected: value }]
                    })
                }
            };
        }
    }, {
        key: 'distribution',
        ref: this.options.chartOption.plotOptions.qqplot.distribution[0],
        getItemChangedOption: function getItemChangedOption(value) {
            return {
                plotOptions: {
                    qqplot: $.extend(true, {}, _this.options.chartOption.plotOptions.qqplot, {
                        distribution: [{ selected: value }]
                    })
                }
            };
        }
    }]];

    itemSelectorSetting = this._configureItemConf(itemSelectorSetting);

    return itemSelectorSetting;
};

QQPlotOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Axis', 'Marker', 'Frame'];
};

exports.default = QQPlotOption;

/***/ }),
/* 654 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RadarChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} // /**
//  * Created by SDS on 2017-05-10.
//  */
//


RadarChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
RadarChartOption.prototype.constructor = RadarChartOption;

RadarChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var columnSelectorSetting = [[{
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: this.options.chartOption.colorBy[0]
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.display = this.options.chartOption.plotOptions.radar;
};

RadarChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Legend', 'Marker', 'AxisRadar', 'FramePie'];
};

exports.default = RadarChartOption;

/***/ }),
/* 655 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _chartOptionBarStacked = __webpack_require__(293);

var _chartOptionBarStacked2 = _interopRequireDefault(_chartOptionBarStacked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by SDS on 2017-05-10.
 */

function ROCCurveChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

ROCCurveChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
ROCCurveChartOption.prototype.constructor = ROCCurveChartOption;

ROCCurveChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var columnSelectorSetting = [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: this.options.chartOption.colorBy[0]
    }, {
        key: 'auroc',
        ref: this.options.chartOption.auroc[0]
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.roccurve.stripLine;
    this.options.setting.tooltip = this.options.chartOption.plotOptions.roccurve.tooltip;
};

ROCCurveChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTipTrigger', 'Title', 'Axis', 'Legend', 'Marker', 'Lines', 'Frame'];
};

exports.default = ROCCurveChartOption;

/***/ }),
/* 656 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ScatterChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

ScatterChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
ScatterChartOption.prototype.constructor = ScatterChartOption;

ScatterChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
    this.options.setting.marker = this.options.chartOption.plotOptions.scatter.marker;
    this.options.setting.stripLine = this.options.chartOption.plotOptions.scatter.stripLine;
    this.options.setting.trendLine = this.options.chartOption.plotOptions.scatter.trendLine;
    this.options.setting.scaleOpt = ['xaxis', 'yaxis'];
    this.options.setting.onZeroOpt = ['xaxis', 'yaxis'];
};

ScatterChartOption.prototype._getColumnSelectorSetting = function () {
    var columnSelectorSetting = this._createColumnSelectorSetting();
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

ScatterChartOption.prototype._createColumnSelectorSetting = function () {
    return [[{
        key: 'xAxis',
        ref: this.options.chartOption.xAxis[0]
    }, {
        key: 'yAxis',
        ref: this.options.chartOption.yAxis[0]
    }, {
        key: 'colorBy',
        ref: this.options.chartOption.colorBy[0]
    }]];
};

ScatterChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'AxisR', 'Legend', 'Marker', 'LinesWithTrend', 'Frame'];
};

exports.default = ScatterChartOption;

/***/ }),
/* 657 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// /**
//  * Created by SDS on 2017-05-10.
//  */
//
// import BaseChart from '../chart-option-base';
//
// function ScatterMapChartOption(parentId, options) {
//     BaseChart.call(this, parentId, options);
// }
//
// ScatterMapChartOption.prototype = Object.create(BaseChart.prototype);
// ScatterMapChartOption.prototype.constructor = ScatterMapChartOption;
//
// ScatterMapChartOption.prototype._init = function () {
//     BaseChart.prototype._init.call(this);
//     this.options.setting.marker = this.options.chartOption.plotOptions.scatter.marker;
//     this.options.setting.stripLine = this.options.chartOption.plotOptions.scatter.stripLine;
// };
//
// export default ScatterMapChartOption;


/***/ }),
/* 658 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TableChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

TableChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
TableChartOption.prototype.constructor = TableChartOption;

TableChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var formatterSetting = [{
        key: 'formatter',
        ref: _this.options.chartOption.plotOptions.table.formatter
    }];
    this.options.setting.formatter = formatterSetting;
    this.options.setting.columnSelector = [[]];
};

TableChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'Format', 'FrameStyle'];
};

exports.default = TableChartOption;

/***/ }),
/* 659 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TreeMapChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

TreeMapChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
TreeMapChartOption.prototype.constructor = TreeMapChartOption;

TreeMapChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting();
};

TreeMapChartOption.prototype._getColumnSelectorSetting = function () {
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'hierarchyCol',
        ref: this.options.chartOption.plotOptions.treemap.hierarchyCol[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var treemap = $.extend(true, {}, _this.options.chartOption.plotOptions.treemap);
            treemap.hierarchyCol = [{ selected: value }];
            return {
                plotOptions: {
                    treemap: treemap
                }
            };
        }
    }, {
        key: 'sizeBy',
        ref: this.options.chartOption.plotOptions.treemap.sizeBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            var treemap = $.extend(true, {}, _this.options.chartOption.plotOptions.treemap);
            treemap.sizeBy = [{ selected: value }];
            return {
                plotOptions: {
                    treemap: treemap
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    return columnSelectorSetting;
};

TreeMapChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'FrameStyle'];
};

exports.default = TreeMapChartOption;

/***/ }),
/* 660 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Created by SDS on 2017-05-10.
                                                                                                                                                                                                                                                                               */

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

var _setup = __webpack_require__(294);

var setup = _interopRequireWildcard(_setup);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MapChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
}

MapChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
MapChartOption.prototype.constructor = MapChartOption;

MapChartOption.prototype._init = function () {
    var _this = this;
    _chartOptionBase2.default.prototype._init.call(this);
    this.options.setting.columnSelector = this._getColumnSelectorSetting.bind(this);
    this.options.setting.getDefaultColumnOption = this.getDefaultColumnOption.bind(this);
    this.options.setting.marker = this.options.chartOption.plotOptions.map.marker;
    this.options.setting.marker.plotOptionType = 'map';

    if (_typeof(setup.get('MapList')) === 'object') {
        this.options.setting.mapList = setup.get('MapList');
        // Brightics.Chart.Adonis.Setup.MapList;
    } else {
        this.options.setting.mapList = [];
    }

    this.options.setting.labelSettings = [{
        showBtn: true,
        ref: this.options.chartOption.plotOptions.map.mapStyle.label.emphasis,
        getLabelChangedOption: function getLabelChangedOption(value) {
            var map = $.extend(true, {}, _this.options.chartOption.plotOptions.map);
            map.mapStyle.label.emphasis = value;
            return {
                plotOptions: {
                    map: map
                }
            };
        },
        label: 'Label Style'
    }];

    this.options.setting.areaSettings = [{
        ref: this.options.chartOption.plotOptions.map.mapStyle,
        // getLabelChangedOption: function (value) {
        //     var map = $.extend(true, {}, _this.options.chartOption.plotOptions.map);
        //     map.mapStyle.label.emphasis = value;
        //     return {
        //         plotOptions: {
        //             map: map
        //         }
        //     }
        // },
        label: 'Area Style'
    }];

    this.options.setting.display = this.options.chartOption.plotOptions.map.mapStyle;
};

MapChartOption.prototype.getDefaultControlContainerList = function () {
    return ['MapData', 'Layers', 'ToolTip', 'Legend', 'Marker', 'MapStyle', 'Title'];
};

MapChartOption.prototype.getDefaultColumnOption = function (layerType) {
    return $.extend(true, {}, Brightics.Chart.getChartAttr(this.options.chartOption.chart.type).Layers[layerType]);
};

MapChartOption.prototype._getColumnSelectorSetting = function (layerIndex) {
    var layers = this.options.chartOption.plotOptions.map.layers;
    var layer = layers[layerIndex];
    var layerType = layers[layerIndex].type;
    var columnSelectorSetting;
    if (layerType === 'lines') {
        columnSelectorSetting = [[{
            key: 'latitude',
            ref: layer.latitude[0],
            label: 'Latitude',
            mandatory: true
        }, {
            key: 'longitude',
            ref: layer.longitude[0],
            label: 'Longitude',
            mandatory: true
        }, {
            key: 'colorBy',
            ref: layer.colorBy[0],
            label: 'Color By'
        }, {
            key: 'sortBy',
            ref: layer.sortBy[0],
            label: 'Sort By'
        }]];
    } else {
        columnSelectorSetting = [[{
            key: 'latitude',
            ref: layer.latitude[0],
            label: 'Latitude',
            mandatory: true
        }, {
            key: 'longitude',
            ref: layer.longitude[0],
            label: 'Longitude',
            mandatory: true
        }, {
            key: 'colorBy',
            ref: layer.colorBy[0],
            label: 'Color By'
        }, {
            key: 'sizeBy',
            ref: layer.sizeBy[0],
            label: 'Size By'
        }]];
    }
    columnSelectorSetting = this._configureColumnConf(layerType, columnSelectorSetting);
    return columnSelectorSetting;
};

MapChartOption.prototype._configureColumnConf = function (layerType, columnSelectorSetting) {
    var columnConf = this._columnHelper.getColumnConf()[layerType];

    columnSelectorSetting.forEach(function (dataSet) {
        dataSet.forEach(function (columnSetting) {
            var key = columnSetting.key;
            for (var confParam in columnConf[key]) {
                columnSetting[confParam] = columnConf[key][confParam];
            }
        });
    });

    return columnSelectorSetting;
};

exports.default = MapChartOption;

/***/ }),
/* 661 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DonutChartOption(parentId, options) {
    _chartOptionBase2.default.call(this, parentId, options);
} /**
   * Created by SDS on 2017-05-10.
   */

DonutChartOption.prototype = Object.create(_chartOptionBase2.default.prototype);
DonutChartOption.prototype.constructor = DonutChartOption;

DonutChartOption.prototype._init = function () {
    _chartOptionBase2.default.prototype._init.call(this);
    var _this = this;
    var columnSelectorSetting = [[{
        key: 'colorBy',
        ref: _this.options.chartOption.colorBy[0]
    }, {
        key: 'sizeBy',
        ref: _this.options.chartOption.plotOptions.donut.sizeBy[0],
        getColumnChangedOption: function getColumnChangedOption(value) {
            return {
                plotOptions: {
                    donut: {
                        sizeBy: [{ selected: value }]
                    }
                }
            };
        }
    }]];
    columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
    this.options.setting.columnSelector = columnSelectorSetting;
    this.options.setting.display = this.options.chartOption.plotOptions.donut;
};

DonutChartOption.prototype.getDefaultControlContainerList = function () {
    return ['Data', 'ToolTip', 'Title', 'Legend', 'Marker', 'FrameDonut'];
};

exports.default = DonutChartOption;

/***/ }),
/* 662 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chartOptionBase = __webpack_require__(6);

var _chartOptionBase2 = _interopRequireDefault(_chartOptionBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by SDS on 2017-05-10.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ImageGridChartOption = function (_BaseChart) {
    _inherits(ImageGridChartOption, _BaseChart);

    function ImageGridChartOption(parentId, options) {
        _classCallCheck(this, ImageGridChartOption);

        return _possibleConstructorReturn(this, (ImageGridChartOption.__proto__ || Object.getPrototypeOf(ImageGridChartOption)).call(this, parentId, options));
    }

    _createClass(ImageGridChartOption, [{
        key: '_init',
        value: function _init() {
            _get(ImageGridChartOption.prototype.__proto__ || Object.getPrototypeOf(ImageGridChartOption.prototype), '_init', this).call(this);
            this.options.setting.columnSelector = this._getColumnSelectorSetting();
        }
    }, {
        key: '_createColumnSelectorSetting',
        value: function _createColumnSelectorSetting() {
            return [[{
                key: 'imageColumn',
                ref: this.options.chartOption.imageColumn[0]
            }, {
                key: 'labelColumn',
                ref: this.options.chartOption.labelColumn[0]
            }, {
                key: 'sortBy',
                ref: this.options.chartOption.sortBy[0]
            }]];
        }
    }, {
        key: '_getColumnSelectorSetting',
        value: function _getColumnSelectorSetting() {
            var columnSelectorSetting = this._createColumnSelectorSetting();
            columnSelectorSetting = this._configureColumnConf(columnSelectorSetting);
            return columnSelectorSetting;
        }
    }, {
        key: 'getDefaultControlContainerList',
        value: function getDefaultControlContainerList() {
            return ['Data', 'Title', 'Grid', 'Frame'];
        }
    }]);

    return ImageGridChartOption;
}(_chartOptionBase2.default);

exports.default = ImageGridChartOption;

/***/ }),
/* 663 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* -----------------------------------------------------
 *  option-selector.js
 *  Created by hyunseok.oh@samsung.com on 2018-08-30.
 * ---------------------------------------------------- */

var COL_TYPE = exports.COL_TYPE = {
    NUMERIC: ['number'],
    CATEGORICAL: ['string', 'date'],
    IMAGE: ['image']
};

var categorical = function categorical(col) {
    return COL_TYPE.CATEGORICAL.indexOf(col.type) >= 0;
};

/**
 * @param {Columns} cols
 * @param {COL_TYPE} type
 */
var getColumnIndexByType = function getColumnIndexByType(cols, type) {
    return indexOf(cols, function (c) {
        return type.indexOf(c.type) >= 0;
    });
};

var defaultIndex = function defaultIndex(idx, _default) {
    return idx >= 0 ? idx : _default;
};

var indexOf = function indexOf(a, fn) {
    var len = a.length;
    for (var i = 0; i < len; i++) {
        if (fn(a[i], i)) return i;
    }
    return -1;
};

var andResolver = exports.andResolver = function andResolver(resolverList) {
    var combinedPre = function combinedPre(chtOpt, cols) {
        return resolverList.reduce(function (p, r) {
            return p && r.pre(chtOpt, cols);
        });
    };
    var combinedResolve = function combinedResolve(chtOpt, cols) {
        return resolverList.reduce(function (p, r) {
            return r.resolve.apply(r, _toConsumableArray(p));
        }, [chtOpt, cols]);
    };

    return {
        resolve: combinedResolve,
        pre: combinedPre
    };
};

var noopResolver = exports.noopResolver = function noopResolver(config) {
    return {
        resolve: function resolve(chtOpt, cols) {
            return [chtOpt, cols];
        },
        pre: function pre(chtOpt, cols) {
            return true;
        }
    };
};

var createAxisResolver = function createAxisResolver(axis) {
    return function (config) {
        return {
            resolve: function resolve(chtOpt, cols) {
                if (cols.length > 0) {
                    var copy = Object.assign({}, chtOpt);
                    var index = defaultIndex(getColumnIndexByType(cols, config.type || COL_TYPE.NUMERIC), 0);
                    copy[axis][0].selected.push({ name: cols[index].name });
                    return [copy, cols.filter(function (a, i) {
                        return i !== index;
                    })];
                }
                return [chtOpt, cols];
            },
            pre: function pre(chtOpt, cols) {
                return chtOpt[axis][0].selected.length === 0;
            }
        };
    };
};

var xResolver = exports.xResolver = createAxisResolver('xAxis');
var yResolver = exports.yResolver = createAxisResolver('yAxis');

var imageColumnResolver = exports.imageColumnResolver = function imageColumnResolver(config) {
    return {
        resolve: function resolve(chtOpt, cols) {
            var idx = cols.findIndex(function (col) {
                return COL_TYPE.IMAGE.indexOf(col.type) >= 0;
            });
            if (idx >= 0) {
                var copy = Object.assign({}, chtOpt);
                copy.imageColumn[0].selected.push({ name: cols[idx].name });
                return [copy, cols.slice(0, idx).concat(cols.slice(idx + 1))];
            }
            return [chtOpt, cols];
        },
        pre: function pre(chtOpt, cols) {
            return chtOpt.imageColumn[0].selected.length === 0;
        }
    };
};

var colorByResolver = exports.colorByResolver = function colorByResolver(config) {
    return {
        resolve: function resolve(chtOpt, cols) {
            if (cols.filter(categorical).length >= 1) {
                var copy = Object.assign({}, chtOpt);
                copy.colorBy[0].selected.push({ name: cols[0].name });
                return copy;
            }
        },
        pre: function pre(chtOpt, cols) {
            return chtOpt.colorBy[0].selected.length === 0;
        }
    };
};

var stackByResolver = exports.stackByResolver = function stackByResolver(config) {
    if (!config.type) throw new Error('type config not specified');
    var type = config.type;
    return {
        resolve: function resolve(chtOpt, cols) {
            var index = indexOf(cols, categorical);
            if (index === -1) return [chtOpt, cols];

            var copy = Object.assign({}, chtOpt);
            copy.plotOptions[type].stackBy[0].selected.push({ name: cols[index].name });
            return [copy, cols.filter(function (a, i) {
                return i !== index;
            })];
        },
        pre: function pre(chtOpt, cols) {
            return chtOpt.plotOptions[type].stackBy[0].selected.length === 0;
        }
    };
};

/***/ }),
/* 664 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertDataTypeForText = convertDataTypeForText;
exports.convertDataTypeForTitle = convertDataTypeForTitle;
exports.getTypes = getTypes;
/**
 * Created by ty_tree.kim on 2017-05-30.
 */

function convertDataTypeForText(type, internalType) {
    // String, Integer, Double, Date,
    // Array(String), Array(Integer), Array(Double), Array(Date),
    // Map, XML
    //
    // => Array의 경우 다음과 같이 축약함
    // Array(S), Array(I), Array(Db), Array(Dt)

    if (type === undefined) {
        return '-';
    } else if (type.indexOf('[') !== -1) {
        var arrayType = internalType.replace('[]', '');
        var arrayTypeAbbreviation;
        switch (arrayType) {
            case 'String':
                arrayTypeAbbreviation = 'S';
                break;
            case 'Integer':
                arrayTypeAbbreviation = 'I';
                break;
            case 'Long':
                arrayTypeAbbreviation = 'L';
                break;
            case 'Double':
                arrayTypeAbbreviation = 'Db';
                break;
            case 'Date':
                arrayTypeAbbreviation = 'Dt';
                break;
            case 'Boolean':
                arrayTypeAbbreviation = 'Bl';
                break;
            case 'Byte':
                arrayTypeAbbreviation = 'Bt';
                break;
            default:
                arrayTypeAbbreviation = arrayType;
        }
        return 'Array(' + arrayTypeAbbreviation + ')';
    } else if (type === 'map') {
        return 'Map';
    } else {
        return internalType;
    }
}

function convertDataTypeForTitle(type, internalType) {
    if (type === undefined) {
        return 'Undefined Type';
    } else if (type.indexOf('[') !== -1) {
        var arrayType = internalType.replace('[]', '');
        return 'Array(' + arrayType + ')';
    } else {
        return internalType;
    }
}

function getTypes() {
    return [{
        type: 'number',
        internalType: 'Integer'
    }, {
        type: 'number',
        internalType: 'Long'
    }, {
        type: 'number',
        internalType: 'Double'
    }, {
        type: 'string',
        internalType: 'Boolean'
    }, {
        type: 'string',
        internalType: 'String'
    }, {
        type: 'number[]',
        internalType: 'Double[]'
    }, {
        type: 'number[]',
        internalType: 'Long[]'
    }, {
        type: 'string[]',
        internalType: 'Boolean[]'
    }, {
        type: 'string[]',
        internalType: 'String[]'
    }, {
        type: 'byte[]',
        internalType: 'Byte[]'
    }, {
        type: 'number[]',
        internalType: 'Double[]'
    }, {
        type: 'number[]',
        internalType: 'Long[]'
    }, {
        type: 'string[]',
        internalType: 'String[]'
    }, {
        type: 'byte[]',
        internalType: 'Byte[]'
    }, {
        type: 'map',
        internalType: 'Map(Integer,Double)'
    }, {
        type: 'map',
        internalType: 'Map(String,Double)'
    }, {
        type: 'map',
        internalType: 'Map(Integer,Double)'
    }, {
        type: 'map',
        internalType: 'Map(String,String)'
    }, {
        type: 'date',
        internalType: 'Date'
    }];
}

/***/ }),
/* 665 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dialog = exports.FormatHelperDialog = exports.ItemSelectorDialog = exports.DataSourceSelectorDialog = exports.ColumnSelectorDialog = exports.ColorPickerDialog = exports.ChartTypeSelectorDialog = undefined;

var _chartTypeSelectorDialog = __webpack_require__(283);

var _chartTypeSelectorDialog2 = _interopRequireDefault(_chartTypeSelectorDialog);

var _colorPickerDialog = __webpack_require__(277);

var _colorPickerDialog2 = _interopRequireDefault(_colorPickerDialog);

var _columnSelectorDialog = __webpack_require__(120);

var _columnSelectorDialog2 = _interopRequireDefault(_columnSelectorDialog);

var _datasourceSelectorDialog = __webpack_require__(282);

var _datasourceSelectorDialog2 = _interopRequireDefault(_datasourceSelectorDialog);

var _itemSelectorDialog = __webpack_require__(285);

var _itemSelectorDialog2 = _interopRequireDefault(_itemSelectorDialog);

var _formatHelperDialog = __webpack_require__(75);

var _formatHelperDialog2 = _interopRequireDefault(_formatHelperDialog);

var _dialog = __webpack_require__(42);

var _dialog2 = _interopRequireDefault(_dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ChartTypeSelectorDialog = _chartTypeSelectorDialog2.default;
exports.ColorPickerDialog = _colorPickerDialog2.default;
exports.ColumnSelectorDialog = _columnSelectorDialog2.default;
exports.DataSourceSelectorDialog = _datasourceSelectorDialog2.default;
exports.ItemSelectorDialog = _itemSelectorDialog2.default;
exports.FormatHelperDialog = _formatHelperDialog2.default;
exports.Dialog = _dialog2.default;

/***/ }),
/* 666 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOptionUtil = __webpack_require__(30);

var _datasourcePanel = __webpack_require__(668);

var _datasourcePanel2 = _interopRequireDefault(_datasourcePanel);

var _chartWorksheet = __webpack_require__(669);

var _chartWorksheet2 = _interopRequireDefault(_chartWorksheet);

var _chartOptionPanel = __webpack_require__(672);

var _chartOptionPanel2 = _interopRequireDefault(_chartOptionPanel);

var _filterPanel = __webpack_require__(673);

var _filterPanel2 = _interopRequireDefault(_filterPanel);

var _datasource = __webpack_require__(296);

var _datasource2 = _interopRequireDefault(_datasource);

var _setup = __webpack_require__(294);

var setup = _interopRequireWildcard(_setup);

var _autoOptionSelector = __webpack_require__(295);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: bcharts-adonis.js
 * Created by daewon.park on 2017-04-27.
 */

var ChartWidget = Brightics.Chart.Widget;

function BChartsAdonis(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

BChartsAdonis.prototype = Object.create(ChartWidget.prototype);
BChartsAdonis.prototype.constructor = BChartsAdonis;

BChartsAdonis.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this.autoOptionSelector = (0, _autoOptionSelector.buildAutoOptionSelector)(this.options.autoColumnSelector);
};

BChartsAdonis.prototype.destroy = function () {
    if (this.dataSourcePanel) this.dataSourcePanel.destroy();
    if (this.worksheet) this.worksheet.destroy();
    if (this.chartOptionPanel) this.chartOptionPanel.destroy();
};

BChartsAdonis.prototype._createContents = function ($parent) {
    this.$mainControl = $('' + '<div class="bcharts-adonis">' + '   <div class="bcharts-adonis-left bcharts-adonis-display-flex bcharts-adonis-flex-direction-column"></div>' + '   <div class="bcharts-adonis-center"></div>' + '   <div class="bcharts-adonis-right bcharts-adonis-display-flex bcharts-adonis-flex-direction-column"></div>' + '</div>');
    this.$mainControl.css(this.options.style);

    $parent.append(this.$mainControl);
    this._filterAreaComponent();
    this._renderDataSources();
};

BChartsAdonis.prototype._filterAreaComponent = function () {
    var $leftComp = this.$mainControl.find('.bcharts-adonis-left');
    var $rightComp = this.$mainControl.find('.bcharts-adonis-right');
    if (this.options.component) {
        if (this.options.component.left) {
            this._createLeftArea($leftComp);
        } else {
            $leftComp.css('display', 'none');
        }

        if (this.options.component.right) {
            this._createRightArea($rightComp);
        } else {
            $rightComp.css('display', 'none');
        }
    } else {
        $leftComp.css('display', 'none');
        $rightComp.css('display', 'none');
    }

    this._createEditorArea(this.$mainControl.find('.bcharts-adonis-center'));
};

BChartsAdonis.prototype._createLeftArea = function ($parent) {
    if (this.options.component && this.options.component.left) {
        var leftPanelAreaOption = this.options.component.left;
        if (leftPanelAreaOption.dataSource) {
            $parent.append('' + '<div class="bcharts-adonis-viewpart datasource">' + '   <div class="bcharts-adonis-viewpart-header">DATA BOX</div>' + '   <div class="bcharts-adonis-viewpart-contents"></div>' + '</div>');

            this.dataSourcePanel = new _datasourcePanel2.default($parent.find('.bcharts-adonis-viewpart-contents'), {
                style: {
                    width: '100%',
                    height: '100%'
                }
            });
        }
    }
};

BChartsAdonis.prototype._createEditorArea = function ($parent) {
    var _this = this;

    var opt = {
        style: {
            width: '100%',
            height: '100%'
        },
        worksheet: this.options.worksheet
    };

    for (var i in this.options.worksheet.panel) {
        var panelOptions = this.options.worksheet.panel[i];
        panelOptions.chartTypeChanged = this.setChartTypeOptions.bind(this);
    }

    this.worksheet = new _chartWorksheet2.default($parent, opt);

    this.worksheet.bindEventHandler('closePanel', function (e, panel) {
        try {
            if (_this.chartOptionPanel) {
                _this.chartOptionPanel.remove(panel.getOptions().id);
            }
            if (_this.filterPanel) {
                _this.filterPanel.remove(panel.getOptions().id);
            }
        } catch (ex) {
            console.log(ex);
        }
    });

    this.worksheet.bindEventHandler('selectPanel', function (e, panel) {
        try {
            panel.$contentsControl.bcharts('reloadColumnConf');

            if (_this.chartOptionPanel) {
                if (_this.chartOptionPanel.getChartId() === panel.getOptions().id) return;
                // TODO ChartOptionPanel 에 차트 타입 변경에 따른 render 가 구현이 안되어 있어서 강제로 삭제하고 render 함. by daewon.park since 2017-05-24
                _this.chartOptionPanel.remove(panel.getOptions().id);
                _this.chartOptionPanel.render(panel.getOptions());
            }
            if (_this.filterPanel) {
                if (_this.filterPanel.getChartId() === panel.getOptions().id) return;
                _this.filterPanel.remove(panel.getOptions().id);
                var options = {
                    chartId: panel.getOptions().id,
                    chartOption: panel.getOptions().chartOption,
                    filterOption: panel.getFilter(),
                    groupId: panel.getGroup()
                };
                _this.filterPanel.render(options);
            }
        } catch (ex) {
            console.error(ex);
        }
    });
};

BChartsAdonis.prototype._createRightArea = function ($parent) {
    var _this = this;

    if (this.options.component && this.options.component.right) {
        var rightAreaOption = this.options.component.right;

        if (rightAreaOption.chartOption) {
            $parent.append('' + '<div class="bcharts-adonis-viewpart chart-option">' + '   <div class="bcharts-adonis-viewpart-header">PROPERTIES</div>' + '   <div class="bcharts-adonis-viewpart-contents chart-option"></div>' + '</div>');

            this.chartOptionPanel = new _chartOptionPanel2.default($parent.find('.bcharts-adonis-viewpart-contents.chart-option'), {
                style: {
                    width: '100%',
                    height: '100%'
                },
                changed: function changed(chartId, chartOptions) {
                    _this.worksheet.setChartOptions(chartId, chartOptions);
                },
                typeChanged: function typeChanged(chartId, chartOptions) {
                    _this.setChartTypeOptions(chartId, chartOptions.chart.type);
                },
                columnConf: this.options.columnConf
            });
        }

        if (rightAreaOption.filter) {
            $parent.append('' + '<div class="bcharts-adonis-viewpart filter">' + '   <div class="bcharts-adonis-viewpart-header">FILTERS</div>' + '   <div class="bcharts-adonis-viewpart-contents filter"></div>' + '</div>');

            this.filterPanel = new _filterPanel2.default($parent.find('.bcharts-adonis-viewpart-contents.filter'), {
                style: {
                    width: '100%',
                    height: '100%'
                },
                changed: function changed(chartId, filterOptions) {
                    _this.worksheet.chartPanels[chartId].setFilter(filterOptions);
                }
            });
        }
    }
};

BChartsAdonis.prototype._renderDataSources = function () {
    var _this = this;
    if (this.dataSourcePanel) {
        this.dataSourcePanel.addControl(function ($parent) {
            for (var i in _this.options.datasources) {
                new _datasource2.default($parent, _this.options.datasources[i]);
            }
        });
    }
};

BChartsAdonis.prototype.addChartPanel = function (panelOptions) {
    this.worksheet.addChartPanel(panelOptions);
};

BChartsAdonis.prototype.removeChartPanel = function (panelId) {
    this.worksheet.removeChartPanel(panelId);
};

BChartsAdonis.prototype.selectChartPanel = function (panelId) {
    this.worksheet.selectChartPanel(panelId);
};

BChartsAdonis.prototype.setChartOptions = function (id, options) {
    if (this.worksheet) {
        this.worksheet.setChartOptions(id, options);
    }

    if (this.chartOptionPanel) {
        var panelOption = this.chartOptionPanel.getOptionsById(id) || {};
        panelOption.id = id;
        panelOption.chartOption = options;
        this.chartOptionPanel.render(panelOption);
    }
};

//if chart type changed, should set default options.
BChartsAdonis.prototype.setChartTypeOptions = function (id, chartType) {
    var _this2 = this;

    var panelOption = this.chartOptionPanel.getOptionsById(id) || {};

    var colorSet = (panelOption.chartOption.colorSet || Brightics.Chart.getChartAttr(chartType).DefaultOptions.colorSet).slice();
    panelOption.chartOption = $.extend(true, {}, Brightics.Chart.getChartAttr(chartType).DefaultOptions, panelOption.chartOption, { chart: { type: chartType } });
    panelOption.chartOption.colorSet = colorSet;

    panelOption.chartOption = function (chartOption) {
        try {
            return _this2.autoOptionSelector(chartOption.chart.type, chartOption, chartOption.source.lazyData[0].columns());
        } catch (e) {
            // fail
            console.warn('failed to auto select');
        }
        return chartOption;
    }(panelOption.chartOption);

    if (this.worksheet) {
        this.worksheet.setChartTypeOptions(id, panelOption.chartOption);
    }

    if (this.chartOptionPanel) {
        panelOption.id = id;
        this.chartOptionPanel.render(panelOption);
    }

    if (this.filterPanel) {
        this.filterPanel.setChartType(id, chartType);
    }
};

BChartsAdonis.prototype.setDataSource = function (id, newDataSource) {
    if (newDataSource.source) {
        newDataSource = newDataSource.source;
        delete newDataSource.source;
        console.warn('[Deprecation] BChartsAdonis.setDataSource method parameter changed.');
    }

    if (this.worksheet) {
        this.worksheet.setDataSource(id, newDataSource);
    }

    if (this.chartOptionPanel && this.chartOptionPanel.chartOptionControlMap[id]) {
        var currentChartOptions = this.chartOptionPanel.chartOptionControlMap[id].getOptions();
        currentChartOptions.id = id;
        currentChartOptions.chartOption.source = newDataSource;
        this.chartOptionPanel.render(currentChartOptions);
    }

    if (this.filterPanel && this.filterPanel.filterControlMap[id]) {
        var filterOptions = $.extend(true, {}, this.filterPanel.getOptionsById(id));
        this.filterPanel.remove(id);
        var newFilterOptions = {
            chartId: filterOptions.chartId,
            chartOption: filterOptions.chartOption,
            filterOption: filterOptions.filter
        };
        newFilterOptions.chartOption.source = newDataSource;
        this.filterPanel.render(newFilterOptions);
    }
};

BChartsAdonis.prototype.layout = function (direction) {
    this.worksheet.layout(direction);
};

BChartsAdonis.prototype.refreshChartPanel = function (panelId) {
    this.worksheet.refreshChartPanel(panelId);
};

BChartsAdonis.setupMapList = function (mapList) {
    setup.set('MapList', $.extend(true, [], mapList));
    // Setup.MapList = $.extend(true,[],mapList);
};

global.bchartsAdonis = BChartsAdonis;
Brightics.Chart.Adonis.BChartsAdonis = BChartsAdonis;

exports.default = BChartsAdonis;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(667)))

/***/ }),
/* 667 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 668 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: datasource-panel.js
 * Created by daewon.park on 2017-04-27.
 */

var ChartWidget = Brightics.Chart.Widget;

function DataSourcePanel(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

DataSourcePanel.prototype = Object.create(ChartWidget.prototype);
DataSourcePanel.prototype.constructor = DataSourcePanel;

DataSourcePanel.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
};

DataSourcePanel.prototype.destroy = function () {};

DataSourcePanel.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-ds-panel"></div>');
    this.$mainControl.css(this.options.style);
    $parent.append(this.$mainControl);
    this.$mainControl.perfectScrollbar();
};

DataSourcePanel.prototype.addControl = function (callback) {
    callback(this.$mainControl);
    this.$mainControl.perfectScrollbar('update');
};

exports.default = DataSourcePanel;

/***/ }),
/* 669 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartLayout = __webpack_require__(670);

var _chartLayout2 = _interopRequireDefault(_chartLayout);

var _chartPanel = __webpack_require__(297);

var _chartPanel2 = _interopRequireDefault(_chartPanel);

var _detailChartPanel = __webpack_require__(671);

var _detailChartPanel2 = _interopRequireDefault(_detailChartPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: chart-worksheet.js
 * Created by daewon.park on 2017-04-27.
 */

var ChartWidget = Brightics.Chart.Widget;

function ChartWorksheet(parentId, options) {
    this.chartPanels = {};
    ChartWidget.call(this, parentId, options);
}

ChartWorksheet.prototype = Object.create(ChartWidget.prototype);
ChartWorksheet.prototype.constructor = ChartWorksheet;

ChartWorksheet.prototype._init = function () {
    ChartWidget.prototype._init.call(this);

    if (this.options.worksheet.panel.length === 1) {
        this.options.worksheet.layout.type = 'panel';
        this.options.worksheet.layout.id = this.options.worksheet.panel[0].id;
    }
};

ChartWorksheet.prototype.destroy = function () {
    this.$mainControl.unbind();
    for (var i in this.chartPanels) {
        this.chartPanels[i].destroy();
    }
    this.layoutManager.destroy();
};

ChartWorksheet.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-worksheet"></div>');
    this.$mainControl.css(this.options.style);
    $parent.append(this.$mainControl);
    this._bindEventHandlers();

    this.layoutManager = new _chartLayout2.default(this.$mainControl, {
        layout: $.extend(true, {}, this.options.worksheet.layout)
    });
    this.layoutManager.layout();

    this._configureLayout();

    this._createChartPanels();
};

ChartWorksheet.prototype._configureLayout = function () {
    var panels = this.options.worksheet.panel;
    var panel,
        isExist = false;
    for (var i = 0; i < panels.length; i++) {
        panel = panels[i];
        if ($.isEmptyObject(this.options.worksheet.layout) || !this._isPanelExistInLayout(panel.id, [this.options.worksheet.layout])) {
            this.layoutManager.addPanel(panel.id, 'horizontal', false);
        }
    }
};

ChartWorksheet.prototype._isPanelExistInLayout = function (panelId, layoutes) {
    var isExist = false;
    for (var i = 0; i < layoutes.length; i++) {
        if (isExist === true) break;
        if (layoutes[i].type === 'panel') {
            if (panelId === layoutes[i].id) {
                isExist = true;
            }
        } else {
            isExist = this._isPanelExistInLayout(panelId, layoutes[i].items);
        }
    }
    return isExist;
};

ChartWorksheet.prototype._fireEvent = function (eventName, eventParam) {
    this.$mainControl.trigger(eventName, eventParam);
};

ChartWorksheet.prototype.bindEventHandler = function (event, handler) {
    this.$mainControl.bind(event, handler);
};

ChartWorksheet.prototype._bindEventHandlers = function () {
    var _this = this;

    this.$mainControl.bind('addPanel', function (e, panel, layout) {
        if (typeof _this.options.worksheet.onAddChart === 'function') {
            _this.options.worksheet.onAddChart(panel.getOptions(), layout);
        }
    });

    this.$mainControl.bind('selectPanel', function (e, panel) {
        if (typeof _this.options.worksheet.onSelectChart === 'function') {
            _this.options.worksheet.onSelectChart(panel.getOptions());
        }
    });

    this.$mainControl.bind('closePanel', function (e, panel, layout) {
        if (typeof _this.options.worksheet.onRemoveChart === 'function') {
            _this.options.worksheet.onRemoveChart(panel.getOptions(), layout);
        }
    });

    this.$mainControl.bind('movePanel', function (e, $panel, $target, anchor) {
        _this._movePanel($panel, $target, anchor);
    });

    this.$mainControl.bind('changeLayout', function (e, layout) {
        if (typeof _this.options.worksheet.onChangeLayout === 'function') {
            _this.options.worksheet.onChangeLayout(layout);
        }
    });

    this.$mainControl.bind('changeChart', function (e, panel, changed) {
        if (typeof _this.options.worksheet.onChangeChart === 'function') {
            _this.options.worksheet.onChangeChart(panel.getOptions(), changed);
        }
    });
};

ChartWorksheet.prototype._createChartPanel = function ($parent, panelOption) {
    var _this = this;
    var $parent = this.layoutManager.findPanelControl(panelOption.id);
    var chartPanel;
    if (panelOption.panelType === 'detail') {
        chartPanel = new _detailChartPanel2.default($parent, panelOption);
    } else {
        chartPanel = new _chartPanel2.default($parent, panelOption);
    }
    chartPanel.createToolbar(this.options.worksheet.toolbar);
    chartPanel.$mainControl.mousedown(function () {
        _this.selectChartPanel($(this).attr('id'));
    });
    this.chartPanels[panelOption.id] = chartPanel;
    chartPanel.$mainControl.data('chartPanel', chartPanel);
    var group = this._getPanelGroup(panelOption);
    chartPanel.connect(group);

    return chartPanel;
};

ChartWorksheet.prototype.selectChartPanel = function (panelId) {
    var $chartPanel = this.$mainControl.find('#' + panelId).find('.bcharts-ws-panel');

    if (this.options.worksheet.$panelSelectionGroup) {
        this.options.worksheet.$panelSelectionGroup.find('.bcharts-ws-panel.ui-selected').removeClass('ui-selected');
    } else {
        this.$mainControl.find('.bcharts-ws-panel.ui-selected').removeClass('ui-selected');
    }
    $chartPanel.addClass('ui-selected');

    this._fireEvent('selectPanel', [this.chartPanels[panelId]]);
};

ChartWorksheet.prototype._getPanelGroup = function (panelOption) {

    var group = panelOption.group;
    if (typeof group === 'undefined') {
        this._newGroupId = this._newGroupId || this.uuid(16);
        group = this._newGroupId;
        panelOption.group = group;
    }

    return group;
};

ChartWorksheet.prototype._destroyChartPanel = function (id) {
    if (this.chartPanels[id]) {
        this.chartPanels[id].destroy();
        this.chartPanels[id] = null;
        delete this.chartPanels[id];
        delete this.chartPanels[id];
    }
};

ChartWorksheet.prototype._createChartPanels = function () {
    var _this = this;
    $.extend(true, this.options.worksheet, {
        toolbar: {
            menu: {}
        }
    });

    if (this.options.worksheet.toolbar.menu.setting) {
        this.options.worksheet.toolbar.menu.setting = $.extend({}, {
            title: 'Chart Settings',
            click: function click() {
                var panel = this;
                _this._handleChartSettings(panel);
            }
        }, this.options.worksheet.toolbar.menu.setting);
    }
    if (this.options.worksheet.toolbar.menu.duplicate) {
        this.options.worksheet.toolbar.menu.duplicate = $.extend({}, {
            title: 'Duplicate',
            click: function click() {
                var panel = this;
                _this._handleDuplicateChart(panel);
            }
        }, this.options.worksheet.toolbar.menu.duplicate);
    }
    if (this.options.worksheet.toolbar.menu.details) {
        this.options.worksheet.toolbar.menu.details = $.extend({}, {
            title: 'Create a Details',
            click: function click() {
                var panel = this;
                _this._handleCreateDetailChart(panel);
            }
        }, this.options.worksheet.toolbar.menu.details);
    }
    if (this.options.worksheet.toolbar.menu.close) {
        this.options.worksheet.toolbar.menu.close = $.extend({}, {
            title: 'Close',
            click: function click() {
                var panel = this;
                _this._handleCloseChart(panel);
            }
        }, this.options.worksheet.toolbar.menu.close);
    }

    for (var i in this.options.worksheet.panel) {
        var $parent = this.layoutManager.findPanelControl(this.options.worksheet.panel[i].id);
        this._createChartPanel($parent, this.options.worksheet.panel[i]);
    }

    $(window).trigger('resize');
};

ChartWorksheet.prototype._handleChartSettings = function (panel) {
    this._fireEvent('selectPanel', [panel]);
};

ChartWorksheet.prototype._handleDuplicateChart = function (panel) {
    var opt = $.extend(true, {}, panel.getOptions());
    // var filter = panel.getFilter();
    opt.id = this.uuid();

    var duplicatedPanel = this.addChartPanel(opt);
    var group = panel.getGroup();
    if (!group) {
        group = this.uuid(16);
        panel.connect(group);
    }
    duplicatedPanel.connect(group);
    // duplicatedPanel.setFilter(filter);
};

ChartWorksheet.prototype._handleCreateDetailChart = function (panel) {
    var opt = $.extend(true, {}, panel.getOptions());
    opt.id = this.uuid();
    opt.panelType = 'detail';

    var group = panel.getGroup();
    if (!group) {
        panel.connect(group = this.uuid(16));
    }
    var subGroup = group + '/details';
    opt.group = subGroup;
    var filter = panel.getSelectedRange();

    opt.chartOption.filter = filter;

    opt.chartOption.chart.background = 'rgb(236,236,236)';
    opt.chartOption.noDataMessage = 'No data selected.';

    var detailPanel = this.addChartPanel(opt);
    detailPanel.connect(subGroup);
    // detailPanel.setFilter(filter);
};

ChartWorksheet.prototype._handleCloseChart = function (panel) {
    var panelOptions = panel.getOptions();
    this.removeChartPanel(panelOptions.id);
};

ChartWorksheet.prototype._movePanel = function ($panel, $target, anchor) {
    this.layoutManager.movePanel($panel, $target, anchor);
};

ChartWorksheet.prototype.addChartPanel = function (panelOptions) {
    var $parent = this.layoutManager.addPanel(panelOptions.id, 'horizontal');
    var newPanel = this._createChartPanel($parent, panelOptions);

    this._fireEvent('addPanel', [newPanel, this.layoutManager.getLayout()]);

    return newPanel;
};

ChartWorksheet.prototype.removeChartPanel = function (id) {
    // 차트가 1개만 있을 경우 or detail chart가 있을 경우 삭제할 수 없다.
    //FIXME: datasource가 여러개일경우 delete policy 정해야함.
    if (Object.keys(this.chartPanels).length > 1 && this.chartPanels[id] && !this._deletePanelAvailable(id)) {
        var panel = this.chartPanels[id];

        this._destroyChartPanel(id);
        this.layoutManager.removePanel(id);

        this._fireEvent('closePanel', [panel, this.layoutManager.getLayout()]);
    }
};

//check has detail chart and other parent panel
ChartWorksheet.prototype._deletePanelAvailable = function (id) {
    var panelOptions = this.chartPanels[id].options;
    var hasChildDetailChart = false;
    var hasOtherParentPanel = false;
    var otherPanelOptions;
    for (var panelId in this.chartPanels) {
        if (id === panelId) continue;
        otherPanelOptions = this.chartPanels[panelId].options;

        if (otherPanelOptions.group && otherPanelOptions.group.startsWith(panelOptions.group) && otherPanelOptions.group !== panelOptions.group) {
            hasChildDetailChart = true;
            if (hasOtherParentPanel) break;
        } else if (otherPanelOptions.group === panelOptions.group) {
            hasOtherParentPanel = true;
            if (hasChildDetailChart) break;
        }
    }
    return hasChildDetailChart && !hasOtherParentPanel;
};

ChartWorksheet.prototype.setChartOptions = function (id, options) {
    if (this.chartPanels[id]) {
        this.chartPanels[id].setChartOptions(options);
    }
};

ChartWorksheet.prototype.setChartTypeOptions = function (id, chartOptions) {
    if (this.chartPanels[id]) {
        var panel = this.chartPanels[id];
        panel.setChartOptions(chartOptions);
    }
};

ChartWorksheet.prototype.setDataSource = function (id, srcOptions) {
    if (this.chartPanels[id]) {
        this.chartPanels[id].setDataSource(srcOptions);
    }
};

ChartWorksheet.prototype.refreshChartPanel = function (id) {
    if (id) {
        if (this.chartPanels[id]) {
            this.chartPanels[id].refresh();
        }
    } else {
        for (var i in this.chartPanels) {
            this.chartPanels[i].refresh();
        }
    }
};

ChartWorksheet.prototype.layout = function (direction) {
    this.layoutManager.layout(direction);
};

exports.default = ChartWorksheet;

/***/ }),
/* 670 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: chart-layout.js
 * Created by daewon.park on 2017-05-10.
 */

var ChartWidget = Brightics.Chart.Widget;

function ChartLayout(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

ChartLayout.prototype = Object.create(ChartWidget.prototype);
ChartLayout.prototype.constructor = ChartLayout;

ChartLayout.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
};

ChartLayout.prototype.destroy = function () {};

ChartLayout.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-layout"></div>');
    this.$mainControl.css(this.options.style);

    $parent.append(this.$mainControl);
};

ChartLayout.prototype.getLayout = function () {
    return this.options.layout;
};

ChartLayout.prototype._reattachPanels = function ($panels) {
    var _this = this;
    $panels.each(function (index, element) {
        var id = $(element).attr('id');
        _this.$mainControl.find('#' + id + '.bcharts-layout-panel').append($(element).children().detach());
    });
    $(window).trigger('resize');
};

ChartLayout.prototype.layout = function (direction) {
    var $panels = this.$mainControl.find('.bcharts-layout-panel').detach();
    this.$mainControl.empty();

    if (direction) {
        var layout;
        if (typeof direction === 'string') {
            layout = this._generateLayout($panels, direction);
        } else {
            layout = direction;
        }
        this._createLayoutControl(this.$mainControl, layout);
        this._reattachPanels($panels);
        this._fireEvent('changeLayout', this.saveLayout());
    } else if (this.options.layout) {
        this._createLayoutControl(this.$mainControl, this.options.layout);
        this._reattachPanels($panels);
    }

    $panels.remove();
};

ChartLayout.prototype._generateLayout = function ($panels, direction) {
    var _this = this,
        layout = {},
        count = 2,
        orientation = 'horizontal';
    $.each($panels, function (index, element) {
        if (index === 0) {
            layout = _this._panel2json($(element));
        } else {
            orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
            if (index > 2 && index % 2 == 1 && direction === 'evenly') {
                layout.items[1] = {
                    type: 'splitter',
                    direction: orientation,
                    ratio: '50%',
                    items: [$.extend(true, {}, layout.items[1]), _this._panel2json($(element))]
                };
                count++;
            } else {
                layout = {
                    type: 'splitter',
                    direction: direction === 'evenly' ? orientation : direction,
                    ratio: direction === 'evenly' ? 100 - 1 * 100 / count + '%' : 100 - 1 * 100 / count++ + '%',
                    items: [$.extend(true, {}, layout), _this._panel2json($(element))]
                };
            }
        }
    });
    return layout;
};

ChartLayout.prototype._createLayoutControl = function ($parent, layoutOption) {
    var $composite = this._createCompositeControl();
    $parent.append($composite);

    if (layoutOption.type == 'splitter') {
        $composite.append(this._createSplitterControl(layoutOption));
        this.refreshSplitter();
    } else if (layoutOption.type == "panel") {
        $composite.append(this._createPanelControl(layoutOption));
    }
};

ChartLayout.prototype._createCompositeControl = function () {
    return $('<div class="bcharts-layout-composite">');
};

ChartLayout.prototype._createSplitterControl = function (layout) {
    var $splitter = $('<div class="bcharts-layout-splitter">');
    for (var i in layout.items) {
        this._createLayoutControl($splitter, layout.items[i]);
    }

    this._splitter($splitter, layout);
    return $splitter;
};

ChartLayout.prototype._createPanelControl = function (layout) {
    var $panelControl = $('<div class="bcharts-layout-panel">');
    $panelControl.attr('id', layout.id);

    return $panelControl;
};

ChartLayout.prototype._splitter = function ($splitter, option) {
    var _this = this;
    $splitter.jqxSplitter({
        theme: 'office',
        width: '100%',
        height: '100%',
        resizable: option.resizable === false ? option.resizable : true,
        orientation: option.direction,
        panels: [{
            size: option.ratio
        }]
    });
    $splitter.on('resize', function (event) {
        _this._fireEvent('changeLayout', _this.saveLayout());
    });
};

ChartLayout.prototype.toJSON = function () {
    return this._convert2json(this.$mainControl, {});
};

ChartLayout.prototype.saveLayout = function () {
    this.options.layout = this._convert2json(this.$mainControl, {});
    return this.options.layout;
};

ChartLayout.prototype._convert2json = function (splitter, json) {
    var _this = this;
    $.each(splitter.children(), function (index, child) {
        if (_this.isCompositeControl($(child))) {
            var $control = $(child).children();

            if (_this.isSplitterControl($control)) {
                var layout = _this._splitter2json($control);
                if (json.items) json.items.push(layout);else json = layout;

                _this._convert2json($control, layout);
            }

            if (_this.isPanelControl($control)) {
                if (json.items) json.items.push(_this._panel2json($control));else json = _this._panel2json($control);
            }
        }
    });

    return json;
};

ChartLayout.prototype.isCompositeControl = function ($control) {
    return $control.hasClass('bcharts-layout-composite');
};

ChartLayout.prototype.isSplitterControl = function ($control) {
    return $control.hasClass('bcharts-layout-splitter');
};

ChartLayout.prototype.isPanelControl = function ($control) {
    return $control.hasClass('bcharts-layout-panel');
};

ChartLayout.prototype._closestCompositeControl = function ($control) {
    return $control.closest('.bcharts-layout-composite');
};

ChartLayout.prototype._closestSplitterControl = function ($control) {
    return $control.closest('.bcharts-layout-splitter');
};

ChartLayout.prototype._closestPanelControl = function ($control) {
    return $control.closest('.bcharts-layout-panel');
};

ChartLayout.prototype.findPanelControl = function (id) {
    return this.$mainControl.find('.bcharts-layout-panel[id="' + id + '"]');
};

ChartLayout.prototype._splitter2json = function ($splitter) {
    return {
        type: 'splitter',
        direction: $splitter.jqxSplitter('orientation'),
        ratio: $splitter.jqxSplitter('panels')[0].size,
        items: []
    };
};

ChartLayout.prototype._panel2json = function ($panel) {
    return {
        id: $panel.attr('id'),
        type: 'panel'
    };
};

ChartLayout.prototype._fireEvent = function (eventName, eventParam) {
    this.$mainControl.closest('.bcharts-worksheet').trigger(eventName, eventParam);
};

ChartLayout.prototype.addPanel = function (id, direction, isSave) {
    var $composite = this.$mainControl.children('.bcharts-layout-composite');
    var currentPanelCount = this.$mainControl.find('.bcharts-layout-panel').length;
    var $panel = this._createPanelControl({
        id: id,
        type: 'panel'
    });

    if (currentPanelCount === 0) {
        $composite.append($panel);
    } else {
        var splitterCount = this.$mainControl.find('.jqx-splitter-splitbar-' + direction).length;
        var ratio = 1 * 100 / (splitterCount + 2.0);

        $composite.append(this._attachPanelControl($composite.children(), $panel, {
            direction: direction,
            anchor: 'top',
            ratio: ratio + '%'
        }));
        this.refreshSplitter();
        if (isSave !== false) {
            this.saveLayout();
        }
    }

    return $panel;
};

ChartLayout.prototype.movePanel = function ($panel, $target, anchor) {
    var $sourcePanel = this._closestPanelControl($panel);
    this._detachPanelControl($sourcePanel.attr('id'));

    var $targetComposite = this._closestCompositeControl($target);
    var $targetPanel = this._closestPanelControl($target);

    $targetComposite.append(this._attachPanelControl($targetPanel, $sourcePanel, {
        direction: anchor === 'top' || anchor === 'bottom' ? 'horizontal' : 'vertical',
        ratio: '50%',
        anchor: anchor
    }));

    this.refreshSplitter();
    this._fireEvent('changeLayout', this.saveLayout());
};

ChartLayout.prototype.removePanel = function (id) {
    this._detachPanelControl(id).remove();
    this.refreshSplitter();
    this.saveLayout();
};

ChartLayout.prototype._attachPanelControl = function ($targetControl, $control, option) {
    var $splitterControl = $('<div class="bcharts-layout-splitter">');
    var $compositeControl1 = this._createCompositeControl();
    var $compositeControl2 = this._createCompositeControl();
    $splitterControl.append($compositeControl1);
    $splitterControl.append($compositeControl2);

    if (option.anchor === 'top' || option.anchor === 'left') {
        $compositeControl1.append($control);
        $compositeControl2.append($targetControl.detach());
    } else {
        $compositeControl1.append($targetControl.detach());
        $compositeControl2.append($control);
    }

    this._splitter($splitterControl, option);
    return $splitterControl;
};

ChartLayout.prototype._detachPanelControl = function (id) {
    var $targetPanelControl = this.$mainControl.find('.bcharts-layout-panel#' + id);
    var $splitterControl = this._closestSplitterControl($targetPanelControl);
    var $splitterCompositeControl = this._closestCompositeControl($splitterControl);

    var $compositeControls = $splitterControl.children('.bcharts-layout-composite');
    var $noneTargetControl = this._closestCompositeControl($targetPanelControl).index() === 0 ? $($compositeControls[1]) : $($compositeControls[0]);

    var $contentsPanelControl = $targetPanelControl.detach();
    if ($noneTargetControl) $splitterCompositeControl.children().replaceWith($noneTargetControl.children().detach());

    return $contentsPanelControl;
};

ChartLayout.prototype.refreshSplitter = function () {
    var $splitter = this.$mainControl.find('.bcharts-layout-splitter');
    if ($splitter.length > 0) {
        $splitter.jqxSplitter('refresh');
    }
    $(window).trigger('resize');
};

exports.default = ChartLayout;

/***/ }),
/* 671 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartPanel = __webpack_require__(297);

var _chartPanel2 = _interopRequireDefault(_chartPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DetailChartPanel(parentId, options) {
    _chartPanel2.default.call(this, parentId, options);
} /**
   * Source : detail-chart-panel.js
   * Created by ng1123.kim on 2017-10-07
   */

DetailChartPanel.prototype = Object.create(_chartPanel2.default.prototype);
DetailChartPanel.prototype.constructor = DetailChartPanel;

DetailChartPanel.prototype.createToolbar = function (toolbar) {
    var _this = this;
    var $toolbar = this.$headerControl.find('.bcharts-ws-panel-toolbar');
    for (var key in toolbar.menu) {
        if (key !== 'close' && key !== 'setting') continue;
        var $item = $('<div class="bcharts-ws-panel-toolitem"></div>');
        $item.attr('action', key);
        $item.attr('title', toolbar.menu[key].title);
        $toolbar.append($item);

        if (typeof toolbar.menu[key].init === 'function') {
            toolbar.menu[key].init($item);
        }
        if (typeof toolbar.menu[key].click === 'function') {
            $item.click(toolbar.menu[key].click.bind(_this));
        }
    }
};

DetailChartPanel.prototype._configureChartOptions = function () {
    $.extend(true, this.options.chartOption.toolbar, { type: 'custom', show: false, menu: {} });
};

exports.default = DetailChartPanel;

/***/ }),
/* 672 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartOption = __webpack_require__(116);

var _chartOption2 = _interopRequireDefault(_chartOption);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source: chart-option-panel.js
 * Created by daewon.park on 2017-04-27.
 */

var ChartWidget = Brightics.Chart.Widget;

function ChartOptionPanel(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

ChartOptionPanel.prototype = Object.create(ChartWidget.prototype);
ChartOptionPanel.prototype.constructor = ChartOptionPanel;

ChartOptionPanel.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
};

ChartOptionPanel.prototype.destroy = function () {
    this.$mainControl.remove();
};

ChartOptionPanel.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-option-panel"></div>');
    this.$mainControl.css(this.options.style);
    this.chartOptionControlMap = {};

    $parent.append(this.$mainControl);
};

ChartOptionPanel.prototype._hideAllControl = function () {
    for (var key in this.chartOptionControlMap) {
        this.chartOptionControlMap[key].hide();
    }
};

ChartOptionPanel.prototype.render = function (panelOptions) {
    var _this = this;
    var chartId = panelOptions.id;
    var chartOptions = panelOptions.chartOption;
    this._hideAllControl();
    if (typeof this.chartOptionControlMap[chartId] === 'undefined') {
        var newChartOption = {
            chartOption: $.extend(true, {}, chartOptions),
            callBack: {
                onChartOptionChanged: function onChartOptionChanged(chartOption) {
                    if (typeof _this.options.changed === 'function') {
                        _this.options.changed(chartId, chartOption);
                    }
                },
                onChartTypeChanged: function onChartTypeChanged(chartOption) {
                    if (typeof _this.options.typeChanged === 'function') {
                        _this.options.typeChanged(chartId, chartOption);
                    }
                },
                onDataSourceChanged: function onDataSourceChanged(dataSource) {
                    if (typeof panelOptions.dataSource.onDataSourceChangedCallBack === 'function') {
                        panelOptions.dataSource.onDataSourceChangedCallBack(chartId, dataSource.dataSourceValueList);
                    } else if (panelOptions.callBack && typeof panelOptions.callBack.onExtendedDataSourceChanged === 'function') {
                        panelOptions.callBack.onExtendedDataSourceChanged(dataSource, chartId);
                    }
                }
            },
            chartTypeSelectable: true,
            chartTypeList: Brightics.Chart.getChartTypeList().sort()
        };

        newChartOption = _this._customizeChartOption(newChartOption, panelOptions);

        this.chartOptionControlMap[chartId] = new _chartOption2.default(this.$mainControl, newChartOption);
        this.chartId = chartId;
    } else {
        this.chartOptionControlMap[chartId].setChartOptions(chartOptions);
        this.chartOptionControlMap[chartId].show();
    }
};

ChartOptionPanel.prototype._customizeChartOption = function (chartOption, panelOption) {
    chartOption.columnConf = this.options.columnConf || Brightics.Chart.getChartAttr(panelOption.chartOption.chart.type).ColumnConf;

    if (typeof this.options.chartTypeList !== 'undefined') {
        chartOption.chartTypeList = this.options.chartTypeList;
    }

    if (typeof panelOption.chartTypeList !== 'undefined') {
        chartOption.chartTypeList = panelOption.chartTypeList;
    }

    if (typeof this.options.chartTypeSelectable !== 'undefined') {
        chartOption.chartTypeSelectable = this.options.chartTypeSelectable;
    }

    if (typeof panelOption.chartTypeSelectable !== 'undefined') {
        chartOption.chartTypeSelectable = panelOption.chartTypeSelectable;
    }

    if (typeof panelOption.callBack !== 'undefined') {
        chartOption.callBack = $.extend(true, {}, chartOption.callBack, panelOption.callBack);
    }

    if (typeof panelOption.dataSource !== 'undefined') {
        chartOption.dataSource = panelOption.dataSource;
    }

    if (typeof panelOption.chartTypeSelectable !== 'undefined') {
        chartOption.chartTypeSelectable = panelOption.chartTypeSelectable;
    }

    return chartOption;
};

ChartOptionPanel.prototype.remove = function (chartId) {
    if (this.chartOptionControlMap[chartId]) {
        this.chartOptionControlMap[chartId].destroy();
        delete this.chartOptionControlMap[chartId];
    }
};

ChartOptionPanel.prototype.getOptionsById = function (chartId) {
    if (this.chartOptionControlMap[chartId]) {
        return this.chartOptionControlMap[chartId].options;
    }
};

ChartOptionPanel.prototype.getChartId = function () {
    return this.chartId;
};

exports.default = ChartOptionPanel;

/***/ }),
/* 673 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filterControlFactory = __webpack_require__(123);

var FilterControlFactory = _interopRequireWildcard(_filterControlFactory);

var _filter = __webpack_require__(677);

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Source: filter-panel.js
 * Created by ji_sung.park on 2017-09-20.
 */

var ChartWidget = Brightics.Chart.Widget;


function FilterPanel(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

FilterPanel.prototype = Object.create(ChartWidget.prototype);
FilterPanel.prototype.constructor = FilterPanel;

FilterPanel.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
};

FilterPanel.prototype.destroy = function () {
    this.$mainControl.remove();
};

FilterPanel.prototype._createContents = function ($parent) {
    this.$mainControl = $('<div class="bcharts-filter-panel"></div>');
    this.$mainControl.css(this.options.style);
    this.$messageArea = $(' <div class="bcharts-filter-panel-message-area bfs-display-flex-center bfs-text-blur"><div></div></div>');
    this.$mainControl.append(this.$messageArea);
    this.$messageArea.hide();
    this.filterControlMap = {};

    $parent.append(this.$mainControl);
    this._createContextMenu();
};

FilterPanel.prototype._createContextMenu = function ($parent) {
    var _this = this;
    var filterTypes = FilterControlFactory.getFilterTypes();
    var $container = $parent ? $parent : this.$mainControl;
    var menuItems = '';

    $.each(filterTypes, function (index, type) {
        var id = 'bfs-context-menu-switch-item-' + type;
        menuItems += '<li id="' + id + '"type="' + type + '">' + type + '</li>';
    });

    var $menu = $('' + '<div id="bf-context-menu">' + '   <ul>' + menuItems + '</ul>' + '</div>');

    $container.append(this.$menu);

    this.$menu = $menu.jqxMenu({
        theme: 'office',
        width: '120px',
        height: '80px',
        animationShowDuration: 0,
        animationHideDuration: 0,
        autoOpenPopup: false,
        mode: 'popup'
    });

    $menu.on('itemclick', function (event) {
        var menuId = $(event.target).attr('id'),
            controlType = $(event.target).attr('type'),
            filterId = $menu.data('filterId'),
            chartId = $menu.data('chartId');
        if (menuId.startsWith('bfs-context-menu-switch-item-')) {
            _this.filterControlMap[chartId].switchFilter(filterId, controlType);
        }
    });
};

FilterPanel.prototype._hideAllControl = function () {
    this.$messageArea.hide();
    for (var key in this.filterControlMap) {
        this.filterControlMap[key].hide();
    }
};

FilterPanel.prototype.render = function (options) {
    var _this = this;
    var chartId = options.chartId;
    var chartOptions = options.chartOption;
    var filterOption = options.filterOption;
    var groupId = options.groupId;
    this.chartId = chartId;
    this._hideAllControl();

    if (groupId && groupId.indexOf('/') > -1) {
        this.$messageArea.show();
        this.$messageArea.find('div').text('Filtering on detailed chart is not available.');
        return;
    }

    if (typeof this.filterControlMap[chartId] === 'undefined') {
        var newFilterOption = {
            chartId: chartId,
            chartOption: $.extend(true, {}, chartOptions),
            filter: $.extend(true, [], filterOption),
            changed: this.options.changed
        };
        this.filterControlMap[chartId] = new _filter2.default(this.$mainControl, newFilterOption);
    } else {
        this.filterControlMap[chartId].show();
    }

    if (chartOptions.chart.type === 'biplot') {
        this.filterControlMap[chartId].hide();
        this.$messageArea.show();
        this.$messageArea.find('div').text('Filtering on biplot is not available.');
    }
};

FilterPanel.prototype.remove = function (chartId) {
    if (this.filterControlMap[chartId]) {
        this.filterControlMap[chartId].destroy();
        delete this.filterControlMap[chartId];
    }
};

FilterPanel.prototype.getChartId = function () {
    return this.chartId;
};

FilterPanel.prototype.getOptionsById = function (chartId) {
    if (this.filterControlMap[chartId]) {
        return this.filterControlMap[chartId].options;
    }
};

FilterPanel.prototype.setChartType = function (chartId, chartType) {
    if (this.filterControlMap[chartId] && chartType === 'biplot') {
        this._hideAllControl();
        this.$messageArea.show();
        this.$messageArea.find('div').text('Filtering on biplot is not available.');
    } else if (this.filterControlMap[chartId]) {
        this._hideAllControl();
        this.filterControlMap[chartId].show();
    }
};

exports.default = FilterPanel;

/***/ }),
/* 674 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filterControlBase = __webpack_require__(76);

var _filterControlBase2 = _interopRequireDefault(_filterControlBase);

var _filterControlIndex = __webpack_require__(298);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by ji_sung.park on 2017-09-25.
 */

function CheckBoxFilter(parentId, options) {
    _filterControlBase2.default.call(this, parentId, options);
}

CheckBoxFilter.prototype = Object.create(_filterControlBase2.default.prototype);
CheckBoxFilter.prototype.constructor = CheckBoxFilter;

CheckBoxFilter.prototype.createControlArea = function ($parent) {
    var _this = this;
    this._$control = $('<div class="bfs-column-filter-control"></div>');

    $parent.append(this._$control);

    _this._isSelected = {};
    $.each(this.options.values, function (index, value) {
        var $checkBox = $('<div></div>');
        $checkBox.attr('title', value);
        $checkBox.text(value);
        _this._$control.append($checkBox);
        _this._isSelected[value] = true;
        $checkBox.jqxCheckBox({ theme: 'office' });
        $checkBox.on('change', function (event) {
            _this._isSelected[value] = event.args.checked;
        });
        if (!_this.options.getFilteredValues()) $checkBox.jqxCheckBox('check');
    });
};

CheckBoxFilter.prototype.getType = function () {
    return 'CheckBox';
};

CheckBoxFilter.prototype.getSelected = function () {
    var selected = [];
    for (var key in this._isSelected) {
        var elem = key;
        if (this.options.selectedColumn.type === 'number') {
            elem *= 1;
        }
        if (this._isSelected[key] === true) selected.push(elem);
    }
    return selected.sort();
};

CheckBoxFilter.prototype.setSelected = function (values) {
    this._isSelected = {};
    if ($.isPlainObject(values)) {
        var minIndex = this.options.values.indexOf(values.min);
        var maxIndex = this.options.values.indexOf(values.max);
        for (var i = minIndex; i <= maxIndex; i++) {
            this._$control.find('div[title="' + this.options.values[i] + '"]').val(true);
        }
    } else {
        if (this.options.values.length === values.length) {
            for (var i in this.options.values) {
                this._$control.find('div[title="' + this.options.values[i] + '"]').val(true);
            }
        } else {
            for (var i in values) {
                this._$control.find('div[title="' + values[i] + '"]').val(true);
            }
        }
    }
};

exports.default = CheckBoxFilter;

/***/ }),
/* 675 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filterControlBase = __webpack_require__(76);

var _filterControlBase2 = _interopRequireDefault(_filterControlBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ListBoxFilter(parentId, options) {
    _filterControlBase2.default.call(this, parentId, options);
} /**
   * Created by ji_sung.park on 2017-09-25.
   */

ListBoxFilter.prototype = Object.create(_filterControlBase2.default.prototype);
ListBoxFilter.prototype.constructor = ListBoxFilter;

ListBoxFilter.prototype.createControlArea = function ($parent) {
    var _this = this;
    _this._isSelected = {};

    this._$control = $('<div class="bfs-column-filter-control"></div>');
    $parent.append(this._$control);

    this._$searchbar = $('<input class="bfs-column-filter-searchbar">');
    this._$listBox = $('<div class="bfs-column-filter-listbox"></div>');
    this._$control.append(this._$searchbar);
    this._$control.append(this._$listBox);

    var source = this.options.values.slice();
    for (var key in source) {
        this._isSelected[source[key]] = false;
    }

    source.unshift('(Select All)');

    this._$searchbar.jqxInput({
        theme: 'office',
        width: '100%',
        height: 25,
        placeHolder: 'Search for'
    });

    this._$searchbar.on('keyup', function (event) {
        var value = $(this).val();
        var filteredData = _this.options.values.filter(function (item) {
            return (item + "").toLowerCase().indexOf(value.toLowerCase()) != -1;
        });
        if (value === '') filteredData.unshift('(Select All)');
        _this._$listBox.jqxListBox({ source: filteredData });
        handleCheckChange = false;
        var checked = _this.getSelected();
        for (var i in checked) {
            _this._$listBox.jqxListBox('checkItem', checked[i]);
        }
        if (filteredData[0] === '(Select All)') {
            if (checked.length === _this.options.values.length) {
                _this._$listBox.jqxListBox('checkIndex', 0);
            } else if (checked.length != 0) {
                _this._$listBox.jqxListBox('indeterminateIndex', 0);
            }
        }
        handleCheckChange = true;
    });

    this._$listBox.jqxListBox({
        theme: 'office',
        source: source,
        width: '100%',
        height: 150,
        checkboxes: true,
        searchMode: 'containsignorecase'
    });

    var handleCheckChange = true;
    this._$listBox.on('checkChange', function (event) {
        if (!handleCheckChange) return;

        if (event.args.label != '(Select All)') {
            handleCheckChange = false;
            _this._isSelected[event.args.label] = event.args.checked;
            var checkedItems = _this.getSelected();

            if ($(this).jqxListBox('getItem', 0).label === '(Select All)') {
                if (checkedItems.length == 0) {
                    $(this).jqxListBox('uncheckIndex', 0);
                } else if (checkedItems.length != _this.options.values.length) {
                    $(this).jqxListBox('indeterminateIndex', 0);
                } else {
                    $(this).jqxListBox('checkIndex', 0);
                }
            }
            handleCheckChange = true;
        } else {
            handleCheckChange = false;
            if (event.args.checked) {
                $(this).jqxListBox('checkAll');
                for (var key in _this._isSelected) {
                    _this._isSelected[key] = true;
                }
            } else {
                $(this).jqxListBox('uncheckAll');
                for (var key in _this._isSelected) {
                    _this._isSelected[key] = false;
                }
            }
            handleCheckChange = true;
        }
    });
    this._$listBox.jqxListBox('checkIndex', 0);

    //var handleCheckChange = true;

    /*this._$listBox.on('checkChange', function (event) {
        if (!handleCheckChange) return;
          if (event.args.label != '(Select All)') {
            handleCheckChange = false;
            $(this).jqxListBox('checkIndex', 0);
            var checkedItems = $(this).jqxListBox('getCheckedItems');
            var items = $(this).jqxListBox('getItems');
              if (checkedItems.length == 1) {
                $(this).jqxListBox('uncheckIndex', 0);
            }
            else if (items.length != checkedItems.length) {
                $(this).jqxListBox('indeterminateIndex', 0);
            }
            handleCheckChange = true;
        }
        else {
            handleCheckChange = false;
            if (event.args.checked) {
                $(this).jqxListBox('checkAll');
            }
            else {
                $(this).jqxListBox('uncheckAll');
            }
            handleCheckChange = true;
        }
    });
    this._$control.jqxListBox('checkIndex', 0);*/
};

ListBoxFilter.prototype.getType = function () {
    return 'ListBox';
};

ListBoxFilter.prototype.getSelected = function () {
    /*var checked = this._$control.jqxListBox('getCheckedItems');
    if(checked[0].label === '(Select All)') {
        return this.options.values;
    } else {
        var selected = [];
        for (var i in checked) {
            var elem = checked[i].label;
            if(this.options.selectedColumn.type === 'number') {
                elem *= 1;
            }
            selected.push(elem);
        }
        return selected.sort();
    }*/
    var selected = [];
    for (var key in this._isSelected) {
        var elem = key;
        if (this.options.selectedColumn.type === 'number') {
            elem *= 1;
        }
        if (this._isSelected[key]) selected.push(elem);
    }
    return selected.sort();
};

ListBoxFilter.prototype.setSelected = function (values) {
    this._$searchbar.val('');
    this._$listBox.jqxListBox('uncheckIndex', 0);
    if ($.isPlainObject(values)) {
        var minIndex = this.options.values.indexOf(values.min);
        var maxIndex = this.options.values.indexOf(values.max);
        for (var i = minIndex; i <= maxIndex; i++) {
            this._$listBox.jqxListBox('checkItem', this.options.values[i]);
        }
    } else {
        if (this.options.values.length === values.length) {
            this._$listBox.jqxListBox('checkIndex', 0);
        } else {
            for (var i in values) {
                this._$listBox.jqxListBox('checkItem', values[i]);
            }
        }
    }
};

exports.default = ListBoxFilter;

/***/ }),
/* 676 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filterControlBase = __webpack_require__(76);

var _filterControlBase2 = _interopRequireDefault(_filterControlBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RangeSliderFilter(parentId, options) {
    _filterControlBase2.default.call(this, parentId, options);
} /**
   * Created by ji_sung.park on 2017-09-25.
   */

RangeSliderFilter.prototype = Object.create(_filterControlBase2.default.prototype);
RangeSliderFilter.prototype.constructor = RangeSliderFilter;

RangeSliderFilter.prototype.createControlArea = function ($parent) {
    var _this = this;
    this._$control = $('<div class="bfs-column-filter-control"></div>');
    this._$value = $('<div class="bfs-column-filter-value"/>');

    this._$lblMin = $('<label class="bfs-column-filter-range-min-label" style="float: left; max-width: 90%; height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"/>');
    this._$lblMax = $('<label class="bfs-column-filter-range-max-label" style="float: right; max-width: 90%; height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"/>');
    this._$slider = $('<div class="bfs-column-filter-slider"/>');

    this._$value.append(this._$lblMin);
    this._$lblMin.text(_this.options.values[0]);
    this.minValueIndex = 0;

    this._$value.append(this._$lblMax);
    this._$lblMax.text(this.options.values[this.options.values.length - 1]);
    this.maxValueIndex = this.options.values.length - 1;

    this._$control.append(this._$value);
    this._$control.append(this._$slider);

    $parent.append(this._$control);

    this._$slider.jqxSlider({
        theme: 'office',
        rangeSlider: true,
        mode: 'fixed',
        showTicks: false,
        min: 0,
        max: this.options.values.length - 1,
        values: [0, this.options.values.length - 1],
        width: 'calc(100% + 20px)'
        //step: 1,
        //ticksFrequency: 1,
        //tooltip: true
    });

    this._$slider.on('change', function (event) {
        var fromVal = _this.options.values[event.args.value.rangeStart];
        _this._$lblMin.text(fromVal);
        _this.minValueIndex = event.args.value.rangeStart;
        var toVal = _this.options.values[event.args.value.rangeEnd];
        _this._$lblMax.text(toVal);
        _this.maxValueIndex = event.args.value.rangeEnd;
    });
};

RangeSliderFilter.prototype.getType = function () {
    return 'RangeSlider';
};

RangeSliderFilter.prototype.getSelected = function () {
    if (this.options.selectedColumn.type === 'string') {
        var selected = [];
        for (var i = this.minValueIndex; i <= this.maxValueIndex; i++) {
            selected.push(this.options.values[i]);
        }
        return selected.sort();
    } else {
        var selected = {
            min: this.options.values[this.minValueIndex],
            max: this.options.values[this.maxValueIndex]
        };
        return selected;
    }
};

RangeSliderFilter.prototype.setSelected = function (values) {
    var minIndex, maxIndex;
    if ($.isPlainObject(values)) {
        minIndex = this.options.values.indexOf(values.min);
        maxIndex = this.options.values.indexOf(values.max);
    } else {
        minIndex = this.options.values.indexOf(values[0]);
        maxIndex = this.options.values.indexOf(values[values.length - 1]);
    }
    this._$slider.jqxSlider('setValue', [minIndex, maxIndex]);
};

exports.default = RangeSliderFilter;

/***/ }),
/* 677 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filterControlContainer = __webpack_require__(678);

var _filterControlContainer2 = _interopRequireDefault(_filterControlContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by ji_sung.park on 2017-09-20.
 */

var ChartWidget = Brightics.Chart.Widget;


function Filter(parentId, options) {
    ChartWidget.call(this, parentId, options);
}

Filter.prototype = Object.create(ChartWidget.prototype);
Filter.prototype.constructor = Filter;

Filter.prototype._init = function () {
    ChartWidget.prototype._init.call(this);
    this.filterControlList = {};
    this.options.onChanged = this._onChanged.bind(this);
};

Filter.prototype._createContents = function ($parent) {
    var _this = this;

    this.$mainControl = $('<div class="bf-container bfs-container bfs-relative-full bfs-display-flex bfs-flex-direction-column"></div>');
    $parent.append(this.$mainControl);

    this.$filterControlArea = $('<div class="bf-control-area-wrapper bfs-control-area-wrapper bfs-flex-1"><div class="bf-control-area bfs-control-area"></div></div>');
    this.$mainControl.append(this.$filterControlArea);

    this.$bottomArea = $('' + '<div class="bf-button-area bfs-button-area">' + '   <div class="bf-message-area bfs-message-area"></div>' + '   <div class="bf-add-button bfs-add-button bfs-widget-button">+ Add Condition</div>' + '   <div class="bfs-display-flex">' + '       <div class="bf-reset-button bfs-reset-button bfs-widget-button bfs-flex-1">Reset</div>' + '       <div class="bf-apply-button bfs-apply-button bfs-widget-button bfs-flex-1">Apply</div>' + '   </div>' + '</div>');
    this.$mainControl.append(this.$bottomArea);

    this.$messageArea = this.$bottomArea.find('.bf-message-area');
    this.$messageArea.hide();

    this.$resetFilterButton = this.$bottomArea.find('.bf-reset-button');
    this.$resetFilterButton.on('click', function (event) {
        _this.$filterControlArea.find('.bf-control-area').empty();
        _this.$messageArea.text('');
        _this.$messageArea.hide();
        _this.filterControlList = {};
        _this._applyFilter();
    });

    this.$addControlButton = this.$bottomArea.find('.bf-add-button');
    this.$addControlButton.on('click', function (event) {
        _this._createNewFilterControl();
        _this.$filterControlArea.perfectScrollbar('update');
        _this.$filterControlArea.scrollTop(_this.$filterControlArea.height());
    });

    if (this.options.filter && this.options.filter.length === 1) {
        for (var key in this.options.filter[0]) {
            var filter = {
                column: key,
                value: this.options.filter[0][key]
            };
            _this._createNewFilterControl(filter);
        }
    }

    this.$applyButton = this.$bottomArea.find('.bf-apply-button');
    this.$applyButton.on('click', function (event) {
        if (_this._validateFilters()) _this._applyFilter();
    });

    this.$filterControlArea.perfectScrollbar();
};

Filter.prototype._createNewFilterControl = function (filter) {
    var _this = this;

    var id = _this.uuid();
    var newFilterControlOptions = {
        chartId: this.options.chartId,
        id: id,
        chartOption: $.extend(true, {}, _this.options.chartOption),
        onChanged: _this.options.onChanged.bind(_this),
        onRemoveFilter: _this.removeFilter.bind(_this),
        filter: filter || {}
    };
    _this.filterControlList[id] = new _filterControlContainer2.default(_this.$filterControlArea.find('.bfs-control-area'), newFilterControlOptions);
};

Filter.prototype._applyFilter = function () {
    var filters = {};
    for (var key in this.filterControlList) {
        var filter = this.filterControlList[key].getFilter();
        filters[filter.column.name] = filter.selected;
    }
    this.options.changed(this.options.chartId, [filters]);
};

Filter.prototype._validateFilters = function () {
    var filterColumns = [];
    var valid = true;
    var errorMessage = '';
    for (var key in this.filterControlList) {
        var filter = this.filterControlList[key].getFilter();
        if (!filter.column) {
            valid = false;
            errorMessage = 'Please select column to apply filter.';
            break;
        }
        if (filterColumns.indexOf(filter.column.name) != -1) {
            valid = false;
            errorMessage = filter.column.name + ' column has selected in two or more filters.';
            break;
        }
        filterColumns.push(filter.column.name);
    }

    if (!valid) {
        this.$messageArea.show();
        this.$messageArea.text(errorMessage);
    } else {
        this.$messageArea.hide();
        this.$messageArea.text('');
    }

    return valid;
};

Filter.prototype.removeFilter = function (controlId) {
    this.filterControlList[controlId].destroy();
    delete this.filterControlList[controlId];
    this.$filterControlArea.perfectScrollbar('update');
};

Filter.prototype._onChanged = function () {
    for (var key in this.filterControlList) {
        this.filterControlList[key].renderProblem();
    }
};

Filter.prototype.switchFilter = function (filterId, controlType) {
    this.filterControlList[filterId].switchFilter(controlType);
};

Filter.prototype.destroy = function () {
    ChartWidget.prototype.destroy.call(this);

    if (this.resizeHandler) {
        $(window).off('resize', this.resizeHandler);
        this.resizeHandler = null;
    }

    for (var key in this.filterControlList) {
        this.filterControlList[key].destroy();
    }

    this.filterControlList = {};
    this.$mainControl.remove();
};

exports.default = Filter;

/***/ }),
/* 678 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _widgetFactory = __webpack_require__(3);

var WidgetFactory = _interopRequireWildcard(_widgetFactory);

var _chartOptionUtil = __webpack_require__(30);

var ChartOptionUtil = _interopRequireWildcard(_chartOptionUtil);

var _filterControlFactory = __webpack_require__(123);

var FilterControlFactory = _interopRequireWildcard(_filterControlFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function FilterControlContainer(parentId, options) {
    this.parentId = parentId;
    this.options = options;
    this._init();
    this._createExpander();
} /**
   * Source: filter-control-container.js
   * Created by ji_sung.park on 2017-09-20.
   */

FilterControlContainer.prototype._init = function () {
    this._retrieveParent();
    if (this.options.filter) {
        this._selectedColumn = this._getColumnInfo({ name: this.options.filter.column });
        this._filterValue = this.options.filter.value;
    } else {
        this._filterValue = undefined;
    }
};

FilterControlContainer.prototype._retrieveParent = function () {
    this.$parent = typeof this.parentId === 'string' ? $(this.parentId) : this.parentId;
};

FilterControlContainer.prototype._createExpander = function () {
    var _this = this;

    this.$filterControl = $('' + '<div class="bf-control-container-expander bfs-control-container-expander bfs-control-container-expander-collapsed">' + '   <div class="bf-control-container-label bfs-control-container-label"></div>' + '   <div class="bf-control-container-contents bfs-control-container-contents"></div>' + '</div>');

    this.$contentArea = this.$filterControl.find('.bf-control-container-contents');
    this.$parent.append(this.$filterControl);

    this.$filterControl.jqxExpander({
        theme: 'office',
        animationType: 'none',
        arrowPosition: "left",
        expanded: false,
        initContent: function initContent() {
            _this.createContentArea();
        }
    });
    this.$filterControl.jqxExpander('setHeaderContent', '<div class="bf-control-container-header-content bfs-display-flex bfs-flex-space-between bfs-flex-align-center">');
    this._createHeaderContent(this.$filterControl.find('.bf-control-container-header-content'), 'Select Column', '');

    this.$filterControl.on('collapsed', function () {
        $(this).removeClass('bfs-control-container-expander-expanded').addClass('bfs-control-container-expander-collapsed');
        _this.$parent.closest('.bf-control-area-wrapper').perfectScrollbar('update');
    });
    this.$filterControl.on('expanded', function () {
        $(this).removeClass('bfs-control-container-expander-collapsed').addClass('bfs-control-container-expander-expanded');
        _this.$parent.closest('.bf-control-area-wrapper').perfectScrollbar('update');
    });
};

FilterControlContainer.prototype._createHeaderContent = function ($target, label, previewValue) {
    var _this = this;
    $target.append($('<div class="bf-control-container-header-label bfs-control-container-header-label"></div>'));
    $target.append($('<div class="bf-control-container-header-remove bfs-control-container-header-remove"></div>'));

    this.$headerLabel = $target.find('.bf-control-container-header-label');
    this.$headerLabel.css('width', '100%');

    this.$removeButton = $target.find('.bf-control-container-header-remove');
    this.$removeButton.on('click', function (event) {
        event.stopPropagation();
        _this.options.onRemoveFilter(_this.options.id);
    });

    this.headerContentChanged(this.options.filter.column, this.$headerLabel);
};

FilterControlContainer.prototype.headerContentChanged = function (label, $headerTarget) {
    $headerTarget.addClass('bfs-text-overflow-hidden');
    $headerTarget.removeClass('bfs-display-flex');
    if (label && typeof label === 'string' && label !== '') {
        $headerTarget.text(label);
    } else {
        $headerTarget.text('Select Column');
    }
};

FilterControlContainer.prototype.createContentArea = function () {
    var _this = this;
    this.$controlContentMain = $('<div class="bf-control bfs-control"></div>');
    this.$contentArea.append(this.$controlContentMain);
    this.createColumnSelectorControl(this.$controlContentMain);
    this.createFilterControlArea(this.$controlContentMain);
    if (this._selectedColumn) {
        this.$filterControlArea.removeClass('bfs-display-none');
        this._refreshData(0, this._getColumnIndex(this._selectedColumn));
    }
    this.renderProblem();
};

FilterControlContainer.prototype.createColumnSelectorControl = function ($parent) {
    var _this = this;

    this.$columnSelectorArea = $('<div class="bf-control-column-selector bfs-control-column-selector"></div>');
    $parent.append(this.$columnSelectorArea);

    var widgetOptions = {
        selected: this.options.filter.column ? [{ name: this.options.filter.column }] : [],
        multiple: false,
        aggregationEnabled: false,
        aggregationMap: {},
        label: 'Column',
        getColumns: _this._getColumnList.bind(_this, 0),
        getAllColumns: _this._getAllColumnList.bind(_this, 0),
        problemKeyList: ['axis-001', 'axis-002', 'axis-003', 'axis-004', 'axis-005'],
        chartOption: this.options.chartOption,
        onChanged: function onChanged(changedColumnInfo) {
            var name;
            if (changedColumnInfo[0]) name = changedColumnInfo[0].name;
            _this.headerContentChanged(name, _this.$headerLabel);
            _this._selectedColumn = _this._getColumnInfo(changedColumnInfo[0]);

            if (_this.options.onChanged && typeof _this.options.onChanged === 'function') {
                _this.options.onChanged();
            }
            _this._onColumnChanged();
        }
    };
    this.columnSelectorWidget = WidgetFactory.createColumnSelectorWidget(this.$columnSelectorArea, widgetOptions);
};

FilterControlContainer.prototype._getAllColumnList = function (sourceIndex) {
    return ChartOptionUtil.getAllColumnList(this.options.chartOption, sourceIndex);
};

FilterControlContainer.prototype._getColumnList = function (sourceIndex) {
    var columnList = ChartOptionUtil.getAllColumnList(this.options.chartOption, sourceIndex);
    return columnList.filter(function (value) {
        return value.type !== 'image';
    });
};

FilterControlContainer.prototype._getColumnInfo = function (column) {
    if (!column) return column;
    var columns = this._getAllColumnList(0);
    for (var i in columns) {
        if (columns[i].name === column.name) return columns[i];
    }
};

FilterControlContainer.prototype._onColumnChanged = function () {
    var selectedColumn = this._selectedColumn;
    this.$filterControlArea.addClass('bfs-display-none');
    if (!selectedColumn) {
        if (this.filterControlWidget) this.filterControlWidget.destroy();
        this.filterControlWidget = null;
    } else {
        this.$filterControlArea.removeClass('bfs-display-none');
        this.$filterControlArea.text('Loading...');
        var columnIndex = this._getColumnIndex(selectedColumn);
        this._refreshData(0, columnIndex);
    }
};

FilterControlContainer.prototype.createFilterControlArea = function ($parent) {
    this.$filterControlArea = $('<div class="bf-control-contents bfs-control-contents bfs-display-none">');
    $parent.append(this.$filterControlArea);
};

FilterControlContainer.prototype.switchFilter = function (controlType) {
    if (this.filterControlWidget) {
        this.filterControlWidget.destroy();
    }
    this.$filterControlArea.text('');

    var widgetType = controlType;

    if (!widgetType) {
        if (!this._filterValue) {
            if (this._values.length <= 5) {
                widgetType = 'CheckBox';
            } else if (this._values.length <= 50) {
                widgetType = 'ListBox';
            } else {
                widgetType = 'RangeSlider';
            }
        } else {
            if ($.isPlainObject(this._filterValue)) {
                widgetType = 'RangeSlider';
            } else {
                if (this._values.length <= 5) {
                    widgetType = 'CheckBox';
                } else {
                    widgetType = 'ListBox';
                }
            }
        }
    }

    var widgetOptions = {
        chartId: this.options.chartId,
        filterId: this.options.id,
        selectedColumn: this._selectedColumn,
        chartOptions: this.options.chartOptions,
        values: this._values,
        getFilteredValues: this.getFilteredValue.bind(this)
    };

    this.filterControlWidget = FilterControlFactory.createFilter(this.$filterControlArea, widgetType, widgetOptions);
};

FilterControlContainer.prototype.getFilteredValue = function () {
    if (this._selectedColumn.name === this.options.filter.column) return this._filterValue;
};

FilterControlContainer.prototype.getFilter = function () {
    var filterContent = {
        column: this._selectedColumn,
        selected: this.filterControlWidget ? this._filterValue = this.filterControlWidget.getSelected() : this._filterValue
    };
    return filterContent;
};

FilterControlContainer.prototype.getFilterControl = function () {
    return this.filterControlWidget;
};

FilterControlContainer.prototype._getColumnIndex = function (column) {
    var columns = this._getAllColumnList(0);
    for (var i in columns) {
        if (columns[i].name === column.name) return i;
    }
    return -1;
};

FilterControlContainer.prototype._refreshData = function (sourceIndex, columnIndex) {
    var _this = this;
    var dataList;
    if (this.options.chartOption.source.dataType === 'lazy') {
        if (typeof this.options.chartOption.source.lazyData[sourceIndex].data === 'function') {
            this.options.chartOption.source.lazyData[sourceIndex].data({
                uid: Date.now(),
                done: function done(data) {
                    dataList = data.data;
                    _this._values = _this._getDistinctDataList(dataList, columnIndex);
                    _this.switchFilter();
                }
            });
        } else {
            dataList = this.options.chartOption.source.lazyData[sourceIndex].data;
            _this._values = _this._getDistinctDataList(dataList, columnIndex);
            _this.switchFilter();
        }
    } else {
        dataList = this.options.chartOptions.source.localData[sourceIndex].data;
        _this._values = _this._getDistinctDataList(dataList, columnIndex);
        _this.switchFilter();
    }
};

FilterControlContainer.prototype._getDistinctDataList = function (dataList, columnIndex) {
    var distinctList = [];
    var columns = this._getAllColumnList(0);
    var columnInfo = columns[columnIndex];

    for (var i in dataList) {
        if (!dataList[i][columnIndex] || typeof dataList[i][columnIndex] === 'number' && !Number.isFinite(dataList[i][columnIndex])) continue;
        if (distinctList.indexOf(dataList[i][columnIndex]) === -1) {
            distinctList.push(dataList[i][columnIndex]);
        }
    }

    var sortFunc;
    if (columnInfo.type === 'number') sortFunc = function sortFunc(a, b) {
        return a - b;
    };else if (columnInfo.type === 'string') sortFunc = function sortFunc(a, b) {
        return a.localeCompare(b);
    };else if (columnInfo.type === 'date') sortFunc = function sortFunc(a, b) {
        var timeA = Date.parse(a);
        var timeB = Date.parse(b);
        if (!isFinite(timeA) || !isFinite(timeB)) {
            return !isFinite(timeA) ? 1 : -1;
        } else return timeA - timeB;
    };
    distinctList.sort(sortFunc);
    return distinctList;
};

FilterControlContainer.prototype.renderProblem = function () {
    var columnSelectorProblem = this.validateColumnSelector();
    if (this.columnSelectorWidget) this.columnSelectorWidget.renderProblem(columnSelectorProblem);
};

FilterControlContainer.prototype.validateColumnSelector = function () {
    var columnList = this._getAllColumnList(0);
    var problemList = [];
    if (!this._selectedColumn) {
        problemList.push({ key: "axis-001", message: "Column is required", target: 'Column' });
    } else {
        var matched = false;
        for (var i in columnList) {
            if (columnList[i].name === this._selectedColumn.name) matched = true;
        }
        if (!matched && this._selectedColumn.name) {
            problemList.push({ key: "axis-005", message: this._selectedColumn.name + " Column does not exist!", target: 'Column' });
        }
    }
    return problemList;
};

FilterControlContainer.prototype.destroy = function () {
    this._selectedColumn = null;
    if (this.columnSelectorWidget) this.columnSelectorWidget.destroy();
    if (this.filterControlWidget) this.filterControlWidget.destroy();
    this.$filterControl.jqxExpander('destroy');
    this.$filterControl.remove();
};

exports.default = FilterControlContainer;

/***/ })
/******/ ]);