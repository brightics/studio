/**
 * Created by SDS on 2017-06-16.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function MulticlassClassificationEvaluation() {
    }

    MulticlassClassificationEvaluation.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['groupby'] === 'undefined') {
            param['groupby'] = [];
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.multiclassClassificationEvaluation = MulticlassClassificationEvaluation;

}).call(this);