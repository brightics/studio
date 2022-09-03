/**
 * Created by sungjin1.kim on 2016-03-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options: {
     *      chart: {
     *          type: ''
     *      },
     *      new: {
     *          type: ''
     *      },
     *      old: {
     *          type: ''
     *      }
     * }
     * @param options
     * @constructor
     */
    function SwitchChartCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.old = {};
    }

    SwitchChartCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SwitchChartCommand.prototype.constructor = SwitchChartCommand;

    SwitchChartCommand.prototype.canUndo = function () {
        return true;
    };

    SwitchChartCommand.prototype.canRedo = function () {
        return true;
    };

    SwitchChartCommand.prototype.execute = function () {
        this.options.old.type = this.options.panelOption.chartOption.chart.type;
        this.options.panelOption.chartOption.chart.type = this.options.type;
    };

    SwitchChartCommand.prototype.undo = function () {
        this.options.panelOption.chartOption.chart.type = this.options.old.type;
    };

    SwitchChartCommand.prototype.redo = function () {
        this.execute();
    };

    SwitchChartCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.switchchartcommand';
    };

    SwitchChartCommand.prototype.getLabel = function () {
        return 'Switch a Chart Type';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SwitchChartCommand = SwitchChartCommand;

}).call(this);