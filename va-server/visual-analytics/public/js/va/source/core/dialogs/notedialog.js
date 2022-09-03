(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NoteDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.retrieveParent();
        this.createControls();
        this.createContents();
    }

    NoteDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    NoteDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-notedialog">' +
            // '   <div class="brtc-va-dialogs-header">Note</div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '           <div class="brtc-va-dialogs-notecontents">' +
            '           </div>' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="Save" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        // this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        var _this = this;

        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: 'Note',
            width: 1020,
            height: 690,
            maxWidth: 1020,
            maxHeight: 690,
            modal: true,
            resizable: false
        };
        this.$mainControl.dialog(jqxOpt);
    };

    NoteDialog.prototype.createContents = function () {
        var _this = this;
        _this.initContents(_this.$mainControl.find('.brtc-va-dialogs-notecontents'));
        _this.createNoteArea(_this.$mainControl.find('.brtc-va-dialogs-notecontents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$okButton.click(_this.handleOkClicked.bind(_this));
    };

    NoteDialog.prototype.initContents = function ($parent) {
        // $parent.append(this.options.contents);
    };

    NoteDialog.prototype.createNoteArea = function ($parent) {
        var noteOption = {
            height: 480,
            description: this.options.contents,
            okButton: this.$okButton,
            maxLength: 1000
        };

        this.note = Brightics.VA.Core.Widget.Factory.noteControl($parent, noteOption);

    };
    NoteDialog.prototype.handleOkClicked = function () {
        if (typeof this.options.save == 'function') {
            this.options.save(this.note.getCode());
        }
        this.$mainControl.dialog('close');
    };


    Brightics.VA.Core.Dialogs.NoteDialog = NoteDialog;

}).call(this);