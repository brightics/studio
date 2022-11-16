/**
 * Created by gy84.bae on 2016-10-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ScriptEditorDialog(parentId, options) {
        this.dropdownLists = [];
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    ScriptEditorDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ScriptEditorDialog.prototype.constructor = ScriptEditorDialog;

    ScriptEditorDialog.prototype.checkInfo = function () {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        editor.checkInfo();
    };

    ScriptEditorDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 1400;
        this.dialogOptions.height = 700;
        // this.dialogOptions.resizable = true;
        this.dialogOptions.maxWidth = 1400;
        this.dialogOptions.maxHeight = 700;
    };

    ScriptEditorDialog.prototype._getInTableLabel = function (index) {
    };

    ScriptEditorDialog.prototype._getInModelLabel = function (index) {
    };

    ScriptEditorDialog.prototype._getInImageLabel = function (index) {
    };


    ScriptEditorDialog.prototype.createInTableAlias = function ($parent) {
        var _this = this;
        var model = this.options.fnUnit.parent();

        var inTableList = this.FnUnitUtils.getInTable(this.options.fnUnit),
            inFunctionList = [];

        for (let i in inTableList) {
            var fn = model.getFnUnitByOutData(inTableList[i]);
            if (!_.isEmpty(fn)) inFunctionList.push(fn);
        }

        for (const fnUnit of inFunctionList) {
            var label = this._getInTableLabel(i);

            var $aliasElement = $('' +
                '<div class="brtc-va-dialogs-scalaeditor-alias-element">' +
                '   <div class="brtc-va-dialogs-scalaeditor-alias-element-label">' + label + '</div>' +
                '</div>');

            var clazz = fnUnit.parent().type;
            var $item = $('<div class="brtc-va-editors-sheet-controls-dataselector-item single brtc-va-dialogs-scalaeditor-alias-element-item" isDialog=true></div>'),
                $selectedItem = Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz);

            $selectedItem.find('.brtc-va-views-palette-fnunit-label')
                .text(fnUnit.display.label)
                .attr('variable', label);

            $item.attr('value', this.FnUnitUtils.getOutTable(fnUnit)[0]);
            $selectedItem.addClass('item');
            $aliasElement.append($item);

            $parent.append($aliasElement);

            $aliasElement.find('.brtc-va-views-palette-fnunit').click(function () {
                var addedText = $(this).find('.brtc-va-views-palette-fnunit-label').attr('variable');

                //insert at current cursor
                var doc = _this.codeMirror.getDoc();
                var cursor = _this.codeMirror.getCursor();

                doc.replaceRange(addedText, cursor);
            });
        }
    };


    ScriptEditorDialog.prototype.createInModelAlias = function ($parent) {
        var _this = this;
        var model = this.options.fnUnit.parent();

        var inModelList = this.FnUnitUtils.getInModel(this.options.fnUnit),
            inFunctionList = [];

        for (let i in inModelList) {
            inFunctionList.push(model.getFnUnitByOutData(inModelList[i]));
        }

        for (let fnUnit of inFunctionList) {
            var label = this._getInModelLabel(i);

            var $aliasElement = $('' +
                '<div class="brtc-va-dialogs-scalaeditor-alias-element">' +
                '   <div class="brtc-va-dialogs-scalaeditor-alias-element-label">' + label + '</div>' +
                '</div>');

            var clazz = fnUnit.parent().type;
            var $item = $('<div class="brtc-va-editors-sheet-controls-dataselector-item single brtc-va-dialogs-scalaeditor-alias-element-item" isDialog=true></div>'),
                $selectedItem = Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz);

            $selectedItem.find('.brtc-va-views-palette-fnunit-label')
                .text(fnUnit.display.label)
                .attr('variable', label);

            $item.attr('value', this.FnUnitUtils.getOutModel(fnUnit)[0]);
            $selectedItem.addClass('item');
            $aliasElement.append($item);

            $parent.append($aliasElement);

            $aliasElement.find('.brtc-va-views-palette-fnunit').click(function () {
                var addedText = $(this).find('.brtc-va-views-palette-fnunit-label').attr('variable');

                //insert at current cursor
                var doc = _this.codeMirror.getDoc();
                var cursor = _this.codeMirror.getCursor();

                doc.replaceRange(addedText, cursor);
            });
        }
    };


    ScriptEditorDialog.prototype.createInImageAlias = function ($parent) {
        var _this = this;
        var model = this.options.fnUnit.parent();

        var inImageList = this.FnUnitUtils.getInImage(this.options.fnUnit),
            inFunctionList = [];

        for (let i in inImageList) {
            inFunctionList.push(model.getFnUnitByOutData(inImageList[i]));
        }

        for (let fnUnit of inFunctionList) {
            var label = this._getInImageLabel(i);

            var $aliasElement = $('' +
                '<div class="brtc-va-dialogs-scalaeditor-alias-element">' +
                '   <div class="brtc-va-dialogs-scalaeditor-alias-element-label">' + label + '</div>' +
                '</div>');

            var clazz = fnUnit.parent().type;
            var $item = $('<div class="brtc-va-editors-sheet-controls-dataselector-item single brtc-va-dialogs-scalaeditor-alias-element-item" isDialog=true></div>'),
                $selectedItem = Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz);

            $selectedItem.find('.brtc-va-views-palette-fnunit-label')
                .text(fnUnit.display.label)
                .attr('variable', label);

            $item.attr('value', this.FnUnitUtils.getOutImage(fnUnit)[0]);
            $selectedItem.addClass('item');
            $aliasElement.append($item);

            $parent.append($aliasElement);

            $aliasElement.find('.brtc-va-views-palette-fnunit').click(function () {
                var addedText = $(this).find('.brtc-va-views-palette-fnunit-label').attr('variable');

                //insert at current cursor
                var doc = _this.codeMirror.getDoc();
                var cursor = _this.codeMirror.getCursor();

                doc.replaceRange(addedText, cursor);
            });
        }
    };


    ScriptEditorDialog.prototype.createDialogContentsArea = function ($parent, useTable) {
        this.scriptEditorOptions = {
            statement: '',
            scriptType: '',
            mode: '',
            dataMap: {},
            fnUnit: {},
            additionalHint: [],
            maxLength: 999999,
            close: function (event) {
            }
        };

        $.extend(true, this.scriptEditorOptions, this.options);

        this.createLayout();
        this.renderInfoArea();
        this.renderEditorArea();
        this.renderResultArea();
        this.registerEvent();
    };

    ScriptEditorDialog.prototype.destroy = function () {
        this.dropdownLists.forEach((dropdownList) => {
            dropdownList.jqxDropDownList('destroy');
        })

        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this);
    };

    ScriptEditorDialog.prototype.createLayout = function () {
        this.$contentArea = this.$mainControl.find('.brtc-va-dialogs-contents');

        var scriptOnly = (this.options.scriptOnly) ? this.options.scriptOnly : false;
        var scriptType = (this.options.scriptType) ? this.options.scriptType : 'script';

        this.$editorArea = $('' +
            '<div class="brtc-va-dialogs-contents-statement" script-only="' + scriptOnly + '" script-type="' + scriptType + '">' +
            '   <textarea></textarea>' +
            '   <div class="brtc-va-dialogs-contents-statement-error">Up to ' + Brightics.VA.Core.Utils.CommonUtils.numberToStringWithComma(this.scriptEditorOptions.maxLength) + ' characters can be entered.</div>' +
            '</div>' +
            '');
        this.$errorArea = this.$editorArea.find('.brtc-va-dialogs-contents-statement-error');
        this.$infoArea = $('<div class="brtc-va-dialogs-contents-info" script-only="' + scriptOnly + '">');
        this.$contentArea.append(this.$editorArea).append(this.$infoArea);
        this.$infoArea.perfectScrollbar();

        var _this = this;
        this.$mainControl.on('resized', function (event) {
            _this.$infoArea.perfectScrollbar('update');
        });
    };

    ScriptEditorDialog.prototype.registerEvent = function () {
        this.$editorArea.find('textarea').bind('showOverflow', function () {
            $(this).siblings('.brtc-va-dialogs-contents-statement-error').show();
        });
        this.$editorArea.find('textarea').bind('hideOverflow', function () {
            $(this).siblings('.brtc-va-dialogs-contents-statement-error').hide();
        });
    };

    ScriptEditorDialog.prototype.renderEditorArea = function () {
        this.codeMirror = CodeMirror.fromTextArea(this.$editorArea.find('textarea')[0], {
            mode: this.scriptEditorOptions.mode,
            theme: "default",
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autofocus: false,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {
                list: this.scriptEditorOptions.additionalHint
            }
        });

        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(this.codeMirror);

        Brightics.VA.Core.Utils.WidgetUtils.setCodeMirrorMaxLength(this.codeMirror);

        this.setEditorStatement(this.options.statement);

        this.codeMirror.setSize('100%', '100%');
        this.codeMirror.setOption('maxLength', this.scriptEditorOptions.maxLength);
    };

    ScriptEditorDialog.prototype.renderResultArea = function ($parent) {

    };

    ScriptEditorDialog.prototype.setEditorStatement = function (statement) {
        this.codeMirror.setValue(statement);
        this.codeMirror.clearHistory();
    };

    ScriptEditorDialog.prototype.renderInfoArea = function () {

    };

    ScriptEditorDialog.prototype.handleOkClicked = function () {

        this.dialogResult = {
            OK: true,
            Cancel: false,
            queryStatement: this.codeMirror.getValue()
        };
        this.$mainControl.dialog('close');
    };

    // ScriptEditorDialog.prototype.createDropDownList = function ($parent, alias, isMandatory, tableId) {
    //     var _this = this;

    //     var $outTableInput = $('' +
    //         '<div class="brtc-va-dialogs-scalaeditor-alias-body-outtable" tableId="' + tableId + '">' +
    //         '   <input class="brtc-va-dialogs-scalaeditor-alias-body-outtable-input" isMandatory=' + isMandatory + ' />' +
    //         '   <div class="brtc-va-dialogs-scalaeditor-alias-body-outtable-remove""></div>' +
    //         '</div>' +
    //         '');

    //     var $input = $outTableInput.find('input');

    //     $parent.append($outTableInput);

    //     $input.jqxInput({
    //         placeHolder: "Enter out table alias",
    //         height: 25,
    //         width: '105px',
    //         theme: 'office'
    //     });
    //     $input.jqxInput('val', alias);

    //     if ($input.val() === '' || $input.val() == undefined) {
    //         $input.css('border-color', 'red');

    //     }

    //     $input.focus();

    //     $input.on('change', function () {
    //         if ($(this).val() == '') {
    //             $(this).css('border-color', 'red');
    //         } else {
    //             $(this).css('border-color', '#d4d4d4');
    //         }
    //     });

    //     $input.keydown(function (key) {
    //         if (key.keyCode == 13) {
    //             _this.createOutTableAlias(_this.$outTableAliasBody, false);
    //         }
    //     });

    //     if (isMandatory == true && alias == '') {
    //         $input.css('border-color', 'red');
    //     }

    //     var $removeButton = $outTableInput.find('.brtc-va-dialogs-scalaeditor-alias-body-outtable-remove');
    //     $removeButton.attr({
    //         'isMandatory': isMandatory
    //     });

    //     $removeButton.click(function () {
    //         var $target = $(this).closest('.brtc-va-dialogs-contents-statement-lastline-element-wrapper');
    //         if ($target.find('.brtc-va-dialogs-scalaeditor-alias-body-outtable').attr('tableId')) _this.removeSendFnunit($target.attr('tableId'));
    //         $target.remove();
    //         _this.$outTableAliasBody.perfectScrollbar('update');
    //     });

    //     return $input;
    // };

    ScriptEditorDialog.prototype.createDropDownList = function ($parent, alias, isMandatory, tableId) {
        var $outTableType = $('' +
            '<div class="brtc-va-dialogs-scalaeditor-alias-body-outtable-type" tableId="' + tableId + '">' +
            '</div>' +
            '');

        $parent.append($outTableType);

        var source = [
            {text: 'TABLE', value: 'table'},
            {text: 'MODEL', value: 'model'},
            {text: 'IMAGE', value: 'image'},
        ];

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '20px',
            source: source,
            displayMember: 'text',
            selectedIndex: 0,
            valueMember: 'value',
            dropDownHeight: 70
        };
        $outTableType.jqxDropDownList(options);

        this.dropdownLists.push($outTableType);
    };

    ScriptEditorDialog.prototype.createInput = function ($control, jqxOptions, className, additionalCss) {
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

        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($control);

    };

    ScriptEditorDialog.prototype.createRadioButton = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = 'brtc-va-editors-sheet-controls-radiobutton-default';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxRadioButton(options);
        return $control;
    };

    ScriptEditorDialog.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };

    ScriptEditorDialog.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    ScriptEditorDialog.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    Brightics.VA.Core.Dialogs.ScriptEditorDialog = ScriptEditorDialog;

}).call(this);