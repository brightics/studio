/**
 * Created by daewon.park on 2016-03-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      dataSourceId : ''
     * }
     *
     * @param eventSource
     * @param options
     * @constructor
     */
    function RemoveDataSourceCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    RemoveDataSourceCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveDataSourceCommand.prototype.constructor = RemoveDataSourceCommand;

    RemoveDataSourceCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveDataSourceCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveDataSourceCommand.prototype.execute = function () {
        this.old.dataSourceIndex = this.options.analyticsModel.getDataSourceIndex(this.options.dataSourceId);
        this.old.dataSource = this.options.analyticsModel.removeDataSource(this.options.dataSourceId);
    };

    RemoveDataSourceCommand.prototype.undo = function () {
        this.options.analyticsModel.addDataSource(this.old.dataSource, this.old.dataSourceIndex);
    };

    RemoveDataSourceCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveDataSourceCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.removedatasourcecommand';
    };

    RemoveDataSourceCommand.prototype.getLabel = function () {
        return 'Remove a Function';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveDataSourceCommand = RemoveDataSourceCommand;

}).call(this);