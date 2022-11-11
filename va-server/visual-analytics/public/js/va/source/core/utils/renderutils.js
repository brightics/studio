/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var mdConverter = window.markdownit && new window.markdownit();

    root.Brightics.VA.Core.Utils.RenderUtils = {
        md: function ($parent, mdText) {
            var $contents = $('<div class="brtc-va-md-content"></div>');
            $parent.append($contents);

            $contents.html(mdConverter.render(mdText));

            return $contents;
        },
        html: function ($parent, htmlText) {
            const $contents = $('<div class="brtc-va-html-content"></div>');
            const $iframe = $(`<iframe width="100%" height="${$parent.parent().height()}px" style="border: 1px solid #656eea;"></iframe>`);

            const resizeEvt = () => {
                if(!($parent.height() && $iframe.height())) {
                    $(window).off('resize', resizeEvt);
                }else if((Math.abs($parent.parent().height() - $iframe.height()) > 7) ){
                    $iframe.css('height', $parent.parent().height());
                }
            }
            $(window).on('resize', resizeEvt);
            $parent.append($contents);
            $contents.append($iframe);

            $iframe[0].contentWindow.document.open();
            $iframe[0].contentWindow.document.write(htmlText);
            $iframe[0].contentWindow.document.close();

            return $contents;
        },
        image: function ($parent, imageText) {
            var $contents = $('<div class="brtc-va-image-content"></div>');
            var $imageTag = $('<img></img>');
            $parent.append($contents);
            $contents.append($imageTag);

            $imageTag.attr('src', imageText);

            return $contents;
        },
        chart: function ($target, options) {
            $target.bcharts(options);
        }
    }
}).call(this);