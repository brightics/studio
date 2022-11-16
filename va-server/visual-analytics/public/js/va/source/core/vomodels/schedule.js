/* -----------------------------------------------------
 *  schedule.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-12.
 * ----------------------------------------------------*/

import { Resource } from './resource';
import { inherits } from '../../../../../../src/utils/inherits';

function Schedule(data) {
    this.data = data || {};
}

inherits(Schedule, Resource);

Schedule.prototype.setCronExpression = function (cronExpression) {
    this.data.cronExpression = cronExpression;
    return this;
};

Schedule.prototype.getCronExpression = function () {
    return this.data.cronExpression;
};

Schedule.prototype.setDependencyId = function (dependencyId) {
    this.data.dependencyId = dependencyId;
    return this;
};

Schedule.prototype.getDependencyId = function () {
    return this.data.dependencyId;
};

Schedule.prototype.setExecuteContents = function (executeContents) {
    this.data.executeContents = executeContents;
    return this;
};

Schedule.prototype.getExecuteContents = function () {
    return this.data.executeContents;
};

Schedule.prototype.setFileId = function (fileId) {
    this.data.fileId = fileId;
    return this;
};

Schedule.prototype.getFileId = function () {
    return this.data.fileId;
};

Schedule.prototype.setIsActive = function (isActive) {
    this.data.isActive = isActive;
    return this;
};

Schedule.prototype.getIsActive = function () {
    return this.data.isActive;
};

Schedule.prototype.setJobId = function (jobId) {
    this.data.jobId = jobId;
    return this;
};

Schedule.prototype.getJobId = function () {
    return this.data.jobId;
};

Schedule.prototype.setLastResultStatus = function (lastResultStatus) {
    this.data.lastResultStatus = lastResultStatus;
    return this;
};

Schedule.prototype.getLastResultStatus = function () {
    return this.data.lastResultStatus;
};

Schedule.prototype.setModifyTime = function (modifyTime) {
    this.data.modifyTime = modifyTime;
    return this;
};

Schedule.prototype.getModifyTime = function () {
    return this.data.modifyTime;
};

Schedule.prototype.setModifyUser = function (modifyUser) {
    this.data.modifyUser = modifyUser;
    return this;
};

Schedule.prototype.getModifyUser = function () {
    return this.data.modifyUser;
};

Schedule.prototype.setProjectId = function (projectId) {
    this.data.projectId = projectId;
    return this;
};

Schedule.prototype.getProjectId = function () {
    return this.data.projectId;
};

Schedule.prototype.setReportContents = function (reportContents) {
    this.data.reportContents = reportContents;
    return this;
};

Schedule.prototype.getReportContents = function () {
    return this.data.reportContents;
};

Schedule.prototype.setScheduleEndTime = function (scheduleEndTime) {
    this.data.scheduleEndTime = scheduleEndTime;
    return this;
};

Schedule.prototype.getScheduleEndTime = function () {
    return this.data.scheduleEndTime;
};

Schedule.prototype.setScheduleId = function (scheduleId) {
    this.data.scheduleId = scheduleId;
    return this;
};

Schedule.prototype.getScheduleId = function () {
    return this.data.scheduleId;
};


Schedule.prototype.setScheduleName = function (scheduleName) {
    this.data.scheduleName = scheduleName;
    return this;
};

Schedule.prototype.getScheduleName = function () {
    return this.data.scheduleName;
};

Schedule.prototype.setNextTime = function (scheduleNextTime) {
    this.data.scheduleNextTime = scheduleNextTime;
    return this;
};

Schedule.prototype.getNextTime = function () {
    return this.data.scheduleNextTime;
};

Schedule.prototype.setOwner = function (owner) {
    this.data.scheduleOwner = owner;
    return this;
};

Schedule.prototype.getOwner = function () {
    return this.data.scheduleOwner;
};

Schedule.prototype.setStartTime = function (scheduleStartTime) {
    this.data.scheduleStartTime = scheduleStartTime;
    return this;
};

Schedule.prototype.getStartTime = function () {
    return this.data.scheduleStartTime;
};

Schedule.prototype.setScheduleStatus = function (status) {
    this.data.scheduleStatus = status;
    return this;
};

Schedule.prototype.getScheduleStatus = function () {
    return this.data.scheduleStatus;
};

Schedule.prototype.setScheduleType = function (type) {
    this.data.scheduleType = type;
    return this;
};

Schedule.prototype.getScheduleType = function () {
    return this.data.scheduleType;
};

Schedule.prototype.toJSON = function () {
    return this.data;
};

Schedule.prototype.equals = function (that) {
    return this.getScheduleId() == that.getScheduleId();
};

Schedule.prototype.getHashCode = function () {
    return this.getScheduleId();
};

