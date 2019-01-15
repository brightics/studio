var router = __REQ_express.Router();
var log4js = require('log4js');

var chartLogger = log4js.getLogger('chart');
var clientLogger = log4js.getLogger('client');

var traceLog = function (req, res) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var message = '[' + ip + '] ' + req.body.message;
    if (req.body.funcNm) message = '[' + ip + '] [' + req.body.funcNm + '] ' + req.body.message;

    res.json({success: true}); // Logging 하는 시간이 오래 걸림. Logging 성공여부와 관계없이 success return
    try {
        if (req.body.category === 'Chart') chartLogger[req.body.level](message);
        else clientLogger[req.body.level](message);
    } catch (e) {
        // do nothing
    }

};

router.post('/', traceLog);
module.exports = router;
