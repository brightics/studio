(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.setValue = {
        "category": "process",
        "defaultFnUnit": {
            "func": "setValue",
            "name": "SetValue",
            "label": {
                "en": "Set Value", 
                "ko": "값 설정"
            },
            "inData": [],
            "outData": [],
            "param": {
                "variables": []
            },
            "display": {
                "label": "Set Value",
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
        "description": {
            "en": "Set variable value.",
            "ko": "변수의 값을 설정합니다."
        },
        "tags": {
            "en": [
                "set",
                "setvalue",
                "value"
            ],
            "ko": [
                "설정",
                "값설정",
                "값"
            ]
        },
        "mandatory": [
            "variables"
        ],
        "in-range": {
            "min": 1,
            "max": 20
        },
        "out-range": {
            "min": 0,
            "max": 10
        }
    };
    
}).call(this);
/**************************************************************************
 *                           Properties Panel                              
 *************************************************************************/
/**
 * Created by jmk09.jung on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetVariableProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    SetVariableProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    SetVariableProperties.prototype.constructor = SetVariableProperties;

    SetVariableProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.options.fnUnit[IN_DATA]);
    };

    SetVariableProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            'variables': this.renderVariables
        };

        this.createVariablesControl();
    };

    SetVariableProperties.prototype.createVariablesControl = function () {
        var _this = this;

        this.$container = $('<div class="brtc-va-editors-sheet-panels-properties-setvariable-variable-container"></div>');

        this.addPropertyControl('Variables', function ($parent) {
            $parent.append(this.$container);

            this.variableControl = new Brightics.VA.Core.Views.SetVariable(this.$container, {
                width: '100%',
                height: 'calc(100% - 30px)',
                editor: this.options.modelEditor,
                onAdd: function (variable) {
                    _this.createOnAddCommand(variable);
                },
                onRemove: function (variable) {
                    _this.createOnRemoveCommand(variable);
                },
                onChange: function (oldVariable, newVariable) {
                    _this.createOnChangeCommand(oldVariable, newVariable);
                },
            });
        });

    };

    SetVariableProperties.prototype.renderVariables = function () {
        this.variableControl.renderValues(this.options.fnUnit.param.variables);
    };

    SetVariableProperties.prototype.fillControlValues = function () {
        var _this = this;
    };

    SetVariableProperties.prototype.createOnRemoveCommand = function (variable) {
        var targetName = variable.name;
        var variables = this.options.fnUnit.param.variables;
        var newVariables = [];

        for (var i in variables) {
            if (variables[i].name === targetName) continue;
            newVariables.push(variables[i]);
        }

        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'variables': newVariables
                }
            }
        };
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);

        this.executeCommand(command);
    };

    SetVariableProperties.prototype.createOnChangeCommand = function (oldVariable, newVariable) {
        var oldName = oldVariable.name;
        var variables = this.options.fnUnit.param.variables;
        
        var commandVariables = [];

        this.updateMode(newVariable);
        this.updateParam(newVariable);

        for (var i in variables) {
            if (variables[i].name === oldName) {
                commandVariables.push(newVariable);
                continue;
            }
            commandVariables.push(variables[i]);
        }

        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'variables': commandVariables
                }
            }
        };
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);

        this.executeCommand(command);
    };

    SetVariableProperties.prototype.createOnAddCommand = function (variable) {
        var cloneVariable = $.extend(true, [], variable);
        var cloneVariables = $.extend(true, [], this.options.fnUnit.param.variables);

        this.updateMode(cloneVariable);
        this.updateParam(cloneVariable);

        cloneVariables.push(variable);

        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'variables': cloneVariables
                }
            }
        };
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);

        this.executeCommand(command);
    };

    SetVariableProperties.prototype.updateMode = function (variable) {
        variable.mode = 'value';
    };

    SetVariableProperties.prototype.updateParam = function (variable) {
        var tempValue = $.extend(variable.value) ;

        variable.param = {};
        variable.param.value = tempValue;

        delete variable.value;
    };

    Brightics.VA.Core.Functions.Library.setValue.propertiesPanel = SetVariableProperties;
}).call(this);