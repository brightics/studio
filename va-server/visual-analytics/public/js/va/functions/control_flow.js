(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.flow = {
        "category": "control",
        "defaultFnUnit": {
            "func": "flow",
            "name": "Flow",
            "label": {
                "en": "Flow", 
                "ko": "플로우"
            },
            "inData": [],
            "outData": [],
            "param": {
                "mid": "",
                "versionId": "",
                "variables": {}
            },
            "display": {
                "label": "Flow",
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
            "en": "This function calls the workflow model.",
            "ko": "워크플로우 모델을 호출합니다."
        },
        "tags": {
            "en": [
                "sub"
            ],
            "ko": [
            ]
        },
        "mandatory": [
            "mid"
        ],
        "in-range": {
            "min": 1,
            "max": 10
        },
        "out-range": {
            "min": 0,
            "max": 10
        }
    };
    
}).call(this);
/**************************************************************************
 *                           Properties Panel                              
 *************************************************************************/
/**
 * Created by SDS on 2018-03-08.
 */

/* global _, Studio, brtc_require, IN_DATA, OUT_DATA, crel */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Dao = brtc_require('Dao');

    var MODEL_ID = 'mid';
    var MODEL_SYNC = 'sync';
    var VERSION_ID = 'versionId';
    var VARIABLES = 'variables';

    var REFRESH_LABEL = 'Refresh';
    var REFRESH_COMMAND_LABEL = 'Refresh Flow';
    var ITEM_HEIGHT = 25;
    var MAX_DROPDOWN_HEIGHT = 150;
    var CURRENT_VERSION = {label: 'Current', value: ''};

    function FlowProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    FlowProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    FlowProperties.prototype.constructor = FlowProperties;

    FlowProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.options.fnUnit[IN_DATA]);
    };

    FlowProperties.prototype.createIntableControl = function () {
        var _this = this;
        if (typeof this.options.fnUnit[IN_DATA] === 'undefined') return;

        var funcDef = this.getFunctionDef();
        var minRow = funcDef['in-range'].min || 1;


        this.$intableControl = $('<div class="brtc-va-editors-sheet-controls-property-in-table-control-columnlist"/>');

        this.addPropertyInTableControl('In Table', function ($parent) {
            $parent.append(_this.$intableControl);
            var widgetOptions = {
                fnUnit: _this.options.fnUnit,
                editor: _this.options.modelEditor,
                minRow: minRow
            };
            if (minRow > 1) {
                widgetOptions.rowHeaderType = 'number';
            }

            if (this._intableControlOption) {
                $.extend(true, widgetOptions, this._intableControlOption);
            }

            _this._intableControl = _this.createInTableList(_this.$intableControl, widgetOptions);
        });
    };

    FlowProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {};
        this.render[MODEL_ID] = this.renderModelIdControl;
        this.render[VERSION_ID] = this.renderVersionIDControl;
        this.render[VARIABLES] = this.renderVariablesControl;

        this.$elements = {};
        this.controls = {};
        this.projectId = this.options.modelEditor.getEditorInput().getProjectId();

        this.createModelIdControl();
        this.createVersionIDControl();
        this.createInputTableControl(); // 일단 임시로 진행 만약에 확정된다면 리팩토링은 필수...
        this.createReturnTableControl(); // 일단 임시로 진행 만약에 확정된다면 리팩토링은 필수...
        this.createVariablesControl();
    };

    FlowProperties.prototype.createModelIdControl = function ($parent) {
        var _this = this;

        _this.$elements[MODEL_ID] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        _this.$elements[MODEL_SYNC] =
            $(crel('button',
                {class: 'brtc-va-editors-sheet-controls-propertycontrol-button'}, REFRESH_LABEL))
                .click(function () {
                    _this.executeCommand(
                        _this.createModelSyncCommand(_this.$elements[MODEL_ID].val()));
                    _this.renderTableSync();
                    _this.renderInputTableControl();
                    _this.renderReturnTableControl();
                    _this.renderVariablesControl();
                });
        _this.addPropertyControl('Model', function ($container) {
            _this.$cont = $(crel('div', {class: 'brtc-style-display-flex brtc-style-flex-wrap'}));
            $container.append(_this.$cont);
            _this.$cont.append(_this.$elements[MODEL_ID]);
            _this.$cont.append(_this.$elements[MODEL_SYNC]);

            _this.fileList = [];

            var files = Studio.getResourceManager().getFiles(_this.projectId);
            $.each(files, function (idx, model) {
                if (model.data.type == 'data' && model.data.id != _this.options.modelEditor.options.editorInput.getFileId()) {
                    _this.fileList.push({label: _.escape(model.data.label), value: model.data.id});
                }
            });

            var opt = {
                source: _this.fileList,
                dropDownHeight: 150,
                displayMember: 'label',
                valueMember: 'id',
                width: 167
            };

            _this.controls[MODEL_ID] = _this.createDropDownList(_this.$elements[MODEL_ID], opt);

            _this.controls[MODEL_SYNC] = _this.createButton(_this.$elements[MODEL_SYNC], {
                width: 80,
                height: 27
            });

            _this.controls[MODEL_ID].on('change', function (event) {
                if (!_this.isInputValueChanged(MODEL_ID, event.args.item.value)) return;
                var modelId = event.args.item.value;
                _this.cached = false;
                var val = {};
                val[MODEL_ID] = modelId;
                val[VERSION_ID] = '';
                var compoundCommand = new Brightics.VA.Core.CompoundCommand(_this, {label: 'Change FnUnit Properties'});
                var fnUnitCommand = _this.createSetFnUnitCommand({
                    param: val
                });
                _this.$elements[VERSION_ID].val('');
                compoundCommand.add(fnUnitCommand);
                compoundCommand.add(_this.createModelSyncCommand(modelId));
                _this.executeCommand(compoundCommand);

                _this.renderInputTableControl();
                _this.renderReturnTableControl();
                _this.renderVariablesControl(_this.getParam('variables'));

                _this.fileVersionList = [CURRENT_VERSION];

                Dao.VersionDao.getVersionsForced(_this.projectId, modelId, function (fileVersions) {
                    fileVersions.sort(function (a, b) {
                        return a.compareToByVersion(b);
                    });
                    $.each(fileVersions, function (idx, version) {
                        _this.fileVersionList.push({
                            label: version.getVersion(),
                            value: version.getVersionId()
                        });
                    });
                });

                _this.controls[VERSION_ID].jqxDropDownList({
                    source: _this.fileVersionList,
                    dropDownHeight: _this.calcDropdownHeight(
                        _this.fileVersionList.length,
                        ITEM_HEIGHT)
                });
            });
        }, {mandatory: true});
    };

    FlowProperties.prototype.createVersionIDControl = function ($parent) {
        var _this = this;
        _this.$elements[VERSION_ID] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        _this.addPropertyControl('Version', function ($container) {
            $container.append(_this.$elements[VERSION_ID]);

            // _this.fileVersionList = [];
            _this.fileVersionList = [CURRENT_VERSION];

            var modelId = _this.options.fnUnit.param[MODEL_ID];

            if (_this.projectId && modelId) {
                // blocking
                Dao.VersionDao.getVersionsForced(_this.projectId, modelId, function (fileVersions) {
                    _this.fileVersionList = [CURRENT_VERSION];
                    fileVersions.sort(function (a, b) {
                        return a.compareToByVersion(b);
                    });
                    $.each(fileVersions, function (idx, version) {
                        _this.fileVersionList.push({
                            label: version.getVersion(),
                            value: version.getVersionId()
                        });
                    });
                });
            }

            var opt = {
                source: _this.fileVersionList,
                displayMember: 'label',
                valueMember: 'value',
                autoDropDownHeight: false,
                height: ITEM_HEIGHT + 'px',
                dropDownHeight: _this.calcDropdownHeight(
                    _this.fileVersionList.length,
                    ITEM_HEIGHT)
            };
            _this.controls[VERSION_ID] = _this.createDropDownList(_this.$elements[VERSION_ID], opt);

            _this.controls[VERSION_ID].on('change', function (event) {
                var modelId = _this.options.fnUnit.param[MODEL_ID];
                var versionId = event.args.item.value;

                if (_this.getFnUnit().param[VERSION_ID] === event.args.item.value) return;
                _this.cached = false;

                // blocking
                var outData = [];
                var variables = {};
                var model = _this.getRenderedModel(modelId, versionId);
                if (model) {
                    outData = model.getContents()[OUT_DATA];
                    variables = model.getContents()[VARIABLES];
                }

                var fnUnitCommandOption = {
                    fnUnit: _this.options.fnUnit,
                    ref: {
                        param: {}
                    }
                };
                var newOutDataCommandOption = {
                    fnUnit: _this.options.fnUnit,
                    ref: {
                        outData: []
                    }
                };

                var newVariables = _this._calcVariables(_this.getParam('variables'), variables);
                fnUnitCommandOption.ref.param[VERSION_ID] = versionId;
                fnUnitCommandOption.ref.param[VARIABLES] = newVariables;

                newOutDataCommandOption.ref[OUT_DATA] = _this.generateNewOutDataList(outData);


                _this.renderVariablesControl(newVariables);
                _this.renderInputTableControl();
                _this.renderReturnTableControl();

                var compoundCommand = new Brightics.VA.Core.CompoundCommand(_this, {label: 'Change FnUnit Properties'});
                var newOutDataCommand = new Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand(_this, newOutDataCommandOption);
                var fnUnitCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(_this, fnUnitCommandOption);

                compoundCommand.add(fnUnitCommand);
                compoundCommand.add(newOutDataCommand);

                _this.executeCommand(compoundCommand);
            });
        }, {mandatory: false});
    };

    FlowProperties.prototype.generateNewOutDataList = function (outData) {
        if (!outData) return [];
        // var newOutDataList = _.clone(this.options.fnUnit[OUT_DATA]);
        var newOutDataList = _.clone(this.FnUnitUtils.getOutTable(this.options.fnUnit));
        while (newOutDataList.length < outData.length) {
            newOutDataList.push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }
        while (newOutDataList.length > outData.length) {
            newOutDataList.pop();
        }
        return newOutDataList;
    };

    FlowProperties.prototype.getVersionInputData = function () {
        var contents = this.version.getContents();
        return contents[IN_DATA] || [];
    };

    FlowProperties.prototype.getInputData = function () {
        var _this = this;
        var table = (function () {
            var model = _this.getRenderedModel();
            if (model) return model.getContents()[IN_DATA] || [];
            return [];
        }());
        // return _.take(table, this.getFnUnit()[IN_DATA].length);
        return table;
    };

    FlowProperties.prototype.getVersionReturnData = function () {
        var contents = this.version.getContents();
        return contents[OUT_DATA] || [];
    };

    FlowProperties.prototype.getReturnData = function () {
        var _this = this;
        var table = (function () {
            var model = _this.getRenderedModel();
            if (model) return model.getContents()[OUT_DATA] || [];
            return [];
        }());
        // return _.take(table, this.getFnUnit()[OUT_DATA].length);
        return table;
    };

    FlowProperties.prototype.getFnUnitByTableId = function (tableId) {
        var _this = this;
        var mainModel = this.getRenderedModel().getContents();
        // var mainModel = this.version.getContents();

        var rec = function (model) {
            var fns = model.functions;
            for (var i = 0; i < fns.length; i++) {
                var fn = fns[i];
                // if (_.indexOf(fn[OUT_DATA], tableId) > -1) return fn;
                if (_.indexOf(_this.FnUnitUtils.getOutTable(fn), tableId) > -1) return fn;
                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, fn);
                for (var j = 0; j < subModels.length; j++) {
                    var subModel = subModels[j];
                    var x = rec(subModel);
                    if (x) {
                        return x;
                    }
                }
            }
            return undefined;
        };
        return rec(mainModel);
    };

    FlowProperties.prototype.createSelectedTableElements = function ($parent, tableIds) {
        var _this = this;
        var ret = [];
        _.forEach(tableIds, function (tableId) {
            var fnUnit = _this.getFnUnitByTableId(tableId);
            if (fnUnit) {
                ret.push(_this.createSelectedItem($parent, fnUnit, tableId));
            }
        });
        return ret;
    };

    FlowProperties.prototype.createSelectedItem = function ($parent, fnUnit, tableId) {
        var $item = this.createItem(fnUnit, tableId);
        return this.wrapSelectedItem($parent, $item);
    };

    FlowProperties.prototype.createItem = function (fnUnit, tableId) {
        var clazz = 'data';
        var $item = $(crel('div', {class: 'brtc-va-editors-sheet-controls-dataselector-item'}));
        var $paletteItem =
            Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz);
        var $fnUnitLabel = $paletteItem.find('.brtc-va-views-palette-fnunit-label');
        $fnUnitLabel.text(this.getTableItemLabel(fnUnit, tableId));
        $paletteItem.css('cursor', 'auto');
        $item.attr('tid', tableId);
        $item.attr('fid', fnUnit.fid);
        // var index = fnUnit[OUT_DATA].indexOf(tableId);
        var index = this.FnUnitUtils.getOutTable(fnUnit).indexOf(tableId);
        $item.attr('index', index);
        $paletteItem.addClass('item');
        return $item;
    };

    FlowProperties.prototype.getTableItemLabel = function (fnUnit, tableId) {
        // var outTableLength = fnUnit[OUT_DATA].length;
        // var index = _.indexOf(fnUnit[OUT_DATA], tableId);
        var outTableLength = this.FnUnitUtils.getOutTable(fnUnit).length;
        var index = this.FnUnitUtils.getOutTable(fnUnit).indexOf(tableId);
        var singularized = fnUnit.display.label;
        var pluralized = fnUnit.display.label + '-' + (index + 1);
        if (outTableLength > 1) return pluralized;
        return singularized;
    };

    FlowProperties.prototype.wrapSelectedItem = function ($parent, $item) {
        var _this = this;
        var $itemWrapper = $(crel('div', {
            class: 'brtc-style-flex-center',
            style: 'padding-left: 10px'
        }));

        $itemWrapper.append($item);

        $parent.append($itemWrapper);
    };

    FlowProperties.prototype.createInputTableControl = function ($parent) {
        this.$inputTableContainer = $('<div class="brtc-va-editors-sheet-panels-properties-flowproperties-input-table-container"></div>');

        this.addPropertyControl('Input Table (Read Only)', function ($parent) {
            $parent.append(this.$inputTableContainer);
        });
    };

    FlowProperties.prototype.createReturnTableControl = function ($parent) {
        this.$returnTableContainer = $('<div class="brtc-va-editors-sheet-panels-properties-flowproperties-return-table-container"></div>');

        this.addPropertyControl('Return Table (Read Only)', function ($parent) {
            $parent.append(this.$returnTableContainer);
        });
    };

    FlowProperties.prototype.createVariablesControl = function ($parent) {
        var _this = this;

        this.$container = $('<div class="brtc-va-editors-sheet-panels-properties-flowproperties-variable-container"></div>');

        this.addPropertyControl('Variables', function ($parent) {
            $parent.append(this.$container);

            this.variableControl = new Brightics.VA.Core.Views.SetVariable(this.$container, {
                width: '100%',
                height: 'calc(100% - 30px)',
                editor: this.options.modelEditor,
                isFixedVariable: true,
                isNormalType: true,
                onChange: function (oldVariable, newVariable) {
                    _this.createOnChangeCommand(oldVariable, newVariable);
                }
            });
        });
    };

    FlowProperties.prototype.renderModelIdControl = function ($parent) {
        var _this = this;
        var val = _this.options.fnUnit.param[MODEL_ID];

        if (val) _this.$elements[MODEL_ID].val(val);
        else _this.$elements[MODEL_ID].jqxDropDownList('clearSelection');
        this.renderTableSync();
    };

    FlowProperties.prototype.renderVersionIDControl = function ($parent) {
        var _this = this;
        var versionId = this.options.fnUnit.param[VERSION_ID];
        var modelId = this.options.fnUnit.param[MODEL_ID];
        var hasValidModelId = !!Studio.getResourceManager().getFile(_this.projectId, modelId);

        if (modelId && versionId) {
            if (hasValidModelId) {
                // Dao.VersionDao.getVersionForced(this.projectId, modelId, versionId,
                //     function (version) {
                //         _this.version = version;
                //         _this.$elements[VERSION_ID].val(_this.version.getVersionId());
                //         _this.renderInputTableControl();
                //         _this.renderReturnTableControl();
                //     });;
                _this.$elements[VERSION_ID].val(_this.getRenderedModel().getVersionId());
                _this.renderInputTableControl();
                _this.renderReturnTableControl();
                _this.renderVariablesControl();
            } else {
                this.$elements[VERSION_ID].jqxDropDownList({
                    source: [CURRENT_VERSION]
                });
                this.$elements[VERSION_ID].val('');
                _this.renderInputTableControl();
                _this.renderReturnTableControl();
                _this.renderVariablesControl();
            }
        } else {
            this.$elements[VERSION_ID].val('');
            _this.renderInputTableControl();
            _this.renderReturnTableControl();
            _this.renderVariablesControl();
        }
        this.renderTableSync();
    };

    FlowProperties.prototype.renderVariablesControl = function (variables) {
        var paramVariables = variables || this.options.fnUnit.param[VARIABLES];
        var newVariables = [];
        for (var key in paramVariables) {
            newVariables.push({
                name: key,
                type: paramVariables[key].type,
                value: paramVariables[key].value
            });
        }
        this.variableControl.renderValues(newVariables);
    };

    FlowProperties.prototype.renderInputTableControl = function () {
        this.$inputTableContainer.empty();
        this.createSelectedTableElements(this.$inputTableContainer, this.getInputData());
    };

    FlowProperties.prototype.renderReturnTableControl = function () {
        this.$returnTableContainer.empty();
        this.createSelectedTableElements(this.$returnTableContainer, this.getReturnData());
    };

    FlowProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param === MODEL_ID) {
                // this.createValidationContent(this.$elements[MODEL_ID], this.problems[i]);
                this.createValidationContent(this.$cont, this.problems[i]);
            }
            if (this.problems[i].param === VERSION_ID) {
                this.createValidationContent(this.$elements[VERSION_ID], this.problems[i]);
            }
        }
    };

    FlowProperties.prototype.createOnRemoveCommand = function (variable) {
        var targetName = variable.name;
        var variables = this.options.fnUnit.param.variables;
        var newVariables = [];

        for (var i in variables) {
            if (variables[i].name === targetName) continue;
            newVariables.push(variables[i]);
        }

        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'variables': newVariables
                }
            }
        };
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);

        this.executeCommand(command);
    };

    FlowProperties.prototype.createOnChangeCommand = function (oldVariable, newVariable) {
        var oldName = oldVariable.name;
        var variables = this.options.fnUnit.param.variables;

        var commandVariables = {};

        for (var key in variables) {
            if (key === oldName) {
                commandVariables[key] = {};
                commandVariables[key].type = newVariable.type;
                commandVariables[key].value = newVariable.param.value;
                continue;
            }
            commandVariables[key] = variables[key];
        }

        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'variables': commandVariables
                }
            }
        };
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);

        this.executeCommand(command);
    };

    FlowProperties.prototype.calcDropdownHeight = function (numOfItems, itemHeight) {
        return Math.min(itemHeight * numOfItems, MAX_DROPDOWN_HEIGHT) + 'px';
    };

    FlowProperties.prototype.refreshModels = function () {
        var _this = this;
        var items = _.chain(Studio.getResourceManager().getFiles(this.projectId))
            .filter(function (file) {
                return file.getType() === 'data' &&
                    file.getFileId() !== _this.getEditor().getEditorInput().getFileId();
            })
            .map(function (file) {
                return {label: _.escape(file.getLabel()), value: file.getFileId()};
            })
            .value();
        this.$elements[MODEL_ID].jqxDropDownList({
            source: items,
            dropDownHeight: this.calcDropdownHeight(
                items.length,
                ITEM_HEIGHT)
        });
    };

    FlowProperties.prototype.refreshVersions = function () {
        var _this = this;
        var projectId = this.projectId;
        var modelId = this.getFnUnit().param[MODEL_ID];
        var hasValidModelId = !!Studio.getResourceManager().getFile(projectId, modelId);
        if (hasValidModelId) {
            Dao.VersionDao.getVersionsForced(projectId, modelId, function (fileVersions) {
                var items = [CURRENT_VERSION].concat(_.map(fileVersions, function (version) {
                    return {
                        label: version.getVersion(),
                        value: version.getVersionId()
                    };
                }));
                _this.$elements[VERSION_ID].jqxDropDownList({
                    source: items,
                    dropDownHeight: _this.calcDropdownHeight(items.length, ITEM_HEIGHT)
                });
            });
        } else {
            this.$elements[VERSION_ID].jqxDropDownList({
                source: [CURRENT_VERSION],
                dropDownHeight: this.calcDropdownHeight(0, ITEM_HEIGHT)
            });
            this.$elements[VERSION_ID].val('');
        }
    };

    FlowProperties.prototype.renderTableSync = function () {
        var modelId = this.getFnUnit().param[MODEL_ID];
        var versionId = this.getFnUnit().param[VERSION_ID];
        var file = Studio.getResourceManager().getFile(this.projectId, modelId);
        var model = file ? file.getContents() : undefined;

        var equals = function (var1, var2) {
            return _.xor(_.keys(var1), _.keys(var2)).length === 0;
        };

        var enabled = modelId && !versionId && model &&
            (
                // model[IN_DATA].length < this.getFnUnit()[IN_DATA].length ||
                !equals(model.variables, this.getParam('variables')) ||
                // model[OUT_DATA].length !== this.getFnUnit()[OUT_DATA].length);
                model[OUT_DATA].length !== this.FnUnitUtils.getOutTable(this.getFnUnit()).length);
        this.$elements[MODEL_SYNC].jqxButton({
            disabled: !enabled
        });
    };

    FlowProperties.prototype.refresh = function () {
        this.refreshModels();
        this.refreshVersions();
        this.renderTableSync();
        this.renderInputTableControl();
        this.renderReturnTableControl();
        this.renderVariablesControl(this.getParam('variables'));
        if (this.getFnUnit().hasOwnProperty('parent')) {
            Studio.getInstance().doValidate(this.getModel());
        }
    };

    FlowProperties.prototype.createOutTableSyncCommand = function (modelId) {
        var _this = this;
        var newOutDataCommandOption = {
            fnUnit: _this.options.fnUnit,
            ref: {
                outData: []
            }
        };
        var file = Studio.getResourceManager().getFile(_this.projectId, modelId);
        newOutDataCommandOption.ref[OUT_DATA] =
            _this.generateNewOutDataList(file.getContents()[OUT_DATA]);
        return new Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand(_this,
                newOutDataCommandOption);
    };

    FlowProperties.prototype.createInTableSyncCommand = function (modelId) {
        var _this = this;
        var changeInTableCommandOption = {
            fnUnit: _this.options.fnUnit,
            ref: {
                inData: []
            }
        };
        var file = Studio.getResourceManager().getFile(_this.projectId, modelId);
        var model = file.getContents();
        changeInTableCommandOption.ref[IN_DATA] =
            _.take(_this.options.fnUnit[IN_DATA],
                parseInt(Math.min(model[IN_DATA].length, _this.options.fnUnit[IN_DATA].length)));
        return new Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand(_this,
                changeInTableCommandOption);
    };

    FlowProperties.prototype._calcVariables = function (oldVar, newVar) {
        return Object.keys(newVar).reduce(function (variables, key) {
            variables[key] = _.cloneDeep(_.has(oldVar, key) ? oldVar[key] : newVar[key]);
            return variables;
        }, {});
    };

    FlowProperties.prototype.createVariablesSyncCommand = function (modelId) {
        var _this = this;
        var variablesSyncCommandOption = {
            fnUnit: _this.options.fnUnit,
            ref: {
                param: []
            }
        };
        var file = Studio.getResourceManager().getFile(_this.projectId, modelId);

        var model = file.getContents();
        var oldVar = this.getParam('variables');
        var newVar = model.variables;
        var variables = this._calcVariables(oldVar, newVar);
        variablesSyncCommandOption.ref.param.variables = variables;
        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(_this,
                variablesSyncCommandOption);
    };

    FlowProperties.prototype.createModelSyncCommand = function (modelId) {
        var _this = this;
        var compoundCommand = new Brightics.VA.Core.CompoundCommand(_this,
            {label: REFRESH_COMMAND_LABEL});
        // compoundCommand.add(this.createInTableSyncCommand(modelId));
        compoundCommand.add(this.createOutTableSyncCommand(modelId));
        compoundCommand.add(this.createVariablesSyncCommand(modelId));
        return compoundCommand;
    };

    FlowProperties.prototype.getRenderedModel = function (mid, vid) {
        if (this.cached) return this.cached;
        var _this = this;
        var projectId = this.projectId;
        var modelId = _.isUndefined(mid) ? this.getParam(MODEL_ID) : mid;
        var versionId = _.isUndefined(vid) ? this.getParam(VERSION_ID) : vid;
        if (modelId && versionId) {
            Dao.VersionDao.getVersionForced(projectId, modelId, versionId,
                function (version) {
                    _this.cached = version;
                }
            );
        } else if (modelId) {
            _this.cached = Studio.getResourceManager().getFile(projectId, modelId);
        }
        return this.cached;
    };

    Brightics.VA.Core.Functions.Library.flow.propertiesPanel = FlowProperties;
}).call(this);
/**************************************************************************
 *                               Validator                                 
 *************************************************************************/
