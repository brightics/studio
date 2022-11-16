(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.pythonScript = {
        "category": "script",
        "defaultFnUnit": {
            "func": "pythonScript",
            "name": "PythonScript",
            "label": {
                "en": "Python Script", 
                "ko": "파이썬 스크립트"
            },
            'inputs': {
                'inputs': [],
                'models': [],
                'images': []
            },
            'outputs': {
            },
            "param": {
                'script': ''
            },
            "display": {
                "label": "Python Script",
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
            'version': '3.6',
            'context': 'python',
            'meta': {
                'inputs': {'type': 'table', 'range':{'min':1, 'max':10}},
                'models': {'type': 'model', 'range':{'min':1, 'max':10}},
                'images': {'type': 'image', 'range':{'min':1, 'max':10}}
            }
        },
        "description": {
            "en": "This function returns value for executed Python Script.",
            "ko": "실행된 파이썬 스크립트의 결과값을 반환합니다."
        },
        "tags": {
            "en": [
                "python",
                "script",
                "Python Script"
            ],
            "ko": [
                "파이썬",
                "스크립트",
                "파이썬 스크립트"
            ]
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

    function PythonScriptProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    PythonScriptProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    PythonScriptProperties.prototype.constructor = PythonScriptProperties;

    PythonScriptProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    PythonScriptProperties.prototype.fillControlValues = function ($parent) {
        this.columnData = this.dataMap ? this.FnUnitUtils.getInTable(this.options.fnUnit)[0] ? this.dataMap[this.FnUnitUtils.getInTable(this.options.fnUnit)[0]].columns : [] : [];

        this.hintList = [];

        for (var i in this.FnUnitUtils.getInTable(this.options.fnUnit)) {
            this.hintList.push('inputs[' + i + ']');
        }

        for (var i in this.columnData) {
            this.hintList.push(this.columnData[i].name);
        }
    };

    PythonScriptProperties.prototype.getPrimaryOperation = function () {
        return 'brightics.function.script$python_script';
    };

    PythonScriptProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            'script': this.renderScript
        };

        this.createScriptControl();
        this.createOutputsControl();
    };

    PythonScriptProperties.prototype.createOutputsControl = function () {
        this.$outputsWrapper = this.addPropertyControl('Outputs', function ($parent) {
            this.createOutputsUnit($parent, {alias: '', type: 'table'});
        });

        this.$outputsWrapper.find('.brtc-va-editors-sheet-controls-propertycontrol-contents').css('margin-bottom', '0');

        var $label = this.$outputsWrapper.find('.brtc-va-editors-sheet-controls-propertycontrol-label');
        this.addGlobalVariableControl($label, {}, 'out-alias', 'Out Alias');
    };

    PythonScriptProperties.prototype.openScriptEditor = function () {
        var _this = this;

        new Brightics.VA.Core.Dialogs.PythonEditorDialog(_this.$mainControl, {
            title: "Python Script",
            mode: {
                name: 'python',
                version: 3,
                singleLineStringErrors: false
            },
            additionalHint: _this.hintList,
            fnUnit: _this.options.fnUnit,
            statement: _this.pythonScriptViewer.codeMirror.getValue(),
            scriptType: "Python",
            close: function (event) {
                if (event.OK) {
                    _this.createScriptInputCommand(event);
                    _this.redrawQueryStatement(event.param.script);
                    _this.renderOutputs();
                }
            }
        });
    };

    PythonScriptProperties.prototype.createScriptControl = function () {
        var _this = this;

        this.addPropertyControl('Script', function ($parent) {
            var $rscriptArea = $('<textarea class="brtc-va-editors-sheet-controls-sqlcontrol"></textarea>');
            $parent.append($rscriptArea);

            _this.pythonScriptViewer = _this.createTextAreaControl($rscriptArea, {
                verifier: new Brightics.VA.Core.Verifier.SqlVerifier(),
                mode: {
                    name: 'python',
                    version: 3,
                    singleLineStringErrors: false
                },
                theme: 'default',
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: false,
                matchBrackets: true,
                autofocus: false,
                readOnly: 'nocursor'
            });
            $parent.find('.CodeMirror-sizer').css({
                'height': '300px'
            });

            _this.pythonScriptViewer.$mainControl.parent().children('.CodeMirror').on('mousedown', function () {
                $(window).trigger('mousedown');
                _this.openScriptEditor();
            });
        }, {mandatory: true});
    };

    PythonScriptProperties.prototype.redrawQueryStatement = function (queryStatement) {
        this.pythonScriptViewer.setValue(queryStatement);
        this.pythonScriptViewer.codeMirror.setSize('100%', '100%');
    };

    PythonScriptProperties.prototype.renderScript = function () {
        var param = this.options.fnUnit.param;

        if (!param.script) {
            param.script = '' +
                '#\n' +
                '#   NOTE : Enter "Out Table Alias"\n' +
                '#   ex)\n' +
                '#       inputDataframe = inputs[0]\n' +
                '#       result = inputDataframe\n' +
                '#\n';
        }

        this.redrawQueryStatement(param.script);

        this.renderOutputs();
    };

    PythonScriptProperties.prototype.createOutputsUnit = function ($parent, options) {
        var _this = this;

        var $unitWrapper = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-out-alias-unit"></div');
        var $input = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input">');
        var $combo = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-dropdown"></div');
        $input.css('margin-bottom', '5px');

        $parent.append($unitWrapper);
        $unitWrapper.append($input);
        $unitWrapper.append($combo);

        var source = [
            {text: 'TABLE', value: 'table'},
            {text: 'MODEL', value: 'model'},
            {text: 'IMAGE', value: 'image'}
        ];

        var comboOptions = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '28px',
            source: source,
            displayMember: 'text',
            selectedIndex: 0,
            valueMember: 'value',
            dropDownHeight: 70,
            disabled: true
        };

        this.createInput($input, {height: 30}, 'alias-name');
        this.createComboBox($combo, comboOptions, 'alias-type');

        $input.attr('readonly', true);
        $combo.attr('readonly', true);

        $input.val(options.alias);
        $combo.val(options.type);

        $input.on('click', function () {
            _this.openScriptEditor();
        });
        $combo.on('click', function () {
            _this.openScriptEditor();
        });
    };

    PythonScriptProperties.prototype.renderOutputs = function () {
        var outputs = this.FnUnitUtils.getOutputs(this.options.fnUnit);
        var $wrapper = this.$outputsWrapper.find('.brtc-va-editors-sheet-controls-propertycontrol-contents').empty();

        if (_.isEmpty(outputs)) {
            this.createOutputsUnit($wrapper, {});
        } else {
            for (var key in outputs) {
                var options = {
                    alias: key,
                    type: this.FnUnitUtils.getTypeByTableId(this.options.fnUnit, outputs[key])
                  };
                this.createOutputsUnit($wrapper, options);
            }
        }
    };

    PythonScriptProperties.prototype.createScriptInputCommand = function (evt) {
        var compoundCommand = new Brightics.VA.Core.CompoundCommand(this);

        var fnUnitOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {}
            }
        };

        var outTableOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                outputs: {},
                meta: {}
            }
        };

        fnUnitOption.ref.param.script = '';

        if (evt.param.script) {
            fnUnitOption.ref.param.script = evt.param.script;
        }

        outTableOption.ref.outputs = evt.outputs;
        outTableOption.ref.meta = evt.meta;

        var outTableCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutputsCommand(this, outTableOption);
        var fnUnitCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, fnUnitOption);

        compoundCommand.add(fnUnitCommand);
        compoundCommand.add(outTableCommand);

        this.createReturnDataCommand(compoundCommand, evt);
        this.executeCommand(compoundCommand);
    };

    PythonScriptProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param == 'script') this.createValidationContent(this.pythonScriptViewer.$mainControl.parent(), this.problems[i])
        }
    };

    Brightics.VA.Core.Functions.Library.pythonScript.propertiesPanel = PythonScriptProperties;

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

    function PythonScriptValidator() {
        this.PARAM_COLUMNS = 'columns';

        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    PythonScriptValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    PythonScriptValidator.prototype.constructor = PythonScriptValidator;

    PythonScriptValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);

        this.addScriptRule();
        this.addOutTableAliasRule();
    };

    PythonScriptValidator.prototype.addScriptRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var problems = [];

            if (fnUnit.param.script == '') {
                problems.push(_this.problemFactory.createProblem({
                    errorCode: 'BR-0033',
                    param: 'script',
                    messageParam: ['Script']
                }, fnUnit));
            }
            return problems;
        });
    };

    PythonScriptValidator.prototype.addOutTableAliasRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var messageInfo = {
                errorCode: 'BR-0033',
                param: 'out-table-alias',
                messageParam: ["Out Table Alias"]
            };
            return _this._checkArrayIsEmpty(messageInfo, fnUnit, fnUnit.param['out-table-alias']);
        });
    };

    PythonScriptValidator.prototype.addLinkRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            return _this.checkLinkIsConnected(fnUnit);
        });
    };

    PythonScriptValidator.prototype.checkLinkIsConnected = function (fnUnit) {
        var messageInfo = {
            errorCode: 'EL001',
            messageParam: [fnUnit.display.label]
        };
        if (!this._hasPrevious(fnUnit)) return this.problemFactory.createProblem(messageInfo, fnUnit);
    };

    Brightics.VA.Core.Functions.Library.pythonScript.validator = PythonScriptValidator;

}).call(this);