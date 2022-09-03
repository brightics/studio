/**
 * Created by SDS on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RepositoryBrowsePanel(parentId, options) {
        options.title = 'Browse Repository';
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.call(this, parentId, options);
        this.$mainControl.addClass('repository-viewer');
    }

    RepositoryBrowsePanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype);
    RepositoryBrowsePanel.prototype.constructor = RepositoryBrowsePanel;

    RepositoryBrowsePanel.prototype.createContentsAreaControls = function ($parent) {
        // $parent = this.$contentsArea;
        this.options.filePath = this.options.filePath || '';
        $parent.empty();
        this.createDialogContentsArea($parent);
    };

    RepositoryBrowsePanel.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-repository-browser-contents');

        $parent.append('' +
            '<div class="brtc-va-dialogs-repository-browser-tree"></div>' +
            '<div class="brtc-va-dialogs-repository-browser-file-layout">' +
            '   <div class="brtc-va-dialogs-repository-browser-file-label">File Path</div>' +
            '   <div class="brtc-va-dialogs-repository-browser-file-input"><textarea></textarea></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-repository-browser-setting-option">' +
            '   <div class="brtc-va-dialogs-repository-browser-radio" value="static">Set a static file path for users repository.</div>' +
            '   <div class="brtc-va-dialogs-repository-browser-radio" value="dynamic">Set a dynamic file path for users repository.</div>' +
            '</div>' +

            '');

        this.createRepositoryTree($parent.find('.brtc-va-dialogs-repository-browser-tree'));
        this.createSettingOptionControl($parent.find('.brtc-va-dialogs-repository-browser-setting-option'));
        this.createFilePathControl($parent.find('.brtc-va-dialogs-repository-browser-file-input > textarea'));
    };

    RepositoryBrowsePanel.prototype.createRepositoryTree = function ($control) {
        var _this = this;
        this.repositoryViewer = new Brightics.VA.Core.Controls.RepositoryViewer($control);
        this.repositoryViewer.$tree.on('select', function (event) {
            var path = _this.repositoryViewer.getSelectedPath();
            _this._setFilePath(path);
        });
    };

    RepositoryBrowsePanel.prototype.createSettingOptionControl = function ($control) {
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

        if (this.options.filePath.match(/\/users\/\$\{sys.user\}\//g)) {
            this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=dynamic]').jqxRadioButton('check');
        } else {
            this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=static]').jqxRadioButton('check');
        }

        this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').hide();
    };

    RepositoryBrowsePanel.prototype.createFilePathControl = function ($control) {
        this.fileName = CodeMirror.fromTextArea($control[0], {
            mode: 'text',
            theme: 'default',
            indentWithTabs: false,
            smartIndent: false,
            lineNumbers: false,
            matchBrackets: true,
            scrollbarStyle: 'null',
            autofocus: false,
            readOnly: true
        });
        this.fileName.on('beforeChange', function (instance, change) {
            var newtext = change.text.join('').replace(/\n/g, ''); // remove ALL \n
            if (change.update) change.update(change.from, change.to, [newtext]);
            return true;
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

    RepositoryBrowsePanel.prototype._setFilePath = function (path) {
        if (!path) return;

        var matched1 = path.match(/^\/brtc\/repo\/shared\/[^\/]*/);
        var matched2 = path.match(/^\/brtc\/repo\/users\/[^\/]+\/[^\/]*/);
        this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').hide();

        if (matched1) {
            this.fileName.setValue(path);
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: 18}, {
                readOnly: true,
                inclusiveLeft: true,
                css: 'color: #b4b4b4'
            });
        } else if (matched2) {
            this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').show();
            var ch = 0,
                filePath = path;
            if (this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=dynamic]').val()) {
                filePath = filePath.replace(/\/users\/\S*\//g, '/users/${sys.user}/');
            } else {
                filePath = filePath.replace(/\/users\/\$\{sys\.user\}\//g, '/users/' + Brightics.VA.Env.Session.userId + '/');
            }
            var segments = filePath.split('/');
            this.fileName.setValue(filePath);
            for (var i = 0; i < 5; i++) {
                ch += segments[i].length;
                ch++;
            }
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: ch}, {
                readOnly: true,
                inclusiveLeft: true,
                css: 'color: #b4b4b4'
            });
        } else {
            filePath = path + '/';
            if (this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio[value=dynamic]').val()) {
                filePath = filePath.replace(/\/users\/\S*\//g, '/users/${sys.user}/');
            } else {
                filePath = filePath.replace(/\/users\/\$\{sys\.user\}\//g, '/users/' + Brightics.VA.Env.Session.userId + '/');
            }
            this.fileName.setValue(filePath);
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: filePath.length + 1}, {
                readOnly: true,
                inclusiveLeft: true,
                css: 'color: #b4b4b4'
            });
        }
    };

    if (Brightics.VA.Implementation.DataFlow.Functions.import) Brightics.VA.Implementation.DataFlow.Functions.import.DataPanel= RepositoryBrowsePanel;
    if (Brightics.VA.Implementation.DataFlow.Functions.export) Brightics.VA.Implementation.DataFlow.Functions.export.DataPanel= RepositoryBrowsePanel;

}).call(this);
