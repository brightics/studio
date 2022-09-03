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
    function SetOptModelCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Set a OPT model';
    }

    SetOptModelCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetOptModelCommand.prototype.constructor = SetOptModelCommand;

    SetOptModelCommand.prototype.execute = function () {
        var pid = this.options.pid;
        var mid = this.options.mid;
        var optId = this.options.optId;

        this.old = $.extend(true, {}, Brightics.OptModelManager.getOptModel(pid, mid, optId));
        var optModel = this.options.optModel;
        Brightics.OptModelManager.setOptModel(pid, mid, optId, optModel);
    };

    SetOptModelCommand.prototype.undo = function () {
        var pid = this.options.pid;
        var mid = this.options.mid;
        var optId = this.options.optId;

        var optModel = $.extend(true, {}, this.old);
        Brightics.OptModelManager.setOptModel(pid, mid, optId, optModel);
    };

    SetOptModelCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setoptmodelcommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetOptModelCommand = SetOptModelCommand;

}).call(this);