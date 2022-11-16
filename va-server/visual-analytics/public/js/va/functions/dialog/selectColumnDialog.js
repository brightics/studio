/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Dialogs.PropertiesPanelDialog.prototype;

    function SelectColumnDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    SelectColumnDialog.prototype = Object.create(_super);
    SelectColumnDialog.prototype.constructor = SelectColumnDialog;
    
    SelectColumnDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);
    
        this.dialogOptions.height = 540;
    };

    SelectColumnDialog.prototype.createContentsAreaControls = function () {
        let _this = this;
        this.createLoading();
    
        let table = this.FnUnitUtils.getInTable(this.options.fnUnit)[0];
    
        this.options.dataProxy.requestSchema(table, function (data) {
            _this.createConditionArea(data.columns);
        }, function (data) {
            _this.createConditionArea(data.columns);
        });
    };

    SelectColumnDialog.prototype.createLoading = function () {
        this.popupProperty.$mainControl.prepend($('' +
            '<div class="brtc-va-progress">' +
            '   <div>' +
            '       <span class="brtc-va-progress-loading"></span>' +
            '       <p class="brtc-va-progress-loading-label">Rendering columns ...</p>' +
            '   </div>' +
            '</div>'
        ));
    };
    
    SelectColumnDialog.prototype.hideLoading = function () {
        this.popupProperty.$mainControl.find('.brtc-va-progress').hide();
    };    
    
    SelectColumnDialog.prototype.parseSelectParam = function () {
        let param = this.options.fnUnit.param;
        let input_cols = param.input_cols;
        let output_cols = param.output_cols;
        let output_types = param.output_types;
        let selectedColumns = [];

        for (let i = 0; i < input_cols.length; i++) {
            selectedColumns.push(
                {
                    checked: true,
                    name: input_cols[i],
                    alias: output_cols[i],
                    type: output_types[i]
                }
            );
        }
        return selectedColumns;
    };
    
    SelectColumnDialog.prototype.createConditionArea = function (columns) {
        var _this = this;

        let internalTypeMap = {
            'String': 'string',
            'Integer': 'int',
            'Double': 'double',
            'Long': 'long',
            'Boolean': 'boolean',
            "String[]": "string[]",
            "Int[]": "int[]",
            "Long[]": "long[]",
            "Double[]": "double[]",
            "Boolean[]": "boolean[]",
        };

        this.$contentsContainerWrapper = this.$parent.find('.brtc-va-editors-sheet-controls-propertycontrol');

        this.popupProperty.addPropertyControl('Condition', function ($parent) {
            _this.virtualColumnSelector = Brightics.VA.Core.Widget.Factory.virtualColumnSelectorControl($parent, {
                columns: columns,
                internalTypeMap: internalTypeMap,
                selectedColumns: _this.parseSelectParam(),
                onValidate: (isValid) => {
                    _this.$okButton.jqxButton({ disabled: !isValid });
                }
            });

            $parent.closest('.brtc-va-editors-sheet-panels-basepanel-contents-area').perfectScrollbar('destroy');

            _this.hideLoading();
        }, { mandatory: true });
    };

    SelectColumnDialog.prototype.getControlValue = function () {
        let checkedColumns = this.virtualColumnSelector.getCheckedColumns();
        let param = {
            input_cols: [],
            output_cols: [],
            output_types: []
        };
        checkedColumns.forEach(function (column) {
            param.input_cols.push(column.name);
            param.output_cols.push(column.alias);
            param.output_types.push(column.type);
        });
    
        return param;
    };
    
    SelectColumnDialog.prototype.handleOkClicked = function () {
        this.dialogResult.param = this.getControlValue();
        if (typeof this.$mainControl === 'undefined') return;
        this.dialogResult.OK = true;
        this.dialogResult.Cancel = false;

        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.FunctionProperties.SelectColumnDialog = SelectColumnDialog;
}).call(this);
