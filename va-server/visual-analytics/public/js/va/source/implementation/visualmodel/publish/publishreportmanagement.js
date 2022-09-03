/**
 * Created by SDS on 2017-04-20.
 */
/**
 * Created by hs79.shin on 2016-11-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    function PublishReportManagement(parentId, options) {
        options.setContents(Brightics.VA.Core.Utils.ModelUtils.extendModel(options.getContents()));

        this.parentId = parentId;
        this.options = {
            width: '100%',
            height: '100%',
            clazz: 'visual',
            editorInput: options
        };

        Brightics.VA.Implementation.Visual.Editor.call(this, this.parentId, this.options);
    }

    PublishReportManagement.prototype = Object.create(Brightics.VA.Implementation.Visual.Editor.prototype);
    PublishReportManagement.prototype.constructor = PublishReportManagement;

    PublishReportManagement.prototype.retrieveParent = function () {
        this.$parent = Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    PublishReportManagement.prototype.createCommandManager = function () {
        this.commandManager = new Brightics.VA.Core.CommandManager(this.options.editorInput.getContents());
    };

    PublishReportManagement.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-visualeditor brtc-va-editor brtc-style-editor">' +
            '   <div class="brtc-style-editor-toolbar-area brtc-style-s-editor-toolbar-area" />' +
            '   <div class="brtc-style-editor-diagram-area brtc-style-editor-diagram-area-publish" />' +
            '</div>');
        this.$mainControl.css({
            width: '100%',
            height: '100%'
        });
        this.$parent.append(this.$mainControl);
        Brightics.VA.Core.Utils.WidgetUtils.putEditorRef(this.$mainControl, this);

        this.createDiagramEditorPage(this.$mainControl.find('.brtc-style-editor-diagram-area'));

        this.removeToolbar(this.$mainControl);
    };

    PublishReportManagement.prototype.removeToolbar = function (main) {
        main.find('.brtc-style-editor-toolitem[item-type=add-page]').css({
            display:'none'
        });

        main.find('.brtc-style-editor-toolitem[item-type=delete-page]').css({
            display:'none'
        });

        main.find('.brtc-va-content-remove-button').css({
            display:'none'
        });
    };

    Brightics.VA.Implementation.Visual.PublishReportManagement = PublishReportManagement;

}).call(this);