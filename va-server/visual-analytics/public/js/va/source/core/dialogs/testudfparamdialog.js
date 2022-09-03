(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TestUDFParamDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    TestUDFParamDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    TestUDFParamDialog.prototype.constructor = TestUDFParamDialog;

    TestUDFParamDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 500;
        this.dialogOptions.height = 500;
    };

    TestUDFParamDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-test-udf-param-contents');

        $parent.append('<div class="brtc-va-dialogs-test-udf-param"></div>');


        this.createInputTableControl($parent.find('.brtc-va-dialogs-test-udf-param'));
        this.createInputVariablesControl($parent.find('.brtc-va-dialogs-test-udf-param'));

        $parent.perfectScrollbar();
        $parent.perfectScrollbar('update');
    };
    TestUDFParamDialog.prototype.createInputTableControl = function ($parent) {
        var _this = this;

        if (_this.options.inputDataCnt === 0) {
            return;
        }
        var $inputTableContainer = $('' +
            '<div class="brtc-va-dialogs-test-udf-param-input-tables-container">' +
            '    <div class="header">' +
            '        <span>Input Data</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '    </div>' +
            '</div>');

        this.inputFsPaths = [];
        var $dropDownListControl = {};
        for (var i = 0; i < _this.options.inputDataCnt; i++) {
            //create Input Data Control

            var $inputDataControl = $('' +
                '<div class="brtc-va-dialogs-test-udf-param-row-flex-layout" style="display: flex">' +
                '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold" style="width: 30%;">inputs(' + i + ')</div>' +
                '</div>');
            $dropDownListControl[i] = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-dropDownList" style="width: 70%;"/>');
            _this.createInput($dropDownListControl[i]);
            $dropDownListControl[i].prop('readonly', true);
            $inputDataControl.append($dropDownListControl[i]);
            $dropDownListControl[i].click(function () {
                var _that = this;
                var browser = new Brightics.VA.Core.Dialogs.RepositoryBrowserDialog(_this.$mainControl, {
                    filePath: $(_that).val(),
                    close: function (dialogResult) {
                        if (dialogResult.OK && dialogResult.selectedFile) {
                            _this.renderInput($(_that), [dialogResult.selectedFile]);
                        }
                    },
                    resizable: true,
                    title: 'Browse Repository'
                });
                browser.$settingOptionGroup.attr('setting', 'false');
            });
            this.inputFsPaths.push({index: i, control: $dropDownListControl[i], value: ''});

            $inputTableContainer.find('.contents').append($inputDataControl);
            $parent.append($inputTableContainer);
        }
    };

    TestUDFParamDialog.prototype.renderInput = function (control, val) {
        var currentVal = val[0] || '';
        control.val(currentVal);
        control.attr('title', currentVal);
        this.renderInputSchema(currentVal);
    };

    TestUDFParamDialog.prototype.createInputVariablesControl = function ($parent) {
        var _this = this;

        if (_this.options.inputVariable.length === 0) {
            return;
        }
        var $InputVariablesContainer = $('' +
            '<div class="brtc-va-dialogs-test-udf-param-input-variables-container">' +
            '    <div class="header">' +
            '        <span>Input Variable</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '    </div>' +
            '</div>');
        this.inputVariables = [];
        for (var i in _this.options.inputVariable) {
            //create Input Variable Control

            var $inputVariableControl = $('' +
                '<div class="brtc-va-dialogs-row-flex-layout">' +
                '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold" style="width: 30%;">' + _this.options.inputVariable[i].param_name + '</div>' +
                '</div>');

            $parent.append($InputVariablesContainer);
            var $inputParamValueControl = '';

            if (_this.options.inputVariable[i].arg_type === 'int' || _this.options.inputVariable[i].arg_type === 'double' || _this.options.inputVariable[i].arg_type === 'long') {
                $inputParamValueControl = $('<div class="brtc-va-dialog-test-udf-param-input-param-value" style="width:70%;"/>');

                let widgetOptions = {
                    numberType: _this.options.inputVariable[i].arg_type, //int, double
                    placeholder: 'Enter value'
                };
                var numericInput = _this.createNumberInput($inputParamValueControl, widgetOptions, '', {width: '70%'});

                $inputVariableControl.append($inputParamValueControl);
                $InputVariablesContainer.find('.contents').append($inputVariableControl);

                this.inputVariables.push({
                    paramName: _this.options.inputVariable[i].param_name,
                    paramType: _this.options.inputVariable[i].arg_type,
                    control: numericInput,
                    value: ''
                });

            } else if (_this.options.inputVariable[i].arg_type === 'string') {
                $inputParamValueControl = $('<input type="text" class="brtc-va-dialog-test-udf-param-input-param-value"/>');
                let widgetOptions = {
                    placeHolder: 'Enter value',
                    width: '70%'
                };
                _this.createInput($inputParamValueControl, widgetOptions, '', {width: '70%'});

                $inputVariableControl.append($inputParamValueControl);
                $InputVariablesContainer.find('.contents').append($inputVariableControl);

                this.inputVariables.push({
                    paramName: _this.options.inputVariable[i].param_name,
                    paramType: _this.options.inputVariable[i].arg_type,
                    control: $inputParamValueControl,
                    value: ''
                });

            } else {
                $inputParamValueControl = $('<textarea class="brtc-va-dialog-test-udf-param-input-param-value"></textarea>');
                $inputVariableControl.append($inputParamValueControl);
                $InputVariablesContainer.find('.contents').append($inputVariableControl);
                var verifier = new Brightics.VA.Core.Verifier.SqlVerifier();
                var opt = {placeholder: 'Enter value. \n Ex)Array(\"a\", \"b\") \n Map(\"a\"->\"b\")'};
                opt.hintOptions = {list: []};
                opt.verifier = verifier;
                var codeMirrorControl = _this.createTextAreaControl($inputParamValueControl, opt, '', {width: "70%"});
                $inputParamValueControl.data('codeMirror', codeMirrorControl);
                codeMirrorControl.codeMirror.setSize('100%', '50px');


                this.inputVariables.push({
                    paramName: _this.options.inputVariable[i].param_name,
                    paramType: _this.options.inputVariable[i].arg_type,
                    control: codeMirrorControl,
                    value: ''
                })
            }
        }
        this.updateCodeMirrorHint();
    };

    TestUDFParamDialog.prototype.updateCodeMirrorHint = function () {
        this.hintList = [];
        this.hintList = $.extend(true, this.hintList, CodeMirror.hintWords['text/x-scala']);

        for (var i in this.columnList) {
            for (var j in this.columnList[i]) {
                this.hintList.push(this.columnList[i][j].name);
            }
        }
        for (var i in this.inputVariables) {
            if (this.inputVariables[i].paramType === 'expression') {
                this.inputVariables[i].control.codeMirror.options.hintOptions.list = this.hintList;
            }
        }
    };

    TestUDFParamDialog.prototype.handleOkClicked = function () {
        var _this = this;

        _this.dialogResult.inputTables = this.getInputTables();
        _this.dialogResult.inputVariables = this.getInputParams();
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);

    };

    TestUDFParamDialog.prototype.getInputTables = function () {
        for (var i in this.inputFsPaths) {
            this.inputFsPaths[i].value = this.inputFsPaths[i].control.val();
        }
        return this.inputFsPaths;
    };

    TestUDFParamDialog.prototype.getInputParams = function () {
        for (var i in this.inputVariables) {
            if (this.inputVariables[i].paramType === 'int' || this.inputVariables[i].paramType === 'double' || this.inputVariables[i].paramType === 'long') {
                this.inputVariables[i].value = this.inputVariables[i].control.getValue();
            } else if (this.inputVariables[i].paramType === 'string') {
                this.inputVariables[i].value = this.inputVariables[i].control.val();
            } else {
                this.inputVariables[i].value = this.inputVariables[i].control.getValue();
            }
        }
        return this.inputVariables;
    };

    TestUDFParamDialog.prototype.createDialogButtonBar = function ($parent) {
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);
        this.$okButton.val('RUN');
        this.$cancelButton.css({display: 'none'});
    };

    TestUDFParamDialog.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-dialog-test-udf-param-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };
    TestUDFParamDialog.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-dialog-test-udf-param-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    TestUDFParamDialog.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            var $wrapper = $control.parent('.brtc-va-dialog-test-udf-param-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    TestUDFParamDialog.prototype.createInput = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);

        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }

        if (!$control.attr('type')) $control.attr('type', 'text');
        if (!$control.attr('maxlength')) $control.attr('maxlength', '100');

        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxInput(options);
        var preValue = $control.val();
        $control.focus(function () {
            preValue = $control.val();
        });
        $('svg').on('mousedown', function () {
            var value = $control.val();
            if (value !== preValue && $control.is(":focus")) {
                $control.trigger("change");
            }
        });
        return $control;
    };

    TestUDFParamDialog.prototype.createNumberInput = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        return new Brightics.VA.Core.Editors.Sheet.Controls.NumericInput($control, widgetOptions);
    };


    TestUDFParamDialog.prototype.createTextAreaControl = function ($control, controlOptions, className, additionalCss) {

        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);
        $control.addClass(additionalClass);
        if (additionalCss) $control.css(additionalCss);

        return new Brightics.VA.Core.Editors.Sheet.Controls.TextAreaControl($control, controlOptions);
    };

    TestUDFParamDialog.prototype.renderInputSchema = function (filePath) {
        this.columnList = {};
        var _this = this;
        Brightics.VA.RepositoryQueryTemplate.schema(filePath).done(function (columns) {
            _this.columnList[filePath] = columns.columns;
            $.each(_this.columnList[filePath], function (index, column) {
                if(typeof column['type'] === 'undefined')   column['type'] = column['internalType'];
            });

            _this.updateCodeMirrorHint();
        }).fail(function (err) {

        });
    };

    Brightics.VA.Core.Dialogs.TestUDFParamDialog = TestUDFParamDialog;

}).call(this);