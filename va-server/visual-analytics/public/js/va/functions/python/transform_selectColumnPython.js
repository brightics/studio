/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.selectColumnPython = {
        "category": "transform",
        "defaultFnUnit": {
            "func": "selectColumnPython",
            "name": "brightics.function.transform$select_column",
            "label": {
                "en": "Select Column", 
                "ko": "열 선택"
            },
            "context": "python",
            "version": "3.6",
            "param": {
                "input_cols": [],
                "output_cols": [],
                "output_types": []
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
                "label": "Select Column",
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
            "output_cols",
            "output_types"
        ],
        "description": {
            "en": "Select specified columns from an input table.",
            "ko": "입력 테이블에서 지정된 열을 선택합니다."
        },
        "tags": {
            "en": [
                "column",
                "select column",
                "select"
            ],
            "ko": [
                "열",
                "열 선택",
                "열선택"
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

    var PARAM_COLUMN = 'input_cols';
    var PARAM_ALIAS = 'output_cols';
    var PARAM_TYPE = 'output_types';

    function PythonSelectColumnProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    PythonSelectColumnProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    PythonSelectColumnProperties.prototype.constructor = PythonSelectColumnProperties;

    PythonSelectColumnProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
        this.options.isRendered = true;
    };

    PythonSelectColumnProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.control = {};
        this.createOpenDialogButton();
    };

    PythonSelectColumnProperties.prototype.createOpenDialogButton = function () {
        var _this = this;

        this.$summaryControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>');

        this.$selectedColumnProp = this.addPropertyControl('Selected Column', function ($parent) {
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

    PythonSelectColumnProperties.prototype.openScriptEditor = function () {
        var _this = this;

        new Brightics.VA.Core.Dialogs.FunctionProperties.SelectColumnDialog(_this.$mainControl, {
            title: "Select Column",
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


    PythonSelectColumnProperties.prototype.renderValues = function (command) {
        this.setSummaryString(this.options.fnUnit.param);
    };

    PythonSelectColumnProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param === 'selected-column') {
                this.createValidationContent(this.$summaryControl, this.problems[i]);
            }
        }
    };


    PythonSelectColumnProperties.prototype.setSummaryString = function (paramObj) {
        if (paramObj[PARAM_COLUMN]) {
            const result =
                _.zip(paramObj[PARAM_COLUMN], paramObj[PARAM_ALIAS], paramObj[PARAM_TYPE])
                    .map(([column, alias, type]) => {
                        return [
                            column,
                            `        Alias: ${alias},`,
                            `        Type: ${type}`,
                            ``
                        ].join('\n');
                    })
                    .join('\n');
            this.control[CONTROL_SUMMARY].val(result);
        }
    };

    PythonSelectColumnProperties.prototype.createCommonCommand = function (paramObj) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: paramObj}
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        return command;
    };


    Brightics.VA.Core.Functions.Library.selectColumnPython.propertiesPanel = PythonSelectColumnProperties;

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

    function PythonSelectColumnValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    PythonSelectColumnValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    PythonSelectColumnValidator.prototype.constructor = PythonSelectColumnValidator;

    PythonSelectColumnValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        this.addSelectedColumnRequired();
    };

    PythonSelectColumnValidator.prototype.addSelectedColumnRequired = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            if (!this._hasSchema(fnUnit)) return;
            var messageInfo = {
                errorCode: 'BR-0033',
                param: 'selected-column',
                messageParam: ['Selected Column']
            };
            return _this._checkArrayIsEmpty(messageInfo, fnUnit, fnUnit.param.input_cols);
        });
    };


    Brightics.VA.Core.Functions.Library.selectColumnPython.validator = PythonSelectColumnValidator;

}).call(this);