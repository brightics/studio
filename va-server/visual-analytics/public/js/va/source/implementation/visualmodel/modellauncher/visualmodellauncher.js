/**
 * Created by daewon.park on 2016-09-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VisualModelLauncher() {
        Brightics.VA.Core.ModelLauncher.call(this);
    }

    VisualModelLauncher.prototype = Object.create(Brightics.VA.Core.ModelLauncher.prototype);
    VisualModelLauncher.prototype.constructor = VisualModelLauncher;

    VisualModelLauncher.prototype.launchUnit = function (fnUnit, args, options, listeners) {
        var launchOptions = {
            mode: 'unit',
            clazz: Brightics.VA.Implementation.Visual.Clazz,
            expectedUnitCount: 1,
            originalModels: [{
                mid: options.mid || fnUnit.parent().mid,
                title: fnUnit.parent().title,
                type: Brightics.VA.Implementation.Visual.Clazz,
                functions: [$.extend(true, {}, fnUnit)],
                getFnUnitById: function () {
                    return;
                }
            }],
            runnable: this._createUnitRunnable(fnUnit, args, options)
        };
        this._launch(launchOptions, options, listeners);
    };

    VisualModelLauncher.prototype._createUnitRunnable = function (fnUnit, args, options) {
        var jobId = this._generateJobId(fnUnit.fid);
        var userId = options.user || Brightics.VA.Env.Session.userId;
        var runnable = Brightics.VA.Core.Utils.RunnableFactory._create(jobId, userId);

        var execUnit = $.extend(true, {}, fnUnit);
        Brightics.VA.Core.Utils.ModelUtils.carvePersist(execUnit, options.persist || false);
        Brightics.VA.Core.Utils.ModelUtils.deleteDisplay(execUnit);
        Brightics.VA.Core.Utils.ModelUtils.deleteEmptyArray(execUnit);

        var mid = options.mid || fnUnit.parent().mid;
        runnable.main = mid;
        runnable.models[mid] = {
            'mid': mid,
            'type': 'data',
            'functions': [execUnit],
            'links': [],
            'entries': [execUnit.fid]
        };
        runnable.version = Brightics.VA.Env.CoreVersion;

        if (execUnit.name === 'SQLExecutor') {
            var model = {
                "title": "SQL Query Executor",
                "mid": mid,
                "type": "script",
                "functions": [
                    {
                        "func": "sql",
                        "name": "SQL",
                        "param": {
                            "script": "select\n\t*\nfrom\n\t#{DF0000}",
                            "limit": "1000",
                            "alias": {
                                "#{DF0000}": "/" + userId + "/" + mid + "/" + execUnit.outData
                            }
                        },
                        "fid": execUnit.fid,
                        "label": execUnit.display.label
                    }
                ],
                "entries": [
                    execUnit.fid
                ],
                "links": []
            }
            runnable.models[mid] = model;
        }
        return runnable;
    };

    VisualModelLauncher.prototype.launchModel = function (model, args, options, listeners) {
        var mid = model.mid;
        var jobId = this._generateJobId(mid);
        var userId = Brightics.VA.Env.Session.userId;
        var launchOptions = {
            mode: 'workflow',
            clazz: Brightics.VA.Implementation.Visual.Clazz,
            originalModels: [model],
            runnable: Brightics.VA.Core.Utils.RunnableFactory.createForFlow(model, jobId, userId, args, options)
        };

        var models = launchOptions.runnable.models;
        for (var modelId in launchOptions.runnable.models) {
            models[modelId].type = 'data';
            var functions = models[modelId].functions;
            for (var i = functions.length - 1; i >= 0; i--) {
                if (functions[i][FUNCTION_NAME] === 'Empty') {
                    functions.splice(i, 1);
                }
            }

            for (var j = 0; j < functions.length - 1; j++) {
                models[modelId].links.push({
                    'sourceFid': functions[j].fid,
                    'targetFid': functions[j + 1].fid
                });
            }
            models[modelId].entries = [models[modelId].entries[0]];
            launchOptions.expectedUnitCount = functions.length;
        }

        this._launch(launchOptions, options, listeners);
    };

    VisualModelLauncher.prototype._launch = function (launchOptions, options, listeners) {
        var _this = this;

        var eventDetector = new Brightics.VA.Implementation.Visual.EventDetector(launchOptions);
        var processingStatusResponse = function (res) {
            for (var i in res.processes) {
                var process = res.processes[i];
                var pid = process.pid || 'pid_undefined';
                var mid = process.mid;

                var events = eventDetector.createProcessEvent(pid, mid, process.begin, process.end, process.status);
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
                if (!options.hideDialog) _this._fireEvents(events);
            }
        };

        var processingJobEndResponse = function (res) {
            var evt = {
                eventType: 'END-JOB',
                jid: res.jobId,
                message: res.message,
                status: res.status,
                launchOptions: launchOptions,
                originalResponse: res
            };
            if (!options.hideDialog) _this._fireEvents([evt]);
            delete _this.jobScheduler[res.jobId];
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
        }
        this._extendListeners(_listeners, listeners);
        var job = new Brightics.VA.Implementation.Visual.Job(_listeners);

        // JOB 스케쥴러에 등록
        // this.jobScheduler[launchOptions.runnable.jid] = job;

        // var evt = {
        //     eventType: 'BEGIN-JOB',
        //     jid: launchOptions.runnable.jid,
        //     status: 'WAIT',
        //     launchOptions: launchOptions
        // };
        // if (!options.hideDialog) _this._fireEvents([evt]);

        job.start(launchOptions.runnable, options).then(function (res) {
            _this.jobScheduler[res.result] = job;
            var evt = {
                eventType: 'BEGIN-JOB',
                jid: res.result,
                status: 'WAIT',
                launchOptions: launchOptions
            };
            if (!options || !options.hideDialog) _this._fireEvents([evt]);
        });
    };

    Brightics.VA.Implementation.Visual.VisualModelLauncher = VisualModelLauncher;

    var _instance = null;
    Brightics.VA.Implementation.Visual.VisualModelLauncher.instance = function () {
        if (_instance == null) {
            _instance = new Brightics.VA.Implementation.Visual.VisualModelLauncher();
        }
        return _instance;
    };

}).call(this);