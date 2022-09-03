/**
 * Created by ty_tree.kim on 2016-02-11.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CompoundCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);

        this.options.type = this.options.type || 'none-interval';
        this.commandList = this.commandList || [];
    }

    CompoundCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    CompoundCommand.prototype.constructor = CompoundCommand;

    CompoundCommand.prototype.add = function (command) {
        if (command instanceof Brightics.VA.Core.Command) {
            this.commandList.push(command);
            $.extend(true, this.options, command.options);
        } else if (_.isArray(command)) {
            _.forEach(command, function (cmd) {
                if (cmd instanceof Brightics.VA.Core.Command) {
                    this.commandList.push(cmd);
                    $.extend(true, this.options, cmd.options);
                }
            }.bind(this));
        }
    };

    CompoundCommand.prototype.canUndo = function () {
        return !(this.commandList === undefined || this.commandList.length === 0);
    };

    CompoundCommand.prototype.canRedo = function () {
        return !(this.commandList === undefined || this.commandList.length === 0);
    };

    CompoundCommand.prototype.execute = function () {
        var _this = this;
        if (this.options.type === 'interval') {
            var i = this.commandList.length - 1;
            this.commandList[i].options.type = this.options.type;
            this.commandList[i].options.analyticsModel = this.options.analyticsModel;
            this.commandList[i].options.mainModel = this.options.mainModel;
            this.commandList[i].execute();
        } else {
            $.each(this.commandList, function (index, command) {
                command.event.type = _this.event.type;
                command.options.type = _this.options.type;
                command.options.analyticsModel = _this.options.analyticsModel;
                command.options.mainModel = _this.options.mainModel;
                command.execute();
            });
        }
    };

    CompoundCommand.prototype.undo = function () {
        var _this = this;
        if (this.options.type === 'interval') {
            this.commandList[0].options.type = this.options.type;
            this.commandList[0].undo();
        } else {
            for (var i = _this.commandList.length - 1; i >= 0; i--) {
                var command = _this.commandList[i];
                command.event.type = _this.event.type;
                command.options.type = _this.options.type;
                command.undo();
            }
        }
    };

    CompoundCommand.prototype.redo = function () {
        var _this = this;
        if (this.options.type === 'interval') {
            var i = this.commandList.length - 1;
            this.commandList[i].options.type = this.options.type;
            this.commandList[i].redo();
        } else {
            $.each(this.commandList, function (index, command) {
                command.event.type = _this.event.type;
                command.options.type = _this.options.type;
                command.redo();
            });
        }
    };

    CompoundCommand.prototype.getId = function () {
        return this.options.id ? this.options.id : this.commandList[0].getId();
    };

    CompoundCommand.prototype.getLabel = function () {
        return this.options.label ? this.options.label : this.commandList[0].getLabel();
    };

    Brightics.VA.Core.CompoundCommand = CompoundCommand;

}).call(this);