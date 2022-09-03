/**
 * Created by SDS on 2016-09-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AddColumnValidator() {
        Brightics.VA.Core.Validator.StepValidator.call(this);
        this.PARAM_SELECT = 'select';
    }

    AddColumnValidator.prototype = Object.create(Brightics.VA.Core.Validator.StepValidator.prototype);
    AddColumnValidator.prototype.constructor = AddColumnValidator;

    AddColumnValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.StepValidator.prototype.initRules.call(this);
        this.addRule(this.emptyNewColumnAndValue);
    };

    AddColumnValidator.prototype.emptyNewColumnAndValue = function (fnUnit) {
        var problems = [];
        if (typeof fnUnit.param[this.PARAM_SELECT] === 'undefined') {
            problems.push(this.createProblem({
                errorCode: 'BR-0033',
                paramIndex: key,
                param: 'New column name',
                messageParam: ['New column name', 'Value']
            }));
            return problems;
        } else {
            var newColumnNames = [];
            var select = fnUnit.param[this.PARAM_SELECT];
            var res = select.split("\n");
            if (res[0].startsWith('*')) {
                res.splice(0, 1);
            }

            for (var i = 0; i < res.length; i++) {
                var pos = res[i].lastIndexOf(' as ');
                var newValue = res[i].substring(0, pos).trim();
                var newColumn = res[i].substring(pos + 4).trim();
                if (newColumn.slice(-1) == ',') {
                    newColumn = newColumn.substring(0, newColumn.length - 1);
                }
                if (newColumn === '') {
                    problems.push(this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: i,
                        param: 'New column name',
                        messageParam: ['New column name']
                    }));
                } else if ($.inArray(newColumn, newColumnNames) > -1) {
                    var messageParam = "New column name(s) - '" + newColumn + "' already exist.";
                    problems.push(this.createProblem({
                        errorCode: 'BR-0100',
                        paramIndex: i,
                        param: 'New column name',
                        messageParam: [messageParam]
                    }));
                }
                // else if ($.inArray(newColumn, $.map(this.getSchema(fnUnit), function (column) {
                //         return column.name
                //     })) > -1) {
                //     problems.push(this.createProblem({
                //         errorCode: 'EX004',
                //         paramIndex: i,
                //         param: 'New column name',
                //         messageParam: ['New column name']
                //     }));
                // }
                else {
                    if (newValue === '') {
                        problems.push(this.createProblem({
                            errorCode: 'BR-0033',
                            paramIndex: i,
                            param: 'Value',
                            messageParam: ['Value']
                        }));
                    }
                    newColumnNames.push(newColumn);
                }
            }
            return problems;
        }
    };

    Brightics.VA.Core.Validator.AddColumnValidator = AddColumnValidator;

}).call(this);