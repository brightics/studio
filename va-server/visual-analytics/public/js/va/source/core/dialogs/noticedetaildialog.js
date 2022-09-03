(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NoticeDetailDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    NoticeDetailDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    NoticeDetailDialog.prototype.constructor = NoticeDetailDialog;

    NoticeDetailDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 760;
        this.dialogOptions.height = 440;
    };

    NoticeDetailDialog.prototype.createDialogContentsArea = function ($parent) {
        var $noticeDetailContent = $('' +
            '<div class="brtc-va-dialogs-row-flex-layout notice">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold notice">Title</div>' +
            '   <div class="brtc-va-dialogs-contents-input notice"></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold notice">Register Date</div>' +
            '   <div class="brtc-va-dialogs-contents-input-half notice">' + Brightics.VA.Core.Utils.CommonUtils.transferTimestampToDateString(new Date(this.options.noticeData.create_time)) + '</div>' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold notice">Creator</div>' +
            '   <div class="brtc-va-dialogs-contents-input-half notice creator">' + this.options.noticeData.creator + '</div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold notice">Content</div>' +
            '   <div class="brtc-va-dialogs-contents-textarea-wrapper notice" style="word-wrap:break-word; ">' +
            '       <div class="brtc-va-dialogs-contents-textarea notice"></div>' +
            '   </div>' +
            '</div>');

        $noticeDetailContent.find('.brtc-va-dialogs-contents-input.notice').attr('title', this.options.noticeData.title).text(this.options.noticeData.title);
        $noticeDetailContent.find('.brtc-va-dialogs-contents-input-half.notice.creator').attr('title', this.options.noticeData.creator);

        $parent.append($noticeDetailContent);

        $parent.find('.brtc-va-dialogs-contents-textarea.notice').html(this.options.noticeData.content);
        $('.brtc-va-dialogs-contents-textarea-wrapper.notice').perfectScrollbar();
    };

    NoticeDetailDialog.prototype.createDialogButtonBar = function ($parent) {
        var _this = this;

        this.$closeButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-close" value="Close" />');
        $parent.append(this.$closeButton);
        this.$closeButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        this.$closeButton.on('click', function (event) {
            _this.$mainControl.dialog('close');
            event.stopPropagation();
        });
    };

    Brightics.VA.Core.Dialogs.NoticeDetailDialog = NoticeDetailDialog;

}).call(this);