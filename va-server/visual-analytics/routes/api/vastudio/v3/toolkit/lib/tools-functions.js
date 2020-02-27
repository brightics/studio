var router = __REQ_express.Router();
var IDGenerator = require('../../../../../../lib/tools/idgenerator');

var listToolsFunctions = function (req, res) {
    var task = function (permissions) {
        var opt = {
            tools_project_id: req.params.tpid,
            creator: req.apiUserId || 'brightics@samsung.com'
        };
        __BRTC_DAO.tools_function.selectByCreator(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err)
        }, function (result) {
            res.json(result)
        })
    };
    task();
};

var createToolsFunction = function (req, res) {
    var task = function (permissions) {
        __BRTC_DAO.tools_function.selectByProject({
            tools_project_id: req.params.tpid
        }, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err)
        }, function (result) {
            if (result.length < 100) {
                console.log(IDGenerator.func.id())
                var opt = {
                    tools_project_id: req.params.tpid,
                    id: IDGenerator.func.id(),
                    label: req.body.label,
                    contents: req.body.contents,
                    description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
                    creator: req.apiUserId || 'brightics@samsung.com',
                    type: req.body.category || 'udf'
                };

                __BRTC_DAO.tools_project.updateTime({id: req.params.tpid}, function () {
                    __BRTC_ERROR_HANDLER.sendError(res, 34012)
                }, function (result) {
                    __BRTC_DAO.tools_function.create(opt, function (err) {
                        if (err.error.indexOf('duplicate key ') === 0) {
                            __BRTC_ERROR_HANDLER.sendError(res, 34011)
                        } else {
                            __BRTC_ERROR_HANDLER.sendServerError(res, err)
                        }
                    }, function (result) {
                        res.status(200).json(opt.id)
                    })
                })
            } else {
                __BRTC_ERROR_HANDLER.sendError(res, 32011)
            }
        })
    };
    task();
};

var getToolsFunction = function (req, res) {
    var task = function (permissions) {
        var opt = {
            tools_project_id: req.params.tpid,
            id: req.params.tfid
        };

        __BRTC_DAO.tools_function.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err)
        }, function (result) {
            res.json(result)
        })
    };
    task();
};

var updateToolsFunction = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.tfid,
            tools_project_id: req.params.tpid,
            event_key: req.body.event_key,
            label: req.body.label,
            contents: req.body.contents,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            updater: req.apiUserId || 'brightics@samsung.com',
            type: req.body.type
        };

        __BRTC_DAO.tools_project.updateTime({id: req.params.tpid}, function () {
            __BRTC_ERROR_HANDLER.sendError(res, 32032)
        }, function (result) {
            __BRTC_DAO.tools_function.update(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err)
            }, function (rowCount) {
                if (rowCount === 0) {
                    __BRTC_ERROR_HANDLER.sendError(res, 32031)
                } else {
                    __BRTC_DAO.tools_function.selectById(opt, function (err) {
                        __BRTC_ERROR_HANDLER.sendServerError(res, err)
                    }, function (result) {
                        res.json(result)
                    })
                }
            })
        })
    };
    task();
};

var deleteToolsFunction = function (req, res) {
    var task = function (permissions) {
        var opt = {
            id: req.params.tfid,
            tools_project_id: req.params.tpid
        };

        __BRTC_DAO.tools_project.updateTime({id: req.params.tpid}, function () {
            __BRTC_ERROR_HANDLER.sendError(res, 36041)
        }, function (result) {
            __BRTC_DAO.tools_function.delete(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err)
            }, function (result) {
                res.json(result)
            })
        })
    };
    task();
};

var deleteToolsFunctions = function (req, res) {
    var task = function (permissions) {
        var opt = {
            tools_project_id: req.params.tpid
        };

        __BRTC_DAO.tools_project.updateTime({id: req.params.tpid}, function () {
            __BRTC_ERROR_HANDLER.sendError(res, 36041)
        }, function (result) {
            __BRTC_DAO.tools_function.deleteByProjectID(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err)
            }, function (result) {
                res.json(result)
            })
        })
    };
    task();
};

router.get('/tps/:tpid/tfs', listToolsFunctions);
router.post('/tps/:tpid/tfs', createToolsFunction);
router.get('/tps/:tpid/tfs/:tfid', getToolsFunction);
router.put('/tps/:tpid/tfs/:tfid', updateToolsFunction);
router.delete('/tps/:tpid/tfs/:tfid', deleteToolsFunction);
router.delete('/tps/:tpid/tfs', deleteToolsFunctions);

module.exports = router;
