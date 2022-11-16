(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.forLoop = {
        "category": "control",
        "defaultFnUnit": {
            "func": "forLoop",
            "name": "ForLoop",
            "label": {
                "en": "For Loop", 
                "ko": "For 반복문"
            },
            "inData": [],
            "outData": [],
            "param": {
                "mid": "",
                "type": "count",
                "prop": {
                    "start": "",
                    "end": "",
                    "index-variable": ""
                }
            },
            "display": {
                "label": "For Loop",
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
            "en": "This function performs iterations while satisfying the condition.",
            "ko": "특정한 조건을 만족시키면서 작업을 정해진 횟수만큼 반복합니다."
        },
        "tags": {
            "en": [
                "loop",
                "for",
                "condition"
            ],
            "ko": [
                "루프",
                "for",
                "조건"
            ]
        },
        "in-range": {
            "min": 1,
            "max": 10
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
 * Created by daewon77.park on 2016-02-18.
 */

/* global _, IN_DATA, crel, CodeMirror */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var get = this.__module__.ObjectUtils.get;

    var LOOP_TYPE = 'type';
    var LOOP_PROP = 'prop';

    function ForLoopProperties(parentId, options) {
        this.tempIdArray = [];
        Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel.call(this, parentId, options);
    }

    ForLoopProperties.prototype =
        Object.create(Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel.prototype);
    ForLoopProperties.prototype.constructor = ForLoopProperties;

    ForLoopProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.options.fnUnit[IN_DATA]);
    };


    ForLoopProperties.prototype.handleSetFnUnitCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderPersistButton();
            this.renderValues(command);
        }
    };

    ForLoopProperties.prototype.handleChangeOutTableCommand = function (command) {
    }

    ForLoopProperties.prototype.handleSetFnUnitParameterValueCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderValues(command);
        }
    };

    ForLoopProperties.prototype.handleGlobalVariableCommand = function (command) {
    };

    ForLoopProperties.prototype.createIntableControl = function () {
        var _this = this;
        if (typeof this.options.fnUnit[IN_DATA] === 'undefined') return;

        var funcDef = this.getFunctionDef();
        var minRow = funcDef['in-range'].min || 1;


        this.$intableControl = $('<div class="brtc-va-editors-sheet-controls-property-in-table-control-columnlist"/>');

        this.addPropertyInTableControl('In Table', function ($parent) {
            $parent.append(_this.$intableControl);
            var widgetOptions = {
                fnUnit: _this.options.fnUnit,
                editor: _this.options.modelEditor,
                minRow: minRow
            };
            if (minRow > 1) {
                widgetOptions.rowHeaderType = 'number';
            }

            if (this._intableControlOption) {
                $.extend(true, widgetOptions, this._intableControlOption);
            }

            _this._intableControl = _this.createInTableList(_this.$intableControl, widgetOptions);
        });
    };

    ForLoopProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels
            .InnerPropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.validationArea = {count: {}, collection: {}};
        this.template = [
            {
                label: 'Count',
                paramValue: 'count',
                controls: [
                    {
                        label: 'Start',
                        paramKey: 'start',
                        type: 'expression', 
                        mandatory: true
                    },
                    {
                        label: 'End',
                        paramKey: 'end',
                        type: 'expression',
                        mandatory: true
                    },
                    {
                        label: 'Index Variable',
                        paramKey: 'index-variable',
                        type: 'variable'
                    }
                ]
            },
            {
                label: 'Collection',
                paramValue: 'collection',
                controls: [
                    {
                        label: 'Collection',
                        paramKey: 'collection',
                        type: 'expression',
                        mandatory: true
                    },
                    {
                        label: 'Element Variable',
                        paramKey: 'element-variable',
                        type: 'variable'
                    },
                    {
                        label: 'Index Variable',
                        paramKey: 'index-variable',
                        type: 'variable'
                    }
                ]
            }
        ];

        this.prvVal = {};
        this.createLoopControls();
        this.renderLoopControls(this.options.fnUnit.param[LOOP_TYPE]);
    };

    ForLoopProperties.prototype.renderValidation = function () {
        var _this = this;
        _.forEach(this.problems, function (problem) {
            if (problem.param.indexOf('/') > -1) {
                var params = problem.param.split('/');
                var $target = _this.getValidationArea(params[0], params[1]);
                _this.createValidationContent($target, problem);
            }
        });
    };

    // OperationCommand
    ForLoopProperties.prototype.renderOperationValues = function (command) {
        this.renderLoopControls(this.options.fnUnit.param[LOOP_TYPE]);
    };

    ForLoopProperties.prototype.renderRadioButton = function () {
        var loopType = this.options.fnUnit.param[LOOP_TYPE];

        if (typeof loopType !== 'undefined') {
            for (var i = 0; i < this.template.length; i++) {
                if (loopType === this.template[i].paramValue) {
                    this.template[i].$radio.jqxRadioButton('check');
                    break;
                }
            }
        } else {
            this.template[0].$radio.jqxRadioButton('check');
        }
    }

    ForLoopProperties.prototype.createLoopControls = function () {
        var template = this.template;
        var _this = this;
        var fnUnit = this.options.fnUnit;
        var setLoopTypeParam = function (item) {
            return function () {
                if (fnUnit.param[LOOP_TYPE] === item.paramValue) return;
                var compound = new Brightics.VA.Core.CompoundCommand(_this, {
                    label: 'Change FnUnit Properties'
                });

                compound.add(new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(
                    _this, {
                        fnUnit: fnUnit,
                        path: ['param', LOOP_TYPE],
                        value: item.paramValue
                    }
                ))

                var obj = {};
                _.forEach(item.controls, function (control) {
                    obj[control.paramKey] = '';
                });
                compound.add(new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(
                    _this, {
                        fnUnit: fnUnit,
                        path: ['param', LOOP_PROP],
                        value: obj
                    }
                ));

                _this.executeCommand(compound);
                _this.renderLoopControls(item.paramValue);
            };
        };

        this.addPropertyControl('Loop Type', function ($parent) {
            _.forEach(template, function (item) {
                item.$radio = _this.createRadioButton($('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton-looptype">' + item.label + '</div>'), {
                    groupName: 'loop-type',
                    checked: item.paramValue === _this.options.fnUnit.param[LOOP_TYPE]
                });
                $parent.append(item.$radio);
                item.$radio.on('checked', setLoopTypeParam(item));
            });
        }, {mandatory: true});

        _.forEach(template, function (item) {
            _.forEach(item.controls, function (control) {
                control.$el = _this.addPropertyControl(control.label, function ($parent) {
                    var $input = $(crel('textarea'));
                    $parent.append($input);
                    control.$input = _this.getInputByType(control.type, $input, control.paramKey);
                    _this.validationArea[item.paramValue][control.paramKey] = $parent;
                }, {mandatory: control.mandatory});
                control.$el.hide();
            });
        });
    };

    ForLoopProperties.prototype.getInputByType = function (type, $input, paramKey) {
        var _this = this;

        var targetPath = ['param', LOOP_PROP, paramKey];
        var handleChange = function (val) {
            var prvVal = get(_this.options.fnUnit, targetPath) || '';
            var newVal = val || '';
            if (prvVal === newVal) return;
            var commandOptions = {
                fnUnit: _this.options.fnUnit,
                label: 'Change FnUnit Properties',
                path: targetPath,
                value: newVal
            };
            var command = new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(
                _this,
                commandOptions
            );
            _this.executeCommand(command);
        };

        var cm = (function () {
            if (type === 'expression') {
                return _this.createCodeMirror($input, {
                    placeholder: 'Expression',
                    width: '100%'
                }, true, handleChange);
            } else if (type === 'variable') {
                return _this.createCodeMirror($input, {
                    placeholder: 'Enter Variable',
                    width: '100%'
                }, false, handleChange);
            }
        }());
        return cm;
    };

    ForLoopProperties.prototype.renderLoopControls = function (name) {
        var _this = this;
        this.prvVal = {};
        var idx = _.findIndex(this.template, function (item) {
            return item.paramValue === name;
        });

        if (idx === -1) return false;
        _.forEach(this.template, function (item) {
            _.forEach(item.controls, function (control) {
                return control.$el.hide();
            });
        });

        var controls = this.template[idx].controls;
        _.forEach(controls, function (control) {
            control.$el.show();
            control.$input.setValue(_this.options.fnUnit.param[LOOP_PROP][control.paramKey]);
        });

        var $radio = this.template[idx].$radio;
        $radio.jqxRadioButton('check');        
    };

    ForLoopProperties.prototype.bindRemoveButtonClickListener = function ($button,
            targetPath, afterExecuteCommand) {
        var _this = this;
        $button.click(function (evt) {
            var commandOptions = {
                fnUnit: _this.options.fnUnit,
                label: 'Change FnUnit Properties',
                path: targetPath instanceof Array ? targetPath : targetPath()
            };

            var command = new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand(
                _this,
                commandOptions
            );
            _this.executeCommand(command);
            if (afterExecuteCommand) afterExecuteCommand();
        });
    };

    ForLoopProperties.prototype.bindAddButtonClickListener = function ($button,
            targetPath, obj, afterExecuteCommand) {
        var _this = this;
        $button.click(function (evt) {
            var commandOptions = {
                fnUnit: _this.options.fnUnit,
                label: 'Change FnUnit Properties',
                path: targetPath instanceof Array ? targetPath : targetPath(),
                value: obj
            };
            var command = new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(
                _this,
                commandOptions
            );
            _this.executeCommand(command);
            if (afterExecuteCommand) afterExecuteCommand();
        });
    };

    ForLoopProperties.prototype.createCodeMirror = function ($input, options, wrap, callback) {
        var controlOptions = _.merge({}, {
            mode: 'brtc-control',
            scrollbarStyle: 'null',
            lineWrapping: false,
            matchBrackets: false,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Tab': false, // Let focus go to next control
                'Shift-Tab': false // Let focus go to previous control
            },
            showTrailingSpace: true
        }, options);

        var codeMirror = CodeMirror.fromTextArea($input[0], controlOptions);

        var _this = this;
        var wrappedCodeMirror = (function (isWrap, cm) {
            return {
                setValue: function (val) {
                    var strippedVal = (function (_val, strip) {
                        var val = _.isUndefined(_val) ? '' : _val;
                        if (strip && _this.test(val)) {
                            return val.substring(3, val.length - 1);
                        }
                        return val;
                    }(val, isWrap));
                    cm.setValue(strippedVal);
                },
                getValue: function () {
                    var val = cm.getValue();
                    if (isWrap) return '${=' + val + '}';
                    return val;
                },
                refresh: function () {
                    cm.refresh();
                }
            };
        }(wrap, codeMirror));

        Brightics.VA.Core.Utils.WidgetUtils
            .changeCodeMirrorLineToSingle(codeMirror);
        codeMirror.on('blur', function (event, eventData) {
            // TODO check here..
            // isRendered가 항상 true라서 undo, redo 시점에 계속 executeCommand가 발생하는데
            // 임시로 처리..
            if (event.state.focused) callback(wrappedCodeMirror.getValue());
        });

        return wrappedCodeMirror;
    };

    ForLoopProperties.prototype.test = function (str) {
        return _.startsWith(str, '${=') && _.endsWith(str, '}');
    };

    ForLoopProperties.prototype.getValidationArea = function (type, prop) {
        return this.validationArea[type][prop];
    };

    Brightics.VA.Core.Functions.Library.forLoop.propertiesPanel = ForLoopProperties;
