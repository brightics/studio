var router = __REQ_express.Router();
var request = __REQ_request;

var MessageFormat = require('messageformat');
var mf = new MessageFormat('en');

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.SCHEDULE], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var listSchedules = function (req, res) {
    var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('GET', '/api/v2/schedules');
    __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json((JSON.parse(body)).result);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
            // TODO Agent Isolation 기능 추가 필요
            // var doneCallback = function (result) {
            //     var userNames = [];
            //     for (var i in result) {
            //         userNames.push(result[i].id);
            //     }
            //     if (response.statusCode == 200) {
            //         var returnValues = [];
            //         var scheduleList = (JSON.parse(body)).result;
            //         for (var i in scheduleList) {
            //             if (userNames.indexOf(scheduleList[i].scheduleOwner) > -1) {
            //                 returnValues.push(scheduleList[i])
            //             }
            //         }
            //         res.json(returnValues);
            //     } else {
            //         __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            //     }
            // };
            // userQuery.listUsers(req, res, doneCallback);
        }
    });
};


var listScheduleHistories = function (req, res) {
    var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('GET', '/api/v2/schedulehistories');
    __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json((JSON.parse(body)).result);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var scheduleHistories = function (req, res) {
    var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('GET', '/api/v2/schedulehistories');
    __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                var scheduleHistoryList = (JSON.parse(body)).result;
                scheduleHistoryList = scheduleHistoryList.filter(function (item) {
                    return item.scheduleId === req.params.scheduleId;
                });
                res.json(scheduleHistoryList);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var createSchedule = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('POST', '/api/v2/schedule/create/');
        __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
        delete req.body.reportContents;
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_SCHEDULE_CREATE, task);
};

var updateSchedule = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('POST', '/api/v2/schedule/modify/');
        __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_SCHEDULE_UPDATE, task);
};

var deleteSchedule = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('DELETE', '/api/v2/schedule/delete/' + req.body.scheduleId + '/' + req.body.requestUser);
        __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_SCHEDULE_DELETE, task);
};

var abortSchedule = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('DELETE', '/api/v2/schedule/abort/' + req.body.scheduleId + '/' + req.body.requestUser);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_SCHEDULE_UPDATE, task);
};

var getReport = function (req, res) {
    var compile = mf.compile('/api/v2/scheduletask/{taskId}');
    var url = compile({
        taskId: encodeURI(req.params.taskId)
    });
    var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('GET', url);
    __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json(JSON.parse(body));
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var getErrorMessage = function (req, res) {
    var compile = mf.compile('/api/core/v2/jobstatuserror/{jobId}');
    var url = compile({
        jobId: encodeURI(req.params.jobId)
    });
    var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('GET', url);
    __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json(JSON.parse(body));
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var getSchedule = function (req, res) {
    var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('GET', '/api/v2/schedules');
    __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = []
                        , resultSet = (JSON.parse(body)).result,
                        promises = [];
                    for (var i in resultSet) {
                        if (req.params.scheduleId == resultSet[i].scheduleId) {
                            var schedule = resultSet[i];
                            var mainMid = JSON.parse(schedule.executeContents).main;
                            var versionId = JSON.parse(schedule.executeContents).models[JSON.parse(schedule.executeContents).main].version_id;
                            answer.push(schedule);

                            var promise = new Promise(function (resolve, reject) {
                                var compile = mf.compile('/api/va/v2/ws/projects/:project/files/{fileid}/versions/{versionid}');
                                var url = compile({
                                    fileid: encodeURI(mainMid),
                                    versionid: encodeURI(versionId)
                                });
                                var options = __BRTC_API_SERVER.createRequestOptions('GET', url);
                                __BRTC_API_SERVER.setBearerToken(options, req.accessToken);
                                request(options, function (error, response, body) {
                                    if (error) {
                                        reject(Error(error.message));
                                    } else {
                                        if (response.statusCode == 200) {
                                            var rows = JSON.parse(body);
                                            if (rows) {
                                                schedule.modelVersion = rows.major_version + '.' + rows.minor_version;
                                                schedule.modelVersionId = versionId;
                                            }
                                            resolve("SUCCESS Schedule ModelVersion");
                                        } else {
                                            reject(new Error(__BRTC_ERROR_HANDLER.parseError(body).errors[0].message));
                                        }
                                    }
                                });
                            });
                            promises.push(promise);
                        }
                    }
                    Promise.all(promises).then(function () {
                        res.status(200).json(answer);
                    }, function (error) {
                        next(error);
                    });
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var forceReadySchedule = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('POST', '/api/v2/schedule/forceready/' + req.body.scheduleId + '/' + req.body.requestUser);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_SCHEDULE_UPDATE, task);
};

var forceDeleteSchedule = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('DELETE', '/api/v2/schedule/forcedelete/' + req.body.scheduleId + '/' + req.body.requestUser);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_SCHEDULE_UPDATE, task);
};

router.get('/schedules', listSchedules);
router.get('/schedules/:scheduleId', getSchedule);
router.get('/schedules/histories', listScheduleHistories);
router.get('/schedules/:scheduleId/histories', scheduleHistories);
router.post('/schedules/', createSchedule);
router.post('/schedules/:scheduleId/update', updateSchedule);
router.post('/schedules/:scheduleId/delete', deleteSchedule);
router.post('/schedules/:scheduleId/abort', abortSchedule);
router.post('/schedules/:scheduleId/forceready', forceReadySchedule);
router.post('/schedules/:scheduleId/forcedelete', forceDeleteSchedule);
router.get('/schedules/:scheduleId/jobs/:jobId', getErrorMessage);

module.exports = router;
