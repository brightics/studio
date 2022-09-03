/**
 * Created by SDS on 2017-06-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    function EditScheduleDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    EditScheduleDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    EditScheduleDialog.prototype.constructor = EditScheduleDialog;

    EditScheduleDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 685;
        this.dialogOptions.height = 435;
    };

    EditScheduleDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        var schedule = _this.options.schedule;

        $parent.append('' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Schedule Name</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-name-edit-input" valid-type="type2" maxlength="80"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Cron Expression</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-cron-edit-input" valid-type="cronType" maxlength="80"/>' +
            '   <div class="brtc-va-dialogs-schedule-cron-help"></div>' +
            '   <div class="brtc-va-dialogs-schedule-cron-checkbox">IMMEDIATE</div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Schedule Owner</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-owner-edit-input" valid-type="type1" maxlength="80"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Is Active</div>' +
            '   <div class="brtc-va-dialogs-schedule-active-edit-selector"></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Dependency Schedule</div>' +
            '   <div class="brtc-va-dialogs-schedule-dependency-selector"></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row brtc-style-margin-top-5">' +
            '   <div class="brtc-va-dialogs-schedule-label">Model Version</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-model-version-input" />' +
            '   <input type="button" class="brtc-va-dialogs-model-version-load" value="Add Version"/>' +
            '</div>' +
            '');

        this.$scheduleNameInput = $parent.find(".brtc-va-dialogs-schedule-name-edit-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        this.$scheduleNameInput.val(schedule.scheduleName);

        Utils.InputValidator.appendValidationCondition(this.$scheduleNameInput);

        this.$cronInput = $parent.find(".brtc-va-dialogs-schedule-cron-edit-input").jqxInput({
            theme: Brightics.VA.Env.Theme
        });
        this.$cronInput.val(schedule.cronExpression);

        Utils.InputValidator.appendValidationCondition(this.$cronInput);

        $(".brtc-va-dialogs-schedule-cron-help").on('click', function () {
            window.open('cron-expression', 'Brightics Cron Expression Help');
        });

        this.$chkimmediate = $parent.find(".brtc-va-dialogs-schedule-cron-checkbox").jqxCheckBox({
            theme: Brightics.VA.Env.Theme
        });
        this.$chkimmediate.on('change', function (event) {
            if (event.args.checked == true) {
                _this.$cronInput.jqxInput({
                    disabled: true,
                    value: 'IMMEDIATE'
                });
            } else {
                _this.$cronInput.jqxInput({
                    disabled: false,
                    value: ''
                });
            }
        });

        if (schedule.cronExpression === 'IMMEDIATE') {
            this.$cronInput.jqxInput({disabled: true});
            this.$chkimmediate.jqxCheckBox({checked: true});
        }

        this.$scheduleOwnerInput = $parent.find(".brtc-va-dialogs-schedule-owner-edit-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        this.$scheduleOwnerInput.val(schedule.scheduleOwner);

        this.$activeSelector = $parent.find(".brtc-va-dialogs-schedule-active-edit-selector").jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            source: ['Y', 'N']
        });
        this.$activeSelector.val(schedule.isActive);

        this.$dependencySelector = $parent.find(".brtc-va-dialogs-schedule-dependency-selector").jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            displayMember: 'scheduleName',
            valueMember: 'scheduleId',
            dropDownHeight: 300
        });

        this.$modelVersionInput = $parent.find(".brtc-va-dialogs-schedule-model-version-input").jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true,
            placeHolder: 'Select version'
        });

        this.$loadVersionButton = $parent.find('.brtc-va-dialogs-model-version-load');
        this.$loadVersionButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: 120,
            height: 27
        });

        this.$loadVersionButton.on('click', function () {
            _this.openSelectVersionDialog();
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

    EditScheduleDialog.prototype.getVersionInfo = function (executeContents) {
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

    EditScheduleDialog.prototype.openSelectVersionDialog = function () {
        var closeHandler = function (result) {
            if (result.OK) {
                var version = result.data;
                this.$modelVersionInput.val(version.getVersion());

                this.versionId = version.getVersion();
                this.versionContents = version.getContents();
            }
        }.bind(this);

        new Brightics.VA.Core.Dialogs.SelectVersionDialog(this.$mainControl, {
            projectId: this.options.editorInput.getProjectId(),
            fileId: this.options.editorInput.getFileId(),
            close: closeHandler
        })
    };

    EditScheduleDialog.prototype.addFileVersion = function (model, versionId) {
        model.versionId = versionId;
    };

    EditScheduleDialog.prototype.handleOkClicked = function () {
        var _this = this;

        var schedule = _this.options.schedule;

        if (_.trim(_this.$scheduleNameInput.val()) === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter schedule name.');
            $(".brtc-va-dialogs-schedule-name-edit-input").focus();
            return;
        }

        if (_.trim(_this.$cronInput.val()) === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter cron expression.');
            $(".brtc-va-dialogs-schedule-cron-edit-input").focus();
            return;
        }
        else {
            if (!$(".brtc-va-dialogs-schedule-cron-checkbox").jqxCheckBox('checked')) {
                var regExp = new RegExp('^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\/|\\,)(?:|\\d{4}))?)*))$');
                if (!regExp.test(_this.$cronInput.val())) {
                    Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Cron expression syntax error.');
                    $(".brtc-va-dialogs-schedule-cron-edit-input").focus();
                    return;
                }
            }
        }

        var mid = schedule.mid;

        var contents = schedule.executeContents,
            reportContents,
            duration,
            args;

        if (this.versionContents) {
            contents = $.extend(true, {}, Brightics.VA.Core.Utils.ModelUtils.exportAsRunnableFile(this.versionContents, mid, args, true, duration));

            for (var i in contents.models) {

                _this.addFileVersion(contents.models[i], this.versionId);

                for (var j in contents.models[i].functions) {
                    var fnUnit = contents.models[i].functions[j];
                    Brightics.VA.Core.Utils.ModelUtils.carvePersist(fnUnit, true);
                }
            }

            if (typeof contents.reports !== 'undefined' && Object.keys(contents.reports).length > 0) {
                reportContents = $.extend(true, {}, contents.reports);
                delete contents.reports;
            }

            contents = JSON.stringify(contents);
        }

        var scheduleInfo = {
            scheduleId: schedule.scheduleId,
            scheduleName: _this.$scheduleNameInput.val(),
            cronExpression: _this.$cronInput.val(),
            scheduleOwner: _this.$scheduleOwnerInput.val(),
            scheduleType: "JSON",
            executeContents: contents,
            reportContents: typeof reportContents !== 'undefined' ? JSON.stringify(reportContents) : null,
            fileId: schedule.fileId,
            projectId: schedule.projectId,
            isActive: _this.$activeSelector.val(),
            modifyUser: Brightics.VA.Env.Session.userId,
            dependencyId: _this.$dependencySelector.val()
        };

        var opt = {
            url: 'api/admin/v2/schedules/' + schedule.scheduleId + '/update',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            blocking: true,
            data: JSON.stringify(scheduleInfo)
        };
        $.ajax(opt).done(function () {
            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });
    };

    EditScheduleDialog.prototype.destroy = function () {
        this.$activeSelector.jqxDropDownList('destroy');
        this.$dependencySelector.jqxDropDownList('destroy');

        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this);
    };

    Brightics.VA.Core.Dialogs.EditScheduleDialog = EditScheduleDialog;

}).call(this);
