/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Dialogs.PropertiesPanelDialog.prototype;

    var PARAM_COL_NM = 'new_col';
    var PARAM_COL_TYPE = 'column_type';
    var PARAM_EXPR_TYPE = 'expr_type';
    var PARAM_CONDITIONS = 'conditions';
    var PARAM_VALUES = 'values';
    var PARAM_ELSE_VALUE = 'else_value';

    var CONTROL_CONDITION = 'control_condition',
        COL_TYPE_NUMBER = 'number';


    function AddColumnIfDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    AddColumnIfDialog.prototype = Object.create(_super);
    AddColumnIfDialog.prototype.constructor = AddColumnIfDialog;

    AddColumnIfDialog.prototype.createContentsAreaControls = function ($parent) {

        this.control = {
            [PARAM_CONDITIONS]: [],
            [PARAM_VALUES]: []
        };

        this.createColumnInfoControl();
        this.createConditionControl();
    };


    AddColumnIfDialog.prototype.renderValues = function () {
        this.renderColumnName();
        this.renderColumnType();
        this.renderExprType();
        this.renderCondition();
    };

    AddColumnIfDialog.prototype.createColumnInfoControl = function () {
        this.$columnInfoArea = $('<div class="brtc-va-editors-sheet-controls-propertycontrol direction-row"></div>');
        this.popupProperty.$contentsArea.append(this.$columnInfoArea);
        this.createColumnNameControl();
        this.createColumnTypeControl();
        this.createExprTypeControl();
    };

    AddColumnIfDialog.prototype.createColumnNameControl = function () {
        var _this = this;
        var label = 'New Column Name';
        this.popupProperty.addPropertyControl(label, function ($parent) {
            _this.control[PARAM_COL_NM] = _this.createInput($parent, {
                key: PARAM_COL_NM,
                label: label,
                widgetOption: {
                    height: '29px'
                }
            });
        }, {
            mandatory: true,
            propertyControlParent: _this.$columnInfoArea
        });
    };

    AddColumnIfDialog.prototype.createExprTypeControl = function () {
        var _this = this;

        var EXPR_TYPE = [
            {label: 'SQLite', value: 'sqlite'},
            {label: 'Python', value: 'python'}
        ];
        var $newValueInput = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        this.popupProperty.addPropertyControl('Expression Type', function ($parent) {
            $parent.append($newValueInput);
            _this.control[PARAM_EXPR_TYPE] = _this.createDropDownList($newValueInput, {
                widgetOption: {
                    source: EXPR_TYPE,
                    selectedIndex: 0,
                    displayMember: 'label',
                    valueMember: 'value'
                }
            });

        }, {mandatory: true, propertyControlParent: _this.$columnInfoArea});
    };


    AddColumnIfDialog.prototype.createColumnTypeControl = function () {
        var _this = this;

        var OUT_COLUMN_TYPES = [
            {label: 'String', value: 'string'},
            {label: 'Number', value: COL_TYPE_NUMBER}
        ];
        var $newValueInput = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        this.popupProperty.addPropertyControl('New Column Type', function ($parent) {
            $parent.append($newValueInput);
            _this.control[PARAM_COL_TYPE] = _this.createDropDownList($newValueInput, {
                widgetOption: {
                    source: OUT_COLUMN_TYPES,
                    selectedIndex: 0,
                    displayMember: 'label',
                    valueMember: 'value'
                }
            });

        }, {mandatory: true, propertyControlParent: _this.$columnInfoArea});
    };

    var TYPE_IF = 'IF';
    var TYPE_ELSE = 'ELSE';

    AddColumnIfDialog.prototype.createConditionControl = function () {
        var _this = this;

        this.$ifArea = $('<div>');

        this.popupProperty.addPropertyControl('Condition', function ($parent) {
            _this.$deckTarget = $parent;
            $parent.append(_this.$ifArea);
            _this.createAddButton();
        }, {mandatory: true});

        this.bindConditionControl();
    };


    AddColumnIfDialog.prototype.createAddButton = function () {
        var _this = this;
        var $addConditionButton = $('<input type="button" class="brtc-va-conditional-update-property add-else-if-button" value="+ Add Else if"/>');
        this.$deckTarget.append($addConditionButton);
        $addConditionButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 25
        });

        $addConditionButton.click(function () {
            _this.createDeckControl(TYPE_IF);
        });
    };

    AddColumnIfDialog.prototype.bindConditionControl = function () {
        var _this = this;
        this.control[CONTROL_CONDITION] = {};
        this.control[CONTROL_CONDITION].setValue = function (conditions, values, elseValue) {
            if (conditions.length > 0 && values.length > 0) {

                for (var i = 0; i < conditions.length; i++) {
                    _this.createDeckControl(TYPE_IF);
                    _this.control[PARAM_CONDITIONS][i].setValue(conditions[i]);
                    _this.control[PARAM_VALUES][i].setValue(values[i]);
                }

                _this.createDeckControl(TYPE_ELSE);
                _this.control[PARAM_ELSE_VALUE].setValue(elseValue);

            } else {
                _this.createDeckControl(TYPE_IF);
                _this.createDeckControl(TYPE_ELSE);
            }
        };

        this.control[CONTROL_CONDITION].getValue = function () {
            var conditionArr = [], valueArr = [];
            var elseValue = _this.control[PARAM_ELSE_VALUE].getValue();
            var type = _this.control[PARAM_COL_TYPE].getValue();

            if (type == COL_TYPE_NUMBER) {
                elseValue = Number(elseValue);
            }
            var exprArr = _this.control[PARAM_VALUES];

            exprArr.forEach(function (elem, idx) {
                conditionArr.push(_this.control[PARAM_CONDITIONS][idx].getValue());
                if (type == COL_TYPE_NUMBER) {
                    valueArr.push(Number(elem.getValue()));
                } else {
                    valueArr.push(elem.getValue());
                }
            });

            return {
                [PARAM_CONDITIONS]: conditionArr,
                [PARAM_VALUES]: valueArr,
                [PARAM_ELSE_VALUE]: elseValue
            }
        };
    };


    AddColumnIfDialog.prototype.createDeckControl = function (type) {
        var _this = this;

        var $deckControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-deck"/>');
        $deckControl.addClass('brtc-style-display-flex');

        if (type === TYPE_IF) {
            this.$ifArea.append($deckControl);
            this.createRemoveButton($deckControl);
            this.createExprControl($deckControl, type);
            this.createValueControl($deckControl, type);
        } else {
            this.$deckTarget.append($deckControl);
            this.createValueControl($deckControl, type);
        }
    };

    AddColumnIfDialog.prototype.createRemoveButton = function ($parent) {
        var $removeButton = $('<div class ="brtc-va-editors-sheet-controls-propertycontrol-deck-remove"></div>');
        $parent.append($removeButton);

        var _this = this;
        $removeButton.click(function (event) {
            var $target = $(this).closest('.brtc-va-editors-sheet-controls-propertycontrol-deck');
            var index = $target.index();
            if (index > -1) {
                _this.control[PARAM_CONDITIONS].splice(index, 1);
                _this.control[PARAM_VALUES].splice(index, 1);
            }
            $target.remove();
            event.stopPropagation();
        });
    };

    AddColumnIfDialog.prototype.createExprControl = function ($parent, type) {
        var exprControl = this.createTextArea($parent, {
            widgetOption: {
                placeholder: 'Condition Expression',
                height: '29px',
                scrollbarStyle: 'null',
                lineWrapping: true,
            }, addClass: 'brtc-style-flex-2'
        });
        if (type === TYPE_IF && this.control[PARAM_COL_NM].getValue() != '') {
            exprControl.codeMirror.focus()
        }

        $parent.find('.brtc-va-editors-sheet-controls-propertycontrol-textareacontrol').css({'max-width': '336px'});
        this.control[PARAM_CONDITIONS].push(exprControl);
    };

    AddColumnIfDialog.prototype.createValueControl = function ($parent, type) {
        var control = this.createInput($parent, {
            addClass: 'brtc-style-flex-1',
            widgetOption: {
                height: '29px'
            }
        });
        if (type === TYPE_IF) {
            this.control[PARAM_VALUES].push(control);
        } else {
            this.control[PARAM_ELSE_VALUE] = control;
        }
    };


    AddColumnIfDialog.prototype.getControlValue = function () {
        return $.extend(true, {},
            {
                [PARAM_COL_NM]: this.control[PARAM_COL_NM].getValue(),
                [PARAM_EXPR_TYPE]: this.control[PARAM_EXPR_TYPE].getValue()
            },
            this.control[CONTROL_CONDITION].getValue()
        );

    };

    AddColumnIfDialog.prototype.handleOkClicked = function () {
        // if (this.problems.length > 0) {
        //     Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There is a problem with some values.');
        // } else {
        this.dialogResult.param = this.getControlValue();
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
        // }
    };

    AddColumnIfDialog.prototype.fillControlValues = function () {
        this.columnData = this.popupProperty.getColumnsOfInTable(0, ["number", "string"]).map(function (col) {
            return col.name;
        });
    };

    AddColumnIfDialog.prototype.renderColumnName = function () {
        var paramVal = this.options.fnUnit.param[PARAM_COL_NM];
        this.control[PARAM_COL_NM].setValue(paramVal);
        //FIXME: wrapper에 class추가방법
        this.control[PARAM_COL_NM].closest('.brtc-va-editors-sheet-controls-propertycontrol').css({
            'flex-grow': 2
        });
    };

    AddColumnIfDialog.prototype.renderColumnType = function () {
        var paramVal = this.options.fnUnit.param[PARAM_VALUES];
        if (paramVal && typeof paramVal[0] == COL_TYPE_NUMBER) {
            this.control[PARAM_COL_TYPE].setValue(COL_TYPE_NUMBER);
        }
        this.control[PARAM_COL_TYPE].closest('.brtc-va-editors-sheet-controls-propertycontrol').css({
            'flex-grow': 1
        });
    };

    AddColumnIfDialog.prototype.renderExprType = function () {
        var paramVal = this.options.fnUnit.param[PARAM_EXPR_TYPE];
        this.control[PARAM_EXPR_TYPE].setValue(paramVal);
        this.control[PARAM_EXPR_TYPE].closest('.brtc-va-editors-sheet-controls-propertycontrol').css({
            'flex-grow': 1
        });
    };

    AddColumnIfDialog.prototype.renderCondition = function () {
        var conditions = this.options.fnUnit.param[PARAM_CONDITIONS];
        var values = this.options.fnUnit.param[PARAM_VALUES];
        var elseValue = this.options.fnUnit.param[PARAM_ELSE_VALUE];
        this.control[CONTROL_CONDITION].setValue(conditions, values, elseValue);
    };

    AddColumnIfDialog.prototype.renderValidation = function () {
    };

    Brightics.VA.Core.Dialogs.FunctionProperties.AddColumnIfDialog = AddColumnIfDialog;

}).call(this);