(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.unloadModel = {
        "category": "io",
        "defaultFnUnit": {
            "func": "unloadModel",
            "name": "brightics.function.io$unload_model",
            "label": {
                "en": "Unload Model", 
                "ko": "모델 내보내기"
            },
            "inputs":{
                "in_1":""
            },
            "outputs": {
                "model": ""
            },
            "meta": {
                "in_1": {"type":"model"},
                "model": {"type":"model"}
            },
            "param": {
                "target": "",
                "path": "",
                "linked":{
                    "name": '',
                    "param": {},
                    "outData": [],
                    "outputs": {}
                }
            },
            "version": "3.6",
            "context" :"python",
            "display": {
                "label": "Unload Model",
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
            "en": "Export model/ meta data",
            "ko": "모델과 메타데이터를 내보냅니다."
        },
        "mandatory": [],
        "tags": {
            "en": [
                "unload",
                "train",
                "model",
                "meta"
            ],
            "ko": [
                "내보내기",
                "학습",
                "모델",
                "메타"
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
    var PARAM_TARGET = 'target';

    function UnloadModel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    UnloadModel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    UnloadModel.prototype.constructor = UnloadModel;

    UnloadModel.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    UnloadModel.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            'target': this.renderTarget,
            'path': this.renderPath
        };

        this.createTargetControl();
        this.createPathControl();
    };

    UnloadModel.prototype.createTargetControl = function () {
        var _this = this;
        this.$target = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');

        this.targetSource = this.FnUnitUtils.getPreviousFnUnits(this.options.fnUnit);

        this.addPropertyControl('Target', function ($parent) {
            _this.createDropDownList(this.$target, {
                source: this.targetSource
            });
            $parent.append(this.$target.parent());
            _this.$target.on('change', function () {
                if (!_this.isInputValueChanged('target', $(this).val())) return;

                _this.createInputCommand('target', $(this).val())
            });
        }, {mandatory: true});
    };

    UnloadModel.prototype.createPathControl = function () {
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

    UnloadModel.prototype.renderTarget = function () {
        this.$target.val(this.FnUnitUtils.getParam(this.options.fnUnit)[PARAM_TARGET]);
    };

    UnloadModel.prototype.renderPath = function () {
        this.$pathControl.val(this.FnUnitUtils.getParam(this.options.fnUnit)[PARAM_PATH]);
    };

    UnloadModel.prototype.fillControlValues = function () {
    };

    UnloadModel.prototype.createInputCommand = function (controlName, data) {
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

    Brightics.VA.Core.Functions.Library.unloadModel.propertiesPanel = UnloadModel;
}).call(this);