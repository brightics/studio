var router = __REQ_express.Router();
var request = __REQ_request;

var passport = require('passport');

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');

var authenticateRouter = __BRTC_AUTH_HELPER.routers;
var ensureLoggedIn = __BRTC_AUTH_HELPER.ensureLoggedIn;

var log4js = require('log4js');
var log = log4js.getLogger('INDEX');

var extend = require('extend');

var RESOURCE_TYPES = [
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AGENT,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AUTHORIZATION,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.NOTICE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.SCHEDULE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.USER,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DEPLOY,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.UDF
];

var getResourceTypes = function () {
    var list = RESOURCE_TYPES;
    var customPermissionFile = __REQ_path.join(__dirname, '../../permission-conf.json');
    if (!__REQ_fs.existsSync(customPermissionFile)) {
        return list;
    } else {
        var customPermissionsConf = require('../../permission-conf.json');
        for (var i in customPermissionsConf['CUSTOM_PERMISSION_RESOURCE_TYPES']) {
            if (list.indexOf(customPermissionsConf['CUSTOM_PERMISSION_RESOURCE_TYPES'][i]) == -1)
                list.push(customPermissionsConf['CUSTOM_PERMISSION_RESOURCE_TYPES'][i]);
        }
        return list;
    }
};

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, getResourceTypes(), perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        res.redirect(req.originalUrl.substring(0, req.originalUrl.lastIndexOf('/')));
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

router.get('/auth/:user/logout', ensureLoggedIn, authenticateRouter.signOut);
router.get('/profile', ensureLoggedIn, authenticateRouter.profileSettings);

router.get('/auth/brightics-user', authenticateRouter.authenticate); // account server로 redirect
router.get('/auth/brightics-user/callback', authenticateRouter.authenticateCallback); // authorization code를 받아온 후, access token 획득
router.get('/auth/brightics-user/callback', function (req, res) { // token 받아온 후 동작하는 로직
    var userId = req.user.id;
    try {
        var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/v2/agentUser/attach/' + userId);
        __BRTC_CORE_SERVER.setBearerToken(options, req.user.accessToken);
        request(options, function (error, response, body) {
            if (error) {
                log.error('Failed to attach agent for ' + userId + ': ' + error);
            } else {
                if (response.statusCode == 200) {
                    log.trace('Success to attach agent for ' + userId);
                } else {
                    log.error('Failed to attach agent for ' + userId + ': ' + body);
                }
            }
        });
    } catch (ex) {
        log.error('Failed to attach agent for ' + userId + ': ' + ex);
    }
    req.session.loggedIn = true;
    req.session.userId = userId;
    req.session.access_token = req.user.accessToken;
    req.session.token_type = 'Bearer';
    var redirect = req.query.redirect || '/';
    res.redirect(redirect);
});

module.exports = router;
