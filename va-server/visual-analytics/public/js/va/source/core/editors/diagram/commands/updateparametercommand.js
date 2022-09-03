/**
 * Created by sungjin1.kim on 2016-04-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function UpdateParameterCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    UpdateParameterCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UpdateParameterCommand.prototype.constructor = UpdateParameterCommand;

    UpdateParameterCommand.prototype.canUndo = function () {
        return true;
    };

    UpdateParameterCommand.prototype.canRedo = function () {
        return true;
    };

    UpdateParameterCommand.prototype.execute = function () {
        this.options.old = {};
        this.options.old[this.options.name] = this.options.analyticsModel.getParameter(this.options.name)
        this.options.analyticsModel.setParameter(this.options.name, this.options.ref);

    };

    UpdateParameterCommand.prototype.undo = function () {
        var key = (Object.keys(this.options.old))[0];
        this.options.analyticsModel.setParameter(key, this.options.old[key]);
    };

    UpdateParameterCommand.prototype.redo = function () {
        this.execute();
    };

    UpdateParameterCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.UpdateParameterCommand';
    };

    UpdateParameterCommand.prototype.getLabel = function () {
        return 'Update Parameters';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.UpdateParameterCommand = UpdateParameterCommand;

}).call(this);