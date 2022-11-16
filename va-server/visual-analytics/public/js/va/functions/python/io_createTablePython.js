(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.createTablePython = {
        "category": "io",
        "defaultFnUnit": {
            "func": "createTablePython",
            "name": "brightics.function.io$create_table",
            "label": {
                "en": "Create Table", 
                "ko": "테이블 생성"
            },
            "context": "python",
            "version": "3.6",
            "outputs": {
                "out_table": ""
            },
            "meta": {
                "out_table": {
                    "type": "table"
                }
            },
            "param": {
                "data_array": [
                    []
                ],
                "type_array": [],
                "col_names": []
            },
            "display": {
                "label": "Create Table",
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
            }
        },
        "mandatory": [
            "data_array",
            "type_array",
            "col_names"
        ],
        "description": {
            "en": "This function creates a dataframe with the given input.",
            "ko": "주어진 입력으로 데이터 프레임을 생성합니다."
        },
        "tags": {
            "en": [
                "Create Table",
                "CreateTable",
                "Create",
                "Table"
            ],
            "ko": [
                "테이블 생성",
                "테이블생성",
                "생성",
                "테이블"
            ]
        },
        "in-range": {
            "min": 0,
            "max": 0
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
 * Created by ty_tree.kim on 2017-09-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InputDataFrameProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    InputDataFrameProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    InputDataFrameProperties.prototype.constructor = InputDataFrameProperties;

    InputDataFrameProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        Studio.getInstance().doValidate(this.options.fnUnit.parent());
        this.options.isRendered = true;
        this.renderValues();
    };

    InputDataFrameProperties.prototype.setContentsEditable = function (block) {

    };

    InputDataFrameProperties.prototype.getPrimaryOperation = function () {
        return 'brightics.function.io$create_table';
    };

    InputDataFrameProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.PARAM_COLUMN_NAMES = 'col_names';
        this.PARAM_TYPE_ARRAY = 'type_array';
        this.PARAM_DATA_ARRAY = 'data_array';

        this.COLUMN_TYPE_DOUBLE = 'double';
        this.COLUMN_TYPE_INTEGER = 'int';
        this.COLUMN_TYPE_STRING = 'string';

        this.COLUMN_TYPE_LABEL = {};
        this.COLUMN_TYPE_LABEL[this.COLUMN_TYPE_DOUBLE] = 'Double';
        this.COLUMN_TYPE_LABEL[this.COLUMN_TYPE_INTEGER] = 'Integer';
        this.COLUMN_TYPE_LABEL[this.COLUMN_TYPE_STRING] = 'String';

        this.COLUMNS_SOURCE = [
            {label: this.COLUMN_TYPE_LABEL[this.COLUMN_TYPE_DOUBLE], value: this.COLUMN_TYPE_DOUBLE},
            {label: this.COLUMN_TYPE_LABEL[this.COLUMN_TYPE_INTEGER], value: this.COLUMN_TYPE_INTEGER},
            {label: this.COLUMN_TYPE_LABEL[this.COLUMN_TYPE_STRING], value: this.COLUMN_TYPE_STRING}
        ];

        this.createOpenEditorButton();
        this.createColumnsView();
    };

    InputDataFrameProperties.prototype.renderValues = function (command) {
        this.renderColumnsView();
    };

    InputDataFrameProperties.prototype.createOpenEditorButton = function () {
        var _this = this;

        this.$editorButtonArea = $('<div class="brtc-va-editors-sheet-editor-button-area"/>');
        this.addPropertyControl('Edit', function ($parent) {
            $parent.append(_this.$editorButtonArea);
            var $editorButton = $('<input class="brtc-va-editors-sheet-panels-properties-button" type="button" value="Open Editor"/>');
            _this.$editorButtonArea.append($editorButton);

            $editorButton.jqxButton({
                theme: Brightics.VA.Env.Theme,
                width: '100%',
                height: 25
            });

            $editorButton.click(function (event) {
                new Brightics.VA.Core.Dialogs.InputDataFrameEditorDialog($(event.target), {
                    width: 1400,
                    height: 700,
                    maxWidth: 1400,
                    maxHeight: 700,
                    title: 'Create Table',
                    fnUnit: _this.options.fnUnit,
                    context: 'python',
                    close: function (result) {
                        if (result.OK) {
                            var columnNames = $.extend(true, [], result[_this.PARAM_COLUMN_NAMES]);
                            var dataArray = $.extend(true, [], result[_this.PARAM_DATA_ARRAY]);
                            _this.generateColumnType(columnNames, dataArray);
                            _this.executeCommonCommand(
                                [_this.PARAM_COLUMN_NAMES, _this.PARAM_DATA_ARRAY, _this.PARAM_TYPE_ARRAY],
                                [columnNames, dataArray, _this.typeArray]);
                            _this.renderColumnsView();
                        }
                    }
                });
            });
        });
    };

    InputDataFrameProperties.prototype.createColumnsView = function () {
        var _this = this;
        this.$columns = $('' +
            '<div class="brtc-va-editors-sheet-columns-view brtc-va-editors-sheet-controls-wrapper">' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table">' +
            '       <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-header-area">' +
            '           <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-header">' +
            '               <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-header-column">Name</div>' +
            '               <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-header-column">Type</div>' +
            '           </div>' +
            '       </div>' +
            '       <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-row-area-wrapper">' +
            '           <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-row-area"></div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.addPropertyControl('Columns', function ($parent) {
            $parent.append(_this.$columns);
            _this.$rowAreaScrollbarWrapper = _this.$columns.find('.brtc-va-editors-sheet-controls-propertycontrol-columns-table-row-area-wrapper');
            _this.$rowArea = _this.$columns.find('.brtc-va-editors-sheet-controls-propertycontrol-columns-table-row-area');
            _this.$rowAreaScrollbarWrapper.perfectScrollbar();
        }, {mandatory: true});
    };

    InputDataFrameProperties.prototype._createColumnsRow = function (name, type) {
        var _this = this;
        var $tableRowArea = this.$rowArea;
        var $rowDiv = $('' +
            '<div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-row">' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-column"><input class="brtc-va-editors-sheet-columns-table-input"/></div>' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-columns-table-column"><div class="brtc-va-editors-sheet-columns-table-dropdownlist"></div></div>' +
            '</div>');
        $tableRowArea.append($rowDiv);

        var $input = this.createInput($rowDiv.find('.brtc-va-editors-sheet-columns-table-input'), {
            disabled: true
        });
        var $dropDownList = this.createDropDownList($rowDiv.find('.brtc-va-editors-sheet-columns-table-dropdownlist'), {
            source: this.COLUMNS_SOURCE,
            displayMember: 'label',
            valueMember: 'value'
        });
        $dropDownList.on('change', function (event) {
            if (_this.controlsRendered && event.args.type !== 'none') {
                var index = $(this).parents('.brtc-va-editors-sheet-controls-propertycontrol-columns-table-row').prevAll().length;
                var typeArray = $.extend(true, [], _this.options.fnUnit.param[_this.PARAM_TYPE_ARRAY]);
                typeArray[index] = event.args.item.value;
                _this.executeCommonCommand(_this.PARAM_TYPE_ARRAY, typeArray);
            }
        });

        $input.val(name);
        $dropDownList.val(type);
    };

    InputDataFrameProperties.prototype.executeCommonCommand = function (paramName, param) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };
        if ($.isArray(paramName) && $.isArray(param) && (paramName.length === param.length)) {
            for (var i = 0; i < paramName.length; i++) {
                commandOption.ref.param[paramName[i]] = param[i];
            }
        }
        else {
            commandOption.ref.param[paramName] = param;
        }
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        this.executeCommand(command);
    };

    InputDataFrameProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param === this.PARAM_COLUMN_NAMES) {
                this.createValidationContent(this.$columns, this.problems[i]);
            }
        }
    };

    InputDataFrameProperties.prototype.renderColumnsView = function () {
        var _this = this;
        this.controlsRendered = false;
        var columnNames = this.options.fnUnit.param[this.PARAM_COLUMN_NAMES];
        var typeArray = this.options.fnUnit.param[this.PARAM_TYPE_ARRAY];

        var i;
        for (i = 0; i < columnNames.length; i++) {
            this._renderColumnsRow(i, columnNames[i], typeArray[i]);
        }

        var lastIndex = this.$rowArea.find('.brtc-va-editors-sheet-controls-propertycontrol-columns-table-row').length - 1;
        for (var k = lastIndex; k >= i; k--) {
            var $target = this.$rowArea.find('.brtc-va-editors-sheet-controls-propertycontrol-columns-table-row').eq(k);
            if ($target.length) {
                $target.remove();
            }
        }
        _this.$rowAreaScrollbarWrapper.perfectScrollbar('update');
        this.controlsRendered = true;
    };

    InputDataFrameProperties.prototype._renderColumnsRow = function (index, name, type) {
        if (this.$rowArea.find('.brtc-va-editors-sheet-controls-propertycontrol-columns-table-row').eq(index).length) {
            var $targetRow = this.$rowArea.find('.brtc-va-editors-sheet-controls-propertycontrol-columns-table-row').eq(index);
            var $input = $targetRow.find('.brtc-va-editors-sheet-columns-table-input');
            var $dropDownList = $targetRow.find('.brtc-va-editors-sheet-columns-table-dropdownlist');
            if ($input.val() != name) $input.val(name);
            if ($dropDownList.val() != type) $dropDownList.val(type);
        } else {
            this._createColumnsRow(name, type);
        }
    };

    InputDataFrameProperties.prototype.generateColumnType = function (columnNames, dataArray) {
        var _this = this;
        _this.typeArray = [];

        var columnType = _this.options.fnUnit.param[_this.PARAM_TYPE_ARRAY];
        for (var i in columnNames) {
            if (columnType[i]) {
                _this.typeArray.push(columnType[i]);
            } else {
                var hasDouble = false, hasInt = false, hasString = false;
                for (var row in dataArray) {
                    var data = dataArray[row][i];
                    if (data !== '') {
                        if (/^[0-9.]+$/.test(data) && (data.split('.').length == 2)) {
                            hasDouble = true;
                        } else if (/^[0-9]+$/.test(data)) {
                            hasInt = true;
                        } else {
                            hasString = true;
                            break;
                        }
                    }
                }

                var defaultType = _this.COLUMN_TYPE_STRING;
                if (hasString) _this.typeArray.push(_this.COLUMN_TYPE_STRING);
                else if (hasDouble)  _this.typeArray.push(_this.COLUMN_TYPE_DOUBLE);
                else if (hasInt) _this.typeArray.push(_this.COLUMN_TYPE_INTEGER);
                else _this.typeArray.push(defaultType);
            }
        }
    };

    Brightics.VA.Core.Functions.Library.createTablePython.propertiesPanel = InputDataFrameProperties;

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

    function InputDataFrameValidator() {
        this.PARAM_DATA_ARRAY = 'data_array';
        this.PARAM_TYPE_ARRAY = 'type_array';
        this.PARAM_COLUMN_NAMES = 'col_names';

        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    InputDataFrameValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    InputDataFrameValidator.prototype.constructor = InputDataFrameValidator;

    InputDataFrameValidator.prototype.initRules = function () {
        this.addDataArrayRule();
        this.addTypeArrayRule();
        this.addColumnNamesRule();
    };

    InputDataFrameValidator.prototype.addDataArrayRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {

        });
    };

    InputDataFrameValidator.prototype.addTypeArrayRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {

        });
    };

    InputDataFrameValidator.prototype.addColumnNamesRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var checkInfo = {
                errorCode: 'BR-0033',
                param: this.PARAM_COLUMN_NAMES,
                messageParam: ['Columns']
            };

            if (_this.isEmptyForArray(fnUnit.param[this.PARAM_COLUMN_NAMES])) {
                return _this.problemFactory.createProblem(checkInfo, fnUnit);
            }
        });
    };

    Brightics.VA.Core.Functions.Library.createTablePython.validator = InputDataFrameValidator;

}).call(this);