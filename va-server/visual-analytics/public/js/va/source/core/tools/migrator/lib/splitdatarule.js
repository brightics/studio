/**
 * Created by SDS on 2017-07-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SplitDataRule() {
    }

    SplitDataRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['seed'] === 'undefined') {
            param['seed'] = '';
        }
        if (typeof param['ordering'] === 'undefined') {
            param['ordering'] = 'false';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.splitData = SplitDataRule;

}).call(this);