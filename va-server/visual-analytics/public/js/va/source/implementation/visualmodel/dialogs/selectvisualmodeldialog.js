/**
 * Created by SDS on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectVisualModelDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    SelectVisualModelDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    SelectVisualModelDialog.prototype.constructor = SelectVisualModelDialog;

    SelectVisualModelDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 1080;
        this.dialogOptions.height = 900;
        this.dialogOptions.resizable = true;
        this.dialogOptions.maxWidth = 1080;
        this.dialogOptions.maxHeight = 900;
    };

    SelectVisualModelDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-select-visualmodel-contents brtc-style-select-visual-model-dialog');

        $parent.append('<div class="brtc-va-dialogs-select-visualmodel-contents-datasource-input-area  select-visual-model-dialog brtc-style-dialogs-contents-input-area"></div>');
        $parent.append('<div class="brtc-va-dialogs-select-visualmodel-contents-datasource-tag-input-area  select-visual-model-dialog brtc-style-dialogs-contents-input-area"></div>');
        $parent.append('<div class="brtc-va-dialogs-select-visualmodel-contents-viewer select-visual-model-dialog brtc-style-dialogs-contents-area"></div>');

        this.createVisualModelList($parent.find('.brtc-va-dialogs-select-visualmodel-contents-viewer'));
        this.createDataSourceAliasInput($parent.find('.brtc-va-dialogs-select-visualmodel-contents-datasource-input-area'));
        this.createDataSourceTagInput($parent.find('.brtc-va-dialogs-select-visualmodel-contents-datasource-tag-input-area'));
    };

    SelectVisualModelDialog.prototype.createVisualModelList = function ($control) {
        var projectId = this.options.projectId;
        var projectLabel = this.options.projectLabel;
        var visualModels = this.options.visualModels;

        this.visualModelListViewer = new Brightics.VA.Implementation.Visual.Views.VisualModelListViewer($control,
            {
                projectId: projectId,
                projectLabel: projectLabel,
                visualModels: visualModels
            }
        );
    };

    SelectVisualModelDialog.prototype.createDataSourceAliasInput = function ($control) {
        $control.append('<span class="brtc-va-dialogs-select-visualmodel-contents-datasource-label ">Data Source Label: </span>');

        this.$nameInput = $('<input type="text"  class="brtc-va-dialogs-select-visualmodel-contents-datasource-input" maxlength="80"/>');
        $control.append(this.$nameInput);

        this.$nameInput.jqxInput({
            placeHolder: 'Enter a data source label.',
            theme: Brightics.VA.Env.Theme,
            width: 'calc(100% - 145px)',
            height: '25px'
        });
        this.$nameInput.val(this.options.defaultDataSourceLabel);
    };

    SelectVisualModelDialog.prototype.createDataSourceTagInput = function ($control) {
        $control.append('<span class="brtc-va-dialogs-select-visualmodel-contents-datasource-tag ">Tag: </span>');

        this.$tagInput = $('<input type="text"  style="margin-left: 100px;" class="brtc-va-dialogs-select-visualmodel-contents-datasource-input" maxlength="80"/>');
        $control.append(this.$tagInput);

        this.$tagInput.jqxInput({
            placeHolder: 'Enter a tag.',
            theme: Brightics.VA.Env.Theme,
            width: 'calc(100% - 145px)',
            height: '25px'

    });
        // this.$tagInput.val(this.options.defaultDataSourceLabel);
    };

    SelectVisualModelDialog.prototype.handleOkClicked = function () {
        var _this = this;
        var selectedModels = this.visualModelListViewer.getSelectedModels();

        if (selectedModels.length) {
            if (this.$nameInput.val().trim()) {
                this.dialogResult.selectedModels = selectedModels;
                this.dialogResult.dataSourceLabel = this.$nameInput.val();
                this.dialogResult.dataSourceTag = this.$tagInput.val();
                this.dialogResult.changeLabel = false;

                var labelObject = {};
                for (var i in selectedModels) {
                    var file = selectedModels[i];
                    var targetVisualModel = file.getContents();
                    var param = {
                        modelId: this.options.modelId,
                        tableId: this.options.tableId
                    };
                    var dataSource = targetVisualModel.getDataSourceUsingParam(param);
                    if (dataSource && dataSource.display.label !== this.dialogResult.dataSourceLabel) {
                        labelObject[targetVisualModel.mid] = {
                            title: targetVisualModel.title,
                            dataSourceLabel: dataSource.display.label
                        };
                    }
                }

                if (Object.keys(labelObject).length) {
                    var message = 'This data source already exists in the report(s) you selected. Do you want to change the data source label into the text you entered?';

                    //for (var key in labelObject) {
                    //    text = '[Report: "' + labelObject[key].title + '" - Data Source Alias: "' + labelObject[key].dataSourceLabel + '"]'
                    //    message.push(text);
                    //}
                    Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, function (confirmDialogDialogResult) {
                        if (confirmDialogDialogResult.OK) {
                            _this.dialogResult.changeLabel = true;
                            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
                        }
                    });
                }
                else {
                    Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
                }
            }
            else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter a data source label.');
            }
        } else {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('At least one must be selected.');
        }
    };

    Brightics.VA.Implementation.Visual.Dialogs.SelectVisualModelDialog = SelectVisualModelDialog;

}).call(this);