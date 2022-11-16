/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    let root = this;
    let Brightics = root.Brightics;

    function Parameters(parentId, options) {

        this.parentId = parentId;
        this.options = options || {};
        this.init();
        this.retrieveParent();
        this.createControls();
        this.renderValues();
    }

    Parameters.prototype.init = function () {
        let _this = this;

        this.isRendered = false;

        this.parameters = $.extend(true, this.parameters, this.options.modelContents.param);

        this.commandListener = function (command) {
            if (_this.isRendered) {
                _this.isRendered = false;
                _this.handleCommand(command);
                _this.isRendered = true;
            } else {
                _this.handleCommand(command);
            }
        };
    };

    Parameters.prototype.executeCommand = function (command) {
        if (this.isRendered) {
            this.activeEditor.getCommandManager().execute(command);
        }
    };

    Parameters.prototype.handleCommand = function (command) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand) {
            for (let i in command.options.commands) {
                this.handleCommand(command.options.commands[i]);
            }
        }
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UpdateParameterCommand) this.handleUpdateParameterCommand(command);
    };

    Parameters.prototype.editorChanged = function (editor) {
        if (editor) {
            if (this.activeEditor) {
                this.activeEditor.removeCommandListener(this.commandListener);
                this.activeEditor.removeGoHistoryListener(this.commandListener);
            }
            this.activeEditor = editor;

            this.activeEditor.addCommandListener(this.commandListener);
            this.activeEditor.addGoHistoryListener(this.commandListener);
        }
        else {
            this.activeEditor = null;
        }
    };

    Parameters.prototype.handleUpdateParameterCommand = function (command) {
        if (command.event.type === 'UNDO' || command.event.type === 'REDO') {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UpdateParameterCommand) {
                this.parameters = $.extend(true, {}, this.options.modelContents.param);
                this.renderValues();
            }
        } else {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UpdateParameterCommand) {
                this.parameters = $.extend(true, {}, this.options.modelContents.param);
            }
        }
    };

    Parameters.prototype.createUpdateParametersCommand = function (key, val) {
        let command = new Brightics.VA.Core.Editors.Diagram.Commands.UpdateParameterCommand(this.activeEditor, {
            name: key,
            ref: val
        });
        this.executeCommand(command);
    };

    Parameters.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Parameters.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-views-parameters">' +
            '   <div class="brtc-va-views-parameters-wrapper"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.createLossControl();
        this.createMetricsControl();
        this.createBatchSizeControl();
        this.createEpochsControl();
        this.createStepsPerEpochControl();
        this.createValidationStepsControl();
        this.createOptimizerControl();

        this.createCheckPointGroupNameControl();

        this.$mainControl.find('.brtc-va-views-parameters-wrapper').perfectScrollbar();
    };

    Parameters.prototype.renderValues = function () {
        this.isRendered = false;

        this.renderLossControl();
        this.renderMetricsControl();
        this.renderBatchSizeControl();
        this.renderEpochsControl();
        this.renderStepsPerEpochControl();
        this.renderValidationStepsControl();
        this.renderOptimizerControl();

        this.renderCheckPointGroupNameControl();
        this.isRendered = true;
    };

    Parameters.prototype.createLossControl = function () {
        let _this = this;

        this.LOSSTYPES = [
            {label: 'mean_squared_error', value: 'mean_squared_error'},
            {label: 'mean_absolute_error', value: 'mean_absolute_error'},
            {label: 'categorical_crossentropy', value: 'categorical_crossentropy'},
            {label: 'binary_crossentropy', value: 'binary_crossentropy'}
        ];


        this.$loss = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');

        this.addPropertyControl('Loss', function ($parent) {
            _this.createDropDownList(this.$loss, {
                source: _this.LOSSTYPES,
                displayMember: 'label',
                valueMember: 'value'
            });
            $parent.append(this.$loss.parent());
            _this.$loss.on('change', function () {
                _this.createUpdateParametersCommand('loss', $(this).val());
                _this.setParameter('loss', $(this).val());
            });
        });
    };
    Parameters.prototype.createMetricsControl = function () {
        let _this = this;

        this.MATRICSTYPES = [
            {label: 'accuracy', value: 'accuracy'},
            {label: 'binary_accuracy', value: 'binary_accuracy'},
            {label: 'categorical_accuracy', value: 'categorical_accuracy'}
        ];

        this.$metrics = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');

        this.addPropertyControl('Metrics', function ($parent) {
            _this.createDropDownList(this.$metrics, {
                source: _this.MATRICSTYPES,
                displayMember: 'label',
                valueMember: 'value'
            });
            $parent.append(this.$metrics.parent());
            _this.$metrics.on('change', function () {
                _this.createUpdateParametersCommand('metrics', $(this).val());
                _this.setParameter('metrics', $(this).val());
            });
        });
    };
    Parameters.prototype.createBatchSizeControl = function () {
        this.$batchSize = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
    };

    Parameters.prototype.createEpochsControl = function () {
        this.$epochs = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
    };

    Parameters.prototype.createStepsPerEpochControl = function () {
        let _this = this;

        let $stepsPerEpochs = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');

        this.addPropertyControl('Steps Per Epoch', function ($parent) {
            $parent.append($stepsPerEpochs);
            let jqxOptions = {
                numberType: 'int',
                min: 0,
                minus: false,
                placeholder: 'Default: None'
            };
            _this.stepsPerEpochsControl = _this.createNumericInput($stepsPerEpochs, jqxOptions);
            _this.stepsPerEpochsControl.onChange(function () {
                _this.createUpdateParametersCommand('steps_per_epoch', this.getValue());
                _this.setParameter('steps_per_epoch', this.getValue());
            });
        });
    };

    Parameters.prototype.createValidationStepsControl = function () {
        let _this = this;

        let $validationSteps = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');

        this.addPropertyControl('Validation Steps', function ($parent) {
            $parent.append($validationSteps);
            let jqxOptions = {
                numberType: 'int',
                min: 0,
                minus: false,
                placeholder: 'Default: None'
            };
            _this.validationStepsControl = _this.createNumericInput($validationSteps, jqxOptions);
            _this.validationStepsControl.onChange(function () {
                _this.createUpdateParametersCommand('validation_steps', this.getValue());
                _this.setParameter('validation_steps', this.getValue());
            });
        });
    };


    Parameters.prototype.createOptimizerControl = function () {
        let _this = this;

        this.OPTIMIZERTYPES = [
            {label: 'SGD', value: 'sgd'},
            {label: 'RMSprop', value: 'rmsprop'},
            {label: 'Adadelta', value: 'adadelta'},
            {label: 'Adam', value: 'adam'},
            {label: 'Adamax', value: 'adamax'},
            {label: 'Nadam', value: 'nadam'}
        ];

        this.$optimizer = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');

        this.addPropertyControl('Optimizer', function ($parent) {
            _this.createDropDownList(this.$optimizer, {
                source: _this.OPTIMIZERTYPES,
                displayMember: 'label',
                valueMember: 'value'
            });
            $parent.append(this.$optimizer.parent());
            _this.$optimizer.on('change', function () {
                _this.createUpdateParametersCommand('optimizer', $(this).val());
                _this.setParameter('optimizer', $(this).val());
            });
        });
    };
    Parameters.prototype.createEvaluationControl = function () {
        let _this = this;
        this.$evaluationTrueControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">True</div>');
        this.$evaluationFalseControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">False</div>');

        this.addPropertyControl('Evaluation', function ($parent) {
            $parent.append(this.$evaluationTrueControl).append(this.$evaluationFalseControl);
            _this.createRadioButton(_this.$evaluationTrueControl, {width: '80', groupName: 'evaluation'});
            _this.createRadioButton(_this.$evaluationFalseControl, {width: '80', groupName: 'evaluation'});
            _this.$evaluationTrueControl.on('checked', function () {
                _this.createUpdateParametersCommand('evaluation', true);
                _this.setParameter('evaluation', true);
            });
            _this.$evaluationFalseControl.on('checked', function () {
                _this.createUpdateParametersCommand('evaluation', false);
                _this.setParameter('evaluation', false);
            });
        });

        this.$evaluationTrueControl.jqxRadioButton('check');
    };
    Parameters.prototype.createExecutionControl = function () {
        let _this = this;
        this.$executionTrueControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">True</div>');
        this.$executionFalseControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">False</div>');

        this.addPropertyControl('Execution', function ($parent) {
            $parent.append(this.$executionTrueControl).append(this.$executionFalseControl);
            _this.createRadioButton(_this.$executionTrueControl, {width: '80', groupName: 'execution'});
            _this.createRadioButton(_this.$executionFalseControl, {width: '80', groupName: 'execution'});
            _this.$executionTrueControl.on('checked', function () {
                _this.createUpdateParametersCommand('execution', true);
                _this.setParameter('execution', true);
            });
            _this.$executionFalseControl.on('checked', function () {
                _this.createUpdateParametersCommand('execution', false);
                _this.setParameter('execution', false);
            });
        });

        this.$executionTrueControl.jqxRadioButton('check');
    };

    Parameters.prototype.createTrainDataControl = function () {
        let _this = this;

        this.$trainData = $('<input class="brtc-va-editors-sheet-controls-propertycontrol-input" valid-type="type1"/>');

        this.addPropertyControl('Train Data', function ($parent) {
            $parent.append(_this.$trainData);
            _this.trainDataControl = _this.createInput(_this.$trainData, {
                height: '23px'
            }, '')
        });

        this.$trainData.on('change', function () {
            _this.createUpdateParametersCommand('train_data', $(this).val());
            _this.setParameter('train_data', $(this).val());
        });
    };
    Parameters.prototype.createTrainLabelControl = function () {
        let _this = this;

        this.$trainLabel = $('<input class="brtc-va-editors-sheet-controls-propertycontrol-input" valid-type="type1"/>');

        this.addPropertyControl('Train Label', function ($parent) {
            $parent.append(_this.$trainLabel);
            _this.trainLabelControl = _this.createInput(_this.$trainLabel, {
                height: '23px'
            }, '')
        });

        this.$trainLabel.on('change', function () {
            _this.createUpdateParametersCommand('train_label', $(this).val());
            _this.setParameter('train_label', $(this).val());
        });
    };
    Parameters.prototype.createTestDataControl = function () {
        let _this = this;

        this.$testData = $('<input class="brtc-va-editors-sheet-controls-propertycontrol-input" valid-type="type1"/>');

        this.addPropertyControl('Test Data', function ($parent) {
            $parent.append(_this.$testData);
            _this.testDataControl = _this.createInput(_this.$testData, {
                height: '23px'
            }, '')
        });

        this.$testData.on('change', function () {
            _this.createUpdateParametersCommand('test_data', $(this).val());
            _this.setParameter('test_data', $(this).val());
        });
    };
    Parameters.prototype.createTestLabelControl = function () {
        let _this = this;

        this.$testLabel = $('<input class="brtc-va-editors-sheet-controls-propertycontrol-input" valid-type="type1"/>');

        this.addPropertyControl('Test Label', function ($parent) {
            $parent.append(_this.$testLabel);
            _this.testLabelControl = _this.createInput(_this.$testLabel, {
                height: '23px'
            }, '')
        });

        this.$testLabel.on('change', function () {
            _this.createUpdateParametersCommand('test_label', $(this).val());
            _this.setParameter('test_label', $(this).val());
        });
    };

    Parameters.prototype.createCheckPointGroupNameControl = function () {
        let _this = this;

        this.$checkPointGroupName = $('<input class="brtc-va-editors-sheet-controls-propertycontrol-input" valid-type="type1"/>');

        this.addPropertyControl('Checkpoint Group Name', function ($parent) {
            $parent.append(_this.$checkPointGroupName);
            _this.checkPointGroupName = _this.createInput(_this.$checkPointGroupName, {
                height: '23px',
                placeHolder: 'Default: checkpoint'
            }, '')
        });

        this.$checkPointGroupName.on('change', function () {

            if (_this.parameters.checkPointGroupName === $(this).val()) return;

            _this.createUpdateParametersCommand('checkPointGroupName', $(this).val());
            _this.setParameter('checkPointGroupName', $(this).val());
        });
    };

    Parameters.prototype.renderLossControl = function () {
        this.$loss.val(this.parameters.loss);
    };
    Parameters.prototype.renderMetricsControl = function () {
        this.$metrics.val(this.parameters.metrics);
    };
    Parameters.prototype.renderBatchSizeControl = function () {
        this.batchSizeControl.setValue(this.parameters.batch_size);
    };
    Parameters.prototype.renderEpochsControl = function () {
        this.epochsControl.setValue(this.parameters.epochs);
    };
    Parameters.prototype.renderStepsPerEpochControl = function () {
        this.stepsPerEpochsControl.setValue(this.parameters.steps_per_epoch);
    };
    Parameters.prototype.renderValidationStepsControl = function () {
        this.validationStepsControl.setValue(this.parameters.validation_steps);
    };

    Parameters.prototype.renderOptimizerControl = function () {
        this.$optimizer.val(this.parameters.optimizer);
    };
    Parameters.prototype.renderEvaluationControl = function () {
        let isChecked = this.$evaluationTrueControl.jqxRadioButton('checked');

        if (this.parameters.evaluation && !isChecked) {
            this.$evaluationTrueControl.jqxRadioButton('check');
        } else if (!this.parameters.evaluation && isChecked) {
            this.$evaluationFalseControl.jqxRadioButton('check');
        }
    };
    Parameters.prototype.renderExecutionControl = function () {
        let isChecked = this.$executionTrueControl.jqxRadioButton('checked');

        if (this.parameters.execution && !isChecked) {
            this.$executionTrueControl.jqxRadioButton('check');
        } else if (!this.parameters.execution && isChecked) {
            this.$executionFalseControl.jqxRadioButton('check');
        }
    };

    Parameters.prototype.renderTrainDataControl = function () {
        this.$trainData.val(this.parameters.train_data);
    };
    Parameters.prototype.renderTrainLabelControl = function () {
        this.$trainLabel.val(this.parameters.train_label);
    };
    Parameters.prototype.renderTestDataControl = function () {
        this.$testData.val(this.parameters.test_data);
    };
    Parameters.prototype.renderTestLabelControl = function () {
        this.$testLabel.val(this.parameters.test_label);
    };
    Parameters.prototype.renderCheckPointGroupNameControl = function () {
        this.$checkPointGroupName.val(this.parameters.checkPointGroupName);
    };

    Parameters.prototype.addPropertyControl = function (label, callback, option) {
        let _this = this,
            $propertyControl = $('' +
                '<div class="brtc-va-editors-sheet-controls-propertycontrol">' +
                '   <div class="brtc-va-editors-sheet-controls-propertycontrol-label"></div>' +
                '   <div class="brtc-va-editors-sheet-controls-propertycontrol-contents">' +
                '</div>');

        this.$mainControl.find('.brtc-va-views-parameters-wrapper').append($propertyControl);

        $propertyControl.jqxExpander(
            {
                theme: Brightics.VA.Env.Theme,
                arrowPosition: "left",
                initContent: function () {
                    if (typeof  callback === 'function') {
                        callback.call(_this, $propertyControl.find(".brtc-va-editors-sheet-controls-propertycontrol-contents"), option);
                    }
                }
            });
        $propertyControl.jqxExpander('setHeaderContent', label);

        return $propertyControl;
    };

    Parameters.prototype.wrapControl = function ($control) {
        let $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };

    Parameters.prototype.createDropDownList = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        let additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        let options = {
            theme: Brightics.VA.Env.Theme,
            enableBrowserBoundsDetection: true,
            animationType: 'none',
            width: '100%',
            height: '25px',
            openDelay: 0
        };
        if (jqxOptions) {
            if (jqxOptions.source && jqxOptions.source.length > 7) {
                options.autoDropDownHeight = false;
                options.dropDownHeight = 120
            } else {
                options.autoDropDownHeight = true;
            }
            $.extend(options, jqxOptions);
        }
        $control.jqxDropDownList(options);
        return $control;
    };

    Parameters.prototype.createNumericInput = function ($control, widgetOptions, className, additionalCss) {

        this.wrapControl($control);
        let additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        return new Brightics.VA.Core.Editors.Sheet.Controls.NumericInput($control, widgetOptions);
    };

    Parameters.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            let $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    Parameters.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            let $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    Parameters.prototype.createRadioButton = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        let additionalClass = 'brtc-va-editors-sheet-controls-radiobutton-default';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        let options = {
            theme: Brightics.VA.Env.Theme
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxRadioButton(options);
        return $control;
    };

    Parameters.prototype.createInput = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);

        let additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }

        if (!$control.attr('type'))$control.attr('type', 'text');
        if (!$control.attr('maxlength'))$control.attr('maxlength', '100');

        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        let options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            placeHolder: 'Enter value'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxInput(options);
        let preValue = $control.val();
        $control.focus(function () {
            preValue = $control.val();
        });
        $('svg').on('mousedown', function () {
            let value = $control.val();
            if (value !== preValue && $control.is(":focus")) {
                $control.trigger("change");
            }
        });

        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($control);
        return $control;
    };

    Parameters.prototype.setParameter = function (key, val) {
        this.parameters[key] = val;
    };

    Parameters.prototype.activate = function () {
        this.$mainControl.find('.brtc-va-views-parameters-wrapper').perfectScrollbar('update');
    };

    Brightics.VA.Core.Views.Parameters = Parameters;

}).call(this);