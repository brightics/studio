/**
 * Created by ty_tree.kim on 2016-04-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SqlVerifier() {
        Brightics.VA.Core.Verifier.call(this);
    }

    SqlVerifier.prototype = Object.create(Brightics.VA.Core.Verifier.prototype);
    SqlVerifier.prototype.constructor = SqlVerifier;

    SqlVerifier.prototype.initVerifier = function () {
        this.rule = {
            id: 'sql',
            syntaxRule: 'default',
            verifyRule: 'default'
        };
    };

    SqlVerifier.prototype.verify = function (data) {
        //TODO
        var errorMessage = null;

        return errorMessage;
    };

    Brightics.VA.Core.Verifier.SqlVerifier = SqlVerifier;

}).call(this);