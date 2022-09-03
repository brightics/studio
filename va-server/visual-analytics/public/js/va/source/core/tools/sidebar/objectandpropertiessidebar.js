/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ObjectAndPropertiesSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    ObjectAndPropertiesSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    ObjectAndPropertiesSideBar.prototype.constructor = ObjectAndPropertiesSideBar;

    ObjectAndPropertiesSideBar.prototype.createContent = function () {
        var _this = this;

        this.$modelSideBar = $('' +
            '<div class="brtc-va-tools-sidebar brtc-style-sidebar visual">' +
            '</div>');
        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);

        this.optionPanelManager = new Brightics.VA.Implementation.Visual.Views.OptionPanelManager(this.$modelSideBar, {
            width: '100%',
            height: '100%',
            editor: this.getEditor()
        });

    };

    ObjectAndPropertiesSideBar.prototype.selectionChanged = function (selection) {
        if (this.getEditor().getModelClazz() == Brightics.VA.Implementation.Visual.Clazz) {
            this.optionPanelManager.selectionChanged(selection);
        }
    };

    ObjectAndPropertiesSideBar.prototype.destroy = function (editor) {
        this.optionPanelManager.destroy(editor);
    };

    ObjectAndPropertiesSideBar.prototype.configureSize = function () {
        this.$parent.find('.brtc-va-studio-sidebar-area').width(this.options.width);
    };

    ObjectAndPropertiesSideBar.prototype.initPreferenceTarget = function () {
        this.preferenceTarget['scroll'] = this.$modelSideBar.find('.bcharts-ds-panel');
    };

    Brightics.VA.Core.Tools.SideBar.ObjectAndPropertiesSideBar = ObjectAndPropertiesSideBar;
}).call(this);