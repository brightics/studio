/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ImportProjectDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    ImportProjectDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ImportProjectDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-import-project">' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents"></div>' +
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

        var dialogOption = {
            theme: Brightics.VA.Env.Theme,
            title: Brightics.locale.common.importProject,
            width: 778,
            height: 500,
            modal: true,
            resizable: false,
            close: function () {
                if (typeof _this.options.close == 'function') {
                    _this.options.close(_this.dialogResult);
                }
            }
        };
        this.$mainControl.dialog(dialogOption);
    };

    ImportProjectDialog.prototype.initContents = function () {
        var _this = this;
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$okButton.click(_this.performFinish.bind(_this));
        _this.$cancelButton.click(_this.handleCancelClicked.bind(_this));
    };

    ImportProjectDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-label select-file">' + Brightics.locale.common.selectFile + '</div>' +
            '<div class="brtc-va-dialogs-select-file-control"></div>' +
            '<div class="brtc-va-dialogs-label name">' + Brightics.locale.common.name + '</div>' +
            '<input type="text" class="brtc-va-dialogs-name-input" maxlength="80"/>' +
            '<div class="brtc-va-dialogs-label description">' + Brightics.locale.common.description + '</div>' +
            '<div class="brtc-va-dialogs-description-container"></div>'
        );

        this.createSelectFileControl($parent.find('.brtc-va-dialogs-select-file-control'));
        this.createNameControl($parent.find('.brtc-va-dialogs-name-input'));
        this.createDescriptionControl($parent.find('.brtc-va-dialogs-description-container'));
    };

    ImportProjectDialog.prototype.createSelectFileControl = function ($parent) {
        var _this = this;

        $parent.append('' +
            '<div class="brtc-va-dialogs-dataupload-contents">' +
            '   <div class="brtc-va-dialogs-dataupload-contents-fileselectpage page import">' +
            '      <div class="fileselect">' +
            '          <div class="contents filename">' +
            '              <span class="nodata">' + Brightics.locale.common.selectfiletoupload + '</span>' +
            '          </div>' +
            '          <div class="header">' +
            '                  <input for="brtc-va-dialogs-dataupload-contents-fileselectpage-ex-filename open-model-button" type="button" id="fileselect-local" value="' + Brightics.locale.common.find + '" />' +
            '                  <input type="file" id="brtc-va-dialogs-dataupload-contents-fileselectpage-ex-filename" name="fileToUpload" accept=".json">' +
            '          </div>' +
            '      </div>' +
            '   </div>' +
            '</div>'
        );

        this.$fileSelectPage = $parent.find('.brtc-va-dialogs-dataupload-contents-fileselectpage');
        var $btnLocal = this.$fileSelectPage.find('#fileselect-local');
        var fileSelect = this.$fileSelectPage.find('#brtc-va-dialogs-dataupload-contents-fileselectpage-ex-filename');

        $btnLocal.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        $btnLocal.on('click', function () {
            fileSelect.click();
        });

        fileSelect.on('change', function (event) {
            _this.file = $(this)[0].files[0];
            _this.handleLocalFileSelected();
        });
        $btnLocal.focus();
        $btnLocal.attr('tabindex', '1');
        this.$fileSelectPage.find('.import-contents').perfectScrollbar();
    };

    ImportProjectDialog.prototype.createNameControl = function ($parent) {
        var _this = this;
        _this.$nameControl = $parent;
        _this.$nameControl.jqxInput({
            width: 618,
            height: 23,
            theme: Brightics.VA.Env.Theme
        });
        _this.$nameControl.attr('tabindex', '2');
    };

    ImportProjectDialog.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            focus: false,
            height: 208,
            description: '',
            okButton: this.$okButton,
            maxLength: 2000,
            toolbar: this.options.toolbar
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);
        $control.find('.note-editable.panel-body').attr('tabindex', '3');
        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
        });
    };

    ImportProjectDialog.prototype.reset = function () {
        this.file = '';
        this.fileName = '';
        this.data = [];
        $('input[type=file]').val('');
    };

    ImportProjectDialog.prototype.isJsonFile = function (fileName) {
        var fileNameArr = this.fileName.split('.');
        return (fileNameArr[fileNameArr.length - 1] == 'json');
    };

    ImportProjectDialog.prototype.handleLocalFileSelected = function () {
        var _this = this;
        this.fileName = this.file.name;
        if (!window.FileReader) {
            this.fileName = $(this).val().split('/').pop().split('\\').pop();
        }

        var $fileName = this.$fileSelectPage.find('.filename');
        $fileName.empty();
        $fileName.append($('' +
            '<span class="brtc-va-icon brtc-va-dialogs-dataupload file"></span>' +
            '<span class="brtc-va-dialogs-dataupload file-name"></span>'));
        $fileName.find('.brtc-va-dialogs-dataupload.file-name').text(_this.fileName);
        $fileName.find('.brtc-va-dialogs-dataupload.file-name').attr('title', _this.fileName);


        var rs = Studio.getResourceService();

        if (this.isJsonFile(this.fileName)) {
            try {
                var reader = new FileReader();
                reader.onloadend = function (evt) {
                    _this.reset();
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        try {
                            rs.validateExportedProjectSpec(JSON.parse(evt.target.result))
                                .then(function (res) {
                                    _this.data = res;
                                    _this.$nameControl.val(res.data.label || 'untitled');
                                    _this.noteControl.setValue(res.data.description || '');
                                })
                                .catch(function () {
                                    $fileName.empty();
                                    $fileName.append($('<span class="brtc-va-icon brtc-va-dialogs-dataupload error">File Type Error: Not a file that can be imported.</span>'));
                                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Invalid Project File.');
                                });
                        } catch (err) {
                            $fileName.empty();
                            $fileName.append($('<span class="brtc-va-icon brtc-va-dialogs-dataupload error">' + Brightics.locale.sentence.S0023 + '</span>'));
                            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Invalid Project(.json) File.');
                        }
                    } else {
                        _this.refresh();
                    }
                };
                reader.readAsText(this.file);
            } catch (err) {
                _this.refresh();
            }
        } else {
            $fileName.append($('<span class="brtc-va-icon brtc-va-dialogs-dataupload error">' + Brightics.locale.sentence.S0023 + '</span>'));
        }
    };

    ImportProjectDialog.prototype.refresh = function (status) {
        this.$fileSelectPage.find('.filename').empty();
    };

    ImportProjectDialog.prototype.performFinish = function () {
        var _this = this;

        if (this.$fileSelectPage.find('.nodata').length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(Brightics.locale.sentence.S0022, function () {
                _this.$fileSelectPage.find('#fileselect-local').focus();
            });
            return;
        }
        if (this.$fileSelectPage.find('.brtc-va-icon.brtc-va-dialogs-dataupload.error').length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please select valid model(.json) file.', function () {
                _this.$fileSelectPage.find('#fileselect-local').focus();
            });
            return;
        }
        if (_this.$nameControl.val().trim() === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(Brightics.locale.sentence.S0020, function () {
                _this.$nameControl.focus();
            });
            return;
        }
        if ($('<div>').append(this.noteControl.getCode()).text().length > 2000) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Description should be less than or equal to 2000 characters.');
            return;
        }

        var label = _this.$nameControl.val();
        var description = _this.noteControl.getCode() === '' ? '' : _this.noteControl.getCode();

        var rs = Studio.getResourceService();
        _this.data.data.label = label;
        _this.data.data.description = description;
        rs.importProject(_this.data)
            .then(function (projectId) {
                _this.dialogResult = {
                    OK: true,
                    Cancel: false,
                    projectId: projectId
                };
                _this.$mainControl.dialog('close');
            })
            .catch(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            });
    };

    ImportProjectDialog.prototype.handleCancelClicked = function () {
        this.dialogResult.OK = false;
        this.dialogResult.Cancel = true;

        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.ImportProjectDialog = ImportProjectDialog;

}).call(this);
