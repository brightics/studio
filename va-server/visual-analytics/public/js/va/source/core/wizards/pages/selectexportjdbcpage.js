/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    function SelectExportJdbcPage(parentId, options) {
        this.options = options;
        this.options.class = 'SelectExportJdbcPage';
        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    SelectExportJdbcPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectExportJdbcPage.prototype.constructor = SelectExportJdbcPage;

    SelectExportJdbcPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        this.options.wizard.$btnFinish.jqxButton({disabled: true});

        this.$message.text('');
        this.options.wizard.result.data = this.options.wizard.result.data || [];
        this.options.wizard.result.columnType = this.options.wizard.result.columnType || {};
        this.options.wizard.result.jdbc = this.options.wizard.result.jdbc || {};

        if (this.$host.jqxInput('val') != '' && this.$port.jqxInput('val') != '' && this.$service.jqxInput('val') != ''
            && this.$username.jqxInput('val') != '' && this.$password.jqxInput('val') != '' && this.$tablename.jqxInput('val') != '')
            this.$contentsControl.find('.connect').jqxButton({disabled: false});
        else
            this.$contentsControl.find('.connect').jqxButton({disabled: true});
    };

    SelectExportJdbcPage.prototype.createHeaderArea = function ($parent) {
    };

    SelectExportJdbcPage.prototype.refreshConnectControl = function () {
        this.$message.text('');

        var host = this.$host.val(), port = this.$port.val();
        var $connect = this.$contentsControl.find('.connect');
        if (host != '' && port != ''
            && this.$service.jqxInput('val') != ''
            && this.$username.jqxInput('val') != ''
            && this.$password.jqxInput('val') != ''
            && this.$tablename.jqxInput('val') != '')
            $connect.jqxButton({disabled: !(IP_REGEX.test(host) && (Brightics.VA.Core.Utils.InputValidator.isValid.integerType(port) && port < 65535))});
        else
            $connect.jqxButton({disabled: true});
    };

    SelectExportJdbcPage.prototype.createContentsArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createContentsArea.call(this, $parent);
        var _this = this;

        this.$progress = $('' +
            '   <div class="brtc-va-progress">' +
            '       <div>' +
            '           <span class="brtc-va-progress-loading"/>' +
            '           <p>Exporting...</p>' +
            '       </div>' +
            '</div>');
        $parent.append(this.$progress);
        this.$progress.hide();

        $parent.append($('' +
            '   <div class="brtc-va-wizard-contents-property export-file-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Export File :</div>' +
            '       <div class="contents filename">' +

            '       </div>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property db-type-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">DB Type :</div>' +
            '       <div class="brtc-va-wizard-contents-property-input db-type" />' +
            '       <input type="button" class="connect" value="Connection Test"/>' +
            '       <div class="message-container"><span class="message"/></div>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">Host :</div>' +
            '       <input type="text" class="brtc-va-wizard-contents-property-input host" maxlength="80"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">Port :</div>' +
            '       <input type="text" class="brtc-va-wizard-contents-property-input port" maxlength="5"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">Service :</div>' +
            '       <input type="text" class="brtc-va-wizard-contents-property-input service" maxlength="80"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">Username :</div>' +
            '       <input type="text" class="brtc-va-wizard-contents-property-input username" maxlength="80"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">Password :</div>' +
            '       <input type="password" class="brtc-va-wizard-contents-property-input password" maxlength="80"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">Table Name :</div>' +
            '       <input type="text" class="brtc-va-wizard-contents-property-input tablename" maxlength="80"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property connection-timeout-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Connection :</div>' +
            '       <div  class="brtc-va-wizard-contents-property-input connection-timeout"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property login-timeout-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Login :</div>' +
            '       <div  class="brtc-va-wizard-contents-property-input login-timeout"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property socket-timeout-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Socket :</div>' +
            '       <div  class="brtc-va-wizard-contents-property-input socket-timeout"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property lock-timeout-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Lock :</div>' +
            '       <div  class="brtc-va-wizard-contents-property-input lock-timeout"/>' +
            '   </div>'));

        this.$dbtype = $parent.find(".db-type");
        this.$dbtype.jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            source: ["Postgre"],
            selectedIndex: 0
        });
        $parent.find(':text').jqxInput({
            theme: Brightics.VA.Env.Theme,
            maxLength: 30
        });
        $parent.find(':password').jqxInput({
            theme: Brightics.VA.Env.Theme,
            maxLength: 30
        });

        $parent.find('.connect').jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: 150,
            height: 27
        });

        $parent.jqxValidator({
            hintType: 'label',
            animationDuration: 10,
            closeOnClick: false,
            rules: [
                {
                    input: '.host',
                    message: '[0~255].[0~255].[0~255].[0~255]',
                    action: 'keyup',
                    rule: function (inputs, commit) {
                        var $target = _this.findActivatedInput(inputs);
                        return ($target) ? IP_REGEX.test($target.val()) : false;
                    }
                }, {
                    input: '.port',
                    message: '[0~65535]',
                    action: 'keyup',
                    rule: function (inputs, commit) {
                        var $target = _this.findActivatedInput(inputs);
                        return ($target) ? Brightics.VA.Core.Utils.InputValidator.isValid.integerType($target.val()) && $target.val() < 65536 : false;
                    }
                }
            ]
        });
        this.$host = $parent.find('.host');
        this.$port = $parent.find('.port');
        this.$service = $parent.find('.service');
        this.$username = $parent.find('.username');
        this.$password = $parent.find('.password');
        this.$connectionTimeout = new Brightics.VA.Core.Widget.Controls.NumericInput($parent.find('.connection-timeout'), {
            numberType: 'int',
            minus: false,
            placeholder: 'Timeout(sec) Default: 600',
            max: 3000
        });

        $parent.find('.connection-timeout').find('.brtc-va-widgets-controls-numericInput').addClass('widthfree');

        this.$loginTimeout = new Brightics.VA.Core.Widget.Controls.NumericInput($parent.find('.login-timeout'), {
            numberType: 'int',
            minus: false,
            placeholder: 'Timeout(sec) Default: 600',
            max: 3000
        });
        $parent.find('.login-timeout').find('.brtc-va-widgets-controls-numericInput').addClass('widthfree');

        this.$socketTimeout = new Brightics.VA.Core.Widget.Controls.NumericInput($parent.find('.socket-timeout'), {
            numberType: 'int',
            minus: false,
            placeholder: 'Timeout(sec) Default: 600',
            max: 3000
        });
        $parent.find('.socket-timeout').find('.brtc-va-widgets-controls-numericInput').addClass('widthfree');

        this.$lockTimeout = new Brightics.VA.Core.Widget.Controls.NumericInput($parent.find('.lock-timeout'), {
            numberType: 'int',
            minus: false,
            placeholder: 'Timeout(sec) Default: 600',
            max: 3000
        });
        $parent.find('.lock-timeout').find('.brtc-va-widgets-controls-numericInput').addClass('widthfree');

        this.$tablename = $parent.find('.tablename');
        this.$message = $parent.find('.message');

        $parent.find(':text').on('change', function () {
            _this.refreshConnectControl();
        });

        $parent.find(':password').on('change', function () {
            _this.refreshConnectControl();
        });

        $parent.find('.connect').on('click', function () {
            _this.refreshControlValues();

            $.ajax({
                type: 'GET',
                url: 'api/va/v2/rsa/publickey',
                blocking: true
            }).done(function (data) {
                var rsa = new RSAKey();
                _this.publicN = data.publicN;
                _this.publicE = data.publicE;
                rsa.setPublic(data.publicN, data.publicE);
                var encrypted_password = rsa.encrypt(_this.options.wizard.result.jdbc.password);

                var option = {
                    url: 'api/va/v2/datasources/external/query',
                    method: 'POST',
                    data: {
                        dbtype: _this.options.wizard.result.jdbc.dbtype,
                        host: _this.options.wizard.result.jdbc.host,
                        port: _this.options.wizard.result.jdbc.port,
                        service: _this.options.wizard.result.jdbc.service,
                        username: _this.options.wizard.result.jdbc.username,
                        password: encrypted_password
                    },
                    blocking: true
                };

                $.ajax(option).done(function (data) {
                    _this.$message.text('SUCCESS');
                    _this.options.wizard.$btnFinish.jqxButton({disabled: false});
                }).fail(function (err) {
                    _this.$message.text('FAILED');
                    _this.options.wizard.$btnFinish.jqxButton({disabled: true});
                });
            }).fail(function (err) {
                _this.$message.text('FAILED');
                _this.options.wizard.$btnFinish.jqxButton({disabled: true});
            });
        });

        _this.handleExportFileSelected();
    };

    SelectExportJdbcPage.prototype.doFinish = function (callback) {
        var _this = this;
        var rsa = new RSAKey();
        rsa.setPublic(_this.publicN, _this.publicE);
        _this.exportJDBCData(this.options);
    };

    SelectExportJdbcPage.prototype.createExportDataOption = function (path) {
        var _this = this;

        this.refreshControlValues();

        var jid = 'va_mexportdata_' + moment(Date.now()).format('YYYYMMDDHHmmssSSS');
        var fnUnit = {
            'fid': 'fexportdata',
            'func': 'exportData',
            'name': 'ExportData',
            'label': 'Export Data',
            'persist': true,
            'persist-mode': 'auto'
        };

        if (this.options.wizard.result.copyFrom === 'jdbc') {
            fnUnit.param = {
                'copy-to': 'jdbc',
                'ip': this.options.wizard.result.jdbc.host,
                'port': this.options.wizard.result.jdbc.port,
                'input-path': this.options.wizard.options.path,
                // 'output-path': outputPath + this.options.wizard.result.jdbc.tablename,
                'db-type': this.options.wizard.result.jdbc.dbtype.toLowerCase(),
                'username': this.options.wizard.result.jdbc.username,
                'password': this.options.wizard.result.jdbc.password,
                'db-name': this.options.wizard.result.jdbc.service,
                'table-name': this.options.wizard.result.jdbc.tablename,
                'connection-timeout': _this.options.wizard.result.jdbc.connectiontimeout.toString(),
                'login-timeout': _this.options.wizard.result.jdbc.logintimeout.toString(),
                'socket-timeout': _this.options.wizard.result.jdbc.sockettimeout.toString(),
                'lock-timeout': _this.options.wizard.result.jdbc.locktimeout.toString()
            }
        }
        //else {
        //    fnUnit.param = {
        //        'fs-type': 'alluxio',
        //        'copy-to': 'alluxio',
        //        'input-path': path.remotePath,
        //        'output-path': outputPath + path.fileName
        //    }
        //}

        return Brightics.VA.Core.Utils.RunnableFactory
            .createForDummy(fnUnit, jid, Brightics.VA.Env.Session.userId);
    };

    SelectExportJdbcPage.prototype.exportJDBCData = function (option) {
        var _this = this,
            options = this.createExportDataOption(option),
            checkTimer = function (jid) {
                _this._checkProgress(options.user, jid).done(function (result) {
                    if (result.status == 'PROCESSING') {
                        setTimeout(checkTimer.bind(_this, jid), 3000);
                    } else if (result.status == 'SUCCESS') {
                        _this.progress(false);
                    } else {
                        var messages = {
                            'errors': [
                                {
                                    'message': 'Failed to export data.',
                                    'code': 400
                                }
                            ]
                        };

                        if (result.responseJSON && result.responseJSON.errors) {
                            messages = result.responseJSON;
                            messages.errors[0].contentType = result.getResponseHeader('Content-Type');
                        } else if (result.errorInfo && result.errorInfo[0]) {
                            messages.errors[0].message = result.errorInfo[0].message;
                        }
                        _this.progress(false, messages);
                    }
                }).fail(function (err) {
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err, function () {
                        _this.$parent.parent().dialog('destroy');
                    });
                });
            };

        var opt = {
            url: 'api/va/v2/analytics/jobs/execute',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(options),
            blocking: false  //[Ajax Dim] progress함수에서 Dim 로직 수행하므로 false. 2017.08.01
        };

        $.ajax(opt).done(function (_res) {
            var res = JSON.parse(_res);
            _this.progress(true, 'Exporting... 30%');
            setTimeout(checkTimer.bind(_this, res.result), 1000);
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err, function () {
                _this.$parent.parent().dialog('destroy');
            });
        });
    };

    SelectExportJdbcPage.prototype._checkProgress = function (userId, jobId) {
        var option = {
            url: 'api/va/v2/analytics/jobs/' + jobId,
            type: 'GET',
            blocking: false  //[Ajax Dim] progress함수에서 Dim 로직 수행하므로 false. 2017.08.01
        };
        return $.ajax(option);
    };

    SelectExportJdbcPage.prototype.progress = function (status, label) {
        var _this = this;
        if (status) {
            this.$progress.show();
            this.options.wizard.$btnFinish.jqxButton({disabled: status});
        }
        else {
            this.$progress.hide();
            if (label) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(label, function () {
                    _this.$parent.parent().dialog('destroy');
                });
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Data Export has been successfully completed.', function () {
                    _this.$parent.parent().dialog('destroy');
                });
            }
        }
        this.options.wizard.$btnPrevious.jqxButton({disabled: status});
    };

    SelectExportJdbcPage.prototype.refreshControlValues = function () {
        this.options.wizard.result.jdbc.dbtype = this.$dbtype.jqxDropDownList('val');
        this.options.wizard.result.jdbc.host = this.$host.jqxInput('val');
        this.options.wizard.result.jdbc.port = this.$port.jqxInput('val');
        this.options.wizard.result.jdbc.service = this.$service.jqxInput('val');
        this.options.wizard.result.jdbc.username = this.$username.jqxInput('val');
        this.options.wizard.result.jdbc.password = this.$password.jqxInput('val');
        this.options.wizard.result.jdbc.connectiontimeout = this.$connectionTimeout.getValue() || '600';
        this.options.wizard.result.jdbc.logintimeout = this.$loginTimeout.getValue() || '600';
        this.options.wizard.result.jdbc.sockettimeout = this.$socketTimeout.getValue() || '600';
        this.options.wizard.result.jdbc.locktimeout = this.$lockTimeout.getValue() || '600';
        this.options.wizard.result.jdbc.tablename = this.$tablename.jqxInput('val');
    };

    SelectExportJdbcPage.prototype.handleExportFileSelected = function () {
        var _this = this;

        var wizardOption = _this.options.wizard;

        var $fileName = this.$contentsControl.find('.filename');
        $fileName.empty();
        $fileName.append($('' +
            '<span class="brtc-va-icon brtc-va-wizardpage-dataupload file"></span>' +
            '<span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(wizardOption.options.name) + '</span>'));

    };

    SelectExportJdbcPage.prototype.destroy = function () {
        this.$dbtype.jqxDropDownList('destroy');
    };


    Brightics.VA.Core.Wizards.Pages.SelectExportJdbcPage = SelectExportJdbcPage;

}).call(this);