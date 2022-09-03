(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var BaseControl = Brightics.Chart.Adonis.Component.Controls.BaseControl;

    function OrderByControl(parentId, options, headerKey) {
        BaseControl.call(this, parentId, options, headerKey);
    }

    OrderByControl.prototype = Object.create(BaseControl.prototype);
    OrderByControl.prototype.constructor = OrderByControl;

    OrderByControl.prototype._init = function () {
        BaseControl.prototype._init.call(this);
        this.titleOption = this.options.chartOption.title;
    };

    OrderByControl.prototype._createContents = function ($parent) {
        BaseControl.prototype._createContents.call(this, $parent);

        var headerOption = {
            label: 'Order By'
        };
        this.createComponentHeader(headerOption);
        this.createComponentContents();

        this._renderOrderByControls();
    };

    OrderByControl.prototype.createComponentContents = function (contentsOption) {
        BaseControl.prototype.createComponentContents.call(this, contentsOption);
        this.createOrderByWidget();
        this.createNewSortRuleControl();
    };

    OrderByControl.prototype.createOrderByWidget = function () {
        var _this = this;

        this.$orderByContent = $('' +
            '<div class="bos-display-flex bos-flex-direction-column brtc-mc-orderby-property">' +
            '   <div class="bo-widget-width bos-display-flex-center bos-flex-direction-column brtc-va-editors-sheet-controls-propertycontrol-row-container"></div>' +
            '   <div class="bo-widget-height-validation"></div>' +
            '</div>');

        this.$rowContainer = this.$orderByContent.find('.brtc-va-editors-sheet-controls-propertycontrol-row-container');

        this.$controlContents.append(this.$orderByContent);

        this.$rowContainer.sortable({
            axis: 'y',
            handle: '.brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper',
            update: function (event, ui) {
                _this.updateIndexNumber();
                if(typeof _this.options.propOpt.orderChanged === 'function') {
                    var $item = $(ui.item[0]);
                    var column = $item.attr('column');
                    var index = _this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row').index($item);
                    var changedInfo = {
                        column: column,
                        index: index
                    };
                    _this.options.propOpt.orderChanged(changedInfo);
                    _this.updateOrderByOption(changedInfo);
                }
                // TODO: Update 시 sort index 및 order 변경 로직
            }
        });
    };

    OrderByControl.prototype.createNewSortRuleControl = function (column, sortMode) {
        var _this = this;
        column = (column) ? (column) : ('');
        sortMode = (sortMode) ? (sortMode) : ('ASC');
        var $newRow = $('' +
            '<div class="brtc-va-editors-sheet-controls-propertycontrol-row">' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper">' +
            '      <div class="brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element"></div>' +
            '      <div class="brtc-va-editors-sheet-controls-propertycontrol-number"></div>' +
            '   </div>' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"></div>' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-button brtc-va-editors-sheet-controls-propertycontrol-sort-mode-button"><i class="fa fa-sort"></i></div>' +
            '</div>');
        this.$rowContainer.append($newRow);

        $newRow.attr('column', column);
        $newRow.attr('type', this.getColumnType(column));
        $newRow.attr('sort-mode', sortMode);
        $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-button').attr('title', sortMode);

        // Position Index
        var $indexColumn = $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-number');
        var position = this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row').length;
        $indexColumn.text(position + '');
        $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper').attr('title', position + '');

        // ColumnList
        var $columnsComboBox = $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-combobox');
        var widgetOptions = {
            rowCount: 1,
            multiple: false,
            showOpener: 'none',
            removable: false
        };
        var columnList = this.createColumnList($columnsComboBox, widgetOptions, 'brtc-va-editors-sheet-controls-width-6', {
            "flex-grow": 1,
            height: '25px'
        });

        columnList.onChange(function (event, data) {
            $newRow.attr('column', data.items[0]);
            $newRow.attr('type', _this.getColumnType(data.items[0]));
            _this.updateSortModeIcon($toggleButton, $newRow.attr('sort-mode'), _this.getColumnType(data.items[0]));
        });
        columnList.setItems(this.options.datasource.columns);
        columnList.setSelectedItems((column) ? ([column]) : ([]));
        $newRow.data('columnList', columnList);
        columnList.columnSelector.$mainControl.dialog('close');
        columnList.columnSelector.$mainControl.dialog('destroy');
        columnList.columnSelector.$mainControl.remove();

        // Toggle Button
        var $toggleButton = $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-button');
        $toggleButton.on('click', function () {
            var $targetRow = $(this).parents('.brtc-va-editors-sheet-controls-propertycontrol-row');
            var changeSortMode = ($targetRow.attr('sort-mode') === 'ASC') ? ('DESC') : ('ASC');
            $targetRow.attr('sort-mode', changeSortMode);
            $(this).attr('title', changeSortMode);
            _this.updateSortModeIcon($toggleButton, $targetRow.attr('sort-mode'), _this.getColumnType($targetRow.attr('column')));
            _this.options.propOpt.orderBy.sortMode[$targetRow.attr('column')] = changeSortMode;
        });

        this.updateSortModeIcon($toggleButton, sortMode, this.getColumnType(column));

        // Insert Order Info
        if (column) {
            this.options.propOpt.orderBy.sortMode[column] = 'ASC';
        }
    };

    OrderByControl.prototype.updateSortModeIcon = function ($sortButton, sortMode, columnType) {
        $sortButton.find('i').removeClass();
        var className;
        if (columnType === 'string') {
            className = 'fa fa-sort-alpha-' + sortMode.toLowerCase();
            $sortButton.find('i').addClass(className);
        }
        else if (columnType === 'number' || columnType === 'date') {
            className = 'fa fa-sort-numeric-' + sortMode.toLowerCase();
            $sortButton.find('i').addClass(className);
        }
        else {
            className = 'fa fa-sort';
            $sortButton.find('i').addClass(className);
        }
    };

    OrderByControl.prototype.updateOrderByOption = function (changedInfo) {
        var column = changedInfo.column;
        var index = changedInfo.index;

        var currIndex = this.options.propOpt.orderBy.columns.indexOf(column);

        this.options.propOpt.orderBy.columns.splice(currIndex, 1);
        this.options.propOpt.orderBy.columns.splice(index, 0, column);
    };

    OrderByControl.prototype.updateIndexNumber = function () {
        var $target = this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row');
        $target.each(function (index, element) {
            var indexNum = (Number(index) + 1) + '';
            $(element).find('.brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper').attr('title', indexNum);
            $(element).find('.brtc-va-editors-sheet-controls-propertycontrol-number').text(indexNum);
        });
    };

    OrderByControl.prototype.columnChanged = function (columns) {
        var removeColumnList = [];
        var addColumnList = [];

        this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row[column=""]').remove();

        for (var i in this.options.propOpt.orderBy.columns) {
            if(columns.indexOf(this.options.propOpt.orderBy.columns[i]) === -1) {
                removeColumnList.push(this.options.propOpt.orderBy.columns[i]);
                this.options.propOpt.orderBy.columns.splice(i, 1);
            }
        }

        for (var i in columns) {
            if(this.options.propOpt.orderBy.columns.indexOf(columns[i]) === -1) {
                this.options.propOpt.orderBy.columns.push(columns[i]);
                addColumnList.push(columns[i]);
            }
        }

        if(removeColumnList.length > 0) {
            for(const removeColumn of removeColumnList) {
                this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row[column="' + removeColumn + '"]').remove();
                delete this.options.propOpt.orderBy.sortMode[removeColumn];
            }
        }

        if(addColumnList.length > 0) {
            for(const addColumn of addColumnList) {
                this.createNewSortRuleControl(addColumn);
            }
        }

        if(columns.length === 0) {
            this.options.propOpt.orderBy = {
                columns: [],
                sortMode: {}
            };
            this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row').remove();
            this.createNewSortRuleControl();
        }

        this.updateIndexNumber();
    };

    OrderByControl.prototype.getColumnType = function (column) {
        for (var i in this.options.datasource.columns) {
            if (this.options.datasource.columns[i].name === column) return this.options.datasource.columns[i].type;
        }
    };

    OrderByControl.prototype.createColumnList = function ($control, widgetOptions, className, additionalCss) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);

        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        $control.parent().addClass(additionalClass);
        if(additionalCss) $control.parent().css(additionalCss);

        var options = {
            multiple: true,
            rowCount: 1,
            maxRowCount: 5,
            expand: false,
            sort: 'none',
            sortBy: 'name',
            showOpener: 'none',
            removable: true,
            defaultType: '-',
            changed: function (type, data) {

            },
            added: function () {

            },
            removed: function () {

            }
        };

        if (widgetOptions) {
            $.extend(options, widgetOptions);
        }

        return new Brightics.VA.Core.Editors.Sheet.Controls.ColumnList($control, options);
    };

    OrderByControl.prototype._renderOrderByControls = function () {
        if(this.options.propOpt.orderBy.columns.length > 0) this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row[column=""]').remove();
        for (var i in this.options.propOpt.orderBy.columns) {
            var column = this.options.propOpt.orderBy.columns[i];
            this.createNewSortRuleControl(column, this.options.propOpt.orderBy.sortMode[column]);
        }
    };

    Brightics.Chart.Adonis.Component.Controls.OrderByControl = OrderByControl;
}).call(this);