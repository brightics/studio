(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function PolynomialExpansionRule() {
    }

    PolynomialExpansionRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['hold-columns'] === 'undefined') {
            param['hold-columns'] = [[]];
        }

        delete param['degree'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.polynomialExpansion = PolynomialExpansionRule;

}).call(this);