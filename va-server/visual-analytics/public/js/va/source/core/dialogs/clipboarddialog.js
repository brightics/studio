/**
 * Created by jhoon80.park on 2016-04-06.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ClipboardDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    ClipboardDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ClipboardDialog.prototype.constructor = ClipboardDialog;

    ClipboardDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-main-clipboard">' +
            '   <div class="brtc-va-dialogs-body">' +
            '   </div>' +
            '</div>');

        this.$mainControl.dialog(this.dialogOptions);
        this.$mainControl.parent().draggable("option", "containment", this.$mainControl.closest('.brtc-va-editor'));
    };

    ClipboardDialog.prototype._initOptions = function () {
        this.dialogOptions = {
            title: Brightics.locale.common.functionClipboard,
            appendTo: this.$parent,
            position: {
                my: "left top",
                at: "left bottom",
                of: this.$parent.find('.brtc-style-s-editor-toolitem[item-type=clipboard]')
            },
            width: 400,
            height: 600,
            maxWidth: 400,
            maxHeight: 600,
            modal: false,
            resizable: false
        };
        this.destroyOnClose = true;
    };

    ClipboardDialog.prototype.initContents = function () {
        var $parent = this.$mainControl.find('.brtc-va-dialogs-body');
        this.$clipboardList = $('<div class="brtc-va-dialogs-body-clipboardlist brtc-style-full brtc-style-relative"></div>');
        $parent.append(this.$clipboardList);

        this.clipboardExplorer = new Brightics.VA.Core.Views.ClipboardExplorer(this.$clipboardList, {
            height: '100%',
            modelType: Brightics.VA.Implementation.DataFlow.Clazz,
            functionList: $.extend(true, [], this.options.functionList)
        });
        this.$clipboardList.perfectScrollbar();
    };

    ClipboardDialog.prototype.updateFunctionList = function (functionList) {
        this.clipboardExplorer.updateFunctionList(functionList);
        this.$clipboardList.perfectScrollbar('update');
    };
    ClipboardDialog.prototype.setEnable = function (enabled) {
        var $disableDim = this.$mainControl.find('.brtc-va-dialogs-body-disable');
        if (enabled === true && $disableDim.length > 0) {
            $disableDim.remove()
        } else if (enabled !== true && $disableDim.length === 0) {
            this.$mainControl.append('<div class="brtc-va-dialogs-body-disable"></div>')
        }
    };

    ClipboardDialog.prototype.isAlive = function () {
        return !!this.$mainControl;
    }

    Brightics.VA.Core.Dialogs.ClipboardDialog = ClipboardDialog;

}).call(this);