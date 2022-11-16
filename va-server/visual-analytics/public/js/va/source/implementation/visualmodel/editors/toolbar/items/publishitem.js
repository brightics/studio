/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PublishItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    PublishItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    PublishItem.prototype.constructor = PublishItem;

    PublishItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.publish,
                    "item-type": "publish"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    PublishItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        new Brightics.VA.Implementation.Visual.Dialogs.PublishReportDialog(editor.$mainControl, {
            title: Brightics.locale.common.publish,
            appendTo: editor.$parent
        }, editor.options.editorInput);
    };

    Brightics.VA.Implementation.Visual.Toolbar.PublishItem = PublishItem;

}).call(this);