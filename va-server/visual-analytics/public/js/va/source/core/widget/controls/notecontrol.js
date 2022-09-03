/**
 * Created by ng1123.kim on 2016-03-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const SUMMER_NOTE_TOOLBAR = [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['height', ['height']]
    ];

    function NoteControl(parentId, options) {
        this.parentId = parentId;
        this.options = this.setOptions(options);

        this.retrieveParent();
        this.createControls();
        this.createEvents();
    }

    NoteControl.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };


    NoteControl.prototype.setOptions = function (options) {
        var defaultOption = {};
        return $.extend(true, defaultOption, options)

    };

    NoteControl.prototype.createControls = function () {
        var description = this.options.description || '';
        this.$mainControl = $('<div class="brtc-va-widget-note-control">' + description + '</div>');
        this.$parent.append(this.$mainControl);

        if (!!document.createRange) {
            try {
                document.getSelection().removeAllRanges();
            } catch (e) {
                document.getSelection().addRange(document.createRange()); // IE bug
            }
        }

        this.$mainControl.summernote({
            focus: typeof this.options.focus != 'undefined' ? this.options.focus : true,
            toolbar: this.options.toolbar || SUMMER_NOTE_TOOLBAR,
            //chrome이 10px미만 폰트 지원하지않아서 override함. 2017-06-21 minkyung.kim
            fontSizes: FONT_SIZES,
            popover: {},
            height: this.options.height - 24,
            disableDragAndDrop: true,
            maximumImageFileSize: 1,
            callbacks: $.extend(true, {}, this.options.callbacks)
        });
    };


    NoteControl.prototype.createEvents = function () {
        this.setRestrictCondition();

        var inDialog = this.$mainControl.closest('.ui-dialog').length > 0;
        if (inDialog) this._setStopPropagationMouseDown();
    };

    NoteControl.prototype.setRestrictCondition = function () {
        if (this.options.maxLength) {
            this.createMessageArea();
            this.createLengthRestriction();
            this.createInputRestriction();
        }
    };

    NoteControl.prototype._setStopPropagationMouseDown = function () {
        this.$parent.mousedown(function (event) {
            event.stopPropagation();
        })
    };
    NoteControl.prototype.createMessageArea = function () {
        var _this = this;
        this.$messageArea = $('<div class="brtc-va-widget-note-message"></div>');
        this.$parent.append(this.$messageArea);

        this.$messageArea.text(this.$parent.find('.note-editable').text().length + ' / ' + _this.options.maxLength + ' ' + Brightics.locale.common.characters);
    };

    NoteControl.prototype.deleteImageElement = function () {
        this.$parent.find('.note-editing-area img').remove();
    };

    NoteControl.prototype.deleteHrefAttribute = function () {
        this.$parent.find('.note-editing-area a').removeAttr('href');
    };


    NoteControl.prototype.createLengthRestriction = function () {
        var _this = this;
        this.$mainControl.on('summernote.change', function (we, e) {
            _this.deleteImageElement();
            _this.deleteHrefAttribute();

            var textLength = _this.$parent.find('.note-editable').text().length;
            _this.$messageArea.text(textLength + ' / ' + _this.options.maxLength + Brightics.locale.common.characters);

            if (textLength > _this.options.maxLength) {
                _this.setOkbuttonCondition(true);
                _this.$messageArea.addClass('error');
            } else {
                _this.setOkbuttonCondition(false);
                _this.$messageArea.removeClass('error');
            }
        });
    };

    NoteControl.prototype.createInputRestriction = function () {
        var _this = this;
        this.$mainControl.on('summernote.keydown', function (we, e) {
            var textLength = _this.$parent.find('.note-editable').text().length;
            if (textLength > _this.options.maxLength) {
                if (!Brightics.VA.Core.Utils.InputValidator.isNotInsertKeyCode(e)) {
                    e.preventDefault();
                }
            }
        });
    };

    NoteControl.prototype.setOkbuttonCondition = function (able) {
        if (this.options.okButton) {
            this.options.okButton.jqxButton({
                disabled: able
            });
        }
    };

    // @Deprecated: please use getValue method
    NoteControl.prototype.getCode = function () {
        return this.getValue();
    };

    // @Deprecated: please use setValue method
    NoteControl.prototype.setCode = function (html) {
        this.setValue(html);
    };

    NoteControl.prototype.focus = function () {
        this.$mainControl.summernote('focus');
    };

    NoteControl.prototype.isEmpty = function () {
        return this.$mainControl.summernote('isEmpty');
    };

    NoteControl.prototype.setHeight = function (height) {
        this.$parent.find('.note-editable.panel-body').css({
            height: height
        });
    };

    NoteControl.prototype.getValue = function () {
        return this.$mainControl.summernote('code');
    };

    NoteControl.prototype.setValue = function (html) {
        this.$mainControl.summernote('focus');
        this.$mainControl.summernote('code', html || '');
    };

    NoteControl.prototype.clear = function () {
        this.$mainControl.summernote('focus');
        this.$mainControl.summernote('reset');
    };

    NoteControl.prototype.destroy = function () {
        this.$mainControl.summernote('destroy');
    };

    Brightics.VA.Core.Widget.Controls.NoteControl = NoteControl;

}).call(this);