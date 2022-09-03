/**
 * Created by jhoon80.park on 2016-01-27.
 */

/* global IN_DATA, OUT_DATA, TARGET_FID, crel */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var CHANGE_IN_TABLE_PARAM_KEYS = ['df-names'];

    function PropertiesPanel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.call(this, parentId, options);
    }

    PropertiesPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype);
    PropertiesPanel.prototype.constructor = PropertiesPanel;

    PropertiesPanel.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.createContentsAreaControls.call(this, $parent);

        this.FnUnitInputs = brtc_require('FnUnitInputs');

        this.createInputsControl();
    };

    PropertiesPanel.prototype.registerScrollEventListener = function (type, callback) {
        if (!this.scrollEventTypeList) this.scrollEventTypeList = [];
        if (this.scrollEventTypeList.indexOf(type) === -1) this.scrollEventTypeList.push(type);

        this.$contentsArea.on(type, callback);
    };

    PropertiesPanel.prototype.destroyScrollEventListener = function () {
        for (var type in this.scrollEventTypeList) {
            this.$contentsArea.off(type);
        }
    };

    PropertiesPanel.prototype.registerProblemListener = function () {
        var _this = this;
        this.problemsListener = function (event, mid, problems) {
            if (_this.options.fnUnit && _this.getModel() && mid === _this.getModel().mid) {
                _this.problems = [];
                for (var i in problems) {
                    if (problems[i] && problems[i].fid === _this.options.fnUnit.fid) {
                        _this.problems.push(problems[i]);
                    }
                }
                _this.handleProblem();
            }
        };
        Studio.getInstance().addProblemListener(this.problemsListener);
    };

    PropertiesPanel.prototype.registerCommandListener = function () {
        if (this.isBlockCommandListener()) return;

        var _this = this;
        this.commandListener = function (command) {
            if (_this.options.isRendered) {
                _this.options.isRendered = false;
                _this.handleCommand(command);
                _this.options.isRendered = true;
            } else {
                _this.handleCommand(command);
            }
        };
        this.options.modelEditor.addCommandListener(this.commandListener);
    };

    PropertiesPanel.prototype.handleCommand = function (command) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand) this.handleSetFnUnitParameterValueCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand) this.handleSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetUDFFnUnitParameterValueCommand) this.handleSetUDFFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReplaceFnUnitParamCommand) this.handleSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand) this.handleRenameFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand) this.handleConnectFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand) this.handleConnectFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand) this.handleConnectFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.BindVariableCommand) this.handleGlobalVariableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UnBindVariableCommand) this.handleGlobalVariableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand) this.handleChangeIntableCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand) this.handleChangeInputsCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutTableCommand) this.handleChangeOutTableCommand(command);
        // else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutputsCommand) this.handleChangeOutputsCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand) this.handleOperationCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand) this.handleOperationCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand) this.handleOperationCommand(command);
        else if (command instanceof Brightics.VA.Core.CompoundCommand) this.handleCompoundCommand(command);
    };

    PropertiesPanel.prototype.handleGlobalVariableCommand = function (command) {
        if (command.options.subFnUnitIndex > -1) {
            if (command.options.fid == this.options.fnUnit.param.functions[command.options.subFnUnitIndex].fid) {
                this.refreshGlobalVariableControl(command.options.paramKey, command.options.subFnUnitIndex);
            }
        } else if (command.options.fid == this.options.fnUnit.fid) {
            this.refreshGlobalVariableControl(command.options.paramKey, command.options.subFnUnitIndex);
        }
    };

    PropertiesPanel.prototype.handleCompoundCommand = function (command) {
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

    PropertiesPanel.prototype.handleSetFnUnitCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderPersistButton();
            this.renderValues(command);
        } else if (command.event.source !== this) {
            if (command.event.source instanceof Brightics.VA.Core.Editors.Sheet.Controls.DataSelector) {
                var inData = this.FnUnitUtils.getInData(command.options.fnUnit);
                // this.retrieveTableInfo(command.options.fnUnit[IN_DATA]);
                this.retrieveTableInfo(inData);
            } else {
                this.renderPersistButton();
                this.renderValues(command);
                this.fillControlValues();
            }
        }
    };

    PropertiesPanel.prototype.handleChangeOutputsCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            return;
        } else if (command.event.source !== this) {
            if (command.event.source instanceof Brightics.VA.Core.Editors.Sheet.Controls.DataSelector) {
                var outTable = this.FnUnitUtils.getOutTable(command.options.fnUnit);
                if (outTable.length > 0)
                    this.retrieveTableInfo(outTable);
            }
        }
    };

    PropertiesPanel.prototype.handleChangeOutTableCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            return;
        } else if (command.event.source !== this) {
            if (command.event.source instanceof Brightics.VA.Core.Editors.Sheet.Controls.DataSelector) {
                this.retrieveTableInfo(command.options.fnUnit[OUT_DATA]);
            }
        }
    };

    PropertiesPanel.prototype.handleSetFnUnitParameterValueCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderValues(command);
        } else if (command.event.source !== this) {
            this.renderValues(command);
        }
    };

    PropertiesPanel.prototype.handleOperationCommand = function (command) {
        if (command.options.fnUnit &&
            this.options.fnUnit.fid === command.options.fnUnit.fid &&
            (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderOperationValues(command);
        } else if (command.event.source !== this) {
            this.renderOperationValues(command);
        }
    };

    PropertiesPanel.prototype.renderOperationValues = function (command) {
        console.error('check here');
    };

    PropertiesPanel.prototype.handleRenameFnUnitCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fid) {
            var $headerTitle = this.$mainControl.find('.brtc-va-editors-sheet-panels-basepanel-header-title');
            $headerTitle.text(this.options.fnUnit.display.label);

            var tooltip = this.options.fnUnit.display.label;
            var clazz = this.getModel().type;
            var funcDef = Brightics.VA.Core.Interface.Functions[clazz][this.options.fnUnit.func];
            if (funcDef) {
                tooltip = this.options.fnUnit.display.label + ' (' + funcDef.defaultFnUnit.display.label + ')';
            }
            $headerTitle.attr('title', tooltip);
        }
    };

    PropertiesPanel.prototype.handleConnectFnUnitCommand = function (command) {
        if (this.options.fnUnit.fid === command.options[TARGET_FID]) {
            var inTable = this.FnUnitUtils.getInTable(this.options.fnUnit);
            this.retrieveTableInfo(inTable);

            this.handleChangeInputsCommand();
        }
    };


    PropertiesPanel.prototype.handleChangeIntableCommand = function () {
        var inTable = this.FnUnitUtils.getInTable(this.options.fnUnit);
        this.retrieveTableInfo(inTable);

        if (this.inputsList) {
            var widgetOptions = {
                fnUnit: this.options.fnUnit,
                disable: true,
            };

            this.createInputsList(this.$inputsControl, widgetOptions);
        }
    };

    PropertiesPanel.prototype.handleChangeInputsCommand = function () {
        var inTable = this.FnUnitUtils.getInTable(this.options.fnUnit);
        this.retrieveTableInfo(inTable);

        if (this.inputsList) {
            var widgetOptions = {
                fnUnit: this.options.fnUnit,
                disable: true,
            };

            this.createInputsList(this.$inputsControl, widgetOptions);
        }
    };

    PropertiesPanel.prototype.setContentsEditable = function (block) {
        if (!block) {
            this.options.isRendered = false;
        } else {
            this.options.isRendered = false;
            this.fillControlValues();
            this.renderValues();
            this.options.isRendered = true;
            if (this.options.fnUnit.hasOwnProperty('parent')) {
                Studio.getInstance().doValidate(this.getModel());
            }
            this.updateScroll();
        }
    };

    PropertiesPanel.prototype.getProblems = function () {
        this.problems = this.getModel().getProblemsByFid(this.options.fnUnit.fid);
    };

    PropertiesPanel.prototype.fillControlValues = function () {

    };

    PropertiesPanel.prototype.destroy = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.destroy.call(this);
        this.options.modelEditor.removeCommandListener(this.commandListener);
        Studio.getInstance().removeProblemListener(this.problemsListener);

        this.destroyGrid();
        this.destroyColumnSelector();
        this.destroyComboBox();
        this.destroyDropDownList();
        this.destroyScrollEventListener();
        if (this.$ctxMenu) {
            this.$ctxMenu.jqxMenu('destroy');
        }
    };

    PropertiesPanel.prototype.destroyGrid = function () {
        var $grid = this.$contentsArea.find('.jqx-grid');
        if ($grid.length > 0) {
            $grid.each(function (index) {
                $(this).jqxGrid('destroy');
            });
        }
    };

    PropertiesPanel.prototype.destroyColumnSelector = function (command) {
        var $columnSelector = $('.brtc-va-editors-sheet-controls-columnselector-editarea');
        if ($columnSelector.length > 0) {
            $columnSelector.dialog('close');
            $columnSelector.dialog('destroy');
        }
    };

    PropertiesPanel.prototype.destroyDropDownList = function () {
        var $dropDownList = this.$contentsArea.find('.brtc-va-editors-sheet-controls-wrapper').children('.jqx-dropdownlist-state-normal');
        if ($dropDownList.length > 0) {
            $dropDownList.each(function (index) {
                $(this).jqxDropDownList('destroy');
            });
        }
    };

    PropertiesPanel.prototype.destroyComboBox = function () {
        var $dropDownList = this.$contentsArea.find('.brtc-va-editors-sheet-controls-wrapper').children('.jqx-combobox');
        if ($dropDownList.length > 0) {
            $dropDownList.each(function (index) {
                $(this).jqxComboBox('destroy');
            });
        }
    };

    PropertiesPanel.prototype.renderValues = function (command) {
        var _this = this;
        if (command && command.options.renderParams) {
            for (var i in command.options.renderParams) {
                this.render[command.options.renderParams[i]].bind(_this)();
            }
        } else {
            for (var j in command ? command.options.ref.param : this.render) {
                if (this.render[j]) this.render[j].bind(_this)();
                else if (typeof this.render[j] === 'undefined') delete this.render[j]
            }
        }

        this.updateScroll();
    };

    PropertiesPanel.prototype.renderCommonValidation = function () {
        for (var i in this.problems) {
            var param = this.problems[i].param;
            if (!param) {
                this.$contentsArea.prepend($('<div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">' +
                    '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
                    '   <div class="brtc-va-editors-sheet-panels-validation-tooltip">' + this.problems[i].message + '</div>' +
                    '</div>'));
            }
        }
    };

    PropertiesPanel.prototype.renderValidation = function () {
    };

    PropertiesPanel.prototype.removeValidation = function () {
        this.$mainControl.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
        this.$mainControl.find('.brtc-va-editors-sheet-controls-propertycontrol-label').removeClass('brtc-va-editors-sheet-controls-propertycontrol-label-error');
        this.$mainControl.find('.brtc-va-editors-sheet-controls-property-in-table-control-label').removeClass('brtc-va-editors-sheet-controls-property-in-table-control-label-error');
        this.$mainControl.find('.brtc-va-editor-sheet-panels-validation-error').removeClass('brtc-va-editor-sheet-panels-validation-error');
        this.$mainControl.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
    };

    PropertiesPanel.prototype.renderPropertyControlHeader = function ($widget, problem) {
        // var $header = $widget.closest('.brtc-va-editors-sheet-controls-propertycontrol').find('.brtc-va-editors-sheet-controls-propertycontrol-label');
        //
        // if (problem.level === 'error') {
        //    $header.addClass('brtc-va-editors-sheet-controls-propertycontrol-label-error');
        // }
    };

    PropertiesPanel.prototype.showValidation = function ($widget, problem) {
        this.renderPropertyControlHeader($widget);
        this.createValidationContent($widget, problem);
    };

    PropertiesPanel.prototype.createValidationContent = function ($el, problemData, clearBoth) {
        var $parent = $el.hasClass('brtc-va-editors-sheet-controls-wrapper') ? $el : $el.parent('.brtc-va-editors-sheet-controls-wrapper');
        $parent = ($parent.length) ? ($parent) : ($el);
        var $problemContent = $('<div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">' +
            '   <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
            '   <div class="brtc-va-editors-sheet-panels-validation-tooltip">' + problemData.message + '</div>' +
            '</div>');
        $parent.append($problemContent);
        $parent.addClass('brtc-va-editor-sheet-panels-validation-error');
        if (clearBoth) $problemContent.css('clear', 'both');
        $problemContent.show();
    };

    PropertiesPanel.prototype.handleProblem = function () {
        var _this = this;
        try {
            if (_this.getModel()) {
                if (_this.options.isRendered) {
                    this.removeValidation();
                    this.renderCommonValidation();
                    this.renderValidation();
                    this.updateScroll();
                }
            }
        } catch (e) {

        }
    };

    PropertiesPanel.prototype.bindValidationTooltip = function ($widget, tooltip) {
        // do nothing
    };

    PropertiesPanel.prototype.getRequestData = function (tables) {
        this.dataMap = {};
        var dataMap = {}, _this = this, tableIndex = 0;

        $.each(tables, function (index, table) {
            _this.options.dataProxy.requestSchema(table, function (data) {
                dataMap[table] = data;
                tableIndex++;
                if (tableIndex === tables.length) {
                    _this.dataMap = dataMap;
                    _this.setContentsEditable(true);
                }
            }, function (data) {
                dataMap[table] = data;
                tableIndex++;
                if (tableIndex === tables.length) {
                    _this.dataMap = dataMap;
                    _this.setContentsEditable(true);
                }
            });
        });
    };

    PropertiesPanel.prototype.retrieveTableInfo = function (tables) {
        var _this = this;

        if (tables && tables.length > 0) {
            this.getRequestData(tables);
        } else {
            _this.setContentsEditable(true);
        }
    };

    PropertiesPanel.prototype.createTopAreaControls = function ($parent) {
        var _this = this;
        var clazz = this.options.fnUnit.parent().type;
        var $header = Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.createTopAreaControls.call(this, $parent);
        $header.addClass('brtc-va-editors-sheet-panels-propertiespanel-header');

        var category = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, this.options.fnUnit.func).category;
        $header.addClass('brtc-va-fnunit-category-' + category);

        var context = this.options.fnUnit.context || ((category === 'control' || category === 'process') ? category : 'scala');
        $header.attr('context', context);

        var $headerTitle = $header.find('.brtc-va-editors-sheet-panels-basepanel-header-title');
        var funcDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, this.options.fnUnit.func);
        var tooltip = funcDef ? this.options.fnUnit.display.label + ' (' + funcDef.defaultFnUnit.display.label + ')' : this.options.fnUnit.display.label;
        $headerTitle.attr('title', tooltip);

        var $itemWrapper = $(crel('div', {
            class: 'brtc-style-display-flex brtc-style-float-right'
        }));

        $header.append($itemWrapper);

        $itemWrapper.append('<div class="brtc-va-editors-sheet-panels-propertiespanel-header-help" title="'+Brightics.locale.common.help+'"></div>');
        $itemWrapper.append('<div class="brtc-va-editors-sheet-panels-propertiespanel-header-more-menu"></div>');
        $itemWrapper.append('<div class="brtc-va-editors-sheet-panels-propertiespanel-header-help-popover"></div>');

        if (clazz === 'data') {
            $itemWrapper.append($(crel('div', {
                class: 'brtc-va-editors-sheet-panels-propertiespanel-header-close-panel',
                title: Brightics.locale.common.close
            })));
        }

        this.createPersistButton();
        this.createPropertiesContextMenu();
        this.createHelpPopover();

        $header.find('.brtc-va-editors-sheet-panels-propertiespanel-header-more-menu').on('click', function (event) {
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            var left = parseInt(event.clientX) + scrollLeft;

            var diffPosition = $(window).width() - event.clientX;
            if (diffPosition < 100) {
                left = left - 130;
            }
            var top = parseInt(event.clientY) + scrollTop;
            top += 5;

            _this.$ctxMenu.jqxMenu('open', left, top);
            $(window).on('resize', _this.ctxMenuCloseHandler);
        });

        $header.find('.brtc-va-editors-sheet-panels-propertiespanel-header-close-panel').on('click', function (evt) {
            _this.getEditor().resetSheetEditorPage();
        });

        return $header;
    };

    PropertiesPanel.prototype.createPersistButton = function () {
        var _this = this;
        this.$mainControl.find('.brtc-va-editors-sheet-panels-propertiespanel-header > .brtc-va-editors-sheet-panels-basepanel-header-title').attr('persist-mode', 'auto');
        var $persistButton = this.$mainControl.find('.brtc-va-editors-sheet-panels-propertiespanel-header [item-type=persist]');
        $persistButton.click(function () {
            var modes = ['auto', 'true', 'false'];
            var idx = modes.indexOf($(this).attr('persist-mode'));
            idx = (idx + 1) % modes.length;
            $(this).attr('persist-mode', modes[idx]);
            var properties = {
                'persist-mode': modes[idx]
            };
            var command = _this.createSetFnUnitCommand(properties);
            _this.executeCommand(command);
        });
        this.renderPersistButton();
    };

    PropertiesPanel.prototype.renderPersistButton = function () {
        var _this = this;
        if (this.options.fnUnit['persist-mode']) {
            $(this).attr('persist-mode', this.options.fnUnit['persist-mode']);
        } else {
            $(this).attr('persist-mode', 'auto');
        }
    };

    PropertiesPanel.prototype.createHelpPopover = function () {
        var _this = this;
        this.$mainControl.find('.brtc-va-editors-sheet-panels-propertiespanel-header-help').click(function () {
            var operation = _this.getPrimaryOperation();
            if (_this.getFunctionDef().defaultFnUnit.name === 'UDF') operation = 'udf_' + _this.getFunctionDef().defaultFnUnit.func;
            var context = _this.getFunctionDef().defaultFnUnit.context || 'scala';
            var func = _this.getFunctionDef().defaultFnUnit.func;
            console.log(func);
            if (_this.getFunctionDef().category === 'control') {
                context = 'common';
            }
            Brightics.VA.Core.Utils.ModelUtils.openFunctionReferencePopup('data', operation, context, func);
        });
    };

    PropertiesPanel.prototype.createPropertiesContextMenu = function () {
        var _this = this;
        var $header = this.$mainControl.find('.brtc-va-editors-sheet-panels-propertiespanel-header');
        var $ctxMenu = $('' +
            '<div class="brtc-va-editors-sheet-panels-propertiespanel-header-ctxmenu">' +
            '   <ul>' +
            '       <li action="rename">'+Brightics.locale.common.edit+'</li>' +
            '       <li action="select_function">'+Brightics.locale.common.selectFunction+'</li>' +
            '   </ul>' +
            '</div>');
        $header.append($ctxMenu);

        this.$ctxMenu = $ctxMenu.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '120px',
            height: '120px',
            autoOpenPopup: false,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });

        this.$ctxMenu.on('itemclick', function (event) {
            var $el = $(event.args);
            if ($el.attr('action') == 'rename') {
                var dialogOptions = {
                    title: Brightics.locale.common.editFunction,
                    label: _this.options.fnUnit.display.label,
                    description: _this.options.fnUnit.display.description || '',
                    close: function (dialogResult) {
                        if (dialogResult.OK) {
                            _this.doEditFunction(_this.options.fnUnit.fid, dialogResult.label, dialogResult.description);
                        }
                    }
                };
                new Brightics.VA.Core.Dialogs.EditResourceDialog($(document.body), dialogOptions);
            } else if ($el.attr('action') == 'select_function') {
                var fnUnit = _this.getFnUnit();
                var editorInput = fnUnit.parent();
                var preFnUnit = editorInput.getPrevious(fnUnit.fid);
                new Brightics.VA.Core.Dialogs.SwitchFnUnitDialog($(event.target), {
                    modelType: _this.getModel().type,
                    position: 'center',
                    preFnUnit: editorInput.getFnUnitById(preFnUnit[0]),
                    close: function (dialogResult) {
                        if (dialogResult.OK) {
                            var currUnit = editorInput.getFnUnitById(fnUnit.fid);
                            if (currUnit.func !== dialogResult.func) {
                                var replaceUnit = editorInput.newFnUnit(dialogResult.func);
                                replaceUnit.display.diagram.position = $.extend({}, currUnit.display.diagram.position);

                                var command = new Brightics.VA.Core.Editors.Diagram.Commands.SwitchFnUnitCommand($(event.target), {
                                    modelType: _this.getModel().type,
                                    fid: currUnit.fid,
                                    fnUnit: replaceUnit,
                                    prvFnUnit: currUnit
                                });
                                command.event.source = $(event.target);

                                var editor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
                                editor.getCommandManager().execute(command);
                            }
                        }
                    }
                });
            }
        });


        this.ctxMenuCloseHandler = function () {
            _this.$ctxMenu.jqxMenu('close');
        };

        this.$ctxMenu.on('closed', function () {
            $(window).off('resize', _this.ctxMenuCloseHandler);
        });
    };

    PropertiesPanel.prototype.doEditFunction = function (fid, label, description) {
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand(this, {
            fid: fid,
            name: label,
            description: description
        });
        this.executeCommand(command);
    };


    PropertiesPanel.prototype.createExample = function ($parent, example) {
        var $example = $('<div class="brtc-va-popover-help-func-example"></div>');
        $parent.append($example);
        var $exampleTitle = $('<div class="brtc-va-popover-help-func-example-title"></div>');
        $exampleTitle.text(example.title);

        $example.append($ex);
        for (var key in example.params) {
            var $param = $('<div class="brtc-va-popover-help-func-example-param"></div>');
            var $key = $('<span></span>');
            $key.text(key);
            var $paramSpan = $('<span></span>');
            $paramSpan.text(example.params[key]);
            $param.append($key);
            $param.append($paramSpan);
            $example.append($param);
        }

        var i;
        for (i in example.input) {
            $example.append('<div class="brtc-va-popover-help-func-example-param"><span>Input</span></div>');
            this.createExampleTable($example, example.input[i]);
        }

        for (i in example.output) {
            $example.append('<div class="brtc-va-popover-help-func-example-param"><span>Output</span></div>');
            this.createExampleTable($example, example.output[i]);
        }
    };

    PropertiesPanel.prototype.createExampleTable = function ($parent, options) {
        var $table = $('<table class="brtc-va-popover-help-func-example-table"></table>');
        $parent.append($table);

        var $columns = $('<tr></tr>');
        $table.append($columns);
        for (var i in options.columns) {
            var $columnVal = $('<td></td>');
            $columnVal.text(options.columns[i].name);
            $columns.append($columnVal);
        }

        var $row;
        for (var r in options.data) {
            $row = $('<tr></tr>');
            $table.append($row);
            for (var c in options.data[r]) {
                var $rowVal = $('<td></td>');
                $rowVal.text(options.data[r][c]);
                $row.append($rowVal);
            }
        }
    };

    PropertiesPanel.prototype.hasInModel = function () {
        var funcDef = this.getFunctionDef();
        if (funcDef.viewer && funcDef.viewer.in) {
            var inTypes = funcDef.viewer.in;
            if (inTypes.indexOf('model') >= 0) {
                return true;
            }
        }

        return false;
    };

    PropertiesPanel.prototype.createInputsControl = function (disable) {
        var _this = this;

        if (!this.FnUnitUtils.inputChangable(this.options.fnUnit)) return;
        if (!this.FnUnitUtils.hasInput(this.options.fnUnit)) return;

        this.$inputsControl = $('<div class="brtc-va-editors-sheet-controls-property-inputs-control-columnlist"/>');

        this.addPropertyInTableControl('Inputs', function ($parent) {
            $parent.append(_this.$inputsControl);
            _this.wrapControl(_this.$inputsControl);

            var widgetOptions = {
                fnUnit: _this.options.fnUnit,
                disable: disable,
            };

            _this.createInputsList(_this.$inputsControl, widgetOptions);
        }, {mandatory: true});
    };

    PropertiesPanel.prototype.getFunctionDef = function () {
        var clazz = this.getModel().type;
        return Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, this.options.fnUnit.func);
    };

    PropertiesPanel.prototype.getPrimaryOperation = function () {
        var clazz = this.getModel().type;
        return Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, this.options.fnUnit.func).defaultFnUnit.name;
    };

    PropertiesPanel.prototype.createContentsArea = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.createContentsArea.call(this);
        this.$contentsArea.addClass('brtc-va-editors-sheet-panels-propertiespanel-contents-area');
    };

    PropertiesPanel.prototype.createBottomAreaControls = function ($parent) {
        this.$callFunctionButton = $('' +
            '<button type="button" class="brtc-va-editors-sheet-panels-propertiespanel-button">' +
            'Run' +
            '</button>');
        $parent.append(this.$callFunctionButton);

        this.$callFunctionButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '92px',
            height: '100%'
        });
        var _this = this;
        this.$callFunctionButton.click(function () {
            this.blur(); // focus out
            _this.callFunction();
        });
    };

    PropertiesPanel.prototype.callFunction = function () {
        var _this = this;
        var listener = {
            'success': function (res) {
                _this.$mainControl.trigger('callFunction', []);
            }
        };
        Studio.getJobExecutor().launchUnit(_this.options.fnUnit, {}, {}, listener);
    };

    PropertiesPanel.prototype.addPropertyControl = function (label, callback, option) {
        var _this = this,
            $propertyControl = $('' +
                '<div class="brtc-va-editors-sheet-controls-propertycontrol" label="' + label + '">' +
                '   <div class="brtc-va-editors-sheet-controls-propertycontrol-label"></div>' +
                '   <div class="brtc-va-editors-sheet-controls-propertycontrol-contents">' +
                '</div>');

        if (option) {
            if (option.mandatory) {
                label = '<div>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(label) +
                    '   <div class="brtc-va-editors-sheet-controls-propertycontrol-mandatory">*</div>' +
                    '</div>';
            }
            if (option.propertyControlParent) {
                option.propertyControlParent.append($propertyControl);
            } else if (option.appendIndex) {
                if (option.appendIndex > 0) $propertyControl.insertAfter(this.$contentsArea.children().eq(option.appendIndex - 1));
                else this.$contentsArea.prepend($propertyControl);
            } else {
                this.$contentsArea.append($propertyControl);
            }
        } else {
            this.$contentsArea.append($propertyControl);
        }

        $propertyControl.jqxExpander(
            {
                theme: Brightics.VA.Env.Theme,
                arrowPosition: 'left',
                initContent: function () {
                    if (typeof callback === 'function') {
                        callback.call(_this, $propertyControl.find('.brtc-va-editors-sheet-controls-propertycontrol-contents'), option);
                    }
                }
            });
        $propertyControl.jqxExpander('setHeaderContent', label);

        return $propertyControl;
    };

    PropertiesPanel.prototype.addPropertyInTableControl = function (label, callback, option) {
        var _this = this,
            $propertyControl = $('' +
                '<div class="brtc-va-editors-sheet-controls-property-in-table-control">' +
                '   <div class="brtc-va-editors-sheet-controls-property-in-table-control-label"></div>' +
                '   <div class="brtc-va-editors-sheet-controls-property-in-table-control-contents">' +
                '</div>');

        if (option) {
            if (option.mandatory) {
                label = '<div>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(label) +
                    '   <div class="brtc-va-editors-sheet-controls-property-in-table-control-mandatory">*</div>' +
                    '</div>';
            }
            if (option.propertyControlParent) option.propertyControlParent.append($propertyControl);
            else this.$contentsArea.append($propertyControl);
        } else {
            this.$contentsArea.append($propertyControl);
        }

        $propertyControl.jqxExpander(
            {
                theme: Brightics.VA.Env.Theme,
                arrowPosition: 'left',
                initContent: function () {
                    if (typeof callback === 'function') {
                        callback.call(_this, $propertyControl.find('.brtc-va-editors-sheet-controls-property-in-table-control-contents'), option);
                    }
                }
            });
        $propertyControl.jqxExpander('setHeaderContent', label);

        return $propertyControl;
    };

    PropertiesPanel.prototype.addGlobalVariableControl = function ($control, cssOption, paramKey, paramLabel, options) {
        var _this = this,
            $variable = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-variable"></div>');
        $variable.css(cssOption);
        if (options && options.type) {
            $variable.attr('type', options.type);
        }
        $variable.click(function (event) {
            var $expanderHeader = $(this).closest('.brtc-va-editors-sheet-controls-propertycontrol-label');
            if ($expanderHeader) $expanderHeader.closest('.jqx-expander').jqxExpander('disable');

            var closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    _this.executeCommand(dialogResult.command);
                    // _this.refreshGlobalVariableControl(paramKey);
                }
                if ($expanderHeader) $expanderHeader.closest('.jqx-expander').jqxExpander('enable');
            };

            var removeHandler = function (dialogResult) {
                _this.executeCommand(dialogResult.command);
                // _this.refreshGlobalVariableControl(paramKey);
            };

            new Brightics.VA.Core.Dialogs.SettingVariableDialog($(this), {
                close: closeHandler,
                remove: removeHandler,
                fnUnit: _this.options.fnUnit,
                param: {
                    key: paramKey,
                    label: paramLabel,
                    type: options && options.type ? options.type : 'string',
                    index: _this.globalVariableFnUnitIndex[paramKey]
                }
            });
        });
        $control.append($variable);

        this.globalVariableControls = this.globalVariableControls || {};
        this.globalVariableFnUnitIndex = this.globalVariableFnUnitIndex || {};
        this.globalVariableControls[paramKey] = $variable;
        this.globalVariableFnUnitIndex[paramKey] = options && options.index > -1 ? options.index : -1;

        this.refreshGlobalVariableControl(paramKey, options && options.index > -1 ? options.index : -1);
    };

    PropertiesPanel.prototype.refreshGlobalVariableControl = function (paramKey, index) {
        var analyticModel = this.options.modelEditor.getModel();
        var variable = analyticModel.getVariable(this.options.fnUnit.fid, paramKey);
        if (index > -1) variable = analyticModel.getVariable(this.options.fnUnit.param.functions[index].fid, paramKey);
        if (variable) this.globalVariableControls[paramKey].addClass('set');
        else this.globalVariableControls[paramKey].removeClass('set');
    };

    PropertiesPanel.prototype.executeCommand = function (command) {
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        // if (modelEditorRef && this.options.isRendered) {
        //     modelEditorRef.getCommandManager().execute(command);
        // }

        var tmpList = ['kmeans2', 'kmeans2model', 'kmeansmodelpy', 'testftn1', 'testftn2', 'testftn3'];
        if (tmpList.indexOf(this.options.fnUnit.func) > -1) {
            modelEditorRef.getCommandManager().execute(command);
        } else {
            if (modelEditorRef && this.options.isRendered) {
                modelEditorRef.getCommandManager().execute(command);
            }
        }
    };

    PropertiesPanel.prototype.createCommandOptions = function () {
        return {};
    };

    PropertiesPanel.prototype.createSetFnUnitCommand = function (properties) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {}
        };

        for (var key in properties) {
            commandOption.ref[key] = properties[key];
        }

        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
    };

    PropertiesPanel.prototype.createSetParameterValueCommand = function (paramName, paramValue,
                                                                         force = true) {
        if (!force && this.getParam(paramName) === paramValue) return null;
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        if (paramValue !== 0 && !paramValue && typeof paramValue !== 'boolean') paramValue = '';
        commandOption.ref.param[paramName] = paramValue;

        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
    };


    PropertiesPanel.prototype.getColumnsOfInTable = function (index, columnTypes) {
        var columns = [];
        if (this.dataMap && this.FnUnitUtils.getInTable(this.options.fnUnit)[index] && this.FnUnitUtils.getInTable(this.options.fnUnit)[index]) {
            columns = this.dataMap[this.FnUnitUtils.getInTable(this.options.fnUnit)[index]].columns;
        }
        if (columnTypes && columnTypes.length > 0) {
            columns = $.grep(columns, function (el) {
                return columnTypes.indexOf(el.type) > -1 || columnTypes.indexOf(el.internalType) > -1;
            });
        }
        return columns;
    };

    PropertiesPanel.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };

    PropertiesPanel.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    PropertiesPanel.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    PropertiesPanel.prototype.createComboBox = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '25px',
            closeDelay: 0,
            openDelay: 0
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxComboBox(options);

        var preValue = $control.val();
        $control.find('input').focus(function () {
            preValue = $control.val();
        });
        $('svg').on('mousedown', function () {
            var value = $control.val();
            if (value !== preValue && $control.find('input').is(':focus')) {
                $control.trigger('change');
            }
        });

        this.registerScrollEventListener('ps-scroll-y', function () {
            $control.jqxComboBox('close');
        });
    };

    PropertiesPanel.prototype.createInput = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);

        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }

        if (!$control.attr('type')) $control.attr('type', 'text');
        if (!$control.attr('maxlength')) $control.attr('maxlength', '200');

        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            height: '25px',
            placeHolder: 'Enter value'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxInput(options);
        var preValue = $control.val();
        $control.focus(function () {
            preValue = $control.val();
        });
        $('svg').on('mousedown', function () {
            var value = $control.val();
            if (value !== preValue && $control.is(':focus')) {
                $control.trigger('change');
            }
        });

        var _this = this;
        $control.on('keydown', function (event) {
            clearTimeout(_this.keydownTimeout);
            _this.keydownTimeout = setTimeout(function () {
                if ($control.is(':focus')) {
                    $control.blur();
                    $control.focus();
                }
            }, 1000);
        });

        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($control);
        return $control;
    };

    PropertiesPanel.prototype.createNumberInput = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);
        return new Brightics.VA.Core.Editors.Sheet.Controls.NumericInput($control, widgetOptions, className);
    };

    PropertiesPanel.prototype.createDropDownList = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            enableBrowserBoundsDetection: true,
            animationType: 'none',
            width: '100%',
            height: '25px',
            openDelay: 0
        };
        if (jqxOptions) {
            if (jqxOptions.source && jqxOptions.source.length > 7) {
                options.autoDropDownHeight = false;
                options.dropDownHeight = 120;
            } else {
                options.autoDropDownHeight = true;
            }
            $.extend(options, jqxOptions);
        }
        $control.jqxDropDownList(options);

        this.registerScrollEventListener('ps-scroll-y', function () {
            $control.jqxDropDownList('close');
        });

        return $control;
    };

    PropertiesPanel.prototype.createGrid = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            rowsheight: 25
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxGrid(options);
        return $control;
    };

    PropertiesPanel.prototype.createCheckBox = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = 'brtc-va-editors-sheet-controls-checkbox-default';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxCheckBox(options);

        return $control;
    };

    PropertiesPanel.prototype.createRadioButton = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = 'brtc-va-editors-sheet-controls-radiobutton-default';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions, {
                groupName: (jqxOptions.groupName || '') + this.panelId
            });
        }
        $control.jqxRadioButton(options);
        return $control;
    };

    PropertiesPanel.prototype.createButton = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxButton(options);
        return $control;
    };

    PropertiesPanel.prototype.createSwitchButton = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '23px'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxSwitchButton(options);
        return $control;
    };

    PropertiesPanel.prototype.createButtonGroup = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxButtonGroup(options);
        return $control;
    };

    PropertiesPanel.prototype.onInputsChange = function (inputs) {
        if (this.FnUnitUtils.hasMeta(this.options.fnUnit)) {
            if (!this.isInputsChanged(inputs)) return;

            let commandOption = {
                fnUnit: this.options.fnUnit,
                ref: {
                    inputs: inputs
                }
            };

            let compoundCommand = new Brightics.VA.Core.CompoundCommand(this);
            var changeInputsCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand(this, commandOption);
            compoundCommand.add(changeInputsCommand);
        } else {
            var tableList = [];

            for (var key in inputs) {
                if (!_.isEmpty(inputs[key])) tableList.push(inputs[key]);
            }

            if (_.isEqual(this.FnUnitUtils.getInTable(this.options.fnUnit), tableList)) return;

            let commandOption = {
                fnUnit: this.options.fnUnit,
                ref: tableList
            };

            let compoundCommand = new Brightics.VA.Core.CompoundCommand(this);
            var changeInTableCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand(this, commandOption);
            compoundCommand.add(changeInTableCommand);
        }

        this.executeCommand(compoundCommand);
    };

    PropertiesPanel.prototype.onInputsError = function (message) {
        this.options.modelEditor.notification('error', message);
    };

    PropertiesPanel.prototype.createInputsList = function ($control, widgetOptions, className, additionalCss) {
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            appendTo: $control,
            fnUnit: this.options.fnUnit,
            emptyLabel: 'Empty',
            onClick: this.openInputSelector.bind(this),
            readOnly: true
        };

        if (widgetOptions) {
            $.extend(options, widgetOptions);
        }

        this.inputsList = this.FnUnitInputs.render(options);
    };

    PropertiesPanel.prototype.openInputSelector = function () {
        var _this = this;

        this.inputSelector = new Brightics.VA.Core.Editors.Sheet.Controls.InputSelector(this.$mainControl, {
            fnUnit: _this.options.fnUnit,
            onChange: _this.onInputsChange.bind(this),
            onClose: _this.onInputsChange.bind(this),
            onError: _this.onInputsError.bind(this)
        });
    };

    PropertiesPanel.prototype.isInputsChanged = function (inputs) {
        return !_.isEqual(this.FnUnitUtils.getInputs(this.options.fnUnit), inputs);
    };

    PropertiesPanel.prototype.addFnUnitCommandToCompoundCommand = function (compoundCommand, paramValue) {
        var isParamChanged = false;

        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {}
            }
        };

        var paramKeys = Object.keys(this.options.fnUnit.param);
        for (const key of paramKeys) {
            if (CHANGE_IN_TABLE_PARAM_KEYS.indexOf(key) > -1) {
                isParamChanged = true;
                commandOption.ref.param[key] = paramValue;
            }
        }

        if (isParamChanged) {
            var setFnUnitCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
            compoundCommand.add(setFnUnitCommand);
        }
    };

    PropertiesPanel.prototype.createColumnList = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            multiple: true,
            rowCount: 1,
            maxRowCount: 5,
            expand: false,
            sort: 'none',
            sortBy: 'name',
            showOpener: 'button',
            removable: true,
            defaultType: '-',
            changed: function (type, data) {

            },
            added: function () {

            },
            removed: function () {

            }
        };

        if (widgetOptions) {
            $.extend(options, widgetOptions);
        }

        return new Brightics.VA.Core.Editors.Sheet.Controls.ColumnList($control, options);
    };

    PropertiesPanel.prototype.createTableList = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        return new Brightics.VA.Core.Editors.Sheet.Controls.TableList($control, widgetOptions);
    };

    PropertiesPanel.prototype.createDateTimeInput = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '25px'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxDateTimeInput(options);
        return $control;
    };

    PropertiesPanel.prototype.createTextArea = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '60px'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxTextArea(options);
        return $control;
    };

    PropertiesPanel.prototype.createNumericInput = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        return new Brightics.VA.Core.Editors.Sheet.Controls.NumericInput($control, widgetOptions);
    };

    PropertiesPanel.prototype.createArrayInput = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        return new Brightics.VA.Core.Editors.Sheet.Controls.ArrayInput($control, widgetOptions);
    };

    PropertiesPanel.prototype.getPreviousFnUnit = function (fid) {
        var analyticModel = this.options.modelEditor.getModel();
        return analyticModel.getFnUnitById(fid);
    };

    PropertiesPanel.prototype.createResizableTextArea = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = 'brtc-va-editors-sheet-controls-resizable-textarea-default';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        $control.addClass(additionalClass);

        if (additionalCss) {
            $.extend(widgetOptions, additionalCss);
        }
        $control.css(widgetOptions);
    };

    PropertiesPanel.prototype.createTextAreaControl = function ($control, controlOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = 'brtc-va-editors-sheet-controls-textareacontrol';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        $control.addClass(additionalClass);
        if (additionalCss) $control.css(additionalCss);

        return new Brightics.VA.Core.Editors.Sheet.Controls.TextAreaControl($control, controlOptions);
    };

    PropertiesPanel.prototype.createItemList = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        // return new Brightics.VA.Core.Widget.Controls.ItemListControl($control, options);
        return new Brightics.VA.Core.Widget.Controls.ItemList($control, widgetOptions);
    };


    PropertiesPanel.prototype.createDateTimePickerControl = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = 'brtc-va-editors-sheet-controls-datetime-picker';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);
        var options = {
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '23px',
            // selectionMode: 'range',
            formatString: 'yyyy/MM/dd HH:mm:ss',
            textAlign: 'center'
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxDateTimeInput(options);
    };

    PropertiesPanel.prototype.createTildeControl = function ($control, additionalClass, additionalCss) {
        this.wrapControl($control);
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);
    };

    PropertiesPanel.prototype.handleSetUDFFnUnitCommand = function (command) {
        if (this.options.fnUnit.fid == command.options.fnUnit.fid && (command.event.type === 'UNDO' || command.event.type === 'REDO')) {
            this.renderUDFValues(command);
        } else if (command.event.source !== this) {
            if (command.event.source instanceof Brightics.VA.Core.Editors.Sheet.Controls.DataSelector) {
                this.retrieveTableInfo(command.options.fnUnit[IN_DATA]);
            } else {
                this.renderUDFValues(command);
                this.fillControlValues();
            }
        }
    };

    PropertiesPanel.prototype.createSetUDFParameterValueCommand = function (paramName, paramValue) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'input-variables': $.extend(true, [], this.options.fnUnit.param['input-variables'])
                }
            }
        };
        for (var i in this.options.fnUnit.param['input-variables']) {
            if (this.options.fnUnit.param['input-variables'][i][0] === paramName) {
                commandOption.ref.param['input-variables'][i][2] = paramValue;
            }
        }
        return new Brightics.VA.Core.Editors.Diagram.Commands.SetUDFFnUnitParameterValueCommand(this, commandOption);
    };

    PropertiesPanel.prototype.renderUDFValues = function (command) {
        var _this = this;
        if (command && command.options.renderParams) {
            for (var i in command.options.renderParams) {
                this.render[command.options.renderParams[i]].bind(_this)();
            }
        } else {
            if (command) {
                for (var j in command.options.ref.param['input-variables']) {
                    this.render[command.options.ref.param['input-variables'][j][0]].bind(_this)();
                }
            } else {
                for (var j in this.render) {
                    this.render[j].bind(_this)();
                }
            }
        }
    };

    PropertiesPanel.prototype.isInputValueChanged = function (colName, data) {
        var fnUnitParam = this.options.fnUnit.param[colName],
            commandParam = data;

        // 함수 파라미터의 type이 array인 경우
        if (_.isArray(fnUnitParam) && _.isEmpty(fnUnitParam[0])){
            if (_.isEmpty(commandParam)) {
                return false;
            }
        }
        return _.isUndefined(fnUnitParam) || !_.isEqual(fnUnitParam, commandParam);
    };

    PropertiesPanel.prototype.createBarButton = function ($control, jqxOptions, className, additionalCss) {
        var defaultOption = {
            width: '100%',
            height: 25
        };

        if (jqxOptions) {
            $.extend(defaultOption, jqxOptions);
        }
        return this.createButton($control, defaultOption, className, additionalCss);
    };

    PropertiesPanel.prototype.getFnUnit = function () {
        return this.options.fnUnit;
    };

    PropertiesPanel.prototype.getModel = function () {
        return this.FnUnitUtils.getParent(this.getFnUnit());
    };

    PropertiesPanel.prototype.getEditor = function () {
        return this.options.modelEditor;
    };

    PropertiesPanel.prototype.configureOptions = function () {
    };

    PropertiesPanel.prototype.refresh = function () {
    };
    PropertiesPanel.prototype.getParam = function (key) {
        return key ? this.getFnUnit().param[key] : this.getFnUnit().param;
    };

    PropertiesPanel.prototype.hideInTableControl = function () {
        this.$mainControl.find('.brtc-va-editors-sheet-controls-property-in-table-control').hide();
    };

    PropertiesPanel.prototype.updateScroll = function () {
        this.$contentsArea.perfectScrollbar('update');
    };

    PropertiesPanel.prototype.createDropEvent = function ($item) {
    };

    PropertiesPanel.prototype.isBlockCommandListener = function () {
        return this.options.blockCommandListener? true : false;
    };

    PropertiesPanel.prototype.createReturnDataCommand = function (compoundCommand, evt) {
        var modelOutData = _.clone(Studio.getActiveEditor().getActiveModel()['outData']);
        var oldMeta = this.FnUnitUtils.getMeta(this.options.fnUnit);
        // outputs에서 table로 meta가 바뀐 것을 찾아서 
        var changedOutputs = [];
        _.forEach(evt.outputs, function (tid, key) {
            var newType = evt.meta[key].type;
            var oldType = oldMeta[key] ? oldMeta[key].type : '';
            if (_.isEqual('table', oldType) && !_.isEqual('table', newType)) {
                changedOutputs.push(tid);
            }
        });
        //변경된거 없으면 탈출
        if (_.isEmpty(changedOutputs)) return;
        // 새로운 outData를 만들고
        var dup = _.intersection(modelOutData, changedOutputs);
        _.remove(modelOutData, function (tid) {
            return _.indexOf(dup, tid) >= 0;
        })
        // 커맨드에 add
        compoundCommand.add(new Brightics.VA.Core.Editors.Diagram.Commands.ReturnDataCommand(this, {
            outData: modelOutData
        }));
    };

    Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel = PropertiesPanel;
}).call(this);
