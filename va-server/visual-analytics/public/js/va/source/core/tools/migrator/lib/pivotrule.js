/**
 * Created by ji_sung.park on 2017-06-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function PivotRule() {
    }

    PivotRule.prototype.migrate = function (func) {
        var param = func.param;
        if (typeof param['column-labels'] === 'undefined') {
            param['column-labels'] = [param['column-label']];
            delete param['column-label'];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.pivot = PivotRule;

}).call(this);