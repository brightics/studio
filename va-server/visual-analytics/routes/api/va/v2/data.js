const router = __REQ_express.Router();
const request = __REQ_request;

const multiparty = require('multiparty');
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');


const cb = (res) => (error, response, body) => {
    if (error) {
        return __BRTC_ERROR_HANDLER.sendServerError(res, error);
    }
    if (response.statusCode !== 200) {
        return __BRTC_ERROR_HANDLER
            .sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
    }
    try {
        return res.json(body);
    } catch (ex) {
        return __BRTC_ERROR_HANDLER.sendServerError(res, ex);
    }
};


const _executeInPermission = function (req, res, perm, task) {
    const permHandler = __BRTC_PERM_HELPER.checkPermission(req,
        [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.REPO], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

const convertResultSet = function (resultSet) {
    let temp = JSON.parse(JSON.stringify(resultSet));
    if (temp.data instanceof Object && !(temp.data instanceof Array)) {
        const tempData = JSON.parse(JSON.stringify(resultSet.data));
        // Object.assign
        for (let key in tempData) {
            temp[key] = tempData[key];
        }
    }
    return temp;
};

const parseStagingData = function (body) {
    let arrColIndexes = [];
    let resultSet = convertResultSet(JSON.parse(body));
    resultSet.columns = [];
    for (let c = 0; c < resultSet.schema.length; c++) {
        const name = resultSet.schema[c]['column-name'];
        const type = resultSet.schema[c]['column-type'];
        const convertedType = __BRTC_CORE_SERVER.convertColumnType(type);
        resultSet.columns.push({
            name: name,
            type: convertedType.type,
            internalType: convertedType.internalType,
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
        for (let r in resultSet.data) {
            let row = resultSet.data[r];
            for (let a in arrColIndexes) {
                let idx = arrColIndexes[a];
                if (row[idx].length > 10) {
                    row[idx].splice(10, row[idx].length - 10);
                }
            }
        }
    }
    return resultSet;
};

/**
 * @api {post} /api/va/v2/repo/upload Request file upload
 * @apiGroup Repo
 * @apiName PostUploadFile
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeader {String} column-type Column type.
 * @apiHeader {String} delimiter Delimiter.
 * @apiHeader {String} path Path.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "multipart/form-data",
 *       "Authorization": "Bearer ACCESS_TOKEN",
 *       "column-type": "["String","String","String","String"]",
 *       "delimiter":",",
 *       "path": "/brtc/repo/shared/ALSRecommend.csv",
 *     }
 *
 * @apiParamExample Request-Body-Example:
 * {
 *    Empty Request body
 * }
 *
 * @apiSuccess (Success Response) result Result Message.
 * @apiSuccess (Success Response) resultCode Result Code.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    {
 *        "result":"success to upload file in HDFS or ALLUXIO",
 *        "resultCode":0
 *    }
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
const uploadFile = function (req, res) {
    const form = new multiparty.Form();
    let fields = {};
    form.on('error', function (err) {
        if (err.statusCode === 413) {
            __BRTC_ERROR_HANDLER.sendError(res, 36012);
        } else {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }
    });
    form.on('field', function (name, value) {
        fields[name] = value;
    });
    form.on('part', function (formPart) {
        if (!formPart.filename) return undefined;
        if (__BRTC_CONF['upload-max-size'] && formPart.byteCount >
                Number(__BRTC_CONF['upload-max-size'].replace(/m|M/, '')) * 1024 * 1024) {
            return __BRTC_ERROR_HANDLER.sendError(res, 36012);
        }

        const task = function () {
            const contentType = formPart.headers['content-type'];
            const formData = {
                sourcefile: {
                    value: formPart,
                    options: {
                        filename: formPart.filename,
                        contentType: contentType,
                        knownLength: formPart.byteCount,
                    },
                },
            };
            let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/data/upload');
            __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
            options.headers['Content-Type'] = 'multipart/form-data; charset=UTF-8; boundary="---unloadfileboundrary"';
            if (fields['column-name']) {
                let columnName = fields['column-name'];
                if (columnName.startsWith('[') && columnName.endsWith(']')) {
                    options.headers['column-name'] = encodeURIComponent(JSON.parse(fields['column-name']).join(','));
                } else {
                    options.headers['column-name'] = columnName;
                }
            }
            options.headers['column-type'] = fields['column-type'];
            options.headers.delimiter = encodeURIComponent(fields.delimiter);
            options.headers.path = fields.path;
            options.formData = formData;
            request(options, cb(res));
        };

        if (fields.path.indexOf('../') > -1) {
            return __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
        }

        if (fields.path.indexOf('/shared/upload/') === 0) {
            return _executeInPermission(req, res,
                __BRTC_PERM_HELPER.PERMISSIONS.PERM_REPO_SHARED_CREATE, task);
        } else if (fields.path.indexOf('/' + req.session.userId + '/upload/') === 0) {
            return task();
        }
        return __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    form.parse(req);
};

/**
 * @api {get} /api/va/v2/repo/browse?path={path} Read repository list
 * @apiGroup Repo
 * @apiName GetRepositoryList
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Param) {String} path repository path.
 * @apiParamExample Request-Param-Example:
 *     /api/va/v2/repo/schema?path=/brtc/repo/shared
 *
 * @apiSuccess (Success Response) path path.
 * @apiSuccess (Success Response) size size.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    [
 *        {
 *            "path": "/brtc/repo/shared/gaussianMixture.csv",
 *            "size": "0"
 *        },
 *        {
 *           "path": "/brtc/repo/shared/recommendationOutput",
 *           "size": "0"
 *        },
 *        {
 *           "path": "/brtc/repo/shared/array_test",
 *           "size": "0"
 *        },
 *        {
 *           "path": "/brtc/repo/shared/sample_data",
 *           "size": "0"
 *        },
 *        {
 *           "path": "/brtc/repo/shared/evalTest2.csv",
 *           "size": "0"
 *        }
 *    ]
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
const getBrowser = function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/data/list/upload');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        try {
            const files = JSON.parse(body);
            return res.json(files);
        } catch (ex) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, ex);
        }
    });
};

/**
 * @api {get} /api/va/v2/repo/schema?path={path} Read file schema
 * @apiGroup Repo
 * @apiName GetFileSchema
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Param) {String} path file path.
 * @apiParamExample Request-Param-Example:
 *     /api/va/v2/repo/schema?path=/brtc/repo/shared/iris.csv
 *
 * @apiSuccess (Success Response) name name.
 * @apiSuccess (Success Response) internalType internal type.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    [
 *        {
 *            "name": "SepalLength",
 *            "internalType": "number"
 *        },
 *        {
 *            "name": "SepalWidth",
 *            "internalType": "number"
 *        },
 *        {
 *            "name": "PetalLength",
 *            "internalType": "number"
 *        },
 *        {
 *            "name": "PetalWidth",
 *            "internalType": "number"
 *        },
 *        {
 *            "name": "Species",
 *            "internalType": "string"
 *        }
 *    ]
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */

const getSchema = function (req, res, next) {
    const compile = mf.compile('/api/core/v2/data/schema?key={path}');
    let requestedPath = req.query.key;

    const matched = requestedPath.match(/^\/brtc\/repo\/users\/\$\{sys\.user\}\/[^\/]+$/);
    if (matched) {
        requestedPath = requestedPath.replace(/\/users\/\$\{sys\.user\}\//g, '/users/' + req.session.userId + '/');
    }

    const url = compile({
        path: encodeURIComponent(requestedPath),
    });

    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);

    request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        try {
            return res.json(parseStagingData(body));
        } catch (ex) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, ex);
        }
    });
};

