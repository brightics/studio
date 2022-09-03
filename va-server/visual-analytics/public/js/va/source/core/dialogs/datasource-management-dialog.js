/* -----------------------------------------------------
 *  datasource-management-dialog.js
 *  Created by hyunseok.oh@samsung.com on 2018-10-16.
 * ---------------------------------------------------- */


/* global _ */
(function (root) {
    var Brightics = root.Brightics;
    function DatasourceManagementDialog(parentId, _options) {
        var options = _.extend({
            title: Brightics.locale.common.datasourceManagement,
        }, _options);
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    DatasourceManagementDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    DatasourceManagementDialog.prototype.constructor = DatasourceManagementDialog;

    DatasourceManagementDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 800;
        this.dialogOptions.height = 600;
    };

    DatasourceManagementDialog.prototype.createDialogContentsArea = function ($parent) {
        this.datasourceManagementView = new Brightics.VA.Core.Views.DatasourceManagementView(
            $parent
        );

        return this.datasourceManagementView.getElement();
    };

    DatasourceManagementDialog.prototype.createDialogButtonBar = function ($parent) {
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);
        this.$cancelButton.hide();
        this.$okButton.val(Brightics.locale.common.close);
    };

    DatasourceManagementDialog.prototype.destroy = function (...args) {
        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this, ...args);
        if (this.datasourceManagementView) {
            this.datasourceManagementView.destroy();
            this.datasourceManagementView = null;
        }
    };

    Brightics.VA.Core.Dialogs.DatasourceManagementDialog = DatasourceManagementDialog;
/* eslint-disable no-invalid-this */
}(this));
