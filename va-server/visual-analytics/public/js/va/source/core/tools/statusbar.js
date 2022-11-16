/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function StatusBar(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    StatusBar.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    StatusBar.prototype.createControls = function() {
        this.$mainControl = $('' +
            '<div class="brtc-va-tools-statusbar">' +
            '   <div class="brtc-va-tools-statusbar-logo"></div>' +
            '   <div class="brtc-va-tools-statusbar-copyright">' +
            '       Copyright <i class="fa fa-copyright"></i> 2016 Samsung SDS, All Rights Reserved.' +
            '   </div>' +
            '   <div class="brtc-va-tools-statusbar-right-area">' +
            '   </div>' +
            '</div>');

        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);
    };

    Brightics.VA.Core.Tools.StatusBar = StatusBar;

}).call(this);