/* eslint-disable no-invalid-this */
}).call(this);

/**************************************************************************
 *                               Validator                                 
 *************************************************************************/
/* -----------------------------------------------------
 *  forloopvalidator.js
 *  Created by hyunseok.oh@samsung.com on 2018-05-15.
 * ---------------------------------------------------- */

/* global Brightics _ */
(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;

    var START_PROP = 'start';
    var START_MSG = 'Start';
    var END_PROP = 'end';
    var END_MSG = 'End';
    var COLLECTION_PROP = 'collection';
    var COLLECTION_MSG = 'Collection';
    var EXPRESSION_TYPE = 'expression';

    var requiredByType = {
        count: [
            {prop: START_PROP, type: EXPRESSION_TYPE, msg: START_MSG},
            {prop: END_PROP, type: EXPRESSION_TYPE, msg: END_MSG}
        ],
        collection: [
            {prop: COLLECTION_PROP, type: EXPRESSION_TYPE, msg: COLLECTION_MSG}
        ]
    };

    function ForLoopValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    ForLoopValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    ForLoopValidator.prototype.constructor = ForLoopValidator;

    ForLoopValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        this.addForLoopRule();
    };

    ForLoopValidator.prototype.addLinkRule = function () {
    };

    ForLoopValidator.prototype.addInTableRule = function () {
    };

    ForLoopValidator.prototype.addForLoopRule = function () {
        var _this = this;
        var getMessageInfo = function (param, msg) {
            return {
                errorCode: 'BR-0033',
                param: param.join('/'),
                messageParam: [msg]
            };
        };

        this.addRule(function (fnUnit) {
            var param = fnUnit.param;
            var required = requiredByType[param.type];
            return _.chain(required)
                .map(function (req) {
                    if (_this.isEmpty(param, req)) {
                        return _this.problemFactory
                            .createProblem(getMessageInfo([param.type, req.prop], req.msg), fnUnit);
                    }
                })
                .compact()
                .value();
        });
    };

    ForLoopValidator.prototype.isEmpty = function (param, required) {
        var val = param.prop[required.prop];
        if (required.type === EXPRESSION_TYPE) {
            return this.isEmptyExpression(val);
        }
        return this.isEmptyVariable(val);
    };

    ForLoopValidator.prototype.isEmptyVariable = function (str) {
        return !_.trim(str);
    };

    ForLoopValidator.prototype.isEmptyExpression = function (str) {
        var exp = str.substring(3, str.length - 1);
        return !_.trim(exp);
    };

    Brightics.VA.Core.Functions.Library.forLoop.validator = ForLoopValidator;
}).call(this);
