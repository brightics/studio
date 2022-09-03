/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function MenuBar(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};
        this.retrieveParent();
        this.createControls();
    }

    MenuBar.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    MenuBar.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-tools-menubar">' +
            '   <div class="brtc-va-tools-menubar-left-area">' +
            '       <div class="brtc-va-tools-menubar-logo"></div>' +
            '   </div>' +
            '   <div class="brtc-va-tools-menubar-center-area"></div>' +
            '   <div class="brtc-va-tools-menubar-right-area">' +
            '       <div class="brtc-va-tools-menubar-doc" title="Documentation">' +
            '           <i class="fa fa-file-text-o"></i>' +
            '       </div>' +
            '       <div class="brtc-va-tools-menubar-notice" title="Notice">' +
            '           <div class="brtc-va-tools-menubar-notice-default"></div>' +
            '           <div class="brtc-va-tools-menubar-notice-new"></div>' +
            '       </div>' +
            '       <div class="brtc-va-tools-menubar-language" title="Language"></div>' +
            '       <div class="brtc-va-tools-menubar-setting" title="Settings"></div>' +
            '       <div class="brtc-va-tools-menubar-myprofile" title="Profile"></div>' +
            '       <div class="brtc-va-tools-menubar-logout" title="Logout">Logout</div>' +
            '   </div>' +
            '</div>');

        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.createLogoButton();
        this.createEditorHeader();
        this.createSideBarButton();
        this.createLanguageButton();
        this.createManagementButton();
        this.createMyProfileButton();
        this.createLogoutButton();
        this.createHelpButton();
        this.createNoticeButton();

        this.invisibleMenuForPermissions();
    };

    MenuBar.prototype.createLogoButton = function () {
        var _this = this;
        this.$mainControl.find('.brtc-va-tools-menubar-logo').on('click', function () {
            Studio.getLayoutManager().showProjectViewer();
        });
    };

    MenuBar.prototype.createEditorHeader = function () {
        var editorTabArea = this.$mainControl.find('.brtc-va-tools-menubar-center-area');
        this.editorTab = new Brightics.VA.Core.Views.EditorTab(editorTabArea);
    };

    MenuBar.prototype._getEditorInput = function (projectId, fileId) {
        return Studio.getResourceManager().getFile(projectId, fileId);
    };

    MenuBar.prototype.createSideBarButton = function () {
        var _this = this;
        this.$mainControl.find('.brtc-va-tools-menubar-sidebar').click(function () {
            $(this).toggleClass('brtc-va-tools-menubar-toggle-on');
            var show = $(this).hasClass('brtc-va-tools-menubar-toggle-on');
            _this.$mainControl.trigger('showSideBar', [show]);
        });
    };

    MenuBar.prototype.createManagementButton = function () {
        var _this = this;
        this.$mainControl.find('.brtc-va-tools-menubar-setting').click(function (event) {
            new Brightics.VA.Core.Tools.MenuBar.SettingContainerDialog(_this.$mainControl, {
                title: Brightics.locale.common.settings,
                close: function (result) {
                }
            });
        });

    };

    MenuBar.prototype.createLanguageButton = function () {
        const $control = this.$mainControl.find('.brtc-va-tools-menubar-language');
        const currentLang = Brightics.VA.SettingStorage.getCurrentLanguage();

        const $menu = $(
         `<div class="brtc-va-tools-menubar-language-items">
             <ul>
                <li selected="${currentLang === 'ko'}" lang="ko">한국어</li>
                <li selected="${currentLang === 'en'}" lang="en">English</li>
             </ul>
          </div>`);

        $control.append($menu);

        const $ctxMenu = $menu.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '70px',
            height: '20px',
            autoOpenPopup: false,
            popupZIndex: 50000,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });



        $ctxMenu.on('itemclick', function (event) {
            const $el = $(event.args);
            const lang = $el.attr('lang');

            const closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    $(window).unbind('beforeunload');
                    Brightics.VA.SettingStorage.setLanguage(lang);
                    window.location.href = window.location.href;
                }
            };
            if(lang !== currentLang) {
                Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(Brightics.locale.sentence.S0006, closeHandler);
            }
        });

        $control.click((event) => {
            const left = $(event.target).offset().left - 9;
            const top = $(event.target).offset().top + $(event.target).height() - 4;
            $ctxMenu.jqxMenu('open', left, top);
        });
    };

    MenuBar.prototype.createMyProfileButton = function () {
        var _this = this;

        this.$mainControl.find('.brtc-va-tools-menubar-myprofile').click(function (event) {
            event.stopPropagation();
            var $profileContainer = $('.brtc-va-tools-menubar-myprofile-detail-container');
            if ($profileContainer.length) {
                $(window).click();
            }
            else {
                $(window).click();
                $.ajax({
                    type: 'GET',
                    url: 'api/va/v2/users/my',
                    contentType: 'application/json; charset=utf-8',
                    blocking: true,
                    success: function (response) {
                        var options = {};
                        options.id = response[0].id;
                        options.name = response[0].name;
                        options.email = response[0].email;

                        var profileContainer = new Brightics.VA.Core.Tools.MenuBar.ProfileContainer(_this.$mainControl, options);
                        profileContainer.render();
                    }
                });
            }
        });
    };

    MenuBar.prototype.createLogoutButton = function () {
        var _this = this;
        this.$mainControl.find('.brtc-va-tools-menubar-logout').click(function () {
            var closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    $(window).unbind('beforeunload');
                    Brightics.VA.Core.GarbageCollector.clearAlluxio();
                    window.location.href = 'auth/' + Brightics.VA.Env.Session.userId + '/logout';

                    if (sessionStorage) sessionStorage.clear();
                }
            };
            var options = {
                contentText: 'Are you sure you want to logout?',
                close: closeHandler,
                isCancel: true
            };
            Brightics.VA.Core.Utils.WidgetUtils.createCommonConfirmDialog(_this.$mainControl, options);
        })
    };

    MenuBar.prototype.createHelpButton = function () {
        var $helpIcon = this.$mainControl.find('.brtc-va-tools-menubar-doc');
        $helpIcon.click(function (event) {
            Brightics.VA.Core.Utils.ModelUtils.openDocumentationPopup();
        });
    };

    MenuBar.prototype.createNoticeButton = function () {
        var _this = this;

        var option = {
            url: 'api/admin/v2/notices',
            type: 'GET',
            blocking: false,
            contentType: 'application/json; charset=utf-8'
        };
        $.ajax(option).done(function (noticeData) {
            var $newIcon = $('.brtc-va-tools-menubar-notice-new');

            for (var i in noticeData) {
                if (Brightics.VA.Core.Utils.CommonUtils.getTimeDifferenceFromNow(noticeData[i].update_time) < 24) {
                    $newIcon.show();
                }
                break;
            }
            _this.$mainControl.find('.brtc-va-tools-menubar-notice').click(function (event) {
                new Brightics.VA.Core.Tools.MenuBar.NoticeContainerDialog(_this.$mainControl, {
                    data: noticeData,
                    title: 'Notice',
                    close: function (result) {
                        $(this).dialog('destroy');
                        $(this).remove();
                    }
                });
            });
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    MenuBar.prototype.invisibleMenuForPermissions = function () {
        var visibleLogout = true, visibleProfile = true, visibleSetting = true;

        for (var i in Brightics.VA.Env.Session.permissions) {
            if (Brightics.VA.Env.Session.permissions[i].permission_id === 'perm_invisible_logout') {
                visibleLogout = false;
            } else if (Brightics.VA.Env.Session.permissions[i].permission_id === 'perm_invisible_profile_setting') {
                visibleProfile = false;
            } else if (Brightics.VA.Env.Session.permissions[i].permission_id === 'perm_invisible_setting') {
                visibleSetting = false;
            }
        }
        visibleProfile ? this.$mainControl.find('.brtc-va-tools-menubar-myprofile').show() : this.$mainControl.find('.brtc-va-tools-menubar-myprofile').hide();
        visibleLogout ? this.$mainControl.find('.brtc-va-tools-menubar-logout').show() : this.$mainControl.find('.brtc-va-tools-menubar-logout').hide();
        visibleSetting ? this.$mainControl.find('.brtc-va-tools-menubar-setting').show() : this.$mainControl.find('.brtc-va-tools-menubar-setting').hide();
    };

    Brightics.VA.Core.Tools.MenuBar = MenuBar;

}).call(this);
