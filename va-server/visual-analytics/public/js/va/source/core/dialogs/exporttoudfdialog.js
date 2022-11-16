(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var INPUT_VARIABLES_LIMIT = 10;
    var OUTPUT_ALIAS_LIMIT = 10;

    function ExportToUDFDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    ExportToUDFDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ExportToUDFDialog.prototype.constructor = ExportToUDFDialog;

    ExportToUDFDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 982;
        this.dialogOptions.height = 871;
        this.dialogOptions.keyboardCloseKey = '';
    };

    ExportToUDFDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-exporttoudfdialog-contents');

        this.$progress = $('' +
            '   <div class="brtc-va-progress">' +
            '       <div>' +
            '           <span class="brtc-va-progress-loading"/>' +
            '           <p>Testing...</p>' +
            '       </div>' +
            '</div>');
        $parent.append(this.$progress);
        this.$progress.hide();

        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold mandatory">UDF Name</div>' +
            '   <div class ="brtc-va-dialogs-exporttoudfdialog-name-container">' +
            '       <input type="text" class="brtc-va-dialogs-exporttoudfdialog-name-input brtc-s-style-dialogs-exporttoudfdialog-name-input" maxlength="80"  isMandatory="true" valid-type="type2">' +
            '       <input type="text" class="brtc-va-dialogs-exporttoudfdialog-name-version-input brtc-s-style-dialogs-exporttoudfdialog-name-version-input" maxlength="80" readonly>' +
            '   </div>' +

            // '   <input type="text" class="brtc-va-dialogs-exporttoudfdialog-version-input" maxlength="80"  isMandatory="true">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">Description</div>' +
            '   <div class="brtc-va-dialogs-exporttoudfdialog-description-container"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">Input Variables</div>' +
            '   <div class="brtc-va-dialogs-exporttoudfdialog-input-variables-container"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold mandatory"  >Script</div>' +
            '   <div class="brtc-va-dialogs-exporttoudfdialog-script-container"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold mandatory">Out Alias</div>' +
            '   <div class="brtc-va-dialogs-exporttoudfdialog-out-alias-container"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">Test Result</div>' +
            '   <div class="brtc-va-dialogs-exporttoudfdialog-test-result-container brtc-s-style-dialogs-exporttoudfdialog-test-result-container">' +
            '   </div>' +
            '</div>');

        this.createNameControl($parent.find('.brtc-va-dialogs-exporttoudfdialog-name-input'));
        this.createNameVersionControl($parent.find('.brtc-va-dialogs-exporttoudfdialog-name-version-input'));
        this.createDescriptionControl($parent.find('.brtc-va-dialogs-exporttoudfdialog-description-container'));
        this.createInputVariablesControl($parent.find('.brtc-va-dialogs-exporttoudfdialog-input-variables-container'));
        this.createScriptControl($parent.find('.brtc-va-dialogs-exporttoudfdialog-script-container'));
        this.createOutAlias($parent.find('.brtc-va-dialogs-exporttoudfdialog-out-alias-container'));
        this.createResultControl($parent.find('.brtc-va-dialogs-exporttoudfdialog-test-result-container'));


        $parent.perfectScrollbar();
        $parent.perfectScrollbar('update');
        this.renderUDFVersion();
        this.renderInOutValidation();
        this.$nameControl.focus();
    };

    ExportToUDFDialog.prototype.renderUDFVersion = function () {
        var _this = this;
        var option = {
            url: 'api/va/v2/ws/udfs?udfName=' + encodeURIComponent(this.$nameControl.val().trim()),
            type: 'GET',
            blocking: true,
            contentType: 'application/json; charset=utf-8'
        };
        $.ajax(option).done(function (result) {
            var nameAndVersion = _this.options.label + ' ver';
            if (result.length > 0) {
                _this.UDF_VERSION = (parseFloat(result[0].udf_version) + 0.1).toFixed(1);
                if (_this.options.version) {
                    nameAndVersion += parseFloat(_this.options.version).toFixed(1);
                } else {
                    nameAndVersion += parseFloat(result[0].udf_version).toFixed(1);
                }
            } else {
                _this.UDF_VERSION = '1.0';
                nameAndVersion += '1.0';
            }
            _this.$nameVersionControl.val(nameAndVersion);
            if (_this.options.type === 'save') {
                _this.$nameVersionControl.hide();
                _this.$nameControl.show();
            } else {
                _this.$nameVersionControl.show();
                _this.$nameVersionControl.jqxInput({disabled: true});
                _this.$nameControl.hide();
            }
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });
    };

    ExportToUDFDialog.prototype.createNameControl = function ($control) {
        var _this = this;
        this.$nameControl = $control.jqxInput({
            placeHolder: 'Enter UDF name',
            theme: Brightics.VA.Env.Theme
        });
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition(this.$nameControl);
        this.$nameControl.val(this.options.label);
        this.$nameControl.on('change', function () {
            _this.renderValidation(_this.$nameControl, '"UDF Name" is required.', false);
            _this.renderUDFVersion();
        });

        this.renderValidation(this.$nameControl, '"UDF Name" is required.', false);

    };

    ExportToUDFDialog.prototype.createNameVersionControl = function ($control) {
        this.$nameVersionControl = $control.jqxInput({
            theme: Brightics.VA.Env.Theme
        });
        this.$nameVersionControl.val(this.options.label);
        this.$nameVersionControl.hide();
    };

    ExportToUDFDialog.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            focus: false,
            height: 125,
            description: this.options.description,
            okButton: this.$okButton,
            maxLength: 2000
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);

        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
        });
    };

    ExportToUDFDialog.prototype.createScriptControl = function ($control) {
        var _this = this;

        var aceOption = {
            mode: _this.options.fnUnit.func,
            commands: [],
            events: [],
            value: _this.options.fnUnit.param.script
        };

        this.scriptControl = Brightics.VA.Core.Widget.Factory.aceEditorControl($control, aceOption);
        this.scriptControl.getWrapperDiv().attr('isMandatory', true);
        /*this.$mainControl.on('resizing', function (event) {
         _this.scriptControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
         });*/
        /*this.scriptControl.getWrapperDiv().resizable({
         minHeight: 170,
         maxHeight: 400,
         handles: 's, se',
         resize: function (event, ui) {
         _this.scriptControl.getWrapperDiv().css('width', '100%');
         _this.scriptControl.resize();
         }
         });*/
        this.scriptControl.editor.on('blur', function () {
            _this.renderValidation(_this.scriptControl.getWrapperDiv(), '"Script" is required.', false, _this.scriptControl.getValue().trim());
        });
        this.renderValidation(_this.scriptControl.getWrapperDiv(), '"Script" is required.', false, _this.scriptControl.getValue().trim());
    };

    ExportToUDFDialog.prototype.createInputVariablesControl = function ($parent) {
        var _this = this;

        this.$InputVariablesLineArea = $('' +
            '<div class="brtc-va-dialogs-contents-statement-input-variables">' +
            '   <div class="brtc-va-dialogs-export-to-udf input-variable-empty">' +
            '       <div class="brtc-va-dialogs-contents-statement-input-variable-empty brtc-s-style-dialogs-contents-statement-input-variable-empty">' +
            '           <div>If you want to enter Input Variables, click to plus button.</div>' +
            '       </div>' +
            '   </div>' +
            '</div>');
        // var $footer = $('<div class="brtc-va-dialogs-contents-statement-input-variables-footer"></div>');

        // $parent.append(this.$InputVariablesLineArea).append($footer);
        $parent.append(this.$InputVariablesLineArea);
        this.emptyVariableArea = this.$InputVariablesLineArea.find('.input-variable-empty');

        var $addButton = $('<div class="brtc-va-dialogs-export-to-udf add-icon"></div>');
        $addButton.click(function () {
            _this.createInputVariable(true);
            _this.renderInOutValidation();
        });

        // $footer.append($addButton);
        this.$InputVariablesLineArea.find('.input-variable-empty').append($addButton);
        this.$InputVariablesLineArea.perfectScrollbar();
        this.$InputVariablesLineArea.perfectScrollbar('update');

        this.rednerInputVariables();

    };

    ExportToUDFDialog.prototype.rednerInputVariables = function () {
        // var inputs = this.options.fnUnit.param['input-variables'];
        var inputs = this.options.inputVariables;
        for (var i in inputs) {
            var $inputVariableControl = this.createInputVariable(true);
            $inputVariableControl.find('.input-variable-param-name').val(inputs[i].param_name);
            $inputVariableControl.find('.input-variable-type').val(inputs[i].arg_type);
            $inputVariableControl.find('.input-variable-param-description').val(inputs[i].description);
            this.$InputVariablesLineArea.perfectScrollbar('update');
        }
    };

    ExportToUDFDialog.prototype.createInputVariable = function (isMandatory) {
        this.emptyVariableArea.hide();
        var inputCnt = this.$InputVariablesLineArea.find('.input-variable').length;
        if (inputCnt >= INPUT_VARIABLES_LIMIT) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Up to 10 input variable can be added.');
            return;
        }
        return this.createInputs(this.$InputVariablesLineArea, '', isMandatory);
    };

    ExportToUDFDialog.prototype.createInputs = function ($parent, alias, isMandatory) {
        var _this = this;

        var $inputVariableControl = $('' +
            '<div class="brtc-va-dialogs-export-to-udf input-variable" >' +
            '   <div class="brtc-va-dialogs-export-to-udf input-variable-name"><input type="text" class="brtc-va-dialogs-export-to-udf input-variable-param-name"  maxlength="80"  valid-type="type1" isMandatory=' + isMandatory + ' /></div>' +
            '   <div class="brtc-va-dialogs-export-to-udf input-variable-type" maxlength="80"  isMandatory=' + isMandatory + ' />' +
            '   <div class="brtc-va-dialogs-export-to-udf input-variable-description"><input type="text" class="brtc-va-dialogs-export-to-udf input-variable-param-description" maxlength="400"/></div>' +
            '   <div class="brtc-va-dialogs-export-to-udf remove-icon" ></div>' +
            '   <div class="brtc-va-dialogs-export-to-udf add-icon" ></div>' +
            '</div>' +
            '');

        $parent.append($inputVariableControl);

        var $nameInput = $inputVariableControl.find('.input-variable-param-name');
        var $typeDropDownList = $inputVariableControl.find('.input-variable-type');
        var $descriptionInput = $inputVariableControl.find('.input-variable-param-description');
        var $addButton = $inputVariableControl.find('.add-icon');
        var $removeButton = $inputVariableControl.find('.remove-icon');

        $nameInput.jqxInput({
            placeHolder: "Enter name",
            theme: Brightics.VA.Env.Theme
        });
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($nameInput);
        $typeDropDownList.jqxDropDownList({
            placeHolder: Brightics.locale.common.enterArgumentType,
            autoDropDownHeight: true,
            source: ['string', 'double', 'int', 'expression'],
            theme: Brightics.VA.Env.Theme,
            height: '22px',
            width: '100px',
            selectedIndex: 0
        });
        $descriptionInput.jqxInput({
            placeHolder: Brightics.locale.common.enterDescription,
            theme: Brightics.VA.Env.Theme
        });
        $nameInput.jqxInput('val', alias);

        // $nameInput.focus();

        $nameInput.on('change', function () {
            _this.renderInOutValidation();
        });

        // $nameInput.keydown(function (key) {
        //     if (key.keyCode == 13) {
        //         _this.createInputVariable(true);
        //         _this.renderInOutValidation();
        //     }
        // });

        $removeButton.click(function () {
            $(this).closest('.brtc-va-dialogs-export-to-udf.input-variable').remove();
            var inputCnt = _this.$InputVariablesLineArea.find('.input-variable').length;
            if (inputCnt == 0) {
                _this.emptyVariableArea.show();
            }
            _this.renderInOutValidation();
            $parent.perfectScrollbar('update');
        });


        $addButton.click(function () {
            _this.createInputVariable(true);
            _this.renderInOutValidation();
        });
        $parent.perfectScrollbar('update');
        return $inputVariableControl;
    };

    ExportToUDFDialog.prototype.createOutAlias = function ($parent) {
        this.$outAliasArea = $('' +
            '<div class="brtc-va-dialogs-contents-statement-out-aliases">' +
            '</div>');
        $parent.append(this.$outAliasArea);

        this.$outAliasArea.perfectScrollbar();
        this.$outAliasArea.perfectScrollbar('update');

        this.rednerOutAliasControl();

    };

    ExportToUDFDialog.prototype.createOutTableAlias = function (isMandatory) {
        var outAliasCnt = this.$outAliasArea.find('.out-alias').length;
        if (outAliasCnt >= OUTPUT_ALIAS_LIMIT) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Up to 10 out alias can be added.');
            return;
        }

        return this.createOutAliasInput(this.$outAliasArea, '', isMandatory);

    };

    ExportToUDFDialog.prototype.createOutAliasInput = function ($parent, alias, isMandatory) {

        var _this = this;

        var $outAliasControl = $('' +
            '<div class="brtc-va-dialogs-export-to-udf out-alias" >' +
            '   <div class="brtc-va-dialogs-export-to-udf out-alias-name"><input type="text" class="brtc-va-dialogs-export-to-udf out-alias-param-name"  valid-type="type1" maxlength="80"  isMandatory=' + isMandatory + ' /></div>' +
            '   <div class="brtc-va-dialogs-export-to-udf out-alias-description"><input type="text" class="brtc-va-dialogs-export-to-udf out-alias-param-description" maxlength="400"  /></div>' +
            '   <div class="brtc-va-dialogs-export-to-udf remove-icon"></div>' +
            '   <div class="brtc-va-dialogs-export-to-udf add-icon" ></div>' +
            '</div>' +
            '');

        $parent.append($outAliasControl);

        var $outAliasName = $outAliasControl.find('.out-alias-param-name');
        var $outAliasDescription = $outAliasControl.find('.out-alias-param-description');
        var $removeButton = $outAliasControl.find('.remove-icon');
        var $addButton = $outAliasControl.find('.add-icon');

        $outAliasName.jqxInput({
            placeHolder: "Enter name",
            theme: 'office'
        });
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($outAliasName);
        $outAliasDescription.jqxInput({
            placeHolder: Brightics.locale.common.enterDescription,
            theme: 'office'
        });
        $outAliasName.jqxInput('val', alias);

        //$outAliasName.focus();

        $outAliasName.on('change', function () {
            _this.renderInOutValidation();
        });

        // $outAliasName.keydown(function (key) {
        //     if (key.keyCode == 13) {
        //         _this.createOutTableAlias(true);
        //         _this.renderInOutValidation();
        //     }
        // });

        $removeButton.click(function () {
            var outAliasCnt = _this.$outAliasArea.find('.out-alias').length;
            if (outAliasCnt > 1) {
                $(this).closest('.brtc-va-dialogs-export-to-udf.out-alias').remove();
                _this.renderInOutValidation();
                _this.refreshOutAliasFirstRowCss(_this.$outAliasArea);
                $parent.perfectScrollbar('update');
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There must be at least one out alias.');
                return;
            }
        });
        $addButton.click(function () {
            _this.createOutTableAlias(true);
            _this.renderInOutValidation();
        });
        $parent.perfectScrollbar('update');

        _this.refreshOutAliasFirstRowCss($parent);

        return $outAliasControl;
    };

    ExportToUDFDialog.prototype.refreshOutAliasFirstRowCss = function ($parent) {
        if ($parent.find('.brtc-va-dialogs-export-to-udf.out-alias').length == 1) {
            $parent.find('.brtc-va-dialogs-export-to-udf.out-alias').find('.out-alias-description').addClass('out-alias-desc-width-max');
            $parent.find('.brtc-va-dialogs-export-to-udf.out-alias').find('.remove-icon').hide();
            $parent.find('.brtc-va-dialogs-export-to-udf.out-alias').find('.add-icon').show();
            $parent.find('.brtc-va-dialogs-export-to-udf.out-alias').find('.add-icon').addClass('add-icon-margin-left-10');
        } else {
            $($parent.find('.brtc-va-dialogs-export-to-udf.out-alias')[0]).find('.out-alias-description').removeClass('out-alias-desc-width-max');
            $($parent.find('.brtc-va-dialogs-export-to-udf.out-alias')[0]).find('.remove-icon').show();
        }
    };

    ExportToUDFDialog.prototype.rednerOutAliasControl = function () {
        var outTableAlias = this.options.outputAlias;
        if (outTableAlias.length == 0) {
            this.createOutTableAlias(true);
        } else {
            for (var i in outTableAlias) {
                var $outAliasControl = this.createOutTableAlias(true);
                $outAliasControl.find('.out-alias-param-name').val(outTableAlias[i].param_name);
                $outAliasControl.find('.out-alias-param-description').val(outTableAlias[i].description);
            }
        }

    };
    ExportToUDFDialog.prototype.checkUDFName = function () {
        if (this.$nameControl.val().trim() === '') {
            return false;
        }
        return true;
    };

    ExportToUDFDialog.prototype.checkInputVariables = function () {
        var inputVariableControls = $.makeArray(this.$InputVariablesLineArea.find('.brtc-va-dialogs-export-to-udf.input-variable-param-name'));
        for (var i in inputVariableControls) {
            if ($(inputVariableControls[i]).val().trim() === '') {
                return false;
            }
            var blank_pattern = /[\s]/g;
            if (blank_pattern.test($(inputVariableControls[i]).val()) == true) {
                return false;
            }
        }
        return true;
    };

    ExportToUDFDialog.prototype.duplicateName = function ($controls, $secondControls) {
        var controls = $.makeArray($controls);
        if ($secondControls) {
            controls = controls.concat($.makeArray($secondControls));
        }
        var nameList = [];
        for (var i in controls) {
            if ($.inArray($(controls[i]).val().trim(), nameList) == -1) {
                nameList.push($(controls[i]).val().trim());
            } else {
                return true;
            }
        }
        return false;
    };

    ExportToUDFDialog.prototype.checkOutAlias = function () {
        var outTableAliasControls = $.makeArray(this.$outAliasArea.find('.brtc-va-dialogs-export-to-udf.out-alias-param-name'));
        for (var i in outTableAliasControls) {
            if ($(outTableAliasControls[i]).val().trim() === '') {
                return false;
            }
            var blank_pattern = /[\s]/g;
            if (blank_pattern.test($(outTableAliasControls[i]).val()) == true) {
                return false;
            }
        }
        return true;
    };

    ExportToUDFDialog.prototype.checkScript = function () {
        if (this.scriptControl.getValue().trim() === '') {
            return false;
        }
        return true;
    };

    ExportToUDFDialog.prototype.handleOkClicked = function () {
        var _this = this;

        if (!this.checkUDFName()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('UDF name is empty or contains spaces.');
            return;
        }

        if (!this.checkInputVariables()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Input variables are empty or contains spaces.');
            return;
        }

        if (!this.checkScript()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Script is empty.');
            return;
        }
        var inputControls = this.$InputVariablesLineArea.find('.brtc-va-dialogs-export-to-udf.input-variable-param-name');
        var outControls = this.$outAliasArea.find('.brtc-va-dialogs-export-to-udf.out-alias-param-name');
        if (this.duplicateName(inputControls)) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There is a duplicate name in the input variable.');
            return;
        }
        if (!this.checkOutAlias()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Out alias are empty or contains spaces.');
            return;
        }

        if (this.duplicateName(outControls)) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There are duplicate name in the out alias.');
            return;
        }
        if (this.duplicateName(inputControls, outControls)) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There are duplicate name in the input variable and out alias.');
            return;
        }

        var option = {
            url: 'api/va/v2/ws/udfs?udfName=' + this.$nameControl.val().trim() + '&udfVersion=' + _this.UDF_VERSION.trim(),
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        };
        $.ajax(option).done(function (result) {
            if (result.length == 0) {
                var udfNameVersion = _this.$nameControl.val().trim().replace(/\s/ig, '_') + '_' + _this.UDF_VERSION.replace(/\./ig, '_');
                _this.dialogResult.udf_id = Brightics.VA.Core.Utils.IDGenerator.udf.id(udfNameVersion);
            } else {
                _this.dialogResult.udf_id = result[0].udf_id;
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('This name already exists. Please raise your version.');
                return;
            }
            _this.dialogResult.udf_name = _this.$nameControl.val().trim();
            _this.dialogResult.udf_version = _this.UDF_VERSION.trim();
            _this.dialogResult.description = _this.noteControl.getCode();
            _this.dialogResult.contents = _this.scriptControl.getValue();
            _this.dialogResult.udfParams = _this.getUDFParams();
            _this.dialogResult.creator = Brightics.VA.Env.Session.userId;
            _this.dialogResult.in_table_count = _this.getInTableCnt();
            _this.dialogResult.out_table_count = _this.getOutTableAliaes().length;
            _this.dialogResult.status = 'public';
            _this.dialogResult.updater = Brightics.VA.Env.Session.userId;
            _this.dialogResult.name = _this.options.fnUnit.func == 'python' ? 'PythonScript' : 'ScalaScript';

            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
            // if (_this.options.type === 'update') {
            //     Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Updated version. \n' + _this.dialogResult.udf_name + ' Ver.' + _this.dialogResult.udf_version);
            // } else {
            //     Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('The user-defined function(' + _this.dialogResult.udf_name + 'Ver.' + _this.dialogResult.udf_version + ') is registered.');
            // }
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });

    };

    ExportToUDFDialog.prototype.getInTableCnt = function () {
        var script = this.scriptControl.getValue();
        var regex = this.options.fnUnit.func == 'python' ? /inputs\[(?:[0-9])\]/gm : /inputs\((?:[0-9])\)/gm, numberRegex = /[0-9]/gm,
            regexComment = /"(\\[\s\S]|[^"])*"|'(\\[\s\S]|[^'])*'|(--.*|\/\/.*|\/\*[\s\S]*?\*\/)/gm;
        var replaced = script.replace(regexComment, function (match, g1, g2, g3) {
            if (g1) return match;
            if (g2) return match;
            if (g3) return '';
        });
        var inputsList = replaced.match(regex);
        if (inputsList === null || inputsList.length == 0) {
            return 0;
        }
        var inputsNumberList = inputsList.join().match(numberRegex);
        var maxInputCount = Math.max.apply(null, inputsNumberList);
        return maxInputCount + 1;

    };

    ExportToUDFDialog.prototype.getUDFParams = function () {
        var inputVariables = this.$InputVariablesLineArea.find('.brtc-va-dialogs-export-to-udf.input-variable');
        var udfParams = [];
        $(inputVariables).each(function (index, inputVariable) {
            var paramName = $(inputVariable).find('.input-variable-param-name').jqxInput('val');
            var paramType = $(inputVariable).find('.input-variable-type').jqxDropDownList('val');
            var paramDescription = $(inputVariable).find('.input-variable-param-description').jqxInput('val');
            udfParams.push({
                param_name: paramName,
                arg_type: paramType,
                description: paramDescription,
                inout_type: 'IN',
                sequence: index + 1
            });
        });
        var outAliases = this.$outAliasArea.find('.brtc-va-dialogs-export-to-udf.out-alias');
        $(outAliases).each(function (index, outAlias) {
            var paramName = $(outAlias).find('.out-alias-param-name').jqxInput('val');
            var paramDescription = $(outAlias).find('.out-alias-param-description').jqxInput('val');
            udfParams.push({
                param_name: paramName,
                arg_type: '',
                description: paramDescription,
                inout_type: 'OUT',
                sequence: index + 1
            });
        });
        return udfParams;
    };

    ExportToUDFDialog.prototype.getOutTableAliaes = function () {
        var outAliases = this.$outAliasArea.find('.brtc-va-dialogs-export-to-udf.out-alias');
        var outTableAliases = [];
        $(outAliases).each(function (index, outAlias) {
            var paramName = $(outAlias).find('.out-alias-param-name').jqxInput('val');
            outTableAliases.push(paramName);
        });
        return outTableAliases;
    };

    ExportToUDFDialog.prototype.createDialogButtonBar = function ($parent) {
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);
        if (this.options.type == 'save') {
            this.$okButton.val('Save');
        } else {
            this.$okButton.val('Update');
        }
    };

    ExportToUDFDialog.prototype.handleTestClicked = function () {
        var _this = this;

        if (!this.checkOutAlias()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Out alias are empty or contains spaces.');
            return;
        }

        if (this.getInTableCnt() == 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('UDF test requires input data.');
            return;
        }

        var inputVariableParams = _this.getUDFParams().filter(function (udf) {
            return udf['inout_type'] === 'IN';
        });

        var dialogOptions = {
            title: 'Test Parameter',
            inputDataCnt: _this.getInTableCnt(),
            inputVariable: inputVariableParams,
            close: function (dialogResult) {
                if (dialogResult.OK) {

                    //Generation RunSpec
                    var model = _this.createModel(dialogResult.inputTables, dialogResult.inputVariables);

                    //Run
                    Brightics.VA.Core.DataQueryTemplate.removeCache(model.mid);

                    var runnable = {
                        main: 'mid',
                        models: { 'mid': model },
                        version: Brightics.VA.Env.CoreVersion
                    }

                    var checkTimer = function (jid) {
                        _this._checkProgress(jid).done(function (result) {
                            if (result.status == 'PROCESSING') {
                                _this.progress(true);
                                setTimeout(checkTimer.bind(_this, jid), 3000);
                            } else if (result.status == 'SUCCESS') {
                                _this.progress(false);
                                _this.refreshResult(model);
                            } else {
                                _this.progress(false, result.errorInfo[0].message);
                            }
                        }).fail(function (err) {
                            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                        });
                    };

                    var opt = {
                        url: 'api/va/v2/analytics/jobs/execute',
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(runnable),
                        blocking: false //progress 함수가 이미 dim 처리 하고 있음.
                    };

                    $.ajax(opt).done(function (results) {
                        var _results = JSON.parse(results);
                        var jid = _results.result;
                        _this.progress(true);
                        setTimeout(checkTimer.bind(_this, jid), 3000);
                    }).fail(function (err) {
                        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                    });
                }
            }
        };
        new Brightics.VA.Core.Dialogs.TestUDFParamDialog(_this.$mainControl, dialogOptions);
    };

    ExportToUDFDialog.prototype._checkProgress = function (jobId) {
        var option = {
            url: 'api/va/v2/analytics/jobs/' + jobId,
            type: 'GET',
            blocking: false //progress 함수가 이미 dim 처리 하고 있음.
        };
        return $.ajax(option);
    };

    ExportToUDFDialog.prototype.progress = function (status, message) {
        var _this = this;
        if (status) {
            this.$progress.show();
        } else {
            this.$progress.hide();
            _this.$okButton.jqxButton({disabled: status});
            _this.$cancelButton.jqxButton({disabled: status});
            if (message) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(message);
            }
        }
        _this.$okButton.jqxButton({disabled: status});
        _this.$cancelButton.jqxButton({disabled: status});
    };

    ExportToUDFDialog.prototype.refreshResult = function (model) {
        //Show Result
        var _this = this;

        for (var i in this.$resultPanelContent) {
            this.$resultPanelContent[i].remove();
        }
        var udfOutTables = model.functions[model.functions.length - 1][OUT_DATA];
        var udfOutPutAlias = model.functions[model.functions.length - 1].param['out-table-alias'];
        this.$resultPanelContent = {};
        this.$resultSheet = {};
        for (var i in udfOutTables) {
            Brightics.VA.Core.DataQueryTemplate.queryData(model.mid, udfOutTables[i], 0, 1000, function (data, tableId) {
                _this.createResultPanelContent(udfOutPutAlias[$.inArray(tableId, udfOutTables)], data, model);
                var top = _this.$mainControl.find('.brtc-va-dialogs-export-to-udf-result').position().top;
                _this.$mainControl.find('.brtc-va-dialogs-exporttoudfdialog-contents').animate({
                    scrollTop: top < 0 ? 0 : top
                }, 500);
            }, function (err, tableId) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            }, false);
        }
    };

    ExportToUDFDialog.prototype.createModel = function (inputTables, inputVariables) {
        var _this = this;

        var model = $.extend(true, {}, Brightics.VA.Implementation.DataFlow.defaultModel);
        model = $.extend(true, model, Brightics.VA.Default.model);
        model.mid = 'mid';
        model.entries = [];
        model.title = 'UDF Test';

        var tempUDFFnUnit = this.options.fnUnit.func == 'python' ? $.extend(true, {}, Brightics.VA.Core.Functions.Library.pythonScript.defaultFnUnit) : $.extend(true, {}, Brightics.VA.Core.Functions.Library.scalaScript.defaultFnUnit);
        tempUDFFnUnit.fid = Brightics.VA.Core.Utils.IDGenerator.func.id();
        tempUDFFnUnit.label = tempUDFFnUnit.display.label;
        tempUDFFnUnit.persist = true;
        tempUDFFnUnit['persist-mode'] = 'auto';
        tempUDFFnUnit.param['input-variables'] = [];

        for (var i in inputTables) {
            var outTable = Brightics.VA.Core.Utils.IDGenerator.table.id();
            var loadMainFid = Brightics.VA.Core.Utils.IDGenerator.func.id();
            var loadSubFid = Brightics.VA.Core.Utils.IDGenerator.func.id();
            var loadFnUnit = $.extend(true, {}, Brightics.VA.Core.Functions.Library.load.defaultFnUnit);
            loadFnUnit.fid = loadMainFid;
            loadFnUnit.label = loadFnUnit.display.label;
            loadFnUnit.persist = true;
            loadFnUnit['persist-mode'] = 'auto';
            loadFnUnit[OUT_DATA] = [outTable];
            loadFnUnit['param'].functions[0].fid = loadSubFid;
            loadFnUnit['param'].functions[0].label = loadFnUnit.display.label;
            loadFnUnit['param'].functions[0][OUT_DATA] = [outTable];
            loadFnUnit['param'].functions[0].param['df-names'] = [outTable];
            loadFnUnit['param'].functions[0].param['fs-paths'].push(inputTables[i].value);
            loadFnUnit['param'].functions[0].param['persist'] = true;

            var link = {
                kid: Brightics.VA.Core.Utils.IDGenerator.link.id(),
                'sourceFid': loadMainFid,
                'targetFid': tempUDFFnUnit.fid
            };

            model.links.push(link);
            model.functions.push(loadFnUnit);
            model.entries.push(loadMainFid);

            tempUDFFnUnit[IN_DATA].push(outTable);
        }
        //load가 없는 경우 UDF를 entries에 넣어준다.
        if (inputTables.length === 0) {
            model.entries.push(tempUDFFnUnit.fid);
        }

        for (var i in inputVariables) {
            var inputVariable = [];
            inputVariable.push(inputVariables[i].paramName);
            inputVariable.push(inputVariables[i].paramType);
            inputVariable.push(inputVariables[i].value);
            tempUDFFnUnit.param['input-variables'].push(inputVariable);
        }
        tempUDFFnUnit.param.script = _this.scriptControl.getValue();
        tempUDFFnUnit.param['out-table-alias'] = _this.getOutTableAliaes();
        tempUDFFnUnit.display.label = _this.$nameControl.val();
        tempUDFFnUnit.parent = function () {
            var parent = $.extend(true, {}, _this.options.fnUnit.parent());
            parent.functions = [tempUDFFnUnit];
            parent.links = [];
            return parent;
        };
        $.each(_this.getOutTableAliaes(), function () {
            tempUDFFnUnit[OUT_DATA].push(Brightics.VA.Core.Utils.IDGenerator.table.id())
        });

        model.functions.push(tempUDFFnUnit);
        return model;
    };

    ExportToUDFDialog.prototype._generateJobId = function (mainId) {
        return 'va_' + mainId + '_' + moment(Date.now()).format('YYYYMMDDHHmmssSSS');
    };

    ExportToUDFDialog.prototype.createResultControl = function ($parent) {
        var _this = this;
        var testResultPanel = $('' +
            '<div class="brtc-va-dialogs-export-to-udf-test-button-area brtc-s-style-dialogs-export-to-udf-test-button-area">' +
            '   <input type="button" class="brtc-va-dialogs-export-to-udf-test-button brtc-s-style-dialogs-export-to-udf-test-button" value="Test Run" />' +
            '</div>' +
            '<div class="brtc-va-dialogs-export-to-udf-result"></div>');
        testResultPanel.find('.brtc-va-dialogs-export-to-udf-test-button').click(function () {
            _this.handleTestClicked();
        });
        $parent.append(testResultPanel);


    };

    ExportToUDFDialog.prototype.createResultPanelContent = function (tableId, data, model) {
        this.$resultPanelContent[tableId] = $('' +
            '<div class="brtc-va-dialogs-export-to-udf-result-panel-content">' +
            '</div>');

        this.$mainControl.find('.brtc-va-dialogs-export-to-udf-result').append(this.$resultPanelContent[tableId]);
        this.$mainControl.find('.brtc-va-dialogs-export-to-udf-result').perfectScrollbar();
        this.$mainControl.find('.brtc-va-dialogs-export-to-udf-result').perfectScrollbar('update');

        this.createResultContents(this.$resultPanelContent[tableId], tableId, data, model);
    };

    ExportToUDFDialog.prototype.createResultContents = function ($parent, tableId, data, model) {

        this.$resultSheet[tableId] = $('' +
            '<div>' +
            '   <div class="brtc-va-dialogs-export-to-udf-result-panel-content-title">Out( ' + tableId + ' )</div>' +
            '   <div class="brtc-va-dialogs-export-to-udf-result-panel-content-chart-area"></div>' +
            '</div>');
        $parent.append(this.$resultSheet[tableId]);
        this.createResultGrid(tableId, data, model);
        this.$mainControl.find('.brtc-va-dialogs-export-to-udf-result').perfectScrollbar('update');

        //Adonis는 추후개발
        // this.createChartSettingControl(this.$resultSheet[tableId].find('.brtc-va-dialogs-export-to-udf-result-panel-content-chart-area'));
        // this.createWorksheet(tableId, data, model);
    };

    ExportToUDFDialog.prototype.createResultGrid = function (tableId, result, model) {
        var $spreadsheet = $('<div class="brtc-va-dialogs-export-to-udf-result-panel-spreadsheet"></div>');
        this.$resultSheet[tableId].find('.brtc-va-dialogs-export-to-udf-result-panel-content-chart-area').append($spreadsheet);

        var source = {
            localdata: result.data,
            datatype: 'array',
            datafields: $.map(result.columns, function (column, index) {
                return {
                    name: '__' + column.name,
                    type: column.type,
                    map: '' + index
                };
            })
        };

        var tableColumns = $.map(result.columns, function (column, index) {
            var col = {
                text: column.name,
                datafield: '__' + column.name,
                width: 80
            };
            if (column.type == 'date') {
                col.cellsformat = 'yyyy-MM-dd HH:mm:ss:fff';
            } else if (column.type == 'number') {
                col.cellsformat = 'd';
                col.cellsalign = 'right';
            } else if (column.type == 'string') {
                col.cellsrenderer = function (row, column, value) {
                    var styleText = 'overflow:hidden; text-overflow:ellipsis; padding-bottom:2px; margin-right: 2px; margin-left: 4px; margin-top: 4px;';

                    var cellValue = this.owner.source.records[row][column];

                    if (cellValue === undefined || cellValue === '' || cellValue === null) {
                        var _localdata = this.owner.source._source.localdata[row],
                            _datafields = this.owner.source._source.datafields,
                            _objIndex = 0;

                        for (var i in _datafields) {
                            if (_datafields[i].name === column) {
                                _objIndex = Number(_datafields[i].map);
                                break;
                            }
                        }

                        if (_localdata[_objIndex] === undefined) {
                            return '<div style="' + styleText + 'color: #ff3333">undefined</div>';
                        } else if (_localdata[_objIndex] === null) {
                            return '<div align="right" style="' + styleText + 'color: #ff3333">null</div>';
                        } else if (_localdata[_objIndex] === '') {
                            return '<div align="right" style="' + styleText + '"></div>';
                        }
                    } else {
                        return '<div style="' + styleText + '">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(value) + '</div>';
                    }
                }
            }
            return col;
        });
        tableColumns.unshift({
            text: 'No', sortable: false, menu: false, editable: false, groupable: false, draggable: false,
            datafield: '', width: 40,
            columntype: 'number',
            renderer: function (value) {
                return '<div class="brtc-va-refine-spreadsheet-rownum-column">' + value + '</div>';
            },
            cellsformat: 'd', cellsalign: 'right',
            cellclassname: 'brtc-va-refine-spreadsheet-rownum-cell',
            cellsrenderer: function (row, column, value) {
                return '<div align="right" style="margin:4px;">' + (value + 1) + '</div>';
            }
        });

        var dataAdapter = new $.jqx.dataAdapter(source);
        $spreadsheet.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '200',
            rowsheight: 25,
            source: dataAdapter,
            altrows: false,
            filterable: false,
            sortable: false,
            columnsresize: true,
            selectionmode: 'multiplecellsextended',
            columns: tableColumns
        });

        $spreadsheet.on("columnclick", function (event) {
            if (event.args.column.text == "No") {
                $(this).jqxGrid('autoresizecolumns');
            }
        });
    }
    ExportToUDFDialog.prototype.createWorksheet = function (tableId, data, model) {
        var dataSet = {data: [], columns: []};
        var _this = this;
        if (typeof data === 'object') dataSet = data || dataSet;

        var options = {
            worksheet: {
                layout: [],
                panel: [{
                    id: 'default-' + Date.now(),
                    chartOption: {
                        chart: {
                            type: 'table'
                        }
                    }
                }]
            }
        };

        var source = {
            dataType: 'lazy',
            lazyData: [{
                columns: function () {
                    return dataSet.columns;
                },
                data: function (prepare) {
                    setTimeout(function () {
                        prepare.done({
                            dataType: 'rawdata',
                            columns: dataSet.columns,
                            data: dataSet.data
                        });
                    }, 100);
                }
            }]
        };
        options.worksheet.panel[0].chartOption.source = source;

        options.worksheet.toolbar = {
            menu: {
                setting: {
                    click: function () {
                        var panel = this;
                        _this._handleChartSettings(panel);
                    }
                },
                duplicate: {},
                close: {}
            }
        };

        this.$resultSheet[tableId].find('.brtc-va-dialogs-export-to-udf-result-panel-content-chart-area').bchartsAdonis(options);

    };

    ExportToUDFDialog.prototype.createChartSettingControl = function ($parent) {
        var $dialog = $('' +
            '<div class="brtc-va-dialog brtc-va-chart-settings brtc-va-dialog-export-to-udf">' +
            '   <div class="brtc-va-dialog-header">' +
            '       <div class="brtc-va-dialog-title">Chart Settings</div>' +
            '       <div class="brtc-va-dialog-button" action="close"></div>' +
            '   </div>' +
            '   <div class="brtc-va-dialog-contents"></div>' +
            '</div>');
        $parent.append($dialog);
        $dialog.draggable({
            handle: $dialog.find('.brtc-va-dialog-header > .brtc-va-dialog-title'),
            containment: 'parent'
        });

        $dialog.find('.brtc-va-dialog-header > .brtc-va-dialog-button[action="close"]').click(function () {
            $(this).closest('.brtc-va-dialog.brtc-va-chart-settings').hide();
        });
        $dialog.hide();

        return $dialog;
    };

    ExportToUDFDialog.prototype._handleChartSettings = function (panel) {
        this._openChartSettingsDialog(panel);
        this.onSelectChart();
    };

    ExportToUDFDialog.prototype._openChartSettingsDialog = function (panel) {
        var _this = this;
        var $dialog = panel.$mainControl.closest('.brtc-va-dialogs-export-to-udf-result-panel-content-chart-area').find('.brtc-va-dialog.brtc-va-chart-settings');
        if ($dialog.is(':visible') === false) {
            var offset = panel.$mainControl.closest('.brtc-va-dialogs-export-to-udf-result-panel-content-chart-area').offset();
            // offset.right = offset.left + panel.$mainControl.outerWidth();
            offset.right = panel.$mainControl.closest('.brtc-va-dialogs-export-to-udf-result-panel-content-chart-area').outerWidth();
            offset.bottom = panel.$mainControl.closest('.brtc-va-dialogs-export-to-udf-result-panel-content-chart-area').outerHeight();
            // offset.bottom = panel.$mainControl.outerHeight();
            var width = $dialog.outerWidth();
            var height = $dialog.outerHeight();
            offset.top -= 40;
            if (offset.top + height > offset.bottom) {
                offset.top = offset.bottom - height;
            }
            offset.left = offset.right - width;
            $dialog.css({
                left: offset.left,
                top: offset.top,
                // 'z-index': _this.getHighestZindex()
            });

            $dialog.show();
        }
    };

    ExportToUDFDialog.prototype.getHighestZindex = function ($chartOptionPanel) {
        var jqxWindowList = $('body').children('.jqx-window');
        var maxIndex = 0, newIndex = 0;

        for (var jqxWindowIndex = 0; jqxWindowIndex < jqxWindowList.length; jqxWindowIndex++) {
            newIndex = parseInt($(jqxWindowList[jqxWindowIndex]).css('z-index')) || 0;
            if (newIndex > maxIndex) {
                maxIndex = newIndex;
            }
        }
        return maxIndex + 1;
    };

    ExportToUDFDialog.prototype._attachChartOptionPanelToDialog = function ($chartOptionPanel) {
        $chartOptionPanel.data('original-parent', $chartOptionPanel.parent());
        $chartOptionPanel.detach();

        var $dialog = this.$mainControl.find('.brtc-va-dialog.brtc-va-chart-settings');
        $dialog.find('.brtc-va-dialog-contents').append($chartOptionPanel);
    };

    ExportToUDFDialog.prototype.onSelectChart = function () {
        var $dialog = this.$mainControl.find('.brtc-va-dialog.brtc-va-chart-settings');
        if ($dialog.is(':visible')) {
            this.$chartOptionPanel = this.$mainControl.find('.bcharts-option-panel');
            if (this.$chartOptionPanel.length > 0) {
                // 내 하위에 ChartOptionPanel 이 있으므로 detach 후 이를 Dialog 에 attach 하자.
                // 1. 기존에 Dialog 에 붙어있는 ChartOptionPanel 을 원 부모에게 되돌려주자.
                this._detachChartOptionPanel();
                // 2. 이제 나의 ChartOptionPanel 을 Dialog 에 붙여주자.
                this._attachChartOptionPanelToDialog(this.$chartOptionPanel);
            }
        }
    };
    ExportToUDFDialog.prototype._detachChartOptionPanel = function () {
        var $dialog = this.$mainControl.find('.brtc-va-dialog.brtc-va-chart-settings');
        $dialog.find('.bcharts-option-panel').each(function (index, element) {
            var $chartOptionPanel = $(element);
            var $parent = $chartOptionPanel.data('original-parent');
            $chartOptionPanel.detach().appendTo($parent);
        });
    };

    ExportToUDFDialog.prototype._attachChartOptionPanelToDialog = function ($chartOptionPanel) {
        $chartOptionPanel.data('original-parent', $chartOptionPanel.parent());
        $chartOptionPanel.detach();

        var $dialog = this.$mainControl.find('.brtc-va-dialog.brtc-va-chart-settings');
        $dialog.find('.brtc-va-dialog-contents').append($chartOptionPanel);
    };

    ExportToUDFDialog.prototype.renderValidation = function (control, message, blankFlag, value) {
        var blank_pattern = /[\s]/g;
        var checkValue = value || control.val();
        control.parent().find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
        if ((control.attr('isMandatory') == 'true' && checkValue == '') || ( blankFlag && blank_pattern.test(checkValue) == true)) {
            control.addClass('brtc-s-style-export-to-udf-validation-error');

            var validationErrorDiv = $('<div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">   ' +
                '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>   ' +
                '   <div class="brtc-va-editors-sheet-panels-validation-tooltip">' + message + '</div>' +
                '</div>');
            $(control).parent().append(validationErrorDiv)
        } else {
            control.removeClass('brtc-s-style-export-to-udf-validation-error');
        }
    };

    ExportToUDFDialog.prototype.renderInOutValidation = function () {
        var controls = $.makeArray(this.$InputVariablesLineArea.find('.brtc-va-dialogs-export-to-udf.input-variable-param-name'));
        if (this.$outAliasArea)
            controls = controls.concat($.makeArray(this.$outAliasArea.find('.brtc-va-dialogs-export-to-udf.out-alias-param-name')));

        var nameList = [];
        for (var i in controls) {
            $(controls[i]).removeClass('brtc-s-style-export-to-udf-validation-error');
            $(controls[i]).parent().parent().find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
            $(controls[i]).parent().parent().removeClass('mb-25');
            var index = $.inArray($(controls[i]).val().trim(), $.map(nameList, function (item) {
                return item.value;
            }));

            var blank_pattern = /[\s]/g;
            var checkValue = $(controls[i]).val();

            if (index == -1) {
                if (($(controls[i]).attr('isMandatory') == 'true' && checkValue == '') || blank_pattern.test(checkValue) == true) {
                    $(controls[i]).addClass('brtc-s-style-export-to-udf-validation-error');
                    let validationErrorDiv = $('<div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">' +
                        '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
                        '   <div class="brtc-va-editors-sheet-panels-validation-tooltip">"Name" is required.</div>' +
                        '</div>');
                    $(controls[i]).parent().parent().append(validationErrorDiv);
                    $(controls[i]).parent().parent().addClass('mb-25');
                }
                nameList.push({index: i, value: $(controls[i]).val().trim()});
            } else {
                $(controls[index]).addClass('brtc-s-style-export-to-udf-validation-error');
                $(controls[i]).addClass('brtc-s-style-export-to-udf-validation-error');
                var message = '"' + $(controls[i]).val() + '" already used.';
                if ($(controls[i]).val() == '') {
                    message = 'Name is required.';
                }
                let validationErrorDiv = $('<div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">' +
                    '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>   ' +
                    '   <div class="brtc-va-editors-sheet-panels-validation-tooltip">' + message + '</div> ' +
                    '</div>');
                $(controls[i]).parent().parent().append(validationErrorDiv);
                $(controls[i]).parent().parent().addClass('mb-25');
            }
        }

    };

    Brightics.VA.Core.Dialogs.ExportToUDFDialog = ExportToUDFDialog;
}).call(this);