/**
 * @api {post} /api/va/v2/repo/delete Request file delete
 * @apiGroup Repo
 * @apiName PostDeleteFile
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN",
 *     }
 *
 * @apiParam (Request Body) {String} path File Path.
 * @apiParamExample Request-Body-Example:
 * {
 *    path: "/brtc/repo/shared/ALSRecommend.csv"
 * }
 *
 * @apiSuccess (Success Response) result Result Message.
 * @apiSuccess (Success Response) resultCode Result Code.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    {
 *        "result":"success to remove file in HDFS or ALLUXIO",
 *        "resultCode":0
 *    }
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
const deleteFile = function (req, res) {
    const task = function (permissions) {
        let options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/data?key=' + req.body.path);
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        request(options, cb(res));
    };

    if (req.body.path.indexOf('../') > -1) {
        return __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    }

    if (req.body.path.indexOf('/shared/upload/') === 0) {
        return _executeInPermission(req, res,
            __BRTC_PERM_HELPER.PERMISSIONS.PERM_REPO_SHARED_UPDATE, task);
    } else if (req.body.path.indexOf('/' + req.session.userId + '/upload/') === 0) {
        return task();
    }
    return __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
};

/**
 * @api {post} /api/va/v2/repo/move Request file move
 * @apiGroup Repo
 * @apiName PostMoveFile
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN",
 *     }
 *
 * @apiParam (Request Body) {String} source Source file path.
 * @apiParam (Request Body) {String} destination Destination file path.
 * @apiParamExample Request-Body-Example:
 * {
 *    source: "/brtc/repo/shared/ALSRecommend.csv",
 *    destination: "/brtc/repo/shared/ALSRecommend_rename.csv"
 * }
 *
 * @apiSuccess (Success Response) result Result Message.
 * @apiSuccess (Success Response) resultCode Result Code.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    {
 *        "result":"success to move file in HDFS or ALLUXIO",
 *        "resultCode":0
 *    }
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
const moveFile = function (req, res) {
    const task = function (permissions) {
        let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/data/move');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, cb(res));
    };

    if (req.body.source.indexOf('/shared/upload/') === 0) {
        _executeInPermission(req, res,
            __BRTC_PERM_HELPER.PERMISSIONS.PERM_REPO_SHARED_UPDATE, task);
    } else if (req.body.source.indexOf('/' + req.session.userId + '/upload/') === 0) {
        task();
    } else {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    }
};

const copyFile = function (req, res) {
    const task = function (permissions) {
        let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/data/copy');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, cb(res));
    };
    // if (req.body.source.indexOf('/brtc/repo/shared/') == 0) {
    //     _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_REPO_SHARED_UPDATE, task);
    // } else if (req.body.source.indexOf('/brtc/repo/users/' + req.apiUserId + '/') == 0) {
    //     task();
    // } else {
    //     __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    // }
    // task();
    // var _executeInPermission = function (req, res, perm, task) {
    const permHandler = __BRTC_PERM_HELPER.checkPermission(req,
        [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH],
        __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_CREATE);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
    // };
};

/**
 * @api {post} /api/va/v2/repo/download Request file download
 * @apiGroup Repo
 * @apiName PostFileDownload
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Body) {String} delimiter Delimiter.
 * @apiParam (Request Body) {String} remotePath Remote File Path.
 * @apiParamExample Request-Body-Example:
 * {
 *    "delimiter":","
 *    "remotePath": "brtc/repo/shared/ALSRecommend.csv",
 * }
 *
 * @apiSuccess (Success Response) result Result Message.
 * @apiSuccess (Success Response) result code Result Code.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    {
 *        "port":"55174",
 *        "name":"temp_1490867026245"
 *    }
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
const download = function (req, res) {
    const task = function () {
        let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/data/download');
        __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
        options.body = JSON.stringify(req.body);
        request(options, cb(res));
    };

    if (req.body.remotePath.indexOf('../') > -1) {
        return __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    }

    if (req.body.remotePath.indexOf('/shared/upload/') === 0) {
        return _executeInPermission(req, res,
            __BRTC_PERM_HELPER.PERMISSIONS.PERM_REPO_SHARED_READ, task);
    } else if (req.body.remotePath.indexOf('/' + req.session.userId + '/') === 0) {
        return task();
    }
    return __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
};

/**
 * @api {get} /api/va/v2/repo/download/files/{filename}/{port}/{localfilename} Get download file
 * @apiGroup Repo
 * @apiName GetDownloadFile
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Param) {String} filename file name.
 * @apiParam (Request Param) {String} port port.
 * @apiParam (Request Param) {String} localfilename local file name.
 * @apiParamExample Request-Param-Example:
 *     /api/va/v2/repo/download/files/temp_1490867026245/55174/ALSRecommend.csv
 *
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
const downloadFile = function (req, res) {
    const compile = mf.compile('/api/core/v2/data/download?key={key}&delimiter={delimiter}&filename={filename}');

    const key = decodeURIComponent(req.query.key);
    const delimiter = decodeURIComponent(req.query.delimiter);
    const filename = decodeURIComponent(req.query.filename);

    const url = compile({
        key: encodeURIComponent(key),
        delimiter: encodeURIComponent(delimiter),
        filename: encodeURIComponent(filename),
    });
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    res.write(Buffer.from('EFBBBF', 'hex'));
    request(options).pipe(res);
};
/**
 * @api {get} /api/va/v2/repo/head?path={path}&limit={length} Read data
 * @apiGroup Repo
 * @apiName GetData
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Param) {String} path file path.
 * @apiParam (Request Param) {String} path return row.
 * @apiParamExample Request-Param-Example:
 *     /api/va/v2/repo/head?path=/home/brightics/brightics/ALSRecommend.csv/&limit=20
 *
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    user,item,rating
 *    0,12,2
 *    0,21,1
 *    0,31,1
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
const head = function (req, res) {
    const compile = mf.compile('/api/core/v2/data/head?path={path}&limit={length}');
    const url = compile({
        path: req.query.path,
        length: req.query.length,
    });
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, cb(res));
};

/**
 * @api {post} /api/va/v2/repo/import Request file import
 * @apiGroup Repo
 * @apiName PostFileImport
 * @apiVersion 2.0.0

 * @apiHeader {String} content-type Content type.
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer ACCESS_TOKEN"
 *     }
 *
 * @apiParam (Request Body) {String} inputpath Source File Path.
 * @apiParam (Request Body) {String} path Destination File Path.
 * @apiParam (Request Body) {String} columntype Column Type.
 * @apiParam (Request Body) {String} delimiter Delimiter.
 * @apiParamExample Request-Body-Example:
 * {
 *   "inputpath": "/home/brightics/brightics/ALSRecommend.csv",
 *   "path": "/brtc/repo/shared/ALSRecommend.csv",
 *   "columntype": ["Double", "Double", "Double"],
 *   "delimiter": ","
 * }
 *
 * @apiSuccess (Success Response) result Result Message.
 * @apiSuccess (Success Response) result code Result Code.
 * @apiSuccessExample {json} Success-Response-Example:
 *     HTTP/1.1 200 OK
 *    {
 *        "result":"success to upload file in HDFS or ALLUXIO",
 *        "resultCode":0
 *    }
 * @apiError (Error Response 4xx) TBD Invalid request
 * @apiError (Error Response 5xx) TBD Invalid request
 * @apiErrorExample {json} Error-Response-Example:
 *     HTTP/1.1 403 Forbidden
 *    {
 *      TBD
 *    }
 */
