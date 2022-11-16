/**
 * Created by ng1123.kim on 2016-03-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ProblemFactory() {
        this.initRule();
    }

    ProblemFactory.prototype.initRule = function () {
        this.rule = {
            //필수값(empty) 체크
            EE001: {
                level: 'error',
                message: '"[0]" field is required.'
            },
            //Param Index 값 체크 ex) columns의 3번째 값[columns, 3]
            EE002: {
                level: 'error',
                message: 'Please check out [1]th value of "[0]".'
            },
            //Param Index 값 체크 ex) columns의 첫번째 row의 3번째 값[columns, 1, 3]
            EE003: {
                level: 'error',
                message: 'Please check out [1] row [2]th value of [[0]].'
            },
            //필수값(invalid) 체크
            EE004: {
                level: 'error',
                message: 'Must be valid "[0]"'
            },
            EE005: {
                level: 'error',
                message: 'One of the "[0]" and "[1]" fields are required.'
            },
            EE006: {
                level: 'error',
                message: 'One or more "[0]" tables are required.'
            },
            EE007: {
                level: 'error',
                message: 'Must be different "[0]" from columnName of In-Data' //새로운 컬럼명은 in-data의 컬럼명들과 다른 컬럼명이 요구된다.
            },
            EE009: {
                level: 'error',
                message: 'More than [0] [1] values is required.'
            },
            EE010: {
                level: 'error',
                message: '"[0]", "[1]" are required.'
            },
            //Column 중복체크
            EE011: {
                level: 'error',
                message: 'This column "[0]" already exists in other parameter.'
            },
            EE012: {
                level: 'error',
                message: 'The number of columns must be two.'
            },
            EE013: {
                level: 'error',
                message: 'This column "[0]" duplicates the selection in Columns above.'
            },
            EE014: {
                level: 'error',
                message: 'This column "[0]" is not allowed.'
            },
            ////값 비교 -->사용안함. ==> NGram에서 사용
            EC001: {
                level: 'error',
                message: '[0] must greater than or equals to [1]'
            },
            ////값 비교 ==> LinUCB에서 사용
            EC002: {
                level: 'error',
                message: '"[0]" must be less than "[1]".'
            },
            ////값 비교 ==> Greater than
            EC003: {
                level: 'error',
                message: '"[0]" must be greater than "[1]"'
            },
            //링크 에러
            EL001: {
                level: 'error',
                message: 'Link connection is required.'
            },
            //링크 에러 2개 이상의 Connection이 존재해야 하는 경우
            EL002: {
                level: 'error',
                message: '"[0]" requires two in-tables.'
            },
            //링크 에러 특정함수로 돌린 outData가 연결되야 하는 경우 ex) prediction 함수는 right table이 항상 train함수 결과값이어야 함
            EL003: {
                level: 'error',
                message: '"[0]" must be equal to "[1]".'
            },
            EL004: {
                level: 'error',
                message: 'The column is invalid in [[0]].'//'[[0]] columns must be equal to "[1]".'
            },
            //링크 에러 2개 이상의 Connection이 존재해야 하는 경우
            EL006: {
                level: 'error',
                message: '"[0]" is required more than two link connections.'
            },
            //링크 에러 2개 이상의 Connection이 존재해야 하는 경우
            EL007: {
                level: 'error',
                message: '"[0]" is required more than three link connections.'
            },
            //링크 에러 2개 이상의 Connection이 존재해야 하는 경우
            EL008: {
                level: 'error',
                message: '"[0]" is required three link connections.'
            },//Input 타입 체크
            ET001: {
                level: 'error',
                message: '"[0]" contains invalid characters.'
            },
            //Column 타입 체크
            ET002: {
                level: 'error',
                message: '[[0]] type is invalid.'
            },
            ET003: {
                level: 'error',
                message: '[0] type is invalid.'
            },
            ET004: {
                level: 'error',
                message: '[0] is invalid operator.'
            },
            ET005: {
                level: 'error',
                message: 'number only or number[] only.'
            },
            ET006: {
                level: 'error',
                message: 'only one number[] type column is allowed.'
            },
            ET007: {
                level: 'error',
                message: 'only one string type column is allowed.'
            },
            ET008: {
                level: 'error',
                message: 'only one column is allowed.'
            },
            ET009: {
                level: 'error',
                message: 'Only one column is allowed if column type is one of ([0]).'
            },
            //범위체크
            ER001: {
                level: 'error',
                message: '[0]'
            },
            //Column 유무 체크
            EX001: {
                level: 'error',
                message: '[[0]] does not exist.'
            },
            //유무 체크
            EX002: {
                level: 'error',
                message: '"[0]" does not exist.'
            },
            //유무 체크
            EX003: {
                level: 'error',
                message: '"[0]" already exists.'
            },
            EX004: {
                level: 'error',
                message: '"[0]" already exists in previous.'
            },
            EX005: {
                level: 'error',
                message: '"[0]" does not exist in previous.'
            },
            //Input 체크
            WI001: {
                level: 'warning',
                message: 'Input from [0] does not exist.'
            },
            WI002: {
                level: 'warning',
                message: 'Input from [[0]] does not exist.'
            },
            // Column Name 체크
            EN001: {
                level: 'error',
                message: 'If the column name begins with _ or is only a number, it may be a problem in some functions later.'
            },
            // Data Duplicated 체크 //Frequency
            ED001: {
                level: 'error',
                message: '"[0]" column is already chosen for "[1]" parameter.'
            },
            // GroupBy 체크 //Outlier Removal
            ED002: {
                level: 'error',
                message: '[[0]] column is already chosen for "[1]" parameter.'
            },
            ED003: {
                level: 'error',
                message: '[0] Change Name field is no changed.'
            },
            ED004: {
                level: 'error',
                message: '[0] columns are already chosen for "[1]" parameter.'
            },
            EP001: {
                level: 'error',
                message: '"[0]" must start with "/shared/upload" or "/{userid}/upload".'
            },
            EP002: {
                level: 'error',
                message: '"[0]" can not start with "/shared/upload" or "/{userid}/upload".'
            },
            EF001: {
                level: 'error',
                message: 'This UDF[[0]] is not available.'
            },
            EF002: {
                level: 'error',
                message: 'This function[[0]] is not available.'
            },
            'BR-0113': {
                level: 'error',
                message: 'Data Flow does not exist.'
            },
            EI001: {
                level: 'error',
                message: 'Model does not exist.'
            },
            EI002: {
                level: 'warning',
                message: 'Model specification is changed.'
            }
        };
    };


    /*
     Required "Please enter a value"

     Invalid Column Type "Please enter a correct format"

     invalid value "Please enter a value less than or equal to {0}."

     invalid value "Please enter a value greater than or equal to {0}."

     invalid value "Please enter a value between {0} and {1}."

     invalid value "Please enter a value between {0} and {1} characters long."

     already in use "Please enter a valid value"

     Disconnected link "Please check out {0} link connection"

     invalid character "Please enter valid character"

     Do not exist "Please check out the input data"

     */


    ProblemFactory.prototype.createProblem = function (checkResult, fnUnit) {
        var _this = this;
        if (checkResult) {
            checkResult.messageParam = this._createMessageParam(fnUnit, checkResult.messageParam);
            return {
                // level: _this.rule[checkResult.errorCode].level,
                mid: _this.mid, //fnUnit.parent().mid,
                fid: fnUnit.fid,
                param: checkResult.param,
                paramIndex: checkResult.paramIndex,
                code: checkResult.errorCode,
                message: _this.makeMessage(checkResult),
                mode: checkResult.mode
            };
        }
    };

    ProblemFactory.prototype._createMessageParam = function (fnUnit, messageParam) {
        if (fnUnit && typeof fnUnit.parent === 'function' && typeof fnUnit.parent().getFnUnitNameById === 'function') {
            var funcName = fnUnit.parent().getFnUnitNameById(fnUnit.fid);
            return Brightics.VA.Core.Utils.MessageUtils.getFunctionLabels(funcName, messageParam);
        } else {
            return messageParam;
        }
    };


    ProblemFactory.prototype.makeMessage = function (checkResult) {
        if (this.rule[checkResult.errorCode]) {
            return this._createMessage(checkResult);
        }
        var message = Brightics.VA.Core.Utils.MessageUtils.getMessage(checkResult.errorCode, checkResult.messageParam);
        if (message) return message;
    };

    ProblemFactory.prototype._createMessage = function (checkResult) {
        console.warn('This Error Code[' + checkResult.errorCode + '] should be deprecated');

        var originMessage = this.rule[checkResult.errorCode].message;
        for (var i in checkResult.messageParam) {
            var messageparam = checkResult.messageParam[i];
            if (originMessage.indexOf('%s') < 0) {
                var indexStr = '[' + i + ']';
                if (typeof messageparam == 'number') messageparam = String(messageparam);
                originMessage = originMessage.replace(indexStr, messageparam);
            } else {
                originMessage = originMessage.replace('%s', messageparam);
            }

        }
        return originMessage;
    };


    Brightics.VA.Core.Validator.ProblemFactory = ProblemFactory;

}).call(this);