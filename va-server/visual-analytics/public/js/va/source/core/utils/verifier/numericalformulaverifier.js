/**
 * Created by ty_tree.kim on 2016-04-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NumericalFormulaVerifier() {
        Brightics.VA.Core.Verifier.call(this);
    }

    NumericalFormulaVerifier.prototype = Object.create(Brightics.VA.Core.Verifier.prototype);
    NumericalFormulaVerifier.prototype.constructor = NumericalFormulaVerifier;

    NumericalFormulaVerifier.prototype.initVerifier = function () {
        this.rule = {
            id: 'brtc-va-numerical-formula-rule',
            syntaxRule: [
                {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
                {regex: /\[(?:[^\"\[\]\(\)])*?\]/, token: "column"},
                {regex: /true|false|null|undefined/, token: "atom"},
                {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
                {regex: /(?:pow|exp|log10|log2|ln|sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|degrees|radians|round|floor|ceil|sqrt|abs)\b/, token: "func"},
                {regex: /[-+\/*%]+/, token: "operator"},
                {regex: /[\{\[\(]/, indent: true},
                {regex: /[\}\]\)]/, dedent: true}
            ],
            verifyRule: null
        };
    };

    NumericalFormulaVerifier.prototype.verify = function (data) {
        var tokenResult = this.getTokenData(data);

        var errorMessage = [];
        if(tokenResult.length == 0 || tokenResult[0].offset != 0){
            errorMessage.push({
                type:'Invalid Syntax',
                message: 'There is syntax error in this expression'
            });
        }

        return errorMessage;
    };

    NumericalFormulaVerifier.prototype.getTokenData = function (data) {
        var offset = 0;
        var tokenResult = [];
        while (offset < data.length ) {
            var find = false;
            for (var i in this.rule.syntaxRule) {
                var ret = this.rule.syntaxRule[i].regex.exec(data.substring(offset));
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

    Brightics.VA.Core.Verifier.NumericalFormulaVerifier = NumericalFormulaVerifier;

}).call(this);