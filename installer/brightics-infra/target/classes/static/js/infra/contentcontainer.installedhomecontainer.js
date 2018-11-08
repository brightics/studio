/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InstalledHomeContainer($parent) {
        this.$parent = $parent;
    }

    InstalledHomeContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderContent();
    };

    InstalledHomeContainer.prototype.createLayout = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="h2_title clearfix"><span>Deploy Status by Host</span></div>' +
            '<div class="statusarea ">' +
            '   <ul>' +
            '       <li>' +
            '           <div class="iconstatus status_running "></div>' +
            '           <span>RUNNING</span>' +
            '       </li>' +
            '       <li>' +
            '           <div class="iconstatus status_stop "></div>' +
            '           <span>STOP</span>' +
            '       </li>' +
            //'       <li>' +
            //'           <div class="iconstatus status_error "></div>' +
            //'           <span>Error</span>' +
            //'       </li>' +
            '       <li>' +
            '           <div class="iconstatus status_warning "></div>' +
            '           <span>WARNING</span>' +
            '       </li>' +
            '   </ul>' +
            '</div>' +
            '<div class="location"></div>' +
            '<div id="installer_home_installed_host_list_container" class="cont_area  clearfix">' +
            '</div>');
        this.$parent.append(this.$mainControl);

        //var leftInit = $(".cont_area").offset().left;
        //var left = 251;
        //$(".fix_area").offset({
        //    left: leftInit
        //});
        //$(".left_line").offset({
        //    left: left
        //});
        //
        //$(window).scroll(function (event) {
        //    var leftInit1 = $(".cont_area").offset().left;
        //    $(".fix_area").offset({
        //        left: leftInit1
        //    });
        //    $(".left_line").offset({
        //        left: left
        //    });
        //});
        //
        //$(window).resize(function (event) {
        //    var leftInit1 = $(".cont_area").offset().left;
        //    $(".fix_area").offset({
        //        left: leftInit1
        //    });
        //    $(".left_line").offset({
        //        left: left
        //    });
        //});

        //TODO
        $('#installer_home_installed_uninstall_button').click(function () {
            //window.location.href = '../installer/Infra_Installer_Uninstall.html';
            _this.studio.contentContainer.renderUninstall();
        });
        //TODO
        $('#installer_service_button').click(function () {
            //window.location.href = '../services/Infra_Services.html';
            _this.studio.contentContainer.renderServicesHome();
        });
    };

    InstalledHomeContainer.prototype.renderContent = function () {
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: '/api/v1/context',
            data: {
                "action": 'installed_home'
            },
            success: function (response) {
                var getDataFormat = $.extend(true, {}, response);
                console.log('InstalledHomeContainer');
                console.log(getDataFormat);

                var data = convertToHostLayoutFormat(getDataFormat);
                renderHostList(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error(xhr);
            }
        });
    };

    function convertToHostLayoutFormat(data) {
        var layoutData = {hosts: {}};

        for (var hostKey in data.hosts) {
            layoutData.hosts[hostKey] = {packages: {}};
        }
        for (var packageKey in data.packages) {
            if (data.packages[packageKey].isSelected == true) {
                for (var componentKey in data.packages[packageKey].components) {
                    for (var index in data.packages[packageKey].components[componentKey].details) {
                        var hostName = data.packages[packageKey].components[componentKey].details[index].hostName;
                        var hostStatus = data.packages[packageKey].components[componentKey].details[index].status;

                        if (layoutData.hosts[hostName].packages[packageKey] === undefined) {
                            layoutData.hosts[hostName].packages[packageKey] = {components: []};
                        }

                        layoutData.hosts[hostName].packages[packageKey].components.push({
                            component: componentKey,
                            status: hostStatus
                        });
                    }
                }
            }
        }
        return layoutData;
    }

    function renderHostList(data) {
        var $deployByHostContainer = $('#installer_home_installed_host_list_container');
        $deployByHostContainer.empty();

        var hosts = data.hosts;

        for (var hostKey in hosts) {
            var $newHost = appendNewHost($deployByHostContainer, hostKey);

            for (var packageKey in hosts[hostKey].packages) {
                var $newPackage = appendNewPackage($newHost.find('.installer_step3_deploy_by_host_package_name_list'), packageKey);

                if (hosts[hostKey].packages[packageKey].components) {
                    for (var index in hosts[hostKey].packages[packageKey].components) {
                        var componentName = hosts[hostKey].packages[packageKey].components[index].component;
                        var componentStatus = hosts[hostKey].packages[packageKey].components[index].status;
                        var $newComponent = appendNewComponent($newPackage.find('.installer_step3_deploy_by_host_component_name_list'), componentName, componentStatus);
                    }
                }
            }
        }
    }

    function appendNewHost($parent, hostName) {
        var $newHost = $('' +
            '<div class="row-fluid mt22 row_fiuld_data_disabled" >' +
            '   <div class="row-fluid mt10">' +
            '       <div>' +
            '           <div class="board">' +
            '               <table class="board-Cpnlist">' +
            '                   <colgroup>' +
            '                       <col class="w21" />' +
            '                       <col />' +
            '                   </colgroup>' +
            '                   <thead>' +
            '                       <tr>' +
            '                           <th colspan="2" class="installer_step3_deploy_by_host_host_name center"></th>' +
            '                       </tr>' +
            '                   </thead>' +
            '                   <tbody class="installer_step3_deploy_by_host_package_name_list">' +
            '                   </tbody>' +
            '               </table>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '');
        $parent.append($newHost);
        if (hostName) {
            $newHost.find('.installer_step3_deploy_by_host_host_name').text(hostName);
        }

        return $newHost;
    }

    function appendNewPackage($parent, packageName) {
        var $newPackage = $('' +
            '<tr>' +
            '   <td class="installer_step3_deploy_by_host_package_name left pl20">asdf</td>' +
            '   <td class="left">' +
            '       <ul class="installer_step3_deploy_by_host_component_name_list">' +
            '       </ul>' +
            '   </td>' +
            '</tr>' +
            '');
        $parent.append($newPackage);
        if (packageName) {
            $newPackage.find('.installer_step3_deploy_by_host_package_name').text(packageName);
        }

        return $newPackage;
    }

    function appendNewComponent($parent, componentName, status) {
        var renderClass = status.toLowerCase();
        if (renderClass === 'start') {
            renderClass = 'running';
        }
        else if (renderClass === 'config') {
            renderClass = 'stop';
        }

        var $newComponent = $('<li class="board-CpnItem"><a class="box_' + renderClass + '"><span class="installer_step3_deploy_by_host_component_name"></span></a></li>');
        $parent.append($newComponent);
        if (componentName) {
            $newComponent.find('.installer_step3_deploy_by_host_component_name').text(componentName);
        }

        return $newComponent;
    }

    root.Brightics.Installer.ContentContainer.InstalledHomeContainer = InstalledHomeContainer;

}).call(this);