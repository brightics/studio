(function () {
    'use strict';
    (function convert() {
        const SettingStorage = Brightics.VA.SettingStorage;
        const num = SettingStorage.getValue('chart.table.formatter.number');
        if (num) {
            SettingStorage.setValue('chart.table.formatter.double', num);
            SettingStorage.setValue('chart.table.formatter.integer', num);
            SettingStorage.setToDefault('chart.table.formatter.number');
        }
    }());
}).call(this);
