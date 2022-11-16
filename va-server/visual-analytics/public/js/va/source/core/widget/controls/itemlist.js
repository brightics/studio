/**
 * Created by ty0314.kim on 2016-01-27.
 */

(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function ItemList(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.options.selectedItems = [];
        this.options.selectedIndexes = [];
        this.options.changedItems = {};
        this.options.items = [];
        this.eventListeners = {};
        this.sortOptions = {};


        this._initEventListeners();
        this.retrieveParent();
        this.createControls();
        this._setSortFunction();
    }

    ItemList.prototype._setSortFunction = function () {
        var _this = this;

        this.compareFunctionGenerator = function (comp, getter) {
            getter = getter || (function (x) {
                return x;
            });
            return function (a, b) {
                return comp(getter(a), getter(b));
            };
        };

        var comp = function (a, b) {
            return String(a).localeCompare(String(b));
        };

        var getter = (function (that) {
            return function (x) {
                return that.options.items[x].item;
            }
        }(this));

        this.sortOptions = {
            comp: comp,
            getter: getter,
            sortOnIndex: _this.compareFunctionGenerator(comp, getter),
            sortOnValue: _this.compareFunctionGenerator(comp)
        };
    };

    ItemList.prototype._initEventListeners = function () {
        this.eventListeners = {
            'selectAll': this._handleSelectAll.bind(this),
            'unselectAll': this._handleUnselectAll.bind(this),
            'select': this._handleSelect.bind(this),
            'unselect': this._handleUnselect.bind(this),
            'close': this._handleClose.bind(this)
        };
    };

    ItemList.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ItemList.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-widget-controls-itemlist">' +
            '   <div class="brtc-va-widget-controls-itemlist-selectbutton-wrapper">' +
            '       <span class="brtc-va-widget-controls-itemlist-selectcounter counter">0</span>' +
            '       <span class="brtc-va-widget-controls-itemlist-selectcounter">items selected</span>' +
            '       <button class="brtc-va-widget-controls-itemlist-clearbutton">Clear</button>' +
            '       <button class="brtc-va-widget-controls-itemlist-selectbutton">Select</button>' +
            '   </div>' +
            '   <div class="brtc-va-widget-controls-itemlist-control" />' +
            '');
        this.$parent.append(this.$mainControl);

        this.$selectButton = this.$mainControl.find('.brtc-va-widget-controls-itemlist-selectbutton');
        this.$selectButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            height: 25
        });

        this.$selectButton.on('click', function () {
            _this.openItemSelector();
        });

        this.$clearButton = this.$mainControl.find('.brtc-va-widget-controls-itemlist-clearbutton');
        this.$clearButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            height: 25
        });

        this.$clearButton.on('click', function () {
            _this.clearSelectedItems();
        });

        this.$itemControl = this.$mainControl.find('.brtc-va-widget-controls-itemlist-control');
        this.createItemListControl(this.$itemControl);
        this.createItemSelector();
    };

    ItemList.prototype.createItemListControl = function ($parent) {
        var _this = this;

        var rendergridrows = function (params) {
            var data = {};
            for (var i = params.startindex; i < params.endindex && i < _this.options.selectedItems.length; ++i) {
                data[i] = {item: _this.options.selectedItems[i]};
            }
            return data;
        };

        var columnrenderer = function (row, column, cellvalue) {
            if (row < _this.options.selectedItems.length) {
                return '' +
                    '<div class="brtc-va-widget-controls-itemselector-itemcontainer-element" row-index="' + row + '">' +
                    // '   <span class="brtc-va-widget-controls-itemselector-itemcontainer-element-type"></span>' +
                    '   <span class="brtc-va-widget-controls-itemselector-itemcontainer-element-name" title="' + cellvalue + '">' + cellvalue + '</span>' +
                    '   <span class="brtc-va-widget-controls-itemselector-itemcontainer-element-remove"></span>' +
                    '</div>';
            }
        };

        var source = {
            localdata: this.options.selectedItems,
            datatype: "array",
            beforeprocessing: function () {
                source.totalrecords = _this.options.selectedItems.length;
            }
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $($parent).jqxGrid({
            width: _this.options.width || '100%',
            theme: Brightics.VA.Env.Theme,
            height: _this.options.height || 120,
            virtualmode: true,
            pageable: false,
            source: dataAdapter,
            rendergridrows: rendergridrows,
            selectionmode: 'none',
            showheader: false,
            rowsheight: 20,
            columns: [{
                text: 'Item',
                datafield: 'item',
                cellsrenderer: columnrenderer,
                width: '100%',
                cellsalign: 'left'
            }]
        });

        $($parent).jqxGrid('localizestrings', {
            emptydatastring: ' '
        });
    };

    ItemList.prototype.createItemSelector = function () {
        var _this = this;
        this.options.multiple = true;
        this.options.fromModal = true;
        this.itemSelector = new Brightics.VA.Core.Widget.Controls.ItemSelector(this.$mainControl, {
            multiple: _this.options.multiple,
            fromModal: _this.options.fromModal,
            limit: _this.options.limit,
            showDesc: _this.options.showDesc,
            changed: function (event, data) {
                if (_this.eventListeners[event] && typeof _this.eventListeners[event] === 'function') {
                    _this.eventListeners[event](data);
                }
            }
        });
    };

    ItemList.prototype._getUniqueItems = function (items, key) {
        var checked = {};
        var arr = [];
        for (var i = 0; i < items.length; ++i) {
            var item = typeof key === 'undefined' ? items[i] : items[i][key];
            if (typeof checked[item] === 'undefined') {
                checked[item] = true;
                arr.push(items[i]);
            }
        }
        return arr;
    };

    ItemList.prototype.setItems = function (items) {
        //get unique elements
        this.options.items = this._getUniqueItems(items, 'item');
        this.itemSelector.setSortOptions(this.sortOptions);
        this.itemSelector.setSource(this.options.items);
    };

    ItemList.prototype.setSelectedItems = function (items) {
        var uniqueItems = this._getUniqueItems(items || []);
        this.options.selectedItems = $.extend(true, [], uniqueItems);
        this.options.selectedItems.sort(this.compareFunctionGenerator(this.sortOptions.comp, function (x) {
            return x.item;
        }));
        this.options.selectedIndexes = this.itemSelector.calcSelectedIndexes(this.options.selectedItems);
        this.refreshControl();
    };

    ItemList.prototype.getSelectedItems = function () {
        return this.options.selectedItems;
    };

    ItemList.prototype.refreshControl = function () {
        var _this = this;
        this.$itemControl.jqxGrid('updatebounddata');

        this.$mainControl.find('.brtc-va-widget-controls-itemlist-selectcounter.counter').text(this.options.selectedItems.length);
        this.$itemControl.find('.jqx-grid-cell').mouseover(function (event) {
            $(this).find('.brtc-va-widget-controls-itemselector-itemcontainer-element-remove').show();
            var clickHandler = function () {
                var index = $(this).closest('.brtc-va-widget-controls-itemselector-itemcontainer-element').attr('row-index');
                _this.removeItem(index);
                _this.refreshControl();
            };
            $(this).find('.brtc-va-widget-controls-itemselector-itemcontainer-element-remove').unbind('click');
            $(this).find('.brtc-va-widget-controls-itemselector-itemcontainer-element-remove').bind('click', clickHandler);
        });
        this.$itemControl.find('.jqx-grid-cell').mouseout(function (event) {
            $(this).find('.brtc-va-widget-controls-itemselector-itemcontainer-element-remove').hide();
        });
    };

    ItemList.prototype.clearSelectedItems = function () {
        this.itemSelector.clearSelectedItems();
        this.setSelectedItems([]);
        this.options.changed('clear', {items: []});
    };

    ItemList.prototype.removeItem = function (index) {
        var unSelectItemName = this.options.selectedItems[index];
        var idx = this.options.selectedIndexes[index];
        this.options.selectedItems.splice(index, 1);
        this.options.selectedIndexes.splice(index, 1);
        this.itemSelector.unselectRow(idx);
        this.options.changed('removed', {
            added: [],
            removed: [unSelectItemName],
            items: this.options.selectedItems
        });
    };

    ItemList.prototype.openItemSelector = function () {
        /*var position = this.getSelectorPosition();*/
        this.itemSelector.open(this.$clearButton, this.options.selectedItems, this.options.selectedIndexes);
    };

    ItemList.prototype.getSelectorPosition = function () {
        var position = {
            left: 0,
            top: 0
        };

        position.left = this.$mainControl.offset().left + this.$mainControl.width() + 5;
        position.top = this.$mainControl.offset().top;

        var browserHeight = document.all ? document.body.clientHeight : window.innerHeight,
            itemSelectorHeight = this.itemSelector.getHeight();

        if (browserHeight - itemSelectorHeight - 10 < position.top) {
            position.top = browserHeight - itemSelectorHeight - 10;
        }
        return position;
    };

    ItemList.prototype.isLimited = function (add) {
        if (this.options.limit < this.options.selectedItems.length + (add || 0)) {
            Brightics.VA.Core.Utils.WidgetUtils.openWarningDialog('You are only allowed to select ' + this.options.limit + ' items.');
            this.itemSelector.close();
            return true;
        }
        return false;
    };

    ItemList.prototype.processing = function (status) {
        this.itemSelector._processing(status);
    };

    ItemList.prototype._updateChangedItemOrDelete = function (type, key) {
        //type = 'select' or 'unselect'
        if (typeof this.options.changedItems[key] !== 'undefined' &&
            this.options.changedItems[key] !== type) {
            delete this.options.changedItems[key];
        } else {
            this.options.changedItems[key] = type;
        }
    };

    ItemList.prototype._handleSelectAll = function (data) {
        var newSelected = [];

        var l = 0;
        var r = 0;
        //newSelected = paramSelected - (curSelected intersection  paramSelected)
        while (l < this.options.selectedIndexes.length &&
        r < data.length && !this.isLimited(newSelected.length + 1)) {
            if (this.options.selectedIndexes[l] < data[r].id) {
                l++;
            } else if (this.options.selectedIndexes[l] > data[r].id) {
                this._updateChangedItemOrDelete('select', data[r].value);
                newSelected.push(data[r]);
                r++;
            } else {
                l++;
                r++;
            }
        }
        while (r < data.length && !this.isLimited(newSelected.length + 1)) {
            this._updateChangedItemOrDelete('select', data[r].value);
            newSelected.push(data[r]);
            r++;
        }
        //

        var nextSelectedIndexes = [];
        var nextSelectedItems = [];
        l = 0;
        r = 0;
        //nextSelected = curSelected union newSelected
        while (l < this.options.selectedIndexes.length && r < newSelected.length) {
            if (this.options.selectedIndexes[l] < newSelected[r].id) {
                nextSelectedIndexes.push(this.options.selectedIndexes[l]);
                nextSelectedItems.push(this.options.selectedItems[l]);
                l++;
            } else if (this.options.selectedIndexes[l] > newSelected[r].id) {
                nextSelectedIndexes.push(newSelected[r].id);
                nextSelectedItems.push(newSelected[r].value);
                r++;
            } else {
                nextSelectedIndexes.push(this.options.selectedIndexes[l]);
                nextSelectedItems.push(this.options.selectedItems[l]);
                l++;
                r++;
            }
        }

        while (l < this.options.selectedIndexes.length) {
            nextSelectedIndexes.push(this.options.selectedIndexes[l]);
            nextSelectedItems.push(this.options.selectedItems[l]);
            l++;
        }

        while (r < newSelected.length) {
            nextSelectedIndexes.push(newSelected[r].id);
            nextSelectedItems.push(newSelected[r].value);
            r++;
        }

        this.options.selectedIndexes = nextSelectedIndexes;
        this.options.selectedItems = nextSelectedItems;
        this.refreshControl();
    };

    ItemList.prototype._handleUnselectAll = function (data) {
        var nextSelectedIndexes = [];
        var nextSelectedItems = [];
        var l = 0;
        var r = 0;

        while (l < this.options.selectedItems.length && r < data.length) {
            if (this.options.selectedIndexes[l] < data[r].id) {
                nextSelectedIndexes.push(this.options.selectedIndexes[l]);
                nextSelectedItems.push(this.options.selectedItems[l]);
                l++;
            } else if (this.options.selectedIndexes[l] > data[r].id) {
                r++;
            } else {
                this._updateChangedItemOrDelete('unselect', data[r].value);
                l++;
                r++;
            }
        }

        while (l < this.options.selectedItems.length) {
            nextSelectedIndexes.push(this.options.selectedIndexes[l]);
            nextSelectedItems.push(this.options.selectedItems[l]);
            l++;
        }

        this.options.selectedIndexes = nextSelectedIndexes;
        this.options.selectedItems = nextSelectedItems;
        this.refreshControl();
    };

    ItemList.prototype._handleSelect = function (data) {
        if (this.isLimited(1)) return;

        var pos = 0;
        while (pos < this.options.selectedItems.length && this.options.selectedIndexes[pos] < data.id) {
            ++pos;
        }

        if (pos < this.options.selectedItems.length && this.options.selectedIndexes[pos] === data.id) return;

        this.options.selectedIndexes.splice(pos, 0, data.id);
        this.options.selectedItems.splice(pos, 0, data.value);
        this._updateChangedItemOrDelete('select', data.value);
        this.refreshControl();
    };

    ItemList.prototype._handleUnselect = function (data) {
        var pos = this.options.selectedIndexes.indexOf(data.id);
        if (pos !== -1) {
            this.options.selectedItems.splice(pos, 1);
            this.options.selectedIndexes.splice(pos, 1);
            this._updateChangedItemOrDelete('unselect', data.value);
            this.refreshControl();
        }
    };

    ItemList.prototype._handleClose = function (data) {
        var added = [], removed = [];
        for (var key in this.options.changedItems) {
            if (this.options.changedItems[key] === 'select') {
                added.push(key);
            } else {
                removed.push(key);
            }
        }
        if (added.length > 0 || removed.length > 0) {
            this.options.changed('change', {
                added: added,
                removed: removed,
                items: this.options.selectedItems
            });
        }
        this.options.changedItems = {};
    };

    Brightics.VA.Core.Widget.Controls.ItemList = ItemList;

}).call(this);
