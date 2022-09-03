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
    function NewDataSourceCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    NewDataSourceCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewDataSourceCommand.prototype.constructor = NewDataSourceCommand;

    NewDataSourceCommand.prototype.canUndo = function () {
        return true;
    };

    NewDataSourceCommand.prototype.canRedo = function () {
        return true;
    };

    NewDataSourceCommand.prototype.execute = function () {
        this.options.analyticsModel.addDataSource(this.options.dataSource);
    };

    NewDataSourceCommand.prototype.undo = function () {
        this.options.analyticsModel.removeDataSource(this.options.dataSource.fid);
    };

    NewDataSourceCommand.prototype.redo = function () {
        this.execute();
    };

    NewDataSourceCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.newdatasourcecommand';
    };

    NewDataSourceCommand.prototype.getLabel = function () {
        return 'Add a Function';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewDataSourceCommand = NewDataSourceCommand;

}).call(this);