/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Header($parent) {
        this.$parent = $parent;
        this.createControls();
    }

    Header.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<header id="header" class="brtc-installer-header allwidth">' +
            '   <h1><a href="/"><img src="static/images/logo.png" alt=""/></a></h1>' +
            '   <nav>' +
            '       <ul class="top">' +
            '           <li class="left status"><a href="javascript:;"><i class="fa fa-refresh"></i> status</a></li>' +
            '           <li class="right admin"><a href="javascript:;"><i class="fa fa-user"></i> ' + Brightics.Installer.Studio.appData.userId + '</a></li>' +
            '           <li class="right logout"><a th:href="@{/logout}" href="/logout"><i class="fa fa-sign-out"></i> log out</a></li>' +
            '       </ul>' +
            '   </nav>' +
            '</header>' +
            '<div class="clearfix"></div>' +
            '');
        this.$parent.append(this.$mainControl);

        this.$mainControl.find('.status').click(function(){
        	var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
        	
        	if (Brightics.Installer.Studio.mode == 'INSTALLED'){
        		studio.showPopup({
                    title: 'Check status',
                    mode: 'confirm',
                    message: ['It may take a few minutes to check status.', 'Are you sure want to proceed?'],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {

                    	studio.showProgress('checking status...');
                        $.ajax({
                            method: 'GET',
                            url: '/api/v1/status',
                            contentType: 'application/json',
                            success: function (data) {

                            	_this.statusChangeInterval = setInterval(function () {
                                    $.ajax({
                                        method: 'GET',
                                        crossDomain: true,
                                        url: '/api/v1/services/progress/install',
                                        success: function(data){
                                            if (data.waiting == false) {
                                                var msg = 'done'
                                                if(data.response.status == 'failed') msg = data.response.message
                                                clearInterval(_this.statusChangeInterval);
                                                studio.hideProgress();

                                                studio.showPopup({
                                                    title: 'Check status',
                                                    mode: 'alert',
                                                    message: [msg],
                                                    hasCheckBox: false,
                                                    checkBoxMessage: '',
                                                    callback: function (isChecked) {

                                                    }
                                                });
                                                studio.renderServicesHome();
                                            }
                                        }
                                    }).done(function(data){
                                        console.log(data);
                                    });
                                }, 1000);
                            }
                        }).done(function (data) {

                        });
                    }
                });
        	}
        	else {
                studio.showPopup({
                    title: 'Check status',
                    mode: 'alert',
                    message: ["Can not check status.", "Installer's status is ['" + Brightics.Installer.Studio.mode + "']"],
                    hasCheckBox: false,
                    checkBoxMessage: '',
                    callback: function (isChecked) {

                    }
                });
        	}
        });
        
        this.$mainControl.find('.admin').click(function(){
            _this.renderChangePassword();
        });

        this.$mainControl.find('.logout').click(function(){
            window.location.href = '/login';
        });
    };

    Header.prototype.renderChangePassword = function () {
        var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
        studio.renderChangePassword();
    };

    root.Brightics.Installer.Header = Header;

}).call(this);