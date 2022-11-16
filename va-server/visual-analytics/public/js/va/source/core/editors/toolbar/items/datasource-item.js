/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DatasourceItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    DatasourceItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    DatasourceItem.prototype.constructor = DatasourceItem;

    DatasourceItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.datasourceManagement,
                    "item-type": "datasource"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    DatasourceItem.prototype.handleOnClick = function (event) {
        // Studio.getClipboardManager().openClipboardDialog(true);
        new Brightics.VA.Core.Dialogs.DatasourceManagementDialog(this.$parent);
    };

    Brightics.VA.Core.Editors.Toolbar.DatasourceItem = DatasourceItem;

}).call(this);