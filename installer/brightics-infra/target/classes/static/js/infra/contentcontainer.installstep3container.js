/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InstallStep3Container($parent) {
        this.$parent = $parent;
    }

    InstallStep3Container.prototype.setController = function (controller) {
        this.controller = controller;
    };

    InstallStep3Container.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderContent();
    };

    InstallStep3Container.prototype.createLayout = function () {
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

    InstallStep3Container.prototype.createHeadArea = function () {
        this.$headArea = $('' +
            '<div class="h2_title"><span>Install</span></div>' +
            '<div class="location">' +
            '   <a href="#">Installer</a><img src="static/images/ico_path.gif" alt=""/><strong>Install</strong>' +
            '</div>');
        this.$parent.append(this.$headArea);
        this.$headArea.find('a').hover(function () {
            $(this).css('cursor', 'text');
        });
    };

    InstallStep3Container.prototype.createContArea = function () {
        this.$contArea = $('<div class="cont_area clearfix"></div>');
        this.createTabArea();
        this.createDeployServiceArea();
        this.$parent.append(this.$contArea);
    };

    InstallStep3Container.prototype.createTabArea = function () {
        this.$tabArea = $('' +
            '<div class="tab_type01">' +
            '   <ul>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">01</span>' +
            '               <span class="tab_type01_text_off"> Host Name and the Account</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">02</span>' +
            '               <span class="tab_type01_text_off"> Check the Services list</span>' +
            '           </a>' +
            '        </li>' +
            '       <li class="tab_01">' +
            '           <a href="#"  class="on">' +
            '               <span class="tab_num">03</span>' +
            '               <span class="tab_type01_text_on"> Deploy Status of Services</span>' +
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

    InstallStep3Container.prototype.createDeployServiceArea = function () {
        this.$deployServiceArea = $('' +
            '<div style="float:left;width:610px;position:relative;top:0;margin-bottom: 120px;">' +
            '   <div class="row-fluid ">' +
            '       <div class="h3_title"><span>Deploy Status by Component</span></div>' +
            '   </div>' +
            '   <div id="installer_step3_deploy_by_component_container" class="row_fiuld_box" style="overflow-y:auto;"></div>' +
            '</div>' +
            '<div style="float:left;margin:340px 8px;">' +
            '   <div class="btnArrow"><img src="static/images/board_next_s.png"/></div>' +
            '</div>' +
            '<div style="float:right;width:610px;position:relative;top:0;margin-bottom: 120px;">' +
            '   <div class="row-fluid ">' +
            '       <div class="h3_title"><span>Deploy Status by Host</span></div>' +
            '   </div>' +
            '   <div id="installer_step3_deploy_by_host_container" class="row_fiuld_box row_fiuld_box_disabled" style=" overflow-y:auto;"></div>' +
            '</div>');
        this.$contArea.append(this.$deployServiceArea);
        this.$deployServiceArea.find('button.btnArrow').parent().hide();
        this.$deployServiceArea.find('button.btnArrow').hover(function () {
            $(this).css('cursor', 'default');
        });
        this.$deployServiceArea.find('button.btnArrow').parent().hover(function () {
            $(this).css('cursor', 'default');
        });
    };

    InstallStep3Container.prototype.createButtonArea = function () {
        this.$tabArea = $('' +
            '<div class="fix_area ">' +
            '   <div class="btn_wrap">' +
            '       <div class="fl_r">' +
            '           <button class="btnBigGray"><span>Previous</span></button>' +
            '           <button class="btnBigGray"><span>Next</span></button>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '');
        this.$contArea.append(this.$tabArea);
    };

    InstallStep3Container.prototype.renderContent = function () {
        try {
            var $content = $('#content');
            var serviceDeployManager = new ServiceDeployManager($content, {controller: this.controller});
            serviceDeployManager.renderContents();

            serviceDeployManager.bindPreviousButtonEvent();
            serviceDeployManager.bindNextButtonEvent();
        }
        catch (e) {
            console.error(e);
        }
    };

    //Constructor
    function ServiceDeployManager($parent, options) {
        this.$parent = $parent;
        this.controller = options.controller;

        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ServiceDeployManager.prototype.renderContents = function () {
        var _this = this;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: '/api/v1/wizard/installstep3',
            success: function (response) {
                console.log('step3 GET');

                _this.getDataFormat = {
                    packages: {},
                    hosts: response.hosts,
                };
                /*
                _this.getDataFormat = {
                    hosts: ["host01", "host02"],
                    packages: {
                        "spark": {
                            packageId: 0,
                            packageName: "spark",
                            components: {
                                componentId: 0,
                                componentName: "sparkmaster",
                                componentLabel: "Spark Master",
                                hosts: ["host01"]
                            }
                        }
                    }
                }
                */

                for( var pkgIdx in response.packages ) {
                    var pkg = response.packages[pkgIdx];
                    _this.getDataFormat.packages[pkg.packageName] = {
                        packageId: pkg.packageId,
                        packageName: pkg.packageName,
                        components: {}
                    };

                    for( var componentIdx in pkg.components ) {
                        var component = pkg.components[componentIdx];
                        _this.getDataFormat.packages[pkg.packageName].components[component.componentLabel] = component;
                    }
                }

                console.log(_this.getDataFormat);

                var data = _this.getDataFormat;
                _this.hostsArray = data.hosts;
                _this.renderComponentList(data);

                _this.hostsLayoutFormat = _this.convertToHostLayoutFormat(data);
                _this.renderHostList(_this.hostsLayoutFormat);

                $('button.btnArrow').parent().show();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error(xhr);
            }
        });

        //$('.btnArrow').click(function () {
        //    _this.hostLayoutFormat = _this.convertToHostLayoutFormat(_this.getDataFormat);
        //    _this.renderHostList(_this.hostLayoutFormat);
        //});
    };

    ServiceDeployManager.prototype.renderComponentList = function (data) {
        var $deployByComponentContainer = $('#installer_step3_deploy_by_component_container');
        $deployByComponentContainer.empty();

        var packages = data.packages;
        for (var packageIdx in packages) {
            var $newPackage = this.appendNewPackageNameToLeft($deployByComponentContainer, packages[packageIdx].packageName);

            for (var componentIdx in packages[packageIdx].components) {
                var $newComponent = this.appendNewComponentToLeft($newPackage.find('.installer_step3_deploy_by_component_component_name_list'), packages[packageIdx].components[componentIdx].componentLabel);

                for (var index in packages[packageIdx].components[componentIdx].hosts) {
                    var $newHost = this.appendNewHostToLeft($newComponent.find('.installer_step3_deploy_by_component_host_name_list'), packages[packageIdx].components[componentIdx].hosts[index]);
                }
            }
        }
    };

    ServiceDeployManager.prototype.appendNewPackageNameToLeft = function ($parent, packageName) {
        var $newPackage = $('' +
            '<div class="installer_step3_deploy_by_component_package_box row-fluid mt22">' +
            '   <div class="h4_title"><span class="installer_step3_deploy_by_component_package_name"></span></div>' +
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
            '                           <th class="center">Component</th>' +
            '                           <th class="center">Host</th>' +
            '                       </tr>' +
            '                   </thead>' +
            '                   <tbody class="installer_step3_deploy_by_component_component_name_list">' +
            '                   </tbody>' +
            '               </table>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '');
        $parent.append($newPackage);
        if (packageName) {
            $newPackage.find('.installer_step3_deploy_by_component_package_name').text(packageName);
        }

        return $newPackage;
    };

    ServiceDeployManager.prototype.appendNewComponentToLeft = function ($parent, componentName) {
        var _this = this;
        var prevLength = $('.installer_step3_jqx_component_add').length;
        var $newComponent = $('' +
            '<tr class="installer_step3_deploy_by_component_component">' +
            '   <td class="installer_step3_deploy_by_component_component_name left pl20"></td>' +
            '   <td class="left">' +
            '       <div class="board-Cpnlist-box-line">' +
            '           <ul class="installer_step3_deploy_by_component_host_name_list">' +
            '               <li class="board-ChipItem last">' +
            '                   <div class="installer_step3_jqx_component_add" id="jqxComponentAdd' + prevLength + '"></div>' +
            '               </li>' +
            '           </ul>' +
            '       </div>' +
            '   </td>' +
            '</tr>' +
            '');
        $parent.append($newComponent);
        if (componentName) {
            $newComponent.find('.installer_step3_deploy_by_component_component_name').text(componentName).css('line-height', '20px');
        }

        var source = $.extend(true, [], this.hostsArray);
        source.splice(0, 0, 'Click to add Hosts.');
        $('#jqxComponentAdd' + prevLength).jqxDropDownList({
            source: source,
            animationType: 'fade',
            selectedIndex: 0,
            theme: 'office',
            width: 130,
            height: '25px',
            placeHolder: 'Click to add Hosts.'
        });
        $("#listBoxjqxComponentAdd" + prevLength).css("margin-top", -25 + "px");
        $("#dropdownlistArrowjqxComponentAdd" + prevLength).css("visibility", "collapse");

        //Click 했을 때 add 되는 이벤트
        $('#jqxComponentAdd' + prevLength).on('change', function () {
            if ($(this).val() !== 'Click to add Hosts.') {
                var $li = $(this).parents('.installer_step3_deploy_by_component_host_name_list').find('li.board-ChipItem span.installer_step3_deploy_by_component_host_name');
                var existFlag = false;
                for (var i = 0; i < $li.length; i++) {
                    if ($($li[i]).text() === $(this).val()) {
                        existFlag = true;
                        break;
                    }
                }

                if (!existFlag) {
                    var $newHost = _this.appendNewHostToLeft($('#jqxComponentAdd' + prevLength).parents('.installer_step3_deploy_by_component_host_name_list'));
                    $newHost.find('.installer_step3_deploy_by_component_host_name').text($(this).val());

                    var packageName = $(this).parents('.installer_step3_deploy_by_component_package_box').find('.installer_step3_deploy_by_component_package_name').text();
                    var componentName = $(this).parents('.installer_step3_deploy_by_component_component').find('.installer_step3_deploy_by_component_component_name').text();
                    var hostName = $(this).val();
                    _this.getDataFormat.packages[packageName].components[componentName].hosts.push(hostName);

                    _this.hostsLayoutFormat = _this.convertToHostLayoutFormat(_this.getDataFormat);
                    _this.renderHostList(_this.hostsLayoutFormat);
                }
                $(this).val('Click to add Hosts.');

                _this.checkHost();
            }
        });

        return $newComponent;
    };

    ServiceDeployManager.prototype.appendNewHostToLeft = function ($parent, hostName) {
        var _this = this;
        var $newHost = $('' +
            '<li class="board-ChipItem">' +
            '   <div class="installer_step3_deploy_by_component_chip">' +
            '       <span class="installer_step3_deploy_by_component_host_name td-close"></span>' +
            '       <div class="installer_step3_deploy_by_component_host_name_remove_button" style="position:absolute; top:5px; right:5px; width:35px; height: 18px; cursor:pointer"></div>' +
            '   </div>' +
            '</li>');
        $parent.children(':last').before($newHost);
        if (hostName) {
            $newHost.find('.installer_step3_deploy_by_component_host_name').text(hostName);
        }

        $newHost.find('.installer_step3_deploy_by_component_host_name_remove_button').click(function () {
            var packageName = $(this).parents('.installer_step3_deploy_by_component_package_box').find('.installer_step3_deploy_by_component_package_name').text();
            var componentLabel = $(this).parents('.installer_step3_deploy_by_component_component').find('.installer_step3_deploy_by_component_component_name').text();
            var hostName = $newHost.find('.installer_step3_deploy_by_component_host_name_remove_button').prev().text();

            var target = _this.getDataFormat.packages[packageName].components[componentLabel].hosts;

            var index = -1;
            for (var i in target) {
                if (target[i] === hostName) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                target.splice(index, 1);
            }
            $newHost.find('.installer_step3_deploy_by_component_host_name_remove_button').parents('.board-ChipItem').remove();

            _this.hostsLayoutFormat = _this.convertToHostLayoutFormat(_this.getDataFormat);
            _this.renderHostList(_this.hostsLayoutFormat);

            _this.checkHost();
        });

        return $newHost;
    };

    ServiceDeployManager.prototype.convertToHostLayoutFormat = function (data) {
        var layoutData = {hosts: {}};

        for (var hostIdx in data.hosts) {
            layoutData.hosts[data.hosts[hostIdx]] = {packages: {}};
        }
        for (var packageIdx in data.packages) {
            var pkgName = data.packages[packageIdx].packageName;
            for (var componentIdx in data.packages[packageIdx].components) {
                var componentLabel = data.packages[packageIdx].components[componentIdx].componentLabel
                for (var index in data.packages[packageIdx].components[componentIdx].hosts) {
                    var hostName = data.packages[packageIdx].components[componentIdx].hosts[index];

                    if (layoutData.hosts[hostName].packages[pkgName] === undefined) {
                        layoutData.hosts[hostName].packages[pkgName] = {components: []};
                    }
                    layoutData.hosts[hostName].packages[pkgName].components.push(componentLabel);
                }
            }
        }
        return layoutData;
    };

    ServiceDeployManager.prototype.renderHostList = function (data) {
        var $deployByHostContainer = $('#installer_step3_deploy_by_host_container');
        $deployByHostContainer.empty();

        var hosts = data.hosts;

        for (var hostKey in hosts) {
            var $newHost = this.appendNewHostToRight($deployByHostContainer, hostKey);

            for (var packageKey in hosts[hostKey].packages) {
                var $newPackage = this.appendNewPackageToRight($newHost.find('.installer_step3_deploy_by_host_package_name_list'), packageKey);

                if (hosts[hostKey].packages[packageKey].components) {
                    for (var index in hosts[hostKey].packages[packageKey].components) {
                        var $newComponent = this.appendNewComponentToRight($newPackage.find('.installer_step3_deploy_by_host_component_name_list'), hosts[hostKey].packages[packageKey].components[index]);
                    }
                }
            }
        }
    };

    ServiceDeployManager.prototype.appendNewHostToRight = function ($parent, hostName) {
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
    };

    ServiceDeployManager.prototype.appendNewPackageToRight = function ($parent, packageName) {
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
            $newPackage.find('.installer_step3_deploy_by_host_package_name').text(packageName).css('line-height', '20px');
        }

        return $newPackage;
    };

    ServiceDeployManager.prototype.appendNewComponentToRight = function ($parent, componentName) {
        var $newComponent = $('<li class="board-CpnItem"><a href=""><span class="installer_step3_deploy_by_host_component_name"></span></a></li>');
        $parent.append($newComponent);
        if (componentName) {
            $newComponent.find('.installer_step3_deploy_by_host_component_name').text(componentName);
        }

        return $newComponent;
    };

    ServiceDeployManager.prototype.bindPreviousButtonEvent = function () {
        var _this = this;
        $('.fix_area > .btn_wrap > .fl_r > .btnBigGray:first').on('click', function () {
            _this.studio.showPopup({
                title: 'Go to the previous step',
                mode: 'confirm',
                message: ['Do you want to go to step 2?', 'The current work will be deleted'],
                hasCheckBox: false,
                checkBoxMessage: '',
                callback: function (isChecked) {
                    _this.controller.startStep2();
                }
            });
        });
    };

    ServiceDeployManager.prototype.checkHost = function () {
        var rt = true;

        var componentList = $('.installer_step3_deploy_by_component_component');
        for (var i=0; i< componentList.length; i++) {
            var hostLength = $(componentList[i]).find('li').length;

            if (hostLength == 1) {
                rt = false;
                $(componentList[i]).find('.board-Cpnlist-box-line').addClass('has-error');
            } else {
                $(componentList[i]).find('.board-Cpnlist-box-line').removeClass('has-error');
            }
        }

        return rt;
    };

    ServiceDeployManager.prototype.bindNextButtonEvent = function () {
        var _this = this;
        $('.fix_area > .btn_wrap > .fl_r > .btnBigGray:last').on('click', function () {
            if (_this.checkHost()) {
                var sendData = _this.createSendData();

                console.log('install_step3_next');

                $.ajax({
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    url: '/api/v1/wizard/installstep3',
                    data: JSON.stringify(sendData),
                    success: function (response) {
                        var responseObject = response;

                        if (responseObject.response.status === 'success') {
                            _this.controller.startStep4();
                        } else if(responseObject.response.status === 'failed') {
                            _this.studio.showPopup({
                                title: 'Error',
                                mode: 'alert',
                                message: [responseObject.response.message],
                                hasCheckBox: false,
                                checkBoxMessage: '',
                                callback: function (isChecked) {
                                }
                            });
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {

                    }
                });
            } else {
                _this.studio.showPopup({
                    title: 'Error',
                    mode: 'alert',
                    message: ['check component'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {

                    }
                });
            }

        });
    };

    ServiceDeployManager.prototype.createSendData = function () {
        var _this = this;

        var sendDataFormat = {
            packages: [],
            hosts: _this.getDataFormat.hosts
        };

        for( var pkgKey in _this.getDataFormat.packages ) {
            var pkg = _this.getDataFormat.packages[pkgKey];
            var newPkg = {
                packageName: pkg.packageName,
                packageId: pkg.packageId,
                components: []
            }

            for( var componentKey in pkg.components ) {
                var component = pkg.components[componentKey];
                var newComponent = {
                    componentId: component.componentId,
                    componentName: component.componentName,
                    componentLabel: component.componentLabel,
                    hosts: component.hosts
                }
                newPkg.components.push(newComponent)
            }
            sendDataFormat.packages.push(newPkg);
        }

        return sendDataFormat;
    };

    root.Brightics.Installer.ContentContainer.InstallStep3Container = InstallStep3Container;

}).call(this);
