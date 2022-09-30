/**
 * Created by sds on 2018-10-25.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    function PropertiesPanelDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    PropertiesPanelDialog.prototype = Object.create(_super);
    PropertiesPanelDialog.prototype.constructor = PropertiesPanelDialog;

    PropertiesPanelDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);

        this.dialogOptions.width = 600;
        this.dialogOptions.height = 540;
        this.dialogOptions.keyboardCloseKey = '';
        this.dialogOptions.closeOnEscape = false;

        this.controls = {};
    };

    PropertiesPanelDialog.prototype.createDialogContentsArea = function ($parent) {
        var option = {
            fnUnit: this.options.fnUnit,
            dataProxy: this.options.dataProxy,
            modelEditor: this.options.modelEditor,
            renderValues: this.renderValues.bind(this),
            fillControlValues: this.fillControlValues.bind(this)
        };
        this.popupProperty = new Brightics.VA.Core.Functions.Library.DialogPanelProperties.propertiesPanel($parent, option);
        this.createContentsAreaControls(this.popupProperty.$contentsArea);
        this.popupProperty.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
        this.popupProperty._initializePerfectScroll();
    };

    PropertiesPanelDialog.prototype.fillControlValues = function () {

    };

    PropertiesPanelDialog.prototype.renderValues = function () {

    };

    PropertiesPanelDialog.prototype.handleOkClicked = function () {
        this.dialogResult.param = this.popupProperty.getParams();
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    PropertiesPanelDialog.prototype.bindValidation = function (ctrlInfo) {
        // var _this = this;
        // if (typeof ctrlInfo.$target == 'undefined') {
        //     return;
        // }
        // if (ctrlInfo.mandatory || this.options.isMandatory) {
        //     this.checkValidation(ctrlInfo);
        //     ctrlInfo.$target.on('change', function (event) {
        //         _this.checkValidation(ctrlInfo)
        //     })
        // }
    };

    PropertiesPanelDialog.prototype.checkValidation = function (ctrlInfo) {
        this.removeValidation(ctrlInfo.$target);
        if (ctrlInfo.control &&
            (!ctrlInfo.control.getValue() || $.isEmptyObject(ctrlInfo.control.getValue()))) {
            var errObj = {
                $target: ctrlInfo.$target,
                message: this.popupProperty.problemFactory.makeMessage({
                    errorCode: 'BR-0033',
                    param: ctrlInfo.$target,
                    messageParam: [ctrlInfo.label]
                })
            };
            this.createValidationContent(errObj)
        }
    };

    PropertiesPanelDialog.prototype.createValidationContent = function (problemData) {
        var $problemContent = $('<div class="brtc-va-editors-sheet-validation-tooltip-wrapper-dialog">' +
            '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' +
            '   <div class="brtc-va-editors-sheet-validation-tooltip-dialog">' +
            Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(problemData.message) +
            '</div>' +
            '</div>');
        problemData.$target.append($problemContent);
        problemData.$target.addClass('brtc-va-editors-sheet-validation-error-dialog');
        $problemContent.show();
    };

    PropertiesPanelDialog.prototype.removeValidation = function ($target) {
        $target.find('.brtc-va-editors-sheet-validation-tooltip-wrapper-dialog').remove();
        $target.removeClass('brtc-va-editors-sheet-validation-error-dialog');
    };

    PropertiesPanelDialog.prototype.destroy = function () {
        this.popupProperty.destroy();
        this.$mainControl.dialog('destroy');
        this.$mainControl = undefined;
    };

    PropertiesPanelDialog.prototype.createInput = function ($parent, options) {
        var _this = this;

        var $elements = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        $parent.append($elements);
        var jqxOptions = {
            placeHolder: 'Enter value'
        }
        if (options.widgetOption) {
            jqxOptions = $.extend(true, jqxOptions, options.widgetOption);
        }
        var addClass = (options.addClass) ? options.addClass : '';
        var addCSS = (options.addCSS) ? options.addCSS : '';

        var inputControl = _this.popupProperty.createInput($elements, jqxOptions, addClass, addCSS);


        inputControl.setValue = function (value) {
            $elements.val(value);
        };
        inputControl.getValue = function () {
            return $elements.val();
        };
        inputControl.setDisable = function () {
            this.jqxInput({disabled: true});
        };
        inputControl.setEnable = function () {
            this.jqxInput({disabled: false});
        };

        // this.bindValidation({
        //     $target: options.$parent,
        //     control: inputControl,
        //     mandatory: true,
        //     label: options.label
        // });

        return inputControl
    };

    PropertiesPanelDialog.prototype.createTextArea = function ($parent, options) {
        // var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textarea"/>');
        // $parent.append($elements);

        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>');
        var $elements = $('<textarea class="brtc-va-editors-sheet-controls-textarea"></textarea>');
        $wrapper.append($elements);
        $parent.append($wrapper);

        var jqxOptions = {
            placeholder: 'sepal_length + 1',
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                "Tab": false, // Let focus go to next control
                "Shift-Tab": false // Let focus go to previous control
            },
            autofocus: false,
            hintOptions: {list: []}
        };

        jqxOptions = $.extend(true, jqxOptions, options.widgetOption);
        var addClass = (options.addClass) ? options.addClass : ' ';
        $wrapper.addClass(addClass);

        //CodeMirror 생성 시 this.mainControl로 하고있어서 add class는 parent에 함.
        var control = this.popupProperty.createTextAreaControl($elements, jqxOptions);

        control.codeMirror.options.hintOptions.list = this.columnData.slice();
        control.codeMirror.setSize('100%', options.widgetOption.height);

        return control;
    };

    PropertiesPanelDialog.prototype.createDropDownList = function ($parent, options) {
        var _this = this;
        var source = options.source || [];
        var jqxOptions = {
            source: source,
            selectedIndex: 0
        };
        if (options.widgetOption) {
            jqxOptions = $.extend(true, jqxOptions, options.widgetOption);
        }
        var addClass = (options.addClass) ? options.addClass : '';
        var addCSS = (options.addCSS) ? options.addCSS : '';

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        $parent.append($elements);
        var control = _this.popupProperty.createDropDownList($elements, jqxOptions, addClass, addCSS);

        control.setValue = function (value) {
            if (typeof value != 'undefined') {
                this.jqxDropDownList('selectItem', value);
            }
        };
        control.getValue = function () {
            const control = this.jqxDropDownList('getSelectedItem');
            return control !== null ? control.value : '';
        };
        control.setDisable = function () {
            this.jqxDropDownList({disabled: true});
        };
        control.setEnable = function () {
            this.jqxDropDownList({disabled: false});
        };


        return control;
    };

    PropertiesPanelDialog.prototype.createRadioButton = function ($parent, options) {
        var _this = this;
        var CONTROL_KEY = options.key;
        var source = options.source;
        var jqxOptions = {
            // disabled: options.disabled,
            groupName: CONTROL_KEY
        };

        if (options.widgetOption) {
            jqxOptions = $.extend(true, jqxOptions, options.widgetOption);
        }
        var addClass = (options.addClass) ? options.addClass : '';
        var addCSS = (options.addCSS) ? options.addCSS : '';

        var controlVal = function () {
            if (options.value && source.some(function (srcObj) {
                    return srcObj.value == options.value
                })) {
                return options.value;
            }
        }();
        var control = {}, $elements = {};
        source.forEach(function (srcObj) {
            $elements[CONTROL_KEY + '.' + srcObj.value] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">' + srcObj.label + '</div>');
            $parent.append($elements[CONTROL_KEY + '.' + srcObj.value]);
            control[CONTROL_KEY + '.' + srcObj.value] = _this.popupProperty.createRadioButton($elements[CONTROL_KEY + '.' + srcObj.value], jqxOptions, addClass, addCSS);

            control[CONTROL_KEY + '.' + srcObj.value].on('checked', function (event) {
                controlVal = srcObj.value;
                // _this.configureControls($parent, options.attr, controlVal);
            });
        });

        control.getValue = function () {
            return controlVal;
        };
        control.setValue = function (value) {
            $elements[CONTROL_KEY + '.' + value].jqxRadioButton('check');
        };

        return control;
    };

    PropertiesPanelDialog.prototype.createCheckBox = function ($parent, options) {
        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox"/>');
        $parent.append($elements);

        var _this = this;
        var jqxOptions = {
            width: 23,
            height: 27
        };
        if (options.widgetOption) {
            jqxOptions = $.extend(true, jqxOptions, options.widgetOption);
        }

        var control = this.popupProperty.createCheckBox($elements, jqxOptions);
        control.on('checked', options.checkedFunc);
        control.on('unchecked', options.uncheckedFunc);

        control.setValue = function (value) {
            if (value) {
                $elements.jqxCheckBox('check');
            } else {
                $elements.jqxCheckBox('uncheck');
            }
        };
        control.getValue = function () {
            return $elements.val();
        };
        return control;

    };

    PropertiesPanelDialog.prototype.createColumnList = function ($parent, options) {
        var $columnSelector = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');
        $parent.append($columnSelector);

        var _this = this;
        var jqxOptions = {
            maxRowCount: 3,
            multiple: true,
            changed: function () {
                _this.bindValidation({
                    mandatory: true,
                    $target: $columnSelector,
                    control: control,
                    label: 'Column'
                });
            }
        };
        if (options.widgetOption) {
            jqxOptions = $.extend(true, jqxOptions, options.widgetOption);
        }
        var addClass = (options.addClass) ? options.addClass : '';
        var control = this.popupProperty.createColumnList($columnSelector, jqxOptions, addClass);

        var columnData = this.popupProperty.getColumnData();
        control.setItems(columnData);


        control.setValue = function (value) {
            this.setSelectedItems(value);
            _this.bindValidation({
                mandatory: true,
                $target: $columnSelector,
                control: control,
                label: 'Column'
            });
        };
        control.getValue = function () {
            return this.getSelectedItems();
        };
        return control;
    };


    Brightics.VA.Core.Dialogs.PropertiesPanelDialog = PropertiesPanelDialog;

}).call(this);