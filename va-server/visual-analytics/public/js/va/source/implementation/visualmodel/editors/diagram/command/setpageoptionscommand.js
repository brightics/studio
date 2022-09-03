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
    function SetPageDisplayOptionsCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetPageDisplayOptionsCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetPageDisplayOptionsCommand.prototype.constructor = SetPageDisplayOptionsCommand;

    SetPageDisplayOptionsCommand.prototype.canUndo = function () {
        return true;
    };

    SetPageDisplayOptionsCommand.prototype.canRedo = function () {
        return true;
    };

    SetPageDisplayOptionsCommand.prototype.execute = function () {
        this.options.old = $.extend(true, {}, this.options.report.display);
        $.extend(true, this.options.report.display, this.options.display);
    };

    SetPageDisplayOptionsCommand.prototype.undo = function () {
        this.options.report.display = this.options.old;
    };

    SetPageDisplayOptionsCommand.prototype.redo = function () {
        this.execute();
    };

    SetPageDisplayOptionsCommand.prototype.sort = function (list) {
    };

    SetPageDisplayOptionsCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.setpagedisplayoptionscommand';
    };

    SetPageDisplayOptionsCommand.prototype.getLabel = function () {
        return 'Change page options';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetPageDisplayOptionsCommand = SetPageDisplayOptionsCommand;

}).call(this);