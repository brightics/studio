/**
 * @deprecated
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Properties';
    }

    SetFnUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetFnUnitCommand.prototype.constructor = SetFnUnitCommand;

    SetFnUnitCommand.prototype.execute = function () {
        this.old = $.extend(true, {}, this.options.fnUnit);

        for (var key in this.options.ref) {
            if (key === 'param') for (var paramKey in this.options.ref.param) {
                this.copy(this.options.fnUnit.param, this.options.ref.param, paramKey);
            }
            else this.copy(this.options.fnUnit, this.options.ref, key);
        }

        if (this.options.fnUnit[IN_DATA] && this.options.fnUnit[FUNCTION_NAME] === 'Subflow') {
            this.options.fnUnit.param.functions[0][IN_DATA] = $.extend(true, [], this.options.fnUnit[IN_DATA]);
        }
    };

    SetFnUnitCommand.prototype.copy = function (target, ref, key) {
        if (ref[key].constructor == Array) target[key] = $.extend(true, [], ref[key]);
        else if (ref[key].constructor == Object) target[key] = $.extend(true, {}, ref[key]);
        else target[key] = ref[key];
    };

    SetFnUnitCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit) delete this.options.fnUnit[key];
        $.extend(true, this.options.fnUnit, this.old);

        if (this.options.fnUnit[IN_DATA] && this.options.fnUnit[FUNCTION_NAME] === 'Subflow') {
            this.options.fnUnit.param.functions[0][IN_DATA] = $.extend(true, [], this.options.fnUnit[IN_DATA]);
        }
    };

    SetFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setfnunitcommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand = SetFnUnitCommand;

}).call(this);