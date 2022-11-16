(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;


    function PythonScriptRule() {
    }

    PythonScriptRule.prototype.migrate = function (fnUnit) {
        let functionDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fnUnit.func);
        let dummyFnUnit = $.extend(true, {}, functionDef.defaultFnUnit);

        if (fnUnit.meta) {
            var inputs = fnUnit.inputs;

            _.forEach(inputs, function (input, key) {
                if (dummyFnUnit.inputs && _.isArray(dummyFnUnit.inputs[key]) && !_.isArray(input)) {
                    fnUnit.inputs[key] = [input];
                }
            });

        } else {
            let functionDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fnUnit.func);
            let dummyFnUnit = $.extend(true, {}, functionDef.defaultFnUnit);

            //meta
            fnUnit.meta = dummyFnUnit.meta;
            fnUnit.version = dummyFnUnit.version;
            fnUnit.context = dummyFnUnit.context;

            //inData => inputs.inputs
            fnUnit.inputs = dummyFnUnit.inputs;
            fnUnit.inputs.inputs = fnUnit[IN_DATA];
            //outData => outputs.outputs
            fnUnit.outputs = dummyFnUnit.outputs;
            _.forEach(fnUnit.param['out-table-alias'], function (alias, index) {
                fnUnit.outputs[alias] = fnUnit.outData[index];
                fnUnit.meta[alias] = {'type': 'table'};
            });

            //delete inData
            delete fnUnit.inData;
            //delete inData
            delete fnUnit.outData;
        }
    };

    Brightics.VA.Core.Tools.ModelMigrator.RuleList.pythonScript = PythonScriptRule;

}).call(this);