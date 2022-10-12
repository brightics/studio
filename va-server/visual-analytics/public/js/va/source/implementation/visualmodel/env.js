(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var library = root.Brightics.VA.Core.Functions.Library;

    root.Brightics.VA.Implementation.Visual = {
        Clazz: 'visual',
        Label: Brightics.locale.common.report,
        Editors: {
            Diagram: {
                EditorPage: {},
                Commands: {},
                Figures: {
                    ContentUnit: {},
                    Droppable: {}
                }
            },
            Sheet: {}
        },
        Validator: {},
        Dialogs: {},
        Tools: {
            Adapter: {},
            Manager: {}
        },
        Utils: {},
        Views: {
            OptionViewer: {},
            Units: {}
        },
        Wizards: {
            Pages: {}
        }
    };

    Brightics.VA.Implementation.Visual.DATASOURCE_TYPE = {
        STAGING: 'loadFromStaging',
        ALLUXIO: 'loadFromAlluxio',
        LOCAL: 'loadFromLocal',
        HDFS: 'loadFromHdfs',
        SCHEDULE: 'loadFormSchedule'
    };

    Brightics.VA.Implementation.Visual.CONST = {
        DEFAULT_REPORT_SIZE: {
            'page-type': 'a4-vertical',
            width: 795,
            height: 1125
        }
    };

    Brightics.VA.Implementation.Visual.BIGDATA_FUNC = {
        'area': 'bigDataArea',
        'area-stacked': 'bigDataAreaStacked',
        'area-stacked-100': 'bigDataStacked100',
        'bar': 'bigDataBar',
        'bar-stacked': 'bigDataBarStacked',
        'bar-stacked-100': 'bigDataBarStacked100',
        'biplot': 'bigDataBiplot',
        'boxplot': 'bigDataBoxplot',
        'column': 'bigDataColumn',
        'column-stacked': 'bigDataColumnStacked',
        'column-stacked-100': 'bigDataColumnStacked100',
        'heatmap': 'bigDataHeatMap',
        'line': 'bigDataLine',
        'network': 'bigDataNetwork',
        'pie': 'bigDataPie',
        'radar': 'bigDataRadar',
        'roccurve': 'bigDataRocCurve',
        'scatter': 'bigDataScatter',
        'scattermap': 'bigDataScatterMap',
        'table': 'bigDataTable',
        'treemap': 'bigDataTreeMap'
    };

    Brightics.VA.Implementation.Visual.CONTENT_TYPE = {
        CHART: 'chart',
        TEXT: 'text',
        PAGE: 'page'
    };

    root.Brightics.VA.Implementation.Visual.Functions =
        library.extendFunctions(['load', 'refine', 'loadFromStaging', 'loadFromAlluxio', 'loadFromLocal', 'loadFromRdb', 'loadFromHdfs']);

    root.Brightics.VA.Implementation.Visual.defaultModel = {
        type: root.Brightics.VA.Implementation.Visual.Clazz,
        functions: [],
        links: [],
        report: {
            pages: [],
            display: {}
        },
        newDataSource: function (type, fileLabel, fileName)   {
            var _this = this;
            var fid = Brightics.VA.Core.Utils.IDGenerator.dataSource.id();
            var tableId = Brightics.VA.Core.Utils.IDGenerator.table.id();

            var newDataSourceUnit;
            if (root.useSpark === 'false' && type == Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.ALLUXIO) {
                newDataSourceUnit = {
                    "persist-mode": "auto",
                    "func": "brightics.function.io$load13889",
                    "name": "brightics.function.io$load",
                    "param": { "partial_path": [""] },
                    "display": {
                        "label": "Load",
                        "charts": [{ "chart": { "type": "table" } }]
                    },
                    "meta": { "table": { "type": "table" } },
                    "context": "python",
                    "version": "3.6",
                    "outputs": { "table": tableId },
                    "fid": fid
                };
                if (fileName) {
                    newDataSourceUnit.param.partial_path = [fileName];
                }
            } else {
                var funcDefinition = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(this.type, type);
                newDataSourceUnit = $.extend(true, {}, funcDefinition.defaultFnUnit);
                newDataSourceUnit.fid = fid;
                if (newDataSourceUnit[FUNCTION_NAME] === 'Subflow') {
                    newDataSourceUnit[OUT_DATA] = [tableId];
                    for (var i in newDataSourceUnit.param.functions) {
                        newDataSourceUnit.param.functions[i].fid = Brightics.VA.Core.Utils.IDGenerator.func.id();
                        newDataSourceUnit.param.functions[i][OUT_DATA] = [tableId];
                        newDataSourceUnit.param.functions[i].param['df-names'] = [tableId];
                    }
                }
                if (fileName) {
                    newDataSourceUnit.param.functions[0].param['fs-paths'] = [fileName];
                }
            }
            newDataSourceUnit.parent = function () {
                return _this;
            };
            if (fileLabel) {
                newDataSourceUnit.display.label = fileLabel;
            }
            return newDataSourceUnit;
        },
        newPage: function () {
            return {
                id: Brightics.VA.Core.Utils.IDGenerator.reportPage.id(),
                contents: {}
            }
        },
        newContent: function (options) {
            var type = options.type,
                size = options.size,
                position = options.position,
                contentOptions = options.options,
                dataSourceId = options.dataSourceId;

            var content = {
                id: Brightics.VA.Core.Utils.IDGenerator.reportContent.id(),
                type: type,
                size: {
                    width: (size) ? (size.width) : (720),
                    height: (size) ? (size.height) : (250)
                },
                position: {
                    top: (position) ? (position.top) : (30),
                    left: (position) ? (position.left) : (30),
                    'z-index': (position) ? (position['z-index']) : (100)
                },
                options: contentOptions,
                dataSourceId: dataSourceId
            };

            return content;
        },
        addDataSource: function (dataSource, index) {
            if (typeof index !== 'undefined' && index > -1) {
                this.functions.splice(index, 0, dataSource);
            } else {
                this.functions.push(dataSource);
            }
        },
        addPage: function (page, pageIndex) {
            var pageArray = this.report.pages;
            var pageLength = pageArray.length;

            pageIndex = ((pageIndex !== undefined) && (typeof pageIndex === 'number')) ? ((pageLength < pageIndex) ? (pageLength) : (pageIndex)) : (pageLength);
            pageArray.splice(pageIndex, 0, page);
        },
        addContent: function (content, pageIndex) {
            var pageArray = this.report.pages;
            var pageLength = pageArray.length;

            if (!pageLength) {
                var newPage = this.newPage();
                this.addPage(newPage);
                pageIndex = 0;
            } else {
                pageIndex = ((pageIndex !== undefined) && (typeof pageIndex === 'number')) ? ((pageLength - 1 < pageIndex) ? (pageLength - 1) : (pageIndex)) : (pageLength - 1);
            }

            var contents = pageArray[pageIndex].contents;
            contents[content.id] = content;
        },
        addContentToSpecificPage: function (content, pageId) {
            var pageArray = this.report.pages;
            if (pageId) {
                for (var i in pageArray) {
                    if ((pageArray[i].id === pageId) && pageArray[i].contents) {
                        pageArray[i].contents[content.id] = content;
                        break;
                    }
                }
            }
        },
        getDataSource: function (dataSourceId) {
            var dataSource;
            if (dataSourceId) {
                var functions = this.functions;
                for (var i in functions) {
                    if (functions[i].fid === dataSourceId) {
                        dataSource = functions[i];
                        break;
                    }
                }
            }
            return dataSource;
        },
        getDataSourceIndex: function (dataSourceId) {
            var index;
            var functions = this.functions;
            for (var i in functions) {
                if (functions[i].fid === dataSourceId) {
                    index = i;
                    break;
                }
            }
            return Number(index);
        },
        getDataSources: function () {
            return this.functions;
        },
        getDataSourceUsingParam: function (param) {
            var dataSource;
            var functions = this.functions;
            if (param) {
                if (param.modelId && param.tableId) {
                    for (var i in functions) {
                        let targetDataSource = functions[i];
                        if (targetDataSource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING) {
                            if (targetDataSource.param.modelId === param.modelId && targetDataSource.param.tableId === param.tableId) {
                                dataSource = targetDataSource;
                                break;
                            }
                        }
                    }
                }
                else if (param['fs-paths']) {
                    for (var i in functions) {
                        let targetDataSource = functions[i];
                        if (targetDataSource.func !== Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING && targetDataSource[FUNCTION_NAME] === 'Subflow') {
                            for (var j in targetDataSource.param.functions) {
                                if (targetDataSource.param.functions[j].param['fs-paths'][0] === param['fs-paths']) {
                                    dataSource = targetDataSource;
                                    break;
                                }
                            }
                        }
                        if (dataSource) break;
                    }
                }
            }
            return dataSource;
        },
        getFunction: function (fid) {
            var func;
            var functions = this.functions;
            for (var i in functions) {
                if (functions[i].fid === fid) {
                    func = functions[i];
                    break;
                }
            }
            return func;
        },
        getPage: function (pageId) {
            var page;
            var pages = this.report.pages;
            for (var i in pages) {
                if (pages[i].id === pageId) {
                    page = pages[i];
                    break;
                }
            }
            return page;
        },
        getPageIndex: function (pageId) {
            var index;
            var pages = this.report.pages;
            for (var i in pages) {
                if (pages[i].id === pageId) {
                    index = i;
                    break;
                }
            }
            return Number(index);
        },
        getPages: function () {
            return this.report.pages;
        },
        getPageIdOfContent: function (contentId) {
            var pageId;
            var pages = this.report.pages;
            for (var i in pages) {
                if (pages[i].contents[contentId]) {
                    pageId = pages[i].id;
                    break;
                }
            }
            return pageId;
        },
        getContent: function (contentId) {
            var content;
            var pages = this.report.pages;
            for (var i in pages) {
                if (pages[i].contents[contentId]) {
                    content = pages[i].contents[contentId];
                    break;
                }
            }
            return content;
        },
        getContents: function (pageIndex) {
            return ((pageIndex !== undefined) && (typeof pageIndex === 'number')) ? (this.report.pages[pageIndex].contents) : (this.report.pages);
        },
        getContentsUsingDataSource: function (dataSourceId) {
            var contents = [];
            var pages = this.report.pages;
            for (var i in pages) {
                for (var contentId in pages[i].contents) {
                    if (pages[i].contents[contentId].dataSourceId === dataSourceId) {
                        contents.push(pages[i].contents[contentId]);
                    }
                }
            }
            return contents;
        },
        removeDataSource: function (dataSourceId) {
            var index = -1;
            for (var i in this.functions) {
                var fn = this.functions[i];
                if (fn.fid === dataSourceId) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                var removed = this.functions[index];
                this.functions.splice(index, 1);
                return removed;
            }
        },
        removePage: function (pageId) {
            var pages = this.report.pages;
            var removed;
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].id === pageId) {
                    removed = pages[i];
                    pages.splice(i, 1);
                    break;
                }
            }
            return removed;
        },
        removeContent: function (contentId) {
            var pages = this.report.pages;
            var removed;
            for (var i in pages) {
                if (pages[i].contents[contentId]) {
                    removed = pages[i].contents[contentId];
                    delete pages[i].contents[contentId];
                    break;
                }
            }
            return removed;
        },
        renameDataSource: function (dataSourceId, label) {
            var functions = this.functions;
            for (var i in functions) {
                if (functions[i].fid === dataSourceId) {
                    functions[i].display.label = label;
                    break;
                }
            }
        },
        changeSchedule: function (dataSourceId, scheduleId) {
            var functions = this.functions;
            for (var i in functions) {
                if (functions[i].fid === dataSourceId) {
                    functions[i].param.scheduleId = scheduleId || '';
                    break;
                }
            }
        },
        changeFunc: function (dataSourceId, func) {
            var functions = this.functions;
            for (var i in functions) {
                if (functions[i].fid === dataSourceId) {
                    functions[i].func = func;
                    break;
                }
            }
        }
    };

}).call(this);
