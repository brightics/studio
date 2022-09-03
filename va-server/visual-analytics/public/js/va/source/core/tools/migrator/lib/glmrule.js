/**
 * Created by SDS on 2017-05-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function GLMRule() {
    }

    GLMRule.prototype.migrate = function (func) {
        if (func.name === 'GLM') {
            func.name = 'GLMTrain'
        }
        if (func.display.label === 'GLM') {
            func.display.label = 'GLM Train'
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.glm = GLMRule;

}).call(this);