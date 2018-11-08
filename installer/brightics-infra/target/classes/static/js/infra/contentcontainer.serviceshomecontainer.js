/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ServicesHomeContainer($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ServicesHomeContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderHome();
        this.renderButtonArea();
    };

    ServicesHomeContainer.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="h2_title"><span>Service</span></div>' +


            '<div class="h2_title"></div>'+


            '<div class="location">' +
            '    <strong>Service</strong>' +
            '</div>' +
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
    };

    ServicesHomeContainer.prototype.renderHome = function () {
        var _this = this;

        var $table = $('<table class="board-list"></table>');
        var $colGroup = $('' +
            '<colgroup>' +
            '   <col />' +
            '   <col class="w21"/>' +
            '   <col class="w21"/>' +
            '   <col class="w21"/>' +
            '</colgroup>');

        $table.append($colGroup);

        var $thead = $('' +
            '<thead>' +
            '   <tr>' +
            '       <th class="center tdlt">Service</th>' +
            '       <th class="center tdlt">Status</th>' +
            '       <th class="center tdlt">Action</th>' +
            '       <th class="center">Remove</th>' +
            '   </tr>' +
            '</thead>');
        $table.append($thead);

        this.$tbody = $('<tbody></tbody>');
        $table.append(this.$tbody);

        this.$mainControl.find('.board').append($table);
        this.fillServiceList(this.$board);

        this.checkAddPossible();
    };

    ServicesHomeContainer.prototype.checkAddPossible = function () {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/context',
            data: {
                "action": 'services_home'
            },
            success: function(data){
                for (var key in data.packages) {
                    if (data.packages[key].isSelected == false) {
                        _this.$addNewServiceButton.show();
                        break;
                    }
                }
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    };

    ServicesHomeContainer.prototype.renderButtonArea = function () {
        var _this = this;

        this.$addNewServiceButton = $('' +
            '<div class="fl_r">' +
            '   <button class="btnBigGray"><span>Add new service</span></button>' +
            '</div>');

        this.$addNewServiceButton.hide();
        
        if(Brightics.Installer.Studio.appData.userId != 'admin'){
        	this.$addNewServiceButton.addClass('disabled');
        }

        this.$buttonArea.append(this.$addNewServiceButton);

        this.$addNewServiceButton.click(function(){
            _this.studio.renderServicesAddStep();
        });
    };

    ServicesHomeContainer.prototype.fillServiceList = function ($parent) {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/services',
            success: function(data){
                var _data = data;

                var _packages = _data.packages;

                _packages.sort(function (a, b) {
                    return a.packageName < b.packageName ? -1 : a.packageName > b.packageName ? 1 : 0;
                });

                _this.renderService($parent, _packages);
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    };

    ServicesHomeContainer.prototype.renderService = function ($parent, serviceList) {
        var _this = this;

        for (var i in serviceList) {
            var status = (serviceList[i].status).toLocaleLowerCase();
            var statusClass = 'Status-bar ';

            if (status === 'start'|| status === 'running') {
                statusClass += 'status_running';
            } else if (status === 'warning') {
                statusClass += 'status_warning';
            } else if (status === 'stop') {
                statusClass += 'status_stop';
            } else if (status === 'error') {
                statusClass += 'status_error';
            }

            var $bodyComponent = $('' +
                '<tr>' +
                '   <td class="left pl20 tdlt">' +
                '        <div class="line_body clearfix">' +
                '           <span>'+serviceList[i].packageName+'</span>' +
                '       </div>' +
                '   </td>' +
                '   <td  class="tdlt">' +
                '       <div class="line_body clearfix">' +
                '           <div class="'+statusClass+'"><span class="Status-value ">'+serviceList[i].status+'</span></div>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            var $toggle = $('' +
                '<td class="center" style="border-right: 1px solid #f0f0f0">' +
                '   <div class="line_body clearfix status_click_running ">' +
                    //'           <a href="#none" class="btn_sbbtn sec_tm1 on status_running" title="Start">Start</a>' +
                '       <a href="#none" id="service_start_'+serviceList[i].packageName+'" name="'+serviceList[i].packageName+'" class="btn_sbbtn sec_tm1 on status_running" title="Start">Start</a>' +
                '       <a href="#none" id="service_stop_'+serviceList[i].packageName+'" name="'+serviceList[i].packageName+'" class="btn_sbbtn sec_tm2" title="Stop">Stop</a>' +
                '   </div>' +
                '</td>');

            var $startButton = $toggle.find('#service_start_'+serviceList[i].packageName);
            var $stopButton = $toggle.find('#service_stop_'+serviceList[i].packageName);

            if(Brightics.Installer.Studio.appData.userId != 'admin'){
            	$startButton.addClass('disabled');
            	$stopButton.addClass('disabled');
            }
            
            if (serviceList[i].runnable == false) {
                $startButton.hide();
                $stopButton.hide();
            }

            if (status === 'stop')  {
                $startButton.removeClass('on status_running');
                $stopButton.addClass('on status_stop');
            } else {
                $stopButton.removeClass('on status_stop');
                $startButton.addClass('on status_running');
            }

            $startButton.click(function(){
                if (!$(this).hasClass('status_running')) {

                    var packageName = $(this).attr('name');

                    $.ajax({
                        method: 'PUT',
                        crossDomain: true,
                        contentType: 'application/json',
                        data: JSON.stringify({recipeGroup: 'START'}),
                        url: '/api/v1/services/'+ packageName,
                        success: function(data){
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
                                $('#service_start_'+packageName).addClass('on status_running');
                                $('#service_stop_'+packageName).removeClass('on status_stop');
                                _this.studio.showProgress(packageName+' start...');
	
	                            _this.statusChangeInterval = setInterval(function () {
	                                $.ajax({
	                                    method: 'GET',
	                                    crossDomain: true,
	                                    url: '/api/v1/services/progress/install/'+ packageName,
	                                    success: function(data){
	                                        if (data.waiting == false) {
	                                            var msg = 'done'
	                                            if(data.response.status == 'failed') msg = data.response.message
	
	                                            clearInterval(_this.statusChangeInterval);
	                                            _this.studio.hideProgress();
	                                            _this.studio.renderServicesHome();
	
	                                            _this.studio.showPopup({
	                                                title: 'Start Service',
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
	                                });
	                            }, 1000);
                            }
                        }
                    }).done(function(data){
                        console.log(data);
                    });
                }
            });

            $stopButton.click(function(){
                if (!$(this).hasClass('status_running')) {
                	var packageName = $(this).attr('name');
                	
                	_this.studio.showPopup({
                        title: 'Stop',
                        mode: 'confirm',
                        message: ['Are you sure want to proceed with the Stop?'],
                        hasCheckBox: false,
                        checkBoxMessage: '',
                        callback: function (isChecked) {

                            $.ajax({
                                method: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify({recipeGroup: 'STOP'}),
                                url: '/api/v1/services/'+ packageName,
                                success: function(data){
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
                                        $('#service_stop_'+packageName).addClass('on status_stop');
                                        $('#service_start_'+packageName).removeClass('on status_running');
                                        _this.studio.showProgress(packageName+' stop...');
	
	                                    _this.statusChangeInterval = setInterval(function () {
	                                        $.ajax({
	                                            method: 'GET',
	                                            crossDomain: true,
	                                            url: '/api/v1/services/progress/install/'+ packageName,
	                                            success: function(data){
	                                                if (data.waiting == false) {
	                                                    var msg = 'done'
	                                                    if(data.response.status == 'failed') msg = data.response.message
	                                                    clearInterval(_this.statusChangeInterval);
	                                                    _this.studio.hideProgress();
	                                                    _this.studio.renderServicesHome();
	
	                                                    _this.studio.showPopup({
	                                                        title: 'Stop Service',
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
                                    }
                                }
                            }).done(function(data){
                                console.log(data);
                                //_this.studio.hideProgress();
                                //window.location.href = '../services/Infra_Services.html';
                            });
                        }
                    });
                }
            });

            $bodyComponent.append($toggle);

            if (serviceList[i].isBase || !serviceList[i].isRemovable) {
                var $removeButton = $('' +
                    '<td>' +
                    '    <div class="line_body clearfix">' +
                    '     </div>' +
                    '</td>');
            }
            else {
                var $removeButton = $('' +
                    '<td>' +
                    '    <div class="line_body clearfix">' +
                    '           <button class="btnWhite">Remove</button>' +
                    '     </div>' +
                    '</td>');
                $removeButton.attr('id', serviceList[i].packageName);
                $removeButton.find('button').attr('id', serviceList[i].packageName);
                $removeButton.find('button').css('color', 'rgba(0, 0, 0, 0.8)');

                if(Brightics.Installer.Studio.appData.userId != 'admin'){
                	$removeButton.find('button').addClass('disabled');
                }
                
                $removeButton.find('button').click(function(){
                    var serviceName = $(this).attr('id');

                    _this.studio.showPopup({
                        title: 'Remove Service',
                        mode: 'confirm',
                        message: ['remove?'],
                        hasCheckBox: false,
                        checkBoxMessage: '',
                        callback: function (isChecked) {
                            $.ajax({
                                method: 'DELETE',
                                crossDomain: true,
                                url: '/api/v1/services/'+ serviceName,
                                success: function(data){
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
                                        _this.studio.showProgress('Remove '+serviceName+' service...');
	                                    var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
	                                    studio.statusChangeInterval = setInterval(function () {
	                                        $.ajax({
	                                            method: 'GET',
	                                            crossDomain: true,
	                                            url: '/api/v1/services/progress/install/'+ serviceName,
	                                            success: function(data){
	                                                if (data.waiting == false) {
	                                                    var msg = 'done'
	                                                    if(data.response.status == 'failed') msg = data.response.message
	                                                    clearInterval(studio.statusChangeInterval);
	                                                    studio.hideProgress();
	                                                    studio.renderServicesHome();
	
	                                                    studio.showPopup({
	                                                        title: 'Remove Service',
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
	                                        });
	                                    }, 1000);
                                    }
                                }
                            }).done(function(data){
                                console.log(data);
                            });
                        }
                    });
                });
            }

            $bodyComponent.append($removeButton);
            $bodyComponent.addClass('service-board-list-body-'+serviceList[i].packageName);
            this.$tbody.append($bodyComponent);
        }
    };

    root.Brightics.Installer.ContentContainer.ServicesHomeContainer = ServicesHomeContainer;

}).call(this);