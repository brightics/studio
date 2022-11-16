/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EditorLayoutManager($target) {
        this.$target = $target;
    }

    EditorLayoutManager.prototype.setWidth = function (width) {
        if (width) this.$target.width(width);
    };

    EditorLayoutManager.prototype.setHeight = function (height) {
        if (height) this.$target.width(height);
    };

    EditorLayoutManager.prototype.setMarginLeft = function (margin) {
        return this.$target.css('margin-left', margin);
    };

    EditorLayoutManager.prototype.getWidth = function () {
        return this.$target.width();
    };

    EditorLayoutManager.prototype.getHeight = function () {
        return this.$target.height();
    };

    EditorLayoutManager.prototype.getPaddingLeft = function () {
        return Number(this.$target.css('padding-left').replace('px', ''));
    };

    EditorLayoutManager.prototype.getPaddingRight = function () {
        return Number(this.$target.css('padding-right').replace('px', ''));
    };

    Brightics.VA.Core.Tools.Manager.EditorLayoutManager = EditorLayoutManager;

}).call(this);