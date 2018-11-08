/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ContentContainer($parent) {
        this.$parent = $parent;
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));

        this.createControls();
    }

    ContentContainer.prototype.createControls = function () {
        this.$mainControl = $('<div id="content" class="brtc-installer-content-container" style="min-height:900px"></div>');
        this.$parent.append(this.$mainControl);
    };

    ContentContainer.prototype.empty = function () {
        this.$mainControl.empty();
    };

    ContentContainer.prototype.renderInstallHome = function(){
        this.installHome = new Brightics.Installer.ContentContainer.InstallHomeContainer(this.$mainControl);
        this.installHome.render();
    };

    ContentContainer.prototype.renderInstalledHome = function(){
        this.installedHome = new Brightics.Installer.ContentContainer.InstalledHomeContainer(this.$mainControl);
        this.installedHome.render();
    };

    ContentContainer.prototype.renderInstallStep = function(){
        this.stepController = new Brightics.Installer.Controller.InstallStepController(this.$mainControl);
        this.stepController.startStep1();
    };

    ContentContainer.prototype.renderInstallProgress = function(){
        this.$mainControl.empty();
        this.installProgress = new Brightics.Installer.ContentContainer.InstallProgressHome(this.$mainControl);
    };

    ContentContainer.prototype.renderUpgradeAssistant = function(){
        this.upgradeAssistantHome = new Brightics.Installer.ContentContainer.UpgradeAssistantHomeContainer(this.$mainControl);
        this.upgradeAssistantHome.render();
    };
    
    ContentContainer.prototype.renderUninstall = function(){
        this.uninstallHome = new Brightics.Installer.ContentContainer.UninstallHomeContainer(this.$mainControl);
        this.uninstallHome.render();
    };

    ContentContainer.prototype.renderUninstallProgress = function(){
        this.uninstallProgress = new Brightics.Installer.ContentContainer.UninstallProgressContainer(this.$mainControl);
        this.uninstallProgress.render();
    };

    ContentContainer.prototype.renderServicesHome = function(){
        this.servicesHome = new Brightics.Installer.ContentContainer.ServicesHomeContainer(this.$mainControl);
        this.servicesHome.render();
    };

    ContentContainer.prototype.renderServiceDetail = function (summaryData, serviceName) {
        this.servicesDetail = new Brightics.Installer.ContentContainer.ServicesDetailContainer(this.$mainControl, serviceName);
        this.servicesDetail.render(summaryData, serviceName);
    };

    ContentContainer.prototype.renderServicesAddStep = function(){
        this.stepController = new Brightics.Installer.Controller.ServicesAddStepController(this.$mainControl);  //#content
        this.stepController.startStep1();
    };

    ContentContainer.prototype.renderUserConfiguration = function(){
        this.userConfiguration = new Brightics.Installer.ContentContainer.UserConfiguration(this.$mainControl);
        this.userConfiguration.render();
    };

    ContentContainer.prototype.renderExternalPackageInterfaceHome = function(){
        this.externalPackageInterfaceHome = new Brightics.Installer.ContentContainer.ExternalPackageInterfaceHomeContainer(this.$mainControl);
        this.externalPackageInterfaceHome.render();
    };

    ContentContainer.prototype.renderPatchmanagerHome = function(){
        this.patchmanagerHome = new Brightics.Installer.ContentContainer.PatchmanagerHomeContainer(this.$mainControl);
        this.patchmanagerHome.render();
    };
    
    ContentContainer.prototype.renderPatchProgress = function(){
        this.patchProgress = new Brightics.Installer.ContentContainer.PatchProgressHome(this.$mainControl);
        this.patchProgress.render();
    };
    
    ContentContainer.prototype.renderUpgradeAssistantProgress = function(){
    	this.upgradeAssistantProgress = new Brightics.Installer.ContentContainer.UpgradeAssistantProgressHome(this.$mainControl);
    	this.upgradeAssistantProgress.render();
    };
    
    ContentContainer.prototype.renderUpgradeHome = function(){
    	this.upgradeHome = new Brightics.Installer.ContentContainer.UpgradeHomeContainer(this.$mainControl);
    	this.upgradeHome.render();
    };
    
    ContentContainer.prototype.renderUpgradeStep = function(){
        this.stepController = new Brightics.Installer.Controller.UpgradeStepController(this.$mainControl);
        this.stepController.startStep1();
    };

    ContentContainer.prototype.renderUpgradeProgress = function(){
        this.$mainControl.empty();
        this.upgradeProgress = new Brightics.Installer.ContentContainer.UpgradeProgressHome(this.$mainControl);
    };

    root.Brightics.Installer.ContentContainer = ContentContainer;

}).call(this);