/**
 * Created by sds on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'submethod',
        PARAM_METHOD_NAME = 'method-name',
        PARAM_MAX_ITERATIONS = 'max-iterations';

    function SubmethodControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    SubmethodControl.prototype = Object.create(_super);
    SubmethodControl.prototype.constructor = SubmethodControl;

    SubmethodControl.Label = 'Submethod';
    SubmethodControl.Section = 'left';

    SubmethodControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        var paramInfo = [{
            Key: PARAM_METHOD_NAME,
            Label: 'Method Name',
            Source: [
                {
                    "label": "Conmin Frcg",
                    "value": "conmin_frcg"
                },
                {
                    "label": "Conmin Mfd",
                    "value": "conmin_mfd"
                },
                {
                    "label": "Optpp Fd Newton",
                    "value": "optpp_fd_newton"
                },
                {
                    "label": "Optpp G Newton",
                    "value": "optpp_g_newton"
                },
                {
                    "label": "Optpp Newton",
                    "value": "optpp_newton"
                },
                {
                    "label": "Optpp Pds",
                    "value": "optpp_pds"
                },
                {
                    "label": "Coliny Cobyla",
                    "value": "coliny_cobyla"
                },
                {
                    "label": "Coliny Solis Wets",
                    "value": "coliny_solis_wets"
                },
                {
                    "label": "Ncsu Direct",
                    "value": "ncsu_direct"
                },
                {
                    "label": "Soga",
                    "value": "soga"
                },
                {
                    "label": "Moga",
                    "value": "moga"
                },
                {
                    "label": "Asynch Pattern Search",
                    "value": "asynch_pattern_search"
                },
                {
                    "label": "Coliny Pattern Search",
                    "value": "coliny_pattern_search"
                },
                {
                    "label": "Coliny Direct",
                    "value": "coliny_direct"
                },
                {
                    "label": "Coliny Ea",
                    "value": "coliny_ea"
                },
                {
                    "label": "Efficient Global",
                    "value": "efficient_global"
                }
            ]
        }, {
            Key: PARAM_MAX_ITERATIONS,
            Default: '100',
            Label: 'Max Iterations'
        }];

        this.registerSpec(paramInfo);
        this.controls[CONTROL_KEY] = {}
    };

    SubmethodControl.prototype.createControl = function () {
        var _this = this;

        var propPanel = this.caller;
        propPanel.addPropertyControl(SubmethodControl.Label, function ($container) {
            _this.$controlContainer = $container;
        }, {
            propertyControlParent: _this.getSection(SubmethodControl.Section),
            mandatory: _this.options.isMandatory
        });
    };


    SubmethodControl.prototype.createDeck = function ($container) {
        var $deckControl = $('<div class = "brtc-va-editors-sheet-controls-propertycontrol-deck method"/>');
        this.$controlContainer.append($deckControl);
        this._createDeckDetailControls($deckControl);
    };

    SubmethodControl.prototype._createDeckDetailControls = function ($deckControl) {
        var _this = this;
        var paramName;
        var paramSpecList = this.options.params;
        paramSpecList.forEach(function (paramObj) {
            paramName = paramObj.attr;
            if (paramName === PARAM_METHOD_NAME) {
                _this.createDeckDropdownControl($deckControl, paramObj);
            } else {
                _this.createDeckNumberInputControl($deckControl, paramObj);
            }
        });
    };

    SubmethodControl.prototype.renderControl = function () {
        var _this = this;
        this.createDeck();
        if (!this.options.value) {
            return;
        }
        var paramSpecList = this.options.params;
        paramSpecList.forEach(function (paramObj) {
            _this.controls[CONTROL_KEY][paramObj.attr].setValue(_this.options.value[paramObj.attr]);
        });
    };

    SubmethodControl.prototype.getValue = function () {
        var result = {};
        var _this = this;
        var paramSpecList = this.options.params;
        paramSpecList.forEach(function (paramObj) {
            result[paramObj.attr] = _this.controls[CONTROL_KEY][paramObj.attr].getValue();
        });
        return result;
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = SubmethodControl;

}).call(this);