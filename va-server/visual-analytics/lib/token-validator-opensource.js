exports.validateToken = function (req, res, next) {
    req.apiUserId = __BRTC_ARGS.user_id,
    req.accessToken = __BRTC_ARGS.access_token;
    req.tokenType = 'Bearer';
    next();
};