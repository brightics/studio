/**
 * Created by daewon.park on 2016-02-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var LITERAL_TYPE = ['number', 'string', 'array[string]', 'array[number]'];
    var ARRAY_TYPE = ['array[string]', 'array[number]'];
    var NUMBER_TYPE = ['number', 'array[number]'];

    /**
     *  options = {
     *  variable :{"$gv2": { "type": "literal", "value": ['a','b','c'], 'variable-type': 'array' } }
     */

    var FnUnitUtils = brtc_require('FnUnitUtils');

    function VariableControl(parentId, options) {
        this.parentId = parentId;
        this.initOptions(options);
        this.retrieveParent();
        this.createControls();
        this.setInputValue();
    }

    VariableControl.prototype.initOptions = function (options) {
        this.options = $.extend(true, {}, options);

        this.variableKey = Object.keys(this.options.variable)[0];
        this.variableType = this.options.variable[this.variableKey]['variable-type'];
        this.inputType = this.getInputType(this.variableType);
        this.variableValue = this.options.variable[this.variableKey]['value'];
    };

    VariableControl.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    VariableControl.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-widget-container">' +
            '   <div class ="brtc-va-widget-remove" />' +
            '   <div class="brtc-va-widget-label" />' +
            '   <div class="brtc-va-widget-header" />' +
            // '       <div class="brtc-va-widget-label">' + this.variableKey + '</div>' +
            '   <div class="brtc-va-widget-contents"><div class="brtc-va-widget-contents-input-container-wrapper"></div></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);


        this._renderLabel();
        this.createContentsArea();

        this.$mainControl.find('.brtc-va-widget-remove').on('click', function () {
            if (typeof _this.options.onRemoveCallback === 'function') {
                _this.options.onRemoveCallback(_this.createFormattedValue());
                _this.$mainControl.remove();
            }
        });
    };

    VariableControl.prototype._renderLabel = function () {
        let $label = this.$mainControl.find('.brtc-va-widget-label');

        if (this.options.label) {
            if (this.options.mandatory) $label.addClass('mandatory');
            this.variableType = this.variableType || '';
            var variableType = this.variableType.indexOf("array") >= 0 ? "array" : this.variableType;
            $label.addClass(variableType);
            $label.text(this.options.label);
            $label.show();
        } else {
            $label.hide();
        }
    };

    VariableControl.prototype.isArrayValue = function () {
        return ARRAY_TYPE.indexOf(this.variableType) > -1;
    };

    VariableControl.prototype.isCellValue = function () {
        return (this.variableType === 'cell') ? true : false;
    };

    VariableControl.prototype.createContentsArea = function () {
        this.$contentsArea = this.$mainControl.find('.brtc-va-widget-contents-input-container-wrapper');
        let $header = this.$mainControl.find('.brtc-va-widget-header');
        $header.hide();

        if (this.isCellValue()) {
            this.createCellInputControl();
        } else if (this.isArrayValue()) {
            $header.show();
            this.createArrayInputControl();
        } else {
            this.createSingleInputControl();
        }
    };

    VariableControl.prototype.createCellInputControl = function () {
        this.createCellControlLayout();
    };

    VariableControl.prototype._createArrayInputHeaderArea = function () {
        if (this.$arrayInputHeader) {
            this.$arrayInputHeader.remove();
        }

        this.$arrayInputHeader = $(`
            <div class="brtc-va-widget-contents-array-input-header-area">
                <div class="brtc-va-widget-contents-array-header-button" current-edit-type="control">${Brightics.locale.common.bulkEdit}</div>
            </div>`);
        let $button = this.$arrayInputHeader.find(".brtc-va-widget-contents-array-header-button");

        let $header = this.$mainControl.find('.brtc-va-widget-header');
        $header.append(this.$arrayInputHeader);

        $button.click(() => {
            if ($button.attr("current-edit-type") === "control") {
                this._changeControlToBulk();
                this._changeArrayInputHeaderButton("bulk");

            } else if ($button.attr("current-edit-type") === "bulk") {

                this._changeBulkToControl();
                this._changeArrayInputHeaderButton("control");

            }
            this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar('update');
        });

    };

    VariableControl.prototype._changeArrayInputHeaderButton = function (buttonType) {
        let $button = this.$arrayInputHeader.find(".brtc-va-widget-contents-array-header-button");
        if (buttonType === "bulk") {
            $button.attr("current-edit-type", "bulk");
            $button.text(Brightics.locale.common.apply);
            this.$mainControl.find('.brtc-va-widget-contents').scrollTop(0);
        } else if (buttonType === "control") {
            $button.attr("current-edit-type", "control");
            $button.text(Brightics.locale.common.bulkEdit);
        }

    };


    VariableControl.prototype._isBulkType = function () {
        let $button = this.$arrayInputHeader.find(".brtc-va-widget-contents-array-header-button");
        return ($button.attr("current-edit-type") === "bulk");
    };


    VariableControl.prototype._changeControlToBulk = function () {
        let arrayValue = this.getInputValue();
        this.$contentsArea.empty();
        this._bulkAceEditorControl = Brightics.VA.Core.Widget.Factory.aceEditorControl(this.$contentsArea, {
            value: arrayValue.join('\n'),
            // mode: 'text',
            editorOptions: {
                enableBasicAutocompletion: false,
                enableSnippets: false,
                enableLiveAutocompletion: false
            }
        });

        let editorSession = this._bulkAceEditorControl.getSession();
        editorSession.setOption('indentedSoftWrap', false);
        editorSession.setUseWrapMode(true);
        editorSession.setWrapLimitRange();
    };

    VariableControl.prototype._changeBulkToControl = function () {
        let value = this._getBulkListValue();
        this.setInputValue(value);
        this.triggerChangeInputValue(true);
        this._destroyBulkAceEditor()
    };


    VariableControl.prototype._destroyBulkAceEditor = function () {
        if (this._bulkAceEditorControl) {
            this._bulkAceEditorControl.destroy();
            this._bulkAceEditorControl = undefined;
        }
    };

    VariableControl.prototype.createArrayInputControl = function () {
        this._createArrayInputHeaderArea();

        if (!this.variableValue || this.variableValue.length === 0) {
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

    VariableControl.prototype.createSingleInputControl = function () {
        this.createInputControlLayout(0, false);
    };

    VariableControl.prototype.createCellControlLayout = function () {
        var $parents = this.$contentsArea;
        var _this = this;

        var $inputContainer = $('' +
            '<div class="brtc-va-widget-contents-input-container brtc-style-flex-direction-column brtc-style-height-auto brtc-style-align-items-flex-start">' +
            '   <div class="data-area brtc-style-display-flex brtc-style-col-12 brtc-style-margin-top-5">' +
            '       <div class="brtc-style-width-100 brtc-style-line-height-30">Input Data</div>' +
            '   </div>' +
            '   <div class="row-area brtc-style-display-flex brtc-style-col-12 brtc-style-margin-top-5">' +
            '       <div class="brtc-style-width-100 brtc-style-line-height-30">Row Index</div>' +
            '   </div>' +
            '   <div class="column-area brtc-style-display-flex brtc-style-col-12 brtc-style-margin-top-5">' +
            '       <div class="brtc-style-width-100 brtc-style-line-height-30">Column Name</div>' +
            '   </div>' +
            '</div>'
        );

        $parents.append($inputContainer);

        var $dataDiv = $('<div class="brtc-style-width-minus-100"></div>');
        var $rowDiv = $('<div class="brtc-style-width-minus-100"></div>');
        var $columnDiv = $('<div class="brtc-style-width-minus-100"></div>');

        var $dataArea = $inputContainer.find('.data-area');
        var $rowArea = $inputContainer.find('.row-area');
        var $columnArea = $inputContainer.find('.column-area');

        $dataArea.append($dataDiv);
        $rowArea.append($rowDiv);
        $columnArea.append($columnDiv);

        this.createCellControl($dataDiv, $rowDiv, $columnDiv);
    };

    VariableControl.prototype.createInputControlLayout = function (inputIndex, addable, focus) {
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

        if (this.isArrayValue()) {
            if (this.isNumericType()) {
                this.createNumericInputControl($inputDiv, focus);
            } else {
                this.createInputControl($inputDiv, focus);
            }
        } else {
            if (this.isNumericType()) {
                this.createNumericInputControl($inputDiv, focus);
            } else {
                this.createCodeInputControl($inputDiv, focus);
            }
        }
    };

    VariableControl.prototype.createNumericInputControl = function ($parent, focus) {
        var _this = this;
        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            width: '100%',
            numberType: 'double',
            placeHolder: 'Enter value',
            className: ['brtc-va-widget-contents-input-control'],
            enterCallback: function ($mainControl) {
                if (this.isArrayValue()) {
                    this.handleAddInputControlEvent($mainControl.closest(
                        '.brtc-va-widget-contents-input-container'
                    ), true);
                }
            }.bind(this)
        };
        var input = new Brightics.VA.Core.Widget.Controls.NumericInput($parent, options);
        input.onChange(function () {
            _this.triggerChangeInputValue(false);
        });

        if (focus) input.focus();
    };

    VariableControl.prototype.createDropDownList = function ($control, jqxOptions) {

        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            autoDropDownHeight: true,
            enableBrowserBoundsDetection: true,
            width: 'calc(100% - 100px)'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxDropDownList(options);
    };

    VariableControl.prototype.createIndataSource = function () {
        var activeModel = Studio.getEditorContainer().getActiveModelEditor().getActiveModel();
        var source = FnUnitUtils.getInTable(this.options.fnUnit).map(function (tid) {
            var fnUnit = activeModel.getFnUnitByOutTable(tid);
            return {
                label: fnUnit.display.label,
                tid: tid,
                type: fnUnit.func
            }
        });
        return source;
    };

    VariableControl.prototype.createCellControl = function ($data, $row, $column) {
        var _this = this;

        this.$data = $data;

        this.createDropDownList($data, {
            source: this.createIndataSource(),
            displayMember: 'label',
            valueMember: 'tid'
        });

        $data.change(function () {
            _this.triggerChangeCellValue();
        });

        var rowOptions = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            width: '100%',
            numberType: 'int',
            minus: false,
            placeholder: '(0 < value)',
            className: ['brtc-va-widget-contents-input-control']
        };
        this.rowInput = new Brightics.VA.Core.Widget.Controls.NumericInput($row, rowOptions);
        this.rowInput.onChange(function () {
            _this.triggerChangeCellValue();
        });

        this.rowInput.focus();

        this.$columnControl = $('<input type="text" class="brtc-va-widget-contents-input-control"/>');
        $column.append(this.$columnControl);
        var inputOptions = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            width: '100%',
            placeHolder: 'Enter value'
        };
        this.$columnControl.jqxInput(inputOptions);

        this.$columnControl.focusout(function (event) {
            _this.triggerChangeCellValue();
        });
    };

    VariableControl.prototype.createInputControl = function ($parent, focus) {
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
            _this.triggerChangeInputValue(false);
        });
    };

    VariableControl.prototype.createCodeInputControl = function ($parent, focus) {
        var _this = this;
        var $inputControl = $('<textarea  class="brtc-va-widget-contents-input-control"/>');
        $parent.append($inputControl);
        var controlOptions = {
            mode: this.isLiteralType(this.variableType) ? 'brtc-system-variable' : 'brtc-control',
            scrollbarStyle: 'null',
            placeholder: this.isLiteralType(this.variableType) ? 'Enter value' : 'Enter expression',
            lineWrapping: false,
            matchBrackets: false,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                "Tab": false, // Let focus go to next control
                "Shift-Tab": false // Let focus go to previous control
            },
            showTrailingSpace: true,
            hintOptions: {
                list: this.variableType == 'literal' ? ['${sys.user}', '${sys.date}'] : []
            }
        };

        this.codeMirror = CodeMirror.fromTextArea($inputControl[0], controlOptions);
        var additionalOption = {
            'valid-message-position': this.options['valid-message-position']
        };
        Brightics.VA.Core.Utils.WidgetUtils.changeCodeMirrorLineToSingle(this.codeMirror, additionalOption);
        this.codeMirror.on('blur', function (instance, event) {
            _this.triggerChangeInputValue(false);
        });
    };

    VariableControl.prototype.handleAddInputControlEvent = function ($target, focus) {
        var index = $target.index();
        this.createInputControlLayout(index, true, focus);
        this.triggerChangeInputValue();
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar('update');
        var parents = this.$mainControl.parents('.ps-container');
        if (parents && parents.length) parents.perfectScrollbar('update');
    };

    VariableControl.prototype.handleDeleteButtonClick = function ($target) {
        $target.remove();
        this.triggerChangeInputValue();
        this.$mainControl.find('.brtc-va-widget-contents').perfectScrollbar('update');
        var parents = this.$mainControl.parents('.ps-container');
        if (parents && parents.length) parents.perfectScrollbar('update');
    };

    VariableControl.prototype.triggerChangeInputValue = function (forced) {
        if (typeof this.options.onChangeCallback === 'function') {
            var _this = this;
            var value = _this.getInputValue();
            if (JSON.stringify(value) !== JSON.stringify(_this.variableValue) || forced) {
                _this.variableValue = value;
                _this.options.onChangeCallback(_this.createFormattedValue());
            }
        }
    };

    VariableControl.prototype.triggerChangeCellValue = function (forced) {
        if (typeof this.options.onChangeCallback === 'function') {
            var _this = this;
            var value = {
                inData: this.$data.val(),
                rowIndex: this.rowInput.getValue(),
                column: this.$columnControl.val()
            };

            if (JSON.stringify(value) !== JSON.stringify(_this.variableValue) || forced) {
                _this.variableValue = value;
                _this.options.onChangeCallback(_this.createFormattedCellValue());
            }
        }
    };

    VariableControl.prototype.createFormattedCellValue = function () {
        return {
            'key': this.variableKey,
            'type': this.inputType,
            'variable-type': this.variableType,
            "value": this.variableValue
        };
    };

    VariableControl.prototype.createFormattedValue = function () {
        return {
            'key': this.variableKey,
            'type': this.inputType,
            'variable-type': this.variableType,
            "value": this.isLiteralType(this.variableType) ? this.variableValue :
                Brightics.VA.Core.Utils.VariableUtils.wrap(this.variableValue)
        };
    };

    VariableControl.prototype.getFormattedValue = function () {
        return {
            'key': this.variableKey,
            'type': this.inputType,
            'variable-type': this.variableType,
            "value": (this.variableType === 'calculation') ?
                Brightics.VA.Core.Utils.VariableUtils.wrap(this.getInputValue()) : this.getInputValue()
        };
    };
    VariableControl.prototype._getBulkListValue = function () {
        let bulkListValue = [];
        let bulkValue = this._bulkAceEditorControl.getValue();
        if (bulkValue) {
            bulkValue.split('\n').forEach((x) => {
                bulkListValue.push(this.getValueByType(x))
            });
        }


        if (bulkListValue.length === 0) {
            if (this.isNumericType()) {
                bulkListValue = [0];
            } else {
                bulkListValue = [""];
            }
        }
        return bulkListValue;
    };


    VariableControl.prototype.getInputValue = function () {
        var inputValue;
        var controls = this.$contentsArea.find('.brtc-va-widget-contents-input-control');

        if (this.isArrayValue()) {
            inputValue = [];
            inputValue.length = controls.length;
            for (var i = 0; i < controls.length; i++) {
                var x = this.getValueByType($(controls[i]).val());
                inputValue[i] = x;
            }
        } else {
            inputValue = this.isNumericType() ?
                this.getValueByType(controls.val()) :
                this.getValueByType(this.codeMirror.getValue());
        }
        return inputValue;
    };

    VariableControl.prototype.setVariableType = function (variableType) {
        this.variableType = variableType;
        this.$contentsArea.empty();
        this.createContentsArea();
    };

    VariableControl.prototype.setInputValue = function (value) {
        if (typeof value !== 'undefined') this.variableValue = value;

        var controls = this.$contentsArea.find('.brtc-va-widget-contents-input-control');
        if (this.isCellValue()) {
            this.rowInput.setValue(this.variableValue.rowIndex);
            this.$columnControl.val(this.variableValue.column);
            this.$data.val(this.variableValue.inData);
        } else if (this.isArrayValue()) {
            var i;
            if (controls.length > this.variableValue.length) {
                for (i = 0; i < controls.length; i++) {
                    if (typeof this.variableValue[i] === 'undefined') {
                        $(controls[i]).parents('.brtc-va-widget-contents-input-container').remove();
                    } else {
                        $(controls[i]).val(this.getValueByType(this.variableValue[i]));
                    }
                }
            } else {
                for (i = controls.length; i < this.variableValue.length; i++) {
                    this.createInputControlLayout(i, true);
                }
                controls = this.$contentsArea.find('.brtc-va-widget-contents-input-control');
                for (i = 0; i < controls.length; i++) {
                    $(controls[i]).val(this.getValueByType(this.variableValue[i]));
                }
            }
            this._destroyBulkAceEditor();
            this._changeArrayInputHeaderButton("control");
        } else {
            if (Array.isArray(this.variableValue)) {
                if (this.isNumericType()) {
                    controls.val(this.getValueByType(this.variableValue[0]));
                } else {
                    this.codeMirror.setValue(this.getValueByType(this.variableValue[0]));
                }
            } else {
                if (this.isNumericType()) {
                    controls.val(this.getValueByType(this.variableValue));
                } else {
                    this.codeMirror.setValue(this.getValueByType(this.variableValue));
                }
            }
        }
    };

    VariableControl.prototype.setRemovable = function (removable) {
        this.options.removable = removable;

        if (removable) this.$mainControl.find('.brtc-va-widget-remove').addClass('removable');
        else this.$mainControl.find('.brtc-va-widget-remove').removeClass('removable');
    };


    VariableControl.prototype.getOptions = function () {
        return this.options;
    };

    VariableControl.prototype.isLiteralType = function (varType) {
        return LITERAL_TYPE.indexOf(varType) > -1;
    };

    VariableControl.prototype.getInputType = function (varType) {
        if (this.isLiteralType(varType)) return 'literal';
        return 'expression';
    };

    VariableControl.prototype.isNumericType = function () {
        return NUMBER_TYPE.indexOf(this.variableType) > -1;
    };

    VariableControl.prototype.toString = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return '';
        if (_.isNumber(val)) {
            if (_.isNaN(val)) return '';
            return val.toString();
        }
        return val;
    };

    VariableControl.prototype.toNumber = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return 0;
        return Number(this.toString(Number(val)));
    };

    VariableControl.prototype.getValueByType = function (val) {
        if (this.isNumericType()) return this.toNumber(val);
        if (this.isLiteralType(this.variableType)) return this.toString(val);
        // expression
        return Brightics.VA.Core.Utils.VariableUtils.strip(val);
    };

    root.Brightics.VA.Core.Widget.Controls.VariableControl = VariableControl;
}).call(this);
