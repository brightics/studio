/**
 * Created by daewon.park on 2016-10-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AdvancedLoadSettingDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    AdvancedLoadSettingDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    AdvancedLoadSettingDialog.prototype.constructor = AdvancedLoadSettingDialog;

    AdvancedLoadSettingDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 600;
        this.dialogOptions.height = 500;
    };

    AdvancedLoadSettingDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-delimiter-input-label">Array Delimiter</div>' +
            '   <input type="text" class="brtc-va-dialogs-delimiter-input" param="array-delimiter" placeholder="Unicode #2" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-delimiter-input-label">Key Value Delimiter</div>' +
            '   <input type="text" class="brtc-va-dialogs-delimiter-input" param="key-value-delimiter" placeholder="Unicode #3" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-delimiter-input-label">Array Start String</div>' +
            '   <input type="text" class="brtc-va-dialogs-delimiter-input" param="array-start-string" placeholder="[" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-delimiter-input-label">Array End String</div>' +
            '   <input type="text" class="brtc-va-dialogs-delimiter-input" param="array-end-string" placeholder="]" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-delimiter-input-label">Map Start String</div>' +
            '   <input type="text" class="brtc-va-dialogs-delimiter-input" param="map-start-string" placeholder="{" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-delimiter-input-label">Map End String</div>' +
            '   <input type="text" class="brtc-va-dialogs-delimiter-input" param="map-end-string" placeholder="}" maxlength="80">' +
            '</div>' +
            '');

        this.createInputControls($parent.find('.brtc-va-dialogs-delimiter-input'));
        this.fillInputControls($parent.find('.brtc-va-dialogs-delimiter-input'));

    };

    AdvancedLoadSettingDialog.prototype.createInputControls = function ($control) {
        $control.jqxInput({
            theme: Brightics.VA.Env.Theme
        });
    };

    AdvancedLoadSettingDialog.prototype.fillInputControls = function (inputControls) {
        var delimiters = this.options.delimiters;
        var defaultDelimiter = this.options.defaultDelimiter;
        var $inputControl, delimiter, inputValue;

        for (var i = 0; i < inputControls.length; i++) {
            $inputControl = $(inputControls[i]);
            delimiter = $inputControl.attr('param');
            inputValue = (delimiters[delimiter] === defaultDelimiter[delimiter]) ? '' : delimiters[delimiter];
            $inputControl.val(inputValue);
        }

    };

    AdvancedLoadSettingDialog.prototype.handleOkClicked = function () {
        var delimiters = {}, $inputControl;

        var inputControls = this.$mainControl.find('.brtc-va-dialogs-delimiter-input');

        for (var i = 0; i < inputControls.length; i++) {
            $inputControl = $(inputControls[i]);
            delimiters[$inputControl.attr('param')] = $inputControl.val();
        }
        this.dialogResult = {
            OK: true,
            Cancel: false,
            delimiters: delimiters
        };
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.AdvancedLoadSettingDialog = AdvancedLoadSettingDialog;

}).call(this);