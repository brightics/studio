/* global _ */
(function () {
    var Brightics = this.Brightics;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    /**
     * @extends Dialog
     * @param {*} parentId
     * @param {Object} options
     */
    function EditVersionDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    EditVersionDialog.prototype = Object.create(_super);
    EditVersionDialog.prototype.constructor = EditVersionDialog;

    EditVersionDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);
        this.dialogOptions.width = 760;
        this.dialogOptions.height = 440;
        this.dialogOptions.maxHeight = 440;
        this.dialogOptions.title = Brightics.locale.common.editVersion;
    };

    EditVersionDialog.prototype.createDialogContentsArea = function ($parent) {
        var template = [
            '<div class="brtc-va-dialogs-edit-version-wrapper">',
            '<div class="brtc-va-dialogs-edit-version-body">',
            '  <div class="brtc-va-dialogs-edit-version-row">',
            '    <div class="brtc-va-dialogs-edit-version-label">' + Brightics.locale.common.name + '</div>',
            '    <input type="text" class="brtc-va-dialogs-edit-version-name-input brtc-style-flex-1" maxlength="80"/>',
            '  </div>',
            '  <div class="brtc-va-dialogs-edit-version-row">',
            '    <div class="brtc-va-dialogs-edit-version-label">' + Brightics.locale.common.description + '</div>',
            '    <div class="brtc-va-dialogs-edit-version-description-input">',
            '    </div>',
            '  </div>',
            '  <div class="brtc-va-dialogs-edit-version-row">',
            '    <div class="brtc-va-dialogs-edit-version-label">' + Brightics.locale.common.tags + '</div>',
            '    <input type="text" class="brtc-va-dialogs-edit-version-tags-input brtc-style-flex-1" maxlength="80"/>',
            '  </div>',
            '</div>',
            '</div>'
        ].join('\n');

        $parent.append(template);
        this.createLabelControl($parent.find('.brtc-va-dialogs-edit-version-name-input'));
        this.createDescriptionControl($parent.find('.brtc-va-dialogs-edit-version-description-input'));
        this.createTagsControl($parent.find('.brtc-va-dialogs-edit-version-tags-input'));

        this._refreshContents();
        this.$mainControl.dialog(this.dialogOptions);
    };

    EditVersionDialog.prototype.createLabelControl = function ($control) {
        this.$labelInput = $control.jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
    };

    EditVersionDialog.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            focus: false,
            height: 155,
            description: this.options.description,
            okButton: this.$okButton,
            maxLength: 2000,
            toolbar: this.options.toolbar
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);

        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
        });
    };

    EditVersionDialog.prototype.createTagsControl = function ($control) {
        this.$tagsControl = $control.jqxInput({
            placeHolder: Brightics.locale.common.enterTags,
            theme: Brightics.VA.Env.Theme
        });
    };

    EditVersionDialog.prototype.createDialogButtonBar = function ($parent) {
        _super.createDialogButtonBar.call(this, $parent);
        this.$okButton.val(Brightics.locale.common.ok);
    };

    EditVersionDialog.prototype.handleCancelClicked = function () {
        Brightics.VA.Dialogs.Dialog.prototype.handleCancelClicked.call(this);
    };

    EditVersionDialog.prototype.handleOkClicked = function () {
        var doneCallback = function () {
            this.options.onEditCallback();
            _super.handleOkClicked.call(this);
        }.bind(this);

        this.debouncedUpdateFileVersion = this.debouncedUpdateFileVersion ||
            _.debounce(function () {
                var currentCode = this.noteControl.getCode();
                if (currentCode === '<p><br></p>') currentCode = '';

                this.data.setTags(this.$tagsControl.val());
                this.data.setDescription(currentCode);
                Studio.getResourceManager().updateVersion(
                    this.options.projectId,
                    this.options.fileId,
                    this.data)
                    .then(doneCallback)
                    .catch(this._onError.bind(this));
            }.bind(this));

        this.debouncedUpdateFileVersion();
    };

    EditVersionDialog.prototype._refreshContents = function () {
        Studio.getResourceManager().fetchVersion(
            this.options.projectId,
            this.options.fileId,
            this.options.versionId)
            .then(this._fillContents.bind(this))
            .catch(this._onError.bind(this));
    };

    EditVersionDialog.prototype._fillContents = function (data) {
        this.$labelInput.val(data.getLabel());
        this.noteControl.setValue(data.getDescription());
        this.$tagsControl.val(data.getTags());
        this.data = data;
        return true;
    };

    EditVersionDialog.prototype._onError = function (err) {
        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.EditVersionDialog = EditVersionDialog;
}.call(this));
