/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function BasePanel(parentId, options) {
        this.parentId = parentId;
        this.panelId = _.uniqueId();
        this.options = options;
        this.FnUnitUtils = brtc_require('FnUnitUtils');
        this.retrieveParent();

        this.registerProblemListener();
        this.registerCommandListener();

        this.createControls();
        this.configureOptions();

        this.init();
    }

    BasePanel.prototype.init = function () {
        this.$mainControl.attr('type', this.options.type);
    };

    BasePanel.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
        if(!this.options.modelEditor){
            this.options.modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$parent);
        }
    };

    BasePanel.prototype.registerScrollListener = function () {
    };

    BasePanel.prototype.registerProblemListener = function () {
    };

    BasePanel.prototype.registerCommandListener = function () {
    };

    BasePanel.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('<div class="brtc-va-editors-sheet-panels-basepanel"/>');
        this.$parent.append(this.$mainControl);

        this.createTopArea();
        this.createContentsArea();
        this.createBottomArea();

        if (this.$topArea) {
            this.createTopAreaControls(this.$topArea);
        }
        if (this.$bottomArea) {
            this.createBottomAreaControls(this.$bottomArea);
        }
        if (this.$contentsArea) {
            this.createContentsAreaControls(this.$contentsArea);
            if (this.$contentsArea.hasClass('brtc-va-editors-sheet-panels-propertiespanel-contents-area')) {
                this.$contentsArea.perfectScrollbar();
            }
        }

        var $persistButton = this.$topArea.find('.brtc-va-editors-sheet-panels-basepanel-header-tooltip');
        $persistButton.click(function () {
            if ($persistButton.attr('persist-mode') === 'auto') {
                $persistButton.attr('persist-mode', 'true');
                _this.options.fnUnit["persist-mode"] = 'true';
            } else if ($persistButton.attr('persist-mode') === 'true') {
                $persistButton.attr('persist-mode', 'false');
                _this.options.fnUnit["persist-mode"] = 'false';
            } else {
                $persistButton.attr('persist-mode', 'auto');
                _this.options.fnUnit["persist-mode"] = 'auto';
            }
            var properties = {
                'persist-mode': _this.options.fnUnit["persist-mode"]
            };
            var command = _this.createSetFnUnitCommand(properties);
            _this.executeCommand(command);
        });

    };

    BasePanel.prototype.destroy = function () {
        // abstract
    };

    BasePanel.prototype.createTopAreaHeaderTitle = function ($parent) {
        var _this = this;

        this.$header = $('' +
            '<div class="brtc-va-editors-sheet-panels-basepanel-header brtc-va-editors-sheet-panels-datapanel-header">' +
            '   <div class="brtc-va-editors-sheet-worksheet-selector"></div>' +
            '   <div class="brtc-va-editors-sheet-panels-basepanel-header-container">' +
            '       <div class="brtc-va-editors-sheet-panels-basepanel-header-title" />' +
            '   </div>' +
            '</div>');

        var $title = this.$header.find('.brtc-va-editors-sheet-panels-basepanel-header-title');
        $title.attr('title', this.options.title);

        $parent.append(this.$header);
    };

    BasePanel.prototype.createMinMaxToolItem = function ($toolbar) {
        var _this = this;

        this.$minMaxButton = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-maximize" title="' + Brightics.locale.panel.maxMin + '"></div>');
        this.$minMaxButton.attr('maximize', 'false');
        $toolbar.append(this.$minMaxButton);

        var $inDataPanel = this.$parent.closest('.brtc-va-editors-sheet-fnunitviewer').find('.brtc-va-editors-sheet-fnunitviewer-indata-fncenter'),
            $outDataPanel = this.$parent.closest('.brtc-va-editors-sheet-fnunitviewer').find('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter');

        if (_this.options.panelType === 'in' && $outDataPanel.css('display') === 'none') {
            this.adjustMaximize(true);
        } else if (_this.options.panelType === 'out' && $inDataPanel.css('display') === 'none') {
            this.adjustMaximize(true);
        }

        this.$minMaxButton.on('click', function (event) {
            if ($(this).attr('maximize') === 'true') {
                _this.adjustMaximize(false);
            } else {
                _this.adjustMaximize(true);
            }

            _this.$parent.trigger('sizeChange', [_this.options.panelType]);
        });
        this.$minMaxButton.css('display', this.options.resizable ? 'block' : 'none');
    };

    BasePanel.prototype.adjustMaximize = function (isMaximize) {
        if (isMaximize) {
            this.$minMaxButton.removeClass('brtc-va-editors-sheet-panels-datapanel-toolitem-maximize').addClass('brtc-va-editors-sheet-panels-datapanel-toolitem-minimize').attr('maximize', 'true');
        } else {
            this.$minMaxButton.removeClass('brtc-va-editors-sheet-panels-datapanel-toolitem-minimize').addClass('brtc-va-editors-sheet-panels-datapanel-toolitem-maximize').attr('maximize', 'false');
        }
    };

    BasePanel.prototype.adjustHeader = function () {
    };

    BasePanel.prototype.createTopArea = function () {
        this.$topArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-top-area"></div>');
        this.$mainControl.append(this.$topArea);
    };

    BasePanel.prototype.createContentsArea = function () {
        this.$contentsArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-contents-area" ></div>');
        this.$mainControl.append(this.$contentsArea);
    };

    BasePanel.prototype.createBottomArea = function () {
        this.$bottomArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-bottom-area"></div>');
        this.$mainControl.append(this.$bottomArea);
    };

    BasePanel.prototype.createTopAreaControls = function ($parent) {
        var $header = $('' +
            '<div class="brtc-va-editors-sheet-panels-basepanel-header">' +
            '   <div class="brtc-va-editors-sheet-panels-basepanel-header-tooltip" item-type="persist" persist-mode="auto"><i title="Persist" class="fa fa-hdd-o" style="font-size: 1.5em;" aria-hidden="true"></i></div>' +
            '   <div class="brtc-va-editors-sheet-panels-basepanel-header-title"></div>' +
            '</div>' +
            '');

        $header.find('.brtc-va-editors-sheet-panels-basepanel-header-title').text(this.options.title);
        $parent.append($header);
        return $header;
    };

    BasePanel.prototype.createContentsAreaControls = function ($parent) {
    };

    BasePanel.prototype.createBottomAreaControls = function ($parent) {
    };

    BasePanel.prototype.configureOptions = function () {
    };

    BasePanel.prototype.configureRunnable = function () {
    };

    BasePanel.prototype.hideCallFunctionButton = function () {
    };

    BasePanel.prototype.setInOutData = function () {
    };

    BasePanel.prototype.hideTopArea = function () {
        this.$topArea.hide();
    };

    BasePanel.prototype.hideBottomArea = function () {
        this.$bottomArea.hide();
    };

    BasePanel.prototype.renderFail = function ($parent, message) {
        var $fail = $('<div class="brtc-va-editors-sheet-panels-basepanel-fail"><h3></h3></div>');
        $parent.append($fail);

        $fail.addClass('brtc-style-full').addClass('brtc-style-flex-center');
        $fail.find('h3').text(message);
    };

    Brightics.VA.Core.Editors.Sheet.Panels.BasePanel = BasePanel;

}).call(this);
