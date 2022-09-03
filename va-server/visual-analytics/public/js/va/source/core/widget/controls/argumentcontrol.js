/**
 * Created by daewon.park on 2016-02-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     *  options = {
     *  button: {
     *      visible: true,      //default : true
     *      disabled: false,     //default : false
     *      checked: true       //default : true
     *  },
     *  variable :{"$gv2": { "type": "literal", "value": ['a','b','c'], 'variable-type': 'array' } }
     *
     */

    var defaultOptions = {
        button: {
            visible: true,
            disabled: false,
            checked: true,
            on: {label: 'ON', value: 'on'},
            off: {label: 'OFF', value: 'off'}
        }
    };

    function ArgumentControl(parentId, options) {
        this.parentId = parentId;
        this.initOptions(options);
        this.retrieveParent();
        this.createControls();
        this.setInputValue();
    }

    ArgumentControl.prototype.initOptions = function (options) {
        this.options = $.extend(true, {}, defaultOptions, options);

        this.variableKey = Object.keys(this.options.variable)[0];
        this.inputType = this.options.variable[this.variableKey]['type'];
        this.variableType = this.options.variable[this.variableKey]['variable-type'];
        this.variableValue = this.options.variable[this.variableKey]['value'];
    };

    ArgumentControl.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ArgumentControl.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-widget-container">' +
            '   <div class ="brtc-va-widget-remove" />' +
            '   <div class="brtc-va-widget-header">' +
            '       <div class="brtc-va-widget-label">' + this.variableKey + '</div>' +
            '       <div class="brtc-va-widget-type-button-area"><div class="brtc-va-widget-type-switch-button"></div></div>' +
            '   </div>' +
            '   <div class="brtc-va-widget-contents"><div class="brtc-va-widget-contents-input-container-wrapper"></div></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);
        this.$mainControl.find('.brtc-va-widget-label').addClass(this.variableType);
        if (this.options.mandatory) this.$mainControl.find('.brtc-va-widget-label').addClass('mandatory');

        this.createTypeButtonControl();
        this.createContentsArea();

        this.$mainControl.find('.brtc-va-widget-remove').on('click', function () {
            if (typeof _this.options.onRemoveCallback === 'function') {
                _this.options.onRemoveCallback(_this.createFormattedValue());
                _this.$mainControl.remove();
            }
        });

        if (this.variableType === 'calculation') {
            this.$mainControl.find('.brtc-va-widget-type-button-area').hide();
            this.$mainControl.find('.brtc-va-widget-contents-input-control-container').addClass('read-only');
        }
    };

    ArgumentControl.prototype.createTypeButtonControl = function () {
        var _this = this;
        this.$btnArea = this.$mainControl.find('.brtc-va-widget-type-switch-button');
        if (!this.options.button.visible) return;
        var onLabel = this.options.button.on.label,
            onValue = this.options.button.on.value;

        var offLabel, offValue;
        if (this.isArrayValue()) {
            offLabel = 'Variable';
            offValue = 'expression';
        } else {
            offLabel = this.options.button.off.label;
            offValue = this.options.button.off.value;
        }

        this.$btnArea.jqxSwitchButton({
            height: '100%',
            width: '100px',
            thumbSize: '15%',
            onLabel: onLabel,
            offLabel: offLabel,
            checked: this.setSwitchButtonChecked()
        });

        this.inputType = this.$btnArea.val() ? onValue : offValue;

        this.$btnArea.on('change', function (event) {
            _this.variableValue = _this.getInputValue();
            _this.inputType = _this.$btnArea.val() ? onValue : offValue;
            _this.$contentsArea.empty();
            _this.createContentsArea();
            _this.setInputValue();
            _this.triggerChangeInputValue(true);
        });
    };

    ArgumentControl.prototype.setSwitchButtonChecked = function () {
        var buttonChecked, onValue = this.options.button.on.value;
        var offValue;
        if (this.isArrayValue()) offValue = 'expression';
        else offValue = this.options.button.off.value;

        if (this.inputType === onValue) {
            buttonChecked = true;
        } else if (this.inputType === offValue) {
            buttonChecked = false
        } else {
            this.inputType = this.options.button.checked ? onValue : offValue;
            buttonChecked = this.options.button.checked;
        }
        return buttonChecked;
    };

    ArgumentControl.prototype.isArrayValue = function () {
        return this.variableType === 'array' && this.options.button.visible;
    };

    ArgumentControl.prototype.createContentsArea = function () {
        this.$contentsArea = this.$mainControl.find('.brtc-va-widget-contents-input-container-wrapper');
        if (this.isArrayValue()) {
            if (this.inputType !== 'expression') this.createArrayInputControl();
            else {
                this.$contentsArea.append($('' +
                    '<div class="brtc-va-widget-contents-input-container">' +
                    '   <div class="brtc-va-widget-contents-input-control-container"></div>' +
                    '</div>'));
                this.createCodeInputControl(this.$contentsArea.find('.brtc-va-widget-contents-input-control-container'));
            }
        } else {
            this.createSingleInputControl();
        }
    };

    ArgumentControl.prototype.createArrayInputControl = function () {
        if (this.variableValue.length === 0) {
            this.createInputControlLayout(0, this.isArrayValue());
        } else {
            if (this.variableValue instanceof Array) {
                for (var i = 0; i < this.variableValue.length; i++) {
                    this.createInputControlLayout(i, this.isArrayValue());
                }
            } else {
                this.createInputControlLayout(0, this.isArrayValue());
            }
        }
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar();
    };

    ArgumentControl.prototype.createSingleInputControl = function () {
        this.createInputControlLayout(0, false);
    };

    ArgumentControl.prototype.createInputControlLayout = function (inputIndex, addable, focus) {
        var $parents = this.$contentsArea;
        var _this = this;
        var deletable = false;
        var $inputContainer = $('<div class="brtc-va-widget-contents-input-container"></div>');

        var $children = $parents.find('.brtc-va-widget-contents-input-container');

        if ($children.length === 0 || !$children[inputIndex]) {
            $parents.append($inputContainer);
        } else {
            $($children[inputIndex]).after($inputContainer);
            deletable = true;
        }

        var $inputDiv = $('<div class="brtc-va-widget-contents-input-control-container"></div>');
        var $addDiv, $deleteDiv;

        $inputContainer.append($inputDiv);

        if (inputIndex > 0 || deletable) {
            $deleteDiv = $('<div class="brtc-va-widget-contents-input-control-delete"></div>');
            $inputContainer.append($deleteDiv);

            $deleteDiv.click(function (event) {
                _this.handleDeleteButtonClick($(this).closest('.brtc-va-widget-contents-input-container'));
            })
        }

        if (addable) {
            $addDiv = $('<div class="brtc-va-widget-contents-input-control-add"></div>');
            $inputContainer.append($addDiv);

            $addDiv.click(function (event) {
                _this.handleAddInputControlEvent($(this).closest('.brtc-va-widget-contents-input-container'));
            })
        }

        if (this.isArrayValue())this.createInputControl($inputDiv, focus);
        else this.createCodeInputControl($inputDiv, focus);
    };

    ArgumentControl.prototype.createInputControl = function ($parent, focus) {
        var _this = this;
        var $inputControl = $('<input type="text" class="brtc-va-widget-contents-input-control"/>');
        $parent.append($inputControl);
        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            width: '100%',
            placeHolder: 'Enter value'
        };
        $inputControl.jqxInput(options);
        if (focus) $inputControl.jqxInput('focus');

        $inputControl.keydown(function (key) {
            if (key.keyCode == 13) {
                if (_this.isArrayValue()) {
                    _this.handleAddInputControlEvent($inputControl.closest('.brtc-va-widget-contents-input-container'), true);
                }
            }
        });
        $inputControl.focusout(function (event) {
            _this.triggerChangeInputValue();
        });
    };

    ArgumentControl.prototype.createCodeInputControl = function ($parent, focus) {
        var _this = this;
        var $inputControl = $('<textarea  class="brtc-va-widget-contents-input-control"/>');
        $parent.append($inputControl);
        var controlOptions = {
            mode: 'brtc-control',
            scrollbarStyle: 'null',
            placeholder: !this.options.button.visible ? 'Enter variable\tex. ${Variable1}' : this.inputType == 'calculation' ? 'Enter expression\tex. ${Variable1}+${Variable2}' : 'Enter value\tex. 1',
            lineWrapping: false,
            matchBrackets: false,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                "Tab": false, // Let focus go to next control
                "Shift-Tab": false // Let focus go to previous control
            },
            showTrailingSpace: true,
            hintOptions: {
                list: []
            },
            readOnly: this.variableType === 'calculation'
        };

        this.codeMirror = CodeMirror.fromTextArea($inputControl[0], controlOptions);
        var additionalOption = {
            'valid-message-position': this.options['valid-message-position'],
            'valid-type': this.options.button.visible ? ((this.isArrayValue && this.inputType === 'expression') ? 'type3' : '') : 'type3'
        };
        Brightics.VA.Core.Utils.WidgetUtils.changeCodeMirrorLineToSingle(this.codeMirror, additionalOption);
        this.codeMirror.on('blur', function (instance, event) {
            _this.triggerChangeInputValue();
        });
    };

    ArgumentControl.prototype.handleAddInputControlEvent = function ($target, focus) {
        var index = $target.index();
        this.createInputControlLayout(index, true, focus);
        this.triggerChangeInputValue();
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar('update');
        var parents = this.$mainControl.parents('.ps-container');
        if (parents && parents.length) parents.perfectScrollbar('update');
    };

    ArgumentControl.prototype.handleDeleteButtonClick = function ($target) {
        $target.remove();
        this.triggerChangeInputValue();
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar('update');
        var parents = this.$mainControl.parents('.ps-container');
        if (parents && parents.length) parents.perfectScrollbar('update');
    };

    ArgumentControl.prototype.triggerChangeInputValue = function (forced) {
        if (typeof this.options.onChangeCallback === 'function') {
            var _this = this;
            var value = _this.getInputValue();
            if (JSON.stringify(value) !== JSON.stringify(_this.variableValue) || forced) {
                _this.variableValue = value;
                _this.options.onChangeCallback(_this.createFormattedValue());
            }
        }
    };

    ArgumentControl.prototype.createFormattedValue = function () {
        return {
            'key': this.variableKey,
            'type': this.inputType,
            'variable-type': this.variableType,
            "value": this.variableValue
        };
    };

    ArgumentControl.prototype.getFormattedValue = function () {
        return {
            'key': this.variableKey,
            'type': this.inputType,
            'variable-type': this.variableType,
            "value": this.getInputValue()
        };
    };

    ArgumentControl.prototype.getInputValue = function () {
        var inputValue;
        var controls = this.$contentsArea.find('.brtc-va-widget-contents-input-control');

        if (this.isArrayValue() && this.inputType !== 'expression') {
            inputValue = [];
            for (var i = 0; i < controls.length; i++) {
                inputValue.push($(controls[i]).val());
            }
        } else {
            inputValue = this.codeMirror.getValue();
        }
        return inputValue;
    };

    ArgumentControl.prototype.setVariableType = function (variableType) {
        this.variableType = variableType;
        this.$contentsArea.empty();
        this.createContentsArea();
    };

    ArgumentControl.prototype.setInputValue = function (value) {
        if (typeof value !== 'undefined') this.variableValue = value;

        var controls = this.$contentsArea.find('.brtc-va-widget-contents-input-control');
        if (this.isArrayValue() && this.inputType !== 'expression') {
            if (!Array.isArray(this.variableValue)) {
                $(controls[0]).val(this.variableValue || '');
            } else {
                var i;
                if (controls.length > this.variableValue.length) {
                    for (i = 0; i < controls.length; i++) {
                        if (this.variableValue[i] === undefined) {
                            $(controls[i]).parents('.brtc-va-widget-contents-input-container').remove();
                        } else {
                            $(controls[i]).val(this.variableValue[i] || '');
                        }
                    }
                } else {
                    for (i = controls.length; i < this.variableValue.length; i++) {
                        this.createInputControlLayout(i, true);
                    }
                    controls = this.$contentsArea.find('.brtc-va-widget-contents-input-control');
                    for (i = 0; i < controls.length; i++) {
                        $(controls[i]).val(this.variableValue[i] || '');
                    }
                }
            }
        } else {
            if (Array.isArray(this.variableValue)) {
                this.codeMirror.setValue(this.variableValue[0]);
            } else {
                this.codeMirror.setValue(this.variableValue);
            }
        }
    };

    ArgumentControl.prototype.setRemovable = function (removable) {
        this.options.removable = removable;

        if (removable) this.$mainControl.find('.brtc-va-widget-remove').addClass('removable');
        else this.$mainControl.find('.brtc-va-widget-remove').removeClass('removable');
    };


    ArgumentControl.prototype.getOptions = function () {
        return this.options;
    };

    root.Brightics.VA.Core.Widget.Controls.ArgumentControl = ArgumentControl;

}).call(this);