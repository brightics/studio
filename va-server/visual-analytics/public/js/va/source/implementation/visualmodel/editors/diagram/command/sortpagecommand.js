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
    function SortPageCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SortPageCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SortPageCommand.prototype.constructor = SortPageCommand;

    SortPageCommand.prototype.canUndo = function () {
        return true;
    };

    SortPageCommand.prototype.canRedo = function () {
        return true;
    };

    SortPageCommand.prototype.execute = function () {
        this.old.pageIds = [];
        for (var i in this.options.analyticsModel.getPages()) {
            this.old.pageIds.push(this.options.analyticsModel.getPages()[i].id);
        }

        this.sort(this.options.pageIds);
    };

    SortPageCommand.prototype.undo = function () {
        this.sort(this.old.pageIds);
    };

    SortPageCommand.prototype.redo = function () {
        this.execute();
    };

    SortPageCommand.prototype.sort = function (list) {
        this.options.analyticsModel.getPages().sort(function (a, b) {
            var aIndex = list.indexOf(a.id);
            var bIndex = list.indexOf(b.id);
            return aIndex - bIndex;
        })
    };

    SortPageCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.sortpagecommand';
    };

    SortPageCommand.prototype.getLabel = function () {
        return 'Change page index';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SortPageCommand = SortPageCommand;

}).call(this);