(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');

    function ModelLauncherManager() {
        this.jobScheduler = {};
        this.createControls();
    }

    ModelLauncherManager.prototype.createControls = function () {
        this.launchers = {};
        for (var clazz in Brightics.VA.Core.Interface.Launcher) {
            this.launchers[clazz] = new Brightics.VA.Core.Interface.Launcher[clazz]();
        }
    };

    ModelLauncherManager.prototype.terminate = function (jobId, clazz) {
        if (clazz && this.launchers[clazz]) {
            this.launchers[clazz].terminate(jobId);
        } else {
            for (var i in this.launchers) {
                this.launchers[i].terminate(jobId);
            }
        }
    };

    ModelLauncherManager.prototype.prepareLaunch = function () {
        Studio.getEditorContainer().getActiveModelEditor().prepareLaunch();
    };

    ModelLauncherManager.prototype.launchModel = function (model, args, options, listeners) {
        try {
            var _listeners = {
                'catch': [function (err) {
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                }]
            };
            this._extendListeners(_listeners, listeners);
            this.launchers[model.type].launchModel(model, args, options, listeners);
        } catch (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Cannot execute the flow. It contains invalid contents.');
        }
    };

    ModelLauncherManager.prototype.launchUnit = function (fnUnit, args, options, listeners) {
        var model = fnUnit.parent().getMainModel();
        var _this = this, args = args || {}, options = options || {}, clazz = model.type;

        var outTable = FnUnitUtils.getOutTable(fnUnit);
        for (var i in outTable) {
            Brightics.VA.Core.DataQueryTemplate.removeCache(model.mid, outTable[i]);
        }

        var regex = /\$\{=(?:[a-zA-Z_])(?:[a-zA-Z0-9_]*)\}/,
            regexComment = /"(\\[\s\S]|[^"])*"|'(\\[\s\S]|[^'])*'|(--.*|\/\/.*|\/\*[\s\S]*?\*\/)/gm,
            needToSetVariable = false;
        for (let key in fnUnit.param) {
            var value = typeof fnUnit.param[key] == 'string' ? fnUnit.param[key] : JSON.stringify(fnUnit.param[key]);
            var replaced = value.replace(regexComment, function (match, g1, g2, g3) {
                if (g1) return match;
                if (g2) return match;
                if (g3) return '';
            });
            var ret = regex.exec(replaced);
            var keyword = ['${=true}', '${=false}'];

            if (ret && ret.length > 0) {
                if (keyword.indexOf(ret[0]) === -1) {
                    needToSetVariable = true;
                    break;
                }
            }
        }

        var _listeners = {
            'catch': [function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            }]
        };
        this._extendListeners(_listeners, listeners);

        var launch = function (dialogResult) {
            var _args = dialogResult ? dialogResult.args : args;
            _this.launchers[clazz].launchUnit(fnUnit, _args, options, _listeners);
        };


        var dialogOptions = {
            close: function (dialogResult) {
                if (dialogResult.OK) launch(dialogResult);
            },
            analyticsModel: model
        };


        if (!needToSetVariable &&
                model.variableRef &&
                model.variableRef.length) {
            for (var j in model.variableRef) {
                var gvFid = model.variableRef[j].fid;
                if (gvFid === fnUnit.fid) {
                    needToSetVariable = true;
                    break;
                }

                if (fnUnit[FUNCTION_NAME] === 'Subflow') {
                    for (var k in fnUnit.param.functions) {
                        if (gvFid === fnUnit.param.functions[k].fid) {
                            needToSetVariable = true;
                            break;
                        }
                    }
                }
                if (needToSetVariable) break;
            }
        }


        if (needToSetVariable) {
            var appendTo = Studio.getEditorContainer().getActiveModelEditor().getMainArea();
            if (model.variables && Object.keys(model.variables).length > 0) {
                if (clazz === 'realtime') {
                    if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true') {
                        new Brightics.VA.Core.Dialogs.RunRealTimeDialog(appendTo, dialogOptions);
                    } else {
                        let defaultArgs = {};
                        for (let key in model.variables) {
                            let gvDef = model.variables[key];
                            let temp;
                            if (gvDef.type.indexOf('array') > -1 &&
                                    gvDef.value.length == 1) {
                                temp = gvDef.value[0];
                            } else {
                                temp = gvDef.value;
                            }

                            if (!_.isUndefined(temp)) defaultArgs[key] = gvDef.value;
                        }
                        launch({
                            OK: true,
                            args: defaultArgs
                        });
                    }
                } else if (clazz === 'etl') {
                    new Brightics.VA.Implementation.ETLFlow.Dialogs.LaunchProgressDialog(appendTo, dialogOptions);
                } else {
                    if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true') {
                        new Brightics.VA.Core.Dialogs.RunDataDialog(appendTo, dialogOptions);
                    } else {
                        let defaultArgs = {};
                        for (var key in model.variables) {
                            let gvDef = model.variables[key];
                            let temp;
                            if (_.isArray(gvDef.value) && gvDef.value.length === 1) {
                                temp = gvDef.value[0];
                            } else {
                                temp = gvDef.value;
                            }

                            if (!_.isUndefined(temp)) defaultArgs[key] = gvDef.value;
                        }
                        launch({
                            OK: true,
                            args: defaultArgs
                        });
                    }
                }
            } else {
                setTimeout(function () {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Variables are required to run the function.');
                }, 100);
            }
        } else {
            launch();
        }
    };

    ModelLauncherManager.prototype.stopCheckModel = function () {
        this.launchers['deeplearning'].stopCheckModel();
    };

    ModelLauncherManager.prototype._extendListeners = function (defaultListeners, listeners) {
        var _listeners = defaultListeners;
        for (var type in listeners) {
            var listener = listeners[type];
            if (listener) {
                if ($.isArray(listener)) {
                    listener.forEach(function (fn) {
                        if (!_listeners[type]) _listeners[type] = [];
                        _listeners[type].push(fn);
                    })
                }
                else if (typeof listener === 'function') {
                    if (!_listeners[type]) _listeners[type] = [];
                    _listeners[type].push(listener);
                }
            }
        }
    };

    Brightics.VA.Core.ModelLauncherManager = ModelLauncherManager;
}).call(this);