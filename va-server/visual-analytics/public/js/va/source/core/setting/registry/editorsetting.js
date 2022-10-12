(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EditorSetting(parentId, options) {
        Brightics.VA.Setting.BaseSetting.call(this, parentId, options);
    }

    EditorSetting.prototype = Object.create(Brightics.VA.Setting.BaseSetting.prototype);
    EditorSetting.prototype.constructor = EditorSetting;

    EditorSetting.prototype.initSettingId = function ($parent) {
        this.SettingId = {
            autoConnect: 'editor.diagram.autoconnect',
            minimap: 'editor.minimap.visible',
            doubleClick: 'editor.function.add.doubleclick',
            variable: 'editor.variable.visible',
            dataCount: 'editor.datapanel.defaultrowcount',
            useMaximum: 'editor.useMaximum',
            maxFuncNum: 'editor.maxfuncnum',
            closePanelOnClick: 'editor.closePanelOnClick'
        }
    };

    EditorSetting.prototype.createContents = function ($parent) {
        Brightics.VA.Setting.BaseSetting.prototype.createContents.call(this, $parent);

        this.createAutoConnectControl();
        this.createMinimapControl();
        this.createDoubleClickControl();
        this.createVariableControl();
        this.createDataCountControl();
        this.createMaxFuncControl();
        this.createClosePanelControl();
    };

    EditorSetting.prototype.createAutoConnectControl = function ($parent) {
        var _this = this;

        this.$autoConnectControl = this._createCheckBox(this.$mainControl, {
            settingId: _this.getSettingId('autoConnect'),
            label: Brightics.locale.sentence.S0011,
            // tagList: ['data', 'deeplearning']
            tagList: ['data']
        });
    };

    EditorSetting.prototype.createMinimapControl = function ($parent) {
        var _this = this;

        this.$minimapControl = this._createCheckBox(this.$mainControl, {
            settingId: _this.getSettingId('minimap'),
            label: Brightics.locale.sentence.S0012,
            tagList: ['data', 'realtime', 'deeplearning']
        });
    };

    EditorSetting.prototype.createDoubleClickControl = function ($parent) {
        var _this = this;

        // this.$doubleClickControl = this._createCheckBox(this.$mainControl, {
        //     settingId: _this.getSettingId('doubleClick'),
        //     label: "Use double click to add function on editor.",
        //     tagList: ['data', 'realtime', 'deeplearning']
        // });
        this.$doubleClickControl = $(crel('div', {
            class: 'brtc-va-setting-component-wrapper'
        }, Brightics.locale.sentence.S0013));
        this.$mainControl.append(this.$doubleClickControl);

        var $radioDoubleClick = $(crel('div', {
            class: 'brtc-va-editors-sheet-controls-radiobutton-default doubleclick',
            style: 'margin-left: 10px'
        }, Brightics.locale.sentence.S0014));
        this.$doubleClickControl.append($radioDoubleClick);
        $radioDoubleClick.jqxRadioButton({theme: Brightics.VA.Env.Theme});

        var $radioClick = $(crel('div', {
            class: 'brtc-va-editors-sheet-controls-radiobutton-default click',
            style: 'margin-left: 10px'
        }, Brightics.locale.sentence.S0015));
        this.$doubleClickControl.append($radioClick);
        $radioClick.jqxRadioButton({theme: Brightics.VA.Env.Theme});

        this._createEditorTagList(this.$doubleClickControl, ['data', 'realtime', 'deeplearning']);

        $radioDoubleClick.on('change', function (event) {
            var checked = event.args.checked;
            _this.changeValue(_this.getSettingId('doubleClick'), checked);
        });
    };

    EditorSetting.prototype.createVariableControl = function ($parent) {
        var _this = this;

        this.$variableControl = this._createCheckBox(this.$mainControl, {
            settingId: _this.getSettingId('variable'),
            label: Brightics.locale.sentence.S0016,
            tagList: ['data', 'control', 'realtime']
        });
    };

    EditorSetting.prototype.createDataCountControl = function ($parent) {
        var _this = this;

        this.$dataCountControl = this._createDropDownList(this.$mainControl, {
            settingId: _this.getSettingId('dataCount'),
            label: Brightics.locale.sentence.S0017,
            width: 100,
            list: ['1000', '3000', '5000', '10000', '50000'],
            tagList: ['data', 'realtime'],
            dropDownHeight: 100
        });
    };

    EditorSetting.prototype.createMaxFuncControl = function ($parent) {
        var _this = this;

        var $controlWrapper = $('' +
            '<div class="brtc-va-setting-component-wrapper">' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('useMaximum')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-checkbox-content useMaximum"></div>' +
            '       <div class="brtc-va-setting-checkbox-label brtc-style-setting-label brtc-style-flex-1">'+Brightics.locale.sentence.S0018+'</div>' +
            '   </div>' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('maxFuncNum')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center" style="margin-left:  30px;">' +
            '       <div class="brtc-va-setting-input-content-label" style="width: 100px">'+Brightics.locale.common.decimalPlace+'</div>' +
            '       <div class="brtc-va-setting-input-content number"></div>' +
            '   </div>' +
            '</div>');

        this.$mainControl.append($controlWrapper);

        this.$useControl = $controlWrapper.find('.brtc-va-setting-checkbox-content.useMaximum');
        this.$useControl.jqxCheckBox({
            theme: Brightics.VA.Env.Theme
        });

        var $numberControl = $controlWrapper.find('.brtc-va-setting-input-content.number');
        this.numberControl = this._createNumericInput($numberControl, {
            numberType: 'int',
            min: 1,
            max: 120,
            minus: false,
            placeholder: '120'
        });

        this.$useControl.on('change', function (event) {
            var checked = event.args.checked;

            if (checked) {
                _this.numberControl.setDisabled(false);
            } else {
                _this.numberControl.$mainControl.val('120');
                _this.numberControl.setDisabled(!checked);
                _this.changeValue(_this.getSettingId('maxFuncNum'), 120);
            }
            _this.changeValue(_this.getSettingId('useMaximum'), checked);

        });

        this.numberControl.onChange(function () {
            var digitValue = _this.numberControl.getValue();
            _this.changeValue(_this.getSettingId('maxFuncNum'), digitValue);
        });

        this._createEditorTagList(this.$mainControl, ['data']);

        this.controlList.push($controlWrapper);
    };

    EditorSetting.prototype.createClosePanelControl = function ($parent) {
        var _this = this;

        this.$closePanelControl = this._createCheckBox(this.$mainControl, {
            settingId: _this.getSettingId('closePanelOnClick'),
            label: Brightics.locale.sentence.S0019,
            tagList: ['data']
        });
    };

    EditorSetting.prototype.render = function () {
        this.renderAutoConnectControl();
        this.renderMinimapControl();
        this.renderDoubleClickControl();
        this.renderVariableControl();
        this.renderDataCountControl();
        this.renderMaxFuncControl();
        this.renderClosePanelControl();
    };

    EditorSetting.prototype.renderAutoConnectControl = function () {
        var _this = this;

        this.$autoConnectControl.find('.brtc-va-setting-checkbox-content').jqxCheckBox({
            checked: _this.getValue(_this.getSettingId('autoConnect')) == 'true'
        });
    };

    EditorSetting.prototype.renderMinimapControl = function () {
        var _this = this;

        this.$minimapControl.find('.brtc-va-setting-checkbox-content').jqxCheckBox({
            checked: _this.getValue(_this.getSettingId('minimap')) == 'true'
        });
    };

    EditorSetting.prototype.renderDoubleClickControl = function () {
        var _this = this;

        // this.$doubleClickControl.find('.brtc-va-setting-checkbox-content').jqxCheckBox({
        //     checked: _this.getValue(_this.getSettingId('doubleClick')) == 'true'
        // });
        var value = this.getValue(this.getSettingId('doubleClick'));
        this.$doubleClickControl.find('.brtc-va-editors-sheet-controls-radiobutton-default.click').jqxRadioButton({
            checked: value == 'false'
        });
        this.$doubleClickControl.find('.brtc-va-editors-sheet-controls-radiobutton-default.doubleclick').jqxRadioButton({
            checked: value == 'true'
        });
    };

    EditorSetting.prototype.renderVariableControl = function () {
        var _this = this;

        this.$variableControl.find('.brtc-va-setting-checkbox-content').jqxCheckBox({
            checked: _this.getValue(_this.getSettingId('variable')) == 'true'
        });
    };

    EditorSetting.prototype.renderDataCountControl = function () {
        var _this = this;

        this.$dataCountControl.find('.brtc-va-setting-dropdownlist-content').jqxDropDownList('selectItem', _this.getValue(_this.getSettingId('dataCount')));
    };

    EditorSetting.prototype.renderMaxFuncControl = function () {
        this.renderNumberControl();
        this.renderUseControl();
    };

    EditorSetting.prototype.renderNumberControl = function () {
        var _this = this;

        this.numberControl.setValue(_this.getValue(_this.getSettingId('maxFuncNum')));
        // this.numberControl.focus();
    };

    EditorSetting.prototype.renderUseControl = function () {
        var _this = this;

        this.$useControl.jqxCheckBox({checked: _this.getValue(_this.getSettingId('useMaximum')) == 'true'});

        if (_this.getValue(_this.getSettingId('useMaximum')) != 'true') {
            _this.numberControl.setDisabled(true);
        }
    };

    EditorSetting.prototype.renderClosePanelControl = function () {
        var _this = this;

        this.$closePanelControl.find('.brtc-va-setting-checkbox-content').jqxCheckBox({
            checked: _this.getValue(_this.getSettingId('closePanelOnClick')) == 'true'
        });
    };

    EditorSetting.prototype.getIndex = function () {
        return 2;
    };

    EditorSetting.prototype.applyPreferenceSettings = function () {
        // if( $('body').hasClass('scroll-always')){
        //     this.$mainControl.closest('.brtc-va-dialogs-content-panel').perfectScrollbar('update');
        // }
        this.$mainControl.closest('.brtc-va-dialogs-content-panel').perfectScrollbar('update');
    };

    EditorSetting.Key = 'setting-editor';
    EditorSetting.Label = Brightics.locale.common.editor;
    EditorSetting.index = 2;

    Brightics.VA.Setting.Registry[EditorSetting.Key] = EditorSetting;

}).call(this);
