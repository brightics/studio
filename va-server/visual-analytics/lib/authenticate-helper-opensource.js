var request = __REQ_request;
var passport = require('passport');

var url = require('url');

var log4js = require('log4js');
var log = log4js.getLogger('AUTH-HELPER');

var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var InternalOAuthError = require('passport-oauth').InternalOAuthError;

var ip = require('ip');

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');

const CALLBACK_HOST = (process.env.NODE_ENV == 'development') ?
    ('http://' + ip.address() + ':' + __BRTC_CONF.port + subPathUrl) :
    (__BRTC_CONF['callback-host'] + subPathUrl);
const CALLBACK_URL = CALLBACK_HOST + '/auth/brightics-user/callback';

var login_url = __BRTC_ACCOUNT_SERVER.getAccountServer();
var account_server = __BRTC_ACCOUNT_SERVER.getAccountHostName();
var authorize_url = __BRTC_ACCOUNT_SERVER.getAccountAPI('authorize-url') || "/api/account/v2/oauth2/authorize";
var token_url = __BRTC_ACCOUNT_SERVER.getAccountAPI('token-url') || "/api/account/v2/oauth2/token";
var profile_url = __BRTC_ACCOUNT_SERVER.getAccountAPI('profile-url') || "/api/account/v2/oauth2/userinfo";
var validate_url = __BRTC_ACCOUNT_SERVER.getAccountAPI('validate-url') || "/api/account/v2/oauth2/token/validate";
var profile_settings_url = __BRTC_ACCOUNT_SERVER.getAccountAPI('profile-settings-url') || "/account/profile-settings";

const AUTHORIZATION_URL = login_url + authorize_url;
const TOKEN_URL = account_server + token_url;
const PROFILE_URL = account_server + profile_url;
const VALIDATE_URL = account_server + validate_url;
const PROFILE_SETTINGS_URL = login_url + profile_settings_url;

const CLIENT_ID = __BRTC_AUTH_CONF['client-info']['client-id'];
const CLIENT_SECRET = __BRTC_AUTH_CONF['client-info']['client-secret'];

const SERVER_ID = __BRTC_AUTH_CONF['api-server-info']['server-id'];
const SERVER_SECRET = __BRTC_AUTH_CONF['api-server-info']['server-secret'];

exports.AUTHORIZATION_URL = AUTHORIZATION_URL;
exports.TOKEN_URL = TOKEN_URL;
exports.PROFILE_URL = PROFILE_URL;
exports.VALIDATE_URL = VALIDATE_URL;
exports.PROFILE_SETTINGS_URL = PROFILE_SETTINGS_URL;

exports.CLIENT_ID = CLIENT_ID;
exports.CLIENT_SECRET = CLIENT_SECRET;

exports.SERVER_ID = SERVER_ID;
exports.SERVER_SECRET = SERVER_SECRET;

/**
 * authenticateCallback으로 받아온 accessToken을 사용하여 user 정보를 획득하는 로직
 *
 * @param accessToken
 * @param refreshToken
 * @param profile
 * @param done
 */
var userProfile = function (accessToken, refreshToken, profile, done) {
    var option = {
        url: PROFILE_URL,
        method: 'GET',
        proxy: '',
        auth: {
            bearer: accessToken
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };

    request(option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json;

            if ('string' === typeof body) {
                try {
                    json = JSON.parse(body);
                }
                catch (e) {
                    return done(e);
                }
            } else if ('object' === typeof body) {
                json = body;
            }

            profile = {};
            profile.id = json['user_id'];
            profile.provider = 'brightics-oauth2-consumer-strategy';
            profile._raw = body;
            profile._json = json;

            var user = {
                id: json['user_id'],
                accessToken: accessToken,
                profile: profile
            };
            //TODO if not exists, create user.
            return done(null, user);
        } else {
            return done(new InternalOAuthError('failed to fetch user profile', error));
        }
    });
};

