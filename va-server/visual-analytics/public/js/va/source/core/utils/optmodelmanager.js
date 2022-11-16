(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.OptModelManager = {
        isValidOptModel: function (optModel) {
            var isValidObjective = this.isValidObjective(optModel);
            var isValidOptFunctions = this.isValidOptFunctions(optModel);
            return (isValidObjective && isValidOptFunctions);
        },
        isValidObjective: function (optModel) {
            var isValidObjective = false;
            if (optModel && optModel.options && optModel.options.objective) {
                if (optModel.options.objective.fid &&
                    optModel.options.objective.tableName &&
                    optModel.options.objective.row &&
                    optModel.options.objective.column &&
                    optModel.options.objective.sense)
                    isValidObjective = true;
            }
            return isValidObjective;
        },
        isValidOptFunctions: function (optModel) {
            var isValidOptFunctions = false;
            if (optModel && optModel.optFunctions) {
                for (var i = 0; i < optModel.optFunctions.length; i++) {
                    if (optModel.optFunctions[i].optSelected === 'true') {
                        for (var key in optModel.optFunctions[i].optParam) {
                            if (optModel.optFunctions[i].optParam[key].optParamSelected === 'true') {
                                isValidOptFunctions = true;
                            }
                        }
                    }
                }
            }
            return isValidOptFunctions;
        },
        renderOptModels: function (diagramEditorPage) {
            var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
            if (!diagramEditorPage) {
                diagramEditorPage = activeModelEditor.diagramEditorPage;
            }
            if (!diagramEditorPage) return;

            var $paper = diagramEditorPage.$mainControl.find('.brtc-va-editors-diagram-diagrameditorpage-paper');
            $paper.find('.brtc-opt-model-box').remove();

            var contents = activeModelEditor.getEditorInput().getContents();
            var optModels = contents.optModels;
            if (optModels && Object.keys(optModels).length) {
                var functionPositionInfo = {};
                var scale = diagramEditorPage.options.scale;

                var functionElements = diagramEditorPage.graph.getElements();
                for (var i = 0; i < functionElements.length; i++) {
                    let fid = functionElements[i].attributes.fid;
                    var position = $.extend(true, {}, functionElements[i].attributes.position);
                    functionPositionInfo[fid] = position;
                }

                for (var optId in optModels) {
                    var optLabel = optModels[optId].label || "Optimization";
                    var optFunctions = optModels[optId].optFunctions;
                    var top, left, bottom, right;

                    var first = -1;
                    for (var i = 0; i < optFunctions.length; i++) {
                        if (functionPositionInfo[optFunctions[i].fid]) {
                            first = i;
                            break;
                        }
                    }

                    if (first == -1) {
                        // All functions were deleted in this OPT Model.
                        continue;
                    }

                    top = bottom = functionPositionInfo[optFunctions[first].fid].y;
                    left = right = functionPositionInfo[optFunctions[first].fid].x;
                    for (var f = 0; f < optFunctions.length; f++) {
                        let fid = optFunctions[f].fid;
                        if (functionPositionInfo[fid]) {
                            top = Math.min(top, functionPositionInfo[fid].y);
                            bottom = Math.max(bottom, functionPositionInfo[fid].y);
                            left = Math.min(left, functionPositionInfo[fid].x);
                            right = Math.max(right, functionPositionInfo[fid].x);
                        } else {
                            // Some functions were deleted in this OPT Model.
                        }
                    }

                    var boxTop = top * scale;
                    var boxLeft = left * scale + 3;
                    var boxWidth = (Brightics.VA.Env.Diagram.FIGURE_WIDTH + right - left) * scale - 5;
                    var boxHeight = (Brightics.VA.Env.Diagram.FIGURE_HEIGHT + bottom - top) * scale + 7;

                    var isValidOptModel = this.isValidOptModel(optModels[optId]);
                    var borderColor = (isValidOptModel) ? ('#626fdb') : ('#ea3539');
                    var $boundBox = $(`<div class="brtc-opt-model-box" style="
                        position: absolute;
                        display: block;
                        box-sizing: content-box;
                        margin-top: -1px;
                        margin-left: -5px;
                        padding-right: 7px;
                        pointer-events: none;
                        border: 1px solid ${borderColor};' +
                        "></div>`);
                    $paper.append($boundBox);
                    $boundBox.css({ top: boxTop, left: boxLeft, width: boxWidth, height: boxHeight });

                    var $optToolbar = $(`
                        <div class="brtc-opt-model-toolbar" style="
                            position: absolute;
                            left: -1px;
                            top: -20px;
                            padding: 1px 5px 0 5px;
                            border: 1px solid ${borderColor};
                            background: #fafbfc;
                            pointer-events: auto;
                            height: 17px;
                            line-height: 17px;
                            cursor: pointer;
                        ">
                            <div class="brtc-opt-model-label" style="
                                max-width: 187px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 11px;
                                "></div>
                        </div>`);
                    $optToolbar.attr('opt-id', optId);
                    $optToolbar.find('.brtc-opt-model-label').attr('title', optLabel);
                    $optToolbar.find('.brtc-opt-model-label').text(optLabel);
                    $boundBox.append($optToolbar);
                    $optToolbar.click(function () {
                        var optId = $(this).attr('opt-id');
                        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
                        var sideBarManager = activeModelEditor.getSideBarManager();
                        var optSettingSideBar = sideBarManager.getSideBars()['optSetting'];
                        optSettingSideBar.show();
                        optSettingSideBar.createDetailView(optId);
                        optSettingSideBar.render(optId);
                    })
                }
            }
        },
        getOptModels: function (pid, mid) {
            var file = Studio.getResourceManager().getFile(pid, mid);
            var contents = file.getContents();
            if (contents.optModels) {
                var optModels = contents.optModels;
                return Object.values(optModels).sort(function compare(a, b) {
                    if (a['createTime'] < b['createTime']) {
                        return -1;
                    }
                    if (a['createTime'] > b['createTime']) {
                        return 1;
                    }
                    return 0;
                });
            }
            return [];
        },
        getOptModel: function (pid, mid, optId) {
            var file = Studio.getResourceManager().getFile(pid, mid);
            var contents = file.getContents();
            if (contents.optModels && contents.optModels[optId]) {
                var optModels = contents.optModels;
                return $.extend(true, {}, optModels[optId]);
            }
        },
        getTargetOptModelId: function (pid, mid, fid) {
            var file = Studio.getResourceManager().getFile(pid, mid);
            var contents = file.getContents();
            if (contents.optModels) {
                var optModels = contents.optModels;
                for (var id in optModels) {
                    if (optModels[id].optFunctions) {
                        var optFunctions = optModels[id].optFunctions;
                        for (var i = 0; i < optFunctions.length; i++) {
                            if (optFunctions[i].fid === fid) {
                                return id;
                            }
                        }
                    }
                }
            }
            return null;
        },
        createNewOptModelCommand: function (pid, mid, selectedFids, options) {
            var file = Studio.getResourceManager().getFile(pid, mid);
            var contents = file.getContents();
            var functions = [];
            var links = [];

            // Selected Functions
            var selectedFnUnitObject = {};
            for (var i = 0; i < selectedFids.length; i++) {
                var fid = selectedFids[i];
                var fnUnit = $.extend(true, {}, contents.getFnUnitById(fid));
                if (Object.keys(fnUnit).length === 0) {
                    continue;
                }
                selectedFnUnitObject[fid] = fnUnit;
                functions.push(fnUnit);
            }

            // Selected Links
            for (var i = 0; i < contents.links.length; i++) {
                var sourceFid = contents.links[i].sourceFid;
                var targetFid = contents.links[i].targetFid;
                if (selectedFnUnitObject[sourceFid] && selectedFnUnitObject[targetFid]) {
                    var link = $.extend(true, {}, contents.links[i]);
                    links.push(link);
                }
            }

            // Create New Opt Model
            var optModel = this.newOptModel(functions, links, options);

            // Execute New Opt Model Command
            return new Brightics.VA.Core.Editors.Diagram.Commands.NewOptModelCommand(this, {
                pid: pid,
                mid: mid,
                optModel: optModel
            });
        },
        createSetOptModelCommand: function (pid, mid, optId, optModel, target) {
            return new Brightics.VA.Core.Editors.Diagram.Commands.SetOptModelCommand(this, {
                pid: pid,
                mid: mid,
                optId: optId,
                optModel: optModel,
                target: target
            });
        },
        createRemoveOptModelCommand: function (pid, mid, optId) {
            return new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOptModelCommand(this, {
                pid: pid,
                mid: mid,
                optId: optId
            });
        },
        newOptModel: function (functions, links, options) {
            var optFunctions = $.extend(true, [], functions);
            options = options || {};

            var mid = Brightics.VA.Core.Utils.IDGenerator.model.id();
            var fids = [];
            for (var i = 0; i < optFunctions.length; i++) {
                fids.push(optFunctions[i].fid);
                var functionName = optFunctions[i].name;

                delete optFunctions[i].display;
                delete optFunctions[i].func;
                delete optFunctions[i].name;
                delete optFunctions[i].inData;
                delete optFunctions[i].outData;
                delete optFunctions[i].param;
                delete optFunctions[i]['persist-mode'];

                var defaultSettings = Brightics.OptFunctions[functionName];
                if (defaultSettings) {
                    optFunctions[i]['optSelected'] = defaultSettings['optSelected'];
                    optFunctions[i]['optParam'] = $.extend(true, {}, defaultSettings['optParam']);
                } else {
                    optFunctions[i]['optSelected'] = "none";
                    optFunctions[i]['optParam'] = {};
                }
            }

            var getCurrentTime = function () {
                var time = new Date();
                var year = time.getFullYear();
                var month = (time.getMonth() < 9) ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1);
                var date = (time.getDate() < 9) ? ('0' + time.getDate()) : (time.getDate());
                var hour = time.getHours();
                var minutes = time.getMinutes();
                var seconds = time.getSeconds();
                return [year, month, date, hour, minutes, seconds].join('');
            }

            return {
                "optId": mid,
                "hash": fids.sort().join('_'),
                "label": options.label || "OPT " + getCurrentTime(),
                "description": "description", //"<p><br /></p>",
                "createTime": new Date().getTime(),
                "creator": Brightics.VA.Env.Session.userId,
                "updateTime": new Date().getTime(),
                "updater": Brightics.VA.Env.Session.userId,
                "options": {
                    "activated": "true",
                    "useSavedModel": "false",
                    "method": "SOGA",
                    "maxIterations": "100",
                    "maxEvaluations": "20",
                    "constraints": [
                        // {
                        //     "fid": "fff",
                        //     "tableName": "asdssdfsdsbbbbb",
                        //     "row": "1",
                        //     "column": "2",
                        //     "type": "Equality",
                        //     "target": "0"
                        // }
                    ],
                    "objective": {
                        "fid": "",
                        "tableName": "",
                        "row": "1",
                        "column": "",
                        "sense": "maximize"
                    }
                },
                "optFunctions": optFunctions
            };
        },
        addOptModel: function (pid, mid, optModel) {
            var file = Studio.getResourceManager().getFile(pid, mid);
            var contents = file.getContents();
            if (!contents['optModels']) {
                contents['optModels'] = {};
            }
            contents['optModels'][optModel['optId']] = $.extend(true, {}, optModel);
        },
        setOptModel: function (pid, mid, optId, optModel) {
            var file = Studio.getResourceManager().getFile(pid, mid);
            var contents = file.getContents();

            if (contents['optModels'] && contents['optModels'][optId]) {
                var target = contents['optModels'][optId];
                for (var key in optModel) {
                    if (optModel[key].constructor == Array) {
                        target[key] = $.extend(true, [], optModel[key]);
                    }
                    else if (optModel[key].constructor == Object) {
                        target[key] = $.extend(true, {}, optModel[key]);
                    }
                    else {
                        target[key] = optModel[key];
                    }
                }
            }
        },
        removeOptModel: function (pid, mid, optId) {
            var file = Studio.getResourceManager().getFile(pid, mid);
            var contents = file.getContents();
            if (contents['optModels'] && contents['optModels'][optId]) {
                var ret = contents['optModels'][optId];
                delete contents['optModels'][optId];
                return ret;
            }
        },
        buildOptRunnable: function (orgRunnable) {
            /**
             * optRunnbale = {
             *    main: string
             *    models: {
             *       "modelid": {
             *           variables: {},
             *           functions: [],
             *           links: [],
             *           optModels: {
             *               "optid": {
             *                  optId: string,
             *                  hash: string,
             *                  label: string,
             *                  options: {
             *                      activated: "true,false,none",
             *                      method: string,
             *                      maxEvaluation: string,
             *                      objective: {
             *                         fid: string, tableName: string, 
             *                         row: '', column: '', sesnse: ''
             *                      },
             *                  },
             *                  optFunctions: [{ fid:'', optSelected:'', optParam:'' }],
             *                  functions: [],
             *                  links: [],
             *                  optSelected: {
             *                      "functionid": {
             *                          optParam: { 
             *                              "paramKey": {min: string, max: string, value: string} 
             *                          }
             *                      }
             *                  }
             *               }
             *           }
             *       }
             *    }
             *    version: number
             * }
             */

            var isRunnableOptModel = function (optModel, functionsObject) {
                var isRunnable = true;
                if (optModel.options.activated !== "true") {
                    isRunnable = false;
                }
                if (isRunnable) {
                    var optFunctions = optModel.optFunctions;
                    for (var i = 0; i < optFunctions.length; i++) {
                        if (!functionsObject[optFunctions[i].fid]) {
                            isRunnable = false;
                            break;
                        }
                    }
                }
                return isRunnable;
            };

            var getFunctionsObject = function (model) {
                var functionsObject = {};
                for (var i = 0; i < model.functions.length; i++) {
                    functionsObject[model.functions[i].fid] = model.functions[i];
                }
                return functionsObject;
            };

            var getRunnableOptModel = function (model) {
                var ret = {};
                var functionsObject = getFunctionsObject(model);
                var optModels = model.optModels;
                for (var optMid in optModels) {
                    if (optModels.hasOwnProperty(optMid)) {
                        var optModel = optModels[optMid];
                        if (isRunnableOptModel(optModel, functionsObject)) {
                            ret[optModel.optId] = $.extend(true, {}, optModel);
                        }
                    }
                }
                return convertOptFunctions(ret, functionsObject, model.links);
            };

            var convertOptFunctions = function (optModels, functionsObject, links) {
                for (var optMid in optModels) {
                    if (optModels.hasOwnProperty(optMid)) {
                        var optModel = optModels[optMid];
                        generateOptSelected(optModel);
                        generateFunctions(optModel, functionsObject);
                        generateLinks(optModel, links);
                        delete optModel.optFunctions;
                    }
                }
                return optModels;
            };

            var generateOptSelected = function (optModel) {
                optModel.optSelected = {};
                var optFunctions = optModel.optFunctions;
                for (var i = 0; i < optFunctions.length; i++) {
                    var fid = optFunctions[i].fid;
                    if (optFunctions[i].optSelected === "true") {
                        optModel.optSelected[fid] = {
                            "optParam": {}
                        };

                        for (var key in optFunctions[i].optParam) {
                            var optParam = optFunctions[i].optParam[key];
                            if (optParam.optParamSelected === "true") {
                                optModel.optSelected[fid].optParam[key]
                                    = $.extend(true, {}, optParam);
                                delete optModel.optSelected[fid].optParam[key].optParamSelected;
                            }
                        }
                    }
                }
            };

            var generateFunctions = function (optModel, functionsObject) {
                optModel.functions = [];
                var optFunctions = optModel.optFunctions;
                for (var i = 0; i < optFunctions.length; i++) {
                    var fid = optFunctions[i].fid;
                    optModel.functions.push($.extend(true, {}, functionsObject[fid]));
                }
            };

            var generateLinks = function (optModel, links) {
                optModel.links = [];
                for (var i = 0; i < links.length; i++) {
                    var sourceFid = links[i].sourceFid;
                    var targetFid = links[i].targetFid;

                    if (optModel.hash.indexOf(sourceFid) > -1
                        && optModel.hash.indexOf(targetFid) > -1) {
                        optModel.links.push($.extend(true, {}, links[i]));
                    }
                }
            };

            var adjustFunctions = function (model, optModels) {
                var newFunctions = [];
                for (var optMid in optModels) {
                    newFunctions.push({
                        "fid": optModels[optMid].optId,
                        "label": optModels[optMid].label,
                        "name": "Opt",
                        "param": {
                            "mid": optModels[optMid].optId,
                        }
                    });
                }

                for (var i = 0; i < newFunctions.length; i++) {
                    model.functions.push(newFunctions[i]);
                }
            };

            var adjustLinks = function (model, optModels) {
                var orgLinks = $.extend(true, [], model.links);
                var links = model.links;
                var functionsObject = getFunctionsObject(model);
                var deleteLinkIds = {};
                var isCreated = {};
                var isFirstFunction = {};

                for (var optMid in optModels) {
                    var optModel = optModels[optMid];

                    for (var i = 0; i < orgLinks.length; i++) {
                        var sourceFid = orgLinks[i].sourceFid;
                        var targetFid = orgLinks[i].targetFid;
                        isFirstFunction[targetFid] = false;

                        if (!(optModel.hash.indexOf(sourceFid) > -1)
                            && optModel.hash.indexOf(targetFid) > -1) {
                            deleteLinkIds[orgLinks[i].kid] = true;

                            if (!isCreated[sourceFid + '_' + optMid]) {
                                isCreated[sourceFid + '_' + optMid] = true;
                                links.push({
                                    'sourceFid': sourceFid,
                                    'targetFid': optMid
                                });
                            }
                            links.push({
                                'sourceFid': optMid,
                                'targetFid': targetFid
                            });
                        }
                    }

                    for (var fid in functionsObject) {
                        if (isFirstFunction[fid] !== false && optModel.hash.indexOf(fid) > -1) {
                            links.push({
                                'sourceFid': optMid,
                                'targetFid': fid
                            });
                        }
                    }
                }

                for (var i = links.length - 1; i >= 0; i--) {
                    if (deleteLinkIds[links[i].kid]) {
                        links.splice(i, 1);
                    }
                }
            }

            var runnable = $.extend(true, {}, orgRunnable);
            var models = runnable.models;
            for (var mid in models) {
                if (models.hasOwnProperty(mid)) {
                    var model = models[mid];
                    var optModels = getRunnableOptModel(model);
                    adjustLinks(model, optModels);
                    adjustFunctions(model, optModels);
                    model.optModels = $.extend(true, {}, optModels);
                }
            }
            return runnable;
        }
    };
}).call(this);
