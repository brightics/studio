var request = __REQ_request;
var path = __REQ_path;

var URI_API_SERVER = 'http://localhost:3333';

var setBearerToken = function (options, token) {
    if (options.auth) {
        options.auth.bearer = token;
    } else {
        options.auth = {
            bearer: token
        }
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

    if (req.originalUrl.startsWith('/api/va/v3/ws/udfs')
        || req.originalUrl.startsWith('/api/va/v2/ws/udfs')) {
        options = __BRTC_API_SERVER.createRequestOptions(req.method, '/api/vastudio/v3/udfs' +
            req.originalUrl.substring(req.originalUrl.indexOf(req.baseUrl) + req.baseUrl.length));
    } else if (req.originalUrl.startsWith('/api/va/v2/toolkit')) {
        options = __BRTC_API_SERVER.createRequestOptions(req.method, '/api/vastudio/v3/toolkit' +
            req.originalUrl.substring(req.originalUrl.indexOf(req.baseUrl) + req.baseUrl.length));
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
            __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
    });
};

exports.env = function (options) {
    URI_API_SERVER = options['URI'];
};

var isProduction = (process.env.NODE_ENV === 'production');
exports.getVaStudio = function () {
    if (!__BRTC_CONF['meta-db']) {
        throw new Error(`please check conf.json: "meta-db" doesn't exist.`);
    }
    const isSqlite = __BRTC_CONF['meta-db'].type === 'sqlite';
    const daoName = isSqlite ? 'sqlite-dao' : 'pg-dao';
    return {
        dao: (isProduction) ? (require(path.resolve(__dirname, '../dao/', daoName))) :
            (require(path.resolve(__dirname, '../../brightics-vastudio/dao/', daoName)))
        ,
        routes: {
            va_v2: (isProduction) ? (require('../routes/api/vastudio/v2')) :
                (require('../../brightics-vastudio/routes/api/vastudio/v2'))
            ,
            report: (isProduction) ? (require('../routes/api/vastudio/v2/report')) :
                (require('../../brightics-vastudio/routes/api/vastudio/v2/report'))
            ,
            v3: (isProduction) ? (require('../routes/api/vastudio/v3')) :
                (require('../../brightics-vastudio/routes/api/vastudio/v3'))
        }
    };
};

exports.createRequestOptions = createRequestOptions;
exports.setBearerToken = setBearerToken;
exports.proxy = proxy;
