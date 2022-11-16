(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.simpleFilterPython = {
        "category": "transform",
        "defaultFnUnit": {
            "func": "simpleFilterPython",
            "name": "brightics.function.manipulation$simple_filter",
            "label": {
                "en": "Filter", 
                "ko": "필터"
            },
            "context": "python",
            "version": "3.6",
            "param": {
                "main_operator": "and",
                "input_cols": [],
                "operators": [],
                "operands": []
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
                "label": "Filter",
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
            "main_operator",
            "input_cols",
            "operators",
            "operands"
        ],
        "description": {
            "en": "This function creates a dataframe with the given input.",
            "ko": "주어진 입력으로 데이터 프레임을 생성합니다."
        },
        "tags": {
            "en": [
                "main_operator",
                "input_cols",
                "operators",
                "operands"
            ],
            "ko": [
                "main_operator",
                "input_cols",
                "operators",
                "operands"
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

    var PARAM_MAIN_OPERATOR = 'main_operator';
    var PARAM_COLUMN = 'input_cols';
    var PARAM_OPERATOR = 'operators';
    var PARAM_OPERAND = 'operands';

    function PythonSimpleFilterProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    PythonSimpleFilterProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    PythonSimpleFilterProperties.prototype.constructor = PythonSimpleFilterProperties;

    PythonSimpleFilterProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
        this.options.isRendered = true;
    };

    PythonSimpleFilterProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.control = {};
        this.createOpenDialogButton();
    };

    PythonSimpleFilterProperties.prototype.createOpenDialogButton = function () {
        var _this = this;

        this.$summaryControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>');

        this.addPropertyControl('Condition', function ($parent) {
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

    PythonSimpleFilterProperties.prototype.openScriptEditor = function () {
        var _this = this;

        new Brightics.VA.Core.Dialogs.FunctionProperties.SimpleFilterDialog(_this.$mainControl, {
            title: "Filter",
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


    PythonSimpleFilterProperties.prototype.renderValues = function (command) {
        this.setSummaryString(this.options.fnUnit.param);
    };

    PythonSimpleFilterProperties.prototype.renderValidation = function () {
        // for (var i in this.problems) {
        //     if (this.problems[i].param === 'filter') {
        //         this.createValidationContent(this.$summaryControl, this.problems[i]);
        //     }
        // }
    };


    PythonSimpleFilterProperties.prototype.setSummaryString = function (paramObj) {
        if (paramObj[PARAM_COLUMN]) {
            var mainOperator = paramObj[PARAM_MAIN_OPERATOR];
            var result = "";
            paramObj[PARAM_COLUMN].forEach(function (column, idx, thisArr) {
                result += column + " " + paramObj[PARAM_OPERATOR][idx] + " " + paramObj[PARAM_OPERAND][idx] + "\n";
                if (idx != thisArr.length - 1) {
                    result += "\t" + mainOperator + "\n"
                }
            });
            this.control[CONTROL_SUMMARY].val(result);
        }
    };

    PythonSimpleFilterProperties.prototype.createCommonCommand = function (paramObj) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: paramObj}
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        return command;
    };


    Brightics.VA.Core.Functions.Library.simpleFilterPython.propertiesPanel = PythonSimpleFilterProperties;

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
    var PARAM_COLUMN = 'input_cols';

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
                param: 'filter',
                messageParam: ['Filter']
            };
            return _this._checkArrayIsEmpty(messageInfo, fnUnit, fnUnit.param[PARAM_COLUMN]);
        });
    };


    Brightics.VA.Core.Functions.Library.simpleFilterPython.validator = PythonAddColumnIfValidator;

}).call(this);