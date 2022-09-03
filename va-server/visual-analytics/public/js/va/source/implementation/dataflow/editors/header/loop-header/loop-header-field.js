/* -----------------------------------------------------
 *  loop-header-field.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-19.
 * ----------------------------------------------------*/

/* global _ crel CodeMirror */

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var ClassUtils = this.__module__.ClassUtils;
    var EventEmitter = this.__module__.EventEmitter;

    var CLASS_NAME = {
        HEADER_FIELD: 'brtc-loop-header-field',
        LOOP_CONDITION_WRAPPER: 'brtc-loop-header-loop-condition',
        LABEL_INPUT_PAIR_WRAPPER: 'brtc-loop-header-label-input-pair-wrapper',
        READONLY_LABEL: 'brtc-loop-header-readonly-label',
        READONLY_INPUT: 'brtc-loop-header-readonly-input',
        READONLY_LABEL_INPUT_PAIR_WRAPPER: 'brtc-loop-header-readonly-label-input-pair-wrapper',
        EXPAND: 'brtc-loop-header-expand',
        LABEL_DIV: 'brtc-loop-header-label-div',
        FLEX_VERTICAL_CENTER: 'brtc-style-display-flex brtc-style-align-items-center'
    };

    var LOOP_PROPERTY = 'prop';
    var LOOP_TYPE = 'type';
    var TYPE_CHANGE = 'type-change';
    var INPUT_CHANGE = 'input-change';

    var keys = {
        forLoop: [
            'count',
            'collection'
        ],
        whileLoop: [
            'while'
        ]
    };

    function LoopHeaderField($parent) {
        var _this = this;
        this.$parent = $parent;
        this.loopType = '';
        this.valueMap = {};
        this.$wrapper = {};
        this.$radio = {};
        this.$input = {};

        this.isExpanded = true;
        this.$expand = $(crel('div', {class: CLASS_NAME.EXPAND}));
        this.$expandArrow = $(crel('i',
            {
                class: 'fa fa-chevron-up brtc-loop-header-expand-arrow',
                'aria-hidden': 'true'
            }));
        this.$expand.append(this.$expandArrow);
        this.$expand.click(function () {
            _this.isExpanded = !_this.isExpanded;
            _this.render();
        });

        this.$radioArea =
            $(crel('div', {class: CLASS_NAME.LABEL_INPUT_PAIR_WRAPPER},
                crel('div', {class: CLASS_NAME.LABEL_DIV}, 'Loop Type',
                    crel('div', {
                        class: 'brtc-va-editors-sheet-controls-propertycontrol-mandatory'
                    }, '*')
                ),
                crel('div', {class: CLASS_NAME.FLEX_VERTICAL_CENTER},
                    this._createRadioButton('Count', 'count'),
                    this._createRadioButton('Collection', 'collection'),
                    this._createRadioButton('While', 'while')
                )
            ));


        this.$expandedDiv = $(crel('div', {class: 'brtc-loop-header-expanded'},
            this.$radioArea[0]
        ));

        this.$unexpandedDiv = $(crel('div', {class: 'brtc-loop-header-unexpanded'}));

        this.$el = $(
            crel('div', {class: CLASS_NAME.HEADER_FIELD},
                this.$expand[0],
                this.$expandedDiv[0],
                this.$unexpandedDiv[0]
            )
        );

        this.$wrapper.count = $(
            crel('div',
                this._createLabelInputPair('Start',
                    'brtc-loop-header-count-start', 'start', true, 'count', true),
                this._createLabelInputPair('End',
                    'brtc-loop-header-count-end', 'end', true, 'count', true),
                this._createLabelInputPair('Index Variable',
                    'brtc-loop-header-count-index-variable', 'index-variable', false, 'count')
            )
        );

        this.$wrapper.collection = $(
            crel('div',
                this._createLabelInputPair('Collection',
                    'brtc-loop-header-collection-collection',
                    'collection', true, 'collection', true),
                this._createLabelInputPair('Element Variable',
                    'brtc-loop-header-collection-element-variable', 'element-variable',
                    false, 'collection'),
                this._createLabelInputPair('Index Variable',
                    'brtc-loop-header-collection-index-variable', 'index-variable',
                    false, 'collection')
            )
        );

        this.$wrapper.while = $(
            crel('div',
                this._createLabelInputPair('Expression',
                    'brtc-loop-header-while-expression',
                    'expression', true, 'while', true),
                this._createLabelInputPair('Index Variable',
                    'brtc-loop-header-while-index-variable', 'index-variable', false, 'while')
            )
        );

        _.forIn(this.$wrapper, function ($wrp) {
            this.$expandedDiv.append($wrp);
        }.bind(this));
        this.$parent.append(this.$el);

        this.changeLayout();
    }

    ClassUtils.inherits(LoopHeaderField, EventEmitter);

    LoopHeaderField.prototype.setData = function (fnUnit) {
        var _this = this;
        this.fnUnit = fnUnit;
        var props = fnUnit.param;
        this.props = props;
        this.loopType = props[LOOP_TYPE];
        this.valueMap = {};
        _.forIn(props[LOOP_PROPERTY], function (val, key) {
            _this.valueMap[_this.getKey(_this.loopType, key)] = val;
        });
        this.changeLayout();
    };

    LoopHeaderField.prototype.changeLayout = function () {
        var _this = this;
        _.forIn(this.$radio, function ($r) {
            $r.hide();
        });

        _.forIn(this.$wrapper, function ($w) {
            $w.hide();
        });

        var type = this.getLoopFunc();
        var cnt = 0;
        _.forEach(keys[type], function (loopType) {
            _this.$radio[loopType].show();
            _this.$wrapper[loopType].show();
            ++cnt;
        });

        if (cnt === 1) {
            _this.$radioArea.hide();
        } else {
            _this.$radioArea.show();
        }
        this.refresh();
    };

    LoopHeaderField.prototype.render = function (init) {
        var _this = this;
        this.$radio[this.loopType].jqxRadioButton({
            checked: true
        });

        this._showWrapper(this.loopType);
        _.forIn(this.props[LOOP_PROPERTY], function (val, key) {
            var conKey = _this.getKey(_this.loopType, key);
            if (_.has(_this.$input, conKey)) {
                _this.$input[conKey].setValue(val);
            }
        });

        if (this.isExpanded) {
            this.$expandedDiv.show();
            this.$unexpandedDiv.hide();
            this.$expandArrow.removeClass('fa-chevron-down');
            this.$expandArrow.addClass('fa-chevron-up');
        } else {
            this.$unexpandedDiv.empty();
            var template = {
                'count': {
                    label: 'Count',
                    props: [
                        {label: 'Start', key: 'start', exp: true},
                        {label: 'End', key: 'end', exp: true},
                        {label: 'Index Variable', key: 'index-variable', exp: false}
                    ]
                },
                'collection': {
                    label: 'Collection',
                    props: [
                        {label: 'Collection', key: 'collection', exp: true},
                        {label: 'Element Variable', key: 'element-variable', exp: false},
                        {label: 'Index Variable', key: 'index-variable', exp: false}
                    ]
                },
                'while': {
                    label: 'While',
                    props: [
                        {label: 'Expression', key: 'expression', exp: true},
                        {label: 'Index Variable', key: 'index-variable', exp: false}
                    ]
                }
            };

            var prop = this.loopType;
            var arr = [
                _this._createLabelInputPairReadOnly('Loop Type', template[prop].label)
            ];

            arr = arr.concat(_.map(template[prop].props, function (prop) {
                return _this._createLabelInputPairReadOnly(prop.label,
                    _this.props.prop[prop.key], prop.exp);
            }));
            this.$unexpandedDiv.append(arr);
            this.$expandedDiv.hide();
            this.$unexpandedDiv.show();
            this.$expandArrow.removeClass('fa-chevron-up');
            this.$expandArrow.addClass('fa-chevron-down');
        }
        this.refresh();
    };

    LoopHeaderField.prototype.createCodeMirrorInput = function ($input, options, callback, wrap) {
        var _this = this;
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
                    var strippedValue = (function (_val, strip) {
                        var val = _val || '';
                        if (strip && _this.test(val)) {
                            return val.substring(3, val.length - 1);
                        }
                        return val;
                    }(val, isWrap));
                    cm.setValue(strippedValue);
                    callback(wrappedCodeMirror.getValue());
                },
                getValue: function () {
                    var val = cm.getValue();
                    if (isWrap) {
                        return '${=' + val + '}';
                    }
                    return val;
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

    LoopHeaderField.prototype._createLabelInputPairReadOnly = function (label, _value, strip) {
        var value = _value || '';
        if (strip && this.test(value)) {
            value = value.substring(3, value.length - 1);
        }
        var $input = $(crel('input', {
            class: CLASS_NAME.READONLY_INPUT,
            value: value,
            title: value
        })).jqxInput({
            theme: Brightics.VA.Env.Theme,
            readOnly: true
        });

        var el = crel('div', {class: CLASS_NAME.READONLY_LABEL_INPUT_PAIR_WRAPPER},
            crel('label', {class: CLASS_NAME.READONLY_LABEL}, label),
            $input[0]
            // value
        );
        return el;
    };

    LoopHeaderField.prototype._createLabelInputPair = function (label,
            className, key, isExp, type, isMandatory) {
        var placeHolder = isExp ? 'Enter Expression' : 'Enter Variable';
        var width = isExp ? '100%' : '97%';
        var defaultClassName = 'brtc-va-widget-contents-input-control';
        var $input = $(crel('textarea', {class: className + ' ' + defaultClassName}));
        var _this = this;

        var el =
            crel('div', {class: CLASS_NAME.LABEL_INPUT_PAIR_WRAPPER},
                crel('div', {class: CLASS_NAME.LABEL_DIV}, label, isMandatory ?
                    crel('div', {
                        class: 'brtc-va-editors-sheet-controls-propertycontrol-mandatory'
                    }, '*') : ''),
                crel('span', $input[0])
            );

            // <div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>   <div class="brtc-va-editors-sheet-panels-validation-tooltip">'Start' is a required parameter.</div></div>

        var $validation = $(crel('div', {class: 'brtc-va-editors-sheet-panels-validation-tooltip-wrapper'},
            crel('i', {class: 'fa fa-exclamation-triangle', 'aria-hidden': 'true'}),
            crel('div', {class: 'brtc-va-editors-sheet-panels-validation-tooltip'},
                '\'' + label + '\' is required parameter.')
        ));


        this.$input[_this.getKey(type, key)] = this.createCodeMirrorInput($input,
            {
                placeholder: placeHolder,
                width: width,
                height: '25px'
            },
            function (val) {
                var newVal = val;
                var x = isExp ? _this.strip(newVal) : newVal;
                if (_.trim(x) === '' && isMandatory) {
                    $(el).after($validation);
                    $validation.show();
                } else {
                    $(el).after($validation);
                    $validation.hide();
                }
                if (newVal === (_this.valueMap[_this.getKey(type, key)] || '')) return;
                _this.valueMap[_this.getKey(type, key)] = newVal;
                _this.emit(INPUT_CHANGE, {
                    value: newVal,
                    path: [LOOP_PROPERTY, key]
                });
            }, isExp);

        return el;
    };

    LoopHeaderField.prototype._createRadioButton = function (label, key) {
        var _this = this;
        this.$radio[key] = $(crel('div',
            {class: 'brtc-loop-header-field-radiobutton'},
            label))
            .jqxRadioButton({
                theme: Brightics.VA.Env.Theme,
                groupName: LOOP_TYPE
            });

        this.$radio[key].bind('checked', function (evt) {
            if (_this.loopType === key) return;
            _this._showWrapper(key);
            _this.valueMap = {};
            _this.loopType = key;
            _.forIn(_this.$input, function ($inp) {
                $inp.setValue('');
            });
            _this.emit(TYPE_CHANGE, key);
        });
        return this.$radio[key][0];
    };

    LoopHeaderField.prototype._showWrapper = function (key) {
        _.forIn(this.$wrapper, function ($wrp) {
            $wrp.hide();
        });
        this.$wrapper[key].show();
        this.refresh();
    };

    LoopHeaderField.prototype.getLoopFunc = function () {
        return this.fnUnit ? this.fnUnit.func : 'forLoop';
    };

    LoopHeaderField.prototype.refresh = function () {
        var _this = this;
        var loopType = this.loopType;
        if (this.props) {
            _.forIn(this.props[LOOP_PROPERTY], function (val, key) {
                var conKey = _this.getKey(loopType, key);
                if (_.has(_this.$input, conKey)) {
                    _this.$input[conKey].refresh();
                }
            });
        }
    };

    LoopHeaderField.prototype.getKey = function (loopType, prop) {
        return loopType + '_' + prop;
    };

    LoopHeaderField.prototype.test = function (val) {
        return _.startsWith(val, '${=') && _.endsWith(val, '}');
    };

    LoopHeaderField.prototype.strip = function (_val) {
        var val = _val || '';
        if (this.test(val)) return val.substring(3, val.length - 1);
        return val;
    };


    Brightics.VA.Implementation.DataFlow.Editors.Header.LoopHeaderField = LoopHeaderField;
    /* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
