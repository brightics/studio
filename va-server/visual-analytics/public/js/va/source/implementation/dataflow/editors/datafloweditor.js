/**
 * Created by sungjin1.kim on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var TabChannel = brtc_require('TabChannel');

    function DataFlowEditor(parentId, options) {
        this._migrateDefaultLocaleLabel(options);
        Brightics.VA.Core.Editors.ModelEditor.call(this, parentId, options);
        this.initUDFChangeListener();
        this.initTemplateChangeListener();
        this.initTabChannel();
    }

    DataFlowEditor.prototype = Object.create(Brightics.VA.Core.Editors.ModelEditor.prototype);
    DataFlowEditor.prototype.constructor = DataFlowEditor;

    DataFlowEditor.prototype.createPanelFactory = function () {
        this.panelFactory = new Brightics.VA.Implementation.DataFlow.Editors.Sheet.PanelFactory();
    };

    DataFlowEditor.prototype.addToLibrary = function (template) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.AddToLibraryDialog(this.$mainControl, {
            close: function (event) {
                if (event.OK) {
                    var opt = {
                        library_id: event.library,
                        label: event.label,
                        contents: template,
                        description: ''
                    };
                    _this.modelLayoutManager.handleAppendTemplate(opt);
                }
            },
            title: Brightics.locale.common.addToTemplate
        });
    };

    DataFlowEditor.prototype.addToFunctionClipboard = function (template) {

        if (template.functions.length > 0) {
            var opt = {
                width: $('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected').width(),
                height: $('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected').height(),
                contents: template
            };

            Studio.getClipboardManager().addFunctionToClipboard(opt);
        }
    };


    DataFlowEditor.prototype._migrateDefaultLocaleLabel = function (options) {
        let contents = options.editorInput.data.contents;
        if(contents && contents.functions) {
            contents.functions.forEach(f => this._setDefaultLocaleLabel(f))
        }

        const innerModelsId = Object.keys(contents.innerModels);

        for(let innerId of innerModelsId){
            let innerContents = contents.innerModels[innerId];
            if(innerContents && innerContents.functions) {
                innerContents.functions.forEach(f => this._setDefaultLocaleLabel(f))
            }
        }
    };

    DataFlowEditor.prototype._setDefaultLocaleLabel = function (func) {
        const currentLang = Brightics.VA.SettingStorage.getCurrentLanguage();
        const lib = Brightics.VA.Core.Functions.Library;
        const otherLang = currentLang === 'ko' ? 'en' : 'ko';

        try {
            if(func.display && func.display.label && lib[func.func]) {
                let currentLabel = func.display.label;
                let defaultFnUnit = lib[func.func].defaultFnUnit;
                let defaultLabel = defaultFnUnit.label;
                if(defaultLabel && currentLabel === defaultLabel[otherLang]){
                    func.display.label = defaultLabel[currentLang];
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }


    DataFlowEditor.prototype.initUDFChangeListener = function () {
        var _this = this;

        this.$mainControl.bind('udfChanged', function (event, selction) {
            _this.fireUDFChanged(selction);
        });
    };

    DataFlowEditor.prototype.initTemplateChangeListener = function () {
        var _this = this;

        this.$mainControl.bind('templateChanged', function (event, selction) {
            _this.fireTemplateChanged(selction);
        });
    };

    DataFlowEditor.prototype.initTabChannel = function () {
        var self = this;
        self.tabChannel = new TabChannel(Date.now());
        self.tabChannel.listen('multi-chart', function (req) {
            self.getCommandManager()
                .execute(new Brightics.VA.Core.Editors.Diagram.Commands
                    .UpdateMultiChartOptionCommand(self, {
                        fid: req.value.fid,
                        cid: req.value.cid,
                        value: req.value.multiChartOption
                    }));
            return {success: true};
        });
    };

    DataFlowEditor.prototype.fireUDFChanged = function (selection) {
        this.modelLayoutManager.handleUDFChanged(selection);
    };

    DataFlowEditor.prototype.fireTemplateChanged = function (selection) {
        this.modelLayoutManager.handleTemplateChanged(selection);
    };

    DataFlowEditor.prototype.preProcess = function (_options) {
        var options = _options || {};
        var projectId = this.getEditorInput().getProjectId();
        var mainModel = this.getModel();
        return Brightics.VA.Core.Utils.NestedFlowUtils.makeRunnable(projectId, mainModel, options)
            .then(function (r) {
                return r;
            })
            .catch(console.error);
    };

    DataFlowEditor.prototype.getConnectionKey = function () {
        return this.tabChannel.getConnectionKey();
    };

    Brightics.VA.Implementation.DataFlow.Editor = DataFlowEditor;
}).call(this);
