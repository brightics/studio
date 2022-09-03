/**
 * Created by daewon.park on 2016-09-24.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataFlowLauncher() {
        Brightics.VA.Core.ModelLauncher.call(this);
        this.isProcessing = false;
    }

    DataFlowLauncher.prototype = Object.create(Brightics.VA.Core.ModelLauncher.prototype);
    DataFlowLauncher.prototype.constructor = DataFlowLauncher;

    DataFlowLauncher.prototype.launchUnit = function (fnUnit, args, options, listeners) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.__launchUnit = this.__launchUnit ||
            _.debounce(function (fnUnit, args, options, listeners) {
                var _this = this;
                var jobId = this._generateJobId(fnUnit.fid);
                var userId = Brightics.VA.Env.Session.userId;
                var expectedUnitCount = 1;
                Brightics.VA.Core.Utils.RunnableFactory
                    .createForUnit(fnUnit, jobId, userId, args, options)
                    .then(function (runnable) {
                        var launchOptions = {
                            mode: 'unit',
                            clazz: Brightics.VA.Implementation.DataFlow.Clazz,
                            originalModels: [fnUnit.parent()],
                            expectedUnitCount: expectedUnitCount,
                            runnable: runnable
                        };
                        _this._launch(launchOptions, options, listeners);
                    })
                    .catch(function () {
                        _this.isProcessing = false;
                    });
            }.bind(this), 1000, {leading: true, trailing: false});
        this.__launchUnit(fnUnit, args, options, listeners);
    };

    DataFlowLauncher.prototype.launchModel = function (model, args, options, listeners) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.__launchModel = this.__launchModel ||
            _.debounce(function (model, args, options, listeners) {
                var _this = this;
                var mid = model.mid;
                var jobId = this._generateJobId(mid);
                var userId = Brightics.VA.Env.Session.userId;
                var expectedUnitCount = model.functions.length;
                Brightics.VA.Core.Utils.RunnableFactory
                    .createForFlow(model, jobId, userId, args, options)
                    .then(function (runnable) {
                        var launchOptions = {
                            mode: 'data-flow',
                            clazz: Brightics.VA.Implementation.DataFlow.Clazz,
                            originalModels: [model],
                            expectedUnitCount: expectedUnitCount,
                            runnable: runnable
                        };

                        _this._launch(launchOptions, options, listeners);
                    })
                    .catch(function () {
                        _this.isProcessing = false;
                    });
            }.bind(this), 1000, {leading: true, trailing: false});
        this.__launchModel(model, args, options, listeners);
    };

    DataFlowLauncher.prototype._launch = function (launchOptions, options, listeners) {
        var _this = this;

        var eventDetector = new Brightics.VA.Implementation.DataFlow.EventDetector(launchOptions);        
        var processingStatusResponse = function (res) {
            for (var i in res.processes) {
                var process = res.processes[i];
                var pid = process.pid || 'pid_undefined';
                var mid = process.mid;

                var events = eventDetector.createProcessEvent(pid, mid, process.begin, process.end, process.status, i);
                for (var s in process.functions) {
                    var unit = process.functions[s];
                    if (unit.status == 'PROCESSING') {
                        _this.processingUnit = unit;
                    }
                    events = events.concat(eventDetector.createUnitEvent(pid, mid, unit, s));
                }
                for (var e in events) {
                    events[e].originalResponse = res;
                }
                if (!options || !options.hideDialog) _this._fireEvents(events);
            }
        };
        
        var processingJobEndResponse = function (res) {
            var evt = {
                eventType: 'END-JOB',
                jid: res.jobId,
                // message: res.message,
                message: _this._getProcessingMessage(res),
                detailMessage: _this._getProcessingDetailMessage(res),
                status: res.status,
                launchOptions: launchOptions,
                originalResponse: res
            };
            if (!options || !options.hideDialog) _this._fireEvents([evt]);
            delete _this.jobScheduler[res.jobId];
            _this.isProcessing = false;
        };

        var processingJobPendingResponse = function (res) {
            var evt = {
                eventType: 'PENDING-JOB',
                jid: res.jobId,
                // message: res.message,
                message: _this._getPendingMessage(res),
                status: res.status,
                launchOptions: launchOptions,
                originalResponse: res
            };
            if (!options || !options.hideDialog) _this._fireEvents([evt]);
        };

        var _listeners = {
            'status': [function (res) {
                processingStatusResponse(res);
            }],
            'success': [function (res) {
                processingStatusResponse(res);
                processingJobEndResponse(res);
            }],
            'abort': [function (res) {
                processingJobEndResponse(res);
            }],
            'fail': [function (res) {
                processingStatusResponse(res);
                processingJobEndResponse(res);
            }],
            'pending': [function (res) {
                processingJobPendingResponse(res);
            }],
            'catch': [function (err) {
                processingJobEndResponse({
                    jobId: launchOptions.runnable.jid,
                    status: 'FAIL',
                    exception: err
                });
            }]
        };
        this._extendListeners(_listeners, listeners);
        var job = new Brightics.VA.Implementation.DataFlow.Job(_listeners);

        job.start(launchOptions.runnable).then(function (res) {
            var jobId = res.result;
            _this.jobScheduler[jobId] = job;
            var evt = {
                eventType: 'BEGIN-JOB',
                jid: jobId,
                status: 'WAIT',
                launchOptions: launchOptions
            };
            if (!options || !options.hideDialog) _this._fireEvents([evt]);
        });
    };

    Brightics.VA.Implementation.DataFlow.DataFlowLauncher = DataFlowLauncher;

}).call(this);