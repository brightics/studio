/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ModelInfoItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    ModelInfoItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    ModelInfoItem.prototype.constructor = ModelInfoItem;

    ModelInfoItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.modelInformation,
                    "item-type": "model-info"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    ModelInfoItem.prototype.handleOnClick = function (event) {
        this.closeInfoDialog();
        this.openInfoDialog(event);
    };

    ModelInfoItem.prototype.closeInfoDialog = function () {
        if (this.infoDialog) {
            this.infoDialog.close();
        }
        this.infoDialog = null;
    };

    ModelInfoItem.prototype.openInfoDialog = function (event) {
        var modelEditor = Studio.getEditorContainer().getActiveModelEditor()
        var modelFile = modelEditor.getEditorInput();
        var project = Studio.getResourceManager().getProject(modelFile.getProjectId());

        this.infoDialog = new Brightics.VA.Core.Dialogs.InfoDialog(modelEditor.getMainArea(), {
            project: project,
            model: modelFile,
            position: {my: 'left top', at: 'left bottom', of: event.target},
            appendTo: modelEditor.getMainArea(),
            modal: false,
            title: Brightics.locale.common.modelInformation
        });
    };

    Brightics.VA.Core.Editors.Toolbar.ModelInfoItem = ModelInfoItem;

}).call(this);