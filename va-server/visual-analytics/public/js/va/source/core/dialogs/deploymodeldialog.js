(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DeployModelDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);

        this.selectedVersion = '';
    }

    DeployModelDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    DeployModelDialog.prototype.constructor = DeployModelDialog;

    DeployModelDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 760;
        this.dialogOptions.height = 480; // 520
    };
    
    DeployModelDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-editresourcedialog-contents');

        $parent.append('' +
            '           <div class="brtc-va-dialogs-row-flex-layout">' +
            '             <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold" style="margin-right: 11px;">' + Brightics.locale.common.target + '</div>' +
            '                   <div class="brtc-va-editors-sheet-controls-propertycontrol-input" maxlength="80"></div>' +
            '           </div>' +
            // '           <div class="brtc-va-dialogs-row-flex-layout">' +
            // '               <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">Version</div>' +
            // '                   <input readonly type="text" class="brtc-va-dialogs-version-input" maxlength="40"/>' +
            // '                   <input type="button" value="Select Version" class="brtc-va-dialogs-select-verion-button" maxlength="40"/></div>' +
            '           <div class="brtc-va-dialogs-row-flex-layout">' +
            '               <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.name + '</div>' +
            '                   <input type="text" class="brtc-va-dialogs-editresourcedialog-name-input" maxlength="40"/></div>' +
            '           <div class="brtc-va-dialogs-row-flex-layout">' +
            '               <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-contents-label-bold">' + Brightics.locale.common.description + '</div>' +
            '               <div class="brtc-va-dialogs-editresourcedialog-description-container"></div>' +
            '           </div>' +
            '</div>');

        this.createTargetControl($parent.find('.brtc-va-editors-sheet-controls-propertycontrol-input'));
        // this.createSelectVersionControl($parent.find('.brtc-va-dialogs-version-input'),
        //     $parent.find('.brtc-va-dialogs-select-verion-button'));
        this.createNameControl($parent.find('.brtc-va-dialogs-editresourcedialog-name-input'));
        this.createDescriptionControl($parent.find('.brtc-va-dialogs-editresourcedialog-description-container'));
        this.$serverControl.focus();
    };

    DeployModelDialog.prototype.createTargetControl = function ($control) {
        var source =
        {
            datatype: 'json',
            datafields: [
                {name: 'datasourceName'},
                {name: 'datasourceType'}
            ],
            url: 'api/va/v2/ws/deploy/target',
            async: true
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind(source);

        // Target ID setting
        this.$serverControl = $control.jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            width: '91%',
            placeHolder: Brightics.locale.common.chooseTargetServer,
            selectedIndex: 2,
            source: dataAdapter,
            displayMember: 'datasourceName'
        });
    };

    DeployModelDialog.prototype.createSelectVersionControl = function ($input, $button) {
        this.$versionInput = $input.jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: Brightics.locale.sentence.S0003
        });
        this.$versionButton = $button.jqxButton({ theme: Brightics.VA.Env.Theme });

        var onSelectVersion = function (data) {
            this.$versionInput.val(data.getMajorVersion() + '.' + data.getMinorVersion());
            this.selectedVersion = data.getVersionId();
        }.bind(this);

        var openSelectVersionDialog = function () {
            var emitter = new Brightics.VA.EventEmitter();
            emitter.on('select', onSelectVersion);
            new Brightics.VA.Core.Dialogs.SelectVersionDialog(this.$mainControl, {
                projectId: this.options.projectId,
                fileId: this.options.fileId,
                emitter: emitter
            });
        }.bind(this);

        this.$versionButton.on('click', openSelectVersionDialog);
    };

    DeployModelDialog.prototype.createNameControl = function ($control) {
        this.$nameControl = $control.jqxInput({
            placeHolder: Brightics.locale.placeHolder.enterName,
            theme: Brightics.VA.Env.Theme
        });
    };

    DeployModelDialog.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            focus: false,
            height: 188,
            okButton: this.$okButton,
            maxLength: 2000,
            toolbar: this.options.toolbar,
            callbacks: {
                onFocus: function () {
                    if(_this.$serverControl.jqxDropDownList('isOpened')) _this.$serverControl.jqxDropDownList('close');
                }
            }
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);

        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
        });
    };

    DeployModelDialog.prototype.handleOkClicked = function () {
        if (this.$serverControl.val() == 'Choose Target Server') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please choose target server.');
            return;
        }

        if (this.$nameControl.val().trim() === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter name.');
            return;
        }

        // if (this.selectedVersion === '') {
        //     Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please select version.');
        //     return;
        // }

        this.dialogResult.server = this.$serverControl.val();
        this.dialogResult.name = this.$nameControl.val().trim();
        this.dialogResult.description = this.noteControl.getCode();
        // this.dialogResult.versionId = this.selectedVersion;

        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    Brightics.VA.Core.Dialogs.DeployModelDialog = DeployModelDialog;
}.call(this));
