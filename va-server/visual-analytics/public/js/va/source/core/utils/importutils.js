/**
 * Created by SDS on 2016-01-28.
 */

/* global _ */
(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;

    root.Brightics.VA.Core.Utils.ImportUtils = {
        importProject: function (label, description, data, doneCallback, failCallback) {
            if (data.length) {
                var projectId = Brightics.VA.Core.Utils.IDGenerator.project.id();
                var project = data[0];
                _createProject(projectId, label, description, function () {
                    project.versions = project.versions || [];
                    var old2newFileId = _getIdMap(project.files, project.versions);
                    _changeModelsId(project.files, project.versions, old2newFileId);
                    _cloneModelsAndVersions(project.files, project.versions);
                    _postVersions(projectId, project.versions)
                        .then(function (versionIdMap) {
                            _changeModelsVersionId(project.files, versionIdMap);
                            _createProjectModels(projectId, project.files, function () {
                                if (doneCallback && typeof doneCallback === 'function') {
                                    doneCallback(projectId);
                                }
                            }, failCallback);
                        })
                        .catch(function (err) {
                            failCallback(err);
                        });
                }, failCallback);
            } else {
                if (failCallback && typeof failCallback === 'function') failCallback('Invalid JSON Data.');
            }
        }
    };

    function _createProject(projectId, label, description, doneCallback, failCallback) {
        var project = new Brightics.VA.Vo.Project();
        project.setProjectId(projectId);
        project.setLabel(label || 'untitled');
        project.setDescription(description || '');
        project.setCreator(Brightics.VA.Env.Session.userId);

        ResourceManager.addProject(project)
            .then(function () {
                doneCallback();
            })
            .catch(function (err) {
                failCallback(err);
            });
    }

    function _createProjectModels(projectId, models, doneCallback, failCallback) {
        var promises = [];
        for (var i in models) {
            if (models[i].type === 'visual') continue;
            var model = models[i];
            var modelContents = Brightics.VA.Core.Utils.ModelUtils.cloneModel(model.contents);
            var file = new Brightics.VA.Vo.File();
            file.setFileId(model.id);
            file.setProjectId(projectId);
            file.setLabel(model.label);
            file.setDescription(model.description);
            file.setContents(modelContents);
            file.setCreator(Brightics.VA.Env.Session.userId);
            var promise = ResourceManager.addFile(projectId, file);
            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            if (doneCallback && typeof doneCallback === 'function') doneCallback(projectId);
        }, function (error) {
            if (failCallback && typeof failCallback === 'function') failCallback(error);
        });
    }

    function _changeModelsId(files, versions, idMap) {
        if (files) {
            _.forEach(files, function (file) {
                if (file.type === 'control') {
                    _changeInsertedDataFlowModelId(file.contents.functions, idMap);
                }
                var oldMid = file.id;
                file.id = idMap[oldMid];
                file.contents.mid = idMap[oldMid];
            });
        }

        if (versions) {
            _.forEach(versions, function (version) {
                if (version.type === 'control') {
                    _changeInsertedDataFlowModelId(version.contents.functions, idMap);
                }
                var oldMid = version.file_id;
                version.file_id = idMap[oldMid];
                version.contents.mid = idMap[oldMid];
            });
        }
    }


    function _changeInsertedDataFlowModelId(functions, midCache) {
        for (var i in functions) {
            _changeInsertedDataFlowModelId(functions[i].param.functions, midCache);
            if (functions[i].func === 'dataFlow') {
                var oldMid = functions[i].param.mid;
                functions[i].param.mid = midCache[oldMid] || 'DeletedDataFlow';
            }
        }
    }

    function _getIdMap(files, versions) {
        var idMap = {};
        var _getId = function (functions) {
            _.forEach(functions, function (fn) {
                if (fn.param.functions) _getId(fn.param.functions);
                if (fn.param.mid) {
                    idMap[fn.param.mid] = idMap[fn.param.mid] ||
                        Brightics.VA.Core.Utils.IDGenerator.model.id();
                }
            });
        };
        if (files) {
            _.forEach(files, function (file) {
                idMap[file.id] = idMap[file.id] || Brightics.VA.Core.Utils.IDGenerator.model.id();
                _getId(file.contents.functions);
            });
        }
        if (versions) {
            _.forEach(versions, function (version) {
                idMap[version.file_id] = idMap[version.file_id] ||
                    Brightics.VA.Core.Utils.IDGenerator.model.id();
                _getId(version.contents.functions);
            });
        }
        return idMap;
    }

    function _changeModelsVersionId(files, versionIdMap) {
        _.forEach(files, function (file) {
            _.forEach(file.contents.functions, function (fn) {
                if (fn[FUNCTION_NAME] === 'DataFlow') {
                    if (fn.param.version_id) {
                        fn.param.version_id = versionIdMap[fn.param.version_id];
                    }
                }
            });
        });
    }

    function _cloneModelsAndVersions(files, versions) {
        var modelTree = {};
        var insertFile = function (file) {
            modelTree[file.id] = modelTree[file.id] || { version: {} };
            modelTree[file.id].main = file.contents;
        };

        var insertVersion = function (version) {
            modelTree[version.file_id] = modelTree[version.file_id] || { version: {} };
            modelTree[version.file_id].version[version.version_id] = version.contents;
        };

        if (files) {
            _.forEach(files, insertFile);
        }
        if (versions) {
            _.forEach(versions, insertVersion);
        }
        var clonedTree = Brightics.VA.Core.Utils.ModelUtils.cloneModelsByTree(modelTree);
        if (files) {
            _.forEach(files, function (file) {
                file.contents = clonedTree[file.id].main;
            });
        }
        if (versions) {
            _.forEach(versions, function (version) {
                version.contents = clonedTree[version.file_id].version[version.version_id];
            });
        }
    }

    function _postVersions(projectId, versions) {
        var idMap = {};
        return Promise.all(_.map(versions, function (_version) {
            var version = new Brightics.VA.Vo.Version(_version);
            version.setIsManual(true);
            return Brightics.VA.Dao.VersionDao.addVersion(
                projectId,
                version.getFileId(),
                version)
                .then(function (newVersion) {
                    idMap[version.getVersionId()] = newVersion.getVersionId();
                });
            // return Brightics.VA.Core.Utils.FileVersionDao
            //     .addFileVersionSync(projectId,
            //         version.file_id,
            //         _.extend({ isManual: true }, version))
            //     .then(function (newVersion) {
            //         idMap[version.version_id] = newVersion.version_id;
            //     });
        })).then(function () {
            return idMap;
        });
    }
}).call(this);
