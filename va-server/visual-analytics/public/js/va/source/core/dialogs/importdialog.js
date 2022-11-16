/**
 * Created by daewon77.park on 2016-03-24.
 */

/* global _, Studio */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ImportDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.modelData = {};

        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    ImportDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ImportDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-newfiledialog import">' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents import">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="' + Brightics.locale.common.ok + '"/>' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="' + Brightics.locale.common.cancel + '"/>' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        var _this = this;

        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: this.options.fileType === 'Report' ? Brightics.locale.common.importReport : Brightics.locale.common.importModel,
            width: 778,
            height: 500,
            modal: true,
            resizable: false,
            close: function () {
                if (typeof _this.options.close === 'function') {
                    _this.options.close(_this.dialogResult);
                }
            }
        };
        this.$mainControl.dialog(jqxOpt);
    };

    ImportDialog.prototype.initContents = function () {
        var _this = this;
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        _this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$okButton.click(_this.performFinish.bind(_this));
        _this.$cancelButton.click(_this.handleCancelClicked.bind(_this));
    };

    ImportDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        $parent.append('' +
            '<div class="brtc-va-dialogs-newfiledialog-label import"></div>'
        );

        var $upload = $parent.find('.brtc-va-dialogs-newfiledialog-label.import');
        $upload.css({
            'width': '100%',
            'height': '100%',
            'overflow': 'hidden'
        });

        this.fileList = new Brightics.VA.Core.Widget.Controls.FileList($upload, {
            multiple: true
        });

        $upload.on('addFile', function (e, files, omitted) {
            _this.makeModelData(files, omitted);
        });
        $upload.on('removeFile', function (e, keys) {
            for (var i in keys) {
                delete _this.modelData[keys[i]];
            }
            _this.configureOkButton();
        });
    };

    ImportDialog.prototype.configureOkButton = function () {
        var gridKeys = Object.keys(this.fileList.getFiles());
        var modelKeys = Object.keys(this.modelData);

        if (gridKeys.length > 0) {
            if (gridKeys.length == modelKeys.length) {
                this.$okButton.jqxButton({disabled: false});
            } else {
                this.$okButton.jqxButton({disabled: true});
            }
        } else {
            this.$okButton.jqxButton({disabled: true});
        }
    };

    ImportDialog.prototype.makeModelData = function (files, omitted) {
        var _this = this;
        var promises = [];

        var promiseFunc = function (resolve, reject) {
            _this.handleLocalFileSelected(key, files[key], omitted, resolve);
        };

        for (var key in files) {
            var promise = new Promise(promiseFunc);
            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            _this.configureOkButton();
        }, function (error) {
        });
    };

    ImportDialog.prototype.handleLocalFileSelected = function (fileKey, file, omitted, resolve) {
        var _this = this;

        var rt = {
            model: {},
            errorMessage: ''
        };

        try {
            var reader = new FileReader();
            if (!omitted[fileKey]) {
                reader.onloadend = function (evt) {
                    var modelData = {};
                    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                        try {
                            modelData = JSON.parse(evt.target.result);
                        }
                        catch (err) {
                            rt.errorMessage = 'Invalid Model(.json) File.';
                            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Invalid Model(.json) File.');
                        }
                        rt.errorMessage = _this.options.resourceManager.validateFile(modelData, _this.options.fileType);
                    } else {
                        rt.errorMessage = 'Invalid Model(.json) File.';
                    }
                    if (rt.errorMessage) {
                        _this.fileList.setDisableFile(fileKey, rt.errorMessage);
                        Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(rt.errorMessage);
                    } else {
                        _this.modelData[fileKey] = modelData;
                    }

                    resolve();
                };
                reader.readAsText(file);
            } else {
                rt.errorMessage = 'Omitted for duplicate.';
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(rt.errorMessage);
            }
        } catch (err) {
            rt.errorMessage = 'Only JSON file can be imported.';

            _this.fileList.setDisableFile(file.fileKey, rt.errorMessage);

            resolve();
        }
    };

    ImportDialog.prototype.createFileContents = function (mid, modelData) {
        var contents = Brightics.VA.Core.Utils.ModelUtils.cloneModel(modelData);
        contents.mid = mid;

        return contents;
    };

    ImportDialog.prototype.getFileNameByMid = function (mid) {
        var _this = this;
        var files = this.fileList.getFiles();
        return _.chain(files)
            .filter(function (file, key) {
                var model = _this.modelData[key];
                return model && model.mid === mid;
            })
            .map('name')
            .value();
    };

    ImportDialog.prototype.performFinish = function () {
        var _this = this;
        var doneCallback = function () {
            this.dialogResult = {
                OK: true,
                Cancel: false,
                selectedFiles: []
            };

            this.$mainControl.dialog('close');
        }.bind(this);

        var errorCallback = function (error) {
            error.responseJSON.errors[0].message +=
                ' (' + _this.getFileNameByMid(error.responseJSON.errors[0].mid).join(', ') + ')';
            delete error.responseJSON.errors[0].detailMessage;
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        };

        Studio.getResourceService()
            .importJSONs(_.toArray(this.modelData), this.options.project.getProjectId())
            .then(doneCallback)
            .catch(errorCallback);
    };

    ImportDialog.prototype.handleCancelClicked = function () {
        this.dialogResult.OK = false;
        this.dialogResult.Cancel = true;

        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.ImportDialog = ImportDialog;
}).call(this);