const importFile = function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/data/import');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    let obj = {
        inputpath: req.body.inputpath,
        path: req.body.path,
        columntype: req.body.columntype,
        delimiter: req.body.delimiter,
    };
    if (req.body.columnname) obj.columnname = req.body.columnname;
    options.body = JSON.stringify(obj);
    request(options, cb(res));
};

router.get('/staging/query', __BRTC_ERROR_HANDLER.checkParams(['user', 'mid', 'tab', 'offset', 'limit']), function (req, res) {
    const compile = mf.compile('/api/core/v2/data/view/{mid}/{tab}?offset={offset}&limit={limit}');
    const url = compile({
        user: req.query.user,
        mid: req.query.mid,
        tab: req.query.tab,
        offset: req.query.offset,
        limit: req.query.limit,
    });
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.timeout = 30 * 1000;
    request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        try {
            // var markdown = require( "markdown" ).markdown;
            const jsonBody = JSON.parse(body);

            if (jsonBody.type === 'table') return res.json(parseStagingData(body));
            else return res.json(jsonBody.data);
        } catch (err) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }
    });
});

const createLink = function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/data/links');
    const links = req.body.links;
    options.body = JSON.stringify({ links });
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);

    request(options, cb(res));
};

const deleteLink = function (req, res) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/data/links');
    const links = req.body.links;
    options.body = JSON.stringify({ links });
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);

    request(options, cb(res));
};

const getListTable = function (req, res, next) {
    let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/data/list/table');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        try {
            const answer = JSON.parse(body);
            return res.status(200).json(answer);
        } catch (err) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }
    });
};

router.post('/upload', uploadFile);
router.get('/browse', getBrowser);
router.get('/schema', getSchema);
router.get('/list/table', getListTable);
router.get('/head', head);
router.post('/delete', deleteFile);
router.post('/move', moveFile);
router.post('/copy', copyFile);
router.post('/download', download);
router.get('/download/files', downloadFile);
router.post('/import', importFile);

router.post('/link/create', createLink);
router.post('/link/delete', deleteLink);


module.exports = router;
