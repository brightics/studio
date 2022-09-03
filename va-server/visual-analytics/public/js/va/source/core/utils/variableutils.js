/* -----------------------------------------------------
 *  variableutils.js
 *  Created by hyunseok.oh@samsung.com on 2018-05-24.
 * ---------------------------------------------------- */


/* global _ */
(function () {
    'use strict';
    var root = this;
    var toNumber = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return 0;
        return Number(toString(Number(val)));
    };

    var toString = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return '';
        if (_.isNumber(val)) {
            if (_.isNaN(val)) return '';
            return val.toString();
        }
        return val;
    };

    var isWrapped = function (val) {
        return _.startsWith(val, '${=') && _.endsWith(val, '}');
    };

    var strip = function (_val) {
        var val = _val || '';
        return isWrapped(val) ? val.substring(3, val.length - 1) : val;
    };

    var wrap = function (val) {
        return '${=' + val + '}';
    }

    root.Brightics.VA.Core.Utils.VariableUtils = {
        convertValueByType: function (prvType, nxtType, val) {

        },
        toString: toString,
        toNumber: toNumber,
        strip: strip,
        wrap: wrap
    };

/* eslint-disable no-invalid-this */
}.call(this));
