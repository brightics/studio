/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeAssistantHomeContainer($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UpgradeAssistantHomeContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderUninstallHome();
        this.bindButtonEvent();
    };

    UpgradeAssistantHomeContainer.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="h2_title"><span>Upgrade Assistant</span></div>' +
            '<div class="location">' +
            '    <a href="#">Installer</a> <img src="static/images/ico_path.gif" alt="" /> <strong>Upgrade Assistant</strong>' +
            '</div>' +
            '<div class="cont_area clearfix">' +
            '   <div class="row-fluid rowlast mt22">' +
            '       <div class="h3_title clearfix"><span>Installed service</span></div>' +
            '       <div class="board mt10"></div>' +
            '       <div class="h3_title clearfix mt35"><span>Upgrade Steps</span></div>' +
            '       <div class="mt22 contents_center">' +
            '           <div class="contents_center_progress clearfix w52" style="margin: 0px auto 0px;">' +
            '               <table class="board-view01">' +
            '                   <colgroup>' +
            '                       <col class="w50"/>' +
            '                       <col class="w14"/>' +
            '                   </colgroup>' +
            '                   <tbody>' +
            '                       <tr>' +
            '                           <th></th>' +
            '                           <td/>' +
            '                           <td class="left txt_gray mt22" style="font-weight: bold;">' +
            '                               <span>[STEP1] Click the button below to prepare to upgrade.</span>' +
            '                           </td>' +
            '                       </tr>' +
            '                       <tr>' +
            '                           <th></th>' +
            '                           <td/>' +
            '                           <td class="left txt_gray mt12">' +
            '                               <span>[STEP2] Shutdown BrighticsInstaller (Old Ver.)</span>' +
            '                           </td>' +
            '                       </tr>' +
            '                       <tr>' +
            '                           <th></th>' +
            '                           <td/>' +
            '                           <td class="left txt_gray mt12">' +
            '                               <span>[STEP3] Startup BrighticsInstaller (New Ver.)</span></span>' +
            '                           </td>' +
            '                       </tr>' +
            '                       <tr>' +
            '                           <th></th>' +
            '                           <td/>' +
            '                           <td class="left txt_gray mt12">' +
            '                               <span>[STEP4] Upgrade to Brightics</span></span>' +
            '                           </td>' +
            '                       </tr>' +
            '                   </tbody>' +
            '               </table>' +
            '           </div>' +
            '       </div>' +
            '       <div class="txt_gray mt35 tac"><span><img src="static/images/des_info.gif"> All Service installed will be stopped.</span></div>' +
            '       <div class="btn_wrap">' +
            '           <div class="tac">' +
            '               <button class="btnBigGray p40"><span>Prepare to upgrade</span></button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);
        this.$board = this.$mainControl.find('.board');
        this.$buttonArea = this.$mainControl.find('.btn_wrap');

        if(Brightics.Installer.Studio.appData.userId != 'admin'){
        	this.$buttonArea.find('button').addClass('disabled');
        }
        
        this.$mainControl.hide();

    };

    UpgradeAssistantHomeContainer.prototype.renderUninstallHome = function () {
        var _this = this;

        var $table = $('<table class="board-list"></table>');
        var $colGroup = $('' +
            '<colgroup>' +
            '   <col />' +
            '   <col />' +
            '</colgroup>');

        $table.append($colGroup);

        var $thead = $('' +
            '<thead>' +
            '   <tr>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Service</th>' +
            '       <th class="center">Status</th>' +
            '   </tr>' +
            '</thead>');
        $table.append($thead);

        this.$tbody = $('<tbody></tbody>');
        $table.append(this.$tbody);

        this.$mainControl.find('.board').append($table);
        this.fillServiceList(this.$board);
    };

    UpgradeAssistantHomeContainer.prototype.bindButtonEvent = function () {
        var _this = this;

        this.$buttonArea.find('button').click(function(){
            _this.$buttonArea.find('button').blur();
            _this.studio.showPopup({
                title: 'Upgrade Assistant',
                mode: 'confirm',
                message: ['Are you sure want to prepare to upgrade?'],
                hasCheckBox: false,
                checkBoxMessage: '',
                callback: function (isChecked) {
                    $.ajax({
                        method: 'POST',
                        crossDomain: true,
                        url: '/api/v1/upgrade/prepare',
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
	                            console.log(data);
	                            _this.studio.renderUpgradeAssistantProgress();
                            }
                        }
                    }).done(function(data){

                    }).fail(function(data){
                        console.error(data);
                    });
                }
            });
        });
    };

    UpgradeAssistantHomeContainer.prototype.fillServiceList = function ($parent) {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/services',
            success: function(data){
                _this.$mainControl.show();
                _this.renderService($parent, data.packages);
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    };

    UpgradeAssistantHomeContainer.prototype.renderService = function ($parent, serviceList) {
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
                '   <td class="left pl20" style="border-right: 1px solid #f0f0f0">' +
                '        <div class="line_body clearfix">' +
                '           <span>'+serviceList[i].packageName+'</span>' +
                '       </div>' +
                '   </td>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <div class="'+statusClass+'"><span class="Status-value ">'+serviceList[i].status+'</span></div>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            $bodyComponent.find('.Status-bar').css({'margin-left': 'auto', 'margin-right': 'auto'});

            $bodyComponent.addClass('service-board-list-body-'+serviceList[i].packageName);
            this.$tbody.append($bodyComponent);
        }
    };

    root.Brightics.Installer.ContentContainer.UpgradeAssistantHomeContainer = UpgradeAssistantHomeContainer;

}).call(this);