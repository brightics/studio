const router = __REQ_express.Router();
const request = __REQ_request;
const getErrorMessageFromJobStatus = require('../../../../lib/get-err-from-jobstatus');

const cb = (res) => {
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

const cbParse = (res) => {
    return function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    const answer = JSON.parse(response.body);
                    res.json(answer);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    };
};

const cbParseResult = (res) => {
    return function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    const answer = JSON.parse(response.body);
                    res.json(answer.result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    };
};

/**
 * @api {get} /api/va/v2/analytics/jobs/{jobid} Read job status
 * @apiGroup Job
 * @apiName GetAnalyticsJobs
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Param) {String} jobid Job Id.
 * @apiParamExample Request-Param-Example:
 *     /api/va/v2/analytics/jobs/J1472800647305
 *
 * @apiSuccess (Success Response) jid Job id.
 * @apiSuccess (Success Response) begin Job start time.
 * @apiSuccess (Success Response) end Job end time.
 * @apiSuccess (Success Response) user Job user.
 * @apiSuccess (Success Response) status Job status.
 * @apiSuccess (Success Response) message Job status message.
 * @apiSuccess (Success Response) processes Job process details.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *     {
 *          "jid": "J1472800647305",
 *          "begin": 1472800647305,
 *          "end": 1472800659179,
 *          "user": "david",
 *          "status": "PROCESSING",
 *          "message": "path is invalid.",
 *          "processes": [
 *            {
 *              "pid": "p160908_102500_001",
 *              "mid": "c010203",
 *              "status": "PROCESSING",
 *              "begin": 1472800647305,
 *              "end": 1472800659179,
 *              "functions": [
 *                { "fid": "f010203", "begin": 1472800647305, "end": 1472800659179, "status": "SUCCESS" },
 *                { "fid": "f010204", "begin": 1472800659179, "end": 1472800705009, "status": "PROCESSING" },
 *                { "fid": "f010205", "begin": 1472800705009, "status": "PROCESSING", "pid": "p160908_102500_002" },
 *                { "fid": "f010205", "begin": 1472800705009, "status": "PROCESSING", "pid": "p160908_102500_003" }
 *              ]
 *            },
 *            {
 *              "pid": "p160908_102500_002",
 *              "mid": "m010203",
 *              "status": "PROCESSING",
 *              "begin": 1472800647305,
 *              "end": 1472800659179,
 *              "functions": [
 *                { "fid": "f010203", "begin": 1472800647305, "end": 1472800659179, "status": "SUCCESS" },
 *                { "fid": "f010204", "begin": 1472800659179, "end": 1472800705009, "status": "FAIL" },
 *                { "fid": "f010205", "begin": 1472800705009, "status": "PROCESSING" }
 *              ]
 *            },
 *            {
 *              "pid": "p160908_102500_003",
 *              "mid": "m010203",
 *              "status": "PROCESSING",
 *              "begin": 1472800647305,
 *              "end": 1472800659179,
 *              "functions": [
 *                { "fid": "f010203", "begin": 1472800647305, "end": 1472800659179, "status": "SUCCESS" },
 *                { "fid": "f010204", "begin": 1472800659179, "end": 1472800705009, "status": "FAIL" },
 *                { "fid": "f010205", "begin": 1472800705009, "status": "PROCESSING" }
 *              ]
 *            }
 *          ]
 *     }
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
router.get('/jobs', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/analytics/jobs');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParse(res));
});


/**
 * @api {post} /api/va/v2/analytics/jobs Request job start
 * @apiGroup Job
 * @apiName PostAnalyticsJobs
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Body) {String} user Job user.
 * @apiParam (Request Body) {String} jid Job Id.
 * @apiParam (Request Body) {String} main Job main model.
 * @apiParam (Request Body) {String} args Job global variable.
 * @apiParam (Request Body) {String} models Job models.
 * @apiParam (Request Body) {String} models.modelId Job model Id.
 * @apiParam (Request Body) {String} models.modelId.mid Job model Id.
 * @apiParam (Request Body) {String} models.modelId.type Job model type.
 * @apiParamExample Request-Body-Example:
 * {
 *   "user": "david",
 *   "jid": "J_123456789012",
 *   "main": "cf-00001",
 *   "args": {},
 *   "models": {
 *     "cf-00001": {
 *       "mid": "cf-00001",
 *       "type": "control",
 *       "functions": [],
 *       "links": [],
 *       "variables": []
 *     },
 *     "df-00001": {
 *       "mid": "df-00001",
 *       "type": "data",
 *       "gv": [],
 *       "functions": [],
 *       "links": [],
 *       "entries": []
 *     }
 *   }
 * }
 *
 * @apiSuccess (Success Response) jid Job id.
 * @apiSuccess (Success Response) begin Job start time.
 * @apiSuccess (Success Response) end Job end time.
 * @apiSuccess (Success Response) user Job user.
 * @apiSuccess (Success Response) status Job status.
 * @apiSuccess (Success Response) message Job status message.
 * @apiSuccess (Success Response) processes Job process details.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *     Empty Response
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
router.post('/jobs', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/analytics/jobs/' + req.body.jid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(req.body);
    request(options, cb(res));
});

router.post('/jobs/execute', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/analytics/jobs/execute');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(req.body);
    request(options, cb(res));
});

router.get('/jobs/:jid', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/analytics/jobs/' + req.params.jid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                let answer = JSON.parse(response.body);
                const errMsg = getErrorMessageFromJobStatus(answer);
                if (errMsg) answer.message = errMsg;
                res.json(answer);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

router.get('/jobs/:jid/tasks/:fid', function (req, res) {
    setTimeout(function () {
        let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/' + req.params.jid + '/' + req.params.fid);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        console.log(options);
        request(options, function (error, response, body) {
            if (error) {
                return __BRTC_ERROR_HANDLER.sendServerError(res, error);
            }
            if (response.statusCode !== 200) {
                return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
            let answer = JSON.parse(response.body);

            if (!answer.status) {
                return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
            // 예전 스펙에는 columns
            if (answer.message && answer.message.columns) {
                for (let c in answer.message.columns) {
                    const converted = __BRTC_CORE_SERVER
                        .convertColumnType(answer.message.columns[c].type);
                    answer.message.columns[c].type = converted.type;
                    answer.message.columns[c].internalType = converted.internalType;
                }
            }

            // Core에서 spec이 바뀜
            if (answer.message && typeof answer.message === 'string') {
                if (isJsonString(answer.message)) {
                    let message = JSON.parse(answer.message).data;
                    let schema = message.schema;
                    if (schema) {
                        schema.forEach((s) => {
                            const { 'column-name': name, 'column-type': columnType } = s;
                            const { type, internalType } = __BRTC_CORE_SERVER
                                .convertColumnType(columnType);
                            Object.assign(s, {
                                name,
                                type,
                                internalType,
                            });
                        });
                        // for (var i = 0; i < schema.length; i++) {
                        //     var name = schema[i]['column-name'];
                        //     var type = schema[i]['column-type'];

                        //     schema[i].name = name;
                        //     const converted = __BRTC_CORE_SERVER
                        //         .convertColumnType(type);
                        //     schema[i].type = converted.type;
                        //     schema[i].internalType = converted.internalType;
                        // }
                        answer.message = message;
                        answer.message.columns = message.schema;
                    }
                }
            }
            return res.json(answer);
        });
    }, 1000);
});

router.get('/jobs/:jid/logs', function (req, res) {
    // TODO 아직 Core Server 에서 미 구현 by daewon.park since 2016-09-26
    res.status(200).json([]);
});

router.post('/jobs/:jid/delete', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/analytics/jobs/' + req.params.jid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    if (req.body.type && req.body.type === 'realtime') {
        options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/analytics/dataflow/stream');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    }
    // request(options).pipe(res);
    request(options, cbParse(res));
});

router.get('/stream', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/analytics/dataflow/stream');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParseResult(res));
});

router.post('/stream/delete', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/analytics/dataflow/stream');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParseResult(res));
});

router.post('/jobsandmetadata/:jid', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/analytics/jobsandmetadata/' + req.params.jid);
    options.body = req.body.data;
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                let answer = JSON.parse(response.body);
                const errMsg = getErrorMessageFromJobStatus(answer);
                if (errMsg) answer.message = errMsg;
                res.json(errMsg);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.get('/agentuser/status', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agentuser/health');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParseResult(res));
});

router.get('/current-tasks', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/list-all');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParse(res));
});
router.get('/current-tasks/:user_id', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/list/' + req.params.userId);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParse(res));
});

router.get('/current-session-tasks', function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/list');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cbParseResult(res));
});

module.exports = router;
