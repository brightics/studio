/**
 * Created by sds on 2017-08-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    const LOG_LEVEL = {'trace': 0, 'debug': 1, 'info': 2, 'warn': 3, 'error': 4};

    function Log(funcName) {
        this.funcName = funcName;
    };

    Log.prototype.sendLog = function (clientLogLevel, message, options) {
        //TODO: Batch-Compatible Logger
        var bodyOption = $.extend(true, {
            funcNm: this.funcName,
            level: clientLogLevel || 'error',
            message: message
        }, options);
        var option = {
            url: "api/va/log4js",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(bodyOption)
        };

        var sessionLogLevel = Brightics.VA.Env.Session.logLevel.toLowerCase();
        if (LOG_LEVEL[sessionLogLevel] <= LOG_LEVEL[clientLogLevel]) {
            $.ajax(option);
        }
    };

    Log.prototype.trace = function (message, options) {
        this.sendLog('trace', message, options);
        console.log('[' + this.funcName + '] TRACE: ' + message);
    };

    Log.prototype.debug = function (message, options) {
        this.sendLog('debug', message, options);
        console.log('[' + this.funcName + '] DEBUG: ' + message);
    };

    Log.prototype.info = function (message, options) {
        this.sendLog('info', message, options);
        console.log('[' + this.funcName + '] INFO: ' + message);
    };


    Log.prototype.warn = function (message, options) {
        this.sendLog('warn', message, options);
        console.log('[' + this.funcName + '] WRAN: ' + message);
    };
    Log.prototype.error = function (message, options) {
        this.sendLog('error', message, options);
        console.log('[' + this.funcName + '] ERROR: ' + message);
    };


    Brightics.VA.Log = Log;

}).call(this);