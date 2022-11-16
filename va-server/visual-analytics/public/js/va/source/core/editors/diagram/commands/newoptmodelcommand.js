/**
 * Created by ty_tree.kim on 2016-02-11.
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
    function NewOptModelCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Create a OPT model';
    }

    NewOptModelCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewOptModelCommand.prototype.constructor = NewOptModelCommand;

    NewOptModelCommand.prototype.execute = function () {
        var pid = this.options.pid;
        var mid = this.options.mid;
        var optModel = this.options.optModel;
        Brightics.OptModelManager.addOptModel(pid, mid, optModel);
    };

    NewOptModelCommand.prototype.undo = function () {
        var pid = this.options.pid;
        var mid = this.options.mid;
        var optId = this.options.optModel['optId'];
        Brightics.OptModelManager.removeOptModel(pid, mid, optId);
    };

    NewOptModelCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.newoptmodelcommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.NewOptModelCommand = NewOptModelCommand;

}).call(this);