(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.sortPython = {
        "category": "manipulation",
        "defaultFnUnit": {
            "func": "sortPython",
            "name": "brightics.function.manipulation$sort",
            "label": {
                "en": "Sort", 
                "ko": "정렬"
            },
            "context": "python",
            "version": "3.6",
            "param": {
                "input_cols": [],
                "is_asc": [],
                "group_by": []
            },
            "inputs": {
                "table": ""
            },
            "outputs": {
                "out_table": ""
            },
            "meta": {
                "table": {
                    "type": "table"
                },
                "out_table": {
                    "type": "table"
                }
            },
            "display": {
                "label": "Sort",
                "diagram": {
                    "position": {
                        "x": 20,
                        "y": 10
                    }
                },
                "sheet": {
                    "in": {
                        "partial": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ],
                        "full": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ]
                    },
                    "out": {
                        "partial": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ],
                        "full": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ]
                    }
                }
            },
        },
        "mandatory": [
            "input_cols",
            "is_asc"
        ],
        "description": {
            "en": "Arrange items in sequence or in sets.",
            "ko": "데이터를 특정 순서 또는 세트로 정렬합니다."
        },
        "tags": {
            "en": [
                "input_cols",
                "is_asc"
            ],
            "ko": [
                "input_cols",
                "is_asc"
            ]
        },
        "in-range": {
            "min": 1,
            "max": 1
        },
        "out-range": {
            "min": 1,
            "max": 1
        }
    };

}).call(this);
/**************************************************************************
 *                           Properties Panel
 *************************************************************************/
