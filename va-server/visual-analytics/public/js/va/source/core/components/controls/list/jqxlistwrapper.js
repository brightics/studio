'use strict';
/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 22
 */

/* global _, moment */

import {ListWrapper} from './listwrapper';

const CLASS_GRID_CELL = 'brtc-va-base-list-grid-cell';
// var CLASS_BUTTON = 'brtc-va-base-list-button';
// var CLASS_BUTTON_WRAPPER = 'brtc-va-base-list-button-wrapper';
const CLASS_COLUMN_HEADER = 'brtc-va-base-list-column-header';
const EVENT_CELL_CLICK = 'cell-click';
const EVENT_ROW_SELECT = 'row-select';
const EVENT_ROW_UNSELECT = 'row-unselect';
const KEY_ATTRIBUTE = '__key__';


function JqxListWrapper($el, options) {
    ListWrapper.call(this, $el, options);
    // selectable
    // sortable
    // columnResizable
    // width
    // height
    // columns
    // data
    // rowsHeight
    this.listeners = {};
    this.jqxOptions = this._brtcOptions2jqxOptions(this.options);
    this.keyIndex = 0;
    // this.render();
}

JqxListWrapper.prototype = Object.create(ListWrapper.prototype);
JqxListWrapper.prototype.constructor = JqxListWrapper;

JqxListWrapper.prototype.update = function (data) {
    this.source.localdata = data;
    this.$content.jqxGrid('updatebounddata');
    if (this.options.selectable) this.$content.jqxGrid('clearselection');
};

JqxListWrapper.prototype.render = function () {
    this.$template = $([
        '<div class="brtc-va-base-list">',
        '  <div class="brtc-va-base-list-wrapper">',
        '    <div class="brtc-va-base-list-content">',
        '    </div>',
        '  </div>',
        '</div>'
    ].join('\n'));
    this.$wrapper = this.$template.find('.brtc-va-base-list-wrapper');
    this.$wrapper.perfectScrollbar();
    this.$content = this.$template.find('.brtc-va-base-list-content');
    this._registerAllListeners(this.listeners);
    this.$content.jqxGrid(this.jqxOptions);
    // this.$el.empty();
    this.$el.empty();
    this.$el.append(this.$template);
    this._initEventListeners();
    return this;
};

JqxListWrapper.prototype.destroy = function () {
    this.$content.jqxGrid('destroy');
};

JqxListWrapper.prototype._brtcOptions2jqxOptions = function (options) {
    var resultOptions = {};

    resultOptions.theme = 'office';
    resultOptions.sortable = options.sortable || false;
    resultOptions.selectionmode = options.selectable ? 'checkbox' : 'none';
    resultOptions.columnsresize = false;
    resultOptions.filterable = false;
    resultOptions.altrows = false;
    resultOptions.showfiltercolumnbackground = false;
    resultOptions.rowsheight = options.rowsHeight || 53;
    resultOptions.columnsheight = options.rowsHeight || 53;
    resultOptions.enabletooltips = true;
    resultOptions.width = options.width || 'auto';
    resultOptions.height = options.height || 'auto';
    this.source = this._getSource(options.columns);
    resultOptions.source = new $.jqx.dataAdapter(this.source);
    if (options.data && options.data.length) {
        resultOptions.source.localdata = options.data;
    }

    resultOptions.columns = this._getJqxGridColumnsOption(options.columns);
    return resultOptions;
};

JqxListWrapper.prototype._getSource = function (columns) {
    var source = {localdata: [], datatype: 'array'};
    source.datafileds = _.map(columns, function (column) {
        return {
            name: column.key,
            type: column.type || 'string'
        };
    });
    return source;
};

JqxListWrapper.prototype._getJqxGridColumnsOption = function (columns) {
    var defaultOptions = {
        cellclassname: CLASS_GRID_CELL,
        renderer: this._getDefaultHeaderRenderer()
    };

    var ret = _.map(columns,
        function (column) {
            if (column.key) {
                var ret = {
                    text: column.name,
                    datafield: column.key,
                    width: column.width || 'auto',
                    align: column.headerAlign || 'center',
                    cellsalign: column.dataAlign || 'center',
                    cellsrenderer: column.dataRenderer ?
                        this._getGenerativeRenderer(column.dataAlign, column.dataRenderer) :
                        this._getDefaultDataRenderer(column.type, column.dataAlign)
                };
                return _.extend({}, defaultOptions, ret);
            }
        }.bind(this));

    return ret;
};

JqxListWrapper.prototype._getDefaultHeaderRenderer = function () {
    return function (value) {
        return '<div class="' + CLASS_COLUMN_HEADER + '">' + _.escape(value) + '</div>';
    };
};

