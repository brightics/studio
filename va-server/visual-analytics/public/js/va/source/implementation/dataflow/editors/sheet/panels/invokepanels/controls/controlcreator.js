/**
 * Created by SDS on 2018-07-09.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var numberTypeList = ['Double', 'Integer', 'Long', 'Float'];

    function UdfInvokeControlCreator(udfInvokeProperties) {
        this._super = udfInvokeProperties;
    }

    UdfInvokeControlCreator.prototype.createInvokeControl = function (spec) {
        var typeVal, $control, isGlobal = false;
        if (spec.control === 'ColumnSelector') {
            $control = this.createColumnSelectorControl(spec);
            typeVal = (spec.multiple) ? 'array' : 'string';
        } else if (spec.control === 'InputBox') {
            $control = this.createInputBoxControl(spec);
            typeVal = spec.type.toLowerCase() === 'string' ? 'string' : 'number';
            isGlobal = true;
        } else if (spec.control === 'DropDownList') {
            $control = this.createDropDownListControl(spec);
            typeVal = 'string';
        } else if (spec.control === 'RadioButton') {
            $control = this.createRadioButtonControl(spec);
            typeVal = 'string';
        } else if (spec.control === 'BooleanRadio') {
            $control = this.createBooleanRadioButtonControl(spec);
            typeVal = 'boolean';
        } else if (spec.control === 'CheckBox') {
            $control = this.createCheckBoxControl(spec);
            typeVal = 'array';
        } else if (spec.control === 'ArrayInput') {
            $control = this.createArrayInputControl(spec);
            typeVal = 'array[' + (spec.type.toLowerCase() === 'string' ? 'string' : 'number') + ']';
            isGlobal = true;
        } else if (spec.control === 'Expression') {
            $control = this.createExpressionControl(spec);
            typeVal = 'string';
            isGlobal = true;
        } else if (spec.control === 'FileSelector') {
            $control = this.createLocalFileSelector(spec);
            typeVal = 'array';
            isGlobal = true;
        } else {
            console.error(spec.control + ' is unsupported control in toolkit spec.');
            return;
        }
        if (isGlobal) {
            var $label = $control.find('.brtc-va-editors-sheet-controls-propertycontrol-label');
            this._super.addGlobalVariableControl($label, {}, spec.id, spec.label, {type: typeVal});
        }
    };

    UdfInvokeControlCreator.prototype.createLocalFileSelector = function (spec) {
        var _this = this;
        var id = spec.id;

        this._super.$elements[id] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-contents"/>');
        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            var $fileSelector = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input-readonly"/>');
            _this._super.createInput($fileSelector, {
                placeHolder: Brightics.VA.Core.Utils.WidgetUtils.convertInequalitySign(spec.placeHolder)
            }, 'brtc-va-editors-sheet-controls-margin-bottom');
            $fileSelector.prop('readonly', true);
            $container.append($fileSelector.parent());
            $fileSelector.click(function () {
                new Brightics.VA.Core.Dialogs.RepositoryBrowserDialog(_this._super.$mainControl, {
                    pathLabel: spec.label,
                    filePath: $fileSelector.val(),
                    close: function (dialogResult) {
                        if (dialogResult.OK && dialogResult.selectedFile) {
                            var renderInput = function (val, id) {
                                var preVal = $fileSelector.val();
                                var currentVal = val[0] || '';

                                if (preVal !== currentVal) {
                                    var createFsPathCommand = function (value) {
                                        var commandOption = {
                                            fnUnit: this._super.options.fnUnit,
                                            ref: {param: {}}
                                        };
                                        commandOption.ref.param[id] = [value];

                                        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
                                        return command;
                                    }.bind(this);
                                    var command = createFsPathCommand(currentVal);
                                    this._super.executeCommand(command);
                                }
                                $fileSelector.val(currentVal);
                                $fileSelector.attr('title', currentVal);
                            }.bind(_this);
                            renderInput([dialogResult.selectedFile], id);
                        }
                    },
                    resizable: false,
                    title: 'Setting ' + spec.label
                });
            });
            _this._super.controls[id] = $fileSelector;
            _this._super.$elements[id].on('change', function (event) {
                if (!_this._super.isInputValueChanged(id, $(this).val())) return;
                var command = _this._super.createSetParameterValueCommand(id, $(this).val());
                _this._super.executeCommand(command);
            });
        }, {mandatory: spec.mandatory ? true : false});
        return $propertyControl;
    };


    UdfInvokeControlCreator.prototype.createColumnSelectorControl = function (spec) {
        var _this = this;
        var id = spec.id;

        this._super.$elements[id] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');
        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            $container.append(_this._super.$elements[id]);
            var opt = {"multiple": spec.multiple, "maxRowCount": spec.rowCount};
            if (spec.multiple) {
                opt.changed = function (type, data) {
                    var command = _this._super.createSetParameterValueCommand(id, data.items);
                    _this._super.executeCommand(command)
                };
            } else {
                opt.changed = function (type, data) { // make data array
                    var command = _this._super.createSetParameterValueCommand(id, data.items[0] || '');
                    _this._super.executeCommand(command)
                };
            }
            _this._super.controls[id] = _this._super.createColumnList(_this._super.$elements[id], opt);
            var columnSelector = {
                control: _this._super.controls[id],
                spec: spec
            };
            if (spec.columnType) {
                columnSelector.columnType = spec.columnType;
            }

            _this._super._columnSelectorList.push(columnSelector);
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };

    UdfInvokeControlCreator.prototype.createArrayInputControl = function (spec) {
        var _this = this;
        var id = spec.id;

        this._super.$elements[id] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            $container.append(_this._super.$elements[id]);
            var opt = {
                placeholder: Brightics.VA.Core.Utils.WidgetUtils.convertInequalitySign(spec.placeHolder) || ''
            };
            if (numberTypeList.indexOf(spec.type) >= 0) {
                opt.type = 'number';
            } else {
                opt.type = 'string';
            }

            opt.onChangeCallback = function (data) {
                var command = _this._super.createSetParameterValueCommand(id, data);
                _this._super.executeCommand(command)
            };
            _this._super.controls[id] = _this._super.createArrayInput(_this._super.$elements[id], opt);
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };


    UdfInvokeControlCreator.prototype.createInputBoxControl = function (spec) {
        if (numberTypeList.indexOf(spec.type) >= 0) {
            return this.createNumericInputBoxControl(spec);
        } else {
            return this.createStringInputBoxControl(spec);
        }
    };

    UdfInvokeControlCreator.prototype.createNumericInputBoxControl = function (spec) {
        var _this = this;
        var id = spec.id;

        this._super.$elements[id] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');

        var $propertyControl = this._super.addPropertyControl(spec.label, function ($parent) {
            $parent.append(_this._super.$elements[id]);
            var options = {
                placeholder: Brightics.VA.Core.Utils.WidgetUtils.convertInequalitySign(spec.placeHolder) || ''
            };

            if (typeof spec.min !== 'undefined') {
                options.min = spec.min;
            }

            if (typeof spec.max !== 'undefined') {
                options.max = spec.max;
            }

            if (spec.type === 'Integer') {
                options.numberType = 'int'
            }else if(spec.type === 'Float') {
                options.numberType = 'float'
            } else {
                options.numberType = 'double'
            }

            _this._super.controls[id] = _this._super.createNumericInput(_this._super.$elements[id], options);

            _this._super.controls[id].onChange(function () {
                var val = _this._super.controls[id].getValue();
                val = val === '' ? '' : Number(val);
                var command = _this._super.createSetParameterValueCommand(id, val);
                _this._super.executeCommand(command);
            });
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };

    UdfInvokeControlCreator.prototype.createStringInputBoxControl = function (spec) {
        var _this = this;
        var id = spec.id;

        this._super.$elements[id] = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            $container.append(_this._super.$elements[id]);
            var opt = {"placeHolder": Brightics.VA.Core.Utils.WidgetUtils.convertInequalitySign(spec.placeHolder) || ''};
            _this._super.controls[id] = _this._super.createInput(_this._super.$elements[id], opt);
            _this._super.$elements[id].on('change', function (event) {
                if (!_this._super.isInputValueChanged(id, $(this).val())) return;
                var command = _this._super.createSetParameterValueCommand(id, $(this).val());
                _this._super.executeCommand(command);
            });
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };


    UdfInvokeControlCreator.prototype.createDropDownListControl = function (spec) {
        var _this = this;
        var id = spec.id;

        this._super.$elements[id] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            $container.append(_this._super.$elements[id]);
            var opt = {"source": spec.items};
            _this._super.controls[id] = _this._super.createDropDownList(_this._super.$elements[id], opt);
            _this._super.controls[id].on('change', function (event) {
                if (event.args.item !== null) {
                    var command = _this._super.createSetParameterValueCommand(id, event.args.item.value);
                    _this._super.executeCommand(command);
                }

            });
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };

    UdfInvokeControlCreator.prototype.createBooleanRadioButtonControl = function (spec) {
        var _this = this;
        var items = spec.items;
        var id = spec.id;
        if (!items) items = [];
        if (items.length === 0) {
            items.push({value: true, label: 'True', default: spec.defaultValue});
            items.push({value: false, label: 'False', default: !spec.defaultValue});
        }

        this._super.controls[id] = {};
        var controlMap = this._super.controls[id];


        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            _this._super.$elements[id] = $container;

            for (var i in items) {

                var radioControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton" value="' + items[i].value + '">' + items[i].label + '</div>');

                $container.append(radioControl);
                controlMap[items[i].value] = _this._super.createRadioButton(radioControl, {
                    width: 'undefined',
                    groupName: id,
                    checked: items[i].default
                });
                controlMap[items[i].value].on('checked', function (event) {
                    var realValue = this.getAttribute('value') === true || this.getAttribute('value') === 'true'
                    var command = _this._super.createSetParameterValueCommand(id, realValue);
                    _this._super.executeCommand(command);
                });
            }
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };

    UdfInvokeControlCreator.prototype.createRadioButtonControl = function (spec) {
        var _this = this;
        var items = spec.items;
        var id = spec.id;

        this._super.controls[id] = {};
        var controlMap = this._super.controls[id];


        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            _this._super.$elements[id] = $container;

            for (var i in items) {

                var radioControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton" value="' + items[i].value + '">' + items[i].label + '</div>');

                $container.append(radioControl);
                controlMap[items[i].value] = _this._super.createRadioButton(radioControl, {
                    width: 'undefined',
                    groupName: id,
                    checked: items[i].default
                });
                controlMap[items[i].value].on('checked', function (event) {
                    var command = _this._super.createSetParameterValueCommand(id, this.getAttribute('value'));
                    _this._super.executeCommand(command);
                });
            }
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };

    UdfInvokeControlCreator.prototype.createCheckBoxControl = function (spec) {
        var _this = this;
        var items = spec.items;
        var id = spec.id;

        this._super.controls[id] = {};
        var controlMap = this._super.controls[id];
        var $checkBoxContainer = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox-container"></div>');
        var $selectAllButton = $('<input type="button" value="Select All" style="width: 100%; float:left; margin-left: 0px;"/>');
        var $clearAllButton = $('<input type="button" value="Unselect All" style="width: 100%; float:left; margin-left: 2px; margin-bottom: 2px;"/>');

        $checkBoxContainer.append($selectAllButton);
        $checkBoxContainer.append($clearAllButton);
        this._super.$elements[id] = $checkBoxContainer;

        for (var i in items) {
            controlMap[items[i].value] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton" value="' + items[i].value + '">' + items[i].label + '</div>');
        }

        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            $container.append($checkBoxContainer);
            _this._super.createButton($selectAllButton, {height: 23}, 'brtc-va-editors-sheet-controls-width-6');
            _this._super.createButton($clearAllButton, {height: 23}, 'brtc-va-editors-sheet-controls-width-6');

            var items = spec.items;
            var itemKey;
            var changeHandler = function () {
                $(window).trigger('mousedown');
                var checked = [];
                for (var i in items) {
                    itemKey = items[i].value;
                    if (controlMap[itemKey].val() === true) {
                        checked.push(controlMap[itemKey].data('tag'));
                    }
                }
                var command = _this._super.createSetParameterValueCommand(id, checked);
                _this._super.executeCommand(command);
            };
            for (var i in items) {
                itemKey = items[i].value;
                var $checkBoxControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox"></div>');
                $checkBoxControl.text(items[i].label);
                $checkBoxControl.data('tag', items[i].value);
                $checkBoxContainer.append($checkBoxControl);
                controlMap[itemKey] = _this._super.createCheckBox($checkBoxControl, {}, 'brtc-va-editors-sheet-controls-width-12');
                controlMap[itemKey].on('change', changeHandler);
            }
            $selectAllButton.on('click', function (event) {
                for (let i in items) {
                    itemKey = items[i].value;
                    controlMap[itemKey].off('change', changeHandler);
                    controlMap[itemKey].jqxCheckBox({checked: true});
                    controlMap[itemKey].on('change', changeHandler);
                }
                var checked = [];
                for (let i in items) {
                    itemKey = items[i].value;
                    checked.push(controlMap[itemKey].data('tag'));
                }
                var command = _this._super.createSetParameterValueCommand(id, checked);
                _this._super.executeCommand(command);
            });
            $clearAllButton.on('click', function (event) {
                for (var i in items) {
                    itemKey = items[i].value;
                    controlMap[itemKey].off('change', changeHandler);
                    controlMap[itemKey].jqxCheckBox({checked: false});
                    controlMap[itemKey].on('change', changeHandler);
                }
                var checked = [];
                var command = _this._super.createSetParameterValueCommand(id, checked);
                _this._super.executeCommand(command);
            });
        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };

    UdfInvokeControlCreator.prototype.createExpressionControl = function (spec) {
        var _this = this;
        var id = spec.id;
        this._super.$elements[id] = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-expression"/>');
        var $propertyControl = this._super.addPropertyControl(spec.label, function ($container) {
            $container.append(_this._super.$elements[id]);
            var aceOption = {
                mode: 'scala',
                commands: [],
                events: [],
                value: '',
                editorOptions: {
                    showLineNumbers: false,
                    showGutter: false
                }
            };


            _this._super.controls[id] = Brightics.VA.Core.Widget.Factory.aceEditorControl(_this._super.$elements[id], aceOption);

            var editor = _this._super.controls[id].getEditor();

            editor.on('blur', function (event) {
                if (!_this._super.isInputValueChanged(id, editor.getValue())) return;
                var command = _this._super.createSetParameterValueCommand(id, editor.getValue());
                _this._super.executeCommand(command);
            });


        }, {mandatory: spec.mandatory});
        return $propertyControl;
    };

    Brightics.VA.Implementation.DataFlow.UdfInvokeControlCreator = UdfInvokeControlCreator;

}).call(this);
