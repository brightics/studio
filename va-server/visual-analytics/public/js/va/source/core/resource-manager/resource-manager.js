/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 31
 */

import { EventEmitter } from '../../../../../../src/event-emitter/event-emitter';
import { ProjectDao } from '../dao/project-dao';
import { FileDao } from '../dao/file-dao';
import { VersionDao } from '../dao/version-dao';
import { inherits } from '../../../../../../src/utils/inherits';
import { HashMap } from '../../../../../../src/data-structures/index';
import { ProjectTree } from '../../../../../../src/data-structures/project-tree/project-tree';
import { forEach } from '../../../../../../src/utils/index';
import { ResourceValidator } from './resource-validator';

var EVENT = {
    PROJECT: {
        ADD: 'project:add',
        CHANGE: 'project:change',
        DELETE: 'project:delete'
    },
    FILE: {
        ADD: 'file:add',
        CHANGE: 'file:change',
        DELETE: 'file:delete'
    },
    VERSION: {
        ADD: 'version:add',
        CHANGE: 'version:change',
        DELETE: 'version:delete'
    }
};

var ADD = 'add';
var CHANGE = 'change';
var DELETE = 'delete';

/**
 * @event root:change
 * @event project:change
 * @event project:add
 * @event project:delete
 * @event file:change
 * @event file:add
 * @event file:delete
 * @event version:change
 * @event version:add
 * @event version:delete
 */

/* global _ */

function ResourceManager() {
    EventEmitter.call(this);
    this.projectTree = new ProjectTree();
}

inherits(ResourceManager, EventEmitter);

ResourceManager.prototype.initProject = function (project) {
    var _this = this;
    return this.fetchFiles(project.getProjectId()).then(function (files) {
        return Promise.all(_.map(files, _this.initFile.bind(_this)));
    });
};

ResourceManager.prototype.initFile = function (file) {
    return this.fetchVersions(file.getProjectId(), file.getFileId());
};

ResourceManager.prototype._getResourceDiff = function (_prev, cur) {
    var prev = _.compact(_.flatten(_prev));
    var hashMap = new HashMap();
    var diff = [];

    forEach(prev, function (elem) {
        hashMap.set(elem.getHashCode(), elem);
    });

    forEach(cur, function (elem) {
        var code = elem.getHashCode();
        if (hashMap.has(code)) {
            var prevElem = hashMap.get(code);
            if (!prevElem.equals(elem)) {
                diff.push({
                    type: CHANGE,
                    data: elem
                });
            }
            hashMap.remove(code);
        } else {
            diff.push({
                type: ADD,
                data: elem
            });
        }
    });

    forEach(hashMap.toArray(), function (elem) {
        diff.push({
            type: DELETE,
            data: elem
        });
    });
    return diff;
};

ResourceManager.prototype._syncProject = function (diff) {
    var _this = this;
    forEach(diff, function (diffInfo) {
        var data = diffInfo.data;
        if (diffInfo.type == ADD) _this._addProject(data);
        if (diffInfo.type == CHANGE) _this._updateProject(data);
        if (diffInfo.type == DELETE) _this._deleteProject(data.getProjectId());
    });
};

ResourceManager.prototype._syncFile = function (diff) {
    var _this = this;
    forEach(diff, function (diffInfo) {
        var data = diffInfo.data;
        if (diffInfo.type == ADD) _this._addFile(data.getProjectId(), data);
        if (diffInfo.type == CHANGE) _this._updateFile(data.getProjectId(), data);
        if (diffInfo.type == DELETE) _this._deleteProject(data.getProjectId(), data.getFileId());
    });
};

ResourceManager.prototype._syncVersion = function (diff) {
    var _this = this;
    forEach(diff, function (diffInfo) {
        var data = diffInfo.data;
        var pid = _this.projectTree
            .getProjectNodeByFileId(data.getFileId()).getData().getProjectId();
        if (diffInfo.type == ADD) _this._addVersion(pid, data.getFileId(), data);
        if (diffInfo.type == CHANGE) _this._updateVersion(pid, data.getFileId(), data);
        // if (diff.type == DELETE) _this._deleteVersion(pid, data.getFileId(), data.getVersionId());
    });
};

