/**
 * Created by sungjin1.kim on 2016-03-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options: {
     *      layout: {}
     * }
     * @param options
     * @constructor
     */
    function SetDataWorksheetLayoutCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetDataWorksheetLayoutCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetDataWorksheetLayoutCommand.prototype.constructor = SetDataWorksheetLayoutCommand;

    SetDataWorksheetLayoutCommand.prototype.canUndo = function () {
        return true;
    };

    SetDataWorksheetLayoutCommand.prototype.canRedo = function () {
        return true;
    };

    SetDataWorksheetLayoutCommand.prototype.execute = function () {
        this.options.oldLayout = $.extend(true, {}, this.options.layout);

        for(var p in this.options.layout) {
            delete this.options.layout[p];
        }
        $.extend(true, this.options.layout, this.options.newLayout);
    };

    SetDataWorksheetLayoutCommand.prototype.undo = function () {
        for(var p in this.options.layout) {
            delete this.options.layout[p];
        }
        $.extend(true, this.options.layout, this.options.oldLayout);
    };

    SetDataWorksheetLayoutCommand.prototype.redo = function () {
        this.execute();
    };

    SetDataWorksheetLayoutCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setdataworksheetlayoutcommand';
    };

    SetDataWorksheetLayoutCommand.prototype.getLabel = function () {
        return 'Change Layout';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetDataWorksheetLayoutCommand = SetDataWorksheetLayoutCommand;

}).call(this);