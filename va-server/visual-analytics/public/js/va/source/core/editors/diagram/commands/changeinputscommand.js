/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChangeInputsCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Inputs Properties';
    }

    ChangeInputsCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ChangeInputsCommand.prototype.constructor = ChangeInputsCommand;

    ChangeInputsCommand.prototype.execute = function () {
        this.old = $.extend(true, {}, this.FnUnitUtils.getInputs(this.options.fnUnit));

        this.options.fnUnit.inputs = this.options.ref.inputs;
    };

    ChangeInputsCommand.prototype.undo = function () {
        this.options.fnUnit.inputs = this.old;
    };

    ChangeInputsCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.changeinputscommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand = ChangeInputsCommand;

}).call(this);
