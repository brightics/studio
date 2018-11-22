var request = __REQ_request;

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');

var ip = require('ip');

var URI_ACCOUNT_SERVER = 'http://localhost:3000';

const CALLBACK_HOST =
    (process.env.NODE_ENV == 'development') ?
        ('http://' + ip.address() + ':' + __BRTC_CONF.port + subPathUrl) :
        (__BRTC_CONF['callback-host'] + subPathUrl);

var createRequestOptions = function (method, url, token) {
    var options = {
        url: URI_ACCOUNT_SERVER + url,
        method: method,
        proxy: '',
        headers: {
            'User-Agent': 'Brightics VA',
            'Content-Type': 'application/json',
            'authorization': 'Basic YWRtaW46YWRtaW4='
        }
    };
    if (token) {
        setBearerToken(options, token);
    }
    return options;
};

var setBearerToken = function (options, token) {
    if (options.auth) {
        options.auth.bearer = token;
    } else {
        options.auth = {
            bearer: token
        }
    }
};

exports.env = function (options) {
    URI_ACCOUNT_SERVER = options['URI'];
};

exports.createRequestOptions = createRequestOptions;
exports.setBearerToken = setBearerToken;

exports.getSignOutURL = function (redirectURL) {
    var signOutUrl = getAccountAPI('sign-out-url') || '/api/account/v2/users/sign-out';

    var accountServerSignOutUrl = getAccountServer() + signOutUrl;

    if (redirectURL) {
        accountServerSignOutUrl += '?redirect=' + encodeURIComponent(redirectURL);
    }
    return accountServerSignOutUrl;
};

var goToLoginPage = function (req, res, redirectPage) {
    var redirectPageList = [
        CALLBACK_HOST + '/auth/brightics-user'
    ];
    if (redirectPage) {
        redirectPageList.push(redirectPage);
    }
    var signOutBeforeLogin = getAccountAPI('sign-out-url');
    var redirectPageUrlQuery = createRedirectQuery(redirectPageList);
    return res.redirect(getAccountServer() + signOutBeforeLogin + '?redirect=' + encodeURIComponent(redirectPageUrlQuery))
};

var createRedirectQuery = function (pageList) {
    var page;
    var result = pageList[0];

    for (var i = 1; i < pageList.length; i++) {
        page = pageList[i];
        result = result + '?redirect=' + page;
    }
    return result;
};

var getAccountServer = function () {
    return __BRTC_CONF['login-url'] + getAccountSubPath();
};

var getAccountHostName = function () {
    return __BRTC_CONF['account-server'] + getAccountSubPath();
};

var getAccountSubPath = function () {
    return __BRTC_CONF['account-sub-path'] ? '/' + __BRTC_CONF['account-sub-path'] : '';
};

var getAccountAPI = function (api) {
    return __BRTC_AUTH_CONF['account-server'][api];
};

module.exports.goToLoginPage = goToLoginPage;
module.exports.getAccountServer = getAccountServer;
module.exports.getAccountHostName = getAccountHostName;
module.exports.getAccountSubPath = getAccountSubPath;
module.exports.getAccountAPI = getAccountAPI;