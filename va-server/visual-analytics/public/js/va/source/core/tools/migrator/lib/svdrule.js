/**
 * Created by sds on 2017-10-30.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SVDRule() {
    }

    SVDRule.prototype.migrate = function (func) {
        if (func['outData'].length == 3) {
            func['outData'].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.svd = SVDRule;

}).call(this);