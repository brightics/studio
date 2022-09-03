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
            var $contents = $('<div class="brtc-va-html-content"></div>');
            $parent.append($contents);
            $contents.append(htmlText);

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