/**
 * hyunseok.oh@samsung.com
 * 2017-12-20
 */

/**
 * 의존모듈: jQuery, Dialog
 */

/* global _ */

(function () {
    'use strict';

    var Brightics = this.Brightics;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    /**
     * @extends Dialog
     * @param {*} parentId
     * @param {Object} options
     */
    function DetailVersionDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    DetailVersionDialog.prototype = Object.create(_super);
    DetailVersionDialog.prototype.constructor = DetailVersionDialog;

    DetailVersionDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);
        this.dialogOptions.width = 760;
        this.dialogOptions.height = 440;
        this.dialogOptions.maxHeight = 440;
        this.dialogOptions.title = Brightics.locale.common.versionDetail;
    };

    DetailVersionDialog.prototype.createDialogContentsArea = function ($parent) {
        var html = [
            '<div class="brtc-va-dialogs-version-datail-contents">',
            '  <div class="brtc-va-dialogs-version-detail">',
            '  </div>',
            '</div>'
        ].join('\n');

        this.$self = $(html);
        $parent.append(this.$self);
        this.$detailBody = this.$self.find('.brtc-va-dialogs-version-detail');
        this.modelVersionDetail = new Brightics.VA.Core.Components.ModelVersionDetail({
            $el: this.$detailBody
        });

        this._refreshDetail();
        this.$mainControl.dialog(this.dialogOptions);
    };

    DetailVersionDialog.prototype.createDialogButtonBar = function ($parent) {
        _super.createDialogButtonBar.call(this, $parent);
        this.$okButton.val(Brightics.locale.common.edit);
    };

    DetailVersionDialog.prototype.handleEditClicked = function () {
        this.openEditVersionDialog();
    };

    DetailVersionDialog.prototype.handleOkClicked = function () {
        this.handleEditClicked();
    };

    DetailVersionDialog.prototype._refreshDetail = function () {
        var updateModelVersionDetail = function (data) {
            this.modelVersionDetail.update(data);
        }.bind(this);

        Studio.getResourceManager().fetchVersion(
            this.options.projectId,
            this.options.fileId,
            this.options.versionId)
            .then(updateModelVersionDetail)
            .catch(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                this.$mainControl.dialog('close');
            }.bind(this));
    };

    DetailVersionDialog.prototype.openEditVersionDialog = function () {
        var onClose = function (result) {
            if (result.OK) this.dialogResult.edited = true;
        }.bind(this);

        new Brightics.VA.Core.Dialogs.EditVersionDialog(this.$mainControl, {
            projectId: this.options.projectId,
            fileId: this.options.fileId,
            versionId: this.options.versionId,
            onEditCallback: this._refreshDetail.bind(this),
            close: onClose
        });
    };

    Brightics.VA.Core.Dialogs.DetailVersionDialog = DetailVersionDialog;
    /* eslint-disable no-invalid-this */
}.call(this));
