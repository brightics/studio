/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataflowSideBarManager(parentId) {
        Brightics.VA.Core.Tools.Manager.SideBarManager.call(this, parentId);
    }

    DataflowSideBarManager.prototype = Object.create(Brightics.VA.Core.Tools.Manager.SideBarManager.prototype);
    DataflowSideBarManager.prototype.constructor = DataflowSideBarManager;

    DataflowSideBarManager.prototype.configureLayout = function () {
        this.layout = {
            variables: {
                id: 'variables',
                label: Brightics.locale.common.variables,
                position: 'left',
                width: 330,
                manager: this
            },
            palette: {
                id: 'palette',
                label: Brightics.locale.common.palette,
                position: 'right',
                width: 440,
                manager: this
            },
            returnTable: {
                id: 'returnTable',
                label: Brightics.locale.common.returnData,
                position: 'right',
                width: 330,
                manager: this
            },
            inputTable: {
                id: 'inputTable',
                label: Brightics.locale.common.inputData,
                position: 'left',
                width: 330,
                manager: this
            },
            outline: {
                id: 'outline',
                label: Brightics.locale.common.outline,
                position: 'left',
                width: 330,
                manager: this
            },
            optSetting: {
                id: 'optSetting',
                'description-label': 'Optimization',
                label: 'Optimization Setting',
                position: 'right',
                width: 367,
                manager: this
            }
        };
    };

    DataflowSideBarManager.prototype.createControls = function () {
        this.sideBar.variables =
            new Brightics.VA.Core.Tools.SideBar.VariablesSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=variables]'),
                this.layout.variables
            );
        this.sideBar.palette =
            new Brightics.VA.Core.Tools.SideBar.PaletteSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=palette]'),
                this.layout.palette
            );
        this.sideBar.returnTable =
            new Brightics.VA.Core.Tools.SideBar.ReturnTableSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=returnTable]'),
                this.layout.returnTable
            );
        this.sideBar.inputTable =
            new Brightics.VA.Core.Tools.SideBar.InputTableSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=inputTable]'),
                this.layout.inputTable
            );
        this.sideBar.outline =
            new Brightics.VA.Core.Tools.SideBar.OutlineSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=outline]'),
                this.layout.outline
            );
        this.sideBar.optSetting =
            new Brightics.VA.Core.Tools.SideBar.OptSettingSideBar(
                this.$parent.find('.brtc-va-studio-sidebar[name=optSetting]'),
                this.layout.optSetting
            );
    };

    DataflowSideBarManager.prototype.onActivated = function () {
        this.sideBar.palette.onActivated();
    };

    DataflowSideBarManager.prototype.refresh = function () {
        this.sideBar.outline.refresh();
    };

    DataflowSideBarManager.prototype.updateStatus = function (event) {
        this.sideBar.outline.updateStatus(event);
    };

    Brightics.VA.Implementation.DataFlow.Tools.Manager.SideBarManager = DataflowSideBarManager;

}).call(this);