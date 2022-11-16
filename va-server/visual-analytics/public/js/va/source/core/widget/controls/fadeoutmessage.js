/**
 * Created by ng1123.kim on 2016-11-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function FadeOutMessage($parent, options) {
        this.$parent = $parent;
        this.options = options;

        var offset = this.getParentOffset();
        var size = this.getParentSize();

        this.removePreMessageBox();
        this.createMessageBox(offset, size);
        this.notifyMessage();
    }

    FadeOutMessage.prototype.getParentOffset = function () {
        return this.$parent.offset();
    };
    FadeOutMessage.prototype.getParentSize = function () {
        return {
            width: this.$parent.width(),
            height: this.$parent.height()
        };
    };

    FadeOutMessage.prototype.removePreMessageBox = function () {
        var preMessageBox = $('body').children('.brtc-va-widget-messagebox-container');
        if (preMessageBox.length > 0) {
            preMessageBox.remove();
        }
    };

    FadeOutMessage.prototype.removeMessageBoxTimeout = function () {
        var _this = this;

        setTimeout(function () {
            var messageBox = $('body').children('.brtc-va-widget-messagebox-container');
            var massages = messageBox.find('div');
            if (massages.length > 0) {
                _this.removeMessageBoxTimeout();
            } else {
                messageBox.remove();
            }
        }, 1000);

    };


    FadeOutMessage.prototype.createMessageBox = function (offset, size) {
        this.$messageBox = $('<div class="brtc-va-widget-messagebox-container"></div>');
        $('body').append(this.$messageBox);
        this.messageBoxWidth = this.$messageBox.width();

        /*var offset = this.getMessageBoxOffset(offset, size);

        this.$messageBox.css({
            'top': offset.top,
            'left': offset.left
        });*/


        this.removeMessageBoxTimeout();
    };

    FadeOutMessage.prototype.getMessageBoxOffset = function (offset, size) {
        var messageBoxOffset = {}, position = this.options.position;
        if (position === 'bottom') {
            messageBoxOffset = {
                'top': offset.top + size.height + 10,
                'left': offset.left
            };
        } else if (position === 'left') {
            messageBoxOffset = {
                'top': offset.top,
                'left': offset.left - this.messageBoxWidth - 10
            };
        } else {
            messageBoxOffset = {
                'top': offset.top,
                'left': offset.left + size.width + 10
            };
        }
        return messageBoxOffset;
    };


    FadeOutMessage.prototype.notifyMessage = function () {
        var $message = $('<div>' + this.options.message + '</div>');
        $message.jqxNotification({
            width: "100%",
            appendContainer: this.$messageBox,
            opacity: 0.9,
            autoClose: true,
            autoOpen: true,
            template: "info",
            theme: 'office'
        });
    };

    Brightics.VA.Core.Widget.Controls.FadeOutMessage = FadeOutMessage;

}).call(this);