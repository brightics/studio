/* -----------------------------------------------------
 *  update-operation-command.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-27.
 * ---------------------------------------------------- */

(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;
    var ObjectUtils = root.__module__.ObjectUtils;

    /**
     * options : {
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function UpdateOperationCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    UpdateOperationCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UpdateOperationCommand.prototype.constructor = UpdateOperationCommand;

    UpdateOperationCommand.prototype.canUndo = function () {
        return true;
    };

    UpdateOperationCommand.prototype.canRedo = function () {
        return true;
    };

    UpdateOperationCommand.prototype.execute = function () {
        this.setValue(this.options.path, this.options.value, true);
    };

    UpdateOperationCommand.prototype.undo = function () {
        this.setValue(this.options.path, this.old, false);
    };

    UpdateOperationCommand.prototype.redo = function () {
        this.execute();
    };

    UpdateOperationCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.updateoperationcommand';
    };

    UpdateOperationCommand.prototype.getLabel = function () {
        return this.options.label;
    };

    // UpdateOperationCommand.prototype.copy = function (newValue) {
    //     return _.clone(newValue);
    //     // if (newValue.constructor == Array) return $.extend(true, [], newValue);
    //     // else if (newValue.constructor == Object) return $.extend(true, {}, newValue);
    //     // return newValue;
    // };

    UpdateOperationCommand.prototype.setValue = function (path, newValue, setOld) {
        var fn = this.options.fnUnit || this.options.target;
        if (setOld) this.old = ObjectUtils.updateProp(fn, path, newValue);
        else ObjectUtils.updateProp(fn, path, newValue);
        // var idx = -1;
        // var len = path.length;
        // while (++idx < len - 1) {
        //     fn = fn[path[idx]];
        // }
        // if (setOld) this.old = this.copy(fn[path[path.length - 1]]);
        // fn[path[path.length - 1]] = this.copy(newValue);
    };

    Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand = UpdateOperationCommand;
/* eslint-disable no-invalid-this */
}.call(this));

