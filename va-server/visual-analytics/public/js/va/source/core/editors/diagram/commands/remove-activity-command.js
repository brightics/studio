/* -----------------------------------------------------
 *  remove-activity-command.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-27.
 * ---------------------------------------------------- */

(function () {
    'use strict';
    var Brightics = this.Brightics;
    function RemoveActivityCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemoveActivityCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveActivityCommand.prototype.constructor = RemoveActivityCommand;

    RemoveActivityCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveActivityCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveActivityCommand.prototype.execute = function () {
        // this.old = this.options.mainModel.getInnerModel(this.options.mid);
        this.old = this.options.mainModel.removeInnerModelRecursion(this.options.mid);
    };

    RemoveActivityCommand.prototype.undo = function () {
        // this.options.mainModel.addInnerModel(this.old);
        _.forEach(this.old, _.bind(this.options.mainModel.addInnerModel, this.options.mainModel));
    };

    RemoveActivityCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveActivityCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.removeactivitycommand';
    };

    RemoveActivityCommand.prototype.getLabel = function () {
        return 'New Activity Command';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RemoveActivityCommand = RemoveActivityCommand;
/* eslint-disable no-invalid-this */
}.call(this));
