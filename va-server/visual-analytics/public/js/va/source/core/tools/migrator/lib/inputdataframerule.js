(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function InputDataFrameRule() {
    }

    InputDataFrameRule.prototype.migrate = function (func) {
        func.func = (func.func === 'inputDataFrame') ? ('createTable') : (func.func);
        func.name = (func.name === 'InputDataFrame') ? ('CreateTable') : (func.name);
        func.display.label = (func.display.label === 'Input Data Frame') ? ('Create Table') : (func.display.label);
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.inputDataFrame = InputDataFrameRule;

}).call(this);