(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.unknownFunction = {
        "category": "unknown",
        "defaultFnUnit": {
            "func": "unknownFunction",
            "name": "UnknownFunction",
            "inData": [],
            "outData": [],
            "param": {},
            "display": {
                "label": "UnKnow Function",
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
        "description": "Unknown Function.",
        "tags": [
            "unknown",
            "undefined"
        ],
        "in-range": {
            "min": 1,
            "max": 999
        },
        "out-range": {
            "min": 1,
            "max": 1
        }
    };
    
}).call(this);
/**************************************************************************
 *                           Properties Panel                              
 *************************************************************************/
/**
 * Created by jhoon80.park on 2016-03-15.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UnknownFunctionProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    UnknownFunctionProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    UnknownFunctionProperties.prototype.constructor = UnknownFunctionProperties;

    UnknownFunctionProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.setContentsEditable(true);
        this.createParamControl();
    };

    UnknownFunctionProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);
        this.render = {};
    };

    UnknownFunctionProperties.prototype.fillControlValues = function () {

    };

    UnknownFunctionProperties.prototype.createParamControl = function () {
        // var _this = this;
        // var keys = Object.keys(this.options.fnUnit.param);
        // for (var key in keys) {
        //     var $inputControl = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        //     this.addPropertyControl(keys[key], function ($parent) {
        //         $parent.append($inputControl);
        //         var jqxOptions = {
        //             placeHolder: 'Enter value',
        //             disabled: true
        //         };
        //         _this.createInput($inputControl, jqxOptions, 'brtc-va-editors-sheet-controls-width-12');
        //
        //     }, {mandatory: false});
        //     $inputControl.val(_this.options.fnUnit.param[keys[key]]);
        // }

    };


    Brightics.VA.Core.Functions.Library.unknownFunction.propertiesPanel = UnknownFunctionProperties;
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

    function UnknownFunctionValidator() {
        this.RATIO = 'ratio';

        Brightics.VA.Core.Validator.BaseValidator.call(this);
    }

    UnknownFunctionValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    UnknownFunctionValidator.prototype.constructor = UnknownFunctionValidator;

    UnknownFunctionValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.BaseValidator.prototype.initRules.call(this);
        this.addExistFnUnitRule();

    };

    UnknownFunctionValidator.prototype.addExistFnUnitRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var messageInfo = {
                errorCode: 'EF002',
                messageParam: [fnUnit.func]
            };
            return _this.problemFactory.createProblem(messageInfo, fnUnit);
        });
    };

    Brightics.VA.Core.Functions.Library.unknownFunction.validator = UnknownFunctionValidator;

}).call(this);