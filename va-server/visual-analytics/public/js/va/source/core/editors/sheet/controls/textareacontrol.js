/**
 * Created by ty_tree.kim on 2016-04-22.
 */
(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function TextAreaControl(control, options) {
        try {
            //if (control[0].tagName.toLowerCase() !== 'textarea') {
            //    throw new Error('Tag name should be "textarea"');
            //}

            this.$mainControl = control;
            this.options = options;
            this.verifier = options.verifier;
            this.data = null;

            this.createControls();
        }
        catch (e) {
            console.error(e);
        }
    }

    TextAreaControl.prototype.createControls = function () {
        // 초기화만 해놓으면 CodeMirror가 Coloring과 Verify를 자동으로 해준다.
        this.initCodeMirror();
    };

    TextAreaControl.prototype.initCodeMirror = function () {
        var _this = this;

        // CodeMirror를 Setting한다.
        var mode = (this.verifier)? this.verifier.getRuleMode(): 'brtc-default';
        var codeMirrorDefaultOptions = {
            mode: mode,
            theme: 'default',
            lineNumbers: false,
            lineWrapping: true,
            // viewportMargin: Infinity,
            scrollbarStyle: (typeof _this.options.scrollbarStyle !== 'undefined') ? 'null' : 'simple',
            placeholder: 'Enter value',
            extraKeys: {'Ctrl-Space': 'autocomplete'},
            showTrailingSpace: true,
            autoCloseBrackets: true,
            matchBrackets: true
        };

        var options = $.extend(true, {}, codeMirrorDefaultOptions, this.options);
        this.codeMirror = CodeMirror.fromTextArea(this.$mainControl[0], options);
        this.codeMirror.on('focus', function (instance, event) {
            _this.old = instance.getValue();
        });
        this.codeMirror.on('blur', function (instance, event) {
            if (instance.getValue() != _this.old && typeof _this.callback === 'function') {
                _this.callback('change', event);
            }
        });
        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(this.codeMirror);
    };

    TextAreaControl.prototype.getValue = function () {
        return this.codeMirror.getValue();
    };

    TextAreaControl.prototype.setValue = function (data) {
        this.codeMirror.setValue(data);
    };

    TextAreaControl.prototype.onChange = function (callback) {
        this.callback = callback;
    };

    TextAreaControl.prototype.getControl = function () {
        return this.$mainControl;
    };

    root.Brightics.VA.Core.Editors.Sheet.Controls.TextAreaControl = TextAreaControl;

}).call(this);