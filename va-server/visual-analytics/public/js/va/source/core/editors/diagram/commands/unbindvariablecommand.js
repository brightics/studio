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
    function UnBindVariableCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    UnBindVariableCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UnBindVariableCommand.prototype.constructor = UnBindVariableCommand;

    UnBindVariableCommand.prototype.canUndo = function () {
        return true;
    };

    UnBindVariableCommand.prototype.canRedo = function () {
        return true;
    };

    UnBindVariableCommand.prototype.execute = function () {
        this.getMainModel().removeVariable(this.options.fid, this.options.paramKey);
    };

    UnBindVariableCommand.prototype.undo = function () {
        this.getMainModel()
            .addVariable(this.options.fid, this.options.paramKey, this.options.variable);
    };

    UnBindVariableCommand.prototype.redo = function () {
        this.execute();
    };

    UnBindVariableCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.unbindvariablecommand';
    };

    UnBindVariableCommand.prototype.getLabel = function () {
        return 'Unbind Variable';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.UnBindVariableCommand = UnBindVariableCommand;

}).call(this);