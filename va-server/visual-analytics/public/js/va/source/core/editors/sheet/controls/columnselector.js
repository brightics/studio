/**
 * Created by ty0314.kim on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    const ITEM_HEIGHT = 30;

    /**
     * {
     *      source: [],
     *      width: 250,
     *      height: 320,
     *      resizable: false,
     *      title: '',
     *      multiple: true, // if true multi select
     *      changed: Function
     * }
     * @param parentId
     * @param options
     * @constructor
     */
    function ColumnSelector(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.initOptions();
        this.retrieveParent();
        this.createControl();
    };

    ColumnSelector.prototype.initOptions = function () {
        var defaultOptions = {
            source: [],
            width: 300,
            height: 320,
            resizable: true,
            multiple: false,
            fromModal: false
        };

        this.options = $.extend(true, defaultOptions, this.options);
    };

    ColumnSelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ColumnSelector.prototype.createControl = function () {
        var _this = this;

        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-columnselector-editarea">' +
            '   <div class="brtc-va-editors-sheet-controls-columnselector-header" />' +
            '   <div class="brtc-va-editors-sheet-controls-columnselector-content brtc-style-full brtc-style-display-flex brtc-style-flex-direction-column" />' +
            '</div>');

        var $contentControl = this.$mainControl.find('.brtc-va-editors-sheet-controls-columnselector-content');

        this.createFilter($contentControl);
        if (this.options.multiple) {
            this.createSelectButton($contentControl);
        }
        this.createColumnContainer($contentControl);

        var dialogOptions = {
            theme: Brightics.VA.Env.Theme,
            width: this.options.width || 300,
            height: this.options.height,
            resizable: true,
            title: (this.options.multiple) ? 'Select Columns' : 'Select Column',
            autoOpen: false,
            modal: false,
            showAnimationDuration: 50,
            minHeight: 285,
            minWidth: 307,
            resize: function () {
                _this._renderItems();
                _this._updatePerfectScroll();
            },
            close: function () {
                $(window).off('mousedown', _this.closeHandler);
                _this.options.changed('close');
            },
            destroy: function () {
                _this.$mainControl.dialog('destroy');
            }
        };
        if (!this.options.multiple) {
            dialogOptions.height -= 33;
        }
        this.$mainControl.dialog(dialogOptions);
        this.$mainControl.attr('name', dialogOptions.title);
        this.$mainControl.parent().find('.ui-dialog-titlebar.ui-widget-header').css({'border-bottom': 'none !important;'});
        this.$mainControl.parent().find('button.ui-dialog-titlebar-close').attr('style', 'right: -38px !important;');

        this.closeHandler = function (event) {
            if (_this.$mainControl.closest('.ui-dialog').has(event.target).length === 0) {
                _this.$mainControl.dialog('close');
            }
        };
    };

    ColumnSelector.prototype.createFilter = function ($parent) {
        var _this = this;

        var $container = $('<div class="brtc-va-editors-sheet-controls-columnselector-filter-container"></div>');
        $parent.append($container);

        this.$filterControl = $('<input type="search" placeholder="Search Column" />');
        $container.append(this.$filterControl);

        this.$filterControl.jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: "Search Column",
            height: 31,
            minLength: 1
        });

        this.$filterControl.on('keyup search', function (event) {
            clearTimeout(_this._searchHandler);

            _this._searchHandler = setTimeout(function () {
                var value = event.target.value;
                _this._searchFilteredItem(value);
                _this._renderItems();
            }, 100);
        });
    };

    ColumnSelector.prototype.updateScrollPosition = function () {
        var selected = this._filteredItems.findIndex(x => this._selectedItemMap[x.name]);
        if (selected > -1) {
            this.$columnContainer[0].scrollTop = selected * ITEM_HEIGHT;
        }
    };

    ColumnSelector.prototype._updatePerfectScroll = function () {
        this.$mainControl.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-wrapper').perfectScrollbar('update');
    };

    ColumnSelector.prototype._searchFilteredItem = function (value) {
        this._filteredItems = this.options.source
                                .filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);

        this.setAllCheckBoxCondition();
    };


    ColumnSelector.prototype._resetFilter = function () {
        this.$filterControl.val('');
        this._searchFilteredItem('');
    };


    ColumnSelector.prototype.setAllCheckBoxCondition = function () {
        if (!this.options.multiple) return;
        var isSelectedAll = true;
        
        for (var i = 0; i < this._filteredItems.length; i++) {
            if (!this._selectedItemMap[this._filteredItems[i].name]) {
                isSelectedAll = false;
                break;
            }
        }

        if (isSelectedAll) {
            this.$selectButton.jqxCheckBox('checked', true);
        } else {
            this.$selectButton.jqxCheckBox('checked', false);
        }
    };


    ColumnSelector.prototype.createSelectButton = function ($parent) {
        var _this = this;

        var $wrapper = $('<div class="brtc-column-check-box-wrapper"></div>');
        $parent.append($wrapper);

        this.$selectButton = $('<div id="brtc-column-check-box"><span>Select All</span></div>');
        $wrapper.append(this.$selectButton);

        this.$selectButton.jqxCheckBox({
            theme: "office",
            width: 120,
            height: 25,
            checked: false,
            boxSize: "17px",
            animationShowDelay: 10,
            animationHideDelay: 10
        });

        this.$selectButton.on('click', function (event, indirectClick) {
            if (!indirectClick) {
                if ($(this).val()) {
                    _this._selectAllItem();
                }
                else {
                    _this._unSelectAllItem();
                }
            } else {
                $(this).val(!$(this).val());
            }
        });
    };

    ColumnSelector.prototype.createColumnContainer = function ($parent) {
        var _this = this;

        var $columnContainerWrapper = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-wrapper brtc-style-flex-1"></div>');
        $parent.append($columnContainerWrapper);

        this.$columnContainer = $('<div class ="brtc-va-editors-sheet-controls-columnselector-columncontainer-list"></div>');
        $columnContainerWrapper.append(this.$columnContainer);

        // $columnContainerWrapper.perfectScrollbar({suppressScrollX: true});
        // $columnContainerWrapper.on('ps-scroll-y', function () {
        //     _this._renderItems();
        // });
    };

    ColumnSelector.prototype.createTypeLabel = function (type) {
        return type ? type.substring(0, 1).toUpperCase() : this.options.defaultType;
    };

    ColumnSelector.prototype.getSelectedItems = function () {
        return Object.keys(this._selectedItemMap);
    };

    // ColumnSelector.prototype.getMaxWidth = function (source) {
    //     return 250;
    // };

    ColumnSelector.prototype._getItem = function (columnName) {
        return this.options.source.find(x => x.name === columnName);
    };

    ColumnSelector.prototype._selectAllItem = function () {
        var columnName;
        var itemList = [];
        for (var i = 0; i < this._filteredItems.length; i++) {
            columnName = this._filteredItems[i].name;
            this._checkItemButton(columnName);
            this._selectedItemMap[columnName] = true;
            itemList.push(this._getItem(columnName));
        }
        this.options.changed('selectAll', itemList);
    };

    ColumnSelector.prototype._unSelectAllItem = function () {
        var columnName;
        var itemList = [];
        for (var i = 0; i < this._filteredItems.length; i++) {
            columnName = this._filteredItems[i].name;
            this._unCheckItemButton(columnName);
            delete this._selectedItemMap[columnName];
            itemList.push(this._getItem(columnName));
        }
        this.options.changed('unselectAll', itemList);
    };

    ColumnSelector.prototype._addSelectedItem = function (columnName) {
        if (!this.options.multiple) {
            this._selectedItemMap = {};
        }

        this._selectedItemMap[columnName] = true;
        this.options.changed('select', this._getItem(columnName));
    };

    ColumnSelector.prototype._deleteSelectedItem = function (columnName) {
        delete this._selectedItemMap[columnName];
        this.options.changed('unselect', this._getItem(columnName));
    };
    ColumnSelector.prototype._checkItemButton = function (columnName) {
        if (!this.options.multiple) {
            this.$columnContainer.find(`.brtc-va-editors-sheet-controls-columnselector-button`).removeClass('checked');
        }
        this.$columnContainer.find(`.brtc-va-editors-sheet-controls-columnselector-button[data-name=${columnName}]`).removeClass('checked').addClass('checked');
    };
    ColumnSelector.prototype._unCheckItemButton = function (columnName) {
        this.$columnContainer.find(`.brtc-va-editors-sheet-controls-columnselector-button[data-name=${columnName}]`).removeClass('checked');
    };

    ColumnSelector.prototype.setSource = function (source) {
        this.options.source = source;

        this._selectedItemMap = {};

        // 2016.10.20 정명규 수정
        // source에 internalType과 type을 합쳐 combineType을 추가 :
        // jqxListBox에 renderer 할때 displayMember 랑 value 멤버 둘만 보여준다.
        // 현재는 type을 보고 있는데 나중에 internalType을 보게되면 합칠 필요는 없어짐
        for (var i in this.options.source) {
            var _internalType = (this.options.source[i].internalType) ? this.options.source[i].internalType : this.options.source[i].type;
            this.options.source[i].combineType = _internalType + '?' + this.options.source[i].type;
        }

        this._createItems(this.options.source);
        this._filteredItems = this.options.source.map(x => x);
    };

    ColumnSelector.prototype._renderItems = function () {
        this._createItems(this._filteredItems);
    };


    ColumnSelector.prototype._createItems = function (items) {
        var _this = this;
        var buttonType = this.options.multiple === true ? 'checkbox' : 'radio';
        
        let config = {
            itemHeight: ITEM_HEIGHT,
            total: items.length,
            generate(index) {
                let item = items[index];
                
                var typeArr = item.combineType.split('?');

                var internalType = typeArr[0],
                    type = typeArr[1];

                var text = Brightics.VA.Core.Utils.CommonUtils.convertDataTypeForText(type, internalType),
                    title = Brightics.VA.Core.Utils.CommonUtils.convertDataTypeForTitle(type, internalType);

                var dataType = _this.createTypeLabel(type);

                var $item = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-list-wrapper" name="' + item.name + '">');
                $item.append('<div class="brtc-va-editors-sheet-controls-columnselector-button brtc-style-button" button-type="' + buttonType + '"></div>');
                $item.append('' +
                    '<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element" title="' + Utils.WidgetUtils.convertHTMLSpecialChar(item.name) + '">' +
                    '   <span class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element-type" title="' + title + '" internal-type="' + internalType.toLowerCase() + '" data-type="' + Utils.WidgetUtils.convertHTMLSpecialChar(dataType) + '">' + text + '</span>' +
                    '   <span class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element-name" name="' + item.name + '">' + Utils.WidgetUtils.convertHTMLSpecialChar(item.name) + '</span>' +
                    '</div>');
                
                if (_this._selectedItemMap[item.name]) {
                    $item.find('.brtc-va-editors-sheet-controls-columnselector-button').addClass('checked');
                } else {
                    $item.find('.brtc-va-editors-sheet-controls-columnselector-button').removeClass('checked');
                }
                $item.find('.brtc-va-editors-sheet-controls-columnselector-button').attr('data-name', item.name);
                $item.attr('name', item.name);

                _this._createItemClickEvent($item);
                return $item[0];
            }
        };

        if (config.total > 0 && !this.list) {
            this.$columnContainer.css('position', 'relative');            
            this.list = HyperList.create(this.$columnContainer[0], config);
        } else if (this.list) {
            this.list.refresh(this.$columnContainer[0], config);
        }
    };

    ColumnSelector.prototype._createItemClickEvent = function ($item) {
        var _this = this;
        $item.click(function () {
            if (!_this.options.multiple) {
                var columnName = $item.attr('name');
                _this._checkItemButton(columnName);
                _this._addSelectedItem(columnName);

            } else {
                var isChecked = $item.find('.brtc-va-editors-sheet-controls-columnselector-button').hasClass('checked');
                if (isChecked) {
                    let columnName = $item.attr('name');
                    _this._unCheckItemButton(columnName);
                    _this._deleteSelectedItem(columnName);
                } else {
                    let columnName = $item.attr('name');
                    _this._checkItemButton(columnName);
                    _this._addSelectedItem(columnName);
                }

                _this.setAllCheckBoxCondition();
            }
        });
    };

    ColumnSelector.prototype.setSelectedItems = function (selectedData) {
        this._selectedItemMap = {};

        for (var i in selectedData) {
            this._selectedItemMap[selectedData[i]] = true;
        }
    };

    ColumnSelector.prototype.open = function (position, listsource) {
        var _this = this;

        this._resetFilter();
        this.setSelectedItems(listsource);
        this.setAllCheckBoxCondition();

        this.$mainControl.dialog({
            position: {my: "left top", at: "right+5 top", of: position}
        });

        this.$mainControl.parent().find('.ui-dialog-titlebar.ui-widget-header').attr('style', 'border: none !important; margin-left: 11px !important');
        this.$mainControl.dialog('open');
        $(window).on('mousedown', this.closeHandler);
        this.$parent.closest('.ps-container').on('scroll', function (event) {
            _this.closeHandler(event);
        });

        this.updateScrollPosition();
        this._renderItems();
    };

    ColumnSelector.prototype.close = function (source) {
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Editors.Sheet.Controls.ColumnSelector = ColumnSelector;

}).call(this);
