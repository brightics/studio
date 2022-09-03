(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EditResourceDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    EditResourceDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    EditResourceDialog.prototype.constructor = EditResourceDialog;

    EditResourceDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 760;
        this.dialogOptions.height = 440;
    };

    EditResourceDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-editresourcedialog-contents');

        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.name + '</div>' +
            '   <input type="text" class="brtc-va-dialogs-editresourcedialog-name-input" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.description + '</div>' +
            '   <div class="brtc-va-dialogs-editresourcedialog-description-container">' +
            '   </div>' +
            '</div>');

        this.createNameControl($parent.find('.brtc-va-dialogs-editresourcedialog-name-input'));
        this.createDescriptionControl($parent.find('.brtc-va-dialogs-editresourcedialog-description-container'));
        this.$nameControl.focus();
    };

    EditResourceDialog.prototype.createNameControl = function ($control) {
        this.$nameControl = $control.jqxInput({
            placeHolder: Brightics.locale.placeHolder.enterName,
            theme: Brightics.VA.Env.Theme
        });

        this.$nameControl.val(this.options.label);
    };

    EditResourceDialog.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            focus: false,
            height: 188,
            description: this.options.description,
            okButton: this.$okButton,
            maxLength: 2000,
            toolbar: this.options.toolbar
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);

        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
        });
    };

    EditResourceDialog.prototype.handleOkClicked = function () {
        const nameVal = this.$nameControl.val().trim();
        
        if (nameVal === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter name.');
            return;
        } else if (nameVal.indexOf('\"') > -1) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Cannot use " in function name.');
            return;
        }

        if ($('<div>').append(this.noteControl.getCode()).text().length > 2000) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Description should be less than or equal to 2000 characters.');
            return;
        }

        this.dialogResult.label = nameVal;
        var currentCode = this.noteControl.getCode();
        if (currentCode === '<p><br></p>') currentCode = '';
        this.dialogResult.description = currentCode;

        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    Brightics.VA.Core.Dialogs.EditResourceDialog = EditResourceDialog;

}).call(this);
