(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.addColumnIfPython = {
        "category": "extraction",
        "defaultFnUnit": {
            "func": "addColumnIfPython",
            "name": "brightics.function.extraction$add_expression_column_if",
            "label": {
                "en": "Add Column", 
                "ko": "열 추가"
            },
            "context": "python",
            "version": "3.6",
            "param": {
                "expr_type": "sqlite",
                "new_col": "",
                "conditions": [],
                "values": [],
                "else_value": ""
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
                "label": "Add Column",
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
            "expr_type",
            "values",
            "else_value"
        ],
        "description": {
            "en": "This function generates a new column based on a given formula.", 
            "ko": "주어진 수식을 기반으로 새 열을 생성합니다."
        },
        "tags": {
            "en": [
                "column",
                "add column",
                "add"
            ],
            "ko": [
                "열",
                "열 추가",
                "열추가"
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

    var CONTROL_SUMMARY = 'summary';

    var PARAM_COL_NM = 'new_col',
        PARAM_EXPR_TYPE = 'expr_type',
        PARAM_CONDITIONS = 'conditions',
        PARAM_VALUES = 'values',
        PARAM_ELSE_VALUE = 'else_value';


    function PythonAddColumnIfProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    PythonAddColumnIfProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    PythonAddColumnIfProperties.prototype.constructor = PythonAddColumnIfProperties;

    PythonAddColumnIfProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
        this.options.isRendered = true;
    };

    PythonAddColumnIfProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.control = {};
        this.createOpenDialogButton();
    };

    PythonAddColumnIfProperties.prototype.createOpenDialogButton = function () {
        var _this = this;

        this.$summaryControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>');

        this.addPropertyControl('Add Column', function ($parent) {
            $parent.append(_this.$summaryControl);
            _this.control[CONTROL_SUMMARY] = _this.createTextArea(_this.$summaryControl, {
                height: '300px',
                disabled: true
            }, 'brtc-style-textarea');
            _this.$summaryControl.on('click', function (event) {
                _this.openScriptEditor();
            });
        }, {mandatory: true});
    };

    PythonAddColumnIfProperties.prototype.openScriptEditor = function () {
        var _this = this;

        new Brightics.VA.Core.Dialogs.FunctionProperties.AddColumnIfDialog(_this.$mainControl, {
            title: "Add Column",
            fnUnit: _this.options.fnUnit,
            dataProxy: _this.options.dataProxy,
            modelEditor: _this.options.modelEditor,
            close: function (event) {
                if (event.OK) {
                    _this.setSummaryString(event.param);
                    var command = _this.createCommonCommand(event.param);
                    _this.executeCommand(command);
                }
            }
        });
    };


    PythonAddColumnIfProperties.prototype.renderValues = function (command) {
        this.setSummaryString(this.options.fnUnit.param);
    };

    PythonAddColumnIfProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param === 'add-column') {
                this.createValidationContent(this.$summaryControl, this.problems[i]);
            }
        }
    };


    PythonAddColumnIfProperties.prototype.setSummaryString = function (paramObj) {
        if (paramObj[PARAM_COL_NM]) {
            var result = "";
            result += "Expression Type: " + paramObj[PARAM_EXPR_TYPE] + "\n";
            result += "Column Name: " + paramObj[PARAM_COL_NM] + "\n\n";
            paramObj[PARAM_CONDITIONS].forEach(function (conditionText, idx) {
                if (conditionText != '') {
                    result += "" + conditionText + "\n\t=> " + paramObj[PARAM_VALUES][idx] + "\n"
                }

            });
            result += "ELSE \n\t=>" + paramObj[PARAM_ELSE_VALUE];
            this.control[CONTROL_SUMMARY].val(result);
        } else {
            this.control[CONTROL_SUMMARY].val('New column name is empty');
        }
    };

    PythonAddColumnIfProperties.prototype.createCommonCommand = function (paramObj) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: paramObj}
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        return command;
    };

    Brightics.VA.Core.Functions.Library.addColumnIfPython.propertiesPanel = PythonAddColumnIfProperties;

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
    var PARAM_COL_NM = 'new_col';

    function PythonAddColumnIfValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    PythonAddColumnIfValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    PythonAddColumnIfValidator.prototype.constructor = PythonAddColumnIfValidator;

    PythonAddColumnIfValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        this.addSummaryRequired();
    };

    PythonAddColumnIfValidator.prototype.addSummaryRequired = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            if (!this._hasSchema(fnUnit)) return;
            var messageInfo = {
                errorCode: 'BR-0033',
                param: 'add-column',
                messageParam: ['Add Column']
            };
            return _this._checkArrayIsEmpty(messageInfo, fnUnit, fnUnit.param[PARAM_COL_NM]);
        });
    };


    Brightics.VA.Core.Functions.Library.addColumnIfPython.validator = PythonAddColumnIfValidator;

}).call(this);