var request = __REQ_request;
var router = __REQ_express.Router();

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

router.get('/', function (req, res) {
    if (req.query.publishingTitle) {
        __BRTC_DAO.publishreport.select({publishing_title: req.query.publishingTitle}, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    } else {
        __BRTC_DAO.publishreport.selectAll({}, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    }
});

const attachAgentAsMapping = (userId) => {
    const url = `/api/core/v2/agentUser`;
    const options = __BRTC_CORE_SERVER.createRequestOptions('PUT', url);
    options.body = JSON.stringify({
        userId,
        agentId: 'BRIGHTICS'
    });
    return new Promise((resolve, reject) => {
        try {
            return request(options, (...args) => resolve(args));
        } catch (e) {
            return reject(e);
        }
    });
};

const deleteAgentAsMapping = (userId) => {
    const url = `/api/core/v2/agentUser/${userId}`;
    const options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', url);
    return new Promise((resolve, reject) => {
        try {
            return request(options, (...args) => resolve(args));
        } catch (e) {
            return reject(e);
        }
    });
};

var createPublishReport = function (req, res) {
    var task = function (permissions) {
        var opt = {
            publish_id: req.body.publishId,
            publishing_title: req.body.publishingTitle,
            publisher: req.body.publisher,
            project_id: req.body.projectId,
            model_id: req.body.modelId,
            publish_contents: req.body.publishContents,
            url: req.body.url
        };
        __BRTC_DAO.publishreport.create(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            attachAgentAsMapping(req.body.publishId)
                .then(([error, response, body]) => {
                    if (error) {
                        __BRTC_ERROR_HANDLER.sendServerError(res, error);
                    } else {
                        res.sendStatus(200);
                    }
                });
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_CREATE, task);
};

var deletePublishReport = function (req, res) {
    var task = function (permissions) {
        var opt = {
            publish_id: req.params.publishId
        };
        __BRTC_DAO.publishreport.delete(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            // deleteAgentAsMapping
            deleteAgentAsMapping(req.params.publishId)
                .then(([error, response, body]) => {
                    if (error) {
                        __BRTC_ERROR_HANDLER.sendServerError(res, error);
                    } else {
                        res.sendStatus(200);
                    }
                });
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_DELETE, task);
};

var updatePublishReport = function (req, res) {
    var task = function (permissions) {
        var opt = {
            publish_id: req.body.publishId,
            publish_contents: req.body.publishContents
        };
        __BRTC_DAO.publishreport.update(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.sendStatus(200);
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_CREATE, task);
};

var deletePublishReports = function (req, res) {
    var task = function (permissions) {
        var opt = {
            publishReportList: req.body.publishReportList
        };
        __BRTC_DAO.publishreport.deleteByPublishIdList(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            req.body.publishReportList.map((pubId) => deleteAgentAsMapping(pubId))
                .all(() => {
                    res.sendStatus(200);
                });
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_DELETE, task);
};

var checkPublishReports = function (req, res) {
    var opt = {
        url: req.params.url
    };

    __BRTC_DAO.publishreport.checkDuplicate(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        var rt = {
            isDuplicate: true
        };

        if (result.length === 0) {
            rt.isDuplicate = false;
        }
        res.json(rt);
    });
};

router.post('/', createPublishReport);
router.post('/delete', deletePublishReports);
router.get('/check/:url', checkPublishReports);
router.post('/:publishId/delete', deletePublishReport);
router.post('/:publishId/update', updatePublishReport);

module.exports = router;