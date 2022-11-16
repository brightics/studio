/**
 * Created by sungjin1.kim on 2017-11-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DetailDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    DetailDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    DetailDialog.prototype.constructor = DetailDialog;

    DetailDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 680;
        this.dialogOptions.height = 540;
        this.dialogOptions.keyboardCloseKey = '';
        this.dialogOptions.closeOnEscape = false;
    };

    DetailDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<textarea class="brtc-va-dialogs-launch-progress-logs" style="display: none"></textarea>'
        );
        this.detailText = CodeMirror.fromTextArea($parent.find('.brtc-va-dialogs-launch-progress-logs')[0], {
            mode: 'text/html',
            theme: 'default',
            lineNumbers: false,
            matchBrackets: true,
            autofocus: true,
            readOnly: true
        });
        this.detailText.setSize('100%', '100%');
        this.detailText.setValue(this.options.detailText);
        this.detailText.focus();

        $parent.css('height', 'calc(100% - 10px)');
    };

    DetailDialog.prototype.createDialogButtonBar = function ($parent) {
        $parent.hide();
    };

    Brightics.VA.Core.Dialogs.DetailDialog = DetailDialog;

}).call(this);