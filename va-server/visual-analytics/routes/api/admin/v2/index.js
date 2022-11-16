var router = __REQ_express.Router();

var agents = require('./lib/agents');
var schedules = require('./lib/schedules');
var users = require('./lib/users');
var deploys = require('./lib/deploys');
var monitor = require('./lib/monitor');
var datasources = require('./lib/datasources');
var s3 = require('./lib/s3');

router.use(agents);
router.use(schedules);
router.use(users);
router.use(deploys);
router.use(monitor);
router.use(datasources);
router.use(s3);

router.use('/authorization', __BRTC_TOKEN_VALIDATOR.validateToken, __BRTC_API_SERVER.proxy);
router.use('/notices', __BRTC_TOKEN_VALIDATOR.validateToken, __BRTC_API_SERVER.proxy);

module.exports = router;