/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ExternalPackageInterfaceHomeContainer($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ExternalPackageInterfaceHomeContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.setExternalPackage();
        
    };

    ExternalPackageInterfaceHomeContainer.prototype.setExternalPackage = function () {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/externals',
            success: function(data){
                _this.externalPackageList = data;
                _this.renderHome();
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    };

    ExternalPackageInterfaceHomeContainer.prototype.createLayout = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="h2_title"><span>External Package Interface</span></div>' +
            // '<div class="h2_title"></div>'+
            // '<div class="location">' +
            // '    <strong>Service</strong>' +
            // '</div>' +
            '<div class="cont_area clearfix">' +
            '    <div class="row-fluid rowlast mt22">' +
            '       <div>' +
            '           <div class="board">' +
            '           </div>' +
            '       </div>' +
            '       <div class="btn_wrap"></div>' +
            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);
        this.$board = this.$mainControl.find('.board');
        this.$buttonArea = this.$mainControl.find('.btn_wrap');

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

        var $externalPackageButton = $('' +
            '<div class="fl_r" style="margin-bottom: 10px">' +
            '    <button class="btnWhite"><span>Refresh External Package Interface</span></button>' +
            '</div>');
        this.$buttonArea.append($externalPackageButton);
        $externalPackageButton.click(function(){
            $.ajax({
                type: 'GET',
                url: '/api/v1/externals',
                success: function (response) {
                    _this.externalPackageList = response;

                    _this.createExternalPackageDialog(response);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.error(xhr);
                }
            });
        });
    };

    ExternalPackageInterfaceHomeContainer.prototype.createExternalPackageDialog = function (packageList) {
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
                    if( packageList[i].enabled == false ) continue;

                    var packageData = packageList[i];

                    var $package = $('' +
                        '<div class="external-package-dialog-body-content-package" style="top: 0px; width:100%; position: relative;" package-name="'+packageData.externalPackageName+'" package-id="'+packageData.externalPackageId+'">' +
                        '   <div class="chk" style="position: relative; margin-bottom: 10px; padding-left: 20px; float:left; width: 90%; font-weight: bold; font-size:16px;">' +
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
                        url: '/api/v1/externals/refresh',
                        success: function (data) {
                        	if (data.response === undefined) {
	                            _this.studio.showProgress('refreshing external package interface...');
	
	                            _this.statusChangeInterval = setInterval(function () {
	                                $.ajax({
	                                    method: 'GET',
	                                    crossDomain: true,
	                                    url: '/api/v1/simpleprogress',
	                                    success: function(data){
	                                        if (data.waiting == false) {
	                                            var msg = 'done'
	                                            if(data.response.status == 'failed') msg = data.response.message
	                                            clearInterval(_this.statusChangeInterval);
	                                            _this.studio.hideProgress();
	
	                                            _this.render();
	                                            _this.studio.showPopup({
	                                                title: 'changing status',
	                                                mode: 'alert',
	                                                message: [msg],
	                                                hasCheckBox: false,
	                                                checkBoxMessage: '',
	                                                callback: function (isChecked) {
	
	                                                }
	                                            });
	                                        }
	                                    }
	                                }).done(function(data){
	                                    console.log(data);
	                                    //_this.studio.hideProgress();
	                                    //window.location.href = '../services/Infra_Services.html';
	                                });
	                            }, 1000);
	
	                            $('.external-package-dialog').jqxWindow('destroy');
                            }
                        	else if (data.response.status === 'failed') {
                            	$('.external-package-dialog').jqxWindow('destroy');
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
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.error(xhr);
                        }
                    });
                });

                $externalPackageDialog.find('.external-package-dialog-body-button').append($saveButton);
                if(Brightics.Installer.Studio.appData.userId != 'admin'){
                	$saveButton.addClass('disabled');
                }
            }
        });

        $externalPackageDialog.on('close', function(){
            $(this).jqxWindow('destroy');
        });
    }

    ExternalPackageInterfaceHomeContainer.prototype.renderHome = function () {
        var _this = this;

        for (var i in _this.externalPackageList) {
            if( _this.externalPackageList[i].enabled == true ) {
                this.createTable(_this.externalPackageList[i]);
            }
        }
    };

    ExternalPackageInterfaceHomeContainer.prototype.createTable = function (packageData) {
        var $tableWrapper = $('<div></div>');
        $tableWrapper.css({
            'width': '500px',
            'height': 'auto',
            'margin-bottom': '10px',
            'margin-top': '10px',
            'border-bottom': '1px solid #f0f0f0'
        });

        var $table = $('<table class="board-list"></table>');
        var $colGroup = $('' +
            '<colgroup>' +
            '   <col class="w9/>' +
            '   <col class="w21"/>' +
            '</colgroup>');

        $table.append($colGroup);

        var $thead = $('' +
            '<thead>' +
            '   <tr>' +
            '       <th colspan="2" class="center tdlt">'+packageData.externalPackageName+'</th>' +
            '   </tr>' +
            '</thead>');
        $table.append($thead);

        var $tbody = $('<tbody></tbody>');
        $table.append($tbody);
        $tableWrapper.append($table);
        this.$mainControl.find('.board').append($tableWrapper);
        this.fillPackageProperties($tbody, packageData);
    };

    ExternalPackageInterfaceHomeContainer.prototype.fillPackageProperties = function ($parent, packageData) {
        var _this = this;
        for (var i in packageData.propertyList) {
            var $bodyComponent = $('' +
                '<tr>' +
                '   <td class="" style="width:150px; border-right: 1px solid #f0f0f0">' +
                '        <div class="line_body clearfix">' +
                '           <span title="'+packageData.propertyList[i].key+'">'+packageData.propertyList[i].key+'</span>' +
                '       </div>' +
                '   </td>' +
                '   <td style="width:350px;">' +
                '        <div class="line_body clearfix">' +
                '           <span title="'+packageData.propertyList[i].value+'">'+packageData.propertyList[i].value+'</span>' +
                '       </div>' +
                '   </td>' +            
                '</tr>');
            $bodyComponent.find('td').css({
                'text-align': 'left',
                'vertical-align': 'middle',
                'padding-left':'20px'
            });
            $parent.append($bodyComponent);
        }
    };

    root.Brightics.Installer.ContentContainer.ExternalPackageInterfaceHomeContainer = ExternalPackageInterfaceHomeContainer;

}).call(this);