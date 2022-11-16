(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BaseInvokeProperties(parentId, options) {
        this._propertiesPanelParams = this._getParams();
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    BaseInvokeProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    BaseInvokeProperties.prototype.constructor = BaseInvokeProperties;

    BaseInvokeProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    BaseInvokeProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);
        this.$elements = {};
        this.controls = {};
        this.visibleOptionMap = {};
        this._controlCreator = new Brightics.VA.Implementation.DataFlow.UdfInvokeControlCreator(this);
        this._renderCreateor = new Brightics.VA.Implementation.DataFlow.UdfInvokeControlRenderer(this);
        this._columnSelectorList = [];

        this.createControlsBySpec(this._propertiesPanelParams);
        this.render = this._createRenderer();
    };

    BaseInvokeProperties.prototype._createRenderer = function () {
        var renderer = this.createRendererBySpec(this._propertiesPanelParams);

        if (Object.keys(this.visibleOptionMap).length > 0) {
            renderer['$$VisibleOptionRenderer$$'] = this._renderVisibleOption.bind(this);
        }

        return renderer;
    };


    BaseInvokeProperties.prototype.createControlsBySpec = function (controlSpecs) {
        var spec;
        for (var i in controlSpecs) {
            spec = controlSpecs[i];
            this._controlCreator.createInvokeControl(spec);
            this._initVisibleOption(spec)
        }
    };

    BaseInvokeProperties.prototype.createRendererBySpec = function (controlSpecs) {
        var render = {};
        var spec;

        for (var i in controlSpecs) {
            spec = controlSpecs[i];
            render[spec.id] = this._renderCreateor.createInvokeRenderer(spec);
        }
        return render;
    };

    BaseInvokeProperties.prototype.fillControlValues = function () {
        var _this = this;
        for (var i = 0; i < this._columnSelectorList.length; i++) {
            var spec = this._columnSelectorList[i].spec;
            (function (i) {
                var columns = _this._getTargetColumns(spec);
                _this._columnSelectorList[i].control.setItems(columns);
            })(i);
        }
    };

    BaseInvokeProperties.prototype._getTargetColumns = function (spec) {
        var columns = [];
        var targetTable = spec.targetTable;
        var columnType = spec.columnType;
        var inData;

        if (targetTable && targetTable.length > 0) {
            inData = this.FnUnitUtils.getInTableByKeys(this.options.fnUnit, targetTable);
        } else {
            inData = this.FnUnitUtils.getInTable(this.options.fnUnit);
        }


        if (typeof inData === 'undefined') return columns;

        for (var i = 0; i < inData.length; i++) {
            columns = columns.concat(this.dataMap ? inData[i] ? this.dataMap[inData[i]].columns : [] : []);
        }

        if (columnType && columnType.length > 0) {
            columns = columns.filter(function(col){
                return columnType.indexOf(col.internalType) >= 0;
            });
        } else if (columnType && columnType.length === 0) {
            columns = columns.filter(function(col){
                return col.internalType !== 'Image';
            });
        }
        return columns;

    };


    BaseInvokeProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param) {
                this.createValidationContent(this.$elements[this.problems[i].param], this.problems[i]);
            }
        }
    };

    BaseInvokeProperties.prototype._initVisibleOption = function (spec) {
        if (spec.visibleOption && spec.visibleOption.length > 0) {
            this.visibleOptionMap[spec.id] = spec.visibleOption;
        }
    };

    BaseInvokeProperties.prototype._getPropertyControlById = function (id) {
        return this.$elements[id].closest('.brtc-va-editors-sheet-controls-propertycontrol');
    };

    BaseInvokeProperties.prototype.createColumnsCommand = function (paramName, columns) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };
        commandOption.ref.param[paramName] = [columns];
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        return command;
    };

    BaseInvokeProperties.prototype._renderVisibleOption = function () {
        var visibleOptionList, controlWrapper;
        for (var id in this.visibleOptionMap) {
            visibleOptionList = this.visibleOptionMap[id];
            controlWrapper = this._getPropertyControlById(id);
            if (this._checkVisibleOption(visibleOptionList)) {
                controlWrapper.show();
            } else {
                controlWrapper.hide();
            }
        }
    };

    BaseInvokeProperties.prototype._checkVisibleOption = function (visibleOptionList) {
        var visibleOption;
        var visibleOptionValue;
        for (var i = 0; i < visibleOptionList.length; i++) {
            visibleOption = visibleOptionList[i];
            if (visibleOption.script) {
                try {
                    let visibleOptionScript = visibleOption.script.replace(/#(.*?)#/g, 'this.options.fnUnit.param[\'$1\']');
                    let checkLogic = new Function(visibleOptionScript);
                    return checkLogic.call(this);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            } else {
                visibleOptionValue = visibleOption.value;
                if (_.isArray(this.options.fnUnit.param[visibleOption.id]) &&
                    this.options.fnUnit.param[visibleOption.id]
                        .every(value => value !== visibleOptionValue)) {
                    return false;
                }
                if (!_.isArray(this.options.fnUnit.param[visibleOption.id]) &&
                    this.options.fnUnit.param[visibleOption.id] !== visibleOptionValue) {
                    return false;
                }
            }
        }
        return true;
    };


    BaseInvokeProperties.prototype.executeCommand = function (command) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.executeCommand.call(this, command);
        this._renderVisibleOption();
    };

    BaseInvokeProperties.prototype.handleSetFnUnitParameterValueCommand = function (command) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.handleSetFnUnitParameterValueCommand.call(this, command);
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this._renderVisibleOption();
        }
    };

    Brightics.VA.Implementation.DataFlow.Functions.BaseInvokeProperties = BaseInvokeProperties;


}).call(this);
