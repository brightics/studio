(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Preference(customPreference) {
        this.init();
        this.customPreference = customPreference;
    }

    Preference.prototype.init = function () {
        this.preferenceMap = {};

        for (var key in Brightics.VA.Setting.Registry) {
            if (Brightics.VA.Preference[key]) this.preferenceMap[key] = new Brightics.VA.Preference[key](this.customPreference);
        }

        this.applySetting();
    };

    Preference.prototype.applySetting = function () {
        for (var key in this.preferenceMap) {
            this.preferenceMap[key].applySetting();
        }
    };

    Preference.prototype.preferenceChanged = function () {
        this.applySetting();
    };

    Brightics.VA.Preference = Preference;

}).call(this);