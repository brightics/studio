var router = __REQ_express.Router();

var projectPermission = require('../permissions/project-permission').ProjectPermission;
var PERMISSION = require('../permissions/project-permission').PERMISSION;

// SELECT
var listVersions = function (req, res) {
    var task = (permission) => {
        var opt = {
            fileId: req.params.mid
        };
        __BRTC_DAO.file.version.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (rows) {
            if (rows.length === 0) {
                __BRTC_ERROR_HANDLER.sendError(res, 10102);
            } else {
                var len = rows.length;
                for (var i = 0; i < len; i++) {
                    rows[i].contents = JSON.parse(rows[i].contents);
                }
                res.json(rows);
            }
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.FILE.READ, res, task);
};

// SELECT
var listDetailVersions = function (req, res) {
    const task = (permission) => {
        var opt = {
            fileId: req.params.mid,
            versionId: req.params.versionId
        };
        __BRTC_DAO.file.version.selectByIdAndVersion(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (rows) {
            var len = rows.length;
            if (len) {
                rows[0].contents = JSON.parse(rows[0].contents);
                res.json(rows[0]);
            } else {
                __BRTC_ERROR_HANDLER.sendError(res, 10102);
            }
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.FILE.READ, res, task);
};

// INSERT
var createVersion = function (req, res) {
    if (!req.body.isManual) {
        if (!req.body.version_id || !req.body.isMajor || !req.body.label) return __BRTC_ERROR_HANDLER.sendError(res, '10103');

        let opt = {
            fileId: req.params.mid,
            user: req.apiUserId,
            tags: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.tags),
            label: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.label),
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            isMajor: req.body.isMajor,
            versionId: req.body.version_id
        };
        const task = (permission) => {
            __BRTC_DAO.file.version.create(opt, function (err) {
                if (err.error.indexOf('duplicate key ') == 0) {
                    __BRTC_ERROR_HANDLER.sendError(res, 10101);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            }, function (rowCount, result) {
                if (rowCount) {
                    var rows = result.rows;
                    var len = rows.length;
                    for (var i = 0; i < len; i++) {
                        rows[i].contents = JSON.parse(rows[i].contents);
                    }
                    res.json(rows[0]);
                } else {
                    __BRTC_ERROR_HANDLER.sendError(res, 10102);
                }
            });
        };
        projectPermission.execute(req.params.project, req.apiUserId,
            PERMISSION.FILE.UPDATE, res, task);
    } else {
        let opt = {
            fileId: req.params.mid,
            user: req.apiUserId,
            versionId: req.body.version_id,
            tags: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.tags),
            label: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.label),
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            contents: req.body.contents,
            type: req.body.type,
            majorVersion: typeof req.body.majorVersion === 'undefined' ? req.body.major_version :
                req.body.majorVersion,
            minorVersion: typeof req.body.minorVersion === 'undefined' ? req.body.minor_version :
                req.body.minorVersion
        };
        const task = (permission) => {
            __BRTC_DAO.file.version.createManually(opt, function (err) {
                if (err.error.indexOf('duplicate key ') == 0) {
                    __BRTC_ERROR_HANDLER.sendError(res, 10101);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            }, function (rowCount, result) {
                if (rowCount) {
                    var rows = result.rows;
                    var len = rows.length;
                    for (var i = 0; i < len; i++) {
                        rows[i].contents = JSON.parse(rows[i].contents);
                    }
                    res.json(rows[0]);
                } else {
                    __BRTC_ERROR_HANDLER.sendError(res, 10102);
                }
            });
        };
        projectPermission.execute(req.params.project, req.apiUserId,
            PERMISSION.FILE.UPDATE, res, task);
    }
};

// UPDATE
var updateVersion = function (req, res) {
    const task = (permission) => {
        var opt = {
            fileId: req.params.mid,
            versionId: req.params.versionId,
            tags: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.tags),
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            updater: req.apiUserId
        };
        __BRTC_DAO.file.version.update(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (rowCount, result) {
            if (rowCount === 0) {
                __BRTC_ERROR_HANDLER.sendError(res, 10102);
            } else {
                return res.json(200);
            }
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.UPDATE, res, task);
};

// LOAD
var loadVersion = function (req, res) {
    const task = (permission) => {
        var opt = {
            updater: req.apiUserId,
            fileId: req.params.mid,
            versionId: req.params.versionId
        };
        __BRTC_DAO.file.version.load(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (rowCount, result) {
            if (rowCount === 0) {
                __BRTC_ERROR_HANDLER.sendError(res, 10102);
            } else {
                var rows = result.rows;
                var len = rows.length;
                for (var i = 0; i < len; i++) {
                    rows[i].contents = JSON.parse(rows[i].contents);
                }
                res.json(rows);
            }
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.UPDATE, res, task);
};

router.get('/projects/:project/files/:mid/versions', listVersions);
router.get('/projects/:project/files/:mid/versions/:versionId', listDetailVersions);
router.post('/projects/:project/files/:mid/versions', createVersion);
router.put('/projects/:project/files/:mid/versions/:versionId', updateVersion);
router.post('/projects/:project/files/:mid/versions/:versionId/load', loadVersion);

module.exports = router;