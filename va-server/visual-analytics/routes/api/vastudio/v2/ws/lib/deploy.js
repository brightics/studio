var request = __REQ_request;
var router = __REQ_express.Router();

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DEPLOY], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

exports.listDeployTarget = function (req, res) {
    //console.log(req);
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/deploy/target');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                res.send(body);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
            }
        }
    });
};

exports.createDeploy = function (req, res) {
    var task = function (permissions) {
        console.log(req);
        var targetServer = req.body.server;

        var target = {
            projectId: req.body.projectId,
            modelId: req.body.modelId,
            registerUserId: req.body.registerUserId,
            projectName: req.body.projectName,
            modelName: req.body.modelName,
            title: req.body.title,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            contents: req.body.contents,
            runnableContents: req.body.runnableContents,
            gvYn: req.body.gvFlag
        };

        var options = __BRTC_CORE_SERVER.createRequestOptions('PUT', '/api/core/v2/deploy/' + targetServer);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(target);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                var resultData = JSON.parse(body);
                if (response.statusCode === 200) {
                    res.send(resultData.result);
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DEPLOY_CREATE, task);
};

exports.updateDeploy = function (req, res) {
    var task = function (permissions) {
        var serverInfo = req.params.target;
        var target = {
            deployId: req.body.deployId,
            registerUserId: req.body.registerUserId,
            version: req.body.version,
            title: req.body.title,
            description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
            isactive: req.body.isactive,
            updateUserId: req.body.updateUserId
        };

        var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/deploy/' + serverInfo);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(target);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode === 200) {
                    res.send();
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DEPLOY_UPDATE, task);
};