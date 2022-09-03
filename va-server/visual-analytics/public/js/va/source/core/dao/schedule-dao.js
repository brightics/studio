/* -----------------------------------------------------
 *  schedule-dao.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-12.
 * ----------------------------------------------------*/

import { ajaxGet, ajaxPost } from '../../../../../../src/utils/ajax2promise';
import { Schedule } from '../vomodels/schedule';

/* global _ */

const transform = function (data) {
    return new Schedule(data);
};

const transformEach = function (data) {
    return _.map(data, transform);
};

const ScheduleDao = (function () {
    const getSchedules = function () {
        const url = 'api/admin/v2/schedules';
        return ajaxGet(url).then(transformEach);
    };

    const getSchedule = function (scheduleId) {
        const url = 'api/admin/v2/schedules/' + scheduleId;
        return ajaxGet(url).then(function (data) {
            return data.length ? transform(data[0]) : null;
        });
    };

    const addSchedule = function (schedule) {
        const url = 'api/admin/v2/schedules/';
        return ajaxPost(url, schedule.toJSON()).then(function () {
            return schedule;
        });
    };

    const updateSchedule = function (schedule) {
        const url = 'api/admin/v2/schedules/' + schedule.getScheduleId() + '/update';
        return ajaxPost(url, schedule.toJSON()).then(function () {
            return schedule;
        });
    };

    const deleteSchedule = function (scheduleId) {
        const url = 'api/admin/v2/schedules/' + scheduleId + '/delete';
        return ajaxPost(url);
    };

    return {
        getSchedules: getSchedules,
        getSchedule: getSchedule,
        addSchedule: addSchedule,
        updateSchedule: updateSchedule,
        deleteSchedule: deleteSchedule
    };
}());


export { ScheduleDao };
