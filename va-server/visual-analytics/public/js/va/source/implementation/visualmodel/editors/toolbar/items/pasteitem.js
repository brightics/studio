/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PasteItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
        this.setDisable();
    }

    PasteItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    PasteItem.prototype.constructor = PasteItem;

    PasteItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.paste,
                    "item-type": "paste"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    PasteItem.prototype.handleOnClick = function (event) {
        var activeEditor = Studio.getEditorContainer().getActiveModelEditor();
        var modelId = activeEditor.getEditorInput().getFileId();
        var objects = Studio.getClipboardManager().getVisualObjects(modelId);

        activeEditor.pasteObjects(objects);
    };

    PasteItem.prototype.handleOnCopy = function () {
        this.setEnable();
    };
    
    Brightics.VA.Implementation.Visual.Toolbar.PasteItem = PasteItem;

}).call(this);