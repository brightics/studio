/**
 * Created by daewon.park on 2016-03-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      dataSourceId : '',
     *      label : ''
     * }
     * @param options
     * @constructor
     */
    function RenameDataSourceCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = options.label || 'Rename data source';
    }

    RenameDataSourceCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RenameDataSourceCommand.prototype.constructor = RenameDataSourceCommand;

    RenameDataSourceCommand.prototype.execute = function () {
        var dataSource = this.options.analyticsModel.getDataSource(this.options.dataSourceId);
        this.old.label = dataSource.display.label;
        this.options.analyticsModel.renameDataSource(this.options.dataSourceId, this.options.label);
    };

    RenameDataSourceCommand.prototype.undo = function () {
        this.options.analyticsModel.renameDataSource(this.options.dataSourceId, this.old.label);
    };

    RenameDataSourceCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.renamedatasourcecommand';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RenameDataSourceCommand = RenameDataSourceCommand;

}).call(this);