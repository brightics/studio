/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 31
 */
import { Resource } from './resource';
import { inherits } from '../../../../../../src/utils/inherits';

import { adjustVersion, migrate } from './adjust-vo';

/* global _ */

function Version(version) {
    this.data = version || {};
    if (this.data.contents) {
        adjustVersion(this.data);
        migrate(this.data.contents);
    } else {
        this.data.contents = {};
    }
}

inherits(Version, Resource);

Version.prototype.getVersionId = function () {
    return this.data.version_id;
};

Version.prototype.setVersionId = function (versionId) {
    this.data.version_id = versionId;
    this.data.contents.version_id = versionId;
    return this;
};

Version.prototype.getLabel = function () {
    return this.data.label;
};

Version.prototype.setLabel = function (label) {
    this.data.label = label;
    this.data.contents.title = label;
    return this;
};

Version.prototype.getDescription = function () {
    return this.data.description;
};

Version.prototype.setDescription = function (description) {
    this.data.description = description;
    return this;
};

Version.prototype.getFileId = function () {
    return this.data.file_id;
};

Version.prototype.setFileId = function (fileId) {
    this.data.file_id = fileId;
    this.data.contents.mid = fileId;
    return this;
};

Version.prototype.getMajorVersion = function () {
    return this.data.major_version;
};

Version.prototype.setMajorVersion = function (majorVersion) {
    this.data.major_version = majorVersion;
    return this;
};

Version.prototype.getMinorVersion = function () {
    return this.data.minor_version;
};

Version.prototype.setMinorVersion = function (minorVersion) {
    this.data.minor_version = minorVersion;
    return this;
};

Version.prototype.getVersion = function () {
    return this.data.major_version + '.' + this.data.minor_version;
};

Version.prototype.getType = function () {
    return this.data.type;
};

Version.prototype.setType = function (type) {
    this.data.type = type;
    return this;
};

Version.prototype.getTags = function () {
    return this.data.tags;
};

Version.prototype.setTags = function (tags) {
    this.data.tags = tags;
    return this;
};

Version.prototype.getModelImage = function () {
    return this.data.model_image;
};

Version.prototype.setModelImage = function (image) {
    this.data.image = image;
    return this;
};

Version.prototype.getUpdateTime = function () {
    return new Date(moment(this.data.update_time).format());
};

Version.prototype.setUpdateTime = function (time) {
    this.data.update_time = time;
    return this;
};

Version.prototype.getUpdater = function () {
    return this.data.updater;
};

Version.prototype.setUpdater = function (updater) {
    this.data.updater = updater;
    return this;
};

Version.prototype.getCreateTime = function () {
    return new Date(moment(this.data.create_time).format());
};

Version.prototype.setCreateTime = function (time) {
    this.data.create_time = time;
    return this;
};

Version.prototype.getCreator = function () {
    return this.data.creator;
};

Version.prototype.setCreator = function (creator) {
    this.data.creator = creator;
    return this;
};

Version.prototype.getContents = function () {
    return this.data.contents;
};

Version.prototype.setContents = function (contents) {
    this.data.contents = contents;
    adjustVersion(this.data);
    migrate(this.data.contents);
    return this;
};

Version.prototype.toJSON = function (all) {
    if (all) {
        return this.data;
    }
    return _.omit(this.data, [
        'isManual',
        'isMajor'
    ]);
};

Version.prototype.setIsMajor = function (val) {
    this.data.isMajor = val;
    return this;
};

Version.prototype.setIsManual = function (val) {
    this.data.isManual = val;
    return this;
};

Version.prototype.compareToByVersion = function (other) {
    if (this.getMajorVersion() !== other.getMajorVersion()) {
        return this.getMajorVersion() - other.getMajorVersion();
    }
    return this.getMinorVersion() - other.getMinorVersion();
};

Version.prototype.equals = function (that) {
    return this.getVersionId() === that.getVersionId() &&
        Number(this.getUpdateTime()) === Number(that.getUpdateTime());
};

Version.prototype.getHashCode = function () {
    return this.getVersionId();
};

Version.prototype.getResourceName = function () {
    return 'version';
};

export { Version };
