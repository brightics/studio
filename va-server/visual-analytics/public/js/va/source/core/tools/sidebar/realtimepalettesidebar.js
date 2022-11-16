/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RealTimePaletteSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    RealTimePaletteSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    RealTimePaletteSideBar.prototype.constructor = RealTimePaletteSideBar;

    RealTimePaletteSideBar.prototype.createContent = function () {
        this.$realtimeSideBar = $('' +
            '<div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar realtime">' +
            '   <div class="brtc-va-tools-sidebar-palettetab brtc-style-tab" />' +
            '</div>');
        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$realtimeSideBar);

        var $paletteArea = this.$realtimeSideBar.find('.brtc-va-tools-sidebar-palettetab');
        this.realtimePalette = new Brightics.VA.Core.Views.Palette($paletteArea, {
            width: '100%',
            height: '100%',
            draggable: true,
            modelType: 'realtime'
        });
    };

    Brightics.VA.Core.Tools.SideBar.RealTimePaletteSideBar = RealTimePaletteSideBar;
}).call(this);