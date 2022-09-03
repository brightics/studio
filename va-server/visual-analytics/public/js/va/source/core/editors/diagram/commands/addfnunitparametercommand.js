/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AddFnUnitParameterCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    AddFnUnitParameterCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    AddFnUnitParameterCommand.prototype.constructor = AddFnUnitParameterCommand;

    AddFnUnitParameterCommand.prototype.execute = function () {
        this.old.param = $.extend(true, {}, this.options.fnUnit.param);
        $.extend(true, this.options.fnUnit.param, this.options.ref.param);
    };

    AddFnUnitParameterCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit.param) delete this.options.fnUnit.param[key];
        $.extend(true, this.options.fnUnit.param, this.old.param);
    };

    AddFnUnitParameterCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.addfnunitparametercommand';
    };

    AddFnUnitParameterCommand.prototype.getLabel = function () {
        return 'Change FnUnit Properties';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.AddFnUnitParameterCommand = AddFnUnitParameterCommand;

}).call(this);