var router = __REQ_express.Router();
var request = __REQ_request;

var listSQLs = function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/entity/sql/' + req.params.sqlId);
    console.log(options);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.json((JSON.parse(body)));
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var createSQL = function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/entity/sql');
    var param = {
        sqlId: req.params.sqlId,
        sql: req.body.sql
    };
    options.body = JSON.stringify(param);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200 || response.statusCode == 201) {
                res.send(body);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var updateSQL = function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/entity/sql');
    var param = {
        sqlId: req.params.sqlId,
        sql: req.body.sql
    };
    options.body = JSON.stringify(param);
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
    });
};

var deleteSQL = function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/entity/sql/' + req.params.sqlId);
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
    });
};

var listDataSources = function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/datasources/');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    var answer = []
                        , resultSet = JSON.parse(body);
                    if (req.query.type) {
                        for (var i in resultSet) {
                            if (req.query.type == resultSet[i].datasourceType ||
                                (req.query.type === 'RDB' && resultSet[i].datasourceType === 'JDBC') ||
                                (req.query.type === 'RDB' && resultSet[i].datasourceType === 'HIVE')) {
                                answer.push(resultSet[i]);
                            }
                        }
                    } else {
                        answer = resultSet;
                    }
                    res.status(200).json(answer);
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

router.get('/jdbcloader/:sqlId', listSQLs);
router.post('/jdbcloader/:sqlId', createSQL);
router.post('/jdbcloader/:sqlId/update', updateSQL);
router.post('/jdbcloader/:sqlId/delete', deleteSQL);
router.get('/datasources', listDataSources);

module.exports = router;
