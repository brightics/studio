(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function AnovaRule() {
    }

    AnovaRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['flag'] === 'undefined') {
            param['flag'] = 'true';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.anova = AnovaRule;

}).call(this);