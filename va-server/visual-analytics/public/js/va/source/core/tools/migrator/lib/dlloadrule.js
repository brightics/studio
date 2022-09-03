/**
 * Created by SDS on 2017-06-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function DLLoadRule() {
    }

    DLLoadRule.prototype.migrate = function (func) {
        if (!func['param']['loadType']) {
            func['param']['loadType'] = 'CSV';
        }
        if (!func['param']['input_path']) {
            func['param']['input_path'] = '';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.dlLoad = DLLoadRule;

}).call(this);