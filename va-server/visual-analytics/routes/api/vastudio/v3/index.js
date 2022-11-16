var router = __REQ_express.Router();

router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./authorization/authorization'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./files/file-versions'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./functions/udfs'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./files/project-files'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./libraries/libraries'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./libraries/library-templates'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./notices/notices'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./projects/projects'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./projects/project-members'));
router.use(require('./report/publish'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./report/publishreports'));
router.use(__BRTC_TOKEN_VALIDATOR.validateToken, require('./toolkit/index'));
router.use(require('./functions/favorite'));

router.post('/permissions', __BRTC_TOKEN_VALIDATOR.validateToken, function (req, res) {
    __BRTC_PERM_HELPER.queryPermissions(req, req.body.resource_types, function (error) {
        __BRTC_ERROR_HANDLER.sendServerError(res, error);
    }, function (permissions) {
        res.json(permissions);
    });
});

module.exports = router;
