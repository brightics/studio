var router = __REQ_express.Router();
var request = __REQ_request;

var listSchedules = function (req, res) {
    var options = __BRTC_SCHEDULER_SERVER.createRequestOptions('GET', '/api/v2/schedules');
    __BRTC_SCHEDULER_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                res.json((JSON.parse(body)).result);
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    });
};

router.get('/', listSchedules);

module.exports = router;
