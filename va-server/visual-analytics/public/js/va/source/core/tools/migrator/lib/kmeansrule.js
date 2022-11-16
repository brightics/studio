(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function KmeansRule() {
    }

    KmeansRule.prototype.migrate = function (func) {

        var param = func.param;

        delete param['features-name'];
    };


    Brightics.VA.Core.Tools.ModelMigrator.RuleList.kmeans = KmeansRule;

}).call(this);