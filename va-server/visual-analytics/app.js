'use strict';
require('dotenv').config();

global.__basedir = __dirname;
global.__BRTC_ARGS = {
    user_id: 'brightics@samsung.com',
    access_token: 'ACCESS_TOKEN',
};
global.__REQ_fs = require('fs');
global.__REQ_path = require('path');
global.__REQ_request = require('request');
global.__REQ_express = require('express');


global.__BRTC_CONF = require('./va-conf');
global.__BRTC_AUTH_CONF = require('./auth-conf.json');
global.__BRTC_API_SERVER = require('./lib/api-server-opensource');
global.__BRTC_CORE_SERVER = require('./lib/core-server');
global.__BRTC_ACCOUNT_SERVER = require('./lib/account-server');
global.__BRTC_AUTH_HELPER = require('./lib/authenticate-helper-opensource');
global.__BRTC_PERM_HELPER = require('./lib/perm-helper-opensource');
global.__BRTC_TOKEN_VALIDATOR = require('./lib/token-validator-opensource');
global.__BRTC_ERROR_HANDLER = require('./lib/error-handler');
global.__BRTC_TOOLS_IDGENERATOR = require('./lib/tools/idgenerator');
global.__BRTC_TOOLS_SANITIZE_HTML = require('./lib/tools/sanitize-html');

// VASTUDIO
var vastudio = __BRTC_API_SERVER.getVaStudio();
global.__BRTC_DAO = vastudio.dao;


var session = require('express-session');
var favicon = require('serve-favicon');
var ip = require('ip');

var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var compression = require('compression');

var log4js = require('log4js');
var logConfiguration = require('./log4js.json');
var logDir = __BRTC_CONF['log-dir'] || './logs';
if (!__REQ_fs.existsSync(logDir)) {
    __REQ_fs.mkdirSync(logDir);
}
var logAppenders = logConfiguration.appenders;
for (var appender in logAppenders) {
    if (logAppenders.hasOwnProperty(appender)) {
        var filename = logAppenders[appender].filename;
        if (filename) {
            logAppenders[appender].filename =
                __REQ_path.join(logDir, logAppenders[appender].filename);
        }
    }
}
log4js.configure(logConfiguration);
var log = log4js.getLogger('APP');

var router = __REQ_express.Router();

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');

var sessionTimeout = (typeof __BRTC_CONF['session-timeout'] === 'string') ? (parseInt(sessionTimeout)) : (sessionTimeout);
sessionTimeout = sessionTimeout !== null ? sessionTimeout || (30 * 60 * 1000) : sessionTimeout;

__BRTC_CORE_SERVER.env({ 'URI': __BRTC_CONF['uri-core-server'] });
__BRTC_API_SERVER.env({ 'URI': __BRTC_CONF['uri-api-server'] });
__BRTC_ACCOUNT_SERVER.env({ 'URI': __BRTC_CONF['account-server'] });

var ensureLoggedIn = __BRTC_AUTH_HELPER.ensureLoggedIn;
var validateToken = __BRTC_TOKEN_VALIDATOR.validateToken;

