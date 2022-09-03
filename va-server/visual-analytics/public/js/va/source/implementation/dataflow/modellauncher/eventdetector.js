(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EventDetector(launchOptions) {
        this.cache = {};
        this.labelMap = {};
        this.subflowMap = {};
        this.innerModelMap = {};
        this.launchOptions = launchOptions;

        // Core와 맞춘 후 제거할 코드
        // for (var i in this.launchOptions.originalModels) {
        //     var model = this.launchOptions.originalModels[i];
        //     this.labelMap[model.mid] = model.title;
        //     this._scanFunctions2(model.mid, model);
        // }

        var models = this.launchOptions.runnable.models;
        for (var modelKey in models) {
            var model = models[modelKey];
            this._scanModel(modelKey, model);
        }
    }

    EventDetector.prototype._scanModel = function (modelKey, model, parentModelKey) {
        var pid = modelKey + '_pid';
        this.labelMap[pid] = model.title;
        this._scanFunctions(modelKey, model, parentModelKey);

        var innerModels = model.innerModels;
        for (var innerModelkey in innerModels) {
            var innerModel = innerModels[innerModelkey];
            this._scanModel(innerModelkey, innerModel, modelKey);
        }
    }

    EventDetector.prototype._scanFunctions = function (mid, model, parentId) {
        if(parentId) mid = parentId;
        for (var i = 0; i < model.functions.length; i++) {
            var fnUnit = model.functions[i];
            var key = mid + '_' + fnUnit.fid;

            this.labelMap[key] = fnUnit.label;
            // Subflow 의 경우 backend 에서 Subflow 의 BEGIN, END 상태를 주지 않는다.
            // Subflow 의 첫번째 함수가 시작되었을 때 Subflow 를 BEGIN 상태로
            // Subflow 의 마지막 함수가 종료되었을 때 Subflow 를 END 상태로 변경하기 위해 저장한다.
            if (fnUnit[FUNCTION_NAME] == 'Subflow' && fnUnit.param.functions.length > 0) {
                var subflow = {
                    fid: fnUnit.fid,
                    first: fnUnit.param.functions[0].fid,
                    last: fnUnit.param.functions[fnUnit.param.functions.length - 1].fid
                };
                for (var s in fnUnit.param.functions) {                    
                    var func = fnUnit.param.functions[s];
                    this.subflowMap[mid + '_' + func.fid] = subflow;
                }
            } 
            else if (fnUnit[FUNCTION_NAME] == 'ForLoop'
                || fnUnit[FUNCTION_NAME] == 'WhileLoop'
                || fnUnit[FUNCTION_NAME] == 'If') {
                var label = fnUnit.label;
                var innerModelId = fnUnit.param.mid;
                this.innerModelMap[innerModelId] = label;
            } 
            else if (fnUnit.param.functions) {
                this._scanFunctions(mid, fnUnit.param, fnUnit.fid);
            }
        }
    };

    // Core와 맞춘 후 제거할 코드
    // EventDetector.prototype._scanFunctions2 = function (mid, model, parentId) {
    //     for (var j in model.functions) {
    //         var fnUnit = model.functions[j],
    //             key = mid + '_' + fnUnit.fid;

    //         this.labelMap[key] = fnUnit.display.label;
    //         // Subflow 의 경우 backend 에서 Subflow 의 BEGIN, END 상태를 주지 않는다.
    //         // Subflow 의 첫번째 함수가 시작되었을 때 Subflow 를 BEGIN 상태로
    //         // Subflow 의 마지막 함수가 종료되었을 때 Subflow 를 END 상태로 변경하기 위해 저장한다.
    //         if (fnUnit[FUNCTION_NAME] == 'Subflow' && fnUnit.param.functions.length > 0) {
    //             var subflow = {
    //                 fid: fnUnit.fid,
    //                 first: fnUnit.param.functions[0].fid,
    //                 last: fnUnit.param.functions[fnUnit.param.functions.length - 1].fid
    //             };
    //             for (var s in fnUnit.param.functions) {
    //                 var func = fnUnit.param.functions[s];
    //                 this.subflowMap[mid + '_' + func.fid] = subflow;
    //             }
    //         } else if (fnUnit.param.functions) {
    //             this._scanFunctions(mid, fnUnit.param, fnUnit.fid);
    //         }
    //     }
    // };

    EventDetector.prototype.createUnitEvent = function (pid, mid, unit, sequence) {
        var events = [], evt;

        evt = this._createUnitStartEvent(pid, mid, unit, sequence);
        if (evt) events.push(evt);

        evt = this._createUnitEndEvent(pid, mid, unit, sequence);
        if (evt) events.push(evt);

        return events;
    };

    EventDetector.prototype._createUnitStartEvent = function (pid, mid, unit, sequence) {
        if (!this.cache[pid]) return;
        // if (unit.fid.indexOf('read_alluxio_pagination') > -1) return;
        // if (unit.fid.indexOf('write_alluxio_pagination') > -1) return;
        if (unit.fid.indexOf('internal_function') > -1) return;

        var fid = unit.fid;
        var cacheId;
        // Subflow 의 sub function 일 경우 Subflow 가 시작된 것이다.
        var subflow = this.subflowMap[mid + '_' + unit.fid];
        if (subflow) {
            fid = subflow.fid;
            cacheId = fid;
        } else {
            cacheId = fid + '@' + sequence;
        }

        // WAIT 가 아니고 해당 PID & FID 에 해당하는 Cache 가 없는 경우만 UNIT 이 Start 된 경우
        if (unit.status !== 'WAIT' && !this.cache[pid][cacheId]) {
            let evt = {
                eventType: 'BEGIN-UNIT',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                fid: fid,
                status: 'PROCESSING',
                label: this.labelMap[mid + '_' + fid],
                begin: unit.begin,
                message: unit.message,
                sequence: sequence
            };
            if (unit.fid.indexOf('read_alluxio_pagination') > -1) {
                evt.label = '(read)';
            } else if (unit.fid.indexOf('write_alluxio_pagination') > -1) {
                evt.label = '(write)';
            }
            this.cache[pid][cacheId] = {
                event: evt
            };
            return evt;
        } else if (this.cache[pid][cacheId]
            && (this.cache[pid][cacheId].event.begin != unit.begin || this.cache[pid][cacheId].event.status == 'SUCCESS')) {
            let evt = {
                eventType: 'BEGIN-UNIT',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                fid: fid,
                status: 'PROCESSING',
                label: this.labelMap[mid + '_' + fid],
                begin: unit.begin,
                message: unit.message,
                sequence: sequence
            };
            if (unit.fid.indexOf('read_alluxio_pagination') > -1) {
                evt.label = '(read)';
            } else if (unit.fid.indexOf('write_alluxio_pagination') > -1) {
                evt.label = '(write)';
            }
            this.cache[pid][cacheId] = {
                event: evt
            };
            return evt;
        } else if (this.cache[pid][cacheId]
            && (this.cache[pid][cacheId].event.begin != unit.begin || this.cache[pid][cacheId].event.status == 'PROCESSING')) {
            var evt = {
                eventType: 'UPDATE-UNIT',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                fid: fid,
                status: 'PROCESSING',
                label: this.labelMap[mid + '_' + fid],
                begin: unit.begin,
                message: unit.message,
                sequence: sequence
            };
            if (unit.fid.indexOf('read_alluxio_pagination') > -1) {
                evt.label = '(read)';
            } else if (unit.fid.indexOf('write_alluxio_pagination') > -1) {
                evt.label = '(write)';
            }
            this.cache[pid][cacheId] = {
                event: evt
            };
            return evt;
        } else if (this.cache[pid][cacheId]
            && (this.cache[pid][cacheId].event.begin != unit.begin || this.cache[pid][cacheId].event.status == 'SUCCESS')) {
                let evt = {
                eventType: 'BEGIN-UNIT',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                fid: fid,
                status: 'PROCESSING',
                label: this.labelMap[mid + '_' + fid],
                begin: unit.begin,
                sequence: sequence
            };
            if (unit.fid.indexOf('read_alluxio_pagination') > -1) {
                evt.label = '(read)';
            } else if (unit.fid.indexOf('write_alluxio_pagination') > -1) {
                evt.label = '(write)';
            }
            this.cache[pid][cacheId] = {
                event: evt
            };
            return evt;
        } else if (this.cache[pid][cacheId]
            && (this.cache[pid][cacheId].event.begin != unit.begin || this.cache[pid][cacheId].event.status == 'SUCCESS')) {
                let evt = {
                eventType: 'BEGIN-UNIT',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                fid: fid,
                status: 'PROCESSING',
                label: this.labelMap[mid + '_' + fid],
                begin: unit.begin,
                sequence: sequence
            };
            if (unit.fid.indexOf('read_alluxio_pagination') > -1) {
                evt.label = '(read)';
            } else if (unit.fid.indexOf('write_alluxio_pagination') > -1) {
                evt.label = '(write)';
            }
            this.cache[pid][cacheId] = {
                event: evt
            };
            return evt;
        }
    };

    EventDetector.prototype._createUnitEndEvent = function (pid, mid, unit, sequence) {
        var fid = unit.fid;
        var cacheId;
        // Subflow 의 sub function 일 경우 마지막 sub function 이 끝난 경우에만 Subflow 가 끝난 것이다.
        var subflow = this.subflowMap[mid + '_' + unit.fid];
        if (subflow) {
            fid = subflow.fid;
            cacheId = fid;
        } else {
            cacheId = fid + '@' + sequence;
        }

        if (this.cache[pid] &&
            this.cache[pid][cacheId] &&
            this.cache[pid][cacheId].event.status == 'PROCESSING' &&
            this.cache[pid][cacheId].event.status != unit.status) {

            this.cache[pid][cacheId].event.status = unit.status;
            return {
                eventType: 'END-UNIT',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                fid: fid,
                status: unit.status,
                label: this.labelMap[mid + '_' + fid],
                begin: unit.begin,
                end: unit.end,
                message: unit.message,
                sequence: sequence
            };

        }
    };

    EventDetector.prototype.createProcessEvent = function (pid, mid, begin, end, status, index) {
        var events = [], evt;

        evt = this._createProcessStartEvent(pid, mid, begin, index);
        if (evt) events.push(evt);

        evt = this._createProcessEndEvent(pid, mid, begin, end, status);
        if (evt) events.push(evt);

        return events;
    };

    EventDetector.prototype._createProcessStartEvent = function (pid, mid, begin, index) {
        if (mid.indexOf('internal_process') > -1) return;
        if (!this.cache[pid] || index != '0') {
            var evt = {
                eventType: 'BEGIN-PROCESS',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                label: this.labelMap[pid],
                status: 'PROCESSING',
                begin: begin
            };
            this.cache[pid] = {
                mid: evt.mid,
                status: evt.status
            };
            return evt;
        }
    };

    EventDetector.prototype._createProcessEndEvent = function (pid, mid, begin, end, status) {
        if (this.cache[pid] && this.cache[pid].status == 'PROCESSING' && this.cache[pid].status != status) {
            return {
                eventType: 'END-PROCESS',
                launchOptions: this.launchOptions,
                pid: pid,
                mid: mid,
                label: this.labelMap[pid],
                status: status,
                begin: begin,
                end: end
            };
        }
    };

    Brightics.VA.Implementation.DataFlow.EventDetector = EventDetector;

}).call(this);