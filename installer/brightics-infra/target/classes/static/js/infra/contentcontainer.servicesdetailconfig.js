/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ServiceDetailConfig ($parent, configurationsList) {
        this.$parent = $parent;

        this.originConfigurationsList = $.extend(true, {}, configurationsList);
        this.configurationsList = configurationsList;
    }

    ServiceDetailConfig.prototype.render = function () {
        this.renderProperties();
        this.renderLog();
        this.renderConfig();
    };

    ServiceDetailConfig.prototype.renderProperties = function () {
        this.propertyList = this.configurationsList.properties;

        if (this.propertyList && this.propertyList.length > 0) {
            this.$propertiesBox = this.createBox('properties', 'Properties');
            this.$parent.append(this.$propertiesBox);
        }
    };

    ServiceDetailConfig.prototype.renderLog = function () {
        this.logList = this.configurationsList.logs;

        if (this.logList && this.logList.length > 0) {
            this.$logsBox = this.createBox('logs', 'Component Logs');
            this.$parent.append(this.$logsBox);
        }
    };

    ServiceDetailConfig.prototype.renderConfig = function () {
        this.configsList = this.configurationsList.configs;

        for (var i in this.configsList) {

            this.$configsBox = this.createBox('configs', this.configsList[i].fileName, i);

            this.$parent.append(this.$configsBox);
        }
    };

    ServiceDetailConfig.prototype.createBox = function (id, label, index) {
        var $box = $('<div id="'+id+'_main" class="configurations_panel configurations_panel_' + id + ' row-fluid"></div>');

        $box.append(this.createBoxHeader(id, label));

        $box.append($('<div class="row_fiuld_des"></div>'));

        if (id === 'properties') {
            $box.append(this.createPropertiesBoxBody());
        } else if (id === 'logs') {
            $box.append(this.createLogsBoxBody());
        } else if (id === 'configs') {
            $box.append(this.createConfigsBoxBody(this.configsList[index]));
            if (this.configsList.length - 1 === parseInt(index)) {
                $box.addClass('rowlast');
            }
        }

        return $box;
    };

    ServiceDetailConfig.prototype.createBoxHeader = function (id, label) {
        var _this =this;

        var $header = $('' +
            '<div class="h3_title clearfix">' +
            '    <span>'+label+'</span>' +
            '</div>');

        if (id === 'configs') {
            $header.append('<button class="installer_step4_expand_button btn expandable" style="margin-bottom:6px;"><img src="static/images/expandable-up.png" /></button>');
            $header.find('.installer_step4_expand_button img').css('transform', 'rotate(180deg)');
            $header.find('.installer_step4_expand_button').click(function () {
                if ($(this).parents('.configurations_panel').find('.expandable-area').css('display') === 'none') {
                    $(this).parents('.configurations_panel').find('.expandable-area').css('display', 'block');
                    $(this).parents('.configurations_panel').find('.installer_step4_expand_button img').css('transform', '');
                }
                else {
                    $(this).parents('.configurations_panel').find('.expandable-area').css('display', 'none');
                    $(this).parents('.configurations_panel').find('.installer_step4_expand_button img').css('transform', 'rotate(180deg)');
                }
            });
        }

        var $resetButton = $('' +
            '<div id="reset_'+id+'" class="fl_r">' +
            '    <button id="configuration_header-reset" class="btnGray"><span>Reset</span></button>' +
            '</div>');

        $resetButton.click(function(){
            if (id === 'properties') {
                for (var i in _this.originConfigurationsList.properties) {
                    var propertyName = _this.originConfigurationsList[id][i].key;

                    $('#'+propertyName.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" )+'_input').val(_this.originConfigurationsList[id][i].value);

                    _this.configurationsList[id][i].value = _this.originConfigurationsList[id][i].value;
                }
            }

            if (id === 'configs') {
                var fileName = label;
                for (var i in _this.originConfigurationsList.configs) {
                    if( fileName == _this.originConfigurationsList.configs[i].fileName ) {
                        var configId = _this.originConfigurationsList.configs[i].configId;
                        $('#'+configId+'_input').val(_this.originConfigurationsList.configs[i].contents);
                        _this.configurationsList.configs[i].contents = _this.originConfigurationsList[id][i].contents;
                        break;
                    }
                }
            }

            if (id === 'logs') {
//                console.log(_this.originConfigurationsList)
                for (var i in _this.originConfigurationsList.logs) {
                    var logName = _this.originConfigurationsList[id][i].key;

                    $('#'+logName.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" )+'_input').val(_this.originConfigurationsList[id][i].value);

                    _this.configurationsList[id][i].value = _this.originConfigurationsList[id][i].value;
                }
            }
        });

        $header.append($resetButton);
        return $header;
    };

    ServiceDetailConfig.prototype.createPropertiesBoxBody = function () {
        var _this = this;

        var $body = $('<div class="expandable-area"></div>');
        var $table =  $('<table class="board-view01"></table>');
        $table.append(
            $('' +
                '<colgroup>' +
                '   <col class="w15" />' +
                '   <col />' +
                '   <col class="w6" />' +
                '</colgroup>' +
                '<tbody>' +
                '</tbody>')
        );

        var $tbody = $table.find('tbody');

        for (var i in this.propertyList) {
            var propertyName = this.propertyList[i].key;
            var propertyValue = this.propertyList[i].value;

            var $component = $('' +
                '<tr id="'+propertyName+'">' +
                '   <th style="word-wrap:break-word"><span>'+propertyName+'</span>' +
                '   </th>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <input type="text" id="'+propertyName+'_input" name="'+propertyName+'" class="normal" title="" value="'+propertyValue+'">' +
                '       </div>' +
                '       <div class="line_body clearfix">' +
                '           <label class="help-block" for="">errorclass-has-error</label>' +
                '       </div>' +
                '   </td>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <button id="'+propertyName+'" class="btnWhite"><span>Reset</span></button>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            $component.find('input').change(function(event, data){
                var propertyName = $(this).attr('name');

                for (var i in _this.configurationsList.properties) {
                    if (_this.configurationsList.properties[i].key === propertyName) {
                        _this.configurationsList.properties[i].value = $(this).val();
                    }
                }
            });

            $tbody.append($component);

            $component.find('button').click(function(){
                var propertyName = $(this).attr('id');

                for (var i in _this.originConfigurationsList.properties) {
                    if (propertyName === _this.originConfigurationsList.properties[i].key) {
                        $('#'+propertyName.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" )+'_input').val(_this.originConfigurationsList.properties[i].value);
                        _this.configurationsList.properties[i].value = _this.originConfigurationsList.properties[i].value;
                    }
                }
            });
        }

        $body.append($table);
        return $body;
    };

    ServiceDetailConfig.prototype.createLogsBoxBody = function () {
        var _this = this;

        var $body = $('<div></div>');
        var $table =  $('<table class="board-view01"></table>');
        $table.append(
            $('' +
                '<colgroup>' +
                '   <col class="w11" />' +
                '   <col class="w9" />' +
                '   <col />' +
                '   <col class="w6" />' +
                '</colgroup>' +
                '<tbody>' +
                '</tbody>')
        );

        var $tbody = $table.find('tbody');

        for (var i in this.logList) {
            var logName = this.logList[i].key;
            var logValue = this.logList[i].value;

            var $component = $('' +
                '<tr>' +
                '   <th><span>'+logName+'</span>' +
                '   </th>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <div name="'+logName+'" id="jqxLogs_'+logName+'" class="jqx_dropbox_line"></div>' +
                '       </div>' +
                '   </td>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '          <input type="text" id="'+logName+'_input" name="'+logName+'" class="normal" title="" value="'+logValue+'">' +
                '       </div>' +
                '       <div class="line_body clearfix">' +
                '           <label class="help-block" for="">errorclass-has-error</label>' +
                '       </div>' +
                '   </td>' +
                '   <td>' +
                '       <div class="line_body clearfix">' +
                '           <button id="'+logName+'" class="btnWhite"><span>Reset</span></button>' +
                '       </div>' +
                '   </td>' +
                '</tr>');

            $component.find('input').change(function(event, data){
                var logName = $(this).attr('name');

                for (var i in _this.configurationsList.logs) {
                    if (_this.configurationsList.logs[i].key === logName) {
                        _this.configurationsList.logs[i].value = $(this).val();
                    }
                }
            });

            $component.find('#jqxLogs_'+logName).jqxDropDownList({
                source: ['directory', 'file'],
                animationType: 'fade',
                selectedIndex: 0,
                theme: 'office',
                width: '110px',
                dropDownHeight: 130,
                height: '21px',
                disabled: true
            });

            var type = (this.logList[i].type).toLowerCase();
            if (type.indexOf('file') > -1) type = 'file';
            if (type.indexOf('dir') > -1) type = 'directory';

            $component.find("#jqxLogs_"+logName).jqxDropDownList('selectItem', type);

            $component.find("#jqxLogs_"+logName).on('change', function (event) {
                var args = event.args;
                if (args) {
                    var value = args.item.value;
                    if (value == 'directory') value = 'dir';

                    var logName = $(this).attr('name');

                    for (var i in _this.configurationsList.properties) {
                        if (_this.configurationsList.logs[i].key === logName) {
                            _this.configurationsList.logs[i].type = 'logs_'+value;
                        }
                    }
                }
            });

            $component.find('button').click(function(){
                var logName = $(this).attr('id');

                for (var i in _this.originConfigurationsList.logs) {
                    if (logName === _this.originConfigurationsList.logs[i].key) {
                        $('#'+logName+'_input').val(_this.originConfigurationsList.logs[i].value);
                        $('#jqxLogs_'+logName).jqxDropDownList('selectItem', _this.originConfigurationsList.logs[i].type);

                        _this.configurationsList.logs[i].value = _this.originConfigurationsList.logs[i].value;
                        _this.configurationsList.logs[i].type = _this.originConfigurationsList.logs[i].type;
                    }
                }
            });

            $tbody.append($component);
        }

        $body.append($table);
        return $body;

    };

    ServiceDetailConfig.prototype.createConfigsBoxBody = function (configData) {
        var _this = this;

        var $body = $('<div class="expandable-area"></div>');
        var $table =  $('<table class="board-view01"></table>');
        $table.append(
            $('' +
                '<colgroup>' +
                '   <col class="w11" />' +
                '   <col />' +
                //'   <col class="w6" />' +
                '</colgroup>' +
                '<tbody>' +
                '</tbody>')
        );

        var $tbody = $table.find('tbody');

        var $component = $('' +
            '<tr class="last">' +
            '   <th><span>contents </span>' +
            '   </th>' +
            '   <td>' +
            '       <textarea id="'+configData.configId+'_input" file-name="'+configData.fileName+'" class="" rows=4 style="padding:0">'+configData.contents+'</textarea>' +
            '       <div class="line_body clearfix">' +
            '           <label id="'+configData.configId+'_error" class="help-block" for="">'+configData.fileName+' is not entered</label>' +
            '       </div>' +
            '   </td>' +
            '</tr>');

        $tbody.append($component);

        $body.append($table);

        $body.css('display', 'none');

        var lineCount = (configData.contents).split('\n').length,
            minHeight = 100,
            maxHeight = 500;

        var currentHeight = (lineCount * 15);

        var textAreaWidth = $('.cont_area').width() - 139 -10; // 139는 th의 크기(고정). 10은 padding

        $component.find('textarea').height(( currentHeight > maxHeight ) ? maxHeight : ((currentHeight < minHeight) ? minHeight : currentHeight)).width(textAreaWidth);

        $component.find('textarea').on('change', function(event, data){
            //jqx에서 강제로 padding을 5씩 먹여서 없앰
            $(this).css('padding',0);

            var configId = $(this).attr('id').replace('_input', ''),
                configFileName = $(this).attr('file-name');

            if ($(this).val()) {
                $(this).removeClass('has-error');
                $('#'+configId+'_error').removeClass('has-error').css({'display':'none'});

                for (var i in _this.configurationsList.configs) {
                    if (_this.configurationsList.configs[i].fileName == configFileName) {
                        _this.configurationsList.configs[i].contents = $(this).val();
                        _this.configurationsList.configs[i].configId = 0;
                    }
                }
            } else {
                $(this).addClass('has-error');
                $('#'+configId+'_error').addClass('has-error').css({'display':'block'});
                //$(this).siblings().find('.help-block').addClass('has-error').css({'display':'block'});
            }

        });

        return $body;
    };

    ServiceDetailConfig.prototype.getConfigData = function () {
        return this.configurationsList;
    };

    root.Brightics.Installer.ContentContainer.ServiceDetailConfig = ServiceDetailConfig;

}).call(this);