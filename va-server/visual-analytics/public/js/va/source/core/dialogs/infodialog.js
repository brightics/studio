/**
 * Created by sungjin1.kim on 2017-11-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InfoDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    InfoDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    InfoDialog.prototype.constructor = InfoDialog;

    InfoDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 655;
        this.dialogOptions.height = this.options.model ? 640 : 500;
    };

    InfoDialog.prototype.createDialogContentsArea = function ($parent) {
        var projectCreateTime = moment(this.options.project.getCreateTime()).format('YYYY-MM-DD HH:mm:ss');
        var $modelInfoDialog = $('' +
            '<div class="brtc-style-editors-model-info-tooltip brtc-va-editors-tooltip-modelinfo">' +
            '   <div class="date_area"/>' +
            '</div>');
        $parent.append($modelInfoDialog);

        if (this.options.model) {
            var modelCreateTime = moment(this.options.model.getCreateTime()).format('YYYY-MM-DD');
            var modelUpdateTime = moment(this.options.model.getUpdateTime()).format('YYYY-MM-DD');

            $modelInfoDialog.find('.date_area').append('' +
                '<p>' +
                '   <span>' + Brightics.locale.common.updatedon + '</span>' +
                '   <span class="value">' + modelUpdateTime + '</span>' +
                '   <span>' + Brightics.locale.common.updatedby + '</span>' +
                '   <span class="value updater">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.model.getUpdater()) + '</span>' +
                '</p>' +
                '<p>' +
                '   <span>' + Brightics.locale.common.createdon + '</span>' +
                '   <span class="value">' + modelCreateTime + '</span>' +
                '   <span>' + Brightics.locale.common.createdby + '</span>' +
                '   <span class="value creator">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.model.getCreator()) + '</span>' +
                '</p>');
            $modelInfoDialog.find('.date_area .value.updater').attr('title', this.options.model.getUpdater());
            $modelInfoDialog.find('.date_area .value.creator').attr('title', this.options.model.getCreator());

            let description = this.options.model.getDescription() !== '<p><br /></p>' ? this.options.model.getDescription() : 'There is no description for this model.';
            $modelInfoDialog.find('.date_area').append('' +
                '<div class="model_description">' + description + '</div>');
            $modelInfoDialog.append('' +
                '   <div class="project_area">' +
                '       <p class="proj_title">' + Brightics.locale.common.project + '</p>' +
                '       <p class="proj_name">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.project.getLabel()) + '</p>' +
                '       <p class="create">' +
                '           <span>' + Brightics.locale.common.createdon + '</span><span class="value">' + projectCreateTime + '</span>' +
                '           <span>' + Brightics.locale.common.createdby + '</span><span class="value creator">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.project.getCreator()) + '</span></p>' +
                '   </div>' +
                '');

            $modelInfoDialog.find('.proj_name').attr('title', this.options.project.getLabel());
            $modelInfoDialog.find('.project_area .value.creator').attr('title', this.options.project.getCreator());
        } else {
            $modelInfoDialog.find('.date_area').append('' +
                '<p>' +
                '   <span>' + Brightics.locale.common.createdon + '</span>' +
                '   <span class="value">' + projectCreateTime + '</span>' +
                '   <span>' + Brightics.locale.common.createdby + '</span>' +
                '   <span class="value creator">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.project.getCreator()) + '</span>' +
                '</p>');
            $modelInfoDialog.find('.date_area .value.creator').attr('title', this.options.project.getCreator());

            let description = this.options.project.getDescription() !== '<p><br /></p>' ? this.options.project.getDescription() : 'There is no description for this project.';
            $modelInfoDialog.find('.date_area').append('<div class="model_description">' + description + '</div>');
        }
        $modelInfoDialog.find('.model_description').perfectScrollbar();
    };

    InfoDialog.prototype.createDialogButtonBar = function ($parent) {

    };

    Brightics.VA.Core.Dialogs.InfoDialog = InfoDialog;

}).call(this);