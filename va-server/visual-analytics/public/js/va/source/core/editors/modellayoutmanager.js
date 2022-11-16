/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ModelLayoutManager(editor) {
        this.editor = editor;
        this.init();
    }

    ModelLayoutManager.prototype.init = function () {
        this.$editor = this.editor.getMainArea();
    };

    ModelLayoutManager.prototype.getEditor = function () {
        return this.editor;
    };

    ModelLayoutManager.prototype.getSideBarManager = function () {
        return this.editor.getSideBarManager();
    };

    ModelLayoutManager.prototype.getToolbar = function () {
        return this.editor.getToolbar();
    };

    ModelLayoutManager.prototype.setWidth = function (width) {
        if (width) this.$editor.width(width);
    };

    ModelLayoutManager.prototype.setHeight = function (height) {
        if (height) this.$editor.height(height);
    };

    ModelLayoutManager.prototype.setMarginLeft = function (margin) {
        return this.$editor.css('margin-left', margin);
    };

    ModelLayoutManager.prototype.getWidth = function () {
        return this.$editor.width();
    };

    ModelLayoutManager.prototype.getHeight = function () {
        return this.$editor.height();
    };

    ModelLayoutManager.prototype.getPaddingLeft = function () {
        return Number(this.$editor.css('padding-left').replace('px', ''));
    };

    ModelLayoutManager.prototype.getPaddingRight = function () {
        return Number(this.$editor.css('padding-right').replace('px', ''));
    };

    ModelLayoutManager.prototype.getMainArea = function () {
        return this.editor.getMainArea();
    };

    ModelLayoutManager.prototype.getLeftTabBarArea = function () {
        return this.editor.getLeftTabBarArea();
    };

    ModelLayoutManager.prototype.getRightTabBarArea = function () {
        return this.editor.getRightTabBarArea();
    };

    ModelLayoutManager.prototype.handleEditorSelectionChange = function (selection) {
        for (var i in this.editorSelectionChangeListener) {
            this.editorSelectionChangeListener[i].selectionChanged(selection);
        }
    };

    ModelLayoutManager.prototype.initEditorSelectionChangeListener = function () {
        var _this = this;

        this.editor.$mainControl.bind('editorSelectionChanged', function (event, selection) {
            _this.handleEditorSelectionChange(selection);
        });

        this.editorSelectionChangeListener = [];
        for (var key in this.editor.getSideBarManager().getSideBars()) {
            this.editorSelectionChangeListener.push(this.editor.getSideBarManager().getSideBars()[key]);
        }
    };

    ModelLayoutManager.prototype.initTemplateChangeListener = function () {
    };

    ModelLayoutManager.prototype.handleOnActivate = function () {
        this.getSideBarManager().onActivated();
    };

    ModelLayoutManager.prototype.handleUDFChanged = function (selection) {
    };

    ModelLayoutManager.prototype.handleTemplateChanged = function (selection) {
    };

    ModelLayoutManager.prototype.handleExpandStatusChanged = function () {
        var sideBarManager = this.getSideBarManager();

        if (!sideBarManager) return;

        var $splitter = this.getSplitter();

        var tabBarWidth = this.editor.getLeftTabBarArea().height();
        let sideBarWidth = sideBarManager.getLeftSideBarWidth() + sideBarManager.getRightSideBarWidth();
        if (sideBarManager.isOpen('left')) sideBarWidth += tabBarWidth;
        if (sideBarManager.isOpen('right')) sideBarWidth += tabBarWidth;

        let marginLeft = (sideBarManager.isOpen('left')) ? sideBarManager.getLeftSideBarWidth() + tabBarWidth : tabBarWidth;
        $splitter.css('width', 'calc(100% - ' + sideBarWidth + 'px)').css('margin-left', marginLeft);

        // for (var key in layout) {
        //     if (layout[key].visible) {
        //         sideBarWidth = sideBarWidth + layout[key].width + tabBarWidth;
        //
        //         var sideBarWidth = sideBarManager.getLeftSideBarWidth() + sideBarManager.getRightSideBarWidth();
        //         if (sideBarManager.isOpen('left')) sideBarWidth += tabBarWidth;
        //         if (sideBarManager.isOpen('right')) sideBarWidth += tabBarWidth;
        //
        //         if (layout[key].position === 'left') marginLeft = layout[key].width;
        //     }
        // }
    };

    ModelLayoutManager.prototype.destroy = function () {
    };

    ModelLayoutManager.prototype.getFnUnit = function () {
        // TODO: 일단 refreshModelInfo 동작을 위해서
        // Brightics.VA.Implementation.DataFlow.ModelLayoutManager에 있던 getFnUnit 이동하였음.
        // getFnUnit을 ModelEditor에서 호출하는데 구조가 꼬여있는 것 같음.
        return this.fnUnit || undefined;
    };

    ModelLayoutManager.prototype.refreshModelInfo = function () {
        var model = this.getEditor().getActiveModel();
        var fnUnit = this.getFnUnit();

        var mid = (model) ? (model.mid) : (undefined);
        var fid = (fnUnit) ? (fnUnit.fid) : (undefined);
        this.getToolbar().navigator.buildNavigator(mid, fid);
    };

    ModelLayoutManager.prototype.getSplitter = function () {
        return this.editor.getMainArea().find('.brtc-va-editors-modeleditor-splitter');
    };

    ModelLayoutManager.prototype.adjustLayout = function () {
        this.setDiagramHeight();
        this.setEditorWidth();
    };

    ModelLayoutManager.prototype.setDiagramHeight = function () {
    };

    ModelLayoutManager.prototype.setEditorWidth = function () {
        var $splitter = this.getSplitter();
        var $tabBarArea = this.editor.getLeftTabBarArea();

        //아프지만 일단 항상 두개가 있다고 가정... 아직 top bottom에 관한 부분이 없으니..
        $splitter
            .css('margin-left', $tabBarArea.height())  //rotation
            .css('width', 'calc(100% - ' + $tabBarArea.height() * 2 + 'px)');  //rotation
    };

    Brightics.VA.Core.Editors.ModelLayoutManager = ModelLayoutManager;

}).call(this);