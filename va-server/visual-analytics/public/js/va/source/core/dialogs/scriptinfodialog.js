/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const STORAGE_NAME = 'info.script.show';

    function ScriptInfoDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    ScriptInfoDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ScriptInfoDialog.prototype.constructor = ScriptInfoDialog;

    ScriptInfoDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 420;
        this.dialogOptions.height = 200;
    };

    ScriptInfoDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<span class="brtc-va-dialogs-body-content-icon" alert="warn"></span>' +
            '<p>Please be cautious with using scripts because they can cause serious problems to your system.</p>');
        $('.ui-dialog-titlebar.ui-widget-header').attr('style', 'border-bottom: none !important;');
    };

    ScriptInfoDialog.prototype.getPosition = function ($parent) {
    };

    ScriptInfoDialog.prototype.createDialogButtonBar = function ($parent) {
        var checkMessage = 'Do not ask me again';
        var $checkbox = $('<div>' + checkMessage + '</input>');

        $parent.append($checkbox);

        $checkbox.jqxCheckBox({
            theme: "office",
            width: 200,
            height: 25,
            checked: false,
            boxSize: "17px",
            animationShowDelay: 0,
            animationHideDelay: 0
        });

        $checkbox.on('click', function () {
            localStorage.setItem(STORAGE_NAME, !$(this).val());
        });
        $checkbox.css('float', 'left');

        this.$okButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />');
        $parent.append(this.$okButton);
        this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$okButton.click(this.handleOkClicked.bind(this));
    };

    Brightics.VA.Core.Dialogs.ScriptInfoDialog = ScriptInfoDialog;

}).call(this);