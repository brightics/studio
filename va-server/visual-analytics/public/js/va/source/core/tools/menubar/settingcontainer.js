/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SettingContainerDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    SettingContainerDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    SettingContainerDialog.prototype.constructor = SettingContainerDialog;

    SettingContainerDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 500;
        this.dialogOptions.height = 380;
        this.dialogOptions.position = {my: 'right top', at: 'right top+50', of: window};
    };

    SettingContainerDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        var $container = $('' +
            '<div class="brtc-va-tools-menubar-setting-container">' +
            '   <div class="setting-box"/>' +
            '</div>');
        $parent.append($container);

        this._createSettingSection({
            title: 'Management',
            funcTitle: 'Go to Management page',
            clickFunc: function () {
                var w = window.open("ng1123/user", "Brightics Management");
                w.blur();
            }
        });

        this._createSettingSection({
            title: Brightics.locale.common.preferences,
            funcTitle: Brightics.locale.sentence.S0005,
            clickFunc: function () {
                new Brightics.VA.Core.Dialogs.SettingDialog(_this.$parent, {
                    title: Brightics.locale.common.preferences
                });
            }
        });

        this._createSettingSection({
            title: 'Readme',
            funcTitle: 'About Brightics',
            clickFunc: function () {
                var w = window.open("readme", "Brightics Visual Analytics");
                w.blur();
            }
        });

    };

    SettingContainerDialog.prototype._createSettingSection = function (options) {
        var $section = $('' +
            '       <div class="section">' +
            '           <p class="section-title"></p>' +
            '           <div class="function">' +
            '               <p class="func-title"></p>' +
            '               <div class="brtc-va-tools-menubar-setting-container-link">' + Brightics.locale.common.go + '</div>' +
            '           </div>' +
            '       </div>' +
            '');

        this.$mainControl.find('.setting-box').append($section);
        $section.find('.section-title').text(options.title);
        $section.find('.func-title').text(options.funcTitle);

        // var adminPageLink = this.$mainControl.find('.section.management');
        var linkButton = $section.find('.brtc-va-tools-menubar-setting-container-link');
        linkButton.jqxButton({theme: Brightics.VA.Env.Theme});
        linkButton.on('click', options.clickFunc);
    };

    SettingContainerDialog.prototype.createDialogButtonBar = function () {

    };

    Brightics.VA.Core.Tools.MenuBar.SettingContainerDialog = SettingContainerDialog;

}).call(this);
