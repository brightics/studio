/**
 * Created by ty_tree.kim on 2016-04-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Verifier() {
        this.initVerifier();
    }

    Verifier.prototype.initVerifier = function () {
        //Abstract function
    };

    Verifier.prototype.getRule = function () {
        return this.rule;
    };

    Verifier.prototype.getRuleMode = function () {
        return (this.rule) ? this.rule.id : undefined;
    };

    Verifier.prototype.getSyntaxRule = function () {
        return (this.rule) ? this.rule.syntaxRule : undefined;
    };

    Verifier.prototype.getVerifyRule = function () {
        return (this.rule) ? this.rule.verifyRule : undefined;
    };

    Verifier.prototype.verify = function (data) {
        //Abstract function
    };

    Verifier.prototype.getTokenData = function (data) {
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

    Brightics.VA.Core.Verifier = Verifier;

}).call(this);