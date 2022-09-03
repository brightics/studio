/**
 * Created by SDS on 2016-09-05.
 */

/* global _, CodeMirror */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var PREFIX = 'variable';
    var SUFFIX = '';

    var VARIABLE = 'variable';
    var NAME = 'name-control';
    var VALUE = 'value-control';

    function Variable(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};

        _retrieveParent.bind(this)();

        this.init();
        this.createControls();
    }

    var _retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Variable.prototype.initTempDataStorage = function () {
        this.tempDataStorage = (function () {
            var storage = [];

            var newData = function (id, data) {
                return {
                    id: id,
                    data: data || {}
                };
            };

            var doIfDataExistsById = function (id, fn) {
                var index = _.findIndex(storage, function (dict) {
                    return dict.id === id;
                });
                if (index >= 0) return fn(storage[index].data);
            };

            var doIfDataExistsByIndex = function (index, fn) {
                if (storage[index]) return fn(storage[index].data);
            };

            var partialSetData = function (key, val) {
                return _.partial(_.set, _, key, val);
            };

            var partialGetData = function (key) {
                return _.partial(_.get, _, key);
            };

            return {
                init: function () {
                    storage = [];
                },
                push: function (id) {
                    storage.push(newData(id));
                },
                removeById: function (id) {
                    var index = _.findIndex(storage, function (dict) {
                        return dict.id === id;
                    });
                    if (index >= 0) storage.splice(index, 1);
                },
                splice: function (index, cnt, id) {
                    if (id) {
                        storage.splice(index, cnt, newData(id));
                    } else {
                        storage.splice(index, cnt);
                    }
                },
                putDataById: function (id, key, val) {
                    doIfDataExistsById(id, partialSetData(key, val));
                },
                getDataById: function (id, key) {
                    return doIfDataExistsById(id, partialGetData(key));
                },
                putDataByIndex: function (index, key, val) {
                    doIfDataExistsByIndex(index, partialSetData(key, val));
                },
                getDataByIndex: function (index, key) {
                    return doIfDataExistsByIndex(index, partialGetData(key));
                }
            };
        }());
    };

    Variable.prototype.init = function () {
        var _this = this;

        this.isRendered = false;
        this.propertyControls = [];
        this.index = 0;
        this.initTempDataStorage();

        this.commandListener = function (command) {
            if (_this.isRendered) {
                _this.isRendered = false;
                _this.handleCommand(command);
                _this.isRendered = true;
            } else {
                _this.handleCommand(command);
            }
        };

        this.options.editor.addCommandListener(this.commandListener);
        this.options.editor.addGoHistoryListener(this.commandListener);
    };

    Variable.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-views-variable">' +
            '       <input type="button" class="brtc-va-tools-sidebar-variable-button add-variable-button" value="+ '+ Brightics.locale.common.addVariable +'"/>' +
            '       <div class="brtc-va-tools-sidebar-variable-filter brtc-va-searcharea">' +
            '           <input type="search" class="brtc-va-tools-sidebar-variable-filter-input" maxlength="80"/>' +
            '       </div>' +
            '       <div class="brtc-va-tools-sidebar-variable-list">' +
            '       </div>' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.$filter = this.$mainControl.find('.brtc-va-tools-sidebar-variable-filter');
        this.$variableList = this.$mainControl.find('.brtc-va-tools-sidebar-variable-list');

        this.createFilterControl();
        this.createAddVariableButton();

        this.refresh();

        this.$variableList.perfectScrollbar();
    };

    Variable.prototype.refresh = function () {
        this.variables = [];
        this.propertyControls = [];
        this.tempDataStorage.init();
        this.$variableList.find('.brtc-va-tools-sidebar-variable-deck').remove();

        this.parseVariables();
        this.renderValues(this.variables);
    };

    Variable.prototype.parseVariables = function () {
        if (this.options.editor.getModel().type === 'control') {
            this.variables = this.options.editor.getModel().variables;
        } else {
            for (var key in this.options.editor.getModel().variables) {
                this.variables.push({
                    name: key,
                    type: this.options.editor.getModel().variables[key].type,
                    value: this.options.editor.getModel().variables[key].value || ''
                });
            }
        }
    };

    Variable.prototype.createFilterControl = function () {
        var _this = this;
        var $filterInput = this.$filter.find('.brtc-va-tools-sidebar-variable-filter-input');

        $filterInput.jqxInput({
            placeHolder: Brightics.locale.common.searchVariable,
            theme: Brightics.VA.Env.Theme
        });
        var applyFilter = function (event) {
            var filterValue = event.target.value.toLowerCase();

            var variableItems = _this.$mainControl.find('.brtc-va-tools-sidebar-variable-name');
            $.each(variableItems, function (index, item) {
                $(item).find('.CodeMirror').each(function (i, $el) {
                    var matched = $el.CodeMirror.getValue().toLowerCase().indexOf(filterValue) > -1;
                    $(item).parents(".brtc-va-tools-sidebar-variable-deck").css('display', matched ? 'block' : 'none');
                });
            });
            _this.$variableList.perfectScrollbar('update');
        };
        $filterInput.keyup(function (event) {
            applyFilter(event);
        });

        $filterInput.on('search', function () {
            applyFilter(event);
        });
    };


    Variable.prototype.createAddVariableButton = function () {
        var _this = this;
        this.$addVariableButton = this.$mainControl.find(".add-variable-button");
        this.$addVariableButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        this.$addVariableButton.click(function () {
            var variable = { type: 'string', name: PREFIX + ++_this.index, value: '' };
            _this.createAddVariableCommand(variable);
            _this.$variableList.perfectScrollbar('update');
        });
    };

    Variable.prototype.removeVariableControl = function (variable, index) {
        var target = index;
        if (index <= -1) {
            target = this.propertyControls.length - 1;
        }

        Brightics.VA.Core.Utils.WidgetUtils.destroyJqxControl(this.propertyControls[target]);
        this.propertyControls[target].remove();
        this.propertyControls.splice(target, 1);
        this.tempDataStorage.splice(target, 1);
    };

    Variable.prototype.updateVariableControl = function (variable, index) {
        var $variable = this.propertyControls[index];
        var $type = $variable.find('.brtc-va-tools-sidebar-variable-type');

        $type.val(variable.type);

        var getData = _.partial(this.tempDataStorage.getDataByIndex, index);
        this.setVariableName(getData(NAME), variable.name);
        getData(VALUE).setInputValue(variable.value);
    };

    Variable.prototype.setVariableName = function (codeMirror, value) {
        var nameValue = this.wrap(value);
        codeMirror.setValue(nameValue);
        codeMirror.markText(
            {line: 0, ch: 0},
            {line: 0, ch: 2},
            {
                readOnly: true,
                inclusiveLeft: true,
                atomic: true
            });
        codeMirror.markText(
            {line: 0, ch: nameValue.length - 1},
            {line: 0, ch: nameValue.length},
            {
                readOnly: true,
                inclusiveRight: true,
                atomic: true
            });
    };

    Variable.prototype.createVariableControl = function (variable, index) {
        var _this = this;
        var $variable = $('' +
            '<div class="brtc-va-tools-sidebar-variable-deck">' +
            '   <div class ="brtc-va-tools-sidebar-variable-remove" />' +
            '   <div class="controls">' +
            '       <div class="control-row">' +
            '            <div class="brtc-va-editors-sheet-controls-wrapper brtc-va-tools-sidebar-variable-name">' +
            '                <textarea  class="brtc-va-widget-contents-input-control"/>' +
            '            </div>' +
            '       </div>' +
            '       <div class="control-row">' +
            '            <div class="brtc-va-tools-sidebar-variable-type"/>' +
            '       </div>' +
            '       <div>' +
            '            <div class="brtc-va-tools-sidebar-variable-value" />' +
            '       </div>' +
            '   </div>' +
            '</div>');

        var storageId = _.uniqueId('var-');
        var putData = _.partial(this.tempDataStorage.putDataById, storageId);
        var getData = _.partial(this.tempDataStorage.getDataById, storageId);

        if (index || index > -1) {
            var $temp = this.propertyControls[index];
            if ($temp) $variable.insertBefore($temp);
            else this.$variableList.append($variable);
            this.propertyControls.splice(index, 0, $variable);
            this.tempDataStorage.splice(index, 0, storageId);
        } else {
            this.$variableList.append($variable);
            this.propertyControls.push($variable);
            this.tempDataStorage.push(storageId);
        }

        putData(VARIABLE, variable);

        var $type = $variable.find('.brtc-va-tools-sidebar-variable-type');
        var $name = $variable.find('.brtc-va-widget-contents-input-control');
        var $value = $variable.find('.brtc-va-tools-sidebar-variable-value');
        var $remove = $variable.find('.brtc-va-tools-sidebar-variable-remove');

        this.createDropDownList($type, {
            source: [{
                label: 'String',
                value: 'string'
            },
            {
                label: 'Number',
                value: 'number'
            },
            {
                label: 'Array String Value',
                value: 'array[string]'
            },
            {
                label: 'Array Number Value',
                value: 'array[number]'
            },
            {
                label: 'Calculation Value',
                value: 'calculation'
            }],
            displayMember: 'label',
            valueMember: 'value'
        });
        $type.on('change', function (event) {
            var variable = getData(VARIABLE);
            var type = $type.jqxDropDownList('val');

            getData(VALUE).setVariableType(type);
            _this.createUpdateVariableCommand(variable, {
                value: (type === 'calculation')? Brightics.VA.Core.Utils.VariableUtils.wrap(variable.value) : Brightics.VA.Core.Utils.VariableUtils.strip(variable.value),
                type: type
            });
        });

        var codeMirrorName = CodeMirror.fromTextArea($name[0], {
            mode: 'brtc-controlflow-variable',
            scrollbarStyle: 'null',
            placeholder: '',
            lineWrapping: false,
            lineNumbers: false,
            viewportMargin: Infinity,
            hintOptions: {
                list: []
            },
            extraKeys: {
                'Tab': false, // Let focus go to next control
                'Shift-Tab': false // Let focus go to previous control
            }
        });
        Brightics.VA.Core.Utils.WidgetUtils.changeCodeMirrorLineToSingle(codeMirrorName, {'valid-type': 'type1'});
        codeMirrorName.on('blur', function (instance, event) {
            var variable = getData(VARIABLE);
            var newName = _this.strip(instance.getValue());

            var exist = false;
            for (var i in _this.variables) {
                if (_this.variables[i].name == newName) {
                    exist = true;
                    break;
                }
            }

            if (variable.name !== newName) {
                if (exist) {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('The typed name already exists. Variable Name must be unique.');
                    _this.setVariableName(codeMirrorName, variable.name);
                } else {
                    _this.createUpdateVariableCommand(variable, {name: newName});
                }
            }
        });
        putData(NAME, codeMirrorName);

        var control = Brightics.VA.Core.Widget.Factory.variableControl($value, {
            variable: {
                temp: {
                    type: 'literal',
                    value: variable.value,
                    'variable-type': variable.type
                }
            },
            onChangeCallback: function (variableObj) {
                var variable = getData(VARIABLE);
                _this.createUpdateVariableCommand(variable, {value: variableObj.value});
            },
            'valid-type': 'type1'
        });
        putData(VALUE, control);

        $remove.click(function (event) {
            var variable = getData(VARIABLE);
            _this.createRemoveVariableCommand(variable);
            _this.$variableList.perfectScrollbar('update');
            event.stopPropagation();
        });

        $type.val(variable.type);
        this.setVariableName(codeMirrorName, variable.name);
        control.setInputValue(variable.value);

        try {
            var idx = parseInt(variable.name.split(PREFIX)[1].replace('}', ''));
            this.index = Math.max(this.index, _.isNaN(idx) ? 0 : idx);
        } catch (err) {

        }

        return $variable;
    };

    Variable.prototype.renderValues = function (variables) {
        this.isRendered = false;
        for (var i in variables) {
            this.createVariableControl(variables[i]);
        }
        this.isRendered = true;
    };

    Variable.prototype.executeCommand = function (command) {
        if (this.isRendered) {
            this.options.editor.getCommandManager().execute(command);
        }
    };

    Variable.prototype.createAddVariableCommand = function (variable) {
        var command;
        if (this.options.editor.getModel().type === 'control') {
            command = new Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.AddVariableCommand(this.options.editor, {
                variable: variable
            });
        } else {
            command = new Brightics.VA.Core.Editors.Diagram.Commands.AddVariableDefCommand(this.options.editor, {
                name: variable.name,
                ref: {
                    type: variable.type || 'string',
                    value: ''
                },
                variable: variable
            });
        }
        this.executeCommand(command);
    };

    Variable.prototype.createUpdateVariableCommand = function (variable, value) {
        var command;
        if (this.options.editor.getModel().type === 'control') {
            command = new Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.UpdateVariableCommand(this.options.editor, {
                variable: variable,
                ref: value
            });
        } else {
            var index = this.variables.indexOf(variable);
            command = new Brightics.VA.Core.CompoundCommand(this.options.editor, {
                label: 'Update Variable'
            });

            var updateCommand = new Brightics.VA.Core.Editors.Diagram.Commands
                .UpdateVariableDefCommand(this.options.editor, {
                    name: variable.name,
                    newName: value.name || variable.name,
                    // ref: this.options.editor.modelContents['gv-def'][variable.name],
                    ref: {
                        type: value.type || variable.type,
                        value: _.isUndefined(value.value) ? variable.value : value.value
                    }
                });
            command.add(updateCommand);
            updateCommand.old.index = index;
            updateCommand.old.variable = $.extend(true, {}, variable);

            var assignedList = this.options.editor.getModel().getVariableAssignedParamList(variable.name);
            for (var i in assignedList) {
                command.add(new Brightics.VA.Core.Editors.Diagram.Commands.UpdateVariableCommand(this.options.editor, {
                    fid: assignedList[i].fid,
                    paramKey: assignedList[i].param,
                    ref: value.name || variable.name
                }));
            }
        }
        this.executeCommand(command);
    };

    Variable.prototype.createRemoveVariableCommand = function (variable) {
        var command;
        if (this.options.editor.getModel().type === 'control') {
            command = new Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.RemoveVariableCommand(this.options.editor, {
                variable: variable
            });
        } else {
            var index = this.variables.indexOf(variable);
            command = new Brightics.VA.Core.CompoundCommand(this.options.editor, {
                label: 'Delete Variable'
            });

            var removeCommand = new Brightics.VA.Core.Editors.Diagram.Commands.RemoveVariableDefCommand(this.options.editor, {
                name: variable.name,
                variable: variable
            });
            command.add(removeCommand);
            removeCommand.old.index = index;

            var assignedList = this.options.editor.getModel().getVariableAssignedParamList(variable.name);
            for (var i in assignedList) {
                command.add(new Brightics.VA.Core.Editors.Diagram.Commands.UnBindVariableCommand(this.options.editor, {
                    fid: assignedList[i].fid,
                    paramKey: assignedList[i].param,
                    variable: variable.name,
                    subFnUnitIndex: -1
                }))
            }
        }
        this.executeCommand(command);
    };

    Variable.prototype._exist = function (variable) {
        for (var i in this.variables) {
            if (this.variables[i].name == variable.name) return true;
        }
        return false;
    };

    Variable.prototype.handleCommand = function (command) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand) {
            for (var i in command.options.commands) {
                this.handleCommand(command.options.commands[i]);
            }
        }
        else if (command instanceof Brightics.VA.Core.CompoundCommand) this.handleCompoundCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AddVariableDefCommand) this.handleAddVariableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveVariableDefCommand) this.handleRemoveVariableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UpdateVariableDefCommand) this.handleUpdateVariableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.AddVariableCommand) this.handleAddVariableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.UpdateVariableCommand) this.handleUpdateVariableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.RemoveVariableCommand) this.handleRemoveVariableCommand(command);
    };

    Variable.prototype.handleCompoundCommand = function (command) {
        var i;
        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            for (i in command.commandList) {
                this.handleCommand(command.commandList[i]);
            }
        } else if (command.event.type == 'UNDO') {
            for (i = command.commandList.length - 1; i > -1; i--) {
                this.handleCommand(command.commandList[i]);
            }
        }
    };

    Variable.prototype.handleAddVariableCommand = function (command) {
        if (command.event.type === 'UNDO') {
            this.removeVariableControl(command.options.variable, this.variables.length - 1);
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AddVariableDefCommand) {
                this.variables.splice(this.variables.length - 1, 1);
            }
        } else {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AddVariableDefCommand) {
                if (this._exist(command.options.variable)) return;
                this.variables.push(command.options.variable);
                this.createVariableControl(command.options.variable);
            } else {
                this.createVariableControl(command.options.variable);
            }
        }

        this.$mainControl.perfectScrollbar('update');
    };

    Variable.prototype.handleUpdateVariableCommand = function (command) {
        if (command.event.type === 'UNDO') {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UpdateVariableDefCommand) {
                this.variables[command.old.index].name = command.old.variable.name;
                this.variables[command.old.index].type = command.old.variable.type;
                this.variables[command.old.index].value = command.old.variable.value;
                this.updateVariableControl(command.old.variable, command.old.index);
            } else {
                this.updateVariableControl(command.old.variable, command.old.index);
            }
        } else {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UpdateVariableDefCommand) {
                this.variables[command.old.index].name = command.options.newName;
                this.variables[command.old.index].type = command.options.ref.type || command.old.variable.type;
                this.variables[command.old.index].value =
                    _.isUndefined(command.options.ref.value) ?
                        command.old.variable.value : command.options.ref.value;
                this.updateVariableControl(this.variables[command.old.index], command.old.index);
            } else {
                this.updateVariableControl(command.options.analyticsModel.variables[command.old.index], command.old.index);
            }
        }
    };

    Variable.prototype.handleRemoveVariableCommand = function (command) {
        if (command.event.type === 'UNDO') {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveVariableDefCommand) {
                if (this._exist(command.options.variable)) return;
                this.variables.splice(command.old.index, 0, command.options.variable);
                this.createVariableControl(command.options.variable, command.old.index);
            } else {
                this.createVariableControl(command.options.variable, command.old.index);
            }
        } else {
            this.removeVariableControl(command.options.variable, command.old.index);
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveVariableDefCommand) {
                this.variables.splice(command.old.index, 1);
            }
        }

        this.$mainControl.perfectScrollbar('update');
    };

// ======================================================================================

    Variable.prototype.createDropDownList = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            autoDropDownHeight: true,
            enableBrowserBoundsDetection: true,
            width: 'calc(100% - 2px)'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxDropDownList(options);
    };

    Variable.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };

    Variable.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    Variable.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    Variable.prototype.destroy = function () {
        for (var i in this.propertyControls) {
            this.removeVariableControl('', i);
        }
    };

    Variable.prototype.strip = function (name) {
        return name.substring(2, name.length - 1);
    };

    Variable.prototype.wrap = function (name) {
        return '${' + name + '}';
    };

    Brightics.VA.Core.Views.Variable = Variable;

}).call(this);