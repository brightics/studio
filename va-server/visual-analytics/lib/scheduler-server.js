/**
 * Created by sds on 2018-09-27.
 */
var request = __REQ_request;

var URI_SCHEDULER_SERVER = 'http://localhost:9099';

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
    URI_SCHEDULER_SERVER = options['URI'] || URI_SCHEDULER_SERVER;
};

exports.createRequestOptions = createRequestOptions;
exports.setBearerToken = setBearerToken;
