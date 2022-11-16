/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CopyItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
        this.setDisable();
    }

    CopyItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    CopyItem.prototype.constructor = CopyItem;

    CopyItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.copy,
                    "item-type": "copy"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    CopyItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var clipboardManager = Studio.getClipboardManager();
        var modelId = editor.getEditorInput().getFileId();
        var objects = {};
        objects[modelId] = editor.getSelectedObjects();

        clipboardManager.addVisualObjects(objects);

        editor.notification('success', 'copy');
    };

    CopyItem.prototype.handleOnSelectionChanged = function (selection) {
        if (_.isEmpty(selection)) this.setDisable();
        else this.setEnable();
    };

    Brightics.VA.Implementation.Visual.Toolbar.CopyItem = CopyItem;

}).call(this);