var app = __REQ_express();
app.set('env', __BRTC_CONF.env);
app.set('views', __REQ_path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('*/favicon.ico', favicon(__REQ_path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression());

// log4js
app.use(log4js.connectLogger(log4js.getLogger('HTTP'), {
    level: 'auto',
    format: function (req, res, defaultReplace) {
        var format = (req.user) ?
            ('[:remote-addr][:user-id][:status][:response-time ms] :method :url') :
            ('[:remote-addr][:status][:response-time ms] :method :url');
        format = defaultReplace(format);
        if (req.user) {
            format = format.replace(':user-id', req.user.id);
        }
        return format;
    },
    nolog: '(\\.(gif|jpe?g|png)$)|/api/va/log4js',
}));

// setup parser
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// module static path

app.use('/', __REQ_express.static(__REQ_path.join(__dirname, 'public')));
app.use(__REQ_express.static(__REQ_path.join(__dirname, 'public')));

app.use('*/js/plugins/echarts', __REQ_express.static(__dirname + '/node_modules/echarts/dist/'));
app.use('*/js/plugins/echarts-stat', __REQ_express.static(__dirname + '/node_modules/echarts-stat/dist/'));

app.use('*/js/plugins/d3', __REQ_express.static(__dirname + '/node_modules/d3/build/'));
app.use('*/js/plugins/d3-tip', __REQ_express.static(__dirname + '/node_modules/d3-tip/'));

app.use('*/js/plugins/babel-polyfill', __REQ_express.static(__dirname + '/node_modules/babel-polyfill/dist/'));
app.use('*/js/plugins/css.escape', __REQ_express.static(__dirname + '/node_modules/css.escape/'));

app.use('*/js/va', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/js/va/'));
app.use('*/js/admin', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/js/admin/'));
app.use('*/js/tools', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/js/tools/'));
app.use('*/js/plugins', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/js/plugins/'));

app.use('*/css', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/css/'));
app.use('*/font-awesome', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/font-awesome/'));
app.use('*/toolkit/static', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/static/toolkit'));

app.use(session({
    cookie: {
        httpOnly: false,
        maxAge: null,
        secure: false,
    },
    name: 'brightics.va.sid' + subPathUrl,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret: 'dis.av.scithgirb',
    unset: 'destroy',
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(__BRTC_AUTH_HELPER.devOption);

// Login 없이 접근 가능한 url
router.use('/publish', validateToken, require('./routes/report/publish'));
router.use('/publish', vastudio.routes.report.publish);
router.use('/', require('./routes/va/auth'));
router.use('/api/va/v2/rsa', require('./routes/api/va/v2/rsa'));
router.use('/api/va/v2/map', require('./routes/api/va/v2/map'));

router.use('/api/vastudio/v3', validateToken, vastudio.routes.v3);

// Publish Reports
router.use('/publishreports/ip', validateToken, require('./routes/report/publishreports').ip);
router.use('/publishreports/embed-code', validateToken, require('./routes/report/publishreports').embed);

router.use('/publishreports', validateToken, vastudio.routes.report.publishreports);

// V2 API
router.use('/api/va/v2/studio', validateToken, require('./routes/api/va/v2/studio'));
router.use('/api/va/v2/analytics', validateToken, require('./routes/api/va/v2/analytics'));
router.use('/api/va/v2/datasources', validateToken, require('./routes/api/va/v2/datasources'));
router.use('/api/va/v2/data', validateToken, require('./routes/api/va/v2/data'));
router.use('/api/va/v2/schedules', validateToken, require('./routes/api/va/v2/schedules'));
router.use('/api/va/v2/help/function/static/help', __REQ_express.static(__REQ_path.join(__dirname, 'public') + '/static/help'));
router.use('/api/va/v2/help', validateToken, require('./routes/api/va/v2/help'));
router.use('/api/va/v2/convert', validateToken, require('./routes/api/va/v2/convert'));

router.post('/api/va/v2/ws/udfs/:udfId', validateToken, require('./routes/api/va/v2/udfs').createUdf);
router.get('/api/va/v2/ws/udfs/:udfId/doc', validateToken, require('./routes/api/va/v2/udfs').renderUdfDoc);
router.use('/api/va/v2/ws/udfs', validateToken, __BRTC_API_SERVER.proxy);

router.get('/api/va/v3/ws/functions', validateToken, require('./routes/api/va/v3/functions').listFunctions);
router.use('/api/va/v3/ws/udfs', validateToken, __BRTC_API_SERVER.proxy);

router.use('/api/va/v2/toolkit', validateToken, __BRTC_API_SERVER.proxy);

router.use('/api/va/v2', validateToken, vastudio.routes.va_v2);

router.use('/api/admin/v2/notices', function (req, res) {
    return res.sendStatus(200);
});
router.use('/api/admin/v2', validateToken, require('./routes/api/admin/v2'));
router.use('/api/va/log4js', validateToken, require('./routes/api/va/v2/log4js'));

// Login 후 접근 가능한 url
router.use('/toolkit', ensureLoggedIn, validateToken, require('./routes/toolkit/index'));
router.use('/', ensureLoggedIn, require('./routes/va/index'));

// SubPath 적용
if (subPathUrl) {
    app.use(subPathUrl, router);
}
app.use(router);

// production error handler, no stacktraces leaked to user
app.use(function (error, req, res, next) {
    var _ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var source = req.user ? `[${_ip}][${req.user.id}]` : `[${_ip}]`;
    var message = `${source} ${error.message}`;
    if (error.stack) message = `${source} ${error.stack}`;
    log.error(message);

    if (res.headersSent) {
        return next(error);
    } else if (req.xhr) {
        res.status(500).send({
            'errors': [
                {
                    'code': error.errorCode || 500,
                    'message': 'Sorry! An unexpected error occurred. Please contact administrator.',
                    'detailMessage': error.stack,
                },
            ],
        });
    }
    return undefined;
});

// error handlers, catch 404 and forward to error handler
app.use(function (req, res, next) {
    if (req.url.startsWith('/api') || req.url.startsWith('/auth')) {
        if (__BRTC_CONF['use-login-page']) res.redirect('/auth/brightics-user'); // Account Login 페이지로 이동
        else res.redirect('/'); // Index 페이지로 이동
    } else {
        res.status(404);
        res.render('error', { message: 'The requested URL ' + req.originalUrl + ' was not found on this server.' });
    }
});

process.on('uncaughtException', function (err) {
    log.error(err.stack);
});

// var removePasswordInfo = function (dbInfo) {
//     var infoToken, dbType, dbUserName, dbAddress;

//     infoToken = dbInfo.split('://');
//     dbType = infoToken[0];

//     infoToken = infoToken[1].split('@');
//     dbAddress = infoToken[1];

//     infoToken = infoToken[0].split(':');
//     dbUserName = infoToken[0];
//     return dbType + '://' + dbUserName + '@' + dbAddress;
// };

var server = http.createServer(app).listen(__BRTC_CONF.port, __BRTC_CONF.host || '0.0.0.0', function () {
    log.info('   O');
    log.info('  P');
    log.info(' E');
    log.info('N');
    log.info('  BRIGHTICS');
    log.info('            S');
    log.info('           T');
    log.info('          A');
    log.info('         R');
    log.info('        T');
    log.info('Brightics Visual Analytics running at http://' + ip.address() + ':' + __BRTC_CONF.port + ' in ' + __BRTC_CONF.env + ' mode');

    const handleError = function (err) {
        log.error('MESSAGE: ' + err.error);
        log.error('QUERY: ' + err.query);
    };

    const handleSuccess = function (rows, results, sql, args) {
        var message = 'SUCCESS QUERY: ' + sql;
        if (args && args.length) message += ' __ARGS: ' + args;
        log.debug(message);
    };

    __BRTC_DAO.project.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.file.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.library.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.template.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.user.resource.role.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.notice.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.role.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.role.permission.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.permission.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.publishreport.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.file.version.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.addon_function.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.tools_project.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.tools_function.checkSchema(handleError, handleSuccess);
    __BRTC_DAO.function.favorite.checkSchema(handleError, handleSuccess);
});

server.timeout = 2 * 60 * 60 * 1000;
