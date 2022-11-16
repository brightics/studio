
/**
 * hyunseok.oh@samsung.com
 * 2017. 12. 27.
 */

/* global _ */
(function () {
    'use strict';
    var CLASS_GRID_CELL = 'brtc-va-base-list-grid-cell';
    var CLASS_BUTTON = 'brtc-va-base-list-button';
    var CLASS_BUTTON_WRAPPER = 'brtc-va-base-list-button-wrapper';
    var CLASS_COLUMN_HEADER = 'brtc-va-base-list-column-header';
    var EVENT_CELL_CLICK = 'cell-click';
    var KEY_ATTRIBUTE = '__key__';
    var Brightics = this.Brightics;

    function BaseList($parent, options) {
        this.$parent = $parent;
        this.$template = $([
            '<div class="brtc-va-base-list">',
            '  <div class="brtc-va-base-list-wrapper">',
            '    <div class="brtc-va-base-list-content">',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('\n'));
        this.$parent.append(this.$template);

        this.$wrapper = this.$template.find('.brtc-va-base-list-wrapper');
        this.$wrapper.perfectScrollbar();
        this.$content = this.$template.find('.brtc-va-base-list-content');
        this.emitter = _.extend(new Brightics.VA.EventEmitter(), options.emitter);
        if (options.onCellClick) {
            this.emitter.on(EVENT_CELL_CLICK, options.onCellClick);
        }
        this.source = { localdata: [], datatype: 'array' };
        this._initSource(options.columnOptions);
        this.adapter = new $.jqx.dataAdapter(this.source);

        this.jqxGridOptions = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 'calc(100% - 45px)',
            altrows: false,
            filterable: false,
            source: this.adapter,
            sortable: false,
            columnsresize: false,
            showfiltercolumnbackground: false,
            rowsheight: 53,
            columnsheight: 53
        };
        $.extend(this.jqxGridOptions, options.listOptions || {});
        this._buttonClickHandlers = {};
        this._initJqxGridOptions(options.columnOptions);

        this._renderListArea();
    }

    BaseList.prototype._initSource = function (_columnOptions) {
        var columnOptions = _columnOptions.filter(function (opt) {
            return opt.key;
        });

        this.source.datafields = _.map(columnOptions,
            function (column) {
                return {
                    name: column.key,
                    type: column.type
                };
            });
    };

    BaseList.prototype._initJqxGridOptions = function (columnOptions) {
        var defaultOptions = {
            cellclassname: CLASS_GRID_CELL,
            renderer: this.gridV2Renderer
        };

        this.jqxGridOptions.columns = _.map(columnOptions,
            function (column) {
                if (column.key) {
                    var ret = { text: column.name, datafield: column.key };
                    return _.extend({}, defaultOptions,
                        ret,
                        // key, name, type 제외하고
                        _.omit(column, ['key', 'name', 'type']));
                } else if (column.type === 'button') {
                    var handlerKey = this._genHandlerKey();
                    this._buttonClickHandlers[handlerKey] = column.handler;
                    var buttonRenderer = this._getButtonRenderer(
                        column.label,
                        handlerKey,
                        column.cellclassname || CLASS_BUTTON);

                    return _.extend({}, defaultOptions, {
                        text: column.name,
                        cellsrenderer: buttonRenderer,
                        datafield: handlerKey
                    });
                }
            }.bind(this));
    };
    BaseList.prototype._genHandlerKey = function () {
        var key = 0;
        for (var i = 0; i < 9; ++i) {
            key *= 10;
            key += parseInt(Math.random() * 10, 10);
        }
        return parseInt(key);
    };

    BaseList.prototype._renderListArea = function () {
        this.$content.jqxGrid(this.jqxGridOptions);
        this.$content.on('cellclick', function (evt) {
            evt.preventDefault();
            if (this._buttonClickHandlers[evt.args.datafield] &&
                evt.args.originalEvent.target.getAttribute(KEY_ATTRIBUTE) == evt.args.datafield) {
                evt.stopPropagation();
                var data = this.source.localdata[evt.args.rowindex];
                this._buttonClickHandlers[evt.args.datafield](data);
                return false;
            }
            this.emitter.emit(EVENT_CELL_CLICK, evt);
            return true;
        }.bind(this));
    };

    BaseList.prototype.setData = function (data) {
        this.source.localdata = data;
    };

    BaseList.prototype.render = function () {
        this.$content.jqxGrid('updatebounddata');
    };

    BaseList.prototype.update = function (data) {
        this.setData(data);
        this.render();
    };

    BaseList.prototype._getButtonRenderer = function (label, key, className) {
        return function buttonRenderer(row, datafield, value) {
            return '<div class="' + CLASS_BUTTON_WRAPPER + '" index="' + row + '">' +
                '<div ' + KEY_ATTRIBUTE + '="' + key + '" class="' + className + '">' +
                label +
                '</div></div>';
        };
    };

    BaseList.prototype.gridV2Renderer = function (value) {
        return '<div class="' + CLASS_COLUMN_HEADER + '">' + value + '</div>';
    };

    Brightics.VA.Core.Components.Base.BaseList = BaseList;

/* eslint-disable no-invalid-this */
}.call(this));
