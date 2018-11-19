var router = __REQ_express.Router();

/* GET home page. */
router.get(/^(?!\/api).+/, function (req, res) {
    var enable = __BRTC_CONF.ENABLE_FUNC_GEN || false;
    var version =__BRTC_CONF['use-spark'] ? 'enterprise' : 'standard';
    res.render('toolkit/index', {type: '', content: '', enable: enable, va: {version: version}})
});

router.post(/^(?!\/api).+/, function (req, res) {
    var enable = __BRTC_CONF.ENABLE_FUNC_GEN || false;
    var version =__BRTC_CONF['use-spark'] ? 'enterprise' : 'standard';
    res.render('toolkit/index', {type: req.body.type, content: req.body.content, enable: enable, va: {version: version}})
});

module.exports = router;
