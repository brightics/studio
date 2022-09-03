/**
 * Created by ji_sung.park on 2017-05-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BigDataLineRule() {
    }

    BigDataLineRule.prototype.migrate = function (func) {
        var param = func.param;
        if (Array.isArray(param['xcolumn'][0]) == false){
            param['xcolumn'] = [param['xcolumn']];
        }
        if (Array.isArray(param['ycolumn'][0]) == false){
            param['ycolumn'] = [param['ycolumn']];
        }

        delete param['x-step'];
        delete param['y-step'];
        delete param['line-by'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.bigDataLine = BigDataLineRule;

}).call(this);