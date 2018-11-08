/**
 * Created 
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeAssistantProgressHome($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UpgradeAssistantProgressHome.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        
        this.studio.sideMenuDisable();
        
        this.checkProgress();
        this.progress = 0;
    };

    UpgradeAssistantProgressHome.prototype.checkProgress = function () {
        var _this = this;

        _this.renderProgress();
        
        this.progressInterval = setInterval(function () {
            _this.renderProgress();
        }, 3000);
    };

    UpgradeAssistantProgressHome.prototype.initProgress = function () {
        this.stopSpinner.hide();
        this.stopDone.hide();
        this.stopFail.hide();
    };

    UpgradeAssistantProgressHome.prototype.renderProgress = function () {
        var _this = this;

        $.ajax({
            method: 'GET',
            url: '/api/v1/upgrade/progress/prepare',
            success: function (response) {
                console.log(response);

                _this.progressBar.css({'width': response.progress+'%'});
                _this.progressValue.text(response.progress+'%');

                var stop = (response.stop).toLowerCase();
                var msg = '';

                if (response.progress === 100 || stop == 'completed') {
                    clearInterval(_this.progressInterval);

                    _this.initProgress();

                    _this.stopDone.show();
                    
                    _this.studio.setSideMenuEnable('INSTALLED');

                    if(response.response.message != '') {
                        msg = response.response.message;
                    } else {
                        msg = 'Done';
                    }
                    
                    _this.studio.hideProgress();

                    _this.studio.showPopup({
                        title: 'Upgrade Assistant',
                        mode: 'alert',
                        message: [msg],
                        hasCheckBox: false,
                        checkBoxMessage: '',
                        callback: function (isChecked) {

                        }
                    });

                } else {
                    if (stop == 'stopping') {
                        _this.stopSpinner.show();
                    } else if (stop == 'failed') {
                        _this.initProgress();
                        _this.stopFail.show();

                        clearInterval(_this.progressInterval);

                        _this.studio.showPopup({
                            title: 'Upgrade Assistant',
                            mode: 'alert',
                            message: ['failed'],
                            hasCheckBox: false,
                            checkBoxMessage: '',
                            callback: function (isChecked) {

                            }
                        });
                    }

                }
            },
            error : function (xhr, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    UpgradeAssistantProgressHome.prototype.createLayout = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="h2_title"><span>Upgrade Assistant</span></div>' +
            '<div class="cont_area clearfix">' +
            '   <div class="row-fluid contents_center">' +
            '       <div class="h3_title"><span>Prepare to upgrade</span></div>' +


            '       <div class="contents_center_progress clearfix">' +
            '           <div class="progress-bar">' +
            '               <span style="width: 0%"></span>' +
            '           </div>' +
            '           <span di="upgradeassistant-progress" class="progress-value">0%</span>' +
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
            '                           <i id="save-done" class="fa fa-check" style="color: #86BFA0; font-size: 20px; padding-left: 6px; padding-top: 2px"></i>' +
            '                       </td>' +
            '                       <td class="left">' +
            '                           <span class="save-service">1. Save Installed Info.</span>' +
            '                       </td>' +
            '                   </tr>' +
            '                   <tr>' +
            '                       <th></th>' +
            '                       <td>' +
            '                           <span id="stop-spinner" class="icon loading small" style="margin-left: 12px; margin-top: 5px"></span>' +
            '                           <i id="stop-done" class="fa fa-check" style="display:none; color: #86BFA0; font-size: 20px; padding-left: 6px; padding-top: 2px"></i>' +
            '                           <i id="stop-fail" class="fa fa-exclamation" style="padding-left: 12px; padding-top: 3px; display:none; color: red; font-size: 20px"></i>' +
            '                       </td>' +
            '                       <td class="left">' +
            '                           <span class="stop-service">2. Stop Service</span>' +
            '                       </td>' +
            '                   </tr>' +
            '               </tbody>' +
            '           </table>' +
            '       </div>' +

            '       <div class="right upgradeassistant-log"><button class="btnBigGray p40"><span>Console Log</span></button></div>' +

            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.progressBar = this.$mainControl.find('.progress-bar span');
        this.progressValue = this.$mainControl.find('.progress-value');

        this.saveService = this.$mainControl.find('.save-service');
        this.stopService = this.$mainControl.find('.stop-service');

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
                        title: 'Prepare to upgrade',
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
        this.stopDone = this.$mainControl.find('#stop-done');
        this.stopFail = this.$mainControl.find('#stop-fail');
    };

    root.Brightics.Installer.ContentContainer.UpgradeAssistantProgressHome = UpgradeAssistantProgressHome;

}).call(this);
