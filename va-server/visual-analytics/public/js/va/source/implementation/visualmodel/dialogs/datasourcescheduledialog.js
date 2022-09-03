/**
 * Created by minkyung.kim on 2017-05-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataSourceScheduleDialog(parentId, options) {
        Brightics.VA.Implementation.Visual.Dialogs.ScheduleDialog.call(this, parentId, options);
    }

    DataSourceScheduleDialog.prototype = Object.create(Brightics.VA.Implementation.Visual.Dialogs.ScheduleDialog.prototype);
    DataSourceScheduleDialog.prototype.constructor = DataSourceScheduleDialog;

    DataSourceScheduleDialog.prototype.setOptions = function ($parent, options) {
        this.linkTable = {};

        this.headerOptions = {
            col1: 'Data Name',
            col2: 'Schedule'
        };
    };

    DataSourceScheduleDialog.prototype.createBody = function ($parent) {
        var callback = function (resultData) {
            var $rowWrapper = $('<div class="brtc-va-dialogs-schedule-grid-row-wrapper border-bottom"></div>');
            $parent.append($rowWrapper);

            var $row = this.craeteMainRow($rowWrapper);

            var $col1 = $row.find('.col1'),
                $col2 = $row.find('.col2');

            var $icon = $('<div class="brtc-va-dialogs-schedule-icon-data"></div>'),
                $label = $('<div class="schedule-label"></div>');
            $label.text(this.options.name);
            $label.attr('title', this.options.name);
            $col1.append($icon).append($label);

            var $scheduleCombo = $('<div class="combo"></div>');
            $col2.append($scheduleCombo);

            this.linkTable = this.makeLinkScheduleAndTable(resultData, [this.options.param.tableId]);

            $scheduleCombo.jqxComboBox({
                source: this.makeScheduleList(this.options.param.tableId),
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

            var item = $scheduleCombo.jqxComboBox('getItemByValue', this.options.param.scheduleId);

            if (item) {
                $scheduleCombo.jqxComboBox('selectItem', this.options.param.scheduleId || '');
            } else {
                $scheduleCombo.find('input').val('can not find schedule').addClass('error');
            }

            $scheduleCombo.on('close', function () {
                if ($(this).find('input').val() != 'can not find schedule') $(this).find('input').removeClass('error');
            });
            $scheduleCombo.find('input').attr('readonly', 'readonly');
        };

        this.getSchedule(callback.bind(this), [this.options.param.tableId]);
    };

    DataSourceScheduleDialog.prototype.handleOkClicked = function () {
        if (this.$mainControl.find('.combo input').val() === 'can not find schedule') {
            this.dialogResult.scheduleId = undefined;
        } else {
            this.dialogResult.scheduleId = this.$mainControl.find('.combo').val();
        }

        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    Brightics.VA.Implementation.Visual.Dialogs.DataSourceScheduleDialog = DataSourceScheduleDialog;

}).call(this);
