/**
 * Created by sds on 2018-09-27.
 */

var URI_MONITOR_SERVER = 'http://localhost:9100';

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
        url: URI_MONITOR_SERVER + url,
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
    URI_MONITOR_SERVER = options['URI'];
};

exports.createRequestOptions = createRequestOptions;
exports.setBearerToken = setBearerToken;
