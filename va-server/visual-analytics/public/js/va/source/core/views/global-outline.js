/* -----------------------------------------------------
 *  global-outline.js
 *  Created by hyunseok.oh@samsung.com on 2018-07-12.
 * ---------------------------------------------------- */

/* global _ */
(function (Brightics) {
    var Outline = Brightics.VA.Core.Views.Outline;

    function GlobalOutline(options) {
        Outline.call(this, options);
    }

    GlobalOutline.prototype = _.create(Outline.prototype);
    GlobalOutline.prototype.constructor = GlobalOutline;

    GlobalOutline.prototype.onClickItem = function (item) {
    };

    GlobalOutline.prototype.getData = function () {
        return [Brightics.VA.Core.Utils.NestedFlowUtils
            .getGlobalOutline(this.projectId, this.model)];
    };

    Brightics.VA.Core.Views.GlobalOutline = GlobalOutline;
}(window.Brightics));
