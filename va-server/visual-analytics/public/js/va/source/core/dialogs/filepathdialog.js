/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function FilePathDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    FilePathDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    FilePathDialog.prototype.constructor = FilePathDialog;


    FilePathDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this._configureDialogOption({
            theme: Brightics.VA.Env.Theme,
            title: 'Remote file path',
            width: 400,
            height: 250,
            modal: true,
            resizable: false
        });
    };


    FilePathDialog.prototype.createDialogContentsArea = function ($parent) {
        this.$input = $('<input type="text"/>');
        $parent.append(this.$input);

        this.$input.jqxInput({
            placeHolder: Brightics.locale.placeHolder.enterName,
            theme: Brightics.VA.Env.Theme,
            width: 'calc(100% - 2px)',
            height: 25
        });
        this.$input.val(this.options.name);
        this.$input.jqxInput('selectAll');
        this.$input.jqxInput('focus');
    };

    FilePathDialog.prototype.handleOkClicked = function () {
        if(this.$input.val().trim() === ''){
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('File does not exist.', function () {
            });
            return;
        }
        this.dialogResult = {
            OK: true,
            Cancel: false,
            name: this.$input.val()
        };
        this.$mainControl.dialog('close');
    };

    FilePathDialog.prototype.handleCancelClicked = function () {
        this.dialogResult = {
            OK: false,
            Cancel: true,
        };
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.FilePathDialog = FilePathDialog;

}).call(this);