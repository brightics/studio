/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetUDFFnUnitParameterValueCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Properties';
    }

    SetUDFFnUnitParameterValueCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetUDFFnUnitParameterValueCommand.prototype.constructor = SetUDFFnUnitParameterValueCommand;

    SetUDFFnUnitParameterValueCommand.prototype.execute = function () {
        this.old['input-variables'] = $.extend(true, {}, this.options.fnUnit.param['input-variables']);
        for (var key in this.options.ref.param['input-variables']) this.copy(this.options.fnUnit.param['input-variables'], this.options.ref.param['input-variables'], key);
    };

    SetUDFFnUnitParameterValueCommand.prototype.copy = function (to, from, key) {
        if (from[key].constructor == Array) to[key] = $.extend(true, [], from[key]);
        else if (from[key].constructor == Object) to[key] = $.extend(true, {}, from[key]);
        else to[key] = from[key];
    };

    SetUDFFnUnitParameterValueCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit.param['input-variables']) delete this.options.fnUnit.param['input-variables'][key];
        $.extend(true, this.options.fnUnit.param['input-variables'], this.old['input-variables']);
    };

    SetUDFFnUnitParameterValueCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.SetUDFFnUnitParameterValueCommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetUDFFnUnitParameterValueCommand = SetUDFFnUnitParameterValueCommand;

}).call(this);