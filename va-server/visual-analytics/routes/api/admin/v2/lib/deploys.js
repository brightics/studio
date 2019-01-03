var router = __REQ_express.Router();
var request = __REQ_request;


const coreResponseHandler = (req, res) => {
    return function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    res.json(JSON.parse(body).result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    };
};

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req,
        [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DEPLOY], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var deleteDeploy = function (req, res) {
    var task = function (permissions) {
        var target = {
            registerUserId: req.body.registerUserId,
            version: req.body.version,
        };
        var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/deploy/' + req.params.target + '/' + req.params.deployId);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(target);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode === 200) {
                    res.json({ success: true });
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DEPLOY_DELETE, task);
};

var getAllDeploy = function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/deploys/all');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, coreResponseHandler(req, res));
};

var getDownloadDeploy = function (req, res) {
    var task = function (permissions) {
        var target = req.params.target;
        var deployId = req.params.deployId;
        var registerUserId = req.params.registerUserId;
        var version = req.params.version;

        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/deploy/' + target + '/' + deployId + '/' + registerUserId + '/' + version);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, coreResponseHandler(req, res));
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DEPLOY_UPDATE, task);
};

router.get('/deploys/auth', __BRTC_API_SERVER.proxy);
router.get('/deploys', getAllDeploy);
router.get('/deploys/:target/:deployId/:registerUserId/:version', getDownloadDeploy);
router.post('/deploys/:target');
router.post('/deploys/:target/:deployId', deleteDeploy);
module.exports = router;
