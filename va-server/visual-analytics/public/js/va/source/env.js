/**
 * Created by daewon.park on 2016-01-27.
 */

/* global _, FUNCTION_NAME, OUT_DATA, SOURCE_FID, TARGET_FID */
(function () {
    'use strict';

    const root = this;
    const MODULE = window.__module__;

    root.Brightics = root.Brightics || {};
    const Brightics = root.Brightics;
    const FnUnitUtils = brtc_require('FnUnitUtils');
    const ENV = brtc_require('ENV');
    const locale = brtc_require('locale');
    const StorageUtils = brtc_require('StorageUtils');

    $.extend(true, root.Brightics, {
        VA: {
            Core: {
                Interface: {
                    Clazz: {},
                    Label: {},
                    Editor: {},
                    ModelLayoutManager: {},
                    Toolbar: {},
                    SideBarManager: {},
                    RightSideBarAdapter: {},
                    LeftSideBarAdapter: {},
                    Validator: {},
                    Launcher: {},
                    LauncherDialog: {},
                    Functions: {},
                    WidgetUtils: {},
                    DefaultModel: {},
                    ProjectContextMenuList: {},
                    Clipboard: {},
                    RunnableFactory: {},
                    AddonFunctionUtil: {}
                },
                Components: {
                    Base: {}
                },
                Controls: {},
                Default: {},
                Dialogs: {
                    FunctionProperties: {},
                    RefineSteps: {}
                },
                Editors: {
                    Diagram: {
                        Commands: {
                            ControlEditor: {}
                        }
                    },
                    Sheet: {
                        Controls: {
                            Optimization: {}
                        },
                        Commands: {},
                        Panels: {
                            Properties: {}
                        }
                    }
                },
                Functions: {
                    Library: {}
                },
                Shapes: {},
                Tools: {
                    MenuBar: {},
                    Adapter: {},
                    Manager: {},
                    ModelMigrator: {
                        Executor: {},
                        RuleList: {}
                    }
                },
                Utils: {},
                Views: {
                    Pages: {}
                },
                Widget: {
                    Controls: {}
                },
                Wizards: {
                    Pages: {}
                },
                Validator: {},
                AddonFunctionManager: {}
            },
            SettingStorage: StorageUtils,
            Implementation: {},
            Window: {
                Utils: {},
            },
            Controls: MODULE.Controls,
            Dao: MODULE.Dao,
            DataStructures: MODULE.DataStructures,
            Default: {},
            Dialogs: {},
            Setting: {
                Registry: {},
                Implement: {},
            },    //FIXME: ENV.Setting으로 들어가야하는지 확인필요.
            Env: {
                Session: {},
                Recommend: {}
            },
            Utils: {},
            Views: {},
            Workspace: {},
            Log: {},
            EventEmitter: MODULE.EventEmitter,
            ClassUtils: MODULE.ClassUtils,
            Vo: MODULE.Vo
        },
        Admin: {},
        COMMUNITY: {}
    });

    root.Brightics.VA.Core.Utils.IDGenerator = MODULE.IDGenerator;

    root.Brightics.VA.Env.Theme = 'office';

    root.Brightics.VA.Env.CoreVersion = ENV.CORE_VERSION;

    root.Brightics.VA.Env.Diagram = {
        PAPER_MARGIN_TOP: 20,
        PAPER_MARGIN_LEFT: 20,
        FIGURE_WIDTH: 195,
        FIGURE_HEIGHT: 60,
        GAP_WIDTH: 55,
        GAP_HEIGHT: 40
    };

    root.Brightics.VA.Env.DiagramInit = {
        PAPER_MARGIN_TOP: 20,
        PAPER_MARGIN_LEFT: 20,
        FIGURE_WIDTH: 195,
        FIGURE_HEIGHT: 60,
        GAP_WIDTH: 55,
        GAP_HEIGHT: 20
    };

    root.Brightics.VA.Env.Multiplicity = {
        Zero: '0',
        geZero: '0..*',
        One: '1',
        geOne: '1..*'
    };

    root.Brightics.VA.Env.Recommend.NextChart = {
        load: ['table', 'scatter'],
        associationRule: ['table', 'network'],
        bigDataScatter: ['scatter', 'table'],
        bigDataLine: ['line', 'table'],
        bigDataBoxPlot: ['boxplot', 'table'],
        bigDataColumn: ['column', 'table'],
        bigDataBar: ['bar', 'table']
    };

    root.Brightics.VA.Env.Recommend.Next = {
        data: {
            default: ['load', 'createTable', 'brightics.function.io$load13889', 'brightics.function.io$read_csv97059'],
            mdReplaceNumber: ['mdReplaceString', 'imputeNumberTypeFillColumn', 'numericalVariableDerivation'],
            mdReplaceString: ['mdReplaceNumber', 'imputeStringTypeFillColumn'],
            numericalVariableDerivation: ['conditionalUpdate', 'conditionalDerivation'],
            conditionalDerivation: ['conditionalUpdate'],
            conditionFilter: ['minmaxFilter', 'lengthFilter', 'stringFilter'],
            lengthFilter: ['stringFilter', 'conditionFilter', 'minmaxFilter'],
            minmaxFilter: ['conditionFilter', 'stringFilter', 'lengthFilter'],
            stringFilter: ['lengthFilter', 'conditionFilter', 'minmaxFilter'],
            imputeNumberTypeFillColumn: ['mdReplaceNumber', 'numericalVariableDerivation'],
            imputeRemoveLine: ['mdReplaceNumber', 'mdReplaceString'],
            imputeStringTypeFillColumn: ['mdReplaceString'],
            join: ['imputeRemoveLine', 'imputeNumberTypeFillColumn', 'imputeStringTypeFillColumn'],
            changeColumnName: ['capitalizeColName'], // 'reorganizeTable'
            frequency: ['join'],
            frequencyMat: ['join'],
            statisticSummary: ['join'],
            capitalizeColName: ['changeColumnName'], // 'reorganizeTable'
            linearRegressionTrain: ['linearRegressionPredict'],
            linearRegressionPredict: ['regressionEvaluation'],
            logisticRegressionTrain: ['logisticRegressionPredict'],
            logisticRegressionPredict: ['binaryClassEvaluation'],
            movingAverage: ['ewma'],
            pivot: ['imputeRemoveLine', 'imputeNumberTypeFillColumn', 'imputeStringTypeFillColumn'],
            hierarchicalClustering: ['hierarchicalClusteringPostProcess'],
            timeSeriesTranspose: ['timeSeriesDistance'],
            quantileDiscretizer: ['typeCast'],
            reorganizeTable: ['changeColumnName', 'capitalizeColName']
        },
        realtime: {
            default: ['streamingRead']
        },

        etl: {
            default: ['erdTSum', 'fabData', 'ept']
        },

        deeplearning: {
            default: ['dlLoad', 'conv2D', 'maxPooling2D']
        },


        getList: function (func, type) {
            return this[type || 'data'][func] || [];
        }
    };

    root.Brightics.VA.Env.Tags = {
        // data: ['Trend', 'Timeseries', 'Transform', 'Sort', 'Preprocessing', 'Add Column', 'Filter', 'Remove', 'Missing Value', 'Statistics', 'Prescriptive'],
        data: [locale.func.preprocessing,
            locale.func.transform,
            locale.func.statistics,
            locale.func.train,
            locale.func.predict,
            locale.func.modelling,
            locale.func.classification,
            locale.func.regression,
            locale.func.clustering,
            locale.func.textAnalytics
            ],
        realtime: ['I/O', 'Clustering', 'Filter', 'Preprocessing', 'Prescriptive', 'Trend', 'Transform'],
        etl: []
    };

    root.Brightics.VA.Default.model = {
        addProblems: function (problems) {
            if (problems && this.problemList.indexOf(problems) < 0) this.problemList = this.problemList.concat(problems);
        },
        getProblemsByFid: function (fid) {
            var problems = [];
            for (var i in this.problemList) {
                if (this.problemList[i] && this.problemList[i].fid === fid) {
                    problems.push(this.problemList[i]);
                }
            }
            return problems;
        },
        getProblemsByMid: function (mid) {
            var problems = [];
            for (var i in this.problemList) {
                if (this.problemList[i] && this.problemList[i].mid === mid) {
                    problems.push(this.problemList[i]);
                }
            }
            return problems;
        },
        newFnUnit: function (type) {
            var funcDefinition = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(this.type, type);
            var newFnUnitOption = {
                fid: Brightics.VA.Core.Utils.IDGenerator.func.id()
            };

            if (type === 'ifElse') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        functions: [{
                            fid: Brightics.VA.Core.Utils.IDGenerator.func.id()
                        }, {
                            fid: Brightics.VA.Core.Utils.IDGenerator.func.id()
                        }]
                    }
                };
            } else if (type === 'outData') {
                var unloadFid = Brightics.VA.Core.Utils.IDGenerator.func.id();
                var exportFid = Brightics.VA.Core.Utils.IDGenerator.func.id();
                var filePathId = '/brtc/repo/tmp/' + Brightics.VA.Core.Utils.IDGenerator.file.id();
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        functions: [{
                            fid: unloadFid,
                            param: {
                                'fs-paths': [filePathId]
                            }
                        }, {
                            fid: exportFid,
                            param: {
                                'input-path': filePathId,
                                'output-path': filePathId + '.csv'
                            }
                        }],
                        links: [{
                            'kid': Brightics.VA.Core.Utils.IDGenerator.link.id(),
                            'sourceFid': unloadFid,
                            'targetFid': exportFid
                        }]
                    }
                };
            } else if (type === 'refine') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        functions: [{
                            fid: Brightics.VA.Core.Utils.IDGenerator.func.id()
                        }]
                    }
                };
            } else if (type === 'dbReader') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        functions: [{
                            fid: Brightics.VA.Core.Utils.IDGenerator.func.id()
                        }]
                    }
                };
            } else if (type === 'load') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        functions: [{
                            fid: Brightics.VA.Core.Utils.IDGenerator.func.id()
                        }]
                    }
                };
            } else if (funcDefinition.defaultFnUnit[FUNCTION_NAME] === 'Subflow') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        functions: [{
                            fid: Brightics.VA.Core.Utils.IDGenerator.func.id()
                        }]
                    }
                };
            } else if (type === 'if') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        'if': $.extend(true,
                            funcDefinition.defaultFnUnit.param.if,
                            {mid: Brightics.VA.Core.Utils.IDGenerator.model.id()}
                        ),
                        'elseif': [],
                        'else': $.extend(true,
                            funcDefinition.defaultFnUnit.param.else,
                            {mid: Brightics.VA.Core.Utils.IDGenerator.model.id()}
                        )
                    }
                };
            } else if (type === 'forLoop') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        mid: Brightics.VA.Core.Utils.IDGenerator.model.id(),
                        'type': 'count',
                        'prop': {
                            'start': '${=}',
                            'end': '${=}',
                            'index-variable': ''
                        }
                    }
                };
            } else if (type === 'whileLoop') {
                newFnUnitOption = {
                    fid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
                    param: {
                        mid: Brightics.VA.Core.Utils.IDGenerator.model.id(),
                        'type': 'while',
                        'prop': {
                            'expression': '${=}',
                            'index-variable': ''
                        }
                    }
                };
            }

            if (funcDefinition.defaultFnUnit.outputs || funcDefinition.defaultFnUnit.outData) {
                var outData = FnUnitUtils.createOutData(this.type, type);
                $.extend(newFnUnitOption, outData);
                // for (var i = 0; i < funcDefinition['out-range'].min; i++) {
                //     newFnUnitOption[OUT_DATA] = newFnUnitOption[OUT_DATA] || [];
                //     newFnUnitOption[OUT_DATA].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
                // }

                if (type === 'refine') {
                    newFnUnitOption.param.functions[0][OUT_DATA] = newFnUnitOption[OUT_DATA];
                    newFnUnitOption.param.entries = [newFnUnitOption.param.functions[0].fid];
                } else if (type === 'dbReader') {
                    newFnUnitOption.param.functions[0][OUT_DATA] = newFnUnitOption[OUT_DATA];
                    newFnUnitOption.param.functions[0].param = {'df-names': [newFnUnitOption[OUT_DATA][0]]};
                } else if (type === 'load') {
                    newFnUnitOption.param.functions[0][OUT_DATA] = newFnUnitOption[OUT_DATA];
                    newFnUnitOption.param.functions[0].param = {'df-names': [newFnUnitOption[OUT_DATA][0]]};
                    newFnUnitOption.param.entries = [newFnUnitOption.param.functions[0].fid];
                } else if (funcDefinition.defaultFnUnit[FUNCTION_NAME] === 'Subflow') {
                    newFnUnitOption.param.functions[0][OUT_DATA] = newFnUnitOption[OUT_DATA];
                    newFnUnitOption.param.entries = [newFnUnitOption.param.functions[0].fid];
                }
            }

            return $.extend(true, {
                'persist-mode': 'auto'
            }, funcDefinition.defaultFnUnit, newFnUnitOption);
        },
        addFnUnit: function (fnUnit, index) {
            var _this = this;
            fnUnit.parent = function () {
                return _this;
            };

            if (typeof index !== 'undefined' && index > -1) {
                _this.functions.splice(index, 0, fnUnit);
            } else {
                _this.functions.push(fnUnit);
            }
        },
        removeFnUnit: function (fnUnitId) {
            var index = -1;
            for (var i in this.functions) {
                var fnUnit = this.functions[i];
                if (fnUnit.fid == fnUnitId) {
                    index = i;
                    delete fnUnit.parent;
                    break;
                }
            }
            if (index > -1) {
                var removed = this.functions[index];
                this.functions.splice(index, 1);
                return removed;
            }
        },
        getFnUnitById: function (fnUnitId) {
            for (var i in this.functions) {
                var fnUnit = this.functions[i];
                if (fnUnit.fid == fnUnitId) {
                    return fnUnit;
                }
            }
        },

        //메세지 처리 시 서브플로우의 상위 function 이름까지 조합하여 return
        getFnUnitNameById: function (fnUnitId, functions) {
            var functionHierarchy = [];
            var functions = functions || this.functions;
            for (var i in functions) {
                var fnUnit = functions[i];

                if (fnUnit.param && fnUnit.param.functions) {
                    var subFunc = this.getFnUnitNameById(fnUnitId, fnUnit.param.functions);
                    if (subFunc) {
                        return fnUnit.func + '.' + subFunc;
                    }
                }
                if (fnUnit.fid == fnUnitId) {
                    return fnUnit.func;
                }
            }
        },
        existsFnUnit: function (fnUnitId) {
            for (var i in this.functions) {
                var fnUnit = this.functions[i];
                if (fnUnit.fid == fnUnitId) {
                    return fnUnit;
                }

                if (fnUnit[FUNCTION_NAME] == 'Subflow') {
                    for (var j in fnUnit.param.functions) {
                        if (fnUnit.param.functions[j].fid == fnUnitId) {
                            return fnUnit;
                        }
                    }
                }
            }
        },
        getFnUnitByOutTable: function (table) {
            for (var i in this.functions) {
                var fnUnit = this.functions[i];
                var outTable = FnUnitUtils.getOutTable(fnUnit);
                // if ($.inArray(table, fnUnit[OUT_DATA]) > -1) {
                if ($.inArray(table, outTable) > -1) {
                    return fnUnit;
                }
            }
        },
        getFnUnitByOutData: function (table) {
            for (var i in this.functions) {
                var fnUnit = this.functions[i];
                var outData = FnUnitUtils.getOutData(fnUnit);
                // if ($.inArray(table, fnUnit[OUT_DATA]) > -1) {
                if ($.inArray(table, outData) > -1) {
                    return fnUnit;
                }
            }
        },
        getLinkUnitById: function (kid) {
            for (var i in this.links) {
                var linkUnit = this.links[i];
                if (linkUnit.kid == kid) {
                    return linkUnit;
                }
            }
        },
        getRoots: function (fnUnitId) {
            var roots = [];
            var previous = this.getPrevious(fnUnitId);
            if (previous.length == 0) {
                roots.push(fnUnitId);
            } else {
                for (const previou of previous) {
                    roots = roots.concat(this.getRoots(previou));
                }
            }
            return roots;
        },
        getParents: function (fnUnitId) {
            var parents = [];
            for (var i in this.links) {
                var link = this.links[i];
                if (link[TARGET_FID] == fnUnitId) {
                    parents.push(link[SOURCE_FID]);
                    parents = parents.concat(this.getParents(link[SOURCE_FID]));
                }
            }
            return parents;
        },
        getPrevious: function (fnUnitId) {
            var prev = [];
            for (var i in this.links) {
                var link = this.links[i];
                if (link[TARGET_FID] == fnUnitId) {
                    prev.push(link[SOURCE_FID]);
                }
            }
            return prev;
        },
        getPreFnUnitByCondition: function (fnUnitId, condition) {
            var previous = this.getPrevious(fnUnitId);
            for (const previou of previous) {
                var fnUnit = this.getFnUnitById(previou);
                if (condition(fnUnit)) {
                    return fnUnit;
                }
            }
        },
        getNext: function (fnUnitId) {
            var next = [];
            for (var i in this.links) {
                var link = this.links[i];
                if (link[SOURCE_FID] == fnUnitId) {
                    next.push(link[TARGET_FID]);
                }
            }
            return next;
        },
        getLeafs: function () {
            var leafs = [];
            for (var i in this.functions) {
                var fnUnit = this.functions[i];
                if (this.getNext(fnUnit.fid).length === 0) {
                    leafs.push(fnUnit.fid);
                }
            }
            return leafs;
        },
        getConnectedLinkUnits: function (fnUnitId) {
            var links = [];
            for (var i in this.links) {
                var link = this.links[i];
                if (link[SOURCE_FID] == fnUnitId || link[TARGET_FID] == fnUnitId) {
                    links.push(link);
                }
            }
            return links;
        },
        getParamValue: function (fid, key) {
            return this.getFnUnitById(fid).param[key];
        },
        adjustLinks: function () {
            var i, fids = [];
            for (i in this.functions) {
                if (this.functions[i]) {
                    fids.push(this.functions[i].fid);
                }
            }

            var unlinks = [];
            for (i in this.links) {
                var link = this.links[i];
                if (fids.indexOf(link[SOURCE_FID] || link['source-fid']) < 0 || fids.indexOf(link[TARGET_FID] || link['target-fid']) < 0) {
                    unlinks.push(link);
                }
            }
            for (const unlink of unlinks) {
                this.links.splice(this.links.indexOf(unlink), 1);
            }
        },
        getAllPreviousFnUnitIds: function (fid) {
            var previousFnUnitIds = this.getPrevious(fid);
            var _this = this;
            return _.unique(previousFnUnitIds.reduce(function (acc, pFid) {
                var fnUnit = _this.getFnUnitById(pFid);
                if (Brightics.VA.Core.Utils.NestedFlowUtils.isProcessFunction(fnUnit)) {
                    var fids = _this.getAllPreviousFnUnitIds(pFid);
                    return acc.concat(fids);
                } else {
                    return acc.concat(pFid);
                }
            }, []));
        },
        getAllNextFnUnitIds: function (fid) {
            var nextFnUnitIds = this.getNext(fid);
            var _this = this;
            return _.unique(nextFnUnitIds.reduce(function (acc, nFid) {
                var fnUnit = _this.getFnUnitById(nFid);
                if (Brightics.VA.Core.Utils.NestedFlowUtils.isProcessFunction(fnUnit)) {
                    var fids = _this.getAllNextFnUnitIds(nFid);
                    return acc.concat(fids);
                } else {
                    return acc.concat(nFid);
                }
            }, []));
        },
        getAllPreviousFnUnits: function (fid) {
            var _this = this;
            return this.getAllPreviousFnUnitIds(fid).map(function (_fid) {
                return _this.getFnUnitById(_fid);
            });
        },
        getAllNextFnUnits: function (fid) {
            var _this = this;
            return this.getAllNextFnUnitIds(fid).map(function (_fid) {
                return _this.getFnUnitById(_fid);
            });
        },
        getLinkSourceFnUnits: function (fid) {
            var _this = this;
            var fnUnit = this.getFnUnitById(fid);
            if (Brightics.VA.Core.Utils.NestedFlowUtils.isProcessFunction(fnUnit)) {
                var prvFids = this.getPrevious(fid);
                return _.unique(prvFids.reduce(function (acc, nFid) {
                    return acc.concat(_this.getLinkSourceFnUnits(nFid));
                }, [fnUnit]), 'fid');
            } else {
                return [fnUnit];
            }
        },
        getLinkTargetFnUnits: function (fid) {
            var _this = this;
            var fnUnit = this.getFnUnitById(fid);
            if (Brightics.VA.Core.Utils.NestedFlowUtils.isProcessFunction(fnUnit)) {
                var nextFids = this.getNext(fid);
                return _.unique(nextFids.reduce(function (acc, nFid) {
                    return acc.concat(_this.getLinkTargetFnUnits(nFid));
                }, [fnUnit]), 'fid');
            } else {
                return [fnUnit];
            }
        }
    };

    root.Brightics.VA.Default.analyticsModel = {
        type: 'data',
        sheets: [],
        param: {},
        functions: [],
        links: [],
        preferences: {},
        problemList: [],
        report: {
            title: 'Report',
            data: []
        },
        inVariableList: function (fid) {
            return _.findIndex(this.variableRef, function (ref) {
                return ref.fid === fid;
            });
        },
        getVariable: function (fid, paramKey) {
            var index = this.inVariableList(fid);
            if (index > -1) {
                return this.variableRef[index].param[paramKey];
            }
        },
        getVariables: function (fid) {
            var index = this.inVariableList(fid);
            if (index > -1) {
                return this.variableRef[index].param;
            }
        },
        getParameters: function () {
            return this.param;
        },
        getParameter: function (key) {
            return this.param[key];
        },
        setParameter: function (key, val) {
            this.param[key] = val;
        },
        addVariableDef: function (name, variable) {
            this.variables[name] = $.extend({}, variable);
        },
        removeVariableDef: function (name) {
            delete this.variables[name];
        },
        setVariableDef: function (name, variable) {
            if (this.variables[name]) this.variables[name] = $.extend({}, variable);
        },
        addVariable: function (fid, paramKey, variable) {
            var index = this.inVariableList(fid);
            if (index > -1) {
                this.variableRef[index].param[paramKey] = variable;
            } else {
                var item = {
                    fid: fid,
                    param: {}
                };
                item.param[paramKey] = variable;
                this.variableRef.push(item);
            }
        },
        setVariable: function (fid, paramKey, variable) {
            var index = this.inVariableList(fid);
            if (index > -1 && this.variableRef[index].param[paramKey]) {
                this.variableRef[index].param[paramKey] = variable;
            }
        },
        removeVariable: function (fid, paramKey) {
            var index = this.inVariableList(fid);
            if (index > -1) {
                delete this.variableRef[index].param[paramKey];
                if (Object.keys(this.variableRef[index].param).length === 0) {
                    this.variableRef.splice(index, 1);
                }
            }
        }
    };

    root.Brightics.VA.Utils.CookieUtil = {
        setCookie: function (cname, cvalue, exdays) {
            var expires = '';
            if (exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                expires = "expires=" + d.toUTCString();
            }
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },


        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return undefined;
        }
    };

    root.Brightics.VA.Env.SQLFunctions = [
        'ROUND()', 'MAX()', 'MIN()', 'SUM()', 'AVG()', 'OVER()', //Related to NUMBER
        'NVL()', 'CONCAT()', 'LPAD()', 'LTRIM()', 'RPAD()', 'RTRIM()', 'SUBSTR()', 'SUBSTRING()', //Related to STRING
        'FROM_UNIXTIME()', 'YEAR()', 'MONTH()', 'WEEKOFYEAR()' //Related to DATE;
    ];

    root.Brightics.locale = locale;

    root.Brightics.VA.Env.PersistFalseFunctions = [
        //TODO 추후 재설계후 적용해야함. 2017.06.01 PVR 제외
        // 'Filter',
        // 'StringFilter',
        // 'Remove',
        // 'ReplaceNumeric',
        // 'ReplaceString',
        // 'AddColumn',
        // 'AddFunctionColumn',
        // 'AddStringLength',
        // 'Capitalize',
        // 'CapitalizeColumnName',
        // 'ChangeColumnName',
        // 'CompareDateTime',
        // 'DateTimeFormatter',
        // 'DecomposeDateTime',
        // 'ImputeRemoveLine',
        // 'ImputeStringTypeFillColumn',
        // 'LengthFilter',
        // 'SelectColumn',
        // 'ShiftDateTime',
        // 'StringSplit',
        // 'Trim',
        // 'TypeCast'
    ]

}).call(this);