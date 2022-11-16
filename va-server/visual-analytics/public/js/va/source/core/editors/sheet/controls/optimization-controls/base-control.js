/**
 * Created by sds on 2018-02-06.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BaseControl(caller, options) {
        this.caller = caller;
        this.options = options || {};
        this.init();
        this.createControl();
    }

    BaseControl.prototype.init = function () {
        this.controls = {};
    };

    BaseControl.prototype.registerSpec = function (paramInfo) {
        var _this = this;
        this.PARAM_INFO = {};
        paramInfo.forEach(function (paramObj) {
            _this.PARAM_INFO[paramObj.Key] = {
                Label: paramObj.Label,
                Default: paramObj.Default || ''
            };

            if (paramObj.Source) {
                _this.PARAM_INFO[paramObj.Key].Source = paramObj.Source
            }
            if (paramObj.NumberType) {
                _this.PARAM_INFO[paramObj.Key].NumberType = paramObj.NumberType
            }

        });
    };

    BaseControl.prototype.createControl = function () {
    };

    BaseControl.prototype.renderControl = function () {
        var settingVal = this.Default;
        if (this.options.value) {
            settingVal = this.options.value;
        }
        this.controls[this.CONTROL_KEY].setValue(settingVal);
    };

    BaseControl.prototype.getSection = function (section) {
        //default : center
        if (section == 'left') {
            return this.caller.$leftArea
        } else if (section == 'right') {
            return this.caller.$rightArea
        } else {
            return this.caller.$contentsArea
        }
    };

    BaseControl.prototype.getValue = function () {
        var result = {};
        result[this.CONTROL_KEY] = this.controls[this.CONTROL_KEY].getValue();
        return result;
    };

    BaseControl.prototype.bindValidation = function (ctrlInfo) {
        var _this = this;
        if (typeof ctrlInfo.$target == 'undefined') {
            return;
        }
        if (ctrlInfo.mandatory || this.options.isMandatory) {
            this.checkValidation(ctrlInfo);
            ctrlInfo.$target.on('change', function (event) {
                _this.checkValidation(ctrlInfo)
            })
        }
    };

    BaseControl.prototype.checkValidation = function (ctrlInfo) {
        this.removeValidation(ctrlInfo.$target);
        if (ctrlInfo.control &&
            (!ctrlInfo.control.getValue() || $.isEmptyObject(ctrlInfo.control.getValue()))) {
            var errObj = {
                $target: ctrlInfo.$target,
                message: this.caller.problemFactory.makeMessage({
                    errorCode: 'BR-0033',
                    param: ctrlInfo.$target,
                    messageParam: [ctrlInfo.label]
                })
            };
            this.createValidationContent(errObj)
        }
    };

    BaseControl.prototype.removeValidation = function ($target) {
        $target.find('.brtc-va-editors-opt-validation-tooltip-wrapper').remove();
        $target.removeClass('brtc-va-editors-opt-validation-error');
    };

    BaseControl.prototype.createValidationContent = function (problemData) {
        var $problemContent = $('<div class="brtc-va-editors-opt-validation-tooltip-wrapper">' +
            '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' +
            '   <div class="brtc-va-editors-opt-validation-tooltip">' + problemData.message + '</div>' +
            '</div>');
        problemData.$target.append($problemContent);
        problemData.$target.addClass('brtc-va-editors-opt-validation-error');
        $problemContent.show();
    };

    /*
     propertey utils
     */
    BaseControl.prototype.createDeckProperties = function ($parent, label, callback, option) {
        var $methodProperty = $('' +
            '<div class="deck-property">' +
            '    <div class="property-label"></div>' +
            '    <div class="property-control"></div>' +
            '</div>');
        $parent.append($methodProperty);

        $methodProperty.find('.property-label').text(label);

        if (typeof  callback === 'function') {
            callback.call(this, $methodProperty.find(".property-control"));
        }

        if (option.mandatory) {
            var $mandatory = '<div class="brtc-va-editors-sheet-controls-propertycontrol-mandatory">*</div>';
            $methodProperty.find('.property-label').append($mandatory);

            this.bindValidation({
                $target: $methodProperty.find(".property-control"),
                control: this._getControl(option),
                mandatory: true,
                label: label
            });
        }

        return $methodProperty;
    };

    BaseControl.prototype.getFilteredData = function () {
        var columnData = this.dataMap ? this.options.fnUnit['in-table'][0] ? this.dataMap[this.options.fnUnit['in-table'][0]].columns : [] : [];
        var numberData = $.grep(columnData, function (el) {
            return (el.internalType.toLowerCase() === 'double');
        });
        return numberData;
    };

    BaseControl.prototype.configureControls = function ($deckControl, paramName, selectedVal) {
    };

    BaseControl.prototype._setControl = function (target, source) {// options, controlIndex
        var CONTROL_KEY = this.CONTROL_KEY;
        var paramName = (target.options) ? target.options.attr : undefined;

        if (typeof paramName == 'undefined') {
            this.controls[CONTROL_KEY] = source;
        } else {
            if (target.options.control) {
                target.options.control[paramName] = source;
            } else if (typeof target.controlIndex != 'undefined') {
                this.controls[CONTROL_KEY][target.controlIndex][paramName] = source;
            } else {
                this.controls[CONTROL_KEY][paramName] = source;
            }
        }
    };

    BaseControl.prototype._getControl = function (targetOpt) {
        if (typeof targetOpt == 'undefined') {
            return;
        }
        var CONTROL_KEY = this.CONTROL_KEY;
        var paramName = targetOpt.attr;

        if (targetOpt.control) {
            return targetOpt.control[paramName]
        } else if (typeof targetOpt.controlIndex != 'undefined') {
            return this.controls[CONTROL_KEY][targetOpt.controlIndex][paramName]
        } else {
            return this.controls[CONTROL_KEY][paramName]
        }
    };

    /**
     * create Controls
     * @param $container
     * @param options
     */
    BaseControl.prototype.createRadioButtonControl = function ($container, options) {
        var _this = this, $elements = {};
        var source = options.source, CONTROL_KEY = this.CONTROL_KEY;
        var controlVal = function () {
            if (options.value && source.some(function (srcObj) {
                    return srcObj.value == options.value
                })) {
                return options.value;
            }
        }();
        var control = {};

        source.forEach(function (srcObj) {
            $elements[CONTROL_KEY + '.' + srcObj.value] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">' + srcObj.label + '</div>');
            $container.append($elements[CONTROL_KEY + '.' + srcObj.value]);
            control[CONTROL_KEY + '.' + srcObj.value] = _this.caller.createRadioButton($elements[CONTROL_KEY + '.' + srcObj.value], {
                disabled: options.disabled,
                groupName: CONTROL_KEY
            });

            control[CONTROL_KEY + '.' + srcObj.value].on('checked', function (event) {
                controlVal = srcObj.value;
                _this.configureControls($container, options.attr, controlVal);
            });
        });

        control.getValue = function () {
            if (options.getValue) {
                return options.getValue.call(this, controlVal);
            } else {
                return controlVal;
            }
        };
        control.setValue = function (value) {
            $elements[CONTROL_KEY + '.' + value].jqxRadioButton('check');
        };

        this._setControl({options: options}, control)
    };

    BaseControl.prototype.createTextAreaControl = function ($control, jqxOptions) {
        var _this = this;

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '264px',
            height: '75px'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxTextArea(options);
        return $control;
    };

    BaseControl.prototype.createNumberArrayControl = function ($container, options) {
        var _this = this;
        var CONTROL_KEY = this.CONTROL_KEY;
        var control = {};

        var $elements = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        $elements.attr('maxlength', 1000);
        $container.append($elements);
        control[CONTROL_KEY] = _this.caller.createInput($elements, {
            placeHolder: (options && options.placeHolder) ? options.placeHolder : 'ex) 0.4, 0.5'
        });

        control[CONTROL_KEY].setValue = function (value) {
            if (typeof value != 'undefined') {
                $elements.val(value.replace(/\[|\]/g, ''));
            }
        };
        control[CONTROL_KEY].getValue = function () {
            if ($elements.val()) {
                return '[' + $elements.val() + ']'
            }
        };

        if (this.options.isMandatory) {
            this.bindValidation({
                $target: $container,
                control: control[CONTROL_KEY],
                label: this.constructor.Label
            });
        }

        this._setControl({options: options}, control[CONTROL_KEY])
    };

    BaseControl.prototype.createInputControl = function ($container, options) {
        var _this = this;
        var CONTROL_KEY = this.CONTROL_KEY;
        var control = {};

        var $elements = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        if (options.maxLength > 0) {
            $elements.attr('maxlength', options.maxLength);
        }

        $container.append($elements);
        control[CONTROL_KEY] = this.caller.createInput($elements, {
            placeHolder: options.placeHolder || 'ex) 0.4, 0.5'
        });

        control[CONTROL_KEY].setValue = function (value) {
            $elements.val(value);
        };
        control[CONTROL_KEY].getValue = function () {
            return $elements.val();
        };

        this._setControl({options: options}, control[CONTROL_KEY])
    };

    BaseControl.prototype.createDropDownControl = function ($container, options) {
        var _this = this;
        var source = (options && options.source) ? options.source : [],
            CONTROL_KEY = this.CONTROL_KEY;
        var control = {};

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        $container.append($elements);
        var jqxOptions = {
            source: source,
            selectedIndex: 0
        };
        control[CONTROL_KEY] = _this.caller.createDropDownList($elements, jqxOptions);

        control[CONTROL_KEY].setValue = function (value) {
            if (typeof value != 'undefined') {
                this.jqxDropDownList('selectItem', value);
            }
        };
        control[CONTROL_KEY].getValue = function () {
            return this.jqxDropDownList('getSelectedItem').value;
        };

        this._setControl({options: options}, control[CONTROL_KEY])
    };

    /**
     * Create Deck Controls
     * @param $container
     * @param options
     * @param controlIndex
     */
    BaseControl.prototype.createDeckDropdownControl = function ($container, options, controlIndex) {
        var _this = this;
        var source = options.source, paramName = options.attr;
        var target = (options.target) ? options.target : {};
        var control;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        target[paramName] = this.createDeckProperties($container, this.PARAM_INFO[paramName].Label, function ($controlParent) {
            $controlParent.append($elements);
            var selectedIdx;
            if (!source) {
                source = _this.PARAM_INFO[paramName].Source || [];
            }
            if (source.length > 0) {
                selectedIdx = source.findIndex(function (elem) {
                    return elem.value == _this.PARAM_INFO[paramName].Default
                });
                selectedIdx = (selectedIdx > -1) ? selectedIdx : 0;
            }
            var controlOpt = {
                source: source,
                selectedIndex: selectedIdx || 0
            };
            control = _this.caller.createDropDownList($elements, controlOpt);
            _this._setControl({options: options, controlIndex: controlIndex}, control);

            control.setValue = function (value) {
                this.jqxDropDownList('selectItem', value);
            };
            control.getValue = function () {
                return this.jqxDropDownList('getSelectedItem').value;
            };

            _this.configureControls($container, paramName, control.getValue(), controlIndex);
            control.on('change', function (event) {
                _this.configureControls($container, paramName, event.args.item.value, controlIndex);
            });
        }, {
            mandatory: options.mandatory,
            controlIndex: controlIndex,
            attr: paramName
        });
    };

    BaseControl.prototype.createDeckInputControl = function ($container, options, controlIndex) {
        var _this = this;
        var paramName = options.attr;
        var target = (options.target) ? options.target : {};
        var control;

        var $elements = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        target[paramName] = this.createDeckProperties($container, this.PARAM_INFO[paramName].Label, function ($controlParent) {
            $controlParent.append($elements);
            var controlOpt = {
                placeHolder: _this.PARAM_INFO[paramName].Default
            };
            control = _this.caller.createInput($elements, controlOpt);
            _this._setControl({options: options, controlIndex: controlIndex}, control);

            control.setValue = function (value) {
                $elements.val(value);
            };
            control.getValue = function () {
                return $elements.val();
            };
        }, {
            mandatory: options.mandatory,
            controlIndex: controlIndex,
            attr: paramName
        });
    };

    BaseControl.prototype.createDeckNumberInputControl = function ($container, options, controlIndex) {
        var _this = this;
        var paramName = options.attr;
        var target = (options.target) ? options.target : {};
        var control;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        target[paramName] = this.createDeckProperties($container, _this.PARAM_INFO[paramName].Label, function ($controlParent) {
            $controlParent.append($elements);

            let controlOpt = (_this.CONTROL_KEY === 'constraints'  && paramName === 'min' && _this.PARAM_INFO[paramName].Default) ?
                {
                    placeholder: _this.PARAM_INFO[paramName].Default,
                    numberType: _this.PARAM_INFO[paramName].NumberType || 'int',
                    min: parseFloat(_this.PARAM_INFO[paramName].Default)
                }:
                {
                    placeholder: _this.PARAM_INFO[paramName].Default,
                    numberType: _this.PARAM_INFO[paramName].NumberType || 'int'
                };
            control = _this.caller.createNumberInput($elements, controlOpt);
            _this._setControl({options: options, controlIndex: controlIndex}, control);
        }, {
            mandatory: options.mandatory,
            controlIndex: controlIndex,
            attr: paramName,
            control: options.control
        });
    };

    BaseControl.prototype.configureScalingControls = function () {
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base = BaseControl;

}).call(this);