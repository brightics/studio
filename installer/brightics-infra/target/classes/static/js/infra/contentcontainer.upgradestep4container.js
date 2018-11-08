/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeStep4Container($parent) {
        this.$parent = $parent;
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UpgradeStep4Container.prototype.setController = function (controller) {
        this.controller = controller;
    };

    UpgradeStep4Container.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderContent();
    };

    UpgradeStep4Container.prototype.createLayout = function () {
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

    UpgradeStep4Container.prototype.createHeadArea = function () {
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

    UpgradeStep4Container.prototype.createContArea = function () {
        this.$contArea = $('<div id="configuration_content" class="cont_area clearfix"></div>');
        this.createTabArea();
        this.createPackageTabArea();
        this.$parent.append(this.$contArea);
    };

    UpgradeStep4Container.prototype.createTabArea = function () {
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
            '           <a href="#">' +
            '               <span class="tab_num">03</span>' +
            '               <span class="tab_type01_text_off"> Deploy Status of Services</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#" class="on">' +
            '               <span class="tab_num">04</span>' +
            '               <span class="tab_type01_text_on">Configurations</span>' +
            '           </a>' +
            '       </li>' +
            '   </ul>' +
            '</div>');
        this.$contArea.append(this.$tabArea);
        this.$tabArea.find('a').hover(function () {
            $(this).css('cursor', 'default');
        });
    };

    UpgradeStep4Container.prototype.createPackageTabArea = function () {
        this.$packageTabArea = $('' +
            '<div id="installer_step4_package_tab" class="tab_type02 mt22">' +
            '   <button id="installer_step4_package_tab_left_button" class="btn_left btnTabArrow"><img src="static/images/tab_prev.png"/></button>' +
            '   <ul id="installer_step4_package_tab_list">' +
            '   </ul>' +
            '   <button id="installer_step4_package_tab_right_button" class="btn_right btnTabArrow"><img src="static/images/tab_next.png"/></button>' +
            '</div>');
        this.$contArea.append(this.$packageTabArea);
    };

    UpgradeStep4Container.prototype.createButtonArea = function () {
        this.$tabArea = $('' +
            '<div class="fix_area" style="z-index:1;">' +
            '   <div class="btn_wrap">' +
            '       <div class="fl_r">' +
            '           <button id="prev" class="btnBigGray"><span>Previous</span></button>' +
            '           <button id="save_button" class="btnBigGray"><span>Save</span></button>' +
            '           <button id="install_button" class="btnBigBlue"><span>Upgrade</span></button>' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$contArea.append(this.$tabArea);
    };

    UpgradeStep4Container.prototype.renderContent = function () {
        try {
            this.renderContents();

            this.bindPreviousButtonEvent();
            this.bindSaveButtonEvent();
            this.bindInstallButtonEvent();
        }
        catch (e) {
            console.error(e);
        }
    };

    UpgradeStep4Container.prototype.renderContents = function () {
        var _this = this;

        var data = Brightics.Installer.Studio.upgradeInfo.installstep4;
        var tabArray = [];
        for (var packageKey in data.packages) {
            tabArray.push(data.packages[packageKey].packageName);
        }
        _this.tabData = {
            tabArray: tabArray,
            tabIndex: 0,
            selectedPackage: null
        };
        _this.renderPackageTab();

        _this.createServiceConfigurations(data, data);

        $('#installer_step4_package_tab_list').find('li:first a').click();

        var leftButton = $('#installer_step4_package_tab_left_button');
        leftButton.on('click', function () {
            if (_this.tabData.tabIndex > 0) {
                _this.tabData.tabIndex--;
                _this.renderPackageTab();

                if (_this.tabData.selectedPackage != null) {
                    var tabList = $('#installer_step4_package_tab_list').find('li');
                    $.each(tabList, function (index, tab) {
                        if ($(tab).text() === _this.tabData.selectedPackage) {
                            $(tab).removeClass('on');
                            $(tab).addClass('on');
                        }
                        else {
                            $(tab).removeClass('on');
                        }
                    });
                }
            }
        });

        var rightButton = $('#installer_step4_package_tab_right_button');
        rightButton.on('click', function () {
            if (_this.tabData.tabIndex + 8 < _this.tabData.tabArray.length) {
                _this.tabData.tabIndex++;
                _this.renderPackageTab();

                if (_this.tabData.selectedPackage != null) {
                    var tabList = $('#installer_step4_package_tab_list').find('li');
                    $.each(tabList, function (index, tab) {
                        if ($(tab).text() === _this.tabData.selectedPackage) {
                            $(tab).removeClass('on');
                            $(tab).addClass('on');
                        }
                        else {
                            $(tab).removeClass('on');
                        }
                    });
                }
            }
        });
    };

    UpgradeStep4Container.prototype.renderPackageTab = function () {
        var _this = this;

        var $tabContainer = $('#installer_step4_package_tab_list');
        $tabContainer.empty();

        var tabData = this.tabData;
        var tabArray = $.extend(true, [], tabData.tabArray);

        for (var i = tabData.tabIndex; i < tabData.tabIndex + 8; i++) {
            if (i >= tabArray.length) {
                break;
            }
            var $packageTab = $('<li class="tab_01"><a href="javascript:;">' + tabArray[i] + '</a><p></p></li>');

            $tabContainer.append($packageTab);
            $packageTab.find('a').on('click', function () {
                if (_this.tabData.selectedPackage != null) {
                    _this.saveCurrentConfiguration(_this.tabData.selectedPackage);
                }

                var tabList = $('#installer_step4_package_tab_list').find('li');
                var thisTab = $(this).parent('li');

                $.each(tabList, function (index, tab) {
                    $(tab).removeClass('on');
                });
                thisTab.addClass('on');

                var selectedPackage = thisTab.text();
                _this.tabData.selectedPackage = selectedPackage;
                _this.renderCurrentConfiguration(selectedPackage);
            });
        }
    };

    UpgradeStep4Container.prototype.createServiceConfigurations = function (data, originalData) {
        this.serviceConfigurations = {};
        var packages = data.packages;
        var originalPackages = originalData.packages;
        for (var key in packages) {
            var packageName = packages[key].packageName;
            this.serviceConfigurations[packageName] = new ServiceConfigurations(this.$contArea, packages[key], originalPackages[key]);
        }
    };

    UpgradeStep4Container.prototype.saveCurrentConfiguration = function (selectedPackage) {
        this.serviceConfigurations[selectedPackage].save();
    };

    UpgradeStep4Container.prototype.renderCurrentConfiguration = function (selectedPackage) {
        this.serviceConfigurations[selectedPackage].render();
    };

    UpgradeStep4Container.prototype.bindPreviousButtonEvent = function () {
        var _this = this;
        $('.fix_area > .btn_wrap > .fl_r > #prev').on('click', function () {
            _this.controller.startStep3();
        });
    };

    UpgradeStep4Container.prototype.validateCongifs = function () {
        var configs = $('div #configs_main').find('textarea');

        for (var i=0; i< configs.length; i++) {
            if (!$(configs[i]).val()) {
                this.$errorFocusTarget = $(configs[i]);
                return false;
            }
        }
        return true;
    };

    UpgradeStep4Container.prototype.bindSaveButtonEvent = function () {
        var _this = this;
        $('.fix_area > .btn_wrap > .fl_r > #save_button').on('click', function () {
            if (_this.validateCongifs()) {
                var sendData = {
                    packages: []
                }

                _this.serviceConfigurations[_this.tabData.selectedPackage].save();

                for (var key in _this.serviceConfigurations) {
                    sendData.packages.push(_this.serviceConfigurations[key].getConfigurationsList());
                }

                console.log(sendData);

                _this.studio.showPopup({
                    title: 'Upgrade',
                    mode: 'confirm',
                    message: ['Are you sure want to save configurations?'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {
                        _this.studio.showProgress('Saving configurations...');

                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            url: '/api/v1/wizard/installstep4',
                            data: JSON.stringify(sendData),
                            success: function (response) {
                                _this.studio.hideProgress();

                                var responseObject = response;
                                var status = responseObject.response.status;

                                if (status.toLowerCase() == 'success') {
                                    _this.studio.showPopup({
                                        title: 'Success',
                                        mode: 'alert',
                                        message: ["Save configuration complete."],
                                        hasCheckBox: false,
                                        checkBoxMessage: '',
                                        callback: function (isChecked) {
                                        }
                                    });
                                } else {
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
                    }
                });
            } else {
                _this.studio.showPopup({
                    title: 'Error',
                    mode: 'alert',
                    message: ['configs are not entered.'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {

                    }
                });
                _this.$errorFocusTarget.focus();
            }
        });
    }

    UpgradeStep4Container.prototype.bindInstallButtonEvent = function () {
        var _this = this;

        $('.fix_area > .btn_wrap > .fl_r').find('#install_button').on('click', function () {
            if (_this.validateCongifs()) {
                _this.studio.setInstallType('install');

                var sendData = {};

                _this.studio.showPopup({
                    title: 'Upgrade',
                    mode: 'confirm',
                    message: ['Are you sure want to proceed with the upgrade?'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {
                        _this.studio.showProgress('Starting Upgrade...');

                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            url: '/api/v1/upgrade/upgradestart',
                            data: JSON.stringify(sendData),
                            success: function (response) {
                                _this.studio.hideProgress();

                                var status = response.response.status;

                                if (status.toLowerCase() == 'success') {
                                    var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
                                    studio.renderUpgradeProgress();
                                } else {
                                    _this.studio.showPopup({
                                        title: 'Error',
                                        mode: 'alert',
                                        message: [response.response.message],
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
                    }
                });
            } else {
                _this.studio.showPopup({
                    title: 'Error',
                    mode: 'alert',
                    message: ['configs are not entered.'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {

                    }
                });
                _this.$errorFocusTarget.focus();
            }
        });
    };

    // Constructor
    function ServiceConfigurations($parent, configurationsList, originalConfigurationsList) {
        this.$parent = $parent;
        this.configurationsList = configurationsList;
        this.originalConfigurationsList = originalConfigurationsList;

        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ServiceConfigurations.prototype.setSelectedPackage = function (packageName) {
        this.selectedPackage = packageName;
    };

    ServiceConfigurations.prototype.getConfigurationsList = function () {
        return this.configurationsList;
    };

    ServiceConfigurations.prototype.save = function () {
        var _this = this;
        $('#configurations_panel_properties_tbody tr').each(function (index) {
            for (var i in _this.configurationsList.properties) {
                if (_this.configurationsList.properties[i].key === $(this).find('.installer_step4_properties_name').text()) {
                    _this.configurationsList.properties[i].value = $(this).find('.installer_step4_properties_value_input').val();
                    break;
                }
            }
        });

        $('#configurations_panel_logs_tbody tr').each(function (index) {
            for (var i in _this.configurationsList.logs) {
                if (_this.configurationsList.logs[i].key === $(this).find('.installer_step4_logs_name').text()) {
                    _this.configurationsList.logs[i].type = ($(this).find('.jqx_dropbox_line').val() === 'file') ? ('log_file') : ('log_dir');
                    _this.configurationsList.logs[i].value = $(this).find('.installer_step4_logs_value_input').val();
                    break;
                }
            }
        });

        $('.configurations_panel_configs').each(function (index) {
            for (var i in _this.configurationsList.configs) {
                if (_this.configurationsList.configs[i].fileName === $(this).find('.installer_step4_box_head').text()) {
                    _this.configurationsList.configs[i].contents = $(this).find('.installer_step4_configs_value_textarea').val();
                    break;
                }
            }
        });
    };

    ServiceConfigurations.prototype.render = function () {
        this.$parent.find('.configurations_panel').remove();

        this.renderProperties();
        this.renderLog();
        this.renderConfig();
    };

    ServiceConfigurations.prototype.renderProperties = function () {
        this.propertyList = this.configurationsList.properties;

        if (this.propertyList && this.propertyList.length > 0) {
            this.$propertiesBox = this.createBox('properties', 'Properties');
            this.$parent.append(this.$propertiesBox);
        }
    };

    ServiceConfigurations.prototype.renderLog = function () {
        this.logList = this.configurationsList.logs;

        if (this.logList && this.logList.length > 0) {
            this.$logsBox = this.createBox('logs', 'Component Logs');
            this.$parent.append(this.$logsBox);
        }
    };

    ServiceConfigurations.prototype.renderConfig = function () {
        this.configsList = this.configurationsList.configs;

        for (var i in this.configsList) {

            this.$configsBox = this.createBox('configs', this.configsList[i].fileName, i);

            this.$parent.append(this.$configsBox);
        }
    };

    ServiceConfigurations.prototype.createBox = function (id, label, index) {
        var $box = $('<div id="' + id + '_main" class="configurations_panel configurations_panel_' + id + ' row-fluid"></div>');

        if (id === 'configs') {
            if (this.configsList.length - 1 === parseInt(index)) {
                $box.addClass('rowlast');
            }
        }

        $box.append(this.createBoxHeader(label, id, index));

        $box.append($('<div class="row_fiuld_des"></div>'));

        if (id === 'properties') {
            $box.append(this.createPropertiesBoxBody());
        } else if (id === 'logs') {
            $box.append(this.createLogsBoxBody());
        } else if (id === 'configs') {
            $box.append(this.createConfigsBoxBody(this.configsList[index]));
        }

        return $box;
    };

    ServiceConfigurations.prototype.createBoxHeader = function (label, id, index) {
        var _this = this;

        var $header = $('' +
            '<div class="h3_title clearfix">' +
            '    <span class="installer_step4_box_head" configid="' + id + '">' + label + '</span>' +
            '</div>');
        if (id === 'configs') {
            $header.append('<button class="installer_step4_expand_button btn expandable" style="margin-bottom:6px;"><img src="static/images/expandable-up.png" /></button>');
            $header.find('.installer_step4_expand_button img').css('transform', 'rotate(180deg)');
            $header.find('.installer_step4_expand_button').click(function () {
                if ($(this).parents('.configurations_panel').find('.expandable-area').css('display') === 'none') {
                    $(this).parents('.configurations_panel').find('.expandable-area').css('display', 'block');
                    $(this).parents('.configurations_panel').find('.installer_step4_expand_button img').css('transform', '');
                }
                else {
                    $(this).parents('.configurations_panel').find('.expandable-area').css('display', 'none');
                    $(this).parents('.configurations_panel').find('.installer_step4_expand_button img').css('transform', 'rotate(180deg)');
                }
            });
        }
        var $resetButton = $('' +
            '<div class="fl_r">' +
            '    <button id="configuration_header-reset" class="btnGray" configid="' + id + '"><span>Reset</span></button>' +
            '</div>');

        $resetButton.click(function () {
            if (id === 'properties') {
                for (var i in _this.configurationsList.properties) {
                    $(this).parents('.configurations_panel').find('#' + _this.configurationsList.properties[i].key.replace(/\./gi, '').replace(/ /gi, '') + '_input').val(_this.originalConfigurationsList.properties[i].value);
                }
            }

            if (id === 'logs') {
                for (var i in _this.configurationsList.logs) {
                    var selectItem = 'file';
                    var logType = (_this.originalConfigurationsList.logs[i].type).toLowerCase();
                    if (logType.indexOf('dir') > -1) {
                        selectItem = 'directory'
                    }
                    //var selectItem = (_this.originalConfigurationsList.logs[i].type === 'log_file') ? ('file') : ('directory');
                    $(this).parents('.configurations_panel').find('.jqx_dropbox_line:eq(' + i + ')').jqxDropDownList('selectItem', selectItem);

                    $(this).parents('.configurations_panel').find('#' + _this.configurationsList.logs[i].key.replace(/\./gi, '').replace(/ /gi, '') + '_input').val(_this.originalConfigurationsList.logs[i].value);
                }
            }

            if (id === 'configs') {
                $(this).parents('.configurations_panel').find('.installer_step4_configs_value_textarea').val(_this.originalConfigurationsList.configs[index].contents);
            }
        });

        $header.append($resetButton);

        return $header;
    };

    ServiceConfigurations.prototype.createPropertiesBoxBody = function () {
        var _this = this;
        var $body = $('<div></div>');
        var $table = $('<table class="board-view01"></table>');
        $table.append(
            $('' +
                '<colgroup>' +
                '   <col class="w15" />' +
                '   <col />' +
                '   <col class="w6" />' +
                '</colgroup>' +
                '<tbody id="configurations_panel_properties_tbody">' +
                '</tbody>')
        );

        var $tbody = $table.find('tbody');

        for (var i in this.propertyList) {
            var propertyName = this.propertyList[i].key;
            var propertyValue = this.propertyList[i].value;

            var $component = $('' +
                '<tr id="' + propertyName + '">' +
                '   <th style="word-wrap:break-word"><span class="installer_step4_properties_name">' + propertyName + '</span>' +
                '   </th>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <input type="text" id="' + propertyName.replace(/\./gi, '').replace(/ /gi, '') + '_input" name="" class="installer_step4_properties_value_input normal" title="" value="' + propertyValue + '">' +
                '       </div>' +
                '       <div class="line_body clearfix">' +
                '           <label class="help-block" for="' + propertyName.replace(/\./gi, '').replace(/ /gi, '') + '_input">'+propertyName+' is not entered</label>' +
                '       </div>' +
                '   </td>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <button class="btnWhite"><span>Reset</span></button>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            $component.find('.btnWhite').click(function () {
                var current = $(this).parents('tr').prevAll().length;
                $(this).parents('tr').find('input').val(_this.originalConfigurationsList.properties[current].value);
            });

            $tbody.append($component);
        }

        $body.append($table);
        return $body;
    };

    ServiceConfigurations.prototype.createLogsBoxBody = function () {
        var _this = this;
        var $body = $('<div></div>');
        var $table = $('<table class="board-view01"></table>');
        $table.append(
            $('' +
                '<colgroup>' +
                '   <col class="w11" />' +
                '   <col class="w9" />' +
                '   <col />' +
                '   <col class="w6" />' +
                '</colgroup>' +
                '<tbody id="configurations_panel_logs_tbody">' +
                '</tbody>')
        );

        var $tbody = $table.find('tbody');

        for (var i in this.logList) {
            var logName = this.logList[i].key;
            var logValue = this.logList[i].value;

            var trLength = $tbody.find('tr').length;
            var $component = $('' +
                '<tr>' +
                '   <th><span class="installer_step4_logs_name">' + logName + '</span>' +
                '   </th>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <div id="jqxLogs' + trLength + '" class="jqx_dropbox_line"></div>' +
                '       </div>' +
                '   </td>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '          <input type="text" id="' + logName.replace(/\./gi, '').replace(/ /gi, '') + '_input" name="" class="installer_step4_logs_value_input normal" title="" value="' + logValue + '">' +
                '       </div>' +
                '       <div class="line_body clearfix">' +
                '           <label class="help-block" for="' + logName.replace(/\./gi, '').replace(/ /gi, '') + '_input">errorclass-has-error</label>' +
                '       </div>' +
                '   </td>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <button class="btnWhite"><span>Reset</span></button>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            $component.find('.btnWhite').click(function () {
                var current = $(this).parents('tr').prevAll().length;
                var selectItem = 'file';
                var logType = (_this.originalConfigurationsList.logs[current].type).toLowerCase();
                if (logType.indexOf('dir') > -1) {
                    selectItem = 'directory'
                }

                //var selectItem = (_this.originalConfigurationsList.logs[current].type === 'log_file') ? ('file') : ('directory');
                $(this).parents('tr').find('.jqx_dropbox_line').jqxDropDownList('selectItem', selectItem);

                $(this).parents('tr').find('input').val(_this.originalConfigurationsList.logs[current].value);
            });

            $component.find('#jqxLogs' + trLength).jqxDropDownList({
                source: ['directory', 'file'],
                animationType: 'fade',
                selectedIndex: 0,
                theme: 'office',
                width: '110px',
                dropDownHeight: 130,
                height: '25px',
                disabled: true
            });

            var selectItem = 'file';

            var logType = (this.logList[i].type).toLowerCase();
            if (logType.indexOf('dir') > -1) {
                selectItem = 'dir';
            }
            $component.find('#jqxLogs' + trLength).jqxDropDownList('selectItem', selectItem);
            $tbody.append($component);
        }

        $body.append($table);
        return $body;
    };

    ServiceConfigurations.prototype.createConfigsBoxBody = function (configData) {
        var _this = this;

        var $body = $('<div class="expandable-area"></div>');
        var $table = $('<table class="board-view01"></table>');
        $table.append(
            $('' +
                '<colgroup>' +
                '   <col class="w11" />' +
                '   <col />' +
                //'   <col class="w6" />' +
                '</colgroup>' +
                '<tbody>' +
                '</tbody>')
        );

        var $tbody = $table.find('tbody');

        var $component = $('' +
            '<tr class="last">' +
            '   <th><span>contents </span>' +
            '   </th>' +
            '   <td>' +
            '       <textarea id="'+configData.configId+'_input" class="installer_step4_configs_value_textarea" file-name='+configData.fileName+' rows=4 autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">'+configData.contents+'</textarea>' +
            '       <div class="line_body clearfix">' +
            '           <label id="'+configData.configId+'_error" class="help-block" for="">'+configData.fileName+' is not entered</label>' +
            '       </div>' +
            '   </td>' +
            '</tr>');

        var lineCount = (configData.contents).split('\n').length,
            minHeight = 100,
            maxHeight = 500;

        var currentHeight = lineCount * 15;

        var textAreaWidth = $('.cont_area').width() - 139 -10; // 139는 th의 크기(고정). 10은 padding

        $component.find('textarea').height(( currentHeight > maxHeight ) ? maxHeight : ((currentHeight < minHeight) ? minHeight : currentHeight)).width(textAreaWidth);

        $component.find('textarea').on('change', function(event, data){
            var configId = $(this).attr('id').replace('_input', '');

            if ($(this).val()) {
                $(this).removeClass('has-error');
                $('#'+configId+'_error').removeClass('has-error').css({'display':'none'});

                for (var i in _this.configurationsList.configs) {
                    if (_this.configurationsList.configs[i].configId == configId) {
                        _this.configurationsList.configs[i].contents = $(this).val();
                    }
                }
            } else {
                $(this).addClass('has-error');
                $('#'+configId+'_error').addClass('has-error').css({'display':'block'});
                //$(this).siblings().find('.help-block').addClass('has-error').css({'display':'block'});
            }

            var fileName = $(this).attr('file-name');

            for (var i in _this.originalConfigurationsList.configs) {
                if (_this.originalConfigurationsList.configs[i].fileName == fileName && $(this).val() != _this.originalConfigurationsList.configs[i].contents) {
                    _this.configurationsList.configs[i].configId = 0;
                }
            }
        });

        $tbody.append($component);
        $body.append($table);
        $body.css('display', 'none');
        return $body;
    };

    root.Brightics.Installer.ContentContainer.UpgradeStep4Container = UpgradeStep4Container;

}).call(this);