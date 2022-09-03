/**
 * Created by daewon77.park on 2016-08-27.
 */

/* global crel, Studio */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var className = {
        dataSelectorWrapper: [
            'brtc-va-editors-sheet-controls-dataselector-contents-wrapper',
            'brtc-va-dialogs-setvariable-dataselector-wrapper'
        ].join(' '),
        dataSelectorItem: 'brtc-va-editors-sheet-controls-dataselector-item'
    };

    function SetValueSettingDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.FnUnitDialog.call(this, parentId, options);
    }

    SetValueSettingDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.FnUnitDialog.prototype);
    SetValueSettingDialog.prototype.constructor = SetValueSettingDialog;

    SetValueSettingDialog.prototype.getTitle = function () {
        return this.options.title;
    };

    SetValueSettingDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-style-minus-40">' +
            '    <div class="brtc-va-dialogs-body">' +
            '        <div class="brtc-va-dialogs-title brtc-style-display-flex brtc-style-height-45px brtc-style-padding-right-20"></div>' +
            '        <div class="brtc-va-dialogs-contents brtc-va-dialogs-fnunit brtc-style-display-flex"></div>' +
            '        <div class="brtc-va-dialogs-buttonbar brtc-style-padding-right-30"></div>' +
            '    </div>' +
            '</div>');

        this.$titleArea = this.$mainControl.find('.brtc-va-dialogs-title');
    };

    SetValueSettingDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-control-function-body brtc-style-height-full brtc-style-flex-1"></div>' +
            '');

        this.$headerArea = $parent.find('.brtc-va-dialogs-control-function-header');
        this.$bodyArea = $parent.find('.brtc-va-dialogs-control-function-body');

        this.createVariablesControl();
        
        this.$bodyArea.perfectScrollbar({suppressScrollX: true});
    };

    SetValueSettingDialog.prototype.createDataControl = function () {
        var _this = this;

        this.$dataArea.append(''+
            '<div class="brtc-va-dialogs-data-selector"></div>' +
            '<div class="brtc-va-dialogs-data-viewer"></div>'
        );

        var $el = this.$dataArea.find('.brtc-va-dialogs-data-selector');
        var $dataSourceWrapper = this.createDataSelector();
        $el.append($dataSourceWrapper);
        $dataSourceWrapper.perfectScrollbar();
    };

    SetValueSettingDialog.prototype.createDataSelectorItem = function (label, tid, type) {
        var $item = $(crel('div', {class: className.dataSelectorItem}));
        var $paletteItem =
            Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, type, 'data');
        var $fnUnitLabel = $paletteItem.find('.brtc-va-views-palette-fnunit-label');
        $fnUnitLabel.text(label);
        $paletteItem.addClass('item');
        $paletteItem.attr('tid', tid);
        $item.addClass('brtc-va-editors-setvalue-indata-item');
        return $item;
    };

    SetValueSettingDialog.prototype.createDataSelectorSource = function () {
        var activeModel = Studio.getEditorContainer().getActiveModelEditor().getActiveModel();
        var source = this.options.fnUnit.inData.map(function (tid) {
            var fnUnit = activeModel.getFnUnitByOutTable(tid);
            return {
                label: fnUnit.display.label,
                tid: tid,
                type: fnUnit.func
            }
        });
        return source;
    };

    SetValueSettingDialog.prototype.createDataSelector = function () {
        var _this = this;
        var $dataList = $(crel('div', {class: className.dataSelectorWrapper}));
        var source = this.createDataSelectorSource();
        var $selectedItem = '';
        var select = function ($item, tid) {
            if ($selectedItem) {
                $selectedItem.removeClass('selected');
            }
            $selectedItem = $item;
            $selectedItem.addClass('selected');
            _this.renderData(tid);
        };
        var $items = source.map(function (src) {
            var $item = _this.createDataSelectorItem(src.label, src.tid, src.type);
            $item.click(function () {
                select($item, src.tid);
            });
            return $item;
        });
        $dataList.append($items);
        if ($items.length > 0) {
            select($items[0]);
        }
        return $dataList;
    };

    SetValueSettingDialog.prototype.renderData = function (tid) {
        var $inContainer = this.$dataArea.find('.brtc-va-dialogs-data-viewer');
        $inContainer.empty();

        var clonedFnUnit = $.extend(true, {}, this.options.fnUnit);

        //how can i set tableIndexes???
        this.changeTableInfo(clonedFnUnit, tid);

        var mid = Studio.getEditorContainer().getActiveModelEditor().getActiveModel().mid;

        var inDataProxy = new Brightics.VA.Core.Editors.Sheet.DataProxy($inContainer, mid);
        inDataProxy.reset();
        
        this.panelFactory = Studio.getEditorContainer().getActiveModelEditor().getPanelFactory();
        this.inPanel = this.panelFactory.createInDataPanel($inContainer, {
            width: '100%',
            height: '100%',
            modelEditor: Studio.getEditorContainer().getActiveModelEditor(),
            fnUnit: clonedFnUnit,
            resizable: true,
            dataProxy: inDataProxy
        });
    };

    SetValueSettingDialog.prototype.changeTableInfo = function (clonedFnUnit, tid) {
        clonedFnUnit.inData = [tid];
        if (clonedFnUnit.display.sheet.in.partial[0].panel.length > 0) {
            clonedFnUnit.display.sheet.in.partial[0].panel[0].tableIndexes = [0];
        }
    };

    SetValueSettingDialog.prototype.createIndataSource = function () {
        var activeModel = Studio.getEditorContainer().getActiveModelEditor().getActiveModel();
        var source = this.options.fnUnit.inData.map(function (tid) {
            var fnUnit = activeModel.getFnUnitByOutTable(tid);
            return {
                label: fnUnit.display.label,
                tid: tid,
                type: fnUnit.func
            }
        });
        return source;
    };

    SetValueSettingDialog.prototype.createVariablesControl = function () {
        var _this = this;

        this.variableControl = new Brightics.VA.Core.Views.SetVariable(this.$bodyArea, {
            width: '100%',
            height: '100%',
            fnUnit: this.options.fnUnit,
            editor: this.options.editor,
            onAdd: function (variable) {
                _this.onAdd(variable);
            },
            onRemove: function (variable) {
                _this.onRemove(variable);
            },
            onChange: function (oldVariable, newVariable) {
                _this.onChange(oldVariable, newVariable);
            },
        });

        this.variableControl.$mainControl.find('input')
            .addClass('brtc-style-minus-20')
            .addClass('brtc-style-padding-right-20');

        this.variableControl.$mainControl.find('.brtc-va-tools-sidebar-variable-list')
            .addClass('brtc-style-padding-right-20');

        // Variable is different from SetValue Function spec
        // so i did it as a temporary
        var clonedVariables = [];
        for (var i in this.options.fnUnit.param.variables) {
            var variable = this.options.fnUnit.param.variables[i];

            clonedVariables.push({
                type: variable.type,
                name: variable.name,
                value: (variable.type === 'cell')? variable.param : variable.param.value
            });
        }

        this.variableControl.renderValues(clonedVariables);
    };

    SetValueSettingDialog.prototype.onRemove = function (variable) {
        var targetName = variable.name;
        var variables = this.options.fnUnit.param.variables;
        var newVariables = [];

        for (var i in variables) {
            if (variables[i].name === targetName) continue;
            newVariables.push(variables[i]);
        }

        this.options.fnUnit.param['variables'] = newVariables;
    };

    SetValueSettingDialog.prototype.onChange = function (oldVariable, newVariable) {
        var oldName = oldVariable.name;
        var variables = this.options.fnUnit.param.variables;
        
        var changedVariables = [];

        this.updateMode(newVariable);

        for (var i in variables) {
            if (variables[i].name === oldName) {
                changedVariables.push(newVariable);
                continue;
            }
            changedVariables.push(variables[i]);
        }

        this.options.fnUnit.param['variables'] = changedVariables;
    };

    SetValueSettingDialog.prototype.onAdd = function (variable) {
        var cloneVariable = $.extend(true, {}, variable);
        var cloneVariables = $.extend(true, [], this.options.fnUnit.param.variables);

        this.updateMode(cloneVariable);

        cloneVariables.push(cloneVariable);

        this.options.fnUnit.param['variables'] = cloneVariables;
    };

    SetValueSettingDialog.prototype.refresh = function () {
        var $container = this.$mainControl.find('.brtc-va-dialogs-index-item-container');
        $container.empty();

        this.$mainControl.perfectScrollbar('update');
    };

    SetValueSettingDialog.prototype.handleOkClicked = function () {
        this.dialogResult = {
            OK: true,
            Cancel: false,
            results: {fnUnit: this.options.fnUnit}
        };
        this.$mainControl.dialog('close');
    };

    SetValueSettingDialog.prototype.handleCancelClicked = function () {
        this.dialogResult = {
            OK: false,
            Cancel: true
        };

        this.$mainControl.dialog('close');
    };

    SetValueSettingDialog.prototype.updateMode = function (variable) {
        if (variable.type === 'cell') {
            variable.mode = 'cell';
        } else {
            variable.mode = 'value';
        }
    };

    Brightics.VA.Core.Dialogs.SetValueSettingDialog = SetValueSettingDialog;

}).call(this);