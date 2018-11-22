var router = __REQ_express.Router();
var request = __REQ_request;

/* Sample Addon Function
insert into "public"."brtc_addon_function"
(id, label, version, type,
contents,
script_id, description, resource_id,
creator, create_time, updater, update_time) values
('test00001', 'UDF Test No1', '0.1', 'UDF',
'{"category":"io","func":"scalascript","operation":"scalascript","label":"UDF","description":"UDFDescription","tags":["scala UDF Tag","script Tag"],"inrange":{"min":"1","max":"1"},"outrange":{"min":"1","max":"1"},"params":[{"id":"param_id1","label":"Label1","mandatory":"true","control":"ColumnSelector","type":"","placeHolder":"","empty":false,"multiple":true,"rowCount":"3","columnType":["Integer","Long","Double"],"items":[{"label":"","value":"","default":false}]},{"id":"param_id2","label":"Label2","mandatory":"false","control":"InputBox","type":"","placeHolder":"param 2","empty":false,"multiple":false,"rowCount":"","columnType":[],"items":[{"label":"","value":"","default":false}]},{"id":"param_id3","label":"Label3","mandatory":"","control":"DropDownList","type":"","placeHolder":"","empty":false,"multiple":false,"rowCount":"","columnType":[],"items":[{"label":"List Item1","value":"list_value1","default":false},{"label":"List item2","value":"list_value2","default":false}]},{"id":"param_id4","label":"Label4","mandatory":"","control":"RadioButton","type":"","placeHolder":"","empty":false,"multiple":false,"rowCount":"","columnType":[],"items":[{"label":"Radio1","value":"radio_val1","default":true},{"label":"Radio2","value":"radio_val2","default":false}]},{"id":"param_id5","label":"Label5","mandatory":"","control":"CheckBox","type":"","placeHolder":"","empty":true,"multiple":false,"rowCount":"","columnType":[],"items":[{"label":"Check1","value":"check1","default":true},{"label":"Check2","value":"check2","default":false}]}]}',
'sctript 0001', '테스트용 디스크립션입니다.', null,
'ng1123.kim@samsung.com', now(), null, null)
 */
var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.UDF], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var listFunction = function (req, res) {
    var opt = {};
    __BRTC_DAO.addon_function.selectAll(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        var returnValues = [];
        if (result.length > 0) {
            for (var i in result) {
                returnValues.push(result[i]);
            }
        }
        res.json(returnValues);
    });
};

var listFunctionMe = function (req, res) {
    var opt = {};
    __BRTC_DAO.addon_function.selectAll(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        var returnValues = [];
        if (result.length > 0) {
            for (var i in result) {
                if (req.apiUserId.indexOf(result[i].creator) > -1) {
                    returnValues.push(result[i]);
                }
            }
        }
        res.json(returnValues);
    });
};


var createFunction = function (req, res) {
    var task = function (permissions) {
        var toolSpec = req.body;
        var specJson = toolSpec.specJson || {};
        var userId = req.apiUserId;

        if (!toolSpec.id || !specJson.label || !specJson.context || !specJson.scriptId) return __BRTC_ERROR_HANDLER.sendError(res, '10103');

        var specOpt = {
            id: toolSpec.id,
            label: specJson.label,
            type: specJson.context,
            contents: specJson,
            markdown: toolSpec.md || '',
            scriptId: specJson.scriptId,
            description: specJson.description,
            userId: userId
        };

        __BRTC_DAO.addon_function.create(specOpt, function (err) {
            if (err.error.indexOf('duplicate key ') == 0) {
                __BRTC_ERROR_HANDLER.sendError(res, 10101);
            } else {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }
        }, function (result) {
            var options = __BRTC_CORE_SERVER.createRequestOptions('POST', '/api/core/v2/entity/script');
            __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);

            var script = toolSpec.script;

            var scriptOption = {
                "scriptId": specJson.scriptId,
                "context": script.type,
                "label": specJson.label,
                "script": script.content
            };
            options.body = JSON.stringify(scriptOption);

            request(options, function (error, response, body) {
                if (error) {
                    __BRTC_DAO.addon_function.deleteById({id: specJson.id});
                    __BRTC_ERROR_HANDLER.sendServerError(res, error);
                } else {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        res.send(200);
                    } else {
                        __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
                    }
                }
            });
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_UDF_CREATE, task);
};

var deleteFunction = function (req, res) {
    var task = function (permissions) {

        var opt = {};
        opt.id = req.params.functionId;
        __BRTC_DAO.addon_function.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            if (result.length > 0) {

                var scriptId = result[0]['script_id'];

                var options = __BRTC_CORE_SERVER.createRequestOptions('DELETE', '/api/core/v2/entity/script/' + scriptId);
                __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
                request(options, function (error, response, body) {
                    if (error) {
                        __BRTC_ERROR_HANDLER.sendServerError(res, error);
                    } else {
                        __BRTC_DAO.addon_function.deleteById(opt, function (err) {
                            __BRTC_ERROR_HANDLER.sendServerError(res, err);
                        }, function (result) {
                            res.sendStatus(200);
                        });
                        if (response.statusCode == 200 || response.statusCode == 204) {
                        } else {
                            __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
                        }
                    }
                });

            } else {
                __BRTC_ERROR_HANDLER.sendError(res, 10102);
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_UDF_DELETE, task);
};

var getFunctionById = function (req, res) {
    var opt = {
        id: req.params.functionId
    };
    __BRTC_DAO.addon_function.selectById(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        if (!result || result.length === 0) {
            __BRTC_ERROR_HANDLER.sendError(res, 10102);
        } else {
            res.send(result);
        }
    });
};

router.get('/udfs', listFunction);
router.get('/udfs/me', listFunctionMe);
router.get('/udfs/:functionId', getFunctionById);
router.post('/udfs', createFunction);
router.delete('/udfs/:functionId', deleteFunction);

module.exports = router;