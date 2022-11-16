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
    function RemoveChartCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.old = {};
    }

    RemoveChartCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveChartCommand.prototype.constructor = RemoveChartCommand;

    RemoveChartCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveChartCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveChartCommand.prototype.execute = function () {
        this.options.old.index = this.options.panel.indexOf(this.options.panelOption);
        this.options.panel.splice(this.options.old.index, 1);
    };

    RemoveChartCommand.prototype.undo = function () {
        this.options.panel.splice(this.options.old.index, 0, this.options.panelOption);
    };

    RemoveChartCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveChartCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.removechartcommand';
    };

    RemoveChartCommand.prototype.getLabel = function () {
        return 'Close a Chart';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RemoveChartCommand = RemoveChartCommand;

}).call(this);