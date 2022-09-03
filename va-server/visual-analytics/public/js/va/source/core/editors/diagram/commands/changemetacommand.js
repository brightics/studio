/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChangeMetaCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Meta Properties';
    }

    ChangeMetaCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ChangeMetaCommand.prototype.constructor = ChangeMetaCommand;

    ChangeMetaCommand.prototype.execute = function () {
        this.old = $.extend(true, {}, this.FnUnitUtils.getMeta(this.options.fnUnit));

        this.options.fnUnit.meta = this.options.ref.meta;
    };

    ChangeMetaCommand.prototype.undo = function () {
        this.options.fnUnit.meta = this.old;
    };

    ChangeMetaCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.changemetacommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ChangeMetaCommand = ChangeMetaCommand;

}).call(this);
