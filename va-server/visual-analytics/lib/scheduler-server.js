var URI_SCHEDULER_SERVER = 'http://localhost:9099';

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
        url: URI_SCHEDULER_SERVER + url,
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

exports.env = function (options) {
    URI_SCHEDULER_SERVER = options['URI'] || URI_SCHEDULER_SERVER;
};

exports.createRequestOptions = createRequestOptions;
exports.setBearerToken = setBearerToken;
