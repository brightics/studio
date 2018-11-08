/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SideBar($parent) {
        this.$parent = $parent;
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));

        this.createControls();
    }

    SideBar.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="left_line"></div>' +
            '<div id="sidebar" class="brtc-installer-sidebar">' +
            '   <div id="lnb">' +
            '       <ul class="menu">' +
            '           <li>' +
            '               <a class="brtc-installer-sidebar-installer-header" href="javascript:;"><span>Installer<img class="brtc-installer-sidebar-installer-header-expander" src="static/images/office-icon-down.png" alt=""/></span></a>' +
            '               <ul class="brtc-installer-sidebar-installer-list">' +
            '                   <li class="brtc-installer-sidebar-installer-list-install"><a href="javascript:;">Install</a></li>' +
            '                   <li class="brtc-installer-sidebar-installer-list-install-progress"><a href="javascript:;">Install Progress</a></li>' +
            '                   <li class="brtc-installer-sidebar-installer-list-uninstall"><a href="javascript:;">Uninstall</a></li>' +
            '                   <li class="brtc-installer-sidebar-installer-list-upgrade-assistant"><a href="javascript:;">Upgrade Assistant</a></li>' +
            '               </ul>' +
            '           </li>' +
            '           <li>' +
            '               <a class="brtc-installer-sidebar-service-header" href="javascript:;"><span>Services<img class="brtc-installer-sidebar-service-header-expander" src="static/images/office-icon-down.png" alt=""/></span></a>' +
            '               <ul class="brtc-installer-sidebar-service-list">' +
            '               </ul>' +
            '           </li>' +
            '           <li>' +
            '               <a class="brtc-installer-sidebar-externalpackage-header" href="javascript:;"><span>External Package Interface</span></a>' +
            // '               <ul class="brtc-installer-sidebar-service-list">' +
            '           </li>' +      
            '           <li>' +
            '               <a class="brtc-installer-sidebar-patchmanager-header" href="javascript:;"><span>Patch Manager</span></a>' +
            '           </li>' +    
            '       </ul>' +
            '   </div>' +
            '</div>' +
            '');
        this.$parent.append(this.$mainControl);

        /** header - "a" tag css : lnb-open-main lnb-close-main disabled **/
        /** list - "ul" tag css : lnb-open-sub lnb-close-sub disabled **/
        /** list-element - "li" tag css : current disabled **/

        this.$installerHeader = this.$mainControl.find('.brtc-installer-sidebar-installer-header');
        this.$installerHeaderExpander = this.$mainControl.find('.brtc-installer-sidebar-installer-header-expander');
        this.$installerList = this.$mainControl.find('.brtc-installer-sidebar-installer-list');

        this.$installerListInstall = this.$mainControl.find('.brtc-installer-sidebar-installer-list-install');   //install
        this.$installerListInstallProgress = this.$mainControl.find('.brtc-installer-sidebar-installer-list-install-progress');  //install progress
        this.$installerListUninstall = this.$mainControl.find('.brtc-installer-sidebar-installer-list-uninstall');   //uninstall
        this.$installerListUpgradeAssistant = this.$mainControl.find('.brtc-installer-sidebar-installer-list-upgrade-assistant');   //upgrade assistant

        this.$serviceHeader = this.$mainControl.find('.brtc-installer-sidebar-service-header');    //service header
        this.$serviceHeaderExpander = this.$mainControl.find('.brtc-installer-sidebar-service-header-expander');
        this.$serviceList = this.$mainControl.find('.brtc-installer-sidebar-service-list');

        this.$externalPackageHeader = this.$mainControl.find('.brtc-installer-sidebar-externalpackage-header');    //external package header

        this.$patchmanagerHeader = this.$mainControl.find('.brtc-installer-sidebar-patchmanager-header');    //patchmanager header

        this.$serviceHeader.click(function(){
            var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
            studio.renderServicesHome();
        });

        this.$externalPackageHeader.click(function(){
            var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
            studio.renderExternalPackageInterface();
        });
        
        this.$patchmanagerHeader.click(function(){
            var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
            studio.renderPatchmanagerHome();
        });

        this.$installerHeader.click(function(){
            var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
            studio.renderHome();
        });

        this.$installerHeaderExpander.click(function(event){
            if(_this.$installerHeader.hasClass('lnb-open-main')){
                _this.closeInstallerList();
            }
            else{
                _this.openInstallerList();
            }
            event.stopPropagation();
        });

        this.$serviceHeaderExpander.click(function(event){
            if(!_this.$serviceHeader.hasClass('disabled')){
                if(_this.$serviceHeader.hasClass('lnb-open-main')){
                    _this.closeServiceList();
                }
                else{
                    _this.openServiceList();
                }
            }
            event.stopPropagation();
        });

        this.$installerListUpgradeAssistant.click(function(){
        	console.log(Brightics.Installer.Studio.mode);
        	if (Brightics.Installer.Studio.upgradeInfo === undefined || Brightics.Installer.Studio.mode == 'INSTALLED'){
                _this.studio.contentContainer.renderUpgradeAssistant();
        	}
        	else {
                // _this.studio.contentContainer.renderUpgradeHome();
                // For DEV - START
                if($.inArray("dev", Brightics.Installer.Studio.appData.mode) < 0) {
                    _this.studio.contentContainer.renderUpgradeAssistant();
                }
                else {
                    _this.studio.contentContainer.renderUpgradeHome();
                }
                // For DEV - END
        	}
        });
        
        this.$installerListUninstall.click(function(){
            _this.studio.contentContainer.renderUninstall();
        });

        this.$installerListInstallProgress.click(function(){
            _this.studio.contentContainer.renderInstallProgress();
        });

        this.$installerListInstall.click(function(){
            _this.studio.contentContainer.renderInstallHome();
        });
    };

    SideBar.prototype.setEnableMenu = function (mode) {
    	Brightics.Installer.Studio.mode = mode;
    	if (mode == 'NOT_INSTALLED') {

        }
        else if (mode == 'INSTALLED') {
            this.renderInstalledHome();
        }
        else if (mode == 'IN_PROGRESS') {
        }
        else if (mode == 'FAILED') {
            this.renderUninstall();
        }
        else if (mode == 'FAILED_PROGRESS') {
        }
        else if (mode == 'SERVICES') {
        }
        else if (mode == 'UNINSTALL') {
        }
        else if (mode == 'INSTALL_FAILED') {
            this.renderUninstallFailed();
        }
        else if (mode == 'UNINSTALLED') {
            this.renderUninstalled();
        }
        else if (mode == 'ADD_NEW_SERVICE_FAILED') {
            this.renderAddNewServiceFailed();
        }
        else if (mode == 'UPGRADE_FAILED') {
            this.renderUpgradeHome();
        }
    };

    SideBar.prototype.renderInstallHome = function () {
        this.renderDefault();
        this.openInstallerList();
        this.closeServiceList();

        this.$installerListInstallProgress.addClass('disabled');
        this.$installerListUninstall.addClass('disabled');
        this.$installerListUpgradeAssistant.addClass('disabled');

        this.$serviceHeader.addClass('disabled');
        this.$externalPackageHeader.addClass('disabled');
        this.$patchmanagerHeader.addClass('disabled');
    };

    SideBar.prototype.renderAddNewServiceFailed = function () {
        this.renderUninstallFailed();
        this.openServiceList();

        this.$installerListInstallProgress.removeClass('disabled');
        this.$serviceHeader.removeClass('disabled');
    };

    SideBar.prototype.renderInstalledHome = function () {
        this.renderDefault();
        this.openInstallerList();
        this.openServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListInstallProgress.addClass('disabled');

        this.$externalPackageHeader.removeClass('disabled');
        this.$patchmanagerHeader.removeClass('disabled');

        this.renderServices();
    };

    SideBar.prototype.renderAddNewServiceProgress = function () {
        // this.renderDefault();
        this.openInstallerList();
        this.openServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListInstallProgress.addClass('disabled');
        this.$installerListUninstall.addClass('disabled');
        this.$installerListUpgradeAssistant.addClass('disabled');
        this.renderServices();

        this.$serviceList.addClass('disabled');
        this.$serviceHeader.addClass('disabled');
        this.$externalPackageHeader.addClass('disabled');
        this.$patchmanagerHeader.addClass('disabled');
    };

    SideBar.prototype.renderInstallStep = function () {
        this.renderDefault();
        this.openInstallerList();
        this.closeServiceList();

        this.$installerListInstall.addClass('current');
        this.$installerListInstallProgress.addClass('disabled');
        this.$installerListUninstall.addClass('disabled');
        this.$installerListUpgradeAssistant.addClass('disabled');

        this.$serviceHeader.addClass('disabled');
    };

    SideBar.prototype.renderInstallProgress = function () {
        this.renderDefault();
        this.openInstallerList();
        this.closeServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListInstallProgress.addClass('current');
        this.$installerListUninstall.addClass('disabled');
        this.$installerListUpgradeAssistant.addClass('disabled');
        this.$externalPackageHeader.addClass('disabled');
        this.$patchmanagerHeader.addClass('disabled');

        this.$serviceHeader.addClass('disabled');
    };

    SideBar.prototype.renderUpgradeAssistant = function () {
        var _this = this;

        this.renderDefault();
        this.openInstallerList();
        this.openServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListUpgradeAssistant.addClass('current');

        this.renderServices();

        this.$installerListUpgradeAssistant.click(function(){
            _this.studio.contentContainer.renderUpgradeAssistant();
        });
    };
    
    SideBar.prototype.renderUpgradeHome = function () {
        this.renderDefault();
        this.openInstallerList();
        this.closeServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListInstallProgress.addClass('disabled');
        this.$installerListUninstall.addClass('disabled');

        this.$serviceHeader.addClass('disabled');
        this.$externalPackageHeader.addClass('disabled');
        this.$patchmanagerHeader.addClass('disabled');
    };
    
    SideBar.prototype.renderUpgradeStep = function () {
        this.renderDefault();
        this.openInstallerList();
        this.closeServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListInstallProgress.addClass('disabled');
        this.$installerListUninstall.addClass('disabled');
        this.$installerListUpgradeAssistant.addClass('current');

        this.$serviceHeader.addClass('disabled');
        this.$externalPackageHeader.addClass('disabled');
        this.$patchmanagerHeader.addClass('disabled');

    };
    
    SideBar.prototype.renderUninstall = function () {
        var _this = this;

        this.renderDefault();
        this.openInstallerList();
        this.openServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListUninstall.addClass('current');
        this.$installerListUpgradeAssistant.addClass('disabled');

        this.renderServices();

        this.$installerListUninstall.click(function(){
            _this.studio.contentContainer.renderUninstall();
        });
    };

    SideBar.prototype.renderUninstallProgress = function () {
        var _this = this;

        this.renderDefault();
        this.openInstallerList();
        this.openServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListUninstall.addClass('current');
        this.$installerListUpgradeAssistant.addClass('disabled');
        this.$externalPackageHeader.addClass('disabled');
        this.$patchmanagerHeader.addClass('disabled');

        this.renderServices();

        this.$installerListUninstall.click(function(){
            _this.studio.contentContainer.renderUninstall();
        });
    };

    SideBar.prototype.renderServicesHome = function(){
        this.renderDefault();
        this.openInstallerList();
        this.openServiceList();

        this.$installerListInstall.addClass('disabled');
        this.$installerListInstallProgress.addClass('disabled');
        this.renderServices();
    };

    SideBar.prototype.renderServices = function(){
        var _this = this;

        var option = {
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/services',
            success: function(data) {

                var serviceList = [];

                for (var i in data.packages) {
                    serviceList.push(data.packages[i].packageName);
                }
                console.log('sidebar');
                console.log(serviceList);
                _this.renderServiceList(serviceList);
            }
        };

        $.ajax(option);
    };

    SideBar.prototype.renderServiceList = function(data){
        var _this = this,
            _serviceList = data.sort();

        this.$serviceList.empty();

        for (var i in _serviceList) {
            var $liComponent = $('<li><a href="#">'+_serviceList[i]+'</a></li>');
            $liComponent.addClass('lnb-open-sub-'+_serviceList[i]);
            $liComponent.attr('service-name', _serviceList[i]);
            this.$serviceList.append($liComponent);

            $liComponent.click(function(){
                var serviceName = $(this).attr('service-name');
                var url = '/api/v1/services/'+ serviceName ;

                $.ajax({
                    method: 'GET',
                    crossDomain: true,
                    url: url,
                    success: function(summaryData){
                        console.log(summaryData);
                        _this.studio.contentContainer.renderServiceDetail(summaryData, serviceName);

                    }
                }).done(function(data){

                }).fail(function(data){
                    console.error(data);
                });
            });
        }

        this.addServiceHeaderEvent();
    };

    SideBar.prototype.addServiceHeaderEvent = function () {
        // var _this = this;
        //
        // this.$serviceHeader.click(function(){
        //     _this.studio.renderServicesHome();
        // });
    };

    SideBar.prototype.empty = function () {
        this.emptyServiceList();
    };

    SideBar.prototype.emptyServiceList = function () {
        this.$serviceList.empty();
    };

    SideBar.prototype.renderDefault = function () {
        this.renderDefaultInstallList();
        this.renderDefaultServiceList();
        this.renderDefaultExternalPackage();
        this.renderDefaultPatchmanager();
    };

    SideBar.prototype.renderDefaultExternalPackage = function () {
        
    };

    SideBar.prototype.renderDefaultPatchmanager = function () {
    };
    
    SideBar.prototype.renderDefaultInstallList = function () {
        this.$installerHeader.removeClass('lnb-open-main');
        this.$installerHeader.removeClass('lnb-close-main');
        this.$installerHeader.removeClass('disabled');
        this.$installerList.removeClass('lnb-open-sub');
        this.$installerList.removeClass('lnb-close-sub');
        this.$installerList.removeClass('disabled');
        this.$installerList.find('li').removeClass('current');
        this.$installerList.find('li').removeClass('disabled');
    };

    SideBar.prototype.renderDefaultServiceList = function () {
        this.$serviceHeader.removeClass('lnb-open-main');
        this.$serviceHeader.removeClass('lnb-close-main');
        this.$serviceHeader.removeClass('disabled');
        this.$serviceList.removeClass('lnb-open-sub');
        this.$serviceList.removeClass('lnb-close-sub');
        this.$serviceList.removeClass('disabled');
        this.$serviceList.empty();
    };
    
    SideBar.prototype.openInstallerList = function () {
        this.$installerHeader.removeClass('lnb-close-main');
        this.$installerHeader.addClass('lnb-open-main');

        this.$installerList.removeClass('lnb-close-sub');
        this.$installerList.addClass('lnb-open-sub');
    };

    SideBar.prototype.closeInstallerList = function () {
        this.$installerHeader.removeClass('lnb-open-main');
        this.$installerHeader.addClass('lnb-close-main');

        this.$installerList.removeClass('lnb-open-sub');
        this.$installerList.addClass('lnb-close-sub');
    };

    SideBar.prototype.openServiceList = function () {
        this.$serviceHeader.removeClass('lnb-close-main');
        this.$serviceHeader.addClass('lnb-open-main');

        this.$serviceList.removeClass('lnb-close-sub');
        this.$serviceList.addClass('lnb-open-sub');
    };

    SideBar.prototype.closeServiceList = function () {
        this.$serviceHeader.removeClass('lnb-open-main');
        this.$serviceHeader.addClass('lnb-close-main');

        this.$serviceList.removeClass('lnb-open-sub');
        this.$serviceList.addClass('lnb-close-sub');
    };

    SideBar.prototype.disableAll = function () {
        this.$installerHeader.addClass('disabled');
        this.$serviceHeader.addClass('disabled');
        this.$externalPackageHeader.addClass('disabled');
        this.$patchmanagerHeader.addClass('disabled');
        
        this.closeInstallerList();
        this.closeServiceList();
    };

    SideBar.prototype.renderUninstallFailed = function () {
        this.$installerHeader.addClass('disabled');
        this.$serviceHeader.addClass('disabled');

        this.$installerListInstall.addClass('disabled');
        this.$installerListInstallProgress.removeClass('disabled');
        this.$installerListUninstall.removeClass('disabled');
        this.$installerListUpgradeAssistant.addClass('disabled');

        this.closeServiceList();
    };

    SideBar.prototype.renderUninstalled = function () {
        this.$installerHeader.removeClass('disabled');
        this.$serviceHeader.addClass('disabled');

        this.$installerListInstall.removeClass('disabled');
        this.$installerListInstallProgress.addClass('disabled');
        this.$installerListUninstall.addClass('disabled');
        this.$installerListUpgradeAssistant.addClass('disabled');

        this.openInstallerList();
        this.closeServiceList();
    };

    root.Brightics.Installer.SideBar = SideBar;

}).call(this);