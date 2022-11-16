(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Job(options) {
        Brightics.VA.Core.JobDelegator.call(this, options);

        this.runnable = null;
        this._abort = false;
    }

    Job.prototype = Object.create(Brightics.VA.Core.JobDelegator.prototype);
    Job.prototype.constructor = Job;

    Job.prototype._start = function (runnable) {
        var opt = {
            url: 'api/va/v2/analytics/jobs',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            blocking: false,
            data: JSON.stringify(runnable)
        };
        return $.ajax(opt);
    };

    Job.prototype._stop = function (type) {
        var opt = {
            url: 'api/va/v2/analytics/jobs/' + this.runnable.jid + '/delete',
            type: 'POST',
            blocking: false,
            contentType: 'application/json; charset=utf-8'
        };
        if (type) {
            var data = {'type': type};
            opt.data = JSON.stringify(data);
        }
        return $.ajax(opt);
    };

    Job.prototype._check = function (jobId) {
        var option = {
            url: 'api/va/v2/analytics/jobs/' + jobId,
            type: 'GET',
            blocking: false
        };
        return $.ajax(option);
    };

    Job.prototype._scheduleCheckStatus = function (jobId) {
        var _this = this;
        var checkTimer = function () {
            _this._check(jobId).done(function (res) {
                if (_this._abort) {
                    _this._fireAbort({
                        jobId: _this.runnable.jid,
                        end: Date.now(),
                        status: 'ABORT',
                        message: 'Job aborted by user'
                    });
                } else {
                    if (res.status === 'FAIL') {
                        _this._fireFail(res);
                    }
                    else if (res.status === 'SUCCESS') {
                        _this._fireSuccess(res);
                    } else if (res.status === 'WAIT') {
                        _this._firePending(res);
                        setTimeout(checkTimer, 500);
                    } else {
                        _this._fireStatus(res);
                        setTimeout(checkTimer, 500);
                    }
                }
            }).fail(_this._fireCatch.bind(_this));
        };
        setTimeout(checkTimer, 500);
    };

    Job.prototype.start = function (runnable) {
        var _this = this;
        this.runnable = runnable;
        this._start(runnable).done(function () {
            _this._scheduleCheckStatus(runnable.jid);
        }).fail(_this._fireCatch.bind(_this));
    };

    Job.prototype.stop = function (type) {
        this._stop(type);
        this._abort = true;
    };

    Brightics.VA.Core.Job = Job;

}).call(this);