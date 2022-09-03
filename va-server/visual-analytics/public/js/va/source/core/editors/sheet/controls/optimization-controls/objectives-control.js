/**
 * Created by sds on 2018-02-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.BaseMultipleDeck.prototype;

    const CONTROL_KEY = 'objectives',
        PARAM_NAME = 'name',
        PARAM_SENSE = 'sense',
        PARAM_SCALE_TYPE = 'scale-type',
        PARAM_SCALE = 'scale';

    function ObjectivesControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ObjectivesControl.prototype = Object.create(_super);
    ObjectivesControl.prototype.constructor = ObjectivesControl;

    ObjectivesControl.Label = 'Objectives';

    ObjectivesControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;

        var paramInfo = [{
            Key: PARAM_NAME,
            Label: 'Name'
        }, {
            Key: PARAM_SENSE,
            Label: 'Sense',
            Default: 'minimize',
            Source: [
                {
                    "label": "Maximize",
                    "value": "maximize"
                },
                {
                    "label": "Minimize",
                    "value": "minimize"
                }
            ]
        }, {
            Key: PARAM_SCALE_TYPE,
            Label: 'Scale Type',
            Default: 'none',
            Source: [
                {
                    "label": "None",
                    "value": "none"
                },
                {
                    "label": "Value",
                    "value": "value"
                },
                {
                    "label": "Log",
                    "value": "log"
                }
            ]
        }, {
            Key: PARAM_SCALE,
            Label: 'Scale',
            NumberType: 'double',
            Default: '1.0'
        }];

        this.registerSpec(paramInfo);
        this.controls[CONTROL_KEY] = [];
        this.$deckElem = [];
    };

    ObjectivesControl.prototype.createControl = function () {
        var _this = this;

        var propPanel = this.caller;
        propPanel.addPropertyControl(this.getLabel(), function ($container) {
            _this.$controlContainer = $container;
        }, {
            propertyControlParent: _this.getSection(ObjectivesControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.createAddButton();
    };


    ObjectivesControl.prototype.createDeck = function () {
        var $deckControl = $('<div class = "brtc-va-editors-sheet-controls-propertycontrol-deck method"/>');
        this.$controlContainer.append($deckControl);
        var methodIdx = (this.controls[CONTROL_KEY]) ? this.controls[CONTROL_KEY].length : 0;
        this.createDeleteButton($deckControl);

        var _this = this;
        var scalingVal = this.getScalingValue();
        var paramObj;
        for (var paramIdx = 0; paramIdx < this.options.params.length; paramIdx++) {
            paramObj = this.options.params[paramIdx];
            if (!scalingVal && [PARAM_SCALE_TYPE, PARAM_SCALE].includes(paramObj.attr)) {
                continue;
            }
            _this._createDeckDetailControls($deckControl, paramObj.attr, methodIdx);
        }
    };

    ObjectivesControl.prototype._createDeckDetailControls = function ($deckControl, paramName, controlIndex) {
        var _this = this, controlOpt = {};
        if (!this.controls[CONTROL_KEY][controlIndex]) {
            this.controls[CONTROL_KEY][controlIndex] = {};
            this.$deckElem[controlIndex] = {};
        }

        var paramObj = this.options.params.find(function (paramConf) {
            return paramName == paramConf.attr
        });
        if (typeof paramObj == 'undefined') {
            console.warn(paramName+' is not defined in json');
            return;
        } else {
            controlOpt = $.extend(true, {
                target: this.$deckElem[controlIndex]
            }, paramObj);
        }

        if (paramName === PARAM_SENSE || paramName === PARAM_SCALE_TYPE) {
            _this.createDeckDropdownControl($deckControl, controlOpt, controlIndex);
        } else if (paramName === PARAM_NAME) {
            _this.createDeckInputControl($deckControl, controlOpt, controlIndex);
        } else if (paramName === PARAM_SCALE) {
            _this.createDeckNumberInputControl($deckControl, controlOpt, controlIndex);
        }
    };

    ObjectivesControl.prototype.updateSectionScroll = function () {
        this.getSection(ObjectivesControl.Section).perfectScrollbar('update');
    };

    ObjectivesControl.prototype.getLabel = function () {
        return ObjectivesControl.Label;
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ObjectivesControl;

}).call(this);