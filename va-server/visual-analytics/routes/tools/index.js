var router = __REQ_express.Router();
var jdbcloader = require('./lib/distributedjdbcloader');

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Brightics Tools' });
    return res.render('tools/index', {title: 'Brightics Tools'});
});

router.get('/data-extractor-generator', function (req, res) {
    return res.render('tools/data-extractor-generator');
});

router.get('/func-ui-generator', function (req, res) {
    return res.render('tools/func-ui-generator');
});

router.use(jdbcloader);

module.exports = router;
