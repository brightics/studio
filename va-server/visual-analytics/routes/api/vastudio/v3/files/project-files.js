var router = __REQ_express.Router();

var PERMISSION = require('../permissions/project-permission').PERMISSION;
var projectPermission = require('../permissions/project-permission').ProjectPermission;

const parseContents = (res) => {
    return function (result) {
        for (var i in result) {
            result[i].contents = JSON.parse(result[i].contents);
        }
        res.json(result);
    };
};

var listFiles = function (req, res) {
    var task = function (permissions) {
        var opt = {
            project_id: req.params.project
        };
        __BRTC_DAO.file.selectByProject(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, parseContents(res));
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.PROJECT.READ, res, task);
};

var createFile = function (req, res) {
    var task = function (permissions) {
        if (!req.body.id || !req.body.label || !req.body.contents) {
            return __BRTC_ERROR_HANDLER.sendError(res, '10103');
        }

        __BRTC_DAO.file.selectByProject({
            project_id: req.params.project
        }, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            if (result.length < 100) {
                var opt = {
                    project_id: req.params.project,
                    id: req.body.id,
                    label: req.body.label,
                    contents: req.body.contents,
                    description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description || ''),
                    creator: req.apiUserId,
                    type: req.body.contents.type || 'data', // req.body.type,
                    tag: req.body.tag
                };

                __BRTC_DAO.project.updateTime({ id: req.params.project }, function (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }, function (result) {
                    __BRTC_DAO.file.create(opt, function (err) {
                        if (err.error.indexOf('duplicate key ') === 0) {
                            __BRTC_ERROR_HANDLER.sendError(res, 10101);
                        } else {
                            __BRTC_ERROR_HANDLER.sendServerError(res, err);
                        }
                    }, function (result) {
                        res.sendStatus(200);
                    });
                });
            } else {
                __BRTC_ERROR_HANDLER.sendError(res, 10401);
            }
        });
        return undefined;
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.CREATE, res, task);
    return undefined;
};

var getFile = function (req, res) {
    var task = function (permissions) {
        var opt = {
            project_id: req.params.project,
            id: req.params.file
        };

        __BRTC_DAO.file.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, parseContents(res));
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.READ, res, task);
};

var updateFile = function (req, res) {
    var task = function (permissions) {
        if (!req.body.label || !req.body.contents || !req.body.event_key) {
            return __BRTC_ERROR_HANDLER.sendError(res, '10103');
        }

        var opt = {
            id: req.params.file,
            project_id: req.params.project,
            event_key: req.body.event_key,
            label: req.body.label,
            contents: req.body.contents,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description || ''),
            updater: req.apiUserId,
            type: req.body.type,
            tag: req.body.tag
        };

        __BRTC_DAO.project.updateTime({ id: req.params.project }, function (err) {
            __BRTC_ERROR_HANDLER.sendError(res, 32032);
        }, function (result) {
            __BRTC_DAO.file.update(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (rowCount) {
                if (rowCount === 0) {
                    __BRTC_ERROR_HANDLER.sendError(res, 32031);
                } else {
                    __BRTC_DAO.file.selectById(opt, function (err) {
                        __BRTC_ERROR_HANDLER.sendServerError(res, err);
                    }, parseContents(res));
                }
            });
        });
        return undefined;
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.FILE.UPDATE, res, task, true);
    return undefined;
};

var deleteFile = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.file,
            project_id: req.params.project
        };

        __BRTC_DAO.project.updateTime({ id: req.params.project }, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            __BRTC_DAO.file.delete(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                if (!result) {
                    __BRTC_ERROR_HANDLER.sendError(res, 10102);
                } else {
                    res.sendStatus(200);
                }
            });
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.DELETE, res, task);
};

router.get('/projects/:project/files', listFiles);
router.post('/projects/:project/files', createFile);
router.get('/projects/:project/files/:file', getFile);
router.put('/projects/:project/files/:file', updateFile);
router.delete('/projects/:project/files/:file', deleteFile);

module.exports = router;