/**
 * Created by daewon77.park on 2016-02-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var PARAM_COLUMNS = "input_cols",
        PARAM_SORT_MODE = "is_asc",
        PARAM_GROUP_BY = "group_by";

    var CONTROL_COLUMN = 'column',
        CONTROL_TYPE = 'type',
        CONTROL_SORT_MODE = 'sort-mode';

    var _super = Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype;

    function PythonSortProperties(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    PythonSortProperties.prototype = Object.create(_super);
    PythonSortProperties.prototype.constructor = PythonSortProperties;

    PythonSortProperties.prototype.createControls = function () {
        _super.createControls.call(this);
        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    PythonSortProperties.prototype.createContentsAreaControls = function ($parent) {
        _super.createContentsAreaControls.call(this, $parent);

        this.selectedItems = [];
        this.changedItems = {};

        this.render = {
            [PARAM_COLUMNS]: this.renderSortRule,
            [PARAM_SORT_MODE]: this.renderSortRule,
            [PARAM_GROUP_BY]: this.renderGroupBy
        };
        this.createColumnSelector();
        this.createSortRuleControl();
        this.createGroupByControl();
    };

    PythonSortProperties.prototype.renderValues = function (command) {
        this.renderSortRule();
        this.renderGroupBy();
    };

    PythonSortProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param === PARAM_COLUMNS) {
                this.createValidationContent(this.$newRowButtonArea, this.problems[i]);
            }
            if (this.problems[i].param === PARAM_GROUP_BY) {
                this.createValidationContent(this.$groupbys.parent(), this.problems[i]);
            }
        }
    };

    PythonSortProperties.prototype.createSortRuleControl = function () {
        var _this = this;

        this.$sortRuleControl = $('' +
            '<div class="brtc-va-selectbutton-container">' +
            '   <button class="brtc-va-editors-sheet-controls-propertycontrol-columnlist-selectbutton">Select Columns</button>' +
            '</div>' +
            '<div class = "brtc-va-editors-sheet-controls-propertycontrol-sort-rule-control">' +
            '   <div class = "brtc-va-editors-sheet-controls-propertycontrol-row-container"></div>' +
            '   <div class = "brtc-va-editors-sheet-controls-propertycontrol-new-row-button-area"></div>' +
            '</div>');

        this.$selectButton = this.$sortRuleControl.find('.brtc-va-editors-sheet-controls-propertycontrol-columnlist-selectbutton');
        this.$selectButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            height: '25px'
        });
        this.$selectButton.on('click', function () {
            _this.columnSelector.open(this, _this.selectedItems);
        });

        this.$rowContainer = this.$sortRuleControl.find('.brtc-va-editors-sheet-controls-propertycontrol-row-container');
        this.$newRowButtonArea = this.$sortRuleControl.find('.brtc-va-editors-sheet-controls-propertycontrol-new-row-button-area');
        this.addPropertyControl('Sort Rule', function ($parent) {
            $parent.addClass('brtc-va-editors-sheet-controls-propertycontrol-deck');
            $parent.addClass('brtc-va-sort-property');
            $parent.append(_this.$sortRuleControl);

            _this.$rowContainer.sortable({
                axis: 'y',
                handle: '.brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper',
                update: function (event, ui) {
                    _this.executeSortRuleCommand();
                    _this.updateIndexNumber();
                }
            });
            _this.createNewSortRuleButton();
        }, {mandatory: true});
    };

    PythonSortProperties.prototype.createColumnSelector = function (button) {
        var _this = this;

        this.columnSelector = new Brightics.VA.Core.Editors.Sheet.Controls.ColumnSelector(this.$mainControl, {
            columnList: this,
            multiple: true,
            changed: function (event, data) {
                if (event === 'selectAll') {
                    _this.selectedItems = [];
                    _this.$rowContainer.empty();
                    for (var i in data) {
                        let inArray = $.inArray(data[i].name, _this.selectedItems);
                        if (inArray < 0) _this.changedItems[data[i].name] = 'select';
                        _this.createNewSortRuleControl(data[i].name, 'ASC');
                        _this.selectedItems.push(data[i].name);
                    }
                }
                if (event === 'unselectAll') {
                    for (var i in data) {
                        let inArray = $.inArray(data[i].name, _this.selectedItems);
                        if (inArray > -1) _this.changedItems[data[i].name] = 'unselect';
                    }
                    _this.selectedItems = [];
                    _this.$rowContainer.empty();
                }
                if (event === 'select') {
                    let inArray = $.inArray(data.name, _this.selectedItems);
                    if (inArray < 0) _this.changedItems[data.name] = 'select';
                    _this.createNewSortRuleControl(data.name, 'ASC');
                    _this.selectedItems.push(data.name);
                }
                if (event === 'unselect') {
                    let inArray = $.inArray(data.name, _this.selectedItems);
                    if (inArray > -1) _this.changedItems[data.name] = 'unselect';
                    var $targetRows = _this.$sortRuleControl.find('.brtc-va-editors-sheet-controls-propertycontrol-row');

                    for (var i in $targetRows) {
                        if ($($targetRows[i]).attr('column') === data.name) {
                            $targetRows[i].remove();
                            break;
                        }
                    }

                    for (var j in _this.selectedItems) {
                        if (_this.selectedItems[j] === data.name) {
                            _this.selectedItems.splice(j, 1);
                            break;
                        }
                    }
                }
                if (event === 'close') {
                    if (Object.keys(_this.changedItems).length > 0) {
                        _this.executeSortRuleCommand();
                        _this.updateIndexNumber();
                    }
                    _this.changedItems = {};
                }
            }
        });
    };

    PythonSortProperties.prototype.createNewSortRuleButton = function () {
        var _this = this;
        var $newRowButton = $('' +
            '<div class="brtc-va-editors-sheet-controls-propertycontrol-row brtc-va-editors-sheet-controls-propertycontrol-new-row-button">' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"></div>' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-button brtc-va-editors-sheet-controls-new-row-toggle-button"><i class="fa fa-sort"></i></div>' +
            '</div>');
        this.$newRowButtonArea.append($newRowButton);

        // ColumnList
        var $columnsComboBox = $newRowButton.find('.brtc-va-editors-sheet-controls-propertycontrol-combobox');
        var widgetOptions = {
            rowCount: 1,
            multiple: false,
            showOpener: 'click',
            removable: false
        };
        this.newRowColumnList = this.createColumnList($columnsComboBox, widgetOptions, 'brtc-va-editors-sheet-controls-width-6', {
            width: '70%',
            height: '25px',
            'padding-left': '4px',
            'margin-left': '13px'
        });
        this.newRowColumnList.onChange(function (event, data) {
            _this.createNewSortRuleControl(data.items[0], 'ASC');
            _this.selectedItems.push(data.items[0]);
            _this.executeSortRuleCommand();
            _this.newRowColumnList.setSelectedItems([]);
            _this.updateIndexNumber();
        });
    };

    PythonSortProperties.prototype.createNewSortRuleControl = function (column, sortMode) {
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
            '   <div class="brtc-va-editors-sheet-controls-sort-rule-remove-button"></div>' +
            '</div>');
        this.$rowContainer.append($newRow);

        $newRow.attr(CONTROL_COLUMN, column);
        $newRow.attr(CONTROL_TYPE, this.getColumnType(column));
        $newRow.attr(CONTROL_SORT_MODE, sortMode);
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
            showOpener: 'click',
            removable: false
        };
        var columnList = this.createColumnList($columnsComboBox, widgetOptions, 'brtc-va-editors-sheet-controls-width-6', {
            width: '70%',
            height: '25px'
        });
        // var columnList = this.newRowColumnList;
        columnList.onChange(function (event, data) {
            $newRow.attr(CONTROL_COLUMN, data.items[0]);
            $newRow.attr(CONTROL_TYPE, _this.getColumnType(data.items[0]));
            _this.updateSortModeIcon($toggleButton, $newRow.attr(CONTROL_SORT_MODE), _this.getColumnType(data.items[0]));
            _this.executeSortRuleCommand();
        });
        columnList.setItems(this.columnData);
        columnList.setSelectedItems((column) ? ([column]) : ([]));
        $newRow.data('columnList', columnList);

        // Toggle Button
        var $toggleButton = $newRow.find('.brtc-va-editors-sheet-controls-propertycontrol-button');
        $toggleButton.on('click', function () {
            var $targetRow = $(this).parents('.brtc-va-editors-sheet-controls-propertycontrol-row');
            var changeSortMode = ($targetRow.attr(CONTROL_SORT_MODE) === 'ASC') ? ('DESC') : ('ASC');
            $targetRow.attr(CONTROL_SORT_MODE, changeSortMode);
            $(this).attr('title', changeSortMode);
            _this.updateSortModeIcon($toggleButton, $targetRow.attr(CONTROL_SORT_MODE), _this.getColumnType($targetRow.attr(CONTROL_COLUMN)));
            _this.executeSortRuleCommand();
        });

        // Remove Button
        var $removeButton = $newRow.find('.brtc-va-editors-sheet-controls-sort-rule-remove-button');
        $removeButton.click(function (event) {
            var $targetRow = $(this).parents('.brtc-va-editors-sheet-controls-propertycontrol-row');
            $targetRow.remove();

            for (var j in _this.selectedItems) {
                if (_this.selectedItems[j] === $targetRow.attr('column')) {
                    _this.selectedItems.splice(j, 1);
                    break;
                }
            }

            _this.executeSortRuleCommand();
            _this.updateIndexNumber();
        });

        this.updateSortModeIcon($toggleButton, sortMode, this.getColumnType(column));
    };

    PythonSortProperties.prototype.fillControlValues = function () {
        this.columnData = this.getColumnsOfInTable(0, ["number", "string"]);
        this.columnSelector.setSource(this.columnData);
        this.newRowColumnList.setItems(this.columnData);
        this.groupbyControl.setItems(this.columnData);
    };

    PythonSortProperties.prototype.renderSortRule = function () {
        var paramColumns = this.options.fnUnit.param[PARAM_COLUMNS];
        var paramSortMode = this.options.fnUnit.param[PARAM_SORT_MODE];

        if (paramSortMode.length && paramColumns.length) {
            var $parent = this.$rowContainer;
            var $rows = $parent.find('.brtc-va-editors-sheet-controls-propertycontrol-row');
            var rowLength = $rows.length;

            var target, columnList, sortModeButton, sortMode;
            var i, j;
            if (rowLength < paramColumns.length) {
                for (i = 0; i < rowLength; i++) {
                    sortMode = (paramSortMode[i]) ? 'ASC' : 'DESC';
                    target = $rows[i];

                    columnList = $(target).data('columnList');
                    if(typeof columnList === 'undefined') continue;
                    columnList.setItems(this.columnData);
                    columnList.setSelectedItems([paramColumns[i]]);

                    $(target).attr(CONTROL_COLUMN, paramColumns[i]);
                    $(target).attr(CONTROL_TYPE, this.getColumnType(paramColumns[i]));
                    $(target).attr(CONTROL_SORT_MODE, sortMode);
                    sortModeButton = $(target).find('.brtc-va-editors-sheet-controls-propertycontrol-button');
                    sortModeButton.attr('title', sortMode);
                    this.updateSortModeIcon(sortModeButton, sortMode, this.getColumnType(paramColumns[i]));
                }

                for (j = rowLength; j < paramColumns.length; j++) {
                    sortMode = (paramSortMode[j]) ? 'ASC' : 'DESC';
                    this.createNewSortRuleControl(paramColumns[j], sortMode);
                }
                this.selectedItems = paramColumns;
            }
            else {
                for (i = 0; i < paramColumns.length; i++) {
                    sortMode = (paramSortMode[i]) ? 'ASC' : 'DESC';
                    target = $rows[i];

                    columnList = $(target).data('columnList');
                    if(typeof columnList === 'undefined') continue;
                    columnList.setItems(this.columnData);
                    columnList.setSelectedItems([paramColumns[i]]);

                    $(target).attr(CONTROL_COLUMN, paramColumns[i]);
                    $(target).attr(CONTROL_TYPE, this.getColumnType(paramColumns[i]));
                    $(target).attr(CONTROL_SORT_MODE, sortMode);
                    sortModeButton = $(target).find('.brtc-va-editors-sheet-controls-propertycontrol-button');
                    sortModeButton.attr('title', sortMode);
                    this.updateSortModeIcon(sortModeButton, sortMode, this.getColumnType(paramColumns[i]));
                }

                for (j = paramColumns.length; j < rowLength; j++) {
                    target = $rows[j];
                    target.remove();
                }
            }
        } else {
            this.$rowContainer.empty();
        }

        this.updateIndexNumber();
    };

    PythonSortProperties.prototype.renderGroupBy = function () {
        var paramGroupBy = this.options.fnUnit.param[PARAM_GROUP_BY];
        this.groupbyControl.setSelectedItems(paramGroupBy);
    };

    PythonSortProperties.prototype.createGroupByControl = function () {
        var _this = this;
        this.$groupbys = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-groupbylist"/>');

        this.addPropertyControl('Group By', function ($parent) {
            $parent.append(_this.$groupbys);
            var widgetOptions = {
                rowCount: 3,
                multiple: true
            };
            _this.groupbyControl = _this.createColumnList(_this.$groupbys, widgetOptions);
            _this.groupbyControl.onChange(function () {
                _this.executeGroupByCommand();
            });
        });
    };

    PythonSortProperties.prototype.executeGroupByCommand = function () {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        commandOption.ref.param[PARAM_GROUP_BY] = [];
        var selectedGroupBy = this.groupbyControl.getSelectedItems();
        if (selectedGroupBy) {
            commandOption.ref.param[PARAM_GROUP_BY] = selectedGroupBy;
        }

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        this.executeCommand(command);
    };

    PythonSortProperties.prototype.executeSortRuleCommand = function () {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        commandOption.ref.param[PARAM_COLUMNS] = [];
        commandOption.ref.param[PARAM_SORT_MODE] = [];

        this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row').each(function (index, row) {
            commandOption.ref.param[PARAM_COLUMNS].push($(this).attr(CONTROL_COLUMN));
            var isAsc = ($(this).attr(CONTROL_SORT_MODE) == 'ASC') ? true : false;
            commandOption.ref.param[PARAM_SORT_MODE].push(isAsc);
        });

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        this.executeCommand(command);
    };

    PythonSortProperties.prototype.updateIndexNumber = function () {
        var $target = this.$rowContainer.find('.brtc-va-editors-sheet-controls-propertycontrol-row');
        $target.each(function (index, element) {
            var indexNum = (Number(index) + 1) + '';
            $(element).find('.brtc-va-editors-sheet-controls-propertycontrol-hover-drag-element-wrapper').attr('title', indexNum);
            $(element).find('.brtc-va-editors-sheet-controls-propertycontrol-number').text(indexNum);
        });
    };

    PythonSortProperties.prototype.updateSortModeIcon = function ($sortButton, sortMode, columnType) {
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

    PythonSortProperties.prototype.getColumnType = function (column) {
        let _column = this.columnData.find(function (data) {
            return data.name == column
        });

        return _column ? _column.type : '';
        // for (var i in this.columnData) {
        //     if (this.columnData[i].name === column) return this.columnData[i].type;
        // }
    };


    Brightics.VA.Core.Functions.Library.sortPython.propertiesPanel = PythonSortProperties;

}).call(this);
/**************************************************************************
 *                               Validator
 *************************************************************************/
