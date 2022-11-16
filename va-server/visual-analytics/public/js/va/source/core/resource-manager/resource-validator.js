
function ResourceValidator() {
    this.validateVersion = {
        '3.5': this.validateVersion3_5,
        '3.6': this.validateVersion3_5
    };
}

ResourceValidator.prototype.getValidateFunction = function (version) {
    var validate = this.validateVersion[version];
    return (validate) ? (validate) : (this.validateLegacy);
};

ResourceValidator.prototype.validate = function (file, fileType) {
    var validate = this.getValidateFunction(file.version);
    return validate(file, fileType);
};

ResourceValidator.prototype.validateLegacy = function (file, fileType) {
    var message = 'Invalid Model File.';
    var runnableMessage = 'Runnable Model File.';
    var errorMessage = '';

    var exportable = [
        'data',
        'control',
        'visual',
        'deeplearning'
    ];
    if (fileType === 'Report') {
        message = 'Invalid Report File.';
    }
    try {
        if (file instanceof Array) {
            let reportFiles = false;
            for (const f of file) {
                if (typeof f.mid === 'undefined' || exportable.indexOf(f.type) === -1) {
                    errorMessage = message;
                    break;
                } else if (f.type === 'visual') {
                    reportFiles = true;
                }
            }
            if (fileType === 'Report' && !reportFiles) {
                errorMessage = message;
            } else if (fileType === 'Model' && reportFiles) {
                errorMessage = message;
            }
        } else {
            if (typeof file.mid === 'undefined') {
                if (file.jid) {
                    errorMessage = runnableMessage;
                } else {
                    errorMessage = message;
                }
            } else if ((fileType === 'Report' && file.type !== 'visual') ||
                       (fileType === 'Model' && file.type === 'visual')) {
                errorMessage = message;
            } else if (exportable.indexOf(file.type) === -1) {
                errorMessage = message;
            }
        }
        return errorMessage;
    } catch (err) {
        return 'Invalid Model(.json) File.';
    }
};

ResourceValidator.prototype.validateVersion3_5 = function (file, fileType) {
    var message = 'Invalid Model File.';
    var runnableMessage = 'Runnable Model File.';
    var projectMessage = 'Project File.';
    var errorMessage = '';
    if (file.main && file.models) {
        errorMessage = runnableMessage;
    } else if (file.data.length === 0) {
        errorMessage = message;
    } else if (file.type === 'project') {
        errorMessage = projectMessage;
    }
    return errorMessage;
};

var resourceValidator = new ResourceValidator();

export {resourceValidator as ResourceValidator};
