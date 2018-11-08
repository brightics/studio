/**
 * Created 
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PatchProgressHome($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    PatchProgressHome.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        
        this.studio.sideMenuDisable();
        
        this.checkProgress();
        this.progress = 0;
    };

    PatchProgressHome.prototype.checkProgress = function () {
        var _this = this;

        _this.renderProgress();
        
        this.progressInterval = setInterval(function () {
            _this.renderProgress();
        }, 3000);
    };

    PatchProgressHome.prototype.initProgress = function () {
        this.stopSpinner.hide();
        this.patchSpinner.hide();
        this.startSpinner.hide();

        this.stopDone.hide();
        this.patchDone.hide();
        this.startDone.hide();

        this.stopFail.hide();
        this.patchFail.hide();
        this.startFail.hide();
    };

    PatchProgressHome.prototype.renderProgress = function () {
        var _this = this;

        $.ajax({
            method: 'GET',
            url: '/api/v1/patch/progress',
            success: function (response) {
                console.log(response);

                _this.progressBar.css({'width': response.progress+'%'});
                _this.progressValue.text(response.progress+'%');

                var stop = (response.stop).toLowerCase();
                var patch = (response.patch).toLowerCase();
                var start = (response.start).toLowerCase();
                var msg = '';

                if (response.progress === 100 || (stop == 'completed' && patch == 'completed' && start == 'completed')) {
                    clearInterval(_this.progressInterval);

                    _this.initProgress();

                    _this.stopDone.show();
                    _this.patchDone.show();
                    _this.startDone.show();
                    
                    _this.studio.setSideMenuEnable('INSTALLED');

                    if(response.response.message != '') {
                        msg = response.response.message;
                    } else {
                        msg = 'Done';
                    }
                    
                    _this.studio.hideProgress();

                    _this.studio.showPopup({
                        title: 'Patch Progress',
                        mode: 'alert',
                        message: [msg],
                        hasCheckBox: false,
                        checkBoxMessage: '',
                        callback: function (isChecked) {

                        }
                    });

                } else {
                    if (stop == 'completed') {
                        if (_this.stopDone.css('display') == 'none') {
                            _this.initProgress();
                            _this.stopDone.show();
                        }
                    } else if (stop == 'stopping') {
                        _this.stopSpinner.show();
                    } else if (stop == 'failed') {
                        _this.initProgress();
                        _this.stopFail.show();

                        clearInterval(_this.progressInterval);

                        _this.studio.showPopup({
                            title: 'Patch Progress',
                            mode: 'alert',
                            message: ['failed'],
                            hasCheckBox: false,
                            checkBoxMessage: '',
                            callback: function (isChecked) {

                            }
                        });
                    }

                    if (stop == 'completed') {
                        if (patch == 'completed') {
                            _this.patchSpinner.hide();
                            _this.patchDone.show();
                        } else  if (patch == 'patching') {
                            _this.patchSpinner.show();
                            _this.startSpinner.show();
                        } else if (patch == 'failed') {
                            _this.patchSpinner.hide();
                            _this.patchFail.show();
                            clearInterval(_this.progressInterval);

                            _this.studio.showPopup({
                                title: 'Patch Progress',
                                mode: 'alert',
                                message: ['failed'],
                                hasCheckBox: false,
                                checkBoxMessage: '',
                                callback: function (isChecked) {

                                }
                            });
                        }
                    }
                    
                    if (stop == 'completed' && patch == 'completed') {
                        if (start == 'completed') {
                            _this.startSpinner.hide();
                            _this.startDone.show();
                            clearInterval(_this.progressInterval);
                        } else  if (start == 'starting') {
                            _this.startSpinner.show();
                        } else if (start == 'failed') {
                            _this.startSpinner.hide();
                            _this.startFail.show();
                            clearInterval(_this.progressInterval);

                            _this.studio.showPopup({
                                title: 'Patch Progress',
                                mode: 'alert',
                                message: ['failed'],
                                hasCheckBox: false,
                                checkBoxMessage: '',
                                callback: function (isChecked) {

                                }
                            });
                        }
                    }
                    
                }
            },
            error : function (xhr, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    PatchProgressHome.prototype.createLayout = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="h2_title"><span>Patch Progress</span></div>' +
            '<div class="cont_area clearfix">' +
            '   <div class="row-fluid contents_center">' +
            '       <div class="h3_title"><span>Patch progress</span></div>' +


            '       <div class="contents_center_progress clearfix">' +
            '           <div class="progress-bar">' +
            '               <span style="width: 0%"></span>' +
            '           </div>' +
            '           <span di="patch-progress" class="progress-value">0%</span>' +
            '       </div>' +

            '       <div class="contents_center_progress clearfix w21">' +
            '           <table class="board-view01">' +
            '               <colgroup>' +
            '                   <col class="w50"/>' +
            '                   <col class="w14"/>' +
            '               </colgroup>' +
            '               <tbody>' +
            '                   <tr>' +
            '                       <th></th>' +
            '                       <td>' +
            '                           <span id="stop-spinner" class="icon loading small" style="margin-left: 12px; margin-top: 5px"></span>' +
            '                           <i id="stop-done" class="fa fa-check" style="display:none; color: #86BFA0; font-size: 20px; padding-left: 6px; padding-top: 2px"></i>' +
            '                           <i id="stop-fail" class="fa fa-exclamation" style="padding-left: 12px; padding-top: 3px; display:none; color: red; font-size: 20px"></i>' +
            '                       </td>' +
            '                       <td class="left">' +
            '                           <span class="stop-service">1. Stop Service</span>' +
            '                       </td>' +
            '                   </tr>' +
            '                   <tr>' +
            '                       <th></th>' +
            '                       <td>' +
            '                           <span id="patch-spinner" class="icon loading small" style="margin-left: 12px; margin-top: 5px"></span>' +
            '                           <i id="patch-done" class="fa fa-check" style="display:none; color: #86BFA0; font-size: 20px; padding-left: 6px; padding-top: 2px"></i>' +
            '                           <i id="patch-fail" class="fa fa-exclamation" style="padding-left: 12px; padding-top: 3px; display:none; color: red; font-size: 20px"></i>' +
            '                       </td>' +
            '                       <td class="left">' +
            '                           <span class="patch-service">2. Patch Service</span>' +
            '                       </td>' +
            '                   </tr>' +
            '                   <tr>' +
            '                       <th></th>' +
            '                       <td>' +
            '                           <span id="start-spinner" class="icon loading small" style="margin-left: 12px; margin-top: 5px"></span>' +
            '                           <i id="start-done" class="fa fa-check" style="display:none; color: #86BFA0; font-size: 20px; padding-left: 6px; padding-top: 2px"></i>' +
            '                           <i id="start-fail" class="fa fa-exclamation" style="padding-left: 12px; padding-top: 3px; display:none; color: red; font-size: 20px"></i>' +
            '                       </td>' +
            '                       <td class="left">' +
            '                           <span class="start-service">3. Start Service</span>' +
            '                       </td>' +
            '                   </tr>' +
            '               </tbody>' +
            '           </table>' +
            '       </div>' +

            '       <div class="right patch-log"><button class="btnBigGray p40"><span>Console Log</span></button></div>' +

            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.progressBar = this.$mainControl.find('.progress-bar span');
        this.progressValue = this.$mainControl.find('.progress-value');

        this.stopService = this.$mainControl.find('.stop-service');
        this.patchService = this.$mainControl.find('.patch-service');
        this.startService = this.$mainControl.find('.start-service');

        this.logButton =  this.$mainControl.find('button');

        this.logButton.click(function(){
            _this.logButton.blur();
            $.ajax({
                method: 'GET',
                crossDomain: true,
                url: '/api/v1/logs/provisioning',
                success: function (response) {
                    var $content = $('<div></div>');
                    var log = (response.log).split('\n');

                    for (var i in log) {
                        var $aTag = $('' +
                            '<div style="display: flex; white-space: pre; height: 20px; margin-top: 3px">' +
                            '       <span style="cursor:text">'+log[i]+'</span>' +
                            '</div>');
                        $content.append($aTag);
                    }
                    _this.studio.showPopup({
                        title: 'Patch Progress',
                        mode: 'log',
                        message: [],
                        hasCheckBox: false,
                        checkBoxMessage: '',
                        callback: function (isChecked) {

                        },
                        content: $content
                    });

                },
                error : function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        });

        this.stopSpinner = this.$mainControl.find('#stop-spinner');
        this.patchSpinner = this.$mainControl.find('#patch-spinner');
        this.startSpinner = this.$mainControl.find('#start-spinner');

        this.stopDone = this.$mainControl.find('#stop-done');
        this.patchDone = this.$mainControl.find('#patch-done');
        this.startDone = this.$mainControl.find('#start-done');

        this.stopFail = this.$mainControl.find('#stop-fail');
        this.patchFail = this.$mainControl.find('#patch-fail');
        this.startFail = this.$mainControl.find('#start-fail');
    };

    root.Brightics.Installer.ContentContainer.PatchProgressHome = PatchProgressHome;

}).call(this);
