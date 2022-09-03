/**
 * Created by minkyung.kim on 2017-05-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ScheduleDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    ScheduleDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ScheduleDialog.prototype.constructor = ScheduleDialog;

    ScheduleDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 908;
        this.dialogOptions.height = 295;
    };

    ScheduleDialog.prototype.createDialogContentsArea = function ($parent) {
        var $mainContainer = $('<div class="brtc-va-dialogs-datasource-schedule-grid brtc-style-dialogs-grid-transparent-border"></div>');
        $parent.append($mainContainer);

        this.createGrid($parent.find('.brtc-va-dialogs-datasource-schedule-grid'));
    };

    ScheduleDialog.prototype.createGrid = function ($parent) {
        var _this = this;

        this.setOptions();
        this.renderGrid($parent);
    };

    ScheduleDialog.prototype.renderGrid = function ($parent) {
        if (this.isEmpty()) {
            this.createEmptyControl('There is no item linked schedule');
        } else {
            this.createHeader($parent);
            this.createBody($parent);
        }
    };

    ScheduleDialog.prototype.setOptions = function ($parent, options) {
        this.headerOptions = {
            totalCount: '',
            col1: 'col1',
            col2: 'col2'
        };
    };

    ScheduleDialog.prototype.isEmpty = function () {
        return false;
    };

    ScheduleDialog.prototype.createHeader = function ($parent) {
        var $header = $('<div class="brtc-va-dialogs-schedule-grid-header"></div>');

        if (this.headerOptions.totalCount) {
            var $totalCount = $('' +
                '<div class="brtc-va-dialogs-schedule-grid-header-count">' +
                '   <div class="brtc-va-dialogs-schedule-grid-header-count-label">Total Data Source</div>' +
                '   <div class="brtc-va-dialogs-schedule-grid-header-count-value">' + this.headerOptions.totalCount + '</div>' +
                '</div>' +
                '');
            $header.append($totalCount);
        }
        if (this.headerOptions.col1) {
            var $col1 = $('' +
                '<div class="brtc-va-dialogs-schedule-grid-header-col1">' +
                '   <div class="schedule-label"></div>' +
                '</div>' +
                '');
            $col1.find('.schedule-label').text(this.headerOptions.col1);
            $header.append($col1);
        }
        if (this.headerOptions.col2) {
            var $col2 = $('' +
                '<div class="brtc-va-dialogs-schedule-grid-header-col2">' +
                '   <div class="schedule-label"></div>' +
                '   <div class="brtc-va-dialogs-schedule-icon-help" title="Schedule Name (Cron Expression , Owner)"></div>' +
                '</div>' +
                '');
            $col2.find('.schedule-label').text(this.headerOptions.col2);
            $header.append($col2);
        }

        $parent.append($header);
    };

    ScheduleDialog.prototype.createBody = function ($parent) {

    };

    ScheduleDialog.prototype.craeteMainRow = function ($parent) {
        var $mainRow = $('' +
            '<div class="brtc-va-dialogs-schedule-grid-row-main">' +
            '   <div class="brtc-va-dialogs-schedule-grid-row-main-col1 col1"></div>' +
            '   <div class="brtc-va-dialogs-schedule-grid-row-main-col2 col2"></div>' +
            '</div>' +
            '');

        $parent.append($mainRow);

        return $mainRow;
    };

    ScheduleDialog.prototype.craeteSubRow = function ($parent) {
        var $subRow = $('' +
            '<div class="brtc-va-dialogs-schedule-grid-row-sub">' +
            '   <div class="brtc-va-dialogs-schedule-grid-row-sub-col1 col1"></div>' +
            '   <div class="brtc-va-dialogs-schedule-grid-row-sub-col2 col2"></div>' +
            '</div>' +
            '');

        $parent.append($subRow);

        return $subRow;
    };

    ScheduleDialog.prototype.makeLinkScheduleAndTable = function (scheduleData, tableList) {
        var linkTable = {};

        for (var i in scheduleData) {
            var execContents = JSON.parse(scheduleData[i].executeContents);
            var models = execContents.models;

            for (var mIndex in models) {
                if (models[mIndex].type != 'data') continue;
                var functions = models[mIndex].functions;

                for (var fIndex in functions) {
                    var func = functions[fIndex];

                    for (var outTableIndex in func[OUT_DATA]) {
                        var tableId = func[OUT_DATA][outTableIndex];
                        if (tableList.indexOf(tableId) > -1) {
                            if (!linkTable[tableId]) {
                                linkTable[tableId] = [];
                            }
                            linkTable[tableId].push(scheduleData[i]);
                        }
                    }
                }
            }
        }
        return linkTable;
    };

    ScheduleDialog.prototype.makeScheduleList = function (tableId) {
        var scheduleList = [{label: 'None Schedule', value: ''}];

        for (var i in this.linkTable[tableId]) {
            var scheduleId = this.linkTable[tableId][i].scheduleId,
                scheduleName = this.linkTable[tableId][i].scheduleName,
                cronExpression = this.linkTable[tableId][i].cronExpression,
                scheduleOwner = this.linkTable[tableId][i].scheduleOwner;

            scheduleList.push({
                    label: scheduleName + ' (' + cronExpression + ', ' + scheduleOwner + ')',
                    value: scheduleId
                }
            );
        }

        return scheduleList;
    };

    ScheduleDialog.prototype.getSchedule = function (callback, tableList) {
        var _this = this;
        var option = {
            url: 'api/va/v2/schedules',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        };
        $.ajax(option).done(function (scheduleData) {
            callback(scheduleData, tableList);
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    Brightics.VA.Implementation.Visual.Dialogs.ScheduleDialog = ScheduleDialog;

}).call(this);
