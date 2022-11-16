/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function MinimapBoat($parent, options) {
        Brightics.VA.Core.Editors.Diagram.Boat.call(this, $parent, options);
    }

    MinimapBoat.prototype = Object.create(Brightics.VA.Core.Editors.Diagram.Boat.prototype);
    MinimapBoat.prototype.constructor = MinimapBoat;

    MinimapBoat.prototype.createContents = function () {
        var _this = this;

        this.$paper = $('<div class="brtc-va-editors-diagram-minimap-paper"></div>');
        this.$window = $('<div class="brtc-va-editors-diagram-minimap-window"></div>');

        this.$boat.append(this.$paper).append(this.$window);

        this.$wrapper = Studio
            .getEditorContainer()
            .getActiveModelEditor()
            .getDiagramEditorPageArea()
            .find('.brtc-va-editors-diagram-diagrameditorpage'); 

        this.$window.draggable({
            containment: 'parent',
            stop: function () {
                var pos = $(this).position();
                var size = _this.getPaperSize();
                var $miniSvg = _this.$paper.find('svg');
                var widthScale = $miniSvg.width() / size.width;
                var heightScale = $miniSvg.height() / size.height;
                var scrollLeft = pos.left / widthScale;
                var scrollTop = pos.top / heightScale;
                _this.$wrapper.scrollLeft(scrollLeft).scrollTop(scrollTop);
                _this.updateMiniMapWindow();
            }
        });

        if (Brightics.VA.SettingStorage.getValue('editor.minimap.visible') !== 'true') _this.$boatArea.addClass('closed');


        this.miniPaper = new joint.dia.Paper({
            el: this.$paper,
            width: 190,
            height: 90,
            model: this.options.diagramEditorPage.graph,
            theme: 'none'
        });
        this.miniPaper.scale(.3);
        this.miniPaper.$el.css('pointer-events', 'none');
    };

    MinimapBoat.prototype.updateMiniMapWindow = function () {
        var _this = this;
        if (this.miniPaper) {
            var size = this.getPaperSize();

            var baseWidth = this.$boat.width();
            var baseHeight = this.$boat.height();
            var miniScale;
            if (size.height * baseWidth / size.width <= baseHeight) {
                miniScale = baseWidth / size.width;
                this.miniPaper.setDimensions(baseWidth, size.height * miniScale);
            } else {
                miniScale = baseHeight / size.height;
                this.miniPaper.setDimensions(size.width * miniScale, baseHeight);
            }
            this.miniPaper.scale(miniScale * this.options.diagramEditorPage.getOptions().scale);

            this.$window.css({
                width: this.$wrapper.width() * miniScale,
                height: this.$wrapper.height() * miniScale,
                left: this.$wrapper.scrollLeft() * miniScale,
                top: this.$wrapper.scrollTop() * miniScale
            });

            if (this.$boat.width() != Math.max(190, this.miniPaper.options.width)) {
                this.$boat.width(Math.max(190, this.miniPaper.options.width));
            }
            if (this.$boat.height() != Math.max(90, this.miniPaper.options.height)) {
                this.$boat.height(Math.max(90, this.miniPaper.options.height));
            }
        }
    };

    MinimapBoat.prototype.getPaperSize = function () {
        return this.options.diagramEditorPage.getPaperSize();
    };

    MinimapBoat.prototype.getTitle = function () {
        return Brightics.locale.common.minimap;
    };

    Brightics.VA.Core.Editors.Diagram.MinimapBoat = MinimapBoat;

}).call(this);