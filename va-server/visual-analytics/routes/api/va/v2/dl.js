var router = __REQ_express.Router();
var request = __REQ_request;
var getErrorMessageFromJobStatus = require('../../../../lib/get-err-from-jobstatus');


const cbParse = (res) => {
    return function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    res.json(JSON.parse(response.body));
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    };
};

const cbWithoutParse = (res) => {
    return function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                res.send(body);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    };
};

router.get('/jobs/:userId/:mid', function (req, res) {
    var userId = req.params.userId;
    var mid = req.params.mid;

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/joblist/' + userId + '/' + mid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParse(res));
});

router.get('/job/status/:userId/:mid', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/dl/status/' + req.params.userId + '/' + req.params.mid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        var answer = JSON.parse(response.body);
        if (answer.status === 'FAIL') {
            const msg = getErrorMessageFromJobStatus(answer);
            if (msg) answer.message = msg;
        }
        return res.json(answer);
    });
});

router.get('/browse', function (req, res) {
    var path = req.query.path;

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/dl/browse?path=' + path);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParse(res));
});

router.post('/modelcheck', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/dl/modelcheck');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(req.body);
    request(options, cbWithoutParse(res));
});

router.post('/exportscript', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/dl/exportscript');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(req.body);
    request(options, cbWithoutParse(res));
});

module.exports = router;
