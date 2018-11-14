var router = __REQ_express.Router();
var request = __REQ_request;

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AGENT], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

/**agent 목록조회**/
router.get('/agents', function (req, res, next) {
    var task = function (permissions) {
        var reqApi;
        if (__BRTC_CONF['agent-isolation']) {
            var chkIsForceReadPerm = permissions.findIndex(function (permObj) {
                //TODO: PERM_AGENT_READ_FORCE db에 추가필요
                return permObj.permission_id == __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_READ_FORCE
            });
            if (chkIsForceReadPerm > -1) {
                reqApi = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agents');
                executeApi(reqApi, req, res);
            } else {
                var _userId = req.session.userId;
                var findAgentIdApi = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agentUser/' + _userId);
                request(findAgentIdApi, function (error, response, body) {
                    if (error) {
                        __BRTC_ERROR_HANDLER.sendServerError(res, error);
                    } else {
                        if (response.statusCode == 200) {
                            var myAgentObj = (JSON.parse(body)).result;
                            reqApi = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agent/' + myAgentObj.agentId);
                            executeApi(reqApi, req, res);
                        } else {
                            __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                        }
                    }
                });
            }
        } else {
            reqApi = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agents');
            executeApi(reqApi, req, res);
        }
    };

    var executeApi = function (reqApi, req, res) {
        __BRTC_CORE_SERVER.setBearerToken(reqApi, req.accessToken);
        request(reqApi, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    var agentList = (JSON.parse(body)).result;

                    var rt = [];
                    if (agentList instanceof Array) {
                        for (var i in agentList) {
                            if (req.query.agentId && req.query.agentId != '') {
                                if ((agentList[i].agentId.toLowerCase()).indexOf(req.query.agentId.toLowerCase()) == -1) continue;
                            }
                            if (req.query.activeStart == 'false' && req.query.activeStop == 'true') {
                                if ((agentList[i].status) != 'STOP') continue;
                            }
                            if (req.query.activeStart == 'true' && req.query.activeStop == 'false') {
                                if ((agentList[i].status) != 'RUN') continue;
                            }
                            if (req.query.activeStart == 'false' && req.query.activeStop == 'false') {
                                continue;
                            }
                            rt.push(agentList[i]);
                        }
                    } else {
                        rt.push(agentList);
                    }

                    rt.sort(function (a, b) {
                        if (a.agentId < b.agentId) return -1;
                        if (a.agentId > b.agentId) return 1;
                        return 0;
                    });

                    res.send(rt);
                } else {
                    __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
                }
            }

        });
    }

    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_READ, task);
});

/**agent 추가**/
var createAgent = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('PUT', '/api/core/v2/agent');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.send(body);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_CREATE, task);
};

/**agent 수정**/
var UpdateAgent = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/agent');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.send(body);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_UPDATE, task);
};


/*agent 삭제*/
var deleteAgent = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/agent/' + req.params.agentId);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {

                    var rt = (JSON.parse(body));

                    rt.agentId = req.params.agentId;
                    res.send(rt);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_DELETE, task);
};

/*agents 삭제*/
var deleteAgents = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/agents');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {

                    var rt = (JSON.parse(body));

                    rt.agentId = req.params.agentId;
                    res.send(rt);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_DELETE, task);
};

/**agent 중복여부 체크**/
router.get('/agents/exist/:agentId', function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agent/exists/' + req.params.agentId);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json(JSON.parse(body));
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
            }
        }
    });
});

/**agent start**/
router.get('/agents/:agentId/start', function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agent/start/' + req.params.agentId);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json(JSON.parse(body));
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
            }
        }
    });
});

/**agent stop**/
router.get('/agents/:agentId/stop', function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agent/stop/' + req.params.agentId);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json(JSON.parse(body));
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
            }
        }
    });
});

/**agent별 user조회**/
router.get('/agents/users/agent/:agentId', function (req, res, next) {
    var _agentId = req.params.agentId;

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agentUsers');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {

                var allUserList = (JSON.parse(body)).result;

                allUserList = allUserList.filter(function (item) {
                    return (item.agentId == _agentId);
                });
                res.send(allUserList);
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
            }
        }
    });
});

/**user가 사용하는 agent 조회**/
router.get('/agents/users/user/:userId', function (req, res, next) {
    var _userId = req.params.userId;

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agentUser/' + _userId);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                var agentUserInfo = (JSON.parse(body)).result;
                res.send(agentUserInfo);
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
            }
        }
    });
});

/**agent별 user 전체 조회**/
router.get('/agents/users', function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agentUsers');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {

                var allUserList = (JSON.parse(body)).result;
                res.send(allUserList);
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
            }
        }
    });
});

/**agent user 추가**/
var addAgentUser = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('PUT', '/api/core/v2/agentUser');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        // options.body = req.body;
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.send(body);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_UPDATE, task);
};

/**agent user 삭제**/
var removeAgentUser = function (req, res, nex) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/agentUser/' + req.params.userId);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json(JSON.parse(body));
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_UPDATE, task);
};

/**agent status**/
router.get('/agents/:agentId/status', function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/agent/health/' + req.params.agentId);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                var rt = JSON.parse(body);
                rt.agentId = req.params.agentId;
                res.send(rt);
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
            }
        }
    });
});

router.post('/agents/:agentId', createAgent);
router.post('/agents/:agentId/update', UpdateAgent);
router.post('/agents/delete', deleteAgents);
router.post('/agents/:agentId/delete', deleteAgent);
router.post('/agents/:agentId/user', addAgentUser);
router.post('/agents/users/:userId/delete', removeAgentUser);
// router.get('/agents/:agentId/start', startAgent);
// router.get('/agents/:agentId/stop', StopAgent);

module.exports = router;
