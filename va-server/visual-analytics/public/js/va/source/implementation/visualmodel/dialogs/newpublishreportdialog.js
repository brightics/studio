/**
 * Created by SDS on 2017-04-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const PRE_FIX = '/publish/';

    function NewPublishReportDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    NewPublishReportDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    NewPublishReportDialog.prototype.constructor = NewPublishReportDialog;

    NewPublishReportDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 550;
        this.dialogOptions.height = 250;

        this.id = Brightics.VA.Core.Utils.IDGenerator.report.id(14);
        this.useDefatulUrl = true;
    };

    NewPublishReportDialog.prototype.createTitleArea = function () {
        var $titleWrapper = $('' +
        '<div class="brtc-new-publish-title-wrapper">' +
            '<div class="brtc-va-dialogs-add2lib-library-label">'+Brightics.locale.common.publishingTitle+'</div>' +
            '<input type="text" class="brtc-va-dialogs-add2lib-library-name-input" valid-type="type1" maxlength="80"/>' +
        '</div>');

        this.$wrapper.append($titleWrapper);

        this.$nameInput = this.$mainControl.find('.brtc-va-dialogs-add2lib-library-name-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: Brightics.locale.placeHolder.enterName,
            width: 'calc(100% - 100px)',
            height: '25px'
        });

    };

    NewPublishReportDialog.prototype.createUrlArea = function () {
        var _this = this;

        var $urlWrapper = $('' +
        '<div class="brtc-new-publish-url-wrapper brtc-style-display-flex brtc-style-flex-direction-row">' +
            '<div class="brtc-va-dialogs-add2lib-library-label">URL</div>' +
            '<div class="brtc-va-dialogs-add2lib-library-prefix brtc-style-margin-bottom-20 brtc-style-line-height-30">'+ PRE_FIX +'</div>' +
            '<input type="text" class="brtc-va-dialogs-add2lib-library-url-default-input" valid-type="type1" maxlength="80"/>' +
            '<input type="url" class="brtc-va-dialogs-add2lib-library-url-custom-input brtc-style-padding-left-10" valid-type="type1" maxlength="80"/>' +
            '<div class="brtc-va-dialogs-add2lib-library-checkbox brtc-style-height-30px"></div>' +
            '<div class="brtc-va-dialogs-add2lib-library-checkbox-label brtc-style-line-height-27 brtc-style-height-30px brtc-style-padding-top-3">Default</div>' +
        '</div>');

        this.$wrapper.append($urlWrapper);

        this.$urlDefaultInput = this.$mainControl.find('.brtc-va-dialogs-add2lib-library-url-default-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            disabled:true,
            width: 'calc(100% - 200px)',
            height: '25px'
        });
        this.$urlDefaultInput.val(_this.id);

        this.$urlCustomInput = this.$mainControl.find('.brtc-va-dialogs-add2lib-library-url-custom-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: 'Enter URL',
            width: 'calc(100% - 200px)',
            height: '25px'
        });

        this.$urlCustomInput.on('keyup', function (event) {
            console.log(event);
        });

        this.$urlCustomInput.hide();

        this.$defaultCheckBox = this.$mainControl.find('.brtc-va-dialogs-add2lib-library-checkbox');
        this.$defaultCheckBox.jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            width: '30px',
            height: '25px',
            checked: true
        });

        this.$defaultCheckBox.on('change', function (event) {
            console.log(event.args.checked);
            if (event.args.checked == true) {
                _this.useDefatulUrl = true;
                _this.$urlCustomInput.hide();
                _this.$urlDefaultInput.show();
            } else {
                _this.useDefatulUrl = false;
                _this.$urlCustomInput.show();
                _this.$urlDefaultInput.hide();
            }
        });
    };
    
    NewPublishReportDialog.prototype.createDialogContentsArea = function ($parent) {
        this.$wrapper = $('<div class="brtc-new-publish-wrapper brtc-style-display-flex brtc-style-flex-direction-column"></div>');

        $parent.append(this.$wrapper);

        this.createTitleArea();
        this.createUrlArea();

        Brightics.VA.Core.Utils.WidgetUtils.setTrimInputControlOnFocusout($parent.find(".brtc-va-dialogs-add2lib-library-name-input"));

        this.setFocus();
    };

    NewPublishReportDialog.prototype.setFocus = function () {
        this.$nameInput.focus();
    };

    NewPublishReportDialog.prototype.checkDuplicatedUrl = function () {
        var _this = this;
        var option = {
            url: 'publishreports/check/' + this.dialogResult.url,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };

        $.ajax(option).done(function (result) {
            if (result.isDuplicate) {
                var errorMessage = "'" + _this.dialogResult.url + "'" + ' is already exist.';

                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(errorMessage);
            } else {
                Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
            }

        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    NewPublishReportDialog.prototype.handleOkClicked = function () {
        var _this = this;

        if (!this.$nameInput.val()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter publishing title.');
            _this.$nameInput.focus();
            return;
        } else if (!this.useDefatulUrl && !this.$urlCustomInput.val()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter URL.');
            _this.$urlCustomInput.focus();
            return;
        } else {
            this.dialogResult.label = this.$nameInput.val();
            this.dialogResult.id = this.id;
            this.dialogResult.url = (this.useDefatulUrl)? '' : this.$urlCustomInput.val();  

            if (this.useDefatulUrl) {
                Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
            } else {
                this.checkDuplicatedUrl();
            }
            
        }
    };

    Brightics.VA.Implementation.Visual.Dialogs.NewPublishReportDialog = NewPublishReportDialog;

}).call(this);
