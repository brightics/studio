/*
 * 2017-12-13
 * hyunseok.oh@samsung.com
 */


/* global _ */

(function () {
    'use strict';

    var Brightics = this.Brightics;
    var Utils = Brightics.VA.Core.Utils;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    /**
     * @extends Dialog
     * @param {*} parentId
     * @param {Object} options
     */
    function VersionManagementDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    VersionManagementDialog.prototype = Object.create(_super);
    VersionManagementDialog.prototype.constructor = VersionManagementDialog;

    VersionManagementDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);

        this.dialogOptions.title = Brightics.locale.common.versionList;
        this.dialogOptions.width = 1000;
        this.dialogOptions.height = 'auto';
        this.dialogOptions.maxHeight = 'auto';
    };

    VersionManagementDialog.prototype.createDialogContentsArea = function ($parent) {
        var template = [
            '<div class="brtc-va-dialogs-version-management-contents">',
            '  <div class="brtc-va-dialogs-version-management-header">',
            '    <input type="button" class="brtc-va-dialogs-version-management-add" value="'+ Brightics.locale.common.updateVersion +'">',
            '  </div>',
            '  <div class="brtc-va-dialogs-version-management-body">',
            '  </div>',
            '</div>'
        ].join('\n');

        $parent.append(template);

        this.$addBtn = $parent.find('.brtc-va-dialogs-version-management-add');
        this.$contentBody = $parent.find('.brtc-va-dialogs-version-management-body');

        var emitter = new Brightics.VA.EventEmitter();
        emitter.on('load', _.debounce(function (fileVersion) {
            this.openLoadQuestionDialog(function (result) {
                if (result.OK) {
                    this.loadFileVersion(fileVersion.getFileId(), fileVersion.getVersionId());
                }
            }.bind(this));
        }.bind(this), 300));
        emitter.on('error', _.debounce(function (err) {
            this._onError(err);
        }.bind(this)));

        this.modelVersionListComponent = new Brightics.VA.Core.Components.ModelVersionListLoadable({
            $el: this.$contentBody,
            emitter: emitter,
            projectId: this.options.projectId,
            fileId: this.options.fileId
        });

        this.createAddButton(this.$addBtn);
    };

    VersionManagementDialog.prototype.createAddButton = function ($self) {
        $self.jqxButton({ theme: Brightics.VA.Env.Theme });
        $self.click(_.debounce(this.openAddVersionDialog.bind(this)));
    };

    VersionManagementDialog.prototype.openAddVersionDialog = function () {
        var closeHandler = function (result) {
            if (result.OK) this.modelVersionListComponent.refreshFileVersionList();
        }.bind(this);

        new Brightics.VA.Core.Dialogs.AddVersionDialog(this.$mainControl, {
            projectId: this.options.projectId,
            fileId: this.options.fileId,
            close: closeHandler
        });
    };

    VersionManagementDialog.prototype.openLoadQuestionDialog = function (callback) {
        var msg = 'Current model contents will be overwritten by this version and cannot be recovered. Are you sure?';
        Utils.WidgetUtils.openQuestionDialog(msg, callback);
    };

    VersionManagementDialog.prototype.createDialogButtonBar = function ($parent) {
        _super.createDialogButtonBar.call(this, $parent);
        this.$okButton.val(Brightics.locale.common.close);
        this.$cancelButton.css({ display: 'none' });
    };

    VersionManagementDialog.prototype.loadFileVersion = function (fileId, versionId) {
        var openLoadingSuccessDialog = function () {
            return Utils.WidgetUtils.openInformationDialog('Loading success');
        };

        // TODO: 정리할 필요가 있을듯...it touches my mind...
        var closeEditor = function () {
            this.closedEditor = Studio.getEditorContainer().findEditorById(this.options.projectId, fileId);
            if (this.closedEditor) Studio.getLayoutManager().closeEditor(this.closedEditor.options.editorInput);
            return true;
        }.bind(this);

        var closeThisDialogWithSuccess = function () {
            this.dialogResult.loadingSuccess = false;
            return this.$mainControl.dialog('close');
        }.bind(this);

        var updateFileCache = function (updatedFiles) {
            this.updatedFiles = updatedFiles;
        }.bind(this);

        var refresh = function () {
            Studio.getLayoutManager().openEditor(this.updatedFiles);
            // if (this.closedEditor) {
            //     Studio.getLayoutManager().openEditor(this.updatedFiles);
            //     // this.options.editor.getModelLayoutManager().openActivity(this.options.fileId);
            // } else {
            //     Studio.getLayoutManager().refreshProjectViewer();
            // }
        }.bind(this);

        Studio.getResourceManager().loadVersion(this.options.projectId, fileId, versionId)
            .then(updateFileCache)
            .then(closeEditor)
            .then(openLoadingSuccessDialog)
            .then(closeThisDialogWithSuccess)
            .then(refresh)
            .catch(this._onError.bind(this));
    };

    VersionManagementDialog.prototype._onError = function (err) {
        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        this.$mainControl.dialog('close');
    };

    VersionManagementDialog.prototype.destroy = function () {
        _super.destroy.call(this);
        this.modelVersionListComponent.destroy();
    };

    Brightics.VA.Core.Dialogs.VersionManagementDialog = VersionManagementDialog;
    /* eslint-disable no-invalid-this */
}.call(this));
