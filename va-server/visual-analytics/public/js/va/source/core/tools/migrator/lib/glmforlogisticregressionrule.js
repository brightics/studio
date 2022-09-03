/**
 * Created by SDS on 2017-05-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function GLMForLogisticRegressionRule() {
    }

    GLMForLogisticRegressionRule.prototype.migrate = function (func) {
        if (func.name === 'GLMforLogisticRegression') {
            func.name = 'GLMTrainforLogisticRegression'
        }
        if (func.display.label === 'GLM For Logistic Regression') {
            func.display.label = 'GLM Train For Logistic Regression'
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.glmForLogisticRegression = GLMForLogisticRegressionRule;

}).call(this);