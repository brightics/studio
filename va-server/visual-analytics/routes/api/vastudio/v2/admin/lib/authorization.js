var router = __REQ_express.Router();
var request = __REQ_request;

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AUTHORIZATION], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var listRole = function (req, res, nex) {
    var task = function (permissions) {
        var opt = {};
        if (req.query.userId || req.query.roleLabel) {
            if (req.query.userId) {
                opt['user_id'] = req.query.userId;
            }
            if (req.query.roleLabel) {
                opt['role_label'] = req.query.roleLabel;
            }
            __BRTC_DAO.role.selectByConditionExtrict(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                res.json(result);
            });
        } else {
            __BRTC_DAO.role.selectAllExtrict(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                res.json(result);
            });
        }
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AUTHORIZATION_READ, task);

};

var createRole = function (req, res, nex) {
    var task = function (permissions) {
        var roleInfo = req.body;
        var opt = {
            user_id: roleInfo.user_id,
            resource_type: roleInfo.resource_type,
            resource_id: roleInfo.resource_id,
            role_id: roleInfo.role_id
        };
        __BRTC_DAO.user.resource.role.create(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function () {
            res.sendStatus(200);
        })
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AUTHORIZATION_CREATE, task);
};

var updateRole = function (req, res, nex) {
    var task = function (permissions) {
        var roleInfo = req.body;
        var role_id = roleInfo.roleId;
        var opt = {
            role_id: role_id,
            role_category: roleInfo.roleCategory,
            role_label: roleInfo.roleLabel,
            description: roleInfo.roleDescription,
            roleIdList: [role_id]
        };
        __BRTC_DAO.user.resource.role.deleteByRoleIdList(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function () {
            var opt = {
                role_id: role_id,
                userIdList: roleInfo.userIdList
            };
            __BRTC_DAO.user.resource.role.createByUserIdList(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                res.sendStatus(200);
            });
        })
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AUTHORIZATION_UPDATE, task);
};

var deleteRole = function (req, res, nex) {
    var task = function (permissions) {
        var opt = {
            user_id: req.params.roleId
        };
        __BRTC_DAO.user.resource.role.deleteByUserId(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function () {
            res.sendStatus(200);
        })
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AUTHORIZATION_DELETE, task);
};

var listPermission = function (req, res, nex) {
    var task = function (permissions) {
        var opt = {};
        __BRTC_DAO.permission.selectAll(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AUTHORIZATION_READ, task);
};
var listPermissionResourceTypeByUserId = function (req, res, nex) {
    var opt = {'user_id': req.params.userId};
    __BRTC_DAO.permission.selectPermissionResourceTypeByUserId(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        res.json(result);
    });
};
var listUserByRole = function (req, res, nex) {
    var opt = {
        'role_id': req.params.roleId,
    };
    __BRTC_DAO.user.resource.role.selectUserByRoleId(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        var options = __BRTC_ACCOUNT_SERVER.createRequestOptions('GET', '/api/account/v2/users');
        __BRTC_ACCOUNT_SERVER.setBearerToken(options, req.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                return res.status(400).json(JSON.parse(body));
            }

            var userByRoleId =  result.map(x => Object.assign(x, JSON.parse(body).find(y => y.id === x.user_id)));
            return res.json(userByRoleId);
        });
    });
};
var listPermissionByRole = function (req, res, nex) {
    var task = function (permissions) {
        var opt = {'role_id': req.params.roleId};
        __BRTC_DAO.user.resource.role.selectPermissionByRoleId(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AUTHORIZATION_READ, task);
};

/**Roll 목록 조회**/
router.get('/authorization/roles', listRole);
/**Roll Create**/
router.post('/authorization/roles', createRole);
/**Roll Update**/
router.post('/authorization/roles/:roleId/update', updateRole);
/**Roll Delete**/
router.post('/authorization/roles/:roleId/delete', deleteRole);
/**Roll 목록 조회**/
router.get('/authorization/roles/:roleId/users', listUserByRole);
/**Roll permission 목록 조회**/
router.get('/authorization/roles/:roleId/permissions', listPermissionByRole);
/**User Permission 조회**/
router.get('/authorization/:userId/resourcetype', listPermissionResourceTypeByUserId);
module.exports = router;