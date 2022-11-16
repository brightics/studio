/**
 * Created by sds on 2018-02-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function OptDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    OptDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    OptDialog.prototype.constructor = OptDialog;

    OptDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 900;
        this.dialogOptions.height = 540;
        this.dialogOptions.keyboardCloseKey = '';
        this.dialogOptions.closeOnEscape = false;

        this.$elements = {};
        this.controls = {};
    };

    OptDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        this.$contentsArea = $parent;
        // this.options.method = 'dace',
        //     this.options.methodType = 'random';

        var url = 'api/va/v2/studio/optcontrol';
        var opt = {
            url: url,
            type: 'GET',
            data: {
                func: this.options.fnUnit.func,
                method: this.options.method
            },
            contentType: 'application/json; charset=utf-8',
            blocking: true
        };

        if (this.options.methodType) {
            opt.data.methodType = this.options.methodType;
        }

        $.ajax(opt).done(function (controlSpec) {
            var option = {
                controlSpec: controlSpec,
                fnUnit: _this.options.fnUnit,
                dataProxy: _this.options.dataProxy,
                modelEditor: _this.options.modelEditor,
                // hideIntableControl: true
            };
            _this.popupProperty = new Brightics.VA.Core.Functions.Library.optDialogBase.propertiesPanel($parent, option);
        });


    };

    OptDialog.prototype.handleOkClicked = function () {
        this.dialogResult.param = this.popupProperty.getParams();

        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    OptDialog.prototype.destroy = function () {
        this.popupProperty.destroy();
        this.$mainControl.dialog('destroy');
        this.$mainControl = undefined;
    };


    Brightics.VA.Core.Dialogs.OptDialog = OptDialog;

}).call(this);