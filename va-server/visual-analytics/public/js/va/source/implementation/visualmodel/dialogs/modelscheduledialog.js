/**
 * Created by minkyung.kim on 2017-05-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ModelScheduleDialog(parentId, options) {
        Brightics.VA.Implementation.Visual.Dialogs.ScheduleDialog.call(this, parentId, options);
    }

    ModelScheduleDialog.prototype = Object.create(Brightics.VA.Implementation.Visual.Dialogs.ScheduleDialog.prototype);
    ModelScheduleDialog.prototype.constructor = ModelScheduleDialog;

    ModelScheduleDialog.prototype._initOptions = function () {
        Brightics.VA.Implementation.Visual.Dialogs.ScheduleDialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 908;
        this.dialogOptions.height = 472;
    };

    ModelScheduleDialog.prototype.setOptions = function ($parent, options) {
        var dataSource = this.options.visualModel.getContents().getDataSources();
        var pid = this.options.visualModel.getProjectId();
        var models = Studio.getResourceManager().getFiles(pid);

        var dfModels = {};

        for (var i in dataSource) {
            var tableId = dataSource[i].param.tableId;
            for (var j in models) {
                if (models[j].getContents().getFnUnitByOutTable(tableId)) {
                    if (!dfModels[models[j].getFileId()]) {
                        dfModels[models[j].getFileId()] = {};
                        dfModels[models[j].getFileId()].contents = models[j];
                        dfModels[models[j].getFileId()].dataSource = [];
                    }
                    dfModels[models[j].getFileId()].dataSource.push(dataSource[i]);
                    continue;
                }
            }
        }

        this.options.DFModels = dfModels;

        this.linkTable = {};
        this.tables = [];

        for (var mid in this.options.DFModels) {
            for (var j in this.options.DFModels[mid].dataSource) {
                this.tables.push(this.options.DFModels[mid].dataSource[j].param.tableId);
            }
        }

        this.headerOptions = {
            totalCount: this.tables.length,
            col1: 'Model',
            col2: 'Schedule'
        };
    };

    ModelScheduleDialog.prototype.isEmpty = function () {
        return (Object.keys(this.options.DFModels).length > 0) ? false : true;
    };

    ModelScheduleDialog.prototype.createBody = function ($parent) {
        var callback = function (resultData) {
            this.linkTable = this.makeLinkScheduleAndTable(resultData, this.tables);

            var $bodyWrapper = $('<div class="brtc-va-dialogs-schedule-grid-wrapper"></div>');
            $parent.append($bodyWrapper);

            var index = 0;


            for (var mid in this.options.DFModels) {
                var mainComboSource = [];

                var $rowWrapper = $('<div class="brtc-va-dialogs-schedule-grid-row-wrapper"></div>');
                $bodyWrapper.append($rowWrapper);

                var _model = this.options.DFModels[mid];

                var $mainRow = this.craeteMainRow($rowWrapper);
                $rowWrapper.attr('index', index);
                $mainRow.attr('mid', mid).attr('index', index);
                index++;

                var $col1 = $mainRow.find('.col1');

                var $showDataSourceicon = $('<div class="brtc-va-dialogs-schedule-icon-plus-square" showDataSource="false"></div>'),
                    $label = $('<div class="schedule-label"></div>');
                $label.text(_model.contents.getLabel());
                $col1.append($showDataSourceicon).append($label);

                $showDataSourceicon.click(function () {
                    var _$closest = $(this).closest('.brtc-va-dialogs-schedule-grid-row-main'),
                        _mid = _$closest.attr('mid');

                    if ($(this).attr('showDataSource') === 'false') {
                        $(this).attr('showDataSource', 'true');

                        $('.brtc-va-dialogs-schedule-grid-row-sub[mid=' + _mid + ']').show();
                    } else {
                        $(this).attr('showDataSource', 'false');

                        $('.brtc-va-dialogs-schedule-grid-row-sub[mid=' + _mid + ']').hide();
                    }
                });

                for (var i in _model.dataSource) {
                    var $subRow = this.craeteSubRow($rowWrapper);
                    $subRow.attr('mid', mid).attr('tableId', _model.dataSource[i].param.tableId);

                    let $col1 = $subRow.find('.col1'),
                        $col2 = $subRow.find('.col2');

                    var tableId = _model.dataSource[i].param.tableId,
                        fnUnit = _model.contents.getContents().getFnUnitByOutTable(tableId);

                    var $functionName = $('<div class="schedule-label function-name"></div>');
                    $functionName.text(fnUnit.display.label);
                    $functionName.attr('title', fnUnit.display.label);

                    var $assetIcon = $('<div class="brtc-va-dialogs-schedule-icon-table"></div>');
                    var $dataSourceName = $('<div class="schedule-label datasource-name"></div>');
                    $dataSourceName.text(_model.dataSource[i].display.label);
                    $dataSourceName.attr('title', _model.dataSource[i].display.label);

                    $col1.append($functionName).append($assetIcon).append($dataSourceName);

                    var $subScheduleCombo = $('<div class="combo"></div>');
                    $subScheduleCombo.attr('dataSourceId', _model.dataSource[i].fid);
                    $col2.append($subScheduleCombo);

                    var subComboSource = this.makeScheduleList(tableId);

                    for (var subIndex in subComboSource) {
                        var isDup = false;

                        for (const mainCombo of mainComboSource) {
                            if (subComboSource[subIndex].value === mainCombo.value) {
                                isDup = true;
                                break;
                            }
                        }
                        if (!isDup) mainComboSource.push(subComboSource[subIndex]);
                    }

                    $subScheduleCombo.jqxComboBox({
                        source: subComboSource,
                        theme: 'office',
                        width: '398px',
                        dropDownWidth: '408px',
                        height: '28px',
                        openDelay: 0,
                        closeDelay: 0,
                        displayMember: 'label',
                        selectedIndex: 0,
                        valueMember: 'value'
                    });

                    var item = $subScheduleCombo.jqxComboBox('getItemByValue', _model.dataSource[i].param.scheduleId);

                    if (item) {
                        $subScheduleCombo.jqxComboBox('selectItem', _model.dataSource[i].param.scheduleId || '');
                    } else {
                        $subScheduleCombo.find('input').val('can not find schedule').addClass('error');
                    }
                    $subScheduleCombo.on('close', function () {
                        if ($(this).find('input').val() != 'can not find schedule') $(this).find('input').removeClass('error');
                    });

                    $subScheduleCombo.find('input').attr('readonly', 'readonly');
                }

                var $col2 = $mainRow.find('.col2');
                var $mainScheduleCombo = $('<div class="combo"></div>');
                $mainScheduleCombo.attr('mid', mid);
                $col2.append($mainScheduleCombo);

                $mainScheduleCombo.jqxComboBox({
                    source: mainComboSource,
                    theme: 'office',
                    width: '398px',
                    dropDownWidth: '408px',
                    height: '28px',
                    openDelay: 0,
                    closeDelay: 0,
                    displayMember: 'label',
                    valueMember: 'value',
                    placeHolder: '- Select Schedule -'
                });

                $mainScheduleCombo.on('change', function (e) {
                    var comboMid = $(this).attr('mid'),
                        scheduleId = e.args.item.value;

                    var $showIcon = $(this).closest('.brtc-va-dialogs-schedule-grid-row-main').find('.brtc-va-dialogs-schedule-icon-plus-square');
                    $showIcon.attr('showDataSource', 'true');
                    $('.brtc-va-dialogs-schedule-grid-row-sub[mid=' + comboMid + ']').show();


                    var tableCombos = $(this).closest('.brtc-va-dialogs-schedule-grid-row-wrapper').find('.brtc-va-dialogs-schedule-grid-row-sub[mid=' + comboMid + '] .combo');

                    for (var i = 0; i < tableCombos.length; i++) {
                        var items = $(tableCombos[i]).jqxComboBox('getItems');

                        for (var j in items) {
                            if (items[j].value === scheduleId) {
                                $(tableCombos[i]).jqxComboBox('selectItem', scheduleId);
                                break;
                            }
                        }
                    }
                });
            }

            var $lastMainRowWrapper = $bodyWrapper.find('.brtc-va-dialogs-schedule-grid-row-wrapper[index=' + (index - 1) + ']');
            $lastMainRowWrapper.addClass('border-bottom');

            $bodyWrapper.perfectScrollbar();
        };

        this.getSchedule(callback.bind(this), this.tables);
    };

    ModelScheduleDialog.prototype.handleOkClicked = function () {
        var connectInfo = [];
        var $scheduleCombos = this.$mainControl.find('.brtc-va-dialogs-schedule-grid-row-sub .combo')
        for (var i = 0; i < $scheduleCombos.length; i++) {
            var scheduleLabel = $($scheduleCombos[i]).find('input').val(),
                scheduleId = $($scheduleCombos[i]).val(),
                dataSourceId = $($scheduleCombos[i]).attr('dataSourceId');

            if (scheduleLabel != 'can not find schedule') {
                connectInfo.push({
                    dataSourceId: dataSourceId,
                    scheduleId: scheduleId
                });
            }
        }

        this.dialogResult.connectInfo = connectInfo;

        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    Brightics.VA.Implementation.Visual.Dialogs.ModelScheduleDialog = ModelScheduleDialog;

}).call(this);
