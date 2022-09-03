/**
 * Created by SDS on 2016-01-28.
 */

/* global _ */
(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;
    root.Brightics.VA.Core.Utils.ExportUtils = {
        exportProject: function (projectId, doneCallback, failCallback) {
            _getProject(projectId, doneCallback, failCallback);
        }
    };

    function _getProject(projectId, doneCallback, failCallback) {
        ResourceManager.fetchProject(projectId)
            .then(function (project) {
                return ResourceManager.initProject(project);
            })
            .then(function () {
                var project = ResourceManager.getProject(projectId).toJSON();
                if (!project) return Promise.reject('there is no project');
                project.files = _.map(ResourceManager.getFiles(projectId), function (file) {
                    return file.toJSON();
                });
                return _getRelatedDataflowVersion(project)
                    .then(function (versions) {
                        project.versions = _.map(versions, function (version) {
                            return version.toJSON();
                        });
                        return project;
                    });
            })
            .then(function (project) {
                if (doneCallback && typeof doneCallback === 'function') {
                    doneCallback([project]);
                }
            })
            .catch(function (err) {
                failCallback(err);
            });
    }

    function _getRelatedDataflowVersion(project) {
        var cfModels = _.filter(project.files, function (file) {
            return file.type === 'control';
        });

        var promises = _.map(cfModels, function (model) {
            return Brightics.VA.Core.Utils.ModelUtils.createModelTree(project.id, model.contents);
        });

        return Promise.all(promises)
            .then(function mergeModelTree(versions) {
                return _.reduce(versions, _.merge, {});
            })
            .then(function (mergedModelTree) {
                var resultVersions = [];
                _.forOwn(mergedModelTree, function (node) {
                    _.forOwn(node.version, function (version) {
                        resultVersions.push(version);
                    });
                });
                return resultVersions;
            });
    }
}).call(this);
