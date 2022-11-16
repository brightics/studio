/**
 * Created by daewon.park on 2016-09-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AddToLibraryDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    AddToLibraryDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    AddToLibraryDialog.prototype.constructor = AddToLibraryDialog;

    AddToLibraryDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 400;
        this.dialogOptions.height = 300;
    };

    AddToLibraryDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-add2lib-library-label">' + Brightics.locale.common.template + '</div>' +
            '<div class="brtc-va-dialogs-add2lib-library-selector"></div>' +
            '<div class="brtc-va-dialogs-add2lib-library-label">' + Brightics.locale.common.name + '</div>' +
            '<input type="text" class="brtc-va-dialogs-add2lib-library-name-input" maxlength="80"/>' +
            '<div class="brtc-va-dialogs-add2lib-library-preview"></div>' +
            '');

        var source = {
            datatype: "json",
            datafields: [
                {name: 'id'},
                {name: 'label'}
            ],
            url: 'api/va/v2/ws/libraries',
            async: true
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$librarySelector = $parent.find(".brtc-va-dialogs-add2lib-library-selector").jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            source: dataAdapter, selectedIndex: 0,
            displayMember: 'label', valueMember: 'id',
            width: 'calc(100% - 100px)',
            height: '25px'
        });

        this.$nameInput = $parent.find(".brtc-va-dialogs-add2lib-library-name-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: Brightics.locale.placeHolder.enterName,
            width: 'calc(100% - 100px)',
            height: '25px'
        });
    };

    AddToLibraryDialog.prototype.setFocus = function () {
        this.$nameInput.focus();
    };

    AddToLibraryDialog.prototype.handleOkClicked = function () {
        var _this = this;
        if (this.$librarySelector.val() && this.$nameInput.val().trim()) {
            this.dialogResult.library = this.$librarySelector.val();
            this.dialogResult.label = this.$nameInput.val().trim();
            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
        } else {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter template and name.', function () {
                // _this.$mainControl.jqxWindow('focus');
            });
        }
    };

    Brightics.VA.Core.Dialogs.AddToLibraryDialog = AddToLibraryDialog;

}).call(this);
