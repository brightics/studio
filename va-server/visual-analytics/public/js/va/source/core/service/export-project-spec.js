
/* -----------------------------------------------------
 *  export-files-spec.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-14.
 * ----------------------------------------------------*/

/* global _ */
import { CORE_VERSION } from '../../../../../../src/const/env';

function ExportProjectSpec(project, children) {
    this.project = {};
    this.children = [];

    if (project) {
        this.project = project;
    }

    if (children && children instanceof Array) {
        this.children = this.children.concat(children);
    }
}

ExportProjectSpec.prototype.toJSON = function () {
    return {
        type: 'project',
        data: this.project.toJSON(),
        children: _.map(this.children, function (r) {
            return {
                type: r.getResourceName(),
                data: r.toJSON()
            };
        }),
        version: this.getCoreVersion()
    };
};

ExportProjectSpec.prototype.setProject = function (project) {
    this.project = project;
    return this;
};

ExportProjectSpec.prototype.addFile = function (file) {
    this.children.add(file);
    return this;
};

ExportProjectSpec.prototype.addFiles = function (files) {
    this.children = this.children.concat(files);
    return this;
};

ExportProjectSpec.prototype.getProject = function () {
    return this.project;
};

ExportProjectSpec.prototype.getFiles = function () {
    return this.children;
};

ExportProjectSpec.prototype.getCoreVersion = function () {
    return CORE_VERSION;
};

export { ExportProjectSpec };
