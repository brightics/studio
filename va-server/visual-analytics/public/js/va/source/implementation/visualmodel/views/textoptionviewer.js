/**
 * Created by daewon.park on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TextOptionViewer(parentId, options) {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.call(this, parentId, options);
    }

    TextOptionViewer.prototype = Object.create(Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype);
    TextOptionViewer.prototype.constructor = TextOptionViewer;

    TextOptionViewer.prototype.createControls = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.createControls.call(this);

        this.createLayout();

        this.createArrangeControl();

        this.$mainControl.perfectScrollbar();
    };

    TextOptionViewer.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-controls-options-viewer brtc-style-option-viewer brtc-style-s-sidebar-background text" viewer-type="text">' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.createPropertiesLayout();
        this.createBackgroundLayout();
        this.createArrangeLayout();
    };

    TextOptionViewer.prototype.showOption = function (contentUnit) {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.showOption.call(this, contentUnit);

        //summernote option
        var $textOption = contentUnit.$content.find('.note-toolbar.panel-heading').detach();
        this.$properties.append($textOption);
        $textOption.css('display', 'block');

        //background
        this.createBackgroundControl();
    };

    TextOptionViewer.prototype.createBackgroundControl = function () {
        this.createTransparentControl();
    };

    TextOptionViewer.prototype.createTransparentControl = function () {
        var _this = this;

        var contentStyle = this.getContentStyle();

        this.$transparent.find('.brtc-va-controls-options-viewer-content').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            checked: (contentStyle && contentStyle.background && (contentStyle.background === 'transparent')) ? true : false,
            height: 25
        });

        this.$transparent.find('.brtc-va-controls-options-viewer-content').on('change', function (event) {
            var checked = event.args.checked;
            _this.handleBackground(checked ? 'transparent' : 'white');
        });
    };

    TextOptionViewer.prototype.hideOption = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.hideOption.call(this);

        if (this.contentUnit) {
            var $textOption = this.$mainControl.find('.note-toolbar.panel-heading').detach();
            $textOption.css('display', 'none');
            this.contentUnit.$content.find('.note-editor.note-frame.panel.panel-default').prepend($textOption);
        }
    };

    TextOptionViewer.prototype.destroy = function () {

    };

    TextOptionViewer.prototype.handleBackground = function (background) {
        var oldStyle = $.extend(true, {}, this.contentUnit.content.style);
        var newStyle = $.extend(true, oldStyle, {background: background});
        // this.contentUnit.setBackground(background);

        this.options.optionPanelManager.handleStyleChanged(this.contentUnit.content, newStyle);
    };

    TextOptionViewer.prototype.getContentStyle = function () {
        return this.contentUnit.content.style;
    };  

    Brightics.VA.Implementation.Visual.Views.OptionViewer['text'] = TextOptionViewer;

}).call(this);