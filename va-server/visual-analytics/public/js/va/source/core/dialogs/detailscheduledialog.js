/**
 * Created by SDS on 2017-05-31.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    function DetailScheduleDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    DetailScheduleDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    DetailScheduleDialog.prototype.constructor = DetailScheduleDialog;

    DetailScheduleDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 685;
        this.dialogOptions.height = 435;
    };

    DetailScheduleDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        var schedule = _this.options.schedule;
        $parent.append('' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Schedule Name</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-name-input" valid-type="type1" maxlength="80"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Cron Expression</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-cron-input" valid-type="type1" maxlength="80"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Schedule Owner</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-owner-input" valid-type="type1" maxlength="80"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Is Active</div>' +
            '   <div class="brtc-va-dialogs-schedule-active-selector"></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Dependency Schedule</div>' +
            '   <div class="brtc-va-dialogs-schedule-dependency-selector"></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row brtc-style-margin-top-5">' +
            '   <div class="brtc-va-dialogs-schedule-label">Model Version</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-model-version-input" />' +
            '</div>' +
            '');

        this.$scheduleNameInput = $parent.find(".brtc-va-dialogs-schedule-name-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        this.$scheduleNameInput.val(schedule.scheduleName);

        this.$cronInput = $parent.find(".brtc-va-dialogs-schedule-cron-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        this.$cronInput.val(schedule.cronExpression);

        this.$scheduleOwnerInput = $parent.find(".brtc-va-dialogs-schedule-owner-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        this.$scheduleOwnerInput.val(schedule.scheduleOwner);

        this.$activeSelector = $parent.find(".brtc-va-dialogs-schedule-active-selector").jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            source: ['Y', 'N'],
            disabled: true
        });
        this.$activeSelector.val(schedule.isActive);

        this.$dependencySelector = $parent.find(".brtc-va-dialogs-schedule-dependency-selector").jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            displayMember: 'scheduleName',
            valueMember: 'scheduleId',
            dropDownHeight: 300,
            disabled: true
        });

        this.$modelVersionInput = $parent.find(".brtc-va-dialogs-schedule-model-version-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true,
            placeHolder: 'Select version'
        });

        var getDependencies = function (resolve, reject) {
            var option = {
                url: 'api/admin/v2/schedules',
                type: 'GET',
                contentType: 'application/json; charset=utf-8'
            };
            $.ajax(option).done(function (data) {
                $.each(data, function (idx, schedule) {
                    data[idx].scheduleId = Utils.WidgetUtils.convertHTMLSpecialChar(schedule.scheduleId);
                });

                _this.$dependencySelector.jqxDropDownList({
                    source: data
                });

                _this.$dependencySelector.jqxDropDownList('insertAt', '', 0);

                _this.$dependencySelector.val(schedule.dependencyId);
                resolve();
            }).fail(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                reject(err);
            });
        };

        var getModelVersions = Studio.getResourceManager().fetchVersions(
            this.options.editorInput.getProjectId(),
            this.options.editorInput.getFileId())
            .then(function (versions) {
                var versionText = '';
                var versionId = _this.getVersionInfo(JSON.parse(schedule.executeContents)).id;

                _.forEach(versions, function (version) {
                    if (versionId === version.getVersionId()) {
                        versionText = version.getVersion();
                    }
                });
                _this.$modelVersionInput.val(versionText);
                return true;
            });

        var promises = [];

        promises.push(new Promise(getDependencies));
        promises.push(getModelVersions);

        Promise.all(promises).catch(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(error);
        }).then(function () {
        });
    };

    DetailScheduleDialog.prototype.getVersionInfo = function (executeContents) {
        var models = executeContents.models;
        var versionId;

        for (var mid in models) {
            versionId = models[mid].version_id;
        }

        return {
            name: '',
            id: versionId
        };
    };

    DetailScheduleDialog.prototype.createDialogButtonBar = function ($parent) {
        this.$editButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-ok" value="Edit" />');
        $parent.append(this.$editButton);
        this.$editButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$editButton.click(this.handleEditClicked.bind(this));

        this.$deleteButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-delete" value="Delete" />');
        $parent.append(this.$deleteButton);
        this.$deleteButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$deleteButton.click(this.handleDeleteClicked.bind(this));

        this.$cancelButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />');
        $parent.append(this.$cancelButton);
        this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$cancelButton.click(this.handleCancelClicked.bind(this));
    };

    DetailScheduleDialog.prototype.handleEditClicked = function () {
        var _this = this;

        new Brightics.VA.Core.Dialogs.EditScheduleDialog(_this.$parent, {
            editorInput: _this.options.editorInput,
            schedule: _this.options.schedule,
            close: function (result) {
                if (result.OK) {
                    Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
                }
            },
            title: 'Edit Schedule'
        });
    };

    DetailScheduleDialog.prototype.refreshScheduleData = function () {
        var _this = this;

        $.ajax({
            url: 'api/admin/v2/schedules/' + _this.options.schedule.scheduleId,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        }).done(function (data) {
            if (data.length > 0) {
                _this.$scheduleNameInput.val(data[0].scheduleName);
                _this.$cronInput.val(data[0].cronExpression);
                _this.$scheduleOwnerInput.val(data[0].scheduleOwner);
                _this.$activeSelector.val(data[0].isActive);

                _this.options.schedule = data[0];
            }
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    DetailScheduleDialog.prototype.handleDeleteClicked = function () {
        var _this = this;

        _this.createDeleteConfirmDialog();
    };

    DetailScheduleDialog.prototype.createDeleteConfirmDialog = function () {
        var _this = this;
        var schedule = _this.options.schedule;

        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                $.ajax({
                    url: 'api/admin/v2/schedules/' + schedule.scheduleId + '/delete',
                    type: 'POST',
                    data: JSON.stringify(schedule),
                    contentType: 'application/json; charset=utf-8',
                    blocking: true
                }).done(function () {
                    Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Schedule(s) ( ' + schedule.scheduleName + ' ) has been deleted.', function () {
                        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
                    });
                }).fail(function (err) {
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                });
            }
        };

        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Selected item(s) will be permanently deleted and cannot be recovered. Are you sure?', closeHandler);
    };

    Brightics.VA.Core.Dialogs.DetailScheduleDialog = DetailScheduleDialog;

}).call(this);