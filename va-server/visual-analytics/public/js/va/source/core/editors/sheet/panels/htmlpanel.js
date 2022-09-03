/**
 * Created by gy84.bae on 2016-02-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function HtmlPanel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.call(this, parentId, options);
    }

    HtmlPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype);
    HtmlPanel.prototype.constructor = HtmlPanel;

    HtmlPanel.prototype.createControls = function () {
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

    HtmlPanel.prototype.createContentsAreaControls = function ($parent) {
        $parent.addClass('brtc-style-flex-1');
        this.$contentsArea
            .addClass('brtc-style-padding-right-20')
            .addClass('brtc-style-padding-right-20')
            .addClass('rtc-style-width-minus-40');

        var tid = 'html';
        
        var doneCallback = function  (htmlText) {
            $parent.append(htmlText);
        };
        var failCallback = function  () {
            var htmlText = '<h3>There is No Model</h3>';

            $parent.append(htmlText);
        };

        this.options.dataProxy.requestDataForce(tid, doneCallback, failCallback);
    };

    Brightics.VA.Core.Editors.Sheet.Panels.HtmlPanel = HtmlPanel;
}).call(this);