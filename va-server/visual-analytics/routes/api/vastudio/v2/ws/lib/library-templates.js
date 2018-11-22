exports.listTemplates = function (req, res) {
    var opt = {
        id: req.params.libraryId
    };
    __BRTC_DAO.library.selectById(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (libraries) {
        if (libraries.length > 0 && libraries[0].creator != req.apiUserId && libraries[0].type != 'Opened') {
            __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
        } else {
            opt = {
                library_id: req.params.libraryId
            };
            __BRTC_DAO.template.selectByLibrary(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                for (var i in result) {
                    result[i].contents = JSON.parse(result[i].contents);
                }
                res.json(result);
            });
        }
    });
};

exports.createTemplate = function (req, res) {
    var opt = {
        id: req.params.libraryId
    };
    __BRTC_DAO.library.selectById(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        if (result.length > 0 && result[0].creator != req.apiUserId) {
            __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
        } else {
            __BRTC_DAO.template.selectByLibrary({
                library_id: req.params.libraryId
            }, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                if (result.length < 20) {
                    opt = {
                        id: req.body.id,
                        library_id: req.params.libraryId,
                        label: req.body.label,
                        contents: req.body.contents,
                        description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
                        creator: req.apiUserId
                    };
                    __BRTC_DAO.template.create(opt, function (err) {
                        if (err.error.indexOf('duplicate key ') == 0) {
                            __BRTC_ERROR_HANDLER.sendError(res, 34011);
                        } else {
                            __BRTC_ERROR_HANDLER.sendError(res, 34012);
                        }
                    }, function (result) {
                        res.sendStatus(200);
                    });
                } else {
                    __BRTC_ERROR_HANDLER.sendError(res, 33011);
                }
            });
        }
    });
};

exports.getTemplate = function (req, res) {
    var opt = {
        id: req.params.libraryId
    };

    __BRTC_DAO.library.selectById(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        if (result.length > 0 && result[0].creator != req.apiUserId && result[0].type != 'Opened') {
            __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
        } else {

            opt = {
                id: req.params.templateId,
                library_id: req.params.libraryId
            };

            __BRTC_DAO.template.selectById(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                try {
                    for (var i in result) {
                        result[i].contents = JSON.parse(result[i].contents);
                    }
                    res.json(result);
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            });

        }
    });
};

exports.updateTemplate = function (req, res) {
    var opt = {
        id: req.params.libraryId
    };

    __BRTC_DAO.library.selectById(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        if (result.length > 0 && result[0].creator != req.apiUserId) {
            __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
        } else {

            var opt = {
                id: req.params.templateId,
                library_id: req.params.libraryId,
                label: req.body.label,
                description: __BRTC_TOOLS_SANITIZE_HTML.sanitizeHtml(req.body.description),
                updater: req.apiUserId
            };

            __BRTC_DAO.template.update(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                res.sendStatus(200);
            });

        }
    });
};

exports.deleteTemplate = function (req, res) {
    var opt = {
        id: req.params.libraryId
    };

    __BRTC_DAO.library.selectById(opt, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        if (result.length > 0 && result[0].creator != req.apiUserId) {
            __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
        } else {

            var opt = {
                id: req.params.templateId,
                library_id: req.params.libraryId
            };

            __BRTC_DAO.template.delete(opt, function (err) {
                __BRTC_ERROR_HANDLER.sendServerError(res, err);
            }, function (result) {
                res.sendStatus(200);
            });

        }
    });
};