/**
 * Created by SDS on 2017-10-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function TransposeRule() {
    }

    TransposeRule.prototype.migrate = function (func) {
        if (typeof func.display.sheet['in'] == 'undefined') {
            func.display.sheet['in'] = {'partial': [{'panel': [], 'layout': {}}], 'full': [{'panel': [], 'layout': {}}]}
        }
        if (typeof func.display.sheet['out'] == 'undefined') {
            func.display.sheet['out'] = {
                'partial': [{'panel': [], 'layout': {}}],
                'full': [{'panel': [], 'layout': {}}]
            }
        } else {
            if (typeof func.display.sheet.out.partial == 'undefined') {
                func.display.sheet['out'] = {
                    'partial': [{'panel': [], 'layout': {}}],
                    'full': [{'panel': [], 'layout': {}}]
                }
            }
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.transpose = TransposeRule;

}).call(this);