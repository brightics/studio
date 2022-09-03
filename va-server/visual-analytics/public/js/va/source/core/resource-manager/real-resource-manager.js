import { ResourceManager } from './resource-manager';


function fetchFile(projectId, fileId) {
    const file = ResourceManager.getFile(projectId, fileId);
    if (file) return Promise.resolve(file);
    return ResourceManager.fetchFile(projectId, fileId);
}

export { fetchFile };