JqxListWrapper.prototype._getDefaultDataRenderer = function (type, align) {
    var classList = [this._getAlignClass(align)].join(' ');
    return function (row, datafield, value) {
        return this._wrap('<div>' + _.escape(this._format(value, type)) + '</div>', classList);
    }.bind(this);
};

JqxListWrapper.prototype._getAlignClass = function (_align) {
    var align = _align || 'center';
    var alignClassMap = {
        left: 'brtc-va-base-list-grid-cell-flex-left',
        center: 'brtc-va-base-list-grid-cell-flex-center',
        right: 'brtc-va-base-list-grid-cell-flex-right'
    };
    return alignClassMap[align];
};

JqxListWrapper.prototype._getGenerativeRenderer = function (align, render) {
    var classList = [this._getAlignClass(align)].join(' ');
    return function (row, datafield, value) {
        var $elem = render(row, value);
        return this._wrap(this._getHtmlWithEventHandler($elem, row), classList);
    }.bind(this);
};

JqxListWrapper.prototype._getHtmlWithEventHandler = function ($elem, rowIndex) {
    var data = this.source.localdata[rowIndex];
    var index = rowIndex;
    var registerEventHandler = function (elem) {
        var eventHandlers = $._data(elem, 'events');
        _.forOwn(eventHandlers, function (handlers, eventName) {
            var key = this._genHandlerKey();
            var fns = function (evt) {
                _.forEach(handlers, function (fn) {
                    fn.handler(evt);
                });
            };
            this.listeners[eventName] = this.listeners[eventName] || {};
            this.listeners[eventName][key] = {
                fn: fns,
                data: data,
                index: index
            };
            elem.setAttribute(eventName + KEY_ATTRIBUTE, key);
        }.bind(this));
    }.bind(this);

    var go = function (node) {
        var children = node.children;
        registerEventHandler(node);
        _.forEach(children, function (child) {
            registerEventHandler(child);
            go(child);
        });
    };
    go($elem[0]);
    return $elem[0].outerHTML;
};

JqxListWrapper.prototype._wrap = function (inner, classList) {
    return [
        '<div class="' + classList + '">',
        inner,
        '</div>'
    ].join('');
};

JqxListWrapper.prototype._format = function (_value, _type) {
    var type = _type || 'string';
    var value = _value || '';
    if (type == 'date' && value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
    return value;
};

JqxListWrapper.prototype._genHandlerKey = function () {
    return parseInt(++this.keyIndex);
};

JqxListWrapper.prototype._initEventListeners = function (allListeners) {
    this.$content.on('cellclick', function (evt) {
        if (evt.args.originalEvent && evt.args.originalEvent.cancel) return false;
        if (evt.args.datafield == '_checkboxcolumn') return false;
        this.emit(EVENT_CELL_CLICK, {
            data: this.source.localdata[evt.args.rowindex],
            index: evt.args.rowindex
        });
        return true;
    }.bind(this));
    this.$content.on('rowselect', function (evt) {
        if (evt.args.originalEvent && evt.args.originalEvent.cancel) return false;
        this.emit(EVENT_ROW_SELECT, {
            data: this.source.localdata[evt.args.rowindex],
            index: evt.args.rowindex
        });
        return true;
    }.bind(this));
    this.$content.on('rowunselect', function (evt) {
        if (evt.args.originalEvent && evt.args.originalEvent.cancel) return false;
        this.emit(EVENT_ROW_UNSELECT, {
            data: this.source.localdata[evt.args.rowindex],
            index: evt.args.rowindex
        });
        return true;
    }.bind(this));
};

JqxListWrapper.prototype._registerAllListeners = function (allListeners) {
    var $content = this.$content;
    // var eventNames = _.keys(allListeners);
    // 밖으로 빼야할듯.. + 일단 임시로 이벤트 몇개만
    var eventNames = [
        'mousedown',
        'click',
        'change',
        'dblclick',
        'keydown',
        'keyup'
    ];

    _.forEach(eventNames, function (eventName) {
        $content.on(eventName, function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var attrName = eventName + KEY_ATTRIBUTE;
            var originalEvent = evt.originalEvent || evt.args.originalEvent;
            var attrValue = originalEvent.target.getAttribute(attrName);
            if (allListeners[eventName] && allListeners[eventName][attrValue]) {
                evt.cancel = true;
                evt.data = allListeners[eventName][attrValue].data;
                evt.index = allListeners[eventName][attrValue].index;
                allListeners[eventName][attrValue].fn(evt);
            }
            return false;
        });
    });
};

JqxListWrapper.prototype.getSelectedRows = function () {
    var selectedRowIndexes = this.$content.jqxGrid('getselectedrowindexes');
    return _.map(selectedRowIndexes, function (index) {
        return this.source.localdata[index];
    }.bind(this));
};

export {JqxListWrapper};
