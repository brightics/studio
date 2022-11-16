/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VersionItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    VersionItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    VersionItem.prototype.constructor = VersionItem;

    VersionItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.versionManagement,
                    "item-type": "version"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    VersionItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var editorInput = editor.getEditorInput();
        var projectId = editorInput.getProjectId();
        var fileId = editorInput.getFileId();

        new Brightics.VA.Core.Dialogs.VersionManagementDialog(this.$mainControl, {
            projectId: projectId,
            fileId: fileId,
            position: {my: 'center top', at: 'center top+15%', of: window},
            editor: editor
        });
    };

    Brightics.VA.Core.Editors.Toolbar.VersionItem = VersionItem;

}).call(this);