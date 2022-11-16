(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var SettingPath = Brightics.VA.Setting;

    var BaseSettingWidget = {
        createInput: function (settingId, $inputControl) {
            var settingData = Brightics.VA.SettingStorage.getValue(settingId);
            var $control = $inputControl.jqxInput({
                theme: Brightics.VA.Env.Theme
            });
            $inputControl.jqxInput('val', settingData);

            return {
                id: settingId,
                $control: $control
            };
        }
    };


    SettingPath.Widget = BaseSettingWidget;

}).call(this);