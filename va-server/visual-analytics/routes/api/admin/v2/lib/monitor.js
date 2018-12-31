/**
 * Created by sds on 2018-09-27.
 */
var router = __REQ_express.Router();
var request = __REQ_request;

var MessageFormat = require('messageformat');
var mf = new MessageFormat('en');

const coreResponseHandler = (req, res) => {
    return function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                res.json(JSON.parse(body));
            } else {
                res.status(response.statusCode).send(response.body);
            }
        }
    };
};

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req,
        [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.MONITORING], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};
var checkSchema = function (req, res) {
    var task = function (permissions) {
        // req.query.type == 'res' || req.query.type == 'job'
        var options = __BRTC_MONITOR_SERVER.createRequestOptions('GET', '/api/monitor/v3/check?type=' + req.query.type);
        __BRTC_MONITOR_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode === 200) {
                    res.json(Number.parseInt(body));
                } else {
                    res.status(response.statusCode).send(response.body);
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.MONITORING, task);
};

var getResourceInfo = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_MONITOR_SERVER.createRequestOptions('GET', '/api/monitor/v3/resource/info');
        __BRTC_MONITOR_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, coreResponseHandler(req, res));
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.MONITORING, task);
};

var getResourcePids = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_MONITOR_SERVER.createRequestOptions('GET', '/api/monitor/v3/resource/pids');
        __BRTC_MONITOR_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, coreResponseHandler(req, res));
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.MONITORING, task);
};

var getResourceStatus = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_MONITOR_SERVER.createRequestOptions('GET', '/api/monitor/v3/resource/status?time=' + req.query.time);
        __BRTC_MONITOR_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, coreResponseHandler(req, res));
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.MONITORING, task);
};


var getRunningJobUser = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_MONITOR_SERVER.createRequestOptions('GET', '/api/monitor/v3/job/user?time=' + req.query.time);
        __BRTC_MONITOR_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, coreResponseHandler(req, res));
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.MONITORING, task);
};

var getJobStatus = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_MONITOR_SERVER.createRequestOptions('GET', '/api/monitor/v3/job/status?time=' + req.query.time);
        __BRTC_MONITOR_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, coreResponseHandler(req, res));
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.MONITORING, task);
};

router.get('/monitor/check', checkSchema);
router.get('/monitor/resource/info', getResourceInfo);
router.get('/monitor/resource/pids', getResourcePids);
router.get('/monitor/resource/status', getResourceStatus);
router.get('/monitor/job/user', getRunningJobUser);
router.get('/monitor/job/status', getJobStatus);

module.exports = router;
