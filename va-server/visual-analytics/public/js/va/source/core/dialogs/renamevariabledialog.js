/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RenameVariableDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    RenameVariableDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    RenameVariableDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-renamevariable">' +
            // '   <div class="brtc-va-dialogs-header">Rename</div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        var _this = this;

        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: 'Rename',
            width: 400,
            height: 200,
            modal: true,
            resizable: false,
            close: function () {
                if (typeof _this.options.close == 'function') {
                    _this.options.close(_this.dialogResult);
                }
            }
        };
        this.$mainControl.dialog(jqxOpt);
    };

    RenameVariableDialog.prototype.initContents = function () {
        var _this = this;
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$okButton.click(_this.handleOkClicked.bind(_this));

        _this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
    };


    RenameVariableDialog.prototype.createDialogContentsArea = function ($parent) {
        this.$input = $('<textarea  class="brtc-va-widget-contents-input-control"/>');
        $parent.append(this.$input);

        var controlOptions = {
            verifier: new Brightics.VA.Core.Verifier.CFVariableVerifier(),
            scrollbarStyle: 'null',
            placeholder: '',
            lineWrapping: false,
            matchBrackets: false,
            hintOptions: {
                list: []
            }
        };
        this.expressionControl = new Brightics.VA.Core.Editors.Sheet.Controls.TextAreaControl(this.$input, controlOptions);

        this.expressionControl.codeMirror.setSize('100%', '26px');
        this.expressionControl.codeMirror.on("beforeChange", function (instance, changeObj) {
            var typedNewLine = changeObj.origin == '+input' && typeof changeObj.text == "object" && changeObj.text.join("") == "";
            if (typedNewLine) {
                instance.doc.setCursor(instance.getCursor());
                return changeObj.cancel();
            }

            var pastedNewLine = changeObj.origin == 'paste' && typeof changeObj.text == "object" && changeObj.text.length > 1;
            if (pastedNewLine) {
                var newText = changeObj.text.join(" ");
                return changeObj.update(null, null, [newText]);
            }
            return null;
        });
        this.expressionControl.codeMirror.setValue(this.options.name);
        this.expressionControl.codeMirror.markText(
            {line: 0, ch: 0},
            {line: 0, ch: 2},
            {
                readOnly: true,
                inclusiveLeft: true,
                atomic: true
            });
        this.expressionControl.codeMirror.markText(
            {line: 0, ch: this.options.name.length - 1},
            {line: 0, ch: this.options.name.length},
            {
                readOnly: true,
                inclusiveRight: true,
                atomic: true
            });
        // this.$input.jqxInput({
        //     placeHolder: 'Enter name',
        //     theme: Brightics.VA.Env.Theme,
        //     width: 'calc(100% - 2px)',
        //     height: 25
        // });
        // this.$input.val(this.options.name);
        // this.$input.jqxInput('selectAll');
        // this.$input.jqxInput('focus');
    };

    RenameVariableDialog.prototype.handleOkClicked = function () {
        if (this.expressionControl.getValue() === '${}') return;

        this.dialogResult = {
            OK: true,
            Cancel: false,
            name: this.expressionControl.getValue() //this.$input.val()
        };
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.RenameVariableDialog = RenameVariableDialog;

}).call(this);