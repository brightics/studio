(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function EDSWaferRule() {
    }

    EDSWaferRule.prototype.migrate = function (func) {

        var param = func.param;
        var etlParam = func.etlparam;
        if (typeof param['site'] === 'undefined') {
            param['site'] = etlParam.site || '';
        }
        if (typeof param['by'] === 'undefined') {
            param['by'] = etlParam.condition.by || '';
        }
        if (typeof param['datasource'] === 'undefined') {
            param['datasource'] = 'EDS WAFER';
        }
    };


    Brightics.VA.Core.Tools.ModelMigrator.RuleList.edsWafer = EDSWaferRule;

}).call(this);