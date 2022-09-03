/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ClipboardItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    ClipboardItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    ClipboardItem.prototype.constructor = ClipboardItem;

    ClipboardItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.functionClipboard,
                    "item-type": "clipboard"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    ClipboardItem.prototype.handleOnClick = function (event) {
        Studio.getClipboardManager().openClipboardDialog(true);
    };

    Brightics.VA.Core.Editors.Toolbar.ClipboardItem = ClipboardItem;

}).call(this);