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
    function RemoveDataSourceChartsCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    RemoveDataSourceChartsCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveDataSourceChartsCommand.prototype.constructor = RemoveDataSourceChartsCommand;

    RemoveDataSourceChartsCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveDataSourceChartsCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveDataSourceChartsCommand.prototype.execute = function () {
        var dataSource = this.options.analyticsModel.getDataSource(this.options.dataSourceId);
        this.old.chart = $.extend(true, {}, dataSource.display.charts[this.options.chartIndex]);
        dataSource.display.charts.splice(this.options.chartIndex, 1);
    };

    RemoveDataSourceChartsCommand.prototype.undo = function () {
        var dataSource = this.options.analyticsModel.getDataSource(this.options.dataSourceId);
        dataSource.display.charts.splice(this.options.chartIndex, 0, this.old.chart);
    };

    RemoveDataSourceChartsCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveDataSourceChartsCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.removedatasourcechartscommand';
    };

    RemoveDataSourceChartsCommand.prototype.getLabel = function () {
        return 'Remove a chart in data source.';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveDataSourceChartsCommand = RemoveDataSourceChartsCommand;

}).call(this);