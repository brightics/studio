var router = __REQ_express.Router();
var request = __REQ_request;
var decryptRSA = require('../../../../../lib/rsa').decryptRSA;

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DATASOURCE], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};


var getDecryptedDatasource = function (req) {
    return Object.assign({}, req.body, {
        password: decryptRSA(req.body.password, req)
    });
};

var getPasswordDeletedDatasource = function (datasource) {
    return Object.assign({}, datasource, {
        password: ''
    });
};

var getDbType = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/dbtypes');
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
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_READ, task);
};

var getDatasource = function (req, res) {
    var task = function (permissions) {
        var datasourceName = req.params.datasourceName;
        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/datasources/' + datasourceName);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json(getPasswordDeletedDatasource(JSON.parse(body)));
                } else {
                    // __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                    // res.status(response.statusCode).send(response.body);
                    // 조회시 없는 datasource인 경우 에러(?)
                    res.json(JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_READ, task);
};

var listDatasource = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/datasources');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json(JSON.parse(body).map(getPasswordDeletedDatasource));
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_READ, task);
};

var createDatasource = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('PUT', '/api/core/v2/datasources');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(getDecryptedDatasource(req));
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json(body);
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_UPDATE, task);
};

var updateDatasource = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/datasources');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(getDecryptedDatasource(req));
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_UPDATE, task);
};

var deleteDatasource = function (req, res) {
    var task = function (permissions) {
        var datasourceName = req.params.datasourceName;
        var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/datasources/' + datasourceName);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_DELETE, task);
};

var deleteDatasources = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/datasources'); // core 와 API 정의 필요
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_DELETE, task);
};

router.get('/datasources/dbtype', getDbType);
router.get('/datasources/:datasourceName', getDatasource);
router.get('/datasources', listDatasource);
router.post('/datasources/:datasourceName', createDatasource);
router.post('/datasources/:datasourceName/update', updateDatasource);
router.post('/datasources/delete', deleteDatasources);
router.post('/datasources/:datasourceName/delete', deleteDatasource);

module.exports = router;