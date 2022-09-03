(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BaseSetting($parent, options) {
        this.init();
        this.createContents($parent);
        this.applyPreferenceSettings();
        this.render();
    }

    BaseSetting.prototype.init = function () {
        Brightics.VA.SettingStorage.TEMP = Brightics.VA.SettingStorage.TEMP || {};
        this.controlList = [];

        this.initSettingId();
    };

    BaseSetting.prototype.initPerfectScrollbar = function () {
        this.$mainControl.perfectScrollbar();
    };

    BaseSetting.prototype.initSettingId = function ($parent) {
    };

    BaseSetting.prototype.createContents = function ($parent) {
        this.$mainControl = $('<div class="brtc-va-setting-container"/>');
        $parent.append(this.$mainControl);
    };

    BaseSetting.prototype.getValue = function (key) {
        return typeof Brightics.VA.SettingStorage.TEMP[key] == 'undefined' ? Brightics.VA.SettingStorage.getValue(key) : Brightics.VA.SettingStorage.TEMP[key];
    };

    BaseSetting.prototype.changeValue = function (key, value) {
        Brightics.VA.SettingStorage.TEMP[key] = typeof value === 'object' ? JSON.stringify(value) : ''+value;
    };

    BaseSetting.prototype.render = function () {
    };

    BaseSetting.prototype.save = function () {
        for (var key in Brightics.VA.SettingStorage.TEMP) {
            Brightics.VA.SettingStorage.setValue(key, Brightics.VA.SettingStorage.TEMP[key]);
        }
    };

    BaseSetting.prototype._createCheckBox = function ($target, options) {
        var settingId = options.settingId,
            label = options.label,
            tagList = options.tagList || [];

        var $control = $('' +
            '<div class="brtc-va-setting-component-wrapper">' +
            '   <div class="' + this._parseSettingIdToClassName(settingId) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-checkbox-content"></div>' +
            '       <div class="brtc-va-setting-checkbox-label brtc-style-setting-label brtc-style-flex-1"></div>' +
            '   </div>' +
            '</div>');
        $control.find('.brtc-va-setting-checkbox-label').text(label);
        $control.find('.brtc-va-setting-checkbox-content').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
        });

        $target.append($control);
        if (tagList.length > 0) {
            this._createEditorTagList($target, tagList);
        }

        var _this = this;
        $control.on('change', function (event) {
            var checked = event.args.checked;
            _this.changeValue(settingId, checked);
        });

        this.controlList.push($control);

        return $control;
    };

    BaseSetting.prototype._parseSettingIdToClassName = function (settingId) {
        var prefix = 'brtc-va-setting-';
        if (settingId) {
            return prefix + settingId.replace(/[.]/gi, '-');
        } else {
            return prefix + settingId;
        }
    };

    BaseSetting.prototype._createEditorTagList = function ($target, applyTagList) {
        var _this = this;
        var $tagControl = $('<div class = "brtc-va-setting-editor-label-group"/>');
        $target.append($tagControl);
        Object.keys(Brightics.VA.Core.Interface.Label).forEach(function (editorKey) {
            var applyYn = ($.inArray(editorKey, applyTagList) > -1) ? true : false;
            _this._createEditorTag($tagControl, Brightics.VA.Core.Interface.Label[editorKey], applyYn);
        });
    };

    BaseSetting.prototype._createEditorTag = function ($target, label, applyYn) {
        var $editorTag = $('<button class = "brtc-va-setting-editor-label">' + label + '</button>');
        if (applyYn) {
            $editorTag.addClass('apply');
            $editorTag.jqxButton({
                theme: 'Web'
            });
            $editorTag.css('font-size', '8px');
            $target.append($editorTag);
        }
    };

    BaseSetting.prototype._createSplitBar = function ($target) {
        var $splitBar = $('<div class="brtc-va-setting-splitbar"></div>');
        $target.append($splitBar);
    };

    BaseSetting.prototype._createDropDownList = function ($target, options) {
        var settingId = options.settingId,
            label = options.label,
            list = options.list,
            tagList = options.tagList || [],
            width = options.width || 100,
            dropDownHeight = options.dropDownHeight;

        var $control = $('' +
            '<div class="brtc-va-setting-component-wrapper">' +
            '   <div class="' + this._parseSettingIdToClassName(settingId) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-dropdownlist-label brtc-style-setting-label"/>' +
            '       <div class="brtc-va-setting-dropdownlist-content"></div>' +
            '   </div>' +
            '</div>');

        $target.append($control);
        
        $control.find('.brtc-va-setting-dropdownlist-label').text(label);

        var distance = $target.closest('.brtc-va-dialogs-body').find('.brtc-va-dialogs-buttonbar-ok').offset().top - $control.find('.brtc-va-setting-dropdownlist-content').offset().top - 25;
        distance = distance - distance % 25;
        if(typeof(dropDownHeight) == "undefined") distance = distance || 100;
        else distance = dropDownHeight || 100;
        if(distance > 100) distance = 100;
        
        var dropDownList = $control.find('.brtc-va-setting-dropdownlist-content').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: list,
            width: width,
            dropDownHeight: distance
        });
        
        if (tagList.length > 0) {
            this._createEditorTagList($target, tagList);
        }

        var _this = this;
        $control.on('change', function (event) {
            var value = event.args.item.value;
            _this.changeValue(settingId, value);
        });

        $target.closest('.ps-container').on('scroll', function () {
            if (dropDownList != null) {
                dropDownList.jqxDropDownList('close');
            }
        });

        this.controlList.push($control);

        return $control;
    };

    BaseSetting.prototype._createNumericInput = function (parentId, options) {
        return Brightics.VA.Core.Widget.Factory.numericInputControl(parentId, options);
    };

    BaseSetting.prototype.getSettingId = function (key) {
        return this.SettingId[key];
    };

    BaseSetting.prototype.applySetting = function () {
    };

    BaseSetting.prototype.applyPreferenceSettings = function () {
    };

    Brightics.VA.Setting.BaseSetting = BaseSetting;
    Brightics.VA.Setting.CONST = {
        KEY_DELIMITER: '.'
    };
}).call(this);