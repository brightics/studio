/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ReplaceFnUnitParamCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    ReplaceFnUnitParamCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ReplaceFnUnitParamCommand.prototype.constructor = ReplaceFnUnitParamCommand;

    ReplaceFnUnitParamCommand.prototype.canUndo = function () {
        return true;
    };

    ReplaceFnUnitParamCommand.prototype.canRedo = function () {
        return true;
    };

    ReplaceFnUnitParamCommand.prototype.execute = function () {
        this.oldFnUnit = $.extend({}, this.options.fnUnit);
        for (var key in this.options.ref) {
            if (this.options.ref[key].constructor == Array)
                this.options.fnUnit[key] = $.extend(true, [], this.options.ref[key]);
            else if (this.options.ref[key].constructor == Object)
                this.options.fnUnit[key] = $.extend(true, {}, this.options.ref[key]);
            else
                this.options.fnUnit[key] = this.options.ref[key];
        }
    };

    ReplaceFnUnitParamCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit) {
            delete this.options.fnUnit[key];
        }

        $.extend(this.options.fnUnit, this.oldFnUnit);
    };

    ReplaceFnUnitParamCommand.prototype.redo = function () {
        this.execute();
    };

    ReplaceFnUnitParamCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.replacefnunitparamcommand';
    };

    ReplaceFnUnitParamCommand.prototype.getLabel = function () {
        return 'Replace FnUnit Properties';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ReplaceFnUnitParamCommand = ReplaceFnUnitParamCommand;

}).call(this);