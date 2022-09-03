/**
 * Created by ty_tree.kim on 2016-02-11.
 */

/* global _, brtc_require */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Logger = new Brightics.VA.Log('CommandManager');

    var modelDiff = brtc_require('modelDiff');

    function CommandManager(analyticsModel, editor) {
        this.index = -1;
        this.stack = [];
        this.listeners = [];
        this.historyListener = [];
        this.isExecuting = false;
        this.analyticsModel = analyticsModel || {};

        this.interval = 1000; // interval time to treat commands as a compound command

        this.init(editor);
    }

    CommandManager.prototype.init = function (editor) {
        if (editor) {
            this.editor = editor;
            this.mainModel = editor.getModel();
        }
    };

    CommandManager.prototype.canUndo = function (command) {
        if (this.isExecuting) {
            return false;
        }

        if (typeof command === 'undefined') {
            command = this.stack[this.index];
        }

        if (!(command instanceof Brightics.VA.Core.Command)) {
            return false;
        }

        return (this.index !== -1) && command.canUndo();
    };

    CommandManager.prototype.canRedo = function (command) {
        if (this.isExecuting) {
            return false;
        }

        if (typeof command === 'undefined') {
            command = this.stack[this.index + 1];
        }

        if (!(command instanceof Brightics.VA.Core.Command)) {
            return false;
        }

        return (this.index + 1 < this.stack.length) && command.canRedo();
    };

    CommandManager.prototype.notifyListeners = function (command, modelDiff) {
        let cloneListeners = _.cloneDeep(this.listeners);
        for (let i = 0; i < cloneListeners.length; i++) {
            cloneListeners[i](command, modelDiff);
        }
    };

    CommandManager.prototype.registerCallback = function (callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
    };

    CommandManager.prototype.registerCallbackLeft = function (callback) {
        if (typeof callback === 'function') {
            this.listeners.splice(0, 0, callback);
        }
    };

    CommandManager.prototype.unRegisterCallback = function (callback) {
        if (typeof callback === 'function') {
            var index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        }
    };

    CommandManager.prototype.execute = function (command) {
        if (!command) return;
        return this._execute(command);
    };
    CommandManager.prototype.setActiveModel = function (command) {
        var model = this.editor.getActiveModel();
        command.options.analyticsModel = model || this.analyticsModel;
    };

    CommandManager.prototype._execute = function (command) {
        try {
            Logger.trace('Execute Command START...');
            command.event.type = 'EXECUTE';

            
            // command.options.analyticsModel = this.analyticsModel;
            this.setActiveModel(command);
            command.options.mainModel = this.mainModel;
            this.check();
            if (command.options.mainModel.type == 'data')// TODO @sungjin1.kim 확인필요
                command.options.editorContext = {
                    mid: this.editor.getActiveModel().mid,
                    fnUnit: this.editor.getActiveFnUnit()
                };
            if (command.execute() === false || !command.options.undoable) {
                return false;
            }

            if (this.index + 1 !== this.stack.length) {
                this.stack.splice(this.index + 1, this.stack.length - this.index - 1);
            }
            this.stack.push(command);
            this.index++;
            this.notifyListeners(command, this.getModelDiff());
            Logger.debug('Command Executed: \'' + this._getCommandName(command) + '\'');
            Logger.trace('Execute Command END...');
            return true;
        } catch (e) {
            Logger.error('Failed to execute command: ' + this._getCommandName(command));
            Logger.error(JSON.stringify(command.options));
            Logger.error(e.stack);
            
            var  commandErrorMessage = 'Failed to save last operation. Back up the data from the last operation, then reopen the editor and try again.';
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(commandErrorMessage);
            return false;
        }
    };

    CommandManager.prototype.undo = function (notify) {
        var command = this.stack[this.index];
        var hasToNotify = !!notify || _.isUndefined(notify);
        if (this.canUndo(command)) {
            command.event.type = 'UNDO';
            if (hasToNotify) this.check();
            command.undo();

            this.index--;

            if (hasToNotify) {
                this.notifyListeners(command, this.getModelDiff());
            }
        }
        return command;
    };

    CommandManager.prototype.redo = function (notify) {
        var command = this.stack[this.index + 1];
        var hasToNotify = !!notify || _.isUndefined(notify);
        if (this.canRedo(command)) {
            command.event.type = 'REDO';
            if (hasToNotify) this.check();
            command.redo();

            this.index++;
            if (hasToNotify) {
                this.notifyListeners(command, this.getModelDiff());
            }
        }
        return command;
    };

    CommandManager.prototype.getStacks = function () {
        return this.stack;
    };

    CommandManager.prototype.go = function (history) {
        var commands = [];
        this.check();
        if (parseInt(history.index) < this.index) {
            for (var undoIdx = this.index; undoIdx > parseInt(history.index); undoIdx--) {
                commands.push(this.undo(false));

                if (undoIdx === parseInt(history.index + 1)) {
                    this.notifyRefresh(new Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand(
                        this.stack[history.index] ? {
                            options: this.stack[history.index].options,
                            commands: commands
                        } : {
                            options: {},
                            commands: commands
                        }),
                        this.getModelDiff()
                    );
                }
            }
        } else if (parseInt(history.index) > this.index) {
            for (var redoIdx = this.index; redoIdx < parseInt(history.index); redoIdx++) {
                commands.push(this.redo(false));

                if ((redoIdx + 1) === parseInt(history.index)) {
                    this.notifyRefresh(new Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand(
                        this.stack[history.index] ? {
                            options: this.stack[history.index].options,
                            commands: commands
                        } : {
                            options: {},
                            commands: commands
                        }),
                        this.getModelDiff()
                    );
                }
            }
        }
    };

    CommandManager.prototype.notifyRefresh = function (historyListener, modelDiff) {
        for (var i = 0; i < this.historyListener.length; i++) {
            this.historyListener[i](historyListener, modelDiff);
        }
    };

    CommandManager.prototype.registerGoHistoryCallback = function (callback) {
        if (typeof callback === 'function') {
            this.historyListener.push(callback);
        }
    };

    CommandManager.prototype.registerGoHistoryCallbackLeft = function (callback) {
        if (typeof callback === 'function') {
            this.historyListener.splice(0, 0, callback);
        }
    };

    CommandManager.prototype.unRegisterGoHistoryCallback = function (callback) {
        if (typeof callback === 'function') {
            var index = this.historyListener.indexOf(callback);
            if (index > -1) {
                this.historyListener.splice(index, 1);
            }
        }
    };

    CommandManager.prototype._getCommandName = function (inputCmd) {
        var cmdName = inputCmd.getId() || inputCmd.constructor.name;
        if (inputCmd instanceof Brightics.VA.Core.CompoundCommand) {
            inputCmd.commandList.forEach(function (cmdObj) {
                cmdName += cmdObj.getId() || cmdObj.constructor.name + ' ';
            });
        }
        return cmdName || '';
    };

    CommandManager.prototype.getIndex = function () {
        return this.index;
    };

    CommandManager.prototype.check = function () {
        this.clonedModel = _.cloneDeep(this.mainModel);
    };

    CommandManager.prototype.getModelDiff = function () {
        var diff = modelDiff(this.clonedModel, this.mainModel);
        this.clonedModel = null;
        return diff;
    };

    Brightics.VA.Core.CommandManager = CommandManager;
}.call(this));
