var router = __REQ_express.Router();

var deploy = require('./lib/deploy');
var fileVersions = require('./lib/file-versions');
var libraries = require('./lib/libraries');
var templates = require('./lib/library-templates');
var files = require('./lib/project-files');
var members = require('./lib/project-members');
var projects = require('./lib/projects');

router.get('/deploy/target', deploy.listDeployTarget);
router.post('/deploy', deploy.createDeploy);
router.post('/deploy/:target', deploy.updateDeploy);

router.get('/projects/:project/files/:mid/versions', fileVersions.listVersions);
router.get('/projects/:project/files/:mid/versions/:versionId', fileVersions.listDetailVersions);
router.post('/projects/:project/files/:mid/versions', fileVersions.createVersion);
router.post('/projects/:project/files/:mid/versions/:versionId/update', fileVersions.updateVersion);
router.post('/projects/:project/files/:mid/versions/:versionId/load', fileVersions.loadVersion);

router.get('/libraries', libraries.listLibraries);

router.get('/libraries/:libraryId/templates', templates.listTemplates);
router.post('/libraries/:libraryId/templates', templates.createTemplate);
router.get('/libraries/:libraryId/templates/:templateId', templates.getTemplate);
router.post('/libraries/:libraryId/templates/:templateId/update', templates.updateTemplate);
router.post('/libraries/:libraryId/templates/:templateId/delete', templates.deleteTemplate);

router.get('/projects/:project/files', files.listFiles);
router.post('/projects/:project/files', files.createFile);
router.get('/projects/:project/files/:file', files.getFile);
router.post('/projects/:project/files/:file/update', files.updateFile);
router.post('/projects/:project/files/:file/delete', files.deleteFile);
router.post('/projects/:project/files/:file/save', files.saveFile);

router.get('/projects/:project/members', members.listMembers);
router.post('/projects/:project/members/invite', members.inviteMember);
router.post('/projects/:project/members/withdraw', members.withdrawMember);
router.post('/projects/:project/members/authority', members.changeAuthority);

router.get('/projects', projects.listProjects);
router.post('/projects', projects.createProject);
router.get('/projects/:project', projects.getProject);
router.post('/projects/:project/update', projects.updateProject);
router.post('/projects/:project/delete', projects.deleteProject);

// router.get('/udfs/:udfId/udfparams', udfparams.listUdfParams);
// router.get('/udfs/:udfId/udfparams/:param', udfparams.getUdfParam);
// router.post('/udfs/:udfId/udfparams/:param', udfparams.createUdfParam);
// router.post('/udfs/:udfId/udfparams/:param/update', udfparams.updateUdfParam);
// router.post('/udfs/:udfId/udfparams/:param/delete', udfparams.deleteUdfParam);

// router.get('/udfs', udfs.listUdfs);
// router.get('/udfs/:udfId', udfs.getUdfById);
// router.post('/udfs/:udfId', udfs.createUdf);
// router.post('/udfs/:udfId/update', udfs.updateUdf);
// router.post('/udfs/:udfId/delete', udfs.deleteUdf);
// router.get('/udfs/:udfId/doc', udfs.renderUdfDoc);

module.exports = router;