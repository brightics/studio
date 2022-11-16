(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.loadModel = {
        "category": "io",
        "defaultFnUnit": {
            "func": "loadModel",
            "name": "brightics.function.io$load_model",
            "label": {
                "en": "Load Model", 
                "ko": "모델 불러오기"
            },
            "outputs": {
                "model": ""
            },
            "meta": {
                "model": {"type":"model"}
            },
            "param": {
                "path": ""
            },
            "version": "3.6",
            "context" :"python",
            "display": {
                "label": "Load Model",
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
                    }
                }
            }
        },
        "description": {
            "en": "Load Model",
            "ko": "모델을 불러옵니다."
        },
        "mandatory": [],
        "tags": {
            "en": [
                "load",
                "json",
                "model"
            ],
            "ko": [
                "불러오기",
                "json",
                "모델"
            ]
        }
    };

}).call(this);
/**************************************************************************
 *                           Properties Panel
 *************************************************************************/
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var PARAM_PATH = 'path';

    function LoadModel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    LoadModel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    LoadModel.prototype.constructor = LoadModel;

    LoadModel.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    LoadModel.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            'path': this.renderPath
        };

        this.createPathControl();
    };

    LoadModel.prototype.createPathControl = function () {
        var _this = this;

        this.$pathControl = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input" />');
        this.$pathControlWrapper = this.addPropertyControl('Path', function ($parent) {
            $parent.append(this.$pathControl);

            _this.createInput(_this.$pathControl);
            _this.$pathControl.on('change', function (event) {
                if (!_this.isInputValueChanged(PARAM_PATH, $(this).val())) return;

                _this.createInputCommand(PARAM_PATH, $(this).val())
            });
        });
    };

    LoadModel.prototype.renderPath = function () {
        this.$pathControl.val(this.FnUnitUtils.getParam(this.options.fnUnit)[PARAM_PATH]);
    };

    LoadModel.prototype.fillControlValues = function () {
    };

    LoadModel.prototype.createInputCommand = function (controlName, data) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        commandOption.ref.param[controlName] = '';
        if (data) {
            commandOption.ref.param[controlName] = data;
        }

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
        this.executeCommand(command);
    };

    Brightics.VA.Core.Functions.Library.loadModel.propertiesPanel = LoadModel;
}).call(this);