/**
 * Created by sungjin1.kim on 2016-03-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options: {
     *      panel: this.options.panel,
     *      layout: this.options.layout,
     *      new: {
     *          contentsPanelOption: {
     *              id: id,
     *              chartOption: JSON.parse(JSON.stringify(contentsPanel.options.chartOption))
     *          },
     *          layoutOption: {
     *              id: id,
     *              type: 'panel'
     *          },
     *          size: size
     *      },
     * }
     * @param options
     * @constructor
     */
    function NewChartCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    NewChartCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewChartCommand.prototype.constructor = NewChartCommand;

    NewChartCommand.prototype.canUndo = function () {
        return true;
    };

    NewChartCommand.prototype.canRedo = function () {
        return true;
    };

    NewChartCommand.prototype.execute = function () {
        this.options.panel.push(this.options.panelOption);
    };

    NewChartCommand.prototype.undo = function () {
        this.options.panel.splice(this.options.panel.indexOf(this.options.panelOption), 1);
    };

    NewChartCommand.prototype.redo = function () {
        this.execute();
    };

    NewChartCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.newchartcommand';
    };

    NewChartCommand.prototype.getLabel = function () {
        return 'Clone a Chart';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.NewChartCommand = NewChartCommand;

}).call(this);