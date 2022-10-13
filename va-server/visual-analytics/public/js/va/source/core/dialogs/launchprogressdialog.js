/**
 * Created by daewon.park on 2016-09-25.
 */
 (function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function LaunchProgressDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);

        this.terminated = false;
    }

    LaunchProgressDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    LaunchProgressDialog.prototype.constructor = LaunchProgressDialog;

    LaunchProgressDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 680;
        this.dialogOptions.height = 540;
        this.dialogOptions.keyboardCloseKey = '';
        this.dialogOptions.closeOnEscape = false;
        this.dialogOptions.create = function () {
            $('.ui-widget-content').css('border-color', '#d4d4d4');
            $('.ui-dialog-titlebar-close', $(this).parent()).hide();
        }
    };

    LaunchProgressDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.parent().parent().addClass('brtc-va-dialogs-launch-progress');
        $parent.addClass('brtc-va-dialogs-launch-progress-contents');

        $parent.append('' +
            '<div class="brtc-va-dialogs-launch-progress-label"><span>Starting...</span><span class="brtc-va-dialogs-launch-progress-elapsed"></span><span></span></div>' +
            '<div class="brtc-va-dialogs-launch-progress-progressbar"></div>' +
            '<div class="brtc-va-dialogs-launch-progress-tab">' +
            '   <ul>' +
            '       <li style="margin-left: 0; width: 80px">Status</li>' +
            '       <li style="width: 80px">Log</li>' +
            '   </ul>' +
            '   <div>' +
            '       <div>' +
            '           <div class="brtc-va-dialogs-launch-progress-processes">' +
            '           </div>' +
            '       </div>' +
            '       <div>' +
            '           <textarea class="brtc-va-dialogs-launch-progress-logs" style="display: none"></textarea>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$progressBar = $parent.find('.brtc-va-dialogs-launch-progress-progressbar').jqxProgressBar({
            theme: Brightics.VA.Env.Theme,
            value: 3,
            animationDuration: 0
        });

        this.$progressTab = $parent.find('.brtc-va-dialogs-launch-progress-tab').jqxRibbon({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 'calc(100% - 70px)',
            position: 'bottom',
            selectionMode: 'click',
            initContent: function (index) {
                if (index == 0) {
                    _this.$processScrollbar = $parent.find('.brtc-va-dialogs-launch-progress-processes').perfectScrollbar();
                } else if (index == 1) {
                    _this.logMirror = CodeMirror.fromTextArea($parent.find('.brtc-va-dialogs-launch-progress-logs')[0], {
                        mode: "text/html",
                        theme: "default",
                        lineNumbers: false,
                        matchBrackets: true,
                        autofocus: false,
                        readOnly: true
                    });
                    _this.logMirror.setSize('100%', '100%');
                }
            }
        }).addClass('brtc-va-dialogs-launch-progress-tab');

        this.$progressTab.jqxRibbon('hideAt', 1);

        setTimeout(this._renderTimer.bind(this), 500);

        this.createCloseOptionCheckBox($parent);
    };

    LaunchProgressDialog.prototype.createDialogButtonBar = function ($parent) {
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);

        this.$okButton.val(Brightics.locale.common.done);
        this.$okButton.css('display', 'none');

        this.$cancelButton.val(Brightics.locale.common.stopRunning);

        this.createDetailButton($parent);
        this.createDetailOptimizationButton($parent);
    };

    LaunchProgressDialog.prototype.createDetailButton = function ($parent) {
        var _this = this;
        this.$detailButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-detail" value="'+Brightics.locale.common.detail+'" />');
        $parent.append(this.$detailButton);
        this.$detailButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        this.$detailButton.click(function () {
            var message = 'JOB ID: ' + _this.options.jobId;
            message += '\n' + (_this.errorDetailMessage || _this.errorMessage);
            new Brightics.VA.Core.Dialogs.DetailDialog(_this.$mainControl, {
                title: Brightics.locale.common.detailInformation,
                detailText: message
            });
        });
        this.$detailButton.hide();
    };

    LaunchProgressDialog.prototype.createDetailOptimizationButton = function ($parent) {
        var _this = this;
        this.$detailOptButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-detail" value="Detail Optimization" />');
        $parent.append(this.$detailOptButton);
        this.$detailOptButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$detailOptButton.click(function () {
            if (_this.optProgressDialog) {
                _this.optProgressDialog.render(_this.eventOriginalResponse);
            } else {
                _this.optProgressDialog = new Brightics.VA.Core.Dialogs.OptProgressDialog(null, {
                    data: _this.eventOriginalResponse,
                    close: function () {
                        _this.optProgressDialog = null;
                    }
                });
            }
        });
        this.$detailOptButton.hide();
    };

    LaunchProgressDialog.prototype._showDetailOptimizationButton = function (originalResponse) {
        var optimization = this._getOptimizationData(originalResponse);
        if (optimization) {
            this.eventOriginalResponse = originalResponse;
            this.$detailOptButton.show();
            if (this.optProgressDialog) {
                this.optProgressDialog.render(this.eventOriginalResponse);
            }
        }
    };

    LaunchProgressDialog.prototype._getOptimizationData = function (originalResponse) {
        if (originalResponse) {
            var processes = originalResponse.processes;
            if (!processes) return null;
            for (var i = processes.length - 1; i >= 0; i--) {
                var functions = processes[i].functions;
                for (var j = functions.length - 1; j >= 0; j--) {
                    var optimization = functions[j].optimization;
                    if (optimization) {
                        return optimization;
                    }
                }
            }
        }
        return null;
    };

    LaunchProgressDialog.prototype.createCloseOptionCheckBox = function ($parent) {
        this.$checkboxDiv = $('<div class = "brtc-va-dialogs-launch-progress-closeoption">'+Brightics.locale.common.closeLaunchProgressDialog+'.</div>');
        $parent.append(this.$checkboxDiv);

        this.$checkboxDiv.jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            checked: Brightics.VA.Env.Session.launchProgressAutoClose
        });
        this.$checkboxDiv.on('change', function (event) {
            var checked = event.args.checked;
            Brightics.VA.Env.Session.launchProgressAutoClose = checked;
        });
    };

    LaunchProgressDialog.prototype.progress = function (event) {
        var label;

        if (event.jid) this.options.jobId = event.jid;

        if (event.eventType == 'BEGIN-JOB') {
            this._beginJob(event.status, event.launchOptions.expectedUnitCount);
        } else if (event.eventType == 'END-JOB') {
            this._endJob(event.status, event.message, event.detailMessage);
        } else if (event.eventType == 'BEGIN-PROCESS') {
            label = event.label || '(default model)';
            this._beginProcess(event.pid, event.status, label, event.count);
        } else if (event.eventType == 'END-PROCESS') {
            this._endProcess(event.pid, event.status, event.begin, event.end);
        } else if (event.eventType == 'BEGIN-UNIT') {
            label = event.label || '(default function)';
            this._beginUnit(event.pid, event.fid, event.status, label, event.message);
        } else if (event.eventType == 'END-UNIT') {
            this._endUnit(event.pid, event.fid, event.status, event.begin, event.end, event.message);
        } else if (event.eventType == 'UPDATE-UNIT') {
            this._updateUnit(event.pid, event.fid, event.status, event.begin, event.end, event.message);
        } else if (event.eventType === 'PENDING-JOB') {
            this._pendingJob(event.status, event.message);
        }

        this.updateStatus(event);
        this._updateProgress(event);
        this._showDetailOptimizationButton(event.originalResponse);
    };

    LaunchProgressDialog.prototype.updateStatus = function (event) {
        var targetEventTypes = ['END-UNIT'];
        if (targetEventTypes.indexOf(event.eventType) > -1) {
            Studio.getEditorContainer().getActiveModelEditor().updateStatus(event);
        }
    };

    LaunchProgressDialog.prototype.handleCancelClicked = function () {
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        Studio.getJobExecutor().terminate(this.options.jobId);
    };

    LaunchProgressDialog.prototype._pendingJob = function (status, message) {
        var label = '0 ' +Brightics.locale.common.process+', 0 '+Brightics.locale.common.functionCompleted+'... (' + message + ')';
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-label > span:nth-child(1)').text(label);
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-label > span:nth-child(1)').attr('title', label);
    };

    LaunchProgressDialog.prototype._updateProgress = function (event) {
        if (this.terminated && Brightics.VA.Env.Session.launchProgressAutoClose && event.status !== 'FAIL') return;

        this._updateProgressLabel(event);
        this._updateProgressBar(event);
    };

    LaunchProgressDialog.prototype._updateProgressLabel = function (event) {
        var completedProcesses = this.$mainControl.find('.brtc-va-dialogs-launch-progress-proc[status="SUCCESS"], .brtc-va-dialogs-launch-progress-proc[status="FAIL"]');
        var completedUnits = this.$mainControl.find('.brtc-va-dialogs-launch-progress-func[status="SUCCESS"], .brtc-va-dialogs-launch-progress-func[status="FAIL"]');

        var label = completedProcesses.length + ' '+Brightics.locale.common.process+', ' + completedUnits.length + ' '+Brightics.locale.common.functionCompleted+'...';

        var pendingStatus = event.eventType === 'PENDING-JOB' ? event.message : '';
        if (this.errorMessage) {
            label = this.errorMessage;
        }
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-label > span:nth-child(1)').text(label);
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-label > span:nth-child(1)').attr('title', label);
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-label > span:nth-child(3)').text(pendingStatus);
    };

    LaunchProgressDialog.prototype._updateProgressBar = function () {
        var value = 10, _this = this;
        var count = this.$mainControl.find('.brtc-va-dialogs-launch-progress-func[status="SUCCESS"]').length;
        if (this.$mainControl.find('.brtc-va-dialogs-launch-progress-contents').attr('STATUS') == 'SUCCESS') {
            value = 100;
        }
        else {
            value = count * 85 / this.expectedUnitCount + 10;
            if (value > 95) {
                this.expectedUnitCount += 10;
                value = count * 85 / this.expectedUnitCount + 10;
            }
        }
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(function () {
            _this.$progressBar.jqxProgressBar({ value: value });
        }, 300);
    };

    LaunchProgressDialog.prototype._renderTimer = function () {
        var _this = this;

        if (this.$mainControl && this.$mainControl.find('.brtc-va-dialogs-launch-progress-elapsed').length) {
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-elapsed').each(function (index) {
                var beginTime = $(this).attr('begin');
                if (beginTime) {
                    beginTime = parseInt(beginTime);
                } else {
                    beginTime = Date.now();
                }
                var endTime = $(this).attr('end');
                if (endTime) {
                    endTime = parseInt(endTime);
                } else {
                    endTime = Date.now();
                }
                var elapsed = _this._elapsedString(endTime - beginTime);
                $(this).text('( ' + elapsed + ' )');
            });
        }

        if (this.terminated == false) {
            setTimeout(this._renderTimer.bind(this), 500);
        } else if (Brightics.VA.Env.Session.launchProgressAutoClose) {
            clearTimeout(this._renderTimer);
            return;
        }
    };

    LaunchProgressDialog.prototype._elapsedString = function (elapsed) {
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        elapsed = elapsed % (1000 * 60 * 60 * 24);
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        elapsed = elapsed % (1000 * 60 * 60);
        const mins = Math.floor(elapsed / (1000 * 60));
        elapsed = elapsed % (1000 * 60);
        const seconds = Math.floor(elapsed / (1000));

        let elapsedTime = '';
        if (days > 0) {
            elapsedTime = days + ' '+Brightics.locale.common.day+' ';
        }
        if (hours > 0) {
            elapsedTime += hours + ' '+Brightics.locale.common.hour+' ';
        }
        if (mins > 0) {
            elapsedTime += mins + ' '+Brightics.locale.common.min+' ';
        }
        if (seconds > 0) {
            elapsedTime += seconds + ' '+Brightics.locale.common.sec+'';
        }

        if (elapsedTime == '') elapsedTime = '1 '+Brightics.locale.common.sec+'';
        return elapsedTime;
    };

    LaunchProgressDialog.prototype._beginJob = function (status, expectedUnitCount) {
        this.expectedUnitCount = expectedUnitCount;

        this.$mainControl.find('.brtc-va-dialogs-launch-progress-contents').attr('STATUS', status);
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-label .brtc-va-dialogs-launch-progress-elapsed').attr('begin', Date.now());
    };

    LaunchProgressDialog.prototype._endJob = function (status, message, detailMessage) {
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-contents').attr('STATUS', status);
        this.$mainControl.find('.brtc-va-dialogs-launch-progress-label .brtc-va-dialogs-launch-progress-elapsed').attr('end', Date.now());
        this.$mainControl.find('.jqx-window-close-button-background').css('visibility', 'visible');
        this.$okButton.css('display', 'block');
        this.$cancelButton.css('display', 'none');

        const renderProgress = (_status) => {
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-proc[status="PROCESSING"] > .brtc-va-dialogs-launch-progress-proc-status').text(this._statusLabel(_status));
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-proc[status="PROCESSING"]').attr('status', _status);
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-func[status="PROCESSING"] > .brtc-va-dialogs-launch-progress-func-status').text(this._statusLabel(_status));
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-func[status="PROCESSING"]').attr('status', _status);

            this.$mainControl.find('.brtc-va-dialogs-launch-progress-proc[status="WAIT"] > .brtc-va-dialogs-launch-progress-proc-status').text(this._statusLabel(_status));
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-proc[status="WAIT"]').attr('status', _status);
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-func[status="WAIT"] > .brtc-va-dialogs-launch-progress-func-status').text(this._statusLabel(_status));
            this.$mainControl.find('.brtc-va-dialogs-launch-progress-func[status="WAIT"]').attr('status', _status);
        }

        if (status === 'FAIL') {
            this.errorMessage = message ? message : '';
            this.errorDetailMessage = detailMessage ? detailMessage : '';

            // if (this.errorMessage.indexOf('SparkException:') == 0 ||
            //     this.errorMessage.indexOf('NoClassDefFoundError:') == 0) {
            //
            //     this.errorMessage = Brightics.locale.common.unexpectedErrorMsg;
            //
            // } else if (this.errorMessage.indexOf('Exception:') == 0) {
            //     // if (this.errorMessage.indexOf('Exception: Proper conditional statement should be entered.') == 0) {
            //     //     this.errorMessage = 'Proper conditional statement should be entered.';
            //     // } else {
            //     this.errorMessage = Brightics.locale.common.unexpectedErrorMsg;
            //     // }
            //
            // } else if (this.errorMessage.indexOf('AnalysisException:') == 0) {
            //
            //     this.errorMessage = this.errorMessage.substring(18, this.errorMessage.length).trim();
            //
            // } else if (this.errorMessage.indexOf('InvalidInputException:') == 0) {
            //
            //     this.errorMessage = Brightics.locale.common.inputNotExistMsg;
            //
            // } else if (this.errorMessage.indexOf('FileNotFoundException:') == 0) {
            //
            //     this.errorMessage = Brightics.locale.common.datasourceNotExistMsg;
            //
            // } else if (this.errorMessage == '{"result":"Cannot execute the flow. It contains invalid contents.","resultCode":1100}') {
            //
            //     this.errorMessage = Brightics.locale.common.notExecuteFlowMsg;
            //
            // } else if (this.errorMessage == Brightics.locale.common.requiredParamCondition + '.\n' + Brightics.locale.common.requiredParamCondition + '.') {
            //
            //     this.errorMessage = Brightics.locale.common.requiredParamCondition + '.';
            //
            // } else if (this.errorMessage.startsWith('/home/brightics/brightics/packages/brightics-agent/repo/BRIGHTICS/script') && this.errorMessage.indexOf('error: not found') > 0) {
            //
            //     this.errorMessage = Brightics.locale.common.invalidScriptContents;
            // } else if (this.errorMessage === "'in-table' is not of Array[String] type.") {
            //     this.errorMessage = Brightics.locale.common.requiredInputs;
            //
            // } else if (this.errorMessage === "Error: Invalid tid ") {
            //     this.errorMessage = Brightics.locale.common.requiredInputs;
            // } else if (this.errorMessage == 'The size of \'fs-paths\' must be 1.') {
            //     this.errorMessage = Brightics.locale.common.requiredParamInputPath + '.';
            // }
            renderProgress(status);
        } else if (status === 'ABORT') {
            renderProgress(status);
        } else if (status === 'SUCCESS') {
            if (this.$checkboxDiv.val() === true) this.handleOkClicked();
        }

        if (this.errorMessage) this.$detailButton.show();
        this.terminated = true;
    };

    LaunchProgressDialog.prototype._beginProcess = function (pid, status, label, count) {
        var $parent = this.$mainControl.find('.brtc-va-dialogs-launch-progress-processes');

        var $proc = $parent.find('.brtc-va-dialogs-launch-progress-proc[id=' + pid + ']');

        if ($proc.length == 0) {
            $proc = $('' +
                '<div class="brtc-va-dialogs-launch-progress-proc">' +
                '    <div class="brtc-va-dialogs-launch-progress-proc-icon">' +
                '        <div class="brtc-va-dialogs-launch-progress-icon"></div>' +
                '    </div>' +
                '    <div class="brtc-va-dialogs-launch-progress-proc-label"></div>' +
                '    <div class="brtc-va-dialogs-launch-progress-proc-status"></div>' +
                '    <div class="brtc-va-dialogs-launch-progress-elapsed brtc-va-dialogs-launch-progress-proc-elapsed"></div>' +
                '    <div class="brtc-va-dialogs-launch-progress-functions">' +
                '    </div>' +
                '</div>');
            $proc.attr('id', pid);
            $parent.append($proc);
            $proc.find('.brtc-va-dialogs-launch-progress-proc-elapsed').attr('begin', Date.now());
            $proc.find('.brtc-va-dialogs-launch-progress-proc-elapsed').removeAttr('end');
        }
        if ($proc.attr('status') === 'WAIT' && status === 'PROCESSING') $proc.find('.brtc-va-dialogs-launch-progress-proc-elapsed').attr('begin', Date.now());
        $proc.attr('status', status);

        var processLabel = count > 1 ? label + ' (' + count + ')' : label;
        $proc.find('.brtc-va-dialogs-launch-progress-proc-label').text(processLabel);
        $proc.find('.brtc-va-dialogs-launch-progress-proc-label').attr('title', processLabel);
        $proc.find('.brtc-va-dialogs-launch-progress-proc-status').text(this._statusLabel(status));

        $proc.find('> .brtc-va-dialogs-launch-progress-functions').empty();
    };

    LaunchProgressDialog.prototype._endProcess = function (pid, status, begin, end) {
        var $proc = this.$mainControl.find('#' + pid + '.brtc-va-dialogs-launch-progress-proc');
        $proc.attr('status', status);
        $proc.find('.brtc-va-dialogs-launch-progress-proc-status').text(this._statusLabel(status));
        $proc.find('.brtc-va-dialogs-launch-progress-proc-elapsed').attr('begin', begin);
        $proc.find('.brtc-va-dialogs-launch-progress-proc-elapsed').attr('end', end);
    };

    LaunchProgressDialog.prototype._beginUnit = function (pid, fid, status, label, message) {
        var $proc = this.$mainControl.find('#' + pid + '.brtc-va-dialogs-launch-progress-proc > .brtc-va-dialogs-launch-progress-functions');

        var $func = $proc.find('.brtc-va-dialogs-launch-progress-func[id=' + fid + ']');

        if ($func.length == 0) {
            $func = $('' +
                '<div class="brtc-va-dialogs-launch-progress-func">' +
                '    <div class="brtc-va-dialogs-launch-progress-func-icon">' +
                '        <div class="brtc-va-dialogs-launch-progress-icon"></div>' +
                '    </div>' +
                '    <div class="brtc-va-dialogs-launch-progress-func-label"></div>' +
                '    <div class="brtc-va-dialogs-launch-progress-func-loop"></div>' +
                '    <div class="brtc-va-dialogs-launch-progress-func-status"></div>' +
                '    <div class="brtc-va-dialogs-launch-progress-elapsed brtc-va-dialogs-launch-progress-func-elapsed"></div>' +
                '    </div>' +
                '</div>');
            $func.attr('id', fid);
            $proc.append($func);
            $func.find('.brtc-va-dialogs-launch-progress-func-elapsed').attr('begin', Date.now());
            $func.find('.brtc-va-dialogs-launch-progress-func-elapsed').removeAttr('end');
        }
        $func.attr('status', status);
        $func.find('.brtc-va-dialogs-launch-progress-func-label').text(label);
        if (message) {
            $func.find('.brtc-va-dialogs-launch-progress-func-loop').text(message);
            $func.find('.brtc-va-dialogs-launch-progress-func-loop').attr('title', message);
        }
        $func.find('.brtc-va-dialogs-launch-progress-func-label').attr('title', label);
        $func.find('.brtc-va-dialogs-launch-progress-func-status').text(this._statusLabel(status));


        // scroll to bottom
        this.$processScrollbar.scrollTop(this.$processScrollbar.prop('scrollHeight'));
        this.$processScrollbar.perfectScrollbar('update');
    };

    LaunchProgressDialog.prototype._endUnit = function (pid, fid, status, begin, end, message) {
        var $func = this.$mainControl.find('#' + pid + '.brtc-va-dialogs-launch-progress-proc #' + fid + '.brtc-va-dialogs-launch-progress-func');
        $func.attr('status', status);
        $func.find('.brtc-va-dialogs-launch-progress-func-status').text(this._statusLabel(status));
        if (message) {
            $func.find('.brtc-va-dialogs-launch-progress-func-loop').text(message);
            $func.find('.brtc-va-dialogs-launch-progress-func-loop').attr('title', message);
        }
        $func.find('.brtc-va-dialogs-launch-progress-func-elapsed').attr('begin', begin);
        $func.find('.brtc-va-dialogs-launch-progress-func-elapsed').attr('end', end);
    };

    LaunchProgressDialog.prototype._updateUnit = function (pid, fid, status, begin, end, message) {
        var $func = this.$mainControl.find('#' + pid + '.brtc-va-dialogs-launch-progress-proc #' + fid + '.brtc-va-dialogs-launch-progress-func');
        $func.attr('status', status);
        if (message) {
            $func.find('.brtc-va-dialogs-launch-progress-func-loop').text(message);
            $func.find('.brtc-va-dialogs-launch-progress-func-loop').attr('title', message);
        }
    };

    LaunchProgressDialog.prototype._statusLabel = function (status) {
        if (status.toLowerCase() == 'wait') return Brightics.locale.common.wait;
        if (status.toLowerCase() == 'processing') return Brightics.locale.common.running;
        if (status.toLowerCase() == 'success') return Brightics.locale.common.success;
        if (status.toLowerCase() == 'fail') return Brightics.locale.common.fail;
        if (status.toLowerCase() == 'abort') return Brightics.locale.common.abort;
        return status;
    };

    Brightics.VA.Core.Dialogs.LaunchProgressDialog = LaunchProgressDialog;

}).call(this);