/**
 * Created by sds on 2018-02-13.
 */
/**
 result json spec
 "surrogate": {
    "type": "true",
    "method-name": "dace",
    "dace-type": "random",
    "samples": "5",
    "seed": "1234"
  },
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'surrogate',
        PARAM_TYPE = 'type',
        PARAM_SUB_METHOD = 'submethod',
        PARAM_METHOD_NAME = 'method-name',
        PARAM_SAMPLE_TYPE = 'sample-type',
        PARAM_DACE_TYPE = 'dace-type',
        PARAM_SAMPLES = 'samples',
        PARAM_SEED = 'seed',
        PARAM_MODEL = 'model'
        ;

    function SurrogateControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    SurrogateControl.prototype = Object.create(_super);
    SurrogateControl.prototype.constructor = SurrogateControl;

    SurrogateControl.Label = 'Surrogate';
    SurrogateControl.Section = 'right';

    SurrogateControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;

        var paramInfo = [{
            Key: PARAM_TYPE,
            Label: 'Surrogate',
            Default: 'false',
            Source: [
                {
                    "label": "True",
                    "value": "true"
                },
                {
                    "label": "False",
                    "value": "false"
                }
            ]
        }, {
            Key: PARAM_SUB_METHOD,
            Label: 'Surrogate Method'
        }, {
            Key: PARAM_METHOD_NAME,
            Label: 'Method Name',
            Source: [
                {
                    "label": "Sampling",
                    "value": "sampling"
                },
                {
                    "label": "Dace",
                    "value": "dace"
                }
            ]
        }, {
            Key: PARAM_SAMPLE_TYPE,
            Label: 'Sample Type',
            Source: [
                {
                    "label": "Latin Hypercube Sampling",
                    "value": "latin_hypercube_sampling"
                },
                {
                    "label": "Random",
                    "value": "random"
                }
            ]
        }, {
            Key: PARAM_DACE_TYPE,
            Label: 'Dace Type',
            Source: [
                {
                    "label": "Random",
                    "value": "random"
                },
                {
                    "label": "Grid Sampling",
                    "value": "grid_sampling"
                },
                {
                    "label": "Orthogonal Array",
                    "value": "orthogonal_array"
                },
                {
                    "label": "Orthogonal Array Latin Hypercube Sampling",
                    "value": "orthogonal_array_latin_hypercube_sampling"
                },
                {
                    "label": "Latin Hypercube Sampling",
                    "value": "latin_hypercube_sampling"
                },
                {
                    "label": "Box Behnken",
                    "value": "box_behnken"
                },
                {
                    "label": "Central Composite",
                    "value": "central_composite"
                }
            ]
        }, {
            Key: PARAM_SAMPLES,
            Label: 'Samples',
            Default: 'Random'
        }, {
            Key: PARAM_SEED,
            Label: 'Seed',
            Default: 'Random'
        }];

        this.registerSpec(paramInfo);
        this.controls[CONTROL_KEY] = {};
    };

    SurrogateControl.prototype.createControl = function () {
        if (!this.options.isMandatory) {
            this._createTypeControl();
        } else {
            this._createModelControl();
            this._createMethodControl();
        }
    };

    SurrogateControl.prototype._createTypeControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(SurrogateControl.Label, function ($container) {
            _this.createRadioButtonControl($container, {
                source: _this.options.source || _this.PARAM_INFO[PARAM_TYPE].Source,
                // value: controlVal,
                attr: PARAM_TYPE,
                control: _this.controls[CONTROL_KEY]
            });
        }, {
            propertyControlParent: _this.getSection(SurrogateControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    SurrogateControl.prototype._createModelControl = function () {
        var hasModel = this.options.params.some(function (elem) {
            return elem.attr == PARAM_MODEL
        });
        if (hasModel) {
            this.caller._createObjectArrayControl(PARAM_MODEL);
        }
    };

    SurrogateControl.prototype._createMethodControl = function () {
        var _this = this;
        this.$deckElem = {};
        this.controls[CONTROL_KEY][PARAM_SUB_METHOD] = {};

        var propPanel = this.caller;
        this.$deckControlWrapper = propPanel.addPropertyControl(_this.PARAM_INFO[PARAM_SUB_METHOD].Label, function ($container) {
            var $control = $('<div class = "brtc-va-editors-sheet-controls-propertycontrol-deck method"/>');
            $container.append($control);
            _this._createDeckDetailControls($control, PARAM_METHOD_NAME);
        }, {
            propertyControlParent: _this.getSection(SurrogateControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    SurrogateControl.prototype.configureControls = function ($deckControl, paramName, selectedVal) {
        this._removeControls(paramName);
        if (paramName == PARAM_TYPE) {
            if (selectedVal == 'true') {
                //create model, surrogate method control
                this._createModelControl();
                this._renderModelControl();
                this._createMethodControl();
            } else {
                //remove model, surrogate method control
                if (this.$deckControlWrapper) {
                    this.$deckControlWrapper.remove();
                    delete this.controls[CONTROL_KEY][PARAM_SUB_METHOD];
                }
                if (this.caller.controls[PARAM_MODEL]) {
                    this.caller.controls[PARAM_MODEL].removeControl();
                }
            }
        } else if (paramName == PARAM_METHOD_NAME) {
            if (selectedVal == 'sampling') {
                this._createDeckDetailControls($deckControl, PARAM_SAMPLE_TYPE);
            } else {
                //selectedVal == dace
                this._createDeckDetailControls($deckControl, PARAM_DACE_TYPE);
            }
        } else {
            this._createDeckDetailControls($deckControl, PARAM_SAMPLES);
            this._createDeckDetailControls($deckControl, PARAM_SEED);
        }
    };

    SurrogateControl.prototype._createDeckDetailControls = function ($control, paramName) {
        var paramObj = this.options.params.find(function (paramConf) {
            return paramName == paramConf.attr
        });
        var controlOpt = $.extend(true, {
            target: this.$deckElem,
            control: this.controls[CONTROL_KEY][PARAM_SUB_METHOD]
        }, paramObj);
        if (paramName === PARAM_METHOD_NAME || paramName === PARAM_SAMPLE_TYPE || paramName === PARAM_DACE_TYPE) {
            this.createDeckDropdownControl($control, controlOpt);
        } else {
            this.createDeckNumberInputControl($control, controlOpt);
        }
    };

    SurrogateControl.prototype._removeControls = function (paramName) {
        if (!this.$deckControlWrapper) {
            return;
        }
        var copiedControl = $.extend(true, {}, this.$deckElem);
        for (var controlElem in copiedControl) {
            if (controlElem != paramName && controlElem != PARAM_METHOD_NAME) {
                this.$deckElem[controlElem].remove();
                delete this.$deckElem[controlElem];
                delete this.controls[CONTROL_KEY][PARAM_SUB_METHOD][controlElem];
            }
        }
    };

    SurrogateControl.prototype.getValue = function () {
        var result = {};
        var _this = this;
        var paramSpecList = this.options.params;
        var controls = this.controls[CONTROL_KEY];
        paramSpecList.forEach(function (paramObj) {
            if (paramObj.attr == PARAM_TYPE) {
                result[paramObj.attr] = (controls[paramObj.attr]) ? controls[paramObj.attr].getValue() : "true";
            } else if (controls[PARAM_SUB_METHOD] && controls[PARAM_SUB_METHOD][paramObj.attr]) {
                result[paramObj.attr] = controls[PARAM_SUB_METHOD][paramObj.attr].getValue();
            }
        });
        return result;
    };


    SurrogateControl.prototype.renderControl = function () {
        if (!this.options.isMandatory) {
            this._renderTypeControl();
            this._renderMethodControl();
        } else {
            this._renderModelControl();
            this._renderMethodControl();
        }
    };

    SurrogateControl.prototype._renderTypeControl = function () {
        var settingVal = this.PARAM_INFO[PARAM_TYPE].Default;
        if (this.options.value && this.options.value[PARAM_TYPE]) {
            settingVal = this.options.value[PARAM_TYPE]
        }
        if (this.controls[CONTROL_KEY][PARAM_TYPE]) {
            this.controls[CONTROL_KEY][PARAM_TYPE].setValue(settingVal);
        }
    };

    SurrogateControl.prototype._renderModelControl = function () {
        var hasModel = this.options.params.some(function (elem) {
            return elem.attr == PARAM_MODEL
        });
        if (hasModel) {
            this.caller._renderObjectArrayControl(PARAM_MODEL);
        }
    };

    SurrogateControl.prototype._renderMethodControl = function () {
        var _this = this;
        var paramSpecList = this.options.params;
        var controls = this.controls[CONTROL_KEY];
        var settingVal;
        paramSpecList.forEach(function (paramObj) {
            if (paramObj.attr != PARAM_TYPE && paramObj.attr != PARAM_MODEL
                && controls[PARAM_SUB_METHOD] && controls[PARAM_SUB_METHOD][paramObj.attr]) {
                if (_this.options.value && _this.options.value[paramObj.attr]) {
                    settingVal = _this.options.value[paramObj.attr];
                    controls[PARAM_SUB_METHOD][paramObj.attr].setValue(settingVal);
                }
            }
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = SurrogateControl;

}).call(this);