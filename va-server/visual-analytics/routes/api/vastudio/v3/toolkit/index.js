var router = __REQ_express.Router();

var tps = require('./lib/tools-projects');
var tfs = require('./lib/tools-functions');
var msg = require('./lib/message');

router.use('/toolkit', tps);
router.use('/toolkit', tfs);
router.use('/toolkit', msg);

module.exports = router;
