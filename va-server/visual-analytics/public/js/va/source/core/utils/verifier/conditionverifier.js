/**
 * Created by ty_tree.kim on 2016-04-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ConditionVerifier() {
        Brightics.VA.Core.Verifier.call(this);
    }

    ConditionVerifier.prototype = Object.create(Brightics.VA.Core.Verifier.prototype);
    ConditionVerifier.prototype.constructor = ConditionVerifier;

    ConditionVerifier.prototype.initVerifier = function () {
        this.rule = {
            id: 'brtc-va-condition-rule',
            syntaxRule: [
                {regex: /\[(?:[^\"\[\]\(\)])*?\]/, token: "column"},
                {regex: /true|false|null|undefined/, token: "atom"},
                {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
                {regex: /[-+\/*=<>!]+/, token: "operator"},
                {regex: /([A-Z])\w+/, token: "string"},
                {regex: /[\{\[\(]/, indent: true},
                {regex: /[\}\]\)]/, dedent: true}
            ],
            verifyRule: null
        };
    };

    ConditionVerifier.prototype.getTokenData = function (data) {
        var offset = 0;
        var rules = this.rule.syntaxRule;
        var tokenData = [];
        while (offset < data.length ) {
            var find = false;
            for (var i in rules) {
                var ret = rules[i].regex.exec(data.substring(offset));
                if (ret && ret.index == 0) {
                    tokenData.push(ret[0]);
                    offset += ret[0].length;
                    find = true;
                    break;
                }
            }
            if (find === false) {
                offset++;
            }
        }
        return tokenData;
    };

    ConditionVerifier.prototype.verify = function (data) {
        //TODO
        var errorMessage = null;

        return errorMessage;
    };

    Brightics.VA.Core.Verifier.ConditionVerifier = ConditionVerifier;

}).call(this);