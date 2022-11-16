/**
 * Created by sds on 2018-02-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.BaseMultipleDeck.prototype;

    const CONTROL_KEY = 'constraints',
        PARAM_NAME = 'name',
        PARAM_TYPE = 'type',
        PARAM_TARGET = 'target',
        PARAM_MIN = 'min',
        PARAM_MAX = 'max',
        PARAM_SCALE_TYPE = 'scale-type',
        PARAM_SCALE = 'scale';

    function ConstraintsControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ConstraintsControl.prototype = Object.create(_super);
    ConstraintsControl.prototype.constructor = ConstraintsControl;

    ConstraintsControl.Label = 'Constraints';

    ConstraintsControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;

        var paramInfo = [{
            Key: PARAM_NAME,
            Label: 'Name'
        }, {
            Key: PARAM_TYPE,
            Label: 'Type',
            Default: 'inequality',  //dropdown
            Source: [
                {
                    "label": "Inequality",
                    "value": "inequality"
                },
                {
                    "label": "Equality",
                    "value": "equality"
                }
            ]
        }, {
            Key: PARAM_TARGET,
            Label: 'Target',
            Default: '0',
            NumberType: 'double'
        }, {
            Key: PARAM_MIN,
            Label: 'Min',
            Default: '-1.e+30',
            NumberType: 'double'
        }, {
            Key: PARAM_MAX,
            Label: 'Max',
            Default: '0',
            NumberType: 'double'
        }, {

            Key: PARAM_SCALE_TYPE,
            Label: 'Scale Type',//dropdown
            Default: 'none',
            Source: [
                "none",
                "value",
                "auto",
                "log"
            ]
        }, {
            Key: PARAM_SCALE,
            Label: 'Scale',
            Default: '1',
            NumberType: 'double'
        }];

        this.registerSpec(paramInfo);
        this.controls[CONTROL_KEY] = [];
        this.$deckElem = [];
    };

    ConstraintsControl.prototype.createControl = function () {
        var _this = this;

        var propPanel = this.caller;
        propPanel.addPropertyControl(this.getLabel(), function ($container) {
            _this.$controlContainer = $container;
        }, {
            propertyControlParent: _this.getSection(ConstraintsControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.createAddButton();
    };


    ConstraintsControl.prototype.createDeck = function ($container) {
        var $deckControl = $('<div class = "brtc-va-editors-sheet-controls-propertycontrol-deck method"/>');
        this.$controlContainer.append($deckControl);
        var methodIdx = (this.controls[CONTROL_KEY]) ? this.controls[CONTROL_KEY].length : 0;
        this.createDeleteButton($deckControl);
        this._createDeckDetailControls($deckControl, PARAM_NAME, methodIdx);
        this._createDeckDetailControls($deckControl, PARAM_TYPE, methodIdx);
    };

    ConstraintsControl.prototype.configureControls = function ($deckControl, paramName, selectedVal, controlIndex) {
        this._removeControls(paramName, controlIndex);

        if (paramName == PARAM_TYPE) {
            if (selectedVal == 'equality') {
                this._createDeckDetailControls($deckControl, PARAM_TARGET, controlIndex);
            } else if (selectedVal == 'inequality') {
                this._createDeckDetailControls($deckControl, PARAM_MIN, controlIndex);
                this._createDeckDetailControls($deckControl, PARAM_MAX, controlIndex);
            }
            if (this.getScalingValue()) {
                this._createDeckDetailControls($deckControl, PARAM_SCALE_TYPE, controlIndex);
                this._createDeckDetailControls($deckControl, PARAM_SCALE, controlIndex);
            }
        }
    };

    ConstraintsControl.prototype._createDeckDetailControls = function ($deckControl, paramName, controlIndex) {
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
                target: this.$deckElem[controlIndex],
                control: this.controls[CONTROL_KEY][controlIndex]
            }, paramObj);
        }

        if (paramName === PARAM_TYPE || paramName === PARAM_SCALE_TYPE) {
            _this.createDeckDropdownControl($deckControl, controlOpt, controlIndex);
        } else if (paramName === PARAM_NAME) {
            _this.createDeckInputControl($deckControl, controlOpt, controlIndex);
        } else if ([PARAM_TARGET, PARAM_MIN, PARAM_MAX, PARAM_SCALE].includes(paramName)) {
            _this.createDeckNumberInputControl($deckControl, controlOpt, controlIndex);
        }
    };

    ConstraintsControl.prototype._removeControls = function (paramName, controlIndex) {
        var copiedControl;
        if (paramName == PARAM_TYPE) {
            copiedControl = $.extend(true, {}, this.$deckElem[controlIndex]);
            for (var controlElem in copiedControl) {
                if (controlElem != paramName && ![PARAM_NAME, PARAM_TYPE].includes(controlElem)) {
                    this.$deckElem[controlIndex][controlElem].remove();
                    delete this.$deckElem[controlIndex][controlElem];
                    delete this.controls[CONTROL_KEY][controlIndex][controlElem];
                }
            }
        }
    };

    ConstraintsControl.prototype.updateSectionScroll = function () {
        this.getSection(ConstraintsControl.Section).perfectScrollbar('update');
    };

    ConstraintsControl.prototype.getLabel = function () {
        return ConstraintsControl.Label;
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ConstraintsControl;

}).call(this);