/**
 * Created by gy84.bae on 2016-09-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CFConditionVerifier() {
        Brightics.VA.Core.Verifier.call(this);
    }

    CFConditionVerifier.prototype = Object.create(Brightics.VA.Core.Verifier.prototype);
    CFConditionVerifier.prototype.constructor = CFConditionVerifier;

    CFConditionVerifier.prototype.initVerifier = function () {
        this.rule = {
            id: 'brtc-control',
            syntaxRule: [
                {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
                {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
                {regex: /and|or/, token: "func"},
                {regex: /true|false|null|undefined/, token: "atom"},
                {regex: /\$\{(?:[a-zA-Z_])(?:[a-zA-Z0-9_]*)\}/, token: "variable"},
                {regex: /\$\{(sys\.user|sys\.date)\}/g, token: "variable"},
                {regex: /\+|\-|\*|div|mod|=|!=|<=?|>=?/, token: "operator"},
                {regex: /[\{\[\(]/, token: 'open-bracket', indent: true},
                {regex: /[\}\]\)]/, token: 'close-bracket', dedent: true}
            ],
            verifyRule: null
        }
    };

    CFConditionVerifier.prototype.verify = function (data) {
        var errorMessage = [];

        var tokenResult = this.getTokenData(data);

        var untokenizedString = this.checkUntokenizedString(data, tokenResult);
        if (untokenizedString.length) {
            errorMessage.push({
                type: 'Invalid Syntax',
                message: 'There is syntax error in this expression', //TODO 메세지 변경
                data: $.extend(true, [], untokenizedString)
            });
        }
        else {
            var checkOperatorPositionResult = this.checkOperatorPosition(tokenResult);
            if (checkOperatorPositionResult.length) {
                errorMessage.push({
                    type: 'Invalid Operator Position',
                    message: 'There is syntax error in this expression', //TODO 메세지 변경
                    data: $.extend(true, [], checkOperatorPositionResult)
                });
            }

            var checkOperandTypeResult = this.checkOperandType(tokenResult);
            if (checkOperandTypeResult.length) {
                errorMessage.push({
                    type: 'Invalid Operand Type',
                    message: 'There is syntax error in this expression', //TODO 메세지 변경
                    data: $.extend(true, [], checkOperandTypeResult)
                });
            }

            var bracketStackCount = this.checkBracketStack(tokenResult);
            if (bracketStackCount != 0) {
                errorMessage.push({
                    type: 'Invalid Bracket Stack',
                    message: 'There is syntax error in this expression' //TODO 메세지 변경
                });
            }
        }

        return errorMessage;
    };

    CFConditionVerifier.prototype.checkUntokenizedString = function (data, tokenResult) {
        //토큰화 못한 문자열 찾기
        var result = [];

        if (tokenResult.length == 0) {
            //token 된 것이 한개도 없을 떄
            result.push({
                'untokenized-data': data,
                startOffset: 0,
                endOffset: data.toString().length,
                'left-token-index': undefined,
                'right-token-index': undefined
            });
        }
        else if (tokenResult[0].offset != 0) {
            // 첫번째 토큰 앞에 토큰화 되지 못한 string
            result.push({
                'untokenized-data': data.toString().substring(0, tokenResult[0].offset),
                startOffset: 0,
                endOffset: tokenResult[0].offset,
                'left-token-index': undefined,
                'right-token-index': 0
            });
        }

        // 토큰 사이사이에 존재하는 untokenized-data 찾기
        for (var i = 0; i < tokenResult.length; i++) {
            var startOffset = tokenResult[i].offset + tokenResult[i].length;
            var endOffset, leftTokenIndex, rightTokenIndex;
            if (i == tokenResult.length - 1) {
                endOffset = data.toString().length;
                leftTokenIndex = i;
                rightTokenIndex = undefined;
            } else {
                endOffset = tokenResult[i + 1].offset;
                leftTokenIndex = i;
                rightTokenIndex = i + 1;
            }
            var untokenizedString = data.toString().substring(startOffset, endOffset);
            // 토큰 사이의 untokenized-data 찾기 (space는 제외)
            if (untokenizedString.trim() !== '') {
                result.push({
                    'untokenized-data': untokenizedString,
                    startOffset: startOffset,
                    endOffset: endOffset,
                    'left-token-index': leftTokenIndex,
                    'right-token-index': rightTokenIndex
                });
            }
        }

        return result;
    };

    CFConditionVerifier.prototype.checkOperatorPosition = function (tokenResult) {
        var result = [];

        if (tokenResult[0].token === 'func' || tokenResult[0].token === 'operator') {
            result.push({
                index: 0,
                target: tokenResult[0]
            });
        }

        if (tokenResult[tokenResult.length - 1].token === 'func' || tokenResult[tokenResult.length - 1].token === 'operator') {
            result.push({
                index: tokenResult.length - 1,
                target: tokenResult[tokenResult.length - 1]
            });
        }

        return result;
    };

    CFConditionVerifier.prototype.checkOperandType = function (tokenResult) {
        var result = [];

        for (var i = 1; i < tokenResult.length - 1; i++) {
            if (tokenResult[i].token === 'func' || tokenResult[i].token === 'operator') {
                if (tokenResult[i - 1].token === 'func' || tokenResult[i - 1].token === 'operator' || tokenResult[i - 1].token === 'open-bracket' ||
                    tokenResult[i + 1].token === 'func' || tokenResult[i + 1].token === 'operator' || tokenResult[i + 1].token === 'close-bracket') {
                    result.push({
                        index: i,
                        target: tokenResult[i]
                    });
                }
            }
        }

        return result;
    };

    CFConditionVerifier.prototype.checkBracketStack = function (tokenResult) {
        //TODO 고도화 필요
        var bracketStackCount = 0;
        for (var i = 0; i < tokenResult.length; i++) {
            // 괄호 갯수가 안 맞는지 확인
            if (tokenResult[i].token === 'open-bracket') {
                bracketStackCount++;
            }
            if (tokenResult[i].token === 'close-bracket') {
                bracketStackCount--;
            }
        }
        return bracketStackCount;
    };

    CFConditionVerifier.prototype.getTokenData = function (data) {
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

    Brightics.VA.Core.Verifier.CFConditionVerifier = CFConditionVerifier;

}).call(this);