/**
 * Created by ng1123.kim on 2016-03-23.
 */
(function () {
    'use strict';

    var root = this; //
    var Brightics = root.Brightics;

    function NumericInput(parentId, options) {
        this.parentId = parentId;
        this.options = this.setOptions(options);
        this.value = "";

        this.retrieveParent();
        this.createControls();
        this.createFocusEvent();
        return this;
    }

    NumericInput.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    NumericInput.prototype.setOptions = function (options) {
        const INTEGER_MAX = '1073741824';  // 2^30
        const INTEGER_MIN = '-1073741824';
        // todo : 추후 double 정책 설정 후 결정
        const DOUBLE_MAX = '1073741824';
        const DOUBLE_MIN = '-1073741824';

        var defaultOption = {
            numberType: 'int', // int, double
            min: undefined,
            max: undefined,
            minus: true,
            placeholder: 'Enter value',
            enterCallback: function () {

            }
        };

        var inputOption = $.extend(true, defaultOption, options);

        // 최대, 최소값 설정
        if (inputOption.numberType == 'int') {
            inputOption.max = (inputOption.max) ? (inputOption.max) : (INTEGER_MAX);
            inputOption.min = (inputOption.min) ? (inputOption.min) : (INTEGER_MIN);
        }
        else if (inputOption.numberType == 'double') {
            inputOption.max = (inputOption.max) ? (inputOption.max) : (DOUBLE_MAX);
            inputOption.min = (inputOption.min) ? (inputOption.min) : (DOUBLE_MIN);
        }

        return inputOption;
    };

    NumericInput.prototype.createControls = function () {
        var className = [
            'brtc-va-editors-sheet-controls-numericInput'
        ].concat(this.options.className || []).join(' ');

        this.$mainControl = $('<input type="text" class="' + className + '" contenteditable>');


        this.$mainControl.attr('placeholder', this.options.placeholder);

        this.$parent.append(this.$mainControl);

        this.addKeyEventListener();
    };

    NumericInput.prototype.setValue = function (val) {
        this.$mainControl.val(val);
    };

    NumericInput.prototype.getValue = function () {
        return this.$mainControl.val();
    };

    NumericInput.prototype.setDisabled = function (disabled) {
        return this.$mainControl.prop("disabled", disabled);
    };

    NumericInput.prototype.onChange = function (callback) {
        this.callback = callback;
    };

    NumericInput.prototype.parseToNumber = function (value) {
        if (value === '') return value;
        else return (isNaN(value)) ? '' : Number(value);
    };


    NumericInput.prototype.createFocusEvent = function () {
        var _this = this;
        this.$mainControl.focus(function () {
            _this.preValue = _this.parseToNumber(_this.$mainControl.val());

        });
        this._OnNumericInputFocusOut = function () {
            var v = _this.$mainControl.val();

            if (+v || _this.isZero(v)) { // convert to number success, let it be
                //                      "1000"  "10.9"  "1,000.9"   "011"   "10c"   "$10"
                //+str, str*1, str-0    1000    10.9    NaN         11      NaN     NaN

                if (typeof _this.options.min !== 'undefined') {
                    if (+v < +_this.options.min) {
                        _this.$mainControl.val(_this.options.min);
                    }
                }
                if (typeof _this.options.max !== 'undefined') {
                    if (+v > +_this.options.max) {
                        _this.$mainControl.val(_this.options.max);
                    }
                }
            } else if (v === '' && _this.options.mandatory && typeof _this.options.min !== 'undefined') {
                _this.$mainControl.val(_this.options.min);
            }
        };
        this.$mainControl.focusout(function () {
            _this._OnNumericInputFocusOut();
            var value = _this.parseToNumber(_this.$mainControl.val());
            _this.$mainControl.val(value);
            if ((value !== _this.preValue && typeof _this.callback === 'function') || _this.options.checkValueChanged) {
                _this.callback(_this.$mainControl.val());
            }
        });
        $('svg').on('mousedown', function () {
            var value = _this.parseToNumber(_this.$mainControl.val());
            _this.$mainControl.val(value);
            if (value !== _this.preValue && typeof _this.callback === 'function' && _this.$mainControl.is(":focus")) {
                _this.callback(_this.$mainControl.val());
            }
        });
    };

    NumericInput.prototype.getControl = function () {
        return this.$mainControl;
    };

    NumericInput.prototype.addKeyEventListener = function () {
        var _this = this;

        this._OnNumericInputKeyDown = function (e) {
            //!important : 20150613 - max 값 처리에서 callback 실행이 되지 않는 버그가 있어서 주석 처리하였음. ex) max가 설정되어 있을 때 0을 계속입력하면 callback 실행이 되지 않음.
            //_this.preValue = _this.$mainControl.val();

            var key = e.which || e.keyCode; // http://keycode.info/

            if (key === 13) {
                _this.options.enterCallback(_this.getControl());
                e.preventDefault();
                return false;
            }

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // alphabet
                key >= 65 && key <= 90 ||
                // spacebar
                key == 32 ||
                // enter
                key == 13
            ) {
                e.preventDefault();
                return false;
            }

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers
                key >= 48 && key <= 57 ||
                // Numeric keypad
                key >= 96 && key <= 105 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (key == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (key == 88 && e.ctrlKey === true) ||

                // Allow: home, end, left, right
                (key >= 35 && key <= 39) ||
                // Backspace and Tab and Enter
                key == 8 || key == 9 ||
                // Del and Ins
                key == 46 || key == 45) {
                return true;
            }


            var v = _this.$mainControl.val(); // v can be null, in case textbox is number and does not valid
            if (
                //  minus, dash
            key == 109 || key == 189) {

                // if already has -, ignore the new one
                if (v[0] === '-' || !_this.options.minus
                ) {
                    return false;
                } else {
                    return true;
                }
            }

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // comma, period and dot on keypad
                key == 190 || key == 188 || key == 110) {
                // already having comma, period, dot
                if (/[\.,]/.test(v) || _this.options.numberType === 'int') {
                    return false;
                } else {
                    return true;
                }
            }

            return false;
        };

        this.$mainControl.keydown(this._OnNumericInputKeyDown);

        this._OnNumericInputKeyUp = function (e) {
            var v = _this.$mainControl.val();

            /*if (+v || _this.isZero(v)) { // convert to number success, let it be
                //                      "1000"  "10.9"  "1,000.9"   "011"   "10c"   "$10"
                //+str, str*1, str-0    1000    10.9    NaN         11      NaN     NaN

                if (typeof _this.options.min !== 'undefined') {
                    if (+v < +_this.options.min) {
                        _this.$mainControl.val(_this.options.min);
                    }
                }
                if (typeof _this.options.max !== 'undefined') {
                    if (+v > +_this.options.max) {
                        _this.$mainControl.val(_this.options.max);
                    }
                }
            } else */
            if (v) {
                // refine the value
                v = (v[0] === '-' ? '-' : '') + v.replace(/[^0-9\.]/g, ''); // this replace also remove the -, we add it again if needed
                v = v.replace(/\.(?=(.*)\.)+/g, '');  // remove all dot that have other dot following. After this processing, only the last dot is kept.

                _this.$mainControl.val(v); // update value only if we changed it
            } /*else if (v === '' && _this.options.mandatory && typeof _this.options.min !== 'undefined') {
                _this.$mainControl.val(_this.options.min);
            }*/
        };

        this.$mainControl.keyup(this._OnNumericInputKeyUp);
    };

    NumericInput.prototype.isZero = function (val) {
        return val != null && val != "" && +val === 0; // +undefined -> NaN, +NaN -> NaN
    };

    NumericInput.prototype.focus = function () {
        this.$mainControl.focus();
    };

    Brightics.VA.Core.Widget.Controls.NumericInput = NumericInput;

}).call(this);