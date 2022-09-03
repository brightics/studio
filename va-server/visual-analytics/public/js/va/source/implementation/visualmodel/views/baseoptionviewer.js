/**
 * Created by daewon.park on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BaseOptionViewer(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.init();
        this.retrieveParent();
        this.createControls();
    }

    BaseOptionViewer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    BaseOptionViewer.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-controls-options-viewer brtc-style-option-viewer brtc-style-s-sidebar-background text" viewer-type="text">' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.createPropertiesLayout();
        this.createArrangeLayout();
    };

    BaseOptionViewer.prototype.createPropertiesLayout = function () {
        this.$properties = $('' +
            '<div class="brtc-va-controls-options-viewer-unit properties">' +
                '<span class="brtc-style-option-category brtc-style-s-option-category">'+Brightics.locale.common.properties+'</span>' +
                '<div class="brtc-va-controls-options-viewer-content"></div>' +
            '</div>');

        this.$mainControl.append(this.$properties);
    };

    BaseOptionViewer.prototype.createBackgroundLayout = function () {
        this.$transparent = $('' +
            '<div class="brtc-va-controls-options-viewer-unit background">' +
                '<span class="brtc-style-option-category brtc-style-s-option-category">'+Brightics.locale.common.background+'</span>' +
                '<div class="brtc-va-controls-options-viewer-content transparent"></div>' +
                '<div class="brtc-va-controls-options-viewer-content-label">Transparent</div>' +
            '</div>');

        this.$mainControl.append(this.$transparent);
    };

    BaseOptionViewer.prototype.createArrangeLayout = function () {
        this.$arrange = $('' +
            '<div class="brtc-va-controls-options-viewer-unit arrange">' +
                '<span class="brtc-style-option-category brtc-style-s-option-category">'+Brightics.locale.common.arrange+'</span>' +
                '<div class="brtc-va-controls-options-viewer-content"></div>' +
            '</div>');

        this.$mainControl.append(this.$arrange);
    };

    BaseOptionViewer.prototype.init = function () {
    };

    BaseOptionViewer.prototype.createControls = function () {
    };

    BaseOptionViewer.prototype.showOption = function (contentUnit) {
        this.contentUnit = contentUnit;

        this.$mainControl.show();
    };

    BaseOptionViewer.prototype.hideOption = function () {
        this.$mainControl.hide();
    };

    BaseOptionViewer.prototype.destroy = function () {

    };

    BaseOptionViewer.prototype.getEditor = function () {
        return this.options.optionPanelManager.getEditor();
    };

    BaseOptionViewer.prototype.createArrangeControl = function () {
        var _this = this;

        this.$arrangeControl = $('' +
            '<div class="brtc-va-controls-options-viewer-arrange">' +
                '<div class="brtc-va-controls-options-viewer-arrange-wrapper">' +  
                    '<div class="brtc-va-controls-options-viewer-arrange-front front arrange-button"><div class="button"></div></div>' +
                    '<div class="brtc-va-controls-options-viewer-arrange-plus plus arrange-button"><div class="button"></div></div>' +
                    '<div class="brtc-va-controls-options-viewer-arrange-minus minus arrange-button"><div class="button"></div></div>' +
                    '<div class="brtc-va-controls-options-viewer-arrange-backend backend arrange-button"><div class="button"></div></div>' +
                '</div>' +
            '</div>');
        this.$arrange.find('.brtc-va-controls-options-viewer-content').append(this.$arrangeControl);    

        var $front = this.$arrangeControl.find('.front');
        var $backend = this.$arrangeControl.find('.backend');
        var $plus = this.$arrangeControl.find('.plus');
        var $minus = this.$arrangeControl.find('.minus');

        $front.attr('title', 'Bring to Front');
        $backend.attr('title', 'Send to Back');
        $plus.attr('title', 'Bring Forward');
        $minus.attr('title', 'Send Backward');

        $front.click(function () {
            _this.handleArrange('front');
        }); 
        $backend.click(function () {
            _this.handleArrange('backend');
        }); 
        $plus.click(function () {
            _this.handleArrange('plus');
        }); 
        $minus.click(function () {
            _this.handleArrange('minus');
        });        
    };

    BaseOptionViewer.prototype.handleArrange = function (arrange) {
        var index = this.contentUnit.getZIndex();
        var paper = this.contentUnit.getPaper();

        if (arrange === 'front') {
            index = paper.getMaxZIndex() + 1;
        } else if (arrange === 'backend') {
            index = paper.getMinZIndex() - 1;
        } else if (arrange === 'plus') {
            index += 1;
        } else if (arrange === 'minus') {
            index -= 1;
        }

        var oldStyle = $.extend(true, {}, this.contentUnit.content.style);
        var newStyle = $.extend(true, oldStyle, {'z-index': index});

        this.options.optionPanelManager.handleStyleChanged(this.contentUnit.content, newStyle);
    };

    Brightics.VA.Implementation.Visual.Views.BaseOptionViewer = BaseOptionViewer;

}).call(this);