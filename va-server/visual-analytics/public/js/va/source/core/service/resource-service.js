'use strict';
/* -----------------------------------------------------
 *  resource-service.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-13.
 * ----------------------------------------------------*/

import { Project, File, Version } from '../vomodels/index';
import { ResourceManager } from '../resource-manager/resource-manager';
import { HashMap } from '../../../../../../src/data-structures/hash-map/hash-map';
import { serial, parallel } from '../../../../../../src/utils/promise-utils';
import { ExportProjectSpec } from './export-project-spec';
import { ExportFilesSpec } from './export-files-spec';
import { ExportSpecConverter } from './export-spec-converter';
import IDGenerator from '../../../../../../src/idgenerator';
import { CORE_VERSION } from '../../../../../../src/const/env';

/* global Brightics, _, OUT_DATA,FUNCTION_NAME */

const resourceType2Info = {
    // 'project': {
    //     _constructor: Project
    //     // priority: 0
    // },
    // 'file': {
    //     _constructor: File
    //     // priority: 1
    // },
    // 'version': {
    //     _constructor: Version
    //     // priority: 2
    // }
};

const Resources = [Project, File, Version];
_.forEach(Resources, function (rsc) {
    resourceType2Info[rsc.prototype.getResourceName()] = {
        _constructor: rsc,
    };
});


