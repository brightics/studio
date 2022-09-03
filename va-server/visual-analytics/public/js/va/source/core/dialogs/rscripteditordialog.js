/**
 * Created by gy84.bae on 2016-10-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RScriptEditorDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.ScriptEditorDialog.call(this, parentId, options);
    }

    RScriptEditorDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.ScriptEditorDialog.prototype);
    RScriptEditorDialog.prototype.constructor = RScriptEditorDialog;

    RScriptEditorDialog.prototype.renderInfoArea = function ($parent, useTable) {
        var _this = this;
        this.$trueControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">true</div>');
        this.$falseControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">false</div>');

        this.$infoArea.addClass('rscript');
        this.$infoArea.append('' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-columnlist"/>' +
            '<input type="text" class="brtc-va-dialogs-controls-propertycontrol-inputdataframe" valid-type="type1"/>' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-partitionbylist"/>' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-outputdataframelist"/>' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-stringasfactors"/>' +
            '<input type="text" class="brtc-va-dialogs-controls-propertycontrol-scripterrorcol" valid-type="type1"/>' +
            '<input type="text" class="brtc-va-dialogs-controls-propertycontrol-flattenerrorcol" valid-type="type1"/>' +
            '');

        this.$columns = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-columnlist');
        this.$inputDataframes = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-inputdataframe');
        this.$partitionby = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-partitionbylist');
        this.$outputDataframes = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-outputdataframelist');
        this.$stringasfactors = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-stringasfactors');
        this.$scripterrorcol = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-scripterrorcol');
        this.$flattenerrorcol = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-flattenerrorcol');

        this.addPropertyControl('Columns', function ($contents) {
            $contents.append(this.$columns);

            var widgetOptions = {
                multiple: true,
                maxRowCount: 3,
                sort: 'none',
                showOpener: 'button',
                changed: function (type, data) {
                    _this.selectedColumns = data.items;
                    _this.renderValidation();
                }
            };
            _this.columnsControl = _this.createColumnList(_this.$columns, widgetOptions);
        }, {mandatory: true});

        this.addPropertyControl('Input Dataframe', function ($contents) {
            $contents.append(_this.$inputDataframes);
            var jqxOptions = {
                placeHolder: 'Input Dataframe'
            };
            _this.createInput(_this.$inputDataframes, jqxOptions, 'brtc-va-editors-sheet-controls-width-12');

            _this.$inputDataframes.on('change', function (event) {
                _this.inputDataframe = $(this).val();
                _this.renderValidation();
            });
        }, {mandatory: true});

        this.addPropertyControl('Partition by', function ($contents) {
            $contents.append(this.$partitionby);
            var widgetOptions = {
                multiple: true,
                maxRowCount: 3,
                sort: 'none',
                showOpener: 'button',
                changed: function (type, data) {
                    _this.selectedGroupby = data.items;
                    _this.renderValidation();
                }
            };
            _this.groupbyControl = _this.createColumnList(_this.$partitionby, widgetOptions);
        }, {mandatory: false});

        this.addPropertyControl('Output Dataframe', function ($contents) {
            $contents.append(this.$outputDataframes);
            _this.createOutputDataframeList(_this.$outputDataframes);

        }, {mandatory: true});

        this.addPropertyControl('Strings As Factors', function ($contents) {
            this.$stringasfactors.append(this.$trueControl).append(this.$falseControl);
            $contents.append(this.$stringasfactors);

            _this.createRadioButton(_this.$trueControl, {width: '80', groupName: 'Group'});
            _this.createRadioButton(_this.$falseControl, {width: '80', groupName: 'Group'});

            _this.$trueControl.on('checked', function () {
                _this.selectedFactors = 'true';
            });

            _this.$falseControl.on('checked', function () {
                _this.selectedFactors = 'false';
            });

        }, {mandatory: false});

        this.addPropertyControl('Script Error Column', function ($contents) {
            $contents.append(_this.$scripterrorcol);
            var jqxOptions = {
                placeHolder: 'Script Error Column'
            };
            _this.createInput(_this.$scripterrorcol, jqxOptions, 'brtc-va-editors-sheet-controls-width-12');

            _this.$scripterrorcol.on('change', function (event) {
                _this.scriptErrorCol = $(this).val();
            });
        }, {mandatory: false});

        this.addPropertyControl('Flatten Error Column', function ($contents) {
            $contents.append(_this.$flattenerrorcol);
            var jqxOptions = {
                placeHolder: 'Flatten Error Column'
            };
            _this.createInput(_this.$flattenerrorcol, jqxOptions, 'brtc-va-editors-sheet-controls-width-12');

            _this.$flattenerrorcol.on('change', function (event) {
                _this.flattenErrorCol = $(this).val();
            });
        }, {mandatory: false});

        this.fillControlValues();
        this.renderValues();
    };

    RScriptEditorDialog.prototype.createOutputDataframeList = function ($contents) {
        var outputDataframeList = this.options.fnUnit.param['output-dataframe'];

        if (outputDataframeList === undefined) {
            this.createOutputControlLayout(0, true, $contents);
        } else if (outputDataframeList.length === 0) {
            this.createOutputControlLayout(0, true, $contents);
        } else {
            for (var i = 0; i < outputDataframeList.length; i++) {
                this.createOutputControlLayout(i, true, $contents);
            }
        }
    };

    RScriptEditorDialog.prototype.createOutputControlLayout = function (inputIndex, addable, $contents, focus) {
        var $parents = $contents;
        var _this = this;
        var deletable = false;
        var $inputContainer = $('<div class="brtc-va-rcontents-input-container"></div>');

        var $children = $parents.find('.brtc-va-rcontents-input-container');

        if ($children.length === 0 || !$children[inputIndex]) {
            $parents.append($inputContainer);
        } else {
            $($children[inputIndex]).after($inputContainer);
            deletable = true;
        }

        var $inputDiv = $('<div class="brtc-va-widget-contents-input-control-container"></div>');
        var $addDiv, $deleteDiv;

        $inputContainer.append($inputDiv);
        if (addable) {
            $addDiv = $('<div class="brtc-va-widget-contents-input-control-add"></div>');
            $inputContainer.append($addDiv);

            $addDiv.click(function (event) {
                _this.handleAddInputControlEvent($(this).closest('.brtc-va-rcontents-input-container'), $parents);
                _this.$infoArea.perfectScrollbar('update');
            })
        }
        if (inputIndex > 0 || deletable) {
            $deleteDiv = $('<div class="brtc-va-widget-contents-input-control-delete"></div>');
            $inputContainer.append($deleteDiv);

            $deleteDiv.click(function (event) {
                _this.handleDeleteButtonClick($(this).closest('.brtc-va-rcontents-input-container'));
                _this.$infoArea.perfectScrollbar('update');
            })
        }

        this.createInputControl($inputDiv, focus);
    };

    RScriptEditorDialog.prototype.handleAddInputControlEvent = function ($target, $contents, focus) {
        var index = $target.index();
        this.createOutputControlLayout(index, true, $contents, focus);
        this.getInputValue();
        this.renderValidation();
    };

    RScriptEditorDialog.prototype.handleDeleteButtonClick = function ($target) {
        $target.remove();
        this.getInputValue();
        this.renderValidation();
    };

    RScriptEditorDialog.prototype.createInputControl = function ($parent, focus) {
        var _this = this;
        var $inputControl;

        $inputControl = $('<input type="text" class="brtc-va-widget-contents-input-control"/>');
        $parent.append($inputControl);
        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            width: '100%'
        };
        $inputControl.jqxInput(options);

        if (!focus) {
            $inputControl.jqxInput('focus');
        }

        $inputControl.keydown(function (key) {
            if (key.keyCode == 13) {
                _this.handleAddInputControlEvent($inputControl.closest('.brtc-va-rcontents-input-container'), true);
                _this.getInputValue();
                _this.renderValidation();

            }
        });
        $inputControl.focusout(function (event) {
            _this.getInputValue();
            _this.renderValidation();
        });
    };

    RScriptEditorDialog.prototype.createInput = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);

        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }

        if (!$control.attr('type'))$control.attr('type', 'text');
        if (!$control.attr('maxlength'))$control.attr('maxlength', '100');

        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            placeHolder: 'Enter value'
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

        var _this = this;
        $control.on('keydown', function (event) {
            clearTimeout(_this.keydownTimeout);
            _this.keydownTimeout = setTimeout(function () {
                if ($control.is(':focus')) {
                    $control.blur();
                    $control.focus();
                }
            }, 1000);
        });

        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($control);
        return $control;
    };

    RScriptEditorDialog.prototype.getInputValue = function () {
        var inputValue;
        var controls = this.$outputDataframes.find('.brtc-va-widget-contents-input-control');

        inputValue = [];
        for (var i = 0; i < controls.length; i++) {
            if ($(controls[i]).val()) {
                inputValue.push($(controls[i]).val());
            }
        }
        this.outputDataframe = inputValue;
        //return inputValue;
    };

    RScriptEditorDialog.prototype.setInputValue = function (value) {
        var controls = this.$outputDataframes.find('.brtc-va-widget-contents-input-control');
        for (var i = 0; i < controls.length; i++) {
            $(controls[i]).val(value[i] || '');
        }
    };

    RScriptEditorDialog.prototype.fillControlValues = function () {
        var columnData = this.options.dataMap ? (this.options.fnUnit[IN_DATA][0] ? this.options.dataMap[this.options.fnUnit[IN_DATA][0]].columns : []) : [];
        var byteData = [];
        var data = [];
        $.each(columnData, function (index, value) {
            data.push(value);
        });
        this.groupbyControl.setItems(data);
        this.columnsControl.setItems(data);
    };


    RScriptEditorDialog.prototype.renderValues = function () {
        var param = this.options.fnUnit.param;

        this.columnsControl.setSelectedItems(param['input-cols']);

        var paramPartitionBy = this.options.fnUnit.param['partition-by'];
        if (paramPartitionBy) {
            this.groupbyControl.setSelectedItems(paramPartitionBy);
        } else {
            this.groupbyControl.setSelectedItems([]);
        }

        var paramFactors = this.options.fnUnit.param['strings-as-factors'];
        if (paramFactors === '') {
            this.$trueControl.jqxRadioButton('check');
        } else {
            if (paramFactors === 'true') this.$trueControl.jqxRadioButton({checked: true});
            if (paramFactors === 'false') this.$falseControl.jqxRadioButton({checked: true});
        }

        var paramResultColumn = this.options.fnUnit.param['output-dataframe'];
        this.setInputValue(paramResultColumn);

        this.selectedColumns = param['input-cols'];
        this.selectedGroupby = paramPartitionBy;
        this.selectedFactors = paramFactors;
        this.outputDataframe = paramResultColumn;

        var paramInputDataframe = this.options.fnUnit.param['input-dataframe'];
        this.inputDataframe = paramInputDataframe;
        this.$inputDataframes.val(paramInputDataframe);

        var paramScriptErrorCol = this.options.fnUnit.param['script-error-col'];
        this.scriptErrorCol = paramScriptErrorCol;
        this.$scripterrorcol.val(paramScriptErrorCol);

        var paramFlattenErrorCol = this.options.fnUnit.param['flatten-error-col'];
        this.flattenErrorCol = paramFlattenErrorCol;
        this.$flattenerrorcol.val(paramFlattenErrorCol);
    };

    RScriptEditorDialog.prototype.renderValidation = function () {
        //this.selectedColumns = this.columnsControl.val();
        //this.selectedGroupby = this.groupbyControl.val();

        if (!this.selectedColumns || this.selectedColumns.length === 0) {
            this.createValidationContent(this.$columns.parent(), '"Columns" field is required.', true);
        } else {
            this.removeValidation(this.$columns.parent().parent());
        }
        if (!this.inputDataframe) {
            this.createValidationContent(this.$inputDataframes.parent(), '"Input Dataframe" field is required.', true);
        } else {
            this.removeValidation(this.$inputDataframes.parent());
        }
        if (this.outputDataframe.length === 0) {
            this.createValidationContent(this.$outputDataframes, '"Output Dataframe" field is required.', true);
        }
        else {
            var isValid = true;
            for (var i in this.outputDataframe) {
                if (!(Brightics.VA.Core.Utils.InputValidator.isValid.columnNameType(this.outputDataframe[i]))) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                this.removeValidation(this.$outputDataframes);
            }
            else {
                this.createValidationContent(this.$outputDataframes, 'If the column name begins with _ or is only a number, it may be a problem in some functions later.', true);
            }
        }

    };

    RScriptEditorDialog.prototype.removeValidation = function ($parent) {
        $parent.find('.brtc-va-editors-sheet-panels-validation-tooltip').remove();
        $parent.find('.brtc-va-editors-sheet-controls-propertycontrol-label').removeClass('brtc-va-editors-sheet-controls-propertycontrol-label-error');
        $parent.find('.brtc-va-editor-sheet-panels-validation-error').removeClass('brtc-va-editor-sheet-panels-validation-error');
        $parent.find('.brtc-va-editors-sheet-panels-validation-tooltip').remove();
    };

    RScriptEditorDialog.prototype.createValidationContent = function ($parent, problemData, clearBoth) {
        var problemDiv = $parent.find('.brtc-va-editors-sheet-panels-validation-tooltip');
        if (problemDiv) {
            problemDiv.remove();
        }
        var $problemContent = $('<div class="brtc-va-editors-sheet-panels-validation-tooltip">' +
            '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' + problemData +
            '</div>');
        $parent.append($problemContent);
        $parent.addClass('brtc-va-editor-sheet-panels-validation-error');
        if (clearBoth) $problemContent.css('clear', 'both');
        var columnList = $parent.find('.brtc-va-editors-sheet-controls-columnselector');

        if (columnList.is('div')) {
            columnList.data().renderMissingColumns();
        }
        $problemContent.show();

    };

    RScriptEditorDialog.prototype.addPropertyControl = function (label, callback, option) {
        var _this = this,
            $propertyControl = $('' +
                '<div class="brtc-va-editors-sheet-controls-propertycontrol">' +
                '   <div class="brtc-va-editors-sheet-controls-propertycontrol-label"></div>' +
                '   <div class="brtc-va-editors-sheet-controls-propertycontrol-contents">' +
                '</div>');

        if (option) {
            if (option.mandatory) {
                label = '<div>' + label +
                    '   <div class="brtc-va-editors-sheet-controls-propertycontrol-mandatory">*</div>' +
                    '</div>';
            }
            _this.$infoArea.append($propertyControl);
        }
        else {
            _this.$infoArea.append($propertyControl);
        }

        $propertyControl.jqxExpander(
            {
                theme: Brightics.VA.Env.Theme,
                arrowPosition: "left",
                initContent: function () {
                    if (typeof  callback === 'function') {
                        callback.call(_this, $propertyControl.find(".brtc-va-editors-sheet-controls-propertycontrol-contents"), option);
                    }
                }
            });
        $propertyControl.jqxExpander('setHeaderContent', label);

        return $propertyControl;
    };

    RScriptEditorDialog.prototype.createColumnList = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            openerPosition: 'bottom',
            multiple: true,
            rowCount: 1,
            maxRowCount: 5,
            expand: false,
            sort: 'none',
            sortBy: 'name',
            showOpener: 'button',
            removable: true,
            defaultType: '-',
            changed: function (type, data) {

            },
            added: function () {

            },
            removed: function () {

            }
        };

        if (widgetOptions) {
            $.extend(options, widgetOptions);
        }

        var _columnList = new Brightics.VA.Core.Editors.Sheet.Controls.ColumnList($control, options);

        _columnList.columnSelector.$mainControl.attr('isDialog', true);
        return _columnList;
    };

    RScriptEditorDialog.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };

    RScriptEditorDialog.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    RScriptEditorDialog.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    RScriptEditorDialog.prototype.handleOkClicked = function () {

        this.dialogResult = {
            OK: true,
            Cancel: false,
            queryStatement: this.codeMirror.getValue(),
            columns: this.selectedColumns,
            partitionBy: this.selectedGroupby,
            factors: this.selectedFactors,
            inputDataframe: this.inputDataframe,
            outputDataframe: this.outputDataframe,
            scriptErrorCol: this.scriptErrorCol,
            flattenErrorCol: this.flattenErrorCol
        };
        this.$mainControl.dialog('close');
    };

    RScriptEditorDialog.prototype.getTitle = function () {
        return 'R';
    };

    Brightics.VA.Core.Dialogs.RScriptEditorDialog = RScriptEditorDialog;

}).call(this);