/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeStep2Container($parent) {
        this.$parent = $parent;
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UpgradeStep2Container.prototype.setController = function (controller) {
        this.controller = controller;
    };

    UpgradeStep2Container.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderContent();
    };

    UpgradeStep2Container.prototype.createLayout = function () {
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

    UpgradeStep2Container.prototype.createHeadArea = function () {
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

    UpgradeStep2Container.prototype.createContArea = function () {
        this.$contArea = $('<div class="cont_area clearfix"></div>');
        this.createTabArea();
        this.createServiceListArea();
        this.$parent.append(this.$contArea);

        $('#installer_step1_ssh_private_key_textarea').on('keyup', function () {
            this.style.height = "70px";
            this.style.height = (20 + this.scrollHeight) + "px";
        });
    };

    UpgradeStep2Container.prototype.createTabArea = function () {
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
            '           <a href="#" class="on">' +
            '               <span class="tab_num">02</span>' +
            '               <span class="tab_type01_text_on"> Check the Services list</span>' +
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

    UpgradeStep2Container.prototype.createServiceListArea = function () {
        var _this = this;

        this.$serviceListArea = $('' +
            '<div class="row-fluid rowlast">' +
            '   <div class="h3_title clearfix">' +
            '       <span>Service List</span>' +
            '   </div>' +
            '   <div class="row_fiuld_des"></div>' +
            '   <div>' +
            '       <div class="bd_list summary">' +
            '           <ul>' +
            '               <li id="installer_step2_service_name_selected_number" class="page"><strong>Select</strong> <em class="cf76556">0</em></li>' +
            '               <li id="installer_step2_service_name_total_number" class="total last"><strong>Total</strong> <em class="cf76556">0</em></li>' +
            '           </ul>' +
            '       </div>' +
            '       <div class="board">' +
            '           <table class="board-list">' +
            '               <colgroup>' +
            '                   <col class="w60"/>' +
            '                   <col class="w21"/>' +
            '                   <col class="w14"/>' +
            '                   <col class="w14"/>' +
            '                   <col/>' +
            //'                   <col class="w21"/>' +
            '               </colgroup>' +
            '               <thead>' +
            '               <tr>' +
            '                   <th class="center" style="border-right: 1px solid #d9d9d9">' +
            '                       <div class="chk">' +
            '                           <input class="check" type="checkbox" value="all" name="" id="installer_step2_service_name_checkbox_all">' +
            '                           <label for="installer_step2_service_name_checkbox_all"></label>' +
            '                       </div>' +
            '                   </th>' +
            '                   <th class="center tdlt">Service Name</th>' +
            '                   <th class="center tdlt">Version</th>' +
            '                   <th class="center tdlt">Mode</th>' +
            '                   <th class="center">Description</th>' +
            //'                   <th class="center">Note</th>' +
            '               </tr>' +
            '               </thead>' +
            '               <tbody id="installer_step2_service_name_list">' +
            '               </tbody>' +
            '           </table>' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$contArea.append(this.$serviceListArea);

        var $header = $(this.$contArea.find('.h3_title'));
        var $externalPackageButton = $('' +
            '<div class="fl_r" style="margin-bottom: 10px">' +
            '    <button class="btnWhite"><span>Interface External Package</span></button>' +
            '</div>');
        $header.append($externalPackageButton);

        $externalPackageButton.click(function(){
            var data = Brightics.Installer.Studio.upgradeInfo.installstep2.externals;
            _this.externalPackageList = data;
            _this.createExternalPackageDialog(data);
        });
    };

    UpgradeStep2Container.prototype.createExternalPackageDialog = function (packageList) {
        var _this = this;

        var findExternalPackageIndex = function(packageName){
            var _that = _this;
            var rt = 0;

            for (var i in this.externalPackageList) {
                if (packageName === _that.externalPackageList[i].externalPackageName) {
                    return i;
                }
            }
            return rt;
        };

        var $externalPackageDialog = $('' +
            '<div class="external-package-dialog" style="overflow-y: hidden; height: 700px; width: 800px; max-height: 700px; width: 800px;">'+
            '   <div class="external-package-dialog-header" style="height: 24px; width: 100%">Interface External Package</div>'+
            '   <div class="external-package-dialog-body" style="height: calc(100% - 24px); width: 100%; position: relative; top:0; overflow: hidden">'+
            '      <div class="external-package-dialog-body-content" style="float:right; overflow-y: auto; height: calc(100% - 65px); width: 100%; position: relative; top:0"></div>'+
            '      <div class="external-package-dialog-body-button" style="float:right; width: 100%; height: 25px; position: relative; margin-top:20px; margin-bottom:20px;">'+
            '      </div>'+
            '   </div>'+
            '</div>' +
            '');

        $externalPackageDialog.jqxWindow({
            height: 740,
            width: 800,
            maxHeight: 740,
            maxWidth: 800,
            isModal: true,
            resizable: false,
            theme: 'office',
            initContent: function () {
                for (var i in packageList) {
                    var packageData = packageList[i];

                    var $package = $('' +
                        '<div class="external-package-dialog-body-content-package" style="top: 0px; width:100%; position: relative;" package-name="'+packageData.externalPackageName+'" package-id="'+packageData.externalPackageId+'">' +
                        '   <div class="chk" style="position: relative; margin-bottom: 10px; padding-left: 20px; float:left; width: 90%; font-weight: bold; font-size:16px;">' +
                        '       <input class="external-package-dialog-body-content-package-checkbox check chkclick" type="checkbox" package-index="'+i+'" id="' + packageData.externalPackageName + '">' +
                        '        <label for="' + packageData.externalPackageName + '">' + packageData.externalPackageName + '</label>' +
                        '   </div>' +

                        '   <div class="external-package-dialog-body-content-package-distribution" style="position: relative; position: relative; width:90%; height: 25px; float:left; margin-bottom: 10px; margin-left:20px;">' +
                        '       <div class="external-package-dialog-body-content-package-distribution-label" style="position: relative; width:100px; height: 25px; float: left; padding-top: 5px">distribution</div>' +
                        '       <div class="external-package-dialog-body-content-package-distribution-combobox" package-name="'+packageData.externalPackageName+'"></div>' +
                        '   </div>' +
                        '</div>' +
                        '');
                    //높이 강제로 계산 = (패키지 개수 + 1) * 패키지 각각 높이
                    $package.height( (packageData.propertyList.length+1) * 110 );

                    var distributionList = [];
                    var distributionSelectedIndex = '';

                    for (var i in packageData.distributionList){
                        distributionList.push(packageData.distributionList[i].distribution);
                        if (packageData.distributionList[i].selected == true) distributionSelectedIndex = i;
                    }

                    $($package.find('.external-package-dialog-body-content-package-distribution-combobox')).jqxComboBox({
                        source: distributionList,
                        theme: 'office',
                        width: '150px',
                        autoDropDownHeight:true,
                        selectedIndex: distributionSelectedIndex,
                        animationType:'none'
                    });

                    $package.find('.external-package-dialog-body-content-package-distribution-combobox .jqx-combobox-input').attr('readonly', true);
                    $package.find('.external-package-dialog-body-content-package-distribution-combobox .jqx-combobox-input').css('padding-left', '5px');

                    $($package.find('.external-package-dialog-body-content-package-distribution-combobox')).on('select', function(event){
                        var selectedPackageName = $(this).attr('package-name');

                        var args = event.args;
                        if (args) {
                            // index represents the item's index.
                            var item = args.item;
                            // get item's label and value.
                            var label = item.label;

                            for (var i in _this.externalPackageList){
                                if (_this.externalPackageList[i].externalPackageName === selectedPackageName) {
                                    var targetDistributionList = _this.externalPackageList[i].distributionList;

                                    for (var j in targetDistributionList) {
                                        if (targetDistributionList[j].distribution === label) {
                                            targetDistributionList[j].selected = true;
                                        } else {
                                            targetDistributionList[j].selected = false;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    if (packageData.enabled === true) {
                        $package.find('.external-package-dialog-body-content-package-checkbox').click();
                    }

                    $($package.find('.external-package-dialog-body-content-package-checkbox')).on('click', function(){
                        var packageIndex = $(this).attr('package-index');

                        if ($(this).is(':checked')) {
                            _this.externalPackageList[packageIndex].enabled = true;
                        } else {
                            _this.externalPackageList[packageIndex].enabled = false;
                        }
                    });

                    for (var j in packageData.propertyList) {
                        var textareaHeight = 100;

                        var propertyData = packageData.propertyList[j];

                        var $property = $('' +
                            '<div style="position: relative; top:0; width:calc(100% - 20px); height: 100px; float:left; margin-bottom: 10px; margin-left:20px;" class="external-package-dialog-body-content-package-property" property-name="'+propertyData.key+'">' +
                            '   <div class="external-package-dialog-body-content-package-property-label" style="position: relative; width: 100%; height: 25px; float: left; padding-top: 5px">'+propertyData.key+'</div>' +
                            '   <div class="external-package-dialog-body-content-package-property-input-textarea" style="width:100%; height: 60px; float:left;">' +
                            '       <textarea id="'+propertyData.key+'" style="width:calc(100% - 20px); height: 60px;">'+propertyData.value+'</textarea>' +
                            '   </div>' +
                            '   </div>' +
                            '</div>' +
                            '');

                        $property.find('textarea').attr('title', propertyData.value);
                        $property.find('textarea').attr('package-name', packageData.externalPackageName);
                        $property.find('textarea').attr('property-index', j);

                        $property.find('div').attr('title', propertyData.key);
                        $property.find('div').attr('package-name', packageData.externalPackageName);
                        $property.find('div').attr('property-index', j);

                        $property.find('external-package-dialog-body-content-package-property-input-textarea').hide();

                        $property.find('input').on('change', function(){
                            var propertyIndex = $(this).attr('property-index');
                            var packageName = $(this).attr('package-name');

                            var packageIndex = 0;
                            for (var i in _this.externalPackageList) {
                                if (packageName === _this.externalPackageList[i].externalPackageName) {
                                    packageIndex = i;
                                }
                            }
                            _this.externalPackageList[packageIndex].propertyList[propertyIndex].value = $(this).val();

                        });
                        $property.find('textarea').on('change', function(){
                            var propertyIndex = $(this).attr('property-index');
                            var packageName = $(this).attr('package-name');

                            var packageIndex = 0;
                            for (var i in _this.externalPackageList) {
                                if (packageName === _this.externalPackageList[i].externalPackageName) {
                                    packageIndex = i;
                                }
                            }
                            _this.externalPackageList[packageIndex].propertyList[propertyIndex].value = $(this).val();

                        });

                        $package.append($property);
                    }
                    $externalPackageDialog.find('.external-package-dialog-body-content').append($package);
                }

                var $saveButton = $('<button class="external-package-dialog-body-save btnWhite" style="margin-right:20px; float: right; height: 25px; width:100px; position: relative; top:0;">Save</button>');
                $saveButton.click(function(){
                    console.log(_this.externalPackageList);
                    $.ajax({
                        type: 'PUT',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(_this.externalPackageList),
                        url: '/api/v1/externals',
                        success: function (response) {
                            _this.studio.showPopup({
                                title: 'Interface External Package',
                                mode: 'alert',
                                message: ['Success'],
                                hasCheckBox: false,
                                checkBoxMessage: '',
                                callback: function (isChecked) {

                                }
                            });
                            $('.external-package-dialog').jqxWindow('destroy');
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.error(xhr);
                        }
                    });
                });

                $externalPackageDialog.find('.external-package-dialog-body-button').append($saveButton);
            }
        });

        $externalPackageDialog.on('close', function(){
            $(this).jqxWindow('destroy');
        });
    };

    UpgradeStep2Container.prototype.createButtonArea = function () {
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

    UpgradeStep2Container.prototype.renderContent = function () {
        try {
            var $content = $('#content');
            var serviceNameListManager = new ServiceNameListManager($content, {controller: this.controller});
            serviceNameListManager.renderContents();

            serviceNameListManager.bindPreviousButtonEvent();
            serviceNameListManager.bindNextButtonEvent();
        }
        catch (e) {
            console.error(e);
        }
    };

    //Constructor
    function ServiceNameListManager($parent, options) {
        this.$parent = $parent;
        this.controller = options.controller;

        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ServiceNameListManager.prototype.renderContents = function () {
        var _this = this;
        var data = Brightics.Installer.Studio.upgradeInfo.installstep2;
        _this.renderServiceNameList(data);

        $('#installer_step2_service_name_checkbox_all').on('click', function () {
            var $serviceNameList = $('#installer_step2_service_name_list > tr');
            if ($('#installer_step2_service_name_checkbox_all').is(':checked')) {
                $serviceNameList.each(function (index) {
                    if (!$(this).find('.installer_step2_service_name_checkbox').is(':checked')) {
                        $(this).find('.installer_step2_service_name_checkbox').click();
                    }
                });
            }
            else {
                $serviceNameList.each(function (index) {
                    if ($(this).find('.installer_step2_service_name_checkbox').is(':checked')) {
                        $(this).find('.installer_step2_service_name_checkbox').click();
                    }
                });
            }
        });
    };

    ServiceNameListManager.prototype.renderServiceNameList = function (data) {
        var copyData = $.extend(true, {}, data);

        $('#installer_step2_service_name_total_number').find('em').text(Object.keys(copyData.packages).length);
        var i = 0;
        for (var key in copyData.packages) {
            var newServiceName = this.appendNewServiceName();

            if (copyData.packages[key].required || copyData.packages[key].isBase) {
                copyData.packages[key].isSelected = true;
                newServiceName.find('.installer_step2_service_name_checkbox').prop('checked',true);
                var selectedNumber = Number($('#installer_step2_service_name_selected_number').find('em').text())
                $('#installer_step2_service_name_selected_number').find('em').text(selectedNumber + 1);
                newServiceName.find('.installer_step2_service_name_checkbox').click(function () {
                    return false;
                });
            }
            else {
                newServiceName.find('.installer_step2_service_name_checkbox').click(function () {
                    var $serviceNameList = $('#installer_step2_service_name_list > tr');
                    var selected_number = 0;
                    $serviceNameList.each(function (index) {
                        if ($(this).find('.installer_step2_service_name_checkbox').is(':checked')) {
                            selected_number++;
                        }
                    });
                    $('#installer_step2_service_name_selected_number').find('em').text(selected_number);

                    if (selected_number != Number($('#installer_step2_service_name_total_number').find('em').text())) {
                        $('#installer_step2_service_name_checkbox_all').prop('checked',false)
                    } else {
                        $('#installer_step2_service_name_checkbox_all').prop('checked',true)
                    }
                });
            }

            if (copyData.packages[key].isSelected) {
                newServiceName.find('.installer_step2_service_name_checkbox').click();
            }
            newServiceName.find('.installer_step2_service_name').text(copyData.packages[key].packageName);

            if (Object.keys(copyData.packages[key].version).length > 1) {
                newServiceName.find('#installer_step2_service_version_' + i).jqxDropDownList({
                    source: Object.keys(copyData.packages[key].version),
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '85px',
                    height: '25px',
                    dropDownHeight: 130
                });

                for (var versionKey in copyData.packages[key].version) {
                    if (copyData.packages[key].version[versionKey] == true) {
                        newServiceName.find('#installer_step2_service_version_' + i).val(versionKey);
                        break;
                    }
                }
            }
            else {
                newServiceName.find('#installer_step2_service_version_' + i).jqxDropDownList({
                    source: Object.keys(copyData.packages[key].version),
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '85px',
                    height: '25px',
                    dropDownHeight: 130,
                    disabled: true
                });
                newServiceName.find('#installer_step2_service_version_' + i).css({
                    'opacity':'1.0',
                    'border': 'none'
                });
                newServiceName.find('#dropdownlistArrowinstaller_step2_service_version_' + i).remove();
            }

            if (Object.keys(copyData.packages[key].clusterModeMap).length > 1) {
                newServiceName.find('#installer_step2_service_mode_' + i).jqxDropDownList({
                    source: Object.keys(copyData.packages[key].clusterModeMap),
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '100px',
                    dropDownHeight: 130,
                    height: '25px'
                });

                for (var clusterModeKey in copyData.packages[key].clusterModeMap) {
                    if (copyData.packages[key].clusterModeMap[clusterModeKey] == true) {
                        newServiceName.find('#installer_step2_service_mode_' + i).val(clusterModeKey);
                        break;
                    }
                }
            } else {
                newServiceName.find('#installer_step2_service_mode_' + i).jqxDropDownList({
                    source: Object.keys(copyData.packages[key].clusterModeMap),
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '100px',
                    dropDownHeight: 130,
                    height: '25px',
                    disabled: true
                });

                newServiceName.find('#installer_step2_service_mode_' + i).css({
                    'opacity':'1.0',
                    'border': 'none'
                });
                newServiceName.find('#dropdownlistArrowinstaller_step2_service_mode_' + i).remove();
            }
            newServiceName.find('.installer_step2_service_description').text(copyData.packages[key].packageDesc);
            i++;
        }
    };

    ServiceNameListManager.prototype.appendNewServiceName = function () {
        var $serviceNameList = $('#installer_step2_service_name_list');
        var trLength = $('#installer_step2_service_name_list > tr').length;

        var $newServiceName = $('' +
            '<tr>' +
            '   <td class="chk-area" style="border-right: 1px solid #f0f0f0">' +
            '       <div class="chk">' +
            '           <input class="installer_step2_service_name_checkbox check chkclick" type="checkbox" value="" name="" id="installer_step2_service_name_checkbox_' + trLength + '">' +
            '           <label for="installer_step2_service_name_checkbox_' + trLength + '"></label>' +
            '       </div>' +
            '   </td>' +
            '   <td class="left tdlt">' +
            '       <div class="line_body clearfix"><span id="installer_step2_service_name_' + trLength + '" class="installer_step2_service_name"></span></div>' +
            '   </td>' +
            '   <td class="tdlt">' +
            '       <div class="line_body clearfix">' +
            '           <div id="installer_step2_service_version_' + trLength + '" class="installer_step2_service_version"></div>' +
            '       </div>' +
            '   </td>' +
            '   <td class="left" style="border-right: 1px solid #f0f0f0">' +
            '       <div class="line_body clearfix">' +
            '           <div id="installer_step2_service_mode_' + trLength + '" class="installer_step2_service_mode"></div>' +
            '       </div>' +
            '   </td>' +
            '   <td class="left tdlt">' +
            '       <div class="line_body clearfix"><span id="installer_step2_service_description_' + trLength + '" class="installer_step2_service_description"></span></div>' +
            '   </td>' +
            //'   <td class="installer_step2_service_note left"></td>' +
            '</tr>'
        );
        $serviceNameList.append($newServiceName);

        $newServiceName.find('.installer_step2_service_version').css({'margin-left':'auto', 'margin-right':'auto'});
        $newServiceName.find('.installer_step2_service_mode').css({'margin-left':'auto', 'margin-right':'auto'});
        return $newServiceName;
    };

    ServiceNameListManager.prototype.bindPreviousButtonEvent = function () {
        var _this = this;
        $('.fix_area > .btn_wrap > .fl_r > .btnBigGray:first').on('click', function () {
            //new Brightics.Installer.PopUp(_this.$parent, {
            //    title: 'Temp',
            //    message: 'Hellllo',
            //    hasCheckBox: true,
            //    checkBoxMessage: 'zgzgzg',
            //    mode: 'confirm',
            //    callback: function (isChecked) {
            //        console.log(isChecked);
            //        _this.controller.startStep1(isChecked);
            //    }
            //});
            _this.controller.startStep1();
        });
    };

    ServiceNameListManager.prototype.getCheckedCount = function () {
        var checkedCount = 0;

        var $serviceNameList = $('#installer_step2_service_name_list > tr');
        $serviceNameList.each(function (index) {
            if ($(this).find('.installer_step2_service_name_checkbox').is(':checked')) {
                checkedCount++;
            }
        });

        return checkedCount;
    };

    ServiceNameListManager.prototype.checkAll = function () {

    };

    ServiceNameListManager.prototype.bindNextButtonEvent = function () {
        var _this = this;
        $('.fix_area > .btn_wrap > .fl_r > .btnBigGray:last').on('click', function () {
            if (_this.getCheckedCount() > 0) {
                console.log('install_step2');
                var sendData = _this.createSendData();

                sendData.step = 'install_2';
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    url: '/api/v1/wizard/installstep2',
                    data: JSON.stringify(sendData),
                    success: function (response) {
                        var responseObject = response;
                        console.log(responseObject);

                        if (responseObject.response.status === 'success') {
                            _this.controller.startStep3();
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
            } else {
                _this.studio.showPopup({
                    title: 'Check Error',
                    mode: 'alert',
                    message: ['should be checked at least 1 service'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {

                    }
                });
            }
        });
    };

    ServiceNameListManager.prototype.createSendData = function () {
        var rt = {};
        rt["action"] = "install";
        var rtPkgList = [];

        var $serviceNameList = $('#installer_step2_service_name_list > tr');
        $serviceNameList.each(function (index) {
            if ($(this).find('.installer_step2_service_name_checkbox').is(':checked')) {
                var packageName = $serviceNameList.find('#installer_step2_service_name_' + index).text();
                var versionKey = $serviceNameList.find('#installer_step2_service_version_' + index).val();
                var clusterModeKey = $serviceNameList.find('#installer_step2_service_mode_' + index).val();
                var rtObj = {
                    "packageName": packageName,
                    "clusterMode": clusterModeKey,
                    "version": versionKey
                };

                rtPkgList.push(rtObj);
            }
        });
        rt["packages"] = rtPkgList;
        return rt;
    };

    root.Brightics.Installer.ContentContainer.UpgradeStep2Container = UpgradeStep2Container;

}).call(this);