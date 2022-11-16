import { TreeNode } from '../tree/tree-node';
import { EventEmitter } from '../../event-emitter/event-emitter';
import { inherits } from '../../utils/inherits';

function ProjectTree() {
    this.__root = new TreeNode();
}

inherits(ProjectTree, EventEmitter);

ProjectTree.prototype.getRootNode = function () {
    return this.__root;
};

ProjectTree.prototype.getProjectNode = function (projectId) {
    return this.__root.go(projectId);
};

ProjectTree.prototype.getProjectNodeBruteForce = function (fn) {
    return this.getRootNode().findChildNodeBruteForce(fn);
};

ProjectTree.prototype.getProjectNodeByFileId = function (fileId) {
    var projectNode = this.getProjectNodeBruteForce(function (node) {
        return node.hasChild(fileId);
    });
    return projectNode;
};

ProjectTree.prototype.getFileNode = function (projectId, fileId) {
    if (projectId) {
        return this.getProjectNode(projectId).go(fileId);
    }
    console.warn('NO PROJECT ID');
    var projectNode = this.getProjectNodeByFileId(fileId);
    return projectNode.go(fileId);
};

ProjectTree.prototype.getVersionNode = function (projectId, fileId, versionId) {
    return this.getFileNode(projectId, fileId).go(versionId);
};

ProjectTree.prototype.getProjectMap = function () {
    return this.getRootNode().getChildrenMap();
};

ProjectTree.prototype.getProjectArray = function () {
    return this.getRootNode().getChildren();
};

ProjectTree.prototype.getFileMap = function (projectId) {
    return this.getProjectNode(projectId).getChildrenMap();
};

ProjectTree.prototype.getFileArray = function (projectId) {
    return this.getProjectNode(projectId).getChildren();
};

ProjectTree.prototype.getVersionMap = function (projectId, fileId) {
    return this.getFileNode(projectId, fileId).getChildrenMap();
};

ProjectTree.prototype.getVersionArray = function (projectId, fileId) {
    return this.getFileNode(projectId, fileId).getChildren();
};

ProjectTree.prototype.getProjects = function () {
    try {
        return this.getRootNode().getChildren();
    } catch (e) {
        return undefined;
    }
};

ProjectTree.prototype.getProject = function (projectId) {
    var projectNode = this.getProjectNode(projectId);
    if (projectNode) {
        return projectNode.getData();
    }
    return undefined;
};

ProjectTree.prototype.getFiles = function (projectId) {
    try {
        return this.getProjectNode(projectId).getChildren();
    } catch (e) {
        return undefined;
    }
};

ProjectTree.prototype.getFile = function (projectId, fileId) {
    try {
        return this.getFileNode(projectId, fileId).getData();
    } catch (e) {
        return undefined;
    }
};

ProjectTree.prototype.getVersions = function (projectId, fileId) {
    try {
        return this.getFileNode(projectId, fileId).getChildren();
    } catch (e) {
        return undefined;
    }
};

ProjectTree.prototype.getVersion = function (projectId, fileId, versionId) {
    try {
        return this.getVersionNode(projectId, fileId, versionId).getData();
    } catch (e) {
        return undefined;
    }
};

ProjectTree.prototype.updateProject = function (project) {
    return this.getProjectNode(project.getProjectId()).setData(project);
};

ProjectTree.prototype.updateFile = function (projectId, file) {
    return this.getFileNode(projectId, file.getFileId()).setData(file);
};

ProjectTree.prototype.updateVersion = function (projectId, fileId, version) {
    return this.getVersionNode(projectId, fileId, version.getVersionId()).setData(version);
};

ProjectTree.prototype.addProject = function (project) {
    return this.getRootNode().addChild(project.getProjectId(), project);
};

ProjectTree.prototype.addFile = function (projectId, file) {
    return this.getProjectNode(projectId).addChild(file.getFileId(), file);
};

ProjectTree.prototype.addVersion = function (projectId, fileId, version) {
    return this.getFileNode(projectId, fileId).addChild(version.getVersionId(), version);
};

ProjectTree.prototype.deleteProject = function (projectId) {
    var node = this.getRootNode();
    return node.deleteChild(projectId).getData();
};

ProjectTree.prototype.deleteFile = function (projectId, fileId) {
    var node = this.getProjectNode(projectId);
    return node.deleteChild(fileId).getData();
};

ProjectTree.prototype.deleteVersion = function (projectId, fileId, versionId) {
    var node = this.getFileNode(projectId, fileId);
    return node.deleteChild(versionId).getData();
};

export { ProjectTree };
