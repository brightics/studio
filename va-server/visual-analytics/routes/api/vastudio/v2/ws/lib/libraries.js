var getMyLibrary = function (userId, errCallback, doneCallback) {
    var opt = {
        id: userId,
        label: 'My Template222',
        creator: userId,
        type: 'Closed'
    };

    __BRTC_DAO.library.selectById(opt, errCallback, function (result) {
        if (result.length === 0) {
            __BRTC_DAO.library.create(opt, errCallback, function (result) {
                __BRTC_DAO.library.selectById(opt, errCallback, doneCallback);
            });
        } else {
            doneCallback(result);
        }
    });
};

exports.listLibraries = function (req, res) {

    getMyLibrary(req.apiUserId, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
    }, function (result) {
        res.json(result);
    })

};
