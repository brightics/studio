/* -----------------------------------------------------
 *  new-activity-command.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-27.
 * ---------------------------------------------------- */

(function () {
    'use strict';
    var Brightics = this.Brightics;
    function NewActivityCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    NewActivityCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewActivityCommand.prototype.constructor = NewActivityCommand;

    NewActivityCommand.prototype.canUndo = function () {
        return true;
    };

    NewActivityCommand.prototype.canRedo = function () {
        return true;
    };

    NewActivityCommand.prototype.execute = function () {
        var _this = this;
        var contents = (function (contents) {
            if (contents) {
                // Deep clone 필요?
                return Brightics.VA.Core.Utils.ModelUtils
                    .extendInnerModel(_this.getMainModel(), contents, true);
            }
            return Brightics.VA.Core.Utils.ModelUtils
                .extendInnerModel(_this.getMainModel(),
                    Brightics.VA.Core.Utils.ModelUtils.getDefaultModelContents(), true);
        }(this.options.contents));

        contents.mid = this.options.mid;
        // if (this.options.type === 'if') {
        //     contents['sub-type'] = 'if';
        //     contents['condition-type'] = this.options.conditionType;
        // } else if (this.options.type === 'loop') {
        //     contents['sub-type'] = 'loop';
        // }
        this.options.mainModel.addInnerModel(contents);
    };

    NewActivityCommand.prototype.undo = function () {
        this.options.mainModel.removeInnerModelRecursion(this.options.mid);
    };

    NewActivityCommand.prototype.redo = function () {
        this.execute();
    };

    NewActivityCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.newactivitycommand';
    };

    NewActivityCommand.prototype.getLabel = function () {
        return 'New Activity Command';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.NewActivityCommand = NewActivityCommand;
/* eslint-disable no-invalid-this */
}.call(this));
