(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var KEY = 'setting-chart';

    function ChartPreference(customPreference) {
        this.storageMap = {
            table: {
                number: 'chart.table.formatter.number',
                double: 'chart.table.formatter.double',
                integer: 'chart.table.formatter.integer',
                use: 'chart.table.formatter.use',
                pivot: 'chart.table.formatter.pivot'
            },
            color: {
                selectedPalette: 'chart.style.selectedColorSet',
                palette: 'chart.style.colorSet'
            }
        };

        this.customPreference = customPreference;
    }

    ChartPreference.prototype.applySetting = function () {
        this.storage = (this.customPreference)? this.customPreference : localStorage;

        this.applyNumber();
        this.applyPivot();
        this.applyCustomColorPalettes();
    };

    ChartPreference.prototype.applyNumber = function () {
        var isDefault = this.storage[this.storageMap.table.use];
        if (isDefault === 'true') {
            var options = [
                'double',
                'integer'
            ].map((type) => {
                return {
                    type,
                    digit: this.storage[this.storageMap.table[type]]
                };
            });

            Brightics.Chart.Helper.PreferenceUtils.setTableFormatter(options);
        } else {
            Brightics.Chart.Helper.PreferenceUtils.clearTableFormatter();
        }
    };

    ChartPreference.prototype.applyPivot = function () {
        var pivotDefault = this.storage[this.storageMap.table.pivot];
        var options = [{
            pivot: pivotDefault
        }];

        Brightics.Chart.Helper.PreferenceUtils.setTableFormatter(options);
    };

    ChartPreference.prototype.applyCustomColorPalettes = function () {
        var get = function (storage, key) {
            if (typeof storage[key] !== 'undefined') return storage[key];
            return Brightics.VA.SettingStorage.DEFAULT_SETTINGS[key];
        };
        var selectedPalette = get(this.storage, this.storageMap.color.selectedPalette);
        var colorSet = JSON.parse(get(this.storage, this.storageMap.color.palette));
        Brightics.Chart.Adonis.Preference.setColorPalette(selectedPalette, colorSet);
    };

    Brightics.VA.Preference[KEY] = ChartPreference;
}).call(this);
