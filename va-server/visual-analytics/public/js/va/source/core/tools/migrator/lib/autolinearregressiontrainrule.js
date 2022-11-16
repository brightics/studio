/**
 * Created by SDS on 2017-10-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AutoLinearRegressionTrainRule() {
    }

    AutoLinearRegressionTrainRule.prototype.migrate = function (func) {
        var param = func.param;

        if (Array.isArray(param['label-col'])) {
            param['label-col'] = param['label-col'][0];
        }

        if (typeof param['search-method'] === 'undefined') {
            param['search-method'] = 'random';
        }

        if (func[OUT_DATA].length < 5) this.changeOutTable(func);

    };

    AutoLinearRegressionTrainRule.prototype.changeOutTable = function (func) {
        var outData = func[OUT_DATA];
        var newOutData = [];

        newOutData.unshift(outData.pop());
        newOutData.unshift(outData.pop());
        newOutData.unshift(Brightics.VA.Core.Utils.IDGenerator.table.id());
        newOutData.unshift(Brightics.VA.Core.Utils.IDGenerator.table.id());

        while (outData.length > 0) {
            newOutData.unshift(outData.pop());
        }

        func[OUT_DATA] = newOutData;
    };
    
    Brightics.VA.Core.Tools.ModelMigrator.RuleList.autoLinearRegressionTrain = AutoLinearRegressionTrainRule;

}).call(this);