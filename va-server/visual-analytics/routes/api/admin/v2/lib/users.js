var router = __REQ_express.Router();
var request = __REQ_request;

var MessageFormat = require('messageformat');
var mf = new MessageFormat('en');

var NodeRSA = require('node-rsa');
var decryptRSA = require('../../../../../lib/rsa').decryptRSA;

var ACC_URL_USER_PREFIX = '/api/account/v2/users';

const reponseHandler = (req, res) => {
    return function (error, response, body) {
        if (error) {
            return res.status(400).json(JSON.parse(body));
        }
        return res.json(JSON.parse(body));
    };
};

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req,
        [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.USER], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var listUsers = function (req, res) {
    var url = ACC_URL_USER_PREFIX;
    if (req.query.pattern) {
        var compile = mf.compile('/api/account/v2/users?search={search}');
        url = compile({
            search: encodeURIComponent(req.query.pattern),
        });
    }
    var options = __BRTC_ACCOUNT_SERVER.createRequestOptions('GET', url);
    __BRTC_ACCOUNT_SERVER.setBearerToken(options, req.accessToken);
    request(options, reponseHandler(req, res));

    // function (error, response, body) {
    // if (error) {
    //     return res.status(400).json(JSON.parse(body));
    // }
    // return res.json(JSON.parse(body));
    // });
};

var getUserById = function (req, res) {
    var options = __BRTC_ACCOUNT_SERVER.createRequestOptions('GET', ACC_URL_USER_PREFIX + '/' + req.params.userId);
    __BRTC_ACCOUNT_SERVER.setBearerToken(options, req.accessToken);
    request(options, reponseHandler(req, res));
    // function (error, response, body) {
    //     if (error) {
    //         return res.status(400).json(JSON.parse(body));
    //     }
    //     return res.json(JSON.parse(body));
    // });
};

var createUser = function (req, res) {
    var task = function (permissions) {
        var rsaOption = __BRTC_ACCOUNT_SERVER.createRequestOptions('GET', '/api/account/v2/rsa/publickey?type=pem', req.accessToken);
        request(rsaOption, function (error, response, body) {
            if (error) {
                return __BRTC_ERROR_HANDLER.sendServerError(res, error);
            }
            if (response.statusCode === 200) {
                var rsaKey = JSON.parse(body);
                var publicKey = new NodeRSA(rsaKey.publicKey, 'pkcs8-public-pem');
                var opt = __BRTC_ACCOUNT_SERVER.createRequestOptions('POST', ACC_URL_USER_PREFIX, req.accessToken);
                opt.form = {
                    id: req.params.userId,
                    password: publicKey.encrypt(decryptRSA(req.body.password, req), 'base64'),
                    name: req.body.name,
                    email: req.body.email,
                    publicKey: rsaKey.publicKey,
                };
                return request(opt, function (error, response, body) {
                    if (error) {
                        __BRTC_ERROR_HANDLER.sendServerError(res, error);
                    } else {
                        if (response.statusCode === 200) {
                            res.json(JSON.parse(body));
                        } else {
                            res.status(response.statusCode).send(response.body);
                        }
                    }
                });
            } else {
                return res.status(response.statusCode).send(response.body);
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_ACCOUNT_CREATE, task);
};

var updateUser = function (req, res) {
    var task = function (permissions) {
        var opt = __BRTC_ACCOUNT_SERVER.createRequestOptions('POST', ACC_URL_USER_PREFIX + '/' + req.params.userId + '/update', req.accessToken);
        opt.form = {
            id: req.params.userId,
            name: req.body.name,
            email: req.body.email,
        };
        request(opt, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode === 200) {
                    res.json(JSON.parse(body));
                } else {
                    res.status(response.statusCode).send(response.body);
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_ACCOUNT_UPDATE, task);
};

var deleteUser = function (req, res) {
    var task = function (permissions) {
        var opt = __BRTC_ACCOUNT_SERVER.createRequestOptions('POST', ACC_URL_USER_PREFIX + '/' + req.params.userId + '/delete', req.accessToken);
        opt.form = {
            id: req.params.userId,
        };
        request(opt, function (error, response, body) {
            if (error) {
                __BRTC_ERROR_HANDLER.sendServerError(res, error);
            } else {
                if (response.statusCode === 200) {
                    res.json(JSON.parse(body));
                } else {
                    res.status(response.statusCode).send(response.body);
                }
            }
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_ACCOUNT_DELETE, task);
};

var getRsaPublicKeyFromAccountServer = function (req, res, next) {
    var rsaOption = __BRTC_ACCOUNT_SERVER.createRequestOptions('GET', '/api/account/v2/rsa/publickey?type=pem', req.accessToken);
    request(rsaOption, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                var rsaKey = JSON.parse(body);
                res.json(rsaKey);
            } else {
                res.status(response.statusCode).send(response.body);
            }
        }
    });
};

router.get('/users', listUsers);
router.get('/users/:userId', getUserById);
router.post('/users/:userId', createUser);
router.post('/users/:userId/update', updateUser);
router.post('/users/:userId/delete', deleteUser);
router.get('/rsa/publickey', getRsaPublicKeyFromAccountServer);

module.exports = router;
