/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NoticeContainerDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    NoticeContainerDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    NoticeContainerDialog.prototype.constructor = NoticeContainerDialog;

    NoticeContainerDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 500;
        this.dialogOptions.height = 600;
        this.dialogOptions.position = {my: 'right top', at: 'right top+50', of: window};
    };
    
    NoticeContainerDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        this.$mainControl = $('<div class="brtc-va-tools-menubar-notice-container" />');
        $parent.append(this.$mainControl);

        var $emptyBox = $('<div class="brtc-va-tools-menubar-notice-box empty">Loading...</div>');

        this.$mainControl.append($emptyBox);

        var callback = function (data) {
            for (var i in data) {
                $('.brtc-va-tools-menubar-notice-box.empty').remove();

                var timeStamp = new Date(data[i].create_time);
                var date = Brightics.VA.Core.Utils.CommonUtils.transferTimestampToDateString(timeStamp);

                var $noticeBox = $('' +
                    '   <div class="brtc-va-tools-menubar-notice-box">' +
                    '       <div class="brtc-va-tools-menubar-notice-box-header">' +
                    '           <div class="brtc-va-tools-menubar-notice-box-header-new"></div>' +
                    '           <div class="brtc-va-tools-menubar-notice-box-header-title"></div>' +
                    '       </div>' +
                    '       <div class="brtc-va-tools-menubar-notice-box-body">' +
                    '           <div class="brtc-va-tools-menubar-notice-box-body-content"></div>' +
                    '       </div>' +
                    '       <div class="brtc-va-tools-menubar-notice-box-footer border-bottom">' +
                    '           <div class="brtc-va-tools-menubar-notice-box-footer-date">' + date + '</div>' +
                    '           <div class="brtc-va-tools-menubar-notice-box-footer-link-img"></div>' +
                    '           <div class="brtc-va-tools-menubar-notice-box-footer-link" index="' + i + '"><u>more</u></div>' +
                    '       </div>' +
                    '   </div>' +
                    ''
                );

                $noticeBox.find('.brtc-va-tools-menubar-notice-box-header-title').text(data[i].title);

                $noticeBox.find('.brtc-va-tools-menubar-notice-box-body-content').html(((data[i].content) ? data[i].content : ''));
                this.$mainControl.append($noticeBox);

                var $more = $noticeBox.find('.brtc-va-tools-menubar-notice-box-footer-link');
                $more.click(function () {
                    var noticeData = data[$(this).attr('index')];
                    new Brightics.VA.Core.Dialogs.NoticeDetailDialog($(this).closest('.brtc-va-editors-modeleditor-report-element-body'), {
                        noticeData: noticeData,
                        title: 'Notice Detail'
                    });
                });

                var $new = $noticeBox.find('.brtc-va-tools-menubar-notice-box-header-new');
                (Brightics.VA.Core.Utils.CommonUtils.getTimeDifferenceFromNow(data[i].update_time) < 24) ? $new.show() : $new.hide();

                if (i == 2) break;
            }
            if (data.length === 0) $emptyBox.text('No Notice.');
        };

        this.getNoticeData(callback.bind(this));
    };

    NoticeContainerDialog.prototype.getNoticeData = function (callback) {
        var option = {
            url: 'api/admin/v2/notices',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        };
        $.ajax(option).done(function (noticeData) {
            callback(noticeData);
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    NoticeContainerDialog.prototype.createDialogButtonBar = function () {

    };

    Brightics.VA.Core.Tools.MenuBar.NoticeContainerDialog = NoticeContainerDialog;

}).call(this);
