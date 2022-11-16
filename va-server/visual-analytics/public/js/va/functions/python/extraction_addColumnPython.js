(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.addColumnPython = {
        "category": "extraction",
        "defaultFnUnit": {
            "func": "addColumnPython",
            "name": "brightics.function.extraction$add_expression_column",
            "label": {
                "en": "Add Function Column", 
                "ko": "함수열 추가"
            },
            "context": "python",
            "version": "3.6",
            "param": {
                "expr_type": "sqlite",
                "new_cols": [],
                "formulas": []
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
                "label": "Add Function Column",
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
            "expr_type"
        ],
        "description": {
            "en": "This function generates a new column based on a given formula.", 
            "ko": "주어진 수식을 기반으로 새 함수열을 생성합니다."
        },
        "tags": {
            "en": [
            ],
            "ko": [
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

    var PARAM_COL_NM = 'new_cols',
        PARAM_COL_NM_LABEL = 'New Column Name',
        PARAM_EXPR_TYPE = 'expr_type',
        PARAM_EXPR_LABEL = 'Expression Type',
        PARAM_FORMULAS = 'formulas',
        PARAM_FORMULAS_LABEL = 'Expression';

    function PythonAddColumnProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    PythonAddColumnProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    PythonAddColumnProperties.prototype.constructor = PythonAddColumnProperties;

    PythonAddColumnProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    PythonAddColumnProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            [PARAM_COL_NM]: this.renderColumnName,
            [PARAM_EXPR_TYPE]: this.renderExprType,
            [PARAM_FORMULAS]: this.renderExpr
        };

        this.control = {
            [PARAM_COL_NM]: [],
            [PARAM_EXPR_TYPE]: '',
            [PARAM_FORMULAS]: []
        };
        this.$elements = {
            [PARAM_COL_NM]: [],
            [PARAM_EXPR_TYPE]: '',
            [PARAM_FORMULAS]: []
        };
        this.createColumnControl();
        this.createExprTypeControl();
        this.createExprControl();
    };
    PythonAddColumnProperties.prototype.createColumnControl = function () {
        var _this = this;
        this.addPropertyControl(PARAM_COL_NM_LABEL, function ($parent) {
            var $elements = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
            $parent.append($elements);

            var control = this.createInput($elements, {placeHolder: 'Enter value'}, 'brtc-va-editors-sheet-controls-width-12', {'margin': '2px 0'});
            $elements.on('change', function (event) {
                if (_this.renderFlag != true) {
                    var newVal = $(this).val();
                    if (!_this.isInputValueChanged(PARAM_COL_NM, newVal)) return;
                    _this.executeCommonCommand(PARAM_COL_NM, [newVal]);
                }
            });
            control.setValue = function (value) {
                $elements.val(value);
            };
            _this.control[PARAM_COL_NM].push(control);
            _this.$elements[PARAM_COL_NM].push($elements);
        }, {mandatory: true});
    };

    PythonAddColumnProperties.prototype.createExprTypeControl = function () {
        var _this = this;
        var EXPR_TYPE = [
            {label: 'SQLite', value: 'sqlite'},
            {label: 'Python', value: 'python'}
        ];

        this.addPropertyControl(PARAM_EXPR_LABEL, function ($parent) {
            var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
            $parent.append($elements);

            var control = this.createDropDownList($elements, {
                placeHolder: 'Enter value',
                source: EXPR_TYPE
            });
            control.on('change', function () {
                _this.executeCommonCommand(PARAM_EXPR_TYPE, control.getValue());
            });
            control.setValue = function (value) {
                if (typeof value != 'undefined') {
                    this.jqxDropDownList('selectItem', value);
                }
            };
            control.getValue = function () {
                return this.jqxDropDownList('getSelectedItem').value;
            };
            _this.control[PARAM_EXPR_TYPE] = control;
            _this.$elements[PARAM_EXPR_TYPE] = $elements;
        }, {mandatory: true});
    };


    PythonAddColumnProperties.prototype.createExprControl = function () {
        var _this = this;

        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>');
        var $elements = $('<textarea class="brtc-va-editors-sheet-controls-textarea"></textarea>');
        $wrapper.append($elements);

        this.addPropertyControl(PARAM_FORMULAS_LABEL, function ($parent) {
            $parent.append($wrapper);
            var editorControl = _this.createTextAreaControl($elements, {
                placeholder: 'sepal_length + 1',
                hintOptions: {list: []}
            });
            editorControl.onChange(function () {
                _this.executeCommonCommand(PARAM_FORMULAS, [editorControl.getValue()]);
            });
            _this.control[PARAM_FORMULAS].push(editorControl);
            _this.$elements[PARAM_FORMULAS].push($elements);
        }, {mandatory: true});
    };

    PythonAddColumnProperties.prototype.fillControlValues = function () {
        this.columnData = this.getColumnsOfInTable(0, ["number", "string"]).map(function (col) {
            return col.name;
        });
        var _this = this;
        this.control[PARAM_FORMULAS].forEach(function (control) {
            control.codeMirror.options.hintOptions.list = _this.columnData.slice();
        });
    };

    PythonAddColumnProperties.prototype.renderValues = function () {
        this.renderColumnName();
        this.renderExprType();
        this.renderExpr();
    };

    PythonAddColumnProperties.prototype.renderColumnName = function () {
        var valueArr = this.options.fnUnit.param[PARAM_COL_NM];
        var _this = this;
        valueArr.forEach(function (value, idx) {
            _this.control[PARAM_COL_NM][idx].setValue(value);
        });

    };

    PythonAddColumnProperties.prototype.renderExprType = function () {
        var value = this.options.fnUnit.param[PARAM_EXPR_TYPE];
        this.control[PARAM_EXPR_TYPE].setValue(value);
    };

    PythonAddColumnProperties.prototype.renderExpr = function () {
        var valueArr = this.options.fnUnit.param[PARAM_FORMULAS];
        var _this = this;
        valueArr.forEach(function (value, idx) {
            _this.control[PARAM_FORMULAS][idx].setValue(value);
        });
    };


    PythonAddColumnProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            var paramIdx = this.problems[i].paramIndex;
            if (this.problems[i].param === PARAM_COL_NM) {
                this.createValidationContent(this.$elements[PARAM_COL_NM][paramIdx], this.problems[i]);
            }
            if (this.problems[i].param === PARAM_FORMULAS) {
                this.createValidationContent(this.$elements[PARAM_FORMULAS][paramIdx], this.problems[i]);
            }
        }
    };


    PythonAddColumnProperties.prototype.executeCommonCommand = function (paramNm, value) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };
        commandOption.ref.param[paramNm] = value;

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        this.executeCommand(command);
    };

    Brightics.VA.Core.Functions.Library.addColumnPython.propertiesPanel = PythonAddColumnProperties;

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

    var PARAM_COL_NM = 'new_cols',
        PARAM_COL_NM_LABEL = 'New Column Name',
        PARAM_FORMULAS = 'formulas',
        PARAM_FORMULAS_LABEL = 'Expression';

    function PythonAddColumnValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    PythonAddColumnValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    PythonAddColumnValidator.prototype.constructor = PythonAddColumnValidator;

    PythonAddColumnValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        this.addRule(this.columnNameRule);
        this.addRule(this.columnExprRule);
    };

    PythonAddColumnValidator.prototype.columnNameRule = function (fnUnit) {
        var _this = this;
        var problems = [];

        if (!this._hasSchema(fnUnit)) return;

        $.each(fnUnit.param[PARAM_COL_NM], function (index, value) {
            if (_this.isEmptyForString(value)) {
                problems.push(_this.problemFactory.createProblem({
                    errorCode: 'BR-0033',
                    param: PARAM_COL_NM,
                    paramIndex: index,
                    messageParam: [PARAM_COL_NM_LABEL]
                }, fnUnit));
            }
        });

        if (fnUnit.param[PARAM_COL_NM].length === 0) {
            var messageInfo = {
                errorCode: 'BR-0033',
                param: PARAM_COL_NM,
                paramIndex: 0,
                messageParam: [PARAM_COL_NM_LABEL]
            };
            problems.push(_this.problemFactory.createProblem(messageInfo, fnUnit));
        }
        return problems;
    };

    PythonAddColumnValidator.prototype.columnExprRule = function (fnUnit) {
        var _this = this;
        var problems = [];

        if (!this._hasSchema(fnUnit)) return;
        $.each(fnUnit.param[PARAM_FORMULAS], function (index, value) {
            if (_this.isEmptyForString(value)) {
                problems.push(_this.problemFactory.createProblem({
                    errorCode: 'BR-0033',
                    param: PARAM_FORMULAS,
                    paramIndex: index,
                    messageParam: [PARAM_FORMULAS_LABEL]
                }, fnUnit));
            }
        });

        if (fnUnit.param[PARAM_FORMULAS].length === 0) {
            var messageInfo = {
                errorCode: 'BR-0033',
                param: PARAM_FORMULAS,
                paramIndex: 0,
                messageParam: [PARAM_FORMULAS_LABEL]
            };
            problems.push(_this.problemFactory.createProblem(messageInfo, fnUnit));
        }
        return problems;
    };

    Brightics.VA.Core.Functions.Library.addColumnPython.validator = PythonAddColumnValidator;

}).call(this);