/**
 * sungjin1.kim@samsung.com
 * 2018. 02. 08
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    function ScheduleManagementDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    ScheduleManagementDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ScheduleManagementDialog.prototype.constructor = ScheduleManagementDialog;

    ScheduleManagementDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);

        this.dialogOptions.width = 1200;
        this.dialogOptions.height = 'auto';
        this.dialogOptions.maxHeight = 'auto';
    };

    ScheduleManagementDialog.prototype.createDialogContentsArea = function ($parent) {
        var template = [
            '<div class="brtc-va-dialogs-schedule-management-header">',
            '   <input type="button" class="brtc-va-dialogs-schedule-management-delete" value="Delete">',
            '   <input type="button" class="brtc-va-dialogs-schedule-management-add" value="Add">',
            '</div>',
            '<div class="brtc-va-dialogs-schedule-management-body">',
            '</div>'
        ].join('\n');

        $parent.append(template);

        this.$addButton = $parent.find('.brtc-va-dialogs-schedule-management-add');
        this.$deleteButton = $parent.find('.brtc-va-dialogs-schedule-management-delete');
        this.$contentBody = $parent.find('.brtc-va-dialogs-schedule-management-body');

        var emitter = new Brightics.VA.EventEmitter();

        emitter.on('row-click', function (row) {
            this.openDetailScheduleDialog(row);
        }.bind(this));
        emitter.on('row-select', function (row) {
            this._refreshButtonStatus('row-select', row);
        }.bind(this));
        emitter.on('row-unselect', function (row) {
            this._refreshButtonStatus('row-unselect', row);
        }.bind(this));

        this.scheduleListComponent = new Brightics.VA.Core.Components.ScheduleList({
            $el: this.$contentBody,
            emitter: emitter
        });

        this.createDeleteButton(this.$deleteButton);
        this.createAddButton(this.$addButton);

        this._refreshScheduleList();
    };

    ScheduleManagementDialog.prototype.createDialogButtonBar = function ($parent) {
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);

        this.$okButton.val('Close');
        this.$cancelButton.css({ display: 'none' });
    };

    ScheduleManagementDialog.prototype.createAddButton = function ($self) {
        $self.jqxButton({ theme: Brightics.VA.Env.Theme });
        $self.click(_.debounce(this.openAddScheduleDialog.bind(this)));
    };

    ScheduleManagementDialog.prototype.openAddScheduleDialog = function () {
        var closeHandler = function (result) {
            if (result.OK) this._refreshScheduleList(); // TODO scheduleDAO.addSchedule();
        }.bind(this);

        new Brightics.VA.Core.Dialogs.AddScheduleDialog(this.$mainControl, {
            editorInput: this.options.editorInput,
            close: closeHandler,
            title: 'Add Schedule'
        });
    };

    ScheduleManagementDialog.prototype.createDeleteButton = function ($self) {
        $self.jqxButton({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        $self.click(_.debounce(this.openDeleteScheduleDialog.bind(this)));
    };

    ScheduleManagementDialog.prototype.openDeleteScheduleDialog = function (isSingle) {
        var closeHandler = function (result) {
            // TODO if(result.OK) this.scheduleDAO.deleteSchedules();
            if (result.OK) {
                var selectedRows = this.scheduleListComponent.getControl().getSelectedRows();
                var cnt = 0, schedules = [], _this = this;
                for (var i in selectedRows) {
                    $.ajax({
                        url: 'api/admin/v2/schedules/' + selectedRows[i].scheduleId + '/delete',
                        type: 'POST',
                        data: JSON.stringify(selectedRows[i]),
                        blocking: true,
                        contentType: 'application/json; charset=utf-8'
                    }).done(function (data) {
                        if (data.success) {
                            cnt++;
                        }
                        if (cnt === selectedRows.length) {
                            _this._refreshScheduleList();
                        }
                    }).fail(function (err) {
                        _this._onError(err);
                    });
                }
            }
        }.bind(this);

        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Selected item(s) will be permanently deleted and cannot be recovered. Are you sure?', closeHandler);
    };

    ScheduleManagementDialog.prototype.openDetailScheduleDialog = function (schedule) {
        var closeHandler = function (result) {
            if (result.OK) this._refreshScheduleList();
        }.bind(this);

        new Brightics.VA.Core.Dialogs.DetailScheduleDialog(this.$mainControl, {
            editorInput: this.options.editorInput,
            schedule: schedule,
            close: closeHandler,
            title: 'Schedule Detail'
        });
    };

    ScheduleManagementDialog.prototype._refreshScheduleList = function () {
        // TODO scheduleDAO.getSchedules();
        var sendAjax = function (option, doneCallback, failCallback) {
            return new Promise(function (resolve, reject) {
                $.ajax(option)
                    .done(function (result) {
                        if (doneCallback && typeof doneCallback === 'function') {
                            doneCallback(result);
                        }
                        resolve(result);
                    }).fail(function (err) {
                        if (failCallback && typeof failCallback === 'function') {
                            failCallback(err);
                        }
                        reject(err);
                    });
            });
        };
        sendAjax({
            url: 'api/admin/v2/schedules',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        }).then(function (scheduleList) {
            var modelScheduleList = _.filter(scheduleList, function (schedule) {
                var scheduleContents = JSON.parse(schedule.executeContents);
                return scheduleContents.main === this.options.editorInput.getFileId();
            }.bind(this));

            modelScheduleList = _.map(modelScheduleList, function (schedule) {
                var contents = JSON.parse(schedule.executeContents);
                var versionId;
                var mid;

                for (var key in contents.models) {
                    versionId = contents.models[key].versionId;
                    mid = contents.models[key].mid;
                }
                schedule.versionId = versionId;
                schedule.mid = mid;
                return schedule;
            });

            this.scheduleListComponent.update(modelScheduleList);
        }.bind(this))
            .catch(this._onError.bind(this));
    };

    ScheduleManagementDialog.prototype._refreshButtonStatus = function (eventType, data) {
        var selectedRows = this.scheduleListComponent.getControl().getSelectedRows();
        this.$deleteButton.jqxButton({ disabled: selectedRows.length <= 0 });
    };

    ScheduleManagementDialog.prototype._onError = function (err) {
        Utils.WidgetUtils.openBadRequestErrorDialog(err);
    };

    ScheduleManagementDialog.prototype.destroy = function () {
        this.scheduleListComponent.destroy();
        _super.destroy.call(this);
    };

    Brightics.VA.Core.Dialogs.ScheduleManagementDialog = ScheduleManagementDialog;

/* eslint-disable no-invalid-this */
}).call(this);
/* eslint-disable no-invalid-this */
