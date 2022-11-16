/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Dialogs.PropertiesPanelDialog.prototype;

    var PARAM_MAIN_OPERATOR = 'main_operator';
    var PARAM_COLUMN = 'input_cols';
    var PARAM_OPERATOR = 'operators';
    var PARAM_OPERAND = 'operands';

    var CONTROL_CONDITION = 'conditions';


    function SimpleFilterDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    SimpleFilterDialog.prototype = Object.create(_super);
    SimpleFilterDialog.prototype.constructor = SimpleFilterDialog;

    SimpleFilterDialog.prototype.createContentsAreaControls = function ($parent) {
        this.control = {
            [PARAM_COLUMN]: [],
            [PARAM_OPERATOR]: [],
            [PARAM_OPERAND]: []
        };

        this.createConditionControl();
    };


    SimpleFilterDialog.prototype.renderValues = function () {
        this.renderCondition();
    };

    SimpleFilterDialog.prototype.createConditionControl = function () {
        var _this = this;

        this.operandSource = {
            string: [
                {label: '==', value: '=='},
                {label: '!=', value: '!='},
                {label: 'In', value: 'in'},
                {label: 'Not In', value: 'not in'},
                {label: 'Starts With', value: 'starts with'},
                {label: 'Ends With', value: 'ends with'},
                {label: 'Contain', value: 'contain'},
                {label: 'Not Contain', value: 'not contain'}
            ],
            number: [
                {label: '==', value: '=='},
                {label: '!=', value: '!='},
                {label: '<', value: '<'},
                {label: '<=', value: '<='},
                {label: '>', value: '>'},
                {label: '>=', value: '>='},
                {label: 'In', value: 'in'},
                {label: 'Not In', value: 'notIn'}
            ]
        };

        this.$deckArea = $('<div>');
        this.popupProperty.addPropertyControl('Condition', function ($parent) {
            _this.$deckTarget = $parent;
            _this.createAndOrControl();
            $parent.append(_this.$deckArea);
        }, {mandatory: true});

        this.createAddButton();

        this.bindConditionControl();
    };

    SimpleFilterDialog.prototype.createAndOrControl = function () {
        var $andOrDiv = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-input-and"></div>');
        $andOrDiv.css('height', '30px');
        this.$deckTarget.append($andOrDiv);

        var source = [
            {label: 'And', value: 'and'},
            {label: 'Or', value: 'or'}
        ];

        this.control[PARAM_MAIN_OPERATOR] = this.createRadioButton($andOrDiv, {
            widgetOption: {
                width: '60'
            },
            value: source[0].value,
            key: PARAM_MAIN_OPERATOR,
            source: source,
            addCSS: {float: 'left'}
        })

    };

    SimpleFilterDialog.prototype.createDeckControl = function () {
        var _this = this;
        var $deckControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-deck"/>');
        $deckControl.addClass('brtc-style-display-flex');
        this.$deckArea.append($deckControl);

        this.createRemoveButton($deckControl);
        this.createColumnControl($deckControl);
        this.createOperatorControl($deckControl);
        this.createOperandControl($deckControl);

    };

    SimpleFilterDialog.prototype.createRemoveButton = function ($parent) {
        var $removeButton = $('<div class ="brtc-va-editors-sheet-controls-propertycontrol-deck-remove"></div>');
        $parent.append($removeButton);

        //Remove Event
        var _this = this;
        $removeButton.click(function (event) {
            var $target = $(this).closest('.brtc-va-editors-sheet-controls-propertycontrol-deck');
            var index = $target.index() ;
            if (index > -1) {
                _this.control[PARAM_COLUMN].splice(index, 1);
                _this.control[PARAM_OPERATOR].splice(index, 1);
                _this.control[PARAM_OPERAND].splice(index, 1);
            }
            $target.remove();
            event.stopPropagation();
        });
    };


    SimpleFilterDialog.prototype.createColumnControl = function ($parent) {
        var _this = this;
        var widgetOptions = {
            rowCount: 1,
            multiple: false,
            height: 27,
            changed: function (type, data) {
                var _type = '';
                for (var i in _this.columnObjectData) {
                    if (_this.columnObjectData[i].name === data.items[0]) {
                        _type = _this.columnObjectData[i].type;
                        break;
                    }
                }
                if(type !== 'remove'){
                    var $target = $parent.closest('.brtc-va-editors-sheet-controls-propertycontrol-deck');
                    var index = $target.index();

                    _this.control.operators[index].jqxDropDownList({
                        disabled: false,
                        source: _this.operandSource[_type]
                    });
                }
            }
        };

        var columnControl = this.createColumnList($parent, {
            widgetOption: widgetOptions,
            addClass: 'brtc-style-flex-2'
        });

        columnControl.setItems(this.columnObjectData);
        this.control[PARAM_COLUMN].push(columnControl);
    };


    SimpleFilterDialog.prototype.createOperatorControl = function ($parent) {
        this.control[PARAM_OPERATOR].push(this.createDropDownList($parent, {
            widgetOption: {
                source: this.operandSource.number,
                placeHolder: '',
                height: '27px !important'
            },
            addCSS: {
                width: '20%'
            }
        }));
    };


    SimpleFilterDialog.prototype.createOperandControl = function ($parent) {
        var $operandInput = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-input-condition-operand brtc-style-flex-2"/>');
        $parent.append($operandInput);
        this.control[PARAM_OPERAND].push($operandInput);

        $operandInput.getValue = function () {
            // if ($operandInput.columnControl.getSelectedItems()[0]) {
            //     return '[' + $operandInput.columnControl.getSelectedItems()[0] + ']';
            // } else {
                return $operandInput.stringControl.val();
            // }
        };

        // this.createOperandTypeControl($operandInput);
        // this.createOperandColumnControl($operandInput);
        this.createOperandStringControl($operandInput);
    };

    SimpleFilterDialog.prototype.createOperandTypeControl = function ($parent) {
        var _this = this;
        var $operandType = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-operandtype brtc-va-editors-sheet-controls-wrapper"/>');
        $operandType.css({height: '29px', 'margin-left': '4px'});
        $parent.append($operandType);

        var $columnButton = $('' +
            '<button type="button" name="column" class="brtc-va-editors-sheet-panels-propertycontrol-button">' +
            'Column' +
            '</button>');
        $operandType.append($columnButton);

        var $stringButton = $('' +
            '<button type="button" name="value" class="brtc-va-editors-sheet-panels-propertycontrol-button">' +
            'Value' +
            '</button>');
        $operandType.append($stringButton.css('border-left', 'none'));

        $columnButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '50%',
            height: '100%'
        });
        $stringButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '50%',
            height: '100%'
        });
        $columnButton.click(function () {
            _this.operandTypeEvent($parent, 'column');
        });
        $stringButton.click(function () {
            _this.operandTypeEvent($parent, 'string');
        });

        $parent.operandType = $operandType;
    };

    SimpleFilterDialog.prototype.createOperandColumnControl = function ($parent) {
        var _this = this;
        var $columnInput = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columncontrol brtc-va-editors-sheet-controls-width-10"/>');
        $columnInput.css({width: '192px', 'margin-left': '2px'});
        var $remove = $('' +
            '<span class="brtc-va-editors-sheet-controls-propertycontrol-columncontrol-remove">' +
            '   <i class="fa fa-minus-circle"></i>' +
            '</span>');
        $parent.append($columnInput).append($remove);

        $remove.click(function (event) {
            var _columnValBefore = $parent.columnControl.getSelectedItems();
            _this.operandTypeEvent($parent, 'type');

            $parent.columnControl.removeColumnUnit(_columnValBefore[0]);
        });

        var widgetOptions = {
            rowCount: 1,
            multiple: false,
            showOpener: 'click',
            removable: true,
            sort: 'ascending',
            height: 27
        };

        var columnControl = this.createColumnList($columnInput,  {
            widgetOption: widgetOptions
        });
        $parent.append(columnControl);
        columnControl.setItems(this.columnObjectData);
        $parent.columnControl = columnControl;
        $parent.columnControlRemove = $remove;
    };

    SimpleFilterDialog.prototype.createOperandStringControl = function ($parent) {
        var _this = this;
        var $stringInput = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-stringinputcontrol brtc-va-editors-sheet-controls-width-10"/>');
        $stringInput.css({'height': '23px','margin-left': '4px', 'padding-left': '5px', 'padding-right': '5px'});
        var $remove = $('' +
            '<span class="brtc-va-editors-sheet-controls-propertycontrol-stringinputcontrol-remove">' +
            '   <i class="fa fa-minus-circle"></i>' +
            '</span>');
        $parent.append($stringInput).append($remove);

        $remove.click(function (event) {
            var _stringValBefore = $parent.stringControl.val();

            _this.operandTypeEvent($parent, 'type');

            if (_stringValBefore != '') {
                $parent.stringControl.val('');
            }
        });

        this.createInput($stringInput, {
            widgetOption: {}
        });

        $parent.stringControl = $stringInput;
        $parent.stringControlRemove = $remove;
    };

    SimpleFilterDialog.prototype.operandTypeEvent = function ($operandInput, operandType) {
        if (operandType == 'column') {
            $operandInput.operandType.css({display: 'none'});
            $operandInput.columnControl.$parent.css({display: 'block'});
            $operandInput.stringControl.css({display: 'none'});
            $operandInput.columnControlRemove.css({display: 'block'});
            $operandInput.stringControlRemove.css({display: 'none'});
        } else if (operandType == 'string') {
            $operandInput.operandType.css({display: 'none'});
            $operandInput.columnControl.$parent.css({display: 'none'});
            $operandInput.stringControl.css({display: 'block'});
            $operandInput.columnControlRemove.css({display: 'none'});
            $operandInput.stringControlRemove.css({display: 'block'});
        } else {
            $operandInput.operandType.css({display: 'block'});
            $operandInput.columnControl.$parent.css({display: 'none'});
            $operandInput.stringControl.css({display: 'none'});
            $operandInput.columnControlRemove.css({display: 'none'});
            $operandInput.stringControlRemove.css({display: 'none'});
        }
    };

    SimpleFilterDialog.prototype.createAddButton = function () {
        var $buttonElem = $('<input type="button" class="brtc-va-editors-sheet-controls-propertycontrol-addbutton" value="+ Add Condition"/>');
        this.$deckTarget.append($buttonElem);

        var $addBtnControl = this.popupProperty.createButton($buttonElem, {
            width: '100%',
            height: 25
        });

        var _this = this;
        $addBtnControl.click(function () {
            _this.createDeckControl();

            // _this.operandTypeEvent(_this.control[PARAM_OPERAND][_this.control[PARAM_OPERAND].length - 1], 'type');
        });

    };

    SimpleFilterDialog.prototype.bindConditionControl = function () {
        var _this = this;
        this.control[CONTROL_CONDITION] = {};
        this.control[CONTROL_CONDITION].setValue = function (params) {
            var operator = params[PARAM_MAIN_OPERATOR],
                columnArr = params[PARAM_COLUMN],
                operatorArr = params[PARAM_OPERATOR],
                operandArr = params[PARAM_OPERAND];

            _this.control[PARAM_MAIN_OPERATOR].setValue(operator);

            if (operatorArr.length > 0) {
                for (var i = 0; i < operatorArr.length; i++) {
                    _this.createDeckControl();

                    var _type = 'number';
                    for (var j in _this.columnObjectData) {
                        if (_this.columnObjectData[j].name === columnArr[i]) {
                            _type = _this.columnObjectData[j].type;
                            break;
                        }
                    }

                    _this.control.operators[i].jqxDropDownList({
                        disabled: false,
                        source: _this.operandSource[_type],
                        selectedIndex: 0,
                    });

                    _this.control[PARAM_COLUMN][i].setValue([columnArr[i]]);
                    _this.control[PARAM_OPERATOR][i].setValue(operatorArr[i]);

                    // if (operandArr[i] != undefined && operandArr[i].indexOf('[') > -1) {
                    //     // _this.operandTypeEvent(_this.control[PARAM_OPERAND][i], 'column');
                    //     // _this.control["operands"][i].columnControl.setSelectedItems(operandArr[i] ? [operandArr[i].substring(1, operandArr[i].length - 1)] : []);
                    //     _this.control["operands"][i].stringControl.val(operandArr[i] ? [operandArr[i].substring(1, operandArr[i].length - 1)] : []);
                    // }
                    // else
                    _this.control["operands"][i].stringControl.val(operandArr[i]);
                }

            } else {
                _this.createDeckControl();

                // _this.operandTypeEvent(_this.control[PARAM_OPERAND][0], 'type');
            }

        };

        this.control[CONTROL_CONDITION].getValue = function () {
            var operator = _this.control[PARAM_MAIN_OPERATOR].getValue();

            var columnArr = _this.control[PARAM_COLUMN].map(function (control) {
                return control.getValue()[0];
            });
            var operatorArr = _this.control[PARAM_OPERATOR].map(function (control) {
                return control.getValue();
            });
            var operandArr = _this.control[PARAM_OPERAND].map(function (control) {
                return control.getValue();
            });

            return {
                [PARAM_MAIN_OPERATOR]: operator,
                [PARAM_COLUMN]: columnArr,
                [PARAM_OPERATOR]: operatorArr,
                [PARAM_OPERAND]: operandArr
            }
        };
    };

    SimpleFilterDialog.prototype.getControlValue = function () {
        return $.extend(true, {},
            this.control[CONTROL_CONDITION].getValue()
        );

    };

    SimpleFilterDialog.prototype.handleOkClicked = function () {
        this.dialogResult.param = this.getControlValue();
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    SimpleFilterDialog.prototype.fillControlValues = function () {
        this.columnObjectData = this.popupProperty.getColumnsOfInTable(0, ["number", "string"]);
        this.columnData = this.popupProperty.getColumnsOfInTable(0, ["number", "string"]).map(function (col) {
            return col.name;
        });
    };

    SimpleFilterDialog.prototype.renderCondition = function () {
        if (this.control) {
            var params = this.options.fnUnit.param;
            this.control[CONTROL_CONDITION].setValue(params);
        }
    };

    SimpleFilterDialog.prototype.renderValidation = function () {
    };

    Brightics.VA.Core.Dialogs.FunctionProperties.SimpleFilterDialog = SimpleFilterDialog;

}).call(this);