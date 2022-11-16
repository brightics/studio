/**
 * Created by SDS on 2016-01-28.
 */


/* global _, IN_DATA, OUT_DATA, FUNCTION_NAME */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Dao = Brightics.VA.Dao;
    var ResourceManager = brtc_require('ResourceManager');
    var FnUnitUtils = brtc_require('FnUnitUtils');

    root.Brightics.VA.Core.Utils.ModelUtils = {
        extendParent: function (model, fnUnit) {
            fnUnit.parent = function () {
                return model;
            };

            if (fnUnit.param && fnUnit.param.functions) {
                for (var i in fnUnit.param.functions) {
                    if (typeof fnUnit.param.functions[i].fid !== 'undefined') {
                        this.extendParent(fnUnit, fnUnit.param.functions[i]);
                    }
                }
            }
        },
        extendMainFunc: function (mainModel, model) {
            var _this = this;
            model.getMainModel = function () {
                return mainModel;
            };
            model.isMainModel = function () {
                return this === this.getMainModel();
            };
            var subModels = Brightics.VA.Core.Utils.NestedFlowUtils
                .getChildModels(mainModel, model);
            _.forEach(subModels, _.partial(_this.extendMainFunc.bind(_this), mainModel, _));
        },
        extendModel: function (contents, doClone) {
            var _this = this;
            var model;
            var defaultModel = Brightics.VA.Core.Interface.DefaultModel[contents.type];

            if (defaultModel) {
                if (doClone) model = $.extend(true, {}, defaultModel, contents);
                else model = $.extend(true, contents, defaultModel);
                _.forIn(model.innerModels, function (subModel) {
                    _this.extendInnerModel(model, subModel);
                });
            } else {
                console.error('Create DefaultModel(' + contents.type + ')!');
                return;
            }

            model = $.extend(true, model, Brightics.VA.Default.model);
            for (var i in model.functions) {
                if (model.functions[i]) {
                    this.extendParent(model, model.functions[i]);
                    if (typeof model.functions[i]['persist-mode'] === 'undefined') {
                        model.functions[i]['persist-mode'] = 'auto';
                    }
                }
            }

            if (typeof model['persist-mode'] === 'undefined') {
                model['persist-mode'] = 'auto';
            }

            this.extendMainFunc(model, model);
            return model;
        },
        extendInnerModel: function (mainModel, contents, doClone) {
            var _this = this;
            var model;

            var defaultModel = Brightics.VA.Implementation.DataFlow.innerModel;
            if (defaultModel) {
                if (doClone) model = $.extend(true, {}, defaultModel, contents);
                else model = $.extend(true, contents, defaultModel);
            } else {
                console.error('Create DefaultModel(' + contents.type + ')!');
                return;
            }

            model = $.extend(true, model, Brightics.VA.Default.model);
            for (var i in model.functions) {
                if (model.functions[i]) {
                    this.extendParent(model, model.functions[i]);
                    if (typeof model.functions[i]['persist-mode'] === 'undefined') {
                        model.functions[i]['persist-mode'] = 'auto';
                    }
                }
            }

            if (typeof model['persist-mode'] === 'undefined') {
                model['persist-mode'] = 'auto';
            }

            this.extendMainFunc(mainModel, model);
            return model;
        },
        exportAsRunnablePromise: function (mainModel, model, withReport) {
            var projectId = ResourceManager
                .getFile(undefined, mainModel.mid).getProjectId();

            return Brightics.VA.Core.Utils.NestedFlowUtils
                .makeRunnable(projectId, model);
        },
        exportAsRunnable: function (contents, withReport) {
            var _this = this;
            var execModel = this.extendModel(contents, true);

            delete execModel.FUNC_ID_CHAR;
            delete execModel.FUNC_ID_LENGTH;
            delete execModel.preferences;
            delete execModel.problemList;
            delete execModel.sheets;
            if (typeof withReport === 'undefined' || !withReport) {
                delete execModel.report;
            }
            // delete execModel['gv-def'];

            execModel.entries = [];

            for (var j in execModel.functions) {
                let fnUnit = execModel.functions[j];
                let label = fnUnit.display.label || '';
                fnUnit.label = label;
                delete fnUnit.display;

                var previousList = fnUnit.parent().getPrevious(fnUnit.fid);
                if (previousList.length < 1) {
                    execModel.entries.push(fnUnit.fid);
                }
                this.checkAndRemoveOptionalInputs(fnUnit);
                this.carvePersist(fnUnit, true);
                this.deleteEmptyArray(fnUnit);

                if (fnUnit[FUNCTION_NAME] == 'Subflow' && fnUnit.param.functions.length > 0) {
                    if (!fnUnit.param.entries) {
                        fnUnit.param.entries = [fnUnit.param.functions[0].fid];
                    }

                    for (var k in fnUnit.param.functions) {
                        let subFnUnit = fnUnit.param.functions[k];
                        let label = fnUnit.label || '';
                        subFnUnit.label = label;
                        delete subFnUnit.display;
                    }
                }
            }

            if (execModel.innerModels) {
                execModel.innerModels = _.reduce(_.map(execModel.innerModels, function (m, key) {
                    var ret = {};
                    ret[key] = _this.exportAsRunnable(m);
                    return ret;
                }), _.merge, {});
            }
            return execModel;
        },

        previousFnUnitList: function (content, fid, functions) {
            var previousList = content.getPrevious(fid);
            for (var i in previousList) {
                if (functions.indexOf(previousList[i]) == -1) {
                    functions.push(previousList[i]);
                }
                this.previousFnUnitList(content, previousList[i], functions);
            }
        },

        previousLinks: function (content, fid, links) {
            for (var i in content.links) {
                var link = content.links[i];
                if (link[TARGET_FID] == fid) {
                    links.push(link);
                    this.previousLinks(content, link[SOURCE_FID], links);
                }
            }
        },

        exportAsRunnableForRealTime: function (contents, fnUnit, withReport) {
            var execModel = this.extendModel(contents, true);
            var functions = [];
            functions.push(fnUnit.fid);
            this.previousFnUnitList(execModel, fnUnit.fid, functions);

            var execFunctions = [];
            for (var k in execModel.functions) {
                for (const func of functions) {
                    if (func === execModel.functions[k].fid) {
                        execFunctions.push(execModel.functions[k]);
                    }
                }
            }
            var execLinks = [];

            this.previousLinks(execModel, fnUnit.fid, execLinks);

            execModel.functions = execFunctions;
            execModel.links = execLinks;

            delete execModel.FUNC_ID_CHAR;
            delete execModel.FUNC_ID_LENGTH;
            delete execModel.preferences;
            delete execModel.problemList;
            delete execModel.sheets;
            delete execModel.title;
            if (typeof withReport === 'undefined' || !withReport) {
                delete execModel.report;
            }
            // delete execModel['gv-def'];

            execModel.entries = [];
            for (var j in execModel.functions) {
                var fnUnit = execModel.functions[j];
                delete fnUnit.display;

                var previousList = fnUnit.parent().getPrevious(fnUnit.fid);
                if (previousList.length < 1) {
                    execModel.entries.push(fnUnit.fid);
                }

                this.deleteEmptyArray(fnUnit);

                if (fnUnit[FUNCTION_NAME] == 'Subflow' && fnUnit.param.functions.length > 0) {
                    if (!fnUnit.param.entries) {
                        fnUnit.param.entries = [fnUnit.param.functions[0].fid];
                    }

                    for (var k in fnUnit.param.functions) {
                        var subFnUnit = fnUnit.param.functions[k];
                        delete subFnUnit.display;
                    }
                }
            }
            return execModel;
        },
        getModelIds: function getModelIds(obj, searchKey, midList) {
            if ('object' != typeof (obj)) {
                return midList;
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key === searchKey) {
                            midList.push(obj[key]);
                        }
                        getModelIds(obj[key], searchKey, midList);
                    }
                }
            }
            return midList;
        },
        getModelIdsWithVersion: function getModelIdsWithVersion(obj, searchKey, midList) {
            if ('object' != typeof (obj)) {
                return midList;
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key === searchKey) {
                            var target = {};
                            target[key] = obj[key];
                            if (obj.hasOwnProperty('version_id')) target.version_id = obj.version_id;
                            midList.push(target);
                        }
                        getModelIdsWithVersion(obj[key], searchKey, midList);
                    }
                }
            }
            return midList;
        },
        exportAsRunnableFileByTree: function (projectId, contents, args) {
            return this.createModelTree(projectId, contents)
                .then(function (modelTree) {
                    return this._exportAsRunnableFileByTree(contents, modelTree, args);
                }.bind(this));
        },
        _exportAsRunnableFileByTree: function (contents, modelTree, args) {
            var runnable = this.exportAsRunnable(contents);

            var data = {
                user: 'input_user_id',
                jid: 'input_job_id',
                main: runnable.mid,
                args: args,
                models: {}
            };

            data.models[runnable.mid] = runnable;
            if (runnable.type === 'control') {
                var innerModels = this.getModelIdsWithVersion(runnable.functions, 'mid', []);
                _.forEach(innerModels, function (innerModel) {
                    var key = innerModel.version_id ?
                        innerModel.mid + '_' + innerModel.version_id :
                        innerModel.mid;

                    var innerContents = innerModel.version_id ?
                        modelTree[innerModel.mid].version[innerModel.version_id] :
                        modelTree[innerModel.mid].main;

                    data.models[key] = this.exportAsRunnable(innerContents.contents);
                }.bind(this));
            } else {
                /**
                 * 2016-11-15
                 * gv???�언??param�?variable??값이 ?�력?��? ?�는 것�? ??��
                 * sungjin1.kim
                 */
                for (var i in runnable.gv) {
                    var variable = runnable.gv[i];
                    for (var key in variable.param) {
                        if (args && !args[variable.param[key]]) {
                            delete variable.param[key];
                        }
                    }

                    if (Object.keys(variable.param).length < 1) {
                        runnable.gv.splice(i, 1);
                    }
                }
            }
            return data;
        },
        createModelTree: function (projectId, contents) {
            var modelTree = {};
            return Promise.all(this._createModelTree(projectId, contents, modelTree))
                .then(function () {
                    return modelTree;
                });
        },
        _createModelTree: function (projectId, contents, modelTree) {
            var functions = contents.functions;
            var getModel = function (projectId, fileId, versionId) {
                if (!versionId) return ResourceManager.fetchFile(projectId, fileId);
                return ResourceManager.fetchVersion(projectId, fileId, versionId);
            };

            var insertModel = function (flowContents, fileId, versionId) {
                modelTree[fileId] = modelTree[fileId] || {version: {}};
                if (!versionId) modelTree[fileId].main = flowContents;
                else modelTree[fileId].version[versionId] = flowContents;
                return true;
            };

            var promises = [];
            _.forEach(functions, function (fn) {
                if (fn.param.functions) {
                    promises.push(this._createModelTree(projectId, fn.param.functions, modelTree));
                }
                if (fn[FUNCTION_NAME] === 'DataFlow') {
                    promises.push(
                        getModel(projectId, fn.param.mid, fn.param.version_id)
                            .then(function (resource) {
                                if (typeof resource === 'undefined') {
                                    return Promise.reject('"' + fn.display.label + '" dataflow was deleted or format is invalid in selected control flow');
                                }
                                return insertModel(resource, fn.param.mid, fn.param.version_id);
                            })
                    );
                }
                if (typeof fn.param.modelId !== 'undefined') {
                    promises.push(
                        getModel(projectId, fn.param.modelId, fn.param.version_id)
                            .then(function (resource) {
                                if (typeof resource === 'undefined') {
                                    return Promise.reject('"' + fn.display.label + '" dataflow was deleted or format is invalid in selected report model');
                                }
                                return insertModel(resource, fn.param.modelId, fn.param.version_id);
                            })
                    );
                }
            }.bind(this));
            return _.flatten(promises);
        },
        flattenModelTree: function (flowTree, projectId) {
            var list = [];

            var sortByVersionDesc = function (a, b) {
                if (a.getMajorVersion() !== b.getMajorVersion()) {
                    return b.getMajorVersion() - a.getMajorVersoin();
                }
                return b.getMinorVersion() - a.getMinorVersion();
            };

            // file level
            _.forOwn(flowTree, function (file) {
                // version level
                var subList = [];
                var hasVersion = false;
                _.forOwn(file.version, function (version) {
                    subList.push(version);
                    hasVersion = true;
                });

                subList.sort(sortByVersionDesc);
                subList = _.map(subList, function (version) {
                    var contentsClone = _.cloneDeep(version.getContents());
                    contentsClone.versionTags = version.getTags();
                    contentsClone.versionDescription = version.getDescription();
                    contentsClone.majorVersion = version.getMajorVersion();
                    contentsClone.minorVersion = version.getMinorVersion();
                    return contentsClone;
                });
                if (!hasVersion) {
                    // file??file�??�어가????
                    subList.push(file.main.contents);
                } else {
                    // latest version??file�??�어가????
                    subList.push(_.omit(subList[0], [
                        'version_id',
                        'versionTags',
                        'versionDescription',
                        'majorVersion',
                        'minorVersion'
                    ]));
                    // _.last(subList).title = this.options.resourceManager
                    //     .getFile(projectId, subList[0].mid).label;
                }
                list.push(subList);
            });
            return _.flatten(list);
        },
        getModelArrayByTree: function (modelTree, file, projectId) {
            var modelArray = Brightics.VA.Core.Utils.ModelUtils
                .flattenModelTree(modelTree, projectId);
            modelArray.push(file.getContents());
            return modelArray;
        },
        exportAsRunnableFile: function (contents, modelList, args, withReport, duration) {
            var runnable = this.exportAsRunnable(contents, withReport);
            var report = {};
            if (typeof runnable.report !== 'undefined') {
                report = $.extend(true, {}, runnable.report);
                delete runnable.report;
            }

            var data = {
                main: runnable.mid,
                models: {},
                reports: {},
                version: Brightics.VA.Env.CoreVersion
            };

            if (duration)
                data.duration = duration;

            data.models[runnable.mid] = runnable;
            if (runnable.type === 'control') {
                var _this = this;
                var midList = this.getModelIds(runnable.functions, 'mid', []);
                $.each(midList, function (index, mid) {
                    for (var i in modelList) {
                        if (modelList[i].id == mid) {
                            data.models[mid] = _this.exportAsRunnable(modelList[i].contents, withReport);
                        }
                    }

                    if (data.models[mid]) {
                        if (withReport && (data.models[mid].report && data.models[mid].report.data.length > 0)) {
                            data.reports[mid] = $.extend(true, {}, data.models[mid].report);
                        }

                        delete data.models[mid].report;
                    }
                });
            } else {
                if (withReport && report.data.length > 0) {
                    data.reports[runnable.mid] = report;
                }

                for (var i in runnable.gv) {
                    var variable = runnable.gv[i];
                    for (var key in variable.param) {
                        if (args && !args[variable.param[key]]) {
                            delete variable.param[key];
                        }
                    }

                    if (Object.keys(variable.param).length < 1) {
                        runnable.gv.splice(i, 1);
                    }
                }
            }
            return data;
        },
        fileArrayToModelTree: function (jsonFiles) {
            var tree = {};
            var insertFile = function (file) {
                tree[file.mid] = tree[file.mid] || {};
                tree[file.mid].main = file;
            };
            var insertVersion = function (file) {
                tree[file.mid] = tree[file.mid] || {version: {}};
                tree[file.mid].version[file.version_id] = file;
            };
            _.forOwn(jsonFiles, function (_files) {
                var files = _files instanceof Array ? _files : [_files];
                _.forEach(files, function (file) {
                    if (file.version_id) {
                        insertVersion(file);
                    } else {
                        insertFile(file);
                    }
                });
            });
            return tree;
        },
        importModels: function (projectId, fileArray, doneCallback, errorCallback) {
            var old2newFileId = {};
            var old2newTableId = {};
            var fileId2fileName = {};

            var tree = this.cloneModelsByTree(this.fileArrayToModelTree(fileArray));
            _.forOwn(tree, function (node) {
                old2newFileId[node.main.mid] = Brightics.VA.Core.Utils.IDGenerator.model.id();
                fileId2fileName[node.main.mid] = node.main.title;
            });

            var changeFileId = function (node) {
                _.forOwn(node, function (child) {
                    if (child.param.functions) changeFileId(child.param.functions);
                    if (child.param.mid && old2newFileId[child.param.mid]) child.param.mid = old2newFileId[child.param.mid];
                    if (child.param.modelId && old2newFileId[child.param.modelId]) child.param.modelId = old2newFileId[child.param.modelId];
                    if (child.param.tableId && old2newTableId[child.param.tableId]) child.param.tableId = old2newTableId[child.param.tableId];
                });
            };

            var old2newVersionId = {};

            var versionPromises = [];
            _.forOwn(tree, function (node) {
                if (node.main) {
                    changeFileId(node.main.functions);
                }
                _.forOwn(node.version, function (version) {
                    var newVersionInfo = new Brightics.VA.Vo.Version()
                        .setFileId(old2newFileId[version.mid])
                        .setLabel(version.title)
                        .setTags(version.versionTags)
                        .setDescription(version.versionDescription)
                        .setIsManual(true)
                        .setType(version.type)
                        .setMajorVersion(version.majorVersion)
                        .setMinorVersion(version.minorVersion);

                    var versionContents = _.omit(version, [
                        'versionId',
                        'versionTags',
                        'versionDescription',
                        'majorVersion',
                        'minorVersion'
                    ]);
                    newVersionInfo.setContents(versionContents);

                    versionPromises.push(
                        Dao.VersionDao.addVersion(
                            projectId,
                            newVersionInfo.getFileId(),
                            newVersionInfo)
                            .then(function (ver) {
                                old2newVersionId[version.version_id] = ver.getVersionId();
                                return ver;
                            }));
                });
            });

            return Promise.all(versionPromises).then(function () {
                var filePromises = [];
                _.forOwn(tree, function (node) {
                    _.forEach(node.main.functions, function (fn) {
                        if (fn[FUNCTION_NAME] === 'DataFlow') {
                            if (fn.param.version_id) {
                                fn.param.version_id = old2newVersionId[fn.param.version_id];
                            }
                        }
                    });

                    var newFileInfo = new Brightics.VA.Vo.File()
                        .setFileId(old2newFileId[node.main.mid])
                        .setProjectId(projectId)
                        .setLabel(fileId2fileName[node.main.mid])
                        .setDescription('')
                        .setCreator(Brightics.VA.Env.Session.userId)
                        .setContents(node.main);

                    filePromises.push(ResourceManager.addFile(projectId, newFileInfo));
                });
                return Promise.all(filePromises)
                    .then(function (files) {
                        return _.map(files, function (file) {
                            return ResourceManager.fetchVersions(projectId, file.getFileId());
                        });
                    });
            });
        },
        makeEntries: function (fnUnit) {
            if (fnUnit[FUNCTION_NAME] == 'Subflow' && fnUnit.param.functions.length > 0) {
                if (!fnUnit.param.links) {
                    fnUnit.param.links = [];
                }
                if (!fnUnit.param.entries) {
                    fnUnit.param.entries = [];

                    // 2016-05-25 ?�점??Subflow ??sequential flow ?�기 ?�문??추후?�는 별로 처리???�??로직 추�??�야 ??
                    fnUnit.param.entries.push(fnUnit.param.functions[0].fid);
                }
                for (var i in fnUnit.param.functions) {
                    this.makeEntries(fnUnit.param.functions[i]);
                }
            }
        },
        isControlFunction: function (fnUnit, parent) {
            var clazz = parent ? parent.type : fnUnit.parent().type;
            return (clazz === 'data' &&
                ['If', 'ForLoop', 'WhileLoop'].indexOf(fnUnit[FUNCTION_NAME]) > -1);
        },
        isEmptyExpression: function (_exp) {
            var exp = _exp || '';
            return !_.trim(exp.substring(3, exp.length - 1));
        },
        deleteEmptyExpression: function (fnUnit, parent) {
            var param = fnUnit.param;
            if (fnUnit[FUNCTION_NAME] === 'ForLoop') {
                if (param.type === 'count') {
                    if (_.has(param.prop, 'start') && this.isEmptyExpression(param.prop.start)) {
                        delete param.prop.start;
                    }
                    if (_.has(param.prop, 'end') && this.isEmptyExpression(param.prop.end)) {
                        delete param.prop.end;
                    }
                } else if (param.type === 'collection') {
                    if (_.has(param.prop, 'collection') &&
                        this.isEmptyExpression(param.prop.collection)) {
                        delete param.prop.collection;
                    }
                }
            } else if (fnUnit[FUNCTION_NAME] === 'While') {
                if (param.type === 'while') {
                    if (_.has(param.prop, 'expression') &&
                        this.isEmptyExpression(param.prop.expression)) {
                        delete param.prop.expression;
                    }
                }
            }
        },
        isEmpty: function (val) {
            return _.isUndefined(val) ||
                _.isNull(val) ||
                _.isNaN(val) ||
                ((_.isString(val) || _.isArray(val)) && _.isEmpty(val));
        },
        deleteEmptyArray: function (fnUnit, parent) {
            if (!fnUnit.param) return;

            for (var key in fnUnit.param) {
                if (this.isControlFunction(fnUnit, parent)) {
                    // array는 아닌데 일단 지웁니다..
                    this.deleteEmptyExpression(fnUnit, parent);
                } else if (key == 'functions') {
                    for (var i in fnUnit.param.functions) {
                        this.deleteEmptyArray(fnUnit.param.functions[i], parent || fnUnit.parent());
                    }
                } else if (['boolean', 'number'].some(type => type === typeof fnUnit.param[key]) || fnUnit.param[key]) {
                    var tmpArray = fnUnit.param[key];
                    if (_.isArray(tmpArray)) {
                        if (tmpArray.length > 1) continue;
                        if (!this.isEmpty(tmpArray[0])) {
                            if (_.isArray(tmpArray[0])) {
                                if (tmpArray[0].length > 1) continue;
                                if (this.isEmpty(tmpArray[0][0])) delete fnUnit.param[key];
                            } else {
                                if (this.isEmpty(tmpArray[0])) delete fnUnit.param[key];
                            }
                        } else if (this.isEmpty(tmpArray[0])) {
                            let clazz = parent ? parent.type : fnUnit.parent().type;
                            if (Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func).mandatory
                                && $.inArray(key, Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func).mandatory) !== -1) {
                                continue;
                            }
                            delete fnUnit.param[key];
                        }
                    }
                } else {
                    let clazz = parent ? parent.type : fnUnit.parent().type;
                    if (Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func).mandatory &&
                        $.inArray(key, Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func).mandatory) !== -1) continue;
                    delete fnUnit.param[key];
                }
            }
        },
        deleteDisplay: function (fnUnit) {
            var label = '';
            if (fnUnit.display && fnUnit.display.label) {
                label = fnUnit.display.label;
                // fnUnit.display = { label: fnUnit.display.label || fnUnit.func };
            }
            fnUnit.label = label;
            fnUnit.display = {label: label};
            if (fnUnit[FUNCTION_NAME] == 'Subflow') {
                var functions = fnUnit.param.functions;
                for (var i in functions) {
                    this.deleteDisplay(functions[i]);
                }
            }
        },
        getKeyMapFromModelTree: function (models) {
            var cacheMap = {
                fidCache: {},
                outputCache: {}
            };
            _.forOwn(models, function (node) {
                if (node.main) {
                    _createCachePersist(node.main.functions, cacheMap);
                }
                if (node.version) {
                    _.forOwn(node.version, function (version) {
                        _createCachePersist(version.functions, cacheMap);
                    });
                }
            });
            return cacheMap;
        },
        cloneModelsByTree: function (modelTree) {
            var cacheMap = this.getKeyMapFromModelTree(modelTree);
            var resultModelTree = {};

            var clone = function (model, cacheMap, newMid) {
                var resultModel = $.extend(true, {}, model);
                if (newMid && resultModel.mid) {
                    resultModel.mid = Brightics.VA.Core.Utils.IDGenerator.model.id();
                }
                resultModel = _setKeys(resultModel, cacheMap);
                return resultModel;
            };

            _.forOwn(modelTree, function (node, fileId) {
                resultModelTree[fileId] = {};
                if (node.main) {
                    resultModelTree[fileId].main = clone(node.main, cacheMap);
                }
                if (node.version) {
                    resultModelTree[fileId].version = {};
                    _.forOwn(node.version, function (version, versionId) {
                        resultModelTree[fileId].version[versionId] = clone(version, cacheMap);
                    });
                }
            });
            return resultModelTree;
        },
        cloneModel: function (model) {
            if (model.type === 'data') {
                return _cloneNestedFlow(this.extendModel(model));
            }
            var clonedModel = $.extend(true, {}, model);
            if (clonedModel.mid) {
                clonedModel.mid = Brightics.VA.Core.Utils.IDGenerator.model.id();
            }

            var cacheMap = _createCache(clonedModel.functions);
            clonedModel = _setKeys(clonedModel, cacheMap);

            return clonedModel;
        },
        cloneFnUnit: function (fnUnit) {
            var cacheMap = _createCacheByFnUnit(fnUnit);
            var clone = $.extend(true, {}, fnUnit);

            var fidCache = cacheMap.fidCache, outputCache = cacheMap.outputCache;

            clone.fid = fidCache[clone.fid];

            if (clone[IN_DATA]) {
                clone[IN_DATA] = [];
            }
            if (clone.func === 'unload') {
                clone.param['df-names'] = [];
            }
            clone = _setOutTable(clone, outputCache);
            clone.param = _setKeys(clone.param, cacheMap);

            return clone;
        },
        checkAndRemoveOptionalInputs: function (unit) {
            if (unit.inputs && unit.meta) {
                Object.keys(unit.inputs)
                    .filter(key => unit.inputs[key] === '' && unit.meta[key] && unit.meta[key].optional)
                    .forEach(key => delete unit.inputs[key])
            }
        },
        carvePersist: function (fnUnit, persist) {
            var persistMode = Brightics.VA.SettingStorage.DEFAULT_SETTINGS['common.persist.mode'];//Brightics.VA.SettingStorage.getValue('common.persist.mode');
            // var defaultPersist = Brightics.VA.Core.Functions.Library[fnUnit.func].defaultFnUnit.persist;
            var defaultPersist;

            if (!Brightics.VA.Core.Functions.Library[fnUnit.func]) {
                defaultPersist = persistMode;
            } else {
                defaultPersist = Brightics.VA.Core.Functions.Library[fnUnit.func].defaultFnUnit.persist;
            }

            var basePersist = fnUnit.parent()['persist-mode'];

            if (persistMode === 'user-mode') {
                if (fnUnit['persist-mode'] === 'true') {
                    fnUnit.persist = true;
                } else if (fnUnit['persist-mode'] === 'false') {
                    fnUnit.persist = false;
                } else {
                    if (basePersist === 'true') {
                        fnUnit.persist = true;
                    } else if (basePersist === 'false') {
                        fnUnit.persist = false;
                    } else { // auto
                        fnUnit.persist = true;
                    }
                }
            }
            if (persistMode === 'system-mode') {
                // do nothing
            }
            if (persistMode === 'performance-mode') {
                if (defaultPersist !== undefined) {
                    fnUnit.persist = defaultPersist;
                } else {
                    fnUnit.persist = false;
                }
            }
            if (persistMode === 'storage-mode') {
                if (defaultPersist !== undefined) {
                    fnUnit.persist = defaultPersist;
                } else {
                    fnUnit.persist = true;
                }
            }

            // subflow 마지막 함수는 persist = true 공통 적용
            if (fnUnit[FUNCTION_NAME] === 'Subflow' && fnUnit.param.functions.length > 0) {
                fnUnit.param.functions[fnUnit.param.functions.length - 1].persist = true; //fnUnit.persist;
            }
        },
        generateVersionText: function (version) {
            return version.major_version + '.' + version.minor_version;
        },
        openDocumentationPopup: function () {
            var online = Brightics.VA.SettingStorage.getValue('common.document.useonline');
            if (online === 'true') {
                var onlineUrl = Brightics.VA.SettingStorage.getValue('common.document.onlinedocurl');
                if (onlineUrl === '') onlineUrl = Brightics.VA.SettingStorage.getValue('common.document.onlinedocurl.default');
                var w = window.open(onlineUrl);
                w.blur();
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Help document installed in Local does not exist.\nSet up on-line help service url or contact your administrator.\n(Settings > Preferences > Common > Use on-line help..)');
            }
        },
        openFunctionReferencePopup: function (type, operation, context, func) {
            var online = Brightics.VA.SettingStorage.getValue('common.document.useonline');
            var w, url;
            if (online === 'true') {
                var onlineUrl = Brightics.VA.SettingStorage.getValue('common.document.onlinedocurl');
                if (onlineUrl === '') onlineUrl = Brightics.VA.SettingStorage.getValue('common.document.onlinedocurl.default');
                onlineUrl = _.trimRight(onlineUrl, '/');
                try {
                    var lang = (navigator.language || navigator.userLanguage).toLowerCase();
                    var version = 'v' + (Brightics.VA.Env.CoreVersion || '3.0');
                    var fullUrl = [
                        onlineUrl,
                        lang,
                        'ai',
                        version,
                        'function_reference',
                        context || 'scala',
                        operation
                    ].join('/');
                    w = window.open(fullUrl);
                } catch (e) {
                    w = window.open(onlineUrl);
                }
            } else {
                let lang = Brightics.VA.SettingStorage.getCurrentLanguage() === 'ko' ? 'kr' : '';

                url = 'api/va/v2/help/function';
                if (operation) url = url + '/' + operation;
                url = url + '?type=' + type + (context ? '&context=' + context : '') + (func ? '&func=' + func : '') + (lang ? '&lang=' + lang : '');
                w = window.open(url, 'Brightics Help');
            }
            w.blur();
        },
        createCachePersist: function (functions, cacheMap) {
            return _createCachePersist(functions, cacheMap);
        },
        setKeys: function (model, cacheMap) {
            return _setKeys(model, cacheMap);
        },
        createFileContents: function (templateContents, mid, label, description) {
            var contents = $.extend(true, {}, templateContents);
            contents.mid = mid;
            if (label) contents.title = label;
            if (description) contents.description = description;

            var fidCache = {}, outputCache = {};
            var i, j, k, l, m, fnUnit, subFnUnit, linkUnit, subLinkUnit;

            // Create fidCache
            for (i in contents.functions) {
                fnUnit = contents.functions[i];
                fidCache[fnUnit.fid] = Brightics.VA.Core.Utils.IDGenerator.func.id();
                for (l in fnUnit[OUT_DATA]) {
                    outputCache[fnUnit[OUT_DATA][l]] = Brightics.VA.Core.Utils.IDGenerator.table.id();
                }

                if (fnUnit[FUNCTION_NAME] === 'Subflow') {
                    for (j in fnUnit.param.functions) {
                        subFnUnit = fnUnit.param.functions[j];
                        fidCache[subFnUnit.fid] = Brightics.VA.Core.Utils.IDGenerator.func.id();
                        for (m in subFnUnit[OUT_DATA]) {
                            outputCache[subFnUnit[OUT_DATA][m]] = Brightics.VA.Core.Utils.IDGenerator.table.id();
                        }
                    }
                }
            }

            for (i in contents.functions) {
                // Change FnUnit Fid
                fnUnit = contents.functions[i];
                fnUnit.fid = fidCache[fnUnit.fid];

                // Change FnUnit In-table
                for (j in fnUnit[IN_DATA]) {
                    fnUnit[IN_DATA][j] = outputCache[fnUnit[IN_DATA][j]];
                }

                // Change FnUnit Out-table
                for (j in fnUnit[OUT_DATA]) {
                    fnUnit[OUT_DATA][j] = outputCache[fnUnit[OUT_DATA][j]];
                }

                // Change df-names Parameter, when operation is 'unload'
                if (fnUnit.func === 'unload') {
                    for (j in fnUnit.param['df-names']) {
                        fnUnit.param['df-names'][j] = outputCache[fnUnit.param['df-names'][j]];
                    }
                }

                if (fnUnit[FUNCTION_NAME] === 'Subflow') {
                    // Change entries
                    for (j in fnUnit.param.entries) {
                        fnUnit.param.entries[j] = fidCache[fnUnit.param.entries[j]];
                    }

                    for (j in fnUnit.param.functions) {
                        // Change SubFnUnit Fid
                        subFnUnit = fnUnit.param.functions[j];
                        subFnUnit.fid = fidCache[subFnUnit.fid];

                        // Change SubFnUnit In-table
                        for (k in subFnUnit[IN_DATA]) {
                            subFnUnit[IN_DATA][k] = outputCache[subFnUnit[IN_DATA][k]];
                        }

                        // Change SubFnUnit Out-table
                        for (k in subFnUnit[OUT_DATA]) {
                            subFnUnit[OUT_DATA][k] = outputCache[subFnUnit[OUT_DATA][k]];
                        }

                        // Change df-names Parameter, when operation is 'load'
                        if (subFnUnit.func === 'load') {
                            for (k in subFnUnit.param['df-names']) {
                                subFnUnit.param['df-names'][k] = outputCache[subFnUnit.param['df-names'][k]];
                            }
                        }
                        if (subFnUnit.func == 'unload') {
                            for (k in subFnUnit.param['df-names']) {
                                subFnUnit.param['df-names'][k] = outputCache[subFnUnit.param['df-names'][k]];
                            }
                            var filePathId = '/brtc/repo/tmp/' + Brightics.VA.Core.Utils.IDGenerator.file.id();
                            subFnUnit.param['fs-paths'] = [filePathId];
                            if (fnUnit.param.functions[parseInt(j) + 1]) {
                                fnUnit.param.functions[parseInt(j) + 1].param['input-path'] = filePathId;
                                fnUnit.param.functions[parseInt(j) + 1].param['output-path'] = filePathId + '.csv';
                            }
                        }
                    }

                    // Change Subflow Links
                    for (j in fnUnit.param.links) {
                        subLinkUnit = fnUnit.param.links[j];
                        subLinkUnit.kid = Brightics.VA.Core.Utils.IDGenerator.link.id();
                        subLinkUnit[SOURCE_FID] = fidCache[subLinkUnit[SOURCE_FID]];
                        subLinkUnit[TARGET_FID] = fidCache[subLinkUnit[TARGET_FID]];
                    }
                }
            }

            // Change Model Links
            for (i in contents.links) {
                linkUnit = contents.links[i];
                linkUnit.kid = Brightics.VA.Core.Utils.IDGenerator.link.id();
                linkUnit[SOURCE_FID] = fidCache[linkUnit[SOURCE_FID]];
                linkUnit[TARGET_FID] = fidCache[linkUnit[TARGET_FID]];
            }

            if (contents.type === 'visual') {
                var reportPages = contents.report.pages;
                reportPages.push({
                    id: Brightics.VA.Core.Utils.IDGenerator.reportPage.id(),
                    contents: {}
                });
                for (i in reportPages) {
                    var _contents = reportPages[i].contents;

                    for (var j in _contents) {
                        if (_contents[j].dataSourceId && fidCache[_contents[j].dataSourceId]) {
                            _contents[j].dataSourceId = fidCache[_contents[j].dataSourceId];
                        }
                    }
                }
            }
            return contents;
        },
        initDefaultModelContents: function () {
            var _this = this;
            var modelType = 'data';
            var url = 'api/va/v2/studio/templates/' + modelType;
            var opt = {
                url: url,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                blocking: true
            };

            $.ajax(opt).done(function (files) {
                var index = _.findIndex(files, function (file) {
                    return file.name === 'Default';
                });
                if (index > -1) {
                    _this.defaultModelContents = files[index].contents;
                }
            });
        },
        getDefaultModelContents: function () {
            return this.defaultModelContents;
        },
        createCacheNestedFlow: _createCacheNestedFlow,
        setKeyNestedFlow: _setKeyNestedFlow
    };


    function _createCache(functions) {
        var cacheMap = {fidCache: {}, outputCache: {}};
        for (var fnIndex in functions) {
            var fnUnit = functions[fnIndex];
            $.extend(true, cacheMap, _createCacheByFnUnit(fnUnit));
        }
        return cacheMap;
    }

    function _createCacheByFnUnit(fnUnit) {
        var cacheMap = {fidCache: {}, outputCache: {}};
        var fidCache = cacheMap.fidCache;
        var outputCache = cacheMap.outputCache;
        fidCache[fnUnit.fid] = Brightics.VA.Core.Utils.IDGenerator.func.id();
        for (var outTableIndex in fnUnit[OUT_DATA]) {
            outputCache[fnUnit[OUT_DATA][outTableIndex]] = Brightics.VA.Core.Utils.IDGenerator.table.id();
        }
        if (fnUnit.param.functions) $.extend(true, cacheMap, _createCache(fnUnit.param.functions));
        return cacheMap;
    }

    function _createCacheNestedFlow(mainModel, model, cacheMap) {
        var fidCache = cacheMap.fidCache;
        var tidCache = cacheMap.tidCache;
        var newTid = function () {
            return Brightics.VA.Core.Utils.IDGenerator.table.id();
        }
        var newFid = function () {
            return Brightics.VA.Core.Utils.IDGenerator.func.id();
        }
        var set = function (map, key, newKey) {
            map[key] = map[key] || newKey;
        };

        var recFn = function (fn) {
            set(fidCache, fn.fid, newFid());

            // _.forEach([IN_DATA, OUT_DATA], function (prop) {
            //     _.forEach(fn[prop], function (tid) {
            //         set(tidCache, tid, newTid());
            //     });
            // });

            _.forEach(FnUnitUtils.getAllData(fn), function (tid) {
                set(tidCache, tid, newTid());
            });


            if (fn.param.tableId) {
                set(tidCache, fn.param.tableId, newTid());
            }

            if (fn.param.functions) {
                _.forEach(fn.param.functions, function (innerFn) {
                    recFn(innerFn);
                });
            }
        };

        var recModel = function (model) {
            _.forEach([IN_DATA, OUT_DATA], function (prop) {
                _.forEach(model[prop], function (tid) {
                    set(tidCache, tid, newTid());
                });
            });

            _.forEach(model.functions, function (fn) {
                recFn(fn);
                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, fn);
                _.forEach(subModels, recModel);
            });
        };
        recModel(model);
        return cacheMap;
    }

    function _cloneNestedFlow(_mainModel) {
        var mainModel = _.cloneDeep(_mainModel);
        var midCache = {};
        var set = function (id) {
            midCache[id] = midCache[id] || Brightics.VA.Core.Utils.IDGenerator.model.id();
        };

        var get = function (id) {
            return midCache[id];
        };

        var recSet = function (model) {
            _.forEach(model.functions, function (fn) {
                if (fn[FUNCTION_NAME] === 'If') {
                    set(fn.param.if.mid);
                    _.forEach(fn.param.elseif, function (elseif) {
                        set(elseif.mid);
                    });
                    set(fn.param.else.mid);
                }

                if (fn[FUNCTION_NAME] === 'ForLoop' || fn[FUNCTION_NAME] === 'WhileLoop') {
                    set(fn.param.mid);
                }

                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, fn);
                _.forEach(subModels, recSet);
            });
        };

        _.forEach(mainModel.innerModels, function (model, key) {
            set(key);
        });

        var recGet = function (model) {
            _.forEach(model.functions, function (fn) {

                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, fn);
                _.forEach(subModels, recGet);

                if (fn[FUNCTION_NAME] === 'If') {
                    fn.param.if.mid = get(fn.param.if.mid);
                    _.forEach(fn.param.elseif, function (elseif) {
                        elseif.mid = get(elseif.mid);
                    });
                    fn.param.else.mid = get(fn.param.else.mid);
                }

                if (fn[FUNCTION_NAME] === 'ForLoop' || fn[FUNCTION_NAME] === 'WhileLoop') {
                    fn.param.mid = get(fn.param.mid);
                }
            });
        };

        recSet(mainModel);
        recGet(mainModel);

        mainModel.innerModels = _.reduce(_.map(mainModel.innerModels, function (model) {
            model.mid = get(model.mid);
            var ret = {};
            ret[model.mid] = model;
            return ret;
        }), _.merge, {});

        var cacheMap = {
            fidCache: {},
            tidCache: {}
        };

        _createCacheNestedFlow(mainModel, mainModel, cacheMap);
        _setKeyNestedFlow(mainModel, mainModel, cacheMap);

        return mainModel;
    }

    function _setKeyNestedFlow(mainModel, model, cacheMap) {
        var fidCache = cacheMap.fidCache;
        var tidCache = cacheMap.tidCache;
        var _substituteKeys = function (model) {
            _setInTable(model, tidCache);
            _setOutTable(model, tidCache);

            for (var fnIndex in model.functions) {
                var fnUnit = model.functions[fnIndex];
                fnUnit.fid = fidCache[fnUnit.fid];
                _setInTable(fnUnit, tidCache);
                _setOutTable(fnUnit, tidCache);
                _setDfNames(fnUnit, tidCache);
                _setEntries(fnUnit, fidCache);
                _setEtcSpec(fnUnit, tidCache, fidCache);
                _setReportParam(fnUnit, tidCache);

                if (model.type === 'deeplearning') {
                    _setOutputParam(fnUnit, fidCache);
                }

                if (fnUnit.param && fnUnit.param.functions) {
                    _substituteKeys(fnUnit.param);
                }
                var subModels = Brightics.VA.Core.Utils
                    .NestedFlowUtils.getSubModels(mainModel, fnUnit);
                _.forEach(subModels, _substituteKeys);
            }

            if (model.report) {
                _.forEach(model.report.data, function (reportData) {
                    if (reportData.originData && reportData.originData.data) {
                        reportData.originData.data.fid = fnUnit.fid;
                        _setReportTable(reportData, tidCache);
                    }
                });
                model.report = _setReportDatasource(model.report, fidCache);
            }
            _setLinks(model, fidCache);
        };
        _substituteKeys(model);

        _setGV(mainModel, fidCache);
        return mainModel;
    };

    function _createCachePersist(functions, cacheMap) {
        _.forEach(functions, function (fnUnit) {
            _createCachePersistByFnUnit(fnUnit, cacheMap);
        });
    }

    function _createCachePersistByFnUnit(fnUnit, cacheMap) {
        var fidCache = cacheMap.fidCache;
        var outputCache = cacheMap.outputCache;
        if (fnUnit.fid.startsWith('d')) {
            fidCache[fnUnit.fid] = fidCache[fnUnit.fid] || Brightics.VA.Core.Utils.IDGenerator.dataSource.id();
        } else {
            fidCache[fnUnit.fid] = fidCache[fnUnit.fid] || Brightics.VA.Core.Utils.IDGenerator.func.id();
        }
        _.forEach(fnUnit['outData'], function (tid) {
            outputCache[tid] = outputCache[tid] || Brightics.VA.Core.Utils.IDGenerator.table.id();
        });
        if (fnUnit.param.functions) _createCachePersist(fnUnit.param.functions, cacheMap);
    }

    function _setKeys(model, cacheMap) {
        var fidCache = cacheMap.fidCache;
        var outputCache = cacheMap.outputCache;

        for (var fnIndex in model.functions) {
            var fnUnit = model.functions[fnIndex];
            fnUnit.fid = fidCache[fnUnit.fid];
            fnUnit = _setInTable(fnUnit, outputCache);
            fnUnit = _setOutTable(fnUnit, outputCache);
            fnUnit = _setDfNames(fnUnit, outputCache);
            fnUnit = _setEntries(fnUnit, fidCache);
            fnUnit = _setEtcSpec(fnUnit, outputCache, fidCache);
            fnUnit = _setReportParam(fnUnit, outputCache);
            fnUnit = _setSetValueParam(fnUnit, outputCache);

            if (fnUnit.param && fnUnit.param.functions) {
                _setKeys(fnUnit.param, cacheMap);
            }

            if (model.type == 'deeplearning') {
                fnUnit = _setOutputParam(fnUnit, fidCache);
            }

        }
        if (model.report) {
            for (var index in model.report.data) {
                model.report.data[index].originData.data.fid = fnUnit.fid;
                model.report.data[index] = _setReportTable(model.report.data[index], outputCache);
            }
            model.report = _setReportDatasource(model.report, fidCache);

        }

        model = _setLinks(model, fidCache);
        model = _setGV(model, fidCache);
        return model;
    }

    function _setInTable(fnUnit, outputCache) {
        _.forEach(outputCache, function (newTid, oldTid) {
            FnUnitUtils.changeData(fnUnit, oldTid, newTid);
        });
        return fnUnit;
    }


    function _setOutTable(fnUnit, outputCache) {
        _.forEach(outputCache, function (newTid, oldTid) {
            FnUnitUtils.changeData(fnUnit, oldTid, newTid);
        });
        return fnUnit;
    }

    function _setDfNames(fnUnit, outputCache) {
        if (fnUnit.param && fnUnit.param['df-names']) {
            for (var dfNamesIndex in fnUnit.param['df-names']) {
                fnUnit.param['df-names'][dfNamesIndex] = outputCache[fnUnit.param['df-names'][dfNamesIndex]];
            }
        }
        return fnUnit;
    }

    function _setEntries(fnUnit, fidCache) {
        if (fnUnit.param && fnUnit.param.entries) {
            for (var entriesIndex in fnUnit.param.entries) {
                fnUnit.param.entries[entriesIndex] = fidCache[fnUnit.param.entries[entriesIndex]];
            }
        }
        return fnUnit;
    }

    function _setLinks(model, fidCache) {
        for (var i in model.links) {
            var linkUnit = model.links[i];
            var kid = Brightics.VA.Core.Utils.IDGenerator.link.id();
            linkUnit.kid = kid;
            linkUnit[SOURCE_FID] = fidCache[linkUnit[SOURCE_FID]];
            linkUnit[TARGET_FID] = fidCache[linkUnit[TARGET_FID]];
        }
        return model;
    }

    function _setGV(model, fidCache) {
        for (var i in model.variableRef) {
            var oldFid = model.variableRef[i].fid;
            model.variableRef[i].fid = fidCache[oldFid];
        }
        return model;
    }

    function _setEtcSpec(fnUnit, tidCache, fidCache) {
        if (fnUnit.func === 'outData' && fnUnit[FUNCTION_NAME] === 'Subflow') {
            for (var i in fnUnit.param.functions) {
                if (fnUnit.param.functions[i].func === 'exportData') {
                    var filePathId = '/brtc/repo/tmp/' + Brightics.VA.Core.Utils.IDGenerator.file.id();
                    fnUnit.param['fs-paths'] = [filePathId];
                    if (fnUnit.param.functions[i]) {
                        fnUnit.param.functions[i].param['input-path'] = filePathId;
                        fnUnit.param.functions[i].param['output-path'] = filePathId + '.csv';
                    }
                }
            }
        }
        if (fnUnit[FUNCTION_NAME] === 'DataViewer') {
            fnUnit.param.fid = fidCache[fnUnit.param.fid];
        }
        if (fnUnit.param.target && fnUnit.param.linked && fnUnit.param.linked.outputs) { // unload_model
            fnUnit.param.target = fidCache[fnUnit.param.target];
            fnUnit.param.linked.outputs.model = tidCache[fnUnit.param.linked.outputs.model];
        }
        return fnUnit;
    }

    function _setOutputParam(fnUnit, fidCache) {
        var changedVariable = ['train_data', 'validation_data'];
        if (!fnUnit.param) {
            return fnUnit;
        }

        for (var paramIdx = 0; paramIdx < changedVariable.length; paramIdx++) {
            if (fnUnit.param[changedVariable[paramIdx]] && fidCache[fnUnit.param[changedVariable[paramIdx]]]) {
                fnUnit.param[changedVariable[paramIdx]] = fidCache[fnUnit.param[changedVariable[paramIdx]]];
            }
        }

        return fnUnit;
    }

    function _setReportTable(reportData, outputCache) {
        reportData.originData.data.table = outputCache[reportData.originData.data.table];
        return reportData;
    }


    function _setReportParam(fnUnit, outputCache) {
        if (fnUnit.param.tableId) {
            fnUnit.param.tableId = outputCache[fnUnit.param.tableId];
        }
        return fnUnit;
    }

    function _setReportDatasource(report, fidCache) {
        if (report.pages) {
            for (var index in report.pages) {
                var keys = Object.keys(report.pages[index].contents);
                for (const key of keys) {
                    report.pages[index].contents[key].dataSourceId = fidCache[report.pages[index].contents[key].dataSourceId];
                }
            }
        }
        return report;
    }

    function _setSetValueParam(fnUnit, outputCache) {
        _.forEach(fnUnit.param.variables, function (variable, index) {
            _.forEach(outputCache, function (newTid, oldTid) {
                if (_.isEqual(variable.param.inData, oldTid)) fnUnit.param.variables[index].param.inData = newTid;
            })
        });
        return fnUnit;
    }

}).call(this);
