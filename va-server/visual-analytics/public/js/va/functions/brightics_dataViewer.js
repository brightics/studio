(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.dataViewer = {
        "category": "brightics",
        "defaultFnUnit": {
            "func": "dataViewer",
            "name": "DataViewer",
            "outData": [],
            "param": {
                "mid": "",
                "fid": ""
            },
            "skip": true,
            "display": {
                "label": "",
                "diagram": {
                    "position": {
                        "x": 20,
                        "y": 10
                    }
                },
                "sheet": {
                    "in": {
                        "partial": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ],
                        "full": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ]
                    },
                    "out": {
                        "partial": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ],
                        "full": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ]
                    }
                }
            }
        },
        "description": "",
        "tags": [],
        "in-range": {
            "min": 0,
            "max": 0
        },
        "out-range": {
            "min": 1,
            "max": 10
        }
    };

}).call(this);
/**************************************************************************
 *                               Validator
 *************************************************************************/
/**
 * Created by ng1123.kim on 2016-03-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataViewerValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    DataViewerValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    DataViewerValidator.prototype.constructor = DataViewerValidator;

    DataViewerValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);

        // this.addScriptRule();
        // this.addOutTableAliasRule();
    };

    // WhileValidator.prototype.addScriptRule = function () {
    //     var _this = this;
    //     this.addRule(function (fnUnit) {
    //         var problems = [];

    //         if (fnUnit.param.script == '') {
    //             problems.push(_this.problemFactory.createProblem({
    //                 errorCode: 'BR-0033',
    //                 param: 'script',
    //                 messageParam: ['Script']
    //             }, fnUnit));
    //         }
    //         return problems;
    //     });
    // };

    // WhileValidator.prototype.addOutTableAliasRule = function () {
    //     var _this = this;
    //     this.addRule(function (fnUnit) {
    //         var messageInfo = {
    //             errorCode: 'BR-0033',
    //             param: 'out-table-alias',
    //             messageParam: ['Out Table Alias']
    //         };
    //         return _this._checkArrayIsEmpty(messageInfo, fnUnit, fnUnit.param['out-table-alias']);
    //     });
    // };


    DataViewerValidator.prototype.addLinkRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            return _this.checkLinkIsConnected(fnUnit);
        });
    };

    DataViewerValidator.prototype.checkLinkIsConnected = function (fnUnit) {
        var messageInfo = {
            errorCode: 'EL001',
            messageParam: [fnUnit.display.label]
        };

        var mainModel = Studio.getEditorContainer().getActiveModelEditor().getModel();
        var innerModel = Studio.getEditorContainer().getActiveModelEditor().getActiveModel();

        for (var i in fnUnit['outData']) {
            if (innerModel['inData'].indexOf(fnUnit['outData'][i]) < 0) {
                return this.problemFactory.createProblem(messageInfo, fnUnit);
            }
        }
    };

    Brightics.VA.Core.Functions.Library.dataViewer.validator = DataViewerValidator;

}).call(this);