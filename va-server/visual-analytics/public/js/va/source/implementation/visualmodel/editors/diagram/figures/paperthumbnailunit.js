/**
 * Created by SDS on 2017-03-15.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const WRAPPER_SIZE = {
        width: 93,
        height: 131
    };

    function PaperThumbnailUnit(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();

        this.createControls();
    }

    PaperThumbnailUnit.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    PaperThumbnailUnit.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-style-figure-paperthumbnail" id="' + this.options.page.id + '">' +
            '   <div>' +
            '       <div class="brtc-style-margin-bottom-5"><span class="page-index">' + (this.options.pageIndex + 1) + '</span>&nbsp;page</div>' +
            '       <div class="brtc-style-figure-thumbnailwrapper brtc-style-flex-center ui-selectee selectee" page-id="' + this.options.page.id + '">' +
            '       </div>' +
            '   </div>' +
            '   <div class="brtc-style-flex-column">' +
            '       <div class="brtc-style-btn-close" />' +
            '       <div class="brtc-style-btn-drag"><span></span></div>' +
            '   </div>' +
            '</div>');

        var $elementInIndex = this.$parent.find('.brtc-style-figure-paperthumbnail').eq(this.options.pageIndex);
        if ($elementInIndex.length == 1) this.$mainControl.insertBefore($elementInIndex);
        else this.$parent.append(this.$mainControl);

        this.$mainControl.find('.brtc-style-figure-thumbnailwrapper').css({
            width: WRAPPER_SIZE.width + 'px',
            height: WRAPPER_SIZE.height + 'px'
        });

        this.$mainControl.find('.brtc-style-btn-close').click(function () {
            var editorPage = _this.options.editor.getDiagramEditorPage();
            if (_this.options.editor.getModel().getPages().length === 1) {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('At least one page must exist on report.');
                return;
            }

            var closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    var command = editorPage.createRemovePageCommand(_this.options.page.id);
                    editorPage.executeCommand(command);
                }
            };
            Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Do you want to delete page?', closeHandler);
        });
    };

    PaperThumbnailUnit.prototype.updatePageIndex = function (index) {
        this.options.pageIndex = index;
        this.$mainControl.find('.page-index').text(this.options.pageIndex + 1);
        this.$parent.children().eq(index).insertBefore(this.$mainControl);
    };

    PaperThumbnailUnit.prototype.setThumbnail = function ($thumbnail) {
        $thumbnail.addClass('brtc-style-figure-thumbnail');

        $thumbnail = this._configureThumbnailSize($thumbnail);

        this.$mainControl.find('.brtc-va-visual-page').remove();
        this.$mainControl.find('.brtc-style-figure-thumbnailwrapper').prepend($thumbnail);
    };

    PaperThumbnailUnit.prototype._configureThumbnailSize = function ($thumbnail) {
        $thumbnail.css('width', 'auto');
        $thumbnail.css('margin', '0px');
        var display = this.options.editor.getModel().report.display;

        $thumbnail.removeClass('brtc-style-min-full');


        var scale = Math.min(WRAPPER_SIZE.width / display.width, WRAPPER_SIZE.height / display.height);
        $thumbnail.css({
            '-webkit-transform': 'scale(' + scale + ')',
            '-moz-transform': 'scale(' + scale + ')',
            '-ms-transform': 'scale(' + scale + ')',
            '-o-transform': 'scale(' + scale + ')',
            'transform': 'scale(' + scale + ')',
            'display': 'block'
        });

        return $thumbnail;
    };

    PaperThumbnailUnit.prototype.destroy = function () {
        this.$mainControl.remove();
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.PaperThumbnailUnit = PaperThumbnailUnit;

}).call(this);