/**
 * Created by ty_tree.kim on 2016-04-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ScalaVerifier() {
        Brightics.VA.Core.Verifier.call(this);
    }

    ScalaVerifier.prototype = Object.create(Brightics.VA.Core.Verifier.prototype);
    ScalaVerifier.prototype.constructor = ScalaVerifier;

    ScalaVerifier.prototype.initVerifier = function () {
        this.rule = {
            id: 'text/x-scala',
            syntaxRule: 'default',
            verifyRule: 'default'
        };
    };

    ScalaVerifier.prototype.verify = function (data) {
        //TODO
        var errorMessage = null;

        return errorMessage;
    };

    Brightics.VA.Core.Verifier.ScalaVerifier = ScalaVerifier;

}).call(this);