/**
 * Created by ng1123.kim on 2016-03-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Validator.SingleInputValidator.prototype;

    var PARAM_COLUMNS = "input_cols",
        PARAM_GROUP_BY = "group_by";

    function PythonSortValidator() {
        _super.constructor.call(this);
    }

    PythonSortValidator.prototype = Object.create(_super);
    PythonSortValidator.prototype.constructor = PythonSortValidator;

    PythonSortValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);

        this.addColumnsRule();
        this.addGroupByRule();
    };

    PythonSortValidator.prototype.addColumnsRule = function () {
        var _this = this;

        this.addRule(function (fnUnit) {
            return _this.checkColumnIsEmpty(fnUnit, PARAM_COLUMNS, fnUnit.param[PARAM_COLUMNS], 'Sort Rule');
        });
        this.addRule(function (fnUnit) {
            return _this.checkColumnExists(fnUnit, PARAM_COLUMNS, $.unique($.extend(true, [], fnUnit.param[PARAM_COLUMNS])));
        });
    };

    PythonSortValidator.prototype.addGroupByRule = function () {
        var _this = this;

        this.addRule(function (fnUnit) {
            return _this.checkColumnExists(fnUnit, PARAM_GROUP_BY, fnUnit.param[PARAM_GROUP_BY]);
        });
        this.addRule(function (fnUnit) {
            if (!_this._hasSchema(fnUnit)) return;
            var conflicted = _this.getArrayConflicted(fnUnit.param[PARAM_GROUP_BY], fnUnit.param[PARAM_COLUMNS]);
            // return _this.createProblemForConflicted(conflicted, PARAM_GROUP_BY, 'Sort Rule', fnUnit);
            return _this.createProblemForConflicted(conflicted, PARAM_GROUP_BY, 'Group By', 'Columns', fnUnit);
        });
    };

    Brightics.VA.Core.Functions.Library.sortPython.validator = PythonSortValidator;

}).call(this);