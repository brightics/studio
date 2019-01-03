var request = __REQ_request;
var router = __REQ_express.Router();

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');
var baseUrl = __BRTC_CONF['callback-host'] + subPathUrl + '/';

var _executeInPermission = function (req, res, perm, task) {
    var permHandler = __BRTC_PERM_HELPER.checkPermission(req, [__BRTC_PERM_HELPER.PERMISSION_RESOURCE_TYPES.PUBLISH], perm);
    permHandler.on('accept', task);
    permHandler.on('deny', function (permissions) {
        __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
    });
    permHandler.on('fail', function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    });
};

var readPublishReport = function (req, res) {
    const getReportContent = (publishReport) => {
        var reportContent = JSON.parse(publishReport.publishing_contents);
        reportContent.publishId = publishReport.publish_id;

        if (reportContent.contents && reportContent.contents.functions) {
            var functions = reportContent.contents.functions;
            for (var i = 0; i < functions.length; i++) {
                delete functions[i].display.label;
            }
        }

        return {
            reportContent: reportContent,
            userId: publishReport.pulisher
        };
    };
    var task = function (permissions) {
        var opt = {
            publish_id: req.params.publishId,
            url: req.params.publishId
        };

        var title = req.query.title;

        __BRTC_DAO.publishreport.selectById(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            try {
                if (result.length === 0) {
                    return __BRTC_DAO.publishreport.selectByUrl(opt, function (err) { }, function (urlResult) {
                        return res.json(getReportContent(urlResult[0]));
                    });
                }
                return res.json(getReportContent(result[0]));
            } catch (e) {
                return res.render('notexistreport', { title: title, baseUrl: baseUrl });
            }
        });
    };

    if (__BRTC_CONF['publish-auth']) {
        _executeInPermission(req, res, __BRTC_PERM_HELPER.PERMISSIONS.PERM_PUBLISH_READ, task);
    } else {
        task();
    }
};

router.post('/:publishId', readPublishReport);

module.exports = router;