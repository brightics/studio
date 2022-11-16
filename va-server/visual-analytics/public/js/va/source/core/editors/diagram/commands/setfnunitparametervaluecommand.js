/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetFnUnitParameterValueCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Properties';
    }

    SetFnUnitParameterValueCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetFnUnitParameterValueCommand.prototype.constructor = SetFnUnitParameterValueCommand;

    SetFnUnitParameterValueCommand.prototype.execute = function () {
        this.old.param = $.extend(true, {}, this.options.fnUnit.param);
        for (var key in this.options.ref.param) this.copy(this.options.fnUnit.param, this.options.ref.param, key);
    };

    SetFnUnitParameterValueCommand.prototype.copy = function (to, from, key) {
        if (from[key].constructor == Array) to[key] = $.extend(true, [], from[key]);
        else if (from[key].constructor == Object) to[key] = $.extend(true, {}, from[key]);
        else to[key] = from[key];
    };

    SetFnUnitParameterValueCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit.param) delete this.options.fnUnit.param[key];
        $.extend(true, this.options.fnUnit.param, this.old.param);
    };

    SetFnUnitParameterValueCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setfnunitparametervaluecommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand = SetFnUnitParameterValueCommand;

}).call(this);