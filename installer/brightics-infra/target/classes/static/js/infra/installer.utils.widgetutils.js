/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;

    root.Brightics.Installer.Utils.WidgetUtils = {
        retrieveWidget: function (id) {
            return typeof (id) === 'string' ? $(id) : id;
        },
        putStudioRef: function ($el, ref) {
            this.putData($el, 'brtc-installer-studio-ref', ref);
        },
        getStudioRef: function ($el) {
            var $studio = $el.closest('.brtc-installer-studio');
            return this.getData($studio, 'brtc-installer-studio-ref');
        },
        putData: function ($el, key, value) {
            $el.data(key, value);
        },
        getData: function ($el, key) {
            return $el.data(key);
        }
    }
}).call(this);