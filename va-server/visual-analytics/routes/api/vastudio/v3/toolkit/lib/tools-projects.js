var router = __REQ_express.Router();

var listToolsProjects = function (req, res) {
    var opt = {
        creator: req.apiUserId || 'brightics@samsung.com'
    };
    __BRTC_DAO.tools_project.selectByCreator(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err)
    }, function (result) {
        res.json(result)
    })
};

var createToolsProject = function (req, res) {
    var opt = {
        label: req.body.label,
        description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
        creator: req.apiUserId || 'brightics@samsung.com'
    };

    __BRTC_DAO.tools_project.selectByCreator(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err)
    }, function (result) {
        if (result.length < 100) {
            __BRTC_DAO.tools_project.create(opt, function (err) {
                if (err.error.indexOf('duplicate key ') === 0) {
                    __BRTC_ERROR_HANDLER.sendError(res, 34011)
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err)
                }
            }, function (result) {
                res.sendStatus(200)
            })
        } else {
            __BRTC_ERROR_HANDLER.sendError(res, 31011)
        }
    })
};

var getToolsProject = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.tpid
        };
        __BRTC_DAO.tools_project.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err)
        }, function (result) {
            res.json(result)
        })
    };
    task();
};

var updateToolsProject = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.tpid,
            label: req.body.label,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            updater: req.apiUserId || 'brightics@samsung.com'
        };
        __BRTC_DAO.tools_project.update(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err)
        }, function (result) {
            res.json(result)
        })
    };
    task();
};

var deleteToolsProject = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.tpid
        };
        __BRTC_DAO.tools_project.delete(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err)
        }, function (result) {
            res.json(result)
        })
    };
    task();
};

router.get('/tps', listToolsProjects);
router.post('/tps', createToolsProject);
router.get('/tps/:tpid', getToolsProject);
router.put('/tps/:tpid', updateToolsProject);
router.delete('/tps/:tpid', deleteToolsProject);

module.exports = router;
