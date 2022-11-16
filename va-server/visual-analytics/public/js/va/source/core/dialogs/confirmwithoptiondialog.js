/**
 * Created by daewon.park on 2016-10-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ConfirmWithOptionDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    ConfirmWithOptionDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ConfirmWithOptionDialog.prototype.constructor = ConfirmWithOptionDialog;

    ConfirmWithOptionDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 450;
        this.dialogOptions.height = 250;
    };

    ConfirmWithOptionDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '    <span class="brtc-va-dialogs-body-content-icon"></span>' +
            '    <div class="brtc-va-dialogs-body-content-content-text"><span>' + _.escape(this.options.contentText) + '</span></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-option">' + _.escape(this.options.optionText) + '</div>' +
            '</div>' +
            '');

        this.createOptionControl($parent.find('.brtc-va-dialogs-contents-option'));
    };

    ConfirmWithOptionDialog.prototype.createOptionControl = function ($control) {
        this.$includeControl = $control.jqxCheckBox({
            theme: "office",
            height: 25,
            checked: true,
            boxSize: "17px"
        });
    };

    ConfirmWithOptionDialog.prototype.handleOkClicked = function () {
        this.dialogResult.OPTION = this.$includeControl.jqxCheckBox('val');
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    Brightics.VA.Core.Dialogs.ConfirmWithOptionDialog = ConfirmWithOptionDialog;

}).call(this);