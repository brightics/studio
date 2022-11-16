(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var KEY = 'setting-common';

    function CommonPreference(customPreference) {
        this.storageMap = {
            common: {
                scroll: 'common.scroll.indicate.mouseover'
            }
        };

        this.customPreference = customPreference;
    }

    CommonPreference.prototype.applySetting = function () {
        this.storage = (this.customPreference)? this.customPreference : localStorage;

        this.applyScroll();
    };

    CommonPreference.prototype.applyScroll = function () {
        var isIndicate = this.storage[this.storageMap.common['scroll']];

        if (isIndicate === 'false') {
            $('body').addClass('scroll-always');
        } else {
            $('body').removeClass('scroll-always');
        }
    };

    Brightics.VA.Preference[KEY] = CommonPreference;

}).call(this);