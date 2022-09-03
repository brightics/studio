/**
 * Created by SDS on 2017-05-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function UDGeneralRule() {
    }

    UDGeneralRule.prototype.migrate = function (func) {
        if (typeof func.display.sheet['in'] == 'undefined') {
            func.display.sheet['in'] = {'partial': [{'panel': [], 'layout': {}}], 'full': [{'panel': [], 'layout': {}}]}
        }
    };


    Brightics.VA.Core.Tools.ModelMigrator.RuleList.udf = UDGeneralRule;

}).call(this);