/**
 * Created by SDS on 2017-05-24.
 */
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

    Job.prototype._start = function (runnable, options) {
        var url = 'api/va/v2/analytics/jobs/execute';
        if (options.publish) {
            url = 'publish/jobs/execute';
        }
        var opt = {
            url: url,
            type: 'POST',
            blocking: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(Object.assign(options.publish ? { user: options.user } : {},
                runnable)),
        };
        return Promise.resolve($.ajax(opt)).then(function (jsonString) {
            return JSON.parse(jsonString);
        });
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

    Job.prototype._check = function (jobId, options) {
        var url = 'api/va/v2/analytics/jobs/' + jobId;
        if(options.publish) {
            url = 'publish/jobs/' + jobId;
        }

        var option = {
            url: url,
            blocking: false,
            type: 'GET'
        };
        return $.ajax(option);
    };

    Job.prototype._scheduleCheckStatus = function (jobId, options) {
        var _this = this;
        var checkTimer = function () {
            _this._check(jobId, options).done(function (res) {
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
                        setTimeout(checkTimer, 3000);
                    } else {
                        _this._fireStatus(res);
                        setTimeout(checkTimer, 3000);
                    }
                }
            }).fail(_this._fireCatch.bind(_this));
        };
        setTimeout(checkTimer, 2000);
    };

    Job.prototype.start = function (runnable, options) {
        var _this = this;
        this.runnable = runnable;
        return this._start(runnable, options)
            .then(function (res) {
                _this._scheduleCheckStatus(res.result, options);
                return res;
            }, _this._fireCatch.bind(_this));
    };

    Job.prototype.stop = function (type) {
        this._stop(type);
        this._abort = true;
    };

    Brightics.VA.Implementation.Visual.Job = Job;

}).call(this);