var router = __REQ_express.Router();

var PERMISSION = require('../permissions/project-permission').PERMISSION;
var projectPermission = require('../permissions/project-permission').ProjectPermission;

const cb = (res) => {
    return function (result) {
        if (!result) {
            __BRTC_ERROR_HANDLER.sendError(res, 10102);
        } else {
            res.sendStatus(200);
        }
    };
};

var listProjects = function (req, res) {
    var opt = {
        user_id: req.apiUserId
    };
    __BRTC_DAO.project.selectByMember(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        res.json(result);
    });
};

var createProject = function (req, res) {
    if (!req.body.id || !req.body.label) return __BRTC_ERROR_HANDLER.sendError(res, '10103');

    var opt = {
        id: req.body.id,
        label: req.body.label,
        description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description || ''),
        creator: req.apiUserId,
        type: req.body.type,
        tag: req.body.tag
    };

    __BRTC_DAO.project.selectByCreator({
        creator: req.apiUserId
    }, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        if (result.length < 100) {
            __BRTC_DAO.project.create(opt, function (err) {
                if (err.error.indexOf('duplicate key ') === 0) {
                    __BRTC_ERROR_HANDLER.sendError(res, 10101);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            }, function (result) {
                res.sendStatus(200);
            });
        } else {
            __BRTC_ERROR_HANDLER.sendError(res, 10201);
        }
    });
    return undefined;
};

var getProject = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.project
        };
        __BRTC_DAO.project.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.PROJECT.READ, res, task);
};

var updateProject = function (req, res) {
    var task = function (permissions) {
        if (!req.body.label) return __BRTC_ERROR_HANDLER.sendError(res, '10103');

        var opt = {
            id: req.params.project,
            label: req.body.label,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description || ''),
            updater: req.apiUserId,
            type: req.body.type,
            tag: req.body.tag
        };
        __BRTC_DAO.project.update(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, cb(res));
        return undefined;
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.PROJECT.UPDATE, res, task);
};

var deleteProject = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.project
        };
        __BRTC_DAO.project.delete(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, cb(res));
    };

    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.PROJECT.DELETE, res, task);
};

router.get('/projects', listProjects);
router.post('/projects', createProject);
router.get('/projects/:project', getProject);
router.put('/projects/:project', updateProject);
router.delete('/projects/:project', deleteProject);

module.exports = router;
