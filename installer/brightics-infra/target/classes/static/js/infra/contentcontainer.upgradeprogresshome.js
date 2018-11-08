/**
 * Created by hjoo88.kim on 2016-05-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeProgressHome($parent) {
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));

        this.isDone = false;

        this.init($parent);

        this.initTitle();
        this.initContentArea();

        //this.renderPrepareTable();
        this.renderServicesTab();

        this.initProcessingViewer();
    }

    UpgradeProgressHome.prototype.init = function ($parent) {
        this.STATUS = {
            failed: {
                statusClass: 'status_error',
                txtClass: 'txt_error',
                label: 'Fail'
            },
            installing: {
                statusClass: '',
                txtClass: '',
                label: 'Installing'
            },
            preparing: {
                statusClass: '',
                txtClass: '',
                label: 'Preparing'
            },
            completed: {
                statusClass: '',
                txtClass: 'txt_blue',
                label: 'Complete'
            }
        };

        this.$prepareTable = $('' +
            ' <table class="board-list" style="margin-bottom: 20px; border-bottom: 1px #cccccc solid">' +
            '   <colgroup>' +
            '     <col class="w21" />' +
            '     <col />' +
            '     <col class="w21" />' +
            '   </colgroup>' +
            '   <thead>' +
            '     <tr>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Hosts</th>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Progress</th>' +
            '       <th class="center">Status</th>' +
            '     </tr>' +
            '   </thead>' +
            '   <tbody>' +
            '   </tbody>' +
            ' </table>');


        this.$servicesTable = $('' +
            ' <table class="board-list" style="border-top: 1px #cccccc solid">' +
            '   <colgroup>' +
            '     <col class="w21" />' +
            '     <col />' +
            '     <col class="w21" />' +
            '   </colgroup>' +
            '   <thead>' +
            '     <tr>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Service</th>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Progress</th>' +
            '       <th class="center">Status</th>' +
            '     </tr>' +
            '   </thead>' +
            '   <tbody>' +
            '   </tbody>' +
            ' </table>');

        this.$packageTable = $('' +
            ' <table class="board-list">' +
            '   <colgroup>' +
            '     <col class="w11" />' +
            '     <col />' +
            '     <col class="w14" />' +
            '     <col class="w18" />' +
            '   </colgroup>' +
            '   <thead>' +
            '     <tr>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Host</th>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Progress</th>' +
            '       <th class="center" style="border-right: 1px solid #d9d9d9">Status</th>' +
            '       <th class="center">Log</th>' +
            '     </tr>' +
            '   </thead>' +
            '   <tbody>' +
            '   </tbody>' +
            ' </table>');

        this.$parent = $parent;
    };

    UpgradeProgressHome.prototype.initTitle = function () {
        this.$titleArea = $('' +
            ' <div class="h2_title"><span>Upgrade Progress</span></div>' +
            ' <div class="location">' +
            '   <a href="#">Upgrade Assistant</a> <img src="static/images/ico_path.gif" alt="" /> <strong>Upgrade Progress</strong>' +
            ' </div>');
        this.$parent.append(this.$titleArea);
    };

    UpgradeProgressHome.prototype.initContentArea = function () {
        this.$contentArea = $('<div class="cont_area clearfix"></div>');
        this.$parent.append(this.$contentArea);

        this.initTabs();
        this.initTabPageContainer();

        this.addEventConsoleLogButton();
    };

    UpgradeProgressHome.prototype.initTabs = function () {
        var _this = this;
        var $tabContainer = $('' +
            '<div class="tab_type02 mt22">' +
            '  <button class="btn_left btnTabArrow"><img src="static/images/tab_prev.png"/></button>' +
            '  <ul></ul>' +
            '  <button class="btn_right btnTabArrow"><img src="static/images/tab_next.png"/></button>' +
            '</div>');
        this.$contentArea.append($tabContainer);

        var $tabLeftButton = $tabContainer.find('button.btn_left.btnTabArrow');
        var $tabRightButton = $tabContainer.find('button.btn_right.btnTabArrow');

        this.$tabLabelArea = $tabContainer.find('ul');
        this.tabIndex = 0;
        this.tabLabels = [];
        this.selectedTabLabel = 'All';

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/services/progress/install',
            success: function (response) {
                // var response = document.infra['/api/v1/services/progress/install'];
                var $servicesTab = addTab.call(_this, 'All');
                $servicesTab.addClass('on');
                _this.tabLabels.push('All');

                for (var i in response.services) {
                    addTab.call(_this, response.services[i].packageName);
                    _this.tabLabels.push(response.services[i].packageName);
                }

                $tabLeftButton.click(function () {
                    _this.arrangeTab(_this.tabIndex - 1);
                });

                $tabRightButton.click(function () {
                    _this.arrangeTab(_this.tabIndex + 1);
                });
            },
            error : function (xhr, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    function addTab(name) {
        var _this = this;
        var $tab = $('<li class="tab_01"><a href="javascript:;">' + name + '</a></li>');
        _this.$tabLabelArea.append($tab);

        $tab.find('a').click(function() {
            var tabList = _this.$tabLabelArea.find('li');
            var thisTab = $(this).parent('li');

            $.each(tabList, function(index, tab) {
                $(tab).removeClass('on');
            });
            thisTab.addClass('on');
            _this.selectedTabLabel = $(this).text();

//            if (tabList.index(thisTab) == 0) {
            if (name.toLowerCase() == 'all') {
                _this.renderServicesTab();
            } else {
                _this.renderPackageTab(name);
            }
        });

        return $tab;
    };

    UpgradeProgressHome.prototype.arrangeTab = function (index) {
        if (index + 8 > this.tabLabels.length) {
            index = this.tabLabels.length - 8;
        }

        if (index < 0) {
            index = 0;
        }

        this.$tabLabelArea.empty();

        for (var i = index; i < index + 8 && i < this.tabLabels.length; i++) {
            var $tab = addTab.call(this, this.tabLabels[i]);

            if (this.selectedTabLabel == this.tabLabels[i]) {
                $tab.addClass('on');
            }
        }

        this.tabIndex = index;
    };

    UpgradeProgressHome.prototype.initTabPageContainer = function () {
        var tabPageTemplate =
            ' <div class="row-fluid rowlast">' +
            '   <div>' +
            '     <div class="board">' +
            '     </div>' +
            '   </div>' +
            '   <div class="btn_wrap">' +

            //'     <div class="fl_l" style="margin-top: 10px">estimated time :  ' +
            //'     </div>' +
            //'     <div id="estimated-time" style="margin-top: 10px">' +
            //'     </div>' +

            '     <div class="fl_r">' +
            '       <button class="btnBigGray"><span>Console Log</span></button>' +
            '     </div>' +



            '   </div>' +
            ' </div>';

        this.$tabPageContainer = $(tabPageTemplate);
        this.$tabPageBoard = this.$tabPageContainer.find('div.board');
        this.$consoleLogButton = this.$tabPageContainer.find('button.btnBigGray');

        this.$estimatedTime = this.$tabPageContainer.find('#estimated-time');

        this.$contentArea.append(this.$tabPageContainer);
    };

    UpgradeProgressHome.prototype.addEventConsoleLogButton = function () {
        var _this = this;
        this.$consoleLogButton.click(function () {
            _this.$consoleLogButton.blur();
            $.ajax({
                method: 'GET',
                crossDomain: true,
                url: '/api/v1/logs/provisioning',
                success: function (response) {
                    var $content = $('<div></div>');
                    var log = (response.log).split('\n');

                    for (var i in log) {
                        var $aTag = $('' +
                            '<div style="display: flex; white-space: pre; height: 20px; margin-top: 3px; cursor:text;">' +
                                //'   <a style="text-decoration: underline; color:blue" target="_blank" href="api/v1/logs/'+hostName+'/'+packageName+'/'+logName+'/file?path='+response.logFiles[i]+'">' +
                            '       <span>'+log[i]+'</span>' +
                            //'   </a>' +
                            '</div>');
                        $content.append($aTag);
                    }
                    _this.studio.showPopup({
                        // width: 1600,
                        // height: 800,
                        title: 'Upgrade Progress',
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
    };

    UpgradeProgressHome.prototype.renderPrepareTable = function () {

    };

    UpgradeProgressHome.prototype.renderServicesTab = function () {
        var _this = this;

        this.renderServicesTable();

        clearInterval(this.servicesTabInterval);
        clearInterval(this.packageTabInterval);

        this.servicesTabInterval = setInterval(function () {
            _this.renderServicesTable();
        }, 15000);

        this.$tabPageBoard.empty();

        this.$tabPageBoard.append(this.$prepareTable);
        this.$prepareTable.hide();

        this.$tabPageBoard.append(this.$servicesTable);

    };

    UpgradeProgressHome.prototype.setEstimatedTme = function (serviceCount) {
        var estimatedTime = ' 10 min';

        this.$estimatedTime.text(estimatedTime);
    };

    UpgradeProgressHome.prototype.renderServicesTable = function () {
        var _this = this;
        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/services/progress/install',
            success: function (response) {
                console.log('renderServicesTable');
                console.log(response);

                if (response.hosts && response.hosts.length > 0) {
                    _this.$prepareTable.show();

                    var $prepareTableBody = _this.$prepareTable.find('tbody');
                    $prepareTableBody.empty();

                    var $prepareRow = $('<tr></tr>');

                    $prepareRow.append(nameCell.call(_this, response.hosts[0].hostName))
                        .append(progressCell.call(_this, response.hosts[0].progress, response.hosts[0].status))
                        .append(statusCell.call(_this, response.hosts[0].status));

                    $prepareTableBody.append($prepareRow);

                    if (response.hosts[0].status.toLowerCase() == 'preparing') {
                        _this.studio.showProgress('upgrade preparing...');
                    } else {
                        _this.studio.hideProgress();
                    }
                    //_this.studio.showProgress('upgrade preparing...');
                }

                var $tableBody = _this.$servicesTable.find('tbody');
                $tableBody.empty();
                var isInstalling = false;
                var cntInstalling = 0;
                var cntFailed = 0;
                var cntComplated = 0;

                //_this.setEstimatedTme(response.services.length);

                var doneMessage = '';
                $.each(response.services, function(index, service) {
                    var $serviceRow = $('<tr></tr>');

                    $serviceRow.append(nameCell.call(_this, service.packageName))
                        .append(progressCell.call(_this, service.progress, service.status))
                        .append(statusCell.call(_this, service.status));

                    $tableBody.append($serviceRow);

                    if (service.status.toLowerCase() == 'installing') {
                        cntInstalling += 1;
                    } else if (service.status.toLowerCase() == 'failed') {
                        cntFailed += 1;
                        doneMessage = service.status.toLowerCase();
                    } else if(service.status.toLowerCase() == 'completed') {
                        cntComplated += 1;
                    }
                });

                if(response.hosts && response.hosts.length > 0) {
                    if (response.hosts[0].status.toLowerCase() == 'preparing') {
                        isInstalling = true;
                    } else if (response.hosts[0].status.toLowerCase() == 'failed') {
                        doneMessage = 'failed'
                    } else {
                        if(cntFailed > 0) {
                            doneMessage = 'failed'
                        } else {
                            if(cntInstalling > 0) {
                                isInstalling = true;
                            } else if(cntComplated > 0) {
                                doneMessage = 'completed';
                            }
                        }
                    }
                } else {
                    if(cntFailed > 0) {
                        doneMessage = 'failed'
                    } else {
                        if(cntInstalling > 0) {
                            isInstalling = true;
                        } else if(cntComplated > 0) {
                            doneMessage = 'completed';
                        }
                    }
                }

                if (!isInstalling) {
                    clearInterval(_this.servicesTabInterval);
                    _this.processingViewer.stop();

                    var doneStatus = 'completed';
                    if(response.hosts && response.hosts.length > 0 &&
                        response.hosts[0].status.toLowerCase() == 'failed') {
                        doneStatus = 'failed';
                    }
                    for (var i in response.services) {
                        if (response.services[i].status.toLowerCase() == 'failed') {
                            doneStatus = 'failed';
                            break;
                        }
                    }

                    var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
                    console.log('!!! this.studio.setInstallType :'+_this.studio.installType);
                    if (doneStatus == 'failed') {
                        //인스톨이랑 서비스랑 왼쪽 사이드바가 다르게 그려져야 한다.
                        if (_this.studio.installType === 'service') {
                            studio.setSideMenuEnable('ADD_NEW_SERVICE_FAILED');
                        } else {
                            studio.setSideMenuEnable('UPGRADE_FAILED');
                        }
                    } else if (doneStatus == 'completed') {
                        studio.setSideMenuEnable('INSTALLED');
                    }


                    if (!_this.isDone) {
                        _this.studio.showPopup({
                            title: 'Upgrade Progress',
                            mode: 'alert',
                            message: [doneStatus],
                            hasCheckBox: false,
                            checkBoxMessage: '',
                            callback: function (isChecked) {

                            }
                        });
                    }

                    _this.isDone = true;
                    //window.location.href = '../../services/Infra_Services.html';
                }
            },
            error : function (xhr, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    UpgradeProgressHome.prototype.renderPackageTab = function (packageName) {
        var _this = this;

        this.renderPackageTable(packageName);

        clearInterval(this.servicesTabInterval);
        clearInterval(this.packageTabInterval);
        this.packageTabInterval = setInterval(function () {
            _this.renderPackageTable(packageName);
        }, 15000);

        this.$tabPageBoard.empty();
        this.$tabPageBoard.append(this.$packageTable);
    };

    UpgradeProgressHome.prototype.renderPackageTable = function (packageName) {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/services/progress/install/' + packageName,
            success: function (response) {
                // var response = document.infra['/api/v1/services/progress/install/' + packageName];
                var $tableBody = _this.$packageTable.find('tbody');
                $tableBody.empty();

                var isInstalling = false;
                $.each(response.hosts, function(index, host) {
                    var $hostRow = $('<tr></tr>');

                    $hostRow.append(nameCell.call(_this, host.hostName))
                        .append(progressCell.call(_this, host.progress, host.status))
                        .append(statusCell.call(_this, host.status))
                        .append(logCell.call(_this, packageName, host));

                    $tableBody.append($hostRow);

                    if (host.status.toLowerCase() == 'installing') {
                        isInstalling = true;
                        isInstalling = true;
                    }
                });

                if (!isInstalling) {
                    clearInterval(_this.packageTabInterval);
                }
            },
            error : function (xhr, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    UpgradeProgressHome.prototype.initProcessingViewer = function () {
         var option = {
           display: 'inline-block',
           width: 100,
           height: 20,
           position: 'relative',
           'margin-left': 10,
           top: 6
         };
         this.processingViewer = new ProcessingViewer(this.$titleArea, option);
         this.processingViewer.start();
    };

    function nameCell(name) {
        return $('' +
            ' <td class="left pl20" style="border-right: 1px solid #f0f0f0">' +
            '   <div class="line_body clearfix">' +
            '     <span>' + name + '</span>' +
            '   </div>' +
            ' </td>');
    }

    function progressCell(progress, status) {
        var $progress = $('' +
            ' <td class="left" style="border-right: 1px solid #f0f0f0">' +
            '   <div class="line_body clearfix">' +
            '     <div class="progress-bar" style="margin-left:10px">' +
            '       <span style="width: ' + progress + '%;"></span>' +
            '     </div>' +
            '     <span class="progress-value" style="margin-right:10px;">' + progress + '%</span>' +
            '   </div>' +
            ' </td>');

        var statusCode = status.toLowerCase();
        $progress.find('div.progress-bar > span').addClass(this.STATUS[statusCode].statusClass);
        $progress.find('span.progress-value').addClass(this.STATUS[statusCode].txtClass);

        return $progress;
    }

    function statusCell (status) {
        var statusText = status;
        if(statusText == 'Installing') {
            statusText = 'Upgrading'
        }
        var $status = $('' +
            ' <td>' +
            '   <div class="line_body clearfix">' +
            '     <span>' + statusText + '</span>' +
            '   </div>' +
            ' </td>');

        $status.find('span').addClass(this.STATUS[status.toLowerCase()].txtClass);

        return $status;
    }

    function logCell (packageName, host) {
        var $log = $('' +
            ' <td style="border-left: 1px solid #f0f0f0">' +
            '   <div class="line_body clearfix">' +
            '     <ul>' +
            '     </ul>' +
            '   </div>' +
            ' </td>');

        var $logList = $log.find('ul');

        $.each(host.logs, function (index, log) {
            var $logItem = $('' +
                ' <li class="board-LogItem">' +
                '   <a href="javascript:;">' +
                '     <span>' + log.key + '</span>' +
                '   </a>' +
                ' </li>');

            if (host.status.toLowerCase() == 'installing') {
                $logItem.addClass('disabled');
            }
            if (index == host.logs.length - 1) {
                $logItem.addClass('last');
            }

            $logItem.find('a').click(function () {
                openLogPopup(packageName, host.hostName, log);
                $logItem.find('a').blur();
            });

            $logList.append($logItem);
        });

        return $log;
    }

    function openLogPopup (packageName, hostName, log) {
        if (log.type == 'log_dir') {
            openLogDirPopup(packageName, hostName, log);
        } else if (log.type == 'log_file') {
            openLogFilePopup(packageName, hostName, log.key, log.value);
        }
    }

    function openLogDirPopup (packageName, hostName, log) {
        var _this = this;

        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/logs/'+hostName+'/'+packageName+'/'+log.key,
            success: function (response) {
                //var $logWindow = $('' +
                //    '<div id="jqxwindow-install-log" title="Log: '+packageName+'-'+log.key+'-'+hostName+'">' +
                //    '</div>' +
                //    '');

                var $content = $('<div></div>');

                for (var i in response.logFiles) {
                    var $aTag = $('' +
                        '<div style="height: 20px; margin-top: 3px">' +
                        //'   <a style="text-decoration: underline; color:blue" target="_blank" href="api/v1/logs/'+hostName+'/'+packageName+'/'+logName+'/file?path='+response.logFiles[i]+'">' +
                        '       <span style="cursor:pointer">'+response.logFiles[i]+'</span>' +
                        '   </a>' +
                        '</div>');

                    $aTag.find('span').mouseover(function(){
                        $(this).css({'color':'blue'});
                    });

                    $aTag.find('span').mouseout(function(){
                        $(this).css({'color':''});
                    });

                    $aTag.find('span').click(function(){
                        openLogFilePopup(packageName, hostName, log.key, $(this).text());
                    });
                    $content.append($aTag);
                }
                //$logWindow.find('p').text(response.logFiles);

                //$logWindow.dialog({
                //    maxheight: 500,
                //    width: 1000
                //});
                var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));

                studio.showPopup({
                    title: log.key,
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
    }

    function openLogFilePopup (packageName, hostName, key, value) {
        //var url = '/api/v1/logs/fronttest/Hadoop/HADOOP_LOG_DI43433R/$HADOOP_PREFIX/logs';
        $.ajax({
            method: 'GET',
            crossDomain: true,
            url: '/api/v1/logs/'+hostName+'/'+packageName+'/'+key+'/file?path='+value,
            success: function (response) {
                //var $logWindow = $('' +
                //    '<div id="jqxwindow-install-log" title="Log: '+packageName+'-'+key+'-'+hostName+'-'+value+'">' +
                //    '   <p>Content</p>' +
                //    '</div>' +
                //    '');
                //$logWindow.find('p').text(response.log);

                //$logWindow.dialog({
                //    maxheight: 500,
                //    width: 1000
                //});

                var $content = $('<div></div>');

                var logList = response.log.split('\n');

                for (var i in logList) {
                    var $aTag = $('' +
                        // '<div style="height: 20px; margin-top: 3px">' +
                        '<div style="display: flex; white-space: pre; height: 20px; margin-top: 3px; cursor:text;">' +
                            //'   <a style="text-decoration: underline; color:blue" target="_blank" href="api/v1/logs/'+hostName+'/'+packageName+'/'+logName+'/file?path='+response.logFiles[i]+'">' +
                        '       <span>'+logList[i]+'</span>' +
                        //'   </a>' +
                        '</div>');

                    $content.append($aTag);
                }

                var studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
                studio.showPopup({
                    // width: 1600,
                    // height: 800,
                    title: 'Log: '+packageName+'-'+key+'-'+hostName+'-'+value,
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
    }

    /* Processing Icon */
    function ProcessingViewer($parent, option) {
        this.$parent = $parent;
        this.option = option;
    }

    ProcessingViewer.prototype.start = function () {
        var _this = this;
        this.$processingDiv = $('' +
            '<div id="spinner" style="position:relative; top:5px; margin-left: 150px">' +
            '   <span class="icon loading small"></span>' +
            ' </div>');

        this.$parent.parent().find('.h2_title').after(this.$processingDiv);
    };

    ProcessingViewer.prototype.stop = function () {
        this.$processingDiv.remove();
    };

    root.Brightics.Installer.ContentContainer.UpgradeProgressHome = UpgradeProgressHome;

}).call(this);
