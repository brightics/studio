/**
 * Created by daewon77.park on 2016-08-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function OptSelectObjectiveDialog(parentId, options) {
        var _this = this;
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        parentId = parentId || editor.$mainControl;
        options = options || {};
        options.title = 'Select Objective';

        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    OptSelectObjectiveDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    OptSelectObjectiveDialog.prototype.constructor = OptSelectObjectiveDialog;

    OptSelectObjectiveDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 607;
        this.dialogOptions.height = 800;
        this.dialogOptions.modal = true;
        this.dialogOptions.create = function () {
            $('.ui-widget-content').css('border-color', '#d4d4d4');
            //$('.ui-dialog-titlebar-close', $(this).parent()).hide();
        }
    };

    OptSelectObjectiveDialog.prototype.createDialogContentsArea = function ($parent) {
        var containerStyle = 'display: flex;';
        var $container =
            $(`<div class="brtc-va-dialogs-opt-select-objective-container" style="${containerStyle}"></div>`);
        $parent.append($container);

        this.createFunctionsArea($container);
        this.createObjectiveArea($container);

        $container.append(`
            <style>
                .brtc-va-dialogs-opt-select-objective-container div.jqx-expander-header {
                    font-family: Arial, helvetica, sans-serif;
                    font-size: 13px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    border: none;
                    border-bottom-color: white;
                    background: #fff;
                }

                .brtc-va-dialogs-opt-select-objective-container .jqx-expander-header-content-office {
                    margin-left: 19px !important;
                }

                .brtc-va-dialogs-opt-select-objective-container .jqx-expander-arrow {
                    margin-top: 6px !important;
                }

                .brtc-va-dialogs-opt-select-objective-container .jqx-expander-arrow-top-office {
                    background-image: url(/css/plugins/aui-package/images/office-icon-right.png);
                }

                .brtc-va-dialogs-opt-select-objective-container .jqx-expander-arrow-bottom-office {
                    background-image: url(/css/plugins/aui-package/images/office-icon-down.png);
                }

                .brtc-va-dialogs-opt-select-objective-container .jqx-expander-content {
                    border: none;
                    margin-bottom: 15px;
                }

                .brtc-opt-function-table-label:hover {
                    background-color: #f2f2f2;                    
                }

                .brtc-opt-function-table-label.selected {
                    background-color: #EFF1FD;
                    border-color: #626FDB;
                }

                .brtc-opt-function-table-label.selected:hover {
                    background-color: #EFF1FD;
                    border-color: #626FDB;
                }

                .brtc-opt-function-table-label {
                    user-select: text;
                    border: 1px solid white;
                    margin-right: 5px;
                    width: 265px;
                    font-size: 12px;
                    height: 35px;
                    line-height: 35px;
                    box-sizing: border-box;
                    padding: 0 10px 0 13px;
                    cursor: pointer;
                    margin-left: 27px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .brtc-va-select-opt-objective-mandatory {
                    line-height: 5px;
                    margin-top: 3px;
                    color: #ee7379;
                }
            </style>
        `);

        $parent.perfectScrollbar();
    };

    OptSelectObjectiveDialog.prototype.createFunctionsArea = function ($parent) {
        var _this = this;
        var areaStyle = `
            width: 330px;
            height: 640px;
            overflow: hidden;
            box-sizing: border-box;
            padding-right: 15px;
            position: relative;
        `;
        var $area = $(`<div class="brtc-opt-select-" style="${areaStyle}"></div>`);
        $parent.append($area);

        var functionRowStyle = `
            border-bottom: solid 1px #f2f2f2;
        `;

        var functionSelectControlStyle = `
            box-sizing: border-box;
            width: 270px;
            height: 32px;
            line-height: 32px;
            font-size: 12px;            
            font-family: Arial, Dotum, Tahoma, sans-serif;
            font-weight: bold;            
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 8px;
            margin-left: 0;
            display: flex;
        `;

        var functionSelectControlLabelStyle = `       
            width: 223px;   
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `;

        var tableLabelControlWrapperStyle = ``;

        var functions = this.options.functions;
        for (var i in functions) {
            (function (functions, i) {
                var $functionRow = $(`<div style="${functionRowStyle}"></div>`);
                $area.append($functionRow);

                var functionLabel = functions[i].display.label;
                var category = Brightics.VA.Core.Functions.Library[functions[i].func].category;
                category = category || 'io';
                var $functionSelectControl = $(`
                    <div class="brtc-va-jqx-expander-header-wrapper" style="margin-bottom: 0;">
                        <div class="brtc-va-fnunit-category-${category}" style="${functionSelectControlStyle}">
                            <div class="brtc-style-views-palette-fnunit-icon" style="margin-top: 5px;"></div>
                            <div class="brtc-opt-function-label" style="${functionSelectControlLabelStyle}"></div>
                        </div>
                    </div>
                `);
                $functionSelectControl.find('.brtc-opt-function-label').text(functionLabel);
                $functionSelectControl.attr('title', functionLabel);
                $functionRow.append($functionSelectControl);

                var $tableLabelControlWrapper = $(`<div style="${tableLabelControlWrapperStyle}"></div>`);
                $functionRow.append($tableLabelControlWrapper);

                var outData = functions[i]['outData'];
                for (var j in outData) {
                    (function (outData, j) {
                        var tableLabel = functionLabel + '-' + (Number(j) + 1);
                        var tableId = outData[j];
                        var $tableLabelControl = $(`
                            <div class="brtc-opt-function-table-label">
                                <i class="fa fa-table" aria-hidden="true"></i>
                                <span style="margin-left: 5px;"></span>
                            </div>
                        `);
                        if (_this.options.objective.tableName === tableId) {
                            $tableLabelControl.addClass('selected');
                        }
                        $tableLabelControl.find('span').text(tableLabel);
                        $tableLabelControl.attr('title', tableLabel);
                        $tableLabelControlWrapper.append($tableLabelControl);
                        $tableLabelControl.click(function () {
                            $area.find('.brtc-opt-function-table-label').removeClass('selected');
                            $(this).addClass('selected');
                            _this.options.objective.fid = functions[i].fid;
                            _this.options.objective.tableName = tableId;

                            _this.$functionLabelControl.text(functionLabel);
                            _this.$functionLabelControl.attr('title', functionLabel);
                            _this.$tableLabelControl.text(tableLabel);
                            _this.$tableLabelControl.attr('title', tableLabel);
                        });
                    })(outData, j);
                }

                $functionRow.jqxExpander({
                    theme: Brightics.VA.Env.Theme,
                    arrowPosition: 'left',
                    expanded: true
                });
            })(functions, i);
        }
        $area.perfectScrollbar();
    };

    OptSelectObjectiveDialog.prototype.createObjectiveArea = function ($parent) {
        var areaStyle = `
            width: 217px;
            height: 440px; 
            overflow: hidden;
        `;
        var $area = $(`<div style="${areaStyle}"></div>`);
        $parent.append($area);

        var controlsContainerStyle = `
            padding: 8px 10px 10px 10px;
            background-color: #f2f2f2;
        `;
        var $controlsContainer = $(`<div style="${controlsContainerStyle}"></div>`);
        $area.append($controlsContainer);

        this.createFunctionLabelControl($controlsContainer);
        this.createTableLabelControl($controlsContainer);
        this.createRowControl($controlsContainer);
        this.createColumnControl($controlsContainer);
        this.createSenseControl($controlsContainer);

        $area.append(`
            <style>
                .brtc-opt-model-sense-radio .jqx-radiobutton-default-office {
                    background-color: #ffffff;
                    border-radius: 100% !important;  
                }
            </style>
        `);
    };

    OptSelectObjectiveDialog.prototype.createFunctionLabelControl = function ($parent) {
        var _this = this;
        $parent.append(`
            <div style="margin: 0 0 4px 0;">
                Function
                <span class="brtc-va-select-opt-objective-mandatory">*</span>
            </div>`);

        var style = `
            width: 197px;
            height: 26px;
            font-family: Arial, helvetica, sans-serif;
            border: 1px solid #d4d4d4;
            line-height: 24px;
            padding-left: 10px;
            padding-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            color: rgba(0, 0, 0, .8);
            cursor: default;
            background-color: #fff;
            opacity: .55;
        `;

        this.$functionLabelControl = $(`<div style="${style}"></div>`);

        var fid = this.options.objective.fid;
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();
        var fnUnit = contents.getFnUnitById(fid);

        if (fnUnit) {
            var functionLabel = fnUnit.display.label;
            this.$functionLabelControl.text(functionLabel);
            this.$functionLabelControl.attr('title', functionLabel);
        } else {
            this.options.objective.fid = "";
            this.$functionLabelControl.text('Select objective');
        }
        $parent.append(this.$functionLabelControl);
    };

    OptSelectObjectiveDialog.prototype.createTableLabelControl = function ($parent) {
        var _this = this;
        $parent.append(`
            <div style="margin: 10px 0 4px 0;">
                Table Name
                <span class="brtc-va-select-opt-objective-mandatory">*</span>
            </div>`);

        var style = `
            width: 197px;
            height: 26px;
            font-family: Arial, helvetica, sans-serif;
            border: 1px solid #d4d4d4;
            line-height: 24px;
            padding-left: 10px;
            padding-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            color: rgba(0, 0, 0, .8);
            cursor: default;
            background-color: #fff;
            opacity: .55;
        `;
        this.$tableLabelControl = $(`<div style="${style}"></div>`);

        var fid = this.options.objective.fid;
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();
        var fnUnit = contents.getFnUnitById(fid);

        if (fnUnit) {
            var functionLabel = fnUnit.display.label;
            var tableId = this.options.objective.tableName;

            var outData = fnUnit['outData'];
            var tableLabel;
            for (var i in outData) {
                if (outData[i] === tableId) {
                    tableLabel = functionLabel + '-' + (Number(i) + 1);
                    break;
                }
            }
            this.$tableLabelControl.text(tableLabel);
            this.$tableLabelControl.attr('title', tableLabel);
        } else {
            this.options.objective.tableName = "";
            this.$tableLabelControl.text('Select objective');
        }
        $parent.append(this.$tableLabelControl);
    };

    OptSelectObjectiveDialog.prototype.createRowControl = function ($parent) {
        var _this = this;
        $parent.append(`
            <div style="margin: 10px 0 4px 0;">
                Row Number
                <span class="brtc-va-select-opt-objective-mandatory">*</span>
            </div>`);
        this.$rowControlWrapper = $('<div></div>');
        $parent.append(this.$rowControlWrapper);

        var widgetOptions = {
            numberType: 'int',
            min: 1,
            max: 9999,
            minus: false,
            placeholder: 'Enter row number'
        };

        this.$rowControl =
            new Brightics.VA.Core.Editors.Sheet.Controls.NumericInput(
                this.$rowControlWrapper, widgetOptions);
        var rowValue = this.options.objective.row;
        this.$rowControl.setValue(rowValue);

        this.$rowControl.onChange(function (value) {
            _this.options.objective.row = value;
        });
    };

    OptSelectObjectiveDialog.prototype.createColumnControl = function ($parent) {
        var _this = this;
        $parent.append(`
            <div style="margin: 10px 0 4px 0;">
                Column Name
                <span class="brtc-va-select-opt-objective-mandatory">*</span>
            </div>`);
        this.$columnControl = $('<input type="text"/>');
        $parent.append(this.$columnControl);
        this.$columnControl.jqxInput({
            placeHolder: 'Enter column name',
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 25
        });
        this.$columnControl.val(this.options.objective.column);

        this.$columnControl.on('change', function (event) {
            var value = $(this).val();
            _this.options.objective.column = value;
        });
    };

    OptSelectObjectiveDialog.prototype.createSenseControl = function ($parent) {
        var _this = this;
        $parent.append(`
            <div style="margin: 10px 0 4px 0;">
                Sense
                <span class="brtc-va-select-opt-objective-mandatory">*</span>
            </div>`);
        this.$senseMax = $(`<div class="brtc-opt-model-sense-radio" style="margin-top: 10px;">Maximize</div>`);
        this.$senseMin = $(`<div class="brtc-opt-model-sense-radio" style="margin-top: 10px;">Minimize</div>`);

        $parent.append(this.$senseMax);
        $parent.append(this.$senseMin);

        var maxFlag = (this.options.objective.sense.toLowerCase() === 'maximize');
        this.$senseMax.jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            checked: maxFlag
        });

        this.$senseMin.jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            checked: !maxFlag
        });

        this.$senseMax.on('change', function (event) {
            var checked = event.args.checked;
            if (checked) {
                _this.options.objective.sense = 'maximize';
            }
        });

        this.$senseMin.on('change', function (event) {
            var checked = event.args.checked;
            if (checked) {
                _this.options.objective.sense = 'minimize';
            }
        });
    };

    OptSelectObjectiveDialog.prototype.createDialogButtonBar = function ($parent) {
        // do no create buttons

        this.$okButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />');
        $parent.append(this.$okButton);
        this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$okButton.click(this.handleOkClicked.bind(this));

        this.$cancelButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />');
        $parent.append(this.$cancelButton);
        this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$cancelButton.click(this.handleCancelClicked.bind(this));
    };

    OptSelectObjectiveDialog.prototype.handleOkClicked = function () {
        if (typeof this.$mainControl === 'undefined') return;

        if (this.options.objective) {
            if (!(this.options.objective.fid
                && this.options.objective.tableName)) {
                return Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(
                    "Please select objective."
                );
            }

            if (!this.options.objective.row) {
                return Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(
                    "Please enter row number."
                );
            }

            if (!this.options.objective.column) {
                return Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(
                    "Please enter column name."
                );
            }
        }

        this.dialogResult.OK = true;
        this.dialogResult.Cancel = false;
        this.dialogResult.objective = $.extend(true, {}, this.options.objective);

        this.$mainControl.dialog('close');
    };

    OptSelectObjectiveDialog.prototype.render = function (data) {
        var optimization = this.getOptimizationData(data);

        if (optimization) {
            this.$mainControl.parent().show();
            this._render(optimization);
        }
    };

    OptSelectObjectiveDialog.prototype.getOptimizationData = function (originalData) {
        var processes = originalData.processes;
        if (!processes) return null;
        for (var i = processes.length - 1; i >= 0; i--) {
            var functions = processes[i].functions;
            for (var j = functions.length - 1; j >= 0; j--) {
                var optimization = functions[j].optimization;
                if (optimization) {
                    return optimization;
                }
            }
        }
        return null;
    };

    OptSelectObjectiveDialog.prototype._render = function (optimization) {
        var parameter = optimization.parameter;
        var bestParameter = optimization.bestParameter;
        var objectiveValue = optimization.objective;

        this.renderHistory(parameter);
        this.renderBestParam(bestParameter);
        this.renderObjectiveChart(objectiveValue);
    };

    OptSelectObjectiveDialog.prototype.renderHistory = function (parameter) {
        var $target = this.$historyArea.find('.brtc-opt-progress-dialog-history-grid');

        var source = this.convertParamter(parameter);
        var dataAdapter = new $.jqx.dataAdapter(source);
        var columns = this.getColumns(source.datafields);

        this.historyGrid = $target.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: 450,
            height: 322,
            source: dataAdapter,
            columns: columns,
            columnsresize: true
        });
    };

    OptSelectObjectiveDialog.prototype.renderBestParam = function (bestParameter) {
        var $target = this.$bestParamArea.find('.brtc-opt-progress-dialog-best-param-grid');

        var source = this.convertParamter(bestParameter);
        var dataAdapter = new $.jqx.dataAdapter(source);
        var columns = this.getColumns(source.datafields);

        this.bestParameterGrid = $target.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: 450,
            autoheight: true,
            source: dataAdapter,
            columns: columns,
            columnsresize: true
        });
    };

    OptSelectObjectiveDialog.prototype.renderObjectiveChart = function (objectiveValue) {
        var $target = this.$chartArea.find('.brtc-opt-progress-dialog-chart-wrapper');

        if (!this.objectiveValue) {
            this.objectiveValue = objectiveValue;
        }

        var chartOptions = this.getChartOptions(objectiveValue);
        if (!this.chart) {
            $target.empty();
            this.chart = new Brightics.Chart.BCharts($target, chartOptions);
        } else {
            var refresh = false;
            if (this.objectiveValue.length != objectiveValue.length) {
                this.objectiveValue = objectiveValue;
                refresh = true;
            }

            if (refresh) {
                this.chart.setOptions(chartOptions);
            }
        }
    };

    Brightics.VA.Core.Dialogs.OptSelectObjectiveDialog = OptSelectObjectiveDialog;

}).call(this);