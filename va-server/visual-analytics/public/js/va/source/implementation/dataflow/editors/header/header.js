/* -----------------------------------------------------
 *  header.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-19.
 * ----------------------------------------------------*/

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var ClassUtils = this.__module__.ClassUtils;
    var EventEmitter = this.__module__.EventEmitter;
    function Header() {
    }
    ClassUtils.inherits(Header, EventEmitter);

    Header.prototype.show = function () {
        this.$el.show();
        this.onShow();
    };

    Header.prototype.hide = function () {
        this.$el.hide();
    };

    Header.prototype.getHeight = function () {
        return this.$el.outerHeight();
    };

    Header.prototype.onShow = function () {
    };

    Brightics.VA.Implementation.DataFlow.Editors.Header.Header = Header;
/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
