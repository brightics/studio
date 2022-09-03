/**
 * Created by gy84.bae on 2016-09-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SystemVariableVerifier() {
        Brightics.VA.Core.Verifier.call(this);
    }

    SystemVariableVerifier.prototype = Object.create(Brightics.VA.Core.Verifier.prototype);
    SystemVariableVerifier.prototype.constructor = SystemVariableVerifier;

    SystemVariableVerifier.prototype.initVerifier = function () {
        this.rule = {
            id: 'brtc-system-variable',
            syntaxRule: [
                {regex: /\$\{(?:[a-zA-Z_])(?:[a-zA-Z0-9_]*)\}/, token: "no-variable"},
                {regex: /\$\{(sys\.user|sys\.date)\}/g, token: "variable"}
            ],
            verifyRule: null
        }
    };

    SystemVariableVerifier.prototype.verify = function (data) {
        var errorMessage = [];
        return errorMessage;
    };

    Brightics.VA.Core.Verifier.SystemVariableVerifier = SystemVariableVerifier;

}).call(this);