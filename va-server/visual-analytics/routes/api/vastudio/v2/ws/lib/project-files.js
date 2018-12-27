var PERMISSION = require('./common').PERMISSION;
var projectPermission = require('./common').ProjectPermission;


const parseContents = (res) => {
    return function (result) {
        for (var i in result) {
            result[i].contents = JSON.parse(result[i].contents);
        }
        res.json(result);
    };
};

exports.listFiles = function (req, res) {
    var task = function (permissions) {
        var opt = {
            project_id: req.params.project
        };
        __BRTC_DAO.file.selectByProject(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, parseContents(res));
    };
    projectPermission.execute(req.params.project,
        req.apiUserId, PERMISSION.PROJECT.READ, res, task);
};

exports.createFile = function (req, res) {
    var task = function (permissions) {
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
                    description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
                    creator: req.apiUserId,
                    type: req.body.contents.type || 'data', // req.body.type,
                    tag: req.body.tag
                };

                __BRTC_DAO.project.updateTime({ id: req.params.project }, function (err) {
                    __BRTC_ERROR_HANDLER.sendError(res, 34012);
                }, function (result) {
                    __BRTC_DAO.file.create(opt, function (err) {
                        if (err.error.indexOf('duplicate key ') === 0) {
                            __BRTC_ERROR_HANDLER.sendError(res, 34011);
                        } else {
                            __BRTC_ERROR_HANDLER.sendServerError(res, err);
                        }
                    }, function (result) {
                        res.sendStatus(200);
                    });
                });
            } else {
                __BRTC_ERROR_HANDLER.sendError(res, 32011);
            }
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.CREATE, res, task);
};

exports.getFile = function (req, res) {
    var task = function (permissions) {
        var opt = {
            project_id: req.params.project,
            id: req.params.file
        };

        __BRTC_DAO.file.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, parseContents(res));
        // function (result) {
        //     for (var i in result) {
        //         result[i].contents = JSON.parse(result[i].contents);
        //     }
        //     res.json(result);
        // });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.READ, res, task);
};

exports.updateFile = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.file,
            project_id: req.params.project,
            event_key: req.body.event_key,
            label: req.body.label,
            contents: req.body.contents,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            updater: req.body.updater,
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
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.FILE.UPDATE, res, task, true);
};

exports.deleteFile = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.file,
            project_id: req.params.project
        };

        __BRTC_DAO.project.updateTime({ id: req.params.project }, function (err) {
            __BRTC_ERROR_HANDLER.sendError(res, 36041);
        }, function (result) {
            __BRTC_DAO.file.delete(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                res.json(result);
            });
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.DELETE, res, task);
};
