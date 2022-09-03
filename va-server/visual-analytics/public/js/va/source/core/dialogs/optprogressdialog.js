/**
 * Created by daewon77.park on 2016-08-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function OptProgressDialog(parentId, options) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        parentId = parentId || editor.$mainControl;
        options = options || {};
        options.title = 'Optimization Progress';
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    OptProgressDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    OptProgressDialog.prototype.constructor = OptProgressDialog;

    OptProgressDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 1000;
        this.dialogOptions.height = 600;
        this.dialogOptions.modal = false;
        this.dialogOptions.create = function () {
            $('.ui-widget-content').css('border-color', '#d4d4d4');
        }
    };

    OptProgressDialog.prototype.createDialogContentsArea = function ($parent) {
        var containerStyle = 'display: flex;';
        var $container =
            $('<div class="brtc-va-dialogs-opt-progress-container" style="' + containerStyle + '"></div>');
        $parent.append($container);

        this.createParameterArea($container);
        this.createObjectiveValueArea($container);

        if (this.options.data) {
            this.selectedIndex = 0;
            this.render(this.options.data);
        }
        $parent.perfectScrollbar();
    };

    OptProgressDialog.prototype.createParameterArea = function ($parent) {
        var areaStyle =
            'width: 50%;' +
            'height: 440px;' +
            'overflow: hidden;';
        var $parameterArea = $('<div style="' + areaStyle + '"></div>');
        $parent.append($parameterArea);

        this.createHistoryArea($parameterArea);
        this.createBestParamArea($parameterArea);
        this.createTabsArea($parameterArea);
    };

    OptProgressDialog.prototype.createHistoryArea = function ($parent) {
        this.$historyArea = $(
            '<div style="margin-bottom: 15px;">' +
            '   <div style="font-weight:bold;margin-bottom:3px;">History</div>' +
            '   <div class="brtc-opt-progress-dialog-history-grid"></div>' +
            '</div>');
        $parent.append(this.$historyArea);
    };

    OptProgressDialog.prototype.createBestParamArea = function ($parent) {
        this.$bestParamArea = $(
            '<div>' +
            '   <div style="font-weight:bold;margin-bottom:3px;">Best Parameter</div>' +
            '   <div class="brtc-opt-progress-dialog-best-param-grid"></div>' +
            '</div>');
        $parent.append(this.$bestParamArea);
    };

    OptProgressDialog.prototype.createTabsArea = function ($parent) {
        this.$tabsArea = $(
            '<div>' +
            '  <div class="brtc-opt-progress-dialog-tabs-wrapper" style="margin-top: 20px;">' +
            '  </div>' +
            '</div>');
        $parent.append(this.$tabsArea);
    }

    OptProgressDialog.prototype.createObjectiveValueArea = function ($parent) {
        var areaStyle =
            'width: 50%;' +
            'height: 440px;' +
            'overflow: hidden;';
        var $objectiveValueArea =
            $('<div style="' + areaStyle + '"></div>');
        $parent.append($objectiveValueArea);

        this.createObjectiveChartArea($objectiveValueArea);
    };

    OptProgressDialog.prototype.createObjectiveChartArea = function ($parent) {
        this.$chartArea = $(
            '<div>' +
            '   <div style="font-weight:bold;margin-bottom:3px;">Objective Value</div>' +
            '   <div class="brtc-opt-progress-dialog-chart-wrapper" style="width:470px;height:421px;"></div>' +
            '</div>');
        $parent.append(this.$chartArea);
    }

    OptProgressDialog.prototype.createDialogButtonBar = function ($parent) {
        this.$okButton = $(`
            <input type="button" class="brtc-va-dialogs-buttonbar-ok" 
            style="width:155px;" value="Apply Best Parameters" />`);
        $parent.append(this.$okButton);
        this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$okButton.click(this.handleOkClicked.bind(this));
    };

    OptProgressDialog.prototype.handleOkClicked = function () {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();
        var commandManager = activeModelEditor.getCommandManager();

        var commands = new Brightics.VA.Core.CompoundCommand(this,
            { label: 'Apply best parameters' }
        );
        this.optimizationData = this.optimizationData || {};
        var bestParameters = this.optimizationData.bestParameter || [];
        // [[
        //      {
        //         "fid": "fy8mqd5apd2uj5gu",
        //         "name": "regularization",
        //         "value": "0.5"
        //      }
        // ]]

        if (bestParameters.length) {
            for (var i = 0; i < bestParameters[0].length; i++) {
                var bestParameter = bestParameters[0][i];
                var fid = bestParameter.fid;
                var name = bestParameter.name;
                var value = bestParameter.value;

                var fnUnit = contents.getFnUnitById(fid);
                if (!fnUnit) continue;

                var commandOption = {
                    fnUnit: fnUnit,
                    ref: { param: {} }
                };
                commandOption.ref.param[name] = value;
                var command =
                    new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(
                        this, commandOption
                    );
                commands.add(command);
            }
            commandManager.execute(commands);
        }
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    OptProgressDialog.prototype.render = function (data) {
        var optimization = this.getOptimizationData(data);

        if (optimization) {
            this.optimizationData = optimization;
            this.optimizationFids = this.getOptimizationFids(optimization);
            if (this.$mainControl) {
                this.$mainControl.parent().show();
                this._render(optimization);
            }
        }
    };

    OptProgressDialog.prototype.getOptimizationData = function (originalData) {
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

    OptProgressDialog.prototype.getOptimizationFids = function (optimization) {
        var parameters = optimization.parameter;
        return _(parameters).flatten().map('fid').uniq().sortBy().value();
    };

    OptProgressDialog.prototype._render = function (optimization) {
        var parameter = optimization.parameter;
        var bestParameter = optimization.bestParameter;
        var objectiveValue = optimization.objective;

        this.renderHistory(parameter);
        this.renderBestParam(bestParameter);
        this.renderTabs(this.optimizationFids);
        this.renderObjectiveChart(objectiveValue);
    };

    OptProgressDialog.prototype.getFunctionLabel = function (fid) {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();
        var fnUnit = contents.getFnUnitById(fid);
        var functionLabel = (fnUnit) ? (fnUnit.display.label) : ("");
        return functionLabel;
    };

    OptProgressDialog.prototype.renderTabs = function (tabFids) {
        var _this = this;
        var $targetWrapper = this.$tabsArea.find('.brtc-opt-progress-dialog-tabs-wrapper');
        if ($targetWrapper.find('li').length) {
            var originArray = $targetWrapper.find('li').toArray().map((e) => e.getAttribute('fid'));
            if (_.isEqual(originArray, tabFids)) {
                return;
            }
        }

        $targetWrapper.empty();
        var $target = $('<div class="brtc-opt-progress-dialog-tabs"></div>');
        $targetWrapper.append($target);

        $target.append('<ul></ul>');
        _.forEach(tabFids, function (value, index) {
            var functionLabel = _this.getFunctionLabel(value);
            var $li = $('<li></li>');
            $li.attr({ fid: value, title: functionLabel });
            $li.text(functionLabel);

            $target.find('ul').append($li);
            $target.append('<div></div>');
        });

        if (tabFids.length <= this.selectedIndex) {
            this.selectedIndex = 0;
        }
        $target.jqxTabs({
            theme: 'office',
            selectedItem: this.selectedIndex,
            width: 450,
            position: 'bottom',
            scrollPosition: 'both'
        });
        $target.on('selected', function (event) {
            var selectedTab = event.args.item;
            _this.selectedIndex = selectedTab;
            _this.renderHistory(_this.optimizationData.parameter);
            _this.renderBestParam(_this.optimizationData.bestParameter);
        });
    };

    OptProgressDialog.prototype.renderHistory = function (parameter) {
        var $target = this.$historyArea.find('.brtc-opt-progress-dialog-history-grid');

        var source = this.convertParameter(parameter);
        var dataAdapter = new $.jqx.dataAdapter(source);
        var columns = this.getColumns(source.datafields);

        this.historyGrid = $target.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: 450,
            height: 270,
            source: dataAdapter,
            columns: columns,
            columnsresize: true
        });
    };

    OptProgressDialog.prototype.renderBestParam = function (bestParameter) {
        var $target = this.$bestParamArea.find('.brtc-opt-progress-dialog-best-param-grid');

        var source = this.convertParameter(bestParameter);
        var dataAdapter = new $.jqx.dataAdapter(source);
        var columns = this.getColumns(source.datafields, true);

        this.bestParameterGrid = $target.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: 450,
            autoheight: true,
            source: dataAdapter,
            columns: columns,
            columnsresize: true
        });
    };

    OptProgressDialog.prototype.renderObjectiveChart = function (objectiveValue) {
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

    OptProgressDialog.prototype.getChartOptions = function (objectiveValue) {
        var chartOptions = {
            "chart": {
                "border": "1px #000000 none",
                "background": "rgba(255, 255, 255,1)",
                "animationDuration": 1000,
                "type": "line"
            },
            "plotOptions": {
                "line": {
                    "marker": {
                        "symbolSize": 7,
                        "itemStyle": {
                            "normal": {
                                "opacity": 1
                            }
                        }
                    }
                }
            },
            "xAxis": [
                {
                    "selected": [
                        {
                            "value": "Index",
                            "name": "Index",
                            "type": "Integer"
                        }
                    ],
                    "title": {
                        "show": true,
                        "text": "",
                        "subtext": "",
                        "rotate": 0,
                        "textStyle": {
                            "color": "#000000",
                            "fontSize": 12,
                            "fontFamily": ""
                        },
                        "subtextStyle": {
                            "color": "#000000",
                            "fontSize": 12,
                            "fontFamily": ""
                        },
                        "left": "50%",
                        "bottom": "5px"
                    },
                    "axisTick": {
                        "show": true
                    },
                    "axisLabel": {
                        "show": true,
                        "rotate": 0,
                        "textStyle": {
                            "color": "#000000",
                            "fontSize": 12,
                            "fontFamily": ""
                        }
                    },
                    "zlevel": 1,
                    "axisType": null
                }
            ],
            "yAxis": [
                {
                    "selected": [
                        {
                            "value": "Objective",
                            "name": "Objective",
                            "type": "Double"
                        }
                    ],
                    "title": {
                        "show": false,
                        "text": "",
                        "subtext": "",
                        "rotate": -90,
                        "textStyle": {
                            "color": "#000000",
                            "fontSize": 12,
                            "fontFamily": ""
                        },
                        "subtextStyle": {
                            "color": "#000000",
                            "fontSize": 12,
                            "fontFamily": ""
                        },
                        "left": "8px",
                        "top": "50%"
                    },
                    "axisTick": {
                        "show": true
                    },
                    "axisLabel": {
                        "show": true,
                        "rotate": 0,
                        "textStyle": {
                            "color": "#000000",
                            "fontSize": 12,
                            "fontFamily": ""
                        }
                    },
                    "zlevel": 1,
                    "axisType": null
                }
            ]
        };

        chartOptions.source = {
            dataType: 'local',
            localData: [{
                dataType: 'rawdata',
                columns: [
                    { name: 'Index', 'type': 'number', internalType: 'Integer' },
                    { name: 'Objective', 'type': 'number', internalType: 'Double' }
                ],
                data: this.getConvertedObjectiveValue(objectiveValue)
            }]
        };

        chartOptions.toolbar = {
            type: 'custom', show: false
        };

        return chartOptions;
    };

    OptProgressDialog.prototype.getConvertedObjectiveValue = function (objectiveValue) {
        var data = [];
        for (var i = 0; i < objectiveValue.length; i++) {
            data.push([(Number(i) + 1), objectiveValue[i]]);
        }
        return data;
    };

    OptProgressDialog.prototype.convertParameter = function (parameter) {
        var targetFid = this.optimizationFids[this.selectedIndex];
        var datafieldsObj = {};
        var data = [];
        for (var i = 0; i < parameter.length; i++) {
            var fieldData = parameter[i];

            var dataObj = {};
            for (var j = 0; j < fieldData.length; j++) {
                if (fieldData[j].fid != targetFid) continue;
                var paramName = fieldData[j].name;
                var paramValue = fieldData[j].value;
                dataObj[paramName] = paramValue;
                if (!datafieldsObj[paramName] || datafieldsObj[paramName] === 'number') {
                    datafieldsObj[paramName] = ($.isNumeric(paramValue) == true) ? ('number') : ('string');
                }
            }
            data.push(dataObj);
        }

        var datafields = [];
        for (var param in datafieldsObj) {
            datafields.push({ name: param, type: datafieldsObj[param] });
        }

        return {
            localdata: data,
            datatype: "json",
            datafields: datafields
        };
    };

    OptProgressDialog.prototype.getColumns = function (datafields, empty) {
        var columns = (empty) ? ([]) : ([
            {
                text: '#', sortable: false, filterable: false, editable: false,
                groupable: false, draggable: false, resizable: false,
                datafield: '', columntype: 'number', width: 30,
                cellsrenderer: function (row, column, value) {
                    return "<div style='margin:4px;'>" + (value + 1) + "</div>";
                }
            }
        ]);

        for (var i in datafields) {
            columns.push({
                text: datafields[i].name,
                datafield: datafields[i].name
            });
        }
        return columns;
    };

    OptProgressDialog.prototype.hide = function () {
        this.$mainControl.parent().hide();
    };

    Brightics.VA.Core.Dialogs.OptProgressDialog = OptProgressDialog;

}).call(this);