var router = __REQ_express.Router();
var request = __REQ_request;

var MessageFormat = require('messageformat');
var mf = new MessageFormat('en');
var pg = require('pg');
var decryptRSA = require('../../../../lib/rsa').decryptRSA;

var convertResultSet = function (resultSet) {
    var temp = JSON.parse(JSON.stringify(resultSet));
    if (temp.data instanceof Object && !(temp.data instanceof Array)) {
        var tempData = JSON.parse(JSON.stringify(resultSet.data));
        // Object.assign
        for (var key in tempData) {
            temp[key] = tempData[key];
        }
    }
    return temp;
};

var parseStagingData = function (body) {
    var arrColIndexes = [];
    var resultSet = convertResultSet(JSON.parse(body));
    resultSet.columns = [];
    for (var c = 0; c < resultSet.schema.length; c++) {
        var name = resultSet.schema[c]['column-name'];
        var type = resultSet.schema[c]['column-type'];
        var convertedType = __BRTC_CORE_SERVER.convertColumnType(type);
        resultSet.columns.push({
            name: name,
            type: convertedType.type,
            internalType: convertedType.internalType
        });
        if (convertedType.type === 'byte[]') {
            arrColIndexes.push(c);
        }
    }
    delete resultSet.schema;

    // byte[] 의 경우 그 크기를 짐작하기 어려워서 browser 의 메모리가 감당할 수 없을 뿐더러
    // 사용자가 알 수 없는 형태로 출력되므로 10개까지만 보여주자
    // by daewon.park since 2016-10-20
    if (arrColIndexes.length > 0) {
        for (var r in resultSet.data) {
            var row = resultSet.data[r];
            for (var a in arrColIndexes) {
                var idx = arrColIndexes[a];
                if (row[idx].length > 10) {
                    row[idx].splice(10, row[idx].length - 10);
                }
            }
        }
    }
    return resultSet;
};

router.get('/', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/datasources');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        try {
            var answer = []
                , resultSet = JSON.parse(body);
            if (req.query.type) {
                for (var i in resultSet) {
                    if (req.query.type === resultSet[i].datasourceType ||
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
    });
});

router.get('/:source/tables', function (req, res) {
    var compile = mf.compile('/api/v2/datasources/{source}/tables');
    var url = compile({
        source: req.params.source
    });

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    var answer = JSON.parse(body).result;
                    res.status(200).json(answer);
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.get('/:source/columns', __BRTC_ERROR_HANDLER.checkParams(['tableName']), function (req, res) {
    var compile = mf.compile('/api/v2/datasources/{source}/columns?tableName={tableName}');
    var url = compile({
        source: req.params.source,
        tableName: req.query.tableName
    });

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    var answer = JSON.parse(body).result;
                    res.status(200).json(answer);
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.get('/staging/query', __BRTC_ERROR_HANDLER.checkParams(['user', 'mid', 'tab', 'offset', 'limit']), function (req, res) {
    var compile = mf.compile('/api/v2/datasources/staging/{user}/{mid}/{tab}?offset={offset}&limit={limit}');
    var url = compile({
        user: req.query.user,
        mid: req.query.mid,
        tab: req.query.tab,
        offset: req.query.offset,
        limit: req.query.limit
    });
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.timeout = 30 * 1000;
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    res.json(parseStagingData(body));
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

router.post('/staging/delete', __BRTC_ERROR_HANDLER.checkParams(['user']), function (req, res) {
    if (req.query.user !== req.session.userId) {
        return __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    }
    var url = '/api/v2/datasources/staging/' + req.query.user;
    if (req.query.mid) {
        url += '/' + req.query.mid;
        if (req.query.tab) {
            url += '/' + req.query.tab
        }
    }
    var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    return request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        try {
            res.json(JSON.parse(body));
        } catch (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }
    });
});

var urlParser = function (req) {
    // var dbType = req.body.dbtype;
    var host = req.body.host;
    var port = req.body.port;
    var service = req.body.service;
    var username = req.body.username;
    var decrypted = decryptRSA(req.body.password, req);

    return {
        user: username,
        database: service,
        password: decrypted,
        host: host,
        port: port
    };
};

const PG_TABLE_SCHEMA = 'SELECT column_name, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = $1 and table_schema = $2';
router.post('/external/schema', function (req, res, next) {
    var table = req.body.tablename.split('.')[1] || req.body.tablename.split('.')[0];
    var schema = req.body.tablename.split('.').length > 1 ? req.body.tablename.split('.')[0] : 'public';
    new pg.Pool(urlParser(req)).connect(function (err, client, done) {
        if (err) {
            __BRTC_ERROR_HANDLER.sendMessage(res, err.message);
        } else {
            client.query(PG_TABLE_SCHEMA, [table, schema], function (err, result) {
                if (err) {
                    __BRTC_ERROR_HANDLER.sendMessage(res, err.message);
                } else {
                    done();
                    res.send(result.rows);
                }
            });
        }
    });
});

const PG_VALIDATION = 'SELECT 1';
router.post('/external/query', function (req, res, next) {
    var table = req.body.tablename;
    new pg.Pool(urlParser(req)).connect(function (err, client, done) {
        if (err) {
            __BRTC_ERROR_HANDLER.sendMessage(res, err.message);
        } else {
            var query = table ? 'SELECT * FROM ' + table + ' LIMIT 20' : PG_VALIDATION;
            client.query(query, [], function (err, result) {
                if (err) {
                    __BRTC_ERROR_HANDLER.sendMessage(res, err.message);
                } else {
                    done();
                    res.send(result.rows);
                }
            });
        }
    });
});

router.post('/etl/query/:sqlId/:site', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/v2/etlquery/execute/' + req.params.sqlId + '/' + req.params.site);
    options.body = JSON.stringify(req.body);

    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    res.json(JSON.parse(body));
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
});

var removeData = function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/v2/datasources/staging/removeAndLogout');
    options.body = JSON.stringify(req.body);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
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
    });
};

var queryRef = function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/v2/datasources/staging/group');

    var param = {
        table: req.body.table,
        group: (req.body.group) ? req.body.group : '',
        columns: req.body.columns.split('|'),
        limit: req.body.limit
    };
    options.body = JSON.stringify(param);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {

            if (response.statusCode === 200) {
                try {
                    res.json(parseStagingData(body));
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

var queryResult = function (req, res, next) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/database/queryWithCondition');
    var datasourceName = req.body.datasourceName;
    delete req.body.datasource;
    var param = {
        sql: {
            metadata: 'sql',
            sqlId: req.params.sqlId,
            condition: req.body
        },
        datasource: {
            metadata: "datasource",
            datasourceName: datasourceName
        }

    };
    options.body = JSON.stringify(param);

    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    var jsonObject = JSON.parse(body);
                    res.json(jsonObject.result);
                } catch (err) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, err);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};
router.post('/jdbcloader/query/:sqlId', queryResult);
router.post('/staging/remove', removeData);
router.post('/staging/query-ref', queryRef);


module.exports = router;