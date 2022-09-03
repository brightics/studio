/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VisualModelSideBarManager(parentId) {
        Brightics.VA.Core.Tools.Manager.SideBarManager.call(this, parentId);
    }

    VisualModelSideBarManager.prototype = Object.create(Brightics.VA.Core.Tools.Manager.SideBarManager.prototype);
    VisualModelSideBarManager.prototype.constructor = VisualModelSideBarManager;


    VisualModelSideBarManager.prototype.configureLayout = function () {
        this.layout = {
            dataBox: {
                id: 'dataBox',
                label: "Data Box",
                position: 'left',
                width: 261,
                manager: this,
                visible: true
            },
            objectAndProperties: {
                id: 'objectAndProperties',
                label: "Object",
                position: 'right',
                width: 338,
                manager: this,
                visible: true
            }
        };
    };

    VisualModelSideBarManager.prototype.createSideBarArea = function () {
        Brightics.VA.Core.Tools.Manager.SideBarManager.prototype.createSideBarArea.call(this);
        this.$parent.find('.brtc-va-studio-sidebar-area').addClass('padding-none');
    };

    VisualModelSideBarManager.prototype.createControls = function () {
        this.sideBar.dataBox =
            new Brightics.VA.Core.Tools.SideBar.DataBoxSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=dataBox]'),
                this.layout.dataBox
            );
        this.sideBar.objectAndProperties =
            new Brightics.VA.Core.Tools.SideBar.ObjectAndPropertiesSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=objectAndProperties]'),
                this.layout.objectAndProperties
            );
    };

    VisualModelSideBarManager.prototype.onActivated = function () {
        this.sideBar.dataBox.onActivated();
    };

    Brightics.VA.Implementation.Visual.Tools.Manager.SideBarManager = VisualModelSideBarManager;

}).call(this);