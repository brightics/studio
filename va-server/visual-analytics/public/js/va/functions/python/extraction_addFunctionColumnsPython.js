(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.addFunctionColumnsPython = {
        "category": "extraction",
        "defaultFnUnit": {
            "func": "addFunctionColumnsPython",
            "name": "brightics.function.transform$sql_execute",
            "label": {
                "en": "Add Function Columns", 
                "ko": "복수의 함수열 추가"
            },
            "context": "python",
            "version": "3.6",
            "param": {
                "query": ""
            },
            "inputs": {
                "tables": ""
            },
            "outputs": {
                "out_table": ""
            },
            "meta": {
                "tables": {
                    "type": "table"
                },
                "out_table": {
                    "type": "table"
                }
            },
            "display": {
                "label": "Add Function Columns",
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
        ],
        "description": {
            "en": "This function generates a new column based on a given formula.",
            "ko": "주어진 수식을 기반으로 새 열을 생성합니다."
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
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var CONTROL_SUMMARY = 'summary';

    function PythonAddFunctionColumnsProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    PythonAddFunctionColumnsProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    PythonAddFunctionColumnsProperties.prototype.constructor = PythonAddFunctionColumnsProperties;

    PythonAddFunctionColumnsProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    PythonAddFunctionColumnsProperties.prototype.getPrimaryOperation = function () {
        return 'brightics.function.extraction$add_function_columns';
    };

    PythonAddFunctionColumnsProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.control = {
            CONTROL_SUMMARY: []
        };

        this.createOpenDialogButton();
    };

    PythonAddFunctionColumnsProperties.prototype.createOpenDialogButton = function () {
        var _this = this;

        var $summaryControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>');

        this.addPropertyControl('Add Column', function ($parent) {
            $parent.append($summaryControl);
            _this.control[CONTROL_SUMMARY] = _this.createTextArea($summaryControl, {
                height: '300px',
                disabled: true
            }, 'brtc-style-textarea');
            $summaryControl.on('click', function (event) {
                _this.openScriptEditor();
            });
        }, {mandatory: true});
    };

    PythonAddFunctionColumnsProperties.prototype.openScriptEditor = function () {
        var _this = this;

        new Brightics.VA.Core.Dialogs.FunctionProperties.AddColumnDialog(_this.$mainControl, {
            title: "Add Column",
            fnUnit: _this.options.fnUnit,
            dataProxy: _this.options.dataProxy,
            modelEditor: _this.options.modelEditor,
            columns: _this.columnData,
            additionalHint: _this.hintList,
            close: function (event) {
                if (event.OK) {
                    _this.setSummaryString(event.param);
                    var command = _this.createCommonCommand(event.param);
                    _this.executeCommand(command);
                }
            }
        });
    };

    PythonAddFunctionColumnsProperties.prototype.setSummaryString = function (paramObj) {
        if (paramObj.query) {
            var result = "";
            result += paramObj.query.substring(7, paramObj.query.length);
            this.control[CONTROL_SUMMARY].val(result);
        } else {
            this.control[CONTROL_SUMMARY].val('New column name is empty');
        }
    };

    PythonAddFunctionColumnsProperties.prototype.createCommonCommand = function (paramObj) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: paramObj}
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        return command;
    };

    PythonAddFunctionColumnsProperties.prototype.fillControlValues = function () {
        var _this = this;
        this.columnData = this.getColumnsOfInTable(0, ["number", "string"]).map(function (col) {
            return col.name;
        });

        this.hintList = [];
        var option = {
            url: 'api/va/v3/ws/functions/' + this.options.fnUnit.func,
            type: 'GET',
            blocking: false,
            contentType: 'application/json; charset=utf-8'
        };
        $.ajax(option).done(function (data) {
            var list = data.hintList;
            for(var i in list) {
                _this.hintList.push(list[i])
            }
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    PythonAddFunctionColumnsProperties.prototype.renderValues = function () {
        this.setSummaryString(this.options.fnUnit.param);
    };

    PythonAddFunctionColumnsProperties.prototype.executeCommonCommand = function (paramNm, value) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };
        commandOption.ref.param[paramNm] = value;

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        this.executeCommand(command);
    };

    Brightics.VA.Core.Functions.Library.addFunctionColumnsPython.propertiesPanel = PythonAddFunctionColumnsProperties;

}).call(this);
/**************************************************************************
 *                               Validator
 *************************************************************************/
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PythonAddFunctionColumnsValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    PythonAddFunctionColumnsValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    PythonAddFunctionColumnsValidator.prototype.constructor = PythonAddFunctionColumnsValidator;

    PythonAddFunctionColumnsValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
    };

    Brightics.VA.Core.Functions.Library.addFunctionColumnsPython.validator = PythonAddFunctionColumnsValidator;

}).call(this);