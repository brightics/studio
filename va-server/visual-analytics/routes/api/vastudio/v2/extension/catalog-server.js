var request = __REQ_request;
var router = __REQ_express.Router();

var log4js = require('log4js');
var log = log4js.getLogger('DEP');

// prefix: /api/va/ext/

var SERVICE_ID = 'catalog';

var createRequestOptions = function (req) {
    var options = {
        url: 'http://catalog.dep.io/' + req.url,

        strictSSL: false,
        method: req.method,
        proxy: '',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (req.body) options.body = JSON.stringify(req.body);
    return options;
};

var setBearerToken = function (options, token) {
    if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
    }
};

router.get('/catalogwebpage', function (req, res, next) {
    res.redirect("http://catalog.dep.io");
});

router.get('/downloadtobrightics', function (req, res, next) {
    res.redirect("http://catalog.dep.io");
});

router.get('/api-test', function (req, res, next) {
    var options = {
        url: 'http://catalog.dep.io/catalog/1254',
        strictSSL: false,
        method: 'GET',
        proxy: '',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    setBearerToken(options, req.accessToken);
    log.info(req.accessToken);
    request(options, function (error, response, body) {
        log.info(error);
        log.info(response);
        log.info(body);
        res.send(body);
    });
});

router.use(function (req, res, next) {
    var options = createRequestOptions(req);
    setBearerToken(options, req.accessToken);
    request(options).pipe(res);
});

module.exports = {
    serviceId: SERVICE_ID,
    router: router
};