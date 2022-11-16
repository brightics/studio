/**
 * Created by SDS on 2017-05-30.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    function AddScheduleDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    AddScheduleDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    AddScheduleDialog.prototype.constructor = AddScheduleDialog;

    AddScheduleDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 685;
        this.dialogOptions.height = 435;

        this.projectId = this.options.editorInput.getProjectId();
        this.fileId = this.options.editorInput.getFileId();
    };

    AddScheduleDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.append('' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Schedule Name</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-name-input" valid-type="type2" maxlength="80"/>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Cron Expression</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-cron-input" valid-type="cronType" maxlength="80"/>' +
            '   <div class="brtc-va-dialogs-schedule-cron-help"></div>' +
            '   <div class="brtc-va-dialogs-schedule-cron-checkbox">IMMEDIATE</div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-schedule-row">' +
            '   <div class="brtc-va-dialogs-schedule-label">Schedule Owner</div>' +
            '   <input type="text" class="brtc-va-dialogs-schedule-owner-input brtc-style-text-overflow-ellipsis" valid-type="type1" maxlength="80"/>' +
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
            '   <input type="button" class="brtc-va-dialogs-model-version-load" value="Select Version"/>' +
            '</div>' +
            '');

        this.$scheduleNameInput = $parent.find('.brtc-va-dialogs-schedule-name-input').jqxInput({
            theme: Brightics.VA.Env.Theme
        });

        Utils.InputValidator.appendValidationCondition(this.$scheduleNameInput);
        Brightics.VA.Core.Utils.WidgetUtils.setTrimInputControlOnFocusout($parent.find('.brtc-va-dialogs-schedule-name-input'));

        this.$cronInput = $parent.find('.brtc-va-dialogs-schedule-cron-input').jqxInput({
            theme: Brightics.VA.Env.Theme
        });

        Utils.InputValidator.appendValidationCondition(this.$cronInput);

        $('.brtc-va-dialogs-schedule-cron-help').on('click', function () {
            window.open('cron-expression', 'Brightics Cron Expression Help');
        });

        this.$chkimmediate = $parent.find('.brtc-va-dialogs-schedule-cron-checkbox').jqxCheckBox({
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

        this.$scheduleOwnerInput = $parent.find('.brtc-va-dialogs-schedule-owner-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true,
            value: Brightics.VA.Env.Session.userId
        });

        this.$activeSelector = $parent.find('.brtc-va-dialogs-schedule-active-selector').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            source: ['Y', 'N'],
            selectedIndex: 0
        });

        this.$dependencySelector = $parent.find('.brtc-va-dialogs-schedule-dependency-selector').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            displayMember: 'scheduleName',
            valueMember: 'scheduleId',
            placeHolder: 'Please Choose:',
            dropDownHeight: 300
        });

        this.$modelVersionInput = $parent.find('.brtc-va-dialogs-schedule-model-version-input').jqxInput({
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

        var getDependencies = function () {
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
            }).fail(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            });
        };

        var promises = [];

        promises.push(new Promise(function (resolve, reject) {
            getDependencies();
        }));

        Promise.all(promises).catch(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(error);
        }).then(function () {
        });

        _this.initData();
    };

    AddScheduleDialog.prototype.openSelectVersionDialog = function () {
        var closeHandler = function (result) {
            if (result.OK) {
                var version = result.data;
                this.$modelVersionInput.val(version.getVersion());

                this.versionId = version.getVersionId();
                this.versionContents = version.getContents();
            }
        }.bind(this);

        new Brightics.VA.Core.Dialogs.SelectVersionDialog(this.$mainControl, {
            projectId: this.projectId,
            fileId: this.fileId,
            close: closeHandler
        });
    };

    AddScheduleDialog.prototype.initData = function ($parent) {
        var _this = this;
        _this.fileList = {};

        var ResourceManager = Studio.getResourceManager();
        ResourceManager.fetchProjects()
            .then(function (data) {
                $.each(data, function (idx, project) {
                    if (project.getProjectId() === _this.options.editorInput.getProjectId()) {
                        _this.projectLabel = project.getLabel();
                    }
                });

                _this.fileList[_this.options.editorInput.getProjectId()] = {};
                return ResourceManager.fetchFiles(_this.options.editorInput.getProjectId())
                    .then(function (data) {
                        $.each(data, function (idx, model) {
                            _this.fileList[_this.options.editorInput.getProjectId()][model.getFileId()] = model;
                        });
                        return true;
                    });
            })
            .catch(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            });
    };

    AddScheduleDialog.prototype.handleOkClicked = function () {
        var _this = this;

        if (_this.$scheduleNameInput.val() === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter schedule name.');
            $('.brtc-va-dialogs-schedule-name-input').focus();
            return;
        }

        if (_this.$modelVersionInput.val() === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please select model version.');
            return;
        }

        if (_.trim(_this.$cronInput.val()) === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter cron expression.');
            $('.brtc-va-dialogs-schedule-cron-input').focus();
            return;
        } else {
            if (!$('.brtc-va-dialogs-schedule-cron-checkbox').jqxCheckBox('checked')) {
                var regExp = new RegExp('^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\/|\\,)(?:|\\d{4}))?)*))$');
                if (!regExp.test(_this.$cronInput.val())) {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Syntax error in cron expression.');
                    $('.brtc-va-dialogs-schedule-cron-input').focus();
                    return;
                }
            }
        }

        _this.modelDBContents = this.options.editorInput.getContents();

        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                Brightics.VA.Core.Utils.RunnableFactory
                    .createForFlow(_this.versionContents, undefined, undefined, dialogResult.args)
                    .then(function (runnable) {
                        var contents = _.merge(runnable, {duration: dialogResult.duration});
                        _.forIn(contents.models, function (model) {
                            _.forEach(model.functions, function (fnUnit) {
                                Brightics.VA.Core.Utils.ModelUtils.carvePersist(fnUnit, true);
                            });
                        });
                        // get out of here.
                        delete contents.report;
                        var scheduleInfo = {
                            scheduleId: Brightics.VA.Core.Utils.IDGenerator.schedule.id(),
                            scheduleName: _this.$scheduleNameInput.val(),
                            cronExpression: _this.$cronInput.val(),
                            scheduleOwner: Brightics.VA.Env.Session.userId,
                            scheduleType: 'JSON',
                            executeContents: JSON.stringify(contents),
                            fileId: _this.options.editorInput.getLabel(),
                            projectId: _this.projectLabel,
                            isActive: _this.$activeSelector.val(),
                            modifyUser: Brightics.VA.Env.Session.userId,
                            dependencyId: _this.$dependencySelector.val()
                        };

                        var opt = {
                            url: 'api/admin/v2/schedules',
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(scheduleInfo),
                            blocking: true
                        };
                        $.ajax(opt).done(function () {
                            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
                        }).fail(function (error) {
                            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
                        });
                    });
            }
        };

        if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true' &&
                _this.modelDBContents.type === 'data' &&
                _this.modelDBContents.hasOwnProperty('variables')) {
            if (Object.keys(_this.modelDBContents.variables).length > 0) {
                new Brightics.VA.Core.Dialogs.RunDataDialog(_this.$parent, {
                    close: closeHandler,
                    analyticsModel: _this.modelDBContents
                });
            } else {
                closeHandler({OK: true});
            }
        } else {
            closeHandler({OK: true});
        }
    };

    AddScheduleDialog.prototype.destroy = function () {
        this.$activeSelector.jqxDropDownList('destroy');
        this.$dependencySelector.jqxDropDownList('destroy');

        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this);
    };

    Brightics.VA.Core.Dialogs.AddScheduleDialog = AddScheduleDialog;
}).call(this);
