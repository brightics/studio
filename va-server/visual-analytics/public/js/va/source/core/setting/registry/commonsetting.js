/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CommonSetting(parentId, options) {
        Brightics.VA.Setting.BaseSetting.call(this, parentId, options);
    }

    CommonSetting.prototype = Object.create(Brightics.VA.Setting.BaseSetting.prototype);
    CommonSetting.prototype.constructor = CommonSetting;

    CommonSetting.prototype.initSettingId = function ($parent) {
        this.SettingId = {
            scrollBar: 'common.scroll.indicate.mouseover',
            useOnline: 'common.document.useonline',
            url: 'common.document.onlinedocurl',
            urlDefault: 'common.document.onlinedocurl.default'
        }
    };

    CommonSetting.prototype.createContents = function ($parent) {
        Brightics.VA.Setting.BaseSetting.prototype.createContents.call(this, $parent);

        this.createScrollbarControl();
        this.createDocumentControl();
    };

    CommonSetting.prototype.createScrollbarControl = function () {
        this.$scrollbarControl = this._createCheckBox(this.$mainControl, {
            settingId: this.getSettingId('scrollBar'),
            label: 'Show scroll bar only when the mouse is over on scrollable area. (Show always when unchecked)'
        });
    };

    CommonSetting.prototype.createDocumentControl = function () {
        var _this = this;

        var $controlWrapper = $('' +
            '<div class="brtc-va-setting-component-wrapper">' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('useOnline')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-checkbox-content use"></div>' +
            '       <div class="brtc-va-setting-checkbox-label brtc-style-setting-label brtc-style-flex-1">Use on-line help document (※ The prefix "http://" is required.)</div>' +
            '   </div>' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('url')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-input-content-label">URL</div>' +
            '       <input class="brtc-va-setting-input-content link" type="text">' +
            '   </div>' +
            '   <div class="brtc-va-setting-input-content-validation-tooltip-wrapper">' +
            // '       <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
            '       <div class="brtc-va-setting-input-content-validation-tooltip">' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$mainControl.append($controlWrapper);

        this.$useControl = $controlWrapper.find('.brtc-va-setting-checkbox-content.use');
        this.$useControl.jqxCheckBox({
            theme: Brightics.VA.Env.Theme
        });

        this.$linkControl = $controlWrapper.find('.brtc-va-setting-input-content.link').jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: _this.getValue(_this.getSettingId('urlDefault')),
            height: 25,
            width: '100%'
        });

        this.$useControl.on('change', function (event) {
            var checked = event.args.checked;

            if (checked) {
                _this.$linkControl.jqxInput({disabled:false});
            } else {
                _this.$linkControl.jqxInput({disabled:true});
            }

            _this.changeValue(_this.getSettingId('useOnline'), checked);
            _this.renderMessage(_this.validateUrl(_this.getValue(_this.getSettingId('url'))));
        });

        this.$linkControl.on('change', function () {
            var value = $(this).val();

            _this.changeValue(_this.getSettingId('url'), value);
            _this.renderMessage(_this.validateUrl(value));
        });

        this.$validationWrapper =
            $controlWrapper.find('.brtc-va-setting-input-content-validation-tooltip-wrapper');
        this.$validation =
            $controlWrapper.find('.brtc-va-setting-input-content-validation-tooltip');
    };

    CommonSetting.prototype.render = function () {
        this.renderScrollbarControl();
        this.renderDocumentControl();
    };

    CommonSetting.prototype.renderScrollbarControl = function () {
        var _this = this;

        this.$scrollbarControl.find('.brtc-va-setting-checkbox-content').jqxCheckBox({
            checked: _this.getValue(_this.getSettingId('scrollBar')) == 'true'
        });
    };

    CommonSetting.prototype.renderDocumentControl = function () {
        var _this = this;

        this.$useControl.jqxCheckBox({checked: _this.getValue(_this.getSettingId('useOnline')) == 'true'});

        if (_this.getValue(_this.getSettingId('useOnline')) != 'true') {
            _this.$linkControl.jqxInput({'disabled': true});
        }

        this.$linkControl.val(_this.getValue(_this.getSettingId('url')));
    };

    CommonSetting.prototype.getIndex = function () {
        return 1;
    };

    CommonSetting.prototype.validateUrl = function () {
        var useOnline = this.getValue(this.getSettingId('useOnline')) === 'true';
        var url = this.getValue(this.getSettingId('url'));
        var defaultUrl = this.getValue(this.getSettingId('urlDefault'));
        if (useOnline) {
            if (!url && defaultUrl) {
                return '';
            }
            if (!url && !defaultUrl) {
                return 'URL is not specified.';
            }
            if (!_.startsWith(url, 'http://')) {
                return 'URL must start with \'http://\'.';
            }
        }
        return '';
    };

    CommonSetting.prototype.renderMessage = function (msg) {
        if (msg === '' || this.getValue(this.getSettingId('useOnline')) !== 'true') {
            this.$validationWrapper.hide();
        } else {
            this.$validationWrapper.show();
            this.$validation.html(msg);
        }
    };

    CommonSetting.Key = 'setting-common';
    CommonSetting.Label = 'Common';
    CommonSetting.index = 1;

    Brightics.VA.Setting.Registry[CommonSetting.Key] = CommonSetting;

}).call(this);