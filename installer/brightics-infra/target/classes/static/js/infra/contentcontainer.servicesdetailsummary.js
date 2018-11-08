/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ServiceDetailSummary ($parent, summaryData) {
        this.$parent = $parent;
        this.summaryData = summaryData;
    }

    ServiceDetailSummary.prototype.render = function () {
        this.$mainControl = $('<div class="row-fluid rowlast"></div>');

        this.$parent.append(this.$mainControl);
        this.$wrapper = $('<div class="wrapper"></div>');
        this.$mainControl.append(this.$wrapper);

        this.createTable();

        this.renderOutput();
        this.renderInstalledDate();
        this.renderStartedDate();
        this.renderStatus();
        this.renderComponents();
        this.renderLogDirectory();
    };

    ServiceDetailSummary.prototype.createTable = function () {
        this.$table = $('' +
            '<table class="board-view04">' +
            '    <colgroup>' +
            '        <col class="w18" />' +
            '        <col />' +
            '    </colgroup>' +
            '    <tbody></tbody>' +
            '</table>');

        this.$tbody = this.$table.find('tbody');

        this.$wrapper.append(this.$table);
    };

    ServiceDetailSummary.prototype.renderOutput = function () {
        if (this.summaryData.output) {

            var outputs = this.summaryData.output;

            var $outputContainer = $('' +
                '<tr>' +
                '   <th rowspan="'+Object.keys(outputs).length+'"><span>Output</span></th>' +
                '   <td></td>' +
                '</tr>');

            var outputIndex = 0;

            for (var key in outputs) {
                if (outputIndex == 0) {
                    var output = $('' +
                        '<div class="line_body clearfix">' +
                        '    <div class="board-summaryLinkItem ">' +
                        '         <div style="float:left; width:150px; display: table-cell; vertical-align: middle; line-height: 37px; font-weight: bold">'+key+'</div>' +
                        //'         <div style="float:left"><a target="_blank" href="'+outputs[key]+'"><span>'+outputs[key]+'</span></a></div>' +
                        '    </div>' +
                        '</div>' +
                        '');
                    for (var i in outputs[key]) {
                        var $link = $('<div style="float:left;margin-right: 10px"><a target="_blank" href="'+outputs[key][i]+'"><span>'+outputs[key][i]+'</span></a></div>');
                        output.find('.board-summaryLinkItem').append($link);
                    }
                    $outputContainer.find('td').append(output);
                    this.$tbody.append($outputContainer);
                } else {
                    var trObj = $('' +
                        '<tr>' +
                        '   <td>' +
                        '       <div class="line_body clearfix">' +
                        '           <div class="board-summaryLinkItem ">' +
                        '               <div style="float:left; width:150px; display: table-cell; vertical-align: middle; line-height: 37px; font-weight: bold">'+key+'</div>' +
                        //'               <div style="float:left"><a target="_blank" href="'+outputs[key]+'"><span>'+outputs[key]+'</span></a></div>' +
                        '           </div>' +
                        '       </div>' +
                        '   </td>' +
                        '</tr>');

                    for (var i in outputs[key]) {
                        var $link = $('<div style="float:left; margin-right: 10px"><a target="_blank" href="'+outputs[key][i]+'"><span>'+outputs[key][i]+'</span></a></div>');
                        trObj.find('.board-summaryLinkItem').append($link);
                    }

                    this.$tbody.append(trObj);
                }

                outputIndex++;
            }
        }
    };

    ServiceDetailSummary.prototype.renderInstalledDate = function () {
        if (this.summaryData.installedDate) {
            var $installedDate = $('' +
                '<tr>' +
                '   <th><span>Installed Date </span>' +
                '   </th>' +
                '   <td>' +
                '       <span>'+this.summaryData.installedDate+'</span>' +
                '   </td>' +
                '</tr>');
            this.$tbody.append($installedDate);
        }
    };

    ServiceDetailSummary.prototype.renderStartedDate = function () {
        if (this.summaryData.startedDate) {
            var $startedDate = $('' +
                '<tr>' +
                '   <th><span>Started Date </span>' +
                '   </th>' +
                '   <td>' +
                '       <span>'+this.summaryData.startedDate+'</span>' +
                '   </td>' +
                '</tr>');
            this.$tbody.append($startedDate);
        }
    };

    ServiceDetailSummary.prototype.renderStatus = function () {
        if (this.summaryData.status) {
            var statusIconClass = this.getStatusClass(this.summaryData.status);

            var $status = $('' +
                '<tr>' +
                '<th><span>Status </span>' +
                '</th>' +
                '<td>' +
                '<div class="summary-statusarea ">' +
                '<ul>' +
                '<li>' +
                '<div class="iconstatus '+statusIconClass+'"></div>' +
                '<span>'+this.summaryData.status+'</span>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</td>' +
                '</tr>');

            this.$tbody.append($status);
        }
    };

    ServiceDetailSummary.prototype.renderComponents = function () {
        for (var i in this.summaryData.components) {
            var componentData = this.summaryData.components[i];

            var $component = $('' +
                '<tr>' +
                '   <th><span>'+componentData.componentLabel+' </span>' +
                '   </th>' +
                '   <td>' +
                '       <div class="summary-statusarea ">' +
                '           <ul id="hosts">' +
                    //'               <li>' +
                    //'                   <div class="iconstatus status_running "></div>' +
                    //'                   <span>Host01</span>' +
                    //'               </li>' +
                '           </ul>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            for (var j in componentData.hosts) {
                var hostIconClass = this.getStatusClass(componentData.hosts[j].status);
                var $host = $('' +
                    '<li>' +
                    '   <div class="iconstatus '+hostIconClass+'"></div>' +
                    '   <span>'+componentData.hosts[j].hostName+'</span>' +
                    '</li>');

                $component.find('#hosts').append($host);
            }
            this.$tbody.append($component);
        }
    };

    ServiceDetailSummary.prototype.renderLogDirectory = function () {
        var logDirs = this.summaryData.logDirs;

        var $logsContainer = $('' +
            '<tr class="last">' +
            '   <th rowspan="'+Object.keys(logDirs).length+'"><span>Log Directory </span></th>' +
            '   <td></td>' +
            '</tr>');
        $logsContainer.find('th').css('border-bottom', 'none');

        var logDirsIndex = 0;
        for (var key in logDirs) {
            if (logDirsIndex == 0) {
                var $logDiv = $('' +
                    '<div style="float:left; width:150px; display: table-cell; vertical-align: middle; line-height: 37px; font-weight: bold">'+key+'</div>' +
                    '<div style="float:left; display: table-cell; vertical-align: middle; line-height: 37px;">'+logDirs[key]+'</div>');
                //$logsContainer.find('td').text(logDirs[key]);
                $logsContainer.find('td').append($logDiv);
                this.$tbody.append($logsContainer);
            } else {
                var trObj = $('' +
                    '<tr class="last">' +
                    '    <td>' +
                    '         <div style="float:left; width:150px; display: table-cell; vertical-align: middle; line-height: 37px; font-weight: bold">'+key+'</div>' +
                    '         <div style="float:left; display: table-cell; vertical-align: middle; line-height: 37px;">'+logDirs[key]+'</div>' +
                    '    </td>' +
                    '</tr>');

                this.$tbody.append(trObj);
            }
            logDirsIndex++;
        }
    };

    ServiceDetailSummary.prototype.getStatusClass = function (status) {
        var statusIconClass = 'status_running';
        var status = status.toLowerCase();

        if (status === 'running') {
            statusIconClass = 'status_running';
        } else if (status === 'warning') {
            statusIconClass = 'status_warning';
        } else if (status === 'stop') {
            statusIconClass = 'status_stop';
        } else if (status === 'error') {
            statusIconClass = 'status_error';
        } else if (status === 'config') {
            statusIconClass = 'status_stop'
        }

        return statusIconClass;
    };

    root.Brightics.Installer.ContentContainer.ServiceDetailSummary = ServiceDetailSummary;

}).call(this);