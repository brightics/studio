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
            url: 'api/va/v2/analytics/jobs/execute',
            data: JSON.stringify(runnable),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };
        return Promise.resolve($.ajax(opt)).then(function (jsonString) {
            return JSON.parse(jsonString);
        });
    };

    Job.prototype._stop = function (type) {
        var opt = {
            url: 'api/va/v2/analytics/jobs/' + this.jobId + '/delete',
            type: 'POST',
            blocking: false,
            contentType: 'application/json; charset=utf-8'
        };
        if (type) {
            var data = { 'type': type };
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
                        jobId: jobId,
                        end: Date.now(),
                        status: 'ABORT',
                        message: 'Job aborted by user'
                    });
                } else {
                    if (res.status === 'FAIL') {
                        _this._fireFail(res);
                    } else if (res.status === 'SUCCESS') {
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
        return this._start(runnable).then(function (res) {
            _this.jobId = res.result;
            _this._scheduleCheckStatus(res.result);
            return res;
        }, _this._fireCatch.bind(_this));
    };

    Job.prototype.stop = function (type) {
        this._stop(type);
        this._abort = true;
    };

    Brightics.VA.Implementation.DataFlow.Job = Job;

}).call(this);