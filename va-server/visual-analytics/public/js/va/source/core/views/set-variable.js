/**
 * Created by SDS on 2016-09-05.
 */

/* global _, CodeMirror */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var PREFIX = 'variable';
    var SUFFIX = '';

    var VARIABLE = 'variable';
    var NAME = 'name-control';
    var VALUE = 'value-control';

    function SetVariable(parentId, options) {
        Brightics.VA.Core.Views.Variable.call(this, parentId, options);
    }

    SetVariable.prototype = Object.create(Brightics.VA.Core.Views.Variable.prototype);
    SetVariable.prototype.constructor = SetVariable;

    SetVariable.prototype.init = function () {
        this.isRendered = false;
        this.propertyControls = [];
        this.index = 0;
        this.initTempDataStorage();
    };

    SetVariable.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-views-variable">' +
            '       <input type="button" class="brtc-va-tools-sidebar-variable-button brtc-style-col-12 add-variable-button" value="+ Add Variable"/>' +
            '       <div class="brtc-va-tools-sidebar-variable-list brtc-style-padding-0 brtc-style-padding-right-10">' +
            '           <div class="brtc-va-tools-sidebar-variable-list-wrapper brtc-style-height-full"></div>' +
            '       </div>' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.$variableList = this.$mainControl.find('.brtc-va-tools-sidebar-variable-list-wrapper');

        this.createAddVariableButton();

        // this.refresh();

        this.$variableList.perfectScrollbar();
        this.configureOptions();
    };

    SetVariable.prototype.createAddVariableButton = function () {
        var _this = this;
        this.$addVariableButton = this.$mainControl.find('.add-variable-button');
        this.$addVariableButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        this.$addVariableButton.click(function () {
            if (_this.$empty) _this.$empty.remove();

            var variableCount = _this.$variableList.find('.brtc-va-tools-sidebar-variable-deck').length;

            // var variable = { type: 'string', name: PREFIX + (variableCount+1), value: '' };
            var variable = {type: 'string', name: PREFIX + (variableCount + 1), param: {value: ''}};
            _this.createVariableControl(variable);
            _this.options.onAdd(variable);
            _this.$variableList.perfectScrollbar('update');
        });
    };

    SetVariable.prototype.renderEmptyControl = function () {
        this.$empty = $('' +
            '<div class="brtc-va-tools-sidebar-variable-deck">' +
            '   <div class="controls">' +
            '       <div class="control-row empty">There is no Variables</div>' +
            '   </div>' +
            '</div>');

        this.$variableList.append(this.$empty);
    };

    SetVariable.prototype.createVariableControl = function (variable, index) {
        this.isRendered = false;

        var _this = this;
        var $variable = $('' +
            '<div class="brtc-va-tools-sidebar-variable-deck">' +
            '   <div class ="brtc-va-tools-sidebar-variable-remove" />' +
            '   <div class="controls">' +
            '       <div class="control-row">' +
            '            <div class="brtc-va-editors-sheet-controls-wrapper brtc-va-tools-sidebar-variable-name">' +
            '                <textarea  class="brtc-va-widget-contents-input-control"/>' +
            '            </div>' +
            '       </div>' +
            '       <div class="control-row">' +
            '            <div class="brtc-va-tools-sidebar-variable-type"/>' +
            '       </div>' +
            '       <div>' +
            '            <div class="brtc-va-tools-sidebar-variable-value" />' +
            '       </div>' +
            '   </div>' +
            '</div>');

        var storageId = _.uniqueId('var-');
        var putData = _.partial(this.tempDataStorage.putDataById, storageId);
        var getData = _.partial(this.tempDataStorage.getDataById, storageId);

        this.$variableList.append($variable);
        this.tempDataStorage.push(storageId);


        putData(VARIABLE, variable);

        var $type = $variable.find('.brtc-va-tools-sidebar-variable-type');
        var $name = $variable.find('.brtc-va-widget-contents-input-control');
        var $value = $variable.find('.brtc-va-tools-sidebar-variable-value');
        var $remove = $variable.find('.brtc-va-tools-sidebar-variable-remove');

        this.createDropDownList($type, {
            source: this.getSource(),
            displayMember: 'label',
            valueMember: 'value'
        });
        $type.on('change', function (event) {
            var oldVariable = getData(VARIABLE);
            var newVariable = $.extend(true, {}, oldVariable);
            var type = $type.jqxDropDownList('val');
            getData(VALUE).setVariableType(type);

            newVariable.type = type;

            newVariable.param = {};

            if (type === 'cell') newVariable.param = {inData: '', rowIndex: '', column: ''};
            else newVariable.param.value = '';

            if (_this.isRendered) {
                _this.options.onChange(oldVariable, newVariable);

                putData(VARIABLE, newVariable);
            }
        });

        var codeMirrorName = CodeMirror.fromTextArea($name[0], {
            mode: 'brtc-controlflow-variable',
            scrollbarStyle: 'null',
            placeholder: '',
            lineWrapping: false,
            lineNumbers: false,
            viewportMargin: Infinity,
            // readOnly: (this.options.isFixedVariable)? 'nocursor' : 'false',
            hintOptions: {
                list: []
            },
            extraKeys: {
                'Tab': false, // Let focus go to next control
                'Shift-Tab': false // Let focus go to previous control
            }
        });

        Brightics.VA.Core.Utils.WidgetUtils.changeCodeMirrorLineToSingle(codeMirrorName, {'valid-type': 'type1'});
        codeMirrorName.on('blur', function (instance, event) {
            if (!_this.isRendered) return;

            var variable = getData(VARIABLE);
            var newName = _this.strip(instance.getValue());

            var exist = false;
            for (var i in _this.variables) {
                if (_this.variables[i].name == newName) {
                    exist = true;
                    break;
                }
            }

            if (variable.name !== newName) {
                if (exist) {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('The typed name already exists. Variable Name must be unique.');
                    _this.setVariableName(codeMirrorName, variable.name);
                } else {
                    var oldVariable = variable;
                    var newVariable = $.extend(true, {}, oldVariable);

                    newVariable.name = newName;
                    newVariable.param = {};
                    newVariable.param.value = variable.value;

                    _this.options.onChange(oldVariable, newVariable);

                    putData(VARIABLE, newVariable);
                }
            }
        });
        putData(NAME, codeMirrorName);

        var control = Brightics.VA.Core.Widget.Factory.variableControl($value, {
            fnUnit: this.options.fnUnit,
            variable: {
                temp: {
                    type: 'literal',
                    value: variable.value,
                    'variable-type': variable.type
                }
            },
            onChangeCallback: function (variableObj) {
                if (!_this.isRendered) return;
                var oldVariable = getData(VARIABLE);
                var newVariable = $.extend(true, {}, oldVariable);

                newVariable.type = variableObj['variable-type'];
                if (newVariable.type === 'cell') {
                    newVariable.param = variableObj['value'];
                } else {
                    newVariable.value = variableObj['value'];
                    newVariable.param = {};
                    newVariable.param.value = variableObj['value'];
                }

                _this.options.onChange(oldVariable, newVariable);

                putData(VARIABLE, newVariable);
            },
            'valid-type': 'type1'
        });
        putData(VALUE, control);

        $remove.click(function (event) {
            var variable = getData(VARIABLE);
            $variable.remove();
            _this.tempDataStorage.removeById(storageId);

            if (_this.$variableList.find('.brtc-va-tools-sidebar-variable-deck').length == 0) {
                _this.renderEmptyControl();
            }

            _this.options.onRemove(variable);
            _this.$variableList.perfectScrollbar('update');
            event.stopPropagation();
        });

        $type.val(variable.type);
        this.setVariableName(codeMirrorName, variable.name);
        control.setInputValue(variable.value);

        this.isRendered = true;
        return $variable;
    };

    SetVariable.prototype.renderValues = function (variables) {
        this.isRendered = false;

        this.empty();

        for (var i in variables) {
            this.createVariableControl(variables[i]);
        }

        if (variables.length === 0) this.renderEmptyControl();

        this.configureOptions();
        this.isRendered = true;
    };

    SetVariable.prototype.empty = function () {
        this.$variableList.empty();
    };

    SetVariable.prototype.configureOptions = function () {
        this.configureFixedVariable();
    };

    SetVariable.prototype.configureFixedVariable = function () {
        if (this.options.isFixedVariable) {
            this.$mainControl.find('input.add-variable-button').hide();
            this.$mainControl.find('.brtc-va-tools-sidebar-variable-remove').hide();
        }
    };

    SetVariable.prototype.getTargetByType = function (type, val) {
        var isArray = _.isArray(val);
        var toArray = ['array[string]', 'array[number]'].indexOf(type) >= 0;
        if (isArray && toArray) return val;
        if (!isArray && !toArray) return val;
        if (isArray && !toArray) return val[0];
        return [val];
    };

    SetVariable.prototype.getValueByType = function (type, val) {
        var VarUtils = this.getVarUtils();
        var defaultGetValue = function (val) {
            return val;
        };

        var getValue = {
            'calculation': VarUtils.wrap,
            'number': VarUtils.toNumber,
            'string': VarUtils.toString,
            'array[string]': function (val) {
                return _.map(val, VarUtils.toString);
            },
            'array[number]': function (val) {
                return _.map(val, VarUtils.toNumber);
            }
        };

        return (getValue[type] || defaultGetValue)(this.getTargetByType(type, val));
    };

    SetVariable.prototype.setValueByType = function (type, val) {
        var VarUtils = this.getVarUtils();
        var defaultSetValue = function (val) {
            return val;
        };
        var setValue = {
            'calculation': VarUtils.strip
        };

        return (setValue[type] || defaultSetValue)(val);
    };

    SetVariable.prototype.getVarUtils = function () {
        return Brightics.VA.Core.Utils.VariableUtils;
    };

    SetVariable.prototype.getSource = function () {
        var normal = [
            {
                label: 'String',
                value: 'string'
            },
            {
                label: 'Number',
                value: 'number'
            },
            {
                label: 'Array String Value',
                value: 'array[string]'
            },
            {
                label: 'Array Number Value',
                value: 'array[number]'
            },
            {
                label: 'Calculation Value',
                value: 'calculation'
            }
        ];

        var additional = [
            {
                label: 'Cell',
                value: 'cell'
            }
        ];

        if (this.options.isNormalType) {
            return normal;
        } else {
            return normal.concat(additional);
        }
    };


    Brightics.VA.Core.Views.SetVariable = SetVariable;

}).call(this);