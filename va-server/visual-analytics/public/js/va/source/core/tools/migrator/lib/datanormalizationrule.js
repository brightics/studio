(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function DataNormalizationRule() {
    }

    DataNormalizationRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['min-max-cut'] === 'undefined') {
            param['min-max-cut'] = 'false';
        }

        if (func['outData'].length == 1) {
            func['outData'].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }
    };


    Brightics.VA.Core.Tools.ModelMigrator.RuleList.dataNormalization = DataNormalizationRule;

}).call(this);