/* -----------------------------------------------------
 *  remove-operation-command.js
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
    function RemoveOperationCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    RemoveOperationCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    RemoveOperationCommand.prototype.constructor = RemoveOperationCommand;

    RemoveOperationCommand.prototype.canUndo = function () {
        return true;
    };

    RemoveOperationCommand.prototype.canRedo = function () {
        return true;
    };

    RemoveOperationCommand.prototype.execute = function () {
        this.removeValue(this.options.path);
    };

    RemoveOperationCommand.prototype.undo = function () {
        this.setValue(this.options.path, this.old);
    };

    RemoveOperationCommand.prototype.redo = function () {
        this.execute();
    };

    RemoveOperationCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.removeoperationcommand';
    };

    RemoveOperationCommand.prototype.getLabel = function () {
        return this.options.label;
    };

    RemoveOperationCommand.prototype.copy = function (newValue) {
        return _.clone(newValue);
        // if (newValue.constructor == Array) return $.extend(true, [], newValue);
        // else if (newValue.constructor == Object) return $.extend(true, {}, newValue);
        // return newValue;
    };

    RemoveOperationCommand.prototype.setValue = function (path, newValue) {
        var fn = this.options.fnUnit || this.options.target;
        ObjectUtils.addProp(fn, path, newValue);
        // var idx = -1;
        // var len = path.length;
        // while (++idx < len - 1) {
        //     fn = fn[path[idx]];
        // }
        // fn[path[path.length - 1]] = this.copy(this.old);
    };

    RemoveOperationCommand.prototype.removeValue = function (path) {
        var fn = this.options.fnUnit || this.options.target;
        this.old = ObjectUtils.removeProp(fn, path);
        // var idx = -1;
        // var len = path.length;
        // while (++idx < len - 1) {
        //     fn = fn[path[idx]];
        // }
        // this.old = this.copy(fn[path[path.length - 1]]);
        // if (fn instanceof Array) {
        //     console.log(fn);
        //     fn.splice(path[path.length - 1], 1);
        //     console.log(fn, path);
        // } else {
        //     delete fn[path[path.length - 1]];
        // }
    };

    Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand = RemoveOperationCommand;
/* eslint-disable no-invalid-this */
}.call(this));
