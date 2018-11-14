var router = __REQ_express.Router();
var request = __REQ_request;

var MessageFormat = require('messageformat');
var mf = new MessageFormat('en');

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');
var baseUrl = __BRTC_CONF['callback-host'] + subPathUrl + '/';

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var convertResultSet = function (resultSet) {
    var temp = JSON.parse(JSON.stringify(resultSet));
    if (temp.data instanceof Object && !(temp.data instanceof Array) ) {
        var tempData = JSON.parse(JSON.stringify(resultSet.data));
        // Object.assign
        for(var key in tempData) {
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
        if (convertedType.type == 'byte[]') {
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

router.post('/jobs', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/v2/analytics/jobs/' + req.body.jid);
    // __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
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
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/v2/analytics/jobs/' + req.params.jid);
    // __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
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

router.get('/:publishId', function (req, res) {
    return res.render('publish', {
        userId: req.query.userId,
        publishId: req.params.publishId,
        url: '',
        baseUrl: baseUrl,
        isCustom: false,
        knox: !!__BRTC_CONF['publish-knox'],
        useSpark: '' + !!(typeof __BRTC_CONF['use-spark'] === 'undefined' ? true : __BRTC_CONF['use-spark'])
    });
});

router.get('/staging/query', __BRTC_ERROR_HANDLER.checkParams(['user', 'mid', 'tab', 'offset', 'limit']), function (req, res) {
    var compile = mf.compile('/api/core/v2/data?key={key}&offset={offset}&limit={limit}');
    var url = compile({
        user: req.query.user,
        key: '/' + req.query.user + '/' + req.query.mid + '/' + req.query.tab,
        mid: req.query.mid,
        tab: req.query.tab,
        offset: req.query.offset,
        limit: req.query.limit
    });
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    if (req.accessToken && req.accessToken === __BRTC_ARGS.access_token) {
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    }
    options.timeout = 30 * 1000;
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
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

module.exports = router;