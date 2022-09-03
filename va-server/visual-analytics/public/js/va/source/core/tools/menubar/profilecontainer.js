/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ProfileContainer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.setDefaultSetting();
    }

    ProfileContainer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ProfileContainer.prototype.setDefaultSetting = function () {
        if (!this.options) {
            this.options = {};
            this.options.id = Studio.getSession().userId;
            this.options.name = '';
            this.options.email = '';
        }
    };

    ProfileContainer.prototype.render = function () {
        this.createControls();
        this.bindCloseHandler();
    };

    ProfileContainer.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-tools-menubar-myprofile-detail-container">' +
            '   <div class="profile-close-button"></div>' +
            '   <div class="profile-datail-picture-area">' +
            '       <div class="profile-datail-picture"></div>' +
            '   </div>' +
            '   <div class="profile-datail-info-area">' +
            '       <div class="profile-datail-info-text-area">' +
            '           <span class="profile-datail-name" title="' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.name) + '">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.name) + '</span>' +
            '           <span>(</span><span class="profile-datail-id" title="' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.id) + '">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.id) + '</span><span>)</span>' +
            '           <span class="profile-datail-email" title="' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.email) + '">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.email) + '</span></div>' +
            '       <div class="profile-datail-info-setting-area">' +
            '           <span class="profile-datail-info-settings">Profile Settings</span>' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$mainControl.find('.profile-datail-info-settings').click(function (event) {
            event.stopPropagation();
		    window.open('profile');
            $(window).click();
        });
    };

    ProfileContainer.prototype.bindCloseHandler = function () {
        this.$mainControl.click(function (event) {
            event.stopPropagation();
        });

        $(window).on('click', closeProfileDetail);

        this.$mainControl.find('.profile-close-button').click(function () {
            $('.brtc-va-tools-menubar-myprofile-detail-container').remove();
            $(window).off('click', closeProfileDetail);
        });

        function closeProfileDetail() {
            $('.profile-close-button').click();
        }
    };

    ProfileContainer.prototype.getOptions = function () {
        return this.options;
    };

    Brightics.VA.Core.Tools.MenuBar.ProfileContainer = ProfileContainer;

}).call(this);
