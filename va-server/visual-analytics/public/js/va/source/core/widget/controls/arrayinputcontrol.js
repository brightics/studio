/**
 * Created by daewon.park on 2016-02-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     *  options = {
     *  type: 'number' or 'string'
     *
     */
    function ArrayInputControl(parentId, options) {
        this.parentId = parentId;
        this.initOptions(options);
        this.retrieveParent();
        this.createControls();
    }

    ArrayInputControl.prototype.initOptions = function (options) {
        this.options = options;
        this._isNumberType = this.options.type === 'number' ? true : false;
    };

    ArrayInputControl.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ArrayInputControl.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-widget-container">' +
            '   <div class="brtc-va-widget-contents"><div class="brtc-va-widget-contents-input-container-wrapper"></div></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$contentsArea = this.$mainControl.find('.brtc-va-widget-contents-input-container-wrapper');
        this.createArrayInputControl(this.$contentsArea);
    };


    ArrayInputControl.prototype.createArrayInputControl = function () {
        this.createInputControlLayout(0);
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar();
    };

    ArrayInputControl.prototype.createInputControlLayout = function (inputIndex) {
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

        $addDiv = $('<div class="brtc-va-widget-contents-input-control-add"></div>');
        $inputContainer.append($addDiv);

        $addDiv.click(function (event) {
            _this.handleAddInputControlEvent($(this).closest('.brtc-va-widget-contents-input-container'));
        });

        if (this._isNumberType) {
            this.createNumericInputControl($inputDiv);
        } else {
            this.createInputControl($inputDiv);
        }
    };

    ArrayInputControl.prototype.createNumericInputControl = function ($parent) {
        var _this = this;
        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            width: '100%',
            numberType: 'double',
            placeHolder: this.options.placeholder || 'Enter value',
            className: ['brtc-va-widget-contents-array-input-control']
        };
        var input = new Brightics.VA.Core.Widget.Controls.NumericInput($parent, options);
        input.onChange(function () {
            _this.triggerChangeInputValue();
        });
    };

    ArrayInputControl.prototype.createInputControl = function ($parent) {
        var _this = this;
        var $inputControl = $('<input type="text" class="brtc-va-widget-contents-array-input-control"/>');
        $parent.append($inputControl);
        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            width: '100%',
            placeHolder: this.options.placeholder || 'Enter value'
        };
        $inputControl.jqxInput(options);

        $inputControl.focusout(function (event) {
            _this.triggerChangeInputValue();
        });
    };


    ArrayInputControl.prototype.handleAddInputControlEvent = function ($target) {
        var index = $target.index();
        this.createInputControlLayout(index);
        this.triggerChangeInputValue();
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar('update');
        var parents = this.$mainControl.parents('.ps-container');
        if (parents && parents.length) parents.perfectScrollbar('update');
    };

    ArrayInputControl.prototype.handleDeleteButtonClick = function ($target) {
        $target.remove();
        this.triggerChangeInputValue();
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar('update');
        var parents = this.$mainControl.parents('.ps-container');
        if (parents && parents.length) parents.perfectScrollbar('update');
    };

    ArrayInputControl.prototype.triggerChangeInputValue = function (forced) {
        if (typeof this.options.onChangeCallback === 'function') {
            var _this = this;
            var value = _this.getInputValue();
            if (JSON.stringify(value) !== JSON.stringify(_this._preValue) || forced) {
                _this.options.onChangeCallback(value);
                _this._preValue = value;
            }
        }
    };


    ArrayInputControl.prototype.getInputValue = function () {
        var inputValue;
        var controls = this.$contentsArea.find('.brtc-va-widget-contents-array-input-control');

        inputValue = [];
        inputValue.length = controls.length;
        for (var i = 0; i < controls.length; i++) {
            var x = this.getValueByType($(controls[i]).val());
            inputValue[i] = x;
        }
        return inputValue;
    };

    ArrayInputControl.prototype.setValue = function (values) {
        this._preValue = values;
        var controls = this.$contentsArea.find('.brtc-va-widget-contents-array-input-control');
        var i;
        if (controls.length > values.length) {
            for (i = 0; i < controls.length; i++) {
                if (typeof values[i] !== 'undefined') {
                    $(controls[i]).val(this.getValueByType(values[i]));
                }
                if (i >= values.length && values.length !== 0) {
                    $(controls[i]).closest('.brtc-va-widget-contents-input-container').remove();
                }
            }
        } else {
            for (i = controls.length; i < values.length; i++) {
                this.createInputControlLayout(i, true);
            }
            controls = this.$contentsArea.find('.brtc-va-widget-contents-array-input-control');
            for (i = 0; i < controls.length; i++) {
                $(controls[i]).val(this.getValueByType(values[i]));
            }
        }
    };

    ArrayInputControl.prototype.toString = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return '';
        if (_.isNumber(val)) {
            if (_.isNaN(val)) return '';
            return val.toString();
        }
        return val;
    };

    ArrayInputControl.prototype.toNumber = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return null;
        return Number(this.toString(Number(val)));
    };

    ArrayInputControl.prototype.getValueByType = function (val) {
        if (this._isNumberType) return this.toNumber(val);
        return this.toString(val);
    };

    root.Brightics.VA.Core.Widget.Controls.ArrayInputControl = ArrayInputControl;
}).call(this);
