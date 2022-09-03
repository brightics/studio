(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function RandomSamplingRule() {
    }

    RandomSamplingRule.prototype.migrate = function (func) {

        var param = func.param;
        if (typeof param['method'] === 'undefined') {
            param['method'] = 'fraction';
        }
        if (typeof param['value'] === 'undefined') {
            param['value'] = '0.5';
        }
        if (typeof param['seed'] === 'undefined') {
            param['seed'] = '';
        }
        if (typeof param['shuffle'] === 'undefined') {
            param['shuffle'] = 'false';
        }

        delete param['fraction'];
        delete param['number'];
        delete param['model'];
        delete param['accuracy'];
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.randomSampling = RandomSamplingRule;

}).call(this);