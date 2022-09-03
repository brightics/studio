/**
 * 2017-12-13
 * hyunseok.oh@samsung.com
 */

(function () {
    'use strict';

    var Brightics = this.Brightics;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    /**
     * @extends Dialog
     * @param {*} parentId
     * @param {Object} options
     */
    function SelectVersionDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
        this.onSelect = options.onSelect;
        this.emitter = options.emitter;
    }

    SelectVersionDialog.prototype = Object.create(_super);
    SelectVersionDialog.prototype.constructor = SelectVersionDialog;

    SelectVersionDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);

        this.dialogOptions.title = 'Version List';
        this.dialogOptions.width = 1000;
        this.dialogOptions.height = 'auto';
        this.dialogOptions.maxHeight = 'auto';
    };

    SelectVersionDialog.prototype.createDialogContentsArea = function ($parent) {
        var html = [
            '<div class="brtc-va-dialogs-select-version-list-contents">',
            '  <div class="brtc-va-dialogs-select-version-list-body">',
            '  </div>',
            '</div>'
        ].join('\n');

        this.$self = $(html);
        $parent.append(this.$self);

        this.$contentBody = $parent.find('.brtc-va-dialogs-select-version-list-body');

        var emitter = new Brightics.VA.EventEmitter();
        emitter.on('select', function (fileVersion) {
            this.dialogResult.data = fileVersion;
            _super.handleOkClicked.call(this);
        }.bind(this));

        this.modelVersionListComponent =
            new Brightics.VA.Core.Components.ModelVersionListSelectable({
                $el: this.$contentBody,
                emitter: emitter,
                projectId: this.options.projectId,
                fileId: this.options.fileId
            });
    };

    SelectVersionDialog.prototype.createDialogButtonBar = function ($parent) {
        _super.createDialogButtonBar.call(this, $parent);
        this.$okButton.val('Close');
        this.$cancelButton.css({ display: 'none' });
    };

    Brightics.VA.Core.Dialogs.SelectVersionDialog = SelectVersionDialog;

/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
