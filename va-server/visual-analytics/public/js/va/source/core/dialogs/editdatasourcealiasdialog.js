/**
 * Created by daewon.park on 2016-11-08.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EditDataSourceAliasDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    EditDataSourceAliasDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    EditDataSourceAliasDialog.prototype.constructor = EditDataSourceAliasDialog;

    EditDataSourceAliasDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 648;
        this.dialogOptions.height = 248;
    };

    EditDataSourceAliasDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-rename-name-label">' + Brightics.locale.common.dataSourceLabel + ': </div>' +
            '   <input type="text" class="brtc-va-dialogs-rename-name-input" maxlength="80">' +
            '</div>');

        this.createNameControl($parent.find('.brtc-va-dialogs-rename-name-input'));
    };

    EditDataSourceAliasDialog.prototype.createNameControl = function ($control) {
        this.$nameControl = $control.jqxInput({
            placeHolder: Brightics.locale.sentence.S0004,
            theme: Brightics.VA.Env.Theme
        });
        if (this.options.name) {
            this.$nameControl.val(this.options.name);
        }
    };

    EditDataSourceAliasDialog.prototype.handleOkClicked = function () {
        var newName = this.$nameControl.val().trim();
        if (newName.length == 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter data source label.');
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

    Brightics.VA.Core.Dialogs.EditDataSourceAliasDialog = EditDataSourceAliasDialog;

}).call(this);