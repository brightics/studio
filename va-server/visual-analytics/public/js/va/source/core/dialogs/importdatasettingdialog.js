/**
 * Created by SDS on 2018-03-15.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ImportDataSettingDialog(parentId, options) {
        this.results = $.extend(true, {}, options.param);
        this.DATA_PARAM = {
            'copy-from': { label: 'Import From', type: 'radio', category: 'source' },
            'input-path': { label: 'Input Path', type: 'code', category: 'source', mandatory: true, placeholder: 'ex. /temp/data.csv' },
            'ip': { label: 'IP', type: 'code', category: 'source', mandatory: true },
            'port': { label: 'Port', category: 'source', mandatory: true },
            'output-path': { label: 'Output Path', type: 'code', category: 'target', mandatory: true },
            'datasource-name': { label: 'Datasource', type: 'dropDown', category: 'source', mandatory: true },
            'table-name': { label: 'Table Name', type: 'code', category: 'source', mandatory: true },
            'column-type': {
                label: 'Column Type',
                type: 'code',
                category: 'source',
                placeholder: 'ex. Int, String, String'
            },
            'delimiter': { label: 'Delimiter', type: 'radio', category: 'source' },
            'quote': { label: 'Quote', type: 'radio', category: 'source' },
            'array-delimiter': { label: 'Array Delimiter', type: 'radio', category: 'source' },
            'array-start-string': { label: 'Array Start', type: 'radio', category: 'source' },
            'array-end-string': { label: 'Array End', type: 'radio', category: 'source' },
            'key-value-delimiter': { label: 'Key Value', type: 'radio', category: 'source' },
            'map-start-string': { label: 'Map Start', type: 'radio', category: 'source' },
            'map-end-string': { label: 'Map End', type: 'radio', category: 'source' },
            'null-value': { label: 'Null Value', type: 'radio', category: 'source' },
            'nan-value': { label: 'NaN Value', type: 'radio', category: 'source' },
            'is-delete': { label: 'Overwrite', type: 'radio', category: 'target' },
            'connection-timeout': {
                label: 'Connection Timeout(sec)',
                type: 'number',
                category: 'source',
                placeholder: 'Default: 600',
                max: 3000
            },
            'execution-timeout': {
                label: 'Execution Timeout(sec)', type: 'number', category: 'source',
                placeholder: 'Default: 600',
                max: 3000
            }
        };

        this.RADIO_DATA_PARAM = {
            'copy-from': [
                { label: 'Repository', value: 'alluxio' },
                { label: 'HDFS', value: 'hdfs' },
                { label: 'Relational DB', value: 'jdbc' }
            ],
            'delimiter': [
                { label: 'Comma', value: ',' }, { label: 'Tab', value: '\t' },
                { label: 'Space', value: ' ' }, { label: 'Colon', value: ':' },
                { label: 'Semicolon', value: ';' }, { label: 'Other', value: 'Other' }
            ],
            'quote': [
                { label: 'Double Quotation', value: '"' }, { label: 'Other', value: 'Other' }
            ],
            'array-delimiter': [
                { label: 'Colon', value: ':' }, { label: 'Other', value: 'Other' }
            ],
            'array-start-string': [
                { label: 'Left Square Bracket', value: '[' }, { label: 'Other', value: 'Other' }
            ],
            'array-end-string': [
                { label: 'Right Square Bracket', value: ']' }, { label: 'Other', value: 'Other' }
            ],
            'key-value-delimiter': [
                { label: 'Equal', value: '=' }, { label: 'Other', value: 'Other' }
            ],
            'map-start-string': [
                { label: 'Left Curly Bracket', value: '{' }, { label: 'Other', value: 'Other' }
            ],
            'map-end-string': [
                { label: 'Right Curly Bracket', value: '}' }, { label: 'Other', value: 'Other' }
            ],
            'null-value': [
                { label: 'Empty String', value: '' }, { label: 'Other', value: 'Other' }
            ],
            'nan-value': [
                { label: 'NaN', value: 'NaN' }, { label: 'Other', value: 'Other' }
            ],
            'is-delete': [{ label: 'True', value: 'true' }, { label: 'False', value: 'false' }]
        };

        this.PARAM_VISIBLE = {
            'hdfs': ['copy-from', 'column-type', 'input-path', 'ip', 'port', 'output-path', 'delimiter', 'quote', 'array-delimiter', 'array-start-string', 'array-end-string', 'key-value-delimiter', 'map-start-string', 'map-end-string', 'null-value', 'nan-value', 'is-delete'],
            'jdbc': ['copy-from', 'column-type', 'datasource-name', 'output-path', 'is-delete', 'table-name', 'connection-timeout', 'execution-timeout'],
            'alluxio': ['copy-from', 'column-type', 'input-path', 'output-path', 'delimiter', 'quote', 'array-delimiter', 'array-start-string', 'array-end-string', 'key-value-delimiter', 'map-start-string', 'map-end-string', 'null-value', 'nan-value', 'is-delete']
        };

        Brightics.VA.Core.Dialogs.FnUnitDialog.call(this, parentId, options);
    }

    ImportDataSettingDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.FnUnitDialog.prototype);
    ImportDataSettingDialog.prototype.constructor = ImportDataSettingDialog;

    ImportDataSettingDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-style-minus-40">' +
            '    <div class="brtc-va-dialogs-body">' +
            '        <div class="brtc-va-dialogs-title brtc-style-display-flex brtc-style-height-45px brtc-style-padding-right-20"></div>' +
            '        <div class="brtc-va-dialogs-contents brtc-va-dialogs-fnunit brtc-style-display-flex brtc-style-width-97-p"></div>' +
            '        <div class="brtc-va-dialogs-buttonbar brtc-style-padding-right-30"></div>' +
            '    </div>' +
            '</div>');

        this.$titleArea = this.$mainControl.find('.brtc-va-dialogs-title');
    };

    ImportDataSettingDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        this.$contentsAreaWrapper = $('' +
            '<div class="brtc-va-views-properties-pages import-setting-dialog brtc-style-width-full rtc-style-overflow-hidden">' +
            '   <div class="brtc-va-views-properties-pages-contents-area brtc-style-padding-right-10 brtc-style-relative brtc-style-full"></div>' +
            '</div>');
        this.$contentsAreaWrapper.css({
            width: this.options.width,
            height: this.options.height
        });
        $parent.append(this.$contentsAreaWrapper);
        this.$contentsArea = this.$contentsAreaWrapper.find('.brtc-va-views-properties-pages-contents-area');
        this.codeArgumentControlMap = {};

        this.addPropertyControl('Source', function ($parent) {
            _this.variableArea = $parent;
            _this.createCategoryControl($parent, 'source');
        });

        this.addPropertyControl('Target', function ($parent) {
            _this.variableArea = $parent;
            _this.createCategoryControl($parent, 'target');
        });

        this.setParamControlVisible(_this.results['copy-from']);
        this.renderValidation();

        this.$contentsAreaWrapper.find('.brtc-va-views-properties-pages-contents-area').perfectScrollbar();
    };

    ImportDataSettingDialog.prototype.renderValidation = function () {
        this.removeValidation();
    }

    ImportDataSettingDialog.prototype.createValidationContent = function ($parent, problemData, clearBoth) {
        var $problemContent = $('<div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">' +
            '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
            '   <div class="brtc-va-editors-sheet-panels-validation-tooltip">' + problemData.message + '</div>' +
            '</div>');
        $parent.append($problemContent);
        $parent.addClass('brtc-va-editor-sheet-panels-validation-error');
        if (clearBoth) $problemContent.css('clear', 'both');
        $problemContent.show();
    };

    ImportDataSettingDialog.prototype.removeValidation = function () {
        this.$mainControl.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
        this.$mainControl.find('.brtc-va-editors-sheet-controls-propertycontrol-label').removeClass('brtc-va-editors-sheet-controls-propertycontrol-label-error');
        this.$mainControl.find('.brtc-va-editor-sheet-panels-validation-error').removeClass('brtc-va-editor-sheet-panels-validation-error');
        this.$mainControl.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
    };

    ImportDataSettingDialog.prototype.addPropertyControl = function (label, callback, option) {
        var _this = this,
            $propertyControl = $('' +
                '<div class="brtc-va-views-properties-pages-controls-propertycontrol">' +
                '   <div class="brtc-va-views-properties-pages-controls-propertycontrol-label"></div>' +
                '   <div class="brtc-va-views-properties-pages-controls-propertycontrol-contents">' +
                '</div>');

        if (option) {
            if (option.mandatory) {
                label = '<div>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(label) +
                    '   <div class="brtc-va-editors-sheet-controls-propertycontrol-mandatory">*</div>' +
                    '</div>';
            }
        }
        this.$contentsArea.append($propertyControl);

        $propertyControl.jqxExpander({
            theme: Brightics.VA.Env.Theme,
            arrowPosition: 'left',
            initContent: function () {
                if (typeof callback === 'function') {
                    callback.call(_this, $propertyControl.find(".brtc-va-views-properties-pages-controls-propertycontrol-contents"), option);
                }
            }
        });
        $propertyControl.jqxExpander('setHeaderContent', label);
        return $propertyControl;
    };

    ImportDataSettingDialog.prototype.createCategoryControl = function ($contents, category) {
        var keyList = Object.keys(this.DATA_PARAM);
        var $argsArea, key;
        for (var i = 0; i < keyList.length; i++) {
            key = keyList[i];
            if (this.DATA_PARAM[key].category !== category) continue;

            $argsArea = $('' +
                '<div class="control-row" control-type="' + key + '">' +
                '   <div class="column-1">' + this.DATA_PARAM[key].label + ': </div>' +
                '   <div class="column-2" />' +
                '</div>');
            $argsArea.find('.column-1').addClass(key);
            if (this.DATA_PARAM[key].mandatory) $argsArea.find('.column-1').addClass('mandatory');
            $contents.append($argsArea);

            var param = this.results;
            if (this.DATA_PARAM[key].type === 'radio') {
                this.createRadioArgumentControl($argsArea, key);
                this.setRadioControlValue(key, param[key] || '');
            } else if (this.DATA_PARAM[key].type === 'code') {
                this.createCodeArgumentControl($argsArea, key);
                this.setCodeControlValue(key, param[key] || '');
            } else if (this.DATA_PARAM[key].type === 'dropDown') {
                this.createDropDownArgumentControl($argsArea, key);
                this.setDropDownControlValue(key, param[key] || '');
            } else if (this.DATA_PARAM[key].type === 'number') {
                this.createNumberInputArgumentControl($argsArea, key);
                this.setNumberInputControlValue(key, param[key] || '');
            } else {
                this.createInputArgumentControl($argsArea, key);
                this.setInputControlValue(key, param[key] || '');
            }
        }
    };

    ImportDataSettingDialog.prototype.createRadioArgumentControl = function ($parent, key) {
        var _this = this;
        var $control = $('<div class="brtc-va-views-properties-pages-controls-propertycontrol-button" param-key="' + key + '"/>');
        $parent.find('.column-2').append($control);

        for (var i = 0; i < this.RADIO_DATA_PARAM[key].length; i++) {
            var label = this.RADIO_DATA_PARAM[key][i].label,
                value = this.RADIO_DATA_PARAM[key][i].value;
            if (value === '"') {
                value = 'quot';
            }
            var $radioDiv = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton" param-value="' + value + '"/>');
            $control.append($radioDiv);

            if (value == 'Other') {
                $radioDiv.append('' +
                    '<div class="brtc-va-delimiter-input-wrapper">' +
                    '   <input type="text" class="brtc-va-delimiter-input"/>' +
                    '</div>');
                _this.createRadioButton($radioDiv, key);
                $radioDiv.find('.brtc-va-delimiter-input').jqxInput({
                    theme: Brightics.VA.Env.Theme,
                    width: 57,
                    height: 24
                });
                $radioDiv.find('.brtc-va-delimiter-input').on('change', function () {
                    _this.results[key] = $(this).val();
                    _this.renderValidation();
                });
            } else {
                $radioDiv.text(label);
                _this.createRadioButton($radioDiv, key);
            }

            $radioDiv.on('checked', function (event) {
                var $target = $(event.target);
                if ($target.attr('param-value') == 'quot') {
                    _this.results[key] = '"';
                } else {
                    _this.results[key] = $target.attr('param-value');
                }
                if ($target.attr('param-value') == 'Other') {
                    var $input = $target.find('.brtc-va-delimiter-input');
                    _this.results[key] = $input.val();
                }

                if (key === 'copy-from' || key === 'copy-to') {
                    _this.setParamControlVisible(_this.results[key]);
                    _this.$mainControl.find('.brtc-va-dialogs-contents').perfectScrollbar('update');
                }
                _this.renderValidation();
            });
        }
    };

    ImportDataSettingDialog.prototype.setParamControlVisible = function (copyFromType) {
        var allControlList = Object.keys(this.DATA_PARAM);
        var visibleControlList = this.PARAM_VISIBLE[copyFromType];
        var controlTr;

        for (var i = 0; i < allControlList.length; i++) {
            controlTr = this.$mainControl.find('div[control-type=' + allControlList[i] + ']');
            if (visibleControlList.indexOf(allControlList[i]) >= 0) {
                controlTr.css('display', '');
            } else {
                controlTr.css('display', 'none');
            }

            controlTr.find('.CodeMirror').each(function (i, $el) {
                $el.CodeMirror.refresh();
            });
        }
    };

    ImportDataSettingDialog.prototype.createCodeArgumentControl = function ($parent, key) {
        var _this = this;

        var $inputControl = $('<textarea  class="brtc-va-views-properties-pages-controls-propertycontrol-code-input" param-key="' + key + '"/>');
        $parent.find('.column-2').append($inputControl);
        var controlOptions = {
            verifier: key === 'column-type' ? new Brightics.VA.Core.Verifier() : new Brightics.VA.Core.Verifier.CFVariableVerifier(),
            mode: 'brtc-controlflow-variable',
            scrollbarStyle: 'null',
            placeholder: this.DATA_PARAM[key].placeholder || '',
            lineWrapping: false,
            lineNumbers: false,
            // viewportMargin: Infinity,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                "Tab": false, // Let focus go to next control
                "Shift-Tab": false // Let focus go to previous control
            },
            showTrailingSpace: true,
            hintOptions: {
                paramKey: key,
                list: key === 'column-type' ? ['Int', 'Long', 'String', 'Double', 'Boolean'] : [] //, 'Array(Double)', 'Array(String)', 'Array(Byte)', 'Map(Int, Double)'] : []
            }
        };
        var codeMirror = _this.createCodeMirrorControl($inputControl, controlOptions);
        Brightics.VA.Core.Utils.WidgetUtils.changeCodeMirrorLineToSingle(codeMirror);
        codeMirror.on('blur', function (instance, event) {
            _this.results[key] = key == 'column-type' ? _this.splitStringToArrayWithTrim(instance.getValue()) : instance.getValue();
            _this.renderValidation();
        });
        this.codeArgumentControlMap[key] = codeMirror;
    };

    ImportDataSettingDialog.prototype.splitStringToArrayWithTrim = function (str) {
        var mapCheckValue = [];
        var valueList = str.split(',');
        valueList = $.map(valueList, function (val, i) {
            return val.trim();
        });

        for (var i = 0; i < valueList.length; i++) {
            if (valueList[i].toLowerCase().indexOf('map') != -1) {
                var mapValue = valueList[i] + ',' + valueList[++i];
                mapCheckValue.push(mapValue);
            } else {
                mapCheckValue.push(valueList[i]);
            }
        }
        return mapCheckValue;
    };

    ImportDataSettingDialog.prototype.createDropDownArgumentControl = function ($parent, key) {
        var _this = this;
        var $control = $('<div class="brtc-va-views-properties-pages-controls-propertycontrol-dropdown" param-key="' + key + '"/>');
        $parent.find('.column-2').append($control);

        _this.createDropDownList($control, {});
        $control.on('change', function (event) {
            _this.results[key] = $(this).val();
            _this.renderValidation();
        });

        if (key === 'datasource-name') {
            var source = {
                datatype: 'json',
                datafields: [
                    { name: 'datasourceName', type: 'string' },
                    { name: 'datasourceType', type: 'string' }
                ],
                url: 'api/va/v2/datasources?type=RDB'
            };

            var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function () {
                    $control.val(_this.results[key]);
                }
            });

            $control.jqxDropDownList({
                source: dataAdapter,
                displayMember: 'datasourceName',
                valueMember: 'datasourceName'
            })
        }
    };

    ImportDataSettingDialog.prototype.createNumberInputArgumentControl = function ($parent, key) {
        var _this = this;
        var $control = $('<div class="brtc-va-views-properties-pages-controls-propertycontrol-numberinput" param-key="' + key + '"/>');
        $parent.find('.column-2').append($control);
        var inputOption = { placeholder: this.DATA_PARAM[key].placeholder };
        if (this.DATA_PARAM[key].max) inputOption.max = this.DATA_PARAM[key].max;
        var input = _this.createNumberInput($control, inputOption);
        Brightics.VA.Core.Utils.WidgetUtils.putData($control, key, input);
        input.onChange(function (value) {
            _this.results[key] = value;
            _this.renderValidation();
        });
    };

    ImportDataSettingDialog.prototype.createInputArgumentControl = function ($parent, key) {
        var _this = this;
        var $control = $('<input type="text" class="brtc-va-views-properties-pages-controls-propertycontrol-input" param-key="' + key + '"/>');
        $parent.find('.column-2').append($control);
        _this.createInput($control, {});
        $control.on('change', function (event) {
            _this.results[key] = $(this).val();
            _this.renderValidation();
        });
    };

    ImportDataSettingDialog.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper controlflow"></div>');
        $control.wrap($wrapper);
    };

    ImportDataSettingDialog.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    ImportDataSettingDialog.prototype.createRadioButton = function ($control, groupName) {
        this.wrapControl($control);

        if (groupName === 'quote' || groupName === 'array-delimiter' || groupName === 'array-start-string' || groupName === 'array-end-string' || groupName === 'key-value-delimiter' || groupName === 'map-start-string' || groupName === 'map-end-string' || groupName === 'null-value' || groupName === 'nan-value') {
            this.addClassToWrapper($control, 'brtc-va-editors-control-controls-radiobutton-default brtc-va-editors-sheet-controls-width-6');
        } else {
            this.addClassToWrapper($control, 'brtc-va-editors-control-controls-radiobutton-default brtc-va-editors-sheet-controls-width-4');
        }

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '25px',
            groupName: groupName
        };
        $control.jqxRadioButton(options);
    };

    ImportDataSettingDialog.prototype.setRadioControlValue = function (key, value) {
        if (value === '"') {
            value = 'quot';
        }

        var $control = [];
        if (value != '\\') {
            $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-button[param-key="' + key + '"] ' +
                '.brtc-va-editors-sheet-controls-propertycontrol-radiobutton[param-value="' + value + '"]');
        }

        if ($control.length == 0) {
            $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-button[param-key="' + key + '"] ' +
                '.brtc-va-editors-sheet-controls-propertycontrol-radiobutton[param-value="Other"]');
            $control.jqxRadioButton({ checked: true });
            if (value === 'quot') {
                value = '"';
            }
            $control.find('.brtc-va-delimiter-input').jqxInput('val', value);
        } else {
            $control.jqxRadioButton({ checked: true });
        }
    };

    ImportDataSettingDialog.prototype.createCodeMirrorControl = function ($control, options) {
        this.wrapControl($control);
        $control.addClass('brtc-va-editors-sheet-controls-textareacontrol');
        return CodeMirror.fromTextArea($control[0], options);
    };

    ImportDataSettingDialog.prototype.setCodeControlValue = function (key, value) {
        var control = this.codeArgumentControlMap[key];
        var valueList = this.splitStringToArrayWithTrim(control.getValue());
        if (value.toString() !== valueList.toString()) {
            control.setValue(value.toString());
        }
    };

    ImportDataSettingDialog.prototype.createDropDownList = function ($control) {
        this.wrapControl($control);

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '25px'
        };
        $control.jqxDropDownList(options);
    };

    ImportDataSettingDialog.prototype.setDropDownControlValue = function (key, value) {
        var $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-dropdown[param-key="' + key + '"]');
        if ($control.val() !== value) {
            $control.val(value);
        }
    };

    ImportDataSettingDialog.prototype.createNumberInput = function ($control, option) {
        this.wrapControl($control);

        var options = {
            min: 0
        };
        $.extend(true, options, option);
        return new Brightics.VA.Core.Editors.Sheet.Controls.NumericInput($control, options);
    };

    ImportDataSettingDialog.prototype.setNumberInputControlValue = function (key, value) {
        var $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-numberinput[param-key="' + key + '"]');
        var input = Brightics.VA.Core.Utils.WidgetUtils.getData($control, key);
        input.setValue(value);
    };

    ImportDataSettingDialog.prototype.createInput = function ($control, option) {
        this.wrapControl($control);

        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px'
        };
        $.extend(true, options, option);

        $control.jqxInput(options);
    };

    ImportDataSettingDialog.prototype.setInputControlValue = function (key, value) {
        var $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-input[param-key="' + key + '"]');
        if ($control.val() !== value) {
            $control.val(value);
        }
    };

    ImportDataSettingDialog.prototype.handleOkClicked = function () {
        this.options.fnUnit.param = $.extend(true, {}, this.results);

        this.dialogResult = {
            OK: true,
            Cancel: false,
            results: {fnUnit: this.options.fnUnit}
        };
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.ImportDataSettingDialog = ImportDataSettingDialog;

}).call(this);