/* -----------------------------------------------------
 *  nested-flow-utils.js
 *  Created by hyunseok.oh@samsung.com on 2018-03-21.
 * ---------------------------------------------------- */

/* global _, FUNCTION_NAME, SOURCE_FID, TARGET_FID, Studio, brtc_require, IN_DATA, OUT_DATA */
(function (root, _) {
    'use strict';
    var Brightics = root.Brightics;
    var Dao = brtc_require('Dao');

    var FILE = 'file';
    var VERSION = 'version';

    var CHANGE_IN_TABLE_PARAM_KEYS = ['df-names'];

    var getAdjacencyLists = function (model, fids) {
        var adjacencyLists = {};
        _.forEach(fids, function (fid) {
            adjacencyLists[fid] = getAdjacencyList(model, fid);
        });
        return adjacencyLists;
    };

    var getAdjacencyList = function (model, fid) {
        var links = _.filter(model.links, function (link) {
            return link[SOURCE_FID] === fid;
        });

        var list = _.map(links, function (link) {
            return link[TARGET_FID];
        });

        return list;
    };

    var getConditionMids = function (conditionFn) {
        var ret = [];
        if (conditionFn.param.if) ret.push(conditionFn.param.if.mid);
        if (conditionFn.param.elseif) {
            _.forEach(conditionFn.param.elseif, function (elif) {
                ret.push(elif.mid);
            });
        }
        ret.push(conditionFn.param.else.mid);
        return ret;
    };

    var getChildModels = function (_parentModel, model) {
        var models = [];
        var mainModel = _parentModel.getInnerModel ? _parentModel : _parentModel.getMainModel();
        _.forEach(model.functions, function (fn) {
            if (fn.func === 'if') {
                var mids = getConditionMids(fn);
                _.forEach(mids, function (mid) {
                    models.push(mainModel.getInnerModel(mid));
                });
            } else if (fn.func === 'forLoop' || fn.func === 'whileLoop') {
                models.push(mainModel.getInnerModel(fn.param.mid));
            }
        });
        return _.filter(models, _.negate(_.isUndefined));
    };

    var getAllSubModelsFromModel = function (mainModel, model) {
        var subModels = getChildModels(mainModel, model);
        return _.flatten(subModels.concat(
            _.map(subModels, _.partial(getAllSubModelsFromModel, mainModel))
        ));
    };

    var getAllSubModelsFromFnUnit = function (mainModel, fnUnit) {
        var subModels = getSubModels(mainModel, fnUnit);
        return _.flatten(subModels.concat(
            _.map(subModels, _.partial(getAllSubModelsFromModel, mainModel))
        ));
    };

    var _getKey = function (modelId, versionId) {
        return modelId + '_' + versionId;
    };

    var getChildFlowsMeta = function (model) {
        var models = getChildModels(model, model).concat(model);
        var ret = [];
        models.forEach(function (m) {
            m.functions.forEach(function (fn) {
                if (fn[FUNCTION_NAME] === 'Flow') {
                    var mid = fn.param.mid;
                    var versionId = fn.param.versionId;
                    if (mid && versionId) {
                        ret.push({
                            type: VERSION,
                            mid: mid,
                            versionId: versionId
                        });
                    } else if (mid) {
                        ret.push({
                            type: FILE,
                            mid: mid
                        });
                    }
                }
            });
        });
        return ret;
    };

    var getChildFlows = function (projectId, mainModel, withoutVersion) {
        var models = {};
        var visited = {};

        var traverseInto = function (__getKey) {
            return function (r) {
                if (!r) return;
                var nxtModel = r.getContents();
                models[__getKey(r)] = nxtModel;
                return rec(nxtModel, nxtModel);
            };
        };

        var traverseIntoVersion = traverseInto(function (v) {
            return _getKey(v.getFileId(), v.getVersionId());
        });

        var traverseIntoFile = traverseInto(function (f) {
            return f.getFileId();
        });

        var rec = function (main, model) {
            var ret = [];
            _.forEach(model.functions, function (fn) {
                var key;
                if (fn[FUNCTION_NAME] !== 'Flow') return;
                var mid = fn.param.mid;
                var vid = fn.param.versionId;
                if (mid && vid) {
                    if (!withoutVersion) {
                        key = _getKey(mid, vid);
                        if (!visited[key]) {
                            visited[key] = true;
                            ret.push(Dao.VersionDao.getVersion(projectId, mid, vid)
                                .then(traverseIntoVersion));
                        }
                    }
                } else if (mid) {
                    key = mid;
                    if (!visited[key]) {
                        visited[key] = true;
                        ret.push(Dao.FileDao.getFile(projectId, mid).then(traverseIntoFile));
                    }
                }
            });

            var subModels = getChildModels(main, model);
            _.forEach(subModels, function (mod) {
                ret.push(rec(main, mod));
            });
            return Promise.all(ret);
        };

        return rec(mainModel, mainModel).then(function () {
            var keys = _.keys(models);
            _.forIn(keys, function (key) {
                if (_.isUndefined(models[key])) models = _.omit(models, key);
            });
            return models;
        });
    };

    var getParentModel = function (mainModel, model) {
        if (_.has(model, 'innerModels')) {
            // main model;
            return model;
        }
        var rec = function (subModel) {
            var children = getChildModels(mainModel, subModel);
            for (var i = 0; i < children.length; i++) {
                if (children[i].mid === model.mid) {
                    return subModel;
                }
                var res = rec(children[i]);
                if (res) {
                    return res;
                }
            }
            return undefined;
        };

        return rec(mainModel);
    };

    var getParentModelByFid = function (mainModel, fid) {
        var rec = function (subModel) {
            var fns = subModel.functions;
            for (var i = 0; i < fns.length; i++) {
                var fn = fns[i];
                if (fn.fid === fid) {
                    return subModel;
                }
            }

            var models = getChildModels(mainModel, subModel);
            for (var j = 0; j < models.length; j++) {
                var res = rec(models[j]);
                if (res) {
                    return res;
                }
            }

            return undefined;
        };

        return rec(mainModel);
    };

    var getConnectedFnUnits = function (mainModel, fnUnit) {
        var parentModel = getParentModelByFid(mainModel, fnUnit.fid);
        var adj = getAdjacencyList(parentModel, fnUnit.fid);
        var res = [];
        var fns = parentModel.functions;
        for (var i = 0; i < fns.length; i++) {
            if (_.indexOf(adj, fns[i].fid) > -1) {
                res.push(fns[i]);
            }
        }
        return res;
    };

    var forEachConditionModels = function (mainModel, conditionFn, fn) {
        var modelIds = getConditionMids(conditionFn);
        _.forEach(modelIds, function (mid) {
            var model = mainModel.getInnerModel(mid);
            fn(model);
        });
    };

    var getLoopModels = function (mainModel, loopFn) {
        return [mainModel.getInnerModel(loopFn.param.mid)];
    };

    var getConditionModels = function (mainModel, conditionFn) {
        var models = [];
        forEachConditionModels(mainModel, conditionFn, function (model) {
            models.push(model);
        });
        return models;
    };

    var getSubModels = function (mainModel, fnUnit) {
        var ret = (function () {
            if (!fnUnit) return mainModel;
            if (fnUnit.func === 'forLoop' || fnUnit.func === 'whileLoop') {
                return getLoopModels(mainModel, fnUnit);
            } else if (fnUnit.func === 'if') {
                return getConditionModels(mainModel, fnUnit);
            }
            return [];
        }());

        return _.filter(ret, _.negate(_.isUndefined));
    };

    var calcNextFnUnitOutTableSize = function (mainModel, fnUnit, updatedModelId, diff) {
        var models = getSubModels(mainModel, fnUnit);
        var maxSize = 0;
        for (var i = 0; i < models.length; i++) {
            maxSize = parseInt(Math.max(maxSize,
                (models[i][OUT_DATA] ? models[i][OUT_DATA].length : 0) +
                (updatedModelId === models[i].mid ? diff : 0)));
        }
        return maxSize;
    };

    var createAdjustOutTableCommand = function (
            eventSource,
            mainModel,
            targetFnUnit,
            targetTableLength) {
        var commands = [];
        var curLength = targetFnUnit[OUT_DATA].length;

        while (curLength < targetTableLength) {
            commands.push(new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(
                eventSource,
                {
                    target: targetFnUnit,
                    path: [OUT_DATA, curLength],
                    value: Brightics.VA.Core.Utils.IDGenerator.table.id()
                }));
            curLength++;
        }

        var filterTids = function (target) {
            return function (t) {
                return target !== t;
            };
        };

        while (curLength > targetTableLength) {
            curLength--;
            commands.push(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand(
                eventSource,
                {
                    target: targetFnUnit,
                    path: [OUT_DATA, curLength]
                }));

            var tid = targetFnUnit[OUT_DATA][curLength];
            var connectedFnUnits = Brightics.VA.Core.Utils.NestedFlowUtils.getConnectedFnUnits(
                mainModel,
                targetFnUnit
            );

            for (var i = 0; i < connectedFnUnits.length; i++) {
                var fnUnit = connectedFnUnits[i];

                var newTable = _.filter(fnUnit[IN_DATA], filterTids(tid));

                commands.push(
                    new Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand(
                        eventSource,
                        {
                            fnUnit: fnUnit,
                            ref: {
                                'inData': newTable
                            }
                        }
                    )
                );

                var cmd = createSetFnUnitCommand(eventSource, fnUnit, newTable);
                if (cmd) {
                    commands.push(cmd);
                }
            }
        }
        return commands;
    };


    var createSetFnUnitCommand = function (eventSource, fnUnit, paramValue) {
        var isParamChanged = false;

        var commandOption = {
            fnUnit: fnUnit,
            ref: {
                param: {}
            }
        };

        var paramKeys = Object.keys(fnUnit.param);
        for (const key of paramKeys) {
            if (CHANGE_IN_TABLE_PARAM_KEYS.indexOf(key) > -1) {
                isParamChanged = true;
                commandOption.ref.param[key] = paramValue;
            }
        }

        if (isParamChanged) {
            var setFnUnitCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(
                eventSource, commandOption);
            return setFnUnitCommand;
        }
    };

    var makeRunnable = function (projectId, mainModel) {
        // var options = _options || {};
        // var argsMap = options.args || {};
        return getChildFlows(projectId, mainModel)
            .then(function (models) {
                var newInnerModel = _.indexBy(getAllSubModelsFromModel(mainModel, mainModel), 'mid');
                // mainModels.innerModels = newInnerModel;
                var runnableMainModel = _.cloneDeep(mainModel);
                var runnableModels = _.cloneDeep(models);
                runnableMainModel.innerModels = newInnerModel;
                runnableModels = _.reduce(_.map(runnableModels, function (m, key) {
                    var ret = {};
                    ret[key] = Brightics.VA.Core.Utils.ModelUtils.exportAsRunnable(m);
                    return ret;
                }), _.merge, {});

                runnableModels[runnableMainModel.mid] = runnableMainModel;
                var runnable = {
                    main: runnableMainModel.mid,
                    models: runnableModels,
                    version: Brightics.VA.Env.CoreVersion
                };

                return runnable;
            }).catch(console.error);
    };

    var getNewActivityCommandOptions = function (fnUnit) {
        var ret = [];
        if (fnUnit[FUNCTION_NAME] === 'If') {
            ret.push({mid: fnUnit.param.if.mid, type: fnUnit.func, conditionType: 'if'});
            ret = ret.concat(_.map(fnUnit.param.elseif, function (elseif) {
                return {
                    mid: elseif.mid,
                    type: fnUnit.func,
                    conditionType: 'elseif'
                };
            }));
            ret.push({
                mid: fnUnit.param.else.mid,
                type: fnUnit.func,
                conditionType: 'else'
            });
        } else if (fnUnit[FUNCTION_NAME] === 'ForLoop' ||
            fnUnit[FUNCTION_NAME] === 'WhileLoop') {
            ret.push({
                mid: fnUnit.param.mid,
                type: fnUnit.func
            });
        }
        return ret;
    };

    var getFnUnitByCondition = function (mainModel, condition) {
        var rec = function (model) {
            return _.reduce(model.functions, function (prv, fn) {
                if (prv) return prv;
                if (condition(fn)) return fn;
                return rec(getSubModels(fn));
            }, _.noop() /* undefined */);
        };
        return rec(mainModel);
    };

    var isProcessFunction = function (fnUnit) {
        return ['SetValue', 'ImportData', 'ExportData'].indexOf(fnUnit[FUNCTION_NAME]) >= 0;
    };

    var getFlowGraph = function (projectId, mainModel, withModel) {
        var graph = {};
        var dfs = function (file, modelKey) {
            graph[modelKey] = {
                adj: [],
                version: file instanceof Brightics.VA.Vo.File ?
                    'Current' :
                    'v' + file.getVersion()
            };
            if (withModel) {
                graph[modelKey].model = file.getContents();
            }

            var children = getChildFlowsMeta(file.getContents()).reduce(function (acc, childInfo) {
                if (childInfo.type === FILE) {
                    acc[childInfo.mid] =
                        Studio.getResourceManager().getFile(projectId, childInfo.mid);
                } else {
                    acc[childInfo.mid + '_' + childInfo.versionId] =
                        Studio.getResourceManager()
                            .getVersion(projectId, childInfo.mid, childInfo.versionId);
                }
                return acc;
            }, {});

            _.forEach(children, function (child, key) {
                if (!graph[key]) {
                    dfs(child, key);
                }
                graph[modelKey].adj.push(key);
            });
        };
        dfs(Studio.getResourceManager().getFile(projectId, mainModel.mid), mainModel.mid);
        return graph;
    };

    var checkCycle = function (projectId, mainModel) {
        var visited = {};
        var graph = getFlowGraph(projectId, mainModel);
        var GRAY = -1;
        var BLACK = 1;
        var check = function (id) {
            visited[id] = GRAY;
            var hasCycle = _.any(graph[id].adj, function (child) {
                if (!visited[child] && check(child)) {
                    return true;
                }
                if (visited[child] === GRAY) {
                    return true;
                }
                return false;
            });
            visited[id] = BLACK;
            return hasCycle;
        };
        return check(mainModel.mid);
    };

    var getLocalOutline = function (mainModel, activeModel, activeFid) {
        var recFn = function (fn) {
            var ret = {
                type: 'fn',
                fn: fn,
                items: [],
                label: fn.display.label,
                selected: fn.fid === activeFid
            };

            if (fn[FUNCTION_NAME] === 'If') {
                var conditionsParam = [].concat(fn.param.if, fn.param.elseif, fn.param.else);
                ret.items = _.map(conditionsParam, function (param, index) {
                    var label = 'Else If';
                    if (index === 0) label = 'If';
                    if (index === conditionsParam.length - 1) label = 'Else';
                    return recModel(mainModel.getInnerModel(param.mid), label);
                });
            } else if (fn[FUNCTION_NAME] === 'ForLoop' || fn[FUNCTION_NAME] === 'WhileLoop') {
                ret.items = [recModel(mainModel.getInnerModel(fn.param.mid),
                    fn[FUNCTION_NAME] === 'ForLoop' ? 'For' : 'While')];
            }
            ret.active = _.any(_.map(ret.items, 'active'));
            return ret;
        };

        var recModel = function (model, label) {
            var items = model.functions.map(function (fn) {
                return recFn(fn);
            });

            return {
                type: 'model',
                model: model,
                items: items,
                active: model.mid === activeModel.mid || _.any(_.map(items, 'active')),
                label: label
            };
        };

        return recModel(mainModel, mainModel.title);
    };

    var getGlobalOutline = function (projectId, mainModel) {
        if (checkCycle(projectId, mainModel)) {
            throw new Error('This model contains cycle.');
        }

        var graph = getFlowGraph(projectId, mainModel, true);
        var rec = function (node) {
            return {
                id: node.model.mid,
                label: node.model.title + ' [' + node.version + ']',
                items: node.adj.map(function (nxtId) {
                    return rec(graph[nxtId]);
                })
            };
        };

        return rec(graph[mainModel.mid]);
    };

    Brightics.VA.Core.Utils.NestedFlowUtils = {
        getParentModel: getParentModel,
        getAdjacencyLists: getAdjacencyLists,
        getAdjacencyList: getAdjacencyList,
        getConnectedFnUnits: getConnectedFnUnits,
        getSubModels: getSubModels,
        createAdjustOutTableCommand: createAdjustOutTableCommand,
        calcNextFnUnitOutTableSize: calcNextFnUnitOutTableSize,
        getChildFlows: getChildFlows,
        getChildModels: getChildModels,
        makeRunnable: makeRunnable,
        getAllSubModelsFromModel: getAllSubModelsFromModel,
        getAllSubModelsFromFnUnit: getAllSubModelsFromFnUnit,
        getNewActivityCommandOptions: getNewActivityCommandOptions,
        getFnUnitByCondition: getFnUnitByCondition,
        isProcessFunction: isProcessFunction,
        checkCycle: checkCycle,
        getLocalOutline: getLocalOutline,
        getGlobalOutline: getGlobalOutline
    };

/* eslint-disable no-invalid-this */
}(this, _));
