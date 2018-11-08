/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    // Constructor
    function Studio($parent, options) {
        this.$parent = $parent;
        this.options = options || {};
        this.header = null;
        this.sidebar = null;
        this.contentContainer = null;

        this.popupStatus = 'ok';
        
        this.getUserInfo();
        this.getUpgradeInfo();
    }
    
    Studio.prototype.getUserInfo = function () {
    	var _this = this;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: '/api/v1/appdata',
            success: function (data) {
            	Studio.appData = data;
            	_this.createHeader();
            	_this.createControls();
            }
        });
    };
    
    Studio.prototype.getUpgradeInfo = function () {
    	var _this = this;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: '/api/v1/upgrade/info',
            success: function (data) {
            	if (data.response.status == 'success') {
                    Studio.upgradeInfo = data;
                }
            	_this.renderHome();
            }
        });
    };

    Studio.prototype.getHeader = function () {
        return this.header;
    };

    Studio.prototype.getSideBar = function () {
        return this.sidebar;
    };

    Studio.prototype.getContentContainer = function () {
        return this.contentContainer;
    };

    Studio.prototype.createHeader = function () {
        this.header = new Brightics.Installer.Header(this.$parent);
    };

    Studio.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<article>' +
            '   <section>' +
            '       <div id="container" class="brtc-installer-studio"></div>' +
            '   </section>' +
            '</article>' +
            '<div class="clearfix"></div>' +
            '');
        this.$parent.append(this.$mainControl);
        Brightics.Installer.Utils.WidgetUtils.putStudioRef(this.$mainControl.find('.brtc-installer-studio'), this);

        this.createSideBar();
        this.createContentContainer();
    };

    Studio.prototype.createSideBar = function () {
        var $container = this.$mainControl.find('#container');
        this.sidebar = new Brightics.Installer.SideBar($container);
    };

    Studio.prototype.createContentContainer = function () {
        var $container = this.$mainControl.find('#container');
        this.contentContainer = new Brightics.Installer.ContentContainer($container);
    };

    Studio.prototype.empty = function () {
        this.sidebar.empty();
        this.contentContainer.empty();
    };

    Studio.prototype.renderExternalPackageInterface = function () {
        this.contentContainer.renderExternalPackageInterfaceHome();
    };

    Studio.prototype.renderHome = function () {
        var _this = this;
//        this.empty();

        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: '/api/v1/settings',
            success: function (response) {
                var data = $.extend(true, {}, response);
                console.log('render home');
                console.log(data);
                /** {ststus: 'NOT_INSTALLED'} **/
                /** {ststus: 'INSTALLED'} **/
                /** {ststus: 'IN_PROGRESS'} **/
                /** {ststus: 'FAILED'} **/
                /** {ststus: 'FAILED_PROGRESS'} **/
                _this.options.settings = data.settings;

                var options = _this.options;
                var settings;
                if(options.test && options.test.status !== ''){
                    settings = {};
                    settings = options.test;
                }
                else if(options.settings){
                    settings = options.settings;
                }

                if(settings){
                	Studio.mode = settings.status;
                    if (settings.status == 'NOT_INSTALLED') {
                    	if (Brightics.Installer.Studio.upgradeInfo === undefined){
                    		_this.renderInstallHome();
                    	}
                    	else {
                            // _this.renderUpgradeHome();
                            // For DEV - START
                            if($.inArray("dev", Brightics.Installer.Studio.appData.mode) < 0) {
                                _this.renderInstallHome();
                            }
                            else {
                                _this.renderUpgradeHome();
                            }
                            // For DEV - END
                    	}
                    }
                    else if (settings.status == 'IN_PROGRESS') {
                        _this.renderInstallProgress();
                    }
                    else if (settings.status == 'IN_PROGRESS_PROVISION_SERVICE') {
                        _this.renderAddNewServiceProgress();
                    }
                    else if (settings.status == 'IN_PROGRESS_PATCH') {
                    	_this.renderPatchProgress();
                    }
                    else if (settings.status == 'IN_PROGRESS_PREPARE_TO_UPGRADE') {
                    	_this.renderUpgradeAssistantProgress();
                    }
                    else if (settings.status == 'FAILED') {
                        _this.renderUninstall();
                    }
                    else if (settings.status == 'FAILED_PROGRESS') {
                        _this.renderUninstall();
                    }
                    else if (settings.status == 'SERVICES') {
                        _this.renderServicesHome();
                    }
                    else if (settings.status == 'UNINSTALL') {
                        _this.renderUninstall();
                    }
                    else if (settings.status == 'UNINSTALLED') {
                        _this.renderUninstalled();
                    }
                    else if (settings.status == 'UNINSTALL_FAILED') {
                        _this.renderUninstallProgress();
                    }
                    else if (settings.status == 'UNINSTALL_PROGRESS') {
                        _this.renderUninstallProgress();
                    }
                    else if (settings.status == 'UPGRADE_PROGRESS') {
                    	_this.renderUpgradeProgress();
                    }
                    else if (settings.status == 'UPGRADE_FAILED') {
                        _this.renderUpgradeHome();
                    }
                    else {
                        // settings.status == 'INSTALLED'
                        // settings.status == 'IN_PROGRESS_EXTERNAL_PACKAGE'
                        _this.renderInstalledHome();
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {

            }
        });
    };

    Studio.prototype.renderInstallHomeSideBar = function(){
        this.sidebar.renderInstallHome();
    };

    Studio.prototype.renderInstallHome = function(){
        this.sidebar.renderInstallHome();
        this.contentContainer.renderInstallHome();
    };

    Studio.prototype.renderInstalledHome = function(){
        this.sidebar.renderInstalledHome();
        this.contentContainer.renderInstalledHome();
    };

    Studio.prototype.renderInstallStep = function(){
        this.sidebar.renderInstallStep();
        this.contentContainer.renderInstallStep();
    };

    Studio.prototype.renderInstallProgress = function(){
        this.sidebar.renderInstallProgress();
        this.contentContainer.renderInstallProgress();
    };

    Studio.prototype.renderAddNewServiceProgress = function(){
        this.sidebar.renderAddNewServiceProgress();
        this.contentContainer.renderInstallProgress();
    };

    Studio.prototype.renderUpgradeAssistant = function(){
        this.sidebar.renderUpgradeAssistant();
        this.contentContainer.renderUpgradeAssistant();
    };
    
    Studio.prototype.renderUninstall = function(){
        this.sidebar.renderUninstall();
        this.contentContainer.renderUninstall();
    };

    Studio.prototype.renderUninstallProgress = function(){
        this.sidebar.renderUninstall();
        this.contentContainer.renderUninstallProgress();
    };

    Studio.prototype.renderServicesHome = function(){
        this.sidebar.renderServicesHome();
        this.contentContainer.renderServicesHome();
    };

    Studio.prototype.renderPatchmanagerHome = function(){
        this.contentContainer.renderPatchmanagerHome();
    };
    
    Studio.prototype.renderPatchProgress = function(){
    	this.contentContainer.renderPatchProgress();
    };
    
    Studio.prototype.renderUpgradeAssistantProgress = function(){
    	this.contentContainer.renderUpgradeAssistantProgress();
    };
    
    Studio.prototype.renderUpgradeHome = function(){
    	this.sidebar.renderUpgradeHome();
    	this.contentContainer.renderUpgradeHome();
    };

    Studio.prototype.renderUpgradeStep = function(){
        this.sidebar.renderUpgradeStep();
        this.contentContainer.renderUpgradeStep();
    };

    Studio.prototype.renderUpgradeProgress = function(){
        this.sidebar.renderUpgradeHome();
        this.contentContainer.renderUpgradeProgress();
    };
    
    Studio.prototype.renderServicesAddStep = function(){
        //this.sidebar.renderInstallStep();
        this.contentContainer.renderServicesAddStep();
    };

    Studio.prototype.showProgress = function(title){
        if (!this.progress) {
            this.progress = new Brightics.Installer.PopUp(this.$mainControl, {
                title: title,
                mode: 'progress',
                callback: function (isChecked) {

                }
            });
        }
    };

    Studio.prototype.hideProgress = function(){
        var _this = this;

        if (this.progress) {
            _this.$mainControl.find('.layer').remove();
        }

        this.progress = undefined;
    };

    Studio.prototype.showPopup = function(option){
        var defaultOptions = {
            width: 1000,
            height: 500,
            title: '',
            mode: 'alert',
            //message: '',
            message: [],
            hasCheckBox: false,
            checkBoxMessage: '',
            showCloseButton: true,
            callback: function (isChecked) {

            }
        };

        defaultOptions = $.extend(true, defaultOptions, option);

        this.popup = new Brightics.Installer.PopUp(this.$mainControl, defaultOptions);
    };

    Studio.prototype.changeStatus = function(serviceName){
        var _this = this;

        this.showProgress('remove service...');

        $.ajax({
            method: 'DELETE',
            crossDomain: true,
            //url: 'http://182.192.73.201:7000' + '/api/v1/services/'+$(this).attr('id')
            url: '/api/v1/services/'+ serviceName,
            success: function(){
                _this.showProgress('changing status...');

                _this.statusChangeInterval = setInterval(function (serviceName) {
                    $.ajax({
                        method: 'GET',
                        crossDomain: true,
                        url: '/api/v1/services/progress/install/'+ serviceName,
                        success: function(data){
                            if (data.waiting == false) {
                                clearInterval(_this.statusChangeInterval);
                                _this.hideProgress();
                                _this.renderServicesHome();
                            }
                        }
                    }).done(function(data){
                        console.log(data);
                        //_this.studio.hideProgress();
                        //window.location.href = '../services/Infra_Services.html';
                    });
                }, 1000);
            }
        }).done(function(data){
            console.log(data);
            //_this.studio.hideProgress();
            //window.location.href = '../services/Infra_Services.html';
        });
    };

    Studio.prototype.setSideMenuEnable = function(mode){
        this.sidebar.setEnableMenu(mode);
    };

    Studio.prototype.sideMenuDisable = function(mode){
        this.sidebar.disableAll();
    };

    Studio.prototype.sideMenuServiceDisable = function(mode){
        this.sidebar.closeServiceList();
        this.sidebar.$serviceHeader.addClass('disabled');
        this.sidebar.$installerListInstallProgress.addClass('disabled');
        this.sidebar.$externalPackageHeader.addClass('disabled');
        this.sidebar.$patchmanagerHeader.addClass('disabled');
    };

    Studio.prototype.emptyInputcheck = function($target){
        var rt = {
            passValidation: true,
            $focusTarget: undefined
        };
        var pwdTag = $target.find('[type="password"]');
        var textAreaTag = $target.find('textarea');

        if ($('#installer_step1_ssh_private_key_radio').attr('selected') || $('#installer_step1_password_radio').attr('selected')) {
            if ($('#installer_step1_ssh_private_key_radio').attr('selected')) {
                if ($(textAreaTag).val()) {
                    $('#identification-type-error').hide();
                    $(textAreaTag).removeClass('has-error');
                } else {
                    rt.passValidation = false;
                    $(textAreaTag).addClass('has-error');
                    $('#identification-type-error').show();
                }
            } else if ($('#installer_step1_password_radio').attr('selected')) {
                if ($(pwdTag).val()) {
                    $('#identification-type-error').hide();
                    $(pwdTag).removeClass('has-error');
                } else {
                    rt.passValidation = false;
                    $(pwdTag).addClass('has-error');
                    $('#identification-type-error').show();
                }
            }
        }

        if($target.find('.installer_step1_hostname_input').length <= 0) {
            $target.find('button#installer_step1_hostname_add_button.btnGray').click();

            rt.passValidation = false;
            var newHostname = $target.find('.installer_step1_hostname_input');
            rt.focusTarget = newHostname;

            var isPort = false,
                findType = '.line_body',
                message = 'HostName is not entered';
            newHostname.addClass('has-error');
            newHostname.siblings().css({
                'display': 'block',
                'color': 'red'
            });
            $target.find('.installer_step1_port_input').siblings().css({
                'display': 'block',
                'color': 'white'
            })

            return rt;
        }

        var inputTags = $target.find('[type="text"]');

        for (var i=0; i<inputTags.length; i++) {
            var id = $(inputTags[i]).attr('id');
            var index = id.substring(id.length-1, id.length);

            //if (id == 'installer_step1_user_id') {
            //    if ($(inputTags[i]).val()) $('#id-type-error').hide();
            //    else $('#id-type-error').show();
            //} else if (id == 'installer_step1_group_id') {
            //    if ($(inputTags[i]).val()) $('#id-group-error').hide();
            //    else $('#id-group-error').show();
            //}


            var isPort = false,
                findType = '.line_body',
                message = 'HostName is not entered';

            if ($(inputTags[i]).attr('id').indexOf('port') > -1) {
                isPort = true;
                findType = '.line_body_port';
                message = 'Port is not entered';
            }

            $(inputTags[i]).siblings().css({
                'display': 'none',
                'color': 'white'
            });

            if ($(inputTags[i]).val()) {
                $(inputTags[i]).removeClass('has-error');

                if (isPort) {
                    var hostDisplay = $('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body label').css('display');
                    var portDisplay = $('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body_port label').css('display');

                    if (hostDisplay != portDisplay) {
                        $(inputTags[i]).siblings().css({
                            'display': 'block',
                            'color': 'white'
                        });
                    }
                }

            } else {
                rt.passValidation = false;
                if (!rt.$focusTarget) {
                    rt.$focusTarget = $(inputTags[i]);
                }
                $(inputTags[i]).addClass('has-error');

                $(inputTags[i]).siblings().css({
                    'display': 'block',
                    'color': 'red'
                });

                if (isPort) {
                    var display = $('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body label').css('display');

                    if (display == 'none') {
                        $('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body label').css({
                            'display': 'block',
                            'color': 'white'
                        });
                    }
                } else {
                    var display = $('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body_port label').css('display');

                    if (display == 'none') {
                        $('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body_port label').css({
                            'display': 'block',
                            'color': 'white'
                        });
                    }
                }


                //$('#installer_step1_host_name_list > tr:eq(' + index + ')').find(findType).find('label').remove();
                //var $helpBlockHost = $('<label class="help-block has-error" style="color:red" for="">'+message+'</label>');
                //$('#installer_step1_host_name_list > tr:eq(' + index + ')').find(findType).append($helpBlockHost);

                //$('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body_port').find('label').remove();
                //var $helpBlockPort = $('<label class="help-block has-error" style="color:red" for="">Port is not entered</label>');
                //$('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body_port').append($helpBlockPort);
            }

            //$(inputTags[i]).change(function(){
            //    var id = $(this).attr('id');
            //    var index = id.substring(id.length-1, id.length);
            //
            //    if ($(this).val()) {
            //        $(this).removeClass('has-error');
            //
            //        //$('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body').find('label').remove();
            //        //$('#installer_step1_host_name_list > tr:eq(' + index + ')').find('.line_body_port').find('label').remove();
            //
            //    } else {
            //        $(this).addClass('has-error');
            //    }
            //});
        }
        return rt;
    };

    Studio.prototype.renderChangePassword = function(){
        this.contentContainer.renderUserConfiguration();
    };

    Studio.prototype.setInstallType = function (type) {
        this.installType = type;
    };

    root.Brightics.Installer.Studio = Studio;

}).call(this);