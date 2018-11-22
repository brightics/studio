var PERMISSION = require('./common').PERMISSION;
var projectPermission = require('./common').ProjectPermission;

exports.listProjects = function (req, res) {
    var opt = {
        user_id: req.apiUserId
    };
    __BRTC_DAO.project.selectByMember(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        res.json(result);
    });
};

exports.createProject = function (req, res) {
    var opt = {
        id: req.body.id,
        label: req.body.label,
        description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
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
                if (err.error.indexOf('duplicate key ') == 0) {
                    __BRTC_ERROR_HANDLER.sendError(res, 34011);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            }, function (result) {
                res.sendStatus(200);
            });
        }
        else {
            __BRTC_ERROR_HANDLER.sendError(res, 31011);
        }
    });
};

exports.getProject = function (req, res) {

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
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.PROJECT.READ, res, task);
};

exports.updateProject = function (req, res) {

    var task = function (permissions) {
        var opt = {
            id: req.params.project,
            label: req.body.label,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            updater: req.apiUserId,
            type: req.body.type,
            tag: req.body.tag
        };
        __BRTC_DAO.project.update(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.PROJECT.UPDATE, res, task);
};

exports.deleteProject = function (req, res) {

    var task = function (permissions) {
        var opt = {
            id: req.params.project
        };
        __BRTC_DAO.project.delete(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.PROJECT.DELETE, res, task);
};