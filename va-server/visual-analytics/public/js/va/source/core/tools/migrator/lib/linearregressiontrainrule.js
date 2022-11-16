/**
 * Created by SDS on 2017-06-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function LinearRegressionTrainRule() {
    }

    LinearRegressionTrainRule.prototype.migrate = function (func) {
        if (func['outData'].length == 1) {
            func['outData'].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
            func['outData'].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }

        if (func[OUT_DATA].length < 4) this.changeOutTable(func);
    };

    LinearRegressionTrainRule.prototype.changeOutTable = function (func) {
        func[OUT_DATA].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.linearRegressionTrain = LinearRegressionTrainRule;

}).call(this);