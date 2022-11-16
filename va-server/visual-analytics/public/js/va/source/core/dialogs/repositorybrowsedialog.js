/**
 * Created by SDS on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RepositoryBrowserDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    RepositoryBrowserDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    RepositoryBrowserDialog.prototype.constructor = RepositoryBrowserDialog;

    RepositoryBrowserDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 700;
        this.dialogOptions.height = 700;
    };

    RepositoryBrowserDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-repository-browser-contents');
        var path = this.options.pathLabel ? this.options.pathLabel : path;
        $parent.append('' +
            '<div class="brtc-va-dialogs-repository-browser-tree"></div>' +
            '<div class="brtc-va-dialogs-repository-browser-file-layout">' +
            '   <div class="brtc-va-dialogs-repository-browser-file-label">' + path  + '</div>' +
            '   <div class="brtc-va-dialogs-repository-browser-file-input"><textarea></textarea></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-repository-browser-setting-option">' +
            '   <div class="brtc-va-dialogs-repository-browser-radio" value="static">Set a static path for users repository.</div>' +
            '   <div class="brtc-va-dialogs-repository-browser-radio" value="dynamic">Set a dynamic path for users repository.</div>' +
            '</div>' +

            '');

        this.createRepositoryTree($parent.find('.brtc-va-dialogs-repository-browser-tree'));
        this.createSettingOptionControl($parent.find('.brtc-va-dialogs-repository-browser-setting-option'));
        this.createFilePathControl($parent.find('.brtc-va-dialogs-repository-browser-file-input > textarea'));
    };

    RepositoryBrowserDialog.prototype.createRepositoryTree = function ($control) {
        var _this = this;
        this.repositoryViewer = new Brightics.VA.Core.Controls.RepositoryViewer($control);
        this.repositoryViewer.$tree.on('select', function (event) {
            var path = _this.repositoryViewer.getSelectedPath();
            _this._setFilePath(path);
        });
    };

    RepositoryBrowserDialog.prototype.createSettingOptionControl = function ($control) {
        var _this = this,
            $optionControl = $control.find('.brtc-va-dialogs-repository-browser-radio');
        this.$settingOptionGroup = $control;
        $optionControl.jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            groupName: 'repository-browser-setting-option'
        });

        $optionControl.on('checked', function () {
            var path = _this.repositoryViewer.getSelectedPath() || _this.options.filePath;
            _this._setFilePath(path);
        });

        if (this.options.filePath.match(/\$\{\=sys.user\}\//g)) {
            this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=dynamic]').jqxRadioButton('check');
        } else {
            this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=static]').jqxRadioButton('check');
        }

        this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').hide();
    };

    RepositoryBrowserDialog.prototype.createFilePathControl = function ($control) {
        this.fileName = CodeMirror.fromTextArea($control[0], {
            mode: 'text',
            theme: 'default',
            indentWithTabs: false,
            smartIndent: false,
            lineNumbers: false,
            matchBrackets: true,
            scrollbarStyle: 'null',
            autofocus: false
        });
        this.fileName.on('beforeChange', function (instance, change) {
            var newtext = change.text.join('').replace(/\n/g, ''); // remove ALL \n
            if (change.update) change.update(change.from, change.to, [newtext]);
            return true;
        });

        var _this = this;
        this.fileName.on('change', function (instance, change) {
            var value = instance.getValue();
            _this.$okButton.jqxButton({
                disabled:
                    (value === '/shared/'
                        || value === '/' + Brightics.VA.Env.Session.userId + '/'
                        || value === '/shared/upload/'
                        || value === '/' + Brightics.VA.Env.Session.userId + '/upload/'
                        || value === '/${=sys.user}/upload/')
            });
        });

        this.fileName.setSize('100%', '100%');

        if (this.options.filePath) {
            this._setFilePath(this.options.filePath);
        }
        var additionalOption = {
            'valid-type': 'fileNameType',
            'valid-message-position': 'bottom'
        };
        Brightics.VA.Core.Utils.WidgetUtils.changeCodeMirrorLineToSingle(this.fileName, additionalOption);
    };

    RepositoryBrowserDialog.prototype._setFilePath = function (path) {
        if (!path) return;

        var matched1 = path.match(/\/shared\/upload\/[^\/]*/);
        this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').hide();

        if (matched1) {
            this.fileName.setValue(path);
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: 15}, {
                readOnly: true,
                inclusiveLeft: true,
                css: 'color: #b4b4b4'
            });
        } else if (path.startsWith('/' + Brightics.VA.Env.Session.userId + '/upload/') || path.startsWith('/${=sys.user}/upload/')) {
            this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').show();
            var ch = 0,
                filePath = path;
            if (this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=dynamic]').val()) {
                filePath = filePath.replace(/\/\S*\/upload\//g, '/${=sys.user}/upload/');
            } else {
                filePath = filePath.replace(/\/\$\{\=sys\.user\}\/upload\//g, '/' + Brightics.VA.Env.Session.userId + '/upload/');
            }
            var segments = filePath.split('/');
            this.fileName.setValue(filePath);
            for (var i = 0; i < 3; i++) {
                ch += segments[i].length;
                ch++;
            }
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: ch}, {
                readOnly: true,
                inclusiveLeft: true,
                css: 'color: #b4b4b4'
            });
        }
        else {
            filePath = path + '/';
            if (this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=dynamic]').val() && !filePath.startsWith('/shared/')) {
                filePath = filePath.replace(/\/\S*\/upload\//g, '/${=sys.user}/upload/');
            } else if (!filePath.startsWith('/shared/')) {
                filePath = filePath.replace(/\/\$\{\=sys\.user\}\/upload\//g, '/' + Brightics.VA.Env.Session.userId + '/upload/');
            }
            this.fileName.setValue(filePath);
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: filePath.length + 1}, {
                readOnly: true,
                inclusiveLeft: true,
                css: 'color: #b4b4b4'
            });
        }
    };

    RepositoryBrowserDialog.prototype.handleOkClicked = function () {
        var file = this.fileName.getValue().trim();
        if (file) {
            if (this._isAvailablePath(file)) {
                this.dialogResult.selectedFile = file;
                Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Invalid path selected. It should start with \'/shared/upload/\' or \'/{USER_ID}/upload/\'.');
            }
        } else {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('At least one file must be selected.');
        }
    };

    RepositoryBrowserDialog.prototype.createDialogButtonBar = function ($parent) {
        if (this.dialogOptions.useButton === false) return;
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);
    };

    RepositoryBrowserDialog.prototype._isAvailablePath = function (filePath) {
        var matched1 = filePath.match(/^\/shared\/upload\/[^\/]+$/);
        var matched2 = filePath.match(/[^\/]+\/upload\/[^\/]*/);
        var matched3 = filePath.match(/^\/\$\{\=sys\.user\}\/[^\/]+$/);

        //"."가 2개이상 연속되면 Error 발생
        var temp = "", intCnt = 0;
        for (var i = 0; i < filePath.length; i++) {
            temp = filePath.charAt(i);
            if (temp == '.' || temp == '@' || temp == '/') {
                if (temp == filePath.charAt(i + 1)) {
                    intCnt = intCnt + 1;
                }
            }
        }
        return (intCnt <= 0) || (matched1 || matched2 || matched3);
    };

    Brightics.VA.Core.Dialogs.RepositoryBrowserDialog = RepositoryBrowserDialog;

}).call(this);