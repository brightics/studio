var router = __REQ_express.Router();

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');
var baseUrl = __BRTC_CONF['callback-host'] + subPathUrl + '/';
var dirsToTags = require('../../lib/dirs-to-tags');

var RESOURCE_TYPES = [
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AGENT,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AUTHORIZATION,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.NOTICE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.SCHEDULE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.USER,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DEPLOY,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.MONITORING,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DATASOURCE
];

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, RESOURCE_TYPES, perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        res.redirect(req.originalUrl.substring(0, req.originalUrl.lastIndexOf('/')));
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

router.get('/', function (req, res) {
    res.redirect(req.originalUrl + '/user');
});

router.get('/user', function (req, res) {
    var task = function (permissions) {
        res.render('admin/user', {
            userId: req.session.userId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, null, task);
});

router.get('/notice', function (req, res) {
    var task = function (permissions) {
        res.render('admin/notice', {
            userId: req.session.userId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_NOTICE_READ, task);
});

router.get('/schedule', function (req, res, next) {
    var task = function (permissions) {
        var dirs = [
            __REQ_path.join(__dirname, '../../public/js/va/addonfunctions'),
            __REQ_path.join(__dirname, '../../public/js/va/customjs')
        ];

        if (__BRTC_CONF['ui-extension']) {
            dirs.push(__REQ_path.join(__dirname, '../../public/extension/css'));
            dirs.push(__REQ_path.join(__dirname, '../../public/extension/js'));
        }

        dirsToTags(dirs)
            .then(function (addons) {
                res.render('admin/schedule', {
                    userId: req.session.userId,
                    permissions: permissions,
                    addon_js: addons,
                    baseUrl: baseUrl,
                });
            }, function (error) {
                next(error);
            });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_SCHEDULE_READ, task);
});

router.get('/schedule/report', function (req, res) {
    res.render('admin/report', {
        userId: req.session.userId,
        scheduleId: req.query.scheduleId,
        taskId: req.query.task,
        baseUrl: baseUrl
    });
});

router.get('/agent', function (req, res) {
    var task = function (permissions) {
        res.render('admin/agent', {
            userId: req.session.userId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AGENT_READ, task);
});

router.get('/authorization', function (req, res) {
    var task = function (permissions) {
        res.render('admin/authorization', {
            userId: req.session.userId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_AUTHORIZATION_READ, task);
});


router.get('/deploy', function (req, res) {
    var task = function (permissions) {
        res.render('admin/deploy', {
            userId: req.session.userId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DEPLOY_READ, task);
});

router.get('/publish', function (req, res) {
    var task = function (permissions) {
        res.render('admin/publish', {
            userId: req.session.userId,
            permissions: permissions,
            baseUrl: baseUrl,
            subPath: subPath
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_READ, task);
});

router.get('/job-monitoring', function (req, res) {
    var task = function (permissions) {
        res.render('admin/monitor-job', {
            userId: req.apiUserId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_MONITORING_READ, task);
});

router.get('/resource-monitoring', function (req, res) {
    var task = function (permissions) {
        res.render('admin/monitor-resource', {
            userId: req.apiUserId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_MONITORING_READ, task);
});

router.get('/datasource', function (req, res) {
    var task = function (permissions) {
        res.render('admin/datasource', {
            userId: req.session.userId,
            permissions: permissions,
            baseUrl: baseUrl
        });
    };
    _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_DATASOURCE_READ, task);
});


module.exports = router;