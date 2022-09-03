/**
 * Created by ji_sung.park on 2017-05-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AssociationRuleRule() {
    }

    AssociationRuleRule.prototype.migrate = function (func) {
        var param = func.param;
        if (Array.isArray(param['column'][0]) == true){
            param['column'] = param['column'][0];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.associationRule = AssociationRuleRule;

}).call(this);