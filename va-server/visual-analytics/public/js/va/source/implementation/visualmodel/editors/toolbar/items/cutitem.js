/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CutItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
        this.setDisable();
    }

    CutItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    CutItem.prototype.constructor = CutItem;

    CutItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.cut,
                    "item-type": "cut"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    CutItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var clipboardManager = Studio.getClipboardManager();
        var modelId = editor.getEditorInput().getFileId();
        var objects = {};
        var selectedObjects = editor.getSelectedObjects(); 
        objects[modelId] = selectedObjects;

        // no need to sync that remove and copy
        clipboardManager.addVisualObjects(objects);
        editor.removeObjects(selectedObjects);
        //fix me : async
        editor.handleSelectionChanged();
        editor.notification('success', 'cut');
    };

    CutItem.prototype.handleOnSelectionChanged = function (selection) {
        if (_.isEmpty(selection)) this.setDisable();
        else this.setEnable();
    };

    Brightics.VA.Implementation.Visual.Toolbar.CutItem = CutItem;

}).call(this);