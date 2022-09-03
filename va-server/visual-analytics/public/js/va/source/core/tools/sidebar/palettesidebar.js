/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PaletteSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    PaletteSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    PaletteSideBar.prototype.constructor = PaletteSideBar;

    PaletteSideBar.prototype.createContent = function () {
        var _this = this;

        this.$modelSideBar = $('' +
            '<div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar dataflow">' +
            '   <ul>' +
            '       <li>' + Brightics.locale.common.function + '</li>' +
            '       <li>' + Brightics.locale.common.template + '</li>' +
            '       <li>' + Brightics.locale.common.data + '</li>' +
            '   </ul>' +
            '   <div class="brtc-va-tools-sidebar-palettetab" />' +
            '   <div class="brtc-va-tools-sidebar-librarytab"></div>' +
            '   <div class="brtc-va-tools-sidebar-datatab" />' +
            '</div>');
        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);

        this.tabControl = Brightics.VA.Core.Widget.Factory.tabControl(this.$modelSideBar);

        var $paletteArea = this.$modelSideBar.find('.brtc-va-tools-sidebar-palettetab');
        this.dataFlowPalette = new Brightics.VA.Core.Views.Palette($paletteArea, {
            width: '100%',
            height: '100%',
            draggable: true,
            modelType: Brightics.VA.Implementation.DataFlow.Clazz,
            editor: this.getEditor()
        });

        var $libraryArea = this.$modelSideBar.find('.brtc-va-tools-sidebar-librarytab');
        this.libraryExplorer = new Brightics.VA.Core.Views.LibraryExplorer($libraryArea, {
            height: '100%',
            modelType: Brightics.VA.Implementation.DataFlow.Clazz,
            editor: this.getEditor()
        });

        var $dataArea = this.$modelSideBar.find('.brtc-va-tools-sidebar-datatab');
        this.dataExplorer = new Brightics.VA.Core.Views.DataExplorer($dataArea, {
            height: '100%',
            editor: this.getEditor()
        });

        this.$modelSideBar.on('selected', function (event, index) {
            var selectedIdx = index;
            if (selectedIdx === 1) {
                _this.libraryExplorer.activate();
            } else if (selectedIdx === 2) {
                _this.dataExplorer.render();
            }
        });
    };

    PaletteSideBar.prototype.appendTemplate = function (options) {
        this.libraryExplorer.appendTemplate(options);
    };

    PaletteSideBar.prototype.udfChanged = function (selection) {
        this.dataFlowPalette.udfChanged();
    };

    PaletteSideBar.prototype.templateChanged = function (selection) {
        this.libraryExplorer.templateChanged();
    };

    PaletteSideBar.prototype.onActivated = function () {
        this.libraryExplorer.refresh();
        this.dataFlowPalette.udfChanged();
    };

    PaletteSideBar.prototype.initPreferenceTarget = function () {
        this.preferenceTarget['scroll'] = this.tabControl.$tabContents.find('.brtc-va-views-palette-navigator-wrapper');
    };

    PaletteSideBar.prototype.destroy = function () {
        this.dataFlowPalette.destroy();
        this.libraryExplorer.destroy();
        this.dataExplorer.destroy();
    };

    Brightics.VA.Core.Tools.SideBar.PaletteSideBar = PaletteSideBar;
}).call(this);