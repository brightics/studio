/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UninstallProgressContainer($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UninstallProgressContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();

        //sidebar ��Ȱ��ȭ
        this.studio.sideMenuServiceDisable();

        this.checkProgress();
        this.progress = 0;
    };

    UninstallProgressContainer.prototype.checkProgress = function () {
        var _this = this;

        this.progressInterval = setInterval(function () {
            _this.renderProgress();
        }, 3000);
    };

    UninstallProgressContainer.prototype.initProgress = function () {
        this.stopSpinner.hide();
        this.uninstallSpinner.hide();

        this.stopDone.hide();
        this.uninstallDone.hide();

        this.stopFail.hide();
        this.uninstallFail.hide();
    };

    UninstallProgressContainer.prototype.renderProgress = function () {
        var _this = this;

        $.ajax({
            method: 'GET',
            url: '/api/v1/services/progress/uninstall',
            success: function (response) {
                console.log(response);

                _this.progressBar.css({'width': response.progress+'%'});
                _this.progressValue.text(response.progress+'%');

                var  stop = (response.stop).toLowerCase();
                var  uninstall = (response.uninstall).toLowerCase();
                var msg = '';

                if (response.progress === 100 || (stop == 'completed' && uninstall == 'completed')) {
                    clearInterval(_this.progressInterval);

                    _this.initProgress();

                    _this.stopDone.show();
                    _this.uninstallDone.show();

                    _this.studio.setSideMenuEnable('UNINSTALLED');

                    if(response.response.message != '') {
                        msg = response.response.message;
                    } else {
                        msg = 'Done';
                    }

                    _this.studio.showPopup({
                        title: 'Uninstall Progress',
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
                        //_this.initProgress();
                        _this.stopSpinner.show();

                    } else if (stop == 'failed') {
                        _this.initProgress();
                        _this.stopFail.show();

                        clearInterval(_this.progressInterval);

                        _this.studio.showPopup({
                            title: 'Uninstall Progress',
                            mode: 'alert',
                            message: ['failed'],
                            hasCheckBox: false,
                            checkBoxMessage: '',
                            callback: function (isChecked) {

                            }
                        });

                    }

                    if (stop == 'completed') {
                        if (uninstall == 'completed') {
                            _this.uninstallSpinner.hide();
                            _this.uninstallDone.show();
                            clearInterval(_this.progressInterval);
                        } else  if (uninstall == 'uninstalling') {
                            _this.uninstallSpinner.show();
                        } else if (uninstall == 'failed') {
                            _this.uninstallSpinner.hide();
                            _this.uninstallFail.show();
                            clearInterval(_this.progressInterval);

                            _this.studio.showPopup({
                                title: 'Uninstall Progress',
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

    UninstallProgressContainer.prototype.createLayout = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="h2_title"><span>Uninstall</span></div>' +
            '<div class="location">' +
            '    <a href="#">Installer</a> <img src="static/images/ico_path.gif" alt="" /> <strong>Uninstall</strong>' +
            '</div>' +
            '<div class="cont_area clearfix">' +
            '   <div class="row-fluid contents_center">' +
            '       <div class="h3_title"><span>UnInstall progress</span></div>' +


            '       <div class="contents_center_progress clearfix">' +
            '           <div class="progress-bar">' +
            '               <span style="width: 0%"></span>' +
            '           </div>' +
            '           <span di="uninstall-progress" class="progress-value">0%</span>' +
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
            //'                           <i id="stop-spinner" class="fa fa-circle-o-notch fa-spin fa-2x" style="display:block; color: #86BFA0; font-size: 30px"></i>' +
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
            '                           <span id="uninstall-spinner" class="icon loading small" style="margin-left: 12px; margin-top: 5px"></span>' +
            //'                           <i id="uninstall-spinner"class="fa fa-circle-o-notch fa-spin fa-2x" style="display:none; color: #86BFA0; font-size: 30px"></i>' +
            '                           <i id="uninstall-done" class="fa fa-check" style="display:none; color: #86BFA0; font-size: 20px; padding-left: 6px; padding-top: 2px"></i>' +
            '                           <i id="uninstall-fail" class="fa fa-exclamation" style="padding-left: 12px; padding-top: 3px; display:none; color: red; font-size: 20px"></i>' +
            '                       </td>' +
            '                       <td class="left">' +
            '                           <span class="uninstall-service">2. Uninstall Service</span>' +
            '                       </td>' +
            '                   </tr>' +
            //'                   <tr>' +
            //'                       <th></th>' +
            //'                       <td></td>' +
            //'                       <td class="right">' +
            //'                           <div class="uninstall-log"><button class="btnBigGray p40"><span>Uninstall</span></button></div>' +
            //'                       </td>' +
            //'                   </tr>' +
            '               </tbody>' +
            '           </table>' +
            '       </div>' +

            '       <div class="right uninstall-log"><button class="btnBigGray p40"><span>Console Log</span></button></div>' +

            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.progressBar = this.$mainControl.find('.progress-bar span');
        this.progressValue = this.$mainControl.find('.progress-value');

        this.stopService = this.$mainControl.find('.stop-service');
        this.uninstallService = this.$mainControl.find('.uninstall-service');

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
                                //'   <a style="text-decoration: underline; color:blue" target="_blank" href="api/v1/logs/'+hostName+'/'+packageName+'/'+logName+'/file?path='+response.logFiles[i]+'">' +
                            '       <span style="cursor:text">'+log[i]+'</span>' +
                                //'   </a>' +
                            '</div>');
                        $content.append($aTag);
                    }
                    _this.studio.showPopup({
                        title: 'Uninstall Progress',
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
        this.uninstallSpinner = this.$mainControl.find('#uninstall-spinner');

        this.stopDone = this.$mainControl.find('#stop-done');
        this.uninstallDone = this.$mainControl.find('#uninstall-done');

        this.stopFail = this.$mainControl.find('#stop-fail');
        this.uninstallFail = this.$mainControl.find('#uninstall-fail');
    };

    root.Brightics.Installer.ContentContainer.UninstallProgressContainer = UninstallProgressContainer;

}).call(this);
