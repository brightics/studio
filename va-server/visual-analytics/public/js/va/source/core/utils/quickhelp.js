/**
 * Created by daewon.park on 2016-03-28.
 */
(function () {
    'use strict';

    var root = this;

    var showHelp = function (clazz) {
        var $el = $('body');

        var $popover = $('<div class="brtc-va-quickhelp-background"></div>');
        $popover.addClass(clazz);
        $el.append($popover);

        $popover.on('click', function () {
            $popover.remove();
        });
    };

    root.Brightics.VA.Core.Utils.QuickHelp = {
        showQuickModeling: function () {
            showHelp('brtc-va-quickhelp-quickdrawing');
        }
    };

}).call(this);