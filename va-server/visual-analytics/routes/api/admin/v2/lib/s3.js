var router = __REQ_express.Router();
var request = __REQ_request;
var decryptRSA = require('../../../../../lib/rsa').decryptRSA;

var getDecryptedDatasource = function (req) {
    return Object.assign({}, req.body, {
        secretAccessKey: decryptRSA(req.body.secretAccessKey, req)
    });
};

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

var convertS3 = function ({accessKeyId, bucketName, secretAccessKey, _links}) {
    const hrefPrefix = '/api/core/v2/entity/s3/';

    const url = _links.self.href;
    return {
        accessKeyId,
        bucketName,
        secretAccessKey: '',
        datasourceName: url.substring(url.indexOf(hrefPrefix) + hrefPrefix.length)
    };
}

var getDatasource = function (req, res) {
    var task = function (permissions) {
        var datasourceName = req.params.datasourceName;
        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/entity/s3/' + datasourceName);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    res.json(convertS3(JSON.parse(body)));
                } else {
                    // __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                    // res.status(response.statusCode).send(response.body);
                    // 조회시 없는 datasource인 경우 에러(?)
                    if (body) {
                        return __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                    }
                    res.json(null);
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_READ, task);
};

var listDatasource = function (req, res) {
    var task = function (permissions) {
        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/entity/s3');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 200) {
                    const items = JSON.parse(body);
                    res.json(items._embedded.brtcS3Datasources.map(convertS3));
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
        var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/entity/s3');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(getDecryptedDatasource(req));
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 201) {
                    res.json({
                        success: true
                    });
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
        var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/entity/s3');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(getDecryptedDatasource(req));
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 201) {
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
        var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/entity/s3/' + datasourceName);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode == 204) {
                    res.json({success: true});
                } else {
                    __BRTC_ERROR_HANDLER.sendServerError(res, JSON.parse(body));
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_DELETE, task);
};

router.get('/s3/:datasourceName', getDatasource);
router.get('/s3', listDatasource);
router.post('/s3/:datasourceName', createDatasource);
router.post('/s3/:datasourceName/update', updateDatasource);
router.post('/s3/:datasourceName/delete', deleteDatasource);

module.exports = router;
