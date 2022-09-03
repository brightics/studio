/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DeleteItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
        this.setDisable();
    }

    DeleteItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    DeleteItem.prototype.constructor = DeleteItem;

    DeleteItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.delete,
                    "item-type": "delete"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    DeleteItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var selectedObjects = editor.getSelectedObjects(); 
        editor.removeObjects(selectedObjects);
        //fix me : async
        editor.handleSelectionChanged();
    };

    DeleteItem.prototype.handleOnSelectionChanged = function (selection) {
        if (_.isEmpty(selection)) this.setDisable();
        else this.setEnable();
    };

    Brightics.VA.Implementation.Visual.Toolbar.DeleteItem = DeleteItem;

}).call(this);