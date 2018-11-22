var router = __REQ_express.Router();
var request = __REQ_request;

var getSessionUser = function (req, res) {
    var options = __BRTC_ACCOUNT_SERVER.createRequestOptions('GET', '/api/account/v2/users/' + req.session.userId);
    __BRTC_ACCOUNT_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            return res.status(400).json(JSON.parse(body));
        }
        return res.json(JSON.parse(body));
    });
};

router.get('/my', getSessionUser);

module.exports = router;