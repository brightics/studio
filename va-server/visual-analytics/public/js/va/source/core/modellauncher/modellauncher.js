/**
 * Created by daewon.park on 2016-09-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ModelLauncher() {
        this.jobScheduler = {};
    }

    ModelLauncher.prototype._generateJobId = function (mainId) {
        return 'va_' + mainId + '_' + moment(Date.now()).format('YYYYMMDDHHmmssSSS');
    };

    ModelLauncher.prototype.launchUnit = function (fnUnit, args, options, listeners) {
        console.error('must implement Function launchUnit');
    };

    ModelLauncher.prototype.launchModel = function (model, args, options, listeners) {
        console.error('must implement Function launchModel');
    };

    ModelLauncher.prototype._launch = function (launchOptions, args, options, listeners) {
        console.error('must implement Function _launch');        
    };

    ModelLauncher.prototype._extendListeners = function (defaultListeners, listeners) {
        var _listeners = defaultListeners;
        for (var type in listeners) {
            var listener = listeners[type];
            if (listener) {
                if ($.isArray(listener)) {
                    listener.forEach(function (fn) {
                        if (!_listeners[type]) _listeners[type] = [];
                        _listeners[type].push(fn);
                    })
                }
                else if (typeof listener === 'function') {
                    if (!_listeners[type]) _listeners[type] = [];
                    _listeners[type].push(listener);
                }
            }
        }
    }

    ModelLauncher.prototype.terminate = function (jobId) {
        var job = this.jobScheduler[jobId];
        if (job) {
            job.stop();
            delete this.jobScheduler[jobId];
        }
    };

    ModelLauncher.prototype._getPendingMessage = function (res) {
        return res.pendingStatus || 'Pending';
    };

    ModelLauncher.prototype._getProcessingMessage = function (res) {
        var exceptErrorCodeList = ['BR-0021', 'BR-0022', 'BR-0023', 'BR-0024', 'BR-0025', 'BR-0026'];
        if (res.errorInfo) {
            var failedFuncId = this._getFailedFuncId(res);
            var messages = [];
            for (var i in res.errorInfo) {
                var errorInfo = res.errorInfo[i];
                if (errorInfo.errorCode) { // 예전 버전
                    var model = Studio.getEditorContainer().getActiveModelEditor().getModel();
                    var funcName = model.getFnUnitNameById(failedFuncId);
                    var params = Brightics.VA.Core.Utils.MessageUtils.getFunctionLabels(funcName, res.errorInfo[i].parameter);
                    messages.push(Brightics.VA.Core.Utils.MessageUtils.getMessage(res.errorInfo[i].errorCode, params));
                    if (res.errorInfo[i].detailMessage) messages.push(res.errorInfo[i].detailMessage);
    
                    if ($.inArray(res.errorInfo[i].errorCode, exceptErrorCodeList) > -1) {
                        var message = [];
                        message.push(Brightics.VA.Core.Utils.MessageUtils.getMessage(res.errorInfo[i].errorCode, params));
                        return message.join('\n');
                    }
                } else {
                    if (errorInfo.message) {
                        messages.push(errorInfo.message);
                    }
                }
            }
            return messages.join('\n');
        } else {
            return res.message || '';
        }

    };

    ModelLauncher.prototype._getProcessingDetailMessage = function (res) {
        if (res.errorInfo) {
            var detailMessages = [];
            for (var i in res.errorInfo) {
                var errorInfo = res.errorInfo[i];
                if (errorInfo.detailMessage) {
                    detailMessages.push(errorInfo.detailMessage);
                }
            }
            return detailMessages.join('\n');
        } else {
            return res.detailMessage || '';
        }
    };

    ModelLauncher.prototype._getFailedFuncId = function (res) {
        var processes = res.processes;

        for (var i in processes) {
            var functions = processes[i].functions;
            for (var j in functions) {
                if (functions[j].status === 'FAIL') {
                    return functions[j].fid;
                }
            }
        }
    };

    ModelLauncher.prototype._fireEvents = function (events) {
        // 하나의 PROCESS 에 대한 EVENT 만 들어온다고 가정한다.
        // 즉 BEGIN-PROCESS(혹은 END-PROCESS) 가 2개 이상 들어올 일은 없다.
        // BEGIN-PROCESS, BEGIN-UNIT, END-UNIT, END-PROCESS 순으로 정렬한다.
        var eventOrder = {
            'BEGIN-JOB': 0,
            'PENDING-JOB': 1,
            'BEGIN-PROCESS': 2,
            'BEGIN-UNIT': 3,
            'END-UNIT': 4,
            'END-PROCESS': 5,
            'END-JOB': 6
        };
        events.sort(function (e1, e2) {
            var order = eventOrder[e1.eventType] - eventOrder[e2.eventType];
            if (order == 0) {
                return e1.begin - e2.begin;
            } else {
                return order;
            }
        });
        for (var i in events) {
            Studio.getInstance().fireDebugEvent(events[i]);
        }
    };

    Brightics.VA.Core.ModelLauncher = ModelLauncher;

}).call(this);