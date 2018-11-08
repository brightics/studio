/**
 * Created by 
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    
    function PatchmanagerHomeContainer($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    PatchmanagerHomeContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderHome();
        this.renderCheckButton();
        this.renderUpdateButton();
    };

    PatchmanagerHomeContainer.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="h2_title"><span>Patch Manager</span></div>' +
            '<div class="cont_area clearfix">' +
            '    <div class="row-fluid rowlast mt22">' +
            '       <div>' +
            '           <div class="board">' +
            '           </div>' +
            '       </div>' +
            '       <div class="btn_wrap">' +
            '           <div class="fl_r">' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);
        this.$board = this.$mainControl.find('.board');
        this.$buttonArea = this.$mainControl.find('.fl_r');

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

    PatchmanagerHomeContainer.prototype.renderHome = function () {
        var _this = this;

        var $table = $('<table class="board-list"></table>');
        var $colGroup = $('' +
            '<colgroup>' +
            '   <col />' +
            '   <col class="w21"/>' +
            '   <col class="w21"/>' +
            '   <col class="w15"/>' +
            '   <col class="w15"/>' +
            '   <col class="w8"/>' +
            '</colgroup>');

        $table.append($colGroup);

        var $thead = $('' +
            '<thead>' +
            '   <tr>' +
            '       <th class="center tdlt">Service</th>' +
            '       <th class="center tdlt">Component</th>' +
            '       <th class="center tdlt">Status</th>' +
            '       <th class="center tdlt">Installed</th>' +
            '       <th class="center tdlt">Latest</th>' +
            '       <th class="center">Patch</th>' +
            '   </tr>' +
            '</thead>');
        $table.append($thead);

        this.$tbody = $('<tbody id="patchmanager_list"></tbody>');
        $table.append(this.$tbody);

        this.$mainControl.find('.board').append($table);
        this.fillServiceList(this.$board);

    };

    PatchmanagerHomeContainer.prototype.renderCheckButton = function () {
        var _this = this;

        this.$versionCheckButton = $('<button class="btnBigGray"><span>Check new version</span></button>');

        this.$buttonArea.append(this.$versionCheckButton);

        this.$versionCheckButton.click(function(){
        	_this.updateServiceList(this.$board);
        });
        
        if(Brightics.Installer.Studio.appData.userId != 'admin'){
        	_this.$versionCheckButton.addClass('disabled');
        }
    };
    
    PatchmanagerHomeContainer.prototype.renderUpdateButton = function () {
        var _this = this;

        this.$startPatchButton = $('<button class="btnBigGray"><span>Start Patch</span></button>');

        this.$startPatchButton.addClass('disabled');

        this.$buttonArea.append(this.$startPatchButton);

        this.$startPatchButton.click(function(){
            _this.$startPatchButton.blur();
            _this.studio.showPopup({
                title: 'Patch',
                mode: 'confirm',
                message: ['Are you sure want to proceed with the Patch?'],
                hasCheckBox: false,
                checkBoxMessage: '',
                callback: function (isChecked) {
                    _this.studio.showProgress('Starting Patch...');

                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        url: '/api/v1/patch/start',
                        success: function (data) {
                            _this.studio.hideProgress();

		                	if (data.response.status == 'success'){
		    	                _this.studio.contentContainer.renderPatchProgress();
                            } else if(data.response.status == 'failed'){
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

                        }
                    });
                	
                }
            });
        });
    };

    PatchmanagerHomeContainer.prototype.fillServiceList = function ($parent) {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/patch/services',
            success: function(data){
                var _data = data;
                _this.renderService($parent, _data);
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
    };
    
    PatchmanagerHomeContainer.prototype.updateServiceList = function ($parent) {
        var _this = this;

        _this.studio.showProgress('Check new version...');
        
        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/patch/check',
            success: function(data){
            	_this.studio.hideProgress();
            	var _data = data;
            	
            	if(data.response == undefined){
	                var $serviceList = $('#patchmanager_list > tr');
	                $serviceList.each(function (index) {
	                    $(this).remove();
	                });
	                
	                _this.renderService($parent, _data);
            	}
            	else if(data.response.status == 'failed'){
	                _this.studio.showPopup({
	                    title: 'Error',
	                    mode: 'alert',
	                    message: [_data.response.message],
	                    hasCheckBox: false,
	                    checkBoxMessage: '',
	                    callback: function (isChecked) {
	
	                    }
	                });
            	}
            }
        }).done(function(data){

        }).fail(function(data){
            console.error(data);
        });
        
    };

    PatchmanagerHomeContainer.prototype.renderService = function ($parent, serviceList) {
        var _this = this;
        
        for (var i in serviceList) {
            var status = (serviceList[i].status).toLocaleLowerCase();
            var statusClass = 'Status-bar ';
            var statusText = ''; 
            var installedVersion = serviceList[i].installedVersion;
            var patchIcon = '';
            var serviceName = '';
            
            if (status === 'start'|| status === 'running') {
                statusClass += 'status_running';
                statusText = 'RUNNING';
            } else if (status === 'warning') {
                statusClass += 'status_warning';
                statusText = 'WARNING';
            } else if (status === 'stop') {
                statusClass += 'status_stop';
                statusText = 'STOP';
            } else if (status === 'error') {
                statusClass += 'status_error';
                statusText = 'ERROR';
            }
            
            if (installedVersion === '') installedVersion = 'release';
            if (serviceList[i].patch){
            	patchIcon = '<i id="update" class="fa fa-check" style="color: #86BFA0; font-size: 20px; padding-left: 6px; padding-top: 2px"></i>';
            	_this.$startPatchButton.removeClass('disabled');
            }
            
            if (i%2==0){
            	serviceName = '' +
            	'<td rowspan="2" class="tdlt">' +
                '    <div class="line_body clearfix">' +
                '        <span>'+serviceList[i].patchServiceName+'</span>' +
                '    </div>' +
                '</td>';
            }

            var $bodyComponent = $('' +
                '<tr>' + serviceName +
                '   <td class="tdlt">' +
                '       <div class="line_body clearfix">' +
                '           <span>'+serviceList[i].patchComponentName+'</span>' +
                '       </div>' +
                '   </td>' +
                '   <td class="tdlt">' +
                '       <div class="line_body clearfix">' +
                '           <div class="'+statusClass+'"><span class="Status-value ">'+statusText+'</span></div>' +
                '       </div>' +
                '   </td>' +
                '   <td class="tdlt">' +
                '       <div class="line_body clearfix">' +
                '           <span>'+installedVersion+'</span>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            var $toggle = $('' +
        		'<td class="center" style="border-right: 1px solid #f0f0f0">' +
                '   <div class="line_body clearfix">' +
                '       <span>'+serviceList[i].latestVersion+'</span>' +
                '   </div>' +
                '</td>' + 
                '<td class="center" style="border-right: 1px solid #f0f0f0">' + patchIcon +
                '</td>');

            $bodyComponent.append($toggle);

            $bodyComponent.addClass('service-board-list-body-'+serviceList[i].patchComponentName);
            this.$tbody.append($bodyComponent);
        }
    };

    root.Brightics.Installer.ContentContainer.PatchmanagerHomeContainer = PatchmanagerHomeContainer;

}).call(this);