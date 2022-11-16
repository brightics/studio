/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VariableItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    VariableItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    VariableItem.prototype.constructor = VariableItem;

    VariableItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.variables,
                    "item-type": "variable"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    VariableItem.prototype.handleOnClick = function (event) {
        Studio.getEditorContainer().getActiveModelEditor().getSideBarManager()
            .expandStatusChange('variables', true);
    };

    Brightics.VA.Core.Editors.Toolbar.VariableItem = VariableItem;

}).call(this);