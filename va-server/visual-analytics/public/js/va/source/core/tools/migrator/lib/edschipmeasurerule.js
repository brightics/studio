(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function EDSChipMeasureRule() {
    }

    EDSChipMeasureRule.prototype.migrate = function (func) {

        var param = func.param;
        var etlParam = func.etlparam;
        if (typeof param['site'] === 'undefined') {
            param['site'] = etlParam.site || '';
        }
        if (typeof param['by'] === 'undefined') {
            param['by'] = etlParam.condition.by || '';
        }
        if (typeof param['datasource'] === 'undefined') {
            param['datasource'] = 'EDS CHIP MEASURE';
        }
    };


    Brightics.VA.Core.Tools.ModelMigrator.RuleList.edsChipMeasure = EDSChipMeasureRule;

}).call(this);