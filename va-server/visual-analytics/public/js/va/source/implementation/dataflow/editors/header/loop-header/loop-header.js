/* -----------------------------------------------------
 *  loop-header.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-19.
 * ----------------------------------------------------*/

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var ClassUtils = this.__module__.ClassUtils;
    var Header = Brightics.VA.Implementation.DataFlow.Editors.Header;

    function LoopHeader($parent, options) {
        this.$parent = $parent;
        this.$el = $([
            '<div class="brtc-loop-header">',
            '  <div class="brtc-loop-header-field-wrapper">',
            '  </div>',
            '</div>'
        ].join(''));

        this.data = {};
        this.$loopHeaderField = this.$el.find('.brtc-loop-header-field-wrapper');
        this.createField(this.$loopHeaderField);
        this.$parent.append(this.$el);
        this.hide();
    }

    ClassUtils.inherits(LoopHeader, Header.Header);

    LoopHeader.prototype.createField = function ($parent) {
        var _this = this;
        this.field = new Header.LoopHeaderField($parent, {});

        this.field.on('input-change', function (evt) {
            _this.emit('input-change', evt);
        });

        this.field.on('type-change', function (evt) {
            _this.emit('type-change', evt);
        });
    };

    LoopHeader.prototype.setData = function (param) {
        this.data = param;
        this.field.setData(param);
    };

    LoopHeader.prototype.render = function () {
        this.field.render();
    };

    LoopHeader.prototype.onShow = function () {
        this.field.render();
    };

    Header.LoopHeader = LoopHeader;
/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
