/**
 * hyunseok.oh@samsung.com
 * 2017. 12. 25.
 */

/**
 * 의존모듈: jQuery, Dialog
 */

(function () {
    'use strict';

    var Brightics = this.Brightics;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    /**
     * @extends Dialog
     * @param {*} parentId
     * @param {Object} options
     */
    function SelectVersionDetailDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    SelectVersionDetailDialog.prototype = Object.create(_super);
    SelectVersionDetailDialog.prototype.constructor = SelectVersionDetailDialog;

    SelectVersionDetailDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);
        this.dialogOptions.width = 760;
        this.dialogOptions.height = 440;
        this.dialogOptions.maxHeight = 440;
        this.dialogOptions.title = 'Version Detail';
    };

    SelectVersionDetailDialog.prototype.createDialogContentsArea = function ($parent) {
        var html = [
            '<div class="brtc-va-dialogs-select-version-datail-contents">',
            '  <div class="brtc-va-dialogs-select-version-detail">',
            '  </div>',
            '</div>'
        ].join('\n');

        this.$self = $(html);
        $parent.append(this.$self);
        this.$detailBody = this.$self.find('.brtc-va-dialogs-select-version-detail');
        this.modelVersionDetail = new Brightics.VA.Core.Components.ModelVersionDetail({
            $el: this.$detailBody
        });

        this._refreshDetail();
    };

    SelectVersionDetailDialog.prototype.createDialogButtonBar = function ($parent) {
        _super.createDialogButtonBar.call(this, $parent);
        this.$okButton.val('Close');
        this.$cancelButton.css({ display: 'none' });
    };

    SelectVersionDetailDialog.prototype.handleOkClicked = function () {
        _super.handleOkClicked.call(this);
    };

    SelectVersionDetailDialog.prototype._refreshDetail = function () {
        var updateModelVersionDetail = function (data) {
            this.data = data;
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

    Brightics.VA.Core.Dialogs.SelectVersionDetailDialog = SelectVersionDetailDialog;
/* eslint-disable no-invalid-this */
}.call(this));
