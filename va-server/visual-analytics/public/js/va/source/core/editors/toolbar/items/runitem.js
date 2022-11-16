/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RunItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    RunItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    RunItem.prototype.constructor = RunItem;

    RunItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.redo,
                    "item-type": "run"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    RunItem.prototype.handleOnClick = function (event) {
        //Model마다 Run이 다르므로 Implementation에서 override하여 구현
    };

    Brightics.VA.Core.Editors.Toolbar.RunItem = RunItem;

}).call(this);