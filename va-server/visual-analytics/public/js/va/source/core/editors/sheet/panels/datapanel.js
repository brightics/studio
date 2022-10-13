/**
 * Created by gy84.bae on 2016-02-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var downloader = Brightics.VA.Core.Utils.DownLoader;

    const PANEL_TYPE_IN = 'in';
    const PANEL_TYPE_OUT = 'out';
    const DEFAULT_PAGE_OPTION = {
        pageNum: 1,
        pageSize: 1000,
        count: 0
    };
    const ScriptArr = ['scalaScript', 'pythonScript'];

    function DataPanel(parentId, options) {
        this.pageOptionsMap = {};

        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.call(this, parentId, options);
        this.createDataWorksheet();
        this._setOutTableInfo();
    }

    DataPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype);
    DataPanel.prototype.constructor = DataPanel;

    DataPanel.prototype.registerCommandListener = function () {
        var _this = this;
        this.commandListener = function (command) {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand || command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand) {
                if (_this.options.fnUnit.fid === command.options[TARGET_FID]) {
                    _this.handleConnectionCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand) {
                if (_this.options.fnUnit.fid === command.options[TARGET_FID] || _this.options.fnUnit.fid === command.old[TARGET_FID]) {
                    _this.handleConnectionCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutTableCommand) {
                if (_this.options.fnUnit.fid === command.options.fnUnit.fid) {
                    _this.handleOutTableCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand) {
                if (_this.options.fnUnit.fid === command.options.fnUnit.fid) {
                    _this.handleConnectionCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand) {
                if (_this.options.fnUnit.fid === command.options.fnUnit.fid) {
                    _this.handleConnectionCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand) {
                if (_this.options.fnUnit.fid === command.options.fnUnit.fid) {
                    _this.handleNewOutTableCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetDisplayColumnsCommand) {
                if (_this.display.panelType === command.options.panelType && command.options.tableId) {
                    _this.handleSetDisplayColumnsCommand(command);
                }
            }
            else if (command instanceof Brightics.VA.Core.CompoundCommand) {
                $.each(command.commandList, function (index, com) {
                    if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand || com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand) {
                        if (_this.options.fnUnit.fid === com.options[TARGET_FID]) {
                            _this.handleConnectionCommand(com);
                        }
                    } else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand) {
                        if (_this.options.fnUnit.fid === com.options[TARGET_FID] || _this.options.fnUnit.fid === com.old[TARGET_FID]) {
                            _this.handleConnectionCommand(com);
                        }
                    } else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutTableCommand) {
                        if (_this.options.fnUnit.fid === com.options.fnUnit.fid && ScriptArr.indexOf(_this.options.fnUnit.func) == -1) {
                            _this.handleOutTableCommand(com);
                        }
                    }
                    else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand) {
                        if (_this.options.fnUnit.fid === com.options.fnUnit.fid) {
                            _this.handleConnectionCommand(com);
                        }
                    }
                    else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand) {
                        if (_this.options.fnUnit.fid === com.options.fnUnit.fid) {
                            _this.handleConnectionCommand(com);
                        }
                    }
                    else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand) {
                        if (_this.options.fnUnit.fid === com.options.fnUnit.fid) {
                            _this.handleNewOutTableCommand(com);
                        }
                    }
                });
            }
        };
        this.options.modelEditor.addCommandListener(this.commandListener);
    };

    DataPanel.prototype.handleSetDisplayColumnsCommand = function (command) {
        var _this = this;
        var selectedTableId = command.options.tableId;
        var tableIndex = this.dataWorksheet._getSelectedPanelTableIndex();
        var pageInfo = this.dataWorksheet.getPaginationInfoByTableIndex(tableIndex);

        _this.options.dataProxy.requestPageData(selectedTableId, function (result, tableId) {
            if (_this._isDisposed() === false && result.data.length > 0) {
                result.offset = (pageInfo.page - 1) * pageInfo.pageSize;
                _this.dataWorksheet.setDataSet(tableId, result);
                _this._updatePagination(tableId, result.data.length);
                _this.setPaginationInfo(pageInfo);
            }
        }, function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        }, pageInfo.page, pageInfo.pageSize, {columns:command.options.columns[command.options.tableId]});

        // this.initialize(this.display.panelType);
        // this.refreshHeaderToolbar();
        // this.dataWorksheet.renderDataWorksheet();
    };

    DataPanel.prototype.handleOutTableCommand = function (command) {
        if (this.options.fnUnit.hasOwnProperty('parent')) {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutTableCommand) {
                if (this.display.panelType === PANEL_TYPE_OUT) {
                    this.initialize(this.display.panelType);
                    this.refreshHeaderToolbar();
                    this.dataWorksheet.renderDataWorksheet();
                }
            }
        }
    };

    DataPanel.prototype.handleConnectionCommand = function (command) {
        if (this.options.fnUnit.hasOwnProperty('parent')) {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand) {
                if (this.display.panelType === PANEL_TYPE_IN) {
                    this.initialize(this.display.panelType);
                    this.refreshHeaderToolbar();
                    this.dataWorksheet.renderDataWorksheet();
                }
            }
        }
    };

    DataPanel.prototype.handleNewOutTableCommand = function (command) {
        if (this.options.fnUnit.hasOwnProperty('parent')) {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand) {
                if (this.display.panelType === PANEL_TYPE_OUT) {
                    this.initialize(this.display.panelType);
                    this.refreshHeaderToolbar();
                    this.dataWorksheet.renderDataWorksheet();
                }
            }
        }
    };

    DataPanel.prototype.destroy = function () {
        this.$worksheetSelector.jqxDropDownList('destroy');
        this.$contextMenu.jqxMenu('destroy');

        if (this.pagination) {
            this.pagination.destroy();
        }
        if (this.dataSchema) {
            this.dataSchema.destroy();
        }
        if (this.dataWorksheet) {
            this.dataWorksheet.destroy();
        }
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.destroy.call(this);
        this.options.modelEditor.removeCommandListener(this.commandListener);
    };

    DataPanel.prototype.initialize = function (panelType) {
        this.display.tableList = [];
        var analyticsModel = this.options.fnUnit.parent();
        if (panelType === PANEL_TYPE_IN) {
            var previous = analyticsModel.getPrevious(this.options.fnUnit.fid);
            for (var i = 0; i < previous.length; i++) {
                var sourceFnUnit = analyticsModel.getFnUnitById(previous[i]);
                if (sourceFnUnit) this.display.tableList = this.display.tableList.concat(this.FnUnitUtils.getOutTable(sourceFnUnit));
            }
        }

        if (panelType === PANEL_TYPE_OUT) {
            this.display.tableList = this.FnUnitUtils.getOutTable(this.options.fnUnit) || [];
        }
    };

    DataPanel.prototype._getSelectedTable = function () {
        var selectedTable;
        if (this.selectedTableId) selectedTable = this.selectedTableId;
        else selectedTable = this.display.tableList[0];
        return selectedTable;
    };

    DataPanel.prototype._isDisposed = function () {
        return this.$contentsArea.closest('.brtc-va-editors-sheet-fnunitviewer-panel').length === 0;
    };

    DataPanel.prototype._updatePagination = function (tableId, currentRowCount) {
        if (this.pagination) {
            this.pageOptionsMap[tableId] = this.pageOptionsMap[tableId] || $.extend(true, {}, DEFAULT_PAGE_OPTION);
            var begin = (this.pageOptionsMap[tableId].pageNum - 1) * this.pageOptionsMap[tableId].pageSize + 1;
            var end = begin + currentRowCount - 1;
            this.pagination.setPageRows(begin, end);
            var totalCount = -1;
            if (this.pageOptionsMap[tableId].count >= 0) totalCount = this.pageOptionsMap[tableId].count;
            else {
                if (currentRowCount < this.pageOptionsMap[tableId].pageSize) totalCount = currentRowCount;
            }
            this.pagination.setTotalCount(totalCount);
        }
    };

    DataPanel.prototype.getChartTypeList = function () {
        return Object.keys(Brightics.Chart.Registry);
    };

    DataPanel.prototype.getChartLabelByType = function (type) {
        return Brightics.Chart.Registry[type].Label;
    };

    DataPanel.prototype.getRenderChart = function () {
        var rt = [];

        var requested = this.options.dataProxy.requested;
        var tid = Object.keys(requested)[0];
        var inOutType = 'in';

        if (this.options.fnUnit.version === '3.6') {
            var outputsObj = this.options.fnUnit['outputs'];
            if (outputsObj) {
                for (var element in outputsObj) {
                    if (outputsObj[element] === tid) {
                        inOutType = 'out';
                        break;
                    }
                }
            }
        } else {
            var outTableArr = this.options.fnUnit[OUT_DATA];
            if (outTableArr && outTableArr.indexOf(tid) > -1) {
                inOutType = 'out';
            }
        }

        var panels = this.options.fnUnit.display.sheet[inOutType].partial[0].panel;

        for (var i in panels) {
            rt.push(panels[i].chartOption.chart.type);
        }

        return rt;
    };

    DataPanel.prototype.createRecommendedChartSheet = function () {
        var _this = this,
            func = this.options.fnUnit.func,
            recommendChartList = this.display.panelType == PANEL_TYPE_IN ? ['table'] : root.Brightics.VA.Env.Recommend.NextChart[func] || ['table'],
            chartTypes = this.getChartTypeList();

        var ctArr = this.getRenderChart();
        var defaultChartType = ctArr[0];

        var $recommendArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-contents-recommend-area"></div>');
        this.$contentsArea.empty();
        this.$contentsArea.append($recommendArea);

        var $firstChart = $recommendArea.find('.brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box').first();
        $firstChart.addClass('brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box-selected');
        _this.options.selectedChart = $firstChart.find(':first-child').attr('type');

        $recommendArea.append('<div class="brtc-va-editors-sheet-panels-basepanel-contents-recommend-title">'+Brightics.locale.common.recommendedGraphType+'</div>');
        var $chartListArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-contents-recommend-chart-list"></div>');
        $recommendArea.append($chartListArea);

        $.each(recommendChartList, function (index, value) {
            $chartListArea.append('<div class="brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box">' +
                '<div class="brtc-va-editors-sheet-panels-basepanel-contents-chart-icon" type=' + value + '></div>' +
                '<div class="brtc-va-editors-sheet-panels-basepanel-contents-chart-text">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(_this.getChartLabelByType(value)) + '</div>' +
                '</div>');
        });

        $recommendArea.append('<div class="brtc-va-editors-sheet-panels-basepanel-contents-recommend-title">'+Brightics.locale.common.availableGraphType+'</div>');
        var $commonChartListArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-contents-available-chart-list"></div>');
        $recommendArea.append($commonChartListArea);

        $.each(chartTypes, function (index, value) {
            $commonChartListArea.append('<div class="brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box">' +
                '<div class="brtc-va-editors-sheet-panels-basepanel-contents-chart-icon" type=' + value + '></div>' +
                '<div class="brtc-va-editors-sheet-panels-basepanel-contents-chart-text">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(_this.getChartLabelByType(value)) + '</div>' +
                '</div>');
        });

        var $selectedChart = $recommendArea.find('.brtc-va-editors-sheet-panels-basepanel-contents-chart-icon[type=' + defaultChartType + ']').closest('.brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box');
        $selectedChart.addClass('brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box-selected');
        _this.options.selectedChart = defaultChartType;

        $recommendArea.slimScroll({
            color: '#a4bed4',
            height: '100%'
        });

        var $chartIcons = $recommendArea.find('.brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box');
        $chartIcons.click(function (event) {
            var $target = $(event.target);

            if (!$target.hasClass('brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box')) {
                $target = $target.closest('.brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box');
            }

            $chartIcons.removeClass('brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box-selected');
            $target.addClass('brtc-va-editors-sheet-panels-basepanel-contents-chart-icon-box-selected');
            _this.options.selectedChart = $target.find(':first-child').attr('type');
        });

        if (window.useSpark !== 'true') {
            $('.brtc-va-editors-sheet-panels-basepanel-contents-chart-icon[type="decisionTreeForBrightics"]').parent().hide();
        }
    };

    DataPanel.prototype.createBottomAreaControls = function ($parent) {
        var _this = this;

        this.pagination = new Brightics.Chart.Component.Pagination($parent, {
            pageNum: 1,
            pageSize: Brightics.VA.SettingStorage.getValue('editor.datapanel.defaultrowcount') * 1,
            changed: function (info) {
                var selectedTableId = _this._getSelectedTable();
                _this.pageOptionsMap[selectedTableId] = _this.pageOptionsMap[selectedTableId] || $.extend(true, {}, DEFAULT_PAGE_OPTION);
                _this.pageOptionsMap[selectedTableId].pageNum = info.pageNum;
                _this.pageOptionsMap[selectedTableId].pageSize = info.pageSize;
                var columnOption = _this.options.fnUnit.display.columns ? _this.options.fnUnit.display.columns[selectedTableId] : null;
                _this.options.dataProxy.requestPageData(selectedTableId, function (result, tableId) {
                    if (_this._isDisposed() === false && result.data.length > 0) {
                        result.offset = (_this.pageOptionsMap[tableId].pageNum - 1) * _this.pageOptionsMap[tableId].pageSize;
                        _this.dataWorksheet.updataPageInfo(tableId,
                            {
                                page: info.pageNum,
                                pageSize: info.pageSize
                            });
                        _this.dataWorksheet.setDataSet(tableId, result);
                        _this._updatePagination(tableId, result.data.length);
                    }
                }, function (err) {
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                }, _this.pageOptionsMap[selectedTableId].pageNum, _this.pageOptionsMap[selectedTableId].pageSize, {columns: columnOption});
            }
        });

        this.pagination.$mainControl.find('.bcharts-pagination-showing').hide();
        this.pagination.$mainControl.css('float', 'right');
        this.pagination.hide();
    };

    DataPanel.prototype.setPaginationInfo = function (pageInfo) {
        if (pageInfo.page) {
            if (pageInfo.showPageSelector === false) {
                this.pagination.showOnlyCount();
            } else {
                this.pagination.show();
            }
            this.pagination.update({
                pageNum: pageInfo.page,
                totalCount: pageInfo.count,
                pageSize: pageInfo.pageSize,
                columnCount: pageInfo.columns.length
            });
            this.dataSchema.show();
            this.dataSchema.update(pageInfo, this.display.panelType);
            this.selectedTableId = pageInfo.tableId;

            this.pageOptionsMap[pageInfo.tableId] = this.pageOptionsMap[pageInfo.tableId] || $.extend(true, {}, DEFAULT_PAGE_OPTION);
            this.pageOptionsMap[pageInfo.tableId].count = pageInfo.count;

        } else {
            this.pagination.hide();
            this.dataSchema.hide();
        }
    };

    DataPanel.prototype.createDataWorksheet = function () {
        var _this = this;
        if (this.dataWorksheet) {
            this.dataWorksheet.destroy();
        }
        _this.$contentsArea.empty();
        var dataWorksheetType = this.$worksheetSelector.jqxDropDownList('getSelectedIndex');
        if (dataWorksheetType === 0) {
            _this.$topArea.attr('sheet-type', 'partial');
            _this.dataWorksheet = new Brightics.VA.Core.Editors.Sheet.Controls.DataWorksheet(_this.$contentsArea, {
                selectedChart: this.options.selectedChart || 'table',
                dataProxy: this.options.dataProxy,
                panelType: _this.display.panelType,
                fnUnit: _this.options.fnUnit,
                callback: {
                    createRecommendedChartSheet: _this.createRecommendedChartSheet.bind(this),
                    setPaginationInfo: this.setPaginationInfo.bind(this)
                }
            });
        } else if (dataWorksheetType === 1) {
            _this.$topArea.attr('sheet-type', 'full');
            _this.dataWorksheet = new Brightics.VA.Core.Editors.Sheet.Controls.BigDataWorksheet(_this.$contentsArea, {
                dataProxy: this.options.dataProxy,
                panelType: _this.display.panelType,
                fnUnit: _this.options.fnUnit,
                callback: {
                    createRecommendedChartSheet: _this.createRecommendedChartSheet.bind(this),
                    setPaginationInfo: this.setPaginationInfo.bind(this)
                }
            });
        }
    };

    DataPanel.prototype.createContentsArea = function () {
        this.display = {
            panelType: this.$parent.attr("datapaneltype") || 'in'
        };

        this.initialize(this.display.panelType);
        var preContents = this.$mainControl.find('.brtc-va-editors-sheet-panels-basepanel-contents-area');
        if (preContents.length > 0) preContents.remove();

        this.$infoArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-info-area" />');
        this.$contentsArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-contents-area brtc-va-editors-sheet-panels-datapanel-content brtc-style-margin-bottom-3" />');

        this.$mainControl.append(this.$infoArea).append(this.$contentsArea);
    };

    DataPanel.prototype.createTopAreaControls = function ($parent) {
        this.$header = $('' +
            '<div class="brtc-va-editors-sheet-panels-basepanel-header brtc-va-editors-sheet-panels-datapanel-header">' +
            '   <div class="brtc-va-editors-sheet-worksheet-selector"></div>' +
            '   <div class="brtc-va-editors-sheet-panels-basepanel-header-container">' +
            '       <div class="brtc-va-editors-sheet-panels-basepanel-header-title" />' +
            '   </div>' +
            '   <div title="Chart Context Menu" class="brtc-va-editors-sheet-panels-basepanel-header-context-menu-open" />' +
            '   <div class="brtc-va-editors-sheet-panels-basepanel-header-context-menu" />' +
            '</div>');

        this.$contextMenuOpen = this.$header
            .find('.brtc-va-editors-sheet-panels-basepanel-header-context-menu-open');
        this.createTopAreaHeaderTitle($parent);
        this.createTopAreaHeaderToolbar();
        this.createTopAreaHeaderContext(this.$contextMenuOpen);
    };

    DataPanel.prototype.createTopAreaHeaderTitle = function ($parent) {
        var _this = this;

        // var $title = this.$header.find('.brtc-va-editors-sheet-panels-basepanel-header-title');

        this.dataSchema = new Brightics.VA.Core.Editors.Sheet.Panels.DataSchema(this.$infoArea, this.options);
        this.dataSchema.hide();

        $parent.append(this.$header);
        this.$worksheetSelector = this.$header.children('.brtc-va-editors-sheet-worksheet-selector').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: ['Partial Rendering', 'Full Rendering'],
            width: 120,
            autoDropDownHeight: true,
            dropDownWidth: 120,
            selectedIndex: 0
        });
        this.$worksheetSelector.on('change', function (event) {
            _this.pagination.hide();
            _this.dataSchema.hide();
            _this.createDataWorksheet();
        });
    };

    DataPanel.prototype.createTopAreaHeaderContext = function ($ctxMenuOpen) {
        var _this = this;
        this._createTopAreaHeaderContext = this._createTopAreaHeaderContext || (function ($ctxMenuOpen) {
            var init = false;
            var $toolbarChildren = this.$toolbar.children();
            var $contextMenu = this.$header
                .find('.brtc-va-editors-sheet-panels-basepanel-header-context-menu');
            this.$contextMenu = $contextMenu;

            return function () {
                var items = _.filter($toolbarChildren, function ($toolbarChild) {
                    return !($($toolbarChild)
                        .hasClass('brtc-va-editors-sheet-panels-datapanel-toolitem-splitter'));
                });

                var handlers = items.map(function (item) {
                    return function () {
                        item.click();
                    };
                });

                if (!init) {

                    $contextMenu.jqxMenu({
                        theme: Brightics.VA.Env.Theme,
                        width: '120px',
                        height: '100%',
                        autoOpenPopup: false,
                        mode: 'popup',
                        animationHideDuration: 0,
                        animationShowDuration: 0
                    });

                    $ctxMenuOpen.click(function (evt) {
                        $contextMenu.jqxMenu('open', Math.min(evt.clientX, $(window).width() - 120),
                            evt.clientY);
                    });

                    $contextMenu.on('itemclick', function (evt) {
                        var index = $(evt.args.children[0]).attr('index');
                        handlers[index]();
                    });
                    init = true;
                }

                var source = items.map(function (item, index) {
                    return _.template('<span index="${index}" title="${label}">${label}</span>')({
                        label: item.title,
                        index: index
                    });
                });

                $contextMenu.jqxMenu('source', source);
            };
        }.call(this, $ctxMenuOpen));

        this._createTopAreaHeaderContext($ctxMenuOpen);
    };

    DataPanel.prototype.createTopAreaHeaderToolbar = function () {
        var _this = this,
            $toolbar = $('' +
                '<div class="brtc-va-editors-sheet-panels-datapanel-toolbar"/>');
        this.$header.append($toolbar);
        this.$toolbar = $toolbar;

        this.createPopupToolItem($toolbar);
        this.createMinMaxToolItem($toolbar);
        $toolbar.append('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-splitter"></div>');
        this.createArrangeToolItem($toolbar);
        $toolbar.append('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-splitter"></div>');
        this.createDownloadItem($toolbar);
        $toolbar.find('.brtc-va-editors-sheet-panels-datapanel-toolitem-splitter:eq(0)').css('display', this.options.resizable ? 'block' : 'none');
    };

    DataPanel.prototype.createMinMaxToolItem = function ($toolbar) {
        var _this = this;

        this.$minMaxButton = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-maximize" title="' + Brightics.locale.panel.maxMin + '"></div>');
        this.$minMaxButton.attr('maximize', 'false');
        $toolbar.append(this.$minMaxButton);

        var $inDataPanel = this.$parent.closest('.brtc-va-editors-sheet-fnunitviewer').find('.brtc-va-editors-sheet-fnunitviewer-indata-fncenter'),
            $outDataPanel = this.$parent.closest('.brtc-va-editors-sheet-fnunitviewer').find('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter');

        if (_this.display.panelType === 'in' && $outDataPanel.css('display') === 'none') {
            this.adjustMaximize(true);
        } else if (_this.display.panelType === 'out' && $inDataPanel.css('display') === 'none') {
            this.adjustMaximize(true);
        }

        this.$minMaxButton.on('click', function (event) {
            if ($(this).attr('maximize') === 'true') {
                _this.adjustMaximize(false);
            } else {
                _this.adjustMaximize(true);
            }

            _this.$parent.trigger('sizeChange', [_this.display.panelType]);
        });
        this.$minMaxButton.css('display', this.options.resizable ? 'block' : 'none');
    };

    DataPanel.prototype.adjustMaximize = function (isMaximize) {
        if (isMaximize) {
            this.$minMaxButton.removeClass('brtc-va-editors-sheet-panels-datapanel-toolitem-maximize').addClass('brtc-va-editors-sheet-panels-datapanel-toolitem-minimize').attr('maximize', 'true');
        } else {
            this.$minMaxButton.removeClass('brtc-va-editors-sheet-panels-datapanel-toolitem-minimize').addClass('brtc-va-editors-sheet-panels-datapanel-toolitem-maximize').attr('maximize', 'false');
        }
    };

    DataPanel.prototype.createArrangeToolItem = function ($toolbar) {
        var _this = this;
        var $arrangeEvenly = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-arrange-evenly" title="' + Brightics.locale.panel.evenly + '"></div>');
        $toolbar.append($arrangeEvenly);
        $arrangeEvenly.on('click', function (event) {
            _this.dataWorksheet.arrange('evenly');
        });

        var $arrangeStacked = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-arrange-stacked" title="' + Brightics.locale.panel.horizontal + '"></div>');
        $toolbar.append($arrangeStacked);
        $arrangeStacked.on('click', function (event) {
            _this.dataWorksheet.arrange('horizontal');
        });

        var $arrangeSideBySide = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-arrange-side-by-side" title="' + Brightics.locale.panel.vertical + '"></div>');
        $toolbar.append($arrangeSideBySide);
        $arrangeSideBySide.on('click', function (event) {
            _this.dataWorksheet.arrange('vertical');
        });
    };

    DataPanel.prototype.createPopupToolItem = function ($toolbar) {
        var _this = this;
        var $popup = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-popup" title="' + Brightics.locale.panel.popupChart + '" target="popupChart"></div>');
        $toolbar.append($popup);

        var _makePageOptionArray = function () {
            var tableIds = _this.FnUnitUtils.getTable(_this.options.fnUnit, _this.options.panelType);
            var offsetArr = [], limitArr = [];
            tableIds.forEach(function (tableId) {
                if (_this.pageOptionsMap[tableId]) {
                    offsetArr.push((_this.pageOptionsMap[tableId].pageNum - 1) * _this.pageOptionsMap[tableId].pageSize);
                    limitArr.push(_this.pageOptionsMap[tableId].pageSize)
                } else {
                    offsetArr.push(0);
                    limitArr.push(1000);
                }
            });
            return {
                offsetArr: offsetArr,
                limitArr: limitArr
            };
        };

        $popup.click(
            function () {
                var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
                var pageOptArr = _makePageOptionArray();
                var param = {
                    user: Brightics.VA.Env.Session.userId,
                    pid: modelEditor.options.editorInput.getProjectId(),
                    mid: _this.options.fnUnit.parent().mid,
                    fid: _this.options.fnUnit.fid,
                    tids: _this.FnUnitUtils.getTable(_this.options.fnUnit, _this.options.panelType),
                    offsetArr: pageOptArr.offsetArr,
                    limitArr: pageOptArr.limitArr
                };

                var params = $.map(param, function (value, key) {
                    return key + '=' + value;
                }).join('&');
                window.open('popupchart?' + params, 'popupChart');
            }
        );
    };

    DataPanel.prototype.onSetDataWorksheetInform = function (worksheetData) {
        var compoundCommand = new Brightics.VA.Core.CompoundCommand(this, {
            id: 'brightics.va.editors.diagram.commands.setdataworksheetimformation'
        });
        compoundCommand.add(this.createSetDataWorksheetPanelCommand(worksheetData.panel));
        compoundCommand.add(this.createSetDataWorksheetLayoutCommand(worksheetData.layout));

        this.executeCommand(compoundCommand);
    };

    DataPanel.prototype.createSetDataWorksheetPanelCommand = function (newPanel) {
        var setDataWorksheetPanelCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetPanelCommand(this, {
            panel: this.options.fnUnit.display.sheet[this.display.panelType][0].panel,
            newPanel: newPanel
        });

        return setDataWorksheetPanelCommand;
    };

    DataPanel.prototype.createSetDataWorksheetLayoutCommand = function (newLayout) {
        var setDataWorksheetLayoutCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand(this, {
            layout: this.options.fnUnit.display.sheet[this.display.panelType][0].layout,
            newLayout: newLayout
        });

        return setDataWorksheetLayoutCommand;
    };

    DataPanel.prototype.executeCommand = function (command) {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        modelEditor.getCommandManager().execute(command);
    };

    DataPanel.prototype.createDownloadItem = function ($toolbar) {
        var $download = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-download" title="' + Brightics.locale.panel.download + '"></div>');
        $toolbar.append($download);
        var _this = this;
        $download.click(function (event) {
            var model = _this.options.fnUnit.parent();
            var userId = Brightics.VA.Env.Session.userId;
            var mid = model.mid;
            var tableObjList = [];
            var tidList = _this.FnUnitUtils.getTable(_this.options.fnUnit, _this.options.panelType);
            for (var index in tidList) {
                var label = model.getFnUnitByOutTable(tidList[index]).display.label;
                var indexedLabel = (tidList.length == 1 || _this.display.panelType !== 'out') ? label : label + '-' + (Number(index) + 1);
                tableObjList.push({
                    value: tidList[index],
                    label: indexedLabel
                });
            }

            var rgExp = /[~!@\#$%^&*\()\[\]\{\}=+'";:?`|\\/]/gi;
            var fileName = (_this.options.fnUnit.display.label.replace(/\s/g, '_') + '_' + _this.display.panelType + '.csv').replace(rgExp, "");

            var downloaderOptions = {
                userId: userId,
                mid: mid,
                tableObjList: tableObjList,
                fileName: fileName
            };

            if (_this.dataWorksheet) {
                new Brightics.VA.Core.Wizards.DataDownloadWizard(_this.$mainControl, {
                    mode: 'open',
                    height: 400,
                    close: function () {

                    },
                    downloader: downloader,
                    downloaderOptions: downloaderOptions,
                    previewData: _this.dataWorksheet.dataSet
                });
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('No data to download.');
            }
        });
    };

    DataPanel.prototype.refreshHeaderToolbar = function () {
        this.$header.find('.brtc-va-editors-sheet-panels-datapanel-toolbar').remove();
        this.createTopAreaHeaderToolbar();
        this.createTopAreaHeaderContext(this.$contextMenuOpen);
    };


    DataPanel.prototype._setOutTableInfo = function () {
        if (this.display.panelType !== PANEL_TYPE_OUT) return;

        if (this.FnUnitUtils.getOutTable(this.options.fnUnit) && this.FnUnitUtils.getOutTable(this.options.fnUnit).length > 1) {
            var $title = this.$header.find('.brtc-va-editors-sheet-panels-basepanel-header-title');
            var title = this.options.title + ' (' + this.FnUnitUtils.getOutTable(this.options.fnUnit).length + ' Outputs)';
            $title.text(title);
            $title.attr('title', title);
        }
    };

    Brightics.VA.Core.Editors.Sheet.Panels.DataPanel = DataPanel;

    function DataSchema($parent, options) {
        this.$parent = $parent;
        this.options = options;

        this.createLayout();
    }

    DataSchema.prototype.createLayout = function () {
        this.$mainControl = $('<div class="brtc-va-editors-sheet-panels-datapanel-schema"></div>');

        this.$column = $('' +
            '<div class="brtc-va-editors-sheet-panels-datapanel-schema-column">' +
                '<div type="text">Column(s): </div>' +
                '<div type="count"></div>' +
                '<div type="setting" class="brtc-va-editors-sheet-panels-datapanel-schema-column-setting-button" style="display:none;"></div>' +
            '</div>');
        this.$row = $('' +
            '<div class="brtc-va-editors-sheet-panels-datapanel-schema-row">' +
                '<div type="text">Row(s): </div>' +
                '<div type="count"></div>' +
            '</div>');

        this.$parent.append(this.$mainControl);
        this.$mainControl.append(this.$column).append(this.$row);

        var _this = this;
        this.columnSettings= new Brightics.VA.Core.Editors.Sheet.Controls.ColumnSettings(this.$mainControl, {
            options: this.options,
            changed: function (event, data) {
                var command = _this.createSetDisplayColumnsCommand(data)
                _this.executeCommand(command);
            }
        });
    };

    DataSchema.prototype.update = function (schema, panelType) {
        var _this = this;
        var columnCount = '';
        if (schema.columnLength > 1000) {
            columnCount = Brightics.VA.Core.Utils.CommonUtils.numberToStringWithComma(schema.columnLength) + ' (Showing ' + Brightics.VA.Core.Utils.CommonUtils.numberToStringWithComma(schema.columns.length) + ')';
            this.$column.find('[type=setting]').show();
            this.$column.find('[type=setting]').unbind('click').bind('click', function() {
                _this.tableId = schema.tableId;
                _this.columnSettings.open(this, schema, _this.options);
            });
        }
        else {
            columnCount = (schema.columns)? Brightics.VA.Core.Utils.CommonUtils.numberToStringWithComma(schema.columns.length) : 0;
            this.$column.find('[type=setting]').hide();
            this.$column.find('[type=setting]').unbind('click');
        }
        var rowCount = Brightics.VA.Core.Utils.CommonUtils.numberToStringWithComma(schema.totalCount);
        this.$column.find('[type=count]').text(columnCount);
        this.$row.find('[type=count]').text(rowCount);
        this.panelType = panelType;
    };

    DataSchema.prototype.destroy = function () {
        if (this.columnSettings) {
            this.columnSettings.close();
        }
        this.$mainControl.remove();
    };

    DataSchema.prototype.hide = function () {
        this.$mainControl.hide();
    };

    DataSchema.prototype.show = function () {
        this.$mainControl.show();
    };

    DataSchema.prototype.createSetDisplayColumnsCommand = function (data) {
        if (!this.options.fnUnit.display.columns) this.options.fnUnit.display.columns = {};
        var setDisplayColumnsCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDisplayColumnsCommand(this, {
            columns: this.options.fnUnit.display.columns,
            newColumns: data.columns,
            tableId: data.tableId,
            panelType: this.panelType
        });

        return setDisplayColumnsCommand;
    };

    DataSchema.prototype.executeCommand = function (command) {
        var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        modelEditor.getCommandManager().execute(command);
    };

    Brightics.VA.Core.Editors.Sheet.Panels.DataSchema = DataSchema;

}).call(this);
