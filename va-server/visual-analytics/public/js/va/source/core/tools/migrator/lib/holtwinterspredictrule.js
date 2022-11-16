(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function HoltWintersPredictRule() {
    }

    HoltWintersPredictRule.prototype.migrate = function (func) {
        var param = func.param;

        delete param['column'];
        delete param['groupby'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.holtWintersPredict = HoltWintersPredictRule;

}).call(this);