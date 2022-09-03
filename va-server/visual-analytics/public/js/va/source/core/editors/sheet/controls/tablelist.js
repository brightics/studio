/**
 * Created by ty0314.kim on 2016-01-27.
 */

(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function TableList(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.initOptions();
        this.retrieveParent();
        this.createControls();
    }

    TableList.prototype.initOptions = function () {
        var defaultOptions = {
            rowCount: 5,
            maxRowCount: 7,
            expand: false,
        };

        this.options = $.extend(true, defaultOptions, this.options);

        this.options.items = [];
        this.options.renderedItems = {};
    };

    TableList.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    TableList.prototype.createControls = function () {
        this.createTableListControl();
        this.createExpanderControl();
    };

    TableList.prototype.setMaxHeight = function () {
        var height = this.$tableList.find('.brtc-va-editors-sheet-controls-tablelist-element').css('height');
        if (this.options.maxRowCount !== undefined && this.options.maxRowCount > 0) {
            var maxHeight = parseInt(this.options.expand ? this.options.maxRowCount : this.options.rowCount) * parseInt(height);
            this.$tableList.css({'max-height': maxHeight, height: maxHeight});
            this.$tableList.closest('.slimScrollDiv').css({height: maxHeight});
        }

        // if (this.options.expand || (this.options.items.length <= this.options.rowCount)) {
        //     this.$tableList.sortable('enable');
        // } else {
        //     this.$tableList.sortable('disable');
        // }
    };

    TableList.prototype.createTableListControl = function () {
        var _this = this;
        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-tablelist-wrapper" />');
        this.$tableListControl = $('<div class="brtc-va-editors-sheet-controls-tablelist" />');
        this.$tableList = $('<ul class="brtc-va-editors-sheet-controls-tablelist-sortable"/>');
        this.$tableListControl.append(this.$tableList);
        this.$mainControl.append(this.$tableListControl);

        this.resetTableList();
        
        /**
         * Sortable Drag 시 Help 위치 문제 및 동적으로 height 할당하기 위래 Slim Scroll 사용
         */
        this.$tableList.slimScroll({});
        // this.$tableList.perfectScrollbar();
    };

    TableList.prototype.createExpanderControl = function () {
        var _this = this;
        this.$expanderContainer = $('<div class="brtc-va-editors-sheet-controls-tablelist-expandercontainer" />');
        var $expand = $('<div class="brtc-va-editors-sheet-controls-tablelist-expander" />'),
            $expandLeft = $('<div class="brtc-va-editors-sheet-controls-tablelist-expander-left" />'),
            $expandCenter = $('<div class="brtc-va-editors-sheet-controls-tablelist-expander-center" />'),
            $expandRight = $('<div class="brtc-va-editors-sheet-controls-tablelist-expander-right" />');

        $expand.append($expandLeft).append($expandCenter).append($expandRight);

        this.$expandUp = $('<div class="brtc-va-editors-sheet-controls-tablelist-expander-up" />');
        this.$expandUp.append('<i class="fa fa-angle-double-up"></i>');
        this.$expandDown = $('<div class="brtc-va-editors-sheet-controls-tablelist-expander-down" />');
        this.$expandDown.append('<i class="fa fa-angle-double-down"></i>');
        $expandCenter.append(this.$expandUp).append(this.$expandDown);

        this.$remainNumber = $('<div class="brtc-va-editors-sheet-controls-tablelist-expander-remain" />');
        $expandRight.append(this.$remainNumber);

        this.$expandUp.hide();
        this.$expandDown.show();

        $expand.click(function () {
            _this.options.expand = !_this.options.expand;
            if (_this.options.expand) {
                _this.$expandUp.show();
                _this.$expandDown.hide();
            } else {
                _this.$tableList.scrollTop();
                _this.$expandUp.hide();
                _this.$expandDown.show();
            }
            _this.render();
        });

        this.$expanderContainer.append($expand);
        this.$expanderContainer.hide();
        this.$mainControl.append(this.$expanderContainer);
        this.$parent.append(this.$mainControl);
    };

    TableList.prototype.render = function () {
        var _this = this;

        if (this.options.items.length > 0) this.$emptyElemet.hide();
        else this.$emptyElemet.show();

        var count = this.options.items.length;
        if (this.options.expand) {
            $.each(this.options.items, function (index, table) {
                if (!_this.options.renderedItems[table.value]) {
                    _this.options.renderedItems[table.value] = _this.createTableUnit(table);
                    _this.$tableList.append(_this.options.renderedItems[table.value]);
                }
            });

            if (count <= this.options.rowCount) this.$expanderContainer.hide();
            else this.$expanderContainer.show();

            this.$remainNumber.text(count);
        } else {
            for (var i = 0; i < this.options.items.length; i++) {
                var table = this.options.items[i];
                if (i < this.options.rowCount) {
                    if (table && !_this.options.renderedItems[table.value]) {
                        _this.options.renderedItems[table.value] = _this.createTableUnit(table);
                        _this.$tableList.append(_this.options.renderedItems[table.value]);
                    }
                } else {
                    if (table && _this.options.renderedItems[table.value]) {
                        _this.options.renderedItems[table.value].remove();
                        delete _this.options.renderedItems[table.value];
                    }
                }
            }

            count = this.options.items.length - this.options.rowCount;
            if (count > 0) this.$expanderContainer.show();
            else this.$expanderContainer.hide();

            this.$remainNumber.text('+' + count);
        }
        this.setMaxHeight();
    };

    TableList.prototype.createTableUnit = function (table) {
        var $composite = $('<li class="brtc-va-editors-sheet-controls-tablelist-element" />');
        $composite.append($('<span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(table.label) + '</span>'));
        $composite.attr('value', table.value);
        return $composite;
    };

    TableList.prototype.setItems = function (items) {
        if (!items) return;
        this.options.items = [];
        var temp = $.grep(items, function (table) {
            return table;
        });

        this.options.items = temp;
        this.resetTableList();
        this.render();
    };

    TableList.prototype.resetTableList = function () {
        var _this = this;

        this.options.renderedItems = {};
        this.$tableList.empty();
        this.$emptyElemet = $('<div><span></span></div>');
        this.$emptyElemet.css({'height': '80px'});
        this.$tableList.append(this.$emptyElemet);
        // this.$tableList.sortable({
        //     axis: 'y'
        // });
        // this.$tableList.sortable('disable');

        // this.$tableList.on("sortstop", function (event, ui) {
        //     var values = _this.$tableList.sortable('toArray', {attribute: 'value'});
        //     var temp = [];
        //     $.each(values, function (index, value) {
        //         for (var i in _this.options.items) {
        //             if (_this.options.items[i].value == value) {
        //                 temp.push(_this.options.items[i]);
        //             }
        //         }
        //     });
        //     _this.options.items = temp;
        //     _this.options.changed('sortchange', _this.options.items);
        // });
    };

    TableList.prototype.getItems = function () {
        return this.options.items.length > 0 ? this.options.items : undefined;
    };

    Brightics.VA.Core.Editors.Sheet.Controls.TableList = TableList;

}).call(this);