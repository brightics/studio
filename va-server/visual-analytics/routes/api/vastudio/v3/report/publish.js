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

var parseStagingData = function (body) {
    var arrColIndexes = [];
    var resultSet = JSON.parse(body);
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
    options.body = JSON.stringify(req.body);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                res.send(body);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
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
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
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
        useSpark: '' + (!!__BRTC_CONF['use-spark'])
    });
});

var readPublishReport = function (req, res) {
    var task = function (permissions) {
        var opt = {
            publish_id: req.params.publishId,
            url: req.params.publishId
        };

        var title = req.query.title;

        __BRTC_DAO.publishreport.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            try {
                if (result.length == 0) {
                    __BRTC_DAO.publishreport.selectByUrl(opt, function (err) {
                    }, function (urlResult) {
                        var publishReport = urlResult[0];
                        var reportContent = JSON.parse(publishReport.publishing_contents);
                        reportContent.publishId = publishReport.publish_id;

                        if (reportContent.contents && reportContent.contents.functions) {
                            var functions = reportContent.contents.functions;
                            for (var i = 0; i < functions.length; i++) {
                                delete functions[i].display.label;
                            }
                        }

                        var result = {
                            reportContent: reportContent,
                            userId: publishReport.publisher
                        };
                        res.json(result);
                    })
                } else {
                    var publishReport = result[0];
                    var reportContent = JSON.parse(publishReport.publishing_contents);
                    reportContent.publishId = publishReport.publish_id;

                    if (reportContent.contents && reportContent.contents.functions) {
                        var functions = reportContent.contents.functions;
                        for (var i = 0; i < functions.length; i++) {
                            delete functions[i].display.label;
                        }
                    }

                    var result = {
                        reportContent: reportContent,
                        userId: publishReport.publisher
                    };
                    res.json(result);
                }
            } catch (e) {
                return res.render('notexistreport', {title: title, baseUrl: baseUrl});
            }
        });
    };

    if (__BRTC_CONF['publish-auth']) {
        _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_READ, task);
    } else {
        task();
    }
};

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
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
            }
        }
    });
});

var knoxPublishAuth = function (req, res, next) {
    var parseResponse = function (response) {
        return response.body;
    };

    var checkPermission = (data, res) => {
        var pr = new Promise((resolve, reject) => {
                const check = (httpResponse, body) => {
                return parseInt(body.returnCode) === 200;
            };

            if (!data) return reject();

            var user_email = data[1];
            var empid = data[2];
            var companyId = data[3];
            var deptcd = data[4];
            var publish_url = url.parse(req.headers.referer).path;

            var reqParam = {
                user_email: user_email,
                companyId: companyId,
                empid: empid,
                deptcd: deptcd,
                publish_url: publish_url
            };

            var authUrl = conf['uri-knox-auth-api'];
            // if (!url) reject(t'"uri-knox-auth-api" is not specified.');
            if (!authUrl) return resolve();
            request.post(
                {
                    method: 'POST',
                    url: authUrl,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    json: reqParam
                },
                function (err, httpResponse) {
                    var body = parseResponse(httpResponse);
                    if (err) return reject(err);
                    if (check(httpResponse, body)) return resolve(body);
                    return reject();
                }
            );
        });
        return pr;
    };

    var knoxConfKey = 'publish-knox';
    var knoxRequired = typeof conf[knoxConfKey] !== 'undefined' ? !!conf[knoxConfKey] : false;
    if (!knoxRequired) return next();

    var totaldata = req.body.totaldata;
    // FIXME: remoteAddress를 못가져오는듯
    var remoteAddress = req._remoteAddress ? req._remoteAddress.split(':')[3] : '127.0.0.1';

    var sso = require('../../lib/sso-decrypt');
    var data = sso.decrypt(totaldata, remoteAddress);
    checkPermission(data, req)
        .then(() => next())
    .catch(() => next('Permission Denied'));
};

router.post('/:publishId', knoxPublishAuth, readPublishReport);

module.exports = router;