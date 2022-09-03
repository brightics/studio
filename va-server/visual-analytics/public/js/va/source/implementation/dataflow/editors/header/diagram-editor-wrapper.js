/* -----------------------------------------------------
 *  diagram-editor-wrapper.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-21.
 * ----------------------------------------------------*/

/* global Studio, FUNCTION_NAME */
(function () {
    'use strict';
    var Brightics = this.Brightics;
    var Editors = Brightics.VA.Implementation.DataFlow.Editors;
    var EventEmitter = this.__module__.EventEmitter;
    var ClassUtils = this.__module__.ClassUtils;
    var _ = this.__module__._;

    var LOOP_TYPE = 'type';
    var LOOP_PROPERTY = 'prop';
    var DEFAULT_LOOP_PROP = {
        'count': {
            'start': '${=}',
            'end': '${=}',
            'index-variable': ''
        },
        'collection': {
            'collection': '${=}',
            'element-variable': '',
            'index-variable': ''
        },
        'while': {
            'expression': '${=}',
            'index-variable': ''
        }
    };

    function DiagramEditorWrapper($parent, _options) {
        var options = _options || {};
        this.$parent = $parent;

        this.conditionHeader = options.conditionHeader;
        this.loopHeader = options.loopHeader;
        this.editor = options.editor;
        this.conditionContext = [];
        this.activeHeader = undefined;
        this.init();
    }

    ClassUtils.inherits(DiagramEditorWrapper, EventEmitter);

    DiagramEditorWrapper.prototype.getHeader = function () {
        return this.header;
    };

    DiagramEditorWrapper.prototype.init = function (params) {
        this.editor.getCommandManager().registerCallback(function (command) {
            if ((command.options.label === 'Add Condition' ||
                    command.options.label === 'Remove Condition') &&
                command.options.view === 'header') {
                if (this.model) {
                    this._setHeader(this.model, this.fnUnit);
                } else {
                    var mid = this.fnUnit.param.if.mid;
                    this.editor.getModelLayoutManager().changeEditorModel(mid);
                }
            } else if (command.options.view === 'header') {
                if (this.model) {
                    this._setHeader(this.model, this.fnUnit);
                }
            }
        }.bind(this));

        this.editor.getCommandManager().registerGoHistoryCallback(function (commands) {
            var idx = _.findIndex(commands.options.commands, function (command) {
                return command.options.label === 'Add Condition' ||
                    command.options.label === 'Remove Condition';
            });
            if (idx > -1) {
                this._setHeader(this.model, this.fnUnit);
            }
        }.bind(this));
        this.conditionHeader.on('tab-add-click', function (data) {
            var mid = Brightics.VA.Core.Utils.IDGenerator.model.id();
            var commands = new Brightics.VA.Core.CompoundCommand(this, {
                label: 'Add Condition',
                view: 'header'
            });
            commands.add(this.createAddParameterCommand(this.fnUnit, {
                mid: mid,
                conditionType: 'elseif'
            }));

            commands.add(this.createNewActivityCommand(this.fnUnit, {
                mid: mid,
                conditionType: 'elseif'
            }));
            this.editor.getCommandManager().execute(commands);
        }.bind(this));

        this.conditionHeader.on('tab-close-click', function (evt) {
            if (evt.data.getType() !== 'elseif') return;
            var commands
                = new Brightics.VA.Core.CompoundCommand(this, {
                    label: 'Remove Condition',
                    view: 'header'
                });
            commands.add(this.createRemoveActivityCommand(this.fnUnit, {
                mid: evt.data.getId()
            }));

            commands.add(this.createRemoveParameterCommand(this.fnUnit, {
                mid: evt.data.getId(),
                conditionType: 'elseif'
            }));
            this.editor.getCommandManager().execute(commands);
        }.bind(this));

        this.conditionHeader.on('tab-click', function (evt) {
            this.emit('tab-click', evt);
        }.bind(this));

        this.conditionHeader.on('field-change', function (evt) {
            this.editor.getCommandManager().execute(this.createConditionFieldChangeCommand(evt));
        }.bind(this));

        this.loopHeader.on('input-change', function (evt) {
            var options = {
                val: evt.value,
                path: evt.path
            };
            this.editor.getCommandManager()
                .execute(this.createLoopFieldChangeCommand(this.fnUnit, options));
        }.bind(this));

        this.loopHeader.on('type-change', function (key) {
            var options = {
                loopType: key
            };
            this.editor.getCommandManager()
                .execute(this.createLoopTypeChangeCommand(this.fnUnit, options));
        }.bind(this));
    };

    DiagramEditorWrapper.prototype.setModel = function (model, fnUnit, isOpen) {
        this.editor.getDiagramEditorPage().setModel(model);
        this._setHeader(model, fnUnit, isOpen);
        this.model = model;
        this.fnUnit = fnUnit;
        if (fnUnit) this.conditionContext = fnUnit.param;
        Studio.getInstance().doValidate(model);
    };

    DiagramEditorWrapper.prototype._setHeader = function (model, fnUnit) {
        if (!fnUnit) {
            this.conditionHeader.hide();
            this.loopHeader.hide();
            this.editor.getHeaderArea().hide();
            this.activeHeader = undefined;
            return;
        }
        var mid = model.mid;
        if (fnUnit[FUNCTION_NAME] === 'If') {
            this.editor.getHeaderArea().show();
            this.conditionHeader.setData(fnUnit.param);
            this.conditionHeader.show();
            this.conditionHeader.render();
            this.conditionHeader.selectTab(mid);
            this.loopHeader.hide();
            this.activeHeader = this.conditionHeader;
        } else if (fnUnit[FUNCTION_NAME] === 'ForLoop' ||
            fnUnit[FUNCTION_NAME] === 'WhileLoop') {
            this.editor.getHeaderArea().show();
            this.loopHeader.setData(fnUnit);
            this.loopHeader.render(true);
            this.conditionHeader.hide();
            this.loopHeader.hide();
            // this.loopHeader.show();
            this.activeHeader = this.loopHeader;
        } else {
            this.activeHeader = undefined;
            throw new Error('unexpected fnunit');
        }
    };

    DiagramEditorWrapper.prototype.createConditionFieldChangeCommand = function (data) {
        var path = ['param'];
        if (data.type === 'if') {
            path.push('if');
        } else if (data.type === 'elseif') {
            path.push('elseif');
            var idx = _.findIndex(this.fnUnit.param.elseif, function (param) {
                return param.mid === data.id;
            });
            if (idx === -1) return;
            path.push(idx);
        } else {
            return;
        }
        path.push('expression');

        var commandOptions = {
            fnUnit: this.fnUnit,
            label: 'Condition Field Update',
            path: path,
            value: data.field,
            view: 'header'
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(
            this,
            commandOptions);
        return command;
    };

    DiagramEditorWrapper.prototype.createNewActivityCommand = function (fnUnit, options) {
        var val = (function (fnUnit, options) {
            if (fnUnit.func === 'if') {
                return {
                    mid: options.mid,
                    type: fnUnit.func,
                    conditionType: options.conditionType
                };
            } else if (fnUnit.func === 'forLoop' ||
                fnUnit.func === 'whileLoop') {
                return {
                    mid: fnUnit.param.mid,
                    type: 'loop'
                };
            }
        }(fnUnit, options));
        return new Brightics.VA.Core.Editors.Diagram.Commands.NewActivityCommand(this, val);
    };

    DiagramEditorWrapper.prototype.createAddParameterCommand = function (fnUnit, options) {
        var conditionType = options._conditionType || 'elseif';
        var mid = options.mid;
        var path = ['param', conditionType];

        var template = {
            'expression': 'true',
            'mid': mid
        };

        var val = (function () {
            if (conditionType === 'elseif') {
                if (fnUnit.param.elseif) {
                    path.push(fnUnit.param.elseif.length);
                } else {
                    return [template];
                }
            }
            return template;
        }());

        var command
            = new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(this, {
                fnUnit: fnUnit,
                path: path,
                value: val
            });
        return command;
    };

    DiagramEditorWrapper.prototype.createRemoveActivityCommand = function (fnUnit, options) {
        var command
            = new Brightics.VA.Core.Editors.Diagram.Commands.RemoveActivityCommand(this, {
                mid: options.mid
            });
        return command;
    };

    DiagramEditorWrapper.prototype.createRemoveParameterCommand = function (fnUnit, options) {
        var conditionType = options._conditionType || 'elseif';
        if (conditionType !== 'elseif') return;
        var path = ['param', conditionType];
        var idx = _.findIndex(fnUnit.param.elseif, function (cond) {
            return cond.mid === options.mid;
        });
        if (idx === -1) return;
        path.push(idx);
        var command
            = new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand(this, {
                fnUnit: fnUnit,
                path: path
            });
        return command;
    };

    DiagramEditorWrapper.prototype.getHeaderHeight = function () {
        return (this.activeHeader) ? this.activeHeader.getHeight() : 0;
    };

    DiagramEditorWrapper.prototype.setLayoutManager = function (layoutManager) {
        this.layoutManager = layoutManager;
    };

    DiagramEditorWrapper.prototype.createLoopFieldChangeCommand = function (fnUnit, options) {
        var path = ['param'].concat(options.path);

        var commandOptions = {
            label: 'Loop Field Update',
            fnUnit: fnUnit,
            path: path,
            value: options.val,
            view: 'header'
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(
            this,
            commandOptions);
        return command;
    };

    DiagramEditorWrapper.prototype.createLoopTypeChangeCommand = function (fnUnit, options) {
        var compound = new Brightics.VA.Core.CompoundCommand(this, {
            label: 'Loop Type Changed',
            view: 'header'
        });

        compound.add(new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(this, {
            fnUnit: fnUnit,
            path: ['param', LOOP_TYPE],
            value: options.loopType
        }));

        compound.add(new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(this, {
            fnUnit: fnUnit,
            path: ['param', LOOP_PROPERTY],
            value: _.cloneDeep(DEFAULT_LOOP_PROP[options.loopType])
        }));

        return compound;
    };

    Editors.Diagram.DiagramEditorWrapper = DiagramEditorWrapper;
/* eslint-disable no-invalid-this */
}.call(this));
