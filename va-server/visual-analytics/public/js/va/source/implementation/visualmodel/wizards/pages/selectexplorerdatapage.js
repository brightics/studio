/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectExplorerDataPage(parentId, options) {
        this.options = options;
        this.options.class = 'selectexplorerdatapage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);

        this.$mainControl.parents('.brtc-va-wizard-main').addClass('selectexplorerdatapage');
    }

    SelectExplorerDataPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectExplorerDataPage.prototype.constructor = SelectExplorerDataPage;

    SelectExplorerDataPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.$btnPrevious.jqxButton({disabled: true});
        this.options.wizard.$btnNext.jqxButton({disabled: true});
        if (this.options.wizard.result.fileName) // 파일 있으면
            this.options.wizard.$btnFinish.jqxButton({disabled: false});
        else
            this.options.wizard.$btnFinish.jqxButton({disabled: true});

        this.options.wizard.result.fileName = this.options.wizard.result.fileName || '';
    };

    SelectExplorerDataPage.prototype.createHeaderArea = function ($parent) {

    };

    SelectExplorerDataPage.prototype.createContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-repository-browser-contents');
        $parent.append('' +
            '<div class="brtc-va-controls-datasource-alias-area">' +
            '   <div class="brtc-va-controls-datasource-alias-label">'+Brightics.locale.common.dataLabel+': </div>' +
            '   <div class="brtc-va-controls-datasource-alias-input-area">' +
            '       <input type="text" class="brtc-va-controls-datasource-alias-input" maxlength="80"/>' +
            '   </div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-repository-browser-tree"></div>' +
            '<div class="brtc-va-dialogs-repository-browser-file-layout">' +
            '   <div class="brtc-va-dialogs-repository-browser-file-label">'+Brightics.locale.common.selectedFilePath+': </div>' +
            '   <div class="brtc-va-dialogs-repository-browser-file-input"><textarea readonly></textarea></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-repository-browser-setting-option">' +
            '   <div class="brtc-va-dialogs-repository-browser-radio" value="static" checked="true">Set a static file path for users repository.</div>' +
            '   <div class="brtc-va-dialogs-repository-browser-radio" value="dynamic">Set a dynamic file path for users repository.</div>' +
            '</div>' +
            '');

        this.createDataSourceAliasArea($parent.find('.brtc-va-controls-datasource-alias-area'));
        this.createRepositoryViewerArea($parent.find('.brtc-va-dialogs-repository-browser-tree'));
        this.createSettingOptionControl($parent.find('.brtc-va-dialogs-repository-browser-setting-option'));
        this.createFilePathControl($parent.find('.brtc-va-dialogs-repository-browser-file-input > textarea'));
    };

    SelectExplorerDataPage.prototype.createSettingOptionControl = function ($control) {
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

        this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').hide();
    };

    SelectExplorerDataPage.prototype.createFilePathControl = function ($control) {
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

        this.setCodeMirrorReadOnly($control.closest('.brtc-va-dialogs-repository-browser-file-input'), true);

        Brightics.VA.Core.Utils.WidgetUtils.changeCodeMirrorLineToSingle(this.fileName, additionalOption);
    };

    SelectExplorerDataPage.prototype.setCodeMirrorReadOnly = function ($target, isReadOnly) {
        $target.find('.CodeMirror').addClass('brtc-style-border-grey') ;
        $target.find('.CodeMirror-code').addClass('brtc-style-cursor-default-important') ;
        $target.find('.CodeMirror-lines').addClass('brtc-style-cursor-default-important') ;
        $target.find('.CodeMirror-cursors').remove();
    };

    SelectExplorerDataPage.prototype.createRepositoryViewerArea = function ($parent) {
        var _this = this;
        this.repositoryViewer = new Brightics.VA.Core.Controls.RepositoryViewer($parent);
        this.repositoryViewer.$mainControl.find('.brtc-va-controls-repository-viewer-more').remove();
        this.repositoryViewer.$mainControl.find('.brtc-va-controls-repository-viewer-upload').remove();
        this.repositoryViewer.$mainControl.find('.brtc-va-controls-repository-viewer-refresh').remove();
        this.repositoryViewer.$mainControl.find('.brtc-va-controls-repository-viewer-context-menu').remove();
        this.repositoryViewer.$mainControl.find('.brtc-va-controls-repository-viewer-tree').on('mousewheel', function (event) {
            event.stopPropagation();
        });

        this.repositoryViewer.$tree.on('click', function () {
            var path = _this.repositoryViewer.getSelectedPath() || _this.options.filePath;
            _this._setFilePath(path);
            _this.options.wizard.$btnFinish.jqxButton({
                disabled:
                    _this.options.wizard.$btnFinish.jqxButton('disabled') ||
                    (_this.repositoryViewer.getSelectedFileType() || 'folder') === 'folder'
            });
        });
    };

    SelectExplorerDataPage.prototype._setFilePath = function (path) {
        if (!path) return;

        var matched1 = path.match(/^\/brtc\/repo\/shared\/[^\/]*/);
        var matched2 = path.match(/^\/brtc\/repo\/users\/[^\/]+\/[^\/]*/);
        this.$settingOptionGroup.find('.brtc-va-dialogs-repository-browser-radio').hide();

        if (matched1) {
            this.fileName.setValue(path);
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: 18 + path.length + 1}, {
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
            this.fileName.setValue(filePath);
            this.fileName.markText({line: 0, ch: 0}, {line: 0, ch: filePath.length + 1}, {
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

        // if (!this.$aliasInput.val()) this.$aliasInput.val(this.fileName.getValue());
        this.options.wizard.result.fileName = this.fileName.getValue();
        if (this.options.wizard.result.fileName) this.options.wizard.$btnFinish.jqxButton({disabled: false});
        else this.options.wizard.$btnFinish.jqxButton({disabled: true});
    };

    SelectExplorerDataPage.prototype.createDataSourceAliasArea = function ($parent) {
        this.$aliasInput = $parent.find('.brtc-va-controls-datasource-alias-input');
        this.$aliasInput.jqxInput({
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            placeHolder: Brightics.locale.common.dataSourceInputPlaceHolder,
        });
    };

    SelectExplorerDataPage.prototype.doFinish = function () {
        var _this = this;

        var targetVisualModel = this.options.wizard.options.visualModel;
        var fspaths = this.options.wizard.result.fileName; 
        if (fspaths[fspaths.length - 1] === '/') fspaths = fspaths.substr(0, fspaths.length - 1); 
        var dataSource = targetVisualModel.getDataSourceUsingParam({
            'fs-paths': fspaths
        });

        // aliasInput이 없으면 data source 파일명을 setting한다.
        var aliasInput = _this.$aliasInput.val().trim() || _this.options.wizard.result.fileName;

        if (dataSource) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('This data already exists in data sources.');
        } else {
            if (aliasInput) {
                _this.options.wizard.dialogResult.type = _this.options.wizard.result.dataFrom || 'loadFromAlluxio';
                _this.options.wizard.dialogResult.fileName = _this.options.wizard.result.fileName;
                _this.options.wizard.dialogResult.fileAlias = aliasInput;
                _this.options.wizard.$mainControl.on('dialogclose', _this.options.wizard.$mainControl.dialog('close'));
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter a data source label.');
            }
        }
    };

    SelectExplorerDataPage.prototype.destroy = function () {
        this.repositoryViewer.destroy();
    };

    Brightics.VA.Implementation.Visual.Wizards.Pages.SelectExplorerDataPage = SelectExplorerDataPage;

}).call(this);