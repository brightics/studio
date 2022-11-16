(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var BaseControl = Brightics.Chart.Adonis.Component.Controls.BaseControl;

    function MultiChartTitleControl(parentId, options, headerKey) {
        BaseControl.call(this, parentId, options, headerKey);
    }

    MultiChartTitleControl.prototype = Object.create(BaseControl.prototype);
    MultiChartTitleControl.prototype.constructor = MultiChartTitleControl;

    MultiChartTitleControl.prototype._init = function () {
        BaseControl.prototype._init.call(this);
        this.titleOption = this.options.chartOption.title;
        this.columns = $.extend(true, [], this.options.propOpt.orderBy.columns);
    };

    MultiChartTitleControl.prototype._createContents = function ($parent) {
        BaseControl.prototype._createContents.call(this, $parent);

        var headerOption = {
            label: 'Title'
        };
        this.createComponentHeader(headerOption);
        this.createComponentContents();

        this._renderTitleControl();
    };

    MultiChartTitleControl.prototype.createComponentContents = function (contentsOption) {
        BaseControl.prototype.createComponentContents.call(this, contentsOption);
        this.createTitleWidget();
        this.createNewTitleRow();
    };

    MultiChartTitleControl.prototype.createTitleWidget = function () {
        this.$titleContent = $('' +
            '<div class="bos-display-flex bos-flex-direction-column brtc-mc-title-property">' +
            '   <div class="bo-widget-width bos-display-flex-center bos-flex-direction-column brtc-va-editors-sheet-controls-propertycontrol-row-container"></div>' +
            '   <div class="bo-widget-height-validation"></div>' +
            '</div>');

        this.$rowContainer = this.$titleContent.find('.brtc-va-editors-sheet-controls-propertycontrol-row-container');

        this.$controlContents.append(this.$titleContent);
    };

    MultiChartTitleControl.prototype.createNewTitleRow = function (column, checked) {
        var _this = this;
        column = (column) ? (column) : ('');
        var $newRow = $('' +
            '<div class="brtc-va-editors-sheet-controls-propertycontrol-row">' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox" param-value="' + column + '"></div>' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper">' +
            '       <div class="brtc-va-editors-sheet-controls-propertycontrol-number"></div>' +
            '   </div>' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"></div>' +
            '</div>');

        this.$rowContainer.append($newRow);

        $newRow.attr('column', column);
        $newRow.attr('type', this.getColumnType(column));

        // Position Index
        var $indexColumn = $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-number');
        var position = this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row').length;
        $indexColumn.text(position + '');

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
        });
        columnList.setItems(this.options.datasource.columns);
        columnList.setSelectedItems((column) ? ([column]) : ([]));
        $newRow.data('columnList', columnList);
        columnList.columnSelector.$mainControl.dialog('close');
        columnList.columnSelector.$mainControl.dialog('destroy');
        columnList.columnSelector.$mainControl.remove();

        // CheckBox Control
        var $checkBox = $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-checkbox');
        var jqxOptions = {};
        if(checked === false) jqxOptions.checked = false;
        _this.createCheckBox($checkBox, jqxOptions, '');

        $checkBox.on('change', function (event) {
            _this.updateTitleOption();
        });
    };

    MultiChartTitleControl.prototype.createColumnList = function ($control, widgetOptions, className, additionalCss) {
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

    MultiChartTitleControl.prototype.createCheckBox = function ($control, jqxOptions, className, additionalCss) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);

        var additionalClass = 'brtc-va-editors-sheet-controls-checkbox-default';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        $control.parent().addClass(additionalClass);
        if(additionalCss) $control.parent().css(additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            checked: true,

        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxCheckBox(options);
        return $control;
    };

    MultiChartTitleControl.prototype.updateIndexNumber = function () {
        var $target = this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row');
        $target.each(function (index, element) {
            var indexNum = (Number(index) + 1) + '';
            $(element).find('.brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper').attr('title', indexNum);
            $(element).find('.brtc-va-editors-sheet-controls-propertycontrol-number').text(indexNum);
        });
    };

    MultiChartTitleControl.prototype.updateTitleOption = function () {
        var _this = this;

        var values = [];
        $.each(_this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-checkbox'), function (i, val) {
            if ($(val).jqxCheckBox('checked')) values.push($(val).attr('param-value'));
        });
        _this.options.propOpt.title = values;
    };

    MultiChartTitleControl.prototype.columnChanged = function (columns) {
        var removeColumnList = [];
        var addColumnList = [];

        this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row[column=""]').remove();

        for (var i in this.columns) {
            if(columns.indexOf(this.columns[i]) === -1) {
                removeColumnList.push(this.columns[i]);
                this.columns.splice(i, 1);
            }
        }

        for (var i in columns) {
            if(this.columns.indexOf(columns[i]) === -1) {
                this.columns.push(columns[i]);
                addColumnList.push(columns[i]);
            }
        }

        for(const removeColumn of removeColumnList) this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row[column="' + removeColumn + '"]').remove();
        for(const addColumn of addColumnList) this.createNewTitleRow(addColumn);


        if(columns.length === 0) {
            this.columns = [];
            this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row').remove();
            this.createNewTitleRow();
        }

        this.updateIndexNumber();
        this.updateTitleOption();
    };

    MultiChartTitleControl.prototype.orderChanged = function (changedInfo) {
        var column = changedInfo.column;
        var index = changedInfo.index;

        var $columnRow = this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row[column="' + column + '"]').detach();

        var $rows = this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row');
        if(index === 0) {
            $columnRow.insertBefore($rows.eq(0));
        } else {
            $columnRow.insertAfter($rows.eq(index-1));
        }

        this.updateIndexNumber();
        this.updateTitleOption();
    };

    MultiChartTitleControl.prototype.getColumnType = function (column) {
        for (var i in this.options.datasource.columns) {
            if (this.options.datasource.columns[i].name === column) return this.options.datasource.columns[i].type;
        }
    };

    MultiChartTitleControl.prototype._renderTitleControl = function () {
        if(this.options.propOpt.orderBy.columns.length > 0) this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row[column=""]').remove();
        for (var i in this.options.propOpt.orderBy.columns) {
            var checked = true;
            if(this.options.propOpt.title.indexOf(this.options.propOpt.orderBy.columns[i]) === -1) checked = false;
            this.createNewTitleRow(this.options.propOpt.orderBy.columns[i], checked);
        }
    };


    Brightics.Chart.Adonis.Component.Controls.MultiChartTitleControl = MultiChartTitleControl;
}).call(this);