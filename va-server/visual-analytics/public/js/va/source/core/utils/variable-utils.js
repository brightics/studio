/* -----------------------------------------------------
 *  variable-utils.js
 *  Created by hyunseok.oh@samsung.com on 2018-06-26.
 * ---------------------------------------------------- */

/* global _ */
(function (root) {
    'use strict';

    var Brightics = root.Brightics;

    var wrap = function (str) {
        if (_.startsWith(str, '${=') && _.endsWith(str, '}')) {
            str = str.substring(3, str.length - 1);
        }

        return '${=' + str + '}';
    };

    var strip = function (str) {
        if (_.startsWith(str, '${=') && _.endsWith(str, '}')) {
            return str.substring(3, str.length - 1);
        }
        return str;
    };

    Brightics.VA.Core.Utils.VariableUtils = {
        wrap: wrap,
        strip: strip
    };

/* eslint-disable no-invalid-this */
}(this));
