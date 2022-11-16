/**
 * Created by gy84.bae on 2016-10-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function REditorDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.ScriptEditorDialog.call(this, parentId, options);
    }

    REditorDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.ScriptEditorDialog.prototype);
    REditorDialog.prototype.constructor = REditorDialog;

    REditorDialog.prototype.renderInfoArea = function ($parent, useTable) {
        var _this = this;
        this.$trueControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">true</div>');
        this.$falseControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">false</div>');

        this.$infoArea.addClass('rscript');
        this.$infoArea.append('' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-columnlist"/>' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-groupbylist"/>' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-stringasfactors"/>' +
            '<div class="brtc-va-dialogs-controls-propertycontrol-resultlist"/>' +
            '');

        this.$columns = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-columnlist');
        this.$groupby = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-groupbylist');
        this.$stringasfactors = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-stringasfactors');
        this.$resultNames = this.$infoArea.find('.brtc-va-dialogs-controls-propertycontrol-resultlist');


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

        this.addPropertyControl('Group by', function ($contents) {
            $contents.append(this.$groupby);
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
            _this.groupbyControl = _this.createColumnList(_this.$groupby, widgetOptions);
        }, {mandatory: false});

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

        this.addPropertyControl('Result Columns', function ($contents) {
            $contents.append(this.$resultNames);
            _this.createResultNameList(_this.$resultNames);

        }, {mandatory: true});

        this.fillControlValues();
        this.renderValues();
    };

    REditorDialog.prototype.createResultNameList = function ($contents) {
        var resultColumnList = this.options.fnUnit.param['result-names'];

        if (resultColumnList === undefined) {
            this.createResultControlLayout(0, true, $contents);
        } else if (resultColumnList.length === 0) {
            this.createResultControlLayout(0, true, $contents);
        } else {
            for (var i = 0; i < resultColumnList.length; i++) {
                this.createResultControlLayout(i, true, $contents);
            }
        }
    };

    REditorDialog.prototype.createResultControlLayout = function (inputIndex, addable, $contents, focus) {
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
            })
        }
        if (inputIndex > 0 || deletable) {
            $deleteDiv = $('<div class="brtc-va-widget-contents-input-control-delete"></div>');
            $inputContainer.append($deleteDiv);

            $deleteDiv.click(function (event) {
                _this.handleDeleteButtonClick($(this).closest('.brtc-va-rcontents-input-container'));
            })
        }

        this.createInputControl($inputDiv, focus);
    };

    REditorDialog.prototype.handleAddInputControlEvent = function ($target, $contents, focus) {
        var index = $target.index();
        this.createResultControlLayout(index, true, $contents, focus);
        this.getInputValue();
        this.renderValidation();
    };

    REditorDialog.prototype.handleDeleteButtonClick = function ($target) {
        $target.remove();
        this.getInputValue();
        this.renderValidation();
    };

    REditorDialog.prototype.createInputControl = function ($parent, focus) {
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

    REditorDialog.prototype.getInputValue = function () {
        var inputValue;
        var controls = this.$resultNames.find('.brtc-va-widget-contents-input-control');

        inputValue = [];
        for (var i = 0; i < controls.length; i++) {
            if ($(controls[i]).val()) {
                inputValue.push($(controls[i]).val());
            }
        }
        this.resultColumns = inputValue;
        //return inputValue;
    };

    REditorDialog.prototype.setInputValue = function (value) {
        var controls = this.$resultNames.find('.brtc-va-widget-contents-input-control');
        for (var i = 0; i < controls.length; i++) {
            $(controls[i]).val(value[i] || '');
        }
    };

    REditorDialog.prototype.fillControlValues = function () {
        var columnData = this.options.dataMap ? (this.options.fnUnit[IN_DATA][0] ? this.options.dataMap[this.options.fnUnit[IN_DATA][0]].columns : []) : [];
        var byteData = [];
        var data = [];
        $.each(columnData, function (index, value) {
            if (value.type === "byte[]") {
                byteData.push(value);
            } else {
                data.push(value);
            }
        });
        this.groupbyControl.setItems(data);
        this.columnsControl.setItems(byteData);
    };


    REditorDialog.prototype.renderValues = function () {
        var param = this.options.fnUnit.param;

        this.columnsControl.setSelectedItems(param.columns[0]);

        var paramGroupBy = this.options.fnUnit.param.groupby;
        if (paramGroupBy) {
            this.groupbyControl.setSelectedItems(paramGroupBy);
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

        var paramResultColumn = this.options.fnUnit.param['result-names'];
        this.setInputValue(paramResultColumn);

        this.selectedColumns = param.columns[0];
        this.selectedGroupby = paramGroupBy;
        this.selectedFactors = paramFactors;
        this.resultColumns = paramResultColumn;
    };

    REditorDialog.prototype.renderValidation = function () {
        //this.selectedColumns = this.columnsControl.val();
        //this.selectedGroupby = this.groupbyControl.val();

        if (this.selectedColumns.length === 0) {
            this.createValidationContent(this.$columns.parent(), '"Columns" filed is required.', true)
        } else {
            this.removeValidation(this.$columns.parent().parent());
        }
        if (this.resultColumns.length === 0) {
            this.createValidationContent(this.$resultNames, '"Result Columns" filed is required.', true)
        }
        else {
            var isValid = true;
            for (var i in this.resultColumns) {
                if (!(Brightics.VA.Core.Utils.InputValidator.isValid.columnNameType(this.resultColumns[i]))) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                this.removeValidation(this.$resultNames);
            }
            else {
                this.createValidationContent(this.$resultNames, 'If the column name begins with _ or is only a number, it may be a problem in some functions later.', true);
            }
        }
    };

    REditorDialog.prototype.removeValidation = function ($parent) {
        $parent.find('.brtc-va-editors-sheet-panels-validation-tooltip').remove();
        $parent.find('.brtc-va-editors-sheet-controls-propertycontrol-label').removeClass('brtc-va-editors-sheet-controls-propertycontrol-label-error');
        $parent.find('.brtc-va-editor-sheet-panels-validation-error').removeClass('brtc-va-editor-sheet-panels-validation-error');
        $parent.find('.brtc-va-editors-sheet-panels-validation-tooltip').remove();
    };

    REditorDialog.prototype.createValidationContent = function ($parent, problemData, clearBoth) {
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

    REditorDialog.prototype.addPropertyControl = function (label, callback, option) {
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

    REditorDialog.prototype.createColumnList = function ($control, widgetOptions, className, additionalCss) {
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

    REditorDialog.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };

    REditorDialog.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    REditorDialog.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    REditorDialog.prototype.handleOkClicked = function () {

        this.dialogResult = {
            OK: true,
            Cancel: false,
            queryStatement: this.codeMirror.getValue(),
            columns: this.selectedColumns,
            groupbys: this.selectedGroupby,
            factors: this.selectedFactors,
            resultNames: this.resultColumns
        };
        this.$mainControl.dialog('close');
    };

    REditorDialog.prototype.getTitle = function () {
        return 'R';
    };

    Brightics.VA.Core.Dialogs.REditorDialog = REditorDialog;

}).call(this);