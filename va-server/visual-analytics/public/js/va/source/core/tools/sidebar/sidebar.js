/**
 * Created by SDS on 2016-09-05.
 */

/* global crel */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SideBar(parentId, options) {
        this.options = options;
        this.parentId = parentId;
        this.FnUnitUtils = brtc_require('FnUnitUtils');
        
        _retrieveParent.bind(this)();

        this.init();
        this.createControls();
        this.createExpander();
        // this.createDescription();
        this.initPreferenceTarget();
        this.configureSize();
    }

    var _retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SideBar.prototype.init = function () {
        this.preferenceTarget = {
            scroll: {}
        };

        this.configureSize();
    };

    SideBar.prototype.createControls = function () {
        this.createHeader();
        this.createContent();
    };

    SideBar.prototype.createExpander = function () {
        var _this = this;

        this.$expandButton = $('<div class="brtc-va-studio-sidebar-expand"></div>');
        this.$expandButton.addClass(this.options.position);

        var label = this.options['description-label'] || this.options.label;
        this.$descriptionButton = $('<div class="brtc-va-studio-sidebar-description">' + label + '</div>');
        this.$descriptionButton.addClass(this.options.position);

        var $temp = $('<div class="brtc-va-studio-sidebar-expander"></div>');
        // $temp.append(this.$expandButton);
        $temp.append(this.$descriptionButton);

        this.options.$tabBarWrapper.append($temp);
        $temp.click(function (event) {
            if (_this.options.visible) _this.hide();
            else _this.show();

            if ($('body').hasClass('scroll-always')) {
                _this.$parent.find('.brtc-va-studio-sidebar-area').find('.ps-container').perfectScrollbar('update');
            }
        });

        if (this.options.visible) this.show();
    };

    SideBar.prototype.createDescription = function () {
        // var _this = this;
        //
        // var label = this.options['description-label'] || this.options.label;
        // this.$descriptionButton = $('<div class="brtc-va-studio-sidebar-description">' + label + '</div>');
        // this.$descriptionButton.addClass(this.options.position);
        // this.options.$tabBarWrapper.append(this.$descriptionButton);
        // this.$descriptionButton.click(function (event) {
        //     _this.show();
        // });
    };

    SideBar.prototype.expandStatusChanged = function (isExpanded) {
        this.refreshCodeMirrorControl();
    };

    SideBar.prototype.refreshCodeMirrorControl = function () {
        this.$parent.find('.CodeMirror').each(function (i, $el) {
            $el.CodeMirror.refresh();
        });
    };

    SideBar.prototype.selectionChanged = function (selection) {
    };

    SideBar.prototype.destroy = function (editor) {
    };

    SideBar.prototype.hide = function () {
        this.options.visible = false;
        this.$parent.find('.brtc-va-studio-sidebar-area').hide();
        // this.$expandButton.show();
        this.$descriptionButton.css('background-color', '#FFFFFF');
        this.$descriptionButton.css('color', '#4C4C4C');
        this.$descriptionButton.parent().css('outline', '1px solid #dbdde2');
        // this.$descriptionButton.css('width', '140px');
        this.expandStatusChanged(false);
    };

    SideBar.prototype.show = function () {
        this.options.visible = true;
        this.$parent.find('.brtc-va-studio-sidebar-area').show();
        // this.$expandButton.hide();
        this.$descriptionButton.css('background-color', '#4B505E');
        this.$descriptionButton.css('color', '#FFFFFF');
        this.$descriptionButton.parent().css('outline', '1px solid rgb(75, 80, 94)');
        // this.$descriptionButton.css('width', '178px');
        this.expandStatusChanged(true);
    };

    SideBar.prototype.expandStatusChanged = function (isExpand) {
        this.applyPreferenceSettings(isExpand);
        this.fireExpandStatusChanged(isExpand);
        this.resizeAceEditors();
        this.refreshCodeMirrorControl();
        $(window).trigger('resize'); // 일부 jqWidget 레이아웃 깨짐 방지
        this.refreshjqxTabs();
        this.refreshTabs();
    };

    SideBar.prototype.applyPreferenceSettings = function (isExpand) {
        this.applyScrollSetting(isExpand);
    };

    SideBar.prototype.fireExpandStatusChanged = function (isExpand) {
        this.options.manager.fireExpandStatusChanged(this.options.id, isExpand);
    };

    SideBar.prototype.applyScrollSetting = function (isExpand) {
        var _this = this;

        if (!$.isEmptyObject(this.preferenceTarget['scroll'])) {
            if ($('body').hasClass('scroll-always')) {
                this.preferenceTarget['scroll'].perfectScrollbar('update');
            }
        }
    };

    SideBar.prototype.resizeAceEditors = function () {
        this.$parent.find('.ace_editor').each(function (i, $el) {
            $el.env.editor.resize();
        });
    };

    SideBar.prototype.refreshCodeMirrorControl = function () {
        this.$parent.find('.CodeMirror').each(function (i, $el) {
            $el.CodeMirror.refresh();
        });
    };

    SideBar.prototype.refreshjqxTabs = function () {
        var tabs = this.$parent.find('.jqx-tabs');
        if (tabs.length > 0) tabs.jqxTabs('render');
    };

    SideBar.prototype.refreshTabs = function () {
        if (this.$mainControl) {
            var tabs = this.$mainControl.find('.brtc-va-tab-header');
            if (tabs.length > 0) {
                if (tabs.filter('.selected:visible').length === 0) {
                    tabs.filter(':visible').eq(0).click();
                }
            }
        }
    };

    SideBar.prototype.appendTemplate = function (options) {
        console.error('if you want to use Library, Must implement appendTemplate Method');
    };

    SideBar.prototype.configureSize = function () {
        setTimeout(() => this.$parent.find('.brtc-va-studio-sidebar-area').width(this.options.width - 20), 0);
    };

    SideBar.prototype.createHeader = function () {
        var _this = this;
        var headerText = this.options.label; //.toUpperCase();

        this.$headerControl = $(
            crel('div', {class: 'brtc-va-studio-sidebar-header-wrapper'},
                crel('div', {class: 'brtc-va-studio-sidebar-collapse ' + this.options.position}),
              crel('dlv', {class: 'brtc-va-tools-sidebar-header'}, headerText)
            )
        );

        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$headerControl);
        this.$headerControl.find('.brtc-va-studio-sidebar-collapse').click(function () {
            _this.hide();
        });
    };

    SideBar.prototype.udfChanged = function (selection) {
    };

    SideBar.prototype.templateChanged = function (selection) {
    };

    SideBar.prototype.onActivated = function () {
    };

    SideBar.prototype.onFnUnitSelect = function (fnUnit) {
    };

    SideBar.prototype.onModelChange = function () {
    };

    SideBar.prototype.initPreferenceTarget = function () {
    };

    SideBar.prototype.destroy = function () {
    };

    SideBar.prototype.getEditor = function () {
        return this.options.manager.getEditor();
    };

    SideBar.prototype.getLayout = function () {
        return this.options;
    };

    Brightics.VA.Core.Tools.SideBar = SideBar;

}).call(this);
