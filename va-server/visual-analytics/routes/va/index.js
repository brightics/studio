const router = __REQ_express.Router();

const dirsToTags = require('../../lib/dirs-to-tags');

const subPath = __BRTC_CONF['sub-path'] || '';
const subPathUrl = subPath ? ('/' + subPath) : ('');
const baseUrl = __BRTC_CONF['callback-host'] + subPathUrl + '/';

const defaultDocsUrl = __BRTC_CONF['docs-url'] ? __BRTC_CONF['docs-url'] : 'docs.brightics.ai';
const persistMode = __BRTC_CONF['persist-mode'] ? __BRTC_CONF['persist-mode'] : 'storage-mode';
const autonomousAnalytics = __BRTC_CONF['autonomous-analytics'] ? __BRTC_CONF['autonomous-analytics'] : 'allowed';

const log4js = require('log4js');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
    html: true,
}).use(require('markdown-it-ins'));

const RESOURCE_TYPES = [
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AGENT,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.AUTHORIZATION,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.NOTICE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.SCHEDULE,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.USER,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DEPLOY,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.UDF,
    __BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.DATA,
];

const getResourceTypes = () => {
    let list = RESOURCE_TYPES;
    const customPermissionFile = __REQ_path.join(__dirname, '../../permission-conf.json');
    if (!__REQ_fs.existsSync(customPermissionFile)) {
        return list;
    } else {
        const customPermissionsConf = require('../../permission-conf.json');
        for (let i in customPermissionsConf.CUSTOM_PERMISSION_RESOURCE_TYPES) {
            if (list.indexOf(customPermissionsConf.CUSTOM_PERMISSION_RESOURCE_TYPES[i]) === -1) {
                list.push(customPermissionsConf.CUSTOM_PERMISSION_RESOURCE_TYPES[i]);
            }
        }
        return list;
    }
};

router.get('/', (req, res, next) => {
    const userId = req.session.userId;
    const permTask = (permission) => {
        req.session.permissions = permission;

        const permissions = req.session.permissions;

        let dirs = [
            __REQ_path.join(__dirname, '../../public/js/va/addonfunctions'),
            __REQ_path.join(__dirname, '../../public/js/va/customjs'),
        ];

        if (__BRTC_CONF['ui-extension']) {
            dirs = dirs.concat(
                __REQ_path.join(__dirname, '../../public/extension/css'),
                __REQ_path.join(__dirname, '../../public/extension/js')
            );
        }


        const renderIndex = (addons) => {
            const addModelList = __BRTC_CONF.models ? __BRTC_CONF.models : [];
            const title = __BRTC_CONF['meta-db'] && __BRTC_CONF['meta-db'].type === 'sqlite' ? 'Brightics Studio' : 'Brightics AI';
            const useSpark = __BRTC_CONF['use-spark'] === false ? false : true;

            res.render('index', {
                baseUrl: baseUrl,
                userId: userId,
                permissions: permissions,
                addons,
                logLevel: log4js.getLogger('CLIENT').level.levelStr,
                models: addModelList,
                subPath: subPath,
                docsUrl: defaultDocsUrl,
                persistMode: persistMode,
                autonomousAnalytics: autonomousAnalytics,
                useSpark,
                title,
            });
        };

        return dirsToTags(dirs)
            .then(renderIndex)
            .catch((err) => next(err));
    };
    const permHandler = __BRTC_PERM_HELPER.checkPermission(req, getResourceTypes(), null);
    permHandler.on('accept', permTask);
});

router.get('/multichart', (req, res) => {
    const userId = req.session.userId;
    const permissions = req.session.permissions;

    res.render('multichart', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions,
    });
});

router.get('/popupchart', (req, res) => {
    const userId = req.session.userId;
    const permissions = req.session.permissions;

    res.render('popupchart', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions,
    });
});

router.get('/popupmodel', (req, res) => {
    const userId = req.session.userId;
    const permissions = req.session.permissions;

    res.render('popupmodel', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions,
    });
});

router.get('/popupimage', (req, res) => {
    const userId = req.session.userId;
    const permissions = req.session.permissions;

    res.render('popupimage', {
        baseUrl: baseUrl,
        userId: userId, permissions: permissions,
    });
});

router.get('/readme', (req, res) => {
    const readmeStr = __REQ_fs.readFileSync(__REQ_path.join(__dirname, '../../README.md'), 'utf-8');
    res.render('readme', {
        baseUrl: baseUrl,
        content: md.render(readmeStr),
        subPath: subPath,
    });
});

router.get('/readme_backup', (req, res) => {
    const readmeStr = __REQ_fs.readFileSync(__REQ_path.join(__dirname, '../../README_BACKUP.md'), 'utf-8');
    res.render('readme', {
        baseUrl: baseUrl,
        content: md.render(readmeStr),
        subPath: subPath,
    });
});

router.get('/tethys', (req, res, next) => {
    res.render('tethys-demo');
});

router.get('/correlation-chart', (req, res) => {
    res.render('correlation-chart');
});

router.get('/cron-expression', (req, res) => {
    res.render('utils/cron-expression.ejs');
});

router.get('/private-policy', (req, res) => {
    res.render('utils/private-policy.ejs');
});

router.get('/apidoc', (req, res) => {
    res.sendFile(__REQ_path.join(__dirname, '../../apidoc/index.html'));
});

router.get('/detail-popup', (req, res) => {
    res.render('detail-popup');
});

router.get('/pdf', (req, res) => {
    const userId = req.session.userId;
    res.render('export-pdf', {
        baseUrl: baseUrl,
        userId: userId,
        logLevel: log4js.getLogger('CLIENT').level.levelStr,
        subPath: subPath,
    });
});

router.get('/current-tasks', (req, res) => {
    const userId = req.session.userId;
    res.render('current-tasks', {
        baseUrl: baseUrl,
        userId: userId,
        subPath: subPath,
    });
});

module.exports = router;
