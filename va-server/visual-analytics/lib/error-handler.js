var log4js = require('log4js');

const ERRORCODES = {
    NotCreateProject: 'You can not create more than 10 projects.',
    NotCreateModel: 'You can not create more than 10 models in a project.',
    NotCreateTemplate: 'You can not create more than 20 template in a library.',
    AlreadyExist: 'Already exists.',
    FailCreate: 'Failed to create.',
    NotFoundHelpDocument: 'Sorry, the help document is not found. Please contact the administrator.',
    TOKENINCORRECT: 'Your id and token was incorrect.',
    INCOREECTID: 'Your id and name was incorrect.',
    LOGINBLOCKING: 'Your account was blocked due to incorrect password. You can log in tomorrow. If you want more information, contact administration.',
    LOGINFAILCOUNT: 'You failed login '
};

const ERROR_CODE = {
    /* user */
    21012: 'You can not create because already exists.',

    /* notice */
    22012: 'You can not create because already exists.',

    /* project */
    31011: 'You can not create more than 100 projects.',
    31012: 'You can not create because already exists.',

    /* file */
    32011: 'You can not create more than 100 models in a project.',
    32012: 'You can not create because already exists.',
    32031: 'This model has been changed by another user. It will be loaded with the latest version.',
    32032: 'Failed to update.',
    33011: 'You can not create more than 20 template in a library.',

    /* ws */
    34011: 'Already exists.',
    34012: 'Failed to create.',

    /* func */
    35021: 'Sorry, the help document is not found. Please contact the administrator.',

    /* alluxio repository */
    36011: 'Failed to upload.',
    36012: 'Maximum file length exceeded.',
    36021: 'Invalid file name.',
    36022: 'Failed to get contents.',
    36023: 'Failed to get schema.',
    36024: 'Failed to browse path.',
    36025: 'Failed to download.',
    36031: 'Failed to rename.',
    36041: 'Failed to delete.',

    37051: 'Sorry, Server is unstable. Please contact administrator.'
};

var log = log4js.getLogger('ERROR-HANDLER');

var writeLog = function (res, error) {
    var ip = res.req.header('x-forwarded-for') || res.req.connection.remoteAddress;
    var message = '[' + ip + '] ' + error.message;
    if (error.stack) message = '[' + ip + '] ' + error.stack;
    log.error(message);
};

const createError = (messages) => {
    const errors = Array.isArray(messages.errors) ? messages.errors[0] : {};
    const error = new Error(errors.message);
    if (errors.detailMessage) error.stack = errors.detailMessage;
    return error;
}

var sendMessage = function (res, messages, status) {
    res.status(status || 400).json(messages);
    writeLog(res, createError(messages));
};

var sendError = function (res, code, message) {
    var messages = {
        'errors': [
            {'code': code, 'message': ERROR_CODE[code]}
        ]
    };
    if (message) {
        messages.errors[0].message += ' ' + message;
    }
    res.status(400).json(messages);
    writeLog(res, createError(messages));
};

var sendNotAllowedError = function (res) {
    var messages = {
        'errors': [
            {
                'code': 1403,
                'message': 'Your account is not permitted to access this resource and your operation was not applied.'
            }
        ]
    };
    res.status(403).json(messages);
    writeLog(res, createError(messages));
};

var sendNotAllowedError2 = function (res) {
    var messages = {
        'errors': [
            {
                'code': 1403,
                'message': 'Your account is not permitted to access this resource'
            }
        ]
    };
    res.status(550).json(messages);
    writeLog(res, createError(messages));
};

var sendServerError = function (res, error) {
    var messages = {
        'errors': [
            {'code': error.errorCode || 500, 'message': error.message || error}
        ]
    };
    if (messages.errors[0].message === 'ETIMEDOUT') {
        messages.errors[0].message = 'Connection attempt timed out.';
    }

    if (error.stack) messages.errors[0].detailMessage = error.stack;

    res.status(500).json(messages);
    writeLog(res, createError(messages));
};

var checkParams = function (arr) {
    return function (req, res, next) {
        // Make sure each param listed in arr is present in req.query
        var missing_params = [];
        for (var i in arr) {
            var param = arr[i];
            if (!req.query[param]) {
                missing_params.push(param);
            }
        }
        if (missing_params.length === 0) {
            next();
        } else {
            sendError(res, null, 'Missing parameter(s): ' + missing_params.join(', '));
        }
    };
};

const adjustErrorMessage = ({ result, resultCode }) => {
    if (parseInt(resultCode, 10) === 2104) {
        return 'Server is unavailable. Please contact an administrator. (Error Code: 2104)';
    }

    if (result === 'This schedule doesn\'t added') {
        return 'Cannot create a schedule.';
    }

    if (result.indexOf('UPDATE brtc_schedule') > -1) {
        return 'Cannot udate a schedule.';
    }

    if (result.indexOf('BrighticsServerException:') > -1) {
        return result.substring(
            result.indexOf('BrighticsServerException:')
            + 'BrighticsServerException:'.length).trim();
    }

    if (result.substring(0, 27) === 'Cannot resolve: Variable opt') {
        return 'The links that connect into the OPT model should be selected to run.';
    }
    return result;
};

var parseError = function (body) {
    try {
        var json = JSON.parse(body);

        if (json.errors && Array.isArray(json.errors)) {
            return json;
        }

        if (json.resultCode && json.result) {
            json.result = adjustErrorMessage(json);
            return {
                'errors': [{
                    'code': json.resultCode,
                    'message': json.result
                }]
            };
        }

        if (json.errorCode) {
            return {
                'errors': [{
                    'code': json.errorCode,
                    'parameter': json.parameter,
                    'message': json.message,
                    'detailMessage': json.detailMessage
                }]
            };
        }

        return {
            'errors': [{
                'code': 0,
                // 'message': 'Sorry! An unexpected error occurred. Please
                // contact administrator.',
                // 'detailMessage': body
                'message': json.message,
                'detailMessage': json.detailMessage
            }]
        };
    } catch (err) {
        // json parse 가 불가한 경우
        return {
            'errors': [{
                'code': 0,
                'message': body
            }]
        };
    }
};

exports.env = function (options) {
};

exports.checkParams = checkParams;
exports.sendError = sendError;
exports.sendServerError = sendServerError;
exports.sendNotAllowedError = sendNotAllowedError;
exports.sendNotAllowedError2 = sendNotAllowedError2;
exports.sendMessage = sendMessage;
exports.parseError = parseError;

exports.ERRORCODES = ERRORCODES;
exports.ERROR_CODE = ERROR_CODE;
