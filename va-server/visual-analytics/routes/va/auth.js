const router = __REQ_express.Router();
const request = __REQ_request;

const authenticateRouter = __BRTC_AUTH_HELPER.routers;
const ensureLoggedIn = __BRTC_AUTH_HELPER.ensureLoggedIn;

const log4js = require('log4js');
const log = log4js.getLogger('INDEX');

router.get('/auth/:user/logout', ensureLoggedIn, authenticateRouter.signOut);
router.get('/profile', ensureLoggedIn, authenticateRouter.profileSettings);

router.get('/auth/brightics-user', authenticateRouter.authenticate); // account server로 redirect
router.get('/auth/brightics-user/callback', authenticateRouter.authenticateCallback); // authorization code를 받아온 후, access token 획득
router.get('/auth/brightics-user/callback', (req, res) => { // token 받아온 후 동작하는 로직
    const userId = req.user.id;
    try {
        let options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/v2/agentUser/attach/' + userId);
        __BRTC_CORE_SERVER.setBearerToken(options, req.user.accessToken);
        request(options, (error, response, body) => {
            if (error) {
                log.error('Failed to attach agent for ' + userId + ': ' + error);
            } else {
                if (response.statusCode === 200) {
                    log.trace('Success to attach agent for ' + userId);
                } else {
                    log.error('Failed to attach agent for ' + userId + ': ' + body);
                }
            }
        });
    } catch (ex) {
        log.error('Failed to attach agent for ' + userId + ': ' + ex);
    }
    req.session.loggedIn = true;
    req.session.userId = userId;
    req.session.access_token = req.user.accessToken;
    req.session.token_type = 'Bearer';
    const redirect = req.query.redirect || '/';
    res.redirect(redirect);
});

module.exports = router;
