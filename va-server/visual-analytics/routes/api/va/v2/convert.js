/* -----------------------------------------------------
 *  convert.js
 *  Created by hyunseok.oh@samsung.com on 2018-04-21.
 * ---------------------------------------------------- */

var router = __REQ_express.Router();
var request = __REQ_request;

var send = function (req, res, __BRTC_CORE_SERVER, method, url, data) {
    var options = __BRTC_CORE_SERVER.createRequestOptions(method, url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(data);
    request(options, function (error, response, body) {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    return res.json(JSON.parse(response.body));
                } catch (ex) {
                    return __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

router.post('/execute', function (req, res, next) {
    var runnable = req.body;
    send(req, res, __BRTC_CORE_SERVER, 'POST', '/api/core/v2/convert/execute', runnable);
});

router.post('/store', function (req, res, next) {
    var contents = req.body;
    send(req, res, __BRTC_CORE_SERVER, 'POST', '/api/core/v2/convert/store', {
        contents: contents
    });
});

module.exports = router;
