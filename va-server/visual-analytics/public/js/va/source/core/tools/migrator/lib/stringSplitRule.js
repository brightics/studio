/**
 * Created by sds on 2017-08-30.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function StringSplitRule() {
    }

    StringSplitRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['column'] === 'undefined') {
            param['column'] = param['columns'] || [[]];
        }
        delete param['columns'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.stringSplit = StringSplitRule;

}).call(this);