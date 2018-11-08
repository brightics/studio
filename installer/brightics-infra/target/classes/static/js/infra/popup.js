/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    // Constructor
    function PopUp($parent, options) {
        this.$parent = $parent;
        this.options = options || {};
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));

        this.createLayout();
    }

    PopUp.prototype.destroy = function () {
        this.$mainControl.remove();
        this.studio.popupStatus = 'cancel';
    };

    PopUp.prototype.getStatus = function () {
        return this.status;
    };

    PopUp.prototype.createLayout = function () {
        var _this = this;
        var width = this.options.width;
        var height = this.options.height;
        var popupTitle = this.options.title;
        var popupMessageList = this.options.message;
        var hasCheckBox = this.options.hasCheckBox;
        var checkBoxMessage = this.options.checkBoxMessage || 'Save Changes and then move';
        var showCloseButton = this.options.showCloseButton;
        var mode = this.options.mode; //'confirm': two button, 'alert': one button
        var callback = this.options.callback || function(){this.$mainControl.fadeOut(); this.$mainControl.remove();};
        var $content = this.options.content;

        this.$mainControl = $('' +
            '<div class="layer" style="display: none">' +
            '   <div class="bg"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$popupLayout = $('' +
            '<div class="layer_area" style="width:353px;">' +
            '   <div class="pp_title">' +
            '       <strong>' + popupTitle + '</strong>' +
            '       <a href="javascript:;" class="layer_close close"></a>' +
            '   </div>' +
            '   <div class="pp_cont clearfix" style="overflow:hidden">' +
            //'       <p class="pp_msg">' + popupMessageList + '</p>' +
            //'       <div class="pp_checkbox_area pp_msg ">' +
            //'           <input class="check" type="checkbox" value="" name="" id="chk_savemove">' +
            //'           <label for="chk_savemove">' + checkBoxMessage + '</label>' +
            //'       </div>' +
            '   </div>' +
            '   <div class="btn_wrap mt22 fl_r">' +
            '       <button class="pp_cancel_button btnPopupWhite b_comm"><span>Cancel</span></button>' +
            '       <button class="pp_ok_button btnBigBlue b_comm"><span>OK</span></button>' +
            '   </div>' +
            '</div>');

        if(!showCloseButton) {
            this.$popupLayout.find('.pp_title a').remove();
        }

        for (var i in popupMessageList) {
            var $message = $('<p class="pp_msg">' + popupMessageList[i] + '</p>');

            this.$popupLayout.find('.pp_cont').append($message);
        }


        this.$mainControl.append(this.$popupLayout);
        if(!hasCheckBox){
            this.$popupLayout.find('.pp_checkbox_area').remove();
        }
        if(mode==='alert'){
            this.$popupLayout.find('.pp_cancel_button').remove();
        }

        if(mode==='progress'){
            this.$popupLayout.find('.btn_wrap').remove();
            this.$popupLayout.find('.pp_title a').remove();

            this.$popupLayout.find('.pp_cont').empty();

            var $spinner = $('' +
                '<div id="spinner">' +
                '   <span id="stop-spinner" class="icon loading big"></span>' +
                //'   <i class="fa fa-circle-o-notch fa-spin fa-2x" style="color: #86BFA0; font-size: 80px"></i>' +
                '</div>' +
                '');
            $spinner.css({
                'marginLeft': '120px',
                'marginTop': '25px'
            });

            this.$popupLayout.find('.pp_cont').append($spinner);
            //��Ʈ�
        }

        if (mode === 'log') {
            this.$popupLayout.find('.btn_wrap').remove();

            this.$popupLayout.css({
                'width': width + 'px',
                'height': height + 'px'
            });

            this.$popupLayout.find('.pp_cont').css({
                'overflow': 'auto',
                'height': (height - 100) + 'px',
//                'cursor': 'text',
                'padding-top': '15px'
            });

            if ($content) {
                this.$popupLayout.find('.pp_cont').append($content);
            }
        }

        this.$mainControl.fadeIn();
        var popup = this.$popupLayout;
        if (popup.outerHeight() < $(document).height()) popup.css('margin-top', '-' + popup.outerHeight() / 2 + 'px');
        else popup.css('top', '0px');
        if (popup.outerWidth() < $(document).width()) popup.css('margin-left', '-' + popup.outerWidth() / 2 + 'px');
        else popup.css('left', '0px');

        this.$popupLayout.find('.layer_close').click(function () {
            _this.$mainControl.fadeOut();
            _this.$mainControl.remove();
        });

        this.$popupLayout.find('.pp_cancel_button').click(function () {
            _this.$mainControl.fadeOut();
            _this.$mainControl.remove();
        });

        this.$popupLayout.find('.pp_ok_button').click(function(){
            var isChecked;
            if(hasCheckBox){
                isChecked = $('#chk_savemove').is(':checked');
            }
            callback(isChecked);
            _this.$mainControl.remove();

            _this.studio.popupStatus = 'ok';
        });
    };

    root.Brightics.Installer.PopUp = PopUp;

}).call(this);