ResourceManager.prototype._updateProject = function (project) {
    this.projectTree.updateProject(project);
    this.emit(EVENT.PROJECT.CHANGE, project);
};

ResourceManager.prototype._addProject = function (project) {
    this.projectTree.addProject(project);
    this.emit(EVENT.PROJECT.ADD, project);
};

ResourceManager.prototype._deleteProject = function (projectId) {
    var project = this.projectTree.deleteProject(projectId);
    this.emit(EVENT.PROJECT.DELETE, project);
    return project;
};

ResourceManager.prototype._updateFile = function (projectId, file) {
    this.projectTree.updateFile(projectId, file);
    this.emit(EVENT.FILE.CHANGE, file);
    return file;
};

ResourceManager.prototype._addFile = function (projectId, file) {
    this.projectTree.addFile(projectId, file);
    this.emit(EVENT.FILE.ADD, file);
    return file;
};

ResourceManager.prototype._deleteFile = function (projectId, fileId) {
    var file = this.projectTree.deleteFile(projectId, fileId);
    this.emit(EVENT.FILE.DELETE, file);
    return file;
};

ResourceManager.prototype._updateVersion = function (projectId, fileId, version) {
    this.projectTree.updateVersion(projectId, fileId, version);
    this.emit(EVENT.VERSION.CHANGE, version);
    return version;
};

ResourceManager.prototype._addVersion = function (projectId, fileId, version) {
    this.projectTree.addVersion(projectId, fileId, version);
    this.emit(EVENT.VERSION.ADD, version);
    return version;
};

ResourceManager.prototype._deleteVersion = function (projectId, fileId, versionId) {
    var version = this.projectTree.addVersion(projectId, fileId, versionId);
    this.emit(EVENT.VERSION.DELETE, version);
    return version;
};

ResourceManager.prototype.fetchProject = function (projectId) {
    var _this = this;
    return ProjectDao.getProject(projectId)
        .then(function (project) {
            var prevProject = _this.projectTree.getProject(projectId);
            _this._syncProject(_this._getResourceDiff([prevProject], [project]));
            return project;
        })
        .catch(function (err) {
            console.error(err);
            throw new Error('failed to fetch project');
        });
};

/**
 * 서버에서 프로젝트 정보 받아옴
 * @return {Promise<Array<Project>>}
 */
ResourceManager.prototype.fetchProjects = function () {
    var _this = this;
    return ProjectDao.getProjects()
        .then(function (projects) {
            var prevProjects = _this.projectTree.getProjects();
            _this._syncProject(_this._getResourceDiff([prevProjects], projects));
            return projects;
        })
        .catch(function (err) {
            throw new Error('failed to fetch projects');
        });
};

/**
 * 서버에서 해당 프로젝트에 있는 파일 정보 받아옴
 * @param {String} projectId 프로젝트 아이디
 * @return {Promise<Array<File>>}
 */
ResourceManager.prototype.fetchFiles = function (projectId) {
    var _this = this;
    return FileDao.getFiles(projectId)
        .then(function (files) {
            var prevFiles = _this.projectTree.getFiles(projectId);
            _this._syncFile(_this._getResourceDiff([prevFiles], files));
            return files;
        });
    // .catch(function (err) {
    //     console.error(err);
    //     throw err;
    // });
};

ResourceManager.prototype.fetchFile = function (projectId, fileId) {
    var _this = this;
    return FileDao.getFile(projectId, fileId)
        .then(function (file) {
            var prevFile = _this.projectTree.getFile(projectId, fileId);
            _this._syncFile(_this._getResourceDiff([prevFile], [file]));
            return file;
        })
        .catch(function (err) {
            throw new Error('filed to fetch file');
        });
};

/**
 * 서버에서 해당 프로젝트, 파일에 있는 버전 정보 받아옴
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @return {Promise<Array<Version>>}
 */
