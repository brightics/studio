/*******************************************************************************
 * Function Basic Template
 ******************************************************************************/
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    /**
     * 1. 작성한 함수의 javascript 파일명 규칙 : "category" + "_" + "func" + ".js"
     *   예)  "category": "io",
     *        "defaultFnUnit": {
     *            "func": "custom",
     *       위와 같은 경우 파일명은 io_custom.js 이다.
     * 2. 파일위치 : /va/addonfunctions/ 디렉토리에 저장한다.
     * --------------------------------------------------------------------
     * 함수의 기본값을 설정한다.
     * 1. category - 함수의 카테고리를 지정
     * 2. defaultFnUnit : 함수의 기본값을 설정
     *   1) func : 함수 ID
     *     - 다른 함수 ID와 중복되지 않는 유일한 값이어야 한다.
     *   2) param : 함수 Property Pannel에 보여질 컨트롤의 기본정보 셋팅
     *     - radio-button : value값을 설정하면 default로 체크됨
     *     - check-box : value값을 설정하면 default로 체크됨 
     *   3) display : 화면에 보여지는 항목값 설정
     *     - label : Property Pannel에 보여지는 함수명
     *   4) in-range : 함수의 inputs 테이블 갯수 설정. mix, max 같은 값으로 설정
     *   5) out-range: 함수의 outputs 테이블 갯수 설정. mix, max 같은 값으로 설정
     */
    Brightics.VA.Core.Functions.Library.custom = {
        "category": "io",
        "defaultFnUnit": {
            "func": "custom",
            "name": "Custom",
            "inData": [],
            "outData": [],
            "param": {
                "columns": [],
                "dropdown-list": "",
                "radio-button": "value1", 
                "check-box": [
                    "value1",
                    "value2"
                ],
                "input-box-number": "",
                "input-box-string": ""
            },
            "display": {
                "label": "Custom Function",
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
        "description": "Custom Function Template",
        "mandatory": [],
        "tags": [
            "template",
            "Template",
            "custom"
        ],
        "in-range": {
            "min": "1",
            "max": "1"
        },
        "out-range": {
            "min": "1",
            "max": "1"
        }
    };
    Brightics.VA.Implementation.DataFlow.Functions['custom'] = Brightics.VA.Core.Functions.Library['custom'];
    
    /**************************************************************************
     *                           Properties Panel                              
     *************************************************************************/
    /**
     * 화면의 함수 Property Panel에 보여지는 컨트롤을 생성
     * 1. 함수에서 사용할 컨트롤을 생성한다.
     *   - template에서는 다음 5개의 기본 컨트롤을 제공한다.
     *     columns, dropdown-list, radio-button, check-box, input-box(numer, string)
     * 2. 생성된 컨트롤을 rendering 한다.
     */
    function CustomProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }
    
    CustomProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    CustomProperties.prototype.constructor = CustomProperties;
    
    CustomProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
    
        this.retrieveTableInfo(this.options.fnUnit['inData']);
    };
    
    CustomProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);
        this.render = {
            'columns': this.renderColumnsControl,
            'dropdown-list': this.renderDropdownListControl,
            'radio-button': this.renderRadioButtonControl,
            'check-box': this.renderCheckBoxControl,
            'input-box-number': this.renderInputBoxNumberControl,
            'input-box-string': this.renderInputBoxStringControl
        };
        
        this.$elements = {};
        this.controls = {};
        
        this.createColumnsControl();
        this.createDropdownListControl();
        this.createRadioButtonControl();
        this.createCheckBoxControl();
        this.createInputBoxNumberControl();
        this.createInputBoxStringControl();
    };
     
    //================================================================================
    // columns 컨트롤 생성
    // opt 항목 설정
    //   multiple : 복수선택 여부 설정,
    //   maxRowCount : 화면에 display되는 갯수 설정(선택한 칼럼이 보여지는 부분의 갯수설정)
    // {mandatory: true} : 필수항목 설정. 화면에서 라벨명옆에 '*' 가 표시된다.
    //================================================================================
    CustomProperties.prototype.createColumnsControl = function ($parent) {
        var _this = this;
        _this.$elements['columns'] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');
        _this.addPropertyControl('Columns', function ($container) {
            $container.append(_this.$elements['columns']);
            var opt = {"multiple":true,"maxRowCount":"5"};
            opt.changed = function (type, data) { 
                var command = _this.createSetParameterValueCommand('columns', data.items);
                _this.executeCommand(command)
            };
            _this.controls['columns'] = _this.createColumnList(_this.$elements['columns'], opt);
        }, {mandatory: true});
    };
     
    CustomProperties.prototype.renderColumnsControl = function ($parent) {
        var _this = this;
        var items = _this.options.fnUnit.param['columns'];
        _this.controls['columns'].setSelectedItems(items);
    };
     
    //================================================================================
    // drop-down-list 컨트롤 생성
    // opt 항목 설정
    //  DropDownList에 보여질 label, value 설정
    // {mandatory: true} : 필수항목 설정. 화면에서 라벨명옆에 '*' 가 표시된다.
    //================================================================================
    CustomProperties.prototype.createDropdownListControl = function ($parent) {
        var _this = this;
        _this.$elements['dropdown-list'] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        _this.addPropertyControl('Select Value', function ($container) {
     
            $container.append(_this.$elements['dropdown-list']);
            var opt = {"source":[{"label":"Label1","value":"value1","default":false},{"label":"Label2","value":"value2","default":false},{"label":"Label3","value":"value3","default":false}],"displayMember":"label","valueMember":"value"};
            _this.controls['dropdown-list'] = _this.createDropDownList(_this.$elements['dropdown-list'], opt);
            _this.controls['dropdown-list'].on('change', function (event) {
                var command = _this.createSetParameterValueCommand('dropdown-list', event.args.item.value);
                _this.executeCommand(command);
            });
        }, {mandatory: true});
    };
     
    CustomProperties.prototype.renderDropdownListControl = function ($parent) {
        var _this = this;
        var val = _this.options.fnUnit['param']['dropdown-list'];
        _this.$elements['dropdown-list'].val(val);
    };
     
    //================================================================================
    // Radio Button 컨트롤 생성
    //  radion button 갯수 만큼 elements, container에 추가. (template은 2개만 추가)
    //  {mandatory: true} : 필수항목 설정. 화면에서 라벨명옆에 '*' 가 표시된다.
    //================================================================================
    CustomProperties.prototype.createRadioButtonControl = function ($parent) {
        var _this = this;
        _this.$elements['radio-button.value1'] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">Label1</div>');
        _this.$elements['radio-button.label2'] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">Label2</div>');
        _this.addPropertyControl('Choice value', function ($container) {
     
            $container.append(_this.$elements['radio-button.value1']);
            _this.controls['radio-button.value1'] = _this.createRadioButton(_this.$elements['radio-button.value1'], {width: 'undefined', groupName: 'radio-button'});
            _this.$elements['radio-button.value1'].on('checked', function (event) {
                var command = _this.createSetParameterValueCommand('radio-button', 'value1');
                _this.executeCommand(command);
            });
     
            $container.append(_this.$elements['radio-button.label2']);
            _this.controls['radio-button.label2'] = _this.createRadioButton(_this.$elements['radio-button.label2'], {width: 'undefined', groupName: 'radio-button'});
            _this.$elements['radio-button.label2'].on('checked', function (event) {
                var command = _this.createSetParameterValueCommand('radio-button', 'label2');
                _this.executeCommand(command);
            });
     
        }, {mandatory: true});
    };
     
    CustomProperties.prototype.renderRadioButtonControl = function ($parent) {
        var _this = this;
        var val = _this.options.fnUnit['param']['radio-button'];
        var key = 'radio-button.' + val;
        if (_this.$elements[key]) {
            _this.$elements[key].jqxRadioButton('check');
        }
    };
     
    //================================================================================
    // Check Box 컨트롤 생성
    //  items 항목에 label, value값을 설정한다. 설정한 갯수만큼 화면에 표시된다.
    //  {mandatory: true} : 필수항목 설정. 화면에서 라벨명옆에 '*' 가 표시된다.
    //================================================================================
    CustomProperties.prototype.createCheckBoxControl = function ($parent) {
        var _this = this;
        _this.$elements['check-box'] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox-container"></div>');
        var $selectAllButton = $('<input type="button" value="Select All" style="width: 100%; float:left; margin-left: 0px;"/>');
        var $clearAllButton = $('<input type="button" value="Unselect All" style="width: 100%; float:left; margin-left: 2px; margin-bottom: 2px;"/>');
        _this.$elements['check-box'].append($selectAllButton);
        _this.$elements['check-box'].append($clearAllButton);
        _this.addPropertyControl('Check Value', function ($container) {
            $container.append(_this.$elements['check-box']);
            _this.createButton($selectAllButton, {height: 23}, 'brtc-va-editors-sheet-controls-width-6');
            _this.createButton($clearAllButton, {height: 23}, 'brtc-va-editors-sheet-controls-width-6');
    
            var items = [{"label":"Label1","value":"value1","default":true},{"label":"Label2","value":"value2","default":true},{"label":"Label3","value":"value3","default":false}];
            var itemKey;
            var changeHandler = function () {
                $(window).trigger('mousedown');
                var checked = [];
                for (var i in items) {
                    itemKey = 'check-box.' + items[i].value;
                    if (_this.$elements[itemKey].val() === true) {
                        checked.push(_this.$elements[itemKey].data('tag'));
                    }
                }
                var command = _this.createSetParameterValueCommand('check-box', checked);
                _this.executeCommand(command);
            };
            for (var i in items) {
                itemKey = 'check-box.' + items[i].value;
                _this.$elements[itemKey] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox"></div>');
                _this.$elements[itemKey].text(items[i].label);
                _this.$elements[itemKey].data('tag', items[i].value);
                _this.$elements['check-box'].append(_this.$elements[itemKey]);
                _this.controls[itemKey] = _this.createCheckBox(_this.$elements[itemKey], {}, 'brtc-va-editors-sheet-controls-width-12')
                _this.$elements[itemKey].on('change', changeHandler);
            }
            $selectAllButton.on('click', function (event) {
                for (var i in items) {
                    itemKey = 'check-box.' + items[i].value;
                    _this.$elements[itemKey].off('change', changeHandler);
                    _this.$elements[itemKey].jqxCheckBox({checked: true});
                    _this.$elements[itemKey].on('change', changeHandler);
                }
                var checked = [];
                for (var i in items) {
                    itemKey = 'check-box.' + items[i].value;
                    checked.push(_this.$elements[itemKey].data('tag'));
                }
                var command = _this.createSetParameterValueCommand('check-box', checked);
                _this.executeCommand(command);
            });
            $clearAllButton.on('click', function (event) {
                for (var i in items) {
                    itemKey = 'check-box.' + items[i].value;
                    _this.$elements[itemKey].off('change', changeHandler);
                    _this.$elements[itemKey].jqxCheckBox({checked: false});
                    _this.$elements[itemKey].on('change', changeHandler);
                }
                var checked = [];
                var command = _this.createSetParameterValueCommand('check-box', checked);
                _this.executeCommand(command);
            });
        }, {mandatory: false});
    };
     
    CustomProperties.prototype.renderCheckBoxControl = function ($parent) {
        var _this = this;
        var values = _this.options.fnUnit['param']['check-box'];
        var items = [{"label":"Label1","value":"value1","default":true},{"label":"Label2","value":"value2","default":true},{"label":"Label3","value":"value3","default":false}];
        var itemKey;
        for (var i in items) {
            itemKey = 'check-box.' + items[i].value;
            if ($.inArray(_this.$elements[itemKey].data('tag'), values) > -1) {
                _this.$elements[itemKey].jqxCheckBox({checked: true});
            } else {
                _this.$elements[itemKey].jqxCheckBox({checked: false});
            }
        }
    };
     
    //================================================================================
    // Input Box 컨트롤 생성 ( Number type)
    //  {mandatory: true} : 필수항목 설정. 화면에서 라벨명옆에 '*' 가 표시된다.
    //================================================================================
    CustomProperties.prototype.createInputBoxNumberControl = function ($parent) {
        var _this = this;
        _this.$elements['input-box-number'] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        _this.addPropertyControl('Input Number', function ($container) {
            $container.append(_this.$elements['input-box-number']);
            var opt = {"placeholder":"Input Value (Number)","numberType":"int"};
            _this.controls['input-box-number'] = _this.createNumericInput(_this.$elements['input-box-number'], opt);
            _this.controls['input-box-number'].onChange(function () {
                var command = _this.createSetParameterValueCommand('input-box-number', this.getValue());
                _this.executeCommand(command);
            });
        }, {mandatory: true});
    };
     
    CustomProperties.prototype.renderInputBoxNumberControl = function ($parent) {
        var _this = this;
        var val = _this.options.fnUnit['param']['input-box-number'];
        _this.controls['input-box-number'].setValue(val || '');
    };
    
    //================================================================================
    // Input Box 컨트롤 생성 ( String type)
    // {mandatory: true} : 필수항목 설정. 화면에서 라벨명옆에 '*' 가 표시된다.
    //================================================================================
    CustomProperties.prototype.createInputBoxStringControl = function ($parent) {
        var _this = this;
        _this.$elements['input-box-string'] = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        _this.addPropertyControl('Input String', function ($container) {
            $container.append(_this.$elements['input-box-string']);
            var opt = {"placeHolder":"Input Value (String)"};
            _this.controls['input-box-string'] = _this.createInput(_this.$elements['input-box-string'], opt);
            _this.$elements['input-box-string'].on('change', function (event) {
                if (!_this.isInputValueChanged('input-box-string', $(this).val())) return;
                var command = _this.createSetParameterValueCommand('input-box-string', $(this).val());
                _this.executeCommand(command);
            });
        }, {mandatory: true});
    };
     
    CustomProperties.prototype.renderInputBoxStringControl = function ($parent) {
        var _this = this;
        var val = _this.options.fnUnit['param']['input-box-string'];
        _this.$elements['input-box-string'].val(val || '');
    };
     
    CustomProperties.prototype.renderValidation = function () {
        var _this = this;
        for (var i in _this.problems) {
            var key = _this.problems[i].param;
            if (_this.$elements[key]) {
                _this.createValidationContent(_this.$elements[key], _this.problems[i]);
            }
        }
    };
     
    //================================================================================
    // Columns 컨트롤에서 선택할 수 있는 칼럼 Type을 지정한다.
    //  getColumnsOfInTable 함수 호출시 Array에 설정한 Type과 일치하는 칼럼만 보여짐
    //  빈배열을 넘기면, 모든 Type을 선택할 수 있다.
    //================================================================================
    CustomProperties.prototype.fillControlValues = function () {
        var _this = this;
        var columns;
        
        columns = _this.getColumnsOfInTable(0, ["Integer","Long","Double","String","Boolean","number"]); // 선택할 type 지정시
        // columns = _this.getColumnsOfInTable(0, []); // 전체
        _this.controls['columns'].setItems(columns);
    };
     
    Brightics.VA.Core.Functions.Library['custom'].propertiesPanel = CustomProperties;
    
    /**************************************************************************
     *                               Validator                                 
     *************************************************************************/
    /**
     * 각 컨트롤의 value에 대한 Validator를 생성한다.
     * template에서는 Columns, Input Box의 필수입력에 대한 기본 validator만 제공함.
     * 필요에 따라 기본 validator를 참조하여 생성하여 사용.
     */
    function CustomValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }
    
    CustomValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    CustomValidator.prototype.constructor = CustomValidator;
    
    CustomValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
    
        this.addColumnsRule();
        this.addInputBoxNumberRule();
        this.addInputBoxStringRule();
    };
    
    CustomValidator.prototype.addColumnsRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            return _this.checkColumnIsEmpty(fnUnit, 'columns', fnUnit.param['columns'], 'Columns');
        });
        this.addRule(function (fnUnit) {
            return _this.checkColumnExists(fnUnit, 'columns', fnUnit.param['columns']);
        });
        this.addRule(function (fnUnit) {
            return _this.checkColumnType(fnUnit, 'columns', fnUnit.param['columns'], ["Integer","Long","Double","String","Boolean","number"]);
        });
    };
     
    CustomValidator.prototype.addInputBoxNumberRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var msg = {
                errorCode: 'BR-0033',
                param: 'input-box-number',
                messageParam: ['Input Number']
            };
            return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param['input-box-number']);
        });
    };
     
    CustomValidator.prototype.addInputBoxStringRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var msg = {
                errorCode: 'BR-0033',
                param: 'input-box-string',
                messageParam: ['Input String']
            };
            return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param['input-box-string']);
        });
    };
     
    Brightics.VA.Core.Functions.Library.custom.validator = CustomValidator;
    
}).call(this);