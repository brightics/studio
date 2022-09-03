/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    root.Brightics.VA.Implementation.DataFlow.Utils.RunnableFactory = (function () {
        var substituteVariable = function (mainModel, variableRef) {
            var substituteFunction = function (fn) {
                if (fn[FUNCTION_NAME] === 'Subflow') {
                    fn.param.functions = _.map(fn.param.functions, substituteFunction);
                }
                var matched = _.filter(variableRef, function (ref) {
                    return ref.fid === fn.fid;
                });
                _.forEach(matched, function (ref) {
                    _.forIn(ref.param, function (variableName, key) {
                        fn.param[key] = '${=' + variableName + '}';
                    });
                });
                return fn;
            };

            var rec = function (model) {
                model.functions = _.map(model.functions, substituteFunction);
                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils
                    .getChildModels(mainModel, model);
                _.forEach(subModels, rec);
            };
            return rec(mainModel);
        };

        var offSkipProperty = function (model) {
            var off = function (mod) {
                mod.functions = _.map(mod.functions, function (fn) {
                    var category = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fn.func).category;
                    fn.skip = (category === 'brightics')? fn.skip : false;
                    return fn;
                });
            };

            off(model);
            _.forIn(model.innerModels, off);
        };

        return {
            // TODO : Varaible assign
            createForUnit: function (fnUnit, jid, user, args, options) {
                var execUnit = $.extend(true, {}, fnUnit);
                Brightics.VA.Core.Utils.ModelUtils.checkAndRemoveOptionalInputs(execUnit);

                // TODO : Submodel fnUnit Persist
                Brightics.VA.Core.Utils.ModelUtils.carvePersist(execUnit, true);
                // Brightics.VA.Core.Utils.ModelUtils.deleteDisplay(execUnit);
                Brightics.VA.Core.Utils.ModelUtils.deleteEmptyArray(execUnit);

                var parentModel = fnUnit.parent();

                var mid = parentModel.mid;

                var mainModel = parentModel.getMainModel();
                var variables = _.cloneDeep(mainModel.variables);
                var variableRef = _.cloneDeep(mainModel.variableRef);                

                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils
                    .getAllSubModelsFromFnUnit(mainModel, fnUnit).map(function (model) {
                        var ret = {};
                        ret[model.mid] = model;
                        return ret;
                    });

                var innerModels = _.cloneDeep(_.reduce(subModels, _.merge, {}));
                var optModels = _.cloneDeep(mainModel.optModels);

                var dummyModel = {
                    mid: mid,
                    type: 'data',
                    variables: variables,
                    functions: [execUnit],
                    links: [],
                    innerModels: innerModels,
                    optModels: optModels,
                    title: parentModel.title
                };

                Brightics.VA.Core.Utils.ModelUtils.extendModel(dummyModel);

                return Brightics.VA.Core.Utils.ModelUtils
                    .exportAsRunnablePromise(mainModel, dummyModel)
                    .then(function (runnable) {
                        var newDummyModel =
                            Brightics.VA.Core.Utils.ModelUtils.exportAsRunnable(dummyModel);
                        
                        runnable.models[dummyModel.mid] =
                            newDummyModel;
                        _.forIn(args, function (values, key) {
                            if (newDummyModel.variables[key]) {
                                newDummyModel.variables[key].value = values;
                            }
                        });

                        newDummyModel.variableRef = variableRef;
                        _.forIn(runnable.models, function (model) {
                            substituteVariable(model, model.variableRef);
                        });
                        offSkipProperty(newDummyModel);
                        runnable.main = mid;

                        return Brightics.OptModelManager.buildOptRunnable(runnable);
                    }).catch(console.error);
            },
            createForFlow: function (_model, jid, user, args, options) {
                var model = _.cloneDeep(_model);
                var mainModel = model.getMainModel();
                var variables = _.cloneDeep(mainModel.variables);
                var variableRef = _.cloneDeep(mainModel.variableRef);
                return Brightics.VA.Core.Utils.ModelUtils
                    .exportAsRunnablePromise(mainModel, model)
                    .then(function (runnable) {
                        model = runnable.models[runnable.main];
                        model.variables = variables;
                        var newModel =
                        Brightics.VA.Core.Utils.ModelUtils.exportAsRunnable(model);
                        
                        runnable.models[runnable.main] = newModel;
                        offSkipProperty(newModel);

                        newModel.variableRef = variableRef;
                        _.forIn(runnable.models, function (model) {
                            substituteVariable(model, model.variableRef);
                        });
                        _.forIn(args, function (values, key) {
                            if (newModel.variables[key]) {
                                newModel.variables[key].value = values;
                            }
                        });
                        return Brightics.OptModelManager.buildOptRunnable(runnable);
                    })
                    .catch(console.error);
            }
        };
    }());
}).call(this);
