/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');

    var defaultDialogOption = {
        destroyOnClose: false,
        position: {my: 'center', at: 'center', of: window},
        appendTo: 'body',
        modal: true,
        resizable: false,
        draggable: true,
        width: 600,
        height: 500,
        maxWidth: 600,
        maxHeight: 500
    };

    function Dialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.destroyOnClose = this.options.destroyOnClose === false ? false : true;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.FnUnitUtils = FnUnitUtils;

        this.retrieveParent();
        this._initOptions();
        this.createControls();
        this.setAttrName();
        this.initContents();
        this.bindEventHandler();
    }

    Dialog.prototype._initOptions = function () {
        this.dialogOptions = $.extend(true, {}, defaultDialogOption, this.options);
    };

    Dialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Dialog.prototype.getTitle = function () {
        return this.dialogOptions.title;
    };

    Dialog.prototype.getPosition = function () {
        return this.dialogOptions.position;
    };

    Dialog.prototype.setAttrName = function () {
        this.$mainControl.attr('name', this.getTitle());
    };

    Dialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main">' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '       </div>' +
            '   </div>' +
            '</div>');
    };

    Dialog.prototype.initContents = function () {
        this.$mainControl.dialog(this.dialogOptions);

        this.createDialogButtonBar(this.$mainControl.find('.brtc-va-dialogs-buttonbar'));
        this.createDialogContentsArea(this.$mainControl.find('.brtc-va-dialogs-contents'));
        
        if (!this.dialogOptions.title) this.$parent.find('.ui-dialog-titlebar.ui-widget-header').attr('style', 'border-bottom: none !important;');
    };


    Dialog.prototype.bindEventHandler = function () {
        var _this = this;
        this.$mainControl.on('dialogclose', function (e) {
            e.stopPropagation();

            if (typeof _this.options.close == 'function') {
                _this.options.close(_this.dialogResult);
            }
            if (_this.destroyOnClose !== false) {
                _this.destroy();
            }
        });
    };

    Dialog.prototype._setStopPropagationHandler = function () {
        this.$mainControl.closest('.ui-dialog').on('click', function (e) {
            e.stopPropagation();
        });

        this.$mainControl.closest('.ui-dialog').on('mousedown', function (e) {
            e.stopPropagation();
        });

        if (this.dialogOptions.modal) {
            $('.ui-widget-overlay').on('click', function (e) {
                e.stopPropagation();
            });
        }
    };

    Dialog.prototype.setFocus = function () {
        this.$mainControl.focus();
    };

    Dialog.prototype.close = function () {
        if (this.$mainControl && this.$mainControl.dialog('isOpen')) {
            this.$mainControl.dialog('close');
        }
    };

    Dialog.prototype.open = function () {
        if (this.$mainControl) {
            this.$mainControl.dialog('open');
        }
    };

    Dialog.prototype.createDialogButtonBar = function ($parent) {
        this.$okButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-ok" value="' + Brightics.locale.common.ok + '" />');
        $parent.append(this.$okButton);
        this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$okButton.click(this.handleOkClicked.bind(this));

        this.$cancelButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="' + Brightics.locale.common.cancel + '" />');
        $parent.append(this.$cancelButton);
        this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$cancelButton.click(this.handleCancelClicked.bind(this));
    };

    Dialog.prototype.destroy = function () {
        this.$mainControl.dialog('destroy');
        this.$mainControl = undefined;
    };

    Dialog.prototype.createDialogContentsArea = function ($parent) {
    };

    Dialog.prototype.handleOkClicked = function () {
        if (typeof this.$mainControl === 'undefined') return;
        this.dialogResult.OK = true;
        this.dialogResult.Cancel = false;

        this.$mainControl.dialog('close');
    };

    Dialog.prototype.handleCancelClicked = function () {
        this.dialogResult.OK = false;
        this.dialogResult.Cancel = true;

        this.$mainControl.dialog('close');
    };

    Dialog.prototype.createEmptyControl = function (message) {
        this.$mainControl.empty();

        this.$mainControl
            .css({
                'text-align': 'center',
                'line-height': (this.dialogOptions.height - this.getHeaderHeight()) + 'px'
            })
            .text(message);
    };

    Dialog.prototype.getHeader = function () {
        return this.$parent.find('.ui-dialog-titlebar.ui-widget-header');
    };

    Dialog.prototype.getHeaderHeight = function () {
        return 60;
    };

    Dialog.prototype._configureDialogOption = function (additionalOption) {
        return $.extend(true, this.dialogOptions, additionalOption);
    };

    Dialog.prototype.setStyle = function (style) {
        this.$mainControl.css(style);
    };

    Dialog.prototype.modifyCloseButton = function ($button ,callback) {
        var $header = this.getHeader();
        $header.find('button.ui-dialog-titlebar-close').hide();

        $header.append($button);
        $header.click(callback);
    };

    Brightics.VA.Dialogs.Dialog = Dialog;

}).call(this);