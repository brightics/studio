/**
 * Created by sds on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'model',
        PARAM_APPROXIMATION = 'surr-approximation',
        PARAM_TRAINING_POINTS = 'surr-training-points',
        PARAM_MAX_NODES = 'max-nodes',
        PARAM_POLYNOMIAL_ORDER_TYPE = 'polynomial-order-type',
        PARAM_BASIS_ORDER = 'basis-order',
        PARAM_TOTAL_POINT = 'total-point';

    function ModelControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ModelControl.prototype = Object.create(_super);
    ModelControl.prototype.constructor = ModelControl;

    ModelControl.Label = 'Model';
    ModelControl.Section = 'left';

    ModelControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        var paramInfo = [{
            Key: PARAM_APPROXIMATION,
            Label: 'Approximation',
            Default: 'gaussian_process',
            Source: [
                {
                    "label": "Gaussian Process",
                    "value": "gaussian_process"
                },
                {
                    "label": "Mars",
                    "value": "mars"
                },
                {
                    "label": "Moving Least Squares",
                    "value": "moving_least_squares"
                },
                {
                    "label": "Radial Basis",
                    "value": "radial_basis"
                },
                {
                    "label": "Neural Network",
                    "value": "neural_network"
                },
                {
                    "label": "Polynomial",
                    "value": "polynomial"
                }
            ]
        }, {
            Key: PARAM_TRAINING_POINTS,
            Label: 'Training Points',
            Source: [
                {
                    "label": "Total Points",
                    "value": "total_points"
                },
                {
                    "label": "Minimum Points",
                    "value": "minimum_points"
                },
                {
                    "label": "Recommended Points",
                    "value": "recommended_points"
                }
            ]
        }, {
            Key: PARAM_MAX_NODES,
            Label: 'Max Nodes' //input
        }, {
            Key: PARAM_POLYNOMIAL_ORDER_TYPE,
            Label: 'Polynomial Order Type',
            Source: [
                {
                    "label": "Cubic",
                    "value": "cubic"
                },
                {
                    "label": "Basis Order",
                    "value": "basis_order"
                },
                {
                    "label": "Linear",
                    "value": "linear"
                },
                {
                    "label": "Quadratic",
                    "value": "quadratic"
                }
            ]
        }, {
            Key: PARAM_BASIS_ORDER,
            Label: 'Basis Order' //input
        }, {
            Key: PARAM_TOTAL_POINT,
            Label: 'Total Point'//input
        }];

        this.registerSpec(paramInfo);
        this.controls[CONTROL_KEY] = {},
            this.deckControl = {};
    };

    ModelControl.prototype.createControl = function () {
        var _this = this;

        var propPanel = this.caller;
        this.$mainControl = propPanel.addPropertyControl(ModelControl.Label, function ($container) {
            _this.$controlContainer = $container;
        }, {
            propertyControlParent: _this.getSection(ModelControl.Section),
            mandatory: _this.options.isMandatory
        });
    };


    ModelControl.prototype.createDeck = function ($container) {
        var $deckControl = $('<div class = "brtc-va-editors-sheet-controls-propertycontrol-deck method"/>');
        this.$controlContainer.append($deckControl);
        this._createDeckDetailControls($deckControl);
    };

    ModelControl.prototype._createDeckDetailControls = function ($deckControl, paramName) {
        var _this = this;
        var paramNm, paramObj;
        if (paramName) {
            paramObj = this.options.params.find(function (paramConf) {
                return paramName == paramConf.attr
            });
            paramNm = paramName;
        } else {
            paramObj = this.options.params[0];
            paramNm = paramObj.attr;
        }
        paramObj.target = this.deckControl;
        if (paramNm === PARAM_APPROXIMATION || paramNm === PARAM_TRAINING_POINTS || paramNm === PARAM_POLYNOMIAL_ORDER_TYPE) {
            _this.createDeckDropdownControl($deckControl, paramObj);
        } else if (paramNm === PARAM_MAX_NODES || paramNm === PARAM_BASIS_ORDER || paramNm === PARAM_TOTAL_POINT) {
            _this.createDeckNumberInputControl($deckControl, paramObj);
        }
    };

    ModelControl.prototype.configureControls = function ($deckControl, paramName, selectedVal) {
        this._removeControls(paramName);
        if (paramName == PARAM_APPROXIMATION) {
            // selectedVal == 'gaussian_process' : do nothing
            if (['mars', 'moving_least_squares', 'radial_basis'].includes(selectedVal)) {
                this._createDeckDetailControls($deckControl, PARAM_TRAINING_POINTS);
            } else if (selectedVal == 'neural_network') {
                this._createDeckDetailControls($deckControl, PARAM_MAX_NODES);
            } else if (selectedVal == 'polynomial') {
                this._createDeckDetailControls($deckControl, PARAM_POLYNOMIAL_ORDER_TYPE);
            }
        } else if (paramName == PARAM_TRAINING_POINTS) {
            if (selectedVal == 'total_points') {
                this._createDeckDetailControls($deckControl, PARAM_TOTAL_POINT);
            }
        } else if (paramName == PARAM_POLYNOMIAL_ORDER_TYPE) {
            if (selectedVal == 'basis_order') {
                this._createDeckDetailControls($deckControl, PARAM_BASIS_ORDER);
            }
        }
    };

    ModelControl.prototype._removeControls = function (paramName) {
        var copiedControl = $.extend(true, {}, this.deckControl);
        for (var controlElem in copiedControl) {
            if (controlElem != paramName && controlElem != PARAM_APPROXIMATION) {
                this.deckControl[controlElem].remove();
                delete this.controls[CONTROL_KEY][controlElem];
            }
        }
    };

    ModelControl.prototype.renderControl = function () {
        var _this = this;
        if(this.controls[CONTROL_KEY]){
            this.createDeck();
        }
        if (!this.options.value) {
            return;
        }
        var paramSpecList = this.options.params;
        paramSpecList.forEach(function (paramObj) {
            if (_this.controls[CONTROL_KEY][paramObj.attr] && _this.options.value[paramObj.attr]) {
                _this.controls[CONTROL_KEY][paramObj.attr].setValue(_this.options.value[paramObj.attr]);
            }
        });
    };

    ModelControl.prototype.getValue = function () {
        var result = {};
        var _this = this;

        var paramSpecList = this.options.params;
        paramSpecList.forEach(function (paramObj) {
            if (_this.controls[CONTROL_KEY] && _this.controls[CONTROL_KEY][paramObj.attr]) {
                result[paramObj.attr] = _this.controls[CONTROL_KEY][paramObj.attr].getValue();
            }
        });
        return result;
    };

    ModelControl.prototype.removeControl = function () {
        if (this.$mainControl) {
            delete this.controls[CONTROL_KEY];
            this.$mainControl.remove();
        }
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ModelControl;

}).call(this);