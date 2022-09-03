(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function ColumnList(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.initOptions();
        this.retrieveParent();
        this.createControls();
        this.$mainControl.data(this);
    }

    ColumnList.prototype.initOptions = function () {
        var defaultOptions = {
            multiple: true,
            rowCount: 1,
            maxRowCount: 3,
            expand: false,
            draggable: false,
            sort: 'none',
            sortBy: 'name',
            showOpener: 'button',
            removable: true,
            defaultType: '',
            openerPosition: 'right',
            placeHolder: '',
            fromModal: false,
            isOneType: false
        };

        this.options = $.extend(true, defaultOptions, this.options);
        this.options.rowCount = this.options.multiple ? this.options.rowCount : 1;
        this.options.maxRowCount = this.options.multiple ? this.options.maxRowCount : 1;
        this.options.height = this.options.height? this.options.height : 25;

        this.options.items = [];
        this.options.selectedItems = [];
        this.options.renderedItems = {};
        this.options.changedItems = {};
    };

    ColumnList.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ColumnList.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-columnlist"/>');
        this.$parent.append(this.$mainControl);

        this.createColumnSelectButtonControl();
        this.createColumnListControl();
        this.createColumnSelector();
    };

    ColumnList.prototype.createColumnSelectButtonControl = function () {
        var _this = this;
        if (this.options.multiple) {
            this.$columnSelectButtonWrapper = $('<div class="brtc-va-editors-sheet-controls-columnlist-selectbutton-wrapper" />');
            this.$mainControl.append(this.$columnSelectButtonWrapper);

            this.$selectCounter = $('<div class="brtc-va-editors-sheet-controls-columnlist-selectcounter"><span class="columnlist-select-counter">0</span><span> columns selected</span></div>');
            this.$columnSelectButtonWrapper.append(this.$selectCounter);

            var $buttonContainer = $('<div class="brtc-va-selectbutton-container"></div>');
            this.$columnSelectButtonWrapper.append($buttonContainer);

            if (this.options.showOpener !== 'none') {
                this.$selectButton = $('<button class="brtc-va-editors-sheet-controls-columnlist-selectbutton">Select</button>');
                $buttonContainer.append(this.$selectButton);

                this.$selectButton.jqxButton({
                    theme: 'office',
                    height: this.options.height
                });

                this.$selectButton.on('click', function () {
                    _this.openColumnSelector(this);
                });
            }
        }
    };

    ColumnList.prototype.sortSelectedItems = function () {
        var _this = this;
        if (_this.options.sort === 'ascending') {
            this.options.selectedItems.sort(function (a, b) {
                return a[_this.options.sortBy] > b[_this.options.sortBy] ? 1 : a[_this.options.sortBy] < b[_this.options.sortBy] ? -1 : 0;
            });
        }
        if (_this.options.sort === 'descending') {
            this.options.selectedItems.sort(function (a, b) {
                return a[_this.options.sortBy] < b[_this.options.sortBy] ? 1 : a[_this.options.sortBy] > b[_this.options.sortBy] ? -1 : 0;
            });
        }
    };

    ColumnList.prototype.setMaxHeight = function () {
        var height = this.options.height * ( (this.options.maxRowCount == 0) ? 1 : this.options.maxRowCount);
        this.$columnListControl.css({'height': height + 'px'});
    };

    ColumnList.prototype.setSortable = function () {
        if (this.options.sort === 'none' && this.options.draggable === true
            && this.options.selectedItems.length > 1
            && this.options.selectedItems.length >= this.options.rowCount) {

            if (this.options.expand || this.$expanderContainer.css('display') === 'none') {
                this.$columnList.sortable({
                    axis: "y",
                    containment: "parent",
                    cursor: "move",
                    items: "div",
                    tolerance: "pointer",
                    helper: function (event, ui) {
                        var $clone = $(ui).clone();
                        $clone.css('position', 'absolute');
                        return $clone.get(0);
                    }
                });
                this.$columnList.sortable('enable');
            }
        }
    };

    ColumnList.prototype.setEmptyUnitHeight = function () {
        var height = this.options.height * ( (this.options.maxRowCount == 0) ? 1 : this.options.maxRowCount);
        this.$emptyUnit.css({'height': height + 'px'});
        this.$emptyUnit.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-empty').css({'line-height': height + 'px'});
    };

    ColumnList.prototype.createColumnListControl = function () {
        var _this = this;

        if (!this.options.placeHolder) {
            this.options.placeHolder = (this.options.multiple) ? '+ Select Columns' : '+ Select Column';
        }

        this.$columnContainerWrapper = $('<div class="brtc-va-editors-sheet-controls-columnlist-columncontainer-wrapper" />');
        this.$columnListControl = $('<div class="brtc-va-editors-sheet-controls-columnlist-columncontainer" />');
        this.setMaxHeight();

        this.$emptyUnit = $('' +
            '<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element">' +
            '   <div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element-empty">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.placeHolder) + '</div>' +
            '</div>');
        this.setEmptyUnitHeight();


        //this.$emptyUnit.css({'cursor': 'pointer'});
        this.$emptyUnit.on('click', function (event) {
            _this.openColumnSelector(this);
        });

        this.$columnListControl.append(this.$emptyUnit);
        this.$columnList = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-sortable" style="position: relative;"/>');
        this.$columnListControl.append(this.$columnList);
        this.$columnContainerWrapper.append(this.$columnListControl);

        /*if (this.options.multiple == true) {
            this.$columnList.perfectScrollbar({suppressScrollX: true});
        }*/

        this.$columnList.sortable({
            axis: "y",
            containment: "parent",
            cursor: "move",
            items: "div",
            tolerance: "pointer",
            helper: function (event, ui) {
                var $clone = $(ui).clone();
                $clone.css('position', 'absolute');
                return $clone.get(0);
            }
        });
        this.$columnList.sortable('disable');
        this.$columnList.on("sortstop", function (event, ui) {
            _this.options.selectedItems = _this.$columnList.sortable('toArray', {attribute: 'value'});
            _this.options.changed('sortchange', {items: _this.options.selectedItems});
        });

        this.$columnList.on('mousewheel', function(event){
            event.stopPropagation();
        });

        this.$expanderContainer = $('<div class="brtc-va-editors-sheet-controls-columnselector-expandercontainer" />');
        var $expand = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-expander" />'),
            $expandLeft = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-expander-left" />'),
            $expandCenter = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-expander-center" />'),
            $expandRight = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-expander-right" />');

        $expand.append($expandLeft).append($expandCenter).append($expandRight);

        this.$expandUp = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-expander-up" />');
        this.$expandUp.append('<i class="fa fa-angle-double-up"></i>');
        this.$expandDown = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-expander-down" />');
        this.$expandDown.append('<i class="fa fa-angle-double-down"></i>');
        $expandCenter.append(this.$expandUp).append(this.$expandDown);

        this.$remainNumber = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-expander-remain" />');
        $expandRight.append(this.$remainNumber);

        this.$expandUp.hide();
        this.$expandDown.show();

        $expand.click(function (event) {
            if (_this.$expandUp.css('display') === 'block') {
                _this.options.expand = false;
                _this.$expandUp.hide();
                _this.$expandDown.show();
                _this.$columnList.sortable('disable');
            } else if (_this.$expandDown.css('display') === 'block') {
                _this.options.expand = true;
                _this.$expandUp.show();
                _this.$expandDown.hide();
            }
            _this.renderColumnContainer();
        });

        this.$expanderContainer.append($expand);
        this.$expanderContainer.hide();
        this.$columnContainerWrapper.append(this.$expanderContainer);
        this.$mainControl.append(this.$columnContainerWrapper);
    };

    ColumnList.prototype.renderColumnContainer = function (mode) {
        var _this = this;

        var selectedItems = mode === 'all' ? this.options.items : this.options.selectedItems;
        selectedItems.length > 0 ? this.$emptyUnit.hide() : this.$emptyUnit.show();        
        this.setEmptyUnitHeight();
        if (mode !== 'all') this.sortSelectedItems();       

        let config = {
            itemHeight: this.options.height,
            total: selectedItems.length,
            generate(index) {
                let item = selectedItems[index];
                return _this.createColumnUnit(mode === 'all' ? item.name : item)[0];
            }
        };

        if (config.total > 0 && !this.list) {
            this.$columnList.css('position', 'relative');            
            this.list = HyperList.create(this.$columnList[0], config);
        } else if (this.list) {
            this.list.refresh(this.$columnList[0], config);
        }

        if (this.options.multiple) {
            this.$selectCounter.find('.columnlist-select-counter').text(this.options.selectedItems.length);
        }

        this.setSortable();
    };

    ColumnList.prototype.addColumnUnitAll = function () {
        this.renderColumnContainer('all');
        this.fillBackground();
    };

    ColumnList.prototype.createColumnSelector = function () {
        var _this = this;

        this.columnSelector = new Brightics.VA.Core.Editors.Sheet.Controls.ColumnSelector(this.$mainControl, {
            columnList: this,
            multiple: _this.options.multiple,
            fromModal: _this.options.fromModal,
            changed: function (event, data) {
                if (event === 'selectAll') {
                    if (data.length == _this.options.items.length && !_this.options.isOneType) {

                        let allItemArr = [];
                        for (var i in _this.options.items) {
                            if (_this.isSameType(_this.options.items[i])) return;
                            _this.options.changedItems[_this.options.items[i].name] = 'select';
                            allItemArr.push(_this.options.items[i].name);
                        }

                        _this.options.selectedItems = allItemArr;
                        _this.addColumnUnitAll();
                    } else {
                        for (var i in data) {
                            if (_this.isSameType(data[i])) return;
                            let inArray = $.inArray(data[i].name, _this.options.selectedItems);
                            if (inArray < 0) {
                                _this.options.changedItems[data[i].name] = 'select';
                                _this.options.selectedItems.push(data[i].name);
                            }

                            if (_this.options.multiple) {
                                _this.options.added({
                                    added: [data.name],
                                    removed: [],
                                    items: _this.options.selectedItems
                                });
                            } else {
                                _this.options.selectedItems = [data[i].name];
                            }
                        }

                        _this.refreshColumns();
                    }
                }
                if (event === 'unselectAll') {
                    if (data.length == _this.options.items.length) {
                        _this.options.selectedItems = [];

                        let allItemArr = [];
                        for (var i in _this.options.items) {
                            _this.options.changedItems[_this.options.items[i].name] = 'unselect';
                            allItemArr.push(_this.options.items[i].name);
                        }

                        _this.renderColumnContainer();
                        _this.fillBackground();

                        _this.options.removed({
                            added: [],
                            removed: allItemArr,
                            items: []
                        });
                    } else {
                        for (var i in data) {
                            let inArray = $.inArray(data[i].name, _this.options.selectedItems);
                            if (inArray > -1) {
                                _this.options.changedItems[data[i].name] = 'unselect';
                                _this.options.selectedItems.splice(inArray, 1);
                            }

                            if (_this.options.multiple) {
                                _this.options.removed({
                                    added: [],
                                    removed: [data[i].name],
                                    items: _this.options.selectedItems
                                });
                            }
                        }
                        _this.refreshColumns();
                    }
                }
                if (event === 'select') {
                    if (_this.isSameType(data)) return;
                    let inArray = $.inArray(data.name, _this.options.selectedItems);
                    if (inArray < 0) {
                        _this.options.changedItems[data.name] = 'select';
                        _this.options.selectedItems.push(data.name);
                    }

                    if (_this.options.multiple) {
                        _this.options.added({
                            added: [data.name],
                            removed: [],
                            items: _this.options.selectedItems
                        });
                    } else {
                        _this.options.selectedItems = [data.name];
                    }
                    _this.refreshColumns();
                }
                if (event === 'unselect') {
                    let inArray = $.inArray(data.name, _this.options.selectedItems);
                    if (inArray > -1) {
                        _this.options.changedItems[data.name] = 'unselect';
                        _this.options.selectedItems.splice(inArray, 1);
                    }
                    _this.refreshColumns();

                    if (_this.options.multiple) {
                        _this.options.removed({
                            added: [],
                            removed: [data.name],
                            items: _this.options.selectedItems
                        });
                    }
                }
                if (event === 'close') {
                    var added = [], removed = [];
                    for (var key in _this.options.changedItems) {
                        if (_this.options.changedItems[key] === 'select') {
                            added.push(key);
                        } else {
                            removed.push(key);
                        }
                    }
                    if (added.length > 0 || removed.length > 0) {
                        _this.options.changed('change', {
                            added: added,
                            removed: removed,
                            items: _this.options.selectedItems
                        });
                    }
                    _this.options.changedItems = {};

                    _this.showColumnSelector = false;
                    _this.$mainControl.removeClass('brtc-va-editors-sheet-controls-columnselector-hover');
                    var $removeButtons = _this.$mainControl.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-remove');
                    $removeButtons.css({'background-color': 'white'});
                }
            }
        });
    };

    ColumnList.prototype.createTypeLabel = function (columnName) {
        var type = '';
        $.each(this.options.items, function (index, column) {
            if (column.name === columnName) {
                type = column.type;
                return false;
            }
        });
        return type;
    };

    ColumnList.prototype.getInternalType = function (columnName) {
        for (var i in this.options.items) {
            if (this.options.items[i].name === columnName) {
                return (this.options.items[i].internalType) ? this.options.items[i].internalType : this.options.items[i].type;
            }
        }
    };

    ColumnList.prototype.createColumnUnit = function (columnName) {
        var _this = this;
        var typeLabel = this.createTypeLabel(columnName);
        var internalType = this.getInternalType(columnName);

        var $composite = $('<div class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element brtc-style-relative" />');
        // $composite.css({'height': this.options.height});

        this.$type = $('<span class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element-type" internal-type="' + internalType + '" data-type="' + (typeLabel? typeLabel : undefined) + '" >' + typeLabel + '</span>');
        this.$type.text(Brightics.VA.Core.Utils.CommonUtils.convertDataTypeForText(typeLabel, internalType));
        this.$type.attr('title', Brightics.VA.Core.Utils.CommonUtils.convertDataTypeForTitle(typeLabel, internalType));

        this.$name = $('<span class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element-name" >' + columnName + '</span>').text(columnName);

        this.$remove = $('<span class="brtc-va-editors-sheet-controls-columnselector-columncontainer-element-remove"></span>');
        $composite.append(this.$type).append(this.$name).append(this.$remove);
        $composite.attr('value', columnName);
        $composite.attr('title', columnName);

        $composite.mouseover(function (event) {
            if (_this.options.removable) $(this).find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-remove').css({'display': 'block'});
            if (_this.options.multiple && $composite.attr('value')) {
                $composite.addClass('brtc-va-editors-sheet-controls-columnselector-columncontainer-element-hover');
            }
        });

        $composite.mouseout(function (event) {
            $(this).find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-remove').css({'display': 'none'});

            $composite.removeClass('brtc-va-editors-sheet-controls-columnselector-columncontainer-element-hover');
        });
        $composite.on('click', function (event) {
            _this.openColumnSelector(this);
        });

        this.$remove.click(function (event) {
            var $container = $(this).closest('.brtc-va-editors-sheet-controls-columnlist-columncontainer');

            var removeButtons = $container.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-remove'),
                $focusTarget = undefined;

            for (var i=0; i<removeButtons.length; i++) {
                if (this == removeButtons[i]) {
                    if (removeButtons[i+1]) $focusTarget = $(removeButtons[i+1]);
                    break;
                }
            }

            var unSelectColumnName = $(this).prevAll('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-name').text();
            for (var i in _this.options.selectedItems) {
                if (_this.options.selectedItems[i] === unSelectColumnName) {
                    _this.options.selectedItems.splice(i, 1);
                    break;
                }
            }
            _this.refreshColumns();
            _this.options.changed('removed', {
                added: [],
                removed: [unSelectColumnName],
                items: _this.options.selectedItems
            });

            _this.options.removed({
                added: [],
                removed: [unSelectColumnName],
                items: _this.options.selectedItems
            });
            _this.options.removed({
                added: [],
                removed: [unSelectColumnName],
                items: _this.options.selectedItems
            });

            if ($focusTarget) $focusTarget.mouseover();
            event.stopPropagation();
        });

        return $composite;
    };

    ColumnList.prototype.checkWidth = function ($target) {
        var text = $target.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-name').text();
        var res = {
            isTextOverflown: false,
            width: 0
        };

        var cont = $('<div>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(text) + '</div>').css("display", "table")
            .css("z-index", "-1").css("position", "absolute")
            .css("font-family", $target.css("font-family"))
            .css("font-size", $target.css("font-size"))
            .css("font-weight", $target.css("font-weight")).appendTo('body');
        res.isTextOverflown = (cont.width() > $target.width());
        res.width = cont.width();

        cont.remove();
        return res;
    };

    ColumnList.prototype.refreshColumns = function () {
        this.renderColumnContainer();
        this.fillBackground();
    };

    ColumnList.prototype.setSelectedItems = function (items) {
        if (!items) return;
        this.options.selectedItems = [];
        this.options.renderedItems = {};

        var temp = $.extend(true, [], $.grep(items, function (column) {
            return column;
        }));
        if (this.options.multiple) {
            this.options.selectedItems = temp;
        } else if (temp.length > 0) {
            this.options.selectedItems = [temp[0]];
        }

        this.renderColumnContainer();
    };

    ColumnList.prototype.getSelectedItems = function () {
        return this.options.selectedItems.length > 0 ? $.extend(true, [], this.options.selectedItems) : [];
    };

    ColumnList.prototype.getSelectedItemsWithType = function () {
        var rtItems = [];

        for (var i in this.options.selectedItems) {
            for (var j in this.options.items) {
                if (this.options.selectedItems[i] === this.options.items[j].name) {
                    rtItems.push(this.options.items[j]);
                }
            }
        }
        return rtItems;
    };

    ColumnList.prototype.setItems = function (columns) {
        if(this._isDestroyed()) return;
        columns = columns || [];
        this.options.items = columns;
        this.columnSelector.setSource(columns);
    };

    ColumnList.prototype._isDestroyed = function () {
        return !this.$mainControl.closest('body').length;
    };

    ColumnList.prototype.onChange = function (callback) {
        this.options.changed = callback;
    };

    // ColumnList.prototype.getSelectorPosition = function () {
    //     var position = {
    //         left: '',
    //         top: ''
    //     };
    //
    //     var browserWidth = document.all ? document.body.clientWidth : window.innerWidth,
    //         browserHeight = document.all ? document.body.clientHeight : window.innerHeight,
    //         columnSelectorHeight = this.columnSelector.getHeight(),
    //         columnSelectorWidth = this.columnSelector.getWidth();
    //
    //     if (this.options.openerPosition === 'right') {
    //         position.left = this.$mainControl.offset().left + this.$mainControl.width() + 5;
    //         position.top = this.$mainControl.offset().top;
    //     }
    //     if (this.options.openerPosition === 'bottom') {
    //         position.left = this.$mainControl.offset().left;
    //         position.top = this.$mainControl.offset().top + this.$mainControl.height() + 5;
    //     }
    //
    //     if (this.options.openerPosition === 'left') {
    //         position.left = this.$mainControl.offset().left - columnSelectorWidth - 5;
    //         position.top = this.$mainControl.offset().top;
    //     }
    //
    //     if (browserHeight - columnSelectorHeight - 10 < position.top) {
    //         position.top = browserHeight - columnSelectorHeight - 10;
    //     }
    //     if (browserWidth - columnSelectorWidth - 10 < position.left) {
    //         position.left = browserWidth - columnSelectorWidth - 10;
    //     }
    //     return position;
    // };

    ColumnList.prototype.closeSelector = function () {
        this.columnSelector.close();

    };

    ColumnList.prototype.openColumnSelector = function (button) {
        if (this.options.showOpener !== 'none') {
            this.columnSelector.open(button, this.options.selectedItems);
            this.showColumnSelector = true;
            this.fillBackground();
        }
    };

    ColumnList.prototype.fillBackground = function () {
        var $removeButtons = this.$mainControl.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-remove');
        if (this.showColumnSelector) {
            this.$mainControl.addClass('brtc-va-editors-sheet-controls-columnselector-hover');
            $removeButtons.css({'background-color': '#D3F0E0'});
        } else {
            this.$mainControl.removeClass('brtc-va-editors-sheet-controls-columnselector-hover');
            $removeButtons.css({'background-color': 'white'});
        }
    };

    ColumnList.prototype.isSameType = function (data) {
        if (this.options.isOneType) {
            if (this.options.rowCount === 1) {
                if (this.options.selectedItems.length > 0) {
                    Brightics.VA.Core.Utils.WidgetUtils.openWarningDialog('You can only select one column.');
                    this.columnSelector.close();
                    return true;
                }
            } else {
                var types = [];
                if (this.options.selectedItems.length > 0) {
                    for (var i in this.options.selectedItems) {
                        for (var j in this.options.items) {
                            if (this.options.selectedItems[i] === this.options.items[j].name) {
                                if ($.inArray(this.options.items[j].type, types) == -1) types.push(this.options.items[j].type);
                                break;
                            }
                        }
                    }
                } else {
                    types.push(data.type);
                }
                if (types.length > 0 && $.inArray(data.type, types) == -1) {
                    Brightics.VA.Core.Utils.WidgetUtils.openWarningDialog('You can only select columns of the same type.');
                    this.columnSelector.close();
                    return true;
                }
            }
        }
        return false;
    };

    Brightics.VA.Core.Editors.Sheet.Controls.ColumnList = ColumnList;

}).call(this);
