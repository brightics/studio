/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetDialogFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Properties';
    }

    SetDialogFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetDialogFnUnitCommand.prototype.constructor = SetDialogFnUnitCommand;

    SetDialogFnUnitCommand.prototype.execute = function () {
        this.old.param = $.extend(true, {}, this.options.fnUnit.param);
        for (var key in this.options.ref.param) this.copy(this.options.fnUnit.param, this.options.ref.param, key);
    };

    SetDialogFnUnitCommand.prototype.copy = function (to, from, key) {
        if (from[key].constructor == Array) to[key] = $.extend(true, [], from[key]);
        else if (from[key].constructor == Object) to[key] = $.extend(true, {}, from[key]);
        else to[key] = from[key];
    };

    SetDialogFnUnitCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit.param) delete this.options.fnUnit.param[key];
        $.extend(true, this.options.fnUnit.param, this.old.param);
    };

    SetDialogFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setdialogfnUnitcommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetDialogFnUnitCommand = SetDialogFnUnitCommand;

}).call(this);