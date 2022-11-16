/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TextContentUnit(parentId, options) {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.call(this, parentId, options);
    }

    TextContentUnit.prototype = Object.create(Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype);
    TextContentUnit.prototype.constructor = TextContentUnit;

    TextContentUnit.prototype.createControls = function () {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.createControls.call(this);

        var _this = this;
        this.$unitControl = $('<div class="brtc-va-text-content-unit brtc-style-content" type="text"></div>');
        this.$content.append(this.$unitControl);

        var noteOption = {
            height: '100%',
            placeholder: 'Write Text',
            callbacks: {
                onInit: function () {
                    // _this.createTextToolItem();
                },
                onPaste: function (e) {
                    var t = e.currentTarget.innerText;
                    var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                    var all = t + bufferText;

                    if (all.replace(/(<([^>]+)>)/ig, "").replace(/( )/, "").length >= 2000) {
                        e.preventDefault();
                        e.stopPropagation();

                        var editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(_this.$mainControl);
                        editor.notification('info', 'The character input is limited within 2000.');
                    }
                },
                onKeydown: function (e) {
                    var key = e.keyCode, allowed_keys = [8, 37, 38, 39, 40, 46];
                    if ($.inArray(key, allowed_keys) != -1 || e.altKey || e.ctrlKey)
                        return true;
                    else if ($(e.currentTarget).text().replace(/(<([^>]+)>)/ig, "").replace(/( )/, "").length >= 2000) {
                        var editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(_this.$mainControl);
                        editor.notification('info', 'The character input is limited within 2000.');

                        e.preventDefault();
                        e.stopPropagation();
                    }
                },
                onChange: function (contents, $editable) {
                    if (!_this.rendering) {
                        _this.isChanged = (contents !== _this.options.content.options.html);
                    }
                },
                onBlur: function () {
                    if (!_this.$mainControl.hasClass('ui-selected')) _this.blur();
                }
            },
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['height', ['height']],
                ['table', ['table']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']]
            ]
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl(this.$unitControl, noteOption);
        this.$unitControl.find('.note-dropzone').remove();
        this.$unitControl.find('.note-statusbar').remove();
        this.$unitControl.find('.modal').remove();
        this.$unitControl.find('.note-para').find('.dropdown-menu').addClass('right');
        this.$unitControl.find('.note-height').find('.dropdown-menu').addClass('right');
        this.$unitControl.find('.dropdown-menu').css({'box-sizing': 'border-box'});

        if (this.options.content.options.html) {
            this.rendering = true;
            this.noteControl.$mainControl.summernote('code', this.options.content.options.html);
            this.rendering = false;
        }

        if (this.options.publish) {
            this.$mainControl.addClass('publish');
        }

        this.adjustBackground();
        this.adjustArrange();

        this.$unitControl.find('.note-editable.panel-body').on('mousewheel', function (event) {
            if ($(event.currentTarget).parents('.ui-selected').length || $(event.currentTarget).parents('.publish').length) {
                if ($(event.currentTarget).get(0).scrollHeight > $(event.currentTarget).get(0).clientHeight) {
                    event.stopPropagation();
                }
            }
        });
    };

    // TextContentUnit.prototype.createTextToolItem = function () {
    //     var $panelHeading = $('<div class="note-toolbar panel-heading"></div>');
    //     this.$mainControl.find('.brtc-va-visual-content-toolitem-area').append($panelHeading);
    //
    //     var $noteStyle = this.$content.find('.note-btn-group.btn-group.note-style').detach();
    //     var $noteFontSize = this.$content.find('.note-btn-group.btn-group.note-fontsize').detach();
    //     var $noteColor = this.$content.find('.note-btn-group.btn-group.note-color').detach();
    //
    //     $panelHeading.append($noteStyle);
    //     $panelHeading.append($noteFontSize);
    //     $panelHeading.append($noteColor);
    // };

    TextContentUnit.prototype.show = function () {
        if (this.options.content && this.options.content.options) {
            this.rendering = true;
            this.noteControl.$mainControl.summernote('code', this.options.content.options.html || '');
            this.rendering = false;
        }
    };

    TextContentUnit.prototype.focus = function () {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.focus.call(this);
        this.noteControl.$mainControl.summernote('enable');
        this.noteControl.$mainControl.summernote('focus');
    };

    TextContentUnit.prototype.blur = function () {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.blur.call(this);
        if (this.isChanged) {
            var html = this.noteControl.getCode();
            var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentOptionCommand(this, {
                content: this.options.content,
                chartOptions: this.options.content.options,
                changedOption: {
                    html: html
                }
            });
            this.isChanged = false;
            this.editor.getCommandManager().execute(command);
        }
        this.noteControl.$mainControl.summernote('disable');
        this.triggerChangedContentStatus('rendered');
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.ContentUnit.text = TextContentUnit;

}).call(this);