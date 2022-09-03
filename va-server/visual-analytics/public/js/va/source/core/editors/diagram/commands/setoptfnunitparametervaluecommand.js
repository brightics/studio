/**
 * Created by sds on 2018-02-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * overwrite options command
     * @param eventSource
     * @param options
     * @constructor
     */
    function SetOptFnUnitParameterValueCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Properties';
    }

    SetOptFnUnitParameterValueCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetOptFnUnitParameterValueCommand.prototype.constructor = SetOptFnUnitParameterValueCommand;

    SetOptFnUnitParameterValueCommand.prototype.execute = function () {
        this.old.param = $.extend(true, {}, this.options.fnUnit.param);
        this.options.fnUnit.param = this.options.ref.param;
    };

    SetOptFnUnitParameterValueCommand.prototype.undo = function () {
        this.options.fnUnit.param = this.old.param;
    };

    SetOptFnUnitParameterValueCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setoptfnunitparametervaluecommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetOptFnUnitParameterValueCommand = SetOptFnUnitParameterValueCommand;

}).call(this);