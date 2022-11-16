(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const STATUS = 'status';
    const SUCCESS = 'success';
    const ABORT = 'abort';
    const FAIL = 'fail';
    const CATCH = 'catch';
    const READY = 'ready';
    const PENDING = 'pending';

    function JobDelegator(options) {
        this.eventTypes = [
            STATUS, SUCCESS, ABORT, FAIL, CATCH, READY, PENDING
        ];
        this.initListeners();
        this.setListeners(options || {});
    }

    JobDelegator.prototype.initListeners = function () {
        this.listeners = {};
        this.eventTypes.forEach(function (type) {
            this.listeners[type] = [];
        }.bind(this));
    }

    JobDelegator.prototype.setListeners = function (options) {
        this.eventTypes.forEach(function (type) {
            var callbacks = options[type];
            var listeners = this.listeners[type];
            if (callbacks) {
                // callback이 array인 경우
                if ($.isArray(callbacks)) {
                    callbacks.forEach(function (fn) {
                        if (typeof fn === 'function') {
                            listeners.push(fn);
                        }
                    })
                }
                // callback이 함수인 경우
                else if (typeof callbacks === 'function') {
                    listeners.push(callbacks);
                }
            }
        }.bind(this));
    }

    JobDelegator.prototype.getProcessingUnit = function (callback) {
        if (callback) this.processingUnit = callback;
        return this;
    };    

    JobDelegator.prototype._fire = function (type, res, index) {
        var listeners = this.listeners[type];
        listeners.forEach(function (callback) {
            if (typeof callback === 'function') {
                callback(res, index);
            }
        });
    }

    JobDelegator.prototype._fireStatus = function (res, index) {        
        this._fire(STATUS, res, index);
    };

    JobDelegator.prototype._fireSuccess = function (res, index) {
        this._fire(SUCCESS, res, index);
    };

    JobDelegator.prototype._fireFail = function (res, index) {
        this._fire(FAIL, res, index);
    };

    JobDelegator.prototype._fireAbort = function (res, index) {
        this._fire(ABORT, res, index);
    };

    JobDelegator.prototype._fireCatch = function (err, index) {
        this._fire(CATCH, err, index);
    };

    JobDelegator.prototype._firePending = function (res, index) {
        this._fire(PENDING, res, index);
    };

    Brightics.VA.Core.JobDelegator = JobDelegator;

}).call(this);