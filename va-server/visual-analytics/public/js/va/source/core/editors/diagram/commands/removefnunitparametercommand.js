/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RemoveFnUnitParameterCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemoveFnUnitParameterCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveFnUnitParameterCommand.prototype.constructor = RemoveFnUnitParameterCommand;

    RemoveFnUnitParameterCommand.prototype.execute = function () {
        this.old.param = $.extend(true, {}, this.options.fnUnit.param);
        for (var key in this.options.ref.param) delete this.options.fnUnit.param[key];
    };

    RemoveFnUnitParameterCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit.param) delete this.options.fnUnit.param[key];
        $.extend(true, this.options.fnUnit.param, this.old.param);
    };

    RemoveFnUnitParameterCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.removefnunitparametercommand';
    };

    RemoveFnUnitParameterCommand.prototype.getLabel = function () {
        return 'Change FnUnit Properties';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitParameterCommand = RemoveFnUnitParameterCommand;

}).call(this);