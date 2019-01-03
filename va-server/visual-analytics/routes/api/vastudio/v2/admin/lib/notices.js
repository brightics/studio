var router = __REQ_express.Router();

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.NOTICE], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

/**공지사항 목록**/
var listNotices = function (req, res) {
    __BRTC_DAO.notice.selectAll({}, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        res.json(result);
    });
};

/**공지사항 추가**/
var createNotice = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.noticeId,
            title: req.body.title,
            content: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.content),
            creator: req.body.creator,
            hits: 0
        };
        __BRTC_DAO.notice.create(opt, function (err) {
            if (err.error.indexOf('duplicate key ') === 0) {
                __BRTC_ERROR_HANDLER.sendError(res, 22012);
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }
        }, function (result) {
            res.sendStatus(200);
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_NOTICE_CREATE, task);
};

/**공지사항 수정**/
var updateNotice = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.noticeId,
            title: req.body.title,
            content: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.content),
            updater: req.body.updater
        };

        __BRTC_DAO.notice.update(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json({success: true});
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_NOTICE_UPDATE, task);
};


/**공지사항 삭제**/
var deleteNotice = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.noticeId
        };

        __BRTC_DAO.notice.delete(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json({success: true});
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_NOTICE_DELETE, task);
};

/**공지사항 삭제(Multi)**/
var deleteNotices = function (req, res) {
    var task = function (permissions) {
        var opt = {
            // id: req.params.noticeId,
            noticeList: req.body.noticeList
        };

        __BRTC_DAO.notice.deleteByNoticeList(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json({success: true});
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_NOTICE_DELETE, task);
};

router.get('/notices', listNotices);
router.post('/notices/delete', deleteNotices);
router.post('/notices/:noticeId', createNotice);
router.post('/notices/:noticeId/update', updateNotice);
router.post('/notices/:noticeId/delete', deleteNotice);

module.exports = router;
