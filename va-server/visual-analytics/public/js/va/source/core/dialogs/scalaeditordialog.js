/**
 * Created by gy84.bae on 2016-10-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ScalaEditorDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.ScriptEditorDialog.call(this, parentId, options);

        this.checkInfo();
    }

    ScalaEditorDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.ScriptEditorDialog.prototype);
    ScalaEditorDialog.prototype.constructor = ScalaEditorDialog;

    ScalaEditorDialog.prototype.renderInfoArea = function () {
        if (!this.options.scriptOnly) {
            this.renderInputs(this.$infoArea);
            this.renderOutputs(this.$infoArea);
        }
    };

    ScalaEditorDialog.prototype.createInTableAlias = function ($parent) {
        var _this = this;
        var model = this.options.fnUnit.parent();

        var inTableList = this.FnUnitUtils.getInTable(this.options.fnUnit),
            inFunctionList = [];

        for (var i in inTableList) {
            inFunctionList.push(model.getFnUnitByOutData(inTableList[i]));
        }

        for (let fnUnit of inFunctionList) {
            var label = 'inputs(' + i + ')';

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

    ScalaEditorDialog.prototype.createInModelAlias = function ($parent) {
        var _this = this;
        var model = this.options.fnUnit.parent();

        var inModelList = this.FnUnitUtils.getInModel(this.options.fnUnit),
            inFunctionList = [];

        for (var i in inModelList) {
            inFunctionList.push(model.getFnUnitByOutData(inModelList[i]));
        }

        for (let fnUnit of inFunctionList) {
            var label = 'models(' + i + ')';

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

    ScalaEditorDialog.prototype.createInImageAlias = function ($parent) {
        var _this = this;
        var model = this.options.fnUnit.parent();

        var inImageList = this.FnUnitUtils.getInImage(this.options.fnUnit),
            inFunctionList = [];

        for (var i in inImageList) {
            inFunctionList.push(model.getFnUnitByOutData(inImageList[i]));
        }

        for (let fnUnit of inFunctionList) {
            var label = 'images(' + i + ')';

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


    ScalaEditorDialog.prototype.renderEditorArea = function () {
        var _this = this;

        this.sendFnunit = $.extend(true, {}, this.options.fnUnit);

        this.codeMirror = CodeMirror.fromTextArea(this.$editorArea.find('textarea')[0], {
            mode: 'text/x-scala',
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

    ScalaEditorDialog.prototype.renderInputs = function ($parent) {
        this.$inputs = $('<div class="brtc-va-dialogs-scalaeditor-alias-in"></div>');

        $parent.append(this.$inputs);

        this.renderInTableAlias(this.$inputs);
        this.renderInModelAlias(this.$inputs);
        // this.renderInImageAlias(this.$inputs);
    };

    ScalaEditorDialog.prototype.renderInTableAlias = function ($parent) {
        var $inTableAlias = $('<div class="brtc-va-dialogs-scalaeditor-alias-in-table"></div>');

        $parent.append($inTableAlias);

        var $inTableAliasBody = this.addPropertyControl($inTableAlias, {label: 'In Table Variable'});

        this.createInTableAlias($inTableAliasBody);
        $inTableAliasBody.perfectScrollbar();
    };

    ScalaEditorDialog.prototype.renderInModelAlias = function ($parent) {
        var $inModelAlias = $('<div class="brtc-va-dialogs-scalaeditor-alias-in-model"></div>');

        $parent.append($inModelAlias);

        var $inModelAliasBody = this.addPropertyControl($inModelAlias, {label: 'In Model Variable'});

        this.createInModelAlias($inModelAliasBody);
        $inModelAliasBody.perfectScrollbar();
    };

    ScalaEditorDialog.prototype.renderInImageAlias = function ($parent) {
        var $inImageAlias = $('<div class="brtc-va-dialogs-scalaeditor-alias-in-image"></div>');

        $parent.append($inImageAlias);

        var $inImageAliasBody = this.addPropertyControl($inImageAlias, {label: 'In Image Variable'});

        this.createInImageAlias($inImageAliasBody);
        $inImageAliasBody.perfectScrollbar();
    };

    ScalaEditorDialog.prototype.renderOutputs = function ($parent) {
        var _this = this;

        var $outputs = $('<div class="brtc-va-dialogs-scalaeditor-alias-out"></div>');

        $parent.append($outputs);

        this.$outputsBody = this.addPropertyControl($outputs, {label: 'Outputs'});
        this.$outputsBody.perfectScrollbar();

        this.$addButton = $('<input type="button" class= "brtc-va-editors-sheet-controls-propertycontrol-addbutton" value="+ Add Output"/>');
        $outputs.find('.brtc-va-dialogs-scalaeditor-alias-header').after(this.$addButton);
        this.$addButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 32
        });
        this.$addButton.click(function () {
            _this.createOutTableAlias(_this.$outputsBody, false);
            _this.$outputsBody.perfectScrollbar('update');
        });

        this.createOutput(_this.$outputsBody);
    };

    ScalaEditorDialog.prototype.createOutput = function ($parent) {
        var _this = this;
        var outputs = this.FnUnitUtils.getOutputs(this.options.fnUnit);
        var i=0;
        _.forEach(outputs, function (tid, key) {
            var $optionalInput = _this.createOutTableAlias($parent, false, tid);
            var type = _this.FnUnitUtils.getTypeByTableId(_this.options.fnUnit, tid)
            $optionalInput.find('.alias input').val(key);
            $optionalInput.find('.type .brtc-va-dialogs-scalaeditor-alias-body-outtable-type').val(type);
        });

        $parent.perfectScrollbar();
    };

    ScalaEditorDialog.prototype.createOutTableAlias = function ($parent, isMandatory, tableId) {
        var $aliasUnit = $('' +
            '<div class="brtc-va-dialogs-contents-statement-lastline-element-wrapper">' +
            '   <div class="brtc-va-dialogs-contents-statement-lastline-element-script alias"></div>' +
            '   <div class="brtc-va-dialogs-contents-statement-lastline-element-script-type type"></div>' +
            '</div>'
        );

        $parent.append($aliasUnit);

        this.createInput($aliasUnit.find('.brtc-va-dialogs-contents-statement-lastline-element-script'), '', isMandatory, tableId);
        this.createDropDownList($aliasUnit.find('.brtc-va-dialogs-contents-statement-lastline-element-script-type'), '', isMandatory, tableId);

        return $aliasUnit;
    };

    ScalaEditorDialog.prototype.createDropDownList = function ($parent, alias, isMandatory, tableId) {
        var $outTableType = $('' +
            '<div class="brtc-va-dialogs-scalaeditor-alias-body-outtable-type" tableId="' + tableId + '">' +
            '</div>' +
            '');

        $parent.append($outTableType);

        var source = [
            {text: 'TABLE', value: 'table'},
            {text: 'MODEL', value: 'model'}
        ];

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '20px',
            source: source,
            displayMember: 'text',
            selectedIndex: 0,
            valueMember: 'value',
            dropDownHeight: 50
        };
        $outTableType.jqxDropDownList(options);
    };

    ScalaEditorDialog.prototype.createInput = function ($parent, alias, isMandatory, tableId) {
        var _this = this;

        var $outTableInput = $('' +
            '<div class="brtc-va-dialogs-scalaeditor-alias-body-outtable" tableId="' + tableId + '">' +
            '   <input class="brtc-va-dialogs-scalaeditor-alias-body-outtable-input" isMandatory=' + isMandatory + ' />' +
            '   <div class="brtc-va-dialogs-scalaeditor-alias-body-outtable-remove""></div>' +
            '</div>' +
            '');

        var $input = $outTableInput.find('input');

        $parent.append($outTableInput);

        $input.jqxInput({
            placeHolder: "Enter alias",
            height: 32,
            width: '108px',
            theme: 'office'
        });
        $input.jqxInput('val', alias);

        if ($input.val() === '' || $input.val() == undefined) {
            $input.css('border-color', 'red');

        }

        $input.focus();

        $input.on('change', function () {
            if ($(this).val() == '') {
                $(this).css('border-color', 'red');
            } else {
                $(this).css('border-color', '#d4d4d4');
            }
        });

        $input.keydown(function (key) {
            if (key.keyCode == 13) {
                _this.createOutTableAlias(_this.$outputsBody, false);
            }
        });

        if (isMandatory == true && alias == '') {
            $input.css('border-color', 'red');
        }

        var $removeButton = $outTableInput.find('.brtc-va-dialogs-scalaeditor-alias-body-outtable-remove');
        $removeButton.attr({
            'isMandatory': isMandatory
        });

        $removeButton.click(function () {
            var $target = $(this).closest('.brtc-va-dialogs-contents-statement-lastline-element-wrapper');
            if ($target.find('.brtc-va-dialogs-scalaeditor-alias-body-outtable').attr('tableId')) _this.removeSendFnunit($target.attr('tableId'));
            $target.remove();
            _this.$outputsBody.perfectScrollbar('update');
        });

        return $input;
    };

    ScalaEditorDialog.prototype.removeSendFnunit = function (tableId) {
        //????? 뭐지 send?
        // var tableIdIndex = this.FnUnitUtils.getOutTable(this.sendFnunit).indexOf(tableId);

        // this.sendFnunit[OUT_DATA].splice(tableIdIndex, 1);
        // this.sendFnunit.param['out-table-alias'].splice(tableIdIndex, 1);
    };

    ScalaEditorDialog.prototype.addPropertyControl = function ($parent, options) {
        var _this = this;

        var label = options.label;
        if(options.mandatory) label = '<div style="display:inline-block;">' + label + ' <div class="brtc-va-editors-sheet-controls-propertycontrol-mandatory">*</div></div>';
        var $controlHeader = $('<div class="brtc-va-dialogs-scalaeditor-alias-header">' + label + '</div>');
        var $controlBody = $('<div class="brtc-va-dialogs-scalaeditor-alias-body"></div>');
        $controlBody.css('height', '460px');

        $parent.append($controlHeader).append($controlBody);

        return $controlBody;
    };

    ScalaEditorDialog.prototype.getTitle = function () {
        return 'Scala';
    };

    ScalaEditorDialog.prototype.handleOkClicked = function () {
        if (this.options.scriptOnly || this.options.scriptOnly === false) {
            this.dialogResult = {
                OK: true,
                Cancel: false,
                queryStatement: this.codeMirror.getValue()
            };
        } else {
            var aliasArr = this.$outputsBody.find('.brtc-va-dialogs-contents-statement-lastline-element-wrapper');

            this.sendFnunit['outputs'] = {};
            this.sendFnunit['meta'] = {
                'inputs': {'type': 'table', 'range':{'min':1, 'max':10}},
                'models': {'type': 'model', 'range':{'min':1, 'max':10}}
            };
            for (var i = 0; i < aliasArr.length; i++) {
                var alias = $(aliasArr[i]).find('.brtc-va-dialogs-scalaeditor-alias-body-outtable input').val();
                var type = $(aliasArr[i]).find('.brtc-va-dialogs-scalaeditor-alias-body-outtable-type').val();
                var tableId = $(aliasArr[i]).find('.brtc-va-dialogs-scalaeditor-alias-body-outtable').attr('tableId');
                if (tableId === 'undefined' || !tableId) tableId = Brightics.VA.Core.Utils.IDGenerator.table.id();

                this.sendFnunit['outputs'][alias] = tableId;
                this.sendFnunit['meta'][alias] = {type: type};
            }

            this.sendFnunit.param.script = this.codeMirror.getValue();
            this.dialogResult = {
                OK: true,
                Cancel: false,
                param: this.sendFnunit.param,
                outputs: this.sendFnunit.outputs,
                meta: this.sendFnunit.meta
            };
        }

        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.ScalaEditorDialog = ScalaEditorDialog;

}).call(this);
