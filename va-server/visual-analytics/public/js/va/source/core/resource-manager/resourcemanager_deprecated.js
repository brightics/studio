/**
 * Created by daewon.park on 2016-10-04.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var ProjectDao = Brightics.VA.Dao.ProjectDao;
    var FileDao = Brightics.VA.Dao.FileDao;
    var VersionDao = Brightics.VA.Dao.VersionDao;
    var ProjectTree = Brightics.VA.DataStructures.ProjectTree;

    function ResourceManager() {
        // this.projectCache = {};
        // this.fileCache = {};
        // this.fileVersionCache = {};
        this.projectTree = new ProjectTree();
    }

    // Project
    ResourceManager.prototype.createProject = function (project) {
        return ProjectDao.addProject(project);
    };

    ResourceManager.prototype.queryProjects = function () {
        var _this = this;
        return ProjectDao.getProjects()
            .then(function (projects) {
                var tmp = {};
                _.forEach(projects, function (project) {
                    project.create_time = project.create_time ? new Date(project.create_time) : new Date();
                    project.update_time = project.update_time ? new Date(project.update_time) : new Date();
                    tmp[project.id] = project;
                });
                var projectMap = _this.projectTree.getProjectMap();
                var events = _this._buildEvent(projectMap, tmp);
                _.forEach(events, function (evt) {
                    if (evt.eventType === 'ADD' || evt.eventType === 'CHANGE') {
                        _this.projectTree.addProject(tmp[evt.resource.id]);
                        // _this.projectCache[evt.resource.id] = tmp[evt.resource.id];
                    } else if (evt.eventType == 'REMOVE') {
                        _this.projectTree.deleteProject(evt.resource.id);
                        // delete _this.projectCache[evt.resource.id];
                    }
                });
                _this._fireResourceChangeEvent(events);
            })
            .then(function () {
                return _this._listProjects();
            });
    };

    ResourceManager.prototype.getProjects = function () {
        return this._listProjects();
    };

    ResourceManager.prototype._listProjects = function () {
        var answer = this.projectTree.getProjectArray();
        // var answer = [];
        // for (var k in this.projectCache) {
        //     answer.push(this.projectCache[k]);
        // }
        this._sortByLabel(answer);
        return answer;
    };

    ResourceManager.prototype.getProject = function (projectId) {
        return this.projectTree.getProject(projectId);
        // return this.projectCache[projectId];
    };

    ResourceManager.prototype.updateProject = function (project) {
        return ProjectDao.updateProject(project);
    };

    ResourceManager.prototype.deleteProject = function (projectId) {
        return ProjectDao.deleteProject(projectId);
    };

    ResourceManager.prototype.queryFiles = function (projectId) {
        var _this = this;
        return FileDao.getFiles(projectId)
            .then(function (files) {
                var tmp = {};
                // _this.fileCache[projectId] = {};
                var file;
                _.forEach(files, function (file) {
                    file.create_time = file.create_time ? new Date(file.create_time) : new Date();
                    file.update_time = file.update_time ? new Date(file.update_time) : new Date();
                    tmp[file.id] = file;
                });
                var fileMap = _this.projectTree.getFileMap(projectId);
                var events = _this._buildEvent(fileMap, tmp);
                var supportModelList = Object.keys(Brightics.VA.Core.Interface.Clazz);
                _.forEach(events, function (evt) {
                    file = evt.resource;
                    if (typeof file !== 'undefined') {
                        var type = file.contents.type;
                        if (supportModelList.indexOf(type) < 0) return;
                    }

                    if (evt.eventType === 'ADD' || evt.eventType === 'CHANGE') {
                        file.contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(file.contents);
                        if (typeof file.contents.title === 'undefined') {
                            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('File is invalid.');
                            return;
                        }
                        file.contents.title = file.label;
                        file.contents.adjustLinks();
                        _this.projectTree.addFile(projectId, file);
                        // _this.fileCache[projectId][file.id] = file;
                    } else if (evt.eventType == 'REMOVE') {
                        _this.projectTree.deleteFile(projectId, file.id);
                        // delete _this.fileCache[projectId][file.id]
                    }
                });
                _this._fireResourceChangeEvent(events);
            })
            .then(function () {
                var fileList = _this._listFiles(projectId);
                _this.doMigration(fileList);
                return fileList;
            });
    };

    ResourceManager.prototype.queryFile = function (projectId, fileId) {
        var _this = this;
        return FileDao.getFiles(projectId)
            .then(function (files) {
                var tmp = {};
                // _this.fileCache[projectId] = {};
                var file;
                _.forEach(files, function (file) {
                    file.create_time = file.create_time ? new Date(file.create_time) : new Date();
                    file.update_time = file.update_time ? new Date(file.update_time) : new Date();
                    tmp[file.id] = file;
                });
                var fileMap = _this.projectTree.getFileMap(projectId);
                var events = _this._buildEvent(fileMap, tmp);
                var supportModelList = Object.keys(Brightics.VA.Core.Interface.Clazz);
                _.forEach(events, function (evt) {
                    file = evt.resource;
                    if (typeof file !== 'undefined') {
                        var type = file.contents.type;
                        if (supportModelList.indexOf(type) < 0) return;
                    }

                    if (evt.eventType === 'ADD' || evt.eventType === 'CHANGE') {
                        file.contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(file.contents);
                        if (typeof file.contents.title === 'undefined') {
                            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('File is invalid.');
                            return;
                        }
                        file.contents.title = file.label;
                        file.contents.adjustLinks();
                        _this.projectTree.addFile(projectId, file);
                        // _this.fileCache[projectId][file.id] = file;
                    } else if (evt.eventType == 'REMOVE') {
                        _this.projectTree.deleteFile(projectId, file.id);
                        // delete _this.fileCache[projectId][file.id]
                    }
                });
                _this._fireResourceChangeEvent(events);
            })
            .then(function () {
                return _this.projectTree.getFile(projectId, fileId);
                // return _this.fileCache[projectId][fileId];
            });
    };

    ResourceManager.prototype.getFiles = function (projectId, filter) {
        if (filter) return this._listFilesWithFilter(projectId, filter);
        return this._listFiles(projectId);
    };

    ResourceManager.prototype.getFile = function (projectId, fileId) {
        return this.projectTree.getFile(projectId, fileId);
        // if (projectId) {
        //     return this.fileCache[projectId][fileId];
        // } else {
        //     var answer;
        //     for (var key in this.fileCache) {
        //         if (this.fileCache[key][fileId]) {
        //             answer = this.fileCache[key][fileId];
        //             break;
        //         }
        //     }

        //     return answer;
        // }
    };

    ResourceManager.prototype._listFiles = function (projectId) {
        var answer = this.projectTree.getFileArray(projectId);
        // for (var k in this.fileCache[projectId]) {
        //     answer.push(this.fileCache[projectId][k]);
        // }
        this._sortByLabel(answer);
        return answer;
    };

    ResourceManager.prototype._listFilesWithFilter = function (projectId, filter) {
        var answer = [];
        if (typeof filter === 'string') {
            filter = {
                type: filter
            };
        }

        // var targetProject = this.fileCache[projectId];
        var targetProjectsFile = this.projectTree.getFileArray(projectId);
        _.forEach(targetProjectsFile, function (targetFile) {
            // var targetFile = targetProject[k];
            var modelContents = targetFile.contents;

            var condition = true;
            for (var key in filter) {
                if (modelContents[key] !== filter[key]) {
                    condition = false;
                    break;
                }
            }
            if (condition) {
                answer.push(targetFile);
            }
        });
        this._sortByLabel(answer);
        return answer;
    };

    ResourceManager.prototype.updateFile = function (file) {
        var _this = this;
        return FileDao.updateFileSync(file.project_id, file)
            .then(function (updated) {
                var events = [];
                file.event_key = updated[0].event_key;
                events.push({ eventType: 'CHANGE', resource: file });
                _this.projectTree.addFile(file.project_id, file);
                // _this.fileCache[file['project_id']][file.id] = file;
                _this._fireResourceChangeEvent(events);
            });
    };

    ResourceManager.prototype.deleteFile = function (projectId, fileId) {
        return FileDao.deleteFile(projectId, fileId)
            .then(function () {
                return fileId;
            });
    };

    ResourceManager.prototype.validateFile = function (file) {
        var errorMessage = '';

        try {
            if (file instanceof Array) {
                for (const f of file) {
                    if (typeof f.mid === 'undefined') {
                        errorMessage = 'Invalid Model File.';
                    } else if (Brightics.VA.Core.Interface.ProjectContextMenuList[f.type].indexOf('export') < 0) {
                        errorMessage = 'Invalid Model File.';
                    }
                }
            } else {
                if (typeof file.mid === 'undefined') {
                    errorMessage = 'Invalid Model File.';
                } else if (Brightics.VA.Core.Interface.ProjectContextMenuList[file.type].indexOf('export') < 0) {
                    errorMessage = 'Invalid Model File.';
                }
            }

            return errorMessage;
        } catch (err) {
            return 'Invalid Model(.json) File.';
        }
    };

    ResourceManager.prototype.changeFileCache = function (file) {
        var event = {eventType: 'CHANGE', resource: file};
        this.projectTree.addFile(file.project_id, file);
        // this.fileCache[file.project_id][file.id] = file;
        this._fireResourceChangeEvent([event]);
    };

    ResourceManager.prototype.cloneFileContents = function (mid, modelData) {
        var contents = Brightics.VA.Core.Utils.ModelUtils.cloneModel(modelData);
        contents.mid = mid;
        return contents;
    };

    ResourceManager.prototype.doMigration = function (fileList) {
        var migrator = new Brightics.VA.Core.Tools.ModelMigrator.Executor();
        for (var file in fileList) {
            migrator.migrate(fileList[file].contents);
        }
    };

    ResourceManager.prototype._fireResourceChangeEvent = function (events) {
        for (var i in events) {
            Studio.getInstance().fireResourceChangedEvent(events[i]);
        }
    };

    ResourceManager.prototype._buildEvent = function (oldResources, newResources) {
        var events = [];

        var oResource, nResource;
        for (var nKey in newResources) {
            nResource = newResources[nKey];
            if (oldResources[nKey]) {
                // already exist
                oResource = oldResources[nKey];
                if (nResource.event_key == oResource.event_key) {
                    // unchanged
                    if (Number(nResource.update_time) != Number(oResource.update_time)) {
                        // changed
                        events.push({eventType: 'CHANGE', resource: nResource});
                    }
                } else {
                    // changed
                    events.push({eventType: 'CHANGE', resource: nResource});
                }
            } else {
                // added
                events.push({eventType: 'ADD', resource: nResource});
            }
        }

        for (var oKey in oldResources) {
            if (!newResources[oKey]) {
                // removed
                events.push({eventType: 'REMOVE', resource: oldResources[oKey]});
            }
        }

        return events;
    };

    ResourceManager.prototype._sortByLabel = function (array) {
        array.sort(function (e1, e2) {
            var label1 = e1.label.toLowerCase();
            var label2 = e2.label.toLowerCase();
            if (label1 < label2) return -1;
            if (label1 > label2) return 1;
            return 0;
        });
    };

    ResourceManager.prototype.cacheFileVersion = function (projectId, fileId, versionId) {
        var _this = this;
        return VersionDao.getVersion(projectId, fileId, versionId)
            .then(function (version) {
                version.contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(version.contents);
                if (typeof version.contents.title === 'undefined') {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('File is invalid.');
                    return;
                }
                version.contents.title = version.label;
                version.contents.mid = version.file_id;
                version.contents.adjustLinks();
                _this.projectTree.addVersion(projectId, fileId, version);
                return version;
            });
    };

    ResourceManager.prototype.getFileVersion = function (projectId, fileId, versionId) {
        if (this.projectTree.hasVersion(projectId, fileId, versionId)) {
            return Promise.resolve(this.projectTree.getVersion(projectId, fileId, versionId));
        }
        return this.cacheFileVersion(projectId, fileId, versionId);
    };

    ResourceManager.prototype.getCachedFileVersion = function (projectId, fileId, versionId) {
        // assert(this.fileVersionCache[projectId][fileId][versionId]);
        return this.projectTree.getVersion(projectId, fileId, versionId);
    };

    Brightics.VA.ResourceManager = ResourceManager;
}).call(this);
