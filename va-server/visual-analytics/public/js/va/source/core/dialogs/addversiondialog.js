/**
 * hyunseok.oh@samsung.com
 */

/* global _ */

(function () {
    'use strict';

    var Brightics = this.Brightics;
    var Utils = Brightics.VA.Core.Utils;
    var _super = Brightics.VA.Dialogs.Dialog.prototype;

    /**
     * @extends Dialog
     * @param {*} parentId
     * @param {Object} options
     */
    function AddVersionDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    AddVersionDialog.prototype = Object.create(_super);
    AddVersionDialog.prototype.constructor = AddVersionDialog;

    AddVersionDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);
        this.dialogOptions.width = 760;
        this.dialogOptions.height = 480;
        this.dialogOptions.maxHeight = 480;
        this.dialogOptions.title = Brightics.locale.common.updateVersion;

        this.options.resourceManager = Studio.getResourceManager();
        this.options.file = this.options.resourceManager.getFile(this.options.projectId, this.options.fileId);
    };

    AddVersionDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-add-version-contents');
        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.type + '</div>' +
            '   <div class="brtc-va-dialogs-add-version-radio-group brtc-va-dialogs-row-flex-layout">' +
            '       <div class="brtc-va-dialogs-add-version-major-radio">Major Version (X.o)</div>' +
            '       <div class="brtc-va-dialogs-add-version-minor-radio">Minor Version (o.X)</div>' +
            '   </div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.name + '</div>' +
            '   <input type="text" class="brtc-va-dialogs-add-version-name-input brtc-style-flex-1" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.description + '</div>' +
            '   <div class="brtc-va-dialogs-add-version-description-container" />' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.tags + '</div>' +
            '   <input type="text" class="brtc-va-dialogs-add-version-tags-input brtc-style-flex-1" maxlength="80">' +
            '</div>' +
            '');

        this.$mainRadiobox = $parent.find('.brtc-va-dialogs-add-version-major-radio');
        this.$subRadiobox = $parent.find('.brtc-va-dialogs-add-version-minor-radio');
        this.createVersionControl(this.$mainRadiobox, this.$subRadiobox);

        this.createNameControl($parent.find('.brtc-va-dialogs-add-version-name-input'));
        this.createTagsControl($parent.find('.brtc-va-dialogs-add-version-tags-input'));
        this.createDescriptionControl($parent.find('.brtc-va-dialogs-add-version-description-container'));
        this.$mainControl.dialog(this.dialogOptions);
        this.$tagsControl.focus();
    };

    AddVersionDialog.prototype.createNameControl = function ($control) {
        this.$nameControl = $control.jqxInput({
            disabled: 'true',
            theme: Brightics.VA.Env.Theme
        });

        this.$nameControl.val(this.options.file.getLabel());
    };

    AddVersionDialog.prototype.createTagsControl = function ($control) {
        this.$tagsControl = $control.jqxInput({
            placeHolder: Brightics.locale.common.enterTags,
            theme: Brightics.VA.Env.Theme
        });

        this.$tagsControl.val(this.options.tags);
    };

    AddVersionDialog.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            focus: false,
            height: 155,
            description: this.options.file.description,
            okButton: this.$okButton,
            maxLength: 2000,
            toolbar: this.options.toolbar
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);

        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
        });
    };

    AddVersionDialog.prototype.createVersionControl = function ($major, $minor) {
        $major.jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            checked: false,
            groupName: 'update-version'
        });
        $minor.jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            checked: true,
            groupName: 'update-version'
        });
    };

    AddVersionDialog.prototype.handleOkClicked = function () {
        this.debounced = this.debounced || (_.debounce(function () {
            var currentCode = this.noteControl.getCode();
            if (currentCode === '<p><br></p>') currentCode = '';

            var file = Studio.getResourceManager().getFile(this.options.projectId, this.options.fileId);
            var fileName = file.getLabel();

            var version = new Brightics.VA.Vo.Version();
            version.setVersionId(Brightics.VA.Core.Utils.IDGenerator.version.id());
            version.setTags(this.$tagsControl.val());
            version.setLabel(fileName);
            version.setDescription(currentCode);
            version.setIsMajor(this.$mainRadiobox.jqxRadioButton('checked') ? true : false);
            this.options.resourceManager
                .addVersion(this.options.projectId, this.options.fileId, version)
                .then(_super.handleOkClicked.bind(this))
                .catch(this._onError.bind(this));
        }.bind(this), 300));

        this.debounced();
    };

    AddVersionDialog.prototype._onError = function (err) {
        Utils.WidgetUtils.openBadRequestErrorDialog(err);
        this.close();
    };

    Brightics.VA.Core.Dialogs.AddVersionDialog = AddVersionDialog;
}.call(this));
