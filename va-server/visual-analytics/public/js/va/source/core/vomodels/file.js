/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 31
 */

import { adjustFile, migrate } from './adjust-vo';
import { Resource } from './resource';
import { inherits } from '../../../../../../src/utils/inherits';

function File(file) {
    this.data = file || {};
    if (this.data.update_time) {
        this.data.update_time = new Date(moment(this.data.update_time).format());
    }
    if (this.data.create_time) {
        this.data.create_time = new Date(moment(this.data.create_time).format());
    }
    if (this.data.contents) {
        adjustFile(this.data);
        migrate(this.data.contents);
    } else {
        this.data.contents = {};
    }
}

inherits(File, Resource);

File.prototype.getFileId = function () {
    return this.data.id;
};

File.prototype.setFileId = function (id) {
    this.data.id = id;
    this.data.contents.mid = id;
    return this;
};

File.prototype.getDescription = function () {
    return this.data.description;
};

File.prototype.setDescription = function (description) {
    this.data.description = description;
    return this;
};

File.prototype.getType = function () {
    return this.data.type;
};

File.prototype.setType = function (type) {
    this.data.type = type;
    return this;
};

File.prototype.getEventKey = function () {
    return this.data.event_key;
};

File.prototype.setEventKey = function (event_key) {
    this.data.event_key = event_key;
    return this;
};

File.prototype.getLabel = function () {
    return this.data.label;
};

File.prototype.setLabel = function (label) {
    this.data.label = label;
    this.data.contents.title = label;
    return this;
};

File.prototype.getProjectId = function () {
    return this.data.project_id;
};

File.prototype.setProjectId = function (projectId) {
    this.data.project_id = projectId;
    return this;
};

File.prototype.getUpdateTime = function () {
    return new Date(this.data.update_time);
};

File.prototype.setUpdateTime = function (time) {
    this.data.update_time = time;
    return this;
};

File.prototype.getCreateTime = function () {
    return new Date(this.data.create_time);
};

File.prototype.setCreateTime = function (time) {
    this.data.create_time = time;
    return this;
};

File.prototype.getUpdater = function () {
    return this.data.updater;
};

File.prototype.setUpdater = function (updater) {
    this.data.updater = updater;
    return this;
};

File.prototype.getCreator = function () {
    return this.data.creator;
};

File.prototype.setCreator = function (creator) {
    this.data.creator = creator;
    return this;
};

File.prototype.getFromVersion = function () {
    return this.data.from_version;
};

File.prototype.setFromVersion = function (fromVersion) {
    this.data.from_version = fromVersion;
    return this;
};

File.prototype.getModelImage = function () {
    return this.data.model_image;
};

File.prototype.setModelImage = function (image) {
    this.data.model_image = image;
    return this;
};

File.prototype.setContents = function (contents) {
    this.data.contents = contents;
    this.data.contents.title = this.data.label;
    adjustFile(this.data);
    migrate(this.data.contents);
    return this;
};

File.prototype.getContents = function (contents) {
    return this.data.contents;
};

File.prototype.toJSON = function () {
    return this.data;
};

File.prototype.getHashCode = function () {
    return this.getFileId();
};

File.prototype.equals = function (that) {
    return this.getFileId() == that.getFileId() &&
        this.getEventKey() == that.getEventKey() &&
        Number(this.getUpdateTime()) == Number(that.getUpdateTime());
};

File.prototype.getResourceName = function () {
    return 'file';
};

File.prototype.getInnerModels = function () {
    return this.data.contents.innerModels;
};

File.prototype.getInnerModel = function (mid) {
    if (this.data.contents.innerModels) {
        return this.data.contents.innerModels[mid];
    }
    return undefined;
};

File.prototype.getParam = function () {
    return this.data.contents.param;
};

File.prototype.setParam = function (paramKey, paramValue) {
    this.data.contents.param[paramKey] = paramValue;
};


export { File };
