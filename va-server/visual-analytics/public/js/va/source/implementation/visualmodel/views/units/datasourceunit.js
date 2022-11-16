/**
 * Source: datasource.js
 * Created by daewon.park on 2017-04-28.
 */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var useSpark = root.useSpark === 'false' ? false : true;

    /**
     options =
     {
        id: 'asdf',
        name: 'Data Source #1', //데이터 소스 Title,
        updateTime: '2017-03-30T01:33:50.304Z',
        chartTab: {
            show: true
        },
        drawer: {
            show: true, //false
            menu: {
                edit: {
                    show: true,
                    title: 'Edit',
                    click: function (event, index, options) {

                    }
                },
                connect: {
                    show: true,
                    title: 'Connect Schedule',
                    click: function (event, index, options) {

                    }
                },
                delete: {
                    show: true,
                    title: 'Delete',
                    click: function (event, index, options) {

                    }
                }
            }
        },
        charts: [],
        columns: [{
            name: 'sepal_length',
            type: 'number',
            internalType: 'Double'
        }, {
            name: 'sepal_width',
            type: 'number',
            internalType: 'Double'
        }, {
            name: 'petal_length',
            type: 'number',
            internalType: 'Double'
        }, {
            name: 'petal_width',
            type: 'number',
            internalType: 'Double'
        }, {
            name: 'species',
            type: 'string',
            internalType: 'String'
        }]
     }
     **/
    function DataSourceUnit(parentId, options) {
        this.dataSource = options.dataSource;
        Brightics.Chart.Adonis.Component.DataSource.call(this, parentId, this._buildDataSource(options.dataSource));
    }

    DataSourceUnit.prototype = Object.create(Brightics.Chart.Adonis.Component.DataSource.prototype);
    DataSourceUnit.prototype.constructor = DataSourceUnit;

    DataSourceUnit.prototype._buildDataSource = function (dataSource) {
        var _this = this;
        var data = {
            id: dataSource.fid,
            name: dataSource.display.label,
            param: dataSource.param,
            charts: $.extend(true, [], dataSource.display.charts),
            columns: $.extend(true, [], dataSource.display.columns || [])
        };

        data.chartTab = {
            show: true
        };

        data.columnDraggable = true;

        data.drawer = {
            show: true,
            menu: {
                edit: {
                    show: true,
                    title: Brightics.locale.common.edit,
                    click: function (event, index, options) {
                        _this.openEditDataSourceAliasDialog(options.id, options.name);
                    }
                },
                connect: {
                    show: (_this.dataSource.name === 'Empty'),
                    title: 'Connect Schedule',
                    click: function (event, index, options) {
                        _this.openSetScheduleDialog(options.id, options.name, options.param);
                    }
                },
                delete: {
                    show: true,
                    title: Brightics.locale.common.delete,
                    click: function (event, index, options) {
                        _this.openDeleteDialog(options.id, options.name);
                    }
                }
            }
        };

        return data;
    };

    DataSourceUnit.prototype._createDrawerMenu = function ($parent) {
        var $ul = $('<ul></ul>');
        for (var key in this.options.drawer.menu) {
            if (this.options.drawer.menu[key].show) {
                var $li = $('<li></li>');
                $li.attr('action', key);
                $li.text(this.options.drawer.menu[key].title);
                $ul.append($li);
            }
        }

        this.$drawerMenu = $('<div class="bcharts-ds-panel-drawer-menu"></div>').append($ul);
        $parent.append(this.$drawerMenu);
        this.$drawerMenu.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            autoOpenPopup: false,
            mode: 'popup',
            width: 140,
            animationHideDuration: 0,
            animationShowDuration: 0
        });
        this._bindItemClickEventToDrawer(); // define in DataSource.prototype (bcharts)
        this._bindCloseHandler();
    };

    DataSourceUnit.prototype._bindCloseHandler = function ($parent) {
        var _this = this;
        this.drawerMenuCloseHandler = function () {
            _this.$drawerMenu.jqxMenu('close');
        };
        this.$drawerMenu.on('closed', function () {
            _this.$mainControl.parents('.bcharts-ds-panel').off('scroll', _this.drawerMenuCloseHandler);
            $(window).off('resize', _this.drawerMenuCloseHandler);
        });
        this.$headerControl.find('.bcharts-ds-drawer').click(function () {
            _this.$mainControl.parents('.bcharts-ds-panel').on('scroll', _this.drawerMenuCloseHandler);
            $(window).on('resize', _this.drawerMenuCloseHandler);
        });
    };

    DataSourceUnit.prototype.render = function () {
        this.fillName();
        this.fillContents();
        this.renderScheduleIcon();
    };

    // DataSource 상속 받는 Class의 경우 여기서 Tab 갯수와 기능 등등을 override 할 수 있다.
    DataSourceUnit.prototype._createTabs = function ($parent) {
        this._createChartTab($parent);
        this._createColumnsTab($parent);
    };

    DataSourceUnit.prototype._bindDraggableEventToDataSourceHeader = function () {
        // do nothing
    };

    DataSourceUnit.prototype._createChartTab = function ($parent) {
        if (!(this.options.chartTab && this.options.chartTab.show)) return;

        var $chartTab = $('' +
            '<li>' +
            '   <div class="bcharts-ds-contents-tab-chart">Chart</div>' +
            '   <div class="bcharts-ds-contents-charts-count">0</div>' +
            '</li>');

        $parent.find('.bcharts-ds-contents-tabs').append($chartTab);
        $parent.append($('<div style="min-height: 100px"></div>'));
    };

    /**
     * Chart Tab에 표시되는 숫자 변경
     */
    DataSourceUnit.prototype._updateChartCount = function () {
        this.$contentsControl.find('.bcharts-ds-contents-charts-count').text(this.options.charts.length);
        this.$contentsControl.find('.bcharts-ds-charts').perfectScrollbar('update');
        this.$mainControl.parents('.bcharts-ds-panel').perfectScrollbar('update');
    };

    DataSourceUnit.prototype.fillChartTab = function () {
        if (!(this.options.chartTab && this.options.chartTab.show)) return;

        var $container = $('' +
            '<div>' +
            '   <div class="bcharts-ds-charts-container">' +
            '       <div class="bcharts-ds-charts"></div>' +
            '   </div>' +
            '</div>');
        this.$contentsControl.jqxTabs('setContentAt', 0, $container.html());

        $container = this.$contentsControl.find('.bcharts-ds-charts-container');
        for (var i in this.options.charts) {
            this._createChart($container.find('.bcharts-ds-charts'), this.options.charts[i]);
            //new Brightics.Chart.BCharts($chart.find('.bcharts-ds-chart-area'), charts[i]);
        }

        this.$contentsControl.find('.bcharts-ds-charts').perfectScrollbar();
        this._updateChartCount();
    };

    DataSourceUnit.prototype._createChart = function ($parent, chartOption, chartIndex) {
        var chartType = chartOption.chart.type;
        var chartTypeLabel = Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(Brightics.Chart.Registry[chartType].Label);
        var chartTag = (chartOption.tag) ? (chartOption.tag) : '';
        var $chart = $('' +
            '<div class="bcharts-ds-chart-wrapper">' +
            '   <div title="' + chartTypeLabel + '" class="bcharts-ds-chart-events-helper bcharts-ds-draggable">' +  // bcharts-ds-chart-area에는 pointer-events:none이 적용되어 있어서 직접적으로 cursor: pointer를 줄 수 없다.
            '       <div class="bcharts-ds-chart-area">' +
            '           <div class="bcharts-ds-chart-area-label">' +
            '               <div class="bcharts-ds-chart-icon" type="' + chartType + '"></div>' +
            '               <div class="bcharts-ds-chart-type-label">' + chartTypeLabel + '</div>' +
            '           </div>' +
            '           <div class="bcharts-ds-chart-area-tag">' +
            '               <div class="bcharts-ds-chart-tag-label">' + chartTag + '</div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="bcharts-ds-chart-button-area"></div>' +
            '</div>');

        // this._bindChartDraggableEvent($chart.find('.bcharts-ds-chart-events-helper'));
        this._bindChartSelectionEvent($chart.find('.bcharts-ds-chart-events-helper'));
        this._createChartControlButtons($chart.find('.bcharts-ds-chart-button-area'));

        // chartIndex === 0 인 경우 else로 이동해버림. 그래서 chartIndex !== undefined로 체크
        var chartCount = $parent.find('.bcharts-ds-chart-wrapper').length;
        if ((chartIndex !== undefined) && (chartCount > 0) && (chartCount > chartIndex))
            $parent.find('.bcharts-ds-chart-wrapper').eq(chartIndex).before($chart);
        else
            $parent.append($chart);
    };

    DataSourceUnit.prototype._addChartOption = function (chart, chartIndex) {
        this.options.charts.splice(chartIndex, 0, chart);
    };

    DataSourceUnit.prototype._removeChartOption = function (chartIndex) {
        this.options.charts.splice(chartIndex, 1);
    };

    DataSourceUnit.prototype.addChart = function (chart, chartIndex) {
        this._addChartOption(chart, chartIndex);

        this._createChart(this.$contentsControl.find('.bcharts-ds-charts'), chart, chartIndex);
        this._updateChartCount(this.options.charts.length);
    };

    DataSourceUnit.prototype.removeChart = function (chartIndex) {
        this._removeChartOption(chartIndex);
        this._updateChartCount();

        // 화면에서 Chart 제거
        var $charts = this.$contentsControl.find('.bcharts-ds-charts');
        $charts.find('.bcharts-ds-chart-wrapper').eq(chartIndex).remove();
    };

    /**
     * 여기에서 chart control 버튼을 추가할 수 있음.
     * @param $parent
     * @private
     */
    DataSourceUnit.prototype._createChartControlButtons = function ($parent) {
        this._createChartRemoveButton($parent);
        //this._createChartDragButton($parent);
        //this._createChartChangeButton($parent);
    };

    DataSourceUnit.prototype._createChartRemoveButton = function ($parent) {
        var _this = this;
        var $removeButton = $('<div title="Remove Chart" class="bcharts-ds-chart-button-remove"></div>');
        $parent.append($removeButton);

        $removeButton.click(function (event) {
            _this._handleChartRemoveButtonClick(event);
        });
    };

    DataSourceUnit.prototype._handleChartRemoveButtonClick = function (event) {
        var _this = this;
        var $target = $(event.target).parents('.bcharts-ds-chart-wrapper');
        var chartIndex = $target.prevAll('.bcharts-ds-chart-wrapper').length;

        var message = 'Are you sure you want to delete this Chart?';
        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, function (dialogResult) {
            if (dialogResult.OK) {
                // Execute Command
                var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveDataSourceChartsCommand(_this, {
                    dataSourceId: _this.options.id,
                    chartIndex: chartIndex
                });
                _this.executeCommand(command);
            }
        });
    };

    DataSourceUnit.prototype._bindChartSelectionEvent = function ($target) {
        var _this = this;
        $target.click(function (event) {
            var selectedPage = _this.getActiveEditor().getDiagramEditorPage().getSelectedPage();
            if (!selectedPage) return;

            var chartIndex = $(this).parents('.bcharts-ds-chart-wrapper').prevAll('.bcharts-ds-chart-wrapper').length;
            var chartType = _this.options.charts[chartIndex].chart.type;

            var command = selectedPage.createNewChartContentCommand(chartType, {
                dataSourceId: _this.dataSource.fid,
                chartOption: $.extend(true, {}, _this.options.charts[chartIndex])
            });
            _this.executeCommand(command);
        });
    };

    DataSourceUnit.prototype._bindChartDraggableEvent = function ($target) {
        var _this = this;
        $target.draggable({
            appendTo: 'body',
            helper: function (event) {
                var $helper = $(this).clone();
                var width = $(this).width();
                var height = $(this).height();
                $helper.css({
                    'z-index': 5100,
                    'width': width,
                    'height': height,
                    'overflow': 'hidden',
                    'white-space': 'nowrap',
                    'text-overflow': 'ellipsis'
                });

                var $orgCanvas = $(this).find('canvas');   // canvas data는 clone으로 복사가 안된다.
                var $copiedCanvas = $helper.find('canvas'); // 아래 로직처럼 getContext한 후 drawImage로 복사해야 함.
                if ($orgCanvas.length) {
                    for (var k = 0; k < $orgCanvas.length; k++) {
                        var ctx = $copiedCanvas[k].getContext('2d');
                        ctx.drawImage($orgCanvas[k], 0, 0, $orgCanvas[k].width, $orgCanvas[k].height);
                    }
                }

                $helper.attr('drag-type', 'chartTemplate');
                var chartIndex = $(this).parents('.bcharts-ds-chart-wrapper').prevAll('.bcharts-ds-chart-wrapper').length;
                var helperData = $.extend(true, {}, _this.options);
                // if (helperData.charts && helperData.charts.length) {
                //     helperData.charts = [helperData.charts[chartIndex]];
                // } else {
                //     helperData.charts = [];
                // }
                $helper.data('datasource', helperData);
                $helper.data('chartTemplate', helperData.charts[chartIndex]);
                return $helper;
            }
        });
    };

    DataSourceUnit.prototype._createUtilToolsArea = function () {
        var $container = this.$contentsControl.find('.bcharts-ds-columns-container');
        var $utilToolsArea = $('<div class="bcharts-ds-columns-util-tools-area"></div>');
        $container.prepend($utilToolsArea);

        this._createRefreshArea($utilToolsArea);
        this._createFilterControl($utilToolsArea);
    };

    DataSourceUnit.prototype._createRefreshArea = function ($parent) {
        var _this = this;

        var updateTime = this.options.updateTime;
        var timeFormat = this._convertTimeFormat(updateTime);
        var $refreshArea = $('' +
            '<div class="bcharts-ds-refresh-area">' +
            '   <div class="bcharts-ds-refresh-button-area">' +
            '       <div class="bcharts-ds-refresh-button"></div>' +
            '   </div>' +
            '   <div class="bcharts-ds-update-time-area">' +
            '       <div class="bcharts-ds-update-time-label">Last updated at </div>' +
            '       <div class="bcharts-ds-update-time-data">' + timeFormat + '</div>' +
            '   </div>' +
            '</div>');
        $parent.append($refreshArea);
        var $refreshButton = $refreshArea.find('.bcharts-ds-refresh-button');

        $refreshButton.click(function (event) {
            _this._handleRefreshButtonClick(event);
        });
    };

    DataSourceUnit.prototype._handleRefreshButtonClick = function (event) {
        var _this = this;
        var runnableDataSource = this._buildRunnableDataSource(this.dataSource);
        var listener = {
            'success': function (res) {
                _this.renderColumns();
            }
        };

        //ModelLauncherManager에서 fnUnit에 getModel을 해서 가져오기 때문에 
        //mid가 리포트의 mid로 넘어가는 현상이 있음
        //기존에 옵션으로 mid를 전달 받기 때문에 option으로 넘겨줌
        var dfModelId = this.dataSource.param.modelId;

        Studio.getJobExecutor().launchUnit(runnableDataSource, {}, {mid: dfModelId}, listener);
    };

    DataSourceUnit.prototype._getTableIdFromDataSource = function (dataSource) {
        if (dataSource.param.tableId) {
            return dataSource.param.tableId;
        }
        if (dataSource.param.functions) {
            return dataSource.param.functions[0][OUT_DATA][0];
        }
        if (dataSource[OUT_DATA]) {
            return dataSource[OUT_DATA][0];
        }
        if (dataSource.outputs) {
            return dataSource.outputs.table;
        }
    };

    DataSourceUnit.prototype.renderColumns = function (callBack) {
        var _this = this;
        var activeEditor = this.getActiveEditor();
        var model = activeEditor.options.editorInput.getContents();
        var mid = (_this.dataSource.name === 'Empty') ? (_this.dataSource.param.modelId) : (model.mid);
        var tableId = this._getTableIdFromDataSource(_this.dataSource);

        Brightics.VA.Core.DataQueryTemplate.getSchemaAsync(mid, tableId, function (_columns) {
            var columns = $.extend(true, [], _columns);
            _this.dataSource.display.columns = columns;

            _this.setOptions({columns: columns});
            _this.fillColumnsTab(columns);
            // update time 변경
            _this.$contentsControl.find('.bcharts-ds-update-time .bcharts-ds-update-time-data').text(_this._convertTimeFormat());

            if (callBack && typeof callBack == 'function') callBack();
        }, function () {
            var columns = [];
            _this.dataSource.display.columns = columns;
            _this.setOptions({columns: columns});
            _this.fillColumnsTab(columns);

            // update time 변경
            _this.$contentsControl.find('.bcharts-ds-update-time .bcharts-ds-update-time-data').text(_this._convertTimeFormat());
            if (callBack && typeof callBack == 'function') callBack();
        });
    };

    DataSourceUnit.prototype._buildRunnableDataSource = function (dataSource) {
        var runnableDataSource;
        if (dataSource.name === 'Empty') {
            if (!useSpark) {
                runnableDataSource = {
                    "func": "queryExecutorPython",
                    "name": "brightics.function.transform$sql_execute",
                    "context": "python",
                    "version": "3.6",
                    'inputs': {
                        "tables": [dataSource.param.tableId]
                    },
                    "outputs": {
                        "out_table": dataSource.param.tableId
                    },
                    "meta": {
                        "tables": {
                            "type": "table", 'range': {'min': 1, 'max': 10}
                        },
                        "out_table": {
                            "type": "table"
                        }
                    },
                    "param": {
                        "query": "SELECT * FROM  #{DF(0)}"
                    },
                    "fid": dataSource.fid,
                    "persist-mode": 'false',
                    "persist": false,
                    "display": {
                        "label": dataSource.display.label
                    }
                };
            } else {
                runnableDataSource = {
                    "func": "queryExecutor",
                    "name": "SQLExecutor",
                    'inData': [
                        dataSource.param.tableId
                    ],
                    'outData': [
                        dataSource.param.tableId
                    ],
                    "param": {
                        "mode": "full",
                        "full-query": "SELECT * FROM  #{DF(0)}",
                        "alias-names": [
                            "#{DF(0)}"
                        ]
                    },
                    "fid": dataSource.fid,
                    "persist-mode": 'false',
                    "persist": false,
                    "display": {
                        "label": dataSource.display.label
                    }
                };
            }
            runnableDataSource.parent = function () {
                return dataSource.parent();
            };
        } else {
            runnableDataSource = dataSource;
        }


        return runnableDataSource
    };

    DataSourceUnit.prototype._convertTimeFormat = function (updateTime) {
        var time = (updateTime) ? (new Date(updateTime)) : (new Date());
        var year = time.getFullYear() % 100,
            month = time.getMonth() + 1,
            dt = time.getDate(),
            hours = time.getHours(),
            minutes = time.getMinutes(),
            seconds = time.getSeconds();
        if (month < 10) month = '0' + month;
        if (dt < 10) dt = '0' + dt;
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;

        return year + '/' + month + '/' + dt + ' ' + hours + ':' + minutes + ':' + seconds;
    };

    DataSourceUnit.prototype.fillContents = function () {
        this.fillChartTab();
        this.fillColumnsTab(this.options.columns);
    };

    DataSourceUnit.prototype.getActiveEditor = function () {
        return Studio.getEditorContainer().getActiveModelEditor();
    };

    DataSourceUnit.prototype.executeCommand = function (command) {
        var activeEditor = this.getActiveEditor(),
            commandManager = activeEditor.getCommandManager();
        commandManager.execute(command);
    };

    DataSourceUnit.prototype.openEditDataSourceAliasDialog = function (dataSourceId, name) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.EditDataSourceAliasDialog(this.$mainControl, {
            name: name,
            title: Brightics.locale.common.datasourceEdit,
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    var newName = dialogResult.newName;
                    var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RenameDataSourceCommand(this, {
                        dataSourceId: dataSourceId,
                        label: newName
                    });
                    _this.executeCommand(command);
                }
            }
        });
    };

    DataSourceUnit.prototype.openSetScheduleDialog = function (dataSourceId, name, param) {
        var _this = this;
        new Brightics.VA.Implementation.Visual.Dialogs.DataSourceScheduleDialog(this.$mainControl, {
            dataSourceId: dataSourceId,
            name: name,
            param: param,
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    if (dialogResult.scheduleId !== undefined) {
                        var compoundCommand = new Brightics.VA.Core.CompoundCommand(this);

                        var scheduleCommand = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.ChangeScheduleCommand(_this, {
                            dataSourceId: dataSourceId,
                            scheduleId: dialogResult.scheduleId
                        });

                        var funcCommand = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.ChangeFuncCommand(_this, {
                            dataSourceId: dataSourceId,
                            // func: (dialogResult.scheduleId)? 'loadFromSchedule' : 'loadFromStaging'
                            func: 'loadFromStaging'
                        });

                        compoundCommand.add(scheduleCommand);
                        compoundCommand.add(funcCommand);

                        _this.executeCommand(compoundCommand);
                    }
                }
            },
            title: 'Connect Schedule'
        });
    };

    DataSourceUnit.prototype.openDeleteDialog = function (dataSourceId, name) {
        var _this = this;
        var message = 'Are you sure you want to delete "' + name + '"?';
        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, function (dialogResult) {
            if (dialogResult.OK) {
                var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveDataSourceCommand(_this, {
                    dataSourceId: dataSourceId
                });
                _this.executeCommand(command);
            }
        });
    };

    DataSourceUnit.prototype.renderScheduleIcon = function () {
        var _this = this;
        if (_this.dataSource.name === 'Empty') {
            _this.$mainControl.find('.bcharts-ds-header .bcharts-ds-icon').css('visibility', (_this.dataSource.param.scheduleId) ? ('visible') : ('hidden'));
        }
    };

    Brightics.VA.Implementation.Visual.Views.Units.DataSourceUnit = DataSourceUnit;

}).call(this);