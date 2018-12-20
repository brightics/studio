var request = __REQ_request;

var URI_API_SERVER = 'http://localhost:3333';

var setBearerToken = function (options, token) {
    if (options.auth) {
        options.auth.bearer = token;
    } else {
        if (token) options.auth = {bearer: token};
    }
};

var createRequestOptions = function (method, url, token) {
    var options = {
        url: URI_API_SERVER + url,
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

var proxy = function (req, res) {
    var options = __BRTC_API_SERVER.createRequestOptions(req.method, req.originalUrl);

    if (req.originalUrl.startsWith('/api/va/v3/ws/udfs') || req.originalUrl.startsWith('/api/va/v2/ws/udfs')) {
        options = __BRTC_API_SERVER.createRequestOptions(req.method, '/api/vastudio/v3/udfs' +
            req.originalUrl.substring(req.originalUrl.indexOf(req.baseUrl) + req.baseUrl.length));
    } else if (req.originalUrl.startsWith('/api/va/v2/toolkit')) {
        options = __BRTC_API_SERVER.createRequestOptions(req.method, '/api/vastudio/v3/toolkit' +
            req.originalUrl.substring(req.originalUrl.indexOf(req.baseUrl) + req.baseUrl.length));
    } else if (req.originalUrl.startsWith('/api/admin/v2/deploy')) {
        options = __BRTC_API_SERVER.createRequestOptions(
            req.method,
            '/api/admin/v2/authorization/roles?userId=' + req.session.userId + '&roleLabel=Administrator'
            );
    }

    options.body = JSON.stringify(req.body);
    __BRTC_API_SERVER.setBearerToken(options, req.accessToken);

    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }

        if (response.statusCode === 200) {
            try {
                return res.json(JSON.parse(body));
            } catch (e) {
                return res.sendStatus(200);
            }
        }
        if (response.statusCode === 401) {
            req.logout();
            req.session = null;
            return res.status(401).send('Unauthorized');
        }
        else {
            __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body), response.statusCode);
        }
    });
};

exports.env = function (options) {
    URI_API_SERVER = options['URI'];
};

exports.createRequestOptions = createRequestOptions;
exports.setBearerToken = setBearerToken;
exports.proxy = proxy;