/**
 * development인 경우, localhost, 127.0.0.1로 서버에 접속하면 session 유지가 어려우므로 강제로 CALLBACK_HOST로 redirect한다.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var devOption = function (req, res, next) {
    if (process.env.NODE_ENV == 'development') {
        if (req.method == 'GET' && req.originalUrl == '/'
            && (req.headers.host.startsWith('localhost') || req.headers.host.startsWith('127.0.0.1'))) {
            return res.redirect(CALLBACK_HOST);
        }
    }
    next();
};

/**
 * 자동 로그인: 로그인 되어 있더라도 certificate-data를 query에 넣어서 VA에 접속하는 경우 강제로 로그아웃하여 자동 로그인이 진행되도록 한다.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var certificateAuthorityOption = function (req, res, next) {
    if (req.isAuthenticated()) {
        // Cello 자동 로그인을 위한 parameter
        if (req.query['certificate-data']) {
            req.logout();
            req.session = null;

            var loginUrl = '/auth/brightics-user?redirect=' + url.parse(req.originalUrl).pathname;
            for (var key in req.query) {
                loginUrl += ('&' + key + '=' + req.query[key]);
            }
            var callbackFullUrl = CALLBACK_HOST + loginUrl;
            var signOutUrl = __BRTC_ACCOUNT_SERVER.getSignOutURL(callbackFullUrl);
            return res.redirect(signOutUrl);
        }
    }
    next();
};

exports.userProfile = userProfile;
exports.devOption = devOption;
exports.certificateAuthorityOption = certificateAuthorityOption;
exports.getOAuth2Strategy = function () {
    return new OAuth2Strategy(
        {
            authorizationURL: AUTHORIZATION_URL,
            tokenURL: TOKEN_URL,
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: CALLBACK_URL
        },
        function verify(accessToken, refreshToken, profile, done) {
            userProfile(accessToken, refreshToken, profile, done);
        }
    );
};

/**
 * login 되어있는 경우에 next로 이동
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.ensureLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        var loginUrl = '/auth/brightics-user?redirect=' + url.parse(req.originalUrl).pathname;
        for (var key in req.query) {
            loginUrl += ('&' + key + '=' + req.query[key]);
        }
        var callbackFullUrl = CALLBACK_HOST + loginUrl;
        return res.redirect(callbackFullUrl);
    }

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};
/* --- END app.js에서 사용되는 함수들 */

/* --- START routes/va/auth.js에서 사용되는 함수들 */
exports.routers = {
    /**
     * account logout으로 이동
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    signOut: function (req, res, next) {
        req.logout();
        req.session = null;

        var signOutURL = __BRTC_ACCOUNT_SERVER.getSignOutURL(CALLBACK_HOST);
        return res.redirect(signOutURL);
    },

    /**
     * account profile settings로 이동
     *
     * @param req
     * @param res
     * @param next
     */
    profileSettings: function (req, res, next) {
        res.redirect(PROFILE_SETTINGS_URL);
    },

    /**
     * authorization code 획득을 위해 account로 redirect
     *
     * @param req
     * @param res
     * @param next
     */
    authenticate: function (req, res, next) {
        var callbackURL = CALLBACK_HOST + '/auth/brightics-user/callback?';
        for (var key in req.query) {
            callbackURL += ('&' + key + '=' + encodeURIComponent(req.query[key]));
        }
        log.trace('/auth/brightics-user:callbackURL: ' + callbackURL);
        res.redirect(callbackURL);
    },

    /**
     * authorization code 획득 후 access token을 받아오는 로직
     *
     * @param req
     * @param res
     * @param next
     */
    authenticateCallback: function (req, res, next) {
        var callbackURL = CALLBACK_HOST + '/auth/brightics-user/callback?';
        callbackURL = (req.query.redirect) ?
            (callbackURL + '&redirect=' + encodeURIComponent(req.query.redirect)) : (callbackURL);
        log.trace('/auth/brightics-user/callback:callbackURL: ' + callbackURL);

        var userId = __BRTC_ARGS.user_id;
        var accessToken = __BRTC_ARGS.access_token;
        var user = {
            id: userId,
            accessToken: accessToken,
            profile: {
                id: userId,
                provider: 'brightics-oauth2-consumer-strategy'
            }
        };
        req.login(user, function (err) {
            if (err) { return next(err); }
            next();
        })
    }
};
/* --- END routes/va/auth.js에서 사용되는 함수들 */