ResourceManager.prototype.fetchVersions = function (projectId, fileId) {
    var _this = this;
    return VersionDao.getVersions(projectId, fileId)
        .then(function (versions) {
            var projectId = _this.projectTree
                .getProjectNodeByFileId(fileId).getData().getProjectId();
            var prevVersions = _this.projectTree.getVersions(projectId, fileId);
            _this._syncVersion(_this._getResourceDiff([prevVersions], versions));
            return versions;
        })
        .catch(function (err) {
            throw new Error('failed to fetch versions');
        });
};

ResourceManager.prototype.fetchVersion = function (projectId, fileId, versionId) {
    var _this = this;
    return VersionDao.getVersion(projectId, fileId, versionId)
        .then(function (version) {
            // var projectId = _this.projectTree
            //     .getProjectNodeByFileId(fileId).getData().getProjectId();
            var prevVersion = _this.projectTree.getVersion(projectId, fileId, versionId);
            _this._syncVersion(_this._getResourceDiff([prevVersion], [version]));
            return version;
        })
        .catch(function (err) {
            throw new Error('filed to fetch version');
        });
};

/**
 * 서버에서 프로젝트, 파일, 버전 정보 받아와서 캐싱
 */
ResourceManager.prototype.build = function () {
    var _this = this;
    return this.fetchProjects()
        .then(function (projects) {
            return Promise.all(_.map(projects, _this.initProject.bind(_this)));
        });
};

/**
 * 캐싱되어 있는 프로젝트 정보 반환
 * @return {Array<Project>}
 */
ResourceManager.prototype.getProjects = function () {
    return this.projectTree.getProjects();
};

/**
 * 캐싱되어 있는 해당 프로젝트 정보 반환
 * @param {String} projectId 프로젝트 아이디
 * @return {Project}
 */
ResourceManager.prototype.getProject = function (projectId) {
    return this.projectTree.getProject(projectId);
};

/**
 * 프로젝트 추가
 * @event root:change
 * @event project:add
 * @param {Project} project 프로젝트 정보
 * @return {Promise<Project>}
 */
