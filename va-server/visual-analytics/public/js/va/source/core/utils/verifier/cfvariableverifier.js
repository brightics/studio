/**
 * Created by gy84.bae on 2016-09-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CFVariableVerifier() {
        Brightics.VA.Core.Verifier.call(this);
    }

    CFVariableVerifier.prototype = Object.create(Brightics.VA.Core.Verifier.prototype);
    CFVariableVerifier.prototype.constructor = CFVariableVerifier;

    CFVariableVerifier.prototype.initVerifier = function () {
        this.rule = {
            id: 'brtc-controlflow-variable',
            syntaxRule: [
                {regex: /\$\{(?:[a-zA-Z0-9_]*)\}/, token: "variable"} // /\$(?:[a-zA-z_])(?:[a-zA-Z0-9_]*)/
            ],
            verifyRule: null
        }
    };

    CFVariableVerifier.prototype.verify = function (data) {
        var tokenResult = this.getTokenData(data);
        var errorMessage = [];
        if (tokenResult.length == 0 || tokenResult[0].offset != 0 || data.length != tokenResult[0].length) {
            errorMessage.push({
                type: 'Invalid Syntax',
                message: 'There is syntax error in this expression'
            });
        }
        return errorMessage;
    };

    CFVariableVerifier.prototype.getTokenData = function (data) {
        var offset = 0;
        var tokenResult = [];
        while (offset < data.length) {
            var find = false;
            for (var i in this.rule.syntaxRule) {
                var ret = this.rule.syntaxRule[i].regex.exec(data.toString().substring(offset));
                if (ret && ret.index == 0) {
                    tokenResult.push({
                        token: this.rule.syntaxRule[i].token,
                        matched: ret[0],
                        offset: offset,
                        length: ret[0].length
                    });

                    offset += ret[0].length;
                    find = true;
                    break;
                }
            }

            if (find === false) {
                offset++;
            }
        }

        return tokenResult;
    };

    Brightics.VA.Core.Verifier.CFVariableVerifier = CFVariableVerifier;

}).call(this);