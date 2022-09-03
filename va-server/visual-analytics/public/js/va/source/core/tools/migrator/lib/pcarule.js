(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function PCARule() {
    }

    PCARule.prototype.migrate = function (func) {
        if (func['outData'].length == 2) {
            func['outData'].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }
    };


    Brightics.VA.Core.Tools.ModelMigrator.RuleList.pca = PCARule;

}).call(this);