/**
 * Created by jhoon80.kim on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function ItemSelector(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.sortOptions = {};

        this.initOptions();
        this.retrieveParent();
        this.createControl();
    }

    ItemSelector.prototype.initOptions = function () {
        var defaultOptions = {
            source: [],
            width: 290,
            height: 320,
            resizable: true,
            fromModal: false,
            limit: 99999999,
            showDesc: false
        };

        this.options = $.extend(true, defaultOptions, this.options);
    };

    ItemSelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ItemSelector.prototype.createControl = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-va-widget-controls-itemselector">' +
            '   <div class="brtc-va-widget-controls-itemselector-header" />' +
            '   <div class="brtc-va-widget-controls-itemselector-content brtc-style-full brtc-style-display-flex brtc-style-flex-direction-column" />' +
            '</div>'
        );
        this.$parent.append(this.$mainControl);

        var $contentControl = this.$mainControl.find('.brtc-va-widget-controls-itemselector-content');

        this.createFilter($contentControl);
        this.createSelectButton($contentControl);
        this.createItemContainer($contentControl);

        this.closeHandler = function (event) {
            if (_this.$mainControl.closest('.ui-dialog').has(event.target).length === 0) {
                _this.$mainControl.dialog('close');
            }
        };

        var jqxOptions = {
            theme: Brightics.VA.Env.Theme,
            width: this.options.width,
            height: this.options.height,
            resizable: true,
            title: 'Select Items',
            autoOpen: false,
            modal: false,
            showAnimationDuration: 50,
            minHeight: 285,
            minWidth: 307,
            zIndex: this.getHighestZindex(),
            close: function () {
                if (!_this.options.fromModal) {
                    $('.jqx-window-modal').remove();
                }
                $(window).off('mousedown', _this.closeHandler);
                _this.options.changed('close', []);
            }
        };
        this.$mainControl.dialog(jqxOptions);
        this.$mainControl.siblings('.ui-dialog-titlebar.ui-widget-header').addClass('brtc-style-itemselector');
        this.$mainControl.css('z-index', this.getHighestZindex());

    };

    ItemSelector.prototype.createFilter = function ($parent) {
        var _this = this;
        var $container = $('<div class="brtc-va-widget-controls-itemselector-filter-container"></div>');
        $parent.append($container);

        this.$filterControl = $('<input type="search" placeholder="Search Item" />');
        $container.append(this.$filterControl);

        this.$filterControl.jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: "Search Item",
            height: 31,
            minLength: 1
        });

        this.$filterControl.on('keyup search', function (event) {
            _this.$itemControl.jqxGrid('clearfilters');
            var filterType = 'stringfilter';
            var filterGroup = new $.jqx.filter();

            var filter_or_operator = 1;
            var filter = filterGroup.createfilter(filterType, event.target.value, 'contains');
            filterGroup.addfilter(filter_or_operator, filter);
            _this.$itemControl.jqxGrid('addfilter', 'item', filterGroup);
            _this.$itemControl.jqxGrid('applyfilters');
        });
    };

    ItemSelector.prototype.createSelectButton = function ($parent) {
        var _this = this;

        var $wrapper = $('<div class="brtc-item-check-box-wrapper"></div>');
        $parent.append($wrapper);

        this.$selectAllButton = $('<input type="button" value="Select All" style="width: 100%; float:left; margin-left: 0px;"/>');
        this.$clearAllButton = $('<input type="button" value="Unselect All" style="width: 100%; float:left; margin-left: 2px; margin-bottom: 2px;"/>');
        $wrapper.append(this.$selectAllButton);
        $wrapper.append(this.$clearAllButton);

        this.$selectAllButton.jqxButton({
            height: 23,
            width: 134,
            Theme: Brightics.VA.Env.Theme
        });

        this.$clearAllButton.jqxButton({
            height: 23,
            width: 134,
            Theme: Brightics.VA.Env.Theme
        });

        this.$selectAllButton.on('click', function () {
            _this.selectedAll();
        });

        this.$clearAllButton.on('click', function () {
            _this._processing(true);
            _this.unSelectedAll();
            _this._processing(false);
        });
    };

    ItemSelector.prototype.createItemContainer = function ($parent) {
        var _this = this,
            $gridWrapper = $('' +
                '<div class="brtc-va-progress">' +
                '     <span class="brtc-va-progress-loading"></span>' +
                '</div>' +
                '<div class="brtc-va-widget-controls-itemselector-itemcontainer-wrapper brtc-style-flex-1">' +
                '   <div class="brtc-va-widget-controls-itemselector-itemcontrol brtc-style-border-box"></div>' +
                '</div>');
        $parent.append($gridWrapper);
        var columnrenderer = function (row, column, cellvalue) {
            return '' +
                '<div class="brtc-va-widget-controls-itemselector-itemcontainer-element" row-index="' + row + '">' +
                // '   <span class="brtc-va-widget-controls-itemselector-itemcontainer-element-type"></span>' +
                '   <span class="brtc-va-widget-controls-itemselector-itemcontainer-element-name" title="' + cellvalue + '">' + cellvalue + '</span>' +
                '</div>';
        };

        this.$progress = $parent.find('.brtc-va-progress');
        this.$progress.hide();

        this.$itemControl = $gridWrapper.find('.brtc-va-widget-controls-itemselector-itemcontrol');
        var columns = [{
            text: 'Item',
            datafield: 'item',
            cellsrenderer: columnrenderer,
            // width: '100%',
            minwidth: 120,
            cellsalign: 'left'
        }];

        if (this.options.showDesc) {
            // columns[0].width = '100%';
            columns[0].minwidth = 90;
            columns.push({
                text: 'Description',
                datafield: 'description',
                cellsrenderer: columnrenderer,
                width: 110,
                minwidth: 90,
                maxwidth: 110,
                cellsalign: 'left'
            })
        }

        this.$itemControl.jqxGrid({
            width: '100%',
            theme: Brightics.VA.Env.Theme,
            height: '100%',
            pageable: false,
            selectionmode: 'checkbox',
            showheader: false,
            rowsheight: 20,
            columns: columns
        });

        this.$itemControl.on('rowselect', function (event) {
            if (!_this.systemEvent) {
                var index = event.args.rowindex;
                _this.options.changed('select', {
                    id: _this.invPos[index],
                    value: _this.options.source[index].item
                });
            }
        });

        this.$itemControl.on('rowunselect', function (event) {
            if (!_this.systemEvent) {
                var index = event.args.rowindex;
                _this.options.changed('unselect', {
                    id: _this.invPos[index],
                    value: _this.options.source[index].item
                });
            }
        });
    };

    ItemSelector.prototype.selectedAll = function () {
        var _this = this;
        this.systemEvent = true;

        var rows = this.$itemControl.jqxGrid('getrows');

        this.chkCnt++;
        var newSelectedRowIndexes = rows.map(function (row) {
            var index = typeof row.dataindex !== 'undefined' ? row.dataindex : row.boundindex;
            _this.chk[index] = _this.chkCnt;
            return index;
        });

        var filteredSelectedRowPos = this.pos.filter(function (position) {
            return _this.chk[position] === _this.chkCnt;
        });

        var curSelectedRowIndexes = this._getSelectedRowIndexes();
        var newSelectedRows = filteredSelectedRowPos.map(function (position) {
            return {
                id: _this.invPos[position],
                value: _this.options.source[position].item
            };
        });

        this.$itemControl.jqxGrid({selectedrowindexes: this._union(curSelectedRowIndexes, newSelectedRowIndexes)});
        this.$itemControl.jqxGrid('refresh');
        this.options.changed('selectAll', newSelectedRows);

        this.systemEvent = false;
    };

    ItemSelector.prototype.unSelectedAll = function () {
        var _this = this;
        this.systemEvent = true;


        var rows = this.$itemControl.jqxGrid('getrows');

        this.chkCnt++;
        var newUnselectedRowIndexes = rows.map(function (row) {
            var index = typeof row.dataindex !== 'undefined' ? row.dataindex : row.boundindex;
            _this.chk[index] = _this.chkCnt;
            return index;
        });

        var filteredUnselectedRowPos = this.pos.filter(function (position) {
            return _this.chk[position] === _this.chkCnt;
        });

        var newUnselectedRows = filteredUnselectedRowPos.map(function (position) {
            return {
                id: _this.invPos[position],
                value: _this.options.source[position].item
            };
        });

        var curSelectedRowIndexes = this._getSelectedRowIndexes();

        this.$itemControl.jqxGrid({selectedrowindexes: this._difference(curSelectedRowIndexes, newUnselectedRowIndexes)});
        this.$itemControl.jqxGrid('refresh');
        this.options.changed('unselectAll', newUnselectedRows);

        this.systemEvent = false;
    };

    ItemSelector.prototype._getSelectedRowIndexes = function () {
        return this._countingSort(this.$itemControl.jqxGrid('getselectedrowindexes'), this.options.source.length);
    };

    ItemSelector.prototype._preCalculation = function (source) {
        var _this = this;

        //pos[x] = y, invPos[y] = x;
        this.pos = [];
        this.invPos = [];
        this.chk = [];
        this.chkCnt = 0;
        var n = source.length;

        for (var i = 0; i < n; ++i) {
            this.pos.push(i);
            this.invPos.push(-1);
            this.chk.push(-1);
        }

        this.pos.sort(this.sortOptions.sortOnIndex);

        this.pos.forEach(function (y, x) {
            _this.invPos[y] = x;
        });
    };

    ItemSelector.prototype.setSource = function (source) {
        this.options.source = source;
        this._preCalculation(source);
        var datafields = [{
            name: 'item',
            type: 'string'
        }];
        if (this.options.showDesc) {
            datafields.push({
                name: 'description',
                type: 'string'
            })
        }
        var sourceForAdapter = {
            localdata: this.options.source,
            datatype: "array",
            datafields: datafields
        };
        var dataAdapter = new $.jqx.dataAdapter(sourceForAdapter);
        this.$itemControl.jqxGrid({source: dataAdapter});
    };

    ItemSelector.prototype.getSource = function () {
        return this.options.source;
    };

    ItemSelector.prototype.calcSelectedIndexes = function (selectedItems) {
        var _this = this;
        var selectedIndexes = [];
        var l = 0;
        var r = 0;

        while (l < selectedItems.length && r < this.pos.length) {
            var a = selectedItems[l];
            var b = this.options.source[this.pos[r]].item;
            var res = this.sortOptions.comp(a, b);

            if (res < 0) { //a < b
                l++;
            } else if (res > 0) { //a > b
                r++;
            } else {
                selectedIndexes.push(r);
                l++;
                r++;
            }
        }
        return selectedIndexes;
    };

    ItemSelector.prototype.setSelectedItems = function (selectedData, selectedIndexes) {
        var _this = this;
        this._processing(true);
        this.systemEvent = true;

        var filteredSelectedIndexes = selectedIndexes.filter(function (index) {
            return index < _this.options.source.length;
        });

        this.chkCnt++;
        var originalSelectedIndexes = filteredSelectedIndexes.map(function (index) {
            return _this.pos[index];
        });

        originalSelectedIndexes.forEach(function (index) {
            _this.chk[index] = _this.chkCnt;
        });

        originalSelectedIndexes = this._countingSort(originalSelectedIndexes, this.options.source.length);

        this.$itemControl.jqxGrid({selectedrowindexes: originalSelectedIndexes});
        this.$itemControl.jqxGrid('refresh');
        this.systemEvent = false;
        this._processing(false);
    };

    ItemSelector.prototype._countingSort = function (arr, n) {
        var count = [];

        for (var i = 0; i < n; ++i) {
            count.push(-1);
        }

        arr.forEach(function (index) {
            count[index] = index;
        });

        var ret = count.filter(function (val, idx) {
            return val === idx;
        });

        return ret;
    };

    ItemSelector.prototype._processing = function (status) {
        if (status) {
            $(window).off('mousedown', this.closeHandler);
            this.$progress.show();
        } else {
            $(window).on('mousedown', this.closeHandler);
            this.$progress.hide();
        }
    };

    ItemSelector.prototype.open = function (position, selectedItems, selectedIndexes) {
        this.selectEventFlag = false;
        this.systemEvent = true;
        this.$itemControl.jqxGrid('clearselection');
        this.systemEvent = false;

        this.$mainControl.dialog({
            position: {
                my: 'left top',
                at: 'right+5, top',
                of: position
            }
        });

        this.$mainControl.dialog('open');
        // this.$mainControl.dialog('focus');
        this.$mainControl.css('z-index', this.getHighestZindex());
        $(window).on('mousedown', this.closeHandler);
        var datafields = [{
            name: 'item',
            type: 'string'
        }];
        if (this.options.showDesc) {
            datafields.push({
                name: 'description',
                type: 'string'
            })
        }
        var source = {
            localdata: this.options.source,
            datatype: "array",
            datafields: datafields
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$itemControl.jqxGrid({source: dataAdapter});
        this.setSelectedItems(selectedItems, selectedIndexes);
    };

    ItemSelector.prototype.close = function () {
        this.$mainControl.dialog('close');
    };

    ItemSelector.prototype.getHighestZindex = function () {
        var jqxWindowList = $('body').children('.jqx-window');
        var maxIndex = 0, newIndex = 0;

        //fixme: jqxWindow관???�스 ?�리 ?�요
        for (var jqxWindowIndex = 0; jqxWindowIndex < jqxWindowList.length; jqxWindowIndex++) {
            newIndex = parseInt($(jqxWindowList[jqxWindowIndex]).css('z-index')) || 0;
            if (newIndex > maxIndex) {
                maxIndex = newIndex;
            }
        }
        return maxIndex + 1;
    };

    ItemSelector.prototype.getHeight = function () {
        return this.$mainControl.height();
    };

    ItemSelector.prototype.clear = function () {
        this.systemEvent = true;
        for (var i = 0; i < this.options.source.length; ++i) {
            this.$itemControl.jqxGrid({selectedrowindexes: []});
        }
        this.systemEvent = false;
    };

    ItemSelector.prototype.clearSelectedItems = function () {
        this.$itemControl.jqxGrid({selectedrowindexes: []});
    };

    ItemSelector.prototype.unselectRow = function (index) {
        this.$itemControl.jqxGrid('unselectrow', this.pos[index]);
    };

    ItemSelector.prototype._union = function (a, b) {
        //set operation. a union b.
        var l = 0;
        var r = 0;
        var ret = [];

        while (l < a.length && r < b.length) {
            if (a[l] < b[r]) {
                ret.push(a[l]);
                l++;
            } else if (a[l] > b[r]) {
                ret.push(b[r]);
                r++;
            } else {
                ret.push(a[l]);
                l++;
                r++;
            }
        }

        while (l < a.length) {
            ret.push(a[l]);
            l++;
        }

        while (r < b.length) {
            ret.push(b[r]);
            r++;
        }

        return ret;
    };

    ItemSelector.prototype._difference = function (a, b) {
        //set operation. a - b.
        var l = 0;
        var r = 0;
        var ret = [];

        while (l < a.length && r < b.length) {
            if (a[l] < b[r]) {
                ret.push(a[l]);
                l++;
            } else if (a[l] > b[r]) {
                r++;
            } else {
                l++;
                r++;
            }
        }

        while (l < a.length) {
            ret.push(a[l]);
            l++;
        }

        return ret;
    };

    ItemSelector.prototype.setSortOptions = function (options) {
        this.sortOptions = options;
    };

    Brightics.VA.Core.Widget.Controls.ItemSelector = ItemSelector;

}).call(this);
