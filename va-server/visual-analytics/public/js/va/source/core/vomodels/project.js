/* -----------------------------------------------------
 *  project.js
 *  Created by hyunseok.oh@samsung.com on 2018-01-31.
 * ----------------------------------------------------*/

import { Resource } from './resource';
import { inherits } from '../../../../../../src/utils/inherits';

function Project(prj) {
    this.data = prj || {};
}

inherits(Project, Resource);

Project.prototype.getProjectId = function () {
    return this.data.id;
};

Project.prototype.setProjectId = function (id) {
    this.data.id = id;
    return this;
};

Project.prototype.getLabel = function () {
    return this.data.label;
};

Project.prototype.setLabel = function (label) {
    this.data.label = label;
    return this;
};

Project.prototype.getUpdateTime = function () {
    return new Date(moment(this.data.update_time).format());
};

Project.prototype.setUpdateTime = function (time) {
    this.data.update_time = time;
    return this;
};

Project.prototype.getCreateTime = function () {
    return new Date(moment(this.data.create_time).format());
};

Project.prototype.setCreateTime = function (time) {
    this.data.create_time = time;
    return this;
};

Project.prototype.getCreator = function () {
    return this.data.creator;
};

Project.prototype.setCreator = function (creator) {
    this.data.creator = creator;
    return this;
};

Project.prototype.getUpdater = function () {
    return this.data.updater;
};

Project.prototype.setUpdater = function (updater) {
    this.data.updater = updater;
    return this;
};

Project.prototype.getDescription = function () {
    return this.data.description;
};

Project.prototype.setDescription = function (description) {
    this.data.description = description;
    return this;
};

Project.prototype.getModelCount = function () {
    return parseInt(this.data.model_count);
};

Project.prototype.setModelCount = function (count) {
    this.data.model_count = count;
    return this;
};

Project.prototype.getReportCount = function () {
    return parseInt(this.data.report_count);
};

Project.prototype.setReportCount = function (count) {
    this.data.report_count = count;
    return this;
};

Project.prototype.getTag = function () {
    return this.data.tag;
};

Project.prototype.setTag = function (tag) {
    this.data.tag = tag;
    return this;
};

Project.prototype.getType = function () {
    return this.data.type;
};

Project.prototype.setType = function (type) {
    this.data.type = type;
    return this;
};

Project.prototype.toJSON = function () {
    return this.data;
};

Project.prototype.equals = function (that) {
    return this.getProjectId() == that.getProjectId() &&
        Number(this.getUpdateTime()) == Number(that.getUpdateTime());
};

Project.prototype.getHashCode = function () {
    return this.getProjectId();
};

Project.prototype.getResourceName = function () {
    return 'project';
};

export { Project };
