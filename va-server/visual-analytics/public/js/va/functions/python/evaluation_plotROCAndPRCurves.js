(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library['brightics.function.evaluation$plot_roc_pr_curve'] = {
        "category": "evaluation",
        "defaultFnUnit": {
            "context": "python",
            "func": "brightics.function.evaluation$plot_roc_pr_curve",
            "name": "brightics.function.evaluation$plot_roc_pr_curve",
            "label": {
                "en": "Plot ROC and PR Curves", 
                "ko": "ROC/PR 커브"
            },
            "tags": {
                "en": [
                    "roc",
                    "curve",
                    "pr",
                    "plot"
                ],
                "ko": [
                    "roc",
                    "커브",
                    "pr",
                    "플롯"
                ]
            },
            "version": "3.6",
            "inputs": {
                "table": ""
            },
            "outputs": {
                "result": ""
            },
            "meta": {
                "table": {
                    "type": "table"
                },
                "result": {
                    "type": "model"
                }
            },
            "param": {
                "label_col": "",
                "probability_col": "",
                "pos_label": "",
                "fig_w": "",
                "fig_h": "",
                "group_by": []
            },
            "display": {
                "label": "Plot ROC and PR Curves",
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
        "description": {
            "en": "Plot ROC Curve and PR Curve.", 
            "ko": "ROC 커브와 PR 커브를 그립니다."
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

    const PARAM_LABEL_COL = 'label_col';
    const PARAM_PROBABILITY_COL= 'probability_col';
    const PARAM_POS_LABEL = 'pos_label';
    const PARAM_FIG_WIDTH = 'fig_w';
    const PARAM_FIG_HEIGHT = 'fig_h';
    const PARAM_GROUP_BY = 'group_by';

    function PlotROCAndPRCurvesProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    PlotROCAndPRCurvesProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    PlotROCAndPRCurvesProperties.prototype.constructor = PlotROCAndPRCurvesProperties;

    PlotROCAndPRCurvesProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    PlotROCAndPRCurvesProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            [PARAM_LABEL_COL]: this.renderLabelCol,
            [PARAM_PROBABILITY_COL]: this.renderProbabilityCol,
            [PARAM_FIG_WIDTH]: this.renderFigureWidth,
            [PARAM_FIG_HEIGHT]: this.renderFigureHeight,
            [PARAM_GROUP_BY]: this.renderGroupBy,
            [PARAM_POS_LABEL]: () => this.showPosLabel(
                this.controls[PARAM_LABEL_COL]
                    .getInternalType(this.options.fnUnit.param[PARAM_LABEL_COL]) === 'String'
                || this.options.fnUnit.param[PARAM_LABEL_COL] === ''),
        };

        this.controls = {};
        this.$elements = {};
        this.renderError = {};

        this.createLabelColsControl();
        this.createProbabilityColsControl();
        this.createPositiveLabelControl();
        this.createFigureWidthControl();
        this.createFigureHeightControl();
        this.createGroupByControl();
    };

    PlotROCAndPRCurvesProperties.prototype.renderLabelCol = function () {
        const param = this.options.fnUnit.param;
        this.controls[PARAM_LABEL_COL].setSelectedItems([param[PARAM_LABEL_COL]]);
    };

    PlotROCAndPRCurvesProperties.prototype.renderPosLabel = function (isStringType) {
        const param = this.options.fnUnit.param;
        if (!isStringType) {
            this.controls[PARAM_POS_LABEL + '_NUM'].setValue(param[PARAM_POS_LABEL]);
        } else {
            this.controls[PARAM_POS_LABEL + '_STR'].val(param[PARAM_POS_LABEL]);
        }
    };

    PlotROCAndPRCurvesProperties.prototype.showPosLabel = function (isStringType) {
        this.renderPosLabel(isStringType);
        if (!isStringType) {
            this.$elements[PARAM_POS_LABEL + '_STR'].css('display', 'none');
            this.$elements[PARAM_POS_LABEL + '_NUM'].css('display', 'unset');
        } else {
            this.$elements[PARAM_POS_LABEL + '_STR'].css('display', 'unset');
            this.$elements[PARAM_POS_LABEL + '_NUM'].css('display', 'none');
        }
    };

    PlotROCAndPRCurvesProperties.prototype.renderGroupBy = function () {
        const param = this.options.fnUnit.param;
        this.controls[PARAM_GROUP_BY].setSelectedItems(param[PARAM_GROUP_BY]);
    };

    PlotROCAndPRCurvesProperties.prototype.renderProbabilityCol = function () {
        const param = this.options.fnUnit.param;
        this.controls[PARAM_PROBABILITY_COL].setSelectedItems([param[PARAM_PROBABILITY_COL]]);
    };

    PlotROCAndPRCurvesProperties.prototype.renderFigureWidth = function () {
        const param = this.options.fnUnit.param;
        this.controls[PARAM_FIG_WIDTH].setValue(param[PARAM_FIG_WIDTH]);
    };

    PlotROCAndPRCurvesProperties.prototype.renderFigureHeight = function () {
        const param = this.options.fnUnit.param;
        this.controls[PARAM_FIG_HEIGHT].setValue(param[PARAM_FIG_HEIGHT]);
    };

    PlotROCAndPRCurvesProperties.prototype.createPositiveLabelControl = function () {
        this.$elements[PARAM_POS_LABEL + '_STR'] = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        this.$elements[PARAM_POS_LABEL + '_NUM'] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        this.addPropertyControl('Positive Label', $container => {
            const createNumericInputBoxControl = id => {
                $container.append(this.$elements[PARAM_POS_LABEL + '_NUM']);
                const options = {
                    numberType: 'double'
                };
                this.controls[id] = this.createNumericInput(this.$elements[PARAM_POS_LABEL + '_NUM'], options);

                this.controls[id].onChange(() => {
                    let val = this.controls[id].getValue();
                    val = val === '' ? '' : Number(val);
                    const command = this.createSetParameterValueCommand(PARAM_POS_LABEL, val);
                    this.executeCommand(command);
                });
            };
            const createStringInputBoxControl = id => {
                $container.append(this.$elements[PARAM_POS_LABEL + '_STR']);
                const self = this;
                this.controls[id] = this.createInput(this.$elements[PARAM_POS_LABEL + '_STR'], {});
                this.$elements[PARAM_POS_LABEL + '_STR'].on('change', function () {
                    if (!self.isInputValueChanged(PARAM_POS_LABEL, $(this).val())) return;
                    const command = self.createSetParameterValueCommand(PARAM_POS_LABEL, $(this).val());
                    self.executeCommand(command);
                });
            };
            createStringInputBoxControl(PARAM_POS_LABEL + '_STR');
            createNumericInputBoxControl(PARAM_POS_LABEL + '_NUM');
        }, {mandatory: false});
    };

    PlotROCAndPRCurvesProperties.prototype.createFigureWidthControl = function () {
        this.$elements[PARAM_FIG_WIDTH] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        this.addPropertyControl('Figure Width', $container => {
            $container.append(this.$elements[PARAM_FIG_WIDTH]);
            const options = {
                numberType: 'double'
            };
            this.controls[PARAM_FIG_WIDTH] = this.createNumericInput(this.$elements[PARAM_FIG_WIDTH], options);

            this.controls[PARAM_FIG_WIDTH].onChange(() => {
                let val = this.controls[PARAM_FIG_WIDTH].getValue();
                val = val === '' ? '' : Number(val);
                const command = this.createSetParameterValueCommand(PARAM_FIG_WIDTH, val);
                this.executeCommand(command);
            });
        }, {mandatory: false});
    };

    PlotROCAndPRCurvesProperties.prototype.createFigureHeightControl = function () {
        this.$elements[PARAM_FIG_HEIGHT] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        this.addPropertyControl('Figure Height', $container => {
            $container.append(this.$elements[PARAM_FIG_HEIGHT]);
            const options = {
                numberType: 'double'
            };
            this.controls[PARAM_FIG_HEIGHT] = this.createNumericInput(this.$elements[PARAM_FIG_HEIGHT], options);

            this.controls[PARAM_FIG_HEIGHT].onChange(() => {
                let val = this.controls[PARAM_FIG_HEIGHT].getValue();
                val = val === '' ? '' : Number(val);
                const command = this.createSetParameterValueCommand(PARAM_FIG_HEIGHT, val);
                this.executeCommand(command);
            });
        }, {mandatory: false});
    };

    PlotROCAndPRCurvesProperties.prototype.createProbabilityColsControl = function () {
        this.$elements[PARAM_PROBABILITY_COL] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');
        this.addPropertyControl('Probability Column', $container => {
            $container.append(this.$elements[PARAM_PROBABILITY_COL]);
            const opt = {
                "multiple":false,
                "maxRowCount":"",
                changed: (type, data) => {
                    const command = this.createSetParameterValueCommand(PARAM_PROBABILITY_COL, data.items[0] || '');
                    this.executeCommand(command)
                }
            };
            this.controls[PARAM_PROBABILITY_COL] = this.createColumnList(this.$elements[PARAM_PROBABILITY_COL], opt);
        }, {mandatory: true});
    };

    PlotROCAndPRCurvesProperties.prototype.createLabelColsControl = function () {
        this.$elements[PARAM_LABEL_COL] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');
        this.addPropertyControl('Label Column', $container => {
            $container.append(this.$elements[PARAM_LABEL_COL]);
            const opt = {
                "multiple":false,
                "maxRowCount":"",
                changed: (type, data) => {
                    const isStringType = this.controls[PARAM_LABEL_COL].getInternalType(data.items[0]) === 'String';
                    const oldPosLabelValue = this.options.fnUnit.param[PARAM_POS_LABEL];
                    let posLabelValue = isStringType
                        ?  `${oldPosLabelValue}`
                        : (isNaN(parseFloat(oldPosLabelValue))
                            ? ''
                            : parseFloat(oldPosLabelValue));
                    var command = this.createSetParameterValueInLabelColsCommand(
                        [
                            [PARAM_LABEL_COL, data.items[0] || ''],
                            [PARAM_POS_LABEL, posLabelValue]
                        ]);
                    this.executeCommand(command);
                    this.showPosLabel(isStringType);
                }
            };
            this.controls[PARAM_LABEL_COL] = this.createColumnList(this.$elements[PARAM_LABEL_COL], opt);
        }, {mandatory: true});
    };

    PlotROCAndPRCurvesProperties.prototype.createSetParameterValueInLabelColsCommand = function (params,
                                                                         force = true) {
        let commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };
        params.forEach(param => {
            let [paramName, paramValue] = param;
            if (!force && this.getParam(paramName) === paramValue) return null;
            if (paramValue !== 0 && !paramValue && typeof paramValue !== 'boolean') paramValue = '';
            commandOption.ref.param[paramName] = paramValue;
        });
        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
    };

    PlotROCAndPRCurvesProperties.prototype.createGroupByControl = function () {
        this.$elements[PARAM_GROUP_BY] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');
        this.addPropertyControl('Group By', $container => {
            $container.append(this.$elements[PARAM_GROUP_BY]);
            const opt = {
                "multiple":true,
                changed: (type, data) => {
                    const command = this.createSetParameterValueCommand(PARAM_GROUP_BY, data.items || []);
                    this.executeCommand(command)
                }
            };
            this.controls[PARAM_GROUP_BY] = this.createColumnList(this.$elements[PARAM_GROUP_BY], opt);
        }, {mandatory: false});
    };

    PlotROCAndPRCurvesProperties.prototype.fillControlValues = function () {
        const inputs = this.FnUnitUtils.getInputs(this.options.fnUnit);
        const inputsData = this.dataMap ? inputs['table'] ? this.dataMap[inputs['table']].columns : [] : [];

        this.controls[PARAM_LABEL_COL].setItems(inputsData);
        this.controls[PARAM_PROBABILITY_COL].setItems(inputsData);
        this.controls[PARAM_GROUP_BY].setItems(inputsData);
    };

    PlotROCAndPRCurvesProperties.prototype.renderValidation = function () {
    };

    Brightics.VA.Core.Functions.Library['brightics.function.evaluation$plot_roc_pr_curve'].propertiesPanel = PlotROCAndPRCurvesProperties;
}).call(this);


/**************************************************************************
 *                               Validator
 *************************************************************************/
/**
 * Created by jmk09.jung on 2016-03-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PlotROCAndPRCurvesValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    PlotROCAndPRCurvesValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    PlotROCAndPRCurvesValidator.prototype.constructor = PlotROCAndPRCurvesValidator;

    PlotROCAndPRCurvesValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
    };

    Brightics.VA.Core.Functions.Library['brightics.function.evaluation$plot_roc_pr_curve'].validator = PlotROCAndPRCurvesValidator;

}).call(this);
