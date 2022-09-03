/**
 * sungjin1.kim@samsung.com
 * 2018. 02. 08
 */

/* global _ */
(function () {
    'use strict';
    var Brightics = this.Brightics;

    /**
     * 주의: ScheduleList안에서 Schedule Data를 직접 바꾸지 않도록 해야 함 (카피해서 쓰기)
     */
    function ScheduleList(opt) {
        this.$el = opt.$el;
        this.onItemClick = opt.onItemClick;
        this.$self = $('<div class="brtc-va-schedule-list-grid"></div>');
        this.emitter = opt.emitter;

        this.columnOptions = [
            {
                name: 'Schedule Name',
                key: 'scheduleName',
                type: 'string',
                headerAlign: 'center',
                dataAlign: 'left',
                width: 'auto'
            },
            {
                name: 'Cron Expression',
                key: 'cronExpression',
                type: 'string',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 'auto'
            },
            {
                name: 'Start Time',
                key: 'scheduleStartTime',
                type: 'date',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 150
            },
            {
                name: 'End Time',
                key: 'scheduleEndTime',
                type: 'date',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 150
            },
            {
                name: 'Next Time',
                key: 'scheduleNextTime',
                type: 'date',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 150
            },
            {
                name: 'Schedule Owner',
                key: 'scheduleOwner',
                type: 'string',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 'auto'
            },
            {
                name: 'Is Active',
                key: 'isActive',
                type: 'string',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 90
            }
        ];

        this._initOptions();
        this.baseList = this._createList(this.$self);
        this.$el.append(this.$self);
        this.data = [];
    }

    ScheduleList.prototype.update = function (_data) {
        this.data = _.clone(_data);
        this.data.sort(function (a, b) {
            return b.create_time - a.crete_time;
        });
        this.baseList.update(this.data);
    };

    ScheduleList.prototype._initOptions = function () {
    };

    ScheduleList.prototype._createList = function ($parent) {
        return new Brightics.VA.Controls.ControlFactory.createListControl($parent, {
            width: '100%',
            height: 'calc(100% - 35px)',
            columns: this.columnOptions,
            selectable: true
        })
            .on('cell-click', _.debounce(function (evt) {
                this.emitter.emit('row-click', evt.data);
            }.bind(this), 300))
            .on('row-select', _.debounce(function (evt) {
                this.emitter.emit('row-select', evt.data);
            }.bind(this), 300))
            .on('row-unselect', _.debounce(function (evt) {
                this.emitter.emit('row-unselect', evt.data);
            }.bind(this), 300))
            .render();
    };

    ScheduleList.prototype.getControl = function () {
        return this.baseList;
    };

    ScheduleList.prototype.destroy = function () {
        this.baseList.destroy();
    };

    Brightics.VA.Core.Components.ScheduleList = ScheduleList;
    /* eslint-disable no-invalid-this */
}.call(this));
