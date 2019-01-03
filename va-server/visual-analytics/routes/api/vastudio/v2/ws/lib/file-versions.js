var projectPermission = require('./common').ProjectPermission;
var PERMISSION = require('./common').PERMISSION;

const parseContents = (results) => {
    return results.map((result) => {
        return Object.assign({}, result, {
            contents: JSON.parse(result.contents)
        });
    });
};

// SELECT
exports.listVersions = function (req, res) {
    var task = (permission) => {
        var opt = {
            fileId: req.params.mid
        };
        __BRTC_DAO.file.version.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (rows) {
            res.json(parseContents(rows));
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.FILE.READ, res, task);
};

// SELECT
exports.listDetailVersions = function (req, res) {
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
            res.json(null);
        }
    });
};

// INSERT
exports.createVersion = function (req, res) {
    if (!req.body.isManual) {
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
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (rowCount, result) {
                if (rowCount === 0) {
                    return res.json(null);
                }
                var rows = parseContents(result.rows);
                return res.json(rows[0]);
            });
        };
        return projectPermission.execute(req.params.project, req.apiUserId,
            PERMISSION.FILE.UPDATE, res, task);
    }
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
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (rowCount, result) {
            if (rowCount === 0) return res.json(null);
            var rows = parseContents(result.rows);
            return res.json(rows[0]);
        });
    };
    return projectPermission.execute(req.params.project, req.apiUserId,
        PERMISSION.FILE.UPDATE, res, task);
};

// UPDATE
exports.updateVersion = function (req, res) {
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
            return res.json(result.rows);
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.UPDATE, res, task);
};

// UPDATE
exports.loadVersion = function (req, res) {
    const task = (permission) => {
        var opt = {
            updater: req.apiUserId,
            fileId: req.params.mid,
            versionId: req.params.versionId
        };
        __BRTC_DAO.file.version.load(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (rowCount, result) {
            var rows = parseContents(result.rows);
            res.json(rows);
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.FILE.UPDATE, res, task);
};

// Sample Parameter는
// /test/api/va/v2/file-version.js 에서 확인 가능
