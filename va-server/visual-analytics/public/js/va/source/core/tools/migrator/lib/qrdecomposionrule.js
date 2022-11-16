/**
 * Created by SDS on 2017-06-16.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function QRDecompositionRule() {
    }

    QRDecompositionRule.prototype.migrate = function (func) {

        var param = func.param;

        if (typeof param['computeQ'] === 'undefined') {
            param['computeQ'] = 'false';
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.qrDecomposition = QRDecompositionRule;

}).call(this);