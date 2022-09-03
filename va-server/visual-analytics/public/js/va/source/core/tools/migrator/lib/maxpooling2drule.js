/**
 * Created by SDS on 2017-10-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function MaxPooling2DRule() {
    }

    MaxPooling2DRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['strides'] === 'undefined') {
            param['strides'] = [];
        }
        if (typeof param['padding'] === 'undefined') {
            param['padding'] = 'valid';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.maxPooling2D = MaxPooling2DRule;

}).call(this);