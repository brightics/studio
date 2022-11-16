/**
 * Created by ng1123.kim on 2016-03-18.
 */
(function () {
        'use strict';

        var root = this;
        var Brightics = root.Brightics;

        function SingleInputValidator() {
            Brightics.VA.Core.Validator.BaseValidator.call(this);
        }

        SingleInputValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
        SingleInputValidator.prototype.constructor = SingleInputValidator;

        SingleInputValidator.prototype.initRules = function () {
            this.addLinkRule();
            this.addInTableRule();
        };

        SingleInputValidator.prototype.addLinkRule = function () {
            var _this = this;
            this.addRule(function (fnUnit) {
                return _this.checkLinkIsConnected(fnUnit);
            });
        };

        SingleInputValidator.prototype.addInTableRule = function () {
            var _this = this;
            this.addRule(function (fnUnit) {
                return _this.checkInTableIsEmpty(fnUnit);
            });
        };

        SingleInputValidator.prototype.checkInTableIsEmpty = function (fnUnit) {
            var messageInfo = {
                    errorCode: 'BR-0138',
                    // param: 'inData',
                    messageParam: []
                },
                previous = fnUnit.parent().getFnUnitById(fnUnit.parent().getPrevious(fnUnit.fid)[0]);

            if (!this._hasIntables(fnUnit)) return;
            if (!this._getSchema(fnUnit) || (this._getSchema(fnUnit).length === 0)) {
                messageInfo.messageParam.push(previous.display.label);
                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        };

        /**
         *
         * @param fnUnit
         * @param param
         * @param value columns (array || string)
         * @param messageParam
         * @returns {{level, mid, fid, param, paramIndex, code, message}}
         */
        SingleInputValidator.prototype.checkColumnIsEmpty = function (fnUnit, param, value, messageParam, index) {
            if (!this._hasSchema(fnUnit)) return;

            let checkJsonStringify = JSON.stringify(value, function (k, v) {
                if (typeof v === 'string' && v.length > 0) {
                    return '';
                } else {
                    return v;
                }
            });
            if (checkJsonStringify.length === JSON.stringify(value).length) {
                var messageInfo = {
                    errorCode: 'BR-0033',
                    param: param,
                    messageParam: [messageParam],
                    paramIndex: index
                };
                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        };

        SingleInputValidator.prototype.checkColumnExists = function (fnUnit, param, value, index) {
            if (!this._hasSchema(fnUnit, index)) return;

            var columnNames = [];
            let checkJsonStringify = JSON.stringify(value, function (k, v) {
                if (typeof v === 'string' && v.length > 0) {
                    return '';
                } else {
                    return v;
                }
            });
            if (checkJsonStringify.length === JSON.stringify(value).length) return;

            var schema = this._getSchema(fnUnit, index || 0);
            var existingNames = $.map(schema, function (item) {
                return item.name;
            });

            var invalidNames = [];
            for (let name of columnNames) {
                if ($.inArray(name, existingNames) < 0) {
                    invalidNames.push(name);
                }
            }
            if (invalidNames.length > 0) {

                var errorCode = 'BR-0001';
                // if (invalidNames.length === 1) {
                //     errorCode = 'BR-0001';
                // } else {
                //     errorCode = 'BR-0000';
                // }

                var messageInfo = {
                    errorCode: errorCode,
                    param: param,
                    messageParam: [invalidNames.join(', ')]
                };
                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        };

        SingleInputValidator.prototype.checkColumnType = function (fnUnit, param, value, type, index) {
            if (!this._hasSchema(fnUnit)) return;

            let checkJsonStringify = JSON.stringify(value, function (k, v) {
                if (typeof v === 'string' && v.length > 0) {
                    return '';
                } else {
                    return v;
                }
            });
            if (checkJsonStringify.length === JSON.stringify(value).length) return;

            var availableTypes = Array.isArray(type) ? type : [type];
            var schema = this._getSchema(fnUnit, index || 0);
            var invalidNames = [];
            for (var i in columnNames) {
                $.each(schema, function (index, column) {
                    if (columnNames[i] == column.name && ($.inArray(column.type, availableTypes) < 0 && $.inArray(column.internalType, availableTypes) < 0)) {
                        invalidNames.push(columnNames[i]);
                        return false;
                    }
                });
            }

            if (invalidNames.length > 0) {
                var messageInfo = {
                    errorCode: 'BR-0002',
                    param: param,
                    messageParam: [invalidNames.join(', '), type]
                };

                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        };

        SingleInputValidator.prototype.checkSingleNumberArray = function (fnUnit, param, columns, index) {
            var schema = this._getSchema(fnUnit, index || 0),
                _numberArrayTypeCnt = 0,
                messageInfo = {
                    errorCode: 'ET006',
                    param: param,
                    messageParam: []
                };

            for (var i in columns) {
                for (var j in schema) {
                    if (columns[i] === schema[j].name) {
                        if (schema[j].type.toLowerCase() === 'number[]') {
                            _numberArrayTypeCnt++;
                            break;
                        }
                    }
                }
            }

            if (_numberArrayTypeCnt > 1) return this.problemFactory.createProblem(messageInfo, fnUnit);
        };

        SingleInputValidator.prototype.checkSingleColumnType = function (fnUnit, param, columns, types, index) {
            var schema = this._getSchema(fnUnit, index || 0),
                messageInfo = {
                    errorCode: 'ET009',
                    param: param,
                    messageParam: [types.join(', ')]
                };

            var columnsCount = columns.length;
            var _typeCount = 0;
            for (var i in columns) {
                for (var j in schema) {
                    if (columns[i] === schema[j].name) {
                        var found = false;
                        for (var k in types) {
                            if (schema[j].type === types[k] || schema[j].internalType === types[k]) {
                                _typeCount++;
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                    }
                }
            }

            if (columnsCount > 1 && _typeCount != 0) return this.problemFactory.createProblem(messageInfo, fnUnit);
        };

        SingleInputValidator.prototype.checkNumberArray = function (fnUnit, param, columns, index) {
            var schema = this._getSchema(fnUnit, index || 0),
                _numberTypeCnt = 0,
                _numberArrayTypeCnt = 0,
                messageInfo = {
                    errorCode: 'ET005',
                    param: param,
                    messageParam: []
                };

            for (var i in columns) {
                for (var j in schema) {
                    if (columns[i] === schema[j].name) {
                        if (schema[j].type.toLowerCase() === 'number') {
                            _numberTypeCnt++;
                            break;
                        } else if (schema[j].type.toLowerCase() === 'number[]') {
                            _numberArrayTypeCnt++;
                            break;
                        }
                    }
                }
            }

            if (_numberTypeCnt * _numberArrayTypeCnt > 0) return this.problemFactory.createProblem(messageInfo, fnUnit);
        };

        SingleInputValidator.prototype.checkNewColumnName = function (fnUnit, param, newColumnName) {
            if (!this._hasSchema(fnUnit)) return;
            if (!newColumnName) return;

            var messageInfo = {
                errorCode: 'BR-0045',
                param: param,
                messageParam: []
            };

            if (!(Brightics.VA.Core.Utils.InputValidator.isValid.columnNameType(newColumnName))) {
                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        };

        SingleInputValidator.prototype._getSchema = function (fnUnit, index) {
            // var schema = Brightics.VA.Core.DataQueryTemplate.getSchema(fnUnit.parent().mid, fnUnit[IN_DATA][index || 0]);
            var schema = Brightics.VA.Core.DataQueryTemplate.getSchema(fnUnit.parent().mid, this.FnUnitUtils.getInTable(fnUnit)[index || 0]);
            if (schema && schema.length === 0) schema = undefined;
            return schema;
        };

        SingleInputValidator.prototype._hasSchema = function (fnUnit, index) {
            return this._getSchema(fnUnit, index);
        };

        Brightics.VA.Core.Validator.SingleInputValidator = SingleInputValidator;

    }
).call(this);