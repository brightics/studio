/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeStep1Container($parent) {
        this.$parent = $parent;
    }

    UpgradeStep1Container.prototype.setController = function (controller) {
        this.controller = controller;
    };

    UpgradeStep1Container.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderContent();
    };

    UpgradeStep1Container.prototype.createLayout = function () {
        this.createHeadArea();
        this.createContArea();
        this.createButtonArea();

        var leftInit = $(".cont_area").offset().left;
        var left = 251;
        $(".fix_area").offset({
            left: leftInit
        });
        $(".left_line").offset({
            left: left
        });

        $(window).scroll(function (event) {
            var leftInit1 = $(".cont_area").offset().left;
            $(".fix_area").offset({
                left: leftInit1
            });
            $(".left_line").offset({
                left: left
            });

        });

        $(window).resize(function (event) {
            var leftInit1 = $(".cont_area").offset().left;
            $(".fix_area").offset({
                left: leftInit1
            });
            $(".left_line").offset({
                left: left
            });
        });
    };

    UpgradeStep1Container.prototype.createHeadArea = function () {
        this.$headArea = $('' +
            '<div class="h2_title"><span>Upgrade</span></div>' +
            '<div class="location">' +
            '   <a href="#">Upgrade Assistant</a><img src="static/images/ico_path.gif" alt=""/><strong>Upgrade</strong>' +
            '</div>');
        this.$parent.append(this.$headArea);
        this.$headArea.find('a').hover(function () {
            $(this).css('cursor', 'text');
        });
    };

    UpgradeStep1Container.prototype.createContArea = function () {
        this.$contArea = $('<div class="cont_area clearfix"></div>');
        this.createTabArea();
        this.createUserInfoArea();
        this.createHostNameArea();
        this.$parent.append(this.$contArea);

        $('#installer_step1_ssh_private_key_textarea').on('keyup', function () {
            this.style.height = "70px";
            this.style.height = (20 + this.scrollHeight) + "px";
        });
    };

    UpgradeStep1Container.prototype.createTabArea = function () {
        this.$tabArea = $('' +
            '<div class="tab_type01">' +
            '   <ul>' +
            '       <li class="tab_01">' +
            '           <a href="#" class="on">' +
            '               <span class="tab_num">01</span>' +
            '               <span class="tab_type01_text_on"> Host Name and the Account</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">02</span>' +
            '               <span class="tab_type01_text_off"> Check the Services list</span>' +
            '           </a>' +
            '        </li>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">03</span>' +
            '               <span class="tab_type01_text_off"> Deploy Status of Services</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">04</span>' +
            '               <span class="tab_type01_text_off">Configurations</span>' +
            '           </a>' +
            '       </li>' +
            '   </ul>' +
            '</div>');
        this.$contArea.append(this.$tabArea);
        this.$tabArea.find('a').hover(function () {
            $(this).css('cursor', 'default');
        });
    };

    UpgradeStep1Container.prototype.createUserInfoArea = function () {
        this.$userInfoArea = $('' +
            '<div class="row-fluid">' +
            '   <div class="h3_title"><span>Insert Identification for access to Host.</span></div>' +
            '   <div class="row_fiuld_des"><span><img src="static/images/des_info.gif">The Account should be root or has sudo permission. The Account info of all hosts must be the same.</span>' +
            '   </div>' +
            '   <div>' +
            '       <table class="board-view01">' +
            '           <colgroup>' +
            '               <col class="w11"/><col/>' +
            '           </colgroup>' +
            '           <tbody>' +
            '           <tr>' +
            '               <th><span>ID </span></th>' +
            '               <td>' +
            '                   <input type="text" id="installer_step1_user_id" name="" placeholder="ID" class="normal w225" title="" value="">' +
            //'                   <label style="display:none" id="id-type-error" class="help-block has-error" for="">ID is not entered</label>' +
            '               </td>' +
            '           </tr>' +
            '           <tr>' +
            '               <th><span>Group </span></th>' +
            '               <td>' +
            '                   <input type="text" id="installer_step1_user_group" name="" placeholder="Group" class="normal w225" title="" value="">' +
            //'                   <label style="display:none" id="group-type-error" class="help-block has-error" for="">Group is not entered</label>' +
            '               </td>' +
            '           </tr>' +
            '           <tr class="last">' +
            '               <th><span>Identification Type</span></th>' +
            '               <td>' +
            '                   <div>' +
            '                       <div class="line_body clearfix">' +
            '                           <div class="rdo mr15">' +
            '                               <input selected class="radio" type="radio" value="" name="group1" id="installer_step1_password_radio">' +
            '                               <label for="installer_step1_password_radio">Password</label>' +
            '                           </div>' +
            '                           <div class="rdo mr15">' +
            '                               <input class="radio" type="radio" value="" name="group1" id="installer_step1_ssh_private_key_radio">' +
            '                               <label for="installer_step1_ssh_private_key_radio">SSH Private Key</label>' +
            '                           </div>' +
            '                       </div>' +
            '                       <div class="line_body clearfix">' +
            '                           <textarea id="installer_step1_ssh_private_key_textarea" class="norma" rows=4 style="width:100%;height:90px;display:none"></textarea>' +
            '                           <input type="password" id="installer_step1_password_input" name="" class="normal w225" title="" value="" >' +
            '                           <label style="display:none" id="identification-type-error" class="help-block has-error" for="">Identification Type is not entered</label>' +
            '                       </div>' +
            '                       <div class="line_body clearfix">' +
            '                           <div class="chk mr15">' +
            '                               <input class="check" type="checkbox" value="" name="" id="installer_step1_ha_checkbox">' +
            '                               <label for="installer_step1_ha_checkbox">HA ( High Availability )</label>' +
            '                           </div>' +
            '                       </div>' +
            '                   </div>' +
            '               </td>' +
            '           </tr>' +
            '           </tbody>' +
            '       </table>' +
            '   </div>' +
            '</div>');
        $('#identification-type-error').hide();
        this.$contArea.append(this.$userInfoArea);
    };

    UpgradeStep1Container.prototype.createHostNameArea = function () {
        this.$hostNameArea = $('' +
            '<div class="row-fluid rowlast">' +
            '   <div class="h3_title"><span>Insert Host Name for Brightics Installation.</span></div>' +
            '   <div class="row_fiuld_des"><span><img src="static/images/des_info.gif">This is not IP Address, it should be Host Name.</span></div>' +
            '   <div class="board">' +
            '       <table class="board-list">' +
            '           <colgroup>' +
            '               <col width="60px"/>' +
            '               <col/>' +
            '           </colgroup>' +
            '           <thead>' +
            '           <th style="border-right: 1px solid #d9d9d9">' +
            '               <div class="chk">' +
            '                   <input class="check" type="checkbox" value="" name="" id="installer_step1_hostname_checkbox_all">' +
            '                   <label for="installer_step1_hostname_checkbox_all"></label>' +
            '               </div>' +
            '           </th>' +
            '           <th style="border-right: 1px solid #d9d9d9">Host Name</th>' +
            '           <th>Port</th>' +
            '           </thead>' +
            '           <tbody id="installer_step1_host_name_list">' +
            '           </tbody>' +
            '       </table>' +
            '   </div>' +
            '   <div class="btn_wrap">' +
            '       <div class="fl_r">' +
            '           <button id="installer_step1_hostname_delete_button" class="btnGray"><span>Delete</span></button>' +
            '           <button id="installer_step1_hostname_add_button" class="btnGray"><span>Add Host</span></button>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$tbodyArea = $('' +
            '           <tr>' +
            '               <td class="chk-area" style="border-right: 1px solid #f0f0f0">' +
            '                   <div class="chk">' +
            '                       <input class="installer_step1_hostname_checkbox check" type="checkbox" value="0" name="" id="installer_step1_hostname_checkbox_0">' +
            '                       <label for="installer_step1_hostname_checkbox_0"></label>' +
            '                   </div>' +
            '               </td>' +
            '               <td style="border-right: 1px solid #f0f0f0">' +
            '                   <div class="line_body clearfix" style="width:99%">' +
            '                       <input type="text" id="installer_step1_hostname_input_0" name="" class="installer_step1_hostname_input normal" title="" value="">' +
            '                       <label id="installer_step1_hostname_input_0" style="color:white; display: none" class="help-block has-error" for="">HostName is not entered</label>' +
            '                   </div>' +
            '               </td>' +
            '               <td>' +
            '                   <div class="line_body_port clearfix" style="width:99%">' +
            '                       <input type="text" id="installer_step1_port_input_0" name="" class="installer_step1_port_input normal" value="" title="" >' +
            '                       <label id="installer_step1_port_input_0" style="color:white; display: none" class="help-block has-error" for="">Port is not entered</label>' +
            '                   </div>' +
            '               </td>' +
            '           </tr>' +
            '');

        this.$hostNameArea.find('#installer_step1_host_name_list').append(this.$tbodyArea);
        this.$contArea.append(this.$hostNameArea);
    };

    UpgradeStep1Container.prototype.createButtonArea = function () {
        this.$buttonArea = $('' +
            '<div class="fix_area ">' +
            '   <div class="btn_wrap">' +
            '       <div class="fl_r">' +
            '           <button class="btnBigGray"><span>Next</span></button>' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$buttonArea);
    };

    UpgradeStep1Container.prototype.renderContent = function () {
        try {
            var $content = $('#content');
            var hostNameListManager = new HostNameListManager($content, {controller: this.controller});
            hostNameListManager.renderContents();

            hostNameListManager.bindNextButtonEvent();
        }
        catch (e) {
            console.error(e);
        }
    };

    //Constructor
    function HostNameListManager($parent, options) {
        this.$parent = $parent;
        this.controller = options.controller;

        this.hostNameCount = 1;

        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    HostNameListManager.prototype.renderContents = function () {
        var _this = this;
        
        var data = Brightics.Installer.Studio.upgradeInfo.installstep1;
        _this.renderHostName(data);

        $('#installer_step1_ssh_private_key_radio').on('click', function () {
            $('#installer_step1_ssh_private_key_textarea').css('display', 'block');
            $('#installer_step1_password_input').css('display', 'none');
            $('#installer_step1_ssh_private_key_radio').attr('selected','selected');
            $('#installer_step1_password_radio').removeAttr('selected');

            if (_this.clickedNext) {
                if ($('#installer_step1_ssh_private_key_textarea').val()) {
                    $('#identification-type-error').hide();
                } else {
                    $('#identification-type-error').show();
                }
            }
        });

        $('#installer_step1_password_radio').on('click', function () {
            $('#installer_step1_password_input').css('display', 'block');
            $('#installer_step1_ssh_private_key_textarea').css('display', 'none');
            $('#installer_step1_password_radio').attr('selected','selected');
            $('#installer_step1_ssh_private_key_radio').removeAttr('selected');

            if (_this.clickedNext) {
                if ($('#installer_step1_password_input').val()) {
                    $('#identification-type-error').hide();
                } else {
                    $('#identification-type-error').show();
                }
            }
        });

        $('#installer_step1_hostname_checkbox_all').on('click', function () {
            var $hostNameList = $('#installer_step1_host_name_list > tr');
            if ($('#installer_step1_hostname_checkbox_all').is(':checked')) {
                $hostNameList.each(function (index) {
                    if (!$(this).find('.installer_step1_hostname_checkbox').is(':checked')) {
                        $(this).find('.installer_step1_hostname_checkbox').click();
                    }
                });
            }
            else {
                $hostNameList.each(function (index) {
                    if ($(this).find('.installer_step1_hostname_checkbox').is(':checked')) {
                        $(this).find('.installer_step1_hostname_checkbox').click();
                    }
                });
            }
        });

        $('#installer_step1_hostname_delete_button').on('click', function () {
            if (_this.getCheckedCount() > 0) {
                _this.studio.showPopup({
                    title: 'Host Delete',
                    mode: 'confirm',
                    message: ['This host will be deleted.', 'Are you sure want to proceed?'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {
                        var $hostNameList = $('#installer_step1_host_name_list > tr');
                        $hostNameList.each(function (index) {
                            if ($(this).find('.installer_step1_hostname_checkbox').is(':checked')) {
                                $(this).remove();
                            }
                        });

                        if ($('#installer_step1_hostname_checkbox_all').is(':checked')) {
                            $('#installer_step1_hostname_checkbox_all').click();
                        }

                        if (_this.getHostsCount() == 0) $('#installer_step1_hostname_delete_button').hide();
                    }
                });
            }
        });

        $('#installer_step1_hostname_add_button').on('click', function () {
            $('#installer_step1_hostname_delete_button').show();
            _this.appendNewHostName();
        });
    };

    HostNameListManager.prototype.getHostsCount = function () {
        var $serviceNameList = $('#installer_step1_host_name_list > tr');

        return $serviceNameList.length;
    };

    HostNameListManager.prototype.getCheckedCount = function () {
        var checkedCount = 0;

        var $serviceNameList = $('#installer_step1_host_name_list > tr');
        $serviceNameList.each(function (index) {
            if ($(this).find('.installer_step1_hostname_checkbox').is(':checked')) {
                checkedCount++;
            }
        });

        return checkedCount;
    };

    HostNameListManager.prototype.renderHostName = function (data) {
        var copyData = $.extend(true, {}, data);

        $('#installer_step1_user_id').val(copyData.userInfo.user);
        $('#installer_step1_user_group').val(copyData.userInfo.group);

        if (copyData.userInfo.sshKey !== undefined && copyData.userInfo.sshKey !== "") {
            $('#installer_step1_ssh_private_key_radio').click();
            $('#installer_step1_ssh_private_key_textarea').val(copyData.userInfo.sshKey);
        }
        else {
            $('#installer_step1_password_radio').click();
            $('#installer_step1_password_input').val(copyData.userInfo.password);
        }

        if (copyData.haEnabled === true) {
            $('#installer_step1_ha_checkbox').click();
        }

        this.$hostNameList = $('#installer_step1_host_name_list');
        this.$hostNameList.empty();

        if (Object.keys(copyData.hosts).length == 0) {

            this.appendNewHostName();
        } else {
            for (var key in copyData.hosts) {
                var newHostName = this.appendNewHostName();
                newHostName.find('.installer_step1_hostname_input').val(key);
                newHostName.find('.installer_step1_port_input').val(copyData.hosts[key].port);
            }
        }
    };

    HostNameListManager.prototype.appendNewHostName = function () {
        var $lastTr = $('#installer_step1_host_name_list > tr:last');

        var index = ($lastTr.length) ? parseInt($lastTr.find('.installer_step1_hostname_checkbox').val()) + 1 : 0;

        var $newHostName = $('' +
            '<tr>' +
            '   <td class="chk-area" style="border-right: 1px solid #f0f0f0">' +
            '       <div class="chk">' +
            '           <input type="checkbox" id="installer_step1_hostname_checkbox_' + index + '" class="installer_step1_hostname_checkbox check" value="' + index + '" name="">' +
            '           <label for="installer_step1_hostname_checkbox_' + index + '"></label>' +
            '       </div>' +
            '   </td>' +
            '   <td style="border-right: 1px solid #f0f0f0">' +
            '       <div class="line_body clearfix" style=" width:98%; margin-left: 1%">' +
            '           <input type="text" id="installer_step1_hostname_input_' + index + '" name="" class="installer_step1_hostname_input normal" value="" title="" >' +
            '           <label id="installer_step1_hostname_input_' + index + '" style="color: white; display:none" class="help-block has-error">HostName is not entered</label>' +
            '       </div>' +
            '   </td>' +
            '   <td>' +
            '       <div class="line_body_port clearfix" style=" width:98%; margin-left: 1%">' +
            '           <input type="text" id="installer_step1_port_input_' + index + '" name="" class="installer_step1_port_input normal" value="22" title="" >' +
            '           <label id="installer_step1_port_input_' + index + '" style="color: white; display:none" class="help-block has-error">Port is not entered</label>' +
            '       </div>' +
            '   </td>' +
            '</tr>');
        this.$hostNameList.append($newHostName);

        $newHostName.find('input[id^="installer_step1_hostname_input"]').focus();

        return $newHostName;
    };

    HostNameListManager.prototype.bindNextButtonEvent = function () {
        var _this = this;

        $('.fix_area > .btn_wrap > .fl_r > .btnBigGray').on('click', function () {
            _this.clickedNext = true;
            var validation = _this.studio.emptyInputcheck($('.cont_area'));

            if (validation.passValidation) {
                var sendData = _this.createSendData();

                console.log('install_step1_next');
                console.log(sendData);

                _this.studio.showProgress('Saving Step1 configuration...');

                $.ajax({
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    url: '/api/v1/wizard/installstep1',
                    data: JSON.stringify(sendData),
                    success: function (data) {
                        _this.studio.hideProgress();
                        if (data.response.status === 'failed') {
                            _this.studio.showPopup({
                                title: 'Error',
                                mode: 'alert',
                                message: [data.response.message],
                                hasCheckBox: false,
                                checkBoxMessage: '',
                                callback: function (isChecked) {
                                }
                            });
                        }
                        else {
	                        var responseObject = data;
	                        console.log(responseObject);
	
	                        if (responseObject.response.status == 'success') {
	                            $('#installer_step1_host_name_list > tr').find('.help-block').remove();
	
	                            _this.controller.startStep2();
	                        } else {
	                            $('#installer_step1_host_name_list > tr').find('.help-block').remove();
	
	                            var message = responseObject.response.message;
	
	                            _this.studio.showPopup({
	                                title: 'Error',
	                                mode: 'alert',
	                                message: [message],
	                                hasCheckBox: false,
	                                checkBoxMessage: '',
	                                callback: function (isChecked) {
	
	                                }
	                            });
	                            //var $helpBlockHost = $('<label class="help-block has-error" for=""></label>');
	                            //$helpBlockHost.text(message);
	                            //$('#installer_step1_host_name_list > tr:eq(' + target + ')').find('.line_body').append($helpBlockHost);
	                            //
	                            //var $helpBlockPort = $('<label class="help-block has-error" style="color:white" for=""> a</label>');
	                            //$helpBlockPort.text(message);
	                            //$('#installer_step1_host_name_list > tr:eq(' + target + ')').find('.line_body_port').append($helpBlockPort);
	                        }
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {

                    }
                });
            } else {
                //_this.studio.showPopup({
                //    title: 'Input Error',
                //    mode: 'alert',
                //    message: 'fill input box',
                //    hasCheckBox: false,
                //    checkBoxMessage: '',
                //    callback: function (isChecked) {
                //        validation.$focusTarget.focus();
                //    }
                //});
            }
        });
    };

    HostNameListManager.prototype.createSendData = function () {
        var copyData = {
            userInfo: {},
            hosts: {}
        }

        copyData.userInfo.user = $('#installer_step1_user_id').val();
        copyData.userInfo.group = $('#installer_step1_user_group').val();
        if ($('#installer_step1_ssh_private_key_radio').is(':checked')) {
            copyData.userInfo.sshKey = $('#installer_step1_ssh_private_key_textarea').val();
            delete copyData.userInfo.password;
        }
        else if ($('#installer_step1_password_radio').is(':checked')) {
            copyData.userInfo.password = $('#installer_step1_password_input').val();
            delete copyData.userInfo.sshKey;
        }

        copyData.haEnabled = $('#installer_step1_ha_checkbox').is(':checked');

        var $hostNameList = $('#installer_step1_host_name_list > tr');
        $hostNameList.each(function (index) {
            if ($(this).find('.installer_step1_hostname_input').val() !== '') {
                var hostName = $(this).find('.installer_step1_hostname_input').val();
                var port = $(this).find('.installer_step1_port_input').val();
                copyData.hosts[hostName] = {
                    'hostName': hostName,
                    'port': parseInt(port)
                };
            }
        });
        console.log(copyData);
        return copyData;
    };

    root.Brightics.Installer.ContentContainer.UpgradeStep1Container = UpgradeStep1Container;

}).call(this);