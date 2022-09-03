/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UploadItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    UploadItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    UploadItem.prototype.constructor = UploadItem;

    UploadItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": "Upload",
                    "item-type": "upload"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    UploadItem.prototype.handleOnClick = function (event) {
        this.openRepositoryBrowserDialog();
    };

    UploadItem.prototype.openRepositoryBrowserDialog = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        new Brightics.VA.Core.Dialogs.RepositoryBrowserDialog(editor.getMainArea(), {
            useButton: false,
            filePath: '',
            open: function () {
                $('.ui-dialog-titlebar.ui-widget-header', $(this).parent()).css('margin-left', '30px !important');
            },
            resizable: true,
            title: 'Browse Repository'
        });
    };
    
    Brightics.VA.Core.Editors.Toolbar.UploadItem = UploadItem;

}).call(this);