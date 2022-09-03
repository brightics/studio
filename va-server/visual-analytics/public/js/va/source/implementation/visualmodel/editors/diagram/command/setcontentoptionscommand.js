/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function SetContentOptionCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetContentOptionCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetContentOptionCommand.prototype.constructor = SetContentOptionCommand;

    SetContentOptionCommand.prototype.canUndo = function () {
        return true;
    };

    SetContentOptionCommand.prototype.canRedo = function () {
        return true;
    };

    SetContentOptionCommand.prototype.execute = function () {
        this.old.chartOption = {};


        for (var key in this.options.changedOption) {
            if (this.options.chartOptions[key]) {
                this.old.chartOption[key] = JSON.parse(JSON.stringify(this.options.chartOptions[key]));
            } else {
                this.old.chartOption[key] = null;
            }
            this.options.content.options[key] = JSON.parse(JSON.stringify(this.options.changedOption[key]));
        }
    };

    SetContentOptionCommand.prototype.undo = function () {
        for (var key in this.old.chartOption) {
            if (this.old.chartOption[key]) {
                this.options.content.options[key] = JSON.parse(JSON.stringify(this.old.chartOption[key]));
            } else {
                this.options.content.options[key] = null;
            }
        }
    };

    SetContentOptionCommand.prototype.redo = function () {
        this.execute();
    };

    SetContentOptionCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.setcontentoptioncommand';
    };

    SetContentOptionCommand.prototype.getLabel = function () {
        return 'Update a Content';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentOptionCommand = SetContentOptionCommand;

}).call(this);