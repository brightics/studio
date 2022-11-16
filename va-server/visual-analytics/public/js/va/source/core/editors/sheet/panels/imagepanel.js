/**
 * Created by gy84.bae on 2016-02-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ImagePanel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.call(this, parentId, options);
    }

    ImagePanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype);
    ImagePanel.prototype.constructor = ImagePanel;

    ImagePanel.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('<div class="brtc-va-editors-sheet-panels-basepanel brtc-style-display-flex brtc-style-flex-direction-column"/>');
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
    };

    ImagePanel.prototype.createTopAreaControls = function ($parent) {
        this.createTopAreaHeaderTitle($parent);
        this.createTopAreaHeaderToolbar();
    };

    ImagePanel.prototype.createTopAreaHeaderToolbar = function ($parent) {
        var $toolbar = $('' +
                '<div class="brtc-va-editors-sheet-panels-datapanel-toolbar"/>');
        this.$header.append($toolbar);

        this.createPopupToolItem($toolbar);
        this.createMinMaxToolItem($toolbar);
    };

    ImagePanel.prototype.createPopupToolItem = function ($toolbar) {
        var _this = this;
        var $popup = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-popup" title="' + Brightics.locale.panel.popupChart + '" target="popupChart"></div>');
        $toolbar.append($popup);

        $popup.click(
            function () {
                var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
                var param = {
                    user: Brightics.VA.Env.Session.userId,
                    pid: modelEditor.options.editorInput.getProjectId(),
                    mid: _this.options.fnUnit.parent().mid,
                    fid: _this.options.fnUnit.fid,
                    tids: _this.FnUnitUtils.getImage(_this.options.fnUnit, _this.options.panelType),
                    offsetArr: [0],
                    limitArr: [1000]
                };

                var params = $.map(param, function (value, key) {
                    return key + '=' + value;
                }).join('&');
                window.open('popupimage?' + params, 'popupImage');
            }
        );
    };

    ImagePanel.prototype.render = function ($parent, imageText) {
        Brightics.VA.Core.Utils.RenderUtils.image($parent, imageText);
    };

    ImagePanel.prototype.createContentsAreaControls = function ($parent) {
        var _this = this;

        $parent.addClass('brtc-style-flex-1');

        var doneCallback = function  (imageText) {
            var $imageWrapper = $('<div class="brtc-va-editors-sheet-panels-imagepanel"></div>');
            $parent.append($imageWrapper);
            _this.render($imageWrapper, imageText);
        };
        var failCallback = function  () {
            _this.renderFail(_this.$contentsArea, 'No Image');
        };

        var tid = this.FnUnitUtils.getImage(this.options.fnUnit, this.options.panelType);
        this.options.dataProxy.requestDataForce(tid, doneCallback, failCallback);
    };

    Brightics.VA.Core.Editors.Sheet.Panels.ImagePanel = ImagePanel;
}).call(this);
