var router = __REQ_express.Router();
var request = __REQ_request;

router.get('/alltopics', function (req, res) {
    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/v2/kafka/alltopics');
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode == 200) {
                try {
                    res.send(JSON.parse(response.body).result);
                    console.log(JSON.parse(response.body).result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

module.exports = router;