/**
 * Created by ng1123.kim on 2016-03-18.
 */
(function () {
        'use strict';

        var root = this;
        var Brightics = root.Brightics;

        function MultiInputValidator() {
            Brightics.VA.Core.Validator.SingleInputValidator.call(this);
        }

        MultiInputValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
        MultiInputValidator.prototype.constructor = MultiInputValidator;

        MultiInputValidator.prototype.initRules = function () {
            Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        };

        MultiInputValidator.prototype.checkInTableIsEmpty = function (fnUnit) {
            var messageInfo = {
                    errorCode: 'BR-0138',
                    // param: 'inData',
                    messageParam: [[]]
                },
                previous = fnUnit.parent().getPrevious(fnUnit.fid);

            var clazz = fnUnit.parent().type;
            var defFuncInRange = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func)['in-range'];
            var currentLink = fnUnit.parent().getPrevious(fnUnit.fid);
            if (currentLink.length > defFuncInRange.max || currentLink.length < defFuncInRange.min) return;
            else {
                for(var i = 0; i < previous.length; i ++){
                    var previousFnUnit = fnUnit.parent().getFnUnitById(previous[i]);
                    if (!this._getSchema(fnUnit, i))  messageInfo.messageParam[0].push('[' + previousFnUnit.display.label + ']');
                }
                if (messageInfo.messageParam[0].length > 0) return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        };

        Brightics.VA.Core.Validator.MultiInputValidator = MultiInputValidator;

    }
).call(this);