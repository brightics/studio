var router = __REQ_express.Router();

var authorization = require('./lib/authorization');
var notices = require('./lib/notices');

router.use(authorization);
router.use(notices);

module.exports = router;