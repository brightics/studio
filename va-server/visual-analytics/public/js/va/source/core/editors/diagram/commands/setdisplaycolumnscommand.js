/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetDisplayColumnsCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change Display Columns';
    }

    SetDisplayColumnsCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetDisplayColumnsCommand.prototype.constructor = SetDisplayColumnsCommand;

    SetDisplayColumnsCommand.prototype.execute = function () {
        const tableId = this.options.tableId;
        this.old.columns = $.extend(true, {}, this.options.columns);
        
        delete this.options.columns[tableId];
        this.options.columns[tableId] = {};
        $.extend(true, this.options.columns[tableId], this.options.newColumns);
    };

    SetDisplayColumnsCommand.prototype.undo = function () {
        const tableId = this.options.tableId;
        delete this.options.columns[tableId];
        $.extend(true, this.options.columns, this.old.columns);
    };

    SetDisplayColumnsCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setdisplaycolumnscommand';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetDisplayColumnsCommand = SetDisplayColumnsCommand;

}).call(this);