/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ServiceAddStep3Container ($parent) {
        this.$parent = $parent;     //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    ServiceAddStep3Container.prototype.setController = function (controller) {
        this.controller = controller;
    };

    ServiceAddStep3Container.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
    };

    ServiceAddStep3Container.prototype.createLayout = function () {
        this.createHeadArea();
        this.createContentArea();
        this.createButtonArea();
    };

    ServiceAddStep3Container.prototype.createHeadArea = function () {
        this.$header = $('' +
            '<div class="h2_title"><span>Add new Service</span></div>' +
            '<div class="location">' +
            '    <a href="#">Services</a> <img src="static/images/ico_path.gif" alt="" /> <strong>Add new Service</strong>' +
            '</div>');

        this.$parent.append(this.$header);
    };

    ServiceAddStep3Container.prototype.createContentArea = function () {
        this.$contentArea = $('<div class="cont_area  clearfix"></div>');
        this.$parent.append(this.$contentArea);

        this.createNavigator();
        this.createContent();
    };

    ServiceAddStep3Container.prototype.validateCongifs = function () {
        var configs = $('div #configs_main').find('textarea');

        for (var i=0; i< configs.length; i++) {
            if (!$(configs[i]).val()) {
                this.$errorFocusTarget = $(configs[i]);
                return false;
            }
        }

        return true;
    };

    ServiceAddStep3Container.prototype.createButtonArea = function () {
        var _this = this;

        this.$buttonArea = $('' +
            '<div class="fix_area step2_next">' +
            '    <div class="btn_wrap">' +
            '       <div class="fl_r">' +
            '           <button id="prev" class="btnBigGray"><span>Previous</span></button>' +
            '           <button id="save" class="btnBigGray"><span>Save</span></button>' +
            '           <button id="add" class="btnBigBlue"><span>Add</span></button>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$buttonArea.find('#prev').click(function(){
            _this.controller.startStep2();
        });

        this.$buttonArea.find('#save').click(function(){
            if (_this.validateCongifs()) {
                _this.getDataFormat = _this.config.getConfigData();

                var sendData = {
                    packages: []
                }
                sendData.packages.push(_this.getDataFormat);

                console.log('add service step3_sendData'); console.log(sendData);

                _this.studio.showPopup({
                    title: 'Save configuration',
                    mode: 'confirm',
                    message: ['Are you sure you want to save configurations?'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {
                        _this.studio.showProgress('Starting Save configurations...');

                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            url: '/api/v1/wizard/servicestep3',
                            data: JSON.stringify(sendData),
                            success: function (response) {
                                _this.studio.hideProgress();
                                if (response.response.status === 'success') {
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

        this.$buttonArea.find('#add').click(function(){
            _this.studio.setInstallType('service');

            if (_this.validateCongifs()) {
                _this.getDataFormat = _this.config.getConfigData();

                var sendData = {}

                console.log('add service start'); console.log(sendData);

                _this.studio.showPopup({
                    title: 'Add new service',
                    mode: 'confirm',
                    message: ['Are you sure you want to add new service?'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {
                        _this.studio.showProgress('Starting Installing service...');

                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            url: '/api/v1/wizard/servicestart/' + _this.controller.selectedPackageName,
                            data: JSON.stringify(sendData),
                            success: function (response) {
                                _this.studio.hideProgress();
                                if (response.response.status === 'success') {
                                    var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
                                    studio.renderAddNewServiceProgress();
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

        this.$parent.append(this.$buttonArea);
    };

    ServiceAddStep3Container.prototype.createNavigator = function () {
        this.$navigator = $('' +
            '<div class="tab_type05">' +
            '    <ul>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">01</span>' +
            '               <span class="tab_type01_text_off"> Choose service</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#">' +
            '               <span class="tab_num">02</span>' +
            '               <span class="tab_type01_text_off"> Choose target hosts</span>' +
            '           </a>' +
            '       </li>' +
            '       <li class="tab_01">' +
            '           <a href="#" class="on">' +
            '               <span class="tab_num">03</span>' +
            '               <span class="tab_type01_text_on"> Configurations</span>' +
            '           </a>' +
            '       </li>' +
            '    </ul>' +
            '</div>');
        this.$navigator.find('a').css({'cursor':'default'});
        this.$contentArea.append(this.$navigator);
    };

    ServiceAddStep3Container.prototype.createContent = function () {
        var _this = this;

        this.$contentBody = $('<div id="content-body"></div>');
        this.$contentArea.append(this.$contentBody);

        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: '/api/v1/wizard/servicestep3/' + _this.controller.selectedPackageName,
            success: function(response) {

                console.log(response);
                _this.getDataFormat = response.packages[0];
                var configData = _this.getDataFormat;

                _this.config = new root.Brightics.Installer.ContentContainer.ServiceDetailConfig(_this.$contentBody, configData);
                _this.config.render();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error(xhr);
            }
        })
    };

    root.Brightics.Installer.ContentContainer.ServiceAddStep3Container = ServiceAddStep3Container;

}).call(this);