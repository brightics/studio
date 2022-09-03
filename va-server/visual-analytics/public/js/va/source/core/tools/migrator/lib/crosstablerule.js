/**
 * Created by SDS on 2017-12-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function CrossTableRule() {
    }

    CrossTableRule.prototype.migrate = function (func) {
        var param = func.param;

        if (typeof param['row-total-col'] === 'undefined') {
            param['row-total-col'] = param['row-total-name'];
        }
        if (typeof param['col-total-row'] === 'undefined') {
            param['col-total-row'] = param['col-total-name'];
        }

        delete param['row-total-name'];
        delete param['col-total-name'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.crossTable = CrossTableRule;

}).call(this);