(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var MODULE = window.__module__;

    function Studio(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};

        Brightics.VA.Env.Session.userId = this.options.userId;
        Brightics.VA.Env.Session.permissions = this.options.permissions;
        Brightics.VA.Env.Session.logLevel = this.options.logLevel;

        var isPublish = this.options.isPublish || false;

        if (!isPublish) {
            Brightics.VA.Core.Utils.ModelUtils.initDefaultModelContents();
            this.getResourceManager().build()
                .then(function () {
                    _retrieveParent.call(this);
                    _initWindow.call(this);
                    _createControls.call(this);

                    _initDebugListener.call(this);
                    _initWidgetConfiguration.call(this);
                    _initMessageInfo.call(this);
                    _initPreference.call(this);

                    _initAddonFunctions.call(this);
                }.bind(this))
                .catch(function (err) {
                    console.error(err);
                    throw err;
                });
        }
    }

    var _retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    var _initWindow = function () {
        var _this = this;
        var permissions = $.map(Brightics.VA.Env.Session.permissions || [], function (n, i) {
            return n.permission_id;
        });
        $('body').attr('perm', permissions.join(' '));

        if (Brightics.VA.SettingStorage.getValue('common.scroll.indicate.mouseover') !== 'true') $('body').addClass('scroll-always');
        else $('body').removeClass('scroll-always');

        $(window).on('beforeunload', function (evt) {
            return 'Are you sure you want to leave?';
        });

        $(window).on('unload', function () {
            if (_this.options.immediatelyClearData) Brightics.VA.Core.GarbageCollector.immediatelyClearData();
        });

        $(document).bind('contextmenu', function (e) {
            return false;
        });
    };

    var _createControls = function () {
        var _this = this;
        this.$mainControl = $(
            crel('div', {class: 'brtc-va-studio'},
                crel('div', {class: 'brtc-va-studio-top-area'}),
                crel('dlv', {class: 'brtc-va-studio-body-area'},
                    crel('div', {class: 'brtc-va-studio-editor-area'})
                ),
                crel('dlv', {class: 'brtc-va-workspace-body-area'}),
                crel('dlv', {class: 'brtc-va-studio-bottom-area'})
            )
        );
        this.$parent.append(this.$mainControl);

        var $topArea = this.$mainControl.find('.brtc-va-studio-top-area');
        this.menuBar = new Brightics.VA.Core.Tools.MenuBar($topArea, {
            width: '100%',
            height: '100%',
            selectedProject: this.options.selectedProject
        });

        var $bottomArea = this.$mainControl.find('.brtc-va-studio-bottom-area');
        this.statusBar = new Brightics.VA.Core.Tools.StatusBar($bottomArea, {
            height: '100%'
        });

        var $editorArea = this.$mainControl.find('.brtc-va-studio-editor-area');
        this.editorContainer = new Brightics.VA.Core.Editors.EditorContainer($editorArea, {
            width: '100%',
            height: '100%'
        });

        var $projectViewerArea = this.$mainControl.find('.brtc-va-workspace-body-area');
        this.projectViewer = new Brightics.VA.Workspace.ProjectViewer($projectViewerArea, {
            resourceManager: _this.getResourceManager(),
            selectedProject: _this.options.selectedProject,
            close: function (result) {
                _this.setChartContentAddedReport([]);
                if (result.selectedProject && result.selectedFiles.length > 0) {
                    var editorInput = _this.getResourceManager()
                        .getFile(result.selectedProject, result.selectedFiles[0]);
                    _this.getLayoutManager().openEditor(editorInput);
                } else {
                    _this.getLayoutManager().hideProjectViewer();
                }
            }
        });

        this.getResourceManager().on('project:delete',
            this.getLayoutManager().handleProjectDelete.bind(this.getLayoutManager()));
        this.getResourceManager().on('project:change',
            this.getLayoutManager().handleProjectChange.bind(this.getLayoutManager()));
        this.getResourceManager().on('file:delete',
            this.getLayoutManager().handleFileDelete.bind(this.getLayoutManager()));
        this.getResourceManager().on('file:change',
            this.getLayoutManager().handleFileChange.bind(this.getLayoutManager()));

        this.getLayoutManager().registerProjectViewer(this.projectViewer);
        this.getLayoutManager().registerEditorTab(this.menuBar.editorTab);
        this.getLayoutManager().initLayout();
    };

    var _initDebugListener = function () {
        this.$mainControl.bind('debug', function (event, eventData) {
            var fnUnit, table, model;
            if (eventData.eventType == 'BEGIN-UNIT') {
                var models = eventData.launchOptions.originalModels;
                for (var m in models) {
                    model = models[m];
                    fnUnit = model.getFnUnitById(eventData.fid);
                    if (fnUnit) {
                        for (var i in fnUnit[OUT_DATA]) {
                            table = fnUnit[OUT_DATA][i];
                            Brightics.VA.Core.DataQueryTemplate.removeCache(model.mid, table);
                        }
                    }
                }
            }
        });
    };

    var _initWidgetConfiguration = function () {
        Brightics.VA.Core.Widget.Configurator.setCodeMirrorConfiguration();
    };

    var _initMessageInfo = function () {
        Brightics.VA.Core.Utils.MessageUtils.initMessage();
        Brightics.VA.Core.Utils.MessageUtils.initFunctionLabel();
    };

    var _initPreference = function () {
        this.getPreference().init();
    };

    var _initAddonFunctions = function () {
        this.addonFunctionManager = new Brightics.VA.Core.AddonFunctionManager();
        this.addonFunctionManager.init();
    };

    var _refreshAddonFunctions = function (cb) {
        this.addonFunctionManager.init(cb);
    }

    Studio.prototype.getValidator = function () {
        this.validator = this.validator || {};
        for (var clazz in Brightics.VA.Core.Interface.Validator) {
            var Validator = Brightics.VA.Core.Interface.Validator[clazz];
            this.validator[clazz] = new Validator({studio: this});
        }

        return this.validator;
    };

    Studio.prototype.getResourceManager = function () {
        return MODULE.ResourceManager;
    };

    Studio.prototype.getResourceService = function () {
        return MODULE.ResourceService;
    };

    Studio.prototype.getSession = function () {
        return Brightics.VA.Env.Session;
    };

    Studio.prototype.getLayoutManager = function () {
        this.layoutManager = this.layoutManager || new Brightics.VA.LayoutManager();
        return this.layoutManager;
    };

    Studio.prototype.getPreference = function () {
        this.preference = this.preference || new Brightics.VA.Preference();
        return this.preference;
    };

    Studio.prototype.getJobExecutor = function () {
        this.modelLauncherManager = this.modelLauncherManager || new Brightics.VA.Core.ModelLauncherManager(this);
        return this.modelLauncherManager;
    };

    Studio.prototype.getEditorContainer = function () {
        return this.editorContainer;
    };

    Studio.prototype.getActiveEditor = function () {
        return this.getEditorContainer().getActiveModelEditor();
    };

    Studio.prototype.getClipboardManager = function () {
        this.clipboardManager = this.clipboardManager || new Brightics.VA.Core.Tools.Manager.ClipboardManager();
        return this.clipboardManager;
    };

    Studio.prototype.addDebugListener = function (callback) {
        this.$mainControl.bind('debug', callback);
    };

    Studio.prototype.fireDebugEvent = function (event) {
        this.$mainControl.trigger('debug', [event]);
    };

    Studio.prototype.removeDebugListener = function (callback) {
        this.$mainControl.unbind('debug', callback);
    };

    Studio.prototype.addResourceChangedListener = function (callback) {
        this.$mainControl.bind('resourceChanged', callback);
    };

    Studio.prototype.removeResourceChangedListener = function (callback) {
        this.$mainControl.unbind('resourceChanged', callback);
    };

    Studio.prototype.onCommand = function (command) {
        this.doValidate(command.options.analyticsModel);
    };

    Studio.prototype.addProblemListener = function (callback) {
        this.$mainControl.bind('onProblem', callback);
    };

    Studio.prototype.fireProblemEvent = function (mid, problemList) {
        this.$mainControl.trigger('onProblem', [mid, problemList]);
    };

    Studio.prototype.removeProblemListener = function (handler) {
        this.$mainControl.unbind('onProblem', handler);
    };

    //no more Front-End validation, but Runtime only
    Studio.prototype.doValidate = function (analyticsModel, options) {
        // var _this = this;
        // this.validationJob = this.validationJob || {};
        // if (this.validationJob && this.validationJob[analyticsModel.mid]) {
        //     clearTimeout(_this.validationJob[analyticsModel.mid]);
        //     _this.validationJob[analyticsModel.mid] = null;
        // }
        // this.validationJob[analyticsModel.mid] = setTimeout(function () {
        //     var type = analyticsModel.type || 'data';
        //     var problems = _this.getValidator()[type].validate(analyticsModel, options);
        //     _this.fireProblemEvent(analyticsModel.mid, problems);
        // }, 1000);
    };

    Studio.prototype.reloadResource = function (callback) {
        _refreshAddonFunctions.bind(this)(callback);
    };

    Studio.prototype.setChartContentAddedReport = function (selectedModels) {
        this.projectViewer.setChartContentAddedReport(selectedModels);
    };

    Studio.prototype.getControl = function () {
        return this.$mainControl;
    };

    Brightics.VA.Studio = Studio;
}).call(this);
