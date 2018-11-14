var router = __REQ_express.Router();
var request = __REQ_request;

var getMessage = function (req, res, next) {
    var locale = req.params.locale || 'en';
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/message/' + locale);
    // __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken)
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
            next()
        } else {
            if (response.statusCode === 200) {
                try {
                    res.json(JSON.parse(response.body))
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                    next()
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_CORE_SERVER.parseError(body));
                next()
            }
        }
    })
};

router.get('/message/:locale', getMessage);

module.exports = router;
