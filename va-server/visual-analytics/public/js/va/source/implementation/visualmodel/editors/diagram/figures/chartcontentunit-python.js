/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const EMPTY_DATA = {
        columns: [],
        data: []
    };

    function ChartContentUnit(parentId, options) {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.call(this, parentId, options);
    }

    ChartContentUnit.prototype = Object.create(Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype);
    ChartContentUnit.prototype.constructor = ChartContentUnit;

    ChartContentUnit.prototype.init = function () {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.init.call(this);

        if (Studio && Studio.getJobExecutor()) {
            this.modelLauncher = Studio.getJobExecutor();
        } else {
            this.modelLauncher = Brightics.VA.Implementation.Visual.VisualModelLauncher.instance();
        }

        this.pageOptions = {
            pageNum: 1,
            pageSize: 1000,
            totalCount: 0
        };
    };

    ChartContentUnit.prototype.createControls = function () {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.createControls.call(this);

        this.createChartControl();
        this.refreshPaginationStatus();

        this.adjustBackground();
        this.adjustArrange();
    };

    ChartContentUnit.prototype.createToolbar = function ($parent) {
        this.createRefreshToolItem($parent);
        this.createRemoveContentToolItem($parent);
    };

    ChartContentUnit.prototype.createRefreshToolItem = function ($parent) {
        var _this = this;
        var $refreshButton = $('<div class="brtc-va-content-refresh-button brtc-style-content-refresh-button" title="Refresh Content" />');
        $parent.append($refreshButton);

        $refreshButton.click(function () {
            _this.resetDataSource(true);
            _this._fireSelectionChanged();
        });
    };

    ChartContentUnit.prototype.createChartControl = function () {
        var _this = this;
        var chartOptions = $.extend(true, {}, this.content.options),
            dataSource = this.getDataSource();

        $.extend(true, chartOptions, {
            plotOptions: {
                map: {
                    geoData: {
                        url: function (mapName) {
                            return 'api/va/v2/map/' + mapName
                        }
                    }
                }
            }
        });

        chartOptions.source = {
            dataType: 'local',
            localData: [{
                id: {
                    value: dataSource ? dataSource.fid : '',
                    label: dataSource && dataSource.display ? dataSource.display.label : ''
                },
                dataType: 'rawdata',
                columns: [],
                data: []
            }]
        };

        //todo : report의 interaction toolbar 기능 제한, 그룹 설정 정책이 결정되면 추후 적용
        chartOptions.toolbar = {
            type: 'custom', show: false
        };

        this.chart = this.$mainControl.find('.brtc-va-visual-content').bcharts(chartOptions);
        this.pagination = new Brightics.Chart.Component.Pagination(this.$mainControl.find('.brtc-va-visual-content'), {
            pageNum: 1,
            pageSize: 1000,
            changed: function (info) {
                _this.pageOptions.pageNum = info.pageNum;
                _this.pageOptions.pageSize = info.pageSize;

                if (_this.chart) _this.chart.bcharts('render', true);
            }
        });

        this.$mainControl.closest('.ps-container').on('scroll', function () {
            _this.pagination.$contextMenu.jqxMenu('close');
        });
        this._updatePagination(0);
    };

    ChartContentUnit.prototype._updatePagination = function (currentRowCount) {
        if (this.pagination) {
            this.pagination.setTotalCount(this.pageOptions.totalCount);
            var begin = (this.pageOptions.pageNum - 1) * this.pageOptions.pageSize + 1;
            var end = begin + currentRowCount - 1;
            this.pagination.setPageRows(begin, end);
        }
    };

    ChartContentUnit.prototype.bindEvents = function () {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.bindEvents.call(this);
        this.bindDroppableEvent();
    };

    ChartContentUnit.prototype.bindDroppableEvent = function () {
        var _this = this;
        this.$mainControl.droppable({
            greedy: true,
            accept: '.bcharts-ds-draggable',
            activate: function (event, ui) {
                var $helper = ui.helper;
                var source = Brightics.VA.Core.Utils.WidgetUtils.getData($helper, 'datasource');

                if (_this.processing || _this.getChartOption().chart.type == 'table') return;

                var options;
                _this.droppable = new Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.ChartDroppable(_this.$mainControl, {
                    width: '100%',
                    height: '100%',
                    contentUnit: _this,
                    chartOption: _this.getChartOption(),
                    onChartOptionChanged: function (chartOption) {
                        options = $.extend(true, {}, options, chartOption);

                        clearTimeout(this._executeCommand);
                        this._executeCommand = setTimeout(function () {
                            var command = new Brightics.VA.Core.CompoundCommand(this, {});
                            if (!_this.options.content.dataSourceId || _this.options.content.dataSourceId !== source.id) {
                                command.add(_this.createSetContentDataSourceCommand(source.id, this));
                            }
                            command.add(_this.createSetContentOptionCommand(options, this));
                            _this.executeCommand(command);
                            _this._fireSelectionChanged(true);
                        }, 500);
                    }
                });
            },
            deactivate: function () {
                if (_this.droppable) {
                    _this.droppable.dispose();
                    _this.droppable = null;
                }
            }
        });
    };

    ChartContentUnit.prototype.show = function (force) {
        if (force) {
            this.rendered = false;
        }
        if (!this.rendered) {
            this.resetDataSource(true);
            this.rendered = true;
        }
    };

    ChartContentUnit.prototype.hide = function () {

    };

    ChartContentUnit.prototype.refreshChart = function () {
        var _this = this;
        if (this.chart) {
            clearTimeout(this._redrawLayoutJob);
            this._redrawLayoutJob = setTimeout(function () {
                if (_this.chart) _this.chart.bcharts('render', true);
            }, 500);
            this.refreshPaginationStatus();
        }
    };

    ChartContentUnit.prototype.refreshPaginationStatus = function () {
        if (this.getChartOption().chart.type == 'table') {
            this.pageOptions = {
                pageNum: 1,
                pageSize: 1000,
                totalCount: 0
            };
            this.pagination.$mainControl.show();
            this.$mainControl.find('.brtc-va-visual-content').attr('type', 'table');
        } else {
            this.pagination.$mainControl.hide();
            this.$mainControl.find('.brtc-va-visual-content').attr('type', 'chart');
        }
    };

    ChartContentUnit.prototype.getDataSource = function () {
        return this.model.getDataSource(this.content.dataSourceId);
    };

    ChartContentUnit.prototype.resetDataSource = function (reloadData) {
        var _this = this, dataSource = this.getDataSource();

        var chartOptions = {
            source: {
                dataType: 'lazy',
                localData: [EMPTY_DATA],
                lazyData: [{
                    id: {
                        value: dataSource ? dataSource.fid : '',
                        label: dataSource && dataSource.display ? dataSource.display.label : ''
                    },
                    columns: function () {
                        return _this._querySchema();
                    },
                    data: function (prepare) {
                        _this._queryData(prepare);
                    }
                }]
            }
        };

        if (!reloadData) delete chartOptions.source.lazyData[0].data;

        this.setChartOption(chartOptions);
    };

    ChartContentUnit.prototype.getChartOption = function () {
        if (this.chart) return this.chart.bcharts('getOptions');
    };

    ChartContentUnit.prototype.setChartOption = function (chartOption) {
        if (this.chart) this.chart.bcharts('setOptions', chartOption);
        this.refreshPaginationStatus();
    };

    ChartContentUnit.prototype._querySchema = function () {
        var _this = this,
            dataSource = this.getDataSource(),
            schema = [];

        if (!dataSource) {
            return schema;
        }

        var mid = dataSource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING ? dataSource.param.modelId : _this.model.mid;
        var tid = this._getTableIdFromDataSource(dataSource);

        schema = Brightics.VA.Core.DataQueryTemplate.getSchema(mid, tid);
        schema = schema || ($.extend(true, [], dataSource.display.columns) || []);
        return schema;
    };

    ChartContentUnit.prototype._getTableIdFromDataSource = function (dataSource) {
        var dataSource = dataSource || this.getDataSource();
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

    ChartContentUnit.prototype._queryData = function (prepare) {
        var _this = this,
            dataSource = this.getDataSource();

        if (!dataSource) {
            prepare.done(EMPTY_DATA);
            _this.triggerChangedContentStatus('rendered');
            return;
        }

        var options = {
            user: Brightics.VA.Env.Session.userId,
            mid: dataSource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING ? dataSource.param.modelId : _this.model.mid,
            tid: this._getTableIdFromDataSource(),
            hideDialog: true,
            publish: this.options.publish,
            offset: prepare.options.chart.type == 'table' ? (this.pageOptions.pageNum - 1) * this.pageOptions.pageSize : 0,
            limit: prepare.options.chart.type == 'table' ? this.pageOptions.pageSize : 50000
        };

        _this.processing = true;

        prepare.aborted = function () {
            if (this.jid) {
                _this.modelLauncher.terminate(this.jid);
            }
        };

        if (dataSource.param.scheduleId) {
            options.user = dataSource.param.scheduleId
        } else if (dataSource.param.publishId) {
            options.user = dataSource.param.publishId;
        }

        if (prepare.options.chart.type == 'table') _this._queryTableData(prepare, options);
        else _this._queryChartData(prepare, options);
    };

    ChartContentUnit.prototype._done = function (type, prepare, result) {
        var input = result || EMPTY_DATA;
        if (type == 'table') input.offset = (this.pageOptions.pageNum - 1) * this.pageOptions.pageSize;
        prepare.done(input);

        this.processing = false;
        this.triggerChangedContentStatus('rendered');

        if (type == 'table') {
            this.pageOptions.totalCount = input.count;
            this._updatePagination(input.data.length);
            this.pagination.setColumnCount(input.columns.length);
            this.pagination.setPageNumber(this.pageOptions.pageNum);
            this.pagination.setPageSize(this.pageOptions.pageSize);
        }
    };

    ChartContentUnit.prototype._fail = function (type, prepare, err) {
        if (err && err.message) {
            prepare.fail(err.message);
        } else if (err && err.responseJSON && err.responseJSON.errors[0]) {
            var errorCode = err.responseJSON.errors[0].code;
            var param = err.responseJSON.errors[0].parameter;
            let message = Brightics.VA.Core.Utils.MessageUtils.getMessage(errorCode, param);
            prepare.fail(message);
        } else if (err && err.errorInfo.length > 0) {
            let message = err.errorInfo.map(function (item) {
                return item.message;
            });
            prepare.fail(message);
        } else {
            prepare.fail('Sorry! An unexpected error occurred. Please contact administrator.');
        }

        this.processing = false;
        this.triggerChangedContentStatus('rendered');

        if (type == 'table') this.pageOptions.totalCount = 0;
        if (type == 'table') this._updatePagination(0);
    };

    ChartContentUnit.prototype._queryTableData = function (prepare, options) {
        var _this = this;
        Brightics.VA.Core.DataQueryTemplate.queryTable(options.mid, options.tid, function (data, table) {
            _this._done('table', prepare, data);
        }, function (data, table, err) {
            _this._fail('table', prepare, err);
        }, false, {
            offset: options.offset,
            limit: options.limit,
            user: options.user,
            publish: options.publish
        });
    };

    ChartContentUnit.prototype._queryChartData = function (prepare, options) {
        var _this = this;
        Brightics.VA.Core.DataQueryTemplate.queryTable(options.mid, options.tid, function (data, table) {
            _this._done('chart', prepare, data);
        }, function (data, table, err) {
            _this._fail('chart', prepare, err);
        }, false, {
            offset: options.offset,
            limit: options.limit,
            user: options.user,
            publish: options.publish
        });
    };

    ChartContentUnit.prototype.createSetContentOptionCommand = function (chartOption, eventSource) {
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentOptionCommand(eventSource || this, {
            content: this.content,
            chartOptions: this.getChartOption(),
            changedOption: $.extend(true, {}, chartOption)
        });
    };

    ChartContentUnit.prototype.createSetContentDataSourceCommand = function (dataSourceId, eventSource) {
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentDataSourceCommand(eventSource || this, {
            content: this.content,
            dataSourceId: dataSourceId
        });
    };

    ChartContentUnit.prototype.onCommand = function (command) {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.onCommand.call(this, command);

        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentDataSourceCommand) this.onSetContentDataSourceCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveDataSourceCommand) this.onRemoveDataSourceCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RenameDataSourceCommand) this.onRenameDataSourceCommand(command);
    };

    ChartContentUnit.prototype.setContentSize = function (size) {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.setContentSize.call(this, size);
        if (this.chart) this.chart.bcharts('render');
    };

    ChartContentUnit.prototype.onSetContentOptionsCommand = function (command) {
        if (command.options.content.id === this.content.id) {
            if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
                this.setChartOption(command.options.changedOption);
                if (command.event.type == 'REDO') this._fireSelectionChanged(command.event.source !== this);
            } else {
                this.setChartOption(command.old.chartOption);
                this._fireSelectionChanged(command.event.source !== this);
            }
        }
    };

    ChartContentUnit.prototype.onRenameDataSourceCommand = function (command) {
        if (command.options.dataSourceId === this.content.dataSourceId) {
            this.resetDataSource(false);
            if (this.options.paper.selectedContentIds == this.options.content.id) this._fireSelectionChanged(command.event.source !== this);
        }
    };

    ChartContentUnit.prototype.onSetContentDataSourceCommand = function (command) {
        if (command.options.content.id === this.content.id) {
            this.resetDataSource(true);
            if (command.event.type == 'REDO' || command.event.type == 'UNDO') this._fireSelectionChanged(command.event.source !== this);
        }
    };

    ChartContentUnit.prototype.onSetContentChartTypeCommand = function (command) {
        if (command.options.content.id === this.content.id) {
            if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
                this.setChartOption(command.options.changedOption);
                if (command.event.type == 'REDO') this._fireSelectionChanged(command.event.source !== this);
            } else {
                this.setChartOption(command.old.chartOption);
                this._fireSelectionChanged(command.event.source !== this);
            }
            this.refreshPaginationStatus();
        }
    };

    ChartContentUnit.prototype.onRemoveDataSourceCommand = function (command) {
        if (command.options.dataSourceId === this.content.dataSourceId) {
            this.resetDataSource(true);
            this._fireSelectionChanged();
        }
    };

    ChartContentUnit.prototype._createBigDataChartFnUnit = function () {
        var _this = this,
            fnUnit = Brightics.VA.Core.Utils.FullRenderingUtils.getFnUnit(this.getChartOption()),
            dataSource = this.getDataSource();
        Brightics.VA.Core.Utils.ModelUtils.extendParent(this.editor.getModel(), fnUnit);

        var inTable = this._getTableIdFromDataSource();
        fnUnit[IN_DATA].push(inTable);
        fnUnit[OUT_DATA].push(inTable + fnUnit.fid);
        fnUnit.getModelId = function () {
            return dataSource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING ? dataSource.param.modelId : _this.model.mid;
        };
        return fnUnit;
    };

    ChartContentUnit.prototype.destroy = function () {
        Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit.prototype.destroy.call(this);
        if (this.chart) this.chart.bcharts('destroy');
        if (this.pagination) this.pagination.destroy();
    };

    ChartContentUnit.prototype.onChartOptionChanged = function (chartOption, forced) {
        var key = Object.keys(chartOption)[0];
        if (JSON.stringify(this.getChartOption()[key]) !== JSON.stringify(chartOption[key]) || (forced === true)) {
            var command = this.createSetContentOptionCommand(chartOption);
            this.executeCommand(command);
        }
    };

    ChartContentUnit.prototype.onChartTypeChanged = function (chartType) {
        if (JSON.stringify(this.getChartOption().chart.type) !== JSON.stringify(chartType.chart.type)) {
            var command = this.createSetContentOptionCommand(chartType);
            this.executeCommand(command);
        }
    };

    ChartContentUnit.prototype.onDataSourceChanged = function (dataSource) {
        if (JSON.stringify(this.content.dataSourceId) !== JSON.stringify(dataSource.value)) {
            var command = this.createSetContentDataSourceCommand(dataSource.value);
            this.executeCommand(command);
        }
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.ContentUnit.chart = ChartContentUnit;

}).call(this);
