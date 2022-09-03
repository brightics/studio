/**
 * Created by SDS on 2017-04-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpdateContentsDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    UpdateContentsDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    UpdateContentsDialog.prototype.constructor = UpdateContentsDialog;

    UpdateContentsDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 550;
        this.dialogOptions.height = 600;

        this.projectId;
        this.modelId;
    };

    UpdateContentsDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        this.$wrapper = $('<div class="brtc-update-contents-wrapper brtc-style-height-full brtc-style-display-flex brtc-style-flex-direction-column"></div>');

        $parent.append(this.$wrapper);

        var opt = {
            url: 'publish/'+ this.options.publish_id,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            async: false
        };

        $.ajax(opt).done(function (result) {
            _this.projectId = result.reportContent.project_id;
            _this.modelId = result.reportContent.id;
            _this.description = result.reportContent.description;

            _this.createProjectControl();
            _this.createModelControl();
            _this.createDescriptionControl();
        });
    };

    UpdateContentsDialog.prototype.getModels = function (projectId) {
        return Studio.getResourceManager().getFiles(projectId);
    };

    UpdateContentsDialog.prototype.createProjectControl = function () {
        var _this = this;

        var $selectorWrapper = $('' +
        '<div class="brtc-update-contents-current-wrapper brtc-style-display-flex">' +
            '<div class="brtc-va-dialogs-add2lib-library-label">'+Brightics.locale.common.project+'</div>' +
            '<div class="brtc-va-dialogs-add2lib-library-selector brtc-style-col-12"></div>' +
        '</div>');
        var $selectorControlArea = $selectorWrapper.find('.brtc-va-dialogs-add2lib-library-selector');

        this.$wrapper.append($selectorWrapper);
        
        this.projectSelector = new Brightics.VA.Core.Tools.ProjectSelector($selectorControlArea, {
            projectId: this.projectId,
            onChange: function (projectId) {
                _this.projectId = projectId;

                var models = _this.getModels(projectId);

                var modelSource = [];

                _.map(models, function (model) {
                    modelSource.push({
                        text: model.getLabel(),
                        value:  model.getFileId()
                    })
                });

                if (_this.modelSelector) _this.modelSelector.setSource(modelSource);
            }
        });
    };

    UpdateContentsDialog.prototype.createModelControl = function () {
        var _this = this;

        var $selectorWrapper = $('' +
        '<div class="brtc-update-contents-current-wrapper brtc-style-display-flex">' +
            '<div class="brtc-va-dialogs-add2lib-library-label">'+Brightics.locale.common.report+'</div>' +
            '<div class="brtc-va-dialogs-add2lib-library-selector brtc-style-col-12"></div>' +
        '</div>');
        var $selectorControlArea = $selectorWrapper.find('.brtc-va-dialogs-add2lib-library-selector');

        this.$wrapper.append($selectorWrapper);
        
        this.modelSelector = new Brightics.VA.Core.Tools.ModelSelector($selectorControlArea, {
            projectId: this.projectId,
            modelId: this.modelId,
            type: 'visual',
            onChange: function (modelId) {
                _this.modelId = modelId;
                var report = Studio.getResourceManager().getFile(_this.projectId, _this.modelId);
                
                _this.description = report.getDescription();

                _this.renderDescriptions();
            }
        });
    };

    UpdateContentsDialog.prototype.createDescriptionControl = function () {
        var $descriptionWrapper = $('' +
        '<div class="brtc-update-contents-current-wrapper brtc-style-display-flex brtc-style-flex-1">' +
            '<div class="brtc-va-dialogs-add2lib-library-label">'+Brightics.locale.common.description+'</div>' +
            '<div class="brtc-va-dialogs-add2lib-library-description brtc-style-col-12"></div>' +
        '</div>');
        this.$descriptionControlArea = $descriptionWrapper.find('.brtc-va-dialogs-add2lib-library-description');

        this.$wrapper.append($descriptionWrapper);

        this.renderDescriptions();
        
    };

    UpdateContentsDialog.prototype.renderDescriptions = function () {
        if (this.$descriptionControlArea) this.$descriptionControlArea.html(this.description);
    };

    UpdateContentsDialog.prototype.handleOkClicked = function () {
        var _this = this;

        if (!this.projectId || !this.modelId) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please choose project/report.');
            return;
        } else {
            this.dialogResult.publish_id = this.options.publish_id;
            this.dialogResult.projectId = this.projectId;
            this.dialogResult.modelId = this.modelId;  

            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
            
        }
    };

    Brightics.VA.Implementation.Visual.Dialogs.UpdateContentsDialog = UpdateContentsDialog;

}).call(this);
