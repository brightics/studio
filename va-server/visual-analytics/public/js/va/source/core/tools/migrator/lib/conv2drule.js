/**
 * Created by ji_sung.park on 2017-06-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function Conv2DRule() {
    }

    Conv2DRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['strides'] === 'undefined') {
            param['strides'] = ['1', '1'];
        }
        if (typeof param['padding'] === 'undefined') {
            param['padding'] = 'valid';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.conv2D = Conv2DRule;

}).call(this);