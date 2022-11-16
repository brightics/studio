/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataBoxSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    DataBoxSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    DataBoxSideBar.prototype.constructor = DataBoxSideBar;

    DataBoxSideBar.prototype.createContent = function () {
        this.$modelSideBar = $('' +
            '<div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar visual">' +
            '</div>');

        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);

        this.dataSourceExplorer = new Brightics.VA.Implementation.Visual.Views.DataSourceExplorer(this.$modelSideBar, {
            width: '100%',
            height: '100%',
            editor: this.getEditor()
        });
    };

    DataBoxSideBar.prototype.destroy = function (editor) {
        this.dataSourceExplorer.destroy(editor);
    };

    DataBoxSideBar.prototype.configureSize = function () {
        this.$parent.find('.brtc-va-studio-sidebar-area').width(this.options.width);
    };

    DataBoxSideBar.prototype.selectionChanged = function (selection) {
    };

    DataBoxSideBar.prototype.onActivated = function () {
        this.dataSourceExplorer.editorChanged(this.getEditor());
    };

    DataBoxSideBar.prototype.initPreferenceTarget = function () {
        this.preferenceTarget['scroll'] = this.$modelSideBar.find('.bcharts-ds-panel');
    };

    Brightics.VA.Core.Tools.SideBar.DataBoxSideBar = DataBoxSideBar;
}).call(this);