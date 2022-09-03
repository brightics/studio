/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChangeDataSourceCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    ChangeDataSourceCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ChangeDataSourceCommand.prototype.constructor = ChangeDataSourceCommand;


    ChangeDataSourceCommand.prototype.execute = function () {
        this.old.panel = {};
        // backup
        this.old.panel.tableIndexes = this.options.panel.tableIndexes || [0];
        // change
        this.options.panel.tableIndexes = this.options.ref.panel.tableIndexes;
    };

    ChangeDataSourceCommand.prototype.undo = function () {
        this.options.panel.tableIndexes = this.old.panel.tableIndexes;
    };

    ChangeDataSourceCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.changedatasourcecommand';
    };

    ChangeDataSourceCommand.prototype.getLabel = function () {
        return 'Change Chart Data Source';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ChangeDataSourceCommand = ChangeDataSourceCommand;

}).call(this);