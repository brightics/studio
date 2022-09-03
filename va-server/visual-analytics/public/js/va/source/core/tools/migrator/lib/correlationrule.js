(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function CorrelationRule() {
    }

    CorrelationRule.prototype.migrate = function (func) {

        var param = func.param;
        delete param['iteration'];
        delete param['rate'];

        // if (typeof param['sequence-column'] === 'undefined') {
        //     param['sequence-column'] = [];
        // }
        // if (typeof param['by'] === 'undefined') {
        //     param['by'] = [];
        // }
        // if (typeof param['rate'] === 'undefined' || typeof param['rate']==='number') {
        //     param['rate'] = '100';
        // }
        // if (typeof param['iteration'] === 'undefined'|| typeof param['iteration']==='number') {
        //     param['iteration'] = '1';
        // }
        // if (func['outData'].length > 1) {
        //     func['outData'] = func['outData'].slice(0, 1);
        // }
    };


    Brightics.VA.Core.Tools.ModelMigrator.RuleList.correlation = CorrelationRule;

}).call(this);