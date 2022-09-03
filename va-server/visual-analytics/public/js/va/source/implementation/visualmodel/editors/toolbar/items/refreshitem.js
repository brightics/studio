/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RefreshItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    RefreshItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    RefreshItem.prototype.constructor = RefreshItem;

    RefreshItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.refresh,
                    "item-type": "refresh"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    RefreshItem.prototype.handleOnClick = function (event) {
        Studio.getEditorContainer().getActiveModelEditor().diagramEditorPage.reloadData();
    };

    Brightics.VA.Implementation.Visual.Toolbar.RefreshItem = RefreshItem;

}).call(this);