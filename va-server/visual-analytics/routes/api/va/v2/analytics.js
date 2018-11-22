var router = __REQ_express.Router();
var request = __REQ_request;

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.JOB], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var parseResultData = function (taskResult) {
    var arrColIndexes = [],
        resultSet = {};

    if (typeof taskResult === 'string') return taskResult;

    resultSet.columns = [];
    for (var c = 0; c < taskResult.columns.length; c++) {
        var name = taskResult.columns[c]['name'];
        var type = taskResult.columns[c]['type'];
        var convertedType = __BRTC_CORE_SERVER.convertColumnType(type);
        resultSet.columns.push({
            name: name,
            type: convertedType.type,
            internalType: convertedType.internalType
        });
        if (convertedType.type == 'byte[]') {
            arrColIndexes.push(c);
        }
    }

    // byte[] 의 경우 그 크기를 짐작하기 어려워서 browser 의 메모리가 감당할 수 없을 뿐더러
    // 사용자가 알 수 없는 형태로 출력되므로 10개까지만 보여주자
    // by daewon.park since 2016-10-20
    if (arrColIndexes.length > 0) {
        for (var r in taskResult.data) {
            var row = taskResult.data[r];
            for (var a in arrColIndexes) {
                var idx = arrColIndexes[a];
                if (row[idx].length > 10) {
                    row[idx].splice(10, row[idx].length - 10);
                }
            }
        }
    }
    resultSet.data = taskResult.data;
    return resultSet;
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
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/analytics/jobs');
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
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/analytics/jobs/' + req.body.jid);
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

router.post('/jobs/execute', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/analytics/jobs/execute');
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

router.get('/jobs/:jid', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/analytics/jobs/' + req.params.jid);
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

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

router.get('/jobs/:jid/tasks/:fid', function (req, res) {
    setTimeout(function () {
        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/' + req.params.jid + '/' + req.params.fid);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        console.log(options);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    var answer = JSON.parse(response.body);
                    if (answer.status) {
                        // 예전 스펙에는 columns
                        if (answer.message && answer.message.columns) {
                            for (var c in answer.message.columns) {
                                var converted = __BRTC_CORE_SERVER.convertColumnType(answer.message.columns[c].type);
                                answer.message.columns[c].type = converted.type;
                                answer.message.columns[c].internalType = converted.internalType;
                            }
                        }

                        // Core에서 spec이 바뀜
                        if (answer.message && typeof answer.message === 'string') {
                            if (IsJsonString(answer.message)) {
                                var message = JSON.parse(answer.message).data;
                                var schema = message.schema;
                                if (schema) {
                                    for (var i = 0; i < schema.length; i++) {
                                        var name = schema[i]['column-name'];
                                        var type = schema[i]['column-type'];

                                        schema[i]['name'] = name;
                                        var converted = __BRTC_CORE_SERVER.convertColumnType(type);
                                        schema[i]['type'] = converted.type;
                                        schema[i]['internalType'] = converted.internalType;
                                    }
                                    answer.message = message;
                                    answer.message.columns = message.schema;
                                }
                            }
                        }
                        res.json(answer);
                    } else {
                        __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                    }
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    }, 1000);
});

router.get('/jobs/:jid/logs', function (req, res) {
    // TODO 아직 Core Server 에서 미 구현 by daewon.park since 2016-09-26
    res.status(200).json([]);
});

router.post('/jobs/:jid/delete', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/analytics/jobs/' + req.params.jid);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    if (req.body.type && req.body.type == 'realtime') {
        options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/analytics/dataflow/stream');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    }
    // request(options).pipe(res);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

router.get('/stream', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/analytics/dataflow/stream');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer.result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

router.post('/stream/delete', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/analytics/dataflow/stream');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer.result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.get('/stream', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/analytics/dataflow/stream');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer.result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

router.post('/stream/delete', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/analytics/dataflow/stream');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer.result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.post('/jobsandmetadata/:jid', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/analytics/jobsandmetadata/' + req.params.jid);
    options.body = req.body.data;
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

router.get('/agentuser/status', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agentuser/health');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer.result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

router.get('/current-tasks', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/list-all');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});
router.get('/current-tasks/:user_id', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/list/' + req.params.userId);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

router.get('/current-session-tasks', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/task/list');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = JSON.parse(response.body);
                    res.json(answer.result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

module.exports = router;