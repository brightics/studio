/**
 * Created by ng1123.kim on 2016-03-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AceEditorControl(parentId, options) {
        this.parentId = parentId;
        this.options = this.setOptions(options);


        this.retrieveParent();
        this.createControls();
        this.createEditorCommands();
        this.registerEventListener();
        this.setValue(this.options.value);
        this.navigateFileEnd();
    }

    AceEditorControl.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };


    AceEditorControl.prototype.setOptions = function (options) {
        var defaultOption = {};
        return $.extend(true, defaultOption, options)

    };

    AceEditorControl.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-widget-ace-editor-control"></div>' +
            '');
        this.$parent.append(this.$mainControl);

        this.editor = ace.edit(this.$mainControl[0]);
        if(this.options.mode){
            this.editor.session.setMode('ace/mode/' + this.options.mode);
        }
        this.editor.setTheme('ace/theme/eclipse');

        var editorOptions = {
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            minLines: 10,
            maxLines: 10
        };

        if(this.options.editorOptions){
            $.extend(true, editorOptions, this.options.editorOptions);
        }

        this.editor.setOptions(editorOptions);
        this.editor.setShowPrintMargin(false);
        this.editor.$blockScrolling = Infinity;

        /*this.$mainControl.resizable({
            minHeight: 150,
            handles: 's, se'
        });*/
    };
    AceEditorControl.prototype.getWrapperDiv = function () {
        return this.$mainControl;
    };

    AceEditorControl.prototype.createEditorCommands = function () {
        for (var i in this.options.commands) {
            this.editor.commands.addCommand(this.options.commands[i]);
        }
    };

    AceEditorControl.prototype.registerEventListener = function () {
        for (var i in this.options.events) {
            this.editor.addEventListener(this.options.events[i].name, this.options.events[i].event)
        }
    };

    AceEditorControl.prototype.setValue = function (value) {
        this.editor.setValue(value);
    };

    AceEditorControl.prototype.getValue = function () {
        return this.editor.getValue();
    };

    AceEditorControl.prototype.getEditor = function () {
        return this.editor;
    };


    AceEditorControl.prototype.resize = function () {
        this.editor.resize();
    };

    AceEditorControl.prototype.navigateFileEnd = function () {
        return this.editor.navigateFileEnd();
    };

    AceEditorControl.prototype.getCursorPosition = function () {
        return this.editor.getCursorPosition();
    };

    AceEditorControl.prototype.getSession = function () {
        return this.editor.session;
    };
    AceEditorControl.prototype.insert = function (value) {
        this.editor.insert(value);
    };

    AceEditorControl.prototype.focus = function () {
        this.editor.focus();
    };

    AceEditorControl.prototype.setHeight = function (height) {
        this.$mainControl.css('height', height);
    };

    AceEditorControl.prototype.destroy = function () {
        this.editor.destroy();
        this.$mainControl.remove();
    };

    Brightics.VA.Core.Widget.Controls.AceEditorControl = AceEditorControl;

}).call(this);