ResourceManager.prototype.addProject = function (project) {
    var _this = this;
    return ProjectDao.addProject(project)
        .then(function (/* project */) {
            _this._addProject(project);
            return project;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

/**
 * @event root:change
 * @event project:change
 * @param {Project} project 프로젝트 정보
 * @return {Promise<Project>}
 */
ResourceManager.prototype.updateProject = function (project) {
    var _this = this;
    return ProjectDao.updateProject(project)
        .then(function () {
            _this._updateProject(project);
            return project;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

/**
 * @event root:change
 * @event project:delete
 * @param {String} projectId
 * @return {Promise<Object>}
 */
ResourceManager.prototype.deleteProject = function (projectId) {
    var _this = this;
    return ProjectDao.deleteProject(projectId)
        .then(function () {
            return _this._deleteProject(projectId);
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

/**
 * 캐싱되어 있는 해당 프로젝트의 파일 정보를 반환
 * @param {String} projectId 프로젝트 아이디
 * @return {Array<File>}
 */
ResourceManager.prototype.getFiles = function (projectId) {
    return this.projectTree.getFiles(projectId);
};

ResourceManager.prototype.getFilesByModelType = function (projectId, type) {
    return _.filter(this.getFiles(projectId), function (file) {
        return file.getContents().type == type;
    });
};

/**
 * 캐싱되어 있는 해당 파일 정보를 반환
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @return {File}
 */
ResourceManager.prototype.getFile = function (projectId, fileId) {
    return this.projectTree.getFile(projectId, fileId);
};

/**
 * @event root:change
 * @event project:change
 * @event file:add
 * @param {String} projectId 프로젝트 아이디
 * @param {File} file 파일 정보
 * @return {Promise<File>}
 */
ResourceManager.prototype.addFile = function (projectId, file) {
    var _this = this;
    return FileDao.addFile(projectId, file)
        .then(function () {
            _this._addFile(projectId, file);
            return file;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

/**
 * @event root:change
 * @event project:change
 * @event file:change
 * @param {String} projectId 프로젝트 아이디
 * @param {File} file 파일 아이디
 * @return {Promise<File>}
 */
ResourceManager.prototype.updateFile = function (projectId, file) {
    var _this = this;
    this.lastQuery = this.lastQuery || Promise.resolve();
    this.lastQuery = this.lastQuery
        .then(function () {
            return new Promise(function (resolve, reject) {
                FileDao.updateFileSync(projectId, file)
                    .then(function (updated) {
                        // file == updated임이 보장되는가?
                        file.setEventKey(updated.getEventKey());
                        file.setUpdateTime(updated.getUpdateTime());
                        _this._updateFile(projectId, file);
                        resolve([null, file]);
                    })
                    .catch(function (err) {
                        console.error(err);
                        resolve([err, file]);
                    });
            });
        });
    return this.lastQuery;
};

ResourceManager.prototype.saveFile = function (projectId, file, modelDiff) {
    this.lastQuery = this.lastQuery || Promise.resolve();
    this.lastQuery = this.lastQuery.then(() => {
        return FileDao.saveFileSync(projectId, file, modelDiff)
            .then((updated) => {
                if (updated) {
                    const { event_key, update_time } = updated;
                    file.setEventKey(event_key);
                    file.setUpdateTime(update_time);
                    this._updateFile(projectId, file);
                    return file;
                }

                return new Promise((resolve) => {
                    FileDao.updateFileSync(projectId, file)
                        .then((updated) => {
                            // file == updated임이 보장되는가?
                            file.setEventKey(updated.getEventKey());
                            file.setUpdateTime(updated.getUpdateTime());
                            this._updateFile(projectId, file);
                            resolve([null, file]);
                        })
                        .catch(function (err) {
                            console.error(err);
                            resolve([err, file]);
                        });
                });
            })
            .catch(function (err) {
                console.error(err);
                throw err;
            });
    });
    return this.lastQuery;
};

/**
 * @event root:change
 * @event project:change
 * @event file:delete
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @return {Promise<Boolean>}
 */
ResourceManager.prototype.deleteFile = function (projectId, fileId) {
    var _this = this;
    return FileDao.deleteFile(projectId, fileId)
        .then(function () {
            return _this._deleteFile(projectId, fileId);
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

/**
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @return {Array<Version>}
 */
ResourceManager.prototype.getVersions = function (projectId, fileId) {
    return this.projectTree.getVersions(projectId, fileId);
};

/**
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @param {String} versionId 버전 아이디
 * @return {Version}
 */
ResourceManager.prototype.getVersion = function (projectId, fileId, versionId) {
    return this.projectTree.getVersion(projectId, fileId, versionId);
};

/**
 * @event root:change
 * @event project:change
 * @event file:change
 * @event version:add
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @param {Verion} version 버전 정보
 * @return {Promise<Version>}
 */
ResourceManager.prototype.addVersion = function (projectId, fileId, version) {
    var _this = this;
    return VersionDao.addVersion(projectId, fileId, version)
        .then(function (version) {
            _this._addVersion(projectId, fileId, version);
            return version;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

/**
 * @event root:change
 * @event project:change
 * @event file:change
 * @event version:change
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @param {Version} version 버전 정보
 * @return {Promise<Version>}
 */
ResourceManager.prototype.updateVersion = function (projectId, fileId, version) {
    var _this = this;
    return VersionDao.updateVersion(projectId, fileId, version)
        .then(function () {
            _this._updateVersion(projectId, fileId, version);
            return version;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

/**
 * @event root:change
 * @event project:change
 * @event file:change
 * @param {String} projectId 프로젝트 아이디
 * @param {String} fileId 파일 아이디
 * @param {String} versionId 버전 아이디
 * @param {Promise<File>}
 */
ResourceManager.prototype.loadVersion = function (projectId, fileId, versionId) {
    var _this = this;
    return VersionDao.loadVersion(projectId, fileId, versionId)
        .then(function (file) {
            _this._updateFile(projectId, file);
            return file;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

ResourceManager.prototype.validateFile = function (file, fileType) {    
    return ResourceValidator.validate(file, fileType);
};

var resourceManager = new ResourceManager();

export { resourceManager as ResourceManager };
