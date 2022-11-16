/* -----------------------------------------------------
 *  export-files-spec.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-14.
 * ----------------------------------------------------*/

/* global _  */
import { CORE_VERSION } from '../../../../../../src/const/env';

function ExportFilesSpec(data) {
    this.data = [];

    if (data) {
        if (data instanceof Array) {
            this.data = this.data.concat(data);
        } else {
            this.data.push(data);
        }
    }
}

ExportFilesSpec.prototype.toJSON = function () {
    return {
        type: 'files',
        data: _.map(this.data, function (data) {
            return {
                type: data.getResourceName(),
                data: data.toJSON(true)
            };
        }),
        version: this.getCoreVersion()
    };
};

ExportFilesSpec.prototype.addFile = function (file) {
    this.data.push(file);
    return this;
};

ExportFilesSpec.prototype.addFiles = function (files) {
    this.data = this.data.concat(files);
    return this;
};

ExportFilesSpec.prototype.getFiles = function () {
    return this.data;
};

ExportFilesSpec.prototype.getCoreVersion = function () {
    return CORE_VERSION;
};

export { ExportFilesSpec };
