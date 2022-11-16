/* -----------------------------------------------------
 *  condition-header-tab-context.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-20.
 * ----------------------------------------------------*/

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var Header = Brightics.VA.Implementation.DataFlow.Editors.Header;

    function ConditionHeaderTabContext(_options) {
        var options = _options || {};
        this.id = options.id;
        this.title = options.title || 'untitled';
        this.field = options.field || 'true';
        this.type = options.type;
    }

    ConditionHeaderTabContext.prototype.getId = function () {
        return this.id;
    };

    ConditionHeaderTabContext.prototype.getTitle = function () {
        return this.title;
    };

    ConditionHeaderTabContext.prototype.setTitle = function (title) {
        this.title = title;
        return this;
    };

    ConditionHeaderTabContext.prototype.getField = function () {
        return this.field;
    };

    ConditionHeaderTabContext.prototype.setField = function (field) {
        this.field = field;
        return this;
    };

    ConditionHeaderTabContext.prototype.getType = function () {
        return this.type;
    };


    Header.ConditionHeaderTabContext = ConditionHeaderTabContext;
/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
