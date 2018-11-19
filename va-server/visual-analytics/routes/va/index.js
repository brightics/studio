var router = __REQ_express.Router();
var request = __REQ_request;

var ip = require('ip');

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');
var baseUrl = __BRTC_CONF['callback-host'] + subPathUrl + '/';

var defaultDocsUrl = __BRTC_CONF['docs-url'] ? __BRTC_CONF['docs-url'] : 'docs.brightics.ai';
var persistMode = __BRTC_CONF['persist-mode'] ? __BRTC_CONF['persist-mode'] : 'storage-mode';
var autonomousAnalytics = __BRTC_CONF['autonomous-analytics'] ? __BRTC_CONF['autonomous-analytics'] : 'allowed';

var log4js = require('log4js');
var log = log4js.getLogger('INDEX');

var MarkdownIt = require('markdown-it');
var md = new MarkdownIt({
    html: true
}).use(require('markdown-it-ins'));

var RESOURCE_TYPES = [
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AGENT,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AUTHORIZATION,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.NOTICE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.SCHEDULE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.USER,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DEPLOY,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.UDF,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DATA
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

router.get('/', function (req, res, next) {
    var userId = req.session.userId;
    var permTask = function (permission) {
        req.session.permissions = permission;

        var permissions = req.session.permissions;

        var promises = [];
        var addons = [];
        var dirs = [
            __REQ_path.join(__dirname, '../../public/js/va/addonfunctions'),
            __REQ_path.join(__dirname, '../../public/js/va/customjs')
        ];

        if (__BRTC_CONF['ui-extension']) {
            dirs.push(__REQ_path.join(__dirname, '../../public/extension/css'));
            dirs.push(__REQ_path.join(__dirname, '../../public/extension/js'));
        }

        for (var i in dirs) {
            if (__REQ_fs.existsSync(dirs[i])) {
                (function (_path) {
                    promises.push(new Promise(function (resolve, reject) {
                        __REQ_fs.readdir(_path, function (err, files) {
                            if (err) {
                                reject(Error(err.message));
                            } else {
                                files.forEach(function (file) {
                                    var srcDir = _path.substring(_path.lastIndexOf('public/') + 7, _path.length);
                                    var line;
                                    if (file.endsWith('.js')) {
                                        line = '    <script src="' + srcDir + '/' + file + '"></script>';
                                    } else if (file.endsWith('.css')) {
                                        line = '    <link type="text/css" rel="stylesheet" href="' + srcDir + '/' + file + '"/>'
                                    }
                                    if (line) addons.push(line);
                                });
                                resolve('SUCCESS: ' + _path);
                            }
                        });
                    }));
                })(dirs[i].replace(/\\/gi, '/'));
            } else {
                __REQ_fs.mkdirSync(dirs[i]);
            }
        }

        Promise.all(promises).then(function () {
            var addModelList = (__BRTC_CONF['models']) ? __BRTC_CONF['models'] : [];

            res.render('index', {
                baseUrl: baseUrl,
                userId: userId,
                permissions: permissions,
                addons: addons.join('\n'),
                logLevel: log4js.getLogger('CLIENT').level.levelStr,
                models: addModelList,
                subPath: subPath,
                docsUrl: defaultDocsUrl,
                persistMode: persistMode,
                autonomousAnalytics: autonomousAnalytics,
                useSpark: (__BRTC_CONF['use-spark'] === false) ? (false) : (true),
                title: (__BRTC_CONF['meta-db'] && __BRTC_CONF['meta-db'].type === 'sqlite') ? 'Brightics Studio' : 'Brightics AI'
            });
        }, function (error) {
            next(error);
        });
    };
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, getResourceTypes(), null);
    permHandler.on('accept', permTask);
});

router.get('/multichart', function (req, res) {
    var userId = req.session.userId;
    var permissions = req.session.permissions;

    res.render('multichart', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions
    });
});

router.get('/popupchart', function (req, res) {
    var userId = req.session.userId;
    var permissions = req.session.permissions;

    res.render('popupchart', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions
    });
});

router.get('/popupmodel', function (req, res) {
    var userId = req.session.userId;
    var permissions = req.session.permissions;

    res.render('popupmodel', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions
    });
});

router.get('/popupimage', function (req, res) {
    var userId = req.session.userId;
    var permissions = req.session.permissions;

    res.render('popupimage', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions
    });
});

router.get('/readme', function (req, res) {
    var readmeStr = __REQ_fs.readFileSync(__REQ_path.join(__dirname, '../../README.md'), 'utf-8');
    res.render('readme', {
        baseUrl: baseUrl,
        content: md.render(readmeStr),
        subPath: subPath
    });
});

router.get('/readme_backup', function (req, res) {
    var readmeStr = __REQ_fs.readFileSync(__REQ_path.join(__dirname, '../../README_BACKUP.md'), 'utf-8');
    res.render('readme', {
        baseUrl: baseUrl,
        content: md.render(readmeStr),
        subPath: subPath
    });
});

router.get('/tethys', function (req, res, next) {
    res.render('tethys-demo');
});

router.get('/correlation-chart', function (req, res) {
    res.render('correlation-chart');
});

router.get('/cron-expression', function (req, res) {
    res.render('utils/cron-expression.ejs');
});

router.get('/private-policy', function (req, res) {
    res.render('utils/private-policy.ejs');
});

router.get('/apidoc', function (req, res) {
    res.sendFile(__REQ_path.join(__dirname, '../../apidoc/index.html'));
});

router.get('/detail-popup', function (req, res) {
    res.render('detail-popup');
});

router.get('/pdf', function (req, res) {
    var userId = req.session.userId;
    res.render('export-pdf', {
        baseUrl: baseUrl,
        userId: userId,
        logLevel: log4js.getLogger('CLIENT').level.levelStr,
        subPath: subPath
    });
});

router.get('/current-tasks', function (req, res) {
    var userId = req.session.userId;
    res.render('current-tasks', {
        baseUrl: baseUrl,
        userId: userId,
        subPath: subPath
    });
});

module.exports = router;
