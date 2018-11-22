var router = __REQ_express.Router();
var request = __REQ_request;

router.get('/jobs/:userId/:mid', function (req, res) {
    var userId = req.params.userId,
        mid = req.params.mid;

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/joblist/' + userId + '/' + mid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    res.json(JSON.parse(response.body));
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

router.get('/job/status/:userId/:mid', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/dl/status/' + req.params.userId + '/' + req.params.mid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                var answer = JSON.parse(response.body);
                if (answer.status === 'FAIL') {
                    for (var p in answer.processes) {
                        if (answer.processes[p].status === 'FAIL') {
                            for (var f in answer.processes[p].functions) {
                                if (answer.processes[p].functions[f].status === 'FAIL' && answer.processes[p].functions[f].message) {
                                    var beginIdx = answer.processes[p].functions[f].message.indexOf(':');
                                    var endIdx = answer.processes[p].functions[f].message.indexOf('\n');
                                    if (beginIdx > -1 && endIdx > -1) {
                                        answer.message = answer.processes[p].functions[f].message.substring(beginIdx + 2, endIdx);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                res.json(answer);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.get('/browse', function (req, res) {
    var path = req.query.path;

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/dl/browse?path=' + path);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    res.json(JSON.parse(response.body));
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

router.post('/modelcheck', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/dl/modelcheck');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(req.body);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.send(body);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.post('/exportscript', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/dl/exportscript');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(req.body);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.send(body);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

module.exports = router;