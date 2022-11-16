/* -----------------------------------------------------
 *  publish.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-12.
 * ----------------------------------------------------*/

import { Resource } from './resource';
import { inherits } from '../../../../../../src/utils/inherits';

function Publish(data) {
    this.data = data || {};
}

inherits(Publish, Resource);

Publish.prototype.setEmbedCode = function (embedCode) {
    this.data.embedCode = embedCode;
    return this;
};

Publish.prototype.getEmbedCode = function () {
    return this.data.embedCode;
};

Publish.prototype.setLink = function (link) {
    this.data.link = link;
    return this;
};

Publish.prototype.getLink = function () {
    return this.data.link;
};

Publish.prototype.setModelId = function (modelId) {
    this.data.modelId = modelId;
    return this;
};

Publish.prototype.getModelId = function () {
    return this.data.modelId;
};

Publish.prototype.setProjectId = function (projectId) {
    this.data.projectId = projectId;
    return this;
};

Publish.prototype.getProjectId = function () {
    return this.data.projectId;
};

Publish.prototype.setPublishId = function (publishId) {
    this.data.publishId = publishId;
    return this;
};

Publish.prototype.getPublishId = function () {
    return this.data.publishId;
};

Publish.prototype.setPublisher = function (publisher) {
    this.data.publisher = publisher;
    return this;
};

Publish.prototype.getPublisher = function () {
    return this.data.publisher;
};

Publish.prototype.setContents = function (contents) {
    this.data.publishing_contents = contents;
    return this;
};

Publish.prototype.getContents = function () {
    return this.data.publishing_contents;
};

Publish.prototype.setDate = function (date) {
    this.data.publishing_date = date;
    return this;
};

Publish.prototype.getDate = function () {
    return this.data.publishing_date;
};

Publish.prototype.setTitle = function (title) {
    this.data.publishing_title = title;
    return this;
};

Publish.prototype.getTitle = function () {
    return this.data.publishing_title;
};

Publish.prototype.setSchedule = function (schedule) {
    this.data.publishing_schedule = schedule;
    return this;
};

Publish.prototype.getSchedule = function () {
    return this.data.publishing_schedule;
};

Publish.prototype.toJSON = function (params) {
    return this.data;
};

Publish.prototype.equals = function (that) {
    return this.getPublishId() == that.getPublishId();
};

Publish.prototype.getHashCode = function () {
    return this.getPublishId();
};

export { Publish };
