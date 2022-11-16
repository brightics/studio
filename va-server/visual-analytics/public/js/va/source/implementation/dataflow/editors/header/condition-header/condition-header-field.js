/* -----------------------------------------------------
 *  condition-header-field.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-19.
 * ----------------------------------------------------*/

/* global crel _ */
(function () {
    'use strict';
    var Brightics = this.Brightics;
    var ClassUtils = this.__module__.ClassUtils;
    var EventEmitter = this.__module__.EventEmitter;
    var className = {
        field: 'brtc-condition-header-field',
        labelWrapper: 'brtc-condition-header-field-label-wrapper',
        textareaWrapper: 'brtc-condition-header-field-textarea-wrapper',
        textarea: 'brtc-condition-header-field-textarea',
        hide: 'brtc-condition-header-field-hide',
        textareaLabel: 'brtc-condition-header-field-textarea-label'
    };

    function ConditionHeaderField($parent, _options) {
        var options = _options || {};
        var _this = this;
        this.$parent = $parent;
        this.fieldContext = options.context;
        this.prvVal = this.fieldContext ? this.fieldContext.getField() : '${=}';
        this.$expandArrow =
            $(crel('i', {
                class: 'fa fa-chevron-down brtc-condition-header-field-expand-arrow',
                'aria-hidden': 'true'
            }));
        this.isExpanded = false;
        this.$expandArrow.click(function () {
            _this.isExpanded = !_this.isExpanded;
            _this.render();
        });

        this.$el = $(
            crel('div', { class: className.field },
                this.$expandArrow[0],
                crel('div', { class: className.labelWrapper },
                    crel('label', { class: className.textareaLabel }, 'Condition')
                ),
                crel('div', { class: className.textareaWrapper },
                    crel('textarea', { class: className.textarea })
                )
            )
        );

        this.$textArea = this.$el.find('.' + className.textarea);

        this.wrappedTextArea = this.createWrappedTextArea(this.$textArea);
        this.wrappedTextArea.change(function (val) {
            if (this.prvVal === val) return;
            this.prvVal = val;
            this.fieldContext.setField(val);
            this.emit('field-change', {
                id: this.fieldContext.getId(),
                type: this.fieldContext.getType(),
                field: val
            });
        }.bind(this));

        this.$parent.append(this.$el);
    }

    ClassUtils.inherits(ConditionHeaderField, EventEmitter);

    ConditionHeaderField.prototype.setContext = function (context) {
        this.fieldContext = context;
        return this;
    };

    ConditionHeaderField.prototype.getContext = function () {
        return this.fieldContext;
    };

    ConditionHeaderField.prototype.render = function () {
        this.wrappedTextArea.setValue(this.fieldContext ? this.fieldContext.getField() : '${=}');
        if (this.isExpanded) {
            this.$textArea.removeClass('brtc-condition-header-field-textarea-unexpanded');
            this.$el.addClass('brtc-condition-header-field-expanded');
            this.$expandArrow.removeClass('fa-chevron-down');
            this.$expandArrow.addClass('fa-chevron-up');
        } else {
            this.$textArea.addClass('brtc-condition-header-field-textarea-unexpanded');
            this.$el.removeClass('brtc-condition-header-field-expanded');
            this.$expandArrow.removeClass('fa-chevron-up');
            this.$expandArrow.addClass('fa-chevron-down');
        }
        this.wrappedTextArea.expand(this.isExpanded);
        this.wrappedTextArea.refresh();
    };

    ConditionHeaderField.prototype.show = function () {
        this.$el.removeClass(className.hide);
        this.wrappedTextArea.refresh();
    };

    ConditionHeaderField.prototype.hide = function () {
        this.$el.addClass(className.hide);
    };

    ConditionHeaderField.prototype.createWrappedTextArea = function ($textArea) {
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
        });

        var codeMirror = CodeMirror.fromTextArea($textArea[0], controlOptions);

        var wrappedCodeMirror = (function (cm) {
            return {
                setValue: function (val) {
                    var strippedVal = (function (_val) {
                        var val = _.isUndefined(_val) ? '' : _val;
                        if (_this.test(val)) {
                            return val.substring(3, val.length - 1);
                        }
                        return val;
                    }(val));
                    cm.setValue(strippedVal);
                    cm.refresh();
                },
                getValue: function () {
                    var val = cm.getValue();
                    return '${=' + val + '}';
                },
                change: function (callback) {
                    cm.on('blur', function (event) {
                        if (event.state.focused) {
                            callback(wrappedCodeMirror.getValue());
                        }
                    });
                },
                expand: function (exp) {
                    if (exp) {
                        cm.setSize(null, '200px');
                    } else {
                        cm.setSize(null, '30px');
                        cm.setCursor(1);
                        cm.scrollTo(null, 0);
                    }
                    cm.refresh();
                },
                refresh: function () {
                    cm.refresh();
                }
            };
        }(codeMirror));
        return wrappedCodeMirror;
    };

    ConditionHeaderField.prototype.wrap = function (val) {
        return '${=' + (val || '') + '}';
    };

    ConditionHeaderField.prototype.test = function (val) {
        return _.startsWith(val, '${=') && _.endsWith(val, '}');
    };

    Brightics.VA.Implementation.DataFlow.Editors.Header.ConditionHeaderField = ConditionHeaderField;
/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
