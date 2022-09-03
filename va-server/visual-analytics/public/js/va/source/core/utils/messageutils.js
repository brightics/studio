/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;

    root.Brightics.VA.Core.Utils.MessageUtils = {
        initMessage: function () {
            var _this = this;
            var opt = {
                url: 'api/va/v2/studio/message/en',
                type: 'GET',
                blocking: false
            };
            $.ajax(opt).done(function (res) {
                var messageMap = {};
                for (var i in res) {
                    messageMap[res[i].code] = {
                        message: res[i].message
                    }
                }
                _this.Message = messageMap;
            });
        },
        initFunctionLabel: function () {
            var _this = this;
            var opt = {
                url: 'api/va/v2/studio/functionlabel/en',
                type: 'GET',
                blocking: false
            };
            this.FunctionLabel = {};
            $.ajax(opt).done(function (res) {
                for (var i = 0; i < res.length; i++) {
                    var func = res[i];
                    _this.FunctionLabel[func.functionName] = _this.FunctionLabel[func.functionName] || {};
                    _this.FunctionLabel[func.functionName][func.parameter] = func.label;
                }
            });
        },
        getFunctionLabels: function (func, params) {
            var labels = [];
            for (var i in params) {
                if (this.FunctionLabel[func] && this.FunctionLabel[func][params[i]]) {
                    labels.push(this.FunctionLabel[func][params[i]]);
                } else {
                    if (params[i] === 'inData') {
                        labels.push('In Table');
                    } else {
                        labels.push(params[i]);
                    }
                }
            }
            return labels;
        },
        getFunctionLabel: function (func, param) {
            if (this.FunctionLabel[func] && this.FunctionLabel[func][param]) {
                return this.FunctionLabel[func][param];
            } else {
                return param;
            }
        },
        getMessage: function (code, params) {
            if (!this.Message || !this.Message[code]) return 'Please contact administrator! Error: ' + code;
            var message = this.Message[code].message;
            for (var i in params) {
                message = message.replace('%s', params[i]);
            }
            return message;
        },
        getReplacedParam: function (func, params) {
            if(func == 'evaluateRankingAlgorithm'){
                var replaceParamCodeList =  ["Precision", "NDCG", "K-Values"];
                params = replaceParamCodeList;
                return params;
            }
        },
        getFunctionLabelAll: function () {
            return this.FunctionLabel;
        }
    };

}).call(this);