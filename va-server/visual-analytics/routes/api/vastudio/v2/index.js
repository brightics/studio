var router = __REQ_express.Router();

router.use('/ws', __BRTC_TOKEN_VALIDATOR.validateToken, require('./ws'));

router.post('/permissions', __BRTC_TOKEN_VALIDATOR.validateToken, function (req, res) {
    __BRTC_PERM_HELPER.queryPermissions(req, req.body.resource_types, function (error) {
        __BRTC_ERROR_HANDLER.sendServerError(res, error);
    }, function (permissions) {
        res.json(permissions);
    });
});

var extensionPath = __REQ_path.join(__dirname, 'extension');
var extensionPathValid = __REQ_fs.existsSync(extensionPath);
if (extensionPathValid) {
    var files = __REQ_fs.readdirSync(__REQ_path.join(__dirname, 'extension'));
    files.forEach(function (file) {
        if (__REQ_path.parse(file).ext === '.js') {
            var filePath = __REQ_path.join(extensionPath, file);
            var extendedRouter = require(filePath);
            var serviceId = extendedRouter.serviceId;
            var routerEx = extendedRouter.router;
            router.use('/api/va/ext/' + serviceId, __BRTC_TOKEN_VALIDATOR.validateToken, routerEx);
        }
    });
}

module.exports = router;
