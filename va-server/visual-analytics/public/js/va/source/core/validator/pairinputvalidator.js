/**
 * Created by ng1123.kim on 2016-03-18.
 */
(function () {
        'use strict';

        var root = this;
        var Brightics = root.Brightics;

        function PairInputValidator() {
            Brightics.VA.Core.Validator.SingleInputValidator.call(this);
        }

        PairInputValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
        PairInputValidator.prototype.constructor = PairInputValidator;

        PairInputValidator.prototype.initRules = function () {
            Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        };

        PairInputValidator.prototype.checkInTableIsEmpty = function (fnUnit, numOfInTable) {
            var messageInfo = {
                errorCode: 'BR-0138',
                messageParam: [[]]
            };

            numOfInTable = (typeof numOfInTable == 'undefined' || typeof numOfInTable != 'number') ? 2 : numOfInTable;
            if (this.FnUnitUtils.getInTable(fnUnit).length !== numOfInTable) return;
            else {
                var prevFnUnit;
                for (var i = 0; i < numOfInTable; i++) {
                    prevFnUnit = fnUnit.parent().getFnUnitByOutTable(this.FnUnitUtils.getInTable(fnUnit)[i]);
                    if (!this._getSchema(fnUnit, i))  messageInfo.messageParam[0].push('[' + prevFnUnit.display.label + ']');
                }

                if (messageInfo.messageParam[0].length > 0) return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        };

        PairInputValidator.prototype._hasSchema = function (fnUnit) {
            return this._getSchema(fnUnit, 0) && this._getSchema(fnUnit, 1);
        };

        Brightics.VA.Core.Validator.PairInputValidator = PairInputValidator;

    }
).call(this);