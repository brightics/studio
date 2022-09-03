/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SubToolBar(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};
        this.retrieveParent();
        this.createControls();
    }

    SubToolBar.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SubToolBar.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-tools-subtoolbar">' +
            '   <div class="brtc-va-tools-subtoolbar-left-arrow-area"></div>' +
            '   <div class="brtc-va-tools-subtoolbar-center-area"></div>' +
            '   <div class="brtc-va-tools-subtoolbar-right-arrow-area"></div>' +
            '   <div class="brtc-va-tools-subtoolbar-add-button-area"></div>' +
            '</div>');

        //TODO createControls
        console.log('SubToolBar.prototype.createControls');
        //this.$parent.append(this.$mainControl);
    };

    SubToolBar.prototype.openActivity = function (activity) {
        // TODO createTab
        console.log('SubToolBar.prototype.openActivity');
    };

    SubToolBar.prototype.closeActivity = function () {
        // TODO closeTab
        console.log('SubToolBar.prototype.closeActivity');
    };

    Brightics.VA.Core.Tools.SubToolBar = SubToolBar;

}).call(this);
