/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UninstallHomeContainer($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UninstallHomeContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderUninstallHome();
        this.bindButtonEvent();
    };

    UninstallHomeContainer.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="h2_title"><span>Uninstall</span></div>' +
            '<div class="location">' +
            '    <a href="#">Installer</a> <img src="static/images/ico_path.gif" alt="" /> <strong>Uninstall</strong>' +
            '</div>' +
            '<div class="cont_area clearfix">' +
            '   <div class="row-fluid rowlast mt22">' +
            '       <div class="h3_title clearfix"><span>Installed service</span></div>' +
            '       <div class="board mt10"></div>' +
            '       <div class="txt_gray mt65 tac"><span><img src="static/images/des_info.gif"> All Service installed will be deleted.</span></div>' +
            '       <div class="btn_wrap">' +
            '           <div class="tac">' +
            '               <button class="btnBigGray p40"><span>Uninstall</span></button>' +
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

        //var leftInit = $(".cont_area").offset().left;
        //var left = 251;
        //$(".fix_area").offset({
        //    left: leftInit
        //});
        //$(".left_line").offset({
        //    left: left
        //});
        //
        //$(window).scroll(function (event) {
        //
        //    var leftInit1 = $(".cont_area").offset().left;
        //    $(".fix_area").offset({
        //        left: leftInit1
        //    });
        //    $(".left_line").offset({
        //        left: left
        //    });
        //});
        //
        //$(window).resize(function (event) {
        //
        //    var leftInit1 = $(".cont_area").offset().left;
        //    $(".fix_area").offset({
        //        left: leftInit1
        //    });
        //    $(".left_line").offset({
        //        left: left
        //    });
        //});
    };

    UninstallHomeContainer.prototype.renderUninstallHome = function () {
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

    UninstallHomeContainer.prototype.bindButtonEvent = function () {
        var _this = this;

        this.$buttonArea.find('button').click(function(){
            _this.$buttonArea.find('button').blur();
            _this.studio.showPopup({
                title: 'Uninstall',
                mode: 'confirm',
                message: ['Are you sure want to proceed with the Uninstall?'],
                hasCheckBox: false,
                checkBoxMessage: '',
                callback: function (isChecked) {
                    $.ajax({
                        method: 'DELETE',
                        crossDomain: true,
                        url: '/api/v1/wizard/uninstall',
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
	                            _this.studio.renderUninstallProgress();
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

    UninstallHomeContainer.prototype.fillServiceList = function ($parent) {
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

    UninstallHomeContainer.prototype.renderService = function ($parent, serviceList) {
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

    root.Brightics.Installer.ContentContainer.UninstallHomeContainer = UninstallHomeContainer;

}).call(this);