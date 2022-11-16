/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      content : {},
     *      chartType : 'string',
     * }
     *
     * @param options
     * @constructor
     */
    function SetContentChartTypeCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetContentChartTypeCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetContentChartTypeCommand.prototype.constructor = SetContentChartTypeCommand;

    SetContentChartTypeCommand.prototype.canUndo = function () {
        return true;
    };

    SetContentChartTypeCommand.prototype.canRedo = function () {
        return true;
    };

    SetContentChartTypeCommand.prototype.execute = function () {
        this.old.chartType = this.options.content.options.chart.type;
        this.options.content.options.chart.type = this.options.chartType;
    };

    SetContentChartTypeCommand.prototype.undo = function () {
        this.options.content.options.chart.type = this.old.chartType;
    };

    SetContentChartTypeCommand.prototype.redo = function () {
        this.execute();
    };

    SetContentChartTypeCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.setcontentcharttypecommand';
    };

    SetContentChartTypeCommand.prototype.getLabel = function () {
        return 'Update Content Chart Type';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentChartTypeCommand = SetContentChartTypeCommand;

}).call(this);