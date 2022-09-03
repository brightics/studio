/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function IndexItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    IndexItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    IndexItem.prototype.constructor = IndexItem;

    IndexItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": "Index",
                    "item-type": "index"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    IndexItem.prototype.handleOnClick = function (event) {
        this.closeIndexDialog();
        this.openIndexDialog();
    };

    IndexItem.prototype.closeIndexDialog = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var indexDialog = editor.indexDialog;

        if (indexDialog) {
            indexDialog.close();
        }
        indexDialog = null;
    };

    IndexItem.prototype.openIndexDialog = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        editor.indexDialog = new Brightics.VA.Core.Dialogs.IndexDialog(editor.$mainControl, {
            editor: editor,
            appendTo: editor.$mainControl
        });
    };
    
    Brightics.VA.Core.Editors.Toolbar.IndexItem = IndexItem;

}).call(this);