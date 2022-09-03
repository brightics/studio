/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    function SelectJdbcDataPage(parentId, options) {
        this.options = options;
        this.options.class = 'selectjdbcdatapage';
        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);

        this.options.wizard.registerEvent('changeData');
    }

    SelectJdbcDataPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectJdbcDataPage.prototype.constructor = SelectJdbcDataPage;

    SelectJdbcDataPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        this.options.wizard.$btnNext.jqxButton({disabled: false});
        this.options.wizard.$btnFinish.jqxButton({disabled: true});

        this.$message.text('');
        this.options.wizard.result.data = this.options.wizard.result.data || [];
        this.options.wizard.result.jdbc = this.options.wizard.result.jdbc || {};

        if (this.$host.jqxInput('val') != '' && this.$port.jqxInput('val') != '' && this.$service.jqxInput('val') != ''
            && this.$username.jqxInput('val') != '' && this.$password.jqxInput('val') != '' && this.$tablename.jqxInput('val') != '')
            this.$contentsControl.find('.connect').jqxButton({disabled: false});
        else
            this.$contentsControl.find('.connect').jqxButton({disabled: true});
    };

    SelectJdbcDataPage.prototype.createHeaderArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createHeaderArea.call(this, $parent);

        $parent.addClass('brtc-va-wizardpage-dataupload');
        this.$wizardHeader = $('' +
            '   <div class="step01">' +
            '       <span class="brtc-va-icon step normal selected"></span>' +
            '       <p class="step normal selected"><strong>01</strong>Select Data</p>' +
            '   </div>' +
            '   <div class="step02">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>02</strong> Set Delimiter</p>' +
            '   </div>' +
            '   <div class="step03">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>03</strong> Set Column Data Format</p>' +
            '   </div>');
        $parent.append(this.$wizardHeader);
    };

    SelectJdbcDataPage.prototype.refreshConnectControl = function () {
        this.$message.text('');
        this.options.wizard.$btnNext.jqxButton({disabled: true});

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

    SelectJdbcDataPage.prototype.createContentsArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createContentsArea.call(this, $parent);
        var _this = this;
        $parent.addClass('brtc-va-wizardpage-dataupload');
        $parent.append($('' +
            '   <div class="brtc-va-wizard-contents-property db-type-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label mandatory">DB Type :</div>' +
            '       <div class="brtc-va-wizard-contents-property-input db-type" />' +
            '       <input type="button" class="connect" value="Connection Test" />' +
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
            '   <div class="brtc-va-wizard-contents-property socket-timeout-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Socket :</div>' +
            '       <div  class="brtc-va-wizard-contents-property-input socket-timeout"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property lock-timeout-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Lock :</div>' +
            '       <div  class="brtc-va-wizard-contents-property-input lock-timeout"/>' +
            '   </div>' +
            '   <div class="brtc-va-wizard-contents-property upload-to-contents">' +
            '       <div class="brtc-va-wizard-contents-property-label">Add To :</div>' +
            '       <div class="brtc-va-radio">' +
            '           <div class="brtc-va-radio-button" id="upload-to-shared-jdbc" value="shared">Shared</div>' +
            '       </div>' +
            '       <div class="brtc-va-radio">' +
            '           <div class="brtc-va-radio-button" id="upload-to-userid-jdbc" value="' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(Brightics.VA.Env.Session.userId) + '"><span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(Brightics.VA.Env.Session.userId) + '</span></div>' +
            '       </div>' +
            '   </div>'));

        this.$dbtype = $parent.find('.db-type');
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

        $parent.find('#upload-to-shared-jdbc').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 25,
            width: 100,
            boxSize: '18px',
            groupName: 'jdbc'
        });
        $parent.find('#upload-to-userid-jdbc').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 25,
            width: 100,
            boxSize: '18px',
            groupName: 'jdbc',
            checked: true
        });

        $parent.find('.brtc-va-radio-button').on('checked', function (event) {
            _this.options.wizard.result.uploadTo = this.getAttribute('value');
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
                        return ($target)?  IP_REGEX.test($target.val()) : false;
                    }
                }, {
                    input: '.port',
                    message: '[0~65535]',
                    action: 'keyup',
                    rule: function (inputs, commit) {
                        var $target = _this.findActivatedInput(inputs);
                        return ($target)?  Brightics.VA.Core.Utils.InputValidator.isValid.integerType($target.val()) && $target.val() < 65536 : false;
                    }
                }
            ]
        });
        this.$host = $parent.find('.host');
        this.$port = $parent.find('.port');
        this.$service = $parent.find('.service');
        this.$username = $parent.find('.username');
        this.$password = $parent.find('.password');
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
            if (_this.$mainControl.is(':visible')) _this.refreshConnectControl();
        });

        $parent.find(':password').on('change', function () {
            if (_this.$mainControl.is(':visible')) _this.refreshConnectControl();
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
                        password: encrypted_password,
                        tablename: _this.options.wizard.result.jdbc.tablename
                    },
                    blocking: true
                };

                $.ajax(option).done(function (data) {
                    _this.$message.text('SUCCESS');
                    _this.options.wizard.$btnNext.jqxButton({disabled: false});
                }).fail(function (err) {
                    _this.$message.text('FAILED');
                    _this.options.wizard.$btnNext.jqxButton({disabled: true});
                    if (err.responseText.includes('does not exist')) {
                        Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Table does not exist.');
                    }
                });
            }).fail(function (err) {
                _this.$message.text('FAILED');
                _this.options.wizard.$btnNext.jqxButton({disabled: true});
            });
        });
    };

    SelectJdbcDataPage.prototype.doFinish = function (callback) {
        var _this = this;
        var rsa = new RSAKey();
        rsa.setPublic(_this.publicN, _this.publicE);
        var encrypted_password = rsa.encrypt(this.options.wizard.result.jdbc.password);

        this.refreshControlValues();

        $.ajax({
            url: 'api/va/v2/datasources/external/schema',
            method: 'POST',
            data: {
                dbtype: _this.options.wizard.result.jdbc.dbtype,
                host: this.options.wizard.result.jdbc.host,
                port: this.options.wizard.result.jdbc.port,
                service: this.options.wizard.result.jdbc.service,
                username: this.options.wizard.result.jdbc.username,
                password: encrypted_password,
                tablename: this.options.wizard.result.jdbc.tablename
            },
            blocking: true
        }).done(function (data) {
            try {
                _this.options.wizard.result.data = [];

                var columns = [];
                for (var i in data) {
                    columns.push(data[i]['column_name']);
                }
                _this.options.wizard.result.data.push(columns);

                $.ajax({
                    url: 'api/va/v2/datasources/external/query',
                    method: 'POST',
                    data: {
                        dbtype: _this.options.wizard.result.jdbc.dbtype,
                        host: _this.options.wizard.result.jdbc.host,
                        port: _this.options.wizard.result.jdbc.port,
                        service: _this.options.wizard.result.jdbc.service,
                        username: _this.options.wizard.result.jdbc.username,
                        password: encrypted_password,
                        tablename: _this.options.wizard.result.jdbc.tablename
                    },
                    blocking: true
                }).done(function (data) {
                    for (var j in data) {
                        var row = [];
                        for (var k = 0; k < Object.keys(data[j]).length; k++) {
                            row.push(data[j][columns[k]] || '');
                        }
                        _this.options.wizard.result.data.push(row);
                    }
                    _this.options.wizard.triggerEvent('changeData', true);
                    callback();
                }).fail(function (err) {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Table does not exist.', function () {
                        _this.options.wizard.$btnNext.jqxButton({disabled: true});
                    });
                });
            } catch (err) {
            }
        });
    };

    SelectJdbcDataPage.prototype.refreshControlValues = function () {
        this.options.wizard.result.jdbc.dbtype = this.$dbtype.jqxDropDownList('val');
        this.options.wizard.result.jdbc.host = this.$host.jqxInput('val');
        this.options.wizard.result.jdbc.port = this.$port.jqxInput('val');
        this.options.wizard.result.jdbc.service = this.$service.jqxInput('val');
        this.options.wizard.result.jdbc.username = this.$username.jqxInput('val');
        this.options.wizard.result.jdbc.password = this.$password.jqxInput('val');
        this.options.wizard.result.jdbc.sorckettimeout = this.$socketTimeout.getValue() || '600';
        this.options.wizard.result.jdbc.locktimeout = this.$lockTimeout.getValue() || '600';
        this.options.wizard.result.jdbc.tablename = this.$tablename.jqxInput('val');
    };

    SelectJdbcDataPage.prototype.destroy = function () {
        this.$dbtype.jqxDropDownList('destroy');
    };

    Brightics.VA.Core.Wizards.Pages.SelectJdbcDataPage = SelectJdbcDataPage;

}).call(this);