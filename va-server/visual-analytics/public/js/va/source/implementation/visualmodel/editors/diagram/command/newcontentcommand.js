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
    function NewContentCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    NewContentCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewContentCommand.prototype.constructor = NewContentCommand;

    NewContentCommand.prototype.canUndo = function () {
        return true;
    };

    NewContentCommand.prototype.canRedo = function () {
        return true;
    };

    NewContentCommand.prototype.execute = function () {
        this.options.analyticsModel.addContentToSpecificPage(this.options.content, this.options.pageId);
    };

    NewContentCommand.prototype.undo = function () {
        this.options.analyticsModel.removeContent(this.options.content.id);
    };

    NewContentCommand.prototype.redo = function () {
        this.execute();
    };

    NewContentCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.newcontentcommand';
    };

    NewContentCommand.prototype.getLabel = function () {
        return 'Create a Page';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewContentCommand = NewContentCommand;

}).call(this);