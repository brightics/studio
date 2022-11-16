/**
 * Created by sungjin1.kim on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Editor(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        _retrieveParent.bind(this)();

        this.init();
        this.createControls.bind(this)();

        this.modelLayoutManager = new Brightics.VA.Core.Interface.ModelLayoutManager[this.options.clazz](this);
        this.sideBarManager = new Brightics.VA.Core.Interface.SideBarManager[this.options.clazz](this);

        this.modelLayoutManager.initEditorSelectionChangeListener();
        this.modelLayoutManager.adjustLayout();
    }

    var _retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Editor.prototype.init = function () {
        this.StatusBoard = brtc_require('StatusBoard');
    };

    Editor.prototype.checkInfo = function () {
        if (!_.isEqual(localStorage.getItem('info.script.show'), 'false')) {
            this.openScriptInfoDialog();
        }
    };

    Editor.prototype.openScriptInfoDialog = function () {
        new Brightics.VA.Core.Dialogs.ScriptInfoDialog(this.$mainControl, {
            type: 'warn',
            modal: true,
            isCancel: false
        });
    };

    Editor.prototype.createControls = function () {
        console.error('createControls must be implemented');
    };

    Editor.prototype.save = function (command, modelDiff) {
        var _this = this;
        var fileInput = this.options.editorInput;

        fileInput.setUpdater(Brightics.VA.Env.Session.userId);
        delete fileInput.getContents().problemList;

        var saveFile = (function (diff) {
            if (diff) {
                return Studio.getResourceManager()
                    .saveFile(fileInput.getProjectId(), fileInput, diff);
            } else {
                return Studio.getResourceManager()
                    .updateFile(fileInput.getProjectId(), fileInput);
            }
        }(modelDiff));

        saveFile
            .catch(function (err) {
                var errCode = _this.getPrimaryErrorCode(err);
                if (errCode == 32031) {
                    Studio.getLayoutManager().closeEditor(fileInput);
                }
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err, function () {
                    if (errCode == 32031) {
                        Studio.getResourceManager()
                            .fetchFile(fileInput.getProjectId(), fileInput.getFileId())
                            .then(function (file) {
                                Studio.getInstance().reloadResource(function () {
                                    Studio.getLayoutManager().openEditor(file);
                                });
                            })
                            .catch(function (err) {
                                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                            });
                    }
                });
            });
    };

    Editor.prototype.getPrimaryErrorCode = function (err) {
        var json = err.responseJSON;
        if (json && json.errors && json.errors.length > 0) {
            return json.errors[0].code;
        }
    };

    Editor.prototype.initEditorSelectionChangeListener = function () {
        var _this = this;
        this.$mainControl.bind('editorSelectionChanged', function (event, selection) {
            _this.getModelLayoutManager().handleEditorSelectionChange(selection);
        });
    };

    Editor.prototype.initUDFChangeListener = function () {
    };

    Editor.prototype.fireUDFChanged = function (selection) {
    };

    Editor.prototype.setSelection = function (selection) {
    };

    Editor.prototype.addToLibrary = function (template) {
    };

    Editor.prototype.addToClipboard = function (template) {
    };

    Editor.prototype.resize = function () {
    };

    Editor.prototype.createToolbar = function () {
        if (Brightics.VA.Core.Interface.Toolbar[this.options.clazz]
            && typeof Brightics.VA.Core.Interface.Toolbar[this.options.clazz] === 'function') {
            this.toolbar =
                new Brightics.VA.Core.Interface.Toolbar[this.options.clazz](
                    this.$mainControl.find('.brtc-style-editor-toolbar-area'),
                    {editor: this}
                );
        }
    };

    Editor.prototype.destroy = function () {
        console.error('destroy must be implemented.');
    };

    Editor.prototype.getToolbar = function () {
        return this.toolbar;
    };

    Editor.prototype.getModelLayoutManager = function () {
        return this.modelLayoutManager;
    };

    Editor.prototype.getSideBarManager = function () {
        return this.sideBarManager;
    };

    Editor.prototype.getMainArea = function () {
        console.error('getMainArea must be implemented.');
    };

    Editor.prototype.getHeaderArea = function () {
        console.error('getHeaderArea must be implemented.');
    };

    Editor.prototype.getLeftTabBarArea = function () {
        console.error('getLeftTabBarArea must be implemented.');
    };

    Editor.prototype.getRightTabBarArea = function () {
        console.error('getRightTabBarArea must be implemented.');
    };

    Editor.prototype.preProcess = function () {
        return Promise.resolve();
    };

    Editor.prototype.registerCommandCallback = function () {
        this.getCommandManager().registerCallback(Studio.getInstance().onCommand.bind(Studio.getInstance()));
        this.getCommandManager().registerCallback(this.save.bind(this));
    };

    Editor.prototype.getCommandManager = function () {
        this.commandManager = this.commandManager || new Brightics.VA.Core.CommandManager(this.options.editorInput.getContents(), this);
        return this.commandManager;
    };

    Editor.prototype.addCommandListener = function (callback) {
        this.getCommandManager().registerCallback(callback);
    };

    Editor.prototype.removeCommandListener = function (callback) {
        this.getCommandManager().unRegisterCallback(callback);
    };

    Editor.prototype.addGoHistoryListener = function (callback) {
        this.getCommandManager().registerGoHistoryCallback(callback);
    };

    Editor.prototype.removeGoHistoryListener = function (callback) {
        this.getCommandManager().unRegisterGoHistoryCallback(callback);
    };

    Editor.prototype.getModelClazz = function () {
        return this.options.clazz;
    };

    Editor.prototype.getEditorInput = function () {
        return this.options.editorInput;
    };

    Editor.prototype.getModel = function () {
        return this.options.editorInput.getContents();
    };

    Editor.prototype.getActiveModel = function () {
        return this.getModel();
    };

    Editor.prototype.updateStatus = function () {
    };

    Editor.prototype.openSidebar = function () {
        if (this.sideBarManager) this.sideBarManager.openAll();
    };

    Brightics.VA.Core.Editors.Editor = Editor;

}).call(this);
