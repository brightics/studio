/**
 * Created by SDS on 2017-11-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function HierarchicalClusteringRule() {
    }

    HierarchicalClusteringRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['key-col'] === 'undefined') {
            param['key-col'] = '';
        }

        delete param['hold-columns'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.hierarchicalClustering = HierarchicalClusteringRule;

}).call(this);