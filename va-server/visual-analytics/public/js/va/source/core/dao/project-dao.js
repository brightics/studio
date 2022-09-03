import { ajaxGet, ajaxPost } from '../../../../../../src/utils/ajax2promise';
import { Project } from '../vomodels/project';

/* global _ */

var transform = function (json) {
    return new Project(json);
};

var transformEach = function (jsonArray) {
    return _.map(jsonArray, transform);
};

/**
 * 프로젝트 리스트 가져옴
 * @return {Promise<Array<Project>>}
 */
var getProjects = function () {
    var url = 'api/va/v2/ws/projects';
    return ajaxGet(url).then(transformEach);
};

var getProject = function (projectId) {
    var url = 'api/va/v2/ws/projects/' + projectId;
    return ajaxGet(url).then(function (projects) {
        return transform(projects[0]);
    });
};

var addProject = function (project) {
    var url = 'api/va/v2/ws/projects';
    return ajaxPost(url, project.toJSON()).then(transform);
};

var updateProject = function (project) {
    // var url = 'api/va/v2/ws/projects/' + project.getProjectId() + '/update';
    var url = 'api/va/v2/ws/projects/' + project.getProjectId() + '/update';
    return ajaxPost(url, project.toJSON()).then(transform);
};

var deleteProject = function (projectId) {
    var url = 'api/va/v2/ws/projects/' + projectId + '/delete';
    return ajaxPost(url);
};

var ProjectDao = {
    getProjects: getProjects,
    getProject: getProject,
    addProject: addProject,
    updateProject: updateProject,
    deleteProject: deleteProject
};

export { ProjectDao };
