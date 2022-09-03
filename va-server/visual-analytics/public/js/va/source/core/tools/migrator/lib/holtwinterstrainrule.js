(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function HoltWintersTrainRule() {
    }

    HoltWintersTrainRule.prototype.migrate = function (func) {
        if (func['outData'].length == 1) {
            func['outData'].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }

        var param = func.param;
        if (typeof param['columns'] === 'undefined') {
            param['columns'] = param['column'] || [[]];
        }

        delete param['column'];
        delete param['groupby'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.holtWintersTrain = HoltWintersTrainRule;

}).call(this);