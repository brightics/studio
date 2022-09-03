/**
 * Created by samsungSDS on 2018-07-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AddonFunctionManager() {
        this._functionInterfaceMap = {};
        for (var modelType in Brightics.VA.Core.Interface.Functions) {
            this._functionInterfaceMap[modelType] = Brightics.VA.Core.Interface.Functions[modelType];
        }
    }

    AddonFunctionManager.prototype.init = function (cb) {
        var _this = this;
        var udfOpt = {
            url: 'api/va/v3/ws/udfs',
            type: 'GET',
            blocking: false
        };
        var late = false;
        $.ajax(udfOpt).done(function (functions) {
            var udf, modelType;

            var udfList = functions;
            for (var i in udfList) {
                udf = udfList[i];
                modelType = udf.modelType || 'data';
                _this._addFunction(udf);
            }
            if (late && cb) cb();
            late = true;
        });

        var addonfunctionOpt = {
            url: 'api/va/v3/ws/functions',
            type: 'GET',
            blocking: false
        };
        $.ajax(addonfunctionOpt).done(function (functions) {
            var addonFunction;
            var functionList = functions;

            for (var i in functionList) {
                addonFunction = {};
                addonFunction.id = functionList[i].func;
                addonFunction.modelType = 'data';
                addonFunction.contents = functionList[i];
                _this._addFunction(addonFunction);
            }
            if (late && cb) cb();
            late = true;
        });
    };
    AddonFunctionManager.prototype._addFunction = function (addonFunction) {
        var modelType = addonFunction.modelType || 'data';
        if (this._functionInterfaceMap[modelType] && Brightics.VA.Core.Interface.AddonFunctionUtil[modelType]) {
            Brightics.VA.Core.Interface.AddonFunctionUtil[modelType].addFunction(addonFunction);
        }
    };

    Brightics.VA.Core.AddonFunctionManager = AddonFunctionManager;

}).call(this);