/* -----------------------------------------------------
 *  convert.js
 *  Created by hyunseok.oh@samsung.com on 2018-04-21.
 * ---------------------------------------------------- */

const router = __REQ_express.Router();
const request = __REQ_request;

const send = function (req, res, __BRTC_CORE_SERVER, method, url, data) {
    let options = __BRTC_CORE_SERVER.createRequestOptions(method, url);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    options.body = JSON.stringify(data);
    request(options, (error, response, body) => {
        if (error) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, error);
        }
        if (response.statusCode !== 200) {
            return __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
        }
        try {
            return res.json(JSON.parse(response.body));
        } catch (ex) {
            return __BRTC_ERROR_HANDLER.sendServerError(res, ex);
        }
    });
};

router.post('/execute', (req, res) => {
    const runnable = req.body;
    send(req, res, __BRTC_CORE_SERVER, 'POST', '/api/core/v2/convert/execute', runnable);
});

router.post('/store', function (req, res, next) {
    var { contents, version } = req.body;
    send(req, res, __BRTC_CORE_SERVER, 'POST', '/api/core/v2/convert/store', {
        contents,
        version
    });
});

module.exports = router;
