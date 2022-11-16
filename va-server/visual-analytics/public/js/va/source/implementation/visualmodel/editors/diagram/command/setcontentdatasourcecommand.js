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
    function SetContentDataSourceCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetContentDataSourceCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetContentDataSourceCommand.prototype.constructor = SetContentDataSourceCommand;

    SetContentDataSourceCommand.prototype.canUndo = function () {
        return true;
    };

    SetContentDataSourceCommand.prototype.canRedo = function () {
        return true;
    };

    SetContentDataSourceCommand.prototype.execute = function () {
        this.old.dataSourceId = this.options.content.dataSourceId;
        this.options.content.dataSourceId = this.options.dataSourceId;
    };

    SetContentDataSourceCommand.prototype.undo = function () {
        this.options.content.dataSourceId = this.old.dataSourceId;
    };

    SetContentDataSourceCommand.prototype.redo = function () {
        this.execute();
    };

    SetContentDataSourceCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.setcontentdatasourcecommand';
    };

    SetContentDataSourceCommand.prototype.getLabel = function () {
        return 'Update a Content';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentDataSourceCommand = SetContentDataSourceCommand;

}).call(this);