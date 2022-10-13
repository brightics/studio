/**
 * Created by daewon.park on 2016-11-08.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RenameDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    RenameDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    RenameDialog.prototype.constructor = RenameDialog;

    RenameDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 600;
        this.dialogOptions.height = 300;
    };

    RenameDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-rename-name-label">'+Brightics.locale.common.name+'</div>' +
            '   <input type="text" class="brtc-va-dialogs-rename-name-input" maxlength="80" valid-type="renamefileType">' +
            '</div>');

        this.createNameControl($parent.find('.brtc-va-dialogs-rename-name-input'));
    };

    RenameDialog.prototype.createNameControl = function ($control) {
        this.$nameControl = $control.jqxInput({
            placeHolder: Brightics.locale.placeHolder.enterName,
            theme: Brightics.VA.Env.Theme
        });
        if (this.options.name) {
            this.$nameControl.val(this.options.name);
        }
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition(this.$nameControl);
    };

    RenameDialog.prototype.handleOkClicked = function () {
        var newName = this.$nameControl.val().trim();
        if (newName.length == 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(Brightics.locale.sentence.S0020);
            return;
        }
        //"."가 2개이상 연속되면 Error 발생
        var temp = "";
        var intCnt = 0;
        for (var i = 0; i < newName.length; i++) {
            temp = newName.charAt(i);
            if (temp == '.') {
                if (temp == newName.charAt(i + 1)) {
                    intCnt = intCnt + 1;
                }
            }
        }
        if (intCnt > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('[.] can not use it repeatedly.');
            return;
        }
        if (typeof this.options.validate === 'function') {
            var message = this.options.validate(newName);
            if (message) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(message);
                return;
            }
        }
        this.dialogResult.newName = newName;
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    Brightics.VA.Core.Dialogs.RenameDialog = RenameDialog;

}).call(this);
