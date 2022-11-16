(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    function ImportUDFDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    ImportUDFDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ImportUDFDialog.prototype.constructor = ImportUDFDialog;

    ImportUDFDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 760;
        this.dialogOptions.height = 300;
    };

    ImportUDFDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.addClass('brtc-va-dialogs-import-udf-contents');

        $parent.append('' +
            '<div class="fileselect">' +
            '       <div class="header">' +
            '           <span>File</span>' +
            '               <input for="brtc-va-wizardpage-dataupload-contents-fileselectpage-ex-filename" type="button" id="fileselect-local" value="Local" />' +
            '               <input type="file" id="brtc-va-wizardpage-dataupload-contents-fileselectpage-ex-filename" name="fileToUpload" accept=".json">' +
            '       </div>' +
            '       <div class="contents filename">' +
            '           <span class="nodata">Select file to upload</span>' +
            '       </div>' +
            '</div>');

        var $btnLocal = $parent.find('#fileselect-local');
        var fileSelect = $parent.find('#brtc-va-wizardpage-dataupload-contents-fileselectpage-ex-filename');
        fileSelect.on('change', function (event) {
            var reader = new FileReader();
            var file = $(this)[0].files[0]
            reader.onloadend = function (event) {
                var data = {};
                data = JSON.parse(event.target.result);
                _this.data = data;
                var fileName = $parent.find('.filename');
                fileName.empty();
                if(typeof _this.data === 'object' &&
                    _this.data.hasOwnProperty('script') &&
                    _this.data.hasOwnProperty('specJson') &&
                    (_this.data.specJson.name === 'UDF' || _this.data.specJson.name === 'DistributedJdbcLoader') &&
                    _this.data.script.content !== '' &&
                    _this.data.script.type !== '') {

                    fileName.append($('' +
                        '<span class="brtc-va-icon brtc-va-wizardpage-dataupload file"></span>' +
                        '<span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(file.name) + '</span>'));
                    _this.configureOkButton();
                }
                else {
                    _this.data = {specJson:{}};
                    fileName.append($('' +
                        '<span class="nodata">Select file to upload</span>'));
                    _this.configureOkButton();
                    Utils.WidgetUtils.openInformationDialog('Check your JSON file');
                }
            };
            reader.readAsText(file);
        });

        $btnLocal.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        $btnLocal.on('click', function () {
            fileSelect.click();
        });
    };

    ImportUDFDialog.prototype.handleOkClicked = function () {
        var funcId =  Utils.IDGenerator.uuid.id(16);
        var scriptId = 'udf' + '_script' + Utils.IDGenerator.uuid.id(16);
        var _this = this;
        this.data.id = funcId;
        this.data.specJson.scriptId = scriptId;
        var opt = {
            type: 'POST',
            url: 'api/va/v3/ws/udfs',
            data: JSON.stringify(this.data),
            contentType: 'application/json; charset=utf-8'
        };
        $.ajax(opt).done(function (data) {
            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
        }).fail(function (err) {
            Brightics.VA.Dialogs.Dialog.prototype.handleCancelClicked.call(_this);
        });
    };

    ImportUDFDialog.prototype.configureOkButton = function () {
        if (JSON.stringify(this.data) === JSON.stringify({specJson:{}})) {
            this.$okButton.jqxButton({ disabled: true });
        } else {
            this.$okButton.jqxButton({ disabled: false });
        }
    };

    Brightics.VA.Core.Dialogs.ImportUDFDialog = ImportUDFDialog;

}).call(this);
