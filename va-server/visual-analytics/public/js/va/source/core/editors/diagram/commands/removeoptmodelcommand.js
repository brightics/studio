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
    function RemoveOptModelCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Remove a OPT model';
    }

    RemoveOptModelCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveOptModelCommand.prototype.constructor = RemoveOptModelCommand;

    RemoveOptModelCommand.prototype.execute = function () {
        var pid = this.options.pid;
        var mid = this.options.mid;
        var optId = this.options.optId;
        this.old.optModel = Brightics.OptModelManager.removeOptModel(pid, mid, optId);
    };

    RemoveOptModelCommand.prototype.undo = function () {
        var pid = this.options.pid;
        var mid = this.options.mid;
        var optModel = this.old.optModel;
        Brightics.OptModelManager.addOptModel(pid, mid, optModel);
    };

    RemoveOptModelCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.removeoptmodelcommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RemoveOptModelCommand = RemoveOptModelCommand;

}).call(this);