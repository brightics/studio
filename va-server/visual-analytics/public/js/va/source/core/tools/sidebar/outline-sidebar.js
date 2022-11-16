/* -----------------------------------------------------
 *  outline-sidebar.js
 *  Created by hyunseok.oh@samsung.com on 2018-07-11.
 * ---------------------------------------------------- */

(function (root) {
    'use strict';
    var Brightics = root.Brightics;

    function OutlineSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    OutlineSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    OutlineSideBar.prototype.constructor = OutlineSideBar;


    OutlineSideBar.prototype.createContent = function () {
        var _this = this;

        this.$modelSideBar = $('' +
            '<div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar dataflow">' +
            // '   <ul>' +
            // '       <li>Local</li>' +
            // '       <li>Global</li>' +
            // '   </ul>' +
            '   <div class="brtc-va-tools-sidebar-outline brtc-va-tools-sidebar-local-outline selected"></div>' +
            '   <div class="brtc-va-tools-sidebar-outline brtc-va-tools-sidebar-global-outline"></div>' +
            '</div>');

        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);

        // this.tabControl = Brightics.VA.Core.Widget.Factory.tabControl(this.$modelSideBar);

        var $localOutlineArea = this.$modelSideBar.find('.brtc-va-tools-sidebar-local-outline');
        // var $globalOutlineArea = this.$modelSideBar.find('.brtc-va-tools-sidebar-global-outline');

        var projectId = this.getEditor().getEditorInput().getProjectId();
        var model = this.getEditor().getModel();

        this.localOutline = new Brightics.VA.Core.Views.LocalOutline({
            $parent: $localOutlineArea,
            projectId: projectId,
            model: model,
            editor: this.getEditor()
        });

        // this.globalOutline = new Brightics.VA.Core.Views.GlobalOutline({
        //     $parent: $globalOutlineArea,
        //     projectId: projectId,
        //     model: model
        // });
    };

    OutlineSideBar.prototype.onModelChange = function (command) {
        this.localOutline.refresh('all');
        // this.globalOutline.refresh();
    };

    OutlineSideBar.prototype.onFnUnitSelect = function (fnUnit) {
        this.localOutline.refresh('underline', fnUnit ? fnUnit.fid : undefined);
    };

    OutlineSideBar.prototype.refresh = function () {
        this.localOutline.refresh('all');
    };

    OutlineSideBar.prototype.updateStatus = function (event) {
        this.localOutline.refresh('status', {fid: event.fid, status: event.status});
    };

    Brightics.VA.Core.Tools.SideBar.OutlineSideBar = OutlineSideBar;
/* eslint-disable no-invalid-this */
}(this));
