/**
 * Created by sungjin1.kim on 2016-03-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options: {
     *      Panel: []
     * }
     * @param options
     * @constructor
     */
    function SetDataWorksheetPanelCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetDataWorksheetPanelCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetDataWorksheetPanelCommand.prototype.constructor = SetDataWorksheetPanelCommand;

    SetDataWorksheetPanelCommand.prototype.canUndo = function () {
        return true;
    };

    SetDataWorksheetPanelCommand.prototype.canRedo = function () {
        return true;
    };

    SetDataWorksheetPanelCommand.prototype.execute = function () {
        this.options.oldPanel = $.extend(true, {}, this.options.panel);

        for (var i = 0; i < this.options.panel.length; i++) {
            delete this.options.panel[i];
        }
        $.extend(true, this.options.panel, this.options.newPanel);
    };

    SetDataWorksheetPanelCommand.prototype.undo = function () {
        for (var i = 0; i < this.options.panel.length; i++) {
            delete this.options.panel[i];
        }
        $.extend(true, this.options.panel, this.options.oldPanel);
    };

    SetDataWorksheetPanelCommand.prototype.redo = function () {
        this.execute();
    };

    SetDataWorksheetPanelCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.SetDataWorksheetPanelCommand';
    };

    SetDataWorksheetPanelCommand.prototype.getLabel = function () {
        return 'Change Panel';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetPanelCommand = SetDataWorksheetPanelCommand;

}).call(this);