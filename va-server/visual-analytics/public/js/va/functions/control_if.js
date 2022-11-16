(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.if = {
        "category": "control",
        "defaultFnUnit": {
            "func": "if",
            "name": "If",
            "label": {
                "en": "Condition", 
                "ko": "조건문"
            },
            "inData": [],
            "outData": [],
            "param": {
                "if": {
                    "expression": "${=true}",
                    "mid": ""
                },
                "elseif": [],
                "else": {
                    "mid": ""
                }
            },
            "display": {
                "label": "Condition",
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
            "en": "This function executes a branch based on a condition.",
            "ko": "해당 조건문을 수행합니다."
        },
        "tags": {
            "en": [
                "if",
                "else if",
                "else",
                "condition"
            ],
            "ko": [
                "if",
                "else if",
                "else",
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
 * Created by jhoon80.park on 2016-04-26.
 */

/* global _ crel IN_DATA CodeMirror */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var get = this.__module__.ObjectUtils.get;


    var CONDITION = 'expression';

    function ConditionProperties(parentId, options) {
        this.tempIdArray = [];
        Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel.call(this, parentId, options);
    }

    ConditionProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel.prototype);
    ConditionProperties.prototype.constructor = ConditionProperties;

    ConditionProperties.prototype.handleSetFnUnitCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderPersistButton();
            this.renderValues(command);
        }
    };

    ConditionProperties.prototype.handleChangeOutTableCommand = function (command) {
    }

    ConditionProperties.prototype.handleSetFnUnitParameterValueCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderValues(command);
        }
    };

    ConditionProperties.prototype.handleGlobalVariableCommand = function (command) {
    };

    ConditionProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel.prototype.createControls.call(this);
        this.retrieveTableInfo(this.options.fnUnit[IN_DATA]);
    };

    ConditionProperties.prototype.createIntableControl = function () {
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

    ConditionProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.createIfControl();
        this.createElseIfArea();
        this.createElseIfAddButton();

        this.renderIfValue();
        this.renderElseIfValue();
    };

    ConditionProperties.prototype.renderOperationValues = function (command) {
        this.renderIfValue();
        this.renderElseIfValue();
    };

    ConditionProperties.prototype.fillControlValues = function () {
    };

    ConditionProperties.prototype.renderValidation = function () {
        var _this = this;
        var $elseIfs = $('.brtc-va-editors-sheet-controls-else-if-wrapper');
        _.forEach(this.problems, function (problem) {
            if (problem.param === 'if') {
                _this.createValidationContent(_this.$ifControlWrapper, problem);
            } else if (problem.param.indexOf('_') > -1) {
                var path = problem.param.split('_');
                var idx = path[1];
                var $target = $($elseIfs[idx]);
                _this.createValidationContent($target, problem);
            }
        });
    };

    ConditionProperties.prototype.createIfControl = function () {
        var _this = this;
        this.addPropertyControl('If', function ($parent) {
            _this.$ifControl = $(crel('textarea'));
            $parent.append(_this.$ifControl);
            _this.$input = _this.getInputByType('expression', _this.$ifControl, 'expression', 'if');
            _this.$ifControlWrapper = $parent;
        }, {mandatory: true});
    };

    ConditionProperties.prototype.createElseIfArea = function () {
        var _this = this;
        _this.$elseIfInputArea = $(crel('div'));
        _this.$contentsArea.append(_this.$elseIfInputArea);
    };

    ConditionProperties.prototype.createElseIfAddButton = function () {
        var _this = this;
        var className = 'brtc-va-editors-sheet-controls-propertycontrol-columnlist';
        _this.$elseIfAddButton = _this.createBarButton(
            $(crel('input', {class: className, type: 'button', value: '+ Add Else If'}))
        );
        _this.$elseIfAddButton.css({'margin-top': '5px'});
        _this.$contentsArea.append(_this.$elseIfAddButton);
        _this.$elseIfAddButton.click(function (evt) {
            // create && execute command
            var ret = _this.newElseIf();
            _this.createElseIfControl(ret.path, ret.mid);
        });
    };

    ConditionProperties.prototype.createElseIfControl = function (path, mid) {
        var _this = this;
        var getIndex = function (mid) {
            var elifArr = get(_this.options.fnUnit, ['param', 'elseif']);
            return _.findIndex(elifArr, function (elif) {
                return elif.mid === mid;
            });
        };

        this.addPropertyControl('Else If', function ($parent) {
            $parent.addClass('brtc-va-editors-sheet-controls-propertycontrol-deck');
            $parent.addClass('brtc-va-editors-sheet-controls-else-if-wrapper');
            // create input
            var $row = _this.createElseIfRow(path, mid);
            $parent.append($row);

            _this.$elseIfInput.setValue(get(_this.options.fnUnit, ['param', 'elseif'].concat([getIndex(mid), CONDITION])));

            // create remove button
            _this.createElseIfRemoveButton($parent, mid);
        }, {propertyControlParent: _this.$elseIfInputArea, mandatory: true});
    };

    ConditionProperties.prototype.createElseIfRemoveButton = function ($parent, mid) {
        var _this = this;
        var $removeButtonParent = $parent.siblings('.brtc-va-editors-sheet-controls-propertycontrol-label');
        var $removeButton = $('<div class="brtc-va-if-property remove-else-if-button brtc-va-editors-sheet-controls-propertycontrol-deck-remove"></div>');
        $removeButtonParent.append($removeButton);

        $removeButton.click(function (event) {
            // execute delete command
            _this.deleteElseIf(mid);

            var $target = $(this).parents('.brtc-va-editors-sheet-controls-propertycontrol');
            $target.remove();
            event.stopPropagation();
        });
    };

    ConditionProperties.prototype.createElseIfRow = function (targetPath, mid) {
        var _this = this;

        var getIndex = function (mid) {
            var elifArr = get(_this.options.fnUnit, targetPath);
            return _.findIndex(elifArr, function (elif) {
                return elif.mid === mid;
            });
        };


        _this.$elseIf = $(crel('div'));
        _this.$elseIfControl = $(crel('textarea'));
        _this.$elseIf.append(_this.$elseIfControl);
        _this.$elseIfInput = _this.getInputByType('expression', _this.$elseIfControl, 'expression', 'elseif', targetPath.concat([getIndex(mid), CONDITION]));

        var $wrapper =
            $(crel('div',
                _this.$elseIf[0]
            ));
        $wrapper.css({'height': '25px', 'margin-bottom': '10px'});

        return $wrapper;
    };

    ConditionProperties.prototype.newElseIf = function () {
        var _this = this;
        var fnUnit = this.options.fnUnit;

        var mid = Brightics.VA.Core.Utils.IDGenerator.model.id();

        var data = {
            'expression': '${=true}',
            'mid': mid
        };

        var path = ['param', 'elseif'];

        var addOpCommandOptions = {
            fnUnit: fnUnit,
            path: path.concat(fnUnit.param.elseif.length),
            value: data
        };

        var addOpCommand = new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(
            _this,
            addOpCommandOptions
        );

        var newActivityCommand =
            new Brightics.VA.Core.Editors.Diagram.Commands.NewActivityCommand(this, {
                fnUnit: fnUnit,
                mid: mid,
                type: 'if',
                conditionType: 'elseif'
            });

        var model = fnUnit.parent().getMainModel();
        var inData = fnUnit[IN_DATA];
        var addInDatas =
            new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(this, {
                target: model.getInnerModels(),
                path: [mid, IN_DATA],
                value: inData
            });
        var compound = new Brightics.VA.Core.CompoundCommand(this, {label: 'Add Condition'});
        compound.add(addOpCommand);
        compound.add(newActivityCommand);
        compound.add(addInDatas);

        _this.executeCommand(compound);
        return {
            path: path,
            mid: mid
        };
    };

    ConditionProperties.prototype.deleteElseIf = function (mid) {
        var fnUnit = this.options.fnUnit;
        var compound = new Brightics.VA.Core.CompoundCommand(this, {
            label: 'Remove Condition'
        });
        var removeActivityCommand =
            new Brightics.VA.Core.Editors.Diagram.Commands.RemoveActivityCommand(this, {
                mid: mid
            });

        var idx = _.findIndex(fnUnit.param.elseif, function (cond) {
            return cond.mid == mid;
        });
        if (idx == -1) return false;
        var path = ['param', 'elseif', idx];
        var removeOpCommand =
            new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand(this, {
                fnUnit: fnUnit,
                path: path
            });

        compound.add(removeActivityCommand);
        compound.add(removeOpCommand);
        this.executeCommand(compound);
        return true;
    };

    ConditionProperties.prototype.renderIfValue = function () {
        var fnUnit = this.options.fnUnit;
        this.$input.setValue(fnUnit.param.if[CONDITION]);
    };

    ConditionProperties.prototype.renderElseIfValue = function () {
        this.$elseIfInputArea.empty();

        var fnUnit = this.options.fnUnit;
        var elseifList = fnUnit.param.elseif;
        var i;
        for (i = 0; i < elseifList.length; i++) {
            this.createElseIfControl(['param', 'elseif'], elseifList[i].mid);
        }
    };

    ConditionProperties.prototype.bindRemoveButtonClickListener = function ($button,
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

    ConditionProperties.prototype.bindAddButtonClickListener = function ($button,
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

    ConditionProperties.prototype.getInputByType = function (type, $input, paramKey, condition, path) {
        var _this = this;

        var targetPath = ['param', condition, paramKey];
        if (path) {
            targetPath = path;
        }

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

    ConditionProperties.prototype.createCodeMirror = function ($input, options, wrap, callback) {
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

        var wrappedCodeMirror = (function (isWrap, cm) {
            return {
                setValue: function (val) {
                    var strippedVal = (function (_val) {
                        var val = _.isUndefined(_val) ? '${=}' : _val;
                        if (!(_.startsWith(val, '${=') &&
                            _.endsWith(val, '}'))) {
                            val = '${=' + val + '}';
                        }
                        return val.substring(3, val.length - 1);
                    }(val));
                    cm.setValue(strippedVal);
                },
                getValue: function () {
                    var val = cm.getValue();
                    return '${=' + val + '}';
                },
                refresh: function () {
                    cm.refresh();
                }
            };
        }(wrap, codeMirror));

        Brightics.VA.Core.Utils.WidgetUtils
            .changeCodeMirrorLineToSingle(codeMirror);
        codeMirror.on('blur', function () {
            callback(wrappedCodeMirror.getValue());
        });

        return wrappedCodeMirror;
    };

    Brightics.VA.Core.Functions.Library.if.propertiesPanel = ConditionProperties;
    /* eslint-disable no-invalid-this */
}).call(this);
/**************************************************************************
 *                               Validator
 *************************************************************************/
/* -----------------------------------------------------
 *  conditionvalidator.js
 *  Created by hyunseok.oh@samsung.com on 2018-05-15.
 * ---------------------------------------------------- */

/* global Brightics Studio _ */

(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;

    function ConditionValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    ConditionValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    ConditionValidator.prototype.constructor = ConditionValidator;

    ConditionValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        this.addConditionRule();
    };

    ConditionValidator.prototype.addLinkRule = function () {
    };

    ConditionValidator.prototype.addInTableRule = function () {
    };

    ConditionValidator.prototype.addConditionRule = function () {
        var _this = this;
        var getMessageInfo = function (param, msg) {
            return {
                errorCode: 'BR-0033',
                param: param.join('_'),
                messageParam: [msg]
            };
        };

        this.addRule(function (fnUnit) {
            var param = fnUnit.param;
            return []
                .concat(function (exp) {
                    if (_this.isEmptyExpression(exp)) {
                        return _this.problemFactory
                            .createProblem(getMessageInfo(['if'], 'If'), fnUnit);
                    }
                }(param.if.expression))
                .concat(_.chain(param.elseif)
                    .map('expression')
                    .map(function (exp, idx) {
                        if (_this.isEmptyExpression(exp)) {
                            return _this.problemFactory
                                .createProblem(getMessageInfo(['elseif', idx], 'Else If'), fnUnit);
                        }
                    })
                    .compact()
                    .value());
        });
    };

    ConditionValidator.prototype.isEmptyExpression = function (str) {
        var exp = str.substring(3, str.length - 1);
        return !_.trim(exp);
    };

    Brightics.VA.Core.Functions.Library.if.validator = ConditionValidator;

    /* eslint-disable no-invalid-this */
}).call(this);
