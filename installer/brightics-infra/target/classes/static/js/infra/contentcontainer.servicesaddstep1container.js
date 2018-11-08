/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ServiceAddStep1Container ($parent) {
        this.$parent = $parent;     //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ServiceAddStep1Container.prototype.setController = function (controller) {
        this.controller = controller;
    };

    ServiceAddStep1Container.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
    };

    ServiceAddStep1Container.prototype.createLayout = function () {
        this.createHeadArea();
        this.createContentArea();
        this.createButtonArea();
    };

    ServiceAddStep1Container.prototype.createHeadArea = function () {
        this.$header = $('' +
            '<div class="h2_title"><span>Add new Service</span></div>' +
            '<div class="location">' +
            '    <a href="#">Services</a> <img src="static/images/ico_path.gif" alt="" /> <strong>Add new Service</strong>' +
            '</div>');

        this.$parent.append(this.$header);
    };

    ServiceAddStep1Container.prototype.createContentArea = function () {
        this.$contentArea = $('<div class="cont_area  clearfix"></div>');
        this.$parent.append(this.$contentArea);

        this.createNavigator();
        this.createContent();
    };

    ServiceAddStep1Container.prototype.createButtonArea = function () {
        var _this = this;

        this.$buttonArea = $('' +
            '<div class="fix_area step2_next">' +
            '    <div class="btn_wrap">' +
            '       <div class="fl_r">' +
            '           <button class="btnBigGray"><span>Next</span></button>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$buttonArea.click(function(){
            var selectedPackageName = _this.findCheckedPackage();
            _this.controller.selectedPackageName = selectedPackageName;

            var $selectedBody = {};
            
            for (var i in _this.$notInstalledList) {
                if (_this.$notInstalledList[i].attr('service-name') === selectedPackageName) {
                    $selectedBody = _this.$notInstalledList[i];
                    break;
                }
            }

            var selectedVersion = '';
            var selectedMode = '';

            if($selectedBody.find('#jqxVersion_'+selectedPackageName)) {
                var item = $selectedBody.find('#jqxVersion_'+selectedPackageName).jqxDropDownList('getSelectedItem');
                if (item) selectedVersion = item.label;
            }

            if($selectedBody.find('#jqxMode_'+selectedPackageName)) {
                var item = $selectedBody.find('#jqxMode_'+selectedPackageName).jqxDropDownList('getSelectedItem');
                if (item) selectedMode = item.label;
            }

            for (var key in _this.contextData[selectedPackageName].version) {
                if (key === selectedVersion) _this.contextData[selectedPackageName].version[key] = true;
                else _this.contextData[selectedPackageName].version[key] = false;
            }

            for (var key in _this.contextData[selectedPackageName].clusterModeMap) {
                if (key === selectedMode) _this.contextData[selectedPackageName].clusterModeMap[key] = true;
                else _this.contextData[selectedPackageName].clusterModeMap[key] = false;
            }

            var sendData = {
                packageName : selectedPackageName,
                clusterMode : selectedMode,
                version : selectedVersion
            };

            //_this.studio.showProgress('saving step1...');

            $.ajax({
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                url: '/api/v1/wizard/servicestep1',
                data: JSON.stringify(sendData),
                success: function (response) {
                    //_this.studio.hideProgress();
                    if (response.response.status === 'success') {
                        _this.controller.startStep2();
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
        });

        this.$parent.append(this.$buttonArea);
    };

    ServiceAddStep1Container.prototype.findCheckedPackage = function () {
        return this.$board.find('.radio[name="group"]:checked').val();
    };

    ServiceAddStep1Container.prototype.createNavigator = function () {
        this.$navigator = $('' +
            '<div class="tab_type05">' +
            '    <ul>' +
            '       <li class="tab_01">' +
            '           <a href="#" class="on">' +
            '               <span class="tab_num">01</span>' +
            '               <span class="tab_type01_text_on"> Choose service</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">02</span>' +
            '               <span class="tab_type01_text_off"> Choose target hosts</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">03</span>' +
            '               <span class="tab_type01_text_off"> Configurations</span>' +
            '           </a>' +
            '       </li>' +
            '    </ul>' +
            '</div>');

        this.$navigator.find('a').css({'cursor':'default'});

        this.$contentArea.append(this.$navigator);
    };

    ServiceAddStep1Container.prototype.createContent = function () {
        this.$content = $('' +
            '<div class="row-fluid rowlast">' +
            '    <div class="h3_title">' +
            '       <span>Service List</span>' +
            '   </div>' +
            '   <div class="row_fiuld_des"></div>' +
            '   <div>' +
            '        <div class="bd_list_summary">' +
            '           <ul>' +
            '               <li class="services_add_step1_not_installed_number">' +
            '                   <strong>Total</strong> <em >0</em>' +
            '               </li>' +
            '           </ul>' +
            '       </div>' +
            '       <div class="board"></div>' +
            '    </div>' +
            '</div>');

        this.$contentArea.append(this.$content);

        this.$board = this.$content.find('.board');

        this.create$notInstalledList();
    };

    ServiceAddStep1Container.prototype.create$notInstalledList = function () {
        var $table = $('<table class="board-list"></table>');
        var $colGroup = $('' +
            '<colgroup>' +
            '   <col class="w60"/>' +
            '   <col class="w21"/>' +
            '   <col class="w14"/>' +
            '   <col class="w14"/>' +
            '   <col />' +
            '</colgroup>');

        $table.append($colGroup);

        var $thead = $('' +
            '<thead>' +
            '   <tr>' +
            '       <th style="border-right: 1px solid #d9d9d9"><div></div></th>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Service Name</th>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Version</th>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Mode</th>' +
            '       <th class="center">Description</th>' +
            '   </tr>' +
            '</thead>');
        $table.append($thead);

        var $tbody = $('<tbody></tbody>');
        $table.append($tbody);
        this.$board.append($table);

        this.fillNotInstalledList();
    };

    ServiceAddStep1Container.prototype.fillNotInstalledList = function () {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/wizard/servicestep1',
            success: function(response){
                var contextData = {};

                for( var idx in response.packages ) {
                    var pkg = response.packages[idx];

                    contextData[pkg.packageName] = {
                        packageName : pkg.packageName,
                        packageDesc : pkg.packageDesc,
                        version : pkg.version,
                        clusterModeMap : pkg.clusterModeMap
                    };
                }

                console.log(contextData);

                _this.contextData = contextData;

                _this.renderNotInstalledPackage(contextData);
                _this.renderSummary(contextData);
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    };

    ServiceAddStep1Container.prototype.renderSummary = function (packages) {
        var _this = this;

        var totalCount = Object.keys(packages).length;
        _this.$content.find("div.bd_list_summary").find("li.services_add_step1_not_installed_number").find("em").text(totalCount);
    }

    ServiceAddStep1Container.prototype.renderNotInstalledPackage = function (packages) {
        var _this = this;

        this.$notInstalledList = [];

        for (var key in packages) {
            var pkg = packages[key];
            var packageName = pkg.packageName;
            var packageDesc = pkg.packageDesc;

            var $tbodyComponent = $('' +
                '<tr service-name="'+packageName+'">' +
                '    <td id="step2-board-list-chk" class="chk-area" style="border-right: 1px solid #f0f0f0">' +
                '       <div class="chk">' +
                '           <input class="radio" type="radio" value="'+packageName+'" name="group" id="board-list-radio-'+packageName+'">' +
                '           <label for="board-list-radio-'+packageName+'"></label>' +
                '       </div>' +
                '    </td>' +
                '    <td id="step2-board-list-name" class="left tdlt">' +
                '       <div class="line_body clearfix">' +
                '           <span>'+packageName+'</span>' +
                '       </div>' +
                '    </td>' +
                '    <td id="step2-board-list-version" style="border-right: 1px solid #f0f0f0">' +
                '       <div class="line_body clearfix">' +
                '           <div id="jqxVersion_'+packageName+'" class="board-list-version-'+packageName+'"></div>' +
                '       </div>' +
                '    </td>' +
                '    <td id="step2-board-list-mode" style="border-right: 1px solid #f0f0f0">' +
                '       <div class="line_body clearfix">' +
                '           <div id="jqxMode_'+packageName+'" class="board-list-mode-'+packageName+'"></div>' +
                '       </div>' +
                '    </td>' +
                '    <td  id="step2-board-list-desc" class="left tdlt">' +
                '       <div class="line_body clearfix">' +
                '           <span>'+packageDesc+'</span>' +
                '       </div>' +
                '   </td>' +
                '</tr>'
            );

            $tbodyComponent.find('#step2-board-list-version').find('.line_body').css({'margin-left':'80px', 'margin-right':'auto'});
            $tbodyComponent.find('#step2-board-list-mode').find('.line_body').css({'margin-left':'40px', 'margin-right':'auto'});

            this.$notInstalledList.push($tbodyComponent);

            var $radioButton = $tbodyComponent.find('#step2-board-list-chk');

            $radioButton.click(function(){

                //var packageName = $(this).attr('service-name');
                //var version = '';
                //var clusterMode = ''
                //
                //if ($(this).find('jqxVersion_'+packageName).length > 0) version = $(this).find('jqxVersion_'+packageName).jqxDropDownList('getSelectedItem');
                //if ($(this).find('jqxVersion_'+packageName).length > 0) version = $(this).find('jqxMode_'+packageName).jqxDropDownList('getSelectedItem');

                //_this.selectedPackage.packageName = packageName;
                //_this.selectedPackage.version = version;
                //_this.selectedPackage.clusterMode = clusterMode;
            });

            this.$board.find('tbody').append($tbodyComponent);

            var versionSource = this.getVersionSource(pkg);
            var modeSource = this.getModeSource(pkg);

            if (versionSource.length > 1) {
                $tbodyComponent.find('#jqxVersion_'+packageName).jqxDropDownList({
                    source: versionSource,
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '100px',
                    height: '25px',
                    dropDownHeight: 130
                });

                for (var versionKey in pkg.version) {
                    if (pkg.version[versionKey] == true) {
                        $tbodyComponent.find('#jqxVersion_'+packageName).val(versionKey);
                        break;
                    }
                }
            }
            else {
                $tbodyComponent.find('#jqxVersion_'+packageName).jqxDropDownList({
                    source: versionSource,
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '100px',
                    height: '25px',
                    dropDownHeight: 130,
                    disabled: true
                });

                $tbodyComponent.find('#jqxVersion_'+packageName).css({
                    'opacity':'1.0',
                    'border': 'none'
                });
                $tbodyComponent.find('#dropdownlistArrowjqxVersion_'+packageName).remove();
            }

            if (modeSource.length > 1) {
                $tbodyComponent.find('#jqxMode_'+packageName).jqxDropDownList({
                    source: modeSource,
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '100px',
                    height: '25px',
                    dropDownHeight: 130
                });

                for (var modeKey in pkg.clusterModeMap) {
                    if (pkg.clusterModeMap[modeKey] == true) {
                        $tbodyComponent.find('#jqxMode_'+packageName).val(modeKey);
                        break;
                    }
                }
            }
            else {
                $tbodyComponent.find('#jqxMode_'+packageName).jqxDropDownList({
                    source: modeSource,
                    animationType: 'fade',
                    selectedIndex: 0,
                    theme: 'office',
                    width: '100px',
                    height: '25px',
                    dropDownHeight: 130,
                    disabled: true
                });

                $tbodyComponent.find('#jqxMode_'+packageName).css({
                    'opacity':'1.0',
                    'border': 'none'
                });
                $tbodyComponent.find('#dropdownlistArrowjqxMode_'+packageName).remove();
            }

            $tbodyComponent.find('#jqxVersion_'+packageName).on('change', function(event){
                var args = event.args,
                    id = $(this).attr('id');

                if (args) {
                    var label = args.item.label;
                    var versions = _this.contextData[id.replace('jqxVersion_','')].version;

                    for (var key in versions){
                        if (key == label) versions[key] = true;
                        else versions[key] = false;
                    }
                }
            });

            $tbodyComponent.find('#jqxMode_'+packageName).on('change', function(event){
                var args = event.args,
                    id = $(this).attr('id');

                if (args) {
                    var label = args.item.label;
                    var modes = _this.contextData[id.replace('jqxMode_','')].clusterModeMap;

                    for (var key in modes){
                        if (key == label) modes[key] = true;
                        else modes[key] = false;
                    }
                }
            });
        }

        if (this.$notInstalledList) this.$notInstalledList[0].find('.radio').prop('checked', true);
    };

    ServiceAddStep1Container.prototype.getVersionSource = function (pkg) {
        var rt = [];

        for (var key in pkg.version) {
            rt.push(key);
        }
        return rt;
    };

    ServiceAddStep1Container.prototype.getModeSource = function (pkg) {
        var rt = [];

        for (var key in pkg.clusterModeMap) {
            rt.push(key);
        }
        return rt;
    };

    root.Brightics.Installer.ContentContainer.ServiceAddStep1Container = ServiceAddStep1Container;

}).call(this);