/**
 * Created by SDS on 2018-03-12.
 */

/* global Studio, _, OUT_DATA, TABLE_SYNC */
/* eslint-disable no-invalid-this */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function FlowValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    FlowValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    FlowValidator.prototype.constructor = FlowValidator;

    FlowValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);
        this.addModelRule();
        this.addModelIdRule();
        this.addVersionIdRule();
        this.addSyncTableRule();
    };

    FlowValidator.prototype.addLinkRule = function () {
    };

    FlowValidator.prototype.addInTableRule = function () {
    };

    FlowValidator.prototype.addModelRule = function () {
        var isValidModel = function (mid) {
            if (!mid) return true;
            var model = Studio.getResourceManager().getFile(undefined, mid);
            return !_.isUndefined(model);
        };
        this.addRule(function (fnUnit) {
            if (isValidModel(fnUnit.param.mid)) return [];
            var checkInfo = {
                errorCode: 'EI001',
                param: 'mid'
            };

            return this.problemFactory.createProblem(checkInfo, fnUnit);
        });
        this.addRule(function (fnUnit) {
            if (isValidModel(fnUnit.param.mid)) return [];
            var checkInfo = {
                errorCode: 'EI001',
                param: 'versionId'
            };

            return this.problemFactory.createProblem(checkInfo, fnUnit);
        });

    };

    FlowValidator.prototype.addModelIdRule = function (params) {
        var _this = this;
        this.addRule(function (fnUnit) {
            var messageInfo = {
                errorCode: 'BR-0033',
                param: 'mid',
                messageParam: ['Model']
            };
            return _this._checkStringIsEmpty(messageInfo, fnUnit, fnUnit.param.mid);
        });
    };

    FlowValidator.prototype.addVersionIdRule = function (params) {
        // var _this = this;
        // this.addRule(function (fnUnit) {
        //     var messageInfo = {
        //         errorCode: 'BR-0033',
        //         param: 'versionId',
        //         messageParam: ['Version']
        //     };
        //     return _this._checkStringIsEmpty(messageInfo, fnUnit, fnUnit.param.versionId);
        // });
    };

    FlowValidator.prototype.addSyncTableRule = function (params) {
        this.addRule(function (fnUnit) {
            var modelId = fnUnit.param.mid;
            var versionId = fnUnit.param.versionId;
            var file = Studio.getResourceManager().getFile(this.projectId, modelId);
            var model = file ? file.getContents() : undefined;

            var equals = function (var1, var2) {
                return _.xor(_.keys(var1), _.keys(var2)).length === 0;
            };

            var enabled = modelId && !versionId && model &&
                (
                    // model[IN_DATA].length < this.getFnUnit()[IN_DATA].length ||
                    !equals(model.variables, fnUnit.param.variables) ||
                    // model[OUT_DATA].length !== fnUnit[OUT_DATA].length);
                    model[OUT_DATA].length !== _this.FnUnitUtils.getOutTable(fnUnit).length);
            if (enabled) {
                var checkInfo = {
                    errorCode: 'EI002',
                    param: 'mid'
                };
                return this.problemFactory.createProblem(checkInfo, fnUnit);
            }
        });
    };

    Brightics.VA.Core.Functions.Library.flow.validator = FlowValidator;

}).call(this);