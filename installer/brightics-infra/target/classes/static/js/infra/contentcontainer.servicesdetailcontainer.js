/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ServicesDetailContainer($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ServicesDetailContainer.prototype.render = function (summaryData, serviceName) {
        this.summaryData = summaryData;
        this.serviceName = serviceName;

        this.$parent.empty();
        this.createLayout();
        this.renderSummary(this.$contentBody, this.summaryData);
        this.renderButtonArea();
    };

    ServicesDetailContainer.prototype.createLayout = function () {
        var _this = this;

        var $header = $('' +
            '<div class="h2_title"><span>' + this.serviceName + '</span></div>' +
            '   <div class="fl_l status_Services_click" >' +
            '       <a href="#none" name="' + this.serviceName + '" id="start_' + this.serviceName + '" class="btn_sbbtn sec_tm1 on status_running" title="Start">Start</a>' +
            '       <a href="#none" name="' + this.serviceName + '" id="stop_' + this.serviceName + '" class="btn_sbbtn sec_tm2" title="Stop">Stop</a>' +
            '</div>' +
            '<div class="location">' +
            '   <a href="#">Services</a> <img src="static/images/ico_path.gif" alt="" /> <strong>' + this.serviceName + '</strong>' +
            '</div>');

        this.$parent.append($header);

        this.$startButton = $header.find('#start_' + this.serviceName);
        this.$stopButton = $header.find('#stop_' + this.serviceName);

        if(Brightics.Installer.Studio.appData.userId != 'admin'){
        	this.$startButton.addClass('disabled');
        	this.$stopButton.addClass('disabled');
        }
        
        if (this.summaryData.runnable == false) {
            this.$startButton.hide();
            this.$stopButton.hide();
        }

        var status = (this.summaryData.status).toLowerCase();
        if ( status === 'stop') {
            this.$startButton.removeClass('on status_running');
            this.$stopButton.addClass('on status_stop');
        } else {
            this.$startButton.addClass('on status_running');
            this.$stopButton.removeClass('on status_stop');
        }

        this.$startButton.click(function () {
            if (!$(this).hasClass('status_running')) {
                var packageName = $(this).attr('name');

                $.ajax({
                    method: 'PUT',
                    url: '/api/v1/services/' + packageName,
                    contentType: 'application/json',
                    data: JSON.stringify({recipeGroup: 'START'}),
                    success: function (data) {
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
                            $('#start_' + packageName).addClass('on status_running');
                            $('#stop_' + packageName).removeClass('on status_stop');
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
	
	                                        RenderSummary(packageName);
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
                        }
                    }
                }).done(function (data) {

                });
            }
        });

        this.$stopButton.click(function () {
            if (!$(this).hasClass('status_stop')) {
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
                            url: '/api/v1/services/' + packageName,
                            contentType: 'application/json',
                            data: JSON.stringify({recipeGroup: 'STOP'}),
                            success: function (data) {
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
                                    $('#start_' + packageName).removeClass('on status_running');
                                    $('#stop_' + packageName).addClass('on status_stop');
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
	                                                RenderSummary(packageName);
	
	                                                _this.studio.showPopup({
	                                                    title: 'Service Stop',
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
                        }).done(function (data) {

                        });
                    }
                });
            }
        });

        var $contentArea = $('<div class="cont_area  clearfix"></div>');
        var $tabContainer = $('' +
            '<div class="tab_type06 mt22 box_tab">' +
            '   <ul>' +
            '   </ul>' +
            '</div>');
        this.$summaryTab = $('' +
            '<li id="summary" class="tab_01 on"><a href="#">Summary</a>' +
            '   <p></p>' +
            '</li>');
        this.$configTab = $('' +
            '<li id="config" class="tab_01 "><a href="#">Config</a>' +
            '   <p></p>' +
            '</li>');

        this.$statusInfoArea = $('' +
                '<div class="status-info" style="float:right"></div>' +
                //'   <ul>' +
            '       <li style="float: right; margin-right: 10px; margin-top: 10px;">' +
            '           <div class="iconstatus status_stop "></div>' +
            '           <span>STOP</span>' +
            '       </li>' +
            //'       <li style="float: right; margin-right: 10px; margin-top: 10px;">' +
            //'           <div class="iconstatus status_error "></div>' +
            //'           <span>Error</span>' +
            //'       </li>' +
            '       <li style="float: right; margin-right: 10px; margin-top: 10px;">' +
            '           <div class="iconstatus status_warning "></div>' +
            '           <span>WARNING</span>' +
            '       </li>' +
            '       <li style="float: right; margin-right: 10px; margin-top: 10px;">' +
            '           <div class="iconstatus status_running "></div>' +
            '           <span>RUNNING</span>' +
            '       </li>' +
                //'   </ul>' +
                '</div>' +
            '');

        $tabContainer.find('ul').append(this.$summaryTab).append(this.$configTab).append(this.$statusInfoArea);
        $contentArea.append($tabContainer);

        this.$configTab.click(function () {
            _this.$configTab.addClass('on');
            _this.$summaryTab.removeClass('on');

            if (_this.serviceName.toLowerCase() != 'java') _this.$saveButton.show();
            _this.$statusInfoArea.hide();

            _this.$contentBody.empty();

            var url = '/api/v1/services/' + _this.serviceName + '/configuration';

            $.ajax({
                method: 'GET',
                url: url,
                success: function (configData) {
                    _this.configData = $.extend(true, {}, configData);
                    var _serviceName = _this.serviceName.toLowerCase();

                    if (_serviceName == 'java' || _serviceName == 'scala' || _serviceName == 'tensorflow') _this.renderEmpty();
                    else _this.renderConfig(_this.$contentBody, configData);
                }

            }).done(function (data) {

            });
        });

        this.$summaryTab.click(function () {
            _this.$summaryTab.addClass('on');
            _this.$configTab.removeClass('on');

            _this.$saveButton.hide();
            _this.$statusInfoArea.show();

            _this.$contentBody.empty();

            var url = '/api/v1/services/'+ _this.serviceName ;

            $.ajax({
                method: 'GET',
                crossDomain: true,
                url: url,
                success: function(summaryData){
                    console.log(summaryData);
                    _this.renderSummary(_this.$contentBody, summaryData);
                }
            }).done(function(data){

            }).fail(function(data){
                console.error(data);
            });
        });

        this.$contentBody = $('<div id="content-body"></div>');
        $contentArea.append(this.$contentBody);

        this.$parent.append($contentArea);
    };

    ServicesDetailContainer.prototype.renderSummary = function ($parent, summaryData) {
        this.summary = new root.Brightics.Installer.ContentContainer.ServiceDetailSummary($parent, summaryData);
        this.summary.render();
    };

    ServicesDetailContainer.prototype.renderConfig = function ($parent, configData) {
        this.config = new root.Brightics.Installer.ContentContainer.ServiceDetailConfig($parent, configData);
        this.config.render();
    };

    ServicesDetailContainer.prototype.renderEmpty = function () {
        var height = $('.fix_area').offset().top - $('.cont_area').offset().top - $('.cont_area').height();
        var $emptyContent = $('<div style="font-size: large; padding-left: 550px; display:table-cell; vertical-align: middle; text-align: center; width: 100%; height: '+height+'px;"></div>');
        $emptyContent.text('There are no setting values');
        this.$contentBody.append($emptyContent);
    };

    ServicesDetailContainer.prototype.renderButtonArea = function () {
        var _this = this;

        var $buttonArea = $('' +
            '<div class="fix_area ">' +
            '   <div class="btn_wrap">' +
            '       <div class="fl_r">' +
            '           <button id="remove-button" class="btnBigGray"><span>Remove</span></button>' +
            '           <button id="save-button" class="btnBigBlue"><span>Save</span></button>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$removeButton = $buttonArea.find('#remove-button');
        this.$saveButton = $buttonArea.find('#save-button');
        this.$saveButton.hide();
        
        if(Brightics.Installer.Studio.appData.userId != 'admin'){
        	this.$removeButton.addClass('disabled');
        	this.$saveButton.addClass('disabled');
        }

        this.$parent.append($buttonArea);

        this.$removeButton.click(function () {
            var serviceName = _this.serviceName;

            var url = '/api/v1/services/' + serviceName;

            _this.studio.showPopup({
                title: 'Remove Service',
                mode: 'confirm',
                message: ['remove?'],
                hasCheckBox: false,
                checkBoxMessage: '',
                callback: function (isChecked) {
                    $.ajax({
                        method: 'DELETE',
                        url: url,
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
	                                            clearInterval(studio.statusChangeInterval);
	                                            studio.hideProgress();
	                                            studio.renderServicesHome();
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
                    }).done(function (data) {
                    });
                }
            });
        });

        if (_this.summaryData.isBase || !_this.summaryData.isRemovable) {
            this.$removeButton.hide();
        }

        this.$saveButton.click(function () {
            if (_this.validateCongifs()) {
                _this.studio.showPopup({
                    title: 'Save',
                    mode: 'confirm',
                    message: ['Are you sure want to proceed with the Save?'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {
                        var data = {};
                        data = _this.config.getConfigData();

                        var configs = $('div #configs_main').find('textarea');

                        for (var i=0; i<configs.length; i++) {
                            var fileName = $(configs[i]).attr('file-name');
                            var currentData = $(configs[i]).val();

                            for (var j in _this.configData.configs) {
                                if (_this.configData.configs[j].fileName == fileName && currentData != _this.configData.configs[j].contents) {
                                    data.configs[j].configId = 0;
                                    break;
                                }
                            }
                        }

                        var url = '/api/v1/services/' + _this.serviceName + '/configuration';

                        console.log('<<< save config');
                        console.log(data);

                        $.ajax({
                            method: 'PUT',
                            url: url,
                            data: JSON.stringify(data),
                            contentType: 'application/json',
                            success: function (data) {

                                for(var i in _this.config.originConfigurationsList.configs) {
                                    var configId = _this.config.originConfigurationsList.configs[i].configId;
                                    _this.config.configurationsList.configs[i].configId = configId;
                                }
                                _this.config.originConfigurationsList = $.extend(true, {}, _this.config.configurationsList);

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
                                    _this.$startButton.removeClass('on status_running');
                                    _this.$stopButton.addClass('on status_stop');
                                    
                                    _this.studio.showPopup({
                                        title: 'Save',
                                        mode: 'alert',

                                        message: [data.response.message],
                                        hasCheckBox: false,
                                        checkBoxMessage: '',
                                        showCloseButton: false,
                                        callback: function (isChecked) {
                                            _this.studio.showProgress('saving & restarting');

                                            _this.statusChangeInterval = setInterval(function () {
                                                $.ajax({
                                                    method: 'GET',
                                                    crossDomain: true,
                                                    url: '/api/v1/services/progress/install/'+ _this.serviceName,
                                                    success: function(data){
                                                        if (data.waiting == false) {
                                                            var msg = 'done'
                                                            if(data.response.status == 'failed') {
                                                                msg = data.response.message
                                                                _this.$startButton.removeClass('on status_running');
                                                                _this.$stopButton.addClass('on status_stop');
                                                            }
                                                            else {
                                                                _this.$startButton.addClass('on status_running');
                                                                _this.$stopButton.removeClass('on status_stop');
                                                            }

                                                            clearInterval(_this.statusChangeInterval);
                                                            _this.studio.hideProgress();

                                                            _this.studio.showPopup({
                                                                title: 'Save',
                                                                mode: 'alert',

                                                                message: [msg],
                                                                hasCheckBox: false,
                                                                checkBoxMessage: '',
                                                                callback: function (isChecked) {

                                                                }
                                                            });
                                                            //_this.studio.renderServicesHome();
                                                        }
                                                    }
                                                }).done(function(data){
                                                    //console.log(data);
                                                    //_this.studio.hideProgress();
                                                    //window.location.href = '../services/Infra_Services.html';
                                                });
                                            }, 1000);
                                        }
                                    });

                                }
                            }

                        }).done(function (data) {

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
            }
        });
    };

    ServicesDetailContainer.prototype.validateCongifs = function () {
        var configs = $('div #configs_main').find('textarea');

        for (var i=0; i< configs.length; i++) {
            if (!$(configs[i]).val()) {
                this.$errorFocusTarget = $(configs[i]);
                return false;
            }
        }
        return true;
    };

    ServicesDetailContainer.prototype.getServiceStatus =  function(serviceName) {
        var _this = this;

        var url = '/api/v1/services/'+ serviceName ;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: url,
            success: function(summaryData){
                if (summaryData.runnable) {
                    if ( summaryData.status === 'stop') {
                        _this.$startButton.removeClass('on status_running');
                        _this.$stopButton.addClass('on status_stop');
                    } else {
                        _this.$startButton.addClass('on status_running');
                        _this.$stopButton.removeClass('on status_stop');
                    }
                }
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    };

    function RenderSummary(serviceName) {
        var url = '/api/v1/services/'+ serviceName ;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: url,
            success: function(summaryData){
                var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
                studio.contentContainer.renderServiceDetail(summaryData, serviceName);

            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    }

    root.Brightics.Installer.ContentContainer.ServicesDetailContainer = ServicesDetailContainer;

}).call(this);