class ResourceService {
    exportProject(projectId) {
        return ResourceManager.fetchProject(projectId)
            .then((project) => {
                return ResourceManager.fetchFiles(projectId)
                    .then((files) => {
                        return this._collectResources(files, projectId, true);
                    })
                    .then((resources) => {
                        return this._exportProjectFromResources(project, resources);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    _collectResources(_files, projectId, includeDependency) {
        const files = _.isArray(_files) ? _files : [_files];

        return Promise
            .all(_.map(files, (file) => {
                return includeDependency ? this._getDependentResources(file, projectId) : [file];
            }))
            .then((resources) => {
                return this._makeUnique(_.flatten(resources));
            })
            .then((uniqueResources) => {
                return this._appendMissedFiles(uniqueResources, projectId);
            });
    }

    exportJSON(fileId, sourceProjectId, includeDependency) {
        return ResourceManager.fetchFile(sourceProjectId, fileId)
            .then(_.bind(this._collectResources, this, _, sourceProjectId, includeDependency))
            .then(_.bind(this._exportFilesFromResources, this))
            .catch(console.error);
    }

    exportJSONs(fileIds, sourceProjectId, includeDependency) {
        return Promise
            .all(_.map(fileIds,
                _.bind(this.exportJSON, this, _, sourceProjectId, includeDependency)))
            .catch(console.error);
    }

    _exportFilesFromResources(resources, sourceProjectId) {
        return new ExportFilesSpec(resources).toJSON();
    }

    _exportProjectFromResources(project, resources) {
        return new ExportProjectSpec(project, resources).toJSON();
    }

    _appendMissedFiles(resources, projectId) {
        return this._getMissedFile(resources, projectId)
            .then(function (missed) {
                return resources.concat(missed);
            });
    }

    _traverseParamFunctions(fns, forEachFn) {
        _.forEach(fns, (fn) => {
            if (fn.param.functions) {
                this._traverseParamFunctions(fn.param.functions, forEachFn);
            }
            forEachFn(fn);
        });
    }

    _getDependentResources(file, projectId) {
        const mainModel = file.getContents();
        const registerDependentResources = new HashMap();

        const recModel = function (model) {
            return Promise.all(_.map(model.functions, function (fn) {
                if (fn[FUNCTION_NAME] === 'Flow') {
                    if (fn.param.mid && fn.param.versionId) {
                        if (!registerDependentResources.has(fn.param.versionId)) {
                            return ResourceManager
                                .fetchVersion(projectId, fn.param.mid, fn.param.versionId)
                                .then(function (v) {
                                    registerDependentResources.set(fn.param.versionId, v);
                                    return recResource(v);
                                })
                                .catch(_.noop);
                        }
                    } else if (fn.param.mid) {
                        if (!registerDependentResources.has(fn.param.mid)) {
                            return ResourceManager
                                .fetchFile(projectId, fn.param.mid)
                                .then(function (f) {
                                    registerDependentResources.set(fn.param.mid, f);
                                    return recResource(f);
                                })
                                .catch(_.noop);
                        }
                    }
                } else if (fn.func === 'loadFromStaging') {
                    if (fn.param.modelId) {
                        if (!registerDependentResources.has(fn.param.model)) {
                            return ResourceManager
                                .fetchFile(projectId, fn.param.modelId)
                                .then(function (f) {
                                    registerDependentResources.set(fn.param.modelId, f);
                                    return recResource(f);
                                })
                                .catch(_.noop);
                        }
                    }
                }
                const subModels = Brightics.VA.Core.Utils.NestedFlowUtils
                    .getSubModels(mainModel, fn);
                return Promise.all(_.map(subModels, recModel));
            }));
        };

        const recResource = function (resource) {
            const model = resource.getContents();
            return recModel(model);
        };

        return recResource(file)
            .then(function () {
                return _.compact(registerDependentResources.toArray()).concat([file]);
            });
    }

    _makeUnique(resources) {
        const resourceMap = new HashMap();
        _.forEach(resources, function (resource) {
            resourceMap.set(resource.getHashCode(), resource);
        });
        return resourceMap.toArray();
    }

    _getMissedFile(resources, projectId) {
        const includedFiles = new HashMap();
        _.forEach(resources, function (resource) {
            if (resource instanceof File) {
                includedFiles.set(resource.getFileId(), resource);
            }
        });

        const missedFilesId = new HashMap();
        _.forEach(resources, function (resource) {
            if (resource instanceof Version &&
                    !includedFiles.has(resource.getFileId()) &&
                    !missedFilesId.has(resource.getFileId())) {
                missedFilesId.set(resource.getFileId(), resource.getFileId());
            }
        });

        return Promise.all(_.map(missedFilesId.toArray(), function (fileId) {
            return ResourceManager.fetchFile(projectId, fileId);
        }));
    }

    _jsons2resource(jsons) {
        return _.map(jsons, function (json) {
            const constructor = resourceType2Info[json.type]._constructor;
            return new constructor(json.data);
        });
    }

    _importResources(resources, targetProjectId) {
        this._changePrevKeys(resources);
        const prv2newVersionId = this._collectVersionId(resources);
        const prv2newFileId = this._collectModelId(resources);
        this._remapProjectId(resources, targetProjectId);
        this._remapFileAndVersionId(resources, prv2newFileId, prv2newVersionId);
        // 필요없는 로직
        // const links = this.calcTableIdLinks(resources);

        const projectPromises = [];
        const filePromises = [];
        const versionPromises = [];

        _.forEach(resources, function (resource) {
            if (resource instanceof Project) {
                throw new Error('unexpected data');
            }
            if (resource instanceof File) {
                filePromises.push(function () {
                    return ResourceManager.addFile(targetProjectId, resource);
                });
            }
            if (resource instanceof Version) {
                resource.setIsManual(true);
                versionPromises.push(function () {
                    return ResourceManager.addVersion(
                        targetProjectId,
                        resource.getFileId(),
                        resource);
                });
            }
        });

        const promiseFn = function (fns) {
            return function () {
                return parallel(fns);
            };
        };
        return serial([
            promiseFn(projectPromises),
            promiseFn(filePromises),
            promiseFn(versionPromises),
        ]);
        // .then(function () {
        //     const opt = {
        //         url: 'api/va/v2/data/link/create',
        //         type: 'POST',
        //         contentType: 'application/json; charset=utf-8',
        //         data: JSON.stringify({
        //             links: links
        //         }),
        //         blocking: true
        //     };
        //     return Promise.resolve($.ajax(opt));
        // });
    }

    checkPreviousFileSpec(json) {
        // TODO : Implement
        let isValid = true;
        if (json.type === 'project') isValid = false;
        if (_.has(json, 'version')) isValid = false;
        return isValid;
    }

    // 가정: 한 프로젝트(target project)에 import 된다
    importJSONs(_jsons, targetProjectId) {
        const preprocessJsons = (jsons) => {
            return Promise
                .all(_.map(jsons, (json) => {
                    if (json.type !== 'files') {
                        if (this.checkPreviousFileSpec(json)) {
                            return ExportSpecConverter.convertFilesSpec(json, json.version);
                        } else {
                            return Promise.reject(new Error('invalid export file spec'));
                        }
                    }

                    if (json.version !== CORE_VERSION) {
                        return ExportSpecConverter.convertFilesSpec(json, json.version);
                    }
                    return json;
                }));
        };

        return preprocessJsons(_jsons)
            .then((jsons) => {
                return _.map(jsons, (json) => {
                    return this._jsons2resource(json.data);
                });
            })
            .then(_.flatten)
            .then(this._makeUnique.bind(this))
            .then((resources) => {
                return this._importResources(resources, targetProjectId);
            });
    }

    importJSON(jsons, targetProjectId) {
        return this.importJSONs([jsons], targetProjectId);
    }

    // FIXME: 컨트롤플로우에서 쓰고 있는 버전인데 없는 파일이면?
    _collectVersionId(resources) {
        const map = new HashMap();
        _.forEach(resources, function (resource) {
            if (resource instanceof Version) {
                if (!map.has(resource.getVersionId())) {
                    map.set(resource.getVersionId(), IDGenerator.version.id());
                }
            }
        });
        return map;
    }

    _collectModelId(resources) {
        const map = new HashMap();
        const set = function (id) {
            if (!map.has(id)) {
                map.set(id, IDGenerator.model.id());
            }
        };
        _.forEach(resources, function (resource) {
            if (resource instanceof File || resource instanceof Version) {
                set(resource.getFileId());
                _.forIn(resource.getContents().functions, function (fn) {
                    if (fn.param && fn.param.modelId) {
                        set(fn.param.modelId);
                    }
                });
                _.forIn(resource.getContents().innerModels, function (innerModel) {
                    set(innerModel.mid);
                });
            }
        });
        return map;
    }

    _remapProjectId(resources, targetProjectId) {
        _.forEach(resources, function (resource) {
            if (resource instanceof File) {
                // 필요없긴 함
                resource.setProjectId(targetProjectId);
            }
        });
    }

    _remapFileAndVersionId(resources, midMap, vidMap) {
        const remapInnerModel = function (mainModel, model) {
            _.forEach(model.functions, function (fn) {
                if (fn[FUNCTION_NAME] === 'Flow') {
                    if (fn.param.mid) {
                        fn.param.mid = midMap.get(fn.param.mid) || fn.param.mid;
                    }
                    if (fn.param.versionId) {
                        fn.param.versionId = vidMap.get(fn.param.versionId) || fn.param.versionId;
                    }
                }

                if (fn[FUNCTION_NAME] === 'DataViewer') {
                    fn.param.mid = midMap.get(fn.param.mid);
                }

                if (fn[FUNCTION_NAME] === 'If') {
                    fn.param.if.mid = midMap.get(fn.param.if.mid) || fn.param.if.mid;
                    _.forEach(fn.param.elseif, function (elseif) {
                        elseif.mid = midMap.get(elseif.mid) || elseif.mid;
                    });
                    fn.param.else.mid = midMap.get(fn.param.else.mid) || fn.param.else.mid;
                }

                if (fn[FUNCTION_NAME] === 'ForLoop' || fn[FUNCTION_NAME] === 'WhileLoop') {
                    fn.param.mid = midMap.get(fn.param.mid) || fn.param.mid;
                }
                const subModels = Brightics.VA.Core.Utils.NestedFlowUtils
                    .getSubModels(mainModel, fn);
                _.forEach(subModels, _.partial(remapInnerModel, mainModel, _));
            });
        };
        _.forEach(resources, function (resource) {
            if (resource instanceof File || resource instanceof Version) {
                resource.setFileId(midMap.get(resource.getFileId()));
                resource.getContents().mid = resource.getFileId();
                if (resource instanceof Version) {
                    resource.setVersionId(vidMap.get(resource.getVersionId()));
                    resource.getContents().version_id = resource.getVersionId();
                }
                if (resource instanceof File && resource.getType() === 'visual') {
                    _.forEach(resource.getContents().functions, function (fn) {
                        if (fn.param.modelId) {
                            fn.param.modelId = midMap.get(fn.param.modelId);
                        }
                    });
                }
                const mainModel = resource.getContents();
                const newInnerModels = _.reduce(_.map(mainModel.innerModels, function (model, key) {
                    const ret = {};
                    model.mid = midMap.get(key) || key;
                    ret[model.mid] = model;
                    return ret;
                }), _.merge, {});
                mainModel.innerModels = newInnerModels;
                remapInnerModel(mainModel, mainModel);
            }
        });
    }

    _changePrevKeys(resources) {
        const cacheMap = {
            fidCache: {},
            tidCache: {},
        };
        _.forEach(resources, function (resource) {
            if (resource instanceof File || resource instanceof Version) {
                const model = resource.getContents();
                Brightics.VA.Core.Utils.ModelUtils
                    .createCacheNestedFlow(model, model, cacheMap);
            }
        });

        _.forEach(resources, function (resource) {
            if (resource instanceof File || resource instanceof Version) {
                const model = resource.getContents();
                const contents = Brightics.VA.Core.Utils.ModelUtils
                    .setKeyNestedFlow(model, model, cacheMap);
                resource.setContents(contents);
            }
        });
    }


    preprocessProjectJson(json) {
        if (json.type === 'project' && json.version === CORE_VERSION) {
            return Promise.resolve(json);
        } else {
            return ExportSpecConverter.convertProjectSpec(json, json.version);
        }
    }

    importProject(json) {
        return this.preprocessProjectJson(json)
            .then(function (json) {
                const project = new Project(json.data);
                const projectId = IDGenerator.project.id();
                project.setProjectId(projectId);

                const resources = this._jsons2resource(json.children);

                return ResourceManager.addProject(project)
                    .then(() => {
                        return ResourceManager.fetchProject(projectId);
                    })
                    .then((project) => {
                        return this._importResources(resources, projectId);
                    })
                    .then(() => {
                        return projectId;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }.bind(this));
    }

    validateExportedProjectSpec(json) {
        try {
            return this.preprocessProjectJson(json);
            // TODO: validate
        } catch (e) {
            return Promise.reject(e);
        }
    }

    duplicateFile(fileId,
            sourceProjectId, targetProjectId, includeDependency, prvFileName, newFileName) {
        const renameFileName = function (json) {
            json.data = _.map(json.data, function (exportedResourceSpec) {
                if (exportedResourceSpec.type === 'file' && exportedResourceSpec.data.id === fileId) {
                    exportedResourceSpec.data.label = newFileName;
                } else {
                    exportedResourceSpec.data.label += '_' + prvFileName;
                }
                return exportedResourceSpec;
            });
        };

        return this.exportJSON(fileId, sourceProjectId, includeDependency)
            .then((json) => {
                const cloned = _.cloneDeep(json);
                renameFileName(cloned);
                return this.importJSON(cloned, targetProjectId);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    calcTableIdLinks(resources) {
        const links = [];
        const forEachModels = function (mainModel, model) {
            _.forEach(model.functions, function (fn) {
                if (fn[FUNCTION_NAME] === 'DataViewer') {
                    _.forEach(fn[OUT_DATA], function (tid) {
                        links.push({
                            source: ['',
                                Brightics.VA.Env.Session.userId,
                                fn.param.mid,
                                fn[OUT_DATA],
                            ].join('/'),
                            alias: ['',
                                Brightics.VA.Env.Session.userId,
                                model.mid,
                                fn[OUT_DATA],
                            ].join('/'),
                        });
                    });
                }
                const subModels = Brightics.VA.Core.Utils.NestedFlowUtils
                    .getSubModels(mainModel, fn);
                _.forEach(subModels, _.partial(forEachModels, mainModel, _));
            });
        };

        _.forEach(resources, function (resource) {
            if (resource instanceof File || resource instanceof Version) {
                const model = resource.getContents();
                forEachModels(model, model);
            }
        });
        return links;
    }
}

const resourceService = new ResourceService();

export { resourceService as ResourceService };
