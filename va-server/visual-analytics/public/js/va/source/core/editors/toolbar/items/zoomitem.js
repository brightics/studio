/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ZoomItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);

        this.createZoomContextMenu();
    }

    ZoomItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    ZoomItem.prototype.constructor = ZoomItem;

    ZoomItem.prototype.createZoomContextMenu = function () {
        var _this = this;
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        this.$ctxMenu = $('' +
            '<div class="brtc-va-editor-toolitem-zoom-ctxmenu brtc-style-editor-toolitem-zoom-ctxmenu">' +
            '   <ul>' +
            '       <li action="0.6" title="x 0.6">x 0.6</li>' +
            '       <li action="0.8" title="x 0.8">x 0.8</li>' +
            '       <li action="1.0" title="x 1.0">x 1.0</li>' +
            '   </ul>' +
            '</div>');

        this.$parent.append(this.$ctxMenu);

        this.$ctxMenu.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '56px',
            height: '180px',
            autoOpenPopup: false,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });

        editor.options.lastSelectedScale = this.$ctxMenu.find('li[action="1.0"]');

        this.$ctxMenu.on('itemclick', function (event) {
            var $el = $(event.args);

            if (editor.options.lastSelectedScale) {
                editor.options.lastSelectedScale.removeClass('selected');
            }
            editor.options.lastSelectedScale = $el;
            editor.options.lastSelectedScale.addClass('selected');

            editor.diagramEditorPage.changeScale($el.attr('action') * 1);
        });

        this.$ctxMenu.find('li[action="1.0"]').addClass('selected');

        this.ctxMenuCloseHandler = function () {
            _this.$ctxMenu.jqxMenu('close');
        };
    };

    ZoomItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.zoom,
                    "item-type": "zoom"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    ZoomItem.prototype.handleOnClick = function (event) {
        var left = $(event.target).offset().left - 16;
        var top = $(event.target).offset().top + $(event.target).height() + 4;

        this.$ctxMenu.jqxMenu('open', left, top);
        $('.brtc-va-editors-modeleditor-diagram').on('scroll', this.ctxMenuCloseHandler);
        $(window).on('resize', this.ctxMenuCloseHandler);
    };

    Brightics.VA.Core.Editors.Toolbar.ZoomItem = ZoomItem